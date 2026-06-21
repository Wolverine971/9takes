<!-- docs/growth/growth-log.md -->

# 9takes Growth Log

Newest updates should go at the top of each section.

Use this file as the persistent memory for growth work across audits, research passes, and experiments.

## Experiment Log

### 2026-06-20 - STRATEGIC GROWTH REVIEW (deep full-funnel pass, not the weekly audit)

> Distinct from the weekly audit above. This is a deeper structural read of the whole funnel. Builds on, does not replace, today's audit. Every claim labeled observed / inferred / unverified; repro SQL at the bottom.

**One-line verdict:** Traffic is genuinely good and a few content surfaces are genuinely loved — but 9takes has built TWO give-first activation mechanics (the question wall, and the Chorus reveal on person pages) and **neither is wired to the surfaces where the traffic actually is.** ~26,700 unique visitors in 8 weeks produced 9 comments, 6 real signups, 10 profiles. The product converts ~0.03% of its audience to any action. This is not a traffic problem and not a PMF-of-content problem; it is a **conversion-path-doesn't-exist problem** on the pages people actually read.

#### The funnel, in real numbers (observed, last 8 weeks)

| Stage                                      |                        Value | Rate vs visitors |
| ------------------------------------------ | ---------------------------: | ---------------: |
| Unique visitors (fp)                       |                       26,722 |                — |
| Total page visits                          |                       35,349 |                — |
| Real signups (active, not same-day-unsub)  |                            6 |           0.022% |
| New profiles (registered)                  |                           10 |           0.037% |
| Comments / contributions                   | 9 (all on `question` parent) |           0.034% |
| Coaching waitlist adds                     |                            0 |               0% |
| Logged-in users generating ANY visit in 8w |                        **7** |                — |

Consumed-to-contributed is roughly **2,969 : 1**. Healthy UGC communities sit at 99:1. We are ~30x worse than the lurker-heavy floor, and the contributors don't retain.

#### 1. The content-to-signup loop — WHERE IT BREAKS (this is the lever)

- **Traffic concentrates on two surfaces** (observed): person pages `/personality-analysis/[slug]` = **12,924 uniq fp** (avg 21.7s engaged), and `enneagram-corner` blogs = **7,321 uniq fp** (avg **56.3s** engaged, the most engaged surface on the site). Questions pages get only 1,863 fp.
- **Person pages bounce at 97.9%** (15,366 sessions, 15,049 single-page; only 193 deep sessions). enneagram-corner is meaningfully better at 92.0% bounce / 348 deep sessions. (observed, `page_analytics_sessions`)
- **The CTA exists but is buried and/or wrong-fit.** Person pages render `BlogPurpose` ("The fight that started 9takes" → email field → `/api/signups`) and a `NineChorus` give-first reveal, both far down the page (`+page.svelte:158` BlogPurpose, `:627` NineChorus, comments `:667`). With 97.9% one-page sessions at ~22s, almost nobody scrolls to them. (observed code + analytics)
- **The break is mechanical, not motivational:** the reader arrives via Google on a celebrity analysis, reads for ~22s near the top, and leaves before ever seeing a reason to act. The signup capture and the give-first reveal are both real and both below the fold. (inferred from scroll avg = 6% on person pages + component line positions)
- **enneagram-corner is the under-exploited goldmine:** highest engagement, lowest bounce, 2.5% any-return — yet it funnels to a sidebar CTA and book-session, not to the give-first loop. (observed)

#### 2. What's actually WORKING (double down here)

