import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { backendDB, WeaverSource, CustomerOrder } from "@/lib/backend-api";
import {
  Product,
  PRODUCTS,
  heroSaree,
  catSilk,
  catPredraped,
  catCotton,
  productTeal,
  productPink,
} from "@/lib/products";
import {
  Building2,
  Package,
  ShoppingBag,
  Activity,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Star,
  RefreshCw,
  Trash2,
  Edit,
  ExternalLink,
  ShieldCheck,
  Image as ImageIcon,
  Upload,
} from "lucide-react";

export const Route = createFileRoute("/source")({
  head: () => ({
    meta: [
      { title: "Artisanal Sourcing & Administration Portal — Mun Creations" },
      {
        name: "description",
        content:
          "Manage handloom weaving clusters in Varanasi, Kanchipuram, Bengal, & Lucknow, oversee catalog sourcing, track customer fulfillment, & run REST API diagnostics.",
      },
    ],
  }),
  component: SourcePortalPage,
});

function SourcePortalPage() {
  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-14 sm:pb-20 md:pb-24 bg-secondary/20">
            <SourcePortalContent />
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </I18nProvider>
  );
}

function SourcePortalContent() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return (
      sessionStorage.getItem("mun_source_authed") === "true" ||
      sessionStorage.getItem("mun_admin_authed") === "true"
    );
  });
  const [passcode, setPasscode] = useState("");
  const [passError, setPassError] = useState("");

  const handleSourceAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "mun@dev1234") {
      sessionStorage.setItem("mun_source_authed", "true");
      setIsAuthenticated(true);
    } else {
      setPassError("Invalid Passcode. Access Denied.");
    }
  };

  const [activeTab, setActiveTab] = useState<"clusters" | "catalog" | "orders" | "api">("clusters");

  // State containers
  const [sources, setSources] = useState<WeaverSource[]>(() => backendDB.getSources());
  const [products, setProducts] = useState<Product[]>(() => backendDB.getProducts());
  const [orders, setOrders] = useState<CustomerOrder[]>(() => backendDB.getOrders());
  const [health, setHealth] = useState(() => backendDB.getHealthStatus());

  // Search & Filter State
  const [catalogSearch, setCatalogSearch] = useState("");
  const [newClusterModal, setNewClusterModal] = useState(false);
  const [newProductModal, setNewProductModal] = useState(false);

  // New Cluster Form State
  const [clusterForm, setClusterForm] = useState({
    clusterName: "",
    region: "",
    state: "",
    specialty: "",
    artisanCount: 50,
    contactPerson: "",
    phone: "",
    email: "",
    leadTimeDays: 14,
    qualityRating: 4.9,
    status: "Active" as const,
  });

  // New Product Form State
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Banarasi",
    mainCategory: "sarees" as const,
    fabric: "Silk",
    weave: "Banarasi",
    priceUsd: 350,
    color: "Red",
    inStock: true,
    badge: "new" as const,
    image: "/logo-light.png",
  });

  if (!isAuthenticated) {
    return (
      <div className="container-boutique max-w-md mx-auto py-12">
        <div className="bg-white p-8 rounded-sm border border-border shadow-2xl space-y-4 text-center">
          <div className="h-12 w-12 rounded-full bg-[var(--gold)]/20 text-[var(--wine)] flex items-center justify-center mx-auto border border-[var(--gold)]/30">
            <Building2 className="h-6 w-6 text-[var(--wine)]" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[var(--wine-deep)]">
            Sourcing Registry Access
          </h2>
          <p className="text-xs text-muted-foreground">
            This sourcing portal is passcode protected for authorized weavers & craft personnel.
          </p>

          <form onSubmit={handleSourceAuthSubmit} className="space-y-4 text-xs text-left">
            <div>
              <label className="font-bold block mb-1">Passcode / Security Key</label>
              <input
                type="password"
                required
                autoFocus
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter sourcing passcode..."
                className="w-full p-2.5 bg-secondary/30 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)] font-mono text-sm"
              />
            </div>

            {passError && (
              <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-sm text-center">
                {passError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[var(--wine)] text-white py-3 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[var(--wine-deep)] transition-colors shadow-md"
            >
              Unlock Sourcing Registry
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleAddCluster = (e: React.FormEvent) => {
    e.preventDefault();
    const created = backendDB.addSource(clusterForm);
    setSources(backendDB.getSources());
    setNewClusterModal(false);
    setClusterForm({
      clusterName: "",
      region: "",
      state: "",
      specialty: "",
      artisanCount: 50,
      contactPerson: "",
      phone: "",
      email: "",
      leadTimeDays: 14,
      qualityRating: 4.9,
      status: "Active",
    });
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    backendDB.addProduct({
      ...productForm,
      swatches: ["#800000", "#d4af37"],
    });
    setProducts(backendDB.getProducts());
    setNewProductModal(false);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setProductForm((prev) => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this listing from the backend?")) {
      backendDB.deleteProduct(id);
      setProducts(backendDB.getProducts());
    }
  };

  const handleToggleStock = (id: string, currentStock: boolean) => {
    backendDB.updateProduct(id, { inStock: !currentStock });
    setProducts(backendDB.getProducts());
  };

  const refreshHealth = () => {
    setHealth(backendDB.getHealthStatus());
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.fabric?.toLowerCase().includes(catalogSearch.toLowerCase()),
  );

  return (
    <div className="container-boutique space-y-8">
      {/* Portal Top Banner */}
      <div className="bg-[var(--wine-deep)] text-white rounded-sm p-8 shadow-xl border border-[var(--gold)]/30 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[var(--gold)] font-bold bg-black/40 px-3 py-1 rounded-full border border-[var(--gold)]/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Production Backend & Sourcing Registry</span>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-white">
              Artisanal Sourcing & Admin Portal
            </h1>
            <p className="text-xs md:text-sm text-white/70 max-w-2xl">
              Oversee direct handloom weaver clusters in Varanasi, Kanchipuram, Bengal, & Lucknow,
              manage catalog inventory, & monitor real-time backend API endpoints.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setNewClusterModal(true)}
              className="inline-flex items-center justify-center gap-2 bg-[var(--gold)] text-[var(--wine-deep)] px-5 py-3 text-xs uppercase tracking-wider font-bold rounded-sm hover:bg-white transition-all shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Register Cluster</span>
            </button>
            <button
              onClick={() => setNewProductModal(true)}
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white px-5 py-3 text-xs uppercase tracking-wider font-bold rounded-sm hover:bg-white/10 transition-all shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Add Listing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-sm border border-border shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-[var(--wine)]/10 text-[var(--wine)] flex items-center justify-center shrink-0">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[var(--wine-deep)]">
              {sources.length}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Weaving Clusters
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border border-border shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-[var(--gold)]/20 text-[var(--wine-deep)] flex items-center justify-center shrink-0">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[var(--wine-deep)]">
              {products.length}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Sourced Items
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border border-border shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[var(--wine-deep)]">
              {orders.length}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Active Orders
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border border-border shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-emerald-600">{health.status}</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Backend Server API
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-border bg-white rounded-t-sm p-1 shadow-xs gap-2">
        <button
          onClick={() => setActiveTab("clusters")}
          className={`flex-1 py-3 text-xs uppercase tracking-wider font-bold rounded-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === "clusters"
              ? "bg-[var(--wine-deep)] text-white shadow-sm"
              : "text-foreground/70 hover:bg-secondary/50"
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Artisanal Clusters ({sources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("catalog")}
          className={`flex-1 py-3 text-xs uppercase tracking-wider font-bold rounded-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === "catalog"
              ? "bg-[var(--wine-deep)] text-white shadow-sm"
              : "text-foreground/70 hover:bg-secondary/50"
          }`}
        >
          <Package className="h-4 w-4" />
          <span>Catalog Inventory ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`flex-1 py-3 text-xs uppercase tracking-wider font-bold rounded-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === "orders"
              ? "bg-[var(--wine-deep)] text-white shadow-sm"
              : "text-foreground/70 hover:bg-secondary/50"
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Fulfillment Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("api")}
          className={`flex-1 py-3 text-xs uppercase tracking-wider font-bold rounded-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === "api"
              ? "bg-[var(--wine-deep)] text-white shadow-sm"
              : "text-foreground/70 hover:bg-secondary/50"
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>REST API & Diagnostics</span>
        </button>
      </div>

      {/* Tab 1: Artisanal Weaving Clusters */}
      {activeTab === "clusters" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sources.map((src) => (
            <div
              key={src.id}
              className="bg-white rounded-sm border border-border p-6 shadow-xs space-y-4 hover:border-[var(--gold)] transition-colors"
            >
              <div className="flex items-start justify-between border-b border-border pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--gold)] bg-[var(--wine-deep)] px-2.5 py-0.5 rounded-xs">
                    {src.region}, {src.state}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[var(--wine-deep)] mt-1">
                    {src.clusterName}
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {src.status}
                </span>
              </div>

              <div className="text-xs space-y-2 text-foreground/80">
                <p className="font-medium text-foreground">
                  <span className="text-muted-foreground font-normal">Craft Specialty:</span>{" "}
                  {src.specialty}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/50 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-[var(--wine)]" />
                    <span>{src.artisanCount} Master Weavers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[var(--wine)]" />
                    <span>{src.leadTimeDays} Days Lead Time</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span>{src.qualityRating} / 5.0 Rating</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[var(--wine)]" />
                    <span>{src.region} Cluster</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <div>
                  <span className="font-semibold text-foreground">{src.contactPerson}</span> ·{" "}
                  {src.phone}
                </div>
                <a
                  href={`mailto:${src.email}`}
                  className="text-[var(--wine)] hover:underline font-medium"
                >
                  {src.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Catalog Inventory & Sourcing */}
      {activeTab === "catalog" && (
        <div className="bg-white rounded-sm border border-border shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search catalog by name, category, or fabric..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-secondary/40 border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>

            <span className="text-xs text-muted-foreground font-medium">
              Showing {filteredProducts.length} of {products.length} products
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/60 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Fabric</th>
                  <th className="py-3 px-4">Price (USD)</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-9 w-9 object-cover rounded-xs border border-border"
                      />
                      <div>
                        <div className="text-xs font-serif font-bold text-[var(--wine-deep)]">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground">ID: {p.id}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground/80 font-medium">{p.category}</td>
                    <td className="py-3 px-4 text-foreground/80">{p.fabric || "Pure Silk"}</td>
                    <td className="py-3 px-4 font-bold text-[var(--wine)]">${p.priceUsd}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStock(p.id, p.inStock ?? true)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          p.inStock
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-rose-600 hover:text-rose-900 p-1 font-medium text-xs inline-flex items-center gap-1"
                        title="Delete product"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Order Fulfillment */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-sm border border-border p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-lg font-bold text-[var(--wine-deep)]">
                      {ord.id}
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {ord.status}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Ordered on {new Date(ord.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-serif font-bold text-[var(--wine)]">
                    ${ord.subtotalUsd}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Paid via Card
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-bold text-foreground mb-1 uppercase tracking-wider text-[10px] text-muted-foreground">
                    Customer & Shipping Address
                  </div>
                  <div className="font-semibold">{ord.customerName}</div>
                  <div className="text-muted-foreground">
                    {ord.email} · {ord.phone}
                  </div>
                  <div className="text-foreground/80 mt-1">{ord.shippingAddress}</div>
                </div>

                <div>
                  <div className="font-bold text-foreground mb-1 uppercase tracking-wider text-[10px] text-muted-foreground">
                    Purchased Items
                  </div>
                  <div className="space-y-1">
                    {ord.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between py-0.5 border-b border-border/40"
                      >
                        <span>
                          {item.quantity}x {item.productName}
                        </span>
                        <span className="font-semibold">${item.priceUsd}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: REST API & Diagnostics */}
      {activeTab === "api" && (
        <div className="space-y-6">
          <div className="bg-white rounded-sm border border-border p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--wine-deep)]">
                  Backend Health & REST API Controller
                </h3>
                <p className="text-xs text-muted-foreground">
                  Production REST endpoints serving products, weaver clusters, & checkout orders
                </p>
              </div>

              <button
                onClick={refreshHealth}
                className="inline-flex items-center gap-1.5 bg-secondary text-foreground text-xs uppercase tracking-wider px-3.5 py-2 rounded-sm font-semibold hover:bg-border transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Refresh Diagnostics</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-secondary/40 rounded-sm">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">
                  Server State
                </span>
                <div className="text-sm font-bold text-emerald-600">{health.status}</div>
              </div>
              <div className="p-3 bg-secondary/40 rounded-sm">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">
                  Uptime
                </span>
                <div className="text-sm font-bold text-foreground">{health.uptimeSeconds}s</div>
              </div>
              <div className="p-3 bg-secondary/40 rounded-sm">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">
                  Database State
                </span>
                <div className="text-sm font-bold text-blue-600">{health.databaseState}</div>
              </div>
              <div className="p-3 bg-secondary/40 rounded-sm">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">
                  Version
                </span>
                <div className="text-sm font-bold text-foreground">{health.version}</div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Available REST Routes
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                <a
                  href="/api/health"
                  target="_blank"
                  className="p-2.5 bg-slate-900 text-slate-100 rounded-sm flex items-center justify-between hover:bg-slate-800"
                >
                  <span>GET /api/health</span>
                  <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
                </a>
                <a
                  href="/api/products"
                  target="_blank"
                  className="p-2.5 bg-slate-900 text-slate-100 rounded-sm flex items-center justify-between hover:bg-slate-800"
                >
                  <span>GET /api/products</span>
                  <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
                </a>
                <a
                  href="/api/sources"
                  target="_blank"
                  className="p-2.5 bg-slate-900 text-slate-100 rounded-sm flex items-center justify-between hover:bg-slate-800"
                >
                  <span>GET /api/sources</span>
                  <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
                </a>
                <a
                  href="/api/orders"
                  target="_blank"
                  className="p-2.5 bg-slate-900 text-slate-100 rounded-sm flex items-center justify-between hover:bg-slate-800"
                >
                  <span>GET /api/orders</span>
                  <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register Weaver Cluster */}
      {newClusterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <h3 className="font-serif text-xl font-bold text-[var(--wine-deep)]">
              Register New Weaver Cluster
            </h3>
            <form onSubmit={handleAddCluster} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Cluster / Cooperative Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kanchipuram Weavers Association"
                  value={clusterForm.clusterName}
                  onChange={(e) => setClusterForm({ ...clusterForm, clusterName: e.target.value })}
                  className="w-full p-2 border border-border rounded-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Region / City</label>
                  <input
                    type="text"
                    required
                    placeholder="Varanasi"
                    value={clusterForm.region}
                    onChange={(e) => setClusterForm({ ...clusterForm, region: e.target.value })}
                    className="w-full p-2 border border-border rounded-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">State</label>
                  <input
                    type="text"
                    required
                    placeholder="Uttar Pradesh"
                    value={clusterForm.state}
                    onChange={(e) => setClusterForm({ ...clusterForm, state: e.target.value })}
                    className="w-full p-2 border border-border rounded-sm"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Handloom Specialty</label>
                <input
                  type="text"
                  required
                  placeholder="Pure Silk Katan & Jaal Banarasi"
                  value={clusterForm.specialty}
                  onChange={(e) => setClusterForm({ ...clusterForm, specialty: e.target.value })}
                  className="w-full p-2 border border-border rounded-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Artisan Count</label>
                  <input
                    type="number"
                    value={clusterForm.artisanCount}
                    onChange={(e) =>
                      setClusterForm({ ...clusterForm, artisanCount: Number(e.target.value) })
                    }
                    className="w-full p-2 border border-border rounded-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    placeholder="Master Weaver"
                    value={clusterForm.contactPerson}
                    onChange={(e) =>
                      setClusterForm({ ...clusterForm, contactPerson: e.target.value })
                    }
                    className="w-full p-2 border border-border rounded-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setNewClusterModal(false)}
                  className="px-4 py-2 bg-secondary text-foreground rounded-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[var(--wine)] text-white rounded-sm font-semibold hover:bg-[var(--wine-deep)]"
                >
                  Save Cluster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Product Listing */}
      {newProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <h3 className="font-serif text-xl font-bold text-[var(--wine-deep)]">
              Add New Sourced Listing
            </h3>
            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shahi Brocade Kanjivaram Silk Saree"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full p-2 border border-border rounded-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="Banarasi"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2 border border-border rounded-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Fabric</label>
                  <input
                    type="text"
                    required
                    placeholder="Silk"
                    value={productForm.fabric}
                    onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                    className="w-full p-2 border border-border rounded-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Price (USD)</label>
                  <input
                    type="number"
                    required
                    value={productForm.priceUsd}
                    onChange={(e) =>
                      setProductForm({ ...productForm, priceUsd: Number(e.target.value) })
                    }
                    className="w-full p-2 border border-border rounded-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Color</label>
                  <input
                    type="text"
                    value={productForm.color}
                    onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                    className="w-full p-2 border border-border rounded-sm"
                  />
                </div>
              </div>

              {/* Product Image Upload & Preview Section */}
              <div className="space-y-2 pt-2 border-t border-border">
                <label className="font-semibold block text-xs">Product Image</label>
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-sm border border-border bg-secondary/50 overflow-hidden shrink-0 flex items-center justify-center relative shadow-xs">
                    {productForm.image ? (
                      <img
                        src={productForm.image}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Enter Image URL or select file..."
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="w-full p-2 text-xs border border-border rounded-sm focus:outline-none focus:border-[var(--wine)]"
                    />

                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 bg-secondary text-foreground text-[11px] px-3 py-1.5 rounded-sm border border-border hover:bg-border font-medium transition-colors">
                        <Upload className="h-3.5 w-3.5 text-[var(--wine)]" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                      </label>

                      <select
                        onChange={(e) =>
                          e.target.value &&
                          setProductForm({ ...productForm, image: e.target.value })
                        }
                        className="text-[11px] p-1.5 border border-border rounded-sm bg-white text-muted-foreground focus:outline-none"
                      >
                        <option value="">Sample Images...</option>
                        <option value={heroSaree}>Maroon Silk Saree</option>
                        <option value={catSilk}>Emerald Banarasi</option>
                        <option value={catPredraped}>Ivory Organza</option>
                        <option value={catCotton}>Mustard Cotton</option>
                        <option value={productTeal}>Teal Silk Saree</option>
                        <option value={productPink}>Blush Pink Saree</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setNewProductModal(false)}
                  className="px-4 py-2 bg-secondary text-foreground rounded-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[var(--wine)] text-white rounded-sm font-semibold hover:bg-[var(--wine-deep)]"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
