<!-- docs/daily-briefs/2026-09-28_marketing-status.md -->

# 9takes Marketing Status — 2026-09-28

**Unattended weekly run (Monday cron).** This covers 7 days; the prior brief is `2026-09-21_marketing-status.md`. **The growth freshness gate passed.** The newest entry in `docs/growth/growth-log.md` is `### 2026-09-28` (the audit ran 06:00 -> 06:09:06 today and exited 0; the Monday chain was on time). Its headline and biggest leak are quoted below, not re-derived. The Supabase MCP failed to connect for the fourth week. DB reads this run were read-only `scripts/db-query.sh` queries: people publish counts and `blogs_famous_people_history` since 09-21. I made two read-only HTTP GETs to production to confirm what is deployed. This run changed no draft, publish flag, packet, email, post, campaign, queue or git state. `git status` shows DJ mid-work on the admin dashboard (`src/routes/admin/+page.svelte` staged, plus HyperPlexed admin-audit docs); I touched none of it.

## TL;DR

- **Growth headline (verbatim, 2026-09-28 audit):** _"contributions went 9 -> 0, the first empty week since July. The one repeat contributor in the log came back, reloaded their own unanswered question nine times, lost their session, never got a reset email, and has not been seen since 09-22. The four takes owed a reply last week are still unanswered after 8 days. The host desk has been dead 16 days, mail has been off 26 days, and the new homepage is live but still sends nobody to a gate."_ Cohort week 09-21: 4,391 new visitors (651 from search, the most since 08-03), 459 engaged new, returning active 1.50%, 1 signup, 0 profiles, **0 takes**, gate 30 -> 0. Contributor return is now **0 / 34 across eight matured cohorts**.
- **Biggest leak (verbatim):** _"a contributor came back and found nothing, so they left. The one user the loop ever retained returned 13 times in 2 days. Nine of those loads were their own question, which nobody had answered. Their three takes had no replies, and they had no way back into their account."_
- **Growth's #1 bet has gone unshipped three weeks running, and the mail ask is on its fifth round.** I confirmed from git that no commit since 09-21 touches `src/routes/api/cron`, `hostDigest.ts`, `src/lib/email`, `giveFirstFunnel.ts` or `src/routes/forgotPassword`. `host-digest/+server.ts` still has no `maxDuration`, and `EMAIL_FOOTER_ADDRESS` is still an empty string in the local env. The fix is about 15 minutes of DJ replies plus ~45 minutes of engineering. It keeps losing to bigger builds.
- **DJ's week went to 11 shipped commits, and none of them was the loop.** Personality-page ISR is live (production returns 200 with `x-vercel-cache: HIT`). The cross-link system shipped: a lint+CI gate, a weekly OpenClaw job, and 371 links, including a people-to-people pass that synced **139 live DB rows** on 09-25. Gate debt went 66 -> 2. Also shipped: the question-page rewrite with `ReplyOptInTray`, the "Talk to DJ" `/book-session` rebuild, homepage V2 Tier 1+2 (live), The Nine Reddit playbook and harness (never run live), and a fresh GSC pull (09-24). The opt-in tray and the homepage now promise replies that the dead host desk can't deliver.
- **The content engine sat idle all week.** The create queue has been **empty 8 nights straight**. The publisher logged "No publishable draft" 8 of 8 days with the same blocker counts every day, and there have been **0 people publishes in 18 days** (DB 450 / 134). Ben Shelton (8.5 B+ v3) still needs only images and hasn't been touched since 09-20; his Laver Cup news peg has passed. The Druski live-page refresh failed v3 verification (`insufficient_evidence`, provisional 8.1). The committed draft also retypes the live page **8 -> 3**, which is not synced and needs DJ's call.
- **Still dark:** Instagram 52 days (queue RED 0/10, frozen 51 days), Quora 132, Twitter 132, distribution packets (newest 76 days, oldest 214), outreach 55, One Take ep 1 65 days, pop-culture 21 unpublished (oldest 286 days), The Nine 0 comments posted since its 09-22 launch.

## The actual work — the empty room

This week showed what the growth log has been predicting since 09-07. The one person the loop ever retained came back, looked for a response nine times, found an empty room, lost their account and left. Every piece that would have caught them is either dead or unbuilt:

