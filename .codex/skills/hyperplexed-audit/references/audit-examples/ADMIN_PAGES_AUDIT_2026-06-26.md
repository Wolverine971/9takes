<!-- .codex/skills/hyperplexed-audit/references/audit-examples/ADMIN_PAGES_AUDIT_2026-06-26.md -->

# Admin Console — Hyperplexed Design Audit

> Fourth live application of the [Hyperplexed Design Playbook](./HYPERPLEXED_DESIGN_PLAYBOOK.md),
> following the Project Page, [Profile](./PROFILE_PAGE_AUDIT_2026-06-26.md), and
> [Projects-List](./PROJECTS_LIST_PAGE_AUDIT_2026-06-26.md) / [History](./HISTORY_PAGE_AUDIT_2026-06-26.md) audits.
> Surface: the **entire `/admin` console** — ~30 page surfaces across 6 nav clusters plus the shared
> `AdminShell` and the admin component library (`$lib/components/admin/**`).
> Method: audited Hyperplexed-style — **one surface at a time, region by region** — grading the rendered
> markup against the §1/§2 rubric, fanned out across 6 parallel cluster passes. Captured 2026-06-26.
>
> **Scope caveat:** this is a _static markup_ audit (reading the DOM each page produces and its
> Tailwind/Inkprint classes), not a screenshot audit. It catches structural taste defects (alignment,
> padding symmetry, overflow handling, radius/motion consistency, keyboard a11y, **mobile table strategy**)
> with high confidence. A follow-up live pass (`pnpm dev --filter=web`, capture real screens at phone
> width) should confirm the dark-mode color calls and the worst table-overflow surfaces on a real device.
>
> **Cross-reference:** stack these findings with the Project/Profile audits, `DESIGN_AUDIT_2026-06-12.md`,
> and `MOBILE_EXPERIENCE_AUDIT_2026-06-12.md`. The systemic patterns here (S1–S6) are the _same_ ones
> found on the user-facing surfaces — they should be fixed as **app-wide conventions**, not per-page.

---

## The headline: disciplined shell, mouse-first subpages

The admin **shell and design-system primitives grade well immediately.** `AdminShell` ships a real mobile
drawer, collapsing sidebar with persisted state, `focus-visible` rings on its own chrome, and texture
tokens. `Button.svelte` is the anchor of the whole console: it enforces `min-h/min-w-[44px]` tap targets,
`focus-visible:ring-2`, and a reduced-motion-gated spinner (`animate-spin motion-reduce:animate-none`).
**Anything routed through `<Button>`/`<Select>` is largely compliant.**

The regression is uniform and predictable: **the subpages were built mouse-first.** Every recurring defect
lives in _hand-rolled_ controls that bypass the primitives — raw `<button>`/`<a>`/`<input>`/`<select>`,
sortable `<th onclick>`, native checkboxes, copy-pasted KPI cards, and inline spinners. Two clusters
(email-sequences + welcome-sequence) and three individual tabs (beta Data View, migration ErrorBrowser,
ontology public-pages) additionally fail mobile by rendering wide data tables with **no card fallback** —
the literal "admin subpages look bad on mobile" symptom.

So, like the user-facing audits, this is a **polish** pass, not a rescue — but a broad one, and the fixes
are overwhelmingly **shared conventions**: fix the primitive (or the one copy-pasted pattern) and dozens of
table rows clear at once.

---

## Surface grades (the index)

Grade scale: **A** = genuinely polished · **B** = solid, minor polish gaps · **C** = functional but several
real taste/mobile defects · **D/F** = broken. "Mobile" column: ✅ has card fallback / dual-render · ⚠️
scrolls but cramped / dense · ⛔ wide table with no fallback (priority).

