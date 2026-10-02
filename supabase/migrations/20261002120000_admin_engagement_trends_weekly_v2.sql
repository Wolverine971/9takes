-- Honest weekly admin growth series: v2 of admin_engagement_trends_30_days.
--
-- Why: the 30-day daily RPC counts raw rows. About 85% of "visitors" are bots,
-- "comments" include DJ's own admin replies and removed comments, and email
-- signups / waitlist rows include two bot waves (Nov 2025 waitlist, Jun 2026
-- newsletter). A 30-day window also cannot tell "just dropped" from "was always
-- zero". This RPC returns up to 104 Monday-start weeks (the dashboard asks for
-- 26) with a human-filtered and a raw value side by side for every metric.
--
-- Weeks are Monday-start in America/New_York, matching visitor_day_activity
-- (which buckets with public.analytics_local_date). The last row is the current,
-- partial week. visitor_day_activity is refreshed about every 12 hours, so the
-- current week's visitor counts can lag by up to half a day.
--
-- Definitions (shared with the 2026-09-30 funnel audit):
--   admin            profiles.admin, plus every fingerprint ever tied to an admin
--                    (page visits, comments, give-first events, first touch).
--   human visitor    a non-admin fingerprint with >= 10s engaged time on at least
--                    one day of the week. raw_visitors = every tracked fingerprint.
--   returning human  a human visitor whose first-ever visit was before that week.
--   human comment    question comments/replies (comments) + personality-page
--                    discussion comments (blog_comments), excluding removed rows,
--                    admin authors and admin fingerprints. AI takes live in
--                    comments_ai / nine_takes and are never counted.
--   contributor      distinct person (author id, else fingerprint, else IP) with
--                    a human comment that week. Returning = had a human comment
--                    in an earlier week (matched on author id or fingerprint).
--   real signup      email signup that is NOT: quarantined as a bot
--                    (email_unsubscribes reason bot%), a flagged waitlist bot, an
--                    admin / @9takes.com address, an auth-page-first landing
--                    (/login, /register, /forgotPassword with internal source:
--                    the Jun 2026 wave), a dotted-Gmail pattern (3+ dots), or an
--                    email with a non-success auth_security_events row within
--                    10 minutes (the 2026-06-19 classifier's evidence).
--   registration     non-admin profile whose email is not a known bot.
--   booking          real coaching_waitlist add (not flagged, not admin, not
--                    created by a talk note) + talk_notes (not admin) +
--                    consulting_sessions. raw_bookings counts every row.
--
-- Only the server-side service role may call it. The dashboard detects when this
-- function is missing and falls back to admin_engagement_trends_30_days.

-- Admin fingerprint lookup scans page_analytics_visits by user_id.
CREATE INDEX IF NOT EXISTS idx_page_visits_user_id
	ON public.page_analytics_visits (user_id)
	WHERE user_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.admin_engagement_trends_weekly_v2(
	p_weeks INTEGER DEFAULT 26,
	p_demo_time BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
	week_start DATE,
	human_visitors BIGINT,
	returning_human_visitors BIGINT,
	raw_visitors BIGINT,
	human_comments BIGINT,
	raw_comments BIGINT,
	contributors BIGINT,
	returning_contributors BIGINT,
	real_signups BIGINT,
	raw_signups BIGINT,
	registrations BIGINT,
	raw_registrations BIGINT,
	bookings BIGINT,
	raw_bookings BIGINT,
	waitlist_adds BIGINT,
	talk_notes BIGINT,
	consulting_sessions BIGINT
)
LANGUAGE sql
SECURITY INVOKER
STABLE
SET search_path = pg_catalog, public, extensions, pg_temp
SET timezone = 'UTC'
AS $$
	WITH bounds AS (
		SELECT
			b.this_week - 7 * (b.n_weeks - 1) AS first_week,
			b.this_week,
			((b.this_week - 7 * (b.n_weeks - 1))::TIMESTAMP AT TIME ZONE 'America/New_York') AS first_ts
		FROM (
			SELECT
				date_trunc('week', timezone('America/New_York', now()))::DATE AS this_week,
				LEAST(GREATEST(COALESCE(p_weeks, 26), 1), 104) AS n_weeks
		) b
	),
	weeks AS (
		SELECT (b.first_week + 7 * i)::DATE AS wk
		FROM bounds b
		CROSS JOIN generate_series(0, (b.this_week - b.first_week) / 7) AS i
	),
	admin_profiles AS (
		SELECT p.id, lower(btrim(p.email)) AS email
		FROM public.profiles p
		WHERE p.admin IS TRUE
	),
	admin_fingerprints AS (
		SELECT v.fingerprint
		FROM public.page_analytics_visits v
		WHERE v.user_id IN (SELECT ap.id FROM admin_profiles ap)
			AND v.fingerprint IS NOT NULL
		UNION
		SELECT c.fingerprint
		FROM public.comments c
		WHERE c.author_id IN (SELECT ap.id FROM admin_profiles ap)
			AND c.fingerprint IS NOT NULL
		UNION
		SELECT g.fingerprint
		FROM public.give_first_funnel_events g
		WHERE g.user_id IN (SELECT ap.id FROM admin_profiles ap)
			AND g.fingerprint IS NOT NULL
		UNION
		SELECT p.first_touch_fingerprint
		FROM public.profiles p
		WHERE p.admin IS TRUE
			AND p.first_touch_fingerprint IS NOT NULL
	),
	bot_emails AS (
		SELECT lower(btrim(u.email)) AS email
		FROM public.email_unsubscribes u
		WHERE u.reason ILIKE 'bot%'
			AND u.email IS NOT NULL
		UNION
		SELECT lower(btrim(w.email))
		FROM public.coaching_waitlist w
		WHERE (w.flagged_at IS NOT NULL OR w.flagged_reason IS NOT NULL)
			AND w.email IS NOT NULL
	),

	-- Visitors -----------------------------------------------------------------
	visitor_weeks AS (
		SELECT
			date_trunc('week', a.activity_date::TIMESTAMP)::DATE AS wk,
			a.fingerprint,
			MAX(a.engaged_ms_total) >= 10000 AS engaged
		FROM public.visitor_day_activity a
		CROSS JOIN bounds b
		WHERE a.activity_date >= b.first_week
		GROUP BY 1, 2
	),
	human_visitor_weeks AS (
		SELECT vw.wk, vw.fingerprint
		FROM visitor_weeks vw
		WHERE vw.engaged
			AND NOT EXISTS (SELECT 1 FROM admin_fingerprints af WHERE af.fingerprint = vw.fingerprint)
	),
	visitor_rollup AS (
		SELECT
			raw.wk,
			raw.raw_visitors,
			COALESCE(hv.human_visitors, 0)::BIGINT AS human_visitors,
			COALESCE(hv.returning_human_visitors, 0)::BIGINT AS returning_human_visitors
		FROM (
			SELECT vw.wk, COUNT(*)::BIGINT AS raw_visitors
			FROM visitor_weeks vw
			GROUP BY vw.wk
		) raw
		LEFT JOIN (
			SELECT
				h.wk,
				COUNT(*)::BIGINT AS human_visitors,
				COUNT(*) FILTER (WHERE ft.first_visit_date < h.wk)::BIGINT AS returning_human_visitors
			FROM human_visitor_weeks h
			LEFT JOIN public.visitor_first_touch ft ON ft.fingerprint = h.fingerprint
			GROUP BY h.wk
		) hv ON hv.wk = raw.wk
	),

	-- Comments and contributors (full history, so "returning" can look back) --
	contributions AS (
		SELECT
			c.created_at,
			c.author_id,
			c.fingerprint,
			COALESCE(c.author_id::TEXT, c.fingerprint, 'ip:' || c.ip) AS who,
			(
				c.removed IS NOT TRUE
				AND NOT EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.id = c.author_id)
				AND NOT EXISTS (SELECT 1 FROM admin_fingerprints af WHERE af.fingerprint = c.fingerprint)
			) AS is_human
		FROM public.comments c
		UNION ALL
		SELECT
			bc.created_at,
			bc.author_id,
			bc.fingerprint,
			COALESCE(bc.author_id::TEXT, bc.fingerprint, 'ip:' || bc.ip) AS who,
			(
				NOT EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.id = bc.author_id)
				AND NOT EXISTS (SELECT 1 FROM admin_fingerprints af WHERE af.fingerprint = bc.fingerprint)
			) AS is_human
		FROM public.blog_comments bc
	),
	contribution_weeks AS (
		SELECT
			x.wk,
			x.who,
			x.is_human,
			x.is_human AND EXISTS (
				SELECT 1
				FROM contributions prior
				WHERE prior.is_human
					AND prior.created_at < (x.wk::TIMESTAMP AT TIME ZONE 'America/New_York')
					AND (
						(x.author_id IS NOT NULL AND prior.author_id = x.author_id)
						OR (x.fingerprint IS NOT NULL AND prior.fingerprint = x.fingerprint)
					)
			) AS is_returning
		FROM (
			SELECT
				date_trunc('week', timezone('America/New_York', c.created_at))::DATE AS wk,
				c.*
			FROM contributions c
			CROSS JOIN bounds b
			WHERE c.created_at >= b.first_ts
		) x
	),
	comment_rollup AS (
		SELECT
			cw.wk,
			COUNT(*)::BIGINT AS raw_comments,
			COUNT(*) FILTER (WHERE cw.is_human)::BIGINT AS human_comments,
			COUNT(DISTINCT cw.who) FILTER (WHERE cw.is_human)::BIGINT AS contributors,
			COUNT(DISTINCT cw.who) FILTER (WHERE cw.is_returning)::BIGINT AS returning_contributors
		FROM contribution_weeks cw
		GROUP BY cw.wk
	),

	-- Email signups ------------------------------------------------------------
	signup_rows AS (
		SELECT
			date_trunc('week', timezone('America/New_York', s.created_at))::DATE AS wk,
			NOT (
				EXISTS (SELECT 1 FROM bot_emails be WHERE be.email = s.email_norm)
				OR EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.email = s.email_norm)
				OR s.email_norm LIKE '%@9takes.com'
				OR (
					COALESCE(s.first_landing_path, '') IN ('/login', '/register', '/forgotPassword')
					AND COALESCE(s.first_acquisition_source, 'internal') = 'internal'
				)
				OR s.email_norm ~ '^[^@]*\.[^@]*\.[^@]*\.[^@]*@(gmail|googlemail)\.com$'
				OR EXISTS (
					SELECT 1
					FROM public.auth_security_events e
					WHERE e.identifier_hash = encode(extensions.digest(s.email_norm, 'sha256'), 'hex')
						AND e.outcome IS DISTINCT FROM 'success'
						AND e.created_at BETWEEN s.created_at - INTERVAL '10 minutes'
							AND s.created_at + INTERVAL '10 minutes'
				)
			) AS is_real
		FROM (
			SELECT sg.*, lower(btrim(COALESCE(sg.email, ''))) AS email_norm
			FROM public.signups sg
			CROSS JOIN bounds b
			WHERE sg.created_at >= b.first_ts
		) s
	),
	signup_rollup AS (
		SELECT
			sr.wk,
			COUNT(*)::BIGINT AS raw_signups,
			COUNT(*) FILTER (WHERE sr.is_real)::BIGINT AS real_signups
		FROM signup_rows sr
		GROUP BY sr.wk
	),

	-- Registrations ------------------------------------------------------------
	registration_rows AS (
		SELECT p.created_at, p.admin IS TRUE AS is_admin, lower(btrim(COALESCE(p.email, ''))) AS email_norm
		FROM public.profiles p
		WHERE NOT COALESCE(p_demo_time, FALSE)
		UNION ALL
		SELECT d.created_at, d.admin IS TRUE AS is_admin, lower(btrim(COALESCE(d.email, ''))) AS email_norm
		FROM public.profiles_demo d
		WHERE COALESCE(p_demo_time, FALSE)
	),
	registration_rollup AS (
		SELECT
			date_trunc('week', timezone('America/New_York', r.created_at))::DATE AS wk,
			COUNT(*)::BIGINT AS raw_registrations,
			COUNT(*) FILTER (
				WHERE NOT r.is_admin
					AND NOT EXISTS (SELECT 1 FROM bot_emails be WHERE be.email = r.email_norm)
			)::BIGINT AS registrations
		FROM registration_rows r
		CROSS JOIN bounds b
		WHERE r.created_at >= b.first_ts
		GROUP BY 1
	),

	-- Bookings: waitlist + Talk to DJ notes + consulting sessions --------------
	booking_rows AS (
		SELECT
			w.created_at,
			'waitlist'::TEXT AS kind,
			(
				w.flagged_at IS NULL
				AND w.flagged_reason IS NULL
				AND NOT EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.email = lower(btrim(w.email)))
				-- A note that asks for a session also creates a waitlist row; count the person once.
				AND NOT EXISTS (SELECT 1 FROM public.talk_notes tn WHERE tn.waitlist_id = w.id)
			) AS is_real
		FROM public.coaching_waitlist w
		UNION ALL
		SELECT
			t.created_at,
			'talk_note'::TEXT AS kind,
			NOT EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.email = lower(btrim(t.email))) AS is_real
		FROM public.talk_notes t
		UNION ALL
		SELECT cs.created_at, 'session'::TEXT AS kind, TRUE AS is_real
		FROM public.consulting_sessions cs
	),
	booking_rollup AS (
		SELECT
			date_trunc('week', timezone('America/New_York', br.created_at))::DATE AS wk,
			COUNT(*)::BIGINT AS raw_bookings,
			COUNT(*) FILTER (WHERE br.is_real)::BIGINT AS bookings,
			COUNT(*) FILTER (WHERE br.is_real AND br.kind = 'waitlist')::BIGINT AS waitlist_adds,
			COUNT(*) FILTER (WHERE br.is_real AND br.kind = 'talk_note')::BIGINT AS note_count,
			COUNT(*) FILTER (WHERE br.is_real AND br.kind = 'session')::BIGINT AS session_count
		FROM booking_rows br
		CROSS JOIN bounds b
		WHERE br.created_at >= b.first_ts
		GROUP BY 1
	)
	SELECT
		w.wk AS week_start,
		COALESCE(v.human_visitors, 0)::BIGINT,
		COALESCE(v.returning_human_visitors, 0)::BIGINT,
		COALESCE(v.raw_visitors, 0)::BIGINT,
		COALESCE(c.human_comments, 0)::BIGINT,
		COALESCE(c.raw_comments, 0)::BIGINT,
		COALESCE(c.contributors, 0)::BIGINT,
		COALESCE(c.returning_contributors, 0)::BIGINT,
		COALESCE(s.real_signups, 0)::BIGINT,
		COALESCE(s.raw_signups, 0)::BIGINT,
		COALESCE(r.registrations, 0)::BIGINT,
		COALESCE(r.raw_registrations, 0)::BIGINT,
		COALESCE(bk.bookings, 0)::BIGINT,
		COALESCE(bk.raw_bookings, 0)::BIGINT,
		COALESCE(bk.waitlist_adds, 0)::BIGINT,
		COALESCE(bk.note_count, 0)::BIGINT,
		COALESCE(bk.session_count, 0)::BIGINT
	FROM weeks w
	LEFT JOIN visitor_rollup v ON v.wk = w.wk
	LEFT JOIN comment_rollup c ON c.wk = w.wk
	LEFT JOIN signup_rollup s ON s.wk = w.wk
	LEFT JOIN registration_rollup r ON r.wk = w.wk
	LEFT JOIN booking_rollup bk ON bk.wk = w.wk
	ORDER BY w.wk;
$$;

COMMENT ON FUNCTION public.admin_engagement_trends_weekly_v2(INTEGER, BOOLEAN) IS
	'Weekly (Mon-start, America/New_York) human-filtered vs raw admin growth series. See migration header for definitions.';

REVOKE ALL ON FUNCTION public.admin_engagement_trends_weekly_v2(INTEGER, BOOLEAN) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_engagement_trends_weekly_v2(INTEGER, BOOLEAN) TO service_role;
