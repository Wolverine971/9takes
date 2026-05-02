<!-- docs/design/2026-05-01-streetlamp-symposium-mood.md -->

# Streetlamp Symposium — Mood Spec

**Date:** 2026-05-01
**Status:** Proposal (not locked). Used as the input spec for the `/design-preview` homepage prototype.
**Companion docs:** `docs/design-system.md` §4, `docs/design/2026-05-01-design-system-gap-analysis.md`

---

## The vision in plain English

Imagine a small group of people meeting at midnight under a streetlamp. Hoodies up. Talking honestly about themselves and the people they know. Not a support group, not a frat — a quiet, intelligent, late-night meetup where people share what they've actually figured out about human behavior. Like a Tokyo midnight car meet, but for psychology.

That's the _feeling_. 9takes is the digital version of that meetup.

The visual logic that delivers the feeling: **warm pools of light against deep shadow.** One thing illuminated, the rest receding into the dark. The same lighting logic Renaissance painters used to make a quiet conversation between two people feel weighty and intimate — bright warm light hits the moment that matters; everything else falls away.

Layered on top of that, for the parts of the product that show research depth (especially personality analysis), we lean into **research dossier energy** — small mono-font labels, coordinate markers, stat panels, scale notes, type indicators. Receipts. Like a private investigator's case file or a Persona 5 character analysis screen, but warm-toned, never cold gaming UI.

### The two-mode summary

| Mode                  | Where it shows up                                           | Visual signal                                                                                                              |
| --------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Streetlamp**        | Homepage, blog reading, Q&A, coaching, marketing            | Warm light pool against deep shadow. Greek statues. Hooded-figure intimacy. Serif headlines.                               |
| **Tech Spec dossier** | Personality analysis pages, type cards, the 9-types display | Mono labels, coordinate markers, stat bars, dossier framing. Layered on top of Streetlamp foundation, not a separate skin. |

---

## Color palette (preview values)

**Important:** these are _prototype_ values for the `/design-preview` route. They temporarily override the production teal/rose/purple/warm-stone tokens. Production tokens stay locked until DJ ratifies the new palette.

### Backgrounds — deep night

| Name           | Hex       | Use                             |
| -------------- | --------- | ------------------------------- |
| `--night-deep` | `#0a0807` | Page background, deepest layer  |
| `--night-mid`  | `#16110d` | Sidebars, secondary surfaces    |
| `--stone-warm` | `#241d17` | Cards, content containers       |
| `--stone-mid`  | `#3a302a` | Elevated surfaces, hover states |
| `--stone-edge` | `#5c4f47` | Borders, subtle dividers        |

### Illumination — sodium-vapor amber (primary)

The "streetlamp" color. Warm orange-amber, not cool yellow. Carries the "we just turned the light on you" energy.

| Name               | Hex                        | Use                                                  |
| ------------------ | -------------------------- | ---------------------------------------------------- |
| `--lamp-glow`      | `#F59E0B`                  | Primary CTAs, brand moment, headlines                |
| `--lamp-deep`      | `#B45309`                  | Hover, depth, pressed states                         |
| `--lamp-light`     | `#FBBF24`                  | Highlights, accents                                  |
| `--lamp-soft`      | `rgba(245, 158, 11, 0.14)` | Subtle backgrounds, badges                           |
| `--lamp-glow-rgba` | `rgba(245, 158, 11, 0.40)` | The actual streetlamp pool effect (radial gradients) |

### Marble — for high-light moments

Greek statue, philosophical pages, light-mode foundation.

| Name              | Hex       | Use                                  |
| ----------------- | --------- | ------------------------------------ |
| `--marble-pure`   | `#FAF8F4` | Statue lit faces, pure-light moments |
| `--marble-warm`   | `#EDE6DA` | Light-mode page background (later)   |
| `--marble-shadow` | `#A8A095` | Mid-tone marble, body text on dark   |

### Tech Spec accent — deep teal (for dossier mode only)

