<!-- docs/daily-briefs/2026-11-16_marketing-status.md -->

# 9takes Marketing Status — 2026-11-16 (Monday, unattended weekly brief)

**BLUF:** Google pulled about 70% of search entries starting 11-13. The cause is inferred to be the November core update; pages are still indexed, and Bing and DuckDuckGo held. That makes the leak growth has flagged for eight weeks more expensive, because 0 of 25 contributors since 10-19 have come back. The one cheap move is the same as last week, with a new name on it: reply today to contributor 787/788, the first reachable contributor since 10-19 (registered, 57 minutes on site, two long takes, opened both welcome emails), and make sure the reply reaches their inbox. On search, do nothing until about 12-01. That includes not syncing the 63 people meta-title rewrites that landed in drafts on 11-15. The people lane produced 1 pass in 7 nights: the nightly runner lost 2 nights to a killed preflight and burned all 3 of one subject's retries in a single night.

## TL;DR

- **Growth data is fresh (gate passed).** Growth-log `### 2026-11-16`; `logs/growth-automation/audit-2026-11-16.log` shows "claude exited 0" at 08:34:09.
  - Headline, verbatim: _"Google cut search entries by about 70% from 11-13 (the November core update), the first reachable contributor since 10-19 got no reply, q573 went 0 for 100, and returning contributors were 0 for an eighth week."_
  - Biggest leak, verbatim: _"still the return leg, for the eighth straight week. 0 of 25 contributors since 10-19 came back to take again. This week the one contributor 9takes could reach (registered, 57 minutes, two long takes, opened both emails) got no reply and has not returned. Then Google cut the inflow that hides this leak by about 70%."_
- **Growth bet #1 is DJ-only and dated today:** reply to 787/788 and confirm the reply arrives by email (about 10 minutes; the drafts are on the host desk). The host desk sits at **42 pending / 1 posted** (re-queried today), and the last desk post was 09-14. Last week's bet, the note to the 11-05 beta lead, is **not met in the DB**: `coaching_waitlist` is still 20 rows, newest 11-06.
- **Search: hold until about 12-01, and don't confound the read.** On 11-15, commit `be1a7024a` rewrote **63 people `meta_title`s in drafts**. I spot-checked two (sza, kanye) and the DB still has the old titles. A blanket `pnpm push:people` would push all 63 live in the middle of the rollout. Growth's guidance is no retitles until about a week after the rollout ends.
- **0 people publishes for a second week. DB 464 published / 159 unpublished** (was 464 / 155). The publisher found "No publishable draft" on 4 mornings and stopped silently on 2 (11-13, 11-16).
  - `pnpm people:ready` now lists **10 passes waiting only on a portrait.** Aspyn Ovard (8.2) joined on 11-15, under the new 8.0 floor DJ set on 11-13.
  - 25 subjects are held or edited.
- **The nightly runner is the new failure, not auth.**
  - 11-14 and 11-16: "claude CLI: a one-word test call failed (exit killed): ok". The CLI answered, then the preflight hung for 16 minutes and was killed.
  - 11-13: the cron fired **4 times in one night** (01:00, 02:42, 04:17, 06:18). Drew Afualo used up 3 "retry tomorrow" attempts in about 4 hours. All 4 Telegram alerts that night failed.
  - Salomé Andrea, a DJ request on 11-13 tied to the Mormon Wives OC premiere on 11-12, is waiting first in the queue behind the broken preflight.
- **Closed this week:** the public-repo transcript ask. `dario-and-daniela.md` is untracked and cached outside the repo, and about 6,750 transcript and pipeline files were untracked (`4fb270043`). Purging git history is still DJ's call. GSC was pulled 11-10 (no longer stale), and crosslinks ran 11-12 (gate debt 0).

## The actual work: one reply, one rotation, and keeping hands off search

The core update didn't open a new problem. It shrank the traffic that was hiding the old one. Every lever that matters this week is either DJ-only or a DJ "go".

