-- supabase/migrations/20260906120000_account_reply_notification_emails.sql
-- Created: 2026-09-06
--
-- Email leg for logged-in reply notifications.
--
-- Why: the notify_on_comment trigger (20260725_notifications.sql) inserts a
-- `reply_to_take` row and stops there. A logged-in user whose take gets a
-- direct reply learns about it only if they happen to come back and open the
-- feed. The one proven retention event on the site was a user returning 26
-- days after a reply because nothing told them. This migration turns each new
-- reply_to_take row into a queued transactional email, processed by the
-- existing /api/cron/process-reply-notifications job.
--
-- Design:
--   * The notification row IS the outbox. Email state lives on the row
--     (email_status / email_claimed_at / emailed_at / email_attempts /
--     email_error), so there is no second table to keep in sync and the
--     moderation cleanup trigger that deletes a notification also retracts
--     its pending email for free.
--   * Existing rows stay email_status = 'none'. We never email history.
--   * Only NEW reply_to_take rows are enqueued ('pending'). The other three
--     kinds keep 'none'; the email digest, if it ever ships, is a separate
--     concern gated by notification_preferences.email_digest.
--   * A per-user opt-out (notification_preferences.email_replies, default ON)
--     is checked at send time, not at enqueue time, so flipping the toggle
--     takes effect on anything still in the queue. Turning off the in-app
--     reply_to_take flag still suppresses the row entirely (and therefore the
--     email) because enqueue_notification returns before inserting.
--   * Anonymity is unchanged: the email says "A Type N replied" from the
--     frozen actor_enneagram column and nothing else about the actor.
--   * All new RPCs are SECURITY DEFINER and service_role only. The worker
--     runs with the service key; no client role can claim, mark, or flip a
--     preference for another user through these functions.

-- ---------------------------------------------------------------------------
-- 1. Preference: email me when someone replies to my take (default ON)
-- ---------------------------------------------------------------------------

ALTER TABLE public.notification_preferences
	ADD COLUMN IF NOT EXISTS email_replies BOOLEAN NOT NULL DEFAULT TRUE;

-- ---------------------------------------------------------------------------
-- 2. Email delivery state on the notification row
-- ---------------------------------------------------------------------------

ALTER TABLE public.notifications
	ADD COLUMN IF NOT EXISTS email_status TEXT NOT NULL DEFAULT 'none',
	ADD COLUMN IF NOT EXISTS email_claimed_at TIMESTAMPTZ,
	ADD COLUMN IF NOT EXISTS emailed_at TIMESTAMPTZ,
	ADD COLUMN IF NOT EXISTS email_attempts INT NOT NULL DEFAULT 0,
	ADD COLUMN IF NOT EXISTS email_error TEXT;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'notifications_email_status_check'
			AND conrelid = 'public.notifications'::regclass
	) THEN
		ALTER TABLE public.notifications
			ADD CONSTRAINT notifications_email_status_check CHECK (
				email_status IN (
					'none',
					'pending',
					'processing',
					'sent',
					'failed',
					'suppressed',
					'skipped'
				)
			);
	END IF;
END;
$$;

-- The worker only ever scans for queued work, so the index is partial.
CREATE INDEX IF NOT EXISTS idx_notifications_email_queue
	ON public.notifications (kind, email_status)
	WHERE email_status IN ('pending', 'processing');

-- Backfill: deliberately none. Every pre-existing row keeps the column
-- default 'none'. Emailing a backlog of old replies would be spam, not
-- retention.

-- ---------------------------------------------------------------------------
-- 3. enqueue_notification: new reply_to_take rows start 'pending'
-- ---------------------------------------------------------------------------
--
-- Same body as 20260725_notifications.sql with one change: the INSERT now
-- sets email_status. The per-kind in-app gate and the
-- (recipient_id, kind, source_id) dedupe are preserved exactly, so retries
-- and trigger replays still cannot double-enqueue an email.

