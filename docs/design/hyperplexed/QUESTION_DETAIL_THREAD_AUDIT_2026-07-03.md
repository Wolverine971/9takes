<!-- docs/design/hyperplexed/QUESTION_DETAIL_THREAD_AUDIT_2026-07-03.md -->

# Question Detail Thread HyperPlexed Audit - 2026-07-03

Target: `/questions/[slug]`, using `whats-your-biggest-fear` as the live dynamic sample. Code surface covers `src/routes/questions/[slug]/+page.svelte`, `QuestionDisplay`, `Interact`, `QuestionContent`, `Comments`, `Comment`, `SortComments`, `AIComments`, `Links`, and `Link`.

Prior art stacked: `docs/design/hyperplexed/QUESTIONS_INDEX_AUDIT_2026-07-03.md`, `docs/development/questions-slug-audit.md`, `docs/design/2026-06-09-design-audit.md`, `docs/design/2026-06-11-mobile-audit.md`, and the HyperPlexed tracker backlog row for "Question detail thread".

Regions audited: root/detail shell, breadcrumbs, category metadata, question card, interaction toolbar, first-answer composer, lock state, public AI sample preview, tabs, comments/replies, sort/filter modal, AI carousel, article links, modals, light mode, motion, and mobile density.

## Tier 1 - cheap, high-impact (alignment/padding/labels)

- [category metadata] The detail page prints every assigned question tag above the question. On the live sample this became 6 category lines and 125px before the question at 390px, plus 46px on desktop. Show the primary/deepest category and a `+N` disclosure, then keep the full category list in the author/editor category area or a quiet details row. -> P6+P4+P1
- [first-answer composer] The SSR page renders without the composer and without the QR Share button, then hydration auto-opens the composer from `Interact.svelte` and adds Share after QR generation. At 390px this produced a 360px composer, a 128px toolbar, and pushed the thread shell down to top 1138px. Make the initial state stable: either render the first-answer composer as part of the server-visible page state, or keep it closed behind a clear "Answer to unlock" primary action; reserve the Share slot or move Share out of the first viewport. -> P8+P13+P11
- [mobile tabs] Mobile tabs visually and accessibly collapse to counts only. Live DOM showed tab text `17` and `0`, no `aria-label`, and `aria-labelledby="Comments-tab"` / `Articles-tab` pointing to ids that do not exist. Keep visible labels on mobile or add explicit labels like "17 comments" and "0 articles", then wire tab ids correctly. -> P6+P13
- [primary controls] The thread toolbar, composer footer, Links load-more, and SortComments modal each hand-roll primary/secondary buttons instead of using the Button atom. Light-mode verification showed the primary comment button rendering white text on amber, while the V5 direction prefers dark-on-amber primary actions. Route these controls through the primitive or match its token contract exactly. -> P13

## Implementation Update - 2026-07-03

Tier 1 shipped in code:

- [category metadata] Reader-facing row now shows the deepest/primary topic plus a compact `+N` details disclosure for additional tags. Structured breadcrumb/schema category data remains intact. -> P6+P4+P1
- [first-answer composer] `Interact.svelte` no longer auto-opens the composer after hydration. First-time visitors get a stable primary `Answer to unlock` action, and Share keeps a disabled slot until the QR code is ready. Composer slide motion is reduced-motion aware. -> P8+P13+P11
- [mobile tabs] Question tabs now render count plus label at every viewport, use `role="tablist"` / `role="tabpanel"`, and wire stable `comments-tab` / `comments-panel` ids. Smooth scroll and fade are reduced-motion aware. -> P6+P13
- [primary controls] Thread toolbar, composer footer, Articles load-more, and SortComments trigger/footer now route through the shared `Button` atom; short-answer nudge colors moved to V5 tokens. -> P13

Post-fix live verification:

