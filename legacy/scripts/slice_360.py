#!/usr/bin/env python3
"""
Slice the Grip 93 360-degree contact sheet into 8 clean frames.

Input : assets/grip93-360.png   (2-row x 4-col grid, with a title band + angle labels)
Output: assets/360/01.png .. 08.png  (ordered 0,45,90,135,180,225,270,315)

Bands below were measured from the 1402x1122 sheet (brightness profiling) so the
title and the "0 / 45 ..." label strips are excluded. Values are fractions of the
full sheet so it still works if the sheet is rescaled.
"""
from PIL import Image
import os

SRC = os.path.join("assets", "grip93-360.png")
OUT = os.path.join("assets", "360")
COLS = 4

# (top, bottom) as fraction of height — one tuple per tyre row, top row first.
ROW_BANDS = [(0.158, 0.460), (0.588, 0.890)]
PAD_X_FRAC = 0.006   # trim tiny gutters between columns

def main():
    if not os.path.exists(SRC):
        raise SystemExit(f"Missing {SRC} — save the 360 sheet there first.")
    os.makedirs(OUT, exist_ok=True)
    im = Image.open(SRC).convert("RGB")
    W, H = im.size
    col_w = W / COLS
    pad_x = int(W * PAD_X_FRAC)

    idx = 1
    for (t, b) in ROW_BANDS:
        top, bottom = int(H * t), int(H * b)
        for c in range(COLS):
            left  = int(c * col_w) + pad_x
            right = int((c + 1) * col_w) - pad_x
            im.crop((left, top, right, bottom)).save(os.path.join(OUT, f"{idx:02d}.png"))
            print(f"  wrote {OUT}/{idx:02d}.png  ({right-left}x{bottom-top})")
            idx += 1
    print(f"Done — {idx-1} frames.")

if __name__ == "__main__":
    main()
