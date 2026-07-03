<!-- .claude/skills/hyperplexed-audit/references/audit-examples/DASHBOARD_AUDIT_2026-06-26.md -->

# Home Dashboard — Hyperplexed Design Audit

> Second live application of the [Hyperplexed Design Playbook](./HYPERPLEXED_DESIGN_PLAYBOOK.md),
> stacked on the method proven in the [Project Page Audit](./PROJECT_PAGE_AUDIT_2026-06-26.md).
> Surface: **the authenticated home dashboard** — what a logged-in user sees at `/`.
> Entry: `apps/web/src/routes/+page.svelte:141` renders `AnalyticsDashboard.svelte` for authed users.
> Method: audited Hyperplexed-style — **one surface at a time, region by region** — grading the rendered
> markup against the §1/§2 rubric. Captured 2026-06-26.
>
> **Scope caveat:** like the project-page pass, this is a _static markup_ audit (reading the DOM each
> component produces and its Tailwind/Inkprint classes), not a screenshot audit. It catches structural
> taste defects (alignment, padding/height symmetry, radius/weight consistency, overflow, keyboard a11y,
> reduced-motion) with high confidence. The color/contrast calls (the "color salad," warning-means-two-things)
> are flagged as _suspected_ and want a live dark-mode screenshot pass to confirm.
>
> **Cross-reference:** stack with `PROJECT_PAGE_AUDIT_2026-06-26.md` — several findings here are the _same
> five systemic patterns_ wearing new costumes, so the fixes should reuse the project page's shared helpers
> (`board-a11y.ts`'s `focus-visible` ring + reduced-motion `slideMotion`) rather than inventing new ones.
> Also stack with `DESIGN_AUDIT_2026-06-12.md` and `MOBILE_EXPERIENCE_AUDIT_2026-06-12.md`.

---

## Surfaces audited

| #   | Surface                                                          | File / region                                                           |
| --- | ---------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1   | Header (greeting + New Project / Calendar / Refresh cluster)     | `AnalyticsDashboard.svelte:740-791`                                     |
| 2   | Daily Brief widget (5 states)                                    | `DashboardBriefWidget.svelte`                                           |
| 3   | Attention banner cluster (Inbox · Agent CTA · Invites · Overdue) | `AnalyticsDashboard.svelte:798-1045`                                    |
| 4   | Active Projects + Shared-with-me grid + overdue pill             | `AnalyticsDashboard.svelte:1047-1248`, `ProjectOverdueIndicator.svelte` |
| 5   | Recent Activity feed + Recent Chats                              | `AnalyticsDashboard.svelte:1250-1406`                                   |
| 6   | Compact stats footer + page shell                                | `AnalyticsDashboard.svelte:735-738,1408-1421`                           |

> Modals (`DailyBriefModal`, `BriefChatModal`, `OverdueTaskTriageModal`, `DashboardInboxModal`) are lazy-loaded
> secondary surfaces and are **out of scope** for this first dashboard pass — they deserve their own audit.

---

## The headline: a clean, restrained layout being quietly undermined by copy-paste

The dashboard's bones are good in exactly the ways the project page's were: titles `truncate`, icons sit in
fixed-size `shrink-0` chips, the list/empty-state patterns are consistent, the new-user empty state is genuinely
nice (`:1063`), and overflow is handled almost everywhere. The header action buttons go through the shared
`Button` component, which **already ships `focus:ring-2 focus:ring-ring`** (`Button.svelte:63+`) — so the header
is a11y-clean for free.

But this surface has a different signature defect than the project page. The project page's problem was _co-located
behaviors_; the dashboard's problem is **copy-paste drift**. The same card — an icon chip + title + subtext on the
left, an action on the right — is hand-rolled **four times** in the attention cluster, and the four copies have
_already drifted_ apart (different containers, different CTA element, one CTA a full `4px` taller than its siblings,
two different accent systems). Meanwhile the Inkprint `wt-*` weight system — which exists precisely to standardize
border/shadow/radius — is being **overridden by redundant Tailwind utilities** stacked on top of it.

So this is a **consolidation** audit. The single highest-value move is to collapse the four banners into one
component; most of Part 2 clears itself once the page stops maintaining the same card in four places.

---

## Part 1 — The five systemic patterns

### D1. ⛔ Four near-duplicate "attention banner" cards that have already drifted _(Highest leverage)_

**Rubric:** Declutter via consolidation ("merge duplicate paths") + "same look, slightly different = looks broken."

The AI Inbox (`:798-847`), Agent-connection CTA (`:849-878`), Project-invites header (`:880-903`), and
Overdue-tasks (`:983-1020`) banners are the **same structure** — `<section>` → row of {icon-chip + title +
muted subtext} on the left, {action} on the right — written out four times. They have drifted on every axis:

| Axis          | AI Inbox                                 | Agent CTA                                       | Invites                                         | Overdue                                  |
| ------------- | ---------------------------------------- | ----------------------------------------------- | ----------------------------------------------- | ---------------------------------------- |
| Container     | `border border-border bg-card … wt-card` | `border border-accent/25 bg-accent/5 … wt-card` | `border border-accent/25 bg-accent/5 … wt-card` | `border border-border bg-card … wt-card` |
| Icon tone     | `warning`                                | `accent`                                        | `accent`                                        | `warning`                                |
| CTA element   | `<button>`                               | `<a>`                                           | `<a>`                                           | `<button>`                               |
| CTA padding   | `px-2.5 py-1`                            | `px-2.5 **py-2**`                               | `px-2.5 py-1`                                   | `px-2.5 py-1`                            |
| CTA accent    | warning                                  | accent                                          | accent                                          | warning                                  |
| focus-visible | ✗                                        | ✗                                               | ✗                                               | ✓ (the only one)                         |

The `py-2` on the Agent CTA (`:871`) vs `py-1` everywhere else is the literal tell Hyperplexed names — one
control a few pixels taller than its identical-looking neighbors. The lone `focus:ring` on Overdue (`:1010`) is
another: a fix applied to one copy and not propagated to the other three.

**Fix:** extract one `<AttentionBanner>` component (or a single Svelte snippet) taking `{ icon, tone, title,
subtext, action }`. Tone drives container + chip + CTA color from _one_ map. This deletes ~120 lines, guarantees
the four can never drift again, and gives you one place to add the focus ring and fix the padding. This is the
dashboard's equivalent of the project page's S1.

### D2. The Inkprint weight system is overridden by redundant Tailwind utilities + radius drifts

**Rubric:** Geometry — consistent corner-radius language; `box-sizing`/utility hygiene.

`wt-ghost`/`wt-paper`/`wt-card` each already declare their own **border** (1px / 1px / 1.5px), **shadow**, and a
**`border-radius: 0.75rem`** (`inkprint.css:567-591`). The dashboard then re-adds Tailwind border/shadow _on top_:

- Every banner is `border border-border … shadow-ink wt-card` (`:799,850,882,984`). The Tailwind `border` (1px)
  and `shadow-ink` are redundant with — and likely **defeat** — `wt-card`'s intended `1.5px` elevated border +
  `shadow-ink-strong`. (Equal-specificity single-class selectors; whichever loads last wins — fragile by design.)
- Project cards are `wt-paper border border-border` (`:1114,1204`) — here the redundant `border border-border`
  merely _matches_ wt-paper, so it's harmless but still noise.

Then the **radius language splits**: `wt-*` containers are `rounded-xl` (0.75rem / 12px), but everything _inside_
them rounds to `rounded-lg` (0.5rem / 8px):

- List rows use `first:rounded-t-lg last:rounded-b-lg` (`:1269,1366`) inside a `wt-paper` (0.75rem) container — the
  row's 8px corner sits inside the container's 12px corner, so the corners don't nest flush.
- Invite inner cards are `rounded-lg` (`:915`) inside the `wt-card` (0.75rem) banner.
- The brief widget flips radius _at the breakpoint_: icon chips are `rounded-md sm:rounded-lg`
  (`DashboardBriefWidget.svelte:227,240,263,284,341`) — the exact `rounded-md sm:rounded-lg` flip flagged as S4
  on the project page, present again here.

**Fix:** (a) drop the redundant `border border-border shadow-ink` from `wt-card` banners — let the weight own it;
(b) lock the nesting rule: `wt-*` container (`rounded-xl`) → inner rows/cards `rounded-lg` is _fine as a deliberate
step-down_ **only if** the rows sit inside padding; where rows are flush to the container edge (the two divided
lists), match the row corners to the container (`first:rounded-t-xl last:rounded-b-xl`) or add container padding so
they don't touch; (c) kill the brief widget's breakpoint radius-flip → one radius.

### D3. focus-visible is applied to exactly one hand-rolled control on the whole page

**Rubric:** Motion & A11y — full keyboard operability is "next level, not optional."

The shared `Button` (header) is fine. Every _other_ interactive element is hand-rolled and — except the Overdue
button (`:1010`) — relies on `pressable`, which (per the project audit) **is not a focus token**:

- Banner CTAs: AI Inbox (`:829`), Agent CTA anchor (`:869`), Invites "Review all" (`:896`), and the Accept/Decline
  buttons (`:952,964`) — no `focus-visible` ring.
- Brief widget: the brief-available button (`:278`), the generate-CTA button (`:335`), and the error Retry
  (`:269`) — no ring.
- Project cards (anchors, `:1111,1201`), activity-feed rows (`:1267`), and recent-chat rows (`:1364`) — no ring.

A keyboard user tabbing the dashboard gets a visible focus state on the three header buttons and the single Overdue
button, and **invisible focus everywhere else** — including the primary content (project cards, feed rows).

**Fix:** reuse the project page's pattern — a `focus-visible:ring-2 focus-visible:ring-ring` utility applied to
every hand-rolled button/anchor/card here. Folding D1 (one banner component) knocks out the four banner rows in one
edit; the project-card and list-row rings are two more.

### D4. No reduced-motion gating anywhere on the dashboard

**Rubric:** Motion & A11y — respect `prefers-reduced-motion`.

The project page at least gated its hydration fades on `prefersReducedMotion`. **The dashboard has no gate at all.**
Unconditional motion includes: every `animate-spin` loader (`:768,785,836,1013`; `DashboardBriefWidget:242`), the
skeleton `animate-pulse` (`DashboardBriefWidget:224`), the `ProjectOverdueIndicator`'s `160ms` width-expand on hover
(`ProjectOverdueIndicator.svelte:47-50,87-91`), and the page-wide `transition-colors`/`-opacity`/`transition-all`
hover reveals (the arrow `opacity-0 group-hover:opacity-100` on every card/row).

**Fix:** `motion-reduce:animate-none` on every spinner and the skeleton; wrap the overdue-indicator transitions in a
`@media (prefers-reduced-motion: no-preference)` block (or a `motion-reduce:` variant). Same one-utility sweep the
project page applied with `slideMotion()`.

### D5. Semantic color overload — five accent colors on one screen, `warning` meaning two things

**Rubric:** Color — "one restrained accent, applied where the eye needs it"; reserve color for _state_.

On a single dashboard render the eye can hit `success` (green), `info` (blue), `warning` (amber), `accent`, and
`destructive` (red), several of them _decorative_ rather than stateful:

- **`warning` means two different things.** It's the tone for the **AI Inbox** banner (`:803,805,833`) — which is
  informational, not a warning — _and_ for the genuinely-urgent **Overdue** banner (`:988,990`). When the same
  amber wraps "you have 3 things to review" and "tasks are overdue," the color stops signaling urgency.
- **Decorative `success` on every active project.** The project-card folder icon is `text-success` for _any_ active
  project (`:1122`), `text-accent` if shared, muted otherwise. So green doesn't mean "good/done" — it means "normal,"
  which is most cards. Green-as-default drains the color of meaning.
- **Tri-color activity feed.** Feed icons are muted (task) / `text-info` (document) / `text-warning` (goal)
  (`:1273-1277`), _and_ the action-label text is independently colored `success`/`info`/muted (`:1298-1303`) — so one
  row can show an amber goal icon next to green "Created" text. This is the "color salad" Hyperplexed mutes on sight.

**Fix:** pick one accent for "interactive/primary" and reserve `warning`/`destructive` for true state. Mute
decorative entity icons (feed, project folder) to `text-muted-foreground`; let color appear only where it _means_
something (overdue = amber, a real warning). Retone the AI Inbox banner to `accent` (informational), keeping
`warning` exclusively for Overdue. _(Suspected — confirm on the live dark-mode pass.)_

---

## Part 2 — Per-surface findings

Severity: **High** = breaks alignment/readability/behavior-legibility or blocks keyboard use ·
**Medium** = noticeable polish gap · **Low** = nitpick. Findings rolled into D1–D5 are tagged `→Dx`.

### Surface 1 — Header

| Sev | Region         | Defect                                                                                                                                                                                                     | Fix                                                                |
| --- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Low | Title casing   | "New Project" (Title Case) sits above sentence-case section headers ("Active projects", "Recent activity"); brief widget adds "Today's Brief"/"Generate Brief" — three casing conventions on one screen    | Pick one (sentence case) and sweep                                 |
| Low | Action cluster | New Project carries a long inline accent override (`border-accent/30 … hover:text-accent …`, `:754`) re-styling an `outline` Button into a quasi-primary — works, but bypasses the `Button` variant system | Add an `accent`/`primary-soft` variant instead of inline overrides |

**Strengths:** the greeting `h1` uses `[overflow-wrap:anywhere] [text-wrap:balance]` (`:744`) so it can't break
layout; the action cluster is alignment-safe (`flex-1` New Project, `shrink-0` icon buttons) with one icon size
(`h-3.5 w-3.5`); buttons inherit the shared `Button` `focus:ring`; the calendar/refresh loaders correctly swap the
icon in place. Genuinely clean — the header is the best-behaved surface on the page.

### Surface 2 — Daily Brief widget

| Sev | Region           | Defect                                                                                                    | Fix                          |
| --- | ---------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------- |
| Med | Icon chips       | `rounded-md sm:rounded-lg` breakpoint radius-flip on all five state chips (`:227,240,263,284,341`) (→D2)  | One radius                   |
| Med | Skeleton/spinner | `animate-pulse` skeleton (`:224`) + `animate-spin` (`:242`) ungated (→D4)                                 | `motion-reduce:animate-none` |
| Med | Brief button     | Brief-available `<button>` (`:278`) + generate-CTA `<button>` (`:335`) have no `focus-visible` ring (→D3) | Add ring                     |
| Low | Casing           | "Today's Brief" / "Generate Brief" Title Case vs sentence-case section heads (→Surface 1)                 | Sentence case                |

**Strengths:** the fixed-height container (`min-h-[52px] sm:min-h-[72px]`, `:220`) prevents layout shift across the
five states — exactly the right instinct; the snippet `truncate`s; the priority-action badge and audio badge are
`shrink-0` with `title=` fallbacks; the skeleton matches the final card's dimensions. State-by-state weight choice
(`wt-ghost` for the CTA, `wt-paper` for real content) is correct Inkprint usage.

### Surface 3 — Attention banner cluster _(the highest-value surface)_

| Sev  | Region             | Defect                                                                                                                                                               | Fix                               |
| ---- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| High | All four banners   | Same card hand-rolled 4× and already drifted (container, CTA element, padding, accent, focus) (→D1)                                                                  | One `<AttentionBanner>` component |
| High | 3 of 4 CTAs        | No `focus-visible` ring; only Overdue has one (→D3)                                                                                                                  | Ring on the shared component      |
| Med  | Agent CTA button   | `px-2.5 py-2` (`:871`) is `4px` taller than the `py-1` siblings — uneven control height (→D1)                                                                        | Normalize to `py-1`               |
| Med  | Container chrome   | `border border-border shadow-ink` redundant with `wt-card`'s own border+shadow (→D2)                                                                                 | Drop the Tailwind border/shadow   |
| Med  | `warning` overload | AI Inbox uses `warning` for an informational state, same tone as genuinely-urgent Overdue (→D5)                                                                      | Retone Inbox to `accent`          |
| Low  | Count semantics    | Inbox/Invites/Overdue subtexts each compute a bespoke summary string (`:183-200,252-260,171-175`); fine, but no shared formatter — easy to drift like the markup did | Optional: shared summary helper   |

**Strengths:** the invite inner cards are genuinely alignment-safe (`min-w-0` + `truncate` on name/inviter, role
badge `shrink-0`, `:919-936`); invites correctly cap at `.slice(0, 4)` with a "Review all" escape (`:913,896`) so
the cut-off is acknowledged; error/retry states exist for both Inbox and Overdue (the "polish = unglamorous states"
bar); the overdue banner's secondary loading row is tidy.

### Surface 4 — Active Projects + Shared-with-me grid

| Sev | Region              | Defect                                                                                                                                                                       | Fix                                       |
| --- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Med | Two card blocks     | "Active projects" card (`:1109-1171`) and "Shared with me" card (`:1199-1244`) are ~60-line near-duplicates differing only in icon-color logic + state badge (→D1-style dup) | Extract one `<ProjectCard>` snippet       |
| Med | Card focus          | Card anchors (`:1111,1201`) have no `focus-visible` ring (→D3)                                                                                                               | Add ring                                  |
| Med | Folder-icon color   | `text-success` on _every_ active project is decorative, not stateful (→D5)                                                                                                   | Mute to `text-muted-foreground`           |
| Low | Magic-number indent | Metadata row uses `pl-[22px]` (`:1156,1230`) to hand-align under the title — couples to icon (14px) + `gap-2` (8px); breaks if either changes                                | Wrap title+meta in a shared padded column |
| Low | Overdue pill motion | `ProjectOverdueIndicator` width-expand transition ungated (→D4)                                                                                                              | Reduced-motion guard                      |

**Strengths:** cards handle overflow well (`truncate` title, `min-w-0` wrapper, `shrink-0` badges/time, metadata
`truncate`); the shared/terminal state badges are `shrink-0`; the relative-time + reveal-on-hover arrow never shifts
layout (`opacity-0 group-hover`); the `ProjectOverdueIndicator` is a tidy contained pill (fixed `1.125rem` box,
`box-sizing: border-box`, hover-to-expand) with proper `aria-label`. The fallback-projects messaging (`:1103`) is a
thoughtful empty-ish state.

### Surface 5 — Recent Activity feed + Recent Chats

| Sev | Region               | Defect                                                                                                                                          | Fix                                             |
| --- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Med | Feed colors          | Tri-color icons + independently-colored action labels = "color salad" (`:1273-1277,1298-1303`) (→D5)                                            | Mute icons; reserve color for state             |
| Med | Row focus            | Feed rows (`:1267`) and chat rows (`:1364`) have no `focus-visible` ring (→D3)                                                                  | Add ring                                        |
| Med | Row/container radius | `first:rounded-t-lg last:rounded-b-lg` rows (0.5rem) nested in a `wt-paper` (0.75rem) container — corners don't nest flush (`:1265,1269`) (→D2) | Match corners or pad the container              |
| Low | Header asymmetry     | "Recent activity" `h2` (`:1254`) is the only section header with **no** trailing "All … →" link, while Projects/Shared/Chats all have one       | Add a link or accept the asymmetry deliberately |
| Low | Silent cap           | `unifiedFeed` silently `.slice(0, 8)` (`:314`) with no "view all" affordance — the cut-off is invisible                                         | Surface a total or a "view all" row             |

**Strengths:** both lists share one clean pattern (`wt-paper border divide-y divide-border`, rows `hover:bg-muted/50`);
all titles `truncate`; the empty states are identical and tidy (`wt-paper … tx tx-frame tx-weak text-center`); the
side-by-side `lg:grid-cols-3` (2/3 feed + 1/3 chats) is a sensible density choice; chat rows fall back to
`context_label` when no project name (`:1382`).

### Surface 6 — Compact stats footer + page shell

| Sev | Region     | Defect                                                                                                                       | Fix                                |
| --- | ---------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Low | Page shell | `<main class="… rounded-md">` (`:735`) rounds a `min-h-screen` full-bleed element — nothing to round against; leftover       | Drop `rounded-md`                  |
| Low | Footer     | Stats footer is non-interactive but visually resembles the inline links above it — minor; arguably each stat could deep-link | Optional: link each stat, or leave |

**Strengths:** the footer is exemplary restraint — hierarchy by size/weight/color (muted text, `text-border`
middots), no extra chrome, exactly the "differentiate with size/weight, not more elements" rubric line. The
new-user empty state (`:1063-1089`) is the page's best moment: dashed `border-accent/40`, `tx tx-bloom`, centered
brain-bolt, one clear CTA.

---

## Part 3 — Recommended fix sequence (Hyperplexed order: one feature at a time)

Each step is a single convention that clears many table rows at once.

1. **D1 — extract one `<AttentionBanner>` component.** Highest payoff. Collapses the four drifted banners, fixes
   the `py-2` height, and gives one home for the focus ring + `warning`→`accent` retone. ~1 component, deletes ~120 lines.
2. **D3 — focus-visible sweep.** Reuse the project page's ring utility on: the banner component (one edit), the
   `<ProjectCard>` snippet, and the two list-row types. Knocks out two High findings.
3. **Extract `<ProjectCard>` snippet** (Surface 4) — dedupes the active/shared blocks; step 2's ring lands here once.
4. **D5 — mute decorative color.** Feed icons + project folder icon → `text-muted-foreground`; retone AI Inbox to
   `accent`; keep `warning` for Overdue only. _(Confirm on the live screenshot pass.)_
5. **D2 — geometry hygiene.** Drop redundant `border border-border shadow-ink` from `wt-card` banners; kill the brief
   widget's `rounded-md sm:rounded-lg` flip; make flush list rows match their container corner.
6. **D4 — reduced-motion sweep.** `motion-reduce:animate-none` on every spinner + skeleton; guard the overdue-pill
   transition. One-utility pass.
7. **Cleanups:** drop `rounded-md` on `<main>`; sentence-case the headers; decide the "Recent activity" header link
   and the feed's silent `slice(0,8)`.

---

## Part 4 — What this validates about the playbook (and the project-page pass)

- **The rubric generalizes.** Three of the five systemic patterns here (focus-visible D3, reduced-motion D4, radius
  drift D2) are the _same_ S3/S5/S4 the project page surfaced — which is the point: these are _conventions_, and the
  fixes already built for the project page (`board-a11y.ts`) should be reused, not reinvented. The playbook is
  catching a house style, not one-off bugs.
- **The signature defect re-skinned itself.** The project page's "co-located behaviors" became the dashboard's
  "copy-pasted card that drifted." Different costume, same Hyperplexed instinct ("same look, slightly different =
  looks broken") and same fix shape (consolidate to one source of truth). The `py-2`-among-`py-1`s tell was found
  exactly where his "even padding / one control taller than its neighbors" line predicts.
- **Limitation confirmed, again.** Structural taste (D1/D2/D3/D4) graded cleanly from markup. The color calls (D5 —
  the salad, the `warning` double-meaning, the decorative green) are _suspected_ and want the live dark-mode pass.
  First surface to shoot: the attention banner cluster, post-D1 — to confirm the `warning`/`accent` retone reads.

---

## Part 5 — Fixes applied (2026-06-28)

All five systemic patterns (D1–D5) shipped. New shared component `lib/components/dashboard/AttentionBanner.svelte`
backs D1 as a single convention; the focus-ring and `motion-reduce` conventions reuse the exact class strings already
established by the project-page pass (`focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset`;
`animate-* motion-reduce:animate-none`). `svelte-check` clean (0 errors / 0 warnings); ESLint clean on all touched files.

**Systemic (Part 1) — all five (D1–D5) done:**

- **D1** ✅ The four attention banners (AI Inbox, agent CTA, Project invites, Overdue) now render through one
  `<AttentionBanner>` taking `{ tone, icon, title, subtext, action, children }`. Tone (`accent` | `warning`) drives
  container + chip + action color from one map; the action renders the button/anchor once (one padding, one focus
  ring, optional loading spinner + trailing arrow), so the four can no longer drift. Invite cards + the overdue
  loading row pass through as `children`. This deletes the four hand-rolled copies — and with them the `py-2`/`py-1`
  height drift (now uniformly `py-1`), the lone-focus-ring drift, and the button-vs-anchor inconsistency.
- **D2** ✅ Banners drop the redundant `border border-border shadow-ink` and lean on `wt-card`'s own border + shadow
  - `rounded-xl`. Project cards drop redundant `border border-border bg-card` (now `wt-paper` alone). The two
    divided lists (activity + chats) drop redundant `border border-border`, add `overflow-hidden`, and drop the
    per-row `first:rounded-t-lg last:rounded-b-lg` — rows now clip to the container's `rounded-xl` so corners nest
    flush. Invite inner cards moved to `wt-paper` (matches the banner radius). Brief widget's `rounded-md sm:rounded-lg`
    breakpoint radius-flip → single `rounded-md` (5 chips). Stray `rounded-md` on the full-bleed `<main>` removed.
- **D3** ✅ `focus-visible` rings added to every hand-rolled control: all banner actions (via the component), the
  invite Accept/Decline buttons, both project-card grids, the activity-feed and recent-chat rows, the brief widget's
  brief/generate/retry buttons, and both inline "Retry" text buttons (ring-offset variant). The header `Button`s
  already shipped rings.
- **D4** ✅ `motion-reduce:animate-none` on every spinner (header calendar/refresh, brief widget generating
  spinner, the banner action spinner) and the brief skeleton's `animate-pulse`; the `ProjectOverdueIndicator`'s
  width-expand transitions are wrapped in a `@media (prefers-reduced-motion: reduce) { transition: none }` block.

- **D5** ✅ (2026-06-28) Color reserved for state, decorative chroma muted — three theme-safe changes (all swap
  to existing themed tokens, so no new dark-mode contrast risk; they remove color rather than add it):
  1. **`warning` no longer means two things.** AI Inbox retoned `warning`→`accent` (one-line `tone` change at the
     call site), so amber/`warning` is now reserved for the genuinely-urgent **Overdue** banner. Inbox/agent/invites
     are all `accent` (informational/actionable), distinguished by icon + copy, not by competing accents.
  2. **Decorative folder green muted.** The active-project `FolderKanban` dropped `text-success` → the icon is now
     `text-accent` only when the project `is_shared` (a real cross-user state, reinforced by the "Shared" badge),
     else `text-muted-foreground`. Green no longer reads as "normal."
  3. **Feed icon "salad" gone.** The activity-feed type icons (task/document/goal) are all `text-muted-foreground`
     now — type is conveyed by glyph shape, not color. _Kept_ deliberately: the per-row **action-label** color
     (`Created`=success / `Completed`=info / else muted) and the task **state badge** — those are legitimate
     _state_ signals, which is exactly where the rubric says color belongs. The salad was the icon×label collision,
     and muting the icons resolves it.

**Deferred (Part 2 cleanups, not part of D1–D5):** the `<ProjectCard>` extraction, the `pl-[22px]` magic indent,
sentence-casing the headers, the "Recent activity" missing header link, and the feed's silent `slice(0, 8)`. A live
dark-mode screenshot pass is still worthwhile as a final confirmation, but the D5 changes are reductive (mute /
retone to existing tokens) so they're low-regret by construction.
