-- supabase/migrations/20261120193000_server_only_rpcs.sql
--
-- Phase 2 of 2. APPLY ONLY AFTER the app build that calls these functions
-- through the service-role client is live in production. Applied earlier, it
-- stops page analytics and the take rate-limit check.
--
-- These functions take caller-supplied identifiers (visit keys, fingerprints,
-- IP strings, user ids), so they are called by the server, not by browsers.
-- can_see_comments_3 stays callable: it reads auth.uid() from the caller's
-- own session, so it has to run on the request's client.

DO $$
DECLARE
	r record;
BEGIN
	FOR r IN
		SELECT p.oid::regprocedure AS signature
		FROM pg_proc p
		JOIN pg_namespace n ON n.oid = p.pronamespace
		WHERE n.nspname = 'public'
			AND p.proname IN (
				'upsert_page_analytics_visit',
				'record_page_analytics_ping',
				'check_comment_rate_limit'
			)
	LOOP
		EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.signature);
		EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', r.signature);
	END LOOP;
END
$$;
