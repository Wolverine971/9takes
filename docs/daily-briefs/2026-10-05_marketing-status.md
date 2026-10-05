<!-- docs/daily-briefs/2026-10-05_marketing-status.md -->

# 9takes Marketing Status — 2026-10-05

**Unattended weekly run (Monday cron).** This covers 09-28 -> 10-05; the prior brief is `2026-09-28_marketing-status.md`.

- **The growth freshness gate passed.** The newest entry in `docs/growth/growth-log.md` is `### 2026-10-05`; the audit ran 06:00:00 -> 06:08:10 with exit 0, so the Monday chain was on time. Its headline and biggest leak are quoted verbatim below, not re-derived.
- **Data sources.** The Supabase MCP is down for the fifth week. DB reads this run were read-only `scripts/db-query.sh` queries: people publish counts, key people rows, `blogs_famous_people_history` since 09-28, `coaching_waitlist`, `cta_experiment_events` and `host_reply_drafts`. I also made six read-only GETs to production.
- **Nothing was changed.** This run touched no draft, publish flag, packet, queue, email, post or git state.
- **Other sessions are mid-work.** `git status` shows uncommitted changes to the beta card, `Comment.svelte`, the TOC, the personality category pages, `personBlogParser.js`, the Dario Amodei / Sam Altman pipeline output and today's growth-log entry. I touched none of it.

## TL;DR

- **Growth headline (verbatim, 2026-10-05 audit):** _"comments stayed at their pre-July floor for a second week (0, then 2, against about 8 a week from mid-July to mid-September). The two surfaces built to bring them back have shown the gate to 32 humans since 10-03 and received 0 takes. Celebrity pages are sending the deepest readers on the site to the gate: 26 viewers, a median of about 6 minutes on the page, and none answered q567. The host digest works again (10-03: 8 drafts), but none of the drafts was posted. The week's best visitor answered, opted in to replies, got "Server error" twice when registering, and left."_ Week of 09-28 (v2 RPC): 586 human visitors (35 returning), 2 human comments, 2 contributors (0 returning), 1 registration, and 1 booking, the first in 26 weeks.
- **Biggest leak (verbatim):** _"the people who do activate get nothing back. The week's one reachable contributor (25 minutes of reading, a take, an email opt-in, two registration attempts) was told "Server error" and has waited 4 days for a reply, while 8 drafts sit unposted on a host desk that now works. Anti-pattern: a leaky bucket. Celebrity pages are pouring readers into the top while the bottom is still open."_
- **DJ shipped both of last week's engineering bets, so the code side of the loop is fixed. The two steps only DJ can take are still undone.**
  - Shipped and pushed:
    - the host-desk rewrite (the 10-03 digest produced 8 drafts)
    - human-only gate counting plus `contribution.path`
    - the `/forgotPassword` fix
    - the live-take homepage and the celebrity mid-article question
    - IndexNow
    - the beta card (live since about 02:00 UTC today: 16 views, 0 opens, 0 submits)
  - Still undone:
    - **0 of 8 desk drafts posted.** Takes 749 and 743 have email opt-ins and no reply.
    - **`EMAIL_FOOTER_ADDRESS` is still missing in production (sixth ask).** Five real people have been lost to it, and another footer failure was logged today.
- **The content engine restarted.**
  - The queue was refilled 0 -> 18 by the 10-04 scouts.
  - The v3 pipeline ran 10 times in 48 hours.
  - 4 new MDsvex posts went live.
  - **The first people publish in 25 days: Andrew Garfield went live at 06:00 today, the day _Artificial_ premieres at NYFF.**
  - The publisher then died on `pnpm gen:all` with a Node v26.5.0 engine error. Every auto-publish since 08-29 has broken the same way after publishing.
- **Three live people pages have unapproved retypes sitting in their drafts. None is synced, and each is a T-38-sized call for DJ:**
  - **Sam Altman 4 -> 3:** v3 verify passed; uncommitted. Five published pop-culture posts and the unpublished _Artificial_ explainer call him a 4.
  - **Dario Amodei 5 -> 6:** verify returned `insufficient_evidence`; uncommitted.
  - **Druski 8 -> 3:** committed; undecided for a second week.
- **Still dark:**
  - Instagram: 59 days (queue RED 0/10, frozen 58 days)
  - Quora and Twitter: 139 days
  - Outreach: 62 days
  - One Take: 72 days
  - The Nine: 0 actions in 13 days
  - Pop-culture: 22 unpublished (the oldest is 294 days old)
  - Distribution: 10 packets unfired, including the new be-gentle promo set

## The actual work: the desk works, nobody is at it

Last week's brief said the loop repair was "small and well specified" and kept losing on attention. DJ took the engineering half this week (`6f34ad64b`, `3dfa99ef8`, `d0984dab1`). Every remaining item on the leak is now a DJ action or a short delegated fix:

| Component                                        | State (observed: growth audit + this run)                                                                                                                                                                                                                                                  | Owner / next step                                                                                                                                 |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host digest / desk                               | **Fixed 10-02.** 10-03 run sent 8 drafts (7 model + 1 fallback); 10-04 `no_takes`. **0 of 8 acted.** DB: `host_reply_drafts` 9 pending / 1 posted lifetime                                                                                                                                 | **DJ, ~15 min.** 749 and 743 first (email opt-ins). Replies for 746/747 are drafted in `docs/growth/host-desk/2026-10-03-type6-critic-replies.md` |
| Reply opt-ins                                    | 3 lifetime (733, 743, 749), all `notification_count = 0`. DJ's one reply (752 -> take 750) went to an anonymous "ok" with no opt-in                                                                                                                                                        | Fires the moment DJ replies to 749 or 743                                                                                                         |
| Registration                                     | 2 people, 4 `AuthWeakPasswordError` events (10-01, 10-03), 0 registered. `register/+page.server.ts:144-157` shows "Server error" for anything that isn't an `AuthApiError` 400                                                                                                             | Eng, ~30 min (delegable): map it to a plain "pick another password" message and keep the form filled                                              |
| Welcome + confirmation mail                      | Blocked 34 days. 5 real people lost (208, the 09-19 registrant, 209, the 09-29 registrant, 211 today). **Local `.env` now has a non-empty `EMAIL_FOOTER_ADDRESS` (it was empty on 09-28)**, but production failed on it again today, so the value is inferred to be missing only in Vercel | **DJ, ~10 min:** set it in Vercel production, redeploy, resend 211's confirmation and the 09-29 welcome                                           |
| Celebrity mid-article question (live 10-03)      | q567 only: 26 human fps -> 0 takes. 24 engaged >=30 s, median about 6 min. On 10-04, its first full day, it was already the largest gate surface on the site (18 fps)                                                                                                                      | **DJ, ~10 min:** approve the T-41 G seed drafts so the slot rotates q118 (`docs/taskers/T-41-assets/G-nine-takes/`)                               |
| Live-take homepage (live 10-03)                  | q203: 6 fps -> 0; about 3 engaged humans a day                                                                                                                                                                                                                                             | Readout 10-17 (T-41 C), as before/after                                                                                                           |
| Beta card ("experimental therapy, 9takes style") | **Observed live (client-rendered).** `cta_experiment_events` since 02:09 UTC today: 16 views (16 fps) across 3 copy variants, 14 on celebrity pages and 2 on Enneagram pages; **0 opens, 0 submits**. `coaching_waitlist`: 0 new since 10-04. Goal: 10 signups by 11-15                    | Too early to read. The 2 invites (Ryan, Shaikh) are still unsent Gmail drafts in dj@9takes.com (per memory, 10-03)                                |

Growth's three ranked bets are adopted as-is in the Recommendation below. **PM read:** these three are the whole leak, and together they cost about 35 minutes of DJ time plus one 30-minute delegated fix. Don't start new top-of-funnel work until they're done. The _Artificial_ cluster, the four new posts and the beta card all add readers to the bucket this is meant to plug.

## Tooling state

