<!-- .claude/skills/hyperplexed-audit/references/audit-examples/AGENT_CHAT_MODAL_AUDIT_2026-06-28.md -->

# AgentChatModal — Hyperplexed Design Audit

> Region-by-region audit of the agentic-chat modal surface against the
> [Hyperplexed Design Playbook](../playbook.md). Captured 2026-06-28.
>
> **Method (playbook §0.1):** enumerate surfaces, then go region by region. `AgentChatModal.svelte`
> is an _orchestrator_ — the visible surface is rendered by its children. This audit grades the full
> rendered experience, not just the shell file.
>
> **Scope:** `AgentChatModal.svelte` (shell + loading/error/automation-footer markup) and the primary
> child regions it composes: `AgentChatHeader`, `AgentChatActivityTabs`, `AgentMessageList`,
> `AgentComposer`, `AgentRunDock`.

---

## Verdict

The surface is already in good shape: truncation discipline is excellent, the script half is cleanly
decomposed into controllers (stream / voice / prewarm / attachments / shellRouter / sse-handler /
presenter), the tablist has correct roving-tabindex, and the signature moments (title glimmer,
`bubble-send`, `collapseX`) are tasteful and reduced-motion-gated. It is **not broken anywhere**.

What it lacks is **token discipline**. The same atoms — the uppercase micro-label, the tiny caption
size, the corner radius — are expressed several slightly-different ways across the six regions, which
is exactly the class of defect Hyperplexed's eye catches first ("alignment is sacred"; "consistent
corner-radius language"; centralize so a value "lives in one place"). None of these are visible as a
single screenshot bug; together they're why a surface reads as "fine" instead of "Linear-tier."

The fixes are almost all **find-and-replace consolidations**, not redesigns.

---

## Status

- **Tier 0 — SHIPPED 2026-06-29** across the six audited region files + the global `.micro-label`
  source. Details per item below.
- **Tier 0.5 (adjacent files) — SHIPPED 2026-06-29.** Same sweep applied to `ThinkingBlock`,
  `WorkPanel`, `ProjectFocusSelector`, `ProjectActionSelector`, `ProjectEntityList`. One deliberate
  carve-out: the bare `rounded` (0.25rem) state/priority badges in `ProjectEntityList` were left
  as-is (outside the four documented transforms) — see "Adjacent follow-up".
- **Tier 2 · T2-2 (mobile-menu keyboard/Escape) — SHIPPED 2026-06-29.** Escape closes + returns focus
  to the trigger; arrow/Home/End roving across menu items; first item focused on open.
- **T1-6 (AgentRunDock off-house styling) — found already fixed as of 2026-07-01** (not attributed to
  a dated pass in this doc). Rows are now `rounded-lg` + `.pressable`, matching the timeline/suggestion
  card family. No further action.
- **T1-1, T1-3, T1-5 — SHIPPED 2026-07-01.** Panel header `px-4 py-2` → `px-3 py-2 sm:px-4` (matches
  tab strip/body edge); `ArrowLeft` `strokeWidth={2.5}` override dropped (matches default-weight icons
  app-wide); composer footer bottom padding floored to `pb-[max(0.75rem,...)]` (matches the `pt-3` top).
  Verified: Prettier clean; scoped `svelte-check` clean on the three touched files (a full-repo
  `svelte-check` run hit an unrelated esbuild/Go crash in this environment, unconnected to these
  one-line class edits).
- **T1-2, T1-4, T2-1 — SHIPPED 2026-07-01.**
  - T1-2: status pills (`sessionStatusLabel`, `contextUsageCounter`, `ONTO`) now share `h-7` (padding
    changed from `py-1.5` to height-driven); the activity dot moved into a fixed `h-4 w-4`
    flex-centered box so it can no longer float relative to its neighbors.
  - T1-4: desktop `Steps` + `Support` buttons replaced with a single `Export ▾` menu
    (`aria-haspopup="menu"`, click-away backdrop, Escape-to-close + focus return, arrow/Home/End
    roving — same contract as the existing mobile "..." menu, built by duplicating that pattern
    rather than sharing state across two triggers that are never open at once). `View` and the audit
    actions stay always-visible chrome, unchanged. The mobile "..." menu's own `Export steps` /
    `Export support packet` rows are untouched (still needed since the desktop button is
    `hidden` below `sm`).
  - T2-1: decision made — gate **every** `animate-spin` / `animate-pulse` on this surface with
    `motion-reduce:animate-none`, matching the established in-repo model
    (`ui/Button.svelte`'s spinner, per fix-patterns P11) rather than carving out an "essential
    loading spinner" exception. Applied to `AgentChatHeader` (session-status spinner, header-action
    spinners ×2, activity pulse dot), `AgentRunDock` (both `iconFor` spinner variants), and
    `AgentComposer` (attachment hashing/uploading/processing spinner). The one already-gated
    full-pane session spinner in `AgentChatModal.svelte` was left as-is (already correct).
