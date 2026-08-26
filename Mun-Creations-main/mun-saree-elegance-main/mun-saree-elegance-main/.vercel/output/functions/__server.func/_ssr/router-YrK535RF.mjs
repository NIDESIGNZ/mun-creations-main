import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useLocation, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-YrK535RF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-CmI8l5F7.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	window.__lovableReportRuntimeError?.({
		message,
		stack: error instanceof Error ? error.stack : void 0,
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$18 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Mun Creations — Handwoven Indian Sarees" },
			{
				name: "description",
				content: "Authentic handcrafted Indian sarees, bridal couture and festive wear. Woven by master artisans. Ships worldwide."
			},
			{
				name: "author",
				content: "Mun Creations"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "theme-color",
				content: "#4a1220"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..600&family=Marcellus&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400..700;1,400..700&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.png",
				type: "image/png"
			},
			{
				rel: "shortcut icon",
				href: "/favicon.ico"
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$18.useRouteContext();
	const location = useLocation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "page-transition min-h-screen",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		}, location.pathname)
	});
}
var $$splitComponentImporter$17 = () => import("./routes-DJR5jEuu.mjs");
var Route$17 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Mun Creations — Handwoven Indian Sarees, Kurtis & Couture" },
		{
			name: "description",
			content: "Handcrafted Indian sarees (Banarasi, Kanjivaram, Tussar, Jamdani), Kurtis, Blouses and bridal couture. Woven by master artisans. Ships worldwide."
		},
		{
			property: "og:title",
			content: "Mun Creations — Handwoven Indian Sarees & Ethnic Wear"
		},
		{
			property: "og:description",
			content: "Timeless sarees, handwoven heritage. Shop Banarasi, Kanjivaram, Tussar, Kurtis, Blouses, and Occasionwear."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./about-DRUndvqX.mjs");
var Route$16 = createFileRoute("/about")({
	head: () => ({ meta: [{ title: "Our Story — Handwoven Heritage & Weaver Cooperatives | Mun Creations" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./account-BsxO2ban.mjs");
var Route$15 = createFileRoute("/account")({
	head: () => ({ meta: [{ title: "My Account — Orders, Addresses & Wishlist | Mun Creations" }, {
		name: "description",
		content: "Manage your profile, track active orders, saved shipping addresses, and wishlist."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./admin-Dkcob487.mjs");
var Route$14 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "Enterprise Admin Portal — Mun Creations" }, {
		name: "description",
		content: "Enterprise management dashboard for orders, product catalog, CSV bulk upload, inventory intelligence, shipping & Razorpay reconciliation."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./checkout-9CLrglj3.mjs");
var Route$13 = createFileRoute("/checkout")({
	head: () => ({ meta: [{ title: "Secure Checkout & Payment Gateways — Mun Creations" }, {
		name: "description",
		content: "Secure worldwide checkout with interactive Razorpay, Stripe, PayPal, and Credit/Debit Card payment gateways."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./collections-DTBOpwPl.mjs");
var Route$12 = createFileRoute("/collections")({
	head: () => ({ meta: [{ title: "Curated Saree Collections — Wedding, Festive, Designer | Mun Creations" }, {
		name: "description",
		content: "Explore curated saree collections: Wedding Bridal, Festive, Kathiyawadi, Red & White, Summer Essentials & Hand Embroidery."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./faqs-BOXusB9E.mjs");
var Route$11 = createFileRoute("/faqs")({
	head: () => ({ meta: [{ title: "Frequently Asked Questions — Shipping, Care & Returns | Mun Creations" }, {
		name: "description",
		content: "Find answers regarding handloom silk mark certification, shipping timelines, returns, and care guidance."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./login-CNW4pJ95.mjs");
var Route$10 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Portal Sign In — Mun Creations" }, {
		name: "description",
		content: "Authentication portal for Designers & Weavers, Customers, and Main Admin Executive Management."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./privacy-policy-D133Y7en.mjs");
var Route$9 = createFileRoute("/privacy-policy")({
	head: () => ({ meta: [{ title: "Privacy & Data Protection Policy — Mun Creations" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./refund-policy-MffjRk8u.mjs");
var Route$8 = createFileRoute("/refund-policy")({
	head: () => ({ meta: [{ title: "Prepaid Refund & Cancellation Terms — Mun Creations" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./return-policy-BBsKROt4.mjs");
var Route$7 = createFileRoute("/return-policy")({
	head: () => ({ meta: [{ title: "Final Sale & No Return Policy — Mun Creations" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./sarees-DuTNfB3o.mjs");
var Route$6 = createFileRoute("/sarees")({
	head: () => ({ meta: [{ title: "Authentic Indian Sarees — Banarasi, Kanjivaram, Tussar | Mun Creations" }, {
		name: "description",
		content: "Explore 28 saree categories: Banarasi Katan, Kanjivaram, Tussar, Gadwal, Jamdani, Organza, Chikankari & Handloom Sarees."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./search-D41OvkWl.mjs");
var Route$5 = createFileRoute("/search")({
	head: () => ({ meta: [{ title: "Search Sarees & AI Saree Finder Assistant — Mun Creations" }, {
		name: "description",
		content: "Search our handwoven catalog or ask our AI Saree Finder for personalized outfit recommendations."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./shipping-policy-BBZkdjR4.mjs");
var Route$4 = createFileRoute("/shipping-policy")({
	head: () => ({ meta: [{ title: "Worldwide Shipping & Dispatch Policy — Mun Creations" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./shop-6Pa4ISG3.mjs");
var Route$3 = createFileRoute("/shop")({
	head: () => ({ meta: [{ title: "Shop Luxury Sarees, Kurtis & Blouses — Mun Creations" }, {
		name: "description",
		content: "Browse our handwoven Banarasi, Kanjivaram, Tussar, Organza & Chikankari sarees with custom filters."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./shop-by-BgtSff01.mjs");
var Route$2 = createFileRoute("/shop-by")({
	head: () => ({ meta: [{ title: "Shop Sarees By Fabric, Colour, Occasion & Price — Mun Creations" }, {
		name: "description",
		content: "Discover sarees by Fabric (Silk, Tussar, Organza, Cotton), Colour (Red, Pink, Gold), Occasion, and Price range."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./source-aylv0AXy.mjs");
var Route$1 = createFileRoute("/source")({
	head: () => ({ meta: [{ title: "Artisanal Sourcing & Administration Portal — Mun Creations" }, {
		name: "description",
		content: "Manage handloom weaving clusters in Varanasi, Kanchipuram, Bengal, & Lucknow, oversee catalog sourcing, track customer fulfillment, & run REST API diagnostics."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./terms-BkWiYNBL.mjs");
var Route = createFileRoute("/terms")({
	head: () => ({ meta: [{ title: "Terms & Conditions — Mun Creations" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$17.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$18
	}),
	AboutRoute: Route$16.update({
		id: "/about",
		path: "/about",
		getParentRoute: () => Route$18
	}),
	AccountRoute: Route$15.update({
		id: "/account",
		path: "/account",
		getParentRoute: () => Route$18
	}),
	AdminRoute: Route$14.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$18
	}),
	CheckoutRoute: Route$13.update({
		id: "/checkout",
		path: "/checkout",
		getParentRoute: () => Route$18
	}),
	CollectionsRoute: Route$12.update({
		id: "/collections",
		path: "/collections",
		getParentRoute: () => Route$18
	}),
	FaqsRoute: Route$11.update({
		id: "/faqs",
		path: "/faqs",
		getParentRoute: () => Route$18
	}),
	LoginRoute: Route$10.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$18
	}),
	PrivacyPolicyRoute: Route$9.update({
		id: "/privacy-policy",
		path: "/privacy-policy",
		getParentRoute: () => Route$18
	}),
	RefundPolicyRoute: Route$8.update({
		id: "/refund-policy",
		path: "/refund-policy",
		getParentRoute: () => Route$18
	}),
	ReturnPolicyRoute: Route$7.update({
		id: "/return-policy",
		path: "/return-policy",
		getParentRoute: () => Route$18
	}),
	SareesRoute: Route$6.update({
		id: "/sarees",
		path: "/sarees",
		getParentRoute: () => Route$18
	}),
	SearchRoute: Route$5.update({
		id: "/search",
		path: "/search",
		getParentRoute: () => Route$18
	}),
	ShippingPolicyRoute: Route$4.update({
		id: "/shipping-policy",
		path: "/shipping-policy",
		getParentRoute: () => Route$18
	}),
	ShopRoute: Route$3.update({
		id: "/shop",
		path: "/shop",
		getParentRoute: () => Route$18
	}),
	ShopByRoute: Route$2.update({
		id: "/shop-by",
		path: "/shop-by",
		getParentRoute: () => Route$18
	}),
	SourceRoute: Route$1.update({
		id: "/source",
		path: "/source",
		getParentRoute: () => Route$18
	}),
	TermsRoute: Route.update({
		id: "/terms",
		path: "/terms",
		getParentRoute: () => Route$18
	})
};
var routeTree = Route$18._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
