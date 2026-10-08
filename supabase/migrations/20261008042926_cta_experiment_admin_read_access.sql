-- supabase/migrations/20261008042926_cta_experiment_admin_read_access.sql
-- The security baseline revoked default grants. RLS alone does not allow
-- authenticated admin HEAD/count requests to reach this table.
BEGIN;

ALTER TABLE public.cta_experiment_events ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.cta_experiment_events FROM PUBLIC, anon, authenticated;
REVOKE ALL ON SEQUENCE public.cta_experiment_events_id_seq FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS audit_admin_management ON public.cta_experiment_events;
DROP POLICY IF EXISTS cta_experiment_admin_read ON public.cta_experiment_events;
CREATE POLICY cta_experiment_admin_read ON public.cta_experiment_events
	FOR SELECT TO authenticated
	USING ((SELECT public.is_admin()));

-- Exact counts select id and filter by these three dimensions. Visitor metadata
-- (including path and fingerprint) is not needed by the report.
GRANT SELECT (id, experiment, variant, event) ON TABLE public.cta_experiment_events TO authenticated;
-- Keep existing service-role privileges and explicitly support event ingestion.
GRANT INSERT ON TABLE public.cta_experiment_events TO service_role;
GRANT USAGE ON SEQUENCE public.cta_experiment_events_id_seq TO service_role;

COMMIT;
