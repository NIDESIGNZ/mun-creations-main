import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { backendDB, type Order, type OrderStatus } from "@/lib/backend-api";
import type { Product } from "@/lib/products";
import { CATEGORY_FILTERS, FABRIC_FILTERS, COLOR_FILTERS } from "@/lib/catalog";
import {
  LayoutDashboard,
  Package,
  Plus,
  Upload,
  ShoppingBag,
  Truck,
  CreditCard,
  Settings,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  Users,
  Trash2,
  Edit,
  Eye,
  X,
  Lock,
  Bot,
  Printer,
  ChevronRight,
  RefreshCw,
  Tag,
  QrCode,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Enterprise Admin Portal — Mun Creations" },
      {
        name: "description",
        content:
          "Enterprise management dashboard for orders, product catalog, CSV bulk upload, inventory intelligence, shipping & Razorpay reconciliation.",
      },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "mun@dev1234") {
      setAuthenticated(true);
      setPassError("");
    } else {
      setPassError("Incorrect password. Access denied.");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-sm p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-[var(--gold)]/20 text-[var(--gold)] flex items-center justify-center mx-auto border border-[var(--gold)]/30">
              <Lock className="h-6 w-6" />
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] font-bold">
              Mun Creations
            </div>
            <h1 className="font-serif text-2xl font-bold text-white">Main Admin Portal</h1>
            <p className="text-xs text-slate-400">
              Enter password to access enterprise order & catalog engine
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold block mb-1 text-slate-300">Admin Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)] font-mono"
              />
            </div>

            {passError && <div className="text-red-400 font-semibold">{passError}</div>}

            <button
              type="submit"
              className="w-full bg-[var(--gold)] text-slate-950 py-3 text-xs font-bold uppercase tracking-wider rounded hover:bg-white transition-colors"
            >
              Sign In to Admin Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminDashboardContent onLogout={() => setAuthenticated(false)} />;
}

