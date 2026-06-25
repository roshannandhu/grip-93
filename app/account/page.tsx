"use client";

import Link from "next/link";
import MarketShell from "@/components/market/MarketShell";
import { useMarket } from "@/lib/store";
import { formatINR } from "@/lib/format";

export default function AccountPage() {
  const { orders, wishlist, ready } = useMarket();

  return (
    <MarketShell>
      <h1 className="font-display mb-2 text-4xl font-extrabold md:text-5xl">My account</h1>
      <p className="mb-8 text-white/55">Guest session (demo) · saved on this device.</p>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl glass p-6 lg:col-span-2">
          <h2 className="font-display text-xl font-bold">My orders</h2>
          {ready && orders.length === 0 ? (
            <p className="mt-4 text-white/55">No orders yet. <Link href="/shop" className="text-flame">Start shopping →</Link></p>
          ) : (
            <div className="mt-4 space-y-3">
              {orders.map((o) => (
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

        <aside className="space-y-6">
          <div className="rounded-2xl glass p-6">
            <h2 className="font-display text-lg font-bold">Quick links</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/wishlist" className="text-white/65 hover:text-flame">♡ Wishlist ({wishlist.length})</Link></li>
              <li><Link href="/compare" className="text-white/65 hover:text-flame">⇄ Compare</Link></li>
              <li><Link href="/sell" className="text-white/65 hover:text-flame">💰 Sell your tyres</Link></li>
              <li><Link href="/cart" className="text-white/65 hover:text-flame">🛒 Cart</Link></li>
            </ul>
          </div>
          <div className="rounded-2xl glass p-6 text-sm text-white/55">
            <h2 className="font-display text-lg font-bold text-white">Saved address</h2>
            <p className="mt-2">Add an address at checkout — it&apos;ll be remembered on this device.</p>
          </div>
        </aside>
      </div>
    </MarketShell>
  );
}
