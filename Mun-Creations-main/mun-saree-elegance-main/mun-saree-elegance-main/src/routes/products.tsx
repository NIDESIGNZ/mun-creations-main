import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { ProductCard } from "@/components/site/product";
import { useCatalogProducts } from "@/lib/catalog-client";
import { CATEGORY_FILTERS, FABRIC_FILTERS } from "@/lib/catalog";
import { CANONICAL_COLORS, getColorHex, matchesSelectedColors } from "@/lib/colors";
import { CATALOG_PRICE_TIERS, matchesPriceTier, getProductBasePriceInr } from "@/lib/pricing-config";
import { useSectionContent } from "@/lib/content-client";
import { SlidersHorizontal, X, Sparkles, Search, Check, Filter } from "lucide-react";

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
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedFabric, setSelectedFabric] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data: products = [] } = useCatalogProducts();
  const { data: categoriesCms } = useSectionContent("categories");

  const activeCategoryMeta = useMemo(() => {
    if (!selectedCategory) return categoriesCms?.sarees;
    const catLower = selectedCategory.toLowerCase();
    if (catLower.includes("banarasi")) return categoriesCms?.banarasi;
    if (catLower.includes("tussar")) return categoriesCms?.tussar;
    if (catLower.includes("kanjivaram")) return categoriesCms?.kanjivaram;
    if (catLower.includes("designer")) return categoriesCms?.designer;
    if (catLower.includes("handloom")) return categoriesCms?.handloom;
    if (catLower.includes("wedding") || catLower.includes("festive"))
      return categoriesCms?.["wedding-festive"];
    return categoriesCms?.[selectedCategory];
  }, [selectedCategory, categoriesCms]);

  // Color item counts
  const colorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CANONICAL_COLORS.forEach((c) => {
      counts[c.name] = products.filter((p) => matchesSelectedColors(p, c.name)).length;
    });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
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
        if (selectedColor && !matchesSelectedColors(p, selectedColor)) {
          return false;
        }
        if (selectedPriceTier && !matchesPriceTier(p, selectedPriceTier)) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.fabric.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.color?.toLowerCase().includes(q) ||
            p.colorCombination?.toLowerCase().includes(q) ||
            (p.sku && p.sku.toLowerCase().includes(q));
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (selectedSort === "price-low") {
          return getProductBasePriceInr(a) - getProductBasePriceInr(b);
        }
        if (selectedSort === "price-high") {
          return getProductBasePriceInr(b) - getProductBasePriceInr(a);
        }
        if (selectedSort === "newest") {
          return a.badge === "new" ? -1 : 1;
        }
        return 0;
      });
  }, [products, selectedCategory, selectedFabric, selectedColor, selectedPriceTier, selectedSort, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedFabric("");
    setSelectedColor("");
    setSelectedPriceTier("");
    setSearchQuery("");
  };

  const hasActiveFilters = Boolean(
    selectedCategory || selectedFabric || selectedColor || selectedPriceTier || searchQuery,
  );

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (selectedFabric ? 1 : 0) +
    (selectedColor ? 1 : 0) +
    (selectedPriceTier ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const renderFilterSidebar = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--wine-deep)]">Category</h3>
        <div className="max-h-48 overflow-y-auto space-y-1 text-xs no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory("")}
            className={`w-full text-left py-1.5 px-2 rounded-sm transition-colors ${
              !selectedCategory ? "bg-[var(--wine)] text-white font-semibold" : "hover:bg-secondary/60 text-foreground"
            }`}
          >
            All Categories
          </button>
          {CATEGORY_FILTERS.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
              className={`w-full text-left py-1.5 px-2 rounded-sm transition-colors ${
                selectedCategory === cat ? "bg-[var(--wine)] text-white font-semibold" : "hover:bg-secondary/60 text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Fabric Filter */}
      <div className="space-y-2 pt-2 border-t border-border">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--wine-deep)]">Fabric</h3>
        <div className="flex flex-wrap gap-1.5">
          {FABRIC_FILTERS.map((fab) => (
            <button
              type="button"
              key={fab}
              onClick={() => setSelectedFabric(selectedFabric === fab ? "" : fab)}
              className={`text-[11px] px-2.5 py-1 rounded-sm border transition-colors ${
                selectedFabric === fab
                  ? "bg-[var(--wine-deep)] text-white border-[var(--wine-deep)] font-semibold"
                  : "border-border hover:border-[var(--wine)] text-foreground"
              }`}
            >
              {fab}
            </button>
          ))}
        </div>
      </div>

      {/* 21 Canonical Colors with Swatches */}
      <div className="space-y-2 pt-2 border-t border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--wine-deep)]">Shop by Colour</h3>
          {selectedColor && (
            <button
              type="button"
              onClick={() => setSelectedColor("")}
              className="text-[10px] text-[var(--wine)] hover:underline font-semibold"
            >
              Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto pr-1 no-scrollbar">
          {CANONICAL_COLORS.map((c) => {
            const colorName = c.name;
            const isSelected = selectedColor === colorName;
            const hex = c.hex;
            const count = colorCounts[colorName] || 0;
            const isLightColor = colorName === "White" || colorName === "Off-White" || colorName === "Silver";

            return (
              <button
                key={colorName}
                type="button"
                title={`${colorName} (${count} items)`}
                aria-label={`Filter by ${colorName}`}
                onClick={() => setSelectedColor(isSelected ? "" : colorName)}
                className={`flex items-center justify-between p-1.5 rounded-sm border text-[11px] font-medium transition-all text-left ${
                  isSelected
                    ? "bg-[var(--wine)] text-white border-[var(--wine)] font-semibold shadow-xs"
                    : "border-border/70 hover:border-[var(--wine)] hover:bg-secondary/40 text-foreground"
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0 pr-1">
                  <span
                    className={`h-3.5 w-3.5 rounded-full shrink-0 flex items-center justify-center ${
                      isLightColor ? "border border-border/80" : ""
                    }`}
                    style={{ backgroundColor: hex }}
                  >
                    {isSelected && (
                      <Check className={`h-2.5 w-2.5 ${isLightColor ? "text-slate-900" : "text-white"}`} />
                    )}
                  </span>
                  <span className="whitespace-normal leading-tight break-words">{colorName}</span>
                </div>
                {count > 0 && (
                  <span
                    className={`font-mono text-[10px] shrink-0 px-1 py-0.2 rounded ${
                      isSelected ? "bg-white/20 text-white" : "text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Tier */}
      <div className="space-y-2 pt-2 border-t border-border">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--wine-deep)]">Price Tier</h3>
        <div className="space-y-1 text-xs">
          <button
            type="button"
            onClick={() => setSelectedPriceTier("")}
            className={`w-full text-left py-1.5 px-2 rounded-sm transition-colors ${
              !selectedPriceTier ? "bg-[var(--wine)] text-white font-semibold" : "hover:bg-secondary/60 text-foreground"
            }`}
          >
            All Prices
          </button>
          {CATALOG_PRICE_TIERS.map((tier) => (
            <button
              type="button"
              key={tier.key}
              onClick={() => setSelectedPriceTier(selectedPriceTier === tier.key ? "" : tier.key)}
              className={`w-full text-left py-1.5 px-2 rounded-sm transition-colors flex items-center justify-between ${
                selectedPriceTier === tier.key
                  ? "bg-[var(--wine)] text-white font-semibold"
                  : "hover:bg-secondary/60 text-foreground"
              }`}
            >
              <span>{tier.label}</span>
              <span className="font-mono text-[11px] opacity-80">{tier.rangeInr}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-boutique space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-10 rounded-sm border border-border shadow-xs text-center space-y-3">
        <div className="eyebrow flex items-center justify-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[var(--gold)]" />
          <span>{activeCategoryMeta?.subtitle || "The Master Collection"}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--wine-deep)]">
          {activeCategoryMeta?.title || (selectedCategory ? `${selectedCategory} Sarees` : "All Handcrafted Sarees & Ensembles")}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          {activeCategoryMeta?.description || "Explore our complete treasury of authenticated Banarasi, Kanjivaram, Tussar, and bridal couture."}
        </p>
      </div>

      {/* Search & Sort Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-sm border border-border shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search weaves, fabrics, SKUs, colors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-secondary/30 rounded border border-border focus:outline-none focus:border-[var(--wine)]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white bg-[var(--wine)] px-4 py-2 rounded-sm shadow-xs hover:opacity-95"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="h-4 w-4 rounded-full bg-white text-[var(--wine)] text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="text-xs bg-secondary/30 border border-border rounded px-3 py-2 text-foreground font-medium focus:outline-none focus:border-[var(--wine)] cursor-pointer"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {hasActiveFilters && (
        <div className="bg-white p-3 rounded-sm border border-border shadow-xs flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
            Active:
          </span>
          {selectedCategory && (
            <span className="bg-[var(--wine)] text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium text-[11px]">
              Category: {selectedCategory}
              <X className="h-3 w-3 cursor-pointer hover:opacity-80" onClick={() => setSelectedCategory("")} />
            </span>
          )}
          {selectedFabric && (
            <span className="bg-[var(--wine)] text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium text-[11px]">
              Fabric: {selectedFabric}
              <X className="h-3 w-3 cursor-pointer hover:opacity-80" onClick={() => setSelectedFabric("")} />
            </span>
          )}
          {selectedColor && (
            <span className="bg-[var(--wine)] text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium text-[11px]">
              <span
                className="h-2 w-2 rounded-full inline-block border border-white/40"
                style={{ backgroundColor: getColorHex(selectedColor) }}
              />
              Color: {selectedColor}
              <X className="h-3 w-3 cursor-pointer hover:opacity-80" onClick={() => setSelectedColor("")} />
            </span>
          )}
          {selectedPriceTier && (
            <span className="bg-[var(--wine)] text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium text-[11px]">
              Price: {CATALOG_PRICE_TIERS.find((p) => p.key === selectedPriceTier)?.label || selectedPriceTier}
              <X className="h-3 w-3 cursor-pointer hover:opacity-80" onClick={() => setSelectedPriceTier("")} />
            </span>
          )}
          {searchQuery && (
            <span className="bg-[var(--wine)] text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium text-[11px]">
              Search: "{searchQuery}"
              <X className="h-3 w-3 cursor-pointer hover:opacity-80" onClick={() => setSearchQuery("")} />
            </span>
          )}
          <button
            type="button"
            onClick={resetFilters}
            className="text-[11px] text-[var(--wine)] font-semibold hover:underline ml-1"
          >
            Reset All
          </button>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 sm:gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block bg-white p-5 rounded-sm border border-border space-y-6 shadow-xs sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="font-serif font-bold text-sm uppercase tracking-wider text-[var(--wine-deep)] flex items-center gap-2">
              <Filter className="h-4 w-4 text-[var(--wine)]" />
              <span>Filters</span>
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

          {renderFilterSidebar()}
        </div>

        {/* Product Grid */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-mono">
              Showing {filteredProducts.length} handcrafted items
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5 md:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-sm border border-border space-y-4">
              <Sparkles className="h-10 w-10 text-[var(--gold)] mx-auto" />
              <p className="font-serif text-xl font-bold text-[var(--wine-deep)]">No matching sarees found</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No items matched your selected color and filter specifications. Try clearing your filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="bg-[var(--wine)] text-white text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded-sm shadow-sm hover:opacity-95"
              >
                Show All Sarees
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm h-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[var(--wine)]" />
                <h3 className="font-serif font-bold text-base text-[var(--wine-deep)]">
                  Filter Sarees
                </h3>
                {activeFilterCount > 0 && (
                  <span className="h-5 w-5 rounded-full bg-[var(--wine)] text-white text-[10px] flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary/40"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {renderFilterSidebar()}
            </div>

            <div className="p-4 border-t border-border bg-white flex gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 py-2.5 px-3 border border-border rounded-sm text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground text-center"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-2.5 px-3 bg-[var(--wine)] text-white rounded-sm text-xs font-bold uppercase tracking-wider text-center shadow-md"
              >
                Show Results ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
