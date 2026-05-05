<!-- docs/design/2026-05-03-streetlamp-symposium-v4.md -->

# Streetlamp Symposium — V4 Mood Spec

**Date:** 2026-05-03
**Status:** Proposal V4 (not locked). Builds on V3.
**Build target:** `/design-preview/v4`

**Inherits from V3** (no changes): Inter-only typography, JetBrains Mono labels, all color tokens (light + dark), theme toggle (separate localStorage key `'9takes-preview-theme-v4'`), no-dossier user-facing copy rule, time-dynamic open-question section, banner pattern, Library + By the numbers + Inside one breakdown sections.

**Related docs:** V3 spec `docs/design/2026-05-02-streetlamp-symposium-v3.md`, V2 spec `docs/design/2026-05-01-streetlamp-symposium-v2.md`.

---

## What changed from V3

DJ's V3 review surfaced three issues:

| V3 issue                                                                                                                                                              | V4 fix                                                                                                                                                                        |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The frustration hook ("...even though you've read the books?") only addresses people who've already read psychology. Excludes the larger NEW-HERE audience.           | Replace the single hook with a **branching question** above the fold: "Do you know about the Enneagram?" with both paths visible (NEW HERE / I KNOW THIS).                    |
| V3 mentions "9 emotional reads" but never explains what the 9 actually are. Newbies bounce.                                                                           | Add a **§04 · THE 9 IN 9 LINES** primer right after the hero. Tabular, glanceable, anyone benefits.                                                                           |
| V3's INPUT → MECHANISM → OUTPUT is too schematic — three labeled boxes isn't really a flow chart. The production homepage had a more genuinely connected explanation. | Build a proper **§05 · THE FLOW** — connected flow chart with boxes, arrows, give-first lock, 9-way fan-out, pattern-recognition output. Replaces the V3 three-panel diagram. |

V4 also retires V3's "How a take turns into 9 reads" mechanism explainer — the new §05 flow chart subsumes it. Net section count: V4 is one section shorter than V3.

---

## V4 section flow

```
┌─────────────────────────────────────────────────────────┐
│ Banner (sticky) · theme toggle                          │
├─────────────────────────────────────────────────────────┤
│ §01 OBSERVATION  +  Greek statue                        │
│   • Tagline: "See the emotions behind every take."      │
│   • Subhead: "9takes turns one situation into 9         │
│     emotional reads — one per personality type. Then    │
│     it shows you the pattern."                          │
│                                                         │
│ §02 WHERE TO START — branching                          │
│   ├─→ NEW HERE       see the 9 types in 9 lines  →     │
│   └─→ I KNOW THIS    drop today's take            →     │
│                                                         │
│ §03 WHY TRUST THIS — credibility mono line              │
├─────────────────────────────────────────────────────────┤
│ §04 · THE 9 IN 9 LINES — 9-types primer (tabular)       │
├─────────────────────────────────────────────────────────┤
│ §05 · THE FLOW — connected flow chart (situation →      │
│   give-first lock → 9-way unlock → pattern)             │
├─────────────────────────────────────────────────────────┤
│ §06 · time-dynamic open question + 3 takes (V3 carry)   │
├─────────────────────────────────────────────────────────┤
│ §07 · comparison diagram (V3 carry)                     │
├─────────────────────────────────────────────────────────┤
│ §08 · The Library (V3 carry)                            │
├─────────────────────────────────────────────────────────┤
│ §09 · By the numbers (V3 carry)                         │
├─────────────────────────────────────────────────────────┤
│ §10 · Inside one breakdown (V3 carry)                   │
├─────────────────────────────────────────────────────────┤
│ Footer                                                  │
└─────────────────────────────────────────────────────────┘
```

---

## §01 + §02 + §03 — above the fold (branching hero)

**Layout (desktop):**

