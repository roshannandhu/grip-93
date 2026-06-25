"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Listing } from "@/lib/types";
import { formatINR, dotLabel, tyreAge } from "@/lib/format";
import { useMarket } from "@/lib/store";
import TyreImage from "./TyreImage";
import GradeBadge from "./GradeBadge";

export default function QuickView({ listing, onClose }: { listing: Listing | null; onClose: () => void }) {
  const { addToCart, openCart } = useMarket();

  useEffect(() => {
    if (!listing) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [listing, onClose]);

  if (!listing) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl glass"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/40 text-white/70 transition hover:border-flame hover:text-flame"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="grid gap-0 sm:grid-cols-2">
          <TyreImage listing={listing} className="aspect-square" />

          <div className="flex flex-col p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="font-display text-xs font-bold uppercase tracking-[0.2em] text-flame">{listing.brand}</div>
              <GradeBadge grade={listing.grade} />
            </div>
            <h2 className="font-display mt-1 text-2xl font-extrabold">{listing.brand} {listing.model}</h2>
            <div className="font-display text-sm text-flame">{listing.sizeLabel} · {listing.loadIndex}{listing.speedRating}</div>

            {/* tread bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-white/55"><span>Tread</span><span className="font-display font-bold text-white">{listing.treadMm} mm · {listing.treadPct}%</span></div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-flame to-flame-light" style={{ width: `${listing.treadPct}%` }} />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <Spec k="Made" v={dotLabel(listing.dotWeek, listing.dotYear)} />
              <Spec k="Age" v={tyreAge(listing.dotYear)} />
              <Spec k="Vehicle" v={listing.vehicleType} />
              <Spec k="Location" v={listing.city} />
            </div>

            <div className="mt-auto pt-5">
              <div className="font-display text-2xl font-extrabold">{formatINR(listing.priceINR)} <span className="text-xs font-normal text-white/40">+ GST</span></div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => { addToCart(listing.id); onClose(); openCart(); }}
                  className="flex-1 rounded-lg bg-flame px-4 py-2.5 font-display text-xs font-bold uppercase tracking-wide text-[#120a04] shadow-flame transition hover:bg-flame-light"
                >
                  Add to cart
                </button>
                <Link
                  href={`/tyre/${listing.id}`}
                  className="flex-1 rounded-lg border border-white/20 px-4 py-2.5 text-center font-display text-xs font-bold uppercase tracking-wide text-white transition hover:border-flame hover:text-flame"
                >
                  Full details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg bg-white/5 px-3 py-2">
      <div className="text-[11px] text-white/45">{k}</div>
      <div className="font-display font-bold capitalize">{v}</div>
    </div>
  );
}
