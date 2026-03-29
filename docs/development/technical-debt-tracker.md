<!-- docs/development/technical-debt-tracker.md -->

# Technical Debt Tracker

Last verified: 2026-03-29

---

This document tracks technical debt that is verified in the current tree. Counts below were checked on March 29, 2026 with local code search, and dependency versions were spot-checked against the npm registry on the same date.

Out of scope for this tracker:

- Editorial TODOs in `src/blog/**`
- One-off experiments and demos unless they share code with production UI
- Blind search-and-replace work that has not been triaged

## Priority Summary

1. Theme token debt in shared UI
2. Svelte 5 legacy syntax in high-reuse components
3. Dependency upgrade planning for packages with large major-version gaps
4. Small cleanup items that already produce warnings or are clearly dead code

---

## 1. Svelte 5 Migration Backlog

**Status**: In progress, no repo-wide codemod applied
**Impact**: Mixed component style, slower adoption of Svelte 5 runes
**Effort**: Large

The project already runs `svelte@^5.46.1`, but a large part of the UI still uses legacy component syntax. That is not broken by itself, but it keeps the codebase split between two mental models.

### Verified inventory

Progress note: the first migration pass converted 10 shared components to `$props`/runes on March 29, 2026. The counts below reflect the post-migration state after that pass.

| Legacy pattern             | Files | Matches | Notes                                           |
| -------------------------- | ----- | ------- | ----------------------------------------------- |
| `export let` props         | 134   | 421     | Largest migration surface                       |
| `$:` reactive declarations | 57    | 160     | Some map to `$derived`, some need `$effect`     |
| `onMount(`                 | 67    | 68      | Browser-only setup; not all should be converted |
| `onDestroy(`               | 20    | 20      | Mostly teardown logic                           |
| `createEventDispatcher(`   | 13    | 13      | Candidate for callback props                    |

### Completed in first pass

- `src/lib/components/SEOHead.svelte`
- `src/lib/components/blog/BlogPageHead.svelte`
- `src/lib/components/questions/QuestionDisplay.svelte`
- `src/lib/components/questions/QuestionTags.svelte`
- `src/lib/components/blog/Breadcrumbs.svelte`
- `src/lib/components/blog/AuthorBio.svelte`
- `src/lib/amp-stories/EnneagramMentalIllnessPromo.svelte`
- `src/lib/components/questions/QuestionItemWrapper.svelte`
- `src/lib/components/atoms/ModalNew.svelte`
- `src/lib/components/blog/PeopleBlogPageHead.svelte`

### High-concentration files

- `src/lib/components/molecules/ComboBox.svelte` has 12 `export let` declarations
- `src/lib/components/atoms/PopCard.svelte` has 11 `export let` declarations
- `src/lib/components/charts/LineChart.svelte` has 11 `export let` declarations
- `src/lib/components/map/Marker.svelte` has 11 `export let` declarations
- `src/lib/components/blog/TableOfContents.svelte` mixes 10 `export let`, 4 reactive declarations, and 2 lifecycle hooks
- `src/lib/components/map/Map.svelte` mixes 10 `export let` declarations and one dispatcher
- `src/lib/components/molecules/Comments.svelte` mixes 8 `export let`, 5 reactive declarations, and 2 lifecycle hooks
- `src/routes/personality-analysis/[slug]/+page.svelte` still has 11 reactive declarations
- `src/routes/+layout.svelte` still uses legacy props, reactivity, and lifecycle hooks in a top-level shell

### Guardrails

- Do not rewrite every `onMount` or `onDestroy` to `$effect`; lifecycle hooks are still reasonable for browser-only setup and teardown
- Migrate shared components and route layouts first; leaf components can move opportunistically
- Avoid a big-bang rewrite unless test coverage improves first

---

## 2. Theme Token Debt and Light-Mode Risk

**Status**: In progress
**Impact**: User-visible inconsistency, especially in light mode
**Effort**: Medium to large

`src/scss/index.scss` already defines both dark and light theme tokens such as `--bg-base`, `--text-primary`, `--primary`, `--primary-glow`, `--primary-subtle`, and `--error`. The debt here is not missing tokens; it is components bypassing them.

### 2a. Verified dark overlays and shadows

Raw `rgba(0, 0, 0, 0.3+)` appears 58 times in 39 files.

Highest-value shared/UI files to fix first:

- `src/lib/components/atoms/ModalNew.svelte`
- `src/lib/components/molecules/MobileNav.svelte`
- `src/lib/components/molecules/MobileNavNew.svelte`
- `src/lib/components/molecules/RelatedPosts.svelte`
- `src/lib/components/atoms/PopCardGroup.svelte`
- `src/lib/components/atoms/SmallPopCard.svelte`
- `src/lib/components/questions/QuestionSocialCardTemplate.svelte`
- `src/lib/components/marketing/Calendar.svelte`
- `src/lib/components/marketing/ContentEditor.svelte`
- `src/lib/components/marketing/TemplateManager.svelte`
- `src/lib/components/marketing/ContentDetailModal.svelte`
- `src/routes/admin/+layout.svelte`
- `src/routes/admin/content-board/ContentEditorModal.svelte`

Use existing shadow and glow tokens where possible instead of fixed black overlays.

### 2b. Hardcoded primary teal values

Raw `rgba(45, 212, 191, ...)` appears 231 times in 43 files.

Top offenders:

