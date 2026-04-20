<!-- docs/planning/people-jsonld-unification-2026-04-19.md -->

# Tasker: Deterministic JSON-LD for Personality Analysis Pages

_Created: 2026-04-19_
_Owner: next agent_
_Priority: P0 — unblocks deterministic people-page JSON-LD, resolves a 327-of-334 coverage gap, and replaces the JSON-LD-only FAQPage plan from `docs/planning/people-blog-faqpage-jsonld-tasker-2026-04-17.md` with a Google-compliant visibility rule_

## TL;DR

Today, `/personality-analysis/[slug]` ships inconsistent structured data:

- **7 of 334 drafts** carry a hand-written `<script type="application/ld+json">` block that gets scraped into `blogs_famous_people.jsonld_snippet` and rendered verbatim. These are the only posts with `FAQPage`, `keywords`, `articleSection`, and real `sameAs` on the person.
- **327 drafts** have `jsonld_snippet = null`, so the page falls back to `buildCommonJsonLdFields()` in `PeopleBlogPageHead.svelte` — a sparse `Article` with author + publisher + WebPage and nothing else. No FAQs. No keywords. Just `sameAs` if the person has any of `wikipedia` / `twitter` / `instagram` / `tiktok` in their frontmatter.
- The v1/v2 blog creator commands **explicitly tell authors not** to embed JSON-LD in the markdown, yet the "handled separately" path is incomplete. So new blogs ship with the sparse variant and nobody knows.
- The admin editor at `/admin/content-board/personality-analysis/[slug]` can't touch `jsonld_snippet` (it's omitted from the PUT whitelist in `src/routes/api/admin/content/[id]/+server.ts:91`).
- The page's `<article>` microdata declares `BlogPosting` while the JSON-LD declares `Article`. Soft conflict.

**Target state.** Kill the `<script>` block in markdown. Kill `jsonld_snippet` as a source of truth. Store only the _unique_ bits in frontmatter + new DB columns.

Per-post unique fields (all optional except where noted):

1. **`keywords`** — array of strings, per-post.
2. **`same_as`** — array of HTTPS URL strings for the person (wikipedia, twitter, instagram, tiktok, imdb, youtube, spotify, website, …).
3. **`faqs`** — array of `{ question, answer, anchor? }` objects. Each must be backed by visible page content (see Hard Constraints).
4. **`wikidata_qid`** — Wikidata QID (e.g. `Q26876`). Fuels both a `sameAs` URL and a structured `identifier` PropertyValue. Highest-signal field for Google Knowledge Graph linking and LLM entity retrieval.
5. **`imdb_id`** — IMDb nconst (e.g. `nm1728342`). Same dual-emission pattern.
6. **`birth_date`** / **`birth_place`** / **`nationality`** / **`occupation`** / **`knows_about`** — structured person attributes. Feed into the `Person` node to build a real entity profile for Google + LLM consumption. All optional — the renderer omits missing fields.
7. **`citations`** — array of source URLs the article quotes or relies on. Rendered as `Article.citation`. Critical AEO signal: LLMs use `citation` to decide whether a claim is worth quoting.

Auto-computed at render time (zero author effort):

- `wordCount`, `timeRequired` (ISO 8601 duration), `articleSection`, `inLanguage`, `isAccessibleForFree`, `isPartOf` (→ Blog node), and a `speakable` selector pointing at the first-letter intro and TL;DR accordion.

Build the full `@graph` at render time from frontmatter + DB + constants. Same inputs, same output, every blog, deterministically.

---

## Hard Constraints

1. **No bottom-of-page FAQ dump by default, but no hidden FAQ structured data.** The creator commands forbid a visible FAQ block at the bottom, but Google requires FAQ content used for `FAQPage` rich-result eligibility to be visible on the source page. Only emit `FAQPage` when each Q/A pair is backed by visible page content (for example, a real question heading, a visible `<QuickAnswer>`, or an accessible `<details>` accordion). If the FAQ exists only in frontmatter/DB/legacy JSON-LD, keep it in the backfill report/content backlog, not the emitted `faqs` column.
2. **No double-emitted schema.** One `@graph`, one `<script>` tag. (Breadcrumb stays inside the graph, not a second tag.)
3. **Don't regress the 7 rich-snippet posts.** Before dropping `jsonld_snippet`, extract and persist their `keywords`, `same_as`, and any visible-source-backed `faqs` into the new columns. Hidden legacy FAQPage entries should be reported for content review, not emitted.
4. **Don't invent FAQs or emit hidden ones.** If `faqs` is empty in frontmatter, or if candidate FAQs fail the visible-source validation, the renderer omits the `FAQPage` node. No synthetic Q&As.
5. **`same_as` must be validated HTTPS URLs.** Reject placeholder values like `"none"`, `"n/a"`, empty strings, relative URLs, non-URL strings, and `http://` URLs. Do not reuse `normalizeProfileUrl` unchanged for explicit `same_as` values: it currently accepts `http://` pass-through values and is private to `schema.ts`. Add/export a stricter explicit-URL normalizer or handle explicit `sameAs` inside `buildPersonSameAsUrls`.
6. **Backwards-compatible rollout.** Frontmatter fields should be optional during the transition; the builder falls back to legacy columns (`wikipedia`, `twitter`, `instagram`, `tiktok`) when `same_as` is absent.

### Google FAQPage caveat

Google's current `FAQPage` documentation says FAQ rich results are available only for well-known, authoritative government- or health-focused sites, and its content guidelines require all FAQ content to be visible on the source page. 9takes should still use schema.org JSON-LD where it accurately describes the page, but this task should not promise Google FAQ rich-result wins from JSON-LD-only FAQs. Source: <https://developers.google.com/search/docs/appearance/structured-data/faqpage>.

Update the superseded FAQPage plan accordingly:

- Replace "JSON-LD-only FAQ coverage for SEO" with "visible-source-backed FAQPage only."
- Keep Article, Person, Organization, BreadcrumbList, and sameAs as the main deterministic structured-data win.
- Use Google's Rich Results Test for syntax/error checks, not as a guarantee of FAQ rich-result eligibility.

---

## Current JSON-LD Landscape (for context — do not re-audit)

