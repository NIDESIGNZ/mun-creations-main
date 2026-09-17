import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { CartProvider, useCart } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { ProductCard } from "@/components/site/product";
import type { Product } from "@/lib/products";
import { useCatalogProduct, useCatalogProducts } from "@/lib/catalog-client";
import { resolveProductImageUrl, handleProductImageError } from "@/lib/image-utils";
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Plane,
  Heart,
  Check,
  Award,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

export const Route = createFileRoute("/product/$id")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { id } = Route.useParams();
  const { data: product, isLoading, isError } = useCatalogProduct(id);

  useEffect(() => {
    if (product) {
      document.title = `${product.seoTitle || product.name} — Mun Creations`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && product.seoDescription) {
        metaDesc.setAttribute("content", product.seoDescription);
      }
    } else {
      document.title = `Product Not Found — Mun Creations`;
    }
  }, [product]);

  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20">
            {isLoading ? (
              <div className="container-boutique py-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-10 w-10 border-2 border-[var(--wine)] border-t-transparent rounded-full animate-spin" />
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                  Loading Handcrafted Saree...
                </div>
              </div>
            ) : !product || isError ? (
              <div className="container-boutique py-16 sm:py-24 max-w-xl mx-auto text-center space-y-6">
                <div className="h-20 w-20 rounded-full bg-[var(--wine)]/10 text-[var(--wine)] flex items-center justify-center mx-auto border border-[var(--wine)]/20 shadow-inner">
                  <ShoppingBag className="h-10 w-10 text-[var(--gold)]" />
                </div>
                <div className="space-y-2">
                  <div className="eyebrow text-[var(--gold)]">Archived or Unavailable</div>
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--wine-deep)]">
                    Product Not Found
                  </h1>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                    The saree or couture piece you requested is no longer available in our active collection, or has been archived from our master catalog.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-[var(--wine)] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[var(--wine-deep)] transition-colors shadow-sm w-full sm:w-auto justify-center"
                  >
                    <span>Browse All Sarees</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 border border-border bg-white text-foreground px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-secondary transition-colors w-full sm:w-auto justify-center"
                  >
                    <span>Return to Home</span>
                  </Link>
                </div>
              </div>
            ) : (
              <ProductDetailContent product={product} />
            )}
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </I18nProvider>
  );
}

