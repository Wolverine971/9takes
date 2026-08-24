-- supabase/migrations/20260824193611_persist_strategic_question_self_reported_type.sql
-- Keep the reader's own type separate from the model-inferred resonant type.
-- nine_user_takes is already server-write-only with RLS enabled.
ALTER TABLE public.nine_user_takes
  ADD COLUMN IF NOT EXISTS self_reported_type SMALLINT
  CHECK (self_reported_type BETWEEN 1 AND 9);

COMMENT ON COLUMN public.nine_user_takes.self_reported_type IS
  'Enneagram type selected by the contributor after the Chorus reveal; never model-inferred.';

CREATE INDEX IF NOT EXISTS idx_nine_user_takes_self_reported_type
  ON public.nine_user_takes (self_reported_type, created_at DESC)
  WHERE self_reported_type IS NOT NULL;
