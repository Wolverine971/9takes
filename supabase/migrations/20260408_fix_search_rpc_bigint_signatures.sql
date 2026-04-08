-- supabase/migrations/20260408_fix_search_rpc_bigint_signatures.sql
-- Production has BIGINT ids/counts for search sources, so the RPC return signatures
-- need to match the live schema. Without this, Postgres raises 42804 at runtime.

DROP FUNCTION IF EXISTS public.typeahead_question_search(TEXT, INTEGER);
DROP FUNCTION IF EXISTS public.search_questions(TEXT, INTEGER, INTEGER);
DROP FUNCTION IF EXISTS public.typeahead_blog_search(TEXT, INTEGER);
DROP FUNCTION IF EXISTS public.search_all_blogs(TEXT, INTEGER, TEXT, TEXT, INTEGER, INTEGER);

CREATE FUNCTION public.typeahead_question_search(
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

CREATE FUNCTION public.search_questions(
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
    rq.id::BIGINT,
    rq.url,
    rq.question,
    rq.question_formatted,
    rq.comment_count::BIGINT,
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

CREATE FUNCTION public.search_all_blogs(
  search_query TEXT,
  filter_enneagram INTEGER DEFAULT NULL,
  filter_category TEXT DEFAULT NULL,
  filter_type TEXT DEFAULT NULL,
  result_limit INTEGER DEFAULT 20,
  result_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id BIGINT,
  source TEXT,
  slug TEXT,
  title TEXT,
  description TEXT,
  enneagram INTEGER,
  type JSONB,
  tags TEXT[],
  category TEXT,
  lastmod TIMESTAMPTZ,
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
  WITH content_results AS (
    SELECT
      bc.id::BIGINT AS id,
      'content'::TEXT AS source,
      bc.slug,
      bc.title,
      bc.description,
      bc.enneagram::INTEGER AS enneagram,
      to_jsonb(bc.type) AS type,
      bc.tags,
      bc.category,
      bc.lastmod,
      (
        COALESCE(ts_rank(bc.search_vector, tsquery_val), 0) +
        CASE
          WHEN COALESCE(bc.title, '') ILIKE normalized_query || '%' THEN 4
          WHEN COALESCE(bc.title, '') ILIKE '%' || normalized_query || '%' THEN 2.5
          WHEN COALESCE(bc.description, '') ILIKE '%' || normalized_query || '%' THEN 1.5
          WHEN COALESCE(array_to_string(bc.headings, ' '), '') ILIKE '%' || normalized_query || '%' THEN 1.25
          WHEN COALESCE(array_to_string(bc.tags, ' '), '') ILIKE '%' || normalized_query || '%' THEN 0.75
          WHEN COALESCE(bc.content, '') ILIKE '%' || normalized_query || '%' THEN 0.25
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
      AND (filter_enneagram IS NULL OR bc.enneagram = filter_enneagram)
      AND (filter_category IS NULL OR bc.category = filter_category)
      AND (filter_type IS NULL OR filter_type = ANY(COALESCE(bc.type, ARRAY[]::TEXT[])))
  ),
  people_results AS (
    SELECT
      bfp.id::BIGINT AS id,
      'famous_people'::TEXT AS source,
      bfp.person AS slug,
      bfp.title,
      bfp.description,
      bfp.enneagram::INTEGER AS enneagram,
      bfp.type,
      bfp.tags,
      bfp.category,
      bfp.lastmod::TIMESTAMPTZ AS lastmod,
      (
        COALESCE(ts_rank(bfp.search_vector, tsquery_val), 0) +
        CASE
          WHEN COALESCE(bfp.person, '') ILIKE normalized_query || '%' THEN 5
          WHEN COALESCE(bfp.person, '') ILIKE '%' || normalized_query || '%' THEN 3.5
          WHEN COALESCE(bfp.title, '') ILIKE normalized_query || '%' THEN 4
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
      AND (filter_enneagram IS NULL OR bfp.enneagram::INTEGER = filter_enneagram)
      AND (filter_category IS NULL OR bfp.category = filter_category)
      AND (filter_type IS NULL OR bfp.type ? filter_type)
  )
  SELECT *
  FROM (
    SELECT * FROM content_results
    UNION ALL
    SELECT * FROM people_results
  ) all_results
  ORDER BY all_results.rank DESC, all_results.lastmod DESC NULLS LAST
  LIMIT result_limit
  OFFSET result_offset;
END;
$$;

CREATE FUNCTION public.typeahead_blog_search(
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
BEGIN
  normalized_query := BTRIM(COALESCE(search_query, ''));

  IF normalized_query = '' THEN
    RETURN;
  END IF;

  tsquery_val := plainto_tsquery('english', normalized_query);

  RETURN QUERY
  WITH content_results AS (
    SELECT
      bc.id::BIGINT AS id,
      'content'::TEXT AS source,
      bc.slug,
      bc.title,
      bc.enneagram::INTEGER AS enneagram,
      bc.category,
      ts_headline(
        'english',
        COALESCE(bc.title, '') || ' ... ' ||
        COALESCE(bc.description, '') || ' ... ' ||
        public.text_array_search_text(COALESCE(bc.headings, ARRAY[]::TEXT[])) || ' ... ' ||
        LEFT(COALESCE(bc.content, ''), 1600),
        tsquery_val,
        'MaxWords=25, MinWords=10, StartSel=<mark>, StopSel=</mark>, MaxFragments=1, FragmentDelimiter= ... '
      ) AS headline,
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
  ),
  people_results AS (
    SELECT
      bfp.id::BIGINT AS id,
      'famous_people'::TEXT AS source,
      bfp.person AS slug,
      bfp.title,
      bfp.enneagram::INTEGER AS enneagram,
      bfp.category,
      ts_headline(
        'english',
        COALESCE(bfp.title, '') || ' ... ' ||
        COALESCE(bfp.person, '') || ' ... ' ||
        COALESCE(bfp.persona_title, '') || ' ... ' ||
        COALESCE(bfp.description, '') || ' ... ' ||
        public.markdown_heading_search_text(bfp.content) || ' ... ' ||
        LEFT(COALESCE(bfp.content, ''), 1600),
        tsquery_val,
        'MaxWords=25, MinWords=10, StartSel=<mark>, StopSel=</mark>, MaxFragments=1, FragmentDelimiter= ... '
      ) AS headline,
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
  )
  SELECT *
  FROM (
    SELECT * FROM content_results
    UNION ALL
    SELECT * FROM people_results
  ) all_results
  ORDER BY all_results.rank DESC, all_results.title ASC
  LIMIT result_limit;
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

GRANT EXECUTE ON FUNCTION public.search_all_blogs(TEXT, INTEGER, TEXT, TEXT, INTEGER, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.search_all_blogs(TEXT, INTEGER, TEXT, TEXT, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_all_blogs(TEXT, INTEGER, TEXT, TEXT, INTEGER, INTEGER) TO service_role;
