<!-- docs/daily-briefs/2026-10-18_marketing-status.md -->
# 9takes Marketing and Conversion Investigation — October 18, 2026

Traffic is holding up. Participation and return visits after contributing are the problems. The evidence points to an ineffective celebrity prompt, an extra step between the homepage exercise and a real post, and unanswered contributions. There is no evidence in this investigation of a new site-wide signup or commenting outage; successful production submissions were not tested with synthetic accounts or public posts.

## TL;DR

- Engaged visitors rose **582 → 624 (+7.2%)** comparing the same six days, Monday–Saturday. The traffic decline suggested by raw counters is misleading.
- Last complete week had **6 human responses, 2 email signups and 1 registration**. This week, through Sunday morning, has **1 response, 0 signups and 0 registrations**. There were no responses October 12–17; one arrived early October 18.
- Celebrity prompts reached **102 new recorded visitors this week, producing 0 answers**. Since October 3: **226 → 1 (0.44%)**. The only answer says, “i dont understand this question.”
- All six contributors from last week remain unanswered. **None contributed again within seven days; one returned to visit.** The desk has **16 pending drafts**, while all **3 reply-email opt-ins remain unnotified**.
- A newly confirmed operational defect explains why the backlog can disappear from daily attention: the digest returns early when there are no new or unsent drafts, before counting already-emailed pending drafts. Six runs said `no_takes` while 15 drafts were pending. An unanswered backlog does not trigger its alarm.

## What the numbers say

Headlines use `admin_engagement_trends_weekly_v2(26)`, which excludes admins and applies the repository's bot exclusions. “Human visitor” is a non-admin fingerprint with at least 10 seconds of engagement on one day. These are approximate people, not verified identities. Email signup and account registration are separate measures.

| Measure                               | Oct 5–11, complete | Oct 12–18, partial |
| ------------------------------------- | -----------------: | -----------------: |
| Human visitors                        |                676 |                632 |
| Returning human visitors              |                 22 |                 35 |
| Human responses                       |                  6 |                  1 |
| Contributors / returning contributors |              6 / 0 |              1 / 0 |
| Real email signups                    |                  2 |                  0 |
| Registrations                         |                  1 |                  0 |
| Bookings                              |                  1 |                  0 |

The partial week is not a completed-week comparison. The visitor rollup last refreshed at **12:35 a.m. ET October 18**; response and signup records were checked through approximately **9:12 a.m. ET**. The Monday–Saturday comparison above avoids that lag and the incomplete Sunday.

The longer history matters: responses averaged **8.2 per week** from July 13 through September 20, then fell to **0, 2, 6 and 1 so far**. Email acquisition was already very small: **11 filtered signups across the prior 25 complete weeks**. Zero this week is weak performance, but it does not by itself establish a new signup failure. User-created questions were already rare: **only one non-admin, nonremoved question since July 1**, posted September 20. This week's new question was created by an admin.

## Where readers stop

### Celebrity article to answer

This is the largest measured opportunity. This week 369 non-admin fingerprints spent at least 10 seconds on a celebrity page, versus 321 last week. The question appeared to 102 recorded visitors; 90 had at least 30 seconds of nearby article engagement, with median engagement of **3.86 minutes**. Readers are reaching and reading the material.

Every celebrity prompt still falls back to q567: “What's something you do every day to seem fine that nobody knows is costing you effort?” The live Jack Black page confirmed that prompt appears mid-article and asks for a public answer. The proposed easier alternatives, q118 and q203, still have no question entries in `nine_takes`; the loader skips them. The rotation code exists, but the rotation is not operational.

**Likely cause:** an unrelated, emotionally demanding disclosure is a poor next action for someone researching a celebrity. Moving a question that worked on the old homepage into an article did not preserve its conversion rate. The observed 1/226 result supports changing this prompt now; it does not establish how much any replacement will improve it.

### Homepage exercise to public contribution

