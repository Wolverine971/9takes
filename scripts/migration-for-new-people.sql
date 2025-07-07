-- Migration: Add high-traffic famous people with unique, clickbait-optimized metadata
-- Date: 2025-06-25

BEGIN;

-- === ORIGINAL 10 HIGH-TRAFFIC SUGGESTIONS ===

-- Cristiano Ronaldo (Type 3 - Other)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Cristiano-Ronaldo', '3', '2025-06-25', '2025-06-25',
'Cristiano Ronaldo- The Perfectionist Who Turned Obsession Into Global Domination',
'Discover how Cristiano Ronaldo''s relentless self-improvement, mirror obsession, and psychological drive created football''s most disciplined superstar.',
'Cristiano Ronaldo Psychology | The Obsession Behind Football Greatness',
'["other"]', false);

-- Andrew Tate (Type 8 - Other)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Andrew-Tate', '8', '2025-06-25', '2025-06-25',
'Andrew Tate- The Chess Master Who Built an Empire on Controversy',
'Explore Andrew Tate''s strategic mind, dominance psychology, and how chess training shaped his controversial business empire and mindset.',
'Andrew Tate Psychology | Chess Strategy Meets Controversial Empire',
'["other"]', false);

-- Jordan Peterson (Type 5 - Other)  
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Jordan-Peterson', '5', '2025-06-25', '2025-06-25',
'Jordan Peterson- The Clinical Psychologist Who Became Culture''s Lightning Rod',
'Analyze Jordan Peterson''s academic precision, rule obsession, and psychology behind becoming the internet''s most polarizing intellectual.',
'Jordan Peterson Psychology | From Clinical Mind to Cultural Phenomenon',
'["other"]', false);

-- Greta Thunberg (Type 1 - Other)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Greta-Thunberg', '1', '2025-06-25', '2025-06-25',
'Greta Thunberg- The Autistic Teen Who Shamed World Leaders Into Action',
'Discover Greta Thunberg''s moral clarity, systematic thinking, and psychology behind transforming autism into environmental activism superpower.',
'Greta Thunberg Psychology | Autism, Activism and Global Influence',
'["other"]', false);

-- Andrew Huberman (Type 5 - Other)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Andrew-Huberman', '5', '2025-06-25', '2025-06-25',
'Andrew Huberman- The Neuroscientist Who Hacked His Way to Podcast Stardom',
'Explore Andrew Huberman''s systematic research, biohacking obsession, and psychology behind turning complex science into viral wellness content.',
'Andrew Huberman Psychology | From Lab Research to Wellness Empire',
'["other"]', false);

-- Gordon Ramsay (Type 8 - Celebrity)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Gordon-Ramsay', '8', '2025-06-25', '2025-06-25',
'Gordon Ramsay- The Football Reject Who Conquered Kitchens Through Rage',
'Analyze Gordon Ramsay''s explosive temperament, protective instincts, and psychology behind turning kitchen fury into global restaurant empire.',
'Gordon Ramsay Psychology | From Football Dreams to Kitchen Nightmares',
'["celebrity"]', false);

-- Ben Shapiro (Type 6 - Politician)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Ben-Shapiro', '6', '2025-06-25', '2025-06-25',
'Ben Shapiro- The Debate Prodigy Who Weaponized Logic and Anxiety',
'Discover Ben Shapiro''s rapid-fire argumentation, loyalty patterns, and psychology behind becoming conservative media''s youngest powerhouse.',
'Ben Shapiro Psychology | Facts, Logic and Conservative Media Mastery',
'["politician"]', false);

-- Dr. Phil (Type 8 - Other)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Dr-Phil', '8', '2025-06-25', '2025-06-25',
'Dr. Phil- The Texas Psychologist Who Turned Tough Love Into TV Gold',
'Explore Dr. Phil''s confrontational therapy style, protective instincts, and psychology behind transforming personal struggles into entertainment.',
'Dr. Phil Psychology | Tough Love Therapy Meets Television Drama',
'["other"]', false);

-- Lionel Messi (Type 9 - Other)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Lionel-Messi', '9', '2025-06-25', '2025-06-25',
'Lionel Messi- The Quiet Genius Who Let His Feet Do the Talking',
'Analyze Lionel Messi''s conflict-avoidant nature, team harmony focus, and psychology behind achieving greatness through peaceful excellence.',
'Lionel Messi Psychology | The Quiet Genius Behind Football Magic',
'["other"]', false);

