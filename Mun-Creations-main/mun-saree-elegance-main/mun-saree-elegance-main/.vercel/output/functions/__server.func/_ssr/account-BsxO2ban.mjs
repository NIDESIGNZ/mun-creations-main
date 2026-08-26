import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { M as MapPin, O as Package, P as LogOut, U as Heart, X as ExternalLink, i as User, s as Truck, v as ShieldCheck } from "../_libs/lucide-react.mjs";
import { a as I18nProvider, i as Header, n as CartProvider, r as Footer, s as useI18n, t as CartDrawer } from "./cart-drawer-D9uioa6i.mjs";
import { t as backendDB } from "./backend-api-DaSHvViK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-BsxO2ban.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AccountPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountContent, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {})
		]
	}) }) });
}
function AccountContent() {
	const { formatPrice } = useI18n();
	const [activeTab, setActiveTab] = (0, import_react.useState)("orders");
	const orders = backendDB.getOrders();
	const [customerProfile, setCustomerProfile] = (0, import_react.useState)({
		name: "Priya Sharma",
		email: "priya.sharma@example.com",
		phone: "+1 (555) 234-5678",
		memberSince: "August 2024"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-boutique space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white p-6 md:p-8 rounded-sm border border-border shadow-md flex flex-col sm:flex-row items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-16 w-16 rounded-full bg-[var(--wine)] text-white font-serif font-bold text-2xl flex items-center justify-center border-2 border-[var(--gold)]",
					children: "PS"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-2xl font-bold text-[var(--wine-deep)]",
					children: customerProfile.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: [
						customerProfile.email,
						" · Member since ",
						customerProfile.memberSince
					]
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "text-xs font-bold text-red-600 hover:underline flex items-center gap-1.5 border border-red-200 px-4 py-2 rounded-sm bg-red-50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign Out" })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-12 gap-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-3 space-y-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white p-2 rounded-sm border border-border shadow-sm space-y-1 text-xs font-bold uppercase tracking-wider",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveTab("orders"),
							className: `w-full text-left p-3 rounded-xs flex items-center gap-2.5 transition-colors ${activeTab === "orders" ? "bg-[var(--wine)] text-white" : "hover:bg-secondary text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Orders (",
								orders.length,
								")"
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveTab("profile"),
							className: `w-full text-left p-3 rounded-xs flex items-center gap-2.5 transition-colors ${activeTab === "profile" ? "bg-[var(--wine)] text-white" : "hover:bg-secondary text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Personal Details" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveTab("addresses"),
							className: `w-full text-left p-3 rounded-xs flex items-center gap-2.5 transition-colors ${activeTab === "addresses" ? "bg-[var(--wine)] text-white" : "hover:bg-secondary text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Saved Addresses" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveTab("wishlist"),
							className: `w-full text-left p-3 rounded-xs flex items-center gap-2.5 transition-colors ${activeTab === "wishlist" ? "bg-[var(--wine)] text-white" : "hover:bg-secondary text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Wishlist" })]
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-9",
				children: [
					activeTab === "orders" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white p-6 md:p-8 rounded-sm border border-border shadow-md space-y-6 animate-in fade-in",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl font-bold text-[var(--wine-deep)] border-b border-border pb-3",
							children: "Order History & Live Shipments"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-6",
							children: orders.map((ord) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-5 border border-border rounded-sm space-y-4 bg-secondary/10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border text-xs gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono font-bold text-sm text-[var(--wine-deep)]",
											children: ord.id
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-muted-foreground text-[10px]",
											children: ["Placed on ", new Date(ord.createdAt).toLocaleDateString()]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ord.status })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-serif font-bold text-base text-[var(--wine-deep)] mt-1",
												children: formatPrice(ord.subtotalUsd)
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-2 text-xs",
										children: ord.items.map((it, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-serif font-bold",
												children: [
													it.productName,
													" (Qty: ",
													it.quantity,
													")"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold",
												children: formatPrice(it.priceUsd * it.quantity)
											})]
										}, idx))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Shipping Address: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground",
											children: ord.shippingAddress
										})] }), ord.awbNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: ord.trackingUrl || "#",
											target: "_blank",
											rel: "noopener noreferrer",
											className: "inline-flex items-center gap-1 text-[var(--wine)] font-bold hover:underline text-[11px]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3.5 w-3.5" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													"Track Courier (",
													ord.awbNumber,
													")"
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })
											]
										})]
									})
								]
							}, ord.id))
						})]
					}),
					activeTab === "profile" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white p-6 md:p-8 rounded-sm border border-border shadow-md space-y-6 animate-in fade-in",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl font-bold text-[var(--wine-deep)] border-b border-border pb-3",
							children: "Personal Profile & Security"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "space-y-4 text-xs max-w-md",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold block mb-1",
									children: "Full Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: customerProfile.name,
									onChange: (e) => setCustomerProfile({
										...customerProfile,
										name: e.target.value
									}),
									className: "w-full p-2.5 bg-secondary/20 border border-border rounded-sm"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold block mb-1",
									children: "Email Address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									value: customerProfile.email,
									onChange: (e) => setCustomerProfile({
										...customerProfile,
										email: e.target.value
									}),
									className: "w-full p-2.5 bg-secondary/20 border border-border rounded-sm"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold block mb-1",
									children: "Phone Number"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "tel",
									value: customerProfile.phone,
									onChange: (e) => setCustomerProfile({
										...customerProfile,
										phone: e.target.value
									}),
									className: "w-full p-2.5 bg-secondary/20 border border-border rounded-sm"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "bg-[var(--wine)] text-white px-6 py-2.5 font-bold uppercase tracking-wider text-xs rounded-sm shadow-md",
									children: "Save Profile"
								})
							]
						})]
					}),
					activeTab === "addresses" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white p-6 md:p-8 rounded-sm border border-border shadow-md space-y-6 animate-in fade-in",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl font-bold text-[var(--wine-deep)] border-b border-border pb-3",
							children: "Saved Shipping Addresses"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 border-2 border-[var(--wine)] rounded-sm bg-[var(--wine)]/5 space-y-2 relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "bg-[var(--wine)] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
										children: "Default Address"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-foreground",
										children: "Home Address"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-muted-foreground leading-relaxed",
										children: [
											"450 Lexington Ave, Suite 1200",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											"New York, NY 10017",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											"United States"
										]
									})
								]
							})
						})]
					}),
					activeTab === "wishlist" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white p-6 md:p-8 rounded-sm border border-border shadow-md space-y-6 animate-in fade-in",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl font-bold text-[var(--wine-deep)] border-b border-border pb-3",
							children: "Saved Wishlist Items"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground p-6 text-center border border-border rounded bg-secondary/20",
							children: "Your saved wishlist items will appear here. Click the heart icon on any saree to save it for later."
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
export { AccountPage as component };
