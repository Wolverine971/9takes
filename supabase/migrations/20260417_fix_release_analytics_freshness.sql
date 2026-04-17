-- supabase/migrations/20260417_fix_release_analytics_freshness.sql
-- Fix release metadata created by the publish script when an unpublished draft row
-- used created_at as first_published_at before the actual publish.

UPDATE public.blogs_famous_people
SET first_published_at = published_at
WHERE published IS TRUE
	AND published_at IS NOT NULL
	AND first_published_at IS NOT NULL
	AND created_at IS NOT NULL
	AND first_published_at = created_at
	AND published_at > first_published_at;
