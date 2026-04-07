<!-- docs/seo-audit-9takes-2026-04-07.md -->

# 9takes SEO Audit

Date: 2026-04-07

## Scope

This audit covered:

- Repo inspection of SvelteKit SEO templates, metadata, sitemap generation, robots rules, and route behavior
- Live crawl of the URLs in the public sitemap that existed on 2026-04-07
- Spot checks against current Google Search Central guidance for crawlability, indexing, metadata, and structured data

This was a technical/on-page audit. It did not include Search Console, backlink data, or keyword ranking exports.

## Executive Summary

The site already had a strong metadata baseline:

- All sitemap URLs returned `200`
- No missing titles, descriptions, canonicals, or OG images were found in the live crawl
- No duplicate titles or duplicate meta descriptions were found in the crawled sitemap set
- Canonical slug normalization for personality analysis pages is implemented cleanly

The highest-priority SEO problems were:

1. Question detail pages were indexable even though they were thin for anonymous visitors and emitted QAPage markup without showing answer content publicly
2. The sitemap was missing important indexable hubs, especially `/pop-culture` and the question category pages
3. Internal linking remains weak across part of the blog corpus, especially pop-culture content
4. Titles and descriptions are frequently too long
5. Public article routes are largely uncached, but this needs route-class-specific handling

## Work Completed In This Pass

### P1 Fixed: Question Detail Pages Remain Indexable, But With Safer Public SEO

Problem:

- `/questions/[slug]` pages should be discoverable in search
- Anonymous visitors still saw very little public body copy
- The page emitted question-answer style markup even though the full discussion was gated
- That combination made the pages weak landing pages and created structured-data risk

Changes made:

- Kept question detail pages indexable
- Restored question detail URLs to sitemap generation
- Removed the `noindex` handling that had been added during the first pass
- Removed the `QAPage` JSON-LD and page-level Q&A wrapper
- Removed leftover `Answer` microdata from question comment components
- Added a public question overview section to the page
- Added publicly visible sample Enneagram-style perspective previews for anonymous visitors while keeping user comments gated
- Added safe `WebPage` + breadcrumb JSON-LD for question detail pages

Files changed:

- `src/routes/questions/[slug]/+page.server.ts`
- `src/routes/questions/[slug]/+page.svelte`
- `src/lib/components/questions/QuestionContent.svelte`
- `src/lib/components/molecules/Comment.svelte`
- `src/lib/components/molecules/AIComments.svelte`
- `scripts/generate-sitemap.js`
- `static/sitemap.xml`

Rationale:

- 9takes wants question detail pages to act as search landing pages
- The correct fix is to make them stronger public pages, not to de-index them
- User comments can remain gated while the page still provides indexable context and preview content
- Removing the misleading Q&A schema avoids overstating content that anonymous visitors cannot fully access

### P2 Fixed: Missing Sitemap Coverage

Problem:

- The sitemap omitted several important live, indexable pages
- The missing URLs included `/pop-culture`, `/questions/categories`, and question category detail pages

Changes made:

- Added `/pop-culture` to sitemap generation
- Added `/questions/categories` to sitemap generation
- Added live question category detail pages to sitemap generation
- Rebuilt `static/sitemap.xml`

Files changed:

- `scripts/generate-sitemap.js`
- `static/sitemap.xml`

Verification:

- The regenerated sitemap now includes `/pop-culture`
- The regenerated sitemap now includes `/questions/categories`
- The regenerated sitemap now includes live question category URLs
- The regenerated sitemap includes `/questions/[slug]` detail pages again

## Findings Still Open

### P2: Internal Linking Weakness

Status: Not yet fixed

Evidence:

- Generated cross-link report showed:
  - `28` posts with `0` outgoing links
  - `40` posts with `0` incoming links
  - `27` completely isolated posts

Primary affected cluster:

- Pop-culture content is overrepresented in the isolated set

Recommended next step:

- Add a systematic related-links policy for all published posts
- Repair isolated pop-culture posts first

Reference:

- `docs/BLOG-CROSSLINK-INDEX.md`

### P3: Long Titles And Meta Descriptions

Status: Not yet fixed

Evidence from live crawl:

- `269` titles were over a conservative snippet-safe threshold
- `125` meta descriptions were over a conservative snippet-safe threshold

Primary affected templates:

- `src/lib/components/blog/BlogPageHead.svelte`
- `src/lib/components/blog/PeopleBlogPageHead.svelte`

Recommended next step:

- Add editorial title and description budgets
- Start with the highest-traffic Enneagram and personality-analysis pages

### P3: Social Cards Default To `summary`

Status: Not yet fixed

Evidence:

- Most long-form article templates currently emit `twitter:card=summary`

Recommended next step:

- Switch article templates with valid share images to `summary_large_image`

### P3: Public Article Caching Needs A Split Strategy

Status: Not yet fixed

Important implementation note:

- Personality analysis pages are database-backed and include personalized behavior
- Enneagram Corner, Community, How-To Guides, and Pop Culture pages are markdown-backed content pages

This means the caching fix should not be one global change.

Recommended split:

- Markdown-backed article routes:
  - Move toward public caching for anonymous article HTML
  - Keep personalized or interactive data off the cache key where possible
- Personality analysis routes:
  - Audit exactly which parts are genuinely personalized
  - Separate personalized comment-gating or user-state lookups from the public article shell before changing cache behavior

## Notes On Methodology

The live crawl found that the metadata baseline is stronger than expected:

- No missing titles
- No missing descriptions
- No missing canonicals
- No canonical mismatches
- No missing OG images
- No missing JSON-LD on indexed sitemap pages
- No duplicate titles or descriptions in the crawled set

The main SEO problems are therefore not “basic metadata hygiene” problems. They are:

- Thin public content on gated database-driven question pages
- Incomplete sitemap coverage
- Weak internal link structure
- Content packaging issues such as title/description length
- Route-specific caching strategy

## Sources Used

- Google Search Central: technical requirements
- Google Search Central: title links guidance
- Google Search Central: QAPage structured data guidance
- Google Search Central: FAQPage structured data guidance

## Next Suggested Sequence

1. Repair internal linking in the isolated pop-culture cluster
2. Tighten title and meta description length on the highest-value templates
3. Upgrade article social cards to `summary_large_image`
4. Design separate caching strategies for:
   - markdown-backed article pages
   - database-backed personality analysis pages
