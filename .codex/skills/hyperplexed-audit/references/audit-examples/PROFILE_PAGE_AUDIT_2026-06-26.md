<!-- .codex/skills/hyperplexed-audit/references/audit-examples/PROFILE_PAGE_AUDIT_2026-06-26.md -->

# Profile & Settings Page — Hyperplexed Design Audit

> Second live application of the [Hyperplexed Design Playbook](./HYPERPLEXED_DESIGN_PLAYBOOK.md),
> following the [Project Page audit](./PROJECT_PAGE_AUDIT_2026-06-26.md).
> Surface: **Profile & Settings** — `apps/web/src/routes/profile/+page.svelte` (a shell) and its
> eight tab components plus the shared `ui/TabNav.svelte`.
> Method: audited Hyperplexed-style — **one surface at a time, region by region** — grading the
> rendered markup against the §1/§2 rubric. Captured 2026-06-26.
>
> **Scope caveat:** this is a _static markup_ audit (reading the DOM each component produces and the
> Tailwind/Inkprint classes on it), not a screenshot audit. It catches structural taste defects
> (alignment, padding symmetry, overflow handling, radius/motion consistency, keyboard a11y) with high
> confidence. A follow-up live pass (`pnpm dev --filter=web`, capture the real screens) should confirm
> the color/contrast calls in dark mode and wrap behavior at real breakpoints.
>
> **Cross-reference:** stack these findings with `PROJECT_PAGE_AUDIT_2026-06-26.md`,
> `DESIGN_AUDIT_2026-06-12.md`, and `MOBILE_EXPERIENCE_AUDIT_2026-06-12.md` so fixes don't duplicate.
> Several systemic patterns here are the _same_ ones found on the project page — they should be fixed
> as one cross-surface convention.

---

## Surfaces audited

| #   | Surface                                               | File                                                              |
| --- | ----------------------------------------------------- | ----------------------------------------------------------------- |
| 0   | Page shell (header, banners, tab nav, template modal) | `routes/profile/+page.svelte`, `ui/TabNav.svelte`                 |
| 1   | Account tab                                           | `profile/AccountTab.svelte`                                       |
| 2   | Contacts tab                                          | `profile/ContactsTab.svelte`                                      |
| 3   | AI Preferences tab                                    | `profile/PreferencesTab.svelte`                                   |
| 4   | Brief Settings tab                                    | `profile/BriefsTab.svelte`, `profile/ScheduledSMSList.svelte`     |
| 5   | Calendar tab                                          | `profile/CalendarTab.svelte`                                      |
| 6   | Notifications tab                                     | `profile/NotificationsTab.svelte` (+ child preference components) |
| 7   | Agents (API keys) tab                                 | `profile/AgentKeysTab.svelte`                                     |
| 8   | Billing tab                                           | `profile/BillingTab.svelte`                                       |

---

## The headline: good shared bones, then per-tab regression

Two things grade well immediately. First, the shared `TabNav` component is **genuinely above-bar** — it
ships the exact thing the project-page tablists were missing: a real roving `tabindex` _with_ an
arrow/Home/End `keydown` handler, `role=tablist`/`tab`/`aria-selected`, a `focus-visible` outline, 44px
touch targets, and a `prefers-reduced-motion` block (`TabNav.svelte:44-72, 143, 164-166, 211-222`).
That is the model the rest of the page should copy. Second, overflow is mostly handled — most labels carry
`min-w-0`/`truncate` with `shrink-0` icons, and the AgentKeys copy affordances (every copy button swaps
`Copy → Copied`/`CircleCheck` on a 2s timeout) are exemplary.

So, like the project page, this is a **polish** audit, not a rescue. But there's a clear story: the
_shared primitives_ are disciplined, and the _hand-rolled controls inside each tab_ regress from them —
the same focus-ring, reduced-motion, radius, and color-discipline gaps repeat tab after tab. Fix them as
conventions and most of Part 2 clears itself.

---

## Part 1 — The six systemic patterns (fix these as rules, not one-offs)

### S1. ⛔ `focus-visible` rings are missing or mis-specified — the signature defect _(Highest leverage)_

**Rubric:** Motion & A11y — _"I am a developer and therefore need to operate this entire flow via my
keyboard."_ (his most-emphasized 2026 bar.)

This is the single most-repeated defect on the page, and it has two flavors:

