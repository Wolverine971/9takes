<!-- docs/seo/buckets/2026-05-07-bucket-4-content-clusters.md -->

# Bucket 4 — New Content Clusters (Choose-One-and-Ship)

## Mission

Start ONE new content cluster from the SEO research recommendations. Don't try to ship all 8 in this wave — pick the one with highest ROI given current state and ship the first 2-3 pages, with cookie-cutter templates that the rest of the cluster can use.

## Why this matters

The biggest content gaps per the master cluster map are wings (18 pages), subtypes (27 pages), and TV-show character casts. Top SERPs in many of these are 7-yr-old Medium posts and personal Tumblrs. The competitor brief calls these "soft underbelly" land-grabs.

## Source docs to read first

- `docs/seo/master-topic-cluster-map-2026-05-06.md` (read Clusters 2A, 3B, 3C, 3D, 3E, 3F, 3H — these are all content clusters)
- `docs/seo/competitor-serp-brief-2026-05-06.md` (Top 15 winnable queries; competitor weakness map)
- `docs/seo/corpus-inventory-gaps-2026-05-06.md` Pillar 2 (enneagram-corner gaps) and Pillar 3 (pop-culture gaps)
- `docs/seo/2026-05-06-research-synthesis.md` Top-10 #5 and #6
- `docs/brand/brand-style-guide-v2.md` (voice attributes)
- An existing well-written reference: `src/blog/enneagram/enneagram-type-4.md` (or any of the 9 type pages — to mirror structure/tone)

## The cluster options (your choice — pick one)

### Option A: TV-show character casts (RECOMMENDED — easiest land grab)

- Top SERPs are 7-yr-old Medium posts and Tumblrs. Trivial competition.
- Start with: The Office, Friends, Succession (5 cast members already in profile corpus)
- File pattern: `src/blog/pop-culture/the-office-enneagram-types.md` etc.
- Cross-link heavily to existing actor profiles where they exist.

### Option B: 18 wings pages

- Cookie-cutter template (4w3, 4w5, 6w5, 9w8, etc.)
- One mega-guide already exists at `src/blog/enneagram/enneagram-wings-complete-guide.md` — atomize it
- Highest single-cluster keyword volume in the Enneagram space

### Option C: 9 mistype pages ("Am I a 4 or a 9?")

- High-intent disambiguation queries
- Confused-user content; weak SERPs
- File pattern: `src/blog/enneagram/type-4-vs-type-9-mistypes.md` etc.

### Option D: Mental-health expansion

- `/enneagram-corner/enneagram-and-adhd`, `/enneagram-and-trauma`, `/enneagram-childhood-wounds-by-type`
- Sibling pages of `/stories/enneagram-and-mental-illness` (already #1 SERP, top traffic)
- Tie to existing celebrity case studies (Robin Williams, Britney Spears, Pete Davidson — all in current draft pipeline per corpus inventory)

### Option E: 12 highest-volume Type-vs-Type comparison pages

- Cookie-cutter, head-term volume
- File pattern: `src/blog/enneagram/type-4-vs-type-5.md` etc.

### Recommendation

**Pick Option A (TV-show character casts)** — easiest competition, highest leverage cross-linking to existing 319 profile corpus, and most distinctly 9takes-flavored. If the TV-cast SERPs are saturated by the time you check, fall back to Option B (wings).

## Scope of first wave

1. **Pick ONE cluster** based on the recommendation above and your own quick competitor sanity-check (use WebSearch to confirm SERPs are weak before writing)
2. **Build a template** — frontmatter + section structure + a cross-linking pattern
3. **Ship the first 2-3 pages** with full prose (NOT TODO skeletons — actual writing). 1500+ words each, on-brand voice, real examples
4. Run `pnpm gen:sitemap` and `pnpm index:blogs` after the commits

## Files likely to touch

- New .md files in `src/blog/pop-culture/` or `src/blog/enneagram/` (NEW only)
- Possibly `src/lib/components/blog/RelatedPosts.svelte` if cross-linking needs a helper
- Possibly `src/lib/components/molecules/blogIndex.ts` if you discover the existing utilities need extension

## Out of scope

- Don't touch other buckets' files (engineering hygiene, AEO callouts, internal linking work, /questions, /how-to-guides schema)
- Don't edit existing pop-culture files — Bucket 3 owns RelatedPosts; the publish queue (`docs/seo/2026-05-07-mdsvex-publish-queue.md`) owns publishing existing drafts
- Don't ship cookie-cutter TODO skeletons (the audit found 11 of those already at root with `published: false`; don't add more)

## Parallel-work safety

- Other agents are publishing queued blogs; don't conflict
- Never `git stash`, hard reset, or wide checkout
- Commit each new blog as its own commit
- Don't push to origin without user approval

## Quality bar

- 9takes voice: tactically direct, socially savvy, respectfully provocative, pattern-recognition focused, results-driven
- Hook → Insight → Action step rhythm
- Every typing claim must have behavioral evidence (specific scenes, quotes, dated incidents)
- 1500+ words minimum (don't pad — earn the length)
- `published: true` and proper frontmatter on every shipped file
- Cross-link to at least 5 existing 9takes pages per new post (use `getRelatedBlogs` or grep for related slugs)
- DO NOT use AI-flat phrasing ("In conclusion", "It's important to note", "delve into", "in today's fast-paced world")

## Output expected

1. The cluster choice (with 1-sentence reasoning)
2. The 2-3 new files committed and published
3. `pnpm gen:sitemap` and `pnpm index:blogs` run
4. Report back:
   - Cluster chosen and why
   - Pages shipped (URLs)
   - Word counts
   - Cross-links added
   - The reusable template for the rest of the cluster (so DJ knows what's left to write)
   - Any cross-links that broke or any cross-link suggestions for the next wave
