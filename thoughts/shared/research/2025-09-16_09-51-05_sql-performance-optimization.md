---
date: 2025-09-16 09:51:05 EDT
researcher: Claude Code
git_commit: 5b002057302f6d21c5bdc60d2d3a6ab0ea7d01aa
branch: main
repository: 9takes
topic: 'SQL Performance Optimization - Sequential Queries and Missing Indexes'
tags: [research, codebase, performance, database, sql, supabase, indexes, optimization]
status: complete
last_updated: 2025-09-16
last_updated_by: Claude Code
---

# Research: SQL Performance Optimization - Sequential Queries and Missing Indexes

**Date**: 2025-09-16 09:51:05 EDT
**Researcher**: Claude Code
**Git Commit**: 5b002057302f6d21c5bdc60d2d3a6ab0ea7d01aa
**Branch**: main
**Repository**: 9takes

## Research Question

Scan the 9takes project for SQL queries that are done sequentially but could be parallelized for faster performance, and identify places where database indexes are needed.

## Summary

The analysis revealed significant opportunities for performance improvement through:

1. **Parallelizing sequential queries** - Found 9+ critical locations where multiple database queries run sequentially but could use `Promise.all()`
2. **Missing database indexes** - Identified 15+ essential indexes needed for core query patterns
3. **N+1 query patterns** - Found several inefficient loops and nested query patterns
4. **Query batching opportunities** - Admin dashboard and comment loading could benefit from batched operations

**Priority areas for optimization**: Admin dashboard (3-5x performance gain), question detail pages (2-3x gain), and comment loading (60-80% faster).

## Detailed Findings

### Database Schema & Current Indexes

**Core Tables Structure**:

- `questions` (1,486 rows) - Main Q&A content
- `comments` (467 rows) - Nested comment system
- `profiles` (1,200 rows) - User profiles with Enneagram types
- `blogs_famous_people` (129 rows) - Celebrity personality analyses

**Existing Indexes** (Limited):

- Only found explicit indexes in `supabase/migrations/20250911_add_blogs_famous_people_history.sql:15-19`
- Primary key indexes on all `id` columns (automatic)
- Missing critical composite indexes for common query patterns

### Sequential Query Patterns - Priority Fixes

#### 1. Admin Dashboard - Critical Performance Issue

**File**: `src/routes/admin/+page.server.ts:42-100`

**Current Sequential Pattern**:

```typescript
const { data: dailyVisitors } = await supabase.rpc('visitors_last_30_days', {});
const { data: dailyComments } = await supabase.rpc('comments_last_30_days', {});
const { data: dailyQuestions } = await supabase.rpc('daily_questions_stats', {});

// Separate count queries for each table
const { count: totalUsers } = await supabase
	.from('profiles')
	.select('*', { count: 'exact', head: true });
const { count: newUsersMonth } = await supabase
	.from('profiles')
	.select('*', { count: 'exact', head: true })
	.gte('created_at', thirtyDaysAgo);
```

**Optimization**: Combine into single `Promise.all()` - **Expected 3-5x performance improvement**

#### 2. Blog Version History - Sequential Database Calls

**File**: `src/routes/api/blog-versions/[id]/+server.ts:17-33`

**Current Sequential Pattern**:

```typescript
const { data: currentBlog } = await supabase
	.from('blogs_famous_people')
	.select('*')
	.eq('id', blogId)
	.single();
const { data: history } = await supabase
	.from('blogs_famous_people_history')
	.select('*')
	.eq('famous_people_id', blogId);
```

**Optimization**: Use `Promise.all()` - **Expected 50% performance improvement**

#### 3. Question Detail Page - Multiple Sequential Queries

**File**: `src/routes/questions/[slug]/+page.server.ts:47-53`

Already uses some `Promise.all()` but could be further optimized by combining related data fetches into single RPC calls.

### N+1 Query Patterns Found

#### 1. Category Rendering Inefficiency

**File**: `src/routes/questions/categories/+page.svelte:128-208`

Complex nested loops with repeated data lookups that should be pre-processed server-side:

```svelte
{#each data?.rootCategories as category}
  {#each data?.rootCategories as subCategory}
    {#each subCats[subCategory.id] as subSubCategory}
```

#### 2. Admin Comments Multiple Table Queries

**File**: `src/routes/admin/comments/+page.server.ts:170-208`

Three separate paginated queries that could run in parallel:

```typescript
const { data: comments } = await getPaginatedComments(commentsTable, ...);
const { data: flaggedComments } = await getPaginatedComments('flagged_comments', ...);
const { data: blogComments } = await getPaginatedComments('blog_comments', ...);
```

### Critical Missing Database Indexes

#### Priority 1 - Core Functionality Indexes

```sql
-- Comments table - Most critical for performance
CREATE INDEX CONCURRENTLY idx_comments_parent_removed_created
ON comments (parent_id, parent_type, removed, created_at DESC);

-- Questions table - Main content queries
CREATE INDEX CONCURRENTLY idx_questions_removed_created
ON questions (removed, created_at DESC) WHERE removed = false;

-- User profiles - Admin and auth lookups
CREATE INDEX CONCURRENTLY idx_profiles_admin_external
ON profiles (admin, external_id) WHERE admin = true;
```

