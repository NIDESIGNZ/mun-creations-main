import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { Truck, ShieldCheck, Globe } from "lucide-react";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({
    meta: [{ title: "Worldwide Shipping & Dispatch Policy — Mun Creations" }],
  }),
  component: ShippingPolicyPage,
});

function ShippingPolicyPage() {
  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20">
            <div className="container-boutique max-w-3xl space-y-6">
              <div className="bg-white p-8 md:p-12 rounded-sm border border-border shadow-md space-y-4">
                <div className="eyebrow text-[var(--gold)]">Delivery Terms</div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--wine-deep)]">Worldwide Shipping Policy</h1>
                <div className="text-xs text-muted-foreground leading-relaxed space-y-4 pt-2">
                  <p><strong>Domestic Shipping (India):</strong> We offer complimentary insured air shipping across all serviceable pincodes in India. Standard delivery takes 2 to 4 business days.</p>
                  <p><strong>International Shipping:</strong> We ship to over 150 countries via DHL Express & FedEx. International orders above $500 USD qualify for complimentary express air dispatch.</p>
                  <p><strong>Customs & Duties:</strong> All import duties, local taxes, and clearance fees are handled transparently. Tracking links (AWB) are dispatched via email and WhatsApp upon order dispatch.</p>
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
