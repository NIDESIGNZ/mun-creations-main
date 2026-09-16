import fs from "fs";
import path from "path";
import crypto from "crypto";
import type { Product, ProductFAQ } from "../products";
import { PRODUCTS } from "../products";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  orderIndex: number;
  active: boolean;
  subcategories: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  deltaQuantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  adminUser: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: "product" | "category" | "inventory" | "auth" | "bulk_import";
  entityId?: string;
  details: string;
  user: string;
  timestamp: string;
}

export interface MasterProduct extends Product {
  lowStockThreshold?: number;
  trackInventory?: boolean;
  published?: boolean;
  status?: string;
  bestSeller?: boolean;
  seoDescription?: string;
  colors?: string[];
  weaveType?: string;
  pattern?: string;
  blouseIncluded?: boolean;
  blouseDetails?: string;
  dimensions?: string;
  newArrival?: boolean;
  trending?: boolean;
  seoKeywords?: string[];
  createdBy?: string;
  updatedBy?: string;
  archivedAt?: string;
  deletedAt?: string;
}


const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "cat_sarees",
    name: "Sarees",
    slug: "sarees",
    description: "Handcrafted heritage sarees woven by master artisans across India.",
    image: "/images/cat-silk.jpg",
    orderIndex: 1,
    active: true,
    subcategories: [
      "Banarasi",
      "Kanjivaram",
      "Tussar",
      "Paithani",
      "Bandhani",
      "Jamdani",
      "Chanderi",
      "Organza",
      "Tissue",
      "Chikankari",
      "Khaddi",
      "Crepe",
      "Handloom",
    ],
    seoTitle: "Luxury Handloom Sarees Collection — Mun Creations",
    seoDescription: "Explore luxury handwoven Banarasi, Kanjivaram, and Tussar silk sarees.",
  },
  {
    id: "cat_kurti",
    name: "Kurti",
    slug: "kurti",
    description: "Artisanal bespoke kurtis and tunics crafted from pure natural fabrics.",
    image: "/images/cat-cotton.jpg",
    orderIndex: 2,
    active: true,
    subcategories: ["Chanderi Kurti", "Silk Kurti", "Anarkali", "Straight Cut"],
    seoTitle: "Artisanal Kurtis & Tunics — Mun Creations",
    seoDescription: "Discover handcrafted luxury kurtis woven with pure natural silk and cotton.",
  },
  {
    id: "cat_blouses",
    name: "Blouses",
    slug: "blouses",
    description: "Designer tailored blouses and corset styles with authentic handwork.",
    image: "/images/acc-blouse.jpg",
    orderIndex: 3,
    active: true,
    subcategories: ["Raw Silk", "Brocade Blouse", "Zardosi Embroidered", "Velvet"],
    seoTitle: "Designer Saree Blouses — Mun Creations",
    seoDescription: "Bespoke handcrafted saree blouses with heritage embroidery and brocade.",
  },
  {
    id: "cat_accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Royal potlis, handcrafted dupattas, and heirloom couture accents.",
    image: "/images/acc-potli.jpg",
    orderIndex: 4,
    active: true,
    subcategories: ["Potlis", "Dupattas", "Jewelry", "Stoles"],
    seoTitle: "Couture Accents & Accessories — Mun Creations",
    seoDescription: "Heirloom handcrafted potli bags, pure silk dupattas and regal jewelry.",
  },
];

class ProductDatabaseService {
  private dataDir: string = "";
  private productsFile: string = "";
  private categoriesFile: string = "";
  private inventoryFile: string = "";
  private auditFile: string = "";

  private products: Map<string, MasterProduct> = new Map();
  private categories: Map<string, Category> = new Map();
  private inventoryMovements: InventoryMovement[] = [];
  private auditLogs: AuditLog[] = [];
  private activeSessions: Map<string, { username: string; expiresAt: number }> = new Map();
  private initialized: boolean = false;

  constructor() {
    this.initStorage();
  }

  private isServerEnvironment(): boolean {
    return typeof window === "undefined" && typeof process !== "undefined" && Boolean(process?.versions?.node) && Boolean(fs?.existsSync);
  }

  private initStorage() {
    if (this.initialized) return;

    if (!this.isServerEnvironment()) {
      this.seedFromInitialProducts();
      DEFAULT_CATEGORIES.forEach((c) => this.categories.set(c.id, c));
      this.initialized = true;
      return;
    }

    // Locate or create storage directory
    const candidates = [
      path.resolve(process.cwd(), "data"),
      typeof __dirname !== "undefined" ? path.resolve(__dirname, "../../../data") : "",
      "/tmp/mun_creations_data",
    ].filter(Boolean);

    for (const cand of candidates) {
      try {
        if (!fs.existsSync(cand)) {
          fs.mkdirSync(cand, { recursive: true });
        }
        // Test write access
        const testFile = path.join(cand, ".test_write");
        fs.writeFileSync(testFile, "ok");
        fs.unlinkSync(testFile);
        this.dataDir = cand;
        break;
      } catch {
        // continue to fallback
      }
    }

    if (!this.dataDir) {
      this.dataDir = "/tmp/mun_creations_data";
      try {
        fs.mkdirSync(this.dataDir, { recursive: true });
      } catch {}
    }

    this.productsFile = path.join(this.dataDir, "products.json");
    this.categoriesFile = path.join(this.dataDir, "categories.json");
    this.inventoryFile = path.join(this.dataDir, "inventory_movements.json");
    this.auditFile = path.join(this.dataDir, "audit_logs.json");

    this.loadAll();
    this.initialized = true;
  }

