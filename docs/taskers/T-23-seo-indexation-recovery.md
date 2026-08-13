<!-- docs/taskers/T-23-seo-indexation-recovery.md -->

# Tasker: Recover Valuable Submitted Pages From Google Index Exclusions

**For:** Technical SEO and content-quality agent  
**Owner:** DJ  
**Created:** 2026-08-13  
**Status:** Ready  
**Related:** `docs/seo/2026-08-13-free-seo-execution-roadmap.md`, `scripts/fetch-gsc-data.mjs`, `static/sitemap.xml`, `docs/taskers/T-07-merge-and-301-consolidation-plan.md`, `docs/taskers/T-09-refresh-gsc-data-window.md`

## 0. What and why

Google Search Console reports 660 processed URLs from `https://9takes.com/sitemap.xml`: 462 indexed and 198 not indexed. The submitted exclusion set includes 120 crawled-currently-not-indexed URLs, 59 discovered-currently-not-indexed URLs, 15 noindex URLs, 3 soft 404s, and 1 alternate canonical.

The goal is not to force all 198 URLs into Google. The goal is to decide which pages deserve indexing, improve the valuable ones, consolidate duplication safely, and stop submitting pages that are intentionally excluded or too weak to earn indexing.

This workstream owns URL disposition. Other SEO tasks must defer to its keep, improve, merge, and remove decisions.

## 1. Required reading

1. `CLAUDE.md`
2. `docs/taskers/README.md`
3. `docs/seo/2026-08-13-free-seo-execution-roadmap.md`
4. `docs/taskers/T-07-merge-and-301-consolidation-plan.md`
5. `docs/taskers/T-09-refresh-gsc-data-window.md`
6. Current sitemap-generation code and `static/sitemap.xml`
7. Current GSC fetch script, its newest data output, and any existing indexing reports
8. Representative source files from every affected route family

Run `git status --short` first. Do not touch unrelated changes. Never modify `lastmod` frontmatter.

## 2. Refresh and reconcile the inventory

Pull the freshest available GSC data through the existing authenticated path. If the API cannot expose page-indexing examples, use the authenticated GSC interface to export or record the complete submitted exclusion lists. Do not invent the remaining URLs from the examples already known.

Join each submitted URL to:

- route family and source file;
- publication, canonical, robots, and sitemap state;
- GSC clicks, impressions, queries, average position, and recent trend;
- internal inlinks and depth;
- content length and obvious duplication or template thinness;
- inbound external links if available; and
- a clearly stated indexing reason and last crawl state.

Reconcile the difference between the 660 URLs processed by GSC and the current generated sitemap count. Record timing differences rather than forcing totals to match.

## 3. Score and classify every candidate

Assign exactly one action to every submitted excluded URL:

1. **Improve and keep submitted:** real demand or strategic value, distinct intent, and a credible path to index quality.
2. **Keep and monitor:** valid page, no immediate change justified.
3. **Merge with salvage:** overlapping intent where useful content must move before redirect or removal.
4. **Remove from sitemap, keep accessible:** page is intentionally noindex or not a search landing page.
5. **Fix technical state:** soft 404, canonical mismatch, accidental noindex, broken internal discovery, or another concrete defect.
6. **Retire candidate, DJ approval required:** no distinct value and no defensible consolidation target.

Weight real GSC demand and page distinctiveness above word count. Do not classify by Ahrefs traffic alone. Do not recommend indexing every community or utility page.

## 4. Implement only the first safe batch

After the inventory and rankings are clear, implement a bounded first batch of high-confidence, reversible fixes. Good candidates include accidental sitemap inclusion of intentional noindex pages, missing internal discovery for strong pages, metadata or thin-introduction improvements on pages with impressions, and confirmed soft-404 corrections.

Do not bulk publish, delete, merge, reslug, or redirect without the tasker's evidence and DJ's required approval. Do not submit mass validation requests before deployment.

## 5. Deliverables

Create:

- `docs/seo/2026-08-13-indexation-recovery-audit.md` with methodology, totals, prioritized findings, and exact decisions;
- a machine-readable CSV under `docs/seo/data/` with one row per submitted excluded URL;
- a first-batch change log, if code or content fixes are made; and
- a follow-up measurement plan with a comparison date.

## Verification checklist

- [ ] Every submitted excluded URL in the refreshed source is represented exactly once.
- [ ] Inventory totals reconcile to the source export, with timing differences documented.
- [ ] Every merge or retirement suggestion names a target and preservation plan.
- [ ] No frozen page, `lastmod`, or unrelated work is changed.
- [ ] Sitemap generation completes and contains no accidental duplicate URLs.
- [ ] Project checks relevant to any edited source pass.
- [ ] The report separates implemented fixes from DJ-gated recommendations.

## Risks and gotchas

GSC examples can be sampled or delayed. Ahrefs traffic is estimated. A discovered-not-indexed page may simply be low priority for Google, while a crawled-not-indexed page may have weak distinctiveness. URL Inspection and validation requests are not substitutes for improving the page. Preserve useful content before any consolidation.

## Definition of done

The complete submitted exclusion inventory is reproducible and classified, the first safe high-value batch is implemented and verified, and DJ has a short decision list for any destructive or editorially sensitive actions.
