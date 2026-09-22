<!-- docs/growth/the-nine/HANDOFF.md -->

# HANDOFF: The Nine — Reddit + X traction work

**Written:** 2026-09-22 · **Updated:** 2026-09-22 (readiness review: Reddit API access, safety filter, scorecard, Reddit history) · **For:** the next agent picking this up · **Owner:** DJ (solo founder, 9takes)

Read this whole file before doing anything. It is written to be self-sufficient — the load-bearing context is inlined here on purpose, so you do not have to go read five other docs to be safe. Follow the links only when you need detail.

---

## 1. The one-paragraph brief

DJ wants more eyeballs on 9takes via Reddit and X. The research is done and the tooling is built. **The constraint is not awareness — it is arrival intent.** 9takes already gets ~18,000 new visitors a month and converts ~0.13% of them into a take. Google sends readers who want an answer and correctly leave; Reddit and X send people who are mid-argument, which is the only human the give-first wall was built for. The goal is fifty arguers, not five thousand readers. **Judge all work here on takes produced on 9takes, never on sessions or followers.**

---

## 2. Verified state of the world

Everything in this table was queried against **production** on 2026-09-22 via `./scripts/db-query.sh` (read-only). Do not re-derive these; do re-check them if more than a couple of weeks have passed.

| Metric                                       | Value                                                            |
| -------------------------------------------- | ---------------------------------------------------------------- |
| Questions (all)                              | 422                                                              |
| Questions not removed (what the corpus uses) | 410                                                              |
| Questions with **any** human comment         | 57                                                               |
| Comments, all time                           | 358                                                              |
| Comments, last 30 days                       | 24                                                               |
| Profiles                                     | 161                                                              |
| New profiles, last 30 days                   | 6                                                                |
| Coaching waitlist rows                       | 18                                                               |
| New unique visitors/week                     | 4,593 (Sep 14) · 4,211 (Sep 7) · 4,482 (Aug 31) · 4,368 (Aug 24) |
| `/questions` visits, last 30 days            | 198                                                              |

**Channel state, from repo docs rather than live APIs — verify before citing:** X `@9takesdotcom` was at 35 followers / 319 tweets / <1% engagement as of the Dec 2025 baseline in `docs/twitter/execution/metrics-tracker.md`, and the tooling has been dormant since ~May 2026. Reddit: one linked test ran on 2026-08-31 in r/alphaandbetausers (`utm_campaign=alpha_beta_answer_first_20260831`). It brought ~8 real visitors to one question page and produced 2 takes, both low-effort ("Pooopin", "Manage their emotions!!!"). Details are in `docs/growth/growth-log.md`. None of the other `reddit/` drafts have been posted. The lesson: a direct link to a question page does get Reddit visitors to answer, but founder subs send low-quality answers.

---

## 3. Decisions DJ already made — do not re-litigate these

He chose these explicitly on 2026-09-22. If you think one is wrong, say so in one or two sentences and then execute it anyway unless he changes it.

1. **Weekly "Nine" format**, not just a daily comment queue. The point is giving a stranger a reason to come back, which the site has never had.
2. **Unbranded participant on Reddit.** DJ comments as a person who reads situations well. No links in comments, no product mention. 9takes lives in the profile bio only.
3. **Reddit before X.** X's 35-follower cold start means posts land in a void until replies build an audience.

---

## 4. What is already shipped