| Component                         | State (observed: growth audit + this run)                                                                                                                                                                                                        | Blocker / owner                                                                                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Owed replies                      | Takes 746, 747, 748 (signed-in repeat contributor `c4e88b00`, last seen 09-22 19:41) and 743 (anon opt-in #2) are unanswered after 8 days. q570 (their question) holds only their own take                                                       | **DJ: ~15 min.** The only remaining channel to this person is the `reply_to_take` email, and it only fires on a reply. Don't use the `hostDigest.ts:27` fallback text |
| Host digest / desk                | Last draft 09-12, last digest 09-13: **16 days dead**. No `maxDuration`, no run log, fixed 48h lookback. `host-digest/+server.ts` untouched since 09-07                                                                                          | Eng, ~45 min: `maxDuration: 300`, a run row that alarms on "takes > 0, drafts = 0", a last-success lookback. Growth's #1 bet for the third week                       |
| Account recovery                  | The contributor went `/account` -> signed out -> `/register` -> `/forgotPassword` x2. `recovery_sent_at` is NULL, so no reset email was sent. Cause unverified (no submit, reCAPTCHA at `forgotPassword/+page.server.ts:81-95`, or a rate limit) | Eng/DJ: walk `/forgotPassword` once on a phone                                                                                                                        |
| Welcome + confirmation mail       | Off 26 days. A third real person was lost: signup 209 (Bing -> compatibility matrix, signed up in 96 s), whose confirmation failed on `EMAIL_FOOTER_ADDRESS` 09-24 18:06. 4 errored + 1 stalled enrollments                                      | DJ: postal address -> Vercel (fifth ask)                                                                                                                              |
| `ReplyOptInTray` (shipped 09-23)  | 0 exposures (0 contributions). The 2 lifetime opt-ins are still at `notification_count=0`                                                                                                                                                        | Depends on a reply landing                                                                                                                                            |
| Homepage V2 Tier 1+2 (live 09-26) | "Answer before you see anyone" is in production HTML. `/` still renders practice-only. The live-take post exists only at `/design-preview/homepage-live-take`, and its submit is simulated                                                       | Queued behind bet #3 (growth)                                                                                                                                         |
| Gate instrumentation              | Gate fps rose 18 -> 30, but only 1 of 30 engaged >=30s and 17 of 30 had no client visit. `gate_shown` fires in the server load, so crawlers count. `contribution.path` is still missing                                                          | Eng: count only browser-rendered gates, and pass `path`                                                                                                               |

Growth's ranked bets, adopted as-is: (1) reply today, then fix the host desk and walk `/forgotPassword`; (2) turn mail on; (3) make the wall count humans before reading 0%. Hold Reddit, the founding circle and the type prompt.

**PM read:** the loop-repair work is small and well specified (growth has written the spec three times), and it keeps losing to larger, more interesting builds. It doesn't need DJ's design judgment, only his approval. Hand it to an agent with growth's spec and have DJ review the diff (see Recommendation #1).

## Tooling state

- **The Monday chain was on time.** Growth audit ran 06:00 -> 06:09:06 (exit 0); this brief started at 06:09.
- **New OpenClaw job:** `9takes Weekly Crosslinks` (Thu 07:00 ET). It last ran 09-24 `ok`, and the next run is 10-01. The scheduler now has 10 jobs (was 9). There are still no Instagram or Quora execution jobs, only the text reminders.
- **The create cron is spamming Telegram.** "Queue is EMPTY — refill" has fired nightly since 09-21. The wrapper also rolled `override.json`'s rate-limit week to `2026-09-27` (that is the uncommitted `override.json` diff, not DJ's edit).
- **The publisher is unchanged.** Blocker counts are the same as 09-21 (`missing_perspective_review` 72, `source_standard_failed` 47, `missing_grade_stability_delta` 32, `content_quality_below_8.5` 30, `stale_grade_rubric_v1` 25, `missing_content_quality` 16, images 14). "No publishable draft" still exits 1.
- **The v3 turn cap struck again.** Druski's `verify-edit` hit the 60-turn cap on 09-24, and YouTube and Essence were blocked from this machine, which forced the `insufficient_evidence` verdict. The verifier's own advice: "re-run this stage from a different network."
- **The Supabase MCP is down** for the fourth week. `scripts/db-query.sh` works.

## Cross-surface status

### Growth and email

