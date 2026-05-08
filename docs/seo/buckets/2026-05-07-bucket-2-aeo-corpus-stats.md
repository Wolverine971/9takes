<!-- docs/seo/buckets/2026-05-07-bucket-2-aeo-corpus-stats.md -->

# Bucket 2 — AEO / Corpus-Stats Weaponization

## Mission

Surface 9takes' first-party domain-by-domain Enneagram statistics on the highest-trafficked head-term pages so they become AI Overview / LLM citation bait. Crystal Knows beats deeper sites in AI Overviews with claims like "Type 5 is 4.8% of users." 9takes has structurally identical claims with a larger sample and isn't using them on most pages.

This is the moat. No competitor can match first-party 319-figure corpus stats.

## Why this matters

Per the competitor brief and master cluster map, AEO citation density is THE differentiator that turns 9takes from "another Enneagram blog" into "the cited source." Claims must be:

- Numerical and specific
- Sourced to a stable URL
- Wrapped in `Quotation` JSON-LD so LLMs extract them cleanly

## Source docs to read first

- `docs/data/corpus-stats.md` (THE source-of-truth file with all the citation-ready sentences)
- `docs/seo/master-topic-cluster-map-2026-05-06.md` Section 3 ("AEO / LLM-citation strategy") — has the 25 specific URLs that should embed Quotation schema
- `docs/seo/2026-05-06-research-synthesis.md` (Convergence #3 + Top-10 #3 and #4)
- `docs/seo/competitor-serp-brief-2026-05-06.md` (Crystal Knows analysis, first-party data section)

## The corpus stats themselves (high-impact extracts)

These are the stats your work will surface. Confirm against `docs/data/corpus-stats.md` before embedding (sample sizes / deltas may have shifted since the report was written):

- Type 4 = 35.1% of musicians (+21pp vs baseline)
- Type 7 = 40% of comedians (+27pp)
- Type 5 = 20% of tech founders (+13pp)
- Type 2 = 17% of politicians (+9.2pp) — counterintuitive, AI-Overview honey
- Type 3 = 28.4% of creators (+8.3pp)
- Type 5 = 30.8% of authors (+24pp; small n)

## Scope of first wave

### 1. Build a `CorpusStatCallout` component

- Lives in `src/lib/components/blog/callouts/` (alongside `QuickAnswer`, `InsightBox`, etc.)
- Props: `type` (1-9), `domain` (musicians/comedians/etc.), `delta`, `n`, `sourceUrl`
- Renders a visually distinct callout with the stat in plain English + an inline link to `/corpus-stats`
- Emits `Quotation` JSON-LD inline (or via a `+layout` schema injection — your call)

### 2. Apply to the 9 `/personality-analysis/type/[1-9]` pages

- Page entry: `src/routes/personality-analysis/type/[slug]/+page.svelte` + `+page.server.ts`
- Add per-type:
  - One corpus-stat callout (the strongest delta for that type)
  - A `FAQPage` JSON-LD with 6 FAQs (rare? famous? career? wing? compatibility? mistype?)
  - 3 internal cross-links to `/corpus-stats` anchors (use hash anchors — `/corpus-stats#musicians` etc.)
- Be careful: this is a slug-driven page, so changes apply to all 9 types. Use the slug to pick the right stat.

### 3. Verify and (if missing) add corpus-stat callouts on `/personality-analysis/categories/[slug]`

- 7 category pages (music, comedy, tech, politics, etc.)
- Master cluster map says some may already have it post-audit — verify, fill gaps
- Same callout component as above

### 4. `/enneagram-corner/enneagram-faqs` — add 6 corpus-stat FAQs

- File: probably `src/blog/enneagram/enneagram-faqs.md` or similar (find via grep)
- Add Q/A pairs that cite specific corpus stats
- Update existing `FAQPage` JSON-LD to include them

## Files likely to touch

- `src/lib/components/blog/callouts/CorpusStatCallout.svelte` (NEW)
- `src/routes/personality-analysis/type/[slug]/+page.svelte`
- `src/routes/personality-analysis/type/[slug]/+page.server.ts` (if data needs to be loaded)
- `src/routes/personality-analysis/categories/[slug]/+page.svelte` (read first; may already have it)
- `src/blog/enneagram/enneagram-faqs.md` (or similar)
- Possibly `src/lib/server/personalityCategoryData.ts` for stat lookups

## Out of scope

- Don't touch profile pages (319 of them) — that's Bucket 3's `RelatedPosts` job
- Don't change title/meta tags — Bucket 1
- Don't add `RelatedPosts` blocks — Bucket 3
- Don't write new content beyond the FAQs — Bucket 4
- Don't touch `/questions` — Bucket 5
- Don't add `HowTo` schema — Bucket 6
- DON'T edit any unpublished pop-culture file in the publish queue

## Parallel-work safety

- Never `git stash`, hard reset, or wide checkout
- Commit in scoped batches
- Don't push to origin without user approval

## Quality bar

- Every embedded stat must match `docs/data/corpus-stats.md` exactly — re-run `pnpm gen:corpus-stats` if it looks stale; do not invent numbers
- `Quotation` schema must validate (use Google's Rich Results test format mentally)
- `FAQPage` schema: questions must be answerable in 1-3 sentences; don't pad
- Hash anchors must actually exist on `/corpus-stats` page; if they don't, add them as part of this work

## Output expected

1. Commits in scoped batches
2. `pnpm check` clean
3. Report back:
   - Component built (yes/no)
   - Type pages updated (which slugs)
   - Category pages: which already had callouts, which were added
   - Total `Quotation` schema embeds added across the site
   - FAQ count added to enneagram-faqs
   - Anything punted (e.g., the broader 25 AEO surfaces from Master Section 3 — those are likely a follow-up wave)
