<!-- docs/seo/2026-08-13-indexation-recovery-audit.md -->
# Indexation Recovery Audit

**Owner:** T-23 SEO indexation recovery  
**Audit date:** 2026-08-13  
**GSC indexing report last updated:** 2026-08-06  
**Search Analytics window:** 2026-05-05 through 2026-08-11  
**Disposition source of truth:** [`docs/seo/data/2026-08-13-indexation-recovery-inventory.csv`](data/2026-08-13-indexation-recovery-inventory.csv)

## Executive decision

The complete submitted exclusion inventory contains 198 unique URLs and reconciles exactly to the authenticated Google Search Console report. Every URL has one disposition. The audit does not support trying to force all 198 pages into the index.

The safe first batch is deliberately narrow: stop adding the browse-only `/questions/categories` index to future generated sitemaps while keeping the page accessible. The remaining 197 URLs are unchanged. No page was published, deleted, merged, reslugged, redirected, set to noindex, or submitted for validation.

Google's exclusion labels describe a delayed report, not the pages' current technical state. A fresh live sweep found all 198 URLs returning a final 200 response with a self-referencing canonical and `index, follow`. The work is therefore mostly content prioritization and submission hygiene, not a bulk technical repair.

## Reproducible methodology

1. Recorded the complete authenticated submitted exclusion lists from Google Search Console, not the sampled examples alone.
2. Refreshed repository Search Analytics through the existing authenticated script:

   ```sh
   node scripts/fetch-gsc-data.mjs --days 98
   ```

   This produced the 2026-08-13 query, page, and page-query CSVs and advanced `docs/data/gsc/latest.json`.

3. Captured current and previous 28-day page totals for trend classification:
   - current: 2026-07-15 through 2026-08-11
   - previous: 2026-06-17 through 2026-07-14
4. Joined each URL to its route family, repository source or production record, publication state, sitemap membership, internal discovery, rendered and source content size, GSC demand, top query, and available GSC link data.
5. Fetched every public candidate and recorded initial status, final status, redirect location, canonical, robots directive, and rendered text size.
6. Used read-only production queries for publication and category/question evidence. No private question text, email address, user identifier, or other sensitive record was exported to the deliverable.
7. Read representative source files from every affected route family and checked the prior merge plan, compatibility evidence gate, and prior content audit before assigning dispositions.
8. Assigned exactly one action and one priority to every URL. Demand and distinct search intent were weighted above raw word count.

The inventory carries the evidence needed to reproduce or challenge each row-level decision. `lastmod` frontmatter was not used as a quality signal and was not changed.

## Source reconciliation

| Source                                             | Count or date | Reconciliation                                                      |
| -------------------------------------------------- | ------------: | ------------------------------------------------------------------- |
| GSC sitemap discovered pages, last read 2026-08-12 |           660 | Search Console's processed snapshot                                 |
| GSC indexed pages, report updated 2026-08-06       |           462 | Delayed indexing-report state                                       |
| GSC submitted exclusions                           |           198 | Exactly represented once in the inventory                           |
| `static/sitemap.xml` at `HEAD`                     |           667 | Repository snapshot after the GSC read                              |
| Currently staged `static/sitemap.xml`              |           668 | Another workstream adds Bryan Johnson and changes Type 4 metadata   |
| Isolated generation after this batch               |           667 | Same current repository/data context, minus `/questions/categories` |

The 660 versus 667/668 difference is timing, not an inventory defect. GSC read the sitemap before the newest repository/content state. The existing staged sitemap belongs to another workstream, so this task did not overwrite or regenerate it.

## Complete totals

### GSC reason

| Submitted exclusion reason               |    URLs |
| ---------------------------------------- | ------: |
| Crawled - currently not indexed          |     120 |
| Discovered - currently not indexed       |      59 |
| Excluded by `noindex` tag                |      15 |
| Soft 404                                 |       3 |
| Alternate page with proper canonical tag |       1 |
| **Total**                                | **198** |

