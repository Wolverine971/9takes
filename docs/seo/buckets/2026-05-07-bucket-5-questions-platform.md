<!-- docs/seo/buckets/2026-05-07-bucket-5-questions-platform.md -->

# Bucket 5 — `/questions` Platform SEO

## Mission

Lift the `/questions` platform from "indexed but text-thin" to "indexed and authoritative." 107 question URLs are currently in the sitemap but they're almost entirely isolated from the rest of the site, expose minimal text on initial render, and emit generic `WebPage` schema instead of the `DiscussionForumPosting` / `QAPage` schema that earns SERP features.

This bucket has been open since the 2026-04-07 question-page audit. Most of the recommendations are still partially implemented.

## Why this matters

Per the master cluster map Section 5, the Q&A platform is leaking authority both directions: blog → questions and questions → blog. 107 indexed URLs underperforming dilutes domain authority instead of compounding it. With the right schema and a public answer-summary, qualifying question pages become "Discussion forum" rich-result eligible.

## Source docs to read first

- `docs/question-page-seo-recommendations-2026-04-07.md` (THE original audit; most recs still open)
- `docs/seo/master-topic-cluster-map-2026-05-06.md` Section 5 (search-intent ladder + bridges)
- `docs/seo/2026-05-06-research-synthesis.md` (Convergence #6)
- `docs/seo/corpus-inventory-gaps-2026-05-06.md` Pillar 7 (question categories)

## Scope of first wave

Pick the highest-leverage 2-3 of these — don't try to ship all in one wave:

### 1. Preserve the full question in `<title>`

- Currently the title is likely truncated to 60 chars or templated as "Question - 9takes"
- For question pages, long-tail head matching beats char-budget hygiene
- Find: `src/routes/questions/[slug]/+page.svelte` or its head component

### 2. Render `context` publicly

- The schema field exists in the database (`questions.context` likely)
- The UI doesn't render it on the public page
- Adding visible context text doubles the page's text density

### 3. Schema upgrade: `WebPage` → `DiscussionForumPosting`

- Only on pages that already expose visible answer text (be careful — some are gated by give-first)
- Don't use `QAPage` until answers are fully public
- Use `DiscussionForumPosting` for pages where at least the question + context is visible
- Find: probably a JSON-LD block in the question detail page or its head

### 4. Add a "Related questions" + "Related blog posts" block

- 3-8 related questions + 2 blog posts at the bottom of every question detail page
- Use `question_keywords` table for the question→question retrieval (this is partially open from audit)
- Use `getRelatedBlogs` or a question_keywords→blog mapping for the blog side

### 5. Question category page upgrades (mini-pillars)

- 7 categories per master map: relationships, work, dating, mental-health, family-parenting, personality-typing, celebrity
- Each category page should have:
  - 200-word intro (pillar-style)
  - List of top 10 questions in that category
  - 3 outbound links to relevant blog content (e.g., `/questions/categories/relationships` → `/enneagram-corner/enneagram-compatibility-matrix`)
- Find: `src/routes/questions/categories/[slug]/+page.svelte`

## Files likely to touch

- `src/routes/questions/[slug]/+page.svelte` and `+page.server.ts`
- `src/routes/questions/categories/[slug]/+page.svelte` and `+page.server.ts`
- Possibly Supabase RPCs for related-questions retrieval
- Possibly a new component for the related-questions/related-blogs block

## Out of scope

- Don't change `BlogPageHead` template (Bucket 1 owns title/meta hygiene for non-question pages)
- Don't touch `/personality-analysis/*` pages — Bucket 2 / Bucket 3
- Don't add `RelatedPosts` to pop-culture pages — Bucket 3
- Don't write new content — Bucket 4
- Don't add `HowTo` schema to /how-to-guides — Bucket 6

## Parallel-work safety

- Be careful with Supabase migrations — coordinate with DJ if you need to add columns/RPCs
- The `give-first` gate is load-bearing for the product; don't expose private answer content as a side effect of schema changes
- Never `git stash`, hard reset, or wide checkout
- Commit in scoped batches
- Don't push to origin without user approval

## Quality bar

- `DiscussionForumPosting` schema must validate (verify field names against schema.org)
- Don't break give-first product mechanics — agents and the user can read existing logic in `src/routes/questions/[slug]/+page.server.ts` and the comment system to understand the gate
- Question titles must remain under any hard URL/HTTP limits even if `<title>` is long
- Related-questions block: don't show duplicate questions or questions with zero comments

## Output expected

1. Commits in scoped batches
2. `pnpm check` clean
3. Report back:
   - Which sub-tasks (1-5 above) you shipped, which you punted
   - Schema validation results (manual or via the Rich Results test format)
   - Did you need to add a Supabase RPC or migration? (If yes, document it for DJ to review)
   - Any give-first guarantees you verified are still intact
   - Open follow-up work