  private loadAll() {
    // 1. Categories
    try {
      if (fs.existsSync(this.categoriesFile)) {
        const raw = fs.readFileSync(this.categoriesFile, "utf-8");
        const list: Category[] = JSON.parse(raw);
        list.forEach((c) => this.categories.set(c.id, c));
      } else {
        DEFAULT_CATEGORIES.forEach((c) => this.categories.set(c.id, c));
        this.saveCategories();
      }
    } catch {
      DEFAULT_CATEGORIES.forEach((c) => this.categories.set(c.id, c));
    }

    // 2. Products
    try {
      if (fs.existsSync(this.productsFile)) {
        const raw = fs.readFileSync(this.productsFile, "utf-8");
        const list: MasterProduct[] = JSON.parse(raw);
        list.forEach((p) => this.products.set(p.id, p));
      } else {
        this.seedFromInitialProducts();
      }
    } catch {
      this.seedFromInitialProducts();
    }

    // 3. Inventory Movements
    try {
      if (fs.existsSync(this.inventoryFile)) {
        const raw = fs.readFileSync(this.inventoryFile, "utf-8");
        this.inventoryMovements = JSON.parse(raw);
      }
    } catch {
      this.inventoryMovements = [];
    }

    // 4. Audit Logs
    try {
      if (fs.existsSync(this.auditFile)) {
        const raw = fs.readFileSync(this.auditFile, "utf-8");
        this.auditLogs = JSON.parse(raw);
      }
    } catch {
      this.auditLogs = [];
    }
  }

  private seedFromInitialProducts() {
    PRODUCTS.forEach((p, idx) => {
      const stock = typeof p.stockQuantity === "number" ? p.stockQuantity : 5;
      const master: MasterProduct = {
        ...p,
        id: p.id || `p_${idx + 1}`,
        sku: p.sku || `MUN-${(p.category || "SAR").substring(0, 3).toUpperCase()}-${String(idx + 1).padStart(3, "0")}`,
        name: p.name,
        slug: p.slug || this.generateSlug(p.name, p.id),
        category: p.category || "Banarasi",
        subcategory: p.subcategory || p.category || "Banarasi",
        price: p.priceUsd ?? p.price ?? 250,
        priceUsd: p.priceUsd ?? p.price ?? 250,
        compareAtPrice: p.compareAtUsd ?? p.compareAtPrice,
        compareAtUsd: p.compareAtUsd ?? p.compareAtPrice,
        currency: p.currency || "USD",
        stock,
        stockQuantity: stock,
        lowStockThreshold: 2,
        trackInventory: true,
        inStock: stock > 0,
        availability: stock > 0 ? "Available" : "Out of Stock",
        published: true,
        active: true,
        images: p.images && p.images.length > 0 ? p.images : [p.image],
        thumbnail: p.thumbnail || p.image,
        featured: p.featured ?? (p.badge === "bestseller" || p.priceTier === "Luxury"),
        bestSeller: p.bestseller ?? (p.badge === "bestseller"),
        newArrival: p.badge === "new",
        trending: idx < 3,
        seoTitle: p.seoTitle || `${p.name} | Luxury Handloom Saree — Mun Creations`,
        seoDescription: p.metaDescription || p.shortDescription || `Buy authentic handcrafted ${p.name} at Mun Creations.`,
        createdAt: p.createdAt || new Date(Date.now() - (PRODUCTS.length - idx) * 86400000).toISOString(),
        updatedAt: p.updatedAt || new Date().toISOString(),
        createdBy: "system_seed",
        updatedBy: "system_seed",
      };
      this.products.set(master.id, master);
    });
    this.saveProducts();
  }

  private saveProducts() {
    if (!this.isServerEnvironment()) return;
    try {
      const list = Array.from(this.products.values());
      fs.writeFileSync(this.productsFile, JSON.stringify(list, null, 2), "utf-8");
    } catch (e) {
      console.warn("Failed to persist products to disk:", e);
    }
  }

  private saveCategories() {
    if (!this.isServerEnvironment()) return;
    try {
      const list = Array.from(this.categories.values()).sort((a, b) => a.orderIndex - b.orderIndex);
      fs.writeFileSync(this.categoriesFile, JSON.stringify(list, null, 2), "utf-8");
    } catch (e) {
      console.warn("Failed to persist categories to disk:", e);
    }
  }

  private saveInventory() {
    if (!this.isServerEnvironment()) return;
    try {
      fs.writeFileSync(this.inventoryFile, JSON.stringify(this.inventoryMovements.slice(0, 5000), null, 2), "utf-8");
    } catch (e) {
      console.warn("Failed to persist inventory movements to disk:", e);
    }
  }

  private saveAudit() {
    if (!this.isServerEnvironment()) return;
    try {
      fs.writeFileSync(this.auditFile, JSON.stringify(this.auditLogs.slice(0, 5000), null, 2), "utf-8");
    } catch (e) {
      console.warn("Failed to persist audit logs to disk:", e);
    }
  }

