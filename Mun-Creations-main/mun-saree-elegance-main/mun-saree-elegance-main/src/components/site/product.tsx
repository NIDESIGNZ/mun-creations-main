import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Heart, Sparkles, ShoppingBag } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { ProductDetailModal } from "@/components/site/product-detail-modal";

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-8 sm:mb-10 md:mb-14 ${align === "center" ? "text-center" : ""}`}>
      {eyebrow && <div className="eyebrow mb-2.5 sm:mb-3">{eyebrow}</div>}
      <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl text-[var(--wine-deep)] leading-tight">
        {title}
      </h2>
      {sub && (
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl mx-auto px-2 sm:px-0">
          {sub}
        </p>
      )}
      {align === "center" && (
        <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2">
          <span className="gold-divider" />
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
          <span className="gold-divider" />
        </div>
      )}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { t, formatPrice } = useI18n();
  const { add } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <>
      <div className="group flex flex-col h-full">
        <div
          onClick={() => setShowModal(true)}
          className="relative overflow-hidden bg-[var(--muted)] aspect-[4/5] cursor-pointer rounded-xs"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
          {product.badge && (
            <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-[var(--wine)] text-[var(--ivory)] text-[9px] sm:text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xs z-10 shadow-xs">
              {product.badge === "new" ? t("product.new") : t("product.bestseller")}
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            aria-label="Add to wishlist"
            className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 h-8 w-8 sm:h-9 sm:w-9 grid place-items-center backdrop-blur-xs rounded-full transition-colors z-10 cursor-pointer ${
              isWishlisted
                ? "bg-[var(--wine)] text-[var(--gold)] shadow-md"
                : "bg-[var(--ivory)]/90 text-foreground hover:text-[var(--wine)]"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isWishlisted ? "fill-current" : ""}`} />
          </button>

          {/* Desktop Hover / Mobile Bottom Drawer Action Row */}
          <div className="absolute bottom-0 inset-x-0 grid grid-cols-2 translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300 shadow-xl z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                add(product);
              }}
              className="bg-[var(--wine)] text-[var(--ivory)] text-[9px] sm:text-[10px] tracking-[0.16em] uppercase py-2.5 sm:py-3 font-semibold hover:bg-[var(--wine-deep)] transition-colors border-r border-white/20 flex items-center justify-center gap-1 cursor-pointer"
            >
              <ShoppingBag className="h-3 w-3 sm:hidden" />
              <span>{t("product.add")}</span>
            </button>
            <Link
              to="/checkout"
              onClick={(e) => {
                e.stopPropagation();
                add(product);
              }}
              className="bg-[var(--gold)] text-[var(--wine-deep)] text-[9px] sm:text-[10px] tracking-[0.16em] uppercase py-2.5 sm:py-3 font-bold hover:bg-white text-center transition-colors flex items-center justify-center"
            >
              Buy Now
            </Link>
          </div>
        </div>

        <div className="pt-3 sm:pt-4 flex flex-col items-start gap-1 flex-1 justify-between">
          <div className="space-y-1 w-full">
            {product.swatches && product.swatches.length > 0 && (
              <div className="flex gap-1">
                {product.swatches.map((s) => (
                  <span
                    key={s}
                    className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border border-border/70"
                    style={{ backgroundColor: s }}
                  />
                ))}
              </div>
            )}
            <h3
              onClick={() => setShowModal(true)}
              className="font-serif text-sm sm:text-base leading-snug text-foreground cursor-pointer hover:text-[var(--wine)] transition-colors line-clamp-2"
            >
              {product.name}
            </h3>
          </div>

          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-xs sm:text-sm text-[var(--wine)] font-semibold tracking-wide">
              {formatPrice(product.priceUsd)}
            </span>
            {product.compareAtUsd && (
              <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAtUsd)}
              </span>
            )}
          </div>
        </div>
      </div>

      {showModal && <ProductDetailModal product={product} onClose={() => setShowModal(false)} />}
    </>
  );
}

export function ProductCarousel({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    if (!ref.current) return;
    const container = ref.current;
    const firstChild = container.firstElementChild as HTMLElement | null;
    const cardWidth = firstChild ? firstChild.offsetWidth + 20 : 300;
    container.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      <div
        ref={ref}
        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 px-1 no-scrollbar"
        role="region"
        aria-label="Product carousel"
      >
        {products.map((p, idx) => (
          <div
            key={`${p.id}-${idx}`}
            className="snap-start shrink-0 w-[260px] sm:w-[280px] md:w-[310px]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <div className="hidden md:flex absolute -top-14 right-0 gap-2">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="h-9 w-9 border border-border grid place-items-center hover:bg-[var(--wine)] hover:text-[var(--ivory)] hover:border-[var(--wine)] transition-colors cursor-pointer rounded-xs"
          aria-label="Previous products"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="h-9 w-9 border border-border grid place-items-center hover:bg-[var(--wine)] hover:text-[var(--ivory)] hover:border-[var(--wine)] transition-colors cursor-pointer rounded-xs"
          aria-label="Next products"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
