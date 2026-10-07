-- supabase/migrations/20261007150000_give_first_read_lockdown.sql
--
-- Give-first wall, database half.
--
-- Before this migration, anyone holding the public publishable/anon key (or any
-- free account) could read every take straight from PostgREST without
-- answering: anon + authenticated had column-level SELECT on comments.comment,
-- comments_demo.comment and blog_comments.comment, links was world-readable,
-- and get_user_question_comments2 (SECURITY INVOKER, EXECUTE granted to PUBLIC)
-- returned any user's takes.
--
-- After it, take text is readable only by the service role. Every server read
-- of take text goes through getSupabaseAdminClient() behind the app's own
-- give-first gate (questions/[slug] load, GET /comments, /links, /account,
-- /users/[externalId], admin pages, personality discussion API).
--
-- SHIP ORDER (do not reverse):
--   1. Deploy the app code that moved those reads to the service-role client.
--   2. Then apply this migration.
-- Applying it before the deploy breaks the post-answer reveal, replies,
-- /account "your takes", profiles and the admin comment pages until the
-- deploy lands.
--
-- Rollback (restores the old exposure, so only if something unforeseen breaks):
--   GRANT SELECT (comment) ON public.comments, public.comments_demo, public.blog_comments TO anon, authenticated;
--   GRANT SELECT ON public.links TO anon, authenticated;
--   CREATE POLICY audit_public_read ON public.links FOR SELECT TO anon, authenticated USING (true);
--   GRANT EXECUTE ON FUNCTION public.get_user_question_comments2(uuid) TO anon, authenticated;

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Take text. The other granted columns (id, author_id, parent_id,
--    parent_type, counts, timestamps, removed) stay readable: the gate RPCs,
--    comment counts, likes, and the user-scoped UPDATE/DELETE policies use them.
--    These are column-level grants (20260903230508_security_rls_storage_rpc.sql
--    revoked table-level SELECT and re-granted per column), so revoke the column.
-- ---------------------------------------------------------------------------
REVOKE SELECT (comment) ON public.comments FROM PUBLIC, anon, authenticated;
REVOKE SELECT (comment) ON public.comments_demo FROM PUBLIC, anon, authenticated;
REVOKE SELECT (comment) ON public.blog_comments FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. links: URLs + OG metadata extracted from takes. Granted table-level, so
--    revoke table-level (this also drops the implied column privileges).
--    Both readers (/links and the question page) and increment_clicks now use
--    the service role. Drop the public read policy too, so a stray future
--    GRANT cannot silently re-open it.
-- ---------------------------------------------------------------------------
REVOKE SELECT ON public.links FROM PUBLIC, anon, authenticated;
DROP POLICY IF EXISTS audit_public_read ON public.links;

-- ---------------------------------------------------------------------------
-- 3. SECURITY INVOKER stats RPCs used count(c.comment), which needs SELECT on
--    the comment column and would start failing for the admin session client.
--    comments.comment has no NULL rows (checked 2026-10-07: 0 of 382), so
--    count(c.id) returns the same numbers. Bodies otherwise copied verbatim
--    from pg_get_functiondef on 2026-10-07.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.daily_questions_stats()
 RETURNS TABLE(question text, id bigint, url text, created_at timestamp with time zone, number_of_comments bigint, number_of_comments_today bigint, number_modified bigint, user_external_id uuid, user_email text)
 LANGUAGE plpgsql
 SET search_path TO 'pg_catalog', 'public', 'extensions', 'pg_temp'
AS $function$
BEGIN
    RETURN QUERY
      select q.question
      , q.id
      , q.url,
      q.created_at
      , count(c.id) as number_of_comments
      , count(*) FILTER (WHERE c.created_at::date = CURRENT_DATE) AS number_of_comments_today
      , count(c.modified_at) as number_modified
      , p.external_id as user_external_id
      , p.email as user_email

      from public.questions q
      left join comments c on c.parent_id = q.id
      left join profiles p on p.id = q.author_id

      where c.parent_type = 'question'
      -- AND c.created_at::date = CURRENT_DATE

      group by q.question, q.id, q.url, q.created_at,  user_external_id, user_email
      order by number_of_comments_today desc, number_of_comments desc

    limit 60;

END;
$function$;

CREATE OR REPLACE FUNCTION public.comments_last_30_days()
 RETURNS TABLE(days timestamp with time zone, number_of_comments bigint, number_modified bigint)
 LANGUAGE plpgsql
 SET search_path TO 'pg_catalog', 'public', 'extensions', 'pg_temp'
AS $function$
BEGIN
    RETURN QUERY
      select date_trunc('days', c.created_at) as days
      , count(c.id) as number_of_comments
      , count(c.modified_at) as number_modified

      from public.comments c

      group by date_trunc('days', c.created_at)
      order by days desc

    limit 60;

END;
$function$;

-- ---------------------------------------------------------------------------
-- 4. Take-history RPCs.
--    get_user_question_comments2: returns any user's takes by author id. Its
--    ACL includes PUBLIC (=X/postgres), so PUBLIC must be revoked as well or
--    anon keeps EXECUTE through it. service_role keeps its explicit grant.
--    /users/[externalId] now reads through the service role instead.
--    get_user_question_comments (v1): dead; it selects ip/fingerprint, which
--    anon/authenticated cannot read, so every call already fails.
-- ---------------------------------------------------------------------------
REVOKE EXECUTE ON FUNCTION public.get_user_question_comments2(uuid) FROM PUBLIC, anon, authenticated;
DROP FUNCTION IF EXISTS public.get_user_question_comments(uuid);

COMMIT;

-- Post-apply checks (read-only; expected values in comments):
--   SELECT has_column_privilege('anon', 'public.comments', 'comment', 'SELECT');          -- f
--   SELECT has_column_privilege('authenticated', 'public.comments', 'comment', 'SELECT'); -- f
--   SELECT has_column_privilege('anon', 'public.comments_demo', 'comment', 'SELECT');     -- f
--   SELECT has_column_privilege('anon', 'public.blog_comments', 'comment', 'SELECT');     -- f
--   SELECT has_column_privilege('anon', 'public.comments', 'id', 'SELECT');               -- t (counts/gate)
--   SELECT has_table_privilege('anon', 'public.links', 'SELECT');                         -- f
--   SELECT has_function_privilege('anon', 'public.get_user_question_comments2(uuid)', 'EXECUTE'); -- f
--   SELECT to_regprocedure('public.get_user_question_comments(uuid)');                    -- NULL
