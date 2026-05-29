-- supabase/migrations/20260529_release_demand_metrics_rpc.sql
-- Created: 2026-05-29
--
-- Performance redesign for /admin/analytics release performance.
--
-- Before: the /api/admin/analytics/releases endpoint fetched EVERY raw page_analytics_visits row for
-- ALL ~350 people slugs across the full date range on every load (chunks of 75 slugs × up to 25k rows),
-- then computed the demand/engagement scoring in JS. That raw-visit fetch was the dominant cost.
--
-- After: this RPC computes the per-release window aggregates the scorer needs — including exact
-- COUNT(DISTINCT fingerprint) per source bucket — set-based in SQL using the existing
-- idx_page_visits_content_slug_started_at index. The endpoint reads ~3 small rows per release instead
-- of every raw visit. Numbers are EXACT (same window-distinct dedup the JS Set did), not approximated:
-- only the source-bucket classification is mirrored from releasePerformanceScoring.ts:sourceBucket().
--
-- Returns one row per (release, window_days) for window_days in (1, 7, 30). The JS layer
-- (computeReleasePerformanceScoreFieldsFromWindows) builds WindowMetrics from these rows and runs the
-- unchanged percentile/score/band logic.

CREATE OR REPLACE FUNCTION public.get_content_release_demand_metrics()
RETURNS TABLE(
	slug TEXT,
	published_at TIMESTAMPTZ,
	window_days INTEGER,
	views BIGINT,
	unique_visitors BIGINT,
	internal_views BIGINT,
	external_views BIGINT,
	external_unique BIGINT,
	search_unique BIGINT,
	direct_unique BIGINT,
	engaged_external_unique BIGINT,
	engaged_external_visits BIGINT,
	engaged_ms_sum BIGINT,
	scroll_sum BIGINT,
	source_counts JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
	IF COALESCE(auth.role(), '') <> 'service_role'
		AND NOT EXISTS (
			SELECT 1
			FROM public.profiles
			WHERE profiles.id = auth.uid()
				AND profiles.admin IS TRUE
		)
	THEN
		RAISE EXCEPTION 'admin access required';
	END IF;

	RETURN QUERY
	WITH releases AS (
		SELECT
			b.id::BIGINT AS id,
			public.analytics_normalize_content_slug(b.person) AS slug,
			public.analytics_effective_people_published_at(
				b.first_published_at,
				b.published_at,
				b.date::TEXT,
				b.created_at
			) AS published_at
		FROM public.blogs_famous_people b
		WHERE b.published IS TRUE
			AND COALESCE(NULLIF(BTRIM(b.person), ''), '') <> ''
	),
	-- One row per qualifying visit, with the scoring bucket mirrored from JS sourceBucket().
	bucketed AS (
		SELECT
			r.id,
			r.slug,
			r.published_at,
			COALESCE(NULLIF(BTRIM(v.fingerprint), ''), 'v' || v.id::TEXT) AS fingerprint,
			COALESCE(v.engaged_ms, 0) AS engaged_ms,
			LEAST(GREATEST(COALESCE(v.max_scroll_pct, 0), 0), 100) AS scroll_pct,
			v.started_at,
			CASE
				WHEN COALESCE(LOWER(v.acquisition_source), '') = 'internal'
					OR LOWER(COALESCE(v.referrer_host, '')) LIKE '%9takes.com%'
					OR LOWER(COALESCE(v.referrer_host, '')) IN ('localhost', '127.0.0.1')
					THEN 'internal'
				WHEN LOWER(COALESCE(v.acquisition_source, '')) LIKE 'search/%' THEN 'search'
				WHEN LOWER(COALESCE(v.acquisition_source, '')) LIKE 'ai/%' THEN 'ai'
				WHEN LOWER(COALESCE(v.acquisition_source, '')) LIKE 'social/%' THEN 'social'
				WHEN LOWER(COALESCE(v.acquisition_source, '')) LIKE 'email%' THEN 'email'
				WHEN LOWER(COALESCE(v.acquisition_source, '')) = 'direct'
					OR LOWER(COALESCE(v.referrer_host, '')) = 'direct'
					OR (
						COALESCE(NULLIF(BTRIM(v.acquisition_source), ''), '') = ''
						AND COALESCE(NULLIF(BTRIM(v.referrer_host), ''), '') = ''
					)
					THEN 'direct'
				WHEN LOWER(COALESCE(v.acquisition_source, '')) NOT IN ('', 'unknown', 'other')
					THEN LOWER(v.acquisition_source)
				WHEN LOWER(COALESCE(v.referrer_host, '')) ~ '(chatgpt|openai|perplexity|claude\.ai|anthropic|gemini\.google|bard\.google|copilot\.microsoft|grok\.|x\.ai|poe\.com|you\.com|phind\.com|meta\.ai|mistral\.ai)'
					THEN 'ai'
				WHEN LOWER(COALESCE(v.referrer_host, '')) ~ '(google\.|bing\.|duckduckgo\.|ecosia\.|yahoo\.|yandex\.|brave\.|googlequicksearch)'
					THEN 'search'
				ELSE COALESCE(NULLIF(LOWER(v.acquisition_source), ''), 'other')
			END AS bucket
		FROM releases r
		INNER JOIN public.page_analytics_visits v
			ON v.content_type = 'people'
			AND v.content_slug IS NOT NULL
			AND public.analytics_normalize_content_slug(v.content_slug) = r.slug
			AND v.started_at >= r.published_at
			AND v.started_at < r.published_at + INTERVAL '30 days'
			AND NOT public.is_analytics_utility_path(v.path)
		WHERE r.published_at IS NOT NULL
	),
	flagged AS (
		SELECT
			b.*,
			(b.bucket <> 'internal') AS is_external,
			(b.bucket IN ('search', 'ai')) AS is_search,
			(b.bucket IN ('direct', 'other', 'unknown')) AS is_direct,
			(b.engaged_ms >= 10000 OR b.scroll_pct >= 35) AS is_engaged
		FROM bucketed b
	),
	windows(days) AS (
		SELECT unnest(ARRAY[1, 7, 30])
	),
	-- Numeric window aggregates. The window upper bound is applied in each FILTER, so a single scan of
	-- `flagged` (× 3 windows) produces all three cumulative windows.
	agg AS (
		SELECT
			f.id,
			f.slug,
			MIN(f.published_at) AS published_at,
			w.days AS window_days,
			COUNT(*) FILTER (WHERE f.started_at < f.published_at + (w.days * INTERVAL '1 day'))::BIGINT
				AS views,
			COUNT(DISTINCT f.fingerprint) FILTER (
				WHERE f.started_at < f.published_at + (w.days * INTERVAL '1 day')
			)::BIGINT AS unique_visitors,
			COUNT(*) FILTER (
				WHERE f.started_at < f.published_at + (w.days * INTERVAL '1 day') AND NOT f.is_external
			)::BIGINT AS internal_views,
			COUNT(*) FILTER (
				WHERE f.started_at < f.published_at + (w.days * INTERVAL '1 day') AND f.is_external
			)::BIGINT AS external_views,
			COUNT(DISTINCT f.fingerprint) FILTER (
				WHERE f.started_at < f.published_at + (w.days * INTERVAL '1 day') AND f.is_external
			)::BIGINT AS external_unique,
			COUNT(DISTINCT f.fingerprint) FILTER (
				WHERE f.started_at < f.published_at + (w.days * INTERVAL '1 day')
					AND f.is_external AND f.is_search
			)::BIGINT AS search_unique,
			COUNT(DISTINCT f.fingerprint) FILTER (
				WHERE f.started_at < f.published_at + (w.days * INTERVAL '1 day')
					AND f.is_external AND f.is_direct
			)::BIGINT AS direct_unique,
			COUNT(DISTINCT f.fingerprint) FILTER (
				WHERE f.started_at < f.published_at + (w.days * INTERVAL '1 day')
					AND f.is_external AND f.is_engaged
			)::BIGINT AS engaged_external_unique,
			COUNT(*) FILTER (
				WHERE f.started_at < f.published_at + (w.days * INTERVAL '1 day')
					AND f.is_external AND f.is_engaged
			)::BIGINT AS engaged_external_visits,
			COALESCE(SUM(f.engaged_ms) FILTER (
				WHERE f.started_at < f.published_at + (w.days * INTERVAL '1 day')
			), 0)::BIGINT AS engaged_ms_sum,
			COALESCE(SUM(f.scroll_pct) FILTER (
				WHERE f.started_at < f.published_at + (w.days * INTERVAL '1 day')
			), 0)::BIGINT AS scroll_sum
		FROM flagged f
		CROSS JOIN windows w
		GROUP BY f.id, f.slug, w.days
	),
	-- Per-bucket visit counts per window, for the top_demand_sources display.
	src AS (
		SELECT
			f.id,
			w.days AS window_days,
			f.bucket,
			COUNT(*)::BIGINT AS c
		FROM flagged f
		CROSS JOIN windows w
		WHERE f.started_at < f.published_at + (w.days * INTERVAL '1 day')
		GROUP BY f.id, w.days, f.bucket
	),
	src_json AS (
		SELECT
			s.id,
			s.window_days,
			jsonb_object_agg(s.bucket, s.c) AS source_counts
		FROM src s
		GROUP BY s.id, s.window_days
	)
	SELECT
		a.slug,
		a.published_at,
		a.window_days::INTEGER,
		a.views,
		a.unique_visitors,
		a.internal_views,
		a.external_views,
		a.external_unique,
		a.search_unique,
		a.direct_unique,
		a.engaged_external_unique,
		a.engaged_external_visits,
		a.engaged_ms_sum,
		a.scroll_sum,
		COALESCE(sj.source_counts, '{}'::JSONB) AS source_counts
	FROM agg a
	LEFT JOIN src_json sj ON sj.id = a.id AND sj.window_days = a.window_days
	WHERE a.views > 0
	ORDER BY a.slug, a.window_days;
END;
$$;

REVOKE ALL ON FUNCTION public.get_content_release_demand_metrics() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_content_release_demand_metrics()
	TO authenticated, service_role;
