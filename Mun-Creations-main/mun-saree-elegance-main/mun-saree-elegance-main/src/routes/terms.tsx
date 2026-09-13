import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [{ title: "Terms & Conditions — Mun Creations" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20">
            <div className="container-boutique max-w-3xl space-y-6">
              <div className="bg-white p-8 md:p-12 rounded-sm border border-border shadow-md space-y-4">
                <div className="eyebrow text-[var(--gold)]">Legal Agreement</div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--wine-deep)]">
                  Terms & Conditions
                </h1>
                <div className="text-xs text-muted-foreground leading-relaxed space-y-4 pt-2">
                  <p>
                    Welcome to Mun Creations & Ethnic Boutique. By accessing our platform,
                    purchasing handwoven sarees, or using our services, you agree to comply with
                    these terms.
                  </p>
                  <p>
                    Handcrafted Notice: As our sarees are handwoven on pit looms, minor variations
                    in slubs, weave texture, or motif alignments are authentic characteristics of
                    genuine handloom art.
                  </p>
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
