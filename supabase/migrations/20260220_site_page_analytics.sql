-- supabase/migrations/20260220_site_page_analytics.sql
-- Created: 2026-02-20
-- Adds first-party site page analytics tables + RPCs

CREATE TABLE IF NOT EXISTS public.page_analytics_sessions (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	session_key TEXT UNIQUE NOT NULL,
	fingerprint TEXT NOT NULL,
	user_id UUID NULL,
	started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	ended_at TIMESTAMPTZ NULL,
	entry_path TEXT NULL,
	exit_path TEXT NULL,
	page_count INT NOT NULL DEFAULT 0,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.page_analytics_visits (
	id BIGSERIAL PRIMARY KEY,
	visit_key UUID UNIQUE NOT NULL,
	session_id UUID NOT NULL REFERENCES public.page_analytics_sessions(id) ON DELETE CASCADE,
	fingerprint TEXT NOT NULL,
	user_id UUID NULL,
	path TEXT NOT NULL,
	route_id TEXT NULL,
	path_group TEXT NOT NULL,
	content_type TEXT NULL,
	content_slug TEXT NULL,
	referrer_host TEXT NULL,
	started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	ended_at TIMESTAMPTZ NULL,
	engaged_ms INT NOT NULL DEFAULT 0 CHECK (engaged_ms >= 0),
	max_scroll_pct SMALLINT NOT NULL DEFAULT 0 CHECK (max_scroll_pct >= 0 AND max_scroll_pct <= 100),
	is_exit BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_visits_started_at
	ON public.page_analytics_visits (started_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_visits_path_group_started_at
	ON public.page_analytics_visits (path_group, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_visits_content_type_started_at
	ON public.page_analytics_visits (content_type, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_visits_fingerprint_started_at
	ON public.page_analytics_visits (fingerprint, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_visits_path_started_at
	ON public.page_analytics_visits (path, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_sessions_fingerprint_last_seen
	ON public.page_analytics_sessions (fingerprint, last_seen_at DESC);

CREATE OR REPLACE FUNCTION public.set_page_analytics_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_page_analytics_sessions_updated_at ON public.page_analytics_sessions;
CREATE TRIGGER trg_page_analytics_sessions_updated_at
	BEFORE UPDATE ON public.page_analytics_sessions
	FOR EACH ROW
	EXECUTE FUNCTION public.set_page_analytics_updated_at();

DROP TRIGGER IF EXISTS trg_page_analytics_visits_updated_at ON public.page_analytics_visits;
CREATE TRIGGER trg_page_analytics_visits_updated_at
	BEFORE UPDATE ON public.page_analytics_visits
	FOR EACH ROW
	EXECUTE FUNCTION public.set_page_analytics_updated_at();

CREATE OR REPLACE FUNCTION public.is_analytics_utility_path(p_path TEXT)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
	SELECT
		COALESCE(p_path, '') = ''
		OR p_path ~ '^/(admin|api)(/|$)'
		OR p_path = '/logout'
		OR p_path LIKE '/account/unsubscribe%';
$$;

CREATE OR REPLACE FUNCTION public.analytics_scope_match(
	p_scope TEXT,
	p_path TEXT,
	p_content_type TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
	SELECT CASE
		WHEN COALESCE(p_scope, 'all') = 'all' THEN TRUE
		WHEN p_scope = 'blog' THEN (
			p_path LIKE '/personality-analysis%'
			OR p_path LIKE '/community%'
			OR p_path LIKE '/how-to-guides%'
			OR p_path LIKE '/enneagram-corner%'
			OR p_path LIKE '/pop-culture%'
			OR p_path LIKE '/blog%'
		)
		WHEN p_scope = 'people' THEN COALESCE(p_content_type, '') = 'people'
		WHEN p_scope = 'community' THEN COALESCE(p_content_type, '') = 'community'
		WHEN p_scope = 'guides' THEN COALESCE(p_content_type, '') = 'guides'
		WHEN p_scope = 'enneagram' THEN COALESCE(p_content_type, '') = 'enneagram'
		WHEN p_scope = 'pop-culture' THEN COALESCE(p_content_type, '') = 'pop-culture'
		WHEN p_scope = 'question' THEN COALESCE(p_content_type, '') = 'question'
		WHEN p_scope = 'other' THEN COALESCE(p_content_type, '') = 'other'
		ELSE TRUE
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
	SET entry_path = COALESCE(entry_path, p_path),
		last_seen_at = NOW()
	WHERE id = v_session_id;

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
AS $$
DECLARE
	v_session_id UUID;
	v_path TEXT;
	v_delta INTEGER := GREATEST(COALESCE(p_engaged_ms_delta, 0), 0);
	v_scroll SMALLINT := LEAST(100, GREATEST(0, COALESCE(p_max_scroll_pct, 0)));
BEGIN
	UPDATE public.page_analytics_visits
	SET engaged_ms = LEAST(1800000, engaged_ms + v_delta),
		max_scroll_pct = GREATEST(max_scroll_pct, v_scroll),
		ended_at = COALESCE(p_ended_at, ended_at),
		is_exit = is_exit OR COALESCE(p_is_exit, FALSE),
		updated_at = NOW()
	WHERE visit_key = p_visit_key
	RETURNING session_id, path INTO v_session_id, v_path;

	IF v_session_id IS NULL THEN
		RETURN FALSE;
	END IF;

	UPDATE public.page_analytics_sessions
	SET last_seen_at = NOW(),
		exit_path = CASE WHEN p_is_exit THEN v_path ELSE exit_path END,
		ended_at = CASE WHEN p_is_exit THEN COALESCE(p_ended_at, NOW()) ELSE ended_at END,
		updated_at = NOW()
	WHERE id = v_session_id;

	RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_page_analytics_overview(
	p_from_date DATE DEFAULT NULL,
	p_to_date DATE DEFAULT NULL,
	p_scope TEXT DEFAULT 'all'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
	v_from TIMESTAMPTZ := COALESCE(p_from_date::TIMESTAMPTZ, NOW() - INTERVAL '30 days');
	v_to TIMESTAMPTZ := COALESCE((p_to_date::TIMESTAMPTZ + INTERVAL '1 day'), NOW() + INTERVAL '1 day');
	v_result JSON;
BEGIN
	WITH filtered AS (
		SELECT v.*
		FROM public.page_analytics_visits v
		WHERE v.started_at >= v_from
			AND v.started_at < v_to
			AND NOT public.is_analytics_utility_path(v.path)
			AND public.analytics_scope_match(p_scope, v.path, v.content_type)
	)
	SELECT json_build_object(
		'total_visits', COUNT(*),
		'unique_visitors', COUNT(DISTINCT fingerprint),
		'authenticated_visits', COUNT(*) FILTER (WHERE user_id IS NOT NULL),
		'anonymous_visits', COUNT(*) FILTER (WHERE user_id IS NULL),
		'avg_time_on_page_ms', COALESCE(ROUND(AVG(engaged_ms))::INT, 0),
		'median_time_on_page_ms', COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY engaged_ms)::INT, 0),
		'bounce_rate', CASE
			WHEN COUNT(*) > 0
			THEN ROUND((COUNT(*) FILTER (WHERE engaged_ms < 10000))::NUMERIC / COUNT(*)::NUMERIC * 100, 2)
			ELSE 0
		END
	) INTO v_result
	FROM filtered;

	RETURN COALESCE(
		v_result,
		json_build_object(
			'total_visits', 0,
			'unique_visitors', 0,
			'authenticated_visits', 0,
			'anonymous_visits', 0,
			'avg_time_on_page_ms', 0,
			'median_time_on_page_ms', 0,
			'bounce_rate', 0
		)
	);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_page_analytics_timeseries(
	p_from_date DATE DEFAULT NULL,
	p_to_date DATE DEFAULT NULL,
	p_scope TEXT DEFAULT 'all'
)
RETURNS TABLE(
	day DATE,
	visits BIGINT,
	unique_visitors BIGINT,
	authenticated_visits BIGINT,
	anonymous_visits BIGINT,
	avg_time_on_page_ms INTEGER
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
	WITH bounds AS (
		SELECT
			COALESCE(p_from_date::TIMESTAMPTZ, NOW() - INTERVAL '30 days') AS from_ts,
			COALESCE((p_to_date::TIMESTAMPTZ + INTERVAL '1 day'), NOW() + INTERVAL '1 day') AS to_ts
	),
	filtered AS (
		SELECT v.*
		FROM public.page_analytics_visits v
		CROSS JOIN bounds b
		WHERE v.started_at >= b.from_ts
			AND v.started_at < b.to_ts
			AND NOT public.is_analytics_utility_path(v.path)
			AND public.analytics_scope_match(p_scope, v.path, v.content_type)
	)
	SELECT
		DATE_TRUNC('day', started_at)::DATE AS day,
		COUNT(*)::BIGINT AS visits,
		COUNT(DISTINCT fingerprint)::BIGINT AS unique_visitors,
		COUNT(*) FILTER (WHERE user_id IS NOT NULL)::BIGINT AS authenticated_visits,
		COUNT(*) FILTER (WHERE user_id IS NULL)::BIGINT AS anonymous_visits,
		COALESCE(ROUND(AVG(engaged_ms))::INT, 0) AS avg_time_on_page_ms
	FROM filtered
	GROUP BY 1
	ORDER BY 1;
$$;

CREATE OR REPLACE FUNCTION public.get_page_analytics_pages(
	p_from_date DATE DEFAULT NULL,
	p_to_date DATE DEFAULT NULL,
	p_scope TEXT DEFAULT 'all',
	p_search TEXT DEFAULT NULL,
	p_limit INTEGER DEFAULT 100,
	p_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
	path TEXT,
	path_group TEXT,
	content_type TEXT,
	visits BIGINT,
	unique_visitors BIGINT,
	authenticated_visits BIGINT,
	anonymous_visits BIGINT,
	avg_time_on_page_ms INTEGER,
	median_time_on_page_ms INTEGER,
	bounce_rate NUMERIC,
	total_rows BIGINT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
	WITH bounds AS (
		SELECT
			COALESCE(p_from_date::TIMESTAMPTZ, NOW() - INTERVAL '30 days') AS from_ts,
			COALESCE((p_to_date::TIMESTAMPTZ + INTERVAL '1 day'), NOW() + INTERVAL '1 day') AS to_ts
	),
	filtered AS (
		SELECT v.*
		FROM public.page_analytics_visits v
		CROSS JOIN bounds b
		WHERE v.started_at >= b.from_ts
			AND v.started_at < b.to_ts
			AND NOT public.is_analytics_utility_path(v.path)
			AND public.analytics_scope_match(p_scope, v.path, v.content_type)
			AND (
				p_search IS NULL
				OR p_search = ''
				OR v.path ILIKE '%' || p_search || '%'
				OR v.path_group ILIKE '%' || p_search || '%'
			)
	),
	grouped AS (
		SELECT
			v.path,
			v.path_group,
			COALESCE(MAX(v.content_type), 'other') AS content_type,
			COUNT(*)::BIGINT AS visits,
			COUNT(DISTINCT v.fingerprint)::BIGINT AS unique_visitors,
			COUNT(*) FILTER (WHERE v.user_id IS NOT NULL)::BIGINT AS authenticated_visits,
			COUNT(*) FILTER (WHERE v.user_id IS NULL)::BIGINT AS anonymous_visits,
			COALESCE(ROUND(AVG(v.engaged_ms))::INT, 0) AS avg_time_on_page_ms,
			COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY v.engaged_ms)::INT, 0) AS median_time_on_page_ms,
			CASE
				WHEN COUNT(*) > 0
				THEN ROUND((COUNT(*) FILTER (WHERE v.engaged_ms < 10000))::NUMERIC / COUNT(*)::NUMERIC * 100, 2)
				ELSE 0
			END AS bounce_rate
		FROM filtered v
		GROUP BY v.path, v.path_group
	)
	SELECT
		g.path,
		g.path_group,
		g.content_type,
		g.visits,
		g.unique_visitors,
		g.authenticated_visits,
		g.anonymous_visits,
		g.avg_time_on_page_ms,
		g.median_time_on_page_ms,
		g.bounce_rate,
		COUNT(*) OVER ()::BIGINT AS total_rows
	FROM grouped g
	ORDER BY g.visits DESC, g.path ASC
	LIMIT LEAST(GREATEST(COALESCE(p_limit, 100), 1), 500)
	OFFSET GREATEST(COALESCE(p_offset, 0), 0);
$$;

GRANT EXECUTE ON FUNCTION public.upsert_page_analytics_visit(
	UUID, TEXT, TEXT, UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_page_analytics_ping(
	UUID, INTEGER, SMALLINT, TIMESTAMPTZ, BOOLEAN
) TO anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_overview(DATE, DATE, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_page_analytics_timeseries(DATE, DATE, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_page_analytics_pages(DATE, DATE, TEXT, TEXT, INTEGER, INTEGER) TO authenticated;
