<!-- docs/daily-briefs/2026-08-17_marketing-status.md -->

# 9takes Marketing Status — 2026-08-17

**Unattended weekly run (marketing-pm, via `/weekly-marketing-brief`).** Prior status brief: `2026-08-05_marketing-status.md` — **last Monday's brief (08-10) never ran**, so this covers ~12 days. Growth data is fresh (weekly audit ran today, 2026-08-17); its headline and biggest leak are folded verbatim, not re-derived. No drafts, `published:` flags, distribution packets, product code, git operations, or external services touched.

## TL;DR

- **The missing 08-10 brief has a root cause, and it took the whole stack with it: Claude usage credits ran out.** Four independent jobs failed within seconds of each other that morning with the identical string `You're out of usage credits` — the weekly growth audit, the weekly marketing brief, the nightly blog create pipeline (chase-infiniti, 3s, no draft), and the Instagram warmup. This was a full-day automation blackout, not four separate bugs.
- **Instagram is no longer dark by accident — it is unscheduled.** `openclaw cron list` returns 9 jobs and **zero of them are Instagram**. The three IG warmup crons that were migrated on 07-26 are gone. Last warmup log is 08-10 (credit failure); last session artifact is 08-07, **10 days ago**. The only IG-adjacent jobs left are two plain text reminder notifications. Twelve days ago this channel was "healthiest cadence ever."
- **The image blocker — #1 in three consecutive briefs — is effectively solved.** `missing_full_image` fell **56 → 7** and `missing_thumbnail_image` **56 → 7**. A portrait pipeline shipped in the gap (`scripts/prepare-personality-image.sh`, `scripts/check-build-budgets.mjs`, `scripts/build-budgets.json`, plus two "accept staged portrait library baseline" commits). This is the biggest quiet win of the period and it went un-briefed.
- **Publish flipped from jammed to fast — but entirely by hand.** Disk `published: true` went **401 → 417 (+16)**; DJ hand-published **12 profiles across 08-12 → 08-16**. That is the best publish rate in months. Meanwhile the auto-publisher has **failed 16 of the last 17 days** and last shipped on its own on **07-30 (jack-antonoff, 18 days ago)**.
- **New #1 publish blocker, and it is structural: `missing_perspective_review = 89`.** A perspective-review gate landed around 08-04/08-06 and now disqualifies **89 of 91** backlog drafts. Only **25** people have perspective-review artifacts on disk, all produced by the nightly pipeline since 08-04. Each legacy draft needs its own `scripts/run-blog-pipeline.sh <Person> --resume`. At one pipeline run per night with the slot already spent on a new create, **89 finished drafts are structurally unreachable** unless a backfill is authorized.
- **Growth headline (verbatim, 2026-08-17 audit):** _"record contribution week (17 comments, 12% gate conversion, first anon->register->contribute session ever) — and the mechanism behind '88% untyped' is now fully traced: the product has no typing step anywhere."_
- **GSC T-09 is finally met** after four briefs: `latest.json` runDate 08-13, window **2026-05-05 → 08-11**, starting one day after the 05-04 URL fix. First clean measurement window.
- **Unacted, now aging:** the Reels E1 decision (26–45x reach, logged 08-03) has produced nothing in 14 days — `queue.json` untouched since 08-03, experiment-log untouched since 08-03, still 0/10 approved, still no native 9takes Reel ever posted, Chappell Roan Reel still `copy_ready` 13 days past target. Quora **90 days dark**. 14 distribution assets unfired for 26 days. Pop-culture 18 unpublished, 6th consecutive brief.

## The actual work — the publish gate moved, and nobody was told

The last three briefs named the same bottleneck: manual Canva images. That bottleneck is gone. What replaced it is larger and less visible, because it arrived as a quality upgrade rather than a failure.

