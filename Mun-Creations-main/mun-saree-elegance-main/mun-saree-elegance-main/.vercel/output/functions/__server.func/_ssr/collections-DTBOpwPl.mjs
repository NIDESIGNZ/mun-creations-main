import { r as COLLECTION_HIERARCHY } from "./catalog-iLO1lIu8.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as Sparkles, pt as ArrowRight } from "../_libs/lucide-react.mjs";
import { a as I18nProvider, i as Header, n as CartProvider, r as Footer, t as CartDrawer } from "./cart-drawer-D9uioa6i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/collections-DTBOpwPl.js
var import_jsx_runtime = require_jsx_runtime();
function CollectionsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionsContent, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {})
		]
	}) }) });
}
function CollectionsContent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-boutique space-y-8 sm:space-y-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white p-5 sm:p-8 md:p-12 rounded-sm border border-border shadow-md text-center space-y-3 sm:space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "eyebrow text-[var(--gold)]",
					children: "Curated Merchandising Collections"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-[var(--wine-deep)] max-w-3xl mx-auto",
					children: "Signature Heritage & Occasionwear Collections"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto px-2 sm:px-0",
					children: "Explore curated fashion edits styled for weddings, traditional pujas, red carpet receptions, and summer everyday luxury."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6",
			children: COLLECTION_HIERARCHY.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white p-5 sm:p-6 rounded-sm border border-border shadow-xs hover:shadow-lg transition-all space-y-3 sm:space-y-4 flex flex-col justify-between group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-[var(--wine)]/10 text-[var(--wine)] flex items-center justify-center border border-[var(--wine)]/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 sm:h-5 sm:w-5 text-[var(--gold)]" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-xl sm:text-2xl font-bold text-[var(--wine-deep)] group-hover:text-[var(--wine)] transition-colors",
							children: c.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground leading-relaxed",
							children: [
								"Handpicked handloom masterworks styled specifically for ",
								c.name.toLowerCase(),
								" occasions."
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/shop",
					search: { category: c.name },
					className: "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--wine)] hover:text-[var(--wine-deep)] pt-2 min-h-[44px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Explore Collection" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
				})]
			}, c.slug))
		})]
	});
}
//#endregion
export { CollectionsPage as component };
