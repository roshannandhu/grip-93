#!/usr/bin/env python3
"""
Normalize the Grip 93 360 frames so the tyre is the SAME size and CENTERED in
every frame -> a clean, professional spin (no size/position jumps).

Pipeline per cell:
  1. crop the cell from assets/grip93-360.png (measured bands)
  2. threshold luminance -> mask of the tyre; clean speckle; getbbox()
  3. crop the colour cell to that bbox
  4. scale so bbox HEIGHT == TARGET_FRAC of the canvas (diameter is constant across
     angles, so height is the right anchor; width varies naturally)
  5. paste centered on a CANVAS x CANVAS black square (matches page --bg)

Output: assets/360/01..08.png  (overwrites)
Run:    python scripts/normalize_360.py
"""
from PIL import Image, ImageFilter
import os

SRC = os.path.join("assets", "grip93-360.png")
OUT = os.path.join("assets", "360")
COLS = 4
ROW_BANDS = [(0.158, 0.460), (0.588, 0.890)]
PAD_X_FRAC  = 0.006
CANVAS      = 560      # output size (px)
TARGET_FRAC = 0.80     # tyre height as fraction of canvas
THRESH      = 26       # luminance cutoff: tyre (~40) vs background (~10)

def content_bbox(cell):
    g = cell.convert("L").point(lambda v: 255 if v >= THRESH else 0)
    g = g.filter(ImageFilter.MedianFilter(5))   # kill smoke/floor speckle
    return g.getbbox()

def main():
    if not os.path.exists(SRC):
        raise SystemExit(f"Missing {SRC}")
    os.makedirs(OUT, exist_ok=True)
    sheet = Image.open(SRC).convert("RGB")
    W, H = sheet.size
    col_w = W / COLS
    pad_x = int(W * PAD_X_FRAC)
    target_h = int(CANVAS * TARGET_FRAC)

    idx = 1
    for (t, b) in ROW_BANDS:
        top, bottom = int(H * t), int(H * b)
        for c in range(COLS):
            left  = int(c * col_w) + pad_x
            right = int((c + 1) * col_w) - pad_x
            cell = sheet.crop((left, top, right, bottom))
            bb = content_bbox(cell) or (0, 0, cell.width, cell.height)
            tyre = cell.crop(bb)
            scale = target_h / tyre.height
            nw, nh = max(1, round(tyre.width * scale)), max(1, round(tyre.height * scale))
            # don't let very wide angles spill past the canvas
            if nw > CANVAS - 16:
                k = (CANVAS - 16) / nw; nw = round(nw * k); nh = round(nh * k)
            tyre = tyre.resize((nw, nh), Image.LANCZOS)
            canvas = Image.new("RGB", (CANVAS, CANVAS), (7, 7, 8))
            canvas.paste(tyre, ((CANVAS - nw) // 2, (CANVAS - nh) // 2))
            canvas.save(os.path.join(OUT, f"{idx:02d}.png"))
            print(f"  {idx:02d}.png  bbox={bb}  ->  {nw}x{nh} on {CANVAS}")
            idx += 1
    print("Done — normalized 8 frames.")

if __name__ == "__main__":
    main()
