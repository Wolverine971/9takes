-- supabase/migrations/20260903230508_security_rls_storage_rpc.sql
-- Apply together with the application changes in the 2026-09-03 security audit.

BEGIN;

REVOKE CREATE ON SCHEMA public FROM PUBLIC, anon, authenticated;

ALTER TABLE public."comment_like_demo" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."comment_like_demo" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."person_suggestions" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."person_suggestions" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."content_community" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."content_community" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."flag_reasons" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."flag_reasons" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."subscriptions_demo" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."subscriptions_demo" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."question_category_tags" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."question_category_tags" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."new-words" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."new-words" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."coaching_waitlist" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."coaching_waitlist" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."link_drops" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."link_drops" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."comment_like" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."comment_like" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."blogs_famous_people_history" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."blogs_famous_people_history" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."content_analytics_daily" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."content_analytics_daily" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."comments_ai" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."comments_ai" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."addresses" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."addresses" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."blogs_famous_people" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."blogs_famous_people" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."question_tags_demo" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."question_tags_demo" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."subscriptions" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."subscriptions" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."email_update_table" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."email_update_table" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."telemetry_maintenance_state" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."telemetry_maintenance_state" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."question_keywords" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."question_keywords" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."question_subcategories" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."question_subcategories" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."content_access_events" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."content_access_events" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."question_categories" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."question_categories" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."question_tag" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."question_tag" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."question_category_intro_runs" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."question_category_intro_runs" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."profiles_demo" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."profiles_demo" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."comments_ai_demo" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."comments_ai_demo" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."content" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."content" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."campaigns" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."campaigns" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."question_tags" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."question_tags" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."templates" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."templates" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."page_analytics_sessions" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."page_analytics_sessions" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."flagged_comments" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."flagged_comments" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."links" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."links" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."content_people" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."content_people" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."questions_demo" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."questions_demo" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."comments_demo" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."comments_demo" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."link_domains" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."link_domains" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."blog_comments" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."blog_comments" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."content_enneagram" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."content_enneagram" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."visitor_first_touch" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."visitor_first_touch" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."visitor_day_activity" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."visitor_day_activity" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."daily_visitor_cohorts" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."daily_visitor_cohorts" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."comments" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."comments" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."content_guides" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."content_guides" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."page_analytics_visits" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."page_analytics_visits" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."questions" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."questions" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."link_domain_owners" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."link_domain_owners" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."visitors" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."visitors" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

ALTER TABLE public."use_demo_table" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_admin_management ON public."use_demo_table" FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY audit_public_read ON public."flag_reasons" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY audit_public_read ON public."question_category_tags" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY audit_public_read ON public."question_keywords" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY audit_public_read ON public."question_subcategories" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY audit_public_read ON public."question_categories" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY audit_public_read ON public."question_tag" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY audit_public_read ON public."question_tags" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY audit_public_read ON public."question_tags_demo" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY audit_public_read ON public."comment_like" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY audit_public_read ON public."comment_like_demo" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY audit_public_read ON public."link_domains" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY audit_public_read ON public."links" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY audit_public_read ON public."use_demo_table" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY audit_published_read ON public.blogs_famous_people FOR SELECT TO anon, authenticated USING (published IS TRUE);

CREATE POLICY audit_published_read ON public.content_people FOR SELECT TO anon, authenticated USING (published IS TRUE);

CREATE POLICY audit_published_read ON public.content_community FOR SELECT TO anon, authenticated USING (published IS TRUE);

CREATE POLICY audit_published_read ON public.content_enneagram FOR SELECT TO anon, authenticated USING (published IS TRUE);

CREATE POLICY audit_published_read ON public.content_guides FOR SELECT TO anon, authenticated USING (published IS TRUE);

DROP POLICY IF EXISTS "Admin can read waitlist metadata" ON public.coaching_waitlist_metadata;

DROP POLICY IF EXISTS "Anyone can insert waitlist metadata" ON public.coaching_waitlist_metadata;

DROP POLICY IF EXISTS "Admin can read waitlist data" ON public.coaching_waitlist;

DROP POLICY IF EXISTS "Anyone can sign up for waitlist" ON public.coaching_waitlist;

DROP POLICY IF EXISTS "Admin can manage campaigns" ON public.coaching_waitlist_campaigns;

CREATE POLICY audit_admin_management ON public.coaching_waitlist_metadata FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY audit_admin_management ON public.coaching_waitlist_campaigns FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

CREATE POLICY audit_own_profile_read ON public.profiles FOR SELECT TO authenticated USING (id = (SELECT auth.uid()) OR (SELECT public.is_admin()));

CREATE VIEW public.public_profiles WITH (security_barrier = true) AS SELECT id, external_id, created_at, first_name, username, enneagram, avatar_url, website FROM public.profiles;

REVOKE ALL ON public.public_profiles FROM PUBLIC, anon, authenticated;

GRANT SELECT ON public.public_profiles TO anon, authenticated, service_role;

CREATE POLICY audit_own_profile_read ON public.profiles_demo FOR SELECT TO authenticated USING (id = (SELECT auth.uid()) OR (SELECT public.is_admin()));

CREATE POLICY audit_own_profile_update ON public.profiles_demo FOR UPDATE TO authenticated USING (id = (SELECT auth.uid())) WITH CHECK (id = (SELECT auth.uid()));

CREATE VIEW public.public_profiles_demo WITH (security_barrier = true) AS SELECT id, external_id, created_at, first_name, username, enneagram, avatar_url, website FROM public.profiles_demo;

REVOKE ALL ON public.public_profiles_demo FROM PUBLIC, anon, authenticated;

GRANT SELECT ON public.public_profiles_demo TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Anyone can view questions" ON public.questions;

CREATE POLICY audit_question_read ON public.questions FOR SELECT TO anon, authenticated USING (removed IS NOT TRUE AND flagged IS NOT TRUE);

CREATE POLICY audit_question_read ON public.questions_demo FOR SELECT TO anon, authenticated USING (removed IS NOT TRUE AND flagged IS NOT TRUE);

CREATE POLICY audit_comment_read ON public.comments FOR SELECT TO anon, authenticated USING (removed IS NOT TRUE);

CREATE POLICY audit_comment_update ON public.comments FOR UPDATE TO authenticated USING (author_id = (SELECT auth.uid())) WITH CHECK (author_id = (SELECT auth.uid()));

CREATE POLICY audit_comment_delete ON public.comments FOR DELETE TO authenticated USING (author_id = (SELECT auth.uid()));

REVOKE SELECT ON public.comments FROM PUBLIC, anon, authenticated;

GRANT SELECT ("author_id", "comment", "comment_count", "created_at", "id", "like_count", "modified_at", "parent_id", "parent_type", "removed", "removed_at") ON public.comments TO anon, authenticated;

CREATE POLICY audit_comment_read ON public.comments_demo FOR SELECT TO anon, authenticated USING (removed IS NOT TRUE);