-- Tucker Carlson (Type 6 - Politician)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Tucker-Carlson', '6', '2025-06-25', '2025-06-25',
'Tucker Carlson- The Prep School Rebel Who Became Fox News'' Question Machine',
'Discover Tucker Carlson''s authority-questioning style, loyalty conflicts, and psychology behind transforming doubt into primetime television.',
'Tucker Carlson Psychology | From Prep School to Primetime Rebellion',
'["politician"]', false);

-- === CATEGORY ADDITIONS (5 PER CATEGORY) ===

-- === MOVIE STAR (5 additions) ===

-- Chris Hemsworth (Type 7)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Chris-Hemsworth', '7', '2025-06-25', '2025-06-25',
'Chris Hemsworth- The Surfer Who Swung His Way Into Marvel Immortality',
'Explore Chris Hemsworth''s adventurous spirit, fitness obsession, and psychology behind transforming from Australian soap opera to Thor''s hammer.',
'Chris Hemsworth Psychology | From Home and Away to Marvel Thunder God',
'["movieStar"]', false);

-- Matthew McConaughey (Type 9)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Matthew-McConaughey', '9', '2025-06-25', '2025-06-25',
'Matthew McConaughey- The Philosopher Who Found Truth in "Alright, Alright, Alright"',
'Analyze Matthew McConaughey''s laid-back wisdom, spiritual seeking, and psychology behind reinventing himself from rom-com king to Oscar winner.',
'Matthew McConaughey Psychology | Alright Philosophy Meets Method Acting',
'["movieStar"]', false);

-- Adam Driver (Type 4)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Adam-Driver', '4', '2025-06-25', '2025-06-25',
'Adam Driver- The Marine Who Channeled War Trauma Into Raw Screen Power',
'Discover Adam Driver''s emotional intensity, method approach, and psychology behind transforming military service into compelling character work.',
'Adam Driver Psychology | From Marine Corps to Star Wars Intensity',
'["movieStar"]', false);

-- Oscar Isaac (Type 4)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Oscar-Isaac', '4', '2025-06-25', '2025-06-25',
'Oscar Isaac- The Musician Who Sang His Way Into Hollywood''s Heart',
'Explore Oscar Isaac''s artistic depth, musical soul, and psychology behind bringing authentic emotion to every role from Star Wars to indie films.',
'Oscar Isaac Psychology | Musical Soul Meets Acting Authenticity',
'["movieStar"]', false);

-- Idris Elba (Type 8)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Idris-Elba', '8', '2025-06-25', '2025-06-25',
'Idris Elba- The DJ Who Commanded Respect from Baltimore to Bond Rumors',
'Analyze Idris Elba''s commanding presence, protective instincts, and psychology behind becoming Hollywood''s most respected leading man.',
'Idris Elba Psychology | From DJ Booth to Bond Speculation Mastery',
'["movieStar"]', false);

-- === NEW MOVIE STAR (5 additions) ===

-- Florence Pugh (Type 7)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Florence-Pugh', '7', '2025-06-25', '2025-06-25',
'Florence Pugh- The Cooking Enthusiast Who Served Up Oscar-Worthy Performances',
'Discover Florence Pugh''s versatile energy, cooking passion, and psychology behind rapidly ascending from indie darling to Marvel superhero.',
'Florence Pugh Psychology | Cooking Videos to Oscar Nominations',
'["newMovieStar"]', false);

-- Paul Rudd (Type 9)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Paul-Rudd', '9', '2025-06-25', '2025-06-25',
'Paul Rudd- The Ageless Nice Guy Who Never Ages or Makes Enemies',
'Explore Paul Rudd''s conflict-avoiding charm, timeless appeal, and psychology behind maintaining Hollywood''s most likeable persona for decades.',
'Paul Rudd Psychology | The Science Behind Never Aging or Aging',
'["newMovieStar"]', false);

-- Michael B. Jordan (Type 3)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Michael-B-Jordan', '3', '2025-06-25', '2025-06-25',
'Michael B. Jordan- The Model Who Sculpted His Body Into Box Office Gold',
'Analyze Michael B. Jordan''s fitness obsession, image consciousness, and psychology behind transforming physique into career-defining performances.',
'Michael B. Jordan Psychology | From Model to Marvel Muscle',
'["newMovieStar"]', false);

