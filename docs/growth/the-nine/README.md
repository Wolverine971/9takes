<!-- docs/growth/the-nine/README.md -->

# The Nine — Reddit + X traction playbook

**Created:** 2026-09-22
**Status:** active
**Owner:** DJ
**Decisions locked 2026-09-22:** weekly Nine format (not just a daily queue) · unbranded participant on Reddit · Reddit first
**Related:** `scripts/find-threads.mjs`, `venues.json`, `run-log.md`, `reddit/README.md`, `docs/taskers/T-22-reddit-situation-discovery-flow.md`

---

## 0. The premise this is built on

Measured 2026-09-22 against production:

| Metric                            | Value     |
| --------------------------------- | --------- |
| New unique visitors / week        | ~4,300    |
| Visits to `/questions` in 30 days | 198       |
| Comments in 30 days               | 24        |
| Questions with any human answer   | 57 of 422 |

Awareness is not the constraint. ~18,000 people a month already arrive and ~0.13% touch the product. **This playbook is not an acquisition plan. It is an arrival-intent plan.** Google sends readers who want an answer; Reddit sends people mid-argument. Fifty arguers beat five thousand readers.

Judge everything here on **takes produced**, not sessions.

---

## 1. Why the existing `reddit/` drafts are parked

The eight drafts in `reddit/` are well written and correctly cautious. They are also structurally unable to move the number:

- Five target founder subs (r/SideProject, r/indiehackers, r/startups, r/alphaandbetausers). Founders evaluate products; they do not leave takes.
- The other three are deliberately link-free karma posts with no mechanism that produces a visit.

`reddit/01-enneagram-organic-discussion.md` is the exception and gets reused below as the Monday post. The rest stay on ice until the loop is proven.

---

## 2. The weekly Nine

One cycle per week. The whole point is to give a stranger a **reason to come back**, which the site has never had.

| Day         | Action                                                                                                                                                                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Monday**  | Post one question organically in r/Enneagram (tier 2, flair: Type Discussion). No link, ever, including later edits. `reddit/01-enneagram-organic-discussion.md` is the template. Post the same question on X, no link — the tweet _is_ the demo.       |
| **Tue–Thu** | Reply to every answerer, naming the emotional logic under their answer. This is the Mirror Moment performed live. On X this is the whole game: a reply plus your reply back is worth roughly 150x a like, and small accounts get discovered in replies. |
| **Friday**  | Publish the nine-way spread as a live 9takes question page, in your own words. Post the X thread version crediting repliers by handle.                                                                                                                  |
| **Any day** | One tier-1 Reddit comment from `pnpm nine:find`. One per day. Not a batch.                                                                                                                                                                              |

### The Friday artifact, without stealing anyone's words

Per T-22: never copy a person's story, and never reproduce their comment verbatim on a commercial site. The Friday page is **your synthesis of the distinct reads that showed up** — the shape of each position and what it protects — written by you. Credit handles for the read, not the prose. If someone's phrasing is too good to lose, ask them in-thread for permission and quote with attribution.

This is better content anyway. Nine named emotional positions on one situation is the product; a comment dump is not.

---

## 3. The unbranded Reddit protocol

You are a person who reads situations well. Nothing in a comment points anywhere. 9takes lives in your profile bio and nowhere else.

**The governing test, every time:** _would this comment still be upvoted if you deleted every product mention?_ If no, do not post it.

Current norms (2026): roughly 95/5 rather than 90/10, ~2 weeks of participation before any mention, smaller specific subs beat giant ones, and launch-day blasts trip an ML spam filter that shadowbans permanently.

### The shape of a 9takes comment

```text
Three reads of this are live in the thread and all three are internally consistent:

- [read A] -> protecting: [the fear underneath]
- [read B] -> protecting: [the fear underneath]
- [read C] -> protecting: [the fear underneath]

The disagreement isn't about what happened. It's about which of those
feels most at risk to you.

[ONE concrete thing OP can do with that.]
```

Rules that keep it honest:

- Name reads that are **actually in the thread**. `nine:find` pulls the top comments so you are describing a real room, not inventing one.
- Never type anyone. No "you sound like a 6." That is the typing-evangelist trap and the sub will eat you.
- End with something usable. A read without an action is a party trick.
- In r/AmItheAsshole, top-level comments need a verdict acronym (NTA/YTA/ESH/NAH/INFO) or the bot removes them. Lead with the verdict, then the read.

### First two weeks: warm-up

DJ's account is real but new to these subs. For the first 14 days:

- One comment a day, in two subs only: r/AmIOverreacting and r/Advice. Add the others once comments there are landing.
- Answer OP first, the way a person would. Use the three-reads shape only when the thread really has three reads; the same template every day reads as a bot.
- Read each sub's rules once before the first comment there. Big subs auto-remove comments from low-karma accounts.
- The tagged bio link can go up on day one. 9takes appears nowhere else.

### Hard stops

Inherited from T-22 and enforced in code by `isExcluded()`: no active crisis, self-harm, abuse, stalking, or minors. `nine:find` drops these before scoring. If one slips through, skip it — it is not a content opportunity.

---

## 4. The daily loop

```bash
pnpm nine:find                      # tier-1 situation subs, today's one action
pnpm nine:find -- --tier 2          # r/Enneagram, r/mbti - Monday question venues
pnpm nine:find -- --sub AmIOverreacting
pnpm nine:find -- --refresh-corpus  # re-pull questions after adding new ones
```

It prints **one** thread, the matched 9takes question, and a drafted comment. The rest go to `queue/YYYY-MM-DD.md` as a bench.

**Do not work the bench.** Twitter tooling here was built Dec 2025 (~40k words of docs, 319 tweets, 35 followers, <1% engagement, dormant since May). Instagram ran seven sessions of queues and posted zero comments. The failure mode in this repo has never been strategy — it is that the queue becomes the deliverable and posting stays manual. One action per day, posted, beats fifty drafted.

If nothing clears the bar, the script says so. That is a valid outcome. Do not force one.

### How the ranking works

`disagreementScore` weighs contested (0.35), discussion density (0.30), substance (0.20), freshness (0.15). It deliberately punishes popularity: 8,000 upvotes with 20 agreeing comments scores about 0.37, while 130 upvotes with 412 argued comments scores above 0.8. Popularity is not the signal — a room reading one situation nine ways is.

---

## 5. Setup

_Rewritten 2026-09-22 after the readiness review. The original "create a script app, ~2 minutes" step no longer works._

1. **Account.** Use DJ's existing Reddit account (confirmed 2026-09-22). It has history, but little of it in these subs, so the first two weeks are warm-up (see "First two weeks" in §3).
2. **Tagged bio link.** Put 9takes in the profile bio as a link to the current Nine question, not the homepage:
   `https://9takes.com/questions/<slug>?utm_source=reddit&utm_medium=profile&utm_campaign=the_nine`
   The tag is the only way `scorecard.sql` can tell this playbook's visitors from the ~20 Reddit visitors a month 9takes already gets. Update the slug each Friday.
3. **Finding threads without the API.** Since November 2025, Reddit's Responsible Builder Policy puts every new API credential behind manual approval. Self-serve script apps at /prefs/apps no longer work, requests often get no reply, and the policy bars the account that comments from also owning the app. Until access exists, open the sub, sort **Controversial → Today**, skip anything that hits the hard stops in §3, and pick one thread. That sort does most of what `disagreementScore` does.
4. **If API access is ever granted** (request it from a separate account), add to `.env.local`:
   ```bash
   REDDIT_CLIENT_ID=
   REDDIT_CLIENT_SECRET=
   ```
   Username and password are optional. Without them the script uses app-only read access, which is all it needs. Then run `pnpm nine:find -- --refresh-corpus`.
5. `pnpm nine:find -- --fixture <listing.json> --no-write` runs the whole pipeline on a saved Reddit listing with no credentials.

---

## 6. What success looks like

Measured at 14 and 30 days. Log results in `run-log.md`, append-only.

| Horizon     | Target                                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 14 days     | 14 Reddit comments posted; ≥3 with net positive score; ≥1 visitor through the tagged bio link (`via_bio_link` in the scorecard)  |
| 30 days     | 2 weekly Nine cycles published; ≥9 distinct human answers collected across them; ≥1 replier returns for the next week's question |
| Kill signal | 30 days, <5 takes produced total → the venue is wrong, not the copy. Stop and re-pick venues.                                    |

The metric is **takes produced**, not sessions. A hundred visitors who read and leave is the thing 9takes already has 18,000 of.

Scorecard: weekly Reddit and X visitors, how many came through the tagged bio link, and the takes each group left afterwards. Admin fingerprints are excluded.

```bash
./scripts/db-query.sh "$(cat docs/growth/the-nine/scorecard.sql)"
```

The earlier referrer query failed because `page_analytics_visits` has no `referrer` column; it has `referrer_host`, `utm_*` and `acquisition_source`. Before this playbook started, the baseline was ~20 Reddit visitors a month, most from the 2026-08-31 r/alphaandbetausers test.
