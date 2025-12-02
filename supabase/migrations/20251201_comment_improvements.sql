-- supabase/migrations/20251201_comment_improvements.sql
-- Created: 2025-12-01
-- Fixes: Rate limiting, atomic comment creation, N+1 queries

-- ============================================================================
-- FIX 1: Rate Limiting Function
-- Checks if a fingerprint/IP has exceeded comment rate limit
-- Returns: true if allowed to comment, false if rate limited
-- ============================================================================
CREATE OR REPLACE FUNCTION check_comment_rate_limit(
  p_fingerprint TEXT,
  p_ip TEXT,
  p_max_comments INTEGER DEFAULT 5,
  p_window_seconds INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Count comments from this fingerprint OR IP in the time window
  -- Using OR ensures we catch users who change fingerprints but keep same IP
  SELECT COUNT(*) INTO v_count
  FROM comments
  WHERE created_at >= NOW() - (p_window_seconds || ' seconds')::INTERVAL
    AND (
      (p_fingerprint IS NOT NULL AND fingerprint = p_fingerprint)
      OR (p_ip IS NOT NULL AND ip = p_ip)
    );

  RETURN v_count < p_max_comments;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION check_comment_rate_limit TO anon, authenticated;


-- ============================================================================
-- FIX 2: Atomic Comment Creation with Count Increment
-- Inserts comment and increments parent count in a single transaction
-- Returns: the inserted comment record
-- ============================================================================
CREATE OR REPLACE FUNCTION create_comment_atomic(
  p_comment TEXT,
  p_parent_id INTEGER,
  p_author_id UUID,
  p_parent_type TEXT,
  p_fingerprint TEXT,
  p_ip TEXT,
  p_es_id TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_comment comments%ROWTYPE;
BEGIN
  -- Insert the new comment
  INSERT INTO comments (
    comment,
    parent_id,
    author_id,
    parent_type,
    fingerprint,
    ip,
    es_id,
    comment_count,
    like_count,
    removed
  )
  VALUES (
    p_comment,
    p_parent_id,
    p_author_id,
    p_parent_type,
    p_fingerprint,
    p_ip,
    p_es_id,
    0,
    0,
    false
  )
  RETURNING * INTO v_new_comment;

  -- If this is a reply to another comment, increment the parent's count
  IF p_parent_type = 'comment' THEN
    UPDATE comments
    SET comment_count = COALESCE(comment_count, 0) + 1
    WHERE id = p_parent_id;
  END IF;

  -- Return the new comment as JSON
  RETURN row_to_json(v_new_comment);
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION create_comment_atomic TO anon, authenticated;


-- ============================================================================
-- FIX 3: Ensure comment_count column has default value and backfill NULLs
-- This eliminates the N+1 COALESCE subquery pattern
-- ============================================================================

-- Set default value for new records
ALTER TABLE questions
ALTER COLUMN comment_count SET DEFAULT 0;

-- Backfill existing NULL values
UPDATE questions
SET comment_count = (
  SELECT COUNT(*)
  FROM comments c
  WHERE c.parent_id = questions.id
    AND c.parent_type = 'question'
    AND c.removed = false
)
WHERE comment_count IS NULL;

-- Make the column NOT NULL to prevent future NULLs
ALTER TABLE questions
ALTER COLUMN comment_count SET NOT NULL;


-- ============================================================================
-- FIX 4: Updated get_questions_page_data without N+1 subqueries
-- Now uses the guaranteed non-null comment_count column directly
-- ============================================================================
CREATE OR REPLACE FUNCTION get_questions_page_data(
  p_user_id UUID DEFAULT NULL,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0,
  p_category_id INTEGER DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_result JSON;
  v_can_ask_question BOOLEAN := FALSE;
  v_questions_count INTEGER;
BEGIN
  -- Check if user can ask questions (limit: 10 per 24 hours)
  IF p_user_id IS NOT NULL THEN
    SELECT COUNT(*) INTO v_questions_count
    FROM questions
    WHERE author_id = p_user_id
      AND removed = FALSE
      AND created_at >= NOW() - INTERVAL '24 hours';

    v_can_ask_question := v_questions_count < 10;
  END IF;

  -- Build the result JSON with all needed data
  -- FIXED: No longer uses COALESCE with subquery for comment_count
  SELECT json_build_object(
    'canAskQuestion', v_can_ask_question,
    'categories', (
      SELECT COALESCE(json_agg(DISTINCT c.*), '[]'::json)
      FROM question_categories c
      WHERE EXISTS (
        SELECT 1 FROM question_tags qt
        JOIN questions q ON qt.question_id = q.id
        WHERE qt.tag_id = c.id AND q.removed = FALSE
      )
    ),
    'questions', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'id', q.id,
          'question', q.question,
          'question_formatted', q.question_formatted,
          'url', q.url,
          'created_at', q.created_at,
          'comment_count', q.comment_count,  -- Direct column access, no subquery
          'author_id', q.author_id,
          'es_id', q.es_id,
          'removed', q.removed,
          'flagged', q.flagged,
          'tag_name', qc.category_name,
          'tag_id', qc.id
        ) ORDER BY q.created_at DESC
      ), '[]'::json)
      FROM questions q
      LEFT JOIN question_tags qt ON q.id = qt.question_id
      LEFT JOIN question_categories qc ON qt.tag_id = qc.id
      WHERE q.removed = FALSE
        AND (p_category_id IS NULL OR qc.id = p_category_id)
      LIMIT p_limit
      OFFSET p_offset
    ),
    'totalQuestions', (
      SELECT COUNT(DISTINCT q.id)
      FROM questions q
      LEFT JOIN question_tags qt ON q.id = qt.question_id
      LEFT JOIN question_categories qc ON qt.tag_id = qc.id
      WHERE q.removed = FALSE
        AND (p_category_id IS NULL OR qc.id = p_category_id)
    ),
    'totalAnswers', (
      SELECT COALESCE(SUM(q.comment_count), 0)  -- Direct column sum, no subquery
      FROM questions q
      LEFT JOIN question_tags qt ON q.id = qt.question_id
      LEFT JOIN question_categories qc ON qt.tag_id = qc.id
      WHERE q.removed = FALSE
        AND (p_category_id IS NULL OR qc.id = p_category_id)
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;


-- ============================================================================
-- FIX 5: Updated get_questions_by_category without N+1 subquery
-- ============================================================================
CREATE OR REPLACE FUNCTION get_questions_by_category(
  p_category_id INTEGER,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id BIGINT,
  question TEXT,
  question_formatted TEXT,
  url TEXT,
  created_at TIMESTAMPTZ,
  comment_count INTEGER,
  author_id UUID,
  es_id VARCHAR,
  tag_name TEXT
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    q.id,
    q.question,
    q.question_formatted,
    q.url,
    q.created_at,
    q.comment_count,  -- Direct column access, no subquery
    q.author_id,
    q.es_id,
    qc.category_name as tag_name
  FROM questions q
  JOIN question_tags qt ON q.id = qt.question_id
  JOIN question_categories qc ON qt.tag_id = qc.id
  WHERE q.removed = FALSE
    AND qc.id = p_category_id
  ORDER BY q.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;


-- ============================================================================
-- FIX 6: Trigger to maintain question comment_count automatically
-- This ensures the denormalized count stays in sync
-- ============================================================================
CREATE OR REPLACE FUNCTION update_question_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Only count top-level comments (parent_type = 'question')
    IF NEW.parent_type = 'question' AND NEW.removed = false THEN
      UPDATE questions
      SET comment_count = comment_count + 1
      WHERE id = NEW.parent_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle removal/unremoval of comments
    IF OLD.removed = false AND NEW.removed = true AND NEW.parent_type = 'question' THEN
      UPDATE questions
      SET comment_count = GREATEST(comment_count - 1, 0)
      WHERE id = NEW.parent_id;
    ELSIF OLD.removed = true AND NEW.removed = false AND NEW.parent_type = 'question' THEN
      UPDATE questions
      SET comment_count = comment_count + 1
      WHERE id = NEW.parent_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.parent_type = 'question' AND OLD.removed = false THEN
      UPDATE questions
      SET comment_count = GREATEST(comment_count - 1, 0)
      WHERE id = OLD.parent_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trg_update_question_comment_count ON comments;

-- Create the trigger
CREATE TRIGGER trg_update_question_comment_count
AFTER INSERT OR UPDATE OF removed OR DELETE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_question_comment_count();


-- ============================================================================
-- FIX 7: Add index for rate limiting queries
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_comments_fingerprint_created
ON comments (fingerprint, created_at DESC)
WHERE fingerprint IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_comments_ip_created
ON comments (ip, created_at DESC)
WHERE ip IS NOT NULL;
