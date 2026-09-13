import { createFileRoute, Link } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { COLLECTION_HIERARCHY } from "@/lib/catalog";
import { Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Curated Saree Collections — Wedding, Festive, Designer | Mun Creations" },
      {
        name: "description",
        content:
          "Explore curated saree collections: Wedding Bridal, Festive, Kathiyawadi, Red & White, Summer Essentials & Hand Embroidery.",
      },
    ],
  }),
  component: CollectionsPage,
});

function CollectionsPage() {
  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20">
            <CollectionsContent />
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </I18nProvider>
  );
}

function CollectionsContent() {
  return (
    <div className="container-boutique space-y-8 sm:space-y-10">
      <div className="bg-white p-5 sm:p-8 md:p-12 rounded-sm border border-border shadow-md text-center space-y-3 sm:space-y-4">
        <div className="eyebrow text-[var(--gold)]">Curated Merchandising Collections</div>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-[var(--wine-deep)] max-w-3xl mx-auto">
          Signature Heritage & Occasionwear Collections
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto px-2 sm:px-0">
          Explore curated fashion edits styled for weddings, traditional pujas, red carpet
          receptions, and summer everyday luxury.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {COLLECTION_HIERARCHY.map((c) => (
          <div
            key={c.slug}
            className="bg-white p-5 sm:p-6 rounded-sm border border-border shadow-xs hover:shadow-lg transition-all space-y-3 sm:space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-[var(--wine)]/10 text-[var(--wine)] flex items-center justify-center border border-[var(--wine)]/20">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--gold)]" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--wine-deep)] group-hover:text-[var(--wine)] transition-colors">
                {c.name}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Handpicked handloom masterworks styled specifically for {c.name.toLowerCase()}{" "}
                occasions.
              </p>
            </div>

            <Link
              to="/shop"
              search={{ category: c.name }}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--wine)] hover:text-[var(--wine-deep)] pt-2 min-h-[44px]"
            >
              <span>Explore Collection</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
