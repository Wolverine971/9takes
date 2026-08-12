-- supabase/migrations/20260812010300_add_telemetry_cleanup_fk_indexes.sql
-- Foreign-key checks run once per deleted parent row. Without indexes on the
-- referencing columns, bounded cleanup still rescans the child tables and can
-- exceed the hosted statement timeout.

CREATE INDEX IF NOT EXISTS idx_page_visits_session_id
	ON public.page_analytics_visits (session_id);

CREATE INDEX IF NOT EXISTS idx_blog_comments_fingerprint
	ON public.blog_comments (fingerprint);
