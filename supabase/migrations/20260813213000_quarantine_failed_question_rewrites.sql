-- supabase/migrations/20260813213000_quarantine_failed_question_rewrites.sql
-- Quarantine the first editorial rewrite pass.
--
-- These 66 unanswered questions were reopened by the preceding audit migration,
-- but the rewrites preserved the generated batch's abstract, dilemma-heavy
-- structure. Keep both the original and reviewed copy for audit history while
-- removing the questions from public and distribution surfaces until they are
-- redesigned against a stricter, response-first editorial standard.

DO $$
DECLARE
	matched_count INTEGER;
BEGIN
	SELECT COUNT(*)
	INTO matched_count
	FROM public.questions
	WHERE COALESCE(comment_count, 0) = 0
		AND COALESCE(removed, FALSE) = FALSE
		AND data ->> 'editorial_status' = 'approved'
		AND data ->> 'editorial_review_version' = '1';

	IF matched_count <> 66 THEN
		RAISE EXCEPTION 'Failed rewrite inventory mismatch: expected 66, matched %', matched_count;
	END IF;
END;
$$;

UPDATE public.questions
SET
	flagged = TRUE,
	data = COALESCE(data, '{}'::jsonb) || jsonb_build_object(
		'editorial_status', 'needs_redesign',
		'editorial_review_version', 2,
		'editorial_reviewed_at', '2026-08-13',
		'editorial_reason', 'First rewrite pass retained abstract, type-coded dilemma structure',
		'editorial_failed_rewrite', question_formatted
	),
	updated_at = NOW()
WHERE COALESCE(comment_count, 0) = 0
	AND COALESCE(removed, FALSE) = FALSE
	AND data ->> 'editorial_status' = 'approved'
	AND data ->> 'editorial_review_version' = '1';
