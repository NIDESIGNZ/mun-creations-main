import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  X,
  ShieldCheck,
  Truck,
  Heart,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  Info,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  Award,
  Layers,
  Lock,
} from "lucide-react";
import type { Product } from "@/lib/products";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { AITryOnModal } from "./ai-try-on/AITryOnModal";

export function ProductDetailModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { formatPrice, currency } = useI18n();
  const { add } = useCart();

  // Active Image & Tab States
  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [activeTab, setActiveTab] = useState<"specs" | "craft" | "care" | "shipping" | "faq">(
    "specs",
  );
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [showTryOnModal, setShowTryOnModal] = useState(false);

  // Gallery items array
  const gallery =
    product.images && product.images.length > 0
      ? product.images.map((src, idx) => ({ label: `View ${idx + 1}`, src }))
      : [
          { label: "Primary View", src: product.image },
          ...(product.galleryImages?.pallu
            ? [{ label: "Pallu View", src: product.galleryImages.pallu }]
            : []),
          ...(product.galleryImages?.border
            ? [{ label: "Border View", src: product.galleryImages.border }]
            : []),
          ...(product.galleryImages?.closeUp
            ? [{ label: "Close Up", src: product.galleryImages.closeUp }]
            : []),
          ...(product.galleryImages?.model
            ? [{ label: "Model View", src: product.galleryImages.model }]
            : []),
        ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-white text-foreground rounded-sm max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-border animate-in fade-in">
        {/* Modal Header */}
        <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-[var(--wine-deep)] text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--gold)]" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] font-semibold text-[var(--gold)]">
              Product Master Specifications
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Multi-Angle Gallery */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[4/5] max-h-[340px] sm:max-h-[460px] bg-secondary/30 border border-border rounded-sm overflow-hidden group shadow-md">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 bg-black/70 text-white text-[10px] uppercase font-mono px-2.5 py-1 rounded">
                SKU: {product.sku}
              </span>
            </div>

            {/* Gallery Thumbnail Selector */}
            {gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {gallery.map((g, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(g.src)}
                    className={`h-16 w-14 rounded-xs border overflow-hidden shrink-0 transition-all ${
                      activeImage === g.src
                        ? "border-[var(--wine)] ring-2 ring-[var(--wine)]/30"
                        : "border-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={g.src} alt={g.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Vendor & Stock Trust Box */}
            <div className="p-4 bg-secondary/30 rounded-sm border border-border space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Vendor:</span>
                <strong className="text-foreground">{product.vendor}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Availability:</span>
                <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold text-[10px] uppercase">
                  <CheckCircle2 className="h-3 w-3 text-emerald-700" />
                  <span>
                    {product.availability} ({product.stockQuantity} available)
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Weave Craft:</span>
                <span className="font-medium text-foreground">
                  {product.handloomOrPowerloom} Handloom
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Actions & 5 Specification Tabs */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="eyebrow text-[var(--gold)] mb-1">
                  {product.category} · {product.subcategory || product.productType}
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--wine-deep)] leading-tight">
                  {product.name}
                </h2>
                <div className="text-xs text-muted-foreground mt-1">
                  Origin: <strong className="text-foreground">{product.originRegion}</strong>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="font-serif text-2xl font-bold text-[var(--wine-deep)]">
                  {formatPrice(product.priceUsd)}
                </span>
                {product.compareAtUsd && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.compareAtUsd)}
                  </span>
                )}
                {product.compareAtUsd && (
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Save{" "}
                    {Math.round(
                      ((product.compareAtUsd - product.priceUsd) / product.compareAtUsd) * 100,
                    )}
                    %
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTryOnModal(true)}
                  className="w-full bg-gradient-to-r from-[#1c0812] via-[#2f0c1e] to-[#1c0812] text-[var(--gold)] border border-[var(--gold)]/50 py-3.5 px-4 text-xs font-bold uppercase tracking-[0.22em] rounded-sm hover:border-[var(--gold)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-md"
                >
                  <Sparkles className="h-4 w-4 text-[var(--gold)] group-hover:rotate-12 transition-transform" />
                  <span>✦ AI Virtual Try-On — See On You</span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => add(product)}
                    className="bg-[var(--wine)] text-white py-3.5 text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-[var(--wine-deep)] transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add to Bag</span>
                  </button>

                  <Link
                    to="/checkout"
                    onClick={() => add(product)}
                    className="bg-[var(--gold)] text-[var(--wine-deep)] py-3.5 text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-white text-center transition-all shadow-md flex items-center justify-center gap-2 border border-[var(--wine-deep)]/20"
                  >
                    <Lock className="h-4 w-4 text-[var(--wine-deep)]" />
                    <span>Buy Now</span>
                  </Link>
                </div>
              </div>

              {/* 5 Interactive Specification Tabs */}
              <div className="pt-4">
                <div className="flex border-b border-border text-[11px] sm:text-xs font-semibold uppercase tracking-wider overflow-x-auto gap-2 no-scrollbar pb-0.5">
                  <button
                    onClick={() => setActiveTab("specs")}
                    className={`pb-2.5 px-2 transition-colors whitespace-nowrap cursor-pointer ${
                      activeTab === "specs"
                        ? "border-b-2 border-[var(--wine)] text-[var(--wine)] font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Specifications
                  </button>
                  <button
                    onClick={() => setActiveTab("craft")}
                    className={`pb-2.5 px-2 transition-colors whitespace-nowrap cursor-pointer ${
                      activeTab === "craft"
                        ? "border-b-2 border-[var(--wine)] text-[var(--wine)] font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Craft & Story
                  </button>
                  <button
                    onClick={() => setActiveTab("care")}
                    className={`pb-2.5 px-2 transition-colors whitespace-nowrap cursor-pointer ${
                      activeTab === "care"
                        ? "border-b-2 border-[var(--wine)] text-[var(--wine)] font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Care & Storage
                  </button>
                  <button
                    onClick={() => setActiveTab("shipping")}
                    className={`pb-2.5 px-2 transition-colors whitespace-nowrap cursor-pointer ${
                      activeTab === "shipping"
                        ? "border-b-2 border-[var(--wine)] text-[var(--wine)] font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Shipping & Returns
                  </button>
                  <button
                    onClick={() => setActiveTab("faq")}
                    className={`pb-2.5 px-2 transition-colors whitespace-nowrap cursor-pointer ${
                      activeTab === "faq"
                        ? "border-b-2 border-[var(--wine)] text-[var(--wine)] font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Product FAQs
                  </button>
                </div>

                {/* Tab 1: Product Specifications Table */}
                {activeTab === "specs" && (
                  <div className="py-4 space-y-3 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border border-border rounded-sm p-3 sm:p-4 bg-secondary/20">
                      <div className="py-1">
                        SKU: <strong className="font-mono text-foreground">{product.sku}</strong>
                      </div>
                      <div className="py-1">
                        Category: <strong className="text-foreground">{product.category}</strong>
                      </div>
                      <div className="py-1">
                        Fabric: <strong className="text-foreground">{product.fabric}</strong>
                      </div>
                      <div className="py-1">
                        Colour: <strong className="text-foreground">{product.color}</strong>
                      </div>
                      <div className="py-1">
                        Occasion:{" "}
                        <strong className="text-foreground">
                          {product.occasion?.join(", ") || "Festive & Wedding"}
                        </strong>
                      </div>
                      <div className="py-1">
                        Work Type: <strong className="text-foreground">{product.workType}</strong>
                      </div>
                      <div className="py-1">
                        Design / Pattern:{" "}
                        <strong className="text-foreground">{product.designPattern}</strong>
                      </div>
                      <div className="py-1">
                        Border Type:{" "}
                        <strong className="text-foreground">{product.borderType}</strong>
                      </div>
                      <div className="py-1">
                        Blouse Piece:{" "}
                        <strong className="text-foreground">
                          {product.blousePiece ? "With Blouse Piece" : "Without"}
                        </strong>
                      </div>
                      <div className="py-1">
                        Saree Length:{" "}
                        <strong className="text-foreground">
                          {product.sareeLength || "5.5 meters"}
                        </strong>
                      </div>
                      <div className="py-1">
                        Saree Width:{" "}
                        <strong className="text-foreground">
                          {product.sareeWidth || "45 inches"}
                        </strong>
                      </div>
                      <div className="py-1">
                        Weight:{" "}
                        <strong className="text-foreground">{product.weight || "650g"}</strong>
                      </div>
                      <div className="py-1">
                        Craft Region:{" "}
                        <strong className="text-foreground">{product.originRegion}</strong>
                      </div>
                      <div className="py-1">
                        Handloom / Powerloom:{" "}
                        <strong className="text-foreground">{product.handloomOrPowerloom}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Craft & Story */}
                {activeTab === "craft" && (
                  <div className="py-4 space-y-3 text-xs leading-relaxed animate-in fade-in">
                    <p className="font-medium text-foreground">{product.shortDescription}</p>
                    <p className="text-muted-foreground">{product.fullDescription}</p>
                    {product.fabricDescription && (
                      <div className="p-3 bg-secondary/30 rounded border border-border">
                        <strong className="text-foreground block mb-1">Fabric Story:</strong>
                        <span className="text-muted-foreground">{product.fabricDescription}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 3: Care & Storage */}
                {activeTab === "care" && (
                  <div className="py-4 space-y-3 text-xs animate-in fade-in">
                    <div className="p-3 bg-amber-50 rounded border border-amber-200 text-amber-900 space-y-1">
                      <strong className="block font-bold">Cleaning Instructions:</strong>
                      <span>{product.careInstructions}</span>
                    </div>
                    {product.storageInstructions && (
                      <div className="p-3 bg-secondary/30 rounded border border-border space-y-1 text-muted-foreground">
                        <strong className="block font-bold text-foreground">
                          Storage Guidance:
                        </strong>
                        <span>{product.storageInstructions}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 4: Shipping & Policy */}
                {activeTab === "shipping" && (
                  <div className="py-4 space-y-3 text-xs animate-in fade-in">
                    <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-emerald-900 space-y-1">
                      <strong className="block font-bold">Shipping Information:</strong>
                      <span>{product.shippingInformation}</span>
                    </div>
                    <div className="p-3 bg-secondary/30 rounded border border-border space-y-1 text-muted-foreground">
                      <strong className="block font-bold text-foreground">
                        Final Sale Guarantee:
                      </strong>
                      <span>
                        {product.returnExchangeInfo ||
                          "All sales are final. Each piece undergoes 3-tier quality inspection prior to dispatch."}
                      </span>
                    </div>
                  </div>
                )}

                {/* Tab 5: Product FAQs */}
                {activeTab === "faq" && (
                  <div className="py-4 space-y-3 text-xs animate-in fade-in">
                    {product.faqs && product.faqs.length > 0 ? (
                      product.faqs.map((faq, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-secondary/30 rounded border border-border space-y-1"
                        >
                          <strong className="block text-foreground">{faq.question}</strong>
                          <span className="text-muted-foreground">{faq.answer}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 bg-secondary/30 rounded border border-border text-muted-foreground">
                        Standard shipping, silk mark certification, and handloom care policies apply
                        to this listing.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Try-On Modal */}
      {showTryOnModal && (
        <AITryOnModal
          product={product}
          isOpen={showTryOnModal}
          onClose={() => setShowTryOnModal(false)}
        />
      )}
    </div>
  );
}
