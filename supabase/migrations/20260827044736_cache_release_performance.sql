-- supabase/migrations/20260827044736_cache_release_performance.sql
-- Cache the complete, unfiltered release-performance result used by the
-- dashboard and by filtered-report baselines. Date-filtered reads continue to
-- use the exact calculation so older releases outside the newest 200 remain
-- queryable.

CREATE SCHEMA IF NOT EXISTS private;

ALTER FUNCTION public.get_content_release_performance(DATE, DATE, INTEGER)
	SET SCHEMA private;

REVOKE ALL ON FUNCTION private.get_content_release_performance(DATE, DATE, INTEGER)
	FROM PUBLIC, anon, authenticated, service_role;

CREATE TABLE private.content_release_performance_cache (
	id BIGINT PRIMARY KEY,
	slug TEXT NOT NULL,
	path TEXT NOT NULL,
	title TEXT NOT NULL,
	published_at TIMESTAMPTZ NOT NULL,
	first_view_at TIMESTAMPTZ,
	minutes_to_first_view INTEGER,
	views_1h BIGINT NOT NULL,
	views_6h BIGINT NOT NULL,
	views_24h BIGINT NOT NULL,
	unique_24h BIGINT NOT NULL,
	views_7d BIGINT NOT NULL,
	unique_7d BIGINT NOT NULL,
	views_30d BIGINT NOT NULL,
	unique_30d BIGINT NOT NULL,
	total_views BIGINT NOT NULL,
	total_unique_visitors BIGINT NOT NULL,
	avg_time_on_page_ms INTEGER NOT NULL,
	median_time_on_page_ms INTEGER NOT NULL,
	avg_scroll_pct INTEGER NOT NULL,
	bounce_rate NUMERIC NOT NULL,
	views_24h_percentile NUMERIC,
	views_7d_percentile NUMERIC,
	views_30d_percentile NUMERIC,
	benchmark_score NUMERIC,
	benchmark_sample_size INTEGER NOT NULL,
	benchmark_basis TEXT NOT NULL,
	performance_band TEXT NOT NULL,
	release_stage TEXT NOT NULL,
	growth_slope_7d NUMERIC,
	decay_rate_after_spike NUMERIC,
	cached_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

REVOKE ALL ON TABLE private.content_release_performance_cache
	FROM PUBLIC, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION private.refresh_content_release_performance_cache()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
	v_rows INTEGER;
BEGIN
	-- Scheduled jobs do not carry a request JWT. Set a transaction-local role
	-- claim so the existing protected calculation recognizes this internal job.
	PERFORM set_config('request.jwt.claim.role', 'service_role', TRUE);
	PERFORM set_config('request.jwt.claims', '{"role":"service_role"}', TRUE);

	TRUNCATE TABLE private.content_release_performance_cache;

	INSERT INTO private.content_release_performance_cache (
		id,
		slug,
		path,
		title,
		published_at,
		first_view_at,
		minutes_to_first_view,
		views_1h,
		views_6h,
		views_24h,
		unique_24h,
		views_7d,
		unique_7d,
		views_30d,
		unique_30d,
		total_views,
		total_unique_visitors,
		avg_time_on_page_ms,
		median_time_on_page_ms,
		avg_scroll_pct,
		bounce_rate,
		views_24h_percentile,
		views_7d_percentile,
		views_30d_percentile,
		benchmark_score,
		benchmark_sample_size,
		benchmark_basis,
		performance_band,
		release_stage,
		growth_slope_7d,
		decay_rate_after_spike,
		cached_at
	)
	SELECT
		r.id,
		r.slug,
		r.path,
		r.title,
		r.published_at,
		r.first_view_at,
		r.minutes_to_first_view,
		r.views_1h,
		r.views_6h,
		r.views_24h,
		r.unique_24h,
		r.views_7d,
		r.unique_7d,
		r.views_30d,
		r.unique_30d,
		r.total_views,
		r.total_unique_visitors,
		r.avg_time_on_page_ms,
		r.median_time_on_page_ms,
		r.avg_scroll_pct,
		r.bounce_rate,
		r.views_24h_percentile,
		r.views_7d_percentile,
		r.views_30d_percentile,
		r.benchmark_score,
		r.benchmark_sample_size,
		r.benchmark_basis,
		r.performance_band,
		r.release_stage,
		r.growth_slope_7d,
		r.decay_rate_after_spike,
		NOW()
	FROM private.get_content_release_performance(NULL::DATE, NULL::DATE, 200) r;

	GET DIAGNOSTICS v_rows = ROW_COUNT;
	RETURN v_rows;
END;
$$;

REVOKE ALL ON FUNCTION private.refresh_content_release_performance_cache()
	FROM PUBLIC, anon, authenticated, service_role;

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
SET search_path = ''
AS $$
BEGIN
	IF COALESCE((SELECT auth.jwt() ->> 'role'), '') <> 'service_role'
		AND NOT EXISTS (
			SELECT 1
			FROM public.profiles p
			WHERE p.id = (SELECT auth.uid())
				AND p.admin IS TRUE
		)
	THEN
		RAISE EXCEPTION 'admin access required';
	END IF;

	IF p_from_date IS NULL
		AND p_to_date IS NULL
		AND EXISTS (SELECT 1 FROM private.content_release_performance_cache)
	THEN
		RETURN QUERY
		SELECT
			c.id,
			c.slug,
			c.path,
			c.title,
			c.published_at,
			c.first_view_at,
			c.minutes_to_first_view,
			c.views_1h,
			c.views_6h,
			c.views_24h,
			c.unique_24h,
			c.views_7d,
			c.unique_7d,
			c.views_30d,
			c.unique_30d,
			c.total_views,
			c.total_unique_visitors,
			c.avg_time_on_page_ms,
			c.median_time_on_page_ms,
			c.avg_scroll_pct,
			c.bounce_rate,
			c.views_24h_percentile,
			c.views_7d_percentile,
			c.views_30d_percentile,
			c.benchmark_score,
			c.benchmark_sample_size,
			c.benchmark_basis,
			c.performance_band,
			c.release_stage,
			c.growth_slope_7d,
			c.decay_rate_after_spike
		FROM private.content_release_performance_cache c
		ORDER BY c.published_at DESC, c.id DESC
		LIMIT LEAST(GREATEST(COALESCE(p_limit, 50), 1), 200);
		RETURN;
	END IF;

	RETURN QUERY
	SELECT *
	FROM private.get_content_release_performance(p_from_date, p_to_date, p_limit);
END;
$$;

REVOKE ALL ON FUNCTION public.get_content_release_performance(DATE, DATE, INTEGER)
	FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_content_release_performance(DATE, DATE, INTEGER)
	TO authenticated, service_role;

-- Seed the cache before exposing the scheduled refresh.
SELECT private.refresh_content_release_performance_cache();

DO $jobs$
BEGIN
	IF to_regnamespace('cron') IS NULL THEN
		RAISE NOTICE 'pg_cron is unavailable; release-performance cache refresh was not scheduled';
		RETURN;
	END IF;

	IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = '9takes-release-performance-refresh') THEN
		PERFORM cron.unschedule('9takes-release-performance-refresh');
	END IF;

	PERFORM cron.schedule(
		'9takes-release-performance-refresh',
		'25 * * * *',
		'SELECT private.refresh_content_release_performance_cache();'
	);
END;
$jobs$;
