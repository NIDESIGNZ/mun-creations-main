// Centralized Currency & Exchange Rate Service for Mun Saree Elegance

export interface CurrencyInfo {
  code: string;
  symbol: string;
  label: string;
  country: string;
  decimalPlaces: number;
}

export interface CachedRatesData {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
}

// 1. Supported Currencies Definition
export const SUPPORTED_CURRENCIES: Record<string, CurrencyInfo> = {
  INR: { code: "INR", symbol: "₹", label: "Indian Rupee", country: "India", decimalPlaces: 0 },
  USD: { code: "USD", symbol: "$", label: "US Dollar", country: "United States", decimalPlaces: 2 },
  GBP: {
    code: "GBP",
    symbol: "£",
    label: "British Pound",
    country: "United Kingdom",
    decimalPlaces: 2,
  },
  EUR: { code: "EUR", symbol: "€", label: "Euro", country: "European Union", decimalPlaces: 2 },
  AED: {
    code: "AED",
    symbol: "د.إ",
    label: "UAE Dirham",
    country: "United Arab Emirates",
    decimalPlaces: 2,
  },
  CAD: { code: "CAD", symbol: "C$", label: "Canadian Dollar", country: "Canada", decimalPlaces: 2 },
  AUD: {
    code: "AUD",
    symbol: "A$",
    label: "Australian Dollar",
    country: "Australia",
    decimalPlaces: 2,
  },
  NZD: {
    code: "NZD",
    symbol: "NZ$",
    label: "New Zealand Dollar",
    country: "New Zealand",
    decimalPlaces: 2,
  },
  SGD: {
    code: "SGD",
    symbol: "S$",
    label: "Singapore Dollar",
    country: "Singapore",
    decimalPlaces: 2,
  },
  CHF: {
    code: "CHF",
    symbol: "CHF",
    label: "Swiss Franc",
    country: "Switzerland",
    decimalPlaces: 2,
  },
  JPY: { code: "JPY", symbol: "¥", label: "Japanese Yen", country: "Japan", decimalPlaces: 0 },
  CNY: { code: "CNY", symbol: "¥", label: "Chinese Yuan", country: "China", decimalPlaces: 2 },
  SAR: {
    code: "SAR",
    symbol: "﷼",
    label: "Saudi Riyal",
    country: "Saudi Arabia",
    decimalPlaces: 2,
  },
  QAR: { code: "QAR", symbol: "﷼", label: "Qatari Riyal", country: "Qatar", decimalPlaces: 2 },
  KWD: { code: "KWD", symbol: "KWD", label: "Kuwaiti Dinar", country: "Kuwait", decimalPlaces: 3 },
  ZAR: {
    code: "ZAR",
    symbol: "R",
    label: "South African Rand",
    country: "South Africa",
    decimalPlaces: 2,
  },
  BDT: {
    code: "BDT",
    symbol: "৳",
    label: "Bangladeshi Taka",
    country: "Bangladesh",
    decimalPlaces: 2,
  },
  LKR: {
    code: "LKR",
    symbol: "Rs",
    label: "Sri Lankan Rupee",
    country: "Sri Lanka",
    decimalPlaces: 2,
  },
};

export type CurrencyCode = keyof typeof SUPPORTED_CURRENCIES;

// 2. Country to Currency Mapping
export const COUNTRY_TO_CURRENCY_MAP: Record<string, CurrencyCode> = {
  IN: "INR",
  India: "INR",
  US: "USD",
  "United States": "USD",
  USA: "USD",
  GB: "GBP",
  "United Kingdom": "GBP",
  UK: "GBP",
  GreatBritain: "GBP",
  AE: "AED",
  "United Arab Emirates": "AED",
  UAE: "AED",
  Dubai: "AED",
  CA: "CAD",
  Canada: "CAD",
  AU: "AUD",
  Australia: "AUD",
  NZ: "NZD",
  "New Zealand": "NZD",
  SG: "SGD",
  Singapore: "SGD",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  IE: "EUR",
  PT: "EUR",
  AT: "EUR",
  BE: "EUR",
  FI: "EUR",
  GR: "EUR",
  Germany: "EUR",
  France: "EUR",
  Italy: "EUR",
  Spain: "EUR",
  Netherlands: "EUR",
  Ireland: "EUR",
  Portugal: "EUR",
  CH: "CHF",
  Switzerland: "CHF",
  JP: "JPY",
  Japan: "JPY",
  CN: "CNY",
  China: "CNY",
  SA: "SAR",
  "Saudi Arabia": "SAR",
  KSA: "SAR",
  QA: "QAR",
  Qatar: "QAR",
  KW: "KWD",
  Kuwait: "KWD",
  ZA: "ZAR",
  "South Africa": "ZAR",
  BD: "BDT",
  Bangladesh: "BDT",
  LK: "LKR",
  "Sri Lanka": "LKR",
};

