---
name: seo-content-gap-analysis
description: Analyze a blog, keyword, draft, or route for search-intent gaps, metadata weaknesses, competitor framing, FAQ opportunities, and internal-link opportunities. Use before writing or when upgrading existing content for SEO and AI search.
argument-hint: '<keyword, person, file path, or URL path>'
disable-model-invocation: true
---

# SEO Content Gap Analysis

Use this skill to decide what should be written, what should be updated, and what is missing from the current search-facing content.

If `$ARGUMENTS` is empty, ask for one of:

1. A target keyword or topic
2. A person name
3. A blog file path
4. A route or URL path

Examples:

```text
/seo-content-gap-analysis enneagram and ADHD
/seo-content-gap-analysis Joe Rogan
/seo-content-gap-analysis src/blog/people/drafts/Jennifer-Lopez.md
/seo-content-gap-analysis /personality-analysis/Joe-Rogan
```

## Read First

Load these references before analyzing:

- `docs/content-analysis/README.md`
- `docs/content-analysis/seo-optimization-checklist.md`
- `docs/content-analysis/ai-search-optimization-guide.md`
- `docs/brand/README.md`

If the target is a recent people draft, also load:

- `docs/content-analysis/recent-people-drafts-seo-audit-2026-04-03.md`
- `.claude/commands/blog_content_creator_people.md`

## Workflow

### 1. Resolve the target asset

- If the target is a file, read it directly.
- If it is a person name, search `src/blog/people/drafts/` and related route files.
- If it is a route, load the matching route and content source.
- If it is a topic or keyword, search the repo for nearby coverage before browsing outward.

### 2. Define the search job

State clearly:

- the likely primary query
- 3 to 6 secondary queries
- the reader's job to be done
- whether the query is informational, comparative, navigational, or mixed

### 3. Audit the current 9takes asset

Check:

- title and `meta_title`
- description length and clarity
- first-100-word answer quality
- H2/H3 search phrasing
- FAQ presence
- table/list/snippet readiness
- internal links
- freshness and obvious maintenance gaps

### 4. Compare against external search framing

If web research is available, inspect the live search landscape:

- top ranking titles
- recurring subtopics
- repeated question patterns
- snippet formats
- where competitors are generic, shallow, or timid

Do not copy competitor structure blindly. Use it to identify:

- expected coverage
- under-served angles
- opportunities for stronger 9takes positioning

### 5. Find the real gaps

Separate:

- `must_have`: search-intent basics missing from the current asset
- `differentiation`: where 9takes can say something sharper or more evidence-based
- `internal_graph`: crosslinks and adjacent articles that should be connected

## Output Format

```markdown
# SEO Gap Analysis: [Target]

## Search Frame

- Primary query:
- Secondary queries:
- Search intent:
- Reader job:

## Current Asset Audit

| Area | Status | Notes |

## External Pattern Snapshot

| Pattern | Seen often? | Why it matters |

## Gap Map

### Must-have gaps

- ...

### Differentiation gaps

- ...

### Internal link gaps

- ...

## Recommended Fixes

- New title:
- New meta title:
- New description:
- Suggested FAQ questions:
- Suggested H2/H3 replacements:
- Suggested internal links:

## Priority

- Impact: high / medium / low
- Effort: high / medium / low
- Best next move:
```

## Rules

- Start from real search intent, not what sounds literary.
- Keep the 9takes edge: pattern recognition, emotional logic, and practical payoff.
- Do not recommend generic SEO filler.
- For people drafts, preserve 1 to 2 strong signature headers if they are earning their place.
- Be explicit about whether the biggest issue is no content, weak structure, or weak positioning.

## Save Behavior

Do not write a file unless the user asks or the workflow clearly calls for it.

If saving is useful, default to:

- `docs/content-analysis/[slug]-seo-gap-analysis.md`
