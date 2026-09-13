export type NavItem = {
  label: string;
  id: string;
  href?: string;
  hasDropdown?: boolean;
};

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: "Home", id: "home", href: "/" },
  { label: "Sarees", id: "sarees", hasDropdown: true },
  { label: "Kurti", id: "kurti", hasDropdown: true },
  { label: "Blouses", id: "blouses", hasDropdown: true },
  { label: "Collections", id: "collections", hasDropdown: true },
  { label: "New Arrivals", id: "new-arrivals" },
  { label: "Best Selling", id: "best-selling" },
  { label: "Budget Collections", id: "budget-collections" },
  { label: "Contact", id: "contact" },
];

export type Subcategory = {
  name: string;
  slug: string;
};

export type CategoryFamily = {
  title: string;
  slug: string;
  subcategories: Subcategory[];
};

export const EXPANDED_SAREE_TAXONOMY: CategoryFamily[] = [
  {
    title: "Banarasi",
    slug: "banarasi",
    subcategories: [
      { name: "Katan Banarasi", slug: "katan-banarasi" },
      { name: "Jaal Katan Banarasi", slug: "jaal-katan-banarasi" },
      { name: "Khaddi Banarasi", slug: "khaddi-banarasi" },
      { name: "Semi Khaddi Banarasi", slug: "semi-khaddi-banarasi" },
      { name: "Pure Khaddi Georgette Banarasi", slug: "pure-khaddi-georgette-banarasi" },
      { name: "Semi Mashru Banarasi", slug: "semi-mashru-banarasi" },
      { name: "Crepe Banarasi", slug: "crepe-banarasi" },
      { name: "Kora Banarasi", slug: "kora-banarasi" },
      { name: "Shaded Kora Banarasi", slug: "shaded-kora-banarasi" },
      { name: "Brocade Banarasi", slug: "brocade-banarasi" },
      { name: "Tissue Banarasi", slug: "tissue-banarasi" },
    ],
  },
  {
    title: "Kanjivaram",
    slug: "kanjivaram",
    subcategories: [
      { name: "Pure Kanjivaram", slug: "pure-kanjivaram" },
      { name: "Brocade Kanjivaram", slug: "brocade-kanjivaram" },
      { name: "Tissue Kanjivaram", slug: "tissue-kanjivaram" },
      { name: "Silk Kanjivaram", slug: "silk-kanjivaram" },
    ],
  },
  {
    title: "Tussar",
    slug: "tussar",
    subcategories: [
      { name: "Bengal Handloom Tussar", slug: "bengal-handloom-tussar" },
      { name: "Semi Tussar", slug: "semi-tussar" },
      { name: "Pure Tussar", slug: "pure-tussar" },
      { name: "Tussar Fusion", slug: "tussar-fusion" },
      { name: "Tussar Jamdani", slug: "tussar-jamdani" },
      { name: "Tussar Tissue", slug: "tussar-tissue" },
      { name: "Tussar Hand Gujarati", slug: "tussar-hand-gujarati" },
      { name: "Tussar Hand Embroidery", slug: "tussar-hand-embroidery" },
      { name: "Tussar Kathiyawadi", slug: "tussar-kathiyawadi" },
      { name: "Tussar Zardosi", slug: "tussar-zardosi" },
      { name: "Tussar Boolean", slug: "tussar-boolean" },
      { name: "Tussar Kantha", slug: "tussar-kantha" },
      { name: "Tussar Shaded", slug: "tussar-shaded" },
    ],
  },
  {
    title: "Jamdani",
    slug: "jamdani",
    subcategories: [
      { name: "Dhakai Jamdani", slug: "dhakai-jamdani" },
      { name: "Tussar Jamdani", slug: "tussar-jamdani-saree" },
      { name: "Cotton Jamdani", slug: "cotton-jamdani" },
      { name: "Handloom Jamdani", slug: "handloom-jamdani" },
    ],
  },
  {
    title: "Organza",
    slug: "organza",
    subcategories: [
      { name: "Pure Organza", slug: "pure-organza" },
      { name: "Organza Zari Border", slug: "organza-zari-border" },
      { name: "Organza Applique", slug: "organza-applique" },
      { name: "Organza Embroidery", slug: "organza-embroidery" },
    ],
  },
  {
    title: "Chikankari",
    slug: "chikankari",
    subcategories: [
      { name: "Pure Chikankari", slug: "pure-chikankari" },
      { name: "Chikankari Silk", slug: "chikankari-silk" },
      { name: "Hand Embroidered Chikankari", slug: "hand-embroidered-chikankari" },
    ],
  },
  {
    title: "Gadwal",
    slug: "gadwal",
    subcategories: [
      { name: "Pure Gadwal", slug: "pure-gadwal" },
      { name: "Gadwal Zardosi", slug: "gadwal-zardosi" },
      { name: "Exclusive Tissue Gadwal", slug: "exclusive-tissue-gadwal" },
    ],
  },
  {
    title: "Pochampally",
    slug: "pochampally",
    subcategories: [
      { name: "Silk Pochampally", slug: "silk-pochampally" },
      { name: "Traditional Pochampally", slug: "traditional-pochampally" },
    ],
  },
  {
    title: "Bengal Collections",
    slug: "bengal-collections",
    subcategories: [
      { name: "Bengal Matka Silk", slug: "bengal-matka-silk" },
      { name: "Bengal Silk", slug: "bengal-silk" },
      { name: "Bengal Handloom", slug: "bengal-handloom" },
      { name: "Batik Silk", slug: "batik-silk" },
      { name: "Bishnupuri Silk", slug: "bishnupuri-silk" },
    ],
  },
  {
    title: "Other Saree Types",
    slug: "other-saree-types",
    subcategories: [
      { name: "Mangalgiri Silk", slug: "mangalgiri-silk" },
      { name: "Linen Fusion", slug: "linen-fusion" },
      { name: "Crepe Satin", slug: "crepe-satin" },
      { name: "Crepe Digital Print", slug: "crepe-digital-print" },
      { name: "Chiffon Print", slug: "chiffon-print" },
      { name: "Cotton", slug: "cotton-saree" },
      { name: "Cotton Ikkat", slug: "cotton-ikkat" },
      { name: "Ajrak", slug: "ajrak" },
      { name: "Gujarati Work", slug: "gujarati-work" },
      { name: "Applique Work", slug: "applique-work" },
      { name: "Resham Check", slug: "resham-check" },
      { name: "Hand Embroidery", slug: "hand-embroidery-saree" },
      { name: "Kathiyawadi", slug: "kathiyawadi-saree" },
      { name: "Satin Zardosi", slug: "satin-zardosi" },
      { name: "Exclusive Tissue", slug: "exclusive-tissue" },
      { name: "Semi Kani", slug: "semi-kani" },
      { name: "Mashru", slug: "mashru" },
      { name: "Crushed Tissue", slug: "crushed-tissue" },
      { name: "Georgette", slug: "georgette-saree" },
      { name: "Boolean", slug: "boolean" },
      { name: "Kantha", slug: "kantha" },
    ],
  },
];

