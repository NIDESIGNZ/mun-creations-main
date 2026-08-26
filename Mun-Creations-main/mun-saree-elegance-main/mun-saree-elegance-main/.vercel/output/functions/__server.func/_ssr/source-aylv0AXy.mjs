import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { H as Image, M as MapPin, O as Package, S as RefreshCw, T as Plus, X as ExternalLink, _ as ShoppingBag, b as Search, f as Star, ht as Activity, l as Trash2, nt as CircleCheck, o as Upload, r as Users, tt as Clock, ut as Building2, v as ShieldCheck } from "../_libs/lucide-react.mjs";
import { a as I18nProvider, i as Header, n as CartProvider, r as Footer, t as CartDrawer } from "./cart-drawer-D9uioa6i.mjs";
import "./products-BQLhYZdU.mjs";
import { t as backendDB } from "./backend-api-DaSHvViK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/source-aylv0AXy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SourcePortalPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourcePortalContent, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {})
		]
	}) }) });
}
function SourcePortalContent() {
	const [isAuthenticated, setIsAuthenticated] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return false;
		return sessionStorage.getItem("mun_source_authed") === "true" || sessionStorage.getItem("mun_admin_authed") === "true";
	});
	const [passcode, setPasscode] = (0, import_react.useState)("");
	const [passError, setPassError] = (0, import_react.useState)("");
	const handleSourceAuthSubmit = (e) => {
		e.preventDefault();
		if (passcode === "mun@dev1234") {
			sessionStorage.setItem("mun_source_authed", "true");
			setIsAuthenticated(true);
		} else setPassError("Invalid Passcode. Access Denied.");
	};
	const [activeTab, setActiveTab] = (0, import_react.useState)("clusters");
	const [sources, setSources] = (0, import_react.useState)(() => backendDB.getSources());
	const [products, setProducts] = (0, import_react.useState)(() => backendDB.getProducts());
	const [orders, setOrders] = (0, import_react.useState)(() => backendDB.getOrders());
	const [health, setHealth] = (0, import_react.useState)(() => backendDB.getHealthStatus());
	if (!isAuthenticated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-boutique max-w-md mx-auto py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white p-8 rounded-sm border border-border shadow-2xl space-y-4 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-12 w-12 rounded-full bg-[var(--gold)]/20 text-[var(--wine)] flex items-center justify-center mx-auto border border-[var(--gold)]/30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-6 w-6 text-[var(--wine)]" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl font-bold text-[var(--wine-deep)]",
					children: "Sourcing Registry Access"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "This sourcing portal is passcode protected for authorized weavers & craft personnel."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSourceAuthSubmit,
					className: "space-y-4 text-xs text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "font-bold block mb-1",
							children: "Passcode / Security Key"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							required: true,
							autoFocus: true,
							value: passcode,
							onChange: (e) => setPasscode(e.target.value),
							placeholder: "Enter sourcing passcode...",
							className: "w-full p-2.5 bg-secondary/30 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)] font-mono text-sm"
						})] }),
						passError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-2 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-sm text-center",
							children: passError
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "w-full bg-[var(--wine)] text-white py-3 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[var(--wine-deep)] transition-colors shadow-md",
							children: "Unlock Sourcing Registry"
						})
					]
				})
			]
		})
	});
	const [catalogSearch, setCatalogSearch] = (0, import_react.useState)("");
	const [newClusterModal, setNewClusterModal] = (0, import_react.useState)(false);
	const [newProductModal, setNewProductModal] = (0, import_react.useState)(false);
	const [clusterForm, setClusterForm] = (0, import_react.useState)({
		clusterName: "",
		region: "",
		state: "",
		specialty: "",
		artisanCount: 50,
		contactPerson: "",
		phone: "",
		email: "",
		leadTimeDays: 14,
		qualityRating: 4.9,
		status: "Active"
	});
	const [productForm, setProductForm] = (0, import_react.useState)({
		name: "",
		category: "Banarasi",
		mainCategory: "sarees",
		fabric: "Silk",
		weave: "Banarasi",
		priceUsd: 350,
		color: "Red",
		inStock: true,
		badge: "new",
		image: "/logo-light.png"
	});
	const handleAddCluster = (e) => {
		e.preventDefault();
		backendDB.addSource(clusterForm);
		setSources(backendDB.getSources());
		setNewClusterModal(false);
		setClusterForm({
			clusterName: "",
			region: "",
			state: "",
			specialty: "",
			artisanCount: 50,
			contactPerson: "",
			phone: "",
			email: "",
			leadTimeDays: 14,
			qualityRating: 4.9,
			status: "Active"
		});
	};
	const handleAddProduct = (e) => {
		e.preventDefault();
		backendDB.addProduct({
			...productForm,
			swatches: ["#800000", "#d4af37"]
		});
		setProducts(backendDB.getProducts());
		setNewProductModal(false);
	};
	const handleImageFileUpload = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				if (reader.result) setProductForm((prev) => ({
					...prev,
					image: reader.result
				}));
			};
			reader.readAsDataURL(file);
		}
	};
	const handleDeleteProduct = (id) => {
		if (confirm("Are you sure you want to delete this listing from the backend?")) {
			backendDB.deleteProduct(id);
			setProducts(backendDB.getProducts());
		}
	};
	const handleToggleStock = (id, currentStock) => {
		backendDB.updateProduct(id, { inStock: !currentStock });
		setProducts(backendDB.getProducts());
	};
	const refreshHealth = () => {
		setHealth(backendDB.getHealthStatus());
	};
	const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(catalogSearch.toLowerCase()) || p.category.toLowerCase().includes(catalogSearch.toLowerCase()) || p.fabric?.toLowerCase().includes(catalogSearch.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-boutique space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-[var(--wine-deep)] text-white rounded-sm p-8 shadow-xl border border-[var(--gold)]/30 relative overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[var(--gold)] font-bold bg-black/40 px-3 py-1 rounded-full border border-[var(--gold)]/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Production Backend & Sourcing Registry" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-serif text-3xl md:text-5xl font-bold text-white",
								children: "Artisanal Sourcing & Admin Portal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs md:text-sm text-white/70 max-w-2xl",
								children: "Oversee direct handloom weaver clusters in Varanasi, Kanchipuram, Bengal, & Lucknow, manage catalog inventory, & monitor real-time backend API endpoints."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setNewClusterModal(true),
							className: "inline-flex items-center justify-center gap-2 bg-[var(--gold)] text-[var(--wine-deep)] px-5 py-3 text-xs uppercase tracking-wider font-bold rounded-sm hover:bg-white transition-all shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Register Cluster" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setNewProductModal(true),
							className: "inline-flex items-center justify-center gap-2 border border-white/40 text-white px-5 py-3 text-xs uppercase tracking-wider font-bold rounded-sm hover:bg-white/10 transition-all shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add Listing" })]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white p-5 rounded-sm border border-border shadow-xs flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-12 w-12 rounded-full bg-[var(--wine)]/10 text-[var(--wine)] flex items-center justify-center shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-6 w-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-serif font-bold text-[var(--wine-deep)]",
							children: sources.length
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] uppercase tracking-wider text-muted-foreground font-semibold",
							children: "Weaving Clusters"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white p-5 rounded-sm border border-border shadow-xs flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-12 w-12 rounded-full bg-[var(--gold)]/20 text-[var(--wine-deep)] flex items-center justify-center shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-6 w-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-serif font-bold text-[var(--wine-deep)]",
							children: products.length
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] uppercase tracking-wider text-muted-foreground font-semibold",
							children: "Sourced Items"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white p-5 rounded-sm border border-border shadow-xs flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-6 w-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-serif font-bold text-[var(--wine-deep)]",
							children: orders.length
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] uppercase tracking-wider text-muted-foreground font-semibold",
							children: "Active Orders"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white p-5 rounded-sm border border-border shadow-xs flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-12 w-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-6 w-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-serif font-bold text-emerald-600",
							children: health.status
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] uppercase tracking-wider text-muted-foreground font-semibold",
							children: "Backend Server API"
						})] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex border-b border-border bg-white rounded-t-sm p-1 shadow-xs gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("clusters"),
						className: `flex-1 py-3 text-xs uppercase tracking-wider font-bold rounded-sm transition-all flex items-center justify-center gap-2 ${activeTab === "clusters" ? "bg-[var(--wine-deep)] text-white shadow-sm" : "text-foreground/70 hover:bg-secondary/50"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Artisanal Clusters (",
							sources.length,
							")"
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("catalog"),
						className: `flex-1 py-3 text-xs uppercase tracking-wider font-bold rounded-sm transition-all flex items-center justify-center gap-2 ${activeTab === "catalog" ? "bg-[var(--wine-deep)] text-white shadow-sm" : "text-foreground/70 hover:bg-secondary/50"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Catalog Inventory (",
							products.length,
							")"
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("orders"),
						className: `flex-1 py-3 text-xs uppercase tracking-wider font-bold rounded-sm transition-all flex items-center justify-center gap-2 ${activeTab === "orders" ? "bg-[var(--wine-deep)] text-white shadow-sm" : "text-foreground/70 hover:bg-secondary/50"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Fulfillment Orders (",
							orders.length,
							")"
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("api"),
						className: `flex-1 py-3 text-xs uppercase tracking-wider font-bold rounded-sm transition-all flex items-center justify-center gap-2 ${activeTab === "api" ? "bg-[var(--wine-deep)] text-white shadow-sm" : "text-foreground/70 hover:bg-secondary/50"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "REST API & Diagnostics" })]
					})
				]
			}),
			activeTab === "clusters" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
				children: sources.map((src) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-sm border border-border p-6 shadow-xs space-y-4 hover:border-[var(--gold)] transition-colors",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between border-b border-border pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] uppercase tracking-wider font-bold text-[var(--gold)] bg-[var(--wine-deep)] px-2.5 py-0.5 rounded-xs",
								children: [
									src.region,
									", ",
									src.state
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-serif text-xl font-bold text-[var(--wine-deep)] mt-1",
								children: src.clusterName
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), src.status]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs space-y-2 text-foreground/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-medium text-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground font-normal",
										children: "Craft Specialty:"
									}),
									" ",
									src.specialty
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2 pt-1 border-t border-border/50 text-[11px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5 text-[var(--wine)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [src.artisanCount, " Master Weavers"] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5 text-[var(--wine)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [src.leadTimeDays, " Days Lead Time"] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 text-amber-500 fill-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [src.qualityRating, " / 5.0 Rating"] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-[var(--wine)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [src.region, " Cluster"] })]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: src.contactPerson
								}),
								" · ",
								src.phone
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `mailto:${src.email}`,
								className: "text-[var(--wine)] hover:underline font-medium",
								children: src.email
							})]
						})
					]
				}, src.id))
			}),
			activeTab === "catalog" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-sm border border-border shadow-xs p-6 space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 max-w-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							placeholder: "Search catalog by name, category, or fabric...",
							value: catalogSearch,
							onChange: (e) => setCatalogSearch(e.target.value),
							className: "w-full pl-9 pr-4 py-2 text-xs bg-secondary/40 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground font-medium",
						children: [
							"Showing ",
							filteredProducts.length,
							" of ",
							products.length,
							" products"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-secondary/60 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Item"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Category"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Fabric"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Price (USD)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Stock Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-right",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border",
							children: filteredProducts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-secondary/30 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3 px-4 font-semibold text-foreground flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: p.image,
											alt: p.name,
											className: "h-9 w-9 object-cover rounded-xs border border-border"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-serif font-bold text-[var(--wine-deep)]",
											children: p.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] text-muted-foreground",
											children: ["ID: ", p.id]
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-foreground/80 font-medium",
										children: p.category
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-foreground/80",
										children: p.fabric || "Pure Silk"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3 px-4 font-bold text-[var(--wine)]",
										children: ["$", p.priceUsd]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleToggleStock(p.id, p.inStock ?? true),
											className: `px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${p.inStock ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`,
											children: p.inStock ? "In Stock" : "Out of Stock"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => handleDeleteProduct(p.id),
											className: "text-rose-600 hover:text-rose-900 p-1 font-medium text-xs inline-flex items-center gap-1",
											title: "Delete product",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Delete" })]
										})
									})
								]
							}, p.id))
						})]
					})
				})]
			}),
			activeTab === "orders" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: orders.map((ord) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-sm border border-border p-6 shadow-xs space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-serif text-lg font-bold text-[var(--wine-deep)]",
								children: ord.id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800",
								children: ord.status
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: ["Ordered on ", new Date(ord.createdAt).toLocaleDateString()]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-lg font-serif font-bold text-[var(--wine)]",
								children: ["$", ord.subtotalUsd]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground uppercase tracking-wider",
								children: "Paid via Card"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold text-foreground mb-1 uppercase tracking-wider text-[10px] text-muted-foreground",
								children: "Customer & Shipping Address"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold",
								children: ord.customerName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground",
								children: [
									ord.email,
									" · ",
									ord.phone
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-foreground/80 mt-1",
								children: ord.shippingAddress
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-bold text-foreground mb-1 uppercase tracking-wider text-[10px] text-muted-foreground",
							children: "Purchased Items"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1",
							children: ord.items.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between py-0.5 border-b border-border/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									item.quantity,
									"x ",
									item.productName
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold",
									children: ["$", item.priceUsd]
								})]
							}, idx))
						})] })]
					})]
				}, ord.id))
			}),
			activeTab === "api" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-sm border border-border p-6 shadow-xs space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-serif text-lg font-bold text-[var(--wine-deep)]",
								children: "Backend Health & REST API Controller"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Production REST endpoints serving products, weaver clusters, & checkout orders"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: refreshHealth,
								className: "inline-flex items-center gap-1.5 bg-secondary text-foreground text-xs uppercase tracking-wider px-3.5 py-2 rounded-sm font-semibold hover:bg-border transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Refresh Diagnostics" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-secondary/40 rounded-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground uppercase font-bold",
										children: "Server State"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-bold text-emerald-600",
										children: health.status
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-secondary/40 rounded-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground uppercase font-bold",
										children: "Uptime"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-bold text-foreground",
										children: [health.uptimeSeconds, "s"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-secondary/40 rounded-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground uppercase font-bold",
										children: "Database State"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-bold text-blue-600",
										children: health.databaseState
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-secondary/40 rounded-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground uppercase font-bold",
										children: "Version"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-bold text-foreground",
										children: health.version
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold text-xs uppercase tracking-wider text-muted-foreground",
								children: "Available REST Routes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "/api/health",
										target: "_blank",
										className: "p-2.5 bg-slate-900 text-slate-100 rounded-sm flex items-center justify-between hover:bg-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GET /api/health" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5 text-emerald-400" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "/api/products",
										target: "_blank",
										className: "p-2.5 bg-slate-900 text-slate-100 rounded-sm flex items-center justify-between hover:bg-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GET /api/products" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5 text-emerald-400" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "/api/sources",
										target: "_blank",
										className: "p-2.5 bg-slate-900 text-slate-100 rounded-sm flex items-center justify-between hover:bg-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GET /api/sources" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5 text-emerald-400" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "/api/orders",
										target: "_blank",
										className: "p-2.5 bg-slate-900 text-slate-100 rounded-sm flex items-center justify-between hover:bg-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GET /api/orders" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5 text-emerald-400" })]
									})
								]
							})]
						})
					]
				})
			}),
			newClusterModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-sm max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-xl font-bold text-[var(--wine-deep)]",
						children: "Register New Weaver Cluster"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleAddCluster,
						className: "space-y-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-semibold block mb-1",
								children: "Cluster / Cooperative Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								placeholder: "e.g. Kanchipuram Weavers Association",
								value: clusterForm.clusterName,
								onChange: (e) => setClusterForm({
									...clusterForm,
									clusterName: e.target.value
								}),
								className: "w-full p-2 border border-border rounded-sm"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold block mb-1",
									children: "Region / City"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									placeholder: "Varanasi",
									value: clusterForm.region,
									onChange: (e) => setClusterForm({
										...clusterForm,
										region: e.target.value
									}),
									className: "w-full p-2 border border-border rounded-sm"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold block mb-1",
									children: "State"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									placeholder: "Uttar Pradesh",
									value: clusterForm.state,
									onChange: (e) => setClusterForm({
										...clusterForm,
										state: e.target.value
									}),
									className: "w-full p-2 border border-border rounded-sm"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-semibold block mb-1",
								children: "Handloom Specialty"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								placeholder: "Pure Silk Katan & Jaal Banarasi",
								value: clusterForm.specialty,
								onChange: (e) => setClusterForm({
									...clusterForm,
									specialty: e.target.value
								}),
								className: "w-full p-2 border border-border rounded-sm"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold block mb-1",
									children: "Artisan Count"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									value: clusterForm.artisanCount,
									onChange: (e) => setClusterForm({
										...clusterForm,
										artisanCount: Number(e.target.value)
									}),
									className: "w-full p-2 border border-border rounded-sm"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold block mb-1",
									children: "Contact Person"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									placeholder: "Master Weaver",
									value: clusterForm.contactPerson,
									onChange: (e) => setClusterForm({
										...clusterForm,
										contactPerson: e.target.value
									}),
									className: "w-full p-2 border border-border rounded-sm"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setNewClusterModal(false),
									className: "px-4 py-2 bg-secondary text-foreground rounded-sm font-semibold",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "px-5 py-2 bg-[var(--wine)] text-white rounded-sm font-semibold hover:bg-[var(--wine-deep)]",
									children: "Save Cluster"
								})]
							})
						]
					})]
				})
			}),
			newProductModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-sm max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-xl font-bold text-[var(--wine-deep)]",
						children: "Add New Sourced Listing"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleAddProduct,
						className: "space-y-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-semibold block mb-1",
								children: "Product Title"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								placeholder: "e.g. Shahi Brocade Kanjivaram Silk Saree",
								value: productForm.name,
								onChange: (e) => setProductForm({
									...productForm,
									name: e.target.value
								}),
								className: "w-full p-2 border border-border rounded-sm"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold block mb-1",
									children: "Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									placeholder: "Banarasi",
									value: productForm.category,
									onChange: (e) => setProductForm({
										...productForm,
										category: e.target.value
									}),
									className: "w-full p-2 border border-border rounded-sm"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold block mb-1",
									children: "Fabric"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									placeholder: "Silk",
									value: productForm.fabric,
									onChange: (e) => setProductForm({
										...productForm,
										fabric: e.target.value
									}),
									className: "w-full p-2 border border-border rounded-sm"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold block mb-1",
									children: "Price (USD)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									required: true,
									value: productForm.priceUsd,
									onChange: (e) => setProductForm({
										...productForm,
										priceUsd: Number(e.target.value)
									}),
									className: "w-full p-2 border border-border rounded-sm"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold block mb-1",
									children: "Color"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: productForm.color,
									onChange: (e) => setProductForm({
										...productForm,
										color: e.target.value
									}),
									className: "w-full p-2 border border-border rounded-sm"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 pt-2 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold block text-xs",
									children: "Product Image"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-16 w-16 rounded-sm border border-border bg-secondary/50 overflow-hidden shrink-0 flex items-center justify-center relative shadow-xs",
										children: productForm.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: productForm.image,
											alt: "Preview",
											className: "h-full w-full object-cover"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-6 w-6 text-muted-foreground" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											placeholder: "Enter Image URL or select file...",
											value: productForm.image,
											onChange: (e) => setProductForm({
												...productForm,
												image: e.target.value
											}),
											className: "w-full p-2 text-xs border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "cursor-pointer inline-flex items-center gap-1.5 bg-secondary text-foreground text-[11px] px-3 py-1.5 rounded-sm border border-border hover:bg-border font-medium transition-colors",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5 text-[var(--wine)]" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Upload File" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "file",
														accept: "image/*",
														onChange: handleImageFileUpload,
														className: "hidden"
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												onChange: (e) => e.target.value && setProductForm({
													...productForm,
													image: e.target.value
												}),
												className: "text-[11px] p-1.5 border border-border rounded-sm bg-white text-muted-foreground focus:outline-none",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "",
														children: "Sample Images..."
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "/assets/hero-saree-LrhnA6h_.jpg",
														children: "Maroon Silk Saree"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "/assets/cat-silk-UAUAsMCw.jpg",
														children: "Emerald Banarasi"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "/assets/cat-predraped-CM4qnP6I.jpg",
														children: "Ivory Organza"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "/assets/cat-cotton-Dy_SM9cU.jpg",
														children: "Mustard Cotton"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "/assets/product-teal-CDG1iycJ.jpg",
														children: "Teal Silk Saree"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "/assets/product-pink-CSPlHlcH.jpg",
														children: "Blush Pink Saree"
													})
												]
											})]
										})]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setNewProductModal(false),
									className: "px-4 py-2 bg-secondary text-foreground rounded-sm font-semibold",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "px-5 py-2 bg-[var(--wine)] text-white rounded-sm font-semibold hover:bg-[var(--wine-deep)]",
									children: "Add Product"
								})]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { SourcePortalPage as component };
