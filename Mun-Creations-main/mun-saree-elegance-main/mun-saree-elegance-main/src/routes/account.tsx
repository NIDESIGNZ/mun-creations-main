import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { backendDB } from "@/lib/backend-api";
import {
  User,
  Package,
  MapPin,
  Heart,
  Key,
  LogOut,
  ShieldCheck,
  Truck,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — Orders, Addresses & Wishlist | Mun Creations" },
      {
        name: "description",
        content:
          "Manage your profile, track active orders, saved shipping addresses, and wishlist.",
      },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20">
            <AccountContent />
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </I18nProvider>
  );
}

function AccountContent() {
  const { formatPrice } = useI18n();
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "addresses" | "wishlist">(
    "orders",
  );

  const [customerProfile, setCustomerProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("mun_customer_profile");
      if (saved) return JSON.parse(saved);
      const email = sessionStorage.getItem("mun_customer_email") || "";
      if (email) {
        return {
          name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          email,
          phone: "",
          memberSince: "Client Member",
        };
      }
    } catch {}
    return {
      name: "Valued Client",
      email: "",
      phone: "",
      memberSince: "Client Member",
    };
  });

  const [saveStatus, setSaveStatus] = useState("");

  const orders = backendDB
    .getOrders()
    .filter((ord) => !customerProfile.email || ord.email === customerProfile.email);

  const initials =
    (customerProfile.name || "Valued Client")
      .split(" ")
      .map((n: string) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "MC";

  const handleSignOut = () => {
    sessionStorage.removeItem("mun_customer_authed");
    sessionStorage.removeItem("mun_customer_email");
    localStorage.removeItem("mun_customer_profile");
    window.location.href = "/login";
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("mun_customer_profile", JSON.stringify(customerProfile));
      setSaveStatus("Profile successfully updated.");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch {}
  };

  return (
    <div className="container-boutique space-y-8">
      {/* Account Profile Banner */}
      <div className="bg-white p-6 md:p-8 rounded-sm border border-border shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-[var(--wine)] text-white font-serif font-bold text-2xl flex items-center justify-center border-2 border-[var(--gold)]">
            {initials}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[var(--wine-deep)]">
              {customerProfile.name}
            </h1>
            <div className="text-xs text-muted-foreground">
              {customerProfile.email ? `${customerProfile.email} · ` : ""}Member since {customerProfile.memberSince}
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1.5 border border-red-200 px-4 py-2 rounded-sm bg-red-50 hover:bg-red-100 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Account Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-white p-2 rounded-sm border border-border shadow-sm space-y-1 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left p-3 rounded-xs flex items-center gap-2.5 transition-colors ${
                activeTab === "orders"
                  ? "bg-[var(--wine)] text-white"
                  : "hover:bg-secondary text-foreground"
              }`}
            >
              <Package className="h-4 w-4" />
              <span>Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left p-3 rounded-xs flex items-center gap-2.5 transition-colors ${
                activeTab === "profile"
                  ? "bg-[var(--wine)] text-white"
                  : "hover:bg-secondary text-foreground"
              }`}
            >
              <User className="h-4 w-4" />
              <span>Personal Details</span>
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full text-left p-3 rounded-xs flex items-center gap-2.5 transition-colors ${
                activeTab === "addresses"
                  ? "bg-[var(--wine)] text-white"
                  : "hover:bg-secondary text-foreground"
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span>Saved Addresses</span>
            </button>

            <button
              onClick={() => setActiveTab("wishlist")}
              className={`w-full text-left p-3 rounded-xs flex items-center gap-2.5 transition-colors ${
                activeTab === "wishlist"
                  ? "bg-[var(--wine)] text-white"
                  : "hover:bg-secondary text-foreground"
              }`}
            >
              <Heart className="h-4 w-4" />
              <span>Wishlist</span>
            </button>
          </div>
        </div>

        {/* Tab Content Box */}
        <div className="lg:col-span-9">
          {/* TAB 1: Orders History */}
          {activeTab === "orders" && (
            <div className="bg-white p-6 md:p-8 rounded-sm border border-border shadow-md space-y-6 animate-in fade-in">
              <h2 className="font-serif text-2xl font-bold text-[var(--wine-deep)] border-b border-border pb-3">
                Order History & Live Shipments
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-12 px-4 border border-dashed border-border rounded-sm bg-secondary/10 space-y-3">
                  <Package className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
                  <p className="font-serif text-lg font-bold text-foreground">No orders placed yet</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    When you complete an order, your tracking details, artisan authentication certificates, and live shipment updates will be displayed here.
                  </p>
                  <Link
                    to="/products"
                    className="inline-block mt-3 px-5 py-2.5 bg-[var(--wine)] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[var(--wine-deep)] transition-colors"
                  >
                    Explore Handloom Sarees
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 border border-border rounded-sm space-y-4 bg-secondary/10"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border text-xs gap-2">
                        <div>
                          <div className="font-mono font-bold text-sm text-[var(--wine-deep)]">
                            {ord.id}
                          </div>
                          <div className="text-muted-foreground text-[10px]">
                            Placed on {new Date(ord.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="sm:text-right">
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase">
                            <ShieldCheck className="h-3 w-3" />
                            <span>{ord.status}</span>
                          </span>
                          <div className="font-serif font-bold text-base text-[var(--wine-deep)] mt-1">
                            {formatPrice(ord.subtotalUsd)}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className="font-serif font-bold">
                              {it.productName} (Qty: {it.quantity})
                            </span>
                            <span className="font-semibold">
                              {formatPrice(it.priceUsd * it.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 text-muted-foreground">
                        <div>
                          Shipping Address:{" "}
                          <strong className="text-foreground">{ord.shippingAddress}</strong>
                        </div>
                        {ord.awbNumber && (
                          <a
                            href={ord.trackingUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[var(--wine)] font-bold hover:underline text-[11px]"
                          >
                            <Truck className="h-3.5 w-3.5" />
                            <span>Track Courier ({ord.awbNumber})</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Personal Details */}
          {activeTab === "profile" && (
            <div className="bg-white p-6 md:p-8 rounded-sm border border-border shadow-md space-y-6 animate-in fade-in">
              <h2 className="font-serif text-2xl font-bold text-[var(--wine-deep)] border-b border-border pb-3">
                Personal Profile & Security
              </h2>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs max-w-md">
                <div>
                  <label className="font-bold block mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={customerProfile.name}
                    onChange={(e) =>
                      setCustomerProfile({ ...customerProfile, name: e.target.value })
                    }
                    className="w-full p-2.5 bg-secondary/20 border border-border rounded-sm"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={customerProfile.email}
                    onChange={(e) =>
                      setCustomerProfile({ ...customerProfile, email: e.target.value })
                    }
                    className="w-full p-2.5 bg-secondary/20 border border-border rounded-sm"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={customerProfile.phone}
                    onChange={(e) =>
                      setCustomerProfile({ ...customerProfile, phone: e.target.value })
                    }
                    className="w-full p-2.5 bg-secondary/20 border border-border rounded-sm"
                  />
                </div>
                {saveStatus && (
                  <div className="text-emerald-700 font-semibold">{saveStatus}</div>
                )}
                <button
                  type="submit"
                  className="bg-[var(--wine)] text-white px-6 py-2.5 font-bold uppercase tracking-wider text-xs rounded-sm shadow-md hover:bg-[var(--wine-deep)] transition-colors"
                >
                  Save Profile
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: Saved Addresses */}
          {activeTab === "addresses" && (
            <div className="bg-white p-6 md:p-8 rounded-sm border border-border shadow-md space-y-6 animate-in fade-in">
              <h2 className="font-serif text-2xl font-bold text-[var(--wine-deep)] border-b border-border pb-3">
                Saved Shipping Addresses
              </h2>

              <div className="text-center py-10 px-4 border border-dashed border-border rounded-sm bg-secondary/10 space-y-2">
                <MapPin className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                <p className="font-serif text-base font-bold text-foreground">No Saved Addresses</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Shipping addresses entered during checkout or saved from your profile will appear here.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Wishlist */}
          {activeTab === "wishlist" && (
            <div className="bg-white p-6 md:p-8 rounded-sm border border-border shadow-md space-y-6 animate-in fade-in">
              <h2 className="font-serif text-2xl font-bold text-[var(--wine-deep)] border-b border-border pb-3">
                Saved Wishlist Items
              </h2>

              <div className="text-xs text-muted-foreground p-6 text-center border border-border rounded bg-secondary/20">
                Your saved wishlist items will appear here. Click the heart icon on any saree to
                save it for later.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
