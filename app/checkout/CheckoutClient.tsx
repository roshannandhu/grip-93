"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMarket } from "@/lib/store";
import { getListing } from "@/lib/data";
import { formatINR, gstOf } from "@/lib/format";
import type { Address, Order, PaymentMethod } from "@/lib/types";

const inp = "w-full rounded-lg border border-white/15 bg-ink-700/60 px-3 py-2.5 text-sm outline-none focus:border-flame";

export default function CheckoutClient() {
  const router = useRouter();
  const { cart, addOrder } = useMarket();
  const lines = cart.map((c) => ({ c, l: getListing(c.id)! })).filter((x) => x.l);

  const subtotal = lines.reduce((s, { c, l }) => s + l.priceINR * c.qty, 0);
  const gst = gstOf(subtotal);
  const shipping = subtotal > 0 ? (subtotal > 5000 ? 0 : 299) : 0;
  const total = subtotal + gst + shipping;

  const [a, setA] = useState<Address>({ name: "", phone: "", line1: "", city: "", state: "", pincode: "", gstin: "" });
  const [pay, setPay] = useState<PaymentMethod>("upi");
  const [err, setErr] = useState("");

  if (lines.length === 0) {
    return (
      <div className="grid place-items-center rounded-2xl glass p-16 text-center">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Nothing to check out</h1>
          <Link href="/shop" className="mt-5 inline-flex rounded-lg bg-flame px-7 py-3.5 font-display font-bold uppercase tracking-wide text-[#120a04]">Browse tyres →</Link>
        </div>
      </div>
    );
  }

  const place = () => {
    if (!a.name || a.phone.length < 10 || !a.line1 || !a.city || a.pincode.length !== 6) {
      setErr("Please fill name, 10-digit phone, address, city and 6-digit pincode.");
      return;
    }
    const order: Order = {
      id: `GRP${Date.now().toString().slice(-8)}`,
      items: lines.map(({ c, l }) => ({ listing: l, qty: c.qty })),
      address: a,
      payment: pay,
      subtotal, gst, shipping, total,
      placedAt: Date.now(),
      status: "Placed",
    };
    addOrder(order); // also clears cart
    router.push(`/order/${order.id}`);
  };

  return (
    <div>
      <h1 className="font-display mb-6 text-4xl font-extrabold md:text-5xl">Checkout</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl glass p-6">
            <h2 className="font-display text-xl font-bold">Delivery address</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input className={inp} placeholder="Full name" value={a.name} onChange={(e) => setA({ ...a, name: e.target.value })} />
              <input className={inp} placeholder="Phone (10-digit)" inputMode="numeric" value={a.phone} onChange={(e) => setA({ ...a, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} />
              <input className={`${inp} sm:col-span-2`} placeholder="Address line" value={a.line1} onChange={(e) => setA({ ...a, line1: e.target.value })} />
              <input className={inp} placeholder="City" value={a.city} onChange={(e) => setA({ ...a, city: e.target.value })} />
              <input className={inp} placeholder="State" value={a.state} onChange={(e) => setA({ ...a, state: e.target.value })} />
              <input className={inp} placeholder="Pincode" inputMode="numeric" value={a.pincode} onChange={(e) => setA({ ...a, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} />
              <input className={inp} placeholder="GSTIN (optional, for GST invoice)" value={a.gstin} onChange={(e) => setA({ ...a, gstin: e.target.value })} />
            </div>
          </section>

          <section className="rounded-2xl glass p-6">
            <h2 className="font-display text-xl font-bold">Payment</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {([["upi", "UPI"], ["card", "Card / Netbanking"], ["cod", "Cash on Delivery"]] as [PaymentMethod, string][]).map(([k, label]) => (
                <button key={k} onClick={() => setPay(k)} className={`rounded-lg border px-4 py-3 text-sm font-display font-bold transition ${pay === k ? "border-flame bg-flame/15 text-flame" : "border-white/15 text-white/70 hover:border-white/30"}`}>
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-white/40">Demo checkout — no real payment is processed.</p>
          </section>

          {err && <div className="rounded-lg border border-flame/40 bg-flame/10 px-4 py-3 text-sm text-flame">{err}</div>}
        </div>

        <aside className="self-start rounded-2xl glass p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold">Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            {lines.map(({ c, l }) => (
              <div key={c.id} className="flex justify-between text-white/60">
                <span>{l.brand} {l.model} ×{c.qty}</span>
                <span className="text-white">{formatINR(l.priceINR * c.qty)}</span>
              </div>
            ))}
            <div className="my-2 border-t hairline" />
            <div className="flex justify-between text-white/60"><span>GST (18%)</span><span className="text-white">{formatINR(gst)}</span></div>
            <div className="flex justify-between text-white/60"><span>Delivery</span><span className="text-white">{shipping === 0 ? "FREE" : formatINR(shipping)}</span></div>
            <div className="my-2 border-t hairline" />
            <div className="flex justify-between"><span className="font-display font-bold">Total</span><span className="font-display text-xl font-extrabold">{formatINR(total)}</span></div>
          </div>
          <button onClick={place} className="mt-5 w-full rounded-lg bg-flame px-6 py-3.5 font-display font-bold uppercase tracking-wide text-[#120a04] shadow-flame transition hover:bg-flame-light">Place order →</button>
        </aside>
      </div>
    </div>
  );
}
