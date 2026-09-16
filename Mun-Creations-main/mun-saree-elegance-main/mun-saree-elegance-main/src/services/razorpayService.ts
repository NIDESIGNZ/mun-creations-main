import Razorpay from "razorpay";
import crypto from "crypto";
import { backendDB } from "../lib/backend-api";
import { ensureEnvLoaded } from "../lib/envLoader";

function getRazorpayInstance() {
  ensureEnvLoaded();
  const key_id = (process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "").trim();
  const key_secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

  if (!key_id || !key_secret) {
    throw new Error("Razorpay credentials (RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET) are missing.");
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
}

export interface AuthoritativeItemInput {
  productId: string;
  quantity: number;
}

export interface AuthoritativePriceCalculation {
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    priceUsd: number;
    priceInr: number;
  }>;
  subtotalUsd: number;
  subtotalInr: number;
  discountUsd: number;
  discountInr: number;
  shippingFeeUsd: number;
  shippingCostInr?: number;
  shippingProvider?: string;
  finalTotalUsd: number;
  finalTotalInr: number;
  amountPaise: number;
  currency: string;
}

export interface CreateOrderParams {
  amount?: number; // in paise (fallback or verified)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
  items?: AuthoritativeItemInput[];
  promoCode?: string;
  shippingMethod?: "standard" | "express";
  shippingCostInr?: number;
  shippingProvider?: string;
}

export interface CreateOrderResult {
  order_id: string;
  amount: number | string;
  currency: string;
  receipt?: string;
  calculation?: AuthoritativePriceCalculation;
}

export class RazorpayService {
  private processedWebhookEvents = new Set<string>();

  /**
   * Authoritative Server-Side Price Calculation
   * Never trust frontend prices, discounts, or totals.
   */
  calculateAuthoritativePrice(
    items: AuthoritativeItemInput[],
    promoCode?: string,
    shippingMethod: "standard" | "express" = "standard",
    currency: string = "INR",
    shippingCostInr?: number,
    shippingProvider?: string,
  ): AuthoritativePriceCalculation {
    if (!items || !Array.isArray(items) || items.length === 0) {
      const err: any = new Error("No cart items provided for order calculation.");
      err.status = 400;
      throw err;
    }

    const calculatedItems = items.map((item: any) => {
      const pId = item.productId || item.id;
      const qty =
        typeof item.quantity === "number"
          ? item.quantity
          : typeof item.qty === "number"
            ? item.qty
            : 1;
      if (!pId || typeof qty !== "number" || qty <= 0) {
        const err: any = new Error(`Invalid item quantity for product ID: ${pId}`);
        err.status = 400;
        throw err;
      }

      const product = backendDB.getProductById(pId);
      if (
        !product ||
        (product as any).deletedAt ||
        (product as any).archivedAt ||
        (product as any).published === false ||
        (product as any).active === false ||
        (product as any).status === "archived" ||
        (product as any).status === "draft"
      ) {
        const err: any = new Error(
          `Product "${product?.name || pId}" is no longer available in our active catalog. Please remove it from your bag to proceed.`,
        );
        err.status = 404;
        throw err;
      }

      if (
        product.availability === "Out of Stock" ||
        (product.stockQuantity !== undefined && product.stockQuantity < qty)
      ) {
        const err: any = new Error(
          `Product "${product.name}" does not have enough stock available.`,
        );
        err.status = 400;
        throw err;
      }

      const priceInr =
        typeof (product as any).priceInr === "number" && (product as any).priceInr > 0
          ? (product as any).priceInr
          : typeof (product as any).basePriceINR === "number" && (product as any).basePriceINR > 0
            ? (product as any).basePriceINR
            : typeof product.priceUsd === "number"
              ? Math.round(product.priceUsd * 83.5)
              : typeof (product as any).price === "number"
                ? (product as any).price >= 1000
                  ? (product as any).price
                  : Math.round((product as any).price * 83.5)
                : 0;

      const priceUsd =
        typeof product.priceUsd === "number" && product.priceUsd > 0
          ? product.priceUsd
          : Math.round((priceInr / 83.5) * 100) / 100;

      return {
        productId: product.id,
        productName: product.name,
        quantity: Math.floor(qty),
        priceUsd,
        priceInr,
      };
    });

    const subtotalInr = calculatedItems.reduce(
      (sum, item) => sum + item.priceInr * item.quantity,
      0,
    );
    const subtotalUsd = calculatedItems.reduce(
      (sum, item) => sum + item.priceUsd * item.quantity,
      0,
    );

    // Validate and calculate discount authoritatively via DB Coupon Engine
    let discountUsd = 0;
    let discountInr = 0;
    if (promoCode && typeof promoCode === "string" && promoCode.trim()) {
      const validation = backendDB.validateCoupon(promoCode, subtotalUsd);
      if (validation.valid) {
        discountUsd = validation.discountAmountUsd;
        discountInr = Math.round(discountUsd * 83.5);
      }
    }

    // Calculate authoritative shipping rules:
    // Free shipping if subtotalInr >= 40000 or subtotalUsd >= 500, else standard insured shipping (₹199 / $25)
    const isFreeShipping = subtotalInr >= 40000 || subtotalUsd >= 500;
    const shippingFeeUsd = isFreeShipping ? 0 : 25;
    const effectiveShippingInr = isFreeShipping ? 0 : 199;

    const finalTotalUsd = Math.max(0, subtotalUsd - discountUsd + shippingFeeUsd);
    const finalTotalInr = Math.max(0, subtotalInr - discountInr + effectiveShippingInr);

    // Authoritative amount in paise (1 INR = 100 Paise)
    const amountPaise = Math.max(100, Math.round(finalTotalInr * 100));

    return {
      items: calculatedItems,
      subtotalUsd,
      subtotalInr,
      discountUsd,
      discountInr,
      shippingFeeUsd,
      shippingCostInr: effectiveShippingInr,
      shippingProvider,
      finalTotalUsd,
      finalTotalInr,
      amountPaise,
      currency: "INR",
    };
  }