- **enneagram-corner content is the bright spot** (observed). `/enneagram-corner/enneagram-and-mental-illness` (390 fp, **69s** avg), `enneagram-compatibility-matrix` (293 fp, 54s), `enneagram-and-adhd` (259 fp, 71s), `enneagram-type-4` (172 fp, **98s**), `neurodivergence-guide` (191 fp, 92s). These are long-dwell, high-scroll pages — people genuinely read them. This is the surface with real attention to convert.
- **Specific person pages punch above weight** (observed, min 30 fp): `alex-karp` (127 fp, 86s), `marilyn-monroe` (88 fp), `meghan-markle` (78 fp), `lex-fridman` (76 fp), `jordi-hays` (75 fp, 88s), `robert-greene` (66 fp, 87s), `brad-pitt` (66 fp), `tina-fey` (59 fp, 92s). Mix of evergreen + tech/creator niche. The tech/VC cluster (alex-karp, jordi-hays, robert-greene, lex-fridman, kara-swisher) over-indexes on dwell time — a high-intent audience worth a tailored CTA.
- **SEO is the engine and it's healthy** (observed): 27,829 internal-referrer visits + 4,477 Google + 1,440 DuckDuckGo + 652 Bing. Effectively 100% organic search/direct. Notable: **claude.ai (30) + gemini.google.com (14) referrals** — AI engines are starting to cite 9takes. Worth tracking as an emerging GEO channel.
- **enneagram-corner retention is the only non-trivial curve** (observed): 2.50% any-return / 0.73% D1 — ~3-6x better than person-pages (0.42% / 0.12%) and questions (0.19% / 0.00%). Still far below benchmark, but it's the only surface showing a pulse.

#### 3. The give-first wall as an activation engine — IT'S NOT FIRING

- **Two separate mechanics exist, neither is on the traffic:**
  - The classic **question wall** (`/questions/[slug]/+page.server.ts:135`) emits `gate_shown`. But only **25 distinct fps** ever hit it across **1,673 question-detail visitors** (8w) — the gate fires only when a `9tfingerprint` cookie is present at SSR and the user hasn't answered. Most inbound visitors never reach a question page at all (1.06 pages/session, 98.4% bounce on questions entry). (observed)
  - The **Chorus reveal** (`NineChorus.svelte` → `/api/nine/mirror` → `nine_user_takes` + `create_comment_atomic`) is mounted on **every person page** (the 12,924-fp surface) — and has been triggered **exactly ONCE in 8 weeks** (`nine_user_takes`: 1 row, ever). It is also **uninstrumented in `give_first_funnel_events`** (only `gate_shown` from the question wall is captured there). (observed)
- **Net:** the single highest-leverage mechanic the product owns — give-first reveal — sits on its highest-traffic page and converts ~1 in 13,000. The reveal is below the fold, requires a scroll + a typed answer before any payoff, and competes with a 22-second attention budget. (inferred)
- **Empty-state is NOT the primary blocker on top pages** (observed): 88.5% of all 418 questions have zero comments, BUT the high-traffic questions people actually land on are seeded (kid-in-3-words 34, voting 32, biggest-fear 17). The empty-room problem is a long-tail issue, not what's killing the loop today.

#### 4. Retention reality (observed, fingerprint-stitched, 12w cohorts)

| Entry surface        | Cohort | D1 % | Any-return % |
| -------------------- | -----: | ---: | -----------: |
| enneagram-corner     |  9,883 | 0.73 |     **2.50** |
| homepage             |  1,306 | 0.46 |         1.45 |
| personality-analysis | 21,220 | 0.12 |         0.42 |
| questions            |  1,586 | 0.00 |         0.19 |

D1/D7/D30 are effectively zero everywhere vs Chen's 30% D7 reference. **enneagram-corner is the only surface with a detectable return signal.** Only 7 logged-in users produced any visit in 8 weeks — there is essentially no logged-in product being used. Retention can't be "fixed" before activation exists; right now there is nothing to retain into.

#### 5. Email as a growth channel

- **The 81 sends were one broadcast** ("You are in for 9takes updates") sent to the `signups` source — and **75 of the 81 recipients were the same-day-unsub bot signups** (matched_signups=81, matched_unsubbed=75). So the 30.9% open / 16% click is **poisoned by bot opens**; treat it as non-signal. The 6 real recipients are the only meaningful data. (observed cross-join)
- **Welcome sequence barely runs:** 23 enrollments ever, 11 in 8w — gated to new profiles, of which there were 10. It works but has almost no fuel. (observed)
- **Real addressable list is tiny:** 42 active signup emails + 146 profiles, 111 ever emailed. There IS a small real list (the profile-targeted sends — "If 9takes isn't useful in these 3 moments" etc. — went to 6-13 real profiles with 2 opens). Re-engagement upside is real but capped by list size; the constraint is top-of-funnel capture, not email tactics. (observed)

#### 6. HIGHEST-LEVERAGE MOVES (ranked, opinionated)

**Quick wins — ship this week:**

