<!-- docs/design/hyperplexed/HOME_REIMAGINED_PREVIEW_2026-07-13.md -->

# Home Reimagined Preview HyperPlexed Audit - 2026-07-13

Target: `/design-preview/home-reimagined`, covering
`src/routes/design-preview/home-reimagined/+page.svelte`, its owned-shell loader, and the provisional
modern / Ancient Greece gathering pair. Production `/` and its data loader are out of scope and
unchanged.

Source brief: `docs/design/homepage-reimagination-tasker-2026-07-13.md`.
Image prompt record: `docs/design/home-reimagined-ancient-image-prompts-2026-07-14.md`.

## Regions

1. Hero invitation and nine-person gathering
2. Give-first question proof and illustrative reveal
3. Anger, shame, and fear center explanation
4. Newcomer / Enneagram-familiar depth fork
5. Final question invitation and quiet deep links

## Tier 1 - cheap, high-impact

- The preview owns the full marketing shell instead of inheriting the global 1200px nested-main
  clamp. One shared `86rem` shell aligns every section and collapses safely at phone widths. -> P3
- The hero leads with the question product in plain language, keeps Enneagram knowledge optional,
  and uses one primary `/questions` action. -> P6+P8
- The paired gathering images are explicit 1400x788 responsive media with a shared accessible
  description, controlled bottom scrim, and exactly one speaker plus eight listeners in both eras.
  -> P10
- The question proof now borrows the real question-detail anatomy: centered question card, familiar
  answer composer, quiet coordinates, and the same tab-like perspectives shell. It remains explicitly
  illustrative and never implies that a write occurred. -> P3+P6+P13

## Tier 2 - structural within the surface

- Five narrative beats replace the production page's broader inventory: invitation, give-first
  proof, emotional-center explanation, depth fork, and final invitation. -> P4+P6+P8
- Anger, shame, and fear are grouped into three restrained cards instead of nine equal profile
  cards. Type numbers remain data, while the copy stays interpretive rather than diagnostic. -> P4+P19
- New and Enneagram-familiar visitors get different explanation depth without splitting the core
  product; both paths converge on questions. -> P6+P8
- Mobile keeps the desktop story order and replaces multi-column regions with readable single-column
  cards. No duplicated mobile-only narrative is maintained. -> P3+P4

## Tier 3 - polish/signature

- The hero's signature atmospheric effect is a six-second time mirror: the modern streetlamp
  gathering gently dissolves into its Ancient Greece counterpart at the three-second mark, then
  returns at six seconds. Hover holds the current era; click or keyboard activation deliberately
  pauses or resumes it; and reduced motion removes the automatic dissolve. -> P10+P11+P15
- The question proof's interaction remains product-specific: three real fixture responses sit visibly
  blurred behind a lock state, then resolve only after the visitor writes a local preview answer. The
  reveal transition is owned by CSS and exists only under
  `prefers-reduced-motion: no-preference`. -> P11+P13
- Amber is reserved for the primary question path and illuminated labels; teal and the three center
  colors encode meaning without competing with the main action. -> P19
- The global particle layer is placed behind the preview's owned canvas so the streetlamp photograph,
  not floating decoration, carries the atmosphere. -> P19

## Asset review

- `static/images/home-reimagined/streetlamp-nine-provisional.webp`: 1400x788, 46,184-byte WebP.
- `static/images/home-reimagined/ancient-fire-nine-provisional.webp`: 1400x788, 75,102-byte WebP.
- Both eras contain exactly nine countable figures: one speaker and eight listeners. The Ancient
  Greece image preserves the elevated framing, circle spacing, speaker position, figure scale, dark
  edge falloff, and warm central practical light of the modern scene.
- The ancient version replaces the streetlamp with a modest brazier/fire and the street gathering
  with weathered marble philosophers in a worn stone courtyard. The figures read as actively
  listening rather than a museum lineup.
- No obvious duplicate bodies, extra figures, modern objects, pedestals, deformed visible hands, or
  impossible fire shadows were found in either original-resolution review.
- Both filenames stay `provisional` until DJ approves the human authenticity, marble treatment, and
  overall mood. Neither image is approved for the production homepage by this pass.

## Verification

- The production build compiles the preview without a route-specific diagnostic. Full `pnpm check`
  is currently blocked by 22 unrelated pre-existing type/schema errors elsewhere in the repository;
  the one new hero tabindex warning found on the first run was fixed by using a semantic pause/resume
  button.