- **T2-3 — half-shipped 2026-07-01.** Column minimums in `AgentMessageList.svelte` now scale with
  viewport (`clamp()` instead of fixed `rem` floors: general cells `clamp(4.5rem,24vw,7rem)`, first
  column `clamp(6rem,32vw,14rem)`, second column `clamp(7rem,38vw,18rem)`), and the blanket
  `min-width: 46rem` table floor was removed, so a narrow 2-column table no longer forces the same
  scroll as a wide one. **Not done:** the "visible scroll-edge affordance." The scroll container is
  `.agent-markdown` itself (`overflow-x-auto` on the whole message body, not a table-specific
  wrapper), and it renders inside differently-colored bubbles (user vs. assistant vs. system), so a
  background-matched scroll-shadow risks a color mismatch that can't be confirmed without a live
  render pass in this environment. Left as an explicit open item rather than shipped-unverified —
  needs either a dedicated table-wrapper (rehype plugin) or a live design pass to pick a safe
  affordance.
- Verified (T1-2/T1-4/T2-1/T2-3): Prettier clean; app-wide `svelte-check --diagnostic-sources svelte`
  clean (0 errors, 1 pre-existing unrelated warning on `onboarding/+page.svelte`). Full TS-inclusive
  `svelte-check` OOMs in this environment independent of these changes (confirmed it did so before
  this pass too) — not a signal on these edits specifically.

---

## Tier 0 — Token consolidation (highest leverage, lowest risk) — ✅ SHIPPED

These are the "make it consistent" sweeps. Each is a recurring complaint in the playbook's taste
checklist (§1).

### T0-1 · The micro-label is defined three different ways

The 0.65rem uppercase tracked label is the single most-used atom on this surface, and it exists as:

1. **A global class** — `.micro-label` (`src/lib/styles/inkprint.css:531`): `0.65rem` / uppercase /
   `0.15em` / muted-foreground.
2. **A redundant local clone** — `.agent-micro-label` (`AgentChatModal.svelte:2483`): same values plus
   `line-height: 1.1`. Its own comment says it's "centralized here so the size lives in one place" —
   but a global already existed, so this _de_-centralized it.
3. **Inlined longhand** — `text-[0.65rem] font-semibold uppercase tracking-[0.15em]` appears **19×**
   across `AgentChatHeader`, `AgentMessageList`, and the modal.

**Fix:** delete `.agent-micro-label`; fold its `line-height` into the global `.micro-label` (or a
`.micro-label--tight` modifier); replace the 19 inline longhands with `micro-label`. One atom, one
definition. (`AgentChatHeader.svelte:274` already uses the global `.micro-label` — it's the only place
that got it right.)

### T0-2 · Letter-spacing drifts on the same label scale

Counts in the agent dir for what is visually the _same_ uppercase micro-caps element:

| tracking            | uses |
| ------------------- | ---- |
| `tracking-[0.15em]` | 19   |
| `tracking-[0.12em]` | 18   |
| `tracking-[0.1em]`  | 7    |
| `tracking-wide`     | 7    |

Four tracking values for one element. `AgentChatActivityTabs` leans on `0.12em`, the header/modal on
`0.15em`, message avatars on `0.1em`. **Fix:** standardize uppercase micro-labels to a single tracking
(recommend `0.15em`, matching the global class) and drop the rest. Folds into T0-1 once the class is
shared.

### T0-3 · Seven near-identical tiny font sizes

Between 0.6rem and 0.72rem the dir uses: `text-[0.65rem]` ×51, `text-[11px]` ×10, `text-[10px]` ×9,
`text-[0.7rem]` ×8, `text-[0.68rem]` ×7, `text-[0.6rem]` ×3, `text-[0.72rem]` ×1.

`11px ≈ 0.6875rem`, `0.68rem`, `0.7rem` are indistinguishable on screen but defeat a readable type
scale (playbook §1 "Hierarchy & grouping": differentiate with a real scale, not noise). **Fix:**
collapse to a 2-step caption scale — `0.65rem` (micro-label / timestamps) and `0.7rem` (secondary
body) — and migrate the strays. `AgentRunDock`'s `text-[11px]` (line 107) is the clearest outlier.

