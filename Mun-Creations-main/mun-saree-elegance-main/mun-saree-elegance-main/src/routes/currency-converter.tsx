import { createFileRoute, Link } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { CurrencyConverter } from "@/components/site/currency-converter/CurrencyConverter";
import {
  Globe2,
  ShieldCheck,
  CreditCard,
  Truck,
  Sparkles,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/currency-converter")({
  head: () => ({
    meta: [
      {
        title: "Live Currency Converter — Real-Time Exchange Rates | Mun Creations",
      },
      {
        name: "description",
        content:
          "Convert live foreign exchange rates for Indian Sarees, Bridal Couture and Ethnic Wear. Powered by ExchangeRate-API with live global currency updates.",
      },
    ],
  }),
  component: CurrencyConverterPage,
});

function CurrencyConverterPage() {
  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />

          <main className="flex-1 pt-28 sm:pt-36 md:pt-44 pb-14 sm:pb-20 bg-secondary/20">
            <div className="container-boutique max-w-5xl space-y-8">
              {/* Breadcrumbs */}
              <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
                <ol className="flex items-center gap-2">
                  <li>
                    <Link to="/" className="hover:text-[var(--gold)] transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>/</li>
                  <li className="text-[var(--wine-deep)] font-semibold">Live Currency Converter</li>
                </ol>
              </nav>

              {/* Page Hero Header */}
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--gold)]/15 border border-[var(--gold)]/30 text-[var(--wine-deep)] text-xs font-semibold uppercase tracking-widest">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--gold)]" />
                  <span>Real-Time Foreign Exchange Rates</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--wine-deep)] tracking-tight">
                  Live Global Currency Converter
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Convert international currencies instantly at official live interbank rates. All
                  prices for our handcrafted sarees and couture can be viewed and purchased in your
                  local currency.
                </p>
              </div>

              {/* Interactive Currency Converter Component */}
              <div className="max-w-4xl mx-auto">
                <CurrencyConverter />
              </div>

              {/* Benefits Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto pt-6">
                <div className="bg-white p-5 rounded-xl border border-border shadow-xs text-center space-y-2">
                  <div className="h-10 w-10 mx-auto rounded-full bg-[var(--gold)]/15 flex items-center justify-center text-[var(--gold)]">
                    <Globe2 className="h-5 w-5" />
                  </div>
                  <h2 className="font-serif text-sm font-bold text-[var(--wine-deep)]">
                    Official Live Rates
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Direct integration with ExchangeRate-API ensuring real-time global accuracy.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-border shadow-xs text-center space-y-2">
                  <div className="h-10 w-10 mx-auto rounded-full bg-[var(--gold)]/15 flex items-center justify-center text-[var(--gold)]">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h2 className="font-serif text-sm font-bold text-[var(--wine-deep)]">
                    160+ Currencies
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Shop seamlessly with USD, EUR, GBP, AED, CAD, AUD, SGD and many more.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-border shadow-xs text-center space-y-2">
                  <div className="h-10 w-10 mx-auto rounded-full bg-[var(--gold)]/15 flex items-center justify-center text-[var(--gold)]">
                    <Truck className="h-5 w-5" />
                  </div>
                  <h2 className="font-serif text-sm font-bold text-[var(--wine-deep)]">
                    Worldwide Shipping
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Insured express door-to-door delivery across 42+ countries with live tracking.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-border shadow-xs text-center space-y-2">
                  <div className="h-10 w-10 mx-auto rounded-full bg-[var(--gold)]/15 flex items-center justify-center text-[var(--gold)]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h2 className="font-serif text-sm font-bold text-[var(--wine-deep)]">
                    Zero Surcharges
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Transparent checkout pricing with no unexpected hidden markups or fees.
                  </p>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl border border-border shadow-sm max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <HelpCircle className="h-6 w-6 text-[var(--gold)]" />
                  <div>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[var(--wine-deep)]">
                      Frequently Asked Questions
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Everything you need to know about international currency conversion and
                      checkout
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm divide-y divide-border">
                  <div className="pt-3 first:pt-0 space-y-1">
                    <h3 className="font-bold text-foreground">
                      Which exchange rate is applied during checkout?
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We utilize live interbank exchange rates updated regularly via
                      ExchangeRate-API. When you finalize your transaction, your bank or card issuer
                      will convert the total at the exact live rate applicable at the time of
                      authorization.
                    </p>
                  </div>

                  <div className="pt-3 space-y-1">
                    <h3 className="font-bold text-foreground">
                      Can I pay using my domestic bank or payment method?
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Yes! We support all major international cards (Visa, MasterCard, American
                      Express, Diners Club), PayPal, Apple Pay, Google Pay, as well as Indian UPI,
                      RuPay, and NetBanking.
                    </p>
                  </div>

                  <div className="pt-3 space-y-1">
                    <h3 className="font-bold text-foreground">
                      Are customs duties or import taxes included?
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      For most major destinations (US, UK, UAE, Australia, Canada, EU), orders below
                      standard thresholds enter duty-free. Any applicable regional customs fees are
                      handled efficiently with our international courier partners (DHL Express /
                      FedEx).
                    </p>
                  </div>

                  <div className="pt-3 space-y-1">
                    <h3 className="font-bold text-foreground">
                      How often are the currency conversion rates updated?
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Exchange rates are refreshed continuously from global central banks and market
                      feeds. Our server caches rates with a 15-minute validity window to ensure
                      optimal performance and immediate accuracy.
                    </p>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <Link
                    to="/sarees"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--wine-deep)] text-white hover:bg-[var(--wine)] font-semibold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    <span>Browse Handcrafted Saree Catalog</span>
                    <TrendingUp className="h-4 w-4 text-[var(--gold)]" />
                  </Link>
                </div>
              </div>
            </div>
          </main>

          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </I18nProvider>
  );
}
