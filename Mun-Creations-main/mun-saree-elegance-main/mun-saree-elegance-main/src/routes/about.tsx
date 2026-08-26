import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { Sparkles, Award, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [{ title: "Our Story — Handwoven Heritage & Weaver Cooperatives | Mun Creations" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20">
            <div className="container-boutique max-w-4xl space-y-8">
              <div className="bg-white p-8 md:p-12 rounded-sm border border-border shadow-md text-center space-y-4">
                <div className="eyebrow text-[var(--gold)]">Preserving Heritage Weaving</div>
                <h1 className="font-serif text-3xl md:text-5xl font-bold text-[var(--wine-deep)]">
                  The Story of Mun Creations
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Founded with a vision to connect master weaver artisans directly with saree connoisseurs around the globe, Mun Creations represents 500+ years of Indian textile legacy.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-white p-6 rounded border border-border space-y-2">
                  <div className="font-serif text-3xl font-bold text-[var(--wine-deep)]">1,200+</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Artisan Weavers</div>
                </div>

                <div className="bg-white p-6 rounded border border-border space-y-2">
                  <div className="font-serif text-3xl font-bold text-[var(--wine-deep)]">28</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Handloom Taxonomies</div>
                </div>

                <div className="bg-white p-6 rounded border border-border space-y-2">
                  <div className="font-serif text-3xl font-bold text-[var(--wine-deep)]">100%</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Silk Mark Certified</div>
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
