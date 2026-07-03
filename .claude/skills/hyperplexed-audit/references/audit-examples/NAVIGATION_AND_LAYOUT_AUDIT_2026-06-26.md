<!-- .claude/skills/hyperplexed-audit/references/audit-examples/NAVIGATION_AND_LAYOUT_AUDIT_2026-06-26.md -->

# App Shell — Navigation & Layout — Hyperplexed Design Audit

> Live application of the [Hyperplexed Design Playbook](../playbook.md) to the
> **global app shell**: the top navigation, the root layout (page frame + banners), and the footer —
> on **desktop and mobile**. This is the surface every page inherits, so findings here propagate app-wide.
>
> Surfaces:
>
> - `apps/web/src/lib/components/layout/Navigation.svelte` (top nav, mobile drawer, user menu)
> - `apps/web/src/routes/+layout.svelte` (page frame, skip-link, trial/payment/frozen banners, view transitions)
> - `apps/web/src/lib/components/layout/Footer.svelte` (auth + guest footers)
>
> Method: audited Hyperplexed-style — **region by region, top to bottom** — grading rendered markup
> against the §1/§2 rubric. Captured 2026-06-26.
>
> **Scope caveat:** static markup audit (DOM + Tailwind/Inkprint classes), not a screenshot pass.
> High confidence on structure (alignment, padding symmetry, focus rings, motion gating, icon-set
> uniformity, thumb ergonomics). Dark-mode color/contrast wants a live pass.
>
> **Cross-reference:** the prior page audits (project, projects-list, dashboard, history, profile) locked
> four conventions that this audit re-applies to the shell: the **two-radius rule** (`rounded-lg`
> containers, `rounded-md` inner controls), the **one-`focus-visible`-ring sweep**, **`motion-reduce:`
> gating**, and **lucide-only icons**. The shell predates most of them.

---

## The headline: the shell is mostly clean — and the shared `Button` is the model

Two things are genuinely good and should be cited as the in-repo bar:

1. **`ui/Button.svelte` is exemplary.** It ships `focus:outline-none focus-visible:ring-2`, a proper
   focus-ring offset (`button:focus-visible { --tw-ring-offset-color: … }`), a real
   `@media (prefers-reduced-motion: reduce)` block, and `animate-spin motion-reduce:animate-none` on its
   loader. **Every Button-wrapped nav control inherits all of this for free** — the chat launcher, the
   mobile-menu toggle, the user-menu trigger, and Sign out are already focus-ring- and reduced-motion-clean.
2. **The mobile drawer's a11y is done right** — focus trap (`handleMobileMenuKeydown`), ref-counted body
   scroll lock, `role="dialog"`/`aria-modal`, and focus-restore to the hamburger on close. That's the hard
   part, and it's done. The hide-on-scroll-down / show-on-scroll-up nav is also a textbook Hyperplexed
   "kill unnecessary vertical space" move for phones.

So the defects cluster on the **raw elements the Button component doesn't cover** (plain `<a>` nav links,
dropdown items, the onboarding CTA) and on **two structural width/ergonomics decisions** that reshape every
page. The systemic patterns are the _same four the page audits already named_ — S3 (focus rings), S5
(reduced-motion), N1 (icon set), plus one genuinely new shell-level finding: **A1, three competing
max-width systems break the page's left edge** (Hyperplexed's #1 instinct).

---

## Part 1 — Systemic patterns (same rules as the page audits; apply to the shell)

### A1. ⛔ Three max-width systems stack on the shell → the page's left edge never aligns _(highest leverage)_

**Rubric:** Alignment & geometry — _"Alignment is sacred — his #1 recurring complaint."_

Four full-width regions are stacked vertically (nav → banners → main → footer), and they use **three
different container widths and two different padding scales**:

| Region                       | Container            | Padding                        | Ref                      |
| ---------------------------- | -------------------- | ------------------------------ | ------------------------ |
| Top nav                      | `max-w-7xl` (1280px) | `px-2 sm:px-4 lg:px-6 xl:px-8` | `Navigation.svelte:458`  |
| Trial/payment/frozen banners | `container mx-auto`  | `px-3 sm:px-6 lg:px-8`         | `+layout.svelte:886,894` |
| Main content                 | `max-w-[1200px]`     | `p-px` (≈0)                    | `+layout.svelte:281`     |
| Footer                       | `max-w-7xl` (1280px) | `px-4 sm:px-6 lg:px-8`         | `Footer.svelte:88`       |

Because the content column is `max-w-[1200px]` while the nav/footer are `max-w-7xl` (1280px), the **left
edge of page content sits ~8px inside the nav's logo/links** at the 1280 breakpoint (and the offset shifts
with the mismatched padding scales at every other breakpoint). The banners introduce yet a third edge. The
net effect is exactly the defect Hyperplexed flags first: elements that _should_ share a vertical edge don't.

**Fix (structural — needs an owner decision):** pick one shell width + one padding scale and apply it to
nav, banners, main, and footer so every region shares a left/right edge. Candidates: keep the narrower
`max-w-[1200px]` reading column and narrow the nav/footer to match, **or** widen content to `max-w-7xl`.
This is a global visual change (content column gets wider or chrome gets narrower), so it's flagged for
decision, not silently changed. **This is the single highest-impact Hyperplexed fix on the shell.**

### S3. `focus-visible` rings are missing on the **raw `<a>`/`<button>`** elements (Button-wrapped ones are fine)

**Rubric:** Motion & A11y — _"operate this entire flow via my keyboard."_

`Button.svelte` already rings correctly, and `Footer.svelte` adds its own `a:focus-visible` outline in a
scoped `<style>` block — but **`Navigation.svelte` has no such global focus style**, so its plain elements
get only the browser default (or nothing, where `outline-none` leaks in). Offenders:

- Desktop nav links (`Navigation.svelte:520`) and mobile nav links (`:1026`)
- All user-dropdown `<a>` items — Profile, Notifications, agent CTA, invites, billing, admin (`:790–884`)
- The dropdown theme-toggle `<button onclick={toggleMode}>` (`:886`) and the mobile one (`:1175`)
- Onboarding CTA `<a>` — desktop (`:662`) and mobile (`:1001`)
- Non-auth header links (`:555–557`), the non-auth theme toggle (`:928`), and Log in / Start-in-chat (`:939,945`)

**Fix:** mirror the Footer pattern — a scoped `a:focus-visible` / `button:focus-visible` outline in
`Navigation.svelte`'s `<style>`. Svelte style scoping keeps it off the child `Button`'s internal `<button>`,
so there's no double-ring. One block, covers every raw element.

### S5. `prefers-reduced-motion` is **never** gated in the shell

**Rubric:** Motion & A11y — respect reduced-motion.

None of the three shell files import a reduced-motion guard, and the Button's reduced-motion block only
covers _Button-rendered_ elements + their `transition`s — it does **not** cover keyframe `animate-*`
utilities applied to raw elements. Ungated motion:

- Nav hide-on-scroll slide — `transition-all duration-200` + `-translate-y-full` (`Navigation.svelte:454`)
- `animate-pulse-glow` onboarding CTA (`:668,1006`); `animate-pulse-accent` loading state (`:170`)
- `animate-pulse` — loading nav link (`:528,1034`), zap glow (`:631`), onboarding dot (`:1066`)
- `animate-spin` — raw LoaderCircles (`:674,1011`)
- `animate-ink-in` — user dropdown (`:760`) and mobile drawer (`:989`)
- **View Transitions** in `+layout.svelte` `onNavigate` (`:744`) fire `document.startViewTransition`
  **unconditionally** — page-morph animations run even for reduced-motion users.

**Fix:** `motion-reduce:animate-none` on the keyframe animations, `motion-reduce:transition-none` on the
hide-on-scroll slide, and a `matchMedia('(prefers-reduced-motion: reduce)')` early-return in the
`onNavigate` view-transition hook.

