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
  shippingProvider?: string;
  shippingService?: string;
  shippingMethod?: string;
  shippingCostInr?: number;
  shippingCostUsd?: number;
  estimatedDeliveryDate?: string;
  trackingNumber?: string;
  shipmentId?: string;
  trackingUrl?: string;
  createdAt: string;
};

export type Shipment = {
  id: string;
  orderId: string;
  provider: string;
  service: string;
  trackingNumber: string;
  labelUrl?: string;
  status: string;
  originPincode: string;
  destinationPincode: string;
  shippingCostInr: number;
  estimatedDeliveryDate: string;
  createdAt: string;
  updatedAt: string;
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
  {
    id: "s1",
    name: "Varanasi Master Weavers Cooperative",
    region: "Varanasi, UP",
    craft: "Kadwa Banarasi",
    artisanCount: 120,
    verified: true,
  },
  {
    id: "s2",
    name: "Kanchipuram Silk Handloom Society",
    region: "Kanchipuram, TN",
    craft: "Korvai Kanjivaram",
    artisanCount: 85,
    verified: true,
  },
  {
    id: "s3",
    name: "Bishnupur Tussar Guild",
    region: "Bishnupur, WB",
    craft: "Kantha Tussar",
    artisanCount: 64,
    verified: true,
  },
];

