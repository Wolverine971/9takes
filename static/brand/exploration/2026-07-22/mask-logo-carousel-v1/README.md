# 9takes nine-face logo and Instagram carousel v1

This package converts the approved nine-mask mosaic into a square logo mark and a 10-slide Instagram carousel.

## Logo system

Primary mark:

- `9takes-nine-face-slot-logo-v1.png` — 2048×2048 master, no text.
- `9takes-nine-face-slot-logo-v1-{1024,512,256,192,128,64,48,32}.png` — prepared size exports.
- `9takes-nine-face-slot-logo-v1-quiet.png` — lower-contrast stone-frame alternate.
- `9takes-nine-face-logo-board-v1.png` — construction and scale presentation.

The mark preserves the approved triad order:

```text
8  9  1
2  3  4
5  6  7
```

The old Rubik-style nine-slot structure remains, but the perspective side has been removed. Every slot now contains one of the approved expression masks. Type 3 remains at the center because persona and performance are the most literal expression of the mask metaphor.

## Instagram carousel

The `carousel/` directory contains ten 1080×1350 PNG slides:

1. Cover with the nine-face logo and all nine passion-to-virtue pairs.
2. Type 1 — Anger → Serenity.
3. Type 2 — Pride → Humility.
4. Type 3 — Deceit → Truthfulness.
5. Type 4 — Envy → Equanimity.
6. Type 5 — Avarice → Non-attachment.
7. Type 6 — Fear → Courage.
8. Type 7 — Gluttony → Sobriety.
9. Type 8 — Lust → Innocence.
10. Type 9 — Sloth → Action.

`9takes-nine-passions-carousel-contact-sheet.png` shows the complete sequence. `carousel/caption-and-alt-text.md` contains a suggested Instagram caption, framework note, sources, hashtags, and accessibility text.

## Brand system

- Deep night: `#0a0807`
- Night stone: `#16110d`
- Sodium amber: `#f59e0b`
- Deep amber: `#b45309`
- Marble: `#faf8f4`
- Warm marble: `#ede6da`
- Supporting stone: `#5c4f47`
- Typography: Inter-led, uppercase mono-style labels, large restrained display type.

The recurring line is the existing 9takes statement:

> One situation, 9 ways to see it.

## Content method

The passion and virtue mapping follows the Enneagram of Personality table used in the project research. The short explanations were checked against The Narrative Enneagram's focus-of-attention and life-lesson descriptions.

Terms are translated from their Enneagram meaning rather than their everyday cliché:

- Avarice means conserving access, time, knowledge, and energy.
- Gluttony means appetite for options, stimulation, and future experience.
- Lust means excess intensity and force, not seduction.
- Sloth means self-forgetting and inertia around personal priorities.

The carousel presents this language as a reflective framework, not a scientific or clinical assessment. Enneagram schools differ on some terminology.

## Rebuild

Run from the repository root:

```bash
node static/brand/exploration/2026-07-22/mask-logo-carousel-v1/build-logo-carousel.mjs
```

No live favicon, application icon, or production brand asset is changed by the build.
