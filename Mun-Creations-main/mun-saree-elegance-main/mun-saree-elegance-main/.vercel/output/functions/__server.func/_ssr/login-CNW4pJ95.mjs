import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Lock, N as Mail, a as UserCheck, p as Sparkles, pt as ArrowRight, v as ShieldCheck, z as Key } from "../_libs/lucide-react.mjs";
import { a as I18nProvider, i as Header, n as CartProvider, r as Footer, t as CartDrawer } from "./cart-drawer-D9uioa6i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CNW4pJ95.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginFormContainer, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {})
		]
	}) }) });
}
function LoginFormContainer() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = (0, import_react.useState)("customers");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [rememberMe, setRememberMe] = (0, import_react.useState)(true);
	const [authSuccessMsg, setAuthSuccessMsg] = (0, import_react.useState)("");
	const handleLoginSubmit = (e) => {
		e.preventDefault();
		if (activeTab === "admin") {
			sessionStorage.setItem("mun_admin_authed", "true");
			setAuthSuccessMsg("Admin authentication successful! Redirecting to Master Executive Admin Portal...");
			setTimeout(() => {
				navigate({ to: "/admin" });
			}, 1e3);
		} else if (activeTab === "designers") {
			sessionStorage.setItem("mun_source_authed", "true");
			setAuthSuccessMsg("Designer authentication successful! Redirecting to Sourcing Portal...");
			setTimeout(() => {
				navigate({ to: "/source" });
			}, 1e3);
		} else {
			setAuthSuccessMsg("Customer login successful! Welcome back to Mun Creations.");
			setTimeout(() => {
				navigate({ to: "/account" });
			}, 1e3);
		}
	};
	const setDemoCredentials = (role) => {
		setActiveTab(role);
		if (role === "admin") {
			setEmail("admin@muncreations.com");
			setPassword("mun@dev1234");
		} else if (role === "designers") {
			setEmail("rajeshwar@banarasihandloom.org");
			setPassword("mun@dev1234");
		} else {
			setEmail("priya.sharma@example.com");
			setPassword("mun@dev1234");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-boutique max-w-2xl mx-auto px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-sm border border-border shadow-2xl overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[var(--wine-deep)] text-[var(--ivory)] p-8 text-center border-b border-[var(--gold)]/30 relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "eyebrow text-[var(--gold)] mb-2",
							children: "Authentication Portal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-serif text-3xl md:text-4xl text-white",
							children: "Sign In to Mun Creations"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-white/70 mt-1",
							children: "Select your account portal below to log in"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 border-b border-border bg-secondary/40 text-xs font-semibold uppercase tracking-wider divide-x divide-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setDemoCredentials("designers"),
							className: `py-3.5 px-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-colors ${activeTab === "designers" ? "bg-white text-[var(--wine)] border-b-2 border-[var(--wine)] font-bold shadow-xs" : "text-muted-foreground hover:text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-[var(--gold)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1. Designers" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setDemoCredentials("customers"),
							className: `py-3.5 px-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-colors ${activeTab === "customers" ? "bg-white text-[var(--wine)] border-b-2 border-[var(--wine)] font-bold shadow-xs" : "text-muted-foreground hover:text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4 text-[var(--wine)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2. Customers" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setDemoCredentials("admin"),
							className: `py-3.5 px-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-colors ${activeTab === "admin" ? "bg-white text-[var(--wine)] border-b-2 border-[var(--wine)] font-bold shadow-xs" : "text-muted-foreground hover:text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "3. Main Admin" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-8 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-sm bg-secondary/30 border border-border text-xs text-foreground/80 flex items-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-[var(--wine)] shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							activeTab === "designers" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Designers & Artisans Portal:" }), " Access loom order schedules, submit new weave designs, and track monthly payouts."] }),
							activeTab === "customers" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Customer Account:" }), " View order history, track international shipping, and access exclusive VIP collection previews."] }),
							activeTab === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Main Executive Admin Portal:" }), " Full executive management suite to inspect Customer details, Designer rosters, and revenue diagnostics."] })
						] })]
					}), authSuccessMsg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 rounded-sm bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold text-center animate-in fade-in",
						children: authSuccessMsg
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleLoginSubmit,
						className: "space-y-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-bold block mb-1 text-foreground",
								children: "Email Address"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									required: true,
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: activeTab === "admin" ? "admin@muncreations.com" : activeTab === "designers" ? "designer@handloom.org" : "customer@example.com",
									className: "w-full pl-9 pr-4 py-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" })]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-bold block mb-1 text-foreground",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									required: true,
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: "••••••••••••",
									className: "w-full pl-9 pr-4 py-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" })]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-muted-foreground pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: rememberMe,
										onChange: (e) => setRememberMe(e.target.checked),
										className: "rounded border-border text-[var(--wine)] focus:ring-[var(--wine)] h-3.5 w-3.5"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Remember my session" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#",
									className: "hover:text-[var(--wine)] font-medium",
									children: "Forgot Password?"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								className: "w-full mt-4 bg-[var(--wine)] text-white py-3.5 text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-[var(--wine-deep)] transition-all shadow-md flex items-center justify-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: activeTab === "admin" ? "Enter Main Admin Portal" : activeTab === "designers" ? "Sign In to Designer Portal" : "Sign In to Customer Account" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							})
						]
					})]
				})
			]
		})
	});
}
//#endregion
export { LoginPage as component };
