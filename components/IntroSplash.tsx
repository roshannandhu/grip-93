"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import type { IntroState } from "./TyreStage";

/**
 * Cinematic intro: the live 3D tyre (in TyreStage, behind this overlay) rolls into center while
 * "GRIP" flies in from the left and "93" from the right. On impact: a real particle smoke burst
 * (2D canvas, wispy sprite) + flame shockwave ring + screen shake + a tyre recoil kick. Then it
 * settles and hands off to the hero — same tyre throughout, no swap.
 */
type Particle = {
  x: number; y: number; vx: number; vy: number;
  size: number; grow: number; rot: number; vrot: number;
  life: number; max: number; peak: number; img: number;
};

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
  const canvas = useRef<HTMLCanvasElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const finished = useRef(false);
  const sprites = useRef<HTMLImageElement[]>([]);
  const raf = useRef(0);

  useLayoutEffect(() => {
    introRef.current.active = true;
    introRef.current.t = 0;
    introRef.current.kick = 0;
    sprites.current = ["/fx/smoke.png", "/fx/smoke2.png"].map((src) => {
      const im = new Image();
      im.src = src;
      im.decode?.().catch(() => {});
      return im;
    });

    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      introRef.current.active = false;
      introRef.current.t = 1;
      onDone();
    };
    // safety net: always hand off even if gsap's rAF is throttled (e.g. backgrounded tab)
    const guard = window.setTimeout(finish, 3800);

    // ---- real smoke: 2D-canvas particle burst fired at impact ----
    const startSmoke = () => {
      const cv = canvas.current;
      const ctx = cv?.getContext("2d");
      if (!cv || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = window.innerWidth, H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = `${W}px`; cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // emit from the SEAM between "GRIP" and "93" (where they hit), not the whole screen center
      const gr = grip.current?.getBoundingClientRect();
      const nr = nine.current?.getBoundingClientRect();
      const cx = gr && nr ? (gr.right + nr.left) / 2 : W / 2;
      const cy = gr ? (gr.top + gr.bottom) / 2 : H / 2;

      const ps: Particle[] = [];
      for (let i = 0; i < 55; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 30 + Math.random() * 150;
        ps.push({
          x: cx + (Math.random() - 0.5) * 26, // tight horizontal band at the seam
          y: cy + (Math.random() - 0.5) * 16,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd * 0.5 - (60 + Math.random() * 110), // gentle outward + rise
          size: 40 + Math.random() * 90,
          grow: 70 + Math.random() * 130,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 1.2,
          life: 0,
          max: 0.9 + Math.random() * 0.9, // short-lived puff
          peak: 0.1 + Math.random() * 0.18, // light / airy
          img: Math.random() < 0.5 ? 0 : 1,
        });
      }

      let last = performance.now();
      const loop = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = "screen"; // light, airy wisps that don't occlude the words
        let alive = 0;
        for (const p of ps) {
          if (p.life >= p.max) continue;
          alive++;
          p.vx += (Math.random() - 0.5) * 140 * dt; // turbulence
          p.vy += (Math.random() - 0.5) * 140 * dt - 45 * dt; // turbulence + keep rising
          p.vx *= 1 - 0.6 * dt;
          p.vy *= 1 - 0.5 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.size += p.grow * dt;
          p.rot += p.vrot * dt;
          p.life += dt;
          const a = p.peak * Math.sin(Math.min(p.life / p.max, 1) * Math.PI); // ramp up then fade
          if (a <= 0) continue;
          ctx.globalAlpha = a;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          const img = sprites.current[p.img];
          if (img && img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, -p.size / 2, -p.size / 2, p.size, p.size);
          } else {
            // fallback (before the sprite decodes): soft turbulent-ish radial puff
            const r = p.size / 2;
            const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
            g.addColorStop(0, "rgba(225,225,230,0.5)");
            g.addColorStop(0.5, "rgba(190,190,200,0.22)");
            g.addColorStop(1, "rgba(170,170,180,0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
        ctx.globalAlpha = 1;
        if (alive > 0) raf.current = requestAnimationFrame(loop);
        else ctx.clearRect(0, 0, W, H);
      };
      raf.current = requestAnimationFrame(loop);
    };

    const ctx = gsap.context(() => {
      // initial hidden states — guarantees no first-frame flash before the timeline runs
      gsap.set([grip.current, nine.current], { opacity: 0 });
      gsap.set(ring.current, { opacity: 0, scale: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: finish });
      tlRef.current = tl;

      // 1) tyre rolls in (drives the 3D Rig via introRef.t)
      tl.fromTo(introRef.current, { t: 0 }, { t: 1, duration: 1.5, ease: "power3.out" }, 0);

      // 2) text flies in from both sides, accelerating toward center
      tl.fromTo(grip.current, { xPercent: -260, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.85, ease: "power3.in" }, 0.55);
      tl.fromTo(nine.current, { xPercent: 260, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.85, ease: "power3.in" }, 0.55);

      // 3) IMPACT (~1.4s): recoil + smoke burst + shockwave + screen shake
      tl.add(() => {
        introRef.current.kick = 1;
        startSmoke();
      }, 1.4);
      tl.fromTo(ring.current, { scale: 0, opacity: 0.95 }, { scale: 9, opacity: 0, duration: 0.7, ease: "power2.out" }, 1.4);
      tl.to(grip.current, { xPercent: -4, duration: 0.08, yoyo: true, repeat: 1 }, 1.4);
      tl.to(nine.current, { xPercent: 4, duration: 0.08, yoyo: true, repeat: 1 }, 1.4);
      if (shake.current) {
        tl.to(shake.current, {
          keyframes: { x: [0, -10, 9, -7, 5, -3, 0], y: [0, 6, -5, 4, -2, 1, 0] },
          duration: 0.45,
          ease: "power2.out",
        }, 1.4);
      }

      // 4) hand-off: fade the overlay out, revealing the hero over the same tyre
      tl.to(root.current, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, 2.35);
    }, root);

    return () => {
      window.clearTimeout(guard);
      cancelAnimationFrame(raf.current);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = () => {
    tlRef.current?.progress(1); // jump to end → onComplete → finish()
  };

  return (
    <div ref={root} className="fixed inset-0 z-50" style={{ background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 42%, rgba(4,4,6,0.55))" }}>
      <div ref={shake} className="absolute inset-0">
        <canvas ref={canvas} className="pointer-events-none absolute inset-0" />
        <div className="absolute inset-0 grid place-items-center">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0">
            <div ref={ring} className="shock-ring absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2" style={{ opacity: 0 }} />
          </div>
          <h1 className="font-display relative z-10 flex items-center gap-3 text-[clamp(3rem,14vw,11rem)] font-extrabold leading-none text-glow">
            <span ref={grip} className="inline-block" style={{ opacity: 0 }}>GRIP</span>
            <span ref={nine} className="flame-text inline-block" style={{ opacity: 0 }}>93</span>
          </h1>
        </div>
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