- **No ring at all** on hand-rolled interactive controls: the three password show/hide toggles
  (`AccountTab:500,534,561`), the clear-username button (`AccountTab:448`), the **primary** OptionCard
  selectors — 3 grids of them (`PreferencesTab:205-214`), Billing's "Download PDF" anchor
  (`BillingTab:146-153`) and CTA anchor (`:212-214`), Briefs' "View All" link (`BriefsTab:596`), the
  ScheduledSMS filter tabs (`:186-221`), the calendar event-link anchors (`CalendarTab:867-875`) and
  calendar-project nav cards (`:955-957`), and the advanced-permissions / inline doc links in AgentKeys
  (`:1938-1942, 1179, 1803`).
- **Ring color set without ring width** (renders nothing) or `focus:` instead of `focus-visible:`
  (always-on): AgentKeys checkboxes/radios use `focus:ring-accent` with no `ring-2`
  (`:1912,1964,1988,2057`); the voice-narration toggle (`BriefsTab:552`) and working-days checkboxes
  (`CalendarTab:686-687`) use `focus:ring-2` (always-on, not `focus-visible`).

**Fix:** one shared `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent` utility,
applied to every interactive element that lacks it; sweep every `focus:ring-accent`-without-width and
`focus:ring` to the `focus-visible:ring-2` form. `TabNav` already models the target behavior.

### S2. `prefers-reduced-motion` is ungated across every tab — _including the page shell_

**Rubric:** Motion & A11y — respect reduced-motion.

Mirrors **project-audit S5**, but broader here. None of the page's component-local motion is gated:

- **Page shell:** all three status banners animate `transition:slide` unconditionally
  (`+page.svelte:269,282,305`).
- **Spinners:** `animate-spin` with no `motion-reduce:animate-none` in BriefsTab (`:356,592,606`),
  ScheduledSMSList (`:179,227,356`), CalendarTab page loader (`:505`).
- **Transitions:** `transition:slide`/`fade` on Briefs job rows (`:626,662`), ScheduledSMS cards
  (`:226,234,254,275`); `pressable`/`transition-all` on PreferencesTab OptionCards (`:209`), Billing CTA
  (`:212`); chevron `transition-transform` in AgentKeys (`:1308,1452`).

**Fix:** the same reduced-motion-aware slide/duration helper the project page now uses
(`v2/board-a11y.ts: slideMotion`), plus `motion-reduce:animate-none` on every spinner and
`motion-reduce:transition-none` on pressables/chevrons. One utility, swept across the profile tabs.

### S3. Same look, different behavior — co-located distinct actions

**Rubric:** Hierarchy & Grouping — "don't co-locate items with different behavior" (his signature redesign move; = **project-audit S1**).

- **Billing:** "Download PDF" is a raw `<a target="_blank">` while "Generate PDF" is a `<Button>` — same
  `text-xs text-accent` look, different element, different behavior, and only one is keyboard-visible
  (`BillingTab:145-163`).
- **Briefs:** the "View All" navigation link is styled differently from the adjacent ghost `Button`
  refresh control, yet they sit in the same action row (`BriefsTab:592-596`).
- **AgentKeys:** the destructive **Revoke** button shares one `flex flex-wrap gap-2` row at identical
  `size="sm"` with safe actions (Copy/Usage/Rotate/Edit) — on wrap it can land right next to Edit, with
  only color separating a destructive action from a safe one (`:1541,1599-1607`).

**Fix:** normalize co-located controls to one component; give destructive actions persistent spatial
separation (`ml-auto`/divider), not just color.

### S4. Color does double duty / color salad

**Rubric:** Color — one restrained accent; reserve color for _state_ (= **project-audit S2**).

- **AgentKeys:** three read-only caller metrics render in three Badge colors (`info`/`accent`/`default`)
  for identical behavior (`:1484-1490`).
- **ScheduledSMSList:** `accent` is used both for the "scheduled" status badge _and_ the "AI-generated"
  pill (`:124-139,290`), so accent means two different things in one card.
- **CalendarTab:** a decorative `Sun` icon for "morning" is painted `text-warning` with no warning
  semantics (`:809`).

**Fix:** reserve `accent` for one role and `warning`/`destructive` strictly for state/danger; collapse
the read-only metric badges to one neutral variant.

### S5. Radius drift — bare `rounded` is a creeping third radius

**Rubric:** Geometry — consistent corner-radius language (= **project-audit S4**).