- The headline, leak and bets are quoted above. Other facts from the 09-28 entry: question-detail fps rose 31 -> 45, but engaged >=30s fell 6 -> 2. Crawler nav sweeps pushed `/register` from 3 to 9 fps with 0 profiles. `/` had 164 home-entry sessions, and 6 reached a question detail (at least 2 of those were 0 ms sweeps). Only 20 sessions fell in the first 33h after the homepage deploy, too few to read. Homepage step events go to PostHog, which was not queried.
- Coaching: "Talk to DJ" (`/book-session` rebuild, 09-23) has had 5 fps, 1 engaged >=10s and **0 `talk_notes` ever**. The waitlist got 0 adds for the 23rd week. Recruiting for the therapy beta is parked by DJ's choice (`docs/product/2026-09-23-therapy-on-steroids.md`), so this is expected, not a leak.
- **Growth didn't mention this, and next week's audit needs it:** personality-page ISR has been live since 09-21. Per `docs/seo/personality-isr.md`, `content_access_events` and the `9tanon` cookie stop firing on personality pages, so a drop in anonymous-reader counts there is an artifact, not a trend.
- Email: no new sequence doc this week. The 09-08/09-10 Enneagram campaign docs still wait on the same address (31 eligible).
- Full evidence: [`docs/growth/growth-log.md`](../growth/growth-log.md) `### 2026-09-28`.

### Blogs — people

- Disk: **441 published / 92 unpublished** (unchanged). DB: **450 published / 134 unpublished** (unchanged). The last DB publish was Zach Bryan on 09-10: **18 days with 0 publishes.**
- Create: the queue has been empty 09-21 -> 09-28 (8 nights). `backlog-queue.json` shows 0 queued, 2 held (Austin Abrams 8.1, _Whalefall_ 10-16; Joseph Zada 8.4, 11-20) and 3 failed.
- **Ben Shelton** (`src/blog/people/drafts/ben-shelton.md`, 8.5 B+ v3, verify `pass`) has had no commit since 09-20 and no images on disk. He is still missing from the publisher's top-8 "closest" list, which I did not investigate by running the parser (bare `push:people` writes to the DB). The queue entry cited the "Sept. 25-27 Laver Cup" as its timing peg, and that window has closed. Athletes were deprioritized 09-09.
- **Druski (live page refresh):** a legacy pipeline ran 09-23 (all stages exit 0, editor pass + frontmatter enrich), then v3 ran 09-24 (research, draft, six reviews, edit, `verify-edit`). The verdict was **`insufficient_evidence`** with provisional scores evidence 8, enneagram 8, originality 8.5, writing 8, durability 8, hook 9, discoverability 8, for **8.1 overall**. That's below the 8.5 bar because about a third of the sources couldn't be reopened (15 claims unsupported, 29 qualified; "unsupported" means unverified, not false). The committed draft is `published: true` with `enneagram: 3`, while the **live DB row says 8**. `blogs_famous_people_history` shows no Druski write since 09-21, so the live page is still the old Type 8 text. Per the verifier, two calls belong to DJ: the 8 -> 3 retype, and a re-check of the father's side at publication and again 30 days later.
- People-to-people cross-links: 169 links across 124 under-linked pages, synced link-only to **139 live rows** on 09-25 00:52 UTC (`lastmod` untouched). Pages with 0 inbound contextual links went 113 -> 71.
- Rod Wave is unchanged (draft complete, `verify-repair` hit the turn cap twice, ungraded). The Holmes refresh (8.0, Stanford-date error) is unchanged. The closest publisher candidates have been the same for 8 briefs: `tyla`, `ms-rachel`, `sandra-bullock`, then five at 8.4 plus perspective.

### Blogs — other categories

- Pop-culture: **21 unpublished** (18 `published: false` plus 3 with no key), unchanged. 20 are 3+ months old; the oldest is `aoc-and-the-squad` (2025-12-15, 286 days). 38 pop-culture files were touched this week, all link edits from the cross-link passes. The Epstein research notes moved out of `src/blog` to `docs/research/epstein/`.
- **New community draft:** `src/blog/community/drafts/be-gentle-when-youre-right.md` (09-26, `published: false`, "Shaming people for being wrong feels like justice. Mostly it teaches them to stop trying."). Section 1 is DJ's cleaned-up voice memo; sections 2-7 are scaffolding. It's DJ's own writing in progress, not a pipeline artifact.
- Enneagram: `enneagram-test-comparison-2025` was unpublished on 09-21 and its sitemap entry removed, which closes the Ahrefs cannibalization item. There are no other flag flips in any MDsvex category. Sitemap: 710 URLs (committed 09-26).
- **Typing taskers (09-24):** T-38 rewrites `trump-type-8-vs-biden-type-2` as 3 vs 2 with a 301 (the page is published, has GSC traffic, and was one of the deploy-skew `noindex` victims), T-39 is the Kardashian Kim 3 / Kanye 7 expansion, and T-40 is a corpus-wide typing sweep plus a `pnpm typing:check` guard. All three are unstarted.

