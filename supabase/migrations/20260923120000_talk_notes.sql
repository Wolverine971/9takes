-- supabase/migrations/20260923120000_talk_notes.sql
--
-- "Talk to DJ" notes: the note-first coaching page at /book-session.
--
-- Step 1: a visitor leaves a note (typed, or a voice note that is transcribed).
--         The row is created immediately, anonymous, with only the note.
-- Step 2: optional details on the same row: an email for a private reply, and
--         "I want a free 1-on-1 session" (which also creates a coaching_waitlist
--         row so the existing /admin/consulting pipeline sees them).
-- Reply:  DJ answers from /admin/consulting/notes with text and/or a recorded voice
--         note. The sender gets an email linking to /talk/reply/[reply_token].
--
-- Safety: nothing here is reachable from anon/authenticated. Every read and
-- write goes through server code with the service role. details_token and
-- reply_token are random, single-purpose credentials. IPs are stored only as a
-- salted hash, because these notes are meant to be anonymous. Audio lives in a
-- private bucket and is only ever served through short-lived signed URLs.

CREATE TABLE IF NOT EXISTS public.talk_notes (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	body TEXT NOT NULL CHECK (char_length(btrim(body)) BETWEEN 1 AND 5000),
	input_mode TEXT NOT NULL DEFAULT 'text' CHECK (input_mode IN ('text', 'voice')),
	audio_path TEXT,
	audio_mime TEXT,
	audio_seconds INTEGER CHECK (audio_seconds IS NULL OR audio_seconds >= 0),

	-- Step 2 (all optional)
	details_token TEXT NOT NULL UNIQUE,
	details_submitted_at TIMESTAMPTZ,
	email TEXT,
	name TEXT,
	wants_session BOOLEAN NOT NULL DEFAULT false,
	waitlist_id UUID REFERENCES public.coaching_waitlist (id) ON DELETE SET NULL,

	-- DJ's reply
	status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'replied', 'archived')),
	reply_text TEXT,
	reply_audio_path TEXT,
	reply_audio_mime TEXT,
	reply_token TEXT UNIQUE,
	replied_at TIMESTAMPTZ,
	reply_email_sent_at TIMESTAMPTZ,

	-- Attribution + abuse signals (no raw IPs)
	source_path TEXT,
	referrer TEXT,
	utm JSONB,
	ip_hash TEXT,
	user_agent TEXT,

	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS talk_notes_status_created_at_idx
	ON public.talk_notes (status, created_at DESC);

CREATE INDEX IF NOT EXISTS talk_notes_ip_hash_created_at_idx
	ON public.talk_notes (ip_hash, created_at DESC);

ALTER TABLE public.talk_notes ENABLE ROW LEVEL SECURITY;

-- No policies on purpose: only the service role (server code) touches this table.
REVOKE ALL ON public.talk_notes FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.talk_notes TO service_role;

-- Private audio bucket: visitor voice notes (notes/) and DJ's replies (replies/).
-- No storage policies, so only the service role can read or write objects.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
	'talk-notes',
	'talk-notes',
	false,
	5242880,
	ARRAY['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg', 'audio/aac', 'audio/wav']
)
ON CONFLICT (id) DO UPDATE
	SET public = false,
		file_size_limit = EXCLUDED.file_size_limit,
		allowed_mime_types = EXCLUDED.allowed_mime_types;

NOTIFY pgrst, 'reload schema';
