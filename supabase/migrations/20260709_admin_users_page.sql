-- Return one globally filtered and sorted admin-user page without exposing
-- auth.users directly to the browser or transferring the full user directory.

CREATE OR REPLACE FUNCTION public.get_admin_users_page(
  p_search TEXT DEFAULT '',
  p_filter TEXT DEFAULT 'all',
  p_sort_by TEXT DEFAULT 'last_sign_in_at',
  p_sort_direction TEXT DEFAULT 'desc',
  p_limit INTEGER DEFAULT 100,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  email TEXT,
  aud TEXT,
  role TEXT,
  phone TEXT,
  confirmation_sent_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  invited_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  enneagram TEXT,
  external_id TEXT,
  admin BOOLEAN,
  total_rows BIGINT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_search TEXT := LEFT(BTRIM(COALESCE(p_search, '')), 200);
  v_filter TEXT := LOWER(COALESCE(p_filter, 'all'));
  v_sort_by TEXT := LOWER(COALESCE(p_sort_by, 'last_sign_in_at'));
  v_sort_direction TEXT := LOWER(COALESCE(p_sort_direction, 'desc'));
  v_limit INTEGER := LEAST(GREATEST(COALESCE(p_limit, 100), 1), 100);
  v_offset INTEGER := GREATEST(COALESCE(p_offset, 0), 0);
  v_order_expression TEXT;
BEGIN
  IF auth.role() IS DISTINCT FROM 'service_role' AND NOT EXISTS (
    SELECT 1
    FROM public.profiles AS actor
    WHERE actor.id = auth.uid()
      AND actor.admin IS TRUE
  ) THEN
    RAISE EXCEPTION 'Administrator access required' USING ERRCODE = '42501';
  END IF;

  IF v_filter NOT IN ('all', 'admins', 'with-type', 'no-type') THEN
    v_filter := 'all';
  END IF;

  IF v_sort_by NOT IN ('last_sign_in_at', 'created_at', 'email', 'enneagram', 'admin') THEN
    v_sort_by := 'last_sign_in_at';
  END IF;

  IF v_sort_direction NOT IN ('asc', 'desc') THEN
    v_sort_direction := 'desc';
  END IF;

  v_order_expression := CASE v_sort_by
    WHEN 'created_at' THEN 'auth_user.created_at'
    WHEN 'email' THEN 'COALESCE(profile.email, auth_user.email)'
    WHEN 'enneagram' THEN 'profile.enneagram'
    WHEN 'admin' THEN 'profile.admin'
    ELSE 'auth_user.last_sign_in_at'
  END;

  RETURN QUERY EXECUTE FORMAT(
    $query$
      SELECT auth_user.id,
             COALESCE(profile.email, auth_user.email)::TEXT AS email,
             auth_user.aud::TEXT,
             auth_user.role::TEXT,
             auth_user.phone::TEXT,
             auth_user.confirmation_sent_at,
             auth_user.confirmed_at,
             auth_user.invited_at,
             auth_user.last_sign_in_at,
             auth_user.created_at,
             profile.username,
             profile.first_name,
             profile.last_name,
             profile.enneagram,
             profile.external_id,
             profile.admin IS TRUE AS admin,
             COUNT(*) OVER()::BIGINT AS total_rows
      FROM auth.users AS auth_user
      LEFT JOIN public.profiles AS profile ON profile.id = auth_user.id
      WHERE (
        $1 = ''
        OR POSITION(LOWER($1) IN LOWER(COALESCE(profile.email, auth_user.email, ''))) > 0
        OR POSITION(LOWER($1) IN LOWER(COALESCE(profile.username, ''))) > 0
        OR POSITION(LOWER($1) IN LOWER(COALESCE(profile.first_name, ''))) > 0
        OR POSITION(LOWER($1) IN LOWER(COALESCE(profile.last_name, ''))) > 0
      )
      AND CASE $2
        WHEN 'admins' THEN profile.admin IS TRUE
        WHEN 'with-type' THEN NULLIF(BTRIM(profile.enneagram), '') IS NOT NULL
        WHEN 'no-type' THEN NULLIF(BTRIM(profile.enneagram), '') IS NULL
        ELSE TRUE
      END
      ORDER BY %s %s NULLS LAST, auth_user.id %s
      LIMIT $3
      OFFSET $4
    $query$,
    v_order_expression,
    UPPER(v_sort_direction),
    UPPER(v_sort_direction)
  ) USING v_search, v_filter, v_limit, v_offset;
END;
$$;

REVOKE ALL ON FUNCTION public.get_admin_users_page(TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_admin_users_page(TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER)
  TO authenticated, service_role;
