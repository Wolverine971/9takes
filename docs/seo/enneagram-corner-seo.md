<!-- docs/seo/enneagram-corner-seo.md -->

# SEO Audit & Fix Log: `/enneagram-corner`

**Page:** `src/routes/enneagram-corner/+page.svelte`
**Server load:** `src/routes/enneagram-corner/+page.server.ts`
**Started:** 2026-05-05
**Status:** 🟢 All high + medium-priority fixes shipped — low-priority addressed (LP1 deferred)

URL covered: `/enneagram-corner`

---

## Progress at a glance

| Priority | Item                                                              | Status      |
| -------- | ----------------------------------------------------------------- | ----------- |
| 🔴 High  | HP1 — `CollectionPage.author` inline instead of `@id` reference   | ✅ Done     |
| 🔴 High  | HP2 — No `isPartOf` chain back to `WebSite`                       | ✅ Done     |
| 🔴 High  | HP3 — No `datePublished` / `dateModified` (no freshness signal)   | ✅ Done     |
| 🔴 High  | HP4 — No `image` on `CollectionPage`                              | ✅ Done     |
| 🔴 High  | HP5 — ItemList URLs are hash anchors, not real subtopic pages     | ✅ Done     |
| 🔴 High  | HP6 — FAQ duplicated in Svelte and JSON-LD (drift risk)           | ✅ Done     |
| 🟡 Med   | MP1 — No `BreadcrumbList`                                         | ✅ Done     |
| 🟡 Med   | MP2 — No `speakable` selector for AEO/voice                       | ✅ Done     |
| 🟡 Med   | MP3 — `inLanguage` missing on `CollectionPage` + `FAQPage`        | ✅ Done     |
| 🟡 Med   | MP4 — ItemList only describes 8 topics, not the 100+ articles     | ✅ Done     |
| 🟡 Med   | MP5 — JSON-LD inline in `<svelte:head>` rather than via `SEOHead` | ✅ Done     |
| 🟢 Low   | LP1 — Title could surface "9 Types" keyword more directly         | ⏳ Deferred |
| 🟢 Low   | LP2 — Description ~168 chars (slightly over SERP cutoff)          | ✅ Done     |
| 🟢 Low   | LP3 — `meta keywords` is dead weight (Google ignores)             | ✅ Done     |
| 🟢 Low   | LP4 — No schema/copy cross-links to `/personality-analysis` etc.  | ✅ Done     |

---

## What's already solid (baseline)

- `<SEOHead>` wired with title, description, canonical, robots, OG, Twitter, hreflang, author
- OG asset exists: `static/enneagram-corner-card.webp` (1200×628)
- Single `<h1>` ("The Enneagram, decoded.") with semantic `<section>` rhythm
- Visible FAQ rendered via `<FAQSection>` (now derived from same source as JSON-LD)
- 108 enneagram-corner URLs in `static/sitemap.xml`
- Layout already publishes site-wide `Organization` + `WebSite` + `Person` (DJ Wayne) graph by `@id`
- Lazy-loaded images with explicit `width`/`height`, `decoding="async"`
- Hero LCP image marked `loading="eager" fetchpriority="high"`

---

## 🔴 High-priority findings & fixes

### HP1 — `CollectionPage.author` inline instead of `@id` reference

**Problem:** The `<svelte:head>` JSON-LD declared
`author: { '@type': 'Organization', name: '9takes', url: 'https://9takes.com' }`
inline. The global `+layout.svelte` already declares the canonical `Organization`
(`@id: https://9takes.com/#organization`). Duplicating identity prevented
entity consolidation across the site graph.

**Status:** ✅ Done (2026-05-05)

**What changed:**

- `CollectionPage.author` now references `{ '@id': 'https://9takes.com/#organization' }`.
- Added `publisher: { '@id': 'https://9takes.com/#organization' }`.
- All `BlogPosting` child nodes also reference `Organization` by `@id` for
  consistent author/publisher identity.

---

### HP2 — No `isPartOf` chain back to `WebSite`

**Problem:** `CollectionPage` was an island — crawlers couldn't walk from this hub up to the site root.

