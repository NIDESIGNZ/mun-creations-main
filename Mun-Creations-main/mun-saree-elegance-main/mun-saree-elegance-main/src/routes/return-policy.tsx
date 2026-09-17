import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { useSectionContent } from "@/lib/content-client";
import { MessageCircle, HelpCircle, FileText } from "lucide-react";

export const Route = createFileRoute("/return-policy")({
  head: () => ({
    meta: [
      { title: "Returns & Customer Service | Mun Creations" },
      {
        name: "description",
        content:
          "Need assistance with your Mun Creations order or return? Contact our Customer Service team directly through WhatsApp for assistance.",
      },
      { property: "og:title", content: "Returns & Customer Service | Mun Creations" },
      {
        property: "og:description",
        content:
          "Need assistance with your Mun Creations order or return? Contact our Customer Service team directly through WhatsApp for assistance.",
      },
    ],
  }),
  component: ReturnPolicyPage,
});

function ReturnPolicyPage() {
  const { data: returns } = useSectionContent("returns");

  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 pb-16 md:pb-24 bg-gradient-to-b from-secondary/30 via-background to-secondary/20">
            <div className="container-boutique max-w-2xl space-y-8">
              <div className="bg-white p-8 md:p-12 rounded-sm border border-border shadow-xs text-center space-y-6">
                <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                  <MessageCircle className="h-7 w-7" />
                </div>

                <div className="space-y-1">
                  <div className="eyebrow text-[var(--gold)]">
                    {returns.subtitle || "Need Help With Your Order?"}
                  </div>
                  <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--wine-deep)]">
                    {returns.title || "Returns & Customer Service"}
                  </h1>
                </div>

                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
                  {returns.body}
                </p>

                <div className="pt-2">
                  <a
                    href={returns.whatsappUrl || "https://wa.me/919874572846?text=Hello%20Mun%20Creations%2C%20I%20need%20assistance%20with%20my%20order%20or%20return."}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded text-xs uppercase tracking-wider transition-colors shadow-md hover:scale-105 transform duration-150"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{returns.buttonText || "Contact Customer Service on WhatsApp"}</span>
                  </a>
                </div>

                <div className="p-4 rounded bg-secondary/30 border border-border/70 text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <HelpCircle className="h-4 w-4 text-[var(--wine)] shrink-0" />
                  <span>{returns.note || "For faster assistance, please keep your order number available when contacting us."}</span>
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
