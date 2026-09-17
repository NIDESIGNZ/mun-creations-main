import fs from "fs";
import path from "path";

export type {
  HomepageCategoryItem,
  HomepageContent,
  AboutContent,
  CategoryPageItem,
  CategoriesContent,
  ShippingContent,
  ReturnsContent,
  ContactContent,
  FAQItem,
  PrivacyContent,
  TermsContent,
  FooterContent,
  SEOContent,
  SiteContent,
} from "../content-defaults";

export { DEFAULT_SITE_CONTENT } from "../content-defaults";
import { DEFAULT_SITE_CONTENT, SiteContent } from "../content-defaults";

/**
 * Robust string sanitizer to eliminate script tags, javascript: URIs, onerror, onload, iframe, etc.
 */
export function sanitizeString(val: string): string {
  if (typeof val !== "string") return "";
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/\bon\w+\s*=/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    .replace(/<object\b[^>]*>/gi, "")
    .trim();
}

export function sanitizeDeep<T>(obj: T): T {
  if (typeof obj === "string") {
    return sanitizeString(obj) as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeDeep(item)) as unknown as T;
  }
  if (obj !== null && typeof obj === "object") {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      cleaned[key] = sanitizeDeep(value);
    }
    return cleaned as T;
  }
  return obj;
}

class ContentDatabaseService {
  private dataDir: string = "";
  private contentFile: string = "";
  private content: SiteContent = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
  private initialized: boolean = false;

  constructor() {
    this.initStorage();
  }

  private isServerEnvironment(): boolean {
    return (
      typeof window === "undefined" &&
      typeof process !== "undefined" &&
      Boolean(process?.versions?.node) &&
      Boolean(fs?.existsSync)
    );
  }

  private initStorage() {
    if (this.initialized) return;

    if (!this.isServerEnvironment()) {
      this.initialized = true;
      return;
    }

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
        const testFile = path.join(cand, ".test_write_content");
        fs.writeFileSync(testFile, "ok");
        fs.unlinkSync(testFile);
        this.dataDir = cand;
        break;
      } catch {
        // Continue searching
      }
    }

    if (!this.dataDir) {
      this.dataDir = "/tmp/mun_creations_data";
      try {
        fs.mkdirSync(this.dataDir, { recursive: true });
      } catch {}
    }

    this.contentFile = path.join(this.dataDir, "site_content.json");

    try {
      if (fs.existsSync(this.contentFile)) {
        const raw = fs.readFileSync(this.contentFile, "utf-8");
        const parsed = JSON.parse(raw);
        // Merge deep with defaults so missing keys don't break
        this.content = {
          ...DEFAULT_SITE_CONTENT,
          ...parsed,
          homepage: { ...DEFAULT_SITE_CONTENT.homepage, ...(parsed.homepage || {}) },
          about: { ...DEFAULT_SITE_CONTENT.about, ...(parsed.about || {}) },
          categories: { ...DEFAULT_SITE_CONTENT.categories, ...(parsed.categories || {}) },
          shipping: { ...DEFAULT_SITE_CONTENT.shipping, ...(parsed.shipping || {}) },
          returns: { ...DEFAULT_SITE_CONTENT.returns, ...(parsed.returns || {}) },
          contact: { ...DEFAULT_SITE_CONTENT.contact, ...(parsed.contact || {}) },
          faqs: Array.isArray(parsed.faqs) && parsed.faqs.length > 0 ? parsed.faqs : DEFAULT_SITE_CONTENT.faqs,
          privacy: { ...DEFAULT_SITE_CONTENT.privacy, ...(parsed.privacy || {}) },
          terms: { ...DEFAULT_SITE_CONTENT.terms, ...(parsed.terms || {}) },
          footer: { ...DEFAULT_SITE_CONTENT.footer, ...(parsed.footer || {}) },
          seo: { ...DEFAULT_SITE_CONTENT.seo, ...(parsed.seo || {}) },
        };
      } else {
        // Save initial default content to file
        this.saveToDisk();
      }
    } catch (err) {
      console.warn("[ContentDatabase] Failed to read site_content.json, using defaults", err);
      this.content = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
    }

    this.initialized = true;
  }

  public getContent(): SiteContent {
    this.initStorage();
    return JSON.parse(JSON.stringify(this.content));
  }

  public getSection<K extends keyof SiteContent>(key: K): SiteContent[K] {
    this.initStorage();
    return JSON.parse(JSON.stringify(this.content[key] || DEFAULT_SITE_CONTENT[key]));
  }

  public updateSection<K extends keyof SiteContent>(key: K, data: any, user?: string): SiteContent[K] {
    this.initStorage();
    const sanitizedData = sanitizeDeep(data);

    if (Array.isArray(this.content[key])) {
      this.content[key] = sanitizedData;
    } else if (typeof this.content[key] === "object" && this.content[key] !== null) {
      this.content[key] = {
        ...this.content[key],
        ...sanitizedData,
      };
    } else {
      this.content[key] = sanitizedData;
    }

    this.saveToDisk();
    return JSON.parse(JSON.stringify(this.content[key]));
  }

  public resetToDefault(user?: string): SiteContent {
    this.initStorage();
    this.content = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
    this.saveToDisk();
    return JSON.parse(JSON.stringify(this.content));
  }

  private saveToDisk() {
    if (!this.isServerEnvironment() || !this.contentFile) return;
    try {
      fs.writeFileSync(this.contentFile, JSON.stringify(this.content, null, 2), "utf-8");
    } catch (err) {
      console.error("[ContentDatabase] Failed to save site_content.json:", err);
    }
  }
}

export const contentDatabase = new ContentDatabaseService();