| Artifact                                                                  | State (observed today unless noted)                                                                                                                                                                                            | Owner  | Next                                                                                                                                    |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| 787/788 (Google -> Corner neurodivergence guide, registered)              | Per growth: two long takes (428 and 419 characters), opened welcome steps 1 and 2, no visit since 11-12, 0 replies. The desk draft exists. Logged-in replies only show in-app, and `reply_notification_outbox` has 0 rows ever | **DJ** | Reply today, plus a personal email so it actually arrives. Growth's bar: a return visit or new take by 11-23 (n=1, read it as a signal) |
| Celebrity starter q573                                                    | Growth: **0/100** this week, 3/224 (1.3%) over two weeks, against q118's 7/295 (2.4%). Marked **lost**                                                                                                                         | DJ go  | Rotate back to q118 or a q118-shaped one-liner. Success: 2% or more over 2 weeks, depth guardrail at 3.5 min or more                    |
| 63 rewritten people meta titles (drafts only)                             | Committed 11-15 in `be1a7024a`, not in the DB (spot-checked 2 of 63)                                                                                                                                                           | DJ     | Hold any all-drafts `push:people` until after the 12-01 GSC re-pull. Single-person `--sync` is unaffected                               |
| Search baseline                                                           | Growth saved `2026-11-16-gsc-pages.mjs` and `-gsc-daily.mjs`. Biggest per-day impression losses: sky-bri 569 -> 19, ashby 338 -> 3, alex-karp 311 -> 8, compatibility matrix 332 -> 20                                         | growth | Re-pull on 12-01 against this week                                                                                                      |
| 11-13 ships (keep-this-page invite, test answer card, homepage live-take) | Live about 2.5 days inside the drop, with 0 signups and 0 takes so far. No read yet                                                                                                                                            | growth | Read on 11-30                                                                                                                           |

**Is it the site or Google? (inferred).** The 11-13 evening ship (`7823ca0a5`) and the 11-14 inline-CSS change (`svelte.config.js` `inlineStyleThreshold`, with an `INLINE_PAGE_CSS=0` kill switch) both landed inside the drop window. Three facts point to Google, not the site:

- GSC already showed 11-13 down (5,267 impressions vs about 8,000-9,000) before the evening deploy.
- Bing and DuckDuckGo held.
- Growth found the top URLs indexed, returning 200 and `index, follow`.

## Tooling state (changes only)

- **Nightly people runner (new failure class):**
  - **Preflight killed on 2 of 7 nights** (11-14, 11-16). The test call printed "ok", then got "exit killed" after about 16 minutes. This isn't the 11-08 expired-login message, so it's likely a hung CLI process, not auth. Inferred, unverified.
  - **Cron multi-fire on 11-13:** four starts in one night. Drew Afualo went from retry 1 to "FAILED permanently" by 05:23, though the retry design assumes one attempt a night. She is back in the queue (second place) in the working-tree queue file, so someone re-queued her.
  - **Telegram alerts failed 4 of 4 on 11-13.** That was the night of the permanent failure, so DJ may not know about it.
  - **Research-stage timeouts are now the dominant failure:** Drew Afualo ×3, Quenlin Blackwell, Larry Ellison (draft stage), and QTCinderella last week.
- **Publisher silent stops:** 11-13 (log has only the start line) and 11-16 (the start line plus two validation warnings, no exit line, and no process running at 08:37). With 11-01 and 11-09, that's four in three weeks. It cost nothing because nothing was publishable, but it will cost a day once something is.
- **People pipeline rebuilt 11-13 (memory):**
  - The release floor is now 8.0 (DJ: "score as advisory above 8.0").
  - New `--reverify` and `--reassess` modes, plus `pnpm people:ready`.
  - Per memory, no full real nightly run had been checked under the new code. Aspyn Ovard's 11-15 pass (68 minutes, exit 0) is the first one, and it worked.
- **Site performance:** page CSS is now inlined into the HTML (T-41 M, measured 11-14). Every hero and portrait got a phone-size AVIF (`gen:image-variants`, 839 files).
- **Sitemap (11-15):** questions can now be indexed before they have category tags, and `/posting-and-privacy` was added. IndexNow was resubmitted 11-15 (`docs/data/indexnow/last-submitted.json`).
- **Supabase MCP down (11th week).** Data came from read-only `scripts/db-query.sh` and the read-only `people:ready`.

