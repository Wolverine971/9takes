<!-- .codex/skills/hyperplexed-audit/references/audit-examples/HISTORY_PAGE_AUDIT_2026-06-26.md -->

# History Page — Hyperplexed Design Audit

> Second live application of the [Hyperplexed Design Playbook](./HYPERPLEXED_DESIGN_PLAYBOOK.md),
> following the [Project Page audit](./PROJECT_PAGE_AUDIT_2026-06-26.md).
> Surface: **History** — `apps/web/src/routes/history/+page.svelte` and its skeleton child
> `lib/components/history/HistoryListSkeleton.svelte`.
> Method: audited Hyperplexed-style — **one surface at a time, region by region** — grading the
> rendered markup against the §1/§2 rubric. Captured 2026-06-26.
>
> **Scope caveat:** static _markup_ audit (reading the DOM each region produces and its
> Tailwind/Inkprint classes), not a screenshot audit. High confidence on structure (alignment, padding
> symmetry, overflow, radius/motion consistency, skeleton↔content parity, keyboard a11y); the
> color/contrast calls (stat "color salad," dark-mode badge legibility) are flagged _suspected_ and want a
> live screenshot pass to confirm.
>
> **Cross-reference:** stack with `DESIGN_AUDIT_2026-06-12.md`, `MOBILE_EXPERIENCE_AUDIT_2026-06-12.md`,
> and the Project Page audit — several findings here are the _same systemic patterns_ (S2 accent drift,
> S3 focus rings, S5 ungated motion) already named there.

---

## Surfaces audited

| #   | Surface                                          | File / region                                 |
| --- | ------------------------------------------------ | --------------------------------------------- |
| 1   | Page header (micro-label, title, inline loader)  | `+page.svelte:427-443`                        |
| 2   | Stats cards (Total · Captures · Chats · Done)    | `+page.svelte:448-487`                        |
| 3   | Type filter tabs (All · Captures · Chats)        | `+page.svelte:490-540`                        |
| 4   | Search + filters row (search, status, Go, clear) | `+page.svelte:543-586`                        |
| 5   | History card grid + skeleton                     | `+page.svelte:627-752`, `HistoryListSkeleton` |
| 6   | Empty / error / load-more / results states       | `+page.svelte:589-624, 754-769`               |

---

## The headline: solid bones, one broken promise

This page does the hard Hyperplexed things well. **Overflow is genuinely handled** — every title is
`line-clamp-2`, every preview clamped, dates `truncate`, topic chips `truncate max-w-[60px]` with a
`+N` overflow counter, icons `flex-shrink-0`. The streamed-skeleton architecture (exact `itemCount`
rendered immediately) is exactly the "zero layout shift" instinct Hyperplexed prizes. Empty and error
states are fully built (icon + heading + copy + action) — his "polish = the unglamorous states" bar.
Card keyboard semantics exist (`role="button"` + Enter/Space handler).

But the page makes **one explicit promise it then breaks**: the skeleton is documented to "match exact
dimensions" for "zero layout shift," and on mobile it does not (S-skel below). That's the single
highest-value fix, because it undermines the page's headline feature.

The rest is **polish** — the same shallow, systemic patterns the Project Page audit named (accent drift,
missing focus rings, ungated motion), plus a couple of history-specific tells (redundant responsive span,
two filter controls with two different submit behaviors).

---

## Part 1 — Systemic patterns (fix as rules, not one-offs)

### S-skel. ⛔ Skeleton breaks its own zero-layout-shift contract _(Highest leverage)_

**Rubric:** Overflow & responsiveness — _"make scrollability/layout obvious… it seems silly to leave it
up to chance"_ + the playbook's own skeleton-parity standard from the Project Page audit.

The skeleton's header comment claims it "matches exact dimensions and structure of real history cards to
prevent layout shift." Two concrete mismatches make that false:

- **Mobile preview block.** The skeleton _hides_ the preview on mobile (`hidden sm:block`,
  `HistoryListSkeleton:43`, commented "hidden on mobile for density"). The real card _shows_ a one-line
  preview on mobile (`line-clamp-1`, `+page.svelte:706-707`, commented "don't hide: this is the card's
  most informative field"). The two files made opposite calls → every card grows by one text line the
  instant data resolves. Guaranteed mobile layout shift, on the page whose whole reason for the skeleton
  is to prevent it.
- **Corner radius.** Skeleton card is `rounded-md sm:rounded-lg` (`HistoryListSkeleton:24`); the real
  card is `rounded-lg` at every breakpoint (`+page.svelte:640`). On mobile the placeholder is a tighter
  radius than the thing it stands in for — the same `rounded-md sm:rounded-lg` flip the Project Page
  audit swept under S4.

**Fix:** make the skeleton render the mobile preview line (single `h-3` bar) and use `rounded-lg` flat.
Treat the real card markup as the source of truth and diff against it — these two files must move
together or the contract is a lie.

### S2. Active-state accent drifts across the tab row

**Rubric:** Color — _one restrained accent_; Readability — active state must be obvious _and consistent_.
(Same defect class as Project Page S2.)

The three type-filter tabs each underline the active state with a **different color**: All →
`bg-accent` (`:500`), Captures → `bg-info` (`:519`), Chats → `bg-accent` (`:537`). So "which tab is
selected" is signaled in two different hues depending on _which_ tab it is. Color is doing
identity-coding ("captures are blue") and selection-coding ("this is active") at once, and the collision
makes neither read cleanly. The stat cards repeat the same four-hue split (see Surface 2).

**Fix:** one active-underline color for all three tabs (the page's `accent`). If you want the
type→color association, keep it on the count badge only, never on the selection indicator.

### S3. `pressable` is doing focus's job — rings missing on every button

**Rubric:** Motion & A11y — _"operate this entire flow via my keyboard."_ (Identical to Project Page S3.)

The two `<input>`/`<select>` controls have proper `focus:ring-2 focus:ring-accent/20` (`:553, :563`) —
good. Everything that is a `<button>` or `role="button"` relies on `pressable` (a press-scale token, not
a focus token) and ships **no `focus-visible` ring**: the three type tabs (`:493,505,524`), Go / clear
(`:572,580`), each history card (`:634`), the Summarize button (`:660`), and Load more (`:757`). A
keyboard user tabbing the grid gets no visible focus target, even though the card already has a rich
`hover:border-accent/50 hover:shadow-ink-strong` it could mirror.

There is also a **nested-interactive a11y bug**: the Summarize `<button>` (`:660`) lives _inside_ the
card's `role="button"` (`:635`). A focusable control inside a `role="button"` is invalid — it breaks the
accessibility tree and tab semantics even though `stopPropagation` makes the _click_ behave.

**Fix:** (a) a shared `focus-visible:ring-2 focus-visible:ring-ring` utility on every button/card; on the
card mirror the hover treatment (`focus-visible:border-accent/50`). (b) Restructure the card so the
Summarize action isn't a descendant of a `role="button"` — make the card a non-button container with an
explicit "Open" affordance, or move Summarize out of the clickable region.

### S5. Loaders/skeletons animate through `prefers-reduced-motion`

**Rubric:** Motion & A11y — respect reduced-motion. (Same as Project Page S5.)

Nothing on this page gates motion. The header spinner (`animate-spin`, `:437`), the per-row "processing"
status spinner (`getStatusColor` returns `animate-spin`, `:206`), and the skeleton's custom
`@keyframes pulse` (defined in `<style>`, `:73-85`, plus every card's staggered `animation-delay`) all
run unconditionally.

**Fix:** `motion-reduce:animate-none` on both spinners; gate the skeleton pulse + stagger behind
`@media (prefers-reduced-motion: reduce)` (drop to static 0.6 opacity, no delay).

### S-apply. Two filter controls, two submit behaviors (same look, different behavior)

**Rubric:** Hierarchy & grouping — _"don't co-locate items with different behavior."_ (The Project Page
S1 defect, in filter-control form.)

In one filter row the **status `<select>` auto-applies** on change (`onchange={applyFilters}`, `:562`)
while the **search `<input>` does not** — it requires Enter or a click on the separate "Go" button
(`:552, :572`). Two adjacent filter controls that look like one cluster behave on two different submit
models, and the standalone "Go" button exists only to paper over the input half. A user who edits search
and then changes status will silently submit the search too (the select fires `applyFilters`, which reads
the current `searchInput`) — surprising coupling.

**Fix:** pick one model. Either debounce the search to auto-apply (matching the select) and delete the
"Go" button, or make both require explicit submit. One submit behavior for the whole row.

---

## Part 2 — Per-surface findings

Severity: **High** = breaks layout/readability/behavior-legibility or blocks keyboard use ·
**Med** = noticeable polish gap · **Low** = nitpick. Findings rolled into Part 1 are tagged `→Sx`.

### Surface 1 — Page header

| Sev | Region            | Defect                                                                                                   | Fix                          |
| --- | ----------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------- |
| Low | Header `<header>` | `flex-1` on a `flex-col` whose parent (`space-y` block, not flex) gives it nothing to grow into (`:430`) | Drop the dead `flex-1`       |
| Low | Inline loader     | `animate-spin` ungated (→S5)                                                                             | `motion-reduce:animate-none` |

**Strengths:** clean micro-label → title → subtitle hierarchy (size/weight, no extra chrome); inline
loader sits beside the title so "still loading" reads without a layout block; subtitle `hidden sm:block`
reclaims mobile height honestly.

### Surface 2 — Stats cards

| Sev | Region         | Defect                                                                                                                                                                                                            | Fix                                                                                               |
| --- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Med | Card structure | Total & Done render the number bare; Captures & Chats wrap it in a `flex` row with an icon (`:460,471`). The number's vertical position differs between iconned/un-iconned cards → numbers don't share a baseline | Give all four the same number-row structure (icon slot present-but-empty, or no icon on any)      |
| Med | Number color   | Four stat numbers in four hues — foreground / info / accent / success (`:452,462,473,482`). Reads as a "color salad" (suspected — confirm live)                                                                   | Mute to `text-foreground`; let the label carry meaning, or keep color only where it maps to a tab |
| Low | Grid density   | `grid-cols-4` at all widths + `text-[9px]` labels — four cards on a phone is dense (intentional per comment, noting for the live pass)                                                                            | Confirm legibility on real device                                                                 |
| Low | Affordance     | Stat cards look like the clickable history cards (`rounded-lg border bg-card shadow-ink`) but aren't interactive — no filter-on-click                                                                             | Either make them filter shortcuts or visually demote so they don't read as buttons                |

**Strengths:** uniform card shell (`rounded-lg border-border bg-card shadow-ink tx tx-frame tx-weak`);
labels demoted by size/weight (hierarchy by type, not chrome); icons live in the card, hidden on mobile
to protect density.

### Surface 3 — Type filter tabs

| Sev | Region           | Defect                                                                                                                                                                 | Fix                                                                                  |
| --- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Med | Active underline | Per-tab accent color (accent vs info) for the _same_ "is selected" signal (→S2)                                                                                        | One underline color for all tabs                                                     |
| Med | "Captures" label | Two responsive spans with **identical text** — `hidden sm:inline`>Captures< and `sm:hidden`>Captures< (`:511-512`). Dead duplicate (Chats uses one plain span, `:530`) | Collapse to one `<span>Captures</span>`                                              |
| Med | Tab semantics    | Styled as tabs (underline row) but are bare `<button>`s — no `role`, no `aria-pressed`/`aria-selected`; active state invisible to AT (`:491,503,522`)                  | Add `aria-pressed={typeFilter===…}` (filter-button semantics) or full tablist wiring |
| Low | Count badges     | Captures/Chats carry a count badge; "All" carries none — inconsistent slot across the three peers (`:513,531`)                                                         | Show a total count on "All" too, or drop all three                                   |
| Low | Buttons          | No `focus-visible` ring (→S3)                                                                                                                                          | Shared ring utility                                                                  |

**Strengths:** active underline pattern is the right idiom (no width-jump, unlike Project Page tabs);
`whitespace-nowrap` + `overflow-x-auto` keeps the row from wrapping; count badges color-keyed to type.

### Surface 4 — Search + filters

| Sev | Region       | Defect                                                                                                                                                             | Fix                                                 |
| --- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| Med | Submit model | `<select>` auto-applies, search needs Enter/Go — two behaviors in one cluster; changing status silently submits search too (→S-apply)                              | One submit model; likely debounce search, drop "Go" |
| Med | "Go" button  | Exists only to submit the input half the select doesn't need — a redundant path (Hyperplexed "merge duplicate paths")                                              | Remove once search auto-applies                     |
| Low | Clear button | Sizing diverges from siblings: `p-1.5 sm:px-3 sm:py-2` (icon-square) vs Go's `px-3 sm:px-4 py-1.5 sm:py-2` — slightly shorter box in the same row (`:580 vs :572`) | Give the row a shared `h-9`/`h-10`                  |
| Low | Two "All"s   | Status `<select>` default "All" sits feet from the "All" _type tab_ — two unrelated "All" controls in view (`:565 vs :498`)                                        | Rename select default to "Any status"               |
| Low | Buttons      | Go / clear lack `focus-visible` ring (→S3)                                                                                                                         | Shared ring utility                                 |

**Strengths:** both true form controls have real focus rings (the rest of the page should copy this);
search icon inset is intentional, not the asymmetric-padding tell; clear button conditionally rendered
only when a filter is active (no dead control).

### Surface 5 — History card grid + skeleton

| Sev  | Region             | Defect                                                                                                                | Fix                                            |
| ---- | ------------------ | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| High | Skeleton parity    | Mobile preview hidden in skeleton but shown in card; radius `rounded-md sm:rounded-lg` vs card `rounded-lg` (→S-skel) | Match skeleton to real card markup             |
| High | Nested interactive | Summarize `<button>` nested inside the card's `role="button"` (→S3)                                                   | Lift Summarize out of the button region        |
| Med  | Card focus         | Rich hover (`border-accent/50` + `shadow-ink-strong`) with no `focus-visible` equivalent (→S3)                        | Mirror hover on `focus-visible`                |
| Low  | Summarize radius   | `rounded-md` button sitting among `rounded-full` badges in the card header (`:668 vs :649,681`)                       | `rounded-full` to match the badge row          |
| Low  | Chevron affordance | `ChevronRight` recolors on `group-hover` but not `group-focus-within` (`:745-746`)                                    | Add `group-focus-within:text-accent`           |
| Low  | Empty-state copy   | Braindumps empty copy says "captured any notes" while the UI labels them "Captures" (`:615`)                          | Use the product noun ("Captures") consistently |

**Strengths:** overflow is exemplary — title `line-clamp-2`, preview clamped, topics `slice(0,2)` + `+N`,
date `truncate`, every icon `flex-shrink-0`; cards are keyboard-openable (`role="button"` + Enter/Space,
`aria-busy` during open); the "show preview on mobile" call is the _right_ content decision (the skeleton
just needs to follow it); status conveyed by icon+color when the text label is hidden on mobile.

### Surface 6 — Empty / error / load-more / results

| Sev | Region        | Defect                                                                                                                  | Fix                           |
| --- | ------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Low | Load more     | No `focus-visible` ring (→S3); no in-flight/loading state — click triggers a full `goto` + fresh skeletons (`:757`)     | Ring + optional pending state |
| Low | Outer wrapper | `min-h-screen bg-background rounded-md` — a corner radius on a full-bleed, full-height background does nothing (`:427`) | Drop the stray `rounded-md`   |

**Strengths:** error and empty states are fully realized (icon + heading + copy + retry/guidance), with
type-aware empty copy; "Showing X of Y" gives honest pagination context; states are cleanly mutually
exclusive (`showSkeletons` → error → empty → grid).

---

## Part 3 — Recommended fix sequence (Hyperplexed order: one feature at a time)

1. **S-skel — make the skeleton match the real card** (mobile preview line + `rounded-lg`). Highest
   value: it repairs the page's own headline promise, ~1 small file. Diff the skeleton against the card
   markup so they can't drift again.
2. **S3 — keyboard sweep.** One `focus-visible` ring utility on every button/card + mirror the card hover
   on focus, _and_ lift the Summarize button out of the `role="button"` card. Knocks out both High a11y
   findings and several Med/Low rows.
3. **S2 — unify the active accent.** One underline color across the three tabs; push type-color onto the
   count badge only. Sweep the stat-number "color salad" in the same pass.
4. **S-apply — one filter submit model.** Debounce search to match the auto-applying select, delete the
   redundant "Go" button.
5. **S5 — reduced-motion guard.** `motion-reduce:animate-none` on both spinners + gate the skeleton pulse.
6. **Cleanups:** collapse the duplicate "Captures" span, normalize the stat-card number structure, give
   the search-row controls a shared height, drop the dead `flex-1` and stray outer `rounded-md`, fix
   empty-state copy noun.

---

## Part 4 — What this confirms about the playbook (and the Project Page audit)

- **The systemic patterns travel.** S2 (accent drift), S3 (focus rings, `pressable`≠focus), and S5
  (ungated motion) are the _same three_ named on the Project Page — strong evidence they're
  page-agnostic conventions worth fixing as global utilities, not per-surface patches. A shared
  `focus-visible` ring class and the `slideMotion`/reduced-motion helper from
  `lib/components/project/v2/board-a11y.ts` should be promoted and reused here.
- **The skeleton-parity lens is the standout history-specific find.** The Project Page audit only caught
  skeleton _radius_ drift; here the same lens caught a full _content_ mismatch (mobile preview) that
  defeats the page's reason for existing. Skeleton↔card parity deserves its own line in the rubric.
- **Limitation, again:** the color calls (stat "color salad," dark-mode badge contrast across seven
  status hues in `getStatusBadgeClass`) are _suspected_ from markup and want the live screenshot pass —
  the natural next step, ideally shooting mobile first to capture the S-skel shift on a real device.

---

## Part 5 — Fixes applied (2026-06-26)

First polish pass shipped across `history/+page.svelte` and `HistoryListSkeleton.svelte`. ESLint clean
(0 errors; one pre-existing `getBraindumpChatSessionId` unused-var warning, untouched). `svelte-check`
could not be run to completion in this environment (a native esbuild `SIGABRT` during the project-wide
scan, unrelated to these files); structural validity confirmed via the ESLint Svelte parser + a clean
Prettier reformat (both reject unbalanced markup).

**Systemic (Part 1) — all five done:**

- **S-skel** ✅ Skeleton now matches the real card: mobile preview line rendered (1 bar mobile / 3
  desktop, margins `mb-1.5 sm:mb-3`), card radius flattened to `rounded-lg`. The mobile layout shift the
  page's headline feature was meant to prevent is gone.
- **S2** ✅ One active-underline color (`accent`) across all three type tabs (Captures was `info`); the
  four stat "big numbers" muted to `text-foreground` with type-color kept only on the Captures/Chats
  icons.
- **S3** ✅ Cards restructured to the stretched-`<button>` pattern: the whole card is now a real button
  (native Enter/Space + `focus-visible` ring) and the Summarize action is a sibling (z-raised,
  `pointer-events-auto`) rather than a button nested inside a `role="button"`. `focus-visible` rings +
  `aria-pressed` added to the type tabs; rings added to clear / Load more / Retry / Summarize; chevron
  now reacts to `group-focus-within`. Removed the now-dead `handleItemKeydown`.
- **S4** ✅ Folded into S-skel (skeleton `rounded-lg`) + the stray outer `rounded-md` dropped; Summarize
  chip moved to `rounded-full` to match the badge row.
- **S5** ✅ `motion-reduce:animate-none` on the header + per-row processing spinners; skeleton pulse +
  stagger gated behind a `prefers-reduced-motion` media query.
- **S-apply** ✅ Search now auto-applies via a 400ms debounce (Enter still applies immediately), matching
  the auto-applying status `<select>`; the redundant "Go" button removed.

**Cleanups (Part 2):** duplicate "Captures" responsive span collapsed to one; stat cards normalized to a
shared number-row structure; search-row clear button given matching height + `aria-label`; select default
renamed "All" → "Any status"; dead header `flex-1` removed; empty-state copy noun aligned ("captured
anything").

**Deferred (lower-value / needs live screenshots):** stat-card density at `grid-cols-4` on phones and the
"make stat cards clickable filter shortcuts" call (ergonomics/scope, not a taste defect); dark-mode
contrast of the seven `getStatusBadgeClass` hues (suspected color call). Next step is the live dark-mode

- mobile screenshot pass — shoot mobile first to confirm the S-skel shift is gone on a real device.