| Surface                      | Source                                                     | Current behavior                                                                                                                                            |
| ---------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auto-built Article           | `src/lib/components/blog/PeopleBlogPageHead.svelte:68-113` | Sparse Article + Person (author) + Person (about) + Organization + WebPage + ImageObject. No keywords, no articleSection, no FAQPage.                       |
| Auto-built BreadcrumbList    | same file, lines 38–46                                     | Always emitted as a _second_ `<script>` tag via `buildBreadcrumbSchema`.                                                                                    |
| DB override `jsonld_snippet` | `blogs_famous_people.jsonld_snippet` JSONB                 | If non-null, replaces the auto-built Article. Patched at render by `updateJsonLdDateModified` + `mergePersonSameAsIntoJsonLd`. Can be a node or `@graph`.   |
| Page microdata               | `+page.svelte:351`, `<QuickAnswer>`, featured image        | Declares `BlogPosting`, not `Article`. Conflicts silently with #1/#3.                                                                                       |
| Draft → DB capture           | `scripts/personBlogParser.js:457` `extractJsonLd`          | Scrapes `<script type="application/ld+json">` from draft body before `cleanupContent` strips the `<svelte:head>`. Only 7 drafts currently carry that block. |

See `docs/planning/people-blog-faqpage-jsonld-tasker-2026-04-17.md` for the full audit.

---

## Target State

### 1. Frontmatter schema (source of truth authors edit)

Add the following optional fields to `src/blog/people/person-template.md` and to any people draft touched during this rollout. Do not bulk-edit all 334 drafts in the engineering PR; broad legacy content population is Phase 5.

```yaml
# Topical signals
keywords:
  - 'Taylor Swift personality type'
  - 'Taylor Swift Enneagram'
  - 'Taylor Swift Type 3'
  - 'Taylor Swift psychology'
  - 'Enneagram Type 3 celebrity'

# Entity identity — URLs
same_as:
  - 'https://en.wikipedia.org/wiki/Taylor_Swift'
  - 'https://www.imdb.com/name/nm1728342/'
  - 'https://twitter.com/taylorswift13'
  - 'https://www.instagram.com/taylorswift/'
  - 'https://www.tiktok.com/@taylorswift'
  - 'https://www.youtube.com/@TaylorSwift'
  - 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02'
  - 'https://www.taylorswift.com/'

# Entity identity — structured IDs
wikidata_qid: 'Q26876' # becomes both sameAs URL + identifier PropertyValue
imdb_id: 'nm1728342' # same dual-emission

# Person attributes (all optional; renderer omits missing fields)
birth_date: '1989-12-13' # ISO 8601 date
birth_place: 'West Reading, Pennsylvania, USA'
nationality: 'American'
occupation:
  - 'Singer-songwriter'
  - 'Record producer'
  - 'Actress'
knows_about:
  - 'Pop music'
  - 'Country music'
  - 'Songwriting'
  - 'Music industry'

# Article sourcing (AEO / LLM citation signal)
citations:
  - 'https://en.wikipedia.org/wiki/Taylor_Swift'
  - 'https://www.vogue.com/article/taylor-swift-cover-story-september-2019'
  - 'https://www.rollingstone.com/music/music-features/taylor-swift-cover-story-880794/'

# FAQs (visible-source-backed only)
faqs:
  - question: "What is Taylor Swift's Enneagram type?"
    answer: 'Taylor Swift is an Enneagram Type 3 (The Achiever). …'
    anchor: 'what-is-taylor-swifts-personality-type' # optional; matches visible H2 id
  - question: 'Why does Taylor Swift re-record her albums?'
    answer: 'From a Type 3 lens, ownership and narrative control are …'
  - question: 'Is Taylor Swift a Type 3w2 or 3w4?'
    answer: 'Her public-facing warmth and people-orientation point to …'
```

Rules:

- `keywords` — 5–10 strings, lowercase or Title Case (pick one, stick to it), no hashtags, no duplicates of `type`/`tags`.
- `same_as` — valid absolute HTTPS URLs only. Legacy fields (`wikipedia`, `twitter`, `instagram`, `tiktok`) remain in frontmatter for SEO surfacing elsewhere (Twitter cards, OG tags) but `same_as` is the canonical list for JSON-LD.
- `wikidata_qid` — uppercase Q-prefixed string, regex `^Q\d+$`. Required for actors, musicians, politicians, athletes. Look up once per person at draft time (`wikidata.org`). The renderer expands it into a `sameAs` URL _and_ an `identifier` PropertyValue.
- `imdb_id` — lowercase `nm` nconst, regex `^nm\d+$`. Required for anyone with an IMDb presence (actors, directors, hosts, public-figure interviewees).
- `birth_date` — ISO 8601 (`YYYY-MM-DD`). Omit for living people when privacy is a concern or when biographical framing is out of scope for the post.
- `birth_place` — free-text, "City, Region, Country" format preferred. Rendered as `Place.name`.
- `nationality` — single adjective (e.g. `American`, `British`). Rendered as `Country.name`. Omit for people with complex/contested citizenship.
- `occupation` — array of 1–5 short role strings. First becomes `Person.jobTitle`; full list becomes `Person.hasOccupation`.
- `knows_about` — array of 3–8 topic strings covering what the person is authoritative on. High-value AEO signal (tells LLMs which queries should retrieve this entity).
- `citations` — array of HTTPS URLs to sources the article quotes. Target 3–10. Rendered as `Article.citation` string array.
- `faqs` — 2–5 items, but only when the same Q/A content is visible in the rendered page. Answers ≤ 1000 chars (Google FAQ cap), no HTML, one or two sentences. Optional `anchor` is the `id` of a visible H2/H3 — if present, the renderer produces `acceptedAnswer.url` as a deep link to `canonicalUrl#anchor`. If a candidate FAQ is useful but not visible on the page, keep it out of emitted `FAQPage` until the content is surfaced in a visible heading, `<QuickAnswer>`, or accordion.

### 2. New Supabase columns on `blogs_famous_people`

```sql
ALTER TABLE public.blogs_famous_people
  ADD COLUMN IF NOT EXISTS keywords      text[],
  ADD COLUMN IF NOT EXISTS same_as       text[],
  ADD COLUMN IF NOT EXISTS faqs          jsonb,     -- array of { question, answer, anchor? }
  ADD COLUMN IF NOT EXISTS wikidata_qid  text,
  ADD COLUMN IF NOT EXISTS imdb_id       text,
  ADD COLUMN IF NOT EXISTS birth_date    date,
  ADD COLUMN IF NOT EXISTS birth_place   text,
  ADD COLUMN IF NOT EXISTS nationality   text,
  ADD COLUMN IF NOT EXISTS occupation    text[],
  ADD COLUMN IF NOT EXISTS knows_about   text[],
  ADD COLUMN IF NOT EXISTS citations     text[];
```

