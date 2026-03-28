<!-- seo-audit-9takes-2026-03-27.md -->
# SEO Audit: 9takes.com

**Date:** 2026-03-27
**URL:** https://9takes.com
**Tool:** seobeast-audit (6 parallel specialist subagents)

---

## Overall Score

```
Score: 71/100  [##############......] Grade: C+
```

| Category                     | Score  | Bar          | Issues |
| ---------------------------- | ------ | ------------ | ------ |
| Technical SEO                | 82/100 | `########..` | 7      |
| Content                      | 38/100 | `####......` | 12     |
| Performance                  | 72/100 | `#######...` | 8      |
| Security                     | 78/100 | `########..` | 5      |
| Structured Data              | 52/100 | `#####.....` | 9      |
| AEO (AI Engine Optimization) | 92/100 | `#########.` | 4      |

---

## Critical Issues

| #   | Issue                                                                                 | Category        |
| --- | ------------------------------------------------------------------------------------- | --------------- |
| 1   | Severely thin homepage content (~350-450 words vs 800-1500+ recommended)              | Content         |
| 2   | No E-E-A-T author/expertise attribution -- no named founder, credentials, or team bio | Content         |
| 3   | No substantive explanatory content -- page reads as taglines, not prose               | Content         |
| 4   | Google Fonts loading 11 weight variants via render-blocking CSS                       | Performance     |
| 5   | 6 render-blocking CSS files in `<head>` (incl. non-critical component CSS)            | Performance     |
| 6   | WebPage schema missing `@id` -- cannot be cross-referenced by other nodes             | Structured Data |
| 7   | WebPage schema disconnected from `@graph` -- no `isPartOf` or `publisher` links       | Structured Data |
| 8   | WebSite schema missing `publisher` property linking to Organization                   | Structured Data |

---

## High Priority Issues

| #   | Issue                                                                     | Category        |
| --- | ------------------------------------------------------------------------- | --------------- |
| 1   | Shallow keyword integration -- target terms barely used in body copy      | Content         |
| 2   | No social proof, testimonials, or trust content on homepage               | Content         |
| 3   | No content depth on 9 type cards -- just names and celebrity labels       | Content         |
| 4   | No FAQ or educational content block visible on page                       | Content         |
| 5   | Avatar images missing `width`/`height` attributes (CLS risk)              | Performance     |
| 6   | HTML `cache-control: max-age=0` forces full round-trip every visit        | Performance     |
| 7   | Above-fold images lack `fetchpriority` hints                              | Performance     |
| 8   | CSP allows `'unsafe-inline'` and `'unsafe-eval'` in `script-src`          | Security        |
| 9   | HSTS missing `includeSubDomains` and `preload` directives                 | Security        |
| 10  | Organization schema missing `description`, `foundingDate`, `contactPoint` | Structured Data |
| 11  | No BreadcrumbList schema present                                          | Structured Data |
| 12  | WebPage missing `description` property                                    | Structured Data |
| 13  | No `llms-full.txt` with article-level URLs                                | AEO             |
| 14  | Missing `meta robots` on inner pages (homepage only)                      | Technical SEO   |
| 15  | Missing `hreflang` on inner pages -- inconsistent with homepage           | Technical SEO   |
| 16  | Flat sitemap (468 URLs, 137KB) approaching index threshold                | Technical SEO   |

---

## Medium Priority Issues