Bare `rounded` (neither `rounded-md` nor `rounded-lg`) appears on the cancel-job button
(`BriefsTab:648`), the SMS message body (`ScheduledSMSList:309`), working-days checkboxes
(`CalendarTab:686`), and — most repeatedly — every inline `<code>`/`<pre>` panel in AgentKeys
(`:1173,1202,1232,1264,1289,1535,2224,2284,2314,2343,2373`). ScheduledSMSList stacks three radii in one
card (`rounded-full` pills + `rounded-lg` card + bare `rounded` body).

**Fix:** lock two radii — `rounded-lg` for cards/containers, `rounded-md` for inner
controls/chips/code-surfaces — and sweep `rounded` → `rounded-md`.

### S6. Overflow intent declared, then abandoned

**Rubric:** Overflow — explicit handling; never leave it to chance.

The `min-w-0` wrapper is present but the `truncate`/`break-all` that makes it work is missing:

- **Contacts:** saved-contact name + meta sit in a `min-w-0` parent but have no `truncate`/`line-clamp`,
  so long names wrap instead of clipping (`ContactsTab:645-653`).
- **Account:** the public-URL preview is one unbreakable `font-mono` token with no `break-all` — long
  usernames overflow horizontally on mobile (`AccountTab:409`).
- **ScheduledSMS:** the event-title span has no `truncate`/`min-w-0` and its `Calendar` icon no
  `flex-shrink-0`, so a long title displaces the icon (`:298-304`); the error text is `truncate` inside a
  `flex-shrink-0` box with no `max-w`, so truncate never engages (`BriefsTab:681`).

**Fix:** wherever `min-w-0` appears, pair it with `truncate`/`line-clamp`; add `break-all` to unbreakable
token strings.

---

## Part 2 — Per-surface findings

Severity: **High** = breaks alignment/readability/behavior-legibility or blocks keyboard use ·
**Med** = noticeable polish gap · **Low** = nitpick. Findings rolled into S1–S6 are tagged `→Sx`.

### Surface 0 — Page shell + TabNav

| Sev | Region                  | Defect                                                                                                            | Fix                                                                  |
| --- | ----------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Med | Status banners          | All three (`onboarding`, `saveSuccess`, `saveError`) animate `transition:slide` ungated (→S2) (`:269,282,305`)    | Reduced-motion-aware slide                                           |
| Low | Template modal `<pre>`  | Preview block has literal source indentation leaking into the rendered `whitespace-pre-wrap` content (`:459-462`) | Trim/template the content so stray leading whitespace isn't rendered |
| Low | Onboarding success icon | `CircleCheck` lacks `flex-shrink-0` that the error banner has (`:272 vs :310`)                                    | Add `flex-shrink-0`                                                  |

**Strengths:** the profile header is alignment-safe (`min-w-0` + `truncate` title + `flex-shrink-0`
avatar/CTA, `:331-358`); color is restrained (success/destructive/accent each used for one role); the
template editor reuses the shared `Modal` (portal, scroll-lock, Escape stack). **`TabNav` is the page's
best-built primitive** — full WAI-ARIA tab pattern, arrow/Home/End roving keyboard, `focus-visible`
outline, 44px targets, reduced-motion block.

### Surface 1 — Account tab

| Sev  | Region                     | Defect                                                                                                                   | Fix                       |
| ---- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| High | Password show/hide toggles | No `focus-visible` ring on the three eye buttons (→S1) (`:500,534,561`)                                                  | Ring + `p-1` hit box      |
| Med  | Password fields            | Eye button is `absolute right-3` but the input reserves no `pr-10`, so a revealed value runs under the icon (`:489-514`) | Pass `pr-10` to TextInput |
| Med  | Public-URL preview         | Unbreakable `font-mono` username token, no `break-all` — overflows on mobile (→S6) (`:409`)                              | `break-all`               |
| Med  | Clear-username button      | No `focus-visible` ring (→S1) (`:448`)                                                                                   | Add ring                  |
| Low  | Success banner icon        | `CircleCheck` missing `flex-shrink-0` the error variant has (`:318`)                                                     | Add `flex-shrink-0`       |

**Strengths:** two-radii language respected (`rounded-lg` alerts, `rounded-md` controls); uniform `w-4 h-4`
icons; username group uses `flex-1 min-w-0` + group-level `focus-within:ring` so the prefix chip can't be
knocked out of alignment; color is state-purposed.

