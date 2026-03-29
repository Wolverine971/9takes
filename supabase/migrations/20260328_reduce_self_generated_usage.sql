-- supabase/migrations/20260328_reduce_self_generated_usage.sql
-- Reduce self-generated Supabase usage from legacy visitors + telemetry churn.

CREATE TABLE IF NOT EXISTS public.telemetry_maintenance_state (
	task_name TEXT PRIMARY KEY,
	last_run_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- These fingerprint indexes are not used by the current analytics queries.
DROP INDEX IF EXISTS public.idx_page_visits_fingerprint_started_at;
DROP INDEX IF EXISTS public.idx_page_sessions_fingerprint_last_seen;

CREATE OR REPLACE FUNCTION public.claim_telemetry_cleanup_slot(
	p_task_name TEXT,
	p_now TIMESTAMPTZ DEFAULT NOW(),
	p_min_interval INTERVAL DEFAULT INTERVAL '6 hours'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_now TIMESTAMPTZ := COALESCE(p_now, NOW());
	v_claimed BOOLEAN := FALSE;
BEGIN
	IF COALESCE(BTRIM(p_task_name), '') = '' THEN
		RETURN FALSE;
	END IF;

	INSERT INTO public.telemetry_maintenance_state (task_name, last_run_at)
	VALUES (p_task_name, TIMESTAMPTZ '1970-01-01 00:00:00+00')
	ON CONFLICT (task_name) DO NOTHING;

	UPDATE public.telemetry_maintenance_state
	SET last_run_at = v_now
	WHERE task_name = p_task_name
		AND last_run_at <= v_now - COALESCE(p_min_interval, INTERVAL '6 hours')
	RETURNING TRUE INTO v_claimed;

	RETURN COALESCE(v_claimed, FALSE);
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
	v_page_cutoff TIMESTAMPTZ := v_now - INTERVAL '60 days';
	v_access_cutoff TIMESTAMPTZ := v_now - INTERVAL '7 days';
	v_visitors_cutoff TIMESTAMPTZ := v_now - INTERVAL '45 days';
	v_deleted_page_visits INTEGER := 0;
	v_deleted_page_sessions INTEGER := 0;
	v_deleted_access_events INTEGER := 0;
	v_deleted_visitors INTEGER := 0;
BEGIN
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
		'page_analytics_visits_deleted', v_deleted_page_visits,
		'page_analytics_sessions_deleted', v_deleted_page_sessions,
		'content_access_events_deleted', v_deleted_access_events,
		'visitors_deleted', v_deleted_visitors,
		'ran_at', v_now
	);
END;
$$;

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
	p_referrer_host TEXT DEFAULT NULL
)
RETURNS TABLE(session_id UUID, visit_id BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_session_id UUID;
	v_visit_id BIGINT;
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
		NOW()
	)
	ON CONFLICT (session_key)
	DO UPDATE SET
		fingerprint = EXCLUDED.fingerprint,
		user_id = COALESCE(public.page_analytics_sessions.user_id, EXCLUDED.user_id),
		last_seen_at = NOW(),
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
		referrer_host
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
		p_referrer_host
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
			last_seen_at = NOW()
		WHERE id = v_session_id;
	END IF;

	IF public.claim_telemetry_cleanup_slot(
		'site_telemetry_cleanup',
		NOW(),
		INTERVAL '6 hours'
	) THEN
		PERFORM public.cleanup_site_telemetry(NOW());
	END IF;

	RETURN QUERY SELECT v_session_id, v_visit_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_page_analytics_ping(
	p_visit_key UUID,
	p_engaged_ms_delta INTEGER DEFAULT 0,
	p_max_scroll_pct SMALLINT DEFAULT NULL,
	p_ended_at TIMESTAMPTZ DEFAULT NULL,
	p_is_exit BOOLEAN DEFAULT FALSE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_session_id UUID;
	v_path TEXT;
	v_now TIMESTAMPTZ := NOW();
	v_delta INTEGER := GREATEST(COALESCE(p_engaged_ms_delta, 0), 0);
	v_scroll SMALLINT := LEAST(100, GREATEST(0, COALESCE(p_max_scroll_pct, 0)));
BEGIN
	UPDATE public.page_analytics_visits
	SET engaged_ms = LEAST(1800000, engaged_ms + v_delta),
		max_scroll_pct = GREATEST(max_scroll_pct, v_scroll),
		ended_at = COALESCE(p_ended_at, ended_at),
		is_exit = is_exit OR COALESCE(p_is_exit, FALSE),
		updated_at = v_now
	WHERE visit_key = p_visit_key
	RETURNING session_id, path INTO v_session_id, v_path;

	IF v_session_id IS NULL THEN
		RETURN FALSE;
	END IF;

	UPDATE public.page_analytics_sessions
	SET last_seen_at = v_now,
		exit_path = CASE WHEN p_is_exit THEN v_path ELSE exit_path END,
		ended_at = CASE WHEN p_is_exit THEN COALESCE(p_ended_at, v_now) ELSE ended_at END,
		updated_at = v_now
	WHERE id = v_session_id
		AND (
			COALESCE(p_is_exit, FALSE)
			OR last_seen_at < v_now - INTERVAL '5 minutes'
		);

	RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_content_access_event(
	p_actor_key TEXT,
	p_actor_type TEXT,
	p_actor_name TEXT,
	p_path TEXT,
	p_request_kind TEXT DEFAULT 'page',
	p_requested_at TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE(
	total_10m INTEGER,
	unique_10m INTEGER,
	total_1h INTEGER,
	unique_1h INTEGER,
	total_24h INTEGER,
	unique_24h INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_requested_at TIMESTAMPTZ := COALESCE(p_requested_at, NOW());
BEGIN
	IF COALESCE(p_actor_key, '') = ''
		OR COALESCE(p_actor_type, '') = ''
		OR COALESCE(p_actor_name, '') = ''
		OR COALESCE(p_path, '') = '' THEN
		RETURN;
	END IF;

	INSERT INTO public.content_access_events (
		actor_key,
		actor_type,
		actor_name,
		path,
		request_kind,
		requested_at
	) VALUES (
		p_actor_key,
		p_actor_type,
		p_actor_name,
		p_path,
		CASE WHEN p_request_kind = 'data' THEN 'data' ELSE 'page' END,
		v_requested_at
	);

	IF public.claim_telemetry_cleanup_slot(
		'site_telemetry_cleanup',
		v_requested_at,
		INTERVAL '6 hours'
	) THEN
		PERFORM public.cleanup_site_telemetry(v_requested_at);
	END IF;

	RETURN QUERY
	SELECT
		COUNT(*) FILTER (
			WHERE requested_at >= v_requested_at - INTERVAL '10 minutes'
		)::INTEGER AS total_10m,
		COUNT(DISTINCT path) FILTER (
			WHERE requested_at >= v_requested_at - INTERVAL '10 minutes'
		)::INTEGER AS unique_10m,
		COUNT(*) FILTER (
			WHERE requested_at >= v_requested_at - INTERVAL '1 hour'
		)::INTEGER AS total_1h,
		COUNT(DISTINCT path) FILTER (
			WHERE requested_at >= v_requested_at - INTERVAL '1 hour'
		)::INTEGER AS unique_1h,
		COUNT(*) FILTER (
			WHERE requested_at >= v_requested_at - INTERVAL '24 hours'
		)::INTEGER AS total_24h,
		COUNT(DISTINCT path) FILTER (
			WHERE requested_at >= v_requested_at - INTERVAL '24 hours'
		)::INTEGER AS unique_24h
	FROM public.content_access_events
	WHERE actor_key = p_actor_key
		AND requested_at >= v_requested_at - INTERVAL '24 hours';
END;
$$;

DROP FUNCTION IF EXISTS public.visitors_last_30_days();

CREATE FUNCTION public.visitors_last_30_days()
RETURNS TABLE (
	days DATE,
	number_of_visitors BIGINT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
	WITH date_bounds AS (
		SELECT generate_series(
			CURRENT_DATE - INTERVAL '29 days',
			CURRENT_DATE,
			INTERVAL '1 day'
		)::DATE AS day
	),
	daily_visitors AS (
		SELECT
			v.started_at::DATE AS day,
			COUNT(DISTINCT v.fingerprint)::BIGINT AS number_of_visitors
		FROM public.page_analytics_visits v
		WHERE v.started_at >= CURRENT_DATE - INTERVAL '29 days'
			AND v.started_at < CURRENT_DATE + INTERVAL '1 day'
			AND NOT public.is_analytics_utility_path(v.path)
		GROUP BY v.started_at::DATE
	)
	SELECT
		b.day AS days,
		COALESCE(v.number_of_visitors, 0)::BIGINT AS number_of_visitors
	FROM date_bounds b
	LEFT JOIN daily_visitors v ON v.day = b.day
	ORDER BY b.day;
$$;

GRANT EXECUTE ON FUNCTION public.visitors_last_30_days() TO authenticated;

DELETE FROM public.visitors v
WHERE NOT EXISTS (
	SELECT 1
	FROM public.blog_comments bc
	WHERE bc.fingerprint = v.fingerprint
);

SELECT public.cleanup_site_telemetry(NOW());
