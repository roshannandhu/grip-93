"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { IntroState } from "./TyreStage";

/**
 * Cinematic intro: the live 3D tyre (in TyreStage, behind this overlay) rolls into center while
 * "GRIP" flies in from the left and "93" from the right. On impact: smoke burst + flame shockwave
 * ring + screen shake + a tyre recoil kick. Then everything settles and hands off to the hero.
 *
 * This overlay is transparent in the middle so the real tyre shows through — there is no swap.
 * It drives `introRef` (read by TyreStage's Rig) and calls `onDone()` when finished/skipped.
 */
export default function IntroSplash({
  introRef,
  onDone,
}: {
  introRef: React.MutableRefObject<IntroState>;
  onDone: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const shake = useRef<HTMLDivElement>(null);
  const grip = useRef<HTMLSpanElement>(null);
  const nine = useRef<HTMLSpanElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const finished = useRef(false);

  // pre-computed turbulent smoke puffs (generated once) — varied size/drift/timing reads organic
  const puffs = useRef(
    Array.from({ length: 22 }, () => {
      const ang = Math.random() * Math.PI * 2;
      const dist = 6 + Math.random() * 70;
      return {
        x: Math.cos(ang) * dist,
        y: Math.sin(ang) * dist * 0.55, // flatter spread near the ground
        size: 130 + Math.random() * 230,
        blur: 12 + Math.random() * 20,
        delay: Math.random() * 0.28,
        dur: 1.3 + Math.random() * 1.2,
        riseY: -(130 + Math.random() * 220),
        swayX: (Math.random() - 0.5) * 110,
        scaleTo: 2.1 + Math.random() * 2.2,
        peak: 0.22 + Math.random() * 0.38,
        rot: (Math.random() - 0.5) * 90,
      };
    })
  ).current;

  useEffect(() => {
    introRef.current.active = true;
    introRef.current.t = 0;
    introRef.current.kick = 0;

    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      introRef.current.active = false;
      introRef.current.t = 1;
      onDone();
    };
    // safety net: always hand off even if gsap's rAF is throttled (e.g. backgrounded tab)
    const guard = window.setTimeout(finish, 3600);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: finish });
      tlRef.current = tl;

      // 1) tyre rolls in (drives the 3D Rig via introRef.t)
      tl.fromTo(introRef.current, { t: 0 }, { t: 1, duration: 1.5, ease: "power3.out" }, 0);

      // 2) text flies in from both sides, accelerating toward center
      tl.fromTo(grip.current, { xPercent: -260, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.85, ease: "power3.in" }, 0.55);
      tl.fromTo(nine.current, { xPercent: 260, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.85, ease: "power3.in" }, 0.55);

      // 3) IMPACT (~1.4s): recoil + shockwave + smoke + screen shake
      tl.add(() => {
        introRef.current.kick = 1;
      }, 1.4);

      tl.fromTo(
        ring.current,
        { scale: 0, opacity: 0.95 },
        { scale: 9, opacity: 0, duration: 0.7, ease: "power2.out" },
        1.4
      );

      // turbulent billowing smoke: each puff drifts/sways/rotates on its own timing
      gsap.utils.toArray<HTMLElement>(".smoke-puff").forEach((el, i) => {
        const p = puffs[i];
        if (!p) return;
        const at = 1.4 + p.delay;
        tl.fromTo(
          el,
          { xPercent: -50, yPercent: -50, x: p.x, y: p.y, scale: 0.25, opacity: 0, rotation: 0 },
          { xPercent: -50, yPercent: -50, x: p.x + p.swayX, y: p.y + p.riseY, scale: p.scaleTo, opacity: p.peak, rotation: p.rot, duration: p.dur, ease: "power2.out" },
          at
        );
        tl.to(el, { opacity: 0, scale: p.scaleTo * 1.25, duration: 0.8, ease: "power1.in" }, at + p.dur * 0.5);
      });

      // tiny separation bounce on the text, then settle
      tl.to(grip.current, { xPercent: -4, duration: 0.08, yoyo: true, repeat: 1 }, 1.4);
      tl.to(nine.current, { xPercent: 4, duration: 0.08, yoyo: true, repeat: 1 }, 1.4);

      // screen shake
      if (shake.current) {
        tl.to(shake.current, {
          keyframes: { x: [0, -10, 9, -7, 5, -3, 0], y: [0, 6, -5, 4, -2, 1, 0] },
          duration: 0.45,
          ease: "power2.out",
        }, 1.4);
      }

      // 4) hand-off: fade the overlay out, revealing the hero over the same tyre
      tl.to(root.current, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, 2.2);
    }, root);

    return () => {
      window.clearTimeout(guard);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = () => {
    tlRef.current?.progress(1); // jump to end → onComplete → finish()
  };

  return (
    <div ref={root} className="fixed inset-0 z-50" style={{ background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(4,4,6,0.55))" }}>
      <div ref={shake} className="absolute inset-0 grid place-items-center">
        {/* impact fx anchored at center */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0">
          <div ref={ring} className="shock-ring left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2" style={{ position: "absolute" }} />
          {puffs.map((p, i) => (
            <div
              key={i}
              className="smoke-puff"
              style={{ width: p.size, height: p.size, filter: `blur(${p.blur}px)`, opacity: 0 }}
            />
          ))}
        </div>

        {/* colliding wordmark */}
        <h1 className="font-display relative z-10 flex items-center gap-3 text-[clamp(3rem,14vw,11rem)] font-extrabold leading-none text-glow">
          <span ref={grip} className="inline-block">GRIP</span>
          <span ref={nine} className="flame-text inline-block">93</span>
        </h1>
      </div>

      <button
        onClick={skip}
        className="absolute bottom-6 right-6 z-20 rounded-full border border-white/20 bg-black/40 px-5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.2em] text-white/70 backdrop-blur transition hover:border-flame hover:text-flame"
      >
        Skip →
      </button>
    </div>
  );
}
