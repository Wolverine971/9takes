<!-- docs/seo/gsc-crawled-not-indexed-classification-2026-08-02.md -->

# GSC “Crawled - currently not indexed” classification — 2026-08-02

## Outcome

The exclusion bucket is improving and does **not** justify a bulk deletion or rewrite pass.

Search Console's Page Indexing report, last updated 2026-07-23, now shows:

| Metric                          | July audit | Current snapshot | Change |
| ------------------------------- | ---------: | ---------------: | -----: |
| Indexed pages                   |        464 |              492 |    +28 |
| Not-indexed pages               |        764 |              687 |    -77 |
| Crawled - currently not indexed |        256 |              230 |    -26 |

All 230 example URLs in the current exclusion export were classified. Live URL checks were run on 2026-08-02, and the search-performance comparison uses the 90-day window ending 2026-07-30.

## Classification

| Class                     | URLs | Interpretation                                                          | Treatment                                                                         |
| ------------------------- | ---: | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Low demand or weak signal |  106 | Live, indexable pages with little or no current search evidence         | Keep unless a page fails a separate quality/utility review; do not mass-delete    |
| Stale, now redirected     |   82 | Old URLs now return a correct 301 or 308                                | No content work; let Google recrawl and retire them                               |
| Recent recheck            |   20 | Mostly crawled in June or July, after recent publishing or linking work | Recheck after the next crawl window                                               |
| Valuable but missed       |   14 | Live self-canonical pages with meaningful impressions or clicks         | Treat individually, starting with metadata, distinctiveness, and contextual links |
| Live but not submitted    |    4 | Three question URLs plus `corpus-stats.json` are outside the sitemap    | Resolve route/indexability consistency; do not submit automatically               |
| Intentional noindex       |    2 | Thin question-category pages correctly use `noindex, follow`            | No action                                                                         |
| Stale or removed          |    1 | `/blog/experiment` correctly returns 404                                | No action                                                                         |
| Canonicalized duplicate   |    1 | A tracking-parameter home URL canonicalizes to `/`                      | No action                                                                         |

Current live responses across the exported set were 147 `200`s, 35 `301`s, 47 `308`s, and one `404`. Eighty-seven exported URLs are correctly absent from the sitemap; 143 are submitted.

### Redirected URLs

The 82 stale redirect examples break down as follows:

| Group                | 301 | 308 | Total |
| -------------------- | --: | --: | ----: |
| Personality analysis |   0 |  45 |    45 |
| Legacy blog          |  29 |   1 |    30 |
| Enneagram corner     |   5 |   1 |     6 |
| Question category    |   1 |   0 |     1 |

These are cleanup lag in Google's report, not 82 content problems.

### Low-signal URLs

The 106 low-demand or weak-signal examples are concentrated in personality analyses and individual questions:

| Group                | URLs |
| -------------------- | ---: |
| Personality analysis |   53 |
| Individual question  |   25 |
| Enneagram corner     |   13 |
| How-to guide         |    5 |
| Pop culture          |    5 |
| Community            |    3 |
| Question category    |    1 |
| Other                |    1 |

This class should not be pruned by an impressions threshold alone. A future review should combine search demand with uniqueness, factual quality, internal utility, conversions, backlinks, and overlap with a stronger URL.

## Valuable but missed

The URL Inspection API confirms that all 14 pages below are currently allowed to index, fetched successfully, and self-canonical. Their exclusion is therefore a content/value/internal-signal decision by Google rather than a robots, fetch, sitemap, or canonical defect.