CREATE OR REPLACE FUNCTION public.enqueue_notification(
	p_recipient_id UUID,
	p_kind TEXT,
	p_actor_enneagram TEXT,
	p_question_id BIGINT,
	p_comment_id BIGINT,
	p_subject_comment_id BIGINT,
	p_source_id BIGINT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
	IF p_recipient_id IS NULL OR p_source_id IS NULL THEN
		RETURN;
	END IF;

	IF NOT public.notification_kind_enabled(p_recipient_id, p_kind) THEN
		RETURN;
	END IF;

	INSERT INTO public.notifications (
		recipient_id,
		kind,
		actor_enneagram,
		question_id,
		comment_id,
		subject_comment_id,
		source_id,
		email_status
	) VALUES (
		p_recipient_id,
		p_kind,
		COALESCE(p_actor_enneagram, 'rando'),
		p_question_id,
		p_comment_id,
		p_subject_comment_id,
		p_source_id,
		CASE WHEN p_kind = 'reply_to_take' THEN 'pending' ELSE 'none' END
	)
	ON CONFLICT (recipient_id, kind, source_id) DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public.enqueue_notification(UUID, TEXT, TEXT, BIGINT, BIGINT, BIGINT, BIGINT)
	FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enqueue_notification(UUID, TEXT, TEXT, BIGINT, BIGINT, BIGINT, BIGINT)
	TO service_role;

-- ---------------------------------------------------------------------------
-- 4. Claim queued reply emails (worker, service_role only)
-- ---------------------------------------------------------------------------
--
-- Atomically moves up to p_limit reply_to_take rows from 'pending' (or a
-- 'processing' row whose claim is older than 15 minutes, i.e. a worker that
-- died mid-batch) to 'processing', bumps email_attempts, and returns
-- everything the worker needs to render and send in one round trip.
--
-- Rows whose reply or subject comment is gone or removed are marked
-- 'skipped' here rather than returned; the moderation trigger normally
-- deletes those notifications outright, so this is belt-and-braces.
-- Recipients with no usable email address are skipped the same way.
--
-- FOR UPDATE SKIP LOCKED keeps two overlapping cron invocations from
-- claiming the same row.

CREATE OR REPLACE FUNCTION public.claim_account_reply_notification_emails(p_limit INT DEFAULT 10)
RETURNS TABLE (
	notification_id BIGINT,
	recipient_id UUID,
	recipient_email TEXT,
	recipient_first_name TEXT,
	actor_enneagram TEXT,
	question_id BIGINT,
	question_url TEXT,
	question_text TEXT,
	reply_comment_id BIGINT,
	reply_text TEXT,
	subject_comment_id BIGINT,
	subject_text TEXT,
	email_replies BOOLEAN,
	attempt_count INT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_row public.notifications%ROWTYPE;
	v_reply_text TEXT;
	v_reply_removed BOOLEAN;
	v_subject_text TEXT;
	v_subject_removed BOOLEAN;
	v_email TEXT;
	v_first_name TEXT;
	v_question_url TEXT;
	v_question_text TEXT;
	v_email_replies BOOLEAN;
BEGIN
	-- A row that has already burned its retries and then stalled in
	-- 'processing' must not be reclaimed forever. Park it as failed.
	UPDATE public.notifications n
	SET email_status = 'failed',
		email_error = COALESCE(n.email_error, 'stale_claim')
	WHERE n.kind = 'reply_to_take'
		AND n.email_status = 'processing'
		AND n.email_claimed_at < NOW() - INTERVAL '15 minutes'
		AND n.email_attempts >= 3;

	FOR v_row IN
		SELECT candidate.*
		FROM public.notifications candidate
		WHERE candidate.kind = 'reply_to_take'
			AND (
				candidate.email_status = 'pending'
				OR (
					candidate.email_status = 'processing'
					AND candidate.email_claimed_at < NOW() - INTERVAL '15 minutes'
				)
			)
			AND candidate.email_attempts < 3
		ORDER BY candidate.created_at ASC, candidate.id ASC
		FOR UPDATE OF candidate SKIP LOCKED
		LIMIT LEAST(GREATEST(COALESCE(p_limit, 10), 1), 50)
	LOOP
		-- The reply being announced.
		SELECT c.comment, c.removed
		INTO v_reply_text, v_reply_removed
		FROM public.comments c
		WHERE c.id = v_row.comment_id;

		IF NOT FOUND OR v_reply_removed IS TRUE OR NULLIF(BTRIM(COALESCE(v_reply_text, '')), '') IS NULL THEN
			UPDATE public.notifications n
			SET email_status = 'skipped', email_error = 'reply_removed', email_claimed_at = NOW()
			WHERE n.id = v_row.id;
			CONTINUE;
		END IF;

		-- The recipient's own take that was replied to.
		SELECT c.comment, c.removed
		INTO v_subject_text, v_subject_removed
		FROM public.comments c
		WHERE c.id = v_row.subject_comment_id;

		IF NOT FOUND OR v_subject_removed IS TRUE THEN
			UPDATE public.notifications n
			SET email_status = 'skipped', email_error = 'subject_removed', email_claimed_at = NOW()
			WHERE n.id = v_row.id;
			CONTINUE;
		END IF;

		SELECT NULLIF(BTRIM(COALESCE(p.email, '')), ''), NULLIF(BTRIM(COALESCE(p.first_name, '')), '')
		INTO v_email, v_first_name
		FROM public.profiles p
		WHERE p.id = v_row.recipient_id;

		IF v_email IS NULL THEN
			UPDATE public.notifications n
			SET email_status = 'skipped', email_error = 'no_recipient_email', email_claimed_at = NOW()
			WHERE n.id = v_row.id;
			CONTINUE;
		END IF;

		-- Edge: a give-first visitor who subscribed anonymously to replies on
		-- this take and later registered with the same address would otherwise
		-- get the anonymous outbox email AND this one. The anonymous leg owns
		-- that conversation while its subscription is active.
		IF EXISTS (
			SELECT 1
			FROM public.comment_reply_subscriptions s
			WHERE s.comment_id = v_row.subject_comment_id
				AND s.unsubscribed_at IS NULL
				AND s.normalized_email = public.normalize_email_text(v_email)
		) THEN
			UPDATE public.notifications n
			SET email_status = 'skipped', email_error = 'anonymous_subscription_active', email_claimed_at = NOW()
			WHERE n.id = v_row.id;
			CONTINUE;
		END IF;

		SELECT q.url, COALESCE(q.question_formatted, q.question)
		INTO v_question_url, v_question_text
		FROM public.questions q
		WHERE q.id = v_row.question_id;

		IF v_question_url IS NULL THEN
			UPDATE public.notifications n
			SET email_status = 'skipped', email_error = 'no_question', email_claimed_at = NOW()
			WHERE n.id = v_row.id;
			CONTINUE;
		END IF;

		-- No preferences row means the default: ON.
		SELECT COALESCE(np.email_replies, TRUE)
		INTO v_email_replies
		FROM public.notification_preferences np
		WHERE np.user_id = v_row.recipient_id;
		IF NOT FOUND THEN
			v_email_replies := TRUE;
		END IF;

		UPDATE public.notifications n
		SET email_status = 'processing',
			email_claimed_at = NOW(),
			email_attempts = n.email_attempts + 1,
			email_error = NULL
		WHERE n.id = v_row.id;

		notification_id := v_row.id;
		recipient_id := v_row.recipient_id;
		recipient_email := v_email;
		recipient_first_name := v_first_name;
		actor_enneagram := v_row.actor_enneagram;
		question_id := v_row.question_id;
		question_url := v_question_url;
		question_text := v_question_text;
		reply_comment_id := v_row.comment_id;
		reply_text := v_reply_text;
		subject_comment_id := v_row.subject_comment_id;
		subject_text := v_subject_text;
		email_replies := v_email_replies;
		attempt_count := v_row.email_attempts + 1;
		RETURN NEXT;
	END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_account_reply_notification_emails(INT)
	FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_account_reply_notification_emails(INT)
	TO service_role;

-- ---------------------------------------------------------------------------
-- 5. Mark the outcome of one send (worker, service_role only)
-- ---------------------------------------------------------------------------
--
-- 'sent' stamps emailed_at. 'failed' goes back to 'pending' while attempts
-- remain (< 3) so the next cron run retries it; on the third failure it stays
-- 'failed' for manual review. 'suppressed' and 'skipped' are terminal.

CREATE OR REPLACE FUNCTION public.mark_account_reply_notification_email(
	p_notification_id BIGINT,
	p_status TEXT,
	p_error TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_attempts INT;
	v_final TEXT;
BEGIN
	IF p_notification_id IS NULL
		OR p_status IS NULL
		OR p_status NOT IN ('sent', 'failed', 'suppressed', 'skipped') THEN
		RETURN 'invalid';
	END IF;

	SELECT n.email_attempts
	INTO v_attempts
	FROM public.notifications n
	WHERE n.id = p_notification_id
	FOR UPDATE;

	IF NOT FOUND THEN
		RETURN 'missing';
	END IF;

	v_final := CASE
		WHEN p_status = 'failed' AND COALESCE(v_attempts, 0) < 3 THEN 'pending'
		ELSE p_status
	END;

	UPDATE public.notifications n
	SET email_status = v_final,
		emailed_at = CASE WHEN p_status = 'sent' THEN NOW() ELSE n.emailed_at END,
		email_error = CASE WHEN p_status = 'sent' THEN NULL ELSE LEFT(p_error, 200) END
	WHERE n.id = p_notification_id;

	RETURN v_final;
END;
$$;

REVOKE ALL ON FUNCTION public.mark_account_reply_notification_email(BIGINT, TEXT, TEXT)
	FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mark_account_reply_notification_email(BIGINT, TEXT, TEXT)
	TO service_role;

-- ---------------------------------------------------------------------------
-- 6. One-click unsubscribe target (service_role only)
-- ---------------------------------------------------------------------------
--
-- Used by /api/notifications/email-unsubscribe/[token]. The token is an HMAC
-- over the user id signed with the service key, verified in the app; this
-- function trusts its caller and only upserts the single flag. The account
-- page keeps using update_notification_preferences under the user's own
-- session.

CREATE OR REPLACE FUNCTION public.set_email_replies_preference(
	p_user_id UUID,
	p_enabled BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
	IF p_user_id IS NULL THEN
		RETURN;
	END IF;

	INSERT INTO public.notification_preferences (user_id, email_replies, updated_at)
	VALUES (p_user_id, COALESCE(p_enabled, TRUE), NOW())
	ON CONFLICT (user_id) DO UPDATE SET
		email_replies = EXCLUDED.email_replies,
		updated_at = NOW();
END;
$$;

REVOKE ALL ON FUNCTION public.set_email_replies_preference(UUID, BOOLEAN)
	FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_email_replies_preference(UUID, BOOLEAN)
	TO service_role;

-- ---------------------------------------------------------------------------
-- 7. Account page RPC learns the new flag
-- ---------------------------------------------------------------------------
--
-- The 5-argument signature is dropped (not overloaded) so PostgREST never has
-- two candidates to choose between. p_email_replies defaults to NULL, which
-- means "leave as is": a caller that predates this migration keeps working
-- and cannot accidentally reset a user's email opt-out to ON.

DROP FUNCTION IF EXISTS public.update_notification_preferences(BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN);

CREATE OR REPLACE FUNCTION public.update_notification_preferences(
	p_reply_to_take BOOLEAN,
	p_take_on_your_question BOOLEAN,
	p_take_on_answered_question BOOLEAN,
	p_like_on_take BOOLEAN,
	p_email_digest BOOLEAN,
	p_email_replies BOOLEAN DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_user UUID := auth.uid();
BEGIN
	IF v_user IS NULL THEN
		RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '42501';
	END IF;

	INSERT INTO public.notification_preferences AS prefs (
		user_id,
		reply_to_take,
		take_on_your_question,
		take_on_answered_question,
		like_on_take,
		email_digest,
		email_replies,
		updated_at
	) VALUES (
		v_user,
		COALESCE(p_reply_to_take, TRUE),
		COALESCE(p_take_on_your_question, TRUE),
		COALESCE(p_take_on_answered_question, TRUE),
		COALESCE(p_like_on_take, TRUE),
		COALESCE(p_email_digest, TRUE),
		COALESCE(p_email_replies, TRUE),
		NOW()
	)
	ON CONFLICT (user_id) DO UPDATE SET
		reply_to_take = EXCLUDED.reply_to_take,
		take_on_your_question = EXCLUDED.take_on_your_question,
		take_on_answered_question = EXCLUDED.take_on_answered_question,
		like_on_take = EXCLUDED.like_on_take,
		email_digest = EXCLUDED.email_digest,
		email_replies = COALESCE(p_email_replies, prefs.email_replies),
		updated_at = NOW();
END;
$$;

REVOKE ALL ON FUNCTION public.update_notification_preferences(
	BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN
) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_notification_preferences(
	BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN
) TO authenticated, service_role;
