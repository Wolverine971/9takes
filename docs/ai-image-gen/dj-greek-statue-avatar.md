<!-- docs/ai-image-gen/dj-greek-statue-avatar.md -->

# DJ Greek-Statue Avatar — 9takes Instagram Profile Photo

Turns a real photo of DJ into a **classical marble portrait bust** for use as the @9takesdotcom Instagram avatar. A face converts better than a logo; a marble bust of DJ ties the founder to the 9takes brand glow (amber-gold on near-black, same as the personality-analysis cards).

Fuses two existing house patterns:

- The **Greek-statue aesthetic** from the `midjourney-prompt` skill (marble white, gold accents, sculptural).
- The **"attach a real photo, keep the exact likeness, only restyle it"** transform pattern from [`moody-portrait-prompt.md`](./moody-portrait-prompt.md).

---

## The one rule that makes this work

This is an **image edit / transform**, not text-to-image. Text-to-image invents a random Greek face. You must **upload a photo of DJ** and run an edit (ChatGPT / Gemini "Nano Banana", or Midjourney with `--cref`).

**Source photo:** clear, well-lit, front-or-three-quarter head-and-shoulders, neutral or faint confident expression, even lighting, nothing covering the face.

## The figure

A **classical marble portrait bust** — head-and-shoulders, three-quarter turn, eyes slightly off-camera (thoughtful, not posed), on the near-black void with amber-gold rim light.

- **Bust, not full body** — profile pics render in a tiny circle; the face must fill the frame.
- **Marble skin, DJ's real features** — carve _his_ bone structure, not a generic idealized Greek face, or it stops looking like him.
- **Amber-gold rim glow on black** — locked 9takes brand signature (amber, never teal/rose as primary).

---

## Prompt — ChatGPT / Gemini route (recommended)

Attach DJ's photo, paste this:

```
Transform the attached photo of this man into a classical Greek marble statue bust — as if a master sculptor carved HIM specifically from a single block of white Carrara marble. This must still clearly and recognizably be the same man: keep his exact bone structure, face shape, nose, brow, jawline, hairstyle, head angle, and expression. Sculpt those real features in marble — do not replace them with a generic idealized Greek face.

Material: His skin, hair, and shoulders become smooth polished white marble with subtle natural veining and the faint translucency of real stone. Eyes carved as classical statue eyes (blank/pupil-less is fine) OR keep a faint living catch-light — whichever reads more like him. Light tool-chisel texture on the hair.

Background: Deep near-black charcoal void (#0a0a0f) with a rich glowing amber-gold radial atmosphere behind the head, like warm light bleeding through darkness. No red.

Lighting: Strong dramatic amber-gold rim/back light (#f59e0b) tracing the edges of his head, jaw, and shoulders so the marble separates from the black background with a glowing outline. High-contrast chiaroscuro, warm amber light raking across the carved stone. Single warm source behind and slightly above.

Style: Photographic render of a real museum marble sculpture, hyper-detailed stone texture, sculptural, premium, moody. 1:1 square, subject centered, head-and-shoulders bust. No text, no logos, no pedestal label.
```

## Prompt — Midjourney route

Use the photo as a face reference. Put the image URL first, then:

```
<your-photo-URL> classical marble statue bust carved in the exact likeness of this man, his real bone structure and expression rendered in polished white Carrara marble with subtle veining, head-and-shoulders three-quarter view, deep black void background with glowing amber-gold radial atmosphere behind the head, dramatic amber-gold rim lighting tracing the edges of the marble, high-contrast chiaroscuro, Unreal Engine, Cinematic, hyper-detailed stone texture, beautifully color graded, 32k, Global Illumination, Ray Tracing, hyper realistic, museum sculpture --cref <your-photo-URL> --cw 80 --ar 1:1 --stylize 200 --raw
```

`--cw 80` keeps strong likeness while letting the marble styling take over. Drop toward 40–60 if it stays too photo-real and won't turn to stone.

---

## Tuning knobs

- **Doesn't look like DJ anymore** → add `do not idealize or symmetrize his features; preserve his real asymmetries`, and lower `--cw`.
- **Too cold/dead for a "face people respond to"** → keep living eyes (catch-light option), or go half-and-half: `marble texture on skin but keep his natural eye color and a faint warmth, like a living statue.` This hybrid usually reads warmest in a tiny avatar.
- **Marble looks flat/fake** → add `raking side light, visible subsurface scattering in the stone, museum gallery spotlight`.

## Why this works (the 4 ingredients — same as the moody portrait)

1. **One saturated background hue** (amber-gold) wrapping the whole frame.
2. **Rim / back lighting** in that hue tracing the subject's edges — the glow from behind.
3. **Subject pushed into high-contrast chiaroscuro** so sculpted highlights and colored light-spill carry the image.
4. **One material story** (carved marble) applied to _DJ's real features_ so it still reads as him.
