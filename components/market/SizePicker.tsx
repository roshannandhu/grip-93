"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { WIDTHS, ASPECTS, RIMS } from "@/lib/data";

const sel = "rounded-lg border border-white/15 bg-ink-700/60 px-3 py-2.5 text-sm text-white outline-none focus:border-flame";

export default function SizePicker({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [w, setW] = useState("");
  const [a, setA] = useState("");
  const [r, setR] = useState("");

  const go = () => {
    const p = new URLSearchParams();
    if (w) p.set("width", w);
    if (a) p.set("aspect", a);
    if (r) p.set("rim", r);
    router.push(`/shop?${p.toString()}`);
  };

  return (
    <div className={compact ? "flex flex-wrap items-end gap-2" : "grid gap-3 sm:grid-cols-4"}>
      <select className={sel} value={w} onChange={(e) => setW(e.target.value)} aria-label="Width">
        <option value="">Width</option>
        {WIDTHS.map((x) => <option key={x} value={x}>{x}</option>)}
      </select>
      <select className={sel} value={a} onChange={(e) => setA(e.target.value)} aria-label="Aspect">
        <option value="">Aspect</option>
        {ASPECTS.map((x) => <option key={x} value={x}>{x}</option>)}
      </select>
      <select className={sel} value={r} onChange={(e) => setR(e.target.value)} aria-label="Rim">
        <option value="">Rim</option>
        {RIMS.map((x) => <option key={x} value={x}>R{x}</option>)}
      </select>
      <button onClick={go} className="rounded-lg bg-flame px-6 py-2.5 font-display font-bold uppercase tracking-wide text-[#120a04] shadow-flame transition hover:bg-flame-light">
        Find tyres →
      </button>
    </div>
  );
}
