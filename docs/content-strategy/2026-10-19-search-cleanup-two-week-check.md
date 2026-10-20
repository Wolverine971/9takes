<!-- docs/content-strategy/2026-10-19-search-cleanup-two-week-check.md -->

# October 19 two week search cleanup check

The cleanup has early winners, but the broad snippet hypothesis is not yet proven. The seven requested cleanup pages gained **20 clicks, from 58 to 78 (+34.5%)**, against sitewide growth of **8.5%**. Their combined CTR fell from **1.08% to 0.91%** as impressions grew 59%. Instinctual subtypes, compatibility and attachment account for the gains. Toxic traits and neurodivergence lost clicks. The people batch has no click lift, and seven of its pages remain outside the index. Three of the four new posts earned **23 clicks**; type statistics contributed 17.

These are observed changes, not estimated incremental clicks caused by the edits. Counts are small, query mix changed, and there is no randomized control. The ADHD control fell 36 → 30 clicks while astrology rose 29 → 32, so neither supplies a universal adjustment for the site.

## Dates and counting

- **Frozen October 3 baseline:** the October 4 UTC export, covering **July 4–October 2**. Fresh standard export: **July 19–October 17**. Both scripts label these “90 days,” but inclusive endpoints contain 91 calendar dates, with 76 dates overlapping. The rolling comparison below preserves the exact original baseline; it is not a two-week effect estimate.
- **Matched two-week comparison:** **September 20–October 3 versus October 4–17**, 14 days each with the same weekday mix. Supplemental requests explicitly used `type: web` and `dataState: final`; the daily response returned final data through October 17. The four new posts were published late October 4, so this window includes their launch day. Performance dates retain GSC's date boundaries; the check date is October 19 in New York.
- **Page metrics:** only base URLs, with no fragment or query string. People slugs are normalized to lowercase and the largest base row retained if a case duplicate exists. Fragments are never summed into these tables. CTR is clicks ÷ impressions; group positions are impression-weighted, not averages of page averages. Lower position is better. “0 impressions” means no reported row; CTR and position are unavailable, shown as —.
- **Query metrics:** largest row per page and query, breaking ties by clicks then better position, matching the auditor. Disclosed query rows omit some searches; their clicks do not reconcile to page totals. The three manipulation queries from the original plan include “manipulative enneagram”; that 177-impression baseline is broader than the auditor's 152-impression superlative cluster.
- **Production verification:** all 28 requested URLs return HTTP 200, a self-canonical and an index-allowing robots meta tag, with no `X-Robots-Tag`. All 16 people titles are live. URL Inspection was used separately to distinguish zero demand from exclusion from Google's index. This confirms the served titles, not which titles Google chooses to show in search results.

