import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as Search, dt as Bot, y as Send } from "../_libs/lucide-react.mjs";
import { a as I18nProvider, i as Header, n as CartProvider, r as Footer, t as CartDrawer } from "./cart-drawer-D9uioa6i.mjs";
import { t as backendDB } from "./backend-api-DaSHvViK.mjs";
import { n as ProductCard } from "./product-Bglph-xe.mjs";
import { t as askAIMLStylist } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-D41OvkWl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SearchPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchContent, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {})
		]
	}) }) });
}
function SearchContent() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [aiPrompt, setAiPrompt] = (0, import_react.useState)("");
	const [aiResponse, setAiResponse] = (0, import_react.useState)(null);
	const [aiRecommendedProducts, setAiRecommendedProducts] = (0, import_react.useState)([]);
	const [isAiThinking, setIsAiThinking] = (0, import_react.useState)(false);
	const allProducts = backendDB.getProducts();
	const searchResults = query.trim() ? allProducts.filter((p) => {
		const q = query.toLowerCase();
		return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.fabric.toLowerCase().includes(q) || p.color.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q) || p.workType?.toLowerCase().includes(q);
	}) : [];
	const handleAskAI = async (e) => {
		e.preventDefault();
		if (!aiPrompt.trim()) return;
		setIsAiThinking(true);
		setAiResponse(null);
		const q = aiPrompt.toLowerCase();
		let reco = allProducts;
		if (q.includes("wedding") || q.includes("bridal") || q.includes("sister") || q.includes("reception")) reco = allProducts.filter((p) => p.priceUsd > 350 || p.category === "Kanjivaram" || p.category === "Banarasi");
		else if (q.includes("summer") || q.includes("cotton") || q.includes("light") || q.includes("haldi") || q.includes("yellow")) reco = allProducts.filter((p) => p.fabric === "Muslin" || p.fabric === "Cotton" || p.fabric === "Organza" || p.priceUsd < 350);
		else if (q.includes("red") || q.includes("maroon") || q.includes("crimson")) reco = allProducts.filter((p) => p.color === "Red" || p.color === "Maroon" || p.color === "Wine");
		else if (q.includes("tussar") || q.includes("tribal")) reco = allProducts.filter((p) => p.category === "Tussar" || p.fabric === "Tussar Silk");
		setAiRecommendedProducts(reco.slice(0, 4));
		try {
			const response = await askAIMLStylist(aiPrompt);
			setAiResponse(response);
		} catch {
			setAiResponse(`Based on your request "${aiPrompt}", I recommend our handwoven Katan Banarasi and Kanjivaram silk ensembles crafted with pure zari. Here are recommended choices:`);
		} finally {
			setIsAiThinking(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-boutique space-y-8 sm:space-y-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white p-5 sm:p-8 rounded-sm border border-border shadow-md space-y-3 sm:space-y-4 text-center max-w-3xl mx-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "eyebrow text-[var(--gold)]",
						children: "Full Text & Attribute Search"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-2xl sm:text-3xl font-bold text-[var(--wine-deep)]",
						children: "Search Master Catalog"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							placeholder: "Search by weave, fabric, color, or style...",
							value: query,
							onChange: (e) => setQuery(e.target.value),
							className: "w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 bg-secondary/30 border border-border rounded-sm text-sm focus:outline-none focus:border-[var(--wine)] font-medium"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 sm:left-4 top-4 sm:top-4.5 h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Popular:" }), [
							"Banarasi",
							"Kanjivaram",
							"Tussar",
							"Organza",
							"Bridal Red",
							"Haldi Yellow"
						].map((term) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setQuery(term),
							className: "bg-secondary/60 hover:bg-[var(--wine)] hover:text-white px-2.5 py-1 rounded-xs transition-colors cursor-pointer",
							children: term
						}, term))]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-gradient-to-r from-[var(--wine-deep)] via-[#2f0d1e] to-[var(--wine-deep)] text-white p-5 sm:p-8 rounded-sm border border-[var(--gold)]/40 shadow-xl space-y-4 max-w-3xl mx-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-1.5 bg-[var(--gold)]/20 text-[var(--gold)] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI Stylist & Saree Finder" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl sm:text-2xl font-bold",
						children: "Ask AI: \"What should I wear for my sister's wedding?\""
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-white/80 mt-1",
						children: "Describe your event, preferred fabric, or budget to get instant AI recommendations."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleAskAI,
						className: "flex flex-col sm:flex-row gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							placeholder: "e.g. Need a light green silk saree under $400 for haldi ceremony",
							value: aiPrompt,
							onChange: (e) => setAiPrompt(e.target.value),
							className: "flex-1 p-3 bg-white/10 border border-white/20 rounded-sm text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-[var(--gold)] font-medium"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: isAiThinking,
							className: "bg-[var(--gold)] text-[var(--wine-deep)] px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-white transition-colors flex items-center justify-center gap-2 shrink-0 min-h-[42px] cursor-pointer",
							children: isAiThinking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-4 w-4 border-2 border-[var(--wine-deep)] border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ask Stylist" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })] })
						})]
					}),
					aiResponse && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 bg-white/10 rounded border border-white/20 text-xs leading-relaxed space-y-4 animate-in fade-in",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: aiResponse }), aiRecommendedProducts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-2",
							children: aiRecommendedProducts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
						})]
					})
				]
			}),
			query.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 sm:space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-serif text-xl sm:text-2xl font-bold text-[var(--wine-deep)] border-b border-border pb-3",
					children: [
						"Search Results for \"",
						query,
						"\" (",
						searchResults.length,
						" Found)"
					]
				}), searchResults.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white p-6 sm:p-8 text-center rounded border border-border text-muted-foreground text-xs",
					children: [
						"No matching sarees found for \"",
						query,
						"\". Try searching by category like 'Banarasi' or fabric like 'Silk'."
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6",
					children: searchResults.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
				})]
			})
		]
	});
}
//#endregion
export { SearchPage as component };
