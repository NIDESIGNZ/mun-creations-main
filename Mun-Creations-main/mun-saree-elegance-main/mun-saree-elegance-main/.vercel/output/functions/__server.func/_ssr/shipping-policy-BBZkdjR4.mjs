import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as I18nProvider, i as Header, n as CartProvider, r as Footer, t as CartDrawer } from "./cart-drawer-D9uioa6i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shipping-policy-BBZkdjR4.js
var import_jsx_runtime = require_jsx_runtime();
function ShippingPolicyPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "container-boutique max-w-3xl space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white p-8 md:p-12 rounded-sm border border-border shadow-md space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "eyebrow text-[var(--gold)]",
								children: "Delivery Terms"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-serif text-3xl md:text-4xl font-bold text-[var(--wine-deep)]",
								children: "Worldwide Shipping Policy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground leading-relaxed space-y-4 pt-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Domestic Shipping (India):" }), " We offer complimentary insured air shipping across all serviceable pincodes in India. Standard delivery takes 2 to 4 business days."] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "International Shipping:" }), " We ship to over 150 countries via DHL Express & FedEx. International orders above $500 USD qualify for complimentary express air dispatch."] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Customs & Duties:" }), " All import duties, local taxes, and clearance fees are handled transparently. Tracking links (AWB) are dispatched via email and WhatsApp upon order dispatch."] })
								]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {})
		]
	}) }) });
}
//#endregion
export { ShippingPolicyPage as component };
