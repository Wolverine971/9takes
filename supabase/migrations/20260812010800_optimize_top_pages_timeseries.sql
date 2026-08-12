-- supabase/migrations/20260812010800_optimize_top_pages_timeseries.sql
-- Created: 2026-08-12
--
-- Avoid materializing every wide visit row for two consumers. Select the small
-- top-page set first, then use the path/time index for only those page series.

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
SET search_path = public
AS $$
	WITH bounds AS (
		SELECT
			COALESCE(p_from_date::TIMESTAMPTZ, NOW() - INTERVAL '30 days') AS from_ts,
			COALESCE((p_to_date::TIMESTAMPTZ + INTERVAL '1 day'), NOW() + INTERVAL '1 day') AS to_ts
	),
	top_pages AS MATERIALIZED (
		SELECT
			v.path,
			COALESCE(MAX(v.path_group), '/') AS path_group,
			COUNT(*)::BIGINT AS total_visits
		FROM public.page_analytics_visits v
		CROSS JOIN bounds b
		WHERE v.started_at >= b.from_ts
			AND v.started_at < b.to_ts
			AND NOT public.is_analytics_utility_path(v.path)
			AND public.analytics_scope_match(p_scope, v.path, v.content_type)
		GROUP BY v.path
		ORDER BY total_visits DESC, v.path ASC
		LIMIT LEAST(GREATEST(COALESCE(p_top_n, 5), 1), 20)
	),
	series AS (
		SELECT
			DATE_TRUNC('day', v.started_at)::DATE AS day,
			v.path,
			COUNT(*)::BIGINT AS visits
		FROM top_pages t
		CROSS JOIN bounds b
		INNER JOIN public.page_analytics_visits v
			ON v.path = t.path
			AND v.started_at >= b.from_ts
			AND v.started_at < b.to_ts
		WHERE NOT public.is_analytics_utility_path(v.path)
			AND public.analytics_scope_match(p_scope, v.path, v.content_type)
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

GRANT EXECUTE ON FUNCTION public.get_page_analytics_top_pages_timeseries(
	DATE, DATE, TEXT, INTEGER
) TO authenticated;
