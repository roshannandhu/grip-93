/**
 * GRIP 93 — procedural tyre builder (framework-agnostic).
 *
 * Pass in your THREE instance and get back a THREE.Group containing the
 * rubber carcass (tread + sidewalls), the bead, and an alloy wheel.
 *
 * Dimensions modelled on the sidewall code 175/65 R17:
 *   rim   = 17 in  -> radius 0.21590 m
 *   side  = 175 * 0.65 = 113.75 mm
 *   outer = rim + 2*side
 *   width = 175 mm
 *
 * Everything is built at real-world scale (metres). Frame the camera around
 * group.userData.outerRadius.
 *
 *   import { buildTyre } from "./lib/tyreBuilder.js";
 *   const tyre = buildTyre(THREE);
 *   scene.add(tyre);
 */

const IN = 0.0254;

export function buildTyre(THREE, opts = {}) {
  const sectionWidth = opts.sectionWidth ?? 0.175;
  const aspect       = opts.aspect ?? 0.65;
  const rimInches    = opts.rim ?? 17;
  const brand        = opts.brand ?? "GRIP 93";
  const sizeCode     = opts.sizeCode ?? "175/65 R17";

  const rimR    = (rimInches * IN) / 2;          // bead seat radius
  const sideH   = sectionWidth * aspect;          // sidewall height
  const outerR  = rimR + sideH;                   // tread radius
  const halfW   = sectionWidth / 2;               // half tread width

  const group = new THREE.Group();
  group.userData.outerRadius = outerR;

  // ---- materials -------------------------------------------------------
  const tread = makeTreadTextures(THREE);
  const side  = makeSidewallTextures(THREE, brand, sizeCode);

  const rubberTread = new THREE.MeshStandardMaterial({
    color: 0x141414,
    roughness: 0.92,
    metalness: 0.0,
    map: tread.albedo,
    normalMap: tread.normal,
    roughnessMap: tread.rough,
    normalScale: new THREE.Vector2(1.6, 1.6),
  });

  const rubberSide = new THREE.MeshStandardMaterial({
    color: 0x161616,
    roughness: 0.72,
    metalness: 0.0,
    map: side.albedo,
    normalMap: side.normal,
    normalScale: new THREE.Vector2(1.6, 1.6),
  });

  const rubberInner = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a, roughness: 0.95, metalness: 0.0,
    side: THREE.DoubleSide,
  });

  // ---- profiles (revolved around Y) -----------------------------------
  // Tread crown: a slightly cambered band that rolls into the shoulders.
  const treadPts = [
    new THREE.Vector2(outerR - 0.028, +halfW * 0.96),
    new THREE.Vector2(outerR - 0.006, +halfW * 0.90),
    new THREE.Vector2(outerR + 0.001, +halfW * 0.55),
    new THREE.Vector2(outerR + 0.004, 0),
    new THREE.Vector2(outerR + 0.001, -halfW * 0.55),
    new THREE.Vector2(outerR - 0.006, -halfW * 0.90),
    new THREE.Vector2(outerR - 0.028, -halfW * 0.96),
  ];
  const treadGeo = new THREE.LatheGeometry(smooth(THREE, treadPts, 4), 240);
  // map the tread once around (the pattern already spans the full wrap)
  for (const t of [tread.albedo, tread.normal, tread.rough]) {
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.repeat.set(1, 1);
  }
  const treadMesh = new THREE.Mesh(treadGeo, rubberTread);
  treadMesh.castShadow = treadMesh.receiveShadow = true;
  group.add(treadMesh);

  // Sidewall (one side): bead -> bulge -> shoulder. v=0 outer, v=1 inner.
  const sidewallPts = [
    new THREE.Vector2(outerR - 0.024, halfW * 0.965),  // shoulder (outer / v0)
    new THREE.Vector2(outerR - 0.05,  halfW * 0.93),
    new THREE.Vector2(rimR + sideH * 0.62, halfW * 0.80),
    new THREE.Vector2(rimR + sideH * 0.34, halfW * 0.66),  // max bulge
    new THREE.Vector2(rimR + sideH * 0.16, halfW * 0.52),
    new THREE.Vector2(rimR + 0.012, halfW * 0.40),
    new THREE.Vector2(rimR + 0.004, halfW * 0.30),         // bead toe (inner / v1)
  ];
  const sideGeoFront = new THREE.LatheGeometry(smooth(THREE, sidewallPts, 4), 240);
  const sideFront = new THREE.Mesh(sideGeoFront, rubberSide);
  sideFront.castShadow = sideFront.receiveShadow = true;
  group.add(sideFront);

  // Back sidewall: real geometry mirror with corrected UVs + winding so the
  // GRIP 93 lettering reads correctly from the rear too (no mirror-flip).
  group.add(backSidewall(THREE, sideGeoFront, rubberSide));

  // Open inner bore: a dark inner liner connecting the two bead toes.
  // No wheel — the centre is hollow, so you see straight through the tyre
  // (matching the side/right-left reference view).
  const boreH = halfW * 0.60;                  // span between front & back beads
  const liner = new THREE.Mesh(
    new THREE.CylinderGeometry(rimR + 0.004, rimR + 0.004, boreH, 160, 1, true),
    rubberInner);
  liner.receiveShadow = true;
  group.add(liner);

  // soft rounded bead lips where the sidewall meets the bore
  for (const s of [1, -1]) {
    const lip = new THREE.Mesh(
      new THREE.TorusGeometry(rimR + 0.006, 0.012, 16, 120), rubberInner);
    lip.rotation.x = Math.PI / 2;
    lip.position.y = s * (boreH / 2 - 0.004);
    group.add(lip);

    // flat bead-seat ring -> the dark recessed ring you see before the hole
    const seat = new THREE.Mesh(
      new THREE.RingGeometry(rimR + 0.002, rimR + 0.03, 120), rubberInner);
    seat.position.y = s * (boreH / 2 + 0.004);
    seat.rotation.x = s > 0 ? -Math.PI / 2 : Math.PI / 2;
    group.add(seat);
  }

  // Lay the tyre on its axle: axis (Y) -> world X so the tread faces +Z.
  group.rotation.z = Math.PI / 2;

  return group;
}