### Surface 2 — Contacts tab

| Sev | Region                             | Defect                                                                                                                                    | Fix                                  |
| --- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Med | Saved-contact name/meta            | `min-w-0` set but no `truncate`/`line-clamp` — long names wrap (→S6) (`:645-653`)                                                         | `truncate` name, `line-clamp-1` meta |
| Med | Import-preview status/action cells | Raw enum strings (`create_new`, `upsert_existing`) and identical styling for ready/skipped/errors — state not differentiated (`:594-595`) | Humanize + color by status           |
| Med | Import-preview scroll region       | `max-h-64 overflow-auto` 6-col table, no `min-w`, no scroll fade — columns squish, scroll invisible (`:572`)                              | `min-w-[640px]` + edge fade          |
| Low | CSV file input                     | No `focus-visible` ring (→S1) (`:529-535`)                                                                                                | Add ring                             |
| Low | Preview table header               | `<thead>` not `sticky` under a `max-h-64` scroll (`:574`)                                                                                 | `sticky top-0`                       |

**Strengths:** clean `rounded-md`-in-`rounded-lg` radius language; behavior-distinct actions correctly
differentiated by variant (Edit = ghost, Archive = danger, `:661-676`); icons contained via Button `icon`
prop; symmetric grid/cell padding; explicit loading/empty states.

### Surface 3 — AI Preferences tab

| Sev  | Region             | Defect                                                                                               | Fix                     |
| ---- | ------------------ | ---------------------------------------------------------------------------------------------------- | ----------------------- |
| High | OptionCard buttons | The primary selectable controls (3 grids) have **no** `focus-visible` ring (→S1) (`:205-214`)        | Add ring                |
| Med  | OptionCard / Save  | `transition-all duration-200 pressable` + Save spinner ungated for reduced-motion (→S2) (`:209,314`) | `motion-reduce:` guards |
| Low  | OptionCard radius  | Inner selectable tiles use `rounded-lg` nested in a `rounded-lg` card (→S5) (`:209`)                 | `rounded-md` inner      |

**Strengths:** selection state is a single restrained accent (`border-accent bg-accent/5`) used purely for
state; `aria-pressed` set per option; symmetric `p-3`/`gap-3`; consistent card radius; legible disabled state.

### Surface 4 — Brief Settings (BriefsTab + ScheduledSMSList)

| Sev  | Region                       | Defect                                                                                                                                              | Fix                                             |
| ---- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| High | SMS filter tabs              | Four `<button>` tabs: no `focus-visible` ring, **no** `role=tablist`/`tab`/`aria-selected`, no roving arrow keys (→S1) (`ScheduledSMSList:186-221`) | Adopt the shared `TabNav` (or wire ARIA + keys) |
| High | Spinners + slides            | `animate-spin` and `transition:slide`/`fade` ungated across both files (→S2) (`BriefsTab:356,592,606,626,662`; `SMS:179,226,227,234,254,275,356`)   | reduced-motion guards                           |
| Med  | Voice-narration toggle       | `focus:ring-2` (always-on, not `focus-visible`) + ungated checkmark/wrapper transitions (`BriefsTab:539,552,555`)                                   | `focus-visible:` + `motion-reduce:`             |
| Med  | "View All" vs refresh Button | Co-located link + Button, different markup/behavior; link has asymmetric `px-3 py-1.5` + no ring (→S3/S1) (`BriefsTab:592-596`)                     | Normalize; even padding; ring                   |
| Med  | SMS status / AI-pill color   | `accent` used for both "scheduled" state and "AI-generated" label (→S4) (`SMS:124-139,290`)                                                         | Split roles                                     |
| Med  | SMS event title              | No `truncate`/`min-w-0`; `Calendar` icon no `flex-shrink-0` (→S6) (`SMS:298-304`)                                                                   | `min-w-0 truncate` + `shrink-0`                 |
| Med  | SMS message body             | Full content, no `line-clamp`, bare `rounded` (→S5/S6) (`SMS:308-312`)                                                                              | `line-clamp-3` + `rounded-md`                   |
| Low  | Cancel-job button            | Bare `rounded` (→S5) + `p-1` ~24px target below 44px (`BriefsTab:648`)                                                                              | `rounded-md` + bigger target                    |
| Low  | SMS destructive confirm      | Native `confirm()` while BriefsTab uses `ConfirmationModal` — inconsistent (`SMS:88`)                                                               | Use `ConfirmationModal`                         |
| Low  | Briefs error text            | `truncate` in a `flex-shrink-0` box with no `max-w` — never engages (→S6) (`:681`)                                                                  | Add `max-w` or badge                            |

