-- Priority 2 & 3 Performance Indexes for 9takes
-- Created: 2025-09-16
-- Purpose: Add indexes for blog content, categorization, and user interactions

-- Priority 2: Blog & Content Optimization
-- Blog posts - Celebrity analysis queries (very frequent lookups by person)
CREATE INDEX IF NOT EXISTS idx_blogs_famous_people_person_published 
ON blogs_famous_people (person, published) WHERE published = true;

-- Blog listing and ordering
CREATE INDEX IF NOT EXISTS idx_blogs_famous_people_published_lastmod 
ON blogs_famous_people (published, lastmod DESC) WHERE published = true;

-- Question categorization system
CREATE INDEX IF NOT EXISTS idx_question_tags_question_tag 
ON question_tags (question_id, tag_id);

-- Priority 3: User Interaction Tracking  
-- Comment likes - User interaction queries
CREATE INDEX IF NOT EXISTS idx_comment_like_user_comment 
ON comment_like (user_id, comment_id);

-- Comment likes by comment (for like counts)
CREATE INDEX IF NOT EXISTS idx_comment_like_comment_id 
ON comment_like (comment_id);

-- Additional Profile Indexes
-- User activity and analytics queries
CREATE INDEX IF NOT EXISTS idx_profiles_created_at_desc 
ON profiles (created_at DESC);

-- Enneagram type analytics
CREATE INDEX IF NOT EXISTS idx_profiles_enneagram 
ON profiles (enneagram) WHERE enneagram IS NOT NULL;