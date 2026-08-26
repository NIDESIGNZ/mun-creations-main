import type { Product } from "./products";
import { PRODUCTS } from "./products";

export type OrderStatus =
  | "Pending Payment"
  | "Paid"
  | "Confirmed"
  | "Processing"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled"
  | "Refund Requested"
  | "Refunded"
  | "Returned"
  | "RTO"
  | "Failed";

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  priceUsd: number;
};

export type Order = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  pincode?: string;
  items: OrderItem[];
  subtotalUsd: number;
  status: OrderStatus;
  paymentMethod: "razorpay" | "stripe" | "paypal" | "card";
  paymentId?: string;
  awbNumber?: string;
  courierPartner?: string;
  trackingUrl?: string;
  createdAt: string;
};

export type CustomerOrder = Order;

export type WeaverSource = {
  id: string;
  name?: string;
  clusterName?: string;
  region?: string;
  state?: string;
  craft?: string;
  specialty?: string;
  artisanCount?: number;
  contactPerson?: string;
  phone?: string;
  email?: string;
  leadTimeDays?: number;
  qualityRating?: number;
  status?: string;
  verified?: boolean;
};

export type Coupon = {
  code: string;
  discountType: "percentage" | "fixed";
  amount: number;
  minCartUsd: number;
  maxDiscountUsd?: number;
  codApplicable: boolean;
  usageCount: number;
};

export type PincodeServiceability = {
  pincode: string;
  city: string;
  state: string;
  serviceable: boolean;
  codAvailable: boolean;
  estimatedDays: number;
};

const initialSources: WeaverSource[] = [
  { id: "s1", name: "Varanasi Master Weavers Cooperative", region: "Varanasi, UP", craft: "Kadwa Banarasi", artisanCount: 120, verified: true },
  { id: "s2", name: "Kanchipuram Silk Handloom Society", region: "Kanchipuram, TN", craft: "Korvai Kanjivaram", artisanCount: 85, verified: true },
  { id: "s3", name: "Bishnupur Tussar Guild", region: "Bishnupur, WB", craft: "Kantha Tussar", artisanCount: 64, verified: true },
];

const initialOrders: Order[] = [
  {
    id: "ORD-2026-9041",
    customerName: "Ananya Roy",
    email: "ananya.roy@example.com",
    phone: "+91 98765 43210",
    shippingAddress: "B-402, Green Glen Layout, Bellandur, Bengaluru, Karnataka 560103",
    pincode: "560103",
    items: [
      {
        productId: "p1",
        productName: "Maroon Katan Banarasi Silk Saree With Kadwa Jaal",
        quantity: 1,
        priceUsd: 580,
      },
    ],
    subtotalUsd: 580,
    status: "Shipped",
    paymentMethod: "razorpay",
    paymentId: "pay_Rzp9041B",
    awbNumber: "SR109482710IN",
    courierPartner: "Shiprocket (Bluedart Express)",
    trackingUrl: "https://shiprocket.co/tracking/SR109482710IN",
    createdAt: "2026-08-11T14:30:00Z",
  },
  {
    id: "ORD-2026-9042",
    customerName: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+1 (555) 234-5678",
    shippingAddress: "450 Lexington Ave, Suite 1200, New York, NY 10017, United States",
    pincode: "10017",
    items: [
      {
        productId: "p4",
        productName: "Royal Crimson Pure Kanjivaram Silk Bridal Saree",
        quantity: 1,
        priceUsd: 899,
      },
    ],
    subtotalUsd: 899,
    status: "Confirmed",
    paymentMethod: "stripe",
    paymentId: "ch_3M00000000000000",
    awbNumber: "DHL998234101",
    courierPartner: "DHL Express Worldwide",
    createdAt: "2026-08-12T10:15:00Z",
  },
];

const initialCoupons: Coupon[] = [
  {
    code: "MUNHERITAGE10",
    discountType: "percentage",
    amount: 10,
    minCartUsd: 100,
    codApplicable: true,
    usageCount: 42,
  },
  {
    code: "ROYAL50",
    discountType: "fixed",
    amount: 50,
    minCartUsd: 300,
    codApplicable: false,
    usageCount: 19,
  },
];

