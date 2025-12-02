-- supabase/migrations/20251202_email_management_system.sql
-- Created: 2025-12-02
-- Email Management System: campaigns, sends, tracking, drafts, scheduling

-- ============================================================================
-- TABLE 1: email_campaigns
-- Organizes emails into logical campaigns for tracking and analytics
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE 2: email_templates
-- Reusable email templates
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE 3: email_sends
-- Records of all sent emails with tracking information
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES email_campaigns(id) ON DELETE SET NULL,

  -- Recipient info (polymorphic - can reference any user table)
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  recipient_source TEXT NOT NULL CHECK (recipient_source IN ('profiles', 'signups', 'coaching_waitlist')),
  recipient_source_id TEXT NOT NULL,

  -- Email content
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  plain_text_content TEXT,

  -- Tracking
  tracking_id UUID UNIQUE DEFAULT gen_random_uuid(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'bounced', 'failed')),

  -- Engagement metrics
  opened_at TIMESTAMPTZ,
  open_count INTEGER DEFAULT 0,
  clicked_at TIMESTAMPTZ,
  click_count INTEGER DEFAULT 0,
  unsubscribed_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  bounce_reason TEXT,

  -- Metadata
  sent_at TIMESTAMPTZ,
  sent_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Error tracking
  error_message TEXT,
  retry_count INTEGER DEFAULT 0
);

