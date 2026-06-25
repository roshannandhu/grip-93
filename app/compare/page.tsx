"use client";

import Link from "next/link";
import MarketShell from "@/components/market/MarketShell";
import TyreImage from "@/components/market/TyreImage";
import GradeBadge from "@/components/market/GradeBadge";
import { useMarket } from "@/lib/store";
import { getListing } from "@/lib/data";
import { formatINR, dotLabel } from "@/lib/format";
import type { Listing } from "@/lib/types";

const ROWS: { label: string; get: (l: Listing) => string }[] = [
  { label: "Price", get: (l) => formatINR(l.priceINR) },
  { label: "Condition", get: (l) => `Grade ${l.grade} · ${l.treadPct}%` },
  { label: "Tread", get: (l) => `${l.treadMm} mm` },
  { label: "Manufactured", get: (l) => dotLabel(l.dotWeek, l.dotYear) },
  { label: "Load / Speed", get: (l) => `${l.loadIndex}${l.speedRating}` },
  { label: "Vehicle", get: (l) => l.vehicleType },
  { label: "Location", get: (l) => l.city },
  { label: "Seller", get: (l) => l.sellerType },
];

export default function ComparePage() {
  const { compare, ready, toggleCompare, addToCart } = useMarket();
  const items = compare.map(getListing).filter(Boolean) as Listing[];

  return (
    <MarketShell>
      <h1 className="font-display mb-6 text-4xl font-extrabold md:text-5xl">Compare tyres</h1>
      {ready && items.length === 0 ? (
        <div className="grid place-items-center rounded-2xl glass p-16 text-center">
          <div>
            <div className="text-5xl">⇄</div>
            <p className="mt-4 text-white/55">Add 2–3 tyres to compare them side by side.</p>
            <Link href="/shop" className="mt-6 inline-flex rounded-lg bg-flame px-7 py-3.5 font-display font-bold uppercase tracking-wide text-[#120a04]">Browse tyres →</Link>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="grid gap-4" style={{ gridTemplateColumns: `140px repeat(${items.length}, minmax(180px, 1fr))` }}>
            <div />
            {items.map((l) => (
              <div key={l.id} className="rounded-2xl glass p-3">
                <TyreImage listing={l} className="aspect-square" showBadges={false} />
                <div className="mt-2 font-display text-sm font-bold leading-tight">{l.brand} {l.model}</div>
                <div className="text-xs text-flame">{l.sizeLabel}</div>
                <div className="mt-1"><GradeBadge grade={l.grade} /></div>
              </div>
            ))}
            {ROWS.map((row) => (
              <FragmentRow key={row.label} label={row.label} values={items.map((l) => row.get(l))} />
            ))}
            <div />
            {items.map((l) => (
              <div key={l.id} className="flex flex-col gap-2 py-2">
                <button onClick={() => addToCart(l.id)} className="rounded-lg bg-flame px-3 py-2 font-display text-xs font-bold uppercase text-[#120a04]">Add to cart</button>
                <button onClick={() => toggleCompare(l.id)} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/65 hover:border-flame hover:text-flame">Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </MarketShell>
  );
}

function FragmentRow({ label, values }: { label: string; values: string[] }) {
  return (
    <>
      <div className="flex items-center border-t hairline py-3 text-sm font-display font-bold uppercase tracking-wide text-white/60">{label}</div>
      {values.map((v, i) => (
        <div key={i} className="flex items-center border-t hairline py-3 text-sm capitalize text-white">{v}</div>
      ))}
    </>
  );
}
