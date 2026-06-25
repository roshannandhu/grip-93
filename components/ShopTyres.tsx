"use client";

import { useEffect, useRef, useState } from "react";

type Tyre = {
  name: string;
  tag: string;
  size: string;
  price: number;
  specs: [string, string][];
};

const TYRES: Tyre[] = [
  { name: "Sport", tag: "Max grip", size: "225/45 R17 94W XL", price: 189, specs: [["Wet grip", "A"], ["Noise", "70 dB"], ["Mileage", "60,000 km"], ["Speed", "270 km/h"]] },
  { name: "Touring", tag: "Comfort", size: "205/55 R16 91V", price: 149, specs: [["Wet grip", "B"], ["Noise", "68 dB"], ["Mileage", "70,000 km"], ["Speed", "240 km/h"]] },
  { name: "All-Season", tag: "Year-round", size: "215/60 R16 95H", price: 159, specs: [["Wet grip", "A"], ["Noise", "69 dB"], ["Mileage", "65,000 km"], ["Speed", "210 km/h"]] },
  { name: "Winter", tag: "Ice & snow", size: "225/50 R17 98V XL", price: 179, specs: [["Wet grip", "A"], ["Snow", "3PMSF"], ["Mileage", "55,000 km"], ["Speed", "240 km/h"]] },
  { name: "Off-Road A/T", tag: "All terrain", size: "265/70 R16 112T", price: 219, specs: [["Wet grip", "B"], ["Mud", "M+S"], ["Mileage", "65,000 km"], ["Speed", "190 km/h"]] },
  { name: "Eco", tag: "Low rolling", size: "195/65 R15 91H", price: 129, specs: [["Wet grip", "A"], ["Fuel", "A"], ["Mileage", "75,000 km"], ["Speed", "210 km/h"]] },
  { name: "RunFlat", tag: "Zero-pressure", size: "245/40 R18 97Y XL", price: 239, specs: [["Wet grip", "A"], ["Runflat", "80 km"], ["Mileage", "50,000 km"], ["Speed", "300 km/h"]] },
  { name: "Track", tag: "Circuit", size: "255/35 R19 96Y XL", price: 279, specs: [["Wet grip", "A"], ["Compound", "Soft"], ["Mileage", "40,000 km"], ["Speed", "300 km/h"]] },
];

