-- Daily admin traffic and participation, aligned on UTC calendar days.
-- Only the server-side service role may request these aggregates.

CREATE OR REPLACE FUNCTION public.admin_engagement_trends_30_days(p_demo_time BOOLEAN DEFAULT FALSE)
RETURNS TABLE (
	days DATE,
	visitors BIGINT,
	visitors_with_comments BIGINT,
	coaching BIGINT,
	signups BIGINT,
	user_signups BIGINT,
	questions_asked BIGINT,
	comments_created BIGINT
)
LANGUAGE sql
SECURITY INVOKER
STABLE
SET search_path = pg_catalog, public, extensions, pg_temp
SET timezone = 'UTC'
AS $$
	WITH date_bounds AS (
		SELECT CURRENT_DATE - (29 - day_offset) AS day
		FROM generate_series(0, 29) AS day_offset
	),
	visitor_days AS (
		SELECT DISTINCT
			(v.started_at AT TIME ZONE 'UTC')::DATE AS day,
			v.fingerprint
		FROM public.page_analytics_visits v
		WHERE (v.started_at AT TIME ZONE 'UTC')::DATE BETWEEN CURRENT_DATE - 29 AND CURRENT_DATE
			AND COALESCE(v.path, '') <> ''
			AND v.path !~ '^/(admin|api)(/|$)'
			AND v.path <> '/logout'
			AND v.path NOT LIKE '/account/unsubscribe%'
	),
	comment_days AS (
		SELECT
			(c.created_at AT TIME ZONE 'UTC')::DATE AS day,
			c.fingerprint,
			COUNT(*)::BIGINT AS comments_created
		FROM public.comments c
		WHERE c.created_at >= (CURRENT_DATE - 29)::TIMESTAMPTZ
			AND c.created_at < (CURRENT_DATE + 1)::TIMESTAMPTZ
		GROUP BY (c.created_at AT TIME ZONE 'UTC')::DATE, c.fingerprint
	),
	visitor_rollup AS (
		SELECT
			v.day,
			COUNT(v.fingerprint)::BIGINT AS visitors,
			COUNT(v.fingerprint) FILTER (WHERE c.fingerprint IS NOT NULL)::BIGINT AS visitors_with_comments
		FROM visitor_days v
		LEFT JOIN comment_days c ON c.day = v.day AND c.fingerprint = v.fingerprint
		GROUP BY v.day
	),
	comment_rollup AS (
		SELECT day, SUM(comments_created)::BIGINT AS comments_created
		FROM comment_days
		GROUP BY day
	),
	coaching_rollup AS (
		SELECT (created_at AT TIME ZONE 'UTC')::DATE AS day, COUNT(*)::BIGINT AS coaching
		FROM public.coaching_waitlist
		WHERE created_at >= (CURRENT_DATE - 29)::TIMESTAMPTZ
			AND created_at < (CURRENT_DATE + 1)::TIMESTAMPTZ
		GROUP BY (created_at AT TIME ZONE 'UTC')::DATE
	),
	signup_rollup AS (
		SELECT (created_at AT TIME ZONE 'UTC')::DATE AS day, COUNT(*)::BIGINT AS signups
		FROM public.signups
		WHERE created_at >= (CURRENT_DATE - 29)::TIMESTAMPTZ
			AND created_at < (CURRENT_DATE + 1)::TIMESTAMPTZ
		GROUP BY (created_at AT TIME ZONE 'UTC')::DATE
	),
	user_signup_rollup AS (
		SELECT day, COUNT(*)::BIGINT AS user_signups
		FROM (
			SELECT (created_at AT TIME ZONE 'UTC')::DATE AS day
			FROM public.profiles
			WHERE NOT COALESCE(p_demo_time, FALSE)
				AND created_at >= (CURRENT_DATE - 29)::TIMESTAMPTZ
				AND created_at < (CURRENT_DATE + 1)::TIMESTAMPTZ
			UNION ALL
			SELECT (created_at AT TIME ZONE 'UTC')::DATE AS day
			FROM public.profiles_demo
			WHERE COALESCE(p_demo_time, FALSE)
				AND created_at >= (CURRENT_DATE - 29)::TIMESTAMPTZ
				AND created_at < (CURRENT_DATE + 1)::TIMESTAMPTZ
		) profile_days
		GROUP BY day
	),
	question_rollup AS (
		SELECT (created_at AT TIME ZONE 'UTC')::DATE AS day, COUNT(*)::BIGINT AS questions_asked
		FROM public.questions
		WHERE created_at >= (CURRENT_DATE - 29)::TIMESTAMPTZ
			AND created_at < (CURRENT_DATE + 1)::TIMESTAMPTZ
		GROUP BY (created_at AT TIME ZONE 'UTC')::DATE
	)
	SELECT
		d.day AS days,
		COALESCE(v.visitors, 0)::BIGINT,
		COALESCE(v.visitors_with_comments, 0)::BIGINT,
		COALESCE(co.coaching, 0)::BIGINT,
		COALESCE(s.signups, 0)::BIGINT,
		COALESCE(u.user_signups, 0)::BIGINT,
		COALESCE(q.questions_asked, 0)::BIGINT,
		COALESCE(c.comments_created, 0)::BIGINT
	FROM date_bounds d
	LEFT JOIN visitor_rollup v ON v.day = d.day
	LEFT JOIN coaching_rollup co ON co.day = d.day
	LEFT JOIN signup_rollup s ON s.day = d.day
	LEFT JOIN user_signup_rollup u ON u.day = d.day
	LEFT JOIN question_rollup q ON q.day = d.day
	LEFT JOIN comment_rollup c ON c.day = d.day
	ORDER BY d.day;
$$;

REVOKE ALL ON FUNCTION public.admin_engagement_trends_30_days(BOOLEAN) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_engagement_trends_30_days(BOOLEAN) TO service_role;

CREATE INDEX IF NOT EXISTS idx_signups_created_at_desc
	ON public.signups (created_at DESC);