### T0-4 · Corner-radius language is inconsistent

Radii in the dir: `rounded-lg` ×88, `rounded-md` ×32, `rounded-full` ×28, `rounded-xl` ×6,
`rounded-sm` ×1. Playbook §1: _"Don't round most components and leave one square."_ Specific tells:

- **Containers split lg/xl.** The drop overlay, attachments tray, and existing-image picker use
  `rounded-xl` (`AgentComposer.svelte:223,236`; `AgentChatModal.svelte:2161`) while every other
  card — empty state, message bubbles, error card, automation footer — uses `rounded-lg`.
- **`AgentRunDock` rows use `rounded-md`** (line 102) while every other list row (timeline articles,
  suggestion buttons, message bubbles) uses `rounded-lg`.

**Fix:** lock a 3-tier radius language — container = `rounded-lg`, pill/chip = `rounded-full` (or
`rounded-md`, pick one), input = `rounded-lg` — and reconcile the `xl` trays + `md` dock rows to it.

---

## Tier 1 — Region alignment & density

### T1-1 · Tab strip ↔ panel header left-edge misalignment (mobile)

`AgentChatActivityTabs`:

- Tab strip: `px-3 py-2 sm:px-4` (line 141)
- Panel header: `px-4 py-2` — **no `sm:` variant, so `px-4` on mobile too** (line 188)
- Panel body: `px-3 py-3 sm:px-4` (line 207)

On mobile the panel header indents `1rem` while the strip and body indent `0.75rem`, so the "Agent
steps / N entries" row hangs 4px right of everything above and below it. This is precisely Hyperplexed's
#1 instinct (alignment to a shared edge). **Fix:** `px-3 sm:px-4` on the panel header.

### T1-2 · Header right-cluster has mixed pill heights

The right cluster mixes fixed-height and padding-height controls in one baseline row
(`AgentChatHeader.svelte:241–437`):

- `sessionStatusLabel`, `contextUsage`, `ONTO` pills: height-implicit (`py-1.5`, no fixed height)
- `View` / `Steps` / `Support` buttons: `h-7`
- activity dot: bare `h-1.5 w-1.5` with no container

