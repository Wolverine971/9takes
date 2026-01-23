---
title: 'Famous People Cross-Link Analysis Specification'
description: 'Spec for adding cross-link analysis to the admin content board for personality analysis blogs'
created: 2026-01-23
status: implemented
category: spec
related:
  - ./content-board-enhancement-spec.md
  - ../content-analysis/blog-crosslink-index.md
path: docs/development/famous-people-crosslink-spec.md
---

# Famous People Cross-Link Analysis Specification

## Overview

Add cross-link analysis capabilities to the admin content board, specifically for Famous People (`blogs_famous_people`) blog posts. This feature helps content editors:

1. See which other blogs link TO the current person
2. Discover potential cross-link opportunities (mentions without explicit links)
3. Identify duplicate mentions that need cleanup
4. Improve internal linking for SEO

---

## Problem Statement

Currently, the content board shows outgoing suggestions (people this blog links to) but provides no visibility into:

- **Incoming links**: Which blogs reference this person in their `suggestions`
- **Content mentions**: Which blogs mention this person's name in their content but haven't added them to suggestions
- **Link opportunities**: Potential connections that could strengthen the internal link network
- **Duplicates**: When the same person appears multiple times in content (may indicate editing issues)

---

## Data Sources

### Primary Table: `blogs_famous_people`

| Column        | Type    | Cross-Link Relevance                         |
| ------------- | ------- | -------------------------------------------- |
| `id`          | number  | Primary key                                  |
| `person`      | string  | URL slug (e.g., "cristiano-ronaldo")         |
| `title`       | string  | Display name in results                      |
| `content`     | string  | Raw markdown - search for mentions           |
| `suggestions` | Json    | Array of person slugs - explicit cross-links |
| `enneagram`   | string  | Filter by same type                          |
| `category`    | string  | Filter by same category                      |
| `published`   | boolean | Filter published only                        |

### Current Display

The `MetadataSidebar.svelte` "Related Content" section shows:

- **Suggestions**: Outgoing links as clickable pills (lines 103-114)
- This is the ONLY cross-link info currently visible

---

## Cross-Link Types

### 1. Outgoing Suggestions (Already Implemented)

**Definition**: People listed in THIS blog's `suggestions` array

**Current State**: Displayed as pills in MetadataSidebar

**No changes needed** - just ensure consistency with new features

---

### 2. Incoming Suggestions (NEW)

**Definition**: Other blogs that have THIS person in their `suggestions`

**Query Logic**:

```sql
SELECT id, person, title, enneagram, category
FROM blogs_famous_people
WHERE suggestions::jsonb @> '["current-person-slug"]'::jsonb
  AND person != 'current-person-slug'
  AND published = true
ORDER BY title;
```

**Use Case**: See who is already linking to this person. Useful for:

- Understanding the person's visibility in the content network
- Finding related content for reference
- Ensuring reciprocal linking where appropriate

---

### 3. Content Mentions (NEW)

**Definition**: Other blogs that mention this person's name in their `content` but may or may not have them in `suggestions`

**Query Logic** (with variations for name matching):

```sql
SELECT id, person, title, enneagram, category,
       -- Count occurrences for duplicate detection
       (LENGTH(content) - LENGTH(REPLACE(LOWER(content), LOWER('Person Name'), '')))
         / LENGTH('Person Name') AS mention_count
FROM blogs_famous_people
WHERE (
    content ILIKE '%Person Name%'           -- Full name
    OR content ILIKE '%person-slug%'        -- Slug format
  )
  AND person != 'current-person-slug'
  AND published = true
ORDER BY mention_count DESC, title;
```

**Name Matching Challenges**:

- Slug: `cristiano-ronaldo`
- Display name: `Cristiano Ronaldo`
- Partial matches: `Ronaldo` (could match multiple people)
- Need to derive display name from slug: replace `-` with space, title case

**Recommendation**: Start with full name matching, add partial matching as enhancement

---

### 4. Potential Cross-Links (NEW)

**Definition**: Content mentions that are NOT in the blog's suggestions (opportunities to add)

**Derived From**: Content Mentions minus Incoming Suggestions

**Query Logic**: Filter content mentions where the current person is NOT in that blog's suggestions

```sql
SELECT m.id, m.person, m.title
FROM blogs_famous_people m
WHERE (
    m.content ILIKE '%Person Name%'
    OR m.content ILIKE '%person-slug%'
  )
  AND m.person != 'current-person-slug'
  AND m.published = true
  AND NOT (m.suggestions::jsonb @> '["current-person-slug"]'::jsonb)
ORDER BY m.title;
```

