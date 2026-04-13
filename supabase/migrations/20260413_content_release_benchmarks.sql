-- supabase/migrations/20260413_content_release_benchmarks.sql
-- Created: 2026-04-13
-- Expands release benchmarking beyond the first 7 days.

DROP FUNCTION IF EXISTS public.get_content_release_performance(DATE, DATE, INTEGER);

CREATE OR REPLACE FUNCTION public.get_content_release_performance(
	p_from_date DATE DEFAULT NULL,
	p_to_date DATE DEFAULT NULL,
	p_limit INTEGER DEFAULT 50
)
RETURNS TABLE(
	id BIGINT,
	slug TEXT,
	path TEXT,
	title TEXT,
	published_at TIMESTAMPTZ,
	first_view_at TIMESTAMPTZ,
	minutes_to_first_view INTEGER,
	views_1h BIGINT,
	views_6h BIGINT,
	views_24h BIGINT,
	unique_24h BIGINT,
	views_7d BIGINT,
	unique_7d BIGINT,
	views_30d BIGINT,
	unique_30d BIGINT,
	total_views BIGINT,
	total_unique_visitors BIGINT,
	avg_time_on_page_ms INTEGER,
	median_time_on_page_ms INTEGER,
	avg_scroll_pct INTEGER,
	bounce_rate NUMERIC,
	views_24h_percentile NUMERIC,
	views_7d_percentile NUMERIC,
	views_30d_percentile NUMERIC,
	benchmark_score NUMERIC,
	benchmark_sample_size INTEGER,
	benchmark_basis TEXT,
	performance_band TEXT,
	release_stage TEXT,
	growth_slope_7d NUMERIC,
	decay_rate_after_spike NUMERIC
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
			('/personality-analysis/' || public.analytics_normalize_content_slug(b.person)) AS path,
			COALESCE(NULLIF(BTRIM(b.title), ''), b.person, '') AS title,
			COALESCE(
				b.first_published_at,
				b.published_at,
				b.created_at,
				CASE
					WHEN b.date::TEXT ~ '^\d{4}-\d{2}-\d{2}$'
					THEN ((b.date::DATE + TIME '12:00') AT TIME ZONE 'America/New_York')
					ELSE NULL
				END
			) AS published_at
		FROM public.blogs_famous_people b
		WHERE b.published IS TRUE
			AND COALESCE(NULLIF(BTRIM(b.person), ''), '') <> ''
	),
	daily_rollups AS (
		SELECT
			r.id,
			cad.days_since_publish,
			cad.visits,
			cad.unique_visitors,
			cad.engaged_ms_total,
			cad.median_engaged_ms,
			cad.bounce_visits,
			cad.avg_scroll_pct,
			cad.first_view_at
		FROM releases r
		INNER JOIN public.content_analytics_daily cad
			ON cad.content_type = 'people'
			AND cad.content_slug = r.slug
			AND cad.days_since_publish >= 0
		WHERE r.published_at IS NOT NULL
	),
	raw_daily_missing AS (
		SELECT
			r.id,
			(
				public.analytics_local_date(v.started_at)
				- public.analytics_local_date(r.published_at)
			)::INTEGER AS days_since_publish,
			COUNT(v.id)::BIGINT AS visits,
			COUNT(DISTINCT v.fingerprint)::BIGINT AS unique_visitors,
			COALESCE(SUM(v.engaged_ms), 0)::BIGINT AS engaged_ms_total,
			COALESCE(
				PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY v.engaged_ms)::INTEGER,
				0
			) AS median_engaged_ms,
			COUNT(v.id) FILTER (WHERE v.engaged_ms < 10000)::BIGINT AS bounce_visits,
			COALESCE(ROUND(AVG(v.max_scroll_pct))::INTEGER, 0) AS avg_scroll_pct,
			MIN(v.started_at) AS first_view_at
		FROM releases r
		INNER JOIN public.page_analytics_visits v
			ON v.content_type = 'people'
			AND v.content_slug IS NOT NULL
			AND public.analytics_normalize_content_slug(v.content_slug) = r.slug
			AND v.started_at >= r.published_at
			AND NOT public.is_analytics_utility_path(v.path)
		WHERE r.published_at IS NOT NULL
			AND NOT EXISTS (
				SELECT 1
				FROM public.content_analytics_daily cad
				WHERE cad.metric_date = public.analytics_local_date(v.started_at)
					AND cad.content_type = 'people'
					AND cad.content_slug = r.slug
			)
		GROUP BY
			r.id,
			public.analytics_local_date(v.started_at)
				- public.analytics_local_date(r.published_at)
	),
	daily_union AS (
		SELECT * FROM daily_rollups
		UNION ALL
		SELECT * FROM raw_daily_missing
	),
	daily_agg AS (
		SELECT
			du.id,
			MIN(du.first_view_at) AS first_view_at,
			COALESCE(SUM(du.visits) FILTER (WHERE du.days_since_publish = 0), 0)::BIGINT
				AS views_24h,
			COALESCE(SUM(du.unique_visitors) FILTER (WHERE du.days_since_publish = 0), 0)::BIGINT
				AS unique_24h,
			COALESCE(SUM(du.visits) FILTER (WHERE du.days_since_publish BETWEEN 0 AND 6), 0)::BIGINT
				AS views_7d,
			COALESCE(
				SUM(du.unique_visitors) FILTER (WHERE du.days_since_publish BETWEEN 0 AND 6),
				0
			)::BIGINT AS unique_7d,
			COALESCE(SUM(du.visits) FILTER (WHERE du.days_since_publish BETWEEN 0 AND 29), 0)::BIGINT
				AS views_30d,
			COALESCE(
				SUM(du.unique_visitors) FILTER (WHERE du.days_since_publish BETWEEN 0 AND 29),
				0
			)::BIGINT AS unique_30d,
			COALESCE(SUM(du.visits), 0)::BIGINT AS total_views,
			COALESCE(SUM(du.unique_visitors), 0)::BIGINT AS total_unique_visitors,
			COALESCE(
				ROUND(SUM(du.engaged_ms_total)::NUMERIC / NULLIF(SUM(du.visits), 0))::INTEGER,
				0
			) AS avg_time_on_page_ms,
			COALESCE(
				ROUND(
					SUM((du.median_engaged_ms::BIGINT * du.visits))::NUMERIC
						/ NULLIF(SUM(du.visits), 0)
				)::INTEGER,
				0
			) AS median_time_on_page_ms,
			COALESCE(
				ROUND(
					SUM((du.avg_scroll_pct::BIGINT * du.visits))::NUMERIC
						/ NULLIF(SUM(du.visits), 0)
				)::INTEGER,
				0
			) AS avg_scroll_pct,
			CASE
				WHEN COALESCE(SUM(du.visits), 0) > 0
				THEN ROUND(SUM(du.bounce_visits)::NUMERIC / SUM(du.visits)::NUMERIC * 100, 2)
				ELSE 0
			END AS bounce_rate
		FROM daily_union du
		WHERE du.days_since_publish >= 0
		GROUP BY du.id
	),
	raw_exact AS (
		SELECT
			r.id,
			MIN(v.started_at) AS first_view_at,
			COUNT(v.id) FILTER (
				WHERE v.started_at < r.published_at + INTERVAL '1 hour'
			)::BIGINT AS views_1h,
			COUNT(v.id) FILTER (
				WHERE v.started_at < r.published_at + INTERVAL '6 hours'
			)::BIGINT AS views_6h,
			COUNT(v.id) FILTER (
				WHERE v.started_at < r.published_at + INTERVAL '24 hours'
			)::BIGINT AS views_24h,
			COUNT(DISTINCT v.fingerprint) FILTER (
				WHERE v.started_at < r.published_at + INTERVAL '24 hours'
			)::BIGINT AS unique_24h
		FROM releases r
		LEFT JOIN public.page_analytics_visits v
			ON v.content_type = 'people'
			AND v.content_slug IS NOT NULL
			AND public.analytics_normalize_content_slug(v.content_slug) = r.slug
			AND v.started_at >= r.published_at
			AND NOT public.is_analytics_utility_path(v.path)
		WHERE r.published_at IS NOT NULL
		GROUP BY r.id
	),
	daily_by_day AS (
		SELECT
			du.id,
			du.days_since_publish,
			SUM(du.visits)::NUMERIC AS visits
		FROM daily_union du
		WHERE du.days_since_publish BETWEEN 0 AND 29
		GROUP BY du.id, du.days_since_publish
	),
	release_day_metrics AS (
		SELECT
			r.id,
			gs.day_number::INTEGER AS day_number,
			COALESCE(dbd.visits, 0)::NUMERIC AS visits
		FROM releases r
		CROSS JOIN generate_series(0, 29) AS gs(day_number)
		LEFT JOIN daily_by_day dbd
			ON dbd.id = r.id
			AND dbd.days_since_publish = gs.day_number
		WHERE r.published_at IS NOT NULL
	),
	growth_raw AS (
		SELECT
			rdm.id,
			ROUND(
				(
					REGR_SLOPE(rdm.visits::DOUBLE PRECISION, rdm.day_number::DOUBLE PRECISION)
						FILTER (WHERE rdm.day_number BETWEEN 0 AND 6)
				)::NUMERIC,
				2
			) AS growth_slope_7d,
			SUM(rdm.visits) FILTER (WHERE rdm.day_number BETWEEN 0 AND 6) AS first_week_views,
			SUM(rdm.visits) FILTER (WHERE rdm.day_number BETWEEN 7 AND 29) AS trailing_views
		FROM release_day_metrics rdm
		GROUP BY rdm.id
	),
	growth_metrics AS (
		SELECT
			gr.id,
			gr.growth_slope_7d,
			CASE
				WHEN COALESCE(gr.first_week_views, 0) > 0
				THEN ROUND(
					(
						1
						- (COALESCE(gr.trailing_views, 0)::NUMERIC / 23)
							/ (gr.first_week_views::NUMERIC / 7)
					)
					* 100,
					2
				)
				ELSE NULL
			END AS decay_rate_after_spike
		FROM growth_raw gr
	),
	agg AS (
		SELECT
			r.id,
			r.slug,
			r.path,
			r.title,
			r.published_at,
			CASE
				WHEN re.first_view_at IS NULL THEN da.first_view_at
				WHEN da.first_view_at IS NULL THEN re.first_view_at
				ELSE LEAST(re.first_view_at, da.first_view_at)
			END AS first_view_at,
			CASE
				WHEN r.published_at >= NOW() - INTERVAL '90 days' THEN COALESCE(re.views_1h, 0)
				ELSE 0
			END::BIGINT AS views_1h,
			CASE
				WHEN r.published_at >= NOW() - INTERVAL '90 days' THEN COALESCE(re.views_6h, 0)
				ELSE 0
			END::BIGINT AS views_6h,
			CASE
				WHEN r.published_at >= NOW() - INTERVAL '90 days' THEN COALESCE(re.views_24h, 0)
				ELSE COALESCE(da.views_24h, 0)
			END::BIGINT AS views_24h,
			CASE
				WHEN r.published_at >= NOW() - INTERVAL '90 days' THEN COALESCE(re.unique_24h, 0)
				ELSE COALESCE(da.unique_24h, 0)
			END::BIGINT AS unique_24h,
			COALESCE(da.views_7d, 0)::BIGINT AS views_7d,
			COALESCE(da.unique_7d, 0)::BIGINT AS unique_7d,
			COALESCE(da.views_30d, 0)::BIGINT AS views_30d,
			COALESCE(da.unique_30d, 0)::BIGINT AS unique_30d,
			COALESCE(da.total_views, 0)::BIGINT AS total_views,
			COALESCE(da.total_unique_visitors, 0)::BIGINT AS total_unique_visitors,
			COALESCE(da.avg_time_on_page_ms, 0) AS avg_time_on_page_ms,
			COALESCE(da.median_time_on_page_ms, 0) AS median_time_on_page_ms,
			COALESCE(da.avg_scroll_pct, 0) AS avg_scroll_pct,
			COALESCE(da.bounce_rate, 0) AS bounce_rate,
			CASE
				WHEN r.published_at <= NOW() - INTERVAL '7 days'
				THEN gm.growth_slope_7d
				ELSE NULL
			END AS growth_slope_7d,
			CASE
				WHEN r.published_at <= NOW() - INTERVAL '30 days'
				THEN gm.decay_rate_after_spike
				ELSE NULL
			END AS decay_rate_after_spike
		FROM releases r
		LEFT JOIN daily_agg da ON da.id = r.id
		LEFT JOIN raw_exact re ON re.id = r.id
		LEFT JOIN growth_metrics gm ON gm.id = r.id
		WHERE r.published_at IS NOT NULL
	),
	rollup_bounds AS (
		SELECT COALESCE(MIN(metric_date), DATE '2026-02-20') AS benchmark_start_date
		FROM public.content_analytics_daily
		WHERE content_type = 'people'
	),
	benchmark_counts AS (
		SELECT
			rb.benchmark_start_date,
			COUNT(*) FILTER (
				WHERE public.analytics_local_date(a.published_at) >= rb.benchmark_start_date
					AND a.published_at <= NOW() - INTERVAL '24 hours'
			)::INTEGER
				AS mature_24h_count,
			COUNT(*) FILTER (
				WHERE public.analytics_local_date(a.published_at) >= rb.benchmark_start_date
					AND a.published_at <= NOW() - INTERVAL '7 days'
			)::INTEGER
				AS mature_7d_count,
			COUNT(*) FILTER (
				WHERE public.analytics_local_date(a.published_at) >= rb.benchmark_start_date
					AND a.published_at <= NOW() - INTERVAL '30 days'
			)::INTEGER
				AS mature_30d_count
		FROM agg a
		CROSS JOIN rollup_bounds rb
		GROUP BY rb.benchmark_start_date
	),
	percentiles AS (
		SELECT
			a.*,
			b.benchmark_start_date,
			b.mature_24h_count,
			b.mature_7d_count,
			b.mature_30d_count,
			CASE
				WHEN public.analytics_local_date(a.published_at) < b.benchmark_start_date
					OR a.published_at > NOW() - INTERVAL '24 hours'
					OR b.mature_24h_count < 4
				THEN NULL
				ELSE ROUND(
					(
						SELECT COUNT(*)::NUMERIC
						FROM agg x
						WHERE public.analytics_local_date(x.published_at) >= b.benchmark_start_date
							AND x.published_at <= NOW() - INTERVAL '24 hours'
							AND x.views_24h <= a.views_24h
					)
					/ NULLIF(b.mature_24h_count, 0)::NUMERIC
					* 100,
					2
				)
			END AS views_24h_percentile,
			CASE
				WHEN public.analytics_local_date(a.published_at) < b.benchmark_start_date
					OR a.published_at > NOW() - INTERVAL '7 days'
					OR b.mature_7d_count < 4
				THEN NULL
				ELSE ROUND(
					(
						SELECT COUNT(*)::NUMERIC
						FROM agg x
						WHERE public.analytics_local_date(x.published_at) >= b.benchmark_start_date
							AND x.published_at <= NOW() - INTERVAL '7 days'
							AND x.views_7d <= a.views_7d
					)
					/ NULLIF(b.mature_7d_count, 0)::NUMERIC
					* 100,
					2
				)
			END AS views_7d_percentile,
			CASE
				WHEN public.analytics_local_date(a.published_at) < b.benchmark_start_date
					OR a.published_at > NOW() - INTERVAL '30 days'
					OR b.mature_30d_count < 4
				THEN NULL
				ELSE ROUND(
					(
						SELECT COUNT(*)::NUMERIC
						FROM agg x
						WHERE public.analytics_local_date(x.published_at) >= b.benchmark_start_date
							AND x.published_at <= NOW() - INTERVAL '30 days'
							AND x.views_30d <= a.views_30d
					)
					/ NULLIF(b.mature_30d_count, 0)::NUMERIC
					* 100,
					2
				)
			END AS views_30d_percentile
		FROM agg a
		CROSS JOIN benchmark_counts b
	),
	scored AS (
		SELECT
			p.*,
			CASE
				WHEN p.published_at > NOW() - INTERVAL '24 hours' THEN NULL
				WHEN p.views_24h_percentile IS NULL THEN NULL
				WHEN p.published_at > NOW() - INTERVAL '7 days'
					OR p.views_7d_percentile IS NULL
				THEN p.views_24h_percentile
				WHEN p.published_at > NOW() - INTERVAL '30 days'
					OR p.views_30d_percentile IS NULL
				THEN ROUND((p.views_24h_percentile + p.views_7d_percentile) / 2, 2)
				ELSE ROUND(
					(p.views_24h_percentile + p.views_7d_percentile + p.views_30d_percentile)
						/ 3,
					2
				)
			END AS benchmark_score,
			CASE
				WHEN p.published_at > NOW() - INTERVAL '24 hours' THEN 0
				WHEN p.published_at > NOW() - INTERVAL '7 days' THEN p.mature_24h_count
				WHEN p.published_at > NOW() - INTERVAL '30 days' THEN p.mature_7d_count
				ELSE p.mature_30d_count
			END::INTEGER AS benchmark_sample_size,
			CASE
				WHEN p.published_at > NOW() - INTERVAL '24 hours' THEN 'collecting'
				WHEN p.views_24h_percentile IS NULL THEN 'insufficient_history'
				WHEN p.published_at > NOW() - INTERVAL '7 days'
					OR p.views_7d_percentile IS NULL
				THEN '24h'
				WHEN p.published_at > NOW() - INTERVAL '30 days'
					OR p.views_30d_percentile IS NULL
				THEN '24h_7d'
				ELSE '24h_7d_30d'
			END AS benchmark_basis
		FROM percentiles p
	),
	banded AS (
		SELECT
			s.*,
			CASE
				WHEN s.published_at > NOW() - INTERVAL '24 hours' THEN 'collecting'
				WHEN s.benchmark_score IS NULL THEN 'insufficient_history'
				WHEN s.benchmark_score >= 75 THEN 'above_norm'
				WHEN s.benchmark_score <= 25 THEN 'below_norm'
				ELSE 'near_norm'
			END AS performance_band,
			CASE
				WHEN s.published_at > NOW() - INTERVAL '24 hours' THEN 'first_day'
				WHEN s.published_at > NOW() - INTERVAL '7 days' THEN 'first_week'
				WHEN s.published_at > NOW() - INTERVAL '30 days' THEN 'first_month'
				ELSE 'mature'
			END AS release_stage
		FROM scored s
	)
	SELECT
		b.id,
		b.slug,
		b.path,
		b.title,
		b.published_at,
		b.first_view_at,
		CASE
			WHEN b.first_view_at IS NULL THEN NULL
			ELSE FLOOR(EXTRACT(EPOCH FROM (b.first_view_at - b.published_at)) / 60)::INTEGER
		END AS minutes_to_first_view,
		b.views_1h,
		b.views_6h,
		b.views_24h,
		b.unique_24h,
		b.views_7d,
		b.unique_7d,
		b.views_30d,
		b.unique_30d,
		b.total_views,
		b.total_unique_visitors,
		b.avg_time_on_page_ms,
		b.median_time_on_page_ms,
		b.avg_scroll_pct,
		b.bounce_rate,
		b.views_24h_percentile,
		b.views_7d_percentile,
		b.views_30d_percentile,
		b.benchmark_score,
		b.benchmark_sample_size,
		b.benchmark_basis,
		b.performance_band,
		b.release_stage,
		b.growth_slope_7d,
		b.decay_rate_after_spike
	FROM banded b
	WHERE (p_from_date IS NULL OR public.analytics_local_date(b.published_at) >= p_from_date)
		AND (p_to_date IS NULL OR public.analytics_local_date(b.published_at) <= p_to_date)
	ORDER BY b.published_at DESC, b.id DESC
	LIMIT LEAST(GREATEST(COALESCE(p_limit, 50), 1), 200);
END;
$$;

REVOKE ALL ON FUNCTION public.get_content_release_performance(DATE, DATE, INTEGER)
	FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_content_release_performance(DATE, DATE, INTEGER)
	TO authenticated, service_role;
