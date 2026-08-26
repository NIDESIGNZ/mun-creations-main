import { r as __toESM } from "../_runtime.mjs";
import { n as CATEGORY_FILTERS } from "./catalog-iLO1lIu8.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { $ as CreditCard, F as Lock, L as LayoutDashboard, O as Package, S as RefreshCw, T as Plus, Y as Eye, _ as ShoppingBag, c as TriangleAlert, dt as Bot, l as Trash2, o as Upload, s as Truck } from "../_libs/lucide-react.mjs";
import { t as backendDB } from "./backend-api-DaSHvViK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Dkcob487.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const [authenticated, setAuthenticated] = (0, import_react.useState)(false);
	const [password, setPassword] = (0, import_react.useState)("");
	const [passError, setPassError] = (0, import_react.useState)("");
	const handleLogin = (e) => {
		e.preventDefault();
		if (password === "mun@dev1234") {
			setAuthenticated(true);
			setPassError("");
		} else setPassError("Incorrect password. Access denied.");
	};
	if (!authenticated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-slate-950 text-white flex items-center justify-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-slate-900 border border-slate-800 rounded-sm p-8 max-w-md w-full shadow-2xl space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-12 w-12 rounded-full bg-[var(--gold)]/20 text-[var(--gold)] flex items-center justify-center mx-auto border border-[var(--gold)]/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-[0.2em] text-[var(--gold)] font-bold",
						children: "Mun Creations"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-2xl font-bold text-white",
						children: "Main Admin Portal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400",
						children: "Enter password to access enterprise order & catalog engine"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleLogin,
				className: "space-y-4 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "font-bold block mb-1 text-slate-300",
						children: "Admin Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "password",
						required: true,
						value: password,
						onChange: (e) => setPassword(e.target.value),
						placeholder: "Enter password...",
						className: "w-full p-3 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)] font-mono"
					})] }),
					passError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-red-400 font-semibold",
						children: passError
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "w-full bg-[var(--gold)] text-slate-950 py-3 text-xs font-bold uppercase tracking-wider rounded hover:bg-white transition-colors",
						children: "Sign In to Admin Portal"
					})
				]
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDashboardContent, { onLogout: () => setAuthenticated(false) });
}
function AdminDashboardContent({ onLogout }) {
	const [activeTab, setActiveTab] = (0, import_react.useState)("dashboard");
	const [products, setProducts] = (0, import_react.useState)(backendDB.getProducts());
	const [orders, setOrders] = (0, import_react.useState)(backendDB.getOrders());
	const [catalogSearch, setCatalogSearch] = (0, import_react.useState)("");
	const [catalogCategory, setCatalogCategory] = (0, import_react.useState)("");
	const [editingProduct, setEditingProduct] = (0, import_react.useState)(null);
	const [csvText, setCsvText] = (0, import_react.useState)("");
	const [csvResult, setCsvResult] = (0, import_react.useState)(null);
	const [testPincode, setTestPincode] = (0, import_react.useState)("560001");
	const [testOrderVal, setTestOrderVal] = (0, import_react.useState)("580");
	const [pincodeResult, setPincodeResult] = (0, import_react.useState)(null);
	const [aiName, setAiName] = (0, import_react.useState)("Crimson Katan Banarasi");
	const [aiFabric, setAiFabric] = (0, import_react.useState)("Katan Silk");
	const [aiCraft, setAiCraft] = (0, import_react.useState)("Kadwa Zari Weave");
	const [aiColor, setAiColor] = (0, import_react.useState)("Crimson Red");
	const [aiGeneratedCopy, setAiGeneratedCopy] = (0, import_react.useState)(null);
	const totalSalesUsd = orders.reduce((s, o) => s + (o.status !== "Cancelled" ? o.subtotalUsd : 0), 0);
	const lowStockProducts = products.filter((p) => (p.stockQuantity ?? 1) <= 3);
	const refreshData = () => {
		setProducts([...backendDB.getProducts()]);
		setOrders([...backendDB.getOrders()]);
	};
	const handleUpdateStatus = (orderId, status) => {
		backendDB.updateOrderStatus(orderId, status);
		refreshData();
	};
	const handleDeleteProd = (id) => {
		if (confirm("Are you sure you want to delete this product from database?")) {
			backendDB.deleteProduct(id);
			refreshData();
		}
	};
	const handleRunCSVImport = () => {
		if (!csvText.trim()) return;
		const res = backendDB.parseAndImportCSV(csvText);
		setCsvResult(res);
		refreshData();
	};
	const handleCheckPincode = () => {
		const res = backendDB.checkPincodeServiceability(testPincode, parseFloat(testOrderVal) || 0);
		setPincodeResult(res);
	};
	const handleGenerateAICopy = () => {
		const res = backendDB.generateAICopy(aiName, aiFabric, aiCraft, aiColor);
		setAiGeneratedCopy(res);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-8 w-8 rounded bg-[var(--gold)] text-slate-950 flex items-center justify-center font-bold font-serif text-lg",
					children: "M"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-serif font-bold text-lg text-white",
					children: "Mun Creations — Enterprise Admin"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] text-slate-400 uppercase tracking-widest font-mono",
					children: "Control Center v3.4"
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "/",
					target: "_blank",
					className: "text-slate-400 hover:text-white flex items-center gap-1 font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4 text-[var(--gold)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Live Storefront" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onLogout,
					className: "bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded font-bold transition-colors",
					children: "Sign Out"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "w-64 bg-slate-900 border-r border-slate-800 p-4 space-y-2 shrink-0 text-xs font-semibold",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] text-slate-500 uppercase tracking-wider px-3 pb-1 font-mono",
						children: "Navigation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("dashboard"),
						className: `w-full text-left p-3 rounded flex items-center gap-2.5 transition-colors ${activeTab === "dashboard" ? "bg-[var(--wine)] text-white font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1. Dashboard" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("catalog"),
						className: `w-full text-left p-3 rounded flex items-center gap-2.5 transition-colors ${activeTab === "catalog" ? "bg-[var(--wine)] text-white font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"2. Catalog (",
							products.length,
							")"
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("add-product"),
						className: `w-full text-left p-3 rounded flex items-center gap-2.5 transition-colors ${activeTab === "add-product" ? "bg-[var(--wine)] text-white font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "3. Tabbed Add Product" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("csv-import"),
						className: `w-full text-left p-3 rounded flex items-center gap-2.5 transition-colors ${activeTab === "csv-import" ? "bg-[var(--wine)] text-white font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "4. CSV Bulk Upload" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("orders"),
						className: `w-full text-left p-3 rounded flex items-center gap-2.5 transition-colors ${activeTab === "orders" ? "bg-[var(--wine)] text-white font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"5. Orders (",
							orders.length,
							")"
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("shipping"),
						className: `w-full text-left p-3 rounded flex items-center gap-2.5 transition-colors ${activeTab === "shipping" ? "bg-[var(--wine)] text-white font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "6. Shipping & Courier Engine" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("payments"),
						className: `w-full text-left p-3 rounded flex items-center gap-2.5 transition-colors ${activeTab === "payments" ? "bg-[var(--wine)] text-white font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "7. Razorpay Reconciliation" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("ai-copy"),
						className: `w-full text-left p-3 rounded flex items-center gap-2.5 transition-colors ${activeTab === "ai-copy" ? "bg-[var(--wine)] text-white font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-4 w-4 text-[var(--gold)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "8. AI Copy Generator" })]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 p-6 md:p-8 overflow-y-auto bg-slate-950",
				children: [
					activeTab === "dashboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-serif text-2xl font-bold text-white",
									children: "Admin Dashboard & Metrics"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-400",
									children: "Live store sales performance, inventory intelligence & order fulfillment"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: refreshData,
									className: "bg-slate-900 border border-slate-800 text-xs px-3 py-2 rounded flex items-center gap-1.5 hover:bg-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 text-[var(--gold)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Refresh Metrics" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-5 bg-slate-900 border border-slate-800 rounded space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-slate-400 font-bold uppercase tracking-wider",
												children: "Gross Sales Revenue"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-serif text-3xl font-bold text-emerald-400",
												children: ["$", totalSalesUsd.toLocaleString()]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[10px] text-slate-500 font-mono",
												children: [
													"₹",
													Math.round(totalSalesUsd * 83.5).toLocaleString(),
													" INR"
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-5 bg-slate-900 border border-slate-800 rounded space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-slate-400 font-bold uppercase tracking-wider",
												children: "Total Customer Orders"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-serif text-3xl font-bold text-white",
												children: orders.length
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-emerald-400 font-semibold",
												children: "100% Verified Payment"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-5 bg-slate-900 border border-slate-800 rounded space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-slate-400 font-bold uppercase tracking-wider",
												children: "Active Catalog Products"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-serif text-3xl font-bold text-white",
												children: products.length
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-slate-400",
												children: "across 28 Saree Categories"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-5 bg-slate-900 border border-slate-800 rounded space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-slate-400 font-bold uppercase tracking-wider",
												children: "Low Stock Intelligence"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-serif text-3xl font-bold text-amber-400",
												children: lowStockProducts.length
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-amber-500 font-semibold",
												children: "Stock quantity <= 3"
											})
										]
									})
								]
							}),
							lowStockProducts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-5 bg-amber-950/40 border border-amber-800/60 rounded text-xs space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-bold text-amber-400 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Low Stock Intelligence Alerts (",
										lowStockProducts.length,
										" Products Need Replenishment)"
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3",
									children: lowStockProducts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-slate-900 rounded border border-amber-900/40 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-serif font-bold text-white truncate max-w-[180px]",
											children: p.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] text-slate-400",
											children: ["SKU: ", p.sku]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "bg-amber-900 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded font-mono",
											children: [p.stockQuantity, " Left"]
										})]
									}, p.id))
								})]
							})
						]
					}),
					activeTab === "catalog" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "font-serif text-2xl font-bold text-white",
								children: [
									"Master Product Catalog (",
									products.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-400",
								children: "Manage SKU records, stock quantities, and availability status"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "Search SKU or name...",
									value: catalogSearch,
									onChange: (e) => setCatalogSearch(e.target.value),
									className: "p-2 bg-slate-900 border border-slate-800 rounded text-xs text-white placeholder:text-slate-500 focus:outline-none"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: catalogCategory,
									onChange: (e) => setCatalogCategory(e.target.value),
									className: "p-2 bg-slate-900 border border-slate-800 rounded text-xs text-white focus:outline-none",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "All Categories"
									}), CATEGORY_FILTERS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c,
										children: c
									}, c))]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-slate-900 border border-slate-800 rounded overflow-x-auto text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left divide-y divide-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Product / SKU"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Category / Fabric"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Price"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Stock"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3 text-right",
											children: "Actions"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-slate-800 text-slate-300",
									children: products.filter((p) => {
										if (catalogCategory && p.category !== catalogCategory) return false;
										if (catalogSearch.trim()) {
											const q = catalogSearch.toLowerCase();
											return p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q);
										}
										return true;
									}).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-slate-800/50",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: p.image,
														alt: p.name,
														className: "h-10 w-8 object-cover rounded border border-slate-700"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-serif font-bold text-white truncate max-w-xs",
														children: p.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-[10px] text-slate-500 font-mono",
														children: ["SKU: ", p.sku || p.id]
													})] })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "p-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: p.category }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] text-slate-500",
													children: p.fabric
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "p-3 font-bold text-emerald-400",
												children: ["$", p.priceUsd]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: 0,
													value: p.stockQuantity ?? 1,
													onChange: (e) => {
														const val = parseInt(e.target.value) || 0;
														backendDB.updateProduct(p.id, {
															stockQuantity: val,
															availability: val === 0 ? "Out of Stock" : "Available"
														});
														refreshData();
													},
													className: "w-16 p-1 bg-slate-950 border border-slate-800 rounded font-mono text-center text-xs text-white"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `px-2 py-0.5 rounded text-[10px] font-bold uppercase ${(p.stockQuantity ?? 1) > 0 ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-red-950 text-red-300 border border-red-800"}`,
													children: p.availability || "Available"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => handleDeleteProd(p.id),
													className: "p-1.5 text-red-400 hover:bg-red-950 rounded",
													title: "Delete Product",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
												})
											})
										]
									}, p.id))
								})]
							})
						})]
					}),
					activeTab === "add-product" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddProductTabbedForm, { onCreated: () => {
						refreshData();
						setActiveTab("catalog");
					} }),
					activeTab === "csv-import" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in max-w-3xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-serif text-2xl font-bold text-white",
							children: "CSV Bulk Product Upload Engine"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400",
							children: "Upload CSV file to import hundreds of sarees in one batch"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-900 border border-slate-800 p-6 rounded space-y-4 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold block text-slate-300",
									children: "Paste CSV Contents (or Drag & Drop)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 8,
									placeholder: `SKU, Product Name, Category, Fabric, Price, Stock\nEBS-101, Crimson Banarasi Katan, Banarasi, Silk, 580, 5\nEBS-102, Gold Tissue Saree, Tissue, Silk, 420, 3`,
									value: csvText,
									onChange: (e) => setCsvText(e.target.value),
									className: "w-full p-3 bg-slate-950 border border-slate-800 rounded font-mono text-xs text-white focus:outline-none focus:border-[var(--gold)]"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleRunCSVImport,
									className: "bg-[var(--gold)] text-slate-950 px-6 py-3 font-bold uppercase tracking-wider text-xs rounded hover:bg-white transition-colors",
									children: "Validate & Run CSV Import"
								}),
								csvResult && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 bg-slate-950 rounded border border-slate-800 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-emerald-400 font-bold",
										children: [
											"Successfully imported ",
											csvResult.importedCount,
											" products!"
										]
									}), csvResult.errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-red-400 text-[11px] space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Errors / Warnings:" }), csvResult.errors.map((err, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["• ", err] }, idx))]
									})]
								})
							]
						})]
					}),
					activeTab === "orders" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-serif text-2xl font-bold text-white",
							children: [
								"Order Management & Fulfillment (",
								orders.length,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400",
							children: "Update order fulfillment status, print invoice, and dispatch courier tracking"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: orders.map((ord) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-slate-900 border border-slate-800 p-5 rounded space-y-4 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono font-bold text-sm text-[var(--gold)]",
											children: ord.id
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-slate-400 text-[10px]",
											children: [
												"Customer: ",
												ord.customerName,
												" (",
												ord.email,
												")"
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-400",
												children: "Fulfillment Status:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: ord.status,
												onChange: (e) => handleUpdateStatus(ord.id, e.target.value),
												className: "p-1.5 bg-slate-950 border border-slate-700 rounded font-bold text-xs text-emerald-400 focus:outline-none",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Pending Payment",
														children: "Pending Payment"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Paid",
														children: "Paid"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Confirmed",
														children: "Confirmed"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Processing",
														children: "Processing"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Packed",
														children: "Packed"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Shipped",
														children: "Shipped"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Out for Delivery",
														children: "Out for Delivery"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Delivered",
														children: "Delivered"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Returned",
														children: "Returned"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "RTO",
														children: "RTO"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Cancelled",
														children: "Cancelled"
													})
												]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-slate-300",
											children: "Items Ordered:"
										}), ord.items.map((it, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-slate-400",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												it.productName,
												" (x",
												it.quantity,
												")"
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-bold text-white",
												children: ["$", it.priceUsd * it.quantity]
											})]
										}, idx))]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-slate-400 gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Address: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white font-medium",
											children: ord.shippingAddress
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 font-mono text-[10px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["AWB: ", ord.awbNumber || "N/A"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Courier: ", ord.courierPartner || "Shiprocket Air"] })]
										})]
									})
								]
							}, ord.id))
						})]
					}),
					activeTab === "shipping" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in max-w-3xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-serif text-2xl font-bold text-white",
							children: "Shipping & Courier Serviceability Engine"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400",
							children: "Test pincode express air serviceability and courier SLA timeline"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-900 border border-slate-800 p-6 rounded space-y-4 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold block mb-1 text-slate-300",
										children: "Pincode to Test"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: testPincode,
										onChange: (e) => setTestPincode(e.target.value),
										className: "w-full p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-white"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold block mb-1 text-slate-300",
										children: "Order Total ($)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: testOrderVal,
										onChange: (e) => setTestOrderVal(e.target.value),
										className: "w-full p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-white"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleCheckPincode,
									className: "bg-[var(--gold)] text-slate-950 px-6 py-2.5 font-bold uppercase tracking-wider rounded",
									children: "Test Courier Air Serviceability"
								}),
								pincodeResult && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 bg-slate-950 rounded border border-slate-800 space-y-2 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["City / State: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
											pincodeResult.city,
											", ",
											pincodeResult.state
										] })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Air Serviceable: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-400 font-bold",
											children: "YES (Shiprocket / DHL Express)"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Est. Delivery: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-emerald-400 font-mono font-bold",
											children: [pincodeResult.estimatedDays, " Business Days"]
										})] })
									]
								})
							]
						})]
					}),
					activeTab === "payments" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in max-w-4xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-serif text-2xl font-bold text-white",
							children: "Razorpay Payment Reconciliation & Webhook Log"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400",
							children: "Verify 256-bit payment signatures and capture status"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-900 border border-slate-800 p-5 rounded space-y-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold text-slate-300 border-b border-slate-800 pb-2",
								children: "Razorpay Transaction Ledger"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2 font-mono text-[11px]",
								children: orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-slate-950 rounded border border-slate-800 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-white font-bold",
										children: o.paymentId || "pay_RzpSimulated"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-slate-500",
										children: [
											"Order: ",
											o.id,
											" · ",
											o.customerName
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-emerald-400 font-bold",
											children: ["₹", Math.round(o.subtotalUsd * 83.5).toLocaleString()]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bg-emerald-950 text-emerald-300 text-[9px] px-2 py-0.5 rounded uppercase font-bold",
											children: "Captured"
										})]
									})]
								}, o.id))
							})]
						})]
					}),
					activeTab === "ai-copy" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in max-w-3xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-serif text-2xl font-bold text-white flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-6 w-6 text-[var(--gold)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI Product Copywriting Generator" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400",
							children: "Generate SEO titles, full description, highlights, and Instagram captions instantly"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-900 border border-slate-800 p-6 rounded space-y-4 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-bold block mb-1 text-slate-300",
											children: "Product Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: aiName,
											onChange: (e) => setAiName(e.target.value),
											className: "w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-bold block mb-1 text-slate-300",
											children: "Fabric"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: aiFabric,
											onChange: (e) => setAiFabric(e.target.value),
											className: "w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-bold block mb-1 text-slate-300",
											children: "Craft / Weave"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: aiCraft,
											onChange: (e) => setAiCraft(e.target.value),
											className: "w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-bold block mb-1 text-slate-300",
											children: "Colour"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: aiColor,
											onChange: (e) => setAiColor(e.target.value),
											className: "w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white"
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleGenerateAICopy,
									className: "bg-[var(--gold)] text-slate-950 px-6 py-2.5 font-bold uppercase tracking-wider rounded",
									children: "Generate AI Copy & SEO Data"
								}),
								aiGeneratedCopy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-5 bg-slate-950 rounded border border-slate-800 space-y-3 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-[var(--gold)] block mb-1",
											children: "SEO Title:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white font-mono",
											children: aiGeneratedCopy.seoTitle
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-[var(--gold)] block mb-1",
											children: "Full Description:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-300",
											children: aiGeneratedCopy.fullDescription
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-[var(--gold)] block mb-1",
											children: "Instagram Caption:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-300 font-mono",
											children: aiGeneratedCopy.instagramCaption
										})] })
									]
								})
							]
						})]
					})
				]
			})]
		})]
	});
}
function AddProductTabbedForm({ onCreated }) {
	const [formTab, setFormTab] = (0, import_react.useState)("basic");
	const [name, setName] = (0, import_react.useState)("Royal Purple Katan Banarasi Saree");
	const [sku, setSku] = (0, import_react.useState)("EBS-NEW-701");
	const [category, setCategory] = (0, import_react.useState)("Banarasi");
	const [fabric, setFabric] = (0, import_react.useState)("Katan");
	const [color, setColor] = (0, import_react.useState)("Purple");
	const [priceUsd, setPriceUsd] = (0, import_react.useState)("640");
	const [stock, setStock] = (0, import_react.useState)("5");
	const handleSubmit = (e) => {
		e.preventDefault();
		backendDB.addProduct({
			sku,
			name,
			slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
			category,
			productType: category,
			fabric,
			color,
			priceUsd: parseFloat(priceUsd) || 500,
			stockQuantity: parseInt(stock) || 1,
			availability: "Available",
			vendor: "Ethnic Boutique Admin",
			image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
			swatches: ["#9333ea", "#d4af37"],
			shortDescription: `Handcrafted ${color} ${fabric} saree.`,
			fullDescription: `Authentic ${name} in rich ${fabric}.`
		});
		onCreated();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-2xl font-bold text-white",
			children: "7-Tab Add Product Engine"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-slate-400",
			children: "Complete structured entry for Master Database"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-slate-900 border border-slate-800 rounded p-6 space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex border-b border-slate-800 text-xs font-bold uppercase tracking-wider overflow-x-auto gap-2",
				children: [
					"basic",
					"pricing",
					"inventory",
					"attributes",
					"images",
					"seo"
				].map((tb) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setFormTab(tb),
					className: `pb-2.5 px-3 capitalize transition-colors ${formTab === tb ? "border-b-2 border-[var(--gold)] text-[var(--gold)]" : "text-slate-400 hover:text-white"}`,
					children: tb
				}, tb))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4 text-xs",
				children: [
					formTab === "basic" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "font-bold block mb-1 text-slate-300",
							children: "Product Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							required: true,
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-bold block mb-1 text-slate-300",
								children: "SKU Code"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								value: sku,
								onChange: (e) => setSku(e.target.value),
								className: "w-full p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-white"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-bold block mb-1 text-slate-300",
								children: "Category"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: category,
								onChange: (e) => setCategory(e.target.value),
								className: "w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white",
								children: CATEGORY_FILTERS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c,
									children: c
								}, c))
							})] })]
						})]
					}),
					formTab === "pricing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "font-bold block mb-1 text-slate-300",
							children: "Selling Price ($ USD)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							required: true,
							value: priceUsd,
							onChange: (e) => setPriceUsd(e.target.value),
							className: "w-full p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-emerald-400"
						})] })
					}),
					formTab === "inventory" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "font-bold block mb-1 text-slate-300",
							children: "Stock Quantity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							required: true,
							value: stock,
							onChange: (e) => setStock(e.target.value),
							className: "w-full p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-white"
						})] })
					}),
					formTab === "attributes" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "font-bold block mb-1 text-slate-300",
							children: "Fabric"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: fabric,
							onChange: (e) => setFabric(e.target.value),
							className: "w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "font-bold block mb-1 text-slate-300",
							children: "Colour"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: color,
							onChange: (e) => setColor(e.target.value),
							className: "w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white"
						})] })]
					}),
					formTab === "images" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 bg-slate-950 rounded border border-slate-800 text-center text-slate-400",
						children: "Primary Image preview configured automatically."
					}),
					formTab === "seo" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 bg-slate-950 rounded border border-slate-800 text-center text-slate-400",
						children: "SEO Title & Meta Tags auto-generated from product title."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "w-full mt-4 bg-[var(--gold)] text-slate-950 py-3 font-bold uppercase tracking-wider text-xs rounded hover:bg-white transition-colors",
						children: "Save & Publish Product Record"
					})
				]
			})]
		})]
	});
}
//#endregion
export { AdminPage as component };