  // --- SLUG & SKU UTILITIES ---
  public generateSlug(name: string, excludeId?: string): string {
    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    let slug = baseSlug || "product";
    let counter = 1;

    while (true) {
      const candidate = counter === 1 ? slug : `${slug}-${counter}`;
      const existing = Array.from(this.products.values()).find(
        (p) => p.slug === candidate && p.id !== excludeId && !p.deletedAt
      );
      if (!existing) {
        return candidate;
      }
      counter++;
    }
  }

  public generateSku(category: string = "SAR"): string {
    const prefix = `MUN-${category.substring(0, 3).toUpperCase()}`;
    let counter = this.products.size + 1;
    while (true) {
      const candidate = `${prefix}-${String(counter).padStart(3, "0")}`;
      const exists = Array.from(this.products.values()).some((p) => p.sku === candidate);
      if (!exists) return candidate;
      counter++;
    }
  }

  public validateSkuUniqueness(sku: string, excludeId?: string): boolean {
    const clean = sku.trim().toUpperCase();
    return !Array.from(this.products.values()).some(
      (p) => p.sku?.trim().toUpperCase() === clean && p.id !== excludeId
    );
  }

  // --- AUDIT LOGGING ---
  public logAudit(
    action: string,
    entity: AuditLog["entity"],
    details: string,
    entityId?: string,
    user: string = "admin"
  ) {
    const log: AuditLog = {
      id: `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      action,
      entity,
      entityId,
      details,
      user,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 5000) this.auditLogs.pop();
    this.saveAudit();
  }

  public getAuditLogs(limit: number = 100): AuditLog[] {
    return this.auditLogs.slice(0, limit);
  }

  // --- ADMIN AUTHENTICATION ---
  public verifyAdminCredentials(password: string): { success: boolean; token?: string; error?: string } {
    const expectedPassword = process.env.ADMIN_PASSWORD || "mun@dev1234";
    if (password === expectedPassword) {
      const token = `adm_${crypto.randomBytes(24).toString("hex")}`;
      // Session valid for 24 hours
      this.activeSessions.set(token, {
        username: "Executive Administrator",
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      });
      this.logAudit("ADMIN_LOGIN", "auth", "Administrator logged into CMS", undefined, "admin");
      return { success: true, token };
    }
    return { success: false, error: "Invalid administrator credentials" };
  }

  public validateSessionToken(token?: string | null): boolean {
    if (!token) return false;
    const cleanToken = token.replace(/^Bearer\s+/i, "").trim();
    const session = this.activeSessions.get(cleanToken);
    if (!session) return false;
    if (Date.now() > session.expiresAt) {
      this.activeSessions.delete(cleanToken);
      return false;
    }
    return true;
  }

  public logoutSession(token: string): boolean {
    const clean = token.replace(/^Bearer\s+/i, "").trim();
    return this.activeSessions.delete(clean);
  }

  // --- PRODUCT MANAGEMENT CRUD ---

  /**
   * Public Product Queries (Only Published & Active)
   */
  public getPublicProducts(query?: {
    category?: string;
    subcategory?: string;
    fabric?: string;
    color?: string;
    tier?: string;
    search?: string;
    sort?: string;
    limit?: number;
    offset?: number;
  }): { products: MasterProduct[]; total: number } {
    let list = Array.from(this.products.values()).filter(
      (p) =>
        p.published !== false &&
        p.active !== false &&
        !p.deletedAt &&
        !p.archivedAt &&
        p.status !== "archived" &&
        p.status !== "draft"
    );

    if (query?.category) {
      const cat = query.category.toLowerCase();
      list = list.filter(
        (p) =>
          p.category.toLowerCase() === cat ||
          p.subcategory?.toLowerCase() === cat ||
          p.mainCategory?.toLowerCase() === cat ||
          p.group?.toLowerCase() === cat
      );
    }

    if (query?.subcategory) {
      const sub = query.subcategory.toLowerCase();
      list = list.filter((p) => p.subcategory?.toLowerCase() === sub);
    }

    if (query?.fabric) {
      const fab = query.fabric.toLowerCase();
      list = list.filter((p) => p.fabric && p.fabric.toLowerCase() === fab);
    }

    if (query?.color) {
      const col = query.color.toLowerCase();
      list = list.filter(
        (p) =>
          (p.color && p.color.toLowerCase() === col) ||
          (p.colors && p.colors.some((c) => c.toLowerCase() === col))
      );
    }

    if (query?.tier) {
      const tier = query.tier.toLowerCase();
      list = list.filter((p) => p.priceTier && p.priceTier.toLowerCase() === tier);
    }

    if (query?.search) {
      const q = query.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    const sort = query?.sort || "featured";
    if (sort === "price-low") {
      list.sort((a, b) => (a.priceUsd ?? a.price ?? 0) - (b.priceUsd ?? b.price ?? 0));
    } else if (sort === "price-high") {
      list.sort((a, b) => (b.priceUsd ?? b.price ?? 0) - (a.priceUsd ?? a.price ?? 0));
    } else if (sort === "newest") {
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (sort === "name-asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "name-desc") {
      list.sort((a, b) => b.name.localeCompare(a.name));
    }

    const total = list.length;
    const offset = query?.offset || 0;
    const limit = query?.limit ? Math.min(query.limit, 200) : list.length;
    const paginated = list.slice(offset, offset + limit);

    return { products: paginated, total };
  }

  /**
   * Admin Product Queries (All Products including Drafts, Archived, Out of Stock)
   */
  public getAdminProducts(query?: {
    search?: string;
    category?: string;
    status?: "all" | "published" | "draft" | "inactive" | "archived";
    stockStatus?: "all" | "in_stock" | "low_stock" | "out_of_stock";
    sort?: string;
    limit?: number;
    offset?: number;
  }): { products: MasterProduct[]; total: number; stats: Record<string, number> } {
    let list = Array.from(this.products.values());

    // Compute live catalog stats
    const stats = {
      total: list.filter((p) => !p.deletedAt && !p.archivedAt).length,
      published: list.filter((p) => p.published && p.active && !p.deletedAt && !p.archivedAt).length,
      draft: list.filter((p) => !p.published && !p.deletedAt && !p.archivedAt).length,
      inactive: list.filter((p) => !p.active && !p.deletedAt && !p.archivedAt).length,
      outOfStock: list.filter((p) => (p.stockQuantity ?? p.stock ?? 0) <= 0 && !p.deletedAt && !p.archivedAt).length,
      lowStock: list.filter(
        (p) =>
          (p.stockQuantity ?? p.stock ?? 0) > 0 &&
          (p.stockQuantity ?? p.stock ?? 0) <= (p.lowStockThreshold || 2) &&
          !p.deletedAt &&
          !p.archivedAt
      ).length,
      archived: list.filter((p) => Boolean(p.archivedAt || p.deletedAt)).length,
    };

    // Filter by status
    const statusFilter = query?.status || "all";
    if (statusFilter === "published") {
      list = list.filter((p) => p.published && p.active && !p.deletedAt && !p.archivedAt);
    } else if (statusFilter === "draft") {
      list = list.filter((p) => !p.published && !p.deletedAt && !p.archivedAt);
    } else if (statusFilter === "inactive") {
      list = list.filter((p) => !p.active && !p.deletedAt && !p.archivedAt);
    } else if (statusFilter === "archived") {
      list = list.filter((p) => Boolean(p.archivedAt || p.deletedAt));
    } else {
      // Default 'all' excludes permanently deleted/archived unless explicitly asked
      list = list.filter((p) => !p.deletedAt && !p.archivedAt);
    }

    // Filter by stock status
    if (query?.stockStatus === "in_stock") {
      list = list.filter((p) => (p.stockQuantity ?? p.stock ?? 0) > (p.lowStockThreshold || 2));
    } else if (query?.stockStatus === "low_stock") {
      list = list.filter(
        (p) =>
          (p.stockQuantity ?? p.stock ?? 0) > 0 &&
          (p.stockQuantity ?? p.stock ?? 0) <= (p.lowStockThreshold || 2)
      );
    } else if (query?.stockStatus === "out_of_stock") {
      list = list.filter((p) => (p.stockQuantity ?? p.stock ?? 0) <= 0);
    }

    // Filter by Category
    if (query?.category) {
      const cat = query.category.toLowerCase();
      list = list.filter(
        (p) => p.category.toLowerCase() === cat || p.subcategory?.toLowerCase() === cat
      );
    }

    // Search query
    if (query?.search) {
      const q = query.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.slug?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    const sort = query?.sort || "newest";
    if (sort === "newest") {
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (sort === "oldest") {
      list.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
    } else if (sort === "recently-updated") {
      list.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
    } else if (sort === "name-asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "name-desc") {
      list.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === "price-low") {
      list.sort((a, b) => (a.priceUsd ?? a.price ?? 0) - (b.priceUsd ?? b.price ?? 0));
    } else if (sort === "price-high") {
      list.sort((a, b) => (b.priceUsd ?? b.price ?? 0) - (a.priceUsd ?? a.price ?? 0));
    } else if (sort === "stock-low") {
      list.sort((a, b) => (a.stockQuantity ?? a.stock ?? 0) - (b.stockQuantity ?? b.stock ?? 0));
    } else if (sort === "stock-high") {
      list.sort((a, b) => (b.stockQuantity ?? b.stock ?? 0) - (a.stockQuantity ?? a.stock ?? 0));
    }

    const total = list.length;
    const offset = query?.offset || 0;
    const limit = query?.limit ? Math.min(query.limit, 200) : list.length;
    const paginated = list.slice(offset, offset + limit);

    return { products: paginated, total, stats };
  }

  public getProductById(id: string): MasterProduct | undefined {
    return this.products.get(id);
  }

  public getPublicProductById(id: string): MasterProduct | undefined {
    const prod = this.products.get(id);
    if (
      !prod ||
      prod.deletedAt ||
      prod.archivedAt ||
      prod.published === false ||
      prod.active === false ||
      prod.status === "archived" ||
      prod.status === "draft"
    ) {
      return undefined;
    }
    return prod;
  }

  public getProductBySlug(slug: string): MasterProduct | undefined {
    const clean = slug.toLowerCase().trim();
    return Array.from(this.products.values()).find(
      (p) =>
        p.slug?.toLowerCase() === clean &&
        !p.deletedAt &&
        !p.archivedAt &&
        p.published !== false &&
        p.active !== false &&
        p.status !== "archived" &&
        p.status !== "draft"
    );
  }

  public addProduct(input: Partial<MasterProduct>, user: string = "admin"): MasterProduct {
    const id = input.id || `p_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const name = input.name ? input.name.trim() : "Untitled Luxury Saree";
    const category = input.category ? input.category.trim() : "Banarasi";
    const sku = input.sku?.trim().toUpperCase() || this.generateSku(category);

    // Validate SKU
    if (!this.validateSkuUniqueness(sku)) {
      throw new Error(`SKU "${sku}" is already in use by another product.`);
    }

    const slug = input.slug?.trim() ? this.generateSlug(input.slug, id) : this.generateSlug(name, id);
    const stock = typeof input.stock === "number" ? Math.max(0, input.stock) : typeof input.stockQuantity === "number" ? Math.max(0, input.stockQuantity) : 5;
    const price = typeof input.price === "number" ? Math.max(0, input.price) : typeof input.priceUsd === "number" ? Math.max(0, input.priceUsd) : 250;
    const compareAtPrice = input.compareAtPrice ?? input.compareAtUsd;

    const images = Array.isArray(input.images) && input.images.length > 0 ? input.images : [input.image || input.thumbnail || "/images/cat-silk.jpg"];
    const primaryImage = images[0];

    const product: MasterProduct = {
      ...input,
      id,
      sku,
      name,
      slug,
      category,
      subcategory: input.subcategory?.trim() || category,
      price,
      priceUsd: price,
      compareAtPrice,
      compareAtUsd: compareAtPrice,
      currency: input.currency || "USD",
      stock,
      stockQuantity: stock,
      lowStockThreshold: input.lowStockThreshold ?? 2,
      trackInventory: input.trackInventory ?? true,
      inStock: stock > 0,
      availability: stock > 0 ? "Available" : "Out of Stock",
      published: input.published ?? true,
      active: input.active ?? true,
      image: primaryImage,
      thumbnail: input.thumbnail || primaryImage,
      images,
      fabric: input.fabric || "Silk",
      color: input.color || "Multicolor",
      colors: Array.isArray(input.colors) ? input.colors : (input.color ? [input.color] : ["Multicolor"]),
      occasion: Array.isArray(input.occasion) ? input.occasion : ["Wedding", "Festive"],
      workType: input.workType || "Zari Work",
      weaveType: input.weaveType || input.weave || "Handloom",
      weave: input.weave || input.weaveType || "Handloom",
      pattern: input.pattern || input.designPattern || "Traditional Jaal",
      designPattern: input.designPattern || input.pattern || "Traditional Jaal",
      blouseIncluded: input.blouseIncluded ?? (input.blousePiece ?? true),
      blousePiece: input.blousePiece ?? (input.blouseIncluded ?? true),
      blouseDetails: input.blouseDetails || input.blouseColor || "Matching Unstitched Blouse Piece",
      sareeLength: input.sareeLength || "5.5 meters",
      blouseLength: input.blouseLength || "0.8 meters",
      weight: input.weight || "750 grams",
      dimensions: input.dimensions || "5.5m x 1.15m",
      tags: Array.isArray(input.tags) ? Array.from(new Set(input.tags.map((t) => t.trim().toLowerCase()))) : [category.toLowerCase(), "silk", "handloom"],
      featured: Boolean(input.featured),
      bestSeller: Boolean(input.bestSeller ?? input.bestseller),
      bestseller: Boolean(input.bestseller ?? input.bestSeller),
      newArrival: Boolean(input.newArrival),
      trending: Boolean(input.trending),
      shortDescription: input.shortDescription || `Exquisite handcrafted ${name} made from authentic ${input.fabric || "Silk"}.`,
      fullDescription: input.fullDescription || input.description || `Handcrafted by heritage master weavers, this ${name} showcases exquisite artisanship and timeless luxury drape.`,
      description: input.description || input.fullDescription || input.shortDescription || "",
      keyFeatures: Array.isArray(input.keyFeatures) ? input.keyFeatures : [
        "100% Certified Authentic Handloom",
        "Includes Matching Unstitched Blouse Piece",
        "Insured Air Delivery & Tamper-Evident Packaging",
      ],
      swatches: Array.isArray(input.swatches) && input.swatches.length > 0 ? input.swatches : ["#800000", "#d4af37"],
      seoTitle: input.seoTitle || `${name} | Mun Creations`,
      seoDescription: input.seoDescription || input.metaDescription || `Buy authentic ${name} online at Mun Creations. Free insured worldwide shipping.`,
      seoKeywords: Array.isArray(input.seoKeywords) ? input.seoKeywords : [name, category, input.fabric || "silk", "saree online"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user,
      updatedBy: user,
    };

    this.products.set(id, product);
    this.saveProducts();

    // Log initial inventory movement if stock > 0
    if (stock > 0) {
      this.recordInventoryMovement(id, name, sku, stock, 0, stock, "Initial product creation", user);
    }

    this.logAudit("PRODUCT_CREATED", "product", `Created product "${name}" (SKU: ${sku})`, id, user);
    return product;
  }

  public updateProduct(id: string, updates: Partial<MasterProduct>, user: string = "admin"): MasterProduct {
    const existing = this.products.get(id);
    if (!existing) {
      throw new Error(`Product with ID "${id}" not found.`);
    }

    // Validate SKU uniqueness if changing
    if (updates.sku && updates.sku.trim().toUpperCase() !== existing.sku?.trim().toUpperCase()) {
      const cleanSku = updates.sku.trim().toUpperCase();
      if (!this.validateSkuUniqueness(cleanSku, id)) {
        throw new Error(`SKU "${cleanSku}" is already used by another product.`);
      }
      updates.sku = cleanSku;
    }

    // Generate unique slug if updating slug or name
    if (updates.slug && updates.slug !== existing.slug) {
      updates.slug = this.generateSlug(updates.slug, id);
    } else if (updates.name && updates.name !== existing.name && !updates.slug) {
      updates.slug = this.generateSlug(updates.name, id);
    }

    // Track stock changes
    const previousStock = existing.stockQuantity ?? existing.stock ?? 0;
    const requestedStock = typeof updates.stock === "number" ? Math.max(0, updates.stock) : typeof updates.stockQuantity === "number" ? Math.max(0, updates.stockQuantity) : undefined;
    if (requestedStock !== undefined && requestedStock !== previousStock) {
      const delta = requestedStock - previousStock;
      updates.stock = requestedStock;
      updates.stockQuantity = requestedStock;
      updates.inStock = requestedStock > 0;
      updates.availability = requestedStock > 0 ? "Available" : "Out of Stock";
      this.recordInventoryMovement(id, existing.name, existing.sku || id, delta, previousStock, requestedStock, "Manual admin update", user);
    }

    // Price updates
    if (typeof updates.price === "number") {
      updates.price = Math.max(0, updates.price);
      updates.priceUsd = updates.price;
    } else if (typeof updates.priceUsd === "number") {
      updates.priceUsd = Math.max(0, updates.priceUsd);
      updates.price = updates.priceUsd;
    }

    // Images sync
    if (Array.isArray(updates.images) && updates.images.length > 0) {
      updates.image = updates.images[0];
      updates.thumbnail = updates.images[0];
    }

    const merged: MasterProduct = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: user,
    };

    this.products.set(id, merged);
    this.saveProducts();

    this.logAudit("PRODUCT_UPDATED", "product", `Updated product "${merged.name}" (SKU: ${merged.sku})`, id, user);
    return merged;
  }

  public deleteProduct(id: string, hardDelete: boolean = false, user: string = "admin"): boolean {
    const existing = this.products.get(id);
    if (!existing) return false;

    if (hardDelete) {
      this.products.delete(id);
      this.logAudit("PRODUCT_DELETED", "product", `Permanently deleted product "${existing.name}" (SKU: ${existing.sku})`, id, user);
    } else {
      // Soft Delete / Archive (Preserves historical references)
      existing.active = false;
      existing.published = false;
      existing.status = "archived";
      existing.archivedAt = new Date().toISOString();
      existing.deletedAt = new Date().toISOString();
      existing.updatedAt = new Date().toISOString();
      existing.updatedBy = user;
      this.products.set(id, existing);
      this.logAudit("PRODUCT_ARCHIVED", "product", `Archived/Soft-deleted product "${existing.name}" (SKU: ${existing.sku})`, id, user);
    }

    this.saveProducts();
    return true;
  }

  public restoreProduct(id: string, user: string = "admin"): MasterProduct {
    const existing = this.products.get(id);
    if (!existing) {
      throw new Error(`Product "${id}" not found.`);
    }

    existing.active = true;
    existing.published = true;
    existing.status = "active";
    existing.archivedAt = undefined;
    existing.deletedAt = undefined;
    existing.updatedAt = new Date().toISOString();
    existing.updatedBy = user;

    this.products.set(id, existing);
    this.saveProducts();
    this.logAudit("PRODUCT_RESTORED", "product", `Restored archived product "${existing.name}" (SKU: ${existing.sku})`, id, user);
    return existing;
  }

  public duplicateProduct(id: string, user: string = "admin"): MasterProduct {
    const original = this.products.get(id);
    if (!original) {
      throw new Error(`Product "${id}" not found.`);
    }

    const newId = `p_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newName = `${original.name} (Copy)`;
    const newSku = this.generateSku(original.category);
    const newSlug = this.generateSlug(newName, newId);

    const duplicated: MasterProduct = {
      ...original,
      id: newId,
      name: newName,
      sku: newSku,
      slug: newSlug,
      published: false, // Start as Draft
      active: true,
      stock: 0,
      stockQuantity: 0,
      inStock: false,
      availability: "Out of Stock",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user,
      updatedBy: user,
      archivedAt: undefined,
      deletedAt: undefined,
    };

    this.products.set(newId, duplicated);
    this.saveProducts();
    this.logAudit("PRODUCT_DUPLICATED", "product", `Duplicated from "${original.name}" to "${newName}" (SKU: ${newSku})`, newId, user);
    return duplicated;
  }

  // --- INVENTORY MANAGEMENT ---
  public adjustStock(
    productId: string,
    deltaQuantity: number,
    reason: string = "Manual adjustment",
    user: string = "admin"
  ): { product: MasterProduct; previousStock: number; newStock: number } {
    const prod = this.products.get(productId);
    if (!prod) {
      throw new Error(`Product with ID "${productId}" not found.`);
    }

    const previousStock = prod.stockQuantity ?? prod.stock ?? 0;
    const newStock = Math.max(0, previousStock + deltaQuantity);

    prod.stock = newStock;
    prod.stockQuantity = newStock;
    prod.inStock = newStock > 0;
    prod.availability = newStock > 0 ? "Available" : "Out of Stock";
    prod.updatedAt = new Date().toISOString();
    prod.updatedBy = user;

    this.products.set(productId, prod);
    this.saveProducts();

    this.recordInventoryMovement(productId, prod.name, prod.sku || productId, deltaQuantity, previousStock, newStock, reason, user);
    this.logAudit("STOCK_ADJUSTED", "inventory", `Stock adjusted for "${prod.name}": ${previousStock} -> ${newStock} (${reason})`, productId, user);

    return { product: prod, previousStock, newStock };
  }

  private recordInventoryMovement(
    productId: string,
    productName: string,
    sku: string,
    deltaQuantity: number,
    previousStock: number,
    newStock: number,
    reason: string,
    user: string
  ) {
    const movement: InventoryMovement = {
      id: `mov_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      productId,
      productName,
      sku,
      deltaQuantity,
      previousStock,
      newStock,
      reason,
      adminUser: user,
      timestamp: new Date().toISOString(),
    };
    this.inventoryMovements.unshift(movement);
    if (this.inventoryMovements.length > 5000) this.inventoryMovements.pop();
    this.saveInventory();
  }