-- Lupita Nyong''o (Type 2)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Lupita-Nyongo', '2', '2025-06-25', '2025-06-25',
'Lupita Nyong''o- The Yale Graduate Who Helped Hollywood Embrace Natural Beauty',
'Discover Lupita Nyong''o''s advocacy spirit, educational background, and psychology behind using platform to champion representation and self-acceptance.',
'Lupita Nyong''o Psychology | Yale Education Meets Hollywood Activism',
'["newMovieStar"]', false);

-- John Krasinski (Type 6)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('John-Krasinski', '6', '2025-06-25', '2025-06-25',
'John Krasinski- The Office Prankster Who Quietly Built a Directing Empire',
'Explore John Krasinski''s loyal nature, behind-scenes strategy, and psychology behind transforming comedy timing into horror directing mastery.',
'John Krasinski Psychology | From Office Pranks to A Quiet Place Terror',
'["newMovieStar"]', false);

-- === LIFESTYLE INFLUENCER (5 additions) ===

-- Gwyneth Paltrow (Type 1)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Gwyneth-Paltrow', '1', '2025-06-25', '2025-06-25',
'Gwyneth Paltrow- The Oscar Winner Who Turned Perfectionism Into Goop Gold',
'Analyze Gwyneth Paltrow''s high standards, wellness obsession, and psychology behind transforming acting success into controversial lifestyle empire.',
'Gwyneth Paltrow Psychology | From Oscar Winner to Goop Controversy',
'["lifestyleInfluencer"]', false);

-- Bella Hadid (Type 4)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Bella-Hadid', '4', '2025-06-25', '2025-06-25',
'Bella Hadid- The Horseback Rider Who Galloped Into Fashion''s Elite Circle',
'Discover Bella Hadid''s emotional depth, identity struggles, and psychology behind navigating supermodel fame while battling mental health challenges.',
'Bella Hadid Psychology | Equestrian Dreams to Runway Depression',
'["lifestyleInfluencer"]', false);

-- Hailey Bieber (Type 3)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Hailey-Bieber', '3', '2025-06-25', '2025-06-25',
'Hailey Bieber- The Pastor''s Daughter Who Married Into Pop Royalty',
'Explore Hailey Bieber''s image cultivation, brand building, and psychology behind transforming famous surname into independent beauty empire.',
'Hailey Bieber Psychology | Pastor''s Daughter to Pop Culture Queen',
'["lifestyleInfluencer"]', false);

-- Chiara Ferragni (Type 3)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Chiara-Ferragni', '3', '2025-06-25', '2025-06-25',
'Chiara Ferragni- The Law Student Who Blogged Her Way to Fashion Fortune',
'Analyze Chiara Ferragni''s business acumen, style obsession, and psychology behind pioneering the influencer-to-entrepreneur transformation.',
'Chiara Ferragni Psychology | Law School to Fashion Empire Pioneer',
'["lifestyleInfluencer"]', false);

-- James Charles (Type 3)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('James-Charles-Lifestyle', '3', '2025-06-25', '2025-06-25',
'James Charles- The Teen Who Painted His Way Into Beauty Industry History',
'Discover James Charles''s ambitious drive, makeup artistry, and psychology behind becoming beauty''s youngest CoverGirl while navigating public scandals.',
'James Charles Psychology | Teen Makeup Artist to Beauty Empire',
'["lifestyleInfluencer"]', false);

-- === CREATOR (5 additions) ===

-- PewDiePie (Type 5)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('PewDiePie', '5', '2025-06-25', '2025-06-25',
'PewDiePie- The Swedish Gamer Who Built YouTube''s First Empire From His Bedroom',
'Explore PewDiePie''s analytical gaming style, introversion management, and psychology behind creating YouTube''s most subscribed independent channel.',
'PewDiePie Psychology | Swedish Bedroom to YouTube Empire Builder',
'["creator"]', false);

-- Markiplier (Type 7)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Markiplier', '7', '2025-06-25', '2025-06-25',
'Markiplier- The Engineer Who Screamed His Way to Gaming Stardom',
'Analyze Markiplier''s energetic content style, charity passion, and psychology behind transforming engineering background into horror gaming fame.',
'Markiplier Psychology | From Engineering Student to Gaming Philanthropist',
'["creator"]', false);

