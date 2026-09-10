<!-- docs/design/hyperplexed/HARRY_DRY_V2_COMMUNITY_IMAGE.md -->

# Harry Dry V2 community illustration

Created with the built-in image generation tool on 2026-09-10 for `/design-preview/harry-dry-v2`.

## Current assets — cel-shaded neo-noir

Regenerated with the built-in image generation tool using [the supplied style guide](../../visual-style/cel-shaded-neo-noir/cel-shaded-neo-noir-guide.md) and both of its reference images. The original community image served only as the composition/edit target. The style-reference cars, logos, and screenshot controls were excluded.

- `static/images/home-reimagined/community-circle-neo-noir-v2.webp`: 1774×887, 249,808 bytes.
- `static/images/home-reimagined/community-circle-neo-noir-v2-small.webp`: 888×444, 101,274 bytes.

Source PNG: `/Users/djwayne/.codex/generated_images/01a08c54-552f-7240-bbaa-b8f7d736de8a/exec-a8a12211-8420-4ab5-8912-cd939f36f5fc.png`. WebP quality 88; proportional small variant, no crop. V2 uses these new filenames so the prior scene remains available and browser caches do not retain the old artwork.

The updated scene uses black silhouette contours, angular cel-shaded faces and fabric, cool navy architecture and shadows, and controlled amber lamplight. All nine adults and the conversation-circle composition are retained. Page layout, illustration credit, intrinsic dimensions, lazy loading and responsive source behavior are unchanged.

## Original assets — retained, no longer shown in V2

- `static/images/home-reimagined/community-circle-v2.webp`: 1774×887, 264,464 bytes.
- `static/images/home-reimagined/community-circle-v2-small.webp`: 888×444, 99,764 bytes.

The original generated PNG remains at `/Users/djwayne/.codex/generated_images/01a08c54-552f-7240-bbaa-b8f7d736de8a/exec-6d394be3-3a76-4658-b680-088f6cb82752.png`. WebP versions use quality 84; the small version is resized proportionally. No content edits or crop.

This is an imagined scene, not a photograph of actual community members. It is labeled as an illustration on the page. Nine modern adults and warm courtyard lamplight make the community invitation more concrete while fitting the existing amber palette. The full scene appears before the community copy; responsive sources, lazy loading, and intrinsic dimensions limit its loading cost and reserve its layout space.

## Original generation prompt

```text
Use case: illustration-story.
Asset type: original panoramic editorial illustration for the 9takes landing page, between the private perspective exercise and invitation to a community conversation.
Primary request: nine modern-day young adults sitting in a loose circle, talking and listening to each other beneath a warm streetlamp at dusk. Make the exchange feel alive and intimate: one person gesturing gently while speaking, others leaning in, one thoughtful listener, another quietly smiling. People with varied appearances and genders, casual contemporary clothing, all clearly adults in their twenties and thirties.
Scene: a small inviting urban courtyard, simple cafe chairs arranged in a circle with an open foreground, a single amber streetlamp behind them, subtle weathered stone architecture in the background to echo a modern symposium. No audience, no stage, no phones, no logos.
Style: sophisticated hand-painted editorial illustration with textured brushwork, restrained realistic anatomy and expressive faces, warm natural skin tones, tactile grain, painterly rather than photographic or cartoonish. Not a photograph of actual community members.
Composition: wide landscape 2:1 aspect ratio, eye-level slightly elevated view, the full circle and all nine people clearly visible. Keep the people inside the central 85 percent of the width, heads in the middle vertical band, with generous dark atmospheric space above and a little courtyard ground below. Distinct silhouettes and clear uncluttered anatomy. The scene should read at mobile width.
Lighting and palette: amber lamplight, warm charcoal and deep olive shadows, sandstone, muted terracotta, cream clothing accents. Luminous faces and hands, calm and welcoming rather than gloomy. This should harmonize with a black-and-amber website and still look good on warm off-white.
Constraints: no text, no speech bubbles, no typography, no watermark, no collage, no split panels, no posed corporate stock-photo smiles.
```

## Cel-shaded neo-noir regeneration prompt

```text
Use case: style-transfer. Redraw the community conversation scene in Image 1 in the drawing and rendering style of Images 2 and 3.
Input roles: Image 1 is the edit target and composition reference only: preserve the nine adults, their varied appearances, relaxed circle of cafe chairs, speaking/listening gestures, courtyard, and single streetlamp. Images 2 (red car) and 3 (garage workspace) are STYLE REFERENCES ONLY. Borrow their confident ink contours, hard angular tonal planes, low-key cool palette and clean flat illustration finish. Do not copy their cars, brands, characters, devices, screenshot arrows, text or compositions.

Create a cinematic cel-shaded neo-noir illustration. Use clean black ink contours, slightly angular forms, stylized realistic proportions, and coherent perspective. Render most surfaces in two or three distinct tonal planes with crisp shadow edges. Establish large graphic shadow masses and sparse, intentional highlights. Use a low-key palette of charcoal, midnight navy, slate blue-gray, and muted earth tones, with natural skin tones and one controlled rich accent color. Keep the focal subject readable against the dark surroundings. Give metal, glass, and fabric simplified but convincing material cues. Use directional lighting, subtle warm and cool color contrast, and the composition of a candid film still. Maintain a clean illustrated finish with minimal surface texture. Limit soft blending to small light effects. Follow the scene brief for subjects, objects, setting, and framing.

Scene brief: Nine modern adults in their twenties and thirties, with varied genders and appearances, sit in a loose circle in a stone urban courtyard after dusk. A woman near the middle-left is talking with a natural hand gesture; the other eight listen with distinct relaxed postures. Preserve the group and open center of Image 1. Faces are simplified into drawn angular planes, with expressive silhouettes and natural proportions. Clothing is flat navy, slate, olive and warm ivory, defined by a few crisp angular folds, without knit texture or photorealistic fabric detail. Streetlamp behind the group is the one dominant light source, with muted amber #B18849 highlights on faces and hands. Most of the courtyard and clothing should be cool charcoal #0C0D13, midnight navy #191C2A and slate #37424F; remove the uniform brown/orange cast of Image 1. Dark shapes remain separated enough to read all nine people at mobile scale. Simplify leaves and stone into sparse clean graphic shapes. Mood: thoughtful, welcoming, candid conversation, grounded and adult. Wide 2:1 landscape with full group visible, no cropped heads or missing participants, no text space needed.

Critical style correction: this must be an obviously drawn 2D illustration with substantial black silhouette outlines and flat two- or three-tone cel shading on every face, hand, garment and chair. Fully redraw the picture; do not apply an illustration filter to a photograph. Match the flatness and contour strength of the two style references. No photorealistic rendering, photographic skin, painterly brushwork, grain, glossy 3D, airbrushing across objects, soft cinematic photographic depth of field, watercolor, halftone, oversized anime eyes, neon, heavy bloom, arbitrary lettering, logos or watermark.
```
