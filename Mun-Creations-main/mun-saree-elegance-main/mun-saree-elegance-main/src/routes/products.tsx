import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { ProductCard } from "@/components/site/product";
import { useCatalogProducts } from "@/lib/catalog-client";
import { CATEGORY_FILTERS, FABRIC_FILTERS, PRICE_TIERS } from "@/lib/catalog";
import { SlidersHorizontal, X, Sparkles, Search } from "lucide-react";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "All Handcrafted Sarees, Kurtis & Couture — Mun Creations" },
      {
        name: "description",
        content:
          "Explore the complete Mun Creations collection of authentic handloom Banarasi, Kanjivaram, Tussar, and Jamdani sarees.",
      },
      { property: "og:title", content: "All Handcrafted Sarees — Mun Creations" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20">
            <ProductsContent />
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </I18nProvider>
  );
}

function ProductsContent() {
  const { formatPrice } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedFabric, setSelectedFabric] = useState<string>("");
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data: products = [] } = useCatalogProducts();

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (
        selectedCategory &&
        p.category.toLowerCase() !== selectedCategory.toLowerCase() &&
        p.subcategory?.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }
      if (selectedFabric && p.fabric.toLowerCase() !== selectedFabric.toLowerCase()) {
        return false;
      }
      if (selectedPriceTier) {
        if (selectedPriceTier === "Budget Collection" && p.priceUsd > 150) return false;
        if (selectedPriceTier === "Mid Range" && (p.priceUsd <= 150 || p.priceUsd > 350)) return false;
        if (selectedPriceTier === "Premium" && (p.priceUsd <= 350 || p.priceUsd > 600)) return false;
        if (selectedPriceTier === "Luxury" && p.priceUsd <= 600) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (selectedSort === "price-low") return a.priceUsd - b.priceUsd;
      if (selectedSort === "price-high") return b.priceUsd - a.priceUsd;
      return 0;
    });
  }, [selectedCategory, selectedFabric, selectedPriceTier, selectedSort, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedFabric("");
    setSelectedPriceTier("");
    setSearchQuery("");
  };

  const hasActiveFilters = Boolean(selectedCategory || selectedFabric || selectedPriceTier || searchQuery);

  return (
    <div className="container-boutique space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-10 rounded-sm border border-border shadow-sm text-center space-y-3">
        <div className="eyebrow flex items-center justify-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[var(--gold)]" />
          <span>The Master Collection</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--wine-deep)]">
          All Handcrafted Sarees & Ensembles
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
          Explore our complete treasury of authenticated Banarasi, Kanjivaram, Tussar, and bridal couture.
        </p>
      </div>

      {/* Search & Sort Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-sm border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search weaves, fabrics, SKUs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-secondary/30 rounded border border-border focus:outline-none focus:border-[var(--wine)]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--wine-deep)] bg-secondary/50 px-3.5 py-2 rounded-sm border border-border"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters ({hasActiveFilters ? "Active" : "All"})</span>
          </button>

          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="text-xs bg-secondary/30 border border-border rounded px-3 py-2 text-foreground font-medium focus:outline-none focus:border-[var(--wine)]"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 sm:gap-8 items-start">
        {/* Sidebar Filters */}
        <div
          className={`${
            showMobileFilters ? "block" : "hidden"
          } lg:block bg-white p-5 rounded-sm border border-border space-y-6 shadow-xs`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="font-serif font-bold text-sm uppercase tracking-wider text-[var(--wine-deep)]">
              Filters
            </h2>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] text-[var(--wine)] font-semibold hover:underline flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</h3>
            <div className="max-h-40 overflow-y-auto space-y-1 text-xs no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategory("")}
                className={`w-full text-left py-1 px-2 rounded ${
                  !selectedCategory ? "bg-[var(--wine)] text-white font-semibold" : "hover:bg-secondary/60"
                }`}
              >
                All Categories
              </button>
              {CATEGORY_FILTERS.slice(0, 15).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left py-1 px-2 rounded ${
                    selectedCategory === cat ? "bg-[var(--wine)] text-white font-semibold" : "hover:bg-secondary/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Fabric Filter */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Fabric</h3>
            <div className="flex flex-wrap gap-1.5">
              {FABRIC_FILTERS.map((fab) => (
                <button
                  type="button"
                  key={fab}
                  onClick={() => setSelectedFabric(selectedFabric === fab ? "" : fab)}
                  className={`text-[11px] px-2.5 py-1 rounded border transition-colors ${
                    selectedFabric === fab
                      ? "bg-[var(--wine-deep)] text-white border-[var(--wine-deep)] font-semibold"
                      : "border-border hover:border-[var(--wine)]"
                  }`}
                >
                  {fab}
                </button>
              ))}
            </div>
          </div>

          {/* Price Tier */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Price Tier</h3>
            <div className="space-y-1 text-xs">
              {PRICE_TIERS.map((tier) => (
                <button
                  type="button"
                  key={tier.label}
                  onClick={() => setSelectedPriceTier(selectedPriceTier === tier.label ? "" : tier.label)}
                  className={`w-full text-left py-1 px-2 rounded ${
                    selectedPriceTier === tier.label
                      ? "bg-[var(--wine)] text-white font-semibold"
                      : "hover:bg-secondary/60"
                  }`}
                >
                  {tier.label} ({formatPrice(tier.min)} - {formatPrice(tier.max)})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-mono">
              Showing {filteredProducts.length} handcrafted items
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded border border-border space-y-3">
              <p className="font-serif text-lg font-bold text-[var(--wine-deep)]">No matching sarees found</p>
              <p className="text-xs text-muted-foreground">
                Try clearing your search criteria or resetting filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="bg-[var(--wine)] text-white text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded"
              >
                Show All Sarees
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