function ProductDetailContent({ product }: { product: Product }) {
  const { formatPrice } = useI18n();
  const { add } = useCart();
  const navigate = useNavigate();

  const allPhotos = (
    product.images && product.images.length > 0
      ? product.images
      : [product.image]
  ).map((p) => resolveProductImageUrl(p));

  const [activeImage, setActiveImage] = useState(allPhotos[0]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    setActiveImage(allPhotos[0]);
  }, [product.id, allPhotos[0]]);

  const { data: allCatalogProducts = [] } = useCatalogProducts();
  const relatedProducts = allCatalogProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.fabric === product.fabric))
    .slice(0, 3);

  const handleAddToCart = () => {
    add(product);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2400);
  };

  const handleBuyNow = () => {
    add(product);
    navigate({ to: "/checkout" });
  };

  return (
    <div className="container-boutique space-y-10 sm:space-y-14">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-[var(--wine)]">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/products" className="hover:text-[var(--wine)]">Sarees</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[var(--wine)] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white p-5 sm:p-8 md:p-10 rounded-sm border border-border shadow-xs">
        {/* Gallery Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xs bg-secondary/30 border border-border group">
            <img
              src={activeImage}
              alt={product.name}
              onError={handleProductImageError}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-[var(--wine)] text-white text-[10px] uppercase tracking-widest px-2.5 py-1 rounded font-bold shadow-sm">
                {product.badge}
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsWishlisted(!isWishlisted)}
              aria-label="Add to wishlist"
              className={`absolute top-3 right-3 h-9 w-9 rounded-full grid place-items-center backdrop-blur-xs transition-colors shadow-sm ${
                isWishlisted ? "bg-[var(--wine)] text-[var(--gold)]" : "bg-white/90 text-foreground hover:text-[var(--wine)]"
              }`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {allPhotos.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              {allPhotos.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  aria-label={`View photo ${idx + 1}`}
                  className={`h-16 w-14 rounded-xs border overflow-hidden shrink-0 transition-all ${
                    activeImage === img ? "border-[var(--wine)] ring-2 ring-[var(--wine)]/30" : "border-border opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} onError={handleProductImageError} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-[var(--gold)] font-bold">
              <Sparkles className="h-3 w-3" />
              <span>{product.category} · {product.fabric}</span>
              {product.sku && <span className="text-muted-foreground ml-auto font-mono">SKU: {product.sku}</span>}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--wine-deep)] leading-snug">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl sm:text-3xl font-bold text-[var(--wine)] font-serif">
                {formatPrice(product)}
              </span>
              {product.compareAtUsd && product.compareAtUsd > product.priceUsd && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.compareAtUsd, "USD")}
                </span>
              )}
              <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded font-semibold ml-2">
                In Stock & Certified
              </span>
            </div>

            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed pt-2">
              {product.fullDescription || product.shortDescription}
            </p>

            {/* Dynamic Attribute Matrix (Specification 10: Strictly only attributes that exist) */}
            {(() => {
              const dynamicAttributes = [
                { label: "Fabric", value: product.fabric },
                { label: "Color", value: product.color || product.primaryColor },
                { label: "Work / Embroidery", value: (product as any).workType || (product as any).work },
                { label: "Occasion", value: product.occasion },
                { label: "Design / Pattern", value: (product as any).designPattern || (product as any).pattern },
                { label: "Weave", value: product.weave || (product as any).weaveType },
                { label: "Border Type", value: (product as any).borderType },
                { label: "Pallu Type", value: (product as any).palluType },
                { label: "Saree Length", value: product.sareeLength },
                { label: "Blouse Length", value: (product as any).blouseLength },
                {
                  label: "Blouse Piece Details",
                  value:
                    (product as any).blouseDetails ||
                    (product.blousePiece !== undefined
                      ? product.blousePiece
                        ? "Included (Unstitched)"
                        : "Not Included"
                      : undefined),
                },
                { label: "Care Instructions", value: (product as any).careInstructions || "Dry Clean Only" },
              ].filter((attr) => Boolean(attr.value && String(attr.value).trim().length > 0));

              if (dynamicAttributes.length === 0) return null;

              return (
                <div className="pt-3 pb-3 border-y border-border space-y-2">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground font-semibold">
                    Product Attributes & Specifications
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    {dynamicAttributes.map((attr) => (
                      <div key={attr.label}>
                        <span className="text-muted-foreground">{attr.label}:</span>{" "}
                        <strong className="text-foreground">{attr.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Handloom Disclaimer (Specification 10) */}
            <div className="text-[11px] text-muted-foreground bg-secondary/30 p-3 rounded-xs border border-border/70 leading-relaxed">
              <strong className="text-foreground block mb-0.5">Handloom Disclaimer:</strong>
              Due to the authentic handcrafted nature of our weaves and screen calibrations, slight variations in natural fiber texture, zari sheen, and color shade are hallmarks of genuine Indian artisan craftsmanship.
            </div>

            {/* WhatsApp Enquiry Button */}
            <div className="pt-1">
              <a
                href={`https://wa.me/919874572846?text=Hello%20Mun%20Creations%2C%20I%20have%20an%20enquiry%20regarding%20${encodeURIComponent(product.name)}${product.sku ? `%20(SKU:%20${encodeURIComponent(product.sku)})` : ""}.`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 border border-emerald-600/50 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 py-2.5 px-4 rounded-xs text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span>Enquire on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4">
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-[var(--wine)] text-white py-3.5 px-6 rounded text-xs font-bold uppercase tracking-wider hover:bg-[var(--wine-deep)] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{addedToast ? "Added to Cart!" : "Add to Cart"}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 bg-[var(--gold)] text-[var(--wine-deep)] py-3.5 px-6 rounded text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Buy Now Direct</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-3 gap-2 pt-3 text-center text-[10px] text-muted-foreground">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-[var(--wine)]" />
                <span>Silk Mark Certified</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Plane className="h-4 w-4 text-[var(--wine)]" />
                <span>Complimentary Express Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="h-4 w-4 text-[var(--wine)]" />
                <span>7-Day Insured Exchange</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Handcrafted Weaves */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <div className="eyebrow text-[var(--gold)]">You May Also Admire</div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--wine-deep)]">
              Complementary Masterpieces
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
