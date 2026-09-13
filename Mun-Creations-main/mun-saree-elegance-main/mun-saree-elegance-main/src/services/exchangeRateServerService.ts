// Server-Side Service for ExchangeRate-API Integration
// Securely processes currency conversion and rates without exposing the API key to the client

export interface ConvertRequest {
  from: string;
  to: string;
  amount: number;
}

export interface ConvertResponse {
  success: true;
  from: string;
  to: string;
  amount: number;
  rate: number;
  convertedAmount: number;
  lastUpdated: string;
  isCached?: boolean;
}

export interface RatesResponse {
  success: true;
  base: string;
  rates: Record<string, number>;
  lastUpdated: string;
  isCached?: boolean;
}

export interface SupportedCode {
  code: string;
  name: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_RATES_MS = 15 * 60 * 1000; // 15 Minutes
const CACHE_TTL_CODES_MS = 60 * 60 * 1000; // 1 Hour

class ExchangeRateServerService {
  private ratesCache = new Map<
    string,
    CacheEntry<{ rates: Record<string, number>; lastUpdated: string }>
  >();
  private pairCache = new Map<string, CacheEntry<{ rate: number; lastUpdated: string }>>();
  private codesCache: CacheEntry<SupportedCode[]> | null = null;

  private getApiKey(): string {
    const key = process.env.EXCHANGE_RATE_API_KEY || "";
    if (!key || !key.trim()) {
      throw new Error("Exchange rate service is currently unavailable (API key not configured).");
    }
    return key.trim();
  }

  private sanitizeCode(code: unknown): string {
    if (typeof code !== "string" || !code.trim()) {
      throw new Error("Currency code must be a valid 3-letter ISO string.");
    }
    const clean = code.trim().toUpperCase();
    if (!/^[A-Z]{3}$/.test(clean)) {
      throw new Error(
        `Invalid currency code "${clean}". Must be a standard 3-letter ISO 4217 code.`,
      );
    }
    return clean;
  }

  private sanitizeAmount(amount: unknown): number {
    if (amount === undefined || amount === null || amount === "") {
      throw new Error("Amount is required.");
    }
    const num = Number(amount);
    if (isNaN(num)) {
      throw new Error("Amount must be a valid numeric value.");
    }
    if (num <= 0) {
      throw new Error("Amount must be greater than zero.");
    }
    if (!isFinite(num)) {
      throw new Error("Amount is outside of allowed range.");
    }
    return num;
  }

