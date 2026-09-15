<!-- docs/daily-briefs/2026-09-14_marketing-status.md -->

# 9takes Marketing Status — 2026-09-14

**Unattended weekly run (Monday cron).** This covers 7 days. The prior brief is `2026-09-07_marketing-status.md`. The growth freshness gate passed: the newest entry in `docs/growth/growth-log.md` is `### 2026-09-14` (audit exit 0 at 11:07 today, on its third start). Its headline and biggest leak are quoted below, not re-derived. The Supabase MCP failed to connect, so I ran a few read-only checks through `scripts/db-query.sh`: people ship-state, gate events by path, and homepage visitors. This run changed no draft, publish flag, packet, email, post, campaign, or git state.

## TL;DR

- **Growth headline (verbatim, 2026-09-14 audit):** _"best activation week on record (gate 25%), and every one of the 7 contributors hit a dead end. 0 were reachable by email, the one host reply landed 4.8 days late on an anonymous take, and the first person ever to opt in to reply alerts never got a reply. Welcome mail is still off, 12 days now, and as of today it also blocks signup confirmations."_ Cohort week 09-07: 4,213 new visitors (642 from search, third straight weekly gain), 0 signups, 0 profiles, 7 comments, gate 28 -> 7 = 25.0%. Contributor return is **0 / 31 across seven matured cohorts**.
- **Biggest leak (verbatim):** _"the loop reaches the answer and then has no way to reach the person."_ Mail is still off because `EMAIL_FOOTER_ADDRESS` is unset, 12 days after 09-02. The 09-10 launch check found that the **value itself does not exist anywhere**: the variable is missing from Vercel and empty in both local env files. So the real blocker is DJ supplying a postal address, not flipping a variable. The same missing value holds the Enneagram type-prompt campaign, which DJ already approved on 09-10 (31 eligible recipients).
- **NEW, not in the growth audit: the 09-10 homepage rebuild took the live question off `/`.** Commit `02b469175` (09-10 19:10 UTC) deleted `src/routes/+page.server.ts`, which loaded `getHomepageFeaturedQuestion()` and recorded the gate impression. The homepage is now a static practice question (`HomeLandingV2`, Harry Dry V2, promoted in `2ca432d5b`). Since 09-01, `/` logged 21 `gate_shown` rows and 4 contributions. The last one was 09-10 17:20 UTC and there have been **zero since**, while homepage visitors held at 14-23/day. In the prior 7 days `/` was the largest gate surface (9 fingerprints, 2 contributions). The cost is unmeasured.
- **Correction to the 09-07 brief: the auto-publisher did not lose four publishes.** DB `published_at` shows the 06:00 job itself set Ryan Holiday (08-28), Freddie Mercury (08-29), Marcus Aurelius (08-30), Aaron Pierre (08-31), Jonathan Bailey (09-01) and Zach Bryan (09-10) live at about 10:00 UTC. Only the regen step after publishing (`pnpm gen:all`: sitemap, corpus stats, search index) fails, on Node 26.5.0. Publishing works and regen does not. The OpenClaw `error (46x)` counter is mostly noise.
- **The content engine refilled but has produced nothing publishable yet.** DJ approved 7 subjects from the 09-09 surging-people scout (athletes deprioritized), and pipeline v3 shipped 09-10 (`733de46af`) after the 09-09 pipeline audit. Nightly results since then: Arthur Mensch ungraded, Austin Abrams 8.1 (held), Joseph Zada 8.4 (held, 0.1 short), Tom Rhys Harries research timeout. Manual runs: Nathan Fielder 7.9, Inde Navarrette 8.1. There were 3 publishes this week (Bill Burr and Patrick Mahomes by hand, Zach Bryan by the job), taking the DB from 447 to 450. Publisher unpublished candidates rose 75 -> 80.
- **Still dark:** Instagram 38 days (queue frozen 37 days), Quora 118 days, Twitter nothing since 05-19, 14 distribution assets unfired (oldest 201 days), 0 founding-circle invites, 7 of 8 Reddit drafts unfired, GSC snapshot 32 days stale.

