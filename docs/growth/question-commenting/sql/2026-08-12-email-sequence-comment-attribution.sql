-- Privacy-safe email sequence -> question participation report.
-- Run through ./scripts/db-query.sh. Results contain aggregates only.
--
-- Attribution rule: assign each confirmed comment to the most recent sequence
-- send to the same profile in the preceding seven days. Match signed-in comments
-- by profile id and anonymous comments only through profiles.first_touch_fingerprint.
-- This is a last-touch operating report, not a causal estimate.

WITH sequence_sends AS (
  SELECT
    send.id AS send_id,
    sequence.key AS sequence_key,
    send.sequence_step_number AS step_number,
    send.sent_at,
    send.status,
    send.open_count,
    send.click_count,
    send.bounced_at,
    send.unsubscribed_at,
    profile.id AS profile_id,
    profile.first_touch_fingerprint
  FROM public.email_sends AS send
  JOIN public.email_sequences AS sequence
    ON sequence.id = send.sequence_id
  LEFT JOIN LATERAL (
    SELECT candidate.id, candidate.first_touch_fingerprint
    FROM public.profiles AS candidate
    WHERE (
        send.recipient_source = 'profiles'
        AND candidate.id::TEXT = send.recipient_source_id
      )
      OR LOWER(BTRIM(candidate.email)) = LOWER(BTRIM(send.recipient_email))
    ORDER BY
      CASE
        WHEN send.recipient_source = 'profiles'
          AND candidate.id::TEXT = send.recipient_source_id THEN 0
        ELSE 1
      END,
      candidate.created_at
    LIMIT 1
  ) AS profile ON TRUE
  WHERE send.sent_at IS NOT NULL
    AND sequence.key IN (
      'welcome_sequence',
      'reactivation_cold',
      'reactivation_dormant',
      'reactivation_zombies'
    )
), send_events AS (
  SELECT
    event.email_send_id AS send_id,
    BOOL_OR(event.event_type = 'open') AS opened,
    BOOL_OR(event.event_type = 'click') AS clicked,
    BOOL_OR(event.event_type = 'unsubscribe') AS unsubscribed,
    BOOL_OR(event.event_type = 'bounce') AS bounced
  FROM public.email_tracking_events AS event
  GROUP BY event.email_send_id
), email_rollup AS (
  SELECT
    send.sequence_key,
    send.step_number,
    COUNT(*) AS sends,
    COUNT(*) FILTER (
      WHERE NOT (
        COALESCE(event.bounced, FALSE)
        OR send.status = 'bounced'
        OR send.bounced_at IS NOT NULL
      )
    ) AS delivered_or_non_bounced_sends,
    COUNT(DISTINCT send.profile_id) AS recipients_sent,
    COUNT(DISTINCT send.profile_id) FILTER (
      WHERE COALESCE(event.opened, FALSE) OR COALESCE(send.open_count, 0) > 0
    ) AS unique_openers_directional,
    COUNT(DISTINCT send.profile_id) FILTER (
      WHERE COALESCE(event.clicked, FALSE) OR COALESCE(send.click_count, 0) > 0
    ) AS unique_clickers,
    COUNT(DISTINCT send.profile_id) FILTER (
      WHERE COALESCE(event.unsubscribed, FALSE) OR send.unsubscribed_at IS NOT NULL
    ) AS unsubscribers,
    COUNT(*) FILTER (
      WHERE COALESCE(event.bounced, FALSE)
        OR send.status = 'bounced'
        OR send.bounced_at IS NOT NULL
    ) AS bounced_sends
  FROM sequence_sends AS send
  LEFT JOIN send_events AS event ON event.send_id = send.send_id
  GROUP BY send.sequence_key, send.step_number
), attributed_comment_candidates AS (
  SELECT
    comment.id AS comment_id,
    comment.created_at AS comment_created_at,
    comment.parent_id,
    comment.parent_type,
    send.send_id,
    send.sequence_key,
    send.step_number,
    send.profile_id,
    send.sent_at,
    comment.created_at - send.sent_at AS time_after_send,
    timezone('America/New_York', comment.created_at)::DATE AS comment_day,
    ROW_NUMBER() OVER (
      PARTITION BY comment.id
      ORDER BY send.sent_at DESC, send.send_id
    ) AS attribution_rank
  FROM public.comments AS comment
  JOIN sequence_sends AS send
    ON send.profile_id IS NOT NULL
   AND comment.created_at >= send.sent_at
   AND comment.created_at <= send.sent_at + INTERVAL '7 days'
   AND (
      comment.author_id = send.profile_id
      OR (
        comment.author_id IS NULL
        AND send.first_touch_fingerprint IS NOT NULL
        AND comment.fingerprint = send.first_touch_fingerprint
      )
   )
  WHERE COALESCE(comment.removed, FALSE) = FALSE
), attributed_comments AS (
  SELECT *
  FROM attributed_comment_candidates
  WHERE attribution_rank = 1
), actor_step_rollup AS (
  SELECT
    sequence_key,
    step_number,
    profile_id,
    COUNT(*) FILTER (WHERE time_after_send <= INTERVAL '24 hours') AS comments_within_24_hours,
    COUNT(*) AS comments_within_7_days,
    COUNT(DISTINCT parent_id) FILTER (
      WHERE parent_type = 'question'
    ) AS questions_answered_within_7_days,
    COUNT(DISTINCT comment_day) AS comment_days_within_7_days
  FROM attributed_comments
  GROUP BY sequence_key, step_number, profile_id
), comment_rollup AS (
  SELECT
    sequence_key,
    step_number,
    COUNT(*) FILTER (WHERE comments_within_24_hours > 0) AS commenters_within_24_hours,
    COUNT(*) FILTER (WHERE comments_within_7_days > 0) AS commenters_within_7_days,
    SUM(comments_within_24_hours) AS confirmed_comments_within_24_hours,
    SUM(comments_within_7_days) AS confirmed_comments_within_7_days,
    ROUND(
      SUM(questions_answered_within_7_days)::NUMERIC
      / NULLIF(COUNT(*) FILTER (WHERE comments_within_7_days > 0), 0),
      2
    ) AS questions_answered_per_commenter_7_days,
    COUNT(*) FILTER (WHERE comment_days_within_7_days > 1) AS later_day_repeat_commenters
  FROM actor_step_rollup
  GROUP BY sequence_key, step_number
), attributed_question_landings AS (
  SELECT
    CASE
      WHEN visit.utm_source = 'welcome'
        AND visit.utm_campaign = 'welcome-sequence'
        THEN 'welcome_sequence'
      WHEN visit.utm_source = 'reactivation'
        AND visit.utm_campaign = 'reactivation-sequence'
        THEN SPLIT_PART(visit.utm_content, '_step_', 1)
    END AS sequence_key,
    NULLIF(
      SUBSTRING(visit.utm_content FROM '_step_([0-9]+)_link_'),
      ''
    )::INTEGER AS step_number,
    COALESCE(visit.user_id::TEXT, visit.fingerprint) AS visitor_key
  FROM public.page_analytics_visits AS visit
  WHERE visit.utm_content ~ '_step_[0-9]+_link_[0-9]+$'
    AND (
      visit.content_type = 'question'
      OR (
        visit.path ~ '^/questions/[^/]+/?$'
        AND visit.path NOT IN ('/questions/create', '/questions/create/')
      )
    )
), landing_rollup AS (
  SELECT
    sequence_key,
    step_number,
    COUNT(DISTINCT visitor_key) AS unique_question_page_landings
  FROM attributed_question_landings
  WHERE sequence_key IS NOT NULL
    AND step_number IS NOT NULL
    AND visitor_key IS NOT NULL
  GROUP BY sequence_key, step_number
), report_steps AS (
  SELECT sequence.key AS sequence_key, step.step_number
  FROM public.email_sequences AS sequence
  JOIN public.email_sequence_steps AS step ON step.sequence_id = sequence.id
  WHERE sequence.key IN (
    'welcome_sequence',
    'reactivation_cold',
    'reactivation_dormant',
    'reactivation_zombies'
  )
)
SELECT
  report.sequence_key,
  report.step_number,
  COALESCE(email.recipients_sent, 0) AS recipients_sent,
  COALESCE(email.sends, 0) AS sends,
  COALESCE(email.delivered_or_non_bounced_sends, 0) AS delivered_or_non_bounced_sends,
  COALESCE(email.unique_openers_directional, 0) AS unique_openers_directional,
  COALESCE(email.unique_clickers, 0) AS unique_clickers,
  COALESCE(landing.unique_question_page_landings, 0) AS unique_question_page_landings,
  COALESCE(comment.commenters_within_24_hours, 0) AS commenters_within_24_hours,
  COALESCE(comment.commenters_within_7_days, 0) AS commenters_within_7_days,
  COALESCE(comment.confirmed_comments_within_24_hours, 0) AS confirmed_comments_within_24_hours,
  COALESCE(comment.confirmed_comments_within_7_days, 0) AS confirmed_comments_within_7_days,
  comment.questions_answered_per_commenter_7_days,
  COALESCE(comment.later_day_repeat_commenters, 0) AS later_day_repeat_commenters,
  COALESCE(email.unsubscribers, 0) AS unsubscribers,
  COALESCE(email.bounced_sends, 0) AS bounced_sends
