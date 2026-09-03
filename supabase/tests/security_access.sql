-- supabase/tests/security_access.sql
-- Run with psql as postgres AFTER applying the security migrations.
-- Requires existing ordinary-user and admin profiles; all mutations roll back.
-- No personal records or credentials are printed.
\set ON_ERROR_STOP on
BEGIN;
SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '30s';
DO $$ DECLARE v_user uuid; BEGIN
  SELECT id INTO v_user FROM public.profiles WHERE admin IS NOT TRUE LIMIT 1;
  IF v_user IS NULL THEN RAISE EXCEPTION 'No ordinary profile available for policy validation'; END IF;
  PERFORM set_config('audit.test_user', v_user::text, true);
END $$;
SET LOCAL ROLE anon;
DO $$ BEGIN
  IF (SELECT count(*) FROM public.profiles) <> 0 THEN RAISE EXCEPTION 'Anonymous profile data exposed'; END IF;
  IF (SELECT count(*) FROM public.person_suggestions) <> 0 THEN RAISE EXCEPTION 'Suggestions exposed'; END IF;
  IF (SELECT count(*) FROM public.coaching_waitlist) <> 0 THEN RAISE EXCEPTION 'Waitlist exposed'; END IF;
  IF (SELECT count(*) FROM public.email_sends) <> 0 THEN RAISE EXCEPTION 'Email data exposed'; END IF;
  IF (SELECT count(*) FROM public.public_profiles) = 0 THEN RAISE EXCEPTION 'Public profile projection unavailable'; END IF;
  IF (SELECT count(*) FROM public.questions) = 0 THEN RAISE EXCEPTION 'Public questions unavailable'; END IF;
  IF (SELECT count(*) FROM public.blogs_famous_people) = 0 THEN RAISE EXCEPTION 'Published articles unavailable'; END IF;
  IF has_column_privilege(current_user, 'public.comments', 'ip', 'SELECT') THEN RAISE EXCEPTION 'Comment IP exposed'; END IF;
  IF has_function_privilege(current_user, 'public.create_comment_atomic(text,integer,uuid,text,text,text,text)', 'EXECUTE') THEN RAISE EXCEPTION 'Direct comment creation exposed'; END IF;
  IF has_function_privilege(current_user, 'public.get_all_users()', 'EXECUTE') THEN RAISE EXCEPTION 'Account export exposed'; END IF;
  IF has_column_privilege(current_user, 'public.blog_comments', 'ip', 'SELECT') THEN RAISE EXCEPTION 'Blog comment IP exposed'; END IF;
  BEGIN
    INSERT INTO storage.objects(bucket_id, name) VALUES ('questions', 'images/security-audit-denied.png');
    RAISE EXCEPTION 'Anonymous storage upload was allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  RAISE NOTICE 'PASS: anonymous storage denial';
  RAISE NOTICE 'PASS: anonymous private-data denial, public content, and RPC privileges';
END $$;
RESET ROLE;
DO $$ BEGIN
  PERFORM set_config('request.jwt.claims', json_build_object('sub', current_setting('audit.test_user'), 'role', 'authenticated')::text, true);
END $$;
SET LOCAL ROLE authenticated;
DO $$ BEGIN
  IF (SELECT count(*) FROM public.profiles) <> 1 THEN RAISE EXCEPTION 'Profile ownership policy failed'; END IF;
  IF (SELECT count(*) FROM public.coaching_waitlist) <> 0 THEN RAISE EXCEPTION 'Ordinary user can read waitlist'; END IF;
  BEGIN
    UPDATE public.profiles SET admin = true WHERE id = auth.uid();
    RAISE EXCEPTION 'Profile privilege escalation was allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    PERFORM public.get_admin_retention_summary();
    RAISE EXCEPTION 'Ordinary user can access private retention report';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  UPDATE public.profiles SET first_name = first_name WHERE id = auth.uid();
  RAISE NOTICE 'PASS: ordinary-user ownership, privilege escalation denial, and profile edit';
END $$;
RESET ROLE;
SELECT count(*) AS public_tables_without_rls FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind='r' AND NOT c.relrowsecurity;

DO $$ DECLARE v_admin uuid; BEGIN
  SELECT id INTO v_admin FROM public.profiles WHERE admin IS TRUE LIMIT 1;
  IF v_admin IS NULL THEN RAISE EXCEPTION 'No admin available for policy validation'; END IF;
  PERFORM set_config('request.jwt.claims', json_build_object('sub',v_admin,'role','authenticated')::text,true);
END $$;
SET LOCAL ROLE authenticated;
DO $$ BEGIN
  PERFORM public.get_admin_retention_summary();
  PERFORM public.get_admin_users_page('', 'all', 'last_sign_in_at', 'desc', 1, 0);
  PERFORM public.get_admin_consulting_dashboard_summary();
  RAISE NOTICE 'PASS: authenticated admin reports';
END $$;
RESET ROLE;

CREATE FUNCTION public.audit_default_privilege_probe() RETURNS integer LANGUAGE sql AS 'SELECT 1';
DO $$ BEGIN
  IF has_function_privilege('anon', 'public.audit_default_privilege_probe()', 'EXECUTE') THEN RAISE EXCEPTION 'New functions still public'; END IF;
  RAISE NOTICE 'PASS: future functions require explicit API grants';
END $$;

ROLLBACK;
