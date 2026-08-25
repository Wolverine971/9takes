-- supabase/migrations/20260824205037_restrict_email_suppression_rpc_to_service_role.sql
-- Suppression lookups expose recipient-level mailing status and are only used
-- by trusted server jobs. Admin requests fall back to their normal RLS-gated
-- table queries when this RPC is unavailable to the authenticated client.
REVOKE ALL ON FUNCTION public.get_suppressed_emails(TEXT[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_suppressed_emails(TEXT[]) TO service_role;