FROM report_steps AS report
LEFT JOIN email_rollup AS email
  USING (sequence_key, step_number)
LEFT JOIN landing_rollup AS landing
  USING (sequence_key, step_number)
LEFT JOIN comment_rollup AS comment
  USING (sequence_key, step_number)
ORDER BY report.sequence_key, report.step_number;

-- Current reactivation inventory for the closeout decision. "Expected remaining"
-- assumes every active/processing enrollment continues through its final step.
WITH sequence_limits AS (
  SELECT sequence_id, MAX(step_number) AS final_step_number
  FROM public.email_sequence_steps
  GROUP BY sequence_id
), send_events AS (
  SELECT
    event.email_send_id AS send_id,
    BOOL_OR(event.event_type = 'click') AS clicked,
    BOOL_OR(event.event_type = 'unsubscribe') AS unsubscribed,
    BOOL_OR(event.event_type = 'bounce') AS bounced
  FROM public.email_tracking_events AS event
  GROUP BY event.email_send_id
), observed_email AS (
  SELECT
    sequence.key AS sequence_key,
    COUNT(*) FILTER (WHERE send.sent_at IS NOT NULL) AS sends_to_date,
    COUNT(DISTINCT send.recipient_source_id) FILTER (
      WHERE COALESCE(event.clicked, FALSE) OR COALESCE(send.click_count, 0) > 0
    ) AS unique_clickers_to_date,
    COUNT(DISTINCT send.recipient_source_id) FILTER (
      WHERE COALESCE(event.unsubscribed, FALSE) OR send.unsubscribed_at IS NOT NULL
    ) AS unsubscribers_to_date,
    COUNT(*) FILTER (
      WHERE COALESCE(event.bounced, FALSE)
        OR send.status = 'bounced'
        OR send.bounced_at IS NOT NULL
    ) AS bounced_sends_to_date
  FROM public.email_sends AS send
  JOIN public.email_sequences AS sequence ON sequence.id = send.sequence_id
  LEFT JOIN send_events AS event ON event.send_id = send.id
  WHERE sequence.key LIKE 'reactivation_%'
  GROUP BY sequence.key
), inventory AS (
  SELECT
    sequence.key AS sequence_key,
    sequence.status AS sequence_status,
    COUNT(*) FILTER (
      WHERE enrollment.status IN ('active', 'processing')
    ) AS remaining_recipients,
    COALESCE(SUM(
      GREATEST(sequence_limit.final_step_number - enrollment.current_step_number, 0)
    ) FILTER (
      WHERE enrollment.status IN ('active', 'processing')
    ), 0) AS expected_remaining_sends,
    COUNT(*) FILTER (WHERE enrollment.status = 'exited') AS exited_recipients,
    COUNT(*) FILTER (WHERE enrollment.status = 'errored') AS errored_recipients
  FROM public.email_sequences AS sequence
  JOIN sequence_limits AS sequence_limit ON sequence_limit.sequence_id = sequence.id
  LEFT JOIN public.email_sequence_enrollments AS enrollment
    ON enrollment.sequence_id = sequence.id
  WHERE sequence.key LIKE 'reactivation_%'
  GROUP BY sequence.key, sequence.status
)
SELECT
  inventory.sequence_key,
  inventory.sequence_status,
  inventory.remaining_recipients,
  inventory.expected_remaining_sends,
  COALESCE(email.sends_to_date, 0) AS sends_to_date,
  COALESCE(email.unique_clickers_to_date, 0) AS unique_clickers_to_date,
  COALESCE(email.unsubscribers_to_date, 0) AS unsubscribers_to_date,
  COALESCE(email.bounced_sends_to_date, 0) AS bounced_sends_to_date,
  inventory.exited_recipients,
  inventory.errored_recipients
FROM inventory
LEFT JOIN observed_email AS email USING (sequence_key)
ORDER BY inventory.sequence_key;
