<!-- docs/growth/growth-log.md -->

# 9takes Growth Log

Newest updates should go at the top of each section.

Use this file as the persistent memory for growth work across audits, research passes, and experiments.

## Research Tidbits

### 2026-04-08 - Casey Winters on loops vs funnels and "give-first" rules

- Source: Casey Accidental / First Round Review (former growth lead at Pinterest, Grubhub, advising Reddit and Eventbrite)
- Link: https://review.firstround.com/pinterest-and-grubhubs-former-growth-lead-on-building-content-loops/
- Tidbit: Winters frames "give-first" as a pricing/access decision: if a thing drives **virality**, give it away forever; if it drives **activation**, give it away until activated, then charge; if it drives **retention**, compare willingness-to-pay before deciding. He treats retention as **the** growth metric — "acquisition without retention is waste." He also distinguishes funnels (one-shot) from loops (compounding) and is famous for arguing content loops are the most under-invested growth channel.
- Why it matters for 9takes: 9takes literally calls its core mechanic "give-first" but treats it as a moralized identity statement rather than as Winters does — a deliberate access tradeoff. The current implementation gives the **comments** away (post-contribution) but never charges for or asks for anything in exchange for the very high-intent moment of activation. The Experiment A email-pad plan is exactly the Winters move: keep the give-first wall, but use the activation moment to ask for the lowest-friction commitment (an email) before the user vanishes. Also reinforces the agent spec mandate that retention/activation must come before more acquisition.

### 2026-04-08 - Average pop-up email capture is 3 percent; well-designed offers can hit 40 percent

- Source: Industry CRO summaries (Klipfolio, Anyleads, Invesp)
- Links: https://www.klipfolio.com/resources/kpi-examples/digital-marketing/newsletter-signup-conversion-rate · https://anyleads.com/email-conversion-rate
- Tidbit: Generic email pop-ups average around a 3 percent capture rate. Well-designed captures with a clear value-incentive (the offer matches what the user is doing in the moment) cluster in the 10-25 percent range, with the best lead-magnet experiences reported in the 30-40 percent range. "Healthy" baseline benchmarks tend to use 2 percent ECR as the floor.
- Why it matters for 9takes: Experiment A's stated 25 percent target is **ambitious but defensible** because the offer is pixel-perfectly value-matched: "I just answered a question — yes, please tell me when someone else with a different type weighs in." It is not a generic newsletter pop-up, it is a notification subscription tied to the exact thing the user is currently doing. Use 10 percent as the realistic floor and treat 25 percent as the stretch target. Anything above 5 percent is already strictly better than zero.

### 2026-04-08 - Reddit-style anonymous user bases break standard attribution

- Source: Singlegrain "How to Measure Reddit ROI and Attribution in 2025"
- Link: https://www.singlegrain.com/search-everywhere-optimization/how-to-measure-reddit-roi-and-attribution-in-2025/
- Tidbit: "Reddit's anonymous and pseudonymous user base creates fragmented customer journeys ... users often engage through multiple accounts or browse without logging in, making traditional pixel-based tracking insufficient for accurate marketing measurement." Operators in this category have to invest in **first-party identity stitching** (server-side, cookie-based) before any cohort or attribution analysis is meaningful.
- Why it matters for 9takes: 9takes is structurally Reddit-shaped — anonymous-by-default contributions, zero account required to comment once. The retention instrumentation plan already flagged that the visitor identity is split across an `anon-*` fallback in `+layout.svelte` and a FingerprintJS `visitorId` in `Interact.svelte`, meaning the same human can show up under two different IDs. This is _exactly_ the failure mode the Singlegrain piece describes. Phase 0 of the retention plan (one stable `9tfingerprint` cookie everywhere) is non-negotiable infrastructure, not optional polish — every downstream growth metric is contaminated until it ships.

### 2026-04-08 - Setup

- Topic: Growth log initialized
- Source: Internal setup
- Tidbit: The `growth-analyst` agent now has a default place to store sourced growth notes and experiment history.
- Why it matters: This creates continuity across future growth audits instead of scattering ideas across ad hoc docs.
- Link: `.claude/agents/growth-analyst.md`

## Experiment Log

### 2026-04-08 - Audit: full-stack growth audit (activation, retention, content-to-signup, onboarding, give-first, email, instrumentation)

- Area: Cross-cutting
- Status: idea (audit complete; recommendations queued)
- Hypothesis: 9takes' biggest leak is **activation identity loss** — the give-first mechanic captures honest contributions but the contributor walks away without leaving any way to be reached, and the blog-to-question loop is broken at the CTA layer. Three concrete bugs were verified in code:
  1. `EnneagramCTASidebar` is implemented but commented out in `src/routes/+layout.svelte:399-401`, and even when rendered its submit handler logs to console (`src/lib/components/blog/EnneagramCTASidebar.svelte:12-18`). Effective email capture from blog SEO traffic today is **zero**.
  2. The blog post footer `EmailSignup` component on `community/[slug]`, `enneagram-corner/[slug]`, and `how-to-guides/[slug]` ships with stale waitlist copy: "We are making something join the waitlist" (`src/routes/community/[slug]/+page.svelte:102`, `src/routes/how-to-guides/[slug]/+page.svelte:141`). The product is no longer pre-launch — this copy is actively misrepresenting state to inbound SEO traffic.
  3. Visitor identity is split: `+layout.svelte:122-144` falls back to `anon-${uuid()}` in localStorage when FingerprintJS hasn't loaded, while `Interact.svelte:90-103` lazy-loads FingerprintJS for comments. Same human, two IDs, no joinable retention. This is the Phase 0 problem in the retention instrumentation plan.
