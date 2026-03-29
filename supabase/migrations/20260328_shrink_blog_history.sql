-- supabase/migrations/20260328_shrink_blog_history.sql
-- Shrink blog history footprint by storing only the latest content snapshot
-- and reducing retained history rows per blog from 5 to 3.

CREATE OR REPLACE FUNCTION public.cleanup_blogs_famous_people_history(
	p_famous_people_id INTEGER,
	p_keep_count INTEGER DEFAULT 3
)
RETURNS VOID
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
	v_keep_count INTEGER := GREATEST(COALESCE(p_keep_count, 3), 1);
BEGIN
	DELETE FROM public.blogs_famous_people_history
	WHERE famous_people_id = p_famous_people_id
		AND id NOT IN (
			SELECT id
			FROM public.blogs_famous_people_history
			WHERE famous_people_id = p_famous_people_id
			ORDER BY changed_at DESC
			LIMIT v_keep_count
		);
END;
$$;

CREATE OR REPLACE FUNCTION public.track_blogs_famous_people_content_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
	IF OLD.content IS DISTINCT FROM NEW.content THEN
		INSERT INTO public.blogs_famous_people_history (
			famous_people_id,
			old_content,
			new_content,
			changed_by
		) VALUES (
			NEW.id,
			NULL,
			NEW.content,
			auth.uid()
		);

		PERFORM public.cleanup_blogs_famous_people_history(NEW.id, 3);
	END IF;

	RETURN NEW;
END;
$$;

-- Remove historical copies of the previous article body. The diff UI compares
-- snapshot-to-snapshot using new_content/current content, so old_content is redundant.
UPDATE public.blogs_famous_people_history
SET old_content = NULL
WHERE old_content IS NOT NULL;

-- Apply the tighter retention window to existing history rows.
WITH ranked_history AS (
	SELECT
		id,
		ROW_NUMBER() OVER (
			PARTITION BY famous_people_id
			ORDER BY changed_at DESC, id DESC
		) AS row_num
	FROM public.blogs_famous_people_history
)
DELETE FROM public.blogs_famous_people_history h
USING ranked_history r
WHERE h.id = r.id
	AND r.row_num > 3;
