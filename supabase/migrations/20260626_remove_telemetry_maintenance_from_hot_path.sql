-- supabase/migrations/20260626_remove_telemetry_maintenance_from_hot_path.sql
-- Do not run telemetry maintenance from user-facing request RPCs.

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
	v_path TEXT;
	v_path_group TEXT;
	v_content_type TEXT;
	v_content_slug TEXT;
	v_detail_slug TEXT;
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

	v_path := COALESCE(
		public.analytics_normalize_personality_path(p_path, p_content_type, p_content_slug),
		p_path
	);
	v_detail_slug := public.analytics_personality_detail_slug(v_path);
	v_content_type := CASE WHEN v_detail_slug IS NOT NULL THEN 'people' ELSE p_content_type END;
	v_path_group := CASE
		WHEN v_detail_slug IS NOT NULL THEN '/personality-analysis/[slug]'
		ELSE p_path_group
	END;
	v_content_slug := CASE
		WHEN v_detail_slug IS NOT NULL THEN v_detail_slug
		WHEN COALESCE(p_content_type, '') = 'people' AND p_content_slug IS NOT NULL
		THEN public.analytics_normalize_content_slug(p_content_slug)
		ELSE p_content_slug
	END;

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
		v_path,
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
	SET entry_path = v_path
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
		v_path,
		p_route_id,
		v_path_group,
		v_content_type,
		v_content_slug,
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
			v_path,
			v_path_group,
			v_content_type,
			v_content_slug,
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

	RETURN QUERY SELECT v_session_id, v_visit_id;
END;
$$;
