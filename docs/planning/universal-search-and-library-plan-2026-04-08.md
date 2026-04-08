<!-- docs/planning/universal-search-and-library-plan-2026-04-08.md -->

# Universal Search And Library Plan

Date: 2026-04-08
Owner: DJ Wayne / Codex
Status: Proposed

## 2026-04-08 Progress Update

Implemented in repo:

- native Supabase question search and typeahead replaced Elasticsearch for public question search flows
- new blog-search hardening migration adds:
  - weighted heading-aware search vectors for `blogs_content`
  - stronger people-name weighting for `blogs_famous_people`
  - trigram indexes for title/description/person lookups
  - richer ranking logic for `search_all_blogs` and `typeahead_blog_search`
- unified backend search layer now exists as:
  - `/api/search` for full mixed-source results
  - `/api/search/typeahead` for mixed-source suggestions
  - `search_questions` RPC for full question search
  - app-layer normalization/merge over blog + question search helpers
- local Markdown blog sync now:
  - extracts headings/subheadings
  - computes a stable `content_hash`
  - skips unchanged rows by hash instead of only `lastmod`
  - unpublishes stale rows when files disappear or are unpublished
- `pnpm gen:all` now ends with `pnpm gen:search-index`, which safely skips when Supabase service env is missing

Still pending:

- apply the new blog-search migration in Supabase
- build the public unified `/search` and `/api/search` layer
- remove the remaining Elasticsearch package/env/dead code once the universal search path is fully live

## Why This Exists

9takes needs one clean, public search experience that can cover:

- Personality Analysis blogs
- Enneagram deep dives
- How-to guides
- Opinion pieces / Community blogs
- Pop culture analysis
- Questions

The current setup is close on the blog side, but incomplete overall:

- blog search already exists through Supabase for `blogs_content` and `blogs_famous_people`
- question search still depends on Elasticsearch
- local Markdown blogs need a more reliable indexing path
- `pnpm gen:all` does not currently include search indexing

This document tracks the design direction, technical architecture, and rollout plan.

## Product Direction

### Core Principle

Search should feel like the front door to the resource library, not a hidden utility.

### Navigation Recommendation

Do not make search homepage-only.

Use a sitewide search-first header:

- left: `9takes` logo
- center: prominent universal search input
- right: `Library` dropdown, `Questions`, `Coaching`, theme/account

This keeps the product split clear:

- `Library` = all resource content
- `Questions` = community discussion product

### Library Dropdown

The `Library` dropdown should group the resource side of the site:

- Personality Analysis
- Enneagram Deep Dives
- How-to Guides
- Opinion Pieces
- Pop Culture Analysis

Notes:

- `Opinion Pieces` is the public-facing label for the current Community content
- the route can stay `/community` until a separate rename is worth doing

### Results Page Structure

The header search should open typeahead immediately and submit to a dedicated `/search` page.

Recommended scopes on the results page:

- All
- Library
- Questions
- Personality Analysis
- Enneagram
- Guides
- Opinion
- Pop Culture

Recommended sorts:

- Relevance
- Newest
- Most Discussed for questions

### Reddit Pattern To Borrow

Reddit's current pattern is useful here:

- one global search input at the top
- content-type scopes on results
- page-level scoped search when already inside a section/community

For 9takes, the translation is:

- global header search for everything
- `Library` as the content grouping mechanism
- optional scoped search pills when inside `Personality Analysis`, `Enneagram Corner`, or `Questions`

## Recommended UX

### Desktop Header

Recommended layout:

```text
[9takes]    [ Search all blogs and questions...            ]    [Library v] [Questions] [Coaching] [Theme] [Account]
```

Design notes:

- keep the search bar visually dominant
- do not keep every content section as a top-level nav item
- use one well-designed dropdown instead of many competing links
- keep `Questions` separate because it is not just another article section

### Mobile Header

Recommended layout:

- row 1: menu, logo, account/theme
- row 2: full-width search input

Do not hide search behind a tiny icon on mobile if search is meant to lead the experience.

### Search Behavior

Header search should support:

- debounced typeahead
- keyboard navigation
- direct enter-to-results-page
- source labels in results
- highlighted match snippets

Typeahead should show mixed results with clear labels:

- `Question`
- `Personality Analysis`
- `Enneagram`
- `Guide`
- `Opinion`
- `Pop Culture`

## Architecture Recommendation

## Decision

Move off Elasticsearch for questions.

Use Supabase/Postgres full-text search as the primary search system.

Do not block launch on embeddings.

### Why

For this product, the highest-value searches are usually lexical:

- person names
- Enneagram types
- exact topics like anxiety, dating, ghosting, conflict
- known questions or phrases

Embeddings are useful later, but they are not the best first foundation for:

- navbar typeahead
- exact match ranking
- predictable editorial search behavior
- low-complexity operations

### Recommended Search Stack

Phase 1 foundation:

- Postgres `tsvector`
- `websearch_to_tsquery`
- GIN indexes
- `ts_rank`
- `ts_headline`

Phase 2 optional enhancement:

- pgvector embeddings in Supabase
- hybrid search with reciprocal rank fusion
- semantic reranking for long natural-language searches

### Practical Recommendation

Build universal search as:

1. keyword-first search in Supabase
2. optional semantic enhancement later

Not:

1. embeddings-first search
2. then trying to patch exact match behavior afterward

## Data Model Direction

### Blogs

Keep using the current split:

- file-backed blogs indexed into `blogs_content`
- DB-backed people content in `blogs_famous_people`

This is already the right pattern for searchable resource content.

### Questions

Add native search support to `questions` in Supabase:

- `search_vector tsvector`
- trigger or generated-column logic based on:
  - `question`
  - `question_formatted`
  - `context`

Optional later denormalization:

- question categories into a searchable text column or side table

### Universal Search API

Add a single public API layer for all searchable content:

- `/api/search`
- `/api/search/typeahead`

Back it with:

- blog RPCs for library search
- a dedicated `search_questions` RPC for full question search
- app-layer normalization and rank merging in SvelteKit

Return one normalized result shape:

- `source`
- `subtype`
- `id`
- `title`
- `description`
- `headline`
- `url`
- `category`
- `enneagram`
- `rank`
- `updated_at`

## Indexing Strategy

### Current Problem

The existing blog indexing script compares only `lastmod` when deciding whether to skip an update.

That is not reliable enough.

Failure cases:

- file content changes but frontmatter `lastmod` does not
- file is unpublished and the index is not cleaned up
- file is deleted or moved and the old index row remains

### Required Fix

Move to content-hash-based incremental indexing for file-backed blogs.

Each indexed blog row should store at least:

- `path` (existing source-path field)
- `content_hash`
- `headings`
- `indexed_at`

The sync process should:

1. scan all published searchable Markdown files
2. compute a stable hash from searchable content plus relevant frontmatter
3. upsert only changed rows
4. mark missing/unpublished rows as not searchable

### Proposed Columns For `blogs_content`

- `headings text[]`
- `content_hash text`
- `indexed_at timestamptz`

### Questions Indexing

Questions do not need an external indexing script.

Use database-native indexing:

- trigger on insert/update of search-relevant columns
- optional helper trigger or periodic refresh if category labels must be denormalized

This is simpler and more durable than keeping a second external search engine in sync.

## `pnpm gen:all` Integration

### Goal

When `pnpm gen:all` runs, it should check published Markdown content and sync changed blog search documents to Supabase.

### Important Constraint

`gen:all` currently behaves like a mostly local generation command.

Adding direct remote writes introduces two concerns:

- it requires Supabase service credentials
- it can unexpectedly mutate remote state during local development

### Recommended Approach

Add a dedicated step like:

- `gen:search-index`

And then wire it into `gen:all` in a guarded way.

Recommended behavior:

- if `SUPABASE_SERVICE_KEY` is available, sync search index
- if not, print a clear skip message and exit successfully

This keeps the workflow simple without making `gen:all` fragile.

### Proposed Script Flow

```text
pnpm gen:all
  -> format
  -> generate local artifacts
  -> generate crosslinks
  -> sync Markdown search index if env is available
```

## Elasticsearch Deprecation Plan

### Recommendation

Deprecate Elasticsearch in stages.

Do not cut it over in one shot.

### Stages

1. Add Supabase-backed question search in parallel
2. Switch public read paths to Supabase
3. Remove admin reindex dependency on Elasticsearch
4. Stop writing new question documents to Elasticsearch
5. Remove ES env vars, client code, and package dependency

### Why This Order

This reduces risk and lets search quality be compared before the final cutover.

## Embeddings Plan

### Recommendation

Embeddings are phase 2, not phase 1.

### Good Uses Later

- semantic matching for long natural-language searches
- "related questions"
- "you may also want to read"
- query expansion for near-synonyms

### Not Good As The First Search Layer

- name lookups
- typeahead
- exact topic navigation
- predictable content admin workflows

### If Added Later

Store embeddings in Supabase, not a separate system.

Use hybrid search:

- lexical search for precision
- vector search for recall
- reciprocal rank fusion for final ranking

## Rollout Plan

### Phase 1: IA And UX

- redesign header around search + `Library`
- build public `/search` page
- implement mixed-source typeahead UI

### Phase 2: Supabase Question Search

- add `search_vector` to `questions`
- add GIN index
- add question typeahead RPC
- add full question search RPC

### Phase 3: Universal Search

- add unified public APIs for full results and typeahead
- normalize source labels and URLs
- add result scopes and filters

### Phase 4: Markdown Sync Hardening

- upgrade blog indexing to content-hash sync
- mark missing/unpublished content as non-searchable
- integrate sync into `pnpm gen:all`

### Phase 5: Elasticsearch Removal

- switch reads
- switch writes
- remove dead code

### Phase 6: Optional Hybrid Search

- add pgvector
- generate embeddings for search documents
- add hybrid reranking

## Immediate Implementation Tasks

- [ ] Create the public search UI pattern and header redesign
- [ ] Build `/search` results page
- [x] Add Supabase full-text search to `questions`
- [x] Replace question typeahead with a Supabase-backed implementation
- [x] Remove Elasticsearch from question slug collision checks
- [x] Create unified `/api/search` backend layer
- [x] Create unified `/api/search/typeahead` backend layer
- [x] Upgrade Markdown indexing from `lastmod` checks to content hash checks
- [x] Handle deleted/unpublished Markdown content during sync
- [x] Add guarded search sync into `pnpm gen:all`
- [ ] Remove remaining write-side question Elasticsearch dependencies (`es_id`, comment/subscription sync, image sync)
- [ ] Remove Elasticsearch completely
- [ ] Evaluate hybrid search only after keyword search is live

## Open Decisions

- [ ] Whether `Opinion Pieces` is only a nav label or also a route rename
- [ ] Whether `Questions` should appear inside the `Library` dropdown or remain separate
- [ ] Whether question categories are needed in search v1 ranking
- [ ] Whether `/search` should be indexable by search engines or `noindex`
- [ ] Whether popular/trending searches should appear in the empty state

## Final Recommendation

The right move is:

- search-first header
- `Library` dropdown for resource sections
- Supabase full-text search as the primary engine
- incremental Markdown indexing tied to the content pipeline
- Elasticsearch retirement in phases
- embeddings later, only if the keyword-first version proves limiting

That gives 9takes a cleaner information architecture and a simpler operating model at the same time.
