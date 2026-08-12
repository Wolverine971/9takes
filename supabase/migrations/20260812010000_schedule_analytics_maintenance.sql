-- supabase/migrations/20260812010000_schedule_analytics_maintenance.sql
-- Keep analytics maintenance out of request paths and drain accumulated telemetry
-- in bounded batches so cleanup cannot monopolize the database.

-- These tasks now run through the scheduler below. Existing request RPCs still
-- ask to claim the old maintenance slots, so reject only those claims before
-- they can add cleanup or rollup work to a user request.
CREATE OR REPLACE FUNCTION public.claim_telemetry_cleanup_slot(
	p_task_name TEXT,
	p_now TIMESTAMPTZ DEFAULT NOW(),
	p_min_interval INTERVAL DEFAULT INTERVAL '6 hours'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_now TIMESTAMPTZ := COALESCE(p_now, NOW());
	v_claimed BOOLEAN := FALSE;
BEGIN
	IF COALESCE(BTRIM(p_task_name), '') = '' THEN
		RETURN FALSE;
	END IF;

	IF BTRIM(p_task_name) = ANY (
		ARRAY[
			'site_telemetry_cleanup',
			'content_daily_rollup_refresh',
			'retention_rollup_refresh'
		]
	) THEN
		RETURN FALSE;
	END IF;

	INSERT INTO public.telemetry_maintenance_state (task_name, last_run_at)
	VALUES (p_task_name, TIMESTAMPTZ '1970-01-01 00:00:00+00')
	ON CONFLICT (task_name) DO NOTHING;

	UPDATE public.telemetry_maintenance_state
	SET last_run_at = v_now
	WHERE task_name = p_task_name
		AND last_run_at <= v_now - COALESCE(p_min_interval, INTERVAL '6 hours')
	RETURNING TRUE INTO v_claimed;

	RETURN COALESCE(v_claimed, FALSE);
END;
$$;

CREATE INDEX IF NOT EXISTS idx_page_sessions_last_seen_at
	ON public.page_analytics_sessions (last_seen_at);

CREATE OR REPLACE FUNCTION public.cleanup_site_telemetry(
	p_now TIMESTAMPTZ DEFAULT NOW()
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_now TIMESTAMPTZ := COALESCE(p_now, NOW());
	v_page_cutoff TIMESTAMPTZ := v_now - INTERVAL '90 days';
	v_access_cutoff TIMESTAMPTZ := v_now - INTERVAL '7 days';
	v_visitors_cutoff TIMESTAMPTZ := v_now - INTERVAL '45 days';
	v_batch_limit CONSTANT INTEGER := 5000;
	v_deleted_page_visits INTEGER := 0;
	v_deleted_page_sessions INTEGER := 0;
	v_deleted_access_events INTEGER := 0;
	v_deleted_visitors INTEGER := 0;
BEGIN
	WITH expired AS (
		SELECT id
		FROM public.page_analytics_visits
		WHERE started_at < v_page_cutoff
		ORDER BY started_at, id
		LIMIT v_batch_limit
	), deleted AS (
		DELETE FROM public.page_analytics_visits v
		USING expired e
		WHERE v.id = e.id
		RETURNING 1
	)
	SELECT COUNT(*)::INTEGER INTO v_deleted_page_visits FROM deleted;

	WITH expired AS (
		SELECT s.id
		FROM public.page_analytics_sessions s
		WHERE s.last_seen_at < v_page_cutoff
			AND NOT EXISTS (
				SELECT 1
				FROM public.page_analytics_visits v
				WHERE v.session_id = s.id
			)
		ORDER BY s.last_seen_at, s.id
		LIMIT v_batch_limit
	), deleted AS (
		DELETE FROM public.page_analytics_sessions s
		USING expired e
		WHERE s.id = e.id
		RETURNING 1
	)
	SELECT COUNT(*)::INTEGER INTO v_deleted_page_sessions FROM deleted;

	WITH expired AS (
		SELECT id
		FROM public.content_access_events
		WHERE requested_at < v_access_cutoff
		ORDER BY requested_at, id
		LIMIT v_batch_limit
	), deleted AS (
		DELETE FROM public.content_access_events e
		USING expired x
		WHERE e.id = x.id
		RETURNING 1
	)
	SELECT COUNT(*)::INTEGER INTO v_deleted_access_events FROM deleted;

	WITH expired AS (
		SELECT v.id
		FROM public.visitors v
		WHERE COALESCE(v.updated_at, v.created_at) < v_visitors_cutoff
			AND NOT EXISTS (
				SELECT 1
				FROM public.blog_comments bc
				WHERE bc.fingerprint = v.fingerprint
			)
		ORDER BY COALESCE(v.updated_at, v.created_at), v.id
		LIMIT v_batch_limit
	), deleted AS (
		DELETE FROM public.visitors v
		USING expired e
		WHERE v.id = e.id
		RETURNING 1
	)
	SELECT COUNT(*)::INTEGER INTO v_deleted_visitors FROM deleted;

	RETURN jsonb_build_object(
		'page_analytics_visits_deleted', v_deleted_page_visits,
		'page_analytics_sessions_deleted', v_deleted_page_sessions,
		'content_access_events_deleted', v_deleted_access_events,
		'visitors_deleted', v_deleted_visitors,
		'batch_limit', v_batch_limit,
		'has_more', (
			v_deleted_page_visits = v_batch_limit
			OR v_deleted_page_sessions = v_batch_limit
			OR v_deleted_access_events = v_batch_limit
			OR v_deleted_visitors = v_batch_limit
		),
		'ran_at', v_now
	);
END;
$$;

-- Repair at most the rolling 45-day content window once when this migration lands.
-- Subsequent refreshes only recompute today and yesterday.
SELECT public.refresh_content_analytics_daily(
	GREATEST(
		COALESCE(
			(
				SELECT MAX(metric_date) - 1
				FROM public.content_analytics_daily
				WHERE content_type = 'people'
			),
			public.analytics_local_date(NOW()) - 44
		),
		public.analytics_local_date(NOW()) - 44
	),
	public.analytics_local_date(NOW()),
	'people'
);

-- pg_cron exists on the hosted project. Keep local/self-hosted migrations usable
-- when the extension is unavailable by installing jobs only when its schema exists.
DO $jobs$
BEGIN
	IF to_regnamespace('cron') IS NULL THEN
		RAISE NOTICE 'pg_cron is unavailable; analytics maintenance jobs were not installed';
		RETURN;
	END IF;

	IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = '9takes-telemetry-cleanup') THEN
		PERFORM cron.unschedule('9takes-telemetry-cleanup');
	END IF;
	IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = '9takes-content-analytics-refresh') THEN
		PERFORM cron.unschedule('9takes-content-analytics-refresh');
	END IF;
	IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = '9takes-retention-rollup-refresh') THEN
		PERFORM cron.unschedule('9takes-retention-rollup-refresh');
	END IF;

	PERFORM cron.schedule(
		'9takes-telemetry-cleanup',
		'*/15 * * * *',
		'SELECT public.cleanup_site_telemetry(NOW());'
	);

	PERFORM cron.schedule(
		'9takes-content-analytics-refresh',
		'15 * * * *',
		$$SELECT public.refresh_content_analytics_daily(
			public.analytics_local_date(NOW()) - 1,
			public.analytics_local_date(NOW()),
			'people'
		);$$
	);

	PERFORM cron.schedule(
		'9takes-retention-rollup-refresh',
		'35 4 * * *',
		'SELECT public.refresh_retention_rollups();'
	);
END;
$jobs$;
