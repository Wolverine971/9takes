-- supabase/migrations/20260117_add_persona_title_column.sql
-- Adds a unique persona_title column for famous people
-- This is a unique 9takes nickname that encapsulates the person, their personality, and their Enneagram type
-- Example: Joe Rogan (Type 8) might be "The Relentless Interrogator"

-- Add the persona_title column
ALTER TABLE blogs_famous_people
ADD COLUMN IF NOT EXISTS persona_title TEXT;

-- Add a comment explaining the column
COMMENT ON COLUMN blogs_famous_people.persona_title IS 'Unique 9takes persona title that encapsulates the person and their Enneagram type (e.g., "The Relentless Machine" for Alex Hormozi)';

-- Create an index for potential lookups/filtering by persona_title
CREATE INDEX IF NOT EXISTS idx_blogs_famous_people_persona_title
ON blogs_famous_people(persona_title);