- Desktop dark, 1440x1000: no horizontal overflow; composer stays closed on load; toolbar renders `Answer to unlock`, `Subscribe`, `Share`; primary action computes dark text on amber; tabs render `17 Comments` / `0 Articles` with `comments-tab` / `articles-tab` ids.
- Mobile dark, 390x844: no horizontal overflow; category metadata row reduced from 125px in the audit to 28px; composer stays closed until `Answer to unlock`; opening the composer keeps submit disabled while empty and preserves no-overflow; Articles tab switches to `articles-panel`.
- Mobile light, 390x844: no horizontal overflow; thread-local `--cta-text` makes the Button primary action dark-on-amber (`rgb(28, 25, 23)` on `rgb(180, 83, 9)`).
- Screenshots captured:
  - `/private/tmp/9takes-question-slug-fix-2026-07-03/desktop-1440-full.png`
  - `/private/tmp/9takes-question-slug-fix-2026-07-03/mobile-390-dark-full-final.png`
  - `/private/tmp/9takes-question-slug-fix-2026-07-03/mobile-390-dark-composer-open.png`
  - `/private/tmp/9takes-question-slug-fix-2026-07-03/mobile-390-dark-articles.png`
  - `/private/tmp/9takes-question-slug-fix-2026-07-03/mobile-390-light-full.png`

## Tier 2 - structural within the surface (declutter/hierarchy)

- [locked thread hierarchy] The locked visitor state gives the public AI preview more visual weight than the unlock action. At 390px the preview measured 950px tall and the lock state sat below it, after the already-open composer. Put the lock explanation/action first, then make the sample perspectives a compact preview or collapsible "See sample takes" section. -> P4+P6+P8
- [unlocked comment SSR] The unlocked comments path is still browser-gated in `Comments.svelte`, so answered users on direct load get a client-only comment list rather than SSR-visible thread content. Keep the IntersectionObserver/infinite-scroll client-only, but render the initial unlocked comments server-side to avoid pop-in and preserve the thread as the core content. -> P8+P11
- [sort/filter modal] `SortComments.svelte` still carries a standalone "Dark Purple Theme" modal system, custom buttons, `transition: all`, `fly`/`scale` effects, type chips with full color backgrounds, and no reduced-motion guard. Rebuild around Modal/Button primitives, make selected filters visible outside the modal when active, and gate nonessential motion. -> P7+P13+P11
- [comment action row] Comment cards use a good type-colored left stripe, but the action row gives Like, Reply, and Settings similar weight and mixes bespoke icons/control shells. Make Reply the clearest action, demote like count to metadata when inactive, and put every icon in a fixed-size container with one icon style. -> P4+P9+P13
- [articles tab] The live sample had no links and the empty state was only "No linked articles yet." The populated card path still uses a fixed 300px image card with a dark text patch over media rather than a predictable scrim and text priority order. Give the empty state a useful sentence, and convert populated links to auto-height rows/cards with line clamps and a real image scrim. -> P6+P10+P1
- [AI carousel] The unlocked AI carousel is browser-only, uses tiny dot tabs, has no arrow-key handling, runs transform/opacity transitions without reduced-motion handling, and the label "Enneagram Takes (stereotypes)" undercuts the rest of the page's warmer editorial tone. Treat it as a compact "Sample type perspectives" preview, make controls keyboard-complete, and gate motion. -> P6+P13+P11

## Composer Refinement - 2026-07-16

- [first-answer composer] Voice capture no longer renders as a separate mini-section between the textarea and submit footer. `Record your answer` now sits at the left of the unified action row, `Post answer` sits at the right, and the old footer divider/background were removed. The specialized recording control keeps its 44px target, focus ring, disabled/busy states, and reduced-motion treatment. -> P8+P13
- [first-answer microcopy] The flow now uses one noun consistently: `Your answer`, `Record your answer`, `Post answer`, and `Answer posted`. Returning question commenters and replies derive the matching `comment` / `reply` language. The textarea example is shorter, the Ctrl/Command+Enter hint and passive character counter are gone, and the transcript reassurance is demoted to `Review the transcript before you post.` -> P6+P4
- [responsive action row] Desktop keeps record/help and submit on one line. At 390px, the two actions become full-width stacked controls, the idle helper hides, and the page retains zero horizontal overflow. -> P1+P4+P8
- [long-answer overflow] The answer field now grows with typed or transcribed text to 320px on larger screens and 256px at phone widths, then keeps the rest of the response in a native internal scroll region. The unbounded mirrored-text layout was removed so very long answers cannot keep expanding the page. -> P1+P8

