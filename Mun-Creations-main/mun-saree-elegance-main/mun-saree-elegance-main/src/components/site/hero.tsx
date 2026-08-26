import { useI18n } from "@/lib/i18n";
import { heroSaree } from "@/lib/products";

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative w-full overflow-hidden bg-[var(--wine-deep)] min-h-[85vh] sm:min-h-[90vh] lg:min-h-screen flex flex-col justify-end items-center">
      {/* Full-screen perfectly centered edge-to-edge video background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={heroSaree}
          src="/hero-video.mp4"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover object-center"
        />
        {/* Soft luxury vignette & bottom gradient for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--wine-deep)] via-[var(--wine-deep)]/50 to-black/35" />
      </div>

      {/* Hero content overlay - Positioned cleanly below header */}
      <div className="relative z-10 container-boutique pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-10 sm:pb-14 md:pb-20 text-[var(--ivory)] flex flex-col items-center text-center">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] drop-shadow-[0_4px_14px_rgba(0,0,0,0.8)] text-white">
            {t("hero.title")}
          </h1>
          <p className="text-xs sm:text-base md:text-lg text-[var(--ivory)]/90 max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] font-light px-2 sm:px-0">
            {t("hero.sub")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-2 w-full max-w-md sm:max-w-none mx-auto">
            <a
              href="#collection-section"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--gold)] text-[var(--wine-deep)] px-6 sm:px-8 py-3.5 sm:py-4 text-[11px] tracking-[0.22em] uppercase font-bold hover:bg-[var(--ivory)] transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              {t("hero.cta")}
            </a>
            <a
              href="#bridal"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[var(--ivory)]/80 text-[var(--ivory)] px-6 sm:px-8 py-3.5 sm:py-4 text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-[var(--ivory)]/20 backdrop-blur-md transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              {t("hero.cta2")}
            </a>
          </div>
        </div>

        {/* Trust badges centered */}
        <div className="mt-8 sm:mt-12 md:mt-16 flex flex-wrap justify-center items-center gap-x-4 sm:gap-x-8 gap-y-2 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-[var(--ivory)]/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
          <span>Authentic Handloom</span>
          <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-[var(--gold)]" />
          <span>Ships Worldwide</span>
          <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-[var(--gold)]" />
          <span>Loved by 10,000+ Women</span>
        </div>
      </div>
    </section>
  );
}
