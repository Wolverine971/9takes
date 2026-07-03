<!-- .codex/skills/hyperplexed-audit/references/audit-examples/PROJECT_PAGE_AUDIT_2026-06-26.md -->

# Project Page — Hyperplexed Design Audit (Worked Example)

> First live application of the [Hyperplexed Design Playbook](./HYPERPLEXED_DESIGN_PLAYBOOK.md).
> Surface: **Project Detail v2** — `apps/web/src/routes/projects/[id]/+page.svelte` and its
> seven visual child components.
> Method: audited Hyperplexed-style — **one surface at a time, region by region** — grading the
> rendered markup against the §1/§2 rubric. Captured 2026-06-26.
>
> **Scope caveat:** this is a _static markup_ audit (reading the DOM each component produces and the
> Tailwind/Inkprint classes on it), not a screenshot audit. It catches structural taste defects
> (alignment, padding symmetry, overflow handling, radius/motion consistency, keyboard a11y) with high
> confidence. A follow-up live pass (`pnpm dev --filter=web`, capture the real screens) should confirm
> the color/contrast calls in dark mode and the wrap behavior at real breakpoints.
>
> **Cross-reference:** stack these findings with `DESIGN_AUDIT_2026-06-12.md` and
> `MOBILE_EXPERIENCE_AUDIT_2026-06-12.md` so fixes don't duplicate.

---

## Surfaces audited

| #   | Surface                                                                      | File                                                                 |
| --- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | Project Header (+ next-step display, settings trigger)                       | `ProjectHeaderCard.svelte`, `NextStepDisplay.svelte`                 |
| 2   | Pulse Strip (Recently Done / Up Next)                                        | `v2/PulseStrip.svelte`                                               |
| 3   | Entity Tab Strip (Briefs·Chats·Graph·Goals·Milestones·Plans·Risks·Events)    | `v2/EntityTabStrip.svelte`                                           |
| 4   | Task Kanban Board (7 columns, desktop)                                       | `v2/TaskKanbanBoard.svelte`                                          |
| 5   | Mobile Task Board + Entity Search Combobox                                   | `v2/MobileTaskBoard.svelte`, `v2/ProjectEntitySearchCombobox.svelte` |
| 6   | Documents Section + Page Shell (skeletons, layout rhythm, settings dropdown) | `ProjectDocumentsSection.svelte`, `+page.svelte`                     |

---

## The headline: this surface has good bones

Before the defects — the thing Hyperplexed always grades first, **overflow**, is genuinely handled here.
Nearly every title and label across all six surfaces carries an explicit `line-clamp`/`truncate` with
`min-w-0` wrappers and `shrink-0` icons, so a long task title can't shove an icon out of alignment. That
is his #1 instinct and the most common failure in the wild — and it's already done. The combobox a11y
(full `role=combobox` + arrow/enter/escape + `aria-activedescendant`) is genuinely above-bar.

So this is a **polish** audit, not a rescue. The defects below are systemic-but-shallow: a handful of
patterns repeated across components, each cheap to fix once you fix it everywhere.

---

## Part 1 — The five systemic patterns (fix these as rules, not one-offs)

These are the Hyperplexed payoff: the same small problem wearing six different costumes. Fix each as a
single convention and most of the per-surface table in Part 2 clears itself.

### S1. ⛔ Same look, different behavior — the signature defect _(Highest leverage)_

**Rubric:** Hierarchy & Grouping — "don't co-locate items with different behavior" (his TV-shows-tab-among-filters complaint).

The Entity Tab Strip renders **modal-opening pills** (Chats, Graph, Events) with _identical_ markup to
**inline-expanding pills** (Goals, Milestones, Plans, Risks, Briefs, Inbox) — same shell, same hover,
and the only differentiator (a `ChevronDown`) appears _only after_ an inline pill is already expanded
(`EntityTabStrip.svelte:493-538`). At rest, you cannot tell which pills open an overlay and which expand
in place. This is the exact pattern Hyperplexed redesigns most often, and it's the single most valuable
fix on the page.

**Fix:** give the two behaviors persistent, distinct affordances — a small `ArrowUpRight`/`ExternalLink`
glyph in the right slot for modal pills, a persistent (collapsed) `ChevronDown` for inline pills. The
behavior should read at a glance, before any click.

