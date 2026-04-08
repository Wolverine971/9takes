-- supabase/migrations/20260408_question_full_search.sql
-- Full public question search RPC for the unified search layer.

CREATE OR REPLACE FUNCTION public.question_category_display_text(p_question_id BIGINT)
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
  SELECT COALESCE(
    string_agg(DISTINCT qc.category_name, ', ' ORDER BY qc.category_name),
    ''
  )
  FROM all_tags tags
  JOIN public.question_categories qc ON qc.id = tags.tag_id;
$$;

CREATE OR REPLACE FUNCTION public.search_questions(
  search_query TEXT,
  result_limit INTEGER DEFAULT 20,
  result_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id BIGINT,
  url TEXT,
  question TEXT,
  question_formatted TEXT,
  comment_count INTEGER,
  category_names TEXT,
  context TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
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
      public.question_category_search_text(q.id) AS category_search_names,
      public.question_category_display_text(q.id) AS category_display_names
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
      q.created_at,
      q.updated_at,
      ct.category_display_names,
      ct.category_search_names,
      (
        COALESCE(ts_rank(q.search_vector, tsquery_val), 0) +
        CASE
          WHEN COALESCE(q.question_formatted, q.question, '') ILIKE normalized_query || '%' THEN 3.5
          WHEN COALESCE(q.question_formatted, q.question, '') ILIKE '%' || normalized_query || '%' THEN 2.25
          WHEN COALESCE(ct.category_display_names, '') ILIKE '%' || normalized_query || '%' THEN 1
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
        OR COALESCE(ct.category_search_names, '') ILIKE '%' || normalized_query || '%'
      )
  )
  SELECT
    rq.id,
    rq.url,
    rq.question,
    rq.question_formatted,
    rq.comment_count,
    rq.category_display_names AS category_names,
    rq.context,
    rq.created_at,
    rq.updated_at,
    ts_headline(
      'english',
      COALESCE(rq.question_formatted, rq.question, '') || ' ... ' ||
      COALESCE(rq.category_display_names, '') || ' ... ' ||
      LEFT(COALESCE(rq.context, ''), 1200),
      tsquery_val,
      'MaxWords=28, MinWords=10, StartSel=<mark>, StopSel=</mark>, MaxFragments=1, FragmentDelimiter= ... '
    ) AS headline,
    rq.weighted_rank AS rank
  FROM ranked_questions rq
  ORDER BY rq.weighted_rank DESC, rq.comment_count DESC, rq.updated_at DESC NULLS LAST, rq.id DESC
  LIMIT GREATEST(COALESCE(result_limit, 20), 1)
  OFFSET GREATEST(COALESCE(result_offset, 0), 0);
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_questions(TEXT, INTEGER, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.search_questions(TEXT, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_questions(TEXT, INTEGER, INTEGER) TO service_role;