// 3. Fallback Exchange Rates (Base: USD)
export const DEFAULT_FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  INR: 83.5,
  GBP: 0.79,
  EUR: 0.92,
  AED: 3.67,
  CAD: 1.37,
  AUD: 1.52,
  NZD: 1.67,
  SGD: 1.27,
  CHF: 0.88,
  JPY: 155.0,
  CNY: 7.23,
  SAR: 3.75,
  QAR: 3.64,
  KWD: 0.31,
  ZAR: 18.5,
  BDT: 117.5,
  LKR: 300.0,
};

const CACHE_KEY = "mc_rates_cache_v2";
const CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4 Hours Cache Duration

export interface LiveConversionResult {
  success: boolean;
  from: string;
  to: string;
  amount: number;
  rate: number;
  convertedAmount: number;
  lastUpdated: string;
  isCached?: boolean;
  error?: string;
}

// 4. Fetch & Cache Exchange Rates from internal server endpoint (No client API key exposed)
export async function getExchangeRates(): Promise<Record<string, number>> {
  // Check LocalStorage Cache
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const cachedRaw = localStorage.getItem(CACHE_KEY);
      if (cachedRaw) {
        const cached: CachedRatesData = JSON.parse(cachedRaw);
        const age = Date.now() - cached.timestamp;
        if (age < CACHE_TTL_MS && cached.rates && Object.keys(cached.rates).length > 0) {
          return { ...DEFAULT_FALLBACK_RATES, ...cached.rates };
        }
      }
    } catch {
      // Ignore cache read errors
    }
  }

  // Fetch Live Rates from internal server-side currency API
  try {
    const res = await fetch("/api/currency?action=rates&base=USD", {
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.rates) {
        const mergedRates = { ...DEFAULT_FALLBACK_RATES, ...data.rates };
        if (typeof window !== "undefined" && window.localStorage) {
          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({
                base: "USD",
                rates: mergedRates,
                timestamp: Date.now(),
              }),
            );
          } catch {
            // Ignore cache write error
          }
        }
        return mergedRates;
      }
    }
  } catch (err) {
    console.warn("Server currency rates fetch failed, using cached/fallback rates:", err);
  }

  // Fallback if network/API fails
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const cachedRaw = localStorage.getItem(CACHE_KEY);
      if (cachedRaw) {
        const cached: CachedRatesData = JSON.parse(cachedRaw);
        if (cached.rates) return { ...DEFAULT_FALLBACK_RATES, ...cached.rates };
      }
    } catch {
      // Ignore
    }
  }

  return DEFAULT_FALLBACK_RATES;
}

// 4b. Direct Live Currency Converter via Server Endpoint
export async function convertLiveCurrency(
  from: string,
  to: string,
  amount: number,
): Promise<LiveConversionResult> {
  const cleanFrom = from.trim().toUpperCase();
  const cleanTo = to.trim().toUpperCase();
  const numAmount = Number(amount);

  if (cleanFrom === cleanTo) {
    return {
      success: true,
      from: cleanFrom,
      to: cleanTo,
      amount: numAmount,
      rate: 1,
      convertedAmount: numAmount,
      lastUpdated: new Date().toISOString(),
    };
  }

  try {
    const res = await fetch("/api/currency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: cleanFrom, to: cleanTo, amount: numAmount }),
      signal: AbortSignal.timeout(8000),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return {
        success: true,
        from: data.from,
        to: data.to,
        amount: data.amount,
        rate: data.rate,
        convertedAmount: data.convertedAmount,
        lastUpdated: data.lastUpdated,
        isCached: data.isCached,
      };
    }

    return {
      success: false,
      from: cleanFrom,
      to: cleanTo,
      amount: numAmount,
      rate: 0,
      convertedAmount: 0,
      lastUpdated: new Date().toISOString(),
      error: data?.error || "Failed to convert currency. Please check inputs and try again.",
    };
  } catch (err: any) {
    return {
      success: false,
      from: cleanFrom,
      to: cleanTo,
      amount: numAmount,
      rate: 0,
      convertedAmount: 0,
      lastUpdated: new Date().toISOString(),
      error: err?.message || "Network error while contacting currency service.",
    };
  }
}