### S2. Active state is under-differentiated and inconsistently colored

**Rubric:** Readability (active vs inactive must be obvious) + Color (one restrained accent).

"Selected" is signaled three different ways across the page, and each is weak on its own:

- **Entity Tab Strip:** the active/expanded pill changes _width_ (`w-full`) and adds a chevron, but keeps
  the same background and text color as a resting pill (`:488-490, :533`) — active reads almost entirely
  from width.
- **Pulse Strip mobile tabs:** "Recent" active is neutral (`bg-muted/40 border-foreground/50`) while
  "Up next" active is amber (`bg-warning/5 border-warning` + icon flips `text-warning`) (`:345, :368-373`)
  — two identical-behavior tabs, two different accent systems.
- **Mobile Task Board tabs:** active Backlog/Archived use `text-muted-foreground` with no active bg
  (`:109, :126`), so the selected tab is nearly indistinguishable from an unselected one.

**Fix:** pick _one_ active treatment (e.g. tinted bg + foreground text + accent border/underline) and
apply it identically to every tab/pill on the page. Reserve `warning`/color for _state_, never for "this
one happens to be selected."

### S3. Keyboard operability is the most-violated rubric item

**Rubric:** Motion & A11y — _"I am a developer and therefore need to operate this entire flow via my keyboard."_ (his most-emphasized 2026 bar.)

The combobox is exemplary, which makes the gaps elsewhere stand out:

- **Both tablists** (`PulseStrip` mobile, `MobileTaskBoard`) implement roving `tabindex` but ship **no
  arrow-key `keydown` handler** — the non-selected tab is literally unreachable by keyboard
  (`PulseStrip:341,364`; `MobileTaskBoard:413,424`).
- **Missing `focus-visible` rings** on the header buttons (`ProjectHeaderCard`), kanban cards + New-task /
  Load-archived buttons (`TaskKanbanBoard:671-685,573,627`), and the inner entity rows of every expanded
  panel (`EntityTabStrip:567,655,725,878,940`). `pressable` is not a focus token.
- **Settings dropdown** is a custom menu with no `role=menu`/`menuitem`, no arrow/Escape handling, and no
  focus moved into it on open (`+page.svelte:1415-1500`).

**Fix:** (a) one shared roving-tab `keydown` helper for both tablists; (b) a `focus-visible:ring-2
focus-visible:ring-ring` utility applied to every interactive element that lacks it — `NextStepDisplay`
already models the exact pattern to copy; (c) wire the settings dropdown as a proper menu.

### S4. Corner-radius drifts — "round most, leave one square"

**Rubric:** Geometry — consistent corner-radius language.

Five spots break the page's `rounded-lg` card / `rounded-md` inner-element language:

- Header desktop view-toggle is `rounded-md` while its sibling buttons are `rounded-lg` (`ProjectHeaderCard:96 vs 105,112`).
- Search input is `rounded-md` while its own dropdown and card are `rounded-lg` (`ProjectEntitySearchCombobox:359 vs 387,344`).
- Documents header icon flips `rounded-md sm:rounded-lg` at the breakpoint inside a `rounded-lg` section (`ProjectDocumentsSection:66`).
- Kanban skeleton card placeholders use bare `rounded` while the equivalent pulse skeleton uses `rounded-md` (`+page.svelte:1240-1241 vs 1112,1129`).
- Small inline chips in `NextStepDisplay` mix `rounded` and `rounded-md` (`:158,212,276`).

**Fix:** lock two radii — `rounded-lg` for cards/containers/dropdowns, `rounded-md` for inner
controls/chips/skeleton placeholders — and sweep these five to conform.

### S5. `prefers-reduced-motion` is gated at the page level but not in components

**Rubric:** Motion & A11y — respect reduced-motion.

The page's hydration fades correctly gate on `prefersReducedMotion` (`+page.svelte:1043`) — but
component-local motion does not: the `transition:slide` on EntityTabStrip panels (`:546`),
NextStepDisplay (`:252`), and MobileTaskBoard (`:407`), plus assorted `animate-spin` loaders and the
chevron `transition-transform`, all animate unconditionally.

**Fix:** a shared reduced-motion-aware slide/duration helper (zero-duration when reduced-motion), and
`motion-reduce:animate-none` on spinners. One utility, applied across the v2 components.

