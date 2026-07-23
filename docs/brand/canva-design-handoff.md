<!-- docs/brand/canva-design-handoff.md -->

# 9takes — Canva Design Handoff

> **For:** Any agent / designer building Canva assets for 9takes.
> **Source of truth:** `docs/design-system.md` (Streetlamp Symposium · V5 · locked 2026-05-04, fully migrated 2026-05-05).
> **If this doc and `docs/design-system.md` disagree, design-system.md wins.**
>
> Older brand docs (`BRAND-KIT.md`, `solo-leveling-*`, purple-primary palettes, Noticia Text serif, Rajdhani / Space Grotesk) are **ARCHIVED**. Do not pull from them. They contradict shipped UI.

---

## 0. The 30-second brief

You are designing for **9takes** — a personality-based Q&A platform built on the Enneagram. The aesthetic is called **Streetlamp Symposium**:

> Late-night philosophers' meetup, lit by a single sodium-vapor streetlamp. Greek statues against deep stone shadow. Tech-spec dossier annotations as the recurring graphic motif. Caravaggio + Hopper warm-pool-against-shadow lighting, never neon, never gradient-drenched.

**One-line promise:** _See the emotions behind every take._

**Three things every asset should do:**

1. Feel like a **document from a smart, slightly-secret room** — not a SaaS landing page, not a wellness app.
2. Use **warm light against deep stone** (chiaroscuro), not flat dark mode.
3. Carry **at least one tech-spec / dossier element** — a `§NN · LABEL` mono kicker, a coordinate annotation, a stat callout, a 1px hairline border. The dossier feel is the brand.

---

## 1. What we are NOT

Memorize this list. The fastest way to ruin a 9takes asset is to drift into one of these aesthetics:

- ❌ Generic SaaS template (Notion / Linear / Stripe minimalist)
- ❌ Wellness-app softness (Headspace, Calm, pastel gradients, big rounded blobs)
- ❌ Solo Leveling / gaming UI wholesale (XP bars, particle effects, neon glow chains)
- ❌ Mystical / Illuminati cosplay (eye-in-pyramid, sacred geometry, tarot)
- ❌ MBTI / 16personalities cartoon-coded (cute mascots, primary-color flat illustrations)
- ❌ Red-pill / "The Game" bro aesthetic (lambo, alpha-male, hustle)
- ❌ Corporate-cold SaaS (Salesforce, Hubspot stock photography of smiling teams)
- ❌ Academic / textbook-stiff (centered serif, beige paper, no edge)

If a draft starts feeling like any of these, stop and reset.

---

## 2. Color palette (V5 — LOCKED)

### 2a. Brand colors — copy these into the Canva Brand Kit

```
PRIMARY (sodium-amber illumination)
  --lamp-glow    #F59E0B   ← THE brand color. CTAs, headlines accent, brand moments.
  --lamp-deep    #B45309   ← hover / pressed
  --lamp-light   #FBBF24   ← highlights

DATA ACCENT (tech-spec teal, dossier mode)
  --data-teal    #0D9488   ← stat panels, mono annotations, "system" feel
  --data-cyan    #5EEAD4   ← active data points, small accents

SURFACES — DARK MODE (default for assets)
  --night-deep   #0a0807   ← page background (deepest)
  --night-mid    #16110d   ← secondary surface
  --stone-warm   #241D17   ← cards / content containers
  --stone-mid    #3a302a   ← elevated / hover
  --stone-edge   #5C4F47   ← 1px hairline borders ★ workhorse

SURFACES — LIGHT MODE (use only when asset will live on a light surface)
  --night-deep   #FAF8F4
  --night-mid    #F2EBDD
  --stone-warm   #FFFFFF
  --stone-mid    #F5F0E8
  --stone-edge   #D6CCB8

MARBLE / INK (text + statue highlights)
  --marble-pure  #FAF8F4   ← statue lit faces, pure-light moments
  --ink-bright   #FAF8F4 (dark) / #1C1917 (light)   ← primary text
  --ink-mid      #A8A095 (dark) / #44403C (light)   ← body
  --ink-dim      #5C4F47 (dark) / #78716C (light)   ← captions, mono labels
  --ink-muted    #3A302A (dark) / #A8A29E (light)   ← disabled / placeholders

SEMANTIC
  success  #10B981
  warning  #F59E0B   (same hex as lamp-glow — use carefully)
  error    #EF4444
```