### SEO

- **Personality ISR is live.** Committed and pushed 09-21 (`e69f2b7b8`). Production returns 200 with `x-vercel-cache: HIT` on `/personality-analysis/taylor-swift`, and `/api/personality-analysis/[slug]/discussion` returns 200. Whether `BYPASS_TOKEN` is set (on-publish revalidation) is unverified.
- **IndexNow is not live.** The submitter (`scripts/submit-indexnow.mjs`) is committed, but `static/` has no key file and `INDEXNOW_KEY` isn't in the local env. The submitter fails open, so nothing breaks; it just isn't pinging.
- **The GSC data is fresh for the first time since 08-13:** `docs/data/gsc/2026-09-24-*` (90-day window 06-24 -> 09-22). Nothing has read it yet. No `seo-content-strategist` artifact exists, and the Ashby / Coogan / Hormozi retrofit read is still outstanding.
- **Cross-link system (built 09-22 -> 09-24):** `pnpm gen:crosslinks` rebuilt, the `pnpm crosslinks:check` ratchet gate added to lint and CI, `/crosslink-queue`, and the Jev link audit (`pnpm audit:links:jev`, ~$0.77/run). Links added: 159 + 31 (plus 16 question invitations) + 12 + 169 people-to-people = **371**. Gate debt 66 -> 2. Enneagram Corner still keeps ~93% of its links in-section (the log says "not solved yet").
- The deploy-skew `noindex` fix (09-19) has had several deploys since. The GSC re-inspection of `jared-kushner` / `jensen-huang` that would confirm it hasn't been recorded.

### Distribution / Reddit / The Nine / Quora / Twitter

- **The Nine (launched 09-22):** `docs/growth/the-nine/` has the playbook, `HANDOFF.md`, a 410-question corpus, `venues.json`, `scorecard.sql` and `pnpm nine:find` (24 tests). DJ locked three decisions: weekly Nine format, unbranded participant, Reddit before X. The run log's last entry is 09-22, and `queue/` is empty. The harness has never run against live Reddit: the Reddit API has been approval-gated since Nov 2025, and no unbranded account or script app exists yet. This conflicts with the growth log, which says "Hold Reddit" until the loop is repaired. DJ has to pick which wins (Open question 6).
- Reddit drafts: 7 of 8 unfired. Distribution assets: 9 `*-distribution.md` packets; the directory is untouched since 07-22, the newest packet is 07-14 and the oldest 02-25. `LAUNCH-CHECKLIST.md` is unchanged.
- Quora: `docs/quora/sessions/` still holds only its README; the last cron log is 05-19 (132 days). Twitter: no session artifact since 05-19, and `docs/twitter/` was last touched 08-13.

### Instagram

- Sessions have been dark **52 days** (last: `2026-08-07_instagram-warmup-2.md`); `docs/instagram/` was last committed 08-30.
- `node scripts/check-marketing-content-queue.mjs` reads **RED**, identical to the last seven checks: approved/scheduled 0/10, copy-ready 11/15, triaged 19/20, design-ready 2/3, QA 0/2. `queue.json` was last committed 08-08 (51 days ago).
- The only things firing are the `Daily Engagement Reminder` and the `Monday Content Batching` reminder (10:00 today). This is the seventh brief to ask restore-or-retire.

### Outreach / video / coaching

