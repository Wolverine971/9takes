<!-- docs/design/hyperplexed/PERSONALITY_COLOR_HARMONY_AUDIT_2026-08-02.md -->

# Personality Color Harmony Audit And Work Log

**Audited:** 2026-08-02  
**Rechecked:** 2026-08-03  
**Decision:** Option A — contained legacy violet  
**Scope:** Personality index, category hubs, type libraries, individual dossiers, shared personality
portrait treatment, and adjacent public/admin color consumers  
**Status:** Tiers 1–3 shipped locally; independent residual scan and hardening complete  
**Related:**
[`PERSONALITY_ANALYSIS_SLUG_AUDIT_2026-07-29.md`](./PERSONALITY_ANALYSIS_SLUG_AUDIT_2026-07-29.md),
[`2026-08-02-personality-portrait-contained-violet-rollout-plan.md`](../2026-08-02-personality-portrait-contained-violet-rollout-plan.md)

## Verdict

The contained-violet portrait treatment works in both themes and should remain. The portrait library
does not need to be regenerated or recolored. The remaining dissonance comes from adjacent UI using
unrelated saturated colors as atmosphere, and from a few places where brand amber, Enneagram type
color, and legacy portrait violet do not have distinct jobs.

The system will use a strict accent budget:

1. **Sodium amber** is brand illumination, primary action, focus, and compact section emphasis.
2. **Enneagram type color** is labeled data: type badges, small identifiers, and restrained rules.
3. **Category color** is labeled navigation data: dots, counts, and thin rules, never page ambience.
4. **Legacy portrait violet** is a media treatment contained inside personality portraits.
5. **Semantic purple** remains valid only as explicitly labeled Type 4 or heart-triad data.
6. **Teal** is statistical and technical data.
7. **Stone and ink** carry surfaces, borders, typography, and passive furniture in both themes.

This follows HyperPlexed P3 (shared shell), P4 (metadata hierarchy), P5 (mono labels), P10
(imagery containment), P19 (brand accent budget), and P20 (contain legacy media color).

## Tier 1 — Accent Semantics And Harmony

- [x] Remove category-specific full-page and panel color washes. Keep the warm streetlamp atmosphere
      and confine category colors to labeled micro-accents.
- [x] Repair the type-library hero: solid ink headline, quiet type-colored badge mixed with stone,
      and no decorative glow.
- [x] Soften the individual dossier's full-width type stripe while preserving the canonical type
      token as the underlying data color.
- [x] Replace raw dossier triad colors with the shared gut, head, and heart pillar tokens.
- [x] Clarify in the design system that legacy portrait violet and semantic Type 4/heart purple are
      different roles.

### Tier 1 Surface Map

| Surface            | Anomaly                                                                     | Intended result                                                        |
| ------------------ | --------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Category detail    | Category `accentSoft` tints the page and several panels                     | Warm stone/amber atmosphere; category hue only in small labeled marks  |
| Category index     | Category colors already appear mostly as dots/counts                        | Preserve this restrained pattern; do not expand it into card washes    |
| Type library       | Amber badge/glow and amber-gradient H1 make brand color look like type data | Solid ink H1; badge uses that page's type color as quiet data          |
| Individual dossier | Saturated full-width type stripe competes with the portrait                 | Stone-mixed presentation stripe derived from the unchanged type token  |
| Type dossier       | Shame/heart triad invents raw violet values                                 | All triads use shared semantic pillar tokens with theme-aware contrast |
| Portrait media     | Legacy violet can be confused with Type 4 purple                            | Explicitly name and document the two separate roles                    |

## Tier 2 — Structural Polish

- [x] Rework `RelatedPosts.svelte`: remove the duplicate section label, reveal names without a
      hover dependency, retire resting glow/shadow styling, and replace viewport-width branching with a
      responsive component contract.
- [x] Improve the mobile individual-dossier opening so the person's name and persona thesis are
      visible before or alongside a smaller portrait, rather than below the first viewport.
- [x] Reduce competition between the table of contents, floating suggestion rail, and related-content
      ending.

## Tier 3 — System Cleanup

- [x] Remove or clearly archive the obsolete teal/rose/purple pre-V5 palette section in
      `docs/design-system.md`.
- [x] Audit remaining `--secondary` rose consumers and legacy gray-name/generic aliases against the
      V5 role map.
- [x] Retire legacy glow aliases such as `glow-purple()` after confirming there are no live callers.
- [x] Retire the Anna color-options decision preview after the production styleguide fully covers the
      accepted treatment.

## Guardrails

