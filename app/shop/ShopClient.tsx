"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { LISTINGS } from "@/lib/data";
import type { Grade, Listing, VehicleType } from "@/lib/types";
import { useMarket } from "@/lib/store";
import ListingCard from "@/components/market/ListingCard";
import QuickView from "@/components/market/QuickView";
import FeaturedCarousel from "@/components/market/FeaturedCarousel";
import FilterDrawer, { type FilterState } from "@/components/market/FilterDrawer";
import Reveal from "@/components/market/Reveal";

// featured picks = top-grade tyres, cheapest first → the auto-rotating hero carousel
const FEATURED_PICKS: Listing[] = [...LISTINGS]
  .filter((l) => l.grade === "A" || l.grade === "B")
  .sort((a, b) => a.priceINR - b.priceINR)
  .slice(0, 5);

const SORTS = [
  { k: "relevance", label: "Relevance" },
  { k: "price-asc", label: "Price: low → high" },
  { k: "price-desc", label: "Price: high → low" },
  { k: "tread", label: "Most tread" },
  { k: "new", label: "Newest (DOT)" },
];

const DEFAULT_MAX = 20000;

export default function ShopClient() {
  const sp = useSearchParams();

  // deep-link seeds from home/search
  const seedWidth = sp.get("width");
  const seedAspect = sp.get("aspect");
  const seedRim = sp.get("rim");
  const seedSizes = sp.get("sizes")?.split(",").filter(Boolean) ?? [];
  const vlabel = sp.get("vlabel");

  const [brands, setBrands] = useState<string[]>([]);
  const [vtypes, setVtypes] = useState<VehicleType[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [minTread, setMinTread] = useState(0);
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX);
  const [sort, setSort] = useState("relevance");
  const [quick, setQuick] = useState<Listing | null>(null);
  const [drawer, setDrawer] = useState(false);
  const { compare } = useMarket();

  const results = useMemo(() => {
    let r = LISTINGS.filter((l) => {
      if (seedWidth && l.size.width !== +seedWidth) return false;
      if (seedAspect && l.size.aspect !== +seedAspect) return false;
      if (seedRim && l.size.rim !== +seedRim) return false;
      if (seedSizes.length && !seedSizes.includes(l.sizeLabel)) return false;
      if (brands.length && !brands.includes(l.brand)) return false;
      if (vtypes.length && !vtypes.includes(l.vehicleType)) return false;
      if (grades.length && !grades.includes(l.grade)) return false;
      if (cities.length && !cities.includes(l.city)) return false;
      if (l.treadMm < minTread) return false;
      if (l.priceINR > maxPrice) return false;
      return true;
    });
    if (sort === "price-asc") r = [...r].sort((a, b) => a.priceINR - b.priceINR);
    if (sort === "price-desc") r = [...r].sort((a, b) => b.priceINR - a.priceINR);
    if (sort === "tread") r = [...r].sort((a, b) => b.treadMm - a.treadMm);
    if (sort === "new") r = [...r].sort((a, b) => b.dotYear - a.dotYear);
    return r;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brands, vtypes, grades, cities, minTread, maxPrice, sort, seedWidth, seedAspect, seedRim, sp]);

  const clearAll = () => {
    setBrands([]); setVtypes([]); setGrades([]); setCities([]); setMinTread(0); setMaxPrice(DEFAULT_MAX);
  };
  const activeCount =
    brands.length + vtypes.length + grades.length + cities.length + (minTread > 0 ? 1 : 0) + (maxPrice < DEFAULT_MAX ? 1 : 0);

  // active-filter chips (each removes just itself)
  const chips: { label: string; remove: () => void }[] = [
    ...vtypes.map((v) => ({ label: v, remove: () => setVtypes(vtypes.filter((x) => x !== v)) })),
    ...grades.map((g) => ({ label: `Grade ${g}`, remove: () => setGrades(grades.filter((x) => x !== g)) })),
    ...brands.map((b) => ({ label: b, remove: () => setBrands(brands.filter((x) => x !== b)) })),
    ...cities.map((c) => ({ label: c, remove: () => setCities(cities.filter((x) => x !== c)) })),
    ...(minTread > 0 ? [{ label: `≥ ${minTread}mm tread`, remove: () => setMinTread(0) }] : []),
    ...(maxPrice < DEFAULT_MAX ? [{ label: `≤ ₹${maxPrice.toLocaleString("en-IN")}`, remove: () => setMaxPrice(DEFAULT_MAX) }] : []),
  ];

  return (
    <div>
      {/* auto-rotating featured hero carousel */}
      <FeaturedCarousel listings={FEATURED_PICKS} />

      <Reveal className="mb-5">
        <h1 className="font-display text-4xl font-extrabold md:text-5xl">Browse used tyres</h1>
      </Reveal>

      {/* toolbar — normal flow (no sticky → no scroll jitter) */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-white/55">
          {results.length} inspected listing{results.length !== 1 ? "s" : ""}
          {vlabel ? <> · fits <span className="text-flame">{vlabel}</span></> : null}
          {(seedWidth || seedSizes.length) ? <> · size filtered</> : null}
        </p>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-white/15 bg-ink-700/60 px-3 py-2.5 text-sm outline-none focus:border-flame"
            aria-label="Sort"
          >
            {SORTS.map((s) => <option key={s.k} value={s.k}>Sort: {s.label}</option>)}
          </select>
          <button
            onClick={() => setDrawer(true)}
            className="relative rounded-lg border border-white/15 px-4 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-white/85 transition hover:border-flame hover:text-flame"
          >
            ⚙ Filters
            {activeCount > 0 && (
              <span className="ml-2 inline-grid h-5 min-w-5 place-items-center rounded-full bg-flame px-1 text-[11px] font-bold text-[#120a04]">{activeCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* active filter chips */}
      {chips.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {chips.map((c, i) => (
            <button key={i} onClick={c.remove} className="inline-flex items-center gap-1.5 rounded-full border border-flame/40 bg-flame/10 px-3 py-1 text-xs font-bold capitalize text-flame transition hover:bg-flame/20">
              {c.label} <span className="text-flame/70">✕</span>
            </button>
          ))}
          <button onClick={clearAll} className="rounded-full px-3 py-1 text-xs text-white/50 underline-offset-2 hover:text-flame hover:underline">Clear all</button>
        </div>
      )}

      {/* results — full width */}
      {results.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((l, idx) => (
            <Reveal key={l.id} delay={Math.min(idx, 8) * 0.04}>
              <ListingCard listing={l} onQuickView={setQuick} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="grid place-items-center rounded-2xl glass p-16 text-center">
          <div>
            <div className="text-4xl">🔍</div>
            <h3 className="font-display mt-3 text-2xl font-bold">No tyres match those filters</h3>
            <p className="mt-2 text-white/55">Try widening the price range, tread, or clearing some filters.</p>
            <button onClick={clearAll} className="mt-5 rounded-lg bg-flame px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-[#120a04]">Clear filters</button>
          </div>
        </div>
      )}

      {/* filter drawer (no sticky anywhere) */}
      <FilterDrawer
        open={drawer}
        onClose={() => setDrawer(false)}
        resultCount={results.length}
        state={{ brands, vtypes, grades, cities, minTread, maxPrice } as FilterState}
        set={{ brands: setBrands, vtypes: setVtypes, grades: setGrades, cities: setCities, minTread: setMinTread, maxPrice: setMaxPrice }}
        clearAll={clearAll}
      />

      {/* quick-view modal */}
      <QuickView listing={quick} onClose={() => setQuick(null)} />

      {/* compare bar */}
      {compare.length >= 2 && (
        <div className="fixed inset-x-0 bottom-4 z-40 mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl glass px-5 py-3">
          <span className="font-display text-sm font-bold">{compare.length} selected to compare</span>
          <Link href="/compare" className="rounded-lg bg-flame px-5 py-2 font-display text-xs font-bold uppercase tracking-wide text-[#120a04] shadow-flame transition hover:bg-flame-light">Compare →</Link>
        </div>
      )}
    </div>
  );
}