### 2b. Critical color rules

1. **`--lamp-glow` (`#F59E0B`) is the brand moment.** Use it sparingly — once or twice per asset. If the whole asset is amber, nothing is amber. The point is the warm-pool-against-shadow contrast.
2. **`--data-teal` (`#0D9488`) is for system / dossier moments only** — mono labels in tech-spec mode, stat callouts, "data-flavored" elements. Never for emotion or warmth.
3. **Default backgrounds are `--night-deep` (`#0a0807`) or `--stone-warm` (`#241D17`).** Not pure black, not gray. The brown undertone is intentional.
4. **Borders > shadows.** Static UI uses 1px `--stone-edge` hairlines. Reserve shadows for floating elements (modals, popovers).
5. **No purple as primary.** Purple was the old brand color (`#7c3aed`). It survives only as a tertiary "insight" accent — almost never used on Canva assets. If you reach for purple, ask if amber would do the job.
6. **No teal as primary.** Teal was the de-facto color before V5 lock. It now lives only as `--data-teal` for dossier annotations.

### 2c. Enneagram type colors (data-only — never UI chrome)

Use these **only** when an asset is explicitly representing one of the 9 types (e.g., a Type 4 personality breakdown). Never use them as background colors or button colors for general assets.

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

## 3. Typography (LOCKED — Inter + JetBrains Mono only)

**No serif. No third sans-serif.** Rajdhani, Space Grotesk, and Noticia Text are all retired.

| Family             | Use                                                                            | Canva equivalent                                                |
| ------------------ | ------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| **Inter**          | Display, headlines, body — every size from 12px to 80px                        | Inter (in Canva Free Fonts) ✅                                  |
| **JetBrains Mono** | Section kickers (`§NN · LABEL`), dossier annotations, stat values, coordinates | JetBrains Mono (Canva) ✅ — fallback: IBM Plex Mono, Space Mono |

### Type scale (V5 lock — match in Canva)

```
display-xl    72px   Inter 800   -0.04em letter-spacing   hero tagline
display-lg    56px   Inter 800   -0.03em                  large section headers
display-md    40px   Inter 700   -0.02em                  standard section headers
display-sm    28px   Inter 700   -0.015em                 small section headers
body-lg       18px   Inter 400   1.55 line-height         reading body
body          16px   Inter 400   1.55                     default body
body-sm       14px   Inter 400   1.50                     small body
mono          12px   JetBrains Mono 500   0.08em UPPERCASE   dossier-style labels
mono-lg       14px   JetBrains Mono 500   0.06em UPPERCASE   prominent annotations
```

**Inter weight 800 with tight tracking is doing the heavy lifting.** That's where the "gravitas" comes from. Don't go below 700 for headlines. Don't add italics for emphasis — switch to JetBrains Mono uppercase instead.

### Color rules for type

| Element             | Color                                      |
| ------------------- | ------------------------------------------ |
| H1 / display-xl     | `--lamp-glow` (`#F59E0B`) — once per asset |
| H2–H4               | `--ink-bright` (`#FAF8F4` dark)            |
| Body                | `--ink-bright`                             |
| Caption / metadata  | `--ink-mid` (`#A8A095` dark)               |
| Mono section kicker | `--lamp-glow` (`#F59E0B`)                  |
| Mono footnote       | `--ink-dim` (`#5C4F47` dark)               |
| Links / CTA labels  | `--lamp-glow` with hover underline         |

### The mono kicker pattern (★ signature element)

Every layout-heavy asset should have at least one mono-uppercase section label:

```
§01 · OBSERVATION
§02 · DO YOU KNOW THE ENNEAGRAM?
§04 · THE 9 IN 9 LINES
§NN · LABEL
```

JetBrains Mono · 500 weight · 12–14px · UPPERCASE · letter-spacing 0.08em · color `--lamp-glow`. The `§NN ·` prefix is part of the brand. It tells the eye "this is a labeled region of a diagram, not a marketing card."

---

## 4. Spacing, radius, shadow

### Spacing — 7-token scale

```
xs    4px    hairlines, icon padding
sm    8px    tight gaps between paired elements
md   12px    default small gap
lg   16px    default card padding, default body gap
xl   24px    section gaps inside a card
2xl  32px    section gaps on a page
3xl  48px    major section breaks, hero padding
```

