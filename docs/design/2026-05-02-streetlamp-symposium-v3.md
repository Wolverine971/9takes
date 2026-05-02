<!-- docs/design/2026-05-02-streetlamp-symposium-v3.md -->

# Streetlamp Symposium — V3 Mood Spec

**Date:** 2026-05-02
**Status:** Proposal V3 (not locked). Builds on V2 — pivots typography, switches from card-heavy layout to diagrammatic, applies the BuildOS landing-page scorecard framework above the fold, and makes the open-question section time-dynamic.
**Build target:** `/design-preview/v3`

**Related docs:**

- V1 spec: `docs/design/2026-05-01-streetlamp-symposium-mood.md`
- V2 spec: `docs/design/2026-05-01-streetlamp-symposium-v2.md`
- Living spec: `docs/design-system.md`
- Scorecard framework reference: https://build-os.com/blogs/agent-skills/landing-page-scorecard-funnel

---

## What changed from V2

V2 proved (a) the aesthetic, (b) the structural strengths from production homepage, and (c) light/dark parity. DJ's V3 feedback identified four issues:

| V2 issue                                                                           | V3 fix                                                                                                                                                                                             |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fraunces serif feels "a little bit too weird"                                      | Drop Fraunces. Inter handles every size from caption to display. Greek statue imagery + JetBrains Mono carry the cultural and tech-spec weight.                                                    |
| "Dossier" appears in user-facing copy                                              | "Dossier" stays in internal language (design docs, code, slack). User-facing copy uses plain words.                                                                                                |
| "Tonight's Open Floor" is hard-coded — wrong if the user visits in the morning     | Time-dynamic: section title and mono kicker change based on user's local time (4 windows: morning/afternoon/evening/night).                                                                        |
| Page is too card-heavy — feels like a stack of marketing tiles, not an explanation | Diagrammatic-first. Above the fold becomes a single annotated system diagram. Other sections lean on diagrams (Enneagram 9-point figure, comparison table, anatomy callouts) more than card grids. |

V3 also applies a **landing-page scorecard framework** to the above-the-fold structure: Hook → Assessment/Mechanism Promise → Differentiated Value → Credibility → CTA Stack. The page should _answer five questions_ before the user scrolls.

---

## Typography (V3 lock candidate)

**Drop:** Fraunces.
**Keep:** JetBrains Mono (for labels, coordinates, annotations, stat values).
**Promote:** Inter as the only display + body face. Variable-weight handles 12px → 80px from a single file.

