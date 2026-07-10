-- supabase/migrations/20260709_admin_user_status_safety.sql
-- Atomically change administrator status without allowing self-lockout or
-- removal of the final administrator account.

CREATE OR REPLACE FUNCTION public.set_admin_status_safely(
  p_target_user_id UUID,
  p_is_admin BOOLEAN
)
RETURNS TABLE (
  id UUID,
  email TEXT,
  admin BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_actor_id UUID := auth.uid();
  v_is_service_role BOOLEAN := auth.role() IS NOT DISTINCT FROM 'service_role';
  v_target_is_admin BOOLEAN;
BEGIN
  IF NOT v_is_service_role AND v_actor_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  IF NOT v_is_service_role AND NOT EXISTS (
    SELECT 1
    FROM public.profiles AS actor
    WHERE actor.id = v_actor_id
      AND actor.admin IS TRUE
  ) THEN
    RAISE EXCEPTION 'Administrator access required' USING ERRCODE = '42501';
  END IF;

  -- Serialize role changes so two concurrent demotions cannot both observe a
  -- second administrator and remove the final two accounts.
  PERFORM pg_advisory_xact_lock(hashtextextended('profiles-admin-status', 0));

  SELECT target.admin IS TRUE
  INTO v_target_is_admin
  FROM public.profiles AS target
  WHERE target.id = p_target_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Target user not found' USING ERRCODE = 'P0002';
  END IF;

  IF NOT v_is_service_role
    AND p_is_admin IS FALSE
    AND p_target_user_id = v_actor_id THEN
    RAISE EXCEPTION 'You cannot remove your own administrator access'
      USING ERRCODE = '22023';
  END IF;

  IF p_is_admin IS FALSE
    AND v_target_is_admin
    AND NOT EXISTS (
      SELECT 1
      FROM public.profiles AS other_admin
      WHERE other_admin.admin IS TRUE
        AND other_admin.id <> p_target_user_id
    ) THEN
    RAISE EXCEPTION 'At least one administrator account must remain'
      USING ERRCODE = '23514';
  END IF;

  RETURN QUERY
  UPDATE public.profiles AS target
  SET admin = p_is_admin
  WHERE target.id = p_target_user_id
  RETURNING target.id, target.email, target.admin IS TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.set_admin_status_safely(UUID, BOOLEAN) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_admin_status_safely(UUID, BOOLEAN) TO authenticated, service_role;
