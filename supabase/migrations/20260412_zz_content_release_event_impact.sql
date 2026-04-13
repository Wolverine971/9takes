-- supabase/migrations/20260412_zz_content_release_event_impact.sql
-- Created: 2026-04-12
-- Adds release event recording and before/after event impact reporting.

REVOKE ALL ON TABLE public.content_release_events FROM anon, authenticated;
REVOKE ALL ON SEQUENCE public.content_release_events_id_seq FROM anon, authenticated;

GRANT SELECT, INSERT ON TABLE public.content_release_events TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.content_release_events_id_seq TO service_role;

ALTER TABLE public.content_release_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS content_release_events_admin_all ON public.content_release_events;
CREATE POLICY content_release_events_admin_all
	ON public.content_release_events
	FOR ALL
	USING (
		EXISTS (
			SELECT 1
			FROM public.profiles
			WHERE profiles.id = auth.uid()
				AND profiles.admin IS TRUE
		)
	)
	WITH CHECK (
		EXISTS (
			SELECT 1
			FROM public.profiles
			WHERE profiles.id = auth.uid()
				AND profiles.admin IS TRUE
		)
	);

DROP POLICY IF EXISTS content_release_events_service_role_all ON public.content_release_events;
CREATE POLICY content_release_events_service_role_all
	ON public.content_release_events
	FOR ALL
	USING (auth.role() = 'service_role')
	WITH CHECK (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION public.record_content_release_event(
	p_content_type TEXT,
	p_content_slug TEXT,
	p_event_type TEXT,
	p_event_at TIMESTAMPTZ DEFAULT NOW(),
	p_source TEXT DEFAULT NULL,
	p_path TEXT DEFAULT NULL,
	p_metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_event_id BIGINT;
	v_content_type TEXT := COALESCE(NULLIF(BTRIM(p_content_type), ''), 'people');
	v_content_slug TEXT := public.analytics_normalize_content_slug(p_content_slug);
	v_event_type TEXT := COALESCE(NULLIF(BTRIM(p_event_type), ''), 'manual_note');
	v_event_at TIMESTAMPTZ := COALESCE(p_event_at, NOW());
BEGIN
	IF v_content_slug = '' THEN
		RAISE EXCEPTION 'content slug is required';
	END IF;

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

	INSERT INTO public.content_release_events (
		content_type,
		content_slug,
		path,
		event_type,
		event_at,
		source,
		metadata
	) VALUES (
		v_content_type,
		v_content_slug,
		COALESCE(NULLIF(BTRIM(p_path), ''), '/personality-analysis/' || v_content_slug),
		v_event_type,
		v_event_at,
		NULLIF(BTRIM(p_source), ''),
		COALESCE(p_metadata, '{}'::JSONB)
	)
	RETURNING id INTO v_event_id;

	RETURN v_event_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_content_release_event_impact(
	p_slug TEXT,
	p_days_before INTEGER DEFAULT 7,
	p_days_after INTEGER DEFAULT 7
)
RETURNS TABLE(
	id BIGINT,
	content_type TEXT,
	content_slug TEXT,
	path TEXT,
	event_type TEXT,
	event_at TIMESTAMPTZ,
	source TEXT,
	metadata JSONB,
	days_before INTEGER,
	days_after INTEGER,
	views_before BIGINT,
	views_after BIGINT,
	unique_before BIGINT,
	unique_after BIGINT,
	avg_daily_before NUMERIC,
	avg_daily_after NUMERIC,
	lift_views BIGINT,
	lift_pct NUMERIC
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
	WITH params AS (
		SELECT
			public.analytics_normalize_content_slug(p_slug) AS slug,
			LEAST(GREATEST(COALESCE(p_days_before, 7), 1), 30) AS days_before,
			LEAST(GREATEST(COALESCE(p_days_after, 7), 1), 30) AS days_after
	),
	events AS (
		SELECT
			e.id,
			e.content_type,
			e.content_slug,
			e.path,
			e.event_type,
			e.event_at,
			e.source,
			e.metadata,
			public.analytics_local_date(e.event_at) AS event_date
		FROM public.content_release_events e
		CROSS JOIN params p
		WHERE e.content_type = 'people'
			AND e.content_slug = p.slug
	),
	rollup_daily AS (
		SELECT
			cad.metric_date,
			cad.content_type,
			cad.content_slug,
			cad.visits,
			cad.unique_visitors
		FROM public.content_analytics_daily cad
		CROSS JOIN params p
		WHERE cad.content_type = 'people'
			AND cad.content_slug = p.slug
	),
	raw_daily_missing AS (
		SELECT
			public.analytics_local_date(v.started_at) AS metric_date,
			'people'::TEXT AS content_type,
			public.analytics_normalize_content_slug(v.content_slug) AS content_slug,
			COUNT(v.id)::BIGINT AS visits,
			COUNT(DISTINCT v.fingerprint)::BIGINT AS unique_visitors
		FROM public.page_analytics_visits v
		CROSS JOIN params p
		WHERE v.content_type = 'people'
			AND v.content_slug IS NOT NULL
			AND public.analytics_normalize_content_slug(v.content_slug) = p.slug
			AND NOT public.is_analytics_utility_path(v.path)
			AND NOT EXISTS (
				SELECT 1
				FROM public.content_analytics_daily cad
				WHERE cad.metric_date = public.analytics_local_date(v.started_at)
					AND cad.content_type = 'people'
					AND cad.content_slug = p.slug
			)
		GROUP BY public.analytics_local_date(v.started_at), public.analytics_normalize_content_slug(v.content_slug)
	),
	daily_union AS (
		SELECT * FROM rollup_daily
		UNION ALL
		SELECT * FROM raw_daily_missing
	),
	event_windows AS (
		SELECT
			e.id,
			SUM(du.visits) FILTER (
				WHERE du.metric_date >= e.event_date - p.days_before
					AND du.metric_date < e.event_date
			)::BIGINT AS views_before,
			SUM(du.visits) FILTER (
				WHERE du.metric_date >= e.event_date
					AND du.metric_date < e.event_date + p.days_after
			)::BIGINT AS views_after,
			SUM(du.unique_visitors) FILTER (
				WHERE du.metric_date >= e.event_date - p.days_before
					AND du.metric_date < e.event_date
			)::BIGINT AS unique_before,
			SUM(du.unique_visitors) FILTER (
				WHERE du.metric_date >= e.event_date
					AND du.metric_date < e.event_date + p.days_after
			)::BIGINT AS unique_after
		FROM events e
		CROSS JOIN params p
		LEFT JOIN daily_union du
			ON du.content_type = e.content_type
			AND du.content_slug = e.content_slug
			AND du.metric_date >= e.event_date - p.days_before
			AND du.metric_date < e.event_date + p.days_after
		GROUP BY e.id
	)
	SELECT
		e.id,
		e.content_type,
		e.content_slug,
		e.path,
		e.event_type,
		e.event_at,
		e.source,
		e.metadata,
		p.days_before,
		p.days_after,
		COALESCE(w.views_before, 0)::BIGINT AS views_before,
		COALESCE(w.views_after, 0)::BIGINT AS views_after,
		COALESCE(w.unique_before, 0)::BIGINT AS unique_before,
		COALESCE(w.unique_after, 0)::BIGINT AS unique_after,
		ROUND(COALESCE(w.views_before, 0)::NUMERIC / p.days_before, 2) AS avg_daily_before,
		ROUND(COALESCE(w.views_after, 0)::NUMERIC / p.days_after, 2) AS avg_daily_after,
		(COALESCE(w.views_after, 0) - COALESCE(w.views_before, 0))::BIGINT AS lift_views,
		CASE
			WHEN COALESCE(w.views_before, 0) > 0
			THEN ROUND(
				(COALESCE(w.views_after, 0) - COALESCE(w.views_before, 0))::NUMERIC
					/ COALESCE(w.views_before, 0)::NUMERIC
					* 100,
				2
			)
			ELSE NULL
		END AS lift_pct
	FROM events e
	CROSS JOIN params p
	LEFT JOIN event_windows w ON w.id = e.id
	ORDER BY e.event_at DESC, e.id DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.record_content_release_event(
	TEXT,
	TEXT,
	TEXT,
	TIMESTAMPTZ,
	TEXT,
	TEXT,
	JSONB
) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_content_release_event_impact(TEXT, INTEGER, INTEGER)
	FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.record_content_release_event(
	TEXT,
	TEXT,
	TEXT,
	TIMESTAMPTZ,
	TEXT,
	TEXT,
	JSONB
) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_content_release_event_impact(TEXT, INTEGER, INTEGER)
	TO authenticated, service_role;
