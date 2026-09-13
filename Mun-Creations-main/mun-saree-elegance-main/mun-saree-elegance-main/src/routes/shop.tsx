import { useState, useMemo } from "react";
import { createFileRoute, useSearch, useNavigate } from "@tanstack/react-router";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { ProductCard } from "@/components/site/product";
import { backendDB } from "@/lib/backend-api";
import { CATEGORY_FILTERS, FABRIC_FILTERS, COLOR_FILTERS, PRICE_TIERS } from "@/lib/catalog";
import { Filter, SlidersHorizontal, X, ChevronDown, Sparkles, Search, Check } from "lucide-react";

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
      { title: "Shop Luxury Sarees, Kurtis & Blouses — Mun Creations" },
      {
        name: "description",
        content:
          "Browse our handwoven Banarasi, Kanjivaram, Tussar, Organza & Chikankari sarees with custom filters.",
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
  const searchParams = useSearch({ from: "/shop" }) as any;
  const navigate = useNavigate();

  // Filter States initialized from URL params
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams?.category || "");
  const [selectedFabric, setSelectedFabric] = useState<string>(searchParams?.fabric || "");
  const [selectedColor, setSelectedColor] = useState<string>(searchParams?.color || "");
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>(searchParams?.price || "");
  const [selectedSort, setSelectedSort] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const allProducts = backendDB.getProducts();

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
        // Color Match
        if (selectedColor && p.color.toLowerCase() !== selectedColor.toLowerCase()) {
          return false;
        }
        // Price Tier Match
        if (selectedPriceTier) {
          if (selectedPriceTier === "Budget Collection" && p.priceUsd > 150) return false;
          if (selectedPriceTier === "Mid Range" && (p.priceUsd <= 150 || p.priceUsd > 350))
            return false;
          if (selectedPriceTier === "Premium" && (p.priceUsd <= 350 || p.priceUsd > 600))
            return false;
          if (selectedPriceTier === "Luxury" && p.priceUsd <= 600) return false;
        }
        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesCat = p.category.toLowerCase().includes(q);
          const matchesFab = p.fabric.toLowerCase().includes(q);
          const matchesSku = p.sku?.toLowerCase().includes(q);
          if (!matchesName && !matchesCat && !matchesFab && !matchesSku) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (selectedSort === "price-asc") return a.priceUsd - b.priceUsd;
        if (selectedSort === "price-desc") return b.priceUsd - a.priceUsd;
        if (selectedSort === "newest") return a.badge === "new" ? -1 : 1;
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

  const clearAllFilters = () => {
    setSelectedCategory("");
    setSelectedFabric("");
    setSelectedColor("");
    setSelectedPriceTier("");
    setSearchQuery("");
  };

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (selectedFabric ? 1 : 0) +
    (selectedColor ? 1 : 0) +
    (selectedPriceTier ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="container-boutique space-y-6">
      {/* Page Title & Search Bar */}
      <div className="bg-white p-6 rounded-sm border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="eyebrow text-[var(--gold)]">Handwoven Luxury Catalog</div>
          <h1 className="font-serif text-3xl font-bold text-[var(--wine-deep)]">
            Explore All Collections ({filteredProducts.length} Items)
          </h1>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by SKU, fabric, weave..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-secondary/30 border border-border rounded-sm text-xs focus:outline-none focus:border-[var(--wine)] font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-sm border border-border shadow-sm space-y-5">
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
                  onClick={clearAllFilters}
                  className="text-xs text-[var(--wine)] hover:underline font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="font-bold text-xs uppercase tracking-wider block">
                Category & Weave
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 bg-secondary/20 border border-border rounded-sm text-xs font-medium focus:outline-none focus:border-[var(--wine)]"
              >
                <option value="">All Categories</option>
                {CATEGORY_FILTERS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Fabric Filter */}
            <div className="space-y-2">
              <label className="font-bold text-xs uppercase tracking-wider block">
                Fabric Type
              </label>
              <select
                value={selectedFabric}
                onChange={(e) => setSelectedFabric(e.target.value)}
                className="w-full p-2 bg-secondary/20 border border-border rounded-sm text-xs font-medium focus:outline-none focus:border-[var(--wine)]"
              >
                <option value="">All Fabrics</option>
                {FABRIC_FILTERS.map((fab) => (
                  <option key={fab} value={fab}>
                    {fab}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Tier Filter */}
            <div className="space-y-2">
              <label className="font-bold text-xs uppercase tracking-wider block">
                Price Range
              </label>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedPriceTier("")}
                  className={`w-full text-left p-2 rounded-xs transition-colors ${
                    selectedPriceTier === ""
                      ? "bg-[var(--wine)] text-white font-bold"
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  All Prices
                </button>
                {PRICE_TIERS.map((pt) => (
                  <button
                    key={pt.label}
                    onClick={() => setSelectedPriceTier(pt.label)}
                    className={`w-full text-left p-2 rounded-xs transition-colors ${
                      selectedPriceTier === pt.label
                        ? "bg-[var(--wine)] text-white font-bold"
                        : "hover:bg-secondary text-foreground"
                    }`}
                  >
                    {pt.label} ({formatPrice(pt.min)} - {formatPrice(pt.max)})
                  </button>
                ))}
              </div>
            </div>

            {/* Colour Filter Swatches */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="font-bold text-xs uppercase tracking-wider block">
                Shop by Colour
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {COLOR_FILTERS.slice(0, 14).map((c) => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => setSelectedColor(selectedColor === c.name ? "" : c.name)}
                    className={`h-7 w-7 rounded-full border transition-all flex items-center justify-center ${
                      selectedColor === c.name
                        ? "ring-2 ring-[var(--wine)] scale-110 border-white shadow-md"
                        : "border-border/60 hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {selectedColor === c.name && (
                      <Check className="h-3 w-3 text-white drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid & Active Filter Pills */}
        <div className="lg:col-span-9 space-y-6">
          {/* Active Filter Pills Bar */}
          <div className="bg-white p-4 rounded-sm border border-border shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-muted-foreground uppercase tracking-wider">
                Active:
              </span>
              {selectedCategory && (
                <span className="bg-[var(--wine)] text-white px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                  Category: {selectedCategory}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("")} />
                </span>
              )}
              {selectedFabric && (
                <span className="bg-[var(--wine)] text-white px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                  Fabric: {selectedFabric}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedFabric("")} />
                </span>
              )}
              {selectedColor && (
                <span className="bg-[var(--wine)] text-white px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                  Colour: {selectedColor}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedColor("")} />
                </span>
              )}
              {selectedPriceTier && (
                <span className="bg-[var(--wine)] text-white px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                  Price: {selectedPriceTier}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedPriceTier("")} />
                </span>
              )}
              {activeFilterCount === 0 && (
                <span className="text-muted-foreground italic">Showing all items</span>
              )}
            </div>

            {/* Sorting Control */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-semibold">Sort By:</span>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="p-1.5 bg-secondary/30 border border-border rounded-sm text-xs font-bold focus:outline-none focus:border-[var(--wine)]"
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
                No products matched your selected filters. Try clearing filters to explore our full
                handloom catalog.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-[var(--wine)] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm shadow-md"
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
    </div>
  );
}
