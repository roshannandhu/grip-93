#!/usr/bin/env python3
"""
Build accurate 3D-tyre textures from the two ChatGPT studio references.

- Sidewall (face-on ref): BiRefNet bg removal -> centered square, tyre outer edge to the edges,
  bore transparent. Emits color + normal. Inner-hole ratio is printed so the mesh bore matches.
- Tread (front ref): crop the patterned band, rotate so circumference -> texture X, emit a
  mirror-tileable color + normal.

Outputs -> public/tyre/{sidewall,sidewall_normal,tread,tread_normal}.webp
Contact sheet -> assets/_tyre_textures.png

Run: python scripts/build_tyre_textures.py
"""
import os
import numpy as np
from PIL import Image
from rembg import remove, new_session

SIDE_SRC = "ChatGPT Image Jun 25, 2026, 01_46_00 AM.png"
TREAD_SRC = "ChatGPT Image Jun 25, 2026, 01_37_20 AM.png"
OUT = os.path.join("public", "tyre")
sess = new_session("birefnet-general")


def sobel_normal(gray, strength=2.0, wrap_x=False):
    """gray: float HxW in [0,1] -> uint8 normal map RGB."""
    h, w = gray.shape
    xmode = "wrap" if wrap_x else "edge"
    gl = np.pad(gray, ((0, 0), (1, 0)), mode=xmode)[:, :-1]
    gr = np.pad(gray, ((0, 0), (0, 1)), mode=xmode)[:, 1:]
    gu = np.pad(gray, ((1, 0), (0, 0)), mode="edge")[:-1, :]
    gd = np.pad(gray, ((0, 1), (0, 0)), mode="edge")[1:, :]
    dx = (gl - gr) * strength
    dy = (gu - gd) * strength
    nz = np.ones_like(gray)
    ln = np.sqrt(dx * dx + dy * dy + nz * nz)
    nx, ny, nz = dx / ln, dy / ln, nz / ln
    rgb = np.stack([(nx * 0.5 + 0.5), (ny * 0.5 + 0.5), (nz * 0.5 + 0.5)], -1)
    return Image.fromarray((rgb * 255).astype("uint8"), "RGB")


def build_sidewall(size=1024):
    rgba = remove(Image.open(SIDE_SRC).convert("RGB"), session=sess).convert("RGBA")
    a = np.asarray(rgba.split()[3])
    ys, xs = np.where(a > 40)
    cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
    outerR = int(max(xs.max() - cx, cx - xs.min(), ys.max() - cy, cy - ys.min()) * 1.02)
    crop = rgba.crop((int(cx - outerR), int(cy - outerR), int(cx + outerR), int(cy + outerR)))
    crop = crop.resize((size, size), Image.LANCZOS)
    crop.save(os.path.join(OUT, "sidewall.webp"), "WEBP", quality=95, method=6)

    # height from luma: bright embossed lettering -> raised; transparent -> flat mid
    arr = np.asarray(crop).astype(np.float32)
    al = arr[..., 3] / 255
    luma = (0.299 * arr[..., 0] + 0.587 * arr[..., 1] + 0.114 * arr[..., 2]) / 255
    height = np.where(al > 0.3, luma, 0.5)
    sobel_normal(height, 2.4).save(os.path.join(OUT, "sidewall_normal.webp"), "WEBP", quality=92, method=6)

    # inner-hole ratio (mesh bore should match)
    row = a[int(cy), :] > 40
    c = int(cx)
    l = c
    while l > 0 and not row[l]:
        l -= 1
    r = c
    while r < len(row) - 1 and not row[r]:
        r += 1
    ratio = ((r - l) / 2) / outerR
    print(f"  sidewall innerRatio ~= {ratio:.3f}")
    return crop, ratio


def build_tread(wcirc=1024, hwidth=512):
    rgba = remove(Image.open(TREAD_SRC).convert("RGB"), session=sess).convert("RGBA")
    a = np.asarray(rgba.split()[3])
    ys, xs = np.where(a > 40)
    # patterned band: trim shoulders a touch on X, keep full circumferential Y
    x0 = int(xs.min() + (xs.max() - xs.min()) * 0.06)
    x1 = int(xs.max() - (xs.max() - xs.min()) * 0.06)
    y0 = int(ys.min() + (ys.max() - ys.min()) * 0.04)
    y1 = int(ys.max() - (ys.max() - ys.min()) * 0.04)
    band = rgba.crop((x0, y0, x1, y1)).convert("RGB")
    # rotate so circumference (was vertical) -> X, width (was horizontal) -> Y
    band = band.rotate(-90, expand=True).resize((wcirc, hwidth), Image.LANCZOS)
    band.save(os.path.join(OUT, "tread.webp"), "WEBP", quality=95, method=6)
    arr = np.asarray(band).astype(np.float32)
    luma = (0.299 * arr[..., 0] + 0.587 * arr[..., 1] + 0.114 * arr[..., 2]) / 255
    sobel_normal(luma, 3.0, wrap_x=True).save(os.path.join(OUT, "tread_normal.webp"), "WEBP", quality=92, method=6)
    return band


def main():
    os.makedirs(OUT, exist_ok=True)
    side, ratio = build_sidewall()
    tread = build_tread()
    # contact sheet
    t = 360
    sheet = Image.new("RGB", (t * 2, t), (20, 20, 22))
    sheet.paste(side.convert("RGB").resize((t, t)), (0, 0))
    sheet.paste(tread.resize((t, t)), (t, 0))
    sheet.save(os.path.join("assets", "_tyre_textures.png"))
    print(f"Done — textures in {OUT}; sheet assets/_tyre_textures.png")


if __name__ == "__main__":
    main()
