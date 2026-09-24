-- supabase/migrations/20260924120000_coaching_waitlist_bot_flags.sql
--
-- Flag the Nov 19 – Dec 1 2025 coaching-waitlist bot wave (DJ, 2026-09-24).
--
-- Evidence (verified 2026-09-23/24): all 14 rows have random mixed-case letter
-- strings as names ("fJHGFyAJDgAbEKCfse"), the same malformed user agent (it
-- starts with a stray double quote, which real browsers never send), and a
-- different IP each time from hosting/proxy ranges. The 5 that also created
-- 9takes accounts did so about a minute before signing up and never logged in.
-- The email addresses belong to real third parties (signup bombing), so these
-- people must never be emailed.
--
-- 1. Adds a visible flag on coaching_waitlist (the admin shows a "Bot" badge and
--    hides "convert to client").
-- 2. Adds each address to email_unsubscribes, the list every campaign, scheduled
--    and sequence send already checks (same convention as the 2026-06-19
--    signups quarantine). Addresses already blocked keep their existing reason.
-- Idempotent: safe to re-run.

ALTER TABLE public.coaching_waitlist
	ADD COLUMN IF NOT EXISTS flagged_reason TEXT,
	ADD COLUMN IF NOT EXISTS flagged_at TIMESTAMPTZ;

WITH bot_wave(id) AS (
	VALUES
		('923d51cb-4dc4-4293-ae13-308963e60ba6'::uuid),
		('7b5aec50-d542-4adc-8e48-343f635e1e0d'::uuid),
		('4f666fea-530f-4246-bceb-0b0fa3a935f7'::uuid),
		('aea2bc46-fac1-49aa-80cf-fdc5d746e95d'::uuid),
		('9ceae1d9-de34-4395-9bd0-c075442cb197'::uuid),
		('e99c406b-b5de-467d-a08f-f208343831d0'::uuid),
		('2ac12890-f2f4-4fa8-a6e6-ebd4a76b3f66'::uuid),
		('160d3040-22b0-4eba-806e-3345ad1d6ce4'::uuid),
		('26ae0609-cec0-48af-94fe-465ed6dc6f1c'::uuid),
		('2e8ccc04-3301-46bd-9bc7-e6669e3e08fe'::uuid),
		('eea8ae91-c898-44d1-887e-930a22dff0ea'::uuid),
		('92fb4d8f-3c7e-4bb6-9dfe-8d13604a2e7a'::uuid),
		('58ee943a-af44-4d6a-b963-432ce29bfad1'::uuid),
		('965e12c2-b970-4aff-89bf-481559e4a94f'::uuid)
),
flagged AS (
	UPDATE public.coaching_waitlist w
	SET flagged_reason = 'bot_signup_wave_2025_11',
		flagged_at = COALESCE(w.flagged_at, now())
	FROM bot_wave b
	WHERE w.id = b.id
	RETURNING w.id, w.email
)
INSERT INTO public.email_unsubscribes (email, source, source_id, reason)
SELECT lower(btrim(f.email)), 'coaching_waitlist', f.id::text, 'bot_submitted_quarantine_2026-09-24'
FROM flagged f
ON CONFLICT (email) DO NOTHING;

NOTIFY pgrst, 'reload schema';