---

## Part 2 — Per-surface findings

Severity: **High** = breaks alignment/readability/behavior-legibility or blocks keyboard use ·
**Medium** = noticeable polish gap · **Low** = nitpick. Findings already rolled into S1–S5 are tagged
`→Sx` and not repeated in full.

### Surface 1 — Project Header

| Sev | Region               | Defect                                                                                                                                | Fix                                                  |
| --- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Med | Right action cluster | Two adjacent icon buttons at different icon sizes — toggle `w-4 h-4` vs menu `w-5 h-5` → 28px vs 32px boxes side by side (`:107,116`) | Normalize both to one size + matching square hit-box |
| Med | Right action cluster | Bordered text pill (`px-2 py-1`, ~22px) and bare icon button (~32px) share an `items-center` row at different heights                 | Give both a shared `h-8`                             |
| Med | Menu/toggle controls | No `focus-visible` ring (→S3)                                                                                                         | Copy `NextStepDisplay`'s ring pattern                |
| Med | View-toggle radius   | `rounded-md` vs siblings' `rounded-lg` (→S4)                                                                                          | `rounded-lg`                                         |
| Med | Next-step short text | `nextStepShort` has no `line-clamp` despite being a "one-line summary" — will wrap and push layout (`NextStepDisplay:232,244`)        | `line-clamp-2`                                       |
| Low | Inline chips         | Mixed `rounded`/`rounded-md` (→S4); slide + chevron motion ungated (→S5)                                                              | —                                                    |

**Strengths:** left group is alignment-safe (`min-w-0` + title `line-clamp-1 sm:line-clamp-2` + `shrink-0`
right cluster); description has a `title=` tooltip fallback; color is disciplined (single `text-accent`
for the "Suggested Next Move" marker); regenerate button reveals via opacity so it never shifts layout.

### Surface 2 — Pulse Strip

| Sev  | Region                             | Defect                                                                                                                                                 | Fix                                              |
| ---- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| High | Mobile tab switcher                | Roving `tabindex` with no arrow-key handler — inactive tab unreachable (→S3)                                                                           | Shared roving-tab keydown                        |
| Med  | Mobile tabs                        | "Recent" vs "Up next" use different active accents (→S2)                                                                                               | Unify active treatment                           |
| Med  | Desktop "Recent activity" meta row | Unbounded `actor` name + type/time/source with no clamp; long display name wraps in the narrow md column (`:545-557`)                                  | `line-clamp-1` on the meta `<p>`                 |
| Med  | Both lists                         | Hard-capped at 6 items (`slice(0,6)`) while up to 12 are fetched and the badge shows only the capped count — the cut-off is invisible (`:205,509,585`) | "View all (N)" footer row or true total in badge |
| Med  | Empty states                       | Mobile (`text-center italic`, different copy) ≠ desktop (left-aligned, different copy) (`:391,524`)                                                    | One shared empty-state snippet                   |
| Low  | Row icons                          | Four accent colors across entity types read as a "color salad" (`:272-288`)                                                                            | Mute row icons; reserve color for state          |
| Low  | Motion                             | `pressable`/pulse not locally reduced-motion-guarded (→S5)                                                                                             | Confirm global gate or add `motion-reduce:`      |

**Strengths:** every list title is `line-clamp-1`; mobile rows enforce `min-h-[44px]` thumb targets;
header icons sit in fixed `w-7 h-7` containers; solid ARIA tab wiring (`role=tab`/`aria-selected`/`aria-controls`).

### Surface 3 — Entity Tab Strip _(the highest-value surface)_