**Use Case**: Find blogs that mention this person but haven't added them as a suggestion - easy wins for improving internal linking

---

### 5. Duplicate Detection (NEW)

**Definition**: When a person appears multiple times in content (beyond normal references)

**Types of Duplicates**:

1. **In Suggestions Array**: Same person listed multiple times

   ```sql
   -- Check if suggestions array has duplicates
   SELECT person, suggestions
   FROM blogs_famous_people
   WHERE (
     SELECT COUNT(*) FROM jsonb_array_elements_text(suggestions::jsonb) elem
     GROUP BY elem
     HAVING COUNT(*) > 1
   ) IS NOT NULL;
   ```

2. **Excessive Content Mentions**: Person mentioned >5 times in content (configurable threshold)
   - Normal: 1-3 mentions (intro, body, conclusion)
   - Suspicious: >5 mentions may indicate copy-paste errors or over-optimization

**Display**: Warning badge/icon when duplicates detected

---

## API Design

### New Endpoint: `/api/admin/content/[id]/crosslinks`

**Purpose**: Fetch all cross-link data for a specific person blog

**Request**: `GET /api/admin/content/[id]/crosslinks`

**Response**:

```typescript
interface CrossLinkResponse {
	person: string; // Current person slug
	displayName: string; // Human-readable name

	// Blogs where this person appears in suggestions
	incomingSuggestions: CrossLinkItem[];

	// Blogs that mention this person in content
	contentMentions: CrossLinkMention[];

	// Content mentions NOT in suggestions (opportunities)
	potentialLinks: CrossLinkItem[];

	// Duplicate warnings
	duplicates: {
		inSuggestions: boolean; // Same person in suggestions array multiple times
		excessiveMentions: CrossLinkMention[]; // Blogs with >5 mentions
	};

	// Summary stats
	stats: {
		totalIncoming: number;
		totalMentions: number;
		totalPotential: number;
		hasDuplicateWarnings: boolean;
	};
}

interface CrossLinkItem {
	id: number;
	person: string;
	title: string;
	enneagram: string | null;
	category: string | null;
}

interface CrossLinkMention extends CrossLinkItem {
	mentionCount: number; // How many times mentioned
	isInSuggestions: boolean; // Already linked?
}
```

**Implementation** (`src/routes/api/admin/content/[id]/crosslinks/+server.ts`):

```typescript
import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals }) => {
	const { id } = params;
	const supabase = locals.supabase;

	// 1. Get current blog to find person slug
	const { data: currentBlog, error: fetchError } = await supabase
		.from('blogs_famous_people')
		.select('person, title')
		.eq('id', id)
		.single();

	if (fetchError || !currentBlog) {
		throw error(404, 'Blog not found');
	}

	const personSlug = currentBlog.person;
	const displayName = personSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

	// 2. Query incoming suggestions
	const { data: incomingSuggestions } = await supabase
		.from('blogs_famous_people')
		.select('id, person, title, enneagram, category')
		.contains('suggestions', [personSlug])
		.neq('person', personSlug)
		.eq('published', true);

	// 3. Query content mentions (requires RPC for text search + count)
	const { data: contentMentions } = await supabase.rpc('get_content_mentions', {
		search_name: displayName,
		search_slug: personSlug,
		exclude_person: personSlug
	});

	// 4. Derive potential links (mentions not in suggestions)
	const potentialLinks = (contentMentions || []).filter((m) => !m.is_in_suggestions);

	// 5. Check for duplicates
	const excessiveMentions = (contentMentions || []).filter((m) => m.mention_count > 5);

	return json({
		person: personSlug,
		displayName,
		incomingSuggestions: incomingSuggestions || [],
		contentMentions: contentMentions || [],
		potentialLinks,
		duplicates: {
			inSuggestions: false, // TODO: Check suggestions array for duplicates
			excessiveMentions
		},
		stats: {
			totalIncoming: (incomingSuggestions || []).length,
			totalMentions: (contentMentions || []).length,
			totalPotential: potentialLinks.length,
			hasDuplicateWarnings: excessiveMentions.length > 0
		}
	});
};
```

### New RPC Function: `get_content_mentions`

**Purpose**: Efficiently search content for person mentions with occurrence counts

