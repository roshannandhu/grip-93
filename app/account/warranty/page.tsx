"use client";

import Link from "next/link";
import MarketShell from "@/components/market/MarketShell";
import AccountTabs from "@/components/market/AccountTabs";
import { useMarket } from "@/lib/store";

const DAY = 86400000;
const fmt = (t: number) => new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function WarrantyPage() {
  const { orders, ready } = useMarket();
  const now = Date.now();

  // one warranty entry per ordered tyre line
  const items = orders.flatMap((o) =>
    o.items.map(({ listing, qty }) => ({
      key: `${o.id}-${listing.id}`,
      orderId: o.id,
      listing,
      qty,
      placedAt: o.placedAt,
      returnEnds: o.placedAt + 7 * DAY,
      coverEnds: o.placedAt + 182 * DAY,
    }))
  );

  return (
    <MarketShell>
      <h1 className="font-display text-4xl font-extrabold md:text-5xl">Warranty</h1>
      <p className="mb-6 mt-1 text-white/55">Coverage for every GRIP 93 tyre you&apos;ve bought.</p>
      <AccountTabs />

      {ready && items.length === 0 ? (
        <div className="grid place-items-center rounded-2xl glass p-16 text-center">
          <div>
            <div className="text-5xl">🛡️</div>
            <p className="mt-4 text-white/55">No warranties yet — they appear here after you buy a tyre.</p>
            <Link href="/shop" className="mt-6 inline-flex rounded-lg bg-flame px-7 py-3.5 font-display font-bold uppercase tracking-wide text-[#120a04]">Browse tyres →</Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((w) => {
            const returnActive = now < w.returnEnds;
            const coverActive = now < w.coverEnds;
            return (
              <div key={w.key} className="rounded-2xl glass p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-display text-lg font-bold">{w.listing.brand} {w.listing.model}</div>
                    <div className="text-sm text-flame">{w.listing.sizeLabel} · Grade {w.listing.grade} ×{w.qty}</div>
                  </div>
                  <span className={`rounded-full px-3 py-1 font-display text-xs font-bold uppercase ${coverActive ? "bg-green-500/15 text-green-400" : "bg-white/10 text-white/50"}`}>
                    {coverActive ? "Active" : "Expired"}
                  </span>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <Row label="7-day return" value={returnActive ? `Until ${fmt(w.returnEnds)}` : "Ended"} ok={returnActive} />
                  <Row label="6-month workmanship" value={coverActive ? `Until ${fmt(w.coverEnds)}` : "Ended"} ok={coverActive} />
                </div>
                <div className="mt-4 flex items-center justify-between border-t hairline pt-3 text-xs text-white/45">
                  <span>Order {w.orderId} · {fmt(w.placedAt)}</span>
                  <Link href={`/order/${w.orderId}`} className="text-flame hover:underline">View order →</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-8 text-sm text-white/45">
        See full terms on the <Link href="/warranty" className="text-flame">warranty &amp; returns</Link> page.
      </p>
    </MarketShell>
  );
}

function Row({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
      <span className="text-white/60">{label}</span>
      <span className={ok ? "font-display font-bold text-green-400" : "text-white/50"}>{value}</span>
    </div>
  );
}
