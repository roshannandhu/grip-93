"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ShopTyres from "@/components/ShopTyres";
import IntroSplash from "@/components/IntroSplash";
import type { IntroState } from "@/components/TyreStage";
import { useMarket } from "@/lib/store";

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
  const { cartCount, openCart } = useMarket();
  const introRef = useRef<IntroState>({ active: false, t: 0, kick: 0 });
  const endedRef = useRef(false);
  const [phase, setPhase] = useState<"boot" | "intro" | "reveal" | "done">("boot");

  const unlockScroll = () => {
    document.body.style.overflow = "";
    (window as unknown as { __lenis?: Lenis }).__lenis?.start();
  };

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
    (window as unknown as { __lenis?: Lenis }).__lenis?.stop();
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    // safety: if the page unmounts mid-intro, never leave it scroll-locked
    return () => unlockScroll();
  }, []);

  // idempotent — runs once whether via timeline completion or the safety timer
  const endIntro = () => {
    if (endedRef.current) return;
    endedRef.current = true;
    sessionStorage.setItem("grip93-intro", "1");
    introRef.current.active = false;
    unlockScroll();
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

      {/* cinematic intro splash (once per session) — stays mounted through the reveal morph */}
      {(phase === "intro" || phase === "reveal") && (
        <IntroSplash introRef={introRef} onReveal={() => setPhase("reveal")} onDone={endIntro} />
      )}

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
          <nav className="hidden items-center gap-1 md:flex">
            {[["Shop", "/shop"], ["About Us", "/about"], ["Contact Us", "/contact"], ["Compare", "/compare"]].map(([label, href]) => (
              <a key={href} href={href} className="rounded-lg px-3 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white">{label}</a>
            ))}
            <div className="group relative">
              <button className="rounded-lg px-3 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white">Account ▾</button>
              <div className="invisible absolute right-0 top-full pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
                <div className="w-44 rounded-xl glass p-2">
                  {[["Dashboard", "/account"], ["Orders", "/account/orders"], ["Warranty", "/account/warranty"], ["Wishlist", "/wishlist"]].map(([label, href]) => (
                    <a key={href} href={href} className="block rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-flame">{label}</a>
                  ))}
                </div>
              </div>
            </div>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={openCart} className="relative grid h-9 w-9 place-items-center rounded-lg text-white/70 transition hover:bg-white/5 hover:text-flame" aria-label="Cart">
              🛒
              {cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-flame px-1 text-[10px] font-bold text-[#120a04]">{cartCount}</span>}
            </button>
            <a href="/shop" className="hidden rounded-lg bg-flame px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-[#120a04] shadow-flame transition hover:bg-flame-light sm:block">Shop Now</a>
            <button className="flex flex-col gap-1.5 p-2 md:hidden" onClick={() => setMenu((m) => !m)} aria-label="Menu">
              <span className="h-0.5 w-6 bg-white" /><span className="h-0.5 w-6 bg-white" /><span className="h-0.5 w-6 bg-white" />
            </button>
          </div>
        </div>
        {menu && (
          <div className="mx-4 mt-2 rounded-xl glass p-2 md:hidden">
            {[["Shop", "/shop"], ["About Us", "/about"], ["Contact Us", "/contact"], ["Compare", "/compare"], ["Dashboard", "/account"], ["Orders", "/account/orders"], ["Warranty", "/account/warranty"], ["Wishlist", "/wishlist"]].map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenu(false)} className="block rounded-lg px-4 py-3 text-white/70">{label}</a>
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
            style={{ opacity: phase === "reveal" || phase === "done" ? 1 : 0, transition: "opacity .6s ease" }}
          >
            <div>
              <div className="font-display text-xs font-bold uppercase tracking-[0.4em] text-flame">Performance Tyre Co. · Est. 1993</div>
              <h1 id="hero-title" className="font-display mt-3 text-[clamp(3rem,13vw,10rem)] font-extrabold leading-[0.95] pb-[0.12em] pr-[0.06em] text-glow">
                GRIP <span className="flame-text inline-block pr-[0.12em]">93</span>
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

          {/* FEATURES — desktop: tyre slides right, cards left · phone: tyre up, cards in bottom glass */}
          <section id="features" className="relative flex min-h-screen items-end px-4 pb-[7vh] md:items-center md:px-6 md:pb-0">
            <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-ink-800/55 p-5 backdrop-blur md:w-[52%] md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-0">
              <div className="reveal font-display text-sm font-bold uppercase tracking-[0.26em] text-flame">Engineering</div>
              <h2 className="reveal font-display mt-2 text-3xl font-extrabold md:mt-3 md:text-5xl">Built To Perform</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 md:mt-8 md:gap-4">
                {FEATURES.map((f) => (
                  <div key={f.t} className="reveal rounded-2xl glass p-4 transition md:p-6">
                    <div className="font-display text-xl text-flame md:text-2xl">{f.i}</div>
                    <h3 className="font-display mt-2 text-lg font-bold md:mt-3 md:text-xl">{f.t}</h3>
                    <p className="mt-1.5 text-xs text-white/60 md:mt-2 md:text-sm">{f.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* JOURNEY — desktop: copy right · phone: tyre up, copy in bottom glass card */}
          <section className="relative flex min-h-screen items-end justify-end px-4 pb-[7vh] md:items-center md:px-6 md:pb-0">
            <div className="reveal w-full max-w-md rounded-3xl glass p-5 text-right md:w-[44%] md:p-7">
              <div className="font-display text-sm font-bold uppercase tracking-[0.26em] text-flame">The Journey</div>
              <h2 className="font-display mt-2 text-3xl font-extrabold md:text-5xl">Built For Every Machine</h2>
              <p className="mt-4 text-white/65">From race-bred sports cars to loaded SUVs and lean-confident motorcycles — one compound, engineered to grip every road, in every season.</p>
            </div>
          </section>
        </div>

        {/* SHOP TYRES — looping flip cards (rotation has ended; tyre canvas fades out) */}
        <ShopTyres />

        {/* PERFORMANCE */}
        <section id="performance" className="relative z-20 mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <div className="reveal mx-auto mb-14 max-w-2xl text-center">
            <div className="font-display text-sm font-bold uppercase tracking-[0.26em] text-flame">Tested · Rated · Proven</div>
            <h2 className="font-display mt-3 text-4xl font-extrabold md:text-5xl">Performance Ratings</h2>
            <p className="mt-3 text-white/60">Independently scored across the metrics that define a great tyre.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {RINGS.map((r) => (
              <div key={r.t} data-ring={r.s} className="reveal rounded-2xl glass p-5 text-center sm:p-8">
                <div className="relative mx-auto aspect-square w-[110px] sm:w-[140px]">
                  <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
                    <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="11" />
                    <circle className="ring-bar" cx="70" cy="70" r="60" fill="none" stroke="var(--flame)" strokeWidth="11" strokeLinecap="round" strokeDasharray={2 * Math.PI * 60} strokeDashoffset={2 * Math.PI * 60} style={{ filter: "drop-shadow(0 0 6px rgba(255,106,26,0.5))" }} />
                  </svg>
                  <div className="ring-val font-display absolute inset-0 grid place-items-center text-3xl font-extrabold sm:text-4xl">0.0</div>
                </div>
                <h3 className="font-display mt-3 text-xl font-bold sm:mt-4 sm:text-2xl">{r.t}</h3>
                <p className="mt-1 text-xs text-white/55 sm:text-sm">{r.d}</p>
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
        <section className="relative z-20 overflow-hidden px-6 py-24 text-center sm:py-32">
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
