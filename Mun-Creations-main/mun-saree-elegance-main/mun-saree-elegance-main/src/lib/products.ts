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
