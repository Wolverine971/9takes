INSERT INTO tag (name, description, category_id) VALUES 
('Politics', 'Opinions on political parties, candidates, policies, current events.', 1),
('International Relations', 'Views on foreign policies, global issues.', 1),
('Public Policy', 'Opinions on local or national policies, proposed legislation, government regulation.', 1),
('Military and Defense', 'Views on military spending, defense strategies, veterans'' issues.', 1);

-- Tag Data for 'Society and Culture'
INSERT INTO tag (name, description, category_id) VALUES 
('Societal Issues', 'Subjects like equality, justice, human rights, social welfare.', 2),
('Cultural Topics', 'Opinions about art, literature, movies, music, food, cultural phenomena.', 2),
('Diversity and Inclusion', 'Views on diversity in the workplace, inclusivity in media, representation.', 2),
('Religion and Philosophy', 'Personal beliefs, views on religious practices, moral and ethical dilemmas, philosophical inquiries.', 2),
('Ageing and Retirement', 'Opinions about the ageing process, senior care, retirement planning.', 2),
('Recreational Drugs and Alcohol', 'Opinions about the legalization of certain substances, their societal impact.', 2);

-- Tag Data for 'Economy and Work'
INSERT INTO tag (name, description, category_id) VALUES 
('Economics', 'Opinions about economic theories, state of the economy, personal finance strategies.', 3),
('Work and Career', 'Work-life balance, career development, industry trends.', 3),
('Entrepreneurship and Startups', 'Opinions about starting a business, entrepreneurship challenges, venture capital.', 3),
('Housing and Urban Development', 'Architecture, city planning, housing policies.', 3),
('Real Estate and Property', 'Property investment, real estate market trends, housing policies.', 3),
('Consumer Goods and Services', 'Opinions on different brands, products, services.', 3),
('Cryptocurrency and Blockchain', 'Future of these technologies, their impact on economies, benefits/drawbacks of decentralized finance.', 3);

-- Tag Data for 'Technology and Innovation'
INSERT INTO tag (name, description, category_id) VALUES 
('Technology', 'Impact and future of technology.', 4),
('Cybersecurity', 'Data privacy, hacking, online safety.', 4),
('Automation and Robotics', 'Rise of automation, future of work, ethical considerations of robotics.', 4),
('Internet and Digital Culture', 'Internet trends, memes, digital subcultures, online communities.', 4),
('Quantum Computing and Physics', 'Potential impact of quantum computing, implications of quantum physics theories.', 4),
('Nanotechnology and Material Science', 'Potential applications of nanotechnology, ethics of manipulating materials on a microscopic scale.', 4),
('Virtual Reality and Augmented Reality', 'Impact of these technologies on entertainment, education, work.', 4);

-- Tag Data for 'Personal Interests and Lifestyle'
INSERT INTO tag (name, description, category_id) VALUES 
('Personal Preferences', 'Favorite foods, preferred styles of clothing, leisure activities.', 5),
('Relationships and Family', 'Familial relations, friendship, love and romance, parenting.', 5),
('Travel and Tourism', 'Personal travel experiences, impact of tourism on local communities, favorite travel destinations.', 5),
('Sports', 'Favorite sports, teams, players, rules, significance and societal role of sports.', 5),
('Hobbies and Interests', 'Personal hobbies, interests, leisure activities.', 5),
('Fashion and Style', 'Fashion trends, personal style, the fashion industry.', 5),
('Food and Nutrition', 'Dietary preferences, opinions on different diets or food trends, food ethics.', 5),
('Minimalism and Simple Living', 'Opinions about the minimalist lifestyle, consumerism.', 5);

-- Tag Data for 'Health and Wellness'
INSERT INTO tag (name, description, category_id) VALUES 
('Health', 'Personal health habits, healthcare policy, mental health awareness, diet, exercise.', 6),
('Mental Health', 'Personal attitudes and societal views towards mental health and wellness, therapy, mindfulness.', 6),
('Physical Fitness and Wellness', 'Various workout regimens, wellness trends, health supplements.', 6),
('Healthcare Systems', 'Effectiveness of different healthcare models, health insurance, public health.', 6),
('Alternative Medicine', 'Opinions about the effectiveness or value of non-traditional medical practices.', 6),
('Nutrition and Diet', 'Views on different diet trends, nutritional science.', 6);

-- Tag Data for 'Education and Personal Development'
INSERT INTO tag (name, description, category_id) VALUES 
('Education', 'Schooling practices, educational policy, value of different types of education.', 7),
('Education Systems', 'Effectiveness of different education systems, teaching methodologies.', 7),
('Personal Development', 'Self-improvement, learning methods, life choices.', 7),
('Parenting and Childcare', 'Views on parenting styles, childhood education, screen time for kids.', 7),
('Digital Literacy and E-learning', 'Opinions about the importance of digital literacy, the effectiveness of online learning.', 7);

-- Tag Data for 'Environment and Sustainability'
INSERT INTO tag (name, description, category_id) VALUES 
('Environment', 'Climate change, conservation, sustainability.', 8),
('Climate and Environment', 'Environmental policies, conservation, climate change, renewable energy.', 8),
('Extraterrestrial Life', 'Beliefs about the existence of life elsewhere in the universe.', 8);

