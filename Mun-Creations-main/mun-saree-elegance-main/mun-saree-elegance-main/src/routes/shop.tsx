import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useSearch, useNavigate } from "@tanstack/react-router";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { ProductCard } from "@/components/site/product";
import { useCatalogProducts, useCatalogCategories } from "@/lib/catalog-client";
import { CATEGORY_FILTERS, FABRIC_FILTERS } from "@/lib/catalog";
import { CANONICAL_COLORS, getColorHex, matchesSelectedColors } from "@/lib/colors";
import { CATALOG_PRICE_TIERS, matchesPriceTier, getProductBasePriceInr } from "@/lib/pricing-config";
import { Filter, SlidersHorizontal, X, Sparkles, Search, Check } from "lucide-react";

type ShopSearch = {
  category?: string;
  fabric?: string;
  color?: string;
  price?: string;
  sort?: string;
  q?: string;
};

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    return {
      category: typeof search.category === "string" ? search.category : undefined,
      fabric: typeof search.fabric === "string" ? search.fabric : undefined,
      color: typeof search.color === "string" ? search.color : undefined,
      price: typeof search.price === "string" ? search.price : undefined,
      sort: typeof search.sort === "string" ? search.sort : undefined,
      q: typeof search.q === "string" ? search.q : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Shop Luxury Handwoven Sarees & Ensembles — Mun Creations" },
      {
        name: "description",
        content:
          "Explore authentic handloom Banarasi, Kanjivaram, Tussar, and bridal couture with multi-faceted smart color and fabric filters.",
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20">
            <ShopContent />
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </I18nProvider>
  );
}