**Bias smaller when in doubt** — 9takes readers want density not airiness. This is a tactical-psychology product, not a meditation app.

### Radius — strict scale (lint-enforced in code)

```
4px    tiny inline (badges, dot indicators)
10px   buttons, inputs, chips, popovers     ← THE button radius
16px   cards, modals, banners
full   pills, avatars, spinners only
```

**Banned:** 8px, 12px, 20px, 24px, anything-else px. **Buttons are 10px, not pill-shaped.** Pill-radius CTAs make us look like a wellness app. The single exception: avatars and status dots are `rounded-full`.

### Shadows — borders do the work

Default: shadows are **off**. Use 1px `--stone-edge` hairline borders for elevation. Reserve shadows for floating UI (modals, popovers, hover state on interactive cards).

If you do need a shadow:

```
sm     0 2px 8px  rgba(0,0,0,0.15)    static cards (rare)
md     0 6px 16px rgba(0,0,0,0.18)    default elevation
lg     0 12px 32px rgba(0,0,0,0.22)   modals, popovers
xl     0 24px 48px rgba(0,0,0,0.25)   hero / floating CTA
```

In dark mode, shadows are barely visible against `#0a0807` regardless — surface lightening (`--stone-warm` → `--stone-mid`) is the primary elevation signal.

### Glows — only two

`--glow-sm` (10px @ low alpha amber) and `--glow-md` (20px @ low alpha amber). Hover and focus states only. **No glow chains. No neon. No `glow-teal` / `glow-rose`** — those were deleted.

---

## 5. Logos & brand marks (live URLs)

The `static/` directory is served at the site root. Any file at `static/foo.png` is live at `https://9takes.com/foo.png`.

### Primary logo

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

## 6. Photography & graphics (live URLs)

### Hero imagery (★ Streetlamp Symposium core)

