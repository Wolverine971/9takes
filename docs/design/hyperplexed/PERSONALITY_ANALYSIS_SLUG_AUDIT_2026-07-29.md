<!-- docs/design/hyperplexed/PERSONALITY_ANALYSIS_SLUG_AUDIT_2026-07-29.md -->

# Personality Analysis Slug — Hyperplexed Audit

**Route:** `/personality-analysis/[slug]`  
**Date:** 2026-07-29  
**Status:** Audit complete; hero hierarchy, TOC consolidation, related/rail cleanup, and Tier 3
accent-budget polish shipped locally; composer and compact mobile type dossier remain pending

## Verdict

The route has a genuinely premium desktop opener and a distinct editorial voice. Its case-file hero, portrait treatment, readable article measure, theme support, and `NineChorus` ending are already strong enough to preserve.

The quality falls off after that opener. On mobile the portrait consumes the first screen before the page makes its analytical promise; the long search-oriented title repeats type metadata; the table of contents and type dossier become long interruptions; and the related/discussion surfaces use older interaction and visual patterns. This needs hierarchy and consolidation, not a redesign.

## Surfaces Reviewed

- Case-file hero, portrait, title, description, and article metadata
- Inline and fixed table of contents
- Article body and injected Enneagram type dossier
- Sources, `NineChorus`, author, discussion, and comment composer
- Related analysis cards and floating people suggestions
- Desktop, extra-wide desktop, and mobile behavior in light and dark themes

## What Is Already Strong

- **The desktop hero is authored, not templated.** The restrained dossier framing, grayscale portrait, clipped corner treatment, and typographic scale produce a clear editorial identity.
- **The article is comfortable to read.** The body measure and spacing support long-form reading, and the route maintains good contrast in both themes.
- **The page has a real signature moment.** `NineChorus` turns nine personality perspectives into one purposeful interaction. It is the right place to spend the route's animation and visual-effects budget.
- **The content model is dependable.** All 396 inspected published personality records had a title, description, Enneagram type, persona title, and non-empty body content.
- **The route is technically stable in the tested states.** The deployed pages produced no browser warnings or errors and no horizontal overflow; the only off-screen element detected was the intentional anti-spam honeypot.

## Tier 1 — Fix First

### 1. Separate the visible editorial title from the search title

The hero renders the full `post.title` as its visible H1. Across the published corpus, the median title is 59 characters, 82 titles exceed 70 characters, and 17 exceed 80. In 167 records the title also repeats “Type N,” even though the type is already stated in the kicker above it. The 94-character Meryl Streep title demonstrates the worst case: it turns the hero into metadata instead of a decisive opening.

Use the person's name as the visible H1, elevate `persona_title` into a concise thesis/dek, and retain the longer search title in page metadata or a quieter supporting position. This is primarily a naming and hierarchy correction, not a smaller-font correction. **Patterns: P6 + P4.**

### 2. Remove the duplicate “Further Analysis” heading

The route wraps `RelatedPosts` with a `SectionKicker` labeled “Further Analysis,” while `RelatedPosts` immediately renders its own H2 with the same words. Keep one semantic heading and one small contextual label only if the two phrases communicate different information. **Patterns: P6 + P4.**

### 3. Give the discussion composer a persistent, accessible contract

The textarea relies on placeholder text as its only label, the submit button exposes the tooltip “You only YOLO once,” and submission failures are reduced to a generic transient notification. Add a persistent label, a stable `id`, optional help text, `aria-describedby`, an inline error connected with `aria-invalid`, and an announced status/error region. Replace the joke tooltip with useful action language or remove it. **Patterns: P13 + P6.**

### 4. Stop hiding related-person names on desktop

Related-card names are set to `opacity: 0` until hover, with no equivalent focus treatment, while mobile gets permanently visible but undersized labels. Identity is the card's essential information, so it should be stable in every input mode. Use a persistent bottom scrim and readable name treatment for mouse, keyboard, and touch. **Patterns: P8 + P10 + P4 + P13.**

## Tier 2 — Structural Refinement

### 1. Let mobile state the promise before showing the full portrait — shipped 2026-08-02

At 391 × 844, the Meryl Streep portrait occupies roughly y=245–565, the kicker begins near y=602, and the H1 begins near y=638; the description does not appear until below the first viewport. Put the analysis text before the portrait on small screens, or substantially compact the image so the name and thesis arrive in the first screen. Preserve the current desktop composition. **Patterns: P3 + P4 + P8.**

### 2. Consolidate the two table-of-contents experiences — shipped 2026-08-02

The route first shows a potentially 24-entry inline contents block, then introduces a separate fixed contents rail after scrolling on desktop. This asks desktop readers to process the same navigation twice. Default the inline version closed at every width, retain one desktop rail when space permits, and keep the disclosure's state/control behavior explicit. The current working-tree change improves the deployed mobile-open behavior but still leaves the desktop inline block expanded. **Patterns: P8 + P13.**

