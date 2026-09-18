import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Globe,
  Sparkles,
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
import { useCart } from "@/lib/cart";
import {
  MAIN_NAV_ITEMS,
  EXPANDED_SAREE_TAXONOMY,
  KURTI_CATEGORIES,
  BLOUSE_CATEGORIES,
  COLLECTION_HIERARCHY,
} from "@/lib/catalog";

const ANNOUNCEMENTS_KEYS = [
  "Handcrafted in India · Since 1998",
  "Complimentary Worldwide Shipping on Orders Over $500",
  "Loved by 10,000+ Customers",
];

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % ANNOUNCEMENTS_KEYS.length), 4200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-transparent text-white text-[11px] tracking-[0.22em] uppercase border-b border-white/15 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
      <div className="container-boutique flex items-center justify-center py-2.5 text-center">
        <span className="transition-opacity duration-500 font-medium">{ANNOUNCEMENTS_KEYS[i]}</span>
      </div>
    </div>
  );
}

function Dropdown<T extends string>({
  value,
  displayLabel,
  onChange,
  options,
  icon,
}: {
  value: T;
  displayLabel?: string;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  icon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-[11px] tracking-[0.18em] uppercase text-white hover:text-[var(--gold)] transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
      >
        {icon}
        <span className="font-medium">{displayLabel || value}</span>
        <ChevronDown className="h-3 w-3 opacity-80" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 min-w-[210px] max-h-[300px] overflow-y-auto rounded-sm border border-[var(--gold)]/30 bg-[var(--wine-deep)] text-white shadow-2xl py-1">
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-xs hover:bg-[var(--gold)]/20 transition-colors ${
                o.value === value ? "text-[var(--gold)] font-semibold" : "text-white/90"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface HeaderProps {
  onSelectCategoryFilter?: (filterLabel: string, filterType?: string) => void;
}

export function Header({ onSelectCategoryFilter }: HeaderProps) {
  const { currency, setCurrency, lang, setLang, formatPrice } = useI18n();
  const { openConverter } = useCurrencyModal();
  const { count, setOpen: setCartOpen } = useCart();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Mobile accordion state
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);

  const menuHoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (id: string) => {
    if (menuHoverTimeout.current) clearTimeout(menuHoverTimeout.current);
    setActiveMenuId(id);
  };

  const handleMouseLeave = () => {
    menuHoverTimeout.current = setTimeout(() => {
      setActiveMenuId(null);
    }, 200);
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 100);

      if (currentScrollY > 120 && currentScrollY > lastScrollY && !activeMenuId) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeMenuId]);

  const handleNavClick = (label: string, type: string = "category") => {
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
    if (
      cleanLabel === "COLLECTIONS" ||
      cleanLabel === "BUDGET COLLECTIONS" ||
      cleanLabel === "NEW ARRIVALS" ||
      cleanLabel === "BEST SELLING"
    ) {
      window.location.href = "/collections";
      return;
    }
    if (cleanLabel === "CONTACT" || cleanLabel === "OUR STORY") {
      window.location.href = "/about";
      return;
    }

    // Default route to /shop with category filter parameter
    window.location.href = `/shop?category=${encodeURIComponent(label)}`;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out ${
        hidden ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      } ${
        scrolled || activeMenuId
          ? "bg-[var(--wine-deep)]/95 backdrop-blur-md border-b border-[var(--gold)]/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-white"
          : "bg-gradient-to-b from-black/75 via-black/30 to-transparent text-white border-b border-white/15 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
      }`}
      onMouseLeave={handleMouseLeave}
    >
      <AnnouncementBar />
      <div className="w-full">
        {/* Utility Row */}
        <div className="hidden md:block border-b border-white/10">
          <div className="container-boutique flex items-center justify-between py-2">
            <div className="text-[11px] tracking-[0.18em] uppercase text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-[var(--gold)] animate-pulse" />
              <span>Complimentary Shipping over {formatPrice(500)}</span>
            </div>
            <div className="flex items-center gap-5 text-white">
              <button
                type="button"
                onClick={() => openConverter({ from: currency, to: "INR", amount: 100 })}
                className="flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-white hover:text-[var(--gold)] transition-colors cursor-pointer"
                title="Live Currency Converter"
              >
                <ArrowRightLeft className="h-3 w-3 text-[var(--gold)]" />
                <span>Converter</span>
              </button>
              <Dropdown<LangCode>
                value={lang}
                onChange={setLang}
                icon={<Globe className="h-3 w-3" />}
                options={(Object.keys(LANGUAGES) as LangCode[]).map((k) => ({
                  value: k,
                  label: `${LANGUAGES[k].native}`,
                }))}
              />
              <Dropdown<CurrencyCode>
                value={currency}
                displayLabel={`${currency} ${CURRENCIES[currency]?.symbol || ""}`}
                onChange={setCurrency}
                options={(Object.keys(CURRENCIES) as CurrencyCode[]).map((k) => ({
                  value: k,
                  label: `${k} ${CURRENCIES[k].symbol} — ${CURRENCIES[k].label}`,
                }))}
              />
            </div>
          </div>
        </div>

        {/* Main Logo & Action Row */}
        <div className="container-boutique flex items-center justify-between gap-3 sm:gap-6 py-2.5 sm:py-3.5 md:py-5">
          <div className="flex items-center gap-2">
            <button
              className="md:!hidden -ml-2 p-2.5 touch-target text-white hover:text-[var(--gold)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] cursor-pointer"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center">
              <img
                src="/logo-light.png"
                alt="MUN Creations Logo"
                className="h-10 sm:h-12 md:h-16 w-auto object-contain transition-transform duration-300 hover:scale-105 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              />
            </Link>
          </div>

          <div className="flex items-center justify-end gap-1.5 sm:gap-3 md:gap-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            <button
              type="button"
              onClick={() => openConverter({ from: currency, to: "INR", amount: 100 })}
              aria-label="Open Currency Converter"
              title="Currency Converter"
              className="p-2 touch-target hover:text-[var(--gold)] transition-colors cursor-pointer"
            >
              <ArrowRightLeft className="h-5 w-5 md:h-[18px] md:w-[18px]" />
            </button>
            <Link
              to="/search"
              aria-label="Search collection"
              className="p-2 touch-target hover:text-[var(--gold)] transition-colors"
            >
              <Search className="h-5 w-5 md:h-[18px] md:w-[18px]" />
            </Link>
            <Link
              to="/account"
              aria-label="My Account"
              className="!hidden sm:!inline-flex p-2 touch-target hover:text-[var(--gold)] transition-colors"
            >
              <User className="h-5 w-5 md:h-[18px] md:w-[18px]" />
            </Link>
            <Link
              to="/account"
              aria-label="Wishlist"
              className="!hidden sm:!inline-flex p-2 touch-target hover:text-[var(--gold)] transition-colors"
            >
              <Heart className="h-5 w-5 md:h-[18px] md:w-[18px]" />
            </Link>
            <button
              aria-label="Shopping Bag"
              onClick={() => setCartOpen(true)}
              className="relative p-2 touch-target hover:text-[var(--gold)] transition-colors cursor-pointer"
            >
              <ShoppingBag className="h-5 w-5 md:h-[18px] md:w-[18px]" />
              {count > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-[var(--gold)] text-[var(--wine-deep)] text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Main Navigation Bar */}
        <nav className="hidden md:block border-t border-white/10 relative">
          <div className="container-boutique flex items-center justify-center gap-6 lg:gap-8 py-3 overflow-x-auto no-scrollbar">
            {MAIN_NAV_ITEMS.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.id)}
                className="relative py-1 shrink-0"
              >
                <button
                  onClick={() => handleNavClick(item.label, "nav")}
                  className={`text-[11px] tracking-[0.2em] uppercase font-semibold transition-all flex items-center gap-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] ${
                    activeMenuId === item.id || item.label === "Budget Collections"
                      ? "text-[var(--gold)] scale-105"
                      : "text-white hover:text-[var(--gold)]"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-300 ${
                        activeMenuId === item.id ? "rotate-180 text-[var(--gold)]" : "opacity-70"
                      }`}
                    />
                  )}
                </button>

                {/* KURTI Dropdown - positioned directly beneath Kurti item */}
                {activeMenuId === item.id && item.id === "kurti" && (
                  <div
                    className="absolute left-0 top-full mt-2 bg-[var(--wine-deep)]/98 backdrop-blur-xl border border-[var(--gold)]/30 rounded-sm shadow-2xl text-white py-4 px-6 min-w-[240px] z-50 animate-in fade-in slide-in-from-top-1"
                    onMouseEnter={() => handleMouseEnter("kurti")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] tracking-widest uppercase text-[var(--gold)] font-bold block pb-1 border-b border-white/10">
                        Kurti Categories
                      </span>
                      {KURTI_CATEGORIES.map((k) => (
                        <button
                          key={k.slug}
                          onClick={() => handleNavClick(k.name, "kurti")}
                          className="block w-full text-left text-xs py-1 text-white/80 hover:text-[var(--gold)] transition-colors"
                        >
                          {k.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* BLOUSES Dropdown - positioned directly beneath Blouses item */}
                {activeMenuId === item.id && item.id === "blouses" && (
                  <div
                    className="absolute left-0 top-full mt-2 bg-[var(--wine-deep)]/98 backdrop-blur-xl border border-[var(--gold)]/30 rounded-sm shadow-2xl text-white py-4 px-6 min-w-[240px] z-50 animate-in fade-in slide-in-from-top-1"
                    onMouseEnter={() => handleMouseEnter("blouses")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] tracking-widest uppercase text-[var(--gold)] font-bold block pb-1 border-b border-white/10">
                        Blouses & Couture
                      </span>
                      {BLOUSE_CATEGORIES.map((b) => (
                        <button
                          key={b.slug}
                          onClick={() => handleNavClick(b.name, "blouse")}
                          className="block w-full text-left text-xs py-1 text-white/80 hover:text-[var(--gold)] transition-colors"
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* COLLECTIONS Dropdown - centered beneath Collections item */}
                {activeMenuId === item.id && item.id === "collections" && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-[var(--wine-deep)]/98 backdrop-blur-xl border border-[var(--gold)]/30 rounded-sm shadow-2xl text-white py-6 px-8 min-w-[480px] z-50 animate-in fade-in slide-in-from-top-1"
                    onMouseEnter={() => handleMouseEnter("collections")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span className="text-[10px] tracking-widest uppercase text-[var(--gold)] font-bold block pb-2 mb-3 border-b border-white/10">
                      Merchandising Collections
                    </span>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                      {COLLECTION_HIERARCHY.map((c) => (
                        <button
                          key={c.slug}
                          onClick={() => handleNavClick(c.name, "collection")}
                          className="text-left text-xs py-1 text-white/80 hover:text-[var(--gold)] transition-colors font-medium flex items-center justify-between"
                        >
                          <span>{c.name}</span>
                          <ChevronRight className="h-3 w-3 text-[var(--gold)]/50" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Mega Menu Dropdown */}
          {/* SAREES Mega Menu (full-width banner) */}
          {activeMenuId === "sarees" && (
            <div
              className="absolute left-0 right-0 top-full bg-[var(--wine-deep)]/98 backdrop-blur-xl border-b border-[var(--gold)]/30 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-white py-8 px-6 transition-all duration-300 z-50 animate-in fade-in slide-in-from-top-2"
              onMouseEnter={() => handleMouseEnter("sarees")}
              onMouseLeave={handleMouseLeave}
            >
              <div className="container-boutique">
                <div className="mb-4 pb-3 border-b border-[var(--gold)]/20 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-serif tracking-[0.15em] text-[var(--gold)] uppercase font-semibold">
                      SAREES CATALOG (1,700+ WEAVES)
                    </h3>
                    <p className="text-xs text-white/70 italic mt-0.5">
                      Explore Banarasi, Kanjivaram, Paithani, Tussar, Jamdani, Organza, Chikankari & Bengal
                      Silks
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavClick("Sarees", "category")}
                    className="text-[11px] uppercase tracking-widest text-[var(--gold)] hover:text-white transition-colors flex items-center gap-1 font-medium"
                  >
                    <span>View Full Saree Catalog</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 py-2">
                  {EXPANDED_SAREE_TAXONOMY.map((fam) => (
                    <div key={fam.slug} className="space-y-2">
                      <button
                        onClick={() => handleNavClick(fam.title, "family")}
                        className="text-xs tracking-[0.16em] uppercase font-bold text-[var(--gold)] hover:underline flex items-center gap-1 text-left"
                      >
                        <span>{fam.title}</span>
                      </button>
                      <ul className="space-y-1 pl-2 border-l border-[var(--gold)]/20">
                        {fam.subcategories.map((sub) => (
                          <li key={sub.slug}>
                            <button
                              onClick={() => handleNavClick(sub.name, "subcategory")}
                              className="text-[11px] text-white/80 hover:text-[var(--gold)] transition-colors text-left font-light block py-0.5"
                            >
                              {sub.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Drawer Accordion */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[var(--wine-deep)] text-white flex flex-col animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/15 bg-black/30 shrink-0">
            <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center">
              <img
                src="/logo-light.png"
                alt="MUN Creations Logo"
                className="h-9 w-auto object-contain"
              />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="text-white hover:text-[var(--gold)] p-2 touch-target cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Quick Search Bar inside Mobile Menu */}
          <div className="px-4 py-3 border-b border-white/10 bg-black/10 shrink-0">
            <Link
              to="/search"
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center gap-2.5 bg-white/10 border border-white/20 rounded-sm px-3.5 py-2.5 text-xs text-white/80 hover:border-[var(--gold)] transition-colors"
            >
              <Search className="h-4 w-4 text-[var(--gold)]" />
              <span>Search sarees, fabrics, weaves...</span>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 divide-y divide-white/10">
            {MAIN_NAV_ITEMS.map((item) => {
              const isExpanded = expandedMobileCategory === item.id;

              return (
                <div key={item.id} className="pt-2">
                  <div className="flex items-center justify-between py-2.5">
                    <button
                      onClick={() => handleNavClick(item.label, "nav")}
                      className="text-sm font-semibold tracking-[0.18em] uppercase text-white hover:text-[var(--gold)] text-left flex-1"
                    >
                      {item.label}
                    </button>
                    {item.hasDropdown && (
                      <button
                        onClick={() => setExpandedMobileCategory(isExpanded ? null : item.id)}
                        className="p-2 touch-target text-[var(--gold)] cursor-pointer"
                        aria-label={`Toggle ${item.label} subcategories`}
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Expanded Mobile Item */}
                  {isExpanded && item.id === "sarees" && (
                    <div className="pl-4 py-2 space-y-3 border-l-2 border-[var(--gold)]/40 ml-1 mb-2">
                      {EXPANDED_SAREE_TAXONOMY.map((fam) => (
                        <div key={fam.slug} className="space-y-1">
                          <button
                            onClick={() => handleNavClick(fam.title, "family")}
                            className="text-xs font-bold text-[var(--gold)] hover:underline uppercase block text-left py-1"
                          >
                            {fam.title}
                          </button>
                          <div className="pl-2 space-y-1">
                            {fam.subcategories.map((sub) => (
                              <button
                                key={sub.slug}
                                onClick={() => handleNavClick(sub.name, "subcategory")}
                                className="block text-xs text-white/80 hover:text-[var(--gold)] text-left font-light py-1"
                              >
                                {sub.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {isExpanded && item.id === "kurti" && (
                    <div className="pl-4 py-2 space-y-1 border-l-2 border-[var(--gold)]/40 ml-1 mb-2">
                      {KURTI_CATEGORIES.map((k) => (
                        <button
                          key={k.slug}
                          onClick={() => handleNavClick(k.name, "kurti")}
                          className="block text-xs text-white/80 hover:text-[var(--gold)] text-left py-1.5"
                        >
                          {k.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {isExpanded && item.id === "blouses" && (
                    <div className="pl-4 py-2 space-y-1 border-l-2 border-[var(--gold)]/40 ml-1 mb-2">
                      {BLOUSE_CATEGORIES.map((b) => (
                        <button
                          key={b.slug}
                          onClick={() => handleNavClick(b.name, "blouse")}
                          className="block text-xs text-white/80 hover:text-[var(--gold)] text-left py-1.5"
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {isExpanded && item.id === "collections" && (
                    <div className="pl-4 py-2 space-y-1 border-l-2 border-[var(--gold)]/40 ml-1 mb-2">
                      {COLLECTION_HIERARCHY.map((c) => (
                        <button
                          key={c.slug}
                          onClick={() => handleNavClick(c.name, "collection")}
                          className="block text-xs text-white/80 hover:text-[var(--gold)] text-left py-1.5"
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Quick Direct User Links */}
            <div className="pt-4 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openConverter({ from: currency, to: "INR", amount: 100 });
                }}
                className="w-full flex items-center gap-2.5 text-xs text-white/90 hover:text-[var(--gold)] py-2 font-medium uppercase tracking-wider text-left cursor-pointer"
              >
                <ArrowRightLeft className="h-4 w-4 text-[var(--gold)]" />
                <span>Live Currency Converter</span>
              </button>
              <Link
                to="/account"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 text-xs text-white/90 hover:text-[var(--gold)] py-2 font-medium uppercase tracking-wider"
              >
                <User className="h-4 w-4 text-[var(--gold)]" />
                <span>My Account & Orders</span>
              </Link>
              <Link
                to="/account"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 text-xs text-white/90 hover:text-[var(--gold)] py-2 font-medium uppercase tracking-wider"
              >
                <Heart className="h-4 w-4 text-[var(--gold)]" />
                <span>Wishlist Items</span>
              </Link>
            </div>

            <div className="pt-5 pb-6 flex items-center justify-between border-t border-white/15">
              <Dropdown<LangCode>
                value={lang}
                onChange={setLang}
                icon={<Globe className="h-3.5 w-3.5" />}
                options={(Object.keys(LANGUAGES) as LangCode[]).map((k) => ({
                  value: k,
                  label: LANGUAGES[k].native,
                }))}
              />
              <Dropdown<CurrencyCode>
                value={currency}
                displayLabel={`${currency} ${CURRENCIES[currency]?.symbol || ""}`}
                onChange={setCurrency}
                options={(Object.keys(CURRENCIES) as CurrencyCode[]).map((k) => ({
                  value: k,
                  label: `${k} ${CURRENCIES[k].symbol} — ${CURRENCIES[k].label}`,
                }))}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
