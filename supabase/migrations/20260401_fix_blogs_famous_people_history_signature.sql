-- supabase/migrations/20260401_fix_blogs_famous_people_history_signature.sql
-- Repair the blog history cleanup path after the retention update introduced
-- an INTEGER signature that does not match blogs_famous_people.id (BIGINT).

ALTER TABLE public.blogs_famous_people_history
ALTER COLUMN famous_people_id TYPE BIGINT
USING famous_people_id::BIGINT;

DROP FUNCTION IF EXISTS public.cleanup_blogs_famous_people_history(INTEGER);
DROP FUNCTION IF EXISTS public.cleanup_blogs_famous_people_history(INTEGER, INTEGER);
DROP FUNCTION IF EXISTS public.cleanup_blogs_famous_people_history(BIGINT);
DROP FUNCTION IF EXISTS public.cleanup_blogs_famous_people_history(BIGINT, INTEGER);

CREATE FUNCTION public.cleanup_blogs_famous_people_history(
	p_famous_people_id BIGINT,
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
			ORDER BY changed_at DESC, id DESC
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
