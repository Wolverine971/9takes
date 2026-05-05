<!-- docs/seo/personality-analysis-categories-seo.md -->

# SEO Audit & Fix Log: `/personality-analysis/categories/[slug]`

**Page:** `src/routes/personality-analysis/categories/[slug]/+page.svelte`
**Started:** 2026-05-05
**Status:** 🟢 All findings shipped (high + medium + low). One follow-up open: per-category OG cards.

URLs covered (7 categories):

- `/personality-analysis/categories/film-tv`
- `/personality-analysis/categories/creator-media`
- `/personality-analysis/categories/music`
- `/personality-analysis/categories/politics-public`
- `/personality-analysis/categories/tech-business`
- `/personality-analysis/categories/comedy`
- `/personality-analysis/categories/authors-thinkers`

---

## Progress at a glance

| Priority | Item                                                                     | Status  |
| -------- | ------------------------------------------------------------------------ | ------- |
| 🔴 High  | HP1 — FAQ schema not visibly rendered                                    | ✅ Done |
| 🔴 High  | HP2 — Broken OG image path (`/personality-analysis-card.webp` missing)   | ✅ Done |
| 🔴 High  | HP3 — `ItemList` items missing `Person` typing + images                  | ✅ Done |
| 🟡 Med   | MP1 — Reference Organization + WebSite by `@id`                          | ✅ Done |
| 🟡 Med   | MP2 — Chain `isPartOf` (page → categories → personality-analysis → site) | ✅ Done |
| 🟡 Med   | MP3 — `image` on `CollectionPage`                                        | ✅ Done |
| 🟡 Med   | MP4 — `speakable` selector for AEO/voice                                 | ✅ Done |
| 🟡 Med   | MP5 — Visible "Last updated" + `datePublished`                           | ✅ Done |
| 🟢 Low   | LP1 — `twitter:image:width/height` meta                                  | ✅ Done |
| 🟢 Low   | LP2 — `hasPart` `cssSelector`                                            | ✅ Done |
| 🟢 Low   | LP3 — Above-the-fold SEO intro paragraph per category                    | ✅ Done |
| 🟢 Low   | LP4 — Cluster-nav heading downshift to `<h3>`                            | ✅ Done |
| 🟢 Low   | LP5 — Breadcrumb leaf `item` URL                                         | ✅ Done |

---

## What's already solid (baseline)

- `<SEOHead>` wired with title, description, canonical, OG, Twitter, robots, googlebot, hreflang, author
- Rich JSON-LD `@graph` (`BreadcrumbList`, `CollectionPage`, `FAQPage`, `Dataset`)
- Per-category SEO copy in `src/lib/personalityCategories.ts` (title/description/keywords/FAQs)
- `dateModified` populated from latest update
- Single `<h1>`, semantic `<header>/<main>/<section>`
- Lazy-loaded images with explicit `width`/`height`
- All 7 category slugs present in `static/sitemap.xml`
- Internal linking to type pages, related categories, featured + grouped people

---

## 🔴 High-priority findings & fixes

### HP1 — FAQ schema not visibly rendered

**Problem:** `seoFaqs` and `statFaqs` are emitted as `FAQPage` JSON-LD but the Q&A pairs are not rendered anywhere on the page. Google's [FAQ structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/faqpage) require the FAQ content to be visibly present on the page; otherwise the rich result is suppressed and it can be flagged as a structured-data violation.

**Fix:** Render a visible `<section>` near the bottom of the page with the merged FAQ content (`category.seoFaqs` + `statFaqs`). Keep the JSON-LD synchronized.

**Status:** ✅ Done (2026-05-05)

**What changed:**

- Added a `faqItems` derived array (`[...category.seoFaqs, ...statFaqs]`) that drives both the visible render and the JSON-LD `FAQPage.mainEntity`. Schema and visible content are now guaranteed to match.
- Rendered `<section class="faq-section" id="faq">` between the people library and "Explore Nearby Categories", using `<details>/<summary>` accordions (first item open by default).
- Added `inLanguage: 'en-US'` to the `FAQPage` node.
- Visible Q&A count verified at 5 on `/personality-analysis/categories/film-tv` (matches JSON-LD).

---

### HP2 — Broken OG/Twitter image (file missing)

**Problem:** `SEOHead` is called with `ogImage="https://9takes.com/personality-analysis-card.webp"` but no such file exists in `static/` (only `static/twitter-card-9takes.webp` is present). Every category page is currently serving a broken social card.

**Fix:**

1. Repoint to working asset (`/twitter-card-9takes.webp`) immediately to unbreak social previews.
2. Add an optional `ogImage` field to `PersonalityCategoryDefinition` and let each category override (default to the working baseline).
3. Follow-up (tracked as separate task below): generate per-category OG cards via the poster generator OR build a dynamic OG route.

**Status:** ✅ Done (2026-05-05)

**What changed:**

