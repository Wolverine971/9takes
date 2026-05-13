-- supabase/migrations/20260513_search_typeahead_performance.sql
-- Keep universal search responsive by limiting expensive snippet/category work
-- to candidate rows instead of every searchable row.

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
  WITH ranked_questions AS (
    SELECT
      q.id,
      q.url,
      q.question,
      q.question_formatted,
      q.comment_count,
      q.context,
      COALESCE(ct.category_names, '') AS category_names,
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
    LEFT JOIN LATERAL (
      SELECT public.question_category_search_text(q.id) AS category_names
    ) ct ON TRUE
    WHERE q.removed = FALSE
      AND COALESCE(q.flagged, FALSE) = FALSE
      AND (
        q.search_vector @@ tsquery_val
        OR COALESCE(q.question, '') ILIKE '%' || normalized_query || '%'
        OR COALESCE(q.question_formatted, '') ILIKE '%' || normalized_query || '%'
      )
  ),
  top_questions AS (
    SELECT *
    FROM ranked_questions rq
    ORDER BY rq.weighted_rank DESC, rq.comment_count DESC, rq.id DESC
    LIMIT GREATEST(COALESCE(result_limit, 10), 1)
  )
  SELECT
    tq.id::BIGINT,
    tq.url,
    tq.question,
    tq.question_formatted,
    tq.comment_count::BIGINT,
    ts_headline(
      'english',
      COALESCE(tq.question_formatted, tq.question, '') || ' ... ' ||
      tq.category_names || ' ... ' ||
      LEFT(COALESCE(tq.context, ''), 1000),
      tsquery_val,
      'MaxWords=20, MinWords=8, StartSel=<mark>, StopSel=</mark>, MaxFragments=1, FragmentDelimiter= ... '
    ) AS headline,
    tq.weighted_rank AS rank
  FROM top_questions tq
  ORDER BY tq.weighted_rank DESC, tq.comment_count DESC, tq.id DESC;
END;
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
  comment_count BIGINT,
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
  WITH ranked_questions AS (
    SELECT
      q.id,
      q.url,
      q.question,
      q.question_formatted,
      q.comment_count,
      q.context,
      q.created_at,
      q.updated_at,
      COALESCE(ct.category_display_names, '') AS category_display_names,
      COALESCE(ct.category_search_names, '') AS category_search_names,
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
    LEFT JOIN LATERAL (
      SELECT
        public.question_category_search_text(q.id) AS category_search_names,
        public.question_category_display_text(q.id) AS category_display_names
    ) ct ON TRUE
    WHERE q.removed = FALSE
      AND COALESCE(q.flagged, FALSE) = FALSE
      AND (
        q.search_vector @@ tsquery_val
        OR COALESCE(q.question, '') ILIKE '%' || normalized_query || '%'
        OR COALESCE(q.question_formatted, '') ILIKE '%' || normalized_query || '%'
        OR COALESCE(q.context, '') ILIKE '%' || normalized_query || '%'
      )
  ),
  page_questions AS (
    SELECT *
    FROM ranked_questions rq
    ORDER BY rq.weighted_rank DESC, rq.comment_count DESC, rq.updated_at DESC NULLS LAST, rq.id DESC
    LIMIT GREATEST(COALESCE(result_limit, 20), 1)
    OFFSET GREATEST(COALESCE(result_offset, 0), 0)
  )
  SELECT
    pq.id::BIGINT,
    pq.url,
    pq.question,
    pq.question_formatted,
    pq.comment_count::BIGINT,
    pq.category_display_names AS category_names,
    pq.context,
    pq.created_at,
    pq.updated_at,
    ts_headline(
      'english',
      COALESCE(pq.question_formatted, pq.question, '') || ' ... ' ||
      pq.category_display_names || ' ... ' ||
      LEFT(COALESCE(pq.context, ''), 1200),
      tsquery_val,
      'MaxWords=28, MinWords=10, StartSel=<mark>, StopSel=</mark>, MaxFragments=1, FragmentDelimiter= ... '
    ) AS headline,
    pq.weighted_rank AS rank
  FROM page_questions pq
  ORDER BY pq.weighted_rank DESC, pq.comment_count DESC, pq.updated_at DESC NULLS LAST, pq.id DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.typeahead_blog_search(
  search_query TEXT,
  result_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id BIGINT,
  source TEXT,
  slug TEXT,
  title TEXT,
  enneagram INTEGER,
  category TEXT,
  headline TEXT,
  rank REAL
)
LANGUAGE plpgsql
AS $$
DECLARE
  normalized_query TEXT;
  tsquery_val TSQUERY;
  candidate_limit INTEGER;
