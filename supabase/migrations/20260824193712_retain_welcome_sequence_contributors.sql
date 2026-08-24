-- supabase/migrations/20260824193712_retain_welcome_sequence_contributors.sql
-- Contributions are activation, not a reason to stop nurturing someone.
-- Restore the narrowly affected welcome enrollments before the application
-- stops creating these exits. Preserve their next step and make it due now.
UPDATE public.email_sequence_enrollments AS enrollment
SET status = 'active',
    exit_reason = NULL,
    next_send_at = NOW(),
    processing_started_at = NULL,
    last_error = NULL,
    updated_at = NOW()
FROM public.email_sequences AS sequence
WHERE sequence.id = enrollment.sequence_id
  AND sequence.key = 'welcome_sequence'
  AND enrollment.status = 'exited'
  AND enrollment.exit_reason IN ('answered_question', 'created_comment')
  AND enrollment.next_step_number IS NOT NULL;
