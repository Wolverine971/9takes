<!-- docs/taskers/T-41-assets/N-seo-proposals.md -->

# T-41 item N: SEO proposals (propose only, nothing executed)

**Status:** Proposal for DJ, 2026-10-03. No code or content changed.
**Data:** Search Console API, `sc-domain:9takes.com`, `dataState: 'all'`, pulled 2026-10-03 with a scratch copy of the auth in `scripts/fetch-gsc-data.mjs`. Clicks are compared across the May 2025 to April 2026 impressions-logging bug; impressions are used only inside 2026-05 onward.

---

## N1. The 2026-08-02 communication merge

**What happened:** commit `20ecb0a57` unpublished three posts and 301'd them into `/enneagram-corner/relationship-communication-guide` (redirect map in `src/routes/enneagram-corner/[slug]/+page.ts`): `enneagram-communication-tips`, `enneagram-communication-styles` and `enneagram-communication-guide`. The target gained "Try these exact words" scripts per type.

### What the data says

1. **The "40.9" is not a failed transfer.** The target's average position is dragged down by head terms it was never going to win: "enneagram and relationships" (position 52 to 68), "enneagram relationships" (67 to 86). For the merged intent it ranks 12 to 18 ("relationship goals for each enneagram number"). Its average was already 32 to 36 in the three months before the merge (40 to 42 after).
2. **The styles and guide URLs were worth almost nothing.** In 2026 `communication-styles` earned 0 to 4 clicks a month and `communication-guide` earned 0. Query-level demand for "enneagram communication style" across the whole site is 1 to 8 impressions a month. Their 2025 peak (26 clicks in July 2025) was long gone before the merge.
3. **The tips URL is the surprise.** Google is still showing the redirected `enneagram-communication-tips` URL, and better than ever:

| Week of    | Clicks | Impressions | Avg. position |
| ---------- | -----: | ----------: | ------------: |
| 2026-08-17 |      0 |          42 |          22.7 |
| 2026-08-24 |      0 |          38 |          26.2 |
| 2026-08-31 |      1 |         194 |           9.0 |
| 2026-09-07 |      4 |         552 |           8.2 |
| 2026-09-14 |      3 |         195 |           7.6 |
| 2026-09-21 |      4 |         159 |           7.7 |
| 2026-09-28 |      1 |          87 |           7.3 |

September was its best month ever (12 clicks, position 8.1). The queries are a family that did not exist for 9takes before September: "things to say to an enneagram [type]" (position 5 to 10.5 for types 1, 2, 3, 4, 5, 6 and 9). That matches the old post's title exactly: "What to Say to Each Enneagram Type (Scripts That Actually Work)". Every one of those clicks currently lands on a page titled "Relationship Communication Guide", which does not promise what was searched.

### Recommendation: restore the tips post only; leave the other two merged

- **Restore `enneagram-communication-tips`** as a standalone post: set `published: true`, delete its line from the redirect map, and point the target's scripts sections to it ("full scripts for each type"). Google is ranking that URL for a growing query family right now; when it finally processes the 301 it will drop the URL and the ranking with it, because the target's title and H1 are about relationships, not "what to say".
- **Leave `communication-styles` and `communication-guide` redirected.** No measurable demand, no clicks to recover.
- **Before restoring:** run the post through `9takes-editorial-standards` (its "What's Happening Inside Their Head" sections need a check against the do-not-write etiology list), clear em-dashes, keep the existing `lastmod` untouched, and give it 3 inbound and 3 outbound links so `pnpm crosslinks:check` passes. Trim the duplicated scripts in the target to one example per type plus a link, so the two pages stop competing.
- **If you would rather not restore:** the fallback is to add a "What to say to an Enneagram [N]" H3 in each type section of the target and put "What to Say" in its title. Weaker, because it changes the title of a page that ranks for a different (relationships) intent.

**Expected:** keep the 3 to 4 clicks a week the tips URL is earning now (about 12 to 16 a month) and give them a page that matches the search. Small, but it is the only one of the three with momentum.

---

## N2. Why `/enneagram-test` gets 0 to 4 impressions

