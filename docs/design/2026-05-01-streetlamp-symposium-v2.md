<!-- docs/design/2026-05-01-streetlamp-symposium-v2.md -->

# Streetlamp Symposium — V2 Mood Spec

**Date:** 2026-05-01
**Status:** Proposal V2 (not locked). Builds on V1; absorbs the structural strengths of the production homepage. Used as input for `/design-preview/v2`.

**Related docs:**

- `docs/design/2026-05-01-streetlamp-symposium-mood.md` — V1 spec (V2 inherits palette, type, visual logic from this; only changes/additions are documented here)
- `docs/design-system.md` — overall living spec
- Production homepage: `src/routes/+page.svelte` (2,645 lines — _do not modify_)

---

## What changed from V1

V1 proved the **aesthetic** lands. V2 keeps that aesthetic intact and absorbs the **structural strengths** of the production homepage that DJ confirmed work:

| Production homepage strength                     | V1 covered? | V2 must add                                              |
| ------------------------------------------------ | ----------- | -------------------------------------------------------- |
| Two-path decision: "I'M NEW" vs "I KNOW MY TYPE" | ❌          | Yes — restyled in Streetlamp Symposium                   |
| Question of the day (with rebranded name)        | ❌          | Yes — "Tonight's Open Floor"                             |
| Type-perspectives demo (T4 / T6 / T8 takes)      | ❌          | Yes — shown _openly_ on homepage as the proof-of-concept |
| Famous people grid (corpus depth preview)        | ❌          | Yes — "The Library"                                      |
| Corpus stats (breadth signal)                    | ❌          | Yes — "What we've compiled"                              |
| Light mode + dark mode parity                    | ❌          | Yes — both shipped, with on-page toggle                  |

V1 also had a single-card "Tech Spec dossier" demo for Type VIII. V2 keeps that as one section but it now sits _inside_ a broader story (the Library shows breadth; the Dossier shows the zoom-in).

V1 inheritance: palette, type system, visual logic, hero composition, give-first explainer, footer. **All re-used unchanged.**

---

## Section flow (V2)

The whole page tells one argument: _we know things others don't, here's the proof, here's where to start._

```
┌─────────────────────────────────────────────────────┐
│ 0. Sticky preview banner (with theme toggle)        │
├─────────────────────────────────────────────────────┤
│ 1. Hero — two-path decision                         │
│    - "I'M NEW"          - "I KNOW MY TYPE"          │
│    - Three reads       - Demo + CTA                 │
├─────────────────────────────────────────────────────┤
│ 2. The Hook — "we know things" manifesto            │
├─────────────────────────────────────────────────────┤
│ 3. Tonight's Open Floor — question + T4/T6/T8 takes │
│    (shown OPENLY — the proof-of-concept demo)       │
├─────────────────────────────────────────────────────┤
│ 4. The Library — famous-people dossier grid          │
├─────────────────────────────────────────────────────┤
│ 5. What we've compiled — corpus stats                │
├─────────────────────────────────────────────────────┤
│ 6. The Dossier — Type VIII deep zoom (V1 card)       │
├─────────────────────────────────────────────────────┤
│ 7. The Meetup — give-first explainer (V1)            │
├─────────────────────────────────────────────────────┤
│ 8. Footer (V1)                                       │
└─────────────────────────────────────────────────────┘
```

Order rationale: hero gates traffic into a path → manifesto explains the why → live demo proves we deliver → library + stats + dossier prove depth/breadth → meetup explains the mechanic → quiet exit.

---

## Light mode tokens (NEW for V2)

V1 was dark-only. V2 ships both modes, full parity. Same warm-and-reverent feeling, just inverted day/night.

**Conceptual frame:** Dark mode = streetlamp meetup at midnight. Light mode = a philosopher's well-lit study at midday. Same warmth, same reverence, different time of day.

