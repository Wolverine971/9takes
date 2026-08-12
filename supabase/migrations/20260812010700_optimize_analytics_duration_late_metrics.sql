-- supabase/migrations/20260812010700_optimize_analytics_duration_late_metrics.sql
-- Created: 2026-08-12
--
-- Rank page groups using inexpensive aggregates first. Exact distinct-visitor and
-- median metrics are then calculated only for the rows the endpoint will return.

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
SET search_path = public
AS $$
	WITH bounds AS (
		SELECT
			COALESCE(p_from_date::TIMESTAMPTZ, NOW() - INTERVAL '30 days') AS from_ts,
			COALESCE((p_to_date::TIMESTAMPTZ + INTERVAL '1 day'), NOW() + INTERVAL '1 day') AS to_ts
	),
	grouped AS (
		SELECT
			v.path,
			v.path_group,
			COALESCE(MAX(v.content_type), 'other') AS content_type,
			COUNT(*)::BIGINT AS visits,
			COUNT(*) FILTER (WHERE v.user_id IS NOT NULL)::BIGINT AS authenticated_visits,
			COUNT(*) FILTER (WHERE v.user_id IS NULL)::BIGINT AS anonymous_visits,
			COALESCE(ROUND(AVG(v.engaged_ms))::INT, 0) AS avg_time_on_page_ms,
			CASE
				WHEN COUNT(*) > 0
					THEN ROUND(
						(COUNT(*) FILTER (WHERE v.engaged_ms < 10000))::NUMERIC
							/ COUNT(*)::NUMERIC
							* 100,
						2
					)
				ELSE 0
			END AS bounce_rate
		FROM public.page_analytics_visits v
		CROSS JOIN bounds b
		WHERE v.started_at >= b.from_ts
			AND v.started_at < b.to_ts
			AND NOT public.is_analytics_utility_path(v.path)
			AND public.analytics_scope_match(p_scope, v.path, v.content_type)
		GROUP BY v.path, v.path_group
	),
	ranked AS MATERIALIZED (
		SELECT g.*
		FROM grouped g
		WHERE g.visits >= GREATEST(COALESCE(p_min_visits, 0), 0)
		ORDER BY g.avg_time_on_page_ms DESC, g.visits DESC, g.path ASC
		LIMIT LEAST(GREATEST(COALESCE(p_limit, 10), 1), 100)
	)
	SELECT
		r.path,
		r.path_group,
		r.content_type,
		r.visits,
		m.unique_visitors,
		r.authenticated_visits,
		r.anonymous_visits,
		r.avg_time_on_page_ms,
		COALESCE(m.median_time_on_page_ms, 0)::INTEGER AS median_time_on_page_ms,
		r.bounce_rate
	FROM ranked r
	CROSS JOIN bounds b
	CROSS JOIN LATERAL (
		SELECT
			COUNT(DISTINCT v.fingerprint)::BIGINT AS unique_visitors,
			PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY v.engaged_ms)::INTEGER
				AS median_time_on_page_ms
		FROM public.page_analytics_visits v
		WHERE v.started_at >= b.from_ts
			AND v.started_at < b.to_ts
			AND v.path = r.path
			AND v.path_group IS NOT DISTINCT FROM r.path_group
			AND NOT public.is_analytics_utility_path(v.path)
			AND public.analytics_scope_match(p_scope, v.path, v.content_type)
	) m
	ORDER BY r.avg_time_on_page_ms DESC, r.visits DESC, r.path ASC;
$$;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_pages_by_duration(
	DATE, DATE, TEXT, INTEGER, INTEGER
) TO authenticated;
