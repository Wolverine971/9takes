-- supabase/migrations/20250719_add_comment_count_column.sql
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'questions' 
    AND column_name = 'comment_count'
  ) THEN
    ALTER TABLE questions ADD COLUMN comment_count INTEGER DEFAULT 0;
    
    -- Update existing questions with their comment counts
    UPDATE questions q
    SET comment_count = (
      SELECT COUNT(*)
      FROM comments c
      WHERE c.question_id = q.id
      AND c.removed = false
    );
    
    -- Create trigger to update comment_count when comments are added
    CREATE OR REPLACE FUNCTION update_question_comment_count()
    RETURNS TRIGGER AS $$
    BEGIN
      IF TG_OP = 'INSERT' THEN
        UPDATE questions 
        SET comment_count = comment_count + 1 
        WHERE id = NEW.question_id;
      ELSIF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND NEW.removed = true AND OLD.removed = false) THEN
        UPDATE questions 
        SET comment_count = comment_count - 1 
        WHERE id = COALESCE(OLD.question_id, NEW.question_id);
      ELSIF TG_OP = 'UPDATE' AND NEW.removed = false AND OLD.removed = true THEN
        UPDATE questions 
        SET comment_count = comment_count + 1 
        WHERE id = NEW.question_id;
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    -- Create trigger
    DROP TRIGGER IF EXISTS update_question_comment_count_trigger ON comments;
    CREATE TRIGGER update_question_comment_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_question_comment_count();
  END IF;
END $$;