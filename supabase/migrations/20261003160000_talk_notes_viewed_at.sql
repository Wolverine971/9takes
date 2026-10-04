-- supabase/migrations/20261003160000_talk_notes_viewed_at.sql
-- "Seen" state for Talk to DJ notes.
--
-- Why: the admin badge counted every note with status 'new', i.e. every note DJ
-- had not replied to, so it stayed lit after he had read a note. viewed_at marks
-- the first time DJ saw a note's full text (the notes inbox, or expanding it on
-- the dashboard). The badge now counts unseen notes only; status keeps meaning
-- the reply workflow (new = open, replied, archived).
--
-- Notes already replied to or archived were necessarily read, so they are
-- backfilled as seen. Open notes stay unseen until DJ opens them.

ALTER TABLE public.talk_notes
	ADD COLUMN IF NOT EXISTS viewed_at TIMESTAMPTZ;

UPDATE public.talk_notes
SET viewed_at = COALESCE(replied_at, updated_at)
WHERE status <> 'new'
	AND viewed_at IS NULL;