**Strengths:** consistent `rounded-lg` cards; Badge-variant-driven state color; uniform boxed `w-4 h-4`
icons with `flex-shrink-0`; `ConfirmationModal` for destructive brief actions; symmetric card padding.

### Surface 5 — Calendar tab

| Sev  | Region                     | Defect                                                                                                                           | Fix                                                  |
| ---- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| High | Working-days checkboxes    | `focus:ring` (always-on, not `focus-visible`), bare `rounded` (→S1/S5), and a stray newline inside the class string (`:686-687`) | `focus-visible:ring-2`, `rounded-md`, collapse class |
| High | Refresh icon-button        | Icon-only Button with empty children — verify it gets an `aria-label` (title alone may not map) (`:531-539`)                     | Explicit `aria-label="Refresh calendar"`             |
| Med  | Calendar-project nav cards | Primary nav cards with hover affordance but no `focus-visible` ring; broad ungated `transition-all` (→S1/S2) (`:955-957`)        | Ring + narrow/gated transition                       |
| Med  | Event-link anchors         | No `focus-visible` ring (→S1); `p-1.5` ~30px target below 44px (`:867-875`)                                                      | Ring + bigger target                                 |
| Med  | Decorative `Sun`           | `text-warning` with no warning semantics (→S4) (`:809`)                                                                          | `text-accent`/muted                                  |
| Med  | Page loader                | `animate-spin` ungated (→S2) (`:505`)                                                                                            | `motion-reduce:animate-none`                         |
| Low  | Eyebrow sizing             | `text-[0.65rem]` (`:565`) vs `text-xs` (`:947`) for the same eyebrow role                                                        | Standardize `text-xs`                                |

**Strengths:** strong alignment (`min-w-0` + `truncate`/`line-clamp-1` + `flex-shrink-0` icons on feature
and task rows); consistent `rounded-lg` cards; `divide-y` task list; `success` reserved for the connected
state; proper `fieldset`/`legend`; `rel="noopener noreferrer"` on external links.

### Surface 6 — Notifications tab

| Sev | Region           | Defect                                                                                                                                                      | Fix                       |
| --- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| —   | Composition only | This file owns no interactive markup; correctness depends on `NotificationPreferences`/`SMSPreferences`/`ScheduledSMSList` (audit those for rings/overflow) | Audit children separately |

