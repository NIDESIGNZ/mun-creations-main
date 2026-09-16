import { useQuery } from "@tanstack/react-query";
import type { Product } from "./products";

export interface CatalogFilterParams {
  category?: string;
  subcategory?: string;
  fabric?: string;
  color?: string;
  colors?: string[] | string;
  tier?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
}

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  orderIndex: number;
  active: boolean;
  subcategories: string[];
}

/**
 * Fetch products from backend API
 */
export async function fetchCatalogProducts(params?: CatalogFilterParams): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.subcategory) query.set("subcategory", params.subcategory);
  if (params?.fabric) query.set("fabric", params.fabric);
  if (params?.color) query.set("color", params.color);
  if (params?.colors) {
    const colStr = Array.isArray(params.colors) ? params.colors.join(",") : params.colors;
    query.set("colors", colStr);
  }
  if (params?.tier) query.set("tier", params.tier);
  if (params?.minPrice !== undefined) query.set("minPrice", String(params.minPrice));
  if (params?.maxPrice !== undefined) query.set("maxPrice", String(params.maxPrice));
  if (params?.search) query.set("search", params.search);
  if (params?.sort) query.set("sort", params.sort);

  const url = `/api/products${query.toString() ? `?${query.toString()}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load catalog products: ${res.statusText}`);
  }
  return await res.json();
}

/**
 * Fetch a single product by ID or Slug
 */
export async function fetchCatalogProduct(idOrSlug: string): Promise<Product> {
  const isSlug = idOrSlug.includes("-") || isNaN(Number(idOrSlug.replace(/^p_?/, "")));
  const url = isSlug ? `/api/products/slug/${encodeURIComponent(idOrSlug)}` : `/api/products/${encodeURIComponent(idOrSlug)}`;
  const res = await fetch(url);
  if (!res.ok) {
    // Try fallback lookup by ID if slug attempt returned 404
    const fallbackRes = await fetch(`/api/products/${encodeURIComponent(idOrSlug)}`);
    if (fallbackRes.ok) {
      return await fallbackRes.json();
    }
    throw new Error(`Product "${idOrSlug}" not found.`);
  }
  return await res.json();
}

/**
 * Fetch categories from backend API
 */
export async function fetchCatalogCategories(): Promise<CatalogCategory[]> {
  const res = await fetch("/api/categories");
  if (!res.ok) {
    throw new Error(`Failed to load categories: ${res.statusText}`);
  }
  return await res.json();
}

/**
 * Hook for storefront products list
 */
export function useCatalogProducts(params?: CatalogFilterParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchCatalogProducts(params),
    staleTime: 1000 * 5, // 5 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

/**
 * Hook for single product detail
 */
export function useCatalogProduct(idOrSlug: string) {
  return useQuery({
    queryKey: ["product", idOrSlug],
    queryFn: () => fetchCatalogProduct(idOrSlug),
    staleTime: 1000 * 5, // 5 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

/**
 * Hook for categories
 */
export function useCatalogCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCatalogCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Cache Invalidator: Forces immediate refetch of catalog queries across storefront
 */
export function invalidateCatalogCache(queryClient: any) {
  if (!queryClient) return;
  queryClient.invalidateQueries({ queryKey: ["products"] });
  queryClient.invalidateQueries({ queryKey: ["product"] });
  queryClient.invalidateQueries({ queryKey: ["categories"] });
}