- Do not edit, regenerate, rename, recompress, or recolor files under `static/types/`.
- Do not change the canonical nine Enneagram type colors.
- Do not turn portrait violet into amber or into each person's type color.
- Do not use category colors for page backgrounds, large gradients, shadows, or unlabeled chrome.
- Do not use type color as a generic button, focus, or navigation accent.
- Maintain equivalent hierarchy and legibility in light and dark themes.

## Verification Matrix

Tier 1 and Tier 2 are complete only after these checks pass:

| Route                                            | Desktop   | Mobile  | Dark | Light | What to confirm                                               |
| ------------------------------------------------ | --------- | ------- | ---- | ----- | ------------------------------------------------------------- |
| `/personality-analysis/categories/creator-media` | 1440×1000 | 390×844 | Pass | Pass  | Warm atmosphere, restrained category marks, no cool page wash |
| `/personality-analysis/type/1`                   | 1440×1000 | 390×844 | Pass | Pass  | Solid H1, quiet type badge, no badge glow                     |
| `/personality-analysis/anna-wintour`             | 1440×1000 | 390×844 | Pass | Pass  | Softer stripe, unchanged portrait treatment, no overflow      |

The Anna dossier pass additionally confirms that the mobile opener states the name and persona
thesis before the portrait, the inline contents disclosure starts closed, the desktop contents rail
is the only floating navigation and clears before the ending, related names remain visible without
hover, and the related module has no resting shadow or glow.

Repository verification must include Svelte analysis for every edited component, SvelteKit sync,
`svelte-check`, targeted personality portrait tests, formatting, diff whitespace checks, the radius
lint, browser diagnostics, and the protected portrait-library checksum.

Locked portrait-library checksum:
`2fec6f780ecb79de17606572d25e2f34deaf5bfeba65a8061ec946870304401c`.

## Work Log

### 2026-08-02 — Audit

- Reviewed the accepted contained-violet treatment across personality index, category, type, and
  individual-dossier surfaces in light and dark mode at desktop and mobile sizes.
- Confirmed the portrait treatment itself is coherent and should not be regenerated.
- Identified category atmosphere, type-library semantics, dossier stripe saturation, and raw triad
  violet as the Tier 1 harmony issues.

### 2026-08-02 — Tier 1 implementation

- Replaced category-driven page and panel washes with a warm amber page pool, neutral stone panels,
  and a teal-only corpus-stat wash. Category color remains on labeled counts and related-category
  rules.
- Rebuilt the type-library hero around a solid ink H1 and a stone-mixed type badge with no glow.
  Sibling type numbers now derive from their own labeled type tokens instead of sharing amber.
- Split the individual dossier's raw `--type-accent` from its stone-mixed presentation stripe so the
  canonical nine type colors stay unchanged.
- Replaced raw anger/fear/shame colors with `--pillar-gut`, `--pillar-head`, and `--pillar-heart`
  through theme-aware color mixes.
- Updated the design system, portrait rollout, portrait authoring contract, and HyperPlexed tracker
  with the legacy-violet versus semantic-purple distinction.

### 2026-08-02 — Verification

- Passed fresh 1440×1000 and 390×844 browser review in dark and light mode for the category, type,
  and Anna dossier routes.
- Confirmed zero horizontal overflow, zero broken images, and zero browser warning/error entries.
- Confirmed the Type 1 hero H1 has no gradient, the badge has no glow, the raw type token remains
  `#6366f1`, the dossier stripe is derived by stone mixing, and portrait filters/blend mode remain the
  canonical theme values.
- SvelteKit sync and `svelte-check` pass with 0 errors and 143 existing warnings. The required Svelte
  analyzer reports only pre-existing route/component advisories.
- Targeted personality tests pass: 3 files, 14 tests. Prettier and staged/unstaged diff whitespace
  checks pass.
- Protected `static/types/` checksum remains
  `2fec6f780ecb79de17606572d25e2f34deaf5bfeba65a8061ec946870304401c` with no staged or unstaged
  portrait asset changes.
- Radius lint remains blocked by the unrelated existing
  `src/routes/account/+page.svelte:1243` `0.875rem` declaration.

### 2026-08-02 — Tier 2 implementation

- Separated the visible editorial title from the search title: individual dossiers now lead with the
  person's name and a neutral persona thesis while retaining the longer title in page metadata.
- Reordered and compacted the mobile opener so the name, thesis, and analytical promise arrive before
  the 280-pixel portrait. The desktop dossier composition remains intact.
- Added an explicit closed-state override to the shared table of contents, applied it to the inline
  dossier contents, retained one desktop contents rail, and made that rail clear before the ending.
- Removed the redundant floating people-suggestion rail from the dossier route.
- Rebuilt `RelatedPosts.svelte` as a CSS-responsive, keyed case-file grid with permanent name scrims,
  neutral resting surfaces, no decorative lift/glow, and one distinct `Related Case Files` heading.