  public getInventoryMovements(productId?: string, limit: number = 100): InventoryMovement[] {
    if (productId) {
      return this.inventoryMovements.filter((m) => m.productId === productId).slice(0, limit);
    }
    return this.inventoryMovements.slice(0, limit);
  }

  // --- CATEGORY MANAGEMENT ---
  public getCategories(): Category[] {
    return Array.from(this.categories.values()).sort((a, b) => a.orderIndex - b.orderIndex);
  }

  public getCategoryBySlug(slug: string): Category | undefined {
    const clean = slug.toLowerCase().trim();
    return Array.from(this.categories.values()).find((c) => c.slug === clean);
  }

  public addCategory(cat: Omit<Category, "id">, user: string = "admin"): Category {
    const id = `cat_${Date.now()}`;
    const slug = cat.slug
      ? cat.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")
      : cat.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

    const created: Category = {
      ...cat,
      id,
      slug,
      orderIndex: cat.orderIndex || this.categories.size + 1,
      active: cat.active ?? true,
      subcategories: Array.isArray(cat.subcategories) ? cat.subcategories : [],
    };

    this.categories.set(id, created);
    this.saveCategories();
    this.logAudit("CATEGORY_CREATED", "category", `Created category "${created.name}"`, id, user);
    return created;
  }

