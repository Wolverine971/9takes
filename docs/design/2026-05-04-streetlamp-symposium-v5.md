<!-- docs/design/2026-05-04-streetlamp-symposium-v5.md -->

# Streetlamp Symposium — V5 Mood Spec (lock candidate)

**Date:** 2026-05-04
**Status:** Lock candidate. DJ said "let's just pick that right now on the design form." V5 fixes the two issues he flagged on V4; if it lands, we lock §4–§6 of `docs/design-system.md` against this aesthetic.
**Build target:** `/design-preview/v5`

**Inherits from V4** (no changes): tagline, Inter typography, JetBrains Mono labels, color tokens (light + dark), theme toggle (separate localStorage key `'9takes-preview-theme-v5'`), Greek statue chiaroscuro, §04 primer table, §05 flow chart, §06 time-dynamic open question, §07 comparison diagram, §08 Library, §09 By the numbers, §10 Inside one breakdown, footer, banner pattern.

**Related:** V4 spec `docs/design/2026-05-03-streetlamp-symposium-v4.md`.

---

## What changed from V4 — two surgical edits

### Edit 1 — Tagline subtext (the mechanism explainer)

DJ: _"I like seeing the emotions behind every take. We need to explain what that means. It means to say something about how you cannot see the answers to questions before you comment, which makes comments unbiased and authentic. The comments are anonymous. You need to say something like that."_

V4's subhead: _"9takes turns one situation into 9 emotional reads — one for each personality type. Then it shows you the pattern."_ — explains _what 9takes does_, but not _the mechanism that makes the takes credible_.

**V5 subhead replaces it with two sentences:**

> 9takes turns one situation into 9 emotional reads — one for each personality type.
>
> Drop your take first — anonymously, locked in before you can see anyone else's. That's how every comment stays unbiased, authentic, and your own.

Two sentences, two jobs. First sentence teaches the product. Second sentence teaches the give-first mechanism + anonymity + why the takes stay honest.

Visual treatment:

- Both sentences in Inter 400, body-lg (18px), `--ink-mid`
- 8–12px gap between the sentences (subtle paragraph break, not a hard div)
- Sits in the same place as V4's subhead — directly below the tagline + scale-marker line

### Edit 2 — §02 becomes a true left/right split

DJ: _"With the 'Do you know about the Enneagram?' This needs to split into two different paths: On the left, it should be the path for 'I don't know the Enneagram.' On the right, it should be the path of 'Okay, so you do know the Enneagram. Let's go into it.'"_

V4's §02 was a vertical-trunk branch (`├─→` and `└─→` off a single pipe). V5 makes it a real two-column split: NO on the left, YES on the right, both visible at the same time, with their own §-label and CTA.

**Layout (desktop):**

```
§02 · DO YOU KNOW THE ENNEAGRAM?

┌──────────────────────────────────┐  ┌──────────────────────────────────┐
│ §02A · NO                         │  │ §02B · YES                        │
│                                  │  │                                  │
│ Never heard of it. That's most    │  │ You know the rabbit hole.         │
│ people. The Enneagram is a         │  │ 9takes uses it to break down      │
│ 2,500-year-old framework that      │  │ real situations — yours, others', │
│ maps 9 ways emotions drive          │  │ public figures'. Give-first       │
│ behavior. Once you see the         │  │ keeps every comment honest.       │
│ patterns, you can't unsee them.    │  │                                  │
│                                  │  │                                  │
│ →  Start with the 9 in 9 lines  ↓ │  │ →  Drop today's take            → │
└──────────────────────────────────┘  └──────────────────────────────────┘
```

**Specifics:**

- Section heading mono kicker (above both panels): `§02 · DO YOU KNOW THE ENNEAGRAM?` — single line, JetBrains Mono uppercase, `--lamp-glow`, slightly larger (mono-lg 14px).
- Two columns, equal width on desktop. On mobile (<768px) they stack vertically (NO on top, YES below).
- Each column = a labeled region, NOT a card. Same diagrammatic treatment as V3's INPUT/MECHANISM/OUTPUT panels:
  - 1px solid `--stone-edge` border
  - Background `transparent` (NO fill — should read as a labeled region of a diagram, not a stacked card)
  - Padding 24–28px
  - No box-shadow, no border-radius variation that makes them feel "card-like" (use `rounded-md` 10px max)
- Top mono label inside each column: `§02A · NO` (left, in `--lamp-glow`) and `§02B · YES` (right, in `--data-teal`). Different colors signal different paths — amber = onboarding warmth; teal = data/system path.
- Headings (the explainer sentences) in Inter 500, body-lg (18px), `--ink-bright`. Two short sentences each, ~50 words max.
- Bottom CTA: inline arrow link, JetBrains Mono prefix (`→`) + Inter label, `--lamp-glow` color, hover underline. Same anchor links as V4 (`#primer` for NO path, `#open-question` for YES path).

**Why two columns instead of branches off a trunk:** the user explicitly asked for two paths "split left/right," so we lean into that. The diagrammatic feel survives because (a) borders are 1px stone-edge, no fills, no shadows, (b) mono section labels reinforce that these are _labeled regions of a diagram_ rather than _marketing cards_, and (c) the rest of the page (§04 primer, §05 flow chart) stays diagrammatic so the overall feel doesn't shift back to V2's card-stack.

