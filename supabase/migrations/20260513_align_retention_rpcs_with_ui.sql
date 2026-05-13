-- supabase/migrations/20260513_align_retention_rpcs_with_ui.sql
--
-- Reshape the cohort/retention RPCs introduced in
-- 20260408_retention_first_touch_capture.sql so the admin analytics panel
-- can call them directly instead of routing through a TypeScript aggregator
-- in src/lib/server/cohortAnalytics.ts. Three changes:
--
--   1. get_entry_surface_overview: expose comment_rate_denominator,
--      signup_rate_denominator, registration_rate_denominator (the panel
--      uses these for "—" placeholders + low-sample gating). Apply per-row
--      D7 maturity to commented/signed_up/registered counts so partial
--      cohorts no longer leak into the denominator. Sort mature surfaces
--      first, then by retained_d7 quality.
--
--   2. get_cohort_retention_curve: switch from per-row to bucket-level
--      maturity (zero out numerator AND denominator when the cohort week
--      isn't fully mature for the given offset). Add cohort_week_end and
--      per-window is_mature_* flags so the heatmap can dim incomplete
--      weeks. Surface commented/signed_up/registered within_d7 alongside
--      retention, which the panel renders side by side.
--
--   3. get_source_overview: new RPC for the acquisition-source drilldown.
--      Same shape semantics as get_entry_surface_overview but grouped by
--      acquisition_source within a required entry_surface.
--
-- get_acquisition_mix_by_week already matched the TS aggregator; left
-- untouched.

BEGIN;

-- Return-type changes require DROP + CREATE (CREATE OR REPLACE can't
-- alter the function signature).
DROP FUNCTION IF EXISTS public.get_entry_surface_overview(DATE, DATE, TEXT);
DROP FUNCTION IF EXISTS public.get_cohort_retention_curve(DATE, DATE, TEXT, TEXT);

CREATE FUNCTION public.get_entry_surface_overview(
	p_from DATE DEFAULT NULL,
	p_to DATE DEFAULT NULL,
	p_acquisition_source TEXT DEFAULT NULL
)
RETURNS TABLE(
	entry_surface TEXT,
	new_visitors BIGINT,
	commented_within_d7 BIGINT,
	comment_rate_denominator BIGINT,
	comment_rate_pct DOUBLE PRECISION,
	signed_up_within_d7 BIGINT,
	signup_rate_denominator BIGINT,
	signup_rate_pct DOUBLE PRECISION,
	registered_within_d7 BIGINT,
	registration_rate_denominator BIGINT,
	registration_rate_pct DOUBLE PRECISION,
	retained_d1 BIGINT,
	retained_d1_denominator BIGINT,
	retained_d1_pct DOUBLE PRECISION,
	retained_d7 BIGINT,
	retained_d7_denominator BIGINT,
	retained_d7_pct DOUBLE PRECISION,
	retained_d30 BIGINT,
	retained_d30_denominator BIGINT,
	retained_d30_pct DOUBLE PRECISION,
	avg_engaged_minutes_within_d7 DOUBLE PRECISION
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
	WITH bounds AS (
		SELECT
			COALESCE(p_from, public.analytics_local_date(NOW()) - 56) AS from_date,
			COALESCE(p_to, public.analytics_local_date(NOW()) - 1) AS to_date,
			public.analytics_local_date(NOW()) AS today
	),
	filtered AS (
		SELECT d.*, b.today
		FROM public.daily_visitor_cohorts d
		CROSS JOIN bounds b
		WHERE d.cohort_date BETWEEN b.from_date AND b.to_date
			AND (
				COALESCE(BTRIM(p_acquisition_source), '') = ''
				OR d.acquisition_source = p_acquisition_source
			)
	),
	agg AS (
		SELECT
			f.entry_surface,
			COALESCE(SUM(f.cohort_size), 0)::BIGINT AS new_visitors,

			COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.commented_within_d7 ELSE 0 END), 0)::BIGINT AS commented_within_d7,
			COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.signed_up_within_d7 ELSE 0 END), 0)::BIGINT AS signed_up_within_d7,
			COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.registered_within_d7 ELSE 0 END), 0)::BIGINT AS registered_within_d7,
			COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.engaged_ms_total_within_d7 ELSE 0 END), 0)::BIGINT AS engaged_ms_total_within_d7,
			COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.cohort_size ELSE 0 END), 0)::BIGINT AS d7_denominator,

			COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 1 THEN f.retained_d1 ELSE 0 END), 0)::BIGINT AS retained_d1,
			COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 1 THEN f.cohort_size ELSE 0 END), 0)::BIGINT AS retained_d1_denominator,

			COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.retained_d7 ELSE 0 END), 0)::BIGINT AS retained_d7,

			COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 30 THEN f.retained_d30 ELSE 0 END), 0)::BIGINT AS retained_d30,
			COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 30 THEN f.cohort_size ELSE 0 END), 0)::BIGINT AS retained_d30_denominator
		FROM filtered f
		GROUP BY f.entry_surface
	)
	SELECT
		a.entry_surface,
		a.new_visitors,
		a.commented_within_d7,
		a.d7_denominator AS comment_rate_denominator,
		(CASE WHEN a.d7_denominator > 0
			THEN ROUND(a.commented_within_d7::NUMERIC / a.d7_denominator::NUMERIC * 100, 2)
			ELSE 0
		END)::DOUBLE PRECISION AS comment_rate_pct,
		a.signed_up_within_d7,
		a.d7_denominator AS signup_rate_denominator,
		(CASE WHEN a.d7_denominator > 0
			THEN ROUND(a.signed_up_within_d7::NUMERIC / a.d7_denominator::NUMERIC * 100, 2)
			ELSE 0
		END)::DOUBLE PRECISION AS signup_rate_pct,
		a.registered_within_d7,
		a.d7_denominator AS registration_rate_denominator,
		(CASE WHEN a.d7_denominator > 0
			THEN ROUND(a.registered_within_d7::NUMERIC / a.d7_denominator::NUMERIC * 100, 2)
			ELSE 0
		END)::DOUBLE PRECISION AS registration_rate_pct,
		a.retained_d1,
		a.retained_d1_denominator,
		(CASE WHEN a.retained_d1_denominator > 0
			THEN ROUND(a.retained_d1::NUMERIC / a.retained_d1_denominator::NUMERIC * 100, 2)
			ELSE 0
		END)::DOUBLE PRECISION AS retained_d1_pct,
		a.retained_d7,
		a.d7_denominator AS retained_d7_denominator,
		(CASE WHEN a.d7_denominator > 0
			THEN ROUND(a.retained_d7::NUMERIC / a.d7_denominator::NUMERIC * 100, 2)
			ELSE 0
		END)::DOUBLE PRECISION AS retained_d7_pct,
		a.retained_d30,
		a.retained_d30_denominator,
		(CASE WHEN a.retained_d30_denominator > 0
			THEN ROUND(a.retained_d30::NUMERIC / a.retained_d30_denominator::NUMERIC * 100, 2)
			ELSE 0
		END)::DOUBLE PRECISION AS retained_d30_pct,
		(CASE WHEN a.d7_denominator > 0
			THEN ROUND(a.engaged_ms_total_within_d7::NUMERIC / a.d7_denominator::NUMERIC / 60000, 2)
			ELSE 0
		END)::DOUBLE PRECISION AS avg_engaged_minutes_within_d7
	FROM agg a
	ORDER BY
		CASE WHEN a.d7_denominator >= 25 THEN 1 ELSE 0 END DESC,
		(CASE WHEN a.d7_denominator > 0
			THEN a.retained_d7::NUMERIC / a.d7_denominator::NUMERIC
			ELSE 0
		END) DESC,
		a.registered_within_d7 DESC,
		a.new_visitors DESC,
		a.entry_surface ASC;