- **Publisher (06:00 OpenClaw):** it published Andrew Garfield, then died in `gen:all` with `ERR_PNPM_UNSUPPORTED_ENGINE` ("Expected >=22.13.0 <25, Got v26.5.0").
  - The 09-21 brief guessed that the new Node default (v24.18.0) would fix this. **It didn't.** An interactive shell resolves v24.18.0, but the job's environment resolves v26.5.0.
  - The same error appears in the 08-29, 08-30, 08-31 and 09-10 publish logs.
  - Effects:
    - `gen:all` (sitemap, llms.txt, corpus stats, search index) doesn't run after a publish.
    - The publisher's frontmatter edit to `Andrew-Garfield.md` (`published: true`, `date`/`lastmod` 10-05) sits uncommitted.
    - The job exits 1 even when it succeeds.
  - Fix: pin Node 24 on the PATH in `scripts/daily-blog-publisher.sh`.
- **Nightly create:**
  - The pipeline-lock fix (`8b2852cfb`) works: 10-04 02:06 and 10-05 02:00 both logged "PIPELINE BUSY … skipping tonight".
  - Side effect: DJ's manual runs (Florence Pugh, then Dario Amodei) held the lock both nights, so **0 nightly creates have run since the refill**.
  - On 10-04 at 02:00, before the fix, the cron collided with the lock and logged "RETRY 1/3" for Codie Sanchez. The queue file shows `retryCount: 0`; memory says it was reset by hand.
  - The "queue is EMPTY" Telegram nag stopped on 10-04.
- **Pipeline failures this week:**
  - **Tiger Woods** `repair`: "Stage modified a read-only input", the parallel-edit failure class.
  - **Joseph Zada** (10-05 01:09 run): the `draft` stage still reads `running`, but no pipeline process is alive, so the run is stalled.
- **Weekly Crosslinks (OpenClaw, Thu):** status `error` on 10-01. It added 12 links (gate debt 3 -> 2), then `crosslinks:check` failed on `be-gentle-when-youre-right`, which had 0 links at the time. Be-gentle got 4 inbound links on 10-03, so the 10-08 run should clear. Whether Andrew Garfield's new page meets the gate is unverified; I didn't run the check because it can rewrite `baseline.json`.
- **Image rule (`65a29e616`, `54943c886`):** agents never generate images. Both OpenRouter scripts now exit with an instruction, and `scripts/blog-image-variants.mjs` builds the variant set from an image DJ makes in ChatGPT. Every new MDsvex hero is now a DJ step.
- **IndexNow is live:** the key file returns 200, and the first real submit on 10-03 got HTTP 202. Last run 10-05 00:56 UTC.

## Cross-surface status

### Growth and email

- Headline and leak are quoted above. Other facts from the 10-05 entry:
  - Two series breaks fall inside the week: on 10-02 crawlers stopped counting in `gate_shown`, and on 10-03 the new surfaces went live.
  - The 26-week context shows a real drop: 12 human comments in the 13 weeks to 07-06, 82 in 07-13..09-14, and 2 since.
  - Visitors held: 586 is inside the normal band (26-week median 538).
  - The RPC counted 1 real signup (210); growth infers it was a bot sweep.
  - Signup 211 today is real (Google -> `/personality-analysis/type/1`), and its confirmation failed on the footer address 0.4 s after signup.
- **The first booking in 26 weeks produced a content fix.** A Talk to DJ note said Trump was typed 8 in one article, and T-38 retyped him (`e4fe1d896`). The note left no email, so DJ can't reply.
- **The Type 6 critic** (author of 746/747) was emailed on 10-03 ("You were right about the Type 6 section"). No reply, and no visits since 09-22.
- Email: 0 sends since 09-01 20:30 UTC. 2 sends failed this week and 1 today, all on `EMAIL_FOOTER_ADDRESS`. The Enneagram campaign (31 eligible) is waiting on the same value.
- Full evidence: [`docs/growth/growth-log.md`](../growth/growth-log.md) `### 2026-10-05`.

### Blogs — people

