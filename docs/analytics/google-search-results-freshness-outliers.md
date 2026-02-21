<!-- docs/analytics/google-search-results-freshness-outliers.md -->

# Google Search Outlier Analysis (Freshness + Performance)

Source: `google-search-results-last-3-months.md`
Generated: 2026-02-19

## Method

- Cutoffs based on local date: fresh (<90 days) = lastmod >= 2025-11-21; stale (>=180 days) = lastmod < 2025-08-23.
- Matched by exact `loc` URL from draft frontmatter against the full 3-month Search table.
- Outlier criteria are intentionally strict to surface the biggest return-on-refresh candidates.

## Snapshot

- Matched performance rows with draft metadata: **145**.
- 3-month impressions represented by matched rows: **267,498**.
- Stale (>=180 days): **8** with **12,864** impressions.
- Medium freshness (90-180 days): **1** with **357** impressions.
- Fresh (<90 days): **136** with **254,277** impressions.

### Outlier A — >=1200 impressions, 0 clicks, stale >=180 days

| #        | URL | Lastmod | Freshness | Impressions | Clicks | CTR | Recommendation |
| -------- | --- | ------- | --------- | ----------: | -----: | --: | -------------- |
| _(none)_ |     |         |           |             |        |     |                |

### Outlier B — >=1200 impressions, CTR < 0.30%, stale >=180 days

| #        | URL | Lastmod | Freshness | Impressions | Clicks | CTR | Recommendation |
| -------- | --- | ------- | --------- | ----------: | -----: | --: | -------------- |
| _(none)_ |     |         |           |             |        |     |                |

### Outlier C — >=2500 impressions, CTR < 0.30%, updated <90 days

| #   | URL                                                       | Lastmod    | Freshness | Impressions | Clicks |   CTR | Recommendation                                                                      |
| --- | --------------------------------------------------------- | ---------- | --------- | ----------: | -----: | ----: | ----------------------------------------------------------------------------------- |
| 1   | https://9takes.com/personality-analysis/Elon-Musk         | 2026-02-18 | <90 days  |      64,748 |     52 | 0.08% | Already edited recently; likely snippet and meta mismatch still suppressing clicks. |
| 2   | https://9takes.com/personality-analysis/Emma-Watson       | 2026-01-29 | <90 days  |      13,638 |     35 | 0.26% | Already edited recently; likely snippet and meta mismatch still suppressing clicks. |
| 3   | https://9takes.com/personality-analysis/IShowSpeed        | 2026-02-19 | <90 days  |      13,439 |     26 | 0.19% | Already edited recently; likely snippet and meta mismatch still suppressing clicks. |
| 4   | https://9takes.com/personality-analysis/Palmer-Luckey     | 2025-12-05 | <90 days  |      11,011 |     12 | 0.11% | Already edited recently; likely snippet and meta mismatch still suppressing clicks. |
| 5   | https://9takes.com/personality-analysis/Sabrina-Carpenter | 2026-02-06 | <90 days  |       7,705 |     14 | 0.18% | Already edited recently; likely snippet and meta mismatch still suppressing clicks. |
| 6   | https://9takes.com/personality-analysis/Aubrey-Plaza      | 2026-02-17 | <90 days  |       5,644 |      8 | 0.14% | Already edited recently; likely snippet and meta mismatch still suppressing clicks. |
| 7   | https://9takes.com/personality-analysis/Jeff-Bezos        | 2026-01-18 | <90 days  |       5,219 |      5 | 0.10% | Already edited recently; likely snippet and meta mismatch still suppressing clicks. |
| 8   | https://9takes.com/personality-analysis/Kevin-Hart        | 2026-01-23 | <90 days  |       5,080 |     10 | 0.20% | Already edited recently; likely snippet and meta mismatch still suppressing clicks. |
| 9   | https://9takes.com/personality-analysis/Olivia-Rodrigo    | 2025-12-21 | <90 days  |       2,884 |      5 | 0.17% | Already edited recently; likely snippet and meta mismatch still suppressing clicks. |
| 10  | https://9takes.com/personality-analysis/Kylie-Jenner      | 2026-02-17 | <90 days  |       2,624 |      5 | 0.19% | Already edited recently; likely snippet and meta mismatch still suppressing clicks. |
| 11  | https://9takes.com/personality-analysis/Johnny-Depp       | 2026-02-19 | <90 days  |       2,610 |      1 | 0.04% | Already edited recently; likely snippet and meta mismatch still suppressing clicks. |
| 12  | https://9takes.com/personality-analysis/Kim-Kardashian    | 2026-02-10 | <90 days  |       2,582 |      6 | 0.23% | Already edited recently; likely snippet and meta mismatch still suppressing clicks. |

### Outlier D — stale maintenance priority (impressions >= 3000, stale >=180 days)

| #   | URL                                                              | Lastmod    | Impressions | Clicks |   CTR | Recommendation                                              |
| --- | ---------------------------------------------------------------- | ---------- | ----------: | -----: | ----: | ----------------------------------------------------------- |
| 1   | https://9takes.com/enneagram-corner/enneagram-and-mental-illness | 2024-04-01 |      12,235 |    493 | 4.03% | Refresh for topical freshness, sources, and intent mapping. |

### Stale backlog (all >=180 days)

| #   | URL                                                                               | Lastmod    | Impressions | Clicks |   CTR | Suggestion                                                                          |
| --- | --------------------------------------------------------------------------------- | ---------- | ----------: | -----: | ----: | ----------------------------------------------------------------------------------- |
| 1   | https://9takes.com/enneagram-corner/enneagram-and-mental-illness                  | 2024-04-01 |      12,235 |    493 | 4.03% | Rework sections around current query intent + update intro and supporting examples. |
| 2   | https://9takes.com/personality-analysis/Leila-Hormozi                             | 2025-01-06 |         144 |      0 | 0.00% | Quick refresh: updated date, intro sentence, stronger lead, and internal links.     |
| 3   | https://9takes.com/personality-analysis/xQc                                       | 2025-01-07 |         135 |      0 | 0.00% | Quick refresh: updated date, intro sentence, stronger lead, and internal links.     |
| 4   | https://9takes.com/how-to-guides/definitive-guide-to-relationship-conflict-part-1 | 2023-08-25 |         130 |      0 | 0.00% | Quick refresh: updated date, intro sentence, stronger lead, and internal links.     |
| 5   | https://9takes.com/enneagram-corner/anxiety-and-enneagram-types-guide             | 2024-03-28 |          89 |      0 | 0.00% | Quick refresh: updated date, intro sentence, stronger lead, and internal links.     |
| 6   | https://9takes.com/personality-analysis/Paul-Rudd                                 | 2025-01-23 |          73 |      0 | 0.00% | Quick refresh: updated date, intro sentence, stronger lead, and internal links.     |
| 7   | https://9takes.com/community                                                      | 2024-04-05 |          39 |      0 | 0.00% | Quick refresh: updated date, intro sentence, stronger lead, and internal links.     |
| 8   | https://9takes.com/personality-analysis/Andrew-Schulz                             | 2025-01-07 |          19 |      0 | 0.00% | Quick refresh: updated date, intro sentence, stronger lead, and internal links.     |

### Drafts not in the 3-month full-page rows

Potentially low-traffic or indexation-gap candidates; verify sitemap/canonical/indexing before editing.
| # | URL | Lastmod | Freshness | Note |
|---|---|---|---|---|
| 1 | https://9takes.com/personality-analysis/Chamath-Palihapitiya | 2026-01-21 | <90 days | check canonical, sitemap, indexation |
| 2 | https://9takes.com/personality-analysis/Chris-Williamson | 2026-02-10 | <90 days | check canonical, sitemap, indexation |
| 3 | https://9takes.com/community/mind-change-series-roadmap | 2026-02-17 | <90 days | check canonical, sitemap, indexation |
| 4 | https://9takes.com/community/the-9takes-bridge-protocol | 2026-02-17 | <90 days | check canonical, sitemap, indexation |
| 5 | https://9takes.com/personality-analysis/JD-Vance | 2026-02-17 | <90 days | check canonical, sitemap, indexation |
| 6 | https://9takes.com/personality-analysis/Keke-Palmer | 2026-02-17 | <90 days | check canonical, sitemap, indexation |
| 7 | https://9takes.com/personality-analysis/Sam-Parr | 2026-02-17 | <90 days | check canonical, sitemap, indexation |
| 8 | https://9takes.com/personality-analysis/Shaan-Puri | 2026-02-17 | <90 days | check canonical, sitemap, indexation |
| 9 | https://9takes.com/personality-analysis/Charli-xcx | 2026-02-18 | <90 days | check canonical, sitemap, indexation |
| 10 | https://9takes.com/personality-analysis/Satya-Nadella | 2026-02-18 | <90 days | check canonical, sitemap, indexation |
| 11 | https://9takes.com/personality-analysis/Tara-Yummy | 2026-02-18 | <90 days | check canonical, sitemap, indexation |
| 12 | https://9takes.com/personality-analysis/Zohran-Mamdani | 2026-02-18 | <90 days | check canonical, sitemap, indexation |
| 13 | https://9takes.com/community/first-principles | 2023-02-10 | >=180 days | check canonical, sitemap, indexation |
| 14 | https://9takes.com/enneagram-corner/hijacking | 2023-03-26 | >=180 days | check canonical, sitemap, indexation |
| 15 | https://9takes.com/enneagram-corner/how-to-communicate | 2023-03-26 | >=180 days | check canonical, sitemap, indexation |
| 16 | https://9takes.com/enneagram-corner/psychology | 2023-03-26 | >=180 days | check canonical, sitemap, indexation |
| 17 | https://9takes.com/community/Dalio-Principles | 2023-04-23 | >=180 days | check canonical, sitemap, indexation |
| 18 | https://9takes.com/community/three-sided-die | 2023-04-23 | >=180 days | check canonical, sitemap, indexation |
| 19 | https://9takes.com/community/2d-or-3d-world | 2023-05-13 | >=180 days | check canonical, sitemap, indexation |
| 20 | https://9takes.com/community/Aristotle-and-Plato | 2023-06-17 | >=180 days | check canonical, sitemap, indexation |
| 21 | https://9takes.com/community/personality-is-the-catch-all | 2023-08-06 | >=180 days | check canonical, sitemap, indexation |
| 22 | https://9takes.com/community/hidden-truths | 2023-08-27 | >=180 days | check canonical, sitemap, indexation |
| 23 | https://9takes.com/enneagram-corner/how-to-crowdsource-solutions-to-conflict | 2023-08-27 | >=180 days | check canonical, sitemap, indexation |
| 24 | https://9takes.com/how-to-guides/how-to-get-along-with-your-relatives | 2023-12-16 | >=180 days | check canonical, sitemap, indexation |
| 25 | https://9takes.com/how-to-guides/guide-to-active-listening | 2024-03-09 | >=180 days | check canonical, sitemap, indexation |
| 26 | https://9takes.com/community/introducing-9takes-original | 2024-03-28 | >=180 days | check canonical, sitemap, indexation |
| 27 | https://9takes.com/community/where-to-go-for-questions | 2024-04-05 | >=180 days | check canonical, sitemap, indexation |
| 28 | https://9takes.com/how-to-guides/finding-the-right-words | 2024-04-24 | >=180 days | check canonical, sitemap, indexation |
| 29 | https://9takes.com/enneagram-corner/name-the-emotion | 2024-05-02 | >=180 days | check canonical, sitemap, indexation |
| 30 | https://9takes.com/how-to-guides/the-crash-course-on-emotions-that-we-missed-in-kindergarden | 2024-06-11 | >=180 days | check canonical, sitemap, indexation |
| 31 | https://9takes.com/personality-analysis/Tyler-The-Creator | 2025-01-07 | >=180 days | check canonical, sitemap, indexation |
| 32 | https://9takes.com/personality-analysis/Krystal-Ball | 2025-01-20 | >=180 days | check canonical, sitemap, indexation |
| 33 | https://9takes.com/personality-analysis/Saagar-Enjeti | 2025-01-20 | >=180 days | check canonical, sitemap, indexation |
| 34 | https://9takes.com/enneagram-corner/high-achievers-playbook-mastering-self-awareness | 2025-03-27 | >=180 days | check canonical, sitemap, indexation |
| 35 | https://9takes.com/guides/how-to-psychoanalyze-a-person | 2025-03-27 | >=180 days | check canonical, sitemap, indexation |
| 36 | https://9takes.com/enneagram-corner/enneagram-personality-test | 2025-05-22 | >=180 days | check canonical, sitemap, indexation |
| 37 | https://9takes.com/community/manifesto | 2025-06-05 | >=180 days | check canonical, sitemap, indexation |