- Replaced competing end-of-page navigation with a quiet, inline framework link row beneath the one
  canonical related module.

### 2026-08-02 — Tier 2 verification

- Passed fresh Anna dossier review at 1440×1000 and 390×844 in light and dark mode. The mobile H1
  begins at approximately y=292, the persona thesis at y=357, and the portrait at y=620; the page has
  zero horizontal overflow and zero broken images.
- Confirmed the inline contents disclosure starts closed at both sizes, one fixed contents rail appears
  during desktop reading, and no contents or people-suggestion rail competes with the related ending.
- Confirmed all eight related names are permanently visible, the module exposes one semantic heading,
  four framework links remain available, and related cards carry no resting box shadow.
- SvelteKit sync and `svelte-check` pass at the repository baseline of 0 errors and 143 existing
  warnings. The targeted personality suite remains green at 3 files and 14 tests; ESLint, Prettier,
  and diff whitespace checks pass.
- The protected `static/types/` checksum remains
  `2fec6f780ecb79de17606572d25e2f34deaf5bfeba65a8061ec946870304401c`; no portrait asset was edited.

### 2026-08-02 — Tier 3 implementation

- Replaced the conflicting pre-V5 teal/rose/purple tables in `docs/design-system.md` with one explicit
  historical archive notice. The live styleguide now mirrors that contract without rendering deleted
  colors as if they were available choices.
- Removed the standalone rose token family. Each former caller now uses its actual role: semantic
  error for below-target analytics, data teal for active analytics tabs, amber for tips, and neutral
  ink/stone for secondary spinners and editorial problem framing.
- Migrated the remaining gray-name and zero-consumer generic component aliases to direct V5 roles,
  then removed their global definitions. Hand-rolled icon defaults now use `--ink-mid`; fixed-light
  artwork uses `--marble-pure`; borders use `--stone-edge`.
- Removed the unused color-named glow mixins after confirming there were no live callers. The only
  retained glow mixin follows the amber `--glow-sm` / `--glow-md` contract.
- Retired `/design-preview/anna-color-options`. `/styleguide#s13` is now the permanent contained-violet
  calibration and publishing reference, and the rollout documentation points there.

### 2026-08-02 — Tier 3 verification

- Live `/styleguide` review passes at 1440×1000 and 390×844 in dark and light mode. The archive
  notice renders zero legacy swatches, §13 renders all nine portraits, and every tested state has
  zero horizontal overflow and zero broken images.
- The portrait fixture retains the canonical dark filter/well
  (`contrast(1.08) brightness(0.92) saturate(0.68)` / `#2C1F28`) and light filter/well
  (`contrast(1.02) brightness(0.99) saturate(0.58)` / `#F6F3FB`).
- `/styleguide` returns 200 and the retired `/design-preview/anna-color-options` route returns 404.
- Source scans report zero live standalone-rose variables or definitions, zero legacy gray/generic
  alias consumers, zero color-named glow mixin definitions/callers, and zero preview references.
- SvelteKit sync and `svelte-check` pass with 0 errors and 143 existing warnings. The full unit suite
  passes: 111 files and 538 tests. Targeted ESLint has zero errors; Prettier and staged/unstaged diff
  whitespace checks pass.
- The protected `static/types/` checksum remains
  `2fec6f780ecb79de17606572d25e2f34deaf5bfeba65a8061ec946870304401c` with no portrait changes.
- Radius lint remains blocked only by the unrelated existing
  `src/routes/account/+page.svelte:1243` `0.875rem` declaration.

### 2026-08-03 — Independent recheck and Tier 3 hardening

- A stricter exact-token recheck invalidated the earlier zero-consumer claim before finalization. It
  found 18 residual calls to already-deleted bridge aliases across six components/routes. Because the
  custom properties no longer existed, browsers could fall back to an initial color instead of a
  theme-safe role. Every caller now maps directly to its actual V5 role: stone for surfaces and
  borders, ink for text, amber for action/focus, and semantic error/warning for status.
- Removed the dormant Tailwind `secondary` rose, `accent` purple, and obsolete `brand` teal/rose/gold
  ramps so new utility classes cannot reintroduce the archived palette.
- Harmonized three published article skins that still behaved like independent color systems:
  `introducing-9takes`, `guide-to-fighting-depression`, and
  `enneagram-books-websites-podcasts`. Their structure is unchanged; their atmosphere now comes from
  stone/ink, with amber for illumination, semantic colors for status, and teal only for data.
- Reworked the question-print generator's fixed output palette from cool navy/teal to the warm
  Streetlamp colors and replaced its one-off Rubix mark with the approved nine-mask 9takes logo. The
  standalone mental-health AMP story received the same fixed-asset role cleanup.