- `pnpm lint:radius`: pass, 0 class violations and CSS backlog 0/0.
- `pnpm build`: pass. The Vite production build and all build/runtime-asset budgets pass after
  ratcheting the runtime-media allowance by the ancient asset's exact 75,102-byte addition.
- Live desktop at 1440x900, dark and light: hero hierarchy, image crop, question proof, reveal state,
  ancient/modern holds, midpoint dissolve, pause state, center cards, path fork, and CTA hierarchy
  reviewed.
- Live mobile at 390x844, dark and light: story order, image count/crop, stacked reveal, center cards,
  path cards, and final deep links reviewed.
- Browser measurements: `scrollWidth === clientWidth` at both 1440 and 390.
- The reveal was exercised with fixture text; it changed local UI state only and made no network
  submission.
- No application console errors were reported.

## Refinement - 2026-07-14

- Preserved the hero and its core `One question. Nine ways to see it.` proposition unchanged.
- Rebuilt the open-question demonstration to resemble `/questions/[slug]`: question card, answer
  composer, `Lock in your answer`, and a tab-like perspectives panel. Removed the `Commit your take`
  and crowd-waiting step labels. -> P3+P6+P13
- Replaced placeholder lock bars with the actual fixture responses under a real blur, plus one clear
  lock message. The preview still performs no submission or network write. -> P6+P11+P13
- Replaced `alarm systems` with the direct heading `The same question can stir anger, shame, or fear.`
  and replaced the map/room metaphor with `Start with a question. Follow the pattern when you're
ready.` The final `What do you see that everyone else misses?` invitation is unchanged. -> P6
- Re-verified the locked and revealed states at 1440x900 and 390x844 in dark and light themes. No
  horizontal overflow or application console errors; all four saved screenshots were refreshed.

## Ancient time mirror - 2026-07-14

- Generated a composition-matched Ancient Greece counterpart from the modern hero reference, then
  refined the marble, patina, soot, grain, lens softness, and fire exposure to feel photographed
  rather than rendered. -> P10
- Preserved the existing hero layout and proposition. Added only the paired image layer, the quiet
  `NOW ↔ THEN` coordinate, `The setting changes. The question does not.` caption, and the restrained
  time dissolve. -> P6+P10+P19
- Implemented the frame as an accessible pause/resume button. Hover temporarily holds the current
  era, keyboard/click toggles a persistent paused state, and `prefers-reduced-motion` leaves a static
  modern frame. -> P11+P15
- Re-verified at 1440x900 and 390x844 in dark and light themes. Both crops retain all nine figures,
  mobile remains 390px wide with no horizontal overflow, and the live page reports no console errors.
- Refreshed the desktop dark/light full-page references and the mobile dark/light hero-region
  references listed below.
- Tightened the time mirror to a six-second loop: each era stays fully readable for roughly 2.2
  seconds, then completes a 0.8-second dissolve so the opposite era lands every three seconds. The
  faster cadence keeps one CSS timing owner and preserves the existing pause and reduced-motion
  behavior. -> P11+P15

## Tier 1 follow-up - 2026-07-16

- Renamed the generic hero action from `Answer today's question` to `Choose a question to answer`
  so its promise matches the `/questions` destination. -> P6
- Removed the preview-local status banner and replaced preview-specific title and description copy
  with production-ready metadata. The route intentionally retains `noindex, nofollow` while it lives
  under `/design-preview` so it cannot compete with the production homepage in search. -> P6
- Replaced the page-owned `<main>` with a neutral wrapper because the root layout already owns the
  page's main landmark. The rendered route now contains exactly one `<main>`. -> P13
- `pnpm check`: pass with 0 errors; 125 existing warnings remain across 43 unrelated files.
- `pnpm lint:radius`: pass, 0 class violations and CSS backlog 0/0. Targeted Prettier check also
  passes.
- Fresh live verification passed at 1440x900 and 390x844 in dark and light themes. Both widths report
  zero horizontal overflow, the CTA resolves to `/questions`, metadata and landmarks match the
  intended contract, and the browser console reports no warnings or errors.

## Screenshots

- `docs/design/screenshots/home-reimagined-desktop-dark-2026-07-13.png`
- `docs/design/screenshots/home-reimagined-desktop-light-2026-07-13.png`
- `docs/design/screenshots/home-reimagined-mobile-dark-2026-07-13.png`
- `docs/design/screenshots/home-reimagined-mobile-light-2026-07-13.png`

## Approval gate

The preview is review-ready, but the paired images remain a taste gate. DJ should decide whether both
groups feel observed rather than generated, whether weathered marble is the right ancient metaphor,
and whether this five-beat page should inform or replace the production homepage. No production merge
is authorized by this preview.
