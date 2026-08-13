<!-- docs/taskers/T-27-seo-winners-and-declines-refresh.md -->

# Tasker: Protect SEO Winners and Refresh Verified Declines

**For:** Search analytics and content-refresh agent  
**Owner:** DJ  
**Created:** 2026-08-13  
**Status:** Ready  
**Related:** `docs/seo/2026-08-13-free-seo-execution-roadmap.md`, `scripts/fetch-gsc-data.mjs`, `docs/taskers/T-09-refresh-gsc-data-window.md`, current content audit taskers

## 0. What and why

Recent GSC Insights shows real growth, but it is concentrated. In the last 28-day comparison, Jordi Hays gained 115 clicks, Shawn Ryan gained 22, the Kardashian family analysis gained 14, toxic traits gained 12, and the personality-analysis hub gained 9. Declines include mental illness, the neurodivergence guide, the compatibility matrix, the Type 9 article, and the Type 9 famous-people hub.

Ahrefs also estimates declines across several public-figure and hub pages, but those estimates must be verified in GSC before any edit. The job is to protect what is working, diagnose true declines, and refresh only pages where a specific search or content problem is supported by evidence.

## 1. Required reading

1. `CLAUDE.md`
2. `docs/taskers/README.md`
3. `docs/seo/2026-08-13-free-seo-execution-roadmap.md`
4. `docs/taskers/T-09-refresh-gsc-data-window.md`
5. Current GSC analytics reports and fetch script
6. Existing taskers for any candidate page, especially T-04, T-05, T-13, T-15, T-16 batch material, and T-18
7. Current source and recent git history for each page selected for action

Run `git status --short` first. Never modify `lastmod` frontmatter. The `enneagram-and-mental-illness` page is frozen: it may absorb other pages, but it may not be absorbed, retitled, or reslugged.

## 2. Refresh the measurement window

Use fresh GSC data and compare at least:

- last 28 days versus previous 28 days;
- a longer clean window that avoids known URL-change contamination; and
- query-level and country or device changes where they explain the movement.

Separate demand changes from rank, CTR, cannibalization, indexing, and snippet changes. Do not call a page a decline based only on clicks if impressions collapsed because the topic cooled. Do not call a page a winner based on one anomalous branded query.

## 3. Create two queues

### Protect queue

For rising pages, record the winning queries, landing-page promise, link sources, snippet, and any recent edit that may explain the gain. Identify what must not be disturbed. Start with Jordi Hays and Shawn Ryan.

### Refresh queue

For declining pages, diagnose one primary cause and assign an action: no change, internal links, snippet alignment, freshness and evidence update, consolidation review, technical fix, or deeper rewrite. Coordinate indexation cases with T-23 and compatibility with T-26.

The frozen mental-illness page may receive a carefully evidenced additive fix, but no retitle, reslug, absorption, or broad rewrite is authorized.

## 4. Implement a low-risk first batch

Select a small number of pages with clear diagnoses and no conflicting active tasker. Preserve high-performing titles and openings unless query evidence directly supports a change. Source-check any current-event or biographical update. Do not perform a mechanical freshness rewrite.

## Verification checklist

- [ ] Every selected trend is confirmed in fresh GSC data.
- [ ] Winners have an explicit preservation note before edits elsewhere can affect them.
- [ ] Every refresh maps to a diagnosed cause and target query or user need.
- [ ] Existing tasker gates and the frozen-page rule are respected.
- [ ] Factual additions are source-checked.
- [ ] Relevant content and build checks pass, with no `lastmod` change.

## Deliverable

Create `docs/seo/2026-08-13-winners-and-declines-refresh.md` with the fresh comparison, protect queue, refresh queue, cannibalization notes, first-batch changes, and a 28-day measurement plan.

## Risks and gotchas

GSC Insights groups some queries and uses comparison windows that can exaggerate low-volume percentages. Ahrefs estimates are useful for discovery only. Editing a rising page can destroy a win that is not yet understood. News-driven public-figure demand can fade without any page defect.

## Definition of done

The growth and decline signals are verified, winners have preservation guidance, a small evidence-backed refresh batch is complete, and ambiguous or high-risk pages are left as explicit decisions rather than speculative edits.
