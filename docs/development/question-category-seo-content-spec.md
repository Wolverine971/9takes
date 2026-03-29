---
title: 'Question Category SEO Content Spec'
description: 'Spec for admin-managed AI-generated markdown intros on question category pages'
last_modified: 2026-03-29
status: draft
category: spec
related:
  - ./questions-comments-analysis.md
  - ./content-board-enhancement-spec.md
  - ../../src/routes/questions/categories/[slug]/+page.server.ts
  - ../../src/utils/server/openai.ts
path: docs/development/question-category-seo-content-spec.md
---

# Question Category SEO Content Spec

## Intent

Create a category-content system that gives each public question category page a short, useful, indexable introduction without turning category pages into bloated articles.

The content should:

- be short and natural
- be aware of the category hierarchy
- reflect the actual questions that exist in that category subtree
- be admin-reviewable and manually editable
- fail safely when AI generation does not complete

This is primarily for category-page SEO and crawlability, but the copy still needs to be helpful for real users.

---

## Current State

Today:

- `question_categories` only stores taxonomy data: `id`, `category_name`, `parent_id`, `level`
- public category pages at `/questions/categories/[slug]` have no explanatory copy
- category pages currently rely on question listings and subcategory traversal alone
- admin tooling exists for questions and comments, but not for category content
- question tagging already runs through `src/utils/server/openai.ts`
- the live category tree now comes from `question_categories` plus `question_category_tags`

Current weakness:

- many category pages are still thin from a search perspective
- middle categories can be meaningful for navigation, but do not currently explain the topic area
- there is no admin workflow for generating, reviewing, or editing category-level copy

---

## Product Goals

1. Give every public category with live questions a short markdown intro.
2. Make the intro hierarchy-aware, especially for middle categories with no direct questions.
3. Reuse the current question/category taxonomy rather than inventing a second content model.
4. Let admins generate, review, edit, and regenerate content from an admin page.
5. Keep the public page primarily about questions, not boilerplate SEO text.
6. Make generation fault tolerant so failed runs do not block public pages.

## Non-Goals

1. Do not turn category pages into long-form blog posts.
2. Do not auto-publish hallucinated topic summaries unrelated to existing questions.
3. Do not generate content for categories that have no live question subtree.
4. Do not make the category page depend on AI generation completing successfully.
5. Do not add FAQ spam or heavy schema markup in v1.

---

## UX Principles

- The questions remain the main content.
- Category intro copy should usually stay between 80 and 180 words.
- Generate intros only for live categories whose subtree contains at least 3 questions.
- The intro must describe the topic area and the kinds of questions present, not answer the questions.
- Broad categories should mention important child themes.
- Leaf categories should describe the specific kinds of questions that appear there.
- Copy should use semantically related language, including LSI-style related terms, but without obvious keyword stuffing.
- The tone should feel human and editorial, not robotic or SEO-template driven.

---

## Proposed Data Model

### Recommendation

Store the current published intro state directly on `question_categories`, and store generation attempts in a lightweight run-log table.

This keeps public reads simple while still giving admin workflows enough observability.

### `question_categories` additions

Add these columns:

```sql
alter table question_categories
  add column intro_markdown text,
  add column intro_description text,
  add column intro_status text not null default 'missing',
  add column intro_source text not null default 'ai',
  add column intro_prompt_version text,
  add column intro_generated_at timestamptz,
  add column intro_updated_at timestamptz not null default now(),
  add column intro_updated_by uuid references profiles(id),
  add column intro_reviewed_at timestamptz,
  add column intro_context jsonb not null default '{}'::jsonb;
```

### Column semantics

- `intro_markdown`
  - the short markdown block rendered on the public category page
- `intro_description`
  - a 120 to 160 character plain-text description used for meta description and JSON-LD description
- `intro_status`
  - one of: `missing`, `processing`, `completed`, `failed`, `stale`
- `intro_source`
  - one of: `ai`, `manual`, `ai_edited`
- `intro_prompt_version`
  - lets us track prompt changes over time
- `intro_generated_at`
  - when AI last successfully generated the intro
- `intro_updated_at`
  - last save timestamp, whether AI or manual
- `intro_updated_by`
  - last admin who changed it
- `intro_reviewed_at`
  - when an admin explicitly reviewed/approved the current copy
- `intro_context`
  - JSON snapshot of the generation context and any failure details

### `intro_context` shape

Suggested structure:

```json
{
	"path": ["Personal Life And Wellness", "Relationships"],
	"directQuestionCount": 0,
	"subtreeQuestionCount": 37,
	"childCategories": [{ "id": 31, "name": "Community and Social Relationships", "count": 6 }],
	"sampleQuestionIds": [150, 154, 146],
	"sampleQuestionTitles": [
		"What are you doing for the holidays?",
		"What is valuable to you when searching for community?"
	],
	"semanticTerms": ["friendship", "community", "social bonds"],
	"contextHash": "sha256:...",
	"lastError": null,
	"model": "..."
}
```

### Run log table

Add:

```sql
create table question_category_intro_runs (
  id uuid primary key default gen_random_uuid(),
  category_id integer not null references question_categories(id) on delete cascade,
  status text not null,
  trigger text not null,
  prompt_version text,
  model text,
  context jsonb not null default '{}'::jsonb,
  output jsonb,
  error text,
  created_by uuid references profiles(id),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  created_at timestamptz not null default now()
);
```

This table is for admin diagnostics and auditability. Public pages should not depend on it.

---

## Public Page Behavior

### Rendering

On `/questions/categories/[slug]`:

- render `intro_markdown` below the `h1`
- keep it above the subcategory grid and above the question list
- only render it if `intro_markdown` is non-empty
- if intro data is missing or failed, the page still loads normally

### Markdown rules

Allow only a narrow markdown subset:

- paragraphs
- unordered lists
- bold
- italics
- inline code
- links

Disallow or strip:

- headings
- tables
- block HTML
- images
- embedded components

### Server-side rendering

Render markdown to HTML on the server so the copy is present in the initial HTML response for crawlers.

Use a server-only renderer based on the existing `marked` setup in `src/lib/server/blogContentProcessor.ts`, plus sanitization.

### SEO metadata

Update the category page metadata so that:

- `<meta name="description">` uses `intro_description` when available
- CollectionPage JSON-LD `description` uses `intro_description` when available
- fallback remains the current generic description if no intro exists

### What the intro should do on middle categories

If a category has no direct questions but does have descendant questions:

- the intro should still describe the category
- it should explain the active child themes beneath it
- it should not pretend there are direct questions if there are none

Example:

- `Relationships` should describe relationship-focused questions broadly and mention areas like family, romance, friendship, work, and community if those are the active live branches

---

## Admin Experience

### Route shape

Add a dedicated admin section:

- `/admin/categories`
- `/admin/categories/[id]`

Add a top-level nav item in `src/routes/admin/+layout.svelte` for discoverability.

### `/admin/categories`

This page should act like a queue and audit board.

Columns:

- category name
- hierarchy path
- live subtree question count
- direct question count
- intro status
- source
- last generated
- last reviewed

Filters:

- all
- live only
- missing
- stale
- failed
- completed
- manual or ai-edited

Actions per row:

- open public page
- open editor
- generate intro
- regenerate intro
- mark reviewed

Bulk actions:

- generate missing
- regenerate stale
- retry failed

### `/admin/categories/[id]`

This page should be a minimal editor, not a full CMS.

Main sections:

1. metadata panel
   - category name
   - breadcrumb path
   - level
   - direct question count
   - subtree question count
   - child categories with counts
   - intro status
   - prompt version
   - last generation error if any

2. markdown editor
   - reuse `src/routes/admin/content-board/MarkdownEditor.svelte`
   - show current `intro_markdown`
   - allow manual save

3. context preview
   - sample question titles
   - semantic terms
   - question count snapshot used for generation

4. actions
   - generate AI intro
   - regenerate AI intro with manual-change warning when applicable
   - save
   - mark reviewed
   - open public page

### Manual edit behavior

Manual edits should not be overwritten automatically.

Rules:

- if admin edits AI output, set `intro_source = 'ai_edited'`
- if admin writes content from scratch, set `intro_source = 'manual'`
- allow regeneration even for `manual` and `ai_edited` rows
- show a warning before regeneration when the latest saved state is `manual` or `ai_edited`
- later taxonomy changes should mark the row `stale`, but should not auto-replace manual text

---

## Generation Workflow

### Generation context builder

Add a shared server helper, likely near `questionCategoryTree.ts`, that builds a category intro context from live data.

Input:

- category id
- full category tree
- active questions
- `question_category_tags`
- question titles
- optional `question_keywords`

Output:

- category name
- path from root
- direct question count
- subtree question count
- visible child categories with counts
- sample direct questions
- sample descendant questions
- semantically related terms aggregated from question titles and stored keywords

Eligibility rule:

- only generate intros when `subtreeQuestionCount >= 3`
- use subtree count rather than direct-question count so middle categories can still qualify

### Trigger strategy

When a question is tagged, untagged, removed, or moved between categories:

- mark the affected category as `stale`
- mark all ancestor categories as `stale`

Do not immediately regenerate synchronously in the question-tagging request.

Reason:

- tagging already does meaningful work
- category content will churn if regenerated on every small taxonomy change
- stale marking is safer and easier to recover

### Generation entry points

1. manual single-category generation from admin
2. bulk generation for `missing`
3. bulk regeneration for `stale`
4. retry from `failed`

Optional later:

- scheduled background refresh for stale categories

### API shape

Recommended routes:

- `GET /api/admin/question-categories/[id]`
- `PUT /api/admin/question-categories/[id]`
- `POST /api/admin/question-categories/[id]/generate`
- `GET /api/admin/question-categories/[id]/status`
- `POST /api/admin/question-categories/bulk-generate`

Use the same admin-guard pattern already present in:

- `src/routes/api/admin/content/[id]/+server.ts`
- `src/routes/api/update-questions/+server.ts`

### Async job handling

Use the same pattern already used for question AI tagging:

- set `intro_status = 'processing'`
- create a run row
- kick off async generation with `waitUntil` when available
- poll status from the admin UI
- on success store content and mark `completed`
- on failure store error and mark `failed`

---

## Prompt Contract

### Model output shape

Generate JSON, not free text:

```json
{
	"intro_markdown": "Short markdown intro here.",
	"intro_description": "Plain-text description for SEO.",
	"semantic_terms": ["relationship dynamics", "friendship", "social connection"]
}
```

### Prompt inputs

Provide:

- category name
- full hierarchy path
- whether the category has direct questions
- direct and subtree counts
- visible child category names
- sample live question titles
- sample question keywords if available

### Prompt rules

The prompt should enforce:

- 80 to 180 words by default
- 220 words hard cap
- 1 to 2 short paragraphs
- optional short bullet list only when the category is broad
- no headings
- no filler like "Welcome to" or "In this article"
- no advice voice and no answering the questions
- no invented claims beyond the actual category context
- use natural semantically related language, including LSI-style supporting terms
- mention child themes for broad parent categories
- stay specific for leaf categories

### Prompt quality bar

Bad:

- generic self-help language
- repeated use of the exact category name
- keyword-stuffed phrasing
- content that reads like a blog intro template

Good:

- concise
- concrete
- rooted in actual question themes
- useful to both readers and crawlers

### Example output for `Relationships`

```json
{
	"intro_markdown": "This category collects questions about how people handle connection, trust, conflict, closeness, and social belonging. It spans relationship themes like romance, family dynamics, friendship, workplace boundaries, self-relationship, and community ties, so the questions here often move between intimacy, communication, expectations, and emotional needs.\n\nSome prompts are about dating, marriage, and relationship challenges, while others focus on family roles, office politics, loneliness, or finding a sense of community. The point of the category is not one narrow relationship topic, but the broader ways people relate to each other and make meaning inside those bonds.",
	"intro_description": "Browse relationship questions about romance, family, friendship, community, boundaries, intimacy, and social connection.",
	"semantic_terms": ["relationship dynamics", "social connection", "trust", "boundaries"]
}
```

---

## Failure Tolerance

### Public page fallback

If generation fails:

- keep the last successful intro if one exists
- otherwise show no intro
- never block the category page

### Admin recovery

If generation fails:

- show status badge `failed`
- surface last error text
- preserve the context snapshot used for the failed run
- allow one-click retry

### Staleness rules

Mark content `stale` when:

- question tags change for that category
- descendant question set changes
- public prompt version changes
- an admin explicitly marks the intro stale

Do not automatically erase the old copy when status becomes `stale`.

---

## Suggested Implementation Phases

### Phase 1

- add schema fields on `question_categories`
- add run log table
- add category intro context builder
- add generation helper in `src/utils/server/openai.ts`
- add admin list page
- add single-category manual generation

### Phase 2

- add category detail editor with markdown editing
- render intro markdown on public category pages
- wire `intro_description` into page metadata
- add stale marking when question tags change

### Phase 3

- add bulk generation actions
- add bulk retry for failed and stale categories
- add reviewed state and filters
- optionally add scheduled refresh for stale categories

---

## Files Likely In Scope

- `src/routes/admin/+layout.svelte`
- `src/routes/admin/categories/+page.server.ts`
- `src/routes/admin/categories/+page.svelte`
- `src/routes/admin/categories/[id]/+page.server.ts`
- `src/routes/admin/categories/[id]/+page.svelte`
- `src/routes/api/admin/question-categories/[id]/+server.ts`
- `src/routes/api/admin/question-categories/[id]/generate/+server.ts`
- `src/routes/questions/categories/[slug]/+page.server.ts`
- `src/routes/questions/categories/[slug]/+page.svelte`
- `src/lib/server/questionCategoryTree.ts`
- `src/utils/server/openai.ts`
- `database.types.ts`
- `supabase/migrations/...`

---

## Acceptance Criteria

1. A category with live questions can store and render short intro markdown.
2. A middle category with only descendant questions can still have meaningful intro copy.
3. Admins can see which categories are missing, stale, failed, or completed.
4. Admins can generate and manually edit category intros.
5. Public category pages remain fully functional if intro generation fails.
6. Category metadata uses the stored intro description when available.
7. Manual edits are not silently overwritten by later AI runs.

---

## Open Questions

1. Should `/admin/categories` show all taxonomy nodes or only public-visible categories with live question subtrees?
2. Should the public page show a tiny “last updated” note for reviewed intros, or keep the content completely invisible as editorial infrastructure?
3. Do we want to store `semantic_terms` in dedicated columns, or keep them only inside `intro_context` for diagnostics?
