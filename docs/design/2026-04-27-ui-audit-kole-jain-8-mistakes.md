<!-- docs/design/2026-04-27-ui-audit-kole-jain-8-mistakes.md -->

# 9takes UI Audit — Kole Jain's 8 Beginner Mistakes

**Date:** 2026-04-27 (audit) · last updated 2026-04-27 (progress pass)
**Source framework:** [7 UI/UX mistakes that SCREAM you're a beginner — Kole Jain](https://www.youtube.com/watch?v=AH_ugxmLeUM)
**Transcript:** `youtube-transcripts/2025-06-07-kole-jain-7-ui-ux-mistakes-beginner.md`
**Analysis:** `youtube-transcripts/2025-06-07-kole-jain-7-ui-ux-mistakes-beginner-ANALYSIS.md`

This audit walks the 9takes codebase against each of the 8 mistakes and lists concrete, ranked fixes.

> **Progress to date** — see [Progress Log](#progress-log) at the bottom. As of 2026-04-27: ✅ modal consolidation complete, ✅ primary submit button shape standardized, ✅ dark-mode shadows softened to Kole's recipe, ✅ corner-radius scale standardized + lint script. `pnpm check` passes with 0 errors.

---

## Executive Summary

9takes has a **strong design-token foundation** (Tailwind palette, spacing tokens, SCSS variables) but **leaks consistency at the application layer**. The two biggest tells of beginner-level UI in the codebase right now are:

1. **Effect addiction** — glow shadows everywhere (`--glow-sm/md/lg/secondary/accent/subtle`, `shadow-glow-teal`, `shadow-glow-rose`, drop-shadow filters with primary-glow), gradient buttons system-wide, and ~~dark-mode shadows running at 0.3–0.5 alpha on near-black~~ ✅ **fixed 2026-04-27** (now 0.15-0.25 alpha + 2× blur).
2. **Component sprawl** — ~~three modals (`Modal`, `Modal2`, `ModalNew`)~~ ✅ **consolidated to one (`Modal2`) 2026-04-27**, two mobile navs (`MobileNav`, `MobileNavNew`), two rubix displays, two skeleton loaders, plus ~~six different `rounded-*` corner radius values~~ ✅ **standardized 2026-04-27** (4 sizes: sm/md/xl/full, lint-enforced).

These two compound: a button with a glow on a card with the wrong rounding next to a modal that doesn't match the other two modals = the exact "made by a beginner" feeling Kole describes. Most fixes here are **subtraction**, not addition.

**Severity legend:** 🔴 high · 🟡 medium · 🟢 low

---

## 1. User Flow 🟡

### What we have

- `/questions/create` has a proper loading flow with `aria-busy`, disabled state, and Modal2 wrapper.
- `/book-session` collects name, email, Enneagram type, and session goal.
- `/enneagram-test` is a **dead route** that immediately redirects to `/questions` (`window.location.href = '/questions'`). It exists only as a placeholder.
- `/intake/[token]/` is token-gated, not part of public flow.

### Gaps

- **Dead `/enneagram-test` route.** This is the exact "missing flow" Kole calls out. Search engines and external links land here, the page does nothing. Either build the assessment or stop pointing at it.
- **No "I don't know my type" path on `book-session`.** The form requires an Enneagram type. New visitors who haven't typed themselves will either guess or bounce.
- **Empty/no-results states** in question search and blog search aren't centrally tracked — likely inconsistent.
- **Skip paths in welcome sequence onboarding** (welcome emails → first action) — worth auditing whether each email has a "not interested" or "remind me later" path.

### Actions

| Severity | Fix                                                                                                                                                               |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🟡       | Replace `/enneagram-test` redirect with either a real lightweight typing quiz or a 30-second "type-yourself in 9 questions" landing that links into `/questions`. |
| 🟡       | Add an "I'm not sure of my type yet" radio option to `/book-session` enneagram-type field. Don't gate the waitlist on self-typing certainty.                      |
| 🟢       | Audit empty-state designs across `/questions`, blog search, and `/admin/search`. Standardize one empty-state component (e.g. `<EmptyState icon message cta />`).  |
| 🟢       | Add a "skip / not now" link to multi-step welcome sequence emails.                                                                                                |

---

## 2. Overusing Effects 🔴 (highest-leverage fix)

This is **the** biggest beginner-tell in 9takes today. Evidence:

### Current state — glow tokens

```scss
/* src/scss/index.scss */
--glow-sm: 0 0 10px var(--primary-glow);
--glow-md: 0 0 20px var(--primary-glow);
--glow-lg: 0 0 40px var(--primary-glow);
--glow-secondary: 0 0 20px var(--secondary-glow);
--glow-accent: 0 0 20px var(--accent-glow);
--glow-subtle: 0 0 30px rgba(45, 212, 191, 0.2);
```

Plus Tailwind:

```ts
'glow-teal': '0 0 20px rgba(45, 212, 191, 0.3)',
'glow-rose': '0 0 20px rgba(251, 113, 133, 0.3)',
```

### Current state — gradients on functional UI

- `/questions/create/+page.svelte:345,395` — primary submit button: `bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary-darker)]`
- `Comment.svelte:549,676,824` — three different gradient buttons including a red→darker-red gradient
- `/questions/+page.svelte:388` — header banner uses `bg-gradient-to-b` with backdrop blur
- `LoadingButton.svelte` — internal styles use `linear-gradient(135deg, ...)`

### Current state — dark-mode shadows ✅ FIXED 2026-04-27

```scss
/* dark theme — Kole's recipe applied (was too heavy) */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.15); /* was 0 1px 3px @ 0.3 */
--shadow-md: 0 6px 16px rgba(0, 0, 0, 0.18); /* was 0 4px 6px @ 0.4 */
--shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.22); /* was 0 10px 15px @ 0.5 */
--shadow-xl: 0 24px 48px rgba(0, 0, 0, 0.25); /* was 0 20px 25px @ 0.5 */

/* light theme — already appropriate */
--shadow-sm: 0 1px 3px rgba(12, 10, 9, 0.08);
--shadow-md: 0 4px 6px rgba(12, 10, 9, 0.1);
```

Tailwind's `shadow-{sm,md,lg,xl}` utilities now also reference `var(--shadow-*)` so they auto-respond to theme.

### Why this is "beginner"

Kole's recipe is the inverse of what we do today:

- **Kole:** shadows should be light gray, increase blur, lower not opacity. **Us:** near-black shadows at 0.3–0.5 alpha in dark mode (which barely show anyway because the bg is also dark — they're noise).
- **Kole:** avoid cross-color and decorative gradients. **Us:** every primary CTA is a gradient + glow combo.
- **Kole:** "less visual noise = better design." **Us:** primary button = gradient + glow + `active:scale-[0.98]` + `hover:shadow-[var(--glow-md)]`.

### Actions

| Severity | Fix                                                                                                                                                                                                                                                                                           |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🔴       | **Cut the glow tokens in half.** Keep `--glow-sm` and `--glow-md` for accent moments only (e.g. focused or active state on a single hero CTA). Remove `--glow-lg`, `--glow-secondary`, `--glow-accent`, `--glow-subtle`, `shadow-glow-teal`, `shadow-glow-rose`. Don't replace — just remove. |
| 🔴       | **Strip gradient + glow from every button**. Replace gradient backgrounds with **solid `var(--primary)`** (or solid same-color variations) and remove the `hover:shadow-[var(--glow-md)]` chains. Keep one hero button on the homepage with the gradient if you must — make it the exception. |
| ✅       | ~~**Soften dark-mode shadows** to match the light-mode philosophy.~~ **Done 2026-04-27.** Shadow color simplified to `rgba(0,0,0, X)`, alpha cut from 0.3-0.5 to 0.15-0.25, blur radii roughly doubled. Tailwind shadow utilities now reference the CSS vars directly.                        |
| 🟡       | Remove `drop-shadow(0 0 12px var(--primary-glow))` from `QuestionDisplay.svelte:148` (text glow on question titles). It looks like a Web 2.0 hero effect.                                                                                                                                     |
| 🟡       | Remove `filter: drop-shadow(0 0 3px ...)` from `StatCard.svelte` icon variants — admin charts shouldn't sparkle.                                                                                                                                                                              |
| 🟢       | Audit `MarqueeHorizontal.svelte` (`text-shadow: 0 0 20px ...`) and `PopCardGroup.svelte` (`text-shadow: 0 0 6px ...`) — same diagnosis.                                                                                                                                                       |

**Expected impact:** This single category of changes will raise the perceived production-quality bar more than any other.

---

## 3. Spacing 🟡

### What we have

- Tailwind config defines named spacing tokens: `xs/sm/md/lg/xl/2xl/3xl`.
- Tailwind grid utilities available; auto-layout via Flex.
- 1,792 lines of `components.scss` + 1,046 lines of `index.scss` — huge custom CSS surface (high drift risk).

### Likely problems (verify on device)

- Mobile padding on `/questions/create`, `/book-session` — needs hands-on check at 375px viewport.
- Stack content density — Comment.svelte has 26 padding/gap class hits in one file, mostly arbitrary not tokenized.
- Card grids in `/personality-analysis` and `/questions` — verify breathing room between cards.

### Actions

| Severity | Fix                                                                                                                                                                                                   |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🟡       | Run a **mobile spacing pass at 375px** on the top 5 pages: `/`, `/questions`, `/questions/create`, `/book-session`, `/personality-analysis`. Note any element pairs touching (<8px gap) and increase. |
| 🟢       | Reduce the spacing token set from 7 to 5 (drop `xs` and `3xl`, or replace `xs` with `sm`). Variety in spacing tokens drives accidental inconsistency.                                                 |
| 🟢       | Banner sections like `/questions/+page.svelte:388` use ad-hoc `mb-4`/`p-3`/`p-4`. Convert to spacing tokens (`mb-md`, `p-sm`).                                                                        |

---

## 4. Inconsistent Components 🔴

### Corner radius chaos ✅ FIXED 2026-04-27

**Before** — 6 different rounding scales used inconsistently:

| Class               | Before |                                                                      After |
| ------------------- | -----: | -------------------------------------------------------------------------: |
| `rounded-md`        |     26 |                                **63** (canonical for buttons/inputs/chips) |
| `rounded-xl`        |     17 |                                **30** (canonical for cards/modals/banners) |
| `rounded-full`      |     25 | **23** (only spinners/dots/avatars; primary CTAs reverted to `rounded-md`) |
| `rounded-lg`        |     28 |                                           **0** (banned — see lint script) |
| `rounded-2xl`       |     10 |                                                             **0** (banned) |
| `rounded-3xl`       |      2 |                                                             **0** (banned) |
| `rounded` (default) |      6 |                                                           **0** (replaced) |
| `rounded-sm`        |      0 |                                                  **1** (tiny inline badge) |

**After: 4 sizes, lint-enforced.**

`tailwind.config.ts` now defines `md = 0.625rem (10px)` per Kole's recipe (was falling back to Tailwind's default 6px). `pnpm lint:radius` (also runs as part of `pnpm lint`) blocks any `rounded-lg`, `rounded-2xl`, `rounded-3xl`, or `rounded-[Npx]` from re-entering the codebase. See `scripts/lint-radius.js`.

### Duplicate components

| Pattern    | Files                                                                         | Status             |
| ---------- | ----------------------------------------------------------------------------- | ------------------ |
| Modal      | ~~`Modal.svelte`, `Modal2.svelte`, `ModalNew.svelte`~~ → just `Modal2.svelte` | ✅ Done 2026-04-27 |
| Mobile nav | `MobileNav.svelte`, `MobileNavNew.svelte`                                     | Pending            |
| Rubix      | `rubixDisplay.svelte`, `rubixDisplay2.svelte`                                 | Pending            |
| Skeleton   | `Skeleton.svelte`, `SkeletonLoader.svelte`                                    | Pending            |

### Token system drift

- `tailwind.config.ts` defines: `sm/DEFAULT/lg/xl` for borderRadius.
- `src/scss/index.scss` defines: `--border-radius-sm/-md/-lg`.
- App code uses: `md/lg/xl/2xl/3xl/full` plus ad-hoc `rounded-[10px]`-style escapes.

### Actions

| Severity | Fix                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ✅       | ~~**Pick one corner-radius scale for small components and ban the others in lint.**~~ **Done 2026-04-27.** Standardized to: `rounded-md` (10px) for buttons/inputs/chips/popovers, `rounded-xl` (16px) for cards/modals/banners, `rounded-full` for pills/avatars/spinners, `rounded-sm` for tiny inline. `rounded-lg`/`rounded-2xl`/`rounded-3xl`/ad-hoc banned via `scripts/lint-radius.js` (runs in `pnpm lint`).                             |
| ✅       | ~~**Pick one Modal and delete the other two.**~~ **Done 2026-04-27.** `Modal2` chosen as canonical, enhanced with `maxWidth` and `fullMobile` props (backwards-compat for existing callers). `ModalNew`'s sole caller (`/admin/asset-generators/question-print`) migrated to Modal2. Both `Modal.svelte` and `ModalNew.svelte` deleted. `atoms/index.ts` cleaned. _Follow-up: rename `Modal2.svelte` → `Modal.svelte` (12 import-path updates)._ |
| 🔴       | **Pick one MobileNav.** `MobileNavNew` is referenced by `Header.svelte` — `MobileNav.svelte` is dead weight. Delete.                                                                                                                                                                                                                                                                                                                             |
| 🟡       | Pick one Rubix and one Skeleton. Same pattern — keep the newer/used one, delete the legacy.                                                                                                                                                                                                                                                                                                                                                      |
| ✅       | ~~**Standardize the primary CTA component.**~~ **Done 2026-04-27** (then re-aligned during the corner-radius pass). Primary submit buttons across `Comment.svelte` and `/questions/create` now use `rounded-md` (10px) — the chosen standard for buttons. _Follow-up: extract a shared `<PrimaryButton>` so the gradient + glow chain lives in one place — ties into §2 effect cleanup._                                                         |
| 🟢       | Reconcile the SCSS `--border-radius-*` tokens with the Tailwind `borderRadius` keys so they reference the same source-of-truth.                                                                                                                                                                                                                                                                                                                  |

---

## 5. Icons 🔴

### What we have

- **27 hand-rolled SVG components** in `src/lib/components/icons/`
- No icon library dependency in `package.json`
- Inline SVGs in `Header.svelte` (account icon, library dropdown chevron) — bypassing the icon set entirely

### Inconsistencies

**Stroke widths in use:**

- `1.5` — `Header.svelte:101,190` (account icon, both mobile and desktop)
- `1.8` — `Header.svelte:152` (library dropdown chevron)
- `2` — 10 of 11 icons in the `icons/` folder
- `4` — 1 outlier icon

**Hardcoded colors:**

- `rubix.svelte` hardcodes `stroke="#BE26D7"` 22 times — purple ignores theme switch.

**Naming convention drift:**

- `leftIcon`, `arrowRightIcon`, `xmarkIcon`, `cameraIcon` — descriptive
- `enneagram`, `rubix` — bare nouns
- `commentsIcon`, `CommentXMarkIcon` — case inconsistency
- `NO-caseyNeistatCareer.svelte` — leftover/dead file

### Actions

| Severity | Fix                                                                                                                                                                                                                                                                         |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🔴       | **Adopt a single icon library.** Recommended: [`lucide-svelte`](https://lucide.dev/) — same family Kole praises (Feather lineage), tree-shakeable, themeable via `currentColor`. Add `lucide-svelte` to deps, replace existing icons one route at a time.                   |
| 🔴       | **Standardize stroke width = 1.5** (matches Lucide's default and the existing Header icons). Update remaining custom icons to match.                                                                                                                                        |
| 🟡       | **Replace inline SVGs in `Header.svelte`** with `<UserCircle />` and `<ChevronDown />` from the chosen library.                                                                                                                                                             |
| 🟡       | Remove the hardcoded `stroke="#BE26D7"` from `rubix.svelte` — replace with `currentColor` so it themes correctly.                                                                                                                                                           |
| 🟡       | Apply Kole's pro tip — different icon styles okay only when _visually separate_. The 9takes Enneagram-type symbols (custom illustrations) can keep their unique style; **navbar/UI/admin icons** must all come from the same library. Document this rule in `docs/design/`. |
| 🟢       | Delete dead icons: `NO-caseyNeistatCareer.svelte`.                                                                                                                                                                                                                          |
| 🟢       | Add tooltip to non-obvious icons in `Header.svelte` (the library dropdown — what is "Library"?) and admin nav. Apply Kole's "icons without labels need tooltips" rule.                                                                                                      |

---

## 6. Redundant Elements 🟡

### What we have

- Triple Modal, double MobileNav, double Rubix, double Skeleton (covered in §4).
- `BackNavigation.svelte` exists as an atom, but `Comment.svelte` and several flow pages re-implement back/cancel patterns inline.
- Atoms folder mixes test files and live components: `Modal2.spec.ts` next to `Modal2.svelte`.
- Decorative components likely unused: `FloatingParticles.svelte`, `MarqueeHorizontal.svelte`, `scribble.svelte` — verify reach.
- Multiple PopCard variants: `PopCard`, `PopCardGroup`, `SmallPopCard` — may be legitimate, or may be duplication.

### Actions

| Severity | Fix                                                                                                                                                                                                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 🟡       | After the duplicate-component cleanup (§4), audit visual decorations: `FloatingParticles`, `MarqueeHorizontal`, `scribble`. If unused on top-traffic pages, delete. If used decoratively, evaluate if removing them improves the design (Kole's "rip them straight out" rule). |
| 🟡       | Consolidate PopCard family — at least document when each is used. Three flavors of the same conceptual component is borderline.                                                                                                                                                |
| 🟢       | Migrate inline back/cancel patterns to `BackNavigation.svelte`.                                                                                                                                                                                                                |
| 🟢       | Move `*.spec.ts` files out of the atoms folder (or document the convention). Tests next to source is fine, but it shows up in `ls` and signals clutter.                                                                                                                        |

---

## 7. Interactive Feedback 🟡

### Wins

- `LoadingButton.svelte` exists as a proper atom with spinner + disabled + aria-busy.
- `/questions/create/+page.svelte` correctly uses `aria-busy={loading}`, `disabled:opacity-60`, `disableClose={loading}` on the modal.
- `Comment.svelte` uses `active:scale-[0.98]` for tap feedback on primary buttons.

### Gaps

- `active:scale-[0.98]` appears in **only 7 places across the entire codebase** — most clickable elements have no tap-feedback state.
- No standard "save action → badge dot on saved tab" pattern visible. When a user saves a question/blog/comment, does the nav reflect it? (Worth verifying.)
- Inline gradient buttons re-implement loading style instead of using `LoadingButton`. The "consistency stack" principle from §4 applies here too.

### Actions

| Severity | Fix                                                                                                                                                                                                                                                                                                                                                                   |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🟡       | **Add tap feedback as a default to every primary/secondary button.** Bake `active:scale-[0.98]` into the `LoadingButton` (or shared button) component, then migrate one-off button classes to use it.                                                                                                                                                                 |
| 🟡       | Audit save/like/bookmark actions — when a user saves something, is there a visible state change _outside_ the action's immediate location? (E.g., a counter on the account icon? A badge on a tab?) Apply Kole's save-icon → badge-dot pattern. Most likely candidate: comment likes on `/questions/[slug]` should show feedback in the user's account avatar/header. |
| 🟢       | Replace inline gradient submit buttons in `Comment.svelte` and `/questions/create` with the canonical `LoadingButton` once it's the source of truth. This collapses three problems (effects, consistency, feedback) into one fix.                                                                                                                                     |

---

## 8. Charts 🟡

### EnneagramBarChart

Code at `src/lib/components/charts/EnneagramBarChart.svelte`:

```svelte
.bar-fill {
    background: linear-gradient(90deg, var(--color), color-mix(in srgb, var(--color) 80%, white));
    border-radius: 6px;  /* rounded bar tops — Kole's exact criticism */
}
.bar-track {
    height: 24px;
    background: var(--hover-background, var(--text-primary));
    border-radius: 6px;
}
```

- **Rounded tops on bars** ❌ Kole's exact crime — hard to tell where the bar ends.
- **Gradient fills** ❌ Kole says solid colors are clearer.
- No vertical axis or scale labels visible — only a percentage suffix on each row.

### LineChart

Code at `src/lib/components/charts/LineChart.svelte`:

- ✅ Has X and Y axes with labels and ticks.
- ✅ Shows trend pill (vs. previous 7 days), summary row (Total / Daily Avg / Peak).
- ❌ Uses an **SVG `feGaussianBlur` glow filter** on peak markers (`stdDeviation: 2`).
- ❌ Uses **gradient area fills** under the line (color → 2% transparency).
- Mixed: rounded line caps (`stroke-linecap: 'round'`) — fine for lines, but stylistic.

### StatCard

- Uses `filter: drop-shadow(0 0 3px var(--primary-glow))` on icons — same glow problem from §2.

### Actions

| Severity | Fix                                                                                                                                                                                                          |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 🟡       | **EnneagramBarChart:** flatten the bar fill to a solid `var(--color)`, remove the gradient. Drop bar-fill `border-radius` from 6px to 2px (just enough to soften pixel edges, not "rounded top" decorative). |
| 🟡       | **LineChart:** remove the `feGaussianBlur` glow filter on peak markers. Keep the peak marker as a solid filled circle with white stroke — that's already there and sufficient.                               |
| 🟢       | **LineChart:** flatten the gradient area fill to a single 8–12% alpha solid version of the line color.                                                                                                       |
| 🟢       | **StatCard:** remove `filter: drop-shadow(0 0 3px ...)` from icon variants.                                                                                                                                  |

---

## Cross-Cutting Recommendations

These show up across multiple mistakes and are the highest-leverage system fixes.

### 1. Single Source of Truth for Tokens

Currently three sources drift:

- `tailwind.config.ts` (borderRadius, boxShadow, spacing, colors)
- `src/scss/index.scss` (CSS variables for shadows, glows, radius, colors)
- Inline class attributes (ad-hoc `rounded-[Npx]`, `shadow-[0_0_20px_...]`)

**Fix:** Define tokens once in `index.scss` (CSS variables), reference them in `tailwind.config.ts` via `var(--token)`, ban arbitrary values in lint.

### 2. Canonical Atom Components

Build (or canonicalize existing) primitives:

- `<Button variant="primary | secondary | ghost" loading>` — replace inline gradient/glow buttons everywhere.
- `<Modal>` — single version (Modal2 candidate), delete the other two.
- `<EmptyState>` — for no-results / not-loaded / first-visit screens.
- `<Icon name="...">` — wraps the chosen icon library, enforces sizing and `currentColor`.

### 3. Lint Rules to Lock In Consistency

Add to `.eslintrc` / stylelint:

- Ban `rounded-2xl`, `rounded-3xl`, `rounded-\[.*\]`.
- Ban `shadow-\[.*\]` (force tokenized shadows).
- Ban `bg-gradient-to-` outside an allowlist (homepage hero, special components).
- Warn on inline `<svg>` tags in `.svelte` files (force usage of `<Icon>`).

---

## Prioritized Action Plan (4 Weeks)

### Week 1 — Highest impact, lowest risk

1. **Strip glow chains from buttons** — replace `bg-gradient-* + hover:shadow-[var(--glow-md)]` with solid color in `Comment.svelte`, `/questions/create`, `/questions/+page.svelte` banner. Keep one hero exception. (§2 🔴)
2. ✅ **Soften dark-mode shadows** — ~~change shadow color from `rgba(12,10,9,0.4)` to `rgba(45,212,191,0.08)` or similar, increase blur.~~ **Done 2026-04-27** — applied Kole's recipe (alpha 0.3-0.5 → 0.15-0.25, blur 2×, color simplified to neutral black). Tailwind `shadow-*` utilities now bind to `var(--shadow-*)`. (§2 🔴)
3. ✅ **Delete the two unused Modal components after migrating callers to Modal2.** **Done 2026-04-27** — Modal2 enhanced with `maxWidth` + `fullMobile` props, ModalNew's one caller migrated, both legacy modals deleted. `pnpm check` passes. (§4 🔴)
4. ✅ **Standardize primary submit shape** — `Comment.svelte` aligned to `rounded-full` to match `/questions/create`. **Done 2026-04-27.** (§4 🔴)

### Week 2 — Component canonicalization

4. **Pick the canonical primary button** and roll out across `Comment.svelte`, `/questions/create`, `/book-session`. (§4 🔴, §7 🟡)
5. **Adopt `lucide-svelte`** as the icon library. Replace icons in `Header.svelte` first (highest visibility). (§5 🔴)
6. **Delete dead components** — `MobileNav.svelte`, second Rubix/Skeleton, `NO-caseyNeistatCareer.svelte`. (§4 🔴, §6 🟡)

### Week 3 — Consistency and lint

7. **Standardize corner radius** — `rounded-md` for buttons/inputs/chips, `rounded-xl` for cards, `rounded-full` for avatars. Add stylelint rule. (§4 🔴)
8. **Migrate remaining icons** to `lucide-svelte` in route order: top-traffic first (`/personality-analysis`, `/questions`, `/`). (§5 🔴)
9. **Reconcile token sources** between `tailwind.config.ts` and `index.scss`. (Cross-cutting #1)

### Week 4 — Charts and polish

10. **Flatten EnneagramBarChart** — drop gradient and rounded bar tops. (§8 🟡)
11. **De-glow LineChart and StatCard** — remove SVG filter and drop-shadow. (§8 🟡)
12. **Build `<EmptyState>`** atom and wire into question search / blog search. (§1 🟢)
13. **Mobile spacing pass at 375px** on top 5 pages. (§3 🟡)

### Deferred (bigger projects)

- Replace `/enneagram-test` redirect with a real lightweight typing flow. (§1 🟡)
- Add "I don't know my type yet" path to `/book-session`. (§1 🟡)
- Save → badge-dot pattern in nav. (§7 🟡)

---

## What This Doesn't Cover

- **Accessibility.** Not Kole's framework. Worth a separate audit.
- **Performance.** Bundle size from icon migration may go down if we remove 27 svelte files for one tree-shaken library, but worth measuring.
- **Dark mode contrast ratios.** Touched indirectly via shadows; worth a real WCAG sweep separately.
- **Brand voice / copy.** Brand docs already cover this in `docs/brand/`.

---

## How to Measure Success

After each week, do a screenshot diff of the same 5 pages (`/`, `/questions`, `/questions/create`, `/book-session`, `/personality-analysis`) at desktop + 375px mobile. Look for:

- Less visual noise (gradients/glows removed)
- Consistent corner radii across visible buttons/cards/inputs
- Same icon family in nav and admin
- Charts that read as data first, decoration second

If the design _feels_ quieter and more confident, it's working. Kole: _"Less visual noise equals a better design."_

---

## Progress Log

### 2026-04-27 — Pass 1: Modals + button shape + dark shadows

**Status:** `pnpm check` passes with 0 errors. Pre-existing warnings unchanged.

#### 1. Modal consolidation (§4 🔴 → ✅)

**Before:** 3 modal components (`Modal.svelte`, `Modal2.svelte`, `ModalNew.svelte`)
**After:** 1 modal component (`Modal2.svelte`)

Caller distribution found during audit:

- `Modal2.svelte` → 12 callers (always imported as `Modal` in client code via aliasing)
- `ModalNew.svelte` → 1 caller (`/admin/asset-generators/question-print`)
- `Modal.svelte` (legacy) → 0 direct callers (only the dead barrel re-export in `atoms/index.ts`)

Changes:

- Enhanced `Modal2.svelte` with two backwards-compatible props: `maxWidth` (string, default `null`) and `fullMobile` (boolean, default `false`). Mobile-fullscreen styling added to support `fullMobile`.
- Migrated `/admin/asset-generators/question-print/+page.svelte`:
  - Replaced `import ModalNew` with `import Modal` + `getModal` from `Modal2.svelte`
  - Removed the `previewOpen` `$state` (registry pattern is imperative now)
  - `openPreview()` now calls `getModal('question-preview')?.open()`
  - `<ModalNew bind:open={previewOpen} ...>` → `<Modal id="question-preview" name="..." maxWidth="1120px" fullMobile={true}>`
  - Added `.modal-preview__title` style (since Modal2 doesn't render its own title bar)
- Deleted `src/lib/components/atoms/Modal.svelte`
- Deleted `src/lib/components/atoms/ModalNew.svelte`
- Updated `src/lib/components/atoms/index.ts` to re-export `Modal2` as `Modal` (the barrel is unused, but kept for future)

**Follow-up suggested but not done:** rename `Modal2.svelte` → `Modal.svelte` and update the 12 import paths. Deferred — pure rename, low priority, easy win for a later cleanup pass.

#### 2. Primary submit button shape (§4 🔴 → ✅)

**Before:**

- `Comment.svelte:549,676,824` → `rounded-xl` (3 primary submits)
- `Comment.svelte:539,669,817` → `rounded-xl` (3 paired cancel buttons)
- `/questions/create:345,395` → `rounded-full`

**After:** all 6 buttons in `Comment.svelte` → `rounded-full`. Matches `/questions/create`.

Form inputs (`<textarea>`, radio rows, alert blocks) intentionally kept `rounded-xl` — they're a different category and forcing pills on rectangular inputs would look wrong.

#### 3. Dark-mode shadows (§2 🔴 → ✅)

**Before** (`src/scss/index.scss` lines 153-157):

```scss
--shadow-sm: 0 1px 3px rgba(12, 10, 9, 0.3);
--shadow-md: 0 4px 6px rgba(12, 10, 9, 0.4);
--shadow-lg: 0 10px 15px rgba(12, 10, 9, 0.5);
--shadow-xl: 0 20px 25px rgba(12, 10, 9, 0.5);
--shadow-color: rgba(12, 10, 9, 0.5);
```

**After** (Kole's recipe — increase blur, lower alpha, change color):

```scss
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.15);
--shadow-md: 0 6px 16px rgba(0, 0, 0, 0.18);
--shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.22);
--shadow-xl: 0 24px 48px rgba(0, 0, 0, 0.25);
--shadow-color: rgba(0, 0, 0, 0.2);
```

Recipe applied:

- **Blur radii**: ~2× larger (3→8, 6→16, 15→32, 25→48)
- **Alpha**: cut from 0.3-0.5 down to 0.15-0.25
- **Color**: simplified from `rgba(12, 10, 9, X)` (near-black, slightly warm) to neutral `rgba(0, 0, 0, X)` (cleaner)

Plus, `tailwind.config.ts` `boxShadow` tokens now reference `var(--shadow-*)` so the Tailwind utilities (`shadow-sm`, `shadow-md`, etc.) auto-respond to theme. Light mode shadows (lines 302-306) were already appropriate — left unchanged.

The two `glow-teal` and `glow-rose` Tailwind tokens were left as-is for now. They're part of the bigger §2 effect-stripping pass, deferred to the next iteration.

#### Files touched

- `src/lib/components/atoms/Modal2.svelte` (added 2 props, full-mobile style block)
- `src/lib/components/atoms/Modal.svelte` — **deleted**
- `src/lib/components/atoms/ModalNew.svelte` — **deleted**
- `src/lib/components/atoms/index.ts` (single-export cleanup)
- `src/lib/components/molecules/Comment.svelte` (6 button class swaps)
- `src/routes/admin/asset-generators/question-print/+page.svelte` (Modal migration + new title style)
- `src/scss/index.scss` (dark-theme shadow tokens)
- `tailwind.config.ts` (shadow utilities → CSS vars)

#### What's still open from Week 1

- 🔴 Strip glow chains from buttons (gradient + glow combo) — deferred. Doing this requires a `<PrimaryButton>` extraction so we don't fan out a class-string surgery across 4+ files. Recommend pairing it with the §7 button-component canonicalization in Week 2.

---

### 2026-04-27 — Pass 2: Corner-radius standardization (§4 🔴 → ✅)

**Status:** `pnpm check` passes with 0 errors. `pnpm lint:radius` passes (246 .svelte files scanned, 0 violations).

#### What changed

**Token redefinition** in `tailwind.config.ts`:

```ts
borderRadius: {
  sm: '0.25rem',     // 4px — tiny inline things
  DEFAULT: '0.5rem', // 8px — legacy fallback
  md: '0.625rem',    // 10px — buttons/inputs/chips (Kole's pick) ← NEW
  lg: '0.75rem',     // 12px — DEPRECATED (lint-banned)
  xl: '1rem'         // 16px — cards/modals/banners
}
```

`md` was previously not defined in the extend, so it fell back to Tailwind's default of 6px. Now it's 10px — Kole's "10 pixels for small components" recipe baked into the token.

**Standard applied:**

| Class          | Use case                                                                |
| -------------- | ----------------------------------------------------------------------- |
| `rounded-sm`   | Tiny inline (e.g. 3.5×3.5px modified-marker badge)                      |
| `rounded-md`   | Buttons, inputs, textareas, chips, popovers, icon buttons, inner labels |
| `rounded-xl`   | Cards, modals, banners, alert cards, large containers                   |
| `rounded-full` | Pills, avatars, spinners (`animate-spin`), decorative dots              |

**Before vs after counts:**

| Class            | Before |            After |
| ---------------- | -----: | ---------------: |
| `rounded-md`     |     26 |           **63** |
| `rounded-xl`     |     17 |           **30** |
| `rounded-full`   |     25 |           **23** |
| `rounded-sm`     |      0 |            **1** |
| `rounded-lg`     |     28 |  **0** ❌ banned |
| `rounded-2xl`    |     10 |  **0** ❌ banned |
| `rounded-3xl`    |      2 |  **0** ❌ banned |
| `rounded` (bare) |      6 | **0** (replaced) |

**~70 class swaps across 16 files**:

- `EnneagramMentalIllnessPromo.svelte`, `BlogDiffViewer.svelte`, `WordCloud.svelte`, `email/+page.svelte` — `rounded-lg` → `rounded-xl` (cards/containers)
- `AIComments.svelte`, `Popover.svelte`, `categories/[slug]/+page.svelte`, `Interact.svelte`, `questions/+page.svelte`, `questions/[slug]/+page.svelte` — `rounded-lg` → `rounded-md` (buttons/inputs/chips)
- `Comment.svelte` — mixed: outer card → `rounded-xl`, icon button + textareas → `rounded-md`, plus 6 primary/cancel buttons reverted from `rounded-full` → `rounded-md`
- `ErrorBoundary.svelte` — alert cards → `rounded-xl`, action buttons → `rounded-md`
- `SmallPopCard.svelte` — outer card → `rounded-xl`, inner labels → `rounded-md`
- `Comments.svelte`, `QuestionDisplay.svelte`, `Interact.svelte`, `questions/+page.svelte` — `rounded-2xl` → `rounded-xl`
- `questions/create/+page.svelte` — `rounded-3xl` → `rounded-xl`, card containers `rounded-2xl` → `rounded-xl`, textareas → `rounded-md`, primary CTA buttons `rounded-full` → `rounded-md`
- `BackNavigation.svelte`, `QuestionItem.svelte`, `CategoryTree.svelte` — bare `rounded` → `rounded-md`

**Lint enforcement** added at `scripts/lint-radius.js`. Runs as part of `pnpm lint` (chained: `prettier --check && eslint && pnpm lint:radius`). Output:

```
✓ Radius lint passed — scanned 246 .svelte files, no banned classes found.
```

If anyone reintroduces `rounded-lg`, `rounded-2xl`, `rounded-3xl`, or `rounded-[Npx]` it fails with file:line, the snippet, and a hint pointing at the right token.

#### Knock-on effect

The `rounded-md` redefinition (6 → 10px) softens the existing 26 `rounded-md` uses by 4px — mainly badges, focus rings, small chips, and form inputs. Mild visual nudge, all in the right direction.

The 8 primary submit buttons that became `rounded-full` last session reverted to `rounded-md` per Option A. If after eyeballing live you want pills back, easy carve-out — but the rule wins by default.

#### Files touched

- `tailwind.config.ts`
- `package.json` (added `lint:radius` script, chained into `lint`)
- `scripts/lint-radius.js` — **new**
- 16 `.svelte` files (sweep)
- `docs/design/2026-04-27-ui-audit-kole-jain-8-mistakes.md` (this doc)
