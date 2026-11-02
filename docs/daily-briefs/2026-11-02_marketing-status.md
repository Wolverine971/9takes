<!-- docs/daily-briefs/2026-11-02_marketing-status.md -->

# 9takes Marketing Status — 2026-11-02 (Monday, unattended weekly brief)

**BLUF:** The ask question is settled: q118 and the one-step homepage both won, and contributors hit a 26-week high (10). The bucket still has no bottom. 0 of 10 can be reached, 0 got a reply, and returning contributors were 0 for a sixth week. Growth has stopped re-issuing "DJ replies" as-is. Two decisions now carry the leak: approve an opt-in that fires on other people's takes (no DJ time needed), and make one reply call. The content engine had its best week of the quarter. DJ's 10-26 Node pin brought the publisher back, the DB went from 456 to 464, and four more passes wait only on portraits. One item has a deadline: the Daniela Amodei page "must be live before Nov 9," and it is held at 8.0.

## TL;DR

- **Growth data is fresh (audit 06:00 -> 06:27:45 today, exit 0; gate passed).** Headline, verbatim: _"both new asks won (q118 about 7x q567; 10 contributors, a 26-week high), but 0 of 10 can be reached, 0 got a reply, and returning contributors were 0 for a sixth week."_
- **Biggest leak, verbatim: _"the return leg, for the sixth straight week. A 26-week-high 10 contributors produced 0 returning contributors. 0 of 10 left any way to be reached, 0 of 10 got a reply, and the host desk grew 21 -> 32 pending with no desk post since 09-14."_** Growth's bet #1 is now an opt-in at the q118 reveal and on the homepage that fires when the next type answers, so it doesn't wait on DJ. Bet #2 asks DJ to pick one: test 3 replies, name a second replier, or retire replies.
- **The asks are decided.** q118 won: 9 of 295 gate fingerprints over two weeks (3.05%), against q567's 0.43%. Homepage v2 won: 49 engaged `/` humans -> 5 takes. Last week's q118-fallback question is moot. The opt-in is the only open product call, and this is its second ask.
- **The content engine is back.** DJ pinned the publisher to Node 24 on 10-26, last week's rec #3, done the same day. It then published Dhar Mann (10-27) and Stella Lefty (10-28) automatically, its first clean auto-publishes in about two months.
  - DB 456 -> 464. The other six were by hand, two of them below the 8.5 gate at DJ's request: Nathan Fielder and Naval Ravikant (8.1).
  - Chris Pratt was retyped 3 -> 7, and I verified it live today.
  - Four nightly passes are blocked only on portraits: Hunter Schafer 8.6, Dominic Fike 8.5, Paul Bettany 8.5 and Anthony Ippolito 8.3 (Open Case).
