-- supabase/migrations/20260318_content_access_events_lockdown.sql
-- Created: 2026-03-18
-- Locks the content access RPC down to service_role because it is only called from the server

REVOKE EXECUTE ON FUNCTION public.record_content_access_event(
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TIMESTAMPTZ
) FROM anon, authenticated;

GRANT EXECUTE ON FUNCTION public.record_content_access_event(
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TIMESTAMPTZ
) TO service_role;