```scss
/* Light mode — "philosopher's daylight study" */
.streetlamp-preview.light-mode {
	--night-deep: #faf8f4; /* page bg — warm parchment, not pure white */
	--night-mid: #f2ebdd; /* sidebar bg — warmer recessed paper */
	--stone-warm: #ffffff; /* card bg — pure paper, lifts off the page */
	--stone-mid: #f5f0e8; /* elevated/hover */
	--stone-edge: #d6ccb8; /* borders — warm 1px hairline */

	--lamp-glow: #b45309; /* primary — deeper amber for AAA contrast on light */
	--lamp-deep: #92400e; /* hover/pressed */
	--lamp-light: #d97706; /* highlights, brighter accent */
	--lamp-soft: rgba(180, 83, 9, 0.1); /* subtle backgrounds, badges */
	--lamp-glow-rgba: rgba(217, 119, 6, 0.18); /* radial pool effect — softer in light */

	--marble-pure: #ffffff; /* statue lit faces stay pure */
	--marble-warm: #faf8f4; /* same as page bg */
	--marble-shadow: #8b7e6e; /* statue shadow side */

	--data-teal: #0f766e; /* deeper teal for legibility on light */
	--data-cyan: #14b8a6;

	--ink-bright: #1c1917; /* headlines, primary text */
	--ink-mid: #44403c; /* body */
	--ink-dim: #78716c; /* captions, mono labels */
	--ink-muted: #a8a29e; /* disabled, placeholders */
}
```

**Light-mode visual logic shifts:**

- The "warm pool" radial gradient becomes a _soft warm wash_ — barely there. Light mode doesn't need dramatic chiaroscuro because there's no shadow to contrast against. The warm pool is more like sunlight catching a tabletop than a streetlamp piercing darkness.
- Cards are pure white (`--stone-warm: #FFFFFF`) lifted off the warm parchment page bg. 1px warm-hairline borders do the work, no shadow.
- The **sodium-amber primary stays amber** but shifts deeper (`#B45309` instead of `#F59E0B`) for AAA contrast on light surfaces.
- Greek statue images: the chiaroscuro filter (`mix-blend-mode: screen`) gets dropped or significantly reduced — in light mode the statues read normally, no warm tinting needed.
- Mono labels (`JetBrains Mono`) stay uppercase + tracked, but in `--ink-dim` (warm gray) instead of pale.

### Theme toggle UI

A small button in the top-right of the preview, separate from the production toggle (so toggling preview state never touches production state).

- Sun icon when in dark mode → click switches to light
- Moon icon when in light mode → click switches to dark
- Position: fixed, top-right, just below the sticky banner
- Style: small circle, `--stone-warm` background, `--ink-bright` icon, 1px `--stone-edge` border, no shadow
- Behavior: toggles `.light-mode` class on the preview container; persists choice in `localStorage` under key `'9takes-preview-theme-v2'` (separate namespace from production)
- On first load: respects `prefers-color-scheme` if no stored preference

---

## Section specs (V2 detail)

### 0. Sticky preview banner

Same as V1 (`🚧 DESIGN PREVIEW — Streetlamp Symposium v2 · 2026-05-01 · not production`), but now includes the theme toggle on the right side.

```
┌──────────────────────────────────────────────────────────────────────┐
│ 🚧 DESIGN PREVIEW — Streetlamp Symposium v2 · 2026-05-01     ☼ ┃ ✕ │
└──────────────────────────────────────────────────────────────────────┘
```

`☼` = theme toggle. `✕` = dismiss banner. Banner sticky at top, z-index 1000.

---

### 1. Hero — two-path decision

Replaces V1's single-CTA hero. Inspired by production's two-fork decision (`+page.svelte:422–493`) but restyled in Streetlamp Symposium.

**Layout (desktop):**

