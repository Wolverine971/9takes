-- supabase/migrations/20251204_blog_search_system.sql
-- Full-text search system for all blog content

-- ============================================
-- 1. CREATE blogs_content TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blogs_content (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    author TEXT DEFAULT 'DJ Wayne',
    date DATE,
    lastmod TIMESTAMPTZ,
    changefreq TEXT DEFAULT 'weekly',
    priority TEXT DEFAULT '0.6',
    published BOOLEAN DEFAULT false,
    blog BOOLEAN DEFAULT true,
    enneagram INTEGER CHECK (enneagram >= 1 AND enneagram <= 9),
    type TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    category TEXT,
    loc TEXT,
    url TEXT,
    pic TEXT,
    path TEXT,
    search_vector TSVECTOR,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_blogs_content_slug ON blogs_content(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_content_published ON blogs_content(published);
CREATE INDEX IF NOT EXISTS idx_blogs_content_enneagram ON blogs_content(enneagram);
CREATE INDEX IF NOT EXISTS idx_blogs_content_category ON blogs_content(category);
CREATE INDEX IF NOT EXISTS idx_blogs_content_type ON blogs_content USING GIN(type);
CREATE INDEX IF NOT EXISTS idx_blogs_content_tags ON blogs_content USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blogs_content_lastmod ON blogs_content(lastmod DESC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_blogs_content_search ON blogs_content USING GIN(search_vector);

-- ============================================
-- 2. ADD SEARCH TO blogs_famous_people
-- ============================================
ALTER TABLE blogs_famous_people
ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;

ALTER TABLE blogs_famous_people
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

ALTER TABLE blogs_famous_people
ADD COLUMN IF NOT EXISTS category TEXT;

-- Full-text search index for famous people
CREATE INDEX IF NOT EXISTS idx_blogs_famous_people_search ON blogs_famous_people USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_blogs_famous_people_tags ON blogs_famous_people USING GIN(tags);

-- ============================================
-- 3. HELPER FUNCTION FOR JSONB TO TEXT
-- ============================================

-- Helper function to convert jsonb array to space-separated text
-- This handles the case where type column is jsonb in blogs_famous_people
CREATE OR REPLACE FUNCTION jsonb_array_to_text(arr jsonb)
RETURNS TEXT AS $$
BEGIN
    IF arr IS NULL THEN
        RETURN '';
    END IF;
    RETURN COALESCE(
        (SELECT string_agg(elem::text, ' ')
         FROM jsonb_array_elements_text(arr) AS elem),
        ''
    );
EXCEPTION WHEN OTHERS THEN
    -- If it's not a valid jsonb array, just cast to text
    RETURN COALESCE(arr::text, '');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- 4. FUNCTIONS TO UPDATE SEARCH VECTORS
-- ============================================

-- Function to generate search vector for blogs_content (uses TEXT[] arrays)
CREATE OR REPLACE FUNCTION blogs_content_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.type, ' '), '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'C');

    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate search vector for blogs_famous_people (uses JSONB for type)
CREATE OR REPLACE FUNCTION blogs_famous_people_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.person, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', jsonb_array_to_text(NEW.type)), 'B') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'C');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. TRIGGERS TO AUTO-UPDATE SEARCH VECTORS
-- ============================================

-- Trigger for blogs_content
DROP TRIGGER IF EXISTS trigger_blogs_content_search_update ON blogs_content;
CREATE TRIGGER trigger_blogs_content_search_update
    BEFORE INSERT OR UPDATE ON blogs_content
    FOR EACH ROW
    EXECUTE FUNCTION blogs_content_search_vector_update();

-- Trigger for blogs_famous_people
DROP TRIGGER IF EXISTS trigger_blogs_famous_people_search_update ON blogs_famous_people;
CREATE TRIGGER trigger_blogs_famous_people_search_update
    BEFORE INSERT OR UPDATE ON blogs_famous_people
    FOR EACH ROW
    EXECUTE FUNCTION blogs_famous_people_search_vector_update();

-- ============================================
-- 6. UNIFIED SEARCH FUNCTION
-- ============================================

-- Search function that queries both tables
CREATE OR REPLACE FUNCTION search_all_blogs(
    search_query TEXT,
    filter_enneagram INTEGER DEFAULT NULL,
    filter_category TEXT DEFAULT NULL,
    filter_type TEXT DEFAULT NULL,
    result_limit INTEGER DEFAULT 20,
    result_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id INTEGER,
    source TEXT,
    slug TEXT,
    title TEXT,
    description TEXT,
    enneagram INTEGER,
    type JSONB,
    tags TEXT[],
    category TEXT,
    lastmod TIMESTAMPTZ,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    WITH all_results AS (
        -- Search blogs_content
        SELECT
            bc.id,
            'content'::TEXT as source,
            bc.slug,
            bc.title,
            bc.description,
            bc.enneagram::INTEGER,
            to_jsonb(bc.type) as type,
            bc.tags,
            bc.category,
            bc.lastmod,
            ts_rank(bc.search_vector, websearch_to_tsquery('english', search_query)) as rank
        FROM blogs_content bc
        WHERE bc.published = true
            AND bc.search_vector @@ websearch_to_tsquery('english', search_query)
            AND (filter_enneagram IS NULL OR bc.enneagram = filter_enneagram)
            AND (filter_category IS NULL OR bc.category = filter_category)
            AND (filter_type IS NULL OR filter_type = ANY(bc.type))

        UNION ALL

        -- Search blogs_famous_people (type is already jsonb)
        SELECT
            bfp.id,
            'famous_people'::TEXT as source,
            bfp.person as slug,
            bfp.title,
            bfp.description,
            bfp.enneagram::INTEGER,
            bfp.type,
            bfp.tags,
            bfp.category,
            bfp.lastmod::TIMESTAMPTZ,
            ts_rank(bfp.search_vector, websearch_to_tsquery('english', search_query)) as rank
        FROM blogs_famous_people bfp
        WHERE bfp.published = true
            AND bfp.search_vector @@ websearch_to_tsquery('english', search_query)
            AND (filter_enneagram IS NULL OR bfp.enneagram::INTEGER = filter_enneagram)
            AND (filter_category IS NULL OR bfp.category = filter_category)
            AND (filter_type IS NULL OR bfp.type ? filter_type)
    )
    SELECT * FROM all_results
    ORDER BY all_results.rank DESC, all_results.lastmod DESC NULLS LAST
    LIMIT result_limit
    OFFSET result_offset;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. BACKFILL SEARCH VECTORS FOR EXISTING DATA
-- ============================================

-- Update existing blogs_famous_people to generate search vectors
-- Using jsonb_array_to_text helper for the type column
UPDATE blogs_famous_people
SET search_vector =
    setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(person, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
    setweight(to_tsvector('english', jsonb_array_to_text(type)), 'B') ||
    setweight(to_tsvector('english', COALESCE(content, '')), 'C')
WHERE search_vector IS NULL;

-- ============================================
-- 8. PERMISSIONS
-- ============================================
GRANT SELECT ON blogs_content TO anon;
GRANT SELECT ON blogs_content TO authenticated;
GRANT ALL ON blogs_content TO service_role;

-- Enable RLS
ALTER TABLE blogs_content ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
DROP POLICY IF EXISTS "Public can read published blogs_content" ON blogs_content;
CREATE POLICY "Public can read published blogs_content"
ON blogs_content FOR SELECT
USING (published = true);

-- Service role can do everything
DROP POLICY IF EXISTS "Service role has full access to blogs_content" ON blogs_content;
CREATE POLICY "Service role has full access to blogs_content"
ON blogs_content FOR ALL
USING (auth.role() = 'service_role');

-- ============================================
-- 9. HELPER VIEWS
-- ============================================

-- View for all searchable content (useful for debugging)
CREATE OR REPLACE VIEW v_all_blogs AS
SELECT
    id,
    'content' as source,
    slug,
    title,
    description,
    enneagram::INTEGER,
    to_jsonb(type) as type,
    tags,
    category,
    lastmod,
    published
FROM blogs_content
UNION ALL
SELECT
    id,
    'famous_people' as source,
    person as slug,
    title,
    description,
    enneagram::INTEGER,
    type,
    tags,
    category,
    lastmod::TIMESTAMPTZ,
    published
FROM blogs_famous_people;

GRANT SELECT ON v_all_blogs TO anon;
GRANT SELECT ON v_all_blogs TO authenticated;
