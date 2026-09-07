<!-- docs/daily-briefs/2026-09-07_marketing-status.md -->

# 9takes Marketing Status — 2026-09-07

**Unattended weekly run (Monday cron).** Covers 10 days: the scheduled 2026-08-31 brief never ran (`logs/marketing-automation/brief-2026-08-31.log`: `You're out of usage credits`, exit 1). Prior brief: `2026-08-28_marketing-status.md`. Growth freshness gate PASSED: `docs/growth/growth-log.md` newest entry is `### 2026-09-07` (audit exit 0 at 06:08 today); its headline and biggest leak are folded in verbatim below, not re-derived. Supabase MCP failed to connect this session; no DB numbers were re-queried. No draft, flag, packet, email, post, or git state was changed by this run.

## TL;DR

- **Growth headline (verbatim, 2026-09-07 audit):** _"the loop fix shipped four hours after the week closed, the Reddit alpha's only answer was "Pooopin", and the welcome sequence has been silently dead in production since 09-02."_ Cohort week 08-31: 4,489 new visitors (576 search), 0 signups, 2 typed profiles, 4 comments, gate 29 -> 3 = 10.3%, welcome 3 sent / 1 open / 0 click / **4 failed**. Contributor return is now **0 / 28 across six matured cohorts**.
- **Biggest leak (verbatim):** _"the only channel that has produced substantive answers is dead in production, and the fix for the standing leak is live but unmeasured."_ Commit `0f702b7ee` (09-01) added a compliance guard at `src/lib/email/sender.ts:327` that throws when `EMAIL_FOOTER_ADDRESS` is unset; it is set locally, not in Vercel. All 4 live welcome enrollments are `errored` at `failure_count = 3` and the cron has stopped retrying. The same guard blocks `enneagram_type_prompt` and the weekly-question email the founding-circle plan depends on.
- **DJ shipped the entire post-answer loop this weekend** (`7db255b8e`, 09-07 00:21): logged-in reply email default-on with one-click unsubscribe, 5 starter questions with 3 pinned answers each, election questions flagged out of browse, index pagination fixed, host desk + `/api/cron/host-digest` (13:00 UTC daily, first run today), founding-circle tasker + 4 weekly-question drafts (0 invites sent). This closes the 08-28 Recommendation #1 and the 08-24/08-31 growth bet #1. It is running and unmeasured.
- **The content engine is stalled at both ends for the first time.** Create: `backlog-queue.json` has `"queue": []`; six consecutive nights (09-02 -> 09-07) logged `Queue is empty` and produced nothing. Publish: the auto-publisher selected an eligible draft four mornings running (Freddie Mercury, Marcus Aurelius, Aaron Pierre, Jonathan Bailey) and died on the Node 26 engine wall each time; DJ hand-published all four plus five more. Publisher error streak **29 -> 39**. `.nvmrc` (`22`) was added 09-03 but `scripts/daily-blog-publisher.sh` still calls bare `node`; the fix is unverified because nothing eligible has run since.
- **First external distribution action in months, and it was not logged here.** A `reddit/` directory (8 sequenced post drafts, 08-30) exists; #05 r/alphaandbetausers fired ~09-03 with `utm_campaign=alpha_beta_answer_first_20260831`, delivering 6 fingerprints to q567 -> 1 contribution ("Pooopin"). Attribution worked; volume and quality did not. 7 of 8 drafts unfired.
- **Everything else is still dark:** Instagram 31 days (last session 08-07; queue RED 0/10 approved, frozen 30 days; zero execution crons), Quora 111 days, Twitter no artifacts since 05-19, 14 distribution assets unfired (oldest 194 days), outreach silent 34 days, One Take ep 1 unfilmed 44 days, GSC snapshot 25 days stale.

## The actual work — the loop is built; the mail pipe is off

Ten days of shipping moved the product from "no return leg" to "return leg live, unmeasured." The one thing standing between the shipped loop and any readout is a missing production env var, and the same var gates every marketing-kind email the next four weeks depend on.

