/**
 * Resilient Image URL Resolver and Fallback Utilities
 *
 * Ensures all product image paths resolve cleanly to public static paths in both
 * development (Vite dev server) and production (static builds & SSR).
 */

export const FALLBACK_PRODUCT_IMAGE = "/images/products/hero-saree.jpg";

/**
 * Resolves any raw or legacy image URL to an accessible public static route.
 */
export function resolveProductImageUrl(url?: string | null): string {
  if (!url || typeof url !== "string") {
    return FALLBACK_PRODUCT_IMAGE;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return FALLBACK_PRODUCT_IMAGE;
  }

  // Already a complete external HTTP/HTTPS URL
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  // Normalize /src/assets/ or src/assets/ to /images/products/
  if (trimmed.startsWith("/src/assets/")) {
    const filename = trimmed.replace("/src/assets/", "");
    return `/images/products/${filename}`;
  }
  if (trimmed.startsWith("src/assets/")) {
    const filename = trimmed.replace("src/assets/", "");
    return `/images/products/${filename}`;
  }

  // Normalize /assets/<image>.jpg to /images/products/<image>.jpg (excluding Vite bundles /assets/index-*)
  if (trimmed.startsWith("/assets/") && !trimmed.startsWith("/assets/index-") && !trimmed.startsWith("/assets/vendor-")) {
    const filename = trimmed.replace("/assets/", "");
    return `/images/products/${filename}`;
  }

  return trimmed;
}

/**
 * Image error handler fallback to prevent broken image placeholders
 */
export function handleProductImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  const target = e.currentTarget;
  if (target.src !== FALLBACK_PRODUCT_IMAGE && !target.src.endsWith(FALLBACK_PRODUCT_IMAGE)) {
    target.src = FALLBACK_PRODUCT_IMAGE;
  }
}