Different intrinsic heights → subtle vertical drift across the cluster (playbook §1: "a label must
never knock its icon out of alignment"; "keep icons inside a fixed container so layout never depends on
icon size"). **Fix:** give the status pills a shared `h-7` and center the activity dot inside a fixed
`h-7 w-7` (or `h-4 w-4`) box so it can't float.

### T1-3 · Back-arrow stroke weight is heavier than every other icon

`ArrowLeft` uses `strokeWidth={2.5}` (`AgentChatHeader.svelte:186`); all other lucide icons on the
surface use the default (~2). Playbook §1: "Icons: one uniform set… thin, consistent style." **Fix:**
drop the override (or apply the same weight everywhere, deliberately).

### T1-4 · Desktop header action density

On desktop the right side shows `View` + `Steps` + `Support` as three visually-identical ghost buttons,
then audit actions, then close. `Steps` and `Support` are both _exports_. Playbook §1: "Reduce
competing/redundant elements"; "Merge duplicate paths." The **mobile** header already does this right —
it folds all three behind a single `…` menu. **Fix:** mirror that on desktop with a single `Export ▾`
split/menu, leaving `View` + close as the only always-visible chrome.

### T1-5 · Composer footer has asymmetric vertical padding

`AgentChatModal.svelte:2157`: `pt-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]`. On non-notch devices
top = `0.75rem`, bottom = `0.5rem`. Playbook §1: "The spacing… is different on each side is an instant
tell." **Fix:** floor the bottom at the top value — `pb-[max(0.75rem,env(safe-area-inset-bottom))]`.

### T1-6 · AgentRunDock reads as a different hand

Beyond the radius (T0-4) and size (T0-3) strays, the dock uses `bg-muted/30` and
`hover:shadow-ink transition-shadow` with **no `.pressable`**, unlike every other interactive row on
the surface (`AgentRunDock.svelte:85–111`). It's stylistically off-house. **Fix:** bring it to house
style — `rounded-lg`, `.pressable`, the shared caption size — so it sits in the same visual family as
the timeline cards and suggestion buttons.

---

## Tier 2 — Motion & accessibility

### T2-1 · Reduced-motion is gated inconsistently

Only **1 of 17** `animate-spin` uses carries `motion-reduce:animate-none` (the full-pane session
spinner, `AgentChatModal.svelte:2061`). The header `LoaderCircle`, the run-dock `queued` spinner, and
the attachment hashing/uploading spinners all spin regardless. The header `animate-pulse` activity/
success dots are also ungated. Playbook §2: "Respect `prefers-reduced-motion`."

This is a _consistency_ flag more than a hard bug — a loading spinner is arguably essential motion. But
the current state looks like an _incomplete_ decision (one got gated, sixteen didn't), not a deliberate
one. **Fix:** decide once — keep essential loading spinners, gate the decorative `animate-pulse`
dots — and apply it uniformly. (`.pressable` is already gated app-wide at `inkprint.css:706`, so press
feedback is fine.)

### T2-2 · Mobile overflow menu lacks keyboard/escape affordances — ✅ SHIPPED 2026-06-29

`AgentChatHeader.svelte:353–420`: the `…` menu opens with `role="menu"` and a click-away backdrop, but
has **no Escape-to-close, no focus return, and no arrow-key roving** between items. Playbook §2 weights
keyboard operability heavily ("operate this entire flow via my keyboard"). **Fix:** close on Escape,
return focus to the trigger, and support Up/Down within the menu.

### T2-3 · Markdown tables force horizontal scroll unconditionally

`AgentMessageList.svelte` styles tables with `min-width: 46rem` and per-column minimums of `14rem` /
`18rem` (lines 624–655). Inside an 85%-width bubble, _every_ table — even a 2-column one — overflows and
scrolls. Playbook §1: "Make scrollability obvious… a cut-off edge clearly signals 'more.'" Today the
overflow is silent. **Fix:** make column minimums responsive (or drop the blanket `46rem` for small
tables) and add a visible scroll-edge affordance so the cut-off reads as intentional.

---

## What's already right (keep it)

- **Truncation everywhere** — `truncate` / `min-w-0` discipline across header, tabs, timeline, dock.
  Playbook §1 "overflow is explicit" is satisfied.
- **Roving-tabindex tablist** — `AgentChatActivityTabs` implements WAI-ARIA tab keyboarding correctly.
- **Signature delight, gated** — the title glimmer, `bubble-send`, and `collapseX` all have
  `prefers-reduced-motion` fallbacks (playbook §2 "keep the moment, drop the movement").
- **Safe-area handling** — thorough `env(safe-area-inset-*)` + keyboard-avoiding logic.
- **Restrained palette** — single accent, semantic destructive/warning/success, textures as accent.

---

## Suggested sequencing

1. **T0-1 → T0-4 first.** They're mechanical, low-risk, and remove ~80% of the inconsistency. Do them
   as one "token sweep" PR.
2. **T1-1, T1-3, T1-5, T1-6** next — small, objective alignment/consistency fixes.
3. **T1-2, T1-4** — touch layout/IA, worth a quick design check before building.
4. **T2-1 → T2-3** — a11y/motion pass; T2-2 is the only one with real keyboard-correctness stakes.

Cross-reference `DESIGN_AUDIT_2026-06-12.md` and `MOBILE_EXPERIENCE_AUDIT_2026-06-12.md` so the radius/
spacing fixes here don't re-litigate decisions already tracked there.

---

## Adjacent follow-up (Tier 0.5) — ✅ SHIPPED 2026-06-29

The four documented transforms (`.micro-label` consolidation, `text-[11px]/[10px]/0.6rem/0.68rem/0.72rem`
→ the 2-step `0.65`/`0.7` scale, `rounded-xl → rounded-lg`, `tracking-wide/wider/normal → 0.15em` on
uppercase labels) were applied to `ThinkingBlock`, `WorkPanel`, `ProjectFocusSelector`,
`ProjectActionSelector`, and `ProjectEntityList`. The agentic-chat surface is now token-consistent
end to end.

**Deliberate carve-outs (left as-is, by design):**

- **`ProjectEntityList` state/priority/impact badges** keep their bare `rounded` (0.25rem) radius. They
  are `capitalize` value chips (not uppercase labels), and bumping bare `rounded → rounded-md` is a 5th
  transform outside the documented sweep. Their `text-[10px]` was still normalized to `text-[0.65rem]`.
  If we want a fully-locked radius language, fold these into the `rounded-md` small-chip tier in a
  follow-up — but that's a new decision, not part of this sweep.
- **`ThinkingBlock` font-mono header** keeps `tracking-normal` — the monospace activity log is a
  deliberately distinct lane (same call as the mono timestamps in `AgentMessageList`).