function AdminDashboardContent({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "catalog"
    | "add-product"
    | "csv-import"
    | "orders"
    | "shipping"
    | "payments"
    | "ai-copy"
    | "pos"
  >("dashboard");

  // Dynamic DB Data
  const [products, setProducts] = useState<Product[]>(backendDB.getProducts());
  const [orders, setOrders] = useState<Order[]>(backendDB.getOrders());

  // Search & Filters
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogCategory, setCatalogCategory] = useState("");

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // CSV Import States
  const [csvText, setCsvText] = useState("");
  const [csvResult, setCsvResult] = useState<{ importedCount: number; errors: string[] } | null>(
    null,
  );

  // Pincode & Shipping Checker State
  const [testPincode, setTestPincode] = useState("560001");
  const [testOrderVal, setTestOrderVal] = useState("580");
  const [pincodeResult, setPincodeResult] = useState<any>(null);

  // AI Copy Generator State
  const [aiName, setAiName] = useState("Crimson Katan Banarasi");
  const [aiFabric, setAiFabric] = useState("Katan Silk");
  const [aiCraft, setAiCraft] = useState("Kadwa Zari Weave");
  const [aiColor, setAiColor] = useState("Crimson Red");
  const [aiGeneratedCopy, setAiGeneratedCopy] = useState<any>(null);

  // Metrics Calculations
  const totalSalesUsd = orders.reduce(
    (s, o) => s + (o.status !== "Cancelled" ? o.subtotalUsd : 0),
    0,
  );
  const lowStockProducts = products.filter((p) => (p.stockQuantity ?? 1) <= 3);

  const refreshData = () => {
    setProducts([...backendDB.getProducts()]);
    setOrders([...backendDB.getOrders()]);
  };

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    backendDB.updateOrderStatus(orderId, status);
    refreshData();
  };

  const handleDeleteProd = (id: string) => {
    if (confirm("Are you sure you want to delete this product from database?")) {
      backendDB.deleteProduct(id);
      refreshData();
    }
  };

  const handleRunCSVImport = () => {
    if (!csvText.trim()) return;
    const res = backendDB.parseAndImportCSV(csvText);
    setCsvResult(res);
    refreshData();
  };

  const handleCheckPincode = () => {
    const res = backendDB.checkPincodeServiceability(testPincode, parseFloat(testOrderVal) || 0);
    setPincodeResult(res);
  };

  const handleGenerateAICopy = () => {
    const res = backendDB.generateAICopy(aiName, aiFabric, aiCraft, aiColor);
    setAiGeneratedCopy(res);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-[var(--gold)] text-slate-950 flex items-center justify-center font-bold font-serif text-lg">
            M
          </div>
          <div>
            <div className="font-serif font-bold text-lg text-white">
              Mun Creations — Enterprise Admin
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              Control Center v3.4
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <a
            href="/"
            target="_blank"
            className="text-slate-400 hover:text-white flex items-center gap-1 font-medium"
          >
            <Eye className="h-4 w-4 text-[var(--gold)]" />
            <span>View Live Storefront</span>
          </a>

          <button
            onClick={onLogout}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded font-bold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 space-y-2 shrink-0 text-xs font-semibold">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider px-3 pb-1 font-mono">
            Navigation
          </div>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full text-left p-3 rounded flex items-center gap-2.5 transition-colors ${
              activeTab === "dashboard"
                ? "bg-[var(--wine)] text-white font-bold"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>1. Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("catalog")}
            className={`w-full text-left p-3 rounded flex items-center gap-2.5 transition-colors ${
              activeTab === "catalog"
                ? "bg-[var(--wine)] text-white font-bold"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Package className="h-4 w-4" />
            <span>2. Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("add-product")}
            className={`w-full text-left p-3 rounded flex items-center gap-2.5 transition-colors ${
              activeTab === "add-product"
                ? "bg-[var(--wine)] text-white font-bold"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>3. Tabbed Add Product</span>
          </button>

          <button
            onClick={() => setActiveTab("csv-import")}
            className={`w-full text-left p-3 rounded flex items-center gap-2.5 transition-colors ${
              activeTab === "csv-import"
                ? "bg-[var(--wine)] text-white font-bold"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>4. CSV Bulk Upload</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left p-3 rounded flex items-center gap-2.5 transition-colors ${
              activeTab === "orders"
                ? "bg-[var(--wine)] text-white font-bold"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>5. Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("shipping")}
            className={`w-full text-left p-3 rounded flex items-center gap-2.5 transition-colors ${
              activeTab === "shipping"
                ? "bg-[var(--wine)] text-white font-bold"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Truck className="h-4 w-4" />
            <span>6. Shipping & Courier Engine</span>
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`w-full text-left p-3 rounded flex items-center gap-2.5 transition-colors ${
              activeTab === "payments"
                ? "bg-[var(--wine)] text-white font-bold"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <CreditCard className="h-4 w-4" />
            <span>7. Razorpay Reconciliation</span>
          </button>

          <button
            onClick={() => setActiveTab("ai-copy")}
            className={`w-full text-left p-3 rounded flex items-center gap-2.5 transition-colors ${
              activeTab === "ai-copy"
                ? "bg-[var(--wine)] text-white font-bold"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Bot className="h-4 w-4 text-[var(--gold)]" />
            <span>8. AI Copy Generator</span>
          </button>

          <button
            onClick={() => setActiveTab("pos")}
            className={`w-full text-left p-3 rounded flex items-center gap-2.5 transition-colors ${
              activeTab === "pos"
                ? "bg-[var(--wine)] text-white font-bold"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <CreditCard className="h-4 w-4 text-[var(--gold)]" />
            <span>9. Point of Sale (POS)</span>
          </button>
        </aside>

        {/* Content View Workspace */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-950">
          {/* TAB 1: Dashboard Overview */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-white">
                    Admin Dashboard & Metrics
                  </h1>
                  <p className="text-xs text-slate-400">
                    Live store sales performance, inventory intelligence & order fulfillment
                  </p>
                </div>
                <button
                  onClick={refreshData}
                  className="bg-slate-900 border border-slate-800 text-xs px-3 py-2 rounded flex items-center gap-1.5 hover:bg-slate-800"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-[var(--gold)]" />
                  <span>Refresh Metrics</span>
                </button>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-5 bg-slate-900 border border-slate-800 rounded space-y-2">
                  <div className="text-slate-400 font-bold uppercase tracking-wider">
                    Gross Sales Revenue
                  </div>
                  <div className="font-serif text-3xl font-bold text-emerald-400">
                    ${totalSalesUsd.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    ₹{Math.round(totalSalesUsd * 83.5).toLocaleString()} INR
                  </div>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded space-y-2">
                  <div className="text-slate-400 font-bold uppercase tracking-wider">
                    Total Customer Orders
                  </div>
                  <div className="font-serif text-3xl font-bold text-white">{orders.length}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">
                    100% Verified Payment
                  </div>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded space-y-2">
                  <div className="text-slate-400 font-bold uppercase tracking-wider">
                    Active Catalog Products
                  </div>
                  <div className="font-serif text-3xl font-bold text-white">{products.length}</div>
                  <div className="text-[10px] text-slate-400">across 28 Saree Categories</div>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded space-y-2">
                  <div className="text-slate-400 font-bold uppercase tracking-wider">
                    Low Stock Intelligence
                  </div>
                  <div className="font-serif text-3xl font-bold text-amber-400">
                    {lowStockProducts.length}
                  </div>
                  <div className="text-[10px] text-amber-500 font-semibold">
                    Stock quantity &lt;= 3
                  </div>
                </div>
              </div>

              {/* Low Stock Alerts Box */}
              {lowStockProducts.length > 0 && (
                <div className="p-5 bg-amber-950/40 border border-amber-800/60 rounded text-xs space-y-3">
                  <div className="font-bold text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>
                      Low Stock Intelligence Alerts ({lowStockProducts.length} Products Need
                      Replenishment)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {lowStockProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-slate-900 rounded border border-amber-900/40 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-serif font-bold text-white truncate max-w-[180px]">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-slate-400">SKU: {p.sku}</div>
                        </div>
                        <span className="bg-amber-900 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                          {p.stockQuantity} Left
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Product Catalog Manager */}
          {activeTab === "catalog" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-white">
                    Master Product Catalog ({products.length})
                  </h1>
                  <p className="text-xs text-slate-400">
                    Manage SKU records, stock quantities, and availability status
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search SKU or name..."
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    className="p-2 bg-slate-900 border border-slate-800 rounded text-xs text-white placeholder:text-slate-500 focus:outline-none"
                  />
                  <select
                    value={catalogCategory}
                    onChange={(e) => setCatalogCategory(e.target.value)}
                    className="p-2 bg-slate-900 border border-slate-800 rounded text-xs text-white focus:outline-none"
                  >
                    <option value="">All Categories</option>
                    {CATEGORY_FILTERS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-slate-900 border border-slate-800 rounded overflow-x-auto text-xs">
                <table className="w-full text-left divide-y divide-slate-800">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Product / SKU</th>
                      <th className="p-3">Category / Fabric</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {products
                      .filter((p) => {
                        if (catalogCategory && p.category !== catalogCategory) return false;
                        if (catalogSearch.trim()) {
                          const q = catalogSearch.toLowerCase();
                          return (
                            p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q)
                          );
                        }
                        return true;
                      })
                      .map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/50">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="h-10 w-8 object-cover rounded border border-slate-700"
                              />
                              <div>
                                <div className="font-serif font-bold text-white truncate max-w-xs">
                                  {p.name}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  SKU: {p.sku || p.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div>{p.category}</div>
                            <div className="text-[10px] text-slate-500">{p.fabric}</div>
                          </td>
                          <td className="p-3 font-bold text-emerald-400">${p.priceUsd}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  backendDB.adjustStock(p.id, -1, "Manual deduction via Admin Table");
                                  refreshData();
                                }}
                                className="w-5 h-6 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-xs flex items-center justify-center font-bold"
                                title="Decrease stock by 1"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min={0}
                                value={p.stockQuantity ?? p.stock ?? 0}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  const current = p.stockQuantity ?? p.stock ?? 0;
                                  backendDB.adjustStock(p.id, val - current, "Direct count update");
                                  refreshData();
                                }}
                                className="w-12 p-1 bg-slate-950 border border-slate-800 rounded font-mono text-center text-xs text-white"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  backendDB.adjustStock(p.id, 1, "Manual restock via Admin Table");
                                  refreshData();
                                }}
                                className="w-5 h-6 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-xs flex items-center justify-center font-bold"
                                title="Increase stock by 1"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                (p.stockQuantity ?? 1) > 0
                                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                  : "bg-red-950 text-red-300 border border-red-800"
                              }`}
                            >
                              {p.availability || "Available"}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteProd(p.id)}
                              className="p-1.5 text-red-400 hover:bg-red-950 rounded"
                              title="Delete Product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Tabbed Add Product Form */}
          {activeTab === "add-product" && (
            <AddProductTabbedForm
              onCreated={() => {
                refreshData();
                setActiveTab("catalog");
              }}
            />
          )}

          {/* TAB 4: CSV Bulk Upload Engine */}
          {activeTab === "csv-import" && (
            <div className="space-y-6 animate-in fade-in max-w-3xl">
              <div>
                <h1 className="font-serif text-2xl font-bold text-white">
                  CSV Bulk Product Upload Engine
                </h1>
                <p className="text-xs text-slate-400">
                  Upload CSV file to import hundreds of sarees in one batch
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded space-y-4 text-xs">
                <label className="font-bold block text-slate-300">
                  Paste CSV Contents (or Drag & Drop)
                </label>
                <textarea
                  rows={8}
                  placeholder={`SKU, Product Name, Category, Fabric, Price, Stock\nEBS-101, Crimson Banarasi Katan, Banarasi, Silk, 580, 5\nEBS-102, Gold Tissue Saree, Tissue, Silk, 420, 3`}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded font-mono text-xs text-white focus:outline-none focus:border-[var(--gold)]"
                />

                <button
                  onClick={handleRunCSVImport}
                  className="bg-[var(--gold)] text-slate-950 px-6 py-3 font-bold uppercase tracking-wider text-xs rounded hover:bg-white transition-colors"
                >
                  Validate & Run CSV Import
                </button>

                {csvResult && (
                  <div className="p-4 bg-slate-950 rounded border border-slate-800 space-y-2">
                    <div className="text-emerald-400 font-bold">
                      Successfully imported {csvResult.importedCount} products!
                    </div>
                    {csvResult.errors.length > 0 && (
                      <div className="text-red-400 text-[11px] space-y-1">
                        <div>Errors / Warnings:</div>
                        {csvResult.errors.map((err, idx) => (
                          <div key={idx}>• {err}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: Orders Management & State Machine */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h1 className="font-serif text-2xl font-bold text-white">
                  Order Management & Fulfillment ({orders.length})
                </h1>
                <p className="text-xs text-slate-400">
                  Update order fulfillment status, print invoice, and dispatch courier tracking
                </p>
              </div>

              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-slate-900 border border-slate-800 p-5 rounded space-y-4 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                      <div>
                        <div className="font-mono font-bold text-sm text-[var(--gold)]">
                          {ord.id}
                        </div>
                        <div className="text-slate-400 text-[10px]">
                          Customer: {ord.customerName} ({ord.email})
                        </div>
                      </div>

                      {/* Order Status State Machine Switcher */}
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Fulfillment Status:</span>
                        <select
                          value={ord.status}
                          onChange={(e) =>
                            handleUpdateStatus(ord.id, e.target.value as OrderStatus)
                          }
                          className="p-1.5 bg-slate-950 border border-slate-700 rounded font-bold text-xs text-emerald-400 focus:outline-none"
                        >
                          <option value="Pending Payment">Pending Payment</option>
                          <option value="Paid">Paid</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Returned">Returned</option>
                          <option value="RTO">RTO</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="font-semibold text-slate-300">Items Ordered:</div>
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-slate-400">
                          <span>
                            {it.productName} (x{it.quantity})
                          </span>
                          <span className="font-bold text-white">${it.priceUsd * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-slate-400 gap-2">
                      <div>
                        Address:{" "}
                        <span className="text-white font-medium">{ord.shippingAddress}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span>AWB: {ord.awbNumber || "N/A"}</span>
                        <span>Courier: {ord.courierPartner || "Shiprocket Air"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Shipping & Courier Serviceability Engine */}
          {activeTab === "shipping" && (
            <div className="space-y-6 animate-in fade-in max-w-3xl">
              <div>
                <h1 className="font-serif text-2xl font-bold text-white">
                  Shipping & Courier Serviceability Engine
                </h1>
                <p className="text-xs text-slate-400">
                  Test pincode express air serviceability and courier SLA timeline
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Pincode to Test</label>
                    <input
                      type="text"
                      value={testPincode}
                      onChange={(e) => setTestPincode(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Order Total ($)</label>
                    <input
                      type="text"
                      value={testOrderVal}
                      onChange={(e) => setTestOrderVal(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCheckPincode}
                  className="bg-[var(--gold)] text-slate-950 px-6 py-2.5 font-bold uppercase tracking-wider rounded"
                >
                  Test Courier Air Serviceability
                </button>

                {pincodeResult && (
                  <div className="p-4 bg-slate-950 rounded border border-slate-800 space-y-2 text-xs">
                    <div>
                      City / State:{" "}
                      <strong>
                        {pincodeResult.city}, {pincodeResult.state}
                      </strong>
                    </div>
                    <div>
                      Air Serviceable:{" "}
                      <span className="text-emerald-400 font-bold">
                        YES (Shiprocket / DHL Express)
                      </span>
                    </div>
                    <div>
                      Est. Delivery:{" "}
                      <span className="text-emerald-400 font-mono font-bold">
                        {pincodeResult.estimatedDays} Business Days
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: Razorpay Reconciliation */}
          {activeTab === "payments" && (
            <div className="space-y-6 animate-in fade-in max-w-4xl">
              <div>
                <h1 className="font-serif text-2xl font-bold text-white">
                  Razorpay Payment Reconciliation & Webhook Log
                </h1>
                <p className="text-xs text-slate-400">
                  Verify 256-bit payment signatures and capture status
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded space-y-3 text-xs">
                <div className="font-bold text-slate-300 border-b border-slate-800 pb-2">
                  Razorpay Transaction Ledger
                </div>
                <div className="space-y-2 font-mono text-[11px]">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="p-3 bg-slate-950 rounded border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-white font-bold">
                          {o.paymentId || "pay_RzpSimulated"}
                        </div>
                        <div className="text-slate-500">
                          Order: {o.id} · {o.customerName}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold">
                          ₹{Math.round(o.subtotalUsd * 83.5).toLocaleString()}
                        </div>
                        <span className="bg-emerald-950 text-emerald-300 text-[9px] px-2 py-0.5 rounded uppercase font-bold">
                          Captured
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: AI Product Copy Generator */}
          {activeTab === "ai-copy" && (
            <div className="space-y-6 animate-in fade-in max-w-3xl">
              <div>
                <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                  <Bot className="h-6 w-6 text-[var(--gold)]" />
                  <span>AI Product Copywriting Generator</span>
                </h1>
                <p className="text-xs text-slate-400">
                  Generate SEO titles, full description, highlights, and Instagram captions
                  instantly
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Product Name</label>
                    <input
                      type="text"
                      value={aiName}
                      onChange={(e) => setAiName(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Fabric</label>
                    <input
                      type="text"
                      value={aiFabric}
                      onChange={(e) => setAiFabric(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Craft / Weave</label>
                    <input
                      type="text"
                      value={aiCraft}
                      onChange={(e) => setAiCraft(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Colour</label>
                    <input
                      type="text"
                      value={aiColor}
                      onChange={(e) => setAiColor(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAICopy}
                  className="bg-[var(--gold)] text-slate-950 px-6 py-2.5 font-bold uppercase tracking-wider rounded"
                >
                  Generate AI Copy & SEO Data
                </button>

                {aiGeneratedCopy && (
                  <div className="p-5 bg-slate-950 rounded border border-slate-800 space-y-3 text-xs">
                    <div>
                      <strong className="text-[var(--gold)] block mb-1">SEO Title:</strong>
                      <span className="text-white font-mono">{aiGeneratedCopy.seoTitle}</span>
                    </div>

                    <div>
                      <strong className="text-[var(--gold)] block mb-1">Full Description:</strong>
                      <span className="text-slate-300">{aiGeneratedCopy.fullDescription}</span>
                    </div>

                    <div>
                      <strong className="text-[var(--gold)] block mb-1">Instagram Caption:</strong>
                      <span className="text-emerald-300 font-mono">
                        {aiGeneratedCopy.instagramCaption}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 9: Point of Sale (POS) Terminal */}
          {activeTab === "pos" && (
            <POSTerminal products={products} onSaleCompleted={refreshData} />
          )}
        </main>
      </div>
    </div>
  );
}

// 7-Tab Add Product Component
function AddProductTabbedForm({ onCreated }: { onCreated: () => void }) {
  const [formTab, setFormTab] = useState<
    "basic" | "pricing" | "inventory" | "attributes" | "images" | "seo"
  >("basic");
  const [name, setName] = useState("Royal Purple Katan Banarasi Saree");
  const [sku, setSku] = useState("EBS-NEW-701");
  const [category, setCategory] = useState("Banarasi");
  const [fabric, setFabric] = useState("Katan");
  const [color, setColor] = useState("Purple");
  const [priceUsd, setPriceUsd] = useState("640");
  const [stock, setStock] = useState("5");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    backendDB.addProduct({
      sku,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category,
      productType: category,
      fabric,
      color,
      priceUsd: parseFloat(priceUsd) || 500,
      stockQuantity: parseInt(stock) || 1,
      availability: "Available",
      vendor: "Ethnic Boutique Admin",
      image:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
      swatches: ["#9333ea", "#d4af37"],
      shortDescription: `Handcrafted ${color} ${fabric} saree.`,
      fullDescription: `Authentic ${name} in rich ${fabric}.`,
    });
    onCreated();
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-3xl">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">7-Tab Add Product Engine</h1>
        <p className="text-xs text-slate-400">Complete structured entry for Master Database</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded p-6">
        <div className="flex border-b border-slate-800 pb-3 gap-2 overflow-x-auto text-xs">
          {[
            { id: "basic", label: "1. Basic Info" },
            { id: "pricing", label: "2. Pricing" },
            { id: "inventory", label: "3. Inventory" },
            { id: "attributes", label: "4. Attributes" },
            { id: "images", label: "5. Media" },
            { id: "seo", label: "6. SEO Engine" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFormTab(t.id as any)}
              className={`px-3 py-1.5 rounded font-bold transition-colors ${
                formTab === t.id
                  ? "bg-[var(--gold)] text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
          {formTab === "basic" && (
            <div className="space-y-3">
              <div>
                <label className="font-bold block mb-1 text-slate-300">Product Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1 text-slate-300">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-white"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1 text-slate-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white"
                  >
                    {CATEGORY_FILTERS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {formTab === "pricing" && (
            <div className="space-y-3">
              <div>
                <label className="font-bold block mb-1 text-slate-300">Selling Price ($ USD)</label>
                <input
                  type="text"
                  required
                  value={priceUsd}
                  onChange={(e) => setPriceUsd(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-emerald-400"
                />
              </div>
            </div>
          )}

          {formTab === "inventory" && (
            <div className="space-y-3">
              <div>
                <label className="font-bold block mb-1 text-slate-300">Stock Quantity</label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-white"
                />
              </div>
            </div>
          )}

          {formTab === "attributes" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1 text-slate-300">Fabric</label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white"
                />
              </div>
              <div>
                <label className="font-bold block mb-1 text-slate-300">Colour</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white"
                />
              </div>
            </div>
          )}

          {formTab === "images" && (
            <div className="p-4 bg-slate-950 rounded border border-slate-800 text-center text-slate-400">
              Primary Image preview configured automatically.
            </div>
          )}

          {formTab === "seo" && (
            <div className="p-4 bg-slate-950 rounded border border-slate-800 text-center text-slate-400">
              SEO Title & Meta Tags auto-generated from product title.
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 bg-[var(--gold)] text-slate-950 py-3 font-bold uppercase tracking-wider text-xs rounded hover:bg-white transition-colors"
          >
            Save & Publish Product Record
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// POINT OF SALE (POS) IN-STORE RETAIL SYSTEM
// ==========================================
function POSTerminal({
  products,
  onSaleCompleted,
}: {
  products: Product[];
  onSaleCompleted: () => void;
}) {
  const [posSearch, setPosSearch] = useState("");
  const [posCategory, setPosCategory] = useState("All");
  const [cart, setCart] = useState<Array<{ product: Product; qty: number }>>([]);
  const [walkIn, setWalkIn] = useState(true);
  const [customerName, setCustomerName] = useState("Walk-in Guest");
  const [customerPhone, setCustomerPhone] = useState("+91 98200 12345");
  const [customerEmail, setCustomerEmail] = useState("guest@muncreation.com");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "upi">("upi");
  const [cashTendered, setCashTendered] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSale, setCompletedSale] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const categories = ["All", ...CATEGORY_FILTERS];

  const filtered = products.filter((p) => {
    const matchesCat = posCategory === "All" || p.category === posCategory;
    const matchesSearch =
      !posSearch.trim() ||
      p.name.toLowerCase().includes(posSearch.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(posSearch.toLowerCase())) ||
      (p.fabric && p.fabric.toLowerCase().includes(posSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setErrorMessage("");
    const available = product.stockQuantity ?? product.stock ?? 0;
    if (available <= 0) {
      setErrorMessage(`Cannot add "${product.name}" - out of stock.`);
      return;
    }
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx >= 0) {
        if (prev[idx].qty >= available) {
          setErrorMessage(`Only ${available} unit(s) available for "${product.name}".`);
          return prev;
        }
        const updated = [...prev];
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + 1 };
        return updated;
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setErrorMessage("");
    setCart((prev) => {
      return prev
        .map((i) => {
          if (i.product.id === id) {
            const nextQty = i.qty + delta;
            const max = i.product.stockQuantity ?? i.product.stock ?? 0;
            if (nextQty > max) {
              setErrorMessage(`Only ${max} available in inventory.`);
              return i;
            }
            return { ...i, qty: nextQty };
          }
          return i;
        })
        .filter((i) => i.qty > 0);
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  };

  // Pricing calculations
  const subtotalUsd = cart.reduce((sum, i) => sum + i.product.priceUsd * i.qty, 0);
  const discountUsd = Math.round(subtotalUsd * (discountPercent / 100));
  const taxableUsd = Math.max(0, subtotalUsd - discountUsd);
  const gstTaxUsd = Math.round(taxableUsd * 0.05); // 5% Handloom Silk GST
  const grandTotalUsd = taxableUsd + gstTaxUsd;
  const grandTotalInr = Math.round(grandTotalUsd * 83.5);

  const tenderedVal = parseFloat(cashTendered) || 0;
  const changeDueInr =
    paymentMethod === "cash" && tenderedVal > grandTotalInr ? tenderedVal - grandTotalInr : 0;

  const handleCheckoutSale = () => {
    if (cart.length === 0) {
      setErrorMessage("Please select at least one saree to complete retail sale.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const sale = backendDB.createPOSSale({
        customerName: walkIn ? "Walk-in Guest" : customerName.trim() || "Walk-in Guest",
        customerPhone: walkIn ? undefined : customerPhone,
        customerEmail: walkIn ? undefined : customerEmail,
        items: cart.map((i) => ({
          productId: i.product.id,
          quantity: i.qty,
        })),
        paymentMethod,
        tenderedAmountUsd: paymentMethod === "cash" ? Math.round(tenderedVal / 83.5) : undefined,
        notes: `Cashier: Senior Draper · Discount: ${discountPercent}%`,
      });

      setCompletedSale(sale);
      setCart([]);
      setCashTendered("");
      onSaleCompleted();
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to finalize POS sale.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top POS Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="font-serif text-xl font-bold text-white">
              In-Store POS Terminal — Mun Creations
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Flagship Retail Gallery · Terminal REG-01 · Integrated Inventory Sync
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800 font-mono text-slate-300">
            Cashier: <strong className="text-white">Senior Draper</strong>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800 font-mono text-[var(--gold)]">
            Rate: 1 USD = ₹83.50 INR
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-950 border border-red-800 text-red-300 text-xs rounded font-medium flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage("")} className="text-red-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Split Grid: Catalog on Left, Register Cart on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Product Selector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={posSearch}
                onChange={(e) => setPosSearch(e.target.value)}
                placeholder="Search catalog by name, fabric, or SKU code..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-[var(--gold)]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPosCategory(cat)}
                  className={`px-3 py-1 rounded font-medium whitespace-nowrap transition-colors ${
                    posCategory === cat
                      ? "bg-[var(--gold)] text-slate-950 font-bold"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map((product) => {
              const stock = product.stockQuantity ?? product.stock ?? 0;
              const isOut = stock <= 0;
              return (
                <button
                  key={product.id}
                  type="button"
                  disabled={isOut}
                  onClick={() => addToCart(product)}
                  className={`text-left p-2.5 rounded border transition-all flex flex-col justify-between ${
                    isOut
                      ? "bg-slate-900/40 border-slate-800/40 opacity-50 cursor-not-allowed"
                      : "bg-slate-900 border-slate-800 hover:border-[var(--gold)] hover:shadow-md cursor-pointer"
                  }`}
                >
                  <div className="relative w-full aspect-[3/4] rounded overflow-hidden mb-2 bg-slate-950">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        stock > 3
                          ? "bg-emerald-950/90 text-emerald-300 border border-emerald-800"
                          : stock > 0
                            ? "bg-amber-950/90 text-amber-300 border border-amber-800"
                            : "bg-red-950/90 text-red-300 border border-red-800"
                      }`}
                    >
                      {stock > 0 ? `${stock} in stock` : "Sold Out"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider line-clamp-1">
                      {product.category} · {product.fabric}
                    </div>
                    <div className="font-serif text-xs font-bold text-white line-clamp-1">
                      {product.name}
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-bold text-emerald-400">${product.priceUsd}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ₹{Math.round(product.priceUsd * 83.5).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Register & Invoice Tender (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded p-5 space-y-5">
          {/* Customer Selector */}
          <div className="space-y-3 pb-4 border-b border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider">
                Client Information
              </span>
              <button
                type="button"
                onClick={() => setWalkIn(!walkIn)}
                className="text-[var(--gold)] font-bold hover:underline"
              >
                {walkIn ? "+ Add Client Details" : "Mark as Walk-in"}
              </button>
            </div>

            {walkIn ? (
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Walk-in Customer (In-Store Boutique Guest)</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                  Anonymous
                </span>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="Client Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-white"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Current Cart Items Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Selected Sarees ({cart.reduce((s, i) => s + i.qty, 0)})</span>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCart([])}
                  className="text-red-400 hover:text-red-300 font-medium normal-case"
                >
                  Clear Register
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 bg-slate-950 rounded border border-slate-800/80">
                Register is empty. Tap any saree on the left to add.
              </div>
            ) : (
              <div className="divide-y divide-slate-800 max-h-56 overflow-y-auto bg-slate-950 rounded border border-slate-800 p-2">
                {cart.map(({ product, qty }) => (
                  <div key={product.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-8 object-cover rounded border border-slate-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate max-w-[140px]">
                          {product.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ${product.priceUsd} each
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-slate-800 rounded bg-slate-900">
                        <button
                          type="button"
                          onClick={() => updateQty(product.id, -1)}
                          className="px-2 py-0.5 text-xs text-slate-300 hover:bg-slate-800"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-white">{qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(product.id, 1)}
                          className="px-2 py-0.5 text-xs text-slate-300 hover:bg-slate-800"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-xs font-mono font-bold text-emerald-400 w-14 text-right">
                        ${product.priceUsd * qty}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-slate-500 hover:text-red-400"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Tender Method
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: "upi", label: "UPI / QR", icon: QrCode },
                { id: "card", label: "Card POS", icon: CreditCard },
                { id: "cash", label: "Cash", icon: DollarSign },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-2.5 rounded border text-center flex flex-col items-center gap-1.5 transition-colors ${
                      paymentMethod === m.id
                        ? "bg-[var(--gold)] text-slate-950 border-[var(--gold)] font-bold"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-inputs based on payment method */}
            {paymentMethod === "cash" && (
              <div className="pt-2 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <label className="text-slate-400">Cash Received (₹ INR):</label>
                  <input
                    type="number"
                    placeholder={`Min ₹${grandTotalInr}`}
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    className="w-36 p-1.5 bg-slate-950 border border-slate-800 rounded font-mono text-right text-white"
                  />
                </div>
                {changeDueInr > 0 && (
                  <div className="flex items-center justify-between font-bold text-emerald-400 font-mono">
                    <span>Change Due to Client:</span>
                    <span>₹{changeDueInr.toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === "upi" && (
              <div className="p-3 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-400 flex items-center gap-3">
                <div className="h-12 w-12 bg-white p-1 rounded shrink-0 flex items-center justify-center">
                  <QrCode className="h-10 w-10 text-slate-950" />
                </div>
                <div>
                  <div className="text-white font-bold">Dynamic Retail UPI QR</div>
                  <div className="font-mono text-emerald-400 text-xs">₹{grandTotalInr.toLocaleString()} INR</div>
                  <div className="text-[10px] text-slate-500">VPA: muncreations@icici</div>
                </div>
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="p-3 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-400 flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-[var(--gold)] shrink-0" />
                <div>
                  <div className="text-white font-bold">Swipe / Tap Card on POS Terminal</div>
                  <div className="text-[10px] text-slate-500">
                    Visa, Mastercard, RuPay, Amex accepted (EMV Chip / NFC)
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Discount & Totals Summary */}
          <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>VIP Privilege Discount:</span>
              <div className="flex items-center gap-1">
                {[0, 5, 10, 15].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDiscountPercent(d)}
                    className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                      discountPercent === d
                        ? "bg-[var(--wine)] text-white font-bold"
                        : "bg-slate-950 text-slate-400 border border-slate-800"
                    }`}
                  >
                    {d === 0 ? "None" : `${d}%`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span>Gross Saree Subtotal:</span>
              <span className="font-mono text-white">${subtotalUsd}</span>
            </div>

            {discountUsd > 0 && (
              <div className="flex items-center justify-between text-emerald-400">
                <span>Discount Applied ({discountPercent}%):</span>
                <span className="font-mono">-${discountUsd}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-slate-400">
              <span>Handloom Silk GST (5%):</span>
              <span className="font-mono text-white">${gstTaxUsd}</span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-baseline justify-between">
              <div>
                <div className="font-bold text-white text-sm">Grand Total Payable</div>
                <div className="text-[11px] font-mono text-[var(--gold)] font-bold">
                  ₹{grandTotalInr.toLocaleString()} INR
                </div>
              </div>
              <div className="font-serif text-2xl font-bold text-emerald-400">
                ${grandTotalUsd}
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            type="button"
            disabled={cart.length === 0 || isProcessing}
            onClick={handleCheckoutSale}
            className="w-full bg-[var(--gold)] text-slate-950 py-3 rounded font-bold uppercase tracking-wider text-xs hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isProcessing ? "Finalizing Invoice..." : "Complete In-Store Sale"}</span>
          </button>
        </div>
      </div>

      {/* Completed Sale Tax Invoice Modal */}
      {completedSale && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-950 rounded p-6 max-w-md w-full shadow-2xl space-y-4 text-xs font-sans">
            {/* Header */}
            <div className="text-center border-b border-slate-200 pb-4 space-y-1">
              <div className="font-serif text-xl font-bold tracking-tight text-[var(--wine-deep)]">
                Mun Creations
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                Luxury Handloom Saree Gallery
              </div>
              <div className="text-[11px] text-slate-600">
                Colaba Heritage Quarter, Mumbai 400001
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                GSTIN: 27AAECM9412L1Z4 · Tel: +91 98200 45678
              </div>
            </div>

            {/* Order Details */}
            <div className="flex items-center justify-between text-[11px] font-mono border-b border-slate-100 pb-2">
              <div>
                <div>
                  Invoice: <strong>{completedSale.id}</strong>
                </div>
                <div>Date: {new Date(completedSale.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div>Cashier: <strong>REG-01</strong></div>
                <div>Pay Mode: <strong className="uppercase">{completedSale.paymentMethod}</strong></div>
              </div>
            </div>

            {/* Client Info */}
            <div className="text-[11px] text-slate-700">
              Customer: <strong>{completedSale.customerName}</strong>
              {completedSale.phone && <span> · {completedSale.phone}</span>}
            </div>

            {/* Items Table */}
            <div className="border-t border-b border-slate-200 py-2 space-y-2">
              {completedSale.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div className="max-w-[200px]">
                    <div className="font-bold line-clamp-1">{item.productName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Qty: {item.quantity} × ${item.priceUsd}
                    </div>
                  </div>
                  <div className="font-mono font-bold">${item.priceUsd * item.quantity}</div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">${completedSale.subtotalUsd}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Handloom Silk GST (5% Included):</span>
                <span className="font-mono">${Math.round(completedSale.subtotalUsd * 0.05)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[var(--wine-deep)] pt-1 border-t border-slate-200">
                <span>Net Total:</span>
                <span className="font-mono">${completedSale.subtotalUsd} (₹{Math.round(completedSale.subtotalUsd * 83.5).toLocaleString()})</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-500 pt-2">
              Silk Mark Certified · Thank you for supporting Indian Handloom Heritage
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="bg-slate-900 text-white py-2 rounded font-bold uppercase tracking-wider text-xs hover:bg-slate-800 flex items-center justify-center gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setCompletedSale(null)}
                className="bg-[var(--wine)] text-white py-2 rounded font-bold uppercase tracking-wider text-xs hover:opacity-90"
              >
                Next Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
