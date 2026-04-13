-- supabase/migrations/20260412_z_content_analytics_daily_rollups.sql
-- Created: 2026-04-12
-- Adds durable daily content analytics rollups before raw page visits age out.

CREATE TABLE IF NOT EXISTS public.content_analytics_daily (
	id BIGSERIAL PRIMARY KEY,
	metric_date DATE NOT NULL,
	content_type TEXT NOT NULL,
	content_slug TEXT NOT NULL,
	path TEXT NOT NULL,
	path_group TEXT NOT NULL DEFAULT '/',
	published_at TIMESTAMPTZ NULL,
	days_since_publish INTEGER NULL,
	visits BIGINT NOT NULL DEFAULT 0,
	unique_visitors BIGINT NOT NULL DEFAULT 0,
	authenticated_visits BIGINT NOT NULL DEFAULT 0,
	anonymous_visits BIGINT NOT NULL DEFAULT 0,
	engaged_ms_total BIGINT NOT NULL DEFAULT 0,
	avg_engaged_ms INTEGER NOT NULL DEFAULT 0,
	median_engaged_ms INTEGER NOT NULL DEFAULT 0,
	bounce_visits BIGINT NOT NULL DEFAULT 0,
	bounce_rate NUMERIC NOT NULL DEFAULT 0,
	avg_scroll_pct INTEGER NOT NULL DEFAULT 0,
	first_view_at TIMESTAMPTZ NULL,
	last_view_at TIMESTAMPTZ NULL,
	source_breakdown JSONB NOT NULL DEFAULT '{}'::JSONB,
	referrer_breakdown JSONB NOT NULL DEFAULT '{}'::JSONB,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE (metric_date, content_type, content_slug)
);

CREATE INDEX IF NOT EXISTS idx_content_analytics_daily_content_date
	ON public.content_analytics_daily (content_type, content_slug, metric_date DESC);

CREATE INDEX IF NOT EXISTS idx_content_analytics_daily_metric_date
	ON public.content_analytics_daily (metric_date DESC);

CREATE INDEX IF NOT EXISTS idx_content_analytics_daily_publish_age
	ON public.content_analytics_daily (content_type, days_since_publish, metric_date DESC)
	WHERE days_since_publish IS NOT NULL;

DROP TRIGGER IF EXISTS trg_content_analytics_daily_updated_at
	ON public.content_analytics_daily;
CREATE TRIGGER trg_content_analytics_daily_updated_at
	BEFORE UPDATE ON public.content_analytics_daily
	FOR EACH ROW
	EXECUTE FUNCTION public.set_page_analytics_updated_at();