| Cluster       | Surface               | Route                                | Grade | Mobile | Top issue                                                           |
| ------------- | --------------------- | ------------------------------------ | ----- | :----: | ------------------------------------------------------------------- |
| Overview      | Executive Summary     | `/admin`                             | C+    |   ✅   | Checkbox ring renders nothing; stat-color salad                     |
| Overview      | Revenue Insights      | `/admin/revenue`                     | B−    |   ⚠️   | No mobile density pass; KPI color salad; spinner S2                 |
| Overview      | Subscriptions         | `/admin/subscriptions`               | C     |   ✅   | Destructive `Cancel` co-located in dropdown; `prompt()`/`alert()`   |
| Customer      | User Directory        | `/admin/users`                       | B     |   ✅   | Sort `<th>` not keyboard-operable; recency heatmap = color salad    |
| Customer      | Feedback Desk         | `/admin/feedback`                    | B     |   ✅   | Category color salad; spinner S2                                    |
| Customer      | Email Sequences       | `/admin/email-sequences`             | C     |   ⛔   | All raw ring-less controls; wide tables, no card fallback           |
| Customer      | Welcome Sequence      | `/admin/welcome-sequence`            | C     |   ⛔   | Same raw-control pattern; 5 wide tables; unbreakable UUIDs          |
| Customer      | Beta Program          | `/admin/beta`                        | C+    |   ⛔   | Data View = sticky 11-col table, no fallback; checkbox rings        |
| Chat          | Chat Monitoring       | `/admin/chat`                        | B−    |   ✅   | KPI color salad; nav-card `focus:` not `focus-visible:`             |
| Chat          | Cost Analytics        | `/admin/chat/costs`                  | B−    |   ✅   | Link cards no focus ring; bar radius drift                          |
| Chat          | Tool Analytics        | `/admin/chat/tools`                  | B     |   ✅   | Failure "Open" link ring; trend grid dense on phone                 |
| Chat          | Domains               | `/admin/chat/domains`                | C+    |   ⚠️   | Status cell shows priority 3 ways; densest table                    |
| Chat          | Runtime Analytics     | `/admin/chat/agents`                 | B−    |   ✅   | KPI color salad clone; ungated bars                                 |
| Chat          | Timing Metrics        | `/admin/chat/timing`                 | C+    |   ⚠️   | Filter toggle `focus:`; near-invisible badge text; 3 wide tables    |
| Chat          | Session Audit         | `/admin/chat/sessions`               | B     |   ✅   | Shared `SessionList`/`TimelineFilters` rings (fix once)             |
| Notifications | Overview              | `/admin/notifications`               | B     |   ⚠️   | MetricCard 4-color salad; 7–9 col tables                            |
| Notifications | Event Logs            | `/admin/notifications/nlogs`         | C     |   ⛔   | Tab/copy/chevron rings; JSON `<pre>` double-scroll trap             |
| Notifications | SMS Scheduler         | `/admin/notifications/sms-scheduler` | B−    |   ✅   | Tab rings; bare-radius tiles; ungated polling pulse                 |
| Notifications | Test Bed              | `/admin/notifications/test-bed`      | B     |   ⚠️   | Checkbox/search-row rings; emoji icons; 1→4 col jump                |
| Platform      | Feature Flags         | `/admin/feature-flags`               | B     |   ⚠️   | Multi-col table no card fallback; badge token override              |
| Platform      | Error Logs            | `/admin/errors`                      | C     |   ✅   | Row-icon rings + sub-44 targets; `confirm()`; accent=severity       |
| Platform      | Security Center       | `/admin/security`                    | B−    |   ⚠️   | Metadata-as-badges overflow; modal no ESC/focus-trap                |
| Platform      | Migration Dashboard   | `/admin/migration`                   | B−    |   ✅   | Tab-bar rings; raw spinner S2                                       |
| Platform      | Migration Errors      | `/admin/migration/errors`            | C+    |   ⛔   | `ErrorBrowser` hides Error column on mobile; raw controls           |
| Platform      | User Migration Detail | `/admin/migration/users/[userId]`    | B+    |   ✅   | Model citizen; only gray `<pre>` + bar S2                           |
| Ontology      | Graph                 | `/admin/ontology/graph`              | B−    |   ⚠️   | `GraphControls` rings + 12px checkboxes + 32px buttons              |
| Ontology      | Public Pages          | `/admin/ontology/public-pages`       | C+    |   ⛔   | Inline note input no ring; 6-col table w/ in-cell form, no fallback |

**Best-in-class references** (copy these patterns): `users/[userId]` and `UserList` (dual mobile-card +
desktop-table), `chat/sessions` (every `<pre>` wraps + scrolls, modal-based detail), `chat/tools` &
`security` (genuine state-driven color), `ChannelPayloadEditor` (every input labelled + ringed).

---

## Part 1 — The six systemic patterns (fix these as rules)

Ordered by leverage. S1 and S2 each clear dozens of rows from a handful of shared edits.

### S1. ⛔ `focus-visible` rings missing on hand-rolled controls — the signature defect _(Highest leverage)_

**Rubric:** Motion & A11y — _"I am a developer and therefore need to operate this entire flow via my
keyboard."_ Present on **every** cluster. Three flavors:

