/**
 * Mun Creations — Centralized Price Tier & Range Configuration
 *
 * All pricing logic is anchored in canonical INR (Indian Rupee) base prices.
 */

export interface PriceTierConfig {
  id: string;
  label: string;
  shortLabel: string;
  minInr: number;
  maxInr: number;
  description: string;
}

/**
 * Authoritative Mun Creations catalog price tiers (anchored in INR)
 * LOW: < ₹20,000
 * MID: ₹20,000 to ₹45,000
 * HIGH: >= ₹45,000
 */
export const CATALOG_PRICE_TIERS: PriceTierConfig[] = [
  {
    id: "low",
    label: "Budget Collection (Under ₹20,000)",
    shortLabel: "Under ₹20K",
    minInr: 0,
    maxInr: 20000,
    description: "Accessible handloom weaves & daily festive drapes",
  },
  {
    id: "mid",
    label: "Mid Range (₹20,000 – ₹45,000)",
    shortLabel: "₹20K – ₹45K",
    minInr: 20000,
    maxInr: 45000,
    description: "Pure silk Banarasi, Kanjivaram & Paithani classics",
  },
  {
    id: "high",
    label: "Premium & Luxury (Above ₹45,000)",
    shortLabel: "Above ₹45K",
    minInr: 45000,
    maxInr: 500000,
    description: "Heirloom bridal ensembles, pure zari & couture handlooms",
  },
];

/**
 * Returns the canonical INR base price for any product
 */
export function getProductBasePriceInr(product: {
  priceInr?: number;
  basePriceINR?: number;
  price?: number;
  priceUsd?: number;
}): number {
  if (typeof product.priceInr === "number" && product.priceInr > 0) {
    return product.priceInr;
  }
  if (typeof product.basePriceINR === "number" && product.basePriceINR > 0) {
    return product.basePriceINR;
  }
  // If only USD is available, compute equivalent at canonical reference rate ~83.5
  if (typeof product.priceUsd === "number" && product.priceUsd > 0) {
    return Math.round(product.priceUsd * 83.5);
  }
  if (typeof product.price === "number" && product.price > 0) {
    // If price is small (<1500), it's stored in USD, otherwise INR
    return product.price < 1500 ? Math.round(product.price * 83.5) : product.price;
  }
  return 25000; // default fallback
}

/**
 * Evaluates whether a product falls within a specified price tier label or ID
 */
export function matchesPriceTier(
  product: { priceInr?: number; basePriceINR?: number; price?: number; priceUsd?: number },
  tierIdentifier?: string | null,
): boolean {
  if (!tierIdentifier) return true;

  const clean = tierIdentifier.toLowerCase().trim();
  const priceInr = getProductBasePriceInr(product);

  // Check 'low' / 'budget'
  if (
    clean === "low" ||
    clean.includes("budget") ||
    clean.includes("under 20") ||
    clean.includes("under $150")
  ) {
    return priceInr < 20000;
  }

  // Check 'mid'
  if (
    clean === "mid" ||
    clean.includes("mid range") ||
    clean.includes("20,000") ||
    clean.includes("150 - 350")
  ) {
    return priceInr >= 20000 && priceInr < 45000;
  }

  // Check 'high' / 'luxury' / 'premium'
  if (
    clean === "high" ||
    clean.includes("luxury") ||
    clean.includes("premium") ||
    clean.includes("above") ||
    clean.includes("350 - 600") ||
    clean.includes("600 - 2000")
  ) {
    return priceInr >= 45000;
  }

  return true;
}

/**
 * Filter product by min/max INR range
 */
export function matchesPriceRange(
  product: { priceInr?: number; basePriceINR?: number; price?: number; priceUsd?: number },
  minInr?: number,
  maxInr?: number,
): boolean {
  const priceInr = getProductBasePriceInr(product);
  if (typeof minInr === "number" && priceInr < minInr) return false;
  if (typeof maxInr === "number" && maxInr > 0 && priceInr > maxInr) return false;
  return true;
}