CREATE POLICY audit_comment_update ON public.comments_demo FOR UPDATE TO authenticated USING (author_id = (SELECT auth.uid())) WITH CHECK (author_id = (SELECT auth.uid()));

CREATE POLICY audit_comment_delete ON public.comments_demo FOR DELETE TO authenticated USING (author_id = (SELECT auth.uid()));

REVOKE SELECT ON public.comments_demo FROM PUBLIC, anon, authenticated;

GRANT SELECT ("author_id", "comment", "comment_count", "created_at", "id", "like_count", "modified_at", "parent_id", "parent_type", "removed", "removed_at") ON public.comments_demo TO anon, authenticated;

CREATE POLICY audit_comment_read ON public.blog_comments FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY audit_comment_update ON public.blog_comments FOR UPDATE TO authenticated USING (author_id = (SELECT auth.uid())) WITH CHECK (author_id = (SELECT auth.uid()));

CREATE POLICY audit_comment_delete ON public.blog_comments FOR DELETE TO authenticated USING (author_id = (SELECT auth.uid()));

CREATE POLICY audit_own_subscription ON public.subscriptions FOR ALL TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY audit_own_subscription ON public.subscriptions_demo FOR ALL TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY audit_own_like_insert ON public.comment_like FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY audit_own_like_delete ON public.comment_like FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

CREATE POLICY audit_own_like_insert ON public.comment_like_demo FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY audit_own_like_delete ON public.comment_like_demo FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

CREATE POLICY audit_flag_insert ON public.flagged_comments FOR INSERT TO authenticated WITH CHECK (flagged_by = (SELECT auth.uid()) AND removed_at IS NULL AND cleared_at IS NULL);

CREATE POLICY audit_owner_tags ON public.question_category_tags FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.questions q WHERE q.id = question_id AND q.author_id = (SELECT auth.uid()))) WITH CHECK (EXISTS (SELECT 1 FROM public.questions q WHERE q.id = question_id AND q.author_id = (SELECT auth.uid())));

CREATE POLICY audit_owner_tags ON public.question_tags FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.questions q WHERE q.id = question_id AND q.author_id = (SELECT auth.uid()))) WITH CHECK (EXISTS (SELECT 1 FROM public.questions q WHERE q.id = question_id AND q.author_id = (SELECT auth.uid())));

ALTER VIEW public."distinct_question_categories" SET (security_invoker = true);

ALTER VIEW public."distinct_question_tags_demo" SET (security_invoker = true);

ALTER VIEW public."consulting_clients_overview" SET (security_invoker = true);

ALTER VIEW public."consulting_upcoming_sessions" SET (security_invoker = true);

ALTER VIEW public."coaching_waitlist_view" SET (security_invoker = true);

ALTER VIEW public."distinct_question_tags" SET (security_invoker = true);

ALTER VIEW public."v_all_blogs" SET (security_invoker = true);

ALTER VIEW public."email_scheduled_pending" SET (security_invoker = true);

ALTER VIEW public."email_cron_status" SET (security_invoker = true);

ALTER FUNCTION public.update_updated_at_column() SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.set_page_analytics_updated_at() SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.is_analytics_utility_path(text) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.slugify_question_category_name(text) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.analytics_scope_match(text,text,text) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.get_page_analytics_pages_sorted_windowed(timestamp with time zone,timestamp with time zone,text,text,integer,integer,text,text) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.get_page_analytics_pages_sorted_windowed(timestamp with time zone,timestamp with time zone,text,text,integer,integer,text,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_pages_sorted_windowed(timestamp with time zone,timestamp with time zone,text,text,integer,integer,text,text) TO service_role;

ALTER FUNCTION public.get_page_analytics_pages_sorted_windowed(timestamp with time zone,timestamp with time zone,text,text,integer,integer,text,text) SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_pages_sorted_windowed(timestamp with time zone,timestamp with time zone,text,text,integer,integer,text,text) TO authenticated;

ALTER FUNCTION public.check_comment_rate_limit(text,text,integer,integer) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.check_comment_rate_limit(text,text,integer,integer) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.check_comment_rate_limit(text,text,integer,integer) TO service_role;

GRANT EXECUTE ON FUNCTION public.check_comment_rate_limit(text,text,integer,integer) TO anon, authenticated;

ALTER FUNCTION public.set_question_category_slug() SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.normalize_email_text(text) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.create_comment_atomic(text,integer,uuid,text,text,text,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.create_comment_atomic(text,integer,uuid,text,text,text,text) TO service_role;

ALTER FUNCTION public.get_questions_by_category(integer,integer,integer) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.update_question_comment_count() SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.get_recent_people_by_type(integer) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.insert_daily_row() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.insert_daily_row() TO service_role;

ALTER FUNCTION public.promote_waitlist_to_client(text) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.update_client_session_stats() SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.get_page_analytics_overview(date,date,text) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.get_page_analytics_overview(date,date,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_overview(date,date,text) TO service_role;

ALTER FUNCTION public.get_page_analytics_overview(date,date,text) SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_overview(date,date,text) TO authenticated;

ALTER FUNCTION public.get_page_analytics_timeseries(date,date,text) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.get_page_analytics_timeseries(date,date,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_timeseries(date,date,text) TO service_role;

ALTER FUNCTION public.get_page_analytics_timeseries(date,date,text) SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_timeseries(date,date,text) TO authenticated;

ALTER FUNCTION public.get_page_analytics_pages(date,date,text,text,integer,integer) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.get_page_analytics_pages(date,date,text,text,integer,integer) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_pages(date,date,text,text,integer,integer) TO service_role;

ALTER FUNCTION public.get_page_analytics_pages(date,date,text,text,integer,integer) SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_pages(date,date,text,text,integer,integer) TO authenticated;

ALTER FUNCTION public.get_page_analytics_page_timeseries(text,date,date,text) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.get_page_analytics_page_timeseries(text,date,date,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_page_timeseries(text,date,date,text) TO service_role;

ALTER FUNCTION public.get_page_analytics_page_timeseries(text,date,date,text) SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_page_timeseries(text,date,date,text) TO authenticated;

ALTER FUNCTION public.get_page_analytics_pages_sorted(date,date,text,text,integer,integer,text,text) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.get_page_analytics_pages_sorted(date,date,text,text,integer,integer,text,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_pages_sorted(date,date,text,text,integer,integer,text,text) TO service_role;

ALTER FUNCTION public.get_page_analytics_pages_sorted(date,date,text,text,integer,integer,text,text) SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_pages_sorted(date,date,text,text,integer,integer,text,text) TO authenticated;

ALTER FUNCTION public.get_project_full(uuid,uuid) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.get_project_full(uuid,uuid) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_project_full(uuid,uuid) TO service_role;

ALTER FUNCTION public.jsonb_array_to_text(jsonb) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.blogs_content_search_vector_update() SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.blogs_famous_people_search_vector_update() SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.get_admin_enneagram_distribution(boolean) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_admin_enneagram_distribution(boolean) TO service_role;

ALTER FUNCTION public.get_admin_enneagram_distribution(boolean) SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION public.get_admin_enneagram_distribution(boolean) TO authenticated;

REVOKE ALL ON FUNCTION public.record_give_first_event(text,text,bigint,text,uuid) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.record_give_first_event(text,text,bigint,text,uuid) TO service_role;

ALTER FUNCTION public.question_category_search_text(bigint) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.build_question_search_vector(bigint,text,text,text) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.refresh_question_search_vector(bigint) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.question_refresh_search_vector_trigger() SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.question_tag_refresh_search_vector_trigger() SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.question_category_name_refresh_search_vector_trigger() SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.record_page_analytics_ping(uuid,integer,smallint,timestamp with time zone,boolean) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.record_page_analytics_ping(uuid,integer,smallint,timestamp with time zone,boolean) TO service_role;

GRANT EXECUTE ON FUNCTION public.record_page_analytics_ping(uuid,integer,smallint,timestamp with time zone,boolean) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.visitors_last_30_days() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.visitors_last_30_days() TO service_role;

ALTER FUNCTION public.visitors_last_30_days() SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION public.visitors_last_30_days() TO authenticated;

ALTER FUNCTION public.text_array_search_text(text[]) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.markdown_heading_search_text(text) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.build_blogs_content_search_vector(text,text,text[],text[],text,text[],text) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.build_blogs_famous_people_search_vector(text,text,text,text,jsonb,text[],text,text) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.question_category_display_text(bigint) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.track_blogs_famous_people_content_changes() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.track_blogs_famous_people_content_changes() TO service_role;

ALTER FUNCTION public.increment_like_count(integer) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.get_category_parent_structure(text) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.get_category_children_structure(text) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.search_all_blogs(text,integer,text,text,integer,integer) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.analytics_local_date(timestamp with time zone) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.normalize_entry_surface(text,text) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.record_visitor_first_touch(text,text,text,text,text,text,text,text,text,text,text,text,text,text,timestamp with time zone) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.record_visitor_first_touch(text,text,text,text,text,text,text,text,text,text,text,text,text,text,timestamp with time zone) TO service_role;

GRANT EXECUTE ON FUNCTION public.record_visitor_first_touch(text,text,text,text,text,text,text,text,text,text,text,text,text,text,timestamp with time zone) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.refresh_daily_visitor_cohorts(date,date) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.refresh_daily_visitor_cohorts(date,date) TO service_role;

REVOKE ALL ON FUNCTION public.record_content_access_event(text,text,text,text,text,timestamp with time zone) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.record_content_access_event(text,text,text,text,text,timestamp with time zone) TO service_role;

REVOKE ALL ON FUNCTION public.get_admin_retention_summary(date) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_admin_retention_summary(date) TO service_role;

ALTER FUNCTION public.get_admin_retention_summary(date) SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION public.get_admin_retention_summary(date) TO authenticated;

REVOKE ALL ON FUNCTION public.backfill_visitor_first_touch_from_page_analytics(date,date) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.backfill_visitor_first_touch_from_page_analytics(date,date) TO service_role;

REVOKE ALL ON FUNCTION public.refresh_visitor_day_activity(date,date) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.refresh_visitor_day_activity(date,date) TO service_role;

REVOKE ALL ON FUNCTION public.refresh_retention_rollups(date,date) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.refresh_retention_rollups(date,date) TO service_role;

REVOKE ALL ON FUNCTION public.get_admin_consulting_dashboard_summary() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_admin_consulting_dashboard_summary() TO service_role;

GRANT EXECUTE ON FUNCTION public.get_admin_consulting_dashboard_summary() TO authenticated;

ALTER FUNCTION public.get_category_questions(text) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.claim_pending_sequence_sends(integer) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.claim_pending_sequence_sends(integer) TO service_role;

REVOKE ALL ON FUNCTION public.attach_profile_first_touch(uuid,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.attach_profile_first_touch(uuid,text) TO service_role;

GRANT EXECUTE ON FUNCTION public.attach_profile_first_touch(uuid,text) TO authenticated;

REVOKE ALL ON FUNCTION public.get_acquisition_mix_by_week(date,date,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_acquisition_mix_by_week(date,date,text) TO service_role;

ALTER FUNCTION public.get_acquisition_mix_by_week(date,date,text) SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION public.get_acquisition_mix_by_week(date,date,text) TO authenticated;

REVOKE ALL ON FUNCTION public.get_first_session_next_paths(date,date,text,integer,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_first_session_next_paths(date,date,text,integer,text) TO service_role;

ALTER FUNCTION public.get_first_session_next_paths(date,date,text,integer,text) SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION public.get_first_session_next_paths(date,date,text,integer,text) TO authenticated;

ALTER FUNCTION public.decrement_like_count(integer) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.get_all_users() SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.get_all_users() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_all_users() TO service_role;

REVOKE ALL ON FUNCTION public.attach_signup_first_touch(bigint,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.attach_signup_first_touch(bigint,text) TO service_role;

ALTER FUNCTION public.parse_json_with_escapes(text) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.set_admin_status_safely(uuid,boolean) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.set_admin_status_safely(uuid,boolean) TO service_role;

GRANT EXECUTE ON FUNCTION public.set_admin_status_safely(uuid,boolean) TO authenticated;

REVOKE ALL ON FUNCTION public.get_reactivation_candidate_summary(integer,text[]) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_reactivation_candidate_summary(integer,text[]) TO service_role;

GRANT EXECUTE ON FUNCTION public.get_reactivation_candidate_summary(integer,text[]) TO authenticated;

REVOKE ALL ON FUNCTION public.get_admin_question_category_rollup() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_admin_question_category_rollup() TO service_role;

GRANT EXECUTE ON FUNCTION public.get_admin_question_category_rollup() TO authenticated;

ALTER FUNCTION public."updateQuestionCommentCount"() SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.update_blogs_famous_people_if_unchanged(bigint,text,jsonb,jsonb) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.update_blogs_famous_people_if_unchanged(bigint,text,jsonb,jsonb) TO service_role;

ALTER FUNCTION public.update_blogs_famous_people_if_unchanged(bigint,text,jsonb,jsonb) SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION public.update_blogs_famous_people_if_unchanged(bigint,text,jsonb,jsonb) TO authenticated;

REVOKE ALL ON FUNCTION public.consume_api_rate_limit(text,text,integer) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.consume_api_rate_limit(text,text,integer) TO service_role;

REVOKE ALL ON FUNCTION public.prune_api_rate_limit_events() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.prune_api_rate_limit_events() TO service_role;

REVOKE ALL ON FUNCTION public.notification_root_question_id(bigint) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.notification_root_question_id(bigint) TO service_role;

REVOKE ALL ON FUNCTION public.notification_actor_type(uuid) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.notification_actor_type(uuid) TO service_role;

REVOKE ALL ON FUNCTION public.notification_kind_enabled(uuid,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.notification_kind_enabled(uuid,text) TO service_role;

REVOKE ALL ON FUNCTION public.notify_on_comment() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.notify_on_comment() TO service_role;

REVOKE ALL ON FUNCTION public.notify_on_comment_like() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.notify_on_comment_like() TO service_role;

REVOKE ALL ON FUNCTION public.cleanup_notifications_on_comment_removal() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.cleanup_notifications_on_comment_removal() TO service_role;

ALTER FUNCTION public.can_see_comments_3(integer,uuid,text) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.update_notification_preferences(boolean,boolean,boolean,boolean,boolean) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.update_notification_preferences(boolean,boolean,boolean,boolean,boolean) TO service_role;

GRANT EXECUTE ON FUNCTION public.update_notification_preferences(boolean,boolean,boolean,boolean,boolean) TO authenticated;

REVOKE ALL ON FUNCTION public.get_notification_feed(integer) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_notification_feed(integer) TO service_role;

GRANT EXECUTE ON FUNCTION public.get_notification_feed(integer) TO authenticated;

REVOKE ALL ON FUNCTION public.get_unread_notification_count() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_unread_notification_count() TO service_role;

GRANT EXECUTE ON FUNCTION public.get_unread_notification_count() TO authenticated;

REVOKE ALL ON FUNCTION public.mark_notifications_read(bigint[]) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.mark_notifications_read(bigint[]) TO service_role;

GRANT EXECUTE ON FUNCTION public.mark_notifications_read(bigint[]) TO authenticated;

REVOKE ALL ON FUNCTION public.enqueue_notification(uuid,text,text,bigint,bigint,bigint,bigint) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.enqueue_notification(uuid,text,text,bigint,bigint,bigint,bigint) TO service_role;

ALTER FUNCTION public.get_children(integer) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.get_category_hierarchy() SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.increment_clicks(integer) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.get_user_question_comments2(uuid) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.get_related_blogs_for_question(bigint,integer) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.claim_telemetry_cleanup_slot(text,timestamp with time zone,interval) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.claim_telemetry_cleanup_slot(text,timestamp with time zone,interval) TO service_role;

REVOKE ALL ON FUNCTION public.cleanup_site_telemetry(timestamp with time zone) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.cleanup_site_telemetry(timestamp with time zone) TO service_role;

ALTER FUNCTION public.typeahead_blog_search(text,integer) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.get_page_analytics_trending_pages(timestamp with time zone,integer,text,integer,integer,integer) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_trending_pages(timestamp with time zone,integer,text,integer,integer,integer) TO service_role;

ALTER FUNCTION public.get_page_analytics_trending_pages(timestamp with time zone,integer,text,integer,integer,integer) SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_trending_pages(timestamp with time zone,integer,text,integer,integer,integer) TO authenticated;

REVOKE ALL ON FUNCTION public.get_page_analytics_pages_by_duration(date,date,text,integer,integer) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_pages_by_duration(date,date,text,integer,integer) TO service_role;

ALTER FUNCTION public.get_page_analytics_pages_by_duration(date,date,text,integer,integer) SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_pages_by_duration(date,date,text,integer,integer) TO authenticated;

ALTER FUNCTION public.typeahead_question_search(text,integer) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.search_questions(text,integer,integer) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.get_page_analytics_top_pages_timeseries(date,date,text,integer) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_top_pages_timeseries(date,date,text,integer) TO service_role;

ALTER FUNCTION public.get_page_analytics_top_pages_timeseries(date,date,text,integer) SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_top_pages_timeseries(date,date,text,integer) TO authenticated;

REVOKE ALL ON FUNCTION public.get_entry_surface_overview(date,date,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_entry_surface_overview(date,date,text) TO service_role;

ALTER FUNCTION public.get_entry_surface_overview(date,date,text) SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION public.get_entry_surface_overview(date,date,text) TO authenticated;

REVOKE ALL ON FUNCTION public.get_cohort_retention_curve(date,date,text,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_cohort_retention_curve(date,date,text,text) TO service_role;

ALTER FUNCTION public.get_cohort_retention_curve(date,date,text,text) SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION public.get_cohort_retention_curve(date,date,text,text) TO authenticated;

REVOKE ALL ON FUNCTION public.get_source_overview(date,date,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_source_overview(date,date,text) TO service_role;

ALTER FUNCTION public.get_source_overview(date,date,text) SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION public.get_source_overview(date,date,text) TO authenticated;

REVOKE ALL ON FUNCTION public.get_enneagram_type_prompt_send_guard(uuid,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_enneagram_type_prompt_send_guard(uuid,text) TO service_role;

REVOKE ALL ON FUNCTION public.enforce_question_author_identity() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.enforce_question_author_identity() TO service_role;

REVOKE ALL ON FUNCTION public.enforce_comment_author_identity() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.enforce_comment_author_identity() TO service_role;

REVOKE ALL ON FUNCTION public.enforce_comment_like_user_identity() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.enforce_comment_like_user_identity() TO service_role;

REVOKE ALL ON FUNCTION public.enforce_subscription_user_identity() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.enforce_subscription_user_identity() TO service_role;

REVOKE ALL ON FUNCTION public.get_admin_users_page(text,text,text,text,integer,integer) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_admin_users_page(text,text,text,text,integer,integer) TO service_role;

GRANT EXECUTE ON FUNCTION public.get_admin_users_page(text,text,text,text,integer,integer) TO authenticated;

REVOKE ALL ON FUNCTION public.create_comment_reply_subscription(integer,integer,text,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.create_comment_reply_subscription(integer,integer,text,text) TO service_role;

GRANT EXECUTE ON FUNCTION public.create_comment_reply_subscription(integer,integer,text,text) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.cancel_anonymous_reply_notification_on_removal() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.cancel_anonymous_reply_notification_on_removal() TO service_role;

REVOKE ALL ON FUNCTION public.enqueue_anonymous_reply_notification() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.enqueue_anonymous_reply_notification() TO service_role;

ALTER FUNCTION public.analytics_percent_rank_less(integer,integer) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.get_10_question_tags() SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.analytics_normalize_content_slug(text) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.get_page_analytics_timing_heatmap(date,date,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_timing_heatmap(date,date,text) TO service_role;

ALTER FUNCTION public.get_page_analytics_timing_heatmap(date,date,text) SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION public.get_page_analytics_timing_heatmap(date,date,text) TO authenticated;

REVOKE ALL ON FUNCTION public.refresh_content_analytics_daily(date,date,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.refresh_content_analytics_daily(date,date,text) TO service_role;

REVOKE ALL ON FUNCTION public.upsert_page_analytics_visit(uuid,text,text,uuid,text,text,text,text,text,text,text,text,text,text,text,text,text,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.upsert_page_analytics_visit(uuid,text,text,uuid,text,text,text,text,text,text,text,text,text,text,text,text,text,text) TO service_role;

GRANT EXECUTE ON FUNCTION public.upsert_page_analytics_visit(uuid,text,text,uuid,text,text,text,text,text,text,text,text,text,text,text,text,text,text) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.get_content_release_growth_curve(text,integer) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_content_release_growth_curve(text,integer) TO service_role;

ALTER FUNCTION public.get_content_release_growth_curve(text,integer) SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION public.get_content_release_growth_curve(text,integer) TO authenticated;

REVOKE ALL ON FUNCTION public.get_reply_notification_analytics_context(uuid) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_reply_notification_analytics_context(uuid) TO service_role;

REVOKE ALL ON FUNCTION public.record_content_release_event(text,text,text,timestamp with time zone,text,text,jsonb) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.record_content_release_event(text,text,text,timestamp with time zone,text,text,jsonb) TO service_role;

GRANT EXECUTE ON FUNCTION public.record_content_release_event(text,text,text,timestamp with time zone,text,text,jsonb) TO authenticated;

ALTER FUNCTION public.get_categories() SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.get_content_release_event_impact(text,integer,integer) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_content_release_event_impact(text,integer,integer) TO service_role;

GRANT EXECUTE ON FUNCTION public.get_content_release_event_impact(text,integer,integer) TO authenticated;

REVOKE ALL ON FUNCTION public.record_question_feature_impression(bigint,bigint,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.record_question_feature_impression(bigint,bigint,text) TO service_role;

ALTER FUNCTION public.comments_last_30_days() SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.fail_reply_notification_delivery(bigint,uuid,text,boolean,boolean) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.fail_reply_notification_delivery(bigint,uuid,text,boolean,boolean) TO service_role;

REVOKE ALL ON FUNCTION public.claim_reply_notification_outbox(integer) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.claim_reply_notification_outbox(integer) TO service_role;

REVOKE ALL ON FUNCTION public.create_reply_notification_tracking(bigint,text,text,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.create_reply_notification_tracking(bigint,text,text,text) TO service_role;

REVOKE ALL ON FUNCTION public.prepare_reply_notification_delivery(bigint) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.prepare_reply_notification_delivery(bigint) TO service_role;

REVOKE ALL ON FUNCTION public.complete_reply_notification_delivery(bigint,uuid,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.complete_reply_notification_delivery(bigint,uuid,text) TO service_role;

REVOKE ALL ON FUNCTION public.unsubscribe_comment_reply_subscription(uuid) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.unsubscribe_comment_reply_subscription(uuid) TO service_role;

GRANT EXECUTE ON FUNCTION public.unsubscribe_comment_reply_subscription(uuid) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.get_reply_notification_return_context(uuid) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_reply_notification_return_context(uuid) TO service_role;

GRANT EXECUTE ON FUNCTION public.get_reply_notification_return_context(uuid) TO anon, authenticated;

ALTER FUNCTION public.increment_link_hit(integer) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.set_homepage_fallback_question(bigint,uuid) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.set_homepage_fallback_question(bigint,uuid) TO service_role;

ALTER FUNCTION public.daily_questions_stats() SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.get_content_release_demand_metrics() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_content_release_demand_metrics() TO service_role;

GRANT EXECUTE ON FUNCTION public.get_content_release_demand_metrics() TO authenticated;

ALTER FUNCTION public.get_questions_page_data(uuid,integer,integer,integer) SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.get_questions_page_data(uuid,integer,integer,integer) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_questions_page_data(uuid,integer,integer,integer) TO service_role;

GRANT EXECUTE ON FUNCTION public.get_questions_page_data(uuid,integer,integer,integer) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.get_current_homepage_feature() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_current_homepage_feature() TO service_role;

REVOKE ALL ON FUNCTION public.start_question_feature_run(bigint,text,text,integer,integer,text,uuid) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.start_question_feature_run(bigint,text,text,integer,integer,text,uuid) TO service_role;

REVOKE ALL ON FUNCTION public.control_question_feature_run(bigint,text,integer) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.control_question_feature_run(bigint,text,integer) TO service_role;

REVOKE ALL ON FUNCTION public.get_suppressed_emails(text[]) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_suppressed_emails(text[]) TO service_role;

REVOKE ALL ON FUNCTION public.get_content_release_performance(date,date,integer) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_content_release_performance(date,date,integer) TO service_role;

GRANT EXECUTE ON FUNCTION public.get_content_release_performance(date,date,integer) TO authenticated;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

REVOKE ALL ON FUNCTION public.track_email_unsubscribe(uuid,text,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.track_email_unsubscribe(uuid,text,text) TO service_role;

REVOKE ALL ON FUNCTION public.unsubscribe_email_direct(text,text,text,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.unsubscribe_email_direct(text,text,text,text) TO service_role;

REVOKE ALL ON FUNCTION public.get_email_dashboard_users(text,text,integer,integer) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_email_dashboard_users(text,text,integer,integer) TO service_role;

REVOKE ALL ON FUNCTION public.count_email_dashboard_users(text,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.count_email_dashboard_users(text,text) TO service_role;

REVOKE ALL ON FUNCTION public.process_scheduled_emails() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.process_scheduled_emails() TO service_role;

REVOKE ALL ON FUNCTION public.mark_emails_ready_for_processing() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.mark_emails_ready_for_processing() TO service_role;

REVOKE ALL ON FUNCTION public.enroll_user_in_sequence(uuid,text,text,text,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.enroll_user_in_sequence(uuid,text,text,text,text) TO service_role;

REVOKE ALL ON FUNCTION public.claim_specific_sequence_send(uuid) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.claim_specific_sequence_send(uuid) TO service_role;

REVOKE ALL ON FUNCTION public.complete_sequence_send(uuid,uuid) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.complete_sequence_send(uuid,uuid) TO service_role;

REVOKE ALL ON FUNCTION public.retry_or_fail_sequence_send(uuid,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.retry_or_fail_sequence_send(uuid,text) TO service_role;

REVOKE ALL ON FUNCTION public.exit_user_from_sequence(uuid,text,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.exit_user_from_sequence(uuid,text,text) TO service_role;

REVOKE ALL ON FUNCTION public.exit_email_from_sequence(text,text,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.exit_email_from_sequence(text,text,text) TO service_role;

REVOKE ALL ON FUNCTION public.process_email_provider_event(text,text,text,text,timestamp with time zone,jsonb) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.process_email_provider_event(text,text,text,text,timestamp with time zone,jsonb) TO service_role;

REVOKE ALL ON FUNCTION public.claim_due_scheduled_emails(integer) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.claim_due_scheduled_emails(integer) TO service_role;

REVOKE ALL ON FUNCTION public.track_email_event(uuid,text,text,text,text,text,text,text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.track_email_event(uuid,text,text,text,text,text,text,text) TO service_role;

REVOKE ALL ON FUNCTION public.qualify_pending_email_clicks(interval,integer) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.qualify_pending_email_clicks(interval,integer) TO service_role;

REVOKE ALL ON FUNCTION public.get_email_analytics(uuid,timestamp with time zone,timestamp with time zone) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_email_analytics(uuid,timestamp with time zone,timestamp with time zone) TO service_role;

REVOKE ALL ON FUNCTION public.reprocess_email_provider_events(integer) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.reprocess_email_provider_events(integer) TO service_role;

ALTER FUNCTION public."updateQuestionDemoCommentCount"() SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.get_user_question_comments(uuid) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.can_see_comments_2(integer,uuid,text) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.can_see_comments(integer,uuid,text) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.handle_new_user() SET search_path = pg_catalog, public, extensions, pg_temp;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

ALTER FUNCTION public.increment_comment_count(integer) SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.install_available_extensions_and_test() SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.question_with_comments() SET search_path = pg_catalog, public, extensions, pg_temp;

ALTER FUNCTION public.question_with_comments(text) SET search_path = pg_catalog, public, extensions, pg_temp;

CREATE OR REPLACE FUNCTION public.attach_profile_first_touch(p_profile_id uuid, p_fingerprint text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
	v_updated BOOLEAN := FALSE;
BEGIN
  IF auth.role() IS DISTINCT FROM 'service_role' AND p_profile_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Profile identity mismatch' USING ERRCODE = '42501';
  END IF;
	IF p_profile_id IS NULL OR COALESCE(BTRIM(p_fingerprint), '') = '' THEN
		RETURN FALSE;
	END IF;

	UPDATE public.profiles p
	SET first_touch_fingerprint = v.fingerprint,
		first_visit_at = v.first_visit_at,
		first_landing_path = v.first_path,
		first_referrer_host = v.first_referrer_host,
		first_acquisition_source = v.first_acquisition_source,
		first_entry_surface = v.first_entry_surface
	FROM public.visitor_first_touch v
	WHERE p.id = p_profile_id
		AND v.fingerprint = p_fingerprint
		AND p.first_visit_at IS NULL
	RETURNING TRUE INTO v_updated;

	RETURN COALESCE(v_updated, FALSE);
END;
$function$;

CREATE OR REPLACE FUNCTION public.can_see_comments_3(questionid integer, userid uuid, userfingerprint text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = pg_catalog, public, pg_temp
AS $function$
DECLARE
    result BOOLEAN;
    use_demo_table BOOLEAN;
BEGIN  
    -- Check the value of demo_time in admin_settings
    SELECT value INTO use_demo_table FROM admin_settings 
    WHERE type = 'demo_time' LIMIT 1;

    -- Conditional logic to choose the right table
    IF use_demo_table THEN
        SELECT EXISTS (
            SELECT 1 
            FROM comments_demo 
            WHERE parent_id = questionId
            AND parent_type = 'question'
            AND (author_id = auth.uid() OR fingerprint = userFingerprint)
        ) INTO result;
    ELSE
        SELECT EXISTS (
            SELECT 1 
            FROM comments 
            WHERE parent_id = questionId
            AND parent_type = 'question'
            AND (author_id = auth.uid() OR fingerprint = userFingerprint)
        ) INTO result;
    END IF;

    RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_question_comments2(authorid uuid)
 RETURNS TABLE(question text, question_formatted text, url text, id bigint, created_at timestamp with time zone, author_id uuid, comment text, comment_count bigint, like_count bigint, ip text, es_id text, parent_id bigint, parent_type text, fingerprint text)
 LANGUAGE plpgsql
AS $function$
DECLARE
    use_demo_table BOOLEAN;
BEGIN
    -- Check the value of demo_time in admin_settings
    SELECT value INTO use_demo_table FROM admin_settings 
    WHERE type = 'demo_time' LIMIT 1;

    IF use_demo_table THEN
        RETURN QUERY 
        SELECT
            q.question,
            q.question_formatted,
            q.url,
            c.id,
            c.created_at,
            c.author_id,
            c.comment,
            c.comment_count,
            c.like_count,
            NULL::text,
            NULL::text,
            c.parent_id,
            c.parent_type,
            NULL::text
        FROM
            public.comments_demo c
            LEFT JOIN public.questions_demo q ON q.id = c.parent_id
        WHERE
            c.parent_type = 'question'
            AND c.author_id = authorId
        ORDER BY
            q.question DESC;
    ELSE
        RETURN QUERY 
        SELECT
            q.question,
            q.question_formatted,
            q.url,
            c.id,
            c.created_at,
            c.author_id,
            c.comment,
            c.comment_count,
            c.like_count,
            NULL::text,
            NULL::text,
            c.parent_id,
            c.parent_type,
            NULL::text
        FROM
            public.comments c
            LEFT JOIN public.questions q ON q.id = c.parent_id
        WHERE
            c.parent_type = 'question'
            AND c.author_id = authorId
        ORDER BY
            q.question DESC;
    END IF;
END;
$function$;

DROP POLICY IF EXISTS "Anyone can upload an avatar." ON storage.objects;

DROP POLICY IF EXISTS "allow all 15k0kst_1" ON storage.objects;

DROP POLICY IF EXISTS "allow all 15k0kst_2" ON storage.objects;

CREATE POLICY question_owner_upload ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'questions' AND (storage.foldername(name))[1] = 'images' AND EXISTS (SELECT 1 FROM public.questions q WHERE q.url = (storage.foldername(name))[2] AND (q.author_id = (SELECT auth.uid()) OR (SELECT public.is_admin()))));

CREATE POLICY question_owner_replace ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'questions' AND (storage.foldername(name))[1] = 'images' AND EXISTS (SELECT 1 FROM public.questions q WHERE q.url = (storage.foldername(name))[2] AND (q.author_id = (SELECT auth.uid()) OR (SELECT public.is_admin())))) WITH CHECK (bucket_id = 'questions' AND (storage.foldername(name))[1] = 'images' AND EXISTS (SELECT 1 FROM public.questions q WHERE q.url = (storage.foldername(name))[2] AND (q.author_id = (SELECT auth.uid()) OR (SELECT public.is_admin()))));

CREATE POLICY avatar_owner_upload ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);

UPDATE storage.buckets SET file_size_limit = 10485760, allowed_mime_types = ARRAY['image/png','image/jpeg','image/webp'] WHERE id IN ('questions','avatars');

NOTIFY pgrst, 'reload schema';

REVOKE TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.protect_comment_fields()
RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF current_user IN ('anon','authenticated') AND NOT public.is_admin() AND
    (to_jsonb(NEW) - ARRAY['comment','modified_at']) IS DISTINCT FROM
    (to_jsonb(OLD) - ARRAY['comment','modified_at']) THEN
    RAISE EXCEPTION 'Comment identity and moderation fields are protected' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.protect_comment_fields() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER protect_comment_fields BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.protect_comment_fields();
CREATE TRIGGER protect_comment_fields BEFORE UPDATE ON public.comments_demo FOR EACH ROW EXECUTE FUNCTION public.protect_comment_fields();

CREATE OR REPLACE FUNCTION public.sync_comment_like_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_id bigint;
BEGIN
  v_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.comment_id ELSE NEW.comment_id END;
  IF TG_TABLE_NAME = 'comment_like_demo' THEN
    UPDATE public.comments_demo SET like_count = greatest(0, coalesce(like_count, 0) + CASE WHEN TG_OP = 'DELETE' THEN -1 ELSE 1 END) WHERE id = v_id;
  ELSE
    UPDATE public.comments SET like_count = greatest(0, coalesce(like_count, 0) + CASE WHEN TG_OP = 'DELETE' THEN -1 ELSE 1 END) WHERE id = v_id;
  END IF;
  RETURN NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.sync_comment_like_count() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER sync_comment_like_count AFTER INSERT OR DELETE ON public.comment_like FOR EACH ROW EXECUTE FUNCTION public.sync_comment_like_count();
CREATE TRIGGER sync_comment_like_count AFTER INSERT OR DELETE ON public.comment_like_demo FOR EACH ROW EXECUTE FUNCTION public.sync_comment_like_count();

CREATE OR REPLACE FUNCTION public.protect_question_moderation()
RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF current_user IN ('anon','authenticated') AND NOT public.is_admin() AND
    (NEW.author_id IS DISTINCT FROM OLD.author_id OR NEW.removed IS DISTINCT FROM OLD.removed OR NEW.flagged IS DISTINCT FROM OLD.flagged OR NEW.comment_count IS DISTINCT FROM OLD.comment_count) THEN
    RAISE EXCEPTION 'Question identity and moderation fields are protected' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.protect_question_moderation() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER protect_question_moderation BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION public.protect_question_moderation();
CREATE TRIGGER protect_question_moderation BEFORE UPDATE ON public.questions_demo FOR EACH ROW EXECUTE FUNCTION public.protect_question_moderation();

CREATE OR REPLACE FUNCTION public.create_comment_atomic(p_comment text, p_parent_id integer, p_author_id uuid, p_parent_type text, p_fingerprint text, p_ip text, p_es_id text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
DECLARE
  v_new_comment public.comments%ROWTYPE;
  v_user_id UUID := auth.uid();
  v_role TEXT := auth.role();
  v_has_known_actor BOOLEAN := FALSE;
  v_question_id INTEGER;
  v_question_created_at public.questions.created_at%TYPE;
  v_responses_before_comment INTEGER := 0;
  v_is_first_comment_ever BOOLEAN;
  v_is_first_comment_on_question BOOLEAN := FALSE;
  v_question_age_hours DOUBLE PRECISION;
BEGIN
  IF length(btrim(coalesce(p_comment, ''))) NOT BETWEEN 1 AND 5000 OR p_parent_type NOT IN ('question','comment') OR p_parent_id < 1 THEN
    RAISE EXCEPTION 'Invalid comment' USING ERRCODE = '22023';
  END IF;
  IF v_role <> 'service_role' AND p_author_id IS NOT NULL THEN
    IF v_user_id IS NULL OR p_author_id IS DISTINCT FROM v_user_id THEN
      RAISE EXCEPTION 'Comment author_id must match the authenticated user'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  -- Serialize writes by known actor so two simultaneous comments cannot both
  -- be labeled as that actor's first comment.
  IF p_author_id IS NOT NULL THEN
    v_has_known_actor := TRUE;
    PERFORM pg_advisory_xact_lock(hashtext('user:' || p_author_id::TEXT));
  END IF;

  IF NULLIF(BTRIM(p_fingerprint), '') IS NOT NULL THEN
    v_has_known_actor := TRUE;
    PERFORM pg_advisory_xact_lock(hashtext('fingerprint:' || p_fingerprint));
  END IF;

  IF p_parent_type = 'question' THEN
    v_question_id := p_parent_id;
  ELSIF p_parent_type = 'comment' THEN
    WITH RECURSIVE comment_ancestry AS (
      SELECT c.id, c.parent_id, c.parent_type
      FROM public.comments c
      WHERE c.id = p_parent_id AND c.removed IS NOT TRUE

      UNION

      SELECT parent.id, parent.parent_id, parent.parent_type
      FROM public.comments parent
      JOIN comment_ancestry child
        ON child.parent_type = 'comment'
       AND parent.id = child.parent_id
       AND parent.removed IS NOT TRUE
    )
    SELECT ancestry.parent_id
    INTO v_question_id
    FROM comment_ancestry ancestry
    WHERE ancestry.parent_type = 'question'
    LIMIT 1;
  END IF;

  IF v_question_id IS NULL THEN
    RAISE EXCEPTION 'Comment parent is unavailable' USING ERRCODE = '42501';
  END IF;

  -- Lock the question while deriving response order. This makes the
  -- first-response flag exact even when two comments arrive concurrently.
  IF v_question_id IS NOT NULL THEN
    SELECT q.created_at
    INTO v_question_created_at
    FROM public.questions q
    WHERE q.id = v_question_id AND q.removed IS NOT TRUE AND q.flagged IS NOT TRUE
    FOR UPDATE;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Question is unavailable' USING ERRCODE = '42501';
    END IF;

    SELECT COUNT(*)::INTEGER
    INTO v_responses_before_comment
    FROM public.comments c
    WHERE c.parent_type = 'question'
      AND c.parent_id = v_question_id
      AND c.removed IS NOT TRUE;

    v_is_first_comment_on_question :=
      p_parent_type = 'question' AND v_responses_before_comment = 0;

    IF v_question_created_at IS NOT NULL THEN
      v_question_age_hours := GREATEST(
        0,
        EXTRACT(EPOCH FROM (clock_timestamp() - v_question_created_at)) / 3600.0
      );
    END IF;
  END IF;

  IF NOT v_has_known_actor THEN
    v_is_first_comment_ever := NULL;
  ELSE
    SELECT NOT EXISTS (
      SELECT 1
      FROM public.comments c
      WHERE
        (p_author_id IS NOT NULL AND c.author_id = p_author_id)
        OR (
          NULLIF(BTRIM(p_fingerprint), '') IS NOT NULL
          AND c.fingerprint = p_fingerprint
        )
    )
    INTO v_is_first_comment_ever;
  END IF;

  IF p_author_id IS NULL THEN
    IF p_parent_type <> 'question' OR nullif(btrim(p_fingerprint), '') IS NULL THEN
      RAISE EXCEPTION 'Anonymous comments require a question and fingerprint' USING ERRCODE = '42501';
    END IF;
    IF EXISTS (SELECT 1 FROM public.comments WHERE parent_id = p_parent_id AND parent_type = 'question' AND author_id IS NULL AND fingerprint = p_fingerprint AND removed IS NOT TRUE) THEN
      RAISE EXCEPTION 'Anonymous visitors can only comment once per question' USING ERRCODE = '23505';
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

  RETURN (
    row_to_json(v_new_comment)::JSONB
    || jsonb_build_object(
      '_analytics',
      jsonb_build_object(
        'is_first_comment_ever', v_is_first_comment_ever,
        'is_first_comment_on_question', v_is_first_comment_on_question,
        'is_reply', p_parent_type = 'comment',
        'question_age_hours', v_question_age_hours,
        'responses_before_comment', v_responses_before_comment
      )
    )
  )::JSON;
END;
$function$
;

-- New tables/RPCs need deliberate grants in their creating migration.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon, authenticated;

REVOKE SELECT ON public.blog_comments FROM PUBLIC, anon, authenticated;
GRANT SELECT ("author_id", "blog_link", "blog_type", "comment", "created_at", "id") ON public.blog_comments TO anon, authenticated;
CREATE TRIGGER protect_comment_fields BEFORE UPDATE ON public.blog_comments FOR EACH ROW EXECUTE FUNCTION public.protect_comment_fields();

-- Aggregate private actor identifiers only behind an explicit admin check.
CREATE OR REPLACE FUNCTION public.get_admin_retention_summary(p_anchor_date date DEFAULT NULL::date)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
	v_today DATE := COALESCE(p_anchor_date, public.analytics_local_date(NOW()));
	v_current_week_start DATE := DATE_TRUNC('week', v_today::TIMESTAMP)::DATE;
	v_last_full_week_start DATE := v_current_week_start - 7;
	v_last_full_week_end DATE := v_current_week_start - 1;
	v_last_mature_d7_week_start DATE := v_current_week_start - 14;
	v_last_mature_d7_week_end DATE := v_current_week_start - 8;
	v_new_visitors_this_week BIGINT := 0;
	v_full_week_denominator BIGINT := 0;
	v_comment_numerator BIGINT := 0;
	v_signup_numerator BIGINT := 0;
	v_registration_numerator BIGINT := 0;
	v_d7_denominator BIGINT := 0;
	v_d7_numerator BIGINT := 0;
	v_active_contributors BIGINT := 0;
BEGIN
  IF auth.role() IS DISTINCT FROM 'service_role' AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Administrator access required' USING ERRCODE = '42501';
  END IF;
	SELECT COALESCE(SUM(d.cohort_size), 0)::BIGINT
	INTO v_new_visitors_this_week
	FROM public.daily_visitor_cohorts d
	WHERE d.cohort_date BETWEEN v_current_week_start AND v_today;

	SELECT
		COALESCE(SUM(d.cohort_size), 0)::BIGINT,
		COALESCE(SUM(d.commented_within_d7), 0)::BIGINT,
		COALESCE(SUM(d.signed_up_within_d7), 0)::BIGINT,
		COALESCE(SUM(d.registered_within_d7), 0)::BIGINT
	INTO
		v_full_week_denominator,
		v_comment_numerator,
		v_signup_numerator,
		v_registration_numerator
	FROM public.daily_visitor_cohorts d
	WHERE d.cohort_date BETWEEN v_last_full_week_start AND v_last_full_week_end;

	SELECT
		COALESCE(SUM(d.cohort_size), 0)::BIGINT,
		COALESCE(SUM(d.retained_d7), 0)::BIGINT
	INTO
		v_d7_denominator,
		v_d7_numerator
	FROM public.daily_visitor_cohorts d
	WHERE d.cohort_date BETWEEN v_last_mature_d7_week_start AND v_last_mature_d7_week_end;

	SELECT COUNT(DISTINCT contributors.contributor_key)::BIGINT
	INTO v_active_contributors
	FROM (
		SELECT COALESCE(c.author_id::TEXT, NULLIF(BTRIM(c.fingerprint), '')) AS contributor_key
		FROM public.comments c
		WHERE COALESCE(c.removed, FALSE) = FALSE
			AND public.analytics_local_date(COALESCE(c.created_at, NOW())) BETWEEN v_current_week_start AND v_today

		UNION

		SELECT COALESCE(bc.author_id::TEXT, NULLIF(BTRIM(bc.fingerprint), '')) AS contributor_key
		FROM public.blog_comments bc
		WHERE public.analytics_local_date(bc.created_at) BETWEEN v_current_week_start AND v_today
	) contributors
	WHERE COALESCE(BTRIM(contributors.contributor_key), '') <> '';

	RETURN jsonb_build_object(
		'anchor_date', v_today,
		'new_visitors_this_week', v_new_visitors_this_week,
		'current_week_start', v_current_week_start,
		'current_week_end', v_today,
		'first_comment_rate_last_full_week', jsonb_build_object(
			'week_start', v_last_full_week_start,
			'week_end', v_last_full_week_end,
			'numerator', v_comment_numerator,
			'denominator', v_full_week_denominator,
			'pct', CASE
				WHEN v_full_week_denominator > 0
				THEN ROUND(v_comment_numerator::NUMERIC / v_full_week_denominator::NUMERIC * 100, 2)
				ELSE 0
			END
		),
		'email_signup_rate_last_full_week', jsonb_build_object(
			'week_start', v_last_full_week_start,
			'week_end', v_last_full_week_end,
			'numerator', v_signup_numerator,
			'denominator', v_full_week_denominator,
			'pct', CASE
				WHEN v_full_week_denominator > 0
				THEN ROUND(v_signup_numerator::NUMERIC / v_full_week_denominator::NUMERIC * 100, 2)
				ELSE 0
			END
		),
		'registered_rate_last_full_week', jsonb_build_object(
			'week_start', v_last_full_week_start,
			'week_end', v_last_full_week_end,
			'numerator', v_registration_numerator,
			'denominator', v_full_week_denominator,
			'pct', CASE
				WHEN v_full_week_denominator > 0
				THEN ROUND(v_registration_numerator::NUMERIC / v_full_week_denominator::NUMERIC * 100, 2)
				ELSE 0
			END
		),
		'd7_retention_last_mature_week', jsonb_build_object(
			'week_start', v_last_mature_d7_week_start,
			'week_end', v_last_mature_d7_week_end,
			'numerator', v_d7_numerator,
			'denominator', v_d7_denominator,
			'pct', CASE
				WHEN v_d7_denominator > 0
				THEN ROUND(v_d7_numerator::NUMERIC / v_d7_denominator::NUMERIC * 100, 2)
				ELSE 0
			END
		),
		'active_contributors_this_week', v_active_contributors
	);
END;
$function$
;

NOTIFY pgrst, 'reload schema';
ALTER FUNCTION public.get_user_question_comments2(uuid) SET search_path = pg_catalog, public, pg_temp;

-- Index operator-class dependencies survive the namespace move.
ALTER EXTENSION pg_trgm SET SCHEMA extensions;

-- No application calls or database dependents; blocks managed Postgres upgrades.
DROP EXTENSION IF EXISTS pgjwt;
COMMIT;
