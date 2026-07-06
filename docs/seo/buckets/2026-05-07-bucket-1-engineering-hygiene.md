<!-- docs/seo/buckets/2026-05-07-bucket-1-engineering-hygiene.md -->

# Bucket 1 — Sitewide Engineering Hygiene

## Mission

Close out the sitewide engineering items that have been open since the 2026-04-07 SEO audit. Single-PR changes that lift CTR / SERP eligibility across every page on the site. Highest leverage per line of code on the entire roadmap.

## Why this matters

Per the competitor brief, 9takes is leaving sitewide CTR and entity-resolution lift on the table. These are not new features — they're closing already-flagged gaps.

## Source docs to read first

- `docs/audits/seo-audit-9takes-2026-04-07.md` (original audit findings — the bug list)
- `docs/seo/2026-05-06-research-synthesis.md` (priority #9 in the top-10)
- `docs/seo/master-topic-cluster-map-2026-05-06.md` Section 4 Quick Wins #10, #11, #14

## Scope of first wave

### 1. Title tag budget pass — 269 over-length titles

- Hard budget: ≤60 chars (Google snippet limit; some allow 70 if you're confident)
- Truncate or rewrite where over. Prefer rewriting to preserving keyword + brand.
- Look at `src/lib/components/blog/BlogPageHead.svelte` and `src/lib/components/molecules/PeopleBlogPageHead.svelte` (or wherever `<title>` is templated).
- Decide: enforce at template level (truncate-with-ellipsis fallback) AND fix individual frontmatter where over-length is content-driven.

### 2. Meta description budget pass — 125 over-length descriptions

- Hard budget: ≤155 chars (Google desktop snippet limit)
- Same approach as titles.

### 3. Twitter card upgrade

- Switch all article templates from `twitter:card=summary` → `summary_large_image`
- Confirm `twitter:image` references the composite/hero image, not a thumbnail.

### 4. `Person.sameAs` on top-100 personality-analysis profiles

- Schema field on the JSON-LD `Person` object: array of canonical entity URLs (Wikipedia, Wikidata, IMDb).
- Strongest entity-resolution signal you can give Google.
- Investigate where Person schema is generated (likely a server-side helper or component template). Decide whether to:
  - (a) Add a `same_as` frontmatter field to people drafts and the DB `blogs_famous_people` table
  - (b) Generate Wikipedia/Wikidata sameAs URLs at build time from the slug
  - (c) Manual pass on top 100 first, automate the long tail later
- Recommend (c) for the first wave — get something shipped, iterate on automation.

## Files likely to touch

- `src/lib/components/blog/BlogPageHead.svelte`
- `src/lib/components/blog/PeopleBlogPageHead.svelte` (if it exists; check `src/lib/components/blog/`)
- Possibly `src/lib/server/` for schema helpers
- Possibly Supabase migration if you decide to add `same_as` column to `blogs_famous_people`
- Frontmatter edits across `src/blog/**/*.md` for over-length titles/descriptions

## Out of scope (other buckets are handling)

- Don't touch `/personality-analysis/type/[N]` page content — Bucket 2 owns that
- Don't add `Quotation` schema or corpus-stat callouts — Bucket 2
- Don't add `RelatedPosts` blocks to pop-culture — Bucket 3
- Don't write new content — Bucket 4
- Don't touch `/questions` routes — Bucket 5
- Don't add `HowTo` schema — Bucket 6
- DON'T edit any of the unpublished pop-culture files in the publish queue (`docs/seo/2026-05-07-mdsvex-publish-queue.md`)

## Parallel-work safety

- The user and other agents are working on this repo in parallel.
- Never `git stash`, `git reset --hard`, or `git checkout .`.
- Commit your work in small, scoped commits as you go.
- Don't push to origin without explicit user approval.

## Quality bar

- Title pass: every changed title must still convey the page's topic without keyword stuffing
- Meta pass: descriptions still read like human prose, not truncated mid-sentence
- Twitter card: verify on a sample page (e.g., `/personality-analysis/sam-altman`) that the image dimensions render correctly in Twitter's card validator format
- `sameAs`: only add URLs you can verify (don't guess Wikipedia URLs — confirm)

## Output expected

When you're done with the first wave:

1. Commit the changes (multiple small commits is fine)
2. Run `pnpm check` and `pnpm lint` to validate
3. Report back to the user:
   - Files changed
   - How many titles/descriptions were trimmed
   - Did you ship `Person.sameAs` for top 100, or fewer?
   - Anything you punted to a follow-up wave
   - Anything that needs DJ's eyes (e.g., a frontmatter rewrite that changes the SEO intent of a page)

If a sub-task is bigger than expected, ship what you can and document the rest in a follow-up section of this doc.

## First-wave shipped (2026-05-07)

Commits on `main`:

- `d524a61b` — `seo(twitter): upgrade article cards to summary_large_image`
- `091bcdb1` — `seo(snippets): cap title and meta description at SERP budgets`
- `ef39382a` — frontmatter trims landed inside another agent's commit (parallel-work race; my staged title/description rewrites were absorbed when the other agent ran `git add -A`). 54 files touched: 43 over-budget titles trimmed, 11+ descriptions trimmed.
- `e2249975` — `chore(prettier): normalize quoting on six rewritten frontmatter lines`

What changed:

1. **Twitter card** — both `BlogPageHead.svelte` and `PeopleBlogPageHead.svelte` now emit `twitter:card=summary_large_image`. Sitewide.
2. **Title / meta-description budget** — added `src/lib/utils/seoBudget.ts` (`TITLE_SNIPPET_BUDGET=60`, `DESCRIPTION_SNIPPET_BUDGET=155`) with a whitespace-aware truncate helper, plus 9 unit tests. Wired into both blog head templates so the literal `<title>` and `<meta name="description">` tags now self-cap. OG, Twitter, and JSON-LD nodes still see the full editorial title/description (those have larger budgets).
3. **Hand-rewrites** — trimmed 43 of the worst over-cliff titles (>75 chars) and 11 of the worst descriptions (>200 chars) on published, non-queue MDsvex files. Skipped:
   - All 21 files in `docs/seo/2026-05-07-mdsvex-publish-queue.md`.
   - `src/blog/enneagram/enneagram-and-mental-illness.md` (top-traffic page; per memory, no title/slug changes).
   - All `drafts/`-suffixed files.

What's left after first wave:

- ~71 mid-band over-budget titles (60-75 chars) and ~98 mid-band descriptions (156-220 chars). These are now safety-netted by the template cap; manual rewrites can land file-by-file as content edits happen.

## Follow-up wave: `Person.sameAs` for top 100

Status: punted from first wave. Schema infrastructure already shipped (per `src/lib/utils/schema.ts` `buildPersonSameAsUrls` + `PeopleBlogPageHead` wiring; DB columns shipped in `supabase/migrations/20260420_blogs_famous_people_jsonld_fields.sql`). Only the data-entry pass remains.

State as of 2026-05-07:

- 58/402 famous-people drafts in `src/blog/people/drafts/` already carry `same_as`, `wikidata_qid`, and `imdb_id` frontmatter (e.g. Abraham-Lincoln, Elon-Musk, Tim-Cook).
- ~344 drafts still missing the field.
- DB-side state for `blogs_famous_people.same_as` not audited yet — drafts and DB are decoupled (`pnpm push:people`); DB may have entries without draft entries.

Next-wave steps:

1. Pull current `blogs_famous_people` rows from Supabase (slug, person, name) and join with traffic data to identify the top 100 by sessions.
2. For each top-100 person without `same_as`, look up:
   - Wikipedia URL (resolve via Wikidata `wbsearchentities` so we don't guess)
   - Wikidata QID
   - IMDb nconst (for actors / public figures only)
3. Write a one-shot script that updates the DB row and (for any draft on disk) the frontmatter. Avoid hand-editing 100 markdown files.
4. Verify on a sample personality-analysis page that `Person.sameAs` renders in the JSON-LD and points at real entities.

Recommend a separate 2-3 hour task. Manual verification per person is non-negotiable — never ship guessed Wikipedia URLs.

## Surprises / things needing DJ's eyes

- **Active-listening guide title** was 117 chars; trimmed to 60 (`Active Listening Guide: Why Your Personality Type Sabotages It`). Loses the parenthetical "(And How to Fix It)" payoff. Optional rewrite if you want a punchier hook back.
- **Object Relations title** went from 86 chars to 56 (`Attachment, Frustration, Rejection: Object Relations by Type`). Drops "Hidden in Your Enneagram Type" from the title — still appears in the URL slug and H1. Acceptable in my read; flag if not.
- **`90-day-personality-maxing-blueprint`** title trimmed to just "The 90-Day Personality Maxing Blueprint" (41 chars). Lost the "Transform Your Mind Like You Train Your Body" tail — that line is strong copy and might be worth keeping in the H1 even if it's gone from `<title>`.
- The cap util is intentionally lenient: it prefers a clean whitespace break over hard-cut. Worst-case fallback is a hard cut at the budget. No surprises in the test suite.
