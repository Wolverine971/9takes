<!-- docs/seo/2026-08-13-free-seo-execution-roadmap.md -->

# 9takes Free SEO Execution Roadmap

**Owner:** DJ  
**Created:** 2026-08-13  
**Constraint:** Use existing free access only. Do not buy subscriptions, start trials, or add paid services.  
**Primary data:** Google Search Console, verified Ahrefs Webmaster Tools project, the 9takes repository, and existing analytics.

## Executive decision

9takes does not need another paid SEO suite right now. Ahrefs already reports a 100 Health Score, while Google Search Console shows the larger opportunity: many submitted pages are not indexed, contextual internal links are underused, desktop layout shift affects the primary template, and a small set of proven pages has either accelerated or declined.

The sequence is therefore:

1. Recover valuable excluded pages and clean the sitemap.
2. Fix the sitewide desktop CLS issue.
3. Add high-value contextual internal links.
4. Improve the compatibility page with the one free monthly Ahrefs content brief, subject to the existing evidence gate.
5. Protect rising pages and refresh verified declines.
6. Monitor backlinks without reacting to spam-inflated Ahrefs totals.

Do not spend time chasing a higher Ahrefs Health Score, submitting every URL blindly, buying links, or disavowing domains merely because Ahrefs labels them as spam.

## Baseline snapshot

Captured from authenticated Ahrefs and Google Search Console on 2026-08-13.

| Area                             |                                                                           Baseline | Interpretation                                           |
| -------------------------------- | ---------------------------------------------------------------------------------: | -------------------------------------------------------- |
| GSC, last 28 days                |                                                      1.3K clicks, 146K impressions | Clicks up 32 percent and impressions up 11 percent       |
| GSC submitted sitemap            |                                                       462 indexed, 198 not indexed | The largest technical-content opportunity                |
| Submitted exclusions             |                               120 crawled, not indexed; 59 discovered, not indexed | 179 indexable candidates need triage                     |
| Submitted intentional exclusions |                                      15 noindex, 3 soft 404, 1 alternate canonical | Sitemap cleanup candidates                               |
| Core Web Vitals                  |                                     Mobile good; 187 desktop URLs need improvement | One CLS template group, measured at 0.14                 |
| Ahrefs Site Audit                |                              Health Score 100; 0 errors; 275 warnings; 387 notices | Warnings need prioritization, not blanket cleanup        |
| Ahrefs organic visibility        |                                          200 keywords; estimated 307 visits; DR 19 | Directional competitor data, not canonical traffic       |
| Backlinks                        |                           524 backlinks from 468 domains; only 51 dofollow domains | Totals are heavily inflated by spam and nofollow sources |
| AI visibility                    | Citations reported across Google, ChatGPT, Perplexity, Copilot, Gemini, and others | Counts are useful; detailed Ahrefs records are paywalled |

## Workstreams

| Priority | Tasker                                                                                           | Outcome                                                                                   | Dependency                                                | Initial success measure                                                     |
| -------: | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------- |
|        1 | [T-23: Indexation recovery](../taskers/T-23-seo-indexation-recovery.md)                          | A scored decision for every submitted excluded URL, plus safe sitemap and content fixes   | None                                                      | Every one of the 179 candidates classified; first high-value batch improved |
|        2 | [T-24: Desktop CLS](../taskers/T-24-desktop-cls-template-fix.md)                                 | Identify and fix the shared layout shift affecting 187 desktop URLs                       | Can run beside T-23                                       | Local reproduction and stable layout; GSC validation only after deployment  |
|        3 | [T-25: Contextual internal links](../taskers/T-25-contextual-internal-link-sprint.md)            | Add editorially useful links to Type 5, compatibility, and other near-win pages           | Use T-23 decisions to avoid linking to removal candidates | First bounded batch shipped with no broken links                            |
|        4 | [T-26: Compatibility content opportunity](../taskers/T-26-compatibility-content-helper-brief.md) | Turn the free Ahrefs brief and GSC demand into an evidence-safe compatibility improvement | Must honor T-05's source gate                             | Approved brief, then a bounded page improvement if evidence permits         |
|        5 | [T-27: Winners and declines](../taskers/T-27-seo-winners-and-declines-refresh.md)                | Protect breakout pages and refresh only declines confirmed by GSC                         | Prefer fresh GSC export                                   | A ranked queue and first low-risk refresh batch                             |
|        6 | [T-28: Backlink hygiene](../taskers/T-28-backlink-hygiene-and-monitoring.md)                     | Separate real authority from spam and define a no-cost monitoring routine                 | None                                                      | Baseline of legitimate links and actionable lost-link opportunities         |

