"use client";

import Link from "next/link";
import { useMarket } from "@/lib/store";
import { getListing } from "@/lib/data";
import { formatINR, gstOf } from "@/lib/format";
import TyreImage from "@/components/market/TyreImage";

export default function CartClient() {
  const { cart, setQty, removeFromCart, ready } = useMarket();
  const lines = cart.map((c) => ({ c, l: getListing(c.id)! })).filter((x) => x.l);

  const subtotal = lines.reduce((s, { c, l }) => s + l.priceINR * c.qty, 0);
  const gst = gstOf(subtotal);
  const shipping = subtotal > 0 ? (subtotal > 5000 ? 0 : 299) : 0;
  const total = subtotal + gst + shipping;

  if (ready && lines.length === 0) {
    return (
      <div className="grid place-items-center rounded-2xl glass p-16 text-center">
        <div>
          <div className="text-5xl">🛒</div>
          <h1 className="font-display mt-4 text-3xl font-extrabold">Your cart is empty</h1>
          <p className="mt-2 text-white/55">Find inspected, graded used tyres at honest prices.</p>
          <Link href="/shop" className="mt-6 inline-flex rounded-lg bg-flame px-7 py-3.5 font-display font-bold uppercase tracking-wide text-[#120a04] shadow-flame transition hover:bg-flame-light">Browse tyres →</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display mb-6 text-4xl font-extrabold md:text-5xl">Your cart</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {lines.map(({ c, l }) => (
            <div key={c.id} className="flex gap-4 rounded-2xl glass p-4">
              <Link href={`/tyre/${l.id}`} className="h-28 w-28 shrink-0">
                <TyreImage listing={l} className="h-full w-full" showBadges={false} />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/tyre/${l.id}`} className="font-display text-lg font-bold hover:text-flame">{l.brand} {l.model}</Link>
                    <div className="text-sm text-flame">{l.sizeLabel} · Grade {l.grade} · {l.treadMm}mm</div>
                    <div className="text-xs text-white/45">📍 {l.city}</div>
                  </div>
                  <button onClick={() => removeFromCart(c.id)} className="text-sm text-white/40 hover:text-flame">Remove</button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-lg border border-white/15">
                    <button onClick={() => setQty(c.id, c.qty - 1)} className="px-3 py-1.5 text-white/70 hover:text-flame">−</button>
                    <span className="w-8 text-center font-display font-bold">{c.qty}</span>
                    <button onClick={() => setQty(c.id, c.qty + 1)} className="px-3 py-1.5 text-white/70 hover:text-flame">+</button>
                  </div>
                  <div className="font-display text-xl font-extrabold">{formatINR(l.priceINR * c.qty)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="self-start rounded-2xl glass p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={formatINR(subtotal)} />
            <Row label="GST (18%)" value={formatINR(gst)} />
            <Row label="Delivery" value={shipping === 0 ? "FREE" : formatINR(shipping)} />
            <div className="my-2 border-t hairline" />
            <Row label="Total" value={formatINR(total)} big />
          </div>
          {shipping > 0 && <div className="mt-2 text-xs text-white/45">Add {formatINR(5000 - subtotal)} more for free delivery.</div>}
          <Link href="/checkout" className="mt-5 block rounded-lg bg-flame px-6 py-3.5 text-center font-display font-bold uppercase tracking-wide text-[#120a04] shadow-flame transition hover:bg-flame-light">Checkout →</Link>
          <Link href="/shop" className="mt-2 block text-center text-sm text-white/55 hover:text-flame">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={big ? "font-display font-bold" : "text-white/60"}>{label}</span>
      <span className={big ? "font-display text-xl font-extrabold" : "font-display font-bold"}>{value}</span>
    </div>
  );
}
