<!-- docs/daily-briefs/2026-08-28_marketing-status.md -->

# 9takes Marketing Status — 2026-08-28

**Manual off-cycle pulse.** The repository wrapper was run first and failed because its embedded Claude process is not authenticated in this context; its Telegram notification also failed. The growth and marketing flows were then completed manually from their command/agent contracts using live production SQL, PostHog, repository state, OpenClaw state, and current logs. Prior brief: `2026-08-24_marketing-status.md` (4 days).

## TL;DR

- **Yes, something changed: activation improved.** Matched Monday-Friday production data moved from 1 -> **4 comments** and 30 -> 1 (**3.3%**) to 26 -> 4 (**15.4%**) gate conversion. PostHog's dedicated question-page funnel moved from 11 -> 0 -> 0 to 7 qualified people -> 4 starts -> **4 completions (57.1%)**. This is real directionally and tiny numerically.
- **The 08-24 audit triggered action the same afternoon.** `fd61b4788` removed contribution-based welcome exits and restored the affected enrollment, made the reveal type choice durable, fixed the false `9takes.com` referrer, and added `caffeinate -i` to the nightly pipeline. Database state confirms dormant reactivation is now `draft` and zombies is `paused`. Four major open items in Monday's brief are closed.
- **The new registration/type path works.** Two real profiles registered this week; **1 of 2 supplied Type 9**. Both canonical `registration_completed` events reached PostHog. The reveal-side persistence remains unexercised because no strategic-blog contributor reached it after the change.
- **The leak moved one stage later: relationship formation is still zero.** All 4 first-time contributors saw the reply opt-in; **0 focused it, 0 submitted, 0 subscribed**. Their four answers received 0 replies, and none returned. The one new registered contributor exited welcome as `unsubscribed`, not via the removed contribution guard. Activation is no longer the first failure; the post-answer promise is.
- **Traffic grew against a weak week, almost entirely as direct/unknown.** PostHog regular-human uniques rose **1,077 -> 1,289 (+19.7%)**, but organic search was flat/down 1.2%, cross-week returners stayed 15 -> 15, and the eight-week series remains below early August. Direct/unknown question-surface people rose **5 -> 24** while organic question people stayed 6 -> 6. This is an unattributed product-traffic spike, not yet a durable channel win.
- **Content supply recovered; distribution did not.** Four clean nightly create runs landed Nate Bargatze, Ryan Holiday, Marcus Aurelius, and Freddie Mercury. Disk published count rose **423 -> 429**. But the auto-publisher has now errored **29 consecutive runs** and today's first eligible selection failed because OpenClaw launched Node 26 against the repo's `<25` engine rule. Instagram remains unscheduled and 21 days dark; its queue is still 0/10 approved. Quora is disabled and ~101 days dark.

## The actual work — the answer now completes; the relationship does not begin

The signal chain moved materially in four days:

| Stage                   | Current evidence                                                           | Change                                    |
| ----------------------- | -------------------------------------------------------------------------- | ----------------------------------------- |
| Acquisition             | 1,289 PostHog regular-human people, +19.7%                                 | Up, but direct/unknown only; organic flat |
| Product exposure        | `/questions` people 10 -> 26; detail people 7 -> 13                        | Strongest current movement                |
| Answer start/completion | Question-page funnel 7 -> 4 -> 4                                           | Early win; n=7                            |
| Identity                | 2 registrations; 1 typed profile                                           | New path exercised                        |
| Reachability            | Reply opt-in shown to 4                                                    | Instrumentation works                     |
| Relationship            | 0 focus / 0 submit / 0 subscriptions / 0 replies                           | **Earliest weak stage**                   |
| Retention               | 15 cross-week returners in both periods; recent contributor return still 0 | No compounding                            |

The post-answer prompt is not failing technically: it rendered for all four people and produced no failure events. It is failing before intent. The next useful work is not more top-of-funnel content or another answer-composer tweak; it is to make staying reachable feel like the natural consequence of having answered.

The strongest acquisition clue is also unresolved. Direct/unknown question traffic rose from 5 to 24 people, producing the four dedicated-page answers, while organic question traffic stayed flat. No UTM identifies the route. The 08-24 attribution fix now correctly classifies absent referrers as direct instead of false self-referral, but it cannot distinguish private sharing, untagged owned links, typed navigation, or referrer stripping. This is a channel opportunity only after a controlled tagged replication.

## Tooling state