- **DB: 451 published / 134 unpublished** (was 450 / 134). Andrew Garfield was published, and a Tiger Woods row was inserted unpublished on 10-04. Disk: 442 `published: true`.
  - **Andrew Garfield** (v3 verify `pass`, 7 dimensions averaging 8.5; release.json present) went live 10-05 06:00. Production returns 200 with the title "Andrew Garfield Enneagram Type 4: Why He Walks Toward Grief". It lands the same day _Artificial_ (he plays Sam Altman) premieres at NYFF. Wide release is Dec 25.
- **The 10 v3 runs (10-04 -> 10-05)** were all started by DJ. Their verify verdicts:
  - **Pass:** Andrew Garfield (published) and Sam Altman (refresh of a live page).
  - **`insufficient_evidence`:** Florence Pugh (create, mean 8.46, no release), Joseph Zada (refresh, enneagram 7.0, the Open Case pilot) and Dario Amodei after repair.
  - **`revise`:** Druski (edit, then revise again after repair) and Tiger Woods (create, then the repair stage failed).
  - **Incomplete:** Zada also has two later runs: one research-only, one stalled at draft.
- **Retypes waiting on DJ** (none synced, so the live DB rows are unchanged):

| Page         | Live (DB) | Draft on disk | Verify                                 | Disk state                | Downstream                                                                                                                                                                                                                                                                                                                  |
| ------------ | --------: | ------------: | -------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sam Altman   |         4 |         **3** | pass (10-05, release.json)             | uncommitted (05:13 today) | Type 4 in 5 published pop-culture posts (`tech-titans-ai-wars`, `musk-vs-altman-trial-…`, `fallen-founders-…`, `tech-titans-leadership-styles`, `tech-titans-enneagram-analysis`), the unpublished `artificial-movie-real-people` (its Altman section is built on Type 4), and about 3 live people pages (rough text match) |
| Dario Amodei |         5 |         **6** | `insufficient_evidence` (after repair) | uncommitted (02:04 today) | The new title "Why Dario Amodei Can't Stop Building the Thing He Fears Most". The draft fails release, so it shouldn't sync as-is                                                                                                                                                                                           |
| Druski       |         8 |         **3** | `revise` (10-04, twice)                | committed (`aedde5e34`)   | Open since 09-24                                                                                                                                                                                                                                                                                                            |

- **Sync risk:** all three drafts are `published: true`. Per memory, a bare `pnpm push:people` usually dies on the perspective gate for legacy posts, but an explicit `--sync` would push a retype live.
- **Publisher blockers (10-04)** were unchanged apart from `missing_thumbnail_image` 1 -> 14 (cause not investigated). The closest candidates are still `tyla`, `ms-rachel`, `sandra-bullock` and `florence-pugh` (8.4, no release). Ben Shelton isn't on the list (unexplained, as last week).
- **Queue:** 18 entries. 4 are entity gaps (Codie Sanchez, Shyam Sankar, Dylan Patel, Dan Ives) and 14 are surging-scout CREATEs (Daniela Amodei, Greg Brockman, Ilya Sutskever, Stella Lefty and others). Held: Austin Abrams and Joseph Zada.
- **Meta titles:** 16 of 17 were synced live 10-04 (Sam Altman held). Napoleon's coronation-myth fact fix was also applied live 10-04.

### Blogs — other categories

- **Live this week** (all confirmed 200 in production or in the sitemap):
  - `community/be-gentle-when-youre-right`: DJ's finished essay replaced the scaffold
  - `community/enneagram-community`
  - `enneagram-corner/how-common-is-each-enneagram-type`
  - `what-is-a-love-language`
  - `which-enneagram-type-is-most-likely-to-be-a-narcissist`
  - Each of the four new posts has 3+ inbound links and a dedicated hero (`e710d8a05`).
- **Retired with a 301:**
  - `trump-type-8-vs-biden-type-2` -> `trump-type-3-vs-biden-type-2` (T-38)
  - `enneagram-stress-number` -> `enneagram-types-in-stress` (it was cannibalizing that page)
  - The sitemap is consistent (714 URLs).
