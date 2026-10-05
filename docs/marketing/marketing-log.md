<!-- docs/marketing/marketing-log.md -->

# 9takes Marketing Log

**Append-only.** Newest entries on top of each section. Never overwrite past entries — that's what dated snapshots are for.

Maintained by the `marketing-pm` agent + DJ. Cross-link to `docs/growth/growth-log.md` for experiment-level detail rather than duplicating.

---

## Active workstreams

### 2026-10-05 — Unattended weekly brief: DJ shipped the engineering half of the loop (host desk alive, human-only gate, live-take homepage, celebrity mid-article question, beta card) but 0 of 8 desk drafts were posted and mail is still blocked in prod; content engine restarted (queue 0 -> 18, 10 v3 runs, Andrew Garfield published on _Artificial_'s NYFF day); three live people pages carry unapproved retypes on disk

- Brief: [`docs/daily-briefs/2026-10-05_marketing-status.md`](../daily-briefs/2026-10-05_marketing-status.md). Growth freshness gate PASSED (growth-log `### 2026-10-05`, audit 06:00:00 -> 06:08:10, exit 0; chain on time). Headline + biggest leak quoted verbatim. Supabase MCP down (5th week); read-only `scripts/db-query.sh` (people counts + key rows, history since 09-28, `coaching_waitlist`, `cta_experiment_events`, `host_reply_drafts`) + six production GETs.
- **Growth headline (verbatim):** _"comments stayed at their pre-July floor for a second week (0, then 2, against about 8 a week from mid-July to mid-September). The two surfaces built to bring them back have shown the gate to 32 humans since 10-03 and received 0 takes. Celebrity pages are sending the deepest readers on the site to the gate: 26 viewers, a median of about 6 minutes on the page, and none answered q567. The host digest works again (10-03: 8 drafts), but none of the drafts was posted. The week's best visitor answered, opted in to replies, got "Server error" twice when registering, and left."_ Week 09-28 (v2 RPC): 586 human visitors (35 returning), 2 comments, 2 contributors (0 returning), 1 registration, 1 booking (first in 26 weeks).
- **Biggest leak (verbatim):** _"the people who do activate get nothing back."_ 749 and 743 (email opt-ins) unanswered; 0 of 8 desk drafts acted; 2 people lost to `AuthWeakPasswordError` shown as "Server error" (`register/+page.server.ts:144-157`); mail blocked 34 days, 5 real people lost (211 today).
- **Shipped and pushed (`main` = `origin/main` at `54943c886`):** host digest rewrite + crawler-free gate + `contribution.path` + `/forgotPassword` fix + deploy-skew manifest v2 (`6f34ad64b`); live-take homepage + celebrity mid-article question (`3dfa99ef8`); T-38 Trump 3 vs 2 with 301 (`e4fe1d896`); T-41 B/D-L + IndexNow key (`d0984dab1`; IndexNow live, first submit 10-03 HTTP 202); search cleanup (13 pages, `audit:superlatives`, `enneagram-stress-number` 301'd, 16/17 people meta_titles synced) (`0d1beba58`); two scouts + queue refill + pipeline-lock fix + _Artificial_ explainer draft (`8b2852cfb`); 4 new MDsvex posts live + be-gentle promo packet (`e710d8a05`); beta card + `cta_experiment_events` (`34d66f4ba`); agent image-generation ban (`65a29e616`, `54943c886`).
- **Beta card observed live (client-rendered):** 16 views since 02:09 UTC today across 3 copy variants (14 celebrity, 2 Enneagram), 0 opens, 0 submits; `coaching_waitlist` 0 new since 10-04. Goal 10 signups by 11-15.
- **Content engine:** queue 0 -> 18 (4 entity gaps + 14 surging CREATEs); 10 v3 runs 10-04 -> 10-05 (pass: Andrew Garfield, Sam Altman; `insufficient_evidence`: Florence Pugh, Joseph Zada, Dario Amodei; `revise`: Druski, Tiger Woods; Tiger Woods repair failed "modified a read-only input"; Zada 10-05 run stalled at draft). **Andrew Garfield published 10-05 06:00** (DB 450 -> 451; first people publish in 25 days; prod 200), the day _Artificial_ premieres at NYFF. Publisher then died on `gen:all` (Node v26.5.0 engine error, same break on every auto-publish since 08-29; the 09-21 "v24 default fixes it" guess is disproved). Nightly create skipped both nights (DJ's manual runs held the lock).
- **Unapproved retypes on live-page drafts (none synced):** Sam Altman 4 -> 3 (verify pass, uncommitted; 5 published pop-culture posts + the unpublished `artificial-movie-real-people` call him 4), Dario Amodei 5 -> 6 (verify `insufficient_evidence`, uncommitted), Druski 8 -> 3 (committed, 2nd week undecided).
- **Still dark:** Instagram 59 days (queue RED 0/10, frozen 58), Quora + Twitter 139, outreach 62, One Take 72, The Nine 0 actions in 13 days, pop-culture 22 unpublished (oldest 294 days), 10 unfired packets (new be-gentle promo set included).
- **Next move (ranked, growth's bets adopted):** (1) DJ posts the desk drafts today, 749 + 743 first (~15 min). (2) `EMAIL_FOOTER_ADDRESS` into Vercel production (6th ask; local `.env` now has a value) + resend 211 / 09-29; delegate the weak-password message fix (~30 min agent). (3) Approve T-41 G q118/q203 seeds so celebrity pages rotate q118 before the 10-17 readout. Following: typing calls (Altman first, _Artificial_ window); pin Node 24 for the publisher + commit Garfield frontmatter + `index:blogs`; request indexing for 7 de-indexed people URLs; fire or drop the be-gentle packet.

### 2026-09-28 — Unattended weekly brief: contributions 9 -> 0 and the only retained contributor churned into an empty room; growth's #1 bet unshipped for the third week while DJ shipped 11 commits of SEO, cross-links, homepage, Talk-to-DJ and The Nine; content engine idle (queue empty 8 nights, 0 publishes in 18 days)

- Brief: [`docs/daily-briefs/2026-09-28_marketing-status.md`](../daily-briefs/2026-09-28_marketing-status.md). Growth freshness gate PASSED (growth-log `### 2026-09-28`, audit 06:00 -> 06:09:06, exit 0; chain on time). Headline + biggest leak quoted verbatim. Supabase MCP down (4th week); read-only `scripts/db-query.sh` (people counts, `blogs_famous_people_history` since 09-21) + two production GETs.
- **Growth headline (verbatim):** _"contributions went 9 -> 0, the first empty week since July. The one repeat contributor in the log came back, reloaded their own unanswered question nine times, lost their session, never got a reset email, and has not been seen since 09-22. The four takes owed a reply last week are still unanswered after 8 days. The host desk has been dead 16 days, mail has been off 26 days, and the new homepage is live but still sends nobody to a gate."_ Cohort 09-21: 4,391 new (651 search, most since 08-03), 459 engaged new, returning 1.50%, 1 signup, 0 profiles, 0 takes, gate 30 -> 0 (crawler-inflated: 17/30 no client visit). Contributor return **0 / 34 across eight matured cohorts**.
- **Biggest leak (verbatim):** _"a contributor came back and found nothing, so they left."_ `c4e88b00` loaded q570 nine times on 09-21, signed out, hit `/forgotPassword` twice, `recovery_sent_at` NULL, last seen 09-22 19:41. Takes 746/747/748/743 unanswered 8 days. Signup 209 (third real person lost to `EMAIL_FOOTER_ADDRESS`) failed 09-24.
- **Confirmed from git:** no commit since 09-21 touches cron / `hostDigest.ts` / `src/lib/email` / `giveFirstFunnel.ts` / `forgotPassword`; `host-digest` still no `maxDuration`; `EMAIL_FOOTER_ADDRESS` still empty locally. PM read: the loop repair is small and spec'd; it loses on attention, not merit. Proposed: delegate the host-desk fix to an implementation agent with DJ reviewing the diff.
- **Shipped this week (all pushed, `main` = `origin/main` at `01ab4e7ef`):** personality ISR live (prod 200 + `x-vercel-cache: HIT`); IndexNow submitter committed but no key file (not pinging); cross-link system (gate in lint+CI, `/crosslink-queue`, weekly OpenClaw job Thu 07:00, Jev audit) with 371 links, gate debt 66 -> 2, people->people pass synced 139 live rows 09-25; question-page rewrite + `ReplyOptInTray` (0 exposures); "Talk to DJ" `/book-session` rebuild + `talk_notes` (0 notes); homepage V2 Tier 1+2 live (still practice-only, live-take in preview); The Nine playbook + `pnpm nine:find` (never run live; Reddit account/app not created); GSC pulled fresh 09-24 (first since 08-13, unread); taskers T-38/39/40 (typing rewrites).
- **Content engine idle:** create queue EMPTY 09-21 -> 09-28 (Telegram nightly); publisher "No publishable draft" 8/8, blocker counts byte-identical; **0 people publishes since 09-10 (18 days)**, DB 450 / 134, disk 441 / 92. Shelton (8.5 B+ v3, images only) untouched since 09-20; Laver Cup peg passed. **Druski live refresh:** legacy chain 09-23 + v3 09-24; `verify-edit` hit 60-turn cap, verdict `insufficient_evidence`, provisional 8.1; committed draft retypes the live page **8 -> 3** (DB still 8, not synced) — DJ call required. New community draft `be-gentle-when-youre-right.md` (DJ voice memo + scaffolding).
- **Still dark:** Instagram 52 days (queue RED 0/10, frozen 51), Quora 132, Twitter 132, distribution (newest 07-14, oldest 214 days), outreach 55, One Take 65, pop-culture 21 (oldest 286 days), The Nine 0 comments.
- **Next move (ranked, growth's bets adopted):** (1) DJ replies to 746/747/748/743 + answers q570 today; host-desk fix delegated to an agent for DJ review; walk `/forgotPassword` on a phone. (2) Postal address -> `EMAIL_FOOTER_ADDRESS` (5th ask) -> re-arm 5 -> resend 208/209 -> test -> Enneagram batch. (3) Human-only `gate_shown` + `contribution.path`; homepage live-take queues behind. Following: Druski typing call; refill-or-pause the create queue; Shelton images; `seo-content-strategist` on the 09-24 GSC pull.

### 2026-09-21 — Unattended weekly brief: best takes on record landed on a host desk dead for 8 days; four reachable contributors got nothing; none of last week's bets shipped; DJ's week went to SEO infrastructure (GSC deploy-skew fix pushed; personality ISR + IndexNow sitting uncommitted); first v3 subject cleared 8.5 and then the create queue ran dry

- Brief: [`docs/daily-briefs/2026-09-21_marketing-status.md`](../daily-briefs/2026-09-21_marketing-status.md). Growth freshness gate PASSED (growth-log `### 2026-09-21`, audit exit 0 at 06:09:24; the Monday chain ran on time). Headline + biggest leak quoted verbatim. Supabase MCP down; one read-only `scripts/db-query.sh` query (people publish counts).
- **Growth headline (verbatim):** _"the best takes on record (median 367 chars, gate 33%) landed in front of a host desk that has been silent for 8 days. The week produced four reachable contributors, two anonymous reply opt-ins, a repeat contributor who posted 3 takes and asked a question, and a search visitor who answered and then registered 7 minutes later, and every one of them got nothing. None of last week's three bets shipped."_ Cohort 09-14: 4,598 new visitors (8-week high; 602 search, first drop in 4 weeks), 1 signup, 1 profile, 9 human takes, gate 18 -> 6 = 33.3% (held numerator, -40% denominator); contributor return **0 / 28 across seven matured cohorts**; waitlist 0, 22nd week.
- **Biggest leak (verbatim):** _"the same leak as last week, now with people standing in it."_ Host digest: last draft 09-12, last digest 09-13, 8 silent runs, 0/9 drafted; takes 743, 746, 747, 748 owed replies; no `maxDuration`, no run log, 48h lookback stranded 740-745. Mail: 19 days; the `process-sequences` 503 pre-check now blocks any retry; the 09-19 registrant's welcome failed 4 s after the first observed answer -> register conversion. Homepage: `/` 0/0 gate all week (was 15-19 fps/week in August); 0 of 131 home-entry sessions reached q203. Confirmed from git: no commit since 09-14 touches cron / hostDigest / email / giveFirstFunnel / questions / homepage.
- **SEO is where the week went.** Pushed 09-19 (`6a5ac24ad`, `809a1410f`): GSC page-indexing audit (indexed 464 -> 524, not-indexed 764 -> 490 since July; one real bug, deploy-skew `noindex` on ~11 good pages; fix `scripts/carry-over-immutable-assets.mjs`, needs one deploy to verify); `/contact` redirects; `enneagram-personal-growth` rebuild + `BehaviorDecoder.svelte` + wave-2 seed-takes doc. **Uncommitted, not live:** personality pages to Vercel ISR (gate + comments split to `GET /api/personality-analysis/[slug]/discussion`; in-function UA block removed on those paths; `personalityIsrContract.spec.ts`), `pnpm revalidate:personality`, IndexNow submitter `pnpm submit:indexnow`, 2025 test-comparison unpublished + sitemap entry removed, love-languages title 2026. DJ owes `BYPASS_TOKEN`, `INDEXNOW_KEY` + `static/<key>.txt`. Side effect for growth: `content_access_events` + `9tanon` stop firing on personality pages.
- **Content engine:** Ben Shelton passed the full v3 chain 09-20 (verify `pass`, release.json) and graded **8.5 B+ rubric v3**, `needs_review: false`; 09-20 publisher blocked it on images only (09-21 it left the top-8 list, unexplained). Rod Wave draft complete, `verify-repair` hit the 60-turn cap twice, ungraded, no release.json. Tom Rhys Harries FAILED permanently. Turn caps hit 4x this week (new v3 failure class); checkpoint resume works. Queue EMPTY at 02:00 09-21 (Telegram notified). Publisher "No publishable draft" 6/6 days; **0 people publishes since 09-10** (DB 450 / 134; disk 441 / 92). Node default now v24.18.0 (was 26.5.0), so `gen:all` should pass the engine check; unverified. Elizabeth Holmes refresh ran the full legacy chain 09-19 -> 8.0 B (v2), Stanford-date factual error flagged, 4,022 words; DB sync unverified.
- **Still dark:** Instagram 45 days (queue RED 0/10, frozen 44 days; 6th restore-or-retire ask), Quora 125, Twitter 125, 9 distribution packets (oldest 208 days), 7/8 Reddit + 0 founding-circle invites (held per growth), outreach 48 days, One Take 58 days, GSC performance CSV 39 days stale, pop-culture 21 (20 at 3+ months, 8th brief).
- **Next move (ranked, growth's bets adopted):** (1) DJ replies to 743/746/747/748 today; eng adds `maxDuration: 300`, a per-run digest log row that alarms on "human takes, zero drafts", last-success lookback. (2) Postal address -> `EMAIL_FOOTER_ADDRESS` -> re-arm 5 -> resend 208 -> header-checked test -> Enneagram batch; route the 503 alarm to Telegram. (3) Homepage fork: practice submit becomes the first take on q203 with `path='/'`, or reinstate the featured question; fix `contribution.path` in the same change. Following: Shelton images -> publish; land the SEO batch behind its two env vars; refill the create queue; Holmes date fix.

### 2026-09-14 — Unattended weekly brief: best gate week on record and nothing reaches the person afterward; mail blocked on a postal address that exists nowhere; the 09-10 homepage rebuild zeroed homepage gate exposure; correction: the publisher has been publishing

- Brief: [`docs/daily-briefs/2026-09-14_marketing-status.md`](../daily-briefs/2026-09-14_marketing-status.md). Growth freshness gate PASSED (growth-log `### 2026-09-14`, audit exit 0 at 11:07 on its third start; the Monday chain ran ~5h late). Headline + biggest leak quoted verbatim. Supabase MCP down; read-only `scripts/db-query.sh` checks only.
- **Growth headline (verbatim):** _"best activation week on record (gate 25%), and every one of the 7 contributors hit a dead end. 0 were reachable by email, the one host reply landed 4.8 days late on an anonymous take, and the first person ever to opt in to reply alerts never got a reply. Welcome mail is still off, 12 days now, and as of today it also blocks signup confirmations."_ Cohort 09-07: 4,213 new visitors (642 search), 0 signups, 0 profiles, 7 comments, gate 28 -> 7 = 25.0%; contributor return **0 / 31 across seven matured cohorts**.
- **Biggest leak (verbatim):** _"the loop reaches the answer and then has no way to reach the person."_ Host digest drafted 2/7 and replied once at 115h (no `maxDuration`, fixed 48h lookback). The first-ever anonymous opt-in (take 733) got nothing. The logged-in reply email had 0 eligible events.
- **Mail blocker sharpened:** per `docs/email-sequences/enneagram-launch-check-2026-09-10.md`, `EMAIL_FOOTER_ADDRESS` is absent from Vercel AND empty in both local env files. The missing input is DJ's postal address. It blocks welcome (4 errored), signup confirmation (`signups.id=208` failed today), and the Enneagram type-prompt campaign DJ approved and authorized 09-10 (31 eligible). The 09-09 alarm (`process-sequences` 500) is routed to nobody.
- **NEW, not in the growth audit:** `02b469175` (09-10 19:10 UTC) deleted the homepage's `getHomepageFeaturedQuestion()` server load; `2ca432d5b` promoted the static-practice `HomeLandingV2` (Harry Dry V2). DB: `/` had 21 `gate_shown` rows + 4 contributions 09-01 -> 09-10, last at 09-10 17:20 UTC, **0 since**. Homepage visitors flat (14-23/day). Gate fps ~5.3/day -> ~3.3/day across all paths. Small n, causal link inferred.
- **CORRECTION to the 09-07 and 08-28 briefs:** the auto-publisher did NOT lose Ryan Holiday, Freddie Mercury, Marcus Aurelius, Aaron Pierre or Jonathan Bailey. DB `published_at` is ~10:00 UTC on each job day, as it is for Zach Bryan (09-10). Only the post-publish `pnpm gen:all` fails on Node 26.5.0 (`scripts/daily-blog-publisher.sh:19` still bare `node`). "No publishable draft" also exits 1, so OpenClaw `error (46x)` is mostly noise.
- **Content engine:** DJ refilled the queue 09-09 (7 scout subjects, athletes deprioritized); pipeline v3 shipped 09-10 (`733de46af`) after `docs/content-analysis/blog-pipeline-audit-2026-09-09.md`. Nightly: Arthur Mensch ungraded/needsReview, Austin Abrams 8.1 held, Joseph Zada 8.4 held, Tom Rhys Harries research timeout. Manual: Nathan Fielder 7.9, Inde Navarrette 8.1 (untracked, not queued), Sandra Bullock refresh 9.0 (gate-blocked). Publishes: Bill Burr + Patrick Mahomes by hand, Zach Bryan by the job. DB 447 -> 450, disk 438 -> 441. Publisher candidates 75 -> 80. Abrams' _Resident Evil_ window opens 09-18.
- **Also this week:** comment ranking phase 2 live (09-07); question purge of 4 questions (48 -> 46 public, 09-10); Elizabeth Holmes + Adela refreshes; account page rebuild.
- **Still dark:** Instagram 38 days (queue RED 0/10, frozen 37 days), Quora 118 days, Twitter since 05-19, 14 distribution assets (oldest 201 days), 7/8 Reddit drafts, 0 founding-circle invites, outreach 41 days, One Take 51 days, GSC 32 days stale (retrofit read due ~09-09 not done), pop-culture 21 (20 at 3+ months).
- **Next move (ranked):** (1) DJ supplies the postal address -> Vercel env -> re-arm 4 + resend 208 -> header-checked test -> controlled Enneagram batch; route the alarm to Telegram. (2) Host-digest `maxDuration: 300` + last-success lookback; DJ replies to 733/735/737 today. (3) Decide whether `/` carries a live question again; have growth split gate exposure by surface before/after 09-10.

### 2026-09-07 — Unattended weekly brief (10-day window; 08-31 brief lost to a credit blackout): DJ shipped the whole post-answer loop, the welcome sequence has been dead in prod since 09-02 on a missing env var, and the content engine is stalled at both ends

- Brief: [`docs/daily-briefs/2026-09-07_marketing-status.md`](../daily-briefs/2026-09-07_marketing-status.md). Growth freshness gate PASSED (growth-log `### 2026-09-07`, audit exit 0 at 06:08); headline + biggest leak folded verbatim. Supabase MCP down this session; no DB re-query.
- **Growth headline (verbatim):** _"the loop fix shipped four hours after the week closed, the Reddit alpha's only answer was "Pooopin", and the welcome sequence has been silently dead in production since 09-02."_ Cohort 08-31: 4,489 new visitors, 0 signups, 2 typed profiles, 4 comments, gate 29 -> 3 = 10.3%, welcome 3/1/0 with 4 failed; contributor return **0 / 28 across six matured cohorts**.
- **Biggest leak (verbatim):** _"the only channel that has produced substantive answers is dead in production, and the fix for the standing leak is live but unmeasured."_ `src/lib/email/sender.ts:327` (commit `0f702b7ee`, 09-01) throws on missing `EMAIL_FOOTER_ADDRESS`; set locally, not in Vercel. 4/4 welcome enrollments `errored` at `failure_count = 3`. The same guard blocks `enneagram_type_prompt` and the founding-circle weekly-question email.
- **Shipped by DJ (`7db255b8e`, 09-07 00:21):** logged-in reply email default-on + one-click unsubscribe, 5 starter questions with 3 pins each, election q98/q168 flagged out, index pagination fixed, host desk + `/api/cron/host-digest` (13:00 UTC, first run today), `/admin/host-desk`, founding-circle tasker + 4 weekly-question drafts (0 invites). Closes 08-28 Rec #1 and the standing growth bet #1. Running, unmeasured.
- **Content engine stalled both ends.** Create: `backlog-queue.json` `"queue": []`, six nights (09-02 -> 09-07) produced nothing. Publish: eligible drafts selected 08-29/30/31/09-01 (Freddie Mercury, Marcus Aurelius, Aaron Pierre, Jonathan Bailey) all died on Node 26.5.0 at `pnpm gen:all`; DJ hand-published all four plus five more. Streak **29 -> 39**. `.nvmrc`=`22` added 09-03 but `scripts/daily-blog-publisher.sh` still calls bare `node` — fix unverified.
- **People:** disk **429 -> 438** published (all 9 by hand); DB corpus 447. 7 new drafts (Cara Delevingne, Demis Hassabis, Freddie Mercury, Laura Loomer, Naval Ravikant, Rebecca Yarros, Zach Bryan). Blockers: `missing_perspective_review` 83 -> 71, images 14 -> 9, `content_quality_below_8.5` 35 -> 26. Perspective-review dirs 34 -> 49, **all +8 to new drafts, zero backfill (4th brief)**. Closest: `zach-bryan` 8.9 images-only.
- **Reddit is now a live channel, previously unlogged here.** `reddit/` (08-30): 8 sequenced drafts + README with positioning guardrails. #05 r/alphaandbetausers fired ~09-03 (`utm_campaign=alpha_beta_answer_first_20260831`, `/link/567`): 6 fps -> 1 contribution ("Pooopin"); 4 bounced <=5s; 1 hit `/register` twice and failed. 7 of 8 unfired.
- **Still dark:** Instagram 31 days (queue RED 0/10, frozen 30 days, zero execution crons; 4th restore-or-retire ask), Quora 111 days, Twitter since 05-19, 14 distribution assets (oldest 194 days), outreach 34 days, One Take ep 1 44 days, GSC snapshot 25 days stale (a targeted Friedberg pull on 09-01 proves access works), pop-culture 21 unpublished (17 of 18 real drafts 3+ months).
- **Also new:** T-37 information-diet campaign tasker (08-29) + community draft `the-world-is-burning-shared-agency.md` (2,382 words); 09-01 entity-gap scout (Dylan Patel CREATE on hold at DJ's direction; Friedberg unsourced claim fixed; Ashby/Coogan/Hormozi retrofit read due ~09-09); `.codex/skills/social-media-slam` + `social-media-onboarding`; security audit + 3 migrations 09-03; Resend sender/webhook + `process-email-events` cron 09-01.
- **Next move (ranked):** (1) set `EMAIL_FOOTER_ADDRESS` in Vercel, re-arm the 4 errored enrollments, add an errored-enrollment alarm; (2) refill the create queue + pin Node in the publisher wrapper in one sitting; (3) send founding-circle invites in a 48-hour window and run the loop as one named 4-week experiment, fixing `contribution.path` in the same change. Hold the 7 remaining Reddit drafts until (3) is running.

### 2026-08-28 — Midweek pulse: answer activation improved; relationship formation, attribution, and distribution are now the constraints

- Brief: [`docs/daily-briefs/2026-08-28_marketing-status.md`](../daily-briefs/2026-08-28_marketing-status.md). Manual off-cycle run after the wrapper's embedded Claude process returned `Not logged in`; production SQL, PostHog, repository state, OpenClaw state, and logs were inspected directly.
- **Activation moved:** matched Monday-Friday comments **1 -> 4** and native gate conversion **3.3% -> 15.4%**. PostHog's dedicated question-page funnel moved from **11 -> 0 -> 0** to **7 -> 4 -> 4 (57.1%)**. The sample is small, but all four starts completed.
- **The 08-24 findings were acted on that afternoon:** `fd61b4788` removed the contribution-based welcome exit and restored the affected enrollment, persisted the strategic reveal's type choice, fixed false self-referral, and wrapped the nightly pipeline in `caffeinate -i`. Dormant reactivation is now `draft`; zombies is `paused`.
- **Identity began working:** two registrations reached PostHog and one profile supplied Type 9. The reveal persistence path has not yet received a qualifying post-change use.
- **The leak moved to relationship formation:** all four first-time contributors saw the reply opt-in, but **0 focused, submitted, or subscribed**; the answers received 0 replies and none of the contributors returned. The registered contributor who answered exited welcome as `unsubscribed`, not through the removed guard.
- **Traffic rose without a proven channel:** regular-human people **1,077 -> 1,289 (+19.7%)**, driven by direct/unknown (**504 -> 715**); organic people were flat/down (**562 -> 554**) and cross-week returners stayed **15 -> 15**. Direct/unknown question people rose 5 -> 24, but there is no UTM to identify the source.
- **Content creation recovered, publishing did not:** four clean nightly drafts landed; disk published count **423 -> 429**. The people publisher has **29 consecutive errors**; today's eligible Ryan Holiday run failed because OpenClaw launched Node 26.5.0 against the repo's `<25` engine rule. Doctor reports Node 24 missing from the service PATH.
- **Distribution remains inactive:** Instagram is 21 days dark with 0/10 approved and no execution cron; Quora is disabled and ~101 days dark; the GSC snapshot is 15 days stale. No external post, email, or campaign was fired during this audit.
- **Next move:** redesign the post-answer reply/subscription promise first, then run one tagged question-distribution test. Repair the publisher runtime before the next morning run; decide whether Instagram is being restored or retired.

### 2026-08-24 — Unattended status brief: DJ shipped type capture 08-21 and the growth audit recorded it as unshipped; publisher autonomously dark 25 days; new host-sleep failure class; IG unscheduled for a 2nd week

- Brief: [`docs/daily-briefs/2026-08-24_marketing-status.md`](../daily-briefs/2026-08-24_marketing-status.md). Covers 7 days.
- **Growth freshness gate PASSED:** weekly audit ran today (growth-log newest entry `2026-08-24`, `logs/growth-automation/audit-2026-08-24.log` exit 0 at 06:17); headline + biggest leak folded verbatim.
- **Growth headline (verbatim):** _"the record week did not compound (17 -> 3 comments, 0 of 6 returned) — and the reason is now a specific row: 9takes exited its best-ever user from its only nurture sequence with `exit_reason = 'answered_question'`."_ Complete week 2026-08-17: 3,972 new visitors, 0 signups, 0 profiles, 3 comments, gate 35 -> 3 = 8.6% (was 12.0%). Fifth consecutive matured cohort at 0% return.
- **Biggest leak (verbatim):** _"9takes systematically silences the users it activates. The loop has no return leg at all — and this week the code that does it was located."_ 91.5% of contributions never receive a reply (59 comments, 5 replies, 10 weeks); `src/lib/server/welcomeSequenceGuards.ts:8-15` ejects a contributor from the only nurture sequence the moment they contribute. It has fired exactly once in the table's history — on `hinder_86@hotmail.com`, last week's anon -> register -> 9-contribution star, who has not returned.
- **CORRECTION TO THE GROWTH RECORD — the most important item in this brief.** The audit states _"Product shipped this week: nothing on any standing bet. 13 commits, all content."_ That is wrong. Commit `e62c71c55` (2026-08-21 11:59) shipped: an **optional Enneagram selector on `/register` that persists to `profiles.enneagram`** (`+page.server.ts:25,74,169-173`), a **type selector on the `StrategicQuestion` post-contribution reveal**, a new `src/lib/analytics/marketingEvents.ts` (`reveal_completed` / `email_signup_completed` / `type_selected`), `src/lib/server/posthogCapture.ts`, `register.page.server.spec.ts`, and `supabase/migrations/20260821153551_enforce_homepage_chorus_readiness.sql`. This is the 08-17 brief's Recommendation #1 and growth's two-audit-old #1 bet. It landed three days before the audit ran.
- **The reveal half is measurement-only.** `/register` persists the type; the reveal selector does not — `selectType()` fires a PostHog event and renders "Saved for this visit." The surface with 35 weekly gate fingerprints captures nothing durable; the surface with ~1 does. Verified from the diff and current file contents, not from production behaviour — `/register` drew 1 fp in the measured window, so there is no outcome data yet.
- **Publish: auto-publisher autonomously dark 25 days** (last self-publish `jack-antonoff` 07-30), failed all 7 mornings 08-18 -> 08-24, now 24 of the last 25 days. Six profiles shipped anyway, all by hand: Keira Knightley, Alexandr Wang, Victoria Justice, Margaret Qualley, Yang Zhilin, James Clear. Disk `published: true` **417 -> 423**. **Victoria Justice and Keira Knightley — named unblocks in five consecutive briefs — are CLOSED.** Rate fell 1.7/day -> ~0.86/day.
- **Perspective-review backlog provably cannot drain itself.** Blocked count 89 -> 86, and only because drafts were published out from under it. Perspective-review dirs 25 -> 34, but **all +9 went to new nightly drafts; zero backfill occurred.** Second brief carrying the same unanswered fork (grandfather pre-08-04 vs. batch `--resume`).
- **Image debt regressing after being declared solved:** `missing_full_image` and `missing_thumbnail_image` both **7 -> 12**. New drafts outrun the portrait step. Other blockers flat: source_standard_failed 47, grade_stability_delta 38 -> 37, content_quality_below_8.5 34 -> 35, stale_grade_rubric_v1 29.
- **NEW failure class — host sleep.** Both 08-24 nightly runs died on `API Error: Your computer went to sleep mid-response`, burning 6,248s + 1,555s then 1,989s + 1,287s (~3h) for zero output; `nate-bargatze` at retry 2/3, job now `error (2x)`. Third distinct unbounded-runtime outage in three weeks (08-08 ENOTFOUND 5,664s; 08-10 credit exhaustion; 08-24 sleep). **The 600s Stage-1 ceiling has never once fired.**
- **Create quality otherwise strong** 08-18 -> 08-23: Bill Burr **8.9** (best in weeks), Jonathan Bailey 8.7, Alexandr Wang 8.6, Patrick Mahomes 8.6, Ms Rachel 8.1, Liang Wenfeng fail_after_revision/ungraded (ran 14:13, 129 min, 7 stage warnings). **The long-sought Type 2 Instagram anchor `ms-rachel` arrived and graded 8.1 with a 0.5 instability delta — below the gate.** Closest to publish: `jonathan-bailey` and `simone-biles`, images only.
- **Instagram unscheduled for a 2nd week:** 9 OpenClaw jobs, zero Instagram. Sessions dark 17 days (last artifact 08-07), warmup logs 14 days, engagement-targets doc 17 days. Content-ops queue frozen 21 days, still 0/10 approved, **15 of 22 items past target** (worst: `ig-chappell-roan-reel` 20 days over). Reels experiment-log untouched 21 days; no native 9takes Reel ever posted; Odyssey window expired.
- **SEO:** GSC `latest.json` still runDate 08-13 — T-09 clean window (05-05 -> 08-11) **holds and has still not been used**; `seo-content-strategist` has not been run against it. corpus-stats + crosslinks + sitemap regenerated 08-23 (sitemap 679 URLs, was 674). NEW tooling: `scripts/audit-internal-anchor-text.mjs` + `docs/content-analysis/internal-link-anchor-audit.md` (08-22) — **0 high / 0 medium / 0 review** across 4,127 internal links.
- **Also flagged:** `enneagram_type_prompt` is BUILT and sitting in `draft` with 137 addressable untyped profiles; `reactivation_dormant` sent 48 more emails against an explicit stop recommendation (cumulative 275 sends / 1 click / 4 unsubs / 0 real returns); attribution bug worse at **86.3% self-referral** (was 84%); gate exposure ceiling confirmed at **0.88% of traffic** — `StrategicQuestion` in 3 of 824 blog files, verified on disk this run; coaching waitlist dead 20 weeks.
- **Unchanged / aging:** Quora **97 days dark** (9th brief); 14 distribution assets unfired (33 days, 5th brief); pop-culture 18 unpublished (7th brief; oldest 2025-12-15, 17 of 18 are 3+ months); ~42 non-people drafts outside the publisher entirely; One Take ep 1 unfilmed 30 days; reactivation pause pending 3 weeks; Twitter no session artifacts since 05-19.
- **Owner:** DJ. Top asks: (1) re-baseline growth around the now-live typing surfaces and decide whether the reveal selector should persist, (2) invert the welcome exit guard + flip `enneagram_type_prompt` out of `draft`, (3) answer the perspective-review fork, (4) restore or retire Instagram and add the missing runtime guards. Full list in brief §"Open questions for DJ".

### 2026-08-17 — Unattended status brief: 08-10 credit blackout ate a whole week's automation; IG crons GONE from the scheduler; image blocker solved but a new perspective-review gate stranded 89 drafts

- Brief: [`docs/daily-briefs/2026-08-17_marketing-status.md`](../daily-briefs/2026-08-17_marketing-status.md). **Covers ~12 days** — the 08-10 Monday brief never ran.
- **Growth freshness gate PASSED:** weekly audit ran today (growth-log newest entry `2026-08-17`); headline + biggest leak folded verbatim.
- **Growth headline (verbatim):** _"record contribution week (17 comments, 12% gate conversion, first anon->register->contribute session ever) — and the mechanism behind '88% untyped' is now fully traced: the product has no typing step anywhere."_ Contributions 4 → **17** (record), gate conversion 5.4% → 8.3% → **12.0%**, first-ever anonymous → register → contribute session (one human = 53% of the week), first real long-tail return (26 days). **Biggest leak (verbatim):** _"9takes never types anyone, so the personalized payoff its entire product promise rests on cannot be delivered."_ Traced in code: `/register` has no `enneagram` field; `/enneagram-test` is not a test (H1 "There's no checkbox quiz here", 42 fps / **1.6s** median engaged); `/account` is the only typing surface (**6 fps in 8 weeks**).
- **ROOT CAUSE of the missing 08-10 brief — Claude usage-credit exhaustion took out four jobs simultaneously.** Identical `You're out of usage credits` string in `audit-2026-08-10.log`, `brief-2026-08-10.log`, `warmup-2026-08-10.log` and `cron-2026-08-10.log`. IG warmup failed the same way on 08-09. No credit-exhaustion guard exists; jobs exit 1 silently.
- **Instagram is UNSCHEDULED, not merely dark.** `openclaw cron list` returns 9 jobs, **zero Instagram**. The three warmup crons migrated 07-26 (see memory `[[blog-automation-scheduler]]`) are gone; only two `systemEvent` text reminders remain. Last warmup log 08-10, last session artifact **08-07 (10 days)**. Engagement-targets doc last written 08-07.
- **Image blocker SOLVED — the #1 blocker in three consecutive briefs.** `missing_full_image` **56 → 7**, `missing_thumbnail_image` **56 → 7**, via a portrait pipeline shipped in the gap (`scripts/prepare-personality-image.sh`, `check-build-budgets.mjs`, `build-budgets.json`, two "accept staged portrait library baseline" commits). Biggest quiet win of the period; it went un-briefed.
- **NEW #1 blocker and it is structural: `missing_perspective_review = 89` of 91.** Gate landed ~08-04/08-06. Only **25** perspective-review directories exist on disk, all produced by the nightly pipeline since 08-04. Each legacy draft needs its own `scripts/run-blog-pipeline.sh <Person> --resume`; there is no backfill path. **89 finished drafts are unreachable by the auto-publisher.**
- **Publish flipped jammed → fast, but entirely by hand.** Disk `published: true` **401 → 417 (+16)**; DJ hand-published **12 profiles 08-12 → 08-16** (Beckham, Nolan, Carl Jung, Adela, Duke Dennis, Phoebe Bridgers, Ibai Llanos, CaseOh, Ben Shapiro, Madelaine Petsch, Simon Sinek, MGK). Auto-publisher **failed 16 of the last 17 days**; last autonomous publish **07-30 (jack-antonoff, 18 days)**. Working loop is now: nightly create → perspective review → portrait → **DJ publishes manually**, ~1.7/day.
- **Create healthiest it has been:** clean nightly runs 08-11 → 08-17. Carl Jung **9.0 pass**, Simone Biles 8.6 pass, Tyla 8.6 pass, Duke Dennis 8.4 pass; Chase Infiniti 8.2 and Charlize Theron 8.0 both `fail_after_revision`. **Perspective review, not grade, is the new quality choke** (4 pass / 2 fail / 1 needs_revision / 1 reviews_incomplete over 8 runs).
- **GSC T-09 CLOSED after four briefs:** `latest.json` runDate 08-13, window **2026-05-05 → 08-11**, starting one day after the 05-04 URL fix. First clean measurement window; `seo-content-strategist` is now runnable on uncontaminated data.
- **Two growth record corrections that invalidate prior briefs:** profile `9ce7ff91` — counted 07-20 / 07-27 / 08-03 as a reactivated Type-8 user and the only multi-day returner — **is DJ**. Coaching waitlist has been dead **19 weeks, not 10–12** (last row 2026-04-06).
- **New confirmed instrumentation bug:** `src/routes/api/analytics/page-view/+server.ts:12-25` self-referral fallback labels **3,271 of 3,913** first-touch fingerprints as `9takes.com`. **84% of traffic has no usable source** — every channel-attribution question in the last seven briefs is unanswerable until fixed.
- **Also flagged:** 08-08 API `ENOTFOUND` outage burned 5,664s + 5,450s on two create runs (600s ceiling did not apply); recurring `wrapper likely killed post-pipeline` reconciles (08-10, 08-17); daily `khabib-nurmagomedov:citations` non-HTTPS lint noise. Previously under-reported non-people backlog: **community 16, enneagram 16, guides 8 unpublished** — ~40 drafts outside the people publisher entirely.
- **First One Take artifact ever:** `docs/marketing/one-take/founder-origin-arc.md` (08-13). Ep 1 still unfilmed, 23 days after "ready."
- **Unchanged / aging for 14 days:** Reels E1 decision produced nothing (queue.json + experiment-log both untouched since 08-03, 0/10 approved, no native 9takes Reel ever posted, Chappell Roan 13 days past target); Odyssey window ~half expired; Quora **90 days dark** (8th brief); 14 distribution assets unfired (26 days); pop-culture 18 unpublished (6th brief); reactivation pause pending since 08-03; growth bets #1/#2 un-green-lit.
- **Owner:** DJ. Top asks: (1) green-light the cheap `/register` type selector, (2) decide grandfather-vs-backfill on the 89 perspective-blocked drafts, (3) restore or formally retire the Instagram crons. Full list in brief §"Open questions for DJ".

### 2026-08-05 — Status brief: Reels E1 confirmed (26–45x) with nothing acting on it; IG drafting theory falsified; create recovered but all 3 new drafts below bar

- Brief: [`docs/daily-briefs/2026-08-05_marketing-status.md`](../daily-briefs/2026-08-05_marketing-status.md).
- **Reels E1 CONFIRMED, stronger than hypothesized** (08-03 insights pull in `docs/instagram/reels/experiment-log.md`): one 2-second Reel reached 375 accounts vs 8–21 views for every carousel — 26–45x; 98.4% of account views from Reels; 94.3% non-followers. Logged decision: promote Reels to the spine. **Not yet acted on:** queue still 16 carousels / 6 Reels, native 9takes Reel never posted, Chappell Roan Reel missed its 08-04 target (`copy_ready`), One Take ep 1 frozen since 07-25. Robert Greene carousel confirmed the ceiling: 8 views / 1 like at 24h.
- **Time-boxed opening:** Nolan's Odyssey — both major niche accounts posted Odyssey personality content within 24h; a nine-character Odyssey cast read is the most native available idea, stale in ~a month. Recommendation #1: ship it as the first native 9takes Reel.
- **IG comment leg: v6 falsified the drafting theory.** 3 final-copy comments delivered 08-04 + 3 more 08-05, none posted; 7 sessions, 0 comments total. Agent's fork to DJ: authorize auto-posting the top suggestion, or retire the leg. It also recommends retiring the 48/43-day owed replies. Counter-evidence on record: the one posted comment (Jul 02) drew 86 likes.
- **Create pipeline recovered** (stableronaldo filename bug resolved): StableRonaldo 8.4 B (image-blocked), Nara-Smith 8.1 (perspective fail_after_revision, manual 08-04 run), Caitlin-Clark 7.9 C (regrade dropped from 8.4) — **all below the 8.5 gate.** Publish at 6 straight zero days (nothing since jack-antonoff 07-30); the 08-05 publisher run died silently (53-byte log, new failure signature). Standing no-Canva unblocks for the 3rd brief: victoria-justice, keira-knightley (supervised regrades); christopher-nolan images-only. `missing_full_image` 54 → 56.
- **NEW outreach artifact:** `docs/outreach/2026-08-04_nine-mirrors-podcast-pilot.md` — Nine Mirrors audience-signal-map pilot (Huberman / Ferriss / Theo Von), drafting only, nothing sent.
- **Unchanged:** Quora 78 days dark (7th brief); 14 distribution assets unfired; pop-culture 18 unpublished (5th brief); growth bets #1/#2 + NineChorus fix un-green-lit (3rd audit); reactivation pause pending (stop condition met 08-03); GSC still short of T-09 clean window; content-ops 0/10 approved.
- **Owner:** DJ. Top asks: green-light Odyssey Reel, answer the IG auto-post-or-retire question, green-light growth bets, pause reactivation, fire the two regrades.

### 2026-08-03 — DJ closed the Instagram fork; Robert Greene published with weak early traction

- **Decision:** fold reply drafting into `/instagram-warmup`, but keep posting manual/asynchronous. The new contract returns 0–3 grounded suggestions and is allowed to return zero; generic comments that could fit another post are rejected.
- **Why:** DJ uses the suggestions opportunistically, but the prior split workflow produced too much generic, inauthentic copy and too little value.
- **Robert Greene:** published on Instagram 08-02. The existing dashboard snapshot confirms the weak start: **8 views / 1 like** at ~24 hours. Queue moved `qa` → `published`; the live URL and 7-day metrics are still needed. The current experiment read points to carousel distribution, not necessarily the Greene creative itself.
- **Create pipeline:** canonical filename resolution approved across both the pipeline and nightly wrapper; `stableronaldo` should resume the existing `Stable-Ronaldo.md` after create rather than spend retry 3/3 or overwrite the draft.

### 2026-08-03 — Unattended status brief: DJ broke the publish drought by hand, then it re-jammed on image debt; create hit a filename bug; growth reversed

- Brief: [`docs/daily-briefs/2026-08-03_marketing-status.md`](../daily-briefs/2026-08-03_marketing-status.md).
- **Growth freshness gate PASSED:** weekly audit ran today (growth-log newest entry `2026-08-03`); headline + biggest leak folded verbatim.
- **Growth headline (verbatim):** _"the 07-20 spike did not compound — contributions 14 -> 4, and the matured cohort returned 0 of 9. Root cause candidate found: 82% of registered profiles have no Enneagram type."_ Native gate conversion 16.3% → **5.4%**; six straight days of zero contributions (07-29 → 08-03) on 23 gate fps, with gate volume holding (conversion drop, not exposure drop); last week's 22% contributor return was an artifact and corrects to **0%** under a strict `>24h` window. New leak: **the loop turns once and dies** because the reveal has nothing to personalize with. Register-page conversion is strong and starved (4 fps → 3 profiles; 0.1% of visitors reach it). PA dwell best in window (25.6s) and converts ~0.
- **Publish drought BROKE — by hand, not by cron.** Ten drafts carry publish dates 07-27 → 07-30 (disk `published: true` **392 → 401**), but the auto-publisher shipped only jack-antonoff (07-30). The other nine were manual, with supervised regrades visible in frontmatter (Mira-Murati 8.4 → 8.6, Jason-Sudeikis 8.1 → 8.5, both v2). This executed the 07-27 brief's Recommendation #2.
- **Then it re-jammed: 4 straight publish failures 07-31 → 08-03.** Top blocker class **flipped from stale grades to missing images** — `missing_full_image=54` / `missing_thumbnail=54` now beats `stale_grade_rubric_v1` (34 → 30). Images are manual Canva only per `[[type-image-pipeline]]`, so the dominant blocker has no automation path. No-image unblocks available: **victoria-justice** and **keira-knightley** (regrade delta + epigraph tag each); **christopher-nolan** needs images only.
- **NEW create bug, deadline-bound:** `scripts/run-blog-pipeline.sh:109` builds `DRAFT_PATH="src/blog/people/drafts/${PERSON}.md"` from the queue name. Cron passed `stableronaldo`; create wrote `Stable-Ronaldo.md`. Nine downstream stages skipped **twice** (08-02, 08-03) on a good draft sitting on disk. `retryCount: 2` — tonight is retry 3/3. Narrow class: only breaks on single-token handles that are really two words (APFS case-insensitivity covers `caitlin-clark`). The 08-03 wasted run doubled as a verify pass and caught three factual errors the 08-02 run self-certified clean.
- **Instagram: sourcing healthiest ever, output still ZERO.** Clean warmups 07-30 → 08-02 on the dedicated profile; **new failure mode 07-28/07-29 — Claude weekly usage cap** (`You've hit your weekly limit`), not session eviction. Zero comments posted for 4+ consecutive sessions; newest replies doc is 07-26 (8 days). Melissa owed ~46 days; Candice first touch queued on the 8th consecutive scan. **The warmup agent escalated a two-option fork to DJ:** fold reply-drafting into the warmup cron, or cut the job to 2-3x/week and accept sourcing-only. It recommends the former.
- **Content-ops queue live and RED:** 22 items, **0/10 approved or scheduled**; Robert Greene in `qa` targeting 08-03 (today) awaiting only DJ's review; Chappell Roan Reel targets 08-04.
- **Growth's standing PA port is now BLOCKED:** `NineChorus.svelte` retokenized 07-29 (`84c055bd`) removed hardcoded fallbacks for `--night-900` / `--ink-50`, which are undefined in `src/scss/index.scss`; light-mode PA visitors get a near-white panel with a ghost CTA. Verified still unfixed on disk. Fix contrast before porting.
- **SEO:** GSC refreshed 08-01 (runDate 2026-08-01) but window starts 05-01, straddling the 05-04 URL fix by 3 days — T-09's clean `--days 69` spec still unmet. corpus-stats + sitemap + crosslinks regenerated 08-02/08-03.
- **Unchanged:** Quora **76 days dark**; 14 distribution assets unfired; pop-culture 18 unpublished (4th brief running); signups 0 (5th week); waitlist 0 (10 weeks); outreach unchanged since 07-15.
- **Owner:** DJ. Open decisions in brief §"Open questions for DJ": create-bug fix tonight, publish image-debt policy, IG fork, Robert Greene approval, growth bets + NineChorus sequencing, pause reactivation, T-11 treadmill, GSC clean window, Type 2 anchor gap, Quora + distribution standing calls.

### 2026-08-02 — Instagram content-ops agent and single production queue launched

- Created focused `instagram-content-ops` agent plus `/marketing-content-sprint`; the existing `marketing-pm` remains the cross-channel status owner.
- Canonical queue: [`docs/marketing/content-ops/queue.json`](./content-ops/queue.json). Validation: `node scripts/check-marketing-content-queue.mjs`.
- Baseline is honest and RED: **0/10 approved or scheduled**, **12/15 copy-ready or later**, **20/20 triaged or later**, design WIP **3/3**. The bottleneck is rendering/QA/approval, not ideas.
- Seeded five campaigns and the first three weeks of target dates. Operating default: 5 feed posts/week split 3 carousels + 2 Reels, with story support and a 14-day approved buffer.
- First item advanced: Robert Greene two-slide lore carousel moved from `copy_ready` to `design_ready`; locked production brief at [`docs/marketing/content-ops/briefs/robert-greene-lore-carousel.md`](./content-ops/briefs/robert-greene-lore-carousel.md).
- Next: render and QA Robert Greene before opening more design WIP; then Chappell Roan Reel and Pedro Pascal lore carousel.
- Owner: `instagram-content-ops`; DJ retains approval and publishing boundary.
- **Same-run production update:** Robert Greene is now rendered and passed internal visual/dimension QA at 1080x1350. Queue moved to `qa` with exact assets recorded; current WIP is design **2/3**, QA **1/2**. DJ's review is the only gate before `approved`.
- **Format refinement:** Personality Lore Stack is now a three-slide contract: cover → lore → **“A Window Inside.”** The third slide is an evidence trail—not an analysis grid: four to six dated moments, exact short quotes, concrete choices, documented evolution, and one final open question. Reusable contract: [`docs/marketing/content-ops/templates/window-inside-slide.md`](./content-ops/templates/window-inside-slide.md). Robert Greene is the first test case, rebuilt around five records from 1960s Baldwin Hills through the 2018 stroke and his post-stroke work on the sublime.
- **Color-harmony pass:** The complete Robert Greene carousel now follows the approved contained-violet portrait plan. The source violet stays inside a `#2C1F28` media well under the calibrated filter; the competing amber eye bar is gone. Amber is limited to illuminated kickers and closing question fields, canonical Type 5 sky carries dossier data, and passive chrome/dividers are neutral stone and ink. All three exports passed full-size and 25%-scale visual review without modifying `static/types/`.
- **Layout cleanup after review:** Removed the visible portrait card and centered Greene in a borderless full-width well; expanded the six lore rows to the safe-area edges; replaced the evidence diamonds with circular markers centered on the timeline; aligned headers back to the brand chrome while preserving the wider data rows.

### 2026-07-27 — Unattended status brief: best contribution week ever; publish jammed 7 days; IG session FIXED but posting at zero

- Brief: [`docs/daily-briefs/2026-07-27_marketing-status.md`](../daily-briefs/2026-07-27_marketing-status.md).
- **Growth freshness gate PASSED:** weekly audit ran today (growth-log newest entry `2026-07-27`); headline + biggest leak folded verbatim.
- **Growth headline (verbatim):** _"best contribution week ever (14 comments, 10 humans), the gate escaped the questions ghetto and converts 15-19% — but 9 of 10 contributors evaporate as unreachable fingerprints."_ Homepage placement of q567 converts **18.8% native**; first PA Chorus take since June (robert-pattinson); `nine_user_takes` 3 → 11; reactivation_dormant LAUNCHED (50 enrollments, 12 opens, 0 clicks). New #1 leak: **anonymous contribution evaporation** — 0 emails captured at the contribute/reveal moment. Growth's #1 bet: post-contribution identity capture (one email field). Still dead upstream: 0 signups 4th week, waitlist 0 for 9 weeks.
- **Pipeline swapped states again — create recovered, publish jammed 7 straight days.** Create shipped 6 (Travis Kelce 8.6 on retry, Nolan 8.9, Yang Zhilin 8.7, Sadie Sink 8.3, CaseOh 8.6, PlaqueBoyMax 8.4 needsReview) and hit its 5/wk cap; publish shipped **0 since julia-fox 07-20**. Structural blocker: 92 of 94 unpublished drafts on stale v1-rubric grades (52 of them ≥8.5). Fastest unblock named by today's log: **victoria-justice** (v2 9.0, needs only supervised regrade delta + epigraph tag, no images).
- **Instagram REVERSED:** dedicated per-brand Chrome profile live; first clean session 07-26 PM (matches memory `[[instagram-session-eviction]]`). Bottleneck moved to posting: reply queues drafted (07-25 + 07-26 PM docs) but nothing posted in 5+ passes — Melissa owed ~38+ days, Candice first-touch queued 5x. Standing order: `/instagram-reply` on the 07-25 doc FIRST.
- **SEO refreshed:** GSC `latest.json` now runDate 2026-07-25 (closes last brief's staleness flag); corpus-stats + crosslinks regenerated 07-26.
- **Distribution grew to 14 unfired** (new: `blackpill-social-package-2026-07-22/`); Quora ~69 days dark; outreach unchanged.
- **New parallel workstream observed (untouched):** blog evidence enrichment — `docs/blog-enrichment/` Elon Musk pilot (`enriched-local`), `EvidenceFigure.svelte`, blogEvidenceMedia lib; uncommitted product/design work in flight.
- **Owner:** DJ. Open decisions in brief §"Open questions for DJ": identity capture green-light, PA above-fold port, victoria-justice regrade + v1 batch-regrade call, PlaqueBoyMax review, IG reply execution + browser rename, reactivation segment hold, fire distribution, Quora revive/retire.

### 2026-07-20 — Unattended status brief: growth loop PROVEN to work; publish valve reopened; create timed out; IG escalated dark

- Brief: [`docs/daily-briefs/2026-07-20_marketing-status.md`](../daily-briefs/2026-07-20_marketing-status.md).
- **Growth freshness gate PASSED:** the weekly audit ran today (growth-log newest entry `2026-07-20`), so the brief folds its headline + biggest leak verbatim.
- **Growth flipped positive for the first time.** Comments **0 → 9** (highest contribution week in the window), the native `contribution` event fired end-to-end on masking question 567 (T-12 wave 1), and Chorus `nine_user_takes` moved **1 → 3** — the "likely silent Chorus bug" caveat from every prior audit is **resolved: the mechanic works.** One full loop turn (n=1, real): profile `07d2e6c9` registered 07-16 → welcome_sequence → 5 comments in ~90 min → returned 07-18 for 3 more. Wall conversion 12% inferred / 8.3% native. **Honesty flag:** the 9 comments are ~one new human — not a trend yet.
- **Biggest leak (verbatim):** _"the give-first loop is now PROVEN to work, but it is quarantined to ~0.6% of traffic… the working path isn't where the traffic is."_ PA takes the 4,260-visitor firehose with no capture → **0 signups / 0 identity for the 3rd straight week** (waitlist 0 for 8 weeks). Growth's #1 bet: port the proven give-first/Chorus reveal above the fold on personality-analysis (product/eng scope).
- **Publish valve REOPENED** (last brief's 3-day jam cleared). 10+ people posts shipped 07-18→07-20: Benny Blanco, Joe Lonsdale, Kacey Musgraves, **Kaia Gerber**, Lamine Yamal, Madonna, **Milly Alcock** (07-13 scout pick), **Oliver Tree**, Pete Hegseth, PinkPantheress; **julia-fox published today** (Type 4, grade 8.5, row 1088). Kaia Gerber (grade-delta) and Oliver Tree (image) were both blocked last brief and cleared without marketing-pm intervention. People disk 382 → 391 published.
- **CREATE regressed.** Tonight's cron target `travis-kelce` produced **no draft** — Stage 1 create timed out (research agent exceeded the 600s background ceiling; ran 957s). `halt_reason: draft_missing_after_stage_1_create`; retry 1/3 queued. Different signature from the earlier `oliver-tree` API refusals (timeout, not refusal); same net result.
- **Instagram fully dark and ESCALATED:** every warmup 07-14→07-19 `BLOCKED`; **17 of last 20 runs** blocked. 07-19 regression — @9takesdotcom dropped out of the account picker entirely; one-tap re-login gone, DJ must retype full handle + password via "Log into an Existing Account." Matches memory `[[instagram-session-eviction]]`.
- **SEO refreshed today:** corpus-stats.md + crosslink index regenerated 2026-07-20. GSC `latest.json` unchanged (still runDate 07-06, ~16 days stale).
- **Unchanged:** 13 distribution assets unfired (9 packets + 2 carousels + 2 IG variants); Quora ~62 days dark; email starved (4 sends/3 opens/1 click, welcome_sequence live).
- **Owner:** DJ. Open decisions in brief §"Open questions for DJ": PA give-first port, scale q567, create-timeout fix (`forceNext`/raise ceiling), IG re-login + dedicated profile, fire distribution, Quora revive/retire, GSC refresh.

### 2026-07-14 — Gmail audit corrected Long-Form outreach send history

- Gmail Sent confirms **Chris Williamson was emailed 2026-05-15** via `jonathan@chriswillx.com`; no reply found.
- Gmail Sent confirms **Andrew Schulz outreach was emailed to Jamiel Hibbert on 2026-06-30**; no reply found. Do not resend the first-touch email.
- No matching Gmail Sent messages were found for **Ali Abdaal** or **Steven Bartlett** across the known recipient addresses, subject hooks, names, and profile URLs. Their polished drafts remain safe to send. This does not rule out an unlogged website contact-form submission.
- Earlier `0/12 sent` / `no send evidence` entries below were based on repo evidence only and are superseded by this direct Gmail audit.

### 2026-07-13 — Unattended status brief: growth FRESH (biggest week → nothing); publish gate jammed; IG fully dark

- Brief: [`docs/daily-briefs/2026-07-13_marketing-status.md`](../daily-briefs/2026-07-13_marketing-status.md).
- **Growth freshness gate PASSED:** the weekly audit ran today (growth-log newest entry `2026-07-13`), so the brief folds its headline + biggest leak verbatim instead of re-deriving numbers.
- **Growth headline:** the now-complete 2026-07-06 week drew **5,357 new visitors — the highest in the 8-week window (+48% WoW)**, almost entirely onto personality-analysis, and converted it to **0 signups, 0 comments, 1 profile, 0 waitlist, 0/6 wall conversion.** PA dwell fell to **11.7s (8-week low)** from 18.8s at 99% bounce. Give-first still half-blind (only `gate_shown`), Chorus still dead (`nine_user_takes` = 1 row ever — likely silent bug). Growth's #1 bet: above-fold, page-matched, one-field capture on personality-analysis (product/eng scope).
- **Bottleneck flipped create → publish.** Last week's `oliver-tree` API failures are gone: the nightly cron shipped clean drafts 07-13 (David Beckham T3, grade 8.6 B+, 69 min; N3on T3). But `publish-people` shipped **0 posts 07-10/07-11/07-12** — every unpublished draft rejected on missing grade-stability deltas, missing manual Canva images, or grades 0.1 under 8.5. Engine writes daily, ships nothing. Fastest unblocks: supervised `/grade_blog` regrade on `hailee-steinfeld` + `Kaia-Gerber` (both grade-passing, need only the delta); add images for `oliver-tree` / `julia-fox`.
- **Instagram fully dark:** 7 of 7 recent mornings blocked (07-06 → 07-12, `instagram_account_not_in_picker`). Regression from "5/7" last brief. @9takesdotcom evicted from shared Chrome profile; only DJ can re-login.
- **SEO refreshed:** corpus-stats + crosslink index regenerated 07-12; GSC `latest.json` now runDate 2026-07-06 (was 06-11).
- **New scout 07-13** (`docs/content-research/2026-07-13_surging-people-scout.md`): top create pick **Michael Truell** ($60B Cursor/SpaceX), then Josh O'Connor; Milly Alcock refresh. Backlog queue drained to ~1 entry.
- **Unchanged:** 9 distribution packets unfired; Quora ~55 days dark; Long-Form outreach staged (06-29 Bartlett/Ferriss/Schulz assets, no send evidence); email starved (2 sends/wk, welcome_sequence now 1 active enrollment).
- **Owner:** DJ. Open decisions in brief §"Open questions for DJ": PA above-fold capture, publish-gate regrades, manual images for oliver-tree/julia-fox, IG re-login, approve Truell/O'Connor/Alcock, Chorus/give-first smoke-test, distribution + Quora standing calls.

### 2026-07-06 — Unattended status brief: growth stale; people pipeline reliability broke; IG session unstable

- Brief: [`docs/daily-briefs/2026-07-06_marketing-status.md`](../daily-briefs/2026-07-06_marketing-status.md).
- **Growth freshness gate:** newest growth-log entry is 2026-07-01, not today, so the brief leads with `⚠️ STALE GROWTH DATA (last audit 2026-07-01)` and does not present old funnel numbers as current.
- **Biggest operational change:** people automation shipped through 07-04, then `oliver-tree` failed on both 07-05 and 07-06 before draft creation because of API connection failures. Both runs still advanced downstream stages against a missing draft, so the old "silent cycle" failure mode is still live.
- **Signup status corrected:** `/api/signups` still has no recaptcha, but direct inspection shows layered hardening now exists (honeypot, 2.5s time-trap, bot-user-agent blocks, malformed-local blocking, per-IP/per-email rate limits, auth-abuse checks, and `newsletter_signup_security_events`). Needs fresh growth audit to verify real-world effect.
- **Instagram regressed from "healthy" to "cadence present, account blocked":** 2026-07-06 warmup blocked at `instagram_account_not_in_picker`; latest warmup says 5 of last 7 mornings blocked and only 07-01 / 07-04 worked.
- **Still idle:** 9 distribution packets remain queued; Quora is ~48 days dark since 2026-05-19; Long-Form outreach remains staged, with new 06-29 Bartlett/Ferriss/Schulz/Diary-of-a-CEO assets but no send evidence.
- **SEO state:** corpus stats + cross-link index generated 2026-07-06; GSC export still 2026-06-11.
- **Owner:** DJ. Open decisions in brief §"Open questions for DJ": Oliver Tree retry vs advance queue, whether current `scripts/run-blog-pipeline.sh` edit is the Stage-1 hard-stop fix, Instagram re-login/dedicated profile, fresh growth audit, distribution priority, Quora revive/retire.

### 2026-07-01 — Unattended status brief: publish gate UNJAMMED; IG healthy; signups leak + Quora still open

- Brief: [`docs/daily-briefs/2026-07-01_marketing-status.md`](../daily-briefs/2026-07-01_marketing-status.md).
- **Biggest swing:** the 06-20 publish-gate jam (0/429 publishable, 355 stuck on v1 rubric) is RESOLVED. Auto-publisher shipped a person nearly every day 06-21→07-01: John-Goodman, adam-sandler, lily-allen, keith-lee, bert-kreischer, odessa-azion, megan-fox, nicki-minaj, leonardo-da-vinci (07-01, grade 8.6). Create + publish both live. Drafts on disk 437 → 464.
- **Instagram graduated to HEALTHY:** unbroken daily warmups through 07-01 + replies (06-29). Strongest channel now.
- **Still open (carried from 06-20):** `/api/signups` still has NO recaptcha (bot-spam leak unfixed — confirmed zero recaptcha ref in server files); Quora still DEAD (~43 days, since 2026-05-19); Long-Form cluster still 0/12.
- **New flag:** weekly growth audit did NOT run Monday 06-29 (growth-log newest entry still 2026-06-20). Growth numbers 11 days stale.
- **New this period:** Tier-1 personality-analysis refresh plan (`docs/content-analysis/tier1-blog-refresh-plan-2026-07-01.md`, 6 stale blogs to rebuild) + candidate scout (`docs/blog-automation/personality-analysis-candidates-2026-07-01.md`, e.g. Lamine Yamal, Rosé). Both uncommitted. Distribution set now includes steven-bartlett + lana-del-rey packets (still 9 total, all unfired).
- **Owner:** DJ. Open decisions in brief §"Open questions for DJ": signups recaptcha, fire distribution (gate now open → blogs landing silent), Quora revive/retire, rerun growth audit, green-light Tier-1 rebuild + new candidates.

### 2026-06-20 — Unattended status brief (42-day gap closed); two jammed gates + spam leak

- Brief: [`docs/daily-briefs/2026-06-20_marketing-status.md`](../daily-briefs/2026-06-20_marketing-status.md). First status brief since 2026-05-09.
- **#1 urgent (product, not marketing-pm scope):** `/api/signups` is being bot-stuffed — 75 of 79 weekly signups are spam, endpoint has no recaptcha. Poisoning email metrics + sender reputation. Needs DJ/eng to add recaptcha. Cross-ref growth-log 2026-06-20.
- **#2 bottleneck:** publish gate fully jammed — 2026-06-19 run found 0/429 publishable; **355 drafts stuck on stale v1 grade rubric** needing `/grade_blog`. People pipeline writes daily but ships nothing. Unblock = re-grade freshest draft(s), then `/blog_content_publish_people`.
- **#3 channel dead:** Quora dark ~32 days (last session + cron + question-log all stop 2026-05-19). Decision needed: revive or retire.
- **Recovered:** Instagram back live 2026-06-17 after 40+ day block; 3 consecutive passes since.
- **Healthy:** people blog cron running daily (06-19 nick-offerman, 437 drafts on disk).
- **Unchanged:** pop-culture 22 unpublished (12 are 3+ months old); 9 distribution packets unfired; Long-Form Network cluster still 0/12 sent + Bartlett still unpublished.
- **Note:** `Jason-Sudeikis.md` skipped by publish parser (`anchor:` key at line 59); body YAML reads valid on inspection — parser edge case, not the `\'` build-break class. Worth a parser check.
- **Owner:** DJ. Open decisions in brief §"Open questions for DJ": signups recaptcha, publish re-grade plan, Quora revive/retire, Bartlett, distribution priority.

### 2026-05-14 — Session close: outreach drafts handed off via pickup brief

- Pickup brief: [`docs/daily-briefs/2026-05-14_pickup-brief.md`](../daily-briefs/2026-05-14_pickup-brief.md). Use it as the single starting point on next outreach session.
- **#1 move on resume:** publish Bartlett — `/blog_content_publish_people Steven-Bartlett`. Grade 8.8 (above 8.5 gate); disk still `published: false`. Unblocks email #6 in the cluster.
- **#2 move on resume:** tighten the 12 cluster emails against the new outreach doctrine (see next entry). Sample tightened email in pickup brief §3.
- **#3 move on resume:** publish 3 remaining stale Dec 2025 / Jan 2025 pop-culture drafts (`world-leaders-enneagram-personality-dynamics`, `aoc-and-the-squad-enneagram-types`, `onlyfans-creators-enneagram-digital-intimacy`) via `/blog_content_publish_pop_culture`.
- Long-Form Network campaign: 0/12 sent. Drafts in flight at `docs/outreach/2026-05-11_long-form-network-emails.md`. DJ has been iterating these — do not mass-edit without checking diffs.

### 2026-05-14 — New cold-outreach doctrine codified (memories live)

- DJ added three memory entries that change how all future cold outreach gets drafted:
  - `feedback_cold_outreach_principles` — 50–125 words, **1 link max**, 5–7 day follow-up cadence (not 14), 1–3% realistic reply ceiling for cold-to-high-profile. Never ask for a call. Subject lines 4–7 words / 36–50 chars.
  - `feedback_outreach_inevitability_voice` — "Already published" frame. "With or without you" energy. No supplication. Patterns: _"It's already up — felt strange to write N words about someone without telling them."_ / _"If you'd refine anything, I'd love that. If not, glad you saw it."_
  - `reference_enneagram_type_3_outreach` — wing-specific (3w2/3w4/3w8) cold-outreach tuning. Applies to half the cluster (Williamson, Hormozi, Bartlett, Abdaal).
- **Implication for existing 2026-05-11 drafts:** All 12 cluster emails violate all three new rules (150–220 words each, 3–4 links each, "would value the correction" supplication tone). Need a tightening pass before any send.
- **For future agents and sessions:** Default to these constraints. DJ will reject supplication tone.

### 2026-05-14 — Guerrilla marketing playbook drafted (STRATEGY, not yet executing)

- New doc: [`guerrilla-marketing-playbook-2026-05-14.md`](./guerrilla-marketing-playbook-2026-05-14.md) captures the 80/20 frame, four high-leverage moves, Reddit thread archetypes, and channels-to-skip.
- Core 30-day loop proposed: **5 celebrity newsjacks/week → 24-hr blog → 1 Reddit comment per blog into existing threads on r/popculturechat or r/Fauxmoi.**
- Builds on existing [`docs/reddit/reddit-plan.md`](../reddit/reddit-plan.md) (which has the sub list) — this doc adds the strategic frame, archetypes, and what-to-skip.
- **Status:** strategy captured; nothing executing yet. See "Work still to do" section in the playbook for the 7 concrete next actions.
- **Owner:** DJ to decide cadence commitment + pick the first 5 newsjack targets. No automation built; loop is manual until proven.
- **Open questions:** automate newsjack loop or stay manual? Referral-traffic attribution before running? Relationship to existing 1-on-1 personality-analysis outreach.

### 2026-05-14 — Cancel Culture post (PUBLISHED after major rewrite)

- **File:** `src/blog/pop-culture/cancel-culture-enneagram-type.md` — flipped to `published: true` with `date: 2026-05-11`.
- **Rewrite shipped:** Addressed full reader-review punch-list in one pass — added Justine Sacco opener, real-name anchors (Hasan Minhaj, Roseanne, Joe Rogan), three new sections (Platform Mechanics, In-Group Cancellation, Past Peak Cancel), expanded cancelled-type coverage from 3 types to 6 (added 1/7/9), unpacked the Type 2 victimhood line, linked all 9 types internally, strengthened disclaimer.
- **De-dup pass:** Killed the original's overlapping "What Each Type Thinks" + duplicate "How to Survive by Type" sections. Word count 2251 → 2122 despite adding three new sections.
- **Image:** Reusing `twitter-toxic-psychology.webp` (best existing thematic match; shared hero with `twitter-x-personality-types-toxic.md`). Custom `mjPrompt` for a unique tribunal scene still preserved in frontmatter for a future render.
- **Follow-ups doc:** [`docs/planning/cancel-culture-blog-followups-2026-05-14.md`](../planning/cancel-culture-blog-followups-2026-05-14.md) — distribution packets, cross-linking targets, optional unique-hero render, pipeline housekeeping check.
- **Next:** confirm `/blog_content_publish_pop_culture` was run (would handle sitemap + FTS + crosslinks). If flipped manually, run `pnpm gen:sitemap && pnpm index:blogs && pnpm gen:crosslinks`. Then distribution packets (Instagram / Twitter thread / Quora / newsletter).
- **Owner:** DJ.

### 2026-05-11 — Pop-culture publish queue (BOTTLENECK; unblocker shipped today)

- Current state on disk: **26 published, 19 unpublished** (snapshot from `grep ^published: src/blog/pop-culture/*.md`)
- The 2026-05-09 brief said 17 stuck drafts; the kardashian draft has since been flipped to `published: true` with `date: 2026-05-09`. Disk drift between brief and reality.
- **2026-05-11 unblocker:** `/blog_content_publish_pop_culture` command now exists. Validates draft + flips frontmatter + regenerates sitemap + syncs Supabase FTS in one shot.
- SEO scaffolding (corpus-stat callouts, type-pillar wiring, JSON-LD) is already in place — each post published now gets full amplification benefit
- **Next:** DJ can now `/blog_content_publish_pop_culture` against the 5 stale Dec 2025 / Jan 2026 drafts, one per session. Distribution packets follow (6 still queued in `docs/distribution-assets/`).
- **Owner:** DJ runs the command per draft; the command does the work.

### 2026-05-11 — People blog pipeline (HEALTHY, automated)

- Cron last ran 2026-05-11 02:15 (cron log) + 06:01 (publish log). Daily cadence holding.
- 3 new drafts added since the May 9 brief: `Alex-Lieberman.md`, `Salma-Hayek.md`, `Sean-Evans.md` (currently uncommitted on disk)
- Ana de Armas draft + research brief landed in commit `54f41c38`
- **Next:** nothing required — pipeline runs itself. Monitor for cron failures.

### 2026-05-11 — Quora daily cadence (RUNNING, with one gap)

- Sessions present: `2026-05-10_quora-warmup.md`, `2026-05-10_quora-answers.md`, `2026-05-11_quora-warmup.md`
- Quora automation cron log on 2026-05-11 is **1 byte (empty)** — likely a skipped run or upstream failure. Worth checking.
- **Next:** investigate empty cron log; otherwise cadence is holding.

### 2026-05-11 — Instagram daily warmup (RUNNING)

- `2026-05-11_instagram-warmup.md` present.
- Engagement targets doc was appended to since the May 9 brief (append-only preserved).
- `instagram-recovery-todo-2026-05-07.md` still present — status unknown.
- **Next:** confirm whether the May 7 recovery todo is closed or still open.

### 2026-05-11 — Distribution packets (QUEUED, UNFIRED)

- 6 packets sit in `docs/distribution-assets/`: Benson Boone, Chris Williamson, John Coogan, Justin Bieber, Shawn Ryan (+ Instagram variant), Tech Titans Disruptors
- Pure execution work. No writing required.
- **Next:** DJ picks 2–3 to fire, runs them through the respective channel commands.

### 2026-05-11 — Long-Form Network email drafts (12, ready-to-send)

- File: `docs/outreach/2026-05-11_long-form-network-emails.md`.
- All 12 cluster emails drafted with signature specifics pulled from each piece's FEEDBACK comments (the curated golden lines). Williamson first per DJ.
- Each opener references a concrete moment from the actual published piece — shoulder-bag (Williamson), Tony Robbins confession (Hormozi), 13 pounds in the chicken shop (Bartlett), King Kong/Godzilla age-5 scene (Rogan), "You're morally obligated to do remarkable things" (Peterson), 7-Eleven opening (Fridman), etc.
- **Typing correction caught:** Tim Ferriss earlier guessed 5w4 (wrong). Actual piece types him Type 1 ("Self-Help's Relentless Reformer"). Email opener rewritten around the suicide disclosure / forgotten address change. Cluster doc DM also patched.
- **Bartlett step:** Disk still `published: false`; grade now 8.8. Email is drafted but won't deliver value until `/blog_content_publish_people Steven-Bartlett` is run.
- **CAN-SPAM mitigation:** Each email closes with "If you'd rather not hear from me again on this, just reply 'no thanks' and I'll stop." Cheap insurance now that cluster send count > 5.
- **Owner:** DJ verifies each URL renders before sending; pulls subject line + fires email.

### 2026-05-11 — Long-Form Network cluster campaign (DRAFTED, awaiting review)

- File: `docs/outreach/2026-05-11_long-form-network-cluster.md`.
- Editorial frame: "The Long-Form Network" — 9takes positions as the publication seriously analyzing the 12 people running the most consequential long-form interview shows of this era.
- Cluster: Chris Williamson, Joe Rogan, Jordan Peterson, Alex Hormozi, Lex Fridman, Shawn Ryan, Theo Von, Tim Ferriss, Andrew Huberman, Ali Abdaal, Andrew Schulz, Steven Bartlett.
- Strategy: Network-proof private outreach (Strategy A). No public moment yet.
- Sequencing: 3 weeks. Week 1 = engagement-likely (Hormozi, Williamson, Abdaal). Week 2 = connectors (Huberman, Ferriss, Bartlett, Theo). Week 3 = heavyweights (Peterson, Fridman, Rogan, Shawn Ryan, Schulz).
- Adjacent-link rotation designed so no two recipients see the same trio.
- Steven Bartlett special case: not live (grade 8.0 < 8.5 publish gate). Kept as recipient, no own-profile link. Future: upgrade his draft to A-grade, then publish + re-fold.
- Voice: every send leads with a sharp specific from their piece, names 2–3 other cluster members as proof, ends with fairness ask.
- **Open before-send:** typing verification (Pre-send check on every draft), Hormozi vs Williamson as first send, public-moment decision (deferred 2 weeks), sender identity for Peterson email.

### 2026-05-11 — Chris Williamson outreach campaign (DRAFTED, awaiting review)

- 10-recipient campaign drafted at `docs/outreach/2026-05-11_chris-williamson-campaign.md`.
- Strategy grounded in `docs/planning/personality-analysis-outreach-positioning-2026-05-11.md` + `personality-analysis-outreach-workflow-2026-05-06.md`.
- Channel mix: X DM for subject + podcasters/creators (Chris, Bartlett, Bilyeu, Hormozi, Abdaal); email for commentators (Clouse, Kocak, Peterson); Reddit posts for communities (r/Enneagram, r/DecodingTheGurus).
- Voice: distribution-packet-grade specifics (shoulder-bag, Love Island Coriolis, 2025 mold/Lyme) leading every opener. Fairness frame baked in per positioning doc.
- Default adjacent links: Alex Hormozi + Robert Greene (both verified live).
- CAN-SPAM decision: skipped (1:1 relationship pitches, not commercial broadcast).
- **Open before-send:** sender email identity, Peterson vs swap, Draft A vs B for the subject DM, Ali Abdaal URL verification, sequencing (same day vs staggered).
- **Owner:** DJ approves draft + sends; campaign doc has reply-handling cheat sheet + tracking columns.

### 2026-05-09 — SEO infrastructure push (LANDED, may now be quieter)

- May 5–9 commits added: corpus-stat citations across 9 type pages, FAQ JSON-LD, HowTo schema on guides, Quotation JSON-LD on 7 personality-analysis categories, bridge-links sidebar, /enneagram-test CTA below enneagram-corner posts, pop-culture → type-pillar wiring
- Since 2026-05-09, SEO commits have quieted; engine has shifted to people-side draft authoring
- **Next:** none required. Amplification is now in place for the pop-culture queue.

---

## Blocked / waiting

### 2026-10-05 — Current blockers needing DJ / eng decision

- **Desk replies (DJ, ~15 min):** 0 of 8 drafts acted since the 10-03 digest; 749 + 743 have email opt-ins (3 opt-ins lifetime, 0 served). 746/747 replies drafted in `docs/growth/host-desk/2026-10-03-type6-critic-replies.md`.
- **`EMAIL_FOOTER_ADDRESS` in Vercel production (DJ only, 34 days, 6th ask):** local `.env` now non-empty, prod still failing (today included). 5 real people lost; Enneagram campaign (31 eligible) waiting.
- **Weak-password "Server error" on `/register` (eng, ~30 min, delegable):** 2 people / 4 events, 0 registered.
- **T-41 G seed approval (DJ, ~10 min):** q118 rotation for the celebrity slot (q567: 26 -> 0). Readout 10-17.
- **Typing decisions (DJ):** Sam Altman 4 -> 3 (verify pass; cascade into 5 published pop-culture posts + the _Artificial_ explainer), Dario Amodei 5 -> 6 (verify failed), Druski 8 -> 3 (2nd week). Nothing synced; an explicit `--sync` would push the retype live.
- **_Artificial_ explainer (DJ):** publish for the premiere wave or hold to Dec 25; needs a hero (DJ-made per the image rule) + 3 inbound links; depends on the Altman call.
- **Publisher Node pin (eng, ~5 min):** OpenClaw 06:00 job resolves Node v26.5.0, `gen:all` fails after every publish; Garfield frontmatter edit uncommitted, `index:blogs` not run.
- **GSC request-indexing for 7 people URLs (DJ only, ~10 min):** jenna-ortega, olivia-rodrigo, robert-downey-jr, travis-scott, ryan-reynolds, will-smith, harry-styles.
- **Carried:** Instagram restore-or-retire (8th brief; 59 days dark); perspective-review backfill (8th brief; 72 blocked); The Nine vs the Reddit hold (no account/app); Zada stalled run + Tiger Woods repair failure; Ben Shelton off the closest list (unexplained); Weekly Crosslinks `error` 10-01 (expected to clear 10-08); be-gentle promo packet unfired; pop-culture 22; One Take ep 1; outreach; T-41 A (10-10) / C (10-17) date-gated; Abrams held.
- **Resolved since 09-28:** host-desk fix shipped + verified (10-03 digest); human-only `gate_shown` + `contribution.path` shipped; `/forgotPassword` reCAPTCHA race fixed; create queue refilled (18); IndexNow key live; first people publish since 09-10 (Andrew Garfield).

### 2026-09-28 — Current blockers needing DJ / eng decision

- **Owed replies (DJ, 8 days):** takes 746/747/748 (repeat contributor, now signed out and gone since 09-22) and 743 (anon opt-in #2), plus q570 as host. Email is the only remaining channel and it fires only on a reply.
- **Host-desk fix (eng, 3rd week as growth bet #1):** `maxDuration: 300`, per-run log row with "takes > 0, drafts = 0" alarm, last-success lookback. 16 days dead. Proposed: delegate to an implementation agent, DJ reviews the diff.
- **Account recovery (eng/DJ):** `/forgotPassword` produced no reset email for the repeat contributor (`recovery_sent_at` NULL); cause unverified (no submit / reCAPTCHA / rate limit).
- **Postal address for `EMAIL_FOOTER_ADDRESS` (DJ only, 26 days, 5th ask):** 3 real people lost (208, the 09-19 registrant, 209); 4 errored + 1 stalled enrollments; Enneagram campaign (31 eligible) waiting.
- **Gate instrumentation (eng):** `gate_shown` counts crawlers (17/30 fps no client visit); `contribution.path` still missing. Homepage live-take (real q203 post, `path='/'`) queues behind it.
- **Druski typing (DJ):** committed draft says Type 3, live DB row says 8; v3 verify `insufficient_evidence` (YouTube/Essence blocked from this machine). Approve 8 -> 3 and re-run verify from another network, or revert the draft's typing.
- **The Nine vs growth's Reddit hold (DJ):** 09-22 decisions say Reddit first; growth says hold Reddit until the loop is repaired. Unbranded account + script app not created.
- **Create queue empty 8 nights (DJ):** refill (scout) or explicitly pause the create cron. Shelton images -> publish (peg passed). Rod Wave `verify-repair` turn cap. Holmes Stanford-date fix.
- **IndexNow (DJ):** submitter live in code, no key file in `static/`, `INDEXNOW_KEY` unset locally. `BYPASS_TOKEN` (ISR on-publish revalidation) unverified.
- **Carried:** Instagram restore-or-retire (7th brief; 52 days dark); perspective-review backfill (7th brief; 72 blocked); publisher exit 0 on "no publishable draft"; `seo-content-strategist` read of the fresh 09-24 GSC pull + Ashby/Coogan/Hormozi retrofit; deploy-skew fix GSC re-inspection; T-38/39/40 typing taskers; personal-growth seed-takes question; founding circle + 7 Reddit drafts held; Quora 132 days; distribution packets; pop-culture 21; One Take ep 1; Abrams (10-16) / Zada (11-20) held.
- **Resolved since 09-21:** SEO batch committed + pushed (ISR live, 2025 test page unpublished); GSC performance data refreshed (09-24); cross-link gate debt 66 -> 2.

### 2026-09-21 — Current blockers needing DJ / eng decision

- **Host desk dead, replies owed (DJ + eng):** takes 743 (anon, opted in), 746/747/748 (signed-in repeat contributor) need real replies today; `host-digest` needs `maxDuration: 300`, a per-run log row with an alarm, and a last-success lookback. Draft #2 (take 736) still `pending`.
- **Postal address for `EMAIL_FOOTER_ADDRESS` (DJ only, 19 days, 4th ask):** blocks welcome (4 errored + 1 stalled), signup 208's confirmation, the 09-19 registrant, and the approved Enneagram campaign (31 eligible). The 503 pre-check means nothing retries until it exists.
- **Homepage gate:** `/` at 0/0 for a full week; DJ fork between wiring the practice submit to q203 and reinstating the featured question. `contribution.path` NULL on 7/9.
- **Uncommitted SEO batch (DJ):** ISR + discussion endpoint + IndexNow + 2025 unpublish are in the working tree; needs `BYPASS_TOKEN`, `INDEXNOW_KEY` + key file, a commit and a push. Deploy-skew fix (pushed) still needs a deploy + GSC re-inspection to verify.
- **Ben Shelton publish (DJ):** 8.5 B+ v3, images only per the 09-20 publisher; confirm 09-21 state by hand, generate 2 images, publish. Athletes were deprioritized for queue order, not vetoed.
- **Create queue empty (DJ):** refill from the 09-09 scout's remaining names or run a fresh scout. Rod Wave needs `verify-repair` rerun with a higher turn cap. Tom Rhys Harries permanently failed.
- **Holmes refresh:** 8.0 with a Stanford-date error; fix before syncing. Personal-growth seed takes need DJ to create the backing question.
- **Carried:** Instagram restore-or-retire (6th brief; 45 days dark); perspective-review backfill (6th brief; 72 blocked); publisher wrapper exit 0 on "no publishable draft" (4th raise; Node itself now 24.18); founding circle + 7 Reddit drafts held per growth; GSC performance CSV refresh + Ashby/Coogan/Hormozi retrofit read; `ms-rachel` Type 2 anchor 8.1 (7th brief); Quora 125 days; 9 distribution packets; pop-culture 21; One Take ep 1; Austin Abrams (first window passed 09-18) / Joseph Zada (11-20) held.
- **Resolved since 09-14:** Inde Navarrette artifacts now tracked (09-15); Node runtime moved off 26.x (observed 24.18.0); Monday chain timing.

### 2026-09-14 — Current blockers needing DJ / eng decision

- **Postal address for `EMAIL_FOOTER_ADDRESS` (DJ only, 12 days):** the value is empty in Vercel and both local env files. It blocks welcome (4 errored), signup confirmation (208 failed today), and the approved Enneagram campaign (31 eligible, authorized 09-10). After it is set: re-arm, resend, send a header-checked test, run a controlled batch, and route the `process-sequences` 500 alarm to Telegram.
- **Host digest degraded:** no `maxDuration` on `/api/cron/host-digest`; fixed 48h lookback stranded 5 takes; takes 733 (opted in), 735 and 737 are owed a same-day reply that is now 5 days late.
- **Homepage gate removed 09-10:** decide live question vs practice-first; `contribution.path` NULL on 5/7 blocks a clean surface split.
- **Publisher regen step:** `pnpm gen:all` fails on Node 26.5.0 after every successful DB publish; pin Node in `scripts/daily-blog-publisher.sh`, and exit 0 when nothing is eligible.
- **Held drafts in release windows:** Austin Abrams 8.1 (_Resident Evil_ 09-18), Joseph Zada 8.4 (11-20). Tom Rhys Harries research timeout, retry 1/3. Inde Navarrette 8.1 untracked and not queued.
- **Founding circle + 7 Reddit drafts:** holding until bets 1 and 2 are live (growth recommendation); needs DJ confirmation.
- **Carried:** Instagram restore-or-retire (5th brief; 38 days dark); perspective-review backfill fork (5th brief; 72 blocked); GSC refresh + overdue Ashby/Coogan/Hormozi retrofit read; `ms-rachel` Type 2 anchor 8.1 (6th brief); Quora 118 days; 14 distribution assets; pop-culture 21; One Take ep 1.
- **Resolved since 09-07:** create queue refilled (DJ, 09-09); delivery-health alarm shipped (09-09; unrouted); publisher runtime reframed, since publishing works and only regen fails.

### 2026-09-07 — Current blockers needing DJ / eng decision

- **`EMAIL_FOOTER_ADDRESS` missing in Vercel production:** welcome sequence dead since 09-02 06:15 UTC, 4/4 enrollments `errored`, cron no longer retrying. One env var + re-arm SQL (growth bet #1). Also gates `enneagram_type_prompt` and the weekly-question email.
- **Create queue empty:** `docs/blog-automation/backlog-queue.json` `"queue": []`; six nights lost. Needs a refill source decision (`/find-surging-people`, 09-01 scout, or hand list; Dylan Patel on hold).
- **Publisher runtime, 10 days unresolved, 4 autonomous publishes lost:** pin Node in `scripts/daily-blog-publisher.sh` or fix the OpenClaw gateway PATH. `.nvmrc` alone does not reach the wrapper.
- **Founding circle send is DJ-gated:** copy + candidate query ready in `docs/growth/founding-circle/00-TASKER.md`; 0 invites; depends on the env-var fix for the weekly question.
- **`contribution.path` still NULL on 2 of 4 events:** the 4-week loop readout will be hand-built unless fixed with the founding-circle change.
- **Reddit:** 7 of 8 drafts unfired; growth recommends waiting for bets 1+2 and landing the next alpha on q118. The r/alphaandbetausers thread may owe a follow-up reply.
- **Weekly wrapper credit blackouts (08-10, 08-31):** no pre-flight check or fallback model; the 08-31 brief was never produced.
- **Carried:** Instagram restore-or-retire (4th brief; 31 days dark, 0 execution crons); perspective-review backfill fork (4th brief; 71 unreachable drafts); GSC snapshot refresh + first `seo-content-strategist` run (retrofit read due ~09-09); `ms-rachel` Type 2 anchor at 8.1 (5th brief); Quora 111 days; 14 distribution assets; pop-culture 21; One Take ep 1.
- **Resolved since 08-28:** post-answer relationship moment (reply email + host desk + pins shipped 09-07); Instagram/Quora unchanged; publisher runtime NOT resolved despite `.nvmrc`.

### 2026-08-28 — Current blockers needing DJ / eng decision

- **Post-answer relationship moment is now the earliest weak stage:** 4 reply-opt-in views produced 0 focus, submit, subscription, reply, or contributor return. Decide whether the promise should be reply notification, result delivery, or identity preservation; instrument one version and test it before adding more acquisition volume.
- **Publisher runtime:** point the OpenClaw service at Node 24 (`/opt/homebrew/opt/node@24/bin`) before the next 06:00 publish. The job is at 29 consecutive errors and today proved an otherwise eligible draft cannot clear under Node 26.
- **Attribution:** direct/unknown question traffic grew 5 -> 24 people and produced the four completions, but no UTM identifies it. Tag the next owned distribution link before interpreting this as a channel win.
- **In-house funnel instrumentation:** 3 of 4 current contribution rows have `path IS NULL`; persist the originating path/surface so PostHog reconstruction is not required.
- **Instagram decision is still unresolved:** no execution jobs, 21 days dark, 0/10 approved. Restore an executable cadence or formally retire the channel; reminders alone are not a workflow.
- **Still open:** `enneagram_type_prompt` remains `draft`; perspective-review legacy backlog has no backfill path; GSC data is 15 days stale; Quora is disabled.
- **Resolved since 08-24:** contribution no longer ejects welcome enrollments; reveal type capture persists; self-referral inflation is fixed; host-sleep protection is live; dormant/zombie reactivation sends are stopped.

### 2026-08-24 — Current blockers needing DJ / eng decision

- **Activation return leg, and it is now the only unshipped half:** DJ shipped `/register` type capture 08-21, but `welcomeSequenceGuards.ts:8-15` still ejects contributors from the welcome sequence and `enneagram_type_prompt` (137 addressable untyped profiles) is still `draft`. Both are already built. One-line change plus a status flip.
- **Reveal-surface capture gap:** the `StrategicQuestion` type selector is event-only ("Saved for this visit"). It sees 35 gate fps/week against `/register`'s ~1. Decide whether it should persist.
- **Perspective-review fork, 2nd brief unanswered:** 86 finished drafts unreachable by the auto-publisher; a full week produced 9 new perspective-review dirs and **all 9 went to new drafts**. Grandfather pre-08-04, or authorize a batch `scripts/run-blog-pipeline.sh <Person> --resume` campaign.
- **Pipeline reliability, 3 lost nights in 3 weeks:** ENOTFOUND (5,664s), credit exhaustion, host sleep (6,248s). No wall-clock kill, no `caffeinate -i`, no alerting on any of the three failure strings. The nightly create engine is the largest single producer of marketing assets.
- **Instagram, 2nd brief unscheduled:** 0 of 9 OpenClaw jobs; 17 days dark; 15 overdue queue items with nobody to work them. Restore the three 07-26-pattern warmup crons or retire the channel explicitly.
- **Image debt regressing:** `missing_full_image` / `missing_thumbnail_image` back to 12 each after hitting 7. Manual Canva remains the only path for the residual.
- **`ms-rachel` (Type 2 anchor) graded 8.1 with a 0.5 delta** — needs a supervised regrade or revision pass, or the Type 2 pond plan stays blocked a 5th brief.
- **Reactivation email still running against two stop recommendations:** 48 more sends this week; cumulative 275 / 1 click / 0 real returns.
- **Analytics attribution unfixed and degrading:** 86.3% of first-touch fingerprints labelled `9takes.com` (`src/routes/api/analytics/page-view/+server.ts:12-25`). No channel decision in the last nine briefs is defensible.
- **Carried, now 2 briefs past a retirement recommendation:** Quora (97 days), 14 distribution assets (33 days), 18 pop-culture drafts, Reels E1 / Odyssey (window expired), One Take ep 1 (30 days).
- **Resolved since 08-17:** the five-brief-old victoria-justice + keira-knightley unblocks (both published); GSC T-09 window still clean; internal-link anchor health verified clean (0/0/0).

### 2026-08-03 — Current blockers needing DJ / eng decision

- **Create engine, hard deadline tonight:** `stableronaldo` at `retryCount: 2`; the 02:00 run is retry 3/3. Root cause confirmed at `scripts/run-blog-pipeline.sh:109` (`${PERSON}.md` path assumption vs the `Stable-Ronaldo.md` the create stage actually writes). Fix the resolution or rename the queue entry.
- **Publish gate, structural (blocker class changed):** `missing_full_image=54` is now the largest class, ahead of `stale_grade_rubric_v1=30`. Images are manual Canva only — no automation path exists or should be built. Needs a standing batch decision from DJ, or a gate change so image-blocked drafts stop masking real near-misses.
- **Instagram, decision not execution:** the warmup agent asked DJ to choose between folding reply-drafting into the warmup cron or cutting the job to 2-3x/week. Four consecutive sessions produced zero posted comments; a fifth queue is worse than either answer. Also still owed: browser rename ("Browser 1" → "9takes.com"), 3rd brief running.
- **Growth PA port BLOCKED by a UI regression:** NineChorus light-mode contrast (see 07-29 `84c055bd`). Restore explicit contrast before the standing port bet, or it lands invisible.
- **Reactivation email is losing and over-enrolled:** `reactivation_zombies` launched against the explicit hold condition; 90 people touched → 1 click, 0 returns. Growth recommends pausing both dormant and zombies and rewriting the CTA.
- **Content-ops runway RED:** 0/10 approved; Robert Greene's target date is today and DJ's review is the only gate.
- **Carried:** Quora 76 days dark (revive or retire, 6th brief); 14 distribution assets unfired; T-11 unfixed so the QUALITY GRADE leak regenerates (212 people drafts still carry the marker); GSC window still straddles the 05-04 URL fix.
- **Resolved since 07-27:** the 7-day publish drought (DJ cleared 9 by hand with supervised regrades); GSC staleness; Instagram session eviction stays fixed.

### 2026-07-20 — Current blockers needing DJ / eng decision

- **Growth activation (product/eng) — NOW the top move:** the give-first/Chorus mechanic is proven (12% wall, full loop turn) but quarantined to ~0.6% of traffic. Port it above the fold onto personality-analysis, where the ~4,260-visitor firehose lands with 0 capture. Also: scale masking-question 567 (the only native `contribution` source).
- **Create engine timeout (NEW):** `travis-kelce` produced no draft — Stage 1 create exceeded the 600s research-agent ceiling. Retry 1/3 tomorrow. If it repeats, raise the create ceiling or `forceNext` a lower-research person in `override.json`. Publish backlog (85 unpublished drafts) gives runway.
- **Instagram fully dark + escalated:** 17/20 mornings blocked; @9takesdotcom now fully evicted from the picker (full-handle re-login required). DJ re-login + dedicated Chrome profile.
- **Carried:** 13 distribution assets unfired (IG variants also gated on the IG re-login); Quora ~62 days dark (revive or retire); GSC export ~16 days stale (refresh for seo-content-strategist).
- **Resolved since 07-13:** publish gate unjammed on its own (10+ posts shipped 07-18→07-20, incl. both prior blockers Kaia Gerber + Oliver Tree). Chorus "silent bug" resolved — `nine_user_takes` and native `contribution` both firing.

### 2026-07-13 — Current blockers needing DJ / eng decision

- **Publish gate jammed (NEW primary bottleneck):** create engine healthy but `publish-people` shipped 0 posts 07-10/07-11/07-12. Blockers are human-in-loop: supervised `/grade_blog` regrades to record stability deltas (`hailee-steinfeld`, `Kaia-Gerber` — both grade-passing) + manual Canva images (`oliver-tree`, `julia-fox` — grades pass). Any one clears a publish.
- **Instagram fully dark:** 7/7 recent mornings blocked (`instagram_account_not_in_picker`). DJ re-login + dedicated Chrome profile required.
- **Growth activation (product/eng):** biggest visitor week (5,357) converted to 0 signups; growth's #1 bet is an above-fold PA capture. Also: `nine_user_takes`=1 row ever flagged as likely silent Chorus bug — smoke-test `/api/nine/mirror` + ship submit-side give-first instrumentation.
- **Backlog queue drained to ~1 entry:** approve scout picks (Michael Truell top) to keep the create engine fed.
- **Carried:** 9 distribution packets unfired; Quora ~55 days dark (revive or retire).

### 2026-07-06 — Current blockers needing DJ / eng decision

- **Growth audit stale:** newest growth-log entry is 2026-07-01; weekly 2026-07-06 audit did not append before this brief.
- **Blog automation:** `oliver-tree` failed twice before draft creation (07-05 `ConnectionRefused`; 07-06 connection closed mid-response). Decide retry vs advance queue after fixing the API/tooling issue.
- **Instagram:** @9takesdotcom not in picker on 2026-07-06; manual re-login or dedicated Chrome profile required before warmups can reliably clear the owed @enneagrampaths reply.
- **Quora:** no session/question-log/cron activity after 2026-05-19; revive or retire.

### 2026-05-11 — Daily brief cadence

- Only 2 briefs total exist: `2026-04-17_pickup-brief.md`, `2026-05-09_marketing-status.md` (gap of ~3 weeks).
- Decision needed: restart cadence (daily? weekly?) or formalize retirement.

---

## Decisions

### 2026-10-05 — Observed from artifacts + memory (not stated to the PM directly)

- **10-02:** growth audit loose ends approved and shipped (host digest rewrite, crawler-free gate, `/forgotPassword` fix, `_v2` weekly RPC).
- **10-03:** live-take homepage (q203) and celebrity mid-article question (q567) promoted to production. Trump retyped 8 -> 3 (T-38) with a 301 after a Talk to DJ note flagged it. The Type 6 critic was emailed.
- **10-03:** the free 1-on-1 beta replaces paid sessions (The Decode / T-17 retired); success = beta signups (goal 10 by 11-15); recruiting unparked.
- **10-04:** search cleanup executed ("do the ambitious updates"); `enneagram-stress-number` retired with a 301 to `enneagram-types-in-stress`; 4 new posts published; be-gentle got the lean ending (no answer box).
- **10-04:** surging-scout picks: ambitious AI cluster + 14 CREATEs queued; Zada + Garfield refreshed; Pugh in a separate chat. Entity gaps Codie Sanchez / Shyam Sankar / Dylan Patel / Dan Ives queued.
- **10-04:** beta card design "experimental therapy, 9takes style" -> email (post-take signup prompt rejected).
- **10-04:** agents never generate images; DJ runs prompts in ChatGPT (`54943c886`).

### 2026-09-28 — Observed from artifacts (not stated to the PM directly)

- **09-21:** DJ committed and pushed the SEO batch (`e69f2b7b8`): personality ISR (confirmed serving `x-vercel-cache: HIT`), discussion endpoint, `revalidate:personality`, IndexNow submitter, `enneagram-test-comparison-2025` unpublished (not 301'd).
- **09-22:** The Nine (Reddit/X traction) — weekly Nine format, unbranded participant on Reddit, Reddit before X (`docs/growth/the-nine/HANDOFF.md` §3). Judge on takes produced, not sessions or followers.
- **09-23:** `/book-session` reframed as a free "therapy on steroids" beta ("Talk to DJ" note/voice page + booking); recruiting parked (`docs/product/2026-09-23-therapy-on-steroids.md`).
- **09-24:** DJ approved people->people linking; 169 links synced link-only to 139 live rows (`lastmod` untouched). The 358 hidden questions are intentional (08-14 bulk flag), not a bug.
- **09-26:** DJ promoted homepage V2 Tier 1+2 to production (`01ab4e7ef`); the live-take funnel stays a noindex preview pending review.

### 2026-09-21 — Observed from artifacts (not stated to the PM directly)

- **09-19:** DJ ran the GSC page-indexing audit from the UI and shipped the deploy-skew carry-over fix (`6a5ac24ad`) plus Ahrefs title / nofollow / redirect fixes and `/contact` -> `/about#contact` redirects (`809a1410f`).
- **09-19:** DJ rebuilt `enneagram-personal-growth.md` around a new `BehaviorDecoder` widget and drafted wave-2 seed takes for a not-yet-created question ("When you're stuck, what do you actually need someone to say to you?").
- **09-19:** DJ ran the Elizabeth Holmes refresh through the full legacy pipeline (not v3); graded 8.0 B; not confirmed synced.
- **09-20/21 (uncommitted):** DJ is moving personality-analysis pages to Vercel ISR, removing the in-function user-agent block on those paths in favor of robots.txt / firewall, adding IndexNow, and unpublishing (not redirecting) `enneagram-test-comparison-2025`. Intent inferred from the working tree and `docs/seo/personality-isr.md` / `indexnow.md`; not yet confirmed as final.

### 2026-09-14 — Observed from artifacts (not stated to the PM directly)

- **09-09:** DJ approved 7 CREATE subjects from `docs/content-research/2026-09-09_surging-people-scout.md` and deprioritized athletes (Ben Shelton moved to priority 20 despite 500K+ Trends). Elizabeth Holmes UPDATE executed the same day.
- **09-10:** DJ approved the revised Enneagram type-prompt email ("Why we read people differently") and explicitly authorized the send after deployment + preflight; no further send approval needed (`docs/email-sequences/enneagram-launch-check-2026-09-10.md`).
- **09-10:** DJ approved removal of questions #86, #132, #166, #172 (reversible `removed = true`); #144 kept; 356 generated questions left flagged (`docs/audits/question-purge-2026-09-10/removal-results.md`).
- **09-10:** Homepage replaced with a practice-first `HomeLandingV2` built on the Harry Dry audit (`docs/marketing/2026-09-10-harry-dry-landing-page-audit.md`); the live featured-question server load was removed. Whether dropping the live gate was intended is unconfirmed (open question in the 09-14 brief).
- **09-10:** People pipeline v3 adopted (`733de46af`), with the legacy runner kept, following `docs/content-analysis/blog-pipeline-audit-2026-09-09.md`.

### 2026-09-07 — Observed from artifacts (not stated to the PM directly)

- DJ shipped the full post-answer loop (`7db255b8e`) rather than the narrower opt-in rewrite proposed on 08-28: reply email default-on for logged-in users, curated starter set with pinned answers, and a host reply desk with a daily digest. Design rationale in `docs/product/2026-09-06-engagement-brainstorm-response.md`.
- DJ opened Reddit as a distribution channel (`reddit/`, 08-30) and fired the r/alphaandbetausers post first, pointing at q567 via `/link/567` with a campaign UTM. This was the first tagged external distribution in the project's history.
- Dylan Patel (entity-gap scout #1, score 83) is on hold at DJ's direction (recorded in the 09-01 scout).
- Election-cycle questions q98/q168 are flagged out of browse; homepage fallback stays q567 until q118 has a chorus.

### 2026-06-11 — Agent overhaul: merged editors, merged growth analysts, weekly automation, GSC + DB data access

- **`editor` agent** replaces `content-editor` + `content-polish` (both archived at `docs/archives/agents/`). One editor with three depths: diagnose / line edit / developmental edit. Calibrates first; honors an explicit depth as a hard ceiling. Shared rulebook extracted to `.claude/skills/9takes-editorial-standards/SKILL.md` (also now governs `/deai`, `/copywriting-pass`, `/blog_content_editor_pass_people`); hard rules codified: never touch `lastmod`, zero em-dashes, 8.5 grade gate.
- **`growth-analyst`** is the single growth agent (v1 + v2 merged; originals archived). New capability: read-only SQL via `scripts/db-query.sh` — needs DJ to add `SUPABASE_DB_URL` to `.env.local` (Supabase dashboard → Connect → Session pooler URI).
- **Weekly automation**: `/weekly-growth-audit` (growth-analyst → growth-log) and `/weekly-marketing-brief` (marketing-pm → dated brief + this log), via `scripts/run-weekly-*.sh`, cron Mondays 6:00/7:00 AM. DJ must run `./scripts/install-weekly-cron.sh` once (macOS blocks programmatic crontab edits).
- **GSC data feed**: `scripts/fetch-gsc-data.mjs` pulls Search Console queries/pages into `docs/data/gsc/` for the `seo-content-strategist`. One-time setup in `docs/data/gsc/README.md` (enable API + add service account to the GSC property).
- All slash-command references to retired agent names updated.

### 2026-05-11 — Created `/blog_content_publish_pop_culture` slash command

- Resolves the blocker flagged in the 2026-05-09 brief.
- Implementation: command-only, no new script. Mirrors `/blog_content_publish_people` workflow but adapted for MDsvex file-based pop-culture pipeline (no Supabase row, just frontmatter flip + sitemap regen + index-blogs).
- Date behavior: bumps `date` and `lastmod` to today on publish (matches the people command convention; SEO freshness benefit for stale drafts).
- Gates: frontmatter completeness, body ≥ 1000 words, ≥ 5 `##` sections, no placeholder markers, `picGroup` image files exist on disk, `loc` slug matches filename.
- File: `.claude/commands/blog_content_publish_pop_culture.md`.
- Next: unblocks just-ship-it batch on the 5 stale Dec 2025 / Jan 2026 drafts.

### 2026-05-11 — Created `marketing-pm` agent

- Full operator scope (can edit drafts, flip flags) with explicit per-action confirmation gates.
- Append-only log model (this file) + dated briefs in `docs/daily-briefs/`.
- Scans all four surfaces: blog pipelines, distribution + social, SEO + growth, outreach + email + funnel.
- File: `.claude/agents/marketing-pm.md`.

---

## Status snapshots

- [2026-10-05](../daily-briefs/2026-10-05_marketing-status.md) — Growth gate passed (chain on time); headline: comments stayed at the pre-July floor a second week (0, then 2); the two new gate surfaces showed the gate to 32 humans and got 0 takes (celebrity q567: 26 deep readers -> 0); host digest works again (8 drafts) but 0 posted; the week's best visitor answered, opted in, hit "Server error" twice registering (weak-password) and left. DJ shipped the loop's engineering half (desk, human-only gate, live-take homepage, celebrity question, beta card live with 16 views / 0 opens, IndexNow); mail still blocked in prod (6th ask, 5 people lost). Content engine restarted: queue 0 -> 18, 10 v3 runs, 4 MDsvex posts live, Andrew Garfield published on _Artificial_'s NYFF day (first people publish in 25 days) before the publisher died on Node 26 again. Unapproved retypes on live drafts: Sam Altman 4 -> 3, Dario 5 -> 6, Druski 8 -> 3. Instagram 59 / Quora 139 days dark.
- [2026-09-28](../daily-briefs/2026-09-28_marketing-status.md) — Growth gate passed (chain on time); headline: contributions 9 -> 0 (first empty week since July); the only retained contributor reloaded their unanswered q570 nine times, lost their session, got no reset email and left (last seen 09-22); four takes unanswered 8 days; host desk dead 16 days; mail off 26 days (third real person lost, signup 209); homepage V2 live but no gate. 0 / 34 matured contributor return. Growth's #1 bet unshipped 3rd week (confirmed from git) while DJ shipped 11 commits: personality ISR live, cross-link system (371 links, gate debt 66 -> 2, 139 live people rows synced), question-page opt-in tray, Talk-to-DJ rebuild (0 notes), The Nine harness (never run live), fresh GSC pull. Create queue empty 8 nights; 0 people publishes in 18 days; Druski refresh failed v3 verify and its draft retypes the live page 8 -> 3 unsynced. Instagram 52 / Quora 132 days dark.
- [2026-09-21](../daily-briefs/2026-09-21_marketing-status.md) — Growth gate passed (chain on time); headline: best takes on record (median 367 chars, gate 33%) landed on a host desk dead for 8 days (0/9 drafted); four reachable contributors incl. the first repeat contributor and the first answer -> register conversion got nothing; mail off 19 days and the 503 pre-check now blocks retries; `/` at 0/0 gate for a full week; none of last week's bets shipped (confirmed from git). DJ's week went to SEO: GSC indexed 464 -> 524 with the deploy-skew noindex fix pushed, and personality ISR + IndexNow + 2025-page unpublish sitting uncommitted behind `BYPASS_TOKEN` / `INDEXNOW_KEY`. Ben Shelton is the first v3 subject through the full chain (8.5 B+, images only); Rod Wave stuck at verify-repair; Harries failed permanently; create queue empty; 0 people publishes in 11 days. Instagram 45 / Quora 125 days dark.
- [2026-09-14](../daily-briefs/2026-09-14_marketing-status.md) — Growth gate passed; headline: best activation week on record (gate 25%, 7 contributors) and every contributor hit a dead end (0 reachable, 1 host reply at 115h, first anonymous opt-in never answered); welcome mail off 12 days and now blocking signup confirmations; 0/31 contributor return across seven matured cohorts. The mail blocker is a postal address that exists nowhere in config; the approved Enneagram campaign (31 eligible) waits on the same value. NEW: the 09-10 homepage rebuild removed the live featured question, and `/` has logged 0 gate events since (traffic flat). CORRECTION: the auto-publisher did publish the "lost" 08-28 -> 09-01 drafts and Zach Bryan; only post-publish `gen:all` fails on Node 26. Queue refilled + pipeline v3 shipped, 0 of 4 nightly attempts publishable; DB 447 -> 450. Instagram 38 / Quora 118 days dark; GSC 32 days stale.
- [2026-09-07](../daily-briefs/2026-09-07_marketing-status.md) — 10-day window (08-31 brief lost to a credit blackout). Growth gate passed; headline: loop fix shipped four hours after the week closed, Reddit alpha's only answer was "Pooopin", welcome sequence dead in prod since 09-02 (`EMAIL_FOOTER_ADDRESS` unset in Vercel, 4/4 enrollments errored; 0/28 contributor return across six matured cohorts). DJ shipped reply email + starters/pins + host desk + founding-circle drafts (`7db255b8e`), unmeasured. Content engine stalled both ends: create queue empty six nights, publisher lost 4 eligible drafts to Node 26 (streak 39), 9 hand publishes (429 -> 438 disk, DB 447). Reddit live as a channel (1 of 8 fired). Instagram 31 days / Quora 111 days dark; GSC 25 days stale.
- [2026-08-28](../daily-briefs/2026-08-28_marketing-status.md) — activation improved (matched comments 1 -> 4, gate 3.3% -> 15.4%; question-page funnel 7 -> 4 -> 4) and two registrations landed, one typed; the 08-24 welcome-exit, reveal persistence, attribution, sleep-protection, and reactivation fixes are live; the leak moved to post-answer relationship formation (4 opt-in views, 0 interactions/replies/returns); traffic +19.7% was direct/unknown while organic and returners were flat; four clean nightly drafts but publisher at 29 consecutive errors from a Node 26/engine mismatch; Instagram and Quora still dark.
- [2026-08-24](../daily-briefs/2026-08-24_marketing-status.md) — growth did not compound (17 -> 3 comments, gate 12.0% -> 8.6%, 5th straight matured cohort at 0% return) and the return-leg defect was located in `welcomeSequenceGuards.ts`; **CORRECTION: DJ shipped `/register` + reveal type capture 08-21 (`e62c71c55`) and the audit recorded it as unshipped**, though the reveal half is measurement-only; auto-publisher autonomously dark 25 days (6 manual publishes, 417 -> 423, victoria-justice + keira-knightley finally closed); perspective backlog 89 -> 86 with zero backfill (all +9 dirs went to new drafts); image debt regressed 7 -> 12; NEW host-sleep failure class cost both 08-24 runs (~3h, nate-bargatze retry 2/3); Instagram unscheduled 2nd week with 15 overdue queue items; Quora 97 days dark.
- [2026-08-03](../daily-briefs/2026-08-03_marketing-status.md) — growth reversed (contributions 14 → 4, gate 16.3% → 5.4%, contributor return corrects to 0%, 82% of registrants untyped); DJ broke the publish drought by hand (392 → 401 published, 9 manual with regrades) and it re-jammed in a day with image debt (54) overtaking stale grades (30); NEW create filename bug at `run-blog-pipeline.sh:109` burning retry 3/3 tonight; IG sourcing clean but zero comments posted 4+ sessions (agent escalated a fork) + new Claude weekly-cap failure mode; content-ops queue RED 0/10 approved; PA port blocked by NineChorus light-mode regression; Quora 76 days dark.
- [2026-07-27](../daily-briefs/2026-07-27_marketing-status.md) — best contribution week ever (14 comments, 10 humans; gate 15-19%, homepage 18.8%) but 9/10 contributors evaporate unreached; publish jammed 7 days (0 since julia-fox; 92 drafts on v1 rubric, victoria-justice fastest unblock); create recovered to cap; IG session FIXED (dedicated profile live 07-26 PM) but replies still unposted; GSC refreshed 07-25; reactivation launched (50 enrolled, 0 clicks).
- [2026-07-20](../daily-briefs/2026-07-20_marketing-status.md) — growth loop PROVEN (0→9 comments, native funnel + Chorus live, one full loop turn) but quarantined to ~0.6% of traffic; publish valve reopened (10+ posts, both prior blockers cleared); create timed out (travis-kelce, no draft); IG escalated dark 17/20.
- [2026-07-13](../daily-briefs/2026-07-13_marketing-status.md) — growth fresh (biggest visitor week converted to ~nothing); bottleneck flipped create→publish (0 posts 3 days); IG fully dark 7/7; GSC refreshed; new scout (Truell top pick).
- [2026-07-06](../daily-briefs/2026-07-06_marketing-status.md) — stale growth data; people pipeline failed twice on Oliver Tree; IG session blocked again; distribution/Quora still idle.
- [2026-07-01](../daily-briefs/2026-07-01_marketing-status.md) — publish gate unjammed (shipping daily again); IG healthy; signups leak + Quora + growth-audit-skip still open.
- [2026-06-20](../daily-briefs/2026-06-20_marketing-status.md) — two jammed gates (publish + Quora) + signups spam leak.
- [2026-05-09](../daily-briefs/2026-05-09_marketing-status.md) — first full marketing-state brief. Identified pop-culture queue as bottleneck.
- [2026-04-17](../daily-briefs/2026-04-17_pickup-brief.md) — pickup brief.

---

## Experiment + campaign log

Cross-link only. Detail lives in `docs/growth/growth-log.md`.

### 2026-10-05 — Beta card v1 live (`34d66f4ba`); first 7 hours

- `cta_experiment_events` (`beta_card_v1`, variants `read_like_this` / `flaw_or_alarm` / `nine_eyes`): 16 views (14 celebrity rail/inline, 2 Enneagram), 0 opens, 0 submits since 02:09 UTC 10-05. `coaching_waitlist` 0 new. Goal: 10 beta signups by 11-15. Too early to read.

### 2026-10-03 — Live-take homepage (q203) + celebrity mid-article question (q567) live (`3dfa99ef8`)

- Growth-log `### 2026-10-05`: q567 26 human fps -> 0 takes (median ~6 min engaged); q203 6 -> 0. Formal readout 10-17 (T-41 C). Growth bet #3 proposes rotating q118 into the celebrity slot.

### 2026-09-28 -> 10-04 — Post-answer loop experiment, week 4 readout

- Growth-log `### 2026-10-05`. 2 human comments (both on q118), 2 contributors (0 returning). Host digest restored 10-02 (10-03: 8 drafts), 0 acted; reply opt-ins 3 lifetime, 0 served; 1 DJ reply (to an anonymous take with no opt-in). Mail blocked 34 days. Of last week's bets: #1 partly done (desk fixed, critic emailed, site replies owed), #2 not done, #3 shipped 10-02.

### 2026-09-21 -> 09-27 — Post-answer loop experiment, week 3 readout

- Growth-log `### 2026-09-28`. 0 takes (first empty week since 07-06); gate fps 18 -> 30 but crawler-inflated (1/30 engaged >=30s, 17/30 no client visit). Host digest 0 drafts (dead since 09-12); `ReplyOptInTray` (shipped 09-23) 0 exposures; logged-in reply email 0 sent and its first eligible user churned unanswered; anonymous opt-ins 2 lifetime, both unserved; welcome 0 sent / 1 failed (signup 209). Contributor return 0/34 matured. None of the 09-21 bets shipped.

### 2026-09-26 — Homepage V2 Tier 1+2 live (`01ab4e7ef`); live-take funnel in preview only

- `docs/design/hyperplexed/HOMEPAGE_AUDIT_2026-09-26.md`. Production HTML contains "Answer before you see anyone" (verified by growth + this run). `/` still practice-only; live-take submit simulated at `/design-preview/homepage-live-take`. Week readout: 164 home-entry sessions, `/` engaged >=30s flat at 8, 0 gate hits from `/`. First 33h too early to read; homepage step events in PostHog not yet queried.

### 2026-09-22 — The Nine (Reddit-first traction) launched as playbook + harness, 0 actions fired

- `docs/growth/the-nine/` (HANDOFF, README, run-log, `scorecard.sql`, `pnpm nine:find`). Baseline 09-22: 422 questions / 57 with a human take, 24 comments in 30d, ~4.5k new visitors/week. Outcome pending: unbranded Reddit account + script app not created; conflicts with growth's "hold Reddit" until the loop is repaired.

### 2026-09-21 — Personality ISR live (`e69f2b7b8`); IndexNow not pinging

- `docs/seo/personality-isr.md`, `docs/seo/indexnow.md`. Verified 09-28: `/personality-analysis/taylor-swift` 200 with `x-vercel-cache: HIT`; discussion endpoint 200. IndexNow key file absent. Measurement note for growth: `content_access_events` / `9tanon` stop firing on personality pages from 09-21.

### 2026-09-14 -> 09-20 — Post-answer loop experiment, week 2 readout

- Growth-log `### 2026-09-21`. Gate 18 -> 6 (33.3%); 9 human takes, median 367 chars; contributions on 5 questions, q567 share 33%. Host digest produced 0 drafts (dead since 09-12); logged-in reply email 0 sent with its first eligible user now present; anonymous opt-in 2/14 cumulative, both unserved; welcome 0 sent / 2 failed; `/` 0 gate events. Contributor return 0/28 matured. None of the 09-14 bets shipped.

### 2026-09-19 — GSC deploy-skew `noindex` fix pushed (`6a5ac24ad`); ISR + IndexNow staged but uncommitted

- `docs/seo/gsc-indexing-audit-2026-09-19.md`: indexed 464 -> 524, not-indexed 764 -> 490 since 07-19. Fix: `scripts/carry-over-immutable-assets.mjs`. Outcome pending one deploy + URL re-inspection. ISR / IndexNow outcome pending commit + env vars (`docs/seo/personality-isr.md`, `docs/seo/indexnow.md`).

### 2026-09-10 — Homepage swap: live featured-question gate -> practice-first `HomeLandingV2` (`02b469175`, `2ca432d5b`)

- Unplanned as an experiment; logged so the readout isn't lost. Before (09-04 -> 09-10): `/` was the largest gate surface (9 gate fps, 2 contributions in 7 days; 21 `gate_shown` rows + 4 contributions since 09-01). After (09-11 -> 09-14): 0 gate events on `/`; all-path gate fps ~5.3/day -> ~3.3/day; homepage visitors flat. Small n, 3.3-day window, cause inferred. Proposed readout owner: `growth-analyst`, split by surface in the 09-21 audit. Detail: brief `2026-09-14` §Homepage.

### 2026-09-07 -> 09-13 — Post-answer loop experiment, week 1 readout

- Cross-link only. Gate 25.0% (record); host reply within 24h 0/7 (bar >=8/10); return not yet mature; q567 share 57% (bar <50%); logged-in reply email 0 eligible events; first anonymous opt-in, unserved. Detail: `docs/growth/growth-log.md` `### 2026-09-14`.

### 2026-09-03 — Reddit alpha: r/alphaandbetausers post on q567 (`alpha_beta_answer_first_20260831`)

- First tagged external distribution. 6 real fingerprints -> 2 reached the gate -> 1 contribution ("Pooopin", 20 s after landing); 1 read to 100% and hit `/register` twice without registering. Attribution criterion met (100% tagged); volume (6 vs >=15) and completion (1 vs >=2) missed. Growth's verdict: re-run only after the welcome fix and the loop experiment, landing on q118 not q567. Detail: `docs/growth/growth-log.md` `### 2026-09-07`; drafts in `reddit/`.

### 2026-09-07 — Post-answer loop experiment (reply email + starters + pins + host digest), shipped `7db255b8e`

- Cross-link only. Readout spec (4 weeks or 10 first-time contributors: >=8/10 host reply within 24h, >=2/10 return >24h in 7d, >=1 second contribution, q567 share <50%; guardrail gate >=10%, reply-email unsubscribes <=1) lives in `docs/growth/growth-log.md` `### 2026-09-07` bet #2. Founding-circle invites are the intended volume source; 0 sent as of this entry.

### 2026-04-08 — Full-stack growth audit (`growth-analyst-2`)

- Three concrete bugs identified: (1) `EnneagramCTASidebar` commented out + console.log handler, (2) stale "join the waitlist" copy in blog footers, (3) split visitor identity between `anon-*` and FingerprintJS `visitorId`.
- See `docs/growth/growth-log.md` "Experiment Log" for full hypothesis + metric plan.

---

## Conventions

- Dates are ISO `YYYY-MM-DD`. Today is set by the runtime, not invented.
- "Owner" is who pulls the next trigger (almost always DJ for external-firing actions).
- Cross-link rather than duplicate. Growth experiments live in `docs/growth/growth-log.md`; this log references them.
- The `marketing-pm` agent appends after every substantive run. If you (a human or another agent) edit this log, leave the dated entries intact.
