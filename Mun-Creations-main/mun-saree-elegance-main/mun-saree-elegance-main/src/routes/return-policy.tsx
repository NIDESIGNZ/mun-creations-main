import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/return-policy")({
  head: () => ({
    meta: [{ title: "Final Sale & No Return Policy — Mun Creations" }],
  }),
  component: ReturnPolicyPage,
});

function ReturnPolicyPage() {
  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20">
            <div className="container-boutique max-w-3xl space-y-6">
              <div className="bg-white p-8 md:p-12 rounded-sm border border-border shadow-md space-y-4">
                <div className="eyebrow text-[var(--gold)]">Store Policy</div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--wine-deep)]">
                  Final Sale & No Return Policy
                </h1>
                <div className="text-xs text-muted-foreground leading-relaxed space-y-4 pt-2">
                  <p>
                    <strong>All Sales Are Final:</strong> Due to the handcrafted, limited artisan
                    nature of our handwoven silk sarees, kurtis, and designer blouses, all purchases
                    made on Mun Creations / Ethnic Boutique are final sale. We do not accept returns
                    or offer cash refunds once an order is shipped.
                  </p>
                  <p>
                    <strong>3-Point Handloom Inspection:</strong> Every saree undergoes rigorous
                    quality checking, weaver tag authentication, and zari inspection prior to
                    insured dispatch.
                  </p>
                  <p>
                    <strong>Prepaid Orders Only:</strong> All orders are fulfilled on a 100% prepaid
                    basis via our secure payment gateway (Razorpay UPI, Cards, and NetBanking).
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
