import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { useSectionContent } from "@/lib/content-client";
import { Sparkles, CheckCircle2, Heart, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Mun Creations | Indian Sarees & Traditional Craftsmanship" },
      {
        name: "description",
        content:
          "Learn about Mun Creations, a curated destination for Banarasi, Tussar, Kanjivaram, handloom and designer sarees inspired by India's rich textile heritage.",
      },
      { property: "og:title", content: "About Mun Creations | Indian Sarees & Traditional Craftsmanship" },
      {
        property: "og:description",
        content:
          "Learn about Mun Creations, a curated destination for Banarasi, Tussar, Kanjivaram, handloom and designer sarees inspired by India's rich textile heritage.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: about } = useSectionContent("about");

  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 pb-16 md:pb-24 bg-gradient-to-b from-secondary/30 via-background to-secondary/20">
            <div className="container-boutique max-w-4xl space-y-12">
              {/* Header Hero */}
              <div className="bg-white p-8 md:p-14 rounded-sm border border-border shadow-xs text-center space-y-4">
                <div className="eyebrow text-[var(--wine)]">
                  {about.eyebrow || "About Mun Creations"}
                </div>
                <h1 className="font-serif text-3xl md:text-5xl font-bold text-[var(--wine-deep)] tracking-tight">
                  {about.title || "Celebrating India's Textile Heritage"}
                </h1>
                <div className="max-w-2xl mx-auto space-y-4 text-xs md:text-sm text-muted-foreground leading-relaxed pt-2">
                  <p>{about.introP1}</p>
                  <p>{about.introP2}</p>
                  <p className="font-medium text-foreground">{about.introP3}</p>
                </div>
              </div>

              {/* Our Philosophy */}
              <div className="bg-white p-8 md:p-12 rounded-sm border border-border shadow-xs space-y-6">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <div className="eyebrow text-[var(--gold)]">
                    {about.philosophy?.title || "Our Philosophy"}
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--wine-deep)]">
                    {about.philosophy?.subtitle || "Tradition. Craftsmanship. Elegance."}
                  </h2>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {about.philosophy?.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4">
                  {(about.philosophy?.styles || []).map((style) => (
                    <div
                      key={style}
                      className="p-3.5 rounded bg-[var(--secondary)]/40 border border-border/70 flex items-center gap-2.5 text-xs font-semibold text-foreground/90"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-[var(--gold)] shrink-0" />
                      <span>{style}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Our Promise */}
              <div className="bg-gradient-to-r from-[var(--wine-deep)] to-[var(--wine)] text-white p-8 md:p-12 rounded-sm text-center space-y-4 shadow-xl">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-[var(--gold)] mx-auto">
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white">
                  {about.promise?.title || "Our Promise"}
                </h3>
                <p className="text-xs md:text-sm text-white/85 leading-relaxed max-w-2xl mx-auto">
                  {about.promise?.description}
                </p>
                <div className="pt-4">
                  <a
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-[var(--gold)] hover:bg-white text-slate-950 font-bold px-6 py-3 text-xs uppercase tracking-widest rounded transition-colors shadow-md"
                  >
                    <span>Explore Our Sarees</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </I18nProvider>
  );
}