[PostHog project 35460](https://us.posthog.com/project/35460) records **5 people starting and revealing the exercise, with 3 clicking to post**, in the prior week. This week it records **2 starting, 2 revealing and 0 clicking to post**. These are step-level unique-user counts, not a computed sequential funnel. They use explicit ET-aligned date bounds, the `9takes.com` host and PostHog's internal/test-account filter; they are secondary diagnostics, with different coverage from the database.

The live UI reproduces this sequence: write an answer → “Reveal 9 perspectives” → see AI-written examples → separately choose “Post anonymously and read them.” The reveal works. It does **not** save a community response. That additional choice is where the two observed users stopped. With only two users, this is a friction hypothesis rather than a reliable week-over-week rate estimate.

The homepage's database exposure count remains incomplete: `loadHomepageLiveTake` only records a gate when a fingerprint cookie already exists. Use browser-side exposure tracking before interpreting the homepage gate ratio.

### Contribution to reply to return

Responses 753–758 have **zero replies**. Only 753 returned to visit within seven days; none of the six contributed again. Today's response 759 also has no reply. The most recent admin reply is still October 3.

The digest is running: it drafted today's response and logged a successful send. This proves application-reported sending, not inbox placement or readership. The implementation only carries forward drafts whose digest was never sent. Once a digest is marked sent, an unanswered draft receives no dedicated repeat reminder. The alarm checks drafting/sending failures, not overdue responses. This is a system-design problem as well as an unfinished hosting task.

### Reader to email signup or registration

This week `/register` had 77 tracked fingerprints but **zero visits with 10 seconds of engagement**. Do not treat 77 as interested people abandoning registration. Registration security logs contain 83 honeypot outcomes, similar to 78 last week, and no new ordinary registration failure. Newsletter logs show no successful signup and no recorded delivery/backend failure; their rejected requests are consistent with automated traffic. The three `too_fast` attempts took 195, 286 and 2,306 ms and had at most 1.4 seconds of nearby engagement. There is no positive evidence here that a newly tightened gate rejected an engaged reader.

The newsletter UI records completion but lacks exposure, start and failure events. `NineChorus` similarly lacks the start/failure telemetry available on other comment surfaces. That limits how precisely we can distinguish disinterest from unrecorded browser failures.

## Mistakes and technical findings

| Finding                                                 | Evidence and practical effect                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Celebrity rotation incomplete                           | `src/lib/server/provenChorusQuestions.ts` lists three candidates; production `nine_takes` has only q567 for questions. The easiest alternatives never render.                                                                                                                                                                                                  |
| Host reminders ignore unanswered drafts already emailed | `src/lib/server/hostDigest.ts:1249` returns before counting the backlog; `applyAlarm` at line 1018 has no overdue-reply condition. Six quiet days hid 15 pending drafts.                                                                                                                                                                                       |
| Weak-password error still mislabelled                   | `src/routes/register/+page.server.ts:144` only handles one auth-error status; the fallback at line 155 displays “Server error. Please try again later.” Four actual weak-password errors occurred October 1/3, affecting two visitors in the prior audit. None occurred this week, so this is an unresolved conversion bug, not evidence of this week's cause. |
| Mail recovery incomplete                                | Mail is sending again: 3 welcome emails this week, 0 failures. Signup 211's October 5 confirmation remains failed with no later send. The type-prompt sequence is still `draft`; 16 reactivation enrollments sit in a `paused` sequence. These are distinct from a current mail outage.                                                                        |
| Social-image generation error                           | Two October 14 `opentype.parse is not a function` errors for q571. The route catches the error and serves a fallback image. This affects sharing presentation, not the response form.                                                                                                                                                                          |
| Measurement blind spots                                 | Homepage first-visit exposure is missed; celebrity composer starts/failures and newsletter exposure/starts/failures are missing. Absence of logged errors is not proof every submission path works.                                                                                                                                                            |

The October 14 Turnstile changes are scoped to person suggestions, not the newsletter or registration form. The October 16 session change preserves fresh authentication checks for writes and sensitive routes. Neither supplies a demonstrated explanation for inactivity that began before those changes. **81 existing tests passed** across auth hooks/session verification, registration, homepage posting, mirror posting and newsletter signup. Those tests use controlled dependencies and do not establish live email delivery or a complete production submission.

## Marketing operations

- **Acquisition:** Google supplied 338 of this partial week's engaged visitor entries, already above 321 for the whole prior week. Two recorded social entries this week came from Reddit and X. There is no observed broad search-traffic collapse.
- **Publishing:** production has 453 published people profiles and 146 unpublished rows. All six publisher runs October 13–18 ended with “No publishable draft.” The latest scan has 95 unpublished candidates, including 70 missing perspective reviews and 20 missing portrait assets. Draft production is not reliably becoming publication.
- **Distribution:** Instagram runway remains **RED: 0/10 approved or scheduled**. The latest local engagement log is August 7. This is a local-record finding, not a live social-account audit.
- **Search/outreach limits:** GSC exports stop at October 4. Search rankings and current outreach inbox status were not revalidated; neither should be presented as an identified cause of the last few days' activity.

## Recommended order

1. **Answer the people already here and make overdue replies visible.** Start with today's 759, the substantial registered-user response 754, and the reply-email opt-ins 749 and 743. Add a backlog reminder after a digest has been sent and an overdue-reply signal independent of new takes. Success: at least 80% of new substantive takes receive a reply within 24 hours, the opted-in authors receive their notifications, and at least one contributor returns to contribute over the following two weeks.
2. **Replace the celebrity prompt and finish the existing rotation.** Seed and validate the prepared q118/q203 sets, or test an on-topic “What is your read on this person?” prompt in the same visible slot. Hypothesis: a simpler, relevant question will increase answers because the current readers already engage with the article. Success: at least 3 celebrity contributors per week over two weeks, with no material decline in article engagement. Treat this as a before/after intervention; traffic is too small for a sensitive A/B test.
3. **Repair the known conversion defects and measurement gaps.** Correct weak-password messaging, recover signup 211's missed confirmation, record browser-visible homepage exposure and instrument newsletter/celebrity start → submit → success/failure. Then judge the homepage's extra public-post choice with actual step data. Preserve the user's explicit choice to publish.

The first move is replies, followed by the celebrity prompt. More draft production will not repair these two leaks.

## Evidence and scope

Production reads used the repository's forced-read-only `scripts/db-query.sh`; the connected Supabase account did not list the 9takes project. [Weekly snapshot](../growth/audits/2026-10-18-weekly-snapshot.json), [SQL diagnostics](../growth/audits/2026-10-18-marketing-funnel.sql), [PostHog query definitions](../growth/audits/2026-10-18-posthog-queries.json), and the [growth log](../growth/growth-log.md) retain the evidence. Browser observations occurred after the analytics cutoff, and no account, subscription or public response was created. Product code and production state were not changed.

Historical breaks: September 21 ISR caching invalidated server-load-based celebrity access counts; October 2 removed crawlers from gate events and added contribution paths; October 3 launched the replacement homepage and celebrity surfaces. Current comparisons use the period after those breaks. Gate events deduplicate by fingerprint/question/event, so they measure newly recorded exposure, not every repeat view.

## Implementation follow-up

After this read-only audit, DJ authorized fixes. The homepage's second posting step has been removed; celebrity articles now prefer the concrete three-word question with bundled, labeled AI examples. Signup error handling, missing funnel events, digest backlog visibility and social-card rendering have also been repaired locally. These changes have not been deployed, and the production observations above remain the pre-change baseline. See the [growth-log implementation entry](../growth/growth-log.md#2026-10-18--conversion-fixes-prepared-locally) and its screenshots for the exact scope, verification and remaining operational work.
