<!-- docs/planning/personality-analysis-category-index-plan.md -->

# Personality Analysis Category Index Plan

_Last updated: 2026-03-12_

## Goal

Create category index pages for the personality-analysis library so people can browse public figures by domain, not just by Enneagram number.

Examples:

- politicians
- musicians
- tech / founders
- creators / internet personalities
- movie stars

## What I Checked

I did **not** find a dedicated existing plan doc for category index pages.

Closest related references:

- `src/blog/people/drafts/*.md` for current `type` frontmatter
- `src/lib/components/molecules/BlogTiles.svelte` for an older hard-coded people taxonomy
- `src/lib/instagram/postingStrategy.ts` for the cleanest existing normalization of raw `type` tags into broader lanes
- `docs/domain-authority/07-pop-culture-celebrities.md` for strategic category buckets
- `docs/development/content-command-center-spec.md` for category-distribution thinking

Important constraint:

- The people content currently stores **raw `type[]` tags**, not a normalized `category` field.
- Existing related-post logic on individual pages queries against raw `type[]`.
- Because of that, the first version of category pages should be **derived in code** from `type[]`, not built on a schema migration.

## Current Raw Type Snapshot

Source: `src/blog/people/drafts/*.md`

### Raw label counts

| Raw type              | Count |
| --------------------- | ----: |
| `creator`             |    41 |
| `musician`            |    28 |
| `celebrity`           |    25 |
| `movieStar`           |    21 |
| `politician`          |    19 |
| `techie`              |    17 |
| `newMovieStar`        |    10 |
| `comedian`            |     9 |
| `entrepreneur`        |     6 |
| `historical`          |     6 |
| `author`              |     5 |
| `lifestyleInfluencer` |     3 |
| `activist`            |     2 |
| `business`            |     2 |
| `influencer`          |     2 |
| `tiktoker`            |     2 |
| `athlete`             |     1 |
| `cultural icon`       |     1 |
| `essay`               |     1 |
| `journalist`          |     1 |
| `other`               |     1 |
| `psychology`          |     1 |
| `sports`              |     1 |

### Taxonomy issues

- `celebrity`, `movieStar`, and `newMovieStar` overlap heavily.
- `creator`, `influencer`, `tiktoker`, `lifestyleInfluencer`, and `journalist` are all adjacent.
- `politician`, `historical`, and `activist` overlap in public-figure coverage.
- Several labels are one-offs and should not each get their own top-level page yet.
- Multi-tag files already exist, so the content model supports both primary and secondary grouping.

## Recommended Category Hubs

Use broad category hubs for navigation, while keeping raw tags for precision.

### Phase 1 hub pages

| Hub slug          | Page label                        | Raw tags included                                                        | Current coverage |
| ----------------- | --------------------------------- | ------------------------------------------------------------------------ | ---------------: |
| `film-tv`         | Film & TV                         | `movieStar`, `newMovieStar`, `celebrity`                                 |               55 |
| `creator-media`   | Creators & Internet Personalities | `creator`, `influencer`, `tiktoker`, `lifestyleInfluencer`, `journalist` |               46 |
| `music`           | Musicians & Artists               | `musician`                                                               |               28 |
| `politics-public` | Politics & Public Figures         | `politician`, `historical`, `activist`                                   |               26 |
| `tech-business`   | Tech, Founders & Business         | `techie`, `entrepreneur`, `business`                                     |               24 |

### Phase 2 hub pages

| Hub slug           | Page label         | Raw tags included               | Current coverage |
| ------------------ | ------------------ | ------------------------------- | ---------------: |
| `comedy`           | Comedians          | `comedian`                      |                9 |
| `authors-thinkers` | Authors & Thinkers | `author`, `psychology`, `essay` |                7 |

### Do not make standalone hubs yet

- `athlete`
- `sports`
- `other`
- `cultural icon`

These can stay as secondary tags until there is enough coverage to justify a real landing page.

## Recommended Rules

### 1. Keep raw tags

Do not remove the existing `type[]` tags. They are already used by the site and are useful for narrow related-post matching.

### 2. Add a derived canonical category map in code

Create one central map, for example:

```ts
export const PEOPLE_CATEGORY_GROUPS = {
	'film-tv': ['movieStar', 'newMovieStar', 'celebrity'],
	'creator-media': ['creator', 'influencer', 'tiktoker', 'lifestyleInfluencer', 'journalist'],
	music: ['musician'],
	'politics-public': ['politician', 'historical', 'activist'],
	'tech-business': ['techie', 'entrepreneur', 'business'],
	comedy: ['comedian'],
	'authors-thinkers': ['author', 'psychology', 'essay']
} as const;
```

### 3. Treat category as a browse-layer, not a schema-layer

For V1, category pages should be built by checking whether a post's `type[]` contains any raw tag in a group.

### 4. Let pages support overlap

A person can appear in more than one hub when the tags justify it.

Examples:

- Taylor Swift: `music` and `tech-business` only if you explicitly want entrepreneur crossover surfaced
- Meghan Markle: `film-tv` and `politics-public`
- Lex Fridman: `creator-media` and `tech-business`

### 5. Add a primary-display rule

For card sorting, pick one display category per person so hub pages do not feel chaotic.

Recommended rule:

1. Use the first matching raw tag in frontmatter order.
2. Allow secondary appearance in other hubs only when strategically helpful.

## Information Architecture

### New routes

- `/personality-analysis/categories`
- `/personality-analysis/categories/[slug]`

### Purpose of each page

`/personality-analysis/categories`

- Overview page for all category hubs
- Short explanation of what each category covers
- Counts per category
- Featured people per category

`/personality-analysis/categories/[slug]`

- Intro to the category
- What patterns unify people in that domain
- Grid/list of matching personality analyses
- Optional sections for:
  - featured profiles
  - recently updated
  - by Enneagram type
  - adjacent categories

## Content Template For Each Category Page

Each hub page should include:

1. **Strong intro**
   Explain what this category reveals about personality.

2. **Why this category matters**
   Example: politicians reveal power, loyalty, image management, and ideology under pressure.

3. **Common personality tensions in this domain**
   Example: musicians often show the tension between authenticity and performance.

4. **Featured profiles**
   Hand-picked 6-12 best pages.

5. **Full library**
   Full card grid or searchable list.

6. **Enneagram distribution**
   Optional if the data is easy to compute.

7. **Cross-links**
   Link to related categories and to `/personality-analysis/type/[1-9]`.

## Recommended Launch Order

### First build

1. `film-tv`
2. `creator-media`
3. `music`
4. `politics-public`
5. `tech-business`

Reason:

- These cover the bulk of the library.
- They match the labels already implied in older docs and UI.
- They are broad enough to feel substantial on day one.

### Second build

1. `comedy`
2. `authors-thinkers`

## Implementation Notes

### Data loading

- Query published people posts
- Read `type[]`
- Derive category membership in server code
- Sort by a mix of:
  - content quality if available
  - image availability
  - freshness (`lastmod`)
  - manual featured overrides if needed

### Reuse opportunities

- Reuse the existing image/card treatment from personality-analysis pages
- Reuse existing related-post conventions where possible
- Reuse the canonical normalization ideas already present in `src/lib/instagram/postingStrategy.ts`

### Follow-up improvement

After the pages exist, update individual profile pages so they link back to their category hub:

- "More Musicians"
- "More Politicians"
- "More Tech Founders"

## Suggested Next Work

After this doc, the next implementation step should be:

1. add the canonical category config
2. build `/personality-analysis/categories`
3. build `/personality-analysis/categories/[slug]`
4. launch the top 5 hubs
5. add hub links to individual profile pages

## Decision Summary

- No existing dedicated category-index plan was found.
- The current raw taxonomy is real but messy.
- The cleanest approach is to keep raw `type[]` tags and derive broader hub pages from them.
- Start with 5 high-coverage hub pages, then expand.