1. **Put an above-the-fold give-first hook on person pages + enneagram-corner.** The Chorus reveal and signup CTA are below a 22-second attention cliff. Move a single high-intent action above the fold: either the Chorus "answer first → see the nine takes" prompt, OR a one-field email capture matched to the page ("Get the next personality teardown"). Person pages are 13k fp/8w; even a 2% above-fold conversion = ~260 actions/8w vs today's ~1.
   - _Mechanism:_ eliminate the scroll-depth tax that hides the only conversion path. _Success:_ ≥1% of person-page sessions trigger Chorus OR submit email within 30 days (vs ~0.01% today). _Guardrail:_ bounce rate doesn't worsen by >3pts.
2. **Instrument the Chorus reveal end-to-end.** It writes to `nine_user_takes` and creates a comment but emits nothing to `give_first_funnel_events`. Add `reveal_shown` (on mount/scroll-into-view) and `contribution` (on submit) keyed to fingerprint, on BOTH the question wall and the Chorus. Without this we cannot tell if move #1 worked.
   - _Mechanism:_ close the measurement loop on the actual activation surface. _Success:_ a native shown→contributed funnel exists for the person-page Chorus within 7 days.
3. **Stop emailing the bot list; re-send the broadcast to the 6 real + 146 profiles only.** The 81-send metrics are garbage and the deliverability risk is real. Segment to verified humans before the next send.

**Structural bets — 30/60/90 days:**

4. **(30-60d) Make enneagram-corner the activation funnel, not a dead-end.** It's the most-read, best-retained surface and it currently funnels to a passive sidebar. Embed a give-first micro-action inline (mid-article): "Before you read the answer — what's YOUR take?" tied to a real question, with the reveal as payoff. This marries the proven-attention surface to the proven-mechanic.
   - _Mechanism:_ convert dwell time (56s avg) into a contribution at the moment of peak engagement. _Success:_ enneagram-corner → contribution rate ≥0.5% (vs ~0% today); secondary: lift any-return above 2.5%.
5. **(60-90d) Build a logged-in reason to return — the missing retention surface.** Only 7 logged-in users active in 8w means there is no product to retain into. The return loop ("someone replied to your take" / "a new type answered your question") requires (a) contributions to exist (moves 1+4) and (b) a notification+digest. Sequence this AFTER activation is non-zero; building retention machinery now would be optimizing an empty room.
   - _Mechanism:_ create the reply→notification→return cycle that should compound. _Success:_ contributor 7-day return >10% once contribution volume is non-trivial.

**Explicitly NOT recommended now:** paid acquisition (loop is unreadable/unconverting — would be a leaky bucket), and any A/B test on the questions surface (1,863 fp/8w is too low-traffic; MDE would exceed 20%). Fix the person-page + enneagram-corner conversion path on the traffic we already have first.

#### Observed / inferred / unverified

- **Observed:** all traffic/engagement/bounce/retention numbers; CTA + NineChorus + BlogComments component placement in code; `nine_user_takes` = 1 row ever; 81 sends = 1 broadcast to a list that was 75/81 bot signups; gate_shown only 25 fp; comments all `question` parent_type; enneagram-corner is highest-engagement + best-retained.
- **Inferred:** the break is below-the-fold placement against a ~22s attention budget (from scroll avg 6% + component line positions); the tech/VC person-page cluster is a high-intent niche; the Chorus's "type before payoff" friction suppresses use.
- **Unverified:** whether moving the hook above the fold actually lifts conversion (needs the experiment); whether `/api/nine/mirror` errors silently (1 take in 8w could be a bug, not just disuse — worth a manual smoke test); whether AI-engine referrals (claude.ai/gemini) are a growing trend or noise.

#### Repro SQL (key queries)

