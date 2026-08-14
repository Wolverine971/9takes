-- supabase/migrations/20260813203000_question_editorial_audit.sql
-- Editorial reset for the zero-human-answer question inventory.
--
-- The 2026-06-15 chorus generation batch wrote 356 AI-generated questions
-- directly into the live questions table. Its prompt included the source
-- person's Enneagram type, which produced repetitive, type-coded premises.
-- This migration:
--   1. quarantines every unanswered chorus question by default;
--   2. approves a deliberately smaller, cross-personality question bank with
--      human-reviewed public copy;
--   3. removes one stale seasonal organic prompt;
--   4. makes the public questions index respect moderation and editorial state.
--
-- Quarantine is recoverable: original question text, URLs, AI takes, and source
-- metadata are preserved. `question_formatted` contains the reviewed public
-- copy while `question` retains the original generated text for audit history.

CREATE TEMP TABLE question_editorial_approvals (
	question_id BIGINT PRIMARY KEY,
	reviewed_question TEXT NOT NULL CHECK (reviewed_question ~ '\?$')
);

INSERT INTO question_editorial_approvals (question_id, reviewed_question)
VALUES
	(566, 'When people misunderstand who you are, do you try to correct them or let their opinion stand?'),
	(565, 'What have you sacrificed to understand something more deeply, and was it worth it?'),
	(564, 'When something you helped build changes direction, what makes you stay and fight for it or walk away?'),
	(563, 'What part of your life are you unwilling to sacrifice for work you care deeply about?'),
	(562, 'When you feel out of place in a group, how much do you change to belong?'),
	(561, 'When everyone else lets something slide, how do you decide whether to speak up?'),
	(560, 'How do you decide which parts of your life stay private, even with people you trust?'),
	(558, 'When you witness something unfair that does not affect you, what makes you step in or stay out?'),
	(557, 'What finally makes you let go of a habit you once enjoyed?'),
	(555, 'When someone needs you but you are already stretched thin, how do you decide what to give?'),
	(554, 'When the future is uncertain, what helps you decide whether to prepare more or move forward anyway?'),
	(552, 'When something that once comforted you stops feeling right, what makes you repair it or leave it behind?'),
	(551, 'When no one else believes in your idea, what tells you to keep going or reconsider?'),
	(549, 'When honesty might disturb the peace, how do you decide what needs to be said?'),
	(548, 'After you hurt someone in a way you cannot undo, what does taking responsibility look like?'),
	(545, 'What could make you walk away from something you once wanted badly, even after finally getting it?'),
	(539, 'When a system feels wrong, what makes you work within it, challenge it, or leave?'),
	(537, 'What makes you keep going when the evidence suggests it may be time to stop?'),
	(532, 'How do you decide when to trust your preparation and when to trust your ability to adapt?'),
	(531, 'What do you do when the path you are on starts to feel chosen for you?'),
	(529, 'When you create something with other people, what makes it feel like yours?'),
	(525, 'What do you do when the people or institutions meant to make you feel safe no longer do?'),
	(523, 'When something important is gone for good, what helps you build a life around the loss?'),
	(521, 'When other people expect more than you can give, how do you decide what gets sacrificed?'),
	(513, 'When something you built starts demanding more of your life than you want to give, what do you do?'),
	(500, 'When progress requires compromising your standards, how do you decide what is negotiable?'),
	(495, 'What responsibility do creators have for the unintended ways people use what they make?'),
	(490, 'When you change direction completely, how do you decide which parts of your old self come with you?'),
	(488, 'Would you rather be widely loved or deeply respected, and what makes the difference matter to you?'),
	(486, 'How do you know when wanting something has stopped serving you?'),
	(480, 'How do you decide when wanting more is worth risking what you already have?'),
	(478, 'When everyone expects you to say yes, what helps you decide whether you actually want to?'),
	(474, 'When life finally gets comfortable, what makes you stay and what makes you look for something new?'),
	(469, 'If you could change a painful part of your past, would you risk changing who it made you?'),
	(452, 'How do you know when something you care about is ready to share, even if it is not perfect?'),
	(435, 'When the stakes are high, how do you decide whether to trust your preparation, your people, or your gut?'),
	(431, 'If you stopped being impressive, what would still make you feel worth knowing?'),
	(422, 'After doing everything right and still falling short, what helps you make sense of the outcome?'),
	(416, 'How long do you keep trying to fix something before accepting that it may stay broken?'),
	(412, 'What do you know you need to do but keep finding reasons not to start?'),
	(411, 'When something you made matters to you but not to anyone else, what keeps it valuable?'),
	(410, 'When something you created becomes controversial, how do you decide whether to defend it, revise it, or walk away?'),
	(405, 'After doing your best and still failing, what determines whether you try again?'),
	(399, 'When something goes wrong, how quickly do you assume it was your fault?'),
	(386, 'If people misunderstand your intentions, do you care more about being seen accurately or keeping everyone comfortable?'),
	(366, 'When something you strongly believed turns out to be false, what becomes harder to trust afterward?'),
	(352, 'Would you rather be celebrated by millions or known deeply by a few, and why?'),
	(330, 'When a gatekeeper tells you no, how do you decide whether to walk away, negotiate, or find another route?'),
	(328, 'What would you do if reaching a major goal made you feel sad instead of proud?'),
	(327, 'If you are certain you are on the right path, what evidence could still change your mind?'),
	(323, 'What do you do when all your efforts to improve your life still leave you wanting more?'),
	(315, 'If you could protect yourself from ever being hurt again, what else might you lose?'),
	(312, 'How do you know when something that makes you happy is causing too much harm to continue?'),
	(299, 'When a feeling is intense, how do you decide whether it is revealing a truth or distorting one?'),
	(293, 'What do you do when every exciting path eventually starts to feel like a cage?'),
	(289, 'How do you respond when the humor you use to get through life starts to feel like a performance?'),
	(288, 'When does self-improvement stop feeling like progress and start feeling like an obligation?'),
	(285, 'When does looking for the good in a bad situation help, and when does it become denial?'),
	(277, 'When criticism hurts, how do you decide whether it contains useful feedback or is just noise?'),
	(273, 'When people are hurting, how do you decide whether humor will help or make things worse?'),
	(245, 'When caring for yourself conflicts with being kind to someone else, how do you decide what kindness requires?'),
	(231, 'If no one believed you when you needed help, how would you respond when they finally realized you were right?'),
	(222, 'When other people expect you to carry something difficult, how do you decide whether the burden is really yours?'),
	(213, 'What is hardest about setting a boundary with someone you love?'),
	(204, 'What belief have you changed in the last three years, and what changed your mind?'),
	(115, 'What is the dumbest thing you did as a kid that made perfect sense to you then?');

