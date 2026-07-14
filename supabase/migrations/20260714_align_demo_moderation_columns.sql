-- supabase/migrations/20260714_align_demo_moderation_columns.sql
-- Keep the demo moderation tables aligned with the fields already used by the
-- admin comments and questions routes.

ALTER TABLE public.comments_demo
ADD COLUMN IF NOT EXISTS removed BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS removed_at TIMESTAMPTZ;

ALTER TABLE public.questions_demo
ADD COLUMN IF NOT EXISTS tagged BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS flagged BOOLEAN DEFAULT FALSE;
