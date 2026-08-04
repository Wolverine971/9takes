-- supabase/migrations/20260804_optimize_release_analytics_slug_lookup.sql
--
-- Release analytics joins normalize page_analytics_visits.content_slug before matching it to the
-- canonical people slug. The existing LOWER(content_slug) index cannot serve that exact expression,
-- so PostgreSQL falls back to repeatedly scanning and sorting the raw visit table. Index the actual
-- immutable normalization expression used by the release-performance, demand, growth, and event RPCs.

CREATE INDEX IF NOT EXISTS idx_page_visits_normalized_content_slug_started_at
	ON public.page_analytics_visits (
		content_type,
		public.analytics_normalize_content_slug(content_slug),
		started_at DESC
	)
	WHERE content_slug IS NOT NULL;