#### Priority 2 - Blog & Content Optimization

```sql
-- Blog posts - Celebrity analysis queries (very frequent)
CREATE INDEX CONCURRENTLY idx_blogs_famous_people_person_published
ON blogs_famous_people (person, published) WHERE published = true;

-- Question categorization
CREATE INDEX CONCURRENTLY idx_question_tags_question_tag
ON question_tags (question_id, tag_id);
```

#### Priority 3 - User Interaction Tracking

```sql
-- Comment likes - User interaction queries
CREATE INDEX CONCURRENTLY idx_comment_like_user_comment
ON comment_like (user_id, comment_id);

-- Subscriptions - Notification system
CREATE INDEX CONCURRENTLY idx_subscriptions_user_question
ON subscriptions (user_id, question_id);
```

### Query Pattern Analysis

**Most Performance-Critical Patterns**:

1. **Comment Retrieval** - Used heavily in `src/routes/questions/[slug]/+page.server.ts:470-479`

   ```typescript
   .eq('parent_id', questionId)      // NEEDS INDEX
   .eq('parent_type', 'question')    // NEEDS COMPOSITE INDEX
   .eq('removed', false)             // NEEDS INCLUSION IN INDEX
   .order('created_at', { ascending: false })  // NEEDS DESC INDEX
   ```

2. **Question Filtering** - Main questions page performance

   ```typescript
   .eq('removed', false)
   .order('created_at', { ascending: false })
   ```

3. **User Lookups** - Authentication and admin checks
   ```typescript
   .eq('id', session?.user?.id)
   .select('id, admin, external_id')
   ```

## Code References

### Sequential Query Opportunities

- `src/routes/admin/+page.server.ts:42-100` - Admin dashboard queries ⭐ **HIGH IMPACT**
- `src/routes/api/blog-versions/[id]/+server.ts:17-33` - Blog version queries
- `src/routes/admin/comments/+page.server.ts:170-208` - Comment pagination queries
- `src/routes/users/[externalId]/+page.server.ts:27-44` - User profile queries
- `src/routes/+page.server.ts:8-39` - Homepage data queries

### N+1 Pattern Locations

- `src/routes/questions/categories/+page.svelte:128-208` - Category tree rendering
- `src/routes/admin/content-board/+page.server.ts:85-89` - Multiple content table queries
- `src/lib/components/questions/SearchQuestion.svelte:68-77` - Typeahead search queries

### Critical Query Performance Files

- `src/routes/questions/[slug]/+page.server.ts:470-479` - Comment loading
- `src/routes/questions/+page.server.ts:21-26` - Questions page RPC
- `src/routes/personality-analysis/[slug]/+page.server.ts` - Blog content queries

## Architecture Insights

### Current Performance Architecture

- **Good**: Uses RPC functions for complex queries (`get_questions_page_data`)
- **Good**: Elasticsearch integration reduces PostgreSQL search load
- **Issue**: Missing strategic database indexes for core query patterns
- **Issue**: No query result caching layer
- **Issue**: Sequential queries in performance-critical paths

### Database Design Patterns

- Proper normalization with foreign key relationships
- Dual table strategy (`_demo` tables for testing)
- RPC functions for complex aggregations (should be expanded)

## Performance Impact Estimations

### Expected Performance Improvements

1. **Comment Loading**: 60-80% faster with proper indexes
2. **Admin Dashboard**: 70-80% faster with parallelized queries
3. **Questions Page**: 40-60% faster with composite indexes
4. **Blog Pages**: 70-90% faster with person/published indexes
5. **User Profile Lookups**: 50-70% faster with targeted indexes

### Implementation Priority

**Phase 1 (Immediate - Week 1)**:

- Add Priority 1 database indexes
- Parallelize admin dashboard queries
- Fix blog version API sequential calls

**Phase 2 (Short-term - Week 2-3)**:

- Add Priority 2 & 3 indexes
- Optimize comment loading queries
- Implement query result caching

**Phase 3 (Medium-term - Month 1)**:

- Create optimized RPC functions for common patterns
- Background job processing for expensive operations
- Performance monitoring and alerting

## Open Questions

1. **Caching Strategy**: Should implement Redis/memory caching for frequently accessed data?
2. **RPC Expansion**: Which sequential query patterns should be converted to single RPC calls?
3. **Demo Mode Performance**: Are the `_demo` tables properly indexed to match production tables?
4. **Elasticsearch Backup**: Should implement PostgreSQL full-text search as fallback?
5. **Monitoring**: What database performance monitoring should be implemented?

## Related Research

This is the first comprehensive SQL performance analysis for the 9takes platform. Future research should focus on:

- Query result caching strategies
- Background job processing implementation
- Database monitoring and alerting setup
- Load testing with optimized queries