```sql
CREATE OR REPLACE FUNCTION get_content_mentions(
  search_name TEXT,
  search_slug TEXT,
  exclude_person TEXT
)
RETURNS TABLE (
  id BIGINT,
  person TEXT,
  title TEXT,
  enneagram TEXT,
  category TEXT,
  mention_count INTEGER,
  is_in_suggestions BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id,
    b.person,
    b.title,
    b.enneagram,
    b.category,
    -- Count mentions (case insensitive)
    (
      (LENGTH(b.content) - LENGTH(REPLACE(LOWER(b.content), LOWER(search_name), '')))
      / NULLIF(LENGTH(search_name), 0)
    )::INTEGER AS mention_count,
    -- Check if in suggestions
    COALESCE(b.suggestions::jsonb @> to_jsonb(ARRAY[search_slug]), false) AS is_in_suggestions
  FROM blogs_famous_people b
  WHERE (
      b.content ILIKE '%' || search_name || '%'
      OR b.content ILIKE '%' || search_slug || '%'
    )
    AND b.person != exclude_person
    AND b.published = true
  ORDER BY mention_count DESC, b.title;
END;
$$;
```

---

## UI Design

### Location: MetadataSidebar.svelte

Add new collapsible section below "Related Content" (suggestions):

```
┌─────────────────────────────────────────┐
│ ▼ Cross-Link Analysis            [🔄]  │  <- Collapsible header + refresh button
├─────────────────────────────────────────┤
│                                         │
│  📥 Incoming Links (3)                  │  <- Blogs linking TO this person
│  ├─ Taylor Swift                        │
│  ├─ Beyoncé                             │
│  └─ Lady Gaga                           │
│                                         │
│  💡 Potential Links (5)          ⚠️     │  <- Opportunities (mentions not linked)
│  ├─ Rihanna (mentioned 2x)              │     Warning if >0
│  ├─ Ariana Grande (mentioned 1x)        │
│  └─ +3 more...                          │
│                                         │
│  ⚠️ Duplicate Warnings                  │  <- Only shown if issues exist
│  └─ Justin Bieber: 8 mentions           │
│                                         │
└─────────────────────────────────────────┘
```

### Component Structure

```svelte
<!-- CrossLinkAnalysis.svelte -->
<script lang="ts">
	import { Accordion, AccordionItem, Badge, Spinner } from 'flowbite-svelte';

	let { personId }: { personId: number } = $props();

	let crosslinks = $state<CrossLinkResponse | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);

	async function fetchCrosslinks() {
		loading = true;
		error = null;
		try {
			const res = await fetch(`/api/admin/content/${personId}/crosslinks`);
			if (!res.ok) throw new Error('Failed to fetch');
			crosslinks = await res.json();
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	// Fetch on mount or when personId changes
	$effect(() => {
		if (personId) fetchCrosslinks();
	});
</script>

<div class="crosslink-analysis">
	<div class="section-header">
		<h4>Cross-Link Analysis</h4>
		<button onclick={fetchCrosslinks} disabled={loading}>
			{#if loading}<Spinner size="4" />{:else}🔄{/if}
		</button>
	</div>

	{#if error}
		<p class="error">{error}</p>
	{:else if crosslinks}
		<!-- Incoming Links -->
		<Accordion>
			<AccordionItem>
				<span slot="header">
					📥 Incoming Links
					<Badge>{crosslinks.stats.totalIncoming}</Badge>
				</span>
				<ul class="link-list">
					{#each crosslinks.incomingSuggestions as link}
						<li>
							<a href="/personality-analysis/{link.person}" target="_blank">
								{link.title || link.person}
							</a>
							{#if link.enneagram}
								<Badge color="dark">Type {link.enneagram}</Badge>
							{/if}
						</li>
					{/each}
					{#if crosslinks.incomingSuggestions.length === 0}
						<li class="empty">No incoming links found</li>
					{/if}
				</ul>
			</AccordionItem>

			<!-- Potential Links -->
			<AccordionItem>
				<span slot="header">
					💡 Potential Links
					<Badge color={crosslinks.stats.totalPotential > 0 ? 'yellow' : 'dark'}>
						{crosslinks.stats.totalPotential}
					</Badge>
				</span>
				<ul class="link-list">
					{#each crosslinks.potentialLinks as link}
						<li>
							<a href="/personality-analysis/{link.person}" target="_blank">
								{link.title || link.person}
							</a>
							<span class="mention-count">({link.mentionCount}x)</span>
						</li>
					{/each}
					{#if crosslinks.potentialLinks.length === 0}
						<li class="empty">All mentions are already linked!</li>
					{/if}
				</ul>
			</AccordionItem>

			<!-- Duplicate Warnings (conditional) -->
			{#if crosslinks.stats.hasDuplicateWarnings}
				<AccordionItem>
					<span slot="header">
						⚠️ Duplicate Warnings
						<Badge color="red">{crosslinks.duplicates.excessiveMentions.length}</Badge>
					</span>
					<ul class="link-list warning">
						{#each crosslinks.duplicates.excessiveMentions as mention}
							<li>
								{mention.title}: <strong>{mention.mentionCount} mentions</strong>
							</li>
						{/each}
					</ul>
				</AccordionItem>
			{/if}
		</Accordion>
	{:else}
		<p class="loading">Loading cross-link data...</p>
	{/if}
</div>
```

### Visual States

| State               | Display                           |
| ------------------- | --------------------------------- |
| Loading             | Spinner in section                |
| Empty (no links)    | "No incoming links found" message |
| Has potential links | Yellow badge count + list         |
| Has duplicates      | Red warning section visible       |
| Error               | Red error message + retry button  |

---

## Implementation Phases

### Phase 1: Database & API (Backend)

1. Create RPC function `get_content_mentions` in Supabase
2. Create `/api/admin/content/[id]/crosslinks/+server.ts` endpoint
3. Test queries with sample data

**Estimated Work**: Backend implementation

### Phase 2: Basic UI

1. Create `CrossLinkAnalysis.svelte` component
2. Add to `MetadataSidebar.svelte` below suggestions
3. Display incoming links and content mentions
4. Add loading/error states

**Estimated Work**: Frontend component

### Phase 3: Potential Links & Duplicates

1. Add potential links calculation
2. Add duplicate detection logic
3. Add warning badges and highlighting
4. Add click actions (navigate to blog, copy to clipboard)

**Estimated Work**: Enhanced logic

### Phase 4: Polish & Performance

1. Cache cross-link data (avoid re-fetching on every sidebar open)
2. Add batch analysis view (see all blogs with cross-link issues)
3. Add "Add to suggestions" quick action button
4. Add filtering by enneagram type or category

**Estimated Work**: Optimization

---

## Performance Considerations

### Query Optimization

1. **Content Search**: ILIKE queries on large text fields can be slow
   - Consider using `search_vector` full-text search instead
   - Add GIN index on content if needed: `CREATE INDEX idx_content_gin ON blogs_famous_people USING gin(to_tsvector('english', content))`

2. **Caching**: Cross-link data doesn't change frequently
   - Cache results for 5 minutes
   - Invalidate on content save

3. **Pagination**: If many results, limit to top 10 with "Show all" expansion

### Estimated Query Performance

| Query                | Expected Rows Scanned | Notes                              |
| -------------------- | --------------------- | ---------------------------------- |
| Incoming suggestions | All published (~300+) | Fast with GIN index on suggestions |
| Content mentions     | All published (~300+) | Slower - text search               |
| Combined             | 2 queries             | Consider combining into single RPC |

---

## Future Enhancements

### Cross-Link Analysis Dashboard

A dedicated `/admin/crosslinks` page showing:

- All blogs sorted by cross-link health score
- Blogs with 0 incoming links (orphaned)
- Blogs with many potential links (easy wins)
- Duplicate mention report

### Bidirectional Link Suggestions

When viewing a blog, show:

- "This blog mentions X but doesn't link to them"
- "X links to this blog, consider linking back"

### Category/Type-Based Analysis

- Show cross-links filtered by same enneagram type
- Show cross-links filtered by same category (athletes linking to athletes)

### Automated Link Building

- "Auto-add suggestions" button that adds all content mentions to suggestions
- Bulk operations for fixing link issues

---

## Testing Checklist

- [ ] API returns correct incoming suggestions
- [ ] API returns correct content mentions with counts
- [ ] Potential links correctly excludes already-linked blogs
- [ ] Duplicate detection flags >5 mentions
- [ ] UI displays all sections correctly
- [ ] Loading/error states work
- [ ] Refresh button re-fetches data
- [ ] Links open correct blog pages
- [ ] Performance acceptable with 300+ blogs

---

## Related Documentation

- [Content Board Enhancement Spec](./content-board-enhancement-spec.md) - Main content board design
- [Blog Cross-Link Index](../content-analysis/blog-crosslink-index.md) - Static cross-link report for MDsvex blogs

---

_Specification created: January 23, 2026_