| Component                                | State (observed)                                                                                              | Blocker                                                                      |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Welcome sequence                         | 4/4 enrollments `errored`, 0 sends since 09-02 06:15 UTC                                                      | `EMAIL_FOOTER_ADDRESS` unset in Vercel; enrollments need re-arming           |
| Reply email (logged-in)                  | Shipped 09-07, `transactional` kind, not blocked by the guard; 188 `notifications` rows all `email_status='none'` (backfill) | None; awaits first organic reply                                             |
| Host digest + `/host-desk/[token]`       | Cron registered `0 13 * * *` in `vercel.json`; 0 `host_reply_drafts` yet                                       | First run is today; DJ must approve drafts from the phone page               |
| Starter set + pinned reveal              | Live: q118, q119, q203, q137, q567 with 3 pins each; q98/q168 flagged out                                     | None                                                                         |
| Founding circle (10 members, 4 weeks)    | Tasker + invite copy + week-1..4 question drafts written 09-06; 0 invites sent                                | DJ-gated send; weekly-question email is `marketing` kind -> hits the guard   |
| `enneagram_type_prompt`                  | Still `draft`, 0 enrollments (76 permissioned addresses)                                                       | Same guard                                                                   |
| `contribution.path` NULL                 | Still 2 of 4 events this week                                                                                  | Unshipped; readout for bet #2 will be hand-reconstructed without it          |
| Reddit alpha                             | Fired ~09-03 on q567; 6 fps -> 1 low-effort answer                                                             | Growth says re-run only after the env fix, landing on q118 not q567          |

Growth's ranked bets for the week, verbatim in intent: (1) restore welcome delivery today and add an errored-enrollment alarm; (2) run the shipped loop as one named experiment over 4 weeks / 10 contributors with a fixed readout; (3) re-run the Reddit alpha only after 1 and 2, landing on a light starter. This brief adopts that order and adds the content-engine repair as a parallel track because it is independent work.

## Tooling state

- **Weekly wrapper: second credit blackout.** 08-31 marketing brief failed on `You're out of usage credits` (08-10 was the first). The growth audit was re-run by hand at 18:26 that day and succeeded; the brief never was. Today's run started 06:08 after the audit.
- **Nightly create is idle, not broken.** `nightly-blog-cron.sh` ran cleanly every night and correctly reported an empty queue; it also reconciled `naval-ravikant` on 09-02 (draft existed, queue never updated, marked `needsReview`). Week counter reset 09-06 (`currentWeekCount: 0`). Refill is a doc edit, not a code fix.
- **Publisher runtime fork is 10 days old and cost 4 autonomous publishes.** The 08-28 brief's Recommendation #2 (Node 24 on the gateway PATH or pin in the wrapper) was not actioned in a way the wrapper can see: `scripts/daily-blog-publisher.sh` (last commit 07-27) still runs `node scripts/personBlogParser.js --publish` with no PATH or nvm handling. `.nvmrc` = `22` landed 09-03. Whether the OpenClaw service now resolves a compliant Node is **unverified**; the last `pnpm gen:all` attempt (09-01) failed on v26.5.0.
- **OpenClaw state:** 9 jobs. Blog create (02:00), watchdog (03:30), publisher (06:00), weekly marketing (Mon 06:00), plus reminders/cost reports. Zero Instagram execution jobs; no Quora job. `Monday Content Batching` (10:00) and `Daily Engagement Reminder` (09:30) are `systemEvent` reminders only.
- **New marketing tooling, unexercised:** `.codex/skills/social-media-slam` (OODA-style account audit) and `.codex/skills/social-media-onboarding` (08-30). `docs/data/gsc/experiments/2026-09-01-friedberg-baseline.json` proves a fresh GSC pull works; the general `latest.json` snapshot (runDate 08-13) was simply not refreshed.
- **Product/security (note only, not my surface):** 09-03 security audit + 3 RLS/access-control migrations; P0 email compliance + P1 delivery-tracking migrations 09-01; Resend sender + webhook + `process-email-events` cron (*/5) added alongside the Gmail path. The footer guard is a side effect of the P0 compliance work.

## Cross-surface status

### Growth and email