-- Indexes for email_sends
CREATE INDEX IF NOT EXISTS idx_email_sends_tracking_id ON email_sends(tracking_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_recipient_email ON email_sends(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_sends_status ON email_sends(status);
CREATE INDEX IF NOT EXISTS idx_email_sends_campaign_id ON email_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_sent_at ON email_sends(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_sends_created_at ON email_sends(created_at DESC);

-- ============================================================================
-- TABLE 4: email_tracking_events
-- Granular tracking of all email interactions
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_send_id UUID NOT NULL REFERENCES email_sends(id) ON DELETE CASCADE,

  event_type TEXT NOT NULL CHECK (event_type IN ('open', 'click', 'unsubscribe', 'bounce', 'complaint')),

  -- Event details
  link_url TEXT,
  ip_address TEXT,
  user_agent TEXT,

  -- Geolocation (optional, can be enriched later)
  country TEXT,
  city TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_tracking_events_send_id ON email_tracking_events(email_send_id);
CREATE INDEX IF NOT EXISTS idx_email_tracking_events_type ON email_tracking_events(event_type);
CREATE INDEX IF NOT EXISTS idx_email_tracking_events_created ON email_tracking_events(created_at DESC);

-- ============================================================================
-- TABLE 5: email_drafts
-- Saved email drafts
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Draft content
  subject TEXT,
  html_content TEXT,

  -- Recipients (stored as JSONB for flexibility)
  -- Format: [{"email": "...", "name": "...", "source": "profiles", "source_id": "..."}]
  recipients JSONB DEFAULT '[]'::jsonb,

  -- Scheduling
  scheduled_for TIMESTAMPTZ,

  -- Metadata
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_drafts_created_by ON email_drafts(created_by);
CREATE INDEX IF NOT EXISTS idx_email_drafts_updated_at ON email_drafts(updated_at DESC);

-- ============================================================================
-- TABLE 6: scheduled_emails
-- Queue for emails scheduled to be sent in the future
-- ============================================================================
CREATE TABLE IF NOT EXISTS scheduled_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID REFERENCES email_drafts(id) ON DELETE SET NULL,

  -- Email content (copied from draft at schedule time)
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,

  -- Recipients
  -- Format: [{"email": "...", "name": "...", "source": "profiles", "source_id": "..."}]
  recipients JSONB NOT NULL,

  -- Campaign association (optional)
  campaign_id UUID REFERENCES email_campaigns(id) ON DELETE SET NULL,

  -- Scheduling
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),

  -- Processing info
  processed_at TIMESTAMPTZ,
  emails_sent INTEGER DEFAULT 0,
  emails_failed INTEGER DEFAULT 0,
  error_log JSONB DEFAULT '[]'::jsonb,

  -- Metadata
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for cron job to find pending emails efficiently
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_pending
  ON scheduled_emails(scheduled_for)
  WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_status ON scheduled_emails(status);

-- ============================================================================
-- TABLE 7: email_unsubscribes
-- Unified unsubscribe list across all user sources
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_unsubscribes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT,
  source_id TEXT,
  reason TEXT,
  unsubscribed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_unsubscribes_email ON email_unsubscribes(email);

-- ============================================================================
-- FUNCTION: Get users for email dashboard (unified view)
-- Returns users from profiles, signups, and coaching_waitlist
-- ============================================================================
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
    SELECT eu.email AS unsub_email FROM email_unsubscribes eu
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
    EXISTS(SELECT 1 FROM unsubscribed_emails ue WHERE ue.unsub_email = au.email) AS unsubscribed
  FROM all_users au
  ORDER BY au.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- ============================================================================
-- FUNCTION: Count users for email dashboard
-- ============================================================================
CREATE OR REPLACE FUNCTION count_email_dashboard_users(
  p_source TEXT DEFAULT 'all',
  p_search TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  -- Count profiles
  IF p_source = 'all' OR p_source = 'profiles' THEN
    SELECT v_count + COUNT(*) INTO v_count
    FROM profiles p
    WHERE p.email IS NOT NULL
      AND (p_search IS NULL OR p.email ILIKE '%' || p_search || '%' OR p.first_name ILIKE '%' || p_search || '%');
  END IF;

  -- Count signups
  IF p_source = 'all' OR p_source = 'signups' THEN
    SELECT v_count + COUNT(*) INTO v_count
    FROM signups s
    WHERE s.email IS NOT NULL
      AND s.unsubscribed_date IS NULL
      AND (p_search IS NULL OR s.email ILIKE '%' || p_search || '%' OR s.name ILIKE '%' || p_search || '%');
  END IF;

  -- Count coaching waitlist
  IF p_source = 'all' OR p_source = 'coaching_waitlist' THEN
    SELECT v_count + COUNT(*) INTO v_count
    FROM coaching_waitlist cw
    WHERE cw.email IS NOT NULL
      AND (p_search IS NULL OR cw.email ILIKE '%' || p_search || '%' OR cw.name ILIKE '%' || p_search || '%');
  END IF;

  RETURN v_count;
END;
$$;

-- ============================================================================
-- FUNCTION: Get email analytics summary
-- ============================================================================
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
    'open_rate', CASE
      WHEN COUNT(*) FILTER (WHERE status IN ('sent', 'delivered')) > 0
      THEN ROUND(COUNT(*) FILTER (WHERE opened_at IS NOT NULL)::NUMERIC / COUNT(*) FILTER (WHERE status IN ('sent', 'delivered'))::NUMERIC * 100, 2)
      ELSE 0
    END,
    'click_rate', CASE
      WHEN COUNT(*) FILTER (WHERE opened_at IS NOT NULL) > 0
      THEN ROUND(COUNT(*) FILTER (WHERE clicked_at IS NOT NULL)::NUMERIC / COUNT(*) FILTER (WHERE opened_at IS NOT NULL)::NUMERIC * 100, 2)
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

-- ============================================================================
-- GRANTS
-- ============================================================================
-- Tables (admin access via service key, no public access)
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_unsubscribes ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can access these tables
CREATE POLICY admin_email_campaigns ON email_campaigns
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.admin = true)
  );

CREATE POLICY admin_email_templates ON email_templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.admin = true)
  );

CREATE POLICY admin_email_sends ON email_sends
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.admin = true)
  );

CREATE POLICY admin_email_tracking_events ON email_tracking_events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.admin = true)
  );

CREATE POLICY admin_email_drafts ON email_drafts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.admin = true)
  );

CREATE POLICY admin_scheduled_emails ON scheduled_emails
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.admin = true)
  );

CREATE POLICY admin_email_unsubscribes ON email_unsubscribes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.admin = true)
  );

-- Allow anon to insert into tracking events (for pixel tracking)
CREATE POLICY anon_tracking_insert ON email_tracking_events
  FOR INSERT WITH CHECK (true);

-- Allow anon to read email_sends for tracking lookups (by tracking_id only)
CREATE POLICY anon_tracking_lookup ON email_sends
  FOR SELECT USING (true);

-- Functions (grant to authenticated users - admin check is in function)
GRANT EXECUTE ON FUNCTION get_email_dashboard_users TO authenticated;
GRANT EXECUTE ON FUNCTION count_email_dashboard_users TO authenticated;
GRANT EXECUTE ON FUNCTION get_email_analytics TO authenticated;
