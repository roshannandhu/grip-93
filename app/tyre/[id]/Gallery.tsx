"use client";

import { useState } from "react";
import type { Listing } from "@/lib/types";
import TyreImage from "@/components/market/TyreImage";

export default function Gallery({ listing }: { listing: Listing }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <TyreImage listing={listing} src={listing.photos[active]} className="aspect-square" />
      <div className="mt-3 flex gap-3">
        {listing.photos.map((p, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-20 w-20 overflow-hidden rounded-xl border transition ${i === active ? "border-flame" : "border-white/12 hover:border-white/30"}`}
          >
            <TyreImage listing={listing} src={p} className="h-full w-full" showBadges={false} />
          </button>
        ))}
      </div>
    </div>
  );
}
