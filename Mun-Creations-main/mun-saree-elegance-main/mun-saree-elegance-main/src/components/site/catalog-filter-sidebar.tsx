import { useState } from "react";
import { Search, X, Check, Filter, RotateCcw, ChevronDown } from "lucide-react";
import {
  CATEGORY_FILTERS,
  FABRIC_FILTERS,
  COLOR_FILTERS,
  PRICE_TIERS,
  ColorFilter,
} from "@/lib/catalog";

export type FilterState = {
  categories: string[];
  fabrics: string[];
  colors: string[];
  maxPrice: number;
  priceTier: string | null;
  inStockOnly: boolean;
};

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
}

export function CatalogFilterSidebar({
  filters,
  onFilterChange,
  onResetFilters,
}: FilterSidebarProps) {
  const [categorySearch, setCategorySearch] = useState("");
  const [catExpanded, setCatExpanded] = useState(true);
  const [fabricExpanded, setFabricExpanded] = useState(true);
  const [colorExpanded, setColorExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(true);

  const filteredCategoryList = CATEGORY_FILTERS.filter((c) =>
    c.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const toggleCategory = (cat: string) => {
    const exists = filters.categories.includes(cat);
    const updated = exists
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onFilterChange({ ...filters, categories: updated });
  };

  const toggleFabric = (fab: string) => {
    const exists = filters.fabrics.includes(fab);
    const updated = exists
      ? filters.fabrics.filter((f) => f !== fab)
      : [...filters.fabrics, fab];
    onFilterChange({ ...filters, fabrics: updated });
  };

  const toggleColor = (colName: string) => {
    const exists = filters.colors.includes(colName);
    const updated = exists
      ? filters.colors.filter((c) => c !== colName)
      : [...filters.colors, colName];
    onFilterChange({ ...filters, colors: updated });
  };

  const handlePriceTierClick = (label: string, max: number) => {
    onFilterChange({
      ...filters,
      priceTier: filters.priceTier === label ? null : label,
      maxPrice: max,
    });
  };

  const totalActive =
    filters.categories.length +
    filters.fabrics.length +
    filters.colors.length +
    (filters.priceTier ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  return (
    <aside className="w-full bg-white rounded-sm border border-border/80 p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[var(--wine)]" />
          <h3 className="font-serif text-lg font-bold text-[var(--wine-deep)] tracking-wide">
            Refine Catalog
          </h3>
          {totalActive > 0 && (
            <span className="h-5 min-w-5 px-1.5 rounded-full bg-[var(--wine)] text-white text-[10px] font-bold flex items-center justify-center">
              {totalActive}
            </span>
          )}
        </div>
        {totalActive > 0 && (
          <button
            onClick={onResetFilters}
            className="text-[11px] uppercase tracking-wider text-[var(--wine)] hover:text-black flex items-center gap-1 font-semibold transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Availability Toggle */}
      <div className="flex items-center justify-between py-2 border-b border-border/60">
        <span className="text-xs font-semibold text-foreground tracking-wide">In Stock Only</span>
        <button
          onClick={() => onFilterChange({ ...filters, inStockOnly: !filters.inStockOnly })}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            filters.inStockOnly ? "bg-[var(--wine)]" : "bg-gray-200"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              filters.inStockOnly ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Category Filter */}
      <div className="border-b border-border/60 pb-5">
        <button
          onClick={() => setCatExpanded(!catExpanded)}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--wine-deep)] py-1"
        >
          <span>Category ({CATEGORY_FILTERS.length})</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${catExpanded ? "rotate-180" : ""}`} />
        </button>

        {catExpanded && (
          <div className="mt-3 space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-secondary/50 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
              />
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
              {categorySearch && (
                <button
                  onClick={() => setCategorySearch("")}
                  className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="max-h-48 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar text-xs">
              {filteredCategoryList.map((cat) => {
                const checked = filters.categories.includes(cat);
                return (
                  <label
                    key={cat}
                    className="flex items-center gap-2 cursor-pointer py-1 px-1.5 rounded-sm hover:bg-secondary/60 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategory(cat)}
                      className="rounded border-border text-[var(--wine)] focus:ring-[var(--wine)] h-3.5 w-3.5"
                    />
                    <span className={`text-xs ${checked ? "font-bold text-[var(--wine)]" : "text-foreground/80"}`}>
                      {cat}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Fabric Filter */}
      <div className="border-b border-border/60 pb-5">
        <button
          onClick={() => setFabricExpanded(!fabricExpanded)}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--wine-deep)] py-1"
        >
          <span>Fabric</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${fabricExpanded ? "rotate-180" : ""}`} />
        </button>

        {fabricExpanded && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {FABRIC_FILTERS.map((fab) => {
              const selected = filters.fabrics.includes(fab);
              return (
                <button
                  key={fab}
                  onClick={() => toggleFabric(fab)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all ${
                    selected
                      ? "bg-[var(--wine)] text-white border-[var(--wine)] font-semibold shadow-xs"
                      : "bg-secondary/40 text-foreground/80 border-border hover:border-[var(--wine)]"
                  }`}
                >
                  {fab}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="border-b border-border/60 pb-5">
        <button
          onClick={() => setColorExpanded(!colorExpanded)}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--wine-deep)] py-1"
        >
          <span>Color Swatches</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${colorExpanded ? "rotate-180" : ""}`} />
        </button>

        {colorExpanded && (
          <div className="mt-3 grid grid-cols-4 sm:grid-cols-5 gap-2">
            {COLOR_FILTERS.map((c) => {
              const selected = filters.colors.includes(c.name);
              return (
                <button
                  key={c.name}
                  onClick={() => toggleColor(c.name)}
                  title={c.name}
                  className={`group relative flex flex-col items-center gap-1 p-1.5 rounded-sm border transition-all ${
                    selected ? "border-[var(--wine)] bg-[var(--wine)]/10" : "border-border hover:border-gray-400"
                  }`}
                >
                  <span
                    className="h-5 w-5 rounded-full border border-black/20 shadow-xs flex items-center justify-center"
                    style={{ backgroundColor: c.hex }}
                  >
                    {selected && <Check className={`h-3 w-3 ${c.name === "White" || c.name === "Off White" ? "text-black" : "text-white"}`} />}
                  </span>
                  <span className="text-[9px] font-medium text-foreground/80 group-hover:text-black truncate w-full text-center">
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Slider & Tiers */}
      <div>
        <button
          onClick={() => setPriceExpanded(!priceExpanded)}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--wine-deep)] py-1"
        >
          <span>Price Range (Up to ${filters.maxPrice})</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${priceExpanded ? "rotate-180" : ""}`} />
        </button>

        {priceExpanded && (
          <div className="mt-3 space-y-3">
            <input
              type="range"
              min={50}
              max={2000}
              step={25}
              value={filters.maxPrice}
              onChange={(e) =>
                onFilterChange({ ...filters, maxPrice: Number(e.target.value), priceTier: null })
              }
              className="w-full accent-[var(--wine)] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
              <span>$50</span>
              <span>${filters.maxPrice}</span>
              <span>$2,000</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {PRICE_TIERS.map((tier) => {
                const selected = filters.priceTier === tier.label;
                return (
                  <button
                    key={tier.label}
                    onClick={() => handlePriceTierClick(tier.label, tier.max)}
                    className={`text-[11px] py-1.5 px-2 rounded-sm border text-center font-medium transition-all ${
                      selected
                        ? "bg-[var(--gold)] text-[var(--wine-deep)] border-[var(--gold)] font-bold"
                        : "bg-secondary/30 text-foreground/80 border-border hover:border-[var(--gold)]"
                    }`}
                  >
                    {tier.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