**Strengths:** clean, decluttered composition; the duplicate SMS-fetch path was already merged into one
`loadSmsPreferences` fed to both children (exactly the rubric's "merge duplicate paths"); vertical rhythm
matches the other tabs; the Scheduled-SMS card is gated so it never flashes empty.

### Surface 7 — Agents (API keys) tab

| Sev  | Region                      | Defect                                                                                                                     | Fix                    |
| ---- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| High | Advanced-permissions toggle | Hover-only, no `focus-visible` ring — gates the entire write-op list (→S1) (`:1938-1942`)                                  | Add ring               |
| Med  | Form checkboxes/radios      | `focus:ring-accent` with no `ring-2`/width — no ring renders (→S1) (`:1912,1964,1988,2057`)                                | `focus-visible:ring-2` |
| Med  | Inline doc links            | `/docs/connect-agents` + `/integrations` hover-only, no ring (→S1) (`:1179,1803`)                                          | Add ring               |
| Med  | Caller metric badges        | Three read-only stats in three Badge colors (info/accent/default) (→S4) (`:1484-1490`)                                     | One neutral variant    |
| Med  | Caller action row           | Destructive **Revoke** co-located with safe actions, only color separates (→S3) (`:1541,1599-1607`)                        | `ml-auto`/divider      |
| Med  | Sub-section disclosures     | "Project Scope"/"Write Permissions" `<summary>` have no chevron while parent details do — read as static (`:1739,1771`)    | Add rotating chevron   |
| Low  | Code/`<pre>` panels         | Bare `rounded` (third radius) on every code surface (→S5) (`:1173,1202,1232,1264,1289,1535,2224,2284,2314,2343,2373`)      | `rounded-md`           |
| Low  | Inner-control padding       | Assorted asymmetric `px-3 py-2.5`/`px-2.5 py-1.5` + orphan `pt-2`/`pt-3` (`:1364,1905,1929,1960,1984,2053,1699,1738,1802`) | Even to `p-2.5`/`p-3`  |
| Low  | Magic width                 | `sm:max-w-[48%]` arbitrary fraction (`:1482`)                                                                              | Layout token           |

**Strengths:** **copy affordances are exemplary** — every copy button swaps to `Copied`/`CircleCheck` on a
2s timeout (`:1209-1218,1518-1532,2166-2174`); deliberate overflow handling (`break-all` on keys/prefixes,
`truncate` on handles, `overflow-x-auto whitespace-pre-wrap` code); revealed secret has correct contrast +
wrapping + show-once gating; solid alignment discipline (`shrink-0` icons/chevrons vs `min-w-0` labels);
clear active bundle state (`border-accent bg-accent/5`).

### Surface 8 — Billing tab

| Sev  | Region                  | Defect                                                                                                                                                              | Fix                               |
| ---- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| High | Invoice PDF affordances | Visually identical, behaviorally different: raw `<a target="_blank">` ("Download PDF") vs `<Button>` ("Generate PDF"); the anchor has no ring (→S3/S1) (`:145-163`) | Normalize to one component + ring |
| High | "Generate PDF" target   | `py-0` collapses a billing action below 44px (`:159`)                                                                                                               | Drop `py-0`; native `size="sm"`   |
| Med  | No-subscription block   | Hand-rolled card + hand-rolled `<a>` CTA instead of `SettingsCard`/`Button` — inconsistent radius/focus/motion (→S1/S2) (`:172-221`)                                | Use `SettingsCard` + `Button`     |
| Low  | Active-sub price row    | `justify-between flex-wrap` on a single child — dead layout intent (`:51`)                                                                                          | Drop the flex wrapper             |
| Low  | Plan-name title         | Piped into `SettingsCard title=` with no truncate guarantee at the call site (`:45`)                                                                                | Verify `SettingsCard` truncates   |

**Strengths:** disciplined `rounded-lg` everywhere (no drift); icons contained in fixed boxes
(`w-12 h-12` chip, `w-4 h-4 flex-shrink-0` checks); invoice row uses `min-w-0` left + `flex-shrink-0`
right to protect alignment; restrained color (`success` only on feature checks, `accent` only on actions);
clean `divide-y` payment list with intentional density.

---

## Part 3 — Recommended fix sequence (Hyperplexed order: one convention at a time)

Each step is a single convention that clears many table rows. Steps 1–2 also overlap with project-page
fixes already shipped — reuse those helpers rather than re-inventing.

1. **S1 — keyboard focus sweep.** One `focus-visible:ring-2 focus-visible:ring-accent` utility on every
   hand-rolled control; convert every `focus:ring-accent`-without-width and `focus:ring` to the
   `focus-visible` form. Knocks out the most High findings. **Highest leverage.**
2. **S2 — reduced-motion sweep.** Reuse `v2/board-a11y.ts: slideMotion` for the banners + slide/fade
   panels; `motion-reduce:animate-none` on every spinner; `motion-reduce:transition-none` on
   pressables/chevrons.
3. **Adopt `TabNav` for the ScheduledSMS filter tabs.** Replaces a hand-rolled tab group missing ARIA +
   keyboard with the page's already-correct primitive — one swap, one High cleared.
4. **S3 — separate co-located/destructive actions.** Normalize Billing PDF controls, Briefs View-All,
   and give AgentKeys Revoke spatial separation.
5. **S4 — color discipline.** Reserve `accent` for one role; `warning`/`destructive` for state only;
   collapse the AgentKeys metric badges.
6. **S5 + S6 — radius + overflow sweep.** `rounded` → `rounded-md` (esp. code panels); pair every
   `min-w-0` with `truncate`/`break-all`.
7. **Cleanups:** Contacts import-preview (`min-w` + sticky header + status color), Account password
   `pr-10`, Billing no-sub block → `SettingsCard`, sub-44px tap targets (cancel-job, calendar links).

---

## Part 4 — What this validates about the playbook (and the project audit)

- **The shared-primitive vs hand-rolled split is the real story.** `TabNav` passes the 2026
  accessibility bar cleanly; the controls _inside_ each tab regress from it. The rubric caught this by
  grading region-by-region rather than trusting "we have a tab component, so tabs are fine."
- **The systemic patterns are cross-surface, not per-page.** S1 (focus rings), S2 (reduced-motion),
  S3 (co-located behaviors), S4 (color-for-state), S5 (radius) are the _same_ findings as the project
  page. That's the strongest argument for fixing them as **app-wide conventions / shared utilities**,
  not per-component — exactly the Hyperplexed "fix it once as a rule" method.
- **Limitation confirmed (same as project audit):** structural taste (focus, motion, radius, overflow,
  alignment, behavior-legibility) is high-confidence from markup; the color calls (S4 accent double-duty,
  the `text-warning` Sun, import-status contrast) are _suspected_ and want a live dark-mode screenshot
  pass to confirm.

---

## Part 5 — Fixes applied (2026-06-26)

Full polish pass shipped across the shell + all eight tabs. `svelte-check` clean (0 errors / 0 warnings);
ESLint clean on the touched files (only three pre-existing unused-var warnings, untouched). The
project-page `board-a11y.ts` helpers were reused, with one addition (`fadeMotion`) for fade transitions.

**Systemic (Part 1) — all six addressed:**

- **S1** ✅ Keyboard focus sweep. Added the shared `focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-ring focus-visible:ring-inset` to: password show/hide toggles + clear-username
  (Account), CSV file input (Contacts), the three OptionCard grids (Preferences), invoice PDF links +
  upgrade CTA (Billing), View-All + voice toggle (Briefs), the advanced-permissions toggle + 4
  checkboxes/radios + 2 inline doc links (AgentKeys), working-days checkboxes + event links + project
  nav cards (Calendar). Converted every `focus:ring-accent`-without-width and always-on `focus:ring` to
  the `focus-visible` form.
- **S2** ✅ Reduced-motion sweep. Page-shell banners + Briefs/SMS slide/fade panels now use
  `slideMotion()`/`fadeMotion()`; `motion-reduce:animate-none` on every standalone spinner (incl. the
  shared `Button` loading spinner, so it propagates app-wide); `motion-reduce:transition-none` on
  pressables/chevrons/toggles touched.
- **S3** ✅ Co-located behaviors separated. Billing invoice PDF controls normalized to one shared link
  style (dropped the `<a>`-vs-`Button` divergence + the `py-0` collapse); Briefs View-All padding
  evened; AgentKeys **Revoke** pushed to its own end of the row with `ml-auto`.
- **S4** ✅ Color discipline. SMS "scheduled/pending" status moved off `accent` → `info` (accent no
  longer collides with the AI-generated pill); AgentKeys three read-only metric badges unified to one
  `default` variant; Calendar decorative `Sun` `text-warning` → `text-accent`.
- **S5** ✅ Radius locked. Bare `rounded` → `rounded-md` on the SMS message body, Briefs cancel-job
  button, Calendar working-days checkbox, and all 11 AgentKeys code/`<pre>` surfaces.
- **S6** ✅ Overflow completed. `truncate` paired with the existing `min-w-0` on Contacts contact rows
  and the SMS event title (+ `flex-shrink-0` on its icon); `break-all` on the Account public-URL token;
  `max-w` so the Briefs error `truncate` engages; `line-clamp-3` on the SMS message body.

**Cleanups (Part 2):** ScheduledSMS filter tabs replaced with the shared `TabNav` (gains full ARIA +
arrow-key roving + focus + reduced-motion); native `confirm()` for SMS cancel replaced with
`ConfirmationModal` for parity; Contacts import-preview gained `min-w-[640px]` + `sticky` header +
state-colored/humanized status & action cells; Account password inputs reserve `pr-10`; Billing
single-child price flex unwrapped; template-modal `<pre>` stray-indentation collapsed; banner icons given
`flex-shrink-0`; Calendar "Calendar Features" eyebrow normalized to `text-xs`; Calendar refresh
icon-button given an explicit `aria-label`.

**Deferred (lower-value / needs live screenshots):** the assorted AgentKeys asymmetric-padding even-out
and the `sm:max-w-[48%]` magic-width nitpick; the Billing no-subscription hero was kept as a bespoke
card (declined the `SettingsCard` wrap — a centered upgrade hero is a legitimately different component
than a titled settings card) with only its CTA focus/motion fixed. Next step: the live dark-mode
screenshot pass to confirm the S4 color calls and SMS `info` status contrast.

---

## Part 6 — Deep mobile pass (2026-06-28)

A second, **mobile-specific** audit of the _entire_ page (all tabs + their child components +
modals), against a phone rubric the static taste pass doesn't cover: **iOS input-zoom (font-size
<16px), real touch-target sizes, horizontal overflow from grids/flex/tables, modal sizing/scroll, and
duplicate DOM ids.** This caught real bugs, not just polish. `svelte-check` clean (0/0); ESLint clean
(only pre-existing unused-var warnings).

