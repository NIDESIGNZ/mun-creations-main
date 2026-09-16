import { useState, useEffect } from "react";
import type { Product } from "@/lib/products";
import {
  getAdminInventory,
  adjustAdminStock,
  getAdminProducts,
  type InventoryMovement,
  type AdminProductStats,
} from "@/lib/admin-client";
import {
  Package,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Search,
  Plus,
  Minus,
  Check,
  X,
  History,
  ShieldAlert,
} from "lucide-react";

export function InventoryManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<AdminProductStats | null>(null);
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Adjustment Modal
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [delta, setDelta] = useState<number>(0);
  const [reason, setReason] = useState<string>("Restock shipment");
  const [customReason, setCustomReason] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const invRes = await getAdminInventory();
      setStats(invRes.stats);
      setLowStockItems(invRes.lowStockItems);
      setMovements(invRes.movements);

      const prodRes = await getAdminProducts({ limit: 100 });
      setProducts(prodRes.products);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdjust = (prod: Product) => {
    setAdjustingProduct(prod);
    setDelta(0);
    setReason("Restock shipment");
    setCustomReason("");
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;
    if (delta === 0) {
      alert("Adjustment delta must be non-zero (e.g. +5 to restock, -1 for shrinkage).");
      return;
    }

    const finalReason = reason === "Other" ? customReason.trim() || "Manual correction" : reason;

    setSubmitting(true);
    try {
      await adjustAdminStock(adjustingProduct.id, delta, finalReason);
      setToastMsg(`Stock updated for "${adjustingProduct.name}" (${delta > 0 ? `+${delta}` : delta})`);
      setTimeout(() => setToastMsg(null), 3500);
      setAdjustingProduct(null);
      await loadData();
    } catch (err: any) {
      alert(`Adjustment failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 text-xs text-slate-200">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded shadow-2xl z-50 flex items-center gap-2">
          <Check className="h-4 w-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-bold text-white">
              Real-Time Inventory Intelligence & Stock Ledger
            </h2>
          </div>
          <p className="text-slate-400 mt-1">
            Real-time multi-location inventory levels, low-stock threshold alerts, and auditable movement tracking.
          </p>
        </div>

        <button
          onClick={loadData}
          className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3.5 py-2 rounded flex items-center gap-1.5 self-start md:self-auto border border-slate-700"
        >
          <RefreshCw className="h-3.5 w-3.5 text-[var(--gold)]" />
          <span>Sync Stock</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded space-y-1">
          <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            Catalog SKUs Monitored
          </div>
          <div className="font-serif text-3xl font-bold text-white">{stats?.total ?? products.length}</div>
          <div className="text-[10px] text-slate-400">All registered saree items</div>
        </div>

        <div className="p-4 bg-slate-900 border border-amber-900/40 rounded space-y-1">
          <div className="text-amber-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Low Stock Warnings</span>
          </div>
          <div className="font-serif text-3xl font-bold text-amber-400">
            {stats?.lowStock ?? lowStockItems.length}
          </div>
          <div className="text-[10px] text-amber-400/80">Stock &le; 2 units remaining</div>
        </div>

        <div className="p-4 bg-slate-900 border border-red-900/40 rounded space-y-1">
          <div className="text-red-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Out of Stock (Depleted)</span>
          </div>
          <div className="font-serif text-3xl font-bold text-red-400">
            {stats?.outOfStock ?? 0}
          </div>
          <div className="text-[10px] text-red-400/80">Orders blocked on storefront</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded space-y-1">
          <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            Total Units in Circulation
          </div>
          <div className="font-serif text-3xl font-bold text-emerald-400">
            {products.reduce((s, p) => s + (p.stockQuantity ?? 0), 0)}
          </div>
          <div className="text-[10px] text-slate-400">Across all active batches</div>
        </div>
      </div>

      {/* Low Stock Urgent Alert Banner */}
      {lowStockItems.length > 0 && (
        <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Urgent Restock Action Required:</span>{" "}
              {lowStockItems.length} products have reached critical inventory thresholds.
            </div>
          </div>
        </div>
      )}

      {/* Stock Levels Table */}
      <div className="bg-slate-900 border border-slate-800 rounded overflow-hidden shadow-md space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
            <Package className="h-4 w-4 text-[var(--gold)]" />
            <span>Product Inventory Levels</span>
          </h3>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by SKU or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[var(--gold)]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800 text-[11px]">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Category</th>
                <th className="p-3">Units Available</th>
                <th className="p-3">Threshold</th>
                <th className="p-3">Health Status</th>
                <th className="p-3 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredProducts.map((p) => {
                const qty = p.stockQuantity ?? 0;
                const isOut = qty <= 0;
                const isLow = qty <= (p.lowStockThreshold || 2);

                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-sans font-medium text-white">{p.name}</td>
                    <td className="p-3 text-slate-400">{p.sku || "—"}</td>
                    <td className="p-3 font-sans text-slate-300">{p.category}</td>
                    <td className="p-3 text-base font-bold text-white">{qty}</td>
                    <td className="p-3 text-slate-400">&le; {p.lowStockThreshold || 2}</td>
                    <td className="p-3 font-sans">
                      {isOut ? (
                        <span className="bg-red-900/40 text-red-400 border border-red-800/50 px-2 py-0.5 rounded font-bold text-[10px]">
                          Depleted
                        </span>
                      ) : isLow ? (
                        <span className="bg-amber-900/40 text-amber-400 border border-amber-800/50 px-2 py-0.5 rounded font-bold text-[10px]">
                          Low Stock
                        </span>
                      ) : (
                        <span className="bg-emerald-900/40 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded font-bold text-[10px]">
                          Healthy
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleOpenAdjust(p)}
                        className="bg-slate-800 hover:bg-[var(--gold)] hover:text-slate-950 text-slate-200 font-sans font-bold px-3 py-1.5 rounded transition-colors text-xs inline-flex items-center gap-1.5"
                      >
                        <span>Adjust Stock</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Auditable Inventory Movements Ledger */}
      <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-[var(--gold)]" />
            <h3 className="font-serif text-base font-bold text-white">
              Auditable Inventory Movements Ledger
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Last 100 movements recorded</span>
        </div>

        {movements.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No stock movements logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Date & Time</th>
                  <th className="p-2.5">Product / SKU</th>
                  <th className="p-2.5">Reason</th>
                  <th className="p-2.5">Delta</th>
                  <th className="p-2.5">Change</th>
                  <th className="p-2.5">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {movements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/30">
                    <td className="p-2.5 text-slate-400">{new Date(m.timestamp).toLocaleString()}</td>
                    <td className="p-2.5 font-sans font-medium text-white truncate max-w-xs">
                      {m.productName} <span className="text-slate-500 font-mono text-[10px]">({m.sku})</span>
                    </td>
                    <td className="p-2.5 font-sans text-slate-300">{m.reason}</td>
                    <td className="p-2.5 font-bold">
                      <span className={m.delta > 0 ? "text-emerald-400" : "text-red-400"}>
                        {m.delta > 0 ? `+${m.delta}` : m.delta}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-400">
                      {m.previousQuantity} &rarr;{" "}
                      <span className="text-white font-bold">{m.newQuantity}</span>
                    </td>
                    <td className="p-2.5 text-slate-400 font-sans">{m.performedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adjust Stock Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-serif text-base font-bold text-white">Adjust Stock Level</h3>
                <div className="text-slate-400 text-[11px] truncate max-w-xs">{adjustingProduct.name}</div>
              </div>
              <button
                onClick={() => setAdjustingProduct(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-4">
              <div className="p-3 bg-slate-950 rounded border border-slate-800 flex justify-between items-center font-mono">
                <span className="text-slate-400 font-sans">Current Quantity:</span>
                <span className="text-lg font-bold text-white">{adjustingProduct.stockQuantity ?? 0} units</span>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 block">Quantity Delta (+/-)</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDelta((d) => d - 1)}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    value={delta}
                    onChange={(e) => setDelta(parseInt(e.target.value, 10) || 0)}
                    className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-center text-lg font-bold text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                  <button
                    type="button"
                    onClick={() => setDelta((d) => d + 1)}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-right text-[11px] text-slate-400 font-mono">
                  New Quantity will be:{" "}
                  <span className="text-emerald-400 font-bold">
                    {Math.max(0, (adjustingProduct.stockQuantity ?? 0) + delta)}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 block">Mandatory Adjustment Reason *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                >
                  <option value="Restock shipment">Restock shipment from loom</option>
                  <option value="Customer Return">Customer Return (Restocked)</option>
                  <option value="Damage / Shrinkage">Damage / Shrinkage / Loom defect</option>
                  <option value="POS In-store Sale">POS In-store offline sale</option>
                  <option value="Manual Inventory Audit">Periodic physical inventory audit</option>
                  <option value="Other">Other (Custom Reason)</option>
                </select>
              </div>

              {reason === "Other" && (
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 block">Custom Reason Description</label>
                  <input
                    type="text"
                    required
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Enter reason..."
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || delta === 0}
                  className="bg-[var(--gold)] hover:bg-white text-slate-950 font-bold px-5 py-2 rounded uppercase tracking-wider disabled:opacity-50"
                >
                  {submitting ? "Applying..." : "Confirm Adjustment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
