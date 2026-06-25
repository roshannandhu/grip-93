import { GRADES } from "@/lib/format";
import type { Grade } from "@/lib/types";

export default function GradeBadge({ grade, withBlurb = false }: { grade: Grade; withBlurb?: boolean }) {
  const g = GRADES[grade];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-xs font-bold"
      style={{ color: g.color, background: g.bg, border: `1px solid ${g.color}55` }}
    >
      <span className="grid h-4 w-4 place-items-center rounded-full text-[10px]" style={{ background: g.color, color: "#0a0a0c" }}>{grade}</span>
      {withBlurb ? g.blurb : g.label}
    </span>
  );
}