**Mobile bugs fixed (these were genuine defects, not taste):**

- **M1 — iOS input zoom (HIGH).** Two text-entry fields rendered at 14px, which auto-zooms the viewport
  on focus in iOS Safari: the Account username raw `<input>` (`text-sm` → `text-base` + `min-h-[44px]`)
  and the template-editor `<Textarea>` (`text-sm` → `text-base sm:text-sm`). _Every other input on the
  page already routes through `TextInput`/`Textarea` at `size="md"` = 16px, so the rest was clean._
- **M2 — duplicate DOM ids (HIGH).** `quiet-start`/`quiet-end` were used by **both**
  `NotificationPreferences` and `SMSPreferences`, which render on the same Notifications tab — so a
  `<label for>` tap could focus the wrong (offscreen) component's input. Namespaced to
  `nf-quiet-*` / `sms-quiet-*`.
- **M3 — button row overflow at 320px (HIGH).** SMSPreferences' Save / Opt-Out row had no `flex-wrap`
  and overflowed on an iPhone SE. Added `flex-wrap gap-3`.
- **M4 — horizontal overflow from long tokens.** SMS message body (`line-clamp-3` only bounds height)
  and the template preview `<pre>` could be blown out by a long unbroken URL/token → added
  `break-words`. AgentKeys env/bootstrap-URL `<pre>` blocks gained `whitespace-pre-wrap` for parity.

