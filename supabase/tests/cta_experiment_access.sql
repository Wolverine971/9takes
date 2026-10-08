-- supabase/tests/cta_experiment_access.sql
-- Run with psql as postgres against a LOCAL test database after the CTA migrations.
-- Requires an ordinary and admin profile. Fixtures roll back; prints no personal data.
\set ON_ERROR_STOP on
BEGIN;
SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '30s';

DO $$ DECLARE v_admin uuid; v_user uuid; BEGIN
  SELECT id INTO v_admin FROM public.profiles WHERE admin IS TRUE LIMIT 1;
  SELECT id INTO v_user FROM public.profiles WHERE admin IS NOT TRUE LIMIT 1;
  IF v_admin IS NULL OR v_user IS NULL THEN
    RAISE EXCEPTION 'Both admin and ordinary-user test profiles are required';
  END IF;
  PERFORM set_config('cta_test.admin', v_admin::text, true);
  PERFORM set_config('cta_test.user', v_user::text, true);
  PERFORM set_config('cta_test.experiment', '__cta_access_test_' || txid_current(), true);
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.cta_experiment_events'::regclass) THEN
    RAISE EXCEPTION 'CTA events RLS is disabled';
  END IF;
END $$;

SET LOCAL ROLE service_role;
INSERT INTO public.cta_experiment_events (experiment, variant, event)
VALUES
  (current_setting('cta_test.experiment'), 'a', 'viewed'),
  (current_setting('cta_test.experiment'), 'a', 'viewed'),
  (current_setting('cta_test.experiment'), 'a', 'opened'),
  (current_setting('cta_test.experiment'), 'b', 'submitted');
RESET ROLE;

SET LOCAL ROLE anon;
DO $$ BEGIN
  BEGIN
    PERFORM count(id) FROM public.cta_experiment_events;
    RAISE EXCEPTION 'Anonymous CTA reads were allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  RAISE NOTICE 'PASS: anonymous reads denied';
END $$;
RESET ROLE;

DO $$ BEGIN
  PERFORM set_config('request.jwt.claims', json_build_object('sub', current_setting('cta_test.user'), 'role', 'authenticated')::text, true);
END $$;
SET LOCAL ROLE authenticated;
DO $$ BEGIN
  IF (SELECT count(id) FROM public.cta_experiment_events) <> 0 THEN
    RAISE EXCEPTION 'Ordinary user can read CTA events';
  END IF;
  RAISE NOTICE 'PASS: ordinary-user reads expose no events';
END $$;
RESET ROLE;

DO $$ BEGIN
  PERFORM set_config('request.jwt.claims', json_build_object('sub', current_setting('cta_test.admin'), 'role', 'authenticated')::text, true);
END $$;
SET LOCAL ROLE authenticated;
DO $$ DECLARE v_counts bigint[]; v_column text; BEGIN
  SELECT ARRAY[
    count(id) FILTER (WHERE variant = 'a' AND event = 'viewed'),
    count(id) FILTER (WHERE variant = 'a' AND event = 'opened'),
    count(id) FILTER (WHERE variant = 'a' AND event = 'submitted'),
    count(id) FILTER (WHERE variant = 'b' AND event = 'viewed'),
    count(id) FILTER (WHERE variant = 'b' AND event = 'opened'),
    count(id) FILTER (WHERE variant = 'b' AND event = 'submitted')
  ] INTO v_counts FROM public.cta_experiment_events
  WHERE experiment = current_setting('cta_test.experiment');
  IF v_counts <> ARRAY[2, 1, 0, 0, 0, 1]::bigint[] THEN
    RAISE EXCEPTION 'Admin CTA counts are inaccurate: %', v_counts;
  END IF;
  IF has_table_privilege(current_user, 'public.cta_experiment_events', 'INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER') THEN
    RAISE EXCEPTION 'Authenticated admin has unnecessary mutation privileges';
  END IF;
  IF has_sequence_privilege(current_user, 'public.cta_experiment_events_id_seq', 'USAGE, UPDATE') THEN
    RAISE EXCEPTION 'Authenticated admin can mutate the event sequence';
  END IF;
  FOREACH v_column IN ARRAY ARRAY['created_at', 'surface', 'placement', 'path', 'fingerprint'] LOOP
    IF has_column_privilege(current_user, 'public.cta_experiment_events', v_column, 'SELECT') THEN
      RAISE EXCEPTION 'Authenticated admin can read unnecessary metadata column: %', v_column;
    END IF;
  END LOOP;
  BEGIN
    PERFORM fingerprint FROM public.cta_experiment_events LIMIT 1;
    RAISE EXCEPTION 'Authenticated admin fingerprint read was allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    INSERT INTO public.cta_experiment_events (experiment, variant, event) VALUES ('denied', 'a', 'viewed');
    RAISE EXCEPTION 'Authenticated admin event insert was allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    UPDATE public.cta_experiment_events SET variant = 'denied' WHERE experiment = current_setting('cta_test.experiment');
    RAISE EXCEPTION 'Authenticated admin event update was allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    DELETE FROM public.cta_experiment_events WHERE experiment = current_setting('cta_test.experiment');
    RAISE EXCEPTION 'Authenticated admin event delete was allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  RAISE NOTICE 'PASS: exact admin totals, service-role ingestion, and admin mutation/metadata denials';
END $$;
RESET ROLE;
ROLLBACK;
