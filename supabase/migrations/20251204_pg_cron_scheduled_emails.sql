-- supabase/migrations/20251204_pg_cron_scheduled_emails.sql
-- Created: 2025-12-04
-- Sets up pg_cron to process scheduled emails by calling the SvelteKit API endpoint

-- ============================================================================
-- ENABLE EXTENSIONS
-- Note: pg_cron is only available on Supabase Pro plan and above
-- ============================================================================

-- Enable pg_net for HTTP requests from PostgreSQL
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- pg_cron should already be enabled on Pro plans, but ensure it exists
-- Note: You may need to enable this via Supabase Dashboard > Database > Extensions
-- CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- ============================================================================
-- CONFIGURATION TABLE
-- Store the API endpoint and secret for the cron job
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_cron_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Singleton table
  api_endpoint TEXT NOT NULL DEFAULT 'https://9takes.com/api/cron/send-scheduled-emails',
  cron_secret TEXT, -- Store the CRON_SECRET here (set via Supabase Dashboard or SQL)
  enabled BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  last_run_status TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default config (cron_secret should be set separately)
INSERT INTO email_cron_config (api_endpoint, enabled)
VALUES ('https://9takes.com/api/cron/send-scheduled-emails', true)
ON CONFLICT (id) DO NOTHING;

-- Secure the config table
ALTER TABLE email_cron_config ENABLE ROW LEVEL SECURITY;

-- Only allow service role to access config
CREATE POLICY service_email_cron_config ON email_cron_config
  FOR ALL USING (false); -- No direct access via API, use service role

-- ============================================================================
-- FUNCTION: Process scheduled emails via HTTP
-- This function is called by pg_cron to trigger the email sending endpoint
-- ============================================================================
CREATE OR REPLACE FUNCTION process_scheduled_emails()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_config RECORD;
  v_pending_count INTEGER;
  v_request_id BIGINT;
BEGIN
  -- Get config
  SELECT * INTO v_config FROM email_cron_config WHERE id = 1;

  -- Check if enabled
  IF NOT v_config.enabled THEN
    RAISE NOTICE 'Email cron is disabled';
    RETURN;
  END IF;

  -- Check if there are pending emails to send
  SELECT COUNT(*) INTO v_pending_count
  FROM scheduled_emails
  WHERE status = 'pending'
    AND scheduled_for <= NOW();

  IF v_pending_count = 0 THEN
    RAISE NOTICE 'No pending emails to send';
    -- Update last run
    UPDATE email_cron_config
    SET last_run_at = NOW(),
        last_run_status = 'no_pending_emails',
        updated_at = NOW()
    WHERE id = 1;
    RETURN;
  END IF;

  RAISE NOTICE 'Found % pending emails, triggering API', v_pending_count;

  -- Make HTTP request to the API endpoint using pg_net
  -- The request is async, so we just fire and forget
  SELECT net.http_post(
    url := v_config.api_endpoint,
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || COALESCE(v_config.cron_secret, ''),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  ) INTO v_request_id;

  -- Update last run status
  UPDATE email_cron_config
  SET last_run_at = NOW(),
      last_run_status = 'triggered_request_id_' || v_request_id::TEXT,
      updated_at = NOW()
  WHERE id = 1;

  RAISE NOTICE 'HTTP request sent with id: %', v_request_id;
END;
$$;

-- ============================================================================
-- FUNCTION: Alternative - Process emails directly in database
-- This marks emails for processing but requires the app to poll
-- Use this if pg_net is not available
-- ============================================================================
CREATE OR REPLACE FUNCTION mark_emails_ready_for_processing()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Mark pending emails that are due as 'ready'
  -- The application can then poll for 'ready' status emails
  UPDATE scheduled_emails
  SET status = 'processing',
      updated_at = NOW()
  WHERE status = 'pending'
    AND scheduled_for <= NOW()
  RETURNING COUNT(*) INTO v_count;

  RETURN COALESCE(v_count, 0);
END;
$$;

-- ============================================================================
-- CRON JOB SETUP
-- Run these commands AFTER the migration in Supabase SQL Editor
-- ============================================================================
--
-- Step 1: Set your cron secret
-- UPDATE email_cron_config SET cron_secret = 'your-secret-here' WHERE id = 1;
--
-- Step 2: Schedule the job (every minute)
-- SELECT cron.schedule('process-scheduled-emails', '* * * * *', $$SELECT process_scheduled_emails()$$);
--
-- Useful commands:
-- View jobs: SELECT * FROM cron.job;
-- Unschedule: SELECT cron.unschedule('process-scheduled-emails');
-- Job history: SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
-- ============================================================================

-- ============================================================================
-- MONITORING: View pending scheduled emails
-- ============================================================================
CREATE OR REPLACE VIEW email_scheduled_pending AS
SELECT
  id,
  subject,
  jsonb_array_length(recipients) as recipient_count,
  scheduled_for,
  status,
  created_at,
  CASE
    WHEN scheduled_for <= NOW() THEN 'due'
    ELSE 'waiting'
  END as due_status
FROM scheduled_emails
WHERE status = 'pending'
ORDER BY scheduled_for ASC;

-- Grant access to authenticated users (for admin dashboard)
GRANT SELECT ON email_scheduled_pending TO authenticated;

-- ============================================================================
-- MONITORING: Cron job status
-- ============================================================================
CREATE OR REPLACE VIEW email_cron_status AS
SELECT
  enabled,
  last_run_at,
  last_run_status,
  api_endpoint,
  updated_at,
  CASE
    WHEN last_run_at IS NULL THEN 'never_run'
    WHEN last_run_at > NOW() - INTERVAL '2 minutes' THEN 'healthy'
    WHEN last_run_at > NOW() - INTERVAL '10 minutes' THEN 'stale'
    ELSE 'unhealthy'
  END as health_status
FROM email_cron_config
WHERE id = 1;

GRANT SELECT ON email_cron_status TO authenticated;
