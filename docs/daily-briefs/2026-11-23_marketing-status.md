<!-- docs/daily-briefs/2026-11-23_marketing-status.md -->

# 9takes Marketing Status — 2026-11-23 (Monday, unattended weekly brief)

**BLUF:** For the first time in weeks something on the far side of the gate works: the test-result answer card turned 4 of 14 test-takers into takes, and takes doubled (4 -> 8) while Google entries fell another 63%. Those 8 takes went nowhere, though. 0 of 6 contributors can be reached, 0 of 16 test-takers left an email, and returning contributors were 0 for a ninth week. The one high-leverage move is growth's bet #1: a default-on "email me when the other types answer" field under the test-result answer card, shipped this week. It is blocked only on DJ's answer to the post-answer interview asked on 11-14. The people lane is unstuck: DJ's 11-17 portrait batch and the restored two-a-day releases put 6 pages live (DB 464 -> 470). But the queue is down to 1 subject, and the 11-21 search-terms analysis argues for concept pages over more bio pages. That points the content engine at the 8 unpublished Corner concept drafts, not at more people runs.

## TL;DR

- **Growth data is fresh (gate passed).** Growth-log `### 2026-11-23`; `logs/growth-automation/audit-2026-11-23.log` shows "claude exited 0" at 08:38:14.
  - Headline, verbatim: _"Google entries fell another 63%, but takes doubled (4 -> 8) because the test-result answer card converts 4 of 14; 0 of 6 contributors are reachable, and returning contributors were 0 for a ninth week."_
  - Biggest leak, verbatim: _"still the return leg, now for nine straight weeks. 9takes doubled its takes, but 0 of the 6 contributors left a way to reach them, 0 of 16 test-takers left an email, and the two takes DJ replied to came from anonymous people who will never see the reply."_
- **Growth bet #1 needs DJ's input before anyone can build it:** a default-on email field under the test-result answer card. Success = 30% or more of test-result contributors leave an email over 2 weeks, with test-result gate -> take holding at 15% or more. It waits on the post-answer interview asked 11-14 (9 days unanswered). Last week's two DJ-only acts are both still undone. 787/788 has had 0 replies in 10 days. q573 is still live at 3/297 (1.0%) against q118's 2.4%.
- **People lane moved: 6 publishes, DB 464 -> 470 / 156** (Hunter Schafer, Ludwig Ahgren, James Talarico, Geoffrey Hinton, Paul Bettany, Laura Loomer). The nightly runner passed 4 of 4 completed runs (Salomé Andrea 8.1, Drew Afualo 8.3, Quenlin Blackwell 8.1, Amanda Seyfried 8.3). All 4 wait on a portrait, so **7 portrait-only passes** remain.
  - The **queue holds 1 subject** (Steve Wozniak, research timed out twice on 11-22), so the runner runs dry this week.
- **New publisher failure:** the 06:00 run failed with `TypeError: fetch failed` on its first try 6 mornings in a row (11-18..11-23). A retry rescued 11-18 and 11-19. Separately, `http://` citation URLs are now rejected, which blocks Ben Shelton (portrait on disk), Chris Olah and Tiger Woods. It cost nothing this week because `people:ready` shows 0 ready, but it will cost a day once a portrait lands.
- **Search: two sets of site changes landed inside the hold window.**
  - On 11-21 DJ shipped a direct-answer box on person pages, a 9-page MBTI-line test, a compatibility retitle and a TL;DR test link.
  - On 11-18/19 the people taxonomy v3 changed the type hubs. Per memory, "famous enneagram N" queries may be rotating off the type hubs, which would be self-inflicted.
  - The 63 rewritten meta titles are correctly still held, unsynced (re-verified sza and kanye).
  - The 12-01 GSC re-pull has to read both shipped sets as confounds.
