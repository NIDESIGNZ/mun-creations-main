import { a as EXPANDED_SAREE_TAXONOMY } from "./catalog-iLO1lIu8.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { R as Layers } from "../_libs/lucide-react.mjs";
import { a as I18nProvider, i as Header, n as CartProvider, r as Footer, t as CartDrawer } from "./cart-drawer-D9uioa6i.mjs";
import { i as PRODUCTS } from "./products-BQLhYZdU.mjs";
import { n as ProductCard } from "./product-Bglph-xe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sarees-DuTNfB3o.js
var import_jsx_runtime = require_jsx_runtime();
function SareesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SareesContent, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {})
		]
	}) }) });
}
function SareesContent() {
	const sareeProducts = PRODUCTS.filter((p) => p.mainCategory === "sarees" || p.category);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-boutique space-y-8 sm:space-y-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white p-5 sm:p-8 md:p-12 rounded-sm border border-border shadow-md text-center space-y-3 sm:space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "eyebrow text-[var(--gold)]",
						children: "The Royal Saree Treasury"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-[var(--wine-deep)] max-w-3xl mx-auto",
						children: "Handwoven Indian Sarees & Heritage Craftsmanship"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2 sm:px-0",
						children: "From the sacred looms of Varanasi to the temple workshops of Kanchipuram and artisan clusters of West Bengal, discover 28 authentic weaving taxonomies."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 sm:space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-serif text-xl sm:text-2xl font-bold text-[var(--wine-deep)] flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 sm:h-5 sm:w-5 text-[var(--gold)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Master Saree Weave Families" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground font-mono",
						children: "28 Categories"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
					children: EXPANDED_SAREE_TAXONOMY.map((fam) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white p-4 sm:p-6 rounded-sm border border-border shadow-xs hover:shadow-md transition-all space-y-3 sm:space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-serif text-lg sm:text-xl font-bold text-[var(--wine-deep)]",
								children: fam.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] bg-[var(--wine)]/10 text-[var(--wine)] font-bold px-2 py-0.5 rounded font-mono",
								children: [fam.subcategories.length, " Types"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5 pt-1",
							children: fam.subcategories.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								search: { category: sub.name },
								className: "text-xs bg-secondary/50 hover:bg-[var(--wine)] hover:text-white px-2.5 py-1 rounded-xs transition-colors font-medium text-foreground/80",
								children: sub.name
							}, sub.slug))
						})]
					}, fam.slug))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 sm:space-y-6 pt-4 sm:pt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-xl sm:text-2xl font-bold text-[var(--wine-deep)] border-b border-border pb-3",
					children: "Featured Sarees Collection"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6",
					children: sareeProducts.slice(0, 4).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
				})]
			})
		]
	});
}
//#endregion
export { SareesPage as component };