- Headline, leak, and bets folded verbatim above. Additional observed facts from the 09-07 entry: search-attributed new visitors 514 -> 576 (+12%); the 417-person `internal` bucket vanished after the 09-05 fallback fix; two small classifier bugs (qwant/yandex -> `social/x`, `utm_source=chatgpt.com` -> `direct`); 0 new questions since 08-14; the 08-31 Type 9 registrant made 8 later visits including `/questions/create` and posted nothing.
- Reactivation: dormant `draft`, zombies `paused` (16 stale active rows), cold idle. Coaching waitlist 0 adds; `/book-session` saw 4 tagged visits.
- Full evidence: [`docs/growth/growth-log.md`](../growth/growth-log.md) `### 2026-09-07`.

### Blogs — people

- Disk: **438 published / 88 unpublished** (+9 since 08-28: Freddie Mercury, Hailee Steinfeld, Jared Kushner, Olivia Cooke, Marcus Aurelius, Aaron Pierre, Jonathan Bailey, Demis Hassabis, Nate Bargatze). All nine were hand-published. DB corpus snapshot regenerated 09-07: **447 published profiles**; it reports "Drafts in pipeline: 0", which contradicts the 88 unpublished disk drafts and the 08-28 snapshot's 128 — treat the pipeline figure as a generator quirk until checked.
- New drafts since 08-28: Cara Delevingne, Demis Hassabis, Freddie Mercury, Laura Loomer, Naval Ravikant, Rebecca Yarros, Zach Bryan. Grades on record: Zach Bryan 8.9 (images only), Freddie Mercury 9.0 (published), Rebecca Yarros ungraded after a ~49 min run (likely aborted), Naval Ravikant reconciled/needsReview.
- Publisher blocker snapshot 09-07 (was 08-27): `missing_perspective_review` 83 -> **71**, `source_standard_failed` 46 -> 43, `content_quality_below_8.5` 35 -> 26, `missing_grade_stability_delta` 35 -> 33, `stale_grade_rubric_v1` 27 -> 26, `missing_content_quality` 13, images 14/14 -> **9/9**. Closest to publish: `zach-bryan` (images only, 8.9), `bill-burr` (contrast-pair cap), `patrick-mahomes` (needs review), `tyla` (0.4 delta), `ms-rachel` (8.1, Type 2 anchor, 5th brief).
- Perspective-review dirs 34 (08-24) -> **49**; all 8 added since 08-28 went to new nightly drafts. **Zero backfill, fourth brief carrying the fork.** The 71 falls only by publishing out from under it.
- Publisher persistent noise: `alexandr-wang` rejected non-ISO date `1997-01`; `khabib-nurmagomedov` citation rejected for `http://` URL. Both are one-line frontmatter fixes that would stop two warnings per run.

### Blogs — other categories

- Pop-culture: **21 unpublished** (18 top-level + 3 in `epstien-research/`). 17 of 18 real drafts are 3+ months old; oldest `aoc-and-the-squad-enneagram-types` 2025-12-15 (265 days). No pop-culture publish since 08-22; `ghislaine-maxwell-psychology` (live) was touched 09-01.
- Community: 17 unpublished, including NEW `drafts/the-world-is-burning-shared-agency.md` (2,382 words, 08-30/31) — the T-37 information-diet campaign draft (`docs/taskers/T-37-social-reckoning-information-diet-campaign.md`, 08-29). Enneagram 16, guides 8, topical 1, life-situations 1.
- Sitemap 705 -> **708** URLs, regenerated 09-07 00:17; no pop-culture drift. Crosslink index regenerated 09-07 (187 posts, 166 published).

### Distribution / Reddit / Quora / Twitter

- **Reddit is live as a channel and undocumented in this log.** `reddit/README.md` (08-30) sequences 8 posts with positioning guardrails ("not a personality test", "less socially influenced is a hypothesis"). #05 r/alphaandbetausers (edited 08-31) points at `https://9takes.com/link/567` and asked for reply-notification feedback. Outcome per growth-log: 6 fps, 4 bounced <=5s, 2 hit the gate, 1 contributed in 20 seconds, 1 hit `/register` twice and never registered. 7 drafts remain: r/Enneagram organic + modmail + product-feedback, r/SideProject, r/indiehackers, r/startups, r/AskReddit.
- Distribution assets: 9 `*-distribution.md` + 5 carousel/Instagram packets, all unfired; oldest 194 days (Benson Boone, Chris Williamson, Shawn Ryan, 02-25). Directory untouched operationally since 07-22 (the 08-30 commit was Prettier).
- Quora: `docs/quora/sessions/` holds only `README.md`; question-log and cron logs end 05-19 (**111 days**); no OpenClaw job.
- Twitter: no session artifact since 05-19.