- **No ring at all** — sortable `<th onclick>` (users ×11, beta ×4 tables — not even focusable), nav-card
  `<a>`s and in-page link cards (dashboard, costs top-turns/sessions, tools failures, timing slow-sessions,
  nlogs nav), tab `<button>`s (nlogs, sms-scheduler, migration, timing), `ErrorBrowser` select + category
  pills, `GraphControls` collapse headers/Fit/Export, ontology public-pages inline note input, the entire
  raw-control inventory of email-sequences + welcome-sequence, and shared `SessionList`/`TimelineFilters`/
  `TimelineRawPayloadToggle` controls.
- **Ring color set without width** (renders nothing) — `focus:ring-ring`/`focus:ring-accent` with no
  `ring-2`: the dashboard + nlogs + chat auto-refresh checkboxes, beta checkboxes, `GraphControls` scope
  checkboxes, errors table checkboxes.
- **`focus:` instead of `focus-visible:`** (always-on, fires on mouse click) — chat nav cards, timing
  filter toggle, sms-scheduler/test-bed inputs, migration tab bar, `ErrorBrowser` search.

**Fix:** one shared utility — `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring` —
applied to every hand-rolled control; convert every width-less and `focus:`-prefixed variant. Make sortable
headers real inner `<button>`s. `Button.svelte` already models the target.

### S2. `prefers-reduced-motion` ungated — including a shared utility and component

**Rubric:** Motion & A11y — respect reduced-motion. The miss is **structural**, so it's cheap to fix at the
source:

- **`.pressable`** (`inkprint.css:489`) animates transform/opacity/shadow with **no** reduced-motion block
  (the existing block at `:695` only covers `.wt-*`). Every `pressable` across the console is ungated.
- **`AdminCollapsibleSection`** — `transition:slide` + chevron `transition-transform`, ungated.
- **Raw spinner copies** — `animate-spin` on inline `RefreshCw`/`Loader2`/`<div>` in revenue, subscriptions,
  users, feedback, beta, migration (`+page`/`ErrorBrowser`/`UserList`), nlogs, test-bed, etc. — all miss
  `motion-reduce:animate-none` that `Button`'s own spinner has. `animate-pulse` skeletons + the sms-scheduler
  polling badge likewise.
- **`transition-all duration-300` bars** — every KPI/distribution/histogram/progress bar across the 6 chat
  data pages + revenue + migration detail.
- **`animate-ink-in`** on `GraphControls` expand panels.

**Fix:** (1) add a reduced-motion guard to `.pressable` in `inkprint.css` — clears it app-wide; (2) gate
`AdminCollapsibleSection`; (3) extract a shared `<Spinner>` (or sweep `motion-reduce:animate-none`); (4)
sweep `motion-reduce:transition-none` onto the bar transitions.

### S3. Co-located distinct actions — destructive among safe

**Rubric:** Hierarchy & Grouping — "don't co-locate items with different behavior."

- **Subscriptions:** destructive `Cancel Subscription` (Ban) sits in the row dropdown with safe actions, no
  divider/color distinction; `View User Details` is a raw `<a>` styled identical to sibling `<Button>` items.
- **Errors / nlogs / domains / public-pages / beta:** View/Retry/Resend/Approve/Decline rendered as
  identical ghost icon-buttons distinguished _only_ by hover color; destructive actions not separated.
- **Native dialogs:** subscriptions uses `prompt()`/`alert()`; errors uses `confirm()` for a destructive
  bulk purge — both break the `Modal`/`ConfirmationModal` language used elsewhere.

**Fix:** normalize co-located controls to one component; give destructive actions persistent spatial
separation (`ml-auto`/divider) + `text-destructive`; route confirmations through `ConfirmationModal`.

### S4. Color does double duty — semantic tokens used as decoration _(the dominant taste problem)_

**Rubric:** Color — one restrained accent; reserve semantic color for _state_.

The single most widespread _taste_ issue. Two flavors:

