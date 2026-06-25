import type { Listing } from "@/lib/types";
import GradeBadge from "./GradeBadge";

// Uniform placeholder: the GRIP 93 render with brand + grade overlays (no real photos yet).
export default function TyreImage({
  listing,
  src,
  className = "",
  showBadges = true,
}: {
  listing: Listing;
  src?: string;
  className?: string;
  showBadges?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`} style={{ background: "radial-gradient(circle at 50% 40%, #15151b, #0a0a0c 75%)" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src ?? listing.photos[0]}
        alt={`${listing.brand} ${listing.model} ${listing.sizeLabel}`}
        className="h-full w-full object-contain p-4 drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)]"
        draggable={false}
      />
      {showBadges && (
        <>
          <span className="absolute left-3 top-3 rounded-md bg-black/55 px-2 py-1 font-display text-xs font-bold uppercase tracking-wide text-white backdrop-blur">
            {listing.brand}
          </span>
          <span className="absolute right-3 top-3">
            <GradeBadge grade={listing.grade} />
          </span>
          {listing.inspected12pt && (
            <span className="absolute bottom-3 left-3 rounded-md border border-flame/40 bg-flame/10 px-2 py-1 font-display text-[10px] font-bold uppercase tracking-wide text-flame">
              ✓ 12-pt inspected
            </span>
          )}
        </>
      )}
    </div>
  );
}