## The actual work — the answer loop converts, and nothing reaches the person afterward

The gate hit its best rate on record. Everything after the answer failed in both config and design. Three independent breaks now sit between a contribution and a return visit, and one new surface change reduced how many people reach the gate at all.

| Component                      | State (observed)                                                                                                                                                                             | Blocker / owner                                                                |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Welcome sequence               | 0 sends since 09-01; 4/4 enrollments `errored` at `failure_count=3`                                                                                                                          | Postal address for `EMAIL_FOOTER_ADDRESS` (DJ), then Vercel env + re-arm       |
| Signup confirmation            | `signups.id=208` (first signup in 17 days) confirmation `failed` today, 14:16 UTC, with the same error; signup mail is `emailKind: 'marketing'`                                              | Same address                                                                   |
| Enneagram type-prompt campaign | DJ approved the copy and authorized the send 09-10; DB draft synced; 31 eligible / 108 held; 0 enrollments                                                                                   | Same address, then one test send to DJ's Gmail to check headers                |
| Delivery-health alarm          | Shipped 09-09 (`32c79465f`): `process-sequences` returns 500 while stopped enrollments exist; inferred failing every 15 min for 5 days                                                       | Routed to nobody (not Telegram, not the digest)                                |
| Logged-in reply email          | Live; 222 `notifications`, all `email_status='none'`; 0 `reply_to_take` rows since 08-11                                                                                                     | Design: all 7 contributors were anonymous                                      |
| Host digest / desk             | 7 takes -> 2 drafts -> 1 posted reply, 115h late, word-for-word the fallback copy; 5 takes never drafted and now outside the 48h lookback                                                    | No `maxDuration` on `/api/cron/host-digest` (inferred timeout); fixed lookback |
| Anonymous reply opt-in         | First conversion ever (`comment_reply_subscriptions.id=1`, take 733, via the Reddit alpha link); no draft, no reply, `notification_count=0`                                                  | Host-digest miss                                                               |
| Homepage gate (`/`)            | Live featured question removed 09-10; 0 gate events since 17:20 UTC that day; practice question links to live slug `whats-criteria-considering-someone-friend` (2 gate fps before and after) | Unmeasured; DJ design decision                                                 |
| `contribution.path`            | NULL on 5 of 7 events (was 2 of 4)                                                                                                                                                           | Unshipped; makes the homepage split above hard to reconstruct                  |

Growth's ranked bets, adopted as-is: (1) turn mail on and route the alarm to DJ (third ask); (2) get every take a same-day host reply, reachable takes first (`maxDuration: 300`, lookback from the last successful digest, backfill replies to 733/735/737 today); (3) change the opt-in to promise a reply from a person ("DJ replies to every take. Where should we send it?") and fix `contribution.path` in the same change. Hold Reddit and founding-circle invites until 1 and 2 are live.

## Tooling state

