-- supabase/migrations/20260709_email_sequence_send_identity.sql
-- Give every sequence-generated email an immutable sequence identity. Admin
-- analytics can then aggregate by sequence and step instead of editable subject text.

ALTER TABLE public.email_sends
  ADD COLUMN IF NOT EXISTS sequence_id UUID REFERENCES public.email_sequences(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS sequence_enrollment_id UUID REFERENCES public.email_sequence_enrollments(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS sequence_step_number INTEGER;

ALTER TABLE public.email_sends
  DROP CONSTRAINT IF EXISTS email_sends_sequence_step_number_check;

ALTER TABLE public.email_sends
  ADD CONSTRAINT email_sends_sequence_step_number_check
  CHECK (sequence_step_number IS NULL OR sequence_step_number > 0);

CREATE INDEX IF NOT EXISTS idx_email_sends_sequence_step_sent
  ON public.email_sends (sequence_id, sequence_step_number, sent_at DESC)
  WHERE sequence_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_email_sends_sequence_enrollment
  ON public.email_sends (sequence_enrollment_id)
  WHERE sequence_enrollment_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.set_email_send_sequence_identity()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.sequence_enrollment_id IS NULL THEN
    NEW.sequence_id := NULL;
    NEW.sequence_step_number := NULL;
    RETURN NEW;
  END IF;

  SELECT enrollment.sequence_id
  INTO NEW.sequence_id
  FROM public.email_sequence_enrollments AS enrollment
  WHERE enrollment.id = NEW.sequence_enrollment_id;

  IF NEW.sequence_id IS NULL THEN
    RAISE EXCEPTION 'Sequence enrollment not found for email send'
      USING ERRCODE = '23503';
  END IF;

  IF NEW.sequence_step_number IS NULL OR NEW.sequence_step_number <= 0 THEN
    RAISE EXCEPTION 'Sequence step number must be positive'
      USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_email_send_sequence_identity ON public.email_sends;
CREATE TRIGGER trg_email_send_sequence_identity
  BEFORE INSERT OR UPDATE OF sequence_id, sequence_enrollment_id, sequence_step_number
  ON public.email_sends
  FOR EACH ROW
  EXECUTE FUNCTION public.set_email_send_sequence_identity();

-- The enrollment stores its most recently completed send, so existing latest-step
-- rows can be backfilled without making a subject-based guess.
UPDATE public.email_sends AS send
SET sequence_id = enrollment.sequence_id,
    sequence_enrollment_id = enrollment.id,
    sequence_step_number = enrollment.current_step_number
FROM public.email_sequence_enrollments AS enrollment
WHERE enrollment.last_email_send_id = send.id
  AND enrollment.current_step_number > 0
  AND send.sequence_enrollment_id IS NULL;

ALTER TABLE public.email_sends
  DROP CONSTRAINT IF EXISTS email_sends_sequence_step_fkey;

ALTER TABLE public.email_sends
  ADD CONSTRAINT email_sends_sequence_step_fkey
  FOREIGN KEY (sequence_id, sequence_step_number)
  REFERENCES public.email_sequence_steps(sequence_id, step_number)
  ON DELETE SET NULL;

COMMENT ON COLUMN public.email_sends.sequence_id IS
  'Immutable sequence identity for sequence-generated sends; null for manual/transactional sends.';
COMMENT ON COLUMN public.email_sends.sequence_enrollment_id IS
  'Enrollment that produced this send.';
COMMENT ON COLUMN public.email_sends.sequence_step_number IS
  'Sequence step that produced this send.';