| Blocker class                   | 2026-08-05 | 2026-08-17 | Read                                                                             |
| ------------------------------- | ---------: | ---------: | -------------------------------------------------------------------------------- |
| `missing_perspective_review`    |          — |     **89** | New gate. Now blocks 89 of 91. Did not exist as a top blocker at the last brief. |
| `source_standard_failed`        |         50 |         47 | Roughly flat.                                                                    |
| `missing_grade_stability_delta` |         41 |         38 | Roughly flat. Supervised-regrade class, unchanged for a month.                   |
| `content_quality_below_8.5`     |          — |         34 | The known 8.2–8.5 structural ceiling.                                            |
| `stale_grade_rubric_v1`         |         30 |         29 | Legacy v1-rubric debt, flat.                                                     |
| `missing_content_quality`       |          — |         14 | Ungraded drafts.                                                                 |
| `missing_full_image`            |     **56** |      **7** | **Solved.** Portrait pipeline shipped in the gap.                                |
| `missing_thumbnail_image`       |     **56** |      **7** | **Solved.**                                                                      |

The arithmetic that matters: **25 perspective-review directories exist; 92 drafts are unpublished.** Every one of the 25 was produced by the nightly pipeline on or after 08-04, one per night. There is no backfill path in the automation. The gate is doing exactly what it was built to do on new work, and it has silently converted the entire legacy backlog into inventory the auto-publisher can never select.

What is actually working is a different loop than the one the automation describes:

| Step               | Owner            | Evidence                                                                                    |
| ------------------ | ---------------- | ------------------------------------------------------------------------------------------- |
| Nightly create     | cron, 02:00      | 1 draft/night, running clean since 08-11                                                    |
| Perspective review | pipeline stage   | 4 pass / 2 fail_after_revision / 1 needs_revision / 1 reviews_incomplete in the last 8 runs |
| Portraits          | new pipeline     | image blocker 56 → 7                                                                        |
| Publish            | **DJ, manually** | 12 profiles 08-12 → 08-16; auto-publisher failed every one of those mornings                |

That is a functioning ~1.7 profiles/day pipeline where the last mile is a human. It is not broken. But the daily 06:00 publisher failure email is now noise rather than signal, and the 89 stranded drafts are the real question.

## Tooling state

