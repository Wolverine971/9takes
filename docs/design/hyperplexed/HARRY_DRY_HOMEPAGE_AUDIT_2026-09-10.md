<!-- docs/design/hyperplexed/HARRY_DRY_HOMEPAGE_AUDIT_2026-09-10.md -->

# Harry Dry–inspired homepage

September 10, 2026. Local implementation and two rounds of adversarial review.

**Current local homepage:** [Open `/`](http://127.0.0.1:5197/). The [design preview](http://127.0.0.1:5197/design-preview/harry-dry) remains available with noindex metadata.

The first screen offers a concrete exchange: answer a familiar question privately, then compare different priorities behind it. The current preview uses the user-requested “1 question. 9 perspectives.” numeral treatment and the existing visual identity. It makes the benefit easier to sample through a short friendship question, a visible example, and a working comparison.

DJ approved this version as the main homepage. It now serves `/` in the local codebase, with indexable canonical metadata and compact Questions, Explore, and Account navigation. Both homepage routes share `HomeLanding.svelte` and explicitly opt into `pageChrome: 'owned'`. The design preview remains `noindex, nofollow`. Other routes retain their existing navigation and footer. This change has not been deployed. The earlier review and screenshot sections below record the preview iterations; the promotion section records the final state.

## Basis and scope

Read alongside the [initial marketing analysis](../../marketing/2026-09-10-harry-dry-landing-page-audit.md), [approved messaging hierarchy](../../brand/messaging-hierarchy.md), [design system](../../design-system.md), and the existing [homepage audit](HOME_REIMAGINED_PREVIEW_2026-07-13.md).

Harry Dry's [landing-page guide](https://marketingexamples.com/landing-page/guide), [headline examples](https://marketingexamples.com/landing-page/titles), [rewrites](https://marketingexamples.com/landing-page/rewrites), and [CTA examples](https://marketingexamples.com/landing-page/cta) informed the concrete benefit, visible demonstration, low initial commitment, and precise action wording. This is an application of those lessons, not a claim that Harry reviewed or endorsed the page.

This homepage uses **18 fixed AI-written editorial examples across two questions**. It does not classify the visitor or generate responses from their answer. Every visitor receives the same examples. The typed answer lives in Svelte state, is rendered as escaped text, and clears on refresh. It is never submitted to a question or AI service. All DOM containing the answer is inside `ph-no-capture`, the installed PostHog replay SDK's default blocking class. Local development disables analytics; production replay traffic was not exercised.

## Regions and decisions

| Region                 | Implementation                                                                                                 | Pattern references   |
| ---------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------- |
| Navigation             | Compact brand, current-home link, and existing theme control; owned width and navigation only for this route   | P3, P8, P13          |
| Hero and offer         | Canonical headline, everyday benefit, small contrasting example, visible question and reveal action            | P3, P4, P5, P6       |
| Private composer       | Short question, explicit source/privacy disclosure, inline validation, keyboard focus, shared Button atom      | P1, P2, P8, P11, P13 |
| Reveal                 | Visitor's starting answer, same-examples disclosure, priority chooser, two contrasting motivations, reflection | P1, P4, P6, P8       |
| Mobile comparison      | Native select with visible chevron; desktop retains nine visible buttons                                       | P1, P8, P9, P13      |
| Live handoff           | Public destination is explicit; practice draft does not transfer; second private question is named             | P6, P8               |
| Supporting explanation | Recognizable conversation problem before the Enneagram framework; existing illustration with scrim             | P3, P6, P10          |
| Reading and coaching   | Separate links for personality analyses, practical guides, and the existing coaching waitlist                  | P4, P6, P8           |
| FAQ and close          | Native disclosure controls, actual founder portrait, approved brand line, return to question                   | P6, P8, P11, P13     |

The diagram-like priority comparison is the central demonstration. The page avoids fabricated participant quotes, invented counts, testimonials, or promises of nine real respondents.

## Two review rounds

Three independent agents covered four visitor personas plus technical review. These are simulated perspectives, not user interviews or conversion evidence.

| Reviewer lens              | Round 1 objection                                                                                               | Revision and Round 2 result                                                                                                                                                                 |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Enneagram practitioner     | A one-label example could feel like typing the visitor; fixed reflection could contradict the selected pair     | Explicitly states these are possible motivations, not an assessment; reflection follows the displayed contrast. No remaining material trust blocker.                                        |
| Personality-content reader | The visitor's own contribution disappeared above the reveal; it was unclear how to reach an actual conversation | Starting answer now appears beside the comparison; public handoff identifies the destination and lack of draft transfer. Resolved.                                                          |
| Skeptical newcomer         | Default example could be mistaken for personalized analysis; the reveal needed stronger provenance              | Same-examples disclosure, explicit AI authorship, private-answer labeling, and non-presumptive reflection. No remaining material comprehension blocker.                                     |
| Curious mobile skimmer     | The explanation took space without proving the benefit; nine controls postponed the payoff                      | Concrete sample survives mobile; compact navigation puts the initial action on screen; native priority select shortens the reveal. Final visual review prompted a visible dropdown chevron. |
| Technical reviewer         | Plain answer text could be captured by inherited replay; hint association and SVG styling needed correction     | Both answer copies and composer are capture-blocked; hints connected; SVG selectors scoped correctly; shared chrome contract explicitly typed. No remaining material code finding.          |

The newcomer reviewer suggested softening the closing brand line. It was intentionally retained because `docs/brand/messaging-hierarchy.md` freezes it; supporting copy and examples remain conditional about motives. The reviewer also suggested naming the second question rather than implying an unlimited question library; implemented.

A final screenshot check caught two capture artifacts: an initial mobile shot retained a previous scroll position, and a full-page stitched image duplicated sections. Those artifacts were replaced or removed. Validation and deliverables use ordinary viewport captures.

## Tiered findings and status

- **Tier 1 — trust and interaction:** source ambiguity, replay exposure, missing own-answer context, mismatched reflection, unclear public handoff, and mobile action visibility were addressed. No unresolved material implementation finding from the reviewers.
- **Tier 2 — hierarchy and adaptation:** moved the demonstration into the hero, compressed navigation, separated framework explanation from the first action, and made the mobile chooser native and visibly interactive.
- **Tier 3 — polish:** theme-safe colors, canonical radii, shared controls, button/icon alignment, native FAQ, meaningful focus behavior, scoped styling, and reduced-motion CSS.

## Verification

Browser checks used the running SvelteKit app at `127.0.0.1:5197`.

| Check                                         | Result                                                                                                                                             |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1280×800 desktop, dark and light              | Hero, form, and CTA fit; no horizontal overflow; both images load                                                                                  |
| 390×844 mobile, dark and light                | Main CTA bottom is about 757px; disclosure follows within the opening screen; no horizontal overflow                                               |
| 320px width and 600-character unbroken answer | Both answer displays wrap; no offscreen elements or horizontal overflow                                                                            |
| Empty answer and keyboard submit              | Inline error focuses textarea; valid submit focuses reveal heading                                                                                 |
| All nine mobile options and desktop buttons   | Correct selected and contrasting cards; one desktop button pressed at a time                                                                       |
| Edit and next question                        | Draft preserved on edit; next question clears the answer and restores input focus                                                                  |
| Dinner question                               | Second content set and comparison update; specific next-question and live-links correct                                                            |
| HTML-like input                               | Rendered literally; no injected elements                                                                                                           |
| Refresh                                       | Answer clears; initial question returns; comparison is hidden                                                                                      |
| FAQ keyboard interaction                      | Enter opens and closes the native disclosure                                                                                                       |
| Navigation regression                         | Current home has its normal header/footer; preview has owned navigation; live friendship question restores normal chrome; back restores preview    |
| Public handoff                                | Correct question opens; private draft absent from the destination                                                                                  |
| Preview console                               | No warnings or errors in the inspected browser log                                                                                                 |
| Svelte check                                  | Zero errors; 154 pre-existing warnings across 43 other files; no preview warnings                                                                  |
| Targeted ESLint                               | New route and `src/app.d.ts` pass with `--no-ignore`; shared root layout remains excluded by the existing config's known JSON-LD parser limitation |
| Formatting and design checks                  | Targeted Prettier, radius, retired-color, and global-CSS checks pass                                                                               |

The online Svelte analyzer was blocked by automatic approval review because it could export unpublished source to svelte.dev. Local compiler, lint, and browser validation were used instead. Reduced-motion handling was inspected in CSS; a browser-level reduced-motion emulation and production performance benchmark were not run.

## Screenshots

- [Current homepage, desktop](screenshots/harry-dry-2026-09-10/current-home-desktop-dark.png)
- [Preview, desktop dark](screenshots/harry-dry-2026-09-10/desktop-dark.png) · [desktop light](screenshots/harry-dry-2026-09-10/desktop-light.png)
- [Preview, mobile dark](screenshots/harry-dry-2026-09-10/mobile-dark.png) · [mobile light](screenshots/harry-dry-2026-09-10/mobile-light.png)
- [Desktop comparison](screenshots/harry-dry-2026-09-10/desktop-reveal-dark.png)
- [Mobile comparison, dark](screenshots/harry-dry-2026-09-10/mobile-reveal-dark.png) · [light](screenshots/harry-dry-2026-09-10/mobile-reveal-light.png)

## Revision 2 — numerals, perspective language, and an opening visual

After reviewing the first version, DJ requested stronger recognition of the numeral **9**, revised step labels, and another visual above the fold while preserving the clean layout.

- **Headline and CTA → P6:** “1 question. 9 perspectives.” and “Reveal 9 perspectives.” Supporting copy and the FAQ use the numeral consistently. This is an explicit user-requested variation for this preview; it does not change the global messaging document.
- **Three steps → P6:** “Your own reaction.” → “Get a different perspective.” → “Ask a better question.”
- **Hero demonstration → P3+P4+P9:** replaced the small prose example with a static branching diagram. “I’m fine” **could mean** “Give me space” or “Please notice I’m not.” The conditional label remains visible in both mobile and desktop layouts; the connector is decorative SVG, while the explanation remains selectable, accessible HTML text.
- **Mobile fit → P1+P8:** the diagram compresses to 64px tall without hiding it. At 390×844 the CTA ends at approximately 777px and the source disclosure at 825px, keeping both on the opening screen. No animation, additional service request, or heavy image was introduced.

Fresh checks: desktop dark/light at 1280×800; mobile dark/light at 390×844; additional 320px and 820px widths with no horizontal overflow or offscreen hero elements. Empty-submit validation, keyboard submit, reveal focus, and the displayed comparison still work. The inspected console has no warnings/errors. `pnpm check` passes with 0 errors and the same 154 existing warnings in 43 other files; targeted ESLint, Prettier, and radius checks pass.

The newcomer/curious-visitor reviewer inspected the final desktop and mobile captures and found no actionable visual or copy issue. This follow-up was a simulated review, not a conversion test.

Revision 2 captures (the earlier screenshots above preserve the previous version):

- [Desktop dark](screenshots/harry-dry-2026-09-10/revision-2/desktop-dark.png) · [desktop light](screenshots/harry-dry-2026-09-10/revision-2/desktop-light.png)
- [Mobile dark](screenshots/harry-dry-2026-09-10/revision-2/mobile-dark.png) · [mobile light](screenshots/harry-dry-2026-09-10/revision-2/mobile-light.png)

## Promotion and app-wide section-label cleanup

DJ requested using the approved version as the main homepage and removing decorative section tags such as `§01` across the app.

- **Homepage → P3+P5+P6+P13:** moved the approved page into shared `HomeLanding.svelte`, with the same private practice, numeral branding, branching visual, and three-step explanation. Removed all five decorative homepage section-label rows and their leftover top spacing. Normal homepage navigation replaces the preview link and badge.
- **Metadata → P13:** `/` is indexable with canonical, Open Graph/Twitter metadata and WebPage structured data through the shared SEO component; the alternate preview remains noindex.
- **Shared labels → P5:** `SectionKicker` renders only descriptive text. Its old `num` prop remains accepted for compatibility but never renders; number-only use produces no empty element. Removed redundant FAQ labels and generic OBSERVATION eyebrows. Hard-coded decorative prefixes were also removed from archived previews, the styleguide, article diagrams, and the reactivation admin table. Meaningful step numbers, Enneagram types, counts, and legal references remain.
- **Design guidance → P5:** updated the active design system and fix patterns so new work will not reintroduce decorative section codes.
- **Retired homepage selection → P6+P13:** removed the unused homepage distribution loader and impressions path from `/`. Saved feature runs, fallback settings, and historical data remain available in admin, with an explicit notice that these settings do not affect the new private-practice homepage. Admin success/help text now describes saved settings accurately.
- **Technical review:** independent adversarial follow-up checked promotion metadata, private-answer handling, route chrome, and the retired distribution dependency. Its two actionable findings—stale admin copy and an empty Questions eyebrow wrapper—were fixed.

Final verification:

- Full suite passed: **935 tests across 185 files**. After the final test typing and admin-copy corrections, the targeted homepage, chrome, and question-distribution suite passed **8 tests across 4 files**.
- `pnpm check`: **0 errors**, 155 existing warnings across 44 other files; no warnings in the new homepage or shared section-label component.
- Targeted ESLint and Prettier pass. Radius, retired-color, and global-CSS checks pass. Repository-wide lint stops at existing formatting drift in unrelated files; no broad formatting changes were made.
- Source scan: **zero rendered section symbols** remain in Svelte markup (comments and technical documentation excluded).
- Browser: homepage desktop 1280×800 and mobile 390×844 in both themes; 320px navigation/overflow stress check; private reveal focuses its heading and both answer copies remain capture-blocked; refresh clears the answer. At 390px the reveal CTA ends around 739px. Questions and personality-analysis pages retain normal chrome and meaningful labels without decorative codes or horizontal overflow.

Final homepage captures:

- [Desktop dark](screenshots/harry-dry-2026-09-10/promotion/desktop-dark.png) · [desktop light](screenshots/harry-dry-2026-09-10/promotion/desktop-light.png)
- [Mobile dark](screenshots/harry-dry-2026-09-10/promotion/mobile-dark.png) · [mobile light](screenshots/harry-dry-2026-09-10/promotion/mobile-light.png)

## What this makes testable next

The key remaining question is whether writing an answer makes the comparison more useful, or feels like unnecessary work to access static examples. Ask unfamiliar visitors to explain the offer after a brief look, complete the exercise, and describe one reaction they understand differently. Include people familiar with the Enneagram and people who are not.

The approved homepage retains private practice and clearly links to public questions afterward. Measure completed real contributions and useful return visits separately from practice reveals; this implementation does not establish conversion lift or retention. Contextual article invitations and follow-up notifications from the original marketing audit remain subsequent work.

To reopen locally if the server stops: `pnpm dev --host 127.0.0.1 --port 5197 --strictPort`.
