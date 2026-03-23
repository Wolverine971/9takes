-- supabase/migrations/20260318_content_access_events.sql
-- Created: 2026-03-18
-- Adds shared content access tracking so article budgets are enforced across instances

CREATE TABLE IF NOT EXISTS public.content_access_events (
	id BIGSERIAL PRIMARY KEY,
	actor_key TEXT NOT NULL,
	actor_type TEXT NOT NULL CHECK (actor_type IN ('anonymous_human', 'allowed_ai_crawler')),
	actor_name TEXT NOT NULL,
	path TEXT NOT NULL,
	request_kind TEXT NOT NULL CHECK (request_kind IN ('page', 'data')),
	requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_access_events_actor_requested_at
	ON public.content_access_events (actor_key, requested_at DESC);

CREATE INDEX IF NOT EXISTS idx_content_access_events_actor_path_requested_at
	ON public.content_access_events (actor_key, path, requested_at DESC);

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

	DELETE FROM public.content_access_events
	WHERE actor_key = p_actor_key
		AND requested_at < v_requested_at - INTERVAL '7 days';

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

GRANT EXECUTE ON FUNCTION public.record_content_access_event(
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TIMESTAMPTZ
) TO anon, authenticated;