export const KURTI_CATEGORIES = [
  { name: "Designer Kurtis", slug: "designer-kurtis" },
  { name: "Cotton Kurtis", slug: "cotton-kurtis" },
  { name: "Silk Kurtis", slug: "silk-kurtis" },
  { name: "Anarkali", slug: "anarkali" },
  { name: "Co-Ord Sets", slug: "co-ord-sets" },
];

export const BLOUSE_CATEGORIES = [
  { name: "Readymade Blouses", slug: "readymade-blouses" },
  { name: "Designer Blouses", slug: "designer-blouses" },
  { name: "Silk Blouses", slug: "silk-blouses" },
  { name: "Embroidered Blouses", slug: "embroidered-blouses" },
];

export const HOMEPAGE_COLLECTIONS = [
  { name: "New Items", slug: "new-items", tag: "Fresh Off the Loom" },
  { name: "Premium Elegance", slug: "premium-elegance", tag: "Luxury Couture" },
  { name: "Best Selling", slug: "best-selling", tag: "Customer Favorites" },
  { name: "Budget Collection", slug: "budget-collection", tag: "Affordable Heritage" },
  { name: "Trending", slug: "trending", tag: "Most Loved This Week" },
  { name: "Latest Arrivals", slug: "latest-arrivals", tag: "Just Added" },
];

export const FEATURED_SHOP_BY_CATEGORIES = [
  { name: "Shahi Banarasi", slug: "shahi-banarasi" },
  { name: "Kanjivaram", slug: "kanjivaram" },
  { name: "Designers", slug: "designers" },
  { name: "Tussar", slug: "tussar" },
  { name: "Zardosi", slug: "zardosi" },
  { name: "Tussar Hand Gujarati", slug: "tussar-hand-gujarati" },
  { name: "Chikankari", slug: "chikankari" },
  { name: "Crepe Banarasi", slug: "crepe-banarasi" },
  { name: "Khaddi Banarasi", slug: "khaddi-banarasi" },
  { name: "Exclusive Tissue Zardosi", slug: "exclusive-tissue-zardosi" },
];