### What the data says

1. **`/enneagram-test` has no test on it.** Since 2026-07-18 it is the "test, reframed" page: "There's no checkbox quiz here", three steps, links to questions and type pages. Before that it was a meta-refresh to `/questions` with a canonical pointing at `/questions`. Google does not rank a page with no quiz for "free enneagram test", and it never has: 1 impression in August, 4 in September.
2. **The comparison post is what Google ranks for test intent**, and that ranking fell by about 80% in late August, before the 2025 page was redirected:

| Week of                   | "best / free / accurate enneagram test" family: impressions | Avg. position |
| ------------------------- | ----------------------------------------------------------: | ------------: |
| Jul 6 to Aug 17 (7 weeks) |                                           236 to 375 a week |  12.5 to 15.7 |
| 2026-08-24                |                                                         141 |          16.8 |
| 2026-08-31                |                                                          43 |          24.6 |
| Sep 7 to Sep 28           |                                                    44 to 71 |  13.5 to 22.8 |

Timeline: the 2026 comparison post went live 2026-08-01 next to the 2025 one (two near-identical pages for three weeks), the drop starts the week of 2026-08-24, and the 2025 page was only 301'd into 2026 on 2026-09-21. Combined weekly impressions for both comparison URLs went from about 730 to 870 in July to 200 to 440 in September. Cannibalization is the most likely cause; a Google update in late August cannot be ruled out from this data. 3. **Salvage gap.** The 2025 page covered tests the 2026 page does not mention: Beth McCord / Your Enneagram Coach, Crystal, Personality Path, 16Personalities. The 2025 URL ranked 7.5 to 8.7 for "beth mccord enneagram test", "crystal enneagram test" and "integrative enneagram test". The T-07 rule is salvage before 301. 4. **A broken promise on every post.** `TestYourTypeCTA.svelte` renders below every Enneagram Corner and pop-culture post. Its default copy promises a free five-minute 9takes test with no email wall that "returns your dominant pattern with confidence scores", and it links to `/enneagram-test`, which has no test and no scores. That is a post-click leak on the site's main traffic surface, separate from SEO.

### Recommendation: pick one (lean or ambitious)

**Lean (about half a day): stop promising a test you do not have, and put the test-intent effort where Google already looks.**

1. Rewrite the `TestYourTypeCTA` default copy to match what `/enneagram-test` actually does (for example: "Don't know your type yet? Skip the checkbox quiz. Answer one real question and see which of the nine takes sounds like you.").
2. On `/enneagram-test`, add one honest line for test-intent visitors: "Want a scored test anyway? Here is our honest comparison of the free ones", linking the 2026 comparison post. Link back from the comparison post's "Which test should you take?" section to `/enneagram-test` as the 9takes alternative.
3. Salvage the 2025 sections for Your Enneagram Coach, Crystal, Personality Path and 16Personalities into the 2026 post.
4. Title test: "Best Free Enneagram Test (2026): 5 Options Honestly Compared". The two biggest queries are singular ("best enneagram test free", 447 impressions; "best free enneagram test", 381).
5. Re-read the family's weekly numbers 4 weeks after deploy. Bar: back to 250+ impressions a week at position 12 or better.

**Ambitious (2 to 4 days): make `/enneagram-test` a real test that fits the brand.** Show five real questions, each with its nine stored takes (`nine_takes` already holds them for 358 chorus-backed questions), shuffled and unlabeled. The reader picks the take that sounds like the inside of their head each time. At the end, show the two or three patterns they kept choosing, framed as "the ones you didn't have to translate", not an assigned type, then hand them to a live question to answer before the crowd. It satisfies "free enneagram test, no email wall" intent, keeps the "nobody assigns you a type" stance, makes the blog CTA true, and is itself a give-first activation surface. Search payoff is slow and uncertain (Truity and the Enneagram Institute own the head term); the activation payoff is immediate, because every post already sends readers to this URL.

**My pick:** do the lean steps now (the CTA copy fix is urgent either way), and decide the ambitious build as a product call, not an SEO one.