## Prioritized action plan (next 10)

| #   | Priority | URL                                                              | Freshness  | Lastmod    | Why now                       | Suggested update                                                   |
| --- | -------- | ---------------------------------------------------------------- | ---------- | ---------- | ----------------------------- | ------------------------------------------------------------------ |
| 1   | P4       | https://9takes.com/personality-analysis/Elon-Musk                | <90 days   | 2026-02-18 | Recently updated but weak CTR | Title/meta A/B and description + FAQ tune                          |
| 2   | P1       | https://9takes.com/enneagram-corner/enneagram-and-mental-illness | >=180 days | 2024-04-01 | High-volume stale page        | Full rewrite pass (top intent sections + schema + recency updates) |
| 3   | P4       | https://9takes.com/personality-analysis/Emma-Watson              | <90 days   | 2026-01-29 | Recently updated but weak CTR | Title/meta A/B and description + FAQ tune                          |
| 4   | P4       | https://9takes.com/personality-analysis/IShowSpeed               | <90 days   | 2026-02-19 | Recently updated but weak CTR | Title/meta A/B and description + FAQ tune                          |
| 5   | P4       | https://9takes.com/personality-analysis/Palmer-Luckey            | <90 days   | 2025-12-05 | Recently updated but weak CTR | Title/meta A/B and description + FAQ tune                          |
| 6   | P4       | https://9takes.com/personality-analysis/Sabrina-Carpenter        | <90 days   | 2026-02-06 | Recently updated but weak CTR | Title/meta A/B and description + FAQ tune                          |
| 7   | P4       | https://9takes.com/personality-analysis/Aubrey-Plaza             | <90 days   | 2026-02-17 | Recently updated but weak CTR | Title/meta A/B and description + FAQ tune                          |
| 8   | P4       | https://9takes.com/personality-analysis/Jeff-Bezos               | <90 days   | 2026-01-18 | Recently updated but weak CTR | Title/meta A/B and description + FAQ tune                          |
| 9   | P4       | https://9takes.com/personality-analysis/Kevin-Hart               | <90 days   | 2026-01-23 | Recently updated but weak CTR | Title/meta A/B and description + FAQ tune                          |
| 10  | P4       | https://9takes.com/personality-analysis/Olivia-Rodrigo           | <90 days   | 2025-12-21 | Recently updated but weak CTR | Title/meta A/B and description + FAQ tune                          |
