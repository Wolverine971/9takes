<!-- docs/brand/canva-design-handoff.md -->

# 9takes — Canva Design Handoff

> **For:** Any agent or designer building Canva assets for 9takes.
> **Source of truth:** [`cold-light.md`](./cold-light.md) (Cold Light, locked 2026-11-05). Tokens: `docs/design-system.md`.
> **If this doc and `cold-light.md` disagree, cold-light.md wins.**
>
> Streetlamp Symposium (sodium amber, warm stone, Inter, JetBrains Mono kickers) was retired on
> 2026-11-05. So were the older purple Solo Leveling, Noticia Text and Rajdhani / Space Grotesk
> looks. Don't pull from old templates; rebuild them in Cold Light.
>
> **Agents never generate images.** No Canva AI generate, OpenRouter, Gemini or other image APIs.
> Write the finished prompt and hand it to DJ; he runs it in ChatGPT on his own subscription.

---

## 0. The 30-second brief

You are designing for **9takes**, a personality-based Q&A platform built on the Enneagram. The look
is called **Cold Light**, and its story is **hidden until you answer.**

> Most of the internet lets you watch. 9takes doesn't. Every question stays in the dark until you
> answer it. Then the other takes come into the light.

**Brand promise:** _See the emotions behind every take._

**Four things every asset should do:**

1. **Stop the scroll and ask them in.** Most people see this on a phone, mid-scroll.
2. **Stay mostly dark.** Dark is the unknown.
3. **Show that something's there without showing what it says.** Counts, type numbers, blurred rows. Never the text of a take before someone answers.
4. **Pair a loud line with a quiet one.** Anton uppercase for the take, Playfair italic for the feeling under it.

---

## 1. What we are NOT

- ❌ Amber, orange or any warm light (the retired Streetlamp look, including old templates)
- ❌ Pure black backgrounds
- ❌ Hacker clichés: code rain, glitch text, skulls. The mystery is about people, not the dark web.
- ❌ Cruelty. Honest, never mean.
- ❌ Generic SaaS template (Notion / Linear / Stripe minimalist)
- ❌ Wellness-app softness (Headspace, Calm, pastel gradients, big rounded blobs)
- ❌ Solo Leveling / gaming UI (XP bars, particle effects, neon glow chains)
- ❌ Mystical / Illuminati cosplay (eye-in-pyramid, sacred geometry, tarot)
- ❌ MBTI / 16personalities cartoon-coded (cute mascots, primary-color flat illustrations)
- ❌ Red-pill / "The Game" bro aesthetic
- ❌ Photos of people, places or phones as brand imagery

If a draft starts feeling like any of these, stop and reset.

---

## 2. Color palette (Cold Light — LOCKED 2026-11-05)

### 2a. Brand colors

```
NIGHT (the unknown)
  --bg              #01010D   ← every background. Never pure #000.
  --surface         #0C0B22   ← cards, panels
  --surface-raised  #131133   ← raised rows, inner boxes

INDIGO (what's under the surface)
  --accent          #6331FB   ← statue tint, fills, glows, tags. NEVER text.
  --accent-deep     #24127A   ← deep fills

LAVENDER (what's revealed)
  --highlight       #CFC2FF   ← italic voice lines, underlined links, highlights

MINT (the key)
  --action          #88F9C0   ← "Give your take." One per view.
  --text-on-action  #01010D   ← label on mint

TEXT
  --text            #F4F2FF   ← headlines
  --text-muted      #BDB8DA   ← body
  --text-faint      #8D88AE   ← counts, dates, labels

RULE
  --rule            rgba(207,194,255,.14)   ← 1px hairlines
```

### 2b. Critical color rules

1. **Mint is the key, so ration it.** One mint element per asset view, and only for the action (give your take, answer first). Nothing decorative is ever mint.
2. **Indigo is never text.** It's 3.3:1 on Night. Use it for fills, tags (with `#F4F2FF` text on top, 5.7:1), glows and the statue tint.
3. **Lavender is the reveal.** Italic voice lines and highlights. Links are always underlined.
4. **Backgrounds are Night or Surface.** Never pure black, never warm stone, never white.
5. **Borders over shadows.** 1px Rule hairlines do the work.
6. **No amber, no warm light.** If you reach for amber, the answer is lavender (for emphasis) or mint (for action).

### 2c. Enneagram type colors (data only, never chrome)

Use only when an asset represents one type, as a small mark. Never a background or button.

| Type | Name          | Hex       |
| ---- | ------------- | --------- |
| 1    | Perfectionist | `#6366F1` |
| 2    | Helper        | `#F472B6` |
| 3    | Achiever      | `#F59E0B` |
| 4    | Individualist | `#A855F7` |
| 5    | Investigator  | `#0EA5E9` |
| 6    | Loyalist      | `#22C55E` |
| 7    | Enthusiast    | `#FBBF24` |
| 8    | Challenger    | `#DC2626` |
| 9    | Peacemaker    | `#34D399` |

---

## 3. Typography (LOCKED — three faces, no fourth)

| Family                      | Role                                      | Rules                                                   | Canva               |
| --------------------------- | ----------------------------------------- | ------------------------------------------------------- | ------------------- |
| **Anton**                   | The take. What gets said out loud.        | Uppercase only. 40px and up. Never a full sentence.     | Anton ✅            |
| **Playfair Display italic** | The feeling. What's underneath.           | Second line of a headline, inner-voice lines. Lavender. | Playfair Display ✅ |
| **Archivo**                 | The conversation. Everything people read. | Body, captions, labels, buttons. Regular to semibold.   | Archivo ✅          |

### Type scale for assets (1080px-wide canvas)

```
shout-xl    120–160px   Anton           uppercase   cover headline
shout       64–96px     Anton           uppercase   slide headline
voice       36–48px     Playfair italic             line under the headline (lavender)
talk-lg     32–36px     Archivo 500                 body on slides
talk        26–28px     Archivo 400                 captions
label       20–22px     Archivo 600     uppercase, +0.08em tracking   counts, tags (faint)
```

### Color rules for type

| Element             | Color                        |
| ------------------- | ---------------------------- |
| Anton headline      | `--text` `#F4F2FF`           |
| Playfair voice line | `--highlight` `#CFC2FF`      |
| Body                | `--text-muted` `#BDB8DA`     |
| Labels, counts      | `--text-faint` `#8D88AE`     |
| Links / URLs        | `--highlight`, underlined    |
| Mint button label   | `--text-on-action` `#01010D` |

### The signature pairing (★)

```
ANSWER BEFORE
THE CROWD
What will they think of me?
```

Loud take in Anton, quiet feeling in Playfair italic. Use it on every cover. JetBrains Mono `§NN · LABEL`
kickers are retired with Streetlamp; if a slide needs a label, use Archivo uppercase in faint.

---

## 4. Radius, borders, glows

### Radius (lint-enforced in code, match it in Canva)

```
4px    badges, dots
10px   buttons, inputs, chips     ← THE button radius
16px   cards, panels, banners
full   avatars, pills only
```

Buttons are 10px, not pills.

### Borders

1px `rgba(207,194,255,.14)` hairlines. Inside cards, around panels, between rows.

### Glows

Soft indigo only, small and low alpha, behind a statue or a selected item. No glow chains, no neon.

---

## 5. Logos & brand marks (live URLs)

The `static/` directory is served at the site root. Any file at `static/foo.png` is live at `https://9takes.com/foo.png`.

### Primary logo

The live files below are the nine-mask mark. Cold Light recolors it with the statue tint (option A). Until the recolored files ship at these same URLs, use the master at `docs/design/homepage-whispering-statues/logo-nine-mask-statue-tint.png`, not the amber-lined version.

| Asset                           | Live URL                                                                                                               | Use                                  |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **Nine-mask production logo** ★ | [https://9takes.com/brand/9takes-nine-mask-logo.png](https://9takes.com/brand/9takes-nine-mask-logo.png)               | Primary optimized 512px public logo  |
| Nine-mask 512                   | [https://9takes.com/brand/9takes-nine-mask-logo-512.png](https://9takes.com/brand/9takes-nine-mask-logo-512.png)       | Structured data and large placements |
| Nine-mask 192                   | [https://9takes.com/brand/9takes-nine-mask-logo-192.png](https://9takes.com/brand/9takes-nine-mask-logo-192.png)       | Footer, cards, and compact UI        |
| Social card                     | [https://9takes.com/brand/9takes-nine-mask-social-card.png](https://9takes.com/brand/9takes-nine-mask-social-card.png) | OG and social fallback image         |

### Legacy brand marks (do not use for new work)

| Asset            | Live URL                                                                                   | Use                    |
| ---------------- | ------------------------------------------------------------------------------------------ | ---------------------- |
| Dark Rubix (PNG) | [https://9takes.com/brand/darkRubix.png](https://9takes.com/brand/darkRubix.png)           | Retired cube mark      |
| Dark Rubix (SVG) | [https://9takes.com/brand/darkRubix.svg](https://9takes.com/brand/darkRubix.svg)           | Vector version         |
| Dark Rubix Thick | [https://9takes.com/brand/darkRubixThick.png](https://9takes.com/brand/darkRubixThick.png) | Heavier-stroke variant |
| Nimbus           | [https://9takes.com/brand/nimbus.png](https://9takes.com/brand/nimbus.png)                 | Retired poster mark    |
| Enneagram symbol | [https://9takes.com/enneagram.svg](https://9takes.com/enneagram.svg)                       | Enneagram diagrams     |

### Legacy logo color variants

| Asset      | Live URL                                                                           | Tint        |
| ---------- | ---------------------------------------------------------------------------------- | ----------- |
| Aria       | [https://9takes.com/brand/aria.png](https://9takes.com/brand/aria.png)             | Pink / rose |
| Fresco     | [https://9takes.com/brand/fresco.png](https://9takes.com/brand/fresco.png)         | Warm        |
| Oceanic    | [https://9takes.com/brand/oceanic.png](https://9takes.com/brand/oceanic.png)       | Teal        |
| Polar      | [https://9takes.com/brand/polar.png](https://9takes.com/brand/polar.png)           | Cool / icy  |
| Rock Rubix | [https://9takes.com/brand/rock-rubix.png](https://9takes.com/brand/rock-rubix.png) | Textured    |

### Superseded Greek face exploration

These files document the exploration that preceded the approved nine-mask mark. Do not use them as the current logo.

| Asset                              | Live URL                                                                                                                         | Use                           |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Greek face icon (SVG)              | [https://9takes.com/brand/concepts/icon-3-greek-face.svg](https://9takes.com/brand/concepts/icon-3-greek-face.svg)               | Vector master                 |
| Greek face — 512px                 | [https://9takes.com/brand/concepts/icon-3a-greek-face-512.png](https://9takes.com/brand/concepts/icon-3a-greek-face-512.png)     | Large raster                  |
| Greek face — 256px                 | [https://9takes.com/brand/concepts/icon-3a-greek-face-256.png](https://9takes.com/brand/concepts/icon-3a-greek-face-256.png)     | Medium raster                 |
| Greek face — 128px                 | [https://9takes.com/brand/concepts/icon-3a-greek-face-128.png](https://9takes.com/brand/concepts/icon-3a-greek-face-128.png)     | Small raster                  |
| Greek face — 64px                  | [https://9takes.com/brand/concepts/icon-3a-greek-face-64.png](https://9takes.com/brand/concepts/icon-3a-greek-face-64.png)       | Tiny raster                   |
| Greek face — 32px                  | [https://9takes.com/brand/concepts/icon-3a-greek-face-32.png](https://9takes.com/brand/concepts/icon-3a-greek-face-32.png)       | Favicon-tier                  |
| Greek reader (statue + book) — 512 | [https://9takes.com/brand/concepts/icon-3b-greek-reader-512.png](https://9takes.com/brand/concepts/icon-3b-greek-reader-512.png) | "Reader / scholar" variant    |
| Greek reader — 256                 | [https://9takes.com/brand/concepts/icon-3b-greek-reader-256.png](https://9takes.com/brand/concepts/icon-3b-greek-reader-256.png) | Same, smaller                 |
| Marble Nine (SVG)                  | [https://9takes.com/brand/concepts/icon-4-marble-nine.svg](https://9takes.com/brand/concepts/icon-4-marble-nine.svg)             | Numeral 9 in marble treatment |

### Favicons & app icons

| Size         | Live URL                                                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| 16×16        | [https://9takes.com/brand/favicon-nine-mask-16x16.png](https://9takes.com/brand/favicon-nine-mask-16x16.png)                 |
| 32×32        | [https://9takes.com/brand/favicon-nine-mask-32x32.png](https://9takes.com/brand/favicon-nine-mask-32x32.png)                 |
| 48×48        | [https://9takes.com/brand/favicon-nine-mask-48x48.png](https://9takes.com/brand/favicon-nine-mask-48x48.png)                 |
| Apple Touch  | [https://9takes.com/brand/apple-touch-icon-nine-mask.png](https://9takes.com/brand/apple-touch-icon-nine-mask.png)           |
| PWA 192      | [https://9takes.com/brand/app-icon-nine-mask-192.png](https://9takes.com/brand/app-icon-nine-mask-192.png)                   |
| PWA 512      | [https://9takes.com/brand/app-icon-nine-mask-512.png](https://9takes.com/brand/app-icon-nine-mask-512.png)                   |
| PWA Maskable | [https://9takes.com/brand/app-icon-nine-mask-maskable-512.png](https://9takes.com/brand/app-icon-nine-mask-maskable-512.png) |

---

## 6. Imagery

### The statue standard (★)

**Statues only, one shared tint.** Every image is a Greek marble statue made in plain grey stone,
then given the same indigo tint.

- Dry, matte, weathered marble with blank carved eyes
- One light from the upper left on a black background
- Restrained expressions, like real sculpture
- No text inside the image
- No photos of people, places or phones
- The tint ramp is applied after generation with sharp: `#01010D` (0) → `#160A46` (.30) → `#6331FB` (.62) → `#BEAAFF` (.88) → `#ECE6FF` (1)

Prompt standard: `docs/design/image-refresh-2026-11-04/README.md`. Worked prompts:
`docs/design/homepage-whispering-statues/prompts-emotions.md`. DJ generates; agents write prompts.

### Existing hero files

`greek_distorted_statue_face.png` is the material reference for new statues. Use it on brand assets
only after it has been run through the indigo tint. The philosopher gathering, Greek pantheon and
Acropolis images are retired for brand assets (they're places and scenes, not statues on black).

### Founder (DJ): author bio only

These are for author bios. They are not brand imagery; Cold Light brand imagery is statues only. The lazer-eyes and pixel variants are off-brand for new work.

| Asset            | Live URL                                                                                     | Use                         |
| ---------------- | -------------------------------------------------------------------------------------------- | --------------------------- |
| DJ profile photo | [https://9takes.com/brand/dj-profile-pic.webp](https://9takes.com/brand/dj-profile-pic.webp) | Author bio                  |
| DJ face (PNG)    | [https://9takes.com/brand/djface.png](https://9takes.com/brand/djface.png)                   | Author bio (transparent)    |
| DJ lazer eyes    | [https://9takes.com/brand/dj-lazer-eyes.webp](https://9takes.com/brand/dj-lazer-eyes.webp)   | Fun / crypto / meme style   |
| Pixel DJ         | [https://9takes.com/brand/pixelDJ.png](https://9takes.com/brand/pixelDJ.png)                 | Retro / pixel-art treatment |
| Pixel DJ (lazer) | [https://9takes.com/brand/pixelDJ-lazer.png](https://9takes.com/brand/pixelDJ-lazer.png)     | Retro + lazer eyes combo    |

---

## 7. Composition rules

### 7a. Dark, then the reveal

The asset is mostly Night. Light marks what you're allowed to see. The statue's lit face, the
headline and any revealed take are the bright parts; everything else stays dark.

### 7b. Show that takes exist, not what they say

To show the product, use the hidden state: a question in Text, a count (`9 takes`), type numbers in
small circles, and blurred rows where the take text would be. Never put the words of a real take on
an asset that hasn't asked the viewer to answer first.

### 7c. One mint element

If the asset has a call to action, it's the one mint element: a 10px-radius button with Night text.
If there's no action, there's no mint.

### 7d. Hairline structure

1px Rule borders around panels and between rows. Shadows are rare.

---

## 8. Asset templates

### Instagram square post (1080×1080)

- Background: Night `#01010D`
- Tinted statue on one side, lit from the upper left, fading into Night
- Anton headline (uppercase, Text) with a Playfair italic line under it in Lavender
- `9takes.com` bottom-left in Archivo, faint
- Optional 1px Rule border inset 24px

### Instagram carousel slide (1080×1350, 4:5)

- Cover: loud/quiet headline pair + tinted statue
- Body slides: Anton headline → 2–3 lines of Archivo body in Muted → optional Playfair line in Lavender
- One bright reveal slide for the payoff
- Closing slide: "Answer before the crowd" + one mint button

### Twitter / X card (1200×675)

- Background: Night, Surface panel optional
- Nine-mask logo (statue tint) top-left
- Anton headline, Playfair voice line, tinted statue right third

### OG / blog social card (1200×630)

- Night background, Anton title, Playfair line, tinted statue
- For question cards: the question and a take count. Never the text of a take.

### Canva Brand Kit setup

**Colors:**

```
Night            #01010D   ← bg
Surface          #0C0B22
Surface Raised   #131133
Indigo           #6331FB
Indigo Deep      #24127A
Lavender         #CFC2FF
Mint             #88F9C0   ← CTA only
Text             #F4F2FF
Text Muted       #BDB8DA
Text Faint       #8D88AE
```

**Fonts:** Heading = Anton. Subheading = Playfair Display italic. Body = Archivo.

**Logos:** the nine-mask mark in the statue tint (see §5).

**Templates to rebuild:** IG square, IG carousel cover, IG carousel body, Twitter/X card, OG card.
Delete or archive any amber Streetlamp templates so nobody reuses them.

---

## 9. Brand voice — copy that ships on assets

If the asset has copy on it, the copy should sound like 9takes. Pull from `docs/brand/brand-style-guide-v2.md` — short version:

### Voice attributes (4 traits)

1. **Tactically Direct** — no fluff, actionable. _"Type 6s signal loyalty through questions — answer them, don't get defensive."_
2. **Socially Savvy** — connect insight to real-world wins.
3. **Respectfully Provocative** — challenge without shaming.
4. **Pattern-Recognition Focused** — show emotional logic.

### Mechanics

- **Sentence rhythm:** Hook · insight · action step.
- **Verbs over adjectives:** decode, navigate, map, read, unlock, resolve.
- **2nd person:** speak to _you_, not _we_ or _users_.
- **Numerals, not words:** "9 types", not "nine types".
- **Em dashes for sharp insights.** Minimal parentheses.
- **No academic tone.** Read it aloud — if it sounds stiff, rewrite.

### Taglines (use these exactly — updated 2026-08-13, source: `messaging-hierarchy.md`)

- **Primary:** _See the emotions behind every take._
- **Secondary:** _One question, nine perspectives._
- **CTA line:** _Answer before the crowd._
- **Formula:** _Honesty + Curiosity = Clarity._

Retired from assets: "One situation, 9 ways to see it", "personality-max your EQ", "open source
conflict resolution".

### What NOT to say on assets

- ❌ "personality test" → say "personality analysis" or "Enneagram read"
- ❌ "self-improvement" / "personality-maxing" → anchor to the payoff: understanding, blind spots, seeing what you can't
- ❌ "improve relationships" → say "decode social dynamics"
- ❌ "users" → say "you"
- ❌ "we believe" / "we think" → just make the claim
- ❌ Wellness verbs: "heal", "journey", "mindful" — wrong category
- ❌ Bro verbs: "dominate", "alpha", "crush it" — wrong category

---

## 10. Quick visual audit before exporting

1. ☐ Is the background Night or Surface (not pure black, not warm, not white)?
2. ☐ Is there zero amber, orange or warm light anywhere?
3. ☐ Is there at most **one** mint element, and is it the action?
4. ☐ Is any indigo used as text? (It shouldn't be.)
5. ☐ Are headlines Anton uppercase, with no full sentence in Anton?
6. ☐ Is the type only Anton, Playfair Display italic and Archivo?
7. ☐ Is every image a grey statue with the indigo tint, lit from the upper left?
8. ☐ Does the asset avoid showing what any take says before the viewer answers?
9. ☐ Are corners 4, 10 or 16px?
10. ☐ If there's a logo, is it the nine-mask mark in the statue tint?

---

## 11. When in doubt

- **Pick dark.** Most of the asset is the unknown.
- **Pick one bright moment.** One lit statue, one loud line, one mint action.
- **Pick the hidden state over the answer.** Show that nine takes exist, not what they say.
- **Pick the statue.** Grey stone, upper-left light, indigo tint.

---

## 12. Source-of-truth links

- **Brand spec:** `docs/brand/cold-light.md`
- **Tokens and components:** `docs/design-system.md`
- **Message:** `docs/brand/messaging-hierarchy.md`
- **Voice & copy:** `docs/brand/brand-style-guide-v2.md`
- **Statue prompt standard:** `docs/design/image-refresh-2026-11-04/README.md`

If this doc contradicts `cold-light.md`, fix this doc.
