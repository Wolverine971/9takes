
-- Create Subcategories table
CREATE TABLE question_subcategories (
    subcategory_id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES question_subcategories(subcategory_id) ON DELETE CASCADE,
    subcategory_name VARCHAR(255) NOT NULL
);

-- Create Tags table
CREATE TABLE question_tag (
    tag_id SERIAL PRIMARY KEY,
    subcategory_id INTEGER REFERENCES question_subcategories(subcategory_id) ON DELETE CASCADE,
    tag_name VARCHAR(255) NOT NULL
);

-- Create Question_Tags junction table
CREATE TABLE question_tags (
    question_id INTEGER REFERENCES questions(question_id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES question_tag(tag_id) ON DELETE CASCADE,
    PRIMARY KEY (question_id, tag_id)
);




-- Inserting into Categories
INSERT INTO question_subcategories (subcategory_name, parent_id) VALUES
('Political, Social, and Economic Affairs', null),
('Technology, Science, and the Universe', null),
('Personal Life and Wellness', null),
('Education and Development', null),
('Art, History, and Culture', null),
('Environment, Infrastructure, and Food Systems', null),
('Law, Ethics, and Justice', null);  --7


INSERT INTO question_subcategories (parent_id, subcategory_name) VALUES
(1, 'Politics and Policy'), -- 8
(1, 'Society and Culture'),
(1, 'Economy and Work'),
(2, 'Technology and Innovation'),
(2, 'Science and Research'),
(2, 'Space and Astronomy'),
(3, 'Personal Interests and Lifestyle'), --// 14
(3, 'Health and Wellness'),
(3, 'Relationships'),   --16
(4, 'Education'),
(4, 'Personal Development'), --18
(5, 'Arts and Entertainment'),
(5, 'History and Archaeology'),
(6, 'Environment and Sustainability'),
(6, 'Transport and Infrastructure'),
(6, 'Agriculture and Food Production'),
(7, 'Law and Justice'),
(7, 'Ethics') --25


(16, 'Family and Kinship'),
(16, 'Romantic Relationships'),
(16, 'Friendships'),
(16, 'Professional Relationships'),
(16, 'Self-Relationship'),
(16, 'Community and Social Relationships'),
(16, 'Online and Virtual Relationships');

-- Inserting INTO question_tag based on the assumed IDs from the Subcategories
-- For brevity, I will only insert a few tags for some subcategories as an example:




-- "Relationships": {
--             "Family and Kinship": ["Parenting and Child-rearing", "Sibling Dynamics", "Extended Family Relations", "Generational Differences", "Family Traditions and Values"],
--             "Romantic Relationships": ["Dating and Courtship", "Marriage and Partnerships", "Relationship Challenges", "Intimacy and Connection", "Breakups and Divorce"],
--             "Friendships": ["Making and Keeping Friends", "Friendship Dynamics and Challenges", "Differences between Acquaintances, Close Friends, and Best Friends", "Online Friendships vs. In-Person Connections"],
--             "Professional Relationships": ["Networking and Building Professional Connections", "Mentor-Mentee Dynamics", "Workplace Relationships and Boundaries", "Navigating Office Politics"],
--             "Self-Relationship": ["Self-awareness and Self-understanding", "Self-care and Self-love", "Building Self-confidence and Self-worth"],
--             "Community and Social Relationships": ["Engaging with Community and Neighbors", "Building Social Bonds and Trust", "Navigating Social Dynamics and Hierarchies"],
--             "Online and Virtual Relationships": ["Digital Communication Etiquette", "Building and Maintaining Relationships in the Digital Age", "Navigating Online Dating and Relationships", "The Impact of Social Media on Relationships"]
--         }

INSERT INTO question_tag (subcategory_id, tag_name) VALUES


(8, 'Elections and Voting'),
(8, 'Political Ideologies'),
(8, 'Government Systems'),
(8, 'Diplomacy'),

(9, 'Pop Culture' ),
(9, 'Social Movements'),
(9, 'Traditions and Customs'),
(9, 'Immigration and Migration' ),

(10, 'Global Economy'),
(10, 'Trade and Commerce'),
(10, 'Economic Theories'),
(10, 'Labor Rights and Unions');

-- Tags for "Technology and Innovation"
INSERT INTO question_tag (subcategory_id, tag_name) VALUES
(11, 'Software Development'),
(11, 'Hardware and Devices'),
(11, 'Emerging Technologies'),
(11, 'Digital Transformation');

-- Tags for "Science and Research"
INSERT INTO question_tag (subcategory_id, tag_name) VALUES
(12, 'Scientific Methodology'),
(12, 'Breakthroughs and Discoveries'),
(12, 'Scientific Controversies'),
(12, 'Laboratory Techniques');

-- Tags for "Space and Astronomy"
INSERT INTO question_tag (subcategory_id, tag_name) VALUES
(13, 'Space Exploration History'),
(13, 'Theories about the Universe'),
(13, 'Celestial Bodies'),
(13, 'Space Agencies and Organizations'),


(14, 'Personal Growth'),
(14, 'Daily Routines'),
(14, 'Personal Challenges'),
(14, 'Life Events (e.g., weddings, childbirth, bereavement)'),

(15, 'Diseases and Conditions'),
(15, 'Medications and Treatments'),
(15, 'Holistic Health'),
(15, 'Physical and Mental Disabilities'),

(16, 'Family and Kinship'),
(16, 'Romantic Relationships'),
(16, 'Friendships'),
(16, 'Professional Relationships'),
(16, 'Self-Relationship'),
(16, 'Community and Social Relationships'),
(16, 'Online and Virtual Relationships');

-- Tags for "Education and Development"
INSERT INTO question_tag (subcategory_id, tag_name) VALUES
(17, 'Curriculum and Syllabus'),
(17, 'School Systems Worldwide'),
(17, 'Higher Education'),
(17, 'Special Education'),
(18, 'Skill Acquisition'),
(18, 'Motivation and Discipline'),
(18, 'Life Coaching'),
(18, 'Self-Help Resources');

-- Tags for "Art, History, and Culture"
INSERT INTO question_tag (subcategory_id, tag_name) VALUES
(19, 'Media Critique'),
(19, 'Art Techniques and Media'),
(19, 'Entertainment Industry'),
(19, 'Art History'),

(20, 'Historical Periods'),
(20, 'Historical Figures'),
(20, 'Archaeological Methods'),
(20, 'Historical Interpretations and Theories');

-- Tags for "Environment, Infrastructure, and Food Systems"
INSERT INTO question_tag (subcategory_id, tag_name) VALUES
(21, 'Ecosystems and Biodiversity'),
(21, 'Conservation Efforts'),
(21, 'Pollution and Waste Management'),
(21, 'Sustainable Practices'),

(22, 'Infrastructure Development'),
(22, 'Transportation Modes and Trends'),
(22, 'Urban vs. Rural Infrastructure'),
(22, 'Transportation Safety and Regulations'),

(23, 'Crop Science'),
(23, 'Sustainable Farming'),
(23, 'Food Processing and Preservation'),
(23, 'Global Food Systems and Trade');

-- Tags for "Law, Ethics, and Justice"
INSERT INTO question_tag (subcategory_id, tag_name) VALUES
(24, 'Constitutional Law'),
(24, 'International Law'),
(24, 'Crime and Punishment'),
(24, 'Legal Procedures and Practices'),

(25, 'Business Ethics'),
(25, 'Bioethics'),
(25, 'Environmental Ethics'),
(25, 'Moral Philosophies'),

(26, 'Parenting and Child-rearing'),
(26, 'Sibling Dynamics'),
(26, 'Extended Family Relations'),
(26, 'Generational Differences'),
(26, 'Family Traditions and Values'),

(27, 'Dating and Courtship'),
(27, 'Marriage and Partnerships'),
(27, 'Relationship Challenges'),
(27, 'Intimacy and Connection'),
(27, 'Breakups and Divorce'),

(28, 'Making and Keeping Friends'),
(28, 'Friendship Dynamics and Challenges'),
(28, 'Differences between Acquaintances, Close Friends, and Best Friends'),
(28, 'Online Friendships vs. In-Person Connections'),


(29, 'Networking and Building Professional Connections'),
(29, 'Mentor-Mentee Dynamics'),
(29, 'Workplace Relationships and Boundaries'),
(29, 'Navigating Office Politics'),


(30, 'Self-awareness and Self-understanding'),
(30, 'Self-care and Self-love'),
(30, 'Building Self-confidence and Self-worth'),

(31, 'Engaging with Community and Neighbors'),
(31, 'Building Social Bonds and Trust'),
(31, 'Navigating Social Dynamics and Hierarchies'),

(32, 'Digital Communication Etiquette'),
(32, 'Building and Maintaining Relationships in the Digital Age'),
(32, 'Navigating Online Dating and Relationships'),
(32, 'The Impact of Social Media on Relationships');
