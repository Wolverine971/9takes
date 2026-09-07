-- supabase/migrations/20260906120100_question_starters_and_pins.sql
-- Created: 2026-09-06
--
-- SCHEMA migration for the curated "Start here" set and the pinned reveal trio.
--
-- Why: the /questions index was ordered created_at DESC with no curation, two
-- stale election prompts were still the front door, and after the give-first
-- gate unlocked the newest (often one-word) answer was the first thing a new
-- contributor saw. This adds:
--   * questions.starter_rank        NULL = not a starter; 1..N = position
--   * questions.pinned_comment_ids  up to three top-level comment ids rendered
--                                   first after the reveal, in array order
--   * get_questions_page_data       returns a `starters` block, paginates the
--                                   row set correctly, and keeps starters out
--                                   of the archive list so nothing shows twice
--   * set_question_curation         service-role RPC the admin UI calls
--
-- The content (which questions are starters, which comments are pinned) lives
-- in the companion data migration 20260906121000_starter_set_and_pins_data.sql.

BEGIN;

-- ---------------------------------------------------------------------------
-- Columns
-- ---------------------------------------------------------------------------
ALTER TABLE public.questions
	ADD COLUMN IF NOT EXISTS starter_rank SMALLINT;

ALTER TABLE public.questions
	ADD COLUMN IF NOT EXISTS pinned_comment_ids BIGINT[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN public.questions.starter_rank IS
	'NULL = not a starter; 1..N = position in the /questions "Start here" block.';
COMMENT ON COLUMN public.questions.pinned_comment_ids IS
	'Up to three top-level comment ids rendered first after the give-first reveal, in array order.';

CREATE INDEX IF NOT EXISTS questions_starter_rank_idx
	ON public.questions (starter_rank)
	WHERE starter_rank IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Election-year prompts are the wrong front door (2026-09-06 decision).
-- Hiding them from browse keeps their answers; nothing is deleted.
--   98  "who are you voting for and why"
--   168 "what is your greatest fear if Trump/Harris is elected"
-- ---------------------------------------------------------------------------
UPDATE public.questions
SET flagged = TRUE,
	updated_at = NOW()
WHERE id IN (98, 168)
	AND flagged IS NOT TRUE;

-- ---------------------------------------------------------------------------
-- get_questions_page_data
--
-- Previous version (20260813203000) had LIMIT/OFFSET on an aggregate query,
-- so page 1 returned every question and load-more never paginated. The row
-- set is now paginated first, then aggregated. Multi-tag questions also no
-- longer occupy several page slots (and no longer double-count totalAnswers).
--
-- Returned keys (every existing key the consumer reads is preserved):
--   canAskQuestion  boolean
--   categories      question_categories rows with at least one visible question
--   starters        [] unless p_offset = 0 and p_category_id IS NULL; then the
--                   starter questions ordered by starter_rank (same row shape
--                   as `questions`, plus starter_rank), excluding removed/flagged
--   questions       the archive page: visible, non-starter questions ordered
--                   created_at DESC, LIMIT p_limit OFFSET p_offset
--   totalQuestions  count of visible questions (starters included)
--   totalAnswers    sum of comment_count over visible questions
-- ---------------------------------------------------------------------------
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
	v_limit INTEGER := GREATEST(COALESCE(p_limit, 20), 1);
	v_offset INTEGER := GREATEST(COALESCE(p_offset, 0), 0);
	v_include_starters BOOLEAN := (COALESCE(p_offset, 0) = 0 AND p_category_id IS NULL);
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
		'starters', (
			CASE
				WHEN v_include_starters THEN (
					SELECT COALESCE(json_agg(
						json_build_object(
							'id', s.id,
							'question', s.question,
							'question_formatted', s.question_formatted,
							'url', s.url,
							'created_at', s.created_at,
							'comment_count', s.comment_count,
							'author_id', s.author_id,
							'es_id', s.es_id,
							'removed', s.removed,
							'flagged', s.flagged,
							'starter_rank', s.starter_rank,
							'tag_name', s.tag_name,
							'tag_id', s.tag_id
						) ORDER BY s.starter_rank ASC, s.id ASC
					), '[]'::json)
					FROM (
						SELECT q.id, q.question, q.question_formatted, q.url, q.created_at,
							q.comment_count, q.author_id, q.es_id, q.removed, q.flagged,
							q.starter_rank, tag.tag_name, tag.tag_id
						FROM public.questions q
						LEFT JOIN LATERAL (
							SELECT qc.id AS tag_id, qc.category_name AS tag_name
							FROM public.question_tags qt
							JOIN public.question_categories qc ON qc.id = qt.tag_id
							WHERE qt.question_id = q.id
							ORDER BY qc.id ASC
							LIMIT 1
						) tag ON TRUE
						WHERE q.starter_rank IS NOT NULL
							AND COALESCE(q.removed, FALSE) = FALSE
							AND COALESCE(q.flagged, FALSE) = FALSE
					) s
				)
				ELSE '[]'::json
			END
		),
		'questions', (
			SELECT COALESCE(json_agg(
				json_build_object(
					'id', page.id,
					'question', page.question,
					'question_formatted', page.question_formatted,
					'url', page.url,
					'created_at', page.created_at,
					'comment_count', page.comment_count,
					'author_id', page.author_id,
					'es_id', page.es_id,
					'removed', page.removed,
					'flagged', page.flagged,
					'tag_name', page.tag_name,
					'tag_id', page.tag_id
				) ORDER BY page.created_at DESC, page.id DESC
			), '[]'::json)
			FROM (
				SELECT q.id, q.question, q.question_formatted, q.url, q.created_at,
					q.comment_count, q.author_id, q.es_id, q.removed, q.flagged,
					tag.tag_name, tag.tag_id
				FROM public.questions q
				LEFT JOIN LATERAL (
					SELECT qc.id AS tag_id, qc.category_name AS tag_name
					FROM public.question_tags qt
					JOIN public.question_categories qc ON qc.id = qt.tag_id
					WHERE qt.question_id = q.id
						AND (p_category_id IS NULL OR qc.id = p_category_id)
					ORDER BY qc.id ASC
					LIMIT 1
				) tag ON TRUE
				WHERE COALESCE(q.removed, FALSE) = FALSE
					AND COALESCE(q.flagged, FALSE) = FALSE
					AND q.starter_rank IS NULL
					AND (p_category_id IS NULL OR tag.tag_id IS NOT NULL)
					AND (
						q.data ->> 'source' IS DISTINCT FROM 'chorus'
						OR COALESCE(q.comment_count, 0) > 0
						OR q.data ->> 'editorial_status' = 'approved'
					)
				ORDER BY q.created_at DESC, q.id DESC
				LIMIT v_limit
				OFFSET v_offset
			) page
		),
		'totalQuestions', (
			SELECT COUNT(*)
			FROM public.questions q
			WHERE COALESCE(q.removed, FALSE) = FALSE
				AND COALESCE(q.flagged, FALSE) = FALSE
				AND (
					p_category_id IS NULL
					OR EXISTS (
						SELECT 1 FROM public.question_tags qt
						WHERE qt.question_id = q.id AND qt.tag_id = p_category_id
					)
				)
				AND (
					q.data ->> 'source' IS DISTINCT FROM 'chorus'
					OR COALESCE(q.comment_count, 0) > 0
					OR q.data ->> 'editorial_status' = 'approved'
				)
		),
		'totalAnswers', (
			SELECT COALESCE(SUM(q.comment_count), 0)
			FROM public.questions q
			WHERE COALESCE(q.removed, FALSE) = FALSE
				AND COALESCE(q.flagged, FALSE) = FALSE
				AND (
					p_category_id IS NULL
					OR EXISTS (
						SELECT 1 FROM public.question_tags qt
						WHERE qt.question_id = q.id AND qt.tag_id = p_category_id
					)
				)
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

-- Re-apply the hardening from 20260903230508_security_rls_storage_rpc.sql.
ALTER FUNCTION public.get_questions_page_data(uuid,integer,integer,integer) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.get_questions_page_data(uuid,integer,integer,integer) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_questions_page_data(uuid,integer,integer,integer) TO service_role;

GRANT EXECUTE ON FUNCTION public.get_questions_page_data(uuid,integer,integer,integer) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- set_question_curation
--
-- Service-role only (the admin page calls it through the service client after
-- adminAuth). Sets starter_rank (NULL or >= 1) and pinned_comment_ids for one
-- question. Every pinned id must be a non-removed top-level comment on that
-- question; invalid ids are dropped silently, duplicates collapse to their
-- first position, and the list is capped at three. Returns the saved state.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_question_curation(
	p_question_id BIGINT,
	p_starter_rank SMALLINT DEFAULT NULL,
	p_pinned_comment_ids BIGINT[] DEFAULT '{}'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
	v_rank SMALLINT := p_starter_rank;
	v_valid_ids BIGINT[] := '{}';
	v_result JSON;
BEGIN
	IF p_question_id IS NULL OR NOT EXISTS (
		SELECT 1 FROM public.questions WHERE id = p_question_id
	) THEN
		RAISE EXCEPTION 'Question % not found', p_question_id USING ERRCODE = 'P0002';
	END IF;

	IF v_rank IS NOT NULL AND v_rank < 1 THEN
		v_rank := NULL;
	END IF;

	SELECT COALESCE(array_agg(candidate.id ORDER BY candidate.position), '{}')
	INTO v_valid_ids
	FROM (
		SELECT DISTINCT ON (raw.id) raw.id, raw.position
		FROM unnest(COALESCE(p_pinned_comment_ids, '{}'::BIGINT[]))
			WITH ORDINALITY AS raw(id, position)
		WHERE raw.id IS NOT NULL
		ORDER BY raw.id, raw.position
	) candidate
	JOIN public.comments c ON c.id = candidate.id
	WHERE c.parent_type = 'question'
		AND c.parent_id = p_question_id
		AND COALESCE(c.removed, FALSE) = FALSE;

	v_valid_ids := v_valid_ids[1:3];

	UPDATE public.questions
	SET starter_rank = v_rank,
		pinned_comment_ids = v_valid_ids,
		updated_at = NOW()
	WHERE id = p_question_id;

	SELECT json_build_object(
		'question_id', p_question_id,
		'starter_rank', v_rank,
		'pinned_comment_ids', COALESCE(to_json(v_valid_ids), '[]'::json)
	) INTO v_result;

	RETURN v_result;
END;
$function$;

ALTER FUNCTION public.set_question_curation(bigint,smallint,bigint[]) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.set_question_curation(bigint,smallint,bigint[]) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.set_question_curation(bigint,smallint,bigint[]) TO service_role;

COMMIT;
