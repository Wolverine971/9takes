<!-- docs/design/hyperplexed/STYLE_SYSTEM_MAINTENANCE_BACKLOG_2026-08-03.md -->

# Style System Maintenance Backlog

Date: 2026-08-03  
Status: Active working backlog  
Scope: Styling architecture, design-system consistency, responsive behavior, primitives, and guardrails

## Scope boundary

Dialog and radius findings are intentionally excluded from this backlog because they are already being
handled in a separate active workstream. Do not fold dialog or radius changes into the waves below
without coordinating that work first.

The user-authorized 2026-09-01 UI follow-up coordinated those workstreams. Its modal, form-ownership,
and radius results are recorded below; the remaining hand-built admin dialogs stay in the dedicated
dialog backlog.

This backlog stacks on:

- `docs/design-system.md`
- `docs/design/2026-06-09-design-audit.md`
- `docs/design/2026-06-11-mobile-audit.md`
- `docs/design/hyperplexed/SITE_WIDE_AUDIT_2026-07-04.md`
- `docs/design/hyperplexed/HYPERPLEXED_AUDIT_TRACKER.md`

## Current assessment

The Streetlamp Symposium V5 direction is strong and should be preserved. The main problem is not the
visual identity; it is implementation sprawl. Component styling currently lives across global SCSS,
scoped Svelte styles, Tailwind utilities, and duplicated styleguide specimens. Core public routes are
substantially more coherent than admin and legacy surfaces.

Static inventory from the 2026-08-03 audit:

| Measure                                                   |            Snapshot |
| --------------------------------------------------------- | ------------------: |
| Svelte files                                              |                 271 |
| Svelte files with style blocks                            |                 219 |
| Scoped Svelte style lines                                 |             ~63,500 |
| Standalone SCSS/CSS lines                                 |              ~4,100 |
| Files over 1,000 lines                                    |                  38 |
| Style blocks over 300 lines                               |                  74 |
| Media-query declarations                                  |                 528 |
| Distinct breakpoints                                      |                  49 |
| Distinct padding values                                   |                 579 |
| Distinct font-size values                                 |                 205 |
| Distinct box-shadow values                                |                 127 |
| Inline SVG elements                                       |  88 across 35 files |
| `:global(...)` references                                 | 512 across 85 files |
| `!important` declarations                                 |                  78 |
| Apparently unreferenced components requiring confirmation |         At least 14 |

These counts include admin, asset-generation, reference, and archive surfaces. They are directional
maintenance signals, not rules that every distinct value is automatically wrong.

## Principles for the cleanup

1. Preserve the V5 visual identity and the already-verified public-route behavior.
2. Svelte components own component semantics; global SCSS owns tokens, reset, and universal defaults.
3. Migrate route by route. Do not attempt a whole-site CSS rewrite.
4. Prefer production primitives in `/styleguide`; avoid parallel specimen implementations.
5. Introduce ratchets for new work before forcing broad mechanical rewrites of old work.
6. Keep Enneagram symbols, type colors, contained portrait violet, and asset-generator styling as
   documented exceptions rather than forcing them into ordinary UI rules.

## Tier 1 - cheap, high-impact

- [x] **Invalid admin warning surfaces.** Replace two references to undefined `--night` with a valid
      V5 surface token so the warning background declaration is not discarded. -> P13
- [x] **Skeleton contrast and duplication.** Consolidate the two Skeleton implementations, give the
      canonical atom visible theme-aware contrast, and migrate both consumers. -> P11+P13
- [x] **Mobile form zoom.** Keep editable public controls at 16px on mobile while retaining denser
      desktop typography. Initial targets: BlogPurpose signup, Enneagram CTA sidebar, and question-case
      input. -> P12+P13
- [x] **Dormant effect mixins.** Remove the six unused glow/card/input mixins that advertise obsolete
      `transition: all`, lift, static-shadow, and glow recipes. Keep responsive/reduced-motion mixins. -> P11
- [x] **Stale source-of-truth statements.** Correct design-system claims about the styleguide, locked
      brand mood, reduced-motion guard, partial Lucide adoption, Empty/Error atoms, and the canonical
      SectionKicker. -> P13
- [ ] **Warning cleanup ratchet.** Burn down unused selector and accessibility warning noise in small
      component batches so new warnings are visible. Baseline on 2026-08-03: 141 warnings in 44 files. -> P13

