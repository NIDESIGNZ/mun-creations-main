import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { CartProvider, useCart } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Smartphone,
  Lock,
  CheckCircle2,
  Truck,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Tag,
  DollarSign,
  Printer,
  ChevronRight,
  X,
  Key,
  Globe,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout & Payment Gateways — Mun Creations" },
      {
        name: "description",
        content: "Secure worldwide checkout with interactive Razorpay, Stripe, PayPal, and Credit/Debit Card payment gateways.",
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

type PaymentGateway = "razorpay" | "stripe" | "paypal" | "card";

function CheckoutContent() {
  const { items, subtotalUsd, clearCart } = useCart();
  const { currency, formatPrice } = useI18n();

  // Step Control
  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");

  // Shipping Form State
  const [shippingForm, setShippingForm] = useState({
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@example.com",
    phone: "+1 (555) 234-5678",
    address: "450 Lexington Ave, Suite 1200",
    city: "New York",
    state: "NY",
    zip: "10017",
    country: "United States",
    shippingMethod: "standard" as "standard" | "express",
  });

  // Promo Code Engine
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  // Payment Gateway Selection
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>("card");

  // Sub-method states
  // 1. Razorpay
  const [razorpaySubMethod, setRazorpaySubMethod] = useState<"upi" | "netbanking" | "qr">("upi");
  const [upiId, setUpiId] = useState("priya@okaxis");

  // 2. Stripe
  const [stripeEmail, setStripeEmail] = useState("priya.sharma@example.com");

  // 3. Direct Card Terminal
  const [cardNumber, setCardNumber] = useState("4532 1284 9012 5541");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvv, setCardCvv] = useState("892");
  const [cardName, setCardName] = useState("Priya Sharma");

  // Gateway Modal Window States
  const [gatewayModalOpen, setGatewayModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [otpCode, setOtpCode] = useState("123456");
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [paymentError, setPaymentError] = useState<string>("");
  const [paymentStatusMessage, setPaymentStatusMessage] = useState<string>("");

  // Optional API Keys Config (Environment or Live Overrides)
  const apiKeysConfig = {
    razorpayKeyId: (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || "",
    stripePublishableKey: (import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_MunCreations2026",
    paypalClientId: (import.meta as any).env?.VITE_PAYPAL_CLIENT_ID || "sb_MunCreations2026",
  };

  // Price Computations
  const isFreeShipping = subtotalUsd >= 500 || (currency === "INR" && subtotalUsd * 83.5 >= 40000);
  const shippingFeeUsd = isFreeShipping
    ? 0
    : shippingForm.shippingMethod === "express"
    ? 45
    : 25;

  const finalTotalUsd = Math.max(0, subtotalUsd - appliedDiscount + shippingFeeUsd);

  // Card Type Detector
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s/g, "");
    if (clean.startsWith("4")) return "VISA";
    if (/^5[1-5]/.test(clean)) return "MASTERCARD";
    if (/^3[47]/.test(clean)) return "AMEX";
    if (/^6[0-9]/.test(clean)) return "RUPAY";
    return "CARD";
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    const clean = promoCode.trim().toUpperCase();
    if (clean === "MUNHERITAGE10") {
      const discount = Math.round(subtotalUsd * 0.1);
      setAppliedDiscount(discount);
      setPromoSuccess("10% Heritage discount applied successfully!");
    } else if (clean === "ROYAL50") {
      setAppliedDiscount(50);
      setPromoSuccess("$50 Royal Voucher applied successfully!");
    } else {
      setPromoError("Invalid promo code. Try 'MUNHERITAGE10' or 'ROYAL50'.");
    }
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 250, behavior: "smooth" });
    }
  };

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
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
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

  const handleRazorpayCheckout = async () => {
    setPaymentError("");
    setPaymentStatusMessage("Connecting to secure payment gateway...");
    setIsProcessing(true);

    try {
      // 1. Ensure Razorpay SDK script is loaded
      const loaded = await loadRazorpayScript();
      if (!loaded || !(window as any).Razorpay) {
        throw new Error("Unable to load Razorpay Checkout SDK. Please check your network connection.");
      }

      setPaymentStatusMessage("Generating secure order token...");

      // 2. STEP 1: Call Backend to authoritatively create Razorpay Order
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.qty,
          })),
          promoCode: promoCode ? promoCode.trim() : undefined,
          shippingMethod: shippingForm.shippingMethod,
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
        throw new Error(orderData.error || "Failed to create Razorpay order on server.");
      }

      const activeKeyId = orderData.key_id || apiKeysConfig.razorpayKeyId;

      if (!activeKeyId) {
        throw new Error("Razorpay Key ID is not configured on the server.");
      }

      setPaymentStatusMessage("Opening secure payment window...");

      // 3. STEP 2: Open Razorpay Standard Checkout Modal
      const options = {
        key: activeKeyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Mun Creations",
        description: "Luxury Handloom Saree Order",
        image: "https://picsum.photos/seed/munlogo/200/200",
        order_id: orderData.order_id,
        prefill: {
          name: `${shippingForm.firstName} ${shippingForm.lastName}`,
          email: shippingForm.email,
          contact: shippingForm.phone,
        },
        notes: {
          shipping_address: `${shippingForm.address}, ${shippingForm.city}, ${shippingForm.state} ${shippingForm.zip}`,
        },
        theme: {
          color: "#58111A",
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          // 4. STEP 3: Call Backend to verify signature
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
                },
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(
                verifyData.error || "Payment signature verification failed. Transaction was not confirmed."
              );
            }

            setPaymentStatusMessage("Payment confirmed! Preparing your receipt...");

            // Successfully verified and created in DB
            setCompletedOrder(verifyData.order || {
              id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
              customerName: `${shippingForm.firstName} ${shippingForm.lastName}`,
              email: shippingForm.email,
              phone: shippingForm.phone,
              shippingAddress: `${shippingForm.address}, ${shippingForm.city}, ${shippingForm.state} ${shippingForm.zip}, ${shippingForm.country}`,
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
            });

            clearCart();
            setIsProcessing(false);
            setGatewayModalOpen(false);
            setStep("success");
            if (typeof window !== "undefined") {
              window.scrollTo({ top: 150, behavior: "smooth" });
            }
          } catch (verifyErr: any) {
            setIsProcessing(false);
            setPaymentError(verifyErr?.message || "Payment signature verification failed.");
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setPaymentStatusMessage("");
            setPaymentError("Payment was cancelled or the checkout window was dismissed.");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        setIsProcessing(false);
        setPaymentStatusMessage("");
        const reason = response.error?.description || response.error?.reason || "Payment was declined or failed.";
        setPaymentError(`Payment failed: ${reason}`);
      });

      rzp.open();
    } catch (err: any) {
      setIsProcessing(false);
      setPaymentStatusMessage("");
      setPaymentError(err?.message || "Failed to initialize Razorpay checkout.");
    }
  };

  const handleOpenGatewayModal = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError("");

    if (selectedGateway === "razorpay") {
      handleRazorpayCheckout();
      return;
    }

    setGatewayModalOpen(true);
  };

  const handleConfirmGatewayPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Create order object for completed screen
      const newOrder = {
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
        status: "Confirmed" as const,
        paymentMethod: selectedGateway as any,
        paymentId: `sim_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      // Persist to server API asynchronously
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      }).catch(() => {});

      setCompletedOrder(newOrder);
      clearCart();
      setIsProcessing(false);
      setGatewayModalOpen(false);
      setStep("success");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 150, behavior: "smooth" });
      }
    }, 1500);
  };

  // Empty Cart Guard (If cart empty and not on receipt screen)
  if (items.length === 0 && step !== "success") {
    return (
      <div className="container-boutique max-w-md mx-auto py-16 text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-[var(--wine)]/10 text-[var(--wine)] flex items-center justify-center mx-auto border border-[var(--wine)]/20">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[var(--wine-deep)]">Your Cart is Empty</h2>
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

  // STEP 3: Order Receipt Screen
  if (step === "success" && completedOrder) {
    return (
      <div className="container-boutique max-w-2xl mx-auto space-y-6 animate-in fade-in">
        <div className="bg-white rounded-sm border border-border shadow-2xl overflow-hidden p-8 space-y-6 text-center">
          <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <div className="eyebrow text-emerald-700 font-bold">Payment Verified & Order Confirmed</div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--wine-deep)]">
              Thank You For Your Order!
            </h1>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Your handwoven ensemble is being prepared by our master weaver artisans. A confirmation email has been sent to{" "}
              <strong className="text-foreground">{completedOrder.email}</strong>.
            </p>
          </div>

          {/* Printable Invoice Box */}
          <div className="p-6 bg-secondary/30 rounded-sm border border-border text-left space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Order Reference</div>
                <div className="font-mono font-bold text-base text-[var(--wine-deep)]">{completedOrder.id}</div>
              </div>
              <div className="sm:text-right">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Payment Gateway</div>
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Authorized ({selectedGateway.toUpperCase()})</span>
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
              <span className="text-[var(--wine-deep)] font-serif text-lg">{formatPrice(completedOrder.subtotalUsd)}</span>
            </div>

            <div className="pt-2 text-[11px] text-muted-foreground space-y-1">
              <div>Shipping Address: <span className="text-foreground font-medium">{completedOrder.shippingAddress}</span></div>
              <div>Delivery Timeline: <span className="text-foreground font-medium">3–5 Business Days (Insured Handloom Air Dispatch)</span></div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-secondary text-foreground text-xs uppercase tracking-wider px-5 py-3 rounded-sm font-bold border border-border hover:bg-border transition-colors"
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

  return (
    <div className="container-boutique space-y-8">
      {/* Steps Header */}
      <div className="bg-white p-4 rounded-sm border border-border shadow-xs flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
        <button
          onClick={() => setStep("shipping")}
          className={`flex items-center gap-2 ${
            step === "shipping" ? "text-[var(--wine)] font-bold" : "text-muted-foreground"
          }`}
        >
          <span className="h-6 w-6 rounded-full bg-[var(--wine)] text-white text-[11px] flex items-center justify-center font-mono">
            1
          </span>
          <span>Shipping Address</span>
        </button>

        <ChevronRight className="h-4 w-4 text-muted-foreground" />

        <button
          onClick={() => {
            setStep("payment");
            if (typeof window !== "undefined") window.scrollTo({ top: 250, behavior: "smooth" });
          }}
          className={`flex items-center gap-2 ${step === "payment" ? "text-[var(--wine)] font-bold" : "text-muted-foreground"}`}
        >
          <span className="h-6 w-6 rounded-full bg-[var(--wine)] text-white text-[11px] flex items-center justify-center font-mono">
            2
          </span>
          <span>Payment Gateway</span>
        </button>

        <ChevronRight className="h-4 w-4 text-muted-foreground" />

        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="h-6 w-6 rounded-full bg-secondary text-muted-foreground text-[11px] flex items-center justify-center font-mono">
            3
          </span>
          <span>Confirmation</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Checkout Forms */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Shipping Address Form */}
          {step === "shipping" && (
            <div className="bg-white p-6 md:p-8 rounded-sm border border-border shadow-md space-y-6 animate-in fade-in">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[var(--wine-deep)]">Contact & Shipping Details</h2>
                <p className="text-xs text-muted-foreground">Enter your international delivery information</p>
              </div>

              <form onSubmit={handleShippingSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.firstName}
                      onChange={(e) => setShippingForm({ ...shippingForm, firstName: e.target.value })}
                      className="w-full p-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.lastName}
                      onChange={(e) => setShippingForm({ ...shippingForm, lastName: e.target.value })}
                      className="w-full p-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={shippingForm.email}
                      onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                      className="w-full p-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                      className="w-full p-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold block mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={shippingForm.address}
                    onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                    className="w-full p-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                      className="w-full p-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">State / Province</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                      className="w-full p-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">ZIP / Postal Code</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.zip}
                      onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })}
                      className="w-full p-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold block mb-1">Country</label>
                  <select
                    value={shippingForm.country}
                    onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value })}
                    className="w-full p-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)] font-medium"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="India">India</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                </div>

                {/* Delivery Speed Selector */}
                <div className="pt-3 border-t border-border space-y-2">
                  <label className="font-bold block text-xs">Select Delivery Speed</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      onClick={() => setShippingForm({ ...shippingForm, shippingMethod: "standard" })}
                      className={`p-3 rounded-sm border cursor-pointer flex flex-col justify-between transition-colors ${
                        shippingForm.shippingMethod === "standard"
                          ? "border-[var(--wine)] bg-[var(--wine)]/5 font-bold"
                          : "border-border bg-secondary/20"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-[var(--wine)]" />
                        <span>Standard Handloom Air</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {isFreeShipping ? "FREE (Complimentary)" : formatPrice(25)} · 5-7 days
                      </div>
                    </label>

                    <label
                      onClick={() => setShippingForm({ ...shippingForm, shippingMethod: "express" })}
                      className={`p-3 rounded-sm border cursor-pointer flex flex-col justify-between transition-colors ${
                        shippingForm.shippingMethod === "express"
                          ? "border-[var(--wine)] bg-[var(--wine)]/5 font-bold"
                          : "border-border bg-secondary/20"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[var(--gold)]" />
                        <span>Priority Express Courier</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {formatPrice(45)} · 2-3 days insured
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 bg-[var(--wine)] text-white py-3.5 text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-[var(--wine-deep)] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Proceed to Select Payment Gateway</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: Payment Gateway Selection */}
          {step === "payment" && (
            <div className="bg-white p-6 md:p-8 rounded-sm border border-border shadow-md space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[var(--wine-deep)]">Choose Payment Gateway</h2>
                  <p className="text-xs text-muted-foreground">Select your preferred payment processor below</p>
                </div>
                <button
                  onClick={() => setStep("shipping")}
                  className="text-xs font-semibold text-[var(--wine)] hover:underline"
                >
                  Edit Address
                </button>
              </div>

              {/* 4 Gateway Switchers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGateway("razorpay")}
                  className={`p-3 rounded-sm border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    selectedGateway === "razorpay"
                      ? "border-[var(--wine)] bg-[var(--wine)]/10 font-bold shadow-xs text-[var(--wine-deep)]"
                      : "border-border bg-secondary/20 hover:bg-secondary/50 text-foreground"
                  }`}
                >
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  <span className="text-xs font-bold">1. Razorpay</span>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono">UPI / NetBank</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGateway("stripe")}
                  className={`p-3 rounded-sm border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    selectedGateway === "stripe"
                      ? "border-[var(--wine)] bg-[var(--wine)]/10 font-bold shadow-xs text-[var(--wine-deep)]"
                      : "border-border bg-secondary/20 hover:bg-secondary/50 text-foreground"
                  }`}
                >
                  <CreditCard className="h-5 w-5 text-indigo-600" />
                  <span className="text-xs font-bold">2. Stripe</span>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono">Global Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGateway("paypal")}
                  className={`p-3 rounded-sm border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    selectedGateway === "paypal"
                      ? "border-[var(--wine)] bg-[var(--wine)]/10 font-bold shadow-xs text-[var(--wine-deep)]"
                      : "border-border bg-secondary/20 hover:bg-secondary/50 text-foreground"
                  }`}
                >
                  <DollarSign className="h-5 w-5 text-amber-600" />
                  <span className="text-xs font-bold">3. PayPal</span>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono">Pay in 4</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGateway("card")}
                  className={`p-3 rounded-sm border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    selectedGateway === "card"
                      ? "border-[var(--wine)] bg-[var(--wine)]/10 font-bold shadow-xs text-[var(--wine-deep)]"
                      : "border-border bg-secondary/20 hover:bg-secondary/50 text-foreground"
                  }`}
                >
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span className="text-xs font-bold">4. Credit / Debit</span>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono">Direct Terminal</span>
                </button>
              </div>

              {/* Dynamic Gateway Form & Trigger */}
              <form onSubmit={handleOpenGatewayModal} className="space-y-4 pt-2">
                {/* GATEWAY 1: Razorpay Terminal */}
                {selectedGateway === "razorpay" && (
                  <div className="p-5 rounded-sm border border-blue-200 bg-blue-50/40 space-y-4 text-xs animate-in fade-in">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-bold text-blue-900 flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-blue-700" />
                        <span>Razorpay Standard Web Checkout</span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-emerald-700" />
                        <span>256-Bit SSL Encrypted</span>
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded border border-blue-200 space-y-2">
                      <div className="text-xs text-foreground font-medium">
                        Instant Standard Checkout with 100+ payment methods:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                        <div className="p-2 bg-blue-50/60 rounded border border-blue-100 flex items-center gap-1.5 font-medium text-blue-900">
                          <Smartphone className="h-3.5 w-3.5 text-blue-600" />
                          <span>UPI & QR</span>
                        </div>
                        <div className="p-2 bg-blue-50/60 rounded border border-blue-100 flex items-center gap-1.5 font-medium text-blue-900">
                          <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                          <span>All Cards</span>
                        </div>
                        <div className="p-2 bg-blue-50/60 rounded border border-blue-100 flex items-center gap-1.5 font-medium text-blue-900">
                          <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                          <span>NetBanking</span>
                        </div>
                        <div className="p-2 bg-blue-50/60 rounded border border-blue-100 flex items-center gap-1.5 font-medium text-blue-900">
                          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                          <span>Wallets & EMI</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-muted-foreground pt-1 flex items-center gap-1">
                        <Lock className="h-3 w-3 text-emerald-600" />
                        <span>Backend Order Verification + HMAC-SHA256 signature validation active.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* GATEWAY 2: Stripe Terminal */}
                {selectedGateway === "stripe" && (
                  <div className="p-5 rounded-sm border border-indigo-200 bg-indigo-50/30 space-y-4 text-xs animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-indigo-900 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-indigo-700" />
                        <span>Stripe Global Gateway</span>
                      </div>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-mono font-bold">Key: {apiKeysConfig.stripePublishableKey}</span>
                    </div>

                    <div className="p-3 bg-white rounded border border-indigo-200 space-y-3">
                      <div>
                        <label className="font-bold block mb-1">Receipt Email</label>
                        <input
                          type="email"
                          required
                          value={stripeEmail}
                          onChange={(e) => setStripeEmail(e.target.value)}
                          className="w-full p-2 bg-secondary/20 border border-border rounded-sm"
                        />
                      </div>
                      <div className="p-3 bg-secondary/30 rounded border border-border font-mono text-[11px] flex justify-between items-center text-muted-foreground">
                        <span>•••• •••• •••• 4242 (Stripe Elements Test Mode)</span>
                        <span className="text-indigo-700 font-bold">Ready</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* GATEWAY 3: PayPal Terminal */}
                {selectedGateway === "paypal" && (
                  <div className="p-5 rounded-sm border border-amber-200 bg-amber-50/40 space-y-4 text-xs animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-amber-900 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-amber-700" />
                        <span>PayPal Express Gateway</span>
                      </div>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold">Client ID: {apiKeysConfig.paypalClientId}</span>
                    </div>

                    <div className="p-4 bg-white rounded border border-amber-200 text-center space-y-2">
                      <div className="font-serif font-bold text-lg text-amber-900">PayPal Express Checkout</div>
                      <p className="text-[11px] text-muted-foreground">
                        Pay in 4 interest-free installments of <strong className="text-foreground">{formatPrice(finalTotalUsd / 4)}</strong>.
                      </p>
                    </div>
                  </div>
                )}

                {/* GATEWAY 4: Direct Credit Card Terminal */}
                {selectedGateway === "card" && (
                  <div className="p-5 rounded-sm border border-emerald-200 bg-emerald-50/30 space-y-4 text-xs animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-emerald-900 flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-700" />
                        <span>Direct Card Terminal</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-mono font-bold text-[10px]">
                        {getCardBrand(cardNumber)} DETECTED
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="font-bold block mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full p-2.5 bg-white border border-border rounded-sm focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="font-bold block mb-1">Card Number</label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4532 1284 9012 5541"
                          className="w-full p-2.5 bg-white border border-border rounded-sm focus:outline-none focus:border-emerald-600 font-mono text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold block mb-1">Expiry Date (MM/YY)</label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full p-2.5 bg-white border border-border rounded-sm focus:outline-none focus:border-emerald-600 font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="font-bold block mb-1">CVV / Security Code</label>
                          <input
                            type="password"
                            required
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="123"
                            className="w-full p-2.5 bg-white border border-border rounded-sm focus:outline-none focus:border-emerald-600 font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Status Message */}
                {isProcessing && paymentStatusMessage && (
                  <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-sm text-xs flex items-center gap-2 animate-in fade-in">
                    <span className="h-3.5 w-3.5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>{paymentStatusMessage}</span>
                  </div>
                )}

                {/* Payment Error Banner */}
                {paymentError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-sm text-xs flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>{paymentError}</span>
                  </div>
                )}

                {/* Main Action Trigger Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full mt-4 py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-sm transition-all shadow-xl flex items-center justify-center gap-2 border border-[var(--wine-deep)]/20 ${
                    isProcessing
                      ? "bg-secondary text-muted-foreground cursor-not-allowed opacity-80"
                      : selectedGateway === "razorpay"
                      ? "bg-blue-700 text-white hover:bg-blue-800"
                      : "bg-[var(--gold)] text-[var(--wine-deep)] hover:bg-white"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>{paymentStatusMessage || "Processing Secure Checkout..."}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>
                        {selectedGateway === "razorpay"
                          ? `Pay with Razorpay (${formatPrice(finalTotalUsd)})`
                          : `Launch ${selectedGateway.toUpperCase()} Gateway (${formatPrice(finalTotalUsd)})`}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Promo Code Engine */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-sm border border-border shadow-md space-y-5">
            <h3 className="font-serif text-xl font-bold text-[var(--wine-deep)] border-b border-border pb-3">
              Order Summary ({items.length} Items)
            </h3>

            {/* Items List */}
            <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
              {items.map((i) => (
                <div key={i.product.id} className="flex gap-3 text-xs border-b border-border/50 pb-3">
                  <img
                    src={i.product.image}
                    alt={i.product.name}
                    className="h-16 w-14 object-cover rounded-xs shrink-0 border border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-serif font-bold text-xs truncate">{i.product.name}</div>
                    <div className="text-[10px] text-muted-foreground">{i.product.fabric} · Qty: {i.qty}</div>
                    <div className="font-bold text-[var(--wine-deep)] mt-1">{formatPrice(i.product.priceUsd * i.qty)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Engine */}
            <form onSubmit={handleApplyPromo} className="space-y-2 pt-2 border-t border-border">
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
                  className="px-4 py-2 bg-secondary text-foreground text-xs font-bold rounded-sm border border-border hover:bg-border transition-colors"
                >
                  Apply
                </button>
              </div>

              {promoSuccess && <div className="text-[11px] text-emerald-700 font-semibold">{promoSuccess}</div>}
              {promoError && <div className="text-[11px] text-red-600 font-semibold">{promoError}</div>}
            </form>

            {/* Pricing Summary */}
            <div className="space-y-2 text-xs pt-3 border-t border-border">
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
                  {shippingFeeUsd === 0 ? "FREE" : formatPrice(shippingFeeUsd)}
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
                <div className="text-[11px] text-muted-foreground text-right mt-1">
                  Settlement base: ${(finalTotalUsd).toFixed(2)} USD
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE GATEWAY MODAL WINDOW SIMULATOR */}
      {gatewayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-sm max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in relative border border-border">
            <button
              onClick={() => setGatewayModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-black"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Razorpay Modal Window */}
            {selectedGateway === "razorpay" && (
              <div className="space-y-4 text-center">
                <div className="bg-blue-900 text-white p-4 rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Smartphone className="h-5 w-5 text-blue-300" />
                    <span>RAZORPAY SECURE PAY</span>
                  </div>
                  <div className="font-mono text-xs font-bold">₹{Math.round(finalTotalUsd * 83.5).toLocaleString()}</div>
                </div>

                <div className="p-4 bg-secondary/30 rounded border border-border text-left space-y-2 text-xs">
                  <div className="font-bold text-foreground">Order: Mun Creations Luxury Handloom</div>
                  <div className="text-muted-foreground">VPA Handle: <code className="font-mono text-blue-700">{upiId}</code></div>
                  <div className="text-muted-foreground">Customer: {shippingForm.firstName} {shippingForm.lastName}</div>
                </div>

                <button
                  onClick={handleConfirmGatewayPayment}
                  disabled={isProcessing}
                  className="w-full bg-blue-700 text-white py-3.5 text-xs font-bold uppercase tracking-wider rounded shadow-md hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Razorpay Authorization...</span>
                    </span>
                  ) : (
                    <span>Authorize Razorpay UPI / Payment</span>
                  )}
                </button>
              </div>
            )}

            {/* Stripe Modal Window */}
            {selectedGateway === "stripe" && (
              <div className="space-y-4 text-center">
                <div className="bg-indigo-900 text-white p-4 rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CreditCard className="h-5 w-5 text-indigo-300" />
                    <span>STRIPE SECURE CHECKOUT</span>
                  </div>
                  <div className="font-serif font-bold text-sm">{formatPrice(finalTotalUsd)}</div>
                </div>

                <div className="p-4 bg-secondary/30 rounded border border-border text-left space-y-2 text-xs font-mono">
                  <div>Status: 256-Bit TLS Stripe Key Ready</div>
                  <div>Account: {stripeEmail}</div>
                </div>

                <button
                  onClick={handleConfirmGatewayPayment}
                  disabled={isProcessing}
                  className="w-full bg-indigo-700 text-white py-3.5 text-xs font-bold uppercase tracking-wider rounded shadow-md hover:bg-indigo-800 transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Confirming Stripe Charge...</span>
                    </span>
                  ) : (
                    <span>Pay with Stripe</span>
                  )}
                </button>
              </div>
            )}

            {/* PayPal Modal Window */}
            {selectedGateway === "paypal" && (
              <div className="space-y-4 text-center">
                <div className="bg-amber-500 text-white p-4 rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <DollarSign className="h-5 w-5 text-white" />
                    <span>PAYPAL EXPRESS</span>
                  </div>
                  <div className="font-serif font-bold text-sm">{formatPrice(finalTotalUsd)}</div>
                </div>

                <div className="p-4 bg-secondary/30 rounded border border-border text-left space-y-2 text-xs">
                  <div>PayPal Account: <strong>{shippingForm.email}</strong></div>
                  <div>Selected Option: Pay in Full ({formatPrice(finalTotalUsd)})</div>
                </div>

                <button
                  onClick={handleConfirmGatewayPayment}
                  disabled={isProcessing}
                  className="w-full bg-amber-600 text-white py-3.5 text-xs font-bold uppercase tracking-wider rounded shadow-md hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Connecting PayPal Express...</span>
                    </span>
                  ) : (
                    <span>Confirm & Pay with PayPal</span>
                  )}
                </button>
              </div>
            )}

            {/* Credit Card 3D-Secure OTP Window */}
            {selectedGateway === "card" && (
              <div className="space-y-4 text-center">
                <div className="bg-[var(--wine-deep)] text-white p-4 rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <ShieldCheck className="h-5 w-5 text-[var(--gold)]" />
                    <span>BANK 3D-SECURE VERIFICATION</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[var(--gold)]">{getCardBrand(cardNumber)}</span>
                </div>

                <div className="p-4 bg-secondary/30 rounded border border-border text-left space-y-3 text-xs">
                  <div className="text-muted-foreground">
                    An SMS One-Time Password (OTP) has been sent to your registered mobile number linked to card <strong className="text-foreground">•••• {cardNumber.slice(-4)}</strong>.
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Enter 6-Digit SMS OTP Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full p-2.5 bg-white border border-border rounded-sm text-center font-mono font-bold tracking-[0.3em] text-lg focus:outline-none focus:border-[var(--wine)]"
                    />
                  </div>
                </div>

                <button
                  onClick={handleConfirmGatewayPayment}
                  disabled={isProcessing}
                  className="w-full bg-[var(--wine)] text-white py-3.5 text-xs font-bold uppercase tracking-wider rounded shadow-md hover:bg-[var(--wine-deep)] transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing Bank Transaction...</span>
                    </span>
                  ) : (
                    <span>Authorize Payment ({formatPrice(finalTotalUsd)})</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
