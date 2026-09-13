import { useState } from "react";
import {
  Instagram,
  Facebook,
  Youtube,
  Lock,
  ShieldCheck,
  Key,
  X,
  ArrowRightLeft,
} from "lucide-react";
import {
  useI18n,
  useCurrencyModal,
  CURRENCIES,
  LANGUAGES,
  type CurrencyCode,
  type LangCode,
} from "@/lib/i18n";

const COLS = [
  {
    title: "Boutique",
    links: [
      { name: "All Handloom Sarees", href: "/products" },
      { name: "Tussar Heritage", href: "/sarees" },
      { name: "Curated Collections", href: "/collections" },
      { name: "Shopping Bag", href: "/cart" },
      { name: "Client Concierge", href: "/contact" },
    ],
  },
  {
    title: "About",
    links: [
      { name: "Our Story", href: "/about" },
      { name: "Artisan Craftsmanship", href: "/sarees" },
      { name: "FAQs", href: "/faqs" },
      { name: "Currency Converter", href: "/currency-converter" },
    ],
  },
  {
    title: "Policies",
    links: [
      { name: "Shipping Policy", href: "/shipping-policy" },
      { name: "Final Sale Policy", href: "/return-policy" },
      { name: "Refund Terms", href: "/refund-policy" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  },
];

export function Footer() {
  const { currency, setCurrency, lang, setLang } = useI18n();
  const { openConverter } = useCurrencyModal();

  // Password Protection Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [targetPortal, setTargetPortal] = useState<"admin" | "source">("admin");
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleOpenAuthModal = (portal: "admin" | "source") => {
    setTargetPortal(portal);
    setPasscode("");
    setErrorMsg("");
    setAuthModalOpen(true);
  };

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (targetPortal === "admin") {
      if (passcode === "mun@dev1234") {
        sessionStorage.setItem("mun_admin_authed", "true");
        window.location.href = "/admin";
      } else {
        setErrorMsg("Invalid Admin Security Key. Access Denied.");
      }
    } else {
      if (passcode === "mun@dev1234") {
        sessionStorage.setItem("mun_source_authed", "true");
        window.location.href = "/source";
      } else {
        setErrorMsg("Invalid Sourcing Passcode. Access Denied.");
      }
    }
  };

  return (
    <footer className="bg-[var(--wine-deep)] text-[var(--ivory)] relative">
      <div className="container-boutique py-12 sm:py-16 md:py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10">
        <div className="sm:col-span-2 max-w-sm">
          <div className="mb-4 sm:mb-6">
            <img
              src="/logo-light.png"
              alt="MUN Creations Logo"
              className="h-12 sm:h-14 md:h-16 w-auto object-contain"
            />
          </div>
          <p className="text-xs sm:text-sm text-[var(--ivory)]/70 leading-relaxed mb-5 sm:mb-6">
            Handwoven sarees & festive wear, crafted in India by families of master artisans.
            Shipped with love to 42 countries.
          </p>
          <div className="flex gap-3">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social link"
                className="h-9 w-9 grid place-items-center border border-[var(--ivory)]/25 rounded-full hover:bg-[var(--gold)] hover:text-[var(--wine-deep)] hover:border-[var(--gold)] transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <div className="text-[10px] tracking-[0.28em] sm:tracking-[0.32em] uppercase text-[var(--gold)] mb-4 sm:mb-5 font-semibold">
              {c.title}
            </div>
            <ul className="space-y-2.5 sm:space-y-3">
              {c.links.map((l) => (
                <li key={l.name}>
                  <a
                    href={l.href}
                    className="text-xs sm:text-sm text-[var(--ivory)]/75 hover:text-[var(--gold)] transition-colors"
                  >
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--ivory)]/15">
        <div className="container-boutique py-5 sm:py-6 flex flex-col md:flex-row items-center gap-4 md:justify-between text-xs text-[var(--ivory)]/60 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 text-[11px] sm:text-xs">
            <span>© {new Date().getFullYear()} Mun Creations. All rights reserved.</span>
            <span>·</span>

            {/* Discrete Password Protected Footer Links */}
            <button
              onClick={() => handleOpenAuthModal("admin")}
              className="inline-flex items-center gap-1 text-[var(--gold)] hover:underline font-semibold cursor-pointer"
            >
              <Lock className="h-3 w-3 text-emerald-400" />
              <span>Main Admin Portal</span>
            </button>

            <span>·</span>

            <button
              onClick={() => handleOpenAuthModal("source")}
              className="inline-flex items-center gap-1 text-[var(--ivory)]/70 hover:text-[var(--gold)] hover:underline font-medium cursor-pointer"
            >
              <Lock className="h-3 w-3 text-[var(--gold)]" />
              <span>Sourcing Registry</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => openConverter({ from: currency, to: "INR", amount: 100 })}
              className="inline-flex items-center gap-1.5 border border-[var(--ivory)]/25 px-2.5 py-1.5 text-xs text-[var(--gold)] hover:border-[var(--gold)] rounded-xs transition-colors cursor-pointer"
            >
              <ArrowRightLeft className="h-3 w-3" />
              <span>Live Converter</span>
            </button>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as LangCode)}
              className="bg-transparent border border-[var(--ivory)]/25 px-2 py-1.5 text-xs focus:outline-none rounded-xs"
            >
              {(Object.keys(LANGUAGES) as LangCode[]).map((k) => (
                <option key={k} value={k} className="text-foreground">
                  {LANGUAGES[k].native}
                </option>
              ))}
            </select>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="bg-transparent border border-[var(--ivory)]/25 px-2 py-1.5 text-xs focus:outline-none text-[var(--ivory)] rounded-xs"
            >
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((k) => (
                <option key={k} value={k} className="bg-[var(--wine-deep)] text-white">
                  {k} {CURRENCIES[k].symbol} — {CURRENCIES[k].label}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1.5 sm:gap-2 tracking-[0.14em] sm:tracking-[0.18em] uppercase text-[9px] sm:text-[10px]">
              <span>Visa</span>·<span>Mastercard</span>·<span>Amex</span>·<span>PayPal</span>·
              <span>UPI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Password Protection Authentication Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-foreground rounded-sm max-w-sm w-full p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in border border-border relative">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer p-1"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-[var(--wine)]/10 text-[var(--wine)] flex items-center justify-center mx-auto border border-[var(--wine)]/20">
                <Lock className="h-6 w-6 text-[var(--wine)]" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--wine-deep)]">
                {targetPortal === "admin" ? "Main Admin Access" : "Sourcing Registry Access"}
              </h3>
              <p className="text-xs text-muted-foreground">
                This portal is password protected. Please enter your security key below.
              </p>
            </div>

            <form onSubmit={handleVerifyPassword} className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Passcode / Security Key</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    autoFocus
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter security key..."
                    className="w-full pl-9 pr-4 py-2.5 bg-secondary/30 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)] font-mono text-sm"
                  />
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-sm text-center">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[var(--wine)] text-white py-3 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[var(--wine-deep)] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <ShieldCheck className="h-4 w-4 text-[var(--gold)]" />
                <span>Verify & Unlock Portal</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
}
