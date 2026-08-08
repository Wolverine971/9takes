<!-- docs/seo/seo-refresh-priority-plan-2026-07-31.md -->

# SEO Refresh and Consolidation Priority Plan

**Owner:** DJ

**Created:** 2026-07-31

**Primary measurement window:** GSC 2026-05-01 through 2026-07-30

**Source snapshot:** `docs/data/gsc/latest.json`

## Objective

Increase organic clicks from the content 9takes already has by improving search-result fit, strengthening contextual internal links, consolidating overlapping pages, and removing only content that fails a documented evidence gate.

This is not a blanket content-pruning project. Matching the current 664-URL sitemap against the 2026-07-25 90-day GSC export put 496 URLs below 500 impressions. That group includes new pages, low-demand subjects, hubs, and useful non-search pages. Low impressions alone are not a deletion signal. Refresh the count before using it operationally because the current GSC pointer now targets the newer 2026-08-01 UTC export.

## Operating rules

1. Prioritize pages already earning impressions at positions where a better title, snippet, or answer structure can produce more clicks.
2. Use query-level GSC data before changing a page. Page-level averages can hide mismatched or irrelevant queries.
3. Add internal links only when the source page and destination are contextually related.
4. Merge overlapping pages only after unique material is moved into the winner.
5. Use a permanent redirect only when there is a genuinely relevant replacement. Otherwise return 404/410 or use `noindex, follow`, depending on whether the page still serves users.
6. Do not bump `lastmod` for metadata-only, invisible-comment, or trivial edits.
7. Do not evaluate a refresh after one week. Record a baseline, then compare at two and four weeks while holding average position in view.
8. Preserve unrelated worktree changes. No stash, reset, or bulk rewrite outside the named scope.

## Prioritized queue