DO $$
DECLARE
	approval_count INTEGER;
	matched_count INTEGER;
BEGIN
	SELECT COUNT(*) INTO approval_count FROM question_editorial_approvals;
	SELECT COUNT(*) INTO matched_count
	FROM public.questions q
	JOIN question_editorial_approvals a ON a.question_id = q.id;

	IF approval_count <> 66 OR matched_count <> approval_count THEN
		RAISE EXCEPTION 'Question editorial approval inventory mismatch: approvals %, matched %',
			approval_count,
			matched_count;
	END IF;
END;
$$;

-- Quarantine the entire zero-human-answer AI batch first. The approved bank
-- below reopens only prompts that passed the cross-personality editorial bar.
UPDATE public.questions
SET
	flagged = TRUE,
	data = COALESCE(data, '{}'::jsonb) || jsonb_build_object(
		'editorial_status', 'needs_review',
		'editorial_review_version', 1,
		'editorial_reviewed_at', '2026-08-13',
		'editorial_reason', 'Quarantined in zero-answer chorus batch audit',
		'editorial_previous_flagged', flagged
	),
	updated_at = NOW()
WHERE data ->> 'source' = 'chorus'
	AND COALESCE(comment_count, 0) = 0
	AND COALESCE(removed, FALSE) = FALSE
	AND NOT EXISTS (
		SELECT 1
		FROM question_editorial_approvals a
		WHERE a.question_id = questions.id
	);

-- Preserve original generated copy in `question`; reviewed public copy lives in
-- `question_formatted`, matching the existing admin/editor rendering contract.
UPDATE public.questions q
SET
	question_formatted = a.reviewed_question,
	flagged = FALSE,
	removed = FALSE,
	data = COALESCE(q.data, '{}'::jsonb) || jsonb_build_object(
		'editorial_status', 'approved',
		'editorial_review_version', 1,
		'editorial_reviewed_at', '2026-08-13',
		'editorial_previous_question_formatted', q.question_formatted,
		'editorial_previous_flagged', q.flagged,
		'editorial_previous_removed', q.removed
	),
	updated_at = NOW()
FROM question_editorial_approvals a
WHERE q.id = a.question_id;

-- Keep the profile doorway and its stored situation aligned with the reviewed
-- question. Existing generated answers remain valid because these revisions
-- preserve each original human tension rather than replacing its subject.
UPDATE public.blogs_famous_people b
SET chorus_question = a.reviewed_question
FROM question_editorial_approvals a
JOIN public.questions q ON q.id = a.question_id
WHERE q.data ->> 'source' = 'chorus'
	AND q.data ->> 'subject_slug' = b.person;

UPDATE public.nine_takes n
SET
	situation = a.reviewed_question,
	updated_at = NOW()
FROM question_editorial_approvals a
JOIN public.questions q ON q.id = a.question_id
WHERE q.data ->> 'source' = 'chorus'
	AND n.subject_type = 'personality-analysis'
	AND n.subject_slug = q.data ->> 'subject_slug';