const PINCODE_DATABASE: Record<string, PincodeServiceability> = {
  "110001": { pincode: "110001", city: "New Delhi", state: "Delhi", serviceable: true, codAvailable: true, estimatedDays: 3 },
  "400001": { pincode: "400001", city: "Mumbai", state: "Maharashtra", serviceable: true, codAvailable: true, estimatedDays: 3 },
  "560001": { pincode: "560001", city: "Bengaluru", state: "Karnataka", serviceable: true, codAvailable: true, estimatedDays: 2 },
  "700001": { pincode: "700001", city: "Kolkata", state: "West Bengal", serviceable: true, codAvailable: true, estimatedDays: 2 },
  "10017": { pincode: "10017", city: "New York", state: "NY", serviceable: true, codAvailable: false, estimatedDays: 5 },
};

class BackendDatabase {
  private products: Product[] = [...PRODUCTS];
  private orders: Order[] = [...initialOrders];
  private coupons: Coupon[] = [...initialCoupons];
  private sources: WeaverSource[] = [...initialSources];

  getHealthStatus() {
    return {
      status: "ok",
      uptime: typeof process !== "undefined" && process.uptime ? process.uptime() : 3600,
      uptimeSeconds: typeof process !== "undefined" && process.uptime ? process.uptime() : 3600,
      databaseState: "Connected",
      version: "v3.4.0",
      dbConnected: true,
      productCount: this.products.length,
      orderCount: this.orders.length,
      timestamp: new Date().toISOString(),
    };
  }

  // Product Methods
  getProducts(filter?: { category?: string; search?: string }): Product[] {
    let list = this.products;
    if (filter?.category) {
      list = list.filter((p) => p.category.toLowerCase() === filter.category?.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.fabric.toLowerCase().includes(q));
    }
    return list;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.products.find((p) => p.slug === slug);
  }

  addProduct(newProduct: Omit<Product, "id">): Product {
    const created: Product = {
      ...newProduct,
      id: `p_${Date.now()}`,
      stockQuantity: newProduct.stockQuantity ?? 1,
      availability: newProduct.availability ?? "Available",
      vendor: newProduct.vendor ?? "Ethnic Boutique",
    };
    this.products.unshift(created);
    return created;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    this.products[idx] = { ...this.products[idx], ...updates };
    return this.products[idx];
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    return this.products.length < initialLen;
  }

  // Weaver Sources Methods
  getSources(): WeaverSource[] {
    return this.sources;
  }

  addSource(src: Omit<WeaverSource, "id">): WeaverSource {
    const created: WeaverSource = { ...src, id: `s_${Date.now()}` };
    this.sources.push(created);
    return created;
  }