- **08-10 credit exhaustion took out four jobs.** Identical failure string in `logs/growth-automation/audit-2026-08-10.log`, `logs/marketing-automation/brief-2026-08-10.log`, `logs/instagram-warmup/warmup-2026-08-10.log`, and `logs/blog-automation/cron-2026-08-10.log`. IG warmup also failed the same way on 08-09. No credit-exhaustion guard or alert exists — the jobs fail with exit 1 and the Telegram notifier does not distinguish this class.
- **Instagram crons absent from the scheduler.** Nine OpenClaw jobs are registered; none are Instagram. `Daily Engagement Reminder` (09:30 daily) and `Monday Content Batching Reminder` (10:00 Mondays) are `systemEvent` text nudges to DJ, not automation. This contradicts memory `[[blog-automation-scheduler]]`, which records three IG warmup crons migrated to the command-payload pattern on 07-26. Something removed them between 08-10 and today.
- **08-08 API outage burned 3 hours.** Two create runs died on `API Error: Unable to connect to API (ENOTFOUND)` after **5,664s** and **5,450s** respectively. The 600s ceiling that was supposed to cap Stage 1 did not apply. Telegram notification also failed to send that run.
- **Wrapper still killing runs post-pipeline.** `RECONCILING: <person> has a draft but was never moved to completed (wrapper likely killed post-pipeline)` appears on 08-10 (noah-wyle) and 08-17 (simone-biles). Recurring, self-healing, but it means drafts land in `completed` with `needsReview` rather than a clean state.
- **Citation lint noise:** every publisher run since at least 08-13 emits `[khabib-nurmagomedov:citations] rejected non-HTTPS or invalid URL: http://ufcstats.com/...`. One-line fix, currently printed daily.
- **Uncommitted work in tree (untouched per parallel-work safety):** `src/blog/people/drafts/Charlize-Theron.md` plus its research, grade, entity-gap and perspective-review artifacts (this morning's run, `fail_after_revision`, 8.0), and modified `docs/BLOG-CROSSLINK-INDEX.md`, `docs/blog-automation/backlog-queue.json`, `docs/data/corpus-stats.md`, `docs/growth/growth-log.md`, `src/lib/data/corpus-stats.json`.

## Cross-surface status

### Blogs — people

- Disk: **417 published / 92 unpublished** (was 401/95). Net +16 published, +21 files.
- **Create is the healthiest it has been.** Clean nightly runs 08-11 → 08-17. Recent grades: Carl Jung **9.0 pass**, Simone Biles **8.6 pass**, Tyla **8.6 pass**, Duke Dennis 8.4 pass, Chase Infiniti 8.2 fail_after_revision, Charlize Theron **8.0 fail_after_revision** (today). The revision loop is firing and the 8.2–8.5 ceiling is intact.
- **Perspective review is the new quality choke, not grade.** Of the last 8 completed runs: 4 pass, 2 fail_after_revision, 1 needs_revision, 1 reviews_incomplete. Two of the last three nights produced a draft that cannot publish on quality grounds.
- **Closest-to-publish today** (from the 06:00 log): `simone-biles` (images only — and the portrait pipeline now exists), `margaret-qualley` / `yang-zhilin` / `keira-knightley` (grade-instability delta + perspective review), `victoria-justice` (supervised regrade + perspective review). Victoria Justice and Keira Knightley have now been named unblocks in **five consecutive briefs**.
- Backlog queue healthy: `alexandr-wang`, `bill-burr`, `ms-rachel` on top. `ms-rachel` is explicitly flagged as the likely **Type 2 anchor** the Instagram type-pond strategy has been missing — that gap is now three briefs old.
- Weekly create cap: 0/5 used, week started 08-16. Capacity is not the constraint.

### Blogs — pop-culture and other categories

- Pop-culture: **18 unpublished, 6th consecutive brief unchanged.** Ten of them date to 05-18 (3 months); the newest is `succession-personality-trap` (07-28).
- Previously under-reported: **community 16 unpublished / 18 files**, **enneagram 16 unpublished / 99 files**, **guides 8 unpublished / 14 files**. Roughly 40 finished non-people drafts sit unpublished with no gate and no automation — these do not pass through the people publisher at all.

### Instagram

- **Sessions: 10 days dark** (last artifact `2026-08-07_instagram-warmup-2.md`). **Automation: unscheduled entirely.** Engagement-targets doc last written 08-07.
- Content-ops queue **frozen for 14 days** (`queue.json` untouched since 08-03) and still RED: **0/10 approved or scheduled**, `briefed=8, copy_ready=9, design_ready=2, published=1, blocked=1`. Copy-ready 12/15 → 11/15.
- **Reels E1 has produced zero action in 14 days.** `docs/instagram/reels/experiment-log.md` untouched since 08-03; the results section still ends at the 07-24 baseline. No native 9takes Reel has ever been posted. The Odyssey window flagged as time-boxed on 08-05 has now been open, unused, for 12 of its ~30 days.
- Comment leg: unchanged at zero posted. The 08-05 fork DJ was asked to resolve (auto-post the top suggestion vs. retire the leg) is still unanswered, and is now moot until the crons come back.

### One Take / video

- **First movement since 07-25:** `docs/marketing/one-take/founder-origin-arc.md` created 08-13 — the first artifact ever in that directory. Ep 1 (MrBeast) script still unfilmed, 23 days after it was declared ready.

### Distribution / Quora / Twitter

- **14 distribution assets unfired**, directory untouched since 07-22 (26 days). Oldest packets date to February.
- **Quora: 90 days dark.** Last session, last cron log, and last question-log entry all stop at 2026-05-19. This is the 8th consecutive brief carrying a revive-or-retire call that has never been answered. Recommend it be decided or formally retired this cycle rather than re-listed.
- Twitter: no session artifacts since 05-19, but content work happened — `docs/twitter/voice-and-tone.md`, `docs/taskers/T-32-twitter-x-toxicity-refresh.md` and a pop-culture Twitter toxicity refresh landed 08-13.

### SEO

- **T-09 CLOSED.** GSC `latest.json` runDate **2026-08-13**, window **2026-05-05 → 08-11 (98 days)** — starts one day after the 05-04 URL fix. The first clean window in the file's history; `seo-content-strategist` can now be run against uncontaminated data.
- corpus-stats, crosslink index and sitemap all regenerated 08-16 22:58 (sitemap: 674 URLs). One SEO commit in the window: `31c3b951b seo: retire compatibility guide`.

### Growth (audit 2026-08-17 — folded, not re-derived)

- **Headline (verbatim):** _"record contribution week (17 comments, 12% gate conversion, first anon->register->contribute session ever) — and the mechanism behind '88% untyped' is now fully traced: the product has no typing step anywhere."_
- **Biggest leak (verbatim):** _"9takes never types anyone, so the personalized payoff its entire product promise rests on cannot be delivered — and this week we watched a motivated user fail at exactly that step."_ The mechanism is traced in code, not inferred: `/register` has no `enneagram` field at all; `/enneagram-test` is not a test (its H1 is "There's no checkbox quiz here", 42 fingerprints in 8 weeks at a **1.6-second** median engaged time); the only surface that can set a type is the `/account` profile edit, reached by **6 fingerprints in 8 weeks**.
- Direction changes worth carrying into marketing decisions: the 08-03 "six-day zero-contribution streak" was **variance, closed**; contributions 4 → 17 (record); gate conversion 5.4% → 8.3% → **12.0%**; first-ever anonymous → register → contribute session (one human produced 53% of the week); first real long-tail return (26 days).
- **Two record corrections that invalidate prior briefs:** profile `9ce7ff91`, counted in the 07-20 / 07-27 / 08-03 audits as a reactivated Type-8 user and the only multi-day returner, **is DJ**. And the coaching waitlist has been dead **19 weeks, not 10–12** (last row 2026-04-06).
- **New confirmed instrumentation bug:** `src/routes/api/analytics/page-view/+server.ts:12-25` falls back to the beacon's own `Referer` header, labelling **3,271 of 3,913** first-touch fingerprints as `referrer_host = '9takes.com'`. **84% of traffic has no usable source.** Every "where is traffic coming from" question in this brief and the last six is unanswerable until this is fixed.
- Growth's ranked bets: (1) **type the user at the reveal**; (2) post-contribution identity capture (**fourth consecutive audit as a top bet, still unshipped**); (3) stop `reactivation_dormant`, move volume to `zombies`.

### Email

- `reactivation_dormant` over 4 weeks: **227 sends / 36 opens / 1 click / 4 unsubs / 0 real returns.** `reactivation_zombies` over 3 weeks: 86 sends / 26 opens (**30.2%**) / 3 clicks / 0 returns. The pause decision has now been pending since 08-03.
- `welcome_sequence` healthy and firing same-day on registration. Signup capture broke a 6-week zero with 1 organic signup on 08-12.

### Outreach

- No new artifacts since `2026-08-04_nine-mirrors-podcast-pilot.md`. Nothing sent. Long-Form cluster still 2/12.

## What changed since the last brief (2026-08-05)

- **08-10: full automation blackout from Claude usage-credit exhaustion** — killed the weekly growth audit, the weekly marketing brief (this is why 08-10 is missing), the nightly create, and the IG warmup.
- **Instagram crons disappeared from OpenClaw entirely.** Channel went from daily sessions to unscheduled inside 10 days.
- **Portrait/image pipeline shipped**; the 3-brief-old #1 publish blocker collapsed 56 → 7.
- **Perspective-review gate became the #1 blocker at 89**, stranding the legacy backlog.
- **DJ hand-published 12 profiles** (08-12 → 08-16); disk published 401 → 417.
- **Auto-publisher failed 16 of 17 days**; last autonomous publish 07-30.
- **GSC clean window achieved** (T-09 closed after four briefs).
- **Growth reversed positive**: record 17 contributions, 12% gate conversion, first full anonymous-to-registered conversion; plus two record corrections and a new attribution bug.
- **One Take produced its first artifact** (`founder-origin-arc.md`, 08-13).
- **Twitter content work resumed** (voice-and-tone doc, T-32 toxicity refresh) without any posting cadence.
- **Unchanged for 14 days:** content-ops queue, Reels experiment log, Odyssey window, distribution assets, Quora, pop-culture backlog, IG comment-leg fork, reactivation pause, growth bets 1 and 2.

## Recommendation

Three, ranked by leverage. All require DJ's decision; nothing was executed this run.

**1. Ship the cheapest version of type-at-the-reveal, and treat the argument as new.** This is the fifth time identity/type capture has topped a list, so it deserves a reason it should land differently: it is no longer a hypothesis. Growth traced it in code this week — `/register` has no type field, `/enneagram-test` is not a test, and the only typing surface in the product drew 6 fingerprints in 8 weeks. The same audit caught a motivated user bouncing off `/enneagram-test` twice in 8 minutes and then registering untyped. Every profile marketing sends to the site is born `unknown`, which is why 3,847 weekly visitors convert to a generic nine-take dump. _First step:_ add an optional type selector plus "not sure" to `/register` (growth calls this a same-day partial), then the one-click "which of these nine sounded most like you?" at the reveal. ~Half a day of eng. Highest ceiling in the system, and it is the only item here that changes what the traffic does.

**2. Decide what happens to the 89 perspective-review-blocked drafts.** These are finished, graded, image-complete assets that the auto-publisher can no longer see, and nothing in the automation will ever unblock them. Two clean options: **(a) grandfather** — exempt drafts created before the gate landed (~08-04) so the publisher can select them again on the old criteria; or **(b) backfill** — run `scripts/run-blog-pipeline.sh <Person> --resume` in batches, which is one agent run per draft and will take weeks at current capacity. _First step:_ pick (a) or (b). If (a), it is a one-line date check in `scripts/lib/perspectiveReview.js`. Leaving it undecided means the daily 06:00 failure alert stays permanently red and 89 assets quietly rot. ~10 minutes to decide, high downstream value.

**3. Restore the Instagram crons, or formally retire the channel.** The channel did not stop by decision — it fell off the scheduler and no one noticed for 10 days. That is worth fixing regardless of the unresolved comment-leg fork, because sourcing and saves were producing even when posting was not. _First step:_ `openclaw cron` re-create the three warmup jobs using the 07-26 command-payload pattern (never wrapped in `agentTurn`, per memory `[[blog-automation-scheduler]]`), and add a credit-exhaustion guard so the 08-10 class of failure pages instead of exiting silently. ~15 minutes. If the honest answer is that Instagram is not getting attention this quarter, retire it explicitly and stop carrying it in briefs.

Deliberately not proposed: Quora revival and the 14 distribution packets. Both have been open standing calls for 8 and 4 briefs respectively with no movement. Recommend they be formally retired rather than re-listed a ninth time — see Open Question 6.

## Open questions for DJ

1. **Perspective-review backfill:** grandfather the pre-08-04 drafts, or authorize a batch `--resume` campaign? (Nothing unblocks the 89 until this is answered.)
2. **Instagram:** re-create the three warmup crons, or formally retire the channel? And does the 08-05 comment-leg fork (auto-post top suggestion vs. retire the leg) still stand once the crons are back?
3. **Type-at-the-reveal / identity capture:** green-light the `/register` type selector as a same-day partial? This is the fourth-to-fifth consecutive audit asking.
4. **Analytics attribution bug:** authorize the `page-view/+server.ts` referrer fix? Until it lands, no source segmentation is possible for any channel in this brief.
5. **Reactivation email:** stop `reactivation_dormant` and move volume to `zombies`? Pending since 08-03; 227 sends have bought 1 click and 4 unsubscribes.
6. **Standing calls up for retirement:** Quora (90 days dark, 8 briefs), the 14 unfired distribution assets (26 days, 4 briefs), and the 18 pop-culture drafts (6 briefs). Retire, or assign a date?
7. **Credit exhaustion:** should the cron wrappers hard-alert on the `out of usage credits` string? One 08-10 outage cost a growth audit, a marketing brief, a blog draft and an IG session.
8. **Reels E1:** the "promote Reels to the spine" decision has produced nothing in 14 days and the Odyssey window is roughly half-expired. Still live, or superseded?

## Assumptions

- Publish counts are read from disk frontmatter (`src/blog/people/drafts/`), not from `blogs_famous_people`. `backlog-queue.json` reports 391 published / 132 unpublished, which is the DB view and lags disk; disk is treated as authoritative for pipeline state.
- Growth numbers are folded verbatim from today's audit and were not independently verified against the database.
- The 12 hand-published profiles are inferred from commit subjects plus disk `published: true` deltas; the exact publishing mechanism (admin content-board vs. `pnpm push:people`) was not verified.
- The Instagram cron removal is observed (0 of 9 jobs) but the cause is unknown — deletion, migration, or job-store loss all fit the evidence.