BEGIN
  normalized_query := BTRIM(COALESCE(search_query, ''));

  IF normalized_query = '' THEN
    RETURN;
  END IF;

  tsquery_val := plainto_tsquery('english', normalized_query);
  candidate_limit := LEAST(GREATEST(COALESCE(result_limit, 10), 1) * 3, 60);

  RETURN QUERY
  WITH content_candidates AS (
    SELECT
      bc.id::BIGINT AS id,
      'content'::TEXT AS source,
      bc.slug,
      bc.title,
      bc.description,
      bc.headings,
      bc.enneagram::INTEGER AS enneagram,
      bc.category,
      (
        COALESCE(ts_rank(bc.search_vector, tsquery_val), 0) +
        CASE
          WHEN COALESCE(bc.title, '') ILIKE normalized_query || '%' THEN 5
          WHEN COALESCE(bc.title, '') ILIKE '%' || normalized_query || '%' THEN 3
          WHEN COALESCE(bc.description, '') ILIKE '%' || normalized_query || '%' THEN 1.5
          WHEN COALESCE(array_to_string(bc.headings, ' '), '') ILIKE normalized_query || '%' THEN 1.5
          WHEN COALESCE(array_to_string(bc.headings, ' '), '') ILIKE '%' || normalized_query || '%' THEN 1
          ELSE 0
        END
      )::REAL AS rank
    FROM public.blogs_content bc
    WHERE bc.published = TRUE
      AND (
        bc.search_vector @@ tsquery_val
        OR COALESCE(bc.title, '') ILIKE '%' || normalized_query || '%'
        OR COALESCE(bc.description, '') ILIKE '%' || normalized_query || '%'
        OR COALESCE(array_to_string(bc.headings, ' '), '') ILIKE '%' || normalized_query || '%'
      )
    ORDER BY rank DESC, bc.title ASC
    LIMIT candidate_limit
  ),
  people_candidates AS (
    SELECT
      bfp.id::BIGINT AS id,
      'famous_people'::TEXT AS source,
      bfp.person AS slug,
      bfp.title,
      bfp.person,
      bfp.persona_title,
      bfp.description,
      bfp.enneagram::INTEGER AS enneagram,
      bfp.category,
      (
        COALESCE(ts_rank(bfp.search_vector, tsquery_val), 0) +
        CASE
          WHEN COALESCE(bfp.person, '') ILIKE normalized_query || '%' THEN 6
          WHEN COALESCE(bfp.person, '') ILIKE '%' || normalized_query || '%' THEN 4
          WHEN COALESCE(bfp.title, '') ILIKE normalized_query || '%' THEN 4.5
          WHEN COALESCE(bfp.title, '') ILIKE '%' || normalized_query || '%' THEN 2.5
          WHEN COALESCE(bfp.persona_title, '') ILIKE '%' || normalized_query || '%' THEN 2
          WHEN COALESCE(bfp.description, '') ILIKE '%' || normalized_query || '%' THEN 1
          ELSE 0
        END
      )::REAL AS rank
    FROM public.blogs_famous_people bfp
    WHERE bfp.published = TRUE
      AND (
        bfp.search_vector @@ tsquery_val
        OR COALESCE(bfp.person, '') ILIKE '%' || normalized_query || '%'
        OR COALESCE(bfp.title, '') ILIKE '%' || normalized_query || '%'
        OR COALESCE(bfp.persona_title, '') ILIKE '%' || normalized_query || '%'
        OR COALESCE(bfp.description, '') ILIKE '%' || normalized_query || '%'
      )
    ORDER BY rank DESC, bfp.title ASC
    LIMIT candidate_limit
  ),
  content_results AS (
    SELECT
      cc.id,
      cc.source,
      cc.slug,
      cc.title,
      cc.enneagram,
      cc.category,
      ts_headline(
        'english',
        COALESCE(cc.title, '') || ' ... ' ||
        COALESCE(cc.description, '') || ' ... ' ||
        public.text_array_search_text(COALESCE(cc.headings, ARRAY[]::TEXT[])) || ' ... ' ||
        LEFT(COALESCE(bc.content, ''), 1600),
        tsquery_val,
        'MaxWords=25, MinWords=10, StartSel=<mark>, StopSel=</mark>, MaxFragments=1, FragmentDelimiter= ... '
      ) AS headline,
      cc.rank
    FROM content_candidates cc
    JOIN public.blogs_content bc ON bc.id = cc.id
  ),
  people_results AS (
    SELECT
      pc.id,
      pc.source,
      pc.slug,
      pc.title,
      pc.enneagram,
      pc.category,
      ts_headline(
        'english',
        COALESCE(pc.title, '') || ' ... ' ||
        COALESCE(pc.person, '') || ' ... ' ||
        COALESCE(pc.persona_title, '') || ' ... ' ||
        COALESCE(pc.description, '') || ' ... ' ||
        public.markdown_heading_search_text(bfp.content) || ' ... ' ||
        LEFT(COALESCE(bfp.content, ''), 1600),
        tsquery_val,
        'MaxWords=25, MinWords=10, StartSel=<mark>, StopSel=</mark>, MaxFragments=1, FragmentDelimiter= ... '
      ) AS headline,
      pc.rank
    FROM people_candidates pc
    JOIN public.blogs_famous_people bfp ON bfp.id = pc.id
  )
  SELECT *
  FROM (
    SELECT * FROM content_results
    UNION ALL
    SELECT * FROM people_results
  ) all_results
  ORDER BY all_results.rank DESC, all_results.title ASC
  LIMIT GREATEST(COALESCE(result_limit, 10), 1);
END;
$$;

GRANT EXECUTE ON FUNCTION public.typeahead_question_search(TEXT, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.typeahead_question_search(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.typeahead_question_search(TEXT, INTEGER) TO service_role;

GRANT EXECUTE ON FUNCTION public.search_questions(TEXT, INTEGER, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.search_questions(TEXT, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_questions(TEXT, INTEGER, INTEGER) TO service_role;

GRANT EXECUTE ON FUNCTION public.typeahead_blog_search(TEXT, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.typeahead_blog_search(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.typeahead_blog_search(TEXT, INTEGER) TO service_role;
