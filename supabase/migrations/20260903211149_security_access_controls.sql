-- supabase/migrations/20260903211149_security_access_controls.sql
-- Immediate containment. This migration is compatible with the deployed app.
-- Public profile projection / remaining table policies are handled separately.
BEGIN;

CREATE OR REPLACE FUNCTION public.protect_profile_privileges()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  -- SECURITY INVOKER: trusted definer functions (first-touch attribution and
  -- admin role management) execute as their owner, not the API role.
  IF current_user IN ('anon', 'authenticated') AND NOT public.is_admin() THEN
    IF TG_OP = 'INSERT' THEN
      IF NEW.admin IS TRUE OR NEW.id IS DISTINCT FROM auth.uid() THEN
        RAISE EXCEPTION 'Profile privileges cannot be assigned by the client' USING ERRCODE = '42501';
      END IF;
    ELSIF (to_jsonb(NEW) - ARRAY['first_name','last_name','enneagram','username','avatar_url','website'])
       IS DISTINCT FROM
       (to_jsonb(OLD) - ARRAY['first_name','last_name','enneagram','username','avatar_url','website']) THEN
      RAISE EXCEPTION 'Only profile display fields may be changed' USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.protect_profile_privileges() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER protect_profile_privileges
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_privileges();
CREATE TRIGGER protect_profile_privileges
BEFORE INSERT OR UPDATE ON public.profiles_demo
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_privileges();

-- No application route uses this legacy unrestricted auth.users export.
REVOKE ALL ON FUNCTION public.get_all_users() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_users() TO service_role;

-- These functions spend or remove shared rate-limit budgets and must be server-only.
REVOKE ALL ON FUNCTION public.consume_api_rate_limit(text,text,integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.prune_api_rate_limit_events() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_api_rate_limit(text,text,integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.prune_api_rate_limit_events() TO service_role;

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.admin_settings;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.admin_settings;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.admin_settings;
DROP POLICY IF EXISTS "Enable updateeed for authenticated users only" ON public.admin_settings;
CREATE POLICY public_demo_setting ON public.admin_settings FOR SELECT TO anon, authenticated
  USING (type = 'demo_time');
CREATE POLICY admin_settings_management ON public.admin_settings FOR ALL TO authenticated
  USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public.consulting_resources ENABLE ROW LEVEL SECURITY;

-- Tracking routes already use a service client. Public reads expose recipient
-- addresses, message bodies and bearer tracking identifiers.
DROP POLICY IF EXISTS "Allow public read for tracking" ON public.email_sends;
DO $$ DECLARE p record; BEGIN
  FOR p IN SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'email_sends' AND cmd = 'SELECT' AND qual = 'true'
  LOOP EXECUTE format('DROP POLICY %I ON public.email_sends', p.policyname); END LOOP;
  FOR p IN SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'email_tracking_events' AND cmd = 'INSERT' AND with_check = 'true'
  LOOP EXECUTE format('DROP POLICY %I ON public.email_tracking_events', p.policyname); END LOOP;
END $$;

ALTER VIEW public.consulting_clients_overview SET (security_invoker = true);
ALTER VIEW public.consulting_upcoming_sessions SET (security_invoker = true);
ALTER VIEW public.email_scheduled_pending SET (security_invoker = true);

NOTIFY pgrst, 'reload schema';
COMMIT;
