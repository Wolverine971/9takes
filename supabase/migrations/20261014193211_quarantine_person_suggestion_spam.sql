-- Preserve the confirmed September 29–October 14 bot wave outside the live
-- suggestion queue. No email addresses or spam payloads are stored in Git.
CREATE SCHEMA IF NOT EXISTS private;

CREATE TABLE IF NOT EXISTS private.person_suggestion_quarantine (
	id bigint PRIMARY KEY,
	created_at timestamptz,
	person_name text,
	email text,
	quarantined_at timestamptz NOT NULL DEFAULT now(),
	reason text NOT NULL
);

ALTER TABLE private.person_suggestion_quarantine ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE private.person_suggestion_quarantine FROM PUBLIC, anon, authenticated, service_role;

INSERT INTO private.person_suggestion_quarantine (id, created_at, person_name, email, reason)
SELECT id, created_at, person_name, email, '2026-10-14 confirmed automated person suggestion spam'
FROM public.person_suggestions
WHERE id BETWEEN 19 AND 97
	AND created_at >= '2026-09-29T00:00:00Z'
	AND created_at < '2026-10-15T00:00:00Z'
	AND person_name ~ '^[A-Za-z]{14,}$'
	AND person_name ~ '[a-z][A-Z]'
ON CONFLICT (id) DO NOTHING;

-- Only remove a row if the complete original was preserved successfully.
DELETE FROM public.person_suggestions AS suggestion
USING private.person_suggestion_quarantine AS quarantined
WHERE suggestion.id = quarantined.id
	AND suggestion.created_at IS NOT DISTINCT FROM quarantined.created_at
	AND suggestion.person_name IS NOT DISTINCT FROM quarantined.person_name
	AND suggestion.email IS NOT DISTINCT FROM quarantined.email
	AND quarantined.reason = '2026-10-14 confirmed automated person suggestion spam';

-- Recovery (run deliberately as the database owner if a record needs restoring):
-- INSERT INTO public.person_suggestions (id, created_at, person_name, email)
-- OVERRIDING SYSTEM VALUE
-- SELECT id, created_at, person_name, email
-- FROM private.person_suggestion_quarantine WHERE id = <reviewed_id>;
-- Keep the quarantine copy as the incident audit trail.
