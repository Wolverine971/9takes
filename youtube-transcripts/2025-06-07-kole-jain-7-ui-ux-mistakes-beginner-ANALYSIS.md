---
title: 'ANALYSIS: 7 UI/UX mistakes that SCREAM you''re a beginner — Kole Jain'
source_video: 'https://www.youtube.com/watch?v=AH_ugxmLeUM'
source_transcript: 2025-06-07-kole-jain-7-ui-ux-mistakes-beginner.md
analyzed_date: '2026-04-27'
path: youtube-transcripts/2025-06-07-kole-jain-7-ui-ux-mistakes-beginner-ANALYSIS.md
---

# Analysis: 7 UI/UX Mistakes That SCREAM You're a Beginner

**Speaker:** Kole Jain
**Format:** 7-minute Figma walkthrough redesigning a recipe app, mistake-by-mistake
**Core thesis:** Beginner UIs aren't broken from lack of skill — they're broken from a small set of repeatable, fixable mistakes. Polish comes from subtraction, consistency, and respect for the user's flow, not from adding more visual flair.

---

## TL;DR — The 8 Mistakes

| # | Mistake | One-line fix |
|---|---------|--------------|
| 1 | Bad user flow | Sketch on paper before designing; cover edge cases (skip, no-results, empty states) |
| 2 | Overusing effects | Strip gradients/shadows. If you must, use same-color gradients and soft light-gray shadows |
| 3 | Tight spacing | Use grids + auto layout. Mobile needs more whitespace than you think |
| 4 | Inconsistent components | Standardize corner radius (10px for small components), reuse components, use color/measurement variables |
| 5 | Bad icons | One icon library; consistent stroke/fill; tooltips for unfamiliar icons |
| 6 | Redundant elements | Kill arrows when swipe works; remove decorative strokes |
| 7 | Missing interactive feedback | Grayed-out states on click, loading spinners, badge dots after save |
| 8 | (Bonus) Overdesigned charts | Function over Dribbble-aesthetic. Show the axis. One bar per data point |

---

## The Tips & Tricks (Detailed)

### 1. User Flow — the silent UX killer

**The diagnosis:** Designers build screens, not flows. The allergy screen has 6 preset options but no search bar (what if user is allergic to something else?) and no skip button (what if user has no allergies?).

**The fixes:**
- **Sketch on paper first.** Box-and-arrow flowcharts catch entire missing screens before pixels ever get pushed.
- **Audit for the most-commonly-missed elements:**
  - Navigation links
  - Hidden states (loading, empty, error, no-results)
  - Dynamic interactions (hovers, micro-interactions)
- **Add escape hatches:** skip buttons, "other" options, search-on-top-of-presets.
- **Small touches matter:** filter icon on search bar, save button up top.

**Quote:** *"These are things you will miss if you don't plan out your flow, but users, they'll feel it instantly."*

---

### 2. Overusing Effects — the addiction problem

**The diagnosis:** Beginners reach for shadows, glows, and gradients to make designs "feel premium." It does the opposite — it screams beginner.

**The fixes:**

**Gradients:**
- If you must use one, stay in the same color family (darker green → lighter green, not blue → green).
- Default to no gradient. *"Honestly, this would look way cleaner with no gradient at all. And that's usually the case."*

**Drop shadows:**
- Figma's default drop shadow is too harsh — don't just lower opacity.
- **Three-step shadow recipe:**
  1. Change shadow **color** to light gray (not pure black)
  2. Increase the **blur** significantly
  3. Or just remove the shadow entirely
- Heuristic: *"Less visual noise equals a better design."*

---

### 3. Spacing — most beginner UIs are too tight

**The diagnosis:** Things touching each other / small margins / no breathing room — the #1 visual signal of an amateur.

**The fixes:**
- **Grids:** 3-column grid for one screen, 2-column for another. Align elements to the grid as closely as possible. If breaking the grid still feels balanced, leave it.
- **Auto layout** for cards and chips with wonky layouts. Turn off **vertical trim** for pixel-perfect control.
- **Vertical spacing in stacks:** increase it to let things breathe and group naturally.
- **Mobile rule:** *"Especially on mobile screens, you'll need more space than you think."*

---

### 4. Inconsistent Components — the easy-to-fix tell

**The diagnosis:** Same component drawn differently across the app (e.g., back button and skip button — same job, different design). Different corner radii on similar elements.

**The fixes:**
- **Corner radius standard:** 10 pixels for all smaller components. *"This is an important one that most designers miss."*
- **Match same-purpose elements:** identical search bars (only the prompting text differs), identical skip/back buttons in size + radius + style.
- **The consistency stack — use Figma's reusability primitives:**
  - **Styles** for colors
  - **Variables** for measurements
  - **Components** for UI elements

---

### 5. Icons — underrated power-up

**The diagnosis:** No icons = walls of text users must read. Mismatched icons (some filled, some outlined, different stroke widths) = visual chaos. Mystery icons with no labels = onboarding friction.

**The fixes:**

**Where to add icons:**
- On cards that are currently text-only (replace "Save" text with an icon).

**How to make them consistent:**
- Use **one library**. Recommendations:
  - **Flat Icons** (website) — pick "interface icons," then sort by stroke, width, and corner.
  - Download as **SVG** for best results.
  - **Figma plugins:** Feather Icons, Phosphor Icons.
- Match fill, line width, and style across all icons in a group.

**When to label:**
- Universal icons (house, bookmark, user) — no label needed.
- Ambiguous icons — add a **tooltip pop-up** for onboarding clarity.