```
§01 · OBSERVATION                              ┌──────────────┐
─────                                          │              │
                                               │ GREEK STATUE │
See the emotions                               │ chiaroscuro  │
behind every take.                             │              │
                                               │              │
─────                                          └──────────────┘
LAT 37.9755° N · 2,500 YR LINEAGE

9takes turns one situation into 9 emotional reads — one for
each personality type. Then it shows you the pattern.

─────────────────────────────────────────────────────────────

§02 · WHERE TO START
       │
       ├─→  NEW HERE          see the 9 types in 9 lines  ↓
       │
       └─→  I KNOW THIS       drop today's take           →

─────────────────────────────────────────────────────────────

§03 · WHY TRUST THIS
1,247 PERSONALITY BREAKDOWNS · 47,000+ UNBIASED TAKES · 2,500 YR LINEAGE
```

### Specifics

- Tagline is unchanged: **"See the emotions behind every take."** Inter 800, display-xl, -0.04em letter-spacing, `--ink-bright`.
- New subhead replaces V3's frustration line. Inter 400, body-lg, `--ink-mid`. **"9takes turns one situation into 9 emotional reads — one for each personality type. Then it shows you the pattern."** Teaches the mechanism in one sentence without presupposing Enneagram knowledge.
- Greek statue: same V1/V2/V3 chiaroscuro treatment in dark mode, normal filters in light mode.
- §02 is a labeled branch — NOT two card panels. Single mono kicker (`§02 · WHERE TO START`), then a vertical pipe (`│`) acting as the trunk, with two horizontal branches:
  - `├─→  NEW HERE          see the 9 types in 9 lines  ↓`
  - `└─→  I KNOW THIS       drop today's take           →`
  - The arrows differ on purpose: `↓` for NEW HERE points down to the §04 primer below; `→` for I KNOW THIS jumps further down to §06 (the open question) — visually signaling that the two paths go to different places. Both are anchor links.
- The whole §02 block is rendered with mono characters where shown (the `├─→` and `└─→` connectors are real Unicode box-drawing chars, in JetBrains Mono, in `--lamp-glow`). Inter for the labels and descriptions.
- §03 is a single mono line. No padding-heavy stat blocks. Just a fact strip.

---

## §04 — THE 9 IN 9 LINES (the primer)

A tabular reference of the 9 emotional types. Compact. Reads like a tech-spec table. Glanceable. Doesn't require anyone to read all 9 to get the gist — anyone scanning sees the column structure and gets it.

### Layout

```
§04 · THE 9 IN 9 LINES
each type leads with a different emotional read of the same situation.

  №   ┃   TYPE                  ┃   WHAT THEY SEE FIRST
  ───   ────────────────────────   ─────────────────────────
  01    THE PERFECTIONIST          what's broken
  02    THE HELPER                 what people need
  03    THE ACHIEVER               what wins
  04    THE INDIVIDUALIST          what's missing
  05    THE INVESTIGATOR           the system underneath
  06    THE LOYALIST               the threat
  07    THE ENTHUSIAST             what's next
  08    THE CHALLENGER             the power dynamic
  09    THE PEACEMAKER             the harmony
```

### Specifics

- Section heading: Inter display-md, `--ink-bright`, **"The 9 in 9 lines."**
- One-line subhead in Inter body, `--ink-mid`: "each type leads with a different emotional read of the same situation."
- The table itself:
  - 9 rows
  - 3 columns: №, TYPE, WHAT THEY SEE FIRST
  - 3px solid type-color stripe on the left edge of each row (using `--type-1-color` through `--type-9-color`)
  - № column: JetBrains Mono, `--ink-dim`, 14px
  - TYPE column: Inter 600, `--ink-bright`, body, uppercase, slightly tracked (0.04em)
  - WHAT THEY SEE FIRST column: Inter 400 italic, `--ink-mid`, body
  - Row separator: 1px `--stone-edge` between rows
  - Hover: subtle `--lamp-soft` background on the row, no transform
  - Click on a row: anchor-jump to the open-question section (or future: a deeper page about that type)
- Mobile: same table structure, possibly tighter padding. No collapse to cards — keep tabular feel.

This section answers "what are the 9?" in a way that respects both NEW-HERE (learns the framework) and I-KNOW-THIS (uses it as a refresh card) audiences.

---

