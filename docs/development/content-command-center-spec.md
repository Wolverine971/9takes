<!-- docs/development/content-command-center-spec.md -->

# Content Command Center Spec

High-level analytics and insights for the People content section in the admin content board.

## Overview

Transform the admin content board into a command center with actionable metrics for managing 9Takes' famous people blog content. These queries will help identify content gaps, optimization opportunities, and maintenance priorities.

---

## Requested Queries

### 1. Cross-Link Analysis (Most/Least Linked)

**Purpose**: Identify well-connected content vs. orphan content needing more internal links.

**Query Logic**:

```sql
-- Count incoming links (how many other blogs reference this person in suggestions)
SELECT
  bfp.id,
  bfp.person,
  bfp.title,
  bfp.enneagram,
  bfp.published,
  COALESCE(jsonb_array_length(bfp.suggestions::jsonb), 0) as outgoing_links,
  COUNT(other.id) as incoming_links,
  (COALESCE(jsonb_array_length(bfp.suggestions::jsonb), 0) + COUNT(other.id)) as total_connections
FROM blogs_famous_people bfp
LEFT JOIN blogs_famous_people other
  ON other.suggestions::jsonb ? bfp.person
WHERE bfp.published = true
GROUP BY bfp.id
ORDER BY total_connections DESC;
```

**Metrics Returned**:
| Field | Description |
|-------|-------------|
| `outgoing_links` | Number of people this blog links to (suggestions array length) |
| `incoming_links` | Number of blogs that link TO this person |
| `total_connections` | Sum of both (overall "connectedness") |

**UI**: Sortable table with columns for person, type, outgoing, incoming, total. Color-coded badges (red < 3, yellow 3-6, green > 6).

---

### 2. Content Length Analysis (Longest/Shortest)

**Purpose**: Find thin content needing expansion and identify benchmark articles.

**Query Logic**:

```sql
SELECT
  id,
  person,
  title,
  enneagram,
  published,
  LENGTH(content) as content_length_chars,
  LENGTH(content) - LENGTH(REPLACE(content, ' ', '')) + 1 as approx_word_count,
  (LENGTH(content) - LENGTH(REPLACE(content, E'\n', ''))) as paragraph_count
FROM blogs_famous_people
WHERE published = true
ORDER BY content_length_chars DESC;
```

**Metrics Returned**:
| Field | Description |
|-------|-------------|
| `content_length_chars` | Raw character count |
| `approx_word_count` | Estimated word count (spaces + 1) |
| `paragraph_count` | Newline count as paragraph proxy |

**Benchmarks** (for reference):

- Thin content: < 1,500 words
- Standard: 1,500 - 3,000 words
- Long-form: 3,000 - 5,000 words
- Comprehensive: > 5,000 words

**UI**: Sortable table with word count, visual bar showing relative length, flag for thin content.

---

### 3. Edit Recency Analysis (Fresh vs. Stale)

**Purpose**: Identify stale content needing updates and track editing velocity.

**Query Logic**:

```sql
SELECT
  id,
  person,
  title,
  enneagram,
  published,
  lastmod,
  date as created,
  NOW() - lastmod::timestamp as days_since_edit,
  NOW() - date::timestamp as content_age,
  CASE
    WHEN lastmod::timestamp > NOW() - INTERVAL '30 days' THEN 'fresh'
    WHEN lastmod::timestamp > NOW() - INTERVAL '90 days' THEN 'recent'
    WHEN lastmod::timestamp > NOW() - INTERVAL '180 days' THEN 'aging'
    ELSE 'stale'
  END as freshness_status
FROM blogs_famous_people
WHERE published = true
ORDER BY lastmod DESC;
```

**Freshness Categories**:
| Status | Criteria | Color |
|--------|----------|-------|
| Fresh | Edited < 30 days ago | Green |
| Recent | Edited 30-90 days ago | Blue |
| Aging | Edited 90-180 days ago | Yellow |
| Stale | Edited > 180 days ago | Red |

**UI**: Sortable table with last edit date, freshness badge, days since edit counter.

---

## Additional Suggested Queries

### 4. SEO Optimization Score

**Purpose**: Identify content with poor SEO metadata.

**Query Logic**:

```sql
SELECT
  id,
  person,
  title,
  enneagram,
  LENGTH(title) as title_length,
  LENGTH(description) as desc_length,
  LENGTH(meta_title) as meta_title_length,
  CASE WHEN pic IS NOT NULL AND pic != '' THEN true ELSE false END as has_image,
  CASE WHEN twitter IS NOT NULL OR instagram IS NOT NULL THEN true ELSE false END as has_social,
  CASE WHEN wikipedia IS NOT NULL AND wikipedia != '' THEN true ELSE false END as has_wikipedia,
  -- Score: 0-100
  (
    CASE WHEN LENGTH(title) BETWEEN 30 AND 60 THEN 15 ELSE 0 END +
    CASE WHEN LENGTH(description) BETWEEN 120 AND 160 THEN 20 ELSE 0 END +
    CASE WHEN LENGTH(meta_title) BETWEEN 30 AND 60 THEN 15 ELSE 0 END +
    CASE WHEN pic IS NOT NULL AND pic != '' THEN 20 ELSE 0 END +
    CASE WHEN (twitter IS NOT NULL OR instagram IS NOT NULL) THEN 15 ELSE 0 END +
    CASE WHEN wikipedia IS NOT NULL AND wikipedia != '' THEN 15 ELSE 0 END
  ) as seo_score
FROM blogs_famous_people
WHERE published = true
ORDER BY seo_score ASC;
```

**Metrics**:

- Title length (optimal: 30-60 chars)
- Description length (optimal: 120-160 chars)
- Has featured image
- Has social links
- Has Wikipedia reference

---

### 5. Enneagram Type Distribution

**Purpose**: Balance content across all 9 types.

**Query Logic**:

```sql
SELECT
  enneagram,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE published = true) as published_count,
  COUNT(*) FILTER (WHERE published = false) as draft_count,
  ROUND(AVG(LENGTH(content))) as avg_content_length,
  ROUND(AVG(COALESCE(jsonb_array_length(suggestions::jsonb), 0))) as avg_suggestions
FROM blogs_famous_people
GROUP BY enneagram
ORDER BY enneagram::int;
```

**UI**: 9-panel grid showing count per type, with drill-down to see all people for that type.

---

### 6. Category Distribution

**Purpose**: Balance content across categories (musician, actor, athlete, etc.).

**Query Logic**:

```sql
SELECT
  category,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE published = true) as published_count,
  array_agg(DISTINCT enneagram ORDER BY enneagram) as types_covered,
  9 - COUNT(DISTINCT enneagram) as types_missing
FROM blogs_famous_people
GROUP BY category
ORDER BY total_count DESC;
```

**Insight**: Shows which categories need more coverage and which Enneagram types are missing per category.

---

### 7. Orphan Content Detector

**Purpose**: Find content that is completely isolated (no incoming or outgoing links).

**Query Logic**:

```sql
SELECT
  bfp.id,
  bfp.person,
  bfp.title,
  bfp.enneagram,
  bfp.lastmod
FROM blogs_famous_people bfp
WHERE bfp.published = true
  AND (bfp.suggestions IS NULL OR jsonb_array_length(bfp.suggestions::jsonb) = 0)
  AND NOT EXISTS (
    SELECT 1 FROM blogs_famous_people other
    WHERE other.suggestions::jsonb ? bfp.person
  );
```

**Action**: These need immediate attention for internal linking.

---

### 8. Suggestions Quality Audit

**Purpose**: Find broken or invalid cross-links.

**Query Logic**:

```sql
WITH suggestions_expanded AS (
  SELECT
    bfp.id,
    bfp.person,
    bfp.title,
    jsonb_array_elements_text(bfp.suggestions::jsonb) as suggested_person
  FROM blogs_famous_people bfp
  WHERE bfp.suggestions IS NOT NULL
)
SELECT
  se.id,
  se.person,
  se.title,
  se.suggested_person,
  CASE WHEN target.id IS NULL THEN 'BROKEN' ELSE 'VALID' END as link_status
FROM suggestions_expanded se
LEFT JOIN blogs_famous_people target ON target.person = se.suggested_person
WHERE target.id IS NULL OR target.published = false
ORDER BY se.person;
```

**Finds**:

- Links to non-existent people (typos, deleted content)
- Links to unpublished drafts

---

### 9. Publishing Pipeline Status

**Purpose**: Overview of content moving through workflow stages.

**Query Logic**:

```sql
SELECT
  cp."stageName",
  COUNT(*) as count,
  array_agg(bfp.person ORDER BY bfp.lastmod DESC) as people
FROM content_people cp
JOIN blogs_famous_people bfp ON bfp.loc = cp.loc
GROUP BY cp."stageName"
ORDER BY cp."stageName";
```

**UI**: Funnel visualization showing content at each stage.

---

### 10. Content Velocity Metrics

**Purpose**: Track editing activity over time.

**Query Logic**:

```sql
-- Edits per week/month
SELECT
  DATE_TRUNC('week', lastmod::timestamp) as week,
  COUNT(*) as edits
FROM blogs_famous_people
WHERE lastmod::timestamp > NOW() - INTERVAL '3 months'
GROUP BY week
ORDER BY week DESC;

-- Most edited content (from history)
SELECT
  bfp.person,
  bfp.title,
  COUNT(h.id) as edit_count
FROM blogs_famous_people bfp
JOIN blogs_famous_people_history h ON h.famous_people_id = bfp.id
GROUP BY bfp.id
ORDER BY edit_count DESC
LIMIT 20;
```

