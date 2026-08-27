import { o as __toESM } from "../_runtime.mjs";
import { c as HOMEPAGE_COLLECTIONS, d as PRICE_TIERS, f as TUSSAR_MERCHANDISING_BLOCK, i as COLOR_FILTERS, n as CATEGORY_FILTERS, o as FABRIC_FILTERS, s as FEATURED_SHOP_BY_CATEGORIES } from "./catalog-iLO1lIu8.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { G as Gem, J as Eye, K as Funnel, O as MousePointer2, T as Plane, _ as ShoppingBag, b as Search, dt as Award, ft as ArrowRight, g as SlidersHorizontal, m as Sparkle, n as X, nt as CircleCheckBig, ot as ChevronDown, p as Sparkles, st as Check, v as ShieldCheck, x as RotateCcw } from "../_libs/lucide-react.mjs";
import { a as I18nProvider, i as Header, n as CartProvider, o as useCart, r as Footer, s as useI18n, t as CartDrawer } from "./cart-drawer-D9uioa6i.mjs";
import { a as cat_bridal_default, c as hero_saree_default, i as PRODUCTS, l as product_teal_default, n as BRIDAL, o as cat_cotton_default, r as NEW_ARRIVALS, s as cat_silk_default, t as BESTSELLERS } from "./products-BQLhYZdU.mjs";
import { a as SectionHeading, i as ProductDetailModal, n as ProductCard, o as story_weaver_default, r as ProductCarousel, t as AITryOnModal } from "./product-Bglph-xe.mjs";
import { t as gsapWithCSS } from "../_libs/gsap.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-pink-Xj8K9fFl.js
var product_pink_default = "/assets/product-pink-CSPlHlcH.jpg";
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DJR5jEuu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Hero() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative w-full overflow-hidden bg-[var(--wine-deep)] min-h-[85vh] sm:min-h-[90vh] lg:min-h-screen flex flex-col justify-end items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 w-full h-full overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				autoPlay: true,
				muted: true,
				loop: true,
				playsInline: true,
				poster: hero_saree_default,
				src: "/hero-video.mp4",
				className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover object-center"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-[var(--wine-deep)] via-[var(--wine-deep)]/50 to-black/35" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 container-boutique pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-10 sm:pb-14 md:pb-20 text-[var(--ivory)] flex flex-col items-center text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-3xl mx-auto space-y-4 sm:space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] drop-shadow-[0_4px_14px_rgba(0,0,0,0.8)] text-white",
						children: t("hero.title")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs sm:text-base md:text-lg text-[var(--ivory)]/90 max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] font-light px-2 sm:px-0",
						children: t("hero.sub")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-2 w-full max-w-md sm:max-w-none mx-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#collection-section",
							className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--gold)] text-[var(--wine-deep)] px-6 sm:px-8 py-3.5 sm:py-4 text-[11px] tracking-[0.22em] uppercase font-bold hover:bg-[var(--ivory)] transition-all shadow-xl hover:scale-105 active:scale-95",
							children: t("hero.cta")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#bridal",
							className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[var(--ivory)]/80 text-[var(--ivory)] px-6 sm:px-8 py-3.5 sm:py-4 text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-[var(--ivory)]/20 backdrop-blur-md transition-all shadow-xl hover:scale-105 active:scale-95",
							children: t("hero.cta2")
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 sm:mt-12 md:mt-16 flex flex-wrap justify-center items-center gap-x-4 sm:gap-x-8 gap-y-2 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-[var(--ivory)]/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Authentic Handloom" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-[var(--gold)]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ships Worldwide" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-[var(--gold)]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loved by 10,000+ Women" })
				]
			})]
		})]
	});
}
var DEFAULT_ITEMS = [
	{
		image: "https://picsum.photos/seed/depth1/800/1000",
		alt: "Slide 1"
	},
	{
		image: "https://picsum.photos/seed/depth2/800/1000",
		alt: "Slide 2"
	},
	{
		image: "https://picsum.photos/seed/depth3/800/1000",
		alt: "Slide 3"
	},
	{
		image: "https://picsum.photos/seed/depth4/800/1000",
		alt: "Slide 4"
	},
	{
		image: "https://picsum.photos/seed/depth5/800/1000",
		alt: "Slide 5"
	},
	{
		image: "https://picsum.photos/seed/depth6/800/1000",
		alt: "Slide 6"
	}
];
var clamp = (v, min, max) => Math.min(Math.max(v, min), max);
var normalizeItem = (it) => typeof it === "string" ? {
	image: it,
	alt: ""
} : {
	...it,
	image: it.image,
	alt: it.alt || ""
};
var DepthCarousel = ({ items = DEFAULT_ITEMS, cardWidth = 320, cardHeight = 420, radius = 18, tint = "#05060a", depth = 220, spread = 88, tilt = 22, tiltDirection = "right", perspective = 1400, visibleCards = 4, falloff = .2, blur = 6, duration = 700, ease = "power3.out", autoplay = true, autoplayDelay = 3500, loop = true, showControls = true, showIndicators = true, renderCardOverlay, onChange, className = "" }) => {
	const data = (0, import_react.useMemo)(() => (Array.isArray(items) ? items : []).map(normalizeItem), [items]);
	const count = data.length;
	const rootRef = (0, import_react.useRef)(null);
	const stageRef = (0, import_react.useRef)(null);
	const cardRefs = (0, import_react.useRef)([]);
	const overlayRefs = (0, import_react.useRef)([]);
	const posRef = (0, import_react.useRef)(0);
	const focusRef = (0, import_react.useRef)(0);
	const tweenRef = (0, import_react.useRef)(null);
	const scaleRef = (0, import_react.useRef)(1);
	const cfgRef = (0, import_react.useRef)({});
	const onChangeRef = (0, import_react.useRef)(onChange);
	const dragRef = (0, import_react.useRef)(null);
	const wheelTimerRef = (0, import_react.useRef)(null);
	const autoTimerRef = (0, import_react.useRef)(null);
	const reducedRef = (0, import_react.useRef)(false);
	const [active, setActive] = (0, import_react.useState)(0);
	onChangeRef.current = onChange;
	cfgRef.current = {
		count,
		depth,
		spread,
		tilt,
		tiltDirection,
		visibleCards,
		falloff,
		blur,
		duration,
		ease,
		loop,
		cardWidth,
		autoplayDelay
	};
	const layout = (0, import_react.useCallback)((pos) => {
		const cfg = cfgRef.current;
		const n = cfg.count;
		if (!n) return;
		const dir = cfg.tiltDirection === "left" ? -1 : 1;
		const sc = scaleRef.current;
		for (let i = 0; i < n; i++) {
			const el = cardRefs.current[i];
			if (!el) continue;
			let d = i - pos;
			if (cfg.loop && n > 1) {
				d = (d % n + n) % n;
				if (d > n / 2) d -= n;
			}
			const back = Math.max(0, d);
			const shown = Math.abs(d) <= cfg.visibleCards + .5;
			const tz = -cfg.depth * d;
			const tx = dir * cfg.spread * d;
			const ry = dir * cfg.tilt * clamp(d, 0, 1);
			let opacity = d < 0 ? Math.max(0, 1 + d) : 1;
			if (!shown) opacity = 0;
			const brightness = Math.max(.15, 1 - back * cfg.falloff);
			const blurPx = cfg.blur > 0 ? Math.min(cfg.blur, back / Math.max(1, cfg.visibleCards) * cfg.blur) : 0;
			const zi = Math.round(2e3 - d * 20);
			el.style.transform = `translate(-50%, -50%) scale(${sc}) translateX(${tx.toFixed(2)}px) translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg)`;
			el.style.opacity = opacity.toFixed(3);
			el.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blurPx.toFixed(2)}px)`;
			el.style.zIndex = String(zi);
			el.style.pointerEvents = shown && opacity > .05 ? "auto" : "none";
			const ov = overlayRefs.current[i];
			if (ov) ov.style.opacity = clamp(back * cfg.falloff * 1.25, 0, .86).toFixed(3);
		}
	}, []);
	const notify = (0, import_react.useCallback)((idx) => {
		setActive(idx);
		onChangeRef.current?.(idx, data[idx]);
	}, [data]);
	const tweenTo = (0, import_react.useCallback)((target, animate) => {
		tweenRef.current?.kill();
		const cfg = cfgRef.current;
		const proxy = { p: posRef.current };
		const dur = animate && !reducedRef.current ? cfg.duration / 1e3 : 0;
		tweenRef.current = gsapWithCSS.to(proxy, {
			p: target,
			duration: dur,
			ease: cfg.ease,
			onUpdate: () => {
				posRef.current = proxy.p;
				layout(proxy.p);
			},
			onComplete: () => {
				const n = cfg.count;
				if (n > 0) posRef.current = (posRef.current % n + n) % n;
				layout(posRef.current);
			}
		});
	}, [layout]);
	const setFocus = (0, import_react.useCallback)((rawIndex, animate = true) => {
		const cfg = cfgRef.current;
		const n = cfg.count;
		if (!n) return;
		const idx = cfg.loop ? (rawIndex % n + n) % n : clamp(rawIndex, 0, n - 1);
		let delta = idx - posRef.current;
		if (cfg.loop && n > 1) {
			delta = (delta % n + n) % n;
			if (delta > n / 2) delta -= n;
		}
		tweenTo(posRef.current + delta, animate);
		if (idx !== focusRef.current) {
			focusRef.current = idx;
			notify(idx);
		}
	}, [tweenTo, notify]);
	const navigateBy = (0, import_react.useCallback)((step) => setFocus(focusRef.current + step, true), [setFocus]);
	(0, import_react.useEffect)(() => {
		const root = rootRef.current;
		if (!root) return;
		const ro = new ResizeObserver((entries) => {
			const w = entries[0].contentRect.width;
			const cfg = cfgRef.current;
			const needed = cfg.cardWidth + Math.abs(cfg.spread) * 2 + 120;
			scaleRef.current = clamp(w / needed, .4, 1);
			layout(posRef.current);
		});
		ro.observe(root);
		return () => ro.disconnect();
	}, [layout]);
	(0, import_react.useEffect)(() => {
		const el = rootRef.current;
		if (!el) return;
		const onWheel = (e) => {
			const cfg = cfgRef.current;
			if (cfg.count < 2) return;
			e.preventDefault();
			tweenRef.current?.kill();
			const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
			const step = clamp((e.deltaMode === 1 ? raw * 24 : raw) / (cfg.cardWidth * .9), -.6, .6);
			posRef.current += step;
			layout(posRef.current);
			if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
			wheelTimerRef.current = setTimeout(() => setFocus(Math.round(posRef.current), true), 130);
		};
		el.addEventListener("wheel", onWheel, { passive: false });
		return () => {
			el.removeEventListener("wheel", onWheel);
			if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
		};
	}, [layout, setFocus]);
	const onPointerDown = (0, import_react.useCallback)((e) => {
		if (cfgRef.current.count < 2) return;
		tweenRef.current?.kill();
		dragRef.current = {
			x: e.clientX,
			startPos: posRef.current,
			lastX: e.clientX,
			lastT: performance.now(),
			v: 0,
			moved: false,
			id: e.pointerId
		};
	}, []);
	const onPointerMove = (0, import_react.useCallback)((e) => {
		const drag = dragRef.current;
		if (!drag) return;
		const cfg = cfgRef.current;
		const stepPx = Math.max(cfg.cardWidth * .55 * scaleRef.current, 40);
		const dx = e.clientX - drag.x;
		if (!drag.moved && Math.abs(dx) > 4) {
			drag.moved = true;
			rootRef.current?.setPointerCapture(drag.id);
		}
		if (!drag.moved) return;
		const now = performance.now();
		const dt = Math.max(now - drag.lastT, 1);
		drag.v = (e.clientX - drag.lastX) / dt;
		drag.lastX = e.clientX;
		drag.lastT = now;
		posRef.current = drag.startPos - dx / stepPx;
		layout(posRef.current);
	}, [layout]);
	const onPointerEnd = (0, import_react.useCallback)(() => {
		const drag = dragRef.current;
		if (!drag) return;
		dragRef.current = null;
		if (!drag.moved) return;
		const cfg = cfgRef.current;
		const stepPx = Math.max(cfg.cardWidth * .55 * scaleRef.current, 40);
		const projected = posRef.current - drag.v * 180 / stepPx;
		setFocus(Math.round(projected), true);
	}, [setFocus]);
	const onKeyDown = (0, import_react.useCallback)((e) => {
		if (e.key === "ArrowLeft") {
			e.preventDefault();
			navigateBy(-1);
		} else if (e.key === "ArrowRight") {
			e.preventDefault();
			navigateBy(1);
		}
	}, [navigateBy]);
	const onCardClick = (0, import_react.useCallback)((index) => {
		if (dragRef.current?.moved) return;
		setFocus(index, true);
	}, [setFocus]);
	(0, import_react.useEffect)(() => {
		reducedRef.current = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (!autoplay || reducedRef.current || count < 2) return;
		const root = rootRef.current;
		let hovered = false;
		let focused = false;
		const stop = () => {
			if (autoTimerRef.current) clearInterval(autoTimerRef.current);
			autoTimerRef.current = null;
		};
		const start = () => {
			stop();
			autoTimerRef.current = window.setInterval(() => {
				if (!hovered && !focused) navigateBy(1);
			}, Math.max(cfgRef.current.autoplayDelay, 600));
		};
		const onEnter = () => {
			hovered = true;
		};
		const onLeave = () => {
			hovered = false;
		};
		const onFocusIn = () => {
			focused = true;
		};
		const onFocusOut = () => {
			focused = false;
		};
		root?.addEventListener("mouseenter", onEnter);
		root?.addEventListener("mouseleave", onLeave);
		root?.addEventListener("focusin", onFocusIn);
		root?.addEventListener("focusout", onFocusOut);
		start();
		return () => {
			stop();
			root?.removeEventListener("mouseenter", onEnter);
			root?.removeEventListener("mouseleave", onLeave);
			root?.removeEventListener("focusin", onFocusIn);
			root?.removeEventListener("focusout", onFocusOut);
		};
	}, [
		autoplay,
		autoplayDelay,
		count,
		navigateBy
	]);
	(0, import_react.useEffect)(() => {
		layout(posRef.current);
	}, [
		layout,
		depth,
		spread,
		tilt,
		tiltDirection,
		visibleCards,
		falloff,
		blur,
		cardWidth,
		cardHeight,
		radius,
		count
	]);
	(0, import_react.useEffect)(() => () => {
		tweenRef.current?.kill();
		if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
		if (autoTimerRef.current) clearInterval(autoTimerRef.current);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: rootRef,
		className: `depth-carousel ${className}`.trim(),
		style: { "--dc-perspective": `${perspective}px` },
		role: "group",
		"aria-roledescription": "carousel",
		"aria-label": "Depth carousel",
		tabIndex: 0,
		onPointerDown,
		onPointerMove,
		onPointerUp: onPointerEnd,
		onPointerCancel: onPointerEnd,
		onKeyDown,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "depth-carousel__stage",
				ref: stageRef,
				children: data.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `depth-carousel__card ${active === i ? "is-active" : ""}`,
					ref: (el) => {
						cardRefs.current[i] = el;
					},
					style: {
						width: cardWidth,
						height: cardHeight,
						borderRadius: radius
					},
					"aria-roledescription": "slide",
					"aria-label": `${i + 1} of ${count}`,
					"aria-hidden": active !== i,
					onClick: () => onCardClick(i),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							className: "depth-carousel__img",
							src: item.image,
							alt: item.alt || "",
							draggable: false
						}),
						renderCardOverlay?.(item, i, active === i),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "depth-carousel__tint",
							ref: (el) => {
								overlayRefs.current[i] = el;
							},
							style: { background: tint }
						})
					]
				}, i))
			}),
			showControls && count > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "depth-carousel__arrow depth-carousel__arrow--prev",
				"aria-label": "Previous slide",
				onClick: () => navigateBy(-1),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 24 24",
					width: "20",
					height: "20",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M15 5l-7 7 7 7",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "depth-carousel__arrow depth-carousel__arrow--next",
				"aria-label": "Next slide",
				onClick: () => navigateBy(1),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 24 24",
					width: "20",
					height: "20",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M9 5l7 7-7 7",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					})
				})
			})] }),
			showIndicators && count > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "depth-carousel__dots",
				role: "tablist",
				"aria-label": "Slides",
				children: data.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					role: "tab",
					"aria-selected": active === i,
					"aria-label": `Go to slide ${i + 1}`,
					className: `depth-carousel__dot${active === i ? " is-active" : ""}`,
					onClick: () => setFocus(i, true)
				}, i))
			})
		]
	});
};
var CATEGORY_TABS = [
	{
		id: "all",
		label: "All Signature Weaves"
	},
	{
		id: "banarasi",
		label: "Banarasi Heritage"
	},
	{
		id: "kanjivaram",
		label: "Pure Kanjivaram"
	},
	{
		id: "tussar",
		label: "Award Tussar"
	},
	{
		id: "bridal",
		label: "Bridal & Occasion"
	}
];
var ProductShowcase = ({ products = PRODUCTS, title = "Curated Couture Showcase", subtitle = "Experience the tactile elegance, rich zari, and fine textures of our master-woven sarees in interactive 3D depth.", eyebrow = "Interactive 3D Experience", defaultCategory = "all", className = "" }) => {
	const { formatPrice } = useI18n();
	const { add } = useCart();
	const [activeTab, setActiveTab] = (0, import_react.useState)(defaultCategory);
	const [modalProduct, setModalProduct] = (0, import_react.useState)(null);
	const [tryOnProduct, setTryOnProduct] = (0, import_react.useState)(null);
	const [addedToast, setAddedToast] = (0, import_react.useState)(false);
	const filteredProducts = (0, import_react.useMemo)(() => {
		if (activeTab === "all") return products;
		if (activeTab === "banarasi") return products.filter((p) => p.category.toLowerCase().includes("banarasi") || p.group?.toLowerCase().includes("banarasi"));
		if (activeTab === "kanjivaram") return products.filter((p) => p.category.toLowerCase().includes("kanjeevaram") || p.category.toLowerCase().includes("kanjivaram") || p.group?.toLowerCase().includes("kanjivaram"));
		if (activeTab === "tussar") return products.filter((p) => p.category.toLowerCase().includes("tussar") || p.group?.toLowerCase().includes("tussar"));
		if (activeTab === "bridal") return products.filter((p) => p.occasion?.includes("Wedding") || p.occasion?.includes("Bridal") || p.subcategory?.toLowerCase().includes("bridal") || p.badge === "bestseller");
		return products;
	}, [products, activeTab]);
	const activeProducts = filteredProducts.length > 0 ? filteredProducts : products;
	const [activeIndex, setActiveIndex] = (0, import_react.useState)(0);
	const [displayedProduct, setDisplayedProduct] = (0, import_react.useState)(activeProducts[0] || products[0]);
	const carouselItems = (0, import_react.useMemo)(() => {
		return activeProducts.map((p) => ({
			image: p.image,
			alt: p.name,
			product: p,
			id: p.id,
			name: p.name,
			category: p.category,
			priceUsd: p.priceUsd,
			badge: p.badge
		}));
	}, [activeProducts]);
	(0, import_react.useEffect)(() => {
		setActiveIndex(0);
		if (activeProducts[0]) setDisplayedProduct(activeProducts[0]);
	}, [activeProducts]);
	const infoContentRef = (0, import_react.useRef)(null);
	const gsapTimelineRef = (0, import_react.useRef)(null);
	const handleSlideChange = (0, import_react.useCallback)((index, item) => {
		const nextProduct = item?.product || activeProducts[index] || products[index];
		if (!nextProduct) return;
		setActiveIndex(index);
		const el = infoContentRef.current;
		if (!el) {
			setDisplayedProduct(nextProduct);
			return;
		}
		if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setDisplayedProduct(nextProduct);
			return;
		}
		gsapTimelineRef.current?.kill();
		const tl = gsapWithCSS.timeline();
		gsapTimelineRef.current = tl;
		tl.to(el, {
			opacity: .15,
			y: -8,
			duration: .16,
			ease: "power2.in",
			onComplete: () => {
				setDisplayedProduct(nextProduct);
			}
		}).to(el, {
			opacity: 1,
			y: 0,
			duration: .32,
			ease: "power3.out"
		});
	}, [activeProducts, products]);
	(0, import_react.useEffect)(() => {
		return () => {
			gsapTimelineRef.current?.kill();
		};
	}, []);
	const handleAddToCart = () => {
		if (displayedProduct) {
			add(displayedProduct);
			setAddedToast(true);
			setTimeout(() => setAddedToast(false), 2400);
		}
	};
	const discountPercent = displayedProduct.compareAtUsd && displayedProduct.compareAtUsd > displayedProduct.priceUsd ? Math.round((displayedProduct.compareAtUsd - displayedProduct.priceUsd) / displayedProduct.compareAtUsd * 100) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `product-showcase ${className}`.trim(),
		"aria-label": "Product Showcase Section",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "product-showcase__bg-glow",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "product-showcase__bg-pattern",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-boutique relative z-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center mb-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
							eyebrow,
							title,
							sub: subtitle
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "product-showcase__filters",
						role: "tablist",
						"aria-label": "Showcase categories",
						children: CATEGORY_TABS.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							role: "tab",
							"aria-selected": activeTab === tab.id,
							className: `product-showcase__filter-btn ${activeTab === tab.id ? "is-active" : ""}`,
							onClick: () => setActiveTab(tab.id),
							children: tab.label
						}, tab.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "product-showcase__grid",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "product-showcase__info-card",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								ref: infoContentRef,
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "product-showcase__meta-row",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "product-showcase__category-badge",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: displayedProduct.category }),
												displayedProduct.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "opacity-90 font-bold",
													children: ["· ", displayedProduct.badge.toUpperCase()]
												})
											]
										}), displayedProduct.sku && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "product-showcase__sku-tag",
											children: ["SKU: ", displayedProduct.sku]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "product-showcase__title font-serif",
										children: displayedProduct.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "product-showcase__attributes",
										children: [
											displayedProduct.fabric && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "product-showcase__attr-pill",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Fabric: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: displayedProduct.fabric })] })]
											}),
											displayedProduct.weave && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "product-showcase__attr-pill",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Weave: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: displayedProduct.weave })] })]
											}),
											displayedProduct.originRegion && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "product-showcase__attr-pill",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Region: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: displayedProduct.originRegion.split(",")[0] })] })
											}),
											displayedProduct.stockQuantity !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "product-showcase__attr-pill",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3.5 w-3.5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "In Stock" })]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "product-showcase__desc",
										children: displayedProduct.shortDescription || displayedProduct.fullDescription?.slice(0, 140) + "..." || "Handcrafted with genuine pure silk yarns and authentic zari handwork by master artisans."
									}),
									displayedProduct.swatches && displayedProduct.swatches.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "product-showcase__swatches-row",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "product-showcase__swatch-label",
											children: "Color Harmony:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-1.5",
											children: displayedProduct.swatches.map((colorHex, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "product-showcase__swatch",
												style: { backgroundColor: colorHex },
												title: colorHex
											}, idx))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "product-showcase__price-box",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "product-showcase__price-current",
												children: formatPrice(displayedProduct.priceUsd)
											}),
											displayedProduct.compareAtUsd && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "product-showcase__price-original",
												children: formatPrice(displayedProduct.compareAtUsd)
											}),
											discountPercent !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "product-showcase__discount-badge",
												children: [
													"Save ",
													discountPercent,
													"%"
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "product-showcase__actions",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setTryOnProduct(displayedProduct),
												className: "product-showcase__btn-primary bg-gradient-to-r from-[#d4af37] via-[#ffe5a3] to-[#d4af37] text-[#1a0812] shadow-[0_0_15px_rgba(212,175,55,0.4)]",
												"aria-label": `AI Virtual Try-On for ${displayedProduct.name}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✦ AI Try-On" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setModalProduct(displayedProduct),
												className: "product-showcase__btn-secondary",
												"aria-label": `View full details of ${displayedProduct.name}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Quick View & Specs" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: handleAddToCart,
												className: "product-showcase__btn-secondary",
												"aria-label": `Add ${displayedProduct.name} to shopping bag`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: addedToast ? "Added to Bag ✓" : "Add to Bag" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/checkout",
												onClick: () => add(displayedProduct),
												className: "product-showcase__btn-secondary text-[var(--gold)] border-[var(--gold)]/40 hover:bg-[var(--gold)]/20",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Buy Now" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "product-showcase__counter-bar",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "product-showcase__counter-text",
											children: [
												"Item ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(activeIndex + 1).padStart(2, "0") }),
												" /",
												" ",
												String(activeProducts.length).padStart(2, "0")
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "product-showcase__drag-hint",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MousePointer2, { className: "h-3.5 w-3.5 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Drag, swipe, or wheel to rotate" })]
										})]
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "product-showcase__carousel-pane",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepthCarousel, {
								items: carouselItems,
								cardWidth: 320,
								cardHeight: 420,
								radius: 18,
								depth: 220,
								spread: 88,
								tilt: 22,
								tiltDirection: "right",
								perspective: 1400,
								visibleCards: 4,
								falloff: .2,
								blur: 6,
								duration: 700,
								ease: "power3.out",
								autoplay: true,
								autoplayDelay: 3500,
								loop: true,
								showControls: true,
								showIndicators: true,
								onChange: handleSlideChange,
								renderCardOverlay: (item, idx, isActive) => {
									const prod = item?.product;
									if (!prod) return null;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [prod.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "product-showcase__card-badge",
										children: prod.badge === "bestseller" ? "★ Bestseller" : "✦ New"
									}), isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "product-showcase__card-price-tag",
										children: formatPrice(prod.priceUsd)
									})] });
								}
							})
						})]
					})
				]
			}),
			modalProduct && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductDetailModal, {
				product: modalProduct,
				onClose: () => setModalProduct(null)
			}),
			tryOnProduct && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AITryOnModal, {
				product: tryOnProduct,
				isOpen: !!tryOnProduct,
				onClose: () => setTryOnProduct(null)
			})
		]
	});
};
function TrustStrip() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-y border-border bg-[var(--secondary)]/60",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-boutique grid grid-cols-2 md:grid-cols-4 gap-y-6 sm:gap-y-8 py-8 sm:py-10 md:py-12",
			children: [
				{
					icon: Sparkles,
					label: t("trust.handcrafted")
				},
				{
					icon: RotateCcw,
					label: t("trust.returns")
				},
				{
					icon: Plane,
					label: t("trust.shipping")
				},
				{
					icon: Award,
					label: t("trust.authentic")
				}
			].map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center text-center gap-2 px-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(it.icon, {
					className: "h-5 w-5 sm:h-6 sm:w-6 text-[var(--wine)]",
					strokeWidth: 1.2
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.22em] uppercase text-foreground/80 font-medium",
					children: it.label
				})]
			}, it.label))
		})
	});
}
function ShopByFeaturedBlock({ onSelectFilter }) {
	const handleClick = (name) => {
		if (onSelectFilter) onSelectFilter(name, "featured");
		else {
			const el = document.getElementById("collection-section");
			if (el) el.scrollIntoView({ behavior: "smooth" });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-12 sm:py-16 md:py-20 bg-[var(--secondary)]/40 border-y border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-boutique",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Merchandising Edit",
				title: "Featured Shop By Categories",
				sub: "Explore our signature Banarasi, Kanjivaram, Zardosi & Chikankari edits"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4",
				children: FEATURED_SHOP_BY_CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => handleClick(cat.name),
					className: "group flex flex-col items-center p-4 sm:p-5 rounded-sm bg-white border border-border/70 shadow-xs hover:border-[var(--gold)] hover:shadow-md transition-all text-center cursor-pointer",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[var(--wine)]/10 text-[var(--wine)] flex items-center justify-center mb-2.5 sm:mb-3 group-hover:bg-[var(--wine)] group-hover:text-[var(--gold)] transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkle, { className: "h-4 w-4 sm:h-5 sm:w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs sm:text-sm font-serif font-bold text-[var(--wine-deep)] group-hover:text-[var(--wine)] leading-snug",
							children: cat.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground mt-1 group-hover:text-[var(--gold)]",
							children: "Shop Collection →"
						})
					]
				}, cat.slug))
			})]
		})
	});
}
function TussarShowcaseBlock({ onSelectFilter }) {
	const [selectedProduct, setSelectedProduct] = (0, import_react.useState)(null);
	const { add } = useCart();
	const awardWinningSaree = PRODUCTS.find((p) => p.id === "p5") || PRODUCTS[0];
	const allPhotos = awardWinningSaree.images || ["/assets/tussar-tribal-fusion-DUe7adSy.jpg"];
	const [activeSpotlightImg, setActiveSpotlightImg] = (0, import_react.useState)(allPhotos[0]);
	const handleClick = (name) => {
		if (onSelectFilter) onSelectFilter(name, "tussar");
		else {
			const el = document.getElementById("collection-section");
			if (el) el.scrollIntoView({ behavior: "smooth" });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "py-12 sm:py-16 md:py-20 bg-[var(--wine-deep)] text-[var(--ivory)] relative overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-boutique",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[var(--gold)] font-bold mb-2 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gem, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "National & International Award Winning Saree" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl sm:text-3xl md:text-5xl text-white",
							children: "Tussar Heritage Collections"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm text-white/70 mt-2 max-w-xl",
							children: "Authentic high quality super purified Triple twisted international standard TUSSAR sarees handcrafted by master weavers."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => handleClick("Tussar"),
						className: "text-xs uppercase tracking-widest text-[var(--gold)] hover:text-white border-b border-[var(--gold)] pb-1 font-semibold self-start md:self-auto cursor-pointer",
						children: "Browse All Tussar Sarees →"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-10 sm:mb-12 bg-white/5 border border-[var(--gold)]/30 rounded-lg overflow-hidden backdrop-blur-md grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 p-4 sm:p-6 lg:p-8 items-center shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-5 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative group overflow-hidden rounded-md aspect-[3/4] max-h-[380px] sm:max-h-[440px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: activeSpotlightImg,
									alt: "Tribal Fusion Handloom Award Winning Tussar Saree",
									className: "w-full h-full object-cover object-top rounded-md transition-transform duration-700 group-hover:scale-105"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute top-2.5 left-2.5 bg-[var(--gold)] text-[var(--wine-deep)] px-2.5 py-1 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase rounded shadow-md",
									children: "Award Winning Saree"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute bottom-2.5 left-2.5 right-2.5 bg-black/60 backdrop-blur-xs p-2 sm:p-2.5 rounded text-xs text-white flex justify-between items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reddish-Maroon & Blue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-[var(--gold)] font-mono",
										children: "6 Real Photos"
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2 overflow-x-auto pb-1 no-scrollbar",
							children: allPhotos.map((imgSrc, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveSpotlightImg(imgSrc),
								className: `h-12 w-10 sm:h-14 sm:w-12 rounded border overflow-hidden shrink-0 transition-all cursor-pointer ${activeSpotlightImg === imgSrc ? "border-[var(--gold)] ring-2 ring-[var(--gold)]/50 scale-105" : "border-white/20 opacity-70 hover:opacity-100"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: imgSrc,
									alt: `View ${idx + 1}`,
									className: "w-full h-full object-cover"
								})
							}, idx))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-7 flex flex-col justify-between space-y-4 sm:space-y-5 text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-1.5 bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-[var(--gold)] px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold mb-2 sm:mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "National & International Award Winning Saree" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-xl sm:text-2xl md:text-3xl text-white font-bold leading-snug",
									children: "Tribal Fusion Handloom Tussar Saree"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[var(--gold)] font-mono text-xl sm:text-2xl font-bold mt-1.5",
									children: "$350.00"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-black/25 p-3.5 sm:p-4 rounded border border-white/10 text-xs sm:text-sm text-white/90 leading-relaxed font-light space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-[var(--gold)] uppercase tracking-wider text-[10px] sm:text-[11px]",
										children: "Craftsmanship & Description:"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "TRIBAL FUSION HANDLOOM (DOLABEDI+KOTPAD+DONGARIA+DHALAPATHAR+SIMINOI+GANJAM-BOMKAI/BERHAMPURI+HABASPURI) high quality super purified Tripple twisted international standard purified+smooth TUSSUR saree with compulsory Contrast colour blouse having a special TRIBAL FUSION HANDLOOM KING-SIZE DOUBLE pallu" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 border-t border-white/10 text-xs text-white/70 flex flex-wrap gap-x-4 gap-y-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Color:" }), " Reddish-Maroon & Blue"] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Fabric:" }), " Triple Twisted Smooth Tussar Silk"] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Pallu:" }), " King-Size Double Pallu"] })
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row gap-3 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => add(awardWinningSaree),
									className: "w-full sm:flex-1 bg-[var(--gold)] text-[var(--wine-deep)] py-3 sm:py-3.5 px-6 rounded text-xs font-bold uppercase tracking-widest hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2 min-h-[44px] cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }), "Add to Cart — $350.00"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setSelectedProduct(awardWinningSaree),
									className: "w-full sm:w-auto py-3 sm:py-3.5 px-6 rounded text-xs font-semibold uppercase tracking-widest border border-white/30 text-white hover:bg-white/10 transition-all min-h-[44px] cursor-pointer",
									children: "Quick View Details"
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4",
					children: TUSSAR_MERCHANDISING_BLOCK.map((tussar) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => handleClick(tussar.name),
						className: "group p-3.5 sm:p-4 rounded-sm bg-white/5 hover:bg-[var(--gold)]/20 border border-white/10 hover:border-[var(--gold)]/50 transition-all text-left flex flex-col justify-between min-h-[90px] sm:min-h-[110px] cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-serif font-bold text-white group-hover:text-[var(--gold)]",
							children: tussar.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] sm:text-[10px] text-white/60 group-hover:text-white uppercase tracking-wider",
							children: "Explore Edit →"
						})]
					}, tussar.slug))
				})
			]
		}), selectedProduct && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductDetailModal, {
			product: selectedProduct,
			onClose: () => setSelectedProduct(null)
		})]
	});
}
function HomepageCollectionsBanner({ onSelectFilter }) {
	const handleClick = (name) => {
		if (onSelectFilter) onSelectFilter(name, "collection");
		else {
			const el = document.getElementById("collection-section");
			if (el) el.scrollIntoView({ behavior: "smooth" });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-12 sm:py-16 md:py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-boutique",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Merchandising Showcase",
				title: "Curated Collections",
				sub: "Find budget-friendly handlooms, luxury couture, and trending drapes"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
				children: HOMEPAGE_COLLECTIONS.map((c, i) => {
					const images = [
						hero_saree_default,
						cat_silk_default,
						cat_bridal_default,
						cat_cotton_default,
						product_teal_default,
						product_pink_default
					];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => handleClick(c.name),
						className: "group relative overflow-hidden aspect-[16/10] rounded-sm shadow-md text-left w-full cursor-pointer",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: images[i % images.length],
								alt: c.name,
								className: "h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-[var(--wine-deep)]/90 via-[var(--wine-deep)]/40 to-transparent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-x-0 bottom-0 p-4 sm:p-5 text-[var(--ivory)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] sm:text-[10px] tracking-widest uppercase text-[var(--gold)] font-bold",
									children: c.tag
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-xl sm:text-2xl text-white mt-0.5",
									children: c.name
								})]
							})
						]
					}, c.slug);
				})
			})]
		})
	});
}
function PressStrip() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-10 sm:py-14 md:py-16 border-y border-border bg-[var(--secondary)]/40 overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-boutique",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "eyebrow text-center mb-6 sm:mb-8",
				children: t("section.press")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-12 md:gap-x-16 gap-y-4",
				children: [
					"Vogue India",
					"ELLE",
					"Femina",
					"Harper's Bazaar",
					"Grazia",
					"Cosmopolitan"
				].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-serif italic text-base sm:text-xl md:text-2xl text-foreground/45 tracking-wide",
					children: p
				}, p))
			})]
		})
	});
}
function StoryBanner() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-14 sm:py-20 md:py-24 bg-[var(--secondary)]/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-boutique grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-[4/5] overflow-hidden rounded-sm shadow-xl bg-[var(--wine-deep)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					autoPlay: true,
					muted: true,
					loop: true,
					playsInline: true,
					poster: story_weaver_default,
					src: "/story-video.mp4",
					className: "h-full w-full object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 hidden sm:block bg-[var(--ivory)] px-6 sm:px-8 py-4 sm:py-6 shadow-xl z-10 border border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-serif text-3xl sm:text-4xl text-[var(--wine)]",
						children: "240+"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "eyebrow mt-1",
						children: "Weaving Families"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "eyebrow mb-3 sm:mb-4",
					children: t("section.story.eyebrow")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl sm:text-4xl md:text-5xl leading-[1.1] text-[var(--wine-deep)] mb-4 sm:mb-6",
					children: t("section.story.title")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm sm:text-base leading-relaxed text-foreground/75 mb-6 sm:mb-8 max-w-xl",
					children: t("section.story.body")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 border-y border-border py-4 sm:py-6 max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-serif text-xl sm:text-2xl text-[var(--wine)]",
							children: "1998"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-1",
							children: "Est."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-serif text-xl sm:text-2xl text-[var(--wine)]",
							children: "42"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-1",
							children: "Countries"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-serif text-xl sm:text-2xl text-[var(--wine)]",
							children: "10k+"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-1",
							children: "Women"
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/about",
					className: "inline-flex items-center justify-center gap-2 bg-[var(--wine)] text-[var(--ivory)] px-6 sm:px-8 py-3.5 text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-[var(--wine-deep)] transition-colors min-h-[44px]",
					children: t("section.story.cta")
				})
			] })]
		})
	});
}
function Newsletter() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "py-14 sm:py-20 md:py-24 bg-[var(--wine-deep)] text-[var(--ivory)] relative overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 opacity-[0.08] pointer-events-none",
			style: {
				backgroundImage: "radial-gradient(circle at 20% 20%, var(--gold) 1px, transparent 1px), radial-gradient(circle at 60% 70%, var(--gold) 1px, transparent 1px)",
				backgroundSize: "40px 40px, 60px 60px"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-boutique text-center relative",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] tracking-[0.32em] uppercase text-[var(--gold)] mb-3 sm:mb-4",
					children: "Newsletter"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl sm:text-4xl md:text-5xl mb-3 sm:mb-4",
					children: t("news.title")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs sm:text-sm md:text-base text-[var(--ivory)]/70 max-w-md mx-auto mb-6 sm:mb-8",
					children: t("news.sub")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => e.preventDefault(),
					className: "flex flex-col sm:flex-row max-w-lg mx-auto gap-3 px-2 sm:px-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "email",
						required: true,
						placeholder: t("news.placeholder"),
						className: "flex-1 bg-transparent border border-[var(--ivory)]/30 px-4 sm:px-5 py-3 sm:py-3.5 text-sm placeholder:text-[var(--ivory)]/50 focus:outline-none focus:border-[var(--gold)] rounded-xs"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "bg-[var(--gold)] text-[var(--wine-deep)] px-6 sm:px-7 py-3 sm:py-3.5 text-[11px] tracking-[0.22em] uppercase font-bold hover:bg-[var(--ivory)] transition-colors min-h-[44px] cursor-pointer",
						children: t("news.cta")
					})]
				})
			]
		})]
	});
}
function DepthCarouselShowcase() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductShowcase, {});
}
function CatalogFilterSidebar({ filters, onFilterChange, onResetFilters }) {
	const [categorySearch, setCategorySearch] = (0, import_react.useState)("");
	const [catExpanded, setCatExpanded] = (0, import_react.useState)(true);
	const [fabricExpanded, setFabricExpanded] = (0, import_react.useState)(true);
	const [colorExpanded, setColorExpanded] = (0, import_react.useState)(true);
	const [priceExpanded, setPriceExpanded] = (0, import_react.useState)(true);
	const filteredCategoryList = CATEGORY_FILTERS.filter((c) => c.toLowerCase().includes(categorySearch.toLowerCase()));
	const toggleCategory = (cat) => {
		const updated = filters.categories.includes(cat) ? filters.categories.filter((c) => c !== cat) : [...filters.categories, cat];
		onFilterChange({
			...filters,
			categories: updated
		});
	};
	const toggleFabric = (fab) => {
		const updated = filters.fabrics.includes(fab) ? filters.fabrics.filter((f) => f !== fab) : [...filters.fabrics, fab];
		onFilterChange({
			...filters,
			fabrics: updated
		});
	};
	const toggleColor = (colName) => {
		const updated = filters.colors.includes(colName) ? filters.colors.filter((c) => c !== colName) : [...filters.colors, colName];
		onFilterChange({
			...filters,
			colors: updated
		});
	};
	const handlePriceTierClick = (label, max) => {
		onFilterChange({
			...filters,
			priceTier: filters.priceTier === label ? null : label,
			maxPrice: max
		});
	};
	const totalActive = filters.categories.length + filters.fabrics.length + filters.colors.length + (filters.priceTier ? 1 : 0) + (filters.inStockOnly ? 1 : 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "w-full bg-white rounded-sm border border-border/80 p-5 shadow-sm space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between pb-4 border-b border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4 text-[var(--wine)]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-lg font-bold text-[var(--wine-deep)] tracking-wide",
							children: "Refine Catalog"
						}),
						totalActive > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-5 min-w-5 px-1.5 rounded-full bg-[var(--wine)] text-white text-[10px] font-bold flex items-center justify-center",
							children: totalActive
						})
					]
				}), totalActive > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onResetFilters,
					className: "text-[11px] uppercase tracking-wider text-[var(--wine)] hover:text-black flex items-center gap-1 font-semibold transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reset" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between py-2 border-b border-border/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-semibold text-foreground tracking-wide",
					children: "In Stock Only"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => onFilterChange({
						...filters,
						inStockOnly: !filters.inStockOnly
					}),
					className: `relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${filters.inStockOnly ? "bg-[var(--wine)]" : "bg-gray-200"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${filters.inStockOnly ? "translate-x-4" : "translate-x-0"}` })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border/60 pb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setCatExpanded(!catExpanded),
					className: "w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--wine-deep)] py-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Category (",
						CATEGORY_FILTERS.length,
						")"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 transition-transform ${catExpanded ? "rotate-180" : ""}` })]
				}), catExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: "Search categories...",
								value: categorySearch,
								onChange: (e) => setCategorySearch(e.target.value),
								className: "w-full pl-8 pr-3 py-1.5 text-xs bg-secondary/50 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" }),
							categorySearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCategorySearch(""),
								className: "absolute right-2 top-2 text-muted-foreground hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-48 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar text-xs",
						children: filteredCategoryList.map((cat) => {
							const checked = filters.categories.includes(cat);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 cursor-pointer py-1 px-1.5 rounded-sm hover:bg-secondary/60 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked,
									onChange: () => toggleCategory(cat),
									className: "rounded border-border text-[var(--wine)] focus:ring-[var(--wine)] h-3.5 w-3.5"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-xs ${checked ? "font-bold text-[var(--wine)]" : "text-foreground/80"}`,
									children: cat
								})]
							}, cat);
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border/60 pb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setFabricExpanded(!fabricExpanded),
					className: "w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--wine-deep)] py-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fabric" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 transition-transform ${fabricExpanded ? "rotate-180" : ""}` })]
				}), fabricExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-1.5",
					children: FABRIC_FILTERS.map((fab) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => toggleFabric(fab),
							className: `text-xs px-3 py-1 rounded-full border transition-all ${filters.fabrics.includes(fab) ? "bg-[var(--wine)] text-white border-[var(--wine)] font-semibold shadow-xs" : "bg-secondary/40 text-foreground/80 border-border hover:border-[var(--wine)]"}`,
							children: fab
						}, fab);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border/60 pb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setColorExpanded(!colorExpanded),
					className: "w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--wine-deep)] py-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Color Swatches" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 transition-transform ${colorExpanded ? "rotate-180" : ""}` })]
				}), colorExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-4 sm:grid-cols-5 gap-2",
					children: COLOR_FILTERS.map((c) => {
						const selected = filters.colors.includes(c.name);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => toggleColor(c.name),
							title: c.name,
							className: `group relative flex flex-col items-center gap-1 p-1.5 rounded-sm border transition-all ${selected ? "border-[var(--wine)] bg-[var(--wine)]/10" : "border-border hover:border-gray-400"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-5 w-5 rounded-full border border-black/20 shadow-xs flex items-center justify-center",
								style: { backgroundColor: c.hex },
								children: selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: `h-3 w-3 ${c.name === "White" || c.name === "Off White" ? "text-black" : "text-white"}` })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9px] font-medium text-foreground/80 group-hover:text-black truncate w-full text-center",
								children: c.name
							})]
						}, c.name);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setPriceExpanded(!priceExpanded),
				className: "w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--wine-deep)] py-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Price Range (Up to $",
					filters.maxPrice,
					")"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 transition-transform ${priceExpanded ? "rotate-180" : ""}` })]
			}), priceExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 50,
						max: 2e3,
						step: 25,
						value: filters.maxPrice,
						onChange: (e) => onFilterChange({
							...filters,
							maxPrice: Number(e.target.value),
							priceTier: null
						}),
						className: "w-full accent-[var(--wine)] cursor-pointer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-[11px] text-muted-foreground font-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "$50" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["$", filters.maxPrice] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "$2,000" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-1.5 pt-1",
						children: PRICE_TIERS.map((tier) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handlePriceTierClick(tier.label, tier.max),
								className: `text-[11px] py-1.5 px-2 rounded-sm border text-center font-medium transition-all ${filters.priceTier === tier.label ? "bg-[var(--gold)] text-[var(--wine-deep)] border-[var(--gold)] font-bold" : "bg-secondary/30 text-foreground/80 border-border hover:border-[var(--gold)]"}`,
								children: tier.label
							}, tier.label);
						})
					})
				]
			})] })
		]
	});
}
function useWavyReveal(delayMs = 0) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el || typeof IntersectionObserver === "undefined") return;
		const obs = new IntersectionObserver((entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					setTimeout(() => {
						e.target.classList.add("section-wavy-active");
					}, delayMs);
					obs.unobserve(e.target);
				}
			});
		}, {
			threshold: .1,
			rootMargin: "0px 0px -40px 0px"
		});
		obs.observe(el);
		return () => obs.disconnect();
	}, [delayMs]);
	return ref;
}
function WavySection({ children, className = "", delay = 0 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: useWavyReveal(delay),
		className: `section-wavy ${className}`,
		children
	});
}
var INITIAL_FILTER_STATE = {
	categories: [],
	fabrics: [],
	colors: [],
	maxPrice: 2e3,
	priceTier: null,
	inStockOnly: false
};
function Home() {
	const [filters, setFilters] = (0, import_react.useState)(INITIAL_FILTER_STATE);
	const [activeSelectionTitle, setActiveSelectionTitle] = (0, import_react.useState)("All Catalog Weaves");
	const [showMobileFilters, setShowMobileFilters] = (0, import_react.useState)(false);
	const handleNavFilterSelect = (label) => {
		setActiveSelectionTitle(label);
		const query = label.toLowerCase();
		if (query === "budget collections" || query === "budget collection") setFilters({
			...INITIAL_FILTER_STATE,
			maxPrice: 150,
			priceTier: "Budget Collection"
		});
		else if (query.includes("saree") || query.includes("banarasi") || query.includes("kanjivaram") || query.includes("tussar")) {
			const match = PRODUCTS.find((p) => p.category.toLowerCase().includes(query) || p.group?.toLowerCase().includes(query));
			if (match) setFilters({
				...INITIAL_FILTER_STATE,
				categories: [match.category]
			});
			else setActiveSelectionTitle(label);
		} else if (query === "kurti") setFilters({
			...INITIAL_FILTER_STATE,
			categories: ["Anarkali", "Co-Ord Set"]
		});
		else if (query === "blouses") setFilters({
			...INITIAL_FILTER_STATE,
			categories: ["Blouse"]
		});
		const el = document.getElementById("collection-section");
		if (el) el.scrollIntoView({ behavior: "smooth" });
	};
	const resetAllFilters = () => {
		setFilters(INITIAL_FILTER_STATE);
		setActiveSelectionTitle("All Catalog Weaves");
	};
	const filteredProducts = PRODUCTS.filter((p) => {
		if (filters.categories.length > 0) {
			if (!filters.categories.some((cat) => p.category.toLowerCase().includes(cat.toLowerCase()) || p.group?.toLowerCase().includes(cat.toLowerCase()) || p.subcategory?.toLowerCase().includes(cat.toLowerCase()))) return false;
		}
		if (filters.fabrics.length > 0) {
			if (!p.fabric || !filters.fabrics.includes(p.fabric)) return false;
		}
		if (filters.colors.length > 0) {
			if (!p.color || !filters.colors.includes(p.color)) return false;
		}
		if (p.priceUsd > filters.maxPrice) return false;
		if (filters.inStockOnly && !p.inStock) return false;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, { onSelectCategoryFilter: handleNavFilterSelect }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "space-y-4 md:space-y-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WavySection, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WavySection, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopByFeaturedBlock, { onSelectFilter: handleNavFilterSelect }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WavySection, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "collection-section",
						className: "py-16 md:py-24 bg-[var(--secondary)]/20 border-b border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container-boutique",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "eyebrow flex items-center gap-2 mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkle, { className: "h-3.5 w-3.5 text-[var(--wine)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Interactive Catalog Browser" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-serif text-3xl md:text-4xl text-[var(--wine-deep)] font-bold",
										children: activeSelectionTitle
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs md:text-sm text-muted-foreground mt-1",
										children: [
											"Showing ",
											filteredProducts.length,
											" handcrafted items matching your criteria"
										]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setShowMobileFilters(!showMobileFilters),
										className: "lg:hidden inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--wine-deep)] bg-white px-4 py-2 rounded-sm border border-border shadow-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Filter Options" })]
									}), (filters.categories.length > 0 || filters.fabrics.length > 0 || filters.colors.length > 0 || filters.priceTier || filters.inStockOnly) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: resetAllFilters,
										className: "inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-[var(--wine)] hover:bg-[var(--wine-deep)] px-4 py-2 rounded-sm transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Clear Filters" })]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `${showMobileFilters ? "block" : "hidden"} lg:block`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogFilterSidebar, {
										filters,
										onFilterChange: setFilters,
										onResetFilters: resetAllFilters
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: filteredProducts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6",
									children: filteredProducts.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product }, product.id))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center py-16 px-4 bg-white rounded-sm border border-border",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-serif text-xl text-[var(--wine-deep)]",
											children: "No exact matches found"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground mt-2 max-w-sm mx-auto",
											children: "Try broadening your category choices, removing fabric or color restrictions, or resetting filters."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: resetAllFilters,
											className: "mt-4 bg-[var(--wine)] text-white text-xs uppercase tracking-wider px-6 py-2.5 rounded-sm font-semibold hover:bg-[var(--wine-deep)] transition-colors",
											children: "Show All Products"
										})
									]
								}) })]
							})]
						})
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WavySection, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TussarShowcaseBlock, { onSelectFilter: handleNavFilterSelect }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WavySection, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomepageCollectionsBanner, { onSelectFilter: handleNavFilterSelect }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WavySection, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "new",
						className: "py-20 md:py-28",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container-boutique",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionSubHeading, { kind: "new" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCarousel, { products: NEW_ARRIVALS })]
						})
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WavySection, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustStrip, {}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WavySection, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-20 md:py-28 bg-[var(--secondary)]/40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container-boutique",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionSubHeading, { kind: "best" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCarousel, { products: BESTSELLERS })]
						})
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WavySection, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PressStrip, {}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WavySection, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepthCarouselShowcase, {}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WavySection, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryBanner, {}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WavySection, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "bridal",
						className: "py-20 md:py-28",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container-boutique",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionSubHeading, { kind: "wedding" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCarousel, { products: [...BRIDAL, ...BESTSELLERS.slice(0, 2)] })]
						})
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WavySection, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newsletter, {}) })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WavySection, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {})
		]
	}) }) });
}
function SectionSubHeading({ kind }) {
	const { t } = useI18n();
	const map = {
		new: {
			eyebrow: "Just In",
			title: t("section.new"),
			sub: t("section.new.sub")
		},
		best: {
			eyebrow: "Loved by Many",
			title: t("section.best"),
			sub: t("section.best.sub")
		},
		wedding: {
			eyebrow: "Occasion Wear",
			title: t("section.wedding"),
			sub: t("section.wedding.sub")
		}
	}[kind];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
		eyebrow: map.eyebrow,
		title: map.title,
		sub: map.sub
	});
}
//#endregion
export { Home as component };