## Tier 2 - structural cleanup

### A. Reduce global CSS reach

- [ ] Move component semantics out of bare/global `main`, `section`, `article`, `figure`, table,
      `.card`, `.panel`, `.container`, `.row`, form, and glass-card selectors. Keep only tokens, reset,
      baseline typography, focus defaults, and truly universal utilities in `index.scss`. -> P3+P11+P13
- [ ] Audit global anchor glow behavior. Links should not all receive the same text glow or transition
      contract regardless of context. -> P11+P19
- [ ] Make borders visibly separate surfaces; retire stone-on-stone borders in legacy `.card`,
      `.panel`, and `.form-input` rules. -> P3+P13

### B. Retire the parallel global component library

- [x] Inventory literal and dynamic consumers of `src/scss/components.scss`. See
      `GLOBAL_COMPONENT_CSS_INVENTORY_2026-08-03.md`.
- [x] Migrate global form, modal, spinner, card, badge, tab, notification, and question-card classes to
      owned Svelte components or explicitly scoped utilities. The canonical modal now owns its shell;
      remaining raw admin dialogs have local presentation pending lifecycle migration. -> P13
- [x] Remove migrated sections from the global bundle instead of keeping compatibility copies.
      `components.scss` is now comment-only and guarded against reintroducing retired families.
- [x] Set and ratchet a global-CSS budget after the first removal wave.

### C. Make `/styleguide` executable documentation

- [x] Render the real Button, form controls, Skeleton, Spinner/loading state, status states, and other
      production primitives rather than cloning their CSS under `sg-*` selectors. -> P13
- [ ] Distinguish locked production specimens from proposed components.
- [x] Add dark/light and mobile/desktop screenshot regression coverage for the actual primitives.
- [ ] Keep the contained-violet exact-asset fixture as a deliberate media exception. -> P20

### D. Complete the primitive set

- [x] Build canonical `Field`, `Input`, `Textarea`, and `Select` components. This is the largest missing
      component family and should replace raw/global/route-local form styling over time. -> P13
- [x] Adopt EmptyState and ErrorState in production and consolidate their shared behavior through an
      internal status-state shell. -> P13
- [x] Define one Spinner/loading indicator contract alongside the canonical Skeleton. -> P11+P13
- [ ] Establish shared admin `Panel`, `Toolbar`, `FilterBar`, `DataTable`, and `StatusBadge` primitives.
      Treat `admin-mobile.css` as a migration layer, not the final abstraction. -> P3+P7+P12+P13
- [ ] Finish ordinary UI icon convergence on Lucide. Preserve custom Enneagram and signature brand
      marks as explicit exceptions. -> P9

### E. Normalize spacing, typography, and responsive behavior

- [ ] Introduce a new-code ratchet for arbitrary padding, gap, font-size, max-width, and shadow values.
      Allow documented fluid-layout and asset-generator exceptions. -> P3+P4+P13
- [ ] Create reusable text roles for display, section title, body, secondary body, metadata, mono label,
      and control text instead of reconstructing hierarchy per route. -> P4+P5
- [ ] Standardize viewport breakpoints around a short Tailwind-aligned set. Resolve the current
      769-799px gap and 800px overlap in `_mixins.scss`. -> P3+P12
- [ ] Use container queries for reusable components whose layout depends on allocated width rather
      than viewport width. -> P12
- [ ] Continue requiring `dvh` fallbacks and safe-area padding for viewport-filling mobile surfaces.
      -> P12

### F. Lock the motion system

- [ ] Ratify duration tokens: instant 0ms, fast 100ms, base 180ms, slow 280ms. -> P11
- [ ] Ratify `ease-out-soft` and `ease-in-out-soft`; avoid spring motion for ordinary 9takes UI. -> P11
- [ ] Replace `transition: all` with explicit properties as touched. -> P11
- [ ] Keep the global reduced-motion guard and gate signature motion with
      `prefers-reduced-motion: no-preference`. -> P11
- [ ] Do not add new ambient glows/lifts until the existing effect debt is reduced. -> P14-P19

### G. Contain local palette duplication

- [ ] Remove or alias the duplicated dark/light V5 palette inside `EnneagramTypeDossier.svelte`; its
      local data color has already drifted from the global role. -> P19+P20
