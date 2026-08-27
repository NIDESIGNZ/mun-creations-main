import { backendDB } from "./lib/backend-api";
import { aiTryOnService } from "./services/aiTryOnService";
import { razorpayService } from "./services/razorpayService";

// API router for backend REST endpoints
async function handleApiRequests(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (!path.startsWith("/api/")) return null;

  const headers = {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "Content-Type, Authorization",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  try {
    if (path === "/api/health") {
      const dbStatus = backendDB.getHealthStatus();
      return new Response(
        JSON.stringify({
          service: "Mun Creations API",
          ...dbStatus,
          status: "ok",
          timestamp: new Date().toISOString(),
        }),
        { headers }
      );
    }

    if (path === "/api/create-order" || path === "/api/payments/razorpay/create-order") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), {
          status: 405,
          headers,
        });
      }

      const body = await request.json();
      const { items, promoCode, shippingMethod, currency = "INR", receipt, notes, amount } = body || {};

      try {
        const order = await razorpayService.createOrder({
          items,
          promoCode,
          shippingMethod,
          currency,
          receipt,
          notes,
          amount,
        });

        return new Response(
          JSON.stringify({
            order_id: order.order_id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            key_id: process.env.RAZORPAY_KEY_ID,
            calculation: order.calculation,
          }),
          { status: 200, headers }
        );
      } catch (err: any) {
        const statusCode = err?.status || (err?.statusCode === 401 ? 401 : 500);
        return new Response(
          JSON.stringify({
            success: false,
            error: err?.message || "Failed to create Razorpay order",
          }),
          { status: statusCode, headers }
        );
      }
    }

    if (path === "/api/verify-payment" || path === "/api/payments/razorpay/verify") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), {
          status: 405,
          headers,
        });
      }

      const body = await request.json();
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = body || {};

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Missing required fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.",
          }),
          { status: 400, headers }
        );
      }

      const verification = razorpayService.verifyPaymentSignature({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      if (!verification.isValid) {
        return new Response(
          JSON.stringify({
            success: false,
            error: verification.error || "Payment signature verification failed. Transaction cannot be confirmed.",
          }),
          { status: 400, headers }
        );
      }

      // Idempotency: If order with this payment ID already exists in DB, return it without duplicate stock deduction
      let confirmedOrder = backendDB.getOrderByPaymentId(razorpay_payment_id);
      if (!confirmedOrder && orderDetails) {
        confirmedOrder = backendDB.createOrder({
          ...orderDetails,
          paymentMethod: "razorpay",
          paymentId: razorpay_payment_id,
          status: "Confirmed",
        });
      } else if (confirmedOrder && confirmedOrder.status !== "Paid" && confirmedOrder.status !== "Confirmed") {
        confirmedOrder = backendDB.updateOrderStatus(confirmedOrder.id, "Confirmed");
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Payment signature verified successfully.",
          razorpay_order_id,
          razorpay_payment_id,
          order: confirmedOrder,
        }),
        { status: 200, headers }
      );
    }

    if (path === "/api/webhooks/razorpay") {
      if (request.method === "GET") {
        return new Response(
          JSON.stringify({
            status: "ok",
            message: "Razorpay Webhook endpoint is active. POST requests with x-razorpay-signature header are required.",
          }),
          { status: 200, headers }
        );
      }

      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), {
          status: 405,
          headers,
        });
      }

      const rawBody = await request.text();
      const signature = request.headers.get("x-razorpay-signature") || "";

      // Signature verification
      const verification = razorpayService.verifyWebhookSignature(rawBody, signature);
      if (!verification.isValid) {
        return new Response(
          JSON.stringify({ success: false, error: verification.error || "Invalid webhook signature." }),
          { status: 400, headers }
        );
      }

      try {
        const event = JSON.parse(rawBody);
        const eventId = event?.id || `${event?.event}_${event?.created_at}`;

        // Idempotency check: Ignore duplicate webhook deliveries
        if (razorpayService.isEventProcessed(eventId)) {
          return new Response(JSON.stringify({ status: "already_processed", eventId }), {
            status: 200,
            headers,
          });
        }

        const eventType = event?.event;
        const payload = event?.payload;

        if (eventType === "payment.captured" || eventType === "order.paid") {
          const paymentEntity = payload?.payment?.entity;
          const paymentId = paymentEntity?.id;
          const orderId = paymentEntity?.order_id || payload?.order?.entity?.id;

          if (paymentId) {
            const existingOrder = backendDB.getOrderByPaymentId(paymentId);
            if (existingOrder) {
              backendDB.updateOrderStatus(existingOrder.id, "Paid");
            }
          }
        } else if (eventType === "payment.failed") {
          const paymentEntity = payload?.payment?.entity;
          const paymentId = paymentEntity?.id;
          if (paymentId) {
            const existingOrder = backendDB.getOrderByPaymentId(paymentId);
            if (existingOrder) {
              backendDB.updateOrderStatus(existingOrder.id, "Failed");
            }
          }
        } else if (eventType === "refund.processed" || eventType === "refund.created") {
          const refundEntity = payload?.refund?.entity;
          const paymentId = refundEntity?.payment_id;
          if (paymentId) {
            const existingOrder = backendDB.getOrderByPaymentId(paymentId);
            if (existingOrder) {
              backendDB.updateOrderStatus(existingOrder.id, "Refunded");
            }
          }
        }

        razorpayService.markEventProcessed(eventId);

        return new Response(JSON.stringify({ status: "ok", receivedEvent: eventType }), {
          status: 200,
          headers,
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, error: "Failed to process webhook event." }), {
          status: 500,
          headers,
        });
      }
    }

    if (path === "/api/refund-order") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), {
          status: 405,
          headers,
        });
      }

      const body = await request.json();
      const { paymentId, amount, reason, orderId } = body || {};

      if (!paymentId) {
        return new Response(
          JSON.stringify({ success: false, error: "Payment ID is required to issue a refund." }),
          { status: 400, headers }
        );
      }

      try {
        const refund = await razorpayService.refundPayment(paymentId, amount ? Math.round(amount) : undefined, {
          reason: reason || "Customer request / return",
        });

        if (orderId) {
          backendDB.updateOrderStatus(orderId, "Refunded");
        } else {
          const order = backendDB.getOrderByPaymentId(paymentId);
          if (order) {
            backendDB.updateOrderStatus(order.id, "Refunded");
          }
        }

        return new Response(
          JSON.stringify({ success: true, message: "Refund initiated successfully.", refund }),
          { status: 200, headers }
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({ success: false, error: err?.message || "Failed to process refund." }),
          { status: err?.status || 500, headers }
        );
      }
    }


    if (path === "/api/products") {
      if (request.method === "GET") {
        const cat = url.searchParams.get("category") || undefined;
        const q = url.searchParams.get("q") || undefined;
        const products = backendDB.getProducts({ category: cat, search: q });
        return new Response(JSON.stringify(products), { headers });
      }

      if (request.method === "POST") {
        const body = await request.json();
        const created = backendDB.addProduct(body);
        return new Response(JSON.stringify(created), { status: 201, headers });
      }
    }

    if (path === "/api/sources") {
      if (request.method === "GET") {
        return new Response(JSON.stringify(backendDB.getSources()), { headers });
      }
      if (request.method === "POST") {
        const body = await request.json();
        const created = backendDB.addSource(body);
        return new Response(JSON.stringify(created), { status: 201, headers });
      }
    }

    if (path === "/api/orders") {
      if (request.method === "GET") {
        return new Response(JSON.stringify(backendDB.getOrders()), { headers });
      }
      if (request.method === "POST") {
        const body = await request.json();
        const created = backendDB.createOrder(body);
        return new Response(JSON.stringify(created), { status: 201, headers });
      }
    }

    if (path.startsWith("/api/ai-try-on")) {
      if (request.method === "POST") {
        const body = await request.json();
        if (!body.userImage) {
          return new Response(
            JSON.stringify({ success: false, error: "Please provide a valid user photograph." }),
            { status: 400, headers }
          );
        }
        if (!body.product || !body.product.productId) {
          return new Response(
            JSON.stringify({ success: false, error: "Missing product details for virtual try-on." }),
            { status: 400, headers }
          );
        }

        const result = await aiTryOnService.runTryOn(body);
        return new Response(JSON.stringify(result), { status: 200, headers });
      }

      if (request.method === "GET") {
        const id = url.searchParams.get("id") || path.split("/").pop();
        if (!id || id === "ai-try-on") {
          return new Response(
            JSON.stringify({ error: "Missing try-on request ID" }),
            { status: 400, headers }
          );
        }
        const status = await aiTryOnService.getStatus(id);
        if (!status) {
          return new Response(
            JSON.stringify({ error: "Try-on session not found or expired" }),
            { status: 404, headers }
          );
        }
        return new Response(JSON.stringify(status), { headers });
      }

      if (request.method === "DELETE") {
        const id = url.searchParams.get("id") || path.split("/").pop();
        if (id && id !== "ai-try-on") {
          aiTryOnService.delete(id);
        }
        return new Response(JSON.stringify({ success: true }), { headers });
      }
    }

    return new Response(JSON.stringify({ error: "Endpoint not found" }), {
      status: 404,
      headers,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Internal server error" }), {
      status: 500,
      headers,
    });
  }
}

export default {
  async fetch(request: Request) {
    try {
      const apiResponse = await handleApiRequests(request);
      if (apiResponse) return apiResponse;

      return new Response(JSON.stringify({ error: "Endpoint not found" }), {
        status: 404,
        headers: { "content-type": "application/json" },
      });
    } catch (error: any) {
      console.error("API error:", error);
      return new Response(JSON.stringify({ error: error?.message || "Internal server error" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
  },
};
