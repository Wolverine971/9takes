-- Migration to add change tracking for blogs_famous_people table
-- This tracks the last 5 changes to the 'content' column only

-- Create the history table
CREATE TABLE IF NOT EXISTS blogs_famous_people_history (
    id SERIAL PRIMARY KEY,
    famous_people_id INTEGER NOT NULL REFERENCES blogs_famous_people(id) ON DELETE CASCADE,
    old_content TEXT,
    new_content TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    changed_by UUID REFERENCES auth.users(id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_blogs_famous_people_history_famous_people_id 
ON blogs_famous_people_history(famous_people_id);

CREATE INDEX IF NOT EXISTS idx_blogs_famous_people_history_changed_at 
ON blogs_famous_people_history(changed_at DESC);

-- Function to clean up old history records (keep only last 5 per record)
CREATE OR REPLACE FUNCTION cleanup_blogs_famous_people_history(p_famous_people_id INTEGER)
RETURNS VOID AS $$
BEGIN
    -- Delete all but the 5 most recent history records for this famous person
    DELETE FROM blogs_famous_people_history
    WHERE famous_people_id = p_famous_people_id
    AND id NOT IN (
        SELECT id
        FROM blogs_famous_people_history
        WHERE famous_people_id = p_famous_people_id
        ORDER BY changed_at DESC
        LIMIT 5
    );
END;
$$ LANGUAGE plpgsql;

-- Trigger function to track content changes
CREATE OR REPLACE FUNCTION track_blogs_famous_people_content_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Only track changes if the content column has actually changed
    IF OLD.content IS DISTINCT FROM NEW.content THEN
        -- Insert the change record
        INSERT INTO blogs_famous_people_history (
            famous_people_id,
            old_content,
            new_content,
            changed_by
        ) VALUES (
            NEW.id,
            OLD.content,
            NEW.content,
            auth.uid()  -- This gets the current user's UUID from Supabase auth
        );
        
        -- Clean up old history records to keep only the last 5
        PERFORM cleanup_blogs_famous_people_history(NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_blogs_famous_people_content_changes ON blogs_famous_people;
CREATE TRIGGER trigger_blogs_famous_people_content_changes
    AFTER UPDATE ON blogs_famous_people
    FOR EACH ROW
    EXECUTE FUNCTION track_blogs_famous_people_content_changes();

-- Grant necessary permissions
GRANT SELECT ON blogs_famous_people_history TO authenticated;
GRANT SELECT ON blogs_famous_people_history TO anon;