import type { Listing } from "@/lib/types";
import { dotLabel, tyreAge } from "@/lib/format";
import GradeBadge from "./GradeBadge";

const CHECKLIST = [
  "Tread depth (all ribs)", "Sidewall integrity", "Bead condition", "Inner liner",
  "Puncture/repair history", "Uneven wear", "Age (DOT)", "Run-flat check",
  "Bulges & cracks", "Valve condition", "Balance test", "Visual + air-hold test",
];

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 px-4 py-3">
      <div className="text-xs text-white/50">{label}</div>
      <div className="font-display text-lg font-bold">{value}</div>
    </div>
  );
}

export default function ConditionReport({ listing }: { listing: Listing }) {
  return (
    <div className="rounded-2xl glass p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold">Condition report</h2>
        <GradeBadge grade={listing.grade} withBlurb />
      </div>

      {/* tread bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Tread remaining</span>
          <span className="font-display font-bold">{listing.treadMm} mm · {listing.treadPct}%</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-flame to-flame-light" style={{ width: `${listing.treadPct}%` }} />
        </div>
        <div className="mt-1 text-xs text-white/40">Legal minimum 1.6 mm · new tyre ≈ 8 mm</div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Manufactured" value={dotLabel(listing.dotWeek, listing.dotYear)} />
        <Stat label="Age" value={tyreAge(listing.dotYear)} />
        <Stat label="Load / Speed" value={`${listing.loadIndex}${listing.speedRating}`} />
        <Stat label="Available" value={`${listing.qty} tyre${listing.qty > 1 ? "s" : ""}`} />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="font-display text-sm font-bold uppercase tracking-wide text-white/80">Notes</div>
          <ul className="mt-2 space-y-1.5 text-sm text-white/65">
            {listing.defects.map((d) => <li key={d} className="flex gap-2"><span className="text-flame">•</span>{d}</li>)}
            <li className="flex gap-2"><span className="text-flame">•</span>Reason for sale: {listing.reasonForSale}</li>
          </ul>
        </div>
        <div>
          <div className="font-display text-sm font-bold uppercase tracking-wide text-white/80">
            {listing.inspected12pt ? "12-point inspection ✓" : "Inspection pending"}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-white/60">
            {CHECKLIST.map((c) => (
              <span key={c} className="flex items-center gap-1.5">
                <span className={listing.inspected12pt ? "text-green-400" : "text-white/30"}>✓</span>{c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
