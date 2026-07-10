-- supabase/migrations/20260709_admin_question_category_rollup.sql
-- Aggregate category counts in Postgres so the admin page does not transfer
-- every category mapping and active question merely to count them in memory.

CREATE OR REPLACE FUNCTION public.get_admin_question_category_rollup()
RETURNS TABLE (
  id INTEGER,
  category_name TEXT,
  slug TEXT,
  parent_id INTEGER,
  level INTEGER,
  intro_status TEXT,
  intro_source TEXT,
  intro_generated_at TIMESTAMPTZ,
  intro_reviewed_at TIMESTAMPTZ,
  intro_updated_at TIMESTAMPTZ,
  direct_question_count BIGINT,
  subtree_question_count BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  WITH RECURSIVE category_ancestors AS (
    SELECT category.id AS descendant_id, category.id AS ancestor_id
    FROM public.question_categories AS category

    UNION ALL

    SELECT ancestry.descendant_id, ancestor.parent_id
    FROM category_ancestors AS ancestry
    JOIN public.question_categories AS ancestor
      ON ancestor.id = ancestry.ancestor_id
    WHERE ancestor.parent_id IS NOT NULL
  ),
  active_category_questions AS (
    SELECT DISTINCT mapping.tag_id, mapping.question_id
    FROM public.question_category_tags AS mapping
    JOIN public.questions AS question
      ON question.id = mapping.question_id
    WHERE question.removed IS FALSE
  ),
  direct_counts AS (
    SELECT tagged.tag_id, COUNT(*)::BIGINT AS question_count
    FROM active_category_questions AS tagged
    GROUP BY tagged.tag_id
  ),
  subtree_counts AS (
    SELECT ancestry.ancestor_id AS category_id,
           COUNT(DISTINCT tagged.question_id)::BIGINT AS question_count
    FROM active_category_questions AS tagged
    JOIN category_ancestors AS ancestry
      ON ancestry.descendant_id = tagged.tag_id
    GROUP BY ancestry.ancestor_id
  )
  SELECT category.id,
         category.category_name,
         category.slug,
         category.parent_id,
         category.level,
         category.intro_status,
         category.intro_source,
         category.intro_generated_at,
         category.intro_reviewed_at,
         category.intro_updated_at,
         COALESCE(direct_counts.question_count, 0),
         COALESCE(subtree_counts.question_count, 0)
  FROM public.question_categories AS category
  LEFT JOIN direct_counts ON direct_counts.tag_id = category.id
  LEFT JOIN subtree_counts ON subtree_counts.category_id = category.id
  WHERE COALESCE(subtree_counts.question_count, 0) > 0
    AND (
      auth.role() = 'service_role'
      OR EXISTS (
        SELECT 1
        FROM public.profiles AS actor
        WHERE actor.id = auth.uid()
          AND actor.admin IS TRUE
      )
    )
  ORDER BY category.id;
$$;

REVOKE ALL ON FUNCTION public.get_admin_question_category_rollup() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_admin_question_category_rollup() TO authenticated, service_role;