  public updateCategory(id: string, updates: Partial<Category>, user: string = "admin"): Category {
    const existing = this.categories.get(id);
    if (!existing) {
      throw new Error(`Category "${id}" not found.`);
    }

    const updated: Category = {
      ...existing,
      ...updates,
    };

    this.categories.set(id, updated);
    this.saveCategories();
    this.logAudit("CATEGORY_UPDATED", "category", `Updated category "${updated.name}"`, id, user);
    return updated;
  }

  public deleteCategory(id: string, user: string = "admin"): boolean {
    const existing = this.categories.get(id);
    if (!existing) return false;

    this.categories.delete(id);
    this.saveCategories();
    this.logAudit("CATEGORY_DELETED", "category", `Deleted category "${existing.name}"`, id, user);
    return true;
  }

  // --- BULK OPERATIONS ---
  public bulkUpdate(
    productIds: string[],
    updates: {
      published?: boolean;
      active?: boolean;
      category?: string;
      stock?: number;
      featured?: boolean;
      bestSeller?: boolean;
      newArrival?: boolean;
      trending?: boolean;
      archive?: boolean;
    },
    user: string = "admin"
  ): { updatedCount: number } {
    let count = 0;
    for (const id of productIds) {
      try {
        if (updates.archive) {
          this.deleteProduct(id, false, user);
          count++;
        } else {
          this.updateProduct(id, updates as any, user);
          count++;
        }
      } catch {
        // continue
      }
    }
    this.logAudit("BULK_UPDATE", "product", `Bulk updated ${count} products`, undefined, user);
    return { updatedCount: count };
  }

