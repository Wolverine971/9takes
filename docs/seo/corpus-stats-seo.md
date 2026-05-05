<!-- docs/seo/corpus-stats-seo.md -->

# /corpus-stats SEO Upgrade

Living tracking doc for the SEO + structured-data work on `/corpus-stats`. The page is data-heavy, regenerated on every deploy, and a strong AI-citation target — the goal is to make every claim machine-readable, every section deep-linkable, and the social/SERP presentation match the depth of the data.

**Owner:** DJ
**Started:** 2026-05-05
**Source files:**

- `src/routes/corpus-stats/+page.svelte`
- `src/routes/corpus-stats/+page.server.ts` — JSON-LD lives here
- `src/routes/corpus-stats/+page.ts` — cache headers
- `src/routes/corpus-stats.json/+server.ts` — raw dataset endpoint
- `src/lib/components/marketing/CorpusStatsTable.svelte`
- `src/lib/components/marketing/CorpusStatsComparisonSection.svelte`
- `src/lib/data/corpus-stats.json` — auto-generated
- `src/lib/data/corpus-stats-external.json` — hand-curated comparison sources

## Hard Constraints

1. **Title and description must stay dynamic.** The corpus grows weekly. Anything that bakes a number into hardcoded copy is a bug. Bind everything to `corpusStats.totals.published` and `corpusStats.generated_at`.
2. The page is rendered as a `Dataset` for Google. Don't break that. Wrap, augment — don't replace.
3. The auto-generator (`scripts/generate-corpus-stats.js`) writes the JSON; nothing in this work changes that pipeline.

## Initial Assessment (2026-05-05)

### Already in place

- `Dataset` JSON-LD with `creator`, `publisher`, `dateModified`, `license` (CC BY 4.0), `keywords`, `variableMeasured`, `distribution` → `corpus-stats.json`, `citation` array.
- `BreadcrumbList` JSON-LD.
- SEOHead component wires canonical, robots, OG, Twitter card, hreflang.
- Sitemap entry at `static/sitemap.xml:134`.
- Prerendered raw JSON at `/corpus-stats.json`.
- Semantic HTML — proper h1/h2/h3, `<time datetime>`, tables with caption + `scope`.
- Cache: `public, max-age=3600, stale-while-revalidate=86400` on both page and JSON.

### Gaps

| #   | Issue                                                                                                                                        | Severity |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | `<title>` hardcoded `"9takes Corpus Stats"`, no keyword, no count                                                                            | High     |
| 2   | No page-specific OG/Twitter image — falls back to generic                                                                                    | Medium   |
| 3   | `og:type=website` instead of `article`; no published/modified time meta                                                                      | Medium   |
| 4   | No `id` attributes on h2/section tags — no deep linking, no AI section-cite                                                                  | High     |
| 5   | Dataset JSON-LD missing `temporalCoverage`, `measurementTechnique`, `size`/`numberOfItems`, `datePublished`, `mainEntityOfPage`, `isBasedOn` | High     |
| 6   | No `WebPage` wrapper around `Dataset`; no `speakable`                                                                                        | Medium   |
| 7   | No `FAQPage` schema — page has natural Q&A baked in                                                                                          | High     |
| 8   | No `<link rel="alternate" type="application/json">` for raw dataset                                                                          | Low      |
| 9   | All domain `<details>` blocks closed by default — top-cited content hidden                                                                   | Medium   |
| 10  | "TL;DR" heading not crawlable as keyword                                                                                                     | Low      |
| 11  | Description doesn't mention the comparison-to-public-data angle (the unique hook)                                                            | High     |
| 12  | One-way internal linking — no links back to type pages, Enneagram corner, related blogs                                                      | Medium   |
| 13  | Citable claims not marked up as `Quotation` schema for verbatim AI cite                                                                      | Low      |
| 14  | Domain over/under-rep paragraphs lack microdata (`<data value="">`, `Observation`)                                                           | Low      |
| 15  | `aria-labelledby` missing on sections                                                                                                        | Low      |
| 16  | `CorpusStatsComparisonSection.svelte:140` hardcodes "293-profile" — already stale (now 315)                                                  | Bug      |

## Plan + Status

Pass 1 complete (2026-05-05). All high- and medium-priority items shipped.