### N1. Mixed icon sets — two hand-rolled credit-card SVGs amid an all-lucide nav

**Rubric:** Color & Icons — _"one uniform icon set."_

The nav imports ~18 lucide icons, then hand-rolls a raw `<svg>` credit-card glyph for the billing link in
**both** the desktop dropdown (`Navigation.svelte:855–867`) and the mobile menu (`:1146–1158`). These render
at a different stroke weight than the lucide set inches away and bypass the `lib/icons/lucide.ts` alias.
`CreditCard` already exists in the alias — swap both. (Cheap, high "polish" signal; the exact N1 recurrence
from the projects-list audit.)

### S4. Minor radius drift below the two-radius rule

**Rubric:** Geometry — `rounded-lg` containers, `rounded-md` inner controls.

Low-severity drift: the onboarding CTA (`:666,1004`), the non-auth Log in / Start-in-chat links
(`:940,945`), and the non-auth theme toggle (`:930`) are inner controls but use `rounded-lg`. The user
dropdown (`rounded-lg`, `:760`) and drawer are containers — correct. Not worth a sweep on its own; fold in
opportunistically. Nav links and the icon buttons already use `rounded-md` correctly.

---

## Part 2 — Per-region findings

Severity: **High** = breaks alignment/behavior-legibility or blocks keyboard use · **Med** = polish gap ·
**Low** = nitpick. Items folded into A1/S3/S4/S5/N1 are tagged, not repeated.

### Region 1 — Top nav bar (desktop)

| Sev | Region           | Defect                                                                                                                                                                    | Fix                                        |
| --- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Med | Nav links        | No `focus-visible` ring (→S3)                                                                                                                                             | Scoped focus style                         |
| Low | Active treatment | Active = `text-accent bg-muted` + underline bar — distinct from the toggle/inbox accent treatments, but they're different control _types_ (link vs button), so acceptable | Leave; it reads as a clear tier            |
| Low | Chat launcher    | Stacks **four** identical `brain-bolt.webp` `<img>`s for light/dark × default/hover crossfade (`:599–621`) — heavy markup, 1 asset loaded 4×                              | Collapse to 1–2 imgs + CSS, or `<picture>` |

**Strengths:** `min-w-0` + `flex-shrink-0` discipline; responsive label truncation (`hidden lg:inline`
full label / first-word on `lg:hidden`); the active underline reveals without layout shift; logo bloom is a
tasteful single signature accent.

### Region 2 — Right-side control cluster

| Sev | Region         | Defect                                                                                    | Fix                                                      |
| --- | -------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Low | Inbox/Work btn | `transition-all duration-200` ungated (→S5); active = `border-accent/50 text-accent` tint | `motion-reduce:` (Button-class controls already covered) |
| Low | Onboarding CTA | `animate-pulse-glow` ungated (→S5); `rounded-lg` inner control (→S4); no focus ring (→S3) | `motion-reduce:` + ring                                  |

**Strengths:** the "N agents working" badge is kept _in flow_ (won't clip against the nav edge — the
comment even says so); icon-only buttons are fixed `h-9 w-9` containers so layout never depends on glyph
size (textbook Hyperplexed "contain the icon"); Button-wrapped controls inherit focus + reduced-motion.

### Region 3 — User dropdown menu

| Sev | Region         | Defect                                                                  | Fix                          |
| --- | -------------- | ----------------------------------------------------------------------- | ---------------------------- |
| Med | Billing icon   | Hand-rolled credit-card `<svg>` (→N1)                                   | lucide `CreditCard`          |
| Med | Menu items     | Every `<a>`/`toggleMode` button is hover-only, no `focus-visible` (→S3) | Scoped focus style           |
| Low | Open animation | `animate-ink-in` ungated (→S5)                                          | `motion-reduce:animate-none` |

**Strengths:** clear grouping — account identity block, then content actions, then admin/destructive, then
theme + sign out; admin items carry consistent `text-destructive`; agent-connect CTA is a contained,
accent-tinted card. Good "group by meaning" (Hyperplexed §1 hierarchy).

