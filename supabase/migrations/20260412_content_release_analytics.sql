-- supabase/migrations/20260412_content_release_analytics.sql
-- Created: 2026-04-12
-- Adds content release metadata and release/timing analytics RPCs.

ALTER TABLE public.blogs_famous_people
	ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ NULL,
	ADD COLUMN IF NOT EXISTS first_published_at TIMESTAMPTZ NULL;

WITH publish_backfill AS (
	SELECT
		id,
		COALESCE(
			published_at,
			first_published_at,
			created_at,
			CASE
				WHEN date::TEXT ~ '^\d{4}-\d{2}-\d{2}$'
				THEN ((date::DATE + TIME '12:00') AT TIME ZONE 'America/New_York')
				ELSE NULL
			END
		) AS effective_published_at
	FROM public.blogs_famous_people
	WHERE published IS TRUE
)
UPDATE public.blogs_famous_people b
SET
	published_at = COALESCE(b.published_at, p.effective_published_at),
	first_published_at = COALESCE(b.first_published_at, b.published_at, p.effective_published_at)
FROM publish_backfill p
WHERE b.id = p.id
	AND p.effective_published_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_blogs_famous_people_published_at
	ON public.blogs_famous_people (published_at DESC)
	WHERE published IS TRUE;

CREATE INDEX IF NOT EXISTS idx_blogs_famous_people_first_published_at
	ON public.blogs_famous_people (first_published_at DESC)
	WHERE published IS TRUE;

ALTER TABLE public.page_analytics_visits
	ADD COLUMN IF NOT EXISTS landing_query TEXT NULL,
	ADD COLUMN IF NOT EXISTS utm_source TEXT NULL,
	ADD COLUMN IF NOT EXISTS utm_medium TEXT NULL,
	ADD COLUMN IF NOT EXISTS utm_campaign TEXT NULL,
	ADD COLUMN IF NOT EXISTS utm_term TEXT NULL,
	ADD COLUMN IF NOT EXISTS utm_content TEXT NULL,
	ADD COLUMN IF NOT EXISTS click_id_type TEXT NULL,
	ADD COLUMN IF NOT EXISTS click_id_value TEXT NULL,
	ADD COLUMN IF NOT EXISTS acquisition_source TEXT NULL;

