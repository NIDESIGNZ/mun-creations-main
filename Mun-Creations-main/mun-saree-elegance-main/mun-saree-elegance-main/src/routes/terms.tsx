import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { useSectionContent } from "@/lib/content-client";
import { FileText, CheckCircle2, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Mun Creations" },
      {
        name: "description",
        content:
          "Review the terms and conditions governing the use of the Mun Creations website, orders, products and services.",
      },
      { property: "og:title", content: "Terms & Conditions | Mun Creations" },
      {
        property: "og:description",
        content:
          "Review the terms and conditions governing the use of the Mun Creations website, orders, products and services.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const { data: terms } = useSectionContent("terms");

  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 pb-16 md:pb-24 bg-gradient-to-b from-secondary/30 via-background to-secondary/20">
            <div className="container-boutique max-w-3xl space-y-8">
              <div className="bg-white p-8 md:p-12 rounded-sm border border-border shadow-xs space-y-6">
                <div className="border-b border-border/80 pb-4 space-y-1">
                  <div className="eyebrow text-[var(--gold)]">Legal Agreement</div>
                  <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--wine-deep)]">
                    {terms.title || "Terms & Conditions"}
                  </h1>
                </div>

                <div className="space-y-3.5">
                  {(terms.points || []).map((point, idx) => {
                    const isWhatsApp = point.toLowerCase().includes("whatsapp");

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-sm bg-secondary/30 border border-border/70 flex items-start gap-3 text-xs md:text-sm text-foreground/85 leading-relaxed"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[var(--wine)] shrink-0 mt-0.5" />
                        <div className="space-y-2">
                          <p>{point}</p>
                          {isWhatsApp && (
                            <div>
                              <a
                                href="https://wa.me/919874572846?text=Hello%20Mun%20Creations%2C%20I%20have%20an%20enquiry."
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:underline text-xs"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                                <span>Contact WhatsApp Customer Service (+91 98745 72846) &rarr;</span>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
