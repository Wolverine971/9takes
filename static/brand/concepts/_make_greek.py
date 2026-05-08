#!/usr/bin/env python3
"""
Process a Greek statue photo into a 9takes brand mark.
Streetlamp Symposium palette: warm-stone shadows → sodium-amber highlights.
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import numpy as np

OUT = Path("/Users/djwayne/9takes/static/brand/concepts")


def lerp(c1, c2, t):
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))


def make_palette():
    """Build a 256-entry duotone palette, dark→amber, anchored to the
    locked V5 token set. Black maps to night-deep, white to bright amber."""
    stops = [
        (0,   (0x0a, 0x08, 0x07)),  # night-deep
        (35,  (0x12, 0x0d, 0x09)),  # near-black warm
        (75,  (0x24, 0x1d, 0x17)),  # stone-warm
        (115, (0x3a, 0x30, 0x2a)),  # stone-mid
        (150, (0x5C, 0x4F, 0x47)),  # stone-edge
        (185, (0x9a, 0x81, 0x67)),  # warm marble mid
        (215, (0xc9, 0xa6, 0x6f)),  # warm amber-marble
        (235, (0xf5, 0xae, 0x2e)),  # sodium-amber
        (250, (0xFB, 0xBF, 0x24)),  # lamp glow
        (255, (0xFF, 0xFB, 0xEB)),  # white-hot core
    ]
    pal = []
    for i in range(256):
        for j in range(len(stops) - 1):
            x0, c0 = stops[j]
            x1, c1 = stops[j + 1]
            if x0 <= i <= x1:
                t = (i - x0) / (x1 - x0) if x1 > x0 else 0
                pal.append(lerp(c0, c1, t))
                break
        else:
            pal.append(stops[-1][1])
    return np.array(pal, dtype=np.uint8)


def vignette_mask(size, strength=1.0):
    """Radial mask: opaque in center, transparent at corners."""
    w, h = size
    cx, cy = w / 2, h / 2
    yy, xx = np.mgrid[0:h, 0:w]
    dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    max_d = np.sqrt(cx ** 2 + cy ** 2)
    norm = dist / max_d
    # Soft falloff — center is fully visible, edges fade to 0 by ~85% of max
    inner = 0.55
    outer = 0.95
    fade = np.clip((outer - norm) / (outer - inner), 0, 1)
    fade = fade ** (1.6 * strength)
    return Image.fromarray((fade * 255).astype(np.uint8), "L")


def round_corners(img, radius_frac=0.16, bg=(0x0a, 0x08, 0x07)):
    """Apply rounded-rectangle mask, compositing onto bg."""
    mask = Image.new("L", img.size, 0)
    d = ImageDraw.Draw(mask)
    r = int(min(img.size) * radius_frac)
    d.rounded_rectangle((0, 0, img.size[0] - 1, img.size[1] - 1), radius=r, fill=255)
    bg_img = Image.new("RGB", img.size, bg)
    bg_img.paste(img, (0, 0), mask)
    return bg_img


def process(src_path: Path, out_name: str, *, crop_frac=0.92, contrast=1.18, saturation_boost=False, eye_glow_pos=None):
    src = Image.open(src_path).convert("RGB")
    w, h = src.size

    # Center crop a square then upsize back to 1024
    side = int(min(w, h) * crop_frac)
    left = (w - side) // 2
    top = (h - side) // 2
    src = src.crop((left, top, left + side, top + side))
    src = src.resize((1024, 1024), Image.LANCZOS)

    # Convert to luma and lift contrast slightly
    gray = src.convert("L")
    gray = ImageEnhance.Contrast(gray).enhance(contrast)
    gray = ImageEnhance.Brightness(gray).enhance(0.96)

    # Apply duotone palette
    pal = make_palette()
    arr = np.array(gray)
    duotone_arr = pal[arr]
    duo = Image.fromarray(duotone_arr, "RGB")

    # Vignette to brand-night background
    vmask = vignette_mask(duo.size, strength=1.1)
    vmask = vmask.filter(ImageFilter.GaussianBlur(60))
    night = Image.new("RGB", duo.size, (0x0a, 0x08, 0x07))
    duo = Image.composite(duo, night, vmask)

    # Subtle amber glow overlay on the upper-left lit side (streetlamp pool)
    glow = Image.new("RGB", duo.size, (0x00, 0x00, 0x00))
    g_draw = ImageDraw.Draw(glow)
    g_draw.ellipse((-200, -200, 700, 700), fill=(0xF5, 0x9E, 0x0B))
    glow = glow.filter(ImageFilter.GaussianBlur(180))
    duo = Image.blend(duo, Image.eval(glow, lambda x: x).convert("RGB"), 0.0)
    # Soft amber screen-blend on the lit side
    glow_soft = Image.new("RGB", duo.size, (0x0a, 0x08, 0x07))
    g2 = ImageDraw.Draw(glow_soft)
    g2.ellipse((-300, -300, 800, 800), fill=(0x7c, 0x4a, 0x10))
    glow_soft = glow_soft.filter(ImageFilter.GaussianBlur(220))
    duo_arr = np.array(duo).astype(np.int16)
    glow_arr = np.array(glow_soft).astype(np.int16)
    blended = np.clip(duo_arr + glow_arr * 0.55, 0, 255).astype(np.uint8)
    duo = Image.fromarray(blended, "RGB")

    # Optional: amber eye glow at given (x,y) in the source frame
    if eye_glow_pos is not None:
        ex, ey = eye_glow_pos
        eye = Image.new("RGB", duo.size, (0x0a, 0x08, 0x07))
        ed = ImageDraw.Draw(eye)
        ed.ellipse((ex - 28, ey - 28, ex + 28, ey + 28), fill=(0xFB, 0xBF, 0x24))
        eye = eye.filter(ImageFilter.GaussianBlur(28))
        eye_arr = np.array(eye).astype(np.int16)
        cur = np.array(duo).astype(np.int16)
        cur = np.clip(cur + eye_arr * 0.85, 0, 255).astype(np.uint8)
        duo = Image.fromarray(cur, "RGB")
        # Crisp core
        ed2 = ImageDraw.Draw(duo)
        ed2.ellipse((ex - 9, ey - 9, ex + 9, ey + 9), fill=(0xFB, 0xBF, 0x24))
        ed2.ellipse((ex - 4, ey - 4, ex + 4, ey + 4), fill=(0xFF, 0xFB, 0xEB))

    # Final round-corner mask + brand bg
    final = round_corners(duo, radius_frac=0.155, bg=(0x0a, 0x08, 0x07))

    # Save full size + 256
    final.save(OUT / f"{out_name}.png", "PNG", optimize=True)
    final.resize((256, 256), Image.LANCZOS).save(OUT / f"{out_name}-256.png", "PNG", optimize=True)
    final.resize((512, 512), Image.LANCZOS).save(OUT / f"{out_name}-512.png", "PNG", optimize=True)
    print(f"  wrote {out_name}.png ({final.size}), {out_name}-256.png, {out_name}-512.png")


def main():
    print("processing greek_distorted_statue_face.png …")
    process(
        Path("/Users/djwayne/9takes/static/greek_distorted_statue_face.png"),
        "icon-3a-greek-face",
        crop_frac=0.94,
        contrast=1.22,
    )

    print("processing greek-dude-reading-book.png …")
    process(
        Path("/Users/djwayne/9takes/static/blogs/greek-dude-reading-book.png"),
        "icon-3b-greek-reader",
        crop_frac=0.85,
        contrast=1.18,
    )


if __name__ == "__main__":
    main()
