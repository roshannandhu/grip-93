"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Listing } from "@/lib/types";
import { formatINR, gstOf } from "@/lib/format";
import { useMarket } from "@/lib/store";

export default function BuyBox({ listing }: { listing: Listing }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, inWishlist, toggleCompare, inCompare } = useMarket();
  const [qty, setQty] = useState(1);
  const [pin, setPin] = useState("");
  const wished = inWishlist(listing.id);
  const compared = inCompare(listing.id);

  const gst = gstOf(listing.priceINR * qty);
  const total = listing.priceINR * qty + gst;

  const eta = pin.length === 6 ? `${2 + (Number(pin[0]) % 4)}–${5 + (Number(pin[0]) % 4)} days to ${pin}` : null;

  return (
    <div className="rounded-2xl glass p-6">
      <div className="flex items-baseline gap-2">
        <span className="font-display text-3xl font-extrabold">{formatINR(listing.priceINR)}</span>
        <span className="text-sm text-white/45">/ tyre</span>
      </div>
      <div className="mt-1 text-xs text-white/45">Incl. 18% GST: {formatINR(listing.priceINR + gstOf(listing.priceINR))} · GST invoice available</div>

      <div className="mt-5 flex items-center gap-3">
        <span className="text-sm text-white/60">Quantity</span>
        <div className="flex items-center rounded-lg border border-white/15">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-1.5 text-white/70 hover:text-flame">−</button>
          <span className="w-8 text-center font-display font-bold">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(listing.qty, q + 1))} className="px-3 py-1.5 text-white/70 hover:text-flame">+</button>
        </div>
        <span className="text-xs text-white/40">{listing.qty} available</span>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
        <span className="text-sm text-white/60">Total ({qty})</span>
        <span className="font-display text-xl font-extrabold">{formatINR(total)}</span>
      </div>

      <div className="mt-4">
        <label className="text-sm text-white/60">Delivery to pincode</label>
        <div className="mt-1.5 flex gap-2">
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="e.g. 400001"
            className="w-full rounded-lg border border-white/15 bg-ink-700/60 px-3 py-2 text-sm outline-none focus:border-flame"
            inputMode="numeric"
          />
        </div>
        {eta && <div className="mt-1.5 text-xs text-green-400">🚚 Estimated {eta}</div>}
      </div>

      <div className="mt-5 grid gap-2">
        <button
          onClick={() => { addToCart(listing.id, qty); router.push("/cart"); }}
          className="rounded-lg bg-flame px-6 py-3.5 font-display font-bold uppercase tracking-wide text-[#120a04] shadow-flame transition hover:bg-flame-light"
        >
          Buy now →
        </button>
        <button
          onClick={() => addToCart(listing.id, qty)}
          className="rounded-lg border border-white/20 px-6 py-3 font-display font-bold uppercase tracking-wide text-white transition hover:border-flame hover:text-flame"
        >
          Add to cart
        </button>
        <div className="mt-1 flex gap-2">
          <button onClick={() => toggleWishlist(listing.id)} className={`flex-1 rounded-lg border py-2 text-sm transition ${wished ? "border-flame text-flame" : "border-white/15 text-white/70 hover:border-flame"}`}>
            {wished ? "♥ Saved" : "♡ Wishlist"}
          </button>
          <button onClick={() => toggleCompare(listing.id)} className={`flex-1 rounded-lg border py-2 text-sm transition ${compared ? "border-flame text-flame" : "border-white/15 text-white/70 hover:border-flame"}`}>
            {compared ? "✓ Comparing" : "⇄ Compare"}
          </button>
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-white/40">
        Fitment & safety: confirm size matches your vehicle&apos;s recommended spec. Used tyres are sold inspected
        but should be fitted and balanced by a professional. 7-day return if condition differs from report.
      </p>
    </div>
  );
}
