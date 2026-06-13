<!-- docs/growth/growth-log.md -->

# 9takes Growth Log

Newest updates should go at the top of each section.

Use this file as the persistent memory for growth work across audits, research passes, and experiments.

## Experiment Log

### 2026-06-13 - Weekly growth audit: traffic recovered, RLS errors gone — but the wall itself is uninstrumented

- Area: Activation / retention / give-first instrumentation / signup funnel / email
- Status: audit complete; all three prior bets still unshipped; new instrumentation gap surfaced
- Observed numbers (week of 2026-06-08 vs prior weeks):

| Cohort wk  | New visitors | Signups | New profiles | Comments | D1 return (abs) | D7 return (abs) |
| ---------- | -----------: | ------: | -----------: | -------: | --------------: | --------------: |
| 2026-06-08 |        3,267 |       0 |            1 |        0 |               7 |               0 |
| 2026-06-01 |        2,964 |       0 |            2 |        0 |               9 |               2 |
| 2026-05-25 |        3,822 |       0 |            3 |        2 |              11 |               2 |
| 2026-05-18 |        3,317 |       0 |            1 |        0 |               2 |               1 |
| 2026-05-11 |        2,903 |       0 |            0 |        1 |               8 |               1 |
| 2026-05-04 |        3,001 |       0 |            1 |        0 |              13 |               6 |
| 2026-04-27 |        3,258 |       0 |            0 |        2 |              12 |               1 |
| 2026-04-20 |        4,175 |       0 |            2 |        0 |              14 |               3 |

- D1 rate (2026-06-08 cohort): 7 / 3,267 = **0.21%** (vs 0.30% prior). D7 not yet mature for this cohort (0 so far; last mature week 2026-06-01 = 2/2,964 = 0.07%). Both remain effectively zero against Chen's 30% D7 / 15% D30 reference.
- Signups: **still zero rows. Latest signup in DB is 2023-12-24; total 36 rows, none added.** Zero signup RLS errors this week AND zero last week — the error stream is fully clean now (last RLS error was 2026-06-01 week). Fix appears stable, but **still no confirmed capture from production.**
- Email sends (last 8w): 40 sent, 12 opened (30.0%), 1 clicked (2.5%). Open rate ticked up from 27.5%; click rate unchanged at the floor.
- Welcome sequence enrollments (8w): 10 — matches new profile count. Enrollment gate working.
- Coaching waitlist: 0 adds in last 8w; 1 add in last 16w. No change.
- Comments: 0 this week; 5 total in last 8w. No change.
- Top errors this week: 81 unlabeled (blank message), 34 `case not found`, 20 statement timeouts. Zero signup RLS errors.

- Direction changes vs 2026-06-12 audit:
  - **Visitor volume recovered: 2,794 → 3,315 (+18.6%).** The 3-week decline reversed; back near the trailing-8-week mean. Traffic is not the problem.
  - **Signup RLS errors: 0 → 0 (second clean week).** Green flag holds, but unconfirmed by an actual insert.
  - **Email open rate: 27.5% → 30.0%.** Marginal up. Click rate flat at 2.5% (1 click).
  - **D1/D7: flat single digits.** No movement.
  - **Contributions: zero, third consecutive week.** The loop produces nothing from inbound traffic.

- NEW finding this audit — **the give-first wall is not instrumented.** `content_access_events` has logged 13,684 rows ever, and `request_kind` is **`page` for 100% of them** — there is not a single `protected` row. The agent spec's signature diagnostic (wall-hit → first-contribution conversion, time-to-first-contribution, empty-state risk) is **currently unmeasurable** because the protected-comment moment never writes an event. We are flying blind on the single highest-leverage surface. 13,157 anonymous-human page views hit the wall surface in 8 weeks; we cannot tell how many reached the contribution gate, saw it, or bounced off it.

- Biggest leak this week: **The give-first wall — the one mechanic that should convert lurkers to contributors — emits zero telemetry, so we cannot diagnose or fix the activation failure that is keeping contributions at zero.** Three straight weeks of zero contributions against ~3,000 weekly visitors is the symptom; the uninstrumented wall is why it stays unsolved. This now ranks above the signup-capture leak because the signup fix is plausibly working and merely unconfirmed, whereas the wall instrumentation gap blocks every activation experiment we would design.