## Cross-surface status

### Blogs

- **People DB: 464 / 159.** New unpublished rows: QTCinderella, Josie Totah, Larry Ellison and Aspyn Ovard.
- **Nightly results, 11-10..11-16: 1 pass in 7 nights.**
  - Josie Totah: held, `insufficient_evidence`, 8.0. 7 vs 3 isn't separated.
  - Larry Ellison: draft timed out on 11-11, then held on 11-12 (`revise`, 8.1; the Type 8 argument scored 7.4).
  - 11-13: Drew Afualo ×3 and Quenlin Blackwell, all research timeouts.
  - 11-14: preflight killed.
  - Aspyn Ovard: **passed** at 8.2 on 11-15. The runner says "give it a read first".
  - 11-16: preflight killed.
- **Waiting on DJ (`people:ready`):**
  - 10 portrait-only passes: Schafer 8.6, Olah 8.6, Fike 8.5, Bettany 8.5, Harries 8.5, Hinton 8.5, Talarico 8.5, Ludwig 8.5, Ippolito 8.3 and Aspyn Ovard 8.2.
  - 25 held or edited.
  - Per memory, Lily-Rose-Depp, Ben Shelton, Codie Sanchez and Greg Brockman **already have portraits** and would pass under the 8.0 floor. Today's `people:ready` suggests `--reverify` for each (Ben Shelton has been edited since he passed). These are the only near-term publishes that need no image work.
- **Queue: 5** (Salomé Andrea, Drew Afualo, Quenlin Blackwell, Amanda Seyfried, Steve Wozniak), about a week of runway. 18 held, 3 failed. `backlog-queue.json` has uncommitted changes from another process; I read it and didn't edit it.
- **Still unsynced (3rd brief):** Sam Parr, Shaan Puri and Scott Galloway. The DB titles still differ from the draft titles. Per memory, the live Shaan page names his wife.
- **MDsvex:**
  - Not live: pop-culture 18, community 17 (+2 with no flag), Enneagram 18 (+14 with no flag), guides 14 (+5 with no flag), topical 1, life-situations 1. No `published:` flips this week.
  - **The Thanksgiving situational series is dead for SEO this year.** All six skeletons are unchanged since 11-04/05, with 3-4 `[DJ: ...]` slots each still empty. Thanksgiving is 11-26, 10 days out, in the middle of a core-update rollout.

### Distribution and social

- Parked, unchanged:
  - Instagram queue RED: 0/10 approved, 11/15 copy-ready, 2 design-ready. The last IG session was 08-07, 101 days ago.
  - Quora: last cron log 05-19, 181 days ago.
  - Twitter: no activity.
  - 16 distribution assets, the newest from 10-04.
- Per growth's 11-14 pull, non-search channels have never produced a lead: about 230 engaged humans from social and AI in 9 months, 0 leads.

### SEO

- **GSC is fresh:** pulled 11-10 (window 08-10..11-08), plus growth's daily and page pulls on 11-16. The 11-14 follow-up closed the spam-update watch with no hit, and all 3 Soft 404 pages are indexed again.
- **Core update:** see the table above. Hold until 12-01.
- **Crosslinks 11-12:** 12 links added, gate debt 0. Per that run's log:
  - The `enneagram-leadership` typing conflicts (Jobs, Bezos, Nadella) are in their sixth week.
  - The narcissism "no peer-reviewed study" contradiction is in its third week.
  - The people -> people queue has been empty for 2 weeks, with 201 pages still needing links.

### Growth

From today's audit, not re-derived:

- Engaged humans 782 -> **695** (-11%), #6 of 25. Almost all of the loss came on 11-13..11-15.
- Google entries 441 -> 329 (-25% for the week). The daily count went 58-70, then 42, 18, 15.
- 4 takes from 3 contributors (median). Celebrity takes went 3 -> 0, and the homepage went 0 -> 2.
- 0 real signups (2nd week). 1 registration, 0 bookings.
- Beta card: 401 viewed -> 6 opened -> 0 submitted. It missed the 10-by-11-15 target.
- Host-digest ALARM is still daily. `olderPending` went 37 -> 42; the weekly downgrade hasn't happened.

