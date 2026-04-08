-- supabase/migrations/20260408_blog_search_indexing_hardening.sql
-- Harden blog search indexing for local markdown sync and better ranking.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE public.blogs_content
ADD COLUMN IF NOT EXISTS headings TEXT[] DEFAULT '{}'::TEXT[];

ALTER TABLE public.blogs_content
ADD COLUMN IF NOT EXISTS content_hash TEXT;

ALTER TABLE public.blogs_content
ADD COLUMN IF NOT EXISTS indexed_at TIMESTAMPTZ DEFAULT NOW();

CREATE OR REPLACE FUNCTION public.text_array_search_text(p_values TEXT[])
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT COALESCE(
    string_agg(trimmed_value, ' '),
    ''
  )
  FROM (
    SELECT BTRIM(value) AS trimmed_value
    FROM unnest(COALESCE(p_values, ARRAY[]::TEXT[])) AS value
    WHERE BTRIM(value) <> ''
  ) normalized_values;
$$;

CREATE OR REPLACE FUNCTION public.markdown_heading_search_text(p_content TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT COALESCE(
    string_agg(
      NULLIF(
        BTRIM(
          regexp_replace(
            regexp_replace(
              regexp_replace(
                regexp_replace(
                  regexp_replace(match[1], '!\[([^\]]*)\]\([^)]+\)', '\1', 'g'),
                  '\[([^\]]+)\]\([^)]+\)',
                  '\1',
                  'g'
                ),
                '<[^>]+>',
                ' ',
                'g'
              ),
              '[*_`~#]+',
              ' ',
              'g'
            ),
            '\s+',
            ' ',
            'g'
          )
        ),
        ''
      ),
      ' '
    ),
    ''
  )
  FROM regexp_matches(
    COALESCE(p_content, ''),
    '(?m)^#{1,6}\s+(.+?)(?:\s+#+\s*)?$',
    'g'
  ) AS match;
$$;

CREATE OR REPLACE FUNCTION public.build_blogs_content_search_vector(
  p_title TEXT,
  p_description TEXT,
  p_type TEXT[],
  p_tags TEXT[],
  p_category TEXT,
  p_headings TEXT[],
  p_content TEXT
)
RETURNS TSVECTOR
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT
    setweight(to_tsvector('english', COALESCE(p_title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(p_description, '')), 'B') ||
    setweight(
      to_tsvector('english', public.text_array_search_text(COALESCE(p_headings, ARRAY[]::TEXT[]))),
      'B'
    ) ||
    setweight(to_tsvector('english', COALESCE(p_category, '')), 'B') ||
    setweight(
      to_tsvector('english', public.text_array_search_text(COALESCE(p_type, ARRAY[]::TEXT[]))),
      'B'
    ) ||
    setweight(
      to_tsvector('english', public.text_array_search_text(COALESCE(p_tags, ARRAY[]::TEXT[]))),
      'B'
    ) ||
    setweight(to_tsvector('english', COALESCE(p_content, '')), 'C');
$$;

CREATE OR REPLACE FUNCTION public.build_blogs_famous_people_search_vector(
  p_title TEXT,
  p_person TEXT,
  p_persona_title TEXT,
  p_description TEXT,
  p_type JSONB,
  p_tags TEXT[],
  p_category TEXT,
  p_content TEXT
)
RETURNS TSVECTOR
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT
    setweight(to_tsvector('english', COALESCE(p_title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(p_person, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(p_persona_title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(p_description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(p_category, '')), 'B') ||
    setweight(to_tsvector('english', jsonb_array_to_text(p_type)), 'B') ||
    setweight(
      to_tsvector('english', public.text_array_search_text(COALESCE(p_tags, ARRAY[]::TEXT[]))),
      'B'
    ) ||
    setweight(to_tsvector('english', public.markdown_heading_search_text(p_content)), 'B') ||
    setweight(to_tsvector('english', COALESCE(p_content, '')), 'C');
$$;

CREATE OR REPLACE FUNCTION public.blogs_content_search_vector_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.search_vector := public.build_blogs_content_search_vector(
    NEW.title,
    NEW.description,
    NEW.type,
    NEW.tags,
    NEW.category,
    NEW.headings,
    NEW.content
  );
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.blogs_famous_people_search_vector_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.search_vector := public.build_blogs_famous_people_search_vector(
    NEW.title,
    NEW.person,
    NEW.persona_title,
    NEW.description,
    NEW.type,
    NEW.tags,
    NEW.category,
    NEW.content
  );
  RETURN NEW;
END;
$$;

CREATE INDEX IF NOT EXISTS idx_blogs_content_title_trgm
ON public.blogs_content
USING GIN (title gin_trgm_ops)
WHERE published = TRUE;

CREATE INDEX IF NOT EXISTS idx_blogs_content_description_trgm
ON public.blogs_content
USING GIN (description gin_trgm_ops)
WHERE published = TRUE;

CREATE INDEX IF NOT EXISTS idx_blogs_content_headings_trgm
ON public.blogs_content
USING GIN ((public.text_array_search_text(headings)) gin_trgm_ops)
WHERE published = TRUE;

CREATE INDEX IF NOT EXISTS idx_blogs_famous_people_title_trgm
ON public.blogs_famous_people
USING GIN (title gin_trgm_ops)
WHERE published = TRUE;

CREATE INDEX IF NOT EXISTS idx_blogs_famous_people_person_trgm
ON public.blogs_famous_people
USING GIN (person gin_trgm_ops)
WHERE published = TRUE;

CREATE INDEX IF NOT EXISTS idx_blogs_famous_people_persona_title_trgm
ON public.blogs_famous_people
USING GIN (persona_title gin_trgm_ops)
WHERE published = TRUE;

CREATE INDEX IF NOT EXISTS idx_blogs_famous_people_description_trgm
ON public.blogs_famous_people
USING GIN (description gin_trgm_ops)
WHERE published = TRUE;

UPDATE public.blogs_content
SET search_vector = public.build_blogs_content_search_vector(
  title,
  description,
  type,
  tags,
  category,
  headings,
  content
);

UPDATE public.blogs_famous_people
SET search_vector = public.build_blogs_famous_people_search_vector(
  title,
  person,
  persona_title,
  description,
  type,
  tags,
  category,
  content
);

CREATE OR REPLACE FUNCTION public.search_all_blogs(
  search_query TEXT,
  filter_enneagram INTEGER DEFAULT NULL,
  filter_category TEXT DEFAULT NULL,
  filter_type TEXT DEFAULT NULL,
  result_limit INTEGER DEFAULT 20,
  result_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id INTEGER,
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
      bc.id,
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
      bfp.id,
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

CREATE OR REPLACE FUNCTION public.typeahead_blog_search(
  search_query TEXT,
  result_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id INTEGER,
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
      bc.id,
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
      bfp.id,
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
