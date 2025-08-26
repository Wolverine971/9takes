-- supabase/migrations/20250719_optimize_questions_page.sql
CREATE OR REPLACE FUNCTION get_questions_page_data(
  p_user_id UUID DEFAULT NULL,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0,
  p_category_id INTEGER DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
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
          'comment_count', COALESCE(q.comment_count, (
            SELECT COUNT(*) FROM comments c 
            WHERE c.question_id = q.id AND c.removed = false
          )),
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
      SELECT COALESCE(SUM(
        COALESCE(q.comment_count, (
          SELECT COUNT(*) FROM comments c 
          WHERE c.question_id = q.id AND c.removed = false
        ))
      ), 0)
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

-- Optimized function for paginated questions by category
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
    COALESCE(q.comment_count, (
      SELECT COUNT(*) FROM comments c 
      WHERE c.question_id = q.id AND c.removed = false
    )) as comment_count,
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_questions_page_data TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_questions_by_category TO anon, authenticated;