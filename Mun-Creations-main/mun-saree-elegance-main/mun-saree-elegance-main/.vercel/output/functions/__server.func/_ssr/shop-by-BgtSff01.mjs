import { d as PRICE_TIERS, i as COLOR_FILTERS, o as FABRIC_FILTERS } from "./catalog-iLO1lIu8.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Palette, Q as DollarSign, W as Grid3x3 } from "../_libs/lucide-react.mjs";
import { a as I18nProvider, i as Header, n as CartProvider, r as Footer, t as CartDrawer } from "./cart-drawer-D9uioa6i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-by-BgtSff01.js
var import_jsx_runtime = require_jsx_runtime();
function ShopByPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopByContent, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {})
		]
	}) }) });
}
function ShopByContent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-boutique space-y-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white p-8 md:p-12 rounded-sm border border-border shadow-md text-center space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "eyebrow text-[var(--gold)]",
						children: "Taxonomy Navigation Hub"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-3xl md:text-5xl font-bold text-[var(--wine-deep)] max-w-3xl mx-auto",
						children: "Shop By Fabric, Colour, Occasion & Price"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs md:text-sm text-muted-foreground max-w-xl mx-auto",
						children: "Filter through our master artisan database using custom textile attributes."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white p-6 md:p-8 rounded-sm border border-border shadow-sm space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border-b border-border pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, { className: "h-5 w-5 text-[var(--wine)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl font-bold text-[var(--wine-deep)]",
						children: "1. Shop By Fabric"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3",
					children: FABRIC_FILTERS.map((fab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						search: { fabric: fab },
						className: "p-4 bg-secondary/30 hover:bg-[var(--wine)] hover:text-white rounded-sm border border-border/70 text-center text-xs font-bold transition-all shadow-xs",
						children: [fab, " Silk"]
					}, fab))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white p-6 md:p-8 rounded-sm border border-border shadow-sm space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border-b border-border pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "h-5 w-5 text-[var(--wine)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl font-bold text-[var(--wine-deep)]",
						children: "2. Shop By Colour"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3",
					children: COLOR_FILTERS.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						search: { color: col.name },
						className: "p-3 bg-secondary/30 hover:bg-secondary/80 rounded-sm border border-border flex items-center gap-2 text-xs font-bold transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-5 w-5 rounded-full border border-border",
							style: { backgroundColor: col.hex }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: col.name })]
					}, col.name))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white p-6 md:p-8 rounded-sm border border-border shadow-sm space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border-b border-border pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-5 w-5 text-[var(--wine)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl font-bold text-[var(--wine-deep)]",
						children: "3. Shop By Price Range"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
					children: PRICE_TIERS.map((pt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						search: { price: pt.label },
						className: "p-5 bg-secondary/20 hover:bg-[var(--wine)] hover:text-white rounded-sm border border-border space-y-2 transition-all shadow-xs group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-serif text-xl font-bold text-[var(--wine-deep)] group-hover:text-white",
							children: pt.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground group-hover:text-white/80 font-mono",
							children: [
								"$",
								pt.min,
								" – $",
								pt.max
							]
						})]
					}, pt.label))
				})]
			})
		]
	});
}
//#endregion
export { ShopByPage as component };