export const TUSSAR_MERCHANDISING_BLOCK = [
  { name: "Tussar Fusion", slug: "tussar-fusion" },
  { name: "Tussar Hand Embroidery", slug: "tussar-hand-embroidery" },
  { name: "Tussar Tissue", slug: "tussar-tissue" },
  { name: "Tussar Kathiyawadi", slug: "tussar-kathiyawadi" },
  { name: "Tussar Hand Work", slug: "tussar-hand-work" },
  { name: "Tussar Shaded", slug: "tussar-shaded" },
];

export const COLLECTION_HIERARCHY = [
  { name: "New Arrivals", slug: "new-arrivals" },
  { name: "Trending", slug: "trending" },
  { name: "Best Selling", slug: "best-selling" },
  { name: "Budget Collection", slug: "budget-collection" },
  { name: "Premium Elegance", slug: "premium-elegance" },
  { name: "Designer Collection", slug: "designer-collection" },
  { name: "Shahi Banarasi", slug: "shahi-banarasi" },
  { name: "Kanjivaram", slug: "kanjivaram" },
  { name: "Khaddi Banarasi", slug: "khaddi-banarasi" },
  { name: "Tussar Collection", slug: "tussar-collection" },
  { name: "Chikankari", slug: "chikankari" },
  { name: "Zardosi", slug: "zardosi" },
  { name: "Tissue Collection", slug: "tissue-collection" },
  { name: "Crepe Banarasi", slug: "crepe-banarasi" },
  { name: "Handloom Collection", slug: "handloom-collection" },
];

// Product Filters Data
export const CATEGORY_FILTERS = [
  "Ajrak",
  "Anarkali",
  "Banarasi",
  "Batik Silk",
  "Bengal Matka Silk",
  "Bengal Silk",
  "Blouse",
  "Chiffon",
  "Chikankari",
  "Co-Ord Set",
  "Cotton",
  "Cotton Ikkat",
  "Crepe",
  "Crepe Satin",
  "Crush Tissue",
  "Crushed Tissue",
  "Gadwal",
  "Georgette",
  "Gujarati",
  "Jamdani",
  "Kani",
  "Khaddi Banarasi",
  "Kanjivaram",
  "Linen",
  "Mangalgiri",
  "Mashru",
  "Organza",
  "Pochampally",
  "Resham Check",
  "Satin Zardosi",
  "Semi Khaddi",
  "Semi Mashru",
  "Silk",
  "Tissue",
  "Tussar",
  "Zardosi",
];

export const FABRIC_FILTERS = [
  "Silk",
  "Cotton",
  "Linen",
  "Satin",
  "Viscose",
  "Polyester",
  "Synthetic",
  "Modal",
  "Mesh",
  "Nylon",
  "Other",
];

export type ColorFilter = {
  name: string;
  hex: string;
};

export const COLOR_FILTERS: ColorFilter[] = [
  { name: "Red", hex: "#dc2626" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Purple", hex: "#9333ea" },
  { name: "Yellow", hex: "#eab308" },
  { name: "White", hex: "#ffffff" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Green", hex: "#16a34a" },
  { name: "Black", hex: "#000000" },
  { name: "Grey", hex: "#6b7280" },
  { name: "Orange", hex: "#f97316" },
  { name: "Brown", hex: "#78350f" },
  { name: "Beige", hex: "#f5f5dc" },
  { name: "Gold", hex: "#d4af37" },
  { name: "Silver", hex: "#c0c0c0" },
  { name: "Rose Gold", hex: "#b76e79" },
  { name: "Peach", hex: "#ffe5b4" },
  { name: "Maroon", hex: "#800000" },
  { name: "Turquoise", hex: "#40e0d0" },
  { name: "Mustard", hex: "#ffdb58" },
  { name: "Wine", hex: "#722f37" },
  { name: "Off White", hex: "#f8f8ff" },
];

export const PRICE_TIERS = [
  { label: "Budget Collection", min: 0, max: 150 },
  { label: "Mid Range", min: 150, max: 350 },
  { label: "Premium", min: 350, max: 600 },
  { label: "Luxury", min: 600, max: 2000 },
];
