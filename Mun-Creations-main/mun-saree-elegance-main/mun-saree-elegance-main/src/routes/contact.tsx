import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Send,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import { useSectionContent } from "@/lib/content-client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Mun Creations | Saree & Ethnic Wear Customer Support" },
      {
        name: "description",
        content:
          "Contact Mun Creations for product enquiries, order assistance, saree information and customer support through WhatsApp and online channels.",
      },
      { property: "og:title", content: "Contact Mun Creations | Saree & Ethnic Wear Customer Support" },
      {
        property: "og:description",
        content:
          "Contact Mun Creations for product enquiries, order assistance, saree information and customer support through WhatsApp and online channels.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20">
            <ContactContent />
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </I18nProvider>
  );
}

function ContactContent() {
  const { data: contactCms } = useSectionContent("contact");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "Bridal Consultation",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappNumber = contactCms.whatsappNumber || "+91 98745 72846";
  const whatsappUrl =
    contactCms.whatsappUrl || "https://wa.me/919874572846?text=Hello%20Mun%20Creations%2C%20I%20have%20an%20enquiry.";

  return (
    <div className="container-boutique space-y-10 sm:space-y-14">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-12 rounded-sm border border-border shadow-xs text-center space-y-3">
        <div className="eyebrow flex items-center justify-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[var(--gold)]" />
          <span>{contactCms.subtitle || "We're Here to Help"}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--wine-deep)]">
          {contactCms.title || "Contact Mun Creations"}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          {contactCms.body ||
            "Have a question about a saree, your order, shipping or our collections? Our Customer Service team is available to assist you."}
        </p>
      </div>

      {/* Main Grid: Contact Details & Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-sm border border-border space-y-6 shadow-xs">
            <h2 className="font-serif text-xl font-bold text-[var(--wine-deep)] pb-3 border-b border-border">
              Direct Channels
            </h2>

            <div className="space-y-5 text-xs">
              <div className="flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-foreground">WhatsApp Customer Support</div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-bold hover:underline font-mono"
                  >
                    {whatsappNumber} (Direct Chat)
                  </a>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    Fastest assistance for orders, drapes & product questions
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-full bg-[var(--wine)]/10 text-[var(--wine)] flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-foreground">Email Support</div>
                  <a href="mailto:care@muncreation.com" className="text-muted-foreground hover:text-[var(--wine)]">
                    care@muncreation.com
                  </a>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Response within 12 business hours</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-full bg-[var(--wine)]/10 text-[var(--wine)] flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-foreground">Telephone & Concierge</div>
                  <a href="tel:+919874572846" className="text-muted-foreground hover:text-[var(--wine)] font-mono">
                    {whatsappNumber}
                  </a>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Mon–Sat: 10:00 AM – 7:00 PM IST</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enquiry Guidance Cards (Specification 13) */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-sm border border-border space-y-1.5 shadow-xs">
              <div className="font-serif font-bold text-sm text-[var(--wine-deep)]">
                {contactCms.productEnquiriesTitle || "Product Enquiries"}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {contactCms.productEnquiriesBody ||
                  "For product-related enquiries, please mention the product name or SKU when contacting us."}
              </p>
            </div>

            <div className="bg-white p-5 rounded-sm border border-border space-y-1.5 shadow-xs">
              <div className="font-serif font-bold text-sm text-[var(--wine-deep)]">
                {contactCms.orderAssistanceTitle || "Order Assistance"}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {contactCms.orderAssistanceBody ||
                  "For order-related assistance, please provide your order number so our team can locate your order quickly."}
              </p>
            </div>
          </div>

          <div className="bg-[var(--wine-deep)] text-white p-6 rounded-sm space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-[var(--gold)] text-xs uppercase font-bold tracking-widest">
              <ShieldCheck className="h-4 w-4" />
              <span>Silk Mark Certified Guarantee</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed font-light">
              Every handloom saree from Mun Creations comes with an authentic Silk Mark Certificate tag verified by the Silk Board of India.
            </p>
          </div>
        </div>

        {/* Right Column: Inquiry Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-sm border border-border shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-green-50 text-green-700 flex items-center justify-center mx-auto border border-green-200">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[var(--wine-deep)]">
                Thank You for Contacting Mun Creations
              </h2>
              <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                Your styling inquiry has been received. Our senior saree concierge will review your requirements and connect with you shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="bg-[var(--wine)] text-white px-6 py-2.5 text-xs uppercase tracking-wider font-semibold rounded"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div>
                <h2 className="font-serif text-xl font-bold text-[var(--wine-deep)] pb-1">
                  Send a Concierge Inquiry
                </h2>
                <p className="text-muted-foreground">Fill in your requirements below and we will get back to you.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block mb-1 text-foreground">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Radhika Sen"
                    className="w-full p-2.5 bg-secondary/30 border border-border rounded focus:outline-none focus:border-[var(--wine)]"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-foreground">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="radhika@example.com"
                    className="w-full p-2.5 bg-secondary/30 border border-border rounded focus:outline-none focus:border-[var(--wine)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block mb-1 text-foreground">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 bg-secondary/30 border border-border rounded focus:outline-none focus:border-[var(--wine)]"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-foreground">Inquiry Type</label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full p-2.5 bg-secondary/30 border border-border rounded focus:outline-none focus:border-[var(--wine)]"
                  >
                    <option>Bridal Consultation</option>
                    <option>Virtual Styling Session</option>
                    <option>Custom Weave Inquiry</option>
                    <option>Order & Shipping Assistance</option>
                    <option>General Saree Query</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1 text-foreground">Your Message / Requirements *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about the occasion, preferred fabrics, or specific weaves..."
                  className="w-full p-2.5 bg-secondary/30 border border-border rounded focus:outline-none focus:border-[var(--wine)] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--wine)] text-white py-3 px-6 rounded text-xs font-bold uppercase tracking-wider hover:bg-[var(--wine-deep)] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Send Inquiry to Concierge</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
