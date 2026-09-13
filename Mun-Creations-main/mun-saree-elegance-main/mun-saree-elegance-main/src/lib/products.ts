import heroSaree from "@/assets/hero-saree.jpg";
import catSilk from "@/assets/cat-silk.jpg";
import catBridal from "@/assets/cat-bridal.jpg";
import catPredraped from "@/assets/cat-predraped.jpg";
import catCotton from "@/assets/cat-cotton.jpg";
import productTeal from "@/assets/product-teal.jpg";
import productPink from "@/assets/product-pink.jpg";
import storyWeaver from "@/assets/story-weaver.jpg";
import accBlouse from "@/assets/acc-blouse.jpg";
import accDupatta from "@/assets/acc-dupatta.jpg";
import accJewelry from "@/assets/acc-jewelry.jpg";
import accPotli from "@/assets/acc-potli.jpg";
import tussarTribalFusion from "@/assets/tussar-tribal-fusion.jpg";
import tussarTribalFusion2 from "@/assets/tussar-tribal-fusion-2.jpg";
import tussarTribalFusion3 from "@/assets/tussar-tribal-fusion-3.jpg";
import tussarTribalFusion4 from "@/assets/tussar-tribal-fusion-4.jpg";
import tussarTribalFusion5 from "@/assets/tussar-tribal-fusion-5.jpg";
import tussarTribalFusion6 from "@/assets/tussar-tribal-fusion-6.jpg";
import kanjeevaramImperialRose1 from "@/assets/kanjeevaram-imperial-rose-1.jpg";
import kanjeevaramImperialRose2 from "@/assets/kanjeevaram-imperial-rose-2.jpg";
import kanjeevaram2gRichBorder1 from "@/assets/kanjeevaram-2g-rich-border-1.jpg";
import kanjeevaram2gRichBorder2 from "@/assets/kanjeevaram-2g-rich-border-2.jpg";
import kanjeevaram2gRichBorder3 from "@/assets/kanjeevaram-2g-rich-border-3.jpg";
import kanjeevaram2gRichBorder4 from "@/assets/kanjeevaram-2g-rich-border-4.jpg";
import paithaniGaumata1 from "@/assets/paithani-gaumata-pure-silk-1.jpg";
import paithaniGaumata2 from "@/assets/paithani-gaumata-pure-silk-2.jpg";
import paithaniGaumata3 from "@/assets/paithani-gaumata-pure-silk-3.jpg";
import paithaniGaumata4 from "@/assets/paithani-gaumata-pure-silk-4.jpg";
import bandhaniPaithaniMagenta from "@/assets/bandhani-paithani-magenta.jpg";
import bandhaniPaithaniNavy from "@/assets/bandhani-paithani-navy.jpg";
import bandhaniPaithaniSkyBlue from "@/assets/bandhani-paithani-skyblue.jpg";
import bandhaniPaithaniRed from "@/assets/bandhani-paithani-red.jpg";
import paithaniTripleMunia1 from "@/assets/paithani-triple-munia-1.jpg";
import paithaniTripleMunia2 from "@/assets/paithani-triple-munia-2.jpg";
import paithaniTripleMunia3 from "@/assets/paithani-triple-munia-3.jpg";
import paithaniTripleMunia4 from "@/assets/paithani-triple-munia-4.jpg";
import paithaniTripleMuniaRed1 from "@/assets/paithani-triple-munia-red-1.jpg";
import paithaniTripleMuniaRed2 from "@/assets/paithani-triple-munia-red-2.jpg";
import paithaniTripleMuniaRed3 from "@/assets/paithani-triple-munia-red-3.jpg";
import paithaniTripleMuniaRed4 from "@/assets/paithani-triple-munia-red-4.jpg";

export {
  heroSaree,
  catSilk,
  catBridal,
  catPredraped,
  catCotton,
  productTeal,
  productPink,
  storyWeaver,
  accBlouse,
  accDupatta,
  accJewelry,
  accPotli,
  tussarTribalFusion,
  tussarTribalFusion2,
  tussarTribalFusion3,
  tussarTribalFusion4,
  tussarTribalFusion5,
  tussarTribalFusion6,
  kanjeevaramImperialRose1,
  kanjeevaramImperialRose2,
  kanjeevaram2gRichBorder1,
  kanjeevaram2gRichBorder2,
  kanjeevaram2gRichBorder3,
  kanjeevaram2gRichBorder4,
  paithaniGaumata1,
  paithaniGaumata2,
  paithaniGaumata3,
  paithaniGaumata4,
  bandhaniPaithaniMagenta,
  bandhaniPaithaniNavy,
  bandhaniPaithaniSkyBlue,
  bandhaniPaithaniRed,
  paithaniTripleMunia1,
  paithaniTripleMunia2,
  paithaniTripleMunia3,
  paithaniTripleMunia4,
  paithaniTripleMuniaRed1,
  paithaniTripleMuniaRed2,
  paithaniTripleMuniaRed3,
  paithaniTripleMuniaRed4,
};

export type ProductFAQ = {
  question: string;
  answer: string;
};

export type Product = {
  // CANONICAL E-COMMERCE STRUCTURE
  id: string;
  sku?: string;
  name: string;
  slug?: string;
  category: string;
  subcategory?: string;
  description?: string;
  price?: number;
  compareAtPrice?: number;
  currency?: string;
  stock?: number;
  images?: string[];
  thumbnail?: string;
  fabric: string;
  color: string;
  occasion?: string[];
  tags?: string[];
  featured?: boolean;
  bestseller?: boolean;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;

  // BOUTIQUE & UI COMPATIBILITY FIELDS
  priceUsd: number;
  compareAtUsd?: number;
  stockQuantity?: number;
  inStock?: boolean;
  image: string; // Primary Image
  mainCategory?: "sarees" | "kurti" | "blouses" | "accessories";
  group?: string;
  collection?: string;
  productType?: string;
  secondaryColor?: string;
  workType?: string;
  designPattern?: string;
  weave?: string;
  borderType?: string;
  palluType?: string;
  blousePiece?: boolean;
  blouseColor?: string;
  sareeLength?: string;
  sareeWidth?: string;
  blouseLength?: string;
  weight?: string;
  transparency?: string;
  texture?: string;
  drape?: string;
  originRegion?: string;
  craftType?: string;
  handloomOrPowerloom?: "Handloom" | "Powerloom";
  availability?: "Available" | "Out of Stock" | "Pre-Order";
  priceTier?: "Budget Collection" | "Mid Range" | "Premium" | "Luxury";
  vendor?: string;
  badge?: "new" | "bestseller";
  galleryImages?: {
    front?: string;
    back?: string;
    pallu?: string;
    border?: string;
    blouse?: string;
    closeUp?: string;
    fabricDetail?: string;
    model?: string;
  };
  swatches: string[];
  shortDescription?: string;
  fullDescription?: string;
  keyFeatures?: string[];
  fabricDescription?: string;
  craftDescription?: string;
  designDescription?: string;
  occasionDescription?: string;
  stylingSuggestions?: string;
  careInstructions?: string;
  storageInstructions?: string;
  shippingInformation?: string;
  returnExchangeInfo?: string;
  faqs?: ProductFAQ[];
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
};