/* ------------------------------------------------------------------ */
/* Texture generation                                                  */
/* ------------------------------------------------------------------ */
function newCanvas(w, h) {
  const c = (typeof document !== "undefined")
    ? document.createElement("canvas")
    : new OffscreenCanvas(w, h);
  c.width = w; c.height = h;
  return c;
}

function canvasTexture(THREE, canvas, srgb) {
  const t = new THREE.CanvasTexture(canvas);
  t.anisotropy = 8;
  if (srgb) {
    // r152+ uses colorSpace; older r128 uses encoding.
    if (THREE.SRGBColorSpace !== undefined) t.colorSpace = THREE.SRGBColorSpace;
    else if (THREE.sRGBEncoding !== undefined) t.encoding = THREE.sRGBEncoding;
  }
  t.needsUpdate = true;
  return t;
}

/** Convert a height canvas to a tangent-space normal map canvas. */
function heightToNormal(src, strength) {
  const w = src.width, h = src.height;
  const sdata = src.getContext("2d").getImageData(0, 0, w, h).data;
  const out = newCanvas(w, h);
  const octx = out.getContext("2d");
  const img = octx.createImageData(w, h);
  const at = (x, y) => {
    x = (x + w) % w; y = Math.max(0, Math.min(h - 1, y));
    return sdata[(y * w + x) * 4] / 255;
  };
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (at(x - 1, y) - at(x + 1, y)) * strength;
      const dy = (at(x, y - 1) - at(x, y + 1)) * strength;
      let nx = dx, ny = dy, nz = 1;
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len; ny /= len; nz /= len;
      const i = (y * w + x) * 4;
      img.data[i]     = (nx * 0.5 + 0.5) * 255;
      img.data[i + 1] = (ny * 0.5 + 0.5) * 255;
      img.data[i + 2] = (nz * 0.5 + 0.5) * 255;
      img.data[i + 3] = 255;
    }
  }
  octx.putImageData(img, 0, 0);
  return out;
}

/** Directional summer tread matching image 2: 5 ribs, 4 crisp grooves,
 *  a solid centre rib, swept lateral sipes, smooth shoulders.
 *  Drawn as ONE full wrap around the circumference (texture repeat = 1x1),
 *  so the pattern sits at the right real-world scale. */
