import { useState, useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Product } from "@/lib/products";
import { invalidateCatalogCache } from "@/lib/catalog-client";
import {
  getAdminProducts,
  publishAdminProduct,
  unpublishAdminProduct,
  duplicateAdminProduct,
  deleteAdminProduct,
  restoreAdminProduct,
  bulkUpdateAdminProducts,
  getExportProductsUrl,
  type AdminProductStats,
} from "@/lib/admin-client";
import {
  Search,
  Plus,
  Filter,
  Download,
  Trash2,
  Copy,
  Eye,
  Edit3,
  Archive,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Check,
  RotateCcw,
} from "lucide-react";

interface ProductCatalogTableProps {
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onViewProduct?: (product: Product) => void;
  categories: string[];
}

export function ProductCatalogTable({
  onAddProduct,
  onEditProduct,
  onViewProduct,
  categories,
}: ProductCatalogTableProps) {
  const queryClient = useQueryClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<AdminProductStats>({
    total: 0,
    active: 0,
    draft: 0,
    archived: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft" | "archived">("all");
  const [stockFilter, setStockFilter] = useState<"all" | "in_stock" | "low_stock" | "out_of_stock">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [sortField, setSortField] = useState<string>("newest");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Multi-select
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminProducts({
        search: search.trim() || undefined,
        category: categoryFilter || undefined,
        status: statusFilter,
        stockStatus: stockFilter,
        sort: sortField,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });
      setProducts(res.products);
      setTotalCount(res.total);
      if (res.stats) setStats(res.stats);
      // Invalidate public catalog cache so any open storefront view reflects changes
      invalidateCatalogCache(queryClient);
    } catch (err: any) {
      setError(err?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search / filter reload
  useEffect(() => {
    const handler = setTimeout(() => {
      loadData();
    }, 250);
    return () => clearTimeout(handler);
  }, [search, statusFilter, stockFilter, categoryFilter, sortField, page]);

  // Handle select all on current page
  const handleToggleSelectAll = () => {
    if (selectedIds.length === products.length && products.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Status toggle
  const handleToggleStatus = async (product: Product) => {
    try {
      if (product.active) {
        await unpublishAdminProduct(product.id);
        showToast(`"${product.name}" moved to Draft`);
      } else {
        await publishAdminProduct(product.id);
        showToast(`"${product.name}" published to Live Storefront`);
      }
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Duplicate
  const handleDuplicate = async (id: string) => {
    try {
      setActionLoading(true);
      const dup = await duplicateAdminProduct(id);
      showToast(`Duplicated as "${dup.name}"`);
      loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Archive / Delete / Restore
  const handleArchive = async (id: string) => {
    if (!confirm("Move this product to Archived? It will be hidden from storefront.")) return;
    try {
      setActionLoading(true);
      await deleteAdminProduct(id, false);
      showToast("Product archived.");
      loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      setActionLoading(true);
      await restoreAdminProduct(id);
      showToast("Product restored to Active.");
      loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleHardDelete = async (id: string) => {
    if (!confirm("PERMANENTLY delete this product? This action cannot be undone.")) return;
    try {
      setActionLoading(true);
      await deleteAdminProduct(id, true);
      showToast("Product permanently deleted.");
      loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Bulk actions
  const handleBulkPublish = async () => {
    if (selectedIds.length === 0) return;
    try {
      setActionLoading(true);
      await bulkUpdateAdminProducts(selectedIds, { active: true, published: true, status: "active" });
      showToast(`Published ${selectedIds.length} products to storefront`);
      setSelectedIds([]);
      loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkUnpublish = async () => {
    if (selectedIds.length === 0) return;
    try {
      setActionLoading(true);
      await bulkUpdateAdminProducts(selectedIds, { active: false, published: false, status: "draft" });
      showToast(`Set ${selectedIds.length} products to Draft`);
      setSelectedIds([]);
      loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkArchive = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Archive ${selectedIds.length} selected products?`)) return;
    try {
      setActionLoading(true);
      await bulkUpdateAdminProducts(selectedIds, { active: false, published: false, status: "archived" });
      showToast(`Archived ${selectedIds.length} products`);
      setSelectedIds([]);
      loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded shadow-2xl z-50 flex items-center gap-2 text-xs animate-in slide-in-from-bottom-5">
          <Check className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Fast Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-white">Master Product Catalog</h1>
            <span className="text-xs bg-[var(--gold)]/20 text-[var(--gold)] font-mono font-bold px-2 py-0.5 rounded">
              {stats.total} Total
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Single authoritative product catalog for storefront, cart, checkout, and inventory.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href={getExportProductsUrl()}
            target="_blank"
            rel="noreferrer"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs px-3.5 py-2.5 rounded flex items-center gap-1.5 font-bold transition-colors"
          >
            <Download className="h-4 w-4 text-[var(--gold)]" />
            <span>Export CSV</span>
          </a>

          <button
            onClick={onAddProduct}
            className="bg-[var(--gold)] hover:bg-white text-slate-950 text-xs px-4 py-2.5 rounded font-bold flex items-center gap-1.5 transition-colors uppercase tracking-wider"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => {
            setStatusFilter("all");
            setPage(1);
          }}
          className={`px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
            statusFilter === "all"
              ? "bg-[var(--wine)] text-white font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>All Products</span>
          <span className="text-[10px] opacity-75 font-mono">({stats.total})</span>
        </button>

        <button
          onClick={() => {
            setStatusFilter("active");
            setPage(1);
          }}
          className={`px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
            statusFilter === "active"
              ? "bg-emerald-600 text-white font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          <span>Active / Published</span>
          <span className="text-[10px] opacity-75 font-mono">({stats.active})</span>
        </button>

        <button
          onClick={() => {
            setStatusFilter("draft");
            setPage(1);
          }}
          className={`px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
            statusFilter === "draft"
              ? "bg-amber-600 text-white font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-amber-400"></span>
          <span>Drafts</span>
          <span className="text-[10px] opacity-75 font-mono">({stats.draft})</span>
        </button>

        <button
          onClick={() => {
            setStatusFilter("archived");
            setPage(1);
          }}
          className={`px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
            statusFilter === "archived"
              ? "bg-slate-700 text-white font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Archive className="h-3 w-3" />
          <span>Archived</span>
          <span className="text-[10px] opacity-75 font-mono">({stats.archived})</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 text-xs bg-slate-900/60 p-4 rounded border border-slate-800">
        {/* Search input */}
        <div className="lg:col-span-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, SKU, fabric, color..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[var(--gold)]"
          />
        </div>

        {/* Category filter */}
        <div className="lg:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-[var(--gold)]"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Stock health filter */}
        <div className="lg:col-span-2">
          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value as any);
              setPage(1);
            }}
            className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-[var(--gold)]"
          >
            <option value="all">All Stock Status</option>
            <option value="in_stock">In Stock (&gt;2)</option>
            <option value="low_stock">Low Stock (≤2)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>
        </div>

        {/* Sorting */}
        <div className="lg:col-span-3">
          <select
            value={sortField}
            onChange={(e) => {
              setSortField(e.target.value);
              setPage(1);
            }}
            className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-[var(--gold)]"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price-asc">Sort: Price Low to High</option>
            <option value="price-desc">Sort: Price High to Low</option>
            <option value="stock-asc">Sort: Stock Low to High</option>
            <option value="stock-desc">Sort: Stock High to Low</option>
            <option value="name-asc">Sort: Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Multi-Select Floating Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-[var(--wine-deep)] border border-[var(--gold)]/30 text-white p-3 rounded flex items-center justify-between gap-4 text-xs font-semibold shadow-lg">
          <div className="flex items-center gap-2">
            <span className="bg-[var(--gold)] text-slate-950 font-bold px-2 py-0.5 rounded text-[11px]">
              {selectedIds.length} Selected
            </span>
            <span>Bulk actions for selected catalog items:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkPublish}
              disabled={actionLoading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded transition-colors font-bold"
            >
              Publish
            </button>
            <button
              onClick={handleBulkUnpublish}
              disabled={actionLoading}
              className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded transition-colors font-bold"
            >
              Draft
            </button>
            <button
              onClick={handleBulkArchive}
              disabled={actionLoading}
              className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded transition-colors font-bold"
            >
              Archive
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-slate-300 hover:text-white px-2 py-1"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Catalog Table */}
      <div className="bg-slate-900 border border-slate-800 rounded overflow-hidden shadow-md">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-[var(--gold)]" />
            <div className="text-xs">Loading master catalog from database...</div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400 space-y-2">
            <AlertTriangle className="h-6 w-6 mx-auto text-red-500" />
            <div className="text-xs font-semibold">{error}</div>
            <button
              onClick={loadData}
              className="text-xs underline text-slate-300 hover:text-white"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <p className="text-sm">No products found matching the filter criteria.</p>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setStockFilter("all");
                setCategoryFilter("");
              }}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === products.length && products.length > 0}
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-700 bg-slate-900 text-[var(--gold)]"
                    />
                  </th>
                  <th className="p-3.5 w-16">Image</th>
                  <th className="p-3.5">Product & SKU</th>
                  <th className="p-3.5">Category & Fabric</th>
                  <th className="p-3.5">Price (USD / INR)</th>
                  <th className="p-3.5">Stock Qty</th>
                  <th className="p-3.5">Storefront Visibility</th>
                  <th className="p-3.5">Badge</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.map((product) => {
                  const isSelected = selectedIds.includes(product.id);
                  const isLow = (product.stockQuantity ?? 1) <= (product.lowStockThreshold || 2);
                  const isOut = (product.stockQuantity ?? 1) <= 0;
                  const isArchived = product.status === "archived";

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isSelected ? "bg-slate-800/60" : ""
                      } ${isArchived ? "opacity-60 bg-slate-950/40" : ""}`}
                    >
                      {/* Selection checkbox */}
                      <td className="p-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(product.id)}
                          className="rounded border-slate-700 bg-slate-900 text-[var(--gold)]"
                        />
                      </td>

                      {/* Thumbnail */}
                      <td className="p-3.5">
                        <div className="h-12 w-10 rounded bg-slate-950 overflow-hidden border border-slate-800 shrink-0">
                          <img
                            src={product.image || "/images/placeholder.jpg"}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>
                      </td>

                      {/* Product Name & SKU */}
                      <td className="p-3.5 max-w-xs">
                        <div className="font-bold text-slate-100 hover:text-[var(--gold)] truncate">
                          {product.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                          <span>SKU: {product.sku || "N/A"}</span>
                          <span>•</span>
                          <span className="truncate max-w-[120px]">/{product.slug || product.id}</span>
                        </div>
                      </td>

                      {/* Category & Fabric */}
                      <td className="p-3.5">
                        <div className="font-medium text-slate-200">{product.category}</div>
                        <div className="text-[11px] text-slate-400">{product.fabric || "—"}</div>
                      </td>

                      {/* Price */}
                      <td className="p-3.5 font-mono">
                        <div className="font-bold text-white">${product.priceUsd}</div>
                        <div className="text-[11px] text-slate-400">
                          ₹{product.priceInr || Math.round(product.priceUsd * 83.5)}
                        </div>
                      </td>

                      {/* Stock Qty */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="font-bold">{product.stockQuantity ?? 1}</span>
                          {isOut ? (
                            <span className="text-[10px] bg-red-900/60 text-red-300 font-bold px-1.5 py-0.5 rounded">
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="text-[10px] bg-amber-900/60 text-amber-300 font-bold px-1.5 py-0.5 rounded">
                              Low Stock
                            </span>
                          ) : (
                            <span className="text-[10px] bg-emerald-900/40 text-emerald-300 px-1.5 py-0.5 rounded">
                              In Stock
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Visibility Toggle */}
                      <td className="p-3.5">
                        {isArchived ? (
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold uppercase">
                            Archived
                          </span>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(product)}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors ${
                              product.active
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-amber-500/20 hover:text-amber-300"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-emerald-500/20 hover:text-emerald-300"
                            }`}
                            title={product.active ? "Click to unpublish" : "Click to publish"}
                          >
                            {product.active ? (
                              <>
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Published</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3" />
                                <span>Draft</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>

                      {/* Badges */}
                      <td className="p-3.5">
                        {product.badge ? (
                          <span className="bg-[var(--gold)]/20 text-[var(--gold)] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            {product.badge}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {/* Live link */}
                        <a
                          href={`/product/${product.slug || product.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                          title="View on live storefront"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>

                        {/* Edit */}
                        <button
                          onClick={() => onEditProduct(product)}
                          className="inline-flex p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-[var(--gold)] transition-colors"
                          title="Edit Product"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>

                        {/* Duplicate */}
                        <button
                          onClick={() => handleDuplicate(product.id)}
                          className="inline-flex p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
                          title="Duplicate Product"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>

                        {/* Archive or Restore */}
                        {isArchived ? (
                          <button
                            onClick={() => handleRestore(product.id)}
                            className="inline-flex p-1.5 rounded hover:bg-slate-800 text-emerald-400 transition-colors"
                            title="Restore Product"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleArchive(product.id)}
                            className="inline-flex p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                            title="Archive Product"
                          >
                            <Archive className="h-3.5 w-3.5" />
                          </button>
                        )}

                        {/* Permanent delete for archived items */}
                        {isArchived && (
                          <button
                            onClick={() => handleHardDelete(product.id)}
                            className="inline-flex p-1.5 rounded hover:bg-red-950/50 text-red-400 transition-colors"
                            title="Permanently Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, totalCount)} of {totalCount} products
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-mono">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
