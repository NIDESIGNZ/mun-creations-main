import { o as __toESM } from "../_runtime.mjs";
import { a as EXPANDED_SAREE_TAXONOMY, l as KURTI_CATEGORIES, r as COLLECTION_HIERARCHY, t as BLOUSE_CATEGORIES, u as MAIN_NAV_ITEMS } from "./catalog-iLO1lIu8.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Menu, H as Heart, P as Lock, R as Key, W as Globe, _ as ShoppingBag, b as Search, ft as ArrowRight, i as User, it as ChevronRight, k as Minus, l as Trash2, n as X, ot as ChevronDown, p as Sparkles, q as Facebook, t as Youtube, v as ShieldCheck, w as Plus, z as Instagram } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-drawer-D9uioa6i.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SUPPORTED_CURRENCIES = {
	INR: {
		code: "INR",
		symbol: "₹",
		label: "Indian Rupee",
		country: "India",
		decimalPlaces: 0
	},
	USD: {
		code: "USD",
		symbol: "$",
		label: "US Dollar",
		country: "United States",
		decimalPlaces: 2
	},
	GBP: {
		code: "GBP",
		symbol: "£",
		label: "British Pound",
		country: "United Kingdom",
		decimalPlaces: 2
	},
	EUR: {
		code: "EUR",
		symbol: "€",
		label: "Euro",
		country: "European Union",
		decimalPlaces: 2
	},
	AED: {
		code: "AED",
		symbol: "د.إ",
		label: "UAE Dirham",
		country: "United Arab Emirates",
		decimalPlaces: 2
	},
	CAD: {
		code: "CAD",
		symbol: "C$",
		label: "Canadian Dollar",
		country: "Canada",
		decimalPlaces: 2
	},
	AUD: {
		code: "AUD",
		symbol: "A$",
		label: "Australian Dollar",
		country: "Australia",
		decimalPlaces: 2
	},
	NZD: {
		code: "NZD",
		symbol: "NZ$",
		label: "New Zealand Dollar",
		country: "New Zealand",
		decimalPlaces: 2
	},
	SGD: {
		code: "SGD",
		symbol: "S$",
		label: "Singapore Dollar",
		country: "Singapore",
		decimalPlaces: 2
	},
	CHF: {
		code: "CHF",
		symbol: "CHF",
		label: "Swiss Franc",
		country: "Switzerland",
		decimalPlaces: 2
	},
	JPY: {
		code: "JPY",
		symbol: "¥",
		label: "Japanese Yen",
		country: "Japan",
		decimalPlaces: 0
	},
	CNY: {
		code: "CNY",
		symbol: "¥",
		label: "Chinese Yuan",
		country: "China",
		decimalPlaces: 2
	},
	SAR: {
		code: "SAR",
		symbol: "﷼",
		label: "Saudi Riyal",
		country: "Saudi Arabia",
		decimalPlaces: 2
	},
	QAR: {
		code: "QAR",
		symbol: "﷼",
		label: "Qatari Riyal",
		country: "Qatar",
		decimalPlaces: 2
	},
	KWD: {
		code: "KWD",
		symbol: "KWD",
		label: "Kuwaiti Dinar",
		country: "Kuwait",
		decimalPlaces: 3
	},
	ZAR: {
		code: "ZAR",
		symbol: "R",
		label: "South African Rand",
		country: "South Africa",
		decimalPlaces: 2
	},
	BDT: {
		code: "BDT",
		symbol: "৳",
		label: "Bangladeshi Taka",
		country: "Bangladesh",
		decimalPlaces: 2
	},
	LKR: {
		code: "LKR",
		symbol: "Rs",
		label: "Sri Lankan Rupee",
		country: "Sri Lanka",
		decimalPlaces: 2
	}
};
var COUNTRY_TO_CURRENCY_MAP = {
	IN: "INR",
	India: "INR",
	US: "USD",
	"United States": "USD",
	USA: "USD",
	GB: "GBP",
	"United Kingdom": "GBP",
	UK: "GBP",
	GreatBritain: "GBP",
	AE: "AED",
	"United Arab Emirates": "AED",
	UAE: "AED",
	Dubai: "AED",
	CA: "CAD",
	Canada: "CAD",
	AU: "AUD",
	Australia: "AUD",
	NZ: "NZD",
	"New Zealand": "NZD",
	SG: "SGD",
	Singapore: "SGD",
	DE: "EUR",
	FR: "EUR",
	IT: "EUR",
	ES: "EUR",
	NL: "EUR",
	IE: "EUR",
	PT: "EUR",
	AT: "EUR",
	BE: "EUR",
	FI: "EUR",
	GR: "EUR",
	Germany: "EUR",
	France: "EUR",
	Italy: "EUR",
	Spain: "EUR",
	Netherlands: "EUR",
	Ireland: "EUR",
	Portugal: "EUR",
	CH: "CHF",
	Switzerland: "CHF",
	JP: "JPY",
	Japan: "JPY",
	CN: "CNY",
	China: "CNY",
	SA: "SAR",
	"Saudi Arabia": "SAR",
	KSA: "SAR",
	QA: "QAR",
	Qatar: "QAR",
	KW: "KWD",
	Kuwait: "KWD",
	ZA: "ZAR",
	"South Africa": "ZAR",
	BD: "BDT",
	Bangladesh: "BDT",
	LK: "LKR",
	"Sri Lanka": "LKR"
};
var DEFAULT_FALLBACK_RATES = {
	USD: 1,
	INR: 83.5,
	GBP: .79,
	EUR: .92,
	AED: 3.67,
	CAD: 1.37,
	AUD: 1.52,
	NZD: 1.67,
	SGD: 1.27,
	CHF: .88,
	JPY: 155,
	CNY: 7.23,
	SAR: 3.75,
	QAR: 3.64,
	KWD: .31,
	ZAR: 18.5,
	BDT: 117.5,
	LKR: 300
};
var CACHE_KEY = "mc_rates_cache_v2";
var CACHE_TTL_MS = 14400 * 1e3;
async function getExchangeRates() {
	if (typeof window !== "undefined" && window.localStorage) try {
		const cachedRaw = localStorage.getItem(CACHE_KEY);
		if (cachedRaw) {
			const cached = JSON.parse(cachedRaw);
			if (Date.now() - cached.timestamp < CACHE_TTL_MS && cached.rates && Object.keys(cached.rates).length > 0) return {
				...DEFAULT_FALLBACK_RATES,
				...cached.rates
			};
		}
	} catch {}
	const url = `https://v6.exchangerate-api.com/v6/82a22ebce01ba8607f47383b/latest/USD`;
	try {
		const res = await fetch(url, { signal: AbortSignal.timeout(5e3) });
		if (res.ok) {
			const data = await res.json();
			if (data.result === "success" && data.conversion_rates) {
				const mergedRates = {
					...DEFAULT_FALLBACK_RATES,
					...data.conversion_rates
				};
				if (typeof window !== "undefined" && window.localStorage) try {
					localStorage.setItem(CACHE_KEY, JSON.stringify({
						base: "USD",
						rates: mergedRates,
						timestamp: Date.now()
					}));
				} catch {}
				return mergedRates;
			}
		}
	} catch (err) {
		console.warn("Exchange rate fetch failed, using cached/fallback rates:", err);
	}
	if (typeof window !== "undefined" && window.localStorage) try {
		const cachedRaw = localStorage.getItem(CACHE_KEY);
		if (cachedRaw) {
			const cached = JSON.parse(cachedRaw);
			if (cached.rates) return {
				...DEFAULT_FALLBACK_RATES,
				...cached.rates
			};
		}
	} catch {}
	return DEFAULT_FALLBACK_RATES;
}
function detectUserCurrency() {
	if (typeof window !== "undefined" && window.localStorage) {
		const saved = localStorage.getItem("mc_cur");
		if (saved && saved in SUPPORTED_CURRENCIES) return saved;
	}
	if (typeof navigator !== "undefined" && navigator.language) {
		const parts = navigator.language.split("-");
		if (parts.length > 1) {
			const region = parts[1].toUpperCase();
			if (COUNTRY_TO_CURRENCY_MAP[region]) return COUNTRY_TO_CURRENCY_MAP[region];
		}
	}
	return "INR";
}
async function detectCountryFromIP() {
	try {
		const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3e3) });
		if (res.ok) {
			const data = await res.json();
			if (data.country_code && COUNTRY_TO_CURRENCY_MAP[data.country_code]) return COUNTRY_TO_CURRENCY_MAP[data.country_code];
		}
	} catch {}
	return null;
}
function convertPrice(baseAmountUsd, targetCurrency, rates) {
	const rawConverted = baseAmountUsd * (rates[targetCurrency] || DEFAULT_FALLBACK_RATES[targetCurrency] || 1);
	if ((SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.USD).decimalPlaces === 0) return Math.round(rawConverted);
	return Math.round(rawConverted * 100) / 100;
}
function formatCurrency(baseAmountUsd, targetCurrency, rates) {
	const info = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.INR;
	const converted = convertPrice(baseAmountUsd, targetCurrency, rates);
	try {
		return new Intl.NumberFormat(void 0, {
			style: "currency",
			currency: targetCurrency,
			minimumFractionDigits: info.decimalPlaces,
			maximumFractionDigits: info.decimalPlaces
		}).format(converted);
	} catch {
		const formattedNum = converted.toLocaleString(void 0, {
			minimumFractionDigits: info.decimalPlaces,
			maximumFractionDigits: info.decimalPlaces
		});
		return `${info.symbol} ${formattedNum}`;
	}
}
var CURRENCIES = SUPPORTED_CURRENCIES;
var LANGUAGES = {
	en: {
		label: "English",
		native: "English"
	},
	hi: {
		label: "Hindi",
		native: "हिन्दी"
	},
	fr: {
		label: "French",
		native: "Français"
	},
	es: {
		label: "Spanish",
		native: "Español"
	},
	ar: {
		label: "Arabic",
		native: "العربية"
	}
};
var TRANSLATIONS = {
	en: {
		"nav.new": "New Arrivals",
		"nav.sarees": "Sarees",
		"nav.predraped": "Pre-Draped",
		"nav.gowns": "Saree Gowns",
		"nav.blouses": "Blouses",
		"nav.dupattas": "Dupattas & Accessories",
		"nav.bridal": "Bridal Collection",
		"nav.sale": "Sale",
		"hero.eyebrow": "The Autumn Edit · 2026",
		"hero.title": "Timeless Sarees, Handwoven Heritage",
		"hero.sub": "Six yards of quiet luxury, woven by master artisans across India.",
		"hero.cta": "Shop the Collection",
		"hero.cta2": "Discover Bridal",
		"trust.handcrafted": "Handcrafted in India",
		"trust.returns": "15-Day Free Returns",
		"trust.shipping": "Worldwide Shipping",
		"trust.authentic": "Certified Authentic Weaves",
		"section.new": "New Arrivals",
		"section.new.sub": "Fresh drapes to fall in love with",
		"section.category": "Shop by Category",
		"section.category.sub": "A weave for every occasion",
		"section.best": "You'll Love These",
		"section.best.sub": "Our most-loved silhouettes this season",
		"section.press": "As Featured In",
		"section.story.eyebrow": "The Art of the Saree",
		"section.story.title": "Six yards. Six generations of craft.",
		"section.story.body": "Every Mun Creations saree begins on a wooden handloom in a village workshop — a slow, meditative dialogue between weaver and thread. We work directly with weaving families in Kanchipuram, Varanasi and Bengal to preserve techniques that have been passed down for centuries, and to bring their artistry to a modern woman anywhere in the world.",
		"section.story.cta": "Our Story",
		"section.wedding": "Wedding & Festive",
		"section.wedding.sub": "Heirlooms for the moments that matter",
		"section.acc": "The Finishing Touch",
		"section.acc.sub": "Blouses, dupattas & handcrafted jewels",
		"news.title": "Join the Mun Circle",
		"news.sub": "Enjoy 10% off your first order and first access to new drops.",
		"news.placeholder": "Your email address",
		"news.cta": "Subscribe",
		"cart.title": "Your Cart",
		"cart.empty": "Your cart is empty",
		"cart.subtotal": "Subtotal",
		"cart.checkout": "Checkout",
		"product.add": "Add to Cart",
		"product.new": "New",
		"product.bestseller": "Bestseller"
	},
	hi: {
		"nav.new": "नई पेशकश",
		"nav.sarees": "साड़ियाँ",
		"nav.predraped": "प्री-ड्रेप्ड",
		"nav.gowns": "साड़ी गाउन",
		"nav.blouses": "ब्लाउज़",
		"nav.dupattas": "दुपट्टे और आभूषण",
		"nav.bridal": "दुल्हन संग्रह",
		"nav.sale": "सेल",
		"hero.eyebrow": "शरद संस्करण · २०२६",
		"hero.title": "सदाबहार साड़ियाँ, हाथ से बुनी विरासत",
		"hero.sub": "छह गज़ की शांत विलासिता, भारत के कारीगरों द्वारा बुनी गई।",
		"hero.cta": "संग्रह देखें",
		"hero.cta2": "दुल्हन देखें",
		"trust.handcrafted": "भारत में हस्तनिर्मित",
		"trust.returns": "१५-दिन मुफ्त वापसी",
		"trust.shipping": "विश्वव्यापी शिपिंग",
		"trust.authentic": "प्रमाणित बुनाई",
		"section.new": "नई पेशकश",
		"section.new.sub": "प्यार करने लायक नए ड्रेप",
		"section.category": "श्रेणी से खरीदें",
		"section.category.sub": "हर अवसर के लिए एक बुनाई",
		"section.best": "आपको ये पसंद आएँगी",
		"section.best.sub": "इस मौसम की सबसे प्रिय",
		"section.press": "यहाँ प्रदर्शित",
		"section.story.eyebrow": "साड़ी की कला",
		"section.story.title": "छह गज़। छह पीढ़ियों की कला।",
		"section.story.body": "हर मुन क्रिएशन्स साड़ी एक ग्रामीण कार्यशाला में लकड़ी के हथकरघे पर शुरू होती है। हम कांचीपुरम, वाराणसी और बंगाल के बुनकर परिवारों के साथ सीधे काम करते हैं।",
		"section.story.cta": "हमारी कहानी",
		"section.wedding": "विवाह और उत्सव",
		"section.wedding.sub": "यादगार पलों के लिए विरासत",
		"section.acc": "अंतिम स्पर्श",
		"section.acc.sub": "ब्लाउज़, दुपट्टे और आभूषण",
		"news.title": "मुन सर्कल में शामिल हों",
		"news.sub": "पहले ऑर्डर पर १०% छूट पाएँ।",
		"news.placeholder": "आपका ईमेल",
		"news.cta": "सब्सक्राइब",
		"cart.title": "आपकी कार्ट",
		"cart.empty": "कार्ट खाली है",
		"cart.subtotal": "उप-योग",
		"cart.checkout": "चेकआउट",
		"product.add": "कार्ट में जोड़ें",
		"product.new": "नया",
		"product.bestseller": "बेस्टसेलर"
	},
	fr: {
		"nav.new": "Nouveautés",
		"nav.sarees": "Saris",
		"nav.predraped": "Pré-drapés",
		"nav.gowns": "Robes-Sari",
		"nav.blouses": "Corsages",
		"nav.dupattas": "Dupattas & Accessoires",
		"nav.bridal": "Collection Mariée",
		"nav.sale": "Soldes",
		"hero.eyebrow": "Édition Automne · 2026",
		"hero.title": "Saris intemporels, patrimoine tissé à la main",
		"hero.sub": "Six mètres de luxe discret, tissés par des artisans maîtres à travers l'Inde.",
		"hero.cta": "Voir la Collection",
		"hero.cta2": "Découvrir Mariée",
		"trust.handcrafted": "Fait main en Inde",
		"trust.returns": "Retours gratuits 15 jours",
		"trust.shipping": "Livraison mondiale",
		"trust.authentic": "Tissages authentiques certifiés",
		"section.new": "Nouveautés",
		"section.new.sub": "De nouveaux drapés à adorer",
		"section.category": "Par Catégorie",
		"section.category.sub": "Un tissage pour chaque occasion",
		"section.best": "Vous allez adorer",
		"section.best.sub": "Nos silhouettes les plus aimées",
		"section.press": "Vu dans",
		"section.story.eyebrow": "L'Art du Sari",
		"section.story.title": "Six mètres. Six générations d'artisanat.",
		"section.story.body": "Chaque sari Mun Creations commence sur un métier à tisser en bois dans un atelier de village.",
		"section.story.cta": "Notre Histoire",
		"section.wedding": "Mariage & Festif",
		"section.wedding.sub": "Des trésors pour les grands moments",
		"section.acc": "La Touche Finale",
		"section.acc.sub": "Corsages, dupattas & bijoux",
		"news.title": "Rejoignez le Cercle Mun",
		"news.sub": "Profitez de 10% sur votre première commande.",
		"news.placeholder": "Votre adresse e-mail",
		"news.cta": "S'inscrire",
		"cart.title": "Votre Panier",
		"cart.empty": "Votre panier est vide",
		"cart.subtotal": "Sous-total",
		"cart.checkout": "Commander",
		"product.add": "Ajouter",
		"product.new": "Nouveau",
		"product.bestseller": "Best-seller"
	},
	es: {
		"nav.new": "Novedades",
		"nav.sarees": "Saris",
		"nav.predraped": "Pre-drapeados",
		"nav.gowns": "Vestidos Sari",
		"nav.blouses": "Blusas",
		"nav.dupattas": "Dupattas y Accesorios",
		"nav.bridal": "Colección Novia",
		"nav.sale": "Rebajas",
		"hero.eyebrow": "Edición Otoño · 2026",
		"hero.title": "Saris eternos, herencia tejida a mano",
		"hero.sub": "Seis metros de lujo silencioso, tejidos por artesanos maestros en India.",
		"hero.cta": "Ver Colección",
		"hero.cta2": "Descubrir Novia",
		"trust.handcrafted": "Hecho a mano en India",
		"trust.returns": "Devoluciones gratis 15 días",
		"trust.shipping": "Envío mundial",
		"trust.authentic": "Tejidos auténticos certificados",
		"section.new": "Novedades",
		"section.new.sub": "Nuevos drapeados para enamorarse",
		"section.category": "Por Categoría",
		"section.category.sub": "Un tejido para cada ocasión",
		"section.best": "Te encantarán",
		"section.best.sub": "Nuestras siluetas más queridas",
		"section.press": "Aparecemos en",
		"section.story.eyebrow": "El Arte del Sari",
		"section.story.title": "Seis metros. Seis generaciones de artesanía.",
		"section.story.body": "Cada sari de Mun Creations comienza en un telar de madera en un taller de aldea.",
		"section.story.cta": "Nuestra Historia",
		"section.wedding": "Boda y Fiesta",
		"section.wedding.sub": "Reliquias para momentos importantes",
		"section.acc": "El Toque Final",
		"section.acc.sub": "Blusas, dupattas y joyas",
		"news.title": "Únete al Círculo Mun",
		"news.sub": "Disfruta 10% en tu primer pedido.",
		"news.placeholder": "Tu correo electrónico",
		"news.cta": "Suscribirse",
		"cart.title": "Tu Carrito",
		"cart.empty": "Tu carrito está vacío",
		"cart.subtotal": "Subtotal",
		"cart.checkout": "Finalizar Compra",
		"product.add": "Añadir",
		"product.new": "Nuevo",
		"product.bestseller": "Best-seller"
	},
	ar: {
		"nav.new": "الجديد",
		"nav.sarees": "الساري",
		"nav.predraped": "جاهز الارتداء",
		"nav.gowns": "فساتين الساري",
		"nav.blouses": "البلوزات",
		"nav.dupattas": "الدوباتا والإكسسوارات",
		"nav.bridal": "مجموعة العرائس",
		"nav.sale": "التخفيضات",
		"hero.eyebrow": "إصدار الخريف · 2026",
		"hero.title": "ساري خالد، تراث منسوج يدوياً",
		"hero.sub": "ستة أمتار من الفخامة الهادئة، ينسجها حرفيون مهرة في الهند.",
		"hero.cta": "تسوّق المجموعة",
		"hero.cta2": "اكتشف العرائس",
		"trust.handcrafted": "صناعة يدوية في الهند",
		"trust.returns": "إرجاع مجاني 15 يوماً",
		"trust.shipping": "شحن عالمي",
		"trust.authentic": "منسوجات أصلية معتمدة",
		"section.new": "الجديد",
		"section.new.sub": "تصاميم جديدة لتقعي في حبها",
		"section.category": "تسوّق حسب الفئة",
		"section.category.sub": "نسيج لكل مناسبة",
		"section.best": "ستحبين هذه",
		"section.best.sub": "الأكثر محبة هذا الموسم",
		"section.press": "ظهرنا في",
		"section.story.eyebrow": "فن الساري",
		"section.story.title": "ستة أمتار. ستة أجيال من الحرفية.",
		"section.story.body": "كل ساري من Mun Creations يبدأ على نول خشبي في ورشة قروية.",
		"section.story.cta": "قصتنا",
		"section.wedding": "الأعراس والاحتفالات",
		"section.wedding.sub": "قطع للحظات المميزة",
		"section.acc": "اللمسة الأخيرة",
		"section.acc.sub": "بلوزات، دوباتا ومجوهرات",
		"news.title": "انضمي إلى دائرة Mun",
		"news.sub": "احصلي على خصم 10% على أول طلب.",
		"news.placeholder": "بريدك الإلكتروني",
		"news.cta": "اشتراك",
		"cart.title": "سلتك",
		"cart.empty": "سلتك فارغة",
		"cart.subtotal": "المجموع",
		"cart.checkout": "إتمام الشراء",
		"product.add": "أضف إلى السلة",
		"product.new": "جديد",
		"product.bestseller": "الأكثر مبيعاً"
	}
};
var I18nContext = (0, import_react.createContext)(null);
function I18nProvider({ children }) {
	const [currency, setCurrency] = (0, import_react.useState)("USD");
	const [lang, setLang] = (0, import_react.useState)("en");
	const [rates, setRates] = (0, import_react.useState)(DEFAULT_FALLBACK_RATES);
	const [isRatesLoading, setIsRatesLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let isMounted = true;
		const detected = detectUserCurrency();
		if (detected && SUPPORTED_CURRENCIES[detected]) setCurrency(detected);
		getExchangeRates().then((fetchedRates) => {
			if (isMounted) {
				setRates(fetchedRates);
				setIsRatesLoading(false);
			}
		}).catch(() => {
			if (isMounted) setIsRatesLoading(false);
		});
		if (typeof localStorage !== "undefined") {
			const savedCur = localStorage.getItem("mc_cur");
			const savedLang = localStorage.getItem("mc_lang");
			if (savedLang && LANGUAGES[savedLang]) setLang(savedLang);
			if (savedCur && SUPPORTED_CURRENCIES[savedCur]) setCurrency(savedCur);
			else detectCountryFromIP().then((ipCur) => {
				if (isMounted && ipCur && SUPPORTED_CURRENCIES[ipCur] && !localStorage.getItem("mc_cur")) setCurrency(ipCur);
			});
		}
		return () => {
			isMounted = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (typeof localStorage !== "undefined") localStorage.setItem("mc_cur", currency);
	}, [currency]);
	(0, import_react.useEffect)(() => {
		if (typeof localStorage !== "undefined") localStorage.setItem("mc_lang", lang);
		if (typeof document !== "undefined") {
			document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
			document.documentElement.setAttribute("lang", lang);
		}
	}, [lang]);
	const value = (0, import_react.useMemo)(() => ({
		currency,
		setCurrency,
		lang,
		setLang,
		t: (key) => TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key,
		formatPrice: (usdAmount) => formatCurrency(usdAmount, currency, rates),
		rates,
		isRatesLoading
	}), [
		currency,
		lang,
		rates,
		isRatesLoading
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nContext.Provider, {
		value,
		children
	});
}
function useI18n() {
	const ctx = (0, import_react.useContext)(I18nContext);
	if (!ctx) throw new Error("useI18n must be inside I18nProvider");
	return ctx;
}
var CartContext = (0, import_react.createContext)(null);
function CartProvider({ children }) {
	const [items, setItems] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return [];
		try {
			const saved = localStorage.getItem("mun_cart_items");
			return saved ? JSON.parse(saved) : [];
		} catch {
			return [];
		}
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") try {
			localStorage.setItem("mun_cart_items", JSON.stringify(items));
		} catch {}
	}, [items]);
	const value = (0, import_react.useMemo)(() => {
		const add = (p) => {
			setItems((prev) => {
				if (prev.find((i) => i.product.id === p.id)) return prev.map((i) => i.product.id === p.id ? {
					...i,
					qty: i.qty + 1
				} : i);
				return [...prev, {
					product: p,
					qty: 1
				}];
			});
			setOpen(true);
		};
		const remove = (id) => setItems((prev) => prev.filter((i) => i.product.id !== id));
		const setQty = (id, qty) => setItems((prev) => prev.map((i) => i.product.id === id ? {
			...i,
			qty: Math.max(0, qty)
		} : i).filter((i) => i.qty > 0));
		const clearCart = () => {
			setItems([]);
			try {
				localStorage.removeItem("mun_cart_items");
			} catch {}
		};
		return {
			items,
			add,
			remove,
			setQty,
			clearCart,
			count: items.reduce((s, i) => s + i.qty, 0),
			subtotalUsd: items.reduce((s, i) => s + i.qty * i.product.priceUsd, 0),
			open,
			setOpen
		};
	}, [items, open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartContext.Provider, {
		value,
		children
	});
}
function useCart() {
	const c = (0, import_react.useContext)(CartContext);
	if (!c) throw new Error("useCart must be inside CartProvider");
	return c;
}
var ANNOUNCEMENTS_KEYS = [
	"Handcrafted in India · Since 1998",
	"Complimentary Worldwide Shipping on Orders Over $500",
	"Loved by 10,000+ Customers"
];
function AnnouncementBar() {
	const [i, setI] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => setI((v) => (v + 1) % ANNOUNCEMENTS_KEYS.length), 4200);
		return () => clearInterval(t);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-transparent text-white text-[11px] tracking-[0.22em] uppercase border-b border-white/15 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-boutique flex items-center justify-center py-2.5 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "transition-opacity duration-500 font-medium",
				children: ANNOUNCEMENTS_KEYS[i]
			})
		})
	});
}
function Dropdown({ value, displayLabel, onChange, options, icon }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const h = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		};
		document.addEventListener("mousedown", h);
		return () => document.removeEventListener("mousedown", h);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setOpen((o) => !o),
			className: "flex items-center gap-1 text-[11px] tracking-[0.18em] uppercase text-white hover:text-[var(--gold)] transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]",
			children: [
				icon,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: displayLabel || value
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3 opacity-80" })
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute right-0 top-full mt-2 z-50 min-w-[210px] max-h-[300px] overflow-y-auto rounded-sm border border-[var(--gold)]/30 bg-[var(--wine-deep)] text-white shadow-2xl py-1",
			children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					onChange(o.value);
					setOpen(false);
				},
				className: `w-full text-left px-4 py-2 text-xs hover:bg-[var(--gold)]/20 transition-colors ${o.value === value ? "text-[var(--gold)] font-semibold" : "text-white/90"}`,
				children: o.label
			}, o.value))
		})]
	});
}
function Header({ onSelectCategoryFilter }) {
	const { currency, setCurrency, lang, setLang, formatPrice } = useI18n();
	const { count, setOpen: setCartOpen } = useCart();
	const [hidden, setHidden] = (0, import_react.useState)(false);
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [activeMenuId, setActiveMenuId] = (0, import_react.useState)(null);
	const [expandedMobileCategory, setExpandedMobileCategory] = (0, import_react.useState)(null);
	const menuHoverTimeout = (0, import_react.useRef)(null);
	const handleMouseEnter = (id) => {
		if (menuHoverTimeout.current) clearTimeout(menuHoverTimeout.current);
		setActiveMenuId(id);
	};
	const handleMouseLeave = () => {
		menuHoverTimeout.current = setTimeout(() => {
			setActiveMenuId(null);
		}, 200);
	};
	(0, import_react.useEffect)(() => {
		let lastScrollY = window.scrollY;
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			setScrolled(currentScrollY > 100);
			if (currentScrollY > 120 && currentScrollY > lastScrollY && !activeMenuId) setHidden(true);
			else setHidden(false);
			lastScrollY = currentScrollY;
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [activeMenuId]);
	const handleNavClick = (label, type = "category") => {
		setActiveMenuId(null);
		setMobileOpen(false);
		if (onSelectCategoryFilter) {
			onSelectCategoryFilter(label, type);
			return;
		}
		const cleanLabel = label.toUpperCase().trim();
		if (cleanLabel === "HOME") {
			window.location.href = "/";
			return;
		}
		if (cleanLabel === "SAREES") {
			window.location.href = "/sarees";
			return;
		}
		if (cleanLabel === "COLLECTIONS" || cleanLabel === "BUDGET COLLECTIONS" || cleanLabel === "NEW ARRIVALS" || cleanLabel === "BEST SELLING") {
			window.location.href = "/collections";
			return;
		}
		if (cleanLabel === "CONTACT" || cleanLabel === "OUR STORY") {
			window.location.href = "/about";
			return;
		}
		window.location.href = `/shop?category=${encodeURIComponent(label)}`;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: `fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out ${hidden ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"} ${scrolled || activeMenuId ? "bg-[var(--wine-deep)]/95 backdrop-blur-md border-b border-[var(--gold)]/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-white" : "bg-transparent text-white border-b border-white/15 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"}`,
		onMouseLeave: handleMouseLeave,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnnouncementBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden md:block border-b border-white/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container-boutique flex items-center justify-between py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] tracking-[0.18em] uppercase text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-[var(--gold)] animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Complimentary Shipping over ", formatPrice(500)] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-5 text-white",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dropdown, {
									value: lang,
									onChange: setLang,
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-3 w-3" }),
									options: Object.keys(LANGUAGES).map((k) => ({
										value: k,
										label: `${LANGUAGES[k].native}`
									}))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dropdown, {
									value: currency,
									displayLabel: `${currency} ${CURRENCIES[currency]?.symbol || ""}`,
									onChange: setCurrency,
									options: Object.keys(CURRENCIES).map((k) => ({
										value: k,
										label: `${k} ${CURRENCIES[k].symbol} — ${CURRENCIES[k].label}`
									}))
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container-boutique flex items-center justify-between gap-3 sm:gap-6 py-2.5 sm:py-3.5 md:py-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "md:hidden -ml-2 p-2.5 touch-target text-white hover:text-[var(--gold)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] cursor-pointer",
								onClick: () => setMobileOpen(true),
								"aria-label": "Open navigation menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-6 w-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "flex items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/logo-light.png",
									alt: "MUN Creations Logo",
									className: "h-10 sm:h-12 md:h-16 w-auto object-contain transition-transform duration-300 hover:scale-105 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-1.5 sm:gap-3 md:gap-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/search",
									"aria-label": "Search collection",
									className: "p-2 touch-target hover:text-[var(--gold)] transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5 md:h-[18px] md:w-[18px]" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/account",
									"aria-label": "My Account",
									className: "hidden sm:inline-flex p-2 touch-target hover:text-[var(--gold)] transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-5 w-5 md:h-[18px] md:w-[18px]" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/account",
									"aria-label": "Wishlist",
									className: "hidden sm:inline-flex p-2 touch-target hover:text-[var(--gold)] transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-5 w-5 md:h-[18px] md:w-[18px]" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									"aria-label": "Shopping Bag",
									onClick: () => setCartOpen(true),
									className: "relative p-2 touch-target hover:text-[var(--gold)] transition-colors cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-5 w-5 md:h-[18px] md:w-[18px]" }), count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-[var(--gold)] text-[var(--wine-deep)] text-[10px] font-bold flex items-center justify-center shadow-xs",
										children: count
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "hidden md:block border-t border-white/10 relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "container-boutique flex items-center justify-start gap-6 lg:gap-8 py-3 overflow-x-auto no-scrollbar",
								children: MAIN_NAV_ITEMS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									onMouseEnter: () => item.hasDropdown && handleMouseEnter(item.id),
									className: "relative py-1 shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleNavClick(item.label, "nav"),
										className: `text-[11px] tracking-[0.2em] uppercase font-semibold transition-all flex items-center gap-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] ${activeMenuId === item.id || item.label === "Budget Collections" ? "text-[var(--gold)] scale-105" : "text-white hover:text-[var(--gold)]"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }), item.hasDropdown && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-3 w-3 transition-transform duration-300 ${activeMenuId === item.id ? "rotate-180 text-[var(--gold)]" : "opacity-70"}` })]
									})
								}, item.id))
							}),
							activeMenuId === "sarees" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute left-0 right-0 top-full bg-[var(--wine-deep)]/98 backdrop-blur-xl border-b border-[var(--gold)]/30 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-white py-8 px-6 transition-all duration-300 z-50 animate-in fade-in slide-in-from-top-2",
								onMouseEnter: () => handleMouseEnter("sarees"),
								onMouseLeave: handleMouseLeave,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "container-boutique",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-4 pb-3 border-b border-[var(--gold)]/20 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-sm font-serif tracking-[0.15em] text-[var(--gold)] uppercase font-semibold",
											children: "SAREES CATALOG (1,700+ WEAVES)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-white/70 italic mt-0.5",
											children: "Explore Banarasi, Kanjivaram, Tussar, Jamdani, Organza, Chikankari & Bengal Silks"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => handleNavClick("Sarees", "category"),
											className: "text-[11px] uppercase tracking-widest text-[var(--gold)] hover:text-white transition-colors flex items-center gap-1 font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Full Saree Catalog" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-2 md:grid-cols-5 gap-6 py-2",
										children: EXPANDED_SAREE_TAXONOMY.map((fam) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleNavClick(fam.title, "family"),
												className: "text-xs tracking-[0.16em] uppercase font-bold text-[var(--gold)] hover:underline flex items-center gap-1 text-left",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fam.title })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "space-y-1 pl-2 border-l border-[var(--gold)]/20",
												children: fam.subcategories.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => handleNavClick(sub.name, "subcategory"),
													className: "text-[11px] text-white/80 hover:text-[var(--gold)] transition-colors text-left font-light block py-0.5",
													children: sub.name
												}) }, sub.slug))
											})]
										}, fam.slug))
									})]
								})
							}),
							activeMenuId === "kurti" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute left-1/4 top-full bg-[var(--wine-deep)]/98 backdrop-blur-xl border border-[var(--gold)]/30 rounded-sm shadow-2xl text-white py-4 px-6 min-w-[240px] z-50",
								onMouseEnter: () => handleMouseEnter("kurti"),
								onMouseLeave: handleMouseLeave,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] tracking-widest uppercase text-[var(--gold)] font-bold block pb-1 border-b border-white/10",
										children: "Kurti Categories"
									}), KURTI_CATEGORIES.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleNavClick(k.name, "kurti"),
										className: "block w-full text-left text-xs py-1 text-white/80 hover:text-[var(--gold)] transition-colors",
										children: k.name
									}, k.slug))]
								})
							}),
							activeMenuId === "blouses" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute left-1/3 top-full bg-[var(--wine-deep)]/98 backdrop-blur-xl border border-[var(--gold)]/30 rounded-sm shadow-2xl text-white py-4 px-6 min-w-[240px] z-50",
								onMouseEnter: () => handleMouseEnter("blouses"),
								onMouseLeave: handleMouseLeave,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] tracking-widest uppercase text-[var(--gold)] font-bold block pb-1 border-b border-white/10",
										children: "Blouses & Couture"
									}), BLOUSE_CATEGORIES.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleNavClick(b.name, "blouse"),
										className: "block w-full text-left text-xs py-1 text-white/80 hover:text-[var(--gold)] transition-colors",
										children: b.name
									}, b.slug))]
								})
							}),
							activeMenuId === "collections" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute left-1/2 -translate-x-1/2 top-full bg-[var(--wine-deep)]/98 backdrop-blur-xl border border-[var(--gold)]/30 rounded-sm shadow-2xl text-white py-6 px-8 min-w-[480px] z-50",
								onMouseEnter: () => handleMouseEnter("collections"),
								onMouseLeave: handleMouseLeave,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] tracking-widest uppercase text-[var(--gold)] font-bold block pb-2 mb-3 border-b border-white/10",
									children: "Merchandising Collections"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 gap-x-8 gap-y-2",
									children: COLLECTION_HIERARCHY.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleNavClick(c.name, "collection"),
										className: "text-left text-xs py-1 text-white/80 hover:text-[var(--gold)] transition-colors font-medium flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3 text-[var(--gold)]/50" })]
									}, c.slug))
								})]
							})
						]
					})
				]
			}),
			mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:hidden fixed inset-0 z-50 bg-[var(--wine-deep)] text-white flex flex-col animate-in fade-in duration-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-4 py-3.5 border-b border-white/15 bg-black/30 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							onClick: () => setMobileOpen(false),
							className: "flex items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/logo-light.png",
								alt: "MUN Creations Logo",
								className: "h-9 w-auto object-contain"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMobileOpen(false),
							"aria-label": "Close navigation menu",
							className: "text-white hover:text-[var(--gold)] p-2 touch-target cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-6 w-6" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-4 py-3 border-b border-white/10 bg-black/10 shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/search",
							onClick: () => setMobileOpen(false),
							className: "w-full flex items-center gap-2.5 bg-white/10 border border-white/20 rounded-sm px-3.5 py-2.5 text-xs text-white/80 hover:border-[var(--gold)] transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-[var(--gold)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Search sarees, fabrics, weaves..." })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 overflow-y-auto px-4 py-3 space-y-1 divide-y divide-white/10",
						children: [
							MAIN_NAV_ITEMS.map((item) => {
								const isExpanded = expandedMobileCategory === item.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between py-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleNavClick(item.label, "nav"),
												className: "text-sm font-semibold tracking-[0.18em] uppercase text-white hover:text-[var(--gold)] text-left flex-1",
												children: item.label
											}), item.hasDropdown && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setExpandedMobileCategory(isExpanded ? null : item.id),
												className: "p-2 touch-target text-[var(--gold)] cursor-pointer",
												"aria-label": `Toggle ${item.label} subcategories`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}` })
											})]
										}),
										isExpanded && item.id === "sarees" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "pl-4 py-2 space-y-3 border-l-2 border-[var(--gold)]/40 ml-1 mb-2",
											children: EXPANDED_SAREE_TAXONOMY.map((fam) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => handleNavClick(fam.title, "family"),
													className: "text-xs font-bold text-[var(--gold)] hover:underline uppercase block text-left py-1",
													children: fam.title
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "pl-2 space-y-1",
													children: fam.subcategories.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => handleNavClick(sub.name, "subcategory"),
														className: "block text-xs text-white/80 hover:text-[var(--gold)] text-left font-light py-1",
														children: sub.name
													}, sub.slug))
												})]
											}, fam.slug))
										}),
										isExpanded && item.id === "kurti" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "pl-4 py-2 space-y-1 border-l-2 border-[var(--gold)]/40 ml-1 mb-2",
											children: KURTI_CATEGORIES.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleNavClick(k.name, "kurti"),
												className: "block text-xs text-white/80 hover:text-[var(--gold)] text-left py-1.5",
												children: k.name
											}, k.slug))
										}),
										isExpanded && item.id === "blouses" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "pl-4 py-2 space-y-1 border-l-2 border-[var(--gold)]/40 ml-1 mb-2",
											children: BLOUSE_CATEGORIES.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleNavClick(b.name, "blouse"),
												className: "block text-xs text-white/80 hover:text-[var(--gold)] text-left py-1.5",
												children: b.name
											}, b.slug))
										}),
										isExpanded && item.id === "collections" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "pl-4 py-2 space-y-1 border-l-2 border-[var(--gold)]/40 ml-1 mb-2",
											children: COLLECTION_HIERARCHY.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleNavClick(c.name, "collection"),
												className: "block text-xs text-white/80 hover:text-[var(--gold)] text-left py-1.5",
												children: c.name
											}, c.slug))
										})
									]
								}, item.id);
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-4 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/account",
									onClick: () => setMobileOpen(false),
									className: "flex items-center gap-2.5 text-xs text-white/90 hover:text-[var(--gold)] py-2 font-medium uppercase tracking-wider",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-[var(--gold)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "My Account & Orders" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/account",
									onClick: () => setMobileOpen(false),
									className: "flex items-center gap-2.5 text-xs text-white/90 hover:text-[var(--gold)] py-2 font-medium uppercase tracking-wider",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-4 w-4 text-[var(--gold)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Wishlist Items" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-5 pb-6 flex items-center justify-between border-t border-white/15",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dropdown, {
									value: lang,
									onChange: setLang,
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-3.5 w-3.5" }),
									options: Object.keys(LANGUAGES).map((k) => ({
										value: k,
										label: LANGUAGES[k].native
									}))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dropdown, {
									value: currency,
									displayLabel: `${currency} ${CURRENCIES[currency]?.symbol || ""}`,
									onChange: setCurrency,
									options: Object.keys(CURRENCIES).map((k) => ({
										value: k,
										label: `${k} ${CURRENCIES[k].symbol} — ${CURRENCIES[k].label}`
									}))
								})]
							})
						]
					})
				]
			})
		]
	});
}
var COLS = [{
	title: "About",
	links: [
		{
			name: "Our Story",
			href: "/about"
		},
		{
			name: "Craftsmanship",
			href: "/sarees"
		},
		{
			name: "FAQs",
			href: "/faqs"
		}
	]
}, {
	title: "Policies",
	links: [
		{
			name: "Shipping Policy",
			href: "/shipping-policy"
		},
		{
			name: "Final Sale Policy",
			href: "/return-policy"
		},
		{
			name: "Refund Terms",
			href: "/refund-policy"
		},
		{
			name: "Privacy Policy",
			href: "/privacy-policy"
		},
		{
			name: "Terms of Service",
			href: "/terms"
		}
	]
}];
function Footer() {
	const { currency, setCurrency, lang, setLang } = useI18n();
	const [authModalOpen, setAuthModalOpen] = (0, import_react.useState)(false);
	const [targetPortal, setTargetPortal] = (0, import_react.useState)("admin");
	const [passcode, setPasscode] = (0, import_react.useState)("");
	const [errorMsg, setErrorMsg] = (0, import_react.useState)("");
	const handleOpenAuthModal = (portal) => {
		setTargetPortal(portal);
		setPasscode("");
		setErrorMsg("");
		setAuthModalOpen(true);
	};
	const handleVerifyPassword = (e) => {
		e.preventDefault();
		setErrorMsg("");
		if (targetPortal === "admin") if (passcode === "mun@dev1234") {
			sessionStorage.setItem("mun_admin_authed", "true");
			window.location.href = "/admin";
		} else setErrorMsg("Invalid Admin Security Key. Access Denied.");
		else if (passcode === "mun@dev1234") {
			sessionStorage.setItem("mun_source_authed", "true");
			window.location.href = "/source";
		} else setErrorMsg("Invalid Sourcing Passcode. Access Denied.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "bg-[var(--wine-deep)] text-[var(--ivory)] relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-boutique py-12 sm:py-16 md:py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sm:col-span-2 max-w-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 sm:mb-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/logo-light.png",
								alt: "MUN Creations Logo",
								className: "h-12 sm:h-14 md:h-16 w-auto object-contain"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm text-[var(--ivory)]/70 leading-relaxed mb-5 sm:mb-6",
							children: "Handwoven sarees & festive wear, crafted in India by families of master artisans. Shipped with love to 42 countries."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-3",
							children: [
								Instagram,
								Facebook,
								Youtube
							].map((Icon, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#",
								"aria-label": "social link",
								className: "h-9 w-9 grid place-items-center border border-[var(--ivory)]/25 rounded-full hover:bg-[var(--gold)] hover:text-[var(--wine-deep)] hover:border-[var(--gold)] transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
							}, i))
						})
					]
				}), COLS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] tracking-[0.28em] sm:tracking-[0.32em] uppercase text-[var(--gold)] mb-4 sm:mb-5 font-semibold",
					children: c.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2.5 sm:space-y-3",
					children: c.links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: l.href,
						className: "text-xs sm:text-sm text-[var(--ivory)]/75 hover:text-[var(--gold)] transition-colors",
						children: l.name
					}) }, l.name))
				})] }, c.title))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-[var(--ivory)]/15",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container-boutique py-5 sm:py-6 flex flex-col md:flex-row items-center gap-4 md:justify-between text-xs text-[var(--ivory)]/60 text-center md:text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 text-[11px] sm:text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"© ",
								(/* @__PURE__ */ new Date()).getFullYear(),
								" Mun Creations. All rights reserved."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleOpenAuthModal("admin"),
								className: "inline-flex items-center gap-1 text-[var(--gold)] hover:underline font-semibold cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Main Admin Portal" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleOpenAuthModal("source"),
								className: "inline-flex items-center gap-1 text-[var(--ivory)]/70 hover:text-[var(--gold)] hover:underline font-medium cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3 text-[var(--gold)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sourcing Registry" })]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-center gap-3 sm:gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: lang,
								onChange: (e) => setLang(e.target.value),
								className: "bg-transparent border border-[var(--ivory)]/25 px-2 py-1.5 text-xs focus:outline-none rounded-xs",
								children: Object.keys(LANGUAGES).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: k,
									className: "text-foreground",
									children: LANGUAGES[k].native
								}, k))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: currency,
								onChange: (e) => setCurrency(e.target.value),
								className: "bg-transparent border border-[var(--ivory)]/25 px-2 py-1.5 text-xs focus:outline-none text-[var(--ivory)] rounded-xs",
								children: Object.keys(CURRENCIES).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: k,
									className: "bg-[var(--wine-deep)] text-white",
									children: [
										k,
										" ",
										CURRENCIES[k].symbol,
										" — ",
										CURRENCIES[k].label
									]
								}, k))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 sm:gap-2 tracking-[0.14em] sm:tracking-[0.18em] uppercase text-[9px] sm:text-[10px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Visa" }),
									"·",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mastercard" }),
									"·",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Amex" }),
									"·",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PayPal" }),
									"·",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "UPI" })
								]
							})
						]
					})]
				})
			}),
			authModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white text-foreground rounded-sm max-w-sm w-full p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in border border-border relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setAuthModalOpen(false),
							className: "absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer p-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-12 w-12 rounded-full bg-[var(--wine)]/10 text-[var(--wine)] flex items-center justify-center mx-auto border border-[var(--wine)]/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-6 w-6 text-[var(--wine)]" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-lg sm:text-xl font-bold text-[var(--wine-deep)]",
									children: targetPortal === "admin" ? "Main Admin Access" : "Sourcing Registry Access"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "This portal is password protected. Please enter your security key below."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleVerifyPassword,
							className: "space-y-4 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold block mb-1",
									children: "Passcode / Security Key"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "password",
										required: true,
										autoFocus: true,
										value: passcode,
										onChange: (e) => setPasscode(e.target.value),
										placeholder: "Enter security key...",
										className: "w-full pl-9 pr-4 py-2.5 bg-secondary/30 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)] font-mono text-sm"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" })]
								})] }),
								errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-sm text-center",
									children: errorMsg
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									className: "w-full bg-[var(--wine)] text-white py-3 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[var(--wine-deep)] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[44px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-[var(--gold)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verify & Unlock Portal" })]
								})
							]
						})
					]
				})
			})
		]
	});
}
function CartDrawer() {
	const { open, setOpen, items, setQty, remove, subtotalUsd } = useCart();
	const { t, formatPrice, currency } = useI18n();
	(0, import_react.useEffect)(() => {
		if (typeof document === "undefined") return;
		document.body.style.overflow = open ? "hidden" : "";
		const handleKeyDown = (e) => {
			if (e.key === "Escape") setOpen(false);
		};
		if (open) window.addEventListener("keydown", handleKeyDown);
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [open, setOpen]);
	const isFreeShipping = subtotalUsd >= 500 || currency === "INR" && subtotalUsd * 83.5 >= 4e4;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		onClick: (e) => {
			e.preventDefault();
			e.stopPropagation();
			setOpen(false);
		},
		className: `fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${open ? "opacity-100 cursor-pointer" : "opacity-0 pointer-events-none"}`
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: `fixed inset-y-0 right-0 z-[60] h-screen max-h-screen w-full sm:w-[440px] max-w-full bg-[var(--ivory)] shadow-2xl flex flex-col transition-transform duration-300 ease-out border-l border-border ${open ? "translate-x-0" : "translate-x-full pointer-events-none"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-border bg-[var(--ivory)] z-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "eyebrow text-[var(--gold)]",
					children: "Mun Creations"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-serif text-lg sm:text-xl font-bold text-[var(--wine-deep)]",
					children: [
						t("cart.title"),
						" (",
						items.reduce((acc, item) => acc + item.qty, 0),
						")"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: (e) => {
						e.preventDefault();
						e.stopPropagation();
						setOpen(false);
					},
					"aria-label": "Close cart drawer",
					className: "p-2 touch-target text-foreground/80 hover:text-[var(--wine)] transition-colors rounded-full hover:bg-secondary cursor-pointer border border-border/50 flex items-center gap-1 text-xs font-semibold px-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Close" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5",
				children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "h-full flex flex-col items-center justify-center text-center gap-3 text-muted-foreground py-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-16 w-16 rounded-full bg-[var(--wine)]/10 text-[var(--wine)] flex items-center justify-center border border-[var(--wine)]/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-8 w-8 text-[var(--gold)]" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-serif text-2xl font-bold text-[var(--wine-deep)]",
							children: t("cart.empty")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs max-w-xs",
							children: "Explore our handwoven Banarasi, Kanjivaram & Tussar sarees to start your checkout."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5 sm:space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-sm bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-emerald-700 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isFreeShipping ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Complimentary Worldwide Insured Air Shipping Unlocked!" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Spend ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatPrice(500 - subtotalUsd) }),
							" more for Complimentary Express Air Dispatch"
						] }) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: items.map(({ product, qty }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "py-4 flex gap-3 sm:gap-4 first:pt-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: product.image,
								alt: product.name,
								className: "h-22 w-18 sm:h-24 sm:w-20 object-cover shrink-0 rounded-xs border border-border"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0 flex flex-col justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-serif text-sm sm:text-[15px] leading-snug font-bold text-foreground line-clamp-2",
										children: product.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: product.fabric
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-bold text-[var(--wine-deep)] mt-1",
										children: formatPrice(product.priceUsd)
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mt-2 pt-2 border-t border-border/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center border border-border bg-white rounded-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setQty(product.id, qty - 1),
												className: "h-7 w-7 grid place-items-center hover:bg-secondary text-foreground cursor-pointer",
												"aria-label": "Decrease",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-8 text-center text-xs font-bold",
												children: qty
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setQty(product.id, qty + 1),
												className: "h-7 w-7 grid place-items-center hover:bg-secondary text-foreground cursor-pointer",
												"aria-label": "Increase",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => remove(product.id),
										className: "text-muted-foreground hover:text-[var(--wine)] p-1 text-xs flex items-center gap-1 font-medium cursor-pointer",
										"aria-label": "Remove",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Remove" })]
									})]
								})]
							})]
						}, product.id))
					})]
				})
			}),
			items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 bg-[var(--ivory)] border-t border-border px-4 sm:px-6 py-4 sm:py-5 space-y-3 z-10 shadow-[0_-8px_20px_rgba(0,0,0,0.08)] safe-bottom",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "uppercase tracking-wider text-muted-foreground font-semibold",
							children: [
								t("cart.subtotal"),
								" (",
								items.reduce((acc, item) => acc + item.qty, 0),
								" items)"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-serif text-xl sm:text-2xl font-bold text-[var(--wine-deep)]",
							children: formatPrice(subtotalUsd)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/checkout",
						onClick: () => setOpen(false),
						className: "w-full bg-[var(--gold)] text-[var(--wine-deep)] py-3.5 sm:py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-white hover:text-[var(--wine-deep)] transition-all shadow-lg flex items-center justify-center gap-2 border border-[var(--wine-deep)]/20 min-h-[48px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-[var(--wine-deep)]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"PROCEED TO PAYMENT (",
								formatPrice(subtotalUsd),
								")"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-2 text-[10px] text-muted-foreground tracking-wider uppercase pt-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Razorpay" }),
							"·",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Stripe" }),
							"·",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PayPal" }),
							"·",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Visa" }),
							"·",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "UPI" })
						]
					})
				]
			})
		]
	})] });
}
//#endregion
export { I18nProvider as a, Header as i, CartProvider as n, useCart as o, Footer as r, useI18n as s, CartDrawer as t };
