import type { Grade, Listing, VehicleType } from "./types";

// Deterministic mock listings (seeded so SSR === client; no Math.random at render).
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BRANDS = [
  { name: "MRF", models: ["ZLX", "ZVTV", "Wanderer"], tier: 1.0 },
  { name: "Apollo", models: ["Amazer 4G", "Alnac 4G", "Apterra"], tier: 1.0 },
  { name: "CEAT", models: ["SecuraDrive", "Milaze", "CrossDrive"], tier: 0.95 },
  { name: "JK Tyre", models: ["UX Royale", "Ranger", "Blaze"], tier: 0.92 },
  { name: "Bridgestone", models: ["Turanza", "Ecopia", "Dueler"], tier: 1.25 },
  { name: "Michelin", models: ["Primacy 4", "Energy XM2", "Pilot Sport"], tier: 1.4 },
  { name: "Goodyear", models: ["Assurance", "Eagle F1", "Wrangler"], tier: 1.2 },
  { name: "Continental", models: ["ComfortContact", "UltraContact", "CrossContact"], tier: 1.3 },
  { name: "Yokohama", models: ["BluEarth", "Earth-1", "Geolandar"], tier: 1.15 },
];

const SIZES: Record<VehicleType, [number, number, number][]> = {
  car: [
    [165, 80, 14], [175, 65, 15], [185, 65, 15], [195, 65, 15], [195, 55, 16], [205, 55, 16],
  ],
  suv: [
    [215, 60, 17], [225, 65, 17], [235, 60, 18], [235, 65, 17], [265, 60, 18],
  ],
  bike: [
    [90, 90, 17], [100, 80, 17], [110, 70, 17], [120, 70, 17], [140, 60, 17],
  ],
  commercial: [
    [195, 75, 16], [215, 75, 15], [205, 70, 15],
  ],
};

const CITIES = ["Mumbai", "Delhi", "Bengaluru", "Pune", "Chennai", "Hyderabad", "Ahmedabad", "Kolkata", "Jaipur", "Kochi"];
const SPEEDS = ["S", "T", "H", "V", "W"];
const DEFECTS = ["Minor sidewall scuffs", "Even wear", "No punctures/repairs", "One plug repair (safe)", "Slight kerb mark", "No cracks"];
const REASONS = ["Upgraded to bigger size", "Sold the car", "Switched to all-season", "Fleet rotation", "Spare never used", "Seasonal change"];

function gradeFromTread(pct: number): Grade {
  if (pct >= 90) return "A";
  if (pct >= 70) return "B";
  if (pct >= 50) return "C";
  return "D";
}

function pick<T>(r: () => number, arr: T[]): T {
  return arr[Math.floor(r() * arr.length)];
}

function makeListings(): Listing[] {
  const r = mulberry32(93_1993);
  const vehicleTypes: VehicleType[] = ["car", "car", "car", "suv", "suv", "bike", "commercial"];
  const out: Listing[] = [];
  for (let i = 0; i < 54; i++) {
    const brand = pick(r, BRANDS);
    const model = pick(r, brand.models);
    const vehicleType = pick(r, vehicleTypes);
    const [width, aspect, rim] = pick(r, SIZES[vehicleType]);
    const treadPct = 35 + Math.floor(r() * 62); // 35..96
    const treadMm = +(1.6 + (treadPct / 100) * 6.4).toFixed(1); // ~1.6..8mm
    const grade = gradeFromTread(treadPct);
    const dotYear = 2019 + Math.floor(r() * 7); // 2019..2025
    const dotWeek = 1 + Math.floor(r() * 52);
    const loadIndex = 82 + Math.floor(r() * 20);
    const speedRating = pick(r, SPEEDS);

    // price: rough new-price proxy scaled by size + brand tier, discounted by condition + age
    const base = (width * 9 + rim * 220) * brand.tier;
    const ageFactor = 1 - (2026 - dotYear) * 0.06;
    const condFactor = 0.35 + (treadPct / 100) * 0.5; // 0.35..0.85 of proxy
    const priceINR = Math.max(900, Math.round((base * ageFactor * condFactor) / 50) * 50);

    const defectCount = 1 + Math.floor(r() * 3);
    const defects: string[] = [];
    for (let d = 0; d < defectCount; d++) defects.push(pick(r, DEFECTS));

    out.push({
      id: `t${(i + 1).toString().padStart(3, "0")}`,
      brand: brand.name,
      model,
      size: { width, aspect, rim },
      sizeLabel: `${width}/${aspect} R${rim}`,
      vehicleType,
      loadIndex,
      speedRating,
      treadMm,
      treadPct,
      dotWeek,
      dotYear,
      grade,
      priceINR,
      qty: 1 + Math.floor(r() * 4),
      city: pick(r, CITIES),
      photos: ["/cards/grip93-34.webp", "/cards/grip93-34.webp", "/cards/grip93-34.webp"],
      defects: Array.from(new Set(defects)),
      reasonForSale: pick(r, REASONS),
      inspected12pt: r() > 0.15,
      sellerType: r() > 0.5 ? "dealer" : "individual",
    });
  }
  return out;
}

export const LISTINGS: Listing[] = makeListings();

export const BRAND_NAMES = Array.from(new Set(LISTINGS.map((l) => l.brand))).sort();
export const CITY_NAMES = Array.from(new Set(LISTINGS.map((l) => l.city))).sort();
export const WIDTHS = Array.from(new Set(LISTINGS.map((l) => l.size.width))).sort((a, b) => a - b);
export const ASPECTS = Array.from(new Set(LISTINGS.map((l) => l.size.aspect))).sort((a, b) => a - b);
export const RIMS = Array.from(new Set(LISTINGS.map((l) => l.size.rim))).sort((a, b) => a - b);

export function getListing(id: string): Listing | undefined {
  return LISTINGS.find((l) => l.id === id);
}

export function relatedListings(l: Listing, n = 4): Listing[] {
  return LISTINGS.filter((x) => x.id !== l.id && (x.size.rim === l.size.rim || x.brand === l.brand)).slice(0, n);
}
