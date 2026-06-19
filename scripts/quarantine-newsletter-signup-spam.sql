-- scripts/quarantine-newsletter-signup-spam.sql
-- Production write: suppress high-confidence bot-submitted newsletter signups.
-- This does not delete signup rows. It uses unsubscribe_email_direct so the
-- quarantine is visible in email_unsubscribes and reversible.

BEGIN;

CREATE TEMP TABLE newsletter_spam_quarantine_targets ON COMMIT DROP AS
WITH recent AS (
	SELECT
		s.id AS signup_id,
		s.email,
		s.created_at,
		s.first_visit_at,
		s.first_landing_path,
		s.first_acquisition_source,
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
		r.signup_id,
		r.email,
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
SELECT signup_id, email
FROM classified
WHERE classification = 'very_likely_bot_submitted';

DO $$
DECLARE
	v_target_count INTEGER;
BEGIN
	SELECT count(*) INTO v_target_count
	FROM newsletter_spam_quarantine_targets;

	IF v_target_count < 1 OR v_target_count > 100 THEN
		RAISE EXCEPTION 'Unexpected newsletter spam quarantine target count: %', v_target_count;
	END IF;
END $$;

WITH suppressed AS (
	SELECT unsubscribe_email_direct(
		email,
		'signups',
		signup_id::text,
		'bot_submitted_quarantine_2026-06-19'
	) AS email
	FROM newsletter_spam_quarantine_targets
)
SELECT count(*) AS suppressed_count
FROM suppressed;

COMMIT;
