-- supabase/migrations/20260121_email_tracking_analytics_updates.sql
-- Created: 2026-01-21
-- Adds tracking RPCs and expands email analytics fields

-- Update analytics function with additional fields
CREATE OR REPLACE FUNCTION get_email_analytics(
  p_campaign_id UUID DEFAULT NULL,
  p_from_date TIMESTAMPTZ DEFAULT NULL,
  p_to_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'total_sent', COUNT(*) FILTER (WHERE status IN ('sent', 'delivered')),
    'total_opened', COUNT(*) FILTER (WHERE opened_at IS NOT NULL),
    'total_clicked', COUNT(*) FILTER (WHERE clicked_at IS NOT NULL),
    'total_unsubscribed', COUNT(*) FILTER (WHERE unsubscribed_at IS NOT NULL),
    'total_bounced', COUNT(*) FILTER (WHERE status = 'bounced'),
    'total_failed', COUNT(*) FILTER (WHERE status = 'failed'),
    'total_open_count', COALESCE(SUM(open_count), 0),
    'total_click_count', COALESCE(SUM(click_count), 0),
    'open_rate', CASE
      WHEN COUNT(*) FILTER (WHERE status IN ('sent', 'delivered')) > 0
      THEN ROUND(COUNT(*) FILTER (WHERE opened_at IS NOT NULL)::NUMERIC / COUNT(*) FILTER (WHERE status IN ('sent', 'delivered'))::NUMERIC * 100, 2)
      ELSE 0
    END,
    'click_rate', CASE
      WHEN COUNT(*) FILTER (WHERE opened_at IS NOT NULL) > 0
      THEN ROUND(COUNT(*) FILTER (WHERE clicked_at IS NOT NULL)::NUMERIC / COUNT(*) FILTER (WHERE opened_at IS NOT NULL)::NUMERIC * 100, 2)
      ELSE 0
    END,
    'unsubscribe_rate', CASE
      WHEN COUNT(*) FILTER (WHERE status IN ('sent', 'delivered')) > 0
      THEN ROUND(COUNT(*) FILTER (WHERE unsubscribed_at IS NOT NULL)::NUMERIC / COUNT(*) FILTER (WHERE status IN ('sent', 'delivered'))::NUMERIC * 100, 2)
      ELSE 0
    END
  ) INTO v_result
  FROM email_sends
  WHERE (p_campaign_id IS NULL OR campaign_id = p_campaign_id)
    AND (p_from_date IS NULL OR sent_at >= p_from_date)
    AND (p_to_date IS NULL OR sent_at <= p_to_date);

  RETURN v_result;
END;
$$;

-- Tracking event helper (open/click)
CREATE OR REPLACE FUNCTION track_email_event(
  p_tracking_id UUID,
  p_event_type TEXT,
  p_link_url TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_email_send_id UUID;
BEGIN
  IF p_tracking_id IS NULL THEN
    RETURN FALSE;
  END IF;

  SELECT id INTO v_email_send_id
  FROM email_sends
  WHERE tracking_id = p_tracking_id
  LIMIT 1;

  IF v_email_send_id IS NULL THEN
    RETURN FALSE;
  END IF;

  IF p_event_type = 'open' THEN
    UPDATE email_sends
    SET opened_at = COALESCE(opened_at, NOW()),
        open_count = COALESCE(open_count, 0) + 1
    WHERE id = v_email_send_id;
  ELSIF p_event_type = 'click' THEN
    UPDATE email_sends
    SET clicked_at = COALESCE(clicked_at, NOW()),
        click_count = COALESCE(click_count, 0) + 1
    WHERE id = v_email_send_id;
  ELSE
    RETURN FALSE;
  END IF;

  INSERT INTO email_tracking_events (
    email_send_id,
    event_type,
    link_url,
    ip_address,
    user_agent
  ) VALUES (
    v_email_send_id,
    p_event_type,
    p_link_url,
    p_ip_address,
    p_user_agent
  );

  RETURN TRUE;
END;
$$;

-- Unsubscribe helper
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

  INSERT INTO email_unsubscribes (email, source, source_id)
  VALUES (v_email, v_source, v_source_id)
  ON CONFLICT (email) DO NOTHING;

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

GRANT EXECUTE ON FUNCTION track_email_event(UUID, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION track_email_unsubscribe(UUID, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_email_analytics(UUID, TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;