- Recommended bets (re-ranked):
  1. **Instrument the give-first wall before running any activation experiment.** Emit a `content_access_events` row (or equivalent) with `request_kind = 'protected'` every time an anonymous user reaches the contribution gate, plus an event on first-comment submit, keyed to the same fingerprint. This is the prerequisite for measuring wall-hit → contribution conversion and time-to-first-contribution. Success = within 7 days, a queryable funnel from gate-shown → comment-submitted exists for at least one fingerprint. This is infrastructure, not an experiment — it unblocks bets 2 and 3.
  2. **Confirm the signup RLS fix with a real production insert.** Two clean error-weeks is necessary but not sufficient. Trigger the live `/api/signups` path from production (or check Vercel function logs for POST attempts) and confirm one row lands with `created_at > 2026-06-11`. Success = ≥1 new `signups` row. If none appears within 7 days, the CTA is simply never being clicked — which redirects the fix toward CTA placement/copy, not RLS.
  3. **Ship Experiment A (email pad at first anonymous comment) — now measurable once bet 1 lands.** Offer: "notify me when other types respond." We believe an optional email field below the first-comment textarea captures ≥10% email-to-commenter rate because it is value-matched to the exact action just taken. Success = ≥1 email per 10 anonymous first comments over 30 days; guardrail = first-comment completion does not fall below 1%. The welcome-email-#1 single-question swap (prior bet 3) stays queued behind this.

- Observed / inferred / unverified:
  - Observed: visitor recovery; two clean RLS-error weeks; `request_kind` is `page`-only across all 13,684 rows; zero contributions for 3 weeks.
  - Inferred: the wall renders and is hit (13k page-surface events) but the protected-gate moment writes no event, so we cannot see the drop-off.
  - Unverified: whether any production user has POSTed to `/api/signups` since the fix; whether the deployed build runs the admin-client insert path.

- Repro SQL used this audit:
  - Visitors / cohort returns: first-touch CTE on `page_analytics_visits.fingerprint`, D1 = visit in [first+1d, first+2d), D7 = [first+7d, first+8d).
  - Signups: `SELECT max(created_at), count(*) FROM signups;` → 2023-12-24, 36 rows.
  - RLS errors: `app_error_events WHERE error_message ILIKE '%signup%' OR ILIKE '%row-level security%'` grouped by week.
  - Wall instrumentation gap: `SELECT request_kind, count(*) FROM content_access_events GROUP BY 1;` → only `page`.
  - Email: `SELECT count(*), count(*) FILTER(WHERE open_count>0), count(*) FILTER(WHERE click_count>0) FROM email_sends WHERE created_at >= now() - interval '8 weeks';`

### 2026-06-12 - Weekly growth audit: signup RLS fix effective; visitor volume dips; retention still near-zero

- Area: Activation / retention / email / signup funnel
- Status: audit complete; Experiment A and welcome-sequence bet remain unshipped
- Observed numbers (week of 2026-06-08 vs prior weeks):

| Week       | Visitors | Signups | New profiles | Q-comments | D1 return (abs) | D7 return (abs) |
| ---------- | -------: | ------: | -----------: | ---------: | --------------: | --------------: |
| 2026-06-08 |    2,794 |       0 |            1 |          0 |               8 |               2 |
| 2026-06-01 |    2,958 |       0 |            2 |          0 |               9 |               2 |
| 2026-05-25 |    3,819 |       0 |            3 |          2 |               8 |               1 |
| 2026-05-18 |    3,310 |       0 |            1 |          0 |               2 |               1 |
| 2026-05-11 |    2,899 |       0 |            0 |          1 |               9 |               4 |
| 2026-05-04 |    2,986 |       0 |            1 |          0 |              13 |               1 |
| 2026-04-27 |    3,242 |       0 |            0 |          2 |               9 |               1 |
| 2026-04-20 |    4,131 |       0 |            2 |          0 |               9 |               5 |

