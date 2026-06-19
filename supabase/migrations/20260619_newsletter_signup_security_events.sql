-- supabase/migrations/20260619_newsletter_signup_security_events.sql
-- Records abuse signals for the public newsletter signup endpoint.

CREATE TABLE IF NOT EXISTS public.newsletter_signup_security_events (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	outcome TEXT NOT NULL CHECK (
		outcome IN (
			'success',
			'invalid_email',
			'already_exists',
			'honeypot',
			'too_fast',
			'bot_user_agent',
			'rate_limited',
			'auth_abuse',
			'blocked_email_pattern',
			'failed'
		)
	),
	ip_hash TEXT NOT NULL,
	identifier_hash TEXT,
	fingerprint TEXT,
	user_agent_hash TEXT,
	context JSONB NOT NULL DEFAULT '{}'::jsonb,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS newsletter_signup_security_events_created_at_idx
	ON public.newsletter_signup_security_events (created_at DESC);

CREATE INDEX IF NOT EXISTS newsletter_signup_security_events_ip_created_at_idx
	ON public.newsletter_signup_security_events (ip_hash, created_at DESC);

CREATE INDEX IF NOT EXISTS newsletter_signup_security_events_identifier_created_at_idx
	ON public.newsletter_signup_security_events (identifier_hash, created_at DESC)
	WHERE identifier_hash IS NOT NULL;

ALTER TABLE public.newsletter_signup_security_events ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.newsletter_signup_security_events FROM anon, authenticated;
GRANT SELECT, INSERT ON public.newsletter_signup_security_events TO service_role;
