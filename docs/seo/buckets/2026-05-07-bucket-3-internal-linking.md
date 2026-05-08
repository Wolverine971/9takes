<!-- docs/seo/buckets/2026-05-07-bucket-3-internal-linking.md -->

# Bucket 3 — Internal Linking & Graph Bridging

## Mission

Bridge the four loosely-connected graphs at 9takes (`/personality-analysis`, `/enneagram-corner`, `/pop-culture+community+how-to-guides`, `/questions`) so internal authority flows where it should. The cross-link report flagged 28 pop-culture posts with **zero outgoing links** and 40 fully isolated posts.

Mostly automatable using existing utilities (`getRelatedBlogs`, `getCrossLinkSuggestions`).

## Why this matters

Per the master cluster map Section 7, 9takes has hundreds of pages of authority but the graphs don't talk to each other. Pop-culture spokes don't link back to type pillars. Profiles don't link to corpus-stats. Questions are entirely orphaned. Fixing this is mostly wiring, not new content — and it compounds the value of every other bucket.

## Source docs to read first

- `docs/seo/master-topic-cluster-map-2026-05-06.md` Section 7 (the full bridge-class table)
- `docs/seo/corpus-inventory-gaps-2026-05-06.md` Section "Cross-Pillar Pattern Findings"
- `docs/seo/2026-05-06-research-synthesis.md` (Convergence #4 + Top-10 #7)
- The latest crosslink report (run `pnpm gen:crosslinks` if needed; output likely at `docs/data/` or similar)
- Existing utilities: `src/lib/components/molecules/blogIndex.ts` (has `getRelatedBlogs` / `getCrossLinkSuggestions`)

## Scope of first wave

### 1. Add `RelatedPosts` block to all 22 pop-culture pages

- Look for an existing `RelatedPosts` component in `src/lib/components/blog/` (master map references it as already-existing)
- 5 links each, MUST include:
  - 1 link to a `/personality-analysis/type/N` pillar
  - 1 link to `/corpus-stats` or a relevant anchor
  - 3 contextual links (other pop-culture, profiles, or corner)
- Estimated 110 new internal links

### 2. Profile-card sidebar links

- Every `/personality-analysis/[name]` page should link to:
  - The matching type pillar (`/enneagram-corner/enneagram-type-N`)
  - The matching domain category (`/personality-analysis/categories/[slug]`)
  - The corpus-stats anchor for that domain (`/corpus-stats#[domain-slug]`)
- This is template-level work — find the layout/page component for `/personality-analysis/[slug]/`
- 319 profiles × 3 links = ~957 new internal links

### 3. `/enneagram-test` link injection

- Add `/enneagram-test` to the sidebar (or below-fold CTA) on every `/personality-analysis/*` and `/enneagram-corner/*` page
- Bridge to a high-conversion page that currently leaks authority
- Find the shared layout component; add once, applies sitewide

### 4. (Stretch — only if first 3 are done) Wire `question_keywords` into related-blogs lookup

- Currently `/questions/[slug]` doesn't surface related blog posts
- The `question_keywords` table exists; needs an RPC or join to map question keywords → blog posts
- Add a "Related blog posts" block at the bottom of question detail pages

## Files likely to touch

- `src/lib/components/blog/RelatedPosts.svelte` (verify it exists, or build it)
- The 22 pop-culture .md files in `src/blog/pop-culture/` — but **only the 22 published ones**
- `src/routes/personality-analysis/[slug]/+page.svelte` (profile detail layout)
- `src/routes/personality-analysis/+layout.svelte` (or wherever the sidebar is shared)
- `src/lib/components/molecules/blogIndex.ts` — extend `getRelatedBlogs` if needed
- For stretch: an RPC in Supabase + a server load function under `/questions/[slug]/`

## Out of scope

- Don't touch the **unpublished** pop-culture files (per `docs/seo/2026-05-07-mdsvex-publish-queue.md`)
- Don't change page titles/meta — Bucket 1
- Don't add corpus-stat callouts (just LINK to them) — Bucket 2
- Don't write new content — Bucket 4
- Don't change `/questions` schema — Bucket 5
- Don't add `HowTo` schema — Bucket 6

## Parallel-work safety

- The publish-queue doc is shipping new pop-culture files daily. Re-check the published list before bulk-editing pop-culture files — what's published today may have been unpublished yesterday.
- Never `git stash`, hard reset, or wide checkout
- Commit in scoped batches per logical change (e.g., one commit per page if you're editing files manually; one commit total if you're using a script)
- Don't push to origin without user approval

## Quality bar

- Related-posts links must be contextually relevant — don't link "succession" to "kardashians" just because they're both pop-culture; the existing `getRelatedBlogs` utility uses tag/keyword overlap, trust it
- No broken links — every URL you insert must resolve to a published page
- Sidebar links shouldn't visually clutter the layout (have UX awareness — if the sidebar is already dense, suggest a different placement)

## Output expected

1. Commits in scoped batches
2. `pnpm check` clean
3. Report back:
   - Total new internal links added (estimate: 110 from pop-culture, ~957 from profile sidebars, sitewide /enneagram-test)
   - Did `RelatedPosts` already exist or did you build it
   - Any broken-link surprises you found and fixed
   - Stretch goal status (questions↔blog wiring): done / punted / partially done
