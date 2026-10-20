<!-- docs/daily-briefs/2026-10-19_marketing-status.md -->

# 9takes Marketing Status — 2026-10-19 (Monday, unattended weekly brief)

**BLUF:** The fix build is live and working: q118 is on celebrity pages and the homepage posts in one step. This week is its baseline. Readers are not the constraint. Unanswered contributors are. Sixteen takes sit on the desk, the last host reply was 16 days ago, and only DJ can clear it. Do that first. Then pre-approve the q118 fallback so a failed prompt doesn't cost a second week.

## TL;DR

- **Growth data is fresh (audit 06:00 -> 06:07 today; gate passed).** Headline, verbatim: _"the second-best traffic week in 26 (773 engaged humans, 40 returning) produced 1 take. Every gated surface except question pages went to zero, celebrity pages showed q567 to 110 readers for no answers, and the one contributor got no reply. The 10-18 fix build is live as of ~21:00 ET Sunday, so this week is the baseline it has to beat."_
- **Biggest leak, verbatim: _"the ask, not the audience."_** 773 engaged humans -> 1 take (1.3 per 1,000, vs 13.3 in the summer band). Celebrity q567 closes at 233 -> 1 since launch and is retired (T-41 C readout: lost).
- **I verified the fix build live at 06:07.** `/personality-analysis/jack-black` now asks q118 ("What were you like as a kid in 3 words?") with no q567 text. The homepage shows the one-step "Post anonymously and read answers." q118 so far: 3 readers -> 0 takes. Kill rule (growth): 0 takes after ~100 gate fingerprints, about a week.
- **Replies are still blocked on DJ, for the 4th straight audit.** `host_reply_drafts` shows 16 pending and 1 posted lifetime (re-queried today). The last host reply was 10-03. There are 3 reply opt-ins (including 743 and 749) and none has been notified. The digest backlog-alarm fix gets its first real run at 09:00 ET today, after this brief.
- **Content engine: 7 nightly v3 runs -> 1 pass -> 0 publishes.** Ella Beatty passed. Five subjects were held for revision, and Christopher Abbott failed this morning at the 100-turn verify cap. Madonna (10-13, by hand) was the only publish (DB 453). Ilya Sutskever (8.7) is ready except for a portrait. **New pattern:** 5 of the 15 people rows created since 10-01 are typed 6 (33%), against 12% of the live corpus.
- **Parked, with no change since 10-12:** Instagram (RED 0/10; last session 08-07), Quora and Twitter (05-19), The Nine, One Take. Enneagram Monthly invited a draft 10 days ago and nothing has been written.

## The actual work: the post-answer loop, now on new prompts

The 10-18 investigation and fix build changed the ask. Nothing has changed the reply leg yet. Whether this week moves depends on two things: whether q118 and the one-step homepage produce takes, and whether anyone answers them.