export function normalizeProduct(p: Partial<Product> & { id: string; name: string; category: string; fabric?: string; color?: string }): Product {
  const price = p.price ?? p.priceUsd ?? 0;
  const compareAtPrice = p.compareAtPrice ?? p.compareAtUsd;
  const stock = p.stock ?? p.stockQuantity ?? (p.inStock !== false ? 5 : 0);
  const active = p.active ?? (p.availability !== "Out of Stock" && (p.inStock ?? true));
  const thumbnail = p.thumbnail ?? p.image ?? "";
  const images = p.images && p.images.length > 0 ? p.images : (thumbnail ? [thumbnail] : []);
  const description = p.description ?? p.shortDescription ?? p.fullDescription ?? "";

  return {
    ...p,
    id: p.id,
    sku: p.sku || `MUN-${p.id.toUpperCase()}`,
    name: p.name,
    slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    category: p.category,
    subcategory: p.subcategory || p.category,
    description,
    price,
    compareAtPrice,
    currency: p.currency || "USD",
    stock,
    images,
    thumbnail,
    fabric: p.fabric || "Silk",
    color: p.color || "Multicolor",
    occasion: Array.isArray(p.occasion) ? p.occasion : (p.occasion ? [p.occasion] : []),
    tags: Array.isArray(p.tags) ? p.tags : [p.category, p.fabric].filter(Boolean) as string[],
    featured: p.featured ?? (p.badge === "bestseller" || p.priceTier === "Luxury"),
    bestseller: p.bestseller ?? (p.badge === "bestseller"),
    active,
    createdAt: p.createdAt || "2026-01-01T00:00:00Z",
    updatedAt: p.updatedAt || new Date().toISOString(),

    // UI compatibility getters
    priceUsd: price,
    compareAtUsd: compareAtPrice,
    stockQuantity: stock,
    inStock: active,
    image: thumbnail,
    swatches: p.swatches || ["#d4af37", "#800000"],
  };
}

