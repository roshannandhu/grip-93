#!/usr/bin/env python3
"""
Generate a wispy smoke particle sprite for the intro burst.

Fractal value noise (sum of upscaled random octaves) shaped by a soft radial falloff → an
irregular, soft-edged puff with a real alpha channel. White/cool-grey RGB so it can be tinted
and accumulated by many particles into volumetric-looking smoke.

Run: python scripts/build_smoke_sprite.py
"""
import os
import numpy as np
from PIL import Image

SIZE = 256
OUT = os.path.join("public", "fx")


def value_noise(size, cells, rng):
    """Smooth value noise: random grid upscaled with bilinear interpolation."""
    grid = rng.random((cells + 1, cells + 1)).astype(np.float32)
    img = Image.fromarray((grid * 255).astype("uint8")).resize((size, size), Image.BICUBIC)
    return np.asarray(img, dtype=np.float32) / 255.0


def fractal(size, seed):
    rng = np.random.default_rng(seed)
    out = np.zeros((size, size), np.float32)
    amp, total = 1.0, 0.0
    for cells in (3, 6, 12, 24, 48):
        out += amp * value_noise(size, cells, rng)
        total += amp
        amp *= 0.55
    return out / total


def radial_falloff(size):
    y, x = np.mgrid[0:size, 0:size].astype(np.float32)
    cx = cy = (size - 1) / 2
    r = np.sqrt((x - cx) ** 2 + (y - cy) ** 2) / (size / 2)
    f = np.clip(1.0 - r, 0.0, 1.0)
    return f * f * (3 - 2 * f)  # smoothstep


def build(seed, path):
    n = fractal(SIZE, seed)
    n = (n - n.min()) / (n.max() - n.min() + 1e-6)
    alpha = np.clip((n * 1.35 - 0.28), 0, 1) * radial_falloff(SIZE)
    alpha = np.power(alpha, 1.15)  # crisp the wisps a touch
    a = (alpha * 255).astype("uint8")
    # cool-grey base, slightly brighter where denser → reads as lit smoke
    base = (200 + n * 40).clip(0, 255)
    rgb = np.stack([base * 0.96, base * 0.97, base], -1).astype("uint8")
    img = np.dstack([rgb, a])
    Image.fromarray(img, "RGBA").save(path)
    print("  wrote", path, "coverage", round(float((a > 12).mean()), 3))


def main():
    os.makedirs(OUT, exist_ok=True)
    build(7, os.path.join(OUT, "smoke.png"))
    build(42, os.path.join(OUT, "smoke2.png"))
    print("Done — smoke sprites in", OUT)


if __name__ == "__main__":
    main()
