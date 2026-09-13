import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import {
  Sparkles,
  ShoppingBag,
  Eye,
  CheckCircle,
  ShieldCheck,
  ChevronRight,
  MousePointer2,
  ArrowRight,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { PRODUCTS, type Product } from "@/lib/products";
import DepthCarousel, { type NormalizedItem } from "@/components/ui/DepthCarousel";
import { ProductDetailModal } from "@/components/site/product-detail-modal";
import { AITryOnModal } from "@/components/site/ai-try-on/AITryOnModal";
import { SectionHeading } from "@/components/site/product";
import "./ProductShowcase.css";

export interface ProductShowcaseProps {
  products?: Product[];
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  defaultCategory?: string;
  className?: string;
}

const CATEGORY_TABS = [
  { id: "all", label: "All Signature Weaves" },
  { id: "banarasi", label: "Banarasi Heritage" },
  { id: "kanjivaram", label: "Pure Kanjivaram" },
  { id: "paithani", label: "Royal Paithani" },
  { id: "tussar", label: "Award Tussar" },
  { id: "bridal", label: "Bridal & Occasion" },
];

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  products = PRODUCTS,
  title = "Curated Couture Showcase",
  subtitle = "Experience the tactile elegance, rich zari, and fine textures of our master-woven sarees in interactive 3D depth.",
  eyebrow = "Interactive 3D Experience",
  defaultCategory = "all",
  className = "",
}) => {
  const { formatPrice } = useI18n();
  const { add } = useCart();

  const [activeTab, setActiveTab] = useState<string>(defaultCategory);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [tryOnProduct, setTryOnProduct] = useState<Product | null>(null);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  // Filter products based on selected tab
  const filteredProducts = useMemo(() => {
    if (activeTab === "all") return products;
    if (activeTab === "banarasi") {
      return products.filter(
        (p) =>
          p.category.toLowerCase().includes("banarasi") ||
          p.group?.toLowerCase().includes("banarasi"),
      );
    }
    if (activeTab === "kanjivaram") {
      return products.filter(
        (p) =>
          p.category.toLowerCase().includes("kanjeevaram") ||
          p.category.toLowerCase().includes("kanjivaram") ||
          p.group?.toLowerCase().includes("kanjivaram"),
      );
    }
    if (activeTab === "paithani") {
      return products.filter(
        (p) =>
          p.category.toLowerCase().includes("paithani") ||
          p.group?.toLowerCase().includes("paithani"),
      );
    }
    if (activeTab === "tussar") {
      return products.filter(
        (p) =>
          p.category.toLowerCase().includes("tussar") || p.group?.toLowerCase().includes("tussar"),
      );
    }
    if (activeTab === "bridal") {
      return products.filter(
        (p) =>
          p.occasion?.includes("Wedding") ||
          p.occasion?.includes("Bridal") ||
          p.subcategory?.toLowerCase().includes("bridal") ||
          p.badge === "bestseller",
      );
    }
    return products;
  }, [products, activeTab]);

  // Fallback to all products if filtered list is empty
  const activeProducts = filteredProducts.length > 0 ? filteredProducts : products;

  // Active product index & state
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [displayedProduct, setDisplayedProduct] = useState<Product>(
    activeProducts[0] || products[0],
  );

  // Carousel items normalized with product attached (guaranteeing uniqueness)
  const carouselItems = useMemo(() => {
    const unique = activeProducts.filter(
      (p, i, self) => i === self.findIndex((x) => x.id === p.id),
    );
    return unique.map((p) => ({
      image: p.image,
      alt: p.name,
      product: p,
      id: p.id,
      name: p.name,
      category: p.category,
      priceUsd: p.priceUsd,
      badge: p.badge,
    }));
  }, [activeProducts]);

  // Keep displayed product valid when filter tab changes
  useEffect(() => {
    setActiveIndex(0);
    if (activeProducts[0]) {
      setDisplayedProduct(activeProducts[0]);
    }
  }, [activeProducts]);

  // Info card ref for GSAP transition
  const infoContentRef = useRef<HTMLDivElement | null>(null);
  const gsapTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // GSAP animation handler for slide change
  const handleSlideChange = useCallback(
    (index: number, item: NormalizedItem) => {
      const nextProduct = (item as any)?.product || activeProducts[index] || products[index];
      if (!nextProduct) return;

      setActiveIndex(index);

      const el = infoContentRef.current;
      if (!el) {
        setDisplayedProduct(nextProduct);
        return;
      }

      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        setDisplayedProduct(nextProduct);
        return;
      }

      // Kill any in-flight GSAP animation
      gsapTimelineRef.current?.kill();

      // Premium subtle GSAP transition: Fade out/slide slightly up -> Swap state -> Slide down/fade in
      const tl = gsap.timeline();
      gsapTimelineRef.current = tl;

      tl.to(el, {
        opacity: 0.15,
        y: -8,
        duration: 0.16,
        ease: "power2.in",
        onComplete: () => {
          setDisplayedProduct(nextProduct);
        },
      }).to(el, {
        opacity: 1,
        y: 0,
        duration: 0.32,
        ease: "power3.out",
      });
    },
    [activeProducts, products],
  );

  // Cleanup GSAP animations on unmount
  useEffect(() => {
    return () => {
      gsapTimelineRef.current?.kill();
    };
  }, []);

  const handleAddToCart = () => {
    if (displayedProduct) {
      add(displayedProduct);
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2400);
    }
  };

  // Calculate discount percentage if compareAtUsd is present
  const discountPercent =
    displayedProduct.compareAtUsd && displayedProduct.compareAtUsd > displayedProduct.priceUsd
      ? Math.round(
          ((displayedProduct.compareAtUsd - displayedProduct.priceUsd) /
            displayedProduct.compareAtUsd) *
            100,
        )
      : null;

  return (
    <section
      className={`product-showcase ${className}`.trim()}
      aria-label="Product Showcase Section"
    >
      {/* Background radial glow & atmospheric pattern */}
      <div className="product-showcase__bg-glow" aria-hidden="true" />
      <div className="product-showcase__bg-pattern" aria-hidden="true" />

      <div className="container-boutique relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8">
          <SectionHeading eyebrow={eyebrow} title={title} sub={subtitle} />
        </div>

        {/* Category Filter Pills */}
        <div className="product-showcase__filters" role="tablist" aria-label="Showcase categories">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`product-showcase__filter-btn ${activeTab === tab.id ? "is-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Grid: Product Details Info on Left / 3D Depth Carousel on Right */}
        <div className="product-showcase__grid">
          {/* Left Column: Product Information Overlay */}
          <div className="product-showcase__info-card">
            <div ref={infoContentRef} className="space-y-4">
              {/* Category and SKU row */}
              <div className="product-showcase__meta-row">
                <div className="product-showcase__category-badge">
                  <Sparkles className="h-3 w-3" />
                  <span>{displayedProduct.category}</span>
                  {displayedProduct.badge && (
                    <span className="opacity-90 font-bold">
                      · {displayedProduct.badge.toUpperCase()}
                    </span>
                  )}
                </div>
                {displayedProduct.sku && (
                  <span className="product-showcase__sku-tag">SKU: {displayedProduct.sku}</span>
                )}
              </div>

              {/* Product Title */}
              <h3 className="product-showcase__title font-serif">{displayedProduct.name}</h3>

              {/* Key Attributes Highlights */}
              <div className="product-showcase__attributes">
                {displayedProduct.fabric && (
                  <div className="product-showcase__attr-pill">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>
                      Fabric: <strong>{displayedProduct.fabric}</strong>
                    </span>
                  </div>
                )}
                {displayedProduct.weave && (
                  <div className="product-showcase__attr-pill">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>
                      Weave: <strong>{displayedProduct.weave}</strong>
                    </span>
                  </div>
                )}
                {displayedProduct.originRegion && (
                  <div className="product-showcase__attr-pill">
                    <span>
                      Region: <strong>{displayedProduct.originRegion.split(",")[0]}</strong>
                    </span>
                  </div>
                )}
                {displayedProduct.stockQuantity !== undefined && (
                  <div className="product-showcase__attr-pill">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    <span>In Stock</span>
                  </div>
                )}
              </div>

              {/* Short Description */}
              <p className="product-showcase__desc">
                {displayedProduct.shortDescription ||
                  displayedProduct.fullDescription?.slice(0, 140) + "..." ||
                  "Handcrafted with genuine pure silk yarns and authentic zari handwork by master artisans."}
              </p>

              {/* Swatches if available */}
              {displayedProduct.swatches && displayedProduct.swatches.length > 0 && (
                <div className="product-showcase__swatches-row">
                  <span className="product-showcase__swatch-label">Color Harmony:</span>
                  <div className="flex items-center gap-1.5">
                    {displayedProduct.swatches.map((colorHex, idx) => (
                      <span
                        key={idx}
                        className="product-showcase__swatch"
                        style={{ backgroundColor: colorHex }}
                        title={colorHex}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing Display */}
              <div className="product-showcase__price-box">
                <span className="product-showcase__price-current">
                  {formatPrice(displayedProduct.priceUsd)}
                </span>
                {displayedProduct.compareAtUsd && (
                  <span className="product-showcase__price-original">
                    {formatPrice(displayedProduct.compareAtUsd)}
                  </span>
                )}
                {discountPercent !== null && (
                  <span className="product-showcase__discount-badge">Save {discountPercent}%</span>
                )}
              </div>

              {/* Interactive Actions CTA */}
              <div className="product-showcase__actions">
                <button
                  type="button"
                  onClick={() => setTryOnProduct(displayedProduct)}
                  className="product-showcase__btn-primary bg-gradient-to-r from-[#d4af37] via-[#ffe5a3] to-[#d4af37] text-[#1a0812] shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  aria-label={`AI Virtual Try-On for ${displayedProduct.name}`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>✦ AI Try-On</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalProduct(displayedProduct)}
                  className="product-showcase__btn-secondary"
                  aria-label={`View full details of ${displayedProduct.name}`}
                >
                  <Eye className="h-4 w-4" />
                  <span>Quick View & Specs</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="product-showcase__btn-secondary"
                  aria-label={`Add ${displayedProduct.name} to shopping bag`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>{addedToast ? "Added to Bag ✓" : "Add to Bag"}</span>
                </button>

                <Link
                  to="/checkout"
                  onClick={() => add(displayedProduct)}
                  className="product-showcase__btn-secondary text-[var(--gold)] border-[var(--gold)]/40 hover:bg-[var(--gold)]/20"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Counter / Drag Hint Bar */}
              <div className="product-showcase__counter-bar">
                <div className="product-showcase__counter-text">
                  Item <span>{String(activeIndex + 1).padStart(2, "0")}</span> /{" "}
                  {String(activeProducts.length).padStart(2, "0")}
                </div>
                <div className="product-showcase__drag-hint">
                  <MousePointer2 className="h-3.5 w-3.5 animate-pulse" />
                  <span>Drag, swipe, or wheel to rotate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: React Bits DepthCarousel */}
          <div className="product-showcase__carousel-pane">
            <DepthCarousel
              items={carouselItems}
              cardWidth={320}
              cardHeight={420}
              radius={18}
              depth={220}
              spread={88}
              tilt={22}
              tiltDirection="right"
              perspective={1400}
              visibleCards={4}
              falloff={0.2}
              blur={6}
              duration={700}
              ease="power3.out"
              autoplay={true}
              autoplayDelay={3500}
              loop={true}
              showControls={true}
              showIndicators={true}
              onChange={handleSlideChange}
              renderCardOverlay={(item, idx, isActive) => {
                const prod = (item as any)?.product as Product | undefined;
                if (!prod) return null;
                return (
                  <>
                    {prod.badge && (
                      <span className="product-showcase__card-badge">
                        {prod.badge === "bestseller" ? "★ Bestseller" : "✦ New"}
                      </span>
                    )}
                    {isActive && (
                      <span className="product-showcase__card-price-tag">
                        {formatPrice(prod.priceUsd)}
                      </span>
                    )}
                  </>
                );
              }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Detail Modal */}
      {modalProduct && (
        <ProductDetailModal product={modalProduct} onClose={() => setModalProduct(null)} />
      )}

      {/* AI Virtual Try-On Modal */}
      {tryOnProduct && (
        <AITryOnModal
          product={tryOnProduct}
          isOpen={!!tryOnProduct}
          onClose={() => setTryOnProduct(null)}
        />
      )}
    </section>
  );
};

export default ProductShowcase;
