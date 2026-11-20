-- supabase/migrations/20261120190000_client_write_guards.sql
--
-- Phase 1 of 2. Safe to apply while the currently deployed app is running:
-- every statement here either matches what the app already does or removes
-- access the app never uses. Phase 2 (20261120193000) must wait for the deploy.
--
-- Apply as one transaction (psql -1 -f <file>). Verified with
-- scripts/security/db-probes.sh, which replays this file plus the probe suite
-- inside a transaction that is rolled back.

-- ---------------------------------------------------------------------------
-- 1. Question images: the object path decides which question it belongs to.
--    The object name must be qualified; inside the subquery a bare `name`
--    resolves to public.questions.name.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS question_owner_upload ON storage.objects;
DROP POLICY IF EXISTS question_owner_replace ON storage.objects;

CREATE POLICY question_owner_upload ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
	bucket_id = 'questions'
	AND (storage.foldername(objects.name))[1] = 'images'
	AND EXISTS (
		SELECT 1
		FROM public.questions q
		WHERE q.url = (storage.foldername(objects.name))[2]
			AND (q.author_id = (SELECT auth.uid()) OR (SELECT public.is_admin()))
	)
);

CREATE POLICY question_owner_replace ON storage.objects
FOR UPDATE TO authenticated
USING (
	bucket_id = 'questions'
	AND (storage.foldername(objects.name))[1] = 'images'
	AND EXISTS (
		SELECT 1
		FROM public.questions q
		WHERE q.url = (storage.foldername(objects.name))[2]
			AND (q.author_id = (SELECT auth.uid()) OR (SELECT public.is_admin()))
	)
)
WITH CHECK (
	bucket_id = 'questions'
	AND (storage.foldername(objects.name))[1] = 'images'
	AND EXISTS (
		SELECT 1
		FROM public.questions q
		WHERE q.url = (storage.foldername(objects.name))[2]
			AND (q.author_id = (SELECT auth.uid()) OR (SELECT public.is_admin()))
	)
);

-- ---------------------------------------------------------------------------
-- 2. Questions: one slug per question, and the row-level policies now live in
--    version control (they previously existed only in the database).
-- ---------------------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS questions_url_key ON public.questions (url);

DROP POLICY IF EXISTS "Only existing users can insert questions" ON public.questions;
DROP POLICY IF EXISTS "Authors can update their own questions, admins can update any" ON public.questions;
DROP POLICY IF EXISTS "Authors can delete their own questions, admins can delete any" ON public.questions;
DROP POLICY IF EXISTS questions_author_insert ON public.questions;
DROP POLICY IF EXISTS questions_author_update ON public.questions;
DROP POLICY IF EXISTS questions_author_delete ON public.questions;

CREATE POLICY questions_author_insert ON public.questions
FOR INSERT TO authenticated
WITH CHECK (
	author_id = (SELECT auth.uid())
	AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (SELECT auth.uid()))
);

CREATE POLICY questions_author_update ON public.questions
FOR UPDATE TO authenticated
USING (author_id = (SELECT auth.uid()) OR (SELECT public.is_admin()))
WITH CHECK (author_id = (SELECT auth.uid()) OR (SELECT public.is_admin()));

-- An author may withdraw a question only while nobody has answered it.
CREATE POLICY questions_author_delete ON public.questions
FOR DELETE TO authenticated
USING (
	(author_id = (SELECT auth.uid()) AND comment_count = 0)
	OR (SELECT public.is_admin())
);

-- Client roles may set only what the ask-a-question form sets. Everything
-- else (curation, counters, moderation, timestamps, ids) is server-owned.
-- SECURITY INVOKER on purpose: service-role writes and trusted definer
-- functions run as their owner and skip these checks.
CREATE OR REPLACE FUNCTION public.protect_question_moderation()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
DECLARE
	v_can_ask boolean;
	v_recent integer;
	v_client_columns constant text[] := ARRAY['img_url', 'tagged', 'updated_at', 'search_vector'];
