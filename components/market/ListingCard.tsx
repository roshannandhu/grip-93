"use client";

import Link from "next/link";
import type { Listing } from "@/lib/types";
import { formatINR, tyreAge } from "@/lib/format";
import { useMarket } from "@/lib/store";
import TyreImage from "./TyreImage";

export default function ListingCard({ listing }: { listing: Listing }) {
  const { toggleWishlist, inWishlist, toggleCompare, inCompare } = useMarket();
  const wished = inWishlist(listing.id);
  const compared = inCompare(listing.id);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl glass transition hover:border-flame/40">
      <Link href={`/tyre/${listing.id}`} className="block">
        <TyreImage listing={listing} className="aspect-[4/3]" />
      </Link>

      <button
        onClick={() => toggleWishlist(listing.id)}
        className={`absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition ${
          wished ? "border-flame bg-flame/20 text-flame" : "border-white/15 bg-black/40 text-white/70 hover:text-flame"
        }`}
        aria-label="Wishlist"
      >
        {wished ? "♥" : "♡"}
      </button>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/tyre/${listing.id}`} className="block">
          <h3 className="font-display text-lg font-bold leading-tight">
            {listing.brand} <span className="text-white/85">{listing.model}</span>
          </h3>
          <div className="mt-0.5 font-display text-sm text-flame">{listing.sizeLabel} · {listing.loadIndex}{listing.speedRating}</div>
        </Link>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] text-white/55">
          <div className="rounded-lg bg-white/5 py-1.5"><div className="font-display text-sm font-bold text-white">{listing.treadMm}mm</div>tread</div>
          <div className="rounded-lg bg-white/5 py-1.5"><div className="font-display text-sm font-bold text-white">{listing.dotYear}</div>{tyreAge(listing.dotYear)}</div>
          <div className="rounded-lg bg-white/5 py-1.5"><div className="font-display text-sm font-bold text-white">{listing.qty}</div>in stock</div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-white/45">
          <span>📍 {listing.city}</span>
          <span className="capitalize">{listing.sellerType}</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div>
            <div className="font-display text-2xl font-extrabold">{formatINR(listing.priceINR)}</div>
            <div className="text-[10px] text-white/40">+ 18% GST · per tyre</div>
          </div>
          <button
            onClick={() => toggleCompare(listing.id)}
            className={`rounded-lg border px-3 py-2 font-display text-xs font-bold uppercase tracking-wide transition ${
              compared ? "border-flame bg-flame/15 text-flame" : "border-white/15 text-white/70 hover:border-flame hover:text-flame"
            }`}
          >
            {compared ? "✓ Compare" : "Compare"}
          </button>
        </div>
      </div>
    </div>
  );
}
