"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { LISTINGS, BRAND_NAMES, CITY_NAMES } from "@/lib/data";
import type { Grade, Listing, VehicleType } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { useMarket } from "@/lib/store";
import ListingCard from "@/components/market/ListingCard";
import QuickView from "@/components/market/QuickView";
import GradeBadge from "@/components/market/GradeBadge";
import TyreImage from "@/components/market/TyreImage";

// featured = cheapest top-grade tyre (a clear "best value" spotlight)
const FEATURED: Listing =
  [...LISTINGS].filter((l) => l.grade === "A").sort((a, b) => a.priceINR - b.priceINR)[0] ?? LISTINGS[0];

const VTYPES: VehicleType[] = ["car", "suv", "bike", "commercial"];
const GRADES_ARR: Grade[] = ["A", "B", "C", "D"];
const SORTS = [
  { k: "relevance", label: "Relevance" },
  { k: "price-asc", label: "Price: low → high" },
  { k: "price-desc", label: "Price: high → low" },
  { k: "tread", label: "Most tread" },
  { k: "new", label: "Newest (DOT)" },
];

function Check({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-sm transition ${
        on ? "border-flame bg-flame/15 text-flame" : "border-white/12 text-white/65 hover:border-white/30"
      }`}
    >
      {children}
    </button>
  );
}

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
  const [maxPrice, setMaxPrice] = useState(20000);
  const [sort, setSort] = useState("relevance");
  const [quick, setQuick] = useState<Listing | null>(null);
  const { compare, addToCart } = useMarket();

  const toggle = <T,>(arr: T[], v: T, set: (x: T[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

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

  return (
    <div>
      {/* featured hero banner — best value spotlight */}
      <Link href={`/tyre/${FEATURED.id}`} className="mb-8 grid items-center gap-6 overflow-hidden rounded-3xl glass p-6 transition hover:border-flame/40 md:grid-cols-[300px_1fr] md:p-8" style={{ background: "radial-gradient(circle at 80% 0%, rgba(255,106,26,0.16), transparent 55%)" }}>
        <TyreImage listing={FEATURED} className="aspect-square w-full" />
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-flame/40 bg-flame/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-wide text-flame">★ Best value</span>
            <GradeBadge grade={FEATURED.grade} />
          </div>
          <h2 className="font-display mt-3 text-3xl font-extrabold md:text-4xl">{FEATURED.brand} {FEATURED.model}</h2>
          <div className="mt-1 font-display text-flame">{FEATURED.sizeLabel} · {FEATURED.loadIndex}{FEATURED.speedRating} · {FEATURED.treadMm}mm tread · {FEATURED.dotYear}</div>
          <p className="mt-3 max-w-lg text-sm text-white/60">Inspected &amp; graded {FEATURED.grade}. {FEATURED.defects[0]}. Delivered to your pincode with a 7-day warranty.</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="font-display text-3xl font-extrabold">{formatINR(FEATURED.priceINR)}</span>
            <button onClick={(e) => { e.preventDefault(); addToCart(FEATURED.id); }} className="rounded-lg bg-flame px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-[#120a04] shadow-flame transition hover:bg-flame-light">Add to cart</button>
            <span className="rounded-lg border border-white/20 px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-white">View details →</span>
          </div>
        </div>
      </Link>

      <div className="mb-6">
        <h1 className="font-display text-4xl font-extrabold md:text-5xl">Browse used tyres</h1>
        <p className="mt-2 text-white/55">
          {results.length} inspected listing{results.length !== 1 ? "s" : ""}
          {vlabel ? <> · fits <span className="text-flame">{vlabel}</span></> : null}
          {(seedWidth || seedSizes.length) ? <> · size filtered</> : null}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* filters */}
        <aside className="space-y-5 self-start rounded-2xl glass p-5 lg:sticky lg:top-24">
          <div>
            <div className="font-display text-sm font-bold uppercase tracking-wide text-white/80">Sort</div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="mt-2 w-full rounded-lg border border-white/15 bg-ink-700/60 px-3 py-2 text-sm outline-none focus:border-flame">
              {SORTS.map((s) => <option key={s.k} value={s.k}>{s.label}</option>)}
            </select>
          </div>

          <div>
            <div className="font-display text-sm font-bold uppercase tracking-wide text-white/80">Vehicle</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {VTYPES.map((v) => <Check key={v} on={vtypes.includes(v)} onClick={() => toggle(vtypes, v, setVtypes)}>{v}</Check>)}
            </div>
          </div>

          <div>
            <div className="font-display text-sm font-bold uppercase tracking-wide text-white/80">Condition</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {GRADES_ARR.map((g) => <Check key={g} on={grades.includes(g)} onClick={() => toggle(grades, g, setGrades)}>Grade {g}</Check>)}
            </div>
          </div>

          <div>
            <div className="font-display text-sm font-bold uppercase tracking-wide text-white/80">Brand</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {BRAND_NAMES.map((b) => <Check key={b} on={brands.includes(b)} onClick={() => toggle(brands, b, setBrands)}>{b}</Check>)}
            </div>
          </div>

          <div>
            <div className="font-display text-sm font-bold uppercase tracking-wide text-white/80">Min tread: {minTread} mm</div>
            <input type="range" min={0} max={8} step={0.5} value={minTread} onChange={(e) => setMinTread(+e.target.value)} className="mt-2 w-full accent-[#ff6a1a]" />
          </div>

          <div>
            <div className="font-display text-sm font-bold uppercase tracking-wide text-white/80">Max price: ₹{maxPrice.toLocaleString("en-IN")}</div>
            <input type="range" min={1000} max={20000} step={500} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="mt-2 w-full accent-[#ff6a1a]" />
          </div>

          <div>
            <div className="font-display text-sm font-bold uppercase tracking-wide text-white/80">City</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {CITY_NAMES.map((c) => <Check key={c} on={cities.includes(c)} onClick={() => toggle(cities, c, setCities)}>{c}</Check>)}
            </div>
          </div>

          <button
            onClick={() => { setBrands([]); setVtypes([]); setGrades([]); setCities([]); setMinTread(0); setMaxPrice(20000); setSort("relevance"); }}
            className="w-full rounded-lg border border-white/15 py-2 text-sm text-white/70 transition hover:border-flame hover:text-flame"
          >
            Clear filters
          </button>
        </aside>

        {/* results */}
        {results.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((l) => <ListingCard key={l.id} listing={l} onQuickView={setQuick} />)}
          </div>
        ) : (
          <div className="grid place-items-center rounded-2xl glass p-16 text-center">
            <div>
              <div className="text-4xl">🔍</div>
              <h3 className="font-display mt-3 text-2xl font-bold">No tyres match those filters</h3>
              <p className="mt-2 text-white/55">Try widening the price range, tread, or clearing some filters.</p>
            </div>
          </div>
        )}
      </div>

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