| Priority | URL                                                      | Clicks | Impressions | Position | Last crawl | Treatment                                                                           |
| -------- | -------------------------------------------------------- | -----: | ----------: | -------: | ---------- | ----------------------------------------------------------------------------------- |
| 1        | `/personality-analysis/drake`                            |      1 |         506 |      8.5 | 2026-05-05 | Align metadata with “Drake personality type” intent and put the answer near the top |
| 2        | `/pop-culture/tech-titans-leadership-styles`             |      1 |         373 |      8.3 | 2026-05-07 | Recheck after current contextual links are crawled; no extra link stuffing          |
| 3        | `/personality-analysis/xqc`                              |      1 |         367 |      7.5 | 2026-05-04 | Review source quality and answer distinctiveness before changing metadata           |
| 4        | `/enneagram-corner/enneagram-object-relations`           |      1 |         289 |     10.3 | 2026-05-05 | Recheck after the new Enneagram Concepts link is crawled                            |
| 5        | `/personality-analysis/larry-page`                       |      3 |         265 |     13.4 | 2026-06-12 | Add a head-term title and strengthen unique evidence in a later focused refresh     |
| 6        | `/personality-analysis/tara-yummy`                       |      2 |         259 |      8.1 | 2026-05-28 | Review high same-type similarity before deciding whether to refresh                 |
| Hold     | `/enneagram-corner/enneagram-compatibility-guide`        |      0 |         218 |     10.4 | 2026-05-15 | Do not change until the separate source-verification gate passes                    |
| 7        | `/personality-analysis/christian-bale`                   |      1 |         182 |      9.6 | 2026-05-18 | Later metadata and distinctiveness review                                           |
| 8        | `/personality-analysis/john-mcafee`                      |      2 |         175 |     10.0 | 2026-05-17 | Later metadata and source-quality review                                            |
| 9        | `/personality-analysis/theo-von`                         |      1 |         142 |      9.9 | 2026-05-25 | Later metadata and source-quality review                                            |
| 10       | `/enneagram-corner/red-flags-dating-each-enneagram-type` |      0 |         134 |     11.4 | 2026-05-05 | Already well linked; assess intent/content rather than add more links               |
| 11       | `/personality-analysis/ali-abdaal`                       |      0 |         113 |      8.2 | 2026-04-13 | Title already carries the head term; review similarity and citations                |
| 12       | `/personality-analysis/trisha-paytas`                    |      1 |         106 |      8.4 | 2026-03-28 | Later metadata and distinctiveness review                                           |
| 13       | `/personality-analysis/jon-bernthal`                     |      1 |         103 |      6.9 | 2026-05-30 | Later metadata and distinctiveness review                                           |

The published-blog link audit reports zero orphans. `tech-titans-leadership-styles` already has three relevant source links, `red-flags-dating-each-enneagram-type` has broad contextual coverage, and `enneagram-object-relations` received a contextual link in the current release. Those pages need recrawling or content-level evaluation, not indiscriminate extra links.

## Indexability consistency follow-up

Four live URLs are not submitted:

- `/corpus-stats.json` is a machine-readable resource, not a search landing page. Keep it out of the sitemap and consider an HTTP `X-Robots-Tag: noindex` only as a separate technical task.
- `/questions/why-people-line-so-early-board-planes`
- `/questions/How-do-you-do`
- `/questions/what-was-the-dumbest-thing-you-did-as-a-kid`

The three question URLs currently say `index, follow` while being excluded from the sitemap. Apply the same quality predicate to their route metadata and sitemap eligibility: add only reviewed, useful questions to the sitemap; otherwise use `noindex, follow`. Do not submit all three merely to make the systems agree.

## Work order

1. **Completed and live on 2026-08-02:** refresh the Drake snippet and top-of-page answer because it has the largest verified missed opportunity and a clear query-title mismatch. The protected publication fields, including the existing `lastmod`, were preserved by the atomic content-sync workflow.
2. **Wait for recrawl:** object relations and tech leadership already received or possess relevant contextual links.
3. **Next focused batch:** inspect xQc, Larry Page, and Tara Yummy for head-term alignment, duplicate Type-pattern language, and source quality; change only pages with a specific defect.
4. **Resolve question parity:** review the three indexable/no-sitemap question URLs against the category quality gate.
5. **Measure:** re-export this bucket after Google recrawls the current release; compare whether the 14 valuable misses become indexed and whether the stale redirect count continues to fall.

Production verification also found that the previously reviewed Sydney Sweeney snippet refresh had remained local rather than reaching the database-backed page. Its reviewed title, description, and direct interview-based answer were atomically synchronized and verified in the public HTML on 2026-08-02.

## Guardrails

- Do not delete or `noindex` pages solely because they have fewer than 500 impressions.
- Do not request indexing for pages that have not received a substantive improvement.
- Do not rewrite recently changed URLs before Google has crawled the deployed version.
- Do not treat correct redirects, deliberate canonicals, intentional `noindex`, or a valid 404 as failed content.
