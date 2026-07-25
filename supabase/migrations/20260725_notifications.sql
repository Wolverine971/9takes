-- supabase/migrations/20260725_notifications.sql
-- Created: 2026-07-25
--
-- In-app notifications for 9takes. Four kinds, all triggered from existing
-- write paths (comments, comment_like) so nothing in the app has to remember
-- to fire them:
--
--   reply_to_take             -> someone replied to a comment you wrote
--   take_on_your_question     -> someone answered a question you asked
--   take_on_answered_question -> someone else answered a question you answered
--   like_on_take              -> someone liked a comment you wrote
--
-- ANONYMITY IS ENFORCED BY THE SCHEMA, NOT BY THE QUERY LAYER.
-- There is deliberately no actor_id / actor_name column. A notification stores
-- only actor_enneagram ('1'..'9' | 'unknown' | 'rando'), resolved once at
-- trigger time. This means no future query, RPC, or admin tool can accidentally
-- leak "who" acted, because the database never learned it. If the product ever
-- moves to named notifications that is a deliberate migration, not a one-line
-- SELECT change.
--
-- Freezing actor_enneagram at trigger time is also intentional: if a user later
-- changes their type, historical notifications keep the type that was true when
-- they acted, and retyping cannot retroactively re-attribute past activity.
--
-- Volume note (2026-07-25): the platform produces roughly 20 comments/month, so
-- one row per event needs no partitioning or rollup. The feed RPC aggregates
-- take_on_answered_question rows per question at READ time, which keeps the
-- write path dumb and lets the UI say "4 new takes · Types 2, 4, 7, 9".