-- Pokimane (Type 6)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Pokimane', '6', '2025-06-25', '2025-06-25',
'Pokimane- The Chemical Engineer Who Calculated Her Way to Twitch Royalty',
'Discover Pokimane''s strategic thinking, community loyalty, and psychology behind building Twitch''s most dedicated fanbase while managing parasocial relationships.',
'Pokimane Psychology | Chemical Engineering to Twitch Queen Strategy',
'["creator"]', false);

-- Jacksepticeye (Type 7)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Jacksepticeye', '7', '2025-06-25', '2025-06-25',
'Jacksepticeye- The Irish Drummer Who Beat His Way to YouTube Fame',
'Explore Jacksepticeye''s infectious enthusiasm, mental health advocacy, and psychology behind transforming Irish charm into global gaming community.',
'Jacksepticeye Psychology | Irish Drummer to YouTube Mental Health Hero',
'["creator"]', false);


-- === MUSICIAN (5 additions) ===

-- Bad Bunny (Type 7)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Bad-Bunny', '7', '2025-06-25', '2025-06-25',
'Bad Bunny- The Supermarket Bagger Who Bagged Global Music Domination',
'Discover Bad Bunny''s genre-blending creativity, Puerto Rican pride, and psychology behind transforming Latin trap into worldwide cultural phenomenon.',
'Bad Bunny Psychology | Supermarket Worker to Global Music Revolutionary',
'["musician"]', false);

-- Post Malone (Type 9)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Post-Malone', '9', '2025-06-25', '2025-06-25',
'Post Malone- The Guitar Hero Fan Who Strummed His Way to Hip-Hop Fusion',
'Explore Post Malone''s genre-mixing approach, laid-back persona, and psychology behind creating music that bridges hip-hop, rock, and country audiences.',
'Post Malone Psychology | Guitar Hero Gaming to Genre-Bending Stardom',
'["musician"]', false);

-- Doja Cat (Type 7)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Doja-Cat', '7', '2025-06-25', '2025-06-25',
'Doja Cat- The Internet Meme Queen Who Mooed Her Way to Musical Mastery',
'Analyze Doja Cat''s viral creativity, reinvention ability, and psychology behind transforming internet trolling into chart-topping artistic expression.',
'Doja Cat Psychology | From Moo Memes to Musical Genre Mastery',
'["musician"]', false);

-- Frank Ocean (Type 4)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Frank-Ocean', '4', '2025-06-25', '2025-06-25',
'Frank Ocean- The Ghostwriter Who Disappeared Into Musical Mythology',
'Discover Frank Ocean''s emotional vulnerability, mysterious nature, and psychology behind creating intimate R&B while maintaining enigmatic public persona.',
'Frank Ocean Psychology | Ghostwriter to Genre-Defining Musical Mystic',
'["musician"]', false);

-- Tyler, The Creator (Type 4)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Tyler-The-Creator', '4', '2025-06-25', '2025-06-25',
'Tyler, The Creator- The Skateboard Kid Who Ollied Into Grammy Glory',
'Explore Tyler''s artistic evolution, creative control obsession, and psychology behind transforming controversial rap into sophisticated musical artistry.',
'Tyler The Creator Psychology | Skateboard Rebel to Grammy-Winning Artist',
'["musician"]', false);

-- === HISTORICAL (5 additions) ===

-- Cleopatra (Type 3)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Cleopatra', '3', '2025-06-25', '2025-06-25',
'Cleopatra- The Polyglot Queen Who Seduced Empires With Intelligence',
'Analyze Cleopatra''s political strategy, image cultivation, and psychology behind using intelligence and charm to maintain Egypt''s independence against Rome.',
'Cleopatra Psychology | Ancient Egypt''s Master Political Strategist',
'["historical"]', false);

-- Julius Caesar (Type 8)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Julius-Caesar', '8', '2025-06-25', '2025-06-25',
'Julius Caesar- The Debt-Ridden Politician Who Conquered His Way to Immortality',
'Discover Julius Caesar''s military genius, political audacity, and psychology behind transforming massive debts into empire-building conquest.',
'Julius Caesar Psychology | From Debt Crisis to Empire Building Mastery',
'["historical"]', false);

-- Marie Antoinette (Type 7)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Marie-Antoinette', '7', '2025-06-25', '2025-06-25',
'Marie Antoinette- The Austrian Princess Who Partied While France Burned',
'Explore Marie Antoinette''s escapist tendencies, luxury obsession, and psychology behind becoming history''s most infamous symbol of royal excess.',
'Marie Antoinette Psychology | Austrian Princess to Revolutionary Symbol',
'["historical"]', false);