const initialOrders: Order[] = [];

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
  "110001": {
    pincode: "110001",
    city: "New Delhi",
    state: "Delhi",
    serviceable: true,
    codAvailable: true,
    estimatedDays: 3,
  },
  "400001": {
    pincode: "400001",
    city: "Mumbai",
    state: "Maharashtra",
    serviceable: true,
    codAvailable: true,
    estimatedDays: 3,
  },
  "560001": {
    pincode: "560001",
    city: "Bengaluru",
    state: "Karnataka",
    serviceable: true,
    codAvailable: true,
    estimatedDays: 2,
  },
  "700001": {
    pincode: "700001",
    city: "Kolkata",
    state: "West Bengal",
    serviceable: true,
    codAvailable: true,
    estimatedDays: 2,
  },
  "10017": {
    pincode: "10017",
    city: "New York",
    state: "NY",
    serviceable: true,
    codAvailable: false,
    estimatedDays: 5,
  },
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
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.fabric.toLowerCase().includes(q),
      );
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
      inStock: newProduct.inStock ?? true,
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

  // Authoritative Inventory Adjustment Engine
  adjustStock(
    productId: string,
    deltaQuantity: number,
    reason: string = "manual adjustment",
  ): { product?: Product; success: boolean; newStock: number; message: string } {
    const prod = this.getProductById(productId);
    if (!prod) {
      return { success: false, newStock: 0, message: `Product ${productId} not found` };
    }

    const currentStock = prod.stockQuantity ?? prod.stock ?? 0;
    const newStock = Math.max(0, currentStock + deltaQuantity);
    const inStock = newStock > 0;
    const availability = newStock > 0 ? "Available" : "Out of Stock";

    const updated = this.updateProduct(productId, {
      stockQuantity: newStock,
      stock: newStock,
      inStock,
      active: inStock,
      availability,
    });

    return {
      product: updated,
      success: true,
      newStock,
      message: `Stock updated for ${prod.name}: ${currentStock} -> ${newStock} (${reason})`,
    };
  }

  // Categories Hierarchy Engine
  getCategories(): Array<{ name: string; slug: string; count: number; subcategories: string[] }> {
    const catMap = new Map<string, { count: number; subcategories: Set<string> }>();

    this.products.forEach((p) => {
      const cat = p.category || "Uncategorized";
      if (!catMap.has(cat)) {
        catMap.set(cat, { count: 0, subcategories: new Set() });
      }
      const entry = catMap.get(cat)!;
      entry.count += 1;
      if (p.subcategory) entry.subcategories.add(p.subcategory);
    });

    return Array.from(catMap.entries()).map(([name, data]) => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      count: data.count,
      subcategories: Array.from(data.subcategories),
    }));
  }

  getCategoryBySlug(slug: string): { name: string; products: Product[] } | null {
    const clean = slug.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const matched = this.products.filter(
      (p) =>
        p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === clean ||
        p.subcategory?.toLowerCase().replace(/[^a-z0-9]+/g, "-") === clean ||
        p.group?.toLowerCase().replace(/[^a-z0-9]+/g, "-") === clean,
    );

    if (matched.length === 0) return null;
    return {
      name: matched[0].category,
      products: matched,
    };
  }

  // Authoritative Server-Side Cart Calculation
  calculateCartTotals(
    items: Array<{ productId: string; quantity: number }>,
    promoCode?: string,
    shippingMethod: "standard" | "express" = "standard",
  ) {
    if (!items || items.length === 0) {
      return {
        items: [],
        subtotalUsd: 0,
        discountUsd: 0,
        shippingFeeUsd: 0,
        finalTotalUsd: 0,
        currency: "USD",
      };
    }

    const calculatedItems = items.map((it) => {
      const prod = this.getProductById(it.productId);
      if (!prod) {
        throw new Error(`Product with ID "${it.productId}" does not exist in catalog.`);
      }
      const stock = prod.stockQuantity ?? prod.stock ?? 1;
      if (stock < it.quantity) {
        throw new Error(`Insufficient stock for "${prod.name}". Only ${stock} left.`);
      }
      const price = prod.priceUsd ?? prod.price ?? 0;
      return {
        productId: prod.id,
        productName: prod.name,
        image: prod.image || prod.thumbnail || "",
        unitPriceUsd: price,
        quantity: it.quantity,
        lineTotalUsd: price * it.quantity,
      };
    });

    const subtotalUsd = calculatedItems.reduce((acc, i) => acc + i.lineTotalUsd, 0);

    let discountUsd = 0;
    let couponMessage = "";
    if (promoCode) {
      const couponCheck = this.validateCoupon(promoCode, subtotalUsd);
      if (couponCheck.valid) {
        discountUsd = couponCheck.discountAmountUsd;
        couponMessage = couponCheck.message;
      }
    }

    const isFreeShipping = subtotalUsd >= 500;
    const shippingFeeUsd = isFreeShipping ? 0 : shippingMethod === "express" ? 45 : 25;
    const finalTotalUsd = Math.max(0, subtotalUsd - discountUsd + shippingFeeUsd);

    return {
      items: calculatedItems,
      subtotalUsd,
      discountUsd,
      couponMessage,
      shippingFeeUsd,
      finalTotalUsd,
      currency: "USD",
    };
  }

  // POS In-Store Sale Terminal Engine
  createPOSSale(posData: {
    items: Array<{ productId: string; quantity: number }>;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    paymentMethod: "cash" | "card" | "upi" | "pos";
    tenderedAmountUsd?: number;
    notes?: string;
  }): Order {
    const calc = this.calculateCartTotals(posData.items);

    const orderItems: OrderItem[] = calc.items.map((it) => ({
      productId: it.productId,
      productName: it.productName,
      quantity: it.quantity,
      priceUsd: it.unitPriceUsd,
    }));

    const order = this.createOrder({
      customerName: posData.customerName || "In-Store Walk-in Guest",
      email: posData.customerEmail || "pos@muncreation.com",
      phone: posData.customerPhone || "+91 99999 00000",
      shippingAddress: "Mun Creations Flagship Atelier (In-Store Retail POS Sale)",
      pincode: "560001",
      items: orderItems,
      subtotalUsd: calc.finalTotalUsd,
      paymentMethod: (posData.paymentMethod === "pos" ? "card" : posData.paymentMethod) as any,
      paymentId: `pos_${Date.now()}`,
      status: "Confirmed",
    });

    return order;
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

  getOrderByPaymentId(paymentId: string): Order | undefined {
    return this.orders.find((o) => o.paymentId === paymentId);
  }

  createOrder(
    orderData: Omit<Order, "id" | "status" | "createdAt" | "paymentMethod"> & {
      paymentMethod?: Order["paymentMethod"];
      paymentId?: string;
      status?: OrderStatus;
    },
  ): Order {
    // Idempotency: If order with this paymentId already exists, return it without duplicate stock deduction
    if (orderData.paymentId) {
      const existing = this.getOrderByPaymentId(orderData.paymentId);
      if (existing) {
        return existing;
      }
    }

    const newOrder: Order = {
      ...orderData,
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: orderData.status || "Confirmed",
      paymentMethod: orderData.paymentMethod || "card",
      paymentId: orderData.paymentId || `pay_${Date.now()}`,
      awbNumber: `SR${Math.floor(100000000 + Math.random() * 900000000)}IN`,
      courierPartner: "Shiprocket Express Air",
      createdAt: new Date().toISOString(),
    };
    this.orders.unshift(newOrder);

    // Deduct stock inventory authoritatively across online and in-store channels
    orderData.items.forEach((item) => {
      this.adjustStock(item.productId, -item.quantity, `Order fulfillment ${newOrder.id}`);
    });

    return newOrder;
  }

  cancelOrder(orderId: string, reason: string = "Customer cancellation"): Order | undefined {
    const order = this.getOrderById(orderId);
    if (!order || order.status === "Cancelled") return order;

    // Restore stock inventory
    order.items.forEach((item) => {
      this.adjustStock(item.productId, item.quantity, `Order cancellation ${orderId}: ${reason}`);
    });

    order.status = "Cancelled";
    return order;
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Order | undefined {
    const order = this.getOrderById(orderId);
    if (!order) return undefined;

    // If transitioned to Cancelled or Returned, restore inventory
    if (
      (status === "Cancelled" || status === "Returned") &&
      order.status !== "Cancelled" &&
      order.status !== "Returned"
    ) {
      order.items.forEach((item) => {
        this.adjustStock(item.productId, item.quantity, `Order ${status} ${orderId}`);
      });
    }

    order.status = status;
    return order;
  }

  updateOrderByPaymentId(paymentId: string, updates: Partial<Order>): Order | undefined {
    const order = this.getOrderByPaymentId(paymentId);
    if (!order) return undefined;
    Object.assign(order, updates);
    return order;
  }

  // Coupon Engine
  getCoupons(): Coupon[] {
    return this.coupons;
  }

  validateCoupon(
    code: string,
    cartTotalUsd: number,
  ): { valid: boolean; discountAmountUsd: number; message: string } {
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
