-- Suppress permanent failures from the July/August 2026 reactivation send.
-- Evidence source: usersup@9takes.com Gmail delivery-status notices.
--
-- This script intentionally does not suppress temporary "Delivery incomplete"
-- notices unless Gmail subsequently reported a permanent failure.

BEGIN;

CREATE TEMP TABLE reactivation_hard_bounce_targets (
	email TEXT PRIMARY KEY,
	profile_id UUID NOT NULL,
	sequence_key TEXT NOT NULL,
	bounce_reason TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO reactivation_hard_bounce_targets (email, profile_id, sequence_key, bounce_reason)
VALUES
	('ana.tejerina@icalmeria.es', 'a4d55943-5a8d-4fbf-bc32-7b8a321b65bd', 'reactivation_dormant', 'recipient_does_not_exist_or_blocked'),
	('claresaunders1234@aol.com', 'f3619364-9e32-47e8-832e-7cfaccc3cfd7', 'reactivation_dormant', 'message_blocked'),
	('debwilliams202@gmail.com', '22fb2cae-aef4-4495-983a-87fa9b77edf3', 'reactivation_dormant', 'address_not_found'),
	('ladavo1339@funvane.com', 'a02b71b5-3021-4867-85fa-b69fcd756ba8', 'reactivation_zombies', 'message_not_delivered'),
	('meqymyxo@socam.me', '0ad86684-cdf3-4fdd-a8ee-7ec25695f2ad', 'reactivation_zombies', 'address_not_found'),
	('ratchevyordan1@gmail.com', '65bc9fbf-63d4-47c4-a3c4-1aa4df2a3244', 'reactivation_zombies', 'address_not_found'),
	('x3yl6f54yu@skygazerhub.com', '69618fbc-08db-4108-84c4-6aa439b718e9', 'reactivation_zombies', 'message_not_delivered');

CREATE TEMP TABLE reactivation_hard_bounce_sends (
	email_send_id UUID PRIMARY KEY,
	bounced_at TIMESTAMPTZ NOT NULL,
	bounce_reason TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO reactivation_hard_bounce_sends (email_send_id, bounced_at, bounce_reason)
VALUES
	('a6ec307d-9020-437a-935d-fe403143debd', '2026-07-29 18:15:00+00', 'Recipient does not exist; blocked by recipient-domain mail-flow rule'),
	('8fd79c28-92d1-4ce2-8a18-068a81a6cd07', '2026-08-02 22:15:00+00', 'Message blocked by recipient provider'),
	('8fb012d8-e474-4a2e-920b-99fd352ebd22', '2026-07-24 18:31:00+00', 'Address not found'),
	('5e1e407b-6a21-499f-9795-092a4492113c', '2026-07-29 18:45:00+00', 'Address not found'),
	('aa98d4ab-4bdf-4e4b-85af-59c2966a12f7', '2026-08-03 18:28:00+00', 'Message not delivered after Gmail retry window'),
	('f2a73286-2cf6-4a44-a4b1-6ce20f5ad9e2', '2026-07-29 19:01:00+00', 'Address not found'),
	('ab2c62ad-f5a3-4b57-b243-2d6e00a9ba90', '2026-08-03 19:15:00+00', 'Address not found'),
	('f9894f20-486b-4eba-bb9f-ea1e0af5d64b', '2026-08-02 18:00:00+00', 'Address not found'),
	('2a02eab3-947f-48fe-b8bc-cc94c793e335', '2026-08-01 19:08:00+00', 'Message not delivered after Gmail retry window');

DO $$
DECLARE
	v_target_count INTEGER;
	v_send_count INTEGER;
	v_profile_match_count INTEGER;
	v_enrollment_match_count INTEGER;
BEGIN
	SELECT COUNT(*) INTO v_target_count FROM reactivation_hard_bounce_targets;
	SELECT COUNT(*) INTO v_send_count FROM reactivation_hard_bounce_sends;

	SELECT COUNT(*)
	INTO v_profile_match_count
	FROM reactivation_hard_bounce_targets AS target
	JOIN profiles AS profile
		ON profile.id = target.profile_id
		AND normalize_email_text(profile.email) = target.email;

	SELECT COUNT(*)
	INTO v_enrollment_match_count
	FROM reactivation_hard_bounce_targets AS target
	JOIN email_sequence_enrollments AS enrollment
		ON normalize_email_text(enrollment.recipient_email) = target.email
	JOIN email_sequences AS sequence
		ON sequence.id = enrollment.sequence_id
		AND sequence.key = target.sequence_key
	WHERE enrollment.status IN ('active', 'processing', 'paused');

	IF v_target_count <> 7 OR v_send_count <> 9 THEN
		RAISE EXCEPTION 'Unexpected hard-bounce scope: % targets, % sends', v_target_count, v_send_count;
	END IF;

	IF v_profile_match_count <> 7 OR v_enrollment_match_count <> 7 THEN
		RAISE EXCEPTION 'Hard-bounce targets changed: % profiles, % active enrollments', v_profile_match_count, v_enrollment_match_count;
	END IF;

	IF EXISTS (
		SELECT 1
		FROM reactivation_hard_bounce_sends AS bounce
		LEFT JOIN email_sends AS send ON send.id = bounce.email_send_id
		WHERE send.id IS NULL OR send.status <> 'sent'
	) THEN
		RAISE EXCEPTION 'A targeted email send is missing or no longer in sent state';
	END IF;
END $$;

SELECT unsubscribe_email_direct(
	target.email,
	'profiles',
	target.profile_id::TEXT,
	'hard_bounce_reactivation_2026-08-03'
)
FROM reactivation_hard_bounce_targets AS target;

UPDATE email_sequence_enrollments AS enrollment
SET status = 'exited',
	exit_reason = 'hard_bounce',
	next_send_at = NULL,
	processing_started_at = NULL,
	updated_at = NOW()
FROM reactivation_hard_bounce_targets AS target,
	email_sequences AS sequence
WHERE sequence.id = enrollment.sequence_id
	AND sequence.key = target.sequence_key
	AND normalize_email_text(enrollment.recipient_email) = target.email
	AND enrollment.status IN ('active', 'processing', 'paused');

UPDATE email_sends AS send
SET status = 'bounced',
	bounced_at = bounce.bounced_at,
	bounce_reason = bounce.bounce_reason
FROM reactivation_hard_bounce_sends AS bounce
WHERE send.id = bounce.email_send_id;

INSERT INTO email_tracking_events (email_send_id, event_type, created_at)
SELECT bounce.email_send_id, 'bounce', bounce.bounced_at
FROM reactivation_hard_bounce_sends AS bounce
WHERE NOT EXISTS (
	SELECT 1
	FROM email_tracking_events AS event
	WHERE event.email_send_id = bounce.email_send_id
		AND event.event_type = 'bounce'
);

DO $$
DECLARE
	v_suppressed_count INTEGER;
	v_exited_count INTEGER;
	v_bounced_count INTEGER;
	v_event_count INTEGER;
BEGIN
	SELECT COUNT(*)
	INTO v_suppressed_count
	FROM reactivation_hard_bounce_targets AS target
	JOIN email_unsubscribes AS unsubscribe
		ON normalize_email_text(unsubscribe.email) = target.email;

	SELECT COUNT(*)
	INTO v_exited_count
	FROM reactivation_hard_bounce_targets AS target
	JOIN email_sequence_enrollments AS enrollment
		ON normalize_email_text(enrollment.recipient_email) = target.email
	JOIN email_sequences AS sequence
		ON sequence.id = enrollment.sequence_id
		AND sequence.key = target.sequence_key
	WHERE enrollment.status = 'exited'
		AND enrollment.exit_reason = 'hard_bounce';

	SELECT COUNT(*)
	INTO v_bounced_count
	FROM reactivation_hard_bounce_sends AS bounce
	JOIN email_sends AS send ON send.id = bounce.email_send_id
	WHERE send.status = 'bounced'
		AND send.bounced_at = bounce.bounced_at;

	SELECT COUNT(*)
	INTO v_event_count
	FROM reactivation_hard_bounce_sends AS bounce
	JOIN email_tracking_events AS event
		ON event.email_send_id = bounce.email_send_id
		AND event.event_type = 'bounce';

	IF v_suppressed_count <> 7
		OR v_exited_count <> 7
		OR v_bounced_count <> 9
		OR v_event_count <> 9 THEN
		RAISE EXCEPTION 'Hard-bounce verification failed: % suppressed, % exited, % bounced, % events',
			v_suppressed_count,
			v_exited_count,
			v_bounced_count,
			v_event_count;
	END IF;
END $$;

SELECT
	(SELECT COUNT(*) FROM reactivation_hard_bounce_targets) AS suppressed_addresses,
	(SELECT COUNT(*) FROM reactivation_hard_bounce_sends) AS bounced_sends;

COMMIT;