| Sev  | Region                 | Defect                                                                                                                                | Fix                                         |
| ---- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| High | Action vs inline pills | Identical markup for modal-opening vs inline-expanding pills (→S1)                                                                    | Persistent distinct affordances             |
| Med  | Active pill header     | Active state reads only from width; no bg/accent change (→S2)                                                                         | Tint active header + accent border          |
| Med  | Count semantics        | Events shows _upcoming_ count, others show _total_, Chats/Graph show none — three meanings in one identical slot (`:328,338,348-380`) | One consistent count meaning for all        |
| Med  | Count rendering        | Counts are loose `text-[10px]` inline text, not a fixed-width badge, so digit-count shifts the row (`:507-529`)                       | Wrap in `min-w-[1.25rem] text-center` badge |
| Med  | Pill padding           | `px-2 py-1.5` — 8px vs 6px asymmetry on the primary clickable surface (`:497,517`)                                                    | `px-2.5 py-1.5` or `p-2`                    |
| Med  | Inner panel rows       | No `focus-visible` ring, unlike the pill headers (→S3)                                                                                | Add ring                                    |
| Med  | Expand motion          | `transition:slide` ungated (→S5)                                                                                                      | Reduced-motion guard                        |
| Low  | Scroll panels          | `max-h-[60vh] overflow-y-auto` with no fade — clipped content not obvious (`:549+`)                                                   | Bottom mask/fade                            |
| Low  | Pill widths            | `flex-1` makes the final wrapped row's pills wider than full rows — ragged (`:490`)                                                   | `flex-none` + fixed basis                   |
| Low  | Chevron                | Conditionally rendered already-rotated, so its `transition-transform` never fires — dead motion (`:534-536`)                          | Render persistently, toggle rotation        |

**Strengths:** internal pill structure is genuinely alignment-safe (`min-w-0` + `truncate` + `shrink-0`
icon/count); `line-clamp` consistent across all panel content; clean wrap container; real `<button>`s with
`aria-expanded`/`aria-controls` (inline) and `aria-haspopup="dialog"` (modal) + `focus-visible:ring-inset`.

### Surface 4 — Task Kanban Board

| Sev | Region                      | Defect                                                                                                                                                | Fix                                              |
| --- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Med | Board scroll                | 7 fixed `300px` columns in `overflow-x-auto` with no edge-fade; macOS auto-hides the scrollbar, so "more columns" relies on a mid-column cut (`:747`) | Right-edge mask/gradient or always-visible track |
| Med | Cards + header buttons      | No `focus-visible` ring on draggable card / New-task / Load-archived (→S3)                                                                            | Add ring                                         |
| Med | Backlog vs Archived columns | Identical `text-muted-foreground` + `bg-muted/40` — the two terminal columns twin (`:86-95,144-152`)                                                  | Give Archived a distinct desaturated tone        |
| Low | Drop-target                 | `bg-foreground/[0.03]` (3%) is nearly invisible during the board's core interaction (`:592`)                                                          | Bump to ~6% + stronger ring                      |
| Low | Column hint                 | `hidden md:inline` drops per-column hints exactly where 7 columns are most cramped (`:617`)                                                           | Truncate or move to `title=`                     |
| Low | In-progress icon            | `Flame` (urgency glyph) on calm `text-info` blue — mixed signal (`:96-105`)                                                                           | Neutral "active" glyph                           |
| Low | Card metadata               | `flex-wrap` lets P1/due/assignee wrap to a ragged second row (`:700`)                                                                                 | `min-w-0`+truncate assignee chip                 |

**Strengths:** task title + description both `line-clamp-2`; empty states tailored per column type;
cards are semantic `<button>`s (keyboard-operable open/edit even without DnD); fixed-size icon chips
(`w-6 h-6` holding `w-3.5 h-3.5`); destructive red on Overdue spent only when the column is populated.

### Surface 5 — Mobile Task Board + Entity Search Combobox

| Sev  | Surface · Region    | Defect                                                                                                                                                                                     | Fix                                               |
| ---- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| High | Board · tablist     | Roving `tabindex`, no arrow/Home/End handler (→S3)                                                                                                                                         | Shared roving-tab keydown                         |
| Med  | Combobox · input    | `rounded-md` input vs `rounded-lg` dropdown/card (→S4)                                                                                                                                     | Match radii                                       |
| Med  | Combobox · input    | Right affordance jumps `right-3` (loader) → `right-2` (clear), and `left-3` vs `right-2` insets are asymmetric — the literal "search-bar spacing different on each side" tell (`:368,373`) | Pin loader+clear to one inset; match left/right   |
| Med  | Board · tabs        | Active Backlog/Archived nearly invisible (→S2)                                                                                                                                             | Active bg + `text-foreground`                     |
| Med  | Board · header      | Primary `+` Add-task parked top-right — hardest one-handed reach, no sticky/bottom create (`:382-389`)                                                                                     | Sticky bottom FAB or full-width bottom "Add task" |
| Low  | Board · edge fade   | Right fade is `from-card` over a `bg-muted/15` strip — fades to the wrong base, and never hides (`:459,411`)                                                                               | `from-muted/15`; toggle on scroll position        |
| Low  | Combobox · dropdown | `max-h-96` can sit behind the phone keyboard; no scroll fade (`:387`)                                                                                                                      | `max-h-[50vh]` + bottom fade                      |
| Low  | Board · text        | `italic` empty-state + archived-meta (named placeholder complaint) (`:502,560`)                                                                                                            | Drop `italic`; use color/size                     |
| Low  | Both · motion       | `slide` + spinners ungated (→S5)                                                                                                                                                           | Reduced-motion guard                              |

**Strengths:** combobox a11y is thorough (`role=combobox` + `aria-autocomplete/controls/expanded/activedescendant`

- full arrow/enter/escape + `role=listbox/option`); 44px touch targets on tabs and cards; overflow handled
  (result `truncate`, snippet + task title `line-clamp-2 break-words`); no fixed-bottom chrome / no orphan iOS gap.

### Surface 6 — Documents Section + Page Shell

| Sev  | Surface · Region          | Defect                                                                                                                           | Fix                                                   |
| ---- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| High | Shell · settings dropdown | No `role=menu`/`menuitem`, no arrow/Escape, no focus-in-on-open; full-screen close button sits in tab order (→S3) (`:1415-1500`) | Wire as a proper menu                                 |
| Med  | Shell · settings dropdown | "Open graph" duplicates the Graph pill's entry point (`:1455 vs 1197`)                                                           | Drop the menu row; keep the pill                      |
| Med  | Shell · Documents loading | No skeleton — gated `{#if !isHydrating}`, so it pops into empty space while siblings fade from matched skeletons (`:1259`)       | Render a `rounded-lg` / `DocTreeSkeleton` placeholder |
| Med  | Shell · kanban skeleton   | Inner placeholders use bare `rounded` vs pulse skeleton's `rounded-md` (→S4)                                                     | `rounded-md`                                          |
| Low  | Shell · search skeleton   | Box-in-box (`h-14` frame wrapping `h-10` bar) but the real control is a single input (`:1153`)                                   | Single `h-12 rounded-lg` bar                          |
| Low  | Docs · header icon        | `rounded-md sm:rounded-lg` flip (→S4)                                                                                            | One radius                                            |
| Low  | Docs · toggle             | Header button and chevron are two focusable controls firing the same toggle (`:62,89`)                                           | Chevron as visual affordance inside the one button    |
| Low  | Shell · menu grouping     | Only one divider (before Delete); "Open graph" (a view action) lumped with config actions (`:1488`)                              | Divide view vs settings if it stays                   |
| Low  | Docs · tree scroll        | Tree grows unbounded, relies on page scroll, no in-panel affordance                                                              | Optional `max-h`+`overflow-y-auto` past N rows        |

**Strengths:** document titles `truncate` with `flex-shrink-0` siblings; outer-card radius language
consistent (`rounded-lg shadow-ink tx tx-frame tx-weak` everywhere); settings icons uniform (`gap-3` +
`w-4 h-4`), restrained destructive row with divider; page-level fades correctly gated on reduced-motion;
documents header demotes count to muted subtext (hierarchy by size/weight, not extra chrome).

---

## Part 3 — Recommended fix sequence (Hyperplexed order: one feature at a time)

Do them in this order — each is a single convention that clears many table rows at once.

1. **S1 — distinguish modal vs inline pills.** Highest taste payoff, ~1 component. The page's most
   Hyperplexed-redesignable defect.
2. **S3 — keyboard sweep.** One roving-tab keydown helper (both tablists) + a `focus-visible` ring utility
   applied everywhere it's missing + wire the settings menu. Knocks out three High findings.
3. **S2 — unify active state.** One active treatment, applied to every tab/pill. Clears the inconsistent-accent rows.
4. **S4 — lock two radii** and sweep the five offenders.
5. **S5 — one reduced-motion-aware motion helper** across the v2 components.
6. **Cleanups:** Documents skeleton + skeleton-shape matches (Surface 6), Pulse "View all" + meta clamp,
   kanban horizontal-scroll fade, search-bar inset symmetry, mobile Add-task thumb reach.

