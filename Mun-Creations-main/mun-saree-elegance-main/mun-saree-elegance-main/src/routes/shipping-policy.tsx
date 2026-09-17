import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { useSectionContent } from "@/lib/content-client";
import { Truck, Globe, AlertCircle, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({
    meta: [
      { title: "Shipping Information | Mun Creations" },
      {
        name: "description",
        content:
          "Learn about Mun Creations shipping, order processing and worldwide delivery options for sarees and Indian ethnic wear.",
      },
      { property: "og:title", content: "Shipping Information | Mun Creations" },
      {
        property: "og:description",
        content:
          "Learn about Mun Creations shipping, order processing and worldwide delivery options for sarees and Indian ethnic wear.",
      },
    ],
  }),
  component: ShippingPolicyPage,
});

function ShippingPolicyPage() {
  const { data: shipping } = useSectionContent("shipping");

  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 pb-16 md:pb-24 bg-gradient-to-b from-secondary/30 via-background to-secondary/20">
            <div className="container-boutique max-w-3xl space-y-8">
              {/* Main Policy Card */}
              <div className="bg-white p-8 md:p-12 rounded-sm border border-border shadow-xs space-y-6">
                <div className="border-b border-border/80 pb-4 space-y-1">
                  <div className="eyebrow text-[var(--gold)]">
                    {shipping.subtitle || "Bringing Indian Elegance to You"}
                  </div>
                  <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--wine-deep)]">
                    {shipping.title || "Shipping & Delivery"}
                  </h1>
                </div>

                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {shipping.intro}
                </p>

                {/* Section: Order Processing */}
                <div className="p-5 rounded-sm bg-secondary/30 border border-border/70 space-y-2">
                  <div className="flex items-center gap-2 font-serif text-lg font-bold text-[var(--wine-deep)]">
                    <Truck className="h-4 w-4 text-[var(--wine)]" />
                    <span>{shipping.orderProcessingTitle || "Order Processing"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {shipping.orderProcessingBody}
                  </p>
                </div>

                {/* Section: International Shipping */}
                <div className="p-5 rounded-sm bg-secondary/30 border border-border/70 space-y-2">
                  <div className="flex items-center gap-2 font-serif text-lg font-bold text-[var(--wine-deep)]">
                    <Globe className="h-4 w-4 text-[var(--wine)]" />
                    <span>{shipping.internationalShippingTitle || "International Shipping"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {shipping.internationalShippingBody}
                  </p>
                </div>

                {/* Section: Important & WhatsApp Support */}
                <div className="p-5 rounded-sm bg-amber-50/60 border border-amber-200/80 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-900">
                    <AlertCircle className="h-4 w-4 text-amber-700" />
                    <span>{shipping.importantTitle || "Important"}</span>
                  </div>
                  <p className="text-xs text-amber-950/80 leading-relaxed">
                    {shipping.importantBody}
                  </p>
                  <div className="pt-2">
                    <a
                      href={shipping.whatsappUrl || "https://wa.me/919874572846?text=Hello%20Mun%20Creations%2C%20I%20have%20a%20question%20regarding%20shipping%20and%20delivery."}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded text-xs transition-colors shadow-xs"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Chat on WhatsApp ({shipping.whatsappNumber || "+91 98745 72846"})</span>
                    </a>
                  </div>
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
