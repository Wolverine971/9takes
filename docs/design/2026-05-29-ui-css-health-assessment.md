<!-- docs/design/2026-05-29-ui-css-health-assessment.md -->

# 9takes UI / CSS Health Assessment — 2026-05-29

**Auditor:** Claude (UI-designer lens)
**Scope:** Full styling system — `tailwind.config.ts`, `src/scss/*`, ~252 `.svelte` files, atoms, design docs.
**Method:** Static analysis + 3 parallel deep-dive passes (consistency, accessibility/responsive, dead-code/quality) + manual verification of the highest-impact findings.
**Companion docs:** `docs/design-system.md` (the lock), `docs/design/migration-progress.md` (declares V5 migration "complete" 2026-05-05).

---

## ✅ Resolved — 2026-05-29 (Batch 1 + selected High items)

Shipped this session (build + `svelte-check` clean, 0 errors):

- **C1** — dark-mode `--ink-dim` lightened `#5c4f47 → #948578` (now **4.66:1** on stone-warm, **5.60:1** on night-deep; light mode already passed). Fixes muted/tertiary text + placeholders sitewide.
- **C2** — inverted reduced-motion guard in `components.scss` switched to a literal `@media (prefers-reduced-motion: reduce)`.
- **C3** — deleted the invisible `.main::before` 400vw infinite spin; added a global `prefers-reduced-motion: reduce` blanket in `index.scss`.
- **H1** — Tailwind `primary` ramp repointed teal → **amber** (matches `var(--primary)`); teal moved to a new `data-*` ramp (= `--data-teal`). The 3 files using `primary-*` utilities now render on-brand amber automatically.
- **H2** — `scripts/lint-radius.js` written + wired (`pnpm lint:radius`, and into `pnpm lint`). Scans 1327 files, **0 violations**. Scoped to UI source (excludes `src/blog` content + `design-preview`); supports a `lint-radius-disable-line` directive.
- **H3 → FULL atom migration (2026-05-29 pt.2).** Went past the contrast patch to **one button system**: migrated **~270 button instances across ~50 files** (admin, marketing/email, public routes, auth) to the canonical `<Button>` atom (~230 `<Button>` usages now). Deleted the global legacy `.btn` (`index.scss`) and the entire shared `.btn-*` family (`components.scss`: `btn-base/primary/secondary/hub-*/pill-*/outline/ghost/sm/lg`), plus the now-dead `LoadingButton.svelte` (auth pages migrated to `<Button loading>`). Mapping spec: `docs/design/button-atom-migration-spec.md`. Build + `svelte-check` clean (0 errors), `lint:radius` clean. Notes: `btn-success`→`primary` and the blue asset-generator buttons→amber (atom has no success/blue — intended); responsive full-width preserved via `.parent :global(.btn)`; print/export artifact buttons untouched. Bespoke component classes (`.action-btn`, `.icon-btn`, `.nav-btn`, etc.) are a separate system and were left as-is.
- **H4** — added `--space-xs … --space-3xl` CSS tokens to `:root` (mirrors `tailwind.config.ts` spacing + design-system §7).

Still open (see batches below): H5 (design-preview), H6 + global-selector scoping, M-series (cards, glass-border, EmptyState/ErrorState/Modal adoption, breakpoints, mobile type, touch targets, dead components), L-series. **Doc-honesty follow-up:** `docs/design-system.md §5` still prints the old teal-primary table — reconcile to amber-only (L2). **Bespoke `-btn` consolidation:** the per-component `.action-btn`/`.icon-btn`/`.nav-btn`/etc. families remain a separate, un-atomized button layer worth a future pass.

---

## TL;DR — the headline

The **foundation is genuinely good.** There's a real design system: V5 "Streetlamp Symposium" tokens (sodium-amber on warm stone), a `/styleguide` route, canonical atoms, a documented radius/shadow/type scale, an ESLint Tailwind-color ban, and clean theme-aware light/dark. The **public content routes adopt it well** (homepage, questions, pop-culture, community, guides, enneagram-corner, personality-analysis all use the `Button`/`SectionKicker` atoms and V5 tokens).

