-- supabase/migrations/20260906120200_host_reply_desk.sql
--
-- Host reply desk: every morning the host (DJ) gets one email listing each new
-- human take from the last day with two drafted replies in his voice and a
-- one-tap link to post. This migration adds the draft ledger and the three
-- service-role-only RPCs behind it.
--
-- Safety: nothing here is reachable from anon/authenticated. The public
-- /host-desk/[token] page and the admin page both run server-side with the
-- service client, and the signed token is the only credential. A GET never
-- writes; posting always goes through post_host_reply() from a POST action.

CREATE TABLE IF NOT EXISTS public.host_reply_drafts (
	id BIGSERIAL PRIMARY KEY,
	comment_id BIGINT NOT NULL UNIQUE REFERENCES public.comments (id) ON DELETE CASCADE,
	question_id BIGINT,
	draft_a TEXT NOT NULL,
	draft_b TEXT NOT NULL,
	model TEXT,
	status TEXT NOT NULL DEFAULT 'pending'
		CHECK (status IN ('pending', 'posted', 'skipped', 'expired', 'failed')),
	posted_comment_id BIGINT,
	posted_text TEXT,
	digest_sent_at TIMESTAMPTZ,
	acted_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS host_reply_drafts_status_created_at_idx
	ON public.host_reply_drafts (status, created_at DESC);

CREATE INDEX IF NOT EXISTS host_reply_drafts_digest_sent_at_idx
	ON public.host_reply_drafts (digest_sent_at DESC);

ALTER TABLE public.host_reply_drafts ENABLE ROW LEVEL SECURITY;

-- No policies on purpose: only the service role (server code) touches this table.
REVOKE ALL ON public.host_reply_drafts FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.host_reply_drafts TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.host_reply_drafts_id_seq TO service_role;

-- ---------------------------------------------------------------------------
-- Candidates: new human takes the host has not answered and has no draft for.
-- ---------------------------------------------------------------------------
--
-- A comment qualifies when it:
--   * was created after p_since, is not removed, and has text;
--   * was not written by the host;
--   * is a top-level take (parent_type = 'question') or a reply
--     (parent_type = 'comment');
--   * has no child comment written by the host (already answered);
--   * has no host_reply_drafts row yet (already in a digest);
--   * belongs to a question that still exists and is not removed/flagged.
--
-- Low-effort takes are still returned, flagged low_effort = true, so the host
-- sees them and can nudge or skip. Low effort means: shorter than 3 characters,
-- no letters or digits at all, or a single word of 12 characters or fewer
-- ("Nothing", "Pooopin", "nice").
--
-- author_type_key uses the same vocabulary as the notifications system:
-- '1'..'9' for a typed profile, 'unknown' for a registered-but-untyped user,
-- 'rando' for an anonymous give-first visitor.
CREATE OR REPLACE FUNCTION public.get_host_digest_candidates(
	p_host_user_id UUID,
	p_since TIMESTAMPTZ,
	p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
	comment_id BIGINT,
	comment_text TEXT,
	author_type_key TEXT,
	is_anonymous BOOLEAN,
	question_id BIGINT,
	question_text TEXT,
	question_url TEXT,
	parent_comment_text TEXT,
	low_effort BOOLEAN,
	created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
	WITH candidate AS (
		SELECT
			c.id,
			c.comment,
			c.author_id,
			c.parent_type,
			c.parent_id,
			c.created_at,
			CASE
				WHEN c.parent_type = 'question' THEN c.parent_id::BIGINT
				ELSE public.notification_root_question_id(c.id)
			END AS root_question_id
		FROM public.comments c
		WHERE c.created_at > p_since
			AND c.removed IS NOT TRUE
			AND NULLIF(BTRIM(COALESCE(c.comment, '')), '') IS NOT NULL
			AND c.author_id IS DISTINCT FROM p_host_user_id
			AND c.parent_type IN ('question', 'comment')
			AND NOT EXISTS (
				SELECT 1
				FROM public.comments reply
				WHERE reply.parent_type = 'comment'
					AND reply.parent_id = c.id
					AND reply.author_id = p_host_user_id
					AND reply.removed IS NOT TRUE
			)
			AND NOT EXISTS (
				SELECT 1
				FROM public.host_reply_drafts d
				WHERE d.comment_id = c.id
			)
	)
	SELECT
		cand.id::BIGINT AS comment_id,
		BTRIM(cand.comment) AS comment_text,
		public.notification_actor_type(cand.author_id) AS author_type_key,
		(cand.author_id IS NULL) AS is_anonymous,
		q.id::BIGINT AS question_id,
		COALESCE(NULLIF(BTRIM(q.question_formatted), ''), q.question) AS question_text,
		q.url AS question_url,
		CASE
			WHEN cand.parent_type = 'comment' THEN parent.comment
			ELSE NULL
		END AS parent_comment_text,
		(
			length(BTRIM(cand.comment)) < 3
			OR BTRIM(cand.comment) !~ '[[:alnum:]]'
			OR (BTRIM(cand.comment) !~ '\s' AND length(BTRIM(cand.comment)) <= 12)
		) AS low_effort,
		cand.created_at
	FROM candidate cand
	JOIN public.questions q ON q.id = cand.root_question_id
	LEFT JOIN public.comments parent
		ON cand.parent_type = 'comment' AND parent.id = cand.parent_id
	WHERE q.removed IS NOT TRUE
		AND q.flagged IS NOT TRUE
	ORDER BY cand.created_at ASC
	LIMIT GREATEST(1, LEAST(COALESCE(p_limit, 50), 200));
$$;

REVOKE ALL ON FUNCTION public.get_host_digest_candidates(UUID, TIMESTAMPTZ, INTEGER)
	FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_host_digest_candidates(UUID, TIMESTAMPTZ, INTEGER)
	TO service_role;

-- ---------------------------------------------------------------------------
-- Post: insert the host's reply exactly the way the question page does.
-- ---------------------------------------------------------------------------
--
-- The question page's createComment action calls create_comment_atomic()
-- through the service client, so this RPC calls the very same function with
-- parent_type = 'comment'. That keeps the insert identical (same columns,
-- comment_count bump on the parent, analytics context) and lets the existing
-- notify_on_comment trigger email the recipient.
--
-- Idempotent: the draft row is locked FOR UPDATE and an already-posted draft
-- returns its existing posted_comment_id without inserting again, so a double
-- tap or a retried POST cannot post twice.
CREATE OR REPLACE FUNCTION public.post_host_reply(
	p_draft_id BIGINT,
	p_host_user_id UUID,
	p_text TEXT,
	p_ip TEXT DEFAULT NULL
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_draft public.host_reply_drafts%ROWTYPE;
	v_text TEXT := BTRIM(COALESCE(p_text, ''));
	v_created JSON;
	v_new_comment_id BIGINT;
BEGIN
	IF p_host_user_id IS NULL THEN
		RAISE EXCEPTION 'Host user id is required' USING ERRCODE = '22023';
	END IF;

	SELECT * INTO v_draft
	FROM public.host_reply_drafts
	WHERE id = p_draft_id
	FOR UPDATE;

	IF NOT FOUND THEN
		RAISE EXCEPTION 'Host reply draft % not found', p_draft_id USING ERRCODE = 'P0002';
	END IF;

	IF v_draft.status = 'posted' THEN
		RETURN v_draft.posted_comment_id;
	END IF;

	IF length(v_text) NOT BETWEEN 1 AND 5000 THEN
		RAISE EXCEPTION 'Reply must be between 1 and 5000 characters' USING ERRCODE = '22023';
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM public.comments c
		WHERE c.id = v_draft.comment_id AND c.removed IS NOT TRUE
	) THEN
		UPDATE public.host_reply_drafts
		SET status = 'failed', acted_at = now(), updated_at = now()
		WHERE id = p_draft_id;
		RAISE EXCEPTION 'The take being replied to was removed' USING ERRCODE = 'P0002';
	END IF;

	v_created := public.create_comment_atomic(
		v_text,
		v_draft.comment_id::INTEGER,
		p_host_user_id,
		'comment',
		NULL,
		p_ip,
		NULL
	);
	v_new_comment_id := (v_created ->> 'id')::BIGINT;

	IF v_new_comment_id IS NULL THEN
		RAISE EXCEPTION 'Host reply insert did not return a comment id';
	END IF;

	UPDATE public.host_reply_drafts
	SET status = 'posted',
		posted_comment_id = v_new_comment_id,
		posted_text = v_text,
		acted_at = now(),
		updated_at = now()
	WHERE id = p_draft_id;

	RETURN v_new_comment_id;
END;
$$;

REVOKE ALL ON FUNCTION public.post_host_reply(BIGINT, UUID, TEXT, TEXT)
	FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.post_host_reply(BIGINT, UUID, TEXT, TEXT) TO service_role;

-- ---------------------------------------------------------------------------
-- Skip: mark a pending draft as consciously passed over.
-- ---------------------------------------------------------------------------
-- Returns the resulting status. A draft that was already posted stays posted.
CREATE OR REPLACE FUNCTION public.skip_host_reply(p_draft_id BIGINT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_status TEXT;
BEGIN
	SELECT status INTO v_status
	FROM public.host_reply_drafts
	WHERE id = p_draft_id
	FOR UPDATE;

	IF NOT FOUND THEN
		RAISE EXCEPTION 'Host reply draft % not found', p_draft_id USING ERRCODE = 'P0002';
	END IF;

	IF v_status = 'posted' THEN
		RETURN v_status;
	END IF;

	UPDATE public.host_reply_drafts
	SET status = 'skipped', acted_at = now(), updated_at = now()
	WHERE id = p_draft_id;

	RETURN 'skipped';
END;
$$;

REVOKE ALL ON FUNCTION public.skip_host_reply(BIGINT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.skip_host_reply(BIGINT) TO service_role;
