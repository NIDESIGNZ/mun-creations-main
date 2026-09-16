import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { backendDB, type Order, type OrderStatus } from "@/lib/backend-api";
import type { Product } from "@/lib/products";
import { invalidateCatalogCache } from "@/lib/catalog-client";
import { CATEGORY_FILTERS } from "@/lib/catalog";
import {
  adminLogin,
  adminVerify,
  adminLogout,
  getAdminProducts,
  getAdminCategories,
  getAdminInventory,
  type AdminProductStats,
} from "@/lib/admin-client";
import { ProductCatalogTable } from "@/components/admin/ProductCatalogTable";
import { ProductEditorModal } from "@/components/admin/ProductEditorModal";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { InventoryManager } from "@/components/admin/InventoryManager";
import { BulkCsvManager } from "@/components/admin/BulkCsvManager";
import { AuditLogViewer } from "@/components/admin/AuditLogViewer";
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
  Layers,
  History,
  ShieldCheck,
  FolderTree,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Master PMS & Enterprise Control Portal — Mun Creations" },
      {
        name: "description",
        content:
          "Production Master Product Management System (PMS) / CMS for Mun Creations luxury saree catalog, inventory, and order fulfillment.",
      },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    adminVerify()
      .then((isValid) => {
        if (isValid) setAuthenticated(true);
      })
      .finally(() => setCheckingAuth(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setPassError("");
    try {
      const res = await adminLogin(password);
      if (res.success) {
        setAuthenticated(true);
        setPassword("");
      } else {
        setPassError(res.error || "Incorrect password. Access denied.");
      }
    } catch (err: any) {
      setPassError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    setAuthenticated(false);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 text-[var(--gold)] animate-spin" />
          <div className="text-xs font-mono text-slate-400">Verifying administrator session...</div>
        </div>
      </div>
    );
  }

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
            <h1 className="font-serif text-2xl font-bold text-white">Enterprise CMS Portal</h1>
            <p className="text-xs text-slate-400">
              Authorized administrator access for catalog, inventory, and order operations.
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
                placeholder="Enter admin password..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)] font-mono"
              />
            </div>

            {passError && <div className="text-red-400 font-semibold">{passError}</div>}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-[var(--gold)] text-slate-950 py-3 text-xs font-bold uppercase tracking-wider rounded hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loggingIn && <RefreshCw className="h-4 w-4 animate-spin" />}
              <span>{loggingIn ? "Verifying..." : "Sign In to Admin Portal"}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminDashboardContent onLogout={handleLogout} />;
}