CTR and aggregation follow [Google's performance metric definitions](https://support.google.com/webmasters/answer/7576553). Page-level and property-level impressions have different aggregation, so the seven-page totals are not subtracted from property totals to estimate a treatment effect.

## The seven cleanup pages

### Matched two week results

September 20–October 3 → October 4–17.

| Page                                                                                                 |  Clicks |   Impressions |           CTR |    Position | Readout                                  |
| ---------------------------------------------------------------------------------------------------- | ------: | ------------: | ------------: | ----------: | ---------------------------------------- |
| [Toxic traits](https://9takes.com/enneagram-corner/toxic-traits-of-each-enneagram-type)              |   7 → 5 |   982 → 1,113 | 0.71% → 0.45% |   9.1 → 8.3 | Page lost clicks; target query improved. |
| [Instinctual subtypes](https://9takes.com/enneagram-corner/enneagram-instinctual-subtypes)           |  3 → 14 |   711 → 2,630 | 0.42% → 0.53% |  12.1 → 9.8 | Strongest early cleanup result.          |
| [Manipulation](https://9takes.com/enneagram-corner/how-each-enneagram-type-manipulates)              |   2 → 4 |     498 → 562 | 0.40% → 0.71% |   7.0 → 7.1 | Small positive signal; only +2 clicks.   |
| [Depression](https://9takes.com/enneagram-corner/depression-patterns-by-enneagram-type)              | 13 → 14 |     781 → 971 | 1.66% → 1.44% |   7.1 → 6.7 | Essentially flat clicks; lower CTR.      |
| [Neurodivergence](https://9takes.com/enneagram-corner/mental-health/enneagram-neurodivergence-guide) | 14 → 10 |     748 → 650 | 1.87% → 1.54% |   6.6 → 6.5 | No snippet recovery yet.                 |
| [Compatibility matrix](https://9takes.com/enneagram-corner/enneagram-compatibility-matrix)           | 17 → 24 | 1,015 → 1,762 | 1.67% → 1.36% | 11.8 → 10.0 | More reach and clicks; lower CTR.        |
| [Attachment](https://9takes.com/enneagram-corner/attachment-styles-and-enneagram-types)              |   2 → 7 |     632 → 848 | 0.32% → 0.83% |   8.1 → 7.4 | Clicks, CTR and position improved.       |

**Instinctual subtypes is the clearest early winner.** Clicks rose 3 → 14 and impressions 711 → 2,630. The blind-query family grew from 24 to 220 impressions, 0 → 3 disclosed clicks, and position 12.8 → 10.2. “SP1 vs SP9” in either direction improved from 10.0 to 6.5, with 4 → 23 impressions but no clicks. The main head term, “enneagram instinctual variants,” did not improve: 39.8 → 42.1 in the matched windows, still zero clicks. The additions are helping long-tail visibility; the head-term rescue remains unfinished. Keep the November 15 decision point for a standalone blind-spot page; the current blind family is still outside the top five.

**Attachment is promising.** Its three original target queries earned 0 → 2 clicks and improved from position 9.9 to 8.1. The page gained five clicks and improved CTR from 0.32% to 0.83%. Preserve the new structure through the four-week check.

**Compatibility gained traffic, but the chart query did not gain clicks.** “Enneagram type compatibility” improved 18.4 → 13.4; the chart head query improved 7.0 → 6.3, yet its clicks fell 5 → 3 and CTR 3.25% → 2.07%. The overall 17 → 24 click increase is encouraging for visibility, not proof that the chart title solved CTR.

**Toxic traits has an encouraging target-query result inside a declining page-level result.** The “worst type” cluster improved from 0/67 to 2/75 clicks/impressions, CTR 0% → 2.67%, position 9.1 → 7.3. The page itself fell 7 → 5 clicks and 0.71% → 0.45% CTR. Keep the answer that is beginning to work; do not declare a page recovery or reverse the whole cleanup. “Unhealthy traits of enneagram 9” remains weak: position 17.8 after versus the original 15.1 baseline, zero clicks.

**Manipulation is tentative; depression has no clear click gain.** Manipulation gained two page clicks, but its original three-query family earned one click in each matched window. Depression gained one page click while CTR fell; its target two-query family improved 5.4 → 3.5 but still earned zero clicks. Answering a query is not sufficient evidence that it will earn a click.

**Neurodivergence has not recovered.** Page clicks fell 14 → 10 and CTR 1.87% → 1.54% at essentially flat position. The exact autistic superlative query improved 6.0 → 5.7 and grew 10 → 18 impressions, still zero clicks. The live title already leads with “Autism, ADHD”; this is not an unshipped title fix. Keep the unpublished T-08 draft on hold while measuring this URL, unless DJ separately resolves that decision.

### Original rolling baseline comparison

October 4 export → October 19 export. This answers the original baseline comparison; the matched windows above determine the early verdict.

| Page                                                                                                 |    Clicks |   Impressions |           CTR |    Position |
| ---------------------------------------------------------------------------------------------------- | --------: | ------------: | ------------: | ----------: |
| [Toxic traits](https://9takes.com/enneagram-corner/toxic-traits-of-each-enneagram-type)              |   75 → 63 | 5,702 → 6,111 | 1.32% → 1.03% | 10.5 → 10.0 |
| [Instinctual subtypes](https://9takes.com/enneagram-corner/enneagram-instinctual-subtypes)           |   27 → 37 | 6,880 → 8,519 | 0.39% → 0.43% | 14.2 → 12.8 |
| [Manipulation](https://9takes.com/enneagram-corner/how-each-enneagram-type-manipulates)              |   32 → 31 | 3,571 → 3,735 | 0.90% → 0.83% |   7.4 → 7.3 |
| [Depression](https://9takes.com/enneagram-corner/depression-patterns-by-enneagram-type)              | 125 → 108 | 5,353 → 5,538 | 2.34% → 1.95% |   7.8 → 7.6 |
| [Neurodivergence](https://9takes.com/enneagram-corner/mental-health/enneagram-neurodivergence-guide) |   86 → 83 | 4,576 → 4,670 | 1.88% → 1.78% |   7.1 → 7.0 |
| [Compatibility matrix](https://9takes.com/enneagram-corner/enneagram-compatibility-matrix)           |   89 → 96 | 8,180 → 8,814 | 1.09% → 1.09% | 13.4 → 12.9 |
| [Attachment](https://9takes.com/enneagram-corner/attachment-styles-and-enneagram-types)              |   40 → 42 | 4,817 → 4,769 | 0.83% → 0.88% |   8.8 → 8.7 |

## The 16 synced people pages

The cohort is the 17 meta-title edits in commit `0d1beba58`, excluding **Sam Altman**, whose sync was held. The [October 5 status brief](../daily-briefs/2026-10-05_marketing-status.md) records 16/17 live. The public titles were rechecked on October 19.

**No click lift:** 5 → 1 clicks, 534 → 720 impressions, CTR 0.94% → 0.14%, weighted position 8.7 → 8.2 in the matched windows. This is too few clicks to attribute the decline to the titles, but it provides no reason to extend the batch.

| Page                                                                             | Clicks | Impressions |           CTR |    Position | Readout                                    |
| -------------------------------------------------------------------------------- | -----: | ----------: | ------------: | ----------: | ------------------------------------------ |
| [Anthony Bourdain](https://9takes.com/personality-analysis/anthony-bourdain)     |  0 → 0 |      12 → 9 | 0.00% → 0.00% |   6.0 → 7.8 |                                            |
| [Aubrey Plaza](https://9takes.com/personality-analysis/aubrey-plaza)             |  2 → 1 |   205 → 269 | 0.98% → 0.37% |   8.0 → 7.9 |                                            |
| [Chappell Roan](https://9takes.com/personality-analysis/chappell-roan)           |  1 → 0 |   124 → 106 | 0.81% → 0.00% |   8.7 → 8.1 |                                            |
| [Harry Styles](https://9takes.com/personality-analysis/harry-styles)             |  0 → 0 |     0 → 181 |     — → 0.00% |     — → 8.0 | Indexed again; 181 impressions, no clicks. |
| [Jenna Ortega](https://9takes.com/personality-analysis/jenna-ortega)             |  0 → 0 |       0 → 0 |         — → — |       — → — | Discovered - currently not indexed         |
| [Joaquin Phoenix](https://9takes.com/personality-analysis/joaquin-phoenix)       |  1 → 0 |     76 → 84 | 1.32% → 0.00% | 12.7 → 10.2 |                                            |
| [Matt Damon](https://9takes.com/personality-analysis/matt-damon)                 |  0 → 0 |     30 → 27 | 0.00% → 0.00% |   6.8 → 7.9 |                                            |
| [Megan Fox](https://9takes.com/personality-analysis/megan-fox)                   |  1 → 0 |     24 → 17 | 4.17% → 0.00% |   7.8 → 7.5 |                                            |
| [Mindy Kaling](https://9takes.com/personality-analysis/mindy-kaling)             |  0 → 0 |      35 → 7 | 0.00% → 0.00% |   7.8 → 7.1 |                                            |
| [Napoleon Bonaparte](https://9takes.com/personality-analysis/napoleon-bonaparte) |  0 → 0 |       0 → 0 |         — → — |       — → — | Crawled - currently not indexed            |
| [Noah Kahan](https://9takes.com/personality-analysis/noah-kahan)                 |  0 → 0 |     26 → 20 | 0.00% → 0.00% |   8.4 → 8.3 |                                            |
| [Olivia Rodrigo](https://9takes.com/personality-analysis/olivia-rodrigo)         |  0 → 0 |       0 → 0 |         — → — |       — → — | Crawled - currently not indexed            |
| [Robert Downey Jr](https://9takes.com/personality-analysis/robert-downey-jr)     |  0 → 0 |       0 → 0 |         — → — |       — → — | Discovered - currently not indexed         |
| [Ryan Reynolds](https://9takes.com/personality-analysis/ryan-reynolds)           |  0 → 0 |       2 → 0 |     0.00% → — |    10.5 → — | Crawled - currently not indexed            |
| [Travis Scott](https://9takes.com/personality-analysis/travis-scott)             |  0 → 0 |       0 → 0 |         — → — |       — → — | Crawled - currently not indexed            |
| [Will Smith](https://9takes.com/personality-analysis/will-smith)                 |  0 → 0 |       0 → 0 |         — → — |       — → — | Crawled - currently not indexed            |

**Harry Styles is the technical recovery:** it went from no reported impressions to 181 at position 8.0, and URL Inspection says “Submitted and indexed,” with a last crawl on October 7.

**Seven people pages remain excluded**, based on URL Inspection rather than absence of traffic:

| Status                                           | Pages                                   | Last Google crawl reported             |
| ------------------------------------------------ | --------------------------------------- | -------------------------------------- |
| Discovered, currently not indexed                | Jenna Ortega; Robert Downey Jr.         | No crawl time returned                 |
| Crawled, currently not indexed after the cleanup | Napoleon Bonaparte; Olivia Rodrigo      | October 7 for both                     |
| Crawled, currently not indexed with an old crawl | Ryan Reynolds; Travis Scott; Will Smith | May 15; April 25; June 6, respectively |

The next action is indexing work on those seven, not another title batch. Verify discovery links and request a crawl for the never-crawled or stale-crawl pages. For Napoleon and Olivia, which Google already revisited after the edits, review rendered content and distinct value before another substantive change. Repeatedly requesting the same crawled-but-excluded URL is not a substitute for that review. Google's [indexing guidance](https://support.google.com/webmasters/answer/7440203) distinguishes discovery, crawling and indexing; a live 200 page does not establish index inclusion.

### People against the original rolling baseline

| Page                                                                             | Clicks |   Impressions |           CTR |    Position |
| -------------------------------------------------------------------------------- | -----: | ------------: | ------------: | ----------: |
| [Anthony Bourdain](https://9takes.com/personality-analysis/anthony-bourdain)     |  0 → 0 |       46 → 54 | 0.00% → 0.00% |   8.4 → 8.4 |
| [Aubrey Plaza](https://9takes.com/personality-analysis/aubrey-plaza)             |  9 → 8 | 1,693 → 1,746 | 0.53% → 0.46% |   8.6 → 8.5 |
| [Chappell Roan](https://9takes.com/personality-analysis/chappell-roan)           |  1 → 1 |     839 → 806 | 0.12% → 0.12% |   9.8 → 9.8 |
| [Harry Styles](https://9takes.com/personality-analysis/harry-styles)             |  0 → 0 |       0 → 181 |     — → 0.00% |     — → 8.0 |
| [Jenna Ortega](https://9takes.com/personality-analysis/jenna-ortega)             |  0 → 0 |         0 → 0 |         — → — |       — → — |
| [Joaquin Phoenix](https://9takes.com/personality-analysis/joaquin-phoenix)       |  2 → 1 |     726 → 698 | 0.28% → 0.14% | 16.0 → 15.4 |
| [Matt Damon](https://9takes.com/personality-analysis/matt-damon)                 |  4 → 3 |     286 → 304 | 1.40% → 0.99% |   7.4 → 7.4 |
| [Megan Fox](https://9takes.com/personality-analysis/megan-fox)                   |  0 → 1 |     112 → 127 | 0.00% → 0.79% |   8.0 → 8.1 |
| [Mindy Kaling](https://9takes.com/personality-analysis/mindy-kaling)             |  0 → 0 |     113 → 105 | 0.00% → 0.00% |   8.3 → 7.9 |
| [Napoleon Bonaparte](https://9takes.com/personality-analysis/napoleon-bonaparte) |  0 → 0 |         0 → 0 |         — → — |       — → — |
| [Noah Kahan](https://9takes.com/personality-analysis/noah-kahan)                 |  0 → 0 |     136 → 146 | 0.00% → 0.00% |   8.3 → 8.5 |
| [Olivia Rodrigo](https://9takes.com/personality-analysis/olivia-rodrigo)         |  0 → 0 |         0 → 0 |         — → — |       — → — |
| [Robert Downey Jr](https://9takes.com/personality-analysis/robert-downey-jr)     |  0 → 0 |         0 → 0 |         — → — |       — → — |
| [Ryan Reynolds](https://9takes.com/personality-analysis/ryan-reynolds)           |  0 → 0 |       26 → 24 | 0.00% → 0.00% |   7.3 → 7.1 |
| [Travis Scott](https://9takes.com/personality-analysis/travis-scott)             |  0 → 0 |         0 → 0 |         — → — |       — → — |
| [Will Smith](https://9takes.com/personality-analysis/will-smith)                 |  0 → 0 |         4 → 0 |     0.00% → — |     4.8 → — |

## Four new posts and the be gentle essay

Each had **zero reported impressions and clicks in the original baseline**, so baseline CTR and position are unavailable. Their current rolling metrics equal the October 4–17 metrics below. All four new posts were published in `e710d8a05`; the essay replaced an existing scaffold.

| Page                                                                                                     | Clicks | Impressions |       CTR | Position | Readout                                                  |
| -------------------------------------------------------------------------------------------------------- | -----: | ----------: | --------: | -------: | -------------------------------------------------------- |
| [Love language](https://9takes.com/enneagram-corner/what-is-a-love-language)                             |  0 → 2 |     0 → 137 | — → 1.46% |  — → 9.4 | Indexed; small initial traction.                         |
| [Narcissism](https://9takes.com/enneagram-corner/which-enneagram-type-is-most-likely-to-be-a-narcissist) |  0 → 4 |     0 → 943 | — → 0.42% |  — → 7.2 | Indexed; reach established, target-query CTR still zero. |
| [Type statistics](https://9takes.com/enneagram-corner/how-common-is-each-enneagram-type)                 | 0 → 17 |   0 → 1,625 | — → 1.05% |  — → 8.5 | Indexed; strongest new post.                             |
| [Community guide](https://9takes.com/community/enneagram-community)                                      |  0 → 0 |       0 → 0 |     — → — |    — → — | Discovered, currently not indexed.                       |
| [Be gentle essay](https://9takes.com/community/be-gentle-when-youre-right)                               |  0 → 0 |       0 → 0 |     — → — |    — → — | Indexed; last crawled October 10.                        |

**Type statistics worked best:** 17 clicks, 1,625 impressions, 1.05% CTR, position 8.5. However, the auditor's “rare” cluster has 280 impressions at 10.1 and zero disclosed clicks, and “rare + tritype” has another 58 at 9.8 with no answer on the page. The page's 17 clicks must not be credited to those zero-click query clusters. Add a short, evidence-checked answer to “What is the rarest tritype?” within this page; do not invent population rankings or launch a separate article from 58 impressions.

**Narcissism has won visibility, not the target click yet.** The page has 4 clicks on 943 impressions at position 7.2, but its superlative cluster has 0 clicks on 146 impressions at 7.5. The old mental-illness page still has 132 rolling impressions for that cluster at 11.2; the two-week old-page sample is too small to establish a clean transfer. Keep the new article as the intended owner and retain the frozen parent's existing contextual link. No second narcissism article or parent restructure is warranted.

**Love language has started ranking for the seven-language variants.** It has 2 clicks on 137 impressions; “7 love languages” supplies one disclosed click. The original head query “what is love language in a relationship” has no disclosed row on the new page, and fell from 266 to 8 impressions on the parent in the matched windows. This is not yet a demonstrated capture of the original 939-impression opportunity. Keep the definition and parent-to-new-page handoff, and check that exact head query again at four weeks.

**The community guide needs discovery/indexing attention.** It is live and indexable but remains “Discovered — currently not indexed,” with no crawl time returned. Check its links from indexed community/framework pages and request a crawl. Its zero impressions are not an editorial verdict yet.

**Be gentle is indexed but has no recorded search exposure.** It has no search traffic in either baseline or fresh data. Judge this essay through referral readers and engagement, which GSC cannot measure. Use the existing [promotion packet](../distribution-assets/2026-10-04-be-gentle-when-youre-right-promo.md) for distribution when authorized; keep the essay's voice. This check does not establish whether social distribution succeeded.

## Superlative audit

`pnpm audit:superlatives` completed against the fresh export: **212 deduplicated query rows, 22 pages, 78 clusters**. At 50+ impressions there are **3 unanswered and 1 buried**, compared with **1 unanswered and 1 buried** in the October 3 cleanup's post-edit report. Nine clusters are answered up top, versus eight previously. The extra flags are newly visible demand, not proof that the original edits regressed.

| Flag                                | Fresh rolling impressions | Clicks | Position | Next action                                                                                                                                   |
| ----------------------------------- | ------------------------: | -----: | -------: | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Mental illness: narcissist          |                       132 |      0 |     11.2 | Already has a dedicated, indexed owner. Keep the parent's link and frozen-page restrictions.                                                  |
| Mental illness: HPD                 |                       131 |      0 |      6.1 | Verify the query's meaning and clinical evidence; an additive, non-diagnostic FAQ is the maximum initial change. Do not infer a type ranking. |
| Type statistics: rarest tritype     |                        58 |      0 |      9.8 | Add a concise H2 answer with evidence limits on the existing page.                                                                            |
| Test comparison: most accurate test |                        68 |      0 |     19.6 | Promote the existing answer from H3 to H2 during the next small content pass. Low priority at this rank.                                      |

The frozen mental-illness page's psychopath and BPD answers remain within its permitted FAQ ceiling. They still have zero clicks (157 and 91 impressions respectively); preserve the original restriction against retitling, restructuring or changing `lastmod`.

## Target query comparison

Each cell is **clicks / impressions / CTR / position**. These are deduplicated query families, not page totals. The full-query patterns are preserved in the analysis JSON. “Worst” excludes the separate worst-tritype concept; the manipulation row preserves the original plan's three-query definition.

| Query or family                      | Original rolling baseline | Fresh rolling          | Before two weeks      | After two weeks        |
| ------------------------------------ | ------------------------- | ---------------------- | --------------------- | ---------------------- |
| Worst type cluster                   | 1 / 393 / 0.25% / 9.8     | 3 / 424 / 0.71% / 9.2  | 0 / 67 / 0.00% / 9.1  | 2 / 75 / 2.67% / 7.3   |
| Unhealthy traits of type 9           | 0 / 161 / 0.00% / 15.1    | 0 / 155 / 0.00% / 16.0 | 0 / 12 / 0.00% / 18.2 | 0 / 18 / 0.00% / 17.8  |
| Instinctual variants head term       | 0 / 414 / 0.00% / 40.1    | 0 / 427 / 0.00% / 40.9 | 0 / 42 / 0.00% / 39.8 | 0 / 70 / 0.00% / 42.1  |
| Blind spot cluster                   | 4 / 414 / 0.97% / 10.3    | 6 / 595 / 1.01% / 10.2 | 0 / 24 / 0.00% / 12.8 | 3 / 220 / 1.36% / 10.2 |
| SP1 vs SP9 both directions           | 0 / 25 / 0.00% / 9.3      | 0 / 47 / 0.00% / 7.9   | 0 / 4 / 0.00% / 10.0  | 0 / 23 / 0.00% / 6.5   |
| Manipulation original three queries  | 2 / 177 / 1.13% / 5.4     | 3 / 179 / 1.68% / 5.3  | 1 / 31 / 3.23% / 5.7  | 1 / 24 / 4.17% / 5.1   |
| Depression original two queries      | 2 / 114 / 1.75% / 4.6     | 0 / 104 / 0.00% / 4.6  | 0 / 13 / 0.00% / 5.4  | 0 / 11 / 0.00% / 3.5   |
| Autistic head query                  | 0 / 113 / 0.00% / 7.2     | 0 / 101 / 0.00% / 6.8  | 0 / 10 / 0.00% / 6.0  | 0 / 18 / 0.00% / 5.7   |
| Compatibility chart head query       | 28 / 944 / 2.97% / 6.3    | 27 / 998 / 2.71% / 6.2 | 5 / 154 / 3.25% / 7.0 | 3 / 145 / 2.07% / 6.3  |
| Type compatibility head query        | 0 / 611 / 0.00% / 15.3    | 0 / 599 / 0.00% / 15.5 | 0 / 59 / 0.00% / 18.4 | 0 / 79 / 0.00% / 13.4  |
| Attachment original three queries    | 2 / 153 / 1.31% / 10.2    | 4 / 209 / 1.91% / 9.5  | 0 / 29 / 0.00% / 9.9  | 2 / 56 / 3.57% / 8.1   |
| Love language definition on parent   | 0 / 939 / 0.00% / 7.9     | 0 / 972 / 0.00% / 7.9  | 0 / 266 / 0.00% / 8.0 | 0 / 8 / 0.00% / 9.5    |
| Love language definition on new page | 0 / 0 / — / —             | 0 / 0 / — / —          | 0 / 0 / — / —         | 0 / 0 / — / —          |

## Monthly history check

The requested trends script completed for July 2025–October 2026; October ends on **October 16**. It sums fragment rows, unlike the base-URL comparisons above, so its CTR, impressions and position are not interchangeable with them. The table is a historical cross-check only; October is a partial month and ends a day earlier than the two-week data.

| Page                 | September clicks in original export | September clicks in fresh export | October 1–16 clicks in fresh export |
| -------------------- | ----------------------------------: | -------------------------------: | ----------------------------------: |
| Toxic traits         |                                  21 |                               21 |                                   5 |
| Instinctual subtypes |                                   8 |                                8 |                                  16 |
| Manipulation         |                                   8 |                                8 |                                   4 |
| Depression           |                                  33 |                               34 |                                  13 |
| Neurodivergence      |                                  18 |                               23 |                                   9 |
| Compatibility matrix |                                  27 |                               29 |                                  28 |
| Attachment           |                                  11 |                               11 |                                   8 |

September was revised in the new response for depression (33 → 34), neurodivergence (18 → 23) and compatibility (27 → 29). The original export remains the baseline; those retrospective revisions are not credited to the October cleanup. Instinctual subtypes already exceeds its original full-September clicks in the partial October file, consistent with the matched-window result. Toxic traits remains below its old pace.

## What to do next

1. **Prioritize the eight unindexed URLs:** the seven people pages above plus the community guide. Start with Jenna Ortega, Robert Downey Jr., the community guide, and the three people URLs whose last crawl predates the cleanup. Inspect content/uniqueness for Napoleon and Olivia, already crawled October 7. Current HTTP, canonical and robots checks are clean; no live noindex blocker was found on these pages. GSC's manual request-indexing step remains an action for DJ; this run performed read-only inspection.
2. **Make the small, supported content addition on type statistics:** answer the rarest-tritype question on the existing page after checking what evidence supports. It is the best-performing new post and has an actual unanswered query family. The HPD FAQ is a separate, evidence-gated additive task on the frozen page; the test-comparison heading promotion is lower priority.
3. **Keep the successful cleanup elements through a full four-week window.** Preserve instinctual blind-spot coverage, attachment's structure, compatibility's chart, and toxic traits' worst-type answer. Do not expand the people-title batch from this result. The measured gains do not support a mass retitle.
4. **Prepare narrow snippet reviews for neurodivergence and toxic traits, then decide with four weeks of data.** Inspect how Google renders the specific query results and compare stable query/device slices before changing the live titles again. For compatibility, separate the growing type-compatibility queries from the chart query whose CTR fell. For depression and manipulation, current target-query counts are too small for a confident click verdict.
5. **Run the four-week check on November 2**, when final data through October 31 should be available: compare **September 6–October 3 against October 4–31**, and keep this original rolling baseline alongside the matched 28-day view. Reinspect the eight excluded URLs. Keep **November 15** as the conditional standalone blind-spot decision from the original plan. These are recommended dates, not scheduled automations.
6. **Treat be gentle as a distribution task.** It is indexed and has no measured search demand. Use referral/engagement analytics and the existing promotion packet to assess it; further SEO rewriting has no support in this check.

## Evidence and completed commands

- [Original plan](2026-10-03-search-cleanup-and-gap-plan.md) and [October 5 shipping record](../daily-briefs/2026-10-05_marketing-status.md).
- `node scripts/fetch-gsc-data.mjs`: [queries](../data/gsc/2026-10-19-queries.csv), [pages](../data/gsc/2026-10-19-pages.csv), [page-query rows](../data/gsc/2026-10-19-page-query.csv); 11,724 / 2,128 / 17,539 rows. [Latest pointer](../data/gsc/latest.json) now references October 19.
- `node scripts/fetch-gsc-page-trends.mjs`: [monthly history](../data/gsc/2026-10-19-page-trends.csv), 6,575 rows. Original [October 4 monthly history](../data/gsc/2026-10-04-page-trends.csv) retained.
- `pnpm audit:superlatives`: [regenerated report](../seo/superlative-query-gaps.md).
- [Matched-window raw GSC responses](../data/gsc/experiments/2026-10-19-search-cleanup-windows.json), including property totals and daily dates.
- [All page and target-query comparisons](../data/gsc/experiments/2026-10-19-search-cleanup-analysis.json), including the 28 requested pages plus controls/context pages.
- [Live metadata and URL Inspection responses](../data/gsc/experiments/2026-10-19-search-cleanup-verification.json), including crawl timestamps, index status and canonical URLs.

No production content, titles, redirects or database records were changed in this check.