```scss
.streetlamp-preview-v3 {
	--font-display: 'Inter', system-ui, sans-serif;
	--font-body: 'Inter', system-ui, sans-serif;
	--font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

### Type scale (Inter doing all the work)

```
display-xl   72px  Inter  800  -0.04em letter-spacing  hero tagline
display-lg   56px  Inter  800  -0.03em                 large section headers
display-md   40px  Inter  700  -0.02em                 standard section headers
display-sm   28px  Inter  700  -0.015em                small section headers
body-lg      18px  Inter  400  1.55 line-height        reading body
body         16px  Inter  400  1.55                    default body
body-sm      14px  Inter  400  1.50                    small body
mono         12px  JetBrains 500  0.08em UPPERCASE     dossier-style labels
mono-lg      14px  JetBrains 500  0.06em UPPERCASE     prominent annotations
```

Inter at 800 weight + tight negative letter-spacing gives display-xl real weight without serifs. The visual gravitas now comes from **Greek imagery + size + weight + negative tracking**, not from a serif. JetBrains Mono labels carry the tech-spec annotation feel.

---

## Dossier language — internal vs external

**Internal (design docs, code, slack, internal admin UI):** "dossier" is fine and useful — it's a specific shape of personality breakdown that we do.

**External (homepage copy, user-facing labels, marketing):** ban "dossier."

### User-facing rebrand table

| Internal language    | User-facing replacement                                                               |
| -------------------- | ------------------------------------------------------------------------------------- |
| `DOSSIER №.0008`     | `№ 0008` (numbering survives, label drops) — or just drop entirely and lead with name |
| "1,247 dossiers"     | "1,247 personality breakdowns" / "1,247 people we've read"                            |
| "Inside one dossier" | "One breakdown, all the way through"                                                  |
| "The dossier card"   | "The breakdown" / "The reading"                                                       |
| "Compile a dossier"  | "Read someone all the way through"                                                    |
| "The Library"        | **Keep** — not jargon, evokes corpus depth                                            |
| "The Archive"        | **Keep as alternative** — also not jargon                                             |
| `CASE FILE 0042`     | `№ 0042` — we drop "case file" too, it's detective-y                                  |

Mono labels in the actual UI shift from `DOSSIER №.0008 · TYPE VIII` to either:

- **Option A:** `№ 0008 · TYPE 8 · THE CHALLENGER` (numbering + type + name, no jargon)
- **Option B:** Just `TYPE 8 · THE CHALLENGER` and put the number small in a corner
- **Option C:** Drop the number entirely; lead with the subject's actual name

For V3 build: use **Option A** as the default. Easy to swap.

---

## Time-dynamic open-question section

The section that was "Tonight's Open Floor" in V2 becomes time-aware. Title and mono kicker change based on the user's local time at page load.

### The 4 windows

| Local time  | Section title                      | Mono kicker example                             |
| ----------- | ---------------------------------- | ----------------------------------------------- |
| 5:00–11:59  | **This morning's open question**   | `OPEN · MORNING · MAY 02 · 137 RESPONSES`       |
| 12:00–16:59 | **This afternoon's open question** | `OPEN · AFTERNOON · MAY 02 · 137 RESPONSES`     |
| 17:00–21:59 | **This evening's open question**   | `OPEN · EVENING · MAY 02 · 137 RESPONSES`       |
| 22:00–4:59  | **Still open at midnight**         | `OPEN · LATE · MAY 02 · 137 RESPONSES · 1 OF 9` |

Boundaries are deliberately uneven — the night window is wider because that's the platform's emotional territory. The "still open at midnight" wording mirrors the streetlamp-meetup vibe most directly; the other three keep the warmth without forcing the metaphor.

### Implementation

```ts
function getTimeWindow(): { title: string; kicker: string } {
	const hour = new Date().getHours();
	if (hour >= 5 && hour < 12) {
		return { title: "This morning's open question", kicker: 'MORNING' };
	} else if (hour >= 12 && hour < 17) {
		return { title: "This afternoon's open question", kicker: 'AFTERNOON' };
	} else if (hour >= 17 && hour < 22) {
		return { title: "This evening's open question", kicker: 'EVENING' };
	} else {
		return { title: 'Still open at midnight', kicker: 'LATE' };
	}
}
```

Use `$state` + `$derived` so it's reactive to the page-load time. (Don't worry about it changing while the user is on the page — page load is the snapshot.)

---

## The above-the-fold scorecard

Per the BuildOS framework, the above-the-fold needs to answer **five questions** before any scroll, in this order:

1. **Hook** — what frustration / aspiration / category insight is the user landing with?
2. **Mechanism Promise** — what does the product _do_?
3. **Differentiated Value** — three areas where 9takes wins vs. alternatives the buyer already considers
4. **Credibility** — why trust this?
5. **CTA Stack** — action + time cost + price + payoff

For 9takes specifically, those become:

| Scorecard slot       | 9takes answer                                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Hook                 | "Frustrated that the same patterns keep playing out — even though you've read the books?"                        |
| Mechanism Promise    | "Drop a real situation. Comment your take first. See how each of the 9 emotional types reads it."                |
| Differentiated Value | (1) 9 typed perspectives, not 1 generic answer · (2) give-first prevents groupthink · (3) tactical, not academic |
| Credibility          | 1,247 people read all the way through · 47,000+ comments gathered · 2,500-year lineage                           |
| CTA Stack            | "Drop your take · 90 seconds · free · get 9 honest reads back"                                                   |

---

## Above-the-fold layout — the "Anatomy of 9takes" diagram

This is the V3 hero. **It is a single annotated system diagram, not a stack of card panels.**

### Conceptual layout (desktop)

```
┌──────────────────────────────────────────────────────────────────────┐
│ 🚧 BANNER · V3 PROPOSAL · 2026-05-02                       ☼  ✕      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  §01 · OBSERVATION                                                   │
│  ──────────                                                          │
│                                                                      │
│  See the emotions                            ┌──────────────────┐    │
│  behind every take.                          │                  │    │
│                                              │  GREEK STATUE    │    │
│  ──────────                                  │  half-lit warm   │    │
│  LAT 37.9755° N · LONG 23.7348° E · 2,500 YR │                  │    │
│                                              │                  │    │
│  Frustrated that the same patterns keep      │                  │    │
│  playing out — even though you've read       │                  │    │
│  the books?                                  └──────────────────┘    │
│                                                                      │
│  ─────────────────────────────────────────────────────────────       │
│                                                                      │
│  ┌── §02 INPUT ────┐ ┌── §03 MECHANISM ───┐ ┌── §04 OUTPUT ─────┐    │
│  │                 │ │                    │ │                   │    │
│  │ ONE SITUATION   │→│ GIVE YOUR TAKE     │→│ 9 EMOTIONAL      │    │
│  │ from your life  │ │ first — before     │ │ READS of the     │    │
│  │ or someone's    │ │ the room can       │ │ same situation,  │    │
│  │ else's          │ │ shape it           │ │ one per type     │    │
│  │                 │ │                    │ │                   │    │
│  └─────────────────┘ └────────────────────┘ └───────────────────┘    │
│                                                                      │
│  ─────────────────────────────────────────────────────────────       │
│                                                                      │
│  §05 · WHERE TO START                                                │
│                                                                      │
│  ●─→ NEW HERE? Start with the 9-minute primer                        │
│  ●─→ KNOW YOUR TYPE? Drop tonight's take                             │
│                                                                      │
│  ─────────────────────────────────────────────────────────────       │
│                                                                      │
│  §06 · WHY TRUST THIS                                                │
│  1,247 personality breakdowns · 47,000+ unbiased takes · 2,500 yr    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Composition rules