Types:

- `keywords`, `same_as`, `occupation`, `knows_about`, `citations: text[]` — simple string arrays for easy `ANY()` queries later.
- `faqs: jsonb` — stays flexible (future fields like `id`, `source_heading`, `anchor`).
- `wikidata_qid: text` — validated to `^Q\d+$` at the parser/admin layer.
- `imdb_id: text` — validated to `^nm\d+$` at the parser/admin layer.
- `birth_date: date` — Postgres `DATE`, not `text` (allows range queries for future "people born in the 1980s" features).
- `birth_place`, `nationality: text` — no normalization beyond trim for now. Normalize later if we introduce country codes.

Migration file: `supabase/migrations/20260419_blogs_famous_people_jsonld_fields.sql` unless a later migration already exists when implementation starts. Follow the style in `supabase/migrations/20260413_content_release_benchmarks.sql` (header comment, idempotent, drop/create pattern when needed).

Regenerate `database.types.ts` with `pnpm gen:types` (or the project's Supabase type script) after the migration lands.

### 3. Runtime schema builder

Create `src/lib/utils/personJsonLd.ts` exporting:

```ts
export interface PersonJsonLdFaq {
	question: string;
	answer: string;
	anchor?: string; // visible H2/H3 id — enables deep-link url on acceptedAnswer
}

export interface PersonJsonLdInput {
	personName: string; // formatted display name, e.g. "Taylor Swift"
	canonicalUrl: string;
	breadcrumb: BreadcrumbItem[];
	title: string;
	description: string;
	articleBody?: string; // 1–2 sentence synopsis (persona_title + description)
	datePublished: string;
	dateModified: string;
	imageUrl?: string;
	imageWidth?: number;
	imageHeight?: number;

	// Topical + identity
	keywords?: string[];
	sameAs?: string[]; // already validated/deduped
	identifiers?: Array<{ propertyID: string; value: string }>; // wikidata, imdb, etc.

	// Person attributes
	birthDate?: string; // ISO 8601 date
	birthPlace?: string;
	nationality?: string;
	jobTitle?: string; // first of occupation[]
	hasOccupation?: string[]; // full occupation list
	knowsAbout?: string[];

	// Article sourcing
	citations?: string[]; // URL list — becomes Article.citation
	wordCount?: number; // auto-computed upstream
	timeRequired?: string; // ISO 8601 duration, e.g. "PT14M" — auto-computed upstream

	// FAQs (pre-validated visible)
	faqs?: PersonJsonLdFaq[];

	// Defaults
	articleSection?: string; // defaults to "Personality Analysis"
	inLanguage?: string; // defaults to "en-US"
	speakableSelectors?: string[]; // defaults to site-wide constant
}

export function buildPersonPageJsonLd(input: PersonJsonLdInput): JsonLdValue;
```

`JsonLdValue` is currently a private type in `src/lib/utils/schema.ts`. Either export it from there or define a local `JsonLdNode` / `JsonLdValue` type in `personJsonLd.ts`; don't import a private type.

Output shape (deterministic — field ordering matters for diff-ability):

```jsonc
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",               // NOT BlogPosting — see microdata fix below
      "@id": "{canonicalUrl}#article",
      "headline": "…",
      "description": "…",
      "articleBody": "…",
      "articleSection": "Personality Analysis",
      "inLanguage": "en-US",
      "keywords": ["…"],
      "wordCount": 2840,
      "timeRequired": "PT14M",
      "isAccessibleForFree": true,
      "datePublished": "…",
      "dateModified": "…",
      "author": { "@id": "https://9takes.com/#dj-wayne" },
      "publisher": { "@id": "https://9takes.com/#organization" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "{canonicalUrl}" },
      "isPartOf": { "@id": "https://9takes.com/personality-analysis#blog" },
      "image": { "@type": "ImageObject", "url": "…", "width": 900, "height": 900 },
      "about": { "@id": "{canonicalUrl}#person" },
      "mentions": { "@id": "{canonicalUrl}#person" },
      "citation": [
        "https://en.wikipedia.org/wiki/Taylor_Swift",
        "https://www.vogue.com/article/…"
      ],
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".firstLetter", "details > div.panel", "h2 + p:first-of-type"]
      }
    },
    {
      "@type": "Person",
      "@id": "{canonicalUrl}#person",
      "name": "Taylor Swift",
      "birthDate": "1989-12-13",
      "birthPlace": { "@type": "Place", "name": "West Reading, Pennsylvania, USA" },
      "nationality": { "@type": "Country", "name": "American" },
      "jobTitle": "Singer-songwriter",
      "hasOccupation": [
        { "@type": "Occupation", "name": "Singer-songwriter" },
        { "@type": "Occupation", "name": "Record producer" }
      ],
      "knowsAbout": ["Pop music", "Country music", "Songwriting"],
      "sameAs": [
        "https://en.wikipedia.org/wiki/Taylor_Swift",
        "https://www.wikidata.org/wiki/Q26876",
        "https://www.imdb.com/name/nm1728342/",
        "…"
      ],
      "identifier": [
        { "@type": "PropertyValue", "propertyID": "wikidata", "value": "Q26876" },
        { "@type": "PropertyValue", "propertyID": "imdb",     "value": "nm1728342" }
      ]
    },
    {
      "@type": "Person",
      "@id": "https://9takes.com/#dj-wayne",
      "name": "DJ Wayne",
      "sameAs": ["https://www.instagram.com/djwayne3/", "…"]
    },
    {
      "@type": "Organization",
      "@id": "https://9takes.com/#organization",
      "name": "9takes",
      "url": "https://9takes.com/",
      "logo": { "@type": "ImageObject", "url": "https://9takes.com/brand/darkRubix.png" },
      "sameAs": ["https://www.instagram.com/9takesdotcom/", "https://twitter.com/9takesdotcom"]
    },
    {
      "@type": "Blog",
      "@id": "https://9takes.com/personality-analysis#blog",
      "name": "9takes Personality Analysis",
      "url": "https://9takes.com/personality-analysis",
      "publisher": { "@id": "https://9takes.com/#organization" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "{canonicalUrl}#breadcrumb",
      "itemListElement": [ … ]
    },
    {
      "@type": "FAQPage",
      "@id": "{canonicalUrl}#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "…",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "…",
            "author": { "@id": "https://9takes.com/#dj-wayne" },
            "url": "{canonicalUrl}#anchor"
          }
        }
      ]
    }
  ]
}
```

Rules enforced by the builder:

- Omit `FAQPage` node entirely if `faqs` is empty, has < 2 items, or has not already passed the visible-source validation step upstream.
- Omit `keywords` key if array is empty.
- Omit `citation` key if `citations` is empty.
- Omit `image` node if `imageUrl` is absent.
- Omit any `Person` attribute (`birthDate`, `birthPlace`, `nationality`, `jobTitle`, `hasOccupation`, `knowsAbout`) whose input is absent — no null/empty keys.
- Omit `identifier` array entirely if both `wikidata_qid` and `imdb_id` are absent; otherwise emit only the entries present.
- `acceptedAnswer.url` on each FAQ `Question` is emitted only when the FAQ has an `anchor` field (so the deep link resolves to visible content).
- `sameAs` on the Person node: dedupe using `buildPersonSameAsUrls` logic (expanded — see below). Wikidata QID and IMDb ID auto-expand into Wikidata/IMDb URLs as part of the merge input.
- `speakable.cssSelector` defaults to `[".firstLetter", "details > div.panel", "h2 + p:first-of-type"]` — override via `speakableSelectors` only for unusual layouts.
- `wordCount` / `timeRequired`: computed by the caller (page server load or a helper in `src/lib/server/blogContentProcessor.ts`) — the builder just passes them through. Rule: `timeRequired = PT{ceil(wordCount / 200)}M`.
- `@id` values are stable and internal-reference-ready (uses `{canonicalUrl}#article`, `#person`, `#faq`, `#breadcrumb`; site-global ids for `#dj-wayne`, `#organization`, and the `personality-analysis#blog` anchor).

Unit tests: `src/lib/utils/personJsonLd.spec.ts`. Cover:

- Full input (every field populated) produces full graph (snapshot).
- Minimum input (only required fields) produces Article + Person + Author + Organization + Blog + Breadcrumb (no FAQPage, no identifier, no citations, no person attributes).
- Empty `faqs` omits FAQPage node.
- One visible FAQ item still omits FAQPage node (project quality rule requires 2+).
- FAQ with `anchor` set → `acceptedAnswer.url` equals `{canonicalUrl}#{anchor}`; FAQ without `anchor` → no `url` on `acceptedAnswer`.
- Empty `keywords` omits keywords field.
- Empty `citations` omits `citation` field.
- Only `wikidata_qid` present → `identifier` has one entry; only `imdb_id` present → one entry; both → two entries; neither → key omitted.
- `wikidata_qid` and `imdb_id` auto-expand into `sameAs` URLs and dedupe against any already-provided equivalents.
- Person attributes: each of `birthDate`, `birthPlace`, `nationality`, `jobTitle`, `hasOccupation`, `knowsAbout` individually omitted when absent.
- `occupation: ['A', 'B', 'C']` → `jobTitle: 'A'` + `hasOccupation` array of length 3.
- `speakable` defaults to the baseline selector set; override replaces it.
- `timeRequired` format matches `^PT\d+M$`.
- Missing `imageUrl` omits image node.
- Deterministic output: same input run twice → `JSON.stringify` equal.

### 4. Expand `buildPersonSameAsUrls` (same file: `src/lib/utils/schema.ts`)

Today it only handles 4 platforms. Extend `SupportedPersonSocialPlatform` to include:

- `imdb` — `https://www.imdb.com/name/{id}/`
- `youtube` — `https://www.youtube.com/{handle}` or `/@{handle}`
- `spotify` — `https://open.spotify.com/artist/{id}`
- `website` — pass-through absolute HTTPS URL

Or, simpler: accept a `same_as?: string[]` array in the options that's merged + deduped alongside the per-platform normalized entries. This is what the new frontmatter will supply.

Important implementation detail: explicit `sameAs` array entries are not the same as legacy handle fields. For explicit entries, validate with `new URL(value)` and require `protocol === 'https:'`. Reject sentinel values and non-URLs before deduping. Legacy fields can continue through platform-specific normalization, but any returned absolute URL should also be HTTPS-normalized before inclusion.

Recommended signature:

```ts
export function buildPersonSameAsUrls(options: {
	sameAs?: string[] | null; // from new frontmatter `same_as` / DB `same_as`
	wikidataQid?: string | null; // e.g. "Q26876" — becomes https://www.wikidata.org/wiki/Q26876
	imdbId?: string | null; // e.g. "nm1728342" — becomes https://www.imdb.com/name/nm1728342/
	// legacy fallbacks (keep until all drafts migrated)
	wikipedia?: string | null;
	fallbackWikipedia?: string | null;
	twitter?: string | null;
	instagram?: string | null;
	tiktok?: string | null;
}): string[];
```

Merge order: explicit `sameAs` first, then Wikidata + IMDb derivations, then legacy-field-derived URLs, then dedupe. Validate `wikidataQid` against `^Q\d+$` and `imdbId` against `^nm\d+$`; reject and warn on mismatch.

A sibling helper returns the structured `identifier` array:

```ts
export function buildPersonIdentifiers(options: {
	wikidataQid?: string | null;
	imdbId?: string | null;
}): Array<{ '@type': 'PropertyValue'; propertyID: string; value: string }>;
```

Add `schema.spec.ts` coverage for:

- explicit `sameAs` values merge before legacy fallbacks;
- `wikidataQid: 'Q26876'` produces `https://www.wikidata.org/wiki/Q26876` in `sameAs` and a matching `identifier` entry;
- `imdbId: 'nm1728342'` produces `https://www.imdb.com/name/nm1728342/` in `sameAs` and a matching `identifier` entry;
- invalid `wikidataQid` (`'Q'`, `'q26876'`, `'Q 26876'`) and `imdbId` (`'tt1234567'`, `'NM1234567'`) are rejected and logged;
- duplicate URLs are deduped case-insensitively and ignoring trailing slashes (a user-supplied `same_as` Wikidata URL must not double up with the `wikidata_qid`-derived URL);
- `http://`, relative paths, blank strings, `"none"`, and `"n/a"` are rejected from explicit `sameAs`;
- legacy fallback values still produce Wikipedia/Twitter/Instagram/TikTok URLs.

### 5. Wire into `PeopleBlogPageHead.svelte`

Replace the current `jsonLdString` derivation (lines 67–134) with a single call:

```ts
const jsonLdString = $derived.by(() =>
	JSON.stringify(
		buildPersonPageJsonLd({
			personName,
			canonicalUrl,
			breadcrumb: [
				/* Home, Personality Analysis, personName */
			],
			title,
			description,
			articleBody: `${data.persona_title ? data.persona_title + '. ' : ''}${description}`,
			datePublished: publishedAt,
			dateModified: modifiedAt,
			imageUrl: shareImageUrl,
			imageWidth: 900,
			imageHeight: 900,

			keywords: data.keywords ?? [],
			sameAs: buildPersonSameAsUrls({
				sameAs: data.same_as,
				wikidataQid: data.wikidata_qid,
				imdbId: data.imdb_id,
				wikipedia: data.wikipedia,
				fallbackWikipedia: wikipediaName ? `https://en.wikipedia.org/wiki/${wikipediaName}` : null,
				twitter: data.twitter,
				instagram: data.instagram,
				tiktok: data.tiktok
			}),
			identifiers: buildPersonIdentifiers({
				wikidataQid: data.wikidata_qid,
				imdbId: data.imdb_id
			}),

			birthDate: data.birth_date,
			birthPlace: data.birth_place,
			nationality: data.nationality,
			jobTitle: data.occupation?.[0],
			hasOccupation: data.occupation ?? [],
			knowsAbout: data.knows_about ?? [],

			citations: data.citations ?? [],
			wordCount: data.word_count, // passed via page load — see note below
			timeRequired: data.time_required, // passed via page load — see note below

			faqs: data.faqs ?? []
		})
	)
);
```

`word_count` and `time_required` are computed in `src/routes/personality-analysis/[slug]/+page.server.ts` (or inside `processBlogContent`) from the rendered content, then passed down through the `post` payload — keep them off the DB. Rule: `timeRequired = \`PT${Math.max(1, Math.ceil(wordCount / 200))}M\``.