- **Deadline in 7 days: Daniela Amodei.** The queue note says the page "must be live before Nov 9." Its reasons: a reported Anthropic IPO roadshow that week, and Dario's page growing from 213 to 3,652 GSC impressions (June -> September). The 10-28 run was held at 8.0 because "nothing separates One from Two." The founder-duo pop-culture post drafted 10-28 depends on her page.
- **NEW risk: a full transcript is in the public repo.** `dario-and-daniela.md` (41 KB, Isaacson's _The Builders_ interview) was committed at the repo root in `2ca995571` on 10-28 and pushed. Removing it counts as a delete, so it waits on DJ (Q4).

## The actual work: close the return leg

The ask now fills the bucket at about 12 takes per 1,000 engaged humans, up from 7.9. Six audits of "DJ replies" have produced 0 desk posts. Growth's position: a bet that waits on an action that never happens has an expected value of zero. The fix that doesn't depend on DJ is a reason to come back that fires on other users' takes.

| Artifact                                            | State (from today's growth audit unless noted)                                                                                                        | Owner     | Next                                                                                   |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------- |
| Opt-in at the q118 reveal (`NineChorus`) + homepage | Doesn't exist. 0 of 10 contributors reachable this week; 0 of 18 since 10-19. The 11-01 commit to `NineChorus` was syntax only                        | **DJ** go | Approve lean or ambitious (Q1, 2nd ask)                                                |
| `ReplyOptInTray`                                    | Renders only in `HomeLandingV2` and question pages. 0 opt-ins from 13 takes there since 10-01. `reply_opt_in_shown` has never been queried in PostHog | growth    | Pull PostHog first, so we know whether 0 of 13 means unseen or unwanted                |
| Host desk (`host_reply_drafts`)                     | **32 pending / 1 posted lifetime** (PM re-queried). Last desk post 09-14                                                                              | **DJ**    | Reply call (Q2)                                                                        |
| Opt-ins 733 / 743 / 749                             | `notification_count` 0; now 54, 44 and 32 days old. These are the only takes where a reply sends an email                                             | **DJ**    | Option (a): approve 743 and 749, write 733 (no desk row)                               |
| DJ's one reply this week                            | 772 -> 756 on 10-29, posted outside the desk, 20 days after an anonymous "i dont understand this question." It went to none of the 7 named last week  | —         | —                                                                                      |
| Digest alarm                                        | `alarm` true 7 of 7 days, `olderPending` 21 -> 30. Growth calls it "background noise"                                                                 | DJ        | Under option (a), dismiss drafts older than 14 days so the alarm means something again |
| Junk takes leading the reveal                       | 778 "asd asd asd" (13 s) and 770 (15 s) are not flagged `low_effort`                                                                                  | eng       | Flag takes submitted in under 20 s (growth bet #3; delegable)                          |
| Runes deploy (`faf8aa897`, 11-01 evening)           | `gate_shown` still records (27 in 12 h). 0 takes yet, against ~0.7 expected                                                                           | growth    | Confirm a post-deploy take lands by the 11-09 audit                                    |
| Beta card (`beta_card_v1`)                          | 434 viewers -> 3 opened -> 0 submitted. 1 of 10 toward 11-15, with 13 days left. `coaching_waitlist` 19 total, 0 new since 10-08 (PM re-queried)      | **DJ**    | Keep, change or reset (Q6, 3rd ask). It will miss 10                                   |

## Tooling state (changes only)

- **Publisher fixed (`f1747657f`, 10-26 14:24).** `scripts/daily-blog-publisher.sh` now tries `node@24`, then Homebrew `node`, then PATH, and uses the first binary that runs. All 7 mornings since started on v24.22.1. 10-27 and 10-28 published and finished `gen:all`. 10-29 -> 10-31 and 11-02 found "No publishable draft" (97 -> 98 candidates).
  - **One-off:** the 11-01 log stops three lines after "starting" (06:01:41), with no exit line. 11-02 ran normally. Cause unverified.
- **Svelte 5 runes migration landed (`faf8aa897`, 317 files, 11-01 18:40) and deployed the same evening.** Growth is watching for the first post-deploy take.
- **Analytics (10-29, `f40036cf5`):** signup context now flows to PostHog (`emailSignupContext.ts`, server-side `posthogCapture.ts`, `api/signups`), plus a PostHog dashboard update. Growth's audit says it had no PostHog access in this run.
- **In flight, uncommitted, not mine:** `src/routes/+layout.ts` (Vercel Analytics `injectAnalytics`, 11-01 21:15) plus a one-line `package.json` dependency and lockfile change. I didn't touch either.
- **v3 pipeline strain:**
  - Paul Bettany's and Dominic Fike's draft stages hit the 60-turn cap and still completed.
  - Tom Rhys Harries's draft stage timed out twice (11-01, then 11-02 at 3,077 s). An untracked `draft.md` of 4,326 words is sitting in the run folder, so the timeout is probably length (memory: draft-stage length trap). Retry 3 of 3 runs tonight. This subject also failed on 09-14.
- **Weekly crosslinks (Thu 10-29): OK.** 12 links across 10 posts, gate debt 0 -> 0, 150 live posts, 0 broken.
- **Supabase MCP down (9th week).** Data came from read-only `scripts/db-query.sh` and read-only `--publish-check` runs.

## Cross-surface status

### Blogs

- **People DB: 464 published / 149 unpublished** (10-26: 456 / 147). Eight publishes, all in the sitemap:
  - Sombr (3, Open Case): 10-26 11:48, by hand, before the pin.
  - Nathan Fielder (6): 10-26, owner override. No grade; the editor's cold read was 7.7.
  - Dhar Mann (3): 10-27 06:00, **auto**.
  - Paapa Essiedu (6): 10-27, by hand.
  - Stella Lefty (9): 10-28 06:00, **auto**.
  - Ella Beatty (6): 10-28, by hand.
  - Chris Pratt: 10-29, by hand, as Type 3. DJ disagreed, a full rerun (11-01) passed at 8.5, and the DB was flipped to 7. **Verified live today:** the page reads Type 7 and `/types/7s/Chris-Pratt.webp` returns 200.
  - Naval Ravikant (5): 11-01, at DJ's request. It graded 8.1, below the 8.5 gate, and was recorded as a threshold exception.
- **Nightly v3 runs: 5 completed, 4 passes, 1 hold, 2 timeouts:**
  - 10-27 McKenna Grace: `insufficient_evidence`. Her career dates to about 2012, which rules out the Open Case format. Rerun around 12-01 (memory).
  - 10-28 Anthony Ippolito (6, Open Case): pass, 8.3.
  - 10-29 Hunter Schafer (4): pass, 8.6. 4 minor findings remain (memory).
  - 10-30 Paul Bettany (6): pass, 8.5. The critic flagged the typing as contested (6 vs 4) and filed 6 major findings; the release still passed.
  - 10-31 Dominic Fike (7): pass, exactly 8.5. 5 minor verify findings (memory), for example that "weed-high" belongs to a different tattoo, and a GQ republication date.
  - 11-01 and 11-02 Tom Rhys Harries: draft-stage timeouts (retry 2 of 3).
- **`--publish-check` today (read-only):** Ippolito, Schafer, Fike and Bettany all block only on `missing_full_image` / `missing_thumbnail_image`. Once portraits land, the publisher ships one a day, and any unfixed minor findings ship with it (Q5).
- **Manual runs:**
  - Daniela Amodei (10-28, DJ-typed 1): held at verify-repair, 8.0. The blocker says the record "states plainly that nothing separates One from Two." The hold lists 7 unreviewed long-form interviews: ABC News/Jarvis, CNBC, Anthropic's co-founders conversation, the Claude channel conversation, Oprah, Bloomberg Live and Sixth Street.
  - Chris Pratt: two runs (10-29 as Type 3, 11-01 as Type 7).
- **Queue:** 11 subjects (from 3), refilled by the 10-26 surging-people scout: Geoffrey Hinton, Chris Olah, Jay-Z, Ludwig Ahgren, QTCinderella, Josie Totah, Larry Ellison, plus the 3 carried over and Tom Rhys Harries. That is roughly 11 nights of runway. 14 held (McKenna Grace added).
- **Type 6 share is easing:** 10 of 29 rows created since 10-01 (34%; last week 42%), against 59 of 464 live (13%). This week's passes ran 2 of 4 typed 6.
- **MDsvex:**
  - Pop-culture: **21 not live** (18 `published: false` + 3 without a flag; last week 20). The oldest, `aoc-and-the-squad-enneagram-types`, is 322 days old.
  - New in pop-culture: `dario-daniela-amodei-enneagram-dynamic.md` (10-28, `published: false`). Per memory it can't go live until the Daniela page is live, it has 3+ inbound links, and DJ has made the hero composite.
  - Enneagram 10, guides 2, community 1, topical 1, life-situations 1 unpublished.
- **Crosslinks run flagged:** two live posts contradict each other on narcissism research (toxic-traits vs the narcissist post), and the leadership post's typing conflicts are in their 4th week.

### Distribution and social

- **Parked:** Instagram, Quora, Twitter, The Nine and One Take.
  - Queue check today: **RED**, 0/10 approved; 11/15 copy-ready; 2 design-ready.
  - Last Instagram session 08-07. Quora logs end 05-19. No Twitter activity in git.
- **Distribution packets:** about 10 unfired, unchanged. The newest is the be-gentle promo set (10-04).

### SEO

- **No GSC pull since 10-19 (14 days).** Growth saw Google-referred engaged entries fall 11% week on week (498 -> 442). It's one week, so check GSC if it repeats.
- **Overdue (both due ~11-01):** re-inspecting the 3 Soft 404s, led by the depression page, and the Jordi Hays identity-first title CTR read. Neither is on record.
- **Anthropic cluster:** Dario's page grew 213 -> 3,652 impressions (June -> September, queue note). The Daniela page plus the duo post are the planned extension, which is why the 11-09 date matters.

### Growth

- Folded from today's audit, not re-derived:
  - Engaged humans 820 (51 returning, a 26-week high), down 8% from the record 891.
  - Gate -> take: celebrity 139 -> 5, home 47 -> 3, question pages 14 -> 1, blog embeds 10 -> 1. All 10 takes were anonymous.
  - 8 of 10 takes were substantive. Gate -> take median ~1.7 min.
  - Signups 2. Registrations 0 (3rd week). Bookings 0.
- Contributor return: 0 of 8 matured contributors came back between 24 h and 7 d, against a ~6-7% base rate for new engaged humans. Growth's inference: contributing adds no detectable pull to come back.
- Growth's bets: (1) the "next take" opt-in, (2) the reply decision, (3) the low-effort flag, the 211 resend and the beta-card call.
- 10-26 bets: #1 not done (0 of 7). #2 not approved. #3 done (held, then decided today); the 211 resend is not done.

### Outreach

- **OliveMe listing: verified live today.** It is on the `enneagram-and-mental-illness` page (PM GET, 200). This closes last week's "unverified."
- **Enneagram Monthly:** the package has been ready since 10-20. Send status is still unrecorded (3rd brief). Gmail was not inspected.
- The 10 other 10-06 drafts: status unverified.

### Email and coaching

- Signups 214 (Google -> `/personality-analysis/ishowspeed`) and 215 (Bing -> the wings guide). Both confirmations were sent, with 0 failures.
- 0 welcome sends, because there were 0 registrations. Signup 211 still hasn't been resent (28 days, 4th ask).
- No commits touched `src/lib/email` or the cron routes. `/book-session` changed only in the runes migration.

## What changed since last brief

- **10-26 recommendations:**
  - #1 reply to the 7 reachable takes: **not done** (0 of 7).
  - #2 celebrity opt-in: **not approved**.
  - #3 publisher Node pin: **done by DJ the same afternoon**, and it works.
- **10-26 "next in line":** all done except Enneagram Monthly.
  - Dhar Mann portrait: done 10-26, auto-published 10-27.
  - Release refreshes: Paapa Essiedu, Stella Lefty and Ella Beatty are all live.
- **10-26 questions resolved:**
  - Q3: moot, q118 won.
  - Q4: DJ did the pin himself.
  - Q6: portrait and finalize, done.
  - Q7: queue refilled by the scout, 3 -> 11.
- **Unanswered:** Q1 (replies), Q2 (opt-in), Q5 (Enneagram Monthly), Q8 (beta card).
- **DJ decisions observed:**
  - Chris Pratt rerun as Type 7.
  - Two below-gate publishes by direct request (Fielder, Naval).
  - The founder-duo post rewritten to DJ's direction (10-28, memory).
- **Experiments:** q118 and homepage v2 closed as wins. The digest alarm fires daily and the outcome is unmoved. The beta card had another week at 0 submits.
- **Content:** DB 456 -> 464. Nightly passes 4 of 5 completed runs. Held 13 -> 14. Images-only passes 0 -> 4.
- **New risk:** the transcript committed to the public repo (10-28).
- **Commits:** 10 since 10-26, all titled "updates," all pushed (`main` = `origin/main` at `faf8aa897`).

## Recommendation

**1. Approve the "next take" opt-in at the q118 reveal and on the homepage (growth bet #1, second ask).** About 1 minute to decide. An agent builds it (~1–2 h), and DJ reviews the diff (~15 min). Expected impact: the first reachable anonymous contributors, through a trigger that fires about 5 times a week on other users' takes, with no DJ time. Visible risk: the opt-in could depress posting. Growth's guardrail is that celebrity gate -> take stays >=2.5%.

- **Lean:** drop the existing `ReplyOptInTray` into `NineChorus`. It has gotten 0 opt-ins from 13 takes since 10-01.
- **Ambitious (my pick, and growth's):** "email me when the next type answers this," with a per-person weekly cap. It replaces last week's "full chorus" pitch with a trigger that actually fires at today's volume.
- **Success (growth, 2 weeks):** >=20% of contributors on those surfaces opt in, and >=1 notified contributor visits within 7 days.
- **First step:** answer Q1. Before building, the agent pulls `reply_opt_in_shown` from PostHog, so the tray's 0 of 13 is understood.

**2. Make the reply call this week, once, with an end date.** About 10 minutes if DJ picks (a). Expected impact: the first production test of whether a reply brings anyone back. That is diagnostic, not growth. Visible risk: none.

- **My pick is (a):** approve the drafted replies to 743 and 749, write one to 733 (it has no desk row, so reply on its question page), and dismiss desk drafts older than 14 days.
- **Success (growth):** >=1 of 3 notified by 11-03, and >=1 visit from those fingerprints by 11-10.
- **Why (a), and why now:** six audits show the open-ended ask doesn't happen. A three-reply test with a date ends the loop either way. If (a) hasn't happened by the 11-09 audit, I'll treat replies as retired (c) in these briefs and stop carrying the ask.

**3. Clear the publish lane before the 11-09 window.** Expected impact: up to 5 new people pages in about a week, and the only time-boxed SEO item on the board. Visible risk: Daniela ships at medium confidence on a 1-vs-2 call.

- **Daniela Amodei (Q3).** My pick: a targeted rerun tonight or tomorrow against the 7 long-form interviews the hold names. DJ runs the pipeline (~2–3 h unattended). If it holds again, decide by **11-06** between an owner-override publish at 8.0 (the same path as Naval at 8.1) and letting the window pass.
- **Four portraits (Q5):** Hunter Schafer, Dominic Fike, Paul Bettany and Anthony Ippolito, about 10 minutes each. The portrait step's background extraction uses an image tool, so per your rule it's yours. I can prepare source shortlists and the extraction prompt text. After that, the publisher ships one a day with no further action.
- **First step:** answer Q3 and Q5.

**Next in line:**

- Pull GSC (14 days stale), then do the overdue Soft 404 re-inspection and the Jordi Hays CTR read. This is a `seo-content-strategist` pass.
- Resend 211 and flag sub-20 s takes `low_effort` (both delegable eng).

## Open questions for DJ

1. **Opt-in (2nd ask):** may an agent build it? Lean (drop the tray into `NineChorus`) or ambitious ("email me when the next type answers this," weekly cap)?
2. **Reply call:** (a) test the 3 opt-in replies by 11-03 and dismiss drafts older than 14 days, (b) name a second replier, or (c) retire DJ replies as the return mechanism?
3. **Daniela Amodei before 11-09:** rerun against the unreviewed interviews, owner-override at 8.0, or let the window pass? Should the Dario/Daniela duo post go live the same week? It also needs your hero composite and 3+ inbound links.
4. **Transcript in the public repo:** may an agent `git rm` `dario-and-daniela.md` and move it to `~/.cache/9takes-research/daniela-amodei/`? That stops it shipping in the current tree. It stays in git history unless you choose a history rewrite, which is heavier and a separate call.
5. **Portraits and minor findings:** want source shortlists and extraction prompts for Schafer, Fike, Bettany and Ippolito? Should Fike's 5 and Schafer's 4 minor verify findings be fixed before their portraits land, given the publisher will auto-ship them?
6. **Beta card, 3rd ask:** 1 of 10 with 13 days left, and 0 submits for three weeks. Keep it, change the card, or reset the goal?
7. **Enneagram Monthly, 3rd ask:** has the package gone to Jack Labanauskas?

Standing and parked unless you say otherwise:

- Instagram, Quora, Twitter, The Nine, One Take.
- Perspective-review backfill (70).
- Typing calls: Dario (portrait still in `5s/` while his type is 6), Druski, the Mark-Fischbach duplicate, Greg Brockman's flag drift.
- Leadership-post typing mismatches (4th week).
- The narcissism-research contradiction between two live posts.
- T-44 migration.
- Tom Rhys Harries: retry 3 of 3 tonight. It is his third failure overall. Skip him if it times out again.
- Christopher Abbott rerun (no `release.json`).

## Evidence and assumptions

- **Observed this run:**
  - Growth log `### 2026-11-02` and `logs/growth-automation/audit-2026-11-02.log` (exit 0, 06:27:45).
  - Read-only `scripts/db-query.sh`: people counts and rows since 10-25, type distribution, `host_reply_drafts` by status, `coaching_waitlist`.
  - Read-only `personBlogParser.js <slug> --publish-check --json` for four slugs.
  - Logs: `cron-2026-10-27..11-02`, `publish-people-2026-10-27..11-02`, `crosslinks-2026-10-29`.
  - Pipeline `summary.json` / `release.json` for 9 runs, and `backlog-queue.json`, read only (it is modified in the working tree by another process).
  - `check-marketing-content-queue.mjs`; git log and stats since 10-26; the sitemap; MDsvex flags.
  - Production GETs: the Chris Pratt page and 7s portrait, the Dhar Mann page, and the mental-illness guide (OliveMe).
- **Not checked:** Gmail (Enneagram Monthly, outreach follow-ups), PostHog, GSC, and live social accounts.
- **Inferred:**
  - That the Tom Rhys Harries timeout is a length overshoot (from the 4,326-word untracked draft plus memory).
  - The roughly 11-night queue runway.
  - "First clean auto-publishes in about two months": prior briefs record `gen:all` failing after every auto-publish since 08-29.
  - The IPO timing is "reported," per the queue note, not verified here.
- **From memory, not re-verified:** the minor-finding counts for Fike and Schafer, McKenna Grace's ~12-01 rerun, and the duo post's prerequisites.
- **Untouched:** no drafts, flags, queue files, scripts, git state, or the in-flight `+layout.ts` / `package.json` / Tom Rhys Harries run files.
