"use client";

import { useEffect } from "react";
import type { Grade, VehicleType } from "@/lib/types";
import { BRAND_NAMES, CITY_NAMES } from "@/lib/data";

const VTYPES: VehicleType[] = ["car", "suv", "bike", "commercial"];
const GRADES_ARR: Grade[] = ["A", "B", "C", "D"];

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-sm capitalize transition ${
        on ? "border-flame bg-flame/15 text-flame" : "border-white/12 text-white/65 hover:border-white/30"
      }`}
    >
      {children}
    </button>
  );
}

export type FilterState = {
  brands: string[]; vtypes: VehicleType[]; grades: Grade[]; cities: string[];
  minTread: number; maxPrice: number;
};

export default function FilterDrawer({
  open,
  onClose,
  resultCount,
  state,
  set,
  clearAll,
}: {
  open: boolean;
  onClose: () => void;
  resultCount: number;
  state: FilterState;
  set: {
    brands: (v: string[]) => void;
    vtypes: (v: VehicleType[]) => void;
    grades: (v: Grade[]) => void;
    cities: (v: string[]) => void;
    minTread: (v: number) => void;
    maxPrice: (v: number) => void;
  };
  clearAll: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const toggle = <T,>(arr: T[], v: T, fn: (x: T[]) => void) =>
    fn(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside
        className={`absolute right-0 top-0 flex h-full w-[min(380px,92vw)] flex-col bg-ink-800/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center justify-between border-b hairline px-5 py-4">
          <h2 className="font-display text-xl font-extrabold">Filters</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-flame hover:text-flame" aria-label="Close">✕</button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <Group label="Vehicle">
            {VTYPES.map((v) => <Chip key={v} on={state.vtypes.includes(v)} onClick={() => toggle(state.vtypes, v, set.vtypes)}>{v}</Chip>)}
          </Group>
          <Group label="Condition">
            {GRADES_ARR.map((g) => <Chip key={g} on={state.grades.includes(g)} onClick={() => toggle(state.grades, g, set.grades)}>Grade {g}</Chip>)}
          </Group>
          <Group label="Brand">
            {BRAND_NAMES.map((b) => <Chip key={b} on={state.brands.includes(b)} onClick={() => toggle(state.brands, b, set.brands)}>{b}</Chip>)}
          </Group>

          <div>
            <div className="font-display text-sm font-bold uppercase tracking-wide text-white/80">Min tread: {state.minTread} mm</div>
            <input type="range" min={0} max={8} step={0.5} value={state.minTread} onChange={(e) => set.minTread(+e.target.value)} className="mt-2 w-full accent-[#ff6a1a]" />
          </div>
          <div>
            <div className="font-display text-sm font-bold uppercase tracking-wide text-white/80">Max price: ₹{state.maxPrice.toLocaleString("en-IN")}</div>
            <input type="range" min={1000} max={20000} step={500} value={state.maxPrice} onChange={(e) => set.maxPrice(+e.target.value)} className="mt-2 w-full accent-[#ff6a1a]" />
          </div>

          <Group label="City">
            {CITY_NAMES.map((c) => <Chip key={c} on={state.cities.includes(c)} onClick={() => toggle(state.cities, c, set.cities)}>{c}</Chip>)}
          </Group>
        </div>

        <div className="flex gap-3 border-t hairline p-5">
          <button onClick={clearAll} className="flex-1 rounded-lg border border-white/15 px-4 py-3 font-display text-sm font-bold uppercase tracking-wide text-white/80 transition hover:border-flame hover:text-flame">Clear all</button>
          <button onClick={onClose} className="flex-1 rounded-lg bg-flame px-4 py-3 font-display text-sm font-bold uppercase tracking-wide text-[#120a04] shadow-flame transition hover:bg-flame-light">View {resultCount} result{resultCount !== 1 ? "s" : ""}</button>
        </div>
      </aside>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-display text-sm font-bold uppercase tracking-wide text-white/80">{label}</div>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