Delete:

- `breadcrumbJsonLd` derivation (now inside the graph).
- The second `<script>` tag in `<svelte:head>` (lines 192–194).
- The `parseJsonLdSnippet` / `updateJsonLdDateModified` / `mergePersonSameAsIntoJsonLd` path for people pages. (Those helpers stay in `schema.ts` — they're used for the one-time backfill and potentially by other routes.)

End result: one `<script type="application/ld+json">` tag per page, containing one `@graph`.

Also update `src/routes/personality-analysis/[slug]/+page.svelte`'s `normalizePost()` so the new fields and the existing `persona_title` survive with predictable types before being passed into `PeopleBlogPageHead.svelte`:

- `persona_title: toStringValue(post.persona_title)`
- `keywords: toStringArray(post.keywords)`
- `same_as: toStringArray(post.same_as)`
- `wikidata_qid: toStringValue(post.wikidata_qid) || undefined`
- `imdb_id: toStringValue(post.imdb_id) || undefined`
- `birth_date: toStringValue(post.birth_date) || undefined`
- `birth_place: toStringValue(post.birth_place) || undefined`
- `nationality: toStringValue(post.nationality) || undefined`
- `occupation: toStringArray(post.occupation)`
- `knows_about: toStringArray(post.knows_about)`
- `citations: toStringArray(post.citations)`
- `faqs: normalizeFaqItems(post.faqs)` where invalid items and items with no visible anchor/body evidence are dropped

The `+page.server.ts` load step should additionally compute `word_count` and `time_required` from the processed content (reuse whatever `processBlogContent` produces, or add a plain-text scan) and pass them on the `post` payload.

The code sample above reads `data.persona_title`; without this route/type update, the cutover will typecheck poorly and `articleBody` will silently lose the persona-title lead-in.

### 6. Update `App.BlogPost` in `src/app.d.ts`

Add:

```ts
persona_title?: string;
keywords?: string[];
same_as?: string[];
faqs?: PersonJsonLdFaq[];        // { question, answer, anchor? }

wikidata_qid?: string;
imdb_id?: string;
birth_date?: string;
birth_place?: string;
nationality?: string;
occupation?: string[];
knows_about?: string[];
citations?: string[];

// computed at load time, not persisted
word_count?: number;
time_required?: string;          // ISO 8601 duration
```

Import or define `PersonJsonLdFaq` for the ambient type file. Keep the type broad enough for Supabase JSON during rollout if needed (`PersonJsonLdFaq[] | null` is acceptable until generated DB types are refreshed).

Remove the `jsonld_snippet?: unknown` field once the backfill + rollout is complete (keep during rollout — see Rollout below).

### 7. Update `scripts/personBlogParser.js`

Changes:

- `parseMarkdownFile` (line 509): read every new field from frontmatter — `data.keywords`, `data.same_as`, `data.faqs`, `data.wikidata_qid`, `data.imdb_id`, `data.birth_date`, `data.birth_place`, `data.nationality`, `data.occupation`, `data.knows_about`, `data.citations`. Normalize (dedupe, trim, reject empty strings). Validate:
  - `faqs` items have both `question` and `answer` strings; log a warning and drop invalid items.
  - `wikidata_qid` matches `^Q\d+$`; `imdb_id` matches `^nm\d+$`; on mismatch, log and drop.
  - `citations` entries are absolute HTTPS URLs; drop non-HTTPS or non-URL entries with a warning.
  - `birth_date` is a valid ISO 8601 date; drop and warn otherwise.
- Validate FAQ visibility before returning `faqs`: each item must match visible rendered content in the draft body (exact question text in a heading, `<QuickAnswer question="...">`, or `<details>` FAQ accordion; answer text should be present or traceable to the nearby visible answer block). If an FAQ has an `anchor`, confirm a heading with that id exists in the draft. If a frontmatter FAQ has no visible source, drop it from the emitted field and warn.
- Return record includes all the new fields.
- `insertIntoSupabase` (line 1010): include every new column in the `fields` template (line 1029). Both insert and update paths persist them.
- **Deprecate `extractJsonLd`** for the write path: stop calling it for the purpose of populating `jsonld_snippet`. Keep the function around for the one-time backfill (below), then delete after.
- During the deprecation window, keep writing `jsonld_snippet` but also write the new fields so a rollback is possible.

Add unit tests to `src/lib/server/personBlogParser.spec.ts`:

- Parses every new field from frontmatter.
- Drops a malformed FAQ (`{ question: 'Q' }` missing answer) and logs.
- Drops a well-formed FAQ that has no visible source in the draft body and logs.
- Drops a FAQ whose `anchor` id is not present as a heading in the body and logs.
- Dedupes a repeated URL in `same_as`.
- Rejects invalid `wikidata_qid` / `imdb_id` values with a warning.
- Rejects `citations` entries that are `http://` or non-URL strings.

### 8. One-time backfill script

`scripts/backfillPersonJsonLdFields.js`:

1. Read every row from `blogs_famous_people` where `jsonld_snippet IS NOT NULL`.
2. For each row:
   - Parse the `jsonld_snippet` (node or `@graph`).
   - Pull `keywords` from any `Article`/`BlogPosting` node.
   - Pull `sameAs` arrays from every `Person` node except the author (match on name ≈ `personName`).
   - Pull `mainEntity` from any `FAQPage` node → `faqs: [{ question, answer }]`.
   - Validate recovered FAQs against visible body content before writing them.
   - Write `keywords`, `same_as`, and visible-source-backed `faqs` columns via a Supabase update.
3. Print a per-row report: `person: keywords=N, same_as=N, faqs=N, faqs_skipped_hidden=N`.
4. If the legacy JSON-LD contains FAQPage entries that do not appear visibly in the page body, print `faqs_skipped_hidden=N` and do not populate `faqs` for those entries.
5. Dry-run by default; `--apply` to write.

This recovers the rich data from the 7 existing drafts and any other row where `jsonld_snippet` was populated historically, without carrying forward hidden FAQPage markup that would violate Google's visibility guideline.

### 9. Update the admin editor whitelist

`src/routes/api/admin/content/[id]/+server.ts` — add every new column name to `allowedFields` (line 91): `keywords`, `same_as`, `faqs`, `wikidata_qid`, `imdb_id`, `birth_date`, `birth_place`, `nationality`, `occupation`, `knows_about`, `citations`. Mirror the UI update in `src/routes/admin/content-board/ContentEditorModal.svelte` + `MetadataSidebar.svelte` so admins can edit them from the dashboard.

Add `src/routes/api/admin/content/[id]/content.server.spec.ts` coverage that every new field survives the PUT whitelist and is sent to Supabase, and that `wikidata_qid` / `imdb_id` validation errors return a 400 before hitting the DB.

(Out of scope for this task: a full FAQ editor UI with inline Q/A rows. Minimum viable: JSON textareas with `JSON.parse` validation on save and clear invalid-JSON errors. File a follow-up ticket for the nicer UI.)

### 10. Update blog creator commands

Both `.claude/commands/blog_content_creator_people.md` and `blog_content_creator_people_v2.md`:

- Remove the "don't include `<svelte:head>` with JSON-LD" instruction (still true, but reframe it).
- Add a new required frontmatter section with examples: `keywords`, `same_as`, `wikidata_qid`, `imdb_id`, `birth_date`, `birth_place`, `nationality`, `occupation`, `knows_about`, `citations`, `faqs`.
- For `faqs`, require 2–5 items sourced from **real H2 headings, visible `<QuickAnswer>` blocks, or accessible `<details>` FAQ accordions** in the draft. When the source is a heading, set `anchor` to that heading's id.
- Reframe the old "no visible FAQ" language: no bottom FAQ dump by default, but any emitted `FAQPage` must be backed by visible source content. JSON-LD-only FAQs are not Google-compliant.
- For `same_as`, include IMDb as a required-if-applicable field (for actors/public figures), plus YouTube/Spotify/website if the person has an official one.
- For `wikidata_qid`, require the author to look up the QID at wikidata.org during draft creation. This is the single highest-signal entity-linking field — never skip it for a well-known public figure.
- For `imdb_id`, require for anyone with an IMDb presence (actors, directors, hosts, notable interviewees).
- For `knows_about`, require 3–8 topic strings matching what the person is authoritative on (e.g. Taylor Swift → `['Pop music', 'Country music', 'Songwriting', 'Music industry']`). Powers LLM retrieval.
- For `citations`, require 3–10 HTTPS URLs to sources the article quotes or relies on. Pairs with the existing "attribute quotes to specific publications/dates" rule — the URLs go here.
- For `birth_date` / `birth_place` / `nationality` — required for historical/biographical analyses, optional when the post's framing deliberately avoids biography.
- Re-grade prompts should flag a draft as incomplete if: `faqs` has < 2 items, `keywords` has < 5, `wikidata_qid` is missing for a well-known figure, `citations` has < 3 entries, or `knows_about` has < 3 entries.

Update `src/blog/people/person-template.md` frontmatter to include every new field as an empty scaffold, with inline YAML comments explaining each.

### 11. Fix the Article-vs-BlogPosting microdata conflict

`src/routes/personality-analysis/[slug]/+page.svelte:351` — change:

```diff
- <article itemscope itemtype="https://schema.org/BlogPosting" class="blog">
+ <article itemscope itemtype="https://schema.org/Article" class="blog">
```

Keep `<meta itemprop="description">` on the same element; update any downstream CSS selectors that target `[itemtype*="BlogPosting"]` (grep first).

---

## Rollout Phases

### Phase 1 — Schema + builder (can ship alone)

1. Land migration `20260419_blogs_famous_people_jsonld_fields.sql` unless implementation starts after another same-day migration has landed.
2. Regenerate `database.types.ts`.
3. Add `src/lib/utils/personJsonLd.ts` + unit tests.
4. Extend `buildPersonSameAsUrls` + update its test.
5. Update `App.BlogPost` in `src/app.d.ts`.
6. Add `keywords`, `same_as`, `faqs` to admin PUT whitelist and its server test.

**At this point, the new columns exist, the builder works, nothing on the live site has changed.**

### Phase 2 — Backfill + parser

1. Run backfill dry-run, review sample.
2. Run backfill `--apply`. Spot-check 3 rows.
3. Update `scripts/personBlogParser.js` to read the new frontmatter fields and persist them (keep `jsonld_snippet` writes too, for safety).
4. Update `src/blog/people/person-template.md` and the creator commands.

**Site still renders from `jsonld_snippet` + auto-builder. Parser now writes both old and new columns.**

### Phase 3 — Renderer cutover

1. Swap `PeopleBlogPageHead.svelte` to use `buildPersonPageJsonLd`.
2. Fix microdata to `Article`.
3. Smoke-test 5 posts with Google's Rich Results Test / Schema Markup Validator — one with visible-source-backed FAQs, one without FAQs, one with only 1 FAQ (should skip FAQPage), one with only legacy `wikipedia/twitter/instagram/tiktok` (no new `same_as`), one with full new frontmatter. Treat the test as a syntax/error check, not a promise of FAQ rich-result eligibility.
4. Deploy.

**Live site now renders deterministic `@graph` from frontmatter + DB columns.**

### Phase 4 — Cleanup (separate PR, after Phase 3 has soaked for a week)

1. Remove `jsonld_snippet` writes from `personBlogParser.js`.
2. Remove `extractJsonLd`, `parseJsonLdSnippet`, `updateJsonLdDateModified`, `mergePersonSameAsIntoJsonLd`, and the `cleanupContent` `<svelte:head>` scrub (no longer needed — drafts won't have the tag).
3. Remove `jsonld_snippet` from `App.BlogPost`.
4. Drop the column:

   ```sql
   ALTER TABLE public.blogs_famous_people DROP COLUMN IF EXISTS jsonld_snippet;
   ```

5. Delete `scripts/fixjsonld.js` (one-shot, obsolete).
6. Delete `docs/planning/people-blog-faqpage-jsonld-tasker-2026-04-17.md` (superseded) — or archive.

### Phase 5 — Content backlog

Separate, ongoing. For each of the ~327 drafts missing the new fields:

- Generate candidate FAQs via a dedicated slash command from visible source content only (visible question headings, rendered `<QuickAnswer>` blocks, or accessible accordions). Set `anchor` to the heading id when sourced from a heading. Do not write hidden FAQ-only frontmatter.
- Generate `keywords` from title + persona_title + enneagram + type array.
- Generate `same_as` from the legacy `wikipedia/twitter/instagram/tiktok` fields plus an IMDb lookup pass.
- Fill `wikidata_qid` and `imdb_id` via a scripted Wikidata/IMDb lookup pass (batch the 327 entities — cheap with `wdtaxonomy` / `wikibase-cli` or a Node script hitting the Wikidata REST API).
- Fill `birth_date` / `birth_place` / `nationality` / `occupation` / `knows_about` from the Wikidata response where possible (Wikidata has `P569`, `P19`, `P27`, `P106`, etc.) — spot-check before writing.
- Harvest `citations` from existing article quotes by extracting URLs from footnotes / inline links / frontmatter research notes. Hand-review.
- Write them back to the draft frontmatter.
- `pnpm push:people Person-Name` to sync.

This is the bulk of the work but is parallelizable and reversible. Track with `docs/content-generation/blog-update-queue.md` or similar. The Wikidata lookup pass should be its own tracked sub-task — one hour of scripting saves hundreds of hand-lookups.

---

## Deliverables

- `supabase/migrations/20260419_blogs_famous_people_jsonld_fields.sql` (or later same-day/next migration prefix if one already exists)
- `src/lib/utils/personJsonLd.ts` (new)
- `src/lib/utils/personJsonLd.spec.ts` (new)
- `src/lib/utils/schema.ts` (extend `buildPersonSameAsUrls`)
- `src/lib/utils/schema.spec.ts` (add cases for `sameAs` merging)
- `src/lib/components/blog/PeopleBlogPageHead.svelte` (cutover)
- `src/routes/personality-analysis/[slug]/+page.svelte` (normalize new fields + microdata fix)
- `src/routes/api/admin/content/[id]/+server.ts` (whitelist update)
- `src/routes/api/admin/content/[id]/content.server.spec.ts` (whitelist test)
- `scripts/personBlogParser.js` (read/write new fields)
- `src/lib/server/personBlogParser.spec.ts` (new cases)
- `scripts/backfillPersonJsonLdFields.js` (new, one-shot)
- `src/app.d.ts` (BlogPost type update)
- `src/blog/people/person-template.md` (scaffold new fields)
- `.claude/commands/blog_content_creator_people.md` (instructions update)
- `.claude/commands/blog_content_creator_people_v2.md` (instructions update)
- `database.types.ts` (regen)

---

## Acceptance Criteria

- [ ] `pnpm check` passes.
- [ ] `pnpm test:unit` passes (including new `personJsonLd.spec.ts`).
- [ ] `supabase/migrations/20260419_…` (or the implementation-date successor) applies cleanly to local + remote.
- [ ] `database.types.ts` reflects every new column (`keywords`, `same_as`, `faqs`, `wikidata_qid`, `imdb_id`, `birth_date`, `birth_place`, `nationality`, `occupation`, `knows_about`, `citations`).
- [ ] Backfill dry-run report shows the 7 rich-snippet rows getting `keywords` and `same_as` candidates, and reports `faqs` only for rows where the FAQ content is visible on the page body. Hidden legacy FAQPage entries are counted as `faqs_skipped_hidden`, not populated.
- [ ] One `<script type="application/ld+json">` per `/personality-analysis/[slug]` page in production (verify via curl + grep).
- [ ] Rich Results Test / Schema Markup Validator reports no critical structured-data errors on 3 visible-source-backed FAQPage posts, while noting 9takes should not expect Google FAQ rich-result eligibility unless Google's site-category policy changes.
- [ ] Rich Results Test / Schema Markup Validator validates Article/Breadcrumb structured data on a post where `faqs` is empty (ensures FAQPage omission doesn't break Article).
- [ ] On a sample pilot post with `wikidata_qid` populated, curl the page and confirm the `Person` node contains both `sameAs: "https://www.wikidata.org/wiki/Q…"` and `identifier: [{ propertyID: "wikidata", value: "Q…" }]`.
- [ ] On the same pilot post, confirm `Article.citation` is an array of HTTPS URLs, `Article.wordCount` is a positive integer, `Article.timeRequired` matches `^PT\d+M$`, and `Article.speakable.cssSelector` is present.
- [ ] Microdata on `<article>` declares `Article`, matching JSON-LD.
- [ ] Admin editor accepts and saves edits to every new field (even if via JSON textarea for now).
- [ ] `person-template.md` includes scaffolded new fields with inline explanatory comments.
- [ ] Both creator commands prompt for every new field and fail the re-grade when `wikidata_qid` is missing for a well-known figure, `citations` has < 3 entries, or `knows_about` has < 3 entries.

---

## Out of Scope

- A polished editor UI in the admin for `faqs` / `keywords` / `same_as` / the person-attribute block / `citations` (JSON textareas + simple string inputs are fine for Phase 1–3; file follow-up ticket for a richer UI, including per-row FAQ editing with inline anchor pickers).
- Structured data for `/personality-analysis/categories/[slug]` (already shipped 2026-04-16).
- Structured data for non-people blog routes (enneagram-corner, pop-culture, etc.) — separate task.
- Retroactively populating every new field for the 327 legacy drafts (that's Phase 5, a content task, not an engineering task).
- `aggregateRating` / `Review` schema (we are analyzing, not reviewing).
- `VideoObject` / `AudioObject` — only add when a page actually embeds media.
- `Award` arrays on Person (high maintenance, low return vs. naming awards in body text).
- Full Schema.org `Occupation` objects with descriptions / salary / qualifications (we emit simple `Occupation` objects with just `name`).
- llms.txt file.

---

## Open Questions (flag during research pass, not blockers)

1. **Keywords casing.** Lowercase or Title Case? Google doesn't care, but internal consistency matters. Pick one in the creator commands.
2. **`image` width/height.** Currently hardcoded 900x900. Confirm that's still accurate for `buildPersonalityImageUrl` outputs, or derive from `sharp` metadata server-side.
3. **`articleBody` length.** Schema.org wants the full body, but we've been shipping a 1-sentence synopsis. Keep synopsis (cheaper, still valid) or render full body text (better for LLM extraction, ~3–5KB per page head). Recommended: synopsis for now, measure LLM citation lift independently.
4. **Do we need `Person.url`?** In addition to `sameAs`, Schema.org allows a primary `url` field. If the person has a single canonical website, it could live there and drop out of `same_as`. Not required — flag for later.
5. **Should `same_as` on Author (DJ Wayne) live in a shared constant?** Currently hardcoded in `PeopleBlogPageHead.svelte:77-82`. Move to `src/lib/utils/personJsonLd.ts` as a `DJ_WAYNE_SAME_AS` const so enneagram-corner, pop-culture etc. can share it. Cheap, do it.
6. **Biographical opt-out.** For posts whose framing deliberately avoids biographical context (e.g. a concept-first "Why Type 8s dominate" piece that uses the person as illustration), should `birth_date` / `birth_place` / `nationality` be required or optional? Recommended: optional in the schema, but the re-grade prompt should flag a well-known figure with zero person attributes as a draft warning, not a blocker.
7. **`knowsAbout` vs `keywords` overlap.** Both can look similar ("Pop music" could appear in either). Rule of thumb: `keywords` targets what people search for ("Taylor Swift Enneagram"); `knowsAbout` targets what this entity is authoritative on ("Pop music", "Songwriting"). Document this distinction in the creator commands so authors don't duplicate.
8. **Wikidata QID freshness.** QIDs are extremely stable, but they can merge or redirect. Schedule a yearly batch check (e.g. a cron script that calls the Wikidata API for every stored QID and logs any that return redirects). Not a launch blocker.
9. **`timeRequired` reading speed.** 200 wpm is a conservative general-reader assumption. Per-genre tuning (personality analysis tends to be denser → slower) could push to 180 wpm. Pick one, document it, move on.
10. **`Article.citation` as URL string vs `CreativeWork` object.** Schema.org accepts both. URL strings are 10× cheaper to author. Upgrade to `CreativeWork` objects only if we start seeing concrete AEO lift data that ties structured citation metadata to citation rate.

---

## Files to Read First (in order)

1. `src/lib/components/blog/PeopleBlogPageHead.svelte` — the file being rewritten.
2. `src/lib/utils/schema.ts` — existing helpers to extend/replace.
3. `scripts/personBlogParser.js` — parser to update.
4. `src/routes/api/admin/content/[id]/+server.ts` — admin PUT whitelist.
5. `src/routes/personality-analysis/[slug]/+page.svelte` — microdata fix site.
6. `docs/planning/people-blog-faqpage-jsonld-tasker-2026-04-17.md` — the prior plan this supersedes.
7. One of the 7 rich-snippet drafts (e.g. `src/blog/people/drafts/Addison-Rae.md` lines 326–500) — reference for what the backfill needs to extract.
8. `supabase/migrations/20260413_content_release_benchmarks.sql` — migration style example.

---

## Success Looks Like

Every `/personality-analysis/[slug]` page, regardless of author vintage, ships:

- One `@graph` JSON-LD block.
- Article + Person + Author + Organization + Blog + BreadcrumbList + (when applicable) FAQPage.
- Accurate `sameAs` covering Wikipedia, Wikidata, IMDb, and every live social presence, plus a structured `identifier` array for Wikidata QID and IMDb nconst (the single highest-signal entity-linking move available).
- A real `Person` profile — `birthDate`, `birthPlace`, `nationality`, `jobTitle`, `hasOccupation`, `knowsAbout` — letting Google and LLMs build a fuller entity for the subject.
- `Article.citation` listing the actual sources we quoted, so LLMs can grade the post's evidence before deciding to cite us back.
- `Article.speakable` selectors pointing AI Overviews and voice assistants at the intro + TL;DR for extractive summarization.
- Auto-computed depth signals — `wordCount`, `timeRequired`, `articleSection`, `inLanguage`, `isAccessibleForFree`, `isPartOf` Blog reference.
- Keywords reflecting the post's actual topical focus (and not duplicating `knowsAbout`).
- Deterministic output: the same frontmatter + DB row produces byte-identical JSON-LD on every render.

Rebuilding the schema is a search-and-replace on the frontmatter, not a bespoke `<script>` edit. Authors stop writing JSON-LD. Admins stop worrying about drift. The renderer is the only place the graph shape lives.

The payoff is twofold. Google's Knowledge Graph can confidently link `{canonicalUrl}#person` to the canonical Wikidata/IMDb entity, which is how Knowledge Panel wins happen. LLM retrieval pipelines (Perplexity, ChatGPT Search, Gemini, Claude) have richer `about`/`mentions`/`citation`/`knowsAbout` signals to grade 9takes as an authoritative source on a given personality, which is how citation rate goes up.
