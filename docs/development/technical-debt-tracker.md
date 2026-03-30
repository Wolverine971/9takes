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
2. Dual-value Svelte 5 and typecheck hotspots in shared components and route shells
3. Repo-wide `npm run check` backlog
4. Dependency upgrade planning for packages with large major-version gaps
5. Final rollout step for the new error-tracking migration

---

## Recently Fixed On March 29, 2026

- Migrated 10 shared Svelte components to `$props`/runes, including `SEOHead`, `BlogPageHead`, `PeopleBlogPageHead`, `ModalNew`, and the shared question/blog display components
- Follow-up Svelte pass migrated `ComboBox.svelte` and `SearchQuestion.svelte` to runes-style props/state, removed `ComboBox` from the top Svelte/typecheck hotspot list, and typed the shared `onClickOutside` action in `Context.svelte`
- Removed deprecated npm config keys from `.npmrc`, which stopped the related `npm` warnings
- Removed the unused deprecated provider-routing helpers from `src/utils/server/smart-llm-service.ts`
- Replaced the logger TODO with a concrete production server error sink in `src/lib/utils/logger.ts`, backed by `src/lib/server/errorTracking.ts`
- Added `supabase/migrations/20260329_add_app_error_events.sql` to persist tracked application errors
- Upgraded `@fingerprintjs/fingerprintjs` from `^4.5.0` to `^5.1.0`

---

## 1. Svelte 5 Migration Backlog

**Status**: In progress, no repo-wide codemod applied
**Impact**: Mixed component style, slower adoption of Svelte 5 runes
**Effort**: Large

The project already runs `svelte@^5.46.1`, but a large part of the UI still uses legacy component syntax. That is not broken by itself, but it keeps the codebase split between two mental models.

### Verified inventory

Progress note: the current migration passes have converted 12 shared components plus the shared search wrapper `SearchQuestion.svelte` to `$props`/runes on March 29, 2026. The counts below reflect the post-migration state after those passes.

| Legacy pattern             | Files | Matches | Notes                                           |
| -------------------------- | ----- | ------- | ----------------------------------------------- |
| `export let` props         | 132   | 408     | Largest migration surface                       |
| `$:` reactive declarations | 55    | 155     | Some map to `$derived`, some need `$effect`     |
| `onMount(`                 | 67    | 68      | Browser-only setup; not all should be converted |
| `onDestroy(`               | 20    | 20      | Mostly teardown logic                           |
| `createEventDispatcher(`   | 11    | 11      | Candidate for callback props                    |

### Completed so far

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
- `src/lib/components/molecules/ComboBox.svelte`
- `src/lib/components/questions/SearchQuestion.svelte`

### High-concentration files

- `src/lib/components/atoms/PopCard.svelte` has 11 `export let` declarations
- `src/lib/components/charts/LineChart.svelte` has 11 `export let` declarations
- `src/lib/components/map/Marker.svelte` has 11 `export let` declarations
- `src/lib/components/blog/TableOfContents.svelte` mixes 10 `export let`, 4 reactive declarations, and 2 lifecycle hooks
- `src/lib/components/map/Map.svelte` mixes 10 `export let` declarations and one dispatcher
- `src/lib/components/charts/StatCard.svelte` still has 9 `export let` declarations
- `src/lib/components/atoms/SmallPopCard.svelte` still has 9 `export let` declarations
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

**Status**: In progress
**Impact**: Security, missing features, API drift
**Effort**: Medium to high

Current versions below are the declared versions in `package.json`, and latest versions were checked against npm on March 29, 2026. Because the repo uses caret ranges, the installed patch or minor version in the lockfile may be slightly newer.

Progress note: `@fingerprintjs/fingerprintjs` was upgraded from `^4.5.0` to `^5.1.0` on March 29, 2026 and verified against the existing `Interact.spec.ts` test.

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
| `@sveltejs/vite-plugin-svelte` | `^6.2.4`   | `7.0.0`  | +1 major |
| `jspdf`                        | `^3.0.1`   | `4.2.1`  | +1 major |
| `supabase` (CLI)               | `^1.192.5` | `2.84.4` | +1 major |

### Notes

- Do not mass-upgrade all of these together
- Treat lint stack upgrades, build stack upgrades, and runtime SDK upgrades as separate efforts
- `flowbite` and `flowbite-svelte` should be evaluated together
- `@sveltejs/vite-plugin-svelte` should be considered alongside the current SvelteKit version, not in isolation

