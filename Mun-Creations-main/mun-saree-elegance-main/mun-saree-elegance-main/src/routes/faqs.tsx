import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions — Shipping, Care & Returns | Mun Creations" },
      {
        name: "description",
        content: "Find answers regarding handloom silk mark certification, shipping timelines, returns, and care guidance.",
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
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20">
            <FaqsContent />
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </I18nProvider>
  );
}

const FAQS_DATA = [
  {
    q: "Are all products 100% authentic pure silk with Silk Mark certification?",
    a: "Yes. Every pure Katan Banarasi, Kanjivaram, and Tussar silk saree from Ethnic Boutique comes tagged with official Silk Mark Certification issuing government authority approval.",
  },
  {
    q: "What is your international shipping timeline?",
    a: "We ship worldwide via DHL Express & FedEx. Orders are dispatched within 24-48 hours and arrive in 3-5 business days across USA, UK, Canada, UAE, and Australia.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept 100% prepaid secure payments via Razorpay (UPI, NetBanking, GPay, PhonePe, Paytm), Stripe (Global Credit/Debit Cards), PayPal Express, and Direct Visa/Mastercard.",
  },
  {
    q: "What is your store return policy?",
    a: "All sales are final. Each handwoven saree undergoes 3-point quality inspection prior to insured dispatch.",
  },
  {
    q: "How should I store and maintain pure Banarasi & Kanjivaram sarees?",
    a: "Dry clean only. Store sarees wrapped in a soft white muslin or cotton cloth. Refold sarees every 3 months along different fold lines to prevent zari creasing.",
  },
];

function FaqsContent() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="container-boutique max-w-3xl space-y-8">
      <div className="bg-white p-8 md:p-12 rounded-sm border border-border shadow-md text-center space-y-4">
        <div className="eyebrow text-[var(--gold)]">Customer Service & Assistance</div>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[var(--wine-deep)]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Everything you need to know about our handloom heritage sarees, international delivery, and silk care.
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-sm border border-border shadow-sm space-y-4">
        {FAQS_DATA.map((item, idx) => (
          <div key={idx} className="border-b border-border/70 last:border-0 pb-4">
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full text-left flex items-center justify-between gap-4 py-2 font-serif text-lg font-bold text-[var(--wine-deep)] hover:text-[var(--wine)] transition-colors"
            >
              <span>{item.q}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 transition-transform ${openIdx === idx ? "rotate-180 text-[var(--wine)]" : "text-muted-foreground"}`}
              />
            </button>
            {openIdx === idx && (
              <div className="text-xs text-muted-foreground leading-relaxed pt-2 animate-in fade-in">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
