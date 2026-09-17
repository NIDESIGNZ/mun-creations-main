import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { useSectionContent } from "@/lib/content-client";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions | Mun Creations Sarees & Orders" },
      {
        name: "description",
        content:
          "Find answers to common questions regarding Mun Creations sarees, online orders, international shipping, payments and customer support.",
      },
      { property: "og:title", content: "Frequently Asked Questions | Mun Creations Sarees & Orders" },
      {
        property: "og:description",
        content:
          "Find answers to common questions regarding Mun Creations sarees, online orders, international shipping, payments and customer support.",
      },
    ],
  }),
  component: FaqsPage,
});

function FaqsPage() {
  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 pb-16 md:pb-24 bg-gradient-to-b from-secondary/30 via-background to-secondary/20">
            <FaqsContent />
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </I18nProvider>
  );
}

function FaqsContent() {
  const { data: faqs = [] } = useSectionContent("faqs");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="container-boutique max-w-3xl space-y-8">
      <div className="bg-white p-8 md:p-12 rounded-sm border border-border shadow-xs text-center space-y-3">
        <div className="eyebrow text-[var(--gold)]">Everything You Need to Know</div>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[var(--wine-deep)]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Common questions regarding our saree collections, online orders, international shipping, and customer service.
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-sm border border-border shadow-xs space-y-3 divide-y divide-border/60">
        {faqs.map((item, idx) => {
          const isOpen = openIdx === idx;
          const isWhatsApp = item.answer.toLowerCase().includes("whatsapp");

          return (
            <div key={item.id || idx} className="pt-4 first:pt-0">
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left flex items-center justify-between gap-4 py-2 font-serif text-base md:text-lg font-bold text-[var(--wine-deep)] hover:text-[var(--wine)] transition-colors cursor-pointer"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-[var(--wine)]" : "text-muted-foreground"
                  }`}
                />
              </button>
              {isOpen && (
                <div className="text-xs md:text-sm text-muted-foreground leading-relaxed pt-2 pb-2 animate-in fade-in space-y-2">
                  <p>{item.answer}</p>
                  {isWhatsApp && (
                    <div>
                      <a
                        href="https://wa.me/919874572846?text=Hello%20Mun%20Creations%2C%20I%20have%20an%20enquiry."
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>Chat directly with Customer Service (+91 98745 72846) &rarr;</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
