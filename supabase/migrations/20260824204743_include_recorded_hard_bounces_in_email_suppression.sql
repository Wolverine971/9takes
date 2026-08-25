-- supabase/migrations/20260824204743_include_recorded_hard_bounces_in_email_suppression.sql
-- Treat a provider-confirmed hard bounce as a global suppression even if the
-- bounce was recorded before the address was copied to email_unsubscribes.
-- Authentication failures (for example Yahoo rejecting a bad DKIM signature)
-- are deliberately not recorded as recipient bounces and are not suppressed.

INSERT INTO public.email_unsubscribes (
  email,
  source,
  source_id,
  reason,
  unsubscribed_at
)
SELECT DISTINCT ON (public.normalize_email_text(send.recipient_email))
  public.normalize_email_text(send.recipient_email),
  send.recipient_source,
  send.recipient_source_id,
  'recorded_hard_bounce_backfill',
  COALESCE(send.bounced_at, send.sent_at, send.created_at, NOW())
FROM public.email_sends AS send
WHERE public.normalize_email_text(send.recipient_email) IS NOT NULL
  AND (send.bounced_at IS NOT NULL OR send.status = 'bounced')
ORDER BY
  public.normalize_email_text(send.recipient_email),
  send.bounced_at DESC NULLS LAST,
  send.sent_at DESC NULLS LAST,
  send.created_at DESC
ON CONFLICT (email) DO NOTHING;

CREATE OR REPLACE FUNCTION public.get_suppressed_emails(p_emails TEXT[])
RETURNS TABLE (
  email TEXT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
WITH normalized_input AS (
  SELECT DISTINCT public.normalize_email_text(value) AS email_norm
  FROM unnest(COALESCE(p_emails, ARRAY[]::TEXT[])) AS value
  WHERE public.normalize_email_text(value) IS NOT NULL
),
suppressed AS (
  SELECT DISTINCT public.normalize_email_text(unsubscribe.email) AS email_norm
  FROM public.email_unsubscribes AS unsubscribe
  WHERE public.normalize_email_text(unsubscribe.email) IS NOT NULL

  UNION

  SELECT DISTINCT public.normalize_email_text(signup.email) AS email_norm
  FROM public.signups AS signup
  WHERE signup.unsubscribed_date IS NOT NULL
    AND public.normalize_email_text(signup.email) IS NOT NULL

  UNION

  SELECT DISTINCT public.normalize_email_text(send.recipient_email) AS email_norm
  FROM public.email_sends AS send
  WHERE public.normalize_email_text(send.recipient_email) IS NOT NULL
    AND (send.bounced_at IS NOT NULL OR send.status = 'bounced')
)
SELECT input.email_norm AS email
FROM normalized_input AS input
JOIN suppressed ON suppressed.email_norm = input.email_norm;
$$;

REVOKE ALL ON FUNCTION public.get_suppressed_emails(TEXT[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_suppressed_emails(TEXT[]) TO anon, authenticated, service_role;
