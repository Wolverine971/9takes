-- supabase/migrations/20260223_admin_analytics_top_pages.sql
-- Created: 2026-02-23
-- Adds top-pages time series + duration ranking RPCs for admin analytics dashboards

CREATE OR REPLACE FUNCTION public.get_page_analytics_top_pages_timeseries(
	p_from_date DATE DEFAULT NULL,
	p_to_date DATE DEFAULT NULL,
	p_scope TEXT DEFAULT 'all',
	p_top_n INTEGER DEFAULT 5
)
RETURNS TABLE(
	day DATE,
	path TEXT,
	path_group TEXT,
	visits BIGINT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
	WITH bounds AS (
		SELECT
			COALESCE(p_from_date::TIMESTAMPTZ, NOW() - INTERVAL '30 days') AS from_ts,
			COALESCE((p_to_date::TIMESTAMPTZ + INTERVAL '1 day'), NOW() + INTERVAL '1 day') AS to_ts
	),
	filtered AS (
		SELECT v.*
		FROM public.page_analytics_visits v
		CROSS JOIN bounds b
		WHERE v.started_at >= b.from_ts
			AND v.started_at < b.to_ts
			AND NOT public.is_analytics_utility_path(v.path)
			AND public.analytics_scope_match(p_scope, v.path, v.content_type)
	),
	top_pages AS (
		SELECT
			f.path,
			COALESCE(MAX(f.path_group), '/') AS path_group,
			COUNT(*)::BIGINT AS total_visits
		FROM filtered f
		GROUP BY f.path
		ORDER BY total_visits DESC, f.path ASC
		LIMIT LEAST(GREATEST(COALESCE(p_top_n, 5), 1), 20)
	),
	series AS (
		SELECT
			DATE_TRUNC('day', f.started_at)::DATE AS day,
			f.path,
			COUNT(*)::BIGINT AS visits
		FROM filtered f
		INNER JOIN top_pages t ON t.path = f.path
		GROUP BY 1, 2
	)
	SELECT
		s.day,
		s.path,
		t.path_group,
		s.visits
	FROM series s
	INNER JOIN top_pages t ON t.path = s.path
	ORDER BY s.day ASC, s.visits DESC, s.path ASC;
$$;

CREATE OR REPLACE FUNCTION public.get_page_analytics_pages_by_duration(
	p_from_date DATE DEFAULT NULL,
	p_to_date DATE DEFAULT NULL,
	p_scope TEXT DEFAULT 'all',
	p_min_visits INTEGER DEFAULT 3,
	p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
	path TEXT,
	path_group TEXT,
	content_type TEXT,
	visits BIGINT,
	unique_visitors BIGINT,
	authenticated_visits BIGINT,
	anonymous_visits BIGINT,
	avg_time_on_page_ms INTEGER,
	median_time_on_page_ms INTEGER,
	bounce_rate NUMERIC
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
	WITH bounds AS (
		SELECT
			COALESCE(p_from_date::TIMESTAMPTZ, NOW() - INTERVAL '30 days') AS from_ts,
			COALESCE((p_to_date::TIMESTAMPTZ + INTERVAL '1 day'), NOW() + INTERVAL '1 day') AS to_ts
	),
	filtered AS (
		SELECT v.*
		FROM public.page_analytics_visits v
		CROSS JOIN bounds b
		WHERE v.started_at >= b.from_ts
			AND v.started_at < b.to_ts
			AND NOT public.is_analytics_utility_path(v.path)
			AND public.analytics_scope_match(p_scope, v.path, v.content_type)
	),
	grouped AS (
		SELECT
			v.path,
			v.path_group,
			COALESCE(MAX(v.content_type), 'other') AS content_type,
			COUNT(*)::BIGINT AS visits,
			COUNT(DISTINCT v.fingerprint)::BIGINT AS unique_visitors,
			COUNT(*) FILTER (WHERE v.user_id IS NOT NULL)::BIGINT AS authenticated_visits,
			COUNT(*) FILTER (WHERE v.user_id IS NULL)::BIGINT AS anonymous_visits,
			COALESCE(ROUND(AVG(v.engaged_ms))::INT, 0) AS avg_time_on_page_ms,
			COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY v.engaged_ms)::INT, 0) AS median_time_on_page_ms,
			CASE
				WHEN COUNT(*) > 0
				THEN ROUND((COUNT(*) FILTER (WHERE v.engaged_ms < 10000))::NUMERIC / COUNT(*)::NUMERIC * 100, 2)
				ELSE 0
			END AS bounce_rate
		FROM filtered v
		GROUP BY v.path, v.path_group
	)
	SELECT
		g.path,
		g.path_group,
		g.content_type,
		g.visits,
		g.unique_visitors,
		g.authenticated_visits,
		g.anonymous_visits,
		g.avg_time_on_page_ms,
		g.median_time_on_page_ms,
		g.bounce_rate
	FROM grouped g
	WHERE g.visits >= GREATEST(COALESCE(p_min_visits, 0), 0)
	ORDER BY g.avg_time_on_page_ms DESC, g.visits DESC, g.path ASC
	LIMIT LEAST(GREATEST(COALESCE(p_limit, 10), 1), 100);
$$;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_top_pages_timeseries(DATE, DATE, TEXT, INTEGER)
	TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_page_analytics_pages_by_duration(
	DATE, DATE, TEXT, INTEGER, INTEGER
) TO authenticated;