  /**
   * Create a Razorpay Order server-side
   * If items are provided, calculates authoritative amount from DB.
   * Minimum amount: 100 paise (₹1.00)
   */
  async createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
    const { items, promoCode, shippingMethod, shippingCostInr, shippingProvider, currency = "INR", receipt, notes } = params;

    let targetAmountPaise: number;
    let calculation: AuthoritativePriceCalculation | undefined;

    if (items && Array.isArray(items) && items.length > 0) {
      calculation = this.calculateAuthoritativePrice(
        items,
        promoCode,
        shippingMethod,
        currency,
        shippingCostInr,
        shippingProvider,
      );
      targetAmountPaise = calculation.amountPaise;
    } else if (typeof params.amount === "number" && !isNaN(params.amount)) {
      targetAmountPaise = Math.round(params.amount);
    } else {
      const err: any = new Error("Invalid request: items array or valid amount is required.");
      err.status = 400;
      throw err;
    }

    if (targetAmountPaise < 100) {
      const err: any = new Error("Amount must be at least 100 paise (₹1.00)");
      err.status = 400;
      throw err;
    }

    try {
      const instance = getRazorpayInstance();
      const generatedReceipt = receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      const order = await instance.orders.create({
        amount: targetAmountPaise,
        currency: currency.toUpperCase(),
        receipt: generatedReceipt,
        notes: {
          ...(notes || {}),
          ...(calculation
            ? {
                subtotal_usd: calculation.subtotalUsd.toString(),
                discount_usd: calculation.discountUsd.toString(),
                shipping_usd: calculation.shippingFeeUsd.toString(),
                final_usd: calculation.finalTotalUsd.toString(),
              }
            : {}),
        },
      });

      return {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt || generatedReceipt,
        calculation,
      };
    } catch (err: any) {
      if (
        err?.statusCode === 401 ||
        (err?.error?.code === "BAD_REQUEST_ERROR" &&
          err?.error?.description?.includes("authenticate"))
      ) {
        const authErr: any = new Error(
          "Razorpay authentication failed. Please check your credentials.",
        );
        authErr.status = 401;
        throw authErr;
      }

      if (err?.status) {
        throw err;
      }

      const apiErr: any = new Error(
        err?.error?.description || err?.message || "Failed to create Razorpay order",
      );
      apiErr.status = err?.statusCode || 500;
      throw apiErr;
    }
  }

  /**
   * Verify Razorpay Payment Signature
   * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
   */
  verifyPaymentSignature(params: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): { isValid: boolean; error?: string } {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return {
        isValid: false,
        error:
          "Missing required verification fields (razorpay_order_id, razorpay_payment_id, razorpay_signature)",
      };
    }

    ensureEnvLoaded();
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return {
        isValid: false,
        error: "Server configuration error: RAZORPAY_KEY_SECRET is not defined.",
      };
    }

    try {
      const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

      const expectedBuffer = Buffer.from(expectedSignature, "utf-8");
      const receivedBuffer = Buffer.from(razorpay_signature, "utf-8");

      if (expectedBuffer.length !== receivedBuffer.length) {
        return { isValid: false, error: "Payment signature mismatch" };
      }

      const isMatch = crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

      if (!isMatch) {
        return { isValid: false, error: "Payment signature mismatch" };
      }

      return { isValid: true };
    } catch (err: any) {
      return { isValid: false, error: err?.message || "Signature verification failed" };
    }
  }

  /**
   * Verify Razorpay Webhook Signature
   * Algorithm: HMAC-SHA256(rawBody, WEBHOOK_SECRET)
   */
  verifyWebhookSignature(
    rawBody: string,
    signature: string,
    webhookSecret?: string,
  ): { isValid: boolean; error?: string } {
    ensureEnvLoaded();
    const secret = webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      return {
        isValid: false,
        error: "RAZORPAY_WEBHOOK_SECRET is not configured on the server.",
      };
    }

    if (!rawBody || !signature) {
      return {
        isValid: false,
        error: "Missing webhook body or X-Razorpay-Signature header.",
      };
    }

    try {
      const expectedSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

      const expectedBuffer = Buffer.from(expectedSignature, "utf-8");
      const receivedBuffer = Buffer.from(signature, "utf-8");

      if (expectedBuffer.length !== receivedBuffer.length) {
        return { isValid: false, error: "Webhook signature mismatch." };
      }

      const isMatch = crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
      return { isValid: isMatch };
    } catch (err: any) {
      return { isValid: false, error: err?.message || "Webhook verification failed." };
    }
  }

  /**
   * Webhook Idempotency Store
   */
  isEventProcessed(eventId: string): boolean {
    return this.processedWebhookEvents.has(eventId);
  }

  markEventProcessed(eventId: string): void {
    this.processedWebhookEvents.add(eventId);
    // Keep memory bounded to last 10,000 events
    if (this.processedWebhookEvents.size > 10000) {
      const first = this.processedWebhookEvents.values().next().value;
      if (first) this.processedWebhookEvents.delete(first);
    }
  }

  /**
   * Issue Server-Side Refund
   */
  async refundPayment(
    paymentId: string,
    amountPaise?: number,
    notes?: Record<string, string>,
  ): Promise<any> {
    if (!paymentId) {
      throw new Error("Payment ID is required for processing refund.");
    }

    const instance = getRazorpayInstance();
    const refundPayload: any = { notes: notes || {} };
    if (amountPaise && amountPaise > 0) {
      refundPayload.amount = Math.round(amountPaise);
    }

    return await instance.payments.refund(paymentId, refundPayload);
  }
}

export const razorpayService = new RazorpayService();
