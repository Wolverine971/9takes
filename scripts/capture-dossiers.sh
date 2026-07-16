#!/bin/bash
# scripts/capture-dossiers.sh
# Capture each enneagram type dossier in BOTH dark and light theme,
# save webp variants to static/blogs/.
#
# Naming:
#   enneagram-type-N-dossier.webp         (dark, default — keeps `pic:` backwards-compatible)
#   s-enneagram-type-N-dossier.webp       (small dark)
#   enneagram-type-N-dossier-light.webp   (light variant)
#   s-enneagram-type-N-dossier-light.webp (small light)
#
# Requires: dev server on localhost:5173, agent-browser CLI, cwebp, sips.

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:5173}"
TMP_DIR="/tmp/enneagram-dossiers"
DEST_DIR="$(cd "$(dirname "$0")/.." && pwd)/static/blogs"

mkdir -p "$TMP_DIR" "$DEST_DIR"

agent-browser set viewport 1200 1400 > /dev/null

capture_theme() {
  local theme="$1"        # 'dark' or 'light'
  local out_basename="$2" # e.g. enneagram-type-1-dossier or enneagram-type-1-dossier-light

  agent-browser eval "(()=>{const r=document.documentElement;r.classList.remove('light','dark');r.classList.add('${theme}');r.dataset.theme='${theme}';r.style.colorScheme='${theme}';})()" > /dev/null
  # Re-scroll into view in case theme toggle shifted layout, settle, fetch box
  agent-browser eval "document.querySelector('.dossier-card').scrollIntoView({block:'start'})" > /dev/null
  sleep 0.6

  local box_json x y w h
  box_json=$(agent-browser get box .dossier-card --json)
  x=$(echo "$box_json" | python3 -c "import sys,json; d=json.load(sys.stdin)['data']; print(round(d['x']))")
  y=$(echo "$box_json" | python3 -c "import sys,json; d=json.load(sys.stdin)['data']; print(max(0, round(d['y'])))")
  w=$(echo "$box_json" | python3 -c "import sys,json; d=json.load(sys.stdin)['data']; print(round(d['width']))")
  h=$(echo "$box_json" | python3 -c "import sys,json; d=json.load(sys.stdin)['data']; print(round(d['height']))")

  local viewport_png="${TMP_DIR}/viewport-${out_basename}.png"
  local cropped_png="${TMP_DIR}/${out_basename}.png"
  agent-browser screenshot "$viewport_png" > /dev/null
  sips --cropToHeightWidth "$h" "$w" --cropOffset "$y" "$x" "$viewport_png" --out "$cropped_png" > /dev/null

  local webp="${DEST_DIR}/${out_basename}.webp"
  local s_webp="${DEST_DIR}/s-${out_basename}.webp"
  cwebp -quiet -preset picture -q 82 -m 6 -mt -sharp_yuv \
    -resize 1200 0 -resize_mode down_only \
    "$cropped_png" -o "$webp"
  cwebp -quiet -preset picture -q 72 -m 6 -mt -sharp_yuv \
    -resize 480 0 -resize_mode down_only \
    "$cropped_png" -o "$s_webp"

  echo "  ${theme}: ${w}x${h} → $(du -h "$webp" | cut -f1) · s: $(du -h "$s_webp" | cut -f1)"
}

for n in 1 2 3 4 5 6 7 8 9; do
  url="${BASE_URL}/enneagram-corner/enneagram-type-${n}"
  echo ""
  echo "→ enneagram-type-${n}"

  agent-browser open "$url" > /dev/null
  agent-browser wait .dossier-card > /dev/null

  capture_theme dark  "enneagram-type-${n}-dossier"
  capture_theme light "enneagram-type-${n}-dossier-light"
done

echo ""
echo "✓ done"
