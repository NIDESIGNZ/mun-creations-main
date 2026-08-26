import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { ShieldCheck, UserCheck, Sparkles, ArrowRight, Lock, Mail, Key } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Portal Sign In — Mun Creations" },
      {
        name: "description",
        content: "Authentication portal for Designers & Weavers, Customers, and Main Admin Executive Management.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20 flex items-center justify-center">
            <LoginFormContainer />
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </I18nProvider>
  );
}

function LoginFormContainer() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"designers" | "customers" | "admin">("customers");

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [authSuccessMsg, setAuthSuccessMsg] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "admin") {
      sessionStorage.setItem("mun_admin_authed", "true");
      setAuthSuccessMsg("Admin authentication successful! Redirecting to Master Executive Admin Portal...");
      setTimeout(() => {
        navigate({ to: "/admin" });
      }, 1000);
    } else if (activeTab === "designers") {
      sessionStorage.setItem("mun_source_authed", "true");
      setAuthSuccessMsg("Designer authentication successful! Redirecting to Sourcing Portal...");
      setTimeout(() => {
        navigate({ to: "/source" });
      }, 1000);
    } else {
      setAuthSuccessMsg("Customer login successful! Welcome back to Mun Creations.");
      setTimeout(() => {
        navigate({ to: "/account" });
      }, 1000);
    }
  };

  const setDemoCredentials = (role: "designers" | "customers" | "admin") => {
    setActiveTab(role);
    if (role === "admin") {
      setEmail("admin@muncreations.com");
      setPassword("mun@dev1234");
    } else if (role === "designers") {
      setEmail("rajeshwar@banarasihandloom.org");
      setPassword("mun@dev1234");
    } else {
      setEmail("priya.sharma@example.com");
      setPassword("mun@dev1234");
    }
  };

  return (
    <div className="container-boutique max-w-2xl mx-auto px-4">
      {/* Login Container Box */}
      <div className="bg-white rounded-sm border border-border shadow-2xl overflow-hidden">
        {/* Header Title */}
        <div className="bg-[var(--wine-deep)] text-[var(--ivory)] p-8 text-center border-b border-[var(--gold)]/30 relative">
          <div className="eyebrow text-[var(--gold)] mb-2">Authentication Portal</div>
          <h1 className="font-serif text-3xl md:text-4xl text-white">Sign In to Mun Creations</h1>
          <p className="text-xs text-white/70 mt-1">Select your account portal below to log in</p>
        </div>

        {/* 3 Section Tabs */}
        <div className="grid grid-cols-3 border-b border-border bg-secondary/40 text-xs font-semibold uppercase tracking-wider divide-x divide-border">
          <button
            type="button"
            onClick={() => setDemoCredentials("designers")}
            className={`py-3.5 px-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-colors ${
              activeTab === "designers"
                ? "bg-white text-[var(--wine)] border-b-2 border-[var(--wine)] font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="h-4 w-4 text-[var(--gold)]" />
            <span>1. Designers</span>
          </button>

          <button
            type="button"
            onClick={() => setDemoCredentials("customers")}
            className={`py-3.5 px-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-colors ${
              activeTab === "customers"
                ? "bg-white text-[var(--wine)] border-b-2 border-[var(--wine)] font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserCheck className="h-4 w-4 text-[var(--wine)]" />
            <span>2. Customers</span>
          </button>

          <button
            type="button"
            onClick={() => setDemoCredentials("admin")}
            className={`py-3.5 px-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-colors ${
              activeTab === "admin"
                ? "bg-white text-[var(--wine)] border-b-2 border-[var(--wine)] font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>3. Main Admin</span>
          </button>
        </div>

        {/* Dynamic Form Content */}
        <div className="p-8 space-y-6">
          {/* Section Description */}
          <div className="p-3 rounded-sm bg-secondary/30 border border-border text-xs text-foreground/80 flex items-start gap-2">
            <Lock className="h-4 w-4 text-[var(--wine)] shrink-0 mt-0.5" />
            <div>
              {activeTab === "designers" && (
                <span>
                  <strong>Designers & Artisans Portal:</strong> Access loom order schedules, submit new weave designs, and track monthly payouts.
                </span>
              )}
              {activeTab === "customers" && (
                <span>
                  <strong>Customer Account:</strong> View order history, track international shipping, and access exclusive VIP collection previews.
                </span>
              )}
              {activeTab === "admin" && (
                <span>
                  <strong>Main Executive Admin Portal:</strong> Full executive management suite to inspect Customer details, Designer rosters, and revenue diagnostics.
                </span>
              )}
            </div>
          </div>

          {authSuccessMsg ? (
            <div className="p-4 rounded-sm bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold text-center animate-in fade-in">
              {authSuccessMsg}
            </div>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1 text-foreground">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      activeTab === "admin"
                        ? "admin@muncreations.com"
                        : activeTab === "designers"
                        ? "designer@handloom.org"
                        : "customer@example.com"
                    }
                    className="w-full pl-9 pr-4 py-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1 text-foreground">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-4 py-2.5 bg-secondary/20 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
                  />
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-border text-[var(--wine)] focus:ring-[var(--wine)] h-3.5 w-3.5"
                  />
                  <span>Remember my session</span>
                </label>
                <a href="#" className="hover:text-[var(--wine)] font-medium">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-[var(--wine)] text-white py-3.5 text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-[var(--wine-deep)] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>
                  {activeTab === "admin"
                    ? "Enter Main Admin Portal"
                    : activeTab === "designers"
                    ? "Sign In to Designer Portal"
                    : "Sign In to Customer Account"}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