BEGIN
	IF current_user NOT IN ('anon', 'authenticated') OR public.is_admin() THEN
		RETURN NEW;
	END IF;

	IF TG_OP = 'INSERT' THEN
		IF NEW.question IS NULL OR char_length(btrim(NEW.question)) NOT BETWEEN 1 AND 280 THEN
			RAISE EXCEPTION 'Question must be between 1 and 280 characters' USING ERRCODE = '23514';
		END IF;
		IF NEW.context IS NOT NULL AND char_length(NEW.context) > 2000 THEN
			RAISE EXCEPTION 'Question context is too long' USING ERRCODE = '23514';
		END IF;
		IF NEW.url IS NULL OR NEW.url !~ '^[a-z0-9-]{1,100}$' THEN
			RAISE EXCEPTION 'Question url is not a valid slug' USING ERRCODE = '23514';
		END IF;

		SELECT p."canAskQuestion" INTO v_can_ask FROM public.profiles p WHERE p.id = auth.uid();
		IF v_can_ask IS NOT TRUE THEN
			RAISE EXCEPTION 'This account cannot ask questions' USING ERRCODE = '42501';
		END IF;

		SELECT count(*) INTO v_recent
		FROM public.questions q
		WHERE q.author_id = auth.uid()
			AND q.created_at > now() - interval '24 hours';
		IF v_recent >= 10 THEN
			RAISE EXCEPTION 'Daily question limit reached' USING ERRCODE = '42501';
		END IF;

		NEW.id := nextval(pg_get_serial_sequence('public.questions', 'id')::regclass);
		NEW.created_at := now();
		NEW.updated_at := now();
		NEW.data := CASE
			WHEN NEW.data @> '{"userProvidedContext": true}'::jsonb
				THEN '{"userProvidedContext": true}'::jsonb
			ELSE NULL
		END;
		NEW.name := NULL;
		NEW.img_url := NULL;
		NEW.es_id := NULL;
		NEW.comment_count := 0;
		NEW.tagged := false;
		NEW.flagged := false;
		NEW.removed := false;
		NEW.question_formatted := NULL;
		NEW.last_comment_date := NULL;
		NEW.search_vector := NULL;
		NEW.starter_rank := NULL;
		NEW.pinned_comment_ids := '{}'::bigint[];
		RETURN NEW;
	END IF;

	IF (to_jsonb(NEW) - v_client_columns) IS DISTINCT FROM (to_jsonb(OLD) - v_client_columns) THEN
		RAISE EXCEPTION 'Only the question image and tag status may be changed' USING ERRCODE = '42501';
	END IF;

	-- The search index is refreshed by the table's own AFTER trigger, never directly.
	IF NEW.search_vector IS DISTINCT FROM OLD.search_vector AND pg_trigger_depth() < 2 THEN
		RAISE EXCEPTION 'The search index is maintained by the database' USING ERRCODE = '42501';
	END IF;

	IF NEW.img_url IS DISTINCT FROM OLD.img_url
		AND NEW.img_url IS NOT NULL
		AND (
			NOT starts_with(NEW.img_url, 'images/' || NEW.url || '/')
			OR position('..' IN NEW.img_url) > 0
		) THEN
		RAISE EXCEPTION 'Question image must live in the question''s own folder' USING ERRCODE = '42501';
	END IF;

	RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION public.protect_question_moderation() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS protect_question_moderation ON public.questions;
CREATE TRIGGER protect_question_moderation
BEFORE INSERT OR UPDATE ON public.questions
FOR EACH ROW EXECUTE FUNCTION public.protect_question_moderation();

DO $$
BEGIN
	EXECUTE format(
		'GRANT USAGE ON SEQUENCE %s TO authenticated',
		pg_get_serial_sequence('public.questions', 'id')
	);
END
$$;

-- ---------------------------------------------------------------------------
-- 3. Profiles are created by the auth trigger (handle_new_user) and removed by
--    admins. Clients edit display fields only.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile, admins can delete any" ON public.profiles;
DROP POLICY IF EXISTS profiles_admin_delete ON public.profiles;

CREATE POLICY profiles_admin_delete ON public.profiles
FOR DELETE TO authenticated
USING ((SELECT public.is_admin()));

CREATE UNIQUE INDEX IF NOT EXISTS profiles_external_id_key ON public.profiles (external_id);

-- ---------------------------------------------------------------------------
-- 4. One like per person per take.
-- ---------------------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS comment_like_user_comment_key
	ON public.comment_like (user_id, comment_id);
CREATE UNIQUE INDEX IF NOT EXISTS comment_like_demo_user_comment_key
	ON public.comment_like_demo (user_id, comment_id);