-- Napoleon Bonaparte (Type 8)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Napoleon-Bonaparte', '8', '2025-06-25', '2025-06-25',
'Napoleon Bonaparte- The Short Corsican Who Dominated Europe Through Will',
'Analyze Napoleon''s military strategy, ego management, and psychology behind transforming artillery skills into continental conquest and legal legacy.',
'Napoleon Psychology | Corsican Artillery Officer to European Emperor',
'["historical"]', false);

-- Leonardo da Vinci (Type 5)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Leonardo-da-Vinci', '5', '2025-06-25', '2025-06-25',
'Leonardo da Vinci- The Mirror-Writing Genius Who Never Finished Anything',
'Discover Leonardo''s insatiable curiosity, perfectionist paralysis, and psychology behind creating timeless art while leaving most projects incomplete.',
'Leonardo da Vinci Psychology | Renaissance Genius and Perfectionist Paralysis',
'["historical"]', false);

-- === POLITICIAN (5 additions) ===

-- Volodymyr Zelensky (Type 6)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Volodymyr-Zelensky', '6', '2025-06-25', '2025-06-25',
'Volodymyr Zelensky- The Comedian Who Transformed Jokes Into Wartime Leadership',
'Explore Zelensky''s loyalty to Ukraine, communication mastery, and psychology behind evolving from entertainment to inspiring global resistance leadership.',
'Volodymyr Zelensky Psychology | Comedian to Wartime Hero Transformation',
'["politician"]', false);

-- Xi Jinping (Type 8)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Xi-Jinping', '8', '2025-06-25', '2025-06-25',
'Xi Jinping- The Sent-Down Youth Who Climbed From Farm Labor to Supreme Power',
'Analyze Xi Jinping''s patient strategy, control obsession, and psychology behind surviving Cultural Revolution hardship to reshape modern China.',
'Xi Jinping Psychology | Cultural Revolution Survivor to Chinese Leader',
'["politician"]', false);

-- Vladimir Putin (Type 8)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Vladimir-Putin', '8', '2025-06-25', '2025-06-25',
'Vladimir Putin- The KGB Agent Who Judo-Chopped His Way to Absolute Power',
'Discover Putin''s intelligence background, martial arts discipline, and psychology behind transforming spy training into authoritarian control methods.',
'Vladimir Putin Psychology | KGB Training to Authoritarian Power Mastery',
'["politician"]', false);

-- Justin Trudeau (Type 3)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Justin-Trudeau', '3', '2025-06-25', '2025-06-25',
'Justin Trudeau- The Drama Teacher Who Inherited and Reinvented Political Legacy',
'Explore Trudeau''s image consciousness, performance skills, and psychology behind modernizing Canadian politics while managing family political expectations.',
'Justin Trudeau Psychology | Drama Teacher to Progressive Political Icon',
'["politician"]', false);

-- Jacinda Ardern (Type 2)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Jacinda-Ardern', '2', '2025-06-25', '2025-06-25',
'Jacinda Ardern- The Mormon-Raised Leader Who Governed With Radical Empathy',
'Analyze Ardern''s compassionate leadership, crisis management, and psychology behind transforming kindness into effective governance during global challenges.',
'Jacinda Ardern Psychology | Mormon Background to Empathetic Leadership',
'["politician"]', false);

-- === AUTHOR (5 additions) ===

-- George R.R. Martin (Type 5)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('George-RR-Martin', '5', '2025-06-25', '2025-06-25',
'George R.R. Martin- The Comic Book Fan Who Built Westeros From Rejection Letters',
'Discover Martin''s world-building obsession, perfectionist delays, and psychology behind creating Game of Thrones while struggling to complete the series.',
'George R.R. Martin Psychology | Comic Fan to Fantasy Empire Creator',
'["author"]', false);

-- Colleen Hoover (Type 4)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Colleen-Hoover', '4', '2025-06-25', '2025-06-25',
'Colleen Hoover- The Social Worker Who Healed Hearts Through Romance Trauma',
'Explore Hoover''s emotional authenticity, trauma processing, and psychology behind transforming personal pain into BookTok''s most beloved romance novels.',
'Colleen Hoover Psychology | Social Work to BookTok Romance Queen',
'["author"]', false);