- **One radial warm-light pool** from upper-left, illuminating the §01 OBSERVATION area and the statue.
- **Greek statue at upper-right** — chiaroscuro-treated in dark mode, normal in light mode. Same as V1/V2 but slightly smaller; the statue is now part of a diagram, not its own focal panel.
- **Three INPUT → MECHANISM → OUTPUT panels** are NOT cards in the V2 sense. They're labeled regions of one continuous diagram, separated by **arrow connectors** (→ in `--lamp-glow`) and held together by a horizontal scale-marker line above them. Each panel has:
  - Mono label up top: `§02 INPUT`, `§03 MECHANISM`, `§04 OUTPUT`
  - 1px `--stone-edge` border (no shadow, no card-fill — they should read as _regions of a diagram_, not stacked cards)
  - Plain text content in Inter
- **Entry points (§05)** are bullet → links, not card panels. Two short lines, in-line with the diagram flow, not separate hero CTAs. The user picks a path _as part of reading the diagram_, not by clicking out of one.
- **Credibility (§06)** is a single mono line at the bottom of the fold — concise stat trio, not a stat-block grid.

### Why this works as a scorecard answer

| Slot                 | Lives at                                                                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Hook                 | §01 OBSERVATION + the "Frustrated that..." line                                                                                           |
| Mechanism Promise    | §02–§04 INPUT/MECHANISM/OUTPUT diagram                                                                                                    |
| Differentiated Value | The 3 diagram panels themselves answer this implicitly: 9 perspectives (vs. 1), give-first (vs. groupthink), real situations (vs. theory) |
| Credibility          | §06 stat line                                                                                                                             |
| CTA Stack            | §05 entry points                                                                                                                          |

The whole above-the-fold reads as **one annotated diagram explaining 9takes**, with Greek imagery as cultural anchor and mono labels as connective tissue. That's the diagrammatic feel DJ asked for — same scorecard answers, no card stacks.

---

## Below the fold (V3 sections)

### 7. The hook — "we know things"

Same as V2. Two-column. Three brand-voice tactical lines. No glow.

### 8. Time-dynamic open question

Replaces V2's "Tonight's Open Floor." Same proof-of-concept demo (question + 3 type takes shown openly), but title is dynamic per the time-window logic above.

Visual treatment carries forward from V2:

- Inter display-md section title (dynamic per time)
- Mono kicker (dynamic per time)
- Question in Inter italic (display-lg or display-md, depending), with `--lamp-glow` left border, blockquote feel
- Three full type takes (T4 / T6 / T8 stub copy from V2 spec — keep verbatim)
- Type-color stripe on left edge of each take
- Mono mini-meta `↑ 47 · 12 REPLIES · BY @USERNAME · TIMESTAMP`

### 9. Diagrammatic comparison — "9 perspectives vs. 1 generic answer"

NEW for V3. Replaces V2's standalone Library section _as the next beat_.

A small comparison diagram that visualizes the differentiated value:

```
   ASK A FRIEND           ASK REDDIT             ASK 9TAKES
   ────────────           ──────────             ──────────

      ●                    ● ● ●                   ●─●─●
                                                   │ │ │
   one read              loud reads             ●─●─●─●─●
                                                   │ │ │
                                                   ●─●─●

   their type only      whoever yells         9 emotional lenses
                        first wins            on the same situation
```

Each column is a labeled region (not a card). Subhead in Inter body-sm `--ink-mid`: explains in one line. The 9takes column shows a stylized 9-point Enneagram figure (use `/static/enneagram.svg` if it fits).

This section earns the page's right to be diagrammatic — it's the moment where the diagram _is_ the argument.

### 10. The Library — broad view

Carry forward from V2. Same dossier-grid layout for personality breakdowns, but with V3 user-facing copy:

- Section title: **"The Library."** (single word — clean, reverent, no jargon)
- Subhead: "1,247 personality breakdowns. Public figures. Fictional characters. Athletes. Founders. Read at the depth you'd expect from a real psychologist, not a clickbait listicle."
- Mono kicker: `THE LIBRARY · 1,247 BREAKDOWNS · 9 TYPES · GROWING`
- Cards keep V2 structure; mono labels shift from `DOSSIER №.0042` to `№ 0042 · TYPE 8 · THE CHALLENGER`
- CTA: **"Browse all 1,247 breakdowns →"**

### 11. By the numbers

Same as V2's "What we've compiled." Section title swaps to: **"By the numbers."**

Stat block labels (user-facing copy):

```
PERSONALITY            EMOTIONAL              LINEAGE                COMMENTS
BREAKDOWNS             FRAMES                                        GATHERED

 1,247                  9                     2,500 yr               47,000+
── growing ──         ── exact ──            ── plato → now ──      ── unbiased ──
```

### 12. Inside one breakdown — Type VIII zoom

Same as V2's "Inside one dossier" but renamed. User-facing copy. The zoom-in case study after the broad Library view.

- Section title: **"Inside one breakdown."**
- Card top label: `№ 0008 · TYPE 8 · THE CHALLENGER`
- Everything else: same as V2

### 13. The mechanism — give-first explainer

Same as V2's "The Meetup." Three steps. Philosopher-gathering treated background.

Optional rename: **"How a take turns into 9 reads."** — more diagrammatic, less metaphorical. Use this if "The Meetup" feels too cute. Keep "The Meetup" if the late-night intimacy reading is doing brand work.

### 14. Footer

Same as V2.

---

## Build-this-not-that (V3)

| Build this                                                                 | Not that                                                          |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Inter at variable weights for everything from 12px → 80px                  | Fraunces, Playfair Display, or any serif headlines                |
| Above-the-fold as one annotated diagram (INPUT → MECHANISM → OUTPUT)       | Above-the-fold as two card panels with separate CTAs              |
| Diagram regions separated by 1px `--stone-edge` borders + arrow connectors | Diagram regions as filled cards with backgrounds and shadows      |
| Time-dynamic section titles based on local time                            | Hard-coded "Tonight's Open Floor" regardless of user's local time |
| User-facing label: "personality breakdown," "case," or just the type name  | User-facing label: "dossier"                                      |
| Comparison section as a labeled diagram (3 columns, visual comparison)     | Comparison section as 3 stacked feature cards                     |
| Greek statue prominent, embedded in the diagram                            | Greek statue removed in favor of pure tech-spec                   |
| `№ 0008 · TYPE 8 · THE CHALLENGER` label format                            | `DOSSIER №.0008 · DECLASSIFIED · TYPE VIII`                       |

---

## Tech notes for the implementer

- **Build at:** `src/routes/design-preview/v3/+page.svelte`
- **Don't touch:** V1 (`/design-preview`), V2 (`/design-preview/v2`), production (`+page.svelte`), global tokens
- **Reuse from V2:**
  - Color tokens (dark + light, exact same hex values)
  - Theme toggle implementation (separate `localStorage` key: `'9takes-preview-theme-v3'`)
  - Stub data for type takes and library breakdowns (verbatim from V2 spec)
  - Sticky banner pattern
- **New for V3:**
  - Drop Fraunces from `<svelte:head>` Google Fonts link. Load only Inter (multiple weights) + JetBrains Mono. Inter weights to load: 400, 500, 600, 700, 800.
  - Above-the-fold diagram composition (replaces V2's two-panel hero)
  - Time-window logic (`getTimeWindow()` function)
  - Comparison diagram section (NEW)
  - User-facing copy rebrand (no "dossier")
- **Banner text:** `🚧 DESIGN PREVIEW — Streetlamp Symposium v3 · 2026-05-02 · diagrammatic + Inter + time-dynamic`
- **Sticky banner z-index, theme toggle position, dismiss behavior:** same as V2

---

## Success criteria

After V3 ships, DJ should be able to:

1. **Recognize the page as more diagrammatic than V2** — the above-the-fold reads as one explanation, not a stack of marketing tiles.
2. **Read the typography as clean, modern, not weird** — Inter does the heavy lifting, no serif tension.
3. **See user-facing copy without "dossier"** — internal language stays in design docs, user-facing labels read as plain English.
4. **Visit at different times of day and see the open-question title change** — "this morning's open question" at 9 AM, "still open at midnight" at 1 AM.
5. **Walk through the page and see all five scorecard slots answered** — Hook, Mechanism Promise, Differentiated Value, Credibility, CTA Stack — without having to scroll three times to find each one.