function AdminDashboardContent({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "catalog"
    | "categories"
    | "inventory"
    | "csv-import"
    | "audit-logs"
    | "orders"
    | "shipping"
    | "payments"
    | "ai-copy"
    | "pos"
  >("dashboard");

  const queryClient = useQueryClient();

  // Dynamic DB Data
  const [stats, setStats] = useState<AdminProductStats>({
    total: 0,
    active: 0,
    draft: 0,
    archived: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categoryNames, setCategoryNames] = useState<string[]>(CATEGORY_FILTERS);
  const [orders, setOrders] = useState<Order[]>(backendDB.getOrders());
  const [catalogKey, setCatalogKey] = useState(0);

  // Editor Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

  const refreshOverviewData = async () => {
    try {
      const prodRes = await getAdminProducts({ limit: 100 });
      setAllProducts(prodRes.products);
      if (prodRes.stats) setStats(prodRes.stats);

      const catRes = await getAdminCategories();
      if (catRes.length > 0) {
        const names = Array.from(new Set([...CATEGORY_FILTERS, ...catRes.map((c) => c.name)]));
        setCategoryNames(names);
      }

      setOrders(backendDB.getOrders());
      setCatalogKey((k) => k + 1);
      invalidateCatalogCache(queryClient);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refreshOverviewData();
  }, []);

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    backendDB.updateOrderStatus(orderId, status);
    setOrders(backendDB.getOrders());
  };

  const handleCheckPincode = () => {
    const res = backendDB.checkPincodeServiceability(testPincode, parseFloat(testOrderVal) || 0);
    setPincodeResult(res);
  };

  const handleGenerateAICopy = () => {
    const res = backendDB.generateAICopy(aiName, aiFabric, aiCraft, aiColor);
    setAiGeneratedCopy(res);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsEditorOpen(true);
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsEditorOpen(true);
  };

  const handleProductSaved = (saved: Product) => {
    refreshOverviewData();
  };

  const totalSalesUsd = orders.reduce(
    (s, o) => s + (o.status !== "Cancelled" ? o.subtotalUsd : 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-[var(--gold)] text-slate-950 flex items-center justify-center font-bold font-serif text-lg">
            M
          </div>
          <div>
            <div className="font-serif font-bold text-lg text-white">
              Mun Creations — Master PMS / CMS
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2">
              <span>Production Control Center</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <span>Unified Database Online</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={handleAddProduct}
            className="bg-[var(--gold)] hover:bg-white text-slate-950 font-bold px-3.5 py-1.5 rounded flex items-center gap-1.5 uppercase tracking-wider transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Saree</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded flex items-center gap-1.5 font-bold transition-colors"
          >
            <Eye className="h-3.5 w-3.5 text-[var(--gold)]" />
            <span>Live Storefront</span>
          </a>

          <button
            onClick={onLogout}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded font-bold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 space-y-4 shrink-0 text-xs font-semibold overflow-y-auto">
          {/* Section: Master Product Management */}
          <div className="space-y-1">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider px-3 pb-1 font-mono">
              Master Product System
            </div>

            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left p-2.5 rounded flex items-center gap-2.5 transition-colors ${
                activeTab === "dashboard"
                  ? "bg-[var(--wine)] text-white font-bold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>1. CMS Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("catalog")}
              className={`w-full text-left p-2.5 rounded flex items-center gap-2.5 transition-colors ${
                activeTab === "catalog"
                  ? "bg-[var(--wine)] text-white font-bold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Package className="h-4 w-4" />
              <span>2. Product Catalog ({stats.total})</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`w-full text-left p-2.5 rounded flex items-center gap-2.5 transition-colors ${
                activeTab === "categories"
                  ? "bg-[var(--wine)] text-white font-bold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <FolderTree className="h-4 w-4" />
              <span>3. Categories & Weaves</span>
            </button>

            <button
              onClick={() => setActiveTab("inventory")}
              className={`w-full text-left p-2.5 rounded flex items-center gap-2.5 transition-colors ${
                activeTab === "inventory"
                  ? "bg-[var(--wine)] text-white font-bold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Package className="h-4 w-4 text-amber-400" />
              <div className="flex-1 flex items-center justify-between">
                <span>4. Inventory Ledger</span>
                {stats.lowStock > 0 && (
                  <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded text-[10px] font-mono">
                    {stats.lowStock}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => setActiveTab("csv-import")}
              className={`w-full text-left p-2.5 rounded flex items-center gap-2.5 transition-colors ${
                activeTab === "csv-import"
                  ? "bg-[var(--wine)] text-white font-bold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Upload className="h-4 w-4" />
              <span>5. Bulk CSV Ingest</span>
            </button>

            <button
              onClick={() => setActiveTab("audit-logs")}
              className={`w-full text-left p-2.5 rounded flex items-center gap-2.5 transition-colors ${
                activeTab === "audit-logs"
                  ? "bg-[var(--wine)] text-white font-bold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <History className="h-4 w-4" />
              <span>6. System Audit Trail</span>
            </button>
          </div>

          {/* Section: Store Operations & POS */}
          <div className="space-y-1 pt-3 border-t border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider px-3 pb-1 font-mono">
              Store Operations
            </div>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left p-2.5 rounded flex items-center gap-2.5 transition-colors ${
                activeTab === "orders"
                  ? "bg-[var(--wine)] text-white font-bold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>7. Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("shipping")}
              className={`w-full text-left p-2.5 rounded flex items-center gap-2.5 transition-colors ${
                activeTab === "shipping"
                  ? "bg-[var(--wine)] text-white font-bold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Truck className="h-4 w-4" />
              <span>8. Shipping & Courier</span>
            </button>

            <button
              onClick={() => setActiveTab("payments")}
              className={`w-full text-left p-2.5 rounded flex items-center gap-2.5 transition-colors ${
                activeTab === "payments"
                  ? "bg-[var(--wine)] text-white font-bold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <CreditCard className="h-4 w-4" />
              <span>9. Razorpay Ledger</span>
            </button>

            <button
              onClick={() => setActiveTab("ai-copy")}
              className={`w-full text-left p-2.5 rounded flex items-center gap-2.5 transition-colors ${
                activeTab === "ai-copy"
                  ? "bg-[var(--wine)] text-white font-bold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Bot className="h-4 w-4 text-[var(--gold)]" />
              <span>10. AI Copywriter</span>
            </button>

            <button
              onClick={() => setActiveTab("pos")}
              className={`w-full text-left p-2.5 rounded flex items-center gap-2.5 transition-colors ${
                activeTab === "pos"
                  ? "bg-[var(--wine)] text-white font-bold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <CreditCard className="h-4 w-4 text-[var(--gold)]" />
              <span>11. Point of Sale POS</span>
            </button>
          </div>
        </aside>

        {/* Content View Workspace */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-950">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-white">
                    Master PMS Control Dashboard
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Real-time metrics from the unified database powering both storefront and physical boutique.
                  </p>
                </div>
                <button
                  onClick={refreshOverviewData}
                  className="bg-slate-800 hover:bg-slate-700 text-xs px-3.5 py-2 rounded flex items-center gap-1.5 border border-slate-700 font-bold self-start sm:self-auto"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-[var(--gold)]" />
                  <span>Refresh Metrics</span>
                </button>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div
                  onClick={() => setActiveTab("catalog")}
                  className="p-5 bg-slate-900 border border-slate-800 rounded space-y-2 cursor-pointer hover:border-[var(--gold)] transition-colors"
                >
                  <div className="text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>Total Saree Catalog</span>
                    <Package className="h-4 w-4 text-[var(--gold)]" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-white">{stats.total}</div>
                  <div className="text-[11px] text-emerald-400 font-medium">
                    {stats.active} Published • {stats.draft} Drafts
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("inventory")}
                  className="p-5 bg-slate-900 border border-slate-800 rounded space-y-2 cursor-pointer hover:border-amber-400 transition-colors"
                >
                  <div className="text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>Low Stock Warnings</span>
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-amber-400">
                    {stats.lowStock}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {stats.outOfStock} out of stock items
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("orders")}
                  className="p-5 bg-slate-900 border border-slate-800 rounded space-y-2 cursor-pointer hover:border-emerald-400 transition-colors"
                >
                  <div className="text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>Customer Orders</span>
                    <ShoppingBag className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-white">{orders.length}</div>
                  <div className="text-[11px] text-emerald-400 font-medium">
                    Verified Checkout Records
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("payments")}
                  className="p-5 bg-slate-900 border border-slate-800 rounded space-y-2 cursor-pointer hover:border-emerald-400 transition-colors"
                >
                  <div className="text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>Gross Store Sales</span>
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-emerald-400">
                    ${totalSalesUsd.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    ₹{Math.round(totalSalesUsd * 83.5).toLocaleString()} INR
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded space-y-3">
                <div className="font-bold text-white text-sm">Quick Administrative Actions</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <button
                    onClick={handleAddProduct}
                    className="p-3 bg-slate-950 border border-slate-800 rounded hover:border-[var(--gold)] text-left space-y-1 transition-colors"
                  >
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Plus className="h-4 w-4 text-[var(--gold)]" />
                      <span>Add Product</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Create new saree with 11 specs</div>
                  </button>

                  <button
                    onClick={() => setActiveTab("csv-import")}
                    className="p-3 bg-slate-950 border border-slate-800 rounded hover:border-[var(--gold)] text-left space-y-1 transition-colors"
                  >
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Upload className="h-4 w-4 text-[var(--gold)]" />
                      <span>Bulk CSV</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Import hundreds of sarees</div>
                  </button>

                  <button
                    onClick={() => setActiveTab("categories")}
                    className="p-3 bg-slate-950 border border-slate-800 rounded hover:border-[var(--gold)] text-left space-y-1 transition-colors"
                  >
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <FolderTree className="h-4 w-4 text-[var(--gold)]" />
                      <span>Categories</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Manage weaves & taxonomy</div>
                  </button>

                  <button
                    onClick={() => setActiveTab("inventory")}
                    className="p-3 bg-slate-950 border border-slate-800 rounded hover:border-[var(--gold)] text-left space-y-1 transition-colors"
                  >
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Package className="h-4 w-4 text-[var(--gold)]" />
                      <span>Adjust Stock</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Log stock movements & audits</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MASTER CATALOG */}
          {activeTab === "catalog" && (
            <ProductCatalogTable
              key={catalogKey}
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
              categories={categoryNames}
            />
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === "categories" && (
            <CategoryManager onCategoriesChanged={refreshOverviewData} />
          )}

          {/* TAB 4: INVENTORY */}
          {activeTab === "inventory" && <InventoryManager />}

          {/* TAB 5: BULK CSV */}
          {activeTab === "csv-import" && (
            <BulkCsvManager onImportCompleted={refreshOverviewData} />
          )}

          {/* TAB 6: AUDIT LOGS */}
          {activeTab === "audit-logs" && <AuditLogViewer />}

          {/* TAB 7: ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-white">
                    Order Management & Fulfillment ({orders.length})
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Update order fulfillment status, print invoices, and monitor courier tracking.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-slate-900 border border-slate-800 p-5 rounded space-y-4 text-xs shadow-sm"
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

          {/* TAB 8: SHIPPING */}
          {activeTab === "shipping" && (
            <div className="space-y-6 animate-in fade-in max-w-3xl">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded">
                <h1 className="font-serif text-2xl font-bold text-white">
                  Shipping & Courier Serviceability Engine
                </h1>
                <p className="text-xs text-slate-400 mt-1">
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

          {/* TAB 9: PAYMENTS */}
          {activeTab === "payments" && (
            <div className="space-y-6 animate-in fade-in max-w-4xl">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded">
                <h1 className="font-serif text-2xl font-bold text-white">
                  Razorpay Payment Reconciliation & Webhook Log
                </h1>
                <p className="text-xs text-slate-400 mt-1">
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

          {/* TAB 10: AI COPY */}
          {activeTab === "ai-copy" && (
            <div className="space-y-6 animate-in fade-in max-w-3xl">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded">
                <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                  <Bot className="h-6 w-6 text-[var(--gold)]" />
                  <span>AI Product Copywriting Generator</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Generate SEO titles, descriptions, highlights, and Instagram captions
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

          {/* TAB 11: POS TERMINAL */}
          {activeTab === "pos" && (
            <POSTerminal products={allProducts} onSaleCompleted={refreshOverviewData} />
          )}
        </main>
      </div>

      {/* MASTER PRODUCT EDITOR MODAL */}
      <ProductEditorModal
        isOpen={isEditorOpen}
        product={editingProduct}
        onClose={() => setIsEditorOpen(false)}
        onSaved={handleProductSaved}
        categories={categoryNames}
      />
    </div>
  );
}

// POS Terminal Component
function POSTerminal({
  products,
  onSaleCompleted,
}: {
  products: Product[];
  onSaleCompleted: () => void;
}) {
  const [posSearch, setPosSearch] = useState("");
  const [posCategory, setPosCategory] = useState("All");
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [walkIn, setWalkIn] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | "card">("upi");
  const [cashTendered, setCashTendered] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSale, setCompletedSale] = useState<any>(null);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    if (posCategory !== "All" && p.category !== posCategory) return false;
    if (posSearch.trim()) {
      const q = posSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.product.id === productId) {
            const newQty = i.qty + delta;
            return newQty > 0 ? { ...i, qty: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as { product: Product; qty: number }[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const subtotalUsd = cart.reduce((sum, item) => sum + item.product.priceUsd * item.qty, 0);
  const discountUsd = Math.round((subtotalUsd * discountPercent) / 100);
  const taxableSubtotalUsd = subtotalUsd - discountUsd;
  const gstTaxUsd = Math.round(taxableSubtotalUsd * 0.05);
  const grandTotalUsd = taxableSubtotalUsd + gstTaxUsd;
  const grandTotalInr = Math.round(grandTotalUsd * 83.5);
  const changeDueInr =
    paymentMethod === "cash" && cashTendered
      ? Math.max(0, parseInt(cashTendered, 10) - grandTotalInr)
      : 0;

  const handleCheckoutSale = () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      const clientName = walkIn ? "In-Store Guest (Walk-in)" : customerName || "Boutique Guest";
      const saleRecord = {
        id: `POS-${Date.now().toString().slice(-6)}`,
        customerName: clientName,
        phone: customerPhone,
        email: customerEmail,
        items: cart.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.qty,
          priceUsd: i.product.priceUsd,
        })),
        subtotalUsd: grandTotalUsd,
        paymentMethod,
        createdAt: new Date().toISOString(),
      };

      // Deduct inventory
      cart.forEach((item) => {
        backendDB.adjustStock(item.product.id, -item.qty, `POS In-Store Sale (${saleRecord.id})`);
      });

      setIsProcessing(false);
      setCompletedSale(saleRecord);
      setCart([]);
      onSaleCompleted();
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-[var(--gold)]" />
            <span>Point of Sale (POS) — Boutique Retail Terminal</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Instant in-store billing with real-time catalog stock synchronization.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Product Selector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
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
              const stock = product.stockQuantity ?? 0;
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
                      src={product.image || "/images/placeholder.jpg"}
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
                        ₹{product.priceInr || Math.round(product.priceUsd * 83.5).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Register (5 cols) */}
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

          {/* Cart Items */}
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
                        src={product.image || "/images/placeholder.jpg"}
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
                  <div className="font-mono text-emerald-400 text-xs">
                    ₹{grandTotalInr.toLocaleString()} INR
                  </div>
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

            <div className="flex items-center justify-between text-[11px] font-mono border-b border-slate-100 pb-2">
              <div>
                <div>
                  Invoice: <strong>{completedSale.id}</strong>
                </div>
                <div>Date: {new Date(completedSale.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div>Cashier: <strong>REG-01</strong></div>
                <div>
                  Pay Mode: <strong className="uppercase">{completedSale.paymentMethod}</strong>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-700">
              Customer: <strong>{completedSale.customerName}</strong>
              {completedSale.phone && <span> · {completedSale.phone}</span>}
            </div>

            <div className="border-t border-b border-slate-200 py-2 space-y-2">
              {completedSale.items.map((item: any, idx: number) => (
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
                <span className="font-mono">
                  ${completedSale.subtotalUsd} (₹
                  {Math.round(completedSale.subtotalUsd * 83.5).toLocaleString()})
                </span>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-500 pt-2">
              Silk Mark Certified · Thank you for supporting Indian Handloom Heritage
            </div>

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
