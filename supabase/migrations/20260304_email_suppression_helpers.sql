-- supabase/migrations/20260304_email_suppression_helpers.sql
-- Created: 2026-03-04
-- Adds normalized suppression helpers and one-click-safe unsubscribe plumbing.

-- Normalize email safely in SQL.
CREATE OR REPLACE FUNCTION normalize_email_text(p_email TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT NULLIF(lower(trim(COALESCE(p_email, ''))), '');
$$;

-- Unified direct unsubscribe helper for non-tracking flows (legacy pages, admin tools).
CREATE OR REPLACE FUNCTION unsubscribe_email_direct(
  p_email TEXT,
  p_source TEXT DEFAULT NULL,
  p_source_id TEXT DEFAULT NULL,
  p_reason TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_email TEXT;
BEGIN
  v_email := normalize_email_text(p_email);
  IF v_email IS NULL THEN
    RETURN NULL;
  END IF;

  INSERT INTO email_unsubscribes (email, source, source_id, reason)
  VALUES (v_email, p_source, p_source_id, p_reason)
  ON CONFLICT (email) DO NOTHING;

  -- Keep legacy signup suppression in sync for backwards-compatibility.
  UPDATE signups
  SET unsubscribed_date = COALESCE(unsubscribed_date, NOW())
  WHERE normalize_email_text(email) = v_email;

  RETURN v_email;
END;
$$;

-- Returns normalized suppressed emails for a candidate input list.
-- Includes both modern suppression table and legacy signups.unsubscribed_date.
CREATE OR REPLACE FUNCTION get_suppressed_emails(p_emails TEXT[])
RETURNS TABLE (
  email TEXT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
WITH normalized_input AS (
  SELECT DISTINCT normalize_email_text(value) AS email_norm
  FROM unnest(COALESCE(p_emails, ARRAY[]::TEXT[])) AS value
  WHERE normalize_email_text(value) IS NOT NULL
),
suppressed AS (
  SELECT DISTINCT normalize_email_text(eu.email) AS email_norm
  FROM email_unsubscribes eu
  WHERE normalize_email_text(eu.email) IS NOT NULL
  UNION
  SELECT DISTINCT normalize_email_text(s.email) AS email_norm
  FROM signups s
  WHERE s.unsubscribed_date IS NOT NULL
    AND normalize_email_text(s.email) IS NOT NULL
)
SELECT ni.email_norm AS email
FROM normalized_input ni
JOIN suppressed s ON s.email_norm = ni.email_norm;
$$;

-- Refresh dashboard user function to use normalized suppression checks.
CREATE OR REPLACE FUNCTION get_email_dashboard_users(
  p_source TEXT DEFAULT 'all',
  p_search TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id TEXT,
  email TEXT,
  name TEXT,
  source TEXT,
  created_at TIMESTAMPTZ,
  enneagram TEXT,
  unsubscribed BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  WITH unsubscribed_emails AS (
    SELECT normalize_email_text(eu.email) AS unsub_email
    FROM email_unsubscribes eu
    WHERE normalize_email_text(eu.email) IS NOT NULL
    UNION
    SELECT normalize_email_text(s.email) AS unsub_email
    FROM signups s
    WHERE s.unsubscribed_date IS NOT NULL
      AND normalize_email_text(s.email) IS NOT NULL
  ),
  all_users AS (
    -- Profiles
    SELECT
      p.id::TEXT,
      p.email,
      COALESCE(p.first_name || ' ' || p.last_name, p.username, '') AS name,
      'profiles'::TEXT AS source,
      p.created_at,
      p.enneagram
    FROM profiles p
    WHERE p.email IS NOT NULL
      AND (p_source = 'all' OR p_source = 'profiles')
      AND (p_search IS NULL OR p.email ILIKE '%' || p_search || '%' OR p.first_name ILIKE '%' || p_search || '%' OR p.last_name ILIKE '%' || p_search || '%')

    UNION ALL

    -- Signups
    SELECT
      s.id::TEXT,
      s.email,
      COALESCE(s.name, '') AS name,
      'signups'::TEXT AS source,
      s.created_at,
      NULL::TEXT AS enneagram
    FROM signups s
    WHERE s.email IS NOT NULL
      AND s.unsubscribed_date IS NULL
      AND (p_source = 'all' OR p_source = 'signups')
      AND (p_search IS NULL OR s.email ILIKE '%' || p_search || '%' OR s.name ILIKE '%' || p_search || '%')

    UNION ALL

    -- Coaching Waitlist
    SELECT
      cw.id::TEXT,
      cw.email,
      COALESCE(cw.name, '') AS name,
      'coaching_waitlist'::TEXT AS source,
      cw.created_at,
      cw.enneagram_type AS enneagram
    FROM coaching_waitlist cw
    WHERE cw.email IS NOT NULL
      AND (p_source = 'all' OR p_source = 'coaching_waitlist')
      AND (p_search IS NULL OR cw.email ILIKE '%' || p_search || '%' OR cw.name ILIKE '%' || p_search || '%')
  )
  SELECT
    au.id,
    au.email,
    au.name,
    au.source,
    au.created_at,
    au.enneagram,
    EXISTS(
      SELECT 1
      FROM unsubscribed_emails ue
      WHERE ue.unsub_email = normalize_email_text(au.email)
    ) AS unsubscribed
  FROM all_users au
  ORDER BY au.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Backfill legacy unsubscribed signups into unified suppression table.
INSERT INTO email_unsubscribes (email, source, source_id, reason, unsubscribed_at)
SELECT
  normalize_email_text(s.email) AS email,
  'signups'::TEXT AS source,
  s.id::TEXT AS source_id,
  'legacy_signup_unsubscribe_backfill'::TEXT AS reason,
  s.unsubscribed_date
FROM signups s
WHERE s.unsubscribed_date IS NOT NULL
  AND normalize_email_text(s.email) IS NOT NULL
ON CONFLICT (email) DO NOTHING;

-- Rebind tracking unsubscribe helper to use unified unsubscribe_email_direct.
CREATE OR REPLACE FUNCTION track_email_unsubscribe(
  p_tracking_id UUID,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
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

  SELECT id, recipient_email, recipient_source, recipient_source_id
    INTO v_email_send_id, v_email, v_source, v_source_id
  FROM email_sends
  WHERE tracking_id = p_tracking_id
  LIMIT 1;

  IF v_email_send_id IS NULL THEN
    RETURN NULL;
  END IF;

  v_email := unsubscribe_email_direct(v_email, v_source, v_source_id, 'tracking_unsubscribe');
  IF v_email IS NULL THEN
    RETURN NULL;
  END IF;

  UPDATE email_sends
  SET unsubscribed_at = COALESCE(unsubscribed_at, NOW())
  WHERE id = v_email_send_id;

  INSERT INTO email_tracking_events (
    email_send_id,
    event_type,
    ip_address,
    user_agent
  ) VALUES (
    v_email_send_id,
    'unsubscribe',
    p_ip_address,
    p_user_agent
  );

  RETURN v_email;
END;
$$;

GRANT EXECUTE ON FUNCTION normalize_email_text(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION unsubscribe_email_direct(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_suppressed_emails(TEXT[]) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION track_email_unsubscribe(UUID, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_email_dashboard_users(TEXT, TEXT, INTEGER, INTEGER) TO authenticated;