### Instagram

- Sessions dark **31 days** (last `2026-08-07_instagram-warmup-2.md`); warmup logs end 08-10; engagement-targets last substantive append 08-07 (08-30 touch was formatting).
- `node scripts/check-marketing-content-queue.mjs`: **RED**, unchanged since 08-03 — approved/scheduled 0/10, copy-ready 11/15, triaged 19/20, design-ready 2/3, states briefed=8 copy_ready=9 design_ready=2 published=1 blocked=1. `queue.json` last commit 08-08 (30 days frozen).
- No execution crons. Fourth consecutive brief asking restore-or-retire.

### SEO

- GSC `latest.json` runDate **2026-08-13** (25 days stale). A targeted 28-day pull was captured 09-01 for David Friedberg (9 clicks / 700 impressions / position 16.5; `wife` query family on page one of content-farm slop). GSC access works; the snapshot was not refreshed.
- Entity-gap scout 09-01 (`docs/content-research/2026-09-01_emerging-entity-gap-scout.md`): Dylan Patel CREATE score 83, **on hold at DJ's direction**; Friedberg unsourced family claim FIXED 09-01; Ashby/Coogan/Hormozi retrofit 28-day read due **~09-09**; Dario Amodei PROTECT (do not optimize a rumor). The scout also recorded its own false-alarm correction (inferred ship-state from `lastmod`/`title:` instead of `retrofit_applied_at`), consistent with the 09-01 memory rule.
- No `feat(seo)`/`docs(seo)` commit prefixes in 14 days; all commits are titled `updates`. `seo-content-strategist` still has not been run against the clean T-09 window.

### Outreach / video / coaching

- No new outreach artifact since the 08-04 Nine Mirrors pilot (34 days). Founding-circle invite copy is the nearest thing to a live outreach asset: 30-35 warm asks -> 8-10 members, sent in one 48-hour window, 0 sent.
- One Take ep 1 unfilmed 44 days after the 07-25 format decision. `docs/marketing/peter-thiel/peter-thiel-tiktok-story-arc.md` and the 08-29 upcoming-movie intelligence doc are new research, not distribution.
- `src/routes/book-session/` touched 09-03 (spec added alongside the security work); waitlist 0 adds this week.

## What changed since 2026-08-28

- **Shipped:** the whole post-answer loop (`7db255b8e`): reply email default-on, starters + pins, election flags, pagination fix, host desk + digest cron, `/admin/host-desk`, curation panel. Founding-circle tasker + weekly-question drafts. Engagement brainstorm (09-04) + data-backed response (09-06). P0/P1 email compliance + delivery-tracking migrations, Resend sender/webhook, one-click unsubscribe (09-01). Security audit + 3 migrations (09-03). Acquisition-source fallback fix (09-05).
- **Broke:** welcome sequence (09-02, env var); 08-31 weekly brief (credits); nightly create (queue empty 09-02 onward); publisher (4 eligible drafts lost to Node 26, streak 29 -> 39).
- **Fired externally:** Reddit r/alphaandbetausers post (~09-03), first tagged distribution ever. 7 of 8 Reddit drafts unfired.
- **Content:** 9 hand publishes (429 -> 438 disk; DB 447), 7 new people drafts, 1 new community draft (T-37), 8 new perspective-review dirs (0 backfill), Friedberg fix, images 14 -> 9.
- **Did not move:** Instagram, Quora, Twitter, distribution packets, outreach, One Take, pop-culture (21), `enneagram_type_prompt` (draft), `contribution.path` (NULL), perspective-review backfill fork, GSC snapshot.

## Recommendation

