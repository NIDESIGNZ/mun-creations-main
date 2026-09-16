/**
 * Mun Creations Enterprise Admin CMS API Client
 * Manages authenticated server-side API requests, token lifecycle, and file uploads.
 */

import type { Product } from "./products";
import type { CatalogCategory } from "./catalog-client";

const TOKEN_KEY = "mun_admin_token";

export interface AdminProductStats {
  total: number;
  active: number;
  draft: number;
  archived: number;
  lowStock: number;
  outOfStock: number;
}

export interface AdminProductsResponse {
  success: boolean;
  total: number;
  limit: number;
  offset: number;
  products: Product[];
  stats: AdminProductStats;
  error?: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  timestamp: string;
  type: "restock" | "sale" | "return" | "manual_adjustment" | "audit";
  previousQuantity: number;
  newQuantity: number;
  delta: number;
  reason: string;
  performedBy: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  entityType: "product" | "category" | "inventory" | "system";
  entityId?: string;
  details?: any;
  user: string;
}

export interface AdminInventoryResponse {
  success: boolean;
  stats: AdminProductStats;
  lowStockItems: Product[];
  movements: InventoryMovement[];
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  orderIndex: number;
  active: boolean;
  subcategories: string[];
}

// Token Helpers
export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

async function adminFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearAdminToken();
    throw new Error("Session expired or unauthorized. Please sign in again.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }

  return data as T;
}

// Auth API
export async function adminLogin(password: string): Promise<{ success: boolean; token?: string; user?: any; error?: string }> {
  const res = await fetch("/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (res.ok && data.token) {
    setAdminToken(data.token);
  }
  return data;
}

export async function adminVerify(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;
  try {
    const res = await fetch("/api/admin/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function adminLogout(): Promise<void> {
  const token = getAdminToken();
  if (token) {
    await fetch("/api/admin/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
  clearAdminToken();
}

// Products API
export async function getAdminProducts(params?: {
  search?: string;
  category?: string;
  status?: "all" | "active" | "draft" | "archived";
  stockStatus?: "all" | "in_stock" | "low_stock" | "out_of_stock";
  sort?: string;
  limit?: number;
  offset?: number;
}): Promise<AdminProductsResponse> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.category) query.set("category", params.category);
  if (params?.status) query.set("status", params.status);
  if (params?.stockStatus) query.set("stockStatus", params.stockStatus);
  if (params?.sort) query.set("sort", params.sort);
  if (params?.limit !== undefined) query.set("limit", params.limit.toString());
  if (params?.offset !== undefined) query.set("offset", params.offset.toString());

  return adminFetch<AdminProductsResponse>(`/api/admin/products?${query.toString()}`);
}

export async function getAdminProductById(id: string): Promise<Product> {
  const res = await adminFetch<{ success: boolean; product: Product }>(`/api/admin/products/${encodeURIComponent(id)}`);
  return res.product;
}

export async function createAdminProduct(productData: Partial<Product>): Promise<Product> {
  const res = await adminFetch<{ success: boolean; product: Product }>("/api/admin/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
  return res.product;
}

export async function updateAdminProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const res = await adminFetch<{ success: boolean; product: Product }>(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  return res.product;
}

export async function deleteAdminProduct(id: string, hard: boolean = false): Promise<boolean> {
  const res = await adminFetch<{ success: boolean }>(`/api/admin/products/${encodeURIComponent(id)}?hard=${hard}`, {
    method: "DELETE",
  });
  return res.success;
}

export async function publishAdminProduct(id: string): Promise<Product> {
  const res = await adminFetch<{ success: boolean; product: Product }>(`/api/admin/products/${encodeURIComponent(id)}/publish`, {
    method: "POST",
  });
  return res.product;
}

export async function unpublishAdminProduct(id: string): Promise<Product> {
  const res = await adminFetch<{ success: boolean; product: Product }>(`/api/admin/products/${encodeURIComponent(id)}/unpublish`, {
    method: "POST",
  });
  return res.product;
}

export async function duplicateAdminProduct(id: string): Promise<Product> {
  const res = await adminFetch<{ success: boolean; product: Product }>(`/api/admin/products/${encodeURIComponent(id)}/duplicate`, {
    method: "POST",
  });
  return res.product;
}

export async function restoreAdminProduct(id: string): Promise<Product> {
  const res = await adminFetch<{ success: boolean; product: Product }>(`/api/admin/products/${encodeURIComponent(id)}/restore`, {
    method: "POST",
  });
  return res.product;
}

export async function bulkUpdateAdminProducts(productIds: string[], updates: Partial<Product>): Promise<{ updatedCount: number }> {
  return adminFetch<{ success: boolean; updatedCount: number }>("/api/admin/products/bulk-update", {
    method: "POST",
    body: JSON.stringify({ productIds, updates }),
  });
}

export async function bulkImportAdminProducts(csvContent: string): Promise<{ importedCount: number; errors: string[]; duplicateSkus: string[] }> {
  return adminFetch<{ success: boolean; importedCount: number; errors: string[]; duplicateSkus: string[] }>("/api/admin/products/bulk-import", {
    method: "POST",
    body: JSON.stringify({ csvContent }),
  });
}

export function getExportProductsUrl(): string {
  return "/api/admin/products/export";
}

// Categories API
export async function getAdminCategories(): Promise<AdminCategory[]> {
  const res = await adminFetch<{ success: boolean; categories: AdminCategory[] }>("/api/admin/categories");
  return res.categories;
}

export async function createAdminCategory(data: Partial<AdminCategory>): Promise<AdminCategory> {
  const res = await adminFetch<{ success: boolean; category: AdminCategory }>("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.category;
}

export async function updateAdminCategory(id: string, updates: Partial<AdminCategory>): Promise<AdminCategory> {
  const res = await adminFetch<{ success: boolean; category: AdminCategory }>(`/api/admin/categories/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  return res.category;
}

export async function deleteAdminCategory(id: string): Promise<boolean> {
  const res = await adminFetch<{ success: boolean }>(`/api/admin/categories/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return res.success;
}

// Inventory API
export async function getAdminInventory(): Promise<AdminInventoryResponse> {
  return adminFetch<AdminInventoryResponse>("/api/admin/inventory");
}

export async function adjustAdminStock(
  productId: string,
  deltaQuantity: number,
  reason: string
): Promise<{ success: boolean; product: Product; movement: InventoryMovement }> {
  return adminFetch<{ success: boolean; product: Product; movement: InventoryMovement }>(
    `/api/admin/inventory/${encodeURIComponent(productId)}/adjust`,
    {
      method: "POST",
      body: JSON.stringify({ deltaQuantity, reason }),
    }
  );
}

// Media Upload API
export async function uploadAdminImage(base64Data: string): Promise<{ success: boolean; url: string; filename: string }> {
  return adminFetch<{ success: boolean; url: string; filename: string }>("/api/admin/upload-image", {
    method: "POST",
    body: JSON.stringify({ base64Data }),
  });
}

// Audit Logs API
export async function getAdminAuditLogs(limit: number = 100): Promise<AuditLogEntry[]> {
  const res = await adminFetch<{ success: boolean; logs: AuditLogEntry[] }>(`/api/admin/audit-logs?limit=${limit}`);
  return res.logs;
}