$$;

CREATE FUNCTION public.get_cohort_retention_curve(
	p_from DATE DEFAULT NULL,
	p_to DATE DEFAULT NULL,
	p_entry_surface TEXT DEFAULT NULL,
	p_acquisition_source TEXT DEFAULT NULL
)
RETURNS TABLE(
	cohort_week DATE,
	cohort_week_end DATE,
	new_visitors BIGINT,
	commented_within_d7 BIGINT,
	comment_rate_denominator BIGINT,
	comment_rate_pct DOUBLE PRECISION,
	signed_up_within_d7 BIGINT,
	signup_rate_denominator BIGINT,
	signup_rate_pct DOUBLE PRECISION,
	registered_within_d7 BIGINT,
	registration_rate_denominator BIGINT,
	registration_rate_pct DOUBLE PRECISION,
	retained_d1 BIGINT,
	retained_d1_denominator BIGINT,
	retained_d1_pct DOUBLE PRECISION,
	is_mature_d1 BOOLEAN,
	retained_d3 BIGINT,
	retained_d3_denominator BIGINT,
	retained_d3_pct DOUBLE PRECISION,
	is_mature_d3 BOOLEAN,
	retained_d7 BIGINT,
	retained_d7_denominator BIGINT,
	retained_d7_pct DOUBLE PRECISION,
	is_mature_d7 BOOLEAN,
	retained_d14 BIGINT,
	retained_d14_denominator BIGINT,
	retained_d14_pct DOUBLE PRECISION,
	is_mature_d14 BOOLEAN,
	retained_d30 BIGINT,
	retained_d30_denominator BIGINT,
	retained_d30_pct DOUBLE PRECISION,
	is_mature_d30 BOOLEAN,
	avg_engaged_minutes_within_d7 DOUBLE PRECISION,
	is_mature_within_d7 BOOLEAN
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
	WITH bounds AS (
		SELECT
			COALESCE(p_from, public.analytics_local_date(NOW()) - 56) AS from_date,
			COALESCE(p_to, public.analytics_local_date(NOW()) - 1) AS to_date,
			public.analytics_local_date(NOW()) AS today
	),
	filtered AS (
		SELECT d.*, b.today
		FROM public.daily_visitor_cohorts d
		CROSS JOIN bounds b
		WHERE d.cohort_date BETWEEN b.from_date AND b.to_date
			AND (
				COALESCE(BTRIM(p_entry_surface), '') = ''
				OR d.entry_surface = p_entry_surface
			)
			AND (
				COALESCE(BTRIM(p_acquisition_source), '') = ''
				OR d.acquisition_source = p_acquisition_source
			)
	),
	weekly AS (
		SELECT
			DATE_TRUNC('week', f.cohort_date::TIMESTAMP)::DATE AS cohort_week,
			MAX(f.today) AS today,
			COALESCE(SUM(f.cohort_size), 0)::BIGINT AS new_visitors,
			COALESCE(SUM(f.commented_within_d7), 0)::BIGINT AS commented_raw,
			COALESCE(SUM(f.signed_up_within_d7), 0)::BIGINT AS signed_up_raw,
			COALESCE(SUM(f.registered_within_d7), 0)::BIGINT AS registered_raw,
			COALESCE(SUM(f.retained_d1), 0)::BIGINT AS retained_d1_raw,
			COALESCE(SUM(f.retained_d3), 0)::BIGINT AS retained_d3_raw,
			COALESCE(SUM(f.retained_d7), 0)::BIGINT AS retained_d7_raw,
			COALESCE(SUM(f.retained_d14), 0)::BIGINT AS retained_d14_raw,
			COALESCE(SUM(f.retained_d30), 0)::BIGINT AS retained_d30_raw,
			COALESCE(SUM(f.engaged_ms_total_within_d7), 0)::BIGINT AS engaged_ms_raw
		FROM filtered f
		GROUP BY DATE_TRUNC('week', f.cohort_date::TIMESTAMP)::DATE
	),
	flagged AS (
		SELECT
			w.cohort_week,
			(w.cohort_week + 6) AS cohort_week_end,
			w.new_visitors,
			w.commented_raw,
			w.signed_up_raw,
			w.registered_raw,
			w.retained_d1_raw,
			w.retained_d3_raw,
			w.retained_d7_raw,
			w.retained_d14_raw,
			w.retained_d30_raw,
			w.engaged_ms_raw,
			((w.cohort_week + 6) <= w.today - 1)  AS is_mature_d1,
			((w.cohort_week + 6) <= w.today - 3)  AS is_mature_d3,
			((w.cohort_week + 6) <= w.today - 7)  AS is_mature_d7,
			((w.cohort_week + 6) <= w.today - 14) AS is_mature_d14,
			((w.cohort_week + 6) <= w.today - 30) AS is_mature_d30,
			((w.cohort_week + 6) <= w.today - 7)  AS is_mature_within_d7
		FROM weekly w
	)
	SELECT
		g.cohort_week,
		g.cohort_week_end,
		g.new_visitors,

		(CASE WHEN g.is_mature_within_d7 THEN g.commented_raw ELSE 0 END)::BIGINT AS commented_within_d7,
		(CASE WHEN g.is_mature_within_d7 THEN g.new_visitors ELSE 0 END)::BIGINT AS comment_rate_denominator,
		(CASE WHEN g.is_mature_within_d7 AND g.new_visitors > 0
			THEN ROUND(g.commented_raw::NUMERIC / g.new_visitors::NUMERIC * 100, 2)
			ELSE 0
		END)::DOUBLE PRECISION AS comment_rate_pct,

		(CASE WHEN g.is_mature_within_d7 THEN g.signed_up_raw ELSE 0 END)::BIGINT AS signed_up_within_d7,
		(CASE WHEN g.is_mature_within_d7 THEN g.new_visitors ELSE 0 END)::BIGINT AS signup_rate_denominator,
		(CASE WHEN g.is_mature_within_d7 AND g.new_visitors > 0
			THEN ROUND(g.signed_up_raw::NUMERIC / g.new_visitors::NUMERIC * 100, 2)
			ELSE 0
		END)::DOUBLE PRECISION AS signup_rate_pct,

		(CASE WHEN g.is_mature_within_d7 THEN g.registered_raw ELSE 0 END)::BIGINT AS registered_within_d7,
		(CASE WHEN g.is_mature_within_d7 THEN g.new_visitors ELSE 0 END)::BIGINT AS registration_rate_denominator,
		(CASE WHEN g.is_mature_within_d7 AND g.new_visitors > 0
			THEN ROUND(g.registered_raw::NUMERIC / g.new_visitors::NUMERIC * 100, 2)
			ELSE 0
		END)::DOUBLE PRECISION AS registration_rate_pct,

		(CASE WHEN g.is_mature_d1 THEN g.retained_d1_raw ELSE 0 END)::BIGINT AS retained_d1,
		(CASE WHEN g.is_mature_d1 THEN g.new_visitors ELSE 0 END)::BIGINT AS retained_d1_denominator,
		(CASE WHEN g.is_mature_d1 AND g.new_visitors > 0
			THEN ROUND(g.retained_d1_raw::NUMERIC / g.new_visitors::NUMERIC * 100, 2)
			ELSE 0
		END)::DOUBLE PRECISION AS retained_d1_pct,
		g.is_mature_d1,

		(CASE WHEN g.is_mature_d3 THEN g.retained_d3_raw ELSE 0 END)::BIGINT AS retained_d3,
		(CASE WHEN g.is_mature_d3 THEN g.new_visitors ELSE 0 END)::BIGINT AS retained_d3_denominator,
		(CASE WHEN g.is_mature_d3 AND g.new_visitors > 0
			THEN ROUND(g.retained_d3_raw::NUMERIC / g.new_visitors::NUMERIC * 100, 2)
			ELSE 0
		END)::DOUBLE PRECISION AS retained_d3_pct,
		g.is_mature_d3,

		(CASE WHEN g.is_mature_d7 THEN g.retained_d7_raw ELSE 0 END)::BIGINT AS retained_d7,
		(CASE WHEN g.is_mature_d7 THEN g.new_visitors ELSE 0 END)::BIGINT AS retained_d7_denominator,
		(CASE WHEN g.is_mature_d7 AND g.new_visitors > 0
			THEN ROUND(g.retained_d7_raw::NUMERIC / g.new_visitors::NUMERIC * 100, 2)
			ELSE 0
		END)::DOUBLE PRECISION AS retained_d7_pct,
		g.is_mature_d7,

		(CASE WHEN g.is_mature_d14 THEN g.retained_d14_raw ELSE 0 END)::BIGINT AS retained_d14,
		(CASE WHEN g.is_mature_d14 THEN g.new_visitors ELSE 0 END)::BIGINT AS retained_d14_denominator,
		(CASE WHEN g.is_mature_d14 AND g.new_visitors > 0
			THEN ROUND(g.retained_d14_raw::NUMERIC / g.new_visitors::NUMERIC * 100, 2)
			ELSE 0
		END)::DOUBLE PRECISION AS retained_d14_pct,
		g.is_mature_d14,

		(CASE WHEN g.is_mature_d30 THEN g.retained_d30_raw ELSE 0 END)::BIGINT AS retained_d30,
		(CASE WHEN g.is_mature_d30 THEN g.new_visitors ELSE 0 END)::BIGINT AS retained_d30_denominator,
		(CASE WHEN g.is_mature_d30 AND g.new_visitors > 0
			THEN ROUND(g.retained_d30_raw::NUMERIC / g.new_visitors::NUMERIC * 100, 2)
			ELSE 0
		END)::DOUBLE PRECISION AS retained_d30_pct,
		g.is_mature_d30,

		(CASE WHEN g.is_mature_within_d7 AND g.new_visitors > 0
			THEN ROUND(g.engaged_ms_raw::NUMERIC / g.new_visitors::NUMERIC / 60000, 2)
			ELSE 0
		END)::DOUBLE PRECISION AS avg_engaged_minutes_within_d7,
		g.is_mature_within_d7
	FROM flagged g
	ORDER BY g.cohort_week ASC;
$$;

CREATE OR REPLACE FUNCTION public.get_source_overview(
	p_from DATE DEFAULT NULL,
	p_to DATE DEFAULT NULL,
	p_entry_surface TEXT DEFAULT NULL
)
RETURNS TABLE(
	acquisition_source TEXT,
	new_visitors BIGINT,
	commented_within_d7 BIGINT,
	comment_rate_denominator BIGINT,
	comment_rate_pct DOUBLE PRECISION,
	signed_up_within_d7 BIGINT,
	signup_rate_denominator BIGINT,
	signup_rate_pct DOUBLE PRECISION,
	registered_within_d7 BIGINT,
	registration_rate_denominator BIGINT,
	registration_rate_pct DOUBLE PRECISION,
	retained_d7 BIGINT,
	retained_d7_denominator BIGINT,
	retained_d7_pct DOUBLE PRECISION,
	avg_engaged_minutes_within_d7 DOUBLE PRECISION
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
	WITH bounds AS (
		SELECT
			COALESCE(p_from, public.analytics_local_date(NOW()) - 56) AS from_date,
			COALESCE(p_to, public.analytics_local_date(NOW()) - 1) AS to_date,
			public.analytics_local_date(NOW()) AS today
	),
	filtered AS (
		SELECT d.*, b.today
		FROM public.daily_visitor_cohorts d
		CROSS JOIN bounds b
		WHERE COALESCE(BTRIM(p_entry_surface), '') <> ''
			AND d.entry_surface = p_entry_surface
			AND d.cohort_date BETWEEN b.from_date AND b.to_date
	),
	agg AS (
		SELECT
			f.acquisition_source,
			COALESCE(SUM(f.cohort_size), 0)::BIGINT AS new_visitors,
			COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.commented_within_d7 ELSE 0 END), 0)::BIGINT AS commented_within_d7,
			COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.signed_up_within_d7 ELSE 0 END), 0)::BIGINT AS signed_up_within_d7,
			COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.registered_within_d7 ELSE 0 END), 0)::BIGINT AS registered_within_d7,
			COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.retained_d7 ELSE 0 END), 0)::BIGINT AS retained_d7,
			COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.engaged_ms_total_within_d7 ELSE 0 END), 0)::BIGINT AS engaged_ms_total_within_d7,
			COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.cohort_size ELSE 0 END), 0)::BIGINT AS d7_denominator
		FROM filtered f
		GROUP BY f.acquisition_source
	)
	SELECT
		a.acquisition_source,
		a.new_visitors,
		a.commented_within_d7,
		a.d7_denominator AS comment_rate_denominator,
		(CASE WHEN a.d7_denominator > 0
			THEN ROUND(a.commented_within_d7::NUMERIC / a.d7_denominator::NUMERIC * 100, 2)
			ELSE 0
		END)::DOUBLE PRECISION AS comment_rate_pct,
		a.signed_up_within_d7,
		a.d7_denominator AS signup_rate_denominator,
		(CASE WHEN a.d7_denominator > 0
			THEN ROUND(a.signed_up_within_d7::NUMERIC / a.d7_denominator::NUMERIC * 100, 2)
			ELSE 0
		END)::DOUBLE PRECISION AS signup_rate_pct,
		a.registered_within_d7,
		a.d7_denominator AS registration_rate_denominator,
		(CASE WHEN a.d7_denominator > 0
			THEN ROUND(a.registered_within_d7::NUMERIC / a.d7_denominator::NUMERIC * 100, 2)
			ELSE 0
		END)::DOUBLE PRECISION AS registration_rate_pct,
		a.retained_d7,
		a.d7_denominator AS retained_d7_denominator,
		(CASE WHEN a.d7_denominator > 0
			THEN ROUND(a.retained_d7::NUMERIC / a.d7_denominator::NUMERIC * 100, 2)
			ELSE 0
		END)::DOUBLE PRECISION AS retained_d7_pct,
		(CASE WHEN a.d7_denominator > 0
			THEN ROUND(a.engaged_ms_total_within_d7::NUMERIC / a.d7_denominator::NUMERIC / 60000, 2)
			ELSE 0
		END)::DOUBLE PRECISION AS avg_engaged_minutes_within_d7
	FROM agg a
	ORDER BY
		CASE WHEN a.d7_denominator >= 25 THEN 1 ELSE 0 END DESC,
		(CASE WHEN a.d7_denominator > 0
			THEN a.retained_d7::NUMERIC / a.d7_denominator::NUMERIC
			ELSE 0
		END) DESC,
		a.registered_within_d7 DESC,
		a.new_visitors DESC,
		a.acquisition_source ASC;
$$;

GRANT EXECUTE ON FUNCTION public.get_entry_surface_overview(DATE, DATE, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_cohort_retention_curve(DATE, DATE, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_source_overview(DATE, DATE, TEXT) TO authenticated;

COMMIT;
