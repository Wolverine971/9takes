-- supabase/migrations/20261123120000_enneagram_test_take_follows.sql
--
-- Enneagram test answer chain (growth bet #1, 2026-11-23). The result page asks
-- up to three questions in a row. Every take posted from a result page is
-- followed by default: one row per (result, question). The follow does two jobs:
--
--   1. The result link unlocks that question's takes on any device. The row keeps
--      the fingerprint (or user id) behind the take, and the give-first gate is
--      checked against it, so a test-taker who opens their result link from an
--      email on another phone still sees the answers they unlocked.
--   2. The daily "new takes on questions you answered" email. It only goes out
--      once the result has an opt-in email (enneagram_test_results.notify_email);
--      without one the follow just sits there. last_seen_comment_id is the cursor:
--      takes and replies with a higher comments.id are new to this person.
--
-- Written and read only with the service role. Admins can read like the other
-- enneagram_test_* tables.

CREATE TABLE IF NOT EXISTS public.enneagram_test_follows (
	id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	result_id BIGINT NOT NULL REFERENCES public.enneagram_test_results (id) ON DELETE CASCADE,
	question_id BIGINT NOT NULL REFERENCES public.questions (id) ON DELETE CASCADE,
	-- The test-taker's own take on the question, when the post returned one.
	comment_id BIGINT,
	-- Who the gate should treat as the author when the result link is opened.
	fingerprint TEXT CHECK (char_length(fingerprint) <= 100),
	user_id UUID,
	-- Chain position (1-3) the question was answered at, for the funnel read.
	step SMALLINT CHECK (step BETWEEN 1 AND 3),
	last_seen_comment_id BIGINT NOT NULL DEFAULT 0,
	last_notified_at TIMESTAMPTZ,
	UNIQUE (result_id, question_id)
);

CREATE INDEX IF NOT EXISTS enneagram_test_follows_question_id_idx
	ON public.enneagram_test_follows (question_id);

ALTER TABLE public.enneagram_test_follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS audit_admin_management ON public.enneagram_test_follows;
CREATE POLICY audit_admin_management ON public.enneagram_test_follows
	FOR ALL TO authenticated
	USING ((SELECT public.is_admin()))
	WITH CHECK ((SELECT public.is_admin()));

REVOKE ALL ON public.enneagram_test_follows FROM anon;

COMMENT ON TABLE public.enneagram_test_follows IS
	'Questions answered from an Enneagram test result. Unlocks them on the result link and drives the opt-in new-takes email. Service-role writes only.';
