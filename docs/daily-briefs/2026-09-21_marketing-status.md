<!-- docs/daily-briefs/2026-09-21_marketing-status.md -->

# 9takes Marketing Status — 2026-09-21

**Unattended weekly run (Monday cron).** This covers 7 days. The prior brief is `2026-09-14_marketing-status.md`. The growth freshness gate passed: the newest entry in `docs/growth/growth-log.md` is `### 2026-09-21` (audit exit 0 at 06:09:24 today; the chain ran on time this week). Its headline and biggest leak are quoted below, not re-derived. The Supabase MCP failed to connect again, so the only DB read this run was one read-only query through `scripts/db-query.sh` (people publish counts). This run changed no draft, publish flag, packet, email, post, campaign, or git state. `git status` shows DJ mid-work on an uncommitted SEO batch (ISR + IndexNow + one unpublish); nothing in that set was touched.

## TL;DR

- **Growth headline (verbatim, 2026-09-21 audit):** _"the best takes on record (median 367 chars, gate 33%) landed in front of a host desk that has been silent for 8 days. The week produced four reachable contributors, two anonymous reply opt-ins, a repeat contributor who posted 3 takes and asked a question, and a search visitor who answered and then registered 7 minutes later, and every one of them got nothing. None of last week's three bets shipped."_ Cohort week 09-14: 4,598 new visitors (8-week high; 602 from search, first drop in four weeks), 1 signup, 1 profile, 9 human takes, gate 18 -> 6 = 33.3% (a held numerator over a 40% smaller denominator, so not a better gate). Contributor return is **0 / 28 across seven matured cohorts**. Waitlist empty, 22nd week.
- **Biggest leak (verbatim):** _"the same leak as last week, now with people standing in it. The gate finally delivered reachable, high-effort contributors, and the one retention event that has ever worked (DJ replying) has been offline for 8 days with no readout. Every 'You'll hear back' shown this week was false."_ Host digest: last draft 09-12, last digest 09-13, 8 silent 13:00 UTC runs, 0 of 9 takes drafted. Takes 743, 746, 747 and 748 are owed a reply. Mail: 19 days off, and the `process-sequences` 503 pre-check now blocks any retry until `EMAIL_FOOTER_ADDRESS` exists (4th ask). Homepage: `/` logged 0 gate fingerprints and 0 contributions all week (was 15-19 fps/week through August); 0 of 131 home-entry sessions reached the practice question's live slug. I confirmed growth's "none shipped" claim from git: no commit since 09-14 touches `src/routes/api/cron`, `hostDigest.ts`, `src/lib/email`, `giveFirstFunnel.ts`, `src/routes/questions` or the homepage, and `host-digest/+server.ts` still has no `maxDuration`.
- **Where DJ's week went instead: SEO infrastructure.** Pushed 09-19: the GSC page-indexing audit (indexed 464 -> **524**, not-indexed 764 -> **490** since July; one real bug, deploy-skew `noindex` on ~11 good pages, fixed by `scripts/carry-over-immutable-assets.mjs`, needs one deploy to verify), `/contact` redirects, an `enneagram-personal-growth` rebuild with a new `BehaviorDecoder` component. **Uncommitted in the working tree right now (not live):** personality-analysis pages moved to Vercel ISR with the gate and comments split into `GET /api/personality-analysis/[slug]/discussion`, `pnpm revalidate:personality`, an IndexNow submitter (`pnpm submit:indexnow`), the 2025 test-comparison page flipped to `published: false` (Ahrefs cannibalization fix) with its sitemap entry removed. It ships only after DJ supplies `BYPASS_TOKEN` and `INDEXNOW_KEY` plus the key file.
- **Content engine: first v3 pass, then the queue ran dry.** Ben Shelton cleared the full v3 chain on 09-20 (35 sources, six-role jury, edit, repair, verify `pass`, release.json) and graded **8.5 B+ under rubric v3** with `needs_review: false`; the 09-20 publisher listed it as blocked on **images only**. Rod Wave: draft complete but `verify-repair` hit the 60-turn cap twice, so no release.json and no grade. Tom Rhys Harries failed permanently (3/3). At 02:00 today the create cron reported **queue EMPTY** (Telegram notified). Publisher: "No publishable draft" 6 of 6 days; **0 people publishes since 09-10** (11 days; DB 450 published / 134 unpublished). Elizabeth Holmes' live-profile refresh ran the full legacy pipeline 09-19 and graded 8.0 B with a flagged factual error (Stanford exit date).
- **Still dark:** Instagram 45 days (queue RED 0/10, frozen 44 days), Quora 125 days, Twitter 125 days, 9 distribution packets untouched since 07-14 (oldest 208 days), 7 of 8 Reddit drafts and 0 founding-circle invites (held per growth), outreach 48 days, One Take ep 1 58 days, GSC performance CSV 39 days stale (the indexing report was read from the UI 09-19; query/page data was not pulled), pop-culture 21 unpublished (20 at 3+ months).

