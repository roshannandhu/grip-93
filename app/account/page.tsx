"use client";

import Link from "next/link";
import MarketShell from "@/components/market/MarketShell";
import AccountTabs from "@/components/market/AccountTabs";
import { useMarket } from "@/lib/store";
import { formatINR } from "@/lib/format";

const DAY = 86400000;

export default function AccountPage() {
  const { orders, wishlist, cartCount, ready } = useMarket();
  const now = Date.now();
  const activeWarranties = orders
    .flatMap((o) => o.items.map((it) => ({ it, placedAt: o.placedAt })))
    .filter((x) => now < x.placedAt + 182 * DAY).length;

  return (
    <MarketShell>
      <h1 className="font-display text-4xl font-extrabold md:text-5xl">My account</h1>
      <p className="mb-6 mt-1 text-white/55">Guest session (demo) · saved on this device.</p>
      <AccountTabs />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Orders" value={ready ? String(orders.length) : "—"} href="/account/orders" />
        <Stat label="Active warranties" value={ready ? String(activeWarranties) : "—"} href="/account/warranty" />
        <Stat label="Wishlist" value={ready ? String(wishlist.length) : "—"} href="/wishlist" />
      </div>

      <section id="orders" className="mt-8 rounded-2xl glass p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Recent orders</h2>
          <Link href="/account/orders" className="text-sm text-flame hover:underline">View all →</Link>
        </div>
        {ready && orders.length === 0 ? (
          <p className="mt-4 text-white/55">No orders yet. <Link href="/shop" className="text-flame">Start shopping →</Link></p>
        ) : (
          <div className="mt-4 space-y-3">
            {orders.slice(0, 4).map((o) => (
              <Link key={o.id} href={`/order/${o.id}`} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 transition hover:bg-white/10">
                <div>
                  <div className="font-display font-bold">{o.id}</div>
                  <div className="text-xs text-white/50">{o.items.length} item(s) · {o.status}</div>
                </div>
                <div className="font-display font-extrabold">{formatINR(o.total)}</div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="mt-6 rounded-2xl glass p-6 text-sm text-white/60">
        <h2 className="font-display text-lg font-bold text-white">Quick links</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {[["Shop tyres", "/shop"], ["Sell tyres", "/sell"], ["Cart" + (cartCount ? ` (${cartCount})` : ""), "/cart"], ["Compare", "/compare"], ["Support", "/contact"]].map(([label, href]) => (
            <Link key={href} href={href} className="rounded-lg border border-white/15 px-4 py-2 text-white/75 transition hover:border-flame hover:text-flame">{label}</Link>
          ))}
        </div>
      </div>
    </MarketShell>
  );
}

function Stat({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <Link href={href} className="rounded-2xl glass p-6 transition hover:border-flame/40">
      <div className="font-display text-4xl font-extrabold text-flame">{value}</div>
      <div className="mt-1 text-sm text-white/60">{label}</div>
    </Link>
  );
}
