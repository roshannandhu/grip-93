"use client";

import Link from "next/link";
import MarketShell from "@/components/market/MarketShell";
import AccountTabs from "@/components/market/AccountTabs";
import { useMarket } from "@/lib/store";
import { formatINR } from "@/lib/format";

export default function OrdersPage() {
  const { orders, ready } = useMarket();

  return (
    <MarketShell>
      <h1 className="font-display text-4xl font-extrabold md:text-5xl">My orders</h1>
      <p className="mb-6 mt-1 text-white/55">Track and review your GRIP 93 purchases.</p>
      <AccountTabs />

      {ready && orders.length === 0 ? (
        <div className="grid place-items-center rounded-2xl glass p-16 text-center">
          <div>
            <div className="text-5xl">📦</div>
            <p className="mt-4 text-white/55">You haven&apos;t placed any orders yet.</p>
            <Link href="/shop" className="mt-6 inline-flex rounded-lg bg-flame px-7 py-3.5 font-display font-bold uppercase tracking-wide text-[#120a04]">Browse tyres →</Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl glass p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-display text-lg font-bold">{o.id}</div>
                  <div className="text-xs text-white/45">{new Date(o.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {o.items.length} item(s)</div>
                </div>
                <span className="rounded-full border border-flame/40 bg-flame/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-wide text-flame">{o.status}</span>
              </div>
              <div className="mt-3 space-y-1 text-sm text-white/60">
                {o.items.map(({ listing, qty }) => (
                  <div key={listing.id} className="flex justify-between">
                    <span>{listing.brand} {listing.model} {listing.sizeLabel} ×{qty}</span>
                    <span className="text-white">{formatINR(listing.priceINR * qty)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t hairline pt-3">
                <span className="font-display text-lg font-extrabold">{formatINR(o.total)}</span>
                <Link href={`/order/${o.id}`} className="rounded-lg border border-white/20 px-5 py-2 font-display text-xs font-bold uppercase tracking-wide text-white transition hover:border-flame hover:text-flame">Track order →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </MarketShell>
  );
}