**Status:** ✅ Done (2026-05-05)

**What changed:** Added `isPartOf: { '@id': 'https://9takes.com/#website' }` to `CollectionPage`. Every child `BlogPosting` references this `CollectionPage` by `@id` (`isPartOf: { '@id': 'https://9takes.com/enneagram-corner#collection' }`), completing the chain `BlogPosting → CollectionPage → WebSite → Organization`.

---

### HP3 — No `datePublished` / `dateModified`

**Problem:** Schema had no freshness signal even though `+page.server.ts`
already had `lastmod` per post.

**Status:** ✅ Done (2026-05-05)

**What changed:**

- `+page.server.ts` now aggregates `earliestPublish` (oldest `date` across all
  published posts) and `latestUpdate` (newest `lastmod ?? date`).
- `CollectionPage` schema gets `datePublished` (when available) + `dateModified`.
- Visible "Published Feb 9, 2023 · Last updated May 3, 2026" line rendered in
  the hero with proper `<time datetime>` markup for both dates (and a `.hero-meta`
  mono treatment to match the streetlamp-symposium aesthetic).
- Live values verified on `/enneagram-corner`: `datePublished: 2023-02-10`,
  `dateModified: 2026-05-04`.

---

### HP4 — No `image` on `CollectionPage`

**Status:** ✅ Done (2026-05-05)

**What changed:** Added
`image: { '@type': 'ImageObject', url: 'https://9takes.com/enneagram-corner-card.webp', width: 1200, height: 628 }`
to `CollectionPage`. Same asset is fed to OG/Twitter via `<SEOHead>` so social
and structured-data imagery stay in lockstep.

---

### HP5 — ItemList URLs are hash anchors, not real subtopic pages

**Status:** ✅ Done (2026-05-05)

**What changed:**

- ItemList URLs now point to dedicated subtopic pages instead of hash anchors:

  | Topic          | New URL                                    |
  | -------------- | ------------------------------------------ |
  | The Nine Types | `/enneagram-corner/subtopic/nine-types`    |
  | Foundations    | `/enneagram-corner/subtopic/overview`      |
  | Growth         | `/enneagram-corner/subtopic/development`   |
  | Relationships  | `/enneagram-corner/subtopic/relationships` |
  | Mental Health  | `/enneagram-corner/mental-health`          |
  | Career         | `/enneagram-corner/subtopic/workplace`     |
  | Real Life      | `/enneagram-corner/subtopic/situational`   |
  | Resources      | `/enneagram-corner/subtopic/resources`     |

- Items upgraded from plain `ListItem` to nested `CollectionPage` items so
  Google reads them as sub-hubs, not just navigational anchors.
- `topicUrl(topic)` helper handles fallback to hash anchors only when no
  dedicated page exists (currently a no-op since all 8 topics have pages).

---

### HP6 — FAQ duplicated in Svelte literal and JSON-LD literal

**Status:** ✅ Done (2026-05-05)

**What changed:** A single `enneagramFAQs` array now drives both the
visible `<FAQSection>` accordion and the `FAQPage.mainEntity` JSON-LD
(via a derived `faqJsonLd`). The hand-rolled Q&A block in `<svelte:head>`
is gone — schema and visible content can no longer drift.

---

## 🟡 Medium-priority findings & fixes

### MP1 — No `BreadcrumbList`

**Status:** ✅ Done (2026-05-05)

**What changed:** Added a `BreadcrumbList` node to the `@graph` with
`Home → Enneagram Corner` (positions 1–2). Verified live.

---

### MP2 — No `speakable` selector for AEO/voice

**Status:** ✅ Done (2026-05-05)

**What changed:** Added
`speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.hero-subhead-line-1'] }`
to `CollectionPage`. These selectors capture the H1 ("The Enneagram, decoded.")
and the first hero subhead — the two highest-signal lines for voice/AEO read-aloud.

---

### MP3 — `inLanguage` missing

**Status:** ✅ Done (2026-05-05)

**What changed:** Added `inLanguage: 'en-US'` to both `CollectionPage` and
`FAQPage`. Each `BlogPosting` node also declares `inLanguage: 'en-US'`.

