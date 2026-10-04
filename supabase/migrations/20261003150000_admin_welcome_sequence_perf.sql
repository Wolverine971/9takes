-- supabase/migrations/20261003150000_admin_welcome_sequence_perf.sql
-- Speed up /admin/welcome-sequence.
--
-- Why: the page's "last visit" column looks up page_analytics_sessions twice:
-- by user_id (the enrolled users), then by fingerprint (devices those users
-- signed in on). The table (~58k rows, 29MB) was indexed only on id,
-- session_key and last_seen_at, so both lookups were sequential scans of every
-- row (EXPLAIN 2026-10-03: cost ~3,370 each, 18-33ms warm on the Micro instance).
--
-- 1. user_id: partial index. Only signed-in sessions carry a user_id (~400
--    rows), so it stays tiny and anonymous session writes never touch it.
-- 2. fingerprint: re-adds idx_page_sessions_fingerprint_last_seen, dropped by
--    20260328_reduce_self_generated_usage.sql because nothing read it then. The
--    welcome page reads it now; at ~520 new sessions a day the write cost is
--    negligible.
-- 3. admin_sequence_step_metrics: the per-step delivered / opened / clicked
--    numbers were three exact-count requests per step (12 PostgREST round
--    trips for the 4-step welcome sequence). This returns them from one
--    GROUP BY with the same rules: delivered = status sent or delivered;
--    opened / clicked = timestamp present, whatever the status. SECURITY
--    INVOKER, so email_sends RLS still applies, plus the explicit admin /
--    service_role check used by get_admin_retention_summary. The page calls it
--    with the signed-in admin's client and falls back to the count queries
--    while this migration is pending.
--
-- Plain CREATE INDEX (migrations run in a transaction, so no CONCURRENTLY).
-- Each build takes well under a second on this table; session writes wait.

CREATE INDEX IF NOT EXISTS idx_page_sessions_user_last_seen
	ON public.page_analytics_sessions (user_id, last_seen_at DESC)
	WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_page_sessions_fingerprint_last_seen
	ON public.page_analytics_sessions (fingerprint, last_seen_at DESC);

CREATE OR REPLACE FUNCTION public.admin_sequence_step_metrics(p_sequence_id UUID)
RETURNS TABLE (
	step_number INTEGER,
	total_sent BIGINT,
	total_opened BIGINT,
	total_clicked BIGINT
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
	IF auth.role() IS DISTINCT FROM 'service_role' AND NOT public.is_admin() THEN
		RAISE EXCEPTION 'Administrator access required' USING ERRCODE = '42501';
	END IF;

	RETURN QUERY
	SELECT
		send.sequence_step_number,
		COUNT(*) FILTER (WHERE send.status IN ('sent', 'delivered')),
		COUNT(*) FILTER (WHERE send.opened_at IS NOT NULL),
		COUNT(*) FILTER (WHERE send.clicked_at IS NOT NULL)
	FROM public.email_sends AS send
	WHERE send.sequence_id = p_sequence_id
		AND send.sequence_step_number IS NOT NULL
	GROUP BY send.sequence_step_number
	ORDER BY send.sequence_step_number;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_sequence_step_metrics(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_sequence_step_metrics(UUID) TO authenticated, service_role;