function Card({
  t,
  id,
  flipped,
  onFlip,
}: {
  t: Tyre;
  id: string;
  flipped: boolean;
  onFlip: (id: string | null) => void;
}) {
  return (
    <div
      className="card-3d group relative h-[360px] w-[260px] shrink-0 select-none transition-transform duration-200 hover:z-20 sm:h-[380px] sm:w-[280px] md:hover:scale-[1.06]"
      onMouseLeave={() => flipped && onFlip(null)} // moving the mouse away flips it back
    >
      <div className={`card-inner relative h-full w-full ${flipped ? "is-flipped" : ""}`}>
        {/* FRONT */}
        <div className="card-face absolute inset-0 overflow-hidden rounded-3xl glass">
          <div className="absolute inset-0" style={{ background: "radial-gradient(120% 80% at 50% 0%, rgba(255,106,26,0.18), transparent 60%)" }} />
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onFlip(id); }}
            className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/40 text-white/70 backdrop-blur transition hover:border-flame hover:text-flame"
            aria-label="Show details"
          >
            ⤢
          </button>
          <div className="relative grid h-[215px] place-items-center p-4 sm:h-[230px]">
            <img src="/cards/grip93-34.webp" alt={`GRIP 93 ${t.name}`} className="max-h-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)]" draggable={false} />
          </div>
          <div className="relative px-5">
            <div className="font-display text-xs font-bold uppercase tracking-[0.2em] text-flame">{t.tag}</div>
            <h3 className="font-display mt-1 text-2xl font-extrabold leading-none">GRIP 93 <span className="text-white/90">{t.name}</span></h3>
            <div className="mt-2 text-sm text-white/50">{t.size}</div>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-display text-2xl font-extrabold">${t.price}</span>
              <span className="rounded-lg bg-flame px-4 py-2 font-display text-xs font-bold uppercase tracking-wide text-[#120a04]">Shop</span>
            </div>
          </div>
        </div>
        {/* BACK */}
        <div className="card-face card-back absolute inset-0 overflow-hidden rounded-3xl glass">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onFlip(null); }}
            className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/40 text-white/70 backdrop-blur transition hover:border-flame hover:text-flame"
            aria-label="Back"
          >
            ↩
          </button>
          <div className="flex h-full flex-col p-6">
            <div className="font-display text-xs font-bold uppercase tracking-[0.2em] text-flame">GRIP 93 {t.name}</div>
            <h3 className="font-display mt-1 text-xl font-extrabold">Specifications</h3>
            <div className="mt-4 space-y-3">
              {t.specs.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b hairline pb-2 text-sm">
                  <span className="text-white/50">{k}</span>
                  <span className="font-display font-bold">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto flex items-center justify-between pt-4">
              <span className="font-display text-2xl font-extrabold">${t.price}</span>
              <a href="#" className="rounded-lg bg-flame px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-[#120a04] shadow-flame transition hover:bg-flame-light">Shop Now →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Marquee({
  rowId,
  items,
  dir,
  speed = 45,
  flipped,
  onFlip,
}: {
  rowId: string;
  items: Tyre[];
  dir: 1 | -1;
  speed?: number;
  flipped: string | null;
  onFlip: (id: string | null) => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const setW = useRef(0);
  const paused = useRef(false);
  const drag = useRef({ active: false, lastX: 0 });

  useEffect(() => {
    const measure = () => { if (track.current) setW.current = track.current.scrollWidth / 2; };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);

    let raf = 0, last = performance.now();
    const wrap = (x: number) => {
      const w = setW.current || 1;
      while (x <= -w) x += w;
      while (x > 0) x -= w;
      return x;
    };
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!paused.current && !drag.current.active) offset.current += dir * speed * dt;
      offset.current = wrap(offset.current);
      if (track.current) track.current.style.transform = `translate3d(${offset.current}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [dir, speed]);

  const onDown = (e: React.PointerEvent) => {
    drag.current = { active: true, lastX: e.clientX };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    offset.current += e.clientX - drag.current.lastX;
    drag.current.lastX = e.clientX;
  };
  const onUp = () => (drag.current.active = false);

  return (
    <div
      className="cursor-grab overflow-hidden active:cursor-grabbing"
      style={{ touchAction: "pan-y" }}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => { paused.current = false; drag.current.active = false; }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <div ref={track} className="flex w-max gap-4 py-4 will-change-transform sm:gap-5">
        {[...items, ...items].map((t, i) => {
          const id = `${rowId}-${i}`;
          return <Card key={id} id={id} t={t} flipped={flipped === id} onFlip={onFlip} />;
        })}
      </div>
    </div>
  );
}

export default function ShopTyres() {
  const [flipped, setFlipped] = useState<string | null>(null);
  return (
    <section id="shop" className="relative z-20 overflow-hidden py-20 sm:py-28">
      <div className="reveal mx-auto mb-10 max-w-7xl px-6 sm:mb-12">
        <div className="font-display text-sm font-bold uppercase tracking-[0.26em] text-flame">The Range</div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl font-extrabold md:text-6xl">Shop Tyres</h2>
          <p className="max-w-md text-sm text-white/55 sm:text-base">Hover to pause · drag to browse · tap the corner of a card for full specs.</p>
        </div>
      </div>
      <div className="space-y-4 sm:space-y-5">
        <Marquee rowId="a" items={TYRES} dir={-1} flipped={flipped} onFlip={setFlipped} />
        <Marquee rowId="b" items={[...TYRES].reverse()} dir={1} flipped={flipped} onFlip={setFlipped} />
      </div>
    </section>
  );
}
