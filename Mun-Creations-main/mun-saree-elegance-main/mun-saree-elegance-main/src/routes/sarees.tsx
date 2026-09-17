import { createFileRoute, Link } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { ProductCard } from "@/components/site/product";
import { EXPANDED_SAREE_TAXONOMY } from "@/lib/catalog";
import { useCatalogProducts } from "@/lib/catalog-client";
import { useSectionContent } from "@/lib/content-client";
import { Layers, Sparkle } from "lucide-react";

export const Route = createFileRoute("/sarees")({
  head: () => ({
    meta: [
      { title: "Buy Sarees Online | Banarasi, Tussar, Kanjivaram & Designer Sarees | Mun Creations" },
      {
        name: "description",
        content:
          "Shop sarees online at Mun Creations. Explore Banarasi, Tussar, Kanjivaram, handloom, silk, designer and festive sarees for weddings, celebrations and everyday elegance.",
      },
      {
        property: "og:title",
        content: "Buy Sarees Online | Banarasi, Tussar, Kanjivaram & Designer Sarees | Mun Creations",
      },
      {
        property: "og:description",
        content:
          "Shop sarees online at Mun Creations. Explore Banarasi, Tussar, Kanjivaram, handloom, silk, designer and festive sarees for weddings, celebrations and everyday elegance.",
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
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 pb-14 sm:pb-20 md:pb-24 bg-secondary/20">
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
  const { data: allProducts = [] } = useCatalogProducts();
  const { data: categoriesCms } = useSectionContent("categories");
  const sareesMeta = categoriesCms?.sarees || {
    title: "Sarees",
    subtitle: "Discover Timeless Indian Sarees",
    description:
      "Explore a curated collection of Indian sarees created for every occasion. From luxurious silk sarees and intricate Banarasi weaves to elegant Tussar and handloom sarees, discover designs that celebrate India's diverse textile heritage.",
    shopByList: [
      "Banarasi Sarees",
      "Kanjivaram Sarees",
      "Tussar Sarees",
      "Handloom Sarees",
      "Designer Sarees",
      "Silk Sarees",
      "Festive Sarees",
      "Wedding Sarees",
      "Embroidered Sarees",
    ],
  };

  const sareeProducts = allProducts.filter((p) => p.mainCategory === "sarees" || p.category);

  return (
    <div className="container-boutique space-y-8 sm:space-y-12">
      {/* Hero Header */}
      <div className="bg-white p-6 sm:p-10 md:p-14 rounded-sm border border-border shadow-xs text-center space-y-3 sm:space-y-4">
        <div className="eyebrow text-[var(--wine)]">{sareesMeta.subtitle}</div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--wine-deep)] max-w-3xl mx-auto">
          {sareesMeta.title}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
          {sareesMeta.description}
        </p>

        {/* Shop By List Tags */}
        {sareesMeta.shopByList && sareesMeta.shopByList.length > 0 && (
          <div className="pt-3 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {sareesMeta.shopByList.map((tag) => (
              <Link
                key={tag}
                to="/shop"
                search={{ category: tag.replace(/\s+sarees/i, "") }}
                className="text-xs bg-[var(--secondary)] hover:bg-[var(--wine)] hover:text-white px-3 py-1.5 rounded-full transition-colors font-medium border border-border/70 flex items-center gap-1.5"
              >
                <Sparkle className="h-3 w-3 text-[var(--gold)]" />
                <span>{tag}</span>
              </Link>
            ))}
          </div>
        )}
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

      {/* Featured Sarees Showcase */}
      <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--wine-deep)] border-b border-border pb-3">
          Featured Sarees Collection
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {sareeProducts.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