- **The Monday chain ran about 5 hours late but did not black out.** Growth audit starts: 06:08; 08:19, which returned "You stopped the weekly growth audit before it began"; a wrapper `FAIL` at 10:27 (no artifact); then a re-run at 10:31 that exited OK at 11:07. The brief wrapper started at 10:27 (no brief produced) and again at 11:07 (this run). There was no credit error this time. Cause of the 08:19 interrupt: unknown.
- **The publisher's failure mode needs re-labeling, not fixing from scratch.** `scripts/daily-blog-publisher.sh:19` still calls bare `node scripts/personBlogParser.js --publish`. The DB flip succeeds and `pnpm gen:all` fails on the engine check (`>=22.13.0 <25`, got v26.5.0). New profiles go live without a sitemap, corpus, crosslink, or search-index refresh until someone regenerates by hand (sitemap redone 09-11 20:53, corpus 09-12). "No publishable draft found" also exits 1, so the job has shown `error` almost every day. Neither signal means what the Telegram alert implies.
- **Pipeline v3 shipped 09-10** (`733de46af`): `run-blog-pipeline.mjs`, v3 research/draft/edit/review/verify commands, `blogEditorial.js` + spec, similarity and perspective-review lib changes; the legacy runner is kept as `run-blog-pipeline-legacy.sh`. This follows `docs/content-analysis/blog-pipeline-audit-2026-09-09.md` (fix reliability defects first, then reconcile editorial policy, consolidate, and pilot). Early v3 results: 0 of 3 nightly attempts reached 8.5 (n=3, too early to judge). The 09-14 run hit a research-stage timeout after 50 min.
- **OpenClaw:** same 9 jobs. Create `error` (today's timeout), publisher `error (46x)` (see above). Still no Instagram or Quora execution jobs.
- **Not my surface, noted only:** comment ranking shipped 09-07 (`48c4b75ac`, migration `20260907175553`, phase-2 view collection, ranked ordering off; verification doc 09-08). Account page rebuild (09-10). HyperPlexed / Harry Dry homepage audit trackers. New visual style guide `docs/visual-style/cel-shaded-neo-noir/`.

## Cross-surface status

### Growth and email

- Headline, leak and bets are quoted above. Other facts from the 09-14 entry: contributions spread past q567 (q567 4/18 fps, q118 2/9, q515 1/1), and q567's share fell from 75% to 57% (target <50%). Quality split: 3 real answers and 3 near-zero. Median length 58 -> 32. `/register` visitors 8 -> 0. `/book-session` 7 -> 35 visitors, but 30 are 0ms / 0%-scroll `utm_campaign=personality_analysis` single-page sessions (inferred bots or link previews). Waitlist empty for the 21st week. Open tracking recorded 1 open on 09-11.
- Email-sequence docs this week: `enneagram-campaign-readiness-2026-09-08.md`, `enneagram-first-touch-copy-review.md`, `enneagram-launch-check-2026-09-10.md`. The launch check also flags a historical DKIM failure (July 29 message: DKIM fail, SPF/DMARC pass), so the first test send should inspect headers before releasing the audience.
- Question inventory: 4 questions removed 09-10 (#86, #132, #166, #172; public 48 -> 46; reversible `removed = true`), and 6 category descriptions updated. 356 generated questions stay flagged. Record: `docs/audits/question-purge-2026-09-10/removal-results.md`.
- Full evidence: [`docs/growth/growth-log.md`](../growth/growth-log.md) `### 2026-09-14`.

### Homepage (new signal this week)

- `02b469175` (09-10 15:10 EDT) removed the server load that featured a live question and swapped in a static practice experience. `2ca432d5b` (21:39 EDT) promoted `HomeLandingV2` ("Try a private question, compare 9 perspectives, then join a real conversation"). Design rationale: `docs/marketing/2026-09-10-harry-dry-landing-page-audit.md` ("put a real question in the opening screen... keep the first answer anonymous").
- **Observed (DB):** gate events on `/` stopped after 09-10 17:20 UTC. Gate fingerprints across all paths ran about 5.3/day in the 7 days before the swap and about 3.3/day in the 3.3 days after. The q567 page also fell from 5 to 0. Homepage visitors did not drop (09-04..09-10: 15-23/day; 09-11..09-14: 14-22/day).
- **Inferred:** the practice-first homepage cut gate exposure. The window is 3.3 days, the counts are small, and some `/` `gate_shown` rows were impression telemetry rather than a rendered gate, so treat this as a lead for `growth-analyst`, not a verdict. The 4 contributions on `/` since 09-01 do confirm the homepage was converting.

### Blogs — people

- Disk: **441 published / 90 unpublished**, up from 438 / 88. DB: **450 published / 129 unpublished**, up from 447 published.
- Publishes since the last brief: Bill Burr (09-07 17:34 UTC, by hand, 8.9), Patrick Mahomes (09-09 03:57 UTC, by hand, 8.6), Zach Bryan (09-10 10:00 UTC, by the publisher, 8.9; `gen:all` failed afterward). Refreshes of live profiles: Adela, and Elizabeth Holmes (the scout's recommended UPDATE, tied to the Nathan Fielder / A24 documentary news).
- Create, night by night: 09-08 and 09-09 queue empty (8 empty nights total since 09-02). 09-10 Arthur Mensch (legacy runner, `perspective_finalize` exit 1, reconciled `needsReview`, no grade). 09-11 Austin Abrams 8.1 (Enneagram 7.5, held). 09-12 Joseph Zada hit max turns. 09-13 Joseph Zada 8.4 (held after the last repair round). 09-14 Tom Rhys Harries research timeout, retry 1/3. Queue now: `tom-rhys-harries` 87, `rod-wave` 86, `ben-shelton` 20 (athletes deprioritized by DJ 09-09); held: `austin-abrams`, `joseph-zada`.
- Manual / uncommitted: Nathan Fielder 7.9 (DB unpublished; the commit says "add" but it is not live). Inde Navarrette 8.1 (v3 run 09-11 01:33, not in the queue, draft and 50 log files untracked). Sandra Bullock refresh 9.0 (needs grade-stability delta + perspective review). Glen Powell refresh (ungraded, unpublished).
- **Release windows are closing:** Austin Abrams' _Resident Evil_ opens 09-18, in 4 days (then _Whalefall_ 10-16). Nathan Fielder's A24 documentary is reported for October. Joseph Zada has until 11-20.
- Publisher blockers 09-08 -> 09-14: unpublished candidates 77 -> 80, `missing_perspective_review` 71 -> 72, `source_standard_failed` 43 -> 47, `content_quality_below_8.5` 26 -> 30, `missing_grade_stability_delta` 33 -> 32, `stale_grade_rubric_v1` 26 -> 25, `missing_content_quality` 13 -> 15, images 9 -> 12. Closest to publish: `tyla` (0.4 delta), `ms-rachel` (8.1, Type 2 anchor, 6th brief), `sandra-bullock`. Persistent one-line noise remains (`alexandr-wang` date `1997-01`, `khabib-nurmagomedov` `http://` citation).

### Blogs — other categories

- Pop-culture **21 unpublished**: 20 are 3+ months old and 1 is 1-3 months. Oldest `aoc-and-the-squad-enneagram-types` 2025-12-15 (273 days). No movement.
- Community 17, enneagram 16, guides 8, topical 1, life-situations 1. Unchanged; no non-people blog file touched since 09-07.
- Sitemap 708 -> **709** URLs (09-11). Crosslink index regenerated 09-12 (187 posts / 166 published, uncommitted). Corpus stats regenerated 09-12 (450 published, uncommitted; the "Drafts in pipeline: 0" quirk persists).

### Distribution / Reddit / Quora / Twitter

- Reddit: no edits since 08-31; 7 of 8 drafts unfired. The r/alphaandbetausers post produced the first-ever anonymous reply opt-in (take 733), and that person has had no reply.
- Distribution assets: 14 unfired, directory untouched since 07-22, oldest 201 days.
- Quora: `docs/quora/sessions/` still only has `README.md`; last log 05-19 (118 days).
- Twitter: no session artifact since 05-19.

### Instagram

- Sessions dark **38 days** (last `2026-08-07_instagram-warmup-2.md`); the engagement-targets doc's last dated append is 08-03.
- `node scripts/check-marketing-content-queue.mjs`: **RED**, identical to the last five checks. Approved/scheduled 0/10, copy-ready 11/15, triaged 19/20, design-ready 2/3, QA 0/2. `queue.json` last commit 08-08 (37 days).
- Still no execution crons; only the `Daily Engagement Reminder` and `Monday Content Batching` text reminders fire. Fifth restore-or-retire ask.

### SEO

- GSC `latest.json` runDate **2026-08-13** (32 days stale). The Ashby / Coogan / Hormozi retrofit 28-day read that was due ~09-09 has no artifact. `seo-content-strategist` still has not been run against the clean T-09 window.
- 09-09 surging-people scout (`docs/content-research/2026-09-09_surging-people-scout.md`): 7 CREATE subjects queued with DJ approval; Elizabeth Holmes UPDATE executed 09-09.

### Outreach / video / coaching

- No new outreach artifact since the 08-04 Nine Mirrors pilot (41 days). Founding-circle tasker + week-1 question unchanged since 09-06; 0 invites.
- One Take ep 1 unfilmed, 51 days after the format decision.
- `/book-session` visits spiked, but growth reads it as bots or link previews; waitlist 0. The Harry Dry audit recommends keeping coaching secondary to homepage participation.

## What changed since 2026-09-07

- **Shipped:** comment ranking phase 2 (09-07); email delivery-health alarm + Enneagram campaign audience guard + login/account return-to fixes (09-09); pipeline v3 + editorial check lib (09-10); account page rebuild and homepage replacement with `HomeLandingV2` (09-10); portrait build-baseline fix (09-09); question purge of 4 questions + 6 category descriptions (09-10, live in DB).
- **Decided (observed from artifacts):** DJ approved 7 scout subjects and deprioritized athletes (09-09). DJ approved the Enneagram type-prompt email and authorized the send (09-10). DJ approved the 4 question removals (09-10).
- **Broke or degraded:** host digest (2 of 7 drafted, 1 reply at 115h); signup confirmation now fails too; homepage gate exposure went to zero after the swap; Tom Rhys Harries research timeout; the Monday chain ran ~5h late.
- **Content:** 3 publishes (DB 447 -> 450); 2 refreshes of live profiles (Adela, Elizabeth Holmes); 7 new or refreshed unpublished drafts (Arthur Mensch, Austin Abrams, Joseph Zada, Nathan Fielder, Inde Navarrette, Sandra Bullock, Glen Powell). None reached the 8.5 bar except Sandra Bullock's refresh (9.0), which is still gate-blocked.
- **Corrected:** the "4 autonomous publishes lost to Node 26" claim from 09-07 and 08-28 is wrong. Those publishes landed; only the regen step after them failed.
- **Did not move:** `EMAIL_FOOTER_ADDRESS`, founding circle, Reddit, Instagram, Quora, Twitter, distribution packets, outreach, One Take, pop-culture, GSC snapshot, perspective-review backfill, publisher Node pin, `contribution.path`.

## Recommendation

**1. Supply the postal address and turn mail on (growth bet #1, third ask).** ~15 min for DJ, then agent execution.

- **What:** give the mailing address for the CAN-SPAM footer (PO box, virtual mailbox, or registered agent). Then set `EMAIL_FOOTER_ADDRESS` in Vercel production and redeploy. Re-arm the 4 errored welcome enrollments and resend signup 208's confirmation. Send one test of the approved Enneagram email to DJ's Gmail and inspect DKIM/SPF/DMARC. Then release the controlled campaign batch (31 eligible, already authorized). Route the `process-sequences` 500 / `stoppedEnrollments` count to Telegram.
- **Why:** one missing value blocks welcome mail, signup confirmation, the approved type-prompt campaign, the founding-circle weekly question, and possibly the anonymous reply email. The address does not exist anywhere in config, which is why this has sat for 12 days.
- **Success (growth's bar):** 0 failures with that error, signup 208 confirmation resent, and all 4 enrollees advanced within 24h.
- **Risk:** duplicate step sends (check `idempotency_key`), and the historical DKIM failure (test first).

**2. Give every take a same-day host reply, starting today with 733, 735 and 737 (growth bet #2).** ~30 min of eng plus ~10 min of DJ replies.

- **What:** add `maxDuration: 300` to `src/routes/api/cron/host-digest/+server.ts` and base the lookback on the last successful digest instead of a fixed 48h.
- **Why:** the only return event in the log came from a DJ reply. The one contributor who left a way to reach them (733) has waited 5 days.
- **Success:** 100% of human takes drafted within 24h, 80% or more replied within 24h, and at least 1 `notification_count > 0`.
- **Risk:** low. First confirm the anonymous reply email is not `marketing`-kind; if it is, #1 must land first.

**3. Decide what the homepage is for, then measure it: restore a live question on `/`, or accept practice-first.** ~5 min decision; measurement goes to `growth-analyst`.

- **What:** either put a live featured question (the old `getHomepageFeaturedQuestion()` load) back inside `HomeLandingV2`, or keep the practice question and tag its click-through to live questions. Either way, have `growth-analyst` split gate exposure by surface before and after 09-10 in next Monday's audit.
- **Why:** `/` was the largest gate surface the week before the swap and has produced zero gate events since. This week's audit did not see it because it doesn't split by surface and `path` is NULL on most contributions.
- **Risk:** changing the homepage again within a week muddies both readings. Deciding now keeps the next audit clean.

Following queue (not ranked above because each is cheaper to batch):

- (a) Pin Node in `scripts/daily-blog-publisher.sh` so `gen:all` runs after each auto-publish, and exit 0 on "no publishable draft" so the Telegram error means something (1-2 lines).
- (b) Decide on Austin Abrams before 09-18: a supervised revision now, or let the first release window pass.
- (c) Instagram restore-or-retire (5th ask).
- (d) The perspective-review backfill fork (5th ask; 72 blocked).
- (e) A GSC refresh plus the overdue retrofit read.

## Open questions for DJ

1. What postal address should go in the email footer? Once it is set, are the 4 welcome re-arms, the signup-208 confirmation resend, and the controlled Enneagram batch (after a header-checked test send) approved as written?
2. Did you mean to remove the live featured question from the homepage on 09-10? Restore a live gate inside `HomeLandingV2`, or keep practice-first and have growth measure the click-through?
3. Host digest: approve `maxDuration: 300` plus the last-success lookback, and will you reply to takes 733 (opted in), 735 and 737 today?
4. Publisher: pin Node 24 in the wrapper so the regen step after each publish runs, and make "no publishable draft" a non-error exit? (Third time this fork has been raised; the framing changed: publishing works, regen does not.)
5. Held drafts with release deadlines: Austin Abrams (8.1; _Resident Evil_ 09-18) and Joseph Zada (8.4, 0.1 short; 11-20). Supervised revision now, or let Abrams' first window pass? Should Inde Navarrette (8.1, manual v3 run, not queued) be added to the queue or held?
6. Confirm the hold on founding-circle invites and the remaining 7 Reddit drafts until #1 and #2 are live, as growth recommends?
7. Standing forks, fifth brief: restore or retire Instagram (38 days dark, queue frozen 37 days), and grandfather or batch-backfill the 72 perspective-review-blocked drafts?

## Assumptions and limits

- Growth numbers are quoted from the 2026-09-14 growth-log entry, not re-derived. The only DB queries this run were read-only: `blogs_famous_people` publish state and `published_at`, `give_first_funnel_events` by day and path, and `page_analytics_visits` on `/` by day.
- The homepage finding is observed at the event level and inferred causally. It covers 3.3 post-swap days, with `path` NULL on most contributions. Some `/` `gate_shown` rows may be impression telemetry from the deleted server load rather than a rendered gate.
- Whether `2ca432d5b` is live is inferred: `main` matches `origin/main`, and Vercel deploys on push. The 09-10 launch check verified a 15:10 EDT deployment directly.
- "`process-sequences` failing every 15 minutes" is the growth audit's inference; no Vercel logs were read.
- Instagram, Quora and Twitter claims come from the repository and the scheduler; no live account was inspected.
- No product code, campaign, post, email, draft, publish flag, queue or external account was changed. Only this brief and `docs/marketing/marketing-log.md` were written.