- Primary metric: N/A (audit only)
- Evidence: Repo grep + read of layout, blog slug routes, Interact.svelte, QuestionContent.svelte, Email-Signup.svelte, EnneagramCTASidebar.svelte, register/+page.server.ts, book-session/+page.server.ts, welcomeSequenceGuards.ts, admin/welcome-sequence load
- Action taken: Drafted top-three recommendations and seven secondary recommendations (see audit memo in agent reply 2026-04-08)
- Result: Audit memo delivered to user
- Next step: User to choose which of the top three to ship this week. Recommended order: (1) fix blog footer CTA copy and route to `/questions` not `/register`, ~30 min; (2) ship Phase 0 of retention instrumentation plan (canonical fingerprint cookie), 0.5–1 day; (3) ship Experiment A email pad on `/questions/[slug]` after Phase 0, 2–3 days.

### 2026-04-08 - Experiment A: capture email at first anonymous contribution

- Area: Activation / identity
- Status: planned (spec drafted, blocked on Phase 0 of retention instrumentation)
- Hypothesis: An optional email field appended below the textarea in `Interact.svelte` for **anonymous first-time** contributors will produce ≥25 percent capture rate and ≥2x D7 return on the captured cohort, without degrading first-comment conversion rate.
- Primary metric: Email capture rate among anonymous first-time contributors in the treatment cohort
- Evidence: `docs/planning/experiment-a-anonymous-email-capture-2026-04-08.md` (full spec). Verified in code: anonymous first comment is allowed at `Interact.svelte:181-195` (`canComment`), routed through `createCommentRando` action at `+page.server.ts:189-213`, and the unlock is governed by `checkUserAnswered` → `can_see_comments_3` RPC at `+page.server.ts:823-835`. The hot path is healthy enough to extend without rewriting.
- Action taken: None yet — spec exists, no migration shipped
- Result: N/A
- Next step: After identity hygiene Phase 0 ships, build the migration `20260408_comment_email_capture.sql` and the email pad UI in `Interact.svelte`. Consider lowering the capture-rate target from 25 percent to a 10 percent floor based on the industry benchmarks tidbit logged today.

### 2026-04-08 - Retention instrumentation plan

- Area: Measurement infrastructure
- Status: planned (Phase 0 not yet shipped)
- Hypothesis: A stable visitor identity + materialized first-touch + materialized daily activity rollups will let `/admin/analytics` answer "is 9takes retaining new users by surface and source?" without ad hoc SQL.
- Primary metric: D1 / D7 / D30 retention by entry surface and acquisition source readable in admin
- Evidence: `docs/planning/retention-instrumentation-plan-2026-04-08.md`. Confirmed identity split in `+layout.svelte` vs `Interact.svelte`. Confirmed admin home (`src/routes/admin/+page.server.ts:44-120`) currently leans on `visitors_last_30_days` and a vague "active users" derived from `comments.author_id`, which excludes anonymous contributors entirely.
- Action taken: Plan drafted, no migrations shipped
- Result: N/A
- Next step: Ship Phase 0 (single canonical fingerprint helper used by both analytics and Interact). It is a hard prerequisite for Experiment A.

### 2026-04-08 - Welcome sequence (4 emails over 10 days)

- Area: Email / onboarding
- Status: running (live for registered users)
- Hypothesis: A tight 4-email sequence (orient → demo value → ask for first contribution → check-in) will activate registered users without exhausting them.
- Primary metric: First-contribution rate within 10 days; D7 return rate
- Evidence: Implementation verified at `src/lib/server/welcomeSequenceGuards.ts`, called from `src/routes/register/+page.server.ts:90-109` after signup. Exit-on-comment wired at `src/routes/questions/[slug]/+page.server.ts:176-184`. Admin view at `src/routes/admin/welcome-sequence/+page.server.ts` already pulls per-step delivered/opened/clicked counts plus enrollment funnel. Strategy doc at `docs/marketing/WELCOME_SEQUENCE_STRATEGY.md`.
- Action taken: Sequence is live and instrumented at the email layer.
- Result: Per-step sends/opens/clicks readable in admin. Cross-cohort retention (D7 for sequence enrollees vs non) is **not** readable yet because retention rollups don't exist. Specifically the existing `/admin/welcome-sequence` view joins to `page_analytics_sessions` by `user_id`, but `page_analytics_sessions.user_id` is only populated for authenticated visits, so any return visit where the user is logged out doesn't count. This understates returns.
- Next step: After retention instrumentation Phase 1 ships, recompute return rate by joining sequence enrollments to `visitor_first_touch.fingerprint` once `attach_profile_first_touch` populates the join key.

### 2026-04-08 - Setup

- Area: Growth ops
- Status: planned
- Hypothesis: A persistent growth log will make it easier to track what 9takes has tried, what happened, and what should happen next.
- Primary metric: Clear experiment history and fewer repeated ideas
- Evidence: Prior growth ideas were spread across planning and marketing docs without a single running log.
- Action taken: Created `docs/growth/growth-log.md` and wired the growth agent to update it.
- Result: Baseline created
- Next step: Use this file for the next growth audit or experiment brief.