-- Malcolm Gladwell (Type 5)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Malcolm-Gladwell', '5', '2025-06-25', '2025-06-25',
'Malcolm Gladwell- The Curly-Haired Journalist Who Made Psychology Profitable',
'Analyze Gladwell''s pattern recognition, research obsession, and psychology behind transforming complex studies into bestselling pop psychology phenomena.',
'Malcolm Gladwell Psychology | Journalist to Pop Psychology Phenomenon',
'["author"]', false);

-- Brené Brown (Type 2)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Brené-Brown', '2', '2025-06-25', '2025-06-25',
'Brené Brown- The Shame Researcher Who Vulnerable Her Way to Global Fame',
'Discover Brown''s vulnerability research, helping instincts, and psychology behind transforming personal shame work into worldwide emotional healing movement.',
'Brené Brown Psychology | Shame Research to Vulnerability Movement Leader',
'["author"]', false);

-- James Clear (Type 1)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('James-Clear', '1', '2025-06-25', '2025-06-25',
'James Clear- The Baseball Injury Victim Who Systematized Success Into Science',
'Explore Clear''s systematic thinking, improvement obsession, and psychology behind transforming personal setbacks into Atomic Habits methodology.',
'James Clear Psychology | Baseball Injury to Atomic Habits System',
'["author"]', false);

-- === TECHIE (5 additions) ===

-- Sundar Pichai (Type 9)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Sundar-Pichai', '9', '2025-06-25', '2025-06-25',
'Sundar Pichai- The Indian Village Boy Who Quietly Conquered Google''s Empire',
'Analyze Pichai''s consensus-building style, conflict avoidance, and psychology behind rising from modest beginnings to leading tech''s most powerful company.',
'Sundar Pichai Psychology | Indian Village to Google CEO Mastery',
'["techie"]', false);

-- Tim Cook (Type 1)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Tim-Cook', '1', '2025-06-25', '2025-06-25',
'Tim Cook- The Supply Chain Perfectionist Who Inherited Steve Jobs'' Legacy',
'Discover Cook''s operational excellence, moral leadership, and psychology behind maintaining Apple''s innovation while adding social responsibility focus.',
'Tim Cook Psychology | Supply Chain Genius to Apple Moral Leadership',
'["techie"]', false);

-- Satya Nadella (Type 6)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Satya-Nadella', '6', '2025-06-25', '2025-06-25',
'Satya Nadella- The Cricket Player Who Transformed Microsoft Through Empathy',
'Explore Nadella''s collaborative approach, team loyalty, and psychology behind revolutionizing Microsoft''s culture from competitive to cooperative.',
'Satya Nadella Psychology | Cricket Teamwork to Microsoft Cultural Revolution',
'["techie"]', false);

-- Jensen Huang (Type 3)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Jensen-Huang', '3', '2025-06-25', '2025-06-25',
'Jensen Huang- The Dishwasher Who Washed His Way to AI Chip Supremacy',
'Analyze Huang''s visionary marketing, performance obsession, and psychology behind transforming graphics cards into AI revolution''s foundation.',
'Jensen Huang Psychology | Dishwasher to AI Chip Revolution Leader',
'["techie"]', false);

-- Reed Hastings (Type 8)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Reed-Hastings', '8', '2025-06-25', '2025-06-25',
'Reed Hastings- The Math Teacher Who Calculated Netflix''s Global Domination',
'Discover Hastings'' disruptive thinking, risk tolerance, and psychology behind destroying Blockbuster and creating streaming entertainment empire.',
'Reed Hastings Psychology | Math Teacher to Netflix Empire Builder',
'["techie"]', false);

-- === TIKTOKER (5 additions) ===

-- Khaby Lame (Type 9)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Khaby-Lame', '9', '2025-06-25', '2025-06-25',
'Khaby Lame- The Silent Factory Worker Who Shrugged His Way to TikTok Royalty',
'Explore Khaby''s wordless communication, conflict-avoiding humor, and psychology behind becoming TikTok''s most followed creator without speaking.',
'Khaby Lame Psychology | Silent Factory Worker to TikTok King',
'["tiktoker"]', false);

-- Zach King (Type 5)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Zach-King', '5', '2025-06-25', '2025-06-25',
'Zach King- The Magic Obsessed Film Student Who Edited Reality Into Illusion',
'Analyze King''s technical precision, illusion crafting, and psychology behind transforming film school magic tricks into viral social media mastery.',
'Zach King Psychology | Film School Magic to Viral Editing Mastery',
'["tiktoker"]', false);