function ShopContent() {
  const { formatPrice } = useI18n();
  const searchParams = useSearch({ from: "/shop" }) as ShopSearch;
  const navigate = useNavigate();

  // Filter States initialized from URL params
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams?.category || "");
  const [selectedFabric, setSelectedFabric] = useState<string>(searchParams?.fabric || "");
  const [selectedColor, setSelectedColor] = useState<string>(searchParams?.color || "");
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>(searchParams?.price || "");
  const [selectedSort, setSelectedSort] = useState<string>(searchParams?.sort || "featured");
  const [searchQuery, setSearchQuery] = useState<string>(searchParams?.q || "");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state when URL params change externally (e.g. back/forward navigation)
  useEffect(() => {
    setSelectedCategory(searchParams?.category || "");
    setSelectedFabric(searchParams?.fabric || "");
    setSelectedColor(searchParams?.color || "");
    setSelectedPriceTier(searchParams?.price || "");
    setSelectedSort(searchParams?.sort || "featured");
    setSearchQuery(searchParams?.q || "");
  }, [searchParams?.category, searchParams?.fabric, searchParams?.color, searchParams?.price, searchParams?.sort, searchParams?.q]);

  // Sync state to URL params cleanly
  const updateUrlFilters = (updates: Partial<ShopSearch>) => {
    const nextParams: ShopSearch = {
      category: updates.category !== undefined ? updates.category || undefined : selectedCategory || undefined,
      fabric: updates.fabric !== undefined ? updates.fabric || undefined : selectedFabric || undefined,
      color: updates.color !== undefined ? updates.color || undefined : selectedColor || undefined,
      price: updates.price !== undefined ? updates.price || undefined : selectedPriceTier || undefined,
      sort: updates.sort !== undefined ? (updates.sort !== "featured" ? updates.sort : undefined) : (selectedSort !== "featured" ? selectedSort : undefined),
      q: updates.q !== undefined ? updates.q || undefined : searchQuery || undefined,
    };

    navigate({
      to: "/shop",
      search: nextParams,
      replace: true,
    });
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    updateUrlFilters({ category: cat });
  };

  const handleFabricChange = (fab: string) => {
    setSelectedFabric(fab);
    updateUrlFilters({ fabric: fab });
  };

  const handleColorToggle = (color: string) => {
    const nextColor = selectedColor === color ? "" : color;
    setSelectedColor(nextColor);
    updateUrlFilters({ color: nextColor });
  };

  const handlePriceTierToggle = (tierKey: string) => {
    const nextTier = selectedPriceTier === tierKey ? "" : tierKey;
    setSelectedPriceTier(nextTier);
    updateUrlFilters({ price: nextTier });
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    updateUrlFilters({ sort });
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    updateUrlFilters({ q });
  };

  const clearAllFilters = () => {
    setSelectedCategory("");
    setSelectedFabric("");
    setSelectedColor("");
    setSelectedPriceTier("");
    setSearchQuery("");
    navigate({
      to: "/shop",
      search: {},
      replace: true,
    });
  };

  const { data: allProducts = [] } = useCatalogProducts();
  const { data: dynamicCategories = [] } = useCatalogCategories();

  const categoryOptions = useMemo(() => {
    const fromApi = dynamicCategories.map((c) => c.name);
    return Array.from(new Set([...CATEGORY_FILTERS, ...fromApi]));
  }, [dynamicCategories]);

  // Product Counts per canonical color
  const colorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CANONICAL_COLORS.forEach((c) => {
      counts[c.name] = allProducts.filter((p) => matchesSelectedColors(p, c.name)).length;
    });
    return counts;
  }, [allProducts]);

  // Filter & Search Engine
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        // Category Match
        if (
          selectedCategory &&
          p.category.toLowerCase() !== selectedCategory.toLowerCase() &&
          p.subcategory?.toLowerCase() !== selectedCategory.toLowerCase()
        ) {
          return false;
        }
        // Fabric Match
        if (selectedFabric && p.fabric.toLowerCase() !== selectedFabric.toLowerCase()) {
          return false;
        }
        // Color Match (Canonical Color taxonomy & multi-color support)
        if (selectedColor && !matchesSelectedColors(p, selectedColor)) {
          return false;
        }
        // Price Tier Match (Authoritative INR base price)
        if (selectedPriceTier && !matchesPriceTier(p, selectedPriceTier)) {
          return false;
        }
        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesCat = p.category.toLowerCase().includes(q);
          const matchesFab = p.fabric.toLowerCase().includes(q);
          const matchesSku = p.sku?.toLowerCase().includes(q);
          const matchesCol = p.color?.toLowerCase().includes(q) || p.colorCombination?.toLowerCase().includes(q);
          if (!matchesName && !matchesCat && !matchesFab && !matchesSku && !matchesCol) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (selectedSort === "price-asc") {
          return getProductBasePriceInr(a) - getProductBasePriceInr(b);
        }
        if (selectedSort === "price-desc") {
          return getProductBasePriceInr(b) - getProductBasePriceInr(a);
        }
        if (selectedSort === "newest") {
          return a.badge === "new" ? -1 : 1;
        }
        return 0;
      });
  }, [
    allProducts,
    selectedCategory,
    selectedFabric,
    selectedColor,
    selectedPriceTier,
    searchQuery,
    selectedSort,
  ]);

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (selectedFabric ? 1 : 0) +
    (selectedColor ? 1 : 0) +
    (selectedPriceTier ? 1 : 0) +
    (searchQuery ? 1 : 0);

  // Reusable Filter Sidebar Content
  const renderFilterControls = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="space-y-2">
        <label className="font-bold text-xs uppercase tracking-wider block text-[var(--wine-deep)]">
          Category & Weave
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full p-2.5 bg-secondary/20 border border-border rounded-sm text-xs font-medium focus:outline-none focus:border-[var(--wine)] cursor-pointer"
        >
          <option value="">All Categories</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Fabric Filter */}
      <div className="space-y-2">
        <label className="font-bold text-xs uppercase tracking-wider block text-[var(--wine-deep)]">
          Fabric Type
        </label>
        <select
          value={selectedFabric}
          onChange={(e) => handleFabricChange(e.target.value)}
          className="w-full p-2.5 bg-secondary/20 border border-border rounded-sm text-xs font-medium focus:outline-none focus:border-[var(--wine)] cursor-pointer"
        >
          <option value="">All Fabrics</option>
          {FABRIC_FILTERS.map((fab) => (
            <option key={fab} value={fab}>
              {fab}
            </option>
          ))}
        </select>
      </div>

      {/* Price Tier Filter (Canonical INR) */}
      <div className="space-y-2">
        <label className="font-bold text-xs uppercase tracking-wider block text-[var(--wine-deep)]">
          Price Range
        </label>
        <div className="space-y-1 text-xs">
          <button
            type="button"
            onClick={() => handlePriceTierToggle("")}
            className={`w-full text-left p-2 rounded-xs transition-colors ${
              selectedPriceTier === ""
                ? "bg-[var(--wine)] text-white font-bold"
                : "hover:bg-secondary text-foreground"
            }`}
          >
            All Prices
          </button>
          {CATALOG_PRICE_TIERS.map((pt) => {
            const isSelected = selectedPriceTier === pt.key;
            return (
              <button
                type="button"
                key={pt.key}
                onClick={() => handlePriceTierToggle(pt.key)}
                className={`w-full text-left p-2 rounded-xs transition-colors flex items-center justify-between ${
                  isSelected
                    ? "bg-[var(--wine)] text-white font-bold"
                    : "hover:bg-secondary text-foreground"
                }`}
              >
                <span>{pt.label}</span>
                <span className="font-mono text-[11px] opacity-80">{pt.rangeInr}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 21 Canonical Colors with Full Non-Truncated Labels */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <label className="font-bold text-xs uppercase tracking-wider block text-[var(--wine-deep)]">
            Shop by Colour
          </label>
          {selectedColor && (
            <button
              type="button"
              onClick={() => handleColorToggle(selectedColor)}
              className="text-[11px] text-[var(--wine)] hover:underline font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* 2-Column Responsive Grid: Never Truncated */}
        <div className="grid grid-cols-2 gap-1.5 max-h-72 overflow-y-auto pr-1 no-scrollbar">
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
                onClick={() => handleColorToggle(colorName)}
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
    </div>
  );

  return (
    <div className="container-boutique space-y-6">
      {/* Page Title & Search Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-sm border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="eyebrow text-[var(--gold)]">Handwoven Luxury Catalog</div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--wine-deep)]">
            Explore All Collections ({filteredProducts.length} Items)
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Mobile Filter Trigger Button */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[var(--wine)] text-white px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider shadow-sm hover:opacity-95 transition-opacity"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="h-4 w-4 rounded-full bg-white text-[var(--wine)] text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Search Input */}
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search weaves, fabrics, colors..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-secondary/30 border border-border rounded-sm text-xs focus:outline-none focus:border-[var(--wine)] font-medium"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-28">
          <div className="bg-white p-5 rounded-sm border border-border shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="font-serif font-bold text-base text-[var(--wine-deep)] flex items-center gap-2">
                <Filter className="h-4 w-4 text-[var(--wine)]" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="h-5 w-5 rounded-full bg-[var(--wine)] text-white text-[10px] flex items-center justify-center font-bold font-mono">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-[var(--wine)] hover:underline font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {renderFilterControls()}
          </div>
        </div>

        {/* Product Grid & Active Filter Pills */}
        <div className="lg:col-span-9 space-y-6">
          {/* Active Filter Pills Bar */}
          <div className="bg-white p-4 rounded-sm border border-border shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                Active:
              </span>
              {selectedCategory && (
                <span className="bg-[var(--wine)] text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium text-[11px]">
                  Category: {selectedCategory}
                  <X className="h-3 w-3 cursor-pointer hover:opacity-80" onClick={() => handleCategoryChange("")} />
                </span>
              )}
              {selectedFabric && (
                <span className="bg-[var(--wine)] text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium text-[11px]">
                  Fabric: {selectedFabric}
                  <X className="h-3 w-3 cursor-pointer hover:opacity-80" onClick={() => handleFabricChange("")} />
                </span>
              )}
              {selectedColor && (
                <span className="bg-[var(--wine)] text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium text-[11px]">
                  <span
                    className="h-2.5 w-2.5 rounded-full inline-block border border-white/40"
                    style={{ backgroundColor: getColorHex(selectedColor) }}
                  />
                  Color: {selectedColor}
                  <X className="h-3 w-3 cursor-pointer hover:opacity-80" onClick={() => handleColorToggle(selectedColor)} />
                </span>
              )}
              {selectedPriceTier && (
                <span className="bg-[var(--wine)] text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium text-[11px]">
                  Price: {CATALOG_PRICE_TIERS.find((p) => p.key === selectedPriceTier)?.label || selectedPriceTier}
                  <X className="h-3 w-3 cursor-pointer hover:opacity-80" onClick={() => handlePriceTierToggle(selectedPriceTier)} />
                </span>
              )}
              {searchQuery && (
                <span className="bg-[var(--wine)] text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium text-[11px]">
                  Search: "{searchQuery}"
                  <X className="h-3 w-3 cursor-pointer hover:opacity-80" onClick={() => handleSearchChange("")} />
                </span>
              )}
              {activeFilterCount === 0 && (
                <span className="text-muted-foreground italic text-xs">Showing all items</span>
              )}
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-[var(--wine)] hover:underline font-semibold ml-1"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Sorting Control */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium text-xs">Sort By:</span>
              <select
                value={selectedSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="p-1.5 bg-secondary/30 border border-border rounded-sm text-xs font-bold focus:outline-none focus:border-[var(--wine)] cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-sm border border-border space-y-4">
              <Sparkles className="h-10 w-10 text-[var(--gold)] mx-auto" />
              <h3 className="font-serif text-2xl font-bold text-[var(--wine-deep)]">
                No Sarees Found
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No products matched your selected color and filter criteria. Try clearing filters to explore our full
                handloom catalog.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="bg-[var(--wine)] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm shadow-md hover:opacity-95 transition-opacity"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer (Responsive Slide-over) */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm h-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[var(--wine)]" />
                <h3 className="font-serif font-bold text-base text-[var(--wine-deep)]">
                  Filter Catalog
                </h3>
                {activeFilterCount > 0 && (
                  <span className="h-5 w-5 rounded-full bg-[var(--wine)] text-white text-[10px] flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary/40"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {renderFilterControls()}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-border bg-white flex gap-3">
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex-1 py-2.5 px-3 border border-border rounded-sm text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground text-center"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
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