| #   | Issue                                                                | Category        |
| --- | -------------------------------------------------------------------- | --------------- |
| 1   | Dynamic H2 (question-of-day) provides no consistent keyword signal   | Content         |
| 2   | Meta description promises depth the thin page doesn't deliver        | Content         |
| 3   | Internal link anchor text lacks keyword richness                     | Content         |
| 4   | Footer carries more semantic weight than body content                | Content         |
| 5   | No unique value proposition explained vs competitors                 | Content         |
| 6   | ~48 JS `modulepreload` hints in Link headers -- bandwidth contention | Performance     |
| 7   | Orphaned `dns-prefetch` for GTM with no script loaded                | Performance     |
| 8   | `loading="lazy"` on inline data URI images (no effect)               | Performance     |
| 9   | `Cache-Control: public` on pages that may serve auth content         | Security        |
| 10  | CSP `style-src` includes `'unsafe-inline'`                           | Security        |
| 11  | No COOP/CORP headers present                                         | Security        |
| 12  | FAQPage schema on commercial site -- no rich results since Aug 2023  | Structured Data |
| 13  | Sitemap `priority` 0.7 on 462/468 URLs -- signal is meaningless      | Technical SEO   |
| 14  | Deprecated `changefreq` tags add ~15KB dead weight to sitemap        | Technical SEO   |
| 15  | `/blog` in sitemap (priority 1.0) but not in site navigation         | Technical SEO   |
| 16  | Inconsistent `lastmod` date formats in sitemap                       | Technical SEO   |
| 17  | `llms.txt` lacks individual article URLs for citation targeting      | AEO             |
| 18  | Missing `anthropic-ai` user-agent in `robots.txt`                    | AEO             |
| 19  | No AI-specific indexing hints (`max-snippet:-1`)                     | AEO             |

---

## Passing

- Clean heading hierarchy -- single H1, logical H2/H3 structure
- Meta title (49 chars) and description (137 chars) well-optimized
- ~35 internal links with good section coverage
- Canonical tags correctly self-referencing on all pages
- HTTP to HTTPS and www to non-www redirects via 308 (no chains)
- Trailing slash normalization working correctly
- `robots.txt` well-structured, blocks auth pages, allows AI crawlers
- Clean semantic URL structure (`/section/slug`, no query params)
- SSR confirmed -- fully-rendered HTML, no JS dependency for crawlers
- All images use WebP format with proper eager/lazy split
- Immutable asset hashing for long-term browser caching
- JS loaded as non-render-blocking ES modules at body bottom
- Small HTML payload (34KB), HTTP/2 enabled
- No heavy third-party scripts in critical path
- HTTPS enforced, HSTS active (2yr max-age)
- `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` all present
- `Permissions-Policy` comprehensively restrictive
- Organization schema with `@id`, logo, `sameAs` social profiles
- `@graph` pattern correctly used for entity grouping
- All 6 major AI crawlers explicitly allowed in `robots.txt`
- `llms.txt` present, well-structured with preferred-understanding section
- Content is assertion-first (not "In this article...") -- good for AI citation
- Image sitemap extension with 748 image entries
- RSS feed available and responding
- Proper 404 handling (not soft 404s)
- Social links with `rel="noreferrer noopener"`

---

## Top 5 Actions to Move the Needle

### 1. Expand homepage content to 800-1500 words

Add an Enneagram explainer section, type descriptions, and visible FAQ block. The homepage currently reads as a collection of taglines (~400 words). Search engines reward pages that demonstrate depth. This alone could lift the Content score from 38 to 65+.

### 2. Add founder bio with credentials

Add a named author ("DJ Wayne"), an "About the founder" blurb on the homepage, and Person schema in JSON-LD. For a site offering personality coaching and psychological frameworks, demonstrable expertise is essential for E-E-A-T. Include credentials, experience, or a short bio linking to the `/about` page.

### 3. Fix structured data graph connections

Consolidate all JSON-LD into a single `@graph` block. Add `@id` to WebPage (`https://9takes.com/#webpage`), link it to WebSite via `isPartOf` and to Organization via `publisher`. Add a BreadcrumbList schema. This could lift Structured Data from 52 to 80+.

