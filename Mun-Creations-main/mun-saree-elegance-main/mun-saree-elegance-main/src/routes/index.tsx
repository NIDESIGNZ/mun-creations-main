import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { ProductCarousel, ProductCard, SectionHeading } from "@/components/site/product";
import {
  TrustStrip,
  ShopByFeaturedBlock,
  TussarShowcaseBlock,
  HomepageCollectionsBanner,
  PressStrip,
  StoryBanner,
  Newsletter,
  DepthCarouselShowcase,
} from "@/components/site/sections";
import {
  CatalogFilterSidebar,
  FilterState,
} from "@/components/site/catalog-filter-sidebar";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { WavySection } from "@/components/site/reveal";
import { NEW_ARRIVALS, BESTSELLERS, BRIDAL, ACCESSORIES, PRODUCTS, Product } from "@/lib/products";
import { Sparkle, X, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mun Creations — Handwoven Indian Sarees, Kurtis & Couture" },
      {
        name: "description",
        content:
          "Handcrafted Indian sarees (Banarasi, Kanjivaram, Tussar, Jamdani), Kurtis, Blouses and bridal couture. Woven by master artisans. Ships worldwide.",
      },
      { property: "og:title", content: "Mun Creations — Handwoven Indian Sarees & Ethnic Wear" },
      {
        property: "og:description",
        content: "Timeless sarees, handwoven heritage. Shop Banarasi, Kanjivaram, Tussar, Kurtis, Blouses, and Occasionwear.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const INITIAL_FILTER_STATE: FilterState = {
  categories: [],
  fabrics: [],
  colors: [],
  maxPrice: 2000,
  priceTier: null,
  inStockOnly: false,
};

function Home() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [activeSelectionTitle, setActiveSelectionTitle] = useState<string>("All Catalog Weaves");
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const handleNavFilterSelect = (label: string) => {
    setActiveSelectionTitle(label);
    const query = label.toLowerCase();

    // Check if label matches known category or collection
    if (query === "budget collections" || query === "budget collection") {
      setFilters({ ...INITIAL_FILTER_STATE, maxPrice: 150, priceTier: "Budget Collection" });
    } else if (query.includes("saree") || query.includes("banarasi") || query.includes("kanjivaram") || query.includes("tussar")) {
      const match = PRODUCTS.find((p) => p.category.toLowerCase().includes(query) || p.group?.toLowerCase().includes(query));
      if (match) {
        setFilters({ ...INITIAL_FILTER_STATE, categories: [match.category] });
      } else {
        setActiveSelectionTitle(label);
      }
    } else if (query === "kurti") {
      setFilters({ ...INITIAL_FILTER_STATE, categories: ["Anarkali", "Co-Ord Set"] });
    } else if (query === "blouses") {
      setFilters({ ...INITIAL_FILTER_STATE, categories: ["Blouse"] });
    }

    const el = document.getElementById("collection-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const resetAllFilters = () => {
    setFilters(INITIAL_FILTER_STATE);
    setActiveSelectionTitle("All Catalog Weaves");
  };

  // Multi-faceted filtering logic
  const filteredProducts = PRODUCTS.filter((p) => {
    // Category check
    if (filters.categories.length > 0) {
      const matchesCat = filters.categories.some(
        (cat) =>
          p.category.toLowerCase().includes(cat.toLowerCase()) ||
          p.group?.toLowerCase().includes(cat.toLowerCase()) ||
          p.subcategory?.toLowerCase().includes(cat.toLowerCase())
      );
      if (!matchesCat) return false;
    }

    // Fabric check
    if (filters.fabrics.length > 0) {
      if (!p.fabric || !filters.fabrics.includes(p.fabric)) return false;
    }

    // Color check
    if (filters.colors.length > 0) {
      if (!p.color || !filters.colors.includes(p.color)) return false;
    }

    // Price check
    if (p.priceUsd > filters.maxPrice) return false;

    // Stock check
    if (filters.inStockOnly && !p.inStock) return false;

    return true;
  });

  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
          <Header onSelectCategoryFilter={handleNavFilterSelect} />
          <main className="space-y-4 md:space-y-8">
            <WavySection>
              <Hero />
            </WavySection>

            <WavySection>
              <ShopByFeaturedBlock onSelectFilter={handleNavFilterSelect} />
            </WavySection>

            {/* Master Catalog Section with Multi-Faceted Filters */}
            <WavySection>
              <section id="collection-section" className="py-16 md:py-24 bg-[var(--secondary)]/20 border-b border-border">
                <div className="container-boutique">
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-border">
                    <div>
                      <div className="eyebrow flex items-center gap-2 mb-2">
                        <Sparkle className="h-3.5 w-3.5 text-[var(--wine)]" />
                        <span>Interactive Catalog Browser</span>
                      </div>
                      <h2 className="font-serif text-3xl md:text-4xl text-[var(--wine-deep)] font-bold">
                        {activeSelectionTitle}
                      </h2>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1">
                        Showing {filteredProducts.length} handcrafted items matching your criteria
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="lg:hidden inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--wine-deep)] bg-white px-4 py-2 rounded-sm border border-border shadow-xs"
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        <span>Filter Options</span>
                      </button>

                      {(filters.categories.length > 0 ||
                        filters.fabrics.length > 0 ||
                        filters.colors.length > 0 ||
                        filters.priceTier ||
                        filters.inStockOnly) && (
                        <button
                          onClick={resetAllFilters}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-[var(--wine)] hover:bg-[var(--wine-deep)] px-4 py-2 rounded-sm transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Clear Filters</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Main Grid: Sidebar + Product Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
                    {/* Filter Sidebar (Desktop & Mobile Drawer) */}
                    <div className={`${showMobileFilters ? "block" : "hidden"} lg:block`}>
                      <CatalogFilterSidebar
                        filters={filters}
                        onFilterChange={setFilters}
                        onResetFilters={resetAllFilters}
                      />
                    </div>

                    {/* Product Cards Grid */}
                    <div>
                      {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                          {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16 px-4 bg-white rounded-sm border border-border">
                          <p className="font-serif text-xl text-[var(--wine-deep)]">No exact matches found</p>
                          <p className="text-xs text-muted-foreground mt-2 max-w-sm mx-auto">
                            Try broadening your category choices, removing fabric or color restrictions, or resetting filters.
                          </p>
                          <button
                            onClick={resetAllFilters}
                            className="mt-4 bg-[var(--wine)] text-white text-xs uppercase tracking-wider px-6 py-2.5 rounded-sm font-semibold hover:bg-[var(--wine-deep)] transition-colors"
                          >
                            Show All Products
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </WavySection>

            <WavySection>
              <TussarShowcaseBlock onSelectFilter={handleNavFilterSelect} />
            </WavySection>

            <WavySection>
              <HomepageCollectionsBanner onSelectFilter={handleNavFilterSelect} />
            </WavySection>

            <WavySection>
              <section id="new" className="py-20 md:py-28">
                <div className="container-boutique">
                  <SectionSubHeading kind="new" />
                  <ProductCarousel products={NEW_ARRIVALS} />
                </div>
              </section>
            </WavySection>

            <WavySection>
              <TrustStrip />
            </WavySection>

            <WavySection>
              <section className="py-20 md:py-28 bg-[var(--secondary)]/40">
                <div className="container-boutique">
                  <SectionSubHeading kind="best" />
                  <ProductCarousel products={BESTSELLERS} />
                </div>
              </section>
            </WavySection>

            <WavySection>
              <PressStrip />
            </WavySection>

            <WavySection>
              <DepthCarouselShowcase />
            </WavySection>

            <WavySection>
              <StoryBanner />
            </WavySection>

            <WavySection>
              <section id="bridal" className="py-20 md:py-28">
                <div className="container-boutique">
                  <SectionSubHeading kind="wedding" />
                  <ProductCarousel products={[...BRIDAL, ...BESTSELLERS.slice(0, 2)]} />
                </div>
              </section>
            </WavySection>

            <WavySection>
              <Newsletter />
            </WavySection>
          </main>
          <WavySection>
            <Footer />
          </WavySection>
          <CartDrawer />
        </div>
      </CartProvider>
    </I18nProvider>
  );
}

function SectionSubHeading({ kind }: { kind: "new" | "best" | "wedding" }) {
  const { t } = useI18n();
  const map = {
    new: { eyebrow: "Just In", title: t("section.new"), sub: t("section.new.sub") },
    best: { eyebrow: "Loved by Many", title: t("section.best"), sub: t("section.best.sub") },
    wedding: { eyebrow: "Occasion Wear", title: t("section.wedding"), sub: t("section.wedding.sub") },
  }[kind];
  return <SectionHeading eyebrow={map.eyebrow} title={map.title} sub={map.sub} />;
}