## The actual work — four reachable people, zero replies, and the reply machine has no run log

The gate produced the highest-effort contributions in the log (6 of 9 over 200 chars; takes 743 = 1,141, 746 = 873, 747 = 699). Three separate systems then failed to reach anyone, and one of them failed silently for eight days.

| Component              | State (observed, growth audit + this run)                                                                                                                                                                                                         | Blocker / owner                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Host digest / desk     | Last `host_reply_drafts` row 09-12 13:00; last `digest_sent_at` 09-13 13:00; 8 runs with no output; 0/9 takes drafted; draft #2 (take 736) still `pending`; fixed 48h lookback has put 740-745 out of reach; no `maxDuration`; no run-log table   | Eng: `maxDuration: 300`, per-run log row that alarms on "human takes exist, drafts = 0", lookback from last success |
| Owed replies           | 743 (anon, opt-in #2 arrived 43 s after posting), 746/747/748 (signed-in repeat contributor; also created q570). `questions/[slug]/+page.svelte:381` promises "DJ reads every take and replies. You'll hear back."                                | DJ: reply today, not the `hostDigest.ts:27` fallback text                                                           |
| Welcome sequence       | 0 sends this week, 2 failures (signup 208 on 09-14; the 09-19 registrant's step 1, 4 s after their answer -> register conversion). 4 errored + 1 stalled enrollment. `process-sequences` returns 503 before processing while the address is unset | DJ: postal address -> Vercel -> re-arm 5 -> resend 208 -> header-checked test -> Enneagram batch (31 eligible)      |
| Logged-in reply email  | Running; first eligible user now exists (takes 746-748); 0 sent                                                                                                                                                                                   | Depends on a host reply landing                                                                                     |
| Anonymous reply opt-in | 2 of 14 since 08-31, both `notification_count=0`; the anonymous reply email is `transactional` (`sender.ts:257`), so the footer guard would not block it                                                                                          | Depends on a host reply landing                                                                                     |
| Homepage gate (`/`)    | 0 / 0 this week vs 19 / 17 / 15 / 19 fps and 4 / 2 / 1 / 2 contributions per week 08-10..08-31; `/` entry sessions 125 -> 131, multi-page home sessions 27 -> 38; 2 of 131 reached any `/questions/*`, 0 reached q203                             | DJ fork: wire the practice submit to q203 as a real first take (`path='/'`), or reinstate the featured question     |
| `contribution.path`    | NULL on 7 of 9 (was 5 of 7)                                                                                                                                                                                                                       | Unshipped; fix with the homepage change                                                                             |

Growth's ranked bets, adopted as-is: (1) reply today, then make the host desk observable; (2) turn mail on (fourth ask); (3) put the live gate back on `/` without losing the practice moment. Hold Reddit, the founding circle and the type-prompt campaign until 1 and 2 land.

## Tooling state

- **Monday chain on time.** Growth audit 06:00 -> 06:09:24 (exit 0, 30-line insertion); this brief started 06:09:24. Last week it ran ~5h late.
- **Node runtime changed under the publisher.** `node --version` is now **v24.18.0** (the 09-07 and 09-14 briefs saw 26.5.0). The `gen:all` engine check is `>=22.13.0 <25`, so the post-publish regen failure that was blamed on Node 26 should now pass. Unverified: nothing has published since. `scripts/daily-blog-publisher.sh:19` still calls bare `node`, and "No publishable draft" still exits 1, so the Telegram `error` is still noise.
- **v3 pipeline's new failure class is the turn cap.** Four hits this week: Harries 09-16 ("Baseline snapshot changed", 0 min, third and final attempt), Rod Wave `edit` 60 turns at 102 min (09-17), Rod Wave `verify-repair` 60 turns (09-18), Shelton `research` 80 turns at 10 min (09-19). Checkpoint reuse worked: Rod Wave resumed all eight prior stages on 09-18 and Shelton's second attempt batched fetches into ~20 turns. The wrapper was killed after Shelton's pipeline finished (second "reconciled" entry after Arthur Mensch), so the queue never recorded the completion until 09-21.
- **Publisher blockers, flat:** `missing_perspective_review` 72, `source_standard_failed` 47, `missing_grade_stability_delta` 32, `content_quality_below_8.5` 30, `stale_grade_rubric_v1` 25, `missing_content_quality` 16, images 14. Unpublished candidates 81 -> 82. Persistent noise: `alexandr-wang` date `1997-01`, `khabib-nurmagomedov` `http://` citation, and now `ben-shelton` one `http://www.asapsports.com` citation.
- **OpenClaw:** same 9 jobs; create `ok`, publisher `running`, watchdog `ok`. Still no Instagram or Quora execution jobs.
- **Supabase MCP down** this session (third week); `scripts/db-query.sh` works.

## Cross-surface status

### Growth and email

- Headline, leak and bets are quoted above. Other facts from the 09-21 entry: contributions landed on 5 questions (q567 3, q118 3, q119 1, q203 1, q570 1), so q567's share fell to **33%** (target <50%, met for the first time). Gate-to-submit for fresh visitors ran 1.1 to 11 min (median ~4). The signed-in repeat contributor (profile 07-16; takes 07-16, 07-18, 08-11, 09-20) came back via DuckDuckGo to type-6 pages, then the depression blog (553 s engaged), and read their bell notification nine minutes _after_ posting: content brought them back, not the notification. 746 is a signed-in pushback: "You are gaslighting type 6s with depression."
- `/book-session` 35 -> 18 fps; 13 still `utm_campaign=personality_analysis` at 0 ms / 0% scroll. Waitlist empty for the 22nd week. 3 email opens since 09-07, all on August sends, classified `unknown` (scanners, inferred).
- No new email-sequence doc this week; the three 09-08/09-10 Enneagram docs still describe the campaign as approved and authorized, waiting on the same address.
- Full evidence: [`docs/growth/growth-log.md`](../growth/growth-log.md) `### 2026-09-21`.

### Blogs — people

- Disk: **441 published / 92 unpublished** (was 441 / 90). DB: **450 published / 134 unpublished** (was 450 / 129). Last DB publish: Zach Bryan, 09-10 10:00 UTC. **0 publishes this week.**
- Create, night by night: 09-16 Tom Rhys Harries FAILED permanently. 09-17 Rod Wave research + draft + six reviews passed, `edit` hit the turn cap. 09-18 Rod Wave resumed, `edit` adjudicated 48 findings (2 blockers, incl. a Lil Poppa grief passage stripped of context; article 4,477 words against the 4,500 ceiling), then `verify-repair` hit the cap: draft complete, `published: false`, ungraded, no release.json, no images. 09-19 Shelton research hit the cap. 09-20 Shelton passed end to end: 4,190-word draft, verify `pass` with 3 minor findings and 6 open research tasks (one is Bryan Shelton's "sabotages himself" remark on Tennis Insider Club), graded **8.5 B+ v3** (evidence 8.5, enneagram 8.1, originality 8.6, writing 8.3, durability 8.9, hook 9, discoverability 8.5). 09-21 queue empty.
- **Shelton is the cheapest publish on deck**: the 09-20 publisher showed `missing_full_image; missing_thumbnail_image` and nothing else. On 09-21 it dropped off the publisher's top-8 "closest" list with aggregate blocker counts unchanged; I could not tell why without running the parser (which I did not do, since bare `push:people` writes to the DB). Verify by hand before generating images. Note DJ deprioritized athletes on 09-09 (priority 20); that ordered the queue, it did not veto publishing.
- Elizabeth Holmes refresh: legacy pipeline 09-19 17:01 -> 09-20 03:39, all stages; perspective verification `pass`; `9.8 perspective_finalize` exit 1. Grade 8.0 B (rubric v2), stability delta 0.2. Review flags: "Holmes left Stanford in 2003" is wrong (founded 2003, left March 2004); 4,022 prose words over the 3,200-3,900 band; verification clauses visible as inserts; "Social Three" subtype label in body. Path to 8.5 is listed. Whether the refreshed text was synced to the live row is unverified.
- Also committed this week: Samara Weaving and Rod Wave drafts (09-19), Inde Navarrette + Austin Abrams + Joseph Zada artifacts (09-15; the untracked Inde run is now tracked), Adam Neumann touched 09-19. Held: Austin Abrams 8.1 (_Resident Evil_ opened 09-18; first window passed; _Whalefall_ 10-16), Joseph Zada 8.4 (11-20). Failed permanently: Tom Rhys Harries (joins Kate Middleton, LeBron James).
- Closest publisher candidates, unchanged for 7 briefs: `tyla` (0.4 delta), `ms-rachel` (8.1, Type 2 anchor), `sandra-bullock` (9.0, needs stability delta + perspective), then ksi / penguinz0 / plaqueboymax / stable-ronaldo / xochitl-gomez at 8.4 + perspective.

### Blogs — other categories

- Pop-culture **21 unpublished** (18 `published: false` + 3 files with no `published` key: `incel-exit-post`, `tech-titans-ai-wars-twitter`, `tech-titans-founders-vs-stewards-twitter`); 20 at 3+ months, 1 at 1-3 months (`world-leaders`, 06-30). Oldest `aoc-and-the-squad` 2025-12-15 (280 days). Only `masculinity-strength-and-the-enneagram` (published) was touched this week.
- Enneagram: `enneagram-personal-growth.md` rebuilt 09-19 (478-line diff) around a new `BehaviorDecoder.svelte` component, with a wave-2 seed-takes doc (`docs/content-research/2026-09-19-personal-growth-seed-takes.md`: "When you're stuck, what do you actually need someone to say to you?") that is waiting on DJ to create the backing question. **Uncommitted:** `enneagram-test-comparison-2025.md` flipped to `published: false`, its sitemap entry removed, and the 2026 page's link to it cut (closes the Ahrefs "2025 cannibalizing 2026" item); `love-languages-and-enneagram-types` title 2025 -> 2026. Unpublished enneagram drafts 9 including the newly flipped page.
- Community 1, guides 2, topical 1, life-situations 1. Unchanged.
- Sitemap 709 URLs, committed; GSC read it 9/15 with status Success. No published-flag vs sitemap drift found in any MDsvex category. Corpus stats and crosslink index regenerated 09-20 and committed (187 posts / 166 published).

### SEO (the week's real movement)

- **GSC page-indexing audit 09-19** (`docs/seo/gsc-indexing-audit-2026-09-19.md`, report fresh to 9/13): indexed 464 -> 524, not-indexed 764 -> 490; 404s 233 -> 15; 5xx and redirect errors at 0. Buckets: 207 working redirects (old uppercase slugs), 161 crawled-not-indexed (quality call + 34 now-redirecting URLs), 65 discovered-not-crawled, 28 noindex (17 intentional, **11 the deploy-skew bug**), 12 soft-404 (11 thin question categories already handled + 1 bug). The bug: a deploy invalidates old chunk URLs, hydration fails, `+error.svelte` emits `noindex`, Google records it on live 200 pages (`jared-kushner` 9/6, `jensen-huang` 9/3, `trump-type-8-vs-biden-type-2` 9/13). Fix pushed 09-19 (`scripts/carry-over-immutable-assets.mjs` + spec + `vite.config.ts`, commit `6a5ac24ad`, `main` = `origin/main`). Verify with one more deploy and a GSC URL re-inspection.
- **Ahrefs follow-through** (09-14 crawl): titles / nofollow / redirect fixes pushed 09-19; `/contact` and `/contact-us` -> `/about#contact` in `vercel.json`. The remaining Ahrefs items (slow personality pages, 2025 test page, IndexNow) are all in the uncommitted batch below.
- **Uncommitted batch (not deployed):** `docs/seo/personality-isr.md` says "Shipped: 2026-09-20", but every file it names is modified or untracked in `git status`. Design: personality slug pages cached by pathname in Vercel ISR (24h + refresh on publish via `BYPASS_TOKEN`); signed-in header hydrated in the browser; answer gate + comments served by `GET /api/personality-analysis/[slug]/discussion` (`private, no-store`, still decided server-side); admin draft preview moved under `/admin/content-board/...`; the user-agent hard block removed on those paths (robots.txt + optional firewall rule instead, because the first blocked crawler would poison the shared cache with a 403); `personalityIsrContract.spec.ts` fails the build if the load reads session, cookie or UA again. `docs/seo/indexnow.md`: `scripts/submit-indexnow.mjs` reads the sitemap, submits URLs changed in a window, fail-open. **DJ owes:** `BYPASS_TOKEN` (Vercel, read at build time, redeploy), `INDEXNOW_KEY` + `static/<key>.txt` deployed before the first ping, optional firewall rule. **Tell growth:** `content_access_events` and the `9tanon` cookie stop firing on personality pages once this is live, so anonymous-reader counts in that table will drop without meaning anything.
- GSC performance CSVs still `2026-08-13` (39 days); `seo-content-strategist` has not been run against the clean T-09 window; the Ashby / Coogan / Hormozi retrofit read has no artifact.

### Distribution / Reddit / Quora / Twitter

- Reddit: 7 of 8 drafts unfired, no edits since 08-31; held per growth until bets 1 and 2 land.
- Distribution assets: 9 `*-distribution.md` packets, directory untouched since 07-14, oldest 02-25 (208 days). `LAUNCH-CHECKLIST.md` unchanged.
- Quora: `docs/quora/sessions/` still README only; last cron log 05-19 (125 days).
- Twitter: no session artifact since 05-19; `docs/twitter/` last touched 08-13.

### Instagram

- Sessions dark **45 days** (last `2026-08-07_instagram-warmup-2.md`); engagement-targets last dated append 08-03; last warmup log 08-10.
- `node scripts/check-marketing-content-queue.mjs`: **RED**, identical to the last six checks. Approved/scheduled 0/10, copy-ready 11/15, triaged 19/20, design-ready 2/3, QA 0/2. `queue.json` last commit 08-08 (44 days).
- No execution crons; only the `Daily Engagement Reminder` and `Monday Content Batching` text reminders fire. Sixth restore-or-retire ask.

### Outreach / video / coaching

- No outreach artifact since 08-04 (48 days). Founding-circle tasker unchanged; 0 invites.
- One Take ep 1 unfilmed, 58 days after the format decision.
- `/book-session` traffic fell back (35 -> 18 fps) as the bot-shaped sessions thinned; waitlist 0. `book-session/+page.svelte` had a 2-line change 09-19 (corpus count text, inferred).

## What changed since 2026-09-14

- **Shipped (pushed, `main` = `origin/main` at `d034d4a81`):** GSC deploy-skew fix + audit doc; `/contact` redirects; `enneagram-personal-growth` rebuild + `BehaviorDecoder.svelte` + wave-2 seed doc; Holmes refresh + entity-gap brief + grade review; `waitUntilUsage.spec.ts` guard; `personBlogParser.js` changes; corpus + crosslink regen; draft commits for Shelton, Rod Wave, Samara Weaving, Inde Navarrette, Abrams, Zada.
- **In progress (uncommitted):** personality ISR + discussion endpoint + revalidate script; IndexNow submitter + spec; 2025 test-comparison unpublish + sitemap removal; love-languages title; `hooks.server.ts` / `contentAccessGuard.ts` cache-path changes; admin content PUT auto-revalidates.
- **Won:** first v3 subject through the full chain at 8.5 (Shelton); best takes on record (median 367 chars); first repeat contributor; first observed answer -> register conversion (7 min); q567 share under 50% for the first time; new visitors at an 8-week high; GSC not-indexed down 274 since July.
- **Broke or degraded:** host digest went from degraded to dead (0 drafts since 09-12, 8 silent runs); mail's 503 pre-check now prevents any retry; Tom Rhys Harries failed permanently; Rod Wave stuck at verify-repair; create queue empty again; wrapper killed after Shelton's run; search-sourced new visitors fell for the first time in four weeks.
- **Decided (observed from artifacts):** DJ is unpublishing the 2025 test comparison rather than redirecting it; DJ is moving personality pages to ISR and dropping the in-function UA block on those paths; DJ is adopting IndexNow; DJ ran the Holmes refresh through the full legacy chain rather than v3.
- **Did not move:** `EMAIL_FOOTER_ADDRESS`, host-digest fix, homepage gate, `contribution.path`, founding circle, Reddit, Instagram, Quora, Twitter, distribution packets, outreach, One Take, pop-culture, GSC CSV snapshot, perspective-review backfill, publisher wrapper exit code, `ms-rachel`.

## Recommendation

**1. Reply today to 743, 746, 747 and 748, then make the host desk observable (growth bet #1).** ~15 min of DJ replies, ~45 min eng.

- **What:** post real (non-fallback) replies to the four takes. Then add `maxDuration: 300` to `src/routes/api/cron/host-digest/+server.ts`, write one run row per digest (candidates / drafts / errors, like `email_cron_status`) that alarms when human takes exist and drafts = 0, and base the lookback on the last successful run instead of 48h (`hostDigest.ts:22`).
- **Why:** the only repeat contributor in the log is the one person DJ has replied to. Four reachable people are waiting, one of them signed in, and the page promises them a reply. A loop-critical cron with no run log failed for eight days and nobody saw it.
- **Success (growth's bar, 2 weeks):** 4/4 replied within 24h; >=1 `comment_reply_subscriptions.notification_count > 0`; >=1 `notifications.kind='reply_to_take'` with `email_status='sent'`; >=1 replied-to contributor visit within 7d; 0 silent digest runs. Guardrail: no reply is the `hostDigest.ts:27` fallback text.
- **Risk:** low. The anonymous reply email takes the sender's `transactional` default, so the footer guard does not block it. Draft #2 (take 736) will need a manual decision.

**2. Turn mail on (growth bet #2, fourth ask).** ~15 min for DJ, then agent execution.

- **What:** supply a postal address (PO box, virtual mailbox, or registered agent) for `EMAIL_FOOTER_ADDRESS` in Vercel production, redeploy, re-arm the 4 errored plus 1 stalled enrollments, resend signup 208's confirmation, send one header-checked test of the approved Enneagram email to DJ's Gmail (DKIM/SPF/DMARC), then release the controlled batch (31 eligible, authorized 09-10). Route the `process-sequences` 503 / stopped-enrollments count to Telegram.
- **Why:** 100% of failures since 09-02 share this one error; the pre-check now makes retries impossible; the first registrant in three weeks is stalled on it.
- **Success:** the 09-19 registrant's step 1 sent within 24h of the change; 0 footer errors over 7d; all 5 enrollments advanced. Guardrail: no duplicate step sends (`idempotency_key`).

**3. Put the live gate back on `/` without losing the practice moment (growth bet #3).** ~5 min decision, ~1h eng; measurement to `growth-analyst`.

- **What:** DJ fork: (a) make the practice question's submit _be_ the first take on its live question (q203), recorded with `path='/'`; or (b) reinstate the featured live question below the practice block. Fix `contribution.path` in the same change.
- **Why:** `/` was the largest single gate surface for five straight weeks and now forwards 0 of 131 entry sessions to the gate, while holding people longer (multi-page 29%).
- **Success (2 weeks):** `/` gate fps >=15/week, >=1 contribution/week from `/`, `contribution.path` NULL rate <20%. Guardrail: home multi-page rate stays >=25%.

Following queue (cheaper to batch; not ranked above):

- (a) **Ben Shelton to live.** Confirm the 09-21 publisher state by hand, generate the full + thumbnail images (`scripts/gen-blog-image-openrouter.mjs ben-shelton` or the moodboard path), publish. First v3 nightly publish, ends the 11-day drought, timely after the US Open final. ~20 min.
- (b) **Land the SEO batch.** Set `BYPASS_TOKEN` and `INDEXNOW_KEY`, commit the `static/<key>.txt`, push, then `pnpm revalidate:personality -- --all` and `pnpm submit:indexnow --dry-run` before the first real ping. Re-inspect `jared-kushner` in GSC to confirm the deploy-skew fix. Tell `growth-analyst` that `content_access_events` goes quiet on personality pages so next Monday's audit does not misread it.
- (c) **Refill the create queue** (empty; Telegram already asked) from the 09-09 scout's remaining names or a fresh `/find-surging-people`; raise the `verify-repair` turn cap and rerun Rod Wave from checkpoints.
- (d) **Holmes:** fix the Stanford date before syncing the refresh; cut toward the 3,200-3,900 band per the review.
- (e) **Standing forks (6th brief):** Instagram restore-or-retire; perspective-review backfill (72 blocked); publisher wrapper exit 0 on "no publishable draft".

## Open questions for DJ

1. Will you reply to takes 743, 746, 747 and 748 today with real replies, and approve `maxDuration: 300` + a per-run digest log row that alarms on "human takes, zero drafts" + a last-success lookback on `host-digest`?
2. Postal address for `EMAIL_FOOTER_ADDRESS` (fourth ask). Once set, are the 5 enrollment re-arms, the signup-208 resend, the header-checked test, and the controlled Enneagram batch approved as written?
3. Homepage: wire the practice submit to q203 as a real first take with `path='/'`, or reinstate the featured question below the practice block? Fix `contribution.path` in the same change?
4. The uncommitted SEO batch (personality ISR + discussion endpoint + IndexNow + 2025 test-comparison unpublish): is it ready to commit and push once `BYPASS_TOKEN` and `INDEXNOW_KEY` + key file exist? Confirm you are unpublishing the 2025 page rather than 301ing it to 2026, and that dropping the in-function UA block on personality pages is intended.
5. Ben Shelton (8.5 B+ v3, images only per the 09-20 publisher): generate images and publish this week, despite athletes being deprioritized in the queue? Rod Wave: rerun `verify-repair` with a higher turn cap, or hand-verify?
6. Create queue is empty: refill from the 09-09 scout's remaining names, or run a new surging-people scout first?
7. Holmes refresh (8.0, Stanford-date error flagged): fix the date and sync to the live row, or hold the refresh?
8. Personal-growth seed takes: create the backing question ("When you're stuck, what do you actually need someone to say to you?") so the `BehaviorDecoder` widget can go live, or use the lighter alternate?
9. Standing forks, sixth brief: restore or retire Instagram (45 days dark; queue frozen 44 days); grandfather or batch-backfill the 72 perspective-review-blocked drafts; confirm the hold on founding-circle invites and the 7 Reddit drafts until #1 and #2 land.

## Assumptions and limits

- Growth numbers are quoted from the 2026-09-21 growth-log entry, not re-derived. The only DB query this run was read-only: `blogs_famous_people` publish counts and `published_at` since 09-14.
- "Nothing shipped on the loop" is confirmed from `git log` on the relevant paths and a grep for `maxDuration` in the host-digest route; no Vercel logs were read.
- "Not deployed" for the ISR / IndexNow batch is inferred from `git status` (modified + untracked) with `main` = `origin/main`; Vercel deploys on push. The ISR doc's own "Shipped: 2026-09-20" line describes intent, not repository state.
- Ben Shelton's "images only" blocker is the 09-20 publisher log; the 09-21 log omits it from the top-8 list and I did not run the parser to find out why.
- Whether the Holmes refresh reached the live DB row is unverified (`blogs_famous_people` has no `updated_at`; `published_at` is unchanged).
- Node v24.18.0 is the interactive shell's default; the OpenClaw job may resolve a different binary. Unverified until a publish exercises `gen:all`.
- Instagram, Quora and Twitter claims come from the repository and the scheduler; no live account was inspected. Distribution "9 packets" counts `*-distribution.md` files only; earlier briefs counted 14 assets including non-packet files. Either way, unchanged.
- No product code, campaign, post, email, draft, publish flag, queue or external account was changed. Only this brief and `docs/marketing/marketing-log.md` were written.