- `src/routes/+page.svelte` (28)
- `src/routes/personality-analysis/+page.svelte` (23)
- `src/routes/about/+page.svelte` (21)
- `src/lib/components/molecules/comment.scss` (13)
- `src/routes/pop-culture/+page.svelte` (11)
- `src/routes/admin/asset-generators/question-print/+page.svelte` (10)
- `src/routes/enneagram-corner/+page.svelte` (10)
- `src/routes/pop-culture/[slug]/+page.svelte` (10)

This is a real theme problem because the raw dark-theme teal values cannot rebalance for light mode. Prefer `--primary`, `--primary-glow`, `--primary-subtle`, and `color-mix(...)` with those tokens.

### 2c. Hardcoded semantic error colors

Raw `#ef4444` and `#dc2626` appear 67 times in 29 files.

Top offenders:

- `src/lib/components/marketing/ContentEditor.svelte` (5)
- `src/routes/admin/comments/+page.svelte` (5)
- `src/routes/admin/consulting/sessions/[id]/+page.svelte` (5)
- `src/lib/components/marketing/TemplateManager.svelte` (4)
- `src/routes/admin/consulting/clients/[id]/+page.svelte` (4)
- `src/lib/components/marketing/ContentDetailModal.svelte` (3)
- `src/routes/admin/consulting/sessions/+page.svelte` (3)

These should converge on `--error`, `--error-700`, and any route-level status tokens we choose to standardize.

### 2d. One-off palette escapes

These are small but concrete:

- `src/routes/questions/create/+page.svelte` hardcodes `#10111f`
- `src/lib/components/questions/QuestionSocialCardTemplate.svelte` hardcodes `#10111f`
- `src/lib/components/molecules/LinkMap.svelte` hardcodes `#ee8a65`

Each of these should either move to theme tokens or be documented as an intentional brand exception.

### 2e. Broad white/black search is not a ready-made fix list

Searching for `#fff`, `#000`, `white`, and `black` returns 460 matches across 122 non-icon files.

That result is too noisy to treat as a direct work queue. It includes intentional SVG fills, text on gradients, and route-specific art direction. Use it as a triage source, not as a blanket replace target.

---

## 3. Dependency Upgrade Queue

**Status**: Planning only
**Impact**: Security, missing features, API drift
**Effort**: Medium to high

Current versions below are the declared versions in `package.json`, and latest versions were checked against npm on March 29, 2026. Because the repo uses caret ranges, the installed patch or minor version in the lockfile may be slightly newer.

### Highest-risk gaps

| Package                | Declared   | Latest   | Gap        | Notes                                |
| ---------------------- | ---------- | -------- | ---------- | ------------------------------------ |
| `stripe`               | `^11.18.0` | `21.0.1` | +10 majors | Likely webhook and API-surface churn |
| `@vavite/node-loader`  | `^1.8.3`   | `5.1.0`  | +4 majors  | Dev/runtime integration risk         |
| `postcss-preset-env`   | `^7.8.3`   | `11.2.0` | +4 majors  | Build pipeline behavior may shift    |
| `eslint`               | `^8.57.1`  | `10.1.0` | +2 majors  | Config and plugin compatibility      |
| `@typescript-eslint/*` | `^6.21.0`  | `8.57.2` | +2 majors  | Should move with ESLint              |
| `flowbite`             | `^2.5.1`   | `4.0.1`  | +2 majors  | Component and styling API drift      |
| `postcss-load-config`  | `^4.0.2`   | `6.0.1`  | +2 majors  | Build tooling change surface         |

### Next wave

| Package                        | Declared   | Latest   | Gap      |
| ------------------------------ | ---------- | -------- | -------- |
| `flowbite-svelte`              | `^0.46.16` | `1.33.0` | +1 major |
| `@elastic/elasticsearch`       | `^8.15.0`  | `9.3.4`  | +1 major |
| `@fingerprintjs/fingerprintjs` | `^4.5.0`   | `5.1.0`  | +1 major |
| `@sveltejs/vite-plugin-svelte` | `^6.2.4`   | `7.0.0`  | +1 major |
| `jspdf`                        | `^3.0.1`   | `4.2.1`  | +1 major |
| `supabase` (CLI)               | `^1.192.5` | `2.84.4` | +1 major |

### Notes

- Do not mass-upgrade all of these together
- Treat lint stack upgrades, build stack upgrades, and runtime SDK upgrades as separate efforts
- `flowbite` and `flowbite-svelte` should be evaluated together
- `@sveltejs/vite-plugin-svelte` should be considered alongside the current SvelteKit version, not in isolation

---

## 4. Small Verified Cleanup Items

**Status**: Ready
**Impact**: Low to medium
**Effort**: Small

- `.npmrc` still contains `shamefully-hoist=true` and `auto-install-peers=true`. Every `npm view` command emitted warnings that both keys are unknown project config for npm and will stop working in a future major.
- `src/utils/server/smart-llm-service.ts` still contains deprecated provider-routing helpers (`getProviderPreferences`, `enforceToolSafeProviderPrefs`). A repo search on March 29, 2026 found no references outside that class, so they are good candidates for removal after one more call-site check.
- `src/lib/utils/logger.ts` still has a TODO placeholder for production error tracking.

---

## Approach

1. Fix shared theme-token debt first, especially modal overlays, shared navigation, shared cards, and marketing/editor surfaces
2. Migrate Svelte 5 syntax in high-reuse components when those files are already being touched
3. Batch the small cleanup items early because they reduce noise and remove dead code
4. Plan dependency upgrades as separate tracks:
   - Lint stack
   - Build stack
   - UI component libraries
   - Runtime SDKs
5. Treat broad literal-color searches as triage inputs, not as automatic replace lists
