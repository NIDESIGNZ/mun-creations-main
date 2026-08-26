import { r as __toESM } from "../_runtime.mjs";
import { d as PRICE_TIERS, i as COLOR_FILTERS, n as CATEGORY_FILTERS, o as FABRIC_FILTERS } from "./catalog-iLO1lIu8.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate, v as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as Search, ct as Check, n as X, p as Sparkles, q as Funnel } from "../_libs/lucide-react.mjs";
import { a as I18nProvider, i as Header, n as CartProvider, r as Footer, s as useI18n, t as CartDrawer } from "./cart-drawer-D9uioa6i.mjs";
import { t as backendDB } from "./backend-api-DaSHvViK.mjs";
import { n as ProductCard } from "./product-Bglph-xe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-6Pa4ISG3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ShopPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopContent, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {})
		]
	}) }) });
}
function ShopContent() {
	const { formatPrice } = useI18n();
	const searchParams = useSearch({ from: "/shop" });
	useNavigate();
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)(searchParams?.category || "");
	const [selectedFabric, setSelectedFabric] = (0, import_react.useState)(searchParams?.fabric || "");
	const [selectedColor, setSelectedColor] = (0, import_react.useState)(searchParams?.color || "");
	const [selectedPriceTier, setSelectedPriceTier] = (0, import_react.useState)(searchParams?.price || "");
	const [selectedSort, setSelectedSort] = (0, import_react.useState)("featured");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [mobileFilterOpen, setMobileFilterOpen] = (0, import_react.useState)(false);
	const allProducts = backendDB.getProducts();
	const filteredProducts = (0, import_react.useMemo)(() => {
		return allProducts.filter((p) => {
			if (selectedCategory && p.category.toLowerCase() !== selectedCategory.toLowerCase() && p.subcategory?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
			if (selectedFabric && p.fabric.toLowerCase() !== selectedFabric.toLowerCase()) return false;
			if (selectedColor && p.color.toLowerCase() !== selectedColor.toLowerCase()) return false;
			if (selectedPriceTier) {
				if (selectedPriceTier === "Budget Collection" && p.priceUsd > 150) return false;
				if (selectedPriceTier === "Mid Range" && (p.priceUsd <= 150 || p.priceUsd > 350)) return false;
				if (selectedPriceTier === "Premium" && (p.priceUsd <= 350 || p.priceUsd > 600)) return false;
				if (selectedPriceTier === "Luxury" && p.priceUsd <= 600) return false;
			}
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				const matchesName = p.name.toLowerCase().includes(q);
				const matchesCat = p.category.toLowerCase().includes(q);
				const matchesFab = p.fabric.toLowerCase().includes(q);
				const matchesSku = p.sku?.toLowerCase().includes(q);
				if (!matchesName && !matchesCat && !matchesFab && !matchesSku) return false;
			}
			return true;
		}).sort((a, b) => {
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
		selectedSort
	]);
	const clearAllFilters = () => {
		setSelectedCategory("");
		setSelectedFabric("");
		setSelectedColor("");
		setSelectedPriceTier("");
		setSearchQuery("");
	};
	const activeFilterCount = (selectedCategory ? 1 : 0) + (selectedFabric ? 1 : 0) + (selectedColor ? 1 : 0) + (selectedPriceTier ? 1 : 0) + (searchQuery ? 1 : 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-boutique space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white p-6 rounded-sm border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "eyebrow text-[var(--gold)]",
				children: "Handwoven Luxury Catalog"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-serif text-3xl font-bold text-[var(--wine-deep)]",
				children: [
					"Explore All Collections (",
					filteredProducts.length,
					" Items)"
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative max-w-xs w-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					placeholder: "Search by SKU, fabric, weave...",
					value: searchQuery,
					onChange: (e) => setSearchQuery(e.target.value),
					className: "w-full pl-9 pr-4 py-2.5 bg-secondary/30 border border-border rounded-sm text-xs focus:outline-none focus:border-[var(--wine)] font-medium"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-12 gap-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden lg:block lg:col-span-3 space-y-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white p-5 rounded-sm border border-border shadow-sm space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-serif font-bold text-base text-[var(--wine-deep)] flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4 text-[var(--wine)]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Filters" }),
									activeFilterCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "h-5 w-5 rounded-full bg-[var(--wine)] text-white text-[10px] flex items-center justify-center font-bold font-mono",
										children: activeFilterCount
									})
								]
							}), activeFilterCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: clearAllFilters,
								className: "text-xs text-[var(--wine)] hover:underline font-medium",
								children: "Clear All"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-bold text-xs uppercase tracking-wider block",
								children: "Category & Weave"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: selectedCategory,
								onChange: (e) => setSelectedCategory(e.target.value),
								className: "w-full p-2 bg-secondary/20 border border-border rounded-sm text-xs font-medium focus:outline-none focus:border-[var(--wine)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Categories"
								}), CATEGORY_FILTERS.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: cat,
									children: cat
								}, cat))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-bold text-xs uppercase tracking-wider block",
								children: "Fabric Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: selectedFabric,
								onChange: (e) => setSelectedFabric(e.target.value),
								className: "w-full p-2 bg-secondary/20 border border-border rounded-sm text-xs font-medium focus:outline-none focus:border-[var(--wine)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Fabrics"
								}), FABRIC_FILTERS.map((fab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: fab,
									children: fab
								}, fab))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-bold text-xs uppercase tracking-wider block",
								children: "Price Range"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setSelectedPriceTier(""),
									className: `w-full text-left p-2 rounded-xs transition-colors ${selectedPriceTier === "" ? "bg-[var(--wine)] text-white font-bold" : "hover:bg-secondary text-foreground"}`,
									children: "All Prices"
								}), PRICE_TIERS.map((pt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setSelectedPriceTier(pt.label),
									className: `w-full text-left p-2 rounded-xs transition-colors ${selectedPriceTier === pt.label ? "bg-[var(--wine)] text-white font-bold" : "hover:bg-secondary text-foreground"}`,
									children: [
										pt.label,
										" (",
										formatPrice(pt.min),
										" - ",
										formatPrice(pt.max),
										")"
									]
								}, pt.label))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 pt-2 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-bold text-xs uppercase tracking-wider block",
								children: "Shop by Colour"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2 pt-1",
								children: COLOR_FILTERS.slice(0, 14).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									title: c.name,
									onClick: () => setSelectedColor(selectedColor === c.name ? "" : c.name),
									className: `h-7 w-7 rounded-full border transition-all flex items-center justify-center ${selectedColor === c.name ? "ring-2 ring-[var(--wine)] scale-110 border-white shadow-md" : "border-border/60 hover:scale-105"}`,
									style: { backgroundColor: c.hex },
									children: selectedColor === c.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-white drop-shadow-md" })
								}, c.name))
							})]
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-9 space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white p-4 rounded-sm border border-border shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-muted-foreground uppercase tracking-wider",
								children: "Active:"
							}),
							selectedCategory && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "bg-[var(--wine)] text-white px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold",
								children: [
									"Category: ",
									selectedCategory,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
										className: "h-3 w-3 cursor-pointer",
										onClick: () => setSelectedCategory("")
									})
								]
							}),
							selectedFabric && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "bg-[var(--wine)] text-white px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold",
								children: [
									"Fabric: ",
									selectedFabric,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
										className: "h-3 w-3 cursor-pointer",
										onClick: () => setSelectedFabric("")
									})
								]
							}),
							selectedColor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "bg-[var(--wine)] text-white px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold",
								children: [
									"Colour: ",
									selectedColor,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
										className: "h-3 w-3 cursor-pointer",
										onClick: () => setSelectedColor("")
									})
								]
							}),
							selectedPriceTier && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "bg-[var(--wine)] text-white px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold",
								children: [
									"Price: ",
									selectedPriceTier,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
										className: "h-3 w-3 cursor-pointer",
										onClick: () => setSelectedPriceTier("")
									})
								]
							}),
							activeFilterCount === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground italic",
								children: "Showing all items"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground font-semibold",
							children: "Sort By:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: selectedSort,
							onChange: (e) => setSelectedSort(e.target.value),
							className: "p-1.5 bg-secondary/30 border border-border rounded-sm text-xs font-bold focus:outline-none focus:border-[var(--wine)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "featured",
									children: "Featured"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "price-asc",
									children: "Price: Low to High"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "price-desc",
									children: "Price: High to Low"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "newest",
									children: "Newest Arrivals"
								})
							]
						})]
					})]
				}), filteredProducts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white p-12 text-center rounded-sm border border-border space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-10 w-10 text-[var(--gold)] mx-auto" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-2xl font-bold text-[var(--wine-deep)]",
							children: "No Sarees Found"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground max-w-sm mx-auto",
							children: "No products matched your selected filters. Try clearing filters to explore our full handloom catalog."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: clearAllFilters,
							className: "bg-[var(--wine)] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm shadow-md",
							children: "Reset All Filters"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6",
					children: filteredProducts.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product }, product.id))
				})]
			})]
		})]
	});
}
//#endregion
export { ShopPage as component };
