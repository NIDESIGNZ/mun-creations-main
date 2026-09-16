/**
 * Mun Creations — Controlled Color Taxonomy & Normalization Engine
 * 
 * Provides a canonical taxonomy of 21 colors, alias resolution,
 * multi-color combination parsing, and structured matching logic.
 */

export interface CanonicalColor {
  name: string;
  hex: string;
  display: string;
  contrastText?: "dark" | "light";
}

/**
 * 21 Canonical Storefront Colors as specified in Mun Creations taxonomy
 */
export const CANONICAL_COLORS: CanonicalColor[] = [
  { name: "Red", hex: "#DC2626", display: "Red", contrastText: "light" },
  { name: "Pink", hex: "#EC4899", display: "Pink", contrastText: "light" },
  { name: "Purple", hex: "#9333EA", display: "Purple", contrastText: "light" },
  { name: "Yellow", hex: "#EAB308", display: "Yellow", contrastText: "dark" },
  { name: "White", hex: "#FFFFFF", display: "White", contrastText: "dark" },
  { name: "Blue", hex: "#2563EB", display: "Blue", contrastText: "light" },
  { name: "Green", hex: "#16A34A", display: "Green", contrastText: "light" },
  { name: "Black", hex: "#0F172A", display: "Black", contrastText: "light" },
  { name: "Grey", hex: "#6B7280", display: "Grey", contrastText: "light" },
  { name: "Orange", hex: "#F97316", display: "Orange", contrastText: "light" },
  { name: "Brown", hex: "#78350F", display: "Brown", contrastText: "light" },
  { name: "Beige", hex: "#F5F5DC", display: "Beige", contrastText: "dark" },
  { name: "Gold", hex: "#D4AF37", display: "Gold", contrastText: "dark" },
  { name: "Silver", hex: "#C0C0C0", display: "Silver", contrastText: "dark" },
  { name: "Rose Gold", hex: "#B76E79", display: "Rose", contrastText: "light" },
  { name: "Peach", hex: "#FFE5B4", display: "Peach", contrastText: "dark" },
  { name: "Maroon", hex: "#800000", display: "Maroon", contrastText: "light" },
  { name: "Turquoise", hex: "#40E0D0", display: "Turquoise", contrastText: "dark" },
  { name: "Mustard", hex: "#FFDB58", display: "Mustard", contrastText: "dark" },
  { name: "Wine", hex: "#722F37", display: "Wine", contrastText: "light" },
  { name: "Off-White", hex: "#FAF7F2", display: "Off-White", contrastText: "dark" },
];

export const CANONICAL_COLOR_NAMES = CANONICAL_COLORS.map((c) => c.name);

/**
 * Controlled alias map mapping descriptive shade variants to canonical color taxonomy.
 * Note: Maroon, Wine, and Red are kept distinct.
 */
const COLOR_ALIAS_MAP: Record<string, string> = {
  // Red
  red: "Red",
  crimson: "Red",
  scarlet: "Red",
  ruby: "Red",
  cherry: "Red",
  vermilion: "Red",
  sindoor: "Red",

  // Pink
  pink: "Pink",
  "rani pink": "Pink",
  rani: "Pink",
  magenta: "Pink",
  "royal magenta": "Pink",
  "rose pink": "Pink",
  "pastel rose": "Pink",
  "pastel rose pink": "Pink",
  fuchsia: "Pink",
  blush: "Pink",
  "baby pink": "Pink",

  // Purple
  purple: "Purple",
  violet: "Purple",
  lavender: "Purple",
  mauve: "Purple",
  lilac: "Purple",
  plum: "Purple",

  // Yellow
  yellow: "Yellow",
  lemon: "Yellow",
  canary: "Yellow",
  "bright yellow": "Yellow",

  // White
  white: "White",
  "pure white": "White",
  chalk: "White",

  // Blue
  blue: "Blue",
  navy: "Blue",
  "navy blue": "Blue",
  "royal blue": "Blue",
  "peacock blue": "Blue",
  "peacock royal blue": "Blue",
  "sky blue": "Blue",
  skyblue: "Blue",
  cyan: "Blue",
  indigo: "Blue",
  sapphire: "Blue",

  // Green
  green: "Green",
  emerald: "Green",
  "bottle green": "Green",
  "forest green": "Green",
  olive: "Green",
  "sage olive": "Green",
  sage: "Green",
  mint: "Green",
  teal: "Green",
  "seafoam green": "Green",
  moss: "Green",

  // Black
  black: "Black",
  jet: "Black",
  charcoal: "Black",

  // Grey
  grey: "Grey",
  gray: "Grey",
  slate: "Grey",
  ash: "Grey",
  silvergrey: "Grey",

  // Orange
  orange: "Orange",
  rust: "Orange",
  "rust orange": "Orange",
  tangerine: "Orange",
  apricot: "Orange",
  copper: "Orange",
  saffron: "Orange",

  // Brown
  brown: "Brown",
  chocolate: "Brown",
  coffee: "Brown",
  tan: "Brown",
  terracotta: "Brown",

  // Beige
  beige: "Beige",
  sand: "Beige",
  khaki: "Beige",
  nude: "Beige",
  wheat: "Beige",

  // Gold
  gold: "Gold",
  golden: "Gold",
  "antique gold": "Gold",
  zari: "Gold",
  "gold zari": "Gold",
  "metallic gold": "Gold",

  // Silver
  silver: "Silver",
  "antique silver": "Silver",
  "silver zari": "Silver",
  metallic: "Silver",

  // Rose Gold
  rose: "Rose Gold",
  "rose gold": "Rose Gold",
  "imperial rose": "Rose Gold",
  "metallic rose gold": "Rose Gold",

  // Peach
  peach: "Peach",
  coral: "Peach",
  salmon: "Peach",

  // Maroon
  maroon: "Maroon",
  "reddish-maroon": "Maroon",
  "reddish maroon": "Maroon",
  deepmaroon: "Maroon",

  // Turquoise
  turquoise: "Turquoise",
  aqua: "Turquoise",
  seafoam: "Turquoise",
  "seafoam sky blue": "Turquoise",

  // Mustard
  mustard: "Mustard",
  "mustard yellow": "Mustard",
  ochre: "Mustard",
  haldi: "Mustard",

  // Wine
  wine: "Wine",
  burgundy: "Wine",
  bordeaux: "Wine",
  maroongrape: "Wine",
  "wine red": "Wine",

  // Off-White
  "off-white": "Off-White",
  "off white": "Off-White",
  offwhite: "Off-White",
  cream: "Off-White",
  ivory: "Off-White",
  ecru: "Off-White",
  natural: "Off-White",
};