-- The only rejected organic zero-answer prompt is seasonal, stale, and offers
-- little perspective spread. Soft removal keeps it recoverable in admin.
UPDATE public.questions
SET
	removed = TRUE,
	data = COALESCE(data, '{}'::jsonb) || jsonb_build_object(
		'editorial_status', 'rejected',
		'editorial_review_version', 1,
		'editorial_reviewed_at', '2026-08-13',
		'editorial_reason', 'Stale seasonal prompt with low perspective value',
		'editorial_previous_removed', removed
	),
	updated_at = NOW()
WHERE id = 150
	AND COALESCE(comment_count, 0) = 0;

-- The index previously hid every unanswered chorus question, including reviewed
-- ones, and did not consistently exclude flagged questions. Approved prompts are
-- now eligible while quarantined prompts stay out of public browse surfaces.
CREATE OR REPLACE FUNCTION public.get_questions_page_data(
	p_user_id UUID DEFAULT NULL,
	p_limit INTEGER DEFAULT 20,
	p_offset INTEGER DEFAULT 0,
	p_category_id INTEGER DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $function$
DECLARE
	v_result JSON;
	v_can_ask_question BOOLEAN := FALSE;
	v_questions_count INTEGER;
BEGIN
	IF p_user_id IS NOT NULL THEN
		SELECT COUNT(*) INTO v_questions_count
		FROM public.questions
		WHERE author_id = p_user_id
			AND COALESCE(removed, FALSE) = FALSE
			AND created_at >= NOW() - INTERVAL '24 hours';

		v_can_ask_question := v_questions_count < 10;
	END IF;

	SELECT json_build_object(
		'canAskQuestion', v_can_ask_question,
		'categories', (
			SELECT COALESCE(json_agg(DISTINCT c.*), '[]'::json)
			FROM public.question_categories c
			WHERE EXISTS (
				SELECT 1
				FROM public.question_tags qt
				JOIN public.questions q ON qt.question_id = q.id
				WHERE qt.tag_id = c.id
					AND COALESCE(q.removed, FALSE) = FALSE
					AND COALESCE(q.flagged, FALSE) = FALSE
					AND (
						q.data ->> 'source' IS DISTINCT FROM 'chorus'
						OR COALESCE(q.comment_count, 0) > 0
						OR q.data ->> 'editorial_status' = 'approved'
					)
			)
		),
		'questions', (
			SELECT COALESCE(json_agg(
				json_build_object(
					'id', q.id,
					'question', q.question,
					'question_formatted', q.question_formatted,
					'url', q.url,
					'created_at', q.created_at,
					'comment_count', q.comment_count,
					'author_id', q.author_id,
					'es_id', q.es_id,
					'removed', q.removed,
					'flagged', q.flagged,
					'tag_name', qc.category_name,
					'tag_id', qc.id
				) ORDER BY q.created_at DESC
			), '[]'::json)
			FROM public.questions q
			LEFT JOIN public.question_tags qt ON q.id = qt.question_id
			LEFT JOIN public.question_categories qc ON qt.tag_id = qc.id
			WHERE COALESCE(q.removed, FALSE) = FALSE
				AND COALESCE(q.flagged, FALSE) = FALSE
				AND (p_category_id IS NULL OR qc.id = p_category_id)
				AND (
					q.data ->> 'source' IS DISTINCT FROM 'chorus'
					OR COALESCE(q.comment_count, 0) > 0
					OR q.data ->> 'editorial_status' = 'approved'
				)
			LIMIT p_limit
			OFFSET p_offset
		),
		'totalQuestions', (
			SELECT COUNT(DISTINCT q.id)
			FROM public.questions q
			LEFT JOIN public.question_tags qt ON q.id = qt.question_id
			LEFT JOIN public.question_categories qc ON qt.tag_id = qc.id
			WHERE COALESCE(q.removed, FALSE) = FALSE
				AND COALESCE(q.flagged, FALSE) = FALSE
				AND (p_category_id IS NULL OR qc.id = p_category_id)
				AND (
					q.data ->> 'source' IS DISTINCT FROM 'chorus'
					OR COALESCE(q.comment_count, 0) > 0
					OR q.data ->> 'editorial_status' = 'approved'
				)
		),
		'totalAnswers', (
			SELECT COALESCE(SUM(q.comment_count), 0)
			FROM public.questions q
			LEFT JOIN public.question_tags qt ON q.id = qt.question_id
			LEFT JOIN public.question_categories qc ON qt.tag_id = qc.id
			WHERE COALESCE(q.removed, FALSE) = FALSE
				AND COALESCE(q.flagged, FALSE) = FALSE
				AND (p_category_id IS NULL OR qc.id = p_category_id)
				AND (
					q.data ->> 'source' IS DISTINCT FROM 'chorus'
					OR COALESCE(q.comment_count, 0) > 0
					OR q.data ->> 'editorial_status' = 'approved'
				)
		)
	) INTO v_result;

	RETURN v_result;
END;
$function$;

DROP TABLE question_editorial_approvals;