function makeTreadTextures(THREE) {
  const W = 2048, H = 512;          // W = circumference (1 wrap), H = tread width
  const height = newCanvas(W, H);
  const c = height.getContext("2d");
  c.lineCap = "round";

  c.fillStyle = "#9c9c9c";          // block (high) level
  c.fillRect(0, 0, W, H);

  // 4 circumferential grooves -> 5 ribs (bands run along the wrap direction)
  const grooves = [0.205, 0.40, 0.60, 0.795];
  const gw = H * 0.05;
  c.fillStyle = "#0c0c0c";
  for (const g of grooves) c.fillRect(0, g * H - gw / 2, W, gw);

  // solid centre rib reads as a stability band
  c.fillStyle = "#aeaeae";
  c.fillRect(0, 0.5 * H - H * 0.02, W, H * 0.04);
  c.strokeStyle = "#6a6a6a"; c.lineWidth = H * 0.004;
  c.beginPath();
  for (let x = 0; x <= W; x += 16) {
    const y = 0.5 * H + Math.sin(x * 0.06) * H * 0.005;
    x === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
  } c.stroke();

  // swept directional sipes on the two intermediate ribs
  const N = 64, pitch = W / N;
  c.strokeStyle = "#3a3a40"; c.lineWidth = H * 0.0075;
  const sipe = (x, cy, dir) => {
    c.beginPath();
    c.moveTo(x, cy - H * 0.072);
    c.quadraticCurveTo(x + dir * pitch * 0.38, cy, x + dir * pitch * 0.2, cy + H * 0.072);
    c.stroke();
  };
  for (let i = 0; i < N; i++) {
    const x = i * pitch;
    sipe(x, 0.30 * H, +1);          // upper intermediate rib
    sipe(x, 0.70 * H, -1);          // lower intermediate rib (mirrored)
  }

  // smooth shoulders with faint short lateral slots near the very edge
  c.fillStyle = "#3c3c3c";
  for (let i = 0; i < N; i++) {
    const x = i * pitch;
    c.fillRect(x, 0.02 * H, pitch * 0.42, H * 0.045);
    c.fillRect(x, 0.935 * H, pitch * 0.42, H * 0.045);
  }

  // fine moulding grain
  const grain = c.getImageData(0, 0, W, H);
  for (let i = 0; i < grain.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 12;
    grain.data[i] += n; grain.data[i + 1] += n; grain.data[i + 2] += n;
  }
  c.putImageData(grain, 0, 0);

  // albedo: dark rubber, grooves darkest
  const albedo = newCanvas(W, H), actx = albedo.getContext("2d");
  actx.drawImage(height, 0, 0);
  const ad = actx.getImageData(0, 0, W, H);
  for (let i = 0; i < ad.data.length; i += 4) {
    const v = ad.data[i] / 255, col = 12 + v * 18;
    ad.data[i] = col; ad.data[i + 1] = col; ad.data[i + 2] = col;
  }
  actx.putImageData(ad, 0, 0);

  // roughness: groove floors a touch glossier than block tops
  const rough = newCanvas(W, H), rctx = rough.getContext("2d");
  rctx.drawImage(height, 0, 0);
  const rd = rctx.getImageData(0, 0, W, H);
  for (let i = 0; i < rd.data.length; i += 4) {
    const v = rd.data[i] / 255, r = 240 - v * 70;
    rd.data[i] = r; rd.data[i + 1] = r; rd.data[i + 2] = r;
  }
  rctx.putImageData(rd, 0, 0);

  return {
    albedo: canvasTexture(THREE, albedo, true),
    normal: canvasTexture(THREE, heightToNormal(height, 3.6), false),
    rough:  canvasTexture(THREE, rough, false),
  };
}