// 5. Automatic Country & Currency Detection
export function detectUserCurrency(): CurrencyCode {
  // 1. Saved Preference
  if (typeof window !== "undefined" && window.localStorage) {
    const saved = localStorage.getItem("mc_cur");
    if (saved && saved in SUPPORTED_CURRENCIES) {
      return saved as CurrencyCode;
    }
  }

  // 2. Browser Locale Country Match
  if (typeof navigator !== "undefined" && navigator.language) {
    const parts = navigator.language.split("-");
    if (parts.length > 1) {
      const region = parts[1].toUpperCase();
      if (COUNTRY_TO_CURRENCY_MAP[region]) {
        return COUNTRY_TO_CURRENCY_MAP[region];
      }
    }
  }

  // 3. Website Default Currency (INR for Indian Saree Store, fallback USD)
  return "INR";
}

// Async IP Geolocation Detection (Non-blocking background helper)
export async function detectCountryFromIP(): Promise<CurrencyCode | null> {
  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.country_code && COUNTRY_TO_CURRENCY_MAP[data.country_code]) {
        return COUNTRY_TO_CURRENCY_MAP[data.country_code];
      }
    }
  } catch {
    // Fail silently
  }
  return null;
}

// 6. Price Conversion & Formatting Engine
export function convertPrice(
  amount: number,
  targetCurrency: CurrencyCode,
  rates: Record<string, number>,
  sourceCurrency?: "INR" | "USD",
): number {
  const effectiveRates = rates && Object.keys(rates).length > 0 ? rates : DEFAULT_FALLBACK_RATES;
  const inrToUsdRate = effectiveRates.INR || DEFAULT_FALLBACK_RATES.INR || 83.5;
  const targetRate = effectiveRates[targetCurrency] || DEFAULT_FALLBACK_RATES[targetCurrency] || 1;

  // Determine source currency if not explicitly passed:
  // Luxury handwoven sarees in INR are typically >= 1000 (e.g. ₹18,500, ₹32,000).
  // Legacy USD prices are < 1000 (e.g. $280, $350).
  const isSourceInr = sourceCurrency === "INR" || (sourceCurrency === undefined && amount >= 1000);

  let rawConverted: number;
  if (isSourceInr) {
    if (targetCurrency === "INR") {
      rawConverted = amount;
    } else {
      const amountUsd = amount / inrToUsdRate;
      rawConverted = amountUsd * targetRate;
    }
  } else {
    // Source is USD
    if (targetCurrency === "USD") {
      rawConverted = amount;
    } else {
      rawConverted = amount * targetRate;
    }
  }

  const info = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.INR;
  if (info.decimalPlaces === 0) {
    return Math.round(rawConverted);
  }
  return Math.round(rawConverted * 100) / 100;
}

export type PriceInput = number | { priceInr?: number; basePriceINR?: number; priceUsd?: number; price?: number };

export function formatCurrency(
  input: PriceInput,
  targetCurrency: CurrencyCode,
  rates: Record<string, number>,
  sourceCurrency?: "INR" | "USD",
): string {
  const info = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.INR;
  
  let numericAmount = 0;
  let detectedSource: "INR" | "USD" = sourceCurrency || "INR";

  if (typeof input === "object" && input !== null) {
    if (typeof input.priceInr === "number" && input.priceInr > 0) {
      numericAmount = input.priceInr;
      detectedSource = "INR";
    } else if (typeof input.basePriceINR === "number" && input.basePriceINR > 0) {
      numericAmount = input.basePriceINR;
      detectedSource = "INR";
    } else if (typeof input.priceUsd === "number" && input.priceUsd > 0) {
      numericAmount = input.priceUsd;
      detectedSource = "USD";
    } else if (typeof input.price === "number") {
      numericAmount = input.price;
      detectedSource = numericAmount >= 1000 ? "INR" : "USD";
    }
  } else {
    numericAmount = Number(input) || 0;
    detectedSource = sourceCurrency || (numericAmount >= 1000 ? "INR" : "USD");
  }

  const converted = convertPrice(numericAmount, targetCurrency, rates, detectedSource);

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: targetCurrency,
      minimumFractionDigits: info.decimalPlaces,
      maximumFractionDigits: info.decimalPlaces,
    }).format(converted);
  } catch {
    // Fallback manual formatting
    const formattedNum = converted.toLocaleString(undefined, {
      minimumFractionDigits: info.decimalPlaces,
      maximumFractionDigits: info.decimalPlaces,
    });
    return `${info.symbol} ${formattedNum}`;
  }
}