  /**
   * Converts an amount from one currency to another using live rates
   */
  async convert({ from, to, amount }: ConvertRequest): Promise<ConvertResponse> {
    const sourceCurrency = this.sanitizeCode(from);
    const targetCurrency = this.sanitizeCode(to);
    const validAmount = this.sanitizeAmount(amount);

    if (sourceCurrency === targetCurrency) {
      return {
        success: true,
        from: sourceCurrency,
        to: targetCurrency,
        amount: validAmount,
        rate: 1,
        convertedAmount: validAmount,
        lastUpdated: new Date().toISOString(),
      };
    }

    const pairKey = `${sourceCurrency}_${targetCurrency}`;
    const cached = this.pairCache.get(pairKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_TTL_RATES_MS) {
      const converted = Number((validAmount * cached.data.rate).toFixed(4));
      return {
        success: true,
        from: sourceCurrency,
        to: targetCurrency,
        amount: validAmount,
        rate: cached.data.rate,
        convertedAmount: converted,
        lastUpdated: cached.data.lastUpdated,
        isCached: true,
      };
    }

    const apiKey = this.getApiKey();
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${sourceCurrency}/${targetCurrency}`;

    let res: Response;
    try {
      res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    } catch (err: any) {
      // If we have an older cached value, we can gracefully return it with isCached = true
      if (cached) {
        const converted = Number((validAmount * cached.data.rate).toFixed(4));
        return {
          success: true,
          from: sourceCurrency,
          to: targetCurrency,
          amount: validAmount,
          rate: cached.data.rate,
          convertedAmount: converted,
          lastUpdated: cached.data.lastUpdated,
          isCached: true,
        };
      }
      throw new Error("Unable to connect to live exchange rate provider. Please try again.");
    }

    const data = await res.json().catch(() => null);

    if (!res.ok || !data || data.result !== "success") {
      const errorType = data?.["error-type"] || "";
      if (errorType === "unsupported-code") {
        throw new Error(`Unsupported currency code (${sourceCurrency} or ${targetCurrency}).`);
      }
      if (errorType === "invalid-key") {
        throw new Error("Exchange rate service authentication error.");
      }
      if (errorType === "quota-reached") {
        throw new Error("Exchange rate query limit reached. Please try again shortly.");
      }
      throw new Error(data?.error || "Failed to retrieve exchange rate from provider.");
    }

    const rate = Number(data.conversion_rate);
    const lastUpdated = data.time_last_update_utc || new Date().toISOString();
    const convertedAmount = Number((validAmount * rate).toFixed(4));

    // Save to cache
    this.pairCache.set(pairKey, {
      data: { rate, lastUpdated },
      timestamp: now,
    });

    // Also cache the inverse pair with calculated reciprocal if not already present
    const inverseKey = `${targetCurrency}_${sourceCurrency}`;
    if (rate > 0) {
      this.pairCache.set(inverseKey, {
        data: { rate: Number((1 / rate).toFixed(6)), lastUpdated },
        timestamp: now,
      });
    }

    return {
      success: true,
      from: sourceCurrency,
      to: targetCurrency,
      amount: validAmount,
      rate,
      convertedAmount,
      lastUpdated,
    };
  }

  /**
   * Retrieves all latest conversion rates against a base currency
   */
  async getRates(base = "USD"): Promise<RatesResponse> {
    const baseCode = this.sanitizeCode(base);
    const now = Date.now();
    const cached = this.ratesCache.get(baseCode);

    if (cached && now - cached.timestamp < CACHE_TTL_RATES_MS) {
      return {
        success: true,
        base: baseCode,
        rates: cached.data.rates,
        lastUpdated: cached.data.lastUpdated,
        isCached: true,
      };
    }

    const apiKey = this.getApiKey();
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCode}`;

    let res: Response;
    try {
      res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    } catch {
      if (cached) {
        return {
          success: true,
          base: baseCode,
          rates: cached.data.rates,
          lastUpdated: cached.data.lastUpdated,
          isCached: true,
        };
      }
      throw new Error("Unable to retrieve live exchange rates at this time.");
    }

    const data = await res.json().catch(() => null);

    if (!res.ok || !data || data.result !== "success" || !data.conversion_rates) {
      throw new Error(data?.error || "Failed to retrieve live rates from exchange provider.");
    }

    const rates = data.conversion_rates;
    const lastUpdated = data.time_last_update_utc || new Date().toISOString();

    this.ratesCache.set(baseCode, {
      data: { rates, lastUpdated },
      timestamp: now,
    });

    return {
      success: true,
      base: baseCode,
      rates,
      lastUpdated,
    };
  }

  /**
   * Retrieves the full list of supported currencies from ExchangeRate-API
   */
  async getSupportedCurrencies(): Promise<SupportedCode[]> {
    const now = Date.now();
    if (this.codesCache && now - this.codesCache.timestamp < CACHE_TTL_CODES_MS) {
      return this.codesCache.data;
    }

    try {
      const apiKey = this.getApiKey();
      const url = `https://v6.exchangerate-api.com/v6/${apiKey}/codes`;
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });

      if (res.ok) {
        const data = await res.json();
        if (data.result === "success" && Array.isArray(data.supported_codes)) {
          const list: SupportedCode[] = data.supported_codes.map(
            ([code, name]: [string, string]) => ({
              code,
              name,
            }),
          );
          this.codesCache = { data: list, timestamp: now };
          return list;
        }
      }
    } catch {
      // Fallback
    }

    if (this.codesCache) return this.codesCache.data;

    // Standard fallback list
    return [
      { code: "USD", name: "United States Dollar" },
      { code: "INR", name: "Indian Rupee" },
      { code: "EUR", name: "Euro" },
      { code: "GBP", name: "British Pound" },
      { code: "AED", name: "UAE Dirham" },
      { code: "CAD", name: "Canadian Dollar" },
      { code: "AUD", name: "Australian Dollar" },
      { code: "NZD", name: "New Zealand Dollar" },
      { code: "SGD", name: "Singapore Dollar" },
      { code: "CHF", name: "Swiss Franc" },
      { code: "JPY", name: "Japanese Yen" },
      { code: "CNY", name: "Chinese Yuan" },
      { code: "SAR", name: "Saudi Riyal" },
      { code: "QAR", name: "Qatari Riyal" },
      { code: "KWD", name: "Kuwaiti Dinar" },
      { code: "ZAR", name: "South African Rand" },
      { code: "BDT", name: "Bangladeshi Taka" },
      { code: "LKR", name: "Sri Lankan Rupee" },
    ];
  }
}

export const exchangeRateServerService = new ExchangeRateServerService();