- **Weekly wrapper failed today:** both embedded flow legs returned `Not logged in`; no growth/brief artifacts were produced by the wrapper. Telegram delivery also failed. The manual fallback produced both artifacts. Monday's scheduled 08-24 OpenClaw run remains recorded as successful.
- **OpenClaw gateway was unavailable during the scan.** `cron list` could not connect; read-only state inspection shows 10 jobs. There are still no Instagram execution jobs—only reminder `systemEvent`s. Quora warmup is disabled.
- **Publisher is the only cron in sustained error backoff:** `9takes Blog Content Publish People`, **29 consecutive errors**. On 08-25--27 it found no eligible candidate. On 08-28 it selected Ryan Holiday, flipped into the generation path, and failed because Node **26.5.0** violates the repo's `>=22.12.0 <25` rule. `openclaw doctor` independently reports the gateway service PATH is missing `/opt/homebrew/opt/node@24/bin`.
- **Nightly create reliability improved.** The 08-24 host-sleep class is directly fixed by `caffeinate -i`. Four consecutive overnight runs completed: Nate Bargatze 8.6, Ryan Holiday 8.9, Marcus Aurelius 9.0, Freddie Mercury 9.0. Runtime remains long (roughly 2 hours) and there is still no hard wall-clock kill, but the observed sleep failure did not recur.
- **PostHog dashboard is useful but behind current reality.** The [Marketing Operating Dashboard](https://us.posthog.com/project/35460/dashboard/2019041) has five fresh panels, but every saved insight has `filterTestAccounts: false`, its traffic chart sums daily uniques rather than weekly uniques, and it still lacks the now-live `registration_completed`, `email_signup_completed`, and reply-opt-in chain. Independent SQL was used for the verdict.
- **Instrumentation gap:** 3 of 4 current `give_first_funnel_events.contribution` rows have `path IS NULL`. PostHog/comment data can reconstruct the surface, but the in-house funnel cannot.

## Cross-surface status

### Growth and email

- Matched WTD: **3,078 new visitors** (+8.2%), 1 signup, 2 profiles (1 typed), 4 comments, gate 26 -> 4, no waitlist.
- Email volume fell 70 -> 15 matched-WTD because losing reactivation campaigns were stopped: dormant 0 after its status change; zombies paused after 8 Monday sends. Welcome sent 6 with 3 opens. `enneagram_type_prompt` remains `draft`.
- The harmful `answered_question` / `created_comment` exit is removed. One new welcome enrollment is active; one new registered contributor explicitly unsubscribed. No new subscription row was created.
- Full growth evidence and hypotheses: [`docs/growth/growth-log.md`](../growth/growth-log.md).

### Blogs — people

- Disk: **429 published / 91 unpublished** with 7 files lacking a standard boolean flag. The DB corpus snapshot, regenerated today, reports **438 published / 128 in pipeline**; disk and DB use different stages and should not be blended.
- Six disk publishes since Monday morning: Liang Wenfeng, Simone Biles, Frank Lloyd Wright, Jeremy Allen White, Tate McRae, and Ryan Holiday. No publisher log records a clean autonomous success; current movement is manual or repaired after a partial automated attempt.
- Current blocker snapshot (08-27): `missing_perspective_review=83` (86 Monday), `source_standard_failed=46`, `content_quality_below_8.5=35`, `missing_grade_stability_delta=35`, `stale_grade_rubric_v1=27`, images 14/14. Perspective backfill is still not happening; the count falls via publishing and new drafts get the new reviews.
- The create side is healthy enough that supply is not the marketing constraint. The publish runtime and distribution are.

### Instagram / social

- Content-ops queue remains **RED and unchanged since 08-03**: 21 Instagram items, 0 approved/scheduled against a 10-item floor, 11 copy-ready or later against 15, 19 triaged or later against 20, 2 design-ready, 1 published, 1 blocked.
- Sessions remain dark since 08-07 (**21 days**). The performance log still contains only Robert Greene's 8 views / 1 like at 24 hours; the 7-day result and live URL were never added. No native 9takes Reel has been measured.
- There are no Instagram execution crons. The two scheduler reminders do not create, engage, or publish. Live account analytics were unavailable this run, so no fresh reach/follower claim is made.
- Provisional position: the account has inventory but no operating route. This is an execution absence, not evidence that a topic or creative stopped working.

### SEO

- GSC export remains runDate **2026-08-13**, ending 08-11—15 days stale. It cannot answer what changed this week.
- Live PostHog says organic pageviews **841 -> 831 (-1.2%)** and organic unique people **562 -> 554 (-1.4%)**. Google was roughly flat; direct/unknown supplied the lift.
- Fresh corpus generation landed today: **705 sitemap URLs**, 455 personality-analysis URLs, DB corpus 438 published profiles, 31 published in the last 30 days. Content footprint is expanding; measured organic demand is not yet following this week.
- Page winners against the prior calendar window include `/questions` (+26 pageviews), `clavicular` (+25), `enneagram-positive-self-talk` (+23), and `enneagram-types-being-ghosted` (+13). Declines include `jordi-hays` (-28), `attachment-styles-and-enneagram-types` (-25), and `enneagram-and-mental-illness` (-15). Samples are weekly and volatile; do not rewrite pages from one interval.

### Distribution / Quora / outreach / video

- At least 13 prepared distribution asset files remain unfired; the directory has had no operating activity since 07-22.
- Quora warmup cron is disabled and sessions remain absent after 05-19 (~101 days). Twitter has no new session record. Outreach has no new artifact after the 08-04 Nine Mirrors pilot. One Take episode 1 remains unfilmed.
- Pop-culture has **21 unpublished** files, not 18. A check against the 08-24 commit also returns 21, so this is a correction to prior briefs, not a three-draft regression.

## What changed since 2026-08-24

- Closed: contributor-based welcome exits, false self-referral attribution, StrategicQuestion type persistence, host-sleep protection, dormant reactivation, zombie reactivation.
- New positive signal: 4 dedicated question-page completions, 2 registrations, first typed registration, direct question traffic 5 -> 24 people.
- New negative signal: reply-opt-in prompt 4 -> 0 interaction; one new registered contributor unsubscribed; still no replies or returns.
- Create recovered to four clean nights and two 9.0 drafts; disk published count 423 -> 429.
- Publisher found an eligible candidate but exposed the gateway Node-version defect; error streak is now 29.
- Instagram, Quora, outreach, distribution, Reels, and One Take did not move.

## Recommendation

**1. Repair the post-answer relationship moment.** Review the four corresponding PostHog replays, then rewrite/reposition the opt-in around the concrete consequence: “Get the next reply to your answer.” Give registered contributors a contributor-specific next email rather than generic welcome copy. Prediction: >=2 of the next 10 first-time contributors interact, >=1 subscribes, and >=1 returns within 7 days. Check after 10 contributors or 4 weeks. This is the route-level leverage point.

**2. Fix the publisher runtime before tomorrow's 06:00 run.** Put Node 24 on the OpenClaw gateway service PATH or pin the publisher command to the approved Node runtime, then run a dry verification of `pnpm gen:all`. Expected effort: ~30 minutes. Success: next eligible publish completes with no engine error; guardrail: verify frontmatter, sitemap, and generated corpus remain consistent. The supply engine is finally producing publishable drafts, so leaving the valve broken wastes the recovery.

**3. Run one tagged question-distribution test.** Pick the best current question, add complete UTMs, send it through one named owned/private surface, and fix `contribution.path`. Prediction: >=15 qualified question visitors and >=2 completions in 7 days with >=80% attributable traffic. If it fails, treat this week's direct spike as noise/private sharing rather than a channel advantage.

Following queue: either restore an Instagram execution cadence around one native Reel or formally retire the channel. The current reminder-only state produces neither reach nor learning.

## Open questions for DJ

1. Should the next implementation target the post-answer reply opt-in and contributor-specific email now that answer completion is moving?
2. Should the OpenClaw gateway service be repaired to Node 24, or should the publisher command pin its runtime independently?
3. Which single owned/private channel should be used for the tagged question replication test?
4. Instagram: authorize a small restart centered on one native Reel, or formally retire the queue and reminders?
5. `enneagram_type_prompt` still has 137 addressable untyped profiles and remains `draft`. Launch after a final audience/count check?

## Assumptions and limits

- PostHog comparison is UTC 2026-08-22--28 versus 2026-08-15--21; 08-28 is partial. Production DB matched-WTD comparison uses equal elapsed Monday-Friday windows ending 2026-08-28 22:11 UTC.
- PostHog regular-traffic filtering excludes classified bots plus explicit admin/test users. Server events without browser traffic properties were retained.
- Direct/unknown is now honest but not explanatory. The 08-24 fix removed false self-referrals; it cannot recover referrers browsers and private apps do not send.
- Social account analytics could not be inspected live. Social claims are repository/scheduler observations, not inferred follower or reach data.
- No product code, campaign status, post, email, draft, publish flag, or external account was changed by this run. Only the dated brief, growth log, and marketing log were written.
