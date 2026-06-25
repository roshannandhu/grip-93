"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, Sparkles } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import Tyre3D from "./Tyre3D";

gsap.registerPlugin(ScrollTrigger);

// Curated reveal over #stage progress p — centered, read DIRECTLY from scroll (no drift).
// yaw 0 = tread-forward, yaw ~0.85 = 3/4 (01_33_07), yaw π/2 = GRIP 93 sidewall (01_46_00).
const HALF_PI = Math.PI / 2;
const TURNS = 3; // whole turns of axle-roll across the scroll → lands upright on the sidewall
const KEYS = [
  { p: 0.0, yaw: 0.34, tilt: -0.22, s: 1.0 }, // tread-forward 3/4
  { p: 0.5, yaw: 0.85, tilt: -0.13, s: 1.0 }, // 3/4 hero
  { p: 1.0, yaw: HALF_PI, tilt: -0.05, s: 1.06 }, // GRIP 93 sidewall
];
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
function sample(p: number) {
  if (p <= KEYS[0].p) return KEYS[0];
  for (let i = 0; i < KEYS.length - 1; i++) {
    const a = KEYS[i], b = KEYS[i + 1];
    if (p <= b.p) {
      const t = smooth((p - a.p) / (b.p - a.p));
      return { yaw: lerp(a.yaw, b.yaw, t), tilt: lerp(a.tilt, b.tilt, t), s: lerp(a.s, b.s, t) };
    }
  }
  return KEYS[KEYS.length - 1];
}

// shared intro state, tweened by the IntroSplash GSAP timeline
export type IntroState = { active: boolean; t: number; kick: number };
const INTRO_X = -8; // off-screen left start
const ROLL_IN_TURNS = 3; // rolling spins resolving to upright as it arrives

// Responsive camera distance so the tyre always fits the viewport. A perspective camera's
// projected size is driven by viewport HEIGHT, but the sideways tyre is constrained by WIDTH —
// on tall/narrow phones it overflows. Pull the camera back based on the horizontal FOV (aspect),
// with extra margin in portrait so the tyre reads comfortably small on phones.
const VFOV = (42 * Math.PI) / 180;
const FIT_R = 2.7; // tyre bounding radius (world units)
function fitZ(aspect: number) {
  const hfov = 2 * Math.atan(Math.tan(VFOV / 2) * aspect);
  const minFov = Math.min(VFOV, hfov);
  const margin = aspect < 1 ? 1.25 : 1.08;
  const z = (FIT_R / Math.sin(minFov / 2)) * margin;
  return Math.max(6, Math.min(22, z));
}

function Rig({
  progress,
  introRef,
}: {
  progress: React.MutableRefObject<number>;
  introRef?: React.MutableRefObject<IntroState>;
}) {
  const pose = useRef<THREE.Group>(null); // tilt + scale (centered)
  const yaw = useRef<THREE.Group>(null); // vertical-axis turntable
  const roll = useRef<THREE.Group>(null); // axle spin (rolling)
  const { camera, size } = useThree();

  useFrame((_, dt) => {
    const g = pose.current, y = yaw.current, r = roll.current;
    if (!g || !y || !r) return;
    const d = Math.min(dt, 0.05);
    const k = 1 - Math.pow(0.001, d);
    const fz = fitZ(size.width / size.height); // responsive: keep the tyre in-frame on any device

    const intro = introRef?.current;
    if (intro?.active) {
      // CINEMATIC INTRO: roll in from off-left to the hero pose (t: 0→1, eased by GSAP).
      const tt = Math.max(0, Math.min(1, intro.t));
      const hero = sample(0);
      g.position.set(THREE.MathUtils.lerp(INTRO_X, 0, tt), 0, 0);
      intro.kick *= 1 - d * 6; // recoil decays
      g.scale.setScalar(THREE.MathUtils.lerp(0.62, hero.s, tt) * (1 + intro.kick * 0.07));
      g.rotation.x = THREE.MathUtils.lerp(-0.45, hero.tilt, tt);
      y.rotation.y = hero.yaw;
      r.rotation.x = -(1 - tt) * ROLL_IN_TURNS * Math.PI * 2; // rolling, lands upright at t=1
      camera.position.set(0, 0, fz);
      camera.lookAt(0, 0, 0);
      return;
    }

    // SCROLL-LOCKED: everything read directly from progress — no autonomous drift, no lag.
    const p = Math.max(0, Math.min(1, progress.current));
    const t = sample(p);
    g.position.set(0, 0, 0); // centered & pinned
    g.rotation.x = t.tilt;
    g.scale.setScalar(t.s);
    y.rotation.y = t.yaw; // turntable reveal (which face)
    // axle roll: accelerates with scroll (p^1.6) and is a whole number of turns → upright at p=1
    r.rotation.x = Math.pow(p, 1.6) * TURNS * Math.PI * 2;

    // ease camera to the responsive fit distance (centered)
    camera.position.x += (0 - camera.position.x) * k;
    camera.position.y += (0 - camera.position.y) * k;
    camera.position.z += (fz - camera.position.z) * k;
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={pose}>
      <group ref={yaw}>
        <group ref={roll}>
          {/* axle horizontal (along X); roll spins about it, yaw turns the whole thing */}
          <Tyre3D rotation={[0, 0, Math.PI / 2]} />
        </group>
      </group>
    </group>
  );
}

export default function TyreStage({ introRef }: { introRef?: React.MutableRefObject<IntroState> }) {
  const progress = useRef(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const sts: ScrollTrigger[] = [];
    // scroll → progress, and fade the tyre out once the rotation stage is scrolled past
    sts.push(
      ScrollTrigger.create({
        trigger: "#stage",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => (progress.current = self.progress),
        onLeave: () => setVisible(false),
        onEnterBack: () => setVisible(true),
      })
    );
    return () => sts.forEach((s) => s.kill());
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 7], fov: 42 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 7, 6]} intensity={3} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-6, 2, -4]} intensity={3.2} color="#ff8b3d" />
        <pointLight position={[-3, -3, 5]} intensity={0.7} color="#8fbcff" />
        <Suspense fallback={null}>
          <Rig progress={progress} introRef={introRef} />
          <Environment resolution={256}>
            <color attach="background" args={["#060607"]} />
            <Lightformer intensity={2.4} position={[0, 3, 2]} scale={[7, 2, 1]} color="#ffd9b0" />
            <Lightformer intensity={1.6} position={[-4, 1, 1]} scale={[3, 4, 1]} color="#ff8b3d" />
            <Lightformer intensity={1.2} position={[4, 0, 3]} scale={[3, 3, 1]} color="#aecbff" />
          </Environment>
        </Suspense>
        <Sparkles count={80} scale={[18, 11, 6]} size={3} speed={0.3} color="#ff8b3d" opacity={0.5} />
        <Sparkles count={45} scale={[20, 12, 7]} size={1.5} speed={0.2} color="#ffb27a" opacity={0.38} />
        <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={11} blur={2.8} far={5} />
      </Canvas>
    </div>
  );
}