- D1 rate (2026-06-08 week): 8 / 2,794 = **0.29%** (down from 0.71% in 2026-06-01 week — but D1 denominator is all visitors, not just first-touch, so noisy)
- D7 rate (2026-06-08 week): 2 / 2,794 = **0.07%** — effectively zero; well below the 15% D30 floor Andrew Chen cites for consumer products
- Signups: **still zero rows.** Last signup in DB is 2023-12-24. Current week has 0 signup RLS errors (down from 3 last week and 4 the week before). The fix was logged as shipped on 2026-06-11 but the production deploy has not yet generated a single captured email. Status: **fix shipped, no conversion confirmed yet.**
- Email sends (last 8 weeks): 40 sent, 11 opened (27.5%), 1 clicked (2.5%). No change from prior audit.
- Coaching waitlist: zero adds in last 8 weeks. No change.
- Question comments: zero in the current week; 5 total in the last 8 weeks. No change.
- Welcome sequence enrollments match new profile count exactly (1 this week, 10 total last 8 weeks) — confirming the enrollment gate is working.
- Top errors this week: 167 unlabeled errors, 78 `case not found`, 41 statement timeouts. Zero signup RLS errors.

- Direction changes vs prior audit (2026-06-11):
  - **Signup RLS errors: 3 last week → 0 this week.** Tentative green flag on the fix. Needs a successful insert to confirm.
  - **Visitor volume: 2,794 this week vs 2,958 last week.** Down 5.6%. Two-week decline from a 3,819 peak on 2026-05-25. Not alarming at this scale but worth watching; traffic is SEO-driven so a dip here is a content or indexing signal, not a loop signal.
  - **D1/D7 absolute returns: flat at single digits.** No improvement.
  - **Contribution rate: zero for two consecutive weeks.** The product is not generating question comments from inbound traffic at any meaningful rate.

- Biggest leak this week: **The RLS fix may be shipped in code but there is no confirmed email capture from production yet.** 2,794 visitors arrived this week; zero signed up. Until one signup row lands post-fix, the repair is theoretical. The second-biggest leak is unchanged: 2,794 visitors, effectively zero contributions, zero retention compound.

- Recommended bets (same three, re-ranked by urgency):
  1. **Confirm the signup RLS fix is live in production.** Verify the admin Supabase client path is actually executing in the deployed Vercel build, not just in local dev. Check Vercel function logs for `/api/signups` POST attempts. If no signups appear within 7 days of deploy, something else is blocking the insert. Success = at least 1 row in `signups` with `created_at` > 2026-06-11.
  2. **Ship Experiment A (email pad at first anonymous comment).** All blockers are cleared: identity Phase 0 is shipped, sidebar wiring is shipped, RLS fix is shipped. The experiment itself has not been built. Every week without it is another 2,000+ visitors who could have left an email but didn't. We believe adding an optional email field below the first-comment textarea for anonymous contributors will capture >=10% email-to-commenter rate because the offer (notify me when other types respond) is value-matched to exactly what the user just did. Success = >=1 email captured per 10 anonymous first comments over 30 days; guardrail = first-comment completion rate does not drop below 1%.
  3. **Replace welcome email #1 link with one hand-picked low-volume question.** 27.5% open rate on the welcome sequence is real signal. 2.5% click rate is the leak. Current email links to broad discovery; it should link to a single question with 5+ existing answers across multiple enneagram types so the new user lands in a room that isn't empty. We believe this will lift click rate from 2.5% to >=10% and produce at least one first contribution per 20 new profiles. Success = email #1 click rate >=10% and first-contribution rate >=5% over 30 days.

- Observed / inferred / unverified:
  - Observed: zero signup rows post-fix; zero RLS errors this week.
  - Observed: visitor volume dipping over last 3 weeks.
  - Inferred: the fix is deployed but either hasn't been triggered yet (low CTA click rate) or has a secondary failure.
  - Unverified: whether Vercel production is running the updated admin-client insert path or a cached prior version.

- Repro SQL used this audit:
  - Visitors: `SELECT date_trunc('week', first_visit_at)::date, count(DISTINCT fingerprint) FROM visitor_first_touch WHERE first_visit_at >= date_trunc('week', now()) - interval '7 weeks' GROUP BY 1 ORDER BY 1 DESC;`
  - Signup RLS errors by week: `SELECT date_trunc('week', created_at)::date, count(*) FROM app_error_events WHERE error_message ILIKE '%row-level security%signups%' GROUP BY 1 ORDER BY 1 DESC;`
  - D1: join `page_analytics_visits` to `visitor_first_touch` on fingerprint, filter `started_at` between `first_visit_at + 1 day` and `first_visit_at + 2 days`.
  - Email sends: `SELECT count(*), count(*) FILTER (WHERE open_count > 0), count(*) FILTER (WHERE click_count > 0) FROM email_sends WHERE created_at >= date_trunc('week', now()) - interval '7 weeks';`

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

