-- supabase/migrations/20260421_reactivation_email_sequence.sql
-- Created: 2026-04-21
-- Adds profiles-only reactivation sequence definitions and send-time metadata.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS re_permissioned_at TIMESTAMPTZ;

DO $seed$
DECLARE
  v_sequence_id UUID;
  v_sequence RECORD;
BEGIN
  FOR v_sequence IN
    SELECT *
    FROM (VALUES
      (
        'reactivation_cold',
        'Reactivation - Cold (30-90d)',
        'Profiles-only reactivation for accounts created 30-89 days before enrollment.'
      ),
      (
        'reactivation_dormant',
        'Reactivation - Dormant (90-365d)',
        'Profiles-only reactivation for accounts created 90-364 days before enrollment.'
      ),
      (
        'reactivation_zombies',
        'Reactivation - Zombies (365+d)',
        'Profiles-only reactivation for accounts created at least 365 days before enrollment.'
      )
    ) AS sequences(key, display_name, description)
  LOOP
    INSERT INTO email_sequences (
      key,
      display_name,
      description,
      trigger_type,
      status,
      created_at,
      updated_at
    )
    VALUES (
      v_sequence.key,
      v_sequence.display_name,
      v_sequence.description,
      'manual',
      'draft',
      NOW(),
      NOW()
    )
    ON CONFLICT (key) DO UPDATE
      SET display_name = EXCLUDED.display_name,
          description = EXCLUDED.description,
          trigger_type = EXCLUDED.trigger_type,
          updated_at = NOW()
    RETURNING id INTO v_sequence_id;

    INSERT INTO email_sequence_steps (
      sequence_id,
      step_number,
      delay_days_after_previous,
      subject,
      html_content,
      plain_text,
      created_at,
      updated_at
    )
    VALUES
      (
        v_sequence_id,
        1,
        0,
        'Reactivation step 1',
        '<p>Code-managed reactivation content. See src/lib/email/reactivation-sequence-content.ts.</p>',
        'Code-managed reactivation content. See src/lib/email/reactivation-sequence-content.ts.',
        NOW(),
        NOW()
      ),
      (
        v_sequence_id,
        2,
        5,
        'Reactivation step 2',
        '<p>Code-managed reactivation content. See src/lib/email/reactivation-sequence-content.ts.</p>',
        'Code-managed reactivation content. See src/lib/email/reactivation-sequence-content.ts.',
        NOW(),
        NOW()
      ),
      (
        v_sequence_id,
        3,
        7,
        'Reactivation step 3',
        '<p>Code-managed reactivation content. See src/lib/email/reactivation-sequence-content.ts.</p>',
        'Code-managed reactivation content. See src/lib/email/reactivation-sequence-content.ts.',
        NOW(),
        NOW()
      ),
      (
        v_sequence_id,
        4,
        7,
        'Reactivation step 4',
        '<p>Code-managed reactivation content. See src/lib/email/reactivation-sequence-content.ts.</p>',
        'Code-managed reactivation content. See src/lib/email/reactivation-sequence-content.ts.',
        NOW(),
        NOW()
      ),
      (
        v_sequence_id,
        5,
        5,
        'Reactivation step 5',
        '<p>Code-managed reactivation content. See src/lib/email/reactivation-sequence-content.ts.</p>',
        'Code-managed reactivation content. See src/lib/email/reactivation-sequence-content.ts.',
        NOW(),
        NOW()
      )
    ON CONFLICT (sequence_id, step_number) DO UPDATE
      SET delay_days_after_previous = EXCLUDED.delay_days_after_previous,
          subject = EXCLUDED.subject,
          html_content = EXCLUDED.html_content,
          plain_text = EXCLUDED.plain_text,
          updated_at = NOW();
  END LOOP;
END;
$seed$;