CREATE INDEX IF NOT EXISTS idx_page_visits_content_slug_started_at
	ON public.page_analytics_visits (content_type, LOWER(content_slug), started_at DESC)
	WHERE content_slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_page_visits_acquisition_started_at
	ON public.page_analytics_visits (acquisition_source, started_at DESC)
	WHERE acquisition_source IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.content_release_events (
	id BIGSERIAL PRIMARY KEY,
	content_type TEXT NOT NULL,
	content_slug TEXT NOT NULL,
	path TEXT NULL,
	event_type TEXT NOT NULL,
	event_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	source TEXT NULL,
	metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_release_events_content_event_at
	ON public.content_release_events (content_type, content_slug, event_at DESC);

CREATE INDEX IF NOT EXISTS idx_content_release_events_event_type_at
	ON public.content_release_events (event_type, event_at DESC);

CREATE OR REPLACE FUNCTION public.analytics_normalize_content_slug(p_slug TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
	SELECT LOWER(REGEXP_REPLACE(COALESCE(NULLIF(BTRIM(p_slug), ''), ''), '\s+', '-', 'g'));
$$;

CREATE OR REPLACE FUNCTION public.get_page_analytics_timing_heatmap(
	p_from_date DATE DEFAULT NULL,
	p_to_date DATE DEFAULT NULL,
	p_scope TEXT DEFAULT 'all'
)
RETURNS TABLE(
	local_dow INTEGER,
	local_hour INTEGER,
	visits BIGINT,
	unique_visitors BIGINT,
	avg_time_on_page_ms INTEGER
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
	WITH params AS (
		SELECT COALESCE(p_to_date, public.analytics_local_date(NOW())) AS to_date
	),
	bounds AS (
		SELECT
			((COALESCE(p_from_date, params.to_date - 29)::TIMESTAMP) AT TIME ZONE 'America/New_York') AS from_ts,
			(((params.to_date + 1)::TIMESTAMP) AT TIME ZONE 'America/New_York') AS to_ts
		FROM params
	),
	filtered AS (
		SELECT
			v.*,
			timezone('America/New_York', v.started_at) AS local_started_at
		FROM public.page_analytics_visits v
		CROSS JOIN bounds b
		WHERE v.started_at >= b.from_ts
			AND v.started_at < b.to_ts
			AND NOT public.is_analytics_utility_path(v.path)
			AND public.analytics_scope_match(p_scope, v.path, v.content_type)
	)
	SELECT
		EXTRACT(DOW FROM local_started_at)::INTEGER AS local_dow,
		EXTRACT(HOUR FROM local_started_at)::INTEGER AS local_hour,
		COUNT(*)::BIGINT AS visits,
		COUNT(DISTINCT fingerprint)::BIGINT AS unique_visitors,
		COALESCE(ROUND(AVG(engaged_ms))::INTEGER, 0) AS avg_time_on_page_ms
	FROM filtered
	GROUP BY 1, 2
	ORDER BY 1, 2;
$$;

DROP FUNCTION IF EXISTS public.upsert_page_analytics_visit(
	UUID,
	TEXT,
	TEXT,
	UUID,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT
);

CREATE OR REPLACE FUNCTION public.upsert_page_analytics_visit(
	p_visit_key UUID,
	p_session_key TEXT,
	p_fingerprint TEXT,
	p_user_id UUID DEFAULT NULL,
	p_path TEXT DEFAULT '/',
	p_route_id TEXT DEFAULT NULL,
	p_path_group TEXT DEFAULT '/',
	p_content_type TEXT DEFAULT NULL,
	p_content_slug TEXT DEFAULT NULL,
	p_referrer_host TEXT DEFAULT NULL,
	p_landing_query TEXT DEFAULT NULL,
	p_utm_source TEXT DEFAULT NULL,
	p_utm_medium TEXT DEFAULT NULL,
	p_utm_campaign TEXT DEFAULT NULL,
	p_utm_term TEXT DEFAULT NULL,
	p_utm_content TEXT DEFAULT NULL,
	p_click_id_type TEXT DEFAULT NULL,
	p_click_id_value TEXT DEFAULT NULL
)
RETURNS TABLE(session_id UUID, visit_id BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_session_id UUID;
	v_visit_id BIGINT;
	v_now TIMESTAMPTZ := NOW();
	v_acquisition_source TEXT := public.normalize_acquisition_source(
		p_referrer_host,
		p_utm_source,
		p_utm_medium,
		p_click_id_type
	);
BEGIN
	IF p_visit_key IS NULL OR p_session_key IS NULL OR p_fingerprint IS NULL OR p_path IS NULL THEN
		RETURN;
	END IF;

	INSERT INTO public.page_analytics_sessions (
		session_key,
		fingerprint,
		user_id,
		entry_path,
		last_seen_at
	) VALUES (
		p_session_key,
		p_fingerprint,
		p_user_id,
		p_path,
		v_now
	)
	ON CONFLICT (session_key)
	DO UPDATE SET
		fingerprint = EXCLUDED.fingerprint,
		user_id = COALESCE(public.page_analytics_sessions.user_id, EXCLUDED.user_id),
		last_seen_at = v_now,
		ended_at = NULL
	RETURNING id INTO v_session_id;

	UPDATE public.page_analytics_sessions
	SET entry_path = p_path
	WHERE id = v_session_id
		AND entry_path IS NULL;

	INSERT INTO public.page_analytics_visits (
		visit_key,
		session_id,
		fingerprint,
		user_id,
		path,
		route_id,
		path_group,
		content_type,
		content_slug,
		referrer_host,
		started_at,
		landing_query,
		utm_source,
		utm_medium,
		utm_campaign,
		utm_term,
		utm_content,
		click_id_type,
		click_id_value,
		acquisition_source
	) VALUES (
		p_visit_key,
		v_session_id,
		p_fingerprint,
		p_user_id,
		p_path,
		p_route_id,
		p_path_group,
		p_content_type,
		p_content_slug,
		p_referrer_host,
		v_now,
		NULLIF(BTRIM(p_landing_query), ''),
		NULLIF(BTRIM(p_utm_source), ''),
		NULLIF(BTRIM(p_utm_medium), ''),
		NULLIF(BTRIM(p_utm_campaign), ''),
		NULLIF(BTRIM(p_utm_term), ''),
		NULLIF(BTRIM(p_utm_content), ''),
		NULLIF(BTRIM(p_click_id_type), ''),
		NULLIF(BTRIM(p_click_id_value), ''),
		v_acquisition_source
	)
	ON CONFLICT (visit_key) DO NOTHING
	RETURNING id INTO v_visit_id;

	IF v_visit_id IS NULL THEN
		SELECT id INTO v_visit_id
		FROM public.page_analytics_visits
		WHERE visit_key = p_visit_key
		LIMIT 1;
	ELSE
		UPDATE public.page_analytics_sessions
		SET page_count = page_count + 1,
			last_seen_at = v_now
		WHERE id = v_session_id;

		PERFORM public.record_visitor_first_touch(
			p_fingerprint,
			p_path,
			p_path_group,
			p_content_type,
			p_content_slug,
			p_referrer_host,
			p_landing_query,
			p_utm_source,
			p_utm_medium,
			p_utm_campaign,
			p_utm_term,
			p_utm_content,
			p_click_id_type,
			p_click_id_value,
			v_now
		);
	END IF;

	IF public.claim_telemetry_cleanup_slot(
		'site_telemetry_cleanup',
		v_now,
		INTERVAL '6 hours'
	) THEN
		PERFORM public.cleanup_site_telemetry(v_now);
	END IF;

	IF public.claim_telemetry_cleanup_slot(
		'retention_rollup_refresh',
		v_now,
		INTERVAL '12 hours'
	) THEN
		PERFORM public.refresh_retention_rollups(
			public.analytics_local_date(v_now - INTERVAL '45 days'),
			public.analytics_local_date(v_now)
		);
	END IF;

	RETURN QUERY SELECT v_session_id, v_visit_id;
END;
$$;

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
	views_7d_percentile NUMERIC,
	performance_band TEXT,
	release_stage TEXT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
	WITH releases AS (
		SELECT
			b.id::BIGINT AS id,
			public.analytics_normalize_content_slug(b.person) AS slug,
			('/personality-analysis/' || public.analytics_normalize_content_slug(b.person)) AS path,
			COALESCE(NULLIF(BTRIM(b.title), ''), b.person, '') AS title,
			COALESCE(
				b.published_at,
				b.first_published_at,
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
	filtered_releases AS (
		SELECT *
		FROM releases r
		WHERE r.published_at IS NOT NULL
			AND (p_from_date IS NULL OR public.analytics_local_date(r.published_at) >= p_from_date)
			AND (p_to_date IS NULL OR public.analytics_local_date(r.published_at) <= p_to_date)
	),
	agg AS (
		SELECT
			r.id,
			r.slug,
			r.path,
			r.title,
			r.published_at,
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
			)::BIGINT AS unique_24h,
			COUNT(v.id) FILTER (
				WHERE v.started_at < r.published_at + INTERVAL '7 days'
			)::BIGINT AS views_7d,
			COUNT(DISTINCT v.fingerprint) FILTER (
				WHERE v.started_at < r.published_at + INTERVAL '7 days'
			)::BIGINT AS unique_7d,
			COUNT(v.id) FILTER (
				WHERE v.started_at < r.published_at + INTERVAL '30 days'
			)::BIGINT AS views_30d,
			COUNT(DISTINCT v.fingerprint) FILTER (
				WHERE v.started_at < r.published_at + INTERVAL '30 days'
			)::BIGINT AS unique_30d,
			COUNT(v.id)::BIGINT AS total_views,
			COUNT(DISTINCT v.fingerprint)::BIGINT AS total_unique_visitors,
			COALESCE(ROUND(AVG(v.engaged_ms))::INTEGER, 0) AS avg_time_on_page_ms,
			COALESCE(
				(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY v.engaged_ms)
					FILTER (WHERE v.id IS NOT NULL))::INTEGER,
				0
			) AS median_time_on_page_ms,
			COALESCE(ROUND(AVG(v.max_scroll_pct))::INTEGER, 0) AS avg_scroll_pct,
			CASE
				WHEN COUNT(v.id) > 0
				THEN ROUND(
					(COUNT(v.id) FILTER (WHERE v.engaged_ms < 10000))::NUMERIC
						/ COUNT(v.id)::NUMERIC
						* 100,
					2
				)
				ELSE 0
			END AS bounce_rate
		FROM filtered_releases r
		LEFT JOIN public.page_analytics_visits v
			ON v.content_type = 'people'
			AND v.content_slug IS NOT NULL
			AND LOWER(v.content_slug) = r.slug
			AND v.started_at >= r.published_at
			AND NOT public.is_analytics_utility_path(v.path)
		GROUP BY r.id, r.slug, r.path, r.title, r.published_at
	),
	benchmarks AS (
		SELECT
			COUNT(*) FILTER (WHERE published_at <= NOW() - INTERVAL '7 days') AS mature_7d_count,
			PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY views_7d)
				FILTER (WHERE published_at <= NOW() - INTERVAL '7 days') AS p25_7d,
			PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY views_7d)
				FILTER (WHERE published_at <= NOW() - INTERVAL '7 days') AS p75_7d
		FROM agg
	),
	scored AS (
		SELECT
			a.*,
			CASE
				WHEN a.published_at > NOW() - INTERVAL '7 days' THEN NULL
				ELSE ROUND(
					(
						SELECT COUNT(*)::NUMERIC
						FROM agg x
						WHERE x.published_at <= NOW() - INTERVAL '7 days'
							AND x.views_7d <= a.views_7d
					)
					/ NULLIF(
						(
							SELECT COUNT(*)::NUMERIC
							FROM agg x
							WHERE x.published_at <= NOW() - INTERVAL '7 days'
						),
						0
					)
					* 100,
					2
				)
			END AS views_7d_percentile,
			CASE
				WHEN a.published_at > NOW() - INTERVAL '24 hours' THEN 'first_day'
				WHEN a.published_at > NOW() - INTERVAL '7 days' THEN 'first_week'
				WHEN a.published_at > NOW() - INTERVAL '30 days' THEN 'first_month'
				ELSE 'mature'
			END AS release_stage,
			CASE
				WHEN a.published_at > NOW() - INTERVAL '7 days' THEN 'collecting'
				WHEN b.mature_7d_count < 4 THEN 'insufficient_history'
				WHEN b.p75_7d IS NOT NULL AND a.views_7d >= b.p75_7d THEN 'above_norm'
				WHEN b.p25_7d IS NOT NULL AND a.views_7d <= b.p25_7d THEN 'below_norm'
				ELSE 'near_norm'
			END AS performance_band
		FROM agg a
		CROSS JOIN benchmarks b
	)
	SELECT
		s.id,
		s.slug,
		s.path,
		s.title,
		s.published_at,
		s.first_view_at,
		CASE
			WHEN s.first_view_at IS NULL THEN NULL
			ELSE FLOOR(EXTRACT(EPOCH FROM (s.first_view_at - s.published_at)) / 60)::INTEGER
		END AS minutes_to_first_view,
		s.views_1h,
		s.views_6h,
		s.views_24h,
		s.unique_24h,
		s.views_7d,
		s.unique_7d,
		s.views_30d,
		s.unique_30d,
		s.total_views,
		s.total_unique_visitors,
		s.avg_time_on_page_ms,
		s.median_time_on_page_ms,
		s.avg_scroll_pct,
		s.bounce_rate,
		s.views_7d_percentile,
		s.performance_band,
		s.release_stage
	FROM scored s
	ORDER BY s.published_at DESC, s.id DESC
	LIMIT LEAST(GREATEST(COALESCE(p_limit, 50), 1), 200);
$$;

CREATE OR REPLACE FUNCTION public.get_content_release_growth_curve(
	p_slug TEXT,
	p_days INTEGER DEFAULT 30
)
RETURNS TABLE(
	day_number INTEGER,
	day_date DATE,
	visits BIGINT,
	unique_visitors BIGINT,
	cumulative_visits BIGINT,
	cumulative_unique_visitors BIGINT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
	WITH release AS (
		SELECT
			public.analytics_normalize_content_slug(b.person) AS slug,
			COALESCE(
				b.published_at,
				b.first_published_at,
				b.created_at,
				CASE
					WHEN b.date::TEXT ~ '^\d{4}-\d{2}-\d{2}$'
					THEN ((b.date::DATE + TIME '12:00') AT TIME ZONE 'America/New_York')
					ELSE NULL
				END
			) AS published_at
		FROM public.blogs_famous_people b
		WHERE b.published IS TRUE
			AND public.analytics_normalize_content_slug(b.person)
				= public.analytics_normalize_content_slug(p_slug)
		LIMIT 1
	),
	days AS (
		SELECT generate_series(
			0,
			LEAST(GREATEST(COALESCE(p_days, 30), 0), 90)
		)::INTEGER AS day_number
	),
	daily AS (
		SELECT
			d.day_number,
			public.analytics_local_date(r.published_at + d.day_number * INTERVAL '1 day') AS day_date,
			COUNT(v.id)::BIGINT AS visits,
			COUNT(DISTINCT v.fingerprint)::BIGINT AS unique_visitors
		FROM release r
		CROSS JOIN days d
		LEFT JOIN public.page_analytics_visits v
			ON v.content_type = 'people'
			AND v.content_slug IS NOT NULL
			AND LOWER(v.content_slug) = r.slug
			AND v.started_at >= r.published_at + d.day_number * INTERVAL '1 day'
			AND v.started_at < r.published_at + (d.day_number + 1) * INTERVAL '1 day'
			AND NOT public.is_analytics_utility_path(v.path)
		WHERE r.published_at IS NOT NULL
		GROUP BY d.day_number, r.published_at, r.slug
	)
	SELECT
		d.day_number,
		d.day_date,
		d.visits,
		d.unique_visitors,
		SUM(d.visits) OVER (ORDER BY d.day_number)::BIGINT AS cumulative_visits,
		(
			SELECT COUNT(DISTINCT v2.fingerprint)::BIGINT
			FROM release r2
			INNER JOIN public.page_analytics_visits v2
				ON v2.content_type = 'people'
				AND v2.content_slug IS NOT NULL
				AND LOWER(v2.content_slug) = r2.slug
				AND v2.started_at >= r2.published_at
				AND v2.started_at < r2.published_at + (d.day_number + 1) * INTERVAL '1 day'
				AND NOT public.is_analytics_utility_path(v2.path)
		) AS cumulative_unique_visitors
	FROM daily d
	ORDER BY d.day_number;
$$;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_timing_heatmap(DATE, DATE, TEXT)
	TO authenticated;
GRANT EXECUTE ON FUNCTION public.upsert_page_analytics_visit(
	UUID,
	TEXT,
	TEXT,
	UUID,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT
) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_content_release_performance(DATE, DATE, INTEGER)
	TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_content_release_growth_curve(TEXT, INTEGER)
	TO authenticated;

GRANT SELECT, INSERT ON public.content_release_events TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.content_release_events_id_seq TO authenticated;