/** Sidewall: bold GRIP 93 marking, checkered-flag emblems, size/service text. */
function makeSidewallTextures(THREE, brand, sizeCode) {
  const W = 2048, H = 512;       // x = angle, y = radius (v0 outer -> v1 inner)
  const height = newCanvas(W, H);
  const ctx = height.getContext("2d");

  ctx.fillStyle = "#7a7a7a";     // mid rubber height
  ctx.fillRect(0, 0, W, H);

  // a slightly raised brand ridge band + faint concentric moulding rings
  ctx.fillStyle = "#8f8f8f";
  ctx.fillRect(0, H * 0.14, W, H * 0.34);
  ctx.strokeStyle = "rgba(150,150,150,0.45)";
  ctx.lineWidth = 2;
  for (let r = 0.10; r < 0.96; r += 0.05) {
    ctx.beginPath(); ctx.moveTo(0, r * H); ctx.lineTo(W, r * H); ctx.stroke();
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // small checkered racing flag (raised, bright)
  const flag = (cx, cy, s) => {
    ctx.fillStyle = "#f4f4f4";
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 5; c++)
        if ((r + c) % 2 === 0) ctx.fillRect(cx + c * s, cy + r * s, s, s);
  };

  // brand wordmark, bold italic, twice around with flags either side
  for (const cx of [W * 0.25, W * 0.75]) {
    ctx.fillStyle = "#f6f6f6";
    ctx.font = `italic 900 ${H * 0.28}px Arial, "Helvetica Neue", sans-serif`;
    const w = ctx.measureText(brand).width;
    flag(cx - w / 2 - H * 0.20, H * 0.20, H * 0.045);
    flag(cx + w / 2 + H * 0.07, H * 0.20, H * 0.045);
    ctx.fillText(brand, cx, H * 0.305);
  }

  // size / service description, lower band, repeated around
  ctx.fillStyle = "#d4d4d4";
  ctx.font = `700 ${H * 0.085}px Arial, sans-serif`;
  for (const cx of [W * 0.08, W * 0.5, W * 0.92]) {
    ctx.fillText(`${sizeCode}  91V`, cx, H * 0.60);
  }
  ctx.fillStyle = "#bdbdbd";
  ctx.font = `700 ${H * 0.06}px Arial, sans-serif`;
  for (const cx of [W * 0.30, W * 0.70]) {
    ctx.fillText("TUBELESS  RADIAL", cx, H * 0.72);
  }

  // decorative laurel / spore-dot clusters near the inner bead
  ctx.fillStyle = "#cdcdcd";
  const cluster = (cx, cy, s) => {
    const pts = [[0,0],[1,-0.4],[2,0.1],[0.6,0.7],[1.8,0.9],[2.7,0.5],[-0.6,0.6]];
    for (const [dx, dy] of pts) {
      ctx.beginPath();
      ctx.arc(cx + dx * s, cy + dy * s, s * 0.42, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  for (const cx of [W * 0.16, W * 0.42, W * 0.58, W * 0.84]) {
    cluster(cx, H * 0.86, H * 0.04);
  }

  // albedo: warm cream marks on near-black rubber
  const albedo = newCanvas(W, H);
  const actx = albedo.getContext("2d");
  actx.drawImage(height, 0, 0);
  const ad = actx.getImageData(0, 0, W, H);
  for (let i = 0; i < ad.data.length; i += 4) {
    const v = ad.data[i] / 255;
    if (v > 0.74) {                 // raised marks -> warm cream
      ad.data[i] = 218; ad.data[i + 1] = 203; ad.data[i + 2] = 162;
    } else {
      const c = 16 + v * 10;        // rubber, subtle ridge shading
      ad.data[i] = c; ad.data[i + 1] = c; ad.data[i + 2] = c;
    }
  }
  actx.putImageData(ad, 0, 0);

  return {
    albedo: canvasTexture(THREE, albedo, true),
    normal: canvasTexture(THREE, heightToNormal(height, 2.4), false),
  };
}

/* Catmull-Rom resample of a profile for smoother lathes. */
function smooth(THREE, pts, mult) {
  if (mult <= 1) return pts;
  const curve = new THREE.SplineCurve(pts);
  return curve.getPoints(pts.length * mult);
}

/* Build the rear sidewall from the front geometry: mirror across the wheel
 * plane (negate Y), flip face winding so normals stay outward, and mirror the
 * U coordinate so the moulded text reads correctly when viewed from behind. */
function backSidewall(THREE, frontGeo, material) {
  const g = frontGeo.clone();
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setY(i, -pos.getY(i));
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i));
  if (g.index) {
    const a = g.index.array;
    for (let i = 0; i < a.length; i += 3) { const t = a[i + 1]; a[i + 1] = a[i + 2]; a[i + 2] = t; }
    g.index.needsUpdate = true;
  }
  pos.needsUpdate = true; uv.needsUpdate = true;
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, material);
  m.castShadow = m.receiveShadow = true;
  return m;
}
