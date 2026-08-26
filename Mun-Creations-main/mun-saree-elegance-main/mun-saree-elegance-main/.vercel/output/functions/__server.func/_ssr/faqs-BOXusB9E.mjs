import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { st as ChevronDown } from "../_libs/lucide-react.mjs";
import { a as I18nProvider, i as Header, n as CartProvider, r as Footer, t as CartDrawer } from "./cart-drawer-D9uioa6i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faqs-BOXusB9E.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FaqsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqsContent, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {})
		]
	}) }) });
}
var FAQS_DATA = [
	{
		q: "Are all products 100% authentic pure silk with Silk Mark certification?",
		a: "Yes. Every pure Katan Banarasi, Kanjivaram, and Tussar silk saree from Ethnic Boutique comes tagged with official Silk Mark Certification issuing government authority approval."
	},
	{
		q: "What is your international shipping timeline?",
		a: "We ship worldwide via DHL Express & FedEx. Orders are dispatched within 24-48 hours and arrive in 3-5 business days across USA, UK, Canada, UAE, and Australia."
	},
	{
		q: "What payment methods do you accept?",
		a: "We accept 100% prepaid secure payments via Razorpay (UPI, NetBanking, GPay, PhonePe, Paytm), Stripe (Global Credit/Debit Cards), PayPal Express, and Direct Visa/Mastercard."
	},
	{
		q: "What is your store return policy?",
		a: "All sales are final. Each handwoven saree undergoes 3-point quality inspection prior to insured dispatch."
	},
	{
		q: "How should I store and maintain pure Banarasi & Kanjivaram sarees?",
		a: "Dry clean only. Store sarees wrapped in a soft white muslin or cotton cloth. Refold sarees every 3 months along different fold lines to prevent zari creasing."
	}
];
function FaqsContent() {
	const [openIdx, setOpenIdx] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-boutique max-w-3xl space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white p-8 md:p-12 rounded-sm border border-border shadow-md text-center space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "eyebrow text-[var(--gold)]",
					children: "Customer Service & Assistance"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-3xl md:text-5xl font-bold text-[var(--wine-deep)]",
					children: "Frequently Asked Questions"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground max-w-md mx-auto",
					children: "Everything you need to know about our handloom heritage sarees, international delivery, and silk care."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-white p-6 md:p-8 rounded-sm border border-border shadow-sm space-y-4",
			children: FAQS_DATA.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border/70 last:border-0 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setOpenIdx(openIdx === idx ? null : idx),
					className: "w-full text-left flex items-center justify-between gap-4 py-2 font-serif text-lg font-bold text-[var(--wine-deep)] hover:text-[var(--wine)] transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.q }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-5 w-5 shrink-0 transition-transform ${openIdx === idx ? "rotate-180 text-[var(--wine)]" : "text-muted-foreground"}` })]
				}), openIdx === idx && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground leading-relaxed pt-2 animate-in fade-in",
					children: item.a
				})]
			}, idx))
		})]
	});
}
//#endregion
export { FaqsPage as component };