### 3. Compress the generic type dossier on mobile

The injected dossier measured roughly 1,152–1,255 pixels tall on tested mobile pages—more than a full viewport—and temporarily displaces the person-specific narrative with generic type reference material. Keep the highest-value fear, desire, stress, and growth summary visible; move secondary statistics and taxonomy into a deliberate disclosure or linked type page. **Patterns: P4 + P13.**

### 4. Retire or relocate the floating people rail — shipped 2026-08-02

`PeopleSuggestionsSideBar` looks for `main.column-width`, which this route does not provide, then falls back to a hard-coded content width. It is absent at a normal 1440-pixel desktop but appears as a second fixed rail beside the fixed contents at extra-wide sizes. It also duplicates the later related-content graph. Remove it from this route or replace it with one quiet inline “next dossier” module. **Patterns: P8 + P6.**

### 5. Bring related content into the case-file grammar — shipped 2026-08-02

The related grid uses viewport-width JavaScript to choose counts, unkeyed image loops, resting shadows, glow/lift hover, and hover-only labels. Reuse the established case-card treatment—or a compact CSS-grid variant—with visible names, keyed rows, and CSS-driven breakpoints. **Patterns: P2 + P3 + P8 + P10 + P11.**

## Tier 3 — Polish

### 1. Spend the effects budget on `NineChorus`

Keep `NineChorus` as the route's single signature interaction. Replace resting glows and decorative shadows on tables of contents, source cards, related cards, side rails, and the dossier shelf with borders and tonal surfaces; reserve elevation for floating or interactive states. Gate remaining non-essential motion behind reduced-motion preferences. **Patterns: P11 + P19.**

### 2. Reduce the hero to one accent system

The type-color stripe, amber dossier label, and saturated violet portrait mark compete as three accent languages. Keep type color as data and either neutralize the eye mark or tune it into that system. **Patterns: P10 + P19.**

**Shipped locally 2026-08-02:** Option A contains the existing violet inside a theme-aware portrait
well and lowers its saturation without altering source assets. Amber remains illumination/action,
type color remains data, and neutral stone/ink now carries the portrait frame, corners, and caption
border. The reusable implementation is documented as **P20**; see
`docs/design/2026-08-02-personality-portrait-contained-violet-rollout-plan.md`.

## Recommended Approval Order

1. Correct the hero title hierarchy and mobile ordering.
2. Consolidate the TOC and repair the discussion form contract.
3. Replace the related/floating-rail treatment.
4. Build the compact mobile type dossier.
5. Apply the effects and accent-budget polish.

## Verification Notes

- Reviewed the current working-tree source, including the existing unstaged mobile TOC change.
- Inspected deployed Selena Gomez, Elon Musk, and Meryl Streep pages.
- Tested 1440 × 1000 desktop, extra-wide desktop, and exact 391 × 844 mobile states in light and dark themes.
- Confirmed no horizontal page overflow and no browser diagnostics in tested states.
- Ran the Svelte analyzer in the route's legacy compatibility mode. It identified existing raw-HTML/migration advisories and unkeyed related/dossier loops; no implementation changes were made during this audit.
- At the time of the original audit, local browser screenshots were blocked by the database-backed
  page load; the deployed route supplied the visual baseline. The contained-violet slice below was
  subsequently verified against the local working tree.

### 2026-08-02 contained-violet verification

- Local Anna Wintour rendered nine `/types/` images at 1440 × 1000; all nine used the semantic image
  treatment and media well, with no overflow or broken images.
- The live `/blog` personality section rendered six treated portraits at 1440 × 1000 and 390 × 844
  in dark and light mode. Fifteen ordinary blog artworks remained untreated.
- The Podcast Bros article rendered six multi-person `PopCardGroup` images untreated, matching the
  documented editorial-composite exception.
- The light portrait well/filter computed as `#F6F3FB` and
  `contrast(1.02) brightness(0.99) saturate(0.58)`; dark computed as `#2C1F28` and
  `contrast(1.08) brightness(0.92) saturate(0.68)`.
- The publishing preflight validates one generated full/thumbnail pair before opening its exact
  styleguide fixture. That fixture passed at 1440 × 1000 and 390 × 844 in both themes with canonical
  filters/wells, normal blend mode, loaded assets, no horizontal overflow, and no browser warnings.

No implementation changes were made during the original audit. The 2026-08-02 follow-up shipped the
contained-violet treatment plus the visible-name hero, promise-first mobile ordering, closed inline
contents, single desktop contents rail, retired people rail, and case-file related grid. The
persistent discussion-composer contract and compact mobile generic type dossier remain open.

### 2026-08-02 structural verification

- Anna Wintour now uses the person's name as the visible H1 and a neutral persona thesis while keeping
  the search-oriented title in metadata.
- At 390×844 in both themes, the name and analytical promise appear before the 280-pixel portrait;
  the inline contents starts closed and the page has no horizontal overflow or broken images.
- At 1440×1000, one desktop contents rail appears during reading and clears before the ending. The
  former floating people rail is absent at every tested width.
- The ending presents one `Related Case Files` module with eight permanently visible names and four
  quiet framework links. Cards use CSS breakpoints and neutral resting surfaces without glow or
  shadow.
- SvelteKit sync, `svelte-check` (0 errors, 143 existing warnings), three targeted personality test
  files (14 tests), ESLint, formatting, and diff whitespace checks pass. Radius lint remains blocked
  only by the unrelated existing `account/+page.svelte:1243` declaration.

### 2026-08-14 BlogPurpose follow-up

The mid-article capture and type explorer were compacted as one surface. The redundant explorer
heading, secondary explorer link, email icon, and diagram-center ornament were removed. The origin
story now uses a short promise-first hierarchy, while the signup states exactly what readers receive:
new celebrity typings, relationship patterns, and practical Enneagram notes by email. The input and
action share a row, and the nine archetype links use a compact three-column label grid. **Patterns:
P1 + P2 + P3 + P6 + P11 + P19.**

The distorted diagram geometry came from a global `.enneagram-container` collision that added card
padding and clipping inside the component. The internal wrapper now has a component-specific name;
all nine nodes explicitly own a square aspect ratio and the tooltip renders as a wider floating card
with a two-column facts row. The diagram no longer waits for client mount, so links and labels are
present in SSR output.

- Local Elon Musk passed at 1440×1000 and 390×844 in dark and light mode.
- All nine live nodes measured square; the compact label grid had no horizontal overflow.
- Hover and keyboard focus both displayed the type card; the tested tooltip measured 292×199px on
  desktop and 288×182px on mobile.
- The redesigned component measured about 422px tall on desktop and 824px at 390px wide, with no page
  overflow or browser console issues.
- `pnpm check` passed with 0 errors and 132 existing warnings. Prettier, diff whitespace, and both
  Svelte autofixer passes are clean. Radius lint reaches only two unrelated existing admin-page
  violations.

### 2026-08-14 article-boundary follow-up

The inline contents disclosure moved out of the long-form `.breakdown` section and into a dedicated
article-navigation prelude between the case-file header and the essay. A separate inset hairline now
marks the beginning of the read, so articles that open with a quote no longer make the quote look
attached to the contents card. Desktop and mobile use the same semantic order and align the contents,
divider, and prose to the existing route shells. **Patterns: P3 + P4.**

The follow-up spacing pass treats that transition as one composed region instead of three isolated
bands: the case-file footer, TOC wrapper, and essay inset now use the V5 spacing scale; the route-local
TOC drops its resting glow and closed-state inner hairline; and the first essay element has a normalized
top margin so quotes, paragraphs, and headings share one start line. NineChorus remains the route's
single effects moment. **Patterns: P3 + P4 + P19.**

- Local Adela passed at 2048×1200, 1440×1000, and 390px widths in dark and light mode.
- DOM geometry confirms one contents prelude followed by the divider and then the first essay element;
  desktop uses a 72px portrait-to-TOC transition, 24px from TOC to divider, and 48px from divider to
  the essay; mobile uses 60px, 20px, and 40px respectively.
- All three checked widths have zero horizontal overflow and no browser console errors. The closed TOC
  exposes 12 links when opened, remains overflow-safe, and returns cleanly to its closed state.
- `pnpm check` passes with 0 errors and 132 existing warnings. Prettier and the Svelte autofixer report
  no new findings. Radius lint remains blocked only by two unrelated existing admin-route violations.

### 2026-08-15 explicit dossier-placement follow-up

The route no longer adds a second shelf and duplicate type kicker around `EnneagramTypeDossier`.
The dossier now owns its identity and visual surface; the route supplies only editorial spacing.
This removes the repeated “Enneagram Type N” framing and makes the module read as a deliberate break
inside the essay instead of a card inside another card. **Patterns: P4 + P6.**

Placement is now author-controlled through an explicit `<EnneagramTypeDossier />` marker in each
personality draft. A ten-profile review batch places the dossier inside the section that establishes
the person's Enneagram type: Elon Musk, Donald Trump, Dua Lipa, Zendaya, Cristiano Ronaldo, Jordan
Peterson, Lionel Messi, Adele, Selena Gomez, and Beyoncé Knowles. Elon's dossier and first-hand
reasoning card are separated by a heading and several paragraphs so two feature modules never land
back-to-back.

- Local Adela passed at 1440×1000 and 390×844 in dark mode. The dossier's direct parent computes with
  no background or border, and the 390px layout has no horizontal overflow.
- A targeted parser test verifies exactly one dossier marker per reviewed profile, within the
  profile's type-analysis section, plus the staggered Elon reasoning card.
- `pnpm check` passes with 0 errors and 132 existing warnings. The targeted parser suite passes all
  41 tests. Radius lint remains blocked only by the two unrelated existing admin-route violations.