-- ---------------------------------------------------------------------------
-- Preferences
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.notification_preferences (
	user_id UUID PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
	reply_to_take BOOLEAN NOT NULL DEFAULT TRUE,
	take_on_your_question BOOLEAN NOT NULL DEFAULT TRUE,
	take_on_answered_question BOOLEAN NOT NULL DEFAULT TRUE,
	like_on_take BOOLEAN NOT NULL DEFAULT TRUE,
	-- Gates the future email digest only. In-app delivery is governed by the
	-- four per-kind flags above.
	email_digest BOOLEAN NOT NULL DEFAULT TRUE,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS notification_preferences_select_own ON public.notification_preferences;
CREATE POLICY notification_preferences_select_own
	ON public.notification_preferences FOR SELECT
	USING (user_id = auth.uid());

DROP POLICY IF EXISTS notification_preferences_insert_own ON public.notification_preferences;
CREATE POLICY notification_preferences_insert_own
	ON public.notification_preferences FOR INSERT
	WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS notification_preferences_update_own ON public.notification_preferences;
CREATE POLICY notification_preferences_update_own
	ON public.notification_preferences FOR UPDATE
	USING (user_id = auth.uid())
	WITH CHECK (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.notifications (
	id BIGSERIAL PRIMARY KEY,
	recipient_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
	kind TEXT NOT NULL CHECK (
		kind IN (
			'reply_to_take',
			'take_on_your_question',
			'take_on_answered_question',
			'like_on_take'
		)
	),
	-- '1'..'9' | 'unknown' (registered, untyped) | 'rando' (anonymous visitor).
	-- Mirrors getCommentTypeKey() in src/routes/questions/[slug]/+page.server.ts
	-- so the vocabulary is identical on both sides of the wire.
	actor_enneagram TEXT NOT NULL,
	-- Root question, for linking. Always resolved, even for deeply nested replies.
	question_id BIGINT,
	-- The comment to quote in the feed: the new reply/take, or the liked take.
	comment_id BIGINT,
	-- The recipient's own comment that was acted on (NULL for take_* kinds).
	subject_comment_id BIGINT,
	-- The row that caused this notification (comments.id or comment_like.id).
	-- Dedupe key: makes the triggers idempotent under retry/replay.
	source_id BIGINT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	read_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_notification_source
	ON public.notifications (recipient_id, kind, source_id);

-- Drives the feed query and the unread badge.
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_created
	ON public.notifications (recipient_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_unread
	ON public.notifications (recipient_id)
	WHERE read_at IS NULL;

-- Supports the moderation cleanup trigger below.
CREATE INDEX IF NOT EXISTS idx_notifications_comment_id
	ON public.notifications (comment_id);

CREATE INDEX IF NOT EXISTS idx_notifications_subject_comment_id
	ON public.notifications (subject_comment_id);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Read-own only. Writes happen exclusively through the SECURITY DEFINER
-- triggers, and read_at is mutated exclusively through mark_notifications_read,
-- so there is deliberately no INSERT or UPDATE policy for client roles.
DROP POLICY IF EXISTS notifications_select_own ON public.notifications;
CREATE POLICY notifications_select_own
	ON public.notifications FOR SELECT
	USING (recipient_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

-- Walks a comment chain up to its root question. Comments are polymorphic
-- (parent_type 'question' | 'comment'), so a reply's question is not directly
-- on the row. Depth-capped so a cyclic parent chain can never spin.
CREATE OR REPLACE FUNCTION public.notification_root_question_id(p_comment_id BIGINT)
RETURNS BIGINT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_id BIGINT := p_comment_id;
	v_parent_type TEXT;
	v_parent_id BIGINT;
	v_depth INT := 0;
BEGIN
	WHILE v_id IS NOT NULL AND v_depth < 20 LOOP
		SELECT parent_type, parent_id
		INTO v_parent_type, v_parent_id
		FROM public.comments
		WHERE id = v_id;

		IF NOT FOUND THEN
			RETURN NULL;
		END IF;

		IF v_parent_type = 'question' THEN
			RETURN v_parent_id;
		END IF;

		v_id := v_parent_id;
		v_depth := v_depth + 1;
	END LOOP;

	RETURN NULL;
END;
$$;

-- Resolves the actor's type key. NULL author => 'rando' (anonymous give-first
-- visitor); registered but untyped => 'unknown'. This is the ONLY thing we
-- record about who acted.
CREATE OR REPLACE FUNCTION public.notification_actor_type(p_author_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_enneagram TEXT;
BEGIN
	IF p_author_id IS NULL THEN
		RETURN 'rando';
	END IF;

	SELECT NULLIF(BTRIM(COALESCE(enneagram, '')), '')
	INTO v_enneagram
	FROM public.profiles
	WHERE id = p_author_id;

	RETURN COALESCE(v_enneagram, 'unknown');
END;
$$;

-- Preferences default to ON for users with no row, so a brand-new account is
-- notified without needing a preferences row created first.
CREATE OR REPLACE FUNCTION public.notification_kind_enabled(p_user_id UUID, p_kind TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_prefs public.notification_preferences%ROWTYPE;
BEGIN
	SELECT * INTO v_prefs
	FROM public.notification_preferences
	WHERE user_id = p_user_id;

	IF NOT FOUND THEN
		RETURN TRUE;
	END IF;

	RETURN CASE p_kind
		WHEN 'reply_to_take' THEN v_prefs.reply_to_take
		WHEN 'take_on_your_question' THEN v_prefs.take_on_your_question
		WHEN 'take_on_answered_question' THEN v_prefs.take_on_answered_question
		WHEN 'like_on_take' THEN v_prefs.like_on_take
		ELSE TRUE
	END;
END;
$$;

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
		source_id
	) VALUES (
		p_recipient_id,
		p_kind,
		COALESCE(p_actor_enneagram, 'rando'),
		p_question_id,
		p_comment_id,
		p_subject_comment_id,
		p_source_id
	)
	ON CONFLICT (recipient_id, kind, source_id) DO NOTHING;
END;
$$;

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.notify_on_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_actor TEXT;
	v_question_id BIGINT;
	v_parent_author UUID;
	v_question_author UUID;
	v_peer RECORD;
BEGIN
	IF NEW.removed IS TRUE THEN
		RETURN NEW;
	END IF;

	v_actor := public.notification_actor_type(NEW.author_id);

	-- Reply to a comment.
	IF NEW.parent_type = 'comment' THEN
		SELECT author_id INTO v_parent_author
		FROM public.comments
		WHERE id = NEW.parent_id AND removed IS NOT TRUE;

		IF v_parent_author IS NOT NULL AND v_parent_author IS DISTINCT FROM NEW.author_id THEN
			v_question_id := public.notification_root_question_id(NEW.id);
			PERFORM public.enqueue_notification(
				v_parent_author,
				'reply_to_take',
				v_actor,
				v_question_id,
				NEW.id,
				NEW.parent_id,
				NEW.id
			);
		END IF;

		RETURN NEW;
	END IF;

	-- A take on a question.
	IF NEW.parent_type = 'question' THEN
		v_question_id := NEW.parent_id;

		SELECT author_id INTO v_question_author
		FROM public.questions
		WHERE id = v_question_id;

		IF v_question_author IS NOT NULL AND v_question_author IS DISTINCT FROM NEW.author_id THEN
			PERFORM public.enqueue_notification(
				v_question_author,
				'take_on_your_question',
				v_actor,
				v_question_id,
				NEW.id,
				NULL,
				NEW.id
			);
		END IF;

		-- Everyone else who already answered this question. The question's own
		-- author is excluded here because they just got the stronger
		-- take_on_your_question signal above.
		FOR v_peer IN
			SELECT DISTINCT c.author_id
			FROM public.comments c
			WHERE c.parent_id = v_question_id
				AND c.parent_type = 'question'
				AND c.removed IS NOT TRUE
				AND c.id <> NEW.id
				AND c.author_id IS NOT NULL
				AND c.author_id IS DISTINCT FROM NEW.author_id
				AND c.author_id IS DISTINCT FROM v_question_author
		LOOP
			PERFORM public.enqueue_notification(
				v_peer.author_id,
				'take_on_answered_question',
				v_actor,
				v_question_id,
				NEW.id,
				NULL,
				NEW.id
			);
		END LOOP;
	END IF;

	RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_on_comment ON public.comments;
CREATE TRIGGER trg_notify_on_comment
	AFTER INSERT ON public.comments
	FOR EACH ROW
	EXECUTE FUNCTION public.notify_on_comment();

CREATE OR REPLACE FUNCTION public.notify_on_comment_like()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_recipient UUID;
	v_actor TEXT;
	v_question_id BIGINT;
BEGIN
	SELECT author_id INTO v_recipient
	FROM public.comments
	WHERE id = NEW.comment_id AND removed IS NOT TRUE;

	IF v_recipient IS NULL OR v_recipient IS NOT DISTINCT FROM NEW.user_id THEN
		RETURN NEW;
	END IF;

	v_actor := public.notification_actor_type(NEW.user_id);
	v_question_id := public.notification_root_question_id(NEW.comment_id);

	PERFORM public.enqueue_notification(
		v_recipient,
		'like_on_take',
		v_actor,
		v_question_id,
		NEW.comment_id,
		NEW.comment_id,
		NEW.id
	);

	RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_on_comment_like ON public.comment_like;
CREATE TRIGGER trg_notify_on_comment_like
	AFTER INSERT ON public.comment_like
	FOR EACH ROW
	EXECUTE FUNCTION public.notify_on_comment_like();

-- Moderation hygiene: removing a comment must also retract every notification
-- that quotes it or was raised on its behalf. Without this, a moderated comment
-- keeps living in someone's feed.
CREATE OR REPLACE FUNCTION public.cleanup_notifications_on_comment_removal()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
	DELETE FROM public.notifications
	WHERE comment_id = NEW.id
		OR subject_comment_id = NEW.id;

	RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_cleanup_notifications_on_comment_removal ON public.comments;
CREATE TRIGGER trg_cleanup_notifications_on_comment_removal
	AFTER UPDATE OF removed ON public.comments
	FOR EACH ROW
	WHEN (NEW.removed IS TRUE AND OLD.removed IS DISTINCT FROM NEW.removed)
	EXECUTE FUNCTION public.cleanup_notifications_on_comment_removal();

-- ---------------------------------------------------------------------------
-- Read API
-- ---------------------------------------------------------------------------

-- Returns the caller's feed, newest first, enriched with the question and the
-- quoted comment so the UI needs exactly one round trip. Grouping of
-- take_on_answered_question rows happens in the client from question_id, which
-- keeps read state per-event.
CREATE OR REPLACE FUNCTION public.get_notification_feed(p_limit INT DEFAULT 30)
RETURNS TABLE (
	id BIGINT,
	kind TEXT,
	actor_enneagram TEXT,
	question_id BIGINT,
	question_text TEXT,
	question_url TEXT,
	comment_excerpt TEXT,
	created_at TIMESTAMPTZ,
	read_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
	SELECT
		n.id,
		n.kind,
		n.actor_enneagram,
		n.question_id,
		COALESCE(q.question_formatted, q.question) AS question_text,
		q.url AS question_url,
		LEFT(c.comment, 240) AS comment_excerpt,
		n.created_at,
		n.read_at
	FROM public.notifications n
	LEFT JOIN public.questions q ON q.id = n.question_id
	LEFT JOIN public.comments c ON c.id = n.comment_id AND c.removed IS NOT TRUE
	WHERE n.recipient_id = auth.uid()
	ORDER BY n.created_at DESC
	LIMIT LEAST(GREATEST(COALESCE(p_limit, 30), 1), 100);
$$;

CREATE OR REPLACE FUNCTION public.get_unread_notification_count()
RETURNS INT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
	SELECT COUNT(*)::INT
	FROM public.notifications
	WHERE recipient_id = auth.uid() AND read_at IS NULL;
$$;

-- NULL / omitted p_ids marks everything read. Scoped to auth.uid() inside the
-- function so a caller can never mark another user's notifications read.
CREATE OR REPLACE FUNCTION public.mark_notifications_read(p_ids BIGINT[] DEFAULT NULL)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_user UUID := auth.uid();
	v_count INT;
BEGIN
	IF v_user IS NULL THEN
		RETURN 0;
	END IF;

	UPDATE public.notifications
	SET read_at = NOW()
	WHERE recipient_id = v_user
		AND read_at IS NULL
		AND (p_ids IS NULL OR id = ANY (p_ids));

	GET DIAGNOSTICS v_count = ROW_COUNT;
	RETURN v_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_notification_preferences(
	p_reply_to_take BOOLEAN,
	p_take_on_your_question BOOLEAN,
	p_take_on_answered_question BOOLEAN,
	p_like_on_take BOOLEAN,
	p_email_digest BOOLEAN
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

	INSERT INTO public.notification_preferences (
		user_id,
		reply_to_take,
		take_on_your_question,
		take_on_answered_question,
		like_on_take,
		email_digest,
		updated_at
	) VALUES (
		v_user,
		COALESCE(p_reply_to_take, TRUE),
		COALESCE(p_take_on_your_question, TRUE),
		COALESCE(p_take_on_answered_question, TRUE),
		COALESCE(p_like_on_take, TRUE),
		COALESCE(p_email_digest, TRUE),
		NOW()
	)
	ON CONFLICT (user_id) DO UPDATE SET
		reply_to_take = EXCLUDED.reply_to_take,
		take_on_your_question = EXCLUDED.take_on_your_question,
		take_on_answered_question = EXCLUDED.take_on_answered_question,
		like_on_take = EXCLUDED.like_on_take,
		email_digest = EXCLUDED.email_digest,
		updated_at = NOW();
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_notification_feed(INT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_unread_notification_count() TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_notifications_read(BIGINT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_notification_preferences(
	BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN
) TO authenticated;

-- The enqueue/helper functions are trigger internals. No client role needs them.
REVOKE ALL ON FUNCTION public.enqueue_notification(UUID, TEXT, TEXT, BIGINT, BIGINT, BIGINT, BIGINT)
	FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Backfill: last 90 days, inserted as ALREADY READ
-- ---------------------------------------------------------------------------
--
-- Why 90 days: replaying all history produces ~1,000 rows, ~780 of them
-- "someone else answered a question you answered" events from 2024-2025. That
-- is noise, not liveliness. The 90-day window yields 101 rows (1 reply, 29
-- takes on your question, 70 takes on a question you answered, 1 like) spread
-- across 28 recipients, which is what makes the feed read as a real place on
-- first load. Measured read-only against production 2026-07-25.
--
-- Why already-read: the unread badge must mean "new since you last looked".
-- Backfilled history exists to give the feed substance, not to greet returning
-- users with a fake 125-unread count.

DO $$
DECLARE
	v_window TIMESTAMPTZ := NOW() - INTERVAL '90 days';
BEGIN
	-- Replies to your take
	INSERT INTO public.notifications (
		recipient_id, kind, actor_enneagram, question_id,
		comment_id, subject_comment_id, source_id, created_at, read_at
	)
	SELECT
		parent.author_id,
		'reply_to_take',
		public.notification_actor_type(reply.author_id),
		public.notification_root_question_id(reply.id),
		reply.id,
		parent.id,
		reply.id,
		reply.created_at,
		reply.created_at
	FROM public.comments reply
	JOIN public.comments parent ON parent.id = reply.parent_id
	WHERE reply.parent_type = 'comment'
		AND reply.removed IS NOT TRUE
		AND parent.removed IS NOT TRUE
		AND reply.created_at > v_window
		AND parent.author_id IS NOT NULL
		AND parent.author_id IS DISTINCT FROM reply.author_id
	ON CONFLICT (recipient_id, kind, source_id) DO NOTHING;

	-- Takes on a question you asked
	INSERT INTO public.notifications (
		recipient_id, kind, actor_enneagram, question_id,
		comment_id, subject_comment_id, source_id, created_at, read_at
	)
	SELECT
		q.author_id,
		'take_on_your_question',
		public.notification_actor_type(c.author_id),
		q.id,
		c.id,
		NULL::BIGINT,
		c.id,
		c.created_at,
		c.created_at
	FROM public.comments c
	JOIN public.questions q ON q.id = c.parent_id
	WHERE c.parent_type = 'question'
		AND c.removed IS NOT TRUE
		AND c.created_at > v_window
		AND q.author_id IS NOT NULL
		AND q.author_id IS DISTINCT FROM c.author_id
	ON CONFLICT (recipient_id, kind, source_id) DO NOTHING;

	-- Takes on a question you also answered. `prior.created_at < c.created_at`
	-- keeps the replay historically honest: you are only notified about takes
	-- that landed after yours, exactly as the live trigger would have behaved.
	INSERT INTO public.notifications (
		recipient_id, kind, actor_enneagram, question_id,
		comment_id, subject_comment_id, source_id, created_at, read_at
	)
	-- NULL is explicitly cast because SELECT DISTINCT resolves each column's type
	-- before INSERT coerces it to the target column. An uncast NULL is type
	-- `unknown`, which DISTINCT resolves to `text`, not `bigint`.
	SELECT DISTINCT
		prior.author_id,
		'take_on_answered_question',
		public.notification_actor_type(c.author_id),
		c.parent_id,
		c.id,
		NULL::BIGINT,
		c.id,
		c.created_at,
		c.created_at
	FROM public.comments c
	JOIN public.comments prior
		ON prior.parent_id = c.parent_id
		AND prior.parent_type = 'question'
		AND prior.removed IS NOT TRUE
		AND prior.created_at < c.created_at
	LEFT JOIN public.questions q ON q.id = c.parent_id
	WHERE c.parent_type = 'question'
		AND c.removed IS NOT TRUE
		AND c.created_at > v_window
		AND prior.author_id IS NOT NULL
		AND prior.author_id IS DISTINCT FROM c.author_id
		AND prior.author_id IS DISTINCT FROM q.author_id
	ON CONFLICT (recipient_id, kind, source_id) DO NOTHING;

	-- Likes on your take
	INSERT INTO public.notifications (
		recipient_id, kind, actor_enneagram, question_id,
		comment_id, subject_comment_id, source_id, created_at, read_at
	)
	SELECT
		c.author_id,
		'like_on_take',
		public.notification_actor_type(l.user_id),
		public.notification_root_question_id(c.id),
		c.id,
		c.id,
		l.id,
		COALESCE(l.created_at, c.created_at),
		COALESCE(l.created_at, c.created_at)
	FROM public.comment_like l
	JOIN public.comments c ON c.id = l.comment_id
	WHERE c.removed IS NOT TRUE
		AND COALESCE(l.created_at, c.created_at) > v_window
		AND c.author_id IS NOT NULL
		AND c.author_id IS DISTINCT FROM l.user_id
	ON CONFLICT (recipient_id, kind, source_id) DO NOTHING;
END;
$$;
