import { createFileRoute, Link } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { ProductCard } from "@/components/site/product";
import { EXPANDED_SAREE_TAXONOMY } from "@/lib/catalog";
import { PRODUCTS } from "@/lib/products";
import { Layers } from "lucide-react";

export const Route = createFileRoute("/sarees")({
  head: () => ({
    meta: [
      { title: "Authentic Indian Sarees — Banarasi, Kanjivaram, Tussar | Mun Creations" },
      {
        name: "description",
        content:
          "Explore 28 saree categories: Banarasi Katan, Kanjivaram, Tussar, Gadwal, Jamdani, Organza, Chikankari & Handloom Sarees.",
      },
    ],
  }),
  component: SareesPage,
});

function SareesPage() {
  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20">
            <SareesContent />
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </I18nProvider>
  );
}

function SareesContent() {
  const sareeProducts = PRODUCTS.filter((p) => p.mainCategory === "sarees" || p.category);

  return (
    <div className="container-boutique space-y-8 sm:space-y-12">
      {/* Hero Header */}
      <div className="bg-white p-5 sm:p-8 md:p-12 rounded-sm border border-border shadow-md text-center space-y-3 sm:space-y-4">
        <div className="eyebrow text-[var(--gold)]">The Royal Saree Treasury</div>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-[var(--wine-deep)] max-w-3xl mx-auto">
          Handwoven Indian Sarees & Heritage Craftsmanship
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
          From the sacred looms of Varanasi to the temple workshops of Kanchipuram and artisan
          clusters of West Bengal, discover 28 authentic weaving taxonomies.
        </p>
      </div>

      {/* 28 Saree Taxonomy Grid */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--wine-deep)] flex items-center gap-2">
            <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--gold)]" />
            <span>Master Saree Weave Families</span>
          </h2>
          <span className="text-xs text-muted-foreground font-mono">28 Categories</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {EXPANDED_SAREE_TAXONOMY.map((fam) => (
            <div
              key={fam.slug}
              className="bg-white p-4 sm:p-6 rounded-sm border border-border shadow-xs hover:shadow-md transition-all space-y-3 sm:space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--wine-deep)]">
                  {fam.title}
                </h3>
                <span className="text-[10px] bg-[var(--wine)]/10 text-[var(--wine)] font-bold px-2 py-0.5 rounded font-mono">
                  {fam.subcategories.length} Types
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {fam.subcategories.map((sub) => (
                  <Link
                    key={sub.slug}
                    to="/shop"
                    search={{ category: sub.name }}
                    className="text-xs bg-secondary/50 hover:bg-[var(--wine)] hover:text-white px-2.5 py-1 rounded-xs transition-colors font-medium text-foreground/80"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Handloom Sarees Showcase */}
      <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--wine-deep)] border-b border-border pb-3">
          Featured Sarees Collection
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {sareeProducts.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