| Artifact                                                      | State (observed today unless noted)                                                          | Owner        | Next                                                                                                         |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------ |
| Celebrity prompt q118 (bundled AI examples, `three_words_v1`) | Live; verified on Jack Black's page 06:07. Growth: 3 readers -> 0 takes since 10-19 01:53 ET | growth       | Daily read. Success: >=3 contributors/week for 2 weeks and gate -> take >=3%. Kill: 0 takes at ~100 gate fps |
| Homepage one-step post (v2)                                   | Live; "Post anonymously and read answers" in production HTML                                 | growth       | Read started -> `comment_created` >=40%, against engaged `/` visitors (gate counts broke 10-18)              |
| Host desk (`host_reply_drafts`)                               | 16 pending / 1 posted lifetime; last reply 10-03                                             | **DJ**       | Reply to 743 + 749 (opt-ins), 754 (registrant), 759 (newest)                                                 |
| Host digest backlog alarm                                     | Fix deployed; 6 of last week's 7 runs logged `olderPending` 0 (the bug)                      | growth / eng | 09:00 ET run should log `olderPending` >=16 with `alarm` true. If not, the fix didn't land                   |
| Signup 211 confirmation                                       | Failed 10-05, not resent (14 days)                                                           | DJ / eng     | Resend (growth bet #3)                                                                                       |
| Beta card (`beta_card_v1`)                                    | 532 viewers -> 26 opened -> 0 submitted this week; 1 of 10 toward the 11-15 goal             | **DJ**       | Decide: keep, change the card, or reset the goal (Q5)                                                        |

## Tooling state (changes only)

- **Fix build** (committed as `0ec5387dd`, 10-18 21:28; `main` = `origin/main`): one-step homepage post, celebrity q118 default with bundled examples, `chorus_*` + newsletter funnel events, weak-password 400, digest backlog accounting + alarm, social-card font fix. The behavior is live (verified). Which commit Vercel is serving is unverified.
- **Earlier this week:** person-suggestion spam block + async Turnstile (`8ebeeb349`, `50dd490f4`, 10-14); session verification change (`7923dfc6f`, 10-16).
- **v3 pipeline strain:** every edit stage this week hit the 60-turn cap and resumed. Christopher Abbott's verify-repair hit the 100-turn cap after 2,701 s (`FAILED_AT_STAGE: verify-repair: Stage timed out`). The "wrapper likely killed post-pipeline" reconcile fired again for Ella Beatty. That's the third time in 10 days (Ilya 10-10, Stella 10-12, Ella 10-19).
- **Weekly Crosslinks (Thu 10-15):** OK. 12 links across 10 posts, gate debt 0 -> 0, 150 live posts, 0 broken.

## Cross-surface status

### Blogs

- **People DB:** 453 published / 146 unpublished (10-12: 452 / 139). Madonna went live 10-13. It came through the legacy chain, graded B+ 8.5 on rubric v2, published by hand.
- **Nightly v3 create (02:00), all 7 nights ran:**
  - 10-13 Shyam Sankar: revise, 7.9 overall. Held.
  - 10-14 Sienna Spiro: the editor moved the lead from 4 to 2 after the jury had reviewed it. Held.
  - 10-15 Mike Faist: 8.3. Held.
  - 10-16 Grace Reiter: factual error (says Soresi was in _Ginger Twinsies_). Held.
  - 10-17 Dylan Patel: dating error in the 7-vs-8 argument. Held.
  - 10-18 Ella Beatty: Open Case, verify pass.
  - 10-19 Christopher Abbott: 8.0 (evidence 7.5, Enneagram 7.5), then failed at verify-repair. The draft and run folder are untracked. The queue still lists him `inProgress`.
  - The held list is now 10.
- **Publisher (06:00):** "No publishable draft" on all 7 days, 10-13 -> 10-19. 96 candidates. Blockers: missing_perspective_review 70, source_standard_failed 46, content_quality_below_8.5 39, missing_grade_stability_delta 31, stale_grade_rubric_v1 25, missing images 21, editorial_v3 20.
- **Closest to live (read-only `--publish-check`, run today):**
  - **Ilya Sutskever (8.7): images only.**
  - Ella Beatty and Stella Lefty: `editorial_v3:stale_or_invalid_release` plus missing images. The release hash no longer matches the draft. Inferred fix: `--phase finalize`, then a portrait.
- **Type 6 skew (observed counts, inferred bias):** Of the 15 people rows created since 10-01, 5 are typed 6: Maleah Joi Moon, Lily-Rose Depp, Grace Reiter, Shyam Sankar, Ella Beatty. Christopher Abbott's draft makes 6 of 16. The live corpus is 54 of 453 (12%). The pipeline's own 10-18 reviewer flagged Ella Beatty as "the sixth young-performer draft in a row to lead with Type 6, using the same argument."
- **Queue hygiene:** 10 subjects left. **Dakota Johnson is live (published 10-09) but still in the create queue at priority 84.** At the current priority order and the 5-per-week cap, she would be selected around 10-22 02:00 (inferred). Per memory, create-mode duplicate detection is weak.
- **MDsvex:**
  - Pop-culture: 20 not live (17 `published: false` + 3 flagless), all 3+ months old, oldest `aoc-and-the-squad` at 308 days. Unchanged.
  - Enneagram: 10 unpublished. Guides: 2. Community: 1.
  - The generic-rewrite worklist touched 8 enneagram/community posts and 2 pop-culture posts on 10-13 and 10-15 (memory: toxic-traits 33% -> 15%, strengths-and-weaknesses 29% -> 9%).
  - The crosslinks run flagged 3 typing mismatches in the leadership post: Nadella used as a 9 (his page says 5), Jobs as a 4 (page says 1), Bezos as a 3. The first two have been open since 10-01.

### Distribution and social

- **Parked:** Instagram, Quora, Twitter, The Nine and One Take (default I proposed 10-12; no objection on record). Instagram queue check today: RED, 0/10 approved, `queue.json` last committed 08-08, last session 08-07. Quora and Twitter last logs 05-19. The Nine run-log 09-22. One Take ep 1 unfilmed.
- **Distribution packets:** 10 unfired, unchanged. The newest is the be-gentle promo set (10-04).

### SEO

- GSC exports stop at 10-03 (16 days). The T-41 A readout is still unstarted, 9 days past its 10-10 gate.
- Sitemap, corpus stats and crosslink index were regenerated 10-18 16:51.

### Growth

- Folded from today's audit (not re-derived):
  - Engaged landings by surface: celebrity 387, search 528, direct 192.
  - The only take (759) came from a Google reader who answered on a question page.
  - Returning contributors: 0 for a 4th week (4 in 25 weeks).
  - Signups 0, registrations 0, bookings 0.
- 10-18 bets: replies **not done**; celebrity prompt **done**; defects + instrumentation **done except the 211 resend**.

### Outreach

- **Enneagram Monthly:** the editor invited a draft 10-09 (Word, charts welcome, no deadline). Not written or submitted. Day 10.
- The 10-06 follow-up window (10-11 -> 10-13) has passed. Whether follow-ups went out is unverified (Gmail not inspected). 10 pitch drafts were unsent as of 10-12.

### Email and coaching

- Mail is healthy: 3 welcome sends, 0 failed, 0 opened (growth). 0 active welcome enrollments, because there were 0 registrations.
- The `enneagram_type_prompt` sequence is still `draft` (approved 09-10, 0 sends). The 16 reactivation enrollments are still paused.
- `coaching_waitlist`: 0 new since 10-12 (last row 10-08). The beta goal stands at 1 of 10 with 27 days left.
- No commits this week touched `src/routes/book-session`, `src/lib/email` or cron routes.

## What changed since last brief

**Since the 10-18 investigation brief:**

- The fix build shipped (local -> live). I verified it this morning.
- The partial-week numbers became the final week: 632 -> **773** engaged humans, and still 1 take.
- Ella Beatty passed verify, but her release went stale. Christopher Abbott failed at verify-repair.
- Publisher candidates went 95 -> 96 and image blockers 20 -> 21.
- The desk is unchanged: 16 pending, 0 replies.

**Since the 10-12 weekly brief:**

- **10 commits**, all pushed. They include the conversion-fix build, the person-suggestion spam fix, the session verification change, and the generic-rewrite worklist plus readability/AI-detector audits (memory 10-12 -> 10-13).
- **10-12 recommendations:**
  - #1 seeds: **closed differently.** DJ shipped q118 with bundled AI examples instead of DB seeds.
  - #2 desk replies: **not done** (now 4th audit).
  - #3 Enneagram Monthly: **not done**.
- **Experiments:** celebrity q567 lost. Homepage two-step v1 lost and was superseded. q118 and homepage v2 have run since 10-18/19. Both 4-week clocks restart 10-19.
- **Content:** DB 452 -> 453 (Madonna). 7 v3 runs, 1 pass. The held list grew to 10.
- **Unchanged:** carried typing calls (Dario 5 -> 6, Druski 8 -> 3, the Mark-Fischbach / Markiplier duplicate, the Greg Brockman draft flagged `published: true` while its DB row is unpublished), perspective-review backfill (70), Node pin for the publisher, T-44 migration.

## Recommendation

**1. Reply to the four people waiting, today. Then check the 09:00 digest.** About 15 minutes of DJ time. Expected impact: the only recorded loop turn followed a DJ reply, and 3 opt-in authors finally get the notification they asked for. Visible risk: none.

- **What:** post replies to 743 and 749 (email opt-ins), 754 (the registrant) and 759 (newest, returned to the site within 21 h). Do this from `/admin/host-desk`.
- **Why:** this is growth's bet #2. It has been a top bet for four audits with 0 done. The new prompts will produce takes into the same silence unless the reply leg runs.
- **First step:** open `/admin/host-desk` and start with 749. After 09:00 ET, confirm the digest logged `olderPending` >=16 with `alarm` true.

**2. Pre-approve the q118 fallback now, so the kill rule can act without waiting on you.** About 1 minute to decide. Lean version: nothing is built until the rule fires (~10-25). Ambitious version: an agent builds the on-topic "What's your read on {person}?" prompt behind a flag this week (~1–2 h agent time, DJ reviews the diff), and the swap becomes a config flip. Risk: a small build that may never be used.

- **Why:** q567 burned 16 days and 233 readers before it was replaced. q118's kill rule (0 takes at ~100 gate fps) lands in about a week. Without a pre-approved fallback, a failure costs a second week.
- **First step:** answer Q2 below. If you approve the ambitious version, delegate the build and have `growth-analyst` own the daily read.

**3. Get the Enneagram Monthly draft written.** An agent drafts (~1 h) and DJ reviews and sends (~30–45 min). Expected impact: the only open editor yes, and a trade-press backlink on core terms the 10-06 map found link-limited (~25k impressions at position ~35). It's also an FDE story: a trade-press data article built from an agent-maintained corpus. Risk: low. The invite has no deadline, but it ages.

- **First step:** approve the draft in Q6. The writer works from `docs/outreach/2026-10-09-enneagram-monthly-preparation.md` with one dated corpus snapshot (453).

**Next in line, about 10 minutes:** Ilya Sutskever is ready except for a portrait. One portrait from DJ in ChatGPT, then `scripts/prepare-personality-image.sh`, publishes an 8.7 page in the AI cluster.

## Open questions for DJ

1. **Replies:** will you clear 743, 749, 754 and 759 today? If a daily reply slot won't hold, who else can reply in your voice? (Automatic replies stay off.)
2. **q118 fallback:** if q118 gets 0 takes at ~100 gate fingerprints, may it swap to "your read on {person}" without another check-in? And lean (build on kill) or ambitious (build now behind a flag)?
3. **Dakota Johnson in the create queue:** she has been live since 10-09 but is queued at priority 84, likely selected around 10-22. Remove her before then? I did not edit `backlog-queue.json`, because the cron has it modified in the working tree.
4. **Type 6 skew:** 6 of the last 16 new subjects are typed 6, three times the corpus rate. Do you want a calibration check on the v3 typing stage before the next batch? That would be a scripted type-distribution audit plus a read of the Enneagram reviewer prompt.
5. **Beta card:** 1 of 10 signups with 27 days left; 0 submits from 532 viewers this week. Keep it, change the card, or reset the goal?
6. **Enneagram Monthly:** may a writing agent draft it this week for your review? Second ask: may the corpus chart be drawn by a plotting script? It is not an image model, but the rule is yours.
7. **Ilya Sutskever portrait:** do you want me to hand you the portrait prompt in your house style? And should Ella Beatty and Stella Lefty get `--phase finalize` release refreshes so they're portrait-only too?

Standing and parked unless you say otherwise: Instagram, Quora, Twitter, The Nine, One Take; perspective-review backfill (70); typing calls (Dario, Druski, Mark-Fischbach, Greg Brockman); publisher Node pin; T-44 migration; signup 211 resend (delegable).

## Evidence and assumptions

- **Observed this run:**
  - Growth log `### 2026-10-19` and `logs/growth-automation/audit-2026-10-19.log` (exit 0, 06:07).
  - Read-only `scripts/db-query.sh`: people counts and recent rows, type distribution, `host_reply_drafts` status, `coaching_waitlist`.
  - Read-only production GETs of `/` and `/personality-analysis/jack-black`.
  - `node scripts/personBlogParser.js --publish-check` for three slugs (read-only).
  - Cron logs `cron-2026-10-13..19`, publisher logs, crosslinks log 10-15.
  - `check-marketing-content-queue.mjs`; git log since 10-12; a working-tree vs HEAD diff of the queue.
- **Not checked:** Gmail (outreach follow-ups), PostHog, Vercel deployment list (live commit), the 09:00 ET digest run (it hasn't happened yet), and live Instagram/Quora/Twitter accounts.
- **Inferred:**
  - Dakota Johnson's selection date assumes the nightly picks by priority under the 5-per-week cap.
  - The `--phase finalize` fix for stale releases comes from a memory note, not this run.
  - The Type 6 skew is a count; whether it's model bias or a real pattern in young-performer subjects is unestablished.
- **Untouched:** no drafts, flags, queue files, git state or external services. The untracked Christopher Abbott draft and run folder, the modified `backlog-queue.json` and the growth-log edits belong to other processes.