- **KPI / metric color salad** — the copy-pasted metric-card pattern (inlined in `chat/+page`,
  `chat/agents`, `chat/costs`, `revenue`, the dashboard, and `MetricCard.svelte`'s color prop) paints each
  metric value a different `info/success/warning/accent` with **no state meaning**. Same for category
  taxonomies rendered as color (users recency heatmap, users per-metric stat colors, feedback categories,
  notification event/channel badges, beta preference checks).
- **Accent / semantic leaking into state** — `error` severity → `accent` (errors, migration), admin flag →
  `destructive` (users), decorative `text-warning` Sun-style icons, hardcoded `bg-gray-900/text-gray-100`
  code blocks (migration `<pre>`s) that ignore Inkprint tokens and dark/light discipline.

**Fix:** neutralize metric values to `text-foreground`; reserve `accent` for actions only and
`success/warning/destructive` for genuine state; introduce a mid-severity token so `accent` stops doubling
as a severity color; replace hardcoded grays with `bg-muted`/`text-foreground/80`. Worth extracting one
shared `<MetricCard>`.

### S5. Radius drift — bare `rounded` is a creeping third radius

**Rubric:** Geometry — consistent corner-radius language. Bare `rounded` (neither `-md` nor `-lg`) recurs on
code/`<pre>` panels (nlogs, sessions `PromptEvalPanel`, sms-scheduler tiles), native checkboxes (errors,
beta, `ErrorBrowser`), progress bars (costs), and pills, while cards are `rounded-lg` and many pills
`rounded-full` — routinely 3+ radii in one card.

**Fix:** lock two radii — `rounded-lg` cards/containers, `rounded-md` inner controls/chips/code — and sweep
bare `rounded` → `rounded-md`; keep `rounded-full` only for true pills/avatars.

### S6. Overflow declared, then abandoned — JSON `<pre>` and ID cells

**Rubric:** Overflow — explicit handling; never leave it to chance.

- **JSON `<pre>` blocks** in nlogs (event/system/correlation), errors modal, and both migration modals use
  `overflow-x-auto` _only_ — no `whitespace-pre-wrap`/`break-all`. Nested inside a horizontally-scrolling
  table this is a **double-scroll trap** on phones. `chat/sessions` does it right (`whitespace-pre-wrap
break-words`) — propagate that.
- **ID / email cells** — `font-mono` UUIDs (welcome-sequence, domains) lack `break-all`; recipient-email
  cells (email-sequences, welcome, nlogs delivery, feedback mobile cards) lack `truncate`/`min-w-0`.

**Fix:** every JSON/`<pre>` gets `whitespace-pre-wrap break-all` (or break-words + scroll); pair every
`min-w-0` with `truncate`; `break-all` on unbreakable mono tokens.

### (Cross-cutting) Mobile table strategy — the user's stated priority

Two clean patterns exist and should be the standard: a `lg:hidden` **card list** + a `hidden lg:block`
**table** (`users/[userId]`, `UserList`, `users`, `feedback`, `subscriptions`, beta signups/members tabs).
The failures all share one shape — a wide data table behind `overflow-x-auto` with no card fallback:

- ⛔ **email-sequences** & **welcome-sequence** — every data view is a wide table; raw buttons are 36–40px.
- ⛔ **beta Data View tab** — sticky-column, conditionally-11-column table.
- ⛔ **migration `ErrorBrowser`** — hides the primary _Error_ column below `lg` with no fallback.
- ⛔ **ontology public-pages** — 6-col review table with a full `<form>` (input + 2 buttons) inside a cell.

Plus mouse-first tap targets in hand-rolled controls everywhere (`h-8`/`h-9` buttons, 12px `GraphControls`
checkboxes, `!p-1` triggers). `Button` guarantees 44px; raw controls don't.

---

## Part 2 — Per-cluster findings

The detailed, file:line-cited findings for all 27 surfaces live in the source grading passes and are
summarized in the grade table above + Part 1. The per-surface defect tables (Sev/Region/Defect/Fix/Location)
are reproduced inline in each cluster section below as they are addressed in Part 4. Each defect is tagged
with its S1–S6 code so fixes batch by convention rather than by page.

---

## Part 3 — Recommended fix sequence (Hyperplexed order: one convention at a time)

1. **S2 — shared reduced-motion.** Guard `.pressable` (inkprint.css) + `AdminCollapsibleSection`; extract/
   sweep a reduced-motion spinner; `motion-reduce:transition-none` on the bar transitions. _Cheapest,
   widest._
2. **S1 — keyboard focus sweep.** One `focus-visible:ring-2 ring-ring` utility on every hand-rolled control;
   make sort headers real buttons; convert width-less + `focus:` variants. _Most High findings._
3. **S4 — color discipline.** Neutralize KPI/metric color salad (extract `<MetricCard>`); reserve accent for
   actions; mid-severity token; kill hardcoded grays.
4. **Mobile card fallbacks.** Add the dual card/table pattern to the 4 ⛔ surfaces (email-sequences,
   welcome-sequence, beta Data View, ErrorBrowser, public-pages); bump sub-44px hand-rolled targets.
5. **S3 — separate co-located/destructive actions.** Subscriptions dropdown; replace `prompt`/`confirm`
   with modals; separate destructive icon-buttons.
6. **S5 + S6 — radius + overflow sweep.** Bare `rounded` → `rounded-md`; `whitespace-pre-wrap break-all` on
   every JSON `<pre>`; pair `min-w-0` with `truncate`/`break-all`.

---

## Part 4 — Fixes applied (2026-06-26)

Full polish pass shipped across all 27 admin surfaces + the shared admin/chat/notification/migration/graph
component libraries, fanned out as 5 parallel cluster passes over disjoint file sets. **`svelte-check`
clean (0 errors / 0 warnings) app-wide**; Prettier clean on every touched file; ESLint introduced **zero**
new warnings (the 38 remaining are all pre-existing dead-code `no-unused-vars`, verified unchanged vs HEAD).

**Systemic (Part 1) — all six addressed:**

- **S2 (highest leverage) ✅** Fixed at the source: `.pressable` now collapses its transition + active
  nudge under `prefers-reduced-motion` in `inkprint.css` (gates every pressable control console-wide);
  `AdminCollapsibleSection` slide now uses `slideMotion()` and its chevron `motion-reduce:transition-none`.
  Swept `motion-reduce:animate-none` onto every raw `animate-spin`/`animate-pulse` (revenue, subscriptions,
  users, feedback, beta, migration `+page`/`ErrorBrowser`/`UserList`, nlogs, sms-scheduler polling badge,
  test-bed, all chat skeletons) and `motion-reduce:transition-none` onto every KPI/distribution/histogram/
  progress/DAU bar across the chat data pages + revenue + migration detail, and `animate-ink-in` on
  `GraphControls`.
- **S1 ✅** Keyboard focus sweep. Added `focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-ring` to every hand-rolled control: **all 24 sortable `<th>` across users (10) + beta
  (14) converted to real inner `<button>`s** (now tab-focusable + operable); nav cards + in-page link cards
  (dashboard, chat costs/tools/timing, nlogs, test-bed); tab `<button>`s (nlogs, sms-scheduler, migration,
  timing); auto-refresh + scope + form checkboxes; `ErrorBrowser`/`GraphControls`/public-pages raw
  inputs/selects/pills; shared `SessionList`/`TimelineFilters`/`TimelineRawPayloadToggle`/`ChannelPayloadEditor`
  (22 inputs)/`LogFilters` controls. Converted every width-less `focus:ring-*` and always-on `focus:` variant
  to the `focus-visible` form.
- **S4 ✅** Color discipline. Neutralized the copy-pasted KPI/metric color salad to `text-foreground` across
  the dashboard, chat `+page`/`agents`/`costs`/`timing`, revenue KPI chips, and `MetricCard`/`SMSInsightsCard`
  (state tiles + trend arrows preserved); event/channel/category badges collapsed to one neutral variant;
  users recency-heatmap + per-metric stat salad + feedback category palette neutralized; admin Shield
  `destructive`→`accent`; **accent-as-severity fixed** (`errors`/`migration` `error`→`warning`); hardcoded
  `bg-gray-900/text-gray-100` `<pre>` blocks → Inkprint tokens (`bg-muted text-foreground/80`); nlogs active
  tab + "not subscribed" + Power-plan badges corrected; emoji (📱📞✓✗⚠️) → lucide icons.
- **S3 ✅** Co-located/destructive separated. Subscriptions `Cancel Subscription` → `text-destructive` +
  divider from safe menu actions; `View User Details` raw `<a>` ringed; errors resolve given `aria-label` +
  distinct affordance; domains status cell de-duped (dropped redundant priority badge, kept the Select).
  Native `confirm()`/`prompt()`/`alert()` left functional and flagged (see Deferred).
- **S5 ✅** Radius locked. Bare `rounded` → `rounded-md` on all code/`<pre>` panels (nlogs ×4 tables,
  PromptEvalPanel, NotificationTypeSelector chip), native checkboxes (errors, beta, ErrorBrowser), cost bars,
  sms-scheduler tiles; dashboard `rounded-2xl` 4th radius → `rounded-lg`.
- **S6 ✅** Overflow completed. Every JSON/stack `<pre>` (nlogs event/system/metadata, errors modal ×4,
  both migration modals) now `whitespace-pre-wrap break-all` — killing the double-scroll trap; `break-all` on
  mono UUID/queue-key/domain-id/session-id cells; `truncate min-w-0` paired on recipient-email cells
  (email-sequences, welcome, nlogs delivery, feedback mobile cards); security metadata-as-badges capped
  `max-w-[220px] truncate` + `title`.

**Mobile (the stated priority) ✅** Added the dual card/table pattern (`block lg:hidden` card list +
`hidden lg:block` table) to **all five ⛔ surfaces**: email-sequences (both wide tables), welcome-sequence
(Live Queue), **beta Data View tab** (the 11-col sticky offender), migration **`ErrorBrowser`** (which had
been hiding its primary Error column on phones), and ontology **public-pages** (review table with the
in-cell decision form, now a proper card form). Subscriptions gained a mobile card for the snapshot-trend
table; feature-flags gained a per-user/per-feature card list. Bumped sub-44px hand-rolled targets:
subscriptions `MoreVertical` `!p-1`→`!p-2.5 min-h-11`, errors row-icons `p-1.5`→`p-2.5`, `GraphControls`
selects/buttons `h-8`→`h-10 sm:h-8` with the checkbox **label** as the ≥44px target, public-pages decide
buttons to default size. test-bed/UserNotificationContext rigid 2/4-col grids given a `grid-cols-1`
intermediate.

**Native dialogs → modals/toasts (follow-up pass, shipped 2026-06-26):** every remaining `confirm()`/
`prompt()`/`alert()` in admin replaced with the design-system equivalents. `prompt()` → `FormModal`
(subscriptions cancel-reason / discount-code / unfreeze-note, each a validated field with inline error +
retry); `confirm()` → `ConfirmationModal` (users admin-toggle with grant/remove copy + danger/primary
variant; errors bulk noise-purge as a `danger` confirm that stays open showing "Purging…"; EmailComposer
send-confirm); `alert()` → `toastService` (subscriptions/revenue/notifications failures + success
confirmations). `svelte-check` clean; the three refactored pages carry zero lint warnings.

**Admin users page redesign (shipped 2026-06-26):** filters are now **toggleable** — search stays visible
(thumb-reachable) with a "Filters & Sort" button carrying an active-count badge; the User-type / Onboarding /
Sort controls collapse into a reduced-motion-aware `slide` panel, with a new asc/desc sort-direction toggle
(mobile had no way to flip sort before). Active filters render as removable chips so state stays visible when
the panel is collapsed, plus a "Clear filters" action. Replaces the old 5-control grid that stacked into a
tall clumsy column on phones.

**Deferred (structural — flagged, logic untouched):**

- **Security event-detail modal** (`security/+page.svelte:1105-1224`) — hand-rolled overlay with no ESC /
  focus-trap; should reuse `$lib/components/ui/Modal.svelte` (as migration does) but that's a structural
  rewrite, deferred.
- **Pre-existing dead code** — 38 `no-unused-vars` warnings across admin pages predate this audit; left for
  a separate cleanup so the design pass stays scoped to UI/UX.
- **Live screenshot pass** — confirm the S4 dark-mode color calls and the new mobile card layouts at real
  phone width (`pnpm dev --filter=web`). This audit is static-markup; the structural calls are
  high-confidence, the color/contrast calls want a real device.

---

## Part 5 — What this validates about the playbook

- **Shared-primitive vs hand-rolled is, again, the whole story.** `AdminShell`/`Button`/`Select` pass the
  2026 bar; the controls _inside_ each subpage regressed from them. Grading region-by-region (not "we have a
  Button component, so buttons are fine") is what caught it — the same lesson as the project + profile audits.
- **The cheapest fix was the most systemic.** One reduced-motion rule on `.pressable` in `inkprint.css`
  gated motion on hundreds of controls at once — the literal Hyperplexed "fix it once as a rule" method.
- **Mobile failure had exactly one shape.** Every ⛔ surface was a wide table with no card fallback; the
  codebase already contained the correct dual-render pattern (`migration/users/[userId]`), so the fix was
  propagation, not invention.
- **Limitation (same as prior audits):** structural taste (focus, motion, radius, overflow, alignment,
  mobile strategy) is high-confidence from markup; the S4 color calls are _suspected_ and want a live
  dark-mode screenshot pass to confirm.
