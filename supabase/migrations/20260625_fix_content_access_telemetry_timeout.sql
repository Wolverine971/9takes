-- supabase/migrations/20260625_fix_content_access_telemetry_timeout.sql
-- Keep protected-content telemetry from wedging on periodic cleanup.

CREATE INDEX IF NOT EXISTS idx_content_access_events_requested_at
	ON public.content_access_events (requested_at DESC);

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
		BEGIN
			PERFORM set_config('statement_timeout', '1500ms', TRUE);
			PERFORM public.cleanup_site_telemetry(v_requested_at);
			PERFORM set_config('statement_timeout', '0', TRUE);
		EXCEPTION WHEN OTHERS THEN
			PERFORM set_config('statement_timeout', '0', TRUE);
			RAISE WARNING 'site_telemetry_cleanup from content access failed: %', SQLERRM;
		END;
	END IF;

	IF p_actor_type = 'anonymous_human' THEN
		RETURN QUERY SELECT 0, 0, 0, 0, 0, 0;
		RETURN;
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