- **8 new Enneagram Corner concept drafts (11-21) are the best-aimed content on disk.** They are 6 "which type is most X" superlatives, an SP/SO/SX blind-spot post and a personality-disorders post. Each needs a DB question row, a hero image (DJ's step) and 3+ inbound links. The personality-disorders post contradicts the frozen mental-illness FAQ. **The Thanksgiving series is dead:** Thanksgiving is in 3 days and the skeletons haven't changed since 11-04/05.

## The actual work: give the answer card a far side

This week answered the question asked for nine weeks: "can we get a take at all?" Yes. The test result converts at 29% (CI 8-58%), against 0/61 on celebrity pages. The open question is now only the return leg, and the highest-intent people on the site (they finished a test, then answered) are the ones walking off with no way back.

| Artifact                                              | State (observed today unless noted)                                                                                                                                          | Owner         | Next                                                                                                                                                       |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Test-result answer card (shipped 11-13)               | Growth: 4/14 gate -> take; test completions 6 -> 16 (26-week high). 0 of 16 left a notify email; 1 of 57 lifetime                                                            | growth        | Keep it. Build bet #1 on it                                                                                                                                |
| Bet #1: default-on "other types answered" email field | Not built. Blocked on the post-answer interview (asked 11-14)                                                                                                                | **DJ** -> eng | DJ describes the moment (about 10 min), then an agent builds it. Ambitious version: a three-question chain on the test result, with capture after the 2nd |
| 787/788 (registered, reachable)                       | 0 replies after 10 days (growth). DJ replied in-thread to 789 and 805, both anonymous, so neither can learn of the reply                                                     | **DJ**        | 3rd ask. Reply plus a personal email                                                                                                                       |
| Celebrity starter q573                                | Lost: 0/61 this week, 3/297 (1.0%) over 3 weeks, vs q118 at 2.4%                                                                                                            | DJ go         | Rotate back to q118 (2nd ask)                                                                                                                              |
| Host desk                                             | **49 pending / 1 posted** (re-queried today). Digest ALARM 8/8 days; the downgrade to weekly is in its 3rd week undone                                                      | DJ / growth   | Growth default: move to weekly                                                                                                                             |
| KeepThisPage (Corner) and beta card                   | Growth calls both **lost**: KeepThisPage 0 submits in about 10 days; beta card 298 viewed -> 4 opened -> 0 submitted                                                         | DJ            | Leave them in place until bet #1 ships                                                                                                                     |

## Tooling state (changes only)

- **Daily people publisher:**
  - **Two releases a day restored** on 11-17 (`11534925d`).
  - **New failure: the first try of the morning fails with `TypeError: fetch failed`, every day from 11-18 to 11-23.** The wrapper retried and succeeded on 11-18 and 11-19. On 11-20 the retry ran but found 0 releasable. On 11-21 and 11-23 nothing ran after the failure. Inferred: the network isn't up when the machine wakes.
  - **The citation validator rejects `http://` URLs.** That blocks tiger-woods, ben-shelton and chris-olah on every run. It also flags khabib-nurmagomedov (http URL) and alexandr-wang (non-ISO date).
  - `BYPASS_TOKEN` is not set locally, so the post-publish ISR revalidate is skipped and new pages can lag up to 24h.
- **Nightly runner:**
  - Preflight was killed again on 11-16 and 11-23. That is 3 of the last 10 nights (11-14, 11-16, 11-23).
  - The cron fired twice on 11-22 (02:07 and 04:33). Wozniak's research timed out both times, at 85 and 61 minutes, which used 2 of his 3 retries in one night. It's the same multi-fire pattern as 11-13, milder.
  - The weekly cap (5/5) stopped the 11-21 run.
- **Supabase MCP down (12th week).** Data came from read-only `scripts/db-query.sh` and `pnpm people:ready`.
- **Not marketing, noted once:** the question-topic directory migration is applied in prod, but the backfill hasn't run (0 `topic_key` rows today). Per memory, the next step is `questions:classify -- --write` after deploy.

## Cross-surface status

### Blogs

- **People DB: 470 published / 156 unpublished** (was 464 / 159).
  - Publishes: Schafer and Ludwig (11-17), Talarico and Hinton (11-18), Bettany (11-19) and Laura Loomer (published by hand 11-22, 8.6).
  - People taxonomy v3 shipped 11-19: 15 fields, 15 category pages and a birth-year timeline. New publishes are auto-labeled (`b7c17c48a`).
- **Nightly results, 11-16..11-23: 4 passes in 8 nights.**
  - 11-16: preflight killed.
  - Passes: Salomé Andrea 8.1 (11-17), Drew Afualo 8.3 (11-18), Quenlin Blackwell 8.1 (11-19), Amanda Seyfried 8.3 (11-20).
  - 11-21: weekly cap. 11-22: Wozniak research timed out twice. 11-23: preflight killed.
- **`people:ready`:**
  - **0 ready to publish.**
  - **7 waiting only on a portrait:** Olah 8.6, Fike 8.5, Harries 8.5, Seyfried 8.3, Afualo 8.3, Aspyn Ovard 8.2, Quenlin Blackwell 8.1. Four of them carry "read it first" (under 8.5).
  - **27 held or edited.** Salomé Andrea, Ben Shelton and Anthony Ippolito are "eligible, edited since it passed" and need a `--reverify`. Lily-Rose-Depp, Codie Sanchez and Greg Brockman need a repair plus a `--reverify`.
- **Queue:** 1 left (Wozniak, retry 1 on disk), 18 held, 3 failed. That's under 1 week of runway. `backlog-queue.json` has uncommitted changes from another process; I read it and didn't edit it.
- **Still unsynced:**
  - Sam Parr, Shaan Puri and Scott Galloway (4th brief; the DB titles still differ from the drafts).
  - Elon Musk's refresh (the DB still shows the old title).
  - The 63 meta titles.
- **MDsvex (counted recursively, sidecar files excluded):**
  - Not live: pop-culture 18, community 17 (+2 with no flag), Enneagram 26 (+14 with no flag), guides 14 (+5 with no flag), topical 1, life-situations 1.
  - Pop-culture ages: 1 in the 0-4 week bucket (Dario/Daniela, 10-28), 0 at 1-3 months, 17 older than 3 months. The oldest is from 2025-12-15 (343 days).
  - **Enneagram +8 drafts on 11-21:** hardest to love, most emotional, most intelligent, most jealous, most selfish, most successful, SP/SO/SX blind and personality disorders. Per memory, all are under 15% generic, and each file lists its own finishing steps.
  - 11 live Corner/guides posts were edited this week, all synced by the 11-22 `gen:all`.
  - No `published:` flips this week.
- **Thanksgiving series:** 6 skeletons, unchanged since 11-04/05, each still with 3-4 `[DJ: ...]` slots. Thanksgiving is 11-26. Closing it for 2026 unless DJ objects (Q8).

### Distribution and social

- Parked, unchanged:
  - Instagram queue RED: 0/10 approved, 11/15 copy-ready, 2 design-ready. `queue.json` hasn't changed since 08-03, and the last IG session was 08-07 (108 days).
  - Quora: last cron log 05-19 (188 days).
  - Twitter: no activity.
  - 16 distribution assets, the newest from 10-04.

### SEO

- **Core update.** Per memory (11-21):
  - Impressions fell about 80% overnight on 11-13/14. Technical causes were ruled out.
  - The drop hit every page, and page traits explain only about 13% of who survived. Generic %, grade and engagement had no effect.
  - The search-terms synthesis says the pre-update traffic was mostly bio lookups. Concept pages engage 3-7x better and start the test at 0.88%, against 0.07% for bio pages. The gaps are superlatives, famous-by-type hubs and an MBTI line.
  - 21% of people pages are not indexed, and the synthesis recommends holding new people pages until that recovers.
- **Confounds for the 12-01 re-pull:** the 11-21 lean fixes (direct-answer box, MBTI test on 9 pages with a check on 12-21, compatibility retitle) and the 11-18/19 taxonomy change to the type hubs. The 63 meta titles are still held, which is correct.
- **GSC:** the full pull is from 11-10. Survival audit data is in `docs/data/gsc/core-update/` (11-21).
- **Crosslinks 11-19:** 11 links added, gate debt 0. People-to-people opportunities 6 -> 4, with 206 people pages still needing links. Open items:
  - `artificial-movie-real-people` still says Hinton is not yet analyzed (stale since his 11-18 publish).
  - The toxic-traits narcissism contradiction is in its 4th week.
  - The `enneagram-leadership` typing conflicts (Jobs, Bezos, Nadella) are in their 7th week.

### Growth

From today's audit, not re-derived:

- Human visitors 695 -> **543** (-22%), #19 of 25, the lowest since 07-27.
- Google entries 329 -> **123**; celebrity-from-Google 192 -> 56. Bing 55 -> 65. Direct 147 -> 221.
- **8 takes from 6 contributors** (#6 of 25). 5 came from the test result, 2 from home (q203) and 1 from a question page. Celebrity: 0 for a second week.
- 0 real signups for a 3rd week. 1 registration. 0 bookings since 11-02.
- The Q&A motion pass (11-20) has had 2.5 days live with 0 question-page takes; read it 11-30.

### Outreach

- No substantive change. The Enneagram Monthly send is still unrecorded (6th brief). An 11-20 security pass touched one outreach file (`2026-05-11_long-form-network-emails.md`) along with other docs.

### Email and coaching

- Per growth: 4 welcome sends, 0 failures, 2 opens. 0 `signups` rows since 10-29. Opt-ins 0 since 10-01. `reply_notification_outbox` has 0 rows ever.
- `coaching_waitlist`: 20 rows, newest 11-06 (re-queried). `/book-session`: rate limiting added on talk-note details (11-20 security pass); the offer is unchanged.

## What changed since last brief

- **11-16 recommendations:**
  - #1, reply to 787/788: **not done** (growth: 0 replies after 10 days). DJ replied to two anonymous takes instead.
  - #2, rotate q573: **not done.**
  - #3, people publishes: **met another way.** DJ batched portraits (`7d640b7e1`, 11-17) and restored two daily releases, for 6 publishes. The four portrait-ready holds were not released; Ben Shelton is now also blocked by the http-citation rule.
- **11-16 open questions:**
  - Q3 (meta titles): held; re-verified unsynced.
  - Q5 (runner fix): not done, and the publisher now has a new morning failure.
  - Q6: partly superseded.
  - Q1, Q2, Q4, Q7 and Q8: no answer on disk.
- **DJ shipped (about 24 commits, all pushed; `main` = `origin/main`):**
  - Portrait batch plus 6 people publishes.
  - People taxonomy v3 with category pages and auto-labels.
  - Q&A runes and motion pass (11-20).
  - Security scan fixes (11-20). That pass also redacted an email to a user id inside an old marketing-log entry: a privacy edit, not a content rewrite.
  - Search-terms analysis and the core-update survival audit, with the lean SEO fixes (11-21).
  - 8 Corner concept drafts, and an `enneagram-communication-tips` rewrite (unpublished).
  - The question-topic directory (11-22).
- **Growth:** takes 4 -> 8 and contributors 3 -> 6, driven by the test-result card. Google entries -63%. Returning contributors 0 for a 9th week. KeepThisPage and the beta card were called lost.

## Recommendation

**1. Unblock growth bet #1: a default-on email capture under the test-result answer card.**

- **Cost:** about 10 minutes of DJ describing the post-answer moment, then about half a day of agent build.
- **Impact:** it attaches the only return channel to the only surface that converts. Today 16 test-takers a week leave and 0 can be reached.
- **Risk:** a default-on field could cost gate -> take conversion. The guardrail is 15% or more.
- **Lean:** one email field plus the "other types answered" email.
- **Ambitious:** a three-question chain on the test result (answer, see the other types, get the next), with capture after the 2nd take. That's up to 3 takes per visit.
- **First step:** answer Q1, then an agent builds it with `growth-analyst` setting up the measurement.

**2. Clear the two five-minute DJ acts that have carried over.**

- **Cost and impact:** about 10 minutes in total, DJ only. The 787/788 reply is the only reply in 5 weeks that can actually be delivered. The q118 rotation brings back a starter that converted at about twice q573's rate.
- **Risk:** none.
- **First step:** post the 787/788 draft from `/admin/host-desk`, send a two-line personal email, and say "rotate q118".

**3. Point the content engine at concept pages, not bio pages.**

- **Cost:** about 20 minutes of DJ generating hero images from the prompts already in each file, plus about 1-2 hours of agent work on question rows, StrategicQuestion wiring and inbound links.
- **Impact:** concept pages start the test at about 12x the rate of bio pages, and the test is the best gate surface on the site. That makes these 8 drafts the shortest path from search to an answer card.
- **Risk:** they launch during a core update, but they are new URLs, not retitles. The personality-disorders post needs a call on the FAQ contradiction first.
- **Lean:** ship the 6 superlatives.
- **Ambitious:** all 8, plus a famous-by-type hub fix after checking the taxonomy-rotation suspicion.
- **First step:** answer Q4 and Q5.

**Next in line:**

- An agent fix for the publisher's morning failure, the http-citation rejects and the runner's preflight/multi-fire (Q6).
- 7 portraits, only if Q4 says to keep shipping people pages.
- The 12-01 GSC re-pull (growth owns it).

## Open questions for DJ

1. **Post-answer moment (asked 11-14, now blocking growth bet #1):** describe what should happen right after someone answers on the test result: the email capture and how they hear about replies. Also choose lean (one field) or ambitious (a three-question chain).
2. **787/788 (3rd ask):** did the reply go out, and did it reach their inbox?
3. **q573 -> q118 (2nd ask):** may an agent rotate the celebrity starter back to q118?
4. **New people pages during the update:** the 11-21 search-terms synthesis says hold new people pages until the 21% not-indexed recovers. The publisher still auto-releases two a day, and you published Laura Loomer by hand on 11-22. Do we keep releasing people pages, or pause releases and portraits until after the 12-01 re-pull and let the queue run dry? PM pick: pause, and spend the week's content time on Q5.
5. **The 8 Corner drafts:**
   - Publish now (new URLs, so not a retitle confound) or after 12-01? PM pick: now, superlatives first.
   - The personality-disorders draft cites Yilmaz 2016, which contradicts the frozen mental-illness FAQ's "no research links BPD to a type". Which claim wins?
6. **Pipeline reliability (2nd ask, wider scope):** may an agent fix these four problems?
   - (a) The 06:00 publisher's first-try "fetch failed" (6 of 6 mornings).
   - (b) The http-citation rule blocking Ben Shelton, Chris Olah and Tiger Woods.
   - (c) The preflight kill (3 of the last 10 nights).
   - (d) The cron firing twice in one night, which burned 2 Wozniak retries on 11-22.
7. **Known-bad live pages (4th ask):** may Shaan Puri sync as a single person (`--sync --skip-perspective-gate`, which doesn't push the 63 titles)? The live page names his wife. Galloway still needs your type call.
8. **Thanksgiving series:** I'm treating it as moved to 2027 unless you say otherwise.

Carried, parked unless you say otherwise:

- The 63 meta titles (hold until after 12-01).
- Elon Musk and Andrew Callaghan refreshes (unpushed).
- Daniela Amodei.
- Git-history transcript purge.
- Digest alarm downgrade (growth default: weekly).
- Beta card and KeepThisPage (growth: lost).
- Enneagram Monthly send.
- `push:cluster-tags --write`.
- The `artificial-movie-real-people` Hinton update, the narcissism contradiction and the leadership typing conflicts (an editor pass on request).
- The open SEO calls from 11-21 (Sky Bri noindex, Shawn Ryan surname, MBTI line, compatibility lean vs ambitious).
- Instagram, Quora, Twitter, The Nine, One Take.

## Evidence and assumptions

- **Observed this run:**
  - Growth log `### 2026-11-23` and `logs/growth-automation/audit-2026-11-23.log` (exit 0 at 08:38:14).
  - `logs/blog-automation/cron-2026-11-16..23` and `publish-people-2026-11-17..23`.
  - Read-only `pnpm people:ready`.
  - Read-only `scripts/db-query.sh`: people counts, `meta_title` for sza, kanye, Sam, Shaan, Galloway and Elon; `host_reply_drafts`; `coaching_waitlist`; `question_categories.topic_key`.
  - `backlog-queue.json`, read only.
  - `check-marketing-content-queue.mjs`.
  - `docs/crosslinks/crosslink-log.md` (11-19).
  - `docs/data/gsc/` listing.
  - Git log since 11-16 (the 11-21 draft commit `a234670ea`, the 11-20 marketing-log and book-session diffs).
  - MDsvex `published:` counts.
  - The situational skeletons.
- **From memory, not re-verified:**
  - The core-update and search-terms findings, including the 21% not-indexed figure and the hold recommendation on people pages.
  - The taxonomy-rotation suspicion.
  - That the 11-21 lean SEO fixes are live. They are committed and `main` = `origin/main`; the deploy itself is inferred.
  - That the post-answer interview is still unanswered.
- **Inferred:** that the morning publisher failures are the network not being up at wake.
- **Not checked:** Gmail (787/788, Enneagram Monthly), PostHog, and live social accounts.
- **Untouched:** no drafts, flags, queue files, scripts, or git state.