**Pro tip — when mixed icon styles are okay:**
> *"It is okay to have different styles of icons in the same design, but only if they're visually separate."*

Example breakdown: navbar icons can differ from food icons can differ from recipe icons — because each set lives in its own region serving a different purpose.

---

### 6. Redundant Elements — kill the clutter

**The diagnosis:** Decorative arrows, unnecessary strokes, and "stuff everywhere" trend-chasing. Each redundant element steals attention.

**The fixes:**
- Kill arrows when **swipe gestures** can replace them on mobile.
- Dim down button colors that don't need to demand attention.
- Strip strokes that aren't doing real work.
- **Contrast workaround:** if a stroke exists for accessibility/contrast reasons, dim it heavily instead of removing it.

---

### 7. Interactive Feedback — the underused effects

**The diagnosis:** Mistake #2 was *overusing* effects. This is the opposite: not enough feedback during interactions. Users click, nothing visible happens, they think the app is broken.

**The fixes:**

**Click feedback:**
- **Grayed-out state on click** — even a fraction of a second of visual change tells the user "the next screen is coming."
- **Loading spinner** if the wait is genuinely long.

**State-change feedback (the save-icon example):**
- Filling in the icon is good (step 1).
- **Step 2 — propagate the change:** add a red **badge dot** to the related tab (e.g., the Save tab) so the user sees the system-wide consequence of their action.

**Why this matters:** Feedback closes the action-result loop. No feedback = "did that work?" = re-tapping = bug reports.

---

### 8. Charts (Bonus) — function over Dribbble

**The diagnosis:** Charts are routinely overdesigned for portfolio aesthetics, destroying their actual job: communicating data.

**The crimes (a "Dribbble" chart):**
- No vertical axis → bars are unreadable.
- Rounded tops on bars → can't tell where the bar actually ends.
- 16 bars for 7 days of the week → meaningless visual padding.

**The fix:** Pick the boring, readable chart over the pretty one. *"Definitely less aesthetic, but conveys so much more useful information to the user."*

---

## Cross-Cutting Principles

These show up across multiple mistakes — they're the meta-rules of the video:

1. **Subtraction beats addition.** Most fixes are *removing* things: gradients, shadows, arrows, strokes, redundant chart bars.
2. **Consistency is cheaper than creativity.** Same corner radius, same icon family, same component patterns — beginners think variety is interesting; pros know it's exhausting.
3. **Plan flows, not screens.** A beautiful screen with no skip button is a worse design than an ugly screen with a complete flow.
4. **Defaults are traps.** Figma's default drop shadow, default spacing, default everything — beginners ship them; pros tune them.
5. **Feedback is part of the UI.** A button that doesn't acknowledge the click is broken, even if the code works.
6. **Aesthetics serve communication.** The Dribbble chart loses to the boring chart because the goal is information transfer, not portfolio screenshots.

---

## Quotables

> *"These are things you will miss if you don't plan out your flow, but users, they'll feel it instantly."*

> *"Most of the time, less visual noise equals a better design."*

> *"Especially on mobile screens, you'll need more space than you think."*

> *"It is okay to have different styles of icons in the same design, but only if they're visually separate."*

> *"Definitely less aesthetic, but conveys so much more useful information to the user."*

---

## Practical Checklist (Apply to 9takes UI)

A self-audit prompt for any 9takes screen — Q&A pages, blog layouts, admin panels:

- [ ] **Flow:** Is there a skip / no-thanks / empty-state path on every onboarding screen?
- [ ] **Effects:** Any default Figma/Tailwind shadows still in use? Any blue→green-style cross-color gradients?
- [ ] **Spacing:** Mobile padding feel cramped? Stack content has enough vertical breathing room?
- [ ] **Consistency:** All small components on 10px corner radius (or one chosen value)? Same-purpose buttons (back/cancel/skip) match?
- [ ] **Icons:** Single library across the screen? Mismatched stroke widths? Ambiguous icons missing tooltips?
- [ ] **Redundancy:** Arrows next to swipeable carousels? Decorative strokes doing nothing?
- [ ] **Feedback:** Click states on every button? Save actions reflect change in nav badge?
- [ ] **Charts (admin analytics):** Show axes? Avoid rounded bar tops? One bar per data point?

---

## Speaker Profile (Kole Jain)

- **Style:** Practical, fast-paced, before-and-after walkthroughs in Figma. No theory dumps.
- **Pedagogical pattern:** Identify mistake → show concrete example in a recipe app → apply the fix on screen → state the principle.
- **Implicit audience:** Self-taught designers / developers who want to ship UI that doesn't look amateur, without spending years on visual fundamentals.
- **Tools referenced:** Figma (auto layout, vertical trim, styles, variables, components), Flat Icons, Feather Icons, Phosphor Icons, Dribbble (cited as a *cautionary* source for over-aesthetic chart designs).

---

## What's Worth Stealing for 9takes

1. **The 10px corner-radius rule** — apply uniformly across atom-level components (buttons, chips, search bars, cards) for instant cohesion.
2. **The shadow recipe** — light-gray shadow color + heavy blur (or no shadow) instead of black-with-low-opacity. Worth auditing existing components for harsh defaults.
3. **The Dribbble-chart trap** — the admin analytics dashboard should prioritize readable axes over aesthetic bars.
4. **Save → badge dot** pattern — saving a question/blog could trigger a small badge on the saved tab to confirm the system state changed.
5. **Tooltip-on-ambiguous-icons** — onboarding-cost insurance for any icon-only nav element.
6. **The flow audit** — every onboarding/intake form should have a skip path and an "other" search escape. (Worth checking `/intake/[token]/` and `/book-session/`.)
