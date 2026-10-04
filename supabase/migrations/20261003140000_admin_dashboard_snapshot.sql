-- supabase/migrations/20261003140000_admin_dashboard_snapshot.sql
-- Precompute the admin dashboard's slow aggregates.
--
-- Why: /admin fires four aggregate RPCs on every visit (honest weekly growth,
-- 30-day engagement, trending pages, retention summary). On the Micro instance
-- they cost 0.2-2s each (weekly growth spikes past 5s, and spills to temp at
-- the default 2MB work_mem), and the page waited for the slowest one. Their
-- numbers move hourly at most, so pg_cron refreshes them every 10 minutes into
-- one private table and the dashboard reads them in a single cheap call.
--
-- The dashboard falls back to the live RPCs when a snapshot row is missing or
-- older than its freshness window, so a stalled job degrades to the old (slow)
-- behaviour instead of to stale numbers.
--
-- Live data only (p_demo_time = FALSE); demo mode keeps calling the RPCs.
-- Keys carry the RPC parameters (see src/lib/server/adminDashboardSnapshot.ts),
-- so changing a parameter in the dashboard misses the snapshot instead of
-- reading a result computed for different inputs. Each payload keeps the RPC's
-- own row order.

CREATE SCHEMA IF NOT EXISTS private;

CREATE TABLE IF NOT EXISTS private.admin_dashboard_snapshot (
	key TEXT PRIMARY KEY,
	payload JSONB NOT NULL,
	refreshed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	duration_ms INTEGER NOT NULL DEFAULT 0
);

REVOKE ALL ON TABLE private.admin_dashboard_snapshot
	FROM PUBLIC, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION private.refresh_admin_dashboard_snapshot()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
SET work_mem = '16MB'
AS $$
DECLARE
	v_started TIMESTAMPTZ;
	v_payload JSONB;
	v_key TEXT;
	v_refreshed INTEGER := 0;
