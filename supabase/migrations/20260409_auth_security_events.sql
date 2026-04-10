-- supabase/migrations/20260409_auth_security_events.sql
CREATE TABLE IF NOT EXISTS public.auth_security_events (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	flow TEXT NOT NULL CHECK (flow IN ('login', 'register', 'forgot_password')),
	outcome TEXT NOT NULL CHECK (
		outcome IN ('success', 'failed', 'captcha_failed', 'rate_limited', 'honeypot')
	),
	ip_hash TEXT NOT NULL,
	identifier_hash TEXT,
	context JSONB NOT NULL DEFAULT '{}'::jsonb,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS auth_security_events_flow_created_at_idx
	ON public.auth_security_events (flow, created_at DESC);

CREATE INDEX IF NOT EXISTS auth_security_events_flow_ip_hash_created_at_idx
	ON public.auth_security_events (flow, ip_hash, created_at DESC);

CREATE INDEX IF NOT EXISTS auth_security_events_flow_identifier_hash_created_at_idx
	ON public.auth_security_events (flow, identifier_hash, created_at DESC)
	WHERE identifier_hash IS NOT NULL;

ALTER TABLE public.auth_security_events ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.auth_security_events FROM anon, authenticated;
GRANT SELECT, INSERT ON public.auth_security_events TO service_role;
