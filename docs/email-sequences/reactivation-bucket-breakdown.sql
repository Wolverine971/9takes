-- docs/email-sequences/reactivation-bucket-breakdown.sql
-- Reactivation campaign: bucket-size diagnostics.
-- Run in the Supabase SQL editor. Read-only (SELECTs only, no side effects).
--
-- Produces three outputs:
--   1. Per-bucket candidate counts (Cold / Dormant / Zombies / Fresh-excluded)
--   2. Source breakdown per bucket (kept for historical shape; should be profiles only)
--   3. A deduped candidate preview (first 20 rows) to sanity-check the join logic
--
-- Bucket definitions (by signup age relative to NOW()):
--   Fresh (excluded):  < 30 days      — still in welcome-sequence territory
--   Cold:              30–89 days     — recent enough to remember us
--   Dormant:           90–364 days    — "here's what 9takes has become"
--   Zombies:           365+ days      — re-permission framing
--
-- Exclusion rules applied:
--   - normalized, non-null emails
--   - NOT in email_unsubscribes
--   - NOT already enrolled in welcome_sequence (any status)
--   - NOT already enrolled in any reactivation_* sequence
--
-- Scope: profiles only. Email-only signups are warm content leads and use
-- docs/email-sequences/signups-reengagement-flow.md instead.

---------------------------------------------------------------------
-- Candidate CTE: profiles-only, deduped, filtered list
---------------------------------------------------------------------
WITH normalized_profiles AS (
  SELECT
    LOWER(TRIM(p.email)) AS email,
    p.created_at,
    p.first_name,
    p.enneagram,
    p.id::text AS source_id,
    'profiles'::text AS source
  FROM profiles p
  WHERE p.email IS NOT NULL
    AND TRIM(p.email) <> ''
    AND p.created_at IS NOT NULL
),
deduped_profiles AS (
  SELECT DISTINCT ON (email) *
  FROM normalized_profiles
  ORDER BY email, created_at ASC
),
-- Exclude suppressed emails
non_suppressed AS (
  SELECT u.*
  FROM deduped_profiles u
  WHERE NOT EXISTS (
    SELECT 1 FROM email_unsubscribes eu
    WHERE LOWER(TRIM(eu.email)) = u.email
  )
),
-- Exclude anyone already enrolled in welcome_sequence or any reactivation sequence
sequence_enrolled_emails AS (
  SELECT DISTINCT LOWER(TRIM(ese.recipient_email)) AS email
  FROM email_sequence_enrollments ese
  JOIN email_sequences es ON es.id = ese.sequence_id
  WHERE es.key = 'welcome_sequence'
     OR es.key LIKE 'reactivation_%'
),
candidates AS (
  SELECT ns.*
  FROM non_suppressed ns
  WHERE NOT EXISTS (
    SELECT 1 FROM sequence_enrolled_emails se WHERE se.email = ns.email
  )
),
-- Bucket assignment
bucketed AS (
  SELECT
    c.*,
    EXTRACT(DAY FROM (NOW() - c.created_at))::int AS age_days,
    CASE
      WHEN c.created_at > NOW() - INTERVAL '30 days'  THEN 'fresh_excluded'
      WHEN c.created_at > NOW() - INTERVAL '90 days'  THEN 'cold'
      WHEN c.created_at > NOW() - INTERVAL '365 days' THEN 'dormant'
      ELSE 'zombies'
    END AS bucket
  FROM candidates c
)

---------------------------------------------------------------------
-- OUTPUT 1: Per-bucket candidate counts
---------------------------------------------------------------------
SELECT
  bucket,
  COUNT(*) AS candidates,
  MIN(age_days) AS min_age_days,
  MAX(age_days) AS max_age_days
FROM bucketed
GROUP BY bucket
ORDER BY CASE bucket
  WHEN 'cold' THEN 1
  WHEN 'dormant' THEN 2
  WHEN 'zombies' THEN 3
  WHEN 'fresh_excluded' THEN 4
END;

---------------------------------------------------------------------
-- OUTPUT 2: Source breakdown per bucket (re-run this separately)
---------------------------------------------------------------------
-- SELECT
--   bucket,
--   source,
--   COUNT(*) AS candidates
-- FROM bucketed
-- GROUP BY bucket, source
-- ORDER BY bucket, source;

---------------------------------------------------------------------
-- OUTPUT 3: Sanity-check sample (re-run this separately)
---------------------------------------------------------------------
-- SELECT bucket, age_days, source, email, first_name, enneagram, created_at
-- FROM bucketed
-- WHERE bucket <> 'fresh_excluded'
-- ORDER BY created_at DESC
-- LIMIT 20;