-- Spencer X (Type 7)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Spencer-X', '7', '2025-06-25', '2025-06-25',
'Spencer X- The Beatbox Prodigy Who Spit His Way to Social Media Stardom',
'Discover Spencer''s musical versatility, energetic performance, and psychology behind transforming beatboxing skills into multi-platform entertainment success.',
'Spencer X Psychology | Beatbox Prodigy to Social Media Music Star',
'["tiktoker"]', false);

-- Michael Le (Type 3)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Michael-Le', '3', '2025-06-25', '2025-06-25',
'Michael Le- The Choreographer Who Danced His Way to TikTok Millions',
'Explore Le''s dance precision, brand building, and psychology behind creating viral choreography that dominates social media dance culture.',
'Michael Le Psychology | Professional Dancer to TikTok Choreography King',
'["tiktoker"]', false);

-- Riyaz Aly (Type 3)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Riyaz-Aly', '3', '2025-06-25', '2025-06-25',
'Riyaz Aly- The Indian Teen Who Lip-Synced His Way to Global Recognition',
'Analyze Aly''s style consciousness, trend adaptation, and psychology behind becoming one of India''s most followed social media personalities.',
'Riyaz Aly Psychology | Indian Teen to Global Social Media Phenomenon',
'["tiktoker"]', false);

-- === CELEBRITY (5 additions) ===

-- Jimmy Kimmel (Type 6)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Jimmy-Kimmel', '6', '2025-06-25', '2025-06-25',
'Jimmy Kimmel- The Radio DJ Who Questioned His Way to Late Night Throne',
'Discover Kimmel''s authority-challenging humor, loyalty patterns, and psychology behind transforming radio experience into late-night television success.',
'Jimmy Kimmel Psychology | Radio DJ to Late Night Authority Challenger',
'["celebrity"]', false);

-- Conan O''Brien (Type 7)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Conan-OBrien', '7', '2025-06-25', '2025-06-25',
'Conan O''Brien- The Harvard Nerd Who Improvised His Way Through Career Chaos',
'Explore Conan''s intellectual humor, adaptability, and psychology behind surviving multiple show cancellations to create independent comedy empire.',
'Conan O''Brien Psychology | Harvard Comedy Writer to Independent Media',
'["celebrity"]', false);

-- Stephen Colbert (Type 6)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Stephen-Colbert', '6', '2025-06-25', '2025-06-25',
'Stephen Colbert- The Catholic School Kid Who Satirized Authority Into Submission',
'Analyze Colbert''s character creation, religious background, and psychology behind using fake conservative persona to expose political contradictions.',
'Stephen Colbert Psychology | Catholic School to Political Satire Master',
'["celebrity"]', false);

-- Howard Stern (Type 8)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Howard-Stern', '8', '2025-06-25', '2025-06-25',
'Howard Stern- The Shock Jock Who Confessed His Way to Radio Revolution',
'Discover Stern''s confrontational interviews, vulnerability sharing, and psychology behind transforming radio through radical honesty and boundary-pushing.',
'Howard Stern Psychology | Shock Jock to Confessional Radio Revolutionary',
'["celebrity"]', false);

-- Andy Cohen (Type 3)
INSERT INTO blogs_famous_people (person, enneagram, lastmod, date, title, description, meta_title, type, published)
VALUES ('Andy-Cohen', '3', '2025-06-25', '2025-06-25',
'Andy Cohen- The CBS Intern Who Gossiped His Way to Bravo Empire',
'Explore Cohen''s network building, entertainment instincts, and psychology behind creating reality TV empire while maintaining insider cultural status.',
'Andy Cohen Psychology | CBS Intern to Bravo Reality TV Empire',
'["celebrity"]', false);

-- Verify all insertions
SELECT person, enneagram, title, meta_title, type 
FROM blogs_famous_people 
WHERE person IN (
    'Cristiano-Ronaldo', 'Andrew-Tate', 'Jordan-Peterson', 'Greta-Thunberg', 'Andrew-Huberman',
    'Gordon-Ramsay', 'Ben-Shapiro', 'Dr-Phil', 'Lionel-Messi', 'Tucker-Carlson'
)
ORDER BY person;

COMMIT;