---

### 11. Social Media Coverage

**Purpose**: Track which content has social profiles linked.

**Query Logic**:

```sql
SELECT
  id,
  person,
  title,
  enneagram,
  CASE WHEN twitter IS NOT NULL AND twitter != '' THEN true ELSE false END as has_twitter,
  CASE WHEN instagram IS NOT NULL AND instagram != '' THEN true ELSE false END as has_instagram,
  CASE WHEN tiktok IS NOT NULL AND tiktok != '' THEN true ELSE false END as has_tiktok,
  CASE WHEN wikipedia IS NOT NULL AND wikipedia != '' THEN true ELSE false END as has_wikipedia,
  (
    (CASE WHEN twitter IS NOT NULL AND twitter != '' THEN 1 ELSE 0 END) +
    (CASE WHEN instagram IS NOT NULL AND instagram != '' THEN 1 ELSE 0 END) +
    (CASE WHEN tiktok IS NOT NULL AND tiktok != '' THEN 1 ELSE 0 END) +
    (CASE WHEN wikipedia IS NOT NULL AND wikipedia != '' THEN 1 ELSE 0 END)
  ) as social_completeness
FROM blogs_famous_people
WHERE published = true
ORDER BY social_completeness ASC;
```

---

### 12. Content Health Dashboard

**Purpose**: Single score combining multiple factors.

**Composite Score Formula**:

```
health_score = (
  (cross_links_score * 0.20) +      -- 20% weight
  (content_length_score * 0.25) +    -- 25% weight
  (freshness_score * 0.20) +         -- 20% weight
  (seo_score * 0.20) +               -- 20% weight
  (social_score * 0.15)              -- 15% weight
)
```

**Query**: Combines all above metrics into a single 0-100 health score per blog.

---

## Implementation Plan

### Phase 1: Backend (RPC Functions)

Create Supabase RPC functions for efficient server-side aggregation:

```
rpc_content_crosslinks_summary()     -- Query 1
rpc_content_length_analysis()        -- Query 2
rpc_content_freshness_analysis()     -- Query 3
rpc_content_seo_audit()              -- Query 4
rpc_content_type_distribution()      -- Queries 5-6
rpc_content_health_scores()          -- Query 12
```

### Phase 2: API Endpoints

```
GET /api/admin/content/analytics/crosslinks
GET /api/admin/content/analytics/length
GET /api/admin/content/analytics/freshness
GET /api/admin/content/analytics/seo
GET /api/admin/content/analytics/distribution
GET /api/admin/content/analytics/health
GET /api/admin/content/analytics/summary  -- All metrics in one call
```

### Phase 3: UI Components

New component: `ContentAnalyticsDashboard.svelte`

**Layout**:

```
┌─────────────────────────────────────────────────────────┐
│  CONTENT COMMAND CENTER                    [Refresh]    │
├─────────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ Total   │ │ Fresh   │ │ Orphans │ │ Avg     │       │
│  │  127    │ │  45     │ │  12     │ │ Health  │       │
│  │ blogs   │ │ (35%)   │ │ (9%)    │ │  72/100 │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
├─────────────────────────────────────────────────────────┤
│  [Cross-Links] [Length] [Freshness] [SEO] [Distribution]│
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────┐  │
│  │  Sortable Data Table for Selected View            │  │
│  │  - Column headers clickable for sort              │  │
│  │  - Row click opens editor modal                   │  │
│  │  - Color-coded status badges                      │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Phase 4: Integration

- Add "Analytics" tab to content board when in People mode
- Wire up click-to-edit functionality
- Add export to CSV option
- Add "needs attention" priority queue

---

## File Structure

```
src/routes/admin/content-board/
├── +page.svelte                    # Add analytics tab
├── +page.server.ts                 # Load analytics data
├── ContentAnalyticsDashboard.svelte  # NEW: Main dashboard
├── AnalyticsCard.svelte            # NEW: Summary stat cards
├── AnalyticsTable.svelte           # NEW: Sortable data table
└── analytics/
    ├── CrossLinkAnalysis.svelte    # Detailed cross-link view
    ├── ContentLengthView.svelte    # Length analysis view
    ├── FreshnessView.svelte        # Edit recency view
    ├── SEOAuditView.svelte         # SEO score breakdown
    └── DistributionView.svelte     # Type/category charts

src/routes/api/admin/content/analytics/
├── +server.ts                      # Summary endpoint
├── crosslinks/+server.ts
├── length/+server.ts
├── freshness/+server.ts
├── seo/+server.ts
└── distribution/+server.ts
```

---

## Priority Order

1. **Cross-Links** (most actionable - directly improves SEO)
2. **Content Length** (identifies thin content quickly)
3. **Freshness** (maintenance priority)
4. **Health Score** (quick triage tool)
5. **Distribution** (strategic planning)
6. **SEO Audit** (optimization refinement)