- Sections/engagement: `SELECT <section CASE>, count(*), count(DISTINCT fingerprint), avg(engaged_ms), avg(max_scroll_pct) FROM page_analytics_visits WHERE started_at >= now()-interval '8 weeks' GROUP BY 1;`
- Bounce by entry: `SELECT <entry CASE>, count(*), avg(page_count), count(*) FILTER(WHERE page_count=1), count(*) FILTER(WHERE page_count>=3) FROM page_analytics_sessions WHERE started_at>=now()-interval '8 weeks' GROUP BY 1;`
- Retention: first-touch CTE on `page_analytics_visits.fingerprint`, D1=[first+1d,+2d), D7=[+7d,+8d), any-return=visit after first+1d, segmented by entry_path.
- Chorus usage: `SELECT count(*), min(created_at), max(created_at) FROM nine_user_takes;` → 1 row, 2026-06-15.
- Email broadcast: `SELECT subject, recipient_source, count(*), ... FROM email_sends WHERE created_at>=now()-interval '2 weeks' GROUP BY 1,2;` + cross-join recipient_email to signups/profiles → 75/81 matched unsubbed bots.
- Empty-state: `LEFT JOIN comments c ON c.parent_id=q.id AND c.parent_type='question' AND c.removed IS NOT TRUE` → 370/418 empty, but top-traffic questions seeded.
- Logged-in: `count(*) FILTER (WHERE user_id IS NOT NULL), count(DISTINCT user_id) FROM page_analytics_visits` → 503 visits / 7 users.

### 2026-06-20 - Weekly growth audit: signups + comments + email all came alive — but the signup spike is spam and the wall's submit side is still blind

- Area: Activation / give-first instrumentation / signup funnel / email / spam exposure
- Status: audit complete. Three dormant surfaces moved this week. One is a real win, one is poisoned, one is now half-instrumented.
- Observed numbers (week of 2026-06-15 vs prior weeks):

| Cohort wk  | New visitors | Signups | New profiles | Comments | gate_shown (fps) | D1 (abs) | D7 (abs) |
| ---------- | -----------: | ------: | -----------: | -------: | ---------------: | -------: | -------: |
| 2026-06-15 |        2,746 |  **79** |            0 |    **4** |          46 (22) |       11 |      0\* |
| 2026-06-08 |        3,788 |       2 |            1 |        0 |            7 (3) |       11 |        2 |
| 2026-06-01 |        2,959 |       0 |            2 |        0 |                — |        8 |        2 |
| 2026-05-25 |        3,820 |       0 |            3 |        2 |                — |       10 |        2 |
| 2026-05-18 |        3,311 |       0 |            1 |        0 |                — |        2 |        1 |
| 2026-05-11 |        2,899 |       0 |            0 |        1 |                — |        7 |        1 |

\*D7 immature for the 2026-06-15 cohort.

- Direction changes vs 2026-06-13 audit:
  - **Signups: 0 → 79 this week (81 total since the 2026-06-11 fix; table grew 36 → 117).** The RLS fix is CONFIRMED live and capturing — the prior three audits' "fix shipped, no conversion confirmed" question is now answered: it works.
  - **Comments: 0 → 4, breaking a 3-week zero streak.** All 4 are anonymous (`author_id IS NULL`), from 3 distinct fingerprints.
  - **Email sends: 10 → 81/week (8w total 40 → 123).** Opens 25/81 (30.9%), clicks 13/81 (16.0%) this week — click rate up sharply from the 2.5% floor. Likely a campaign/broadcast send, not just welcome drip (welcome enrollments still only 11/8w).
  - **Visitors: 3,788 → 2,746.** Down, but the 2026-06-08 figure was an outlier high; 2,746 is near the trailing mean. Traffic is not the story.
  - **give-first wall: now emitting telemetry.** `give_first_funnel_events` has 53 `gate_shown` rows (46 this week, 22 distinct fps). Prior audit's "wall is uninstrumented" gap is partially closed.

- **Biggest leak this week: the 79-signup spike is almost entirely spam, and `/api/signups` still has no recaptcha.** Of 81 new signups, **only 6 are active — 75 unsubscribed the same day they signed up.** Domains are junk (`untyiowa.gov`, `uppfiore.com`, dotted/garbled gmail/yahoo locals). This is bot-stuffing of an unprotected public POST (the known no-recaptcha exposure from the signups-endpoint memory note, now being exploited). Net real capture is ~6 emails, not 79. Left unaddressed this pollutes every downstream email metric and burns sender reputation.

- **First readable wall signal (caveat-heavy):** All 3 commenter fingerprints this week hit `gate_shown` before commenting. So this week: 22 gated fingerprints → 3 contributed ≈ **13.6% wall-hit → contribution** (rough; submit side is still uninstrumented so this is inferred by fingerprint join, not a logged funnel). First non-zero contribution signal in a month, and it routes through the give-first gate as designed.

- **Still-open instrumentation gap:** `give_first_funnel_events` has only ONE event type — `gate_shown`. There is still no `contribution`/`comment_submitted` event. We can see the gate appear and we can join to `comments` by fingerprint, but we cannot measure time-to-first-contribution or in-funnel drop-off natively. `content_access_events.request_kind` is still 100% `page` (15,670 rows).

- Recommended bets (re-ranked):
  1. **Add bot protection to `/api/signups` immediately (recaptcha/honeypot/rate-limit by IP+fingerprint).** This is now an active exploit, not a theoretical gap. We believe gating the endpoint will drop spam signups from ~93% to near zero, restoring signal to the signups table and protecting email deliverability. Success = next week's new-signup same-day-unsub rate < 10% (vs 93% this week); guardrail = legitimate signups (the 6 real ones/wk baseline) do not fall to zero. This is infra, ranks first because it corrupts everything below it.
     - **RESOLVED 2026-06-20 (shipped 2026-06-19, commit cd7dd460).** `/api/signups` is now layered-hardened in `+server.ts` + `src/lib/server/newsletterSignupProtection.ts`: honeypot (`form_extra`), 2.5s time-trap, suspicious-UA block (curl/wget/python-requests/axios/headless/selenium/puppeteer/playwright/etc.), malformed-local blocking (catches the `..`/dotted-gmail junk locals), dedup, plus DB-backed sliding-window rate limits (3/hr per IP, 2/hr per email) with an `auth_security_events` cross-check, and full outcome logging to `newsletter_signup_security_events` (spec-covered). No CAPTCHA by design — layered heuristics + per-IP/per-email caps chosen for lower friction. The Jun 15 spam predates the fix; **next week's same-day-unsub rate is the real test** — verify <10% and spot-check `newsletter_signup_security_events` for caught-bot volume.
  2. **Emit the submit-side give-first event.** Add a `contribution` (or `comment_submitted`) row to `give_first_funnel_events` on first anonymous comment, keyed to the same fingerprint as `gate_shown`. We now have the gate-shown half live; one more event closes the funnel and makes wall-hit → contribution and time-to-first-contribution natively queryable instead of fingerprint-stitched. Success = within 7 days, a native gate_shown → contribution funnel exists for ≥1 fingerprint.
  3. **Diagnose the email send before trusting the 16% click lift.** 81 sends with 13 clicks is real movement, but confirm what it was (broadcast vs welcome) and whether recipients overlap the spam signups. If the spike is sending TO scraped/spam addresses, the deliverability risk compounds bet 1. Success = a one-line attribution of the 81 sends (sequence/campaign + audience source). Then decide whether Experiment A (email pad at first anonymous comment) still leads, given organic-comment volume is now non-zero.

- Observed / inferred / unverified:
  - Observed: 79 signups this week, 75 same-day unsubs, junk domains; 4 anonymous comments from 3 fps; 46 gate_shown events (22 fps); email 81 sent / 25 open / 13 click.
  - Inferred: signup spike is bot spam exploiting the no-recaptcha endpoint; ~13.6% wall→contribution (fingerprint-joined, not natively logged).
  - Unverified: what the 81 email sends were (campaign vs drip) and whether they targeted the spam cohort; whether any of the 6 real signups convert to a profile or comment.

- Repro SQL used this audit:
  - Visitors: first-touch CTE on `page_analytics_visits.fingerprint`, `date_trunc('week', min(started_at))`.
  - Signups by week + spam: `SELECT date_trunc('week',created_at), count(*) FROM signups ...`; `count(*) FILTER (WHERE unsubscribed_date IS NULL)` → 6 active / 75 unsubbed of 81 since 2026-06-11.
  - Give-first: `SELECT event_type, date_trunc('week',created_at), count(*), count(DISTINCT fingerprint) FROM give_first_funnel_events GROUP BY 1,2;` → only `gate_shown`.
  - Wall→contribution: join `comments.fingerprint` (last 2w) to `give_first_funnel_events.fingerprint` → all 3 commenters hit gate.
  - Email: `SELECT date_trunc('week',created_at), count(*), count(*) FILTER(WHERE open_count>0), count(*) FILTER(WHERE click_count>0) FROM email_sends ...`.

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
