"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { VEHICLES, MAKES } from "@/lib/vehicles";

const sel = "rounded-lg border border-white/15 bg-ink-700/60 px-3 py-2.5 text-sm text-white outline-none focus:border-flame";

export default function VehiclePicker({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const models = useMemo(() => VEHICLES.find((v) => v.make === make)?.models ?? [], [make]);
  const years = useMemo(() => models.find((m) => m.name === model)?.years ?? [], [models, model]);
  const sizes = useMemo(() => models.find((m) => m.name === model)?.sizes ?? [], [models, model]);

  const go = () => {
    const p = new URLSearchParams();
    if (sizes.length) p.set("sizes", sizes.join(","));
    if (make) p.set("vlabel", `${make} ${model} ${year}`.trim());
    router.push(`/shop?${p.toString()}`);
  };

  return (
    <div className={compact ? "flex flex-wrap items-end gap-2" : "grid gap-3 sm:grid-cols-4"}>
      <select className={sel} value={make} onChange={(e) => { setMake(e.target.value); setModel(""); setYear(""); }} aria-label="Make">
        <option value="">Make</option>
        {MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <select className={sel} value={model} onChange={(e) => { setModel(e.target.value); setYear(""); }} disabled={!make} aria-label="Model">
        <option value="">Model</option>
        {models.map((m) => <option key={m.name} value={m.name}>{m.name}</option>)}
      </select>
      <select className={sel} value={year} onChange={(e) => setYear(e.target.value)} disabled={!model} aria-label="Year">
        <option value="">Year</option>
        {years.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>
      <button onClick={go} disabled={!model} className="rounded-lg bg-flame px-6 py-2.5 font-display font-bold uppercase tracking-wide text-[#120a04] shadow-flame transition hover:bg-flame-light disabled:opacity-40">
        Find tyres →
      </button>
    </div>
  );
}