```
┌────────────────────────────────────────────────────────────────┐
│  §01 · OBSERVATION                                             │
│  ─────────                                                     │
│  See the emotions                       [Greek statue]         │
│  behind every take.                     half-lit, warm side    │
│  ─────────                                                     │
│  LAT 37.9755° N · LONG 23.7348° E · ATHENS · 2,500 YR          │
│                                                                │
│  Decode social dynamics. Personality-max your EQ.              │
│  Turn conflict into understanding.                             │
└────────────────────────────────────────────────────────────────┘
┌─────────────────────────────┬──────────────────────────────────┐
│ I'M NEW                     │ I KNOW MY TYPE                   │
│                             │                                  │
│ Tired of personality tests  │ Ready to see how the other 8     │
│ that describe you but never │ types actually read the same     │
│ help you change?            │ situation you would?             │
│                             │                                  │
│ START WITH:                 │ TONIGHT'S OPEN FLOOR             │
│ → 9 minutes of reading      │ "What is something people        │
│ → A self-typing primer       │  misunderstand about you?"      │
│ → How to use 9takes         │                                  │
│                             │ T4: [hint, locked]               │
│                             │ T6: [hint, locked]               │
│                             │ T8: [hint, locked]               │
│ [Start the primer →]        │ [Give your take →]                │
└─────────────────────────────┴──────────────────────────────────┘
```

**Streetlamp-Symposium treatment:**

- Hero headline area at top: same as V1 (Fraunces display-xl, mono coordinate label, scale-marker line). Greek statue at upper-right, chiaroscuro-treated. Single radial warm-light pool from upper-left.
- Two decision panels below hero headline, side-by-side on desktop, stacked on mobile.
- Each panel = a **case-file card**: `--stone-warm` bg, 1px `--stone-edge` border, no shadow, `border-radius: 16px` (Tailwind `rounded-xl`).
- Panel mono label at top: `I'M NEW` (left, in `--lamp-glow`) or `I KNOW MY TYPE` (right, in `--data-teal`). Different colors signal different paths — amber = "where the light starts," teal = "where the data lives."
- Panel headline in Fraunces display-md, `--ink-bright`.
- Panel intro in Inter body, `--ink-mid`.
- "START WITH:" or "TONIGHT'S OPEN FLOOR" subhead in mono, uppercase, tracked (`letter-spacing: 0.08em`), `--ink-dim`.
- Three reads (left panel) as numbered list with arrow → markers, `--ink-mid`. Each item is a link (use the noPathBlogs structure — for prototype, stub three plausible blog titles).
- Demo preview (right panel) — three locked Type-take cards stacked vertically:
  - Each card: 1px `--stone-edge` border, mono header `TYPE 4 · SOUL WEAVER · LOCKED` (use the existing `shadowTypes` color for the type-color hint), serif italic body in `--ink-mid` showing the take _hint_ (truncated/teasing — full take revealed only after user gives their own)
  - Lock icon (or `LOCKED` mono badge) on each
- Each panel has a single CTA button at the bottom — solid `--lamp-glow` background, white text on dark mode / `--night-deep` text on light mode for contrast.