- Replaced the last generic purple Enneagram icon in an unpublished test draft with brand amber so it
  cannot quietly re-enter the published article pipeline later.
- Added `pnpm lint:colors` and included it in the repository `lint` command. The guard rejects retired
  bridge tokens, Tailwind secondary/accent utilities and definitions, obsolete Tailwind brand aliases,
  and old rose/purple interface colors in published blog sources. Enneagram Type 4 and contained
  portrait violet remain explicitly allowed data/media roles.

### 2026-08-03 — Independent verification

- `lint:colors` passes across 1,540 source/config files. Exact source scans report no retired bridge
  callers, dormant Tailwind palettes, or old rose/purple interface colors in published blog sources.
- SvelteKit sync and `svelte-check` pass with 0 errors and the repository baseline of 143 warnings.
  The full unit suite passes: 111 files and 538 tests. Targeted ESLint, Prettier, and diff whitespace
  checks pass.
- The three migrated public articles return 200 in all 12 desktop/mobile × dark/light checks, with
  zero horizontal overflow, broken images, runtime errors, or computed retired interface colors.
- `/styleguide` continues to pass at both sizes and themes. The only computed purple matches are the
  explicitly labeled Type 4 tag, case stripe, and portrait frame—canonical Enneagram data, not leaked
  interface accent.
- The final non-people-draft raw-color census leaves one old-rose-spectrum match: the explicitly
  labeled Politics category accent in `personalityCategories.ts`. It remains intentionally because
  category hue is permitted as navigation data and is no longer used as page atmosphere.
- The question-print route redirects signed-out local sessions to `/login`; its authenticated live
  preview remains a manual follow-up. Its modern Svelte component analysis reports zero issues, and
  both preview and print markup share the approved mark and fixed Streetlamp palette.
- The protected `static/types/` checksum remains
  `2fec6f780ecb79de17606572d25e2f34deaf5bfeba65a8061ec946870304401c` with no portrait changes.
- Radius lint remains blocked only by the unrelated existing
  `src/routes/account/+page.svelte:1243` `0.875rem` declaration.

### 2026-08-03 — Final clean-room recheck and cleanup

- Expanded the final audit beyond computed CSS colors to include SVG presentation attributes,
  inline styles, generated-email instructions, and dormant shared components. This exposed the old
  violet Rubix strokes in the live `introducing-9takes` article: CSS computed-style scans alone had
  not been a sufficient containment check. The mark now uses `--lamp-glow` strokes and
  `--night-deep` fills in both themes.
- Removed an invalid `--primary-rgb` indigo fallback from the marketing content composer and mapped
  its focus treatment to a lamp/stone mix. While touching the component, brought its text input to
  the mobile-safe 16px floor, keyed the rendered option loops, and made its one-time prop capture
  explicit.
- Removed the remaining dormant/nonsemantic violet from the legacy jumbotron and Enneagram icon
  fallback. Renamed stale purple-named filters and comments after confirming their rendered color
  was already amber.
- Harmonized the standalone session-booking email with email-safe Streetlamp hex values and updated
  the admin email generator prompt so future generated buttons use the approved amber action color.
- Extended `lint:colors` to reject the discovered `--primary-rgb` bridge and nonsemantic violet
  values anywhere in scanned source, including SVG attributes and email markup.

### 2026-08-03 — Final verification

- Ran a fresh 20-state browser matrix over `introducing-9takes`, `guide-to-fighting-depression`,
  `enneagram-books-websites-podcasts`, `/styleguide`, and the Anna Wintour dossier at 1440×1000 and
  390×844 in dark and light mode. All states return 200 with zero horizontal overflow, page errors,
  broken images, duplicate IDs, retired bridge values, or retired rose/violet computed and SVG
  colors.
- The live Rubix mark resolves to `#F59E0B` on `#0A0807` in dark mode and `#B45309` on `#FAF8F4`
  in light mode. Its attributes remain semantic token references rather than hard-coded theme values.
- Representative captures were visually inspected for the Anna dossier, the migrated article shell,
  the live styleguide, and mobile article layouts. The contained portrait violet stays visually
  subordinate to the amber/stone interface in both modes.
- SvelteKit sync and `svelte-check` pass with 0 errors and 141 warnings in 44 files. The full unit
  suite passes: 111 files and 538 tests. Targeted ESLint, Prettier, color lint, and diff whitespace
  checks pass.
- The protected `static/types/` checksum remains
  `2fec6f780ecb79de17606572d25e2f34deaf5bfeba65a8061ec946870304401c` with no portrait changes.
- Radius lint passes after the final repo-level cleanup normalized the single committed account
  identity badge from an off-scale 14px radius to the locked 10px small-component radius.
