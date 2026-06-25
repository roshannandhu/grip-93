"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import MarketShell from "@/components/market/MarketShell";
import Stepper from "@/components/market/Stepper";
import { useMarket } from "@/lib/store";
import { formatINR } from "@/lib/format";

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const { orders, ready } = useMarket();
  const order = orders.find((o) => o.id === id);

  return (
    <MarketShell>
      {!ready ? (
        <div className="py-24 text-center text-white/50">Loading…</div>
      ) : !order ? (
        <div className="grid place-items-center rounded-2xl glass p-16 text-center">
          <div>
            <h1 className="font-display text-3xl font-extrabold">Order not found</h1>
            <p className="mt-2 text-white/55">This order isn&apos;t on this device.</p>
            <Link href="/account" className="mt-5 inline-flex rounded-lg bg-flame px-7 py-3.5 font-display font-bold uppercase tracking-wide text-[#120a04]">My orders →</Link>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl glass p-8 text-center">
            <div className="text-5xl">✅</div>
            <h1 className="font-display mt-3 text-3xl font-extrabold">Order placed!</h1>
            <p className="mt-1 text-white/55">Order <span className="font-display text-flame">{order.id}</span> · {order.payment.toUpperCase()}</p>
          </div>

          <div className="mt-6 rounded-2xl glass p-6">
            <h2 className="font-display mb-5 text-lg font-bold">Tracking</h2>
            <Stepper current={order.status} />
          </div>

          <div className="mt-6 rounded-2xl glass p-6">
            <h2 className="font-display text-lg font-bold">Items</h2>
            <div className="mt-3 space-y-2 text-sm">
              {order.items.map(({ listing, qty }) => (
                <div key={listing.id} className="flex justify-between text-white/65">
                  <span>{listing.brand} {listing.model} {listing.sizeLabel} ×{qty}</span>
                  <span className="text-white">{formatINR(listing.priceINR * qty)}</span>
                </div>
              ))}
              <div className="my-2 border-t hairline" />
              <div className="flex justify-between text-white/60"><span>GST</span><span className="text-white">{formatINR(order.gst)}</span></div>
              <div className="flex justify-between text-white/60"><span>Delivery</span><span className="text-white">{order.shipping === 0 ? "FREE" : formatINR(order.shipping)}</span></div>
              <div className="flex justify-between"><span className="font-display font-bold">Total</span><span className="font-display text-xl font-extrabold">{formatINR(order.total)}</span></div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl glass p-6 text-sm text-white/65">
            <h2 className="font-display text-lg font-bold text-white">Delivering to</h2>
            <p className="mt-2">{order.address.name} · {order.address.phone}</p>
            <p>{order.address.line1}, {order.address.city} {order.address.state} — {order.address.pincode}</p>
            {order.address.gstin && <p className="mt-1 text-white/45">GSTIN: {order.address.gstin}</p>}
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <Link href="/shop" className="rounded-lg border border-white/20 px-6 py-3 font-display font-bold uppercase tracking-wide text-white hover:border-flame hover:text-flame">Keep shopping</Link>
            <Link href="/account" className="rounded-lg bg-flame px-6 py-3 font-display font-bold uppercase tracking-wide text-[#120a04]">My orders</Link>
          </div>
        </div>
      )}
    </MarketShell>
  );
}
