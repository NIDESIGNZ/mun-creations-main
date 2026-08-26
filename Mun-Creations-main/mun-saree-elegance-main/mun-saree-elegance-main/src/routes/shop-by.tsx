import { createFileRoute, Link } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { FABRIC_FILTERS, COLOR_FILTERS, PRICE_TIERS } from "@/lib/catalog";
import { Grid, Palette, DollarSign, Tag, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/shop-by")({
  head: () => ({
    meta: [
      { title: "Shop Sarees By Fabric, Colour, Occasion & Price — Mun Creations" },
      {
        name: "description",
        content: "Discover sarees by Fabric (Silk, Tussar, Organza, Cotton), Colour (Red, Pink, Gold), Occasion, and Price range.",
      },
    ],
  }),
  component: ShopByPage,
});

function ShopByPage() {
  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20">
            <ShopByContent />
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </I18nProvider>
  );
}

function ShopByContent() {
  return (
    <div className="container-boutique space-y-12">
      <div className="bg-white p-8 md:p-12 rounded-sm border border-border shadow-md text-center space-y-4">
        <div className="eyebrow text-[var(--gold)]">Taxonomy Navigation Hub</div>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[var(--wine-deep)] max-w-3xl mx-auto">
          Shop By Fabric, Colour, Occasion & Price
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto">
          Filter through our master artisan database using custom textile attributes.
        </p>
      </div>

      {/* 1. Shop By Fabric */}
      <div className="bg-white p-6 md:p-8 rounded-sm border border-border shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Grid className="h-5 w-5 text-[var(--wine)]" />
          <h2 className="font-serif text-2xl font-bold text-[var(--wine-deep)]">1. Shop By Fabric</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {FABRIC_FILTERS.map((fab) => (
            <Link
              key={fab}
              to="/shop"
              search={{ fabric: fab }}
              className="p-4 bg-secondary/30 hover:bg-[var(--wine)] hover:text-white rounded-sm border border-border/70 text-center text-xs font-bold transition-all shadow-xs"
            >
              {fab} Silk
            </Link>
          ))}
        </div>
      </div>

      {/* 2. Shop By Colour */}
      <div className="bg-white p-6 md:p-8 rounded-sm border border-border shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Palette className="h-5 w-5 text-[var(--wine)]" />
          <h2 className="font-serif text-2xl font-bold text-[var(--wine-deep)]">2. Shop By Colour</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {COLOR_FILTERS.map((col) => (
            <Link
              key={col.name}
              to="/shop"
              search={{ color: col.name }}
              className="p-3 bg-secondary/30 hover:bg-secondary/80 rounded-sm border border-border flex items-center gap-2 text-xs font-bold transition-all"
            >
              <span className="h-5 w-5 rounded-full border border-border" style={{ backgroundColor: col.hex }} />
              <span>{col.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Shop By Price Tiers */}
      <div className="bg-white p-6 md:p-8 rounded-sm border border-border shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <DollarSign className="h-5 w-5 text-[var(--wine)]" />
          <h2 className="font-serif text-2xl font-bold text-[var(--wine-deep)]">3. Shop By Price Range</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRICE_TIERS.map((pt) => (
            <Link
              key={pt.label}
              to="/shop"
              search={{ price: pt.label }}
              className="p-5 bg-secondary/20 hover:bg-[var(--wine)] hover:text-white rounded-sm border border-border space-y-2 transition-all shadow-xs group"
            >
              <div className="font-serif text-xl font-bold text-[var(--wine-deep)] group-hover:text-white">{pt.label}</div>
              <div className="text-xs text-muted-foreground group-hover:text-white/80 font-mono">
                ${pt.min} – ${pt.max}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
