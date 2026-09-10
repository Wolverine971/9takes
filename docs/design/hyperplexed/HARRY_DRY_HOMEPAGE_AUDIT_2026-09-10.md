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

## Separate Harry Dry V2 comparison

DJ requested applying the follow-up [Harry Dry landing-page guide](https://marketingexamples.com/landing-page/guide) review to a new page while preserving the approved homepage. The independent copy lives at `/design-preview/harry-dry-v2`; its header links to the current-version preview. The six original homepage, content, and preview files match their pre-V2 SHA-256 checksums. V2 stays noindex/nofollow and has not been deployed.

### Tier 1 — offer clarity and action labels

- **Hero → P6+P8:** explains the question-and-answer community and the progression from private practice to a real conversation. The explanation remains visible on mobile. The approved numeral headline, branching visual, and three step labels remain.
- **Input → P4+P6+P13:** places “Write yours first, before another take shapes it” beside the exercise, with accessible input help. The visible disclosure says the 9 examples are AI-written, fixed, and unaffected by the private answer.
- **Reveal and closing invitation → P6+P13:** makes joining a real conversation the primary action after a reveal; trying another private question becomes secondary. The handoff explicitly says the practice answer will not carry over.

### Tier 2 — real activity and founder context

- **Community → P3+P4+P6:** replaces the large decorative image with three real public questions and response counts. A compact total links to this section from the hero. These are activity figures, not distinct people or customer-outcome claims. Real outcome testimonials are still a future research task.
- **Loading → P8+P13:** the exercise renders immediately. One fixed same-origin GET after mount requests optional public activity, using the existing public question-index RPC with a three-second timeout. The endpoint only returns normalized counts and question titles/slugs; it does not fetch gated replies. Invalid data or a failed request produces a useful question-browsing fallback without invented numbers. Reserved hero space prevents a shift when the totals appear.
- **Founder story → P3+P6:** brings the existing About-page marriage story onto the page, explains the conflicting needs behind the same situation, and links to the full story. It is founder context rather than a customer endorsement.

### Tier 3 — verification and polish

- **Mobile density → P1+P3+P8:** V2 locally resets inherited heading padding and section margins. At 390×844, the reveal button ends around 765px and its AI disclosure around 813px. The 320px layout and 600-character unbroken answers have no horizontal overflow.
- **Independent technical review:** the reviewer identified the initial optional-data render delay. Moving activity to an after-mount request resolved it; the final review found no material issue in the public endpoint, private-answer handling, fallbacks, or metadata. Browser testing also caught an unsuccessful streaming approach before the final implementation; global CSP settings were left intact.
- **Browser:** desktop 1280×800 and mobile 390×844 in dark/light themes; mobile founder and desktop community sections inspected; empty input focuses validation, reveal focuses its heading, both answer copies remain capture-blocked, editing preserves the draft, the next question clears it, and refresh resets practice. The public friendship handoff opens the correct page with normal chrome and no copied private answer. Real totals and three public question cards appeared. Inspected V2 browser logs were empty.
- **Checks:** 12 tests pass across four focused files, including public-data filtering, failure fallback, fixed-URL fetch privacy, action priority, comparison link, noindex, and current-homepage/page-shell regression checks. Scoped Svelte check has 0 errors and two existing ThemeToggle selector warnings. Targeted ESLint/Prettier and radius/color/global-CSS checks pass. Full-project `pnpm check` currently has 70 errors in unrelated blog scripts (`blogEditorial.js` and `personBlogParser.js`); no V2 diagnostics.

V2 is a comparison candidate, not evidence of conversion lift. The next useful comparison is whether unfamiliar visitors can explain the offer and move from practice into a real contribution.

V2 captures:

- [Desktop dark](screenshots/harry-dry-2026-09-10/v2/desktop-dark.png) · [desktop light](screenshots/harry-dry-2026-09-10/v2/desktop-light.png)
- [Mobile dark](screenshots/harry-dry-2026-09-10/v2/mobile-dark.png) · [mobile light](screenshots/harry-dry-2026-09-10/v2/mobile-light.png)
- [Mobile reveal](screenshots/harry-dry-2026-09-10/v2/mobile-reveal-dark.png) · [desktop community](screenshots/harry-dry-2026-09-10/v2/desktop-community-dark.png)
- [Desktop founder story](screenshots/harry-dry-2026-09-10/v2/desktop-founder-dark.png) · [mobile founder story](screenshots/harry-dry-2026-09-10/v2/mobile-founder-dark.png)

### V2 follow-up — the thoughts behind “I’m fine”

DJ requested a more visual conversation and miniature thought clouds. **Hero illustration → P3+P4+P6+P8:** “How are you?” now precedes “I’m fine,” which branches into the retained “Give me space” and “Please notice I’m not” meanings. Eight small rounded bubbles show possible unspoken thoughts, including the requested blunt “Fuck off,” difficulty opening up, too much to explain, and “Please help me.” “Could mean” and “You won’t know until you ask” keep the illustration conditional. The branches and bubbles are accessible HTML text with a decorative SVG connector; no image or animation dependency was added.

The full visual remains visible on mobile. This intentionally adds height above the exercise; the earlier first-screen CTA measurements no longer describe this revision. Desktop 1280×900 and mobile 390×844 were checked in both themes, plus 320px wrapping with no overflow or offscreen bubbles. Browser diagnostics are empty. Scoped Svelte, ESLint, Prettier, and radius checks pass (the two pre-existing ThemeToggle selector warnings remain). V1 is unchanged.

- [Desktop dark](screenshots/harry-dry-2026-09-10/v2/thought-bubbles/desktop-dark.png) · [desktop light](screenshots/harry-dry-2026-09-10/v2/thought-bubbles/desktop-light.png)
- [Mobile dark](screenshots/harry-dry-2026-09-10/v2/thought-bubbles/mobile-dark.png) · [mobile light](screenshots/harry-dry-2026-09-10/v2/thought-bubbles/mobile-light.png)

### V2 follow-up — a conversation brought to life

DJ requested another visual to break up the copy, suggesting Greek statues or modern young people in a circle. **Community entrance → P3+P8+P10:** added a new wide illustration of nine young adults listening and talking in a courtyard under amber streetlamp light. Modern people connect the community offer to everyday life; the stone courtyard and lamplight retain the symposium mood. It sits after the three steps, above the community copy and real question cards. A small illustration credit distinguishes the imagined scene from actual community evidence.

The complete 2:1 scene is preserved at every breakpoint, without cropping people or placing text over faces. Intrinsic dimensions reserve the image area, lazy loading avoids competing with the hero, and two WebP sources weigh about 264KB and 100KB. [Asset paths, provenance, and complete built-in generation prompt](HARRY_DRY_V2_COMMUNITY_IMAGE.md).

Verified at 1280×900 and 390×844 in dark/light themes, plus 320px: image loaded, the narrow viewport selected the smaller WebP, mobile order is illustration then copy then questions, and there is no horizontal overflow. Inspected browser diagnostics are empty. Scoped Svelte has 0 errors and the same two existing ThemeToggle warnings; targeted ESLint, Prettier, and radius checks pass. This is a visual-only V2 addition; the current homepage is unchanged.

- [Desktop dark](screenshots/harry-dry-2026-09-10/v2/community-scene/desktop-dark.png) · [desktop light](screenshots/harry-dry-2026-09-10/v2/community-scene/desktop-light.png)
- [Mobile dark](screenshots/harry-dry-2026-09-10/v2/community-scene/mobile-dark.png) · [mobile light](screenshots/harry-dry-2026-09-10/v2/community-scene/mobile-light.png)

### V2 image revision — cel-shaded neo-noir

DJ found the first scene too visibly AI-generated and supplied `docs/visual-style/cel-shaded-neo-noir`. **Community artwork → P10:** regenerated the scene using that guide's unchanged master style prompt, its two visual references, and the previous scene as the composition target. The replacement has confident black outlines, crisp angular shading, cool navy/slate surroundings, and restrained amber lamplight. The nine-person circle, image placement and page layout remain intact. Previous assets are retained; the page now requests new `community-circle-neo-noir-v2` WebP filenames.

Fresh desktop 1280×900 and mobile 390×844 checks in both themes confirm the replacement loads, the smaller source is selected on mobile, the full group remains visible, and there is no horizontal overflow. Inspected console logs are empty; targeted formatting passes. This revision changes only image URLs and alt text in the component. [Current asset sizes, source files and full regeneration prompt](HARRY_DRY_V2_COMMUNITY_IMAGE.md#current-assets--cel-shaded-neo-noir).

- [Desktop dark](screenshots/harry-dry-2026-09-10/v2/community-neo-noir/desktop-dark.png) · [desktop light](screenshots/harry-dry-2026-09-10/v2/community-neo-noir/desktop-light.png)
- [Mobile dark](screenshots/harry-dry-2026-09-10/v2/community-neo-noir/mobile-dark.png) · [mobile light](screenshots/harry-dry-2026-09-10/v2/community-neo-noir/mobile-light.png)

### V2 follow-up — five conversation scenes

DJ approved the four variations and requested adding them to the page with a slight transition. **Community slideshow → P3+P8+P11+P13:** the original college-age scene now cycles through Gen Z, older adults, Athens and Vienna circa 1910. Each stays for eight seconds and transitions with a 700ms opacity fade. The complete 2:1 compositions remain visible without cropping or layout movement. A compact scene name, five accessible selection controls and a play/pause button let visitors choose and linger; selecting or focusing a scene control stops automatic cycling.

Rotation stops when the illustration leaves the viewport or the tab is hidden. Reduced-motion preferences disable automatic rotation and the fade while preserving manual selection. An image must load before it replaces the current one; cached images are recognized on mount, failed images are skipped, and pending manual selections retain the previous picture. Every scene has responsive WebP sources, with the four new 888px versions totaling about 454KB. Images remain lazy-loaded below the hero.

Verification: 16 tests pass across five focused files, including timing, offscreen/hidden-tab behavior, manual selection, pause/resume, reduced motion and failed-image handling. Scoped Svelte check has 0 errors and the same two existing ThemeToggle selector warnings; targeted ESLint/Prettier and radius checks pass. Desktop 1280×900 and mobile 390×844 were inspected in both themes, with a 320px control/overflow check. Browser playback advanced and wrapped from Vienna to College after resuming; all controls retain 44px targets. V1 remains unchanged.

- [Desktop dark](screenshots/harry-dry-2026-09-10/v2/slideshow/desktop-dark.png) · [desktop light](screenshots/harry-dry-2026-09-10/v2/slideshow/desktop-light.png)
- [Mobile dark](screenshots/harry-dry-2026-09-10/v2/slideshow/mobile-dark.png) · [mobile light](screenshots/harry-dry-2026-09-10/v2/slideshow/mobile-light.png)

### V2 follow-up — uninterrupted two-second loop

DJ requested an image-only loop, with Vienna before Athens and the Greek statues last. **Community artwork → P3+P4+P11:** removed the scene-name row, selection dots, playback controls and caption/credit row. The sequence is now College → Gen Z → older adults → Vienna circa 1910 → Athens → College, changing every two seconds with the existing 700ms fade. Descriptive illustration alt text remains. Reduced motion shows the initial still image; offscreen and hidden-tab suspension, load gating and failed-image fallback remain.

Verification: all 16 focused tests pass, including the new order, exact two-second interval and wraparound, empty visible metadata, loading, failures and reduced motion. Scoped Svelte check reports 0 errors and the two existing ThemeToggle selector warnings. Desktop 1280×900 and mobile 390×844 checks confirm the full illustration remains visible, the metadata area is gone, and neither layout overflows.

- [Desktop](screenshots/harry-dry-2026-09-10/v2/slideshow-loop/desktop-dark.png) · [mobile](screenshots/harry-dry-2026-09-10/v2/slideshow-loop/mobile-dark.png)