### Region 4 — Mobile drawer

| Sev | Region        | Defect                                                                               | Fix                 |
| --- | ------------- | ------------------------------------------------------------------------------------ | ------------------- |
| Med | Billing icon  | Hand-rolled credit-card `<svg>` (→N1)                                                | lucide `CreditCard` |
| Med | Links/toggles | Raw `<a>`/`<button>` items, no `focus-visible` (→S3)                                 | Scoped focus style  |
| Low | Drawer + dot  | `animate-ink-in` (`:989`) and onboarding `animate-pulse` dot (`:1066`) ungated (→S5) | `motion-reduce:`    |

**Strengths:** full focus trap + scroll lock + focus restore (best-in-shell a11y); onboarding state shown as
a visible % chip on the hamburger (`:727`) instead of a 10px dot — exactly the "differentiate with
size/weight, don't rely on a tiny cue" principle.

### Region 5 — Mobile primary-destination ergonomics (structural)

| Sev | Region    | Defect                                                                                                                                                                                                                       | Fix                                                     |
| --- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Med | Mobile IA | The three primary destinations (Dashboard / Projects / History) live **only** behind a top-right hamburger drawer — a two-tap reach for the app's most common navigation, at the top of the screen (farthest from the thumb) | Consider a bottom tab bar for the 3 primaries on mobile |

**Rubric:** Overflow & responsiveness — _"move primary actions closer to where the hand naturally rests…
reconsider always-visible side nav on phones (toggle instead)."_ The chat launcher and Work inbox _are_
always-visible (good — primary _actions_ are reachable), but primary _navigation_ is buried. A bottom tab
bar for the 3 destinations is the conventional fix and matches the deferred Tier 4–5 items in
`MOBILE_EXPERIENCE_AUDIT_2026-06-12.md`. **Structural — flagged for decision, not auto-applied.**

### Region 6 — Root layout frame & banners

| Sev  | Region           | Defect                                                                                         | Fix                       |
| ---- | ---------------- | ---------------------------------------------------------------------------------------------- | ------------------------- |
| High | Width systems    | `container` banners + `max-w-[1200px]` main + `max-w-7xl` nav/footer (→A1)                     | Unify (owner decision)    |
| Med  | View transitions | `startViewTransition` ungated for reduced-motion (→S5)                                         | `matchMedia` early-return |
| Low  | Orphan padding   | Main content `p-px` (`:281`) — a 1px frame seam; intentional-looking but flag for confirmation | Confirm vs. remove        |

**Strengths:** the skip-to-content link is a model (sr-only → `focus:not-sr-only` with `focus-visible`
ring); the read-only/frozen banner's "Activate Pro" button is the _only_ element in the shell that already
uses the full `focus:outline-none focus-visible:ring-2 focus-visible:ring-ring` convention — it's the
template the rest of the shell should copy.

### Region 7 — Footer

Low priority — the footer is the **cleanest surface in the shell**: it ships its own `a:focus-visible`
outline, lucide-only icons, balanced 3-column → 2-column responsive grid, and contained social icons.
Only carryover: it shares the `max-w-7xl` width, so it inherits the A1 misalignment vs. the content column.
The auth footer's mobile CTA uses raw `<a>` while desktop uses `Button` — cosmetic inconsistency, not worth
a change.

---

## Part 3 — Recommended fix sequence

Safe, high-confidence, convention-matching fixes (applied this pass — see Part 5):

1. **S3** — scoped `focus-visible` outline block in `Navigation.svelte` (copy the Footer pattern). One
   block, covers every raw link/button.
2. **N1** — swap both inline credit-card SVGs → lucide `CreditCard`.
3. **S5** — `motion-reduce:` variants on the raw-element animations + a reduced-motion early-return in the
   `onNavigate` view-transition hook.

Structural — **flagged for owner decision, NOT auto-applied** (each reshapes every page):

4. **A1** — unify the shell to one max-width + one padding scale (nav, banners, main, footer).
5. **Region 5** — add a mobile bottom tab bar for the 3 primary destinations.

Opportunistic / low:

6. **S4** radius drift on the onboarding CTA + non-auth buttons; collapse the 4× brain-bolt `<img>` stack;
   confirm the `p-px` main-frame seam.

---

## Part 4 — How this stacks with the page audits

The shell **rhymes** with the page audits, confirming the rubric as a repeatable instrument: S3 (focus
rings), S5 (reduced-motion), and N1 (icon set) recur here exactly as on the project/projects-list pages —
_"the same small problem wearing different costumes."_ Two things are genuinely **better** in the shell: the
shared `Button` already encodes the focus + reduced-motion conventions (the pages had to add them per
element), and the mobile drawer's a11y is the strongest in the app. Two things are **new and shell-specific**:
**A1** (three competing width systems — only visible when full-width regions stack) and the **mobile
primary-nav ergonomics** (Region 5) — neither could surface on a single in-page audit.

**Next step:** the live dark-mode screenshot pass — confirm the A1 left-edge offset reads in pixels (it
should, most visibly where a banner sits above the content column), and decide the two structural items.

---

## Part 5 — Fixes applied (2026-06-26)

`svelte-check` clean (0 errors / 0 warnings); Prettier clean. Touched: `Navigation.svelte`,
`+layout.svelte`, `Footer.svelte`.

**Systemic:**

- **N1** ✅ Both hand-rolled credit-card `<svg>`s (desktop dropdown + mobile menu) replaced with lucide
  `CreditCard` (added to the import). Zero inline SVGs remain in the nav.
- **S3** ✅ Added a scoped `a:focus-visible` / `button:focus-visible` outline block to `Navigation.svelte`
  (mirrors the Footer convention). Covers every raw nav link, dropdown item, theme toggle, and onboarding
  CTA; Svelte style scoping keeps it off the child `Button`'s internal element (no double-ring).
- **S5** ✅ `motion-reduce:animate-none` on every raw-element keyframe animation (`animate-pulse`,
  `-spin`, `-ink-in`, `-pulse-glow`, `-pulse-accent`); `motion-reduce:transition-none` on the
  hide-on-scroll slide; and a `prefers-reduced-motion` early-return added to the `onNavigate`
  view-transition hook in `+layout.svelte` so page morphs don't fire for reduced-motion users.

**Structural — A1 resolved (owner chose "unify shell width"):**

- **A1** ✅ Unified the shell to **one width + one padding scale: `max-w-7xl` + `px-2 sm:px-4 lg:px-6`** —
  the scale the page content wrappers (projects/history/profile) _already_ use. Concretely:
  - `main` content frame: `max-w-[1200px]` → `max-w-7xl` (the real outlier — it was capping every page
    _below_ the nav/footer width; pages declare `max-w-7xl` internally and were being constrained to 1200).
  - Trial/payment/frozen banners: `container mx-auto px-3 sm:px-6 lg:px-8` → `max-w-7xl mx-auto px-2 sm:px-4 lg:px-6`.
  - Nav: dropped the lone `xl:px-8` so nav padding matches the page-content scale at every breakpoint.
  - Footer: internal padding `px-4 sm:px-6 lg:px-8` → `px-2 sm:px-4 lg:px-6` (width was already `max-w-7xl`).

  > **Note — recommendation reversed by the code:** the pre-fix writeup floated _narrowing_ chrome to a
  > 1200px reading column. Inspection showed the pages themselves standardize on `max-w-7xl`, so aligning
  > the shell _up_ to 1280 (matching what pages already do) is the minimal, lowest-risk unification — it
  > only **relaxes** the main cap to each page's declared intent rather than rewriting every page wrapper.

**Deferred (structural, owner did not select):**

- **Region 5** — mobile bottom tab bar for the 3 primary destinations (still a hamburger-only reach).
- Low/opportunistic: collapse the 4× `brain-bolt.webp` `<img>` stack on the chat launcher; the S4 radius
  drift on the onboarding CTA + non-auth buttons; confirm the `p-px` main-frame seam.
