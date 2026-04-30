-- Keep page-view collection reliable even when derived analytics maintenance fails.

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

		BEGIN
			PERFORM set_config('statement_timeout', '1500ms', TRUE);
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
			PERFORM set_config('statement_timeout', '0', TRUE);
		EXCEPTION WHEN OTHERS THEN
			PERFORM set_config('statement_timeout', '0', TRUE);
			RAISE WARNING 'record_visitor_first_touch failed: %', SQLERRM;
		END;
	END IF;

	IF public.claim_telemetry_cleanup_slot(
		'site_telemetry_cleanup',
		v_now,
		INTERVAL '6 hours'
	) THEN
		BEGIN
			PERFORM set_config('statement_timeout', '1500ms', TRUE);
			PERFORM public.cleanup_site_telemetry(v_now);
			PERFORM set_config('statement_timeout', '0', TRUE);
		EXCEPTION WHEN OTHERS THEN
			PERFORM set_config('statement_timeout', '0', TRUE);
			RAISE WARNING 'site_telemetry_cleanup failed: %', SQLERRM;
		END;
	END IF;

	IF public.claim_telemetry_cleanup_slot(
		'content_daily_rollup_refresh',
		v_now,
		INTERVAL '12 hours'
	) THEN
		BEGIN
			PERFORM set_config('statement_timeout', '1500ms', TRUE);
			PERFORM public.refresh_content_analytics_daily(
				public.analytics_local_date(v_now - INTERVAL '45 days'),
				public.analytics_local_date(v_now),
				NULL
			);
			PERFORM set_config('statement_timeout', '0', TRUE);
		EXCEPTION WHEN OTHERS THEN
			PERFORM set_config('statement_timeout', '0', TRUE);
			RAISE WARNING 'content_daily_rollup_refresh failed: %', SQLERRM;
		END;
	END IF;

	IF public.claim_telemetry_cleanup_slot(
		'retention_rollup_refresh',
		v_now,
		INTERVAL '12 hours'
	) THEN
		BEGIN
			PERFORM set_config('statement_timeout', '1500ms', TRUE);
			PERFORM public.refresh_retention_rollups(
				public.analytics_local_date(v_now - INTERVAL '45 days'),
				public.analytics_local_date(v_now)
			);
			PERFORM set_config('statement_timeout', '0', TRUE);
		EXCEPTION WHEN OTHERS THEN
			PERFORM set_config('statement_timeout', '0', TRUE);
			RAISE WARNING 'retention_rollup_refresh failed: %', SQLERRM;
		END;
	END IF;

	RETURN QUERY SELECT v_session_id, v_visit_id;
END;
$$;

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
