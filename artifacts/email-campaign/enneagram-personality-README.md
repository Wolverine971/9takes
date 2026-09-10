<!-- artifacts/email-campaign/enneagram-personality-README.md -->
# Enneagram email asset — selected palette A

Generated programmatically with SVG geometry, outlined Inter Bold / Black and JetBrains Mono typography, and Sharp PNG export.

- `enneagram-personality.png`: complete email image, 1200 × 1040.
- `enneagram-personality.svg`: editable vector with named groups for the overlays, arrows, type numbers, silhouettes, and labels. Text is outlined for portable rendering.
- `enneagram-triads-layout.svg` / `.png`: type numbers, triad overlays, and labels without the center or arrows.
- `enneagram-type-pilot-preview.html`: local email mockup regenerated from the canonical copy, with the main account CTA before the image.
- `static/email/enneagram-type-prompt/your-personality-v1.png`: production PNG referenced by the canonical campaign template, linked to the beginner guide. Deploy the site before sending so this URL is available.

Regenerate from the repository root:

`node scripts/generate-enneagram-email-asset.mjs`

Palette A uses the current Streetlamp Symposium lamp colors from `src/scss/index.scss` and `docs/design-system.md`: Instinctual / Anger uses burnt orange #B45309, Emotional / Shame uses 9takes amber #F59E0B, and Intellectual / Fear uses lamp yellow #FBBF24. Solid colored sections preserve the selected hues against deep night and warm stone. Labels and numbers use warm ivory for readability. These are triad group colors, separate from individual type colors.

Number placement: 9 at the top, followed by 1 through 8 clockwise. Only radial arrows connect the center to the numbers. Arrows use 6.5px warm-ivory shafts and filled 22px arrowheads so they remain visible at email size. Labels read Instinctual / Anger triad, Intellectual / Fear triad, and Emotional / Shame triad. The word intelligence and repeated number badges are omitted. The center uses a stone medallion, softly shaded silhouettes, a mono YOUR label, and tightly spaced Inter display text that fits within the circle.