CREATE OR REPLACE FUNCTION public.refresh_content_analytics_daily(
	p_from DATE DEFAULT NULL,
	p_to DATE DEFAULT NULL,
	p_content_type TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_to DATE := COALESCE(p_to, public.analytics_local_date(NOW()));
	v_from DATE := COALESCE(p_from, COALESCE(p_to, public.analytics_local_date(NOW())) - 44);
	v_rows INTEGER := 0;
BEGIN
	IF v_from > v_to THEN
		RETURN 0;
	END IF;

	WITH bounds AS (
		SELECT
			(v_from::TIMESTAMP AT TIME ZONE 'America/New_York') AS from_ts,
			((v_to + 1)::TIMESTAMP AT TIME ZONE 'America/New_York') AS to_ts
	),
	people_publications AS (
		SELECT
			public.analytics_normalize_content_slug(b.person) AS content_slug,
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
	raw_visits AS (
		SELECT
			public.analytics_local_date(v.started_at) AS metric_date,
			COALESCE(NULLIF(BTRIM(v.content_type), ''), 'other') AS content_type,
			public.analytics_normalize_content_slug(v.content_slug) AS content_slug,
			v.path,
			COALESCE(NULLIF(BTRIM(v.path_group), ''), '/') AS path_group,
			v.fingerprint,
			v.user_id,
			v.engaged_ms,
			v.max_scroll_pct,
			v.started_at,
			COALESCE(NULLIF(BTRIM(v.acquisition_source), ''), 'unknown') AS acquisition_source,
			COALESCE(NULLIF(BTRIM(v.referrer_host), ''), 'direct') AS referrer_host
		FROM public.page_analytics_visits v
		CROSS JOIN bounds b
		WHERE v.started_at >= b.from_ts
			AND v.started_at < b.to_ts
			AND v.content_slug IS NOT NULL
			AND COALESCE(NULLIF(BTRIM(v.content_slug), ''), '') <> ''
			AND NOT public.is_analytics_utility_path(v.path)
			AND (
				p_content_type IS NULL
				OR COALESCE(NULLIF(BTRIM(v.content_type), ''), 'other') = p_content_type
			)
	),
	grouped AS (
		SELECT
			r.metric_date,
			r.content_type,
			r.content_slug,
			(ARRAY_AGG(r.path ORDER BY r.started_at DESC, r.path))[1] AS path,
			(ARRAY_AGG(r.path_group ORDER BY r.started_at DESC, r.path_group))[1] AS path_group,
			COUNT(*)::BIGINT AS visits,
			COUNT(DISTINCT r.fingerprint)::BIGINT AS unique_visitors,
			COUNT(*) FILTER (WHERE r.user_id IS NOT NULL)::BIGINT AS authenticated_visits,
			COUNT(*) FILTER (WHERE r.user_id IS NULL)::BIGINT AS anonymous_visits,
			COALESCE(SUM(r.engaged_ms), 0)::BIGINT AS engaged_ms_total,
			COALESCE(ROUND(AVG(r.engaged_ms))::INTEGER, 0) AS avg_engaged_ms,
			COALESCE(
				PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY r.engaged_ms)::INTEGER,
				0
			) AS median_engaged_ms,
			COUNT(*) FILTER (WHERE r.engaged_ms < 10000)::BIGINT AS bounce_visits,
			CASE
				WHEN COUNT(*) > 0
				THEN ROUND(
					(COUNT(*) FILTER (WHERE r.engaged_ms < 10000))::NUMERIC
						/ COUNT(*)::NUMERIC
						* 100,
					2
				)
				ELSE 0
			END AS bounce_rate,
			COALESCE(ROUND(AVG(r.max_scroll_pct))::INTEGER, 0) AS avg_scroll_pct,
			MIN(r.started_at) AS first_view_at,
			MAX(r.started_at) AS last_view_at
		FROM raw_visits r
		GROUP BY r.metric_date, r.content_type, r.content_slug
	),
	source_counts AS (
		SELECT
			r.metric_date,
			r.content_type,
			r.content_slug,
			r.acquisition_source,
			COUNT(*)::BIGINT AS visits
		FROM raw_visits r
		GROUP BY r.metric_date, r.content_type, r.content_slug, r.acquisition_source
	),
	source_breakdowns AS (
		SELECT
			s.metric_date,
			s.content_type,
			s.content_slug,
			JSONB_OBJECT_AGG(s.acquisition_source, s.visits ORDER BY s.visits DESC, s.acquisition_source)
				AS source_breakdown
		FROM source_counts s
		GROUP BY s.metric_date, s.content_type, s.content_slug
	),
	referrer_counts AS (
		SELECT
			r.metric_date,
			r.content_type,
			r.content_slug,
			r.referrer_host,
			COUNT(*)::BIGINT AS visits
		FROM raw_visits r
		GROUP BY r.metric_date, r.content_type, r.content_slug, r.referrer_host
	),
	referrer_breakdowns AS (
		SELECT
			rc.metric_date,
			rc.content_type,
			rc.content_slug,
			JSONB_OBJECT_AGG(rc.referrer_host, rc.visits ORDER BY rc.visits DESC, rc.referrer_host)
				AS referrer_breakdown
		FROM referrer_counts rc
		GROUP BY rc.metric_date, rc.content_type, rc.content_slug
	),
	rollup_rows AS (
		SELECT
			g.metric_date,
			g.content_type,
			g.content_slug,
			g.path,
			g.path_group,
			pp.published_at,
			CASE
				WHEN pp.published_at IS NULL THEN NULL
				ELSE g.metric_date - public.analytics_local_date(pp.published_at)
			END AS days_since_publish,
			g.visits,
			g.unique_visitors,
			g.authenticated_visits,
			g.anonymous_visits,
			g.engaged_ms_total,
			g.avg_engaged_ms,
			g.median_engaged_ms,
			g.bounce_visits,
			g.bounce_rate,
			g.avg_scroll_pct,
			g.first_view_at,
			g.last_view_at,
			COALESCE(sb.source_breakdown, '{}'::JSONB) AS source_breakdown,
			COALESCE(rb.referrer_breakdown, '{}'::JSONB) AS referrer_breakdown
		FROM grouped g
		LEFT JOIN people_publications pp
			ON g.content_type = 'people'
			AND pp.content_slug = g.content_slug
		LEFT JOIN source_breakdowns sb
			ON sb.metric_date = g.metric_date
			AND sb.content_type = g.content_type
			AND sb.content_slug = g.content_slug
		LEFT JOIN referrer_breakdowns rb
			ON rb.metric_date = g.metric_date
			AND rb.content_type = g.content_type
			AND rb.content_slug = g.content_slug
	)
	INSERT INTO public.content_analytics_daily (
		metric_date,
		content_type,
		content_slug,
		path,
		path_group,
		published_at,
		days_since_publish,
		visits,
		unique_visitors,
		authenticated_visits,
		anonymous_visits,
		engaged_ms_total,
		avg_engaged_ms,
		median_engaged_ms,
		bounce_visits,
		bounce_rate,
		avg_scroll_pct,
		first_view_at,
		last_view_at,
		source_breakdown,
		referrer_breakdown
	)
	SELECT
		metric_date,
		content_type,
		content_slug,
		path,
		path_group,
		published_at,
		days_since_publish,
		visits,
		unique_visitors,
		authenticated_visits,
		anonymous_visits,
		engaged_ms_total,
		avg_engaged_ms,
		median_engaged_ms,
		bounce_visits,
		bounce_rate,
		avg_scroll_pct,
		first_view_at,
		last_view_at,
		source_breakdown,
		referrer_breakdown
	FROM rollup_rows
	ON CONFLICT (metric_date, content_type, content_slug)
	DO UPDATE SET
		path = EXCLUDED.path,
		path_group = EXCLUDED.path_group,
		published_at = EXCLUDED.published_at,
		days_since_publish = EXCLUDED.days_since_publish,
		visits = EXCLUDED.visits,
		unique_visitors = EXCLUDED.unique_visitors,
		authenticated_visits = EXCLUDED.authenticated_visits,
		anonymous_visits = EXCLUDED.anonymous_visits,
		engaged_ms_total = EXCLUDED.engaged_ms_total,
		avg_engaged_ms = EXCLUDED.avg_engaged_ms,
		median_engaged_ms = EXCLUDED.median_engaged_ms,
		bounce_visits = EXCLUDED.bounce_visits,
		bounce_rate = EXCLUDED.bounce_rate,
		avg_scroll_pct = EXCLUDED.avg_scroll_pct,
		first_view_at = EXCLUDED.first_view_at,
		last_view_at = EXCLUDED.last_view_at,
		source_breakdown = EXCLUDED.source_breakdown,
		referrer_breakdown = EXCLUDED.referrer_breakdown,
		updated_at = NOW();

	GET DIAGNOSTICS v_rows = ROW_COUNT;
	RETURN v_rows;
END;
$$;

CREATE OR REPLACE FUNCTION public.cleanup_site_telemetry(
	p_now TIMESTAMPTZ DEFAULT NOW()
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_now TIMESTAMPTZ := COALESCE(p_now, NOW());
	v_page_cutoff TIMESTAMPTZ := v_now - INTERVAL '90 days';
	v_access_cutoff TIMESTAMPTZ := v_now - INTERVAL '7 days';
	v_visitors_cutoff TIMESTAMPTZ := v_now - INTERVAL '45 days';
	v_content_rollup_rows INTEGER := 0;
	v_deleted_page_visits INTEGER := 0;
	v_deleted_page_sessions INTEGER := 0;
	v_deleted_access_events INTEGER := 0;
	v_deleted_visitors INTEGER := 0;
BEGIN
	BEGIN
		SELECT public.refresh_content_analytics_daily(
			public.analytics_local_date(v_page_cutoff - INTERVAL '2 days'),
			public.analytics_local_date(v_now),
			NULL
		)
		INTO v_content_rollup_rows;
	EXCEPTION WHEN OTHERS THEN
		RETURN jsonb_build_object(
			'cleanup_skipped', TRUE,
			'content_analytics_daily_error', SQLERRM,
			'ran_at', v_now
		);
	END;

	DELETE FROM public.page_analytics_visits
	WHERE started_at < v_page_cutoff;
	GET DIAGNOSTICS v_deleted_page_visits = ROW_COUNT;

	DELETE FROM public.page_analytics_sessions s
	WHERE COALESCE(s.last_seen_at, s.started_at, s.created_at) < v_page_cutoff
		AND NOT EXISTS (
			SELECT 1
			FROM public.page_analytics_visits v
			WHERE v.session_id = s.id
		);
	GET DIAGNOSTICS v_deleted_page_sessions = ROW_COUNT;

	DELETE FROM public.content_access_events
	WHERE requested_at < v_access_cutoff;
	GET DIAGNOSTICS v_deleted_access_events = ROW_COUNT;

	DELETE FROM public.visitors v
	WHERE COALESCE(v.updated_at, v.created_at) < v_visitors_cutoff
		AND NOT EXISTS (
			SELECT 1
			FROM public.blog_comments bc
			WHERE bc.fingerprint = v.fingerprint
		);
	GET DIAGNOSTICS v_deleted_visitors = ROW_COUNT;

	RETURN jsonb_build_object(
		'content_analytics_daily_refreshed', v_content_rollup_rows,
		'page_analytics_visits_deleted', v_deleted_page_visits,
		'page_analytics_sessions_deleted', v_deleted_page_sessions,
		'content_access_events_deleted', v_deleted_access_events,
		'visitors_deleted', v_deleted_visitors,
		'ran_at', v_now
	);
END;
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
		'content_daily_rollup_refresh',
		v_now,
		INTERVAL '12 hours'
	) THEN
		BEGIN
			PERFORM public.refresh_content_analytics_daily(
				public.analytics_local_date(v_now - INTERVAL '45 days'),
				public.analytics_local_date(v_now),
				NULL
			);
		EXCEPTION WHEN OTHERS THEN
			RAISE WARNING 'content_daily_rollup_refresh failed: %', SQLERRM;
		END;
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
	filtered_releases AS (
		SELECT *
		FROM releases r
		WHERE r.published_at IS NOT NULL
			AND (p_from_date IS NULL OR public.analytics_local_date(r.published_at) >= p_from_date)
			AND (p_to_date IS NULL OR public.analytics_local_date(r.published_at) <= p_to_date)
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
		FROM filtered_releases r
		INNER JOIN public.content_analytics_daily cad
			ON cad.content_type = 'people'
			AND cad.content_slug = r.slug
			AND cad.days_since_publish >= 0
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
		FROM filtered_releases r
		INNER JOIN public.page_analytics_visits v
			ON v.content_type = 'people'
			AND v.content_slug IS NOT NULL
			AND LOWER(v.content_slug) = r.slug
			AND v.started_at >= r.published_at
			AND NOT public.is_analytics_utility_path(v.path)
		WHERE NOT EXISTS (
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
		FROM filtered_releases r
		LEFT JOIN public.page_analytics_visits v
			ON v.content_type = 'people'
			AND v.content_slug IS NOT NULL
			AND LOWER(v.content_slug) = r.slug
			AND v.started_at >= r.published_at
			AND NOT public.is_analytics_utility_path(v.path)
		GROUP BY r.id
	),
	agg AS (
		SELECT
			r.id,
			r.slug,
			r.path,
			r.title,
			r.published_at,
			COALESCE(re.first_view_at, da.first_view_at) AS first_view_at,
			COALESCE(re.views_1h, 0)::BIGINT AS views_1h,
			COALESCE(re.views_6h, 0)::BIGINT AS views_6h,
			CASE
				WHEN re.first_view_at IS NOT NULL THEN COALESCE(re.views_24h, 0)
				ELSE COALESCE(da.views_24h, 0)
			END::BIGINT AS views_24h,
			CASE
				WHEN re.first_view_at IS NOT NULL THEN COALESCE(re.unique_24h, 0)
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
			COALESCE(da.bounce_rate, 0) AS bounce_rate
		FROM filtered_releases r
		LEFT JOIN daily_agg da ON da.id = r.id
		LEFT JOIN raw_exact re ON re.id = r.id
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
	rollup_daily AS (
		SELECT
			cad.days_since_publish AS day_number,
			cad.metric_date AS day_date,
			cad.visits,
			cad.unique_visitors
		FROM release r
		INNER JOIN public.content_analytics_daily cad
			ON cad.content_type = 'people'
			AND cad.content_slug = r.slug
			AND cad.days_since_publish BETWEEN 0
				AND LEAST(GREATEST(COALESCE(p_days, 30), 0), 90)
	),
	raw_daily_missing AS (
		SELECT
			(
				public.analytics_local_date(v.started_at)
				- public.analytics_local_date(r.published_at)
			)::INTEGER AS day_number,
			public.analytics_local_date(v.started_at) AS day_date,
			COUNT(v.id)::BIGINT AS visits,
			COUNT(DISTINCT v.fingerprint)::BIGINT AS unique_visitors
		FROM release r
		INNER JOIN public.page_analytics_visits v
			ON v.content_type = 'people'
			AND v.content_slug IS NOT NULL
			AND LOWER(v.content_slug) = r.slug
			AND v.started_at >= r.published_at
			AND NOT public.is_analytics_utility_path(v.path)
		WHERE NOT EXISTS (
				SELECT 1
				FROM public.content_analytics_daily cad
				WHERE cad.metric_date = public.analytics_local_date(v.started_at)
					AND cad.content_type = 'people'
					AND cad.content_slug = r.slug
			)
		GROUP BY
			public.analytics_local_date(v.started_at),
			public.analytics_local_date(v.started_at)
				- public.analytics_local_date(r.published_at)
	),
	daily_union AS (
		SELECT * FROM rollup_daily
		UNION ALL
		SELECT * FROM raw_daily_missing
	),
	daily AS (
		SELECT
			d.day_number,
			public.analytics_local_date(r.published_at + d.day_number * INTERVAL '1 day') AS day_date,
			COALESCE(SUM(du.visits), 0)::BIGINT AS visits,
			COALESCE(SUM(du.unique_visitors), 0)::BIGINT AS unique_visitors
		FROM release r
		CROSS JOIN days d
		LEFT JOIN daily_union du ON du.day_number = d.day_number
		WHERE r.published_at IS NOT NULL
		GROUP BY d.day_number, r.published_at
	)
	SELECT
		d.day_number,
		d.day_date,
		d.visits,
		d.unique_visitors,
		SUM(d.visits) OVER (ORDER BY d.day_number)::BIGINT AS cumulative_visits,
		SUM(d.unique_visitors) OVER (ORDER BY d.day_number)::BIGINT AS cumulative_unique_visitors
	FROM daily d
	ORDER BY d.day_number;
$$;

SELECT public.refresh_content_analytics_daily(
	DATE '2026-02-20',
	public.analytics_local_date(NOW()),
	NULL
);

GRANT SELECT ON public.content_analytics_daily TO authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_content_analytics_daily(DATE, DATE, TEXT)
	TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_content_release_performance(DATE, DATE, INTEGER)
	TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_content_release_growth_curve(TEXT, INTEGER)
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