But the May migration was declared "complete" and then **the guardrails were left half-wired**, so drift has quietly resumed. There is one **genuine, sitewide accessibility failure** (muted text fails WCAG), two **real reduced-motion bugs**, a **non-existent lint that the docs claim is enforcing the radius scale**, and a **sharp fault line**: everything behind `/admin`, all `marketing/`+`email/` components, and the auth pages ignore the atoms and reimplement buttons/cards/modals off-spec.

Nothing here is on fire visually — the brand reads as one product on the pages users actually land on. The work is **closing the gaps so the system can't keep drifting**, plus fixing the contrast/motion bugs that affect real users today.

**If you do only five things:**

1. Fix `--ink-dim` dark-mode contrast (2.11:1 → ≥4.5:1). One token, ~235 usages, sitewide readability.
2. Fix the inverted reduced-motion guard + gate the infinite animations (or delete the pointless one).
3. Re-wire (or write) `lint:radius`, or stop claiming it's enforced.
4. Reconcile the Tailwind `primary`/`secondary` palette (still teal/rose) with the amber V5 reality.
5. Kill the global legacy `.btn` and point admin/marketing/auth at the `Button` atom.

---

## Severity legend

🔴 **Critical** — affects real users now (a11y/contrast/broken behavior) · 🟠 **High** — structural drift or a guardrail that silently isn't working · 🟡 **Medium** — inconsistency / tech-debt / footgun · ⚪ **Low** — polish / doc hygiene

---

## 🔴 Critical — fix these first

### C1. Muted text fails WCAG contrast in dark mode (sitewide)

`--ink-dim` (`src/scss/index.scss:283`) is `#5c4f47` in dark mode. Measured contrast:

| Pair                                    | Ratio      | WCAG AA (4.5:1 normal text) |
| --------------------------------------- | ---------- | --------------------------- |
| `--ink-dim` on `--stone-warm` (#241d17) | **2.11:1** | ❌ FAIL                     |
| `--ink-dim` on `--night-deep` (#0a0807) | **2.54:1** | ❌ FAIL                     |

This token is aliased by `--text-tertiary`, `--text-muted`, `--muted-text`, `--neutral-text`, and used as **visible text in ~235 places** — captions, footnotes, breadcrumbs, metadata, **input placeholders** (`index.scss:757,783`), and the footer brand description (`Footer.svelte:204`, 14px body). Dark mode is the default theme, so most visitors see this. Low-vision users effectively cannot read any secondary text.

**Fix:** lighten dark-mode `--ink-dim` to ≈`#8a7d72` (≈4.5:1 on stone-warm), or split into two tokens — a readable `--ink-dim` for text and a separate decorative `--ink-faint` for true non-text use (hairline labels, disabled). Verify against both `--stone-warm` and `--night-deep`. Light mode is fine (4.5–4.8:1).

### C2. Reduced-motion guard is inverted (motion logic backwards)

`src/scss/components.scss:1101` disables hover transforms inside `@include reduced-motion`, but that mixin (`_mixins.scss:135`) wraps `@media (prefers-reduced-motion: no-preference)`. Net effect: hover motion is **removed for users who allow motion** and **kept for users who asked to reduce it** — the exact opposite of the intent, and it sits under an "ACCESSIBILITY" comment.

**Fix:** change that block to a literal `@media (prefers-reduced-motion: reduce)`. (The mixin itself is fine — its other caller at `index.scss:1112`, opting _in_ to view-transitions under `no-preference`, is correct. The bug is this one caller's intent.)

### C3. Infinite animations ignore `prefers-reduced-motion`; one animates nothing

There is **no global `@media (prefers-reduced-motion: reduce)` blanket** in `src/scss`. These run regardless of user preference:

- `.main::before { animation: spin 300s linear infinite }` (`index.scss:561-571`) — a `position:fixed` **400vw × 400vw** element at `z-index:-1`, spinning forever — but its `background` is commented out (`/* Background pattern can be added here if needed */`). **It animates an invisible, oversized element 24/7 for zero visual payoff.** Pure GPU/battery waste + a vestibular trigger that does nothing.
- `.loader` (`index.scss:946`), `.loading-spinner`/`.spinner` (`components.scss:407,810`) — spinners, not gated.
- `.animate-pan-overlay` 22s, `.animate-pan-image` 15s continuous scale+translate (`components.scss:469,473`) — classic vestibular triggers.

**Fix:** (a) delete the dead `.main::before` spin outright; (b) add a global reduce block that kills/shortens infinite animations:

```scss
@media (prefers-reduced-motion: reduce) {
	*,
	*::before,
	*::after {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
		scroll-behavior: auto !important;
	}
}
```

---

## 🟠 High — structural drift & broken guardrails

### H1. Tailwind palette still teal/rose; CSS vars are amber — two disagreeing color systems

`tailwind.config.ts:23-47` defines `primary` = teal (`#14B8A6`) and `secondary` = rose (`#F43F5E`). But the shipped V5 theme resolves `--primary` → `--lamp-glow` → **amber `#f59e0b`**. So `class="text-primary-600"` renders **teal** while `style="color: var(--primary)"` renders **amber** — on the same brand role.

It's a contained footgun today (only 3 files use the teal/rose utilities): `src/lib/amp-stories/EnneagramMentalIllnessPromo.svelte`, `src/routes/admin/asset-generators/poster-generator/+page.svelte`, `src/routes/admin/transactional-emails/+page.svelte` (~38 occurrences). But it's a live trap — any new `bg-primary-500` ships off-brand teal, and it directly contradicts the design-system lock (§5 says teal "survives only as `--data-teal`").

**Fix:** repoint the Tailwind `primary` ramp to the amber/lamp scale (or to `var(--lamp-*)`), rename the current teal ramp to `data`/`accent-data` to match `--data-teal`, migrate the 3 files, then the utility surface and the CSS-var surface finally agree. (`docs/design-system.md §11` already proposes exactly this single-source-of-truth wiring — it just was never executed.)

### H2. `lint:radius` is documented as "locked & enforced" but does not exist

`tailwind.config.ts:120` and `docs/design-system.md:46,325,448` cite `pnpm lint:radius` / `scripts/lint-radius.js` as the enforcement for the radius scale. **Neither exists** — `package.json`'s `lint` is just `prettier --check . && eslint .`, and `scripts/lint-radius.js` is absent. The "banned" radii (`rounded-lg/2xl/3xl/[Npx]`) can re-enter freely (3 already have: 1× each `rounded-lg/2xl/3xl`).

**Fix:** either (a) write the script + wire `lint:radius` into `lint`, or (b) implement it as an ESLint `no-restricted-syntax` rule next to the existing Tailwind-color ban (cheaper, runs in the same pass), or (c) if it's not worth enforcing, strike the "lint-enforced" claims from the docs so the system isn't lying about its own guardrails.

### H3. Two competing `.btn` systems; admin/marketing/auth ignore the atom

- The `Button` atom (`atoms/Button.svelte`) is the canonical spec: 10px radius, weight 600, **dark text on amber** (`--cta-text`/`--night-deep`), no gradients.
- A second **global, unscoped `.btn`** lives in `index.scss:694` (8px radius, 16px font, a `::after` shimmer) and leaks onto every `<button class="btn">`.
- The **entire `/admin` tree + all `marketing/`+`email/` components reimplement** `.btn-primary` off-spec, and the auth pages (`login`/`register`/`account`/`forgotPassword`/`resetPassword`) still use the deprecated `LoadingButton` (6px radius, weight 500). **Zero** admin/marketing files import the atom.
- **Contrast bug rides along:** several of these put **white text on amber** (`CampaignManager.svelte:1334`, `admin/analytics/+page.svelte:3970`), which fails contrast and is off-brand — the atom deliberately uses dark-on-amber.

**Fix:** delete/neutralize the global `.btn` (or alias it to atom styles), migrate auth pages off `LoadingButton`, and adopt `Button` across admin/marketing. Big surface, so stage it (auth → marketing → admin); the white-on-amber instances should be fixed immediately regardless.

### H4. No spacing-scale tokens exist (only documented)

The styleguide §07 (`styleguide/+page.svelte:381-389`) documents `xs/sm/md/lg/xl/2xl/3xl` (4/8/12/16/24/32/48px), and `docs/design-system.md §7` recommends committing to it — but **no matching CSS custom properties exist** in `index.scss`. The only spacing var is an orphan `--spacing-unit: 5px` that matches nothing. So every component hardcodes arbitrary padding/margins (admin/analytics alone mixes 4/8/9/10/12/14px). Spacing consistency is currently _impossible to achieve_ because there's nothing to reference.

**Fix:** add `--space-xs … --space-3xl` to `:root` mirroring the Tailwind `spacing` scale (which _does_ exist in `tailwind.config.ts:127-135`), and optionally an ESLint rule against arbitrary `[Npx]` spacing.

### H5. `design-preview` is ~4,160 lines of "temporary" prototype shipping to prod

`src/routes/design-preview/+page.svelte` (1,148 lines) + `v5/+page.svelte` (3,013 lines) + `v5/+page.server.ts` which **runs its own duplicate `questions` DB query** (mirrors the homepage). The migration doc kept v5 "for a rollback window" (expired ~2026-05-19). But it's now a **de-facto permanent reference** — `styleguide/+page.svelte:477,1054` and `+page.svelte:6` link to it as "visual ground truth," and many page comments point at it.

**Fix:** decide its fate. If it stays, it's documentation — relabel it (drop the "kept alive 2 weeks" comment at `+page.svelte:6`), and ideally drop the live DB query or static-render it. If it goes, repoint the styleguide links first. Either way it shouldn't ship 4k lines + a query under a "temporary" label.

### H6. Global `section { flex-basis: calc(50% - 20px) }` applied to every `<section>`

`index.scss:614-620` gives **every** bare `<section>` a `flex-basis: calc(50% - 20px)` + `border-radius`. Harmless until a `<section>` becomes a flex child, then it unexpectedly snaps to ~50% width. MDsvex blog content and component `<section>`s inherit this; the mobile overrides at `:1081` are evidence it's already caused pain.

**Fix:** scope to a class (e.g. `.split-section`) instead of the bare element. Same pattern for the global `ul` double-indent (`:852`) and global `table/tr/td/th` with forced `text-align:center` (`:875-899`) — these fight component styles and should be scoped or moved into the typography/prose layer only.

---

## 🟡 Medium — inconsistency & tech-debt

### M1. Card radius contradicts the spec

Spec says cards are `rounded-xl` (16px). Reality in `index.scss`: global `.card` = **8px** (`:651`), `.glass-card` = **8px** (`:667`), `.panel` = **5px** (`:681`). Three card radii in the global sheet, none matching the lock. Reconcile to 16px (or update the spec if 8–10px is the intended live value).

### M2. `--glass-border` is still teal on the amber theme

`index.scss:216` → `rgba(45,212,191,0.15)` (old teal), and `--accent-rgb: 45,212,191` (`:53`) likewise. Every `.glass-card` edge renders a teal hairline against amber/stone — a visible off-brand seam. Swap to a `--stone-edge`/amber-tinted value.

### M3. Canonical atoms shipped but not adopted

`EmptyState` and `ErrorState` are exported but imported **only by the styleguide** — every page rolls its own empty/error UI. The `Modal` atom (`getModal()`) is used by core molecules but bypassed by many hand-rolled `fixed inset-0` overlays (admin/consulting, content-board, welcome-sequence, MobileNavNew, marketing modals). Mixed modal systems = inconsistent backdrop/radius/dismiss. The styleguide also previews buttons with bespoke `sg-btn` classes rather than rendering the real `Button` atom, so the "spec" can drift from the component silently.

### M4. Responsive breakpoints have a gap and an overlap

`_mixins.scss`: `tablet` ≤768, `tablet-up` ≥800, `desktop-sm` ≤800. → **769–799px is a 31px dead zone** for any `tablet`/`tablet-up` pairing (iPad-ish portrait widths), and **800px is double-matched** by `tablet-up` (min) and `desktop-sm` (max). Align the boundaries (e.g. `tablet-up` ≥769, `desktop-sm` ≤799).

### M5. Mobile body text too small + textarea breaks the iOS-zoom guard

`index.scss:1070` sets `p { font-size: 0.8rem }` (~12.8px) on ≤576px — too small for a reading-heavy content site (target ≥15–16px). And `.interact-text-container textarea { font-size: 0.875rem }` (`:1101`) drops below the deliberate 16px iOS guard (`:451`), re-triggering the auto-zoom that guard exists to prevent. Bump both to ≥16px (textarea) / ≥0.95rem (mobile p).

### M6. Touch targets below 44px

Inputs `padding:8px 12px` (~36px tall, `:778`), `.accordion` `padding:0.5rem` (~32px, `:810`), `details summary` (`:841`) all fall under the 44px tap-target minimum, with no global floor. Add a `min-height:44px` floor on interactive elements (or at least on mobile).

### M7. Header & Footer still on Svelte 4 API

`Header.svelte` (`export let data` + `$:`) and `Footer.svelte` (`$:`) are the most globally-visible chrome yet sit on the legacy API while the content they frame is runes-based. Migrate when next touched (per CLAUDE.md policy).

### M8. Dead SCSS mixins and dead bridge tokens

- **All 8 glow/`dark-*` mixins** in `_mixins.scss` (`glow-primary/-secondary/-accent/-purple/-blue/-cyan`, `dark-card`, `dark-input`) have **zero callers** — fully removable. (Glow _effects_ survive as `--glow-sm/-md` custom props, unrelated.)
- **~15 legacy-bridge tokens** in `index.scss:101-145` are defined but never referenced (`--text-on-secondary`, `--color-bg-muted`, `--color-icon`, `--item-background`, `--title-background/-color`, `--link-background`, `--link-hover-background`, `--background-light/-dark`, `--color-warning`, `--text-color-secondary`, `--card-bg-color`, `--message-background`, `--comment-hover-bg`). Safe-delete candidates.

### M9. Dead components

- `icons/NO-caseyNeistatCareer.svelte` — zero imports, the `NO-` prefix says it all.
- Verified unimported: `molecules/WordCloud.svelte`, `FamousTypes.svelte`, `PeopleBoard.svelte`, `Carousel.svelte`, `blog/HornevianMatrix.svelte`, `StructuredBlogView.svelte`, `layout.svelte`, `atoms/jumbotron.svelte`, `DateTip.svelte`, `content/contentCard.svelte`, `marketing/CorpusStatsPanel.svelte`. **`WordCloud` is both dead AND in the ESLint grandfather list** — delete the file rather than maintain its exemption.

### M10. `!important` load (~100 total) concentrated in a Flowbite fight

`SearchQuestion.svelte` alone has 28 `!important`, all `:global()` overrides of Flowbite ComboBox internals (`.combobox__list` etc.). Legitimate but brittle — a Flowbite class rename silently breaks all of it, and it leaks one stranded `--neutral-800` legacy ref. Worth isolating behind a wrapper or pinning the Flowbite version. The other ~70 are scattered and mostly individually defensible.

### M11. ~45 grandfathered off-token Tailwind colors; stale exemption list

~45 raw `bg-gray-*`/`text-red-*`/`text-blue-*` etc. remain (mostly in the 10 grandfathered files in `eslint.config.js:228-244`). The list is 24 days old with **0 entries cleaned**, and one entry (`WordCloud`) is dead. Do a sweep: drop `WordCloud`, then migrate the smaller files (ErrorBoundary, CategoryTree) to tokens.

---

## ⚪ Low — polish & doc hygiene

- **L1.** Light-mode amber-hover `--lamp-light` #d97706 (3.19:1) and `--marble-shadow` #8b7e6e (3.96:1) fail normal-text contrast — fine for large text / borders only; don't use them for body copy.
- **L2.** `docs/design-system.md §5` is internally contradictory — it documents _both_ the teal/rose palette (as "Locked de-facto") and the amber V5 set (as "LOCKED, replaces teal"). Its "current state" surface-token table (`--bg-surface #292524`, etc.) is also stale vs the shipped V5 values (`--stone-warm #241d17`). Reconcile the doc to amber-only.
- **L3.** `atoms/card.svelte` is a near-dead `export let className` wrapper (used by Link + signup only) overlapping the global `.card` — consolidate or remove.
- **L4.** Search inputs (`SearchQuestion`, `HeaderSearch`) set font-size <16px — same iOS-zoom issue as M5.

---

## Suggested remediation roadmap

Sequenced for impact-per-effort. Each batch is independently shippable and type-checkable.

**Batch 1 — User-facing bugs (small, high value).** C1 (ink-dim contrast), C2 (reduced-motion inversion), C3 (gate/kill infinite animations), H3-contrast-only (white-on-amber CTAs). ~1 focused session. These are the only items that affect real users _today_.

**Batch 2 — Re-arm the guardrails.** H2 (radius lint — write it or strike the claim), H1 (reconcile Tailwind primary→amber, rename teal→data), L2 (fix the design-system doc so the lock matches reality). Without this, every later cleanup re-drifts.

**Batch 3 — Token completeness.** H4 (ship `--space-*` tokens), M1 (card radius), M2 (glass-border), M8 (delete dead mixins + bridge tokens). Makes consistency _achievable_ and shrinks the surface.

**Batch 4 — Component canonicalization.** H3 (kill global `.btn`, migrate auth→marketing→admin to `Button`), M3 (adopt EmptyState/ErrorState/Modal), M7 (Header/Footer→runes). Largest effort; stage over multiple sessions.

**Batch 5 — Hygiene sweep.** H5 (decide design-preview), H6 + global-selector scoping, M4 (breakpoints), M5/M6/L4 (mobile type + touch targets), M9 (delete dead components), M11 (eslint grandfather sweep).

---

## What's healthy (don't break it)

- V5 token architecture (single source of truth via CSS vars, theme-aware light/dark, pre-paint theme script in `app.html`).
- Public content routes consistently use atoms + tokens — the brand reads as one product where it counts.
- Radius/shadow philosophy ("borders do the work, shadows for floating UI") is sound and mostly followed.
- `/styleguide` route exists and is a real reference (just needs to dogfood its own atoms).
- ESLint Tailwind-color ban is active and working for new code.
- Excellent text contrast for _primary_ text (18:1 dark, 16:1 light) and amber links (9:1 dark).

---

## Appendix — metrics snapshot (2026-05-29)

| Metric                                   | Count | Note                                                               |
| ---------------------------------------- | ----- | ------------------------------------------------------------------ |
| `.svelte` files                          | 252   | 154 components + 94 route files                                    |
| Files using amber CSS vars               | 173   | the real brand surface                                             |
| Files using teal/rose Tailwind utilities | 3     | off-brand footgun (H1)                                             |
| `!important` (svelte + scss)             | ~100  | 28 in SearchQuestion alone (M10)                                   |
| Inline `style=""` attrs                  | 159   | many dynamic/legit; some static                                    |
| Hardcoded hex in `.svelte`               | 631   | concentrated in styleguide/stories/generators/icons (mostly legit) |
| Deprecated radii (`rounded-lg/2xl/3xl`)  | 3     | guardrail (H2) not running                                         |
| Grandfathered off-token Tailwind colors  | ~45   | across 10 files (M11)                                              |
| Verified dead components                 | 12    | incl. 1 `NO-` file (M9)                                            |
| Dead SCSS mixins                         | 8     | all glow/dark-\* (M8)                                              |
| Dead bridge tokens                       | ~15   | (M8)                                                               |

_Generated 2026-05-29. Re-run the three audit passes after Batches 1–3 to confirm closure._