- **New draft:** `pop-culture/artificial-movie-real-people`. It runs 3,094 words, is `published: false`, has no hero on disk (`artificial-movie-real-people-composite`), has 0 inbound links, and types Altman as a 4 (see the table above).
- **Pop-culture:** 22 unpublished (was 21; +artificial). The oldest is `aoc-and-the-squad` (2025-12-15, 294 days).

### SEO

- **The GSC data was pulled fresh on 10-04.** The 10-03 search plan (`docs/content-strategy/2026-10-03-search-cleanup-and-gap-plan.md`) found that **search isn't shrinking**: September had 1,465 clicks, the best month in the 15-month file. The losses sit on a handful of older Enneagram Corner pages.
  - The class bug is "which type is most X" queries that the pages never answer. A new tool, `pnpm audit:superlatives`, cut those flags 9 -> 2. Thirteen pages were cleaned.
- **Still open from the plan (DJ-only):** request indexing for the 7 people URLs that dropped out after the March lowercase-slug move (jenna-ortega, olivia-rodrigo, robert-downey-jr, travis-scott, ryan-reynolds, will-smith, harry-styles). Also: the T-08 autism draft (unpublished 80+ days), the Sky Bri status refresh, and the Ghislaine Maxwell MBTI FAQ.
- **Jordi Hays:** the identity-first snippet shipped 10-04; read it around 11-01.
- **T-41:** A (spam-update / noindex readout) is gated to on or after 10-10; C (surface readout) to on or after 10-17. N (SEO proposals) and M (critical-CSS plan) are waiting on DJ.

### Distribution and social

- **New packet:** `docs/distribution-assets/2026-10-04-be-gentle-when-youre-right-promo.md` (10-slide IG carousel, X thread and more; "DRAFTS ONLY"). Per the packet, the essay "has no search demand. It only finds readers when someone shares it." Unfired.
- **Legacy packets:** 9 `*-distribution.md`, newest 07-14 (83 days), oldest 02-25 (222 days). `LAUNCH-CHECKLIST.md` is unchanged.
- **Instagram:** the last session was 08-07 (59 days). `check-marketing-content-queue.mjs` reads **RED**, identical to the last 8 checks: approved 0/10, copy-ready 11/15, triaged 19/20, design-ready 2/3, QA 0/2. `queue.json` was last committed 08-08. Only the Daily Engagement and Monday Content Batching reminders still fire.
- **Quora / Twitter:** the last cron log and session are from 05-19 (139 days).
- **The Nine:** the run log's last entry is 09-22. No unbranded account or script app exists, `queue/` is empty, and growth still says "held".

### Outreach, video, coaching