## §05 — THE FLOW (connected flow chart)

The actual mechanism, rendered as a real flow chart. Replaces V3's three-panel INPUT/MECHANISM/OUTPUT diagram.

### Visual structure

```
                          §05 · THE FLOW
                          ──────────────

                       ┌────────────────────┐
                       │  YOUR SITUATION    │
                       │  a real moment     │
                       │  from your life    │
                       └─────────┬──────────┘
                                 │
                                 ▼
                       ┌────────────────────┐
                       │  GIVE-FIRST LOCK   │
                       │  your honest take, │
                       │  written before    │
                       │  the room shapes it│
                       └─────────┬──────────┘
                                 │
                                 ▼
                       ┌────────────────────┐
                       │  9 READS UNLOCK    │
                       └─────────┬──────────┘
                                 │
            ┌────────────────────┼────────────────────┐
            ▼                    ▼                    ▼
    ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
    │   T1's READ │ ...  │   T5's READ │ ...  │   T9's READ │
    │   "what's   │      │   "the      │      │   "the      │
    │   broken"   │      │   system"   │      │   harmony"  │
    └──────┬──────┘      └──────┬──────┘      └──────┬──────┘
           │                    │                    │
           └────────────────────┼────────────────────┘
                                 ▼
                       ┌────────────────────┐
                       │   THE PATTERN      │
                       │   you see what     │
                       │   each type leads  │
                       │   with — and what  │
                       │   you've been      │
                       │   missing          │
                       └────────────────────┘
```

### Specifics

- **Use SVG for the flow chart**, not CSS-only. SVG handles the connecting lines + arrowheads cleanly across viewports. Inline SVG in the page (not external file) so the agent can theme stroke colors via `currentColor` or CSS variables.
- **Boxes:** white-stone (`--stone-warm`) fill in dark mode, white in light mode; 1px `--stone-edge` border; 8px corner radius (Tailwind `rounded-md`); padding 16-20px.
- **Box typography:** label in JetBrains Mono uppercase 12px, `--lamp-glow`; body in Inter 14px, `--ink-bright` (or slightly muted to `--ink-mid`).
- **Arrows:** stroke `--lamp-glow` at 2px, with 8px arrowhead. Vertical arrows for sequential flow; the 9-way fan-out shows three boxes (representative — not all 9) with mono "..." between them indicating "and 6 more typed reads."
- **The 9-way fan-out:** show 3 sample type-reads (T1, T5, T9 — picking 1 from each emotional center: gut/head/heart) with mono `... 6 more reads` between them. Each box has its type-color stripe on top edge.
- **Layout breakpoints:**
  - Desktop ≥ 1024px: full diagram, fan-out shows 3 boxes side-by-side
  - Tablet 768–1024px: same, slightly compressed
  - Mobile < 768px: full collapse to vertical stack — the fan-out becomes a single column where the three sample reads sit one above the other, connector lines on the left side of each box
- **Animations (optional, low priority):** on scroll-into-view, fade in boxes top-to-bottom. Honor `prefers-reduced-motion`.

### Why this is the meat of V4

This single diagram answers:

- What does 9takes do mechanically? (the boxes and arrows)
- Why is "give-first" different from comments? (the lock box)
- What do you actually get out? (the pattern box)
- What does a "type read" look like? (the 3 sample boxes)

The user can scan the diagram and _understand the entire 9takes mechanism_ without reading any prose. That's the diagrammatic-first feel DJ asked for in V3 and called out as still missing.

---

## §06 + §07 + §08 + §09 + §10 — carry forward from V3 unchanged

- §06 Time-dynamic open question (the 4-window logic, T4/T6/T8 takes shown openly)
- §07 Comparison diagram (ASK A FRIEND / ASK REDDIT / ASK 9TAKES)
- §08 The Library (1,247 personality breakdowns grid)
- §09 By the numbers (4 stat blocks)
- §10 Inside one breakdown (deep-zoom Type 8 card)

All of these survive untouched from V3 — same copy, same structure, same styling. Only the section number changes.