**1. Turn the mail back on today (growth bet #1, adopted).** Set `EMAIL_FOOTER_ADDRESS` in Vercel production, re-arm the 4 errored welcome enrollments (`status='active'`, `failure_count=0`, `next_send_at=now()`), and add a `count(status='errored')` surface to `process-sequences` or the daily digest. ~15 min. Impact: restores the only channel that has produced substantive answers, and unblocks the type prompt and the founding-circle weekly question in the same stroke. Risk: duplicate step sends — check `idempotency_key` after the first cron pass. Growth's success bar: 0 `failed` sends with that error and all 4 enrollees advanced within 24h.

**2. Restart the content engine at both ends in one sitting.** (a) Refill `docs/blog-automation/backlog-queue.json` — it is `[]`; six nights lost. Cheapest source is `/find-surging-people` or the 09-01 scout (Dylan Patel is on hold pending your word). (b) Pin the runtime in `scripts/daily-blog-publisher.sh` (`export PATH="/opt/homebrew/opt/node@24/bin:$PATH"` or an nvm source line) so the wrapper no longer depends on the gateway's PATH, then dry-run `pnpm gen:all` under it. ~30 min total. Impact: `zach-bryan` (8.9, images only) is the first autonomous publish the moment its portrait lands; 4 hand-publishes in 4 days says the valve is worth more than the supply right now. Risk: none visible; the wrapper change is 1-2 lines.

**3. Send the founding-circle invites in a 48-hour window once #1 is verified, and run the loop as one named experiment (growth bet #2).** Copy and candidate query are in `docs/growth/founding-circle/00-TASKER.md`; week-1 question is q569. Fix `contribution.path` in the same change so the 4-week readout (>=8/10 host replies within 24h, >=2/10 return >24h in 7d, >=1 second contribution, q567 share <50%) is not hand-built. This is the only item that converts the weekend's shipping into a measurement. Hold the remaining 7 Reddit drafts until this is running; growth's bet #3 wants the next alpha landed on q118, not q567.

Following queue, unchanged: Instagram restore-or-retire (4th ask); perspective-review backfill fork (4th ask); refresh the GSC snapshot and run `seo-content-strategist` once, since the 09-09 retrofit read is due.

## Open questions for DJ

1. Has `EMAIL_FOOTER_ADDRESS` been set in Vercel production since the 06:08 audit? If not, is the re-arm SQL in growth bet #1 approved as written?
2. Create queue is empty. Approve a refill source: `/find-surging-people` run, the 09-01 scout list, or a hand list? Is Dylan Patel still on hold?
3. Publisher runtime: pin Node in the wrapper (recommended, 1-2 lines, repo-owned) or fix the OpenClaw gateway PATH? Same fork as 08-28 Q2; it has now cost four autonomous publishes.
4. Founding circle: go for the 48-hour invite window this week? Which Monday is week 1?
5. Reddit: hold the 7 remaining drafts until the loop experiment is running, per growth bet #3? Should the r/alphaandbetausers thread get a follow-up reply from you (the poster promised to return the favor)?
6. Instagram: 31 days dark, queue frozen 30 days, zero execution crons. Restore one native Reel cadence or formally retire the queue and both reminder jobs.
7. Perspective-review backfill: grandfather pre-08-04 drafts or authorize a batch `--resume` campaign? 71 finished drafts remain unreachable by the publisher.
8. Weekly wrapper: two credit blackouts in four weeks. Add a pre-flight credit check with a fallback model, or accept manual re-runs?

## Assumptions and limits

- Growth numbers are quoted from the 2026-09-07 growth-log entry, not re-queried; Supabase MCP failed to connect this session and `scripts/db-query.sh` was not run.
- Disk counts (`published:` flags, queue JSON, logs, sitemap) were read directly this run. DB corpus figures come from `docs/data/corpus-stats.md` generated 09-07 04:17.
- The Reddit post's fire date (~09-03) is inferred from growth-log pageview dates and the 08-31 edit; the exact post URL is not recorded anywhere in the repo.
- "Publisher fix unverified" means no eligible draft has exercised `pnpm gen:all` since the Node failure on 09-01; the wrapper source is the only direct evidence and it is unchanged since 07-27.
- Instagram, Quora, and Twitter claims are repository and scheduler observations; no live account was inspected.
- No product code, campaign status, post, email, draft, publish flag, or external account was changed by this run. Only this brief and `docs/marketing/marketing-log.md` were written.