---

## Part 4 — What this validates about the playbook

The rubric **worked as an audit instrument**. Three concrete signs:

- It surfaced the single highest-value finding (S1, the co-located-behaviors pill defect) directly from
  the §1 "don't co-locate items with different behavior" line — that's his signature redesign move, found
  in our own UI.
- The §2 accessibility-forward items (keyboard operability, reduced-motion) caught the most _systemic_
  cluster (S3/S5) — exactly the "next level" bar from the 2026 bubbles video, and the bar BuildOS most
  often misses.
- The "even padding / search bar spacing different on each side" line caught a real, specific instance
  (combobox insets) — his literal example, reproduced here.

**Limitation confirmed:** the rubric is excellent at _structural_ taste (alignment, overflow, symmetry,
radius, motion, a11y) from markup alone, but the color/contrast calls (S2 dark-mode legibility, the icon
"color salad," drop-target visibility) are flagged as _suspected_ and want a live screenshot pass to
confirm. That's the natural next step — and the first surface to shoot is the Entity Tab Strip, post-S1.

---

## Part 5 — Fixes applied (2026-06-26)

First polish pass shipped. New shared helper `lib/components/project/v2/board-a11y.ts`
(`handleRovingTabKeydown` + reduced-motion-aware `slideMotion`) backs S3/S5 as single conventions.
`svelte-check` clean (0/0); ESLint clean (only two pre-existing unused-var warnings, untouched).

**Systemic (Part 1) — all five done:**

- **S1** ✅ EntityTabStrip pills now read at rest: action pills carry a persistent top-right `↗`
  (`ArrowUpRight`), inline pills a persistent `ChevronDown` that rotates on expand. Counts moved to a
  fixed-width (`min-w-[1.1rem]`, `tabular-nums`) slot; pill padding evened to `px-2.5 py-1.5`.
- **S2** ✅ One active treatment: expanded EntityTab pill gets `border-accent/50 ring-1 ring-accent/20`
  - tinted header; both PulseStrip mobile tabs use an accent underline + foreground text (warning no
    longer doubles as "selected"); MobileTaskBoard active tab is `text-foreground` + tinted bg + a
    bucket-colored bar (`activeBar()`), so Backlog/Archived are no longer invisible when selected.
- **S3** ✅ Shared roving-tab keydown on both tablists (PulseStrip, MobileTaskBoard); `focus-visible`
  rings added to header buttons, kanban cards + New-task/Load-archived, mobile cards, and every
  expanded-panel row in EntityTabStrip; settings dropdown rewired as a real `role="menu"` (menuitems,
  arrow/Home/End/Escape, focus-in on open, focus restored to trigger on close, backdrop pulled out of
  the tab order).
- **S4** ✅ Two radii locked. Swept: header view-toggle, search input, Documents/Mobile/Kanban header
  icon chips (`rounded-md sm:rounded-lg` flip → `rounded-lg`), kanban skeleton card, NextStepDisplay
  chips/empty button.
- **S5** ✅ `slideMotion()` gates the four `transition:slide` panels; `motion-reduce:animate-none` on
  every spinner; `motion-reduce:transition-none` on the rotating chevrons.

**Cleanups (Part 2):** Documents loading skeleton added; search skeleton shape matched to the real
control; PulseStrip desktop meta row clamped (`line-clamp-1`); kanban right-edge scroll fade + stronger
drop-target (`bg-foreground/[0.06]` + ring); combobox loader/clear insets pinned + clear button properly
centered; header action cluster normalized to a shared `h-8`/`w-8` box at one icon size.

**Deferred (lower-value or needs live screenshots):** Pulse "View all (N)" footer / true-total badge
(needs count semantics), mobile sticky Add-task FAB (ergonomics change, not a taste defect), Pulse row
icon "color salad" + Kanban Backlog/Archived tone twin + in-progress `Flame` glyph (suspected color
calls — confirm on the live screenshot pass), EntityTab scroll-panel bottom fade, doc-tree `max-h`, and
the assorted Low nitpicks. Next step remains the live dark-mode screenshot pass on the Entity Tab Strip.
