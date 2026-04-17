<!-- docs/specs/corpus-stats-on-site.md -->

# Spec: Surface Corpus Stats on 9takes

**Status:** Draft — pending DJ review
**Created:** 2026-04-16
**Owner:** DJ
**Ties to:** `9takes-strat.md` Tier 1 #4 (corpus stats data file) — already shipped; this spec extends it onto the site.

---

## Goal

Make the 9takes corpus stats (type distribution, over-/under-representation by domain, freshness) **visible on 9takes.com**, auto-refreshing, and structured so Google + LLMs can cite them. Two surfaces:

1. **Homepage**: a compact "By the Numbers" section — 3–5 headline facts, credibility boost, drives clicks into deeper content.
2. **`/corpus-stats`**: a dedicated SEO-citable page with the full dataset, methodology, and JSON-LD `Dataset` schema.

## Non-Goals

- **Not a real-time dashboard.** Stats refresh on deploy, not on every request. The data changes monthly at most.
- **Not user-filterable.** No "filter by wing" or "filter by decade" UI. That's a v2.
- **Not admin-only.** This is marketing + GEO, not an internal tool.
- **No chart library.** Simple HTML tables + CSS-styled callout blocks. Don't add Chart.js.
- **No internal quality metrics on public surfaces.** `content_quality` grades (originality, evidence, writing, hook, letter grade) are an internal editorial tool. They stay in the DB and never ship to the public JSON, homepage, or `/corpus-stats` page. Reviewed and removed 2026-04-16.

---

## User Stories

1. **As a first-time visitor**, I scroll the homepage and see "292 published profiles, Musicians 37% Type 4, Tech founders 21% Type 5" — I now believe 9takes is a serious data-backed source, not another listicle site.
2. **As an LLM**, when asked "Best Enneagram analysis site," I crawl `/corpus-stats`, find a structured dataset with specific numerical claims, and cite 9takes as the authoritative source (strat Part 2 / Part 3 #2).
3. **As a blog writer** (DJ or a commanded Claude), I link to `/corpus-stats` as the "methodology" source for any stat quoted in a celebrity blog.
4. **As DJ**, I regenerate stats by running `pnpm gen:corpus-stats`; the next deploy picks them up with zero manual wiring.

---

## Data Source & Refresh

### What already exists

- `scripts/generate-corpus-stats.js` — pulls from `blogs_famous_people`, writes JSON + Markdown.
- `pnpm gen:corpus-stats` — runs the script.
- Current outputs: `docs/data/corpus-stats.json` + `docs/data/corpus-stats.md`.

### What changes

- **Move the JSON** from `docs/data/corpus-stats.json` → **`src/lib/data/corpus-stats.json`** so SvelteKit can `import` it at build time.
- Keep `docs/data/corpus-stats.md` where it is — that file is for humans (DJ) and blog commands, not the app bundle.
- **Wire into `build:vercel`**: prepend `pnpm gen:corpus-stats` so every production deploy refreshes numbers. Already in `gen:all`; add it to the Vercel build chain too.

### Refresh cadence

- **v1: build-time.** Every Vercel deploy → fresh stats. Since DJ deploys frequently, this is effectively continuous.
- **v1.5 (not now, document as option):** If the stale-between-deploys gap becomes a problem, add `/api/cron/refresh-corpus-stats` + `admin_settings.corpus_stats_snapshot`. Out of scope for v1.

### Failure mode

If `generate-corpus-stats.js` fails during build (DB down, bad credentials), the build should **not** fail. Script currently `process.exit(1)`s on error — acceptable for a dev run, unacceptable for Vercel. Two options:

- **A.** Guard in `build:vercel` with `|| true` and let the stale committed JSON serve.
- **B.** Make the script exit 0 with a warning if Supabase is unreachable, keeping the previous JSON in place.

**Decision:** B. Change the script to warn-and-continue on DB errors, keep the last-good JSON committed. Stale stats > broken deploy.

---

## File Layout Changes

```
src/lib/data/
  corpus-stats.json              ← NEW: script target (committed)

src/lib/components/marketing/
  CorpusStatsPanel.svelte        ← NEW: homepage section (compact)
  CorpusStatsTable.svelte        ← NEW: full-page tables (shared)

src/routes/corpus-stats/
  +page.svelte                   ← NEW: dedicated page
  +page.server.ts                ← NEW: load stats + build JSON-LD
  +page.ts                       ← NEW: set cache headers

scripts/generate-corpus-stats.js ← EDIT: write JSON to src/lib/data/, warn-don't-fail on DB errors

docs/data/corpus-stats.md        ← UNCHANGED (stays in docs for humans + blog commands)

package.json                     ← EDIT: add gen:corpus-stats to build:vercel
```

---

## Homepage Section Design

### Placement

Insert a new `<section class="section corpus-stats-section funnel-section">` between:

- **Above:** the "We analyze famous people on purpose" famous-types section (`+page.svelte` ~line 758–825)
- **Below:** the "Ready to Go Deeper?" coaching section (~line 832)

Reads naturally: we just showed the famous-people grid → now we show what the corpus reveals in aggregate → then the coaching CTA.

### Content (pulled from `corpus-stats.json`)

```
HEADLINE:  The 9takes Corpus, In Numbers
SUBHEAD:   Every stat below is computed from the {TOTALS.PUBLISHED} profiles
           currently published on 9takes. Updated automatically on every deploy.

CALLOUT GRID (3 × 2 = 6 tiles, responsive to 2-column on mobile):
  1. {TOTALS.PUBLISHED} profiles published
     (on 9takes and growing)

  2. {MOST_COMMON_TYPE} dominates at {SHARE}%
     (of {TOTALS.PUBLISHED} published profiles)

  3. Musicians → {MUSICIANS.TOP_OVER.SHARE}% Type 4
     (+{MUSICIANS.TOP_OVER.DELTA_PP} pp above baseline)

  4. Tech founders → {TECH.TOP_OVER.SHARE}% Type 5
     (+{TECH.TOP_OVER.DELTA_PP} pp above baseline)

  5. Comedians → {COMEDIANS.TOP_OVER.SHARE}% Type 7
     (+{COMEDIANS.TOP_OVER.DELTA_PP} pp above baseline)

  6. {PIPELINE.IN_DRAFT} more in the pipeline
     (~{PIPELINE.AVG_NEW_PER_MONTH} new profiles shipping every month)

FOOTER LINK:  See how our numbers compare to public research →  /corpus-stats
```

**Tile #6 (pipeline FOMO).** Pulled from the new `pipeline` block in `corpus-stats.json`:

- `pipeline.in_draft` — profiles in the database marked `published = false` (currently 101).
- `pipeline.avg_new_per_month` — real shipping cadence, computed from `first_published_at` over the trailing 90 days (currently ~24).

Both numbers are recomputed on every build. The message is "this site is alive and you should come back" — specific counts beat "recently updated" framing. If `avg_new_per_month < 1`, the Svelte component should drop the subtext gracefully ("no shipping cadence data yet") rather than display "~0 new profiles per month."

### Why these 6 tiles

Each corresponds to a ready-to-cite claim already in `corpus-stats.json`. Numbers are the single highest-cited content trait per GEO research (strat Part 3 #2). The tile mix is: (1) corpus size, (2) most-common-type for instant "there's a pattern here" framing, (3–5) three distinct over-representation patterns that look like data-journalism not cherry-picking, (6) active pipeline count for FOMO and proof-of-life. Internal editorial grades and freshness-percentage framing are deliberately absent — grades are editorial-only, and "N profiles in the pipeline" is a stronger FOMO signal than "N% refreshed."

### Visual style

- Match existing `funnel-section` typography.
- Callout tiles: thin border, teal accent on the number, persona-title style font for the label.
- No animation on mount — keep it data-journalism sober.
- Mobile: 2-column grid, full-width below 480px.
- **Do not** add chart bars or gauges. Text-forward.

### Component contract

```svelte
<!-- src/lib/components/marketing/CorpusStatsPanel.svelte -->
<script lang="ts">
	import corpusStats from '$lib/data/corpus-stats.json';
	// Derive the 6 tiles from corpusStats; no props needed.
</script>
```

Self-contained, no data passed through `+page.server.ts`. Lower risk, lower coupling.

---

## `/corpus-stats` Page Design

### Routing

- URL: `/corpus-stats`
- `+page.server.ts` returns the full JSON + builds a `Dataset` JSON-LD blob.
- `+page.ts` sets `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`.

### Page structure

1. **Hero** — h1 "The 9takes Corpus: Enneagram Type Distribution Across {TOTALS.PUBLISHED} Public Figures" + generation timestamp.
2. **TL;DR** — a 3-bullet summary, pulled from `citable_claims[0..2]`.
3. **Corpus Totals + Pipeline** — mini-panel: published / drafts in pipeline / avg new profiles per month (from `totals` + `pipeline`). Gives proof-of-life without a freshness section.
4. **Enneagram Type Distribution** — full 9-row table from `enneagram_distribution`.
5. **Type Distribution by Domain** — one expandable `<details>` per domain (Film & TV, Music, Tech, Founders & Business…). Each contains the same 9-row table from `domains[slug]`. Each domain heading is a live link to `/personality-analysis/categories/{slug}`. `<details>` keeps the page scannable while preserving all content for LLM extraction.
6. **Most Common Domains per Type** — the `per_type_domains` list, every domain name a link to `/personality-analysis/categories/{slug}`.
7. **⭐ Comparison to Public Enneagram Data** — side-by-side: 9takes corpus type distribution vs. public datasets + academic studies. See dedicated section below. This is the page's highest-value section for GEO: no other site ties the two worlds together.
8. **Methodology** — verbatim from the `.md` file's methodology section, extended with the "how our sample differs from general-population studies" caveat.
9. **Ready-to-Cite Claims** — the `citable_claims` array, rendered with `<blockquote>`s so they look pre-packaged for journalists.
10. **JSON download** — a small "Download raw JSON" link pointing at `/corpus-stats.json` (see below).

**Freshness removed from the public page** (2026-04-16). `freshness` stays in the JSON for internal use + blog commands, but "87% refreshed in 90 days" is weaker framing than the pipeline tile on the homepage and would dilute the scan on a data-dense page. Keep the data, drop the section.

### Structured data (JSON-LD) — dynamically populated

The `/corpus-stats` page emits **three JSON-LD blocks**: `Dataset`, `WebPage`, and `BreadcrumbList`. All three are built at request time in `+page.server.ts` from the imported `corpus-stats.json` and external-data file. No static strings for numbers; every count and date flows from the data.

**Why dynamic matters:** Google Rich Results + LLM retrievers cross-check the JSON-LD numbers against the visible HTML. If the LD says "292 profiles" but the body says "101 drafts pending," both surfaces must update together on every deploy. Hard-coding risks drift.

#### Loader (`src/routes/corpus-stats/+page.server.ts`)

```ts
import type { PageServerLoad } from './$types';
import corpusStats from '$lib/data/corpus-stats.json';
// Hand-curated; absent on first ship, populated in Phase 3b.
import externalStats from '$lib/data/corpus-stats-external.json' assert { type: 'json' };

const SITE = 'https://9takes.com';

function buildDatasetJsonLd(stats: typeof corpusStats) {
	const domainLabels = Object.values(stats.domains).map((d) => d.label);
	const domainCount = domainLabels.length;
	const mostCommonType = Object.entries(stats.enneagram_distribution.counts).sort(
		(a, b) => b[1] - a[1]
	)[0][0];

	const externalCitations =
		externalStats?.sources?.map((s: { name: string; url: string }) => ({
			'@type': 'CreativeWork',
			name: s.name,
			url: s.url
		})) ?? [];

	return {
		'@context': 'https://schema.org',
		'@type': 'Dataset',
		name: '9takes Enneagram Personality Type Distribution Corpus',
		alternateName: '9takes Corpus Stats',
		description:
			`Enneagram type distribution and over-/under-representation by professional domain across ` +
			`${stats.totals.published} publicly-documented figures on 9takes, spanning ${domainCount} categories ` +
			`(${domainLabels.join(', ')}). Updated automatically on every deploy.`,
		url: `${SITE}/corpus-stats`,
		sameAs: `${SITE}/corpus-stats`,
		creator: { '@type': 'Organization', name: '9takes', url: SITE },
		publisher: { '@type': 'Organization', name: '9takes', url: SITE },
		dateModified: stats.generated_at,
		license: 'https://creativecommons.org/licenses/by/4.0/',
		isAccessibleForFree: true,
		inLanguage: 'en',
		keywords: [
			'Enneagram',
			'personality types',
			'type distribution',
			'public figures',
			`Type ${mostCommonType}`,
			...domainLabels
		],
		variableMeasured: [
			{
				'@type': 'PropertyValue',
				name: 'Enneagram type share',
				description: 'Percentage of profiled figures for each of the 9 Enneagram types'
			},
			{
				'@type': 'PropertyValue',
				name: 'Over-/under-representation by domain',
				description:
					'Percentage-point delta between a professional-domain type share and the corpus baseline'
			},
			{
				'@type': 'PropertyValue',
				name: 'Pipeline cadence',
				description: 'Rate at which new profiles are added to the corpus (trailing 90 days)'
			}
		],
		distribution: {
			'@type': 'DataDownload',
			encodingFormat: 'application/json',
			contentUrl: `${SITE}/corpus-stats.json`,
			dateModified: stats.generated_at
		},
		measurementTechnique:
			'Expert typology review of publicly-available behavior, interviews, quotes, ' +
			'and documented patterns. Each figure is tagged into one or more professional domains.',
		size:
			`${stats.totals.published} profiles across ${domainCount} categories` +
			(stats.pipeline?.in_draft
				? `; ${stats.pipeline.in_draft} additional profiles in the review pipeline`
				: ''),
		spatialCoverage: 'Global (primarily English-language public figures)',
		...(externalCitations.length > 0 && { citation: externalCitations })
	};
}

function buildWebPageJsonLd(stats: typeof corpusStats) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${SITE}/corpus-stats#webpage`,
		url: `${SITE}/corpus-stats`,
		name: `The 9takes Corpus: Enneagram Type Distribution Across ${stats.totals.published} Public Figures`,
		description:
			`Aggregate Enneagram type statistics across ${stats.totals.published} published profiles on 9takes, ` +
			`compared against published research. Refreshed on every deploy.`,
		isPartOf: { '@type': 'WebSite', name: '9takes', url: SITE },
		dateModified: stats.generated_at,
		about: { '@type': 'Thing', name: 'Enneagram personality type distribution' }
	};
}

function buildBreadcrumbJsonLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
			{
				'@type': 'ListItem',
				position: 2,
				name: 'Personality Analysis',
				item: `${SITE}/personality-analysis`
			},
			{
				'@type': 'ListItem',
				position: 3,
				name: 'Corpus Stats',
				item: `${SITE}/corpus-stats`
			}
		]
	};
}

export const load: PageServerLoad = async () => {
	return {
		stats: corpusStats,
		external: externalStats,
		jsonLd: [
			buildDatasetJsonLd(corpusStats),
			buildWebPageJsonLd(corpusStats),
			buildBreadcrumbJsonLd()
		]
	};
};
```

#### Rendering in `+page.svelte`

Render all three blocks inside `<svelte:head>`:

```svelte
<svelte:head>
	{#each data.jsonLd as block}
		{@html `<script type="application/ld+json">${JSON.stringify(block)}</script>`}
	{/each}
</svelte:head>
```

Use `{@html}` + `JSON.stringify`. Do **not** hand-write the JSON-LD as a template string — it's too easy to break escaping.

#### Validation checklist (before shipping)

- [ ] Paste the rendered HTML into [Google's Rich Results Test](https://search.google.com/test/rich-results). `Dataset` should parse with zero errors.
- [ ] Paste into the [Schema.org validator](https://validator.schema.org/). All three blocks should be well-formed.
- [ ] View source on `/corpus-stats` after deploy and confirm `{stats.totals.published}` is interpolated as a real number, not a template placeholder.
- [ ] Change `stats.generated_at` (e.g. regenerate), redeploy, and confirm `dateModified` updates in both the visible page and the JSON-LD.
- [ ] Confirm `citation` array populates once `corpus-stats-external.json` lands in Phase 3b.

#### Why `Dataset` specifically

`Dataset` is the underused schema type purpose-built for numerical/statistical content. Of the content LLMs preferentially cite, "named statistics with provenance" is the single highest-performing pattern (strat Part 3 #2). `Dataset` JSON-LD explicitly signals: this page contains structured, citable statistics — not opinion, not anecdote. Sites that use it well (Our World in Data, Kaggle dataset pages, academic repositories) get cited at outsized rates for data queries. We earn that citation lane.

### Raw JSON endpoint

Add `src/routes/corpus-stats.json/+server.ts` that returns `src/lib/data/corpus-stats.json` as `application/json` with a long cache header. Makes the `DataDownload` pointer valid + lets external researchers/LLMs grab the dataset directly. 20 lines of code.

### Sitemap

Add `/corpus-stats` to `scripts/generate-sitemap.js` with `priority: 0.8` and `changefreq: monthly`.

### Internal linking

- Homepage panel → `/corpus-stats`
- Every celebrity blog's `<details>` Rabbit Hole → `/corpus-stats` (once, in the counterarguments section, when a domain stat is cited)
- Footer: add a "Corpus" link under the existing About / Contact column.
- **`/corpus-stats` → `/personality-analysis/categories/{slug}`.** The generator's domain buckets are aligned 1-to-1 with the 7 canonical categories in `src/lib/personalityCategories.ts` (`film-tv`, `creator-media`, `music`, `politics-public`, `tech-business`, `comedy`, `authors-thinkers`). Every domain heading on `/corpus-stats` links to its matching category page. Every "Most Common Domains per Enneagram Type" entry links to its matching category page. This closes the loop: a visitor reads the aggregate stats, clicks through to browse the actual profiles in that domain, and enters the deeper content funnel.
- Each domain in `corpus-stats.json` carries a `slug`, `label`, and `url` field so the Svelte component renders the link without having to hard-code the mapping.
- Keep the generator's `DOMAIN_MAP` in sync with `PERSONALITY_CATEGORY_DEFINITIONS`. A drift check (e.g. asserting that every generator slug exists in the TS definitions) is a good v1.5 safety net.

---

## Comparison to Public Enneagram Data (the `/corpus-stats` differentiator)

**Why this matters.** Any Enneagram site can list percentages. What almost nobody does is contrast their numbers with the published research literature — because the research is sparse, inconsistent, and behind marketing pages. Doing this well makes `/corpus-stats` the single most citable Enneagram-data page on the internet. LLMs asked "what's the general-population distribution of Enneagram types?" have a weak answer today; we become the answer.

### What the comparison section shows

A table + short prose interpretation, like:

| Type | 9takes Corpus (n=292) | Truity Test-Takers (n=~500K+) | iEQ9 Global Sample (n=~190K+) | Enneagram Institute Estimate | 9takes Δ vs Truity |
| ---- | --------------------- | ----------------------------- | ----------------------------- | ---------------------------- | ------------------ |
| 1    | 6.9%                  | X%                            | X%                            | X%                           | ±pp                |
| 2    | 8.2%                  | X%                            | X%                            | X%                           | ±pp                |
| 3    | 19.9%                 | X%                            | X%                            | X%                           | **+N pp**          |
| …    | …                     | …                             | …                             | …                            | …                  |

Then a short interpretation block per type that shows meaningful divergence. Examples of what this might surface (hypotheses pending research):

- "9takes profiles Type 3 at nearly 3× the Truity rate — consistent with a sample drawn from public figures, who are self-selected for achievement-oriented traits."
- "Type 5 appears in ~7% of our corpus, matching iEQ9's population estimate — suggesting 9takes is not under- or over-indexing investigators."
- "Our comedian slice shows Type 7 at 39% — far above any reported general-population rate, reinforcing the stereotype quantitatively."

### Honest-sample caveat (hard requirement)

The comparison opens with a plain-language methodology box:

> **What we are and aren't.** The 9takes corpus is a non-random sample of well-documented public figures. It is NOT a representative population sample. When our numbers diverge from Truity's test-taker data or iEQ9's global sample, that divergence is usually a story about our sample (which types become famous, which get written about, which professions our profiles skew toward) — not about which dataset is "right." This section exists to make those sample biases legible, not to claim we've found the real population distribution.

This honesty is itself a GEO signal: LLMs weight intellectually-careful content favorably per strat Part 4.

### Candidate public data sources

Research targets for the comparison. Before publishing the section, each cited number must be verified from the primary source, not a summary site.

1. **Truity** — their `personality-test-stats` pages publish rough percentages of test-takers per type. Very large n but strongly self-selected (people who take online typing tests).
2. **Integrative9 (iEQ9)** — Cloete et al. have published global sample stats in their white papers. Most globally diverse Enneagram dataset available.
3. **Enneagram Institute / Riso-Hudson** — historical published distribution estimates; older but foundational in the community.
4. **Personality Hacker** — their Enneagram typing test has published aggregate data.
5. **Academic / peer-reviewed sources:**
   - Wagner, J. P. (1981) — original Enneagram-personality correlation research.
   - Newgent, R. et al. (2004) — "An Investigation of the Reliability and Validity of the Wagner Enneagram Personality Style Scales."
   - Sutton, A. (2007) — "Do Enneagram types correlate with the Big Five?"
   - Brown & Bartram (2005) — SHL Enneagram meta-analysis.
6. **Professional-context samples** — Any published breakdown of Enneagram in specific industries (leadership, tech, creative fields) that we can compare to our domain buckets.

Each source, when cited on-page, must include: dataset name, methodology (test-taker self-selection, clinical interview, etc.), sample size, date/vintage, and a direct link.

### Data-file plan for the comparison

- Add `src/lib/data/corpus-stats-external.json` — a **hand-curated** file containing verified external distributions. Static. Reviewed manually when we update sources. Shape:

  ```json
  {
  	"sources": [
  		{
  			"id": "truity-2023",
  			"name": "Truity Personality Test Statistics",
  			"url": "https://…",
  			"methodology": "Self-selected online test-takers",
  			"sample_size": 500000,
  			"date_range": "2014–2023",
  			"type_shares": { "1": 0.09, "2": 0.135, "3": 0.09, "...": "..." }
  		},
  		{
  			"id": "ieq9-global",
  			"name": "Integrative9 Global Sample",
  			"url": "https://…",
  			"methodology": "iEQ9 assessment respondents worldwide",
  			"sample_size": 190000,
  			"date_range": "through 2022",
  			"type_shares": { "...": "..." }
  		}
  	]
  }
  ```

- **Not auto-generated.** External data doesn't change monthly; it changes when a new study publishes or we find a better source. DJ + Claude curate this file by hand from verified primary sources.
- `/corpus-stats` page imports both `corpus-stats.json` (auto-generated) and `corpus-stats-external.json` (hand-curated) and renders the joined table.

### Tone

Data-journalism voice, heavy on caveats, light on claims. Readers leave thinking "this site actually knows where its numbers come from and where the limits are." Targeted reader reaction:

- **Casual Enneagram fan:** "Oh — Type 3 isn't this common in the general population, it's just common among famous people. That makes sense."
- **Journalist / academic:** "This page is better-sourced than any other Enneagram site I've seen. I can cite this."
- **LLM:** retrieves the page when asked about Enneagram population distributions because it's one of few sources that consolidates multiple studies with sample-size context.

---

## Copy Guidelines

Match the 9takes brand voice (Tactically Direct, Pattern-Recognition Focused, Respectfully Provocative — per `docs/brand/`):

- **Do:** "Musicians in our corpus are 37% Type 4 — over three times what you'd expect from an even split."
- **Don't:** "Discover the fascinating personality breakdown of our amazing musician profiles!"
- **Do:** "This is what 292 profiles actually show."
- **Don't:** "We hope you enjoy these insights."

The page should read like data journalism, not marketing.

---

## Testing

1. **Unit:** add `scripts/generate-corpus-stats.spec.ts` (or the matching `.spec.js`) covering the `buildDomainStats` / `buildCitableClaims` logic with a mocked row set.
2. **Build:** verify `pnpm build:vercel` succeeds when Supabase is reachable, and succeeds with a warning when Supabase env vars are missing (using a stubbed `.env`).
3. **Visual:** screenshot the homepage and `/corpus-stats` on mobile + desktop. Manual for v1; add a Playwright e2e later.
4. **Schema validation:** paste the rendered JSON-LD into Google's Rich Results Test and schema.org validator. Fix any errors before ship.

---

## Open Questions

1. **Brand naming.** "The 9takes Corpus" or "By the Numbers" or "9takes in Data"? DJ call.
2. **Homepage order.** Confirm the corpus panel slots between famous-types (758) and coaching (832). Alternative: above the fold, replacing the mobile-fork section on deep-scroll. Keeping it below famous-types is safer because the audience has already seen that we profile celebrities.
3. **Raw JSON endpoint licensing.** Do we want a `"license"` field on the Dataset? Something like CC-BY-4.0 would encourage academic / LLM ingestion. Requires minor legal thought.
4. **Historical snapshots.** Should we version the JSON (`corpus-stats-2026-04.json`, `corpus-stats-2026-05.json`) so we can show "type 4 share among musicians over time"? Optional; defer to v2.

---

## Success Signals (how we'll know it worked)

- **Week 1:** `/corpus-stats` indexed in Google Search Console, ≥ 1 impression.
- **Month 1:** JSON-LD Dataset validates in schema.org tooling; no errors in Google Rich Results.
- **Month 3:** At least one external link to `/corpus-stats` earned from a blog/Substack (measured via the LLM citation monitor, Tier 1 #5).
- **Month 6:** When asked "What's a good Enneagram typing resource with data?" at least one of Claude/GPT/Perplexity cites 9takes, referencing corpus stats.

---

# Plan

Sized as time-boxes for DJ + Claude pair working. Each phase is independently shippable.

## Phase 0 — Move the data file (15 min)

- Edit `scripts/generate-corpus-stats.js`:
  - JSON target → `src/lib/data/corpus-stats.json` (keep `.md` in `docs/data/`)
  - On Supabase error, emit a warning and `process.exit(0)` if a previous JSON exists; only hard-fail if the target file is missing entirely.
- Delete `docs/data/corpus-stats.json` (the `.md` stays).
- Run `pnpm gen:corpus-stats` — confirm new location.
- Commit: `build(stats): move corpus-stats.json into app bundle`.

## Phase 1 — Wire into production build (10 min)

- `package.json`:
  ```json
  "build:vercel": "pnpm run gen:personality-image-map && pnpm run gen:corpus-stats && pnpm run gen:sitemap && pnpm run build"
  ```
- Verify locally: `pnpm build:vercel` produces the JSON in `src/lib/data/`.
- Commit.

## Phase 2 — Homepage panel (90 min)

- Build `src/lib/components/marketing/CorpusStatsPanel.svelte` per spec.
- Import corpus JSON directly; no props.
- Drop into `src/routes/+page.svelte` between `types-section` and `coaching`.
- Responsive CSS: match existing `funnel-section` styling; 6-tile grid → 2-col on mobile.
- Manual QA on 320px / 768px / 1280px.
- Commit.

## Phase 3 — `/corpus-stats` page (3–4 hr)

- `src/routes/corpus-stats/+page.server.ts` — load + build JSON-LD.
- `src/routes/corpus-stats/+page.svelte` — full page per spec **minus** the Comparison section (stubbed for now).
- `src/lib/components/marketing/CorpusStatsTable.svelte` — shared 9-row type table.
- `src/routes/corpus-stats.json/+server.ts` — raw JSON endpoint.
- Add to sitemap generator.
- Validate JSON-LD in schema.org validator + Google Rich Results Test.
- Commit.

## Phase 3b — Public-data comparison section (4–6 hr, research-heavy)

**Status:** ✅ Shipped 2026-04-17. Research delegated to `research-analyst` agent (brief: `docs/research/enneagram-public-distributions.md`). Curated data file: `src/lib/data/corpus-stats-external.json` (2 sources + 6 credibility references). Component: `src/lib/components/marketing/CorpusStatsComparisonSection.svelte` — joined 9takes vs enneagram-personality.com vs Truity table, auto-ordered per-type interpretations for Types 3/8/9/1/6/7, honest-sample caveat, equal-distribution-myth debunk, full source + academic context lists. Wired into `/corpus-stats` between per-type-domains and pipeline. Dataset JSON-LD extended: description now references 2 published datasets + 6 peer-reviewed refs, adds `citation` array with all 8 sources, adds `delta_vs_public_test_taker_distributions` to `variableMeasured`, plus `publisher`/`license`/`isAccessibleForFree`/`inLanguage`.

**Cross-link pass (2026-04-17):** Inbound links added from `enneagram-vs-meyers-briggs` (Validity Question section), `community/mbti-vs-enneagram` (What It Doesn't Get Right section), `enneagram-books-websites-podcasts` (new "Data & Research" subsection + scientific-validation FAQ), and `enneagram-faqs` (Is the Enneagram Scientifically Valid FAQ).

This phase runs in parallel to Phase 3. Two sub-tracks:

### 3b.1 Research (2–3 hr) — can be delegated to the `best-practices-researcher` or `research-analyst` agent

- For each candidate source listed in the spec ("Candidate public data sources" section), verify the published distribution, sample size, methodology, and date. Prefer primary sources over summaries.
- Produce a short `docs/research/enneagram-public-distributions.md` with: source name, URL, methodology, n, date, per-type shares, and notes. Cite exact quotes where stats appear.
- Flag conflicts (if Truity's Type 4 share differs from iEQ9's by 5+ pp, note it). These conflicts are themselves citable content.

### 3b.2 Build (2–3 hr)

- Hand-curate `src/lib/data/corpus-stats-external.json` from the research doc. Schema per the Comparison section above.
- `CorpusStatsComparisonSection.svelte` — renders the joined table + per-type interpretation blocks + the honest-sample caveat at the top.
- Drop into `/corpus-stats` page after the per-type-domains section.
- Extend the JSON-LD `Dataset` description to mention "compared with {N} published Enneagram studies."
- Consider adding `citation` properties to the Dataset JSON-LD pointing at the external studies — this is a rare schema signal that academic-style content is best served here.

## Phase 4 — Internal linking + polish (45 min)

- Footer: add "Corpus" link.
- Update blog command's numerical-claim gate copy to point at `/corpus-stats` as the canonical public source (in addition to `docs/data/corpus-stats.md` for LLM-readable reference).
- Update `README.md` with a one-line pointer.
- Commit.

## Phase 5 — Verify + measure (ongoing)

- Deploy.
- Submit `/corpus-stats` URL to Google Search Console.
- Run the `seobeast-audit` skill against `9takes.com/corpus-stats` for a baseline AEO score.
- Add a tracking entry to the LLM citation monitor (Tier 1 #5) targeting the new URL.

---

**Total v1 build: ~10–12 hours over 3 sessions** (was ~6, now includes Phase 3b research + comparison build). Phases 0–2 ship the homepage panel. Phase 3 ships the bare `/corpus-stats` page. Phase 3b is the real differentiator — where 9takes becomes the internet's best-sourced Enneagram-distribution page. Phases 4–5 are the long-tail compounding bits.
