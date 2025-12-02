-- supabase/migrations/20250916_add_performance_indexes_priority1.sql
-- Created: 2025-09-16
-- Purpose: Add critical indexes for core functionality performance

-- Comments table - Most critical for performance
-- Used heavily in question detail pages and comment loading
CREATE INDEX IF NOT EXISTS idx_comments_parent_removed_created 
ON comments (parent_id, parent_type, removed, created_at DESC);

-- Questions table - Main content queries  
-- Critical for main questions page performance
CREATE INDEX IF NOT EXISTS idx_questions_removed_created 
ON questions (removed, created_at DESC) WHERE removed = false;

-- Additional questions indexes for URL-based lookups
CREATE INDEX IF NOT EXISTS idx_questions_url 
ON questions (url) WHERE url IS NOT NULL;

-- Author-based queries for questions (user profile pages)
CREATE INDEX IF NOT EXISTS idx_questions_author_removed_created 
ON questions (author_id, removed, created_at DESC) WHERE removed = false;

-- Author-based queries for comments (user activity)
CREATE INDEX IF NOT EXISTS idx_comments_author_created 
ON comments (author_id, created_at DESC);