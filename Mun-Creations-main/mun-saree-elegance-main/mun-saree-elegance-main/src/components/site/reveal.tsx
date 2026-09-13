import { useEffect, useRef } from "react";

export function useWavyReveal<T extends HTMLElement>(delayMs = 0) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => {
              e.target.classList.add("section-wavy-active");
            }, delayMs);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delayMs]);
  return ref;
}

export function WavySection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useWavyReveal<HTMLDivElement>(delay);
  return (
    <div ref={ref} className={`section-wavy ${className}`}>
      {children}
    </div>
  );
}

export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <WavySection className={className}>{children}</WavySection>;
}