### Disposition

| Action                                 |    URLs | Implemented now |
| -------------------------------------- | ------: | --------------: |
| Improve and keep submitted             |      11 |               0 |
| Keep and monitor                       |     162 |               0 |
| Merge with salvage                     |       4 |     0, DJ-gated |
| Remove from sitemap, keep accessible   |      20 |               1 |
| Retire candidate, DJ approval required |       1 |     0, DJ-gated |
| Fix technical state                    |       0 |               0 |
| **Total**                              | **198** |           **1** |

### Priority

| Priority | URLs | Meaning                                                          |
| -------- | ---: | ---------------------------------------------------------------- |
| P0       |    2 | Immediate disposition decision or strongest recovery opportunity |
| P1       |   15 | Evidence-backed near-term work                                   |
| P2       |   19 | Low-value sitemap-removal candidates requiring a shared policy   |
| P3       |  162 | Valid pages with no justified immediate change                   |

## Prioritized findings

### 1. Historical GSC technical labels are stale

All 198 URLs are currently submitted, live 200, self-canonical, and `index, follow`. This includes all 15 historical noindex URLs, all 3 historical soft 404s, and the single historical alternate-canonical URL. Reintroducing technical changes solely to match old GSC labels would be counterproductive.

The right response is to wait for recrawl where an earlier fix is already live, improve only pages with credible demand and distinct intent, and stop submitting pages that are not intended to be search landing pages.

### 2. Improve queue: 11 distinct pages with demonstrated or strategic opportunity

These remain submitted and need a bounded editorial follow-up, not a URL-state change:

- `/enneagram-corner/twitter-x-personality-database-enneagram-type-discussions`
- `/pop-culture/alex-cooper-and-alix-earle-beef`
- `/personality-analysis/xqc`
- `/personality-analysis/Larry-Page`
- `/personality-analysis/Tara-Yummy`
- `/personality-analysis/Christian-Bale`
- `/personality-analysis/John-McAfee`
- `/personality-analysis/Chamath-Palihapitiya`
- `/personality-analysis/Trisha-Paytas`
- `/personality-analysis/Ali-Abdaal`
- `/enneagram-corner/enneagram-dating-guide-for-women`

The CSV records each page's 98-day GSC demand, recent trend, top query, internal discovery, and content evidence. Previously improved pages such as Drake, tech-titans leadership, object relations, and red flags remain in keep-and-monitor so recrawl can catch up before more editing.

### 3. Consolidation candidates have salvage requirements

No merge or redirect was implemented. The four merge recommendations are:

| Candidate                                                           | Proposed target                                           | Material to preserve                                                                                     | Gate                  |
| ------------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------- |
| `/enneagram-corner/enneagram-compatibility-guide`                   | `/enneagram-corner/enneagram-compatibility-matrix`        | Unique table/framework only after T-05 source verification; do not reuse the withdrawn 457-couple claims | DJ plus T-05 approval |
| `/enneagram-corner/enneagram-workplace-team-building`               | `/enneagram-corner/enneagram-types-working-in-teams`      | The useful idea that frustrating behaviors can reveal a team's missing perspective                       | DJ approval           |
| `/enneagram-corner/personality-maxing`                              | `/enneagram-corner/enneagram-personal-growth`             | Any distinct practical framework and the cluster's Type 8 confession before consolidation                | DJ approval           |
| `/enneagram-corner/why-therapy-doesnt-work-the-same-for-every-type` | `/enneagram-corner/mental-health/enneagram-therapy-guide` | Distinct therapy framing, with the T-07 sibling/redirect conflict resolved first                         | DJ decision           |

The retirement candidate `/enneagram-corner/enneagram-online-dating-guide` has a plausible destination at `/enneagram-corner/enneagram-dating-guide-for-men`, but T-07 leaves relocation versus consolidation unresolved. Preserve useful screen-dating advice before any action. DJ must decide.

### 4. Submission hygiene: one implemented hub and 19 DJ-gated question pages

