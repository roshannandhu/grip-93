"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ShopTyres from "@/components/ShopTyres";
import IntroSplash from "@/components/IntroSplash";
import type { IntroState } from "@/components/TyreStage";

const TyreStage = dynamic(() => import("@/components/TyreStage"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { t: "Strong Grip", d: "High-silica compound bites cold or hot tarmac for shorter stops and surefooted cornering.", i: "◎" },
  { t: "Long Life", d: "Reinforced steel-belt casing delivers up to 70,000 km of dependable mileage.", i: "∞" },
  { t: "Road Safety", d: "Run-flat construction and class-A wet braking keep you in control when it matters.", i: "✦" },
  { t: "All-Weather", d: "Aqua-channel tread clears water fast and grips in heat, rain and cold — year-round.", i: "❉" },
];
const RINGS = [
  { t: "Grip", s: 96, d: "Dry & wet traction" },
  { t: "Durability", s: 94, d: "Casing & build" },
  { t: "Mileage", s: 92, d: "Tread life & wear" },
  { t: "Safety", s: 97, d: "Braking & stability" },
];
const SPECS = [
  ["Size", "225/45 R17"],
  ["Load · Speed", "94W XL"],
  ["Tread depth", "8.2 mm"],
  ["Wet grade", "A"],
  ["Warranty", "70,000 km"],
];

type Lenis = { stop: () => void; start: () => void };

export default function Page() {
  const [menu, setMenu] = useState(false);
  const introRef = useRef<IntroState>({ active: false, t: 0, kick: 0 });
  const [phase, setPhase] = useState<"boot" | "intro" | "done">("boot");

  // decide intro vs skip (once per session, respect reduced motion) + lock scroll while playing
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("grip93-intro");
    if (reduce || seen || window.location.hash) {
      setPhase("done");
      return;
    }
    introRef.current.active = true;
    setPhase("intro");
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
  }, []);

  const endIntro = () => {
    sessionStorage.setItem("grip93-intro", "1");
    document.body.style.overflow = "";
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    lenis?.start();
    window.scrollTo(0, 0);
    setPhase("done");
  };

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!window.location.hash) window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%" },
        });
      });

      const C = 2 * Math.PI * 60;
      gsap.utils.toArray<HTMLElement>("[data-ring]").forEach((el) => {
        const score = +el.dataset.ring!;
        const bar = el.querySelector<SVGCircleElement>(".ring-bar");
        const val = el.querySelector<HTMLElement>(".ring-val");
        ScrollTrigger.create({
          trigger: el, start: "top 82%", once: true,
          onEnter: () => {
            if (bar) gsap.fromTo(bar, { strokeDashoffset: C }, { strokeDashoffset: C * (1 - score / 100), duration: 1.4, ease: "power2.out" });
            if (val) {
              const obj = { v: 0 };
              gsap.to(obj, { v: score, duration: 1.4, ease: "power2.out", onUpdate: () => { val.textContent = (obj.v / 10).toFixed(1); } });
            }
          },
        });
      });

      const prog = document.getElementById("prog");
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => { if (prog) prog.style.height = `${s.progress * 100}%`; } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ambient backdrop (CSS only) */}
      <div className="fixed inset-0 z-0" style={{ background: "radial-gradient(ellipse 75% 65% at 50% 32%, #1a120b 0%, #0b0907 45%, #070708 75%)" }} />
      <TyreStage introRef={introRef} />
      <div className="grid-overlay pointer-events-none fixed inset-0 z-[5]" />
      <div className="vignette pointer-events-none fixed inset-0 z-[6]" />

      {/* cinematic intro splash (once per session) */}
      {phase === "intro" && <IntroSplash introRef={introRef} onDone={endIntro} />}

      {/* scroll progress */}
      <div className="fixed right-0 top-0 z-50 h-screen w-[2px] bg-white/5">
        <div id="prog" className="w-full bg-gradient-to-b from-flame to-flame-light shadow-flame" style={{ height: 0 }} />
      </div>

      {/* nav */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto mt-3 flex h-[60px] max-w-7xl items-center justify-between rounded-2xl glass px-5">
          <a href="#home" className="flex items-center gap-2.5 font-display text-2xl font-extrabold">
            <span className="grid h-8 w-8 place-items-center rounded-full border-[3px] border-flame shadow-flame">
              <span className="h-2.5 w-2.5 rounded-full bg-white" />
            </span>
            GRIP <span className="text-flame">93</span>
          </a>
          <nav className="hidden gap-1 md:flex">
            {["Features", "Shop", "Performance", "Specs"].map((x) => (
              <a key={x} href={`#${x === "Shop" ? "shop" : x.toLowerCase()}`} className="rounded-lg px-3 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white">{x}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a href="#" className="rounded-lg bg-flame px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-[#120a04] shadow-flame transition hover:bg-flame-light">Shop Now</a>
            <button className="flex flex-col gap-1.5 p-2 md:hidden" onClick={() => setMenu((m) => !m)} aria-label="Menu">
              <span className="h-0.5 w-6 bg-white" /><span className="h-0.5 w-6 bg-white" /><span className="h-0.5 w-6 bg-white" />
            </button>
          </div>
        </div>
        {menu && (
          <div className="mx-4 mt-2 rounded-xl glass p-2 md:hidden">
            {["Features", "Shop", "Performance", "Specs"].map((x) => (
              <a key={x} href={`#${x === "Shop" ? "shop" : x.toLowerCase()}`} onClick={() => setMenu(false)} className="block rounded-lg px-4 py-3 text-white/70">{x}</a>
            ))}
          </div>
        )}
      </header>

      <main className="relative z-20">
        {/* CHOREOGRAPHY RANGE — the pinned 3D tyre travels & spins across these screens */}
        <div id="stage">
          {/* HERO */}
          <section
            id="home"
            className="relative flex min-h-screen flex-col items-center justify-between px-4 pb-[8vh] pt-[calc(72px+5vh)] text-center"
            style={{ opacity: phase === "done" ? 1 : 0, transition: "opacity .8s ease" }}
          >
            <div>
              <div className="font-display text-xs font-bold uppercase tracking-[0.4em] text-flame">Performance Tyre Co. · Est. 1993</div>
              <h1 className="font-display mt-3 text-[clamp(3rem,13vw,10rem)] font-extrabold leading-[0.82] text-glow">
                GRIP <span className="flame-text">93</span>
              </h1>
            </div>
            <div>
              <div className="font-display text-[clamp(1rem,2.4vw,1.6rem)] font-medium uppercase tracking-[0.18em] text-white/90">One Tyre. Every Journey.</div>
              <div className="mt-6 flex flex-wrap justify-center gap-3.5">
                <a href="#shop" className="rounded-lg bg-flame px-7 py-3.5 font-display font-bold uppercase tracking-wide text-[#120a04] shadow-flame transition hover:bg-flame-light">Shop Tyres →</a>
                <a href="#features" className="rounded-lg border border-white/20 px-7 py-3.5 font-display font-bold uppercase tracking-wide text-white transition hover:border-flame hover:text-flame">Features</a>
              </div>
              <div className="mt-8 font-display text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll to spin ↓</div>
            </div>
          </section>

          {/* FEATURES — tyre slides right, cards on the left */}
          <section id="features" className="relative flex min-h-screen items-center px-6">
            <div className="w-full max-w-xl md:w-[52%]">
              <div className="reveal font-display text-sm font-bold uppercase tracking-[0.26em] text-flame">Engineering</div>
              <h2 className="reveal font-display mt-3 text-4xl font-extrabold md:text-5xl">Built To Perform</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {FEATURES.map((f) => (
                  <div key={f.t} className="reveal rounded-2xl glass p-6 transition">
                    <div className="font-display text-2xl text-flame">{f.i}</div>
                    <h3 className="font-display mt-3 text-xl font-bold">{f.t}</h3>
                    <p className="mt-2 text-sm text-white/60">{f.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* JOURNEY — copy on the right (glass for legibility over the tyre) */}
          <section className="relative flex min-h-screen items-center justify-end px-6">
            <div className="reveal w-full max-w-md rounded-3xl glass p-7 text-right md:w-[44%]">
              <div className="font-display text-sm font-bold uppercase tracking-[0.26em] text-flame">The Journey</div>
              <h2 className="font-display mt-2 text-3xl font-extrabold md:text-5xl">Built For Every Machine</h2>
              <p className="mt-4 text-white/65">From race-bred sports cars to loaded SUVs and lean-confident motorcycles — one compound, engineered to grip every road, in every season.</p>
            </div>
          </section>
        </div>

        {/* SHOP TYRES — looping flip cards (rotation has ended; tyre canvas fades out) */}
        <ShopTyres />

        {/* PERFORMANCE */}
        <section id="performance" className="relative z-20 mx-auto max-w-7xl px-6 py-28">
          <div className="reveal mx-auto mb-14 max-w-2xl text-center">
            <div className="font-display text-sm font-bold uppercase tracking-[0.26em] text-flame">Tested · Rated · Proven</div>
            <h2 className="font-display mt-3 text-4xl font-extrabold md:text-5xl">Performance Ratings</h2>
            <p className="mt-3 text-white/60">Independently scored across the metrics that define a great tyre.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {RINGS.map((r) => (
              <div key={r.t} data-ring={r.s} className="reveal rounded-2xl glass p-8 text-center">
                <div className="relative mx-auto h-[140px] w-[140px]">
                  <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
                    <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="11" />
                    <circle className="ring-bar" cx="70" cy="70" r="60" fill="none" stroke="var(--flame)" strokeWidth="11" strokeLinecap="round" strokeDasharray={2 * Math.PI * 60} strokeDashoffset={2 * Math.PI * 60} style={{ filter: "drop-shadow(0 0 6px rgba(255,106,26,0.5))" }} />
                  </svg>
                  <div className="ring-val font-display absolute inset-0 grid place-items-center text-4xl font-extrabold">0.0</div>
                </div>
                <h3 className="font-display mt-4 text-2xl font-bold">{r.t}</h3>
                <p className="mt-1 text-sm text-white/55">{r.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SPECS */}
        <section id="specs" className="relative z-20 mx-auto max-w-3xl px-6 py-20">
          <div className="reveal mb-10 text-center">
            <div className="font-display text-sm font-bold uppercase tracking-[0.26em] text-flame">The Numbers</div>
            <h2 className="font-display mt-3 text-4xl font-extrabold md:text-5xl">Specifications</h2>
          </div>
          <div className="reveal overflow-hidden rounded-2xl glass">
            {SPECS.map(([k, v], i) => (
              <div key={k} className={`flex items-center justify-between px-6 py-5 ${i ? "border-t hairline" : ""}`}>
                <span className="text-white/55">{k}</span>
                <span className="font-display text-lg font-bold text-white">{v}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-20 overflow-hidden px-6 py-32 text-center">
          <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(circle at 50% 120%, rgba(255,106,26,0.28), transparent 60%)" }} />
          <h2 className="reveal font-display relative text-[clamp(2.6rem,8vw,6rem)] font-extrabold text-glow">One Tyre. Every Journey.</h2>
          <p className="reveal relative mx-auto mt-4 max-w-xl text-white/60">Join thousands of drivers who trust GRIP 93 for confidence in every corner.</p>
          <a href="#" className="reveal relative mt-8 inline-flex rounded-lg bg-flame px-8 py-4 font-display font-bold uppercase tracking-wide text-[#120a04] shadow-flame transition hover:bg-flame-light">Shop GRIP 93 →</a>
        </section>
      </main>

      <footer className="relative z-20 border-t hairline bg-ink-800/80 px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-white/40 md:flex-row">
          <span>© 2026 GRIP 93 Performance Tyre Co.</span>
          <span className="font-display uppercase tracking-widest">One Tyre. Every Journey.</span>
        </div>
      </footer>
    </>
  );
}