V3's "How a take turns into 9 reads" / "The Mechanism" section is **retired** in V4. The new §05 flow chart subsumes it.

---

## Build-this-not-that (V4 deltas)

| Build this                                                                                                            | Not that                                                                        |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Branching question above the fold ("Do you know about the Enneagram?" with both paths visible as flow-chart branches) | A single hook line that assumes user is already familiar with personality books |
| Explain the 9 types via a tabular primer (3-column reference table)                                                   | Mention "9 emotional reads" without ever defining what the 9 are                |
| Render §05 as an actual SVG flow chart with boxes, arrows, branches, fan-out                                          | Render §05 as three labeled regions (V3 was too schematic)                      |
| Retire the "How a take turns into 9 reads" mechanism explainer                                                        | Keep both V3's three-panel diagram AND a new flow chart (redundant)             |
| §02 branching uses real Unicode box-drawing chars (`├─→`, `└─→`, `│`) in JetBrains Mono                               | §02 branching uses two big rounded-rectangle CTA buttons                        |
| §04 primer uses 1-line type descriptors that are actionable ("what's broken," "the threat")                           | §04 primer uses generic personality blurbs ("loyal and reliable")               |

---

## Tech notes for the implementer

- **Build at:** `src/routes/design-preview/v4/+page.svelte`
- **Don't touch:** V1, V2, V3, production, global tokens
- **Reuse from V3:**
  - Color tokens (dark + light, exact same hex values)
  - Theme toggle implementation (separate `localStorage` key: `'9takes-preview-theme-v4'`)
  - Font loading (Inter only, JetBrains Mono via global)
  - Stub data for type takes, library breakdowns, corpus stats
  - All sections from §06 onward (open question, comparison, library, stats, deep zoom)
- **New for V4:**
  - Branching above-the-fold (replaces V3's diagrammatic INPUT/MECHANISM/OUTPUT layout)
  - §04 9-types primer table (NEW)
  - §05 connected flow chart in inline SVG (NEW; replaces V3's three-panel diagram)
- **Banner text:** `🚧 DESIGN PREVIEW — Streetlamp Symposium v4 · 2026-05-03 · branching + 9-types primer + flow chart`
- **Stub data for the 9-types primer (use exactly these one-liners):**

```ts
const nineTypes = [
	{ num: 1, name: 'THE PERFECTIONIST', read: "what's broken" },
	{ num: 2, name: 'THE HELPER', read: 'what people need' },
	{ num: 3, name: 'THE ACHIEVER', read: 'what wins' },
	{ num: 4, name: 'THE INDIVIDUALIST', read: "what's missing" },
	{ num: 5, name: 'THE INVESTIGATOR', read: 'the system underneath' },
	{ num: 6, name: 'THE LOYALIST', read: 'the threat' },
	{ num: 7, name: 'THE ENTHUSIAST', read: "what's next" },
	{ num: 8, name: 'THE CHALLENGER', read: 'the power dynamic' },
	{ num: 9, name: 'THE PEACEMAKER', read: 'the harmony' }
];
```

- **Anchor IDs for §02 branching:**
  - NEW HERE → `id="primer"` on §04
  - I KNOW THIS → `id="open-question"` on §06

---

## Success criteria

After V4 ships, DJ should be able to:

1. **Read above-the-fold once and see both paths visibly addressed** — NEW HERE and I KNOW THIS branches present in the diagram itself, no clicks required to surface them.
2. **Scan the §04 primer in 5 seconds** and understand what each of the 9 types leads with emotionally.
3. **Trace the §05 flow chart end-to-end** and walk away understanding the give-first mechanism, the 9-way unlock, and the pattern-recognition output — without reading any prose section.
4. **Recognize this as the "connected flow chart" they wanted** when they referenced production's earlier landing page approach.

If V4 lands, lock candidates:

- §05 flow chart as the canonical "how 9takes works" diagram (also useful on `/about`, `/how-it-works`, FAQ pages)
- §04 primer table as a reusable 9-types reference (also useful on `/personality-analysis` index, blog index, etc.)
- The branching above-the-fold pattern as the canonical homepage entrypoint