Teal survives in the new system as the _data/system_ color, not the brand color. It shows up on personality analysis pages — stat panels, coordinates, mono-font labels.

| Name          | Hex       | Use                                     |
| ------------- | --------- | --------------------------------------- |
| `--data-teal` | `#0D9488` | Mono labels, stat panel borders, coords |
| `--data-cyan` | `#5EEAD4` | Active data points, highlights          |

### Text

| Name           | Hex       | Use                             |
| -------------- | --------- | ------------------------------- |
| `--ink-bright` | `#FAF8F4` | Headlines, primary text         |
| `--ink-mid`    | `#A8A095` | Body, secondary text            |
| `--ink-dim`    | `#5C4F47` | Captions, mono labels, metadata |
| `--ink-muted`  | `#3A302A` | Disabled, placeholders          |

---

## Typography

Three jobs, three typefaces:

1. **Serif display** — for philosophical headlines. Carries gravitas without being academic. Pick: **Fraunces** (variable, expressive but legible, Google Fonts). Stand-in fallback: Georgia.
2. **Clean sans** — for body and UI. Pick for the preview: **Inter** (free, variable, the workhorse). Stand-in fallback: system-ui.
3. **Technical mono** — for dossier labels, coordinates, type indicators. Already loaded: **JetBrains Mono**.

Rajdhani gets retired. Space Grotesk _might_ survive as the body font — let's see how Inter feels in the preview before deciding.

### Type scale (prototype)

```
display-xl   72px  Fraunces  700  -0.02em letter-spacing  for hero
display-lg   56px  Fraunces  700  -0.02em                 for h1 mobile or section heros
display-md   40px  Fraunces  600  -0.01em                 for h2
body-lg      18px  Inter     400  1.55 line-height        body large (reading)
body         16px  Inter     400  1.55                    body default
body-sm      14px  Inter     400  1.5                     body small
mono         12px  JetBrains 500  0.08em letter-spacing UPPERCASE  for dossier labels
```

---

## Visual logic — the "warm pool against shadow" rules

These are the rules an implementer should be able to recite:

1. **Every page has one focal pool of warm light.** It bleeds in from one direction (often top-left or center) using a radial gradient, fading into deep night at the edges. The hero is the strongest pool; secondary sections have weaker pools or none.
2. **Surface elevation in dark mode is by warmth, not by shadow.** Cards step up from `--night-deep` → `--stone-warm` → `--stone-mid`. We barely use box-shadows.
3. **One illuminated subject per section.** Like a Renaissance painting — the eye should know exactly where to land. Greek statue images get treated this way: drop them in with a CSS filter that increases warm-side highlight and crushes the shadow side.
4. **Greek imagery used reverently, not decoratively.** Statues are subjects, not stickers. They're large, well-lit, and treated as if they're the philosopher whose voice you're hearing — not background ornament.
5. **The dossier mode breaks the silence.** Personality analysis sections deliberately get _busier_ than the rest of the page — mono labels, coordinate markers, stat bars, type strips. The contrast between "quiet warm pool" and "dense research panel" is the point.
6. **Negative space is deep night, not white space.** When a section is "empty," it's intentionally `--night-deep` — like the rest of the room is dim because all the light is on the conversation.

---

## Required sections of the `/design-preview` homepage

This is what the agent builds. Order matters — it's the demo flow.

### 1. Hero — "The Streetlamp"

- **Background:** `--night-deep` with a single warm radial gradient bleeding in from upper-left (the "streetlamp"): `radial-gradient(ellipse at 20% 10%, rgba(245, 158, 11, 0.18) 0%, transparent 50%)`. Subtle paper-grain noise overlay (very low opacity, like 3%).
- **Greek statue image** (use `static/greek_distorted_statue_face.png`) at left or right, treated with `filter: contrast(1.15) brightness(1.02)`. Half-lit. Goes large (40-50% of viewport width on desktop, hidden or smaller on mobile).
- **Tagline** — Fraunces, display-xl: **"See the emotions behind every take."**
- **Dossier annotations near the tagline** — small mono-font notes that signal research dossier energy:
  - Above tagline: `MONO 12PX UPPERCASE: §01 · OBSERVATION`
  - Below tagline: a thin horizontal scale-marker line (1px, `--stone-edge`)
  - Coordinate label like: `LAT 37.9755° N · LONG 23.7348° E · ATHENS · 2,500 YR LINEAGE`
