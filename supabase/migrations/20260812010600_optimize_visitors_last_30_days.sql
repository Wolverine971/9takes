-- supabase/migrations/20260812010600_optimize_visitors_last_30_days.sql
-- Created: 2026-08-12
--
-- Keep the daily unique-visitor scan on a compact, ordered index. The explicit UTC date
-- expression preserves the production RPC's calendar-day behavior while making it indexable.

CREATE INDEX IF NOT EXISTS idx_page_visits_nonutility_utc_day_fingerprint
	ON public.page_analytics_visits (
		((started_at AT TIME ZONE 'UTC')::DATE),
		fingerprint
	)
	INCLUDE (started_at)
	WHERE COALESCE(path, '') <> ''
		AND path !~ '^/(admin|api)(/|$)'
		AND path <> '/logout'
		AND path NOT LIKE '/account/unsubscribe%';

CREATE OR REPLACE FUNCTION public.visitors_last_30_days()
RETURNS TABLE (
	days DATE,
	number_of_visitors BIGINT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
SET timezone = 'UTC'
AS $$
	WITH date_bounds AS (
		SELECT generate_series(
			CURRENT_DATE - INTERVAL '29 days',
			CURRENT_DATE,
			INTERVAL '1 day'
		)::DATE AS day
	),
	daily_visitors AS (
		SELECT
			(v.started_at AT TIME ZONE 'UTC')::DATE AS day,
			COUNT(DISTINCT v.fingerprint)::BIGINT AS number_of_visitors
		FROM public.page_analytics_visits v
		WHERE (v.started_at AT TIME ZONE 'UTC')::DATE >= CURRENT_DATE - 29
			AND (v.started_at AT TIME ZONE 'UTC')::DATE <= CURRENT_DATE
			-- Keep this predicate text aligned with the partial index above.
			AND COALESCE(v.path, '') <> ''
			AND v.path !~ '^/(admin|api)(/|$)'
			AND v.path <> '/logout'
			AND v.path NOT LIKE '/account/unsubscribe%'
		GROUP BY (v.started_at AT TIME ZONE 'UTC')::DATE
	)
	SELECT
		b.day AS days,
		COALESCE(v.number_of_visitors, 0)::BIGINT AS number_of_visitors
	FROM date_bounds b
	LEFT JOIN daily_visitors v ON v.day = b.day
	ORDER BY b.day;
$$;

REVOKE ALL ON FUNCTION public.visitors_last_30_days() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.visitors_last_30_days()
	TO authenticated, service_role;