/**
 * Normalizes an arbitrary color input into an array of recognized canonical colors.
 * Handles compound expressions like "Reddish-Maroon & Blue", "Cream / Off-White", "Magenta Pink & Mustard Yellow".
 */
export function normalizeColor(raw?: string | null): string[] {
  if (!raw || typeof raw !== "string") return [];

  const cleaned = raw.trim().toLowerCase();
  if (!cleaned) return [];

  const recognized = new Set<string>();

  // Check direct alias match first
  if (COLOR_ALIAS_MAP[cleaned]) {
    recognized.add(COLOR_ALIAS_MAP[cleaned]);
  }

  // Split on delimiters: '&', 'and', '/', '+', 'with', ',', '-'
  const tokens = cleaned
    .replace(/[&/+,]/g, " ")
    .replace(/\bwith\b/g, " ")
    .replace(/\band\b/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  // Check multi-word phrase combinations (e.g. "off white", "rose gold", "sky blue")
  for (let i = 0; i < tokens.length; i++) {
    // 2-word phrase
    if (i + 1 < tokens.length) {
      const phrase = `${tokens[i]} ${tokens[i + 1]}`;
      if (COLOR_ALIAS_MAP[phrase]) {
        recognized.add(COLOR_ALIAS_MAP[phrase]);
      }
    }
    // Single word
    const single = tokens[i];
    if (COLOR_ALIAS_MAP[single]) {
      recognized.add(COLOR_ALIAS_MAP[single]);
    }
  }

  // Direct substring check for key canonical names if set is still empty
  if (recognized.size === 0) {
    for (const c of CANONICAL_COLORS) {
      const lower = c.name.toLowerCase();
      if (cleaned.includes(lower)) {
        recognized.add(c.name);
      }
    }
  }

  return Array.from(recognized);
}

/**
 * Matches a product or color list against a list of selected colors.
 * Standard behavior: OR across selected colors (product contains ANY of the selected colors).
 * Accepts either a Product object or a string[] of product colors, and either a string or string[] for selected colors.
 */
export function matchesSelectedColors(
  productOrColors: { colors?: string[]; color?: string; colorCombination?: string } | string[] | undefined,
  selectedColors: string[] | string | undefined,
): boolean {
  if (!selectedColors) return true;
  const selectedList = Array.isArray(selectedColors)
    ? selectedColors
    : typeof selectedColors === "string" && selectedColors.trim()
      ? selectedColors.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

  if (selectedList.length === 0) return true;

  let productColorsList: string[] = [];
  if (Array.isArray(productOrColors)) {
    productColorsList = productOrColors;
  } else if (typeof productOrColors === "object" && productOrColors !== null) {
    if (Array.isArray(productOrColors.colors) && productOrColors.colors.length > 0) {
      productColorsList = productOrColors.colors;
    } else {
      productColorsList = normalizeColor(
        `${productOrColors.color || ""} ${productOrColors.colorCombination || ""}`,
      );
    }
  }

  if (productColorsList.length === 0) return false;

  const lowerSelected = selectedList.map((c) => c.toLowerCase().trim());
  const lowerProductColors = productColorsList.map((c) => c.toLowerCase().trim());

  return lowerSelected.some((sel) => lowerProductColors.includes(sel));
}

/**
 * Returns the hex code for a given color name, falling back to a neutral gold/grey
 */
export function getColorHex(colorName: string): string {
  const match = CANONICAL_COLORS.find(
    (c) => c.name.toLowerCase() === colorName.toLowerCase().trim(),
  );
  if (match) return match.hex;
  const alias = COLOR_ALIAS_MAP[colorName.toLowerCase().trim()];
  if (alias) {
    const aliasMatch = CANONICAL_COLORS.find((c) => c.name === alias);
    if (aliasMatch) return aliasMatch.hex;
  }
  return "#D4AF37"; // default gold
}
