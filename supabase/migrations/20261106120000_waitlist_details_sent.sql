-- supabase/migrations/20261106120000_waitlist_details_sent.sql
--
-- Tracks whether DJ has sent the experimental therapy details email to a
-- waitlist signup. He sends it by hand from Gmail, then marks it in
-- /admin/consulting. NULL means not sent yet.
ALTER TABLE public.coaching_waitlist
	ADD COLUMN IF NOT EXISTS details_sent_at timestamptz;

COMMENT ON COLUMN public.coaching_waitlist.details_sent_at IS
	'When DJ marked the beta details email as sent (by hand, from Gmail). NULL = not sent.';
