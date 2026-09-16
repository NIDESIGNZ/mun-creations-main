import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  SUPPORTED_CURRENCIES,
  DEFAULT_FALLBACK_RATES,
  type CurrencyCode as ServiceCurrencyCode,
  getExchangeRates,
  detectUserCurrency,
  detectCountryFromIP,
  formatCurrency,
  convertPrice,
} from "@/services/currencyService";
import {
  CurrencyModalProvider,
  useCurrencyModal,
} from "@/components/site/currency-converter/CurrencyConverterModal";

export { useCurrencyModal };

export type CurrencyCode = ServiceCurrencyCode;
export type LangCode = "en" | "hi" | "fr" | "es" | "ar";

export const CURRENCIES = SUPPORTED_CURRENCIES;

export const LANGUAGES: Record<LangCode, { label: string; native: string }> = {
  en: { label: "English", native: "English" },
  hi: { label: "Hindi", native: "हिन्दी" },
  fr: { label: "French", native: "Français" },
  es: { label: "Spanish", native: "Español" },
  ar: { label: "Arabic", native: "العربية" },
};

type Dict = Record<string, string>;

export const TRANSLATIONS: Record<LangCode, Dict> = {
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
    "section.story.body":
      "Every Mun Creations saree begins on a wooden handloom in a village workshop — a slow, meditative dialogue between weaver and thread. We work directly with weaving families in Kanchipuram, Varanasi and Bengal to preserve techniques that have been passed down for centuries, and to bring their artistry to a modern woman anywhere in the world.",
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
    "product.bestseller": "Bestseller",
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
    "section.story.body":
      "हर मुन क्रिएशन्स साड़ी एक ग्रामीण कार्यशाला में लकड़ी के हथकरघे पर शुरू होती है। हम कांचीपुरम, वाराणसी और बंगाल के बुनकर परिवारों के साथ सीधे काम करते हैं।",
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
    "product.bestseller": "बेस्टसेलर",
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
    "section.story.body":
      "Chaque sari Mun Creations commence sur un métier à tisser en bois dans un atelier de village.",
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
    "product.bestseller": "Best-seller",
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
    "section.story.body":
      "Cada sari de Mun Creations comienza en un telar de madera en un taller de aldea.",
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
    "product.bestseller": "Best-seller",
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
    "product.bestseller": "الأكثر مبيعاً",
  },
};

import {
  type PriceInput,
} from "@/services/currencyService";

type Ctx = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: string) => string;
  formatPrice: (input: PriceInput, sourceCurrency?: "INR" | "USD") => string;
  rates: Record<string, number>;
  isRatesLoading: boolean;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Graceful non-blocking initial currency: default to INR for authentic Indian luxury saree storefront
  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    try {
      return detectUserCurrency();
    } catch {
      return "INR";
    }
  });
  const [lang, setLang] = useState<LangCode>("en");
  const [rates, setRates] = useState<Record<string, number>>(DEFAULT_FALLBACK_RATES);
  const [isRatesLoading, setIsRatesLoading] = useState<boolean>(true);

  // Initial setup: fetch rates & detect country/currency asynchronously after mount
  useEffect(() => {
    let isMounted = true;

    // Load Live Exchange Rates in background
    getExchangeRates()
      .then((fetchedRates) => {
        if (isMounted) {
          setRates(fetchedRates);
          setIsRatesLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsRatesLoading(false);
      });

    // Check for saved preferences or IP Geolocation
    if (typeof localStorage !== "undefined") {
      const savedCur = localStorage.getItem("mc_cur") as CurrencyCode | null;
      const savedLang = localStorage.getItem("mc_lang") as LangCode | null;
      if (savedLang && LANGUAGES[savedLang]) {
        setLang(savedLang);
      }
      if (savedCur && SUPPORTED_CURRENCIES[savedCur]) {
        setCurrency(savedCur);
      } else {
        // Asynchronously attempt IP detection if no saved preference (non-blocking)
        detectCountryFromIP().then((ipCur) => {
          if (
            isMounted &&
            ipCur &&
            SUPPORTED_CURRENCIES[ipCur] &&
            !localStorage.getItem("mc_cur")
          ) {
            setCurrency(ipCur);
          }
        });
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Save selected currency
  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("mc_cur", currency);
    }
  }, [currency]);

  // Save selected language & set HTML document attrs
  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("mc_lang", lang);
    }
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
      document.documentElement.setAttribute("lang", lang);
    }
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      currency,
      setCurrency,
      lang,
      setLang,
      t: (key) => TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key,
      formatPrice: (input: PriceInput, sourceCurrency?: "INR" | "USD") =>
        formatCurrency(input, currency, rates, sourceCurrency),
      rates,
      isRatesLoading,
    }),
    [currency, lang, rates, isRatesLoading],
  );

  return (
    <I18nContext.Provider value={value}>
      <CurrencyModalProvider>{children}</CurrencyModalProvider>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be inside I18nProvider");
  return ctx;
}