### 2026-06-11 - Weekly growth audit: capture is broken before retention can compound

- Area: Activation / retention / content-to-signup / email / coaching
- Status: audit complete; signup RLS fix implemented; experiments queued
- Observed numbers:

| Week       | First-touch visitors | Signups | Profiles | Question comments |        D1 retained |       D7 retained |
| ---------- | -------------------: | ------: | -------: | ----------------: | -----------------: | ----------------: |
| 2026-06-08 |                2,141 |       0 |        1 |                 0 | 11 / 2,040 (0.54%) |        not mature |
| 2026-06-01 |                2,958 |       0 |        2 |                 0 | 21 / 2,973 (0.71%) | 0 / 1,658 (0.00%) |
| 2026-05-25 |                3,819 |       0 |        3 |                 2 | 17 / 3,816 (0.45%) | 1 / 3,816 (0.03%) |
| 2026-05-18 |                3,310 |       0 |        1 |                 0 | 10 / 3,328 (0.30%) | 1 / 3,328 (0.03%) |
| 2026-05-11 |                2,899 |       0 |        0 |                 1 |  9 / 2,912 (0.31%) | 5 / 2,912 (0.17%) |
| 2026-05-04 |                2,986 |       0 |        1 |                 0 | 24 / 2,988 (0.80%) | 6 / 2,988 (0.20%) |
| 2026-04-27 |                3,242 |       0 |        0 |                 2 | 22 / 3,218 (0.68%) | 1 / 3,218 (0.03%) |
| 2026-04-20 |                4,131 |       0 |        2 |                 0 | 13 / 4,143 (0.31%) | 0 / 4,143 (0.00%) |

- Evidence:
  - `signups` has **zero rows in the last 8 weeks** and no rows after 2023-12-24, despite current blog CTA components posting to `/api/signups`.
  - `app_error_events` has **8 recent "Failed to insert signup" errors**. Sanitized production error: `new row violates row-level security policy for table "signups"`.
  - Current endpoint uses `locals.supabase` to insert into `signups`; production RLS only allows `email = auth.email()` or admin inserts, so anonymous public email capture fails. Code evidence: `src/routes/api/signups/+server.ts:49-63`.
  - Signup CTAs are shipped: `Email-Signup.svelte` posts to `/api/signups`; `EnneagramCTASidebar.svelte` also posts to `/api/signups`; blog routes now render the sidebar and footer signup. Current code contradicts the earlier "sidebar imported by zero files" note.
  - Question activation is weak: 466 eligible first question views in the last 8 weeks produced 5 first comments within 24h or 7d: **1.07% view-to-comment**.
  - Contributor retention is absent: 5 new contributors in the last 8 weeks, **0 returned with a second contribution inside 7 days**.
  - Welcome sequence is live and enrolling: 22 total enrollments, 19 completed, 3 active; all 10 new profiles in the last 8 weeks have an enrollment. Last-8-week sends: 39; opens: 10 (25.6%); clicks: 1 (2.6%). Direct profile D1/D7 return query found 0 returns among those 10 profiles.
  - Coaching loop is not currently compounding: 0 coaching waitlist adds in the last 8 weeks; 1 add in the last 16 weeks. `/book-session` measurement is noisy: 37 measured visits in 8 weeks, but 187 page-analytics upsert errors for `/book-session`, mostly `case not found`.
- Action taken:
  - Fixed `/api/signups` to perform the `signups` duplicate lookup and insert through the server admin Supabase client, while keeping first-touch attachment on the existing `SECURITY DEFINER` RPC. Added a focused route test covering anonymous insert, normalized email storage, first-touch attachment, welcome email send, and duplicate suppression.
- Observed / inferred / unverified:
  - Observed: email capture is currently broken at insert time for anonymous users.
  - Observed: measured D1/D7 retention and contribution return are near-zero.
  - Inferred: true visitor denominators are probably understated because 912 of 931 recent app errors are analytics page-view/upsert failures.
  - Unverified: whether CTA copy or placement would convert after the RLS bug is fixed. There is no clean post-fix data yet.
- Recommended bets:
  1. **Verify the public email capture fix before any acquisition work.** We believe the `/api/signups` admin insert path will restore email capture for anonymous content readers because 8 real attempts hit RLS and current CTAs already post to that endpoint. Success = 0 signup RLS errors and at least one successful `signups` row from production within 7 days; measurement window = 14 days; guardrail = no public update/delete exposure and no duplicate emails.
  2. **Ship Experiment A as an always-on activation capture, not an A/B test.** We believe an optional "email me when someone replies / when other types answer" field after the first anonymous question comment will increase reachable activated users because current first commenters are rare and 0 / 5 returned inside 7 days. Success = >=10% email capture among anonymous first commenters and at least one D7 return from captured commenters over the first 30 days; guardrail = first-comment completion rate does not fall below the current 1.07% question-view-to-comment proxy.
  3. **Make welcome email #1 drive one concrete contribution, then measure first contribution within 7 days.** We believe replacing broad education links with one hand-picked low-empty-state question CTA for new profiles will raise first contribution because welcome opens exist (25.6%) but clicks and returns do not. Success = profile first-contribution within 7 days rises from 0 / 10 to >=2 / next 20 profiles; guardrail = unsubscribe/bounce remains 0.
- Repro SQL:
  - Weekly totals: `SELECT date_trunc('week', first_visit_at)::date, count(DISTINCT fingerprint) FROM visitor_first_touch WHERE first_visit_at >= date_trunc('week', now()) - interval '7 weeks' GROUP BY 1;`
  - Signup error check: `SELECT error_message, count(*) FROM app_error_events WHERE created_at >= date_trunc('week', now()) - interval '7 weeks' AND message = 'Failed to insert signup' GROUP BY 1;`
  - Question activation proxy: join `page_analytics_visits.path = '/questions/' || questions.url` to first `comments` by `fingerprint,parent_id`, then count comments within 24h/7d of first question view.

### 2026-06-11 - Funnel-bug re-verification (status check, no code changes)

- Area: Activation funnel / measurement infrastructure
- Status: verified against current code
- Evidence: Code re-audit on 2026-06-11 against the three bugs logged in April.
- Result:
  - **Visitor identity split: FIXED** (commit `be23162c`, 2026-04-08). Single canonical `getOrCreateVisitorId()` in `src/lib/analytics/visitorIdentity.ts` sets the `9tfingerprint` cookie; both `+layout.svelte` and `Interact.svelte` use it. The `anon-*` fallback and FingerprintJS split are gone; legacy storage key is cleaned up on first read. Phase 0 of the retention plan is effectively shipped.
  - **Blog footer waitlist copy: FIXED** (same April 8 refactor). Community/how-to/enneagram-corner footers now use current product copy via `Email-Signup.svelte`; no "waitlist" strings remain.
  - **EnneagramCTASidebar: STILL BROKEN.** `src/lib/components/blog/EnneagramCTASidebar.svelte` is fully implemented but imported by zero files since its creation on 2026-04-08. Personality-analysis and enneagram-corner routes render no CTA sidebar.
    - Later 2026-06-11 audit update: superseded. Current code imports and renders `EnneagramCTASidebar` on community, how-to, pop-culture, and enneagram-corner article routes. The remaining email-capture problem is the `/api/signups` RLS insert failure, not missing sidebar wiring.
  - **Experiment A (email capture at first anonymous comment): NOT IMPLEMENTED.** No `comment_email_capture` table, no email field in the comment flow, migration named in the April plan was never created. Identity prerequisite (Phase 0) is now met, so the experiment is unblocked.
- Next step: (1) Wire EnneagramCTASidebar into the blog layouts or delete it and place the CTA differently. (2) Decide go/no-go on Experiment A now that its hard prerequisite shipped. (3) Retention rollups (Phase 1) still pending — welcome-sequence D7 numbers remain understated until then.
  - Later 2026-06-11 audit update: sidebar wiring and retention rollups are now shipped; update the next step to focus on signup RLS, Experiment A, and welcome-sequence contribution measurement.

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
