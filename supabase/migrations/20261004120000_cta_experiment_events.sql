-- supabase/migrations/20261004120000_cta_experiment_events.sql
--
-- Copy experiments on calls to action (first: the beta card, "experimental
-- therapy, 9takes style", 2026-10-04). One row per visitor action, so a
-- readout can compare variants in SQL:
--   viewed     the card was at least half on screen (once per page per placement)
--   opened     the visitor tapped the card's button
--   submitted  the server saved a real signup (written by /api/beta-signup)
-- Written only with the service role. Admins can read it like the other
-- audit tables.

CREATE TABLE IF NOT EXISTS public.cta_experiment_events (
	id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	experiment TEXT NOT NULL,
	variant TEXT NOT NULL,
	event TEXT NOT NULL CHECK (event IN ('viewed', 'opened', 'submitted')),
	surface TEXT,
	placement TEXT,
	path TEXT,
	fingerprint TEXT
);

CREATE INDEX IF NOT EXISTS cta_experiment_events_experiment_created_at_idx
	ON public.cta_experiment_events (experiment, created_at DESC);

ALTER TABLE public.cta_experiment_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS audit_admin_management ON public.cta_experiment_events;
CREATE POLICY audit_admin_management ON public.cta_experiment_events
	FOR ALL TO authenticated
	USING ((SELECT public.is_admin()))
	WITH CHECK ((SELECT public.is_admin()));

COMMENT ON TABLE public.cta_experiment_events IS
	'Call-to-action copy experiments: viewed/opened/submitted per variant. Service-role writes only.';
