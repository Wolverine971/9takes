-- supabase/migrations/20260725_api_rate_limit_events.sql
--
-- Durable rate limiting for metered endpoints (paid LLM / transcription calls).
--
-- The previous limiter lived in a module-level Map, which resets on every cold
-- start and is not shared across concurrent serverless instances, and it was
-- keyed on a client-supplied fingerprint that an attacker could simply rotate.
-- This table makes the counter shared and the subject server-derived.

CREATE TABLE IF NOT EXISTS public.api_rate_limit_events (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	bucket TEXT NOT NULL,
	subject_hash TEXT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS api_rate_limit_events_bucket_subject_created_at_idx
	ON public.api_rate_limit_events (bucket, subject_hash, created_at DESC);

-- Supports the periodic prune below without scanning the whole table.
CREATE INDEX IF NOT EXISTS api_rate_limit_events_created_at_idx
	ON public.api_rate_limit_events (created_at);

ALTER TABLE public.api_rate_limit_events ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.api_rate_limit_events FROM anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.api_rate_limit_events TO service_role;

-- Count-and-record in one round trip so concurrent requests cannot both read a
-- stale count and then both insert. The count is taken inside the same
-- statement that inserts, and the caller compares it against its limit.
CREATE OR REPLACE FUNCTION public.consume_api_rate_limit(
	p_bucket TEXT,
	p_subject_hash TEXT,
	p_window_seconds INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_used INTEGER;
BEGIN
	INSERT INTO public.api_rate_limit_events (bucket, subject_hash)
	VALUES (p_bucket, p_subject_hash);

	SELECT COUNT(*) INTO v_used
	FROM public.api_rate_limit_events
	WHERE bucket = p_bucket
		AND subject_hash = p_subject_hash
		AND created_at >= now() - make_interval(secs => p_window_seconds);

	RETURN v_used;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_api_rate_limit(TEXT, TEXT, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_api_rate_limit(TEXT, TEXT, INTEGER) TO service_role;

-- Housekeeping: drop rows older than any window we use.
CREATE OR REPLACE FUNCTION public.prune_api_rate_limit_events()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
	DELETE FROM public.api_rate_limit_events
	WHERE created_at < now() - INTERVAL '1 day';
$$;

REVOKE ALL ON FUNCTION public.prune_api_rate_limit_events() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.prune_api_rate_limit_events() TO service_role;