Fresh live verification:

- Desktop light and dark at 1440x1000: record and post share one visually continuous composer surface; no footer border/background; no horizontal overflow in empty or filled states.
- Mobile dark at 390x844: controls stack full-width, the idle helper hides, microcopy remains readable, and document overflow remains zero.
- A live 5,000-word stress test measured a 318px desktop field with 17,192px of scrollable content and a 254px mobile field with 60,032px of scrollable content; document width stayed matched to the viewport at both sizes.
- Browser console: zero errors during the composer-open, filled-answer, theme, and responsive checks.

## Microphone Permission Flow - 2026-07-16

- [permission policy] The server was sending `microphone=()` in `Permissions-Policy`, so browsers rejected `getUserMedia()` before they could show a native permission prompt. The policy now allows microphone capture for the same origin with `microphone=(self)` while the other restricted capabilities remain disabled. -> P8+P13
- [first-use disclosure] Selecting `Record your answer` with an unknown permission state now opens the shared Modal primitive with a short explanation: recordings become editable text, nothing posts automatically, and the browser prompt comes next. `Allow microphone` calls `getUserMedia()` directly from the user gesture; previously granted visitors still start recording in one click. -> P6+P4+P13
- [blocked recovery] A denied request stays in the dialog and switches to `Microphone is blocked`, with targeted recovery copy for Chrome/Edge, Firefox, macOS Safari, iPhone/iPad Safari, and iOS Chrome/Firefox. `Keep typing` closes the dialog without disabling the composer. Missing, busy, and unavailable microphone states use the same recoverable shell. -> P6+P8+P13
- [responsive/accessibility] The shared modal supplies focus trapping, Escape/backdrop close, focus restoration, scroll locking, dialog labels, and a `100dvh` mobile-safe shell. The permission UI uses the Button atom, 44px-plus controls, and has no custom motion beyond the primitive. -> P1+P11+P13

Permission-flow verification:

- Response header: local `HEAD /` returned `Permissions-Policy: ... microphone=(self) ...`.
- Focused component tests cover first-use disclosure before `getUserMedia()`, a successful transcript flow, browser-specific blocked recovery with typing preserved, and the already-granted one-click path.
- Desktop dark, default browser viewport: the explanation dialog fit cleanly over the open answer composer with a clear primary action and no console errors.
- iPhone-sized dark, 390x844: dialog content and both actions fit without horizontal overflow (`scrollWidth` matched the 390px viewport).

## Active Voice Capture Layout - 2026-07-16

- [recording hierarchy] While capture or transcription is active, the recorder now owns the full composer action row. Unavailable Post/Cancel actions yield until editable text is ready, leaving Stop or the transcription status as the single current action instead of competing with it. The actions return as soon as capture completes or recovers from an error. -> P4+P8+P13
- [transcript geometry] The transport row and live transcript now use explicit `minmax(0, 1fr)` grids, full-width bounds, tabular timing, and `overflow-wrap: anywhere`. Long live speech can wrap and clamp inside the composer instead of expanding underneath the submit control. -> P1+P13
- [responsive/shared behavior] At phone widths the Stop control and listening status stack cleanly, while the live transcript remains a full-width row. The shared treatment applies to first answers, returning comments, replies, and the inline strategic-question composer. -> P1+P4+P8

Post-fix verification:

- Focused VoiceRecorder and Interact component suites pass, including the active `recording` phase contract and transcript-to-editable-text handoff.
- Svelte validation reports no component errors in VoiceRecorder, Interact, or StrategicQuestion.
- Fresh post-fix active-recording screenshots remain owed; the supplied production screenshot is the before reference.

## Community-first handoff and share nudge - 2026-07-22

- [discussion hierarchy] The unlocked page now names and renders `What people actually said` before
  any generated content. The nine AI examples moved below the community stream into a closed,
  explicitly optional disclosure that says generated examples are not community posts. -> P4+P6+P8