| Rank | Workstream                                                        | Why it is prioritized                                                                                                                                                                                                              | Definition of done                                                                                                                                                                                                               | Status                                                                      |
| ---: | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
|    1 | Astrology lookup-intent CTR fix (`T-04`)                          | The page already ranks around position 8 and earned 10,091 impressions in the latest window, but its title promises an essay while queries want a zodiac-to-Enneagram chart. Highest-confidence traffic win.                       | Short SERP title retains “Chart”; chart is the first substantive table; honest correlation caveat is near the top; description fits the snippet budget; structured data remains consistent; build passes; baseline recorded.     | **Implemented locally 2026-07-31; deploy/index pending**                    |
|    2 | Remove published `QUALITY_FEEDBACK` comment leaks (`T-10`)        | Invisible reviewer comments still expose internal grades and stale safety labels in rendered source, including on traffic-leading pages. This is a trust and crawler-hygiene issue with no user-facing downside.                   | Explicit dry-run review gate satisfied; current blocks removed in reviewable batches; visible prose and `lastmod` unchanged; lint guard fails on both known marker formats; fresh build contains no marker.                      | **Implemented locally 2026-07-31; deploy pending**                          |
|    3 | Contextual internal-link pass for orphan and near-orphan articles | The read-only audit found 6 posts with zero body-level inbound links and 22 with one. Several already rank, so relevant links can improve discovery and distribute internal authority without rewriting them.                      | Fix the six zero-inbound posts first, starting with the Kardashian analysis (2,504 impressions); each link is editorially relevant; audit rerun shows zero true orphans or documents intentional exceptions.                     | **Zero-orphan phase implemented locally 2026-07-31; deploy pending**        |
|    4 | High-impression, low-CTR refresh batch                            | Several pages have thousands of impressions and page-one or near-page-one positions but capture very few clicks. These have more upside than the least-visited pages.                                                              | Query-level review and targeted refresh for a first batch: IShowSpeed, Sabrina Carpenter, Sydney Sweeney, Elon Musk, Enneagram Wings, and the test comparison. Recently rewritten pages are measured before being touched again. | **Sydney implemented; four rewrites held; test comparison moved to Rank 5** |
|    5 | 2026 Enneagram test-comparison evidence edition                   | The 2025 page earned 8,687 impressions and 21 clicks, while the corpus audit found an invented accuracy scale and internal contradictions. A new annual edition captures that demand without silently replacing the archived page. | Create a 2026 successor with transparent methodology and verified claims; preserve the 2025 URL and article; update current internal links; validate structured data, routes, and build.                                         | **Implemented locally on a new 2026 URL; deploy/index pending**             |
|    6 | Cannibalization merges and 301 consolidation (`T-07`)             | Anxiety, communication, teams, growth, first-impression, mental-health, and neurodiversity clusters split relevance across overlapping URLs. Consolidation is justified by duplicate intent, not by a traffic threshold.           | For each cluster: verify query overlap and backlinks; salvage unique material; update internal links; unpublish loser; regenerate sitemap/search index; add one-hop 301; verify winner.                                          | **Anxiety + communication implemented; teams is next**                      |
|    7 | GSC “Crawled, currently not indexed” classification               | The 2026-08-02 export contains 230 examples, down from 256 in July. All 230 were classified against live response, sitemap, canonical, robots, crawl-date, and 90-day performance evidence.                                        | Work the 14 valuable misses individually; let 82 correct redirects age out; recheck 20 recent URLs; do not mass-delete the 106 low-signal examples.                                                                              | Complete; first targeted refresh applied to Drake                           |
|    8 | Question-category indexability completion                         | Thin category pages have already been changed to `noindex, follow` and excluded from the sitemap until they have substantive reviewed introductions. Finish only categories with enough questions and real search usefulness.      | Complete/review the remaining eligible priority intros; keep sparse categories out of the index; confirm route and sitemap use the same predicate.                                                                               | Partially complete                                                          |
|    9 | Remove or correct stale `quality_*` frontmatter (`T-03`)          | The current fields are unreliable in both directions: remediated pages still say `fail`, while a formerly unsafe page self-certified as passing. They must not drive publish/prune decisions.                                      | DJ selects the documented policy; execute without unpublishing pages or changing `lastmod`; preserve the separate `content_quality` system.                                                                                      | Blocked on policy decision                                                  |
|   10 | Four-week measurement and repeatable refresh loop                 | Without dated baselines, traffic changes cannot be attributed to title, content, link, or consolidation work.                                                                                                                      | Record deployment date and GSC baseline for every changed URL; compare at two/four weeks; keep, iterate, or revert based on clicks, CTR, position, and query mix.                                                                | Ongoing                                                                     |

## Rank 1 baseline: astrology lookup-intent fix

Latest page-level GSC row, 2026-05-01 through 2026-07-30:

| URL                                             | Clicks | Impressions |   CTR | Position |
| ----------------------------------------------- | -----: | ----------: | ----: | -------: |
| `/enneagram-corner/astrology-and-the-enneagram` |     89 |      10,091 | 0.88% |      8.4 |

The current anchor rows are recorded in `T-04` from the `2026-08-01-pages.csv` artifact. After deployment, recheck the page and anchor rows at two and four weeks. The success condition is materially higher CTR without a comparable loss in average position.

Production was verified on 2026-08-02. The deployed `<title>` and answer content are live, the blog index is synchronized, and the two-week/four-week measurement clocks now begin from this date.

## Rank 3 outcome: zero-orphan internal-link pass

The first Rank 3 pass added one editorially relevant body link to each of the six published posts that had no body-level inbound links:

| Source article                     | Destination article                                |
| ---------------------------------- | -------------------------------------------------- |
| Comedy Kings Enneagram Analysis    | Kardashian Family Enneagram Analysis               |
| Enneagram Concepts                 | Enneagram Object Relations                         |
| Enneagram Type 4                   | What Enneagram Type Are Most Musicians?            |
| Ultimate Guide to Active Listening | How to Psychoanalyze People                        |
| Podcaster Personality Map          | Alex Cooper and Alix Earle Beef Analysis           |
| Podcaster Personality Map          | TBPN: John Coogan and Jordi Hays Enneagram Dynamic |

