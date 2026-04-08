-- supabase/migrations/20260408_question_search_system.sql
-- Native Postgres search for public questions, replacing Elasticsearch for typeahead/search

CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;

CREATE OR REPLACE FUNCTION public.question_category_search_text(p_question_id BIGINT)
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  WITH all_tags AS (
    SELECT question_id, tag_id
    FROM public.question_category_tags
    WHERE question_id = p_question_id

    UNION

    SELECT question_id, tag_id
    FROM public.question_tags
    WHERE question_id = p_question_id
  )
  SELECT COALESCE(string_agg(DISTINCT qc.category_name, ' '), '')
  FROM all_tags tags
  JOIN public.question_categories qc ON qc.id = tags.tag_id;
$$;

CREATE OR REPLACE FUNCTION public.build_question_search_vector(
  p_question_id BIGINT,
  p_question TEXT,
  p_question_formatted TEXT,
  p_context TEXT
)
RETURNS TSVECTOR
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  category_text TEXT;
BEGIN
  category_text := public.question_category_search_text(p_question_id);

  RETURN
    setweight(to_tsvector('english', COALESCE(p_question_formatted, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(p_question, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(category_text, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(p_context, '')), 'C');
END;
$$;

CREATE OR REPLACE FUNCTION public.refresh_question_search_vector(p_question_id BIGINT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.questions q
  SET search_vector = public.build_question_search_vector(
    q.id,
    q.question,
    q.question_formatted,
    q.context
  )
  WHERE q.id = p_question_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.question_refresh_search_vector_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM public.refresh_question_search_vector(NEW.id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_question_refresh_search_vector ON public.questions;

CREATE TRIGGER trg_question_refresh_search_vector
AFTER INSERT OR UPDATE OF question, question_formatted, context ON public.questions
FOR EACH ROW
EXECUTE FUNCTION public.question_refresh_search_vector_trigger();

CREATE OR REPLACE FUNCTION public.question_tag_refresh_search_vector_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  affected_question_id BIGINT;
BEGIN
  affected_question_id := COALESCE(NEW.question_id, OLD.question_id);

  IF affected_question_id IS NOT NULL THEN
    PERFORM public.refresh_question_search_vector(affected_question_id);
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_question_category_tags_refresh_search_vector ON public.question_category_tags;

CREATE TRIGGER trg_question_category_tags_refresh_search_vector
AFTER INSERT OR UPDATE OF tag_id OR DELETE ON public.question_category_tags
FOR EACH ROW
EXECUTE FUNCTION public.question_tag_refresh_search_vector_trigger();

DROP TRIGGER IF EXISTS trg_question_tags_refresh_search_vector ON public.question_tags;

CREATE TRIGGER trg_question_tags_refresh_search_vector
AFTER INSERT OR UPDATE OF tag_id OR DELETE ON public.question_tags
FOR EACH ROW
EXECUTE FUNCTION public.question_tag_refresh_search_vector_trigger();

CREATE OR REPLACE FUNCTION public.question_category_name_refresh_search_vector_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.questions q
  SET search_vector = public.build_question_search_vector(
    q.id,
    q.question,
    q.question_formatted,
    q.context
  )
  WHERE q.id IN (
    SELECT question_id
    FROM public.question_category_tags
    WHERE tag_id = NEW.id

    UNION

    SELECT question_id
    FROM public.question_tags
    WHERE tag_id = NEW.id
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_question_categories_refresh_search_vector ON public.question_categories;

CREATE TRIGGER trg_question_categories_refresh_search_vector
AFTER UPDATE OF category_name ON public.question_categories
FOR EACH ROW
EXECUTE FUNCTION public.question_category_name_refresh_search_vector_trigger();

CREATE INDEX IF NOT EXISTS idx_questions_search_vector
ON public.questions
USING GIN (search_vector)
WHERE removed = FALSE AND COALESCE(flagged, FALSE) = FALSE;

CREATE INDEX IF NOT EXISTS idx_questions_question_trgm
ON public.questions
USING GIN (question gin_trgm_ops)
WHERE removed = FALSE AND COALESCE(flagged, FALSE) = FALSE;

CREATE INDEX IF NOT EXISTS idx_questions_question_formatted_trgm
ON public.questions
USING GIN (question_formatted gin_trgm_ops)
WHERE removed = FALSE AND COALESCE(flagged, FALSE) = FALSE;

CREATE INDEX IF NOT EXISTS idx_question_categories_category_name_trgm
ON public.question_categories
USING GIN (category_name gin_trgm_ops);

UPDATE public.questions q
SET search_vector = public.build_question_search_vector(
  q.id,
  q.question,
  q.question_formatted,
  q.context
);

CREATE OR REPLACE FUNCTION public.typeahead_question_search(
  search_query TEXT,
  result_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id BIGINT,
  url TEXT,
  question TEXT,
  question_formatted TEXT,
  comment_count BIGINT,
  headline TEXT,
  rank REAL
)
LANGUAGE plpgsql
AS $$
DECLARE
  normalized_query TEXT;
  tsquery_val TSQUERY;
BEGIN
  normalized_query := BTRIM(COALESCE(search_query, ''));

  IF normalized_query = '' THEN
    RETURN;
  END IF;

  tsquery_val := websearch_to_tsquery('english', normalized_query);

  RETURN QUERY
  WITH category_text AS (
    SELECT
      q.id AS question_id,
      public.question_category_search_text(q.id) AS category_names
    FROM public.questions q
  ),
  ranked_questions AS (
    SELECT
      q.id,
      q.url,
      q.question,
      q.question_formatted,
      q.comment_count,
      q.context,
      ct.category_names,
      (
        COALESCE(ts_rank(q.search_vector, tsquery_val), 0) +
        CASE
          WHEN COALESCE(q.question_formatted, q.question, '') ILIKE normalized_query || '%' THEN 3
          WHEN COALESCE(q.question_formatted, q.question, '') ILIKE '%' || normalized_query || '%' THEN 2
          WHEN COALESCE(ct.category_names, '') ILIKE '%' || normalized_query || '%' THEN 1
          WHEN COALESCE(q.context, '') ILIKE '%' || normalized_query || '%' THEN 0.5
          ELSE 0
        END
      )::REAL AS weighted_rank
    FROM public.questions q
    LEFT JOIN category_text ct ON ct.question_id = q.id
    WHERE q.removed = FALSE
      AND COALESCE(q.flagged, FALSE) = FALSE
      AND (
        q.search_vector @@ tsquery_val
        OR COALESCE(q.question, '') ILIKE '%' || normalized_query || '%'
        OR COALESCE(q.question_formatted, '') ILIKE '%' || normalized_query || '%'
        OR COALESCE(q.context, '') ILIKE '%' || normalized_query || '%'
        OR COALESCE(ct.category_names, '') ILIKE '%' || normalized_query || '%'
      )
  )
  SELECT
    rq.id::BIGINT,
    rq.url,
    rq.question,
    rq.question_formatted,
    rq.comment_count::BIGINT,
    ts_headline(
      'english',
      COALESCE(rq.question_formatted, rq.question, '') || ' ... ' ||
      COALESCE(rq.category_names, '') || ' ... ' ||
      LEFT(COALESCE(rq.context, ''), 1000),
      tsquery_val,
      'MaxWords=20, MinWords=8, StartSel=<mark>, StopSel=</mark>, MaxFragments=1, FragmentDelimiter= ... '
    ) AS headline,
    rq.weighted_rank AS rank
  FROM ranked_questions rq
  ORDER BY rq.weighted_rank DESC, rq.comment_count DESC, rq.id DESC
  LIMIT GREATEST(COALESCE(result_limit, 10), 1);
END;
$$;

GRANT EXECUTE ON FUNCTION public.typeahead_question_search(TEXT, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.typeahead_question_search(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.typeahead_question_search(TEXT, INTEGER) TO service_role;