- [ ] Decide whether `EnneagramTypingFlow.svelte` is a true portable embed. If it is, alias its
      `--tf-*` roles to global defaults; otherwise use global roles directly. -> P20
- [ ] Document permitted raw colors for brand assets, email/print output, charts, and asset generators
      so those exceptions do not become interface precedents. -> P19+P20

### H. Remove confirmed dead and legacy styling

- [ ] Confirm external/dynamic use, then archive or delete the currently self-only components:
      `AdminMessageReceiver`, `CorpusStatsPanel`, `NO-caseyNeistatCareer`, `StructuredBlogView`,
      `HornevianMatrix`, `contentCard`, `PersonSuggestion`, `SuggestionsPeople`, `DateTip`, `WordCloud`,
      `jumbotron`, `PeopleBoard`, `FamousTypes`, and `Carousel`. -> P13+P20
- [ ] Remove the stale Solo Leveling CSS and local Tailwind utility recreations from
      `QuestionItem.svelte` after checking the active user changes in that file. -> P11+P13+P20
- [ ] Add a soft component-size budget and flag new style blocks over 300 lines for review.

## Tier 3 - guardrails and long-term polish

- [ ] Add undefined CSS custom-property detection for statically resolvable references. -> P13
- [ ] Add a mobile-form lint for editable controls below 16px. -> P12+P13
- [ ] Add a `transition: all` ratchet. -> P11
- [ ] Add a small semantic z-index scale for header, dropdown, overlay, modal, and toast layers; document
      asset-generator exceptions. -> P13
- [ ] Add raw-color and arbitrary-spacing ratchets that permit explicit data/media exceptions. -> P19+P20
- [x] Add styleguide visual regression screenshots in dark/light at desktop and iPhone widths.
- [ ] Re-run a focused visual audit after each structural wave; do not add a signature effect unless a
      surface has earned one and the effect remains unique. -> P14-P18

## Recommended work sequence

### Wave 1 - small corrections

Status: shipped in the working tree on 2026-08-03.

1. Repair invalid surface variables.
2. Consolidate Skeleton and migrate its two consumer paths.
3. Protect mobile public form inputs from browser zoom.
4. Remove unused effect mixins.
5. Correct stale design-system/styleguide statements.

### Wave 2 - primitives and executable styleguide

Status: shipped in the working tree on 2026-08-03.

1. Build the form-control family.
2. Adopt EmptyState/ErrorState in two representative production flows.
3. Lock Spinner/loading behavior.
4. Replace duplicated styleguide specimens with actual primitives.
5. Add primitive screenshot coverage.

### Wave 3 - global CSS reduction

Status: component-library migration complete. The final form/modal/card slice and 6-line ratchet
shipped on 2026-09-01; bare-element cleanup in `index.scss` remains separate.

1. Inventory `components.scss` consumers. **Complete.**
2. Move form/card/loading rules first. **Complete. Loading, question, form, header, card, modal, tab,
   badge/tag, and notification ownership is explicit.**
3. Reduce bare-element layout styling in `index.scss`.
4. Establish and lower a global-CSS budget. **Ratchet active and lowered from 781 to 6; retired
   badge/tag, form, modal, and base-card selectors are rejected explicitly.**

### Wave 4 - responsive and admin normalization

1. Standardize breakpoints and add container-query guidance.
2. Create shared admin surface primitives.
3. Normalize z-index and viewport-height handling.
4. Continue warning cleanup in authenticated admin surfaces.

### Wave 5 - ratchets and deletion

1. Add CSS-variable, mobile-input, motion, and arbitrary-value guardrails.
2. Delete confirmed dead components and their styles.
3. Remove local palette copies where portability is not required.
4. Re-run repository-wide static and visual inventories and set the next baseline.

## Verification baseline

Before Wave 1:

- `pnpm lint:colors`: pass.
- `pnpm exec eslint .`: pass.
- `pnpm check`: 0 errors, 141 warnings in 44 files.
- Existing public-route live audit: representative desktop/mobile routes passed landmarks, overflow,
  image, resource, and hydration checks.

After Wave 1:

- Targeted ESLint for Wave 1 source files: pass with zero errors. The styleguide route is intentionally
  ignored by the repository ESLint configuration.
