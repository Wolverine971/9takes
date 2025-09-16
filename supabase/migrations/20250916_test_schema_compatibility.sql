-- Test migration to verify schema compatibility
-- This will help identify which tables/columns have issues

-- Test 1: Verify comments table structure
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'comments' AND column_name = 'removed') THEN
        RAISE NOTICE 'comments.removed column exists';
    ELSE
        RAISE NOTICE 'comments.removed column does not exist';
    END IF;
END
$$;

-- Test 2: Verify questions table structure  
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'questions' AND column_name = 'removed') THEN
        RAISE NOTICE 'questions.removed column exists';
    ELSE
        RAISE NOTICE 'questions.removed column does not exist';
    END IF;
END
$$;

-- Test 3: Try creating one index at a time to isolate the issue
-- Start with the most critical one
CREATE INDEX IF NOT EXISTS idx_comments_parent_removed_created_test
ON comments (parent_id, parent_type, removed, created_at DESC);