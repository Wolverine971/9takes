-- supabase/migrations/20260408_grant_attach_signup_first_touch_to_anon.sql
GRANT EXECUTE ON FUNCTION public.attach_signup_first_touch(BIGINT, TEXT) TO anon;
