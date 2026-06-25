"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMarket } from "@/lib/store";
import { getListing } from "@/lib/data";
import { formatINR, gstOf } from "@/lib/format";
import TyreImage from "./TyreImage";

export default function CartDrawer() {
  const router = useRouter();
  const { cartOpen, closeCart, cart, setQty, removeFromCart } = useMarket();
  const lines = cart.map((c) => ({ c, l: getListing(c.id)! })).filter((x) => x.l);
  const subtotal = lines.reduce((s, { c, l }) => s + l.priceINR * c.qty, 0);
  const gst = gstOf(subtotal);
  const shipping = subtotal > 0 && subtotal <= 5000 ? 299 : 0;
  const total = subtotal + gst + shipping;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    if (cartOpen) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cartOpen, closeCart]);

  const go = (href: string) => { closeCart(); router.push(href); };

  return (
    <div className={`fixed inset-0 z-[70] ${cartOpen ? "" : "pointer-events-none"}`} aria-hidden={!cartOpen}>
      {/* backdrop */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${cartOpen ? "opacity-100" : "opacity-0"}`}
      />
      {/* panel */}
      <aside
        className={`absolute right-0 top-0 flex h-full w-[min(420px,92vw)] flex-col bg-ink-800/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center justify-between border-b hairline px-5 py-4">
          <h2 className="font-display text-xl font-extrabold">Your cart {lines.length > 0 && <span className="text-flame">({lines.length})</span>}</h2>
          <button onClick={closeCart} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-flame hover:text-flame" aria-label="Close">✕</button>
        </div>

        {lines.length === 0 ? (
          <div className="grid flex-1 place-items-center p-8 text-center">
            <div>
              <div className="text-5xl">🛒</div>
              <p className="mt-4 text-white/55">Your cart is empty.</p>
              <button onClick={() => go("/shop")} className="mt-5 rounded-lg bg-flame px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-[#120a04] shadow-flame transition hover:bg-flame-light">Browse tyres →</button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {lines.map(({ c, l }) => (
                <div key={c.id} className="flex gap-3 rounded-xl bg-white/5 p-3">
                  <button onClick={() => go(`/tyre/${l.id}`)} className="h-20 w-20 shrink-0">
                    <TyreImage listing={l} className="h-full w-full" showBadges={false} />
                  </button>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <button onClick={() => go(`/tyre/${l.id}`)} className="text-left font-display text-sm font-bold leading-tight hover:text-flame">{l.brand} {l.model}</button>
                      <button onClick={() => removeFromCart(c.id)} className="text-xs text-white/40 hover:text-flame">✕</button>
                    </div>
                    <div className="text-xs text-flame">{l.sizeLabel} · Grade {l.grade}</div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-lg border border-white/15">
                        <button onClick={() => setQty(c.id, c.qty - 1)} className="px-2.5 py-1 text-white/70 hover:text-flame">−</button>
                        <span className="w-7 text-center text-sm font-display font-bold">{c.qty}</span>
                        <button onClick={() => setQty(c.id, c.qty + 1)} className="px-2.5 py-1 text-white/70 hover:text-flame">+</button>
                      </div>
                      <span className="font-display font-extrabold">{formatINR(l.priceINR * c.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t hairline p-5">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-white/60"><span>Subtotal</span><span className="text-white">{formatINR(subtotal)}</span></div>
                <div className="flex justify-between text-white/60"><span>GST (18%)</span><span className="text-white">{formatINR(gst)}</span></div>
                <div className="flex justify-between text-white/60"><span>Delivery</span><span className="text-white">{shipping === 0 ? "FREE" : formatINR(shipping)}</span></div>
                <div className="flex justify-between pt-1"><span className="font-display font-bold">Total</span><span className="font-display text-xl font-extrabold">{formatINR(total)}</span></div>
              </div>
              <button onClick={() => go("/checkout")} className="mt-4 w-full rounded-lg bg-flame px-6 py-3.5 font-display font-bold uppercase tracking-wide text-[#120a04] shadow-flame transition hover:bg-flame-light">Checkout →</button>
              <button onClick={() => go("/cart")} className="mt-2 w-full rounded-lg border border-white/15 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-white/80 transition hover:border-flame hover:text-flame">View full cart</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