The audit changed from **6 orphan / 22 near-orphan** posts to **0 orphan / 28 near-orphan** posts. The increase in near-orphans is expected: each former orphan now has its first contextual inbound link. Frontmatter and `lastmod` were left unchanged, `git diff --check` passed, and the production build plus asset-budget ratchets passed. A later strengthening pass can add a second relevant inbound link to the highest-impression near-orphans, but the zero-orphan objective is complete locally.

## Rank 4 baseline and first refresh

The current GSC window ends on 2026-07-30. Five of the six candidate files were rewritten between 2026-07-26 and 2026-07-31, so the current metrics do not measure those versions. Four remain held until a clean post-deployment window is available. The test comparison advanced under Rank 5 because its unsupported accuracy claims created a separate factual-integrity reason to publish a new 2026 edition.

| URL                                                | Clicks | Impressions |   CTR | Position | Current source revision | Decision                                                                              |
| -------------------------------------------------- | -----: | ----------: | ----: | -------: | ----------------------- | ------------------------------------------------------------------------------------- |
| `/personality-analysis/ishowspeed`                 |     21 |      12,737 | 0.16% |      8.1 | 2026-07-28              | Hold; the current GSC window contains at most two days of the rewrite.                |
| `/personality-analysis/sabrina-carpenter`          |     13 |       6,898 | 0.19% |      6.6 | 2026-07-26              | Hold; the current GSC window contains at most four days of the rewrite.               |
| `/personality-analysis/sydney-sweeney`             |      5 |       3,312 | 0.15% |      7.6 | 2026-05-19              | Refresh now; enough time has elapsed to evaluate the current snippet.                 |
| `/personality-analysis/elon-musk`                  |      3 |       2,688 | 0.11% |     13.7 | 2026-07-28              | Hold; it also has an explicit head-term title-test exception.                         |
| `/enneagram-corner/enneagram-wings-complete-guide` |     32 |       8,469 | 0.38% |     12.9 | 2026-07-31              | Hold; the rewrite falls after the GSC window.                                         |
| `/enneagram-corner/enneagram-test-comparison-2025` |     21 |       8,687 | 0.24% |     13.6 | 2025 edition            | Preserve unchanged; use its demand as evidence for the new 2026 edition under Rank 5. |

The latest query export anonymizes nearly all Sydney Sweeney queries, so the refresh also uses the 2026-06-11 page-query snapshot. Its leading disclosed queries were `sydney sweeney personality` (84 impressions), `sydney sweeney personality traits 2026` (78), `sydney sweeney personality traits interviews` (55), `sydney sweeney personality traits real life 2025 2026` (32), and `sydney sweeney personality type` (25).

The Sydney refresh changes the SERP title to **“Sydney Sweeney Personality Type & Traits: What Interviews Reveal,”** rewrites the description around the real-life/interview intent, and adds a two-sentence answer near the top. Production verification found that the database-backed page was still serving the old version, so the three reviewed fields were atomically synchronized and verified live on 2026-08-02. The long-form analysis, URL, publication fields, and `lastmod` remain unchanged. Compare CTR, clicks, position, and query mix at two and four weeks from the live sync.

## Rank 5 outcome: new 2026 Enneagram test-comparison edition

The latest page-level GSC row, 2026-05-01 through 2026-07-30, belongs to the archived 2025 URL and establishes demand for the topic. The new 2026 URL has no pre-launch search baseline.

| URL                                                | Clicks | Impressions |   CTR | Position |
| -------------------------------------------------- | -----: | ----------: | ----: | -------: |
| `/enneagram-corner/enneagram-test-comparison-2025` |     21 |       8,687 | 0.24% |     13.6 |