**Stub demo replies for the prototype** (these mirror production's `demoReplyTypes` shape):

```ts
const tonightsQuestion = 'What is something people misunderstand about you?';
const demoTakes = [
	{
		type: 4,
		name: 'Soul Weaver',
		hint: "They think I'm dramatic. I'm trying to feel something real..."
	},
	{
		type: 6,
		name: 'Iron Guard',
		hint: "They think I'm anxious. I'm scanning for the threat they missed..."
	},
	{
		type: 8,
		name: 'War Commander',
		hint: "They think I'm angry. I'm just refusing to fold for fake politeness..."
	}
];
```

Use the existing type colors from `src/scss/index.scss:231–239` (`--type-4-color: #a855f7`, `--type-6-color: #22c55e`, `--type-8-color: #dc2626`) on each take card's left edge as a 3px colored bar.

---

### 2. The Hook — "we know things"

Same as V1. Two-column, Fraunces headline left, three brand-voice tactical lines right. No glow on this section — dim moment between two illuminated ones.

---

### 3. Tonight's Open Floor — the proof-of-concept demo

The most important new section in V2. This is where DJ said "I love how it says what the Enneagram 4 would say, what the 6 would say, what the 8 would say. That demonstrates 9takes."

In production this lives inside the hero panel as locked teasers. In V2 we do BOTH: locked teasers in hero (preserves give-first promise + creates intrigue), and a dedicated **fully-open** demo section here showing what the platform actually delivers.

**Naming options for this section** (DJ to pick):

- **A. "Tonight's Open Floor"** — symposium parlance ("the floor is open"), implies anyone can speak now. Mono label: `OPEN · MAY 1 · TONIGHT'S FLOOR`. _My pick._
- **B. "On the Table"** — classical, "what's being discussed." Mono label: `ON THE TABLE · MAY 1`.
- **C. "The Open Question"** — calm, philosophical, doesn't presuppose daily cadence. Mono label: `OPEN QUESTION · 137 RESPONSES`.

I'll wire option A as the default. Easy to swap.

**Layout:**

- Section heading in Fraunces display-md: **"Tonight's Open Floor."**
- Below: small mono kicker: `OPEN · MAY 1 · 137 RESPONSES SO FAR`
- The question itself in Fraunces display-lg, blockquote styling (left-border in `--lamp-glow`, italic): _"What is something people misunderstand about you?"_
- Below the question: three full type-take cards displayed openly (not locked — this is the demo).
- Each take card structured like a dossier excerpt:
  - Top mono label: `TYPE 4 · THE INDIVIDUALIST · TAKEN AT 23:47`
  - Type-color stripe on left edge (3px solid, color from `--type-4-color`)
  - Take body in Fraunces body or serif italic: full sentence, brand-voice. ~2-3 sentences.
  - Bottom mono mini-meta: `↑ 47 · 12 REPLIES · BY @USERNAME`
- Below the three takes, a CTA: **"Drop your take →"** → links to `/questions/{questionOfTheDay.url}` (stub for prototype).
- Footnote in mono, `--ink-dim`: `the platform locks responses until you give yours · this preview shows three for the demo`

**Stub takes** (more substantive than the hero hints — full demo content):

```ts
const openFloorTakes = [
	{
		type: 4,
		typeName: 'The Individualist',
		take: "They think I'm being dramatic. The truth is I'm trying to find something authentic in a moment that feels performative — and watching everyone else play along makes me feel more alone, not less. The drama is the search.",
		upvotes: 47,
		replies: 12,
		timestamp: '23:47'
	},
	{
		type: 6,
		typeName: 'The Loyalist',
		take: "People read my questions as anxiety. They're not — they're load-bearing. I'm checking the structure of what we're about to do because no one else is. The day someone is grateful I asked is the day I trust them.",
		upvotes: 38,
		replies: 9,
		timestamp: '23:51'
	},
	{
		type: 8,
		typeName: 'The Challenger',
		take: "They think I'm angry. I'm not. I'm just refusing to fold to keep things polite when something is actually wrong. The anger they're reading is the absence of the social muting they expected.",
		upvotes: 61,
		replies: 18,
		timestamp: '23:54'
	}
];
```

Visual logic: this is the section where the page gets _busiest_ — multiple cards, mono labels everywhere, type-color accents — because it's demonstrating the platform's actual texture. Good. The contrast against the quiet sections around it is the point.

---

### 4. The Library — famous-people dossier grid

Production calls this "We analyze famous people on purpose." Renaming to **"The Library"** for the dossier metaphor.

**Layout:**

- Section heading in Fraunces display-md: **"The Library."**
- Subhead in Inter body-lg, `--ink-mid`: "We compile dossiers on the people you're already curious about. Athletes, founders, fictional characters, public figures — read at the level you'd expect from a private investigator, not a clickbait personality blog."
- Mono kicker: `THE LIBRARY · 1,247 DOSSIERS · 9 TYPES · GROWING`
- Below: a grid of 6–9 dossier preview cards (3 columns desktop, 2 columns tablet, 1 column mobile).
- Each dossier preview card:
  - 1px `--stone-edge` border, `--stone-warm` bg, no shadow, `rounded-xl`
  - Top: small framed subject portrait (use stub placeholder images — see implementation note below). 1px `--stone-edge` frame around portrait.
  - Mono label above name: `DOSSIER №.0XXX · TYPE [N] · [TYPE NAME]`
  - Subject name in Fraunces, large, `--ink-bright`
  - One-line subtitle in Inter body-sm, `--ink-mid`: "Co-founder of [X]. The chaos in his decisions makes more sense once you know..."
  - Mini stat row at bottom in mono, 4 small stat blocks: `INSIGHT · DIRECTNESS · PATIENCE · ANGER` with values
  - Hover: subtle warm-glow `--lamp-soft` background lift, no transform
- Below grid, a CTA: **"Browse all 1,247 dossiers →"**

**Stub dossier data** (prototype only — uses placeholder names that read as plausible 9takes subjects):

```ts
const libraryStubs = [
	{
		id: '0042',
		type: 8,
		typeName: 'Challenger',
		name: 'Steve Jobs',
		subtitle:
			'The chaos in his decisions makes more sense once you see the Type 8 stress line to 5.'
	},
	{
		id: '0073',
		type: 4,
		typeName: 'Individualist',
		name: 'Frida Kahlo',
		subtitle: 'Why her self-portraits feel inevitable, not performative.'
	},
	{
		id: '0118',
		type: 5,
		typeName: 'Investigator',
		name: 'Marie Curie',
		subtitle: 'A laboratory was the only room where the rules made sense to her.'
	},
	{
		id: '0205',
		type: 1,
		typeName: 'Perfectionist',
		name: 'Hermione Granger',
		subtitle: 'The original Type 1 archetype, written before the Enneagram entered popular culture.'
	},
	{
		id: '0312',
		type: 7,
		typeName: 'Enthusiast',
		name: 'Anthony Bourdain',
		subtitle:
			'The Type 7 who could not outrun his own pattern. A study in the cost of constant motion.'
	},
	{
		id: '0488',
		type: 9,
		typeName: 'Peacemaker',
		name: 'Mr. Rogers',
		subtitle: 'A masterclass in the Type 9 who chose presence over withdrawal.'
	}
];
```

For images, use placeholder treatment: a `--stone-mid` filled box with a mono label `[SUBJECT IMG]` overlaid, OR if the agent finds a way to use existing `static/` assets in a stub-friendly way, use those. The point is the visual rhythm of the grid, not the literal portraits.

---

### 5. What we've compiled — corpus stats

Production has a "Corpus stats" section after the famous people grid. V2 keeps it, restyled.

**Layout:**

- Section heading in Fraunces display-md: **"What we've compiled."**
- Below: 4-stat block layout, mono labels above big numbers in Fraunces.

```
┌──────────────────┬──────────────────┬──────────────────┬──────────────────┐
│ DOSSIERS         │ EMOTIONAL FRAMES │ LINEAGE          │ COMMENTS GATHERED│
│ COMPILED         │                  │                  │                  │
│  1,247           │  9               │  2,500 yr        │  47,000+         │
│ ── growing ──    │ ── exact ──      │ ── plato → now ──│ ── unbiased ──   │
└──────────────────┴──────────────────┴──────────────────┴──────────────────┘
```

- Each stat block: `--stone-warm` bg, 1px `--stone-edge` border, `rounded-xl`, no shadow, `padding: 24px`.
- Mono label at top: `LABEL` in `--ink-dim`, uppercase, tracked.
- Big number in Fraunces display-lg (~56px), `--ink-bright`, slightly tabular feel.
- Sub-line at bottom in mono `--ink-dim`: `── annotation ──` (em-dashes flank the descriptor, like a scale marker).
- 4 columns on desktop, 2 columns on tablet, 1 column on mobile.

Subtle warm pool radial gradient washes through this section's background — it's the "look at what we've gathered" moment, deserves illumination.

---

### 6. The Dossier — Type VIII single zoom

Same as V1's dossier card. Optionally shrink slightly so it doesn't compete with the Library — the Library is the _grid_ view, the Dossier is the _single zoom-in_. Section heading rewords:

- V1: "We don't write personality articles. We compile dossiers."
- V2: "Inside one dossier."

Smaller heading, smaller card, more like a worked example after the Library section. Otherwise unchanged from V1.

---

### 7. The Meetup — give-first explainer

Same as V1. Three steps, philosopher-gathering treated background.

---

### 8. Footer

Same as V1.

---

## Build-this-not-that (V2 additions)

| Build this                                                             | Not that                                                 |
| ---------------------------------------------------------------------- | -------------------------------------------------------- |
| Two-path hero panels with mono headers and amber/teal differentiation  | Single hero CTA — V1 only had one path, V2 needs two     |
| Open Floor takes with full body text in serif italic                   | Locked teasers everywhere — only the hero demo is locked |
| Library grid as case-file dossier previews                             | Library grid as marketing tiles with hero shots          |
| Stat blocks with mono labels and em-dash annotations                   | Stat blocks with icons and pastel backgrounds            |
| Theme toggle that scopes to preview only (`localStorage` separate key) | Theme toggle that affects production state               |
| Light mode: pure white cards on warm parchment page                    | Light mode: gray cards on white page                     |
| Light mode: amber stays amber but deeper (`#B45309`)                   | Light mode: amber lightens to `#FBBF24` (loses contrast) |
| Light mode: drop the chiaroscuro filter on Greek statue                | Light mode: keep the dark-mode warm-tint on the statue   |

---

## Tech notes for the implementer

- **Build at:** `src/routes/design-preview/v2/+page.svelte`
- **Don't touch:** the existing `src/routes/design-preview/+page.svelte` (V1 stays as-is for comparison)
- **Don't touch:** `src/routes/+page.svelte` (production), `tailwind.config.ts`, `src/scss/index.scss`, etc.
- All new tokens scoped to `.streetlamp-preview-v2` class on the page wrapper
- Theme toggle: separate `localStorage` key `'9takes-preview-theme-v2'`
- Reuse Fraunces + Inter Google Fonts setup from V1 (same `<svelte:head>` block pattern)
- JetBrains Mono is already loaded globally — just use it
- Stub data (open floor takes, library dossiers, stats) defined as `const` arrays at top of `<script lang="ts">`. No server-side load, no DB. Pure prototype.
- Header/Footer wrapping: same approach as V1 — don't fight them, scope local overrides only if absolutely necessary
- Mobile breakpoints: 968px (hero collapses to 1-col), 768px (panels stack), 480px (sub-mobile tightening)
- Run `pnpm check`, run `pnpm dev`, verify both `/design-preview` (V1) and `/design-preview/v2` (V2) load without errors

---

## Success criteria

After V2 ships, DJ should be able to:

1. **See light AND dark mode** by clicking the theme toggle. Both should feel like the same brand at different times of day.
2. **Recognize the structural strengths** of production homepage all wrapped in Streetlamp Symposium clothing (two paths, type-perspectives demo, library, corpus stats).
3. **Decide what to keep vs. what to evolve** — V2 is the dial-in conversation, not the final lock.

Likely V3 directions after DJ feedback:

- Section reordering
- Tighter type-take copy
- Different "Tonight's Open Floor" naming
- Different ratio of dossier-grid density vs whitespace
- More/fewer corpus stats
- Logo/header treatment in the dark-mode page
