import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { useSectionContent } from "@/lib/content-client";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Mun Creations" },
      {
        name: "description",
        content:
          "Mun Creations respects your privacy and is committed to protecting your personal information. Read our complete privacy policy.",
      },
      { property: "og:title", content: "Privacy Policy | Mun Creations" },
      {
        property: "og:description",
        content:
          "Mun Creations respects your privacy and is committed to protecting your personal information. Read our complete privacy policy.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  const { data: privacy } = useSectionContent("privacy");

  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 pb-16 md:pb-24 bg-gradient-to-b from-secondary/30 via-background to-secondary/20">
            <div className="container-boutique max-w-3xl space-y-8">
              <div className="bg-white p-8 md:p-12 rounded-sm border border-border shadow-xs space-y-6">
                <div className="border-b border-border/80 pb-4 space-y-1">
                  <div className="eyebrow text-[var(--gold)]">
                    {privacy.subtitle || "Your Privacy Matters"}
                  </div>
                  <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--wine-deep)]">
                    {privacy.title || "Privacy Policy"}
                  </h1>
                </div>

                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {privacy.intro}
                </p>

                {/* Collection Points */}
                <div className="p-5 rounded-sm bg-secondary/30 border border-border/70 space-y-2">
                  <div className="font-semibold text-xs text-foreground uppercase tracking-wider">
                    {privacy.collectionIntro || "Information may be collected when you:"}
                  </div>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {(privacy.collectionPoints || []).map((pt) => (
                      <li key={pt} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[var(--wine)] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Types Points */}
                <div className="p-5 rounded-sm bg-secondary/30 border border-border/70 space-y-2">
                  <div className="font-semibold text-xs text-foreground uppercase tracking-wider">
                    {privacy.typesIntro || "Information may include:"}
                  </div>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {(privacy.typesPoints || []).map((pt) => (
                      <li key={pt} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[var(--gold)] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Payment note */}
                <div className="p-4 rounded-sm bg-amber-50/60 border border-amber-200/80 text-xs text-amber-950/80 leading-relaxed">
                  <span className="font-bold">Payment Security: </span>
                  <span>{privacy.paymentNote}</span>
                </div>

                {/* Usage Points */}
                <div className="p-5 rounded-sm bg-secondary/30 border border-border/70 space-y-2">
                  <div className="font-semibold text-xs text-foreground uppercase tracking-wider">
                    {privacy.usageIntro || "Your information may be used to:"}
                  </div>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {(privacy.usagePoints || []).map((pt) => (
                      <li key={pt} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
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
