-- supabase/migrations/20260418_admin_dashboard_performance.sql
-- Purpose: Reduce /admin dashboard load time by avoiding full-row scans for summary widgets.

CREATE INDEX IF NOT EXISTS idx_profiles_demo_created_at_desc
ON public.profiles_demo (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_profiles_demo_enneagram
ON public.profiles_demo (enneagram)
WHERE enneagram IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_questions_created_at_desc
ON public.questions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comments_created_at_desc
ON public.comments (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at_desc
ON public.blog_comments (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_coaching_waitlist_created_at_desc
ON public.coaching_waitlist (created_at DESC);

CREATE OR REPLACE FUNCTION public.get_admin_enneagram_distribution(
	p_demo_time BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
	enneagram TEXT,
	user_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
	IF COALESCE(p_demo_time, FALSE) THEN
		RETURN QUERY
		SELECT
			p.enneagram::TEXT,
			COUNT(*)::BIGINT AS user_count
		FROM public.profiles_demo p
		WHERE NULLIF(BTRIM(p.enneagram), '') IS NOT NULL
		GROUP BY p.enneagram
		ORDER BY p.enneagram;
		RETURN;
	END IF;

	RETURN QUERY
	SELECT
		p.enneagram::TEXT,
		COUNT(*)::BIGINT AS user_count
	FROM public.profiles p
	WHERE NULLIF(BTRIM(p.enneagram), '') IS NOT NULL
	GROUP BY p.enneagram
	ORDER BY p.enneagram;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_enneagram_distribution(BOOLEAN) TO authenticated;