  // Order Methods
  getOrders(): Order[] {
    return this.orders;
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id);
  }

  createOrder(orderData: Omit<Order, "id" | "status" | "createdAt" | "paymentMethod"> & { paymentMethod?: Order["paymentMethod"] }): Order {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Confirmed",
      paymentMethod: orderData.paymentMethod || "card",
      paymentId: `pay_${Date.now()}`,
      awbNumber: `SR${Math.floor(100000000 + Math.random() * 900000000)}IN`,
      courierPartner: "Shiprocket Express Air",
      createdAt: new Date().toISOString(),
    };
    this.orders.unshift(newOrder);

    orderData.items.forEach((item) => {
      const prod = this.getProductById(item.productId);
      if (prod && prod.stockQuantity) {
        const newStock = Math.max(0, prod.stockQuantity - item.quantity);
        this.updateProduct(prod.id, {
          stockQuantity: newStock,
          availability: newStock === 0 ? "Out of Stock" : "Available",
        });
      }
    });

    return newOrder;
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Order | undefined {
    const order = this.getOrderById(orderId);
    if (!order) return undefined;
    order.status = status;
    return order;
  }

  // Coupon Engine
  getCoupons(): Coupon[] {
    return this.coupons;
  }

  validateCoupon(code: string, cartTotalUsd: number): { valid: boolean; discountAmountUsd: number; message: string } {
    const clean = code.trim().toUpperCase();
    const found = this.coupons.find((c) => c.code === clean);

    if (!found) {
      return { valid: false, discountAmountUsd: 0, message: "Invalid promo code" };
    }

    if (cartTotalUsd < found.minCartUsd) {
      return {
        valid: false,
        discountAmountUsd: 0,
        message: `Minimum order value of $${found.minCartUsd} required for this code.`,
      };
    }

    let discount = 0;
    if (found.discountType === "percentage") {
      discount = Math.round((cartTotalUsd * found.amount) / 100);
      if (found.maxDiscountUsd) {
        discount = Math.min(discount, found.maxDiscountUsd);
      }
    } else {
      discount = found.amount;
    }

    return {
      valid: true,
      discountAmountUsd: discount,
      message: `Coupon '${found.code}' applied successfully!`,
    };
  }

  // Express Shipping Pincode Engine
  checkPincodeServiceability(pincode: string, orderTotalUsd: number): PincodeServiceability {
    const cleanPin = pincode.trim();
    const record = PINCODE_DATABASE[cleanPin] || {
      pincode: cleanPin,
      city: "Standard Zone",
      state: "India Standard",
      serviceable: true,
      codAvailable: false,
      estimatedDays: 4,
    };

    return record;
  }

  // CSV Bulk Import Engine
  parseAndImportCSV(csvContent: string): { importedCount: number; errors: string[] } {
    const lines = csvContent.split("\n").filter((l) => l.trim().length > 0);
    if (lines.length <= 1) {
      return { importedCount: 0, errors: ["CSV file is empty or missing headers"] };
    }

    let importedCount = 0;
    const errors: string[] = [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const nameIdx = headers.findIndex((h) => h.includes("name"));
    const priceIdx = headers.findIndex((h) => h.includes("price") || h.includes("mrp"));
    const fabricIdx = headers.findIndex((h) => h.includes("fabric"));
    const skuIdx = headers.findIndex((h) => h.includes("sku"));
    const categoryIdx = headers.findIndex((h) => h.includes("category"));

    for (let i = 1; i < lines.length; i++) {
      try {
        const row = lines[i].split(",").map((c) => c.trim());
        const name = nameIdx !== -1 ? row[nameIdx] : `Imported Saree ${i}`;
        const price = priceIdx !== -1 ? parseFloat(row[priceIdx]) || 250 : 250;
        const fabric = fabricIdx !== -1 ? row[fabricIdx] : "Silk";
        const sku = skuIdx !== -1 ? row[skuIdx] : `EBS-CSV-${i}`;
        const category = categoryIdx !== -1 ? row[categoryIdx] : "Banarasi";

        if (!name || isNaN(price)) {
          errors.push(`Row ${i + 1}: Missing name or valid price`);
          continue;
        }

        this.addProduct({
          sku,
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          category,
          productType: category,
          fabric,
          color: "Multicolor",
          priceUsd: price,
          vendor: "Ethnic Boutique CSV Import",
          stockQuantity: 5,
          availability: "Available",
          image: PRODUCTS[0].image,
          swatches: ["#d4af37", "#800000"],
          shortDescription: `Authentic ${fabric} saree imported from batch.`,
          fullDescription: `Handcrafted ${name} featuring rich ${fabric} weaving.`,
        });

        importedCount++;
      } catch (err: any) {
        errors.push(`Row ${i + 1}: ${err.message || "Parse error"}`);
      }
    }

    return { importedCount, errors };
  }

  // AI Product Copy Generator Engine
  generateAICopy(productName: string, fabric: string, craft: string, color: string) {
    return {
      shortDescription: `Exquisite ${color} ${fabric} saree adorned with authentic ${craft} handloom weaving.`,
      fullDescription: `Handcrafted by master artisans in Varanasi using pure ${fabric} yarns, this ${color} saree features intricate ${craft} motifs. Designed for weddings, receptions, and regal celebrations.`,
      keyFeatures: [
        `100% Pure Certified ${fabric}`,
        `Authentic ${craft} Handloom Motif Work`,
        "Includes Unstitched Matching Blouse Piece",
        "Silk Mark Guarantee Certified",
      ],
      seoTitle: `${productName} | Pure ${fabric} ${craft} Saree — Ethnic Boutique`,
      metaDescription: `Buy authentic ${productName} in ${color} ${fabric}. Handwoven ${craft} craftsmanship. Free worldwide shipping.`,
      instagramCaption: `Step into timeless luxury with our new ${productName}. Woven in ${color} ${fabric} with intricate ${craft} details. ✨ Tap link in bio to shop! #EthnicBoutique #${fabric}Saree #${craft}`,
    };
  }
}

export const backendDB = new BackendDatabase();
