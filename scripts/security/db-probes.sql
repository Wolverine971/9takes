-- scripts/security/db-probes.sql
--
-- Database access-rule probes. Run through scripts/security/db-probes.sh, which
-- wraps this file in a transaction that is always rolled back.
--
-- Each probe switches to an API role (anon or authenticated, with the JWT
-- claims PostgREST would set), runs one statement, records what happened, and
-- undoes it. "attack" probes must have no effect; "legit" probes are the
-- statements the app itself issues and must keep working; "invariant" probes
-- assert catalog facts that are unsafe or impractical to exercise.
--
-- psql variable: phase (1 = rules that hold before the server-only RPC
-- migration, 2 = everything).

CREATE TEMP TABLE probe_results (
	seq serial PRIMARY KEY,
	phase integer NOT NULL,
	kind text NOT NULL,
	name text NOT NULL,
	outcome text NOT NULL,
	ok boolean NOT NULL,
	detail text
) ON COMMIT DROP;

CREATE FUNCTION pg_temp.probe(
	p_phase integer,
	p_kind text,
	p_name text,
	p_role text,
	p_uid uuid,
	p_setup text,
	p_sql text,
	p_verify text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
AS $fn$
DECLARE
	v_stage text := 'setup';
	v_rows bigint := 0;
	v_effective boolean;
	v_state text;
	v_message text;
	v_outcome text;
BEGIN
	BEGIN
		IF p_setup IS NOT NULL THEN
			-- Fixtures are written the way the server writes them (service role).
			PERFORM set_config('request.jwt.claims', '{"role": "service_role"}', true);
			PERFORM set_config('request.jwt.claim.role', 'service_role', true);
			PERFORM set_config('request.jwt.claim.sub', '', true);
			EXECUTE p_setup;
		END IF;

		v_stage := 'attempt';
		IF p_role IS NOT NULL THEN
			PERFORM set_config(
				'request.jwt.claims',
				CASE
					WHEN p_uid IS NULL THEN jsonb_build_object('role', p_role)::text
					ELSE jsonb_build_object(
						'sub', p_uid, 'role', p_role, 'email', 'probe@example.invalid'
					)::text
				END,
				true
			);
			PERFORM set_config('request.jwt.claim.sub', coalesce(p_uid::text, ''), true);
			PERFORM set_config('request.jwt.claim.role', p_role, true);
			EXECUTE format('SET LOCAL ROLE %I', p_role);
		END IF;

		EXECUTE p_sql;
		GET DIAGNOSTICS v_rows = ROW_COUNT;

		v_stage := 'verify';
		RESET ROLE;
		IF p_verify IS NOT NULL THEN
			EXECUTE p_verify INTO v_effective;
		ELSE
			v_effective := v_rows > 0;
		END IF;

		v_stage := 'done';
		RAISE EXCEPTION USING
			ERRCODE = 'P0999',
			MESSAGE = CASE WHEN coalesce(v_effective, false) THEN 'effective' ELSE 'no-effect' END;
	EXCEPTION WHEN OTHERS THEN
		GET STACKED DIAGNOSTICS v_state = RETURNED_SQLSTATE, v_message = MESSAGE_TEXT;
	END;

	-- Only a permission/RLS error or a constraint the rules rely on counts as a
	-- denial. Anything else (missing column, bad fixture) is a broken probe.
	v_outcome := CASE
		WHEN v_state = 'P0999' THEN v_message
		WHEN v_stage = 'attempt' AND v_state IN ('42501', '23505', '23514', '428C9') THEN 'denied'
		ELSE 'harness-error'
	END;

	INSERT INTO probe_results (phase, kind, name, outcome, ok, detail)
	VALUES (
		p_phase,
		p_kind,
		p_name,
		v_outcome,
		CASE p_kind
			WHEN 'legit' THEN v_outcome = 'effective'
			ELSE v_outcome IN ('denied', 'no-effect')
		END,
		CASE WHEN v_state = 'P0999' THEN 'rows=' || v_rows ELSE v_state || ': ' || left(v_message, 110) END
	);
END;
$fn$;

CREATE FUNCTION pg_temp.invariant(p_phase integer, p_name text, p_sql text) RETURNS void
LANGUAGE plpgsql
AS $fn$
DECLARE
	v_holds boolean;
BEGIN
	EXECUTE p_sql INTO v_holds;
	INSERT INTO probe_results (phase, kind, name, outcome, ok, detail)
	VALUES (
		p_phase, 'invariant', p_name,
		CASE WHEN coalesce(v_holds, false) THEN 'holds' ELSE 'violated' END,
		coalesce(v_holds, false), NULL
	);
END;
$fn$;

DO $probes$
DECLARE
	a uuid;  -- an ordinary account acting as the attacker
	v uuid;  -- a second ordinary account acting as the victim
	c bigint; -- a live take the attacker has not liked
	own_url constant text := 'zz-probe-own-' || substr(md5(random()::text), 1, 10);
	vic_url constant text := 'zz-probe-victim-' || substr(md5(random()::text), 1, 10);
	new_url constant text := 'zz-probe-new-' || substr(md5(random()::text), 1, 10);
	fixtures text;
BEGIN
	SELECT p.id INTO a
	FROM public.profiles p
	WHERE p.admin IS NOT TRUE AND p."canAskQuestion" IS TRUE
		AND NOT EXISTS (
			SELECT 1 FROM public.questions q
			WHERE q.author_id = p.id AND q.created_at > now() - interval '24 hours'
		)
	ORDER BY p.created_at DESC
	LIMIT 1;

	SELECT p.id INTO v
	FROM public.profiles p
	WHERE p.admin IS NOT TRUE AND p.id <> a
	ORDER BY p.created_at DESC
	LIMIT 1;

	SELECT cm.id INTO c
	FROM public.comments cm
	WHERE cm.removed IS NOT TRUE
		AND NOT EXISTS (
			SELECT 1 FROM public.comment_like l WHERE l.comment_id = cm.id AND l.user_id = a
		)
	ORDER BY cm.id DESC
	LIMIT 1;

	IF a IS NULL OR v IS NULL OR c IS NULL THEN
		RAISE EXCEPTION 'probe fixtures unavailable (attacker=%, victim=%, take=%)', a, v, c;
	END IF;

	-- One question owned by the attacker and one by the victim, created the way
	-- the server creates them. Rolled back with each probe.
	fixtures := format(
		'INSERT INTO public.questions (question, author_id, url) VALUES
			(''Probe question owned by attacker?'', %L, %L),
			(''Probe question owned by victim?'', %L, %L)',
		a, own_url, v, vic_url
	);

	------------------------------------------------------------------------
	-- Questions
	------------------------------------------------------------------------
	PERFORM pg_temp.probe(1, 'legit', 'ask a question (the form''s exact columns)', 'authenticated', a, NULL,
		format('INSERT INTO public.questions (question, author_id, context, data, url, img_url)
			VALUES (''Probe: does asking still work?'', %L, ''some context'', ''{"userProvidedContext": true}'', %L, NULL)', a, new_url),
		format('SELECT EXISTS (SELECT 1 FROM public.questions WHERE url = %L AND data = ''{"userProvidedContext": true}'')', new_url));

	PERFORM pg_temp.probe(1, 'attack', 'insert a question with curation/moderation/backdating fields', 'authenticated', a, NULL,
		format('INSERT INTO public.questions (question, author_id, url, starter_rank, pinned_comment_ids, comment_count, created_at, name, data, tagged, img_url, question_formatted)
			VALUES (''Probe: privileged columns'', %L, %L, 1, ''{1,2}'', 999, ''2001-01-01'', ''x/y/z'', ''{"editorial_status":"approved"}'', true, ''images/elsewhere/x.png'', ''rewritten'')', a, new_url),
		format('SELECT EXISTS (SELECT 1 FROM public.questions WHERE url = %L AND (
				starter_rank IS NOT NULL OR pinned_comment_ids <> ''{}'' OR comment_count <> 0
				OR created_at < now() - interval ''1 day'' OR name IS NOT NULL OR data IS NOT NULL
				OR tagged OR img_url IS NOT NULL OR question_formatted IS NOT NULL))', new_url));

	PERFORM pg_temp.probe(1, 'attack', 'insert a question with a chosen id', 'authenticated', a, NULL,
		format('INSERT INTO public.questions (id, question, author_id, url) VALUES (2000000002, ''Probe: explicit id'', %L, %L)', a, new_url),
		'SELECT EXISTS (SELECT 1 FROM public.questions WHERE id = 2000000002)');

	PERFORM pg_temp.probe(1, 'attack', 'insert a question that reuses another question''s address', 'authenticated', a, fixtures,
		format('INSERT INTO public.questions (question, author_id, url) VALUES (''Probe: duplicate slug'', %L, %L)', a, vic_url));

	PERFORM pg_temp.probe(1, 'attack', 'insert a question as another author', 'authenticated', a, NULL,
		format('INSERT INTO public.questions (question, author_id, url) VALUES (''Probe: forged author'', %L, %L)', v, new_url));

	PERFORM pg_temp.probe(1, 'attack', 'insert a question with a non-slug address', 'authenticated', a, NULL,
		format('INSERT INTO public.questions (question, author_id, url) VALUES (''Probe: bad slug'', %L, ''Bad/Slug x'')', a));

	PERFORM pg_temp.probe(1, 'attack', 'insert an over-long question', 'authenticated', a, NULL,
		format('INSERT INTO public.questions (question, author_id, url) VALUES (repeat(''x'', 5000), %L, %L)', a, new_url));

	PERFORM pg_temp.probe(1, 'attack', 'insert an 11th question inside 24 hours', 'authenticated', a,
		format('INSERT INTO public.questions (question, author_id, url)
			SELECT ''Probe filler '' || g, %L, %L || ''-'' || g FROM generate_series(1, 10) g', a, own_url),
		format('INSERT INTO public.questions (question, author_id, url) VALUES (''Probe: over the limit'', %L, %L)', a, new_url));

	PERFORM pg_temp.probe(1, 'attack', 'insert a question as an anonymous visitor', 'anon', NULL, NULL,
		format('INSERT INTO public.questions (question, url) VALUES (''Probe: anon'', %L)', new_url));

	PERFORM pg_temp.probe(1, 'legit', 'author sets own question image', 'authenticated', a, fixtures,
		format('UPDATE public.questions SET img_url = %L WHERE url = %L', 'images/' || own_url || '/probe.png', own_url));

	PERFORM pg_temp.probe(1, 'legit', 'author saves own question tags', 'authenticated', a, fixtures,
		format('UPDATE public.questions SET tagged = true, flagged = false, updated_at = now() WHERE url = %L', own_url));

	PERFORM pg_temp.probe(1, 'attack', 'author rewrites own question text', 'authenticated', a, fixtures,
		format('UPDATE public.questions SET question = ''Rewritten after answers'' WHERE url = %L', own_url));

	PERFORM pg_temp.probe(1, 'attack', 'author promotes own question to a starter', 'authenticated', a, fixtures,
		format('UPDATE public.questions SET starter_rank = 1 WHERE url = %L', own_url));

	PERFORM pg_temp.probe(1, 'attack', 'author pins takes on own question', 'authenticated', a, fixtures,
		format('UPDATE public.questions SET pinned_comment_ids = ''{1}'' WHERE url = %L', own_url));

	PERFORM pg_temp.probe(1, 'attack', 'author changes own question''s address', 'authenticated', a, fixtures,
		format('UPDATE public.questions SET url = %L WHERE url = %L', new_url, own_url));

	PERFORM pg_temp.probe(1, 'attack', 'author sets the internal name field', 'authenticated', a, fixtures,
		format('UPDATE public.questions SET name = %L WHERE url = %L', 'x/' || own_url || '/y', own_url));

	PERFORM pg_temp.probe(1, 'attack', 'author backdates own question', 'authenticated', a, fixtures,
		format('UPDATE public.questions SET created_at = ''2001-01-01'' WHERE url = %L', own_url));

	PERFORM pg_temp.probe(1, 'attack', 'author edits editorial metadata', 'authenticated', a, fixtures,
		format('UPDATE public.questions SET data = ''{"editorial_status":"approved"}'' WHERE url = %L', own_url));

	PERFORM pg_temp.probe(1, 'attack', 'author writes the search index directly', 'authenticated', a, fixtures,
		format('UPDATE public.questions SET search_vector = to_tsvector(''simple'', ''stuffed keywords'') WHERE url = %L', own_url));

	PERFORM pg_temp.probe(1, 'attack', 'author points own image at another question''s folder', 'authenticated', a, fixtures,
		format('UPDATE public.questions SET img_url = %L WHERE url = %L', 'images/' || vic_url || '/probe.png', own_url));

	PERFORM pg_temp.probe(1, 'attack', 'update someone else''s question', 'authenticated', a, fixtures,
		format('UPDATE public.questions SET img_url = NULL, tagged = true WHERE url = %L', vic_url));

	PERFORM pg_temp.probe(1, 'attack', 'delete someone else''s question', 'authenticated', a, fixtures,
		format('DELETE FROM public.questions WHERE url = %L', vic_url));

	PERFORM pg_temp.probe(1, 'attack', 'author deletes own question that has takes',  'authenticated', a,
		fixtures || format('; UPDATE public.questions SET comment_count = 3 WHERE url = %L', own_url),
		format('DELETE FROM public.questions WHERE url = %L', own_url));

	------------------------------------------------------------------------
	-- Question images in storage
	------------------------------------------------------------------------
	PERFORM pg_temp.probe(1, 'legit', 'author uploads an image into own question folder', 'authenticated', a, fixtures,
		format('INSERT INTO storage.objects (bucket_id, name, owner) VALUES (''questions'', %L, %L)', 'images/' || own_url || '/probe.png', a));

	PERFORM pg_temp.probe(1, 'attack', 'upload an image into another question''s folder', 'authenticated', a,
		fixtures || format('; UPDATE public.questions SET name = %L WHERE url = %L', 'x/' || own_url || '/y', own_url),
		format('INSERT INTO storage.objects (bucket_id, name, owner) VALUES (''questions'', %L, %L)', 'images/' || vic_url || '/probe.png', a));

	PERFORM pg_temp.probe(1, 'attack', 'overwrite an existing image of another question', 'authenticated', a,
		fixtures || format('; UPDATE public.questions SET name = %L WHERE url = %L', 'x/' || own_url || '/y', own_url)
			|| format('; INSERT INTO storage.objects (bucket_id, name) VALUES (''questions'', %L)', 'images/' || vic_url || '/card.png'),
		format('UPDATE storage.objects SET metadata = ''{"probe": true}'' WHERE bucket_id = ''questions'' AND name = %L', 'images/' || vic_url || '/card.png'));

	PERFORM pg_temp.probe(1, 'attack', 'anonymous upload to the questions bucket', 'anon', NULL, fixtures,
		format('INSERT INTO storage.objects (bucket_id, name) VALUES (''questions'', %L)', 'images/' || own_url || '/probe.png'));

	------------------------------------------------------------------------
	-- Profiles
	------------------------------------------------------------------------
	PERFORM pg_temp.probe(1, 'legit', 'edit own display name', 'authenticated', a, NULL,
		format('UPDATE public.profiles SET first_name = ''Probe'' WHERE id = %L', a));

	PERFORM pg_temp.probe(1, 'attack', 'grant self admin', 'authenticated', a, NULL,
		format('UPDATE public.profiles SET admin = true WHERE id = %L', a));

	PERFORM pg_temp.probe(1, 'attack', 'change own stored email', 'authenticated', a, NULL,
		format('UPDATE public.profiles SET email = ''spoof@example.invalid'' WHERE id = %L', a));

	PERFORM pg_temp.probe(1, 'attack', 'take another account''s public id', 'authenticated', a, NULL,
		format('UPDATE public.profiles SET external_id = (SELECT external_id FROM public.public_profiles WHERE id = %L) WHERE id = %L', v, a));

	PERFORM pg_temp.probe(1, 'attack', 'delete own profile (to recreate it with chosen fields)', 'authenticated', a, NULL,
		format('DELETE FROM public.profiles WHERE id = %L', a));

	PERFORM pg_temp.probe(1, 'attack', 'edit another account''s profile', 'authenticated', a, NULL,
		format('UPDATE public.profiles SET first_name = ''Probe'' WHERE id = %L', v));

	PERFORM pg_temp.probe(1, 'attack', 'read another account''s email', 'authenticated', a, NULL,
		format('SELECT email FROM public.profiles WHERE id = %L', v));

	PERFORM pg_temp.probe(1, 'attack', 'anonymous read of profiles', 'anon', NULL, NULL,
		'SELECT id FROM public.profiles LIMIT 1');

	PERFORM pg_temp.invariant(1, 'no client role may insert a profile row',
		'SELECT NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = ''public'' AND tablename = ''profiles'' AND cmd IN (''INSERT'', ''ALL''))');

	PERFORM pg_temp.invariant(1, 'public profile ids are unique',
		'SELECT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = ''public'' AND tablename = ''profiles'' AND indexdef ILIKE ''%UNIQUE%(external_id)%'')');

	------------------------------------------------------------------------
	-- Likes
	------------------------------------------------------------------------
	PERFORM pg_temp.probe(1, 'legit', 'like a take once', 'authenticated', a, NULL,
		format('INSERT INTO public.comment_like (comment_id, user_id) VALUES (%s, %L)', c, a));

	PERFORM pg_temp.probe(1, 'attack', 'like the same take twice', 'authenticated', a, NULL,
		format('INSERT INTO public.comment_like (comment_id, user_id) VALUES (%s, %L), (%s, %L)', c, a, c, a));

	PERFORM pg_temp.probe(1, 'attack', 'like a take as another account', 'authenticated', a, NULL,
		format('INSERT INTO public.comment_like (comment_id, user_id) VALUES (%s, %L)', c, v));

	------------------------------------------------------------------------
	-- Takes and give-first
	------------------------------------------------------------------------
	PERFORM pg_temp.probe(1, 'attack', 'anonymous read of take text', 'anon', NULL, NULL,
		'SELECT comment FROM public.comments LIMIT 1');

	PERFORM pg_temp.probe(1, 'attack', 'signed-in read of take text', 'authenticated', a, NULL,
		'SELECT comment FROM public.comments LIMIT 1');

	PERFORM pg_temp.probe(1, 'attack', 'read commenter ip / fingerprint', 'authenticated', a, NULL,
		'SELECT ip, fingerprint FROM public.comments LIMIT 1');

	PERFORM pg_temp.probe(1, 'attack', 'insert a take directly, skipping the server', 'authenticated', a, NULL,
		format('INSERT INTO public.comments (comment, parent_id, parent_type, author_id) VALUES (''Probe take'', 1, ''question'', %L)', a));

	PERFORM pg_temp.probe(1, 'attack', 'edit another person''s take', 'authenticated', a, NULL,
		format('UPDATE public.comments SET modified_at = now() WHERE id = (SELECT id FROM public.comments WHERE author_id IS DISTINCT FROM %L ORDER BY id DESC LIMIT 1)', a));

	PERFORM pg_temp.probe(1, 'attack', 'reply-notification opt-in reveals a suppressed address', 'anon', NULL,
		'INSERT INTO public.email_unsubscribes (email) VALUES (''probe-suppressed@example.invalid'')',
		'SELECT 1 WHERE public.create_comment_reply_subscription(-1, -1, ''probe-fingerprint'', ''probe-suppressed@example.invalid'') ->> ''status'' = ''suppressed''');

	------------------------------------------------------------------------
	-- Admin-only and server-only data
	------------------------------------------------------------------------
	PERFORM pg_temp.probe(1, 'attack', 'read coaching clients', 'authenticated', a, NULL,
		'SELECT id FROM public.consulting_clients LIMIT 1');
	PERFORM pg_temp.probe(1, 'attack', 'read coaching intake forms', 'anon', NULL, NULL,
		'SELECT id FROM public.consulting_intake_forms LIMIT 1');
	PERFORM pg_temp.probe(1, 'attack', 'read the signup list', 'authenticated', a, NULL,
		'SELECT email FROM public.signups LIMIT 1');
	PERFORM pg_temp.probe(1, 'attack', 'read email sends', 'authenticated', a, NULL,
		'SELECT id FROM public.email_sends LIMIT 1');
	PERFORM pg_temp.probe(1, 'attack', 'read test results', 'anon', NULL, NULL,
		'SELECT id FROM public.enneagram_test_results LIMIT 1');
	PERFORM pg_temp.probe(1, 'attack', 'read visitor records', 'authenticated', a, NULL,
		'SELECT id FROM public.visitors LIMIT 1');
	PERFORM pg_temp.probe(1, 'attack', 'change a site setting', 'authenticated', a, NULL,
		'UPDATE public.admin_settings SET value = value');
	PERFORM pg_temp.probe(1, 'attack', 'edit a published profile page', 'authenticated', a, NULL,
		'UPDATE public.blogs_famous_people SET title = title WHERE id = (SELECT id FROM public.blogs_famous_people LIMIT 1)');

	------------------------------------------------------------------------
	-- Catalog invariants
	------------------------------------------------------------------------
	PERFORM pg_temp.invariant(1, 'every public table has row-level security on',
		'SELECT NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = ''public'' AND c.relkind = ''r'' AND NOT c.relrowsecurity)');

	PERFORM pg_temp.invariant(1, 'anonymous role holds no write privilege on any public table',
		'SELECT NOT EXISTS (SELECT 1 FROM information_schema.role_table_grants WHERE table_schema = ''public'' AND grantee = ''anon'' AND privilege_type IN (''INSERT'', ''UPDATE'', ''DELETE'', ''TRUNCATE'', ''TRIGGER'', ''REFERENCES''))');

	PERFORM pg_temp.invariant(1, 'signed-in role cannot truncate or attach triggers',
		'SELECT NOT EXISTS (SELECT 1 FROM information_schema.role_table_grants WHERE table_schema = ''public'' AND grantee = ''authenticated'' AND privilege_type IN (''TRUNCATE'', ''TRIGGER'', ''REFERENCES''))');

	PERFORM pg_temp.invariant(1, 'question addresses are unique',
		'SELECT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = ''public'' AND tablename = ''questions'' AND indexdef ILIKE ''%UNIQUE%(url)%'')');

	PERFORM pg_temp.invariant(1, 'the extension-reinstall helper is gone',
		'SELECT NOT EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = ''public'' AND p.proname = ''install_available_extensions_and_test'')');

	PERFORM pg_temp.invariant(1, 'every definer function in public pins its search_path',
		'SELECT NOT EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = ''public'' AND p.prosecdef AND NOT EXISTS (SELECT 1 FROM unnest(coalesce(p.proconfig, ''{}'')) cfg WHERE cfg LIKE ''search_path=%''))');

	PERFORM pg_temp.invariant(1, 'admin and bulk-export functions are not callable by client roles',
		'SELECT NOT EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = ''public'' AND p.proname IN (''get_all_users'', ''get_user_question_comments2'', ''set_admin_status_safely'', ''create_comment_atomic'', ''consume_api_rate_limit'', ''record_visitor_first_touch'') AND (has_function_privilege(''anon'', p.oid, ''EXECUTE'') OR (has_function_privilege(''authenticated'', p.oid, ''EXECUTE'') AND p.proname NOT IN (''set_admin_status_safely''))))');

	PERFORM pg_temp.invariant(1, 'the rate-limit ledger is pruned on a schedule',
		'SELECT EXISTS (SELECT 1 FROM cron.job WHERE command ILIKE ''%prune_api_rate_limit_events%'' AND active)');

	PERFORM pg_temp.invariant(2, 'analytics and take rate-limit functions are server-only',
		'SELECT NOT EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = ''public'' AND p.proname IN (''upsert_page_analytics_visit'', ''record_page_analytics_ping'', ''check_comment_rate_limit'') AND (has_function_privilege(''anon'', p.oid, ''EXECUTE'') OR has_function_privilege(''authenticated'', p.oid, ''EXECUTE'')))');
END
$probes$;

\pset footer off
\echo
\echo '== Probes that did not hold =='
SELECT kind, name, outcome, detail
FROM probe_results
WHERE NOT ok AND phase <= :phase
ORDER BY seq;

\echo '== Summary =='
SELECT
	count(*) FILTER (WHERE phase <= :phase) AS probes_run,
	count(*) FILTER (WHERE ok AND phase <= :phase) AS held,
	count(*) FILTER (WHERE NOT ok AND phase <= :phase) AS failed,
	count(*) FILTER (WHERE phase > :phase) AS skipped_later_phase
FROM probe_results;

SELECT (count(*) FILTER (WHERE NOT ok AND phase <= :phase) > 0) AS probe_failed FROM probe_results \gset
\if :{?verbose}
\echo '== All probes =='
SELECT seq, phase, kind, name, outcome, detail FROM probe_results ORDER BY seq;
\endif
