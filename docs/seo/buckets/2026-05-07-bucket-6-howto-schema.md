<!-- docs/seo/buckets/2026-05-07-bucket-6-howto-schema.md -->

# Bucket 6 — `/how-to-guides` Schema Layer

## Mission

Add `HowTo` JSON-LD with explicit step structure to all 24 how-to-guide pages. No competitor in the Enneagram niche uses `HowTo` schema. Free SERP differentiation — `HowTo` is one of the few schema types that earns rich result steps directly in Google search, and the niche has zero saturation.

## Why this matters

Per the master cluster map Quick Win #8, this is one PR with sitewide effect. SERP differentiation in a niche where every competitor publishes the same listicle format. The how-to-guides cluster is also where most of the "commercial intent" content lives (communication scripts, productivity systems by type, dating dynamics, etc.) — so rich-result eligibility here lifts conversion-shape pages.

## Source docs to read first

- `docs/seo/master-topic-cluster-map-2026-05-06.md` Quick Win #8 + Pillar 4 (`/how-to-guides`)
- `docs/seo/corpus-inventory-gaps-2026-05-06.md` Pillar 4 (what's covered, what's drafted)
- `docs/seo/2026-05-06-research-synthesis.md`
- Schema.org reference: https://schema.org/HowTo (you can WebFetch this)
- Google's HowTo guidelines reference (WebSearch if needed)

## Scope of first wave

### 1. Audit each existing guide for HowTo-fitness

- 12 published guides at `src/blog/guides/`:
  - relationship-conflict (parts 1+2)
  - 5-tough-conversations
  - dating-dynamics-by-type
  - productivity-systems-by-type
  - depression-fighting (verify name)
  - self-efficacy
  - active-listening
  - hidden-strengths
  - emotions-crash-course
  - how-to-psychoanalyze-people
  - using-enneagram-for-self-development
  - personality-maxing-blueprint (verify name; it's the 90-day one)
- Some are genuinely step-based and HowTo-friendly. Others are more essay-shaped and shouldn't pretend to be a HowTo (Google may penalize misuse).
- Decision per guide: HowTo-applicable / not-HowTo-applicable / partially (only certain sections)

### 2. Build a `HowToSchema` component or helper

- Lives somewhere in `src/lib/components/blog/` or `src/lib/server/`
- Inputs: guide steps (array of `{ name, text, image? }`), totalTime (ISO 8601 duration), tools/supplies if applicable
- Emits compliant `HowTo` JSON-LD per Google's schema requirements

### 3. Apply to applicable guides

- For genuinely step-based guides: extract the steps from the existing prose and embed
- For partially-applicable guides: convert just the relevant section
- For non-applicable guides: skip; document why in the audit

### 4. Each guide also gets a first-party stat citation at the top

- Per the master cluster map: "Cite first-party stat at the top"
- Pull from `docs/data/corpus-stats.md` — pick a relevant stat per guide
- Example: `productivity-systems-by-type` could open with "Of the 319 figures in our corpus, Type 3s are 28.4% of creators (+8.3pp baseline) — they're built for productivity systems, but they pay a price"

## Files likely to touch

- `src/lib/components/blog/HowToSchema.svelte` (NEW — or extend an existing schema helper)
- 12 published guide .md files in `src/blog/guides/`
- Possibly `src/routes/how-to-guides/[slug]/+page.svelte` if schema injection is at the route level

## Out of scope

- Don't write new how-to content — Bucket 4 if any new guides are needed
- Don't ship `enneagram-hidden-strengths-and-gifts.md` (publishing is owned by the publish queue)
- Don't change titles/meta for non-guide pages — Bucket 1
- Don't touch `/personality-analysis/*` pages — Bucket 2 / 3
- Don't change pop-culture pages — Bucket 3
- Don't touch `/questions/*` — Bucket 5

## Parallel-work safety

- Don't bulk-edit guide files in ways that would conflict with concurrent editorial work
- Schema changes should be additive (add a new JSON-LD block) — don't replace or alter existing schema unless it's wrong
- Never `git stash`, hard reset, or wide checkout
- Commit per guide or per logical batch (e.g., one commit for the schema component, one per 3-4 guide updates)
- Don't push to origin without user approval

## Quality bar

- HowTo schema must validate per schema.org (run mentally through https://validator.schema.org / Google Rich Results format)
- Don't HowTo-ify guides that aren't actually step-based — this risks Google penalizing as schema misuse
- Steps must match what's actually in the article (don't fabricate)
- ISO 8601 durations: `PT30M` for 30 minutes, `P90D` for 90 days, etc.
- The first-party stat citation should match `docs/data/corpus-stats.md` exactly — re-run `pnpm gen:corpus-stats` if it looks stale; do not invent

## Output expected

1. Commits in scoped batches
2. `pnpm check` clean
3. Report back:
   - Audit verdict per guide (which got HowTo, which didn't, why)
   - Component built / used existing helper
   - First-party stats embedded per guide (which stat went where)
   - Any guide where the existing prose didn't actually match HowTo step structure (i.e., would need restructuring)
   - Schema validation results