- Targeted Prettier for the new backlog and Wave 1 source files: pass.
- `pnpm lint:colors`: pass; 1,540 files scanned with no retired palette or bridge-token drift.
- `pnpm test`: pass; 112 files and 542 tests.
- `git diff --check`: pass.
- Canonicalization search: no remaining `SkeletonLoader`, `var(--night)`, deleted effect-mixin
  declarations, or deleted effect-mixin consumers under `src/`.
- Repository-wide `pnpm check`: reverified after the radius/dialog work advanced; zero errors.
- The Svelte autofixer package is not installed locally; the no-install invocation stalled and was
  terminated. Svelte compiler diagnostics from `pnpm check` and targeted ESLint were used instead.

After Wave 2:

- Added the canonical form family: `Field`, `Input`, `Textarea`, and `Select`. Controls carry visible
  focus/error/disabled states, preserve a 16px mobile font size, and allow a compact desktop density.
- Consolidated EmptyState and ErrorState through an internal `StatusState` shell. Production adoption
  now covers filtered/first-use content states in `ContentManager` and related-content errors in
  `RelatedPosts`.
- Locked the canonical Spinner size/tone/label/reduced-motion behavior and removed its parallel global
  component block. `RelatedPosts` now uses the atom for loading.
- `/styleguide` renders the production Button, form, Spinner, Skeleton, EmptyState, and ErrorState
  components. The duplicate `sg-btn`, `sg-input`, `sg-spinner`, and `sg-state` implementations are gone.
- Corrected the styleguide document outline: one main landmark and one h1. `IndexHero` now accepts a
  semantic heading level for embedded documentation while retaining h1 by default on listing pages.
- Added `e2e/styleguide-components.spec.ts` plus 24 focused baselines: six component families in dark
  and light mode at iPhone and desktop widths.
- `pnpm check`: pass, zero errors. The run reported 134 existing warnings in 42 files; no new primitive
  diagnostic was introduced.
- `pnpm test`: pass, 112 files and 542 tests.
- `pnpm test:smoke`: pass, all 20 route, semantic, responsive, and visual-regression cases.

After Wave 3 ownership slices 1-7:

- Inventoried every `components.scss` family and its explicit consumers or generic-name collision
  surfaces in `GLOBAL_COMPONENT_CSS_INVENTORY_2026-08-03.md`.
- Replaced the QuestionSearch and personality-dossier loaders with the canonical Spinner and moved
  Toast styling into its owning component.
- Removed duplicated Tailwind utilities plus the confirmed-dead `QuestionTags.svelte` component and
  its five-selector global family.
- Migrated login, register, forgot/reset password, and book-session to the canonical Field/Input/
  Select/Textarea family. Removed their duplicate control CSS, added persistent login failures, and
  introduced one overflow-safe CAPTCHA frame shared by the public forms.
- Moved the public header/navigation family into Header and MobileNav, preserved explicit admin-nav
  focus/type and poster-wordmark type contracts, and removed the unused global `.active-link` rule.
- Moved the full listing-card contract into the mental-health route and the legacy image-card skin,
  responsive rules, and pan keyframes into `PopCard.svelte`; `SmallPopCard` already owned its matching
  keyframes. Removed the global image-card families, extension-only card helpers, and dead subtitle/
  Enneagram info rules. Listing transitions are explicit, and both owners honor reduced motion.
- Moved tab presentation into seven admin/search/email/marketing/asset-generator route owners. Each
  inherited gap, border, type, hover, focus, positioning, and content rule is now explicit; broad
  `transition: all` declarations were narrowed. Removed the global `.tabs`, `.tab`, and `.tab-content`
  family while retaining the intentionally admin-scoped mobile adaptation.
- Classified `.badge`, `.badge-glow`, `.badge-dot`, and `.tag` by meaning. Six badge consumers now
  own the inherited geometry they actually use; public article tags and active dot indicators remain
  route-scoped; the dormant `CorpusStatsPanel` dot is component-owned; and the unused glow modifier
  is removed. No premature cross-context `StatusBadge` API was introduced.
  `components.scss` is now 156 lines, down 730 lines (82.4%) from its 886-line baseline.
- Added `lint:global-css` to `pnpm lint`; the ratchet passes at 156/156 lines and rejects reintroduced
  global badge/tag selectors. `pnpm lint:colors` passes. The radius guard is currently blocked only
  by two declarations in the user's untracked `QuestionInviteCard.svelte` radius workstream, which
  this slice intentionally did not edit.
- Header and MobileNav focused unit tests: pass, two files and two tests. Targeted ESLint and Prettier:
  pass.
