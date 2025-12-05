-- supabase/migrations/20251204_blog_typeahead_search.sql
-- Typeahead search function with text highlighting using ts_headline

-- ============================================
-- TYPEAHEAD SEARCH FUNCTION WITH HIGHLIGHTS
-- ============================================

CREATE OR REPLACE FUNCTION typeahead_blog_search(
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
) AS $$
DECLARE
    tsquery_val TSQUERY;
BEGIN
    -- Convert search query to tsquery for highlighting
    -- Using plainto_tsquery for simpler matching (better for typeahead)
    tsquery_val := plainto_tsquery('english', search_query);

    RETURN QUERY
    WITH all_results AS (
        -- Search blogs_content
        SELECT
            bc.id,
            'content'::TEXT as source,
            bc.slug,
            bc.title,
            bc.enneagram::INTEGER,
            bc.category,
            -- Generate headline from content with highlighted matches
            ts_headline(
                'english',
                COALESCE(bc.title, '') || ' ... ' || COALESCE(bc.description, '') || ' ... ' || LEFT(COALESCE(bc.content, ''), 2000),
                tsquery_val,
                'MaxWords=25, MinWords=10, StartSel=<mark>, StopSel=</mark>, MaxFragments=1, FragmentDelimiter= ... '
            ) as headline,
            ts_rank(bc.search_vector, tsquery_val) as rank
        FROM blogs_content bc
        WHERE bc.published = true
            AND (
                bc.search_vector @@ tsquery_val
                OR bc.title ILIKE '%' || search_query || '%'
                OR bc.description ILIKE '%' || search_query || '%'
            )

        UNION ALL

        -- Search blogs_famous_people
        SELECT
            bfp.id,
            'famous_people'::TEXT as source,
            bfp.person as slug,
            bfp.title,
            bfp.enneagram::INTEGER,
            bfp.category,
            -- Generate headline from content with highlighted matches
            ts_headline(
                'english',
                COALESCE(bfp.title, '') || ' ... ' || COALESCE(bfp.person, '') || ' ... ' || COALESCE(bfp.description, '') || ' ... ' || LEFT(COALESCE(bfp.content, ''), 2000),
                tsquery_val,
                'MaxWords=25, MinWords=10, StartSel=<mark>, StopSel=</mark>, MaxFragments=1, FragmentDelimiter= ... '
            ) as headline,
            ts_rank(bfp.search_vector, tsquery_val) as rank
        FROM blogs_famous_people bfp
        WHERE bfp.published = true
            AND (
                bfp.search_vector @@ tsquery_val
                OR bfp.title ILIKE '%' || search_query || '%'
                OR bfp.person ILIKE '%' || search_query || '%'
                OR bfp.description ILIKE '%' || search_query || '%'
            )
    )
    SELECT * FROM all_results
    ORDER BY all_results.rank DESC, all_results.title ASC
    LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Grant access
GRANT EXECUTE ON FUNCTION typeahead_blog_search(TEXT, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION typeahead_blog_search(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION typeahead_blog_search(TEXT, INTEGER) TO service_role;