| ID  | Task                                                                                                              | Status  | Notes                                                                                                                      |
| --- | ----------------------------------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | Create this tracking doc                                                                                          | ✅ done | `docs/seo/corpus-stats-seo.md`                                                                                             |
| 2   | Make title dynamic + improve description (keep both bound to live data)                                           | ✅ done | Title pattern: `Enneagram Type Distribution: {N} Public Figures Analyzed`. Description includes external sample size hook. |
| 3   | Expand Dataset JSON-LD (temporalCoverage, measurementTechnique, size, datePublished, mainEntityOfPage, isBasedOn) | ✅ done | Plus `identifier`, `alternateName`, `variableMeasured` upgraded to `PropertyValue` objects.                                |
| 4   | Wrap in WebPage schema with `mainEntity` → Dataset, add `speakable`                                               | ✅ done | Speakable points at `#key-findings` + `#citable-claims`.                                                                   |
| 5   | Add FAQPage JSON-LD + visible FAQ section                                                                         | ✅ done | 5–7 dynamic Q&A pairs (varies w/ domain leaders). Top 3 open by default.                                                   |
| 6   | Add `id` attributes + `aria-labelledby` on section tags                                                           | ✅ done | Stable ids: `key-findings`, `enneagram-distribution`, `domains`, `domain-{slug}`, `per-type-domains`, `comparison`, etc.   |
| 7   | Switch og:type=article + add article:published_time/modified_time                                                 | ✅ done | Plus `article:section`, `article:tag`, `news_keywords`.                                                                    |
| 8   | Add `<link rel="alternate" type="application/json">` for raw dataset                                              | ✅ done | In `<svelte:head>`.                                                                                                        |
| 9   | Auto-`[open]` the top 3 domain blocks                                                                             | ✅ done | Domains sorted by `total` desc; `OPEN_TOP_N = 3`.                                                                          |
| 10  | Rename "TL;DR" → "Key Findings"                                                                                   | ✅ done | Visual treatment unchanged.                                                                                                |
| 11  | Fix hardcoded "293-profile" copy → bind to corpusStats                                                            | ✅ done | `CorpusStatsComparisonSection.svelte:139` now uses `{corpusTotal}`.                                                        |
| 12  | Add internal cross-links to type/category hubs                                                                    | ✅ done | Links to Enneagram Corner, /personality-analysis/categories, /personality-analysis hub, test-comparison blog.              |
| 13  | Verify build + lint                                                                                               | ✅ done | `pnpm check`: 0 errors. `pnpm lint`: clean for all corpus-stats files.                                                     |

## What shipped

### `src/routes/corpus-stats/+page.server.ts` (rewritten)

Now emits a 4-entity JSON-LD `@graph`:

1. **`WebPage`** — wraps the page, points `mainEntity` at the Dataset, includes `speakable` for voice assistants and `isPartOf` → WebSite.
2. **`Dataset`** — the SEO target. Now includes `temporalCoverage`, `measurementTechnique`, `size`, `datePublished`, `mainEntityOfPage`, `identifier`, `alternateName`, `isBasedOn` (the two external comparison datasets, not crammed into `citation`), and `variableMeasured` upgraded from strings → `PropertyValue` objects with descriptions.
3. **`FAQPage`** — 5–7 dynamic Q&A pairs derived from `citable_claims` + per-domain top-over-rep stats. Mirrors the visible FAQ section (Google's compliance requirement).
4. **`BreadcrumbList`** — unchanged.

Returns dynamic `seo.title`, `seo.description`, `seo.headline`, `seo.faqs` — all bound to `corpusStats.totals.published` and `corpusStats.generated_at` so they regenerate on every deploy. Hard-coded only: `PAGE_FIRST_PUBLISHED = '2025-09-01'` (true constant — first deploy date — used as `datePublished` and lower bound of `temporalCoverage`).

### `src/routes/corpus-stats/+page.svelte`

- Consumes new `data.seo` for title/description/headline.
- Switched `ogType` to `article`, passes `article:published_time` + `article:modified_time` + tags via `additionalMeta`.
- Added `<link rel="alternate" type="application/json">` in `<svelte:head>`.
- Added stable `id` attributes on every `<h2>` + section: `key-findings`, `enneagram-distribution`, `domains`, `domain-{slug}` per domain, `per-type-domains`, `comparison`, `pipeline`, `methodology`, `citable-claims`, `faq`, `download`.
- Added `aria-labelledby` on every `<section>`.
- Renamed "TL;DR" → "Key Findings".
- Sorted domains largest-first; auto-`[open]` top 3.
- New visible FAQ section bound to `seo.faqs` (top 3 open).
- Added internal links to `/enneagram-corner`, `/personality-analysis/categories`, `/personality-analysis`, `/blog/enneagram/enneagram-test-comparison-2025`.

### `src/lib/components/marketing/CorpusStatsComparisonSection.svelte`

- Replaced hardcoded `293-profile` with `{corpusTotal}` so the prose updates with corpus growth.
- Added `id="comparison"` + `aria-labelledby="comparison-heading"` on the `<section>` so the comparison anchor lives on the component itself (the wrapper `<div id="comparison">` in `+page.svelte` was removed to avoid a duplicate id).
- Added stable ids on the divergence + sources headings: `#comparison-divergence`, `#comparison-sources`, `#comparison-academic-heading`.

## Pass 2 — verification + cleanup (2026-05-05)

After re-reading the live output and the rendered HTML, found and fixed:

| ID  | Issue                                                                                                                                                                                            | Status  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| 14  | Wrong cross-link URL: `/blog/enneagram/enneagram-test-comparison-2025` doesn't exist; canonical is `/enneagram-corner/enneagram-test-comparison-2025`                                            | ✅ done |
| 15  | "Most Common Domains per Enneagram Type" rows didn't link to type-detail pages (`/personality-analysis/type/N`) — 9 high-value internal links missed                                             | ✅ done |
| 16  | `CorpusStatsComparisonSection` h2 + key h3s lacked ids → couldn't deep-link or AI-cite them                                                                                                      | ✅ done |
| 17  | JSON-LD graph used loose URL strings for cross-references; tightened all to `{ '@id': ... }` form. Added `breadcrumb` reference on WebPage and `isPartOf` on FAQPage. Gave Breadcrumbs an `@id`. | ✅ done |

### Smoke-test results (curl against `pnpm dev`)

- HTTP 200, 539 KB rendered.
- `<title>` reads `Enneagram Type Distribution: 315 Public Figures Analyzed` (dynamic ✓).
- Description includes `254,000+` external sample (dynamic ✓).
- 11 `<h2>`s have stable ids; 9 `<section>`s have `aria-labelledby`.
- 9 type-detail links rendered (`/personality-analysis/type/1`–`9`).
- 3 domain blocks `[open]` by default.
- 7 FAQ items in DOM (3 open). Question h3s wrapped in `<summary>`.
- JSON-LD: 2 `<script>` blocks total — layout (Org/Person/WebSite) + page (4-entity graph: WebPage → Dataset → FAQPage → BreadcrumbList).
- Dataset payload includes `size: '315 public-figure profiles'`, `temporalCoverage: '2025-09-01/2026-05-05'`, `measurementTechnique`, `mainEntityOfPage: { '@id': ... }`, `variableMeasured` (4 PropertyValues), `isBasedOn` (2 datasets), `citation` (6 ScholarlyArticles).
- WebPage `mainEntity` → Dataset, `breadcrumb` → BreadcrumbList, `speakable` → `['#key-findings', '#citable-claims']` (both ids confirmed in DOM).
- No duplicate `id` collisions on the page.

## Deferred (lower priority — open for next pass)

- Custom OG/Twitter image generated from a chart snapshot. (Highest-value remaining win for social CTR.)
- `Quotation` JSON-LD per citable claim.
- `<data value="">` microdata on numerical claims.
- `Observation` schema for over/under-rep deltas.
- Sitemap `<priority>` + `<changefreq>` for `/corpus-stats` — would require extending `scripts/generate-sitemap.js`. Skipped; Google has stated these are largely ignored.

## Testing checklist

- [x] `pnpm check` — 0 errors (160 pre-existing warnings, none new from this work).
- [x] `pnpm lint` — corpus-stats files all clean (2 pre-existing format warnings in unrelated files).
- [x] Live smoke test via `pnpm dev` — HTTP 200, all dynamic numbers + JSON-LD entities verified in rendered HTML.
- [ ] View source on a **deployed** `/corpus-stats` — confirm `<title>` shows live count.
- [ ] Run JSON-LD through Google's [Rich Results Test](https://search.google.com/test/rich-results) — verify Dataset + FAQPage eligible.
- [ ] Run page through [Schema.org validator](https://validator.schema.org).
- [ ] Confirm `/corpus-stats.json` still serves and matches the embedded `distribution` URL.

## Pass 3 ideas (not yet planned)

- **Custom OG card.** Auto-render a 1200×628 PNG showing the type bar at deploy time. Stash at `static/og/corpus-stats.png`.
- **TOC navigation.** With section ids in place, a sticky right-rail TOC would let humans jump around as easily as AIs now can.
- **`Quotation` markup per citable claim.** Each blockquote becomes a discrete cite-able unit.
- **Per-domain `Dataset` sub-entities.** Each domain's `<details>` block could carry its own micro-`Dataset` so AI/Search can cite "9takes corpus, Film & TV subset" as a distinct dataset.
- **Backlinks from category pages.** Every `/personality-analysis/categories/{slug}` should link to its corpus-stats `#domain-{slug}` anchor for two-way crawl flow.
- **Backlinks from type-detail pages.** Every `/personality-analysis/type/N` should link to corpus-stats `#per-type-domains` so type pages share the corpus's authority signals.
- **Sitemap entry enhancement.** Extend `scripts/generate-sitemap.js` to surface `<priority>0.9</priority>` + `<changefreq>weekly</changefreq>` for high-value data pages.