---

## 4. Repo-wide Typecheck and Compiler Backlog

**Status**: Open, verified with `npm run check`
**Impact**: Prevents a clean static check baseline and makes new regressions harder to spot
**Effort**: Large

The current repo-wide check run reports **299 errors and 207 warnings in 77 files**. This is a separate debt bucket from Svelte 5 migration work: some files overlap, but a large share of the backlog is plain TypeScript, Sass, and stale CSS noise.

### Dominant diagnostic buckets

These are counts of reported occurrences in the current `npm run check` output, not normalized root-cause groups.

- 105 `css_unused_selector` warnings
- 87 diagnostics containing `implicitly has an 'any' type`
- 66 `Type '...' is not assignable to type '...'` errors
- 14 `No index signature ...` errors
- 10 Sass `slash-div` deprecation warnings
- 8 `No overload matches this call` errors
- 2 missing declaration-file errors (`opentype.js`, `d3-cloud`)
- 1 remaining `<slot>` deprecation warning

### Highest-volume files in the current output

- `src/routes/admin/comments/+page.svelte` (30)
- `src/lib/components/molecules/rubixDisplay2.svelte` (29)
- `scripts/personBlogParser.js` (26)
- `src/routes/admin/links/[slug]/+page.svelte` (24)
- `src/routes/admin/content-board/+page.svelte` (20)
- `src/lib/components/molecules/WordCloud.svelte` (19)
- `src/routes/admin/email-dashboard/+page.svelte` (17)
- `src/routes/admin/content-board/MetadataSidebar.svelte` (17)
- `src/lib/components/molecules/rubixGrid.svelte` (17)
- `src/routes/test-solo-leveling/+page.svelte` (16)

### Most actionable next splits

- Shared Svelte hotspots: `Comments.svelte`, `TableOfContents.svelte`, `src/routes/+layout.svelte`, and `src/routes/personality-analysis/[slug]/+page.svelte` can reduce both Svelte 5 legacy syntax and check noise in one pass
- JS/TS typing cleanup: `scripts/personBlogParser.js` and several admin routes still rely on implicit `any`, loose indexing, and null-unsafe assumptions
- Sass cleanup: replace deprecated slash division with `math.div(...)`
- CSS warning triage: remove or scope stale selectors instead of carrying forward `css_unused_selector` noise
- Third-party typing gaps: add local module declarations for `opentype.js` and `d3-cloud` unless those packages are removed

---

## 5. Small Verified Cleanup Items

**Status**: Mostly completed
**Impact**: Low to medium
**Effort**: Small

- Done: `.npmrc` no longer contains `shamefully-hoist=true` or `auto-install-peers=true`, and `npm view` no longer emits the related warnings.
- Done: `src/utils/server/smart-llm-service.ts` no longer contains the deprecated provider-routing helpers (`getProviderPreferences`, `enforceToolSafeProviderPrefs`).
- Done: `src/lib/utils/logger.ts` now forwards production server errors to a concrete tracking sink, backed by `src/lib/server/errorTracking.ts`.
- Follow-up: apply the new Supabase migration `supabase/migrations/20260329_add_app_error_events.sql` anywhere the database schema needs to be synced before relying on persisted error events.

---

## Approach

1. Fix shared theme-token debt first, especially modal overlays, shared navigation, shared cards, and marketing/editor surfaces
2. Prioritize files that reduce both Svelte 5 legacy syntax and `npm run check` volume, especially `Comments.svelte`, `TableOfContents.svelte`, `src/routes/+layout.svelte`, `src/routes/personality-analysis/[slug]/+page.svelte`, and high-noise admin routes
3. Burn down the static-check backlog by category instead of file-by-file thrash:
   - implicit `any`
   - index-signature/nullability errors
   - stale CSS selectors
   - Sass slash-division warnings
   - missing module declarations
4. Keep the small-cleanup track closed by applying `supabase/migrations/20260329_add_app_error_events.sql` anywhere the schema is managed
5. Plan dependency upgrades as separate tracks:
   - Lint stack
   - Build stack
   - UI component libraries
   - Runtime SDKs
6. Treat broad literal-color searches as triage inputs, not as automatic replace lists