---

## V5 section flow (unchanged from V4 except §01–§02)

```
┌─────────────────────────────────────────────────────────┐
│ Banner (sticky) · theme toggle                          │
├─────────────────────────────────────────────────────────┤
│ §01 OBSERVATION                                         │
│   • Tagline: "See the emotions behind every take."      │
│   • [V5 NEW] Two-sentence subtext explaining give-first │
│   • Greek statue (right side)                           │
│                                                         │
│ §02 · DO YOU KNOW THE ENNEAGRAM?                        │
│   • [V5 NEW] Two-column split: §02A NO  |  §02B YES    │
│                                                         │
│ §03 · WHY TRUST THIS — credibility mono line (V4)       │
├─────────────────────────────────────────────────────────┤
│ §04 · THE 9 IN 9 LINES (V4) — anchor #primer            │
├─────────────────────────────────────────────────────────┤
│ §05 · THE FLOW (V4)                                     │
├─────────────────────────────────────────────────────────┤
│ §06 · time-dynamic open question (V4) — anchor #open-question │
├─────────────────────────────────────────────────────────┤
│ §07–§10 + footer (V4 carry, unchanged)                  │
└─────────────────────────────────────────────────────────┘
```

Everything from §03 onward is identical to V4.

---

## Build-this-not-that (V5 deltas)

| Build this                                                                                   | Not that                                                   |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Two-sentence subtext under the tagline (mechanism + give-first + anonymity)                  | Single-sentence subhead from V4                            |
| §02 as a two-column left/right split (NO panel + YES panel, both visible at once)            | §02 as branches off a single vertical trunk (V4)           |
| Each §02 column with its own mono label (`§02A · NO`, `§02B · YES`) and color (amber + teal) | A single mono label for the whole §02 with shared branches |
| 1px stone-edge borders, no fills, no shadows on the §02 columns                              | Filled card-like panels with shadows                       |
| Mobile: §02A stacks above §02B                                                               | Mobile: §02 collapses into a single combined block         |

---

## Tech notes for the implementer

- **Build at:** `src/routes/design-preview/v5/+page.svelte`
- **Don't touch:** V1, V2, V3, V4, production, global tokens
- **Reuse from V4:** everything from §04 onward verbatim. Color tokens, theme toggle, font loading, stub data, banner pattern.
- **New for V5:**
  - Two-sentence subtext under the tagline
  - §02 two-column layout (replaces V4's branched §02)
- **Banner text:** `🚧 DESIGN PREVIEW — Streetlamp Symposium v5 · 2026-05-04 · lock candidate`
- **localStorage key:** `'9takes-preview-theme-v5'`

### Subtext copy (use exactly)

```html
<p class="hero-subhead-line-1">
	9takes turns one situation into 9 emotional reads — one for each personality type.
</p>
<p class="hero-subhead-line-2">
	Drop your take first — anonymously, locked in before you can see anyone else's. That's how every
	comment stays unbiased, authentic, and your own.
</p>
```

### §02 panel copy (use exactly)

LEFT panel:

```html
<div class="path-panel path-panel--no">
	<span class="path-label">§02A · NO</span>
	<p class="path-body">
		Never heard of it. That's most people. The Enneagram is a 2,500-year-old framework that maps 9
		ways emotions drive behavior. Once you see the patterns, you can't unsee them.
	</p>
	<a href="#primer" class="path-cta">→ Start with the 9 in 9 lines ↓</a>
</div>
```

RIGHT panel:

```html
<div class="path-panel path-panel--yes">
	<span class="path-label">§02B · YES</span>
	<p class="path-body">
		You know the rabbit hole. 9takes uses it to break down real situations — yours, others', public
		figures'. The give-first mechanic keeps every comment honest.
	</p>
	<a href="#open-question" class="path-cta">→ Drop today's take →</a>
</div>
```

---

## Success criteria

After V5 ships, DJ should be able to:

1. **Read the tagline + subtext and understand both _what 9takes does_ and _the mechanism that makes the takes honest_** — give-first, anonymous, unbiased, authentic — without scrolling.
2. **See both paths visibly addressed side-by-side** in §02 — the NO path doesn't feel hidden behind the YES path or vice versa.
3. **Recognize V5 as the lock candidate** — the visible structure now answers all the homepage's strategic jobs and just needs a polish/refinement pass to ship.

If V5 lands, we lock these in `docs/design-system.md`:

- §4 Brand mood: **Streetlamp Symposium** (warm-tech baseline + tech-spec personality analysis variant)
- §5 Color: warm-stone neutrals + sodium-amber primary + teal data accent + warm rose secondary + purple accent (the V3/V4/V5 palette)
- §6 Typography: **Inter (variable, all weights) + JetBrains Mono**, no serif
- §7 Spacing, §10 Motion, §11 Token wiring: still open, but next conversations
- Glow tokens: **prune as planned** in the gap analysis (cut to `--glow-sm`/`--glow-md` only)

After lock, the next moves are:

1. Build a real `/styleguide` route (per the gap-analysis plan)
2. Migrate production homepage `+page.svelte` to use the V5 visual decisions
3. Strip glow chains from buttons (Kole audit Week 1 Step 1, deferred since 2026-04-27)
4. Rebrand `BRAND-KIT.md` and `solo-leveling-*` docs as ARCHIVED