- **Subhead** in Inter body-lg, `--ink-mid`: "Decode social dynamics. Personality-max your EQ. Turn conflict into understanding."
- **One CTA button** — solid `--lamp-glow` background, `--ink-bright` (or `--night-deep`?) text, slight warm glow on hover (`box-shadow: 0 0 24px rgba(245, 158, 11, 0.35)`). Label: **"Read your patterns →"**
- **No second CTA.** Reverence for the moment.

### 2. The Hook — "We know things"

A short manifesto-style section. Two columns.

- **Left:** Fraunces display-md headline: **"Most people walk around blind to their own patterns."**
- **Right:** Three tactical lines, each Hook → Insight → Action style. Use brand voice from `brand-style-guide-v2.md`:
  - "→ She's not 'being difficult.' Type 1s need things done right the first time."
  - "→ He's not 'too intense.' Type 8s test you to see if you'll fold."
  - "→ Your friend isn't 'flaky.' Type 7s are running from emotional pain."
- Background: `--night-deep`, no pool of light here — this is the dim moment between two illuminated ones.

### 3. The Dossier Card — Tech Spec mode demo

This section is the proof of concept for personality-analysis-as-research-dossier. Make it feel like a case file.

- **Section heading** in Fraunces display-md: **"We don't write personality articles. We compile dossiers."**
- **A single dossier card** in the center, with these elements arranged as a compositional whole:
  - **Top-left mono label:** `DOSSIER №.0008 · DECLASSIFIED · TYPE VIII`
  - **Top-right mono label:** `STATUS: ACTIVE · LAST OBSERVED: 2026-05-01`
  - **Subject image** — pick one: a Greek statue from `static/`, or a philosopher photo. Treat with chiaroscuro filter.
  - **Title:** Fraunces display-md: **"The Challenger."**
  - **Subtitle line** in mono: `CORE FEAR: Being controlled · CORE DESIRE: Self-mastery`
  - **Stat panel** — like a Persona 5 social link card. Five rows:
    ```
    INSIGHT      ████████░░  82%
    DIRECTNESS   ██████████  100%
    PATIENCE     ███░░░░░░░  31%
    EMPATHY      █████░░░░░  56%
    ANGER        █████████░  90%
    ```
    Bars are solid `--lamp-glow`, track is `--stone-warm`. Mono labels in `--ink-dim`.
  - **Side annotation** in mono, fine-print energy: `§3.2 SHADOW TRIAD · §4.1 STRESS LINE → 5 · §4.2 GROWTH LINE → 2`
  - **Bottom CTA:** "Read the full dossier →" in `--lamp-glow`, underline on hover.
- **Card background:** `--stone-warm`, 1px `--stone-edge` border, subtle inner glow `inset 0 1px 0 rgba(245, 158, 11, 0.06)`. No drop shadow.

### 4. The Meetup — Give-first section

The "midnight streetlamp meetup" image, made into a product explanation.

- **Section heading** in Fraunces display-md: **"It's like a 2 AM conversation with people who actually get it."**
- **Subhead** in Inter body-lg: "Drop your situation. Comment first — that's the give-first unlock. Then see how each of the 9 types reads it."
- **Three-step visual** — a horizontal row of three small cards, mono labels, sodium-amber accent:
  1. `STEP 01` — Drop your situation
  2. `STEP 02` — Give your take first
  3. `STEP 03` — Unlock 9 perspectives