-- These functions return TABLE(...) via OUT parameters. Postgres cannot
-- change that row shape with CREATE OR REPLACE, so drop before recreating.
DROP FUNCTION IF EXISTS claim_pending_sequence_sends(INTEGER);
DROP FUNCTION IF EXISTS claim_specific_sequence_send(UUID);

CREATE OR REPLACE FUNCTION claim_pending_sequence_sends(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  enrollment_id UUID,
  sequence_key TEXT,
  user_id UUID,
  recipient_email TEXT,
  recipient_source TEXT,
  recipient_source_id TEXT,
  recipient_name TEXT,
  enneagram TEXT,
  enrolled_at TIMESTAMPTZ,
  recipient_created_at TIMESTAMPTZ,
  step_number INTEGER,
  subject TEXT,
  html_content TEXT,
  plain_text TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE email_sequence_enrollments
  SET status = 'errored',
      next_send_at = NULL,
      processing_started_at = NULL,
      last_error = 'Sequence processing timed out before completion',
      updated_at = NOW()
  WHERE status = 'processing'
    AND processing_started_at IS NOT NULL
    AND processing_started_at < NOW() - INTERVAL '2 hours';

  RETURN QUERY
  WITH due AS (
    SELECT e.id
    FROM email_sequence_enrollments e
    JOIN email_sequences s ON s.id = e.sequence_id
    WHERE e.status = 'active'
      AND e.next_send_at IS NOT NULL
      AND e.next_send_at <= NOW()
      AND s.status = 'active'
    ORDER BY e.next_send_at ASC
    FOR UPDATE SKIP LOCKED
    LIMIT GREATEST(COALESCE(p_limit, 10), 0)
  ),
  claimed AS (
    UPDATE email_sequence_enrollments e
    SET status = 'processing',
        processing_started_at = NOW(),
        updated_at = NOW()
    FROM due
    WHERE e.id = due.id
    RETURNING e.*
  )
  SELECT
    c.id AS enrollment_id,
    s.key AS sequence_key,
    c.user_id,
    c.recipient_email,
    c.recipient_source,
    c.recipient_source_id,
    COALESCE(NULLIF(p.first_name, ''), NULLIF(p.username, ''), 'there') AS recipient_name,
    p.enneagram,
    c.enrolled_at,
    p.created_at AS recipient_created_at,
    st.step_number,
    st.subject,
    st.html_content,
    st.plain_text
  FROM claimed c
  JOIN email_sequences s ON s.id = c.sequence_id
  JOIN email_sequence_steps st
    ON st.sequence_id = c.sequence_id
   AND st.step_number = c.next_step_number
  LEFT JOIN profiles p ON p.id = c.user_id
  ORDER BY c.next_send_at ASC;
END;
$$;

CREATE OR REPLACE FUNCTION claim_specific_sequence_send(p_enrollment_id UUID)
RETURNS TABLE (
  enrollment_id UUID,
  sequence_key TEXT,
  user_id UUID,
  recipient_email TEXT,
  recipient_source TEXT,
  recipient_source_id TEXT,
  recipient_name TEXT,
  enneagram TEXT,
  enrolled_at TIMESTAMPTZ,
  recipient_created_at TIMESTAMPTZ,
  step_number INTEGER,
  subject TEXT,
  html_content TEXT,
  plain_text TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE email_sequence_enrollments
  SET status = 'errored',
      next_send_at = NULL,
      processing_started_at = NULL,
      last_error = 'Sequence processing timed out before completion',
      updated_at = NOW()
  WHERE status = 'processing'
    AND processing_started_at IS NOT NULL
    AND processing_started_at < NOW() - INTERVAL '2 hours';

  RETURN QUERY
  WITH due AS (
    SELECT e.id
    FROM email_sequence_enrollments e
    JOIN email_sequences s ON s.id = e.sequence_id
    WHERE e.id = p_enrollment_id
      AND e.status = 'active'
      AND e.next_send_at IS NOT NULL
      AND e.next_send_at <= NOW()
      AND s.status = 'active'
    FOR UPDATE SKIP LOCKED
    LIMIT 1
  ),
  claimed AS (
    UPDATE email_sequence_enrollments e
    SET status = 'processing',
        processing_started_at = NOW(),
        updated_at = NOW()
    FROM due
    WHERE e.id = due.id
    RETURNING e.*
  )
  SELECT
    c.id AS enrollment_id,
    s.key AS sequence_key,
    c.user_id,
    c.recipient_email,
    c.recipient_source,
    c.recipient_source_id,
    COALESCE(NULLIF(p.first_name, ''), NULLIF(p.username, ''), 'there') AS recipient_name,
    p.enneagram,
    c.enrolled_at,
    p.created_at AS recipient_created_at,
    st.step_number,
    st.subject,
    st.html_content,
    st.plain_text
  FROM claimed c
  JOIN email_sequences s ON s.id = c.sequence_id
  JOIN email_sequence_steps st
    ON st.sequence_id = c.sequence_id
   AND st.step_number = c.next_step_number
  LEFT JOIN profiles p ON p.id = c.user_id
  ORDER BY c.next_send_at ASC;
END;
$$;

CREATE OR REPLACE FUNCTION complete_sequence_send(
  p_enrollment_id UUID,
  p_email_send_id UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sequence_id UUID;
  v_sequence_key TEXT;
  v_completed_step INTEGER;
  v_recipient_email TEXT;
  v_recipient_source TEXT;
  v_recipient_source_id TEXT;
  v_next_step_number INTEGER;
  v_next_delay INTEGER;
BEGIN
  SELECT e.sequence_id,
         s.key,
         e.next_step_number,
         e.recipient_email,
         e.recipient_source,
         e.recipient_source_id
    INTO v_sequence_id,
         v_sequence_key,
         v_completed_step,
         v_recipient_email,
         v_recipient_source,
         v_recipient_source_id
  FROM email_sequence_enrollments e
  JOIN email_sequences s ON s.id = e.sequence_id
  WHERE e.id = p_enrollment_id
    AND e.status = 'processing'
  LIMIT 1;

  IF v_sequence_id IS NULL OR v_completed_step IS NULL THEN
    RETURN;
  END IF;

  SELECT step_number, delay_days_after_previous
    INTO v_next_step_number, v_next_delay
  FROM email_sequence_steps
  WHERE sequence_id = v_sequence_id
    AND step_number > v_completed_step
  ORDER BY step_number ASC
  LIMIT 1;

  IF v_next_step_number IS NULL THEN
    UPDATE email_sequence_enrollments
    SET current_step_number = v_completed_step,
        next_step_number = NULL,
        next_send_at = NULL,
        last_sent_at = NOW(),
        last_email_send_id = p_email_send_id,
        processing_started_at = NULL,
        failure_count = 0,
        status = 'completed',
        exit_reason = 'completed',
        last_error = NULL,
        updated_at = NOW()
    WHERE id = p_enrollment_id
      AND status = 'processing';

    IF v_sequence_key LIKE 'reactivation_%' AND v_completed_step >= 5 THEN
      INSERT INTO email_unsubscribes (
        email,
        source,
        source_id,
        reason,
        unsubscribed_at
      )
      VALUES (
        normalize_email_text(v_recipient_email),
        v_recipient_source,
        v_recipient_source_id,
        'reactivation_completed_no_response',
        NOW()
      )
      ON CONFLICT (email) DO NOTHING;
    END IF;
  ELSE
    UPDATE email_sequence_enrollments
    SET current_step_number = v_completed_step,
        next_step_number = v_next_step_number,
        next_send_at = NOW() + make_interval(days => COALESCE(v_next_delay, 0)),
        last_sent_at = NOW(),
        last_email_send_id = p_email_send_id,
        processing_started_at = NULL,
        failure_count = 0,
        status = 'active',
        last_error = NULL,
        updated_at = NOW()
    WHERE id = p_enrollment_id
      AND status = 'processing';
  END IF;
END;
$$;
