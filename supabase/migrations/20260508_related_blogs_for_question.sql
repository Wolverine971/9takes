-- supabase/migrations/20260508_related_blogs_for_question.sql
-- Purpose: Bridge the /questions graph to the blog graph by surfacing related
--          blog posts on every question detail page. Closes the long-standing
--          "questions are isolated" gap flagged in:
--            - docs/seo/master-topic-cluster-map-2026-05-06.md (Section 7,
--              bridge class "Questions ↔ blog")
--            - docs/seo/2026-05-06-research-synthesis.md (Convergence #4)
--            - docs/seo/buckets/2026-05-07-bucket-3-internal-linking.md
--              (stretch goal — punted from first wave)
--
-- How it works:
--   1. Pull the comma-separated keywords from `question_keywords` for the
--      input question.
--   2. Split + normalize them into a set of trimmed lowercase terms.
--   3. Match those terms against:
--        - `blogs_content.tags`              (text[])
--        - `blogs_famous_people.keywords`    (text[])
--   4. Return the top N results with a simple tag-overlap relevance score.
--
-- Consumers:
--   - `src/routes/questions/[slug]/+page.server.ts` — render a "Related blog
--     posts" block (3-5 items) below the question + comments.
--   - The 7 question category pages — for category-level related-blog rails
--     (call once per category with a representative question_id, or extend
--     this RPC to accept a category_id input — see follow-up note below).
--
-- Follow-ups (intentionally out of scope here):
--   - A category-level variant that pools keywords across all questions in a
--     category. Punted to keep the first ship surgical.
--   - Tie-breaking by recency of `lastmod` once tag-overlap relevance is
--     equal. Currently breaks ties alphabetically by slug for determinism.

CREATE OR REPLACE FUNCTION public.get_related_blogs_for_question(
	question_id_input bigint,
	limit_count integer DEFAULT 5
)
RETURNS TABLE (
	slug text,
	title text,
	description text,
	url text,
	source text,
	relevance integer
)
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
	WITH terms AS (
		-- Normalize the comma-separated keywords text into a set of lowercase
		-- trimmed terms. `question_keywords.keywords` is stored as a single
		-- comma-separated TEXT column (see database.types.ts) so we split
		-- and trim here. Multiple rows per question are unioned.
		SELECT DISTINCT lower(trim(t)) AS term
		FROM public.question_keywords qk
		CROSS JOIN LATERAL unnest(string_to_array(qk.keywords, ',')) AS t
		WHERE qk.question_id = question_id_input
			AND qk.keywords IS NOT NULL
			AND length(trim(t)) > 0
	),
	blog_matches AS (
		SELECT
			b.slug,
			b.title,
			b.description,
			COALESCE(b.loc, b.url, '/' || COALESCE(b.category, 'community') || '/' || b.slug) AS url,
			'blogs_content'::text AS source,
			-- Count overlap between blog tags (lowercased) and the term set.
			(
				SELECT count(*)::int
				FROM unnest(b.tags) AS tag
				WHERE lower(tag) IN (SELECT term FROM terms)
			) AS relevance
		FROM public.blogs_content b
		WHERE b.published = true
			AND b.tags IS NOT NULL
			AND array_length(b.tags, 1) > 0
	),
	people_matches AS (
		-- `blogs_famous_people` has no `slug` column. The slug is the path
		-- segment after `/personality-analysis/` in `loc`. We extract it
		-- here and discard rows whose `loc` doesn't fit the expected shape.
		SELECT
			NULLIF(split_part(p.loc, '/personality-analysis/', 2), '') AS slug,
			COALESCE(p.title, p.person, p.meta_title) AS title,
			p.description,
			p.loc AS url,
			'blogs_famous_people'::text AS source,
			(
				SELECT count(*)::int
				FROM unnest(p.keywords) AS kw
				WHERE lower(kw) IN (SELECT term FROM terms)
			) AS relevance
		FROM public.blogs_famous_people p
		WHERE p.published = true
			AND p.keywords IS NOT NULL
			AND array_length(p.keywords, 1) > 0
			AND p.loc IS NOT NULL
			AND p.loc LIKE '%/personality-analysis/%'
	)
	SELECT slug, title, description, url, source, relevance
	FROM (
		SELECT slug, title, description, url, source, relevance FROM blog_matches
		UNION ALL
		SELECT slug, title, description, url, source, relevance FROM people_matches
	) combined
	WHERE relevance > 0
		AND slug IS NOT NULL
	ORDER BY relevance DESC, slug ASC
	LIMIT GREATEST(coalesce(limit_count, 5), 1);
$$;

COMMENT ON FUNCTION public.get_related_blogs_for_question(bigint, integer) IS
	'Returns up to limit_count related blog posts for a given question, scored by tag/keyword overlap with question_keywords. See supabase/migrations/20260508_related_blogs_for_question.sql for design notes.';

-- Anonymous users can read questions; the related-blogs lookup must follow
-- the same access posture. SECURITY INVOKER keeps existing RLS in force.
GRANT EXECUTE ON FUNCTION public.get_related_blogs_for_question(bigint, integer) TO anon, authenticated, service_role;