## Active Codex tasks

All six workstreams were started in isolated worktrees on 2026-08-13.

| Workstream                  | Task ID                                | Initial state |
| --------------------------- | -------------------------------------- | ------------- |
| Indexation recovery         | `019ffc07-dced-73d0-9ad3-8d9a5fe89335` | Active        |
| Desktop CLS fix             | `019ffc07-dcf3-7f51-923b-5a1ba37db2ca` | Active        |
| Contextual internal links   | `019ffc07-dcf4-75b1-870d-e978b9202853` | Active        |
| Compatibility content brief | `019ffc07-dcf2-7f32-b997-4a94b101657e` | Active        |
| Winners and declines        | `019ffc07-dcf4-75b1-870d-e954f8d22aaf` | Active        |
| Backlink hygiene            | `019ffc07-dcf2-7f32-b997-4a7c1e2173c7` | Active        |

## Shared operating rules

- Google Search Console is the source of truth for Google clicks, impressions, queries, index status, and measured trend direction.
- Ahrefs is used for competitor discovery, backlink exploration, keyword context, internal-link suggestions, and technical crawling.
- Ahrefs traffic numbers are estimates. Never overwrite a GSC conclusion with an Ahrefs estimate.
- Refresh data before making a destructive content decision. A page absent from Ahrefs is not proof that Google has no demand for it.
- Never modify `lastmod` frontmatter. DJ manages it manually.
- Do not change slugs, canonical tags, redirects, publication state, or sitemap inclusion without recording the exact reason and checking inbound links.
- `enneagram-and-mental-illness` is frozen. It may absorb other pages, but it may not be absorbed, retitled, or reslugged.
- Do not use unsupported claims or the withdrawn 457-couple compatibility data. Read T-05 before compatibility work.
- Do not buy links, start paid trials, subscribe to another SEO suite, or consume a paid API.
- Preserve unrelated working-tree changes. Never stash, bulk reset, or run a wide rewrite.

## Free tool stack

| Tool                              | Best use now                                                                                          | Avoid                                                                 |
| --------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Google Search Console             | Query and page mining, indexation, trend validation, CWV, links                                       | Treating URL submission as a substitute for content quality           |
| Ahrefs Webmaster Tools            | Site Audit, Site Explorer, competitors, internal-link opportunities, monthly AI Content Helper credit | Paid Rank Tracker, Content Gap, Brand Radar details, or plan upgrades |
| Repository scripts and sitemap    | Reproducible URL inventory, metadata checks, link checks, content analysis                            | Editing generated artifacts without locating their source             |
| PageSpeed Insights and Lighthouse | Diagnose CLS and template behavior                                                                    | Optimizing a lab score without confirming the visible cause           |
| Bing Webmaster Tools and IndexNow | Optional discovery support after sitemap quality is fixed                                             | Submitting low-value or intentionally excluded URLs                   |
| PostHog and current analytics     | User behavior and conversion checks on landing pages                                                  | Replacing GSC for organic search measurement                          |

## Sequence and coordination

T-23 owns URL disposition. T-25 must not add links to pages T-23 recommends merging, removing, or keeping excluded. T-26 must read T-05 and cannot reintroduce unsupported compatibility claims. T-27 should use a fresh GSC window and coordinate with T-23 before refreshing excluded pages. T-24 is the cleanest independent implementation lane and can run immediately beside the indexation audit. T-28 is read-only unless it identifies a specific legitimate link that can be recovered through an on-site fix.

## 30-day scorecard

Measure progress with outcomes, not issue counts:

- Percent of the 179 submitted excluded candidates classified.
- Number of high-value excluded pages improved, merged, or deliberately removed from the sitemap.
- Desktop CLS at or below 0.1 for the affected template group after Google remeasurement.
- Contextual internal links added to approved targets, with source relevance checked manually.
- Click and impression movement for Type 5, compatibility, and the first refresh cohort.
- Count of legitimate referring domains and recoverable lost links, excluding obvious spam.
- No purchases, trials, paid APIs, or link schemes.

## Decisions reserved for DJ

The task owners may diagnose and implement reversible, evidence-backed fixes. DJ must approve publication-state changes, large-scale merges, slug changes, use of unsupported or sensitive claims, outreach to external site owners, any disavow submission, and any purchase or trial.