- [answer-card consistency] Extracted one `PerspectivePreviewCard` using the existing community take
  stripe, type badge, metadata, body hierarchy, long-string wrapping, and V5 card radius. Both the
  homepage reveal and optional question-page comparison now use it. -> P1+P2+P3+P4
- [desktop share nudge] Eight seconds after a first answer, or after entering from the homepage
  handoff, desktop visitors receive one dismissible side card: `Who would answer this differently?`
  The primary action opens native sharing when available and otherwise copies the canonical URL with
  group-chat-specific confirmation copy. It never appears below 900px and is session-deduped per
  question. -> P6+P8+P11+P13
- [accessibility and motion] The nudge does not steal focus, has a labeled 44px dismissal control,
  uses the Button primitive for sharing, and reduces its entrance to an immediate render when reduced
  motion is requested. -> P11+P13
- Targeted Svelte autofixer, ESLint, and Prettier checks pass. `pnpm check` passes with existing
  repository warnings; `pnpm lint:radius` is still blocked by two unrelated in-progress files.
- Fixture-backed browser verification confirmed the delayed card appears on desktop with no console
  errors or horizontal overflow, while the same entry route leaves the nudge absent at 390x844.
  Capture: `/private/tmp/9takes-share-nudge-desktop.png`.
- The follow-up robustness pass clears pending nudge state before client navigation, falls back to
  clipboard when native sharing fails for a non-cancel reason, gives copy failures an error tone,
  filters malformed AI type rows, and adds an explicit reduced-motion-safe disclosure chevron.
  Browser verification exercised the failed-native-share fallback on desktop and reconfirmed no
  mobile nudge or overflow. Captures: `/private/tmp/9takes-doublecheck-question-share-desktop.png`
  and `/private/tmp/9takes-doublecheck-question-mobile.png`.

## Tier 3 - polish/signature (motion/effects, at most one per surface)

- [motion pass] The surface already has enough visual identity from the type-color stripe and Streetlamp case-file styling. Do not add P14-P18 signature effects yet. First gate the existing `slide`, `fade`, hover translate, carousel transform, spinner, and modal fly/scale motion for reduced-motion users. -> P11

## Verification

- Static pass: read the route and child components listed above, plus the root layout shell.
- Prior-art pass: stacked against the questions index HyperPlexed audit, the February slug audit, the June design/mobile audits, and the tracker.
- Live pass: `./node_modules/.bin/vite dev --host 127.0.0.1 --port 5177` served the app at `http://127.0.0.1:5178/` because 5177 was in use.
- Live target: `http://127.0.0.1:5178/questions/whats-your-biggest-fear`.
- Desktop dark, 1440x1000: page loaded; no document horizontal overflow; root `main` rendered 896px wide, `.open-case` 848px, `.open-case-inner` 752px; categories wrapped to 46px; locked preview measured 565px tall.
- Mobile dark, 390x844: no document horizontal overflow; categories rendered 6 lines/125px; toolbar became 128px after Share appeared; auto-open composer measured 326x360; content shell started at 1138px; locked preview measured 292x950.
- Mobile Articles tab: tab switch worked; empty state was only "No linked articles yet."; mobile tab accessible names remained count-only.
- Mobile light, 390x844: main surfaces held; primary comment button computed white text on amber; locked preview/card text contrast was readable; same mobile density issues remained.
- Unlocked comments, sort modal, reply/edit/flag, links with media, and AI carousel were audited statically/code-first because the local visitor state was locked and I did not create a real production comment just to unlock the page.
- Screenshots captured:
  - `/private/tmp/9takes-question-slug-hyperplexed-2026-07-03/question-slug-desktop-dark-full.png`
  - `/private/tmp/9takes-question-slug-hyperplexed-2026-07-03/question-slug-desktop-dark-after-qr-full.png`
  - `/private/tmp/9takes-question-slug-hyperplexed-2026-07-03/question-slug-mobile-dark-composer-full.png`
  - `/private/tmp/9takes-question-slug-hyperplexed-2026-07-03/question-slug-mobile-light-full.png`