`/questions/categories` is a browse utility rather than a distinct search landing page. It had no measured GSC demand or reported external links, and removing it from sitemap generation does not remove the live page or its internal navigation. This is the only implemented disposition.

Nineteen thin, time-bound, typo-heavy, or weakly answered question threads are also classified `Remove from sitemap, keep accessible`. They remain unchanged because applying the decision safely requires DJ to approve a reusable question-quality threshold rather than hard-coding a one-off URL blacklist. Filter the inventory to `action = Remove from sitemap, keep accessible` for the exact cohort.

### 5. External links do not override the decisions

The authenticated GSC links report currently exposes only 18 target pages and 48 total external links. No merge, retirement, or removal candidate showed a reported external link that would block its recommendation. This is a limited GSC snapshot, so inbound-link state must be checked again immediately before any approved redirect or retirement.

## T-25 internal-link coordination

The final disposition is **GO** for both primary targets:

- `https://9takes.com/personality-analysis/type/5`
- `https://9takes.com/enneagram-corner/enneagram-compatibility-matrix`

Neither URL is in the 198-candidate exclusion set. Both are in the sitemap and independently verified live 200, self-canonical, and `index, follow`. The compatibility matrix is also the proposed consolidation destination, not the deprecated candidate.

T-25 should not add new links to URLs whose inventory action is `Merge with salvage`, `Remove from sitemap, keep accessible`, or `Retire candidate, DJ approval required`. In particular, do not confuse `/enneagram-corner/enneagram-compatibility-guide` with the approved matrix target. The complete machine-readable no-link cohort is available by filtering those three actions in the inventory.

## Implemented first batch

The sitemap source no longer emits the static `/questions/categories` URL. The dynamic category pages under `/questions/categories/[slug]` are unaffected. A focused regression test protects this distinction.

The checked-in `static/sitemap.xml` was not regenerated because it already has unrelated staged changes. An isolated copy of the current repository was generated instead and verified at 667 unique URLs with no duplicate `<loc>` values and no `/questions/categories` entry. See the companion [first-batch change log](2026-08-13-indexation-recovery-first-batch.md).

## Follow-up measurement plan

### 2026-08-27 interim check

- Confirm the sitemap change has actually been deployed before interpreting Google state.
- Fetch the live sitemap and confirm `/questions/categories` is absent while all `/questions/categories/[slug]` pages remain present.
- Record GSC sitemap last-read date and discovered-page total; do not expect exact immediate parity with the repository.
- Inspect P0/P1 candidates for recrawl, index-state, impression, and top-query changes.
- Do not submit bulk validation requests.

### 2026-09-10 primary comparison

Run the same 28-day page and page-query extraction using the clean comparison window 2026-08-12 through 2026-09-08, allowing two days for GSC lag. Compare it with the baseline 2026-07-15 through 2026-08-11.

Measure:

- indexed versus submitted-excluded counts and reason migration;
- number of P0/P1 improve pages gaining impressions, queries, or index coverage;
- `/questions/categories` absence from the processed sitemap after deployment;
- Type 5 hub and compatibility-matrix impressions/clicks after T-25's three approved links;
- any newly reported external links before acting on merge or retirement candidates; and
- whether the 162 monitor pages have developed enough evidence to change disposition.

Reclassify only from fresh evidence. Keep destructive and editorially sensitive actions locked until the approvals below are recorded.

## Decisions reserved for DJ

1. Approve or reject the compatibility-guide consolidation after T-05 re-verifies any retained source material.
2. Approve or reject the workplace-team-building consolidation.
3. Approve or reject the personality-maxing/personal-growth cluster consolidation.
4. Resolve the therapy-guide conflict with T-07 before any merge, publication change, or redirect.
5. Choose relocation, consolidation, or continued publication for the online-dating guide.
6. Approve a reusable question-quality threshold before the 19 question pages are removed from sitemap submission.

Until those decisions are made, the affected pages remain live, canonical, indexable, and submitted.