export const PRODUCTS: Product[] = [
  // 1. MAROON KATAN BANARASI (As requested in spec)
  {
    id: "p1",
    sku: "EBS029A1",
    name: "Maroon Katan Banarasi Silk Saree With Kadwa Jaal",
    slug: "maroon-katan-banarasi-silk-saree-ebs029a1",
    category: "Banarasi",
    subcategory: "Katan Banarasi",
    mainCategory: "sarees",
    group: "Banarasi",
    collection: "Shahi Banarasi",
    productType: "Banarasi",
    fabric: "Katan",
    color: "Maroon",
    secondaryColor: "Gold & Silver",
    occasion: ["Wedding", "Bridal", "Reception", "Grand Festive"],
    workType: "Zari Work",
    designPattern: "Silver & Golden Booti",
    weave: "Kadwa Weave",
    borderType: "Heavy Zari Brocade Border",
    palluType: "Intricate Floral Zari Jaal Pallu",
    blousePiece: true,
    blouseColor: "Matching Maroon Silk",
    sareeLength: "5.5 meters",
    sareeWidth: "45 inches",
    blouseLength: "0.8 meters (Unstitched)",
    weight: "780 grams",
    transparency: "Opaque",
    texture: "Rich Smooth Silk",
    drape: "Structured Regal Drape",
    originRegion: "Varanasi, Uttar Pradesh",
    craftType: "Kadwa Handloom Weaving",
    handloomOrPowerloom: "Handloom",
    availability: "Available",
    inStock: true,
    stockQuantity: 1,
    priceUsd: 580,
    compareAtUsd: 720,
    priceTier: "Premium",
    vendor: "Ethnic Boutique",
    badge: "bestseller",
    image: heroSaree,
    galleryImages: {
      front: heroSaree,
      pallu: catBridal,
      border: heroSaree,
      closeUp: heroSaree,
      model: heroSaree,
    },
    swatches: ["#800000", "#7a2029", "#d4af37"],

    shortDescription:
      "A masterpiece of Varanasi heritage weaving in pure Katan silk, adorned with gold and silver Kadwa zari booti.",
    fullDescription:
      "Handcrafted over 45 days in the sacred looms of Varanasi, this Maroon Katan Banarasi Saree embodies royal Indian grandeur. Pure Mulberry silk threads are woven with real gold and silver zari in traditional Kadwa technique, where each motif is individually crafted without float threads.",
    keyFeatures: [
      "100% Certified Pure Katan Silk Base",
      "Authentic Hand-Woven Kadwa Zari Booti",
      "Includes Unstitched Matching Blouse Piece",
      "Silk Mark Certified Handloom Product",
    ],
    fabricDescription:
      "Katan silk is prepared by twisting two threads of pure silk together to create a durable, lustrous, and luxurious fabric that maintains its shape beautifully.",
    craftDescription:
      "Kadwa is the most laborious Varanasi weaving technique, requiring two master weavers working in unison on a traditional pit loom.",
    careInstructions:
      "Dry clean only. Do not wash at home. Iron on low heat setting under a protective cotton cloth.",
    storageInstructions:
      "Store folded in a breathable cotton or muslin bag. Air out twice a year away from direct sunlight.",
    shippingInformation:
      "Free insured delivery across India. International express shipping dispatched within 24-48 hours.",
    returnExchangeInfo:
      "All sales are final. Each piece undergoes 3-tier handloom quality inspection prior to insured dispatch.",
    faqs: [
      {
        question: "Does this saree come with Silk Mark Certification?",
        answer:
          "Yes, all our pure Katan silk sarees carry official Silk Mark Tag certifying 100% pure natural silk.",
      },
      {
        question: "Is the blouse piece attached?",
        answer:
          "Yes, a 0.8m matching unstitched Katan silk blouse piece is attached at the end of the saree.",
      },
    ],
    seoTitle: "Maroon Katan Banarasi Silk Saree — EBS029A1 | Ethnic Boutique",
    metaDescription:
      "Buy authentic Maroon Katan Banarasi Silk Saree with silver & golden zari work. Handwoven in Varanasi. Free worldwide shipping.",
  },

  // 2. RUST ORANGE BENGAL MATKA MUSLIN (As requested in spec)
  {
    id: "p2",
    sku: "EBS042B3",
    name: "Rust Orange Bengal Matka Muslin Saree",
    slug: "rust-orange-bengal-matka-muslin-saree-ebs042b3",
    category: "Matka Silk",
    subcategory: "Bengal Matka Silk",
    mainCategory: "sarees",
    group: "Bengal Collections",
    collection: "Summer Essentials",
    productType: "Bengal Matka Muslin",
    fabric: "Muslin",
    color: "Rust Orange",
    secondaryColor: "Antique Gold",
    occasion: ["Festive Wear", "Puja", "Cultural Events"],
    workType: "Thread Work",
    designPattern: "Geometric Thread Weave",
    weave: "Handloom Jamdani Weave",
    borderType: "Contrast Thread Border",
    blousePiece: true,
    blouseColor: "Contrast Rust Muslin",
    sareeLength: "5.5 meters",
    sareeWidth: "44 inches",
    blouseLength: "0.8 meters",
    weight: "420 grams",
    transparency: "Semi-Sheer Airy",
    texture: "Soft Tactile Slub",
    drape: "Lightweight Graceful Drape",
    originRegion: "Bishnupur & Murshidabad, West Bengal",
    craftType: "Bengal Handloom Spinning",
    handloomOrPowerloom: "Handloom",
    availability: "Available",
    inStock: true,
    stockQuantity: 2,
    priceUsd: 240,
    priceTier: "Mid Range",
    vendor: "Ethnic Boutique",
    badge: "new",
    image: catCotton,
    galleryImages: {
      front: catCotton,
      closeUp: catCotton,
      model: catCotton,
    },
    swatches: ["#c2410c", "#ea580c", "#d4af37"],

    shortDescription:
      "Breathable Rust Orange Bengal Muslin Saree woven with delicate thread work motifs by Bengal artisan cooperatives.",
    fullDescription:
      "Renowned for centuries as 'woven air', this Bengal Matka Muslin saree fuses the crisp texture of hand-spun Matka silk with airy Muslin threads in a captivating Rust Orange palette.",
    keyFeatures: [
      "Hand-Spun Bengal Muslin & Matka Silk Blend",
      "Ultra-Lightweight & Highly Breathable",
      "Includes Matching Unstitched Blouse Piece",
    ],
    fabricDescription:
      "Muslin is a finely-woven breathable cotton-silk fabric famed for its light weight and extraordinary softness.",
    careInstructions:
      "Dry clean recommended for first wash. Gentle hand wash in cold water with mild liquid detergent afterwards.",
    storageInstructions: "Wrap in clean white cotton cloth and store flat in a dry wardrobe.",
    shippingInformation:
      "Free shipping across India. Standard international delivery in 5-7 business days.",
    returnExchangeInfo: "Easy 7-day returns for defective products. Replacement option available.",
    faqs: [
      {
        question: "Is this saree suitable for summer festive occasions?",
        answer:
          "Absoluty! Muslin is exceptionally lightweight and breathable, making it the ideal choice for warm-weather celebrations.",
      },
    ],
  },

  // 3. EMERALD KHADDI GEORGETTE BANARASI
  {
    id: "p3",
    sku: "EBS088C4",
    name: "Emerald Khaddi Georgette Banarasi Saree",
    slug: "emerald-khaddi-georgette-banarasi-saree-ebs088c4",
    category: "Khaddi Banarasi",
    subcategory: "Pure Khaddi Georgette Banarasi",
    mainCategory: "sarees",
    group: "Banarasi",
    collection: "Khaddi Banarasi",
    productType: "Khaddi Banarasi",
    fabric: "Georgette",
    color: "Emerald Green",
    secondaryColor: "Gold Zari",
    occasion: ["Party Wear", "Sangeet", "Festival"],
    workType: "Cutwork Zari",
    designPattern: "Floral Jaal & Paisley Border",
    weave: "Banarasi Cutwork",
    borderType: "Gold Zari Temple Border",
    blousePiece: true,
    blouseColor: "Emerald Georgette",
    sareeLength: "5.5 meters",
    sareeWidth: "45 inches",
    blouseLength: "0.8 meters",
    weight: "610 grams",
    transparency: "Semi-Transparent Fluid",
    texture: "Crinkled Soft Georgette",
    drape: "Flowing Body-Hugging Drape",
    originRegion: "Varanasi, Uttar Pradesh",
    craftType: "Khaddi Handloom Weaving",
    handloomOrPowerloom: "Handloom",
    availability: "Available",
    inStock: true,
    stockQuantity: 3,
    priceUsd: 425,
    priceTier: "Premium",
    vendor: "Ethnic Boutique",
    badge: "new",
    image: catSilk,
    galleryImages: {
      front: catSilk,
      border: catSilk,
      closeUp: catSilk,
    },
    swatches: ["#16a34a", "#0d3b2a", "#d4af37"],

    shortDescription:
      "Fluid Emerald Green Georgette Banarasi Saree featuring delicate gold zari cutwork borders and bouncy fluid drape.",
    fullDescription:
      "Crafted from pure silk georgette yarns, Khaddi Banarasi sarees offer the opulent look of traditional zari brocades with a modern bouncy silhouette.",
    careInstructions: "Dry clean only. Do not wring or steam directly on zari work.",
    storageInstructions: "Store rolled on a smooth padded hanger or wrapped in saree bags.",
    shippingInformation: "Free shipping across India. Express international shipping available.",
    returnExchangeInfo: "Standard 7-day exchange window with intact tags.",
  },

  // 4. THE IMPERIAL ROSE TISSUE COLLECTION (PURE KANJEEVARAM)
  {
    id: "p4",
    sku: "HS5507",
    name: "The Imperial Rose Tissue Collection ✨",
    slug: "the-imperial-rose-tissue-collection",
    category: "Kanjeevaram",
    subcategory: "Pure Kanjeevaram Tissue Brocade",
    mainCategory: "sarees",
    group: "Kanjeevaram",
    collection: "The Imperial Rose Tissue Collection",
    productType: "Pure Kanjeevaram Tissue Silk",
    fabric: "Woven Pure Kanjeevaram Tissue Brocade Silk",
    color: "Imperial Rose / Metallic Rose Gold",
    secondaryColor: "Sage Olive Gold",
    occasion: ["Wedding", "Bridal", "Royal Festive", "Grand Reception"],
    workType: "Zardosi & Shimmering Cutdana Handwork",
    designPattern: "Delicate All-Over Embroidery Motifs & Lavish Zardosi Pallu",
    weave: "Woven Pure Kanjeevaram Tissue Brocade Silk",
    borderType: "Intricate Zardosi & Shimmering Cutdana Handwork Border",
    palluType: "Lavish Rich Zardosi Pallu",
    blousePiece: true,
    blouseColor: "Rich Matching Blouse with Borders & Buties",
    sareeLength: "5.5 meters",
    sareeWidth: "47 inches",
    blouseLength: "0.8 meters",
    weight: "720 grams",
    transparency: "Opaque Metallic Sheen",
    texture: "Soft Smooth Texture with Rich Metallic Sheen",
    drape: "Radiant Royal Flowing Drape",
    originRegion: "Kanchipuram, Tamil Nadu",
    craftType: "Kanjeevaram Tissue Handloom & Zardosi Cutdana Handwork",
    handloomOrPowerloom: "Handloom",
    availability: "Available",
    inStock: true,
    stockQuantity: 2,
    priceUsd: 200,
    compareAtUsd: 260,
    priceTier: "Luxury",
    vendor: "Mun Creations",
    badge: "bestseller",
    image: kanjeevaramImperialRose1,
    images: [kanjeevaramImperialRose1, kanjeevaramImperialRose2],
    galleryImages: {
      front: kanjeevaramImperialRose1,
      model: kanjeevaramImperialRose1,
      pallu: kanjeevaramImperialRose2,
      border: kanjeevaramImperialRose1,
      closeUp: kanjeevaramImperialRose2,
    },
    swatches: ["#b76e79", "#556b2f", "#d4af37"],

    shortDescription:
      "The Imperial Rose Tissue Collection ✨ Woven pure Kanjeevaram tissue brocade silk with intricate Zardosi and shimmering cutdana handwork.",
    fullDescription:
      "The Imperial Rose Tissue Collection ✨\n\nHandcrafted from woven pure Kanjeevaram tissue brocade silk, this drape flows with a soft, smooth texture and a rich, metallic sheen that radiates absolute royal charm.\n\nDelicate all-over embroidery motifs sprinkle across the body, grandly bordered by intricate Zardosi and shimmering cutdana handwork extending onto a lavish, rich pallu. Paired with a rich matching blouse detailed with borders and buties for a complete festive ensemble.\n\nAn absolute wedding collection masterpiece—designed to give you an unforgettable, regal glow on your special occasion.",
    careInstructions: "Dry clean only by silk specialists.",
    storageInstructions: "Store wrapped in muslin cloth to preserve metallic tissue sheen.",
    shippingInformation: "Free insured worldwide courier dispatch with Silk Mark Certification.",
    returnExchangeInfo: "Insured returns and 7-day exchange window.",
  },

  // 5. TRIBAL FUSION HANDLOOM TUSSAR SAREE (AWARD WINNING)
  {
    id: "p5",
    sku: "TFH-TUSSAR-01",
    name: "Tribal Fusion Handloom Award Winning Tussar Saree",
    slug: "tribal-fusion-handloom-award-winning-tussar-saree",
    category: "Tussar",
    subcategory: "Tussar Fusion",
    mainCategory: "sarees",
    group: "Tussar",
    collection: "Tribal Fusion Handloom",
    productType: "Tussar",
    fabric: "Tripple Twisted Pure Tussar Silk",
    color: "Reddish-Maroon",
    secondaryColor: "Blue",
    occasion: ["Grand Festive", "Award Ceremonies", "Cultural Heritage", "Weddings"],
    workType:
      "Tribal Fusion Weave (Dolabedi + Kotpad + Dongaria + Dhalapathar + Siminoi + Ganjam-Bomkai/Berhampuri + Habaspuri)",
    designPattern: "Special Tribal Fusion Handloom King-Size Double Pallu",
    weave: "Super Purified Tripple Twisted International Standard Smooth Tussar",
    borderType: "Contrast Temple Tribal Border",
    blousePiece: true,
    blouseColor: "Compulsory Contrast Blue",
    sareeLength: "5.5 meters",
    sareeWidth: "46 inches",
    blouseLength: "0.8 meters",
    weight: "580 grams",
    transparency: "Opaque",
    texture: "Super Purified Smooth Tripple Twisted Tussar Silk",
    drape: "Majestic Flowing Drape",
    originRegion: "Odisha & Bengal Handloom Weavers",
    craftType: "Tribal Fusion Handloom Double Pallu",
    handloomOrPowerloom: "Handloom",
    availability: "Available",
    inStock: true,
    stockQuantity: 1,
    priceUsd: 350,
    priceTier: "Luxury",
    vendor: "Mun Creations",
    badge: "bestseller",
    image: tussarTribalFusion,
    images: [
      tussarTribalFusion,
      tussarTribalFusion2,
      tussarTribalFusion3,
      tussarTribalFusion4,
      tussarTribalFusion5,
      tussarTribalFusion6,
    ],
    galleryImages: {
      model: tussarTribalFusion,
      pallu: tussarTribalFusion2,
      border: tussarTribalFusion3,
      fabricDetail: tussarTribalFusion4,
      closeUp: tussarTribalFusion5,
      front: tussarTribalFusion6,
    },
    swatches: ["#800020", "#0000FF"],

    shortDescription:
      "National & International Award Winning Saree: TRIBAL FUSION HANDLOOM in Reddish-Maroon & Blue with king-size double pallu & contrast blouse.",
    fullDescription:
      "TRIBAL FUSION HANDLOOM (DOLABEDI+KOTPAD+DONGARIA+DHALAPATHAR+SIMINOI+GANJAM-BOMKAI/BERHAMPURI+HABASPURI) high quality super purified Tripple twisted international standard purified+smooth TUSSUR saree with compulsory Contrast colour blouse having a special TRIBAL FUSION HANDLOOM KING-SIZE DOUBLE pallu\n\n( NATIONAL & INTERNATIONAL AWARD WINNING SAREE)\n\n(REDDISH-MARRON & BLUE COLOUR COMBINATION)",
    careInstructions: "Dry clean only by silk specialists.",
    storageInstructions: "Store wrapped in muslin cloth away from direct sunlight.",
    shippingInformation: "Free insured worldwide shipping with Silk Mark Certificate.",
    returnExchangeInfo: "Insured returns and 7-day exchange window.",
  },

  // 6. DESIGNER ANARKALI SILK KURTI
  {
    id: "k1",
    sku: "EBK001A9",
    name: "Teal Designer Anarkali Silk Kurti Set",
    slug: "teal-designer-anarkali-silk-kurti-set-ebk001a9",
    category: "Anarkali",
    subcategory: "Anarkali",
    mainCategory: "kurti",
    group: "Kurtis",
    collection: "Designer Collection",
    productType: "Anarkali Kurti",
    fabric: "Silk",
    color: "Teal Blue",
    occasion: ["Festival", "Party Wear", "Wedding Events"],
    workType: "Gota Patti & Zardosi",
    designPattern: "Flared Anarkali Flare",
    borderType: "Gota Patti Hem",
    blousePiece: false,
    originRegion: "Jaipur, Rajasthan",
    craftType: "Hand Gota Patti",
    handloomOrPowerloom: "Handloom",
    availability: "Available",
    inStock: true,
    stockQuantity: 4,
    priceUsd: 185,
    priceTier: "Mid Range",
    vendor: "Ethnic Boutique",
    badge: "new",
    image: productTeal,
    swatches: ["#40e0d0", "#d4af37"],

    shortDescription:
      "Royal Teal Silk Anarkali Kurti Set with hand-crafted Gota Patti embroidery and matching dupatta.",
    fullDescription:
      "A showstopping festive ensemble crafted in pure silk with a 4-meter flare, hand-embellished with traditional Rajasthani Gota Patti work.",
    careInstructions: "Dry clean only.",
    storageInstructions: "Hang on padded hanger.",
    shippingInformation: "Free shipping across India.",
    returnExchangeInfo: "7-day exchange window.",
  },

  // 7. READYMADE HIGH NECK RAW SILK BLOUSE
  {
    id: "b1",
    sku: "EBB010R2",
    name: "Rose Gold Zari Embroidered Silk Blouse",
    slug: "rose-gold-zari-embroidered-silk-blouse-ebb010r2",
    category: "Blouse",
    subcategory: "Embroidered Blouses",
    mainCategory: "blouses",
    group: "Blouses",
    collection: "Designer Collection",
    productType: "Designer Blouse",
    fabric: "Raw Silk",
    color: "Rose Gold",
    occasion: ["Wedding", "Partywear"],
    workType: "Zari & Sequin Embroidery",
    designPattern: "Boat Neck Floral Embroidery",
    borderType: "Embroidered Sleeve Border",
    blousePiece: false,
    originRegion: "Lucknow, Uttar Pradesh",
    craftType: "Zardozi Hand Embroidery",
    handloomOrPowerloom: "Handloom",
    availability: "Available",
    inStock: true,
    stockQuantity: 5,
    priceUsd: 145,
    priceTier: "Budget Collection",
    vendor: "Ethnic Boutique",
    badge: "bestseller",
    image: accBlouse,
    swatches: ["#b76e79", "#d4af37"],

    shortDescription:
      "Padded Rose Gold Raw Silk Blouse with intricate zardosi boat-neck embroidery and back hook closure.",
    fullDescription:
      "Designed to pair effortlessly with Banarasi and Kanjivaram sarees, this padded raw silk blouse features delicate hand zardosi work.",
    careInstructions: "Dry clean only.",
    storageInstructions: "Store flat in dry wardrobe.",
    shippingInformation: "Dispatched within 24 hours.",
    returnExchangeInfo: "7-day sizing exchange allowed.",
  },

  // 8. HERITAGE BANARASI SILK DUPATTA
  {
    id: "a1",
    sku: "EBA001D1",
    name: "Pure Katan Silk Banarasi Zari Dupatta",
    slug: "pure-katan-silk-banarasi-zari-dupatta-eba001d1",
    category: "Dupatta",
    subcategory: "Banarasi Dupatta",
    mainCategory: "accessories",
    group: "Accessories",
    collection: "Shahi Banarasi",
    productType: "Silk Dupatta",
    fabric: "Katan Silk",
    color: "Royal Crimson Red",
    occasion: ["Wedding", "Festive", "Reception"],
    workType: "Kadwa Zari Work",
    designPattern: "Floral Jaal & Paisley Border",
    borderType: "Brocade Border",
    blousePiece: false,
    originRegion: "Varanasi, Uttar Pradesh",
    craftType: "Kadwa Handloom",
    handloomOrPowerloom: "Handloom",
    availability: "Available",
    inStock: true,
    stockQuantity: 6,
    priceUsd: 120,
    priceTier: "Budget Collection",
    vendor: "Mun Creations",
    badge: "bestseller",
    image: accDupatta,
    swatches: ["#990000", "#d4af37"],
    shortDescription:
      "Opulent pure Katan silk Banarasi dupatta woven with golden Kadwa zari jaal motifs.",
    fullDescription:
      "Elevate any kurta or lehenga ensemble with this authentic 2.5m pure Katan silk Banarasi dupatta handwoven by Varanasi master artisans.",
    careInstructions: "Dry clean only.",
    shippingInformation: "Dispatched within 24 hours.",
    returnExchangeInfo: "7-day exchange window.",
  },

  // 9. ARTISAN ZARDOSI SILK POTLI BAG
  {
    id: "a2",
    sku: "EBA002P2",
    name: "Handcrafted Zardosi Raw Silk Potli Bag",
    slug: "handcrafted-zardosi-raw-silk-potli-bag-eba002p2",
    category: "Potli Bag",
    subcategory: "Embroidered Potli",
    mainCategory: "accessories",
    group: "Accessories",
    collection: "Designer Collection",
    productType: "Potli Bag",
    fabric: "Raw Silk",
    color: "Antique Gold",
    occasion: ["Wedding", "Festive", "Sangeet"],
    workType: "Zardozi & Pearl Tassels",
    designPattern: "Hand-Embroidered Motifs",
    blousePiece: false,
    originRegion: "Jaipur, Rajasthan",
    craftType: "Hand Embroidery",
    handloomOrPowerloom: "Handloom",
    availability: "Available",
    inStock: true,
    stockQuantity: 8,
    priceUsd: 65,
    priceTier: "Budget Collection",
    vendor: "Mun Creations",
    badge: "new",
    image: accPotli,
    swatches: ["#d4af37", "#800000"],
    shortDescription:
      "Exquisite raw silk potli bag featuring intricate zardozi floral hand embroidery and pearl tassels.",
    fullDescription:
      "A luxurious festive companion tailored in pure raw silk with drawstring closure and heirloom pearl and bead tassels.",
    careInstructions: "Spot clean only.",
    shippingInformation: "Dispatched within 24 hours.",
    returnExchangeInfo: "7-day exchange window.",
  },

  // 10. 2G PURE KANJIVARAM SILK SAREE (Silk Mark Certified)
  {
    id: "p10",
    sku: "MC-KANJI-2G-01",
    name: "2G Pure Kanjivaram Rich Border Silk Saree with Rich Pallu",
    slug: "2g-pure-kanjivaram-rich-border-pallu-saree",
    category: "Kanjivaram",
    subcategory: "Pure Kanjivaram",
    mainCategory: "sarees",
    group: "Kanjivaram",
    collection: "Kanjivaram Heritage",
    productType: "Kanjivaram",
    fabric: "Pure Silk",
    color: "Rust Orange",
    secondaryColor: "Gold & Magenta Pink",
    occasion: ["Wedding", "Bridal", "Reception", "Grand Festive"],
    workType: "2G Pure Zari Weave & Korvai Temple Border",
    designPattern: "Rich Korvai Border with Gleaming Gold Tissue Pallu",
    weave: "Authentic Korvai Handloom Weave",
    borderType: "Rich Korvai Temple Zari Border with Magenta Pink Selvedge",
    palluType: "Heavy Rich 2G Gold Tissue Zari Brocade Pallu",
    blousePiece: true,
    blouseColor: "Matching Rust Orange Silk with Zari Border",
    sareeLength: "5.5 meters",
    sareeWidth: "46 inches",
    blouseLength: "0.8 meters (Unstitched)",
    weight: "820 grams",
    transparency: "Opaque",
    texture: "Heavy Lustrous Pure Silk with Metallic Sheen",
    drape: "Regal Structured Drape",
    originRegion: "Kanchipuram, Tamil Nadu",
    craftType: "Traditional Korvai Handloom Weaving",
    handloomOrPowerloom: "Handloom",
    availability: "Available",
    inStock: true,
    stockQuantity: 2,
    priceUsd: 318,
    compareAtUsd: 395,
    priceTier: "Premium",
    vendor: "Mun Creations",
    badge: "new",
    image: kanjeevaram2gRichBorder1,
    images: [
      kanjeevaram2gRichBorder1,
      kanjeevaram2gRichBorder2,
      kanjeevaram2gRichBorder3,
      kanjeevaram2gRichBorder4,
    ],
    galleryImages: {
      front: kanjeevaram2gRichBorder1,
      pallu: kanjeevaram2gRichBorder3,
      border: kanjeevaram2gRichBorder2,
      closeUp: kanjeevaram2gRichBorder4,
      model: kanjeevaram2gRichBorder1,
    },
    swatches: ["#d9531e", "#d4af37", "#c2185b"],
    shortDescription:
      "🦚 2G Pure Kanjivaram silk saree featuring rich temple korvai borders, heavy tissue gold zari pallu, and matching blouse piece. Silk Mark Certified.",
    fullDescription:
      "An heirloom masterpiece handwoven in the legendary temple town of Kanchipuram. This authentic 2G Pure Kanjivaram saree boasts a breathtaking dual-tone rust orange body juxtaposed with a rich magenta pink temple Korvai border and a grand, heavy gold tissue zari pallu. Accompanied by an unstitched pure silk blouse piece with matching rich borders. Silk Mark Certified for 100% pure natural mulberry silk and authentic zari.",
    keyFeatures: [
      "100% Pure Kanjivaram Mulberry Silk (Silk Mark Certified)",
      "2G Pure Gold Tissue Zari Pallu with Intricate Brocade",
      "Authentic Traditional Temple Korvai Contrast Border",
      "Free Shipping Within India (26,500 INR)",
      "Includes Matching Unstitched Pure Silk Blouse Piece",
    ],
    fabricDescription:
      "Woven from high-denier Mulberry silk yarns twisted in the traditional 2G ply method, providing exceptional durability, body, and an unmistakable metallic glow that drapes royally.",
    craftDescription:
      "Korvai is the ancient art of interlocking the border and body threads using three shuttles operated by two master weavers, creating a seamless, contrast border with traditional spired temple motifs.",
    careInstructions:
      "Dry clean only. Do not wash or machine spin. Iron on low heat on the reverse side under a protective muslin cloth.",
    storageInstructions:
      "Wrap in unbleached pure cotton or muslin fabric. Change folds periodically to preserve zari luster.",
    shippingInformation:
      "Free Shipping within India (26,500 INR). Dispatched within 24 hours via insured express air courier.",
    returnExchangeInfo: "7-day authentication and exchange guarantee.",
  },

  // 11. GAUMATA PAITHANI (Pure Silk by Silk Work, Silk Mark Certified)
  {
    id: "p11",
    sku: "MC-PAITH-GAU-01",
    name: "Gaumata Paithani Pure Silk Handwoven Saree",
    slug: "gaumata-paithani-pure-silk-handwoven-saree",
    category: "Paithani",
    subcategory: "Pure Silk Paithani",
    mainCategory: "sarees",
    group: "Paithani",
    collection: "Royal Paithani",
    productType: "Paithani",
    fabric: "Pure Silk",
    color: "Cream / Off-White",
    secondaryColor: "Yellow, Emerald Green & Magenta Pink",
    occasion: ["Pooja", "Auspicious Occasion", "Wedding", "Festive", "Reception"],
    workType: "100% Handwoven Tapestry Weave with Gaumata Pallu & Munia Border",
    designPattern: "Auspicious Gaumata with Sacred Trees & Lotus Pallu, General Round Butti Body",
    weave: "100% Handweaving Pure Silk By Silk Work",
    borderType: "Single Munia Border",
    palluType: "Auspicious Gaumata Pallu with Sacred Trees & Blooming Lotus",
    blousePiece: true,
    blouseColor: "Matching Cream Pure Silk with Single Munia Border",
    sareeLength: "5.5 meters",
    sareeWidth: "46 inches",
    blouseLength: "0.8 meters (Unstitched)",
    weight: "790 grams",
    transparency: "Opaque",
    texture: "Soft, Lustrous Pure Silk Handloom Weave",
    drape: "Regal Fluid Drape",
    originRegion: "Yeola / Paithan, Maharashtra",
    craftType: "Traditional Handloom Paithani Tapestry Weave",
    handloomOrPowerloom: "Handloom",
    availability: "Available",
    inStock: true,
    stockQuantity: 2,
    priceUsd: 341.32,
    compareAtUsd: 420,
    priceTier: "Premium",
    vendor: "Mun Creations",
    badge: "new",
    image: paithaniGaumata1,
    images: [
      paithaniGaumata1,
      paithaniGaumata2,
      paithaniGaumata3,
      paithaniGaumata4,
    ],
    galleryImages: {
      front: paithaniGaumata1,
      pallu: paithaniGaumata2,
      border: paithaniGaumata3,
      closeUp: paithaniGaumata4,
      model: paithaniGaumata1,
    },
    swatches: ["#fbf8f0", "#ffd700", "#1b5e20"],
    shortDescription:
      "⛱️ GAUMATA PAITHANI: 100% Handwoven pure silk saree with Single Munia border, auspicious Gaumata pallu, and delicate round butti. Silk Mark Certified.",
    fullDescription:
      "A sacred and regal heirloom masterpiece, this Gaumata Paithani saree is handwoven in 100% pure silk-by-silk craftsmanship. Featuring an auspicious Gaumata (Kamadhenu) pallu adorned with sacred kalpavriksha trees and sacred lotus blooms, complemented by the iconic Single Munia (parrot) border and classic round butti motifs across a pristine cream silk body. Note: Colour may slightly differ due to phone camera & lighting. Silk Mark Certified.",
    keyFeatures: [
      "100% Handweaving with Pure Silk By Silk Work",
      "Auspicious Gaumata (Sacred Cow) Pallu with Tree & Lotus Motifs",
      "Iconic Single Munia Border",
      "Delicate General Round Butti Weave",
      "Silk Mark Certified for 100% Pure Natural Silk",
      "Pricing: 28,500/- INR (Free Shipping Within India Included)",
      "Includes Matching Unstitched Pure Silk Blouse Piece",
    ],
    fabricDescription:
      "Pure Silk By Silk Work: Woven with 100% pure natural mulberry silk in both warp and weft, giving the fabric a soft, natural handfeel, opulent sheen, and long-lasting heirloom quality.",
    craftDescription:
      "100% Handwoven Paithani technique utilizing traditional interlocking tapestry weft methods where each sacred Gaumata motif, Munia border, and round butti is meticulously crafted by master weavers.",
    careInstructions:
      "Dry clean only. Do not machine wash. Iron on low heat on the reverse side under a protective cloth. Note: Colour may slightly differ due to camera & lights.",
    storageInstructions:
      "Wrap in a breathable soft cotton or muslin cloth. Periodically air and change folds to maintain silk fibers and weave luster.",
    shippingInformation:
      "Pricing: 28,500/- INR. Free Shipping within India included. Dispatched within 24 hours via insured express courier.",
    returnExchangeInfo: "7-day authentication and exchange guarantee.",
  },

  // 12. BANDHANI PAITHANI (Pure Silk & Jari Work, Silk Mark Certified)
  {
    id: "p12",
    sku: "MC-PAITH-BAN-01",
    name: "Bandhani Paithani Pure Silk Saree with Designer Parrot Pallu",
    slug: "bandhani-paithani-pure-silk-saree-with-designer-parrot-pallu",
    category: "Paithani",
    subcategory: "Bandhani Paithani",
    mainCategory: "sarees",
    group: "Paithani",
    collection: "Royal Paithani",
    productType: "Paithani",
    fabric: "Pure Silk",
    color: "Royal Magenta",
    secondaryColor: "Antique Gold Zari, Navy, Sky Blue & Red Variants",
    occasion: ["Wedding", "Bridal", "Reception", "Grand Festive", "Pooja"],
    workType: "Single Munia Brocade Border, Designer Parrot Pallu & All Over Bandhej Work",
    designPattern:
      "All Over Bandhej Work with Designer Three-Parrot Gold Tissue Pallu & Munia Brocade Border",
    weave: "100% Handweaving Pure Silk & Jari Work",
    borderType: "Single Munia Brocade Border",
    palluType: "Designer Parrot Pallu on Pure Gold Tissue Ground",
    blousePiece: true,
    blouseColor: "Matching Pure Silk with Single Munia Brocade Border",
    sareeLength: "5.5 meters",
    sareeWidth: "46 inches",
    blouseLength: "0.8 meters (Unstitched)",
    weight: "840 grams",
    transparency: "Opaque",
    texture: "Rich Hand-Knotted Silk with Crinkle Texture & Metallic Jari Sheen",
    drape: "Grand Structured Drape",
    originRegion: "Yeola / Paithan (Weave) & Gujarat / Rajasthan (Bandhej), India",
    craftType: "100% Handweaving Pure Silk & Jari with Hand Bandhej Work",
    handloomOrPowerloom: "Handloom",
    availability: "Available",
    inStock: true,
    stockQuantity: 4,
    priceUsd: 526.83,
    compareAtUsd: 640,
    priceTier: "Luxury",
    vendor: "Mun Creations",
    badge: "bestseller",
    image: bandhaniPaithaniMagenta,
    images: [
      bandhaniPaithaniMagenta,
      bandhaniPaithaniNavy,
      bandhaniPaithaniSkyBlue,
      bandhaniPaithaniRed,
    ],
    galleryImages: {
      front: bandhaniPaithaniMagenta,
      pallu: bandhaniPaithaniNavy,
      border: bandhaniPaithaniSkyBlue,
      closeUp: bandhaniPaithaniRed,
      model: bandhaniPaithaniMagenta,
    },
    swatches: ["#7a1863", "#0d2b6b", "#1488c8", "#b80f28"],
    shortDescription:
      "BANDHANI PAITHANI: Pure Silk & Jari Work handwoven saree featuring Single Munia Brocade border, exquisite Designer Parrot Pallu, and all-over Bandhej work. Silk Mark Certified. Price : Rs.43990/- (Including Roll Press & Shipping within India).",
    fullDescription:
      "An heirloom masterpiece uniting the majesty of royal Maharashtra Paithani weaving with the celebrated artistry of handcrafted Indian Bandhej. Woven from 100% pure silk and rich jari work, this saree features delicate all-over hand-knotted bandhej dots, the iconic Single Munia brocade border, and an exquisite Designer Parrot Pallu depicting polychromatic parrots perching upon blooming branches on pure gold tissue. Price : Rs.43990/- (Including Roll Press & Shipping within India). Silk Mark Certified. Note: Colour may slightly differ due to phone camera & lighting.",
    keyFeatures: [
      "100% Handweaving Pure Silk & Jari Work",
      "Single Munia Brocade Border",
      "Designer Parrot Pallu Woven on Radiant Gold Tissue",
      "All Over Bandhej Work Hand-Knotted Micro Dots",
      "Silk Mark Certified for 100% Pure Natural Silk & Authentic Jari",
      "Price : Rs.43,990/- (Including Roll Press & Shipping within India)",
      "Available in 4 Regal Colorways: Royal Magenta, Deep Navy, Sky Blue, and Crimson Red",
      "Includes Matching Unstitched Pure Silk Blouse Piece",
    ],
    fabricDescription:
      "Crafted with high-grade pure mulberry silk threads interlaced with authentic metallic jari. The body undergoes authentic artisan hand-tying and resist-dyeing before fine finishing and roll pressing.",
    craftDescription:
      "An extraordinary masterpiece uniting two GI-heritage crafts: pure Paithani handloom weaving (featuring tapestry weft parrot and munia motifs) fused with master Bandhej knotting.",
    careInstructions:
      "Dry clean only. Complimentary professional roll press included. Note: Colour may slightly differ due to phone camera & lights.",
    storageInstructions:
      "Store wrapped in pure unbleached cotton or muslin. Roll or refold periodically along fresh fold lines.",
    shippingInformation:
      "Price : Rs.43990/- (Including Roll Press & Shipping within India). Dispatched within 24-48 hours via insured express air courier.",
    returnExchangeInfo: "7-day authentication and exchange guarantee.",
  },

  // 13. TRIPLE MUNIA PAITHANI (Pure Silk & Jari Work, Silk Mark Certified)
  {
    id: "p13",
    sku: "MC-PAITH-TMU-01",
    name: "Triple Munia Paithani Pure Silk Saree with Designer Parrot Pallu",
    slug: "triple-munia-paithani-pure-silk-saree-with-designer-parrot-pallu",
    category: "Paithani",
    subcategory: "Triple Munia Paithani",
    mainCategory: "sarees",
    group: "Paithani",
    collection: "Royal Paithani",
    productType: "Paithani",
    fabric: "Pure Silk",
    color: "Rani Pink",
    secondaryColor: "Gold Zari, Green & Multi-Color Parrots",
    occasion: ["Wedding", "Bridal", "Reception", "Grand Festive", "Pooja"],
    workType: "Triple Munia Brocade Border, Designer Parrot Pallu & General Butti",
    designPattern:
      "Delicate All-Over Gold Zari Butti with Triple Munia Brocade Border & Designer Three-Parrot Pallu",
    weave: "100% Handweaving Pure Silk & Jari Work",
    borderType: "Triple Munia (Three-Tier Parrot) Brocade Border with Spired Temple Selvedge",
    palluType: "Designer Parrot Pallu on Heavy Gold Tissue Zari Ground",
    blousePiece: true,
    blouseColor: "Matching Rani Pink Pure Silk with Triple Munia Brocade Border",
    sareeLength: "5.5 meters",
    sareeWidth: "46 inches",
    blouseLength: "0.8 meters (Unstitched)",
    weight: "820 grams",
    transparency: "Opaque",
    texture: "Lustrous Smooth Pure Silk with Heavy Metallic Zari Weft",
    drape: "Regal Structured Drape",
    originRegion: "Yeola / Paithan, Maharashtra",
    craftType: "100% Handweaving Pure Silk & Jari Work",
    handloomOrPowerloom: "Handloom",
    availability: "Available",
    inStock: true,
    stockQuantity: 3,
    priceUsd: 425.15,
    compareAtUsd: 520,
    priceTier: "Luxury",
    vendor: "Mun Creations",
    badge: "new",
    image: paithaniTripleMunia3,
    images: [
      paithaniTripleMunia3,
      paithaniTripleMunia1,
      paithaniTripleMunia2,
      paithaniTripleMunia4,
    ],
    galleryImages: {
      front: paithaniTripleMunia3,
      pallu: paithaniTripleMunia1,
      border: paithaniTripleMunia2,
      closeUp: paithaniTripleMunia4,
      model: paithaniTripleMunia3,
    },
    swatches: ["#e0007b", "#d4af37", "#2e7d32"],
    shortDescription:
      "TRIPLE MUNIA PAITHANI: Triple Munia Brocade Border, Designer Parrot Pallu, Pure Silk & Jari Work, 100% Handweaving, General Butti. Silk Mark Certified. Price: 35500/- INR.",
    fullDescription:
      "A coveted royal heirloom handwoven in Maharashtra's historic weaving cluster. This exquisite Triple Munia Paithani saree in vivid Rani Pink features the prestigious triple-tier Munia brocade border, delicate gold zari general buttis evenly scattered across the body, and the grand Designer Parrot Pallu woven with multicolored parrots on blossoming boughs upon pure gold tissue zari. 100% Handweaving Pure Silk & Jari Work. Note: Colour may Slightly Differ, Due to Phone Camera & Lights. Silk Mark Certified. Price: 35500/- INR.",
    keyFeatures: [
      "Triple Munia Brocade Border (Three-Tier Traditional Parrot Motifs)",
      "Designer Parrot Pallu on Radiant Pure Gold Tissue Ground",
      "Pure Silk & Jari Work with 100% Handweaving",
      "General Delicate Gold Zari Butti across Saree Body",
      "Silk Mark Certified for 100% Pure Natural Mulberry Silk",
      "Price: 35,500/- INR (Free Shipping Within India Included)",
      "Includes Matching Unstitched Pure Silk Blouse Piece with Triple Munia Border",
    ],
    fabricDescription:
      "Pure Silk & Jari Work: Woven with high-twist pure mulberry silk warp and weft intermeshed with pure gold-toned zari for an opulent, fluid drape that withstands generations.",
    craftDescription:
      "The prestigious Triple Munia border requires mastery of the interlocking tapestry weave technique, meticulously detailing three parallel rows of Munia motifs with fine temple spikes.",
    careInstructions:
      "Dry clean only. Roll press recommended. Do not machine wash or expose to direct harsh moisture. Note: Colour may slightly differ due to phone camera & lights.",
    storageInstructions:
      "Store wrapped inside a soft cotton or muslin cloth. Refold periodically to safeguard silk fibers and metallic zari weave.",
    shippingInformation:
      "Price: 35500/- INR. Free Shipping within India included. Dispatched within 24 hours via insured express air courier.",
    returnExchangeInfo: "7-day authentication and exchange guarantee.",
  },

  // 14. CRIMSON RED TRIPLE MUNIA PAITHANI (Pure Silk & Jari Work, Silk Mark Certified)
  {
    id: "p14",
    sku: "MC-PAITH-TMU-02",
    name: "Crimson Red Triple Munia Paithani Pure Silk Saree",
    slug: "crimson-red-triple-munia-paithani-pure-silk-saree",
    category: "Paithani",
    subcategory: "Triple Munia Paithani",
    mainCategory: "sarees",
    group: "Paithani",
    collection: "Royal Paithani",
    productType: "Paithani",
    fabric: "Pure Silk",
    color: "Crimson Red",
    secondaryColor: "Rich Gold Zari, Emerald Green & Multi-Color Parrots",
    occasion: ["Wedding", "Bridal", "Reception", "Grand Festive", "Pooja"],
    workType: "Triple Munia Brocade Border, Designer Parrot Pallu & General Butti",
    designPattern:
      "Delicate Gold Zari General Butti with Triple Munia Brocade Border & Designer Three-Parrot Pallu",
    weave: "100% Handweaving Pure Silk & Jari Work",
    borderType: "Triple Munia (Three-Tier Parrot) Brocade Border with Spired Temple Selvedge",
    palluType: "Designer Parrot Pallu on Heavy Gold Tissue Zari Ground",
    blousePiece: true,
    blouseColor: "Matching Crimson Red Pure Silk with Triple Munia Brocade Border",
    sareeLength: "5.5 meters",
    sareeWidth: "46 inches",
    blouseLength: "0.8 meters (Unstitched)",
    weight: "820 grams",
    transparency: "Opaque",
    texture: "Lustrous Smooth Pure Silk with Heavy Metallic Zari Weft",
    drape: "Regal Structured Drape",
    originRegion: "Yeola / Paithan, Maharashtra",
    craftType: "100% Handweaving Pure Silk & Jari Work",
    handloomOrPowerloom: "Handloom",
    availability: "Available",
    inStock: true,
    stockQuantity: 3,
    priceUsd: 425.15,
    compareAtUsd: 520,
    priceTier: "Luxury",
    vendor: "Mun Creations",
    badge: "new",
    image: paithaniTripleMuniaRed1,
    images: [
      paithaniTripleMuniaRed1,
      paithaniTripleMuniaRed2,
      paithaniTripleMuniaRed3,
      paithaniTripleMuniaRed4,
    ],
    galleryImages: {
      front: paithaniTripleMuniaRed1,
      pallu: paithaniTripleMuniaRed2,
      border: paithaniTripleMuniaRed3,
      closeUp: paithaniTripleMuniaRed4,
      model: paithaniTripleMuniaRed1,
    },
    swatches: ["#d50000", "#d4af37", "#2e7d32"],
    shortDescription:
      "⛱️ TRIPLE MUNIA PAITHANI ⛱️: Triple Munia Brocade Border, Designer Parrot Pallu, Pure Silk & Jari Work, 100% Handweaving, General Butti. Silk Mark Certified. Price: 35500 INR.",
    fullDescription:
      "A regal bridal heirloom masterpiece handwoven in Maharashtra's historic weaving cluster. This magnificent Triple Munia Paithani saree in auspicious Crimson Red features the prestigious three-tier Munia brocade border, delicate gold zari general buttis evenly scattered across the body, and the grand Designer Parrot Pallu woven with multicolored parrots on blossoming boughs upon pure gold tissue zari. 100% Handweaving Pure Silk & Jari Work. Note: Colour may Slightly Differ, Due to Phone Camera & Lights. Silk Mark Certified. Price: 35500 INR.",
    keyFeatures: [
      "Triple Munia Brocade Border (Three-Tier Traditional Parrot Motifs)",
      "Designer Parrot Pallu on Radiant Pure Gold Tissue Ground",
      "Pure Silk & Jari Work with 100% Handweaving",
      "General Delicate Gold Zari Butti across Crimson Red Saree Body",
      "Silk Mark Certified for 100% Pure Natural Mulberry Silk",
      "Price: 35,500 INR (Free Shipping Within India Included)",
      "Includes Matching Unstitched Pure Silk Blouse Piece with Triple Munia Border",
    ],
    fabricDescription:
      "Pure Silk & Jari Work: Woven with high-twist pure mulberry silk warp and weft intermeshed with pure gold-toned zari for an opulent, fluid drape that withstands generations.",
    craftDescription:
      "The prestigious Triple Munia border requires mastery of the interlocking tapestry weave technique, meticulously detailing three parallel rows of Munia motifs with fine temple spikes.",
    careInstructions:
      "Dry clean only. Roll press recommended. Do not machine wash or expose to direct harsh moisture. Note: Colour may slightly differ due to phone camera & lights.",
    storageInstructions:
      "Store wrapped inside a soft cotton or muslin cloth. Refold periodically to safeguard silk fibers and metallic zari weave.",
    shippingInformation:
      "Price: 35500 INR. Free Shipping within India included. Dispatched within 24 hours via insured express air courier.",
    returnExchangeInfo: "7-day authentication and exchange guarantee.",
  },
];

export const NEW_ARRIVALS = PRODUCTS.filter((p) => p.badge === "new")
  .concat(PRODUCTS)
  .slice(0, 6);
export const BESTSELLERS = PRODUCTS.filter((p) => p.badge === "bestseller")
  .concat(PRODUCTS)
  .slice(0, 6);
export const BRIDAL = PRODUCTS.filter(
  (p) => p.occasion?.includes("Wedding") || p.subcategory?.includes("Bridal"),
);
export const ACCESSORIES = PRODUCTS.filter((p) => p.mainCategory === "accessories");