### Outreach

- No substantive changes. Enneagram Monthly files got path-label edits only; the send is still unrecorded (5th brief).
- Per memory (11-14): don't pitch "answers sorted by type" to creators, because about 80% of takes have no type.

### Email and coaching

- Per growth: 4 welcome sends, 0 failures, 2 opens (both from 787's author). Welcome q574 has 0 takes. 0 signup rows since 10-29.
- `coaching_waitlist`: 20, newest 11-06. `/book-session`: no changes.
- The 11-05 beta lead came back 11-11 and 11-12. 4 emails, 0 opens, no talk note, no session.

## What changed since last brief

- **11-09 recommendations:**
  - #1 beta-lead note: **not met in the DB**. DJ's outbox is unverified.
  - #2 portraits: **0 of 9** done; the pile is now 10.
  - #3 opt-in: **not built**. Instead DJ shipped the keep-this-page invite and the test answer card (11-13). Per memory, DJ was asked on 11-14 to describe his vision for the post-answer moment (type capture plus reply notice), with an interview before any build.
- **11-09 open questions:**
  - Q7 (transcript): **resolved** (untracked and cached). History purge open.
  - Q9 (pipeline auth): no auth failure this week, but a new preflight failure.
  - Q1-Q6 and Q8: no answer on disk.
- **DJ shipped (10 commits, all pushed; `main` = `origin/main`):**
  - Conversion: keep-this-page invite, test answer card, homepage live-take changes.
  - Repo hygiene: transcripts and pipeline output untracked; project cleanup.
  - People pipeline rebuild (8.0 floor, new modes).
  - Performance: inline CSS, phone AVIF variants.
  - Content edits: Bobbi Althoff refresh, the 63 draft meta-title rewrites, Ashby / Sky-Bri / carina-zavline body edits.
  - Sitemap and IndexNow updates.
  - Research: the personality-secrets research doc (`docs/research/2026-11-15-personality-secrets-ai-lens.md`), with 3 zero-user studies awaiting DJ.
- **Growth:** search -70% from 11-13. q573 lost. 787/788 was the first reachable contributor in 4 weeks. Returning contributors 0 for an 8th week.
- **Content:** DB flat at 464 for a second week. Portrait-only passes 9 -> 10. 1 nightly pass. Runner preflight and multi-fire failures.

## Recommendation

**1. Reply to 787/788 today, and make sure it lands in their inbox (growth bet #1).**

- **Cost and impact:** about 10 minutes, DJ only. It's the only person in 4 weeks who is both reachable and engaged (57 minutes, 2 of 2 emails opened). Risk: none.
- **Why first:** with Google inflow down about 70%, every retained contributor counts for more. This is the cheapest test of whether a reply brings someone back.
- **Ambitious version (growth's, and my pick for next):** an owned return channel. A capped weekly "the other types answered" email to every contributor and test-taker, with opt-in on by default on the test result page. It needs DJ's answer to the 11-14 post-answer interview first.
- **First step:** open `/admin/host-desk`, post the 787/788 draft, then send a two-line personal email from your own inbox.

**2. Rotate the celebrity starter back to q118 (growth bet #2).**

- **Cost and impact:** about 1 minute to decide and about 15 minutes of agent work. It brings back a starter that converted at about twice q573's rate. Risk: low; the depth guardrail is at 3.5 minutes or more.
- **First step:** answer Q2. Read it as a rate, because the core update shrinks the denominator.

**3. Get people publishes moving without new image work.**

- **Cost and impact:** about 20 minutes per page for DJ to read one of the four portrait-ready holds (Lily-Rose-Depp, Ben Shelton, Codie Sanchez, Greg Brockman) and run the `people:ready` command for it. That's up to 4 publishes over 4 mornings, against 0 in two weeks.
- **Risk:** once a page is eligible, the 5 AM publisher ships it unread, so read before releasing. Also, the publisher stopped silently on 2 of 7 mornings.
- **Lean:** one page this week.
- **Ambitious:** all four, plus portraits for the top three of the ten (Hinton, Olah, Talarico), plus an agent fix for the runner (Q5).

**Next in line:**

- Default holds from growth: the digest alarm moves to weekly, and the beta card is held as-is.
- The 12-01 GSC re-pull (growth owns it).
- Shaan Puri's privacy sync.

## Open questions for DJ

1. **787/788:** did the reply go out, and did it reach their inbox (not just in-app)?
2. **q573 -> q118:** may an agent rotate the celebrity starter back to q118, or to a q118-shaped one-liner?
3. **The 63 meta titles:** were they meant to go live? PM and growth pick: hold them until after the 12-01 re-pull, then ship them as one dated, measurable change. Until then, no all-drafts `push:people`.
4. **Post-answer moment (asked 11-14):** describe what you want to happen right after someone answers (type capture plus how they hear about replies). It blocks the owned return channel.
5. **Nightly runner:** may an agent diagnose and fix the three problems? They are the preflight hang/kill (2 of 7 nights), the cron firing 4 times on 11-13 (which used up a subject's 3 retries in one night), and the failing Telegram alerts. Without a fix, Salomé Andrea's premiere-week timing keeps slipping.
6. **Portrait-ready holds:** will you read and release Lily-Rose-Depp, Ben Shelton, Codie Sanchez and Greg Brockman, starting with one this week?
7. **Thanksgiving series:** move it to the 2027 window? That's my pick: it can't rank in 10 days during a core update. The alternative is shipping 1-2 posts as social/email-only pieces.
8. **Known-bad live pages (3rd ask):** may the Shaan Puri rebuild sync (`--sync --skip-perspective-gate`, single person, so it doesn't push the 63 titles)? It removes the wife and company mention. Galloway still needs your type call.

Carried, parked unless you say otherwise:

- The 10 portraits.
- Daniela Amodei: rerun, override or drop.
- Git-history purge of transcripts.
- Beta card (5th ask; growth defaults to hold).
- Digest alarm downgrade (growth default).
- Enneagram Monthly send.
- `push:cluster-tags --write`.
- The 16 controversy gaps.
- Leadership-post typing conflicts and the narcissism contradiction.
- The people -> people link method.
- The 3 zero-user research studies.
- Instagram, Quora, Twitter, The Nine, One Take.

## Evidence and assumptions

- **Observed this run:**
  - Growth log `### 2026-11-16` and `logs/growth-automation/audit-2026-11-16.log` (exit 0 at 08:34:09).
  - `logs/blog-automation/cron-2026-11-10..16` and `publish-people-2026-11-10..16`.
  - Read-only `pnpm people:ready` (`scripts/people-ready-list.mjs`).
  - Read-only `scripts/db-query.sh`: people counts, new rows since 11-08, the Sam/Shaan/Galloway/Daniela titles, `host_reply_drafts`, `coaching_waitlist`, and the sza/kanye `meta_title` checks.
  - `backlog-queue.json`, read only, plus its uncommitted diff.
  - `check-marketing-content-queue.mjs`.
  - `docs/crosslinks/crosslink-log.md` (11-12).
  - `docs/data/gsc/latest.json`.
  - Git log and stats since 11-09.
  - MDsvex `published:` counts.
  - The situational skeletons.
- **Inferred:**
  - That the drop is Google's core update, not the 11-13/11-14 deploys (from timing, Bing/DDG holding, and growth's indexing checks).
  - That the preflight "exit killed" is a hung CLI, not auth.
  - That the publisher stops are the host sleeping.
  - That 61 of the 63 meta titles are also unsynced. I checked 2.
- **From memory, not re-verified:**
  - That the four portrait-ready holds would pass under the 8.0 floor.
  - The live Shaan page's privacy issue.
  - That the 11-14 post-answer interview is still unanswered.
- **Not checked:** Gmail (787/788 reply, beta lead, Enneagram Monthly), PostHog, and live social accounts.
- **Untouched:** no drafts, flags, queue files, scripts, or git state.