BEGIN
	-- get_admin_retention_summary requires an admin or service_role caller and
	-- pg_cron is neither, so claim service_role for this transaction only.
	PERFORM set_config('request.jwt.claims', '{"role":"service_role"}', TRUE);
	PERFORM set_config('request.jwt.claim.role', 'service_role', TRUE);

	-- Each block refreshes independently: one failing RPC keeps its last good row
	-- (which ages out of the dashboard's window) without blocking the others.
	BEGIN
		v_key := 'admin_engagement_trends_weekly_v2:27';
		v_started := clock_timestamp();
		SELECT COALESCE(jsonb_agg(to_jsonb(t) - 'ordinality' ORDER BY t.ordinality), '[]'::JSONB)
		INTO v_payload
		FROM public.admin_engagement_trends_weekly_v2(27, FALSE) WITH ORDINALITY AS t;

		INSERT INTO private.admin_dashboard_snapshot AS s (key, payload, refreshed_at, duration_ms)
		VALUES (v_key, v_payload, NOW(), EXTRACT(MILLISECONDS FROM clock_timestamp() - v_started)::INTEGER)
		ON CONFLICT (key) DO UPDATE
		SET payload = EXCLUDED.payload,
			refreshed_at = EXCLUDED.refreshed_at,
			duration_ms = EXCLUDED.duration_ms;
		v_refreshed := v_refreshed + 1;
	EXCEPTION WHEN OTHERS THEN
		RAISE WARNING 'admin dashboard snapshot % failed: %', v_key, SQLERRM;
	END;

	BEGIN
		v_key := 'admin_engagement_trends_30_days';
		v_started := clock_timestamp();
		SELECT COALESCE(jsonb_agg(to_jsonb(t) - 'ordinality' ORDER BY t.ordinality), '[]'::JSONB)
		INTO v_payload
		FROM public.admin_engagement_trends_30_days(FALSE) WITH ORDINALITY AS t;

		INSERT INTO private.admin_dashboard_snapshot AS s (key, payload, refreshed_at, duration_ms)
		VALUES (v_key, v_payload, NOW(), EXTRACT(MILLISECONDS FROM clock_timestamp() - v_started)::INTEGER)
		ON CONFLICT (key) DO UPDATE
		SET payload = EXCLUDED.payload,
			refreshed_at = EXCLUDED.refreshed_at,
			duration_ms = EXCLUDED.duration_ms;
		v_refreshed := v_refreshed + 1;
	EXCEPTION WHEN OTHERS THEN
		RAISE WARNING 'admin dashboard snapshot % failed: %', v_key, SQLERRM;
	END;

	BEGIN
		-- scope:baselineDays:minVisits:minUnique:limit, matching the dashboard's options.
		v_key := 'get_page_analytics_trending_pages:all:7:3:3:10';
		v_started := clock_timestamp();
		SELECT COALESCE(jsonb_agg(to_jsonb(t) - 'ordinality' ORDER BY t.ordinality), '[]'::JSONB)
		INTO v_payload
		FROM public.get_page_analytics_trending_pages(NULL, 7, 'all', 3, 3, 10) WITH ORDINALITY AS t;

		INSERT INTO private.admin_dashboard_snapshot AS s (key, payload, refreshed_at, duration_ms)
		VALUES (v_key, v_payload, NOW(), EXTRACT(MILLISECONDS FROM clock_timestamp() - v_started)::INTEGER)
		ON CONFLICT (key) DO UPDATE
		SET payload = EXCLUDED.payload,
			refreshed_at = EXCLUDED.refreshed_at,
			duration_ms = EXCLUDED.duration_ms;
		v_refreshed := v_refreshed + 1;
	EXCEPTION WHEN OTHERS THEN
		RAISE WARNING 'admin dashboard snapshot % failed: %', v_key, SQLERRM;
	END;

	BEGIN
		v_key := 'get_admin_retention_summary';
		v_started := clock_timestamp();
		v_payload := public.get_admin_retention_summary();

		INSERT INTO private.admin_dashboard_snapshot AS s (key, payload, refreshed_at, duration_ms)
		VALUES (v_key, v_payload, NOW(), EXTRACT(MILLISECONDS FROM clock_timestamp() - v_started)::INTEGER)
		ON CONFLICT (key) DO UPDATE
		SET payload = EXCLUDED.payload,
			refreshed_at = EXCLUDED.refreshed_at,
			duration_ms = EXCLUDED.duration_ms;
		v_refreshed := v_refreshed + 1;
	EXCEPTION WHEN OTHERS THEN
		RAISE WARNING 'admin dashboard snapshot % failed: %', v_key, SQLERRM;
	END;

	RETURN v_refreshed;
END;
$$;

REVOKE ALL ON FUNCTION private.refresh_admin_dashboard_snapshot()
	FROM PUBLIC, anon, authenticated, service_role;

-- The dashboard reads with the server-side service-role client only.
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_snapshot()
RETURNS TABLE (key TEXT, payload JSONB, refreshed_at TIMESTAMPTZ)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
	SELECT s.key, s.payload, s.refreshed_at
	FROM private.admin_dashboard_snapshot s;
$$;

REVOKE ALL ON FUNCTION public.get_admin_dashboard_snapshot()
	FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_snapshot() TO service_role;

-- Seed before scheduling so the first dashboard visit after deploy is fast.
SELECT private.refresh_admin_dashboard_snapshot();

DO $jobs$
BEGIN
	IF to_regnamespace('cron') IS NULL THEN
		RAISE NOTICE 'pg_cron is unavailable; admin dashboard snapshot refresh was not scheduled';
		RETURN;
	END IF;

	IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = '9takes-admin-dashboard-snapshot') THEN
		PERFORM cron.unschedule('9takes-admin-dashboard-snapshot');
	END IF;

	-- Offset from the */15 telemetry cleanup and the :15/:25 hourly refreshes.
	PERFORM cron.schedule(
		'9takes-admin-dashboard-snapshot',
		'3,13,23,33,43,53 * * * *',
		'SELECT private.refresh_admin_dashboard_snapshot();'
	);
END;
$jobs$;