The largest disclosed query opportunities were `best free enneagram test` (731 impressions, position 12.5), `best enneagram test free` (674, position 10.6), `cloverleaf enneagram test` (233, position 8.6), `is truity enneagram test free` (90, position 10.5), and `most accurate enneagram test` (83, position 25.8).

The 2026 edition:

- publishes at `/enneagram-corner/enneagram-test-comparison-2026` with both `date` and `lastmod` set to 2026-08-01;
- preserves the 2025 file and URL unchanged, with no redirect or canonical replacement;
- replaces the unsupported ten-test accuracy leaderboard with five current, directly verified use cases;
- publishes the evaluation method and explicitly separates provider claims from independent evidence;
- corrects RHETI from $12 to $20 and identifies the separate $20 IVQ / $36 bundle;
- corrects Eclectic Energies from a fixed 108 questions to its documented adaptive 78–126 range;
- records Truity's free all-nine score result, its public technical document, and the fact that its landing page does not disclose the paid-report price;
- verifies Cloverleaf's current free individual offer and iEQ9's $60/$120 reports without converting vendor claims into comparable accuracy percentages;
- replaces unsupported 5–10% error, 85% accuracy, fixed-by-age-five, Stanford, CIA, and similar claims;
- reduces the article from 4,811 to 2,928 words while moving the answer and comparison table to the top;
- aligns the 2026 title, 149-character description, visible FAQ, and six-item FAQPage JSON-LD;
- moves current editorial links, the curated resources index, the corpus-stats recommendation, and the generic `/enneagram-test` alias to the 2026 edition while linking back to the 2025 article as an archived edition.

The JSON-LD parses, the title is 54 characters, `git diff --check` passes, and the production build plus asset-budget ratchets pass. The 2026 edition and generic test alias were verified live on 2026-08-02. Establish the 2026 URL's baseline and compare the page and named query rows at two and four weeks; continue tracking the 2025 URL separately rather than combining annual editions.

## Rank 6 outcome: anxiety consolidation pilot

The first Rank 6 cluster consolidates two duplicate flat-route articles into the established mental-health guide:

| Role   | URL                                                                | Pre-merge signal                   | Local action                                                                               |
| ------ | ------------------------------------------------------------------ | ---------------------------------- | ------------------------------------------------------------------------------------------ |
| Winner | `/enneagram-corner/mental-health/enneagram-anxiety-complete-guide` | 7 clicks and already consolidating | Leads with the salvaged self-fulfilling anxiety mechanism; `lastmod` updated to 2026-08-01 |
| Loser  | `/enneagram-corner/enneagram-anxiety-management-guide`             | Not indexed                        | `published: false`; one-hop 301 to winner                                                  |
| Loser  | `/enneagram-corner/anxiety-and-enneagram-types-guide`              | 0 clicks                           | `published: false`; one-hop 301 to winner                                                  |

The implementation preserves query strings on both new 301s, repoints 38 internal links across 32 source files, and corrects the two flat mental-health links identified by `T-07`. Production verification on 2026-08-02 confirms both losers return direct 301s to the winner with query strings intact, and the live sitemap excludes both losers. The search-index synchronization updated the winner and unpublished the two stale loser rows.

Verification passes: both old routes return 301 with their query strings intact, the winner returns 200, FAQ JSON-LD parses with five questions, the Svelte autofixer reports no change for the touched component, `git diff --check` passes, the audit remains at zero orphaned published posts, and the production build plus asset-budget ratchets pass.

## Rank 6 outcome: communication consolidation

The second completed Rank 6 cluster consolidates three overlapping communication articles into `/enneagram-corner/relationship-communication-guide`. The winner now carries three situation-specific scripts and an avoid-list for each of the nine types. The three source articles are unpublished and each returns a direct 301 to the winner while preserving query strings.

