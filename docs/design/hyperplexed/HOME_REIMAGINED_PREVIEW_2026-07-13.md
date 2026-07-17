<!-- docs/design/hyperplexed/HOME_REIMAGINED_PREVIEW_2026-07-13.md -->

# Home Reimagined HyperPlexed Audit - 2026-07-13

Current target: production `/`, covering `src/routes/+page.svelte`, its owned-shell loader, the live
featured-question flow, and the modern / Ancient Greece gathering pair. The page began at
`/design-preview/home-reimagined`; that route now permanently redirects to `/`. The previous
production homepage is preserved at `/old-home` with a visible archive notice and `noindex`.

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
  and uses one primary action that lands on the page's live featured question. -> P6+P8
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
- The question proof's interaction remains product-specific: three representative answers sit
  visibly blurred behind a lock state, and the live nine-perspective result resolves only after the
  visitor successfully posts an answer. The reveal transition is owned by CSS and exists only under
  `prefers-reduced-motion: no-preference`. -> P11+P13
- Amber is reserved for the primary question path and illuminated labels; teal and the three center
  colors encode meaning without competing with the main action. -> P19
- The global particle layer is placed behind the preview's owned canvas so the streetlamp photograph,
  not floating decoration, carries the atmosphere. -> P19

## Asset review

- `static/images/home-reimagined/streetlamp-nine.webp`: 1400x788, 46,184-byte WebP.
- `static/images/home-reimagined/ancient-fire-nine.webp`: 1400x788, 75,102-byte WebP.
- Both eras contain exactly nine countable figures: one speaker and eight listeners. The Ancient
  Greece image preserves the elevated framing, circle spacing, speaker position, figure scale, dark
  edge falloff, and warm central practical light of the modern scene.
- The ancient version replaces the streetlamp with a modest brazier/fire and the street gathering
  with weathered marble philosophers in a worn stone courtyard. The figures read as actively
  listening rather than a museum lineup.
- No obvious duplicate bodies, extra figures, modern objects, pedestals, deformed visible hands, or
  impossible fire shadows were found in either original-resolution review.
- DJ approved the page for production on 2026-07-16. Both filenames were promoted out of their
  provisional state without changing the reviewed image bytes.

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

## Tier 2 live answer flow - 2026-07-16

- Replaced the local-only `needing space` illustration with live question `#567`: “What's something
  you do every day to seem ‘fine’ that nobody knows is costing you effort?” The question is backed
  by a real `questions` row, one community answer, and a complete nine-take seed. -> P6+P13
- Routed the composer through the existing Chorus `/api/nine/mirror` path. A successful submission
  becomes a real top-level question answer, records the give-first contribution, returns the mirror,
  and opens the nine perspectives without requiring an account. -> P8+P13
- Converted the mock controls into one semantic form with a persistent label, help text, word and
  character feedback, durable inline errors, disabled/loading states, and one action labeled “Post
  answer and reveal.” The client creates the visitor fingerprint before posting and only enters the
  success state when the endpoint confirms `answerRecorded`. -> P6+P13
- The reveal now renders all nine seeded perspectives with their source labels, the reader's submitted
  answer and mirror, and a direct link to the live community thread. The former local reset path was
  removed because a posted answer is not disposable preview state. -> P4+P6+P13
- The page records a best-effort question impression using the same gate event as the strategic
  question widget, attributed to the homepage path, and captures a client-side answered event after
  confirmed success.
- Read-only database verification confirmed question `#567`, one existing comment, and exactly nine
  seeded takes. `pnpm check` passes with 0 errors and the existing 125 warnings across 43 unrelated
  files; `pnpm lint:radius` and targeted formatting checks pass.
- Live pre-submit verification passed at 1440x900 and 390x844 in dark and light themes. Empty and
  short drafts keep submission disabled, a valid sentence enables the action, the thread URL is
  correct, both widths have zero horizontal overflow, and the browser console is clean. The final
  submit was intentionally not clicked during verification so no synthetic production answer was
  created.

## Tier 3 production promotion - 2026-07-16

- Promoted the reimagined page, its owned-shell loader, and its featured-question server loader to
  `/`. The hero action now lands directly on `#live-question`, with a sticky-header scroll offset, so
  the primary promise and destination are the same interaction. -> P6+P8+P13
- Added production canonical, robots, Open Graph, Twitter, and `WebPage`/`Question` structured data
  through the shared `SEOHead` component. The new root is explicitly `index, follow`, uses the
  approved streetlamp image for social sharing, and renders exactly one main landmark. -> P6+P13
- Preserved the former production homepage at `/old-home`. It retains its full loader and content,
  adds a visible `ARCHIVED HOMEPAGE · OLD VERSION` notice with a route back to `/`, and is marked
  `noindex, nofollow`. The former preview URL returns a permanent `308` to `/`. -> P6+P8+P13
- Replaced the stale locked-answer fixture copy with examples that match the live `seem fine`
  question while keeping the answers blurred and excluded from accessibility output. -> P4+P6
- `pnpm check`: pass with 0 errors and the existing 125 warnings across 43 unrelated files.
  `pnpm lint:radius`: pass, 0 class violations and CSS backlog 0/0. Targeted Prettier checks pass.
  The standalone Svelte autofixer is not installed in this workspace, so the full Svelte check is
  the validation fallback.
- `pnpm build`: pass, including the Vercel adapter and all build/runtime-asset budgets. Fresh live
  verification passed at 1440x900 and 390x844 in dark and light themes with zero horizontal
  overflow, production metadata, archive metadata, the 308 redirect, the hero anchor, the valid-draft
  enabled state, the time-mirror pressed state, and an empty browser console all confirmed. The live
  form was not submitted during verification, so no synthetic public answer was created.

## Microcopy transition refinement - 2026-07-17

- Renamed the hero proof point from `Give first` to the plain-language `Answer first`. -> P6
- Reframed the third section from `WHY THE ANSWERS DIFFER` to `THE PATTERN UNDERNEATH`, then added the
  missing narrative bridge from multiple honest perspectives, through shared core emotions and
  different learned strategies, to the Enneagram's nine recurring personality patterns. -> P6
- Replaced the mechanical-typing disclaimer with a clearer reassurance that visitors do not need a
  label to notice what someone sees first, preserving the framework as an explanatory lens rather
  than a prerequisite. -> P6
- The official Svelte autofixer reports no findings for the changed markup. `pnpm check` passes with
  0 errors and the existing 124 warnings across 42 unrelated files; `pnpm lint:radius` and targeted
  Prettier checks pass. No new screenshots were captured for this copy-only follow-up.

## Screenshots

- `docs/design/screenshots/home-reimagined-desktop-dark-2026-07-13.png`
- `docs/design/screenshots/home-reimagined-desktop-light-2026-07-13.png`
- `docs/design/screenshots/home-reimagined-mobile-dark-2026-07-13.png`
- `docs/design/screenshots/home-reimagined-mobile-light-2026-07-13.png`

## Production decision

DJ approved the Tier 3 polish, the paired images, and replacement of the production homepage on
2026-07-16. The prior homepage remains available at `/old-home` for rollback or reference.
