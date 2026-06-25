"use client";

import Link from "next/link";
import { useState } from "react";

const inp = "w-full rounded-lg border border-white/15 bg-ink-700/60 px-3 py-2.5 text-sm outline-none focus:border-flame";
const STEPS = ["Tyre details", "Condition", "Photos & contact"];

export default function SellClient() {
  const [f, setF] = useState({ brand: "", size: "", qty: "1", tread: "70", year: "2022", reason: "", pincode: "", phone: "", expected: "" });
  const [photos, setPhotos] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const urls = Array.from(e.target.files ?? []).slice(0, 4).map((file) => URL.createObjectURL(file));
    setPhotos(urls);
  };

  // mock instant quote from condition + expected
  const quote = (() => {
    const base = 1500 + Number(f.tread) * 25 + (Number(f.year) - 2018) * 200;
    return Math.max(600, Math.round(base / 50) * 50) * Math.max(1, Number(f.qty) || 1);
  })();

  if (done) {
    return (
      <div className="mx-auto grid max-w-xl place-items-center rounded-2xl glass p-12 text-center">
        <div>
          <div className="text-5xl">📦</div>
          <h1 className="font-display mt-4 text-3xl font-extrabold">Quote submitted!</h1>
          <p className="mt-2 text-white/60">Estimated offer: <span className="font-display text-2xl font-extrabold text-flame">₹{quote.toLocaleString("en-IN")}</span></p>
          <p className="mt-2 text-sm text-white/50">Our team will call {f.phone || "you"} to confirm and arrange free doorstep pickup at {f.pincode || "your pincode"}.</p>
          <Link href="/" className="mt-6 inline-flex rounded-lg bg-flame px-7 py-3.5 font-display font-bold uppercase tracking-wide text-[#120a04]">Back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl font-extrabold md:text-5xl">Sell your tyres</h1>
      <p className="mt-2 text-white/55">Get an instant estimate and free doorstep pickup across India.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_300px]">
        <form
          className="space-y-6"
          onSubmit={(e) => { e.preventDefault(); setDone(true); }}
        >
          <section className="rounded-2xl glass p-6">
            <div className="font-display text-sm font-bold uppercase tracking-wide text-flame">{STEPS[0]}</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input className={inp} placeholder="Brand (e.g. MRF)" value={f.brand} onChange={set("brand")} required />
              <input className={inp} placeholder="Size (e.g. 195/65 R15)" value={f.size} onChange={set("size")} required />
              <input className={inp} placeholder="Quantity" type="number" min={1} max={8} value={f.qty} onChange={set("qty")} />
              <select className={inp} value={f.year} onChange={set("year")}>
                {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map((y) => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
          </section>

          <section className="rounded-2xl glass p-6">
            <div className="font-display text-sm font-bold uppercase tracking-wide text-flame">{STEPS[1]}</div>
            <label className="mt-4 block text-sm text-white/60">Tread remaining: {f.tread}%</label>
            <input type="range" min={20} max={95} value={f.tread} onChange={set("tread")} className="mt-2 w-full accent-[#ff6a1a]" />
            <input className={`${inp} mt-3`} placeholder="Reason for sale (optional)" value={f.reason} onChange={set("reason")} />
          </section>

          <section className="rounded-2xl glass p-6">
            <div className="font-display text-sm font-bold uppercase tracking-wide text-flame">{STEPS[2]}</div>
            <input type="file" accept="image/*" multiple onChange={onFiles} className="mt-4 block w-full text-sm text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-flame file:px-4 file:py-2 file:font-display file:text-xs file:font-bold file:uppercase file:text-[#120a04]" />
            {photos.length > 0 && (
              <div className="mt-3 flex gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {photos.map((p, i) => <img key={i} src={p} alt="" className="h-16 w-16 rounded-lg object-cover" />)}
              </div>
            )}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input className={inp} placeholder="Pincode" inputMode="numeric" value={f.pincode} onChange={set("pincode")} required />
              <input className={inp} placeholder="Phone" inputMode="numeric" value={f.phone} onChange={set("phone")} required />
            </div>
          </section>

          <button type="submit" className="w-full rounded-lg bg-flame px-6 py-3.5 font-display font-bold uppercase tracking-wide text-[#120a04] shadow-flame transition hover:bg-flame-light">Get my quote →</button>
        </form>

        <aside className="self-start rounded-2xl glass p-6 md:sticky md:top-24">
          <div className="text-sm text-white/55">Estimated offer</div>
          <div className="font-display text-3xl font-extrabold text-flame">₹{quote.toLocaleString("en-IN")}</div>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li className="flex gap-2"><span className="text-flame">✓</span> Free doorstep pickup</li>
            <li className="flex gap-2"><span className="text-flame">✓</span> Instant UPI payment</li>
            <li className="flex gap-2"><span className="text-flame">✓</span> No paperwork hassle</li>
          </ul>
          <p className="mt-4 text-xs text-white/40">Final offer confirmed after physical inspection.</p>
        </aside>
      </div>
    </div>
  );
}
