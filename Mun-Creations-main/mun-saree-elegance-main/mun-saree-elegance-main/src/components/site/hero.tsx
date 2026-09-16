import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { heroSaree } from "@/lib/products";

export function Hero() {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const hasStartedRef = useRef(false);
  const isManuallyPausedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Explicitly enforce DOM properties required for reliable cross-browser autoplay
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

    const attemptPlay = () => {
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
            console.log("Hero video autoplay deferred by browser:", err?.message || err);
            setIsPlaying(false);
          });
      }
    };

    attemptPlay();

    // Fallback: if browser autoplay policy deferred playback, trigger on first user gesture
    const onUserInteraction = () => {
      if (!hasStartedRef.current && !isManuallyPausedRef.current) {
        attemptPlay();
      }
    };

    window.addEventListener("scroll", onUserInteraction, { passive: true });
    window.addEventListener("click", onUserInteraction);
    window.addEventListener("touchstart", onUserInteraction, { passive: true });

    return () => {
      video.removeEventListener("play", handlePlayState);
      video.removeEventListener("pause", handlePauseState);
      video.removeEventListener("volumechange", handleVolumeState);
      window.removeEventListener("scroll", onUserInteraction);
      window.removeEventListener("click", onUserInteraction);
      window.removeEventListener("touchstart", onUserInteraction);
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
    <section className="relative w-full overflow-hidden bg-[var(--wine-deep)] min-h-[85vh] sm:min-h-[90vh] lg:min-h-screen flex flex-col justify-end items-center">
      {/* Full-screen perfectly centered edge-to-edge video background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={heroSaree}
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Soft luxury vignette & bottom gradient for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--wine-deep)] via-[var(--wine-deep)]/50 to-black/35 pointer-events-none" />
      </div>

      {/* Discreet luxury video playback controls */}
      <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-2">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause background video" : "Play background video"}
          className="h-8 w-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[var(--ivory)] hover:bg-black/60 hover:border-[var(--gold)] flex items-center justify-center transition-all cursor-pointer shadow-lg"
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
          className="h-8 w-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[var(--ivory)] hover:bg-black/60 hover:border-[var(--gold)] flex items-center justify-center transition-all cursor-pointer shadow-lg"
        >
          {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--gold)] text-[var(--wine-deep)] px-6 sm:px-8 py-3.5 sm:py-4 text-[11px] tracking-[0.22em] uppercase font-bold hover:bg-[var(--ivory)] transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              {t("hero.cta")}
            </a>
            <a
              href="#bridal"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[var(--ivory)]/80 text-[var(--ivory)] px-6 sm:px-8 py-3.5 sm:py-4 text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-[var(--ivory)]/20 backdrop-blur-md transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
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
