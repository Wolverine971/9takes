-- supabase/migrations/20260514_admin_analytics_trending_pages.sql
-- Adds same-elapsed-day trending page analytics for admin dashboards.

CREATE OR REPLACE FUNCTION public.get_page_analytics_trending_pages(
	p_anchor_ts TIMESTAMPTZ DEFAULT NULL,
	p_baseline_days INTEGER DEFAULT 7,
	p_scope TEXT DEFAULT 'all',
	p_min_visits INTEGER DEFAULT 3,
	p_min_unique INTEGER DEFAULT 3,
	p_limit INTEGER DEFAULT 20
)
RETURNS TABLE(
	path TEXT,
	path_group TEXT,
	content_type TEXT,
	current_visits BIGINT,
	current_unique_visitors BIGINT,
	baseline_avg_visits NUMERIC,
	baseline_avg_unique_visitors NUMERIC,
	lift_visits NUMERIC,
	lift_unique_visitors NUMERIC,
	ratio_visits NUMERIC,
	trend_score NUMERIC,
	confidence TEXT,
	top_sources JSONB,
	top_referrers JSONB,
	avg_time_on_page_ms INTEGER,
	median_time_on_page_ms INTEGER,
	bounce_rate NUMERIC,
	is_low_unique BOOLEAN
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
	WITH params AS (
		SELECT
			COALESCE(p_anchor_ts, NOW()) AS anchor_ts,
			LEAST(GREATEST(COALESCE(p_baseline_days, 7), 1), 30) AS baseline_days,
			LEAST(GREATEST(COALESCE(p_min_visits, 3), 1), 200) AS min_visits,
			LEAST(GREATEST(COALESCE(p_min_unique, 3), 1), 200) AS min_unique,
			LEAST(GREATEST(COALESCE(p_limit, 20), 1), 100) AS row_limit,
			public.analytics_local_date(COALESCE(p_anchor_ts, NOW())) AS anchor_date
	),
	bounds AS (
		SELECT
			p.*,
			(p.anchor_date::TIMESTAMP AT TIME ZONE 'America/New_York') AS current_start_ts,
			GREATEST(
				p.anchor_ts - (p.anchor_date::TIMESTAMP AT TIME ZONE 'America/New_York'),
				INTERVAL '1 minute'
			) AS elapsed_interval
		FROM params p
	),
	current_filtered AS (
		SELECT v.*
		FROM public.page_analytics_visits v
		CROSS JOIN bounds b
		WHERE v.started_at >= b.current_start_ts
			AND v.started_at < b.anchor_ts
			AND NOT public.is_analytics_utility_path(v.path)
			AND public.analytics_scope_match(p_scope, v.path, v.content_type)
	),
	current_grouped AS (
		SELECT
			v.path,
			v.path_group,
			COALESCE(MAX(v.content_type), 'other') AS content_type,
			COUNT(*)::BIGINT AS current_visits,
			COUNT(DISTINCT v.fingerprint)::BIGINT AS current_unique_visitors,
			COALESCE(ROUND(AVG(v.engaged_ms))::INT, 0) AS avg_time_on_page_ms,
			COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY v.engaged_ms)::INT, 0)
				AS median_time_on_page_ms,
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
		FROM current_filtered v
		GROUP BY v.path, v.path_group
	),
	baseline_daily AS (
		SELECT
			d.day_index,
			v.path,
			COUNT(*)::BIGINT AS visits,
			COUNT(DISTINCT v.fingerprint)::BIGINT AS unique_visitors
		FROM bounds b
		CROSS JOIN LATERAL generate_series(1, b.baseline_days) AS d(day_index)
		INNER JOIN public.page_analytics_visits v
			ON v.started_at >= ((b.anchor_date - d.day_index)::TIMESTAMP AT TIME ZONE 'America/New_York')
			AND v.started_at < (
				((b.anchor_date - d.day_index)::TIMESTAMP AT TIME ZONE 'America/New_York')
					+ b.elapsed_interval
			)
		WHERE NOT public.is_analytics_utility_path(v.path)
			AND public.analytics_scope_match(p_scope, v.path, v.content_type)
		GROUP BY d.day_index, v.path
	),
	baseline_grouped AS (
		SELECT
			bd.path,
			ROUND((SUM(bd.visits)::NUMERIC / MAX(b.baseline_days)::NUMERIC), 2)
				AS baseline_avg_visits,
			ROUND((SUM(bd.unique_visitors)::NUMERIC / MAX(b.baseline_days)::NUMERIC), 2)
				AS baseline_avg_unique_visitors
		FROM baseline_daily bd
		CROSS JOIN bounds b
		GROUP BY bd.path
	),
	source_counts AS (
		SELECT
			v.path,
			COALESCE(NULLIF(BTRIM(v.acquisition_source), ''), 'unknown') AS source,
			COUNT(*)::BIGINT AS visits
		FROM current_filtered v
		GROUP BY v.path, COALESCE(NULLIF(BTRIM(v.acquisition_source), ''), 'unknown')
	),
	source_ranked AS (
		SELECT
			sc.*,
			ROW_NUMBER() OVER (PARTITION BY sc.path ORDER BY sc.visits DESC, sc.source ASC) AS rank
		FROM source_counts sc
	),
	top_sources AS (
		SELECT
			sr.path,
			JSONB_AGG(
				JSONB_BUILD_OBJECT('key', sr.source, 'count', sr.visits)
				ORDER BY sr.visits DESC, sr.source ASC
			) AS top_sources
		FROM source_ranked sr
		WHERE sr.rank <= 3
		GROUP BY sr.path
	),
	referrer_counts AS (
		SELECT
			v.path,
			COALESCE(NULLIF(BTRIM(v.referrer_host), ''), 'direct/unknown') AS referrer,
			COUNT(*)::BIGINT AS visits
		FROM current_filtered v
		GROUP BY v.path, COALESCE(NULLIF(BTRIM(v.referrer_host), ''), 'direct/unknown')
	),
	referrer_ranked AS (
		SELECT
			rc.*,
			ROW_NUMBER() OVER (PARTITION BY rc.path ORDER BY rc.visits DESC, rc.referrer ASC)
				AS rank
		FROM referrer_counts rc
	),
	top_referrers AS (
		SELECT
			rr.path,
			JSONB_AGG(
				JSONB_BUILD_OBJECT('key', rr.referrer, 'count', rr.visits)
				ORDER BY rr.visits DESC, rr.referrer ASC
			) AS top_referrers
		FROM referrer_ranked rr
		WHERE rr.rank <= 3
		GROUP BY rr.path
	),
	scored_inputs AS (
		SELECT
			c.path,
			c.path_group,
			c.content_type,
			c.current_visits,
			c.current_unique_visitors,
			COALESCE(bg.baseline_avg_visits, 0)::NUMERIC AS baseline_avg_visits,
			COALESCE(bg.baseline_avg_unique_visitors, 0)::NUMERIC
				AS baseline_avg_unique_visitors,
			(c.current_visits::NUMERIC - COALESCE(bg.baseline_avg_visits, 0)::NUMERIC)
				AS lift_visits,
			(
				c.current_unique_visitors::NUMERIC
					- COALESCE(bg.baseline_avg_unique_visitors, 0)::NUMERIC
			) AS lift_unique_visitors,
			CASE
				WHEN COALESCE(bg.baseline_avg_visits, 0) > 0
					THEN ROUND(c.current_visits::NUMERIC / bg.baseline_avg_visits, 2)
				ELSE NULL
			END AS ratio_visits,
			c.avg_time_on_page_ms,
			c.median_time_on_page_ms,
			c.bounce_rate,
			(
				c.current_unique_visitors < b.min_unique
				OR (c.current_unique_visitors <= 2 AND c.current_visits >= b.min_visits)
				OR (
					c.current_unique_visitors > 0
					AND c.current_visits::NUMERIC / c.current_unique_visitors::NUMERIC >= 4
				)
			) AS is_low_unique,
			b.min_visits,
			b.min_unique,
			b.row_limit
		FROM current_grouped c
		CROSS JOIN bounds b
		LEFT JOIN baseline_grouped bg ON bg.path = c.path
	),
	scored AS (
		SELECT
			si.*,
			ROUND(
				(
					GREATEST(si.lift_visits, 0)
					+ GREATEST(si.lift_unique_visitors, 0) * 1.5
					+ LEAST(
						COALESCE(
							si.ratio_visits,
							CASE WHEN si.baseline_avg_visits = 0 THEN si.current_visits::NUMERIC ELSE 0 END
						),
						12
					) * 0.75
				)
				* CASE WHEN si.is_low_unique THEN 0.65 ELSE 1 END,
				2
			) AS trend_score,
			CASE
				WHEN si.is_low_unique THEN 'low_unique'
				WHEN si.current_unique_visitors >= GREATEST(si.min_unique * 2, 8) THEN 'broad'
				ELSE 'moderate'
			END AS confidence
		FROM scored_inputs si
		WHERE si.current_visits >= si.min_visits
			AND si.lift_visits > 0
	)
	SELECT
		s.path,
		s.path_group,
		s.content_type,
		s.current_visits,
		s.current_unique_visitors,
		ROUND(s.baseline_avg_visits, 2) AS baseline_avg_visits,
		ROUND(s.baseline_avg_unique_visitors, 2) AS baseline_avg_unique_visitors,
		ROUND(s.lift_visits, 2) AS lift_visits,
		ROUND(s.lift_unique_visitors, 2) AS lift_unique_visitors,
		s.ratio_visits,
		s.trend_score,
		s.confidence,
		COALESCE(ts.top_sources, '[]'::JSONB) AS top_sources,
		COALESCE(tr.top_referrers, '[]'::JSONB) AS top_referrers,
		s.avg_time_on_page_ms,
		s.median_time_on_page_ms,
		s.bounce_rate,
		s.is_low_unique
	FROM scored s
	LEFT JOIN top_sources ts ON ts.path = s.path
	LEFT JOIN top_referrers tr ON tr.path = s.path
	ORDER BY
		s.trend_score DESC,
		s.lift_visits DESC,
		s.current_unique_visitors DESC,
		s.path ASC
	LIMIT (SELECT row_limit FROM bounds);
$$;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_trending_pages(
	TIMESTAMPTZ, INTEGER, TEXT, INTEGER, INTEGER, INTEGER
) TO authenticated;
