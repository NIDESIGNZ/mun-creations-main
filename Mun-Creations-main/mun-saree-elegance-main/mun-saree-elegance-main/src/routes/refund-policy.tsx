import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [{ title: "Prepaid Refund & Cancellation Terms — Mun Creations" }],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20">
            <div className="container-boutique max-w-3xl space-y-6">
              <div className="bg-white p-8 md:p-12 rounded-sm border border-border shadow-md space-y-4">
                <div className="eyebrow text-[var(--gold)]">Financial Terms</div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--wine-deep)]">
                  Prepaid Refund Policy
                </h1>
                <div className="text-xs text-muted-foreground leading-relaxed space-y-4 pt-2">
                  <p>
                    <strong>Order Cancellations Prior to Dispatch:</strong> If you request an order
                    cancellation before your saree is dispatched from our Varanasi studio, a 100%
                    full refund will be processed back to your original payment account via Razorpay
                    within 3-5 business days.
                  </p>
                  <p>
                    <strong>Dispatched Orders:</strong> Once an order is handed over to our courier
                    partner (Shiprocket Air / DHL Express), all sales are final and cannot be
                    cancelled or returned.
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