**Target structure:**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "https://9takes.com/#organization", ... },
    { "@type": "WebSite", "@id": "https://9takes.com/#website", "publisher": {"@id": "https://9takes.com/#organization"}, ... },
    { "@type": "WebPage", "@id": "https://9takes.com/#webpage", "isPartOf": {"@id": "https://9takes.com/#website"}, "publisher": {"@id": "https://9takes.com/#organization"}, ... },
    { "@type": "BreadcrumbList", ... },
    { "@type": "FAQPage", ... }
  ]
}
```

### 4. Self-host fonts and reduce to 2-3 weights

Eliminate the render-blocking Google Fonts CSS request (currently loading Rajdhani, Space Grotesk, and JetBrains Mono across 11 weight variants). Self-host the subset you actually use and load via `<link rel="preload" as="font">`. This is the single biggest LCP improvement available.

### 5. Add width/height to all avatar images

The 9 celebrity avatar images lack explicit `width` and `height` attributes, causing layout shift (CLS) as images load. Quick fix: add dimensions to each `<img>` tag. This directly improves Core Web Vitals.

---

## Detailed Category Breakdowns

### Technical SEO (82/100)

**Strengths:** Canonical tags, redirect handling (308), trailing slash normalization, robots.txt, URL structure, SSR, proper 404s, image sitemap with 748 entries, RSS feed.

**Weaknesses:** Inner pages missing `meta robots` and `hreflang` tags (homepage-only implementation). Sitemap uses meaningless uniform `priority` values and deprecated `changefreq`. `/blog` path orphaned from navigation. Sitemap approaching the size where a sitemap index would help.

### Content (38/100)

**Strengths:** Clean heading hierarchy, strong meta title/description, good internal linking volume, logical content flow.

**Weaknesses:** This is the weakest category by far. The homepage is severely thin (~400 words), with no substantive prose explaining what the Enneagram is, how the platform works, or why visitors should trust 9takes. No social proof, no testimonials, no founder credentials. Target keywords appear in headers but not in natural body paragraphs. The dynamic question-of-day H2 provides no consistent SEO signal.

### Performance (72/100)

**Strengths:** WebP images, eager/lazy split, immutable asset hashing, non-render-blocking JS modules, SSR, small HTML payload, HTTP/2, no heavy third-party scripts, `font-display: swap`.

**Weaknesses:** Google Fonts loading 11 variants is the biggest bottleneck. 6 render-blocking CSS files include non-critical component styles. Avatar images lack dimensions (CLS). No `fetchpriority` hints. ~48 modulepreload hints cause bandwidth contention. HTML has no browser caching (`max-age=0`).

### Security (78/100)

**Strengths:** HTTPS/HTTP2, HSTS (2yr), X-Content-Type-Options, X-Frame-Options, strict Referrer-Policy, comprehensive Permissions-Policy, CSP with `object-src: none`, `base-uri: self`, `form-action` restrictions, proper social link `rel` attributes.

**Weaknesses:** CSP weakened by `'unsafe-inline'` and `'unsafe-eval'` in script-src (common in SvelteKit but reduces XSS protection). HSTS lacks `includeSubDomains` and `preload`. No COOP/CORP headers. `Cache-Control: public` on potentially auth-gated pages.

### Structured Data (52/100)

**Strengths:** Three JSON-LD blocks present and syntactically valid. `@graph` pattern used correctly. Organization has `@id`, logo, `sameAs`. WebPage has well-formed `primaryImageOfPage`. FAQPage correctly structured (5 Q&A pairs).

**Weaknesses:** WebPage is disconnected from the graph (no `@id`, no `isPartOf`, no `publisher`). WebSite lacks `publisher` link to Organization. Organization missing `description`, `foundingDate`, `contactPoint`. No BreadcrumbList. FAQPage won't trigger rich results on a commercial site (retained for LLM citation only).

### AEO -- AI Engine Optimization (92/100)

**Strengths:** Best-in-class AI crawler access -- all 6 major AI crawlers explicitly allowed. `llms.txt` present and well-authored with "Preferred understanding" section guiding AI interpretation. SSR ensures content visibility without JS. Short, assertion-first paragraphs are ideal for AI citation. FAQ schema provides directly extractable Q&A pairs. Sitemap declared for AI crawler discovery.

**Weaknesses:** No `llms-full.txt` with article-level URLs and summaries. `anthropic-ai` user-agent not explicitly listed (covered by default rule). `llms.txt` only lists section URLs, not individual high-value articles. No `max-snippet:-1` or similar AI-indexing hints.
