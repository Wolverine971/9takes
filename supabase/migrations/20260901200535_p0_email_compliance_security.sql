-- supabase/migrations/20260901200535_p0_email_compliance_security.sql
-- P0 email compliance and privilege hardening.
--
-- One-click unsubscribe requests are handled by an isolated Vercel function
-- with the service role. Public Data API callers must not be able to invoke
-- privileged email RPCs directly.

CREATE OR REPLACE FUNCTION public.track_email_unsubscribe(
  p_tracking_id UUID,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email_send_id UUID;
  v_email TEXT;
  v_source TEXT;
  v_source_id TEXT;
BEGIN
  IF p_tracking_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Provider retries can arrive concurrently. Serialize a tracking token so
  -- the NOT EXISTS audit insert below remains idempotent under that race.
  PERFORM pg_advisory_xact_lock(hashtextextended(p_tracking_id::TEXT, 0));

  SELECT id, recipient_email, recipient_source, recipient_source_id
    INTO v_email_send_id, v_email, v_source, v_source_id
  FROM public.email_sends
  WHERE tracking_id = p_tracking_id
  LIMIT 1;

  IF v_email_send_id IS NULL THEN
    RETURN NULL;
  END IF;

  v_email := public.unsubscribe_email_direct(
    v_email,
    v_source,
    v_source_id,
    'tracking_unsubscribe'
  );
  IF v_email IS NULL THEN
    RETURN NULL;
  END IF;

  UPDATE public.email_sends
  SET unsubscribed_at = COALESCE(unsubscribed_at, NOW())
  WHERE id = v_email_send_id;

  -- Repeated provider POSTs are expected. Keep the action idempotent all the
  -- way through the audit event, not only in the suppression table.
  INSERT INTO public.email_tracking_events (
    email_send_id,
    event_type,
    ip_address,
    user_agent
  )
  SELECT
    v_email_send_id,
    'unsubscribe',
    p_ip_address,
    p_user_agent
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.email_tracking_events event
    WHERE event.email_send_id = v_email_send_id
      AND event.event_type = 'unsubscribe'
  );

  -- A global unsubscribe must stop every currently actionable sequence, even
  -- when the isolated endpoint cannot call application helpers.
  UPDATE public.email_sequence_enrollments enrollment
  SET status = 'exited',
      exit_reason = 'unsubscribed',
      next_send_at = NULL,
      processing_started_at = NULL,
      updated_at = NOW()
  WHERE public.normalize_email_text(enrollment.recipient_email) = v_email
    AND enrollment.status IN ('active', 'processing', 'paused');

  RETURN v_email;
END;
$$;

-- Lock down the remaining legacy SECURITY DEFINER helpers that previously
-- inherited the caller's mutable search_path.
ALTER FUNCTION public.unsubscribe_email_direct(TEXT, TEXT, TEXT, TEXT)
  SET search_path = public;
ALTER FUNCTION public.get_email_dashboard_users(TEXT, TEXT, INTEGER, INTEGER)
  SET search_path = public;
ALTER FUNCTION public.count_email_dashboard_users(TEXT, TEXT)
  SET search_path = public;
ALTER FUNCTION public.process_scheduled_emails()
  SET search_path = public;
ALTER FUNCTION public.mark_emails_ready_for_processing()
  SET search_path = public;

-- PostgreSQL grants EXECUTE to PUBLIC for new functions. Revoke that implicit
-- grant (and prior explicit anon/authenticated grants) for every privileged
-- email function used by server-only routes.
REVOKE ALL ON FUNCTION public.track_email_unsubscribe(UUID, TEXT, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_email_unsubscribe(UUID, TEXT, TEXT)
  TO service_role;

REVOKE ALL ON FUNCTION public.track_email_event(UUID, TEXT, TEXT, TEXT, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_email_event(UUID, TEXT, TEXT, TEXT, TEXT)
  TO service_role;

REVOKE ALL ON FUNCTION public.unsubscribe_email_direct(TEXT, TEXT, TEXT, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.unsubscribe_email_direct(TEXT, TEXT, TEXT, TEXT)
  TO service_role;

REVOKE ALL ON FUNCTION public.get_suppressed_emails(TEXT[])
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_suppressed_emails(TEXT[])
  TO service_role;

REVOKE ALL ON FUNCTION public.get_email_analytics(UUID, TIMESTAMPTZ, TIMESTAMPTZ)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_email_analytics(UUID, TIMESTAMPTZ, TIMESTAMPTZ)
  TO service_role;

REVOKE ALL ON FUNCTION public.get_email_dashboard_users(TEXT, TEXT, INTEGER, INTEGER)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_email_dashboard_users(TEXT, TEXT, INTEGER, INTEGER)
  TO service_role;

REVOKE ALL ON FUNCTION public.count_email_dashboard_users(TEXT, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.count_email_dashboard_users(TEXT, TEXT)
  TO service_role;

REVOKE ALL ON FUNCTION public.process_scheduled_emails()
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.process_scheduled_emails()
  TO service_role;

REVOKE ALL ON FUNCTION public.mark_emails_ready_for_processing()
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mark_emails_ready_for_processing()
  TO service_role;

REVOKE ALL ON FUNCTION public.enroll_user_in_sequence(UUID, TEXT, TEXT, TEXT, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enroll_user_in_sequence(UUID, TEXT, TEXT, TEXT, TEXT)
  TO service_role;

REVOKE ALL ON FUNCTION public.claim_pending_sequence_sends(INTEGER)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_pending_sequence_sends(INTEGER)
  TO service_role;

REVOKE ALL ON FUNCTION public.claim_specific_sequence_send(UUID)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_specific_sequence_send(UUID)
  TO service_role;

REVOKE ALL ON FUNCTION public.complete_sequence_send(UUID, UUID)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_sequence_send(UUID, UUID)
  TO service_role;

REVOKE ALL ON FUNCTION public.retry_or_fail_sequence_send(UUID, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.retry_or_fail_sequence_send(UUID, TEXT)
  TO service_role;

REVOKE ALL ON FUNCTION public.exit_user_from_sequence(UUID, TEXT, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.exit_user_from_sequence(UUID, TEXT, TEXT)
  TO service_role;

REVOKE ALL ON FUNCTION public.exit_email_from_sequence(TEXT, TEXT, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.exit_email_from_sequence(TEXT, TEXT, TEXT)
  TO service_role;