| Asset                   | Live URL                                                                                                 | Use                                               |
| ----------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Greek statue face** ★ | [https://9takes.com/greek_distorted_statue_face.png](https://9takes.com/greek_distorted_statue_face.png) | **Primary hero subject** — homepage, brand assets |
| Greek pantheon (PNG)    | [https://9takes.com/greek_pantheon.png](https://9takes.com/greek_pantheon.png)                           | About / philosophy pages                          |
| Greek pantheon (WebP)   | [https://9takes.com/greek_pantheon.webp](https://9takes.com/greek_pantheon.webp)                         | Web-optimized                                     |
| Philosopher gathering   | [https://9takes.com/philosopher-gathering.webp](https://9takes.com/philosopher-gathering.webp)           | Community / streetlamp meetup energy              |
| Philosopher (PNG)       | [https://9takes.com/philosopher-gathering.png](https://9takes.com/philosopher-gathering.png)             | Same, raster                                      |
| Acropolis               | [https://9takes.com/acrop.png](https://9takes.com/acrop.png)                                             | Wide architectural backdrop                       |

### Texture / atmospheric

| Asset             | Live URL                                                                     | Use                                            |
| ----------------- | ---------------------------------------------------------------------------- | ---------------------------------------------- |
| Background noise  | [https://9takes.com/bkg-noise.webp](https://9takes.com/bkg-noise.webp)       | Subtle film-grain overlay (low opacity, 5–10%) |
| 9takes border     | [https://9takes.com/border.svg](https://9takes.com/border.svg)               | Decorative frame element                       |
| 9takes border (2) | [https://9takes.com/9takes-border.svg](https://9takes.com/9takes-border.svg) | Alt frame                                      |
| Number 9          | [https://9takes.com/number9.svg](https://9takes.com/number9.svg)             | Standalone numeral graphic                     |

### Content cards

| Asset               | Live URL                                                                                       | Use                 |
| ------------------- | ---------------------------------------------------------------------------------------------- | ------------------- |
| Personality snippet | [https://9takes.com/personality-snippet.webp](https://9takes.com/personality-snippet.webp)     | Feature card        |
| Enneagram corner    | [https://9takes.com/enneagram-corner-card.webp](https://9takes.com/enneagram-corner-card.webp) | Blog card           |
| Questions default   | [https://9takes.com/questions-default.webp](https://9takes.com/questions-default.webp)         | Q&A section default |

### Social cards

| Asset          | Live URL                                                                                   | Use                       |
| -------------- | ------------------------------------------------------------------------------------------ | ------------------------- |
| Twitter card   | [https://9takes.com/twitter-card-9takes.webp](https://9takes.com/twitter-card-9takes.webp) | Twitter / X share preview |
| 9takes preview | [https://9takes.com/9takes-preview.webp](https://9takes.com/9takes-preview.webp)           | Generic OG preview        |
| Small preview  | [https://9takes.com/s-9takes-preview.webp](https://9takes.com/s-9takes-preview.webp)       | Thumbnail                 |

### Founder (DJ) — for personal-brand assets

| Asset            | Live URL                                                                                     | Use                         |
| ---------------- | -------------------------------------------------------------------------------------------- | --------------------------- |
| DJ profile photo | [https://9takes.com/brand/dj-profile-pic.webp](https://9takes.com/brand/dj-profile-pic.webp) | Author bio                  |
| DJ face (PNG)    | [https://9takes.com/brand/djface.png](https://9takes.com/brand/djface.png)                   | Author bio (transparent)    |
| DJ lazer eyes    | [https://9takes.com/brand/dj-lazer-eyes.webp](https://9takes.com/brand/dj-lazer-eyes.webp)   | Fun / crypto / meme style   |
| Pixel DJ         | [https://9takes.com/brand/pixelDJ.png](https://9takes.com/brand/pixelDJ.png)                 | Retro / pixel-art treatment |
| Pixel DJ (lazer) | [https://9takes.com/brand/pixelDJ-lazer.png](https://9takes.com/brand/pixelDJ-lazer.png)     | Retro + lazer eyes combo    |

### Sitting in `static/` but **DO NOT USE**

These exist for legacy reasons and contradict the current design system:

- `static/9takes-color.png`, `9takes-lite.png`, `9takes-med.png` — old logo variants, replaced by `aero`
- `static/brand/account-icon*.png` — UI icons, not brand marks
- `static/brand/w-border.png`, `w-light-border.png` — pre-V5 border treatments
- `static/brand/white-rose.png`, `white-rubix.png` — purple-era marks
- `static/unused/*` — explicitly retired

---

## 7. Composition rules (the recurring visual moves)

These are the structural patterns that make an asset feel like 9takes vs. generic.

### 7a. Chiaroscuro lighting

**One pool of warm light against deep stone shadow.** Inspired by Caravaggio + Hopper.

- Subject lit from one side (left or right, never both)
- Background drops to `--night-deep` (`#0a0807`) at the edges
- Highlight on the lit side uses `--marble-pure` (`#FAF8F4`) or `--lamp-light` (`#FBBF24`)
- Shadow side keeps detail but stays in `--stone-warm` / `--stone-mid` range
- **Never:** rim-lit on both sides, flat fill, gradient backdrop

### 7b. Mono section kickers

Treat copy like a labeled diagram, not a brochure. Every section gets a `§NN · LABEL` mono prefix:

```
§01 · OBSERVATION
§02 · MECHANISM
§03 · WHY TRUST THIS
```

JetBrains Mono · uppercase · 12–14px · letter-spacing 0.08em · `--lamp-glow`. Single line. Above the section heading, not inline with it.

### 7c. Coordinate / dossier annotations

For tech-spec dossier moments (personality analysis assets, stat callouts, "data-flavored" pieces):

```
ID · 9TKS-2026-04
TYPE · 5 (INVESTIGATOR)
WING · 5w4
COORDINATES · 41.40°N · 2.17°E
```

- JetBrains Mono · uppercase · 11–12px
- `--ink-dim` for label, `--data-teal` (`#0D9488`) for value
- Right-align in the grid, hairline-bordered cells

### 7d. 1px stone-edge borders

The default elevation. Borders > shadows for static elements:

```
border: 1px solid #5C4F47   (dark mode)
border: 1px solid #D6CCB8   (light mode)
```

Inside cards. Around panels. Between dossier rows. This is the workhorse — it's why the UI feels documentary instead of card-app.

### 7e. Two-column "split path" diagram

When presenting a binary (yes/no, before/after, etc.), use two equal-width labeled regions, not a single block with branches:

```
§02 · DO YOU KNOW THE ENNEAGRAM?

┌──────────────────────────┐  ┌──────────────────────────┐
│ §02A · NO                │  │ §02B · YES               │
│                          │  │                          │
│ Never heard of it…       │  │ You know the rabbit hole.│
│                          │  │                          │
│ → Start with the basics  │  │ → Drop today's take      │
└──────────────────────────┘  └──────────────────────────┘
```

Different mono-label colors per side (left = `--lamp-glow` amber, right = `--data-teal`). On mobile, stack them vertically.

### 7f. Negative space = deep night, not empty white

Empty space should feel like the void around a streetlamp. Default backgrounds are `--night-deep` or `--stone-warm`, never pure black, never gray, never white-on-dark.

---

## 8. Asset templates (concrete recipes)

### Instagram square post (1080×1080)

- Background: `--night-deep` (`#0a0807`)
- Top-left mono kicker: `§NN · LABEL` in `--lamp-glow`, JetBrains Mono 14px UPPERCASE
- Headline (center-left or top): Inter 800, ~64–72px, `--ink-bright` with one keyword in `--lamp-glow`
- Optional subject: Greek statue face (right side, lit from the left, fading into shadow at the edges)
- Bottom-right: small `9takes.com` wordmark in `--ink-mid`, JetBrains Mono 12px lowercase
- 1px `--stone-edge` border inset 24px from the canvas edge — the "dossier frame"

### Instagram carousel slide (1080×1350, 4:5)

- Same as above, but vertical
- Cover slide: tagline-tier headline + Greek statue
- Body slides: `§NN · LABEL` kicker → headline → 2-3 lines of body in Inter 400 18px → optional pull-quote in `--lamp-glow`
- Closing slide: CTA + `9takes.com`

### Twitter / X card (1200×675)

- Background: `--stone-warm` (`#241D17`) — slightly lifted from full void
- 1px `--stone-edge` border, inset 16px
- Top-left: nine-mask logo (https://9takes.com/brand/9takes-nine-mask-logo-192.png) at ~80px tall
- Mono coordinate strip across the top: `§ ARTICLE · 2026-05-09 · ENNEAGRAM` in `--ink-dim`
- Headline: Inter 800, ~52px, `--ink-bright` with one accent word in `--lamp-glow`
- Optional subject image right-third, chiaroscuro lit

### Personality analysis poster (vertical, 1080×1920)

- This is the **dossier variant** — push the tech-spec annotations hard
- Background: `--night-deep`, optional `bkg-noise.webp` overlay at 6% opacity
- Subject portrait: chiaroscuro lit, fading edges
- Annotations grid: ID / TYPE / WING / KEY-INSIGHT in JetBrains Mono with hairline-bordered cells
- One "key insight" pull-quote in Inter 700 28px, `--ink-bright`
- Footer: `9takes.com/personality-analysis/[slug]` in JetBrains Mono `--ink-dim`

---

## 9. Canva Brand Kit setup checklist

When opening a fresh Canva account or refreshing the Brand Kit, do this in order:

### 9a. Brand colors (paste these hex codes into Canva → Brand Kit → Colors)

```
Lamp Glow         #F59E0B   ← primary
Lamp Deep         #B45309
Lamp Light        #FBBF24
Data Teal         #0D9488
Data Cyan         #5EEAD4
Night Deep        #0a0807   ← bg dark
Night Mid         #16110d
Stone Warm        #241D17
Stone Mid         #3a302a
Stone Edge        #5C4F47   ← borders
Marble Pure       #FAF8F4
Ink Bright        #FAF8F4   (text on dark)
Ink Mid           #A8A095
Ink Dim           #5C4F47
Success           #10B981
Error             #EF4444
```

### 9b. Brand fonts

- **Heading font:** Inter (weight 800 default, weight 700 for sub-headings)
- **Body font:** Inter (weight 400)
- **Accent font:** JetBrains Mono (weight 500, used for `§NN · LABEL` kickers and dossier annotations) — fallback: IBM Plex Mono → Space Mono

### 9c. Upload to Brand Kit → Logos

Pull these from the live URLs and upload to Canva:

- `https://9takes.com/brand/9takes-nine-mask-logo.png` — primary logo
- `https://9takes.com/brand/9takes-nine-mask-logo-512.png` — large raster
- `https://9takes.com/brand/9takes-nine-mask-social-card.png` — social card

### 9d. Upload to Brand Kit → Photos / Graphics

- `https://9takes.com/greek_distorted_statue_face.png` — primary hero subject ★
- `https://9takes.com/greek_pantheon.webp` — pantheon backdrop
- `https://9takes.com/philosopher-gathering.webp` — community
- `https://9takes.com/acrop.png` — acropolis backdrop
- `https://9takes.com/enneagram.svg` — enneagram diagram
- `https://9takes.com/bkg-noise.webp` — texture overlay
- `https://9takes.com/border.svg` — frame

### 9e. Save standard templates

Build and save these as Canva templates:

1. **IG square — dossier card** (1080×1080)
2. **IG carousel cover** (1080×1350)
3. **IG carousel body** (1080×1350)
4. **Twitter / X card** (1200×675)
5. **OG / blog social card** (1200×630)
6. **Personality analysis poster** (1080×1920)

Each template should ship with: dark background, hairline border inset, mono kicker placeholder, Inter 800 headline placeholder, and the nine-mask logo locked to the bottom-right.

---

## 10. Brand voice — copy that ships on assets

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

### Taglines (use these exactly)

- **Primary:** _See the emotions behind every take._
- **Secondary:** _One situation, 9 ways to see it._
- **Mission line:** _Decode social dynamics, personality-max your EQ, turn conflict into understanding._

### What NOT to say on assets

- ❌ "personality test" → say "personality analysis" or "Enneagram read"
- ❌ "self-improvement" → say "personality-maxing"
- ❌ "improve relationships" → say "decode social dynamics"
- ❌ "users" → say "you"
- ❌ "we believe" / "we think" → just make the claim
- ❌ Wellness verbs: "heal", "journey", "mindful" — wrong category
- ❌ Bro verbs: "dominate", "alpha", "crush it" — wrong category

---

## 11. Quick visual audit before exporting an asset

Run through this list. If any answer is "no," fix before shipping.

1. ☐ Is there exactly **one** `--lamp-glow` (`#F59E0B`) moment, not five?
2. ☐ Is the background `--night-deep` / `--stone-warm` (warm-tinted), not pure black or gray?
3. ☐ Is there at least **one** mono kicker (`§NN · LABEL`) or dossier annotation?
4. ☐ Are borders 1px hairline (`--stone-edge`), not heavier?
5. ☐ Are buttons / inputs 10px radius — **not pill, not 8px, not 12px**?
6. ☐ Is the type Inter 800 / 700 (not Rajdhani, not Noticia, not serif)?
7. ☐ Is there chiaroscuro contrast (light-pool against shadow), not flat fill?
8. ☐ Does it avoid the "What we are NOT" list in §1? (No SaaS minimalist, no wellness softness, no Solo Leveling neon, no MBTI cartoon.)
9. ☐ Does the copy use "you" (2nd person), strong verbs, and the Hook → Insight → Action rhythm?
10. ☐ If there’s a logo, is it the approved nine-mask mark—not Aero, the cube, or an exploration asset?

---

## 12. When in doubt

- **Pick warmth over cool.** If torn between teal and amber, choose amber.
- **Pick density over airiness.** 9takes readers want information, not whitespace zen.
- **Pick documentary over decorative.** Hairline borders over drop shadows. Mono labels over icon flourishes. Stat callouts over hero gradients.
- **Pick one bright moment.** One amber accent, one lit subject, one big claim. The rest stays in shadow.
- **Pick the Greek statue.** When you need a hero subject and don't know what else to use, it's the statue. Lit from one side. Fading into stone.

---

## 13. Source-of-truth links for the design system

Anything ambiguous here is settled by these docs:

- **Design system spec:** `docs/design-system.md` (the locked one)
- **V5 mood spec:** `docs/design/2026-05-04-streetlamp-symposium-v5.md`
- **Migration tracker:** `docs/design/migration-progress.md`
- **Voice & copy:** `docs/brand/brand-style-guide-v2.md`
- **Brand strategy:** `docs/brand/brand-positioning.md`
- **Live styleguide route (when built):** `https://9takes.com/styleguide` (❌ not yet shipped — fall back to `/design-preview/v5` for a visual reference)

If you find a contradiction between this handoff doc and `docs/design-system.md`, fix this doc — design-system.md is the source of truth.