- Header live comparison at 1440x1000 and 390x844: desktop Library and mobile drawer render cleanly;
  computed header chrome/logo/mobile-link values match the before-state; both widths return 200 with
  zero console errors or horizontal overflow. The authenticated poster route redirects to login, so
  its inherited wordmark font was made explicit and authenticated visual verification remains owed.
- Image-card live comparison at 1440x1000 and 390x844: the mental-health route renders all 11 listing
  cards and the article route renders both PopCards with exact baseline geometry and visual computed
  properties, zero horizontal overflow, and no browser errors. The listing transition is intentionally
  narrowed from `all`; PopCard's keyframe name is component-scoped with unchanged timing. A separate
  keyboard/reduced-motion probe confirms 2px focus outlines, disabled card lifts/zooms, and stopped
  scanline animation.
- Tab routes were probed at 1440x1000 and 390x844 before the migration, but all seven redirect to
  `/login` in the available local session. Their unauthenticated behavior has no overflow or browser
  errors; authenticated before/after visual verification remains owed.
- Badge/tag public comparison at 1440x1000 and 390x844: `/about` and `/corpus-stats` return 200 with
  zero overflow or browser errors, and all four before/after screenshots are byte-identical. The
  scoped 5px indicator geometry is unchanged. Admin badge owners remain auth-gated, so their inherited
  display, alignment, border, tracking, casing, and nowrap contracts were made explicit and verified
  statically; authenticated visual verification remains owed.
- Targeted ESLint and Prettier: pass. The Svelte autofixer reports no issue in the comments owner and
  only pre-existing component concerns (such as unkeyed loops/effect patterns) in the larger owners;
  the compiler reports no new CSS diagnostic.
- `pnpm check`: pass, zero errors and 132 existing warnings in 40 files.
- `pnpm test`: pass, 125 files and 595 tests.
- Focused 320px Playwright verification: four routes pass canonical-control, label association, 16px
  font-floor, 44px control-height, CAPTCHA containment, and page-overflow checks.
- `pnpm test:smoke`: pass, all 20 tracked responsive, semantic, SSR, and visual-regression cases.
- `pnpm lint:radius`: currently blocked by two off-scale declarations in the user's untracked
  `QuestionInviteCard.svelte` radius workstream; no file in this tab slice introduces a violation.
- `pnpm lint:colors`: pass, 1,565 files with no retired palette or bridge-token drift.
- Targeted ESLint: zero errors. The styleguide route remains intentionally ignored by the repository
  ESLint configuration.
- Live browser matrix: desktop/mobile x dark/light all returned 200 with no console/page errors or
  horizontal overflow. Each rendered three form controls at 16px, three spinners, four skeletons, two
  status states, and zero bespoke specimen duplicates.
- Fresh dark-mode mobile screenshots inspected for register, forgot-password, and the book-session
  waitlist panel; labels, optional/help copy, control hierarchy, and page containment render cleanly.

After the 2026-09-01 coordinated form/modal/radius slice:

- Migrated `EmailComposeModal` and the admin user-status field to the canonical form family. Compose
  and nested AI generation now use stacked canonical dialogs with inline failure states, overflow-safe
  recipients, dynamic viewport containment, and safe-area-aware mobile actions.
- Replaced the styleguide's modal lookalike with the production `Modal`; refined the shared overlay,
  scroll region, close action, explicit transitions, and reduced-motion behavior.
- Removed the final global form, modal, base-card, and Enneagram-frame families. `components.scss` is
  now 6 comment-only lines, down 880 lines (99.3%) from the 886-line baseline. The ratchet rejects
  reintroducing those selector families.
- Radius lint is green with zero role violations and a zero-item CSS backlog after normalizing touched
  admin campaigns, invite/notification cards, and interaction controls.
- All 15 public mobile smoke cases and all 4 styleguide production-component visual baselines pass.
  The actual modal was visually inspected at 1440x1000 dark and 390x844 dark/light with zero overflow
  or browser errors, correct focus/scroll lock, no inherited blur, and responsive 448px/340px sizing.
- `pnpm check` passes with zero errors and the existing 133-warning baseline in 40 files. Focused
  dialog tests, color/global-CSS/radius guards, targeted ESLint/Prettier, and `git diff --check` pass.
  Authenticated admin visual verification remains owed.
