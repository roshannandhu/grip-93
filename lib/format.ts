import type { Grade } from "./types";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatINR(n: number): string {
  return inr.format(Math.round(n));
}

export const GST_RATE = 0.18;

export function gstOf(amount: number): number {
  return Math.round(amount * GST_RATE);
}

export const GRADES: Record<Grade, { label: string; blurb: string; color: string; bg: string }> = {
  A: { label: "Grade A", blurb: "Like new · 90%+ tread", color: "#22c55e", bg: "rgba(34,197,94,0.14)" },
  B: { label: "Grade B", blurb: "Excellent · 70–90% tread", color: "#84cc16", bg: "rgba(132,204,22,0.14)" },
  C: { label: "Grade C", blurb: "Good · 50–70% tread", color: "#f59e0b", bg: "rgba(245,158,11,0.14)" },
  D: { label: "Grade D", blurb: "Fair · 30–50% tread", color: "#f97316", bg: "rgba(249,115,22,0.14)" },
};

export function dotLabel(week: number, year: number): string {
  const w = String(week).padStart(2, "0");
  return `${w}${String(year).slice(-2)} (wk ${week}/${year})`;
}

export function tyreAge(year: number, now = 2026): string {
  const yrs = Math.max(0, now - year);
  return yrs === 0 ? "This year" : `${yrs} yr${yrs > 1 ? "s" : ""} old`;
}