- No outreach artifact since 08-04 (55 days). 0 founding-circle invites (held per growth).
- One Take ep 1 is unfilmed, 65 days after the format decision.
- Coaching is covered under Growth. The "Talk to DJ" booking page is live on `dj@9takes.com` (per memory: DJ's calendar check only covers that one calendar, so double-booking is possible). There have been 0 notes.

## What changed since 2026-09-21

- **Shipped and pushed** (`main` = `origin/main` at `01ab4e7ef`):
  - `e69f2b7b8` (09-21): personality ISR, the discussion endpoint, `revalidate:personality`, the IndexNow submitter, the 2025 test-comparison unpublish, and the love-languages title.
  - `83731608d` (09-22): The Nine playbook and harness.
  - `48f80036a` (09-22): dependency / Vite bumps.
  - `45804be24` (09-22): the cross-link system, the gate and `/crosslink-queue`, plus the 09-23 GSC pull.
  - `998533779` (09-23): the question-page rewrite, `ReplyOptInTray`, `RankedComments`, and the therapy-beta docs.
  - `ccd4e13f7` (09-23): the "Talk to DJ" rebuild, the `talk_notes` migration, `/talk/reply/[token]`, `smartQuotes`, the personality-page reading column, and the Druski entity-gap brief.
  - `299a2a500` (09-23): the Jev link audit, the 09-24 GSC pull, and the Druski refresh.
  - `0d90288fb` (09-23): the CSS minification fix.
  - `76b67d783` (09-24): taskers T-38/39/40 and the Druski editor pass.
  - `7a563034a` (09-25): 169 people-to-people links and the v3 Druski run.
  - `01ab4e7ef` (09-26): homepage V2 Tier 1+2, homepage events, the live-take preview, and the "Be Gentle" draft.
- **In progress (uncommitted):** the admin dashboard page (staged), the HyperPlexed admin-audit docs, today's growth-log entry, and the `override.json` week rollover.
- **Won:**
  - Cross-link gate debt 66 -> 2.
  - People pages with no inbound contextual link 113 -> 71.
  - Personality pages served from the edge cache.
  - Fresh GSC data.
  - Search-sourced new visitors 651 (the most since 08-03).
  - Returning active 1.50% (the high for this window; crawler share unchecked).
- **Broke or degraded:**
  - Contributions 9 -> 0.
  - The only repeat contributor churned after 9 unanswered reloads.
  - No reset email was sent.
  - Druski failed v3 verify and left the disk draft out of sync with the live row.
  - The create queue sat empty 8 nights.
  - Gate counts are now crawler-inflated.
- **Decided (observed from artifacts):**
  - The Nine: weekly format, unbranded, Reddit first (09-22).
  - People-to-people linking approved and executed (09-24).
  - The 358 hidden questions are intentional (09-24 correction).
  - The therapy-beta framing for `/book-session`, with recruiting parked (09-23).
  - Homepage V2 Tier 1+2 promoted to production (09-26).
- **Did not move:** `EMAIL_FOOTER_ADDRESS`, the host-digest fix, the owed replies, the homepage gate, `contribution.path`, Shelton images, queue refill, Rod Wave, Holmes, Instagram, Quora, Twitter, distribution packets, outreach, One Take, pop-culture, the perspective-review backfill (72), the publisher exit code, and the IndexNow key.

## Recommendation

**1. Reply to 746, 747, 748 and 743, and answer q570, today. Then hand the host-desk fix to an agent instead of waiting for a free afternoon.** ~15 min of DJ replies, ~45 min of agent eng, ~10 min of DJ diff review.

- **What:** DJ posts real replies. Then an implementation agent (general-purpose, run by DJ or approved for the PM to dispatch) builds growth's spec on a branch for DJ to review: `maxDuration: 300` on `src/routes/api/cron/host-digest/+server.ts`, one run row per digest that alarms when takes > 0 and drafts = 0, and a lookback from the last successful run instead of 48h (`hostDigest.ts:22`). Walk `/forgotPassword` once on a phone.
- **Why:** email is now the only channel to the one retained contributor, and it fires only on a reply. The fix has been spec'd three weeks running and hasn't lost on merit, only on attention. Delegating it removes that bottleneck.
- **Success (growth's bar, 7 days):** at least 1 `reply_to_take` with `email_status='sent'`, at least 1 opt-in with `notification_count > 0`, and `c4e88b00` or `14844525` seen again. Guardrail: no reply uses the `hostDigest.ts:27` fallback.
- **Risk:** low. Both reply emails are transactional, so the footer guard doesn't block them.

**2. Turn mail on (fifth ask).** ~15 min for DJ, then agent execution.

- **What:** put a postal address (PO box, virtual mailbox or registered agent) in Vercel production as `EMAIL_FOOTER_ADDRESS`, then redeploy. Re-arm the 5 enrollments, resend the 208 and 209 confirmations, and send one header-checked test before the Enneagram batch (31 eligible).
- **Why:** every failure since 09-02 has this one error, three real people have been lost to it, and the `process-sequences` pre-check blocks all retries until it's set.
- **Success:** both confirmations and the 09-19 registrant's step 1 sent within 24h, and 0 footer errors over 7 days. Guardrail: `idempotency_key`, so no duplicate sends.

**3. Make the gate count humans, and pass `contribution.path` (growth bet #3).** ~1h eng; measurement goes to `growth-analyst`.

- **What:** log `gate_shown` only once the gate renders in a browser (or require a matching client visit), and pass `path` on `contribution` (`questions/[slug]/+page.server.ts:348-354`). The homepage live-take (a real q203 post with `path='/'`) queues behind this.
- **Why:** 17 of 30 gate fps had no client visit, so "0%" can't be read until the denominator is human.
- **Success (2 weeks):** at least 90% of gate fps have a client visit row, and `contribution.path` is non-null on 100%.

Following queue (cheaper to batch; not ranked above):

- (a) **Druski decision before anyone syncs:** approve 8 -> 3 and re-run `verify-edit` from a different network, or revert the draft to the live text.
- (b) **Refill the create queue or pause it** so Telegram stops nagging.
- (c) **Shelton images -> publish.** The news peg has passed, but it's still the cheapest publish on deck, and 18 days is the longest drought since June.
- (d) **Point `seo-content-strategist` at the 09-24 GSC pull**, including the retrofit read and a check on the deploy-skew fix.
- (e) **Standing forks (seventh brief):** Instagram restore-or-retire; the perspective-review backfill; publisher exit 0 on "no publishable draft".

## Open questions for DJ

1. Will you reply to takes 746, 747, 748 and 743 and answer q570 today, with real replies and not the fallback text?
2. Can an implementation agent build the host-desk fix on a branch for your review: `maxDuration: 300`, a per-run log row that alarms on "takes > 0, drafts = 0", and a last-success lookback? Please also check `/forgotPassword` on a phone, since `recovery_sent_at` is NULL for the contributor who tried it twice.
3. What postal address should go in `EMAIL_FOOTER_ADDRESS` (fifth ask)? Once it's set, are the 5 re-arms, the 208 and 209 resends, the header-checked test and the controlled Enneagram batch approved as written?
4. Gate instrumentation: approve human-only `gate_shown` counting plus `contribution.path` as the next eng change, ahead of wiring the homepage live-take to q203?
5. Druski: is the live page now a Type 3 (currently 8 in the DB)? If yes, re-run `verify-edit` from a different network before sync. If no, revert the committed draft's typing so no future sync flips it by accident.
6. The Nine vs growth's hold: your 09-22 decisions put Reddit first, and the growth log says "Hold Reddit" until the loop is repaired. Which one governs this week? If The Nine: create the unbranded account and script app.
7. The create queue has been empty 8 nights: refill it (scout run) or explicitly pause the create cron? Ben Shelton: generate images and publish, now that the Laver Cup peg has passed?
8. Standing forks, seventh brief: restore or retire Instagram (52 days dark, queue frozen 51 days)? Grandfather or batch-backfill the 72 perspective-review-blocked drafts?

## Assumptions and limits

- Growth numbers are quoted from the 2026-09-28 growth-log entry (uncommitted in the working tree, written by today's audit), not re-derived.
- The "nothing shipped on the loop" claim comes from `git log` on the named paths since 09-21 plus a grep for `maxDuration`. No Vercel logs or env were read. `EMAIL_FOOTER_ADDRESS` being empty is observed locally only; the Vercel production value is inferred from growth's failure trail.
- "ISR live" rests on two GETs to one personality slug and the discussion endpoint. "Homepage V2 live" rests on the production HTML containing "Answer before you see anyone". Whether `BYPASS_TOKEN` is set is unverified. The 09-26 homepage audit doc still says "not deployed", which the production HTML contradicts.
- "Druski not synced" is inferred from no `blogs_famous_people_history` row since 09-21 plus the DB `enneagram = 8`. I didn't diff the live content.
- Shelton's absence from the publisher's top-8 list is unexplained. I didn't run the parser.
- Instagram, Quora, Twitter and Reddit claims come from the repo and the scheduler. No live account was inspected.
- Only this brief and `docs/marketing/marketing-log.md` were written. No product code, draft, publish flag, queue, packet, email, post or external account was changed.
