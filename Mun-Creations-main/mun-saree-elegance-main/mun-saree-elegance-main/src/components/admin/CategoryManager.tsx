import { useState, useEffect } from "react";
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  type AdminCategory,
} from "@/lib/admin-client";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  FolderTree,
  Tag,
} from "lucide-react";

export function CategoryManager({ onCategoriesChanged }: { onCategoriesChanged?: () => void }) {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);

  // New Category Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [subcategoriesInput, setSubcategoriesInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  const handleStartEdit = (cat: AdminCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setSubcategoriesInput(cat.subcategories ? cat.subcategories.join(", ") : "");
    setShowAddForm(true);
  };

  const handleResetForm = () => {
    setShowAddForm(false);
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setSubcategoriesInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const subcategories = subcategoriesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (editingCategory) {
        await updateAdminCategory(editingCategory.id, {
          name: name.trim(),
          slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: description.trim(),
          subcategories,
        });
      } else {
        await createAdminCategory({
          name: name.trim(),
          slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: description.trim(),
          subcategories,
          orderIndex: categories.length + 1,
          active: true,
        });
      }

      handleResetForm();
      await loadCategories();
      if (onCategoriesChanged) onCategoriesChanged();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    try {
      await deleteAdminCategory(id);
      await loadCategories();
      if (onCategoriesChanged) onCategoriesChanged();
    } catch (err: any) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  const handleToggleActive = async (cat: AdminCategory) => {
    try {
      await updateAdminCategory(cat.id, { active: !cat.active });
      loadCategories();
      if (onCategoriesChanged) onCategoriesChanged();
    } catch (err: any) {
      alert(`Failed to update: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-bold text-white">Dynamic Category Management</h2>
            <span className="text-xs bg-[var(--gold)]/20 text-[var(--gold)] font-mono font-bold px-2 py-0.5 rounded">
              {categories.length} Categories
            </span>
          </div>
          <p className="text-slate-400 mt-1">
            Manage storefront taxonomy, subcategories, navigation groups, and filters without touching source code.
          </p>
        </div>

        <button
          onClick={() => {
            handleResetForm();
            setShowAddForm(true);
          }}
          className="bg-[var(--gold)] hover:bg-white text-slate-950 font-bold px-4 py-2.5 rounded flex items-center gap-1.5 transition-colors uppercase tracking-wider self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Add / Edit Form Modal or Card */}
      {showAddForm && (
        <div className="bg-slate-900 border border-[var(--gold)]/40 p-5 rounded shadow-lg space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2">
              <FolderTree className="h-4 w-4 text-[var(--gold)]" />
              <span>{editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Category"}</span>
            </h3>
            <button onClick={handleResetForm} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Chanderi Sarees"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="chanderi-sarees"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-white focus:outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="font-bold text-slate-300">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Heritage lightweight silk-cotton sarees with delicate zari borders..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="font-bold text-slate-300">
                  Subcategories (comma separated tags)
                </label>
                <input
                  type="text"
                  value={subcategoriesInput}
                  onChange={(e) => setSubcategoriesInput(e.target.value)}
                  placeholder="Katan Silk, Organza, Jangla, Tissue"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                />
                <div className="text-[10px] text-slate-400">
                  Enter subcategory names separated by commas. These will be available in product forms and filter sidebars.
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleResetForm}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-[var(--gold)] hover:bg-white text-slate-950 font-bold px-5 py-2 rounded flex items-center gap-1.5 uppercase tracking-wider"
              >
                <Check className="h-4 w-4" />
                <span>{submitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-slate-900 border border-slate-800 rounded overflow-hidden shadow-md">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-[var(--gold)]" />
            <div>Loading categories...</div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
            <div>{error}</div>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No categories defined. Click "Add New Category" above to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Category Name</th>
                  <th className="p-3.5">Slug</th>
                  <th className="p-3.5">Subcategories</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{cat.name}</div>
                      {cat.description && (
                        <div className="text-[11px] text-slate-400 line-clamp-1">{cat.description}</div>
                      )}
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">
                      /shop?category={cat.slug}
                    </td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        {cat.subcategories && cat.subcategories.length > 0 ? (
                          cat.subcategories.map((sub) => (
                            <span
                              key={sub}
                              className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-medium"
                            >
                              {sub}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-600 italic">None</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                          cat.active !== false
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {cat.active !== false ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-[var(--gold)]"
                        title="Edit Category"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 rounded hover:bg-red-950 text-slate-400 hover:text-red-400"
                        title="Delete Category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
