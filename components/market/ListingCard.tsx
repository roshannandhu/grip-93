"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Listing } from "@/lib/types";
import { formatINR, tyreAge } from "@/lib/format";
import { useMarket } from "@/lib/store";
import TyreImage from "./TyreImage";

export default function ListingCard({
  listing,
  onQuickView,
}: {
  listing: Listing;
  onQuickView?: (l: Listing) => void;
}) {
  const router = useRouter();
  const { addToCart, toggleWishlist, inWishlist, toggleCompare, inCompare } = useMarket();
  const wished = inWishlist(listing.id);
  const compared = inCompare(listing.id);
  const href = `/tyre/${listing.id}`;

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl glass transition hover:border-flame/40">
      {/* image → details */}
      <Link href={href} className="block">
        <TyreImage listing={listing} className="aspect-[4/3]" />
      </Link>

      {/* overlay icons (siblings of the link so they don't trigger navigation) */}
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
        <button
          onClick={(e) => { stop(e); toggleWishlist(listing.id); }}
          className={`grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition ${
            wished ? "border-flame bg-flame/20 text-flame" : "border-white/15 bg-black/40 text-white/70 hover:text-flame"
          }`}
          aria-label="Wishlist"
        >
          {wished ? "♥" : "♡"}
        </button>
        {onQuickView && (
          <button
            onClick={(e) => { stop(e); onQuickView(listing); }}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/40 text-white/70 backdrop-blur transition hover:border-flame hover:text-flame"
            aria-label="Quick view"
          >
            ⤢
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <Link href={href} className="block">
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

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-display text-2xl font-extrabold">{formatINR(listing.priceINR)}</div>
              <div className="text-[10px] text-white/40">+ 18% GST · per tyre</div>
            </div>
            <button
              onClick={(e) => { stop(e); toggleCompare(listing.id); }}
              className={`rounded-lg border px-2.5 py-1.5 font-display text-[11px] font-bold uppercase tracking-wide transition ${
                compared ? "border-flame text-flame" : "border-white/15 text-white/55 hover:border-flame hover:text-flame"
              }`}
            >
              {compared ? "✓ Compare" : "⇄ Compare"}
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={(e) => { stop(e); addToCart(listing.id); }}
              className="rounded-lg border border-white/20 px-3 py-2.5 font-display text-xs font-bold uppercase tracking-wide text-white transition hover:border-flame hover:text-flame"
            >
              Add to cart
            </button>
            <button
              onClick={(e) => { stop(e); addToCart(listing.id); router.push("/checkout"); }}
              className="rounded-lg bg-flame px-3 py-2.5 font-display text-xs font-bold uppercase tracking-wide text-[#120a04] shadow-flame transition hover:bg-flame-light"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
