-- supabase/migrations/20260703_admin_consulting_dashboard_summary.sql
-- Purpose: Keep /admin/consulting dashboard aggregates in Postgres instead of
-- fetching full client/status/type lists into the SvelteKit loader.

CREATE INDEX IF NOT EXISTS idx_consulting_sessions_status_scheduled_at
	ON public.consulting_sessions (status, scheduled_at);

CREATE OR REPLACE FUNCTION public.get_admin_consulting_dashboard_summary()
RETURNS TABLE (
	total_clients BIGINT,
	active_clients BIGINT,
	pending_intakes BIGINT,
	waitlist_count BIGINT,
	status_counts JSONB,
	type_distribution JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
	IF auth.uid() IS NULL OR NOT EXISTS (
		SELECT 1
		FROM public.profiles p
		WHERE p.id = auth.uid()
			AND p.admin IS TRUE
	) THEN
		RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
	END IF;

	RETURN QUERY
	WITH client_counts AS (
		SELECT
			COUNT(*)::BIGINT AS total_count,
			COUNT(*) FILTER (WHERE status = 'active')::BIGINT AS active_count
		FROM public.consulting_clients
	),
	intake_counts AS (
		SELECT COUNT(*)::BIGINT AS pending_count
		FROM public.consulting_intake_forms
		WHERE status IN ('pending', 'sent')
	),
	waitlist_counts AS (
		SELECT COUNT(*)::BIGINT AS total_count
		FROM public.coaching_waitlist
	),
	status_rollup AS (
		SELECT COALESCE(jsonb_object_agg(status_key, client_count), '{}'::JSONB) AS counts
		FROM (
			SELECT
				COALESCE(status, 'unknown') AS status_key,
				COUNT(*)::BIGINT AS client_count
			FROM public.consulting_clients
			GROUP BY COALESCE(status, 'unknown')
		) s
	),
	type_rollup AS (
		SELECT COALESCE(jsonb_object_agg(enneagram_type::TEXT, client_count), '{}'::JSONB) AS counts
		FROM (
			SELECT
				enneagram_type,
				COUNT(*)::BIGINT AS client_count
			FROM public.consulting_clients
			WHERE enneagram_type IS NOT NULL
			GROUP BY enneagram_type
		) t
	)
	SELECT
		client_counts.total_count,
		client_counts.active_count,
		intake_counts.pending_count,
		waitlist_counts.total_count,
		status_rollup.counts,
		type_rollup.counts
	FROM client_counts
	CROSS JOIN intake_counts
	CROSS JOIN waitlist_counts
	CROSS JOIN status_rollup
	CROSS JOIN type_rollup;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_consulting_dashboard_summary() TO authenticated;
