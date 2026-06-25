"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

/**
 * Accurate 3D GRIP 93 tyre, textured from the studio references:
 *   - tread band  -> cylinder, tread.webp tiled around the circumference
 *   - sidewalls   -> domed lathe discs with planar UVs so the face-on sidewall.webp
 *                    (GRIP 93 + markings) maps straight onto the disc, aligned by radius
 *   - bore        -> dark inner hole wall
 *
 * Built with the axle along +Y; the parent orients/spins it.
 */

const OUTER_R = 2.3; // tread radius
const INNER_R = OUTER_R * 0.561; // bead/bore radius — matches the reference inner-hole ratio
const TREAD_H = 1.0; // tread band width (axial)
const INNER_RATIO = 0.6; // start sampling just inside the opaque branding ring

// front sidewall cross-section (radius, axial y): shoulder -> bulge -> bead
const SIDE_PROFILE: [number, number][] = [
  [OUTER_R, TREAD_H / 2],
  [OUTER_R - 0.05, 0.6],
  [OUTER_R - 0.32, 0.655],
  [OUTER_R - 0.78, 0.64],
  [INNER_R + 0.18, 0.575],
  [INNER_R, 0.5],
];

/** Lathe the sidewall profile, then overwrite UVs with a planar disc projection. */
function sidewallGeometry(mirror: boolean) {
  const pts = SIDE_PROFILE.map(([r, y]) => new THREE.Vector2(r, y));
  const geo = new THREE.LatheGeometry(pts, 200);
  const pos = geo.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const r = Math.hypot(x, z);
    const theta = Math.atan2(z, x);
    const nr = THREE.MathUtils.clamp((r - INNER_R) / (OUTER_R - INNER_R), 0, 1);
    const imgR = INNER_RATIO + nr * (1 - INNER_RATIO); // radius in the square texture (0..1 across)
    const cu = (mirror ? -1 : 1) * Math.cos(theta) * 0.5 * imgR;
    const cv = Math.sin(theta) * 0.5 * imgR;
    uv[i * 2] = 0.5 + cu;
    uv[i * 2 + 1] = 0.5 + cv;
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return geo;
}

export default function Tyre3D(props: JSX.IntrinsicElements["group"]) {
  const [sideMap, sideNormal, treadMap, treadNormal] = useTexture([
    "/tyre/sidewall.webp",
    "/tyre/sidewall_normal.webp",
    "/tyre/tread.webp",
    "/tyre/tread_normal.webp",
  ]);

  const { sideFront, sideBack, treadMat, sideMat, treadGeo, boreGeo } = useMemo(() => {
    [sideMap, sideNormal].forEach((t) => (t.colorSpace = t === sideMap ? THREE.SRGBColorSpace : THREE.NoColorSpace));
    treadMap.colorSpace = THREE.SRGBColorSpace;
    treadNormal.colorSpace = THREE.NoColorSpace;

    [treadMap, treadNormal].forEach((t) => {
      t.wrapS = THREE.MirroredRepeatWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
      t.repeat.set(22, 1);
      t.anisotropy = 8;
    });
    [sideMap, sideNormal].forEach((t) => {
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      t.anisotropy = 8;
    });

    const sideMat = new THREE.MeshStandardMaterial({
      map: sideMap,
      normalMap: sideNormal,
      normalScale: new THREE.Vector2(0.8, 0.8),
      metalness: 0.0,
      roughness: 0.62,
      color: new THREE.Color("#e9e9ee"),
    });
    const treadMat = new THREE.MeshStandardMaterial({
      map: treadMap,
      normalMap: treadNormal,
      normalScale: new THREE.Vector2(1.0, 1.0),
      metalness: 0.0,
      roughness: 0.9,
      color: new THREE.Color("#cfcfd4"),
    });

    const treadGeo = new THREE.CylinderGeometry(OUTER_R, OUTER_R, TREAD_H, 180, 1, true);
    const boreGeo = new THREE.CylinderGeometry(INNER_R * 0.99, INNER_R * 0.99, TREAD_H * 0.96, 80, 1, true);

    return {
      // +Y disc becomes camera-facing once the parent tilts the axle toward the viewer,
      // so it needs the mirrored UV to read correctly; the -Y disc takes the un-mirrored one.
      sideFront: sidewallGeometry(true),
      sideBack: sidewallGeometry(false),
      treadMat,
      sideMat,
      treadGeo,
      boreGeo,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sideMap, sideNormal, treadMap, treadNormal]);

  const boreMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#0a0a0c", metalness: 0.1, roughness: 0.95, side: THREE.DoubleSide }),
    []
  );

  return (
    <group {...props}>
      <mesh geometry={treadGeo} material={treadMat} castShadow receiveShadow />
      <mesh geometry={boreGeo} material={boreMat} />
      <mesh geometry={sideFront} material={sideMat} castShadow receiveShadow />
      {/* back sidewall: mirror across the equator */}
      <mesh geometry={sideBack} material={sideMat} scale={[1, -1, 1]} castShadow receiveShadow />
    </group>
  );
}
