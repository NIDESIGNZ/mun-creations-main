import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Product } from "@/lib/products";
import { invalidateCatalogCache } from "@/lib/catalog-client";
import {
  createAdminProduct,
  updateAdminProduct,
  uploadAdminImage,
} from "@/lib/admin-client";
import {
  X,
  Save,
  Upload,
  Sparkles,
  Eye,
  AlertCircle,
  Check,
  Trash2,
  MoveUp,
  MoveDown,
  Tag,
  Layers,
  DollarSign,
  Package,
  Image as ImageIcon,
  FileText,
  Sliders,
  Award,
  Globe,
  Radio,
  Clock,
  ExternalLink,
} from "lucide-react";

interface ProductEditorModalProps {
  product?: Product | null; // null for new product
  isOpen: boolean;
  onClose: () => void;
  onSaved: (savedProduct: Product) => void;
  categories: string[];
}

export function ProductEditorModal({
  isOpen,
  onClose,
  product,
  categories,
  onSaved,
}: ProductEditorModalProps) {
  const queryClient = useQueryClient();
  const isEditing = Boolean(product);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    sku: "",
    slug: "",
    category: categories[0] || "Banarasi",
    subcategory: "",
    group: "",
    fabric: "Pure Katan Silk",
    color: "Crimson Red",
    priceUsd: 280,
    priceInr: 23380,
    originalPriceUsd: 350,
    stockQuantity: 10,
    lowStockThreshold: 2,
    inStock: true,
    availability: "In Stock",
    active: true,
    published: true,
    status: "active",
    badge: "new",
    image: "",
    images: [],
    description: "",
    craftStory: "",
    weavingTechnique: "",
    careInstructions: "Dry clean only. Store wrapped in pure unbleached muslin cloth with natural cedar blocks.",
    zariType: "Pure Gold & Silver Zari",
    sareeLength: "5.5 meters saree + 0.8 meter unstitched blouse piece",
    loomOrigin: "Varanasi, Uttar Pradesh (GI Tagged)",
    weight: "850 grams",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: [],
  });

  // UI Navigation Tabs inside Editor
  const [activeSection, setActiveSection] = useState<
    | "basic"
    | "category"
    | "pricing"
    | "inventory"
    | "media"
    | "descriptions"
    | "attributes"
    | "merchandising"
    | "seo"
    | "publishing"
  >("basic");

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Live Preview Modal State
  const [showLivePreview, setShowLivePreview] = useState(false);

  // Auto-sync INR price toggle
  const [autoSyncInr, setAutoSyncInr] = useState(true);

  // Temporary Media inputs
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Initialize form
  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        images: product.images && product.images.length > 0 ? product.images : [product.image],
        status: product.status || (product.active ? "active" : "draft"),
      });
    } else {
      // Default new product
      const randomSku = `MUN-${Math.floor(1000 + Math.random() * 9000)}`;
      setFormData({
        name: "",
        sku: randomSku,
        slug: "",
        category: categories[0] || "Banarasi",
        subcategory: "Katan Silk",
        fabric: "Pure Katan Silk",
        color: "Royal Red",
        priceUsd: 350,
        priceInr: Math.round(350 * 83.5),
        originalPriceUsd: 420,
        stockQuantity: 5,
        lowStockThreshold: 2,
        inStock: true,
        availability: "In Stock",
        active: true,
        published: true,
        status: "active",
        badge: "new",
        image: "/images/products/hero-saree.webp",
        images: ["/images/products/hero-saree.webp"],
        description: "Handcrafted master weave rendered on authentic handlooms.",
        careInstructions: "Dry clean only. Store wrapped in pure unbleached muslin cloth.",
        zariType: "Tested Fine Metallic Zari",
        sareeLength: "5.5m saree + 0.8m blouse piece",
        loomOrigin: "Varanasi Heritage Looms",
        weight: "750g",
        seoTitle: "",
        seoDescription: "",
      });
    }
    setIsDirty(false);
    setErrorMsg(null);
  }, [product, isOpen, categories]);

  if (!isOpen) return null;

  const handleChange = (field: keyof Product, value: any) => {
    setIsDirty(true);
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-generate slug from name if slug hasn't been manually locked
      if (field === "name" && !isEditing) {
        updated.slug = String(value)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }

      // Auto-sync INR price
      if (field === "priceUsd" && autoSyncInr) {
        const num = parseFloat(value) || 0;
        updated.priceInr = Math.round(num * 83.5);
      }

      // Auto-sync stock status
      if (field === "stockQuantity") {
        const qty = parseInt(value, 10) || 0;
        updated.inStock = qty > 0;
        updated.availability = qty > 0 ? "In Stock" : "Out of Stock";
      }

      return updated;
    });
  };

  const handleSlugify = () => {
    if (formData.name) {
      const genSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      handleChange("slug", genSlug);
    }
  };

  // Image Upload handler (Base64 -> Server API)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|webp)$/i)) {
      alert("Only JPG, PNG, and WEBP images are supported.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size cannot exceed 10MB.");
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await uploadAdminImage(base64Data);
        if (res.success && res.url) {
          const currentImages = formData.images ? [...formData.images] : [];
          const newImages = [...currentImages, res.url];
          setFormData((prev) => ({
            ...prev,
            images: newImages,
            image: prev.image || res.url,
          }));
          setIsDirty(true);
        }
      } catch (err: any) {
        alert(`Failed to upload image: ${err.message}`);
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    const currentImages = formData.images ? [...formData.images] : [];
    const newImages = [...currentImages, newImageUrl.trim()];
    setFormData((prev) => ({
      ...prev,
      images: newImages,
      image: prev.image || newImageUrl.trim(),
    }));
    setNewImageUrl("");
    setIsDirty(true);
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = formData.images ? [...formData.images] : [];
    const removedUrl = currentImages[index];
    const newImages = currentImages.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      images: newImages,
      image: prev.image === removedUrl ? newImages[0] || "" : prev.image,
    }));
    setIsDirty(true);
  };

  const handleSetPrimaryImage = (index: number) => {
    const currentImages = formData.images ? [...formData.images] : [];
    const chosen = currentImages[index];
    if (!chosen) return;
    const reordered = [chosen, ...currentImages.filter((_, i) => i !== index)];
    setFormData((prev) => ({
      ...prev,
      image: chosen,
      images: reordered,
    }));
    setIsDirty(true);
  };

  // Form Submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    if (!formData.name?.trim()) {
      setErrorMsg("Product Name is mandatory.");
      setActiveSection("basic");
      return;
    }
    if (!formData.sku?.trim()) {
      setErrorMsg("SKU is mandatory.");
      setActiveSection("basic");
      return;
    }
    if ((formData.priceUsd ?? 0) <= 0) {
      setErrorMsg("Price (USD) must be greater than $0.");
      setActiveSection("pricing");
      return;
    }

    try {
      setSaving(true);
      let saved: Product;
      if (isEditing && product?.id) {
        saved = await updateAdminProduct(product.id, formData);
      } else {
        saved = await createAdminProduct(formData);
      }

      // Invalidate public storefront queries immediately
      invalidateCatalogCache(queryClient);

      setSuccessMsg("Product saved successfully to database!");
      setIsDirty(false);
      setTimeout(() => {
        onSaved(saved);
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (isDirty) {
      if (!confirm("You have unsaved changes. Are you sure you want to discard them?")) {
        return;
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-sm w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-[var(--gold)] text-slate-950 flex items-center justify-center font-bold font-serif text-sm">
              M
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white">
                {isEditing ? `Edit: ${product?.name}` : "Create New Master Product"}
              </h2>
              <div className="text-[11px] text-slate-400 font-mono">
                {formData.sku ? `SKU: ${formData.sku}` : "New Product Specification"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLivePreview(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded text-xs flex items-center gap-1.5 font-bold transition-colors"
            >
              <Eye className="h-3.5 w-3.5 text-[var(--gold)]" />
              <span>Live Preview</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Section Tabs Bar */}
        <div className="flex items-center gap-1 px-6 py-2 bg-slate-950/60 border-b border-slate-800 text-xs overflow-x-auto shrink-0">
          {[
            { id: "basic", label: "1. Basic Info", icon: Tag },
            { id: "category", label: "2. Category & Weave", icon: Layers },
            { id: "pricing", label: "3. Pricing", icon: DollarSign },
            { id: "inventory", label: "4. Inventory", icon: Package },
            { id: "media", label: "5. Media Gallery", icon: ImageIcon },
            { id: "descriptions", label: "6. Story & Care", icon: FileText },
            { id: "attributes", label: "7. Attributes", icon: Sliders },
            { id: "merchandising", label: "8. Merchandising", icon: Award },
            { id: "seo", label: "9. SEO", icon: Globe },
            { id: "publishing", label: "10. Publishing", icon: Radio },
          ].map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id as any)}
                className={`px-3 py-2 rounded flex items-center gap-1.5 font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-[var(--wine)] text-white font-bold"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body Scrollable Area */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-200">
          {errorMsg && (
            <div className="bg-red-950/80 border border-red-800 p-4 rounded text-red-200 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-950/80 border border-emerald-800 p-4 rounded text-emerald-200 flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SECTION 1: BASIC INFORMATION */}
          {activeSection === "basic" && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="font-serif text-base font-bold text-white">Section 1: Basic Information</h3>
                <p className="text-slate-400">Core identity, unique SKU, URL slug, and summary.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="font-bold text-slate-300">Product Name / Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g. Royal Crimson Katan Banarasi Silk Saree"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Stock Keeping Unit (SKU) *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku || ""}
                    onChange={(e) => handleChange("sku", e.target.value.toUpperCase())}
                    placeholder="e.g. MUN-BAN-001"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                  <div className="text-[10px] text-slate-400">Must be unique across the entire catalog.</div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-300">URL Slug / Handle</label>
                    <button
                      type="button"
                      onClick={handleSlugify}
                      className="text-[10px] text-[var(--gold)] hover:underline"
                    >
                      Generate from Name
                    </button>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-slate-800 px-2.5 py-2.5 text-slate-400 border border-r-0 border-slate-800 rounded-l font-mono text-[11px]">
                      /product/
                    </span>
                    <input
                      type="text"
                      value={formData.slug || ""}
                      onChange={(e) => handleChange("slug", e.target.value)}
                      placeholder="royal-crimson-katan-banarasi"
                      className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-r font-mono text-white focus:outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-bold text-slate-300">Short Summary / Subtitle</label>
                  <input
                    type="text"
                    value={formData.shortSummary || ""}
                    onChange={(e) => handleChange("shortSummary", e.target.value)}
                    placeholder="e.g. Pure Katan silk with intricate Kadwa antique gold zari"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: CATEGORY & CLASSIFICATION */}
          {activeSection === "category" && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="font-serif text-base font-bold text-white">Section 2: Category & Classification</h3>
                <p className="text-slate-400">Taxonomy hierarchy, weave family, and occasion mapping.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Primary Category *</label>
                  <select
                    value={formData.category || ""}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Subcategory / Weave Variant</label>
                  <input
                    type="text"
                    value={formData.subcategory || ""}
                    onChange={(e) => handleChange("subcategory", e.target.value)}
                    placeholder="e.g. Katan Silk, Organza, Jangla"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Weave Family / Collection Group</label>
                  <input
                    type="text"
                    value={formData.group || ""}
                    onChange={(e) => handleChange("group", e.target.value)}
                    placeholder="e.g. Banarasi Heritage, Temple Kanchipuram"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Primary Occasion</label>
                  <select
                    value={formData.occasion || "Bridal & Wedding"}
                    onChange={(e) => handleChange("occasion", e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                  >
                    <option value="Bridal & Wedding">Bridal & Wedding</option>
                    <option value="Festive Celebration">Festive Celebration</option>
                    <option value="Grand Reception">Grand Reception</option>
                    <option value="Cocktail & Party">Cocktail & Party</option>
                    <option value="Formal & Classic">Formal & Classic</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: PRICING & ECONOMICS */}
          {activeSection === "pricing" && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="font-serif text-base font-bold text-white">Section 3: Pricing & Economics</h3>
                <p className="text-slate-400">Currencies, discounts, compare-at rates, and gross margin.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Retail Price (USD $) *</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={formData.priceUsd || ""}
                    onChange={(e) => handleChange("priceUsd", parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-emerald-400 font-bold text-base focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-300">Retail Price (INR ₹)</label>
                    <label className="text-[10px] text-slate-400 flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={autoSyncInr}
                        onChange={(e) => setAutoSyncInr(e.target.checked)}
                        className="rounded"
                      />
                      <span>Auto @ 83.5</span>
                    </label>
                  </div>
                  <input
                    type="number"
                    min="1"
                    disabled={autoSyncInr}
                    value={formData.priceInr || ""}
                    onChange={(e) => handleChange("priceInr", parseInt(e.target.value, 10) || 0)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-white focus:outline-none focus:border-[var(--gold)] disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Compare-at Price (USD $)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.originalPriceUsd || ""}
                    onChange={(e) => handleChange("originalPriceUsd", parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 420"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-slate-300 focus:outline-none focus:border-[var(--gold)]"
                  />
                  <div className="text-[10px] text-slate-400">Shows strikethrough original price if higher.</div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Cost of Goods (USD $)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.costPriceUsd || ""}
                    onChange={(e) => handleChange("costPriceUsd", parseFloat(e.target.value) || 0)}
                    placeholder="Internal cost (e.g. 180)"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-slate-300 focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                {/* Computed Margin */}
                <div className="space-y-1 p-3 bg-slate-950/80 rounded border border-slate-800 md:col-span-2 flex items-center justify-around">
                  <div className="text-center">
                    <div className="text-[10px] text-slate-400 uppercase">Gross Profit</div>
                    <div className="font-mono font-bold text-emerald-400 text-sm">
                      ${Math.max(0, (formData.priceUsd || 0) - (formData.costPriceUsd || 0))}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-slate-400 uppercase">Gross Margin</div>
                    <div className="font-mono font-bold text-white text-sm">
                      {formData.priceUsd && formData.costPriceUsd
                        ? `${Math.round((((formData.priceUsd - formData.costPriceUsd) / formData.priceUsd) * 100))}%`
                        : "—"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: INVENTORY & STOCK */}
          {activeSection === "inventory" && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="font-serif text-base font-bold text-white">Section 4: Inventory & Stock Management</h3>
                <p className="text-slate-400">Live units, threshold alerts, and backorder configuration.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Stock Quantity (Units) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stockQuantity ?? 0}
                    onChange={(e) => handleChange("stockQuantity", parseInt(e.target.value, 10) || 0)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-white text-base font-bold focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Low-Stock Alert Threshold</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.lowStockThreshold ?? 2}
                    onChange={(e) => handleChange("lowStockThreshold", parseInt(e.target.value, 10) || 2)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                  <div className="text-[10px] text-slate-400">Alerts admin when stock reaches this level.</div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Barcode / GTIN</label>
                  <input
                    type="text"
                    value={formData.barcode || ""}
                    onChange={(e) => handleChange("barcode", e.target.value)}
                    placeholder="e.g. 8901234567890"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div className="md:col-span-3 p-4 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Stock Status Summary</div>
                    <div className="text-slate-400">
                      {(formData.stockQuantity ?? 0) <= 0 ? (
                        <span className="text-red-400 font-bold">Out of Stock (Customers cannot checkout)</span>
                      ) : (formData.stockQuantity ?? 0) <= (formData.lowStockThreshold || 2) ? (
                        <span className="text-amber-400 font-bold">Low Stock (Displays "Only X left" badge on storefront)</span>
                      ) : (
                        <span className="text-emerald-400 font-bold">Healthy Stock Available</span>
                      )}
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allowBackorders || false}
                      onChange={(e) => handleChange("allowBackorders", e.target.checked)}
                      className="rounded"
                    />
                    <span className="font-semibold">Allow Backorders</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: MEDIA GALLERY */}
          {activeSection === "media" && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="font-serif text-base font-bold text-white">Section 5: Media Gallery</h3>
                <p className="text-slate-400">Upload high-res product photos, reorder images, and set primary cover.</p>
              </div>

              {/* Upload or Add URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded border border-slate-800">
                <div className="space-y-2">
                  <label className="font-bold text-slate-300 block">Upload Image (JPG, PNG, WEBP &le; 10MB)</label>
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-[var(--gold)] rounded cursor-pointer transition-colors bg-slate-900/50">
                    <Upload className="h-6 w-6 text-[var(--gold)] mb-1" />
                    <span className="font-bold text-xs text-white">Click to Browse Local File</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Saves directly to server storage</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                  {uploadingImage && <div className="text-[11px] text-[var(--gold)]">Uploading image...</div>}
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-slate-300 block">Or Add Image by URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/saree-photo.jpg"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 p-2.5 bg-slate-900 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-2 rounded"
                    >
                      Add
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Supports local relative URLs (e.g. <code>/images/products/...</code>) or HTTPS URLs.
                  </div>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="space-y-2">
                <label className="font-bold text-slate-300">Current Product Images ({formData.images?.length || 0})</label>
                {(!formData.images || formData.images.length === 0) ? (
                  <div className="text-center p-8 border border-slate-800 rounded bg-slate-950 text-slate-500">
                    No images added yet. Upload or add a URL above.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.images.map((img, idx) => {
                      const isPrimary = idx === 0 || formData.image === img;
                      return (
                        <div
                          key={idx}
                          className={`relative rounded border p-2 bg-slate-950 space-y-2 ${
                            isPrimary ? "border-[var(--gold)] ring-1 ring-[var(--gold)]" : "border-slate-800"
                          }`}
                        >
                          <div className="h-32 rounded overflow-hidden bg-black flex items-center justify-center">
                            <img src={img} alt="Product view" className="h-full w-full object-cover" />
                          </div>

                          <div className="flex items-center justify-between text-[10px]">
                            {isPrimary ? (
                              <span className="bg-[var(--gold)] text-slate-950 font-bold px-1.5 py-0.5 rounded">
                                Cover Photo
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(idx)}
                                className="text-[var(--gold)] hover:underline"
                              >
                                Set as Cover
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="text-red-400 hover:text-red-300 p-1"
                              title="Delete photo"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 6: STORY & CARE */}
          {activeSection === "descriptions" && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="font-serif text-base font-bold text-white">Section 6: Descriptions & Storytelling</h3>
                <p className="text-slate-400">Artisan craft heritage, weaving technique narrative, and care instructions.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Detailed Product Narrative</label>
                  <textarea
                    rows={4}
                    value={formData.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Rich description of the saree, motifs, drape, and feel..."
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Artisan Craft Story</label>
                  <textarea
                    rows={3}
                    value={formData.craftStory || ""}
                    onChange={(e) => handleChange("craftStory", e.target.value)}
                    placeholder="Story of the artisan community, loom tradition, and heritage lineage..."
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Weaving Technique</label>
                  <input
                    type="text"
                    value={formData.weavingTechnique || ""}
                    onChange={(e) => handleChange("weavingTechnique", e.target.value)}
                    placeholder="e.g. Kadwa Weave (individual zari floral butas woven by hand)"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Care Instructions</label>
                  <textarea
                    rows={2}
                    value={formData.careInstructions || ""}
                    onChange={(e) => handleChange("careInstructions", e.target.value)}
                    placeholder="Dry clean only. Store wrapped in muslin cloth..."
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: ATTRIBUTES & SPECS */}
          {activeSection === "attributes" && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="font-serif text-base font-bold text-white">Section 7: Product Attributes & Specs</h3>
                <p className="text-slate-400">Physical specifications, fabric type, zari purity, and origin certificate.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Fabric Type *</label>
                  <input
                    type="text"
                    required
                    value={formData.fabric || ""}
                    onChange={(e) => handleChange("fabric", e.target.value)}
                    placeholder="e.g. Pure Katan Silk, Tussar, Organza"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Color / Palette</label>
                  <input
                    type="text"
                    value={formData.color || ""}
                    onChange={(e) => handleChange("color", e.target.value)}
                    placeholder="e.g. Royal Crimson, Peacock Teal, Emerald"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Zari Purity / Type</label>
                  <input
                    type="text"
                    value={formData.zariType || ""}
                    onChange={(e) => handleChange("zariType", e.target.value)}
                    placeholder="e.g. Pure Gold Tested Zari, Antique Silver Zari"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Saree Length & Blouse</label>
                  <input
                    type="text"
                    value={formData.sareeLength || ""}
                    onChange={(e) => handleChange("sareeLength", e.target.value)}
                    placeholder="5.5m saree + 0.8m unstitched blouse piece"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Loom Origin & Geographical Indication (GI)</label>
                  <input
                    type="text"
                    value={formData.loomOrigin || ""}
                    onChange={(e) => handleChange("loomOrigin", e.target.value)}
                    placeholder="Varanasi, Uttar Pradesh (GI Tagged Looms)"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Product Weight</label>
                  <input
                    type="text"
                    value={formData.weight || ""}
                    onChange={(e) => handleChange("weight", e.target.value)}
                    placeholder="e.g. 780 grams"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: MERCHANDISING & BADGES */}
          {activeSection === "merchandising" && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="font-serif text-base font-bold text-white">Section 8: Merchandising & Badges</h3>
                <p className="text-slate-400">Badges, featured flags, and homepage promotions.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Product Badge</label>
                  <select
                    value={formData.badge || ""}
                    onChange={(e) => handleChange("badge", e.target.value || undefined)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                  >
                    <option value="">No Badge</option>
                    <option value="new">NEW ARRIVAL</option>
                    <option value="bestseller">BESTSELLER</option>
                    <option value="trending">TRENDING</option>
                    <option value="heritage">HERITAGE WEAVE</option>
                    <option value="award_winning">AWARD WINNING</option>
                    <option value="limited">LIMITED EDITION</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Collection Name</label>
                  <input
                    type="text"
                    value={formData.collection || ""}
                    onChange={(e) => handleChange("collection", e.target.value)}
                    placeholder="e.g. The Royal Weaves Collection"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div className="p-4 bg-slate-950 rounded border border-slate-800 md:col-span-2 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured || false}
                      onChange={(e) => handleChange("featured", e.target.checked)}
                      className="rounded"
                    />
                    <div>
                      <div className="font-bold text-white">Featured Product</div>
                      <div className="text-slate-400 text-[11px]">
                        Highlighted prominently in catalog browsers.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 9: SEO */}
          {activeSection === "seo" && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="font-serif text-base font-bold text-white">Section 9: Search Engine Optimization</h3>
                <p className="text-slate-400">Meta tags, Google SERP preview, and indexing controls.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-300">SEO Page Title</label>
                    <span className="text-[10px] text-slate-400">
                      {(formData.seoTitle || formData.name || "").length} / 70 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.seoTitle || ""}
                    onChange={(e) => handleChange("seoTitle", e.target.value)}
                    placeholder={formData.name ? `${formData.name} — Mun Creations` : "Custom title"}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-300">SEO Meta Description</label>
                    <span className="text-[10px] text-slate-400">
                      {(formData.seoDescription || formData.description || "").length} / 160 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={formData.seoDescription || ""}
                    onChange={(e) => handleChange("seoDescription", e.target.value)}
                    placeholder="Short engaging description for Google Search snippets..."
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                {/* Google Search Preview */}
                <div className="p-4 bg-white rounded text-slate-900 space-y-1 shadow-sm">
                  <div className="text-[11px] text-slate-500 font-mono">
                    https://www.muncreation.com/product/{formData.slug || "product-slug"}
                  </div>
                  <div className="text-base text-blue-700 hover:underline font-medium cursor-pointer">
                    {formData.seoTitle || formData.name || "Handcrafted Luxury Saree"} — Mun Creations
                  </div>
                  <div className="text-xs text-slate-600 line-clamp-2">
                    {formData.seoDescription ||
                      formData.description ||
                      "Explore authentic handloom Banarasi & Kanjivaram sarees with pure zari and certified craftsmanship."}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 10: PUBLISHING */}
          {activeSection === "publishing" && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="font-serif text-base font-bold text-white">Section 10: Visibility & Publishing</h3>
                <p className="text-slate-400">Control storefront live state and archival status.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => {
                    handleChange("active", true);
                    handleChange("published", true);
                    handleChange("status", "active");
                  }}
                  className={`p-4 rounded border cursor-pointer transition-colors ${
                    formData.status === "active" && formData.active
                      ? "border-emerald-500 bg-emerald-950/40"
                      : "border-slate-800 bg-slate-950 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-emerald-400 mb-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                    <span>Published / Active</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Visible on live storefront. Customers can view, search, and purchase.
                  </p>
                </div>

                <div
                  onClick={() => {
                    handleChange("active", false);
                    handleChange("published", false);
                    handleChange("status", "draft");
                  }}
                  className={`p-4 rounded border cursor-pointer transition-colors ${
                    formData.status === "draft"
                      ? "border-amber-500 bg-amber-950/40"
                      : "border-slate-800 bg-slate-950 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-amber-400 mb-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                    <span>Draft</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Hidden from storefront. Saved in admin for editing before public launch.
                  </p>
                </div>

                <div
                  onClick={() => {
                    handleChange("active", false);
                    handleChange("published", false);
                    handleChange("status", "archived");
                  }}
                  className={`p-4 rounded border cursor-pointer transition-colors ${
                    formData.status === "archived"
                      ? "border-slate-500 bg-slate-800/60"
                      : "border-slate-800 bg-slate-950 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-slate-300 mb-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Archived</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Discontinued or out-of-season products. Retains order history.
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400">
            {isDirty ? (
              <span className="text-amber-400 font-semibold">• Unsaved modifications</span>
            ) : (
              <span>All changes synced</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={saving}
              className="bg-[var(--gold)] hover:bg-white text-slate-950 font-bold px-6 py-2 rounded text-xs transition-colors flex items-center gap-2 uppercase tracking-wider"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? "Saving to Database..." : isEditing ? "Update Product" : "Create Product"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* LIVE PREVIEW MODAL */}
      {showLivePreview && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-sm w-full max-w-4xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-[var(--gold)]" />
                <h3 className="font-serif text-lg font-bold text-white">Live Storefront Card Preview</h3>
              </div>
              <button
                onClick={() => setShowLivePreview(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center p-4 bg-slate-950 rounded">
              {/* Product Card simulation */}
              <div className="max-w-xs mx-auto bg-white text-slate-900 rounded-sm overflow-hidden shadow-xl border border-border">
                <div className="h-72 bg-secondary/30 relative">
                  <img
                    src={formData.image || formData.images?.[0] || "/images/placeholder.jpg"}
                    alt={formData.name}
                    className="h-full w-full object-cover"
                  />
                  {formData.badge && (
                    <span className="absolute top-2 left-2 bg-[var(--gold)] text-slate-950 text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow">
                      {formData.badge}
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-[var(--wine)] tracking-wider">
                    {formData.category} • {formData.fabric}
                  </div>
                  <h4 className="font-serif font-bold text-sm text-slate-900 line-clamp-1">
                    {formData.name || "Product Title"}
                  </h4>
                  <div className="flex items-baseline gap-2 font-mono">
                    <span className="font-bold text-base text-[var(--wine)]">
                      ${formData.priceUsd}
                    </span>
                    {formData.originalPriceUsd && formData.originalPriceUsd > (formData.priceUsd || 0) && (
                      <span className="text-xs text-muted-foreground line-through">
                        ${formData.originalPriceUsd}
                      </span>
                    )}
                    <span className="text-xs text-slate-500 ml-auto">
                      ₹{formData.priceInr || Math.round((formData.priceUsd || 0) * 83.5)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detail snippet preview */}
              <div className="space-y-3 text-xs text-slate-300">
                <div className="text-[10px] text-[var(--gold)] uppercase font-mono tracking-widest font-bold">
                  Product Details Preview
                </div>
                <h2 className="font-serif text-2xl font-bold text-white">
                  {formData.name || "Untitled Product"}
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  {formData.description || formData.shortSummary || "No description specified yet."}
                </p>

                <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1.5 font-mono text-[11px]">
                  <div>SKU: <span className="text-white">{formData.sku}</span></div>
                  <div>Origin: <span className="text-white">{formData.loomOrigin}</span></div>
                  <div>Zari: <span className="text-white">{formData.zariType}</span></div>
                  <div>Stock Status: <span className="text-emerald-400 font-bold">{formData.stockQuantity} units available</span></div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLivePreview(false)}
                    className="w-full bg-[var(--gold)] text-slate-950 font-bold py-2.5 rounded text-xs uppercase tracking-wider"
                  >
                    Back to Form
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
