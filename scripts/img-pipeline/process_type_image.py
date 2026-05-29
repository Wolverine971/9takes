#!/usr/bin/env python3
# scripts/img-pipeline/process_type_image.py
"""
9takes personality-analysis image pipeline.
Reproduces DJ's Canva process locally:
  1. remove background (rembg)         -> transparent
  2. grayscale + contrast filter
  3. detect eyes (mediapipe face mesh)
  4. scale + place the purple bar ear-to-ear, centered on the eye line
  5. output 1080x1080 webp (+ optional 's-' variant)

Usage:
  process_type_image.py SOURCE.jpg OUT.webp [--bar BAR.png] [--debug]
"""
import os, sys, argparse
import numpy as np
from PIL import Image, ImageEnhance, ImageOps
import mediapipe as mp
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision as mp_vision
from rembg import remove

CANVAS = 1080
# Canonical FIXED purple-bar rectangle on the 1080x1080 canvas.
# Measured from existing images (Trevor-Noah / Anne-Hathaway / Ariana-Grande all
# agree): bbox x[326-756] y[434-551], center (50.3%, 45.4%). The bar is pinned
# here on EVERY image; the face is scaled+moved so the eyes land under it.
BAR_LEFT, BAR_TOP, BAR_W, BAR_H = 326, 434, 430, 117
BAR_CENTER_Y = (BAR_TOP + BAR_H / 2) / CANVAS  # ~0.456 -> eye target

MODEL_PATH = os.environ.get(
    "FACE_LANDMARKER_MODEL",
    os.path.expanduser("~/.9takes-imgtools-venv/models/face_landmarker.task"),
)

def remove_bg(img: Image.Image) -> Image.Image:
    """Background removal with alpha matting for clean edges, then a hard alpha
    threshold to kill the faint gray halo/shadow fringe rembg can leave."""
    out = remove(
        img.convert("RGBA"),
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=10,
        alpha_matting_erode_size=10,
    )
    a = np.array(out)
    alpha = a[:, :, 3]
    alpha[alpha < 25] = 0          # drop near-transparent fringe -> no gray halo
    a[:, :, 3] = alpha
    return Image.fromarray(a, "RGBA")

def detect_face(rgb: np.ndarray):
    """Return dict with eye-line y, face left/right x (ear-to-ear at eye level) in px.
    Uses the mediapipe Tasks FaceLandmarker (478 landmarks incl. iris)."""
    opts = mp_vision.FaceLandmarkerOptions(
        base_options=mp_python.BaseOptions(model_asset_path=MODEL_PATH),
        num_faces=1,
    )
    with mp_vision.FaceLandmarker.create_from_options(opts) as landmarker:
        mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=np.ascontiguousarray(rgb))
        res = landmarker.detect(mp_img)
    if not res.face_landmarks:
        return None
    h, w = rgb.shape[:2]
    lm = res.face_landmarks[0]
    pt = lambda i: (lm[i].x * w, lm[i].y * h)
    # iris centers (refine_landmarks): left 468-472, right 473-477
    left_iris  = np.mean([pt(i) for i in range(468, 473)], axis=0)
    right_iris = np.mean([pt(i) for i in range(473, 478)], axis=0)
    eye_y = (left_iris[1] + right_iris[1]) / 2
    # face silhouette extremes near eye level: 234 (right cheek), 454 (left cheek)
    cheek_l = pt(234)[0]
    cheek_r = pt(454)[0]
    face_left, face_right = min(cheek_l, cheek_r), max(cheek_l, cheek_r)
    return {"eye_y": eye_y, "face_left": face_left, "face_right": face_right,
            "eye_left_x": min(left_iris[0], right_iris[0]),
            "eye_right_x": max(left_iris[0], right_iris[0])}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source")
    ap.add_argument("out")
    ap.add_argument("--bar", default=os.path.join(os.path.dirname(__file__), "purple-bar.png"))
    ap.add_argument("--contrast", type=float, default=1.15)
    ap.add_argument("--ear-frac", type=float, default=0.33, help="cheek-to-cheek width as fraction of canvas (calibrated to existing images: Trevor 0.32, Ariana 0.30, Anne 0.36)")
    ap.add_argument("--eye-frac", type=float, default=BAR_CENTER_Y, help="eye-line height as fraction of canvas; defaults to the fixed bar's vertical center")
    ap.add_argument("--debug", action="store_true")
    a = ap.parse_args()

    src = Image.open(a.source)
    src = ImageOps.exif_transpose(src)

    # 1. bg removal
    cut = remove_bg(src)

    # 3. detect on the original (color, pre-grayscale) for best landmark accuracy
    det_rgb = np.array(src.convert("RGB"))
    face = detect_face(det_rgb)
    if face is None:
        print("ERROR: no face detected", file=sys.stderr); sys.exit(2)

    # 2. grayscale + contrast, keep alpha from cut
    gray = ImageOps.grayscale(cut.convert("RGB"))
    gray = ImageEnhance.Contrast(gray).enhance(a.contrast)
    filtered = Image.merge("RGBA", (*gray.convert("RGB").split(), cut.split()[3]))

    # Frame the face on a 1080 canvas: scale so ear-to-ear ~52% of canvas, eyes at ~46% height
    ear = face["face_right"] - face["face_left"]
    target_ear = CANVAS * a.ear_frac
    scale = target_ear / ear
    new_w = int(filtered.width * scale); new_h = int(filtered.height * scale)
    filtered_s = filtered.resize((new_w, new_h), Image.LANCZOS)

    face_cx = (face["face_left"] + face["face_right"]) / 2 * scale
    eye_y_s = face["eye_y"] * scale
    off_x = int(CANVAS/2 - face_cx)
    off_y = int(CANVAS*a.eye_frac - eye_y_s)

    canvas = Image.new("RGBA", (CANVAS, CANVAS), (255, 255, 255, 0))
    canvas.alpha_composite(filtered_s, (off_x, off_y))

    # 4. purple bar PINNED to the canonical fixed rectangle (identical on every
    #    image) so all faces line up to the same bar. The face was scaled+placed
    #    above so the eyes sit at the bar's vertical center.
    bar = Image.open(a.bar).convert("RGBA").resize((BAR_W, BAR_H), Image.LANCZOS)
    canvas.alpha_composite(bar, (BAR_LEFT, BAR_TOP))

    # flatten onto white (existing images are on white)
    final = Image.new("RGB", (CANVAS, CANVAS), (255, 255, 255))
    final.paste(canvas, (0, 0), canvas)
    final.save(a.out, "WEBP", quality=88)
    print(f"OK -> {a.out}  (scale={scale:.3f}, ear={ear:.0f}px, eye_y={face['eye_y']:.0f})")
    if a.debug:
        canvas.save(a.out + ".debug.png")

if __name__ == "__main__":
    main()
