import { X, Minus, Plus, Trash2, Lock, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { resolveProductImageUrl, handleProductImageError } from "@/lib/image-utils";

export function CartDrawer() {
  const { open, setOpen, items, setQty, remove, subtotalUsd } = useCart();
  const { t, formatPrice, currency } = useI18n();

  // Scroll lock and Escape key listener
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, setOpen]);

  const isFreeShipping = subtotalUsd >= 500 || (currency === "INR" && subtotalUsd * 83.5 >= 40000);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
        }}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
          open ? "opacity-100 cursor-pointer" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer Panel - Fixed Viewport Height */}
      <aside
        className={`fixed inset-y-0 right-0 z-[60] h-screen max-h-screen w-full sm:w-[440px] max-w-full bg-[var(--ivory)] shadow-2xl flex flex-col transition-transform duration-300 ease-out border-l border-border ${
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        {/* Drawer Header (Fixed top) */}
        <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-border bg-[var(--ivory)] z-10">
          <div>
            <div className="eyebrow text-[var(--gold)]">Mun Creations</div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--wine-deep)]">
              {t("cart.title")} ({items.reduce((acc, item) => acc + item.qty, 0)})
            </h3>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(false);
            }}
            aria-label="Close cart drawer"
            className="p-2 touch-target text-foreground/80 hover:text-[var(--wine)] transition-colors rounded-full hover:bg-secondary cursor-pointer border border-border/50 flex items-center gap-1 text-xs font-semibold px-3"
          >
            <span>Close</span>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Items Container with strict Flexbox min-h-0 constraint */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-muted-foreground py-12">
              <div className="h-16 w-16 rounded-full bg-[var(--wine)]/10 text-[var(--wine)] flex items-center justify-center border border-[var(--wine)]/20">
                <Sparkles className="h-8 w-8 text-[var(--gold)]" />
              </div>
              <div className="font-serif text-2xl font-bold text-[var(--wine-deep)]">
                {t("cart.empty")}
              </div>
              <p className="text-xs max-w-xs">
                Explore our handwoven Banarasi, Kanjivaram & Tussar sarees to start your checkout.
              </p>
            </div>
          ) : (
            <div className="space-y-5 sm:space-y-6">
              {/* Free Shipping Progress */}
              <div className="p-3 rounded-sm bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
                <span>
                  {isFreeShipping ? (
                    <strong>Complimentary Worldwide Insured Air Shipping Unlocked!</strong>
                  ) : (
                    <span>
                      Spend <strong>{formatPrice(500 - subtotalUsd)}</strong> more for Complimentary
                      Express Air Dispatch
                    </span>
                  )}
                </span>
              </div>

              {/* Items List */}
              <ul className="divide-y divide-border">
                {items.map(({ product, qty }) => {
                  const isUnavailable =
                    product.active === false ||
                    product.published === false ||
                    product.availability === "Out of Stock" ||
                    (product.stockQuantity !== undefined && product.stockQuantity <= 0);

                  return (
                    <li key={product.id} className="py-4 flex gap-3 sm:gap-4 first:pt-0">
                      <img
                        src={resolveProductImageUrl(product.image)}
                        alt={product.name}
                        onError={handleProductImageError}
                        className={`h-22 w-18 sm:h-24 sm:w-20 object-cover shrink-0 rounded-xs border ${
                          isUnavailable ? "border-red-300 opacity-60 grayscale-50" : "border-border"
                        }`}
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="font-serif text-sm sm:text-[15px] leading-snug font-bold text-foreground line-clamp-2">
                            {product.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">{product.fabric}</div>
                          {isUnavailable ? (
                            <div className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-xs mt-1 inline-block">
                              Unavailable in Catalog
                            </div>
                          ) : (
                            <div className="text-sm font-bold text-[var(--wine-deep)] mt-1">
                              {formatPrice(product.priceUsd)}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
                          <div className="flex items-center border border-border bg-white rounded-xs">
                            <button
                              type="button"
                              onClick={() => setQty(product.id, qty - 1)}
                              className="h-7 w-7 grid place-items-center hover:bg-secondary text-foreground cursor-pointer"
                              aria-label="Decrease"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold">{qty}</span>
                            <button
                              type="button"
                              onClick={() => setQty(product.id, qty + 1)}
                              disabled={isUnavailable}
                              className="h-7 w-7 grid place-items-center hover:bg-secondary text-foreground cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                              aria-label="Increase"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(product.id)}
                            className="text-muted-foreground hover:text-[var(--wine)] p-1 text-xs flex items-center gap-1 font-medium cursor-pointer"
                            aria-label="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* ALWAYS PINNED STICKY FOOTER CHECKOUT BOX */}
        {items.length > 0 && (
          <div className="shrink-0 bg-[var(--ivory)] border-t border-border px-4 sm:px-6 py-4 sm:py-5 space-y-3 z-10 shadow-[0_-8px_20px_rgba(0,0,0,0.08)] safe-bottom">
            {items.some(
              (i) =>
                i.product.active === false ||
                i.product.published === false ||
                i.product.availability === "Out of Stock" ||
                (i.product.stockQuantity !== undefined && i.product.stockQuantity <= 0)
            ) && (
              <div className="p-2 rounded-xs bg-red-50 border border-red-200 text-[11px] text-red-700 font-medium text-center">
                One or more items are unavailable. Please remove them before checkout.
              </div>
            )}

            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-wider text-muted-foreground font-semibold">
                {t("cart.subtotal")} ({items.reduce((acc, item) => acc + item.qty, 0)} items)
              </span>
              <span className="font-serif text-xl sm:text-2xl font-bold text-[var(--wine-deep)]">
                {formatPrice(subtotalUsd)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="w-full bg-white text-[var(--wine-deep)] border border-border py-3 text-[11px] font-bold uppercase tracking-wider rounded-xs hover:border-[var(--wine)] text-center flex items-center justify-center gap-1.5"
              >
                <span>View Full Bag</span>
              </Link>
              {items.some(
                (i) =>
                  i.product.active === false ||
                  i.product.published === false ||
                  i.product.availability === "Out of Stock" ||
                  (i.product.stockQuantity !== undefined && i.product.stockQuantity <= 0)
              ) ? (
                <button
                  type="button"
                  disabled
                  className="w-full bg-slate-300 text-slate-500 py-3 text-[11px] font-bold uppercase tracking-wider rounded-xs cursor-not-allowed text-center flex items-center justify-center gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Unavailable</span>
                </button>
              ) : (
                <Link
                  to="/checkout"
                  onClick={() => setOpen(false)}
                  className="w-full bg-[var(--gold)] text-[var(--wine-deep)] py-3 text-[11px] font-bold uppercase tracking-wider rounded-xs hover:bg-[var(--gold)]/90 text-center flex items-center justify-center gap-1.5 font-bold shadow-sm"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Checkout</span>
                </Link>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground tracking-wider uppercase pt-0.5">
              <span>Razorpay Secure</span>·<span>UPI</span>·<span>Cards</span>·<span>NetBanking</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
