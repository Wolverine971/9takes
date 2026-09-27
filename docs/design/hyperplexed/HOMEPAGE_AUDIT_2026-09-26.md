<!-- docs/design/hyperplexed/HOMEPAGE_AUDIT_2026-09-26.md -->

# Homepage audit — live V2

September 26, 2026. Audit of the live homepage at `https://9takes.com/`, rendered by
`src/lib/components/marketing/HomeLandingV2.svelte`. It builds on the
[Harry Dry homepage build log](HARRY_DRY_HOMEPAGE_AUDIT_2026-09-10.md), which covers how V2 was designed and
promoted. This audit looks at the page as shipped, using real visitor behavior plus the HyperPlexed
rubric.

**Status:** Tiers 1 and 2 shipped locally, not deployed ([Tier 1](#tier-1-implementation),
[Tier 2](#tier-2-implementation)). Tier 3 not started. The ambitious funnel is built as a noindex preview at
`/design-preview/homepage-live-take` for DJ's review ([Live-take preview](#live-take-preview)).

## Evidence

### Visitor behavior since the V2 deploy

From `page_analytics_visits` for `path = '/'`, anonymous visitors only, `started_at > 2026-09-12`.

| Metric                                      | All visits | Engaged (5s+) |
| ------------------------------------------- | ---------- | ------------- |
| Visits                                      | 365        | 131           |
| Median engaged time                         | 1.2s       | 12.6s         |
| Scrolled past 25% (past the hero)           | 15.6%      | 40.5%         |
| Scrolled past 50%                           | 12.1%      | 31.3%         |
| Scrolled past 90%                           | 8.2%       | 20.6%         |
| Went on to another page in the same session | 36%        | 77% (101)     |
| Went on to a `/questions/*` page            | —          | **10**        |

Next page after the homepage, all anonymous visits: exit 233, `/personality-analysis` 58,
`/enneagram-corner` 30, `/questions` 13, `/search` 10, `/about` 3, `/how-to-guides` 3, `/book-session` 1.
Referrers: direct 339, Google 20.

Read:

- **The hero decides everything.** About 60% of engaged visitors never scroll past it.
- **The page routes people to content, not to questions.** Personality Analysis and Enneagram Corner are the
  top two destinations. Enneagram Corner is not linked anywhere in the homepage body, so those visits come
  from the shared header.
- **The main CTA is unmeasured.** `Reveal 9 perspectives` fires no analytics event, so reveal starts,
  completions and live-question handoffs cannot be counted.
- `page_analytics_visits` has no device column; the mobile share is unknown.

Queries used (read-only, `scripts/db-query.sh`):

```sql
-- Engaged homepage behavior
with h as (select * from page_analytics_visits
           where path = '/' and started_at > '2026-09-12' and user_id is null and engaged_ms > 5000)
select count(*),
       percentile_cont(0.5) within group (order by engaged_ms) / 1000 as med_engaged_s,
       avg((max_scroll_pct >= 25)::int) as scroll25,
       sum((exists (select 1 from page_analytics_visits v
                    where v.session_id = h.session_id and v.started_at > h.started_at))::int) as continued,
       sum((exists (select 1 from page_analytics_visits v
                    where v.session_id = h.session_id and v.started_at > h.started_at
                      and v.path like '/questions/%'))::int) as to_question
from h;
```

### Layout measurements (headless Chromium, production, before fixes)

| Viewport         | Measurement                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------ |
| 390×844 (iPhone) | Answer box top at 936px, Reveal button 1062–1110px: **both below the 844px fold**          |
| 390×844          | Question card starts at 751px; hero diagram occupies 357–699px                             |
| 1440×900         | Question card top at 243px vs headline top at 141px; card floats ~100px below the headline |
| 1440×900         | Live question cards start ~1,800px down, below a 560px decorative image                    |
| Both             | 14 distinct font sizes (9px–35px on mobile); 4 of them below 14px                          |

## Regions

Shared header · hero copy · “I’m fine” diagram · question card · steps strip · conversation image ·
community questions · reading links · FAQ · founder story + closing CTA · shared footer.

## Tier 1 — cheap, high-impact (alignment/padding/labels)

- **T1-1 [mobile hero] CTA is off the first screen.** At 390×844 the answer box starts 92px below the fold and
  the Reveal button 218px below. The thought-bubble diagram pushed them down. Fix: on mobile, the question card
  follows the subhead and the diagram moves below it. → P8+P3
- **T1-2 [question card] Eight pieces of text around one text box.** Privacy is said four ways (“Private
  practice”, “Stays in this tab. Nothing is posted.”, “Your answer stays private…”, “No account”), plus a
  redundant “Your answer” label and hint row. Fix: question, one give-first line, text box, button, one
  reassurance line that keeps the AI-written disclosure. → P6+P4
- **T1-3 [hero] Hierarchy inversion.** The line that states the thesis, “You won’t know until you ask.”, is an
  11px footnote (`HomeLandingV2.svelte:190`); the diagram caption is 11px mono (9px on mobile). Two stacked
  subheads say nearly the same thing (`:144-148`). Fix: merge the subheads, promote the “ask” line to the
  diagram’s punchline, lift the caption to the 12px mono step. → P6+P4+P5
- **T1-4 [FAQ] Global element styles leak in.** The site-wide `details`/`summary` rule
  (`src/scss/index.scss:746`) gives each FAQ row a filled background, border, radius and extra padding (92px
  rows). No other homepage surface looks like that. Fix: reset those properties in the component so the FAQ
  uses the page’s hairline-divider style. → P3
- **T1-5 [icons] Off-site arrow on internal links.** `ArrowUpRight` (↗) marks in-site links: “Add your
  perspective”, the three reading links, “Read my story”, “Join the friendship conversation”, “Compare V1”.
  Fix: `ArrowRight` (→) for in-site links; ↗ stays reserved for off-site. → P9
- **T1-6 [hero alignment] Floating question card.** The hero grid uses `align-items: center`, so on desktop the
  card sits ~100px below the headline with dead space above it. The diagram caption is left-aligned over a
  centered diagram. Fix: top-align the card with the headline; center the caption with the diagram. → P3
- **T1-7 [microcopy]** The mobile header renders “Log in/ Sign up”: Svelte 5 trims the leading space inside
  `.mobile-signup-suffix` (`Header.svelte:184`). The 11px community note (“Live community responses are
  separate from the AI-written practice…”) repeats what the page already says. Fix: keep the space; cut the
  note. → P6+P4

## Tier 2 — structural within the surface (declutter/hierarchy)

- **T2-1 [live questions buried]** Real questions with real counts sit ~1,800px down, below a 560px decorative
  image that most visitors never reach. Move them directly under the hero; put the image after. → P8+P3
- **T2-2 [reading links]** Replace the text-only “People are more interesting than their labels” row with four
  real celebrity portraits plus an Enneagram Corner link, matching the top two exit destinations. → P10+P8
- **T2-3 [two amber buttons]** The header’s filled “Log in / Sign up” and “Reveal 9 perspectives” compete in the
  first screen; in dark mode they are identical. Keep one amber primary per screen and make login secondary.
  **Fork:** the header is shared, so this changes every page. → P19
- **T2-4 [type scale]** Snap the page to the V5 type scale (`docs/design-system.md` §6); nothing below 14px
  except mono labels at 12px. → P5 + new P21 (type-scale snap)
- **T2-5 [section rhythm]** Every section uses the same heading-left/content-right/1px-rule template, so the page
  reads like a document. Give the steps strip and the closing CTA full-width tinted bands; let the closing CTA
  own its row; enlarge the 56px founder photo. → P3
- **T2-6 [steps strip]** The three steps are 13px footnote text and skip the locked ritual line “Answer before
  the crowd.” Promote it to a real section using that line, or cut it. → P6
- **T2-7 [instrumentation]** Add events for reveal started, reveal completed and live-question handoff clicked.
  Needed before any funnel change can be judged.

## Tier 3 — polish/signature (one per surface)

- **T3-1 [diagram]** Draw the branch lines in, then stagger the thought bubbles in when the diagram enters the
  viewport. Reduced motion shows the static diagram. → P11 + new P (stroke draw-in)

## The funnel fork

The main CTA produces zero real takes by design. The practice answer is discarded, and the handoff says “Your
practice answer won’t be carried over”, so a visitor who wants to join must write it again on a live question.

- **Lean:** Tiers 1–2 plus instrumentation. Same funnel, cleaner and measurable.
- **Ambitious (DJ approved the direction for a test page, 2026-09-26):** make the hero question a real live
  question. After the reveal, one opt-in action, “Post my answer anonymously → see the real answers”, posts the
  answer the visitor already wrote and unlocks the live thread through the existing give-first mechanic. The
  homepage becomes the “Answer before the crowd” ritual instead of a demo. Privacy copy becomes “Nothing is
  posted unless you choose to.”

### Next: ambitious funnel test page

Built 2026-09-26; see [Live-take preview](#live-take-preview).

## Tier 1 implementation

Shipped locally 2026-09-26, not deployed. Files: `src/lib/components/marketing/HomeLandingV2.svelte`,
`src/lib/components/molecules/Header.svelte`. The `/design-preview/harry-dry-v2` route renders the same
component and picks up the same changes.

- **T1-1.** Hero is now three grid areas: `intro`, `hero-action` (question card + activity line), `visual` (diagram). Desktop: intro and visual stack on the left, the action column spans both rows on the right. Mobile: intro → card → diagram. DOM order matches, so screen readers reach the CTA before the diagram. **Result:** 390×844: Reveal button 574–622px (was 1062–1110). 320×640: answer box fully visible; the button starts at 617px, so it is partly below that shorter screen.
- **T1-2.** Card is now: kicker, question, give-first line, text box (per-question hint as placeholder), button, one reassurance line: “Nothing is posted. No account needed. You’ll compare 9 AI-written examples.” Removed “Private practice”, the “Your answer” label row, the separate privacy line, the source note and the “No account · No type knowledge · Just curiosity” footer. The text box keeps `aria-labelledby` on the question and is described by the give-first line, the reassurance line and any error. Also reset an inherited 20px textarea margin so the button sits 16px below the box. **Result:** Card height 423px (was 529px). AI-written disclosure and privacy promise kept in one line.
- **T1-3.** Merged the two subheads into “A question-and-answer community for understanding why someone else’s reaction makes sense to them.” “You won’t know until you ask.” is now the diagram’s 18px semibold punchline (17px mobile). The diagram caption moved to the 12px mono step (was 11px desktop / 9px mobile). **Result:** The thesis line reads as the payoff of the diagram instead of a footnote.
- **T1-4.** Component-scoped reset of the site-wide `details` card chrome: no fill, border, radius or padding; hairline bottom border; `summary` padding `24px 0`. **Result:** FAQ rows 75px (were 92px), matching the page’s divider style in both themes.
- **T1-5.** All `ArrowUpRight` icons on in-site links replaced with `ArrowRight`; the unused import removed. **Result:** One arrow meaning for in-site navigation.
- **T1-6.** `align-items: start` with the card in the right column: card top and headline top both at 141px on 1440×900. The activity line (“278 responses across 47 questions”) moved under the card, centered, so proof sits next to the CTA and fills the space under it. Diagram caption centered with the diagram. **Result:** Hero is ~80px shorter on desktop; the steps strip now shows in the first 900px screen.
- **T1-7.** `Header.svelte`: suffix is now `&nbsp;/ Sign up`. The leading space was collapsed because the text is a flex item inside the inline-flex link. Removed the community-window note and its CSS. **Result:** Mobile header reads “Log in / Sign up”.

### Verification

- Headless Chromium against the local dev server (`127.0.0.1:5197`) at 1440×900 light/dark, 1024×768,
  820×1180, 390×844 light/dark and 320×640: no horizontal overflow, no console errors.
- Empty submit shows the inline error and focuses the text box; `aria-describedby` includes the error. A valid
  submit reveals the comparison and focuses the reveal heading (desktop and mobile).
- 19 tests pass across 7 files (homepage, both design previews, Header, MobileNav, ConversationScenes).
- `pnpm check`: 0 errors and 0 warnings in the touched files. The 4 project errors are pre-existing in
  `scripts/lib/linkOnlyChange.js` and `scripts/personBlogParser.js`.
- Targeted Prettier and ESLint pass; `lint:radius`, `lint:colors` and `lint:global-css` pass.
- Not run: real iOS Safari device pass; production deploy.

### Screenshots

Before (production, 2026-09-26):
[desktop light](screenshots/homepage-2026-09-26/before-desktop-light.webp) ·
[desktop dark](screenshots/homepage-2026-09-26/before-desktop-dark.webp) ·
[mobile light](screenshots/homepage-2026-09-26/before-mobile-light.webp)

After (local):
[desktop light](screenshots/homepage-2026-09-26/after-desktop-light.webp) ·
[desktop dark](screenshots/homepage-2026-09-26/after-desktop-dark.webp) ·
[tablet 820](screenshots/homepage-2026-09-26/after-tablet-820.webp) ·
[mobile light](screenshots/homepage-2026-09-26/after-mobile-light.webp) ·
[mobile dark](screenshots/homepage-2026-09-26/after-mobile-dark.webp) ·
[FAQ](screenshots/homepage-2026-09-26/after-faq-desktop.webp)

### After deploy

Re-run the evidence queries two weeks after deploy and compare engaged visitors reaching `/questions/*` (10 of
131 before). T2-7 instrumentation should ship first or alongside, so reveal usage can be counted.

## Tier 2 implementation

Shipped locally 2026-09-26, not deployed. Files: `HomeLandingV2.svelte`, `Header.svelte`,
`src/lib/analytics/marketingEvents.ts` (+ spec), `src/routes/homepage.page.spec.ts`,
`src/routes/design-preview/harry-dry-v2/harry-dry-v2.page.spec.ts` (selector rename only).

- **T2-1 live questions up.** New order: hero → “Answer before the crowd.” band → live questions → conversation
  image → reading → FAQ → founder → closing. The three real questions are now full cards in a row (stacked below
  1000px) with “Browse all questions”, directly after the steps band instead of beside the image.
- **T2-2 portrait reading row.** Four published analyses from the most-read personality pages over the last 30
  days, one per type: Jack Black (7), Dario Amodei (5), Alex Karp (4), Sydney Sweeney (3). Hooks come from each
  page’s published title. Existing `s-*.webp` portraits, lazy-loaded. “Explore all personality analyses” follows
  the row. The text links now lead with Enneagram Corner (the #2 exit destination, previously unlinked), then
  guides and Talk to DJ.
- **T2-3 amber budget.** On `/` only, the desktop header login renders as the tinted ghost button that mobile
  already uses, so Reveal is the one solid amber action. Every other route keeps the solid login button;
  making it site-wide is a one-line change in `Header.svelte` if DJ wants it.
- **T2-4 type scale.** 23 distinct font sizes → 8: 12 (mono labels and diagram chips only), 14, 16, 18, 22
  (lead), 28, section headings `clamp(28px, 3.2vw, 40px)`, and the h1. Nothing but mono labels and chips is
  below 14px. The 22px lead step is not in the V5 lock; it covers the hero subhead, card titles and pull
  quotes. Propose adding it to `docs/design-system.md` §6 if it holds up.
- **T2-5 section rhythm.** Tinted full-width bands for the steps, FAQ and closing; hairline rules cut from five to
  one (above the reading section). The founder story has its own row with a 160px photo (120px tablet, 96px
  mobile); the closing CTA is a centered band.
- **T2-6 steps.** The strip is now a real section headed with the locked ritual line “Answer before the crowd.”
  DJ’s three step labels are unchanged; each gains one supporting line.
- **T2-7 instrumentation.** PostHog events with ids, slugs and placements only (spec asserts answer text is never
  sent): `homepage_practice_started` (first keystroke per question), `homepage_practice_revealed`,
  `homepage_practice_handoff_clicked` (placement `reveal` / `closing`), `homepage_practice_next_question`, and
  `homepage_link_clicked` (placements `live_questions`, `people_row`, `reading_links`). One delegated listener
  reads `data-track` attributes because the `Button` atom drops `onclick` on link buttons. Surface is
  `homepage` or `homepage_preview`.

Verification: headless 1440/1024/820/390/320 in light and dark with no overflow or console errors; reveal and
empty-submit flows pass; mobile Reveal button 607–655px. 24 focused tests pass before the preview work; the
final combined run is listed under the preview.

Screenshots: [desktop full](screenshots/homepage-2026-09-26/tier2/desktop-light-full.webp) ·
[desktop dark fold](screenshots/homepage-2026-09-26/tier2/desktop-dark-fold.webp) ·
[mobile full](screenshots/homepage-2026-09-26/tier2/mobile-light-full.webp) ·
[mobile sections](screenshots/homepage-2026-09-26/tier2/mobile-sections.webp) ·
[dark reading row](screenshots/homepage-2026-09-26/tier2/desktop-dark-reading.webp)

## Live-take preview

`/design-preview/homepage-live-take` (noindex, nofollow, `cache-control: private, no-store`). Built on the same
`HomeLandingV2` component through a `live` prop, so approving it means passing that prop from `/` and swapping
the simulated post for a real one.

Flow:

1. **Hero card** shows the real live question (`question_formatted` for
   `whats-criteria-considering-someone-friend`, id 203) with “LIVE QUESTION · 10 responses so far”. Note: “Nothing
   is posted unless you choose to. No account needed. First, compare 9 AI-written examples.”
2. **Private reveal** is unchanged: the 9 AI-written friendship perspectives and comparison.
3. **Opt-in card** replaces the old “Your practice answer won’t be carried over” handoff: “10 responses from real
   people are waiting. Post your answer anonymously to read theirs.” It shows the answer they already wrote, with
   **Post anonymously and read them** and **Keep it private**. The hero receipt and closing CTA also point to it.
4. **Posted state:** “You’re in. Here’s how others answered.” Their take appears first, then real answers.
   Signed-in admins see up to 12 real answers (loaded server-side with `getQuestionTakes` after an admin check).
   Everyone else sees three locked placeholders, so the preview never bypasses give-first. Then **Open the full
   conversation**.
5. **Keep it private** leaves a “Post it anonymously” second chance and a link to other questions. The FAQ
   answer about “What happens to my answer here?” switches to the opt-in wording.

Posting is simulated (650ms, nothing saved) and says so in the card’s fine print. Events:
`homepage_practice_live_post_clicked` and `homepage_practice_live_kept_private` under surface
`homepage_preview`.

Checks: 80 tests across 19 files pass (including 3 preview specs: noindex and live framing, opt-in → simulated
post with no answer text in analytics, admin answers rendering; plus the answer mapper). `pnpm check` has 0
errors or warnings in touched files (4 pre-existing errors in blog scripts). Targeted ESLint and Prettier pass;
radius, color and global-CSS lints pass. Headless desktop light/dark and mobile flows: no overflow, no console
errors. The signed-in admin state was verified by test, not by screenshot.

Screenshots: [desktop fold](screenshots/homepage-2026-09-26/live-take/desktop-fold.webp) ·
[opt-in](screenshots/homepage-2026-09-26/live-take/desktop-optin.webp) ·
[posted](screenshots/homepage-2026-09-26/live-take/desktop-posted.webp) ·
[opt-in dark](screenshots/homepage-2026-09-26/live-take/desktop-dark-optin.webp) ·
[mobile fold](screenshots/homepage-2026-09-26/live-take/mobile-fold.webp) ·
[mobile opt-in](screenshots/homepage-2026-09-26/live-take/mobile-optin.webp) ·
[mobile posted](screenshots/homepage-2026-09-26/live-take/mobile-posted.webp)

### To make it real (after DJ approves)

- Add `POST /api/homepage/answer`: resolve the slug to a question id, validate with the `createCommentSchema`
  rules, run `check_comment_rate_limit` (5 per 60s) and `create_comment_atomic`, map the “once per question”
  trigger to `alreadyAnswered`, and record the give-first `contribution` event with `path: '/'`. The helpers it
  needs (`checkRateLimit`, `assertCommentAccess`, `getQuestion`) are private to
  `src/routes/questions/[slug]/+page.server.ts` today and need extracting.
- After a real post, fetch the visitor’s unlocked answers through the same gate (`can_see_comments_3`) instead of
  the admin path.
- Visitors who already answered question 203 should skip straight to the unlocked state.
- Decide moderation for homepage-originated takes and whether the hero question rotates.
