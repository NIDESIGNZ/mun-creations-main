import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { ProductCard } from "@/components/site/product";
import { backendDB } from "@/lib/backend-api";
import type { Product } from "@/lib/products";
import { Search as SearchIcon, Bot, Send } from "lucide-react";
import { askAIMLStylist } from "@/lib/aiml-client";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search Sarees & AI Saree Finder Assistant — Mun Creations" },
      {
        name: "description",
        content:
          "Search our handwoven catalog or ask our AI Saree Finder for personalized outfit recommendations.",
      },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20">
            <SearchContent />
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </I18nProvider>
  );
}

function SearchContent() {
  const [query, setQuery] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiRecommendedProducts, setAiRecommendedProducts] = useState<Product[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const allProducts = backendDB.getProducts();

  // Keyword Matching
  const searchResults = query.trim()
    ? allProducts.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.workType?.toLowerCase().includes(q)
        );
      })
    : [];

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsAiThinking(true);
    setAiResponse(null);

    const q = aiPrompt.toLowerCase();
    let reco = allProducts;

    if (
      q.includes("wedding") ||
      q.includes("bridal") ||
      q.includes("sister") ||
      q.includes("reception") ||
      q.includes("pooja") ||
      q.includes("paithani")
    ) {
      reco = allProducts.filter(
        (p) =>
          p.priceUsd > 300 ||
          p.category === "Kanjivaram" ||
          p.category === "Banarasi" ||
          p.category === "Paithani",
      );
    } else if (
      q.includes("summer") ||
      q.includes("cotton") ||
      q.includes("light") ||
      q.includes("haldi") ||
      q.includes("yellow")
    ) {
      reco = allProducts.filter(
        (p) =>
          p.fabric === "Muslin" ||
          p.fabric === "Cotton" ||
          p.fabric === "Organza" ||
          p.priceUsd < 350,
      );
    } else if (q.includes("red") || q.includes("maroon") || q.includes("crimson")) {
      reco = allProducts.filter(
        (p) => p.color === "Red" || p.color === "Maroon" || p.color === "Wine",
      );
    } else if (q.includes("tussar") || q.includes("tribal")) {
      reco = allProducts.filter((p) => p.category === "Tussar" || p.fabric === "Tussar Silk");
    }

    setAiRecommendedProducts(reco.slice(0, 4));

    try {
      const response = await askAIMLStylist(aiPrompt);
      setAiResponse(response);
    } catch {
      setAiResponse(
        `Based on your request "${aiPrompt}", I recommend our handwoven Katan Banarasi, Kanjivaram, and royal Paithani silk ensembles crafted with pure zari. Here are recommended choices:`,
      );
    } finally {
      setIsAiThinking(false);
    }
  };

  return (
    <div className="container-boutique space-y-8 sm:space-y-10">
      {/* 1. Main Keyword Search Bar */}
      <div className="max-w-2xl mx-auto text-center space-y-3 sm:space-y-4">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--wine-deep)]">
          Search the Treasury
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Explore by weave, artisan cluster, silk type, colour, or bridal occasion
        </p>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by weave (e.g. Paithani, Katan Banarasi, Bandhani, Kanjivaram)..."
            className="w-full bg-white border border-border pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-sm shadow-sm focus:outline-hidden focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-all"
          />
          <SearchIcon className="absolute left-3.5 sm:left-4 top-4 sm:top-4.5 h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground pt-1">
          <span>Popular:</span>
          {["Paithani", "Bandhani", "Banarasi", "Kanjivaram", "Tussar", "Organza", "Bridal Red", "Haldi Yellow"].map(
            (term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="bg-secondary/60 hover:bg-[var(--wine)] hover:text-white px-2.5 py-1 rounded-xs transition-colors cursor-pointer"
              >
                {term}
              </button>
            ),
          )}
        </div>
      </div>

      {/* 2. AI Stylist Prompt Box */}
      <div className="bg-gradient-to-r from-[var(--wine-deep)] via-[#2f0d1e] to-[var(--wine-deep)] text-white p-5 sm:p-8 rounded-sm border border-[var(--gold)]/40 shadow-xl space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-[var(--gold)]/20 text-[var(--gold)] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
          <Bot className="h-3.5 w-3.5" />
          <span>AI Stylist & Saree Finder</span>
        </div>

        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold">
            Ask AI: "What should I wear for my sister's wedding?"
          </h2>
          <p className="text-xs text-white/80 mt-1">
            Describe your event, preferred fabric, or budget to get instant AI recommendations.
          </p>
        </div>

        <form onSubmit={handleAskAI} className="flex flex-col sm:flex-row gap-2 pt-2">
          <input
            type="text"
            placeholder="e.g. Need a light green silk saree under $400 for haldi ceremony"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="flex-1 p-3 bg-white/10 border border-white/20 rounded-sm text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-[var(--gold)] font-medium"
          />
          <button
            type="submit"
            disabled={isAiThinking}
            className="bg-[var(--gold)] text-[var(--wine-deep)] px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-white transition-colors flex items-center justify-center gap-2 shrink-0 min-h-[42px] cursor-pointer"
          >
            {isAiThinking ? (
              <span className="h-4 w-4 border-2 border-[var(--wine-deep)] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Ask Stylist</span>
                <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {aiResponse && (
          <div className="p-4 bg-white/10 rounded border border-white/20 text-xs leading-relaxed space-y-4 animate-in fade-in">
            <div>{aiResponse}</div>
            {aiRecommendedProducts.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-2">
                {aiRecommendedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Search Results Grid */}
      {query.trim() && (
        <div className="space-y-4 sm:space-y-6">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--wine-deep)] border-b border-border pb-3">
            Search Results for "{query}" ({searchResults.length} Found)
          </h2>

          {searchResults.length === 0 ? (
            <div className="bg-white p-6 sm:p-8 text-center rounded border border-border text-muted-foreground text-xs">
              No matching sarees found for "{query}". Try searching by category like 'Banarasi' or
              fabric like 'Silk'.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {searchResults.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