| Path                                 | What it is                                                                                                                             |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/find-threads.mjs`           | The harness. Ranks live Reddit threads by interpretive disagreement, matches each to the question corpus, prints ONE action for today. |
| `scripts/find-threads.spec.mjs`      | 26 unit tests over the scoring, safety filters, matcher, and CSV reader.                                                               |
| `docs/growth/the-nine/scorecard.sql` | The success query: weekly Reddit/X visitors, tagged-bio-link visitors, and the takes they left. Admins excluded.                       |
| `docs/growth/the-nine/README.md`     | The playbook: weekly cycle, comment protocol, venue tiers, success metrics.                                                            |
| `docs/growth/the-nine/venues.json`   | Subreddit config — tier, link policy, per-sub rules.                                                                                   |
| `docs/growth/the-nine/corpus.json`   | 410 questions pulled from prod, used for matching.                                                                                     |
| `docs/growth/the-nine/run-log.md`    | Append-only log. Baseline entry for 2026-09-22 is in it.                                                                               |
| `package.json`                       | Added `"nine:find": "node scripts/find-threads.mjs"`.                                                                                  |

Verification status as of the 2026-09-22 update: **26/26 spec tests pass.** The minors and abuse filter was fixed that day. It had missed the standard uppercase age format ("(16F)", "(17M)", "(F16)"), "I am 15", "my husband hit me", and "abusive". The spec now covers all of those, plus false-positive guards ("he hit me up", "I'm 15 minutes late", "I'm 5'4").

### How the harness works

```bash
pnpm nine:find                      # tier-1 situation subs, today's one action
pnpm nine:find -- --tier 2          # r/Enneagram, r/mbti — Monday question venues
pnpm nine:find -- --sub AmIOverreacting
pnpm nine:find -- --refresh-corpus  # re-pull questions from prod first
pnpm nine:find -- --json            # machine-readable (progress goes to stderr)
pnpm nine:find -- --fixture <path> --no-write   # offline pipeline test, no creds needed
```

`disagreementScore` weighs contested 0.35 / discussion density 0.30 / substance 0.20 / freshness 0.15. It **deliberately punishes popularity**: 8,000 upvotes with 20 agreeing comments scores ~0.37, while 130 upvotes with 412 argued comments scores above 0.8. Popularity is not the signal; a room reading one situation nine ways is.

Hard filters run before scoring: NSFW, stickied, locked, <15 comments, <40 body words, >36h old, and the T-22 crisis exclusions.

---

## 5. What is NOT done — start here

### The harness cannot go live on its own (found 2026-09-22)

The original unblock step (create a script app at reddit.com/prefs/apps, ~2 minutes) **no longer exists.** Since November 2025, Reddit's Responsible Builder Policy puts every new API credential behind manual approval. Requests often go unanswered, and the policy bars the account that comments from also owning the app. **Do not make the first comment wait on API access.** Reddit's own sort (Controversial → Today) does most of the scoring. If access is ever granted, request it from a separate account; the script only needs `REDDIT_CLIENT_ID` / `REDDIT_CLIENT_SECRET` (app-only read) in `.env.local`.

**DJ decided on 2026-09-22: manual, no more tooling.** Don't build a browser pull, a morning pull, or anything else on top of the ranker. `find-threads.mjs` stays in the repo, parked. The workflow: DJ browses Reddit, copies a thread's post text plus the top 3–5 comments (or a screenshot) into the session, and the agent drafts one reply. The agent can't read Reddit itself: the Claude in Chrome extension blocks reddit.com ("This site is not allowed due to safety restrictions", tested 2026-09-22), and WebFetch and curl are blocked too. Don't route around those blocks with third-party Reddit mirrors or archives. When drafting, apply the hard stops by judgment (minors, crisis, abuse): skip the thread and say why.

**Account:** DJ has an existing Reddit account with history, but little in these subs (confirmed 2026-09-22). The first 14 days are warm-up; see README §3 "First two weeks".

If DJ needs to run something interactive, tell DJ to type `! <command>` in the session so the output lands in the conversation.

### Open fork awaiting DJ

Every Reddit touch is link-free, so the only way from Reddit to 9takes is a click on the bio link. The 30-day kill signal (<5 takes means the venue is wrong) will probably fire because nothing links Reddit to 9takes, not because the venue is wrong. Options pitched to DJ on 2026-09-22, no answer yet:

- **Lean:** stay fully unbranded and judge the first 30 days on Reddit signals (comment scores, replies, people coming back to the Monday thread, `via_bio_link` visitors). Takes on 9takes are a bonus.
- **Ambitious:** after two weeks of real participation, allow one openly disclosed link a week: the Friday recap posted in r/Enneagram, linking the question page. Comments stay link-free.

### Then, in order

1. **Tagged bio link up** (README §5, step 2).
2. **First comment, found by hand**, in r/AmIOverreacting or r/Advice (see approval rule in §6). Reply under the top comment or pick a thread 1–6h old; late top-level comments on 400-comment threads get buried.
3. **First weekly Nine cycle**: Monday question in r/Enneagram (`reddit/01` needs DJ's real example in the last line), replies Tue–Thu, Friday artifact. Publish the Friday synthesis as page content, never as nine separate comments.
4. **Log it** in `run-log.md`, append-only. Run `scorecard.sql` at day 14 and day 30.
5. **Deprioritized:** the LLM matcher upgrade. Under the unbranded protocol, the matched 9takes question isn't used anywhere, so it's off the critical path.

---

## 6. Guardrails — read twice

**Never post, comment, vote, message, or follow on any platform without DJ's explicit approval for that specific piece of content.** Draft it, show it to him, wait. This matches `docs/taskers/T-22` ("Posting, messaging, and outreach are not authorized") and how the Instagram agent operates. The harness itself only reads; keep it that way.

**Safety boundaries, inherited from T-22 and enforced in `isExcluded()`:** no active crisis, self-harm, suicide, abuse, stalking, domestic violence, or anyone who appears to be a minor. If one slips past the filter, skip it. These are not content opportunities. Never copy a person's story onto 9takes; abstract the pattern and rewrite it so the original poster could not recognise it.

**Never type anyone.** No "you sound like a 6." That is the typing-evangelist trap, it is explicitly against 9takes' positioning, and the subreddit will eat you for it.

**The brand message hierarchy is frozen** (locked 2026-08-13, see `docs/brand/messaging-hierarchy.md`). Do not invent a new master concept. The five levels: movement belief "The internet collapses nine perspectives into one winning take" → promise "See the emotions behind every take" → ritual "Answer before the crowd" → explanation "One question, nine perspectives" → payoff "Stop mistaking someone else's alarm for a defect." The Chorus, The Mirror Moment, and Streetlamp Symposium are supporting vocabulary, not replacements.

**Do not edit `docs/growth/growth-log.md` or `docs/marketing/marketing-log.md`** — both have uncommitted changes from DJ or another agent. Living docs in this repo are **append-only with dated snapshots**; never overwrite previous data. Keep new work in `docs/growth/the-nine/`.

**Other agents and DJ edit this repo in parallel.** Never `git stash`, never do wide resets, never run bulk operations that could clobber uncommitted work.

**Do not commit or push unless DJ asks.**

---

## 7. Traps that already cost time

- **Reddit blocks this environment.** `about.json`, `search.json`, `old.reddit.com`, and WebFetch against reddit.com all return Blocked or HTML. There is no unauthenticated path. Do not spend time debugging curl. OAuth credentials now need Reddit's manual approval (see §5), so treat live `nine:find` as unavailable.
- **`docs/twitter/` is a 40k-word trap.** It is thorough and it produced 35 followers. Do not add to it. The failure mode in this repo has never been strategy.
- **Do not build a queue.** X tooling built Dec 2025 and went dormant; Instagram ran seven sessions of queued comments and posted **zero**. The harness prints one action per day for exactly this reason. If you find yourself generating a batch of 20 drafts, stop — that is the known failure pattern repeating.
- **`reddit/`'s eight existing drafts are parked on purpose.** Five target founder subs (r/SideProject, r/indiehackers, r/startups, r/alphaandbetausers) whose audience evaluates products rather than leaving takes; the other three are deliberately link-free with no mechanism to produce a visit. Only `reddit/01-enneagram-organic-discussion.md` survives, promoted to the Monday question. Do not resurrect the rest without a reason.
- **X penalises links 50–90%.** Do not plan X content around driving clicks. The tweet is the demo; the link lives in bio. A reply plus DJ's reply back is worth ~150x a like — replies are the whole game from a cold start.
- **Reddit norms in 2026** are ~95/5 not 90/10, ~2 weeks of participation before any mention, and smaller specific subs beat giant ones. The governing test for any comment: _would this still be upvoted if you deleted every product mention?_ If no, don't post it.

---

## 8. The comment shape that does the 9takes move

```text
Three reads of this are live in the thread and all three are internally consistent:

- [read A] -> protecting: [the fear underneath]
- [read B] -> protecting: [the fear underneath]
- [read C] -> protecting: [the fear underneath]

The disagreement isn't about what happened. It's about which of those
feels most at risk to you.

[ONE concrete thing OP can do with that.]
```

Name reads that are **actually in the thread** — `nine:find` fetches the top comments so you are describing a real room. End with something usable. In r/AmItheAsshole, top-level comments must open with a verdict acronym (NTA/YTA/ESH/NAH/INFO) or the bot removes them.

---

## 9. Success and kill criteria

| Horizon         | Target                                                                                                                                         |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 14 days         | 14 Reddit comments posted; ≥3 with net positive score; ≥1 visitor through the tagged bio link (`via_bio_link`)                                 |
| 30 days         | 2 weekly Nine cycles published; ≥9 distinct human answers collected; ≥1 replier returns for the next week's question                           |
| **Kill signal** | 30 days, <5 takes produced → the venue is wrong, not the copy. Stop and re-pick venues rather than writing better comments into the same void. |

```bash
./scripts/db-query.sh "$(cat docs/growth/the-nine/scorecard.sql)"
```

This replaces the original referrer query, which errored because `page_analytics_visits` has no `referrer` column. Baseline before this playbook: ~20 Reddit visitors a month, which is why the 14-day target counts only tagged-link visitors.

---

## 10. How DJ wants to be talked to

Vision-first. Product and outcome terms, not implementation detail — **make the technical decisions yourself.** Surface only the forks that change what users experience or cost real money, 1–2 sentences each, framed so he can veto. When something could be done lean or ambitious, pitch both in about two sentences and let him pick; never silently default to lean. For any non-trivial build, interview him first — lead with an open-ended "describe what you're envisioning," then narrow only where his answer leaves real forks. Skip the interview for mechanical fixes.

---

## 11. Useful commands

```bash
./scripts/db-query.sh "SELECT count(*) FROM comments WHERE removed IS NOT TRUE"   # read-only prod SQL
pnpm nine:find                                    # today's one action
npx vitest --run scripts/find-threads.spec.mjs    # 26 tests on the harness
./scripts/db-query.sh "$(cat docs/growth/the-nine/scorecard.sql)"   # the success number
pnpm test                                         # full suite (~55s)
pnpm lint                                         # prettier + eslint + custom lints
```
