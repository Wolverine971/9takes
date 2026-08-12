-- supabase/migrations/20260812010100_optimize_blog_typeahead.sql
-- Make typeahead predictable: two-character infix searches cannot use trigram
-- indexes effectively, and rendering snippets from full Markdown dominated latency.

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

	IF LENGTH(normalized_query) < 3 THEN
		RETURN;
	END IF;

	tsquery_val := plainto_tsquery('english', normalized_query);
	candidate_limit := LEAST(GREATEST(COALESCE(result_limit, 10), 1) * 2, 40);

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
			CASE
				WHEN COALESCE(bc.title, '') ILIKE normalized_query || '%' THEN 5
				WHEN COALESCE(bc.title, '') ILIKE '%' || normalized_query || '%' THEN 3
				WHEN COALESCE(bc.description, '') ILIKE '%' || normalized_query || '%' THEN 1.5
				WHEN public.text_array_search_text(bc.headings) ILIKE normalized_query || '%' THEN 1.5
				WHEN public.text_array_search_text(bc.headings) ILIKE '%' || normalized_query || '%' THEN 1
				ELSE 0
			END::REAL AS rank
		FROM public.blogs_content bc
		WHERE bc.published = TRUE
			AND (
				COALESCE(bc.title, '') ILIKE '%' || normalized_query || '%'
				OR COALESCE(bc.description, '') ILIKE '%' || normalized_query || '%'
				OR public.text_array_search_text(bc.headings) ILIKE '%' || normalized_query || '%'
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
			CASE
				WHEN bfp.enneagram::TEXT ~ '^[1-9]$' THEN bfp.enneagram::TEXT::INTEGER
				ELSE NULL
			END AS enneagram,
			bfp.category,
			CASE
				WHEN COALESCE(bfp.person, '') ILIKE normalized_query || '%' THEN 6
				WHEN COALESCE(bfp.person, '') ILIKE '%' || normalized_query || '%' THEN 4
				WHEN COALESCE(bfp.title, '') ILIKE normalized_query || '%' THEN 4.5
				WHEN COALESCE(bfp.title, '') ILIKE '%' || normalized_query || '%' THEN 2.5
				WHEN COALESCE(bfp.persona_title, '') ILIKE '%' || normalized_query || '%' THEN 2
				WHEN COALESCE(bfp.description, '') ILIKE '%' || normalized_query || '%' THEN 1
				ELSE 0
			END::REAL AS rank
		FROM public.blogs_famous_people bfp
		WHERE bfp.published = TRUE
			AND (
				COALESCE(bfp.person, '') ILIKE '%' || normalized_query || '%'
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
				public.text_array_search_text(COALESCE(cc.headings, ARRAY[]::TEXT[])),
				tsquery_val,
				'MaxWords=25, MinWords=10, StartSel=<mark>, StopSel=</mark>, MaxFragments=1, FragmentDelimiter= ... '
			) AS headline,
			cc.rank
		FROM content_candidates cc
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
				COALESCE(pc.description, ''),
				tsquery_val,
				'MaxWords=25, MinWords=10, StartSel=<mark>, StopSel=</mark>, MaxFragments=1, FragmentDelimiter= ... '
			) AS headline,
			pc.rank
		FROM people_candidates pc
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

GRANT EXECUTE ON FUNCTION public.typeahead_blog_search(TEXT, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.typeahead_blog_search(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.typeahead_blog_search(TEXT, INTEGER) TO service_role;
