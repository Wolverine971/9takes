-- supabase/migrations/20260709_reactivation_candidate_summary.sql
-- Classify, suppress, deduplicate, count, and page reactivation candidates in
-- Postgres. This keeps the admin preview and enrollment worker from loading the
-- entire profile, suppression, and historical enrollment sets into memory.

CREATE OR REPLACE FUNCTION public.get_reactivation_candidate_summary(
  p_limit INTEGER DEFAULT 200,
  p_buckets TEXT[] DEFAULT ARRAY['cold', 'dormant', 'zombies']::TEXT[]
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_limit INTEGER := LEAST(GREATEST(COALESCE(p_limit, 200), 0), 1000);
  v_buckets TEXT[];
BEGIN
  IF auth.role() IS DISTINCT FROM 'service_role' AND NOT EXISTS (
    SELECT 1
    FROM public.profiles AS actor
    WHERE actor.id = auth.uid()
      AND actor.admin IS TRUE
  ) THEN
    RAISE EXCEPTION 'Administrator access required' USING ERRCODE = '42501';
  END IF;

  SELECT ARRAY_AGG(bucket ORDER BY bucket)
  INTO v_buckets
  FROM (
    SELECT DISTINCT LOWER(value) AS bucket
    FROM UNNEST(COALESCE(p_buckets, ARRAY[]::TEXT[])) AS value
    WHERE LOWER(value) IN ('cold', 'dormant', 'zombies')
  ) AS valid_buckets;

  IF COALESCE(CARDINALITY(v_buckets), 0) = 0 THEN
    v_buckets := ARRAY['cold', 'dormant', 'zombies']::TEXT[];
  END IF;

  RETURN (
    WITH suppressed_emails AS (
      SELECT public.normalize_email_text(unsubscribe.email) AS email
      FROM public.email_unsubscribes AS unsubscribe
      WHERE public.normalize_email_text(unsubscribe.email) IS NOT NULL

      UNION

      SELECT public.normalize_email_text(signup.email) AS email
      FROM public.signups AS signup
      WHERE signup.unsubscribed_date IS NOT NULL
        AND public.normalize_email_text(signup.email) IS NOT NULL
    ),
    relevant_sequences AS (
      SELECT sequence.id
      FROM public.email_sequences AS sequence
      WHERE sequence.key IN (
        'welcome_sequence',
        'reactivation_cold',
        'reactivation_dormant',
        'reactivation_zombies'
      )
    ),
    enrolled_emails AS (
      SELECT DISTINCT public.normalize_email_text(enrollment.recipient_email) AS email
      FROM public.email_sequence_enrollments AS enrollment
      JOIN relevant_sequences AS sequence ON sequence.id = enrollment.sequence_id
      WHERE public.normalize_email_text(enrollment.recipient_email) IS NOT NULL
    ),
    ranked_profiles AS (
      SELECT profile.id,
             profile.email,
             profile.first_name,
             profile.username,
             profile.created_at,
             public.normalize_email_text(profile.email) AS normalized_email,
             ROW_NUMBER() OVER (
               PARTITION BY public.normalize_email_text(profile.email)
               ORDER BY profile.created_at ASC NULLS LAST, profile.id ASC
             ) AS email_rank
      FROM public.profiles AS profile
    ),
    classified_profiles AS (
      SELECT profile.*,
             CASE
               WHEN profile.normalized_email IS NULL
                 OR profile.normalized_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
                 THEN 'invalid_email'
               WHEN profile.created_at IS NULL THEN 'missing_created_at'
               WHEN suppressed.email IS NOT NULL THEN 'suppressed'
               WHEN enrolled.email IS NOT NULL THEN 'already_in_welcome_or_reactivation'
               WHEN profile.created_at > CURRENT_TIMESTAMP - INTERVAL '30 days'
                 THEN 'fresh_under_30_days'
               WHEN profile.email_rank > 1 THEN 'duplicate_profile_email'
               ELSE NULL
             END AS base_skip_reason,
             CASE
               WHEN profile.created_at IS NULL THEN NULL
               WHEN profile.created_at > CURRENT_TIMESTAMP - INTERVAL '90 days' THEN 'cold'
               WHEN profile.created_at > CURRENT_TIMESTAMP - INTERVAL '365 days' THEN 'dormant'
               ELSE 'zombies'
             END AS bucket
      FROM ranked_profiles AS profile
      LEFT JOIN suppressed_emails AS suppressed ON suppressed.email = profile.normalized_email
      LEFT JOIN enrolled_emails AS enrolled ON enrolled.email = profile.normalized_email
    ),
    requested_profiles AS (
      SELECT profile.*,
             CASE
               WHEN profile.base_skip_reason IS NOT NULL THEN profile.base_skip_reason
               WHEN NOT (profile.bucket = ANY(v_buckets))
                 THEN 'bucket_not_requested_' || profile.bucket
               ELSE NULL
             END AS skip_reason,
             CASE profile.bucket
               WHEN 'dormant' THEN 1
               WHEN 'cold' THEN 2
               WHEN 'zombies' THEN 3
               ELSE 4
             END AS bucket_order
      FROM classified_profiles AS profile
    ),
    eligible_profiles AS (
      SELECT profile.*
      FROM requested_profiles AS profile
      WHERE profile.skip_reason IS NULL
    ),
    candidate_page AS (
      SELECT profile.*
      FROM eligible_profiles AS profile
      ORDER BY profile.bucket_order, profile.created_at, profile.id
      LIMIT v_limit
    ),
    skipped_counts AS (
      SELECT profile.skip_reason AS reason, COUNT(*)::BIGINT AS count
      FROM requested_profiles AS profile
      WHERE profile.skip_reason IS NOT NULL
      GROUP BY profile.skip_reason
      ORDER BY profile.skip_reason
    )
    SELECT JSONB_BUILD_OBJECT(
      'limit', v_limit,
      'candidates', COALESCE(
        (
          SELECT JSONB_AGG(
            JSONB_BUILD_OBJECT(
              'userId', candidate.id,
              'email', candidate.normalized_email,
              'name', COALESCE(
                NULLIF(BTRIM(candidate.first_name), ''),
                NULLIF(BTRIM(candidate.username), ''),
                'there'
              ),
              'bucket', candidate.bucket,
              'createdAt', candidate.created_at,
              'ageDays', GREATEST(
                0,
                FLOOR(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - candidate.created_at)) / 86400)::INTEGER
              )
            )
            ORDER BY candidate.bucket_order, candidate.created_at, candidate.id
          )
          FROM candidate_page AS candidate
        ),
        '[]'::JSONB
      ),
      'counts', JSONB_BUILD_OBJECT(
        'cold', (SELECT COUNT(*) FROM eligible_profiles WHERE bucket = 'cold'),
        'dormant', (SELECT COUNT(*) FROM eligible_profiles WHERE bucket = 'dormant'),
        'zombies', (SELECT COUNT(*) FROM eligible_profiles WHERE bucket = 'zombies')
      ),
      'skipped', COALESCE(
        (
          SELECT JSONB_AGG(
            JSONB_BUILD_OBJECT('reason', skipped.reason, 'count', skipped.count)
            ORDER BY skipped.reason
          )
          FROM skipped_counts AS skipped
        ),
        '[]'::JSONB
      ),
      'totalEligible', (SELECT COUNT(*) FROM eligible_profiles),
      'totalProfilesChecked', (SELECT COUNT(*) FROM ranked_profiles)
    )
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_reactivation_candidate_summary(INTEGER, TEXT[])
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_reactivation_candidate_summary(INTEGER, TEXT[])
  TO authenticated, service_role;