-- ---------------------------------------------------------------------------
-- 5. Reply-notification opt-in: decide eligibility before consulting the
--    suppression list, so the answer never depends on an address the caller
--    has not proven a relationship with.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_comment_reply_subscription(
	p_comment_id integer,
	p_question_id integer,
	p_fingerprint text,
	p_email text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_email TEXT := public.normalize_email_text(p_email);
  v_fingerprint TEXT := NULLIF(BTRIM(p_fingerprint), '');
  v_subscription_id BIGINT;
BEGIN
  IF v_email IS NULL OR v_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' THEN
    RETURN jsonb_build_object('status', 'invalid');
  END IF;

  IF v_fingerprint IS NULL OR LENGTH(v_fingerprint) > 100 THEN
    RETURN jsonb_build_object('status', 'ineligible');
  END IF;

  -- Serialize opt-in attempts for one anonymous actor. This closes the small
  -- race between the eligibility/existing checks and the insert, making a
  -- rapid duplicate submit idempotent without exposing a database error.
  PERFORM pg_advisory_xact_lock(hashtext('comment-reply-opt-in:' || v_fingerprint));

  -- Bind consent to the exact anonymous top-level comment just created. The
  -- actor must still have exactly one comment, preventing forged/replayed
  -- requests from turning later contributions into first-comment consent.
  IF NOT EXISTS (
    SELECT 1
    FROM public.comments comment
    WHERE comment.id = p_comment_id
      AND comment.parent_type = 'question'
      AND comment.parent_id = p_question_id
      AND comment.author_id IS NULL
      AND comment.fingerprint = v_fingerprint
      AND comment.removed IS NOT TRUE
  ) OR EXISTS (
    SELECT 1
    FROM public.comments prior_comment
    WHERE prior_comment.fingerprint = v_fingerprint
      AND prior_comment.id <> p_comment_id
  ) THEN
    RETURN jsonb_build_object('status', 'ineligible');
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.email_unsubscribes unsubscribe
    WHERE public.normalize_email_text(unsubscribe.email) = v_email
  ) OR EXISTS (
    SELECT 1
    FROM public.signups signup
    WHERE signup.unsubscribed_date IS NOT NULL
      AND public.normalize_email_text(signup.email) = v_email
  ) THEN
    RETURN jsonb_build_object('status', 'suppressed');
  END IF;

  SELECT subscription.id
  INTO v_subscription_id
  FROM public.comment_reply_subscriptions subscription
  WHERE subscription.unsubscribed_at IS NULL
    AND (
      subscription.comment_id = p_comment_id
      OR subscription.fingerprint = v_fingerprint
    )
  ORDER BY subscription.created_at ASC
  LIMIT 1;

  IF v_subscription_id IS NOT NULL THEN
    RETURN jsonb_build_object('status', 'already_subscribed');
  END IF;

  INSERT INTO public.comment_reply_subscriptions (
    comment_id,
    question_id,
    fingerprint,
    normalized_email,
    consent_source
  ) VALUES (
    p_comment_id,
    p_question_id,
    v_fingerprint,
    v_email,
    'question_post_comment_inline'
  );

  RETURN jsonb_build_object('status', 'subscribed');
END;
$function$;

-- ---------------------------------------------------------------------------
-- 6. Functions no browser needs.
-- ---------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.install_available_extensions_and_test();

DO $$
DECLARE
	r record;
BEGIN
	FOR r IN
		SELECT p.oid::regprocedure AS signature
		FROM pg_proc p
		JOIN pg_namespace n ON n.oid = p.pronamespace
		WHERE n.nspname = 'public' AND p.proname = 'record_visitor_first_touch'
	LOOP
		EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.signature);
		EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', r.signature);
	END LOOP;
END
$$;

-- Definer functions resolve temp objects last.
DO $$
DECLARE
	r record;
BEGIN
	FOR r IN
		SELECT p.oid::regprocedure AS signature
		FROM pg_proc p
		JOIN pg_namespace n ON n.oid = p.pronamespace
		WHERE n.nspname = 'public'
			AND p.prosecdef
			AND p.proconfig @> ARRAY['search_path=public']
	LOOP
		EXECUTE format('ALTER FUNCTION %s SET search_path = public, pg_temp', r.signature);
	END LOOP;
END
$$;

-- ---------------------------------------------------------------------------
-- 7. Table privileges: row-level security stays the gate, but anonymous
--    visitors no longer hold write privileges for it to fall back on, and no
--    API role can truncate or attach triggers.
-- ---------------------------------------------------------------------------
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
	ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE TRUNCATE, REFERENCES, TRIGGER
	ON ALL TABLES IN SCHEMA public FROM authenticated;

-- ---------------------------------------------------------------------------
-- 8. Keep the rate-limit ledger small.
-- ---------------------------------------------------------------------------
SELECT cron.schedule(
	'9takes-api-rate-limit-prune',
	'47 * * * *',
	'SELECT public.prune_api_rate_limit_events();'
);