- **Outreach:** no artifact since 08-04 (62 days). One Take ep 1 is unfilmed 72 days after the format decision.
- **Coaching / beta:** `/book-session` (Talk to DJ plus an #experimental-therapy section) returns 200. The beta card numbers are in the table above. DJ's 10-03 decision stands: the beta replaces paid sessions, and success means beta signups (goal 10 by 11-15).

## What changed since 2026-09-28

- **Shipped and pushed** (`main` = `origin/main` at `54943c886`):
  - `182fda99b` (09-29): engagement-trends RPC and chart
  - `74881641f` (10-01): weekly cross-links, 12 links
  - `6f34ad64b` (10-02): host digest rewrite, crawler-free gate + `path`, `/forgotPassword` reCAPTCHA fix, deploy-skew manifest v2, the `_v2` weekly RPC
  - `3dfa99ef8` (10-03): live-take homepage (`POST /api/homepage/answer`), celebrity mid-article question, the T-38 draft
  - `e4fe1d896` (10-03): T-38 live with a 301, Type 6 critic reply drafts
  - `d0984dab1` (10-03): T-41 B/D-L, IndexNow key, lint restored, blog-embed CSS
  - `d7d8cdfe8` (10-03): admin dashboard snapshot + pg_cron
  - `0d1beba58` (10-04): search cleanup, 13 pages, the superlatives audit, GSC pull
  - `8b2852cfb` (10-04): two scouts, queue refill, lock fix, _Artificial_ draft, entity-gap gate
  - `e710d8a05` + `81d78576c` (10-04): 4 posts published, be-gentle promo packet
  - `34d66f4ba` (10-04): beta card, CTA experiments, `cta_experiment_events` (the table exists in prod)
  - `65a29e616` / `54943c886` (10-04): the image rule
- **Uncommitted, other sessions:** beta card and comment/TOC/category-page edits, the `personBlogParser.js` change, the Sam Altman and Dario Amodei refresh output, the publisher's Garfield frontmatter edit, and today's growth-log entry.
- **Won:**
  - Host desk alive again (first runs since 09-13)
  - Gate counts are human-only
  - Both new gate surfaces live
  - First people publish in 25 days
  - 4 new search-targeted posts
  - IndexNow pinging
  - The first Talk to DJ booking ever
  - The create queue refilled
- **Broke or degraded:**
  - Comments stayed at 0 -> 2
  - 2 registrations lost to a mislabelled error
  - Publisher `gen:all` still breaks after publishing
  - 3 unapproved retypes on live-page drafts
  - Tiger Woods repair failure; Zada run stalled
  - Weekly Crosslinks job errored
- **Decided (observed from artifacts and memory):**
  - 10-03: the beta replaces paid sessions (The Decode retired), success = beta signups, recruiting unparked.
  - 10-03: Trump retyped 3 (T-38).
  - 10-04: the 14-name surging slate plus the AI cluster queued.
  - 10-04: be-gentle got the lean ending (no answer box).
  - 10-04: `enneagram-stress-number` retired to `types-in-stress`.
  - 10-04: beta card design "experimental therapy, 9takes style" (the post-take prompt was rejected).
  - 10-04: agents never generate images.
- **Answers to the 09-28 open questions:**
  - Q2 (host desk) and Q4 (gate instrumentation): shipped.
  - Q7: queue refilled.
  - Q1 (replies): partial. The critic was emailed; site replies are still owed.
  - Not answered: Q3 (mail), Q5 (Druski), Q6 (The Nine vs. the hold), Q8 (Instagram and the backfill).

## Recommendation

**1. Clear the host desk today, opt-ins first (growth bet #1).** About 15 minutes of DJ's time.

- **What:** in `/admin/host-desk`, post real replies to **749 and 743 first**, since both have email opt-ins, then work through the rest of the 8. For 746/747, use `docs/growth/host-desk/2026-10-03-type6-critic-replies.md`. No fallback text.
- **Why:** the code is fixed, so the only thing missing is the reply. A DJ reply is the only event that has ever retained a contributor (1 of 45 since July). The opt-in tray and the homepage both promise one.
- **Success (growth, 7 days):** at least 1 `notification_count > 0`, and `b83f1c12` or 743's author seen again. Over 2 weeks, at least 80% of new human takes get a reply within 24 hours.
- **Risk:** low. Reply emails are transactional, so the footer guard doesn't block them.

**2. Stop turning away people who already said yes (growth bet #2: the sixth mail ask, plus the password message).** About 10 minutes for DJ, plus about 30 minutes of delegated engineering.

- **What:** DJ puts the postal address into Vercel production as `EMAIL_FOOTER_ADDRESS` and redeploys. Local `.env` already has a value, so the address exists. Then resend 211's confirmation and the 09-29 welcome. In parallel, an implementation agent maps `AuthWeakPasswordError` to a plain message on `/register`, keeps the form filled, and leaves the diff for DJ to review.
- **Why:** both people blocked this week retried before they quit. Every failed send since 09-02 has the same single error, and 5 real people have been lost to it.
- **Success:** the next weak-password hit is followed by a profile within 10 minutes; 0 footer errors over 7 days; 211's confirmation sends within 24 hours. Guardrail: `idempotency_key`, so no duplicate sends.

**3. Give the celebrity slot an easier question before the 10-17 readout (growth bet #3).** About 10 minutes of DJ review.

- **What:** approve the q118 / q203 seed drafts in `docs/taskers/T-41-assets/G-nine-takes/` (both pass `--dry-run`). Celebrity pages then rotate q118 ("what were you like as a kid, in 3 words") in alongside q567.
- **Why:** in one day, celebrity pages became the biggest gate surface with the deepest readers, and they've converted 0 of 26. q118 got 100% of the week's takes; q567 asks for a private disclosure in the middle of an article.
- **Success:** over 2 weeks after seeding, at least 3 celebrity contributors a week, and q118's answer rate above q567's. Guardrail: celebrity median engaged time stays at 5 minutes or more. Read it as a before/after, not an A/B.

Following queue (cheaper to batch, not ranked above):

- (a) **Typing calls before anyone syncs** (Open question 5). Sam Altman is time-sensitive because of the _Artificial_ window.
- (b) **Pin Node 24 for the 06:00 publisher job** (about 5 minutes of engineering). Then commit the publisher's Garfield frontmatter edit and run `pnpm index:blogs` so Garfield shows up in site search.
- (c) **Request indexing** for the 7 de-indexed people URLs in GSC (about 10 minutes, DJ only).
- (d) **Fire or drop** the be-gentle promo packet.

## Open questions for DJ

1. Will you post the desk drafts today, 749 and 743 first, as real replies?
2. Will you set `EMAIL_FOOTER_ADDRESS` in **Vercel production** (sixth ask; the local `.env` has a value now)? Once it's set, are the resends of 211's confirmation and the 09-29 welcome approved?
3. Can an implementation agent fix the weak-password "Server error" on `/register` on a branch for your review?
4. Do you approve the T-41 G seed takes (q118 and q203) so the celebrity slot rotates q118 before the 10-17 readout?
5. Sam Altman: is he a 3 now (the 10-05 refresh, verify pass) or still a 4?
   - **If 3:** it's a T-38-sized cascade (5 published pop-culture posts plus the explainer's analysis section). Scope the cascade before syncing anything.
   - **If 4:** revert the refresh's typing before anyone runs `push:people --sync`.
   - Same question for Dario (5 -> 6, verify failed: revert or re-run?) and Druski (8 -> 3, second week).
6. The _Artificial_ explainer (`pop-culture/artificial-movie-real-people`): publish into the premiere wave, or hold for the Dec 25 wide release? It depends on #5, and it needs a hero and 3+ inbound links either way.
   - For the hero, use either a portrait composite like the other pop-culture heroes, or run this house-style prompt in ChatGPT yourself: _"Cinematic 16:9 night scene: two classical Greek marble statues on an empty film set. One stands at center in a modern suit; an identical marble double sits in a director's chair, studying him. A film clapperboard and coiled cables rest in shadow. A single sodium-amber streetlamp is the only key light, the background is near-black, with subtle film grain. No text, no logos, no real-person likeness."_
   - Then run `node scripts/blog-image-variants.mjs artificial-movie-real-people-composite <image>`.
7. Standing forks (eighth brief):
   - Restore or retire Instagram (59 days dark)?
   - Grandfather or batch-backfill the 72 drafts blocked on perspective review?
   - Does The Nine stay held behind the loop repair?

## Assumptions and limits

- Growth numbers are quoted from the 2026-10-05 growth-log entry, which is uncommitted and was written by today's audit. They aren't re-derived.
- "`EMAIL_FOOTER_ADDRESS` missing in Vercel" is inferred: the local `.env` has a non-empty value (I checked presence only; the value wasn't read), and growth logged a production footer failure today. No Vercel env was read.
- "Node v26.5.0 in the publisher's environment" is observed from the 10-05 publish log. The interactive shell resolves v24.18.0. The cause (PATH order in the OpenClaw job) is inferred.
- Beta-card numbers are a 7-hour window of client `viewed` events. Bot share wasn't checked.
- "About 3 live people pages call Altman a 4" is a rough `ilike` match on DB content. The 5 pop-culture posts were confirmed by grep plus their `published: true` flags.
- I didn't run `crosslinks:check`, because it can rewrite `docs/crosslinks/baseline.json`. Garfield's link-gate status is unverified.
- Instagram, Quora, Twitter and Reddit claims come from the repo and the scheduler. No live account was inspected.
- Only this brief and `docs/marketing/marketing-log.md` were written.
