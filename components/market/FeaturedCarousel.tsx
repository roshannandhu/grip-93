"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Listing } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { useMarket } from "@/lib/store";
import TyreImage from "./TyreImage";
import GradeBadge from "./GradeBadge";

export default function FeaturedCarousel({ listings }: { listings: Listing[] }) {
  const { addToCart, openCart } = useMarket();
  const [i, setI] = useState(0);
  const paused = useRef(false);
  const n = listings.length;

  useEffect(() => {
    if (n <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!paused.current) setI((v) => (v + 1) % n);
    }, 5000);
    return () => clearInterval(id);
  }, [n]);

  if (n === 0) return null;
  const go = (d: number) => setI((v) => (v + d + n) % n);

  return (
    <div
      className="relative mb-8 overflow-hidden rounded-3xl glass"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div style={{ background: "radial-gradient(circle at 80% 0%, rgba(255,106,26,0.16), transparent 55%)" }}>
        {/* slides stacked + crossfaded */}
        <div className="relative min-h-[300px] md:min-h-[320px]">
          {listings.map((l, idx) => (
            <div
              key={l.id}
              className="absolute inset-0 grid items-center gap-6 p-6 transition-opacity duration-700 md:grid-cols-[300px_1fr] md:p-8"
              style={{ opacity: idx === i ? 1 : 0, pointerEvents: idx === i ? "auto" : "none" }}
              aria-hidden={idx !== i}
            >
              <Link href={`/tyre/${l.id}`} className="block">
                <TyreImage listing={l} className="aspect-square w-full max-w-[260px] md:max-w-none" />
              </Link>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-flame/40 bg-flame/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-wide text-flame">★ Featured</span>
                  <GradeBadge grade={l.grade} />
                </div>
                <Link href={`/tyre/${l.id}`} className="block">
                  <h2 className="font-display mt-3 text-2xl font-extrabold md:text-4xl">{l.brand} {l.model}</h2>
                  <div className="mt-1 font-display text-sm text-flame md:text-base">{l.sizeLabel} · {l.loadIndex}{l.speedRating} · {l.treadMm}mm · {l.dotYear}</div>
                </Link>
                <p className="mt-3 hidden max-w-lg text-sm text-white/60 sm:block">Inspected &amp; graded {l.grade}. {l.defects[0]}. Delivered to your pincode with a 7-day warranty.</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="font-display text-2xl font-extrabold md:text-3xl">{formatINR(l.priceINR)}</span>
                  <button onClick={() => { addToCart(l.id); openCart(); }} className="rounded-lg bg-flame px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-[#120a04] shadow-flame transition hover:bg-flame-light md:px-6 md:py-3">Add to cart</button>
                  <Link href={`/tyre/${l.id}`} className="rounded-lg border border-white/20 px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-white transition hover:border-flame hover:text-flame md:px-6 md:py-3">View details →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* arrows */}
      {n > 1 && (
        <>
          <button onClick={() => go(-1)} className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur transition hover:border-flame hover:text-flame" aria-label="Previous">‹</button>
          <button onClick={() => go(1)} className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur transition hover:border-flame hover:text-flame" aria-label="Next">›</button>
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {listings.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-flame" : "w-1.5 bg-white/30 hover:bg-white/60"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
