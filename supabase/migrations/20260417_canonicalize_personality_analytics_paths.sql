-- supabase/migrations/20260417_canonicalize_personality_analytics_paths.sql
-- Canonicalize personality-analysis analytics paths so mixed-case person URLs
-- roll up under the same page, e.g. /personality-analysis/Alex-Karp -> /personality-analysis/alex-karp.

CREATE OR REPLACE FUNCTION public.analytics_normalize_personality_path(
	p_path TEXT,
	p_content_type TEXT DEFAULT NULL,
	p_content_slug TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
	v_path TEXT;
	v_slug TEXT;
BEGIN
	IF p_path IS NULL THEN
		RETURN NULL;
	END IF;

	v_path := COALESCE(NULLIF(BTRIM(p_path), ''), '/');
	v_path := REGEXP_REPLACE(v_path, '[?#].*$', '');

	IF LEFT(v_path, 1) <> '/' THEN
		v_path := '/' || v_path;
	END IF;

	IF LENGTH(v_path) > 1 THEN
		v_path := REGEXP_REPLACE(v_path, '/+$', '');
	END IF;

	IF v_path ~* '^/personality-analysis/[^/]+$' THEN
		v_slug := SUBSTRING(v_path FROM '^/personality-analysis/([^/]+)$');

		IF LOWER(v_slug) NOT IN ('type', 'categories') THEN
			v_slug := public.analytics_normalize_content_slug(
				COALESCE(NULLIF(BTRIM(p_content_slug), ''), v_slug)
			);

			IF v_slug <> '' THEN
				RETURN '/personality-analysis/' || v_slug;
			END IF;
		END IF;
	END IF;

	RETURN v_path;
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_personality_detail_slug(p_path TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
	v_path TEXT;
	v_slug TEXT;
BEGIN
	v_path := public.analytics_normalize_personality_path(p_path, NULL, NULL);

	IF v_path !~ '^/personality-analysis/[^/]+$' THEN
		RETURN NULL;
	END IF;

	v_slug := SUBSTRING(v_path FROM '^/personality-analysis/([^/]+)$');

	IF LOWER(v_slug) IN ('type', 'categories') THEN
		RETURN NULL;
	END IF;

	RETURN v_slug;
END;
$$;

WITH normalized AS (
	SELECT
		v.id,
		public.analytics_normalize_personality_path(v.path, v.content_type, v.content_slug) AS path,
		CASE
			WHEN public.analytics_personality_detail_slug(
				public.analytics_normalize_personality_path(v.path, v.content_type, v.content_slug)
			) IS NOT NULL
			THEN public.analytics_personality_detail_slug(
				public.analytics_normalize_personality_path(v.path, v.content_type, v.content_slug)
			)
			ELSE v.content_slug
		END AS content_slug,
		CASE
			WHEN public.analytics_personality_detail_slug(
				public.analytics_normalize_personality_path(v.path, v.content_type, v.content_slug)
			) IS NOT NULL
			THEN '/personality-analysis/[slug]'
			ELSE v.path_group
		END AS path_group,
		CASE
			WHEN public.analytics_personality_detail_slug(
				public.analytics_normalize_personality_path(v.path, v.content_type, v.content_slug)
			) IS NOT NULL
			THEN 'people'
			ELSE v.content_type
		END AS content_type
	FROM public.page_analytics_visits v
	WHERE v.path ~* '^/personality-analysis/[^/]+/?$'
		OR (
			v.content_type = 'people'
			AND v.content_slug IS NOT NULL
			AND v.content_slug <> public.analytics_normalize_content_slug(v.content_slug)
		)
)
UPDATE public.page_analytics_visits v
SET
	path = n.path,
	content_slug = n.content_slug,
	path_group = n.path_group,
	content_type = n.content_type
FROM normalized n
WHERE v.id = n.id
	AND (
		v.path IS DISTINCT FROM n.path
		OR v.content_slug IS DISTINCT FROM n.content_slug
		OR v.path_group IS DISTINCT FROM n.path_group
		OR v.content_type IS DISTINCT FROM n.content_type
	);

UPDATE public.page_analytics_sessions
SET
	entry_path = CASE
		WHEN entry_path IS NULL THEN NULL
		ELSE public.analytics_normalize_personality_path(entry_path, NULL, NULL)
	END,
	exit_path = CASE
		WHEN exit_path IS NULL THEN NULL
		ELSE public.analytics_normalize_personality_path(exit_path, NULL, NULL)
	END
WHERE entry_path ~* '^/personality-analysis/[^/]+/?$'
	OR exit_path ~* '^/personality-analysis/[^/]+/?$';

WITH normalized AS (
	SELECT
		v.fingerprint,
		public.analytics_normalize_personality_path(
			v.first_path,
			v.first_content_type,
			v.first_content_slug
		) AS first_path,
		CASE
			WHEN public.analytics_personality_detail_slug(
				public.analytics_normalize_personality_path(
					v.first_path,
					v.first_content_type,
					v.first_content_slug
				)
			) IS NOT NULL
			THEN '/personality-analysis/[slug]'
			ELSE v.first_path_group
		END AS first_path_group,
		CASE
			WHEN public.analytics_personality_detail_slug(
				public.analytics_normalize_personality_path(
					v.first_path,
					v.first_content_type,
					v.first_content_slug
				)
			) IS NOT NULL
			THEN 'people'
			ELSE v.first_content_type
		END AS first_content_type,
		CASE
			WHEN public.analytics_personality_detail_slug(
				public.analytics_normalize_personality_path(
					v.first_path,
					v.first_content_type,
					v.first_content_slug
				)
			) IS NOT NULL
			THEN public.analytics_personality_detail_slug(
				public.analytics_normalize_personality_path(
					v.first_path,
					v.first_content_type,
					v.first_content_slug
				)
			)
			WHEN v.first_content_type = 'people' AND v.first_content_slug IS NOT NULL
			THEN public.analytics_normalize_content_slug(v.first_content_slug)
			ELSE v.first_content_slug
		END AS first_content_slug
	FROM public.visitor_first_touch v
	WHERE v.first_path ~* '^/personality-analysis/[^/]+/?$'
		OR (
			v.first_content_type = 'people'
			AND v.first_content_slug IS NOT NULL
			AND v.first_content_slug <> public.analytics_normalize_content_slug(v.first_content_slug)
		)
)
UPDATE public.visitor_first_touch v
SET
	first_path = n.first_path,
	first_path_group = n.first_path_group,
	first_content_type = n.first_content_type,
	first_content_slug = n.first_content_slug
FROM normalized n
WHERE v.fingerprint = n.fingerprint
	AND (
		v.first_path IS DISTINCT FROM n.first_path
		OR v.first_path_group IS DISTINCT FROM n.first_path_group
		OR v.first_content_type IS DISTINCT FROM n.first_content_type
		OR v.first_content_slug IS DISTINCT FROM n.first_content_slug
	);

UPDATE public.visitor_day_activity
SET
	first_path = CASE
		WHEN first_path IS NULL THEN NULL
		ELSE public.analytics_normalize_personality_path(first_path, NULL, NULL)
	END,
	last_path = CASE
		WHEN last_path IS NULL THEN NULL
		ELSE public.analytics_normalize_personality_path(last_path, NULL, NULL)
	END
WHERE first_path ~* '^/personality-analysis/[^/]+/?$'
	OR last_path ~* '^/personality-analysis/[^/]+/?$';

UPDATE public.content_analytics_daily
SET path = public.analytics_normalize_personality_path(path, content_type, content_slug)
WHERE content_type = 'people'
	AND path ~* '^/personality-analysis/[^/]+/?$'
	AND path IS DISTINCT FROM public.analytics_normalize_personality_path(path, content_type, content_slug);

UPDATE public.content_release_events
SET
	path = CASE
		WHEN path IS NULL THEN NULL
		ELSE public.analytics_normalize_personality_path(path, content_type, content_slug)
	END,
	content_slug = CASE
		WHEN content_type = 'people' THEN public.analytics_normalize_content_slug(content_slug)
		ELSE content_slug
	END
WHERE content_type = 'people'
	AND (
		path ~* '^/personality-analysis/[^/]+/?$'
		OR content_slug IS DISTINCT FROM public.analytics_normalize_content_slug(content_slug)
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

GRANT EXECUTE ON FUNCTION public.analytics_normalize_personality_path(TEXT, TEXT, TEXT)
	TO authenticated, service_role;

GRANT EXECUTE ON FUNCTION public.analytics_personality_detail_slug(TEXT)
	TO authenticated, service_role;

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
