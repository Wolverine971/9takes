-- supabase/migrations/20260513_harden_question_comment_identity.sql
-- Hardens community mutation paths against direct Supabase API identity spoofing.
-- Server actions also bind identities to locals.session.user.id, but these
-- checks keep the database honest if a client calls tables/RPCs directly.

CREATE OR REPLACE FUNCTION public.enforce_question_author_identity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_role TEXT := auth.role();
BEGIN
  IF v_role = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication is required to create questions'
      USING ERRCODE = '42501';
  END IF;

  IF NEW.author_id IS DISTINCT FROM v_user_id THEN
    RAISE EXCEPTION 'Question author_id must match the authenticated user'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_question_author_identity_insert ON public.questions;
CREATE TRIGGER enforce_question_author_identity_insert
  BEFORE INSERT ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_question_author_identity();

DROP TRIGGER IF EXISTS enforce_question_author_identity_update ON public.questions;
CREATE TRIGGER enforce_question_author_identity_update
  BEFORE UPDATE OF author_id ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_question_author_identity();

CREATE OR REPLACE FUNCTION public.enforce_comment_author_identity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_role TEXT := auth.role();
BEGIN
  IF v_role = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF NEW.author_id IS NOT NULL THEN
    IF v_user_id IS NULL OR NEW.author_id IS DISTINCT FROM v_user_id THEN
      RAISE EXCEPTION 'Comment author_id must match the authenticated user'
        USING ERRCODE = '42501';
    END IF;

    RETURN NEW;
  END IF;

  IF NEW.parent_type <> 'question' THEN
    RAISE EXCEPTION 'Anonymous visitors can only comment on questions'
      USING ERRCODE = '42501';
  END IF;

  IF NULLIF(BTRIM(COALESCE(NEW.fingerprint, '')), '') IS NULL THEN
    RAISE EXCEPTION 'Anonymous comments require a visitor fingerprint'
      USING ERRCODE = '23502';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.comments existing
    WHERE existing.parent_type = 'question'
      AND (NEW.id IS NULL OR existing.id <> NEW.id)
      AND existing.parent_id = NEW.parent_id
      AND existing.removed = false
      AND existing.author_id IS NULL
      AND existing.fingerprint = NEW.fingerprint
  ) THEN
    RAISE EXCEPTION 'Anonymous visitors can only comment once per question'
      USING ERRCODE = '23505';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_comment_author_identity_insert ON public.comments;
CREATE TRIGGER enforce_comment_author_identity_insert
  BEFORE INSERT ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_comment_author_identity();

DROP TRIGGER IF EXISTS enforce_comment_author_identity_update ON public.comments;
CREATE TRIGGER enforce_comment_author_identity_update
  BEFORE UPDATE OF author_id, parent_type, fingerprint ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_comment_author_identity();

CREATE OR REPLACE FUNCTION public.enforce_comment_like_user_identity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_role TEXT := auth.role();
BEGIN
  IF v_role = 'service_role' THEN
    IF TG_OP = 'DELETE' THEN
      RETURN OLD;
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    IF v_user_id IS NULL OR OLD.user_id IS DISTINCT FROM v_user_id THEN
      RAISE EXCEPTION 'Comment likes can only be removed by their owner'
        USING ERRCODE = '42501';
    END IF;
    RETURN OLD;
  END IF;

  IF v_user_id IS NULL OR NEW.user_id IS DISTINCT FROM v_user_id THEN
    RAISE EXCEPTION 'Comment like user_id must match the authenticated user'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_comment_like_user_identity_insert ON public.comment_like;
CREATE TRIGGER enforce_comment_like_user_identity_insert
  BEFORE INSERT ON public.comment_like
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_comment_like_user_identity();

DROP TRIGGER IF EXISTS enforce_comment_like_user_identity_update ON public.comment_like;
CREATE TRIGGER enforce_comment_like_user_identity_update
  BEFORE UPDATE OF user_id ON public.comment_like
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_comment_like_user_identity();

DROP TRIGGER IF EXISTS enforce_comment_like_user_identity_delete ON public.comment_like;
CREATE TRIGGER enforce_comment_like_user_identity_delete
  BEFORE DELETE ON public.comment_like
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_comment_like_user_identity();

CREATE OR REPLACE FUNCTION public.enforce_subscription_user_identity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_role TEXT := auth.role();
BEGIN
  IF v_role = 'service_role' THEN
    IF TG_OP = 'DELETE' THEN
      RETURN OLD;
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    IF v_user_id IS NULL OR OLD.user_id IS DISTINCT FROM v_user_id THEN
      RAISE EXCEPTION 'Subscriptions can only be removed by their owner'
        USING ERRCODE = '42501';
    END IF;
    RETURN OLD;
  END IF;

  IF v_user_id IS NULL OR NEW.user_id IS DISTINCT FROM v_user_id THEN
    RAISE EXCEPTION 'Subscription user_id must match the authenticated user'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_subscription_user_identity_insert ON public.subscriptions;
CREATE TRIGGER enforce_subscription_user_identity_insert
  BEFORE INSERT ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_subscription_user_identity();

DROP TRIGGER IF EXISTS enforce_subscription_user_identity_update ON public.subscriptions;
CREATE TRIGGER enforce_subscription_user_identity_update
  BEFORE UPDATE OF user_id ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_subscription_user_identity();

DROP TRIGGER IF EXISTS enforce_subscription_user_identity_delete ON public.subscriptions;
CREATE TRIGGER enforce_subscription_user_identity_delete
  BEFORE DELETE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_subscription_user_identity();

CREATE OR REPLACE FUNCTION public.create_comment_atomic(
  p_comment TEXT,
  p_parent_id INTEGER,
  p_author_id UUID,
  p_parent_type TEXT,
  p_fingerprint TEXT,
  p_ip TEXT,
  p_es_id TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_new_comment public.comments%ROWTYPE;
  v_user_id UUID := auth.uid();
  v_role TEXT := auth.role();
BEGIN
  IF v_role <> 'service_role' AND p_author_id IS NOT NULL THEN
    IF v_user_id IS NULL OR p_author_id IS DISTINCT FROM v_user_id THEN
      RAISE EXCEPTION 'Comment author_id must match the authenticated user'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  INSERT INTO public.comments (
    comment,
    parent_id,
    author_id,
    parent_type,
    fingerprint,
    ip,
    es_id,
    comment_count,
    like_count,
    removed
  )
  VALUES (
    p_comment,
    p_parent_id,
    p_author_id,
    p_parent_type,
    p_fingerprint,
    p_ip,
    p_es_id,
    0,
    0,
    false
  )
  RETURNING * INTO v_new_comment;

  IF p_parent_type = 'comment' THEN
    UPDATE public.comments
    SET comment_count = COALESCE(comment_count, 0) + 1
    WHERE id = p_parent_id;
  END IF;

  RETURN row_to_json(v_new_comment);
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_comment_atomic(
  TEXT,
  INTEGER,
  UUID,
  TEXT,
  TEXT,
  TEXT,
  TEXT
) TO anon, authenticated;
