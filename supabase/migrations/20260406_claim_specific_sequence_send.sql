-- supabase/migrations/20260406_claim_specific_sequence_send.sql
-- Created: 2026-04-06
-- Allows a newly enrolled welcome-sequence recipient to be claimed and sent immediately.

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