- `SEOHead`'s `ogImage` now reads from `data.category.ogImage ?? 'https://9takes.com/twitter-card-9takes.webp'` (verified working asset). All 7 category pages now serve a non-broken social card.
- Added optional `ogImage?: string` field to `PersonalityCategoryDefinition` in `src/lib/personalityCategories.ts` with JSDoc explaining the 1200×628 expectation. Categories can opt into per-category cards as soon as the assets exist; until then they fall back to the brand baseline.
- Verified live: `<meta property="og:image" content="https://9takes.com/twitter-card-9takes.webp">` on `/personality-analysis/categories/film-tv`.

**Open follow-up:** generate the actual 7 category cards (or build a `/og/categories/[slug].png` dynamic OG route). Tracked in **Follow-ups** below.

---

### HP3 — `ItemList` items lack `Person` typing + images

**Problem:** Each entry in the `mainEntity` `ItemList` is just `{ @type: 'ListItem', name, url, description? }`. Upgrading to a `Person` entity with `image` (and `jobTitle` when available) gives Google entity recognition and unlocks image rich results.

**Fix:** Wrap each entry as:

```jsonc
{
  "@type": "ListItem",
  "position": N,
  "item": {
    "@type": "Person",
    "name": "...",
    "url": "...",
    "image": "https://9takes.com/...",
    "description": "..." // persona title
  }
}
```

**Status:** ✅ Done (2026-05-05)

**What changed:**

- Each entry in `mainEntity.itemListElement` is now `{ @type: 'ListItem', position, url, item: { @type: 'Person', @id, name, url, image, description?, additionalProperty? } }`.
- `image` resolves via `buildPersonalityImageUrl(person.enneagram, person.slug)` (full-size variant, absolute URL).
- `description` falls back through `personaTitle ?? description ?? null` (omitted when null).
- Enneagram type is exposed as `additionalProperty` (`PropertyValue` with `name: 'Enneagram Type'`, `value: '<n>'`) for entity richness.
- Verified live on `/personality-analysis/categories/film-tv`: 112 Person nodes, all with absolute image URLs. Spot-check first item below:

```json
{
	"@type": "ListItem",
	"position": 1,
	"url": "https://9takes.com/personality-analysis/blake-lively",
	"item": {
		"@type": "Person",
		"@id": "https://9takes.com/personality-analysis/blake-lively",
		"name": "Blake Lively",
		"url": "https://9takes.com/personality-analysis/blake-lively",
		"image": "https://9takes.com/types/1s/Blake-Lively.webp",
		"description": "The Immaculately Curated",
		"additionalProperty": {
			"@type": "PropertyValue",
			"name": "Enneagram Type",
			"value": "1"
		}
	}
}
```

---

## 🟡 Medium-priority findings & fixes

### MP1 — Reference Organization + WebSite by `@id`

**Problem:** `CollectionPage.publisher` was inline `{ @type: Organization, name, url, logo }`. The global `+layout.svelte` already declares `Organization` (`@id: https://9takes.com/#organization`) and `WebSite` (`@id: https://9takes.com/#website`) — duplicating identity makes entity consolidation harder for crawlers.

**Status:** ✅ Done (2026-05-05)

**What changed:**

- Replaced inline publisher with `publisher: { '@id': 'https://9takes.com/#organization' }`.
- Switched Dataset `creator` to `{ '@id': ORG_ID }`.
- Switched Dataset `isBasedOn` to `{ '@id': 'https://9takes.com/corpus-stats#dataset' }` reference form.

---

### MP2 — Chain `isPartOf` properly

**Problem:** `CollectionPage.isPartOf` only linked to "Personality Analysis Categories" inline — no chain back to the WebSite.

**Status:** ✅ Done (2026-05-05)

**What changed:**

- Added `@id` constants: `PERSONALITY_ANALYSIS_ID = 'https://9takes.com/personality-analysis#collection'`, `CATEGORIES_INDEX_ID = 'https://9takes.com/personality-analysis/categories#collection'`.
- Declared two parent `CollectionPage` nodes inline in `@graph` so the crawler can hop the chain:
  - `categories#collection` → `isPartOf: { @id: PERSONALITY_ANALYSIS_ID }`
  - `personality-analysis#collection` → `isPartOf: { @id: WEBSITE_ID }`
- This page's `isPartOf` now points at `CATEGORIES_INDEX_ID`. Verified live chain: `categories/film-tv` → `categories#collection` → `personality-analysis#collection` → `#website`.

---

### MP3 — `image` on `CollectionPage`

**Status:** ✅ Done (2026-05-05)

**What changed:** Added `image: { @type: 'ImageObject', url: ogImageUrl, width: 1200, height: 628 }` to the `CollectionPage`. Inherits the same `ogImageUrl` derived value used for OG/Twitter, so social and structured-data imagery stay in lockstep.

---

### MP4 — `speakable` for AEO/voice

**Status:** ✅ Done (2026-05-05)

**What changed:** Added `speakable: { @type: 'SpeakableSpecification', cssSelector: ['h1', '.lede', '.corpus-insight-claim'] }` to `CollectionPage`. These selectors capture the category H1, the lede paragraph, and the corpus claim — the three highest-signal lines for voice/AEO read-aloud.

---

### MP5 — Visible "Last updated" + `datePublished`

