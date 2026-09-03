-- supabase/migrations/20260903230720_security_remaining_function_search_path.sql
-- The timestamp-only trigger has no application-schema dependencies.
ALTER FUNCTION wargames.set_updated_at() SET search_path = pg_catalog;
