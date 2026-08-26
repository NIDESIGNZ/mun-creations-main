import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as CreditCard, C as QrCode, F as Lock, Q as DollarSign, _ as ShoppingBag, at as ChevronRight, h as Smartphone, n as X, nt as CircleCheck, p as Sparkles, pt as ArrowRight, s as Truck, u as Tag, v as ShieldCheck, w as Printer } from "../_libs/lucide-react.mjs";
import { a as I18nProvider, i as Header, n as CartProvider, o as useCart, r as Footer, s as useI18n, t as CartDrawer } from "./cart-drawer-D9uioa6i.mjs";
import { t as backendDB } from "./backend-api-DaSHvViK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-9CLrglj3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CheckoutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckoutContent, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {})
		]
	}) }) });
}
function CheckoutContent() {
	const { items, subtotalUsd, clearCart } = useCart();
	const { currency, formatPrice } = useI18n();
	const [step, setStep] = (0, import_react.useState)("shipping");
	const [shippingForm, setShippingForm] = (0, import_react.useState)({
		firstName: "Priya",
		lastName: "Sharma",
		email: "priya.sharma@example.com",
		phone: "+1 (555) 234-5678",
		address: "450 Lexington Ave, Suite 1200",
		city: "New York",
		state: "NY",
		zip: "10017",
		country: "United States",
		shippingMethod: "standard"
	});
	const [promoCode, setPromoCode] = (0, import_react.useState)("");
	const [appliedDiscount, setAppliedDiscount] = (0, import_react.useState)(0);
	const [promoError, setPromoError] = (0, import_react.useState)("");
	const [promoSuccess, setPromoSuccess] = (0, import_react.useState)("");
	const [selectedGateway, setSelectedGateway] = (0, import_react.useState)("card");
	const [razorpaySubMethod, setRazorpaySubMethod] = (0, import_react.useState)("upi");
	const [upiId, setUpiId] = (0, import_react.useState)("priya@okaxis");
	const [stripeEmail, setStripeEmail] = (0, import_react.useState)("priya.sharma@example.com");
	const [cardNumber, setCardNumber] = (0, import_react.useState)("4532 1284 9012 5541");
	const [cardExpiry, setCardExpiry] = (0, import_react.useState)("08/28");
	const [cardCvv, setCardCvv] = (0, import_react.useState)("892");
	const [cardName, setCardName] = (0, import_react.useState)("Priya Sharma");
	const [gatewayModalOpen, setGatewayModalOpen] = (0, import_react.useState)(false);
	const [isProcessing, setIsProcessing] = (0, import_react.useState)(false);
	const [otpCode, setOtpCode] = (0, import_react.useState)("123456");
	const [completedOrder, setCompletedOrder] = (0, import_react.useState)(null);
	const apiKeysConfig = {
		razorpayKeyId: "rzp_test_MunCreations2026",
		stripePublishableKey: "pk_test_MunCreations2026",
		paypalClientId: "sb_MunCreations2026"
	};
	const isFreeShipping = subtotalUsd >= 500 || currency === "INR" && subtotalUsd * 83.5 >= 4e4;
	const shippingFeeUsd = isFreeShipping ? 0 : shippingForm.shippingMethod === "express" ? 45 : 25;
	const finalTotalUsd = Math.max(0, subtotalUsd - appliedDiscount + shippingFeeUsd);
	const getCardBrand = (num) => {
		const clean = num.replace(/\s/g, "");
		if (clean.startsWith("4")) return "VISA";
		if (/^5[1-5]/.test(clean)) return "MASTERCARD";
		if (/^3[47]/.test(clean)) return "AMEX";
		if (/^6[0-9]/.test(clean)) return "RUPAY";
		return "CARD";
	};
	const handleApplyPromo = (e) => {
		e.preventDefault();
		setPromoError("");
		setPromoSuccess("");
		const clean = promoCode.trim().toUpperCase();
		if (clean === "MUNHERITAGE10") {
			const discount = Math.round(subtotalUsd * .1);
			setAppliedDiscount(discount);
			setPromoSuccess("10% Heritage discount applied successfully!");
		} else if (clean === "ROYAL50") {
			setAppliedDiscount(50);
			setPromoSuccess("$50 Royal Voucher applied successfully!");
		} else setPromoError("Invalid promo code. Try 'MUNHERITAGE10' or 'ROYAL50'.");
	};
	const handleShippingSubmit = (e) => {
		e.preventDefault();
		setStep("payment");
		if (typeof window !== "undefined") window.scrollTo({
			top: 250,
			behavior: "smooth"
		});
	};
	const handleOpenGatewayModal = (e) => {
		e.preventDefault();
		if (selectedGateway === "razorpay" && typeof window !== "undefined") if (!document.querySelector("script[src=\"https://checkout.razorpay.com/v1/checkout.js\"]")) {
			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.async = true;
			script.onload = () => triggerRazorpaySDK();
			script.onerror = () => setGatewayModalOpen(true);
			document.body.appendChild(script);
			return;
		} else {
			triggerRazorpaySDK();
			return;
		}
		setGatewayModalOpen(true);
	};
	const triggerRazorpaySDK = () => {
		if (typeof window !== "undefined" && window.Razorpay) try {
			new window.Razorpay({
				key: apiKeysConfig.razorpayKeyId,
				amount: Math.round(finalTotalUsd * 83.5 * 100),
				currency: "INR",
				name: "Mun Creations",
				description: "Luxury Handloom Saree Order",
				image: "https://picsum.photos/seed/munlogo/200/200",
				prefill: {
					name: `${shippingForm.firstName} ${shippingForm.lastName}`,
					email: shippingForm.email,
					contact: shippingForm.phone
				},
				theme: { color: "#58111A" },
				handler: function() {
					handleConfirmGatewayPayment();
				},
				modal: { ondismiss: function() {
					setGatewayModalOpen(true);
				} }
			}).open();
			return;
		} catch {
			setGatewayModalOpen(true);
		}
		else setGatewayModalOpen(true);
	};
	const handleConfirmGatewayPayment = () => {
		setIsProcessing(true);
		setTimeout(() => {
			const newOrder = backendDB.createOrder({
				customerName: `${shippingForm.firstName} ${shippingForm.lastName}`,
				email: shippingForm.email,
				phone: shippingForm.phone,
				shippingAddress: `${shippingForm.address}, ${shippingForm.city}, ${shippingForm.state} ${shippingForm.zip}, ${shippingForm.country}`,
				items: items.map((i) => ({
					productId: i.product.id,
					productName: i.product.name,
					quantity: i.qty,
					priceUsd: i.product.priceUsd
				})),
				subtotalUsd: finalTotalUsd
			});
			setCompletedOrder(newOrder);
			clearCart();
			setIsProcessing(false);
			setGatewayModalOpen(false);
			setStep("success");
			if (typeof window !== "undefined") window.scrollTo({
				top: 150,
				behavior: "smooth"
			});
		}, 1500);
	};
	if (items.length === 0 && step !== "success") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-boutique max-w-md mx-auto py-16 text-center space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-16 w-16 rounded-full bg-[var(--wine)]/10 text-[var(--wine)] flex items-center justify-center mx-auto border border-[var(--wine)]/20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-8 w-8" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl font-bold text-[var(--wine-deep)]",
				children: "Your Cart is Empty"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Explore our handcrafted sarees, kurtis, and bridal collections to start your checkout."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "inline-flex items-center gap-2 bg-[var(--wine)] text-white px-6 py-3 text-xs uppercase tracking-wider font-bold rounded-sm hover:bg-[var(--wine-deep)] transition-colors shadow-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Explore Saree Collections" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
			})
		]
	});
	if (step === "success" && completedOrder) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-boutique max-w-2xl mx-auto space-y-6 animate-in fade-in",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-sm border border-border shadow-2xl overflow-hidden p-8 space-y-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-16 w-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-10 w-10" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "eyebrow text-emerald-700 font-bold",
							children: "Payment Verified & Order Confirmed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-serif text-3xl md:text-4xl font-bold text-[var(--wine-deep)]",
							children: "Thank You For Your Order!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground max-w-md mx-auto",
							children: [
								"Your handwoven ensemble is being prepared by our master weaver artisans. A confirmation email has been sent to",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: completedOrder.email
								}),
								"."
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 bg-secondary/30 rounded-sm border border-border text-left space-y-4 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Order Reference"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono font-bold text-base text-[var(--wine-deep)]",
								children: completedOrder.id
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase tracking-wider text-muted-foreground",
									children: "Payment Gateway"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Authorized (",
										selectedGateway.toUpperCase(),
										")"
									] })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-foreground",
								children: "Purchased Items"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border/60",
								children: completedOrder.items.map((it, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "py-2 flex justify-between items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-serif font-bold text-xs",
										children: it.productName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-muted-foreground",
										children: ["Qty: ", it.quantity]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold",
										children: formatPrice(it.priceUsd * it.quantity)
									})]
								}, idx))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-3 border-t border-border flex justify-between items-center font-bold text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Paid" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[var(--wine-deep)] font-serif text-lg",
								children: formatPrice(completedOrder.subtotalUsd)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 text-[11px] text-muted-foreground space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Shipping Address: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground font-medium",
								children: completedOrder.shippingAddress
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Delivery Timeline: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground font-medium",
								children: "3–5 Business Days (Insured Handloom Air Dispatch)"
							})] })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-center gap-3 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => window.print(),
						className: "inline-flex items-center gap-2 bg-secondary text-foreground text-xs uppercase tracking-wider px-5 py-3 rounded-sm font-bold border border-border hover:bg-border transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Print Order Receipt" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "inline-flex items-center gap-2 bg-[var(--wine)] text-white text-xs uppercase tracking-wider px-6 py-3 rounded-sm font-bold hover:bg-[var(--wine-deep)] transition-colors shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Return to Storefront" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-boutique space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white p-4 rounded-sm border border-border shadow-xs flex items-center justify-between text-xs font-semibold uppercase tracking-wider",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setStep("shipping"),
						className: `flex items-center gap-2 ${step === "shipping" ? "text-[var(--wine)] font-bold" : "text-muted-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-6 w-6 rounded-full bg-[var(--wine)] text-white text-[11px] flex items-center justify-center font-mono",
							children: "1"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shipping Address" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							setStep("payment");
							if (typeof window !== "undefined") window.scrollTo({
								top: 250,
								behavior: "smooth"
							});
						},
						className: `flex items-center gap-2 ${step === "payment" ? "text-[var(--wine)] font-bold" : "text-muted-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-6 w-6 rounded-full bg-[var(--wine)] text-white text-[11px] flex items-center justify-center font-mono",
							children: "2"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Payment Gateway" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-6 w-6 rounded-full bg-secondary text-muted-foreground text-[11px] flex items-center justify-center font-mono",
							children: "3"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Confirmation" })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-7 space-y-6",
					children: [step === "shipping" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white p-6 md:p-8 rounded-sm border border-border shadow-md space-y-6 animate-in fade-in",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl font-bold text-[var(--wine-deep)]",
							children: "Contact & Shipping Details"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Enter your international delivery information"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleShippingSubmit,
							className: "space-y-4 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold block mb-1",
										children: "First Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										required: true,
										value: shippingForm.firstName,
										onChange: (e) => setShippingForm({
											...shippingForm,
											firstName: e.target.value
										}),
										className: "w-full p-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold block mb-1",
										children: "Last Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										required: true,
										value: shippingForm.lastName,
										onChange: (e) => setShippingForm({
											...shippingForm,
											lastName: e.target.value
										}),
										className: "w-full p-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold block mb-1",
										children: "Email Address"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "email",
										required: true,
										value: shippingForm.email,
										onChange: (e) => setShippingForm({
											...shippingForm,
											email: e.target.value
										}),
										className: "w-full p-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold block mb-1",
										children: "Phone Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "tel",
										required: true,
										value: shippingForm.phone,
										onChange: (e) => setShippingForm({
											...shippingForm,
											phone: e.target.value
										}),
										className: "w-full p-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold block mb-1",
									children: "Street Address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									value: shippingForm.address,
									onChange: (e) => setShippingForm({
										...shippingForm,
										address: e.target.value
									}),
									className: "w-full p-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-bold block mb-1",
											children: "City"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											required: true,
											value: shippingForm.city,
											onChange: (e) => setShippingForm({
												...shippingForm,
												city: e.target.value
											}),
											className: "w-full p-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-bold block mb-1",
											children: "State / Province"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											required: true,
											value: shippingForm.state,
											onChange: (e) => setShippingForm({
												...shippingForm,
												state: e.target.value
											}),
											className: "w-full p-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-bold block mb-1",
											children: "ZIP / Postal Code"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											required: true,
											value: shippingForm.zip,
											onChange: (e) => setShippingForm({
												...shippingForm,
												zip: e.target.value
											}),
											className: "w-full p-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold block mb-1",
									children: "Country"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: shippingForm.country,
									onChange: (e) => setShippingForm({
										...shippingForm,
										country: e.target.value
									}),
									className: "w-full p-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)] font-medium",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "United States",
											children: "United States"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "United Kingdom",
											children: "United Kingdom"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "India",
											children: "India"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Canada",
											children: "Canada"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Australia",
											children: "Australia"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "United Arab Emirates",
											children: "United Arab Emirates"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Singapore",
											children: "Singapore"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-3 border-t border-border space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold block text-xs",
										children: "Select Delivery Speed"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											onClick: () => setShippingForm({
												...shippingForm,
												shippingMethod: "standard"
											}),
											className: `p-3 rounded-sm border cursor-pointer flex flex-col justify-between transition-colors ${shippingForm.shippingMethod === "standard" ? "border-[var(--wine)] bg-[var(--wine)]/5 font-bold" : "border-border bg-secondary/20"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-[var(--wine)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Standard Handloom Air" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[10px] text-muted-foreground mt-1",
												children: [isFreeShipping ? "FREE (Complimentary)" : formatPrice(25), " · 5-7 days"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											onClick: () => setShippingForm({
												...shippingForm,
												shippingMethod: "express"
											}),
											className: `p-3 rounded-sm border cursor-pointer flex flex-col justify-between transition-colors ${shippingForm.shippingMethod === "express" ? "border-[var(--wine)] bg-[var(--wine)]/5 font-bold" : "border-border bg-secondary/20"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-[var(--gold)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Priority Express Courier" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[10px] text-muted-foreground mt-1",
												children: [formatPrice(45), " · 2-3 days insured"]
											})]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									className: "w-full mt-4 bg-[var(--wine)] text-white py-3.5 text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-[var(--wine-deep)] transition-all shadow-md flex items-center justify-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Proceed to Select Payment Gateway" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
								})
							]
						})]
					}), step === "payment" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white p-6 md:p-8 rounded-sm border border-border shadow-md space-y-6 animate-in fade-in",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-serif text-2xl font-bold text-[var(--wine-deep)]",
									children: "Choose Payment Gateway"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Select your preferred payment processor below"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setStep("shipping"),
									className: "text-xs font-semibold text-[var(--wine)] hover:underline",
									children: "Edit Address"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setSelectedGateway("razorpay"),
										className: `p-3 rounded-sm border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${selectedGateway === "razorpay" ? "border-[var(--wine)] bg-[var(--wine)]/10 font-bold shadow-xs text-[var(--wine-deep)]" : "border-border bg-secondary/20 hover:bg-secondary/50 text-foreground"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-5 w-5 text-blue-600" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold",
												children: "1. Razorpay"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] uppercase tracking-wider text-muted-foreground font-mono",
												children: "UPI / NetBank"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setSelectedGateway("stripe"),
										className: `p-3 rounded-sm border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${selectedGateway === "stripe" ? "border-[var(--wine)] bg-[var(--wine)]/10 font-bold shadow-xs text-[var(--wine-deep)]" : "border-border bg-secondary/20 hover:bg-secondary/50 text-foreground"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-5 w-5 text-indigo-600" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold",
												children: "2. Stripe"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] uppercase tracking-wider text-muted-foreground font-mono",
												children: "Global Cards"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setSelectedGateway("paypal"),
										className: `p-3 rounded-sm border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${selectedGateway === "paypal" ? "border-[var(--wine)] bg-[var(--wine)]/10 font-bold shadow-xs text-[var(--wine-deep)]" : "border-border bg-secondary/20 hover:bg-secondary/50 text-foreground"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-5 w-5 text-amber-600" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold",
												children: "3. PayPal"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] uppercase tracking-wider text-muted-foreground font-mono",
												children: "Pay in 4"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setSelectedGateway("card"),
										className: `p-3 rounded-sm border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${selectedGateway === "card" ? "border-[var(--wine)] bg-[var(--wine)]/10 font-bold shadow-xs text-[var(--wine-deep)]" : "border-border bg-secondary/20 hover:bg-secondary/50 text-foreground"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-emerald-600" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold",
												children: "4. Credit / Debit"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] uppercase tracking-wider text-muted-foreground font-mono",
												children: "Direct Terminal"
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleOpenGatewayModal,
								className: "space-y-4 pt-2",
								children: [
									selectedGateway === "razorpay" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-5 rounded-sm border border-blue-200 bg-blue-50/40 space-y-4 text-xs animate-in fade-in",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "font-bold text-blue-900 flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-4 w-4 text-blue-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Razorpay Payment Gateway" })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-bold",
													children: ["Key: ", apiKeysConfig.razorpayKeyId]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex border-b border-blue-200 text-xs font-semibold gap-3 pb-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setRazorpaySubMethod("upi"),
														className: `pb-1 ${razorpaySubMethod === "upi" ? "border-b-2 border-blue-700 text-blue-900 font-bold" : "text-muted-foreground"}`,
														children: "UPI (GPay / PhonePe / Paytm)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setRazorpaySubMethod("qr"),
														className: `pb-1 ${razorpaySubMethod === "qr" ? "border-b-2 border-blue-700 text-blue-900 font-bold" : "text-muted-foreground"}`,
														children: "Razorpay Instant QR"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setRazorpaySubMethod("netbanking"),
														className: `pb-1 ${razorpaySubMethod === "netbanking" ? "border-b-2 border-blue-700 text-blue-900 font-bold" : "text-muted-foreground"}`,
														children: "NetBanking"
													})
												]
											}),
											razorpaySubMethod === "upi" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "font-bold block text-foreground",
													children: "VPA / UPI ID"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													required: true,
													value: upiId,
													onChange: (e) => setUpiId(e.target.value),
													placeholder: "e.g. username@okaxis",
													className: "w-full p-2.5 bg-white border border-border rounded-sm focus:outline-none focus:border-blue-600 font-mono text-xs"
												})]
											}),
											razorpaySubMethod === "qr" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-center py-3 space-y-2 bg-white rounded border border-blue-200 p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-20 w-20 mx-auto text-blue-900" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-bold text-xs",
													children: "Scan with Google Pay, PhonePe, or Paytm"
												})]
											}),
											razorpaySubMethod === "netbanking" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "font-bold block text-foreground",
													children: "Select NetBanking Partner"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "w-full p-2.5 bg-white border border-border rounded-sm text-xs",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "HDFC Bank" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "ICICI Bank" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "State Bank of India (SBI)" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Axis Bank" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Kotak Mahindra Bank" })
													]
												})]
											})
										]
									}),
									selectedGateway === "stripe" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-5 rounded-sm border border-indigo-200 bg-indigo-50/30 space-y-4 text-xs animate-in fade-in",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-bold text-indigo-900 flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4 text-indigo-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Stripe Global Gateway" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-mono font-bold",
												children: ["Key: ", apiKeysConfig.stripePublishableKey]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3 bg-white rounded border border-indigo-200 space-y-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "font-bold block mb-1",
												children: "Receipt Email"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "email",
												required: true,
												value: stripeEmail,
												onChange: (e) => setStripeEmail(e.target.value),
												className: "w-full p-2 bg-secondary/20 border border-border rounded-sm"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 bg-secondary/30 rounded border border-border font-mono text-[11px] flex justify-between items-center text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•••• •••• •••• 4242 (Stripe Elements Test Mode)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-indigo-700 font-bold",
													children: "Ready"
												})]
											})]
										})]
									}),
									selectedGateway === "paypal" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-5 rounded-sm border border-amber-200 bg-amber-50/40 space-y-4 text-xs animate-in fade-in",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-bold text-amber-900 flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-4 w-4 text-amber-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PayPal Express Gateway" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold",
												children: ["Client ID: ", apiKeysConfig.paypalClientId]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-4 bg-white rounded border border-amber-200 text-center space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-serif font-bold text-lg text-amber-900",
												children: "PayPal Express Checkout"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] text-muted-foreground",
												children: [
													"Pay in 4 interest-free installments of ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: formatPrice(finalTotalUsd / 4)
													}),
													"."
												]
											})]
										})]
									}),
									selectedGateway === "card" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-5 rounded-sm border border-emerald-200 bg-emerald-50/30 space-y-4 text-xs animate-in fade-in",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-bold text-emerald-900 flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-emerald-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Direct Card Terminal" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-mono font-bold text-[10px]",
												children: [getCardBrand(cardNumber), " DETECTED"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "font-bold block mb-1",
													children: "Cardholder Name"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													required: true,
													value: cardName,
													onChange: (e) => setCardName(e.target.value),
													className: "w-full p-2.5 bg-white border border-border rounded-sm focus:outline-none focus:border-emerald-600"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "font-bold block mb-1",
													children: "Card Number"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													required: true,
													value: cardNumber,
													onChange: (e) => setCardNumber(e.target.value),
													placeholder: "4532 1284 9012 5541",
													className: "w-full p-2.5 bg-white border border-border rounded-sm focus:outline-none focus:border-emerald-600 font-mono text-sm"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid grid-cols-2 gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "font-bold block mb-1",
														children: "Expiry Date (MM/YY)"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														required: true,
														value: cardExpiry,
														onChange: (e) => setCardExpiry(e.target.value),
														placeholder: "MM/YY",
														className: "w-full p-2.5 bg-white border border-border rounded-sm focus:outline-none focus:border-emerald-600 font-mono text-xs"
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "font-bold block mb-1",
														children: "CVV / Security Code"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "password",
														required: true,
														maxLength: 4,
														value: cardCvv,
														onChange: (e) => setCardCvv(e.target.value),
														placeholder: "123",
														className: "w-full p-2.5 bg-white border border-border rounded-sm focus:outline-none focus:border-emerald-600 font-mono text-xs"
													})] })]
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "submit",
										className: "w-full mt-4 bg-[var(--gold)] text-[var(--wine-deep)] py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-white transition-all shadow-xl flex items-center justify-center gap-2 border border-[var(--wine-deep)]/20",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-[var(--wine-deep)]" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"Launch ",
												selectedGateway.toUpperCase(),
												" Gateway (",
												formatPrice(finalTotalUsd),
												")"
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
										]
									})
								]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-5 space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white p-6 rounded-sm border border-border shadow-md space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-serif text-xl font-bold text-[var(--wine-deep)] border-b border-border pb-3",
								children: [
									"Order Summary (",
									items.length,
									" Items)"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "max-h-64 overflow-y-auto space-y-3 pr-1",
								children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-3 text-xs border-b border-border/50 pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: i.product.image,
										alt: i.product.name,
										className: "h-16 w-14 object-cover rounded-xs shrink-0 border border-border"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-serif font-bold text-xs truncate",
												children: i.product.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[10px] text-muted-foreground",
												children: [
													i.product.fabric,
													" · Qty: ",
													i.qty
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-bold text-[var(--wine-deep)] mt-1",
												children: formatPrice(i.product.priceUsd * i.qty)
											})
										]
									})]
								}, i.product.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleApplyPromo,
								className: "space-y-2 pt-2 border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "font-bold block text-xs flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-3.5 w-3.5 text-[var(--gold)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Promo Code or Gift Voucher" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											placeholder: "e.g. MUNHERITAGE10 or ROYAL50",
											value: promoCode,
											onChange: (e) => setPromoCode(e.target.value),
											className: "flex-1 p-2 text-xs border border-border rounded-sm focus:outline-none focus:border-[var(--wine)] uppercase font-mono"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "submit",
											className: "px-4 py-2 bg-secondary text-foreground text-xs font-bold rounded-sm border border-border hover:bg-border transition-colors",
											children: "Apply"
										})]
									}),
									promoSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-emerald-700 font-semibold",
										children: promoSuccess
									}),
									promoError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-red-600 font-semibold",
										children: promoError
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 text-xs pt-3 border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: formatPrice(subtotalUsd)
										})]
									}),
									appliedDiscount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-emerald-700 font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Promo Discount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["-", formatPrice(appliedDiscount)] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Insured Handloom Air Dispatch" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: shippingFeeUsd === 0 ? "FREE" : formatPrice(shippingFeeUsd)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Import Duties & Taxes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-emerald-700",
											children: "Included ($0)"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center text-base font-bold pt-3 border-t border-border text-[var(--wine-deep)]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Amount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-serif text-xl",
											children: formatPrice(finalTotalUsd)
										})]
									}),
									currency !== "USD" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground text-right mt-1",
										children: [
											"Settlement base: $",
											finalTotalUsd.toFixed(2),
											" USD"
										]
									})
								]
							})
						]
					})
				})]
			}),
			gatewayModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-sm max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in relative border border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setGatewayModalOpen(false),
							className: "absolute top-4 right-4 text-muted-foreground hover:text-black",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						}),
						selectedGateway === "razorpay" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-blue-900 text-white p-4 rounded-sm flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 font-bold text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-5 w-5 text-blue-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "RAZORPAY SECURE PAY" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-mono text-xs font-bold",
										children: ["₹", Math.round(finalTotalUsd * 83.5).toLocaleString()]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 bg-secondary/30 rounded border border-border text-left space-y-2 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-bold text-foreground",
											children: "Order: Mun Creations Luxury Handloom"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-muted-foreground",
											children: ["VPA Handle: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
												className: "font-mono text-blue-700",
												children: upiId
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-muted-foreground",
											children: [
												"Customer: ",
												shippingForm.firstName,
												" ",
												shippingForm.lastName
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleConfirmGatewayPayment,
									disabled: isProcessing,
									className: "w-full bg-blue-700 text-white py-3.5 text-xs font-bold uppercase tracking-wider rounded shadow-md hover:bg-blue-800 transition-colors flex items-center justify-center gap-2",
									children: isProcessing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verifying Razorpay Authorization..." })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Authorize Razorpay UPI / Payment" })
								})
							]
						}),
						selectedGateway === "stripe" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-indigo-900 text-white p-4 rounded-sm flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 font-bold text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-5 w-5 text-indigo-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "STRIPE SECURE CHECKOUT" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-serif font-bold text-sm",
										children: formatPrice(finalTotalUsd)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 bg-secondary/30 rounded border border-border text-left space-y-2 text-xs font-mono",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Status: 256-Bit TLS Stripe Key Ready" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Account: ", stripeEmail] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleConfirmGatewayPayment,
									disabled: isProcessing,
									className: "w-full bg-indigo-700 text-white py-3.5 text-xs font-bold uppercase tracking-wider rounded shadow-md hover:bg-indigo-800 transition-colors flex items-center justify-center gap-2",
									children: isProcessing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Confirming Stripe Charge..." })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pay with Stripe" })
								})
							]
						}),
						selectedGateway === "paypal" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-amber-500 text-white p-4 rounded-sm flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 font-bold text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-5 w-5 text-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PAYPAL EXPRESS" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-serif font-bold text-sm",
										children: formatPrice(finalTotalUsd)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 bg-secondary/30 rounded border border-border text-left space-y-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["PayPal Account: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: shippingForm.email })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										"Selected Option: Pay in Full (",
										formatPrice(finalTotalUsd),
										")"
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleConfirmGatewayPayment,
									disabled: isProcessing,
									className: "w-full bg-amber-600 text-white py-3.5 text-xs font-bold uppercase tracking-wider rounded shadow-md hover:bg-amber-700 transition-colors flex items-center justify-center gap-2",
									children: isProcessing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Connecting PayPal Express..." })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Confirm & Pay with PayPal" })
								})
							]
						}),
						selectedGateway === "card" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-[var(--wine-deep)] text-white p-4 rounded-sm flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 font-bold text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-[var(--gold)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "BANK 3D-SECURE VERIFICATION" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-mono font-bold text-[var(--gold)]",
										children: getCardBrand(cardNumber)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 bg-secondary/30 rounded border border-border text-left space-y-3 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-muted-foreground",
										children: [
											"An SMS One-Time Password (OTP) has been sent to your registered mobile number linked to card ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
												className: "text-foreground",
												children: ["•••• ", cardNumber.slice(-4)]
											}),
											"."
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold block mb-1",
										children: "Enter 6-Digit SMS OTP Code"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										maxLength: 6,
										value: otpCode,
										onChange: (e) => setOtpCode(e.target.value),
										className: "w-full p-2.5 bg-white border border-border rounded-sm text-center font-mono font-bold tracking-[0.3em] text-lg focus:outline-none focus:border-[var(--wine)]"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleConfirmGatewayPayment,
									disabled: isProcessing,
									className: "w-full bg-[var(--wine)] text-white py-3.5 text-xs font-bold uppercase tracking-wider rounded shadow-md hover:bg-[var(--wine-deep)] transition-colors flex items-center justify-center gap-2",
									children: isProcessing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Authorizing Bank Transaction..." })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Authorize Payment (",
										formatPrice(finalTotalUsd),
										")"
									] })
								})
							]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { CheckoutPage as component };