**Problem:** Only `dateModified` was in schema; visible date was a small chip in `stats-row`. No `datePublished` at all — Google can't anchor freshness without a baseline date.

**Status:** ✅ Done (2026-05-05)

**What changed:**

- Added `getEarliestCategoryDate()` helper to `src/lib/server/personalityCategoryData.ts` (mirrors `getLatestCategoryDate`, scans `person.date ?? person.lastmod` for the earliest valid timestamp).
- Page-server `+page.server.ts` now returns `earliestPublish` alongside `latestUpdate`.
- `CollectionPage` schema gets `datePublished` (when available) in addition to `dateModified`.
- Visible meta moved out of the chip into a dedicated `<p class="meta-line">` directly under the lede with proper `<time datetime>` markup for both dates: "Published Feb 18, 2023 · Last updated May 3, 2026".
- Removed the duplicate "Updated" chip from `stats-row` so freshness lives in one canonical place.

Verified live on `/personality-analysis/categories/film-tv`: `datePublished: 2023-02-18`, `dateModified: 2026-05-03`, both visible in HTML with `<time>` elements.

---

## 🟢 Low-priority findings & fixes

### LP1 — `twitter:image:width/height` meta

**Status:** ✅ Done (2026-05-05)

**What changed:** Added `twitterImageWidth`/`twitterImageHeight` props to `SEOHead.svelte` (default to `ogImageWidth`/`ogImageHeight`), and emitted `<meta name="twitter:image:width">` + `<meta name="twitter:image:height">` tags. Verified live: `1200 × 628`.

---

### LP2 — `hasPart` `cssSelector`

**Status:** ✅ Done (2026-05-05)

**What changed:** Each `WebPageElement` in `CollectionPage.hasPart` now carries `@id`, `url`, and `cssSelector: '#<group-slug>'`. Crawlers can now point precisely at the in-page subcategory anchor for each group.

---

### LP3 — Visible 100–150 word SEO intro per category

**Status:** ✅ Done (2026-05-05)

**What changed:**

- Added required `seoIntro: string` field to `PersonalityCategoryDefinition`.
- Wrote a unique ~120-word paragraph for each of the 7 categories, organically weaving 2–3 of each category's `seoKeywords` (e.g., "movie star Enneagram types", "actor Enneagram types", "celebrity personality analysis" for film-tv) without keyword stuffing.
- Renders as `<p class="seo-intro">` directly under the lede inside the hero, so the keyword-rich body copy lands above the fold.
- Voice matches brand guidelines (tactically direct, pattern-recognition focused, results-driven).

---

### LP4 — Cluster-nav heading downshift to `<h3>`

**Status:** ✅ Done (2026-05-05)

**What changed:** "Jump to a Section" downshifted from sibling `<h2>` to `<h3 class="cluster-nav-title">` since it sits inside the hero `<header>` next to the H1 and is a navigation widget, not a page section. Visual size preserved via `.cluster-nav-title { font-size: 1.25rem }`.

---

### LP5 — Breadcrumb leaf `item` URL

**Status:** ✅ Done (during MP work, 2026-05-05)

**What changed:** Already addressed during MP2's BreadcrumbList cleanup. Leaf `ListItem` (position 4) now includes `item: canonicalUrl`. Also added an `@id` to the `BreadcrumbList` itself and back-referenced it from `CollectionPage.breadcrumb`.

---

## Follow-ups (separate tasks)

- **OG image generation** — produce 7 per-category 1200×628 cards (or build dynamic OG via a `/og/categories/[slug].png` route). Until done, all categories share the brand baseline.
- **Internal-link review** — opportunity to cross-link from category pages to relevant blog content (`enneagram-corner`, `pop-culture`).

---

## Implementation log

(updated as work progresses)

- 2026-05-05 — Audit complete. Doc seeded.
- 2026-05-05 — HP1/HP2/HP3 shipped. `svelte-check` clean (0 errors). Live-verified on `/personality-analysis/categories/film-tv`: visible FAQ accordion, working OG image, 112 `Person` items in `ItemList` with absolute image URLs and Enneagram-type `additionalProperty`.
- 2026-05-05 — MP1/MP2/MP3/MP4/MP5 shipped. `svelte-check` clean (0 errors). Live-verified: graph now declares 6 nodes (`BreadcrumbList`, 3× `CollectionPage` chain, `FAQPage`, `Dataset`); publisher + dataset creator reference `Organization` by `@id`; `isPartOf` chain reaches `WebSite`; `image`/`speakable`/`datePublished` populated; visible "Published … · Last updated …" surface rendered with `<time>` elements.
- 2026-05-05 — LP1/LP2/LP3/LP4/LP5 shipped. `svelte-check` clean (0 errors). Live-verified: `twitter:image:width=1200/height=628`; all `hasPart` entries carry `@id` + `cssSelector`; per-category 120-word `seoIntro` rendering visibly under the lede on every category; cluster-nav heading downshifted to `<h3 class="cluster-nav-title">`; breadcrumb leaf `item` URL confirmed. All audit findings resolved.