The link migration repoints 99 old communication-URL references across 80 source files. It also converts all five legacy Enneagram aliases from temporary to permanent redirects, with communication aliases routed directly to the final winner to avoid chains. Production verification on 2026-08-02 confirms the sitemap contains 660 URLs and includes only the communication winner. The live search-index sync updated the anxiety and communication winners, unpublished all five loser rows, skipped 152 unchanged rows, and reported zero errors; a post-sync dry run is clean.

Verification passes: the winner returns 200, all six tested communication loser/alias routes return direct 301s, query strings survive, FAQ JSON-LD parses with ten questions, the published corpus remains at zero orphans, `git diff --check` passes, and the production build plus asset-budget ratchets pass. Compatibility was deliberately skipped because `T-05` failed its mandatory source-verification gate; no compatibility content or redirect changed. Teams is therefore the next actionable consolidation cluster.

## Rank 7 outcome: full crawled-not-indexed classification

The fresh 2026-08-02 Page Indexing snapshot improved to 492 indexed and 687 not indexed. The “Crawled - currently not indexed” bucket fell from 256 to 230 URLs. All 230 exported examples were checked against their current HTTP response, canonical, robots directive, sitemap membership, crawl date, and the 90-day GSC performance export.

The result is 106 low-demand/weak-signal URLs, 82 stale URLs that now redirect correctly, 20 recent URLs to recheck, 14 valuable-but-missed pages, four live URLs outside the sitemap, two intentional `noindex` category pages, one correct 404, and one correctly canonicalized tracking URL. The URL Inspection API confirms that the 14 valuable pages have no technical indexing blocker.

The first targeted fix aligns Drake's metadata with the actual “Drake personality type” query family and adds a direct Type 3w2 answer near the opening. The three reviewed fields were atomically synchronized and verified in the public HTML on 2026-08-02; protected publication fields and the existing `lastmod` were preserved. Existing contextual-link coverage was verified before acting: the tech-leadership and red-flags pages already have multiple links, while object relations received its first contextual link in the current release. Those pages will be allowed to recrawl before more changes.

The complete evidence and treatment matrix is recorded in `docs/seo/gsc-crawled-not-indexed-classification-2026-08-02.md`.

## Deletion and pruning gate

A URL is eligible for deletion, `noindex`, or consolidation only after all relevant checks below are recorded:

- publication age and time actually available to rank;
- index status and canonical selected by Google;
- 90-day and, when available, longer-term impressions/clicks;
- query relevance and search demand;
- backlinks or meaningful external citations;
- conversions, assisted journeys, and non-search utility;
- body quality, factual safety, and unique first-party value;
- overlap with a stronger URL;
- a relevant redirect target, if one exists.

Possible outcomes:

- **Keep:** useful, unique, or intentionally non-search content.
- **Refresh:** relevant impressions, weak CTR/rank, or correctable quality gaps.
- **Consolidate:** substantially overlapping intent with a stronger winner.
- **Noindex, follow:** useful navigation/category surface that is not independently search-worthy.
- **404/410:** obsolete content with no relevant replacement.

## Already completed or intentionally excluded

- The fabricated-citation science page was rewritten and republished under `T-01`; do not treat its historical GSC window as the performance of the replacement.
- Thin question categories without substantive reviewed intros now use `noindex, follow` and are excluded from the sitemap.
- Malformed personality slugs and the identified legacy redirects were addressed in the July GSC indexing work.
- Do not use the LinkedIn article's `<500 impressions` rule or its crawl-budget explanation as a 9takes decision rule.

## Source documents

- `docs/data/gsc/latest.json`
- `docs/seo/gsc-indexing-audit-2026-07-19.md`
- `docs/content-analysis/2026-07-15_enneagram-blog-audit.md`
- `docs/taskers/T-04-astrology-enneagram-ctr-fix.md`
- `docs/taskers/T-07-merge-and-301-consolidation-plan.md`
- `docs/taskers/T-10-quality-feedback-comment-leak-88-files.md`
- `scripts/audit-orphan-blogs.mjs`
- `scripts/analyze-people-corpus.mjs`