- **Background imagery:** if `static/philosopher-gathering.webp` works visually, use it as a treated background (heavy darken + warm overlay) for this section. If it doesn't, just use a subtle warm pool from below.

### 5. Footer — quiet

Minimal. Tagline-only ("One situation, 9 ways to see it."), 4 nav links (`/questions`, `/personality-analysis`, `/enneagram-corner`, `/book-session`), copyright. `--night-deep` background, `--ink-dim` text.

---

## Build-this, not-that

| Build this                                               | Not that                                                    |
| -------------------------------------------------------- | ----------------------------------------------------------- |
| Sodium-amber `#F59E0B` primary glow                      | Teal `#14B8A6` (production primary — _not_ used in preview) |
| Serif headlines (Fraunces) for hero, hook, dossier       | Rajdhani — retired in this mood                             |
| Mono labels (JetBrains Mono) for dossier annotations     | Mono labels everywhere — only on dossier elements           |
| Single radial warm-light gradient per section, low alpha | Glow on every element                                       |
| 1px `--stone-edge` borders for static cards              | `box-shadow` on static cards                                |
| Greek statue treated as illuminated subject              | Greek statue as decorative texture                          |
| Hopper-style "warm pool against night" composition       | Cyber-campfire aesthetic — retired                          |
| Negative space = deep night (`--night-deep`)             | Negative space = white                                      |
| Reverent, intimate, late-night energy                    | Gaming UI, particle effects, XP bars on the homepage        |

---

## Reference vibes (in plain English, no jargon)

- **Pirate Wires** — "we know things" editorial energy, adult intelligence that doesn't try
- **Late-night Tokyo car-meet photography** — Larry Chen night shots, sodium-vapor glow on humans gathered intimately around their work
- **Hopper's _Nighthawks_ painting** — _(quick context: 1942 painting of three people in a brightly-lit late-night diner against an empty dark city street.)_ The visual logic of "warm illuminated moment surrounded by sleeping darkness." Worth Googling once.
- **Caravaggio paintings** — _(quick context: Italian painter ~1600. Famous for using a single dramatic warm light source to illuminate human moments out of deep shadow. The "warm pool against deep shadow" technique was invented by him.)_ Worth Googling "Caravaggio chiaroscuro" for one image, then back to building.
- **Persona 5 confidant cards** — character-stat panels with warm-toned data presentation, not gaming-cold UI
- **Greek philosopher statue / bust photography** — already in our `static/` library
- **A research case file from a private investigator** — mono labels, coordinate notes, dossier framing

---

## Tech notes for the implementer

- Build at route: `src/routes/design-preview/+page.svelte`
- Use Svelte 5 runes (`$state`, `$props`, `$derived`)
- Scoped styles only — `<style lang="scss">` block in the page file
- For Fraunces + Inter: add a `<svelte:head>` block with Google Fonts `<link>` tags. Don't install via npm — this is a prototype.
- Reuse existing components only if they fit (Header / Footer can wrap, but the body content should be all-new)
- The page should be fully responsive — mobile gets simplified hero (no statue image, smaller display-xl, single column for the hook/dossier)
- Preview is full-page; assume `Header` + `Footer` wrap automatically via `+layout.svelte`. If header/footer styling fights the dark mood, scope local overrides — _do not_ edit the global header/footer files.
- Add a banner at the very top of the page that says: `🚧 DESIGN PREVIEW — Streetlamp Symposium proposal · 2026-05-01 · not production`. Sticky, dismissible.

---

## Success criteria

After the preview ships, DJ should be able to look at it and answer:

- [ ] "Yes, that's what I was describing" — proceed to ratify mood lock + roll out to production
- [ ] "Most of it, but X needs to change" — iterate on X specifically (use `compound-engineering:design:design-iterator` for systematic refinement)
- [ ] "No, this isn't right" — pivot to a different mood (Field Manual, Solo Leveling B, or new direction)

Whatever the answer, the preview earns its build by _making the visualization concrete_ so the conversation can move forward.
