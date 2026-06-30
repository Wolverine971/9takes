<!-- docs/ai-image-gen/moody-portrait-prompt.md -->

# Moody Backlit Portrait — ChatGPT Image Prompt

Turns a plain 9takes profile portrait (e.g. `static/types/1s/Tim-Ferriss.webp`) into a moody, cinematic, amber-backlit variant that matches the brand glow on the personality-analysis cards.

**How to use:** Open ChatGPT image generator, attach the source portrait, and paste the prompt below.

---

## Prompt (copy everything in the block)

```
Transform the attached portrait into a moody, cinematic, backlit image. Keep the person's exact face, likeness, head angle, and expression — this must still clearly be the same man. Only change the lighting, color, and background.

Background: Replace the white background with a deep near-black charcoal void (#0a0a0f) filled with a rich, glowing amber-gold radial atmosphere behind the head — like warm light bleeding through darkness. No red anywhere.

Lighting: Strong dramatic rim/back lighting in amber-gold (#f59e0b) tracing the edges of his head, ears, jaw, and shoulders so he separates from the dark background with a glowing outline. Push the front of the face and body into deep shadow with high-contrast chiaroscuro, letting warm amber light spill across the skin and the jacket. Cinematic, sculptural, moody — think a single warm light source behind and slightly above him.

Eyes: Subtle warm amber catch-light glow in the eyes as the single bright accent.

Color palette: Dominant amber and gold (#f59e0b, #d4af37, #fbbf24) against near-black (#0a0a0f). Optionally a faint cool teal (#06b6d4) edge accent on the far shadow side for depth. Warm, premium, mysterious.

Style: Photographic, high detail, realistic skin texture, dramatic studio portrait lighting, 1:1 square, subject centered, head-and-shoulders. No text, no logos.
```

---

## Tweak knobs (edit the prompt after the first run)

- **Too dark / can't see him** — change "deep shadow" to "moderate shadow, face still clearly readable."
- **Want glowing eyes instead of shadowed eyes** — swap the Eyes line for: `Subtle warm amber catch-light glow in the eyes as the single bright accent.`
- **Want it flatter / more graphic** (closer to a flat-color background) — change the Background line to: `Flat, fully saturated amber-gold background, evenly lit.`
- **Purple scribble won't go away** — the source file has a purple censor bar over the eyes; add: `Ignore and remove any purple marks over the eyes.`

---

## Why this works (the 4 ingredients)

1. **One saturated background hue** wrapping the whole frame.
2. **Rim / back lighting** in that same hue tracing the subject's edges — the "glow from behind."
3. **Subject pushed into deep shadow** so only sculpted highlights and colored light-spill survive (high-contrast chiaroscuro).
4. **One bright accent** (here: the eye-shadow band, or optional eye glow).

The reference image used red; this swaps it for 9takes amber/gold (`#f59e0b`) over the void background (`#0a0a0f`) already used behind the profile cards.
