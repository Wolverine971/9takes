-- scripts/classify-newsletter-signup-spam.sql
WITH recent AS (
	SELECT
		s.id AS signup_id,
		s.email,
		s.created_at,
		s.first_visit_at,
		s.first_landing_path,
		s.first_acquisition_source,
		s.first_referrer_host,
		s.first_touch_fingerprint,
		encode(digest(lower(trim(s.email)), 'sha256'), 'hex') AS email_hash
	FROM signups s
	WHERE s.created_at >= '2026-06-14'::timestamptz
),
auth AS (
	SELECT
		r.signup_id,
		count(e.id) AS auth_events,
		count(e.id) FILTER (WHERE e.flow = 'register' AND e.outcome = 'honeypot') AS register_honeypot,
		count(e.id) FILTER (
			WHERE e.flow = 'forgot_password'
				AND e.outcome IN ('captcha_failed', 'honeypot', 'rate_limited')
		) AS forgot_blocked,
		count(e.id) FILTER (WHERE e.flow = 'login' AND e.outcome = 'failed') AS login_failed
	FROM recent r
	LEFT JOIN auth_security_events e
		ON e.identifier_hash = r.email_hash
		AND e.created_at BETWEEN r.created_at - interval '10 minutes'
			AND r.created_at + interval '10 minutes'
	GROUP BY r.signup_id
),
pre_signup AS (
	SELECT
		r.signup_id,
		count(v.*) AS visits_before_signup,
		count(DISTINCT v.path) AS distinct_paths_before_signup,
		coalesce(sum(v.engaged_ms), 0) AS engaged_ms_total,
		max(v.max_scroll_pct) AS max_scroll_pct
	FROM recent r
	LEFT JOIN page_analytics_visits v
		ON v.fingerprint = r.first_touch_fingerprint
		AND v.started_at BETWEEN r.first_visit_at - interval '1 second'
			AND r.created_at + interval '5 seconds'
	GROUP BY r.signup_id
),
classified AS (
	SELECT
		r.*,
		a.auth_events,
		a.register_honeypot,
		a.forgot_blocked,
		a.login_failed,
		p.visits_before_signup,
		p.distinct_paths_before_signup,
		p.engaged_ms_total,
		p.max_scroll_pct,
		CASE
			WHEN a.register_honeypot > 0
				OR (a.login_failed > 0 AND a.forgot_blocked > 0)
				THEN 'very_likely_bot_submitted'
			WHEN a.auth_events > 0
				OR (
					r.first_landing_path IN ('/login', '/register')
					AND p.max_scroll_pct = 0
					AND extract(epoch FROM (r.created_at - r.first_visit_at)) < 180
				)
				THEN 'likely_bot_submitted'
			WHEN r.first_acquisition_source LIKE 'search/%'
				AND a.auth_events = 0
				THEN 'possibly_real'
			ELSE 'review'
		END AS classification
	FROM recent r
	JOIN auth a USING (signup_id)
	JOIN pre_signup p USING (signup_id)
)
SELECT
	classification,
	signup_id,
	email,
	created_at,
	first_landing_path,
	first_acquisition_source,
	auth_events,
	register_honeypot,
	forgot_blocked,
	login_failed,
	visits_before_signup,
	distinct_paths_before_signup,
	engaged_ms_total,
	max_scroll_pct
FROM classified
ORDER BY
	CASE classification
		WHEN 'very_likely_bot_submitted' THEN 1
		WHEN 'likely_bot_submitted' THEN 2
		WHEN 'review' THEN 3
		WHEN 'possibly_real' THEN 4
		ELSE 5
	END,
	created_at;
