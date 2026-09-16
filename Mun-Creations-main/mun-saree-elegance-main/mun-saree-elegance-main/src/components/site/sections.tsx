import { useState, useRef, useEffect } from "react";
import { Sparkles, RotateCcw, Plane, Award, Sparkle, Gem, ShoppingBag, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import {
  catSilk,
  catBridal,
  catCotton,
  storyWeaver,
  productTeal,
  productPink,
  heroSaree,
  tussarTribalFusion,
  type Product,
} from "@/lib/products";
import { useCatalogProducts } from "@/lib/catalog-client";
import { SectionHeading } from "./product";
import { ProductDetailModal } from "./product-detail-modal";
import {
  FEATURED_SHOP_BY_CATEGORIES,
  TUSSAR_MERCHANDISING_BLOCK,
} from "@/lib/catalog";

export function TrustStrip() {
  const { t } = useI18n();
  const items = [
    { icon: Sparkles, label: t("trust.handcrafted") },
    { icon: RotateCcw, label: t("trust.returns") },
    { icon: Plane, label: t("trust.shipping") },
    { icon: Award, label: t("trust.authentic") },
  ];
  return (
    <section className="border-y border-border bg-[var(--secondary)]/60">
      <div className="container-boutique grid grid-cols-2 md:grid-cols-4 gap-y-6 sm:gap-y-8 py-8 sm:py-10 md:py-12">
        {items.map((it) => (
          <div key={it.label} className="flex flex-col items-center text-center gap-2 px-2">
            <it.icon className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--wine)]" strokeWidth={1.2} />
            <div className="text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.22em] uppercase text-foreground/80 font-medium">
              {it.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

interface FilterCallbackProps {
  onSelectFilter?: (filterLabel: string, filterType?: string) => void;
}

export function ShopByFeaturedBlock({ onSelectFilter }: FilterCallbackProps) {
  const handleClick = (name: string) => {
    if (onSelectFilter) {
      onSelectFilter(name, "featured");
    } else {
      const el = document.getElementById("collection-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[var(--secondary)]/40 border-y border-border">
      <div className="container-boutique">
        <SectionHeading
          eyebrow="Merchandising Edit"
          title="Featured Shop By Categories"
          sub="Explore our signature Banarasi, Kanjivaram, Zardosi & Chikankari edits"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {FEATURED_SHOP_BY_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleClick(cat.name)}
              className="group flex flex-col items-center p-4 sm:p-5 rounded-sm bg-white border border-border/70 shadow-xs hover:border-[var(--gold)] hover:shadow-md transition-all text-center cursor-pointer"
            >
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[var(--wine)]/10 text-[var(--wine)] flex items-center justify-center mb-2.5 sm:mb-3 group-hover:bg-[var(--wine)] group-hover:text-[var(--gold)] transition-colors">
                <Sparkle className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="text-xs sm:text-sm font-serif font-bold text-[var(--wine-deep)] group-hover:text-[var(--wine)] leading-snug">
                {cat.name}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground mt-1 group-hover:text-[var(--gold)]">
                Shop Collection →
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TussarShowcaseBlock({ onSelectFilter }: FilterCallbackProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addedToast, setAddedToast] = useState(false);
  const { add } = useCart();
  const { formatPrice } = useI18n();

  const { data: allProducts = [] } = useCatalogProducts();
  const awardWinningSaree =
    allProducts.find((p) => p.id === "p5" || p.sku === "TFH-TUSSAR-01" || p.category.toLowerCase().includes("tussar")) || allProducts[0];
  const allPhotos =
    awardWinningSaree?.images && awardWinningSaree.images.length > 0
      ? awardWinningSaree.images
      : [awardWinningSaree?.image || tussarTribalFusion];
  const [activeSpotlightImg, setActiveSpotlightImg] = useState<string>(allPhotos[0]);

  if (!awardWinningSaree) return null;

  const handleAddToCart = () => {
    add(awardWinningSaree);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2400);
  };

  const handleClick = (name: string) => {
    if (onSelectFilter) {
      onSelectFilter(name, "tussar");
    } else {
      const el = document.getElementById("collection-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="py-12 sm:py-16 md:py-20 bg-[var(--wine-deep)] text-[var(--ivory)] relative overflow-hidden"
      aria-label="Tussar Heritage Collections"
    >
      <div className="container-boutique">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[var(--gold)] font-bold mb-2 flex items-center gap-2">
              <Gem className="h-3.5 w-3.5" />
              <span>National & International Award Winning Saree</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl text-white font-bold">
              Tussar Heritage Collections
            </h2>
            <p className="text-xs sm:text-sm text-white/70 mt-2 max-w-xl">
              Authentic high quality super purified Triple twisted international standard TUSSAR
              sarees handcrafted by master weavers.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleClick("Tussar")}
            className="text-xs uppercase tracking-widest text-[var(--gold)] hover:text-white border-b border-[var(--gold)] pb-1 font-semibold self-start md:self-auto cursor-pointer"
          >
            Browse All Tussar Sarees →
          </button>
        </div>

        {/* Flagship Award-Winning Saree Spotlight Card */}
        <div className="mb-10 sm:mb-12 bg-white/5 border border-[var(--gold)]/30 rounded-lg overflow-hidden backdrop-blur-md grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 p-4 sm:p-6 lg:p-8 items-center shadow-2xl">
          <div className="lg:col-span-5 space-y-3">
            <div className="relative group overflow-hidden rounded-md aspect-[3/4] max-h-[380px] sm:max-h-[440px]">
              <img
                src={activeSpotlightImg}
                alt={awardWinningSaree.name}
                className="w-full h-full object-cover object-top rounded-md transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-2.5 left-2.5 bg-[var(--gold)] text-[var(--wine-deep)] px-2.5 py-1 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase rounded shadow-md">
                Award Winning Saree
              </div>
              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/60 backdrop-blur-xs p-2 sm:p-2.5 rounded text-xs text-white flex justify-between items-center">
                <span>
                  {awardWinningSaree.color}
                  {awardWinningSaree.secondaryColor ? ` & ${awardWinningSaree.secondaryColor}` : ""}
                </span>
                <span className="text-[10px] text-[var(--gold)] font-mono">
                  {allPhotos.length} Master Photos
                </span>
              </div>
            </div>

            {/* Thumbnail selector */}
            <div
              className="flex gap-2 overflow-x-auto pb-1 no-scrollbar"
              role="group"
              aria-label="Product image gallery"
            >
              {allPhotos.map((imgSrc: string, idx: number) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setActiveSpotlightImg(imgSrc)}
                  aria-label={`View photo ${idx + 1} of ${awardWinningSaree.name}`}
                  aria-pressed={activeSpotlightImg === imgSrc}
                  className={`h-12 w-10 sm:h-14 sm:w-12 rounded border overflow-hidden shrink-0 transition-all cursor-pointer ${
                    activeSpotlightImg === imgSrc
                      ? "border-[var(--gold)] ring-2 ring-[var(--gold)]/50 scale-105"
                      : "border-white/20 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgSrc}
                    alt={`${awardWinningSaree.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between space-y-4 sm:space-y-5 text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-[var(--gold)] px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold mb-2 sm:mb-3">
                <Award className="h-3.5 w-3.5" />
                <span>National & International Award Winning Saree</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-white font-bold leading-snug">
                {awardWinningSaree.name}
              </h3>
              <p className="text-[var(--gold)] font-mono text-xl sm:text-2xl font-bold mt-1.5">
                {formatPrice(awardWinningSaree.priceUsd)}
              </p>
            </div>

            <div className="bg-black/25 p-3.5 sm:p-4 rounded border border-white/10 text-xs sm:text-sm text-white/90 leading-relaxed font-light space-y-2">
              <p className="font-semibold text-[var(--gold)] uppercase tracking-wider text-[10px] sm:text-[11px]">
                Craftsmanship & Description:
              </p>
              <p className="line-clamp-4">
                {awardWinningSaree.fullDescription || awardWinningSaree.shortDescription}
              </p>
              <div className="pt-2 border-t border-white/10 text-xs text-white/70 flex flex-wrap gap-x-4 gap-y-1">
                <span>
                  <strong>Color:</strong> {awardWinningSaree.color}
                  {awardWinningSaree.secondaryColor ? ` & ${awardWinningSaree.secondaryColor}` : ""}
                </span>
                <span>•</span>
                <span>
                  <strong>Fabric:</strong> {awardWinningSaree.fabric}
                </span>
                {awardWinningSaree.palluType && (
                  <>
                    <span>•</span>
                    <span>
                      <strong>Pallu:</strong> {awardWinningSaree.palluType}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full sm:flex-1 bg-[var(--gold)] text-[var(--wine-deep)] py-3 sm:py-3.5 px-6 rounded text-xs font-bold uppercase tracking-widest hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>
                  {addedToast
                    ? "Added to Cart!"
                    : `Add to Cart — ${formatPrice(awardWinningSaree.priceUsd)}`}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedProduct(awardWinningSaree)}
                className="w-full sm:w-auto py-3 sm:py-3.5 px-6 rounded text-xs font-semibold uppercase tracking-widest border border-white/30 text-white hover:bg-white/10 transition-all min-h-[44px] cursor-pointer"
              >
                Quick View Details
              </button>
            </div>
          </div>
        </div>

        {/* Subcategories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
          {TUSSAR_MERCHANDISING_BLOCK.map((tussar) => (
            <button
              type="button"
              key={tussar.slug}
              onClick={() => handleClick(tussar.name)}
              className="group p-3.5 sm:p-4 rounded-sm bg-white/5 hover:bg-[var(--gold)]/20 border border-white/10 hover:border-[var(--gold)]/50 transition-all text-left flex flex-col justify-between min-h-[90px] sm:min-h-[110px] cursor-pointer"
            >
              <span className="text-xs font-serif font-bold text-white group-hover:text-[var(--gold)]">
                {tussar.name}
              </span>
              <span className="text-[9px] sm:text-[10px] text-white/60 group-hover:text-white uppercase tracking-wider">
                Explore Edit →
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  );
}

export function PressStrip() {
  const { t } = useI18n();
  const PRESS = ["Vogue India", "ELLE", "Femina", "Harper's Bazaar", "Grazia", "Cosmopolitan"];
  return (
    <section className="py-10 sm:py-14 md:py-16 border-y border-border bg-[var(--secondary)]/40 overflow-hidden">
      <div className="container-boutique">
        <div className="eyebrow text-center mb-6 sm:mb-8">{t("section.press")}</div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-12 md:gap-x-16 gap-y-4">
          {PRESS.map((p) => (
            <span
              key={p}
              className="font-serif italic text-base sm:text-xl md:text-2xl text-foreground/45 tracking-wide"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StoryBanner() {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const hasStartedRef = useRef(false);
  const isManuallyPausedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video) return;

    // Explicitly set DOM properties for reliable autoplay
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const handlePlayState = () => {
      hasStartedRef.current = true;
      setIsPlaying(true);
    };
    const handlePauseState = () => setIsPlaying(false);
    const handleVolumeState = () => setIsMuted(video.muted);

    video.addEventListener("play", handlePlayState);
    video.addEventListener("pause", handlePauseState);
    video.addEventListener("volumechange", handleVolumeState);

    const playVideo = () => {
      if (!video || isManuallyPausedRef.current) return;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            hasStartedRef.current = true;
            setIsPlaying(true);
          })
          .catch((err) => {
            console.log("Story video playback waiting for interaction:", err?.message || err);
            setIsPlaying(false);
          });
      }
    };

    const pauseVideo = () => {
      if (!video) return;
      video.pause();
      setIsPlaying(false);
    };

    // Automatically plays when scrolled into view, pauses when scrolled out
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isManuallyPausedRef.current) {
              playVideo();
            }
          } else {
            pauseVideo();
          }
        });
      },
      { threshold: 0.15 }
    );

    if (container) observer.observe(container);

    // Scroll & interaction fallback so user scrolling satisfies gesture requirement
    const onInteraction = () => {
      if (!hasStartedRef.current && !isManuallyPausedRef.current && video.paused && container) {
        const rect = container.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          playVideo();
        }
      }
    };

    window.addEventListener("scroll", onInteraction, { passive: true });
    window.addEventListener("click", onInteraction);
    window.addEventListener("touchstart", onInteraction, { passive: true });

    return () => {
      video.removeEventListener("play", handlePlayState);
      video.removeEventListener("pause", handlePauseState);
      video.removeEventListener("volumechange", handleVolumeState);
      if (container) observer.unobserve(container);
      observer.disconnect();
      window.removeEventListener("scroll", onInteraction);
      window.removeEventListener("click", onInteraction);
      window.removeEventListener("touchstart", onInteraction);
    };
  }, []);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      isManuallyPausedRef.current = false;
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      isManuallyPausedRef.current = true;
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section className="py-14 sm:py-20 md:py-24 bg-[var(--secondary)]/40">
      <div className="container-boutique grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
        <div
          ref={containerRef}
          onClick={() => togglePlay()}
          className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-xl bg-[var(--wine-deep)] cursor-pointer group"
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={storyWeaver}
            className="h-full w-full object-cover"
          >
            <source src="/story-video.mp4" type="video/mp4" />
          </video>

          {/* Discreet luxury playback controls */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/20 opacity-90 group-hover:opacity-100 transition-opacity shadow-lg"
          >
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause craft story video" : "Play craft story video"}
              className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/25 text-[var(--ivory)] hover:text-[var(--gold)] flex items-center justify-center transition-all cursor-pointer"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute craft story video" : "Mute craft story video"}
              className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/25 text-[var(--ivory)] hover:text-[var(--gold)] flex items-center justify-center transition-all cursor-pointer"
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>
          </div>

          <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 hidden sm:block bg-[var(--ivory)] px-6 sm:px-8 py-4 sm:py-6 shadow-xl z-10 border border-border pointer-events-none">
            <div className="font-serif text-3xl sm:text-4xl text-[var(--wine)]">240+</div>
            <div className="eyebrow mt-1">Weaving Families</div>
          </div>
        </div>
        <div>
          <div className="eyebrow mb-3 sm:mb-4">{t("section.story.eyebrow")}</div>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl leading-[1.1] text-[var(--wine-deep)] mb-4 sm:mb-6">
            {t("section.story.title")}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-foreground/75 mb-6 sm:mb-8 max-w-xl">
            {t("section.story.body")}
          </p>
          <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 border-y border-border py-4 sm:py-6 max-w-md">
            <div>
              <div className="font-serif text-xl sm:text-2xl text-[var(--wine)]">1998</div>
              <div className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-1">
                Est.
              </div>
            </div>
            <div>
              <div className="font-serif text-xl sm:text-2xl text-[var(--wine)]">42</div>
              <div className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-1">
                Countries
              </div>
            </div>
            <div>
              <div className="font-serif text-xl sm:text-2xl text-[var(--wine)]">10k+</div>
              <div className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-1">
                Women
              </div>
            </div>
          </div>
          <a
            href="/about"
            className="inline-flex items-center justify-center gap-2 bg-[var(--wine)] text-[var(--ivory)] px-6 sm:px-8 py-3.5 text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-[var(--wine-deep)] transition-colors min-h-[44px]"
          >
            {t("section.story.cta")}
          </a>
        </div>
      </div>
    </section>
  );
}

export function Newsletter() {
  const { t } = useI18n();
  return (
    <section className="py-14 sm:py-20 md:py-24 bg-[var(--wine-deep)] text-[var(--ivory)] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, var(--gold) 1px, transparent 1px), radial-gradient(circle at 60% 70%, var(--gold) 1px, transparent 1px)",
          backgroundSize: "40px 40px, 60px 60px",
        }}
      />
      <div className="container-boutique text-center relative">
        <div className="text-[10px] tracking-[0.32em] uppercase text-[var(--gold)] mb-3 sm:mb-4">
          Newsletter
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">
          {t("news.title")}
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-[var(--ivory)]/70 max-w-md mx-auto mb-6 sm:mb-8">
          {t("news.sub")}
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3 px-2 sm:px-0"
        >
          <input
            type="email"
            required
            placeholder={t("news.placeholder")}
            className="flex-1 bg-transparent border border-[var(--ivory)]/30 px-4 sm:px-5 py-3 sm:py-3.5 text-sm placeholder:text-[var(--ivory)]/50 focus:outline-none focus:border-[var(--gold)] rounded-xs"
          />
          <button
            type="submit"
            className="bg-[var(--gold)] text-[var(--wine-deep)] px-6 sm:px-7 py-3 sm:py-3.5 text-[11px] tracking-[0.22em] uppercase font-bold hover:bg-[var(--ivory)] transition-colors min-h-[44px] cursor-pointer"
          >
            {t("news.cta")}
          </button>
        </form>
      </div>
    </section>
  );
}