**Touch targets brought to ~44px:** all 9 notification/SMS toggle switches (`w-11 h-6` track → label
`min-h-[44px]`, track stays centered); Account password show/hide toggles (now full input-height tap
strips); Calendar working-days checkboxes + scheduled-task external link; Briefs View-All link; Billing
PDF links; the shared `Modal` close button (`h-7` → `h-9`); AgentKeys nested disclosure summaries +
advanced-permissions toggle; SMS lead-time `<select>`; Contacts CSV file button + Edit/Archive gap
(`gap-1.5` → `gap-2`).

**Other mobile fixes:** `TabNav` now `scrollIntoView`s the active tab (a deep-linked `?tab=billing`
no longer loads off-screen in the scroll strip); `SettingsCard` title now `truncate`s (fixes the
connected-calendar email forcing the header wide — handled at the shared-component level rather than
per-tab); ScheduledSMS timing row `flex-wrap` + header `min-w-0`/`shrink-0`; Briefs preview `Clock`
`flex-shrink-0`; AgentKeys Revoke `ml-auto` → `ml-0 sm:ml-auto` so it doesn't strand on a wrapped
mobile row; AgentKeys setup `<pre>` `text-[0.7rem]` → `text-xs`; template-modal action bar made
`sticky bottom-0` so Cancel/Save stay reachable below a tall textarea.

**Confirmed already-correct for mobile (no change needed):** the shared `Modal` is genuinely
hardened — `100dvh` + `env(safe-area-inset-*)` max-height, `visualViewport` keyboard avoidance,
internal scroll with a sticky `flex-shrink-0` footer, full-width on small screens, body-scroll-lock +
`overscroll-contain`. `ConfirmationModal` stacks buttons `flex-col sm:flex-row` full-width. The
`PhoneVerification` OTP flow is exemplary (18px code input + `inputmode="numeric"` +
`autocomplete="one-time-code"`). All form grids use a `grid-cols-1` base. Every primary Save button is
bottom-aligned (good thumb reach), none top-right.

**Deferred:** a `TabNav` right-edge scroll-fade affordance (the `scrollIntoView` + cut-off edge cover
discoverability; a global always-on fade risks regressing 2-tab bars elsewhere); collapsing the very
tall AgentKeys Key-Created modal's advanced sections behind `<details>` (usable today via internal
scroll + sticky footer). Both want the live-device pass to prioritize.

> **Method note:** still a static audit (markup + responsive classes + known iOS behaviors). The two
> things only a real device confirms: wrap behavior of the dense AgentKeys 5-button action row, and the
> Contacts import-table horizontal scroll. Those remain the top candidates for a live mobile glance.
