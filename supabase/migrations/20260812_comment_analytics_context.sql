-- supabase/migrations/20260812_comment_analytics_context.sql
-- Add privacy-safe, transactionally derived analytics context to successful
-- production comment writes. Existing callers still receive the comment row at
-- the top level; the additional `_analytics` object is additive.

CREATE OR REPLACE FUNCTION public.create_comment_atomic(
  p_comment TEXT,
  p_parent_id INTEGER,
  p_author_id UUID,
  p_parent_type TEXT,
  p_fingerprint TEXT,
  p_ip TEXT,
  p_es_id TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_new_comment public.comments%ROWTYPE;
  v_user_id UUID := auth.uid();
  v_role TEXT := auth.role();
  v_has_known_actor BOOLEAN := FALSE;
  v_question_id INTEGER;
  v_question_created_at public.questions.created_at%TYPE;
  v_responses_before_comment INTEGER := 0;
  v_is_first_comment_ever BOOLEAN;
  v_is_first_comment_on_question BOOLEAN := FALSE;
  v_question_age_hours DOUBLE PRECISION;
BEGIN
  IF v_role <> 'service_role' AND p_author_id IS NOT NULL THEN
    IF v_user_id IS NULL OR p_author_id IS DISTINCT FROM v_user_id THEN
      RAISE EXCEPTION 'Comment author_id must match the authenticated user'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  -- Serialize writes by known actor so two simultaneous comments cannot both
  -- be labeled as that actor's first comment.
  IF p_author_id IS NOT NULL THEN
    v_has_known_actor := TRUE;
    PERFORM pg_advisory_xact_lock(hashtext('user:' || p_author_id::TEXT));
  END IF;

  IF NULLIF(BTRIM(p_fingerprint), '') IS NOT NULL THEN
    v_has_known_actor := TRUE;
    PERFORM pg_advisory_xact_lock(hashtext('fingerprint:' || p_fingerprint));
  END IF;

  IF p_parent_type = 'question' THEN
    v_question_id := p_parent_id;
  ELSIF p_parent_type = 'comment' THEN
    WITH RECURSIVE comment_ancestry AS (
      SELECT c.id, c.parent_id, c.parent_type
      FROM public.comments c
      WHERE c.id = p_parent_id

      UNION ALL

      SELECT parent.id, parent.parent_id, parent.parent_type
      FROM public.comments parent
      JOIN comment_ancestry child
        ON child.parent_type = 'comment'
       AND parent.id = child.parent_id
    )
    SELECT ancestry.parent_id
    INTO v_question_id
    FROM comment_ancestry ancestry
    WHERE ancestry.parent_type = 'question'
    LIMIT 1;
  END IF;

  -- Lock the question while deriving response order. This makes the
  -- first-response flag exact even when two comments arrive concurrently.
  IF v_question_id IS NOT NULL THEN
    SELECT q.created_at
    INTO v_question_created_at
    FROM public.questions q
    WHERE q.id = v_question_id
    FOR UPDATE;

    SELECT COUNT(*)::INTEGER
    INTO v_responses_before_comment
    FROM public.comments c
    WHERE c.parent_type = 'question'
      AND c.parent_id = v_question_id
      AND c.removed IS NOT TRUE;

    v_is_first_comment_on_question :=
      p_parent_type = 'question' AND v_responses_before_comment = 0;

    IF v_question_created_at IS NOT NULL THEN
      v_question_age_hours := GREATEST(
        0,
        EXTRACT(EPOCH FROM (clock_timestamp() - v_question_created_at)) / 3600.0
      );
    END IF;
  END IF;

  IF NOT v_has_known_actor THEN
    v_is_first_comment_ever := NULL;
  ELSE
    SELECT NOT EXISTS (
      SELECT 1
      FROM public.comments c
      WHERE
        (p_author_id IS NOT NULL AND c.author_id = p_author_id)
        OR (
          NULLIF(BTRIM(p_fingerprint), '') IS NOT NULL
          AND c.fingerprint = p_fingerprint
        )
    )
    INTO v_is_first_comment_ever;
  END IF;

  INSERT INTO public.comments (
    comment,
    parent_id,
    author_id,
    parent_type,
    fingerprint,
    ip,
    es_id,
    comment_count,
    like_count,
    removed
  )
  VALUES (
    p_comment,
    p_parent_id,
    p_author_id,
    p_parent_type,
    p_fingerprint,
    p_ip,
    p_es_id,
    0,
    0,
    false
  )
  RETURNING * INTO v_new_comment;

  IF p_parent_type = 'comment' THEN
    UPDATE public.comments
    SET comment_count = COALESCE(comment_count, 0) + 1
    WHERE id = p_parent_id;
  END IF;

  RETURN (
    row_to_json(v_new_comment)::JSONB
    || jsonb_build_object(
      '_analytics',
      jsonb_build_object(
        'is_first_comment_ever', v_is_first_comment_ever,
        'is_first_comment_on_question', v_is_first_comment_on_question,
        'is_reply', p_parent_type = 'comment',
        'question_age_hours', v_question_age_hours,
        'responses_before_comment', v_responses_before_comment
      )
    )
  )::JSON;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_comment_atomic(
  TEXT,
  INTEGER,
  UUID,
  TEXT,
  TEXT,
  TEXT,
  TEXT
) TO anon, authenticated;
