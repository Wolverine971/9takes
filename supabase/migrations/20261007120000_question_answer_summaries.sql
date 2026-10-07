-- supabase/migrations/20261007120000_question_answer_summaries.sql
--
-- "The gist so far" (T-43, DJ's decision 2026-10-07): one AI-written
-- paraphrase per question of how people answered it. It is gated content:
-- humans see it only after posting their own take, and IP-verified Googlebot
-- gets the same block so question pages have indexable substance under
-- Google's paywall / content-gating pattern. It never contains anyone's
-- exact words (enforced in src/lib/server/questionAnswerSummary.ts).
--
-- Written by the question-summaries cron and scripts/gen-question-summaries.ts
-- with the service role.
--   summary               the gist; NULL until a draft has passed the guards
--   source_comment_count  human takes the stored summary was built from; the
--                         cron regenerates when the live count differs
--   failed_comment_count  live count at the last failed generation; the cron
--                         does not retry until the count changes again, so a
--                         thread the guards keep rejecting can't burn an LLM
--                         call every hour
--
-- Safety: RLS on with no policies, and anon/authenticated revoked. Nothing in
-- the browser can read a summary before the give-first gate opens; the page
-- load reads it server-side with the service client only for a viewer who
-- has answered or for verified Googlebot.

CREATE TABLE IF NOT EXISTS public.question_answer_summaries (
	question_id BIGINT PRIMARY KEY REFERENCES public.questions (id) ON DELETE CASCADE,
	summary TEXT CHECK (summary IS NULL OR char_length(btrim(summary)) > 0),
	source_comment_count INTEGER NOT NULL DEFAULT 0 CHECK (source_comment_count >= 0),
	model TEXT,
	generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	failed_comment_count INTEGER CHECK (failed_comment_count >= 0),
	failed_at TIMESTAMPTZ
);

ALTER TABLE public.question_answer_summaries ENABLE ROW LEVEL SECURITY;

-- No policies on purpose: only the service role (server code) touches this table.
REVOKE ALL ON public.question_answer_summaries FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.question_answer_summaries TO service_role;

COMMENT ON TABLE public.question_answer_summaries IS
	'T-43 "The gist so far": AI paraphrase of how people answered a question. Gated content; service-role only.';
