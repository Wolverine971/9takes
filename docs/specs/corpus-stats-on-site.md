<!-- docs/specs/corpus-stats-on-site.md -->

# Spec: Surface Corpus Stats on 9takes

**Status:** Draft — pending DJ review
**Created:** 2026-04-16
**Owner:** DJ
**Ties to:** `9takes-strat.md` Tier 1 #4 (corpus stats data file) — already shipped; this spec extends it onto the site.

---

## Goal

Make the 9takes corpus stats (type distribution, over-/under-representation by domain, quality grades, freshness) **visible on 9takes.com**, auto-refreshing, and structured so Google + LLMs can cite them. Two surfaces:

1. **Homepage**: a compact "By the Numbers" section — 3–5 headline facts, credibility boost, drives clicks into deeper content.
2. **`/corpus-stats`**: a dedicated SEO-citable page with the full dataset, methodology, and JSON-LD `Dataset` schema.

## Non-Goals

- **Not a real-time dashboard.** Stats refresh on deploy, not on every request. The data changes monthly at most.
- **Not user-filterable.** No "filter by wing" or "filter by decade" UI. That's a v2.
- **Not admin-only.** This is marketing + GEO, not an internal tool.
- **No chart library.** Simple HTML tables + CSS-styled callout blocks. Don't add Chart.js.

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
  1. {TOTALS.PUBLISHED} profiles analyzed
     ({TOTALS.UNPUBLISHED_DRAFTS} drafts in the pipeline)

  2. Musicians → {MUSICIANS.TOP_OVER.SHARE}% Type 4
     (+{MUSICIANS.TOP_OVER.DELTA_PP} pp above baseline)

  3. Tech founders → {TECH.TOP_OVER.SHARE}% Type 5
     (+{TECH.TOP_OVER.DELTA_PP} pp above baseline)

  4. Comedians → {COMEDIANS.TOP_OVER.SHARE}% Type 7
     (+{COMEDIANS.TOP_OVER.DELTA_PP} pp above baseline)

  5. {QUALITY.AVERAGE_OVERALL}/10 average
     quality grade across {QUALITY.GRADED_COUNT} graded profiles

  6. {FRESHNESS.SHARE_90D}% refreshed in last 90 days
     ({FRESHNESS.UPDATED_90D} of {TOTALS.PUBLISHED})

FOOTER LINK:  See the full corpus breakdown →  /corpus-stats
```

### Why these 6 tiles

Each corresponds to a ready-to-cite claim already in `corpus-stats.json`. Numbers are the single highest-cited content trait per GEO research (strat Part 3 #2). Showing four distinct over-representation patterns — Musicians/Tech/Comedians + one corpus-level claim — signals pattern-recognition depth, not cherry-picked trivia.

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
3. **Corpus Totals** — mini-panel: total / published / drafts.
4. **Enneagram Type Distribution** — full 9-row table from `enneagram_distribution`.
5. **Type Distribution by Domain** — one expandable `<details>` per domain (Actors, Musicians, Tech Founders…). Each contains the same 9-row table from `domains[name]`. Rendering 8 full tables flat would overwhelm; `<details>` lets the page scan cleanly AND preserves all content for LLM extraction.
6. **Most Common Professions per Type** — the `per_type_domains` list.
7. **Content Quality & Freshness** — the last two panels.
8. **Methodology** — verbatim from the `.md` file's methodology section.
9. **Ready-to-Cite Claims** — the `citable_claims` array, rendered with `<blockquote>`s so they look pre-packaged for journalists.
10. **JSON download** — a small "Download raw JSON" link pointing at `/corpus-stats.json` (see below).

### Structured data (JSON-LD)

Emit a `schema.org/Dataset` block in the page head. This is the rare schema type LLMs love for statistical claims. Minimal shape:

```json
{
	"@context": "https://schema.org",
	"@type": "Dataset",
	"name": "9takes Enneagram Personality Type Distribution Corpus",
	"description": "Type distribution, over-/under-representation by profession, and content-quality metrics across {N} public-figure profiles on 9takes.",
	"url": "https://9takes.com/corpus-stats",
	"creator": { "@type": "Organization", "name": "9takes", "url": "https://9takes.com" },
	"dateModified": "{generated_at}",
	"variableMeasured": [
		"enneagram_type_share",
		"over_representation_by_domain",
		"content_quality_grade",
		"content_freshness"
	],
	"distribution": [
		{
			"@type": "DataDownload",
			"encodingFormat": "application/json",
			"contentUrl": "https://9takes.com/corpus-stats.json"
		}
	]
}
```

Also emit `BreadcrumbList` + `WebPage` per the existing pattern in `PeopleBlogPageHead.svelte`.

### Raw JSON endpoint

Add `src/routes/corpus-stats.json/+server.ts` that returns `src/lib/data/corpus-stats.json` as `application/json` with a long cache header. Makes the `DataDownload` pointer valid + lets external researchers/LLMs grab the dataset directly. 20 lines of code.

### Sitemap

Add `/corpus-stats` to `scripts/generate-sitemap.js` with `priority: 0.8` and `changefreq: monthly`.

### Internal linking

- Homepage panel → `/corpus-stats`
- Every celebrity blog's `<details>` Rabbit Hole → `/corpus-stats` (once, in the counterarguments section, when a domain stat is cited)
- Footer: add a "Corpus" link under the existing About / Contact column.

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
- `src/routes/corpus-stats/+page.svelte` — full page per spec.
- `src/lib/components/marketing/CorpusStatsTable.svelte` — shared 9-row type table.
- `src/routes/corpus-stats.json/+server.ts` — raw JSON endpoint.
- Add to sitemap generator.
- Validate JSON-LD in schema.org validator + Google Rich Results Test.
- Commit.

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

**Total v1 build: ~6 hours over 2 sessions.** Phases 0–2 are a clean ship-in-a-session chunk (homepage only). Phase 3 is the GEO payoff. Phases 4–5 are the long-tail compounding bits.