---

### MP4 — ItemList describes topics, not the 100+ articles

**Status:** ✅ Done (2026-05-05)

**What changed:**

- Featured + recently-updated posts (6 articles total: 2 featured + 4 recent)
  are now emitted as full `BlogPosting` nodes in the `@graph` with
  `headline`, `description`, `url`, `image`, `datePublished`, `dateModified`,
  `author`, `publisher`, `isPartOf`.
- `CollectionPage.hasPart` references each article by `@id`, completing the
  parent-child relationship.
- Topics remain the `mainEntity` (since this hub IS organized by topic),
  while the article nodes give Google rich-result eligibility for the actual
  content. Verified live: 6 `BlogPosting` nodes present, all with absolute
  `url`/`image` URLs and date pairs.

---

### MP5 — JSON-LD inline in `<svelte:head>` rather than via `<SEOHead jsonLd={…} />`

**Status:** ✅ Done (2026-05-05)

**What changed:** The hand-rolled `<svelte:head><script type="application/ld+json">…`
block is gone. A single `jsonLdGraph` derived value composes the breadcrumb,
collection page, topic ItemList, article nodes, and FAQ page — passed as
`<SEOHead jsonLd={jsonLdGraph} />`. Matches the pattern used on
`personality-analysis/categories/[slug]`.

---

## 🟢 Low-priority findings

### LP1 — Title surface for "9 Types"

**Status:** ⏳ Deferred. Current title (`Enneagram Personality Guide: Complete Psychology System | 9takes`) is keyword-rich and brand-suffixed; changing risks rank regression. Variant to test in a follow-up: "Enneagram Corner: The 9 Types, Decoded | 9takes".

### LP2 — Description trim

**Status:** ✅ Done (2026-05-05). Cut from ~168 chars to 134 chars: "Decode the Enneagram. Find your type among 9 patterns, understand core motivations, and transform how you read every situation." Now well under the SERP snippet cutoff.

### LP3 — Dead `meta keywords`

**Status:** ✅ Done (2026-05-05). Removed the `keywords` entry from
`additionalMeta` (Google has ignored the keywords meta tag for over a decade).
Replaced the `additionalMeta` array entirely with the `author="9takes"` prop
on `<SEOHead>` for cleaner output.

### LP4 — Cross-links to sibling pillar hubs

**Status:** ✅ Done (2026-05-05). Added `relatedLink` array to `CollectionPage`
with `/personality-analysis`, `/enneagram-test`, and `/questions` so crawlers
see the related-entity graph between hubs.

---

## Implementation log

- 2026-05-05 — Audit complete. Doc seeded.
- 2026-05-05 — Server load (`+page.server.ts`) refactored to compute
  `earliestPublish` + `latestUpdate` aggregates and return them with
  `totalPublished`.
- 2026-05-05 — Page (`+page.svelte`) refactored end-to-end:
  - Added derived `jsonLdGraph` composing `BreadcrumbList`, `CollectionPage`,
    topics `ItemList`, 6× `BlogPosting`, `FAQPage` nodes — all linked via
    `@id` references to the global `Organization`/`WebSite`.
  - Removed the inline `<svelte:head>` JSON-LD literal; JSON-LD now passed
    via `<SEOHead jsonLd={…} />`.
  - FAQ schema now derived from the same `enneagramFAQs` array used by
    `<FAQSection>` (no drift risk).
  - ItemList URLs upgraded from hash anchors to real subtopic pages.
  - Trimmed description to 134 chars; dropped dead `keywords` meta.
  - Added visible "Published … · Last updated …" line in the hero with
    `<time datetime>` markup; new `.hero-meta` style.
- 2026-05-05 — `pnpm check` passes (0 errors). Live-verified on
  `/enneagram-corner`: `@graph` of 8 nodes (BreadcrumbList + CollectionPage +
  ItemList + 6× BlogPosting + FAQPage), all 8 topic ItemList URLs resolve to
  dedicated subtopic pages, `datePublished`/`dateModified` populated, visible
  date line rendered, OG image + dims correct.