-- Tag Data for 'Space and Astronomy'
INSERT INTO tag (name, description, category_id) VALUES 
('Extraterrestrial Life', 'Beliefs about the existence of life elsewhere in the universe.', 9);








INSERT INTO category (name, description) VALUES ('Media and Entertainment', NULL);

INSERT INTO tag (name, description, category_id) VALUES 
('Media', 'Opinions on TV shows, films, books, video games, celebrities.', 10),
('Digital Media and Advertising', 'Opinions on digital marketing strategies, social media advertising, influencers.', 10),
('Fashion and Beauty Industry', 'Latest trends, sustainability in the fashion industry, impact of beauty standards.', 10),
('Art and Literature', 'Personal preferences and criticisms of different forms of art and literature.', 10);

-- Tag Data for 'Science and Ethics' (assuming a new category with id=11)
INSERT INTO category (name, description) VALUES ('Science and Ethics', NULL);

INSERT INTO tag (name, description, category_id) VALUES 
('Science Fiction and Futurism', 'Predictions for the future, plausibility of science fiction concepts.', 11),
('Ethics and Morality', 'Medical ethics, corporate ethics, moral dilemmas.', 11),
('Bioethics', 'Ethical implications of biomedical procedures, genetic modification, cloning.', 11),
('Genetic Engineering', 'Ethical considerations, future possibilities, consequences of genetic manipulation.', 11),
('Quantum Computing and Physics', 'Potential impact of quantum computing, implications of quantum physics theories.', 11),
('Astrophysics and Cosmology', 'Mysteries of the universe, possibility of extraterrestrial life.', 11);

-- Tag Data for 'Rights and Social Justice' (assuming a new category with id=12)
INSERT INTO category (name, description) VALUES ('Rights and Social Justice', NULL);

INSERT INTO tag (name, description, category_id) VALUES 
('Human Rights and Social Justice', 'Gender equality, racial justice, LGBTQ+ rights.', 12),
('Animal Rights', 'Opinions about hunting, zoos, animal testing, veganism.', 12),
('Vegetarianism and Veganism', 'Opinions on plant-based diets, animal rights, health implications.', 12),
('Gender and Sexuality', 'Views on gender identity, sexual orientation, LGBTQ+ rights.', 12);


























'Elections and Voting',
'Political Ideologies',
'Government Systems',
'Diplomacy',
'Pop Culture' ,
'Social Movements',
'Traditions and Customs',
'Immigration and Migration' ,
'Global Economy',
'Trade and Commerce',
'Economic Theories',
'Labor Rights and Unions';
'Software Development',
'Hardware and Devices',
'Emerging Technologies',
'Digital Transformation';
'Scientific Methodology',
'Breakthroughs and Discoveries',
'Scientific Controversies',
'Laboratory Techniques';
'Space Exploration History',
'Theories about the Universe',
'Celestial Bodies',
'Space Agencies and Organizations',
'Personal Growth',
'Daily Routines',
'Personal Challenges',
'Life Events (e.g., weddings, childbirth, bereavement)',
'Diseases and Conditions',
'Medications and Treatments',
'Holistic Health',
'Physical and Mental Disabilities',
'Family and Kinship',
'Romantic Relationships',
'Friendships',
'Professional Relationships',
'Self-Relationship',
'Community and Social Relationships',
'Online and Virtual Relationships',
'Curriculum and Syllabus',
'School Systems Worldwide',
'Higher Education',
'Special Education',
'Skill Acquisition',
'Motivation and Discipline',
'Life Coaching',
'Self-Help Resources';
'Media Critique',
'Art Techniques and Media',
'Entertainment Industry',
'Art History',
'Historical Periods',
'Historical Figures',
'Archaeological Methods',
'Historical Interpretations and Theories';
'Ecosystems and Biodiversity',
'Conservation Efforts',
'Pollution and Waste Management',
'Sustainable Practices',
'Infrastructure Development',
'Transportation Modes and Trends',
'Urban vs. Rural Infrastructure',
'Transportation Safety and Regulations',
'Crop Science',
'Sustainable Farming',
'Food Processing and Preservation',
'Global Food Systems and Trade';
'Constitutional Law',
'International Law',
'Crime and Punishment',
'Legal Procedures and Practices',
'Business Ethics',
'Bioethics',
'Environmental Ethics',
'Moral Philosophies',
'Parenting and Child-rearing',
'Sibling Dynamics',
'Extended Family Relations',
'Generational Differences',
'Family Traditions and Values',
'Dating and Courtship',
'Marriage and Partnerships',
'Relationship Challenges',
'Intimacy and Connection',
'Breakups and Divorce',
'Making and Keeping Friends',
'Friendship Dynamics and Challenges',
'Differences between Acquaintances, Close Friends, and Best Friends',
'Online Friendships vs. In-Person Connections',
'Networking and Building Professional Connections',
'Mentor-Mentee Dynamics',
'Workplace Relationships and Boundaries',
'Navigating Office Politics',
'Self-awareness and Self-understanding',
'Self-care and Self-love',
'Building Self-confidence and Self-worth',
'Engaging with Community and Neighbors',
'Building Social Bonds and Trust',
'Navigating Social Dynamics and Hierarchies',
'Digital Communication Etiquette',
'Building and Maintaining Relationships in the Digital Age',
'Navigating Online Dating and Relationships',
'The Impact of Social Media on Relationships'