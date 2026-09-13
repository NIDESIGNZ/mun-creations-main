import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { CartProvider, useCart } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  Truck,
  ArrowRight,
  ShoppingBag,
  Tag,
  Printer,
  ChevronRight,
  AlertCircle,
  Smartphone,
  CreditCard,
  Building,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout — Mun Creations" },
      {
        name: "description",
        content:
          "Secure checkout for your Mun Creations handcrafted sarees and couture with Razorpay standard checkout.",
      },
    ],
    scripts: [
      {
        src: "https://checkout.razorpay.com/v1/checkout.js",
        async: true,
      },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20">
            <CheckoutContent />
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </I18nProvider>
  );
}

function CheckoutContent() {
  const { items, subtotalUsd, clearCart } = useCart();
  const { currency, formatPrice } = useI18n();

  // Screen State
  const [step, setStep] = useState<"checkout" | "success">("checkout");

  // Shipping Form State (Empty by default - no demo/fake customer data)
  const [shippingForm, setShippingForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });
  const [shippingError, setShippingError] = useState<string>("");

  // Promo Code State
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  // Payment Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string>("");
  const [paymentStatusMessage, setPaymentStatusMessage] = useState<string>("");
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Price Computations: Free shipping if subtotal >= $500 or subtotal in INR >= ₹40,000
  const isFreeShipping = subtotalUsd >= 500 || (currency === "INR" && subtotalUsd * 83.5 >= 40000);
  const shippingFeeUsd = isFreeShipping ? 0 : 25;
  const finalTotalUsd = Math.max(0, subtotalUsd - appliedDiscount + shippingFeeUsd);

  // Promo Engine
  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    const clean = promoCode.trim().toUpperCase();
    if (!clean) {
      setPromoError("Please enter a promo code.");
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.product.id, quantity: i.qty })),
          promoCode: clean,
          shippingMethod: "standard",
        }),
      });
      const data = await res.json();
      if (data.success && data.cart && data.cart.discount > 0) {
        setAppliedDiscount(data.cart.discount);
        setPromoSuccess(data.cart.couponMessage || `Promo code applied: $${data.cart.discount} discount`);
      } else {
        setAppliedDiscount(0);
        setPromoError(data.cart?.couponMessage || data.error || "Invalid promo code. Try 'MUNHERITAGE10' or 'ROYAL50'.");
      }
    } catch {
      if (clean === "MUNHERITAGE10") {
        const discount = Math.round(subtotalUsd * 0.1);
        setAppliedDiscount(discount);
        setPromoSuccess("10% Heritage discount applied successfully!");
      } else if (clean === "ROYAL50") {
        setAppliedDiscount(50);
        setPromoSuccess("$50 Royal Voucher applied successfully!");
      } else {
        setAppliedDiscount(0);
        setPromoError("Invalid promo code. Try 'MUNHERITAGE10' or 'ROYAL50'.");
      }
    }
  };

  // Helper to load Razorpay Standard Checkout SDK
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        resolve(false);
        return;
      }
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
      );
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(true));
        existingScript.addEventListener("error", () => resolve(false));
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Primary Payment Action: Validate Form -> Create Server Order -> Open Razorpay Checkout -> Verify Signature
  const handlePayWithRazorpay = async (e: React.FormEvent) => {
    e.preventDefault();
    setShippingError("");
    setPaymentError("");

    // 1. Client-side Form Validation
    if (!shippingForm.firstName.trim()) {
      setShippingError("Please enter your first name.");
      return;
    }
    if (!shippingForm.lastName.trim()) {
      setShippingError("Please enter your last name.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!shippingForm.email.trim() || !emailRegex.test(shippingForm.email.trim())) {
      setShippingError("Please enter a valid email address.");
      return;
    }
    if (!shippingForm.phone.trim() || shippingForm.phone.trim().length < 8) {
      setShippingError("Please enter a valid contact phone number.");
      return;
    }
    if (!shippingForm.address.trim()) {
      setShippingError("Please enter your street address.");
      return;
    }
    if (!shippingForm.city.trim()) {
      setShippingError("Please enter your city.");
      return;
    }
    if (!shippingForm.state.trim()) {
      setShippingError("Please enter your state / province.");
      return;
    }
    if (!shippingForm.zip.trim()) {
      setShippingError("Please enter your postal / PIN code.");
      return;
    }
    const isIndia =
      !shippingForm.country ||
      shippingForm.country.trim().toLowerCase() === "india" ||
      shippingForm.country.trim().toLowerCase() === "in";
    if (isIndia && !/^[1-9][0-9]{5}$/.test(shippingForm.zip.trim())) {
      setShippingError("Please enter a valid 6-digit Indian PIN code (e.g. 700001).");
      return;
    }
    if (!shippingForm.country.trim()) {
      setShippingError("Please select your country.");
      return;
    }

    // 2. Start Secure Payment Flow
    setIsProcessing(true);
    setPaymentStatusMessage("Connecting to Razorpay Secure Gateway...");

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded || !(window as any).Razorpay) {
        throw new Error(
          "Unable to load Razorpay Checkout SDK. Please check your internet connection and try again.",
        );
      }

      setPaymentStatusMessage("Creating verified order token on server...");

      // STEP 1: Call Backend to authoritatively create Razorpay Order
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.qty,
          })),
          promoCode: promoCode ? promoCode.trim() : undefined,
          shippingMethod: "standard",
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
          notes: {
            customer_name: `${shippingForm.firstName} ${shippingForm.lastName}`,
            customer_email: shippingForm.email,
            shipping_pincode: shippingForm.zip,
          },
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.order_id) {
        throw new Error(orderData.error || "Failed to initialize Razorpay order on the server.");
      }

      const activeKeyId = orderData.key_id;
      if (!activeKeyId) {
        throw new Error("Razorpay Key ID is not configured on the server.");
      }

      setPaymentStatusMessage("Opening secure payment window...");

      // STEP 2: Open Razorpay Standard Checkout Modal
      const options = {
        key: activeKeyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Mun Creations",
        description: "Luxury Handloom Saree Order",
        image: typeof window !== "undefined" ? `${window.location.origin}/logo.png` : "/logo.png",
        order_id: orderData.order_id,
        prefill: {
          name: `${shippingForm.firstName} ${shippingForm.lastName}`,
          email: shippingForm.email,
          contact: shippingForm.phone,
        },
        notes: {
          shipping_address: `${shippingForm.address}, ${shippingForm.city}, ${shippingForm.state} ${shippingForm.zip}, ${shippingForm.country}`,
        },
        theme: {
          color: "#58111A",
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          // STEP 3: Call Backend to verify HMAC-SHA256 signature and update inventory
          try {
            setIsProcessing(true);
            setPaymentError("");
            setPaymentStatusMessage("Verifying payment signature with bank server...");

            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDetails: {
                  customerName: `${shippingForm.firstName} ${shippingForm.lastName}`,
                  email: shippingForm.email,
                  phone: shippingForm.phone,
                  shippingAddress: `${shippingForm.address}, ${shippingForm.city}, ${shippingForm.state} ${shippingForm.zip}, ${shippingForm.country}`,
                  pincode: shippingForm.zip,
                  items: items.map((i) => ({
                    productId: i.product.id,
                    productName: i.product.name,
                    quantity: i.qty,
                    priceUsd: i.product.priceUsd,
                  })),
                  subtotalUsd: finalTotalUsd,
                  shippingMethod: "standard",
                  shippingCostUsd: shippingFeeUsd,
                },
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(
                verifyData.error ||
                  "Payment signature verification failed. Transaction was not confirmed.",
              );
            }

            setPaymentStatusMessage("Payment confirmed! Preparing your receipt...");

            // Successfully verified and created in DB
            setCompletedOrder(
              verifyData.order || {
                id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                customerName: `${shippingForm.firstName} ${shippingForm.lastName}`,
                email: shippingForm.email,
                phone: shippingForm.phone,
                shippingAddress: `${shippingForm.address}, ${shippingForm.city}, ${shippingForm.state} ${shippingForm.zip}, ${shippingForm.country}`,
                pincode: shippingForm.zip,
                items: items.map((i) => ({
                  productId: i.product.id,
                  productName: i.product.name,
                  quantity: i.qty,
                  priceUsd: i.product.priceUsd,
                })),
                subtotalUsd: finalTotalUsd,
                status: "Confirmed",
                paymentMethod: "razorpay",
                paymentId: response.razorpay_payment_id,
                createdAt: new Date().toISOString(),
              },
            );

            clearCart();
            setIsProcessing(false);
            setStep("success");
            if (typeof window !== "undefined") {
              window.scrollTo({ top: 150, behavior: "smooth" });
            }
          } catch (verifyErr: any) {
            setIsProcessing(false);
            setPaymentStatusMessage("");
            setPaymentError(
              verifyErr?.message ||
                "Payment verification failed. Please contact customer support if money was debited.",
            );
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setPaymentStatusMessage("");
            setPaymentError(
              "Payment was not completed. Your cart has been saved so you can retry whenever you're ready.",
            );
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        setIsProcessing(false);
        setPaymentStatusMessage("");
        const reason =
          response.error?.description ||
          response.error?.reason ||
          "Transaction was declined or failed.";
        setPaymentError(`Payment was not completed: ${reason}`);
      });

      rzp.open();
    } catch (err: any) {
      setIsProcessing(false);
      setPaymentStatusMessage("");
      setPaymentError(err?.message || "Failed to initialize Razorpay checkout. Please try again.");
    }
  };

  // Empty Cart Guard
  if (items.length === 0 && step !== "success") {
    return (
      <div className="container-boutique max-w-md mx-auto py-16 text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-[var(--wine)]/10 text-[var(--wine)] flex items-center justify-center mx-auto border border-[var(--wine)]/20">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[var(--wine-deep)]">
          Your Cart is Empty
        </h2>
        <p className="text-xs text-muted-foreground">
          Explore our handcrafted sarees, kurtis, and bridal collections to start your checkout.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[var(--wine)] text-white px-6 py-3 text-xs uppercase tracking-wider font-bold rounded-sm hover:bg-[var(--wine-deep)] transition-colors shadow-md"
        >
          <span>Explore Saree Collections</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  // ORDER SUCCESS & RECEIPT SCREEN
  if (step === "success" && completedOrder) {
    return (
      <div className="container-boutique max-w-2xl mx-auto space-y-6 animate-in fade-in">
        <div className="bg-white rounded-sm border border-border shadow-2xl overflow-hidden p-8 space-y-6 text-center">
          <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <div className="eyebrow text-emerald-700 font-bold">
              Payment Verified & Order Confirmed
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--wine-deep)]">
              Thank You For Your Order!
            </h1>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Your handwoven ensemble is being prepared by our master weaver artisans. A
              confirmation email has been sent to{" "}
              <strong className="text-foreground">{completedOrder.email}</strong>.
            </p>
          </div>

          {/* Printable Invoice Box */}
          <div className="p-6 bg-secondary/30 rounded-sm border border-border text-left space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Order Reference
                </div>
                <div className="font-mono font-bold text-base text-[var(--wine-deep)]">
                  {completedOrder.id}
                </div>
              </div>
              <div className="sm:text-right">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Payment Gateway
                </div>
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Verified (RAZORPAY)</span>
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-foreground">Purchased Items</div>
              <ul className="divide-y divide-border/60">
                {completedOrder.items.map((it: any, idx: number) => (
                  <li key={idx} className="py-2 flex justify-between items-center">
                    <div>
                      <div className="font-serif font-bold text-xs">{it.productName}</div>
                      <div className="text-[10px] text-muted-foreground">Qty: {it.quantity}</div>
                    </div>
                    <div className="font-bold">{formatPrice(it.priceUsd * it.quantity)}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-center font-bold text-sm">
              <span>Total Paid</span>
              <span className="text-[var(--wine-deep)] font-serif text-lg">
                {formatPrice(completedOrder.subtotalUsd)}
              </span>
            </div>

            <div className="pt-2 text-[11px] text-muted-foreground space-y-1">
              <div>
                Shipping Address:{" "}
                <span className="text-foreground font-medium">
                  {completedOrder.shippingAddress}
                </span>
              </div>
              <div>
                Delivery Timeline:{" "}
                <span className="text-foreground font-medium">
                  3–5 Business Days (Insured Handloom Air Dispatch)
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-secondary text-foreground text-xs uppercase tracking-wider px-5 py-3 rounded-sm font-bold border border-border hover:bg-border transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Print Order Receipt</span>
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[var(--wine)] text-white text-xs uppercase tracking-wider px-6 py-3 rounded-sm font-bold hover:bg-[var(--wine-deep)] transition-colors shadow-md"
            >
              <span>Return to Storefront</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // MAIN CHECKOUT SCREEN
  return (
    <div className="container-boutique space-y-8">
      {/* Steps Header */}
      <div className="bg-white p-4 rounded-sm border border-border shadow-xs flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
        <div className="flex items-center gap-2 text-[var(--wine)] font-bold">
          <span className="h-6 w-6 rounded-full bg-[var(--wine)] text-white text-[11px] flex items-center justify-center font-mono">
            1
          </span>
          <span>Delivery Details</span>
        </div>

        <ChevronRight className="h-4 w-4 text-muted-foreground" />

        <div className="flex items-center gap-2 text-[var(--wine)] font-bold">
          <span className="h-6 w-6 rounded-full bg-[var(--wine)] text-white text-[11px] flex items-center justify-center font-mono">
            2
          </span>
          <span>Pay Securely with Razorpay</span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery Details & Razorpay Checkout Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handlePayWithRazorpay} className="space-y-6">
            {/* Customer Information Card */}
            <div className="bg-white p-6 md:p-8 rounded-sm border border-border shadow-xs space-y-5">
              <div className="border-b border-border pb-3">
                <h2 className="font-serif text-xl font-bold text-[var(--wine-deep)]">
                  1. Delivery Address & Contact
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Enter your delivery address to proceed with secure payment.
                </p>
              </div>

              {shippingError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{shippingError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingForm.firstName}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, firstName: e.target.value })
                    }
                    placeholder="e.g. Ananya"
                    className="w-full p-2.5 bg-secondary/10 border border-border rounded-sm text-xs focus:outline-none focus:border-[var(--wine)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingForm.lastName}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, lastName: e.target.value })
                    }
                    placeholder="e.g. Mukherjee"
                    className="w-full p-2.5 bg-secondary/10 border border-border rounded-sm text-xs focus:outline-none focus:border-[var(--wine)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Email Address (for order receipt) *
                  </label>
                  <input
                    type="email"
                    required
                    value={shippingForm.email}
                    onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                    placeholder="e.g. ananya@example.com"
                    className="w-full p-2.5 bg-secondary/10 border border-border rounded-sm text-xs focus:outline-none focus:border-[var(--wine)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Phone Number (for courier updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={shippingForm.phone}
                    onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full p-2.5 bg-secondary/10 border border-border rounded-sm text-xs focus:outline-none focus:border-[var(--wine)]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={shippingForm.address}
                  onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                  placeholder="Apartment, building, suite, and street"
                  className="w-full p-2.5 bg-secondary/10 border border-border rounded-sm text-xs focus:outline-none focus:border-[var(--wine)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={shippingForm.city}
                    onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                    placeholder="e.g. Kolkata"
                    className="w-full p-2.5 bg-secondary/10 border border-border rounded-sm text-xs focus:outline-none focus:border-[var(--wine)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingForm.state}
                    onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                    placeholder="e.g. West Bengal"
                    className="w-full p-2.5 bg-secondary/10 border border-border rounded-sm text-xs focus:outline-none focus:border-[var(--wine)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    PIN / Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={shippingForm.zip}
                    onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })}
                    placeholder="e.g. 700001"
                    className="w-full p-2.5 bg-secondary/10 border border-border rounded-sm text-xs font-mono focus:outline-none focus:border-[var(--wine)]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Country *</label>
                <select
                  value={shippingForm.country}
                  onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value })}
                  className="w-full p-2.5 bg-secondary/10 border border-border rounded-sm text-xs focus:outline-none focus:border-[var(--wine)]"
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Netherlands">Netherlands</option>
                </select>
              </div>
            </div>

            {/* Payment Method Card: Razorpay Only */}
            <div className="bg-white p-6 md:p-8 rounded-sm border border-border shadow-xs space-y-5">
              <div className="border-b border-border pb-3 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[var(--wine-deep)]">
                    2. Payment Method
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Fast, secure, and encrypted checkout via Razorpay.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-sm text-[11px] font-semibold">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
              </div>

              {paymentError && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">{paymentError}</p>
                    <p className="text-[11px] text-red-600 mt-1">
                      You can verify your details above and click the payment button again to retry.
                    </p>
                  </div>
                </div>
              )}

              {/* Razorpay Gateway Display Box */}
              <div className="p-4 rounded-sm border-2 border-[var(--wine)] bg-[var(--wine)]/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-4 border-[var(--wine)] bg-white" />
                    <span className="font-bold text-xs uppercase tracking-wider text-[var(--wine-deep)]">
                      Razorpay Standard Checkout
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-white border border-border px-2 py-0.5 rounded text-muted-foreground">
                    All Payment Modes Accepted
                  </span>
                </div>

                <p className="text-xs text-muted-foreground pl-6">
                  Pay securely using any Indian or International payment method:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pl-6 pt-1">
                  <div className="p-2 bg-white rounded border border-border/80 text-center space-y-1">
                    <Smartphone className="h-4 w-4 mx-auto text-[var(--wine)]" />
                    <div className="text-[10px] font-bold">UPI</div>
                    <div className="text-[9px] text-muted-foreground">GPay, PhonePe, Paytm</div>
                  </div>
                  <div className="p-2 bg-white rounded border border-border/80 text-center space-y-1">
                    <CreditCard className="h-4 w-4 mx-auto text-[var(--wine)]" />
                    <div className="text-[10px] font-bold">Cards</div>
                    <div className="text-[9px] text-muted-foreground">Visa, Master, RuPay, Amex</div>
                  </div>
                  <div className="p-2 bg-white rounded border border-border/80 text-center space-y-1">
                    <Building className="h-4 w-4 mx-auto text-[var(--wine)]" />
                    <div className="text-[10px] font-bold">NetBanking</div>
                    <div className="text-[9px] text-muted-foreground">50+ Indian Banks</div>
                  </div>
                  <div className="p-2 bg-white rounded border border-border/80 text-center space-y-1">
                    <Lock className="h-4 w-4 mx-auto text-[var(--gold)]" />
                    <div className="text-[10px] font-bold">Wallets & EMI</div>
                    <div className="text-[9px] text-muted-foreground">Cred, Mobikwik & EMI</div>
                  </div>
                </div>
              </div>

              {/* Pay Now Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[var(--wine)] text-white py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-[var(--wine-deep)] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{paymentStatusMessage || "Processing Payment..."}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-[var(--gold)]" />
                    <span>Pay Securely with Razorpay — {formatPrice(finalTotalUsd)}</span>
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Authorized Razorpay Gateway</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-[var(--wine)]" />
                  <span>Insured Handloom Dispatch</span>
                </span>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-sm border border-border shadow-xs space-y-5 sticky top-28">
            <h2 className="font-serif text-lg font-bold text-[var(--wine-deep)] pb-3 border-b border-border">
              Order Summary ({items.length} {items.length === 1 ? "Item" : "Items"})
            </h2>

            {/* Cart Items List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-border/60">
              {items.map((item) => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <img
                    src={item.product.images?.[0] || item.product.image}
                    alt={item.product.name}
                    className="w-14 h-18 object-cover rounded-xs border border-border/60 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-xs truncate text-foreground">
                      {item.product.name}
                    </h3>
                    <div className="text-[10px] text-muted-foreground">
                      Qty: {item.qty} · {item.product.category}
                    </div>
                    <div className="text-xs font-bold text-[var(--wine-deep)] mt-0.5">
                      {formatPrice(item.product.priceUsd * item.qty)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Voucher Form */}
            <form onSubmit={handleApplyPromo} className="space-y-2 pt-3 border-t border-border">
              <label className="font-bold block text-xs flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-[var(--gold)]" />
                <span>Promo Code or Gift Voucher</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. MUNHERITAGE10 or ROYAL50"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 p-2 text-xs border border-border rounded-sm focus:outline-none focus:border-[var(--wine)] uppercase font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-secondary text-foreground text-xs font-bold rounded-sm border border-border hover:bg-border transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {promoSuccess && (
                <div className="text-[11px] text-emerald-700 font-semibold">{promoSuccess}</div>
              )}
              {promoError && (
                <div className="text-[11px] text-red-600 font-semibold">{promoError}</div>
              )}
            </form>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs pt-3 border-t border-border">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">{formatPrice(subtotalUsd)}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Promo Discount</span>
                  <span>-{formatPrice(appliedDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>Insured Handloom Air Dispatch</span>
                <span className="font-semibold text-foreground">
                  {isFreeShipping ? "FREE (Complimentary)" : formatPrice(shippingFeeUsd)}
                </span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Import Duties & Taxes</span>
                <span className="font-semibold text-emerald-700">Included ($0)</span>
              </div>

              <div className="flex justify-between items-center text-base font-bold pt-3 border-t border-border text-[var(--wine-deep)]">
                <span>Total Amount</span>
                <span className="font-serif text-xl">{formatPrice(finalTotalUsd)}</span>
              </div>
              {currency !== "USD" && (
                <div className="text-[10px] text-muted-foreground text-right">
                  Base USD: ${finalTotalUsd.toFixed(2)}
                </div>
              )}
            </div>

            {/* Mun Creations Heritage Assurances */}
            <div className="pt-4 border-t border-border space-y-2 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[var(--gold)] shrink-0" />
                <span>100% Certified Authentic Handloom Craftsmanship</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-3.5 w-3.5 text-[var(--wine)] shrink-0" />
                <span>7-Day Hassle-Free Returns & Exchanges</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Zero Storage of Card/Bank Credentials</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