  public bulkImportCSV(
    csvText: string,
    user: string = "admin"
  ): {
    totalRows: number;
    validRows: Array<Partial<MasterProduct>>;
    invalidRows: Array<{ row: number; errors: string[] }>;
    duplicateSkus: string[];
    importedCount: number;
  } {
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length <= 1) {
      return { totalRows: 0, validRows: [], invalidRows: [], duplicateSkus: [], importedCount: 0 };
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/["']/g, ""));
    const getCol = (hArr: string[], rowVals: string[], ...names: string[]) => {
      for (const name of names) {
        const idx = hArr.findIndex((h) => h.includes(name));
        if (idx !== -1 && rowVals[idx]) return rowVals[idx].trim().replace(/^["']|["']$/g, "");
      }
      return "";
    };

    const validRows: Array<Partial<MasterProduct>> = [];
    const invalidRows: Array<{ row: number; errors: string[] }> = [];
    const seenSkusInCsv = new Set<string>();
    const duplicateSkus: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const rawLine = lines[i];
      // Basic CSV splitter handling quoted values
      const cols = (rawLine.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || rawLine.split(",")).map((c) =>
        c.trim().replace(/^["']|["']$/g, "")
      );

      const rowNum = i + 1;
      const rowErrors: string[] = [];

      const name = getCol(headers, cols, "name", "title", "product");
      const sku = getCol(headers, cols, "sku", "item_code", "product_code");
      const priceStr = getCol(headers, cols, "price", "mrp", "cost");
      const price = parseFloat(priceStr);
      const category = getCol(headers, cols, "category", "collection") || "Banarasi";
      const fabric = getCol(headers, cols, "fabric", "material") || "Silk";
      const color = getCol(headers, cols, "color") || "Multicolor";
      const stockStr = getCol(headers, cols, "stock", "quantity", "qty");
      const stock = stockStr ? parseInt(stockStr, 10) : 5;

      if (!name) rowErrors.push("Product name is required.");
      if (isNaN(price) || price < 0) rowErrors.push("Valid positive price is required.");

      if (sku) {
        if (seenSkusInCsv.has(sku.toUpperCase())) {
          duplicateSkus.push(`Row ${rowNum}: SKU "${sku}" is duplicated inside this CSV.`);
          rowErrors.push(`Duplicate SKU "${sku}" inside CSV.`);
        } else if (!this.validateSkuUniqueness(sku)) {
          duplicateSkus.push(`Row ${rowNum}: SKU "${sku}" already exists in the database.`);
          rowErrors.push(`SKU "${sku}" already exists in database.`);
        }
        seenSkusInCsv.add(sku.toUpperCase());
      }

      if (rowErrors.length > 0) {
        invalidRows.push({ row: rowNum, errors: rowErrors });
      } else {
        const item: Partial<MasterProduct> = {
          name,
          sku: sku || undefined,
          price,
          category,
          subcategory: getCol(headers, cols, "subcategory") || category,
          fabric,
          color,
          stock: isNaN(stock) ? 5 : stock,
          description: getCol(headers, cols, "description", "details"),
          shortDescription: getCol(headers, cols, "short_description"),
          image: getCol(headers, cols, "image", "photo", "image_url") || "/images/cat-silk.jpg",
          seoTitle: getCol(headers, cols, "seo_title"),
          seoDescription: getCol(headers, cols, "seo_description"),
          published: true,
          active: true,
        };
        validRows.push(item);
      }
    }

    let importedCount = 0;
    for (const valid of validRows) {
      try {
        this.addProduct(valid, user);
        importedCount++;
      } catch {
        // skip failed
      }
    }

    this.logAudit("BULK_IMPORT", "bulk_import", `Imported ${importedCount} products from CSV (${invalidRows.length} invalid)`, undefined, user);

    return {
      totalRows: lines.length - 1,
      validRows,
      invalidRows,
      duplicateSkus,
      importedCount,
    };
  }

  public exportProductsToCSV(): string {
    const list = Array.from(this.products.values()).filter((p) => !p.deletedAt);
    const headers = [
      "SKU",
      "Name",
      "Slug",
      "Category",
      "Subcategory",
      "Price",
      "CompareAtPrice",
      "Currency",
      "Stock",
      "Status",
      "Fabric",
      "Color",
      "WorkType",
      "Occasion",
      "Tags",
      "Featured",
      "BestSeller",
      "NewArrival",
      "ImageURL",
      "ShortDescription",
      "SEOTitle",
      "SEODescription",
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = list.map((p) => [
      escapeCsv(p.sku),
      escapeCsv(p.name),
      escapeCsv(p.slug),
      escapeCsv(p.category),
      escapeCsv(p.subcategory),
      p.priceUsd ?? p.price ?? 0,
      p.compareAtPrice ?? "",
      escapeCsv(p.currency || "USD"),
      p.stockQuantity ?? p.stock ?? 0,
      escapeCsv(p.published && p.active ? "Published" : !p.published ? "Draft" : "Inactive"),
      escapeCsv(p.fabric),
      escapeCsv(p.color),
      escapeCsv(p.workType),
      escapeCsv(Array.isArray(p.occasion) ? p.occasion.join("; ") : p.occasion),
      escapeCsv(Array.isArray(p.tags) ? p.tags.join("; ") : p.tags),
      p.featured ? "TRUE" : "FALSE",
      p.bestSeller || p.bestseller ? "TRUE" : "FALSE",
      p.newArrival ? "TRUE" : "FALSE",
      escapeCsv(p.image),
      escapeCsv(p.shortDescription),
      escapeCsv(p.seoTitle),
      escapeCsv(p.seoDescription),
    ]);

    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  }
}

export const productDatabase = new ProductDatabaseService();
