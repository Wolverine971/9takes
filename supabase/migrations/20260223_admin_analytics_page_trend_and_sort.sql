-- supabase/migrations/20260223_admin_analytics_page_trend_and_sort.sql
-- Created: 2026-02-23
-- Adds sortable page breakdown RPC + single-page trend RPC for admin analytics

CREATE OR REPLACE FUNCTION public.get_page_analytics_pages_sorted(
	p_from_date DATE DEFAULT NULL,
	p_to_date DATE DEFAULT NULL,
	p_scope TEXT DEFAULT 'all',
	p_search TEXT DEFAULT NULL,
	p_limit INTEGER DEFAULT 100,
	p_offset INTEGER DEFAULT 0,
	p_sort_by TEXT DEFAULT 'visits',
	p_sort_dir TEXT DEFAULT 'desc'
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
	bounce_rate NUMERIC,
	total_rows BIGINT
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
	params AS (
		SELECT
			CASE
				WHEN COALESCE(p_sort_by, 'visits') IN (
					'path',
					'path_group',
					'content_type',
					'visits',
					'unique_visitors',
					'authenticated_visits',
					'anonymous_visits',
					'avg_time_on_page_ms',
					'median_time_on_page_ms',
					'bounce_rate'
				) THEN COALESCE(p_sort_by, 'visits')
				ELSE 'visits'
			END AS sort_by,
			CASE
				WHEN LOWER(COALESCE(p_sort_dir, 'desc')) = 'asc' THEN 'asc'
				ELSE 'desc'
			END AS sort_dir
	),
	filtered AS (
		SELECT v.*
		FROM public.page_analytics_visits v
		CROSS JOIN bounds b
		WHERE v.started_at >= b.from_ts
			AND v.started_at < b.to_ts
			AND NOT public.is_analytics_utility_path(v.path)
			AND public.analytics_scope_match(p_scope, v.path, v.content_type)
			AND (
				p_search IS NULL
				OR p_search = ''
				OR v.path ILIKE '%' || p_search || '%'
				OR v.path_group ILIKE '%' || p_search || '%'
			)
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
		g.bounce_rate,
		COUNT(*) OVER ()::BIGINT AS total_rows
	FROM grouped g
	CROSS JOIN params p
	ORDER BY
		CASE WHEN p.sort_by = 'path' AND p.sort_dir = 'asc' THEN g.path END ASC,
		CASE WHEN p.sort_by = 'path' AND p.sort_dir = 'desc' THEN g.path END DESC,
		CASE WHEN p.sort_by = 'path_group' AND p.sort_dir = 'asc' THEN g.path_group END ASC,
		CASE WHEN p.sort_by = 'path_group' AND p.sort_dir = 'desc' THEN g.path_group END DESC,
		CASE WHEN p.sort_by = 'content_type' AND p.sort_dir = 'asc' THEN g.content_type END ASC,
		CASE WHEN p.sort_by = 'content_type' AND p.sort_dir = 'desc' THEN g.content_type END DESC,
		CASE WHEN p.sort_by = 'visits' AND p.sort_dir = 'asc' THEN g.visits END ASC,
		CASE WHEN p.sort_by = 'visits' AND p.sort_dir = 'desc' THEN g.visits END DESC,
		CASE WHEN p.sort_by = 'unique_visitors' AND p.sort_dir = 'asc' THEN g.unique_visitors END ASC,
		CASE WHEN p.sort_by = 'unique_visitors' AND p.sort_dir = 'desc' THEN g.unique_visitors END DESC,
		CASE
			WHEN p.sort_by = 'authenticated_visits' AND p.sort_dir = 'asc'
			THEN g.authenticated_visits
		END ASC,
		CASE
			WHEN p.sort_by = 'authenticated_visits' AND p.sort_dir = 'desc'
			THEN g.authenticated_visits
		END DESC,
		CASE WHEN p.sort_by = 'anonymous_visits' AND p.sort_dir = 'asc' THEN g.anonymous_visits END ASC,
		CASE WHEN p.sort_by = 'anonymous_visits' AND p.sort_dir = 'desc' THEN g.anonymous_visits END DESC,
		CASE
			WHEN p.sort_by = 'avg_time_on_page_ms' AND p.sort_dir = 'asc'
			THEN g.avg_time_on_page_ms
		END ASC,
		CASE
			WHEN p.sort_by = 'avg_time_on_page_ms' AND p.sort_dir = 'desc'
			THEN g.avg_time_on_page_ms
		END DESC,
		CASE
			WHEN p.sort_by = 'median_time_on_page_ms' AND p.sort_dir = 'asc'
			THEN g.median_time_on_page_ms
		END ASC,
		CASE
			WHEN p.sort_by = 'median_time_on_page_ms' AND p.sort_dir = 'desc'
			THEN g.median_time_on_page_ms
		END DESC,
		CASE WHEN p.sort_by = 'bounce_rate' AND p.sort_dir = 'asc' THEN g.bounce_rate END ASC,
		CASE WHEN p.sort_by = 'bounce_rate' AND p.sort_dir = 'desc' THEN g.bounce_rate END DESC,
		g.visits DESC,
		g.path ASC
	LIMIT LEAST(GREATEST(COALESCE(p_limit, 100), 1), 500)
	OFFSET GREATEST(COALESCE(p_offset, 0), 0);
$$;

CREATE OR REPLACE FUNCTION public.get_page_analytics_page_timeseries(
	p_path TEXT,
	p_from_date DATE DEFAULT NULL,
	p_to_date DATE DEFAULT NULL,
	p_scope TEXT DEFAULT 'all'
)
RETURNS TABLE(
	day DATE,
	visits BIGINT,
	unique_visitors BIGINT,
	avg_time_on_page_ms INTEGER
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
		WHERE COALESCE(p_path, '') <> ''
			AND v.path = p_path
			AND v.started_at >= b.from_ts
			AND v.started_at < b.to_ts
			AND NOT public.is_analytics_utility_path(v.path)
			AND public.analytics_scope_match(p_scope, v.path, v.content_type)
	)
	SELECT
		DATE_TRUNC('day', started_at)::DATE AS day,
		COUNT(*)::BIGINT AS visits,
		COUNT(DISTINCT fingerprint)::BIGINT AS unique_visitors,
		COALESCE(ROUND(AVG(engaged_ms))::INT, 0) AS avg_time_on_page_ms
	FROM filtered
	GROUP BY 1
	ORDER BY 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_pages_sorted(
	DATE, DATE, TEXT, TEXT, INTEGER, INTEGER, TEXT, TEXT
) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_page_analytics_page_timeseries(
	TEXT, DATE, DATE, TEXT
) TO authenticated;
