import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { CartProvider, useCart } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { backendDB } from "@/lib/backend-api";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Shopping Bag — Mun Creations" },
      {
        name: "description",
        content: "Review your selected handcrafted sarees and bridal couture in your Mun Creations bag.",
      },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20">
            <CartContent />
          </main>
          <Footer />
        </div>
      </CartProvider>
    </I18nProvider>
  );
}

function CartContent() {
  const { items, subtotalUsd, setQty, remove, clearCart } = useCart();
  const { formatPrice, rates } = useI18n();
  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoMsg, setPromoMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [stockAlert, setStockAlert] = useState<{ id: string; message: string } | null>(null);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoInput.trim().toUpperCase();
    if (!clean) return;
    setIsApplyingPromo(true);
    setPromoMsg(null);
    try {
      const payload = {
        items: items.map((i) => ({ productId: i.product.id, quantity: i.qty })),
        promoCode: clean,
        shippingMethod: "standard",
      };
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success && data.cart) {
        if (data.cart.discountUsd > 0) {
          setAppliedDiscount(data.cart.discountUsd);
          setPromoMsg({
            text: data.cart.couponMessage || `Promo code ${clean} applied!`,
            isError: false,
          });
        } else {
          setAppliedDiscount(0);
          setPromoMsg({
            text: "This promo code is not applicable to current cart items.",
            isError: true,
          });
        }
      } else {
        setAppliedDiscount(0);
        setPromoMsg({
          text: data.error || "Invalid promo code. Valid vouchers include MUNHERITAGE10 and ROYAL50.",
          isError: true,
        });
      }
    } catch {
      // Authoritative fallback via backend database module
      try {
        const check = backendDB.validateCoupon(clean, subtotalUsd);
        if (check.valid) {
          setAppliedDiscount(check.discountAmountUsd);
          setPromoMsg({ text: check.message, isError: false });
        } else {
          setAppliedDiscount(0);
          setPromoMsg({ text: check.message || "Invalid promo code.", isError: true });
        }
      } catch {
        setPromoMsg({ text: "Unable to validate coupon code at this time.", isError: true });
      }
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const freeShippingThreshold = 500;
  const freeShippingDiff = Math.max(0, freeShippingThreshold - subtotalUsd);
  const isFreeShipping = subtotalUsd >= freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : 25;
  const grandTotal = Math.max(0, subtotalUsd - appliedDiscount + shippingFee);

  if (items.length === 0) {
    return (
      <div className="container-boutique max-w-lg mx-auto py-16 text-center space-y-4 bg-white p-10 rounded-sm border border-border shadow-xs">
        <div className="h-16 w-16 rounded-full bg-[var(--wine)]/10 text-[var(--wine)] flex items-center justify-center mx-auto">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--wine-deep)] tracking-wide">
          YOUR CART IS EMPTY
        </h1>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Discover our handcrafted collections and find something you&apos;ll love.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-[var(--wine)] text-white px-6 py-3 text-xs uppercase tracking-wider font-bold rounded-sm hover:bg-[var(--wine-deep)] transition-colors shadow-sm"
        >
          <span>CONTINUE SHOPPING</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-boutique space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-border pb-4 gap-2">
        <div>
          <div className="eyebrow text-[var(--gold)]">Boutique Shopping Bag</div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--wine-deep)]">
            Review Your Curated Selections ({items.reduce((sum, i) => sum + i.qty, 0)})
          </h1>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-muted-foreground hover:text-[var(--wine)] font-medium self-start sm:self-auto"
        >
          Clear entire bag
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="bg-white p-4 rounded-sm border border-border flex items-center gap-3">
        <Truck className="h-5 w-5 text-[var(--wine)] shrink-0" />
        <div className="flex-1 text-xs">
          {isFreeShipping ? (
            <span className="font-bold text-green-700">
              Congratulations! Your order qualifies for Complimentary Worldwide Express Shipping.
            </span>
          ) : (
            <span>
              Add <strong>{formatPrice(freeShippingDiff)}</strong> more to your bag to enjoy <strong>Complimentary Worldwide Shipping</strong>.
            </span>
          )}
        </div>
      </div>

      {/* Main Bag Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items Table / List */}
        <div className="lg:col-span-8 bg-white rounded-sm border border-border divide-y divide-border">
          {items.map(({ product, qty }) => (
            <div key={product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link to="/product/$id" params={{ id: product.id }} className="shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-24 w-20 sm:h-28 sm:w-24 object-cover rounded-xs border border-border"
                />
              </Link>

              <div className="flex-1 space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-[var(--gold)] font-bold">
                  {product.category} · {product.fabric}
                </div>
                <Link
                  to="/product/$id"
                  params={{ id: product.id }}
                  className="font-serif text-base sm:text-lg font-bold text-[var(--wine-deep)] hover:underline line-clamp-1"
                >
                  {product.name}
                </Link>
                <div className="text-sm font-bold text-[var(--wine)]">
                  {formatPrice(product.priceUsd)}
                </div>
              </div>

              {/* Quantity Stepper & Stock Limit */}
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2 border border-border rounded px-2 py-1 bg-secondary/30">
                  <button
                    type="button"
                    disabled={qty <= 1}
                    onClick={() => {
                      setStockAlert(null);
                      setQty(product.id, Math.max(1, qty - 1));
                    }}
                    className={`p-1 ${qty <= 1 ? "opacity-30 cursor-not-allowed" : "hover:text-[var(--wine)] cursor-pointer"}`}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-xs font-bold w-6 text-center font-mono">{qty}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const availableStock = product.stockQuantity ?? (product as any).stock ?? 10;
                      if (qty >= availableStock) {
                        setStockAlert({
                          id: product.id,
                          message: `Maximum stock limit reached (${availableStock} available)`,
                        });
                        setTimeout(() => setStockAlert(null), 3500);
                      } else {
                        setStockAlert(null);
                        setQty(product.id, qty + 1);
                      }
                    }}
                    className="p-1 hover:text-[var(--wine)] cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                {stockAlert?.id === product.id && (
                  <span className="text-[10px] text-amber-700 font-semibold animate-in fade-in">
                    {stockAlert.message}
                  </span>
                )}
              </div>

              {/* Line Total & Remove */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                <span className="text-sm font-bold font-serif text-[var(--wine-deep)]">
                  {formatPrice(product.priceUsd * qty)}
                </span>
                <button
                  type="button"
                  onClick={() => remove(product.id)}
                  className="text-xs text-muted-foreground hover:text-red-600 p-1 cursor-pointer"
                  aria-label={`Remove ${product.name} from bag`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-7 rounded-sm border border-border space-y-6 shadow-xs">
          <h2 className="font-serif text-lg font-bold text-[var(--wine-deep)] pb-3 border-b border-border">
            Order Summary
          </h2>

          {/* Promo Code Box */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Promo code (e.g. MUNHERITAGE10)"
                className="flex-1 px-3 py-2 text-xs bg-secondary/30 border border-border rounded focus:outline-none focus:border-[var(--wine)] uppercase font-mono"
              />
              <button
                type="submit"
                disabled={isApplyingPromo}
                className="bg-secondary px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded border border-border hover:bg-[var(--wine)] hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                {isApplyingPromo ? "..." : "Apply"}
              </button>
            </div>
            {promoMsg && (
              <p className={`text-[11px] ${promoMsg.isError ? "text-red-600 font-medium" : "text-green-700 font-semibold"}`}>
                {promoMsg.text}
              </p>
            )}
          </form>

          {/* Breakdown */}
          <div className="space-y-2.5 text-xs border-y border-border py-4">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-mono font-semibold text-foreground">{formatPrice(subtotalUsd)}</span>
            </div>
            {appliedDiscount > 0 && (
              <div className="flex justify-between text-green-700 font-medium">
                <span>Discount</span>
                <span className="font-mono font-semibold">-{formatPrice(appliedDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Insured Handloom Shipping</span>
              <span className="font-mono font-semibold text-foreground">
                {isFreeShipping ? "FREE" : formatPrice(shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-serif font-bold text-[var(--wine-deep)] pt-2 border-t border-border">
              <span>Grand Total</span>
              <span className="font-mono text-lg text-[var(--wine)]">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate({ to: "/checkout" })}
            className="w-full bg-[var(--wine)] text-white py-3.5 px-6 rounded text-xs font-bold uppercase tracking-wider hover:bg-[var(--wine-deep)] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <Link
            to="/products"
            className="block text-center text-xs text-muted-foreground hover:text-[var(--wine)] font-medium underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
