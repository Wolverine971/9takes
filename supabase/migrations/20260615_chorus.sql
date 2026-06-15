-- supabase/migrations/20260615_chorus.sql
-- Created: 2026-06-15
-- "The Chorus" schema, consolidated and idempotent. Safe to run on a database
-- where parts already exist (every statement guards with IF NOT EXISTS).
-- See docs/product/the-chorus-vision.md.
--
-- What this adds:
--   • nine_takes        — the cached AI "nine ways to answer" per subject.
--   • nine_user_takes   — typed corpus of readers' own answers (carries the
--                         mirror's resonant type). Public answers also live on
--                         the backing /questions/[slug] row as real comments.
--   • blogs_famous_people.chorus_question      — evergreen question text (instant display).
--   • blogs_famous_people.chorus_question_url  — slug of the real `questions` row
--                         backing this chorus; links/shares route to /questions/[slug].
--
-- Both chorus tables are written only by the server (service role) / the pre-gen
-- script, so RLS is enabled with no public policies.

-- ---------------------------------------------------------------------------
-- nine_takes
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.nine_takes (
  id BIGSERIAL PRIMARY KEY,
  subject_type TEXT NOT NULL,
  subject_slug TEXT NOT NULL,
  situation TEXT NOT NULL,
  takes JSONB NOT NULL,
  model TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_nine_takes_subject
  ON public.nine_takes (subject_type, subject_slug);

ALTER TABLE public.nine_takes ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- nine_user_takes
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.nine_user_takes (
  id BIGSERIAL PRIMARY KEY,
  subject_type TEXT NOT NULL,
  subject_slug TEXT NOT NULL,
  take TEXT NOT NULL,
  resonant_type SMALLINT CHECK (resonant_type BETWEEN 1 AND 9),
  fingerprint TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nine_user_takes_subject
  ON public.nine_user_takes (subject_type, subject_slug, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_nine_user_takes_user
  ON public.nine_user_takes (user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

ALTER TABLE public.nine_user_takes ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- blogs_famous_people: link each page to its evergreen question + question row
-- ---------------------------------------------------------------------------
ALTER TABLE public.blogs_famous_people
  ADD COLUMN IF NOT EXISTS chorus_question TEXT;

ALTER TABLE public.blogs_famous_people
  ADD COLUMN IF NOT EXISTS chorus_question_url TEXT;

COMMENT ON COLUMN public.blogs_famous_people.chorus_question IS
  'Evergreen give-first question shown by the NineChorus component. One per person, pre-generated, timeless.';

COMMENT ON COLUMN public.blogs_famous_people.chorus_question_url IS
  'Slug (questions.url) of the real question backing this page''s chorus. Links/shares route to /questions/[slug].';

-- ---------------------------------------------------------------------------
-- Feed gate: chorus questions stay hidden from the main /questions feed until
-- they receive their first answer (comment_count > 0). Mirrors the live
-- get_questions_page_data exactly, adding one guard to each WHERE clause:
--   (q.data ->> 'source' IS DISTINCT FROM 'chorus' OR COALESCE(q.comment_count,0) > 0)
-- IS DISTINCT FROM keeps NULL-data (normal) questions visible.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_questions_page_data(
  p_user_id uuid DEFAULT NULL::uuid,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0,
  p_category_id integer DEFAULT NULL::integer
)
RETURNS json
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $function$
DECLARE
  v_result JSON;
  v_can_ask_question BOOLEAN := FALSE;
  v_questions_count INTEGER;
BEGIN
  IF p_user_id IS NOT NULL THEN
    SELECT COUNT(*) INTO v_questions_count
    FROM questions
    WHERE author_id = p_user_id
      AND removed = FALSE
      AND created_at >= NOW() - INTERVAL '24 hours';

    v_can_ask_question := v_questions_count < 10;
  END IF;

  SELECT json_build_object(
    'canAskQuestion', v_can_ask_question,
    'categories', (
      SELECT COALESCE(json_agg(DISTINCT c.*), '[]'::json)
      FROM question_categories c
      WHERE EXISTS (
        SELECT 1 FROM question_tags qt
        JOIN questions q ON qt.question_id = q.id
        WHERE qt.tag_id = c.id AND q.removed = FALSE
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
      FROM questions q
      LEFT JOIN question_tags qt ON q.id = qt.question_id
      LEFT JOIN question_categories qc ON qt.tag_id = qc.id
      WHERE q.removed = FALSE
        AND (p_category_id IS NULL OR qc.id = p_category_id)
        AND (q.data ->> 'source' IS DISTINCT FROM 'chorus' OR COALESCE(q.comment_count, 0) > 0)
      LIMIT p_limit
      OFFSET p_offset
    ),
    'totalQuestions', (
      SELECT COUNT(DISTINCT q.id)
      FROM questions q
      LEFT JOIN question_tags qt ON q.id = qt.question_id
      LEFT JOIN question_categories qc ON qt.tag_id = qc.id
      WHERE q.removed = FALSE
        AND (p_category_id IS NULL OR qc.id = p_category_id)
        AND (q.data ->> 'source' IS DISTINCT FROM 'chorus' OR COALESCE(q.comment_count, 0) > 0)
    ),
    'totalAnswers', (
      SELECT COALESCE(SUM(q.comment_count), 0)
      FROM questions q
      LEFT JOIN question_tags qt ON q.id = qt.question_id
      LEFT JOIN question_categories qc ON qt.tag_id = qc.id
      WHERE q.removed = FALSE
        AND (p_category_id IS NULL OR qc.id = p_category_id)
        AND (q.data ->> 'source' IS DISTINCT FROM 'chorus' OR COALESCE(q.comment_count, 0) > 0)
    )
  ) INTO v_result;

  RETURN v_result;
END;
$function$;
