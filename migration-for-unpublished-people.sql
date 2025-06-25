-- Migration: Update metadata for unpublished famous people blogs
-- Date: 2025-06-25

--https://claude.ai/chat/3d9120f0-29f7-43b2-90e9-9899d204aab2

BEGIN;

-- Drake (Type 3 - Musician)
UPDATE blogs_famous_people 
SET enneagram = '3',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Drake- From Degrassi to Global Domination: The Psychology of Vulnerability',
    description = 'Explore how Drake''s emotional transparency and relentless ambition created a new blueprint for rap stardom, analyzing the psychology behind his meteoric rise from Canadian teen actor.',
    meta_title = 'Drake''s Psychology Exposed: How Emotional Rap Built an Empire',
    type = '["musician"]'
WHERE person = 'Drake';

-- John-Lennon (Type 5 - Musician)
UPDATE blogs_famous_people 
SET enneagram = '5',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'John Lennon- The Revolutionary Mind Behind "Imagine" and Beatles Magic',
    description = 'Dive into John Lennon''s complex psychology - his intellectual rebelliousness, spiritual searching, and how his introspective nature shaped both Beatles music and peace activism.',
    meta_title = 'John Lennon''s Secret Psychology: What Made The Beatles Genius Tick',
    type = '["musician"]'
WHERE person = 'John-Lennon';

-- Eddie-Murphy (Type 7 - Movie Star)
UPDATE blogs_famous_people 
SET enneagram = '7',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Eddie Murphy- The Master of Multiple Personalities and Comedy Chaos',
    description = 'Analyze Eddie Murphy''s psychological ability to transform into countless characters, from Raw''s raw energy to Nutty Professor''s family dynamics, revealing the mind behind comedy genius.',
    meta_title = 'Eddie Murphy''s Multiple Personality Secret: Psychology of Comedy Genius',
    type = '["movieStar"]'
WHERE person = 'Eddie-Murphy';

-- Tim-Robinson (Type 4 - Creator)
UPDATE blogs_famous_people 
SET enneagram = '4',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Tim Robinson- The Uncomfortable Genius Behind Awkward Comedy Gold',
    description = 'Explore Tim Robinson''s ability to find humor in social discomfort and emotional intensity, analyzing the psychology behind "I Think You Should Leave" and his unique comedic voice.',
    meta_title = 'Tim Robinson''s Weird Comedy Psychology: Why Awkward = Genius',
    type = '["creator"]'
WHERE person = 'Tim-Robinson';

-- Lele-Pons (Type 7 - TikToker)
UPDATE blogs_famous_people 
SET enneagram = '7',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Lele Pons- Behind the Constant Content: Psychology of Digital Addiction',
    description = 'Discover how Lele Pons'' relentless content creation masks deeper psychological patterns, examining her public mental health struggles and the psychology of viral fame.',
    meta_title = 'Lele Pons'' Mental Health Truth: Psychology Behind Viral Fame',
    type = '["tiktoker"]'
WHERE person = 'Lele-Pons';

-- Lisa-Koshy (Type 8 - Creator)
UPDATE blogs_famous_people 
SET enneagram = '8',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Liza Koshy- The Powerhouse Who Conquered Every Platform',
    description = 'Analyze Liza Koshy''s commanding presence and strategic career moves, from Vine to hosting to acting, revealing the psychology behind her multi-platform dominance.',
    meta_title = 'Liza Koshy''s Domination Strategy: Psychology of Multi-Platform Success',
    type = '["creator"]'
WHERE person = 'Lisa-Koshy';

-- Nikki-Glaser (Type 6 - Creator)
UPDATE blogs_famous_people 
SET enneagram = '6',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Nikki Glaser- The Self-Destructive Honesty That Built a Comedy Career',
    description = 'Explore Nikki Glaser''s psychology of turning personal anxiety and brutal self-awareness into comedy gold, analyzing how vulnerability became her greatest strength.',
    meta_title = 'Nikki Glaser''s Brutal Honesty Psychology: Comedy Through Pain',
    type = '["creator"]'
WHERE person = 'Nikki-Glaser';

-- KSI (Type 7 - Creator)
UPDATE blogs_famous_people 
SET enneagram = '7',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'KSI- The Hyperactive Mind That Built a YouTube to Boxing Empire',
    description = 'Discover KSI''s psychology of constant reinvention, from FIFA videos to chart-topping music to professional boxing, analyzing the restless mind behind multi-industry success.',
    meta_title = 'KSI''s Hyperactive Success Formula: YouTube to Boxing Psychology',
    type = '["creator"]'
WHERE person = 'KSI';

-- Richard-Simmons (Type 2 - Other)
UPDATE blogs_famous_people 
SET enneagram = '2',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Richard Simmons- The Emotional Extremes Behind Fitness Fame',
    description = 'Analyze Richard Simmons'' psychology of healing others through fitness while battling his own demons, exploring the emotional intensity behind his sudden disappearance.',
    meta_title = 'Richard Simmons'' Disappearance Psychology: What Really Happened?',
    type = '["other"]'
WHERE person = 'Richard-Simmons';

-- Emma-Stone (Type 7 - New Movie Star)
UPDATE blogs_famous_people 
SET enneagram = '7',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Emma Stone- The Anxious Perfectionist Who Charmed Hollywood',
    description = 'Explore Emma Stone''s psychology of channeling anxiety into Oscar-winning performances, from La La Land to Poor Things, revealing how vulnerability became her superpower.',
    meta_title = 'Emma Stone''s Anxiety Success Secret: How Fear Built an Oscar Career',
    type = '["newMovieStar"]'
WHERE person = 'Emma-Stone';

-- Pelosi-Schumer-dynamic (Type 3 - Politician)
UPDATE blogs_famous_people 
SET enneagram = '3',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Pelosi-Schumer Dynamic- The Political Power Couple''s Strategic Mind Games',
    description = 'Analyze the psychological partnership between Nancy Pelosi and Chuck Schumer, exploring how their coordinated ambition and image management shaped Democratic strategy.',
    meta_title = 'Pelosi-Schumer Power Psychology: Inside Democratic Strategy Minds',
    type = '["politician"]'
WHERE person = 'Pelosi-Schumer-dynamic';

-- Camila-Cabello (Type 3 - Musician)
UPDATE blogs_famous_people 
SET enneagram = '3',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Camila Cabello- The Calculated Rebellion That Launched Solo Stardom',
    description = 'Discover Camila Cabello''s psychology of strategic reinvention, from Fifth Harmony departure to solo success, analyzing how calculated risks built her empire.',
    meta_title = 'Camila Cabello''s Solo Success Psychology: The Fifth Harmony Escape Plan',
    type = '["musician"]'
WHERE person = 'Camila-Cabello';

-- Pete-Buttigieg (Type 3 - Politician)
UPDATE blogs_famous_people 
SET enneagram = '3',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Pete Buttigieg- The McKinsey Mind That Almost Won the Presidency',
    description = 'Explore Pete Buttigieg''s psychology of calculated authenticity and strategic positioning, analyzing how consultant thinking shaped his meteoric political rise.',
    meta_title = 'Pete Buttigieg''s Political Psychology: McKinsey Tactics in Politics',
    type = '["politician"]'
WHERE person = 'Pete-Buttigieg';

-- Tom-Hanks (Type 6 - Movie Star)
UPDATE blogs_famous_people 
SET enneagram = '6',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Tom Hanks- The Psychology Behind America''s Most Trusted Man',
    description = 'Analyze Tom Hanks'' psychology of genuine relatability and moral consistency, exploring how anxiety and authenticity made him the most beloved actor in America.',
    meta_title = 'Tom Hanks'' Trust Psychology: Why America Believes This Actor',
    type = '["movieStar"]'
WHERE person = 'Tom-Hanks';

-- Dixie-D'Amelio (Type 4 - TikToker)
UPDATE blogs_famous_people 
SET enneagram = '4',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Dixie D''Amelio- Living in Charli''s Shadow: The Psychology of Sibling Fame',
    description = 'Discover Dixie D''Amelio''s struggle for individual identity while navigating sister Charli''s massive success, analyzing the complex psychology of sibling rivalry in social media.',
    meta_title = 'Dixie D''Amelio''s Sister Psychology: Living in Charli''s TikTok Shadow',
    type = '["tiktoker"]'
WHERE person = 'Dixie-D''Amelio';

-- Kendrick-Lamar (Type 4 - Musician)
UPDATE blogs_famous_people 
SET enneagram = '4',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Kendrick Lamar- The Tortured Poet Who Revolutionized Hip-Hop Consciousness',
    description = 'Explore Kendrick Lamar''s psychology of transforming personal trauma into generational art, analyzing how his emotional intensity created the most important rap of our time.',
    meta_title = 'Kendrick Lamar''s Genius Psychology: How Trauma Created Hip-Hop''s GOAT',
    type = '["musician"]'
WHERE person = 'Kendrick-Lamar';

-- Abraham-Lincoln (Type 9 - Historical)
UPDATE blogs_famous_people 
SET enneagram = '9',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Abraham Lincoln- The Melancholy President Who Saved America Through Inaction',
    description = 'Analyze Abraham Lincoln''s psychology of strategic patience and conflict avoidance, exploring how his tendency to delay and deliberate ultimately preserved the Union.',
    meta_title = 'Abraham Lincoln''s Depression Psychology: How Melancholy Saved America',
    type = '["historical"]'
WHERE person = 'Abraham-Lincoln';

-- Josh-Richards (Type 3 - TikToker)
UPDATE blogs_famous_people 
SET enneagram = '3',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Josh Richards- The Business Mind Behind TikTok''s Golden Boy Image',
    description = 'Discover Josh Richards'' psychology of brand building and strategic partnerships, analyzing how he transformed TikTok fame into a multi-million dollar business empire.',
    meta_title = 'Josh Richards'' Business Psychology: TikTok to Millionaire Success Story',
    type = '["tiktoker"]'
WHERE person = 'Josh-Richards';

-- Gigi-Hadid (Type 3 - Lifestyle Influencer)
UPDATE blogs_famous_people 
SET enneagram = '3',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Gigi Hadid- The Nepotism Success Story Who Made It on Merit',
    description = 'Explore Gigi Hadid''s psychology of overcoming privilege accusations through relentless work ethic, analyzing how she transformed family connections into earned supermodel status.',
    meta_title = 'Gigi Hadid''s Nepotism Psychology: How Privilege Became Earned Success',
    type = '["lifestyleInfluencer"]'
WHERE person = 'Gigi-Hadid';

-- Janelle-Monae (Type 4 - Musician)
UPDATE blogs_famous_people 
SET enneagram = '4',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Janelle Monáe- The Sci-Fi Visionary Who Made Weirdness Mainstream',
    description = 'Analyze Janelle Monáe''s psychology of radical authenticity and futuristic thinking, exploring how her refusal to conform created a unique space in music and culture.',
    meta_title = 'Janelle Monáe''s Weird Psychology: How Sci-Fi Thinking Conquered Music',
    type = '["musician"]'
WHERE person = 'Janelle-Monae';

-- Morgan-Wallen (Type 8 - Musician)
UPDATE blogs_famous_people 
SET enneagram = '8',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Morgan Wallen- The Controversial Bad Boy Who Conquered Country Music',
    description = 'Discover Morgan Wallen''s psychology of authentic rebellion and controversy navigation, analyzing how his unapologetic nature made him country music''s biggest star.',
    meta_title = 'Morgan Wallen''s Controversy Psychology: Bad Boy Success in Country Music',
    type = '["musician"]'
WHERE person = 'Morgan-Wallen';

-- Tony-Robbins (Type 3 - Other)
UPDATE blogs_famous_people 
SET enneagram = '3',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Tony Robbins- The Giant Who Sold Confidence to Millions',
    description = 'Explore Tony Robbins'' psychology of transforming personal insecurity into a self-help empire, analyzing how his own need for validation created a billion-dollar business.',
    meta_title = 'Tony Robbins'' Insecurity Psychology: How Self-Doubt Built Self-Help Empire',
    type = '["other"]'
WHERE person = 'Tony-Robbins';

-- Bella-Poarch (Type 9 - TikToker)
UPDATE blogs_famous_people 
SET enneagram = '9',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Bella Poarch- The Mysterious Face Behind TikTok''s Most-Liked Video',
    description = 'Analyze Bella Poarch''s psychology of silent stardom and conflict avoidance, exploring how her enigmatic presence and traumatic past shaped viral fame.',
    meta_title = 'Bella Poarch''s Mystery Psychology: The Silent Success of TikTok''s Queen',
    type = '["tiktoker"]'
WHERE person = 'Bella-Poarch';

-- Julia-Roberts (Type 7 - Movie Star)
UPDATE blogs_famous_people 
SET enneagram = '7',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Julia Roberts- The Million-Dollar Smile That Hid Hollywood''s Biggest Ego',
    description = 'Discover Julia Roberts'' psychology of charm weaponization and behind-the-scenes reputation, analyzing how her infectious personality masked a more complex Hollywood reality.',
    meta_title = 'Julia Roberts'' Ego Psychology: The Dark Side of America''s Sweetheart',
    type = '["movieStar"]'
WHERE person = 'Julia-Roberts';

-- Addison-Rae (Type 3 - TikToker)
UPDATE blogs_famous_people 
SET enneagram = '3',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Addison Rae- The Dancing Algorithm That Became a Business Empire',
    description = 'Explore Addison Rae''s psychology of strategic positioning and brand evolution, analyzing how she transformed simple dance videos into multimedia success across platforms.',
    meta_title = 'Addison Rae''s Algorithm Psychology: Dancing to Multi-Million Dollar Success',
    type = '["tiktoker"]'
WHERE person = 'Addison-Rae';

-- Martha-Stewart (Type 1 - Lifestyle Influencer)
UPDATE blogs_famous_people 
SET enneagram = '1',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Martha Stewart- The Prison-Hardened Perfectionist Who Rebuilt an Empire',
    description = 'Analyze Martha Stewart''s psychology of obsessive control and resilience, exploring how perfectionist standards and prison experience shaped her lifestyle brand dominance.',
    meta_title = 'Martha Stewart''s Prison Psychology: How Jail Made Her Empire Stronger',
    type = '["lifestyleInfluencer"]'
WHERE person = 'Martha-Stewart';

-- Sean-Penn (Type 8 - Movie Star)
UPDATE blogs_famous_people 
SET enneagram = '8',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Sean Penn- The Rage-Fueled Method Actor Who Became a War Correspondent',
    description = 'Discover Sean Penn''s psychology of channeling anger into art and activism, analyzing how his confrontational nature shaped both intense performances and global journalism.',
    meta_title = 'Sean Penn''s Anger Psychology: How Rage Built Oscar-Winning Performances',
    type = '["movieStar"]'
WHERE person = 'Sean-Penn';

-- Vincent-van-Gogh (Type 4 - Historical)
UPDATE blogs_famous_people 
SET enneagram = '4',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Vincent van Gogh- The Madness and Genius Behind History''s Most Valuable Art',
    description = 'Explore Vincent van Gogh''s psychology of transforming mental anguish into artistic immortality, analyzing how his emotional intensity created priceless masterpieces.',
    meta_title = 'Van Gogh''s Madness Psychology: How Mental Illness Created Billion-Dollar Art',
    type = '["historical"]'
WHERE person = 'Vincent-van-Gogh';

-- Tana-Mongeau (Type 7 - Creator)
UPDATE blogs_famous_people 
SET enneagram = '7',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Tana Mongeau- The Chaos Creator Who Monetized Mental Breakdown',
    description = 'Analyze Tana Mongeau''s psychology of turning personal disasters into content gold, exploring how her self-destructive patterns became a sustainable business model.',
    meta_title = 'Tana Mongeau''s Chaos Psychology: How Mental Breakdown Became Profit',
    type = '["creator"]'
WHERE person = 'Tana-Mongeau';

-- Mark-Twain (Type 6 - Author)
UPDATE blogs_famous_people 
SET enneagram = '6',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Mark Twain- The Pessimistic Humorist Who Defined American Literature',
    description = 'Discover Mark Twain''s psychology of using humor to mask deep cynicism and anxiety, analyzing how his skeptical worldview created timeless American classics.',
    meta_title = 'Mark Twain''s Depression Psychology: The Dark Truth Behind American Humor',
    type = '["author"]'
WHERE person = 'Mark-Twain';

-- Corina-Conf (Type 3 - Other)
UPDATE blogs_famous_people 
SET enneagram = '3',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Corina Conf- The Strategic Mind Behind Calculated Social Media Success',
    description = 'Explore Corina Conf''s psychology of methodical brand building and audience cultivation, analyzing how strategic thinking created sustainable influence across platforms.',
    meta_title = 'Corina Conf''s Strategy Psychology: The Calculated Path to Social Media Success',
    type = '["other"]'
WHERE person = 'Corina-Conf';

-- Patrick-Starr (Type 3 - Creator)
UPDATE blogs_famous_people 
SET enneagram = '3',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Patrick Starr- The Drag Transformation That Conquered Beauty Industry',
    description = 'Analyze Patrick Starr''s psychology of identity performance and business acumen, exploring how drag culture techniques built a mainstream beauty empire.',
    meta_title = 'Patrick Starr''s Drag Psychology: How Performance Art Built Beauty Empire',
    type = '["creator"]'
WHERE person = 'Patrick-Starr';

-- Amy-Poehler (Type 8 - Movie Star)
UPDATE blogs_famous_people 
SET enneagram = '8',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Amy Poehler- The Feminist Powerhouse Who Made Leadership Look Fun',
    description = 'Discover Amy Poehler''s psychology of empowering others through comedy and leadership, analyzing how her protective instincts shaped Parks and Rec and feminist activism.',
    meta_title = 'Amy Poehler''s Leadership Psychology: How Comedy Became Feminist Power',
    type = '["movieStar"]'
WHERE person = 'Amy-Poehler';

-- James-Charles (Type 3 - Creator)
UPDATE blogs_famous_people 
SET enneagram = '3',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'James Charles- The Makeup Mogul Who Survived Cancel Culture',
    description = 'Explore James Charles'' psychology of resilience and image rehabilitation, analyzing how he navigated major controversies while maintaining his beauty empire.',
    meta_title = 'James Charles'' Survival Psychology: How Beauty Mogul Beat Cancel Culture',
    type = '["creator"]'
WHERE person = 'James-Charles';

-- Mindy-Kaling (Type 6 - Creator)
UPDATE blogs_famous_people 
SET enneagram = '6',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Mindy Kaling- The Anxiety-Driven Overachiever Who Rewrote Hollywood Rules',
    description = 'Analyze Mindy Kaling''s psychology of channeling insecurity into creative control, exploring how self-doubt fueled her transition from actor to powerful producer.',
    meta_title = 'Mindy Kaling''s Anxiety Psychology: How Self-Doubt Built Hollywood Power',
    type = '["creator"]'
WHERE person = 'Mindy-Kaling';

-- Jennifer-Aniston (Type 6 - Movie Star)
UPDATE blogs_famous_people 
SET enneagram = '6',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Jennifer Aniston- The Anxious America''s Sweetheart Who Never Left the 90s',
    description = 'Discover Jennifer Aniston''s psychology of nostalgic comfort and relationship patterns, analyzing how Friends success became both blessing and career limitation.',
    meta_title = 'Jennifer Aniston''s Anxiety Psychology: Why She Can''t Escape Rachel Green',
    type = '["movieStar"]'
WHERE person = 'Jennifer-Aniston';

-- Ava-Max (Type 3 - Musician)
UPDATE blogs_famous_people 
SET enneagram = '3',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Ava Max- The Calculated Pop Star Who Engineered Viral Success',
    description = 'Explore Ava Max''s psychology of strategic image creation and algorithmic understanding, analyzing how she reverse-engineered pop stardom through data-driven artistry.',
    meta_title = 'Ava Max''s Algorithm Psychology: How Data Science Created Pop Stardom',
    type = '["musician"]'
WHERE person = 'Ava-Max';

-- Jennifer-Lopez (Type 3 - Movie Star)
UPDATE blogs_famous_people 
SET enneagram = '3',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Jennifer Lopez- The Relentless Machine Who Conquered Every Entertainment Medium',
    description = 'Analyze Jennifer Lopez''s psychology of perpetual reinvention and work addiction, exploring how her fear of irrelevance built a multi-decade entertainment empire.',
    meta_title = 'Jennifer Lopez''s Workaholic Psychology: The Fear That Built J.Lo Empire',
    type = '["movieStar"]'
WHERE person = 'Jennifer-Lopez';

-- Lizzo (Type 8 - Musician)
UPDATE blogs_famous_people 
SET enneagram = '8',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Lizzo- The Body-Positive Revolutionary Who Made Self-Love Radical',
    description = 'Discover Lizzo''s psychology of transforming personal pain into empowerment anthems, analyzing how her protective instincts created a movement of radical self-acceptance.',
    meta_title = 'Lizzo''s Revolution Psychology: How Self-Love Became Political Power',
    type = '["musician"]'
WHERE person = 'Lizzo';

-- Judge-Judy (Type 1 - Other)
UPDATE blogs_famous_people 
SET enneagram = '1',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Judge Judy- The No-Nonsense Millionaire Who Made Justice Entertainment',
    description = 'Explore Judge Judy''s psychology of moral absolutism and courtroom control, analyzing how her rigid standards created television''s most profitable legal show.',
    meta_title = 'Judge Judy''s Millionaire Psychology: How Harsh Justice Became TV Gold',
    type = '["other"]'
WHERE person = 'Judge-Judy';

-- David-Goggins (Type 6 - Other)
UPDATE blogs_famous_people 
SET enneagram = '6',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'David Goggins- The Trauma-Driven Machine Who Weaponized Suffering',
    description = 'Analyze David Goggins'' psychology of transforming childhood trauma into extreme physical achievement, exploring how fear and pain became his greatest motivational tools.',
    meta_title = 'David Goggins'' Trauma Psychology: How Childhood Pain Built Mental Toughness',
    type = '["other"]'
WHERE person = 'David-Goggins';

-- Greta-Thunberg (Type 1 - Other)
UPDATE blogs_famous_people 
SET enneagram = '1',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Greta Thunberg- The Autistic Teenager Who Shamed World Leaders',
    description = 'Discover Greta Thunberg''s psychology of moral clarity and neurodivergent advantages, analyzing how Asperger''s traits amplified her climate activism effectiveness.',
    meta_title = 'Greta Thunberg''s Autism Psychology: How Asperger''s Powered Climate Activism',
    type = '["other"]'
WHERE person = 'Greta-Thunberg';

-- Jordan-Peterson (Type 1 - Other)
UPDATE blogs_famous_people 
SET enneagram = '1',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Jordan Peterson- The Controversial Professor Who Became a Messiah',
    description = 'Explore Jordan Peterson''s psychology of rigid thinking and messiah complex, analyzing how his perfectionist worldview created both devoted followers and fierce critics.',
    meta_title = 'Jordan Peterson''s Messiah Psychology: Professor to Controversial Guru Journey',
    type = '["other"]'
WHERE person = 'Jordan-Peterson';

-- Kabib (Type 8 - Other)
UPDATE blogs_famous_people 
SET enneagram = '8',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Khabib- The Humble Destroyer Who Retired Undefeated',
    description = 'Analyze Khabib''s psychology of controlled aggression and family loyalty, exploring how Dagestan culture and father''s influence shaped UFC''s most dominant champion.',
    meta_title = 'Khabib''s Dagestan Psychology: How Mountain Culture Built UFC Dominance',
    type = '["other"]'
WHERE person = 'Kabib';

-- Steve-Irwin (Type 7 - Other)
UPDATE blogs_famous_people 
SET enneagram = '7',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Steve Irwin- The Fearless Optimist Who Made Death Educational',
    description = 'Discover Steve Irwin''s psychology of joyful risk-taking and educational passion, analyzing how his childlike wonder and death-defying stunts created conservation awareness.',
    meta_title = 'Steve Irwin''s Fearless Psychology: How Death-Defying Joy Saved Wildlife',
    type = '["other"]'
WHERE person = 'Steve-Irwin';

-- Ted-Bundy (Type 3 - Other)
UPDATE blogs_famous_people 
SET enneagram = '3',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Ted Bundy- The Charming Psychopath Who Perfected Evil',
    description = 'Explore Ted Bundy''s psychology of manipulation and image crafting, analyzing how his need for admiration and control created one of history''s most terrifying killers.',
    meta_title = 'Ted Bundy''s Charm Psychology: How Manipulation Masked Pure Evil',
    type = '["other"]'
WHERE person = 'Ted-Bundy';

-- Princess-Diana (Type 2 - Historical)
UPDATE blogs_famous_people 
SET enneagram = '2',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Princess Diana- The Broken Royal Who Became the People''s Saint',
    description = 'Analyze Princess Diana''s psychology of using personal pain to help others, exploring how her eating disorders and royal trauma created unprecedented empathy and global impact.',
    meta_title = 'Princess Diana''s Trauma Psychology: How Royal Pain Created People''s Princess',
    type = '["historical"]'
WHERE person = 'Princess-Diana';

-- Robert-F-Kennedy-Jr (Type 9 - Politician)
UPDATE blogs_famous_people 
SET enneagram = '9',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'RFK Jr.- The Kennedy Conspiracy Theorist Who Broke Family Legacy',
    description = 'Discover RFK Jr.''s psychology of family burden and contrarian thinking, analyzing how Kennedy legacy pressure led to environmental activism and vaccine skepticism.',
    meta_title = 'RFK Jr.''s Conspiracy Psychology: How Kennedy Legacy Created Rebel Theorist',
    type = '["politician"]'
WHERE person = 'Robert-F-Kennedy-Jr';

-- Ron-DeSantis (Type 9 - Politician)
UPDATE blogs_famous_people 
SET enneagram = '9',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Ron DeSantis- The Quiet Calculator Who Built a Conservative Empire',
    description = 'Explore Ron DeSantis'' psychology of strategic patience and controlled ambition, analyzing how his methodical approach to culture wars built national political influence.',
    meta_title = 'Ron DeSantis'' Calculation Psychology: The Quiet Strategy Behind Conservative Power',
    type = '["politician"]'
WHERE person = 'Ron-DeSantis';

-- Nicole-Kidman (Type 4 - New Movie Star)
UPDATE blogs_famous_people 
SET enneagram = '4',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Nicole Kidman- The Ethereal Transformer Who Became Hollywood''s Chameleon',
    description = 'Analyze Nicole Kidman''s psychology of radical character immersion and artistic risk-taking, exploring how her search for authentic expression created four decades of reinvention.',
    meta_title = 'Nicole Kidman''s Transformation Psychology: 40 Years of Radical Reinvention',
    type = '["newMovieStar"]'
WHERE person = 'Nicole-Kidman';

-- Chamath-Palihapitiya (Type 3 - Techie)
UPDATE blogs_famous_people 
SET enneagram = '3',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Chamath Palihapitiya- The Facebook Defector Who Became Capitalism''s Critic',
    description = 'Discover Chamath Palihapitiya''s psychology of success guilt and system critique, analyzing how Facebook wealth led to SPAC innovation and social media criticism.',
    meta_title = 'Chamath Palihapitiya''s Guilt Psychology: Facebook Wealth to System Critic',
    type = '["techie"]'
WHERE person = 'Chamath-Palihapitiya';

-- Dalton-Cadwell (Type 3 - Techie)
UPDATE blogs_famous_people 
SET enneagram = '3',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Dalton Caldwell- The Behind-the-Scenes Builder of Startup Dreams',
    description = 'Explore Dalton Caldwell''s psychology of systematic success and efficiency obsession, analyzing how his methodical approach to startups shaped Y Combinator''s dominance.',
    meta_title = 'Dalton Caldwell''s System Psychology: The Method Behind Y Combinator Success',
    type = '["techie"]'
WHERE person = 'Dalton-Cadwell';

-- Marie-Kondo (Type 3 - Lifestyle Influencer)
UPDATE blogs_famous_people 
SET enneagram = '3',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Marie Kondo- The Minimalist Mogul Who Monetized Tidiness',
    description = 'Analyze Marie Kondo''s psychology of perfectionist systems and global expansion, exploring how Japanese organizing principles built a worldwide lifestyle empire.',
    meta_title = 'Marie Kondo''s Minimalist Psychology: How Tidiness Built Global Empire',
    type = '["lifestyleInfluencer"]'
WHERE person = 'Marie-Kondo';

-- Sean-Connery (Type 8 - Movie Star)
UPDATE blogs_famous_people 
SET enneagram = '8',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Sean Connery- The Scottish Tough Guy Who Defined Masculine Cool',
    description = 'Discover Sean Connery''s psychology of effortless dominance and controlled intensity, analyzing how working-class Scottish roots created cinema''s ultimate alpha male.',
    meta_title = 'Sean Connery''s Alpha Psychology: Working-Class Roots to Ultimate Masculinity',
    type = '["movieStar"]'
WHERE person = 'Sean-Connery';

-- David-Friedberg (Type 3 - Techie)
UPDATE blogs_famous_people 
SET enneagram = '3',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'David Friedberg- The Climate Entrepreneur Who Wants to Feed the World',
    description = 'Explore David Friedberg''s psychology of systematic problem-solving and agricultural innovation, analyzing how his efficiency mindset tackles global food security.',
    meta_title = 'David Friedberg''s Innovation Psychology: Climate Tech Solving World Hunger',
    type = '["techie"]'
WHERE person = 'David-Friedberg';

-- Lea-Michele (Type 1 - Other)
UPDATE blogs_famous_people 
SET enneagram = '1',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Lea Michele- The Vocal Perfectionist Whose Standards Destroyed Relationships',
    description = 'Analyze Lea Michele''s psychology of artistic perfectionism and social rigidity, exploring how her exacting standards created both Glee success and industry alienation.',
    meta_title = 'Lea Michele''s Perfectionist Psychology: How High Standards Ruined Career',
    type = '["other"]'
WHERE person = 'Lea-Michele';

-- Jenna-Marbles (Type 8 - Creator)
UPDATE blogs_famous_people 
SET enneagram = '8',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Jenna Marbles- The YouTube Queen Who Canceled Herself Before Others Could',
    description = 'Discover Jenna Marbles'' psychology of authentic self-awareness and protective withdrawal, analyzing how her integrity led to voluntary retirement from YouTube fame.',
    meta_title = 'Jenna Marbles'' Self-Cancel Psychology: Why YouTube''s Queen Quit at Peak',
    type = '["creator"]'
WHERE person = 'Jenna-Marbles';

-- Krystal-Ball (Type 1 - Politician)
UPDATE blogs_famous_people 
SET enneagram = '1',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Krystal Ball- The Populist Purist Who Left Mainstream Media Behind',
    description = 'Explore Krystal Ball''s psychology of moral clarity and system rejection, analyzing how her perfectionist standards led to independent media and progressive populism.',
    meta_title = 'Krystal Ball''s Purity Psychology: Mainstream Media to Independent Populism',
    type = '["politician"]'
WHERE person = 'Krystal-Ball';

-- Jackson-Wang (Type 3 - Musician)
UPDATE blogs_famous_people 
SET enneagram = '3',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Jackson Wang- The Global Connector Who Bridged East and West',
    description = 'Analyze Jackson Wang''s psychology of cultural adaptation and strategic positioning, exploring how his multicultural identity created unprecedented K-pop crossover success.',
    meta_title = 'Jackson Wang''s Cultural Psychology: K-Pop''s East-West Bridge Builder',
    type = '["musician"]'
WHERE person = 'Jackson-Wang';

-- Audrey-Hepburn (Type 2 - Movie Star)
UPDATE blogs_famous_people 
SET enneagram = '2',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Audrey Hepburn- The Wartime Survivor Who Became Hollywood''s Angel',
    description = 'Discover Audrey Hepburn''s psychology of trauma transformation and graceful giving, analyzing how WWII hardship shaped her elegant persona and humanitarian dedication.',
    meta_title = 'Audrey Hepburn''s Trauma Psychology: War Survivor to Hollywood Angel',
    type = '["movieStar"]'
WHERE person = 'Audrey-Hepburn';

-- Daniel-Day-Lewis (Type 5 - Movie Star)
UPDATE blogs_famous_people 
SET enneagram = '5',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Daniel Day-Lewis- The Obsessive Method Actor Who Disappeared Into Characters',
    description = 'Explore Daniel Day-Lewis'' psychology of total immersion and identity dissolution, analyzing how his extreme preparation methods created unparalleled acting intensity.',
    meta_title = 'Daniel Day-Lewis'' Method Psychology: The Actor Who Completely Becomes Characters',
    type = '["movieStar"]'
WHERE person = 'Daniel-Day-Lewis';

-- Daniel-Radcliffe (Type 9 - New Movie Star)
UPDATE blogs_famous_people 
SET enneagram = '9',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Daniel Radcliffe- The Child Star Who Escaped the Harry Potter Curse',
    description = 'Analyze Daniel Radcliffe''s psychology of humble adaptation and careful career choices, exploring how he avoided child star destruction through measured decisions.',
    meta_title = 'Daniel Radcliffe''s Escape Psychology: How Harry Potter Avoided Child Star Curse',
    type = '["newMovieStar"]'
WHERE person = 'Daniel-Radcliffe';

-- the-Weeknd (Type 4 - Musician)
UPDATE blogs_famous_people 
SET enneagram = '4',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'The Weeknd- The Dark Prince Who Made Depression Mainstream',
    description = 'Discover The Weeknd''s psychology of transforming pain into art and commercial success, analyzing how his emotional darkness created the sound of modern heartbreak.',
    meta_title = 'The Weeknd''s Depression Psychology: How Darkness Became Pop Music Gold',
    type = '["musician"]'
WHERE person = 'the-Weeknd';

-- Shawn-Mendes (Type 9 - Musician)
UPDATE blogs_famous_people 
SET enneagram = '9',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Shawn Mendes- The Anxious Heartthrob Who Broke Under Pressure',
    description = 'Explore Shawn Mendes'' psychology of people-pleasing and anxiety management, analyzing how his conflict-avoidant nature led to career breaks and mental health struggles.',
    meta_title = 'Shawn Mendes'' Anxiety Psychology: Pop Star Pressure and Mental Health Breaks',
    type = '["musician"]'
WHERE person = 'Shawn-Mendes';

-- Peter-Attia (Type 1 - Techie)
UPDATE blogs_famous_people 
SET enneagram = '1',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Peter Attia- The Perfectionist Doctor Obsessed with Living Forever',
    description = 'Analyze Peter Attia''s psychology of systematic health optimization and mortality anxiety, exploring how his perfectionist standards revolutionized longevity medicine.',
    meta_title = 'Peter Attia''s Longevity Psychology: Doctor''s Perfectionist Path to Immortality',
    type = '["techie"]'
WHERE person = 'Peter-Attia';

-- Tyler-Cowen (Type 5 - Techie)
UPDATE blogs_famous_people 
SET enneagram = '5',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Tyler Cowen- The Intellectual Omnivore Who Reads Everything',
    description = 'Discover Tyler Cowen''s psychology of information consumption and pattern recognition, analyzing how his intellectual curiosity shaped economics blogging and cultural commentary.',
    meta_title = 'Tyler Cowen''s Information Psychology: The Economist Who Reads Everything',
    type = '["techie"]'
WHERE person = 'Tyler-Cowen';

-- Bryce-Hall (Type 8 - Creator)
UPDATE blogs_famous_people 
SET enneagram = '8',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Bryce Hall- The Alpha Influencer Who Thrived on Drama',
    description = 'Explore Bryce Hall''s psychology of confrontational content and attention-seeking behavior, analyzing how his aggressive personality built TikTok fame through controversy.',
    meta_title = 'Bryce Hall''s Drama Psychology: Alpha Influencer''s Confrontational Success Strategy',
    type = '["creator"]'
WHERE person = 'Bryce-Hall';

-- Saagar-Enjeti (Type 3 - Other)
UPDATE blogs_famous_people 
SET enneagram = '3',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Saagar Enjeti- The Ambitious Journalist Who Built Independent Media Empire',
    description = 'Analyze Saagar Enjeti''s psychology of strategic career building and brand development, exploring how his ambition shaped independent political commentary success.',
    meta_title = 'Saagar Enjeti''s Ambition Psychology: Building Independent Media Empire Strategy',
    type = '["other"]'
WHERE person = 'Saagar-Enjeti';

-- Edgar-Allan-Poe (Type 4 - Author)
UPDATE blogs_famous_people 
SET enneagram = '4',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Edgar Allan Poe- The Alcoholic Genius Who Invented Horror Literature',
    description = 'Discover Edgar Allan Poe''s psychology of transforming personal demons into literary immortality, analyzing how addiction and mental anguish created gothic masterpieces.',
    meta_title = 'Edgar Allan Poe''s Addiction Psychology: How Alcoholism Created Horror Genius',
    type = '["author"]'
WHERE person = 'Edgar-Allan-Poe';

-- Michael-Seibel (Type 1 - Techie)
UPDATE blogs_famous_people 
SET enneagram = '1',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Michael Seibel- The Systematic Builder Behind Startup Success Factory',
    description = 'Explore Michael Seibel''s psychology of systematic improvement and startup methodology, analyzing how his perfectionist approach shaped Y Combinator''s success rate.',
    meta_title = 'Michael Seibel''s System Psychology: Y Combinator''s Perfectionist Success Formula',
    type = '["techie"]'
WHERE person = 'Michael-Seibel';

-- J.K.-Rowling (Type 2 - Author)
UPDATE blogs_famous_people 
SET enneagram = '2',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'J.K. Rowling- The Single Mother Who Created Magic and Controversy',
    description = 'Analyze J.K. Rowling''s psychology of helping others through storytelling and moral conviction, exploring how her desire to protect children shaped both Harry Potter and transgender debates.',
    meta_title = 'J.K. Rowling''s Protection Psychology: Harry Potter Creator to Controversial Activist',
    type = '["author"]'
WHERE person = 'J.K.-Rowling';

-- Stephen-King (Type 5 - Author)
UPDATE blogs_famous_people 
SET enneagram = '5',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Stephen King- The Cocaine-Fueled Machine Who Conquered Horror',
    description = 'Discover Stephen King''s psychology of prolific output and addiction recovery, analyzing how his observation skills and personal demons created horror literature''s greatest empire.',
    meta_title = 'Stephen King''s Addiction Psychology: Cocaine-Fueled Horror Writing Machine',
    type = '["author"]'
WHERE person = 'Stephen-King';

-- Jonathan-Graff (Type 4 - New Movie Star)
UPDATE blogs_famous_people 
SET enneagram = '4',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Jonathan Groff- The Broadway Veteran Who Brings Authentic Emotion to Screen',
    description = 'Explore Jonathan Groff''s psychology of emotional authenticity and artistic integrity, analyzing how his theater background shaped his approach to diverse screen roles.',
    meta_title = 'Jonathan Groff''s Authenticity Psychology: Broadway Emotion to Screen Success',
    type = '["newMovieStar"]'
WHERE person = 'Jonathan-Graff';

-- Katharine-Hepburn (Type 8 - Movie Star)
UPDATE blogs_famous_people 
SET enneagram = '8',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Katharine Hepburn- The Rebellious Icon Who Refused to Play by Rules',
    description = 'Analyze Katharine Hepburn''s psychology of fierce independence and gender rebellion, exploring how her refusal to conform created Hollywood''s first true feminist icon.',
    meta_title = 'Katharine Hepburn''s Rebellion Psychology: Hollywood''s First Feminist Icon',
    type = '["movieStar"]'
WHERE person = 'Katharine-Hepburn';

-- Charli-D'Amelio (Type 9 - TikToker)
UPDATE blogs_famous_people 
SET enneagram = '9',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Charli D''Amelio- The Accidental Icon Who Never Asked for Fame',
    description = 'Discover Charli D''Amelio''s psychology of reluctant stardom and family dynamics, analyzing how her desire for normalcy conflicts with unprecedented TikTok success.',
    meta_title = 'Charli D''Amelio''s Reluctant Psychology: TikTok Star Who Never Wanted Fame',
    type = '["tiktoker"]'
WHERE person = 'Charli-D''Amelio';

-- Ninja (Type 3 - Creator)
UPDATE blogs_famous_people 
SET enneagram = '3',
    lastmod = '2025-06-25',
    date = '2025-06-25',
    title = 'Ninja- The Gaming Workaholic Who Turned Fortnite Into Fortune',
    description = 'Explore Ninja''s psychology of competitive obsession and brand building, analyzing how his relentless gaming schedule and strategic partnerships revolutionized gaming influence.',
    meta_title = 'Ninja''s Gaming Psychology: Fortnite Obsession to Multi-Million Dollar Empire',
    type = '["creator"]'
WHERE person = 'Ninja';

-- Verify all updates
SELECT person, enneagram, title, meta_title 
FROM blogs_famous_people 
WHERE person IN (
    'Drake', 'John-Lennon', 'Eddie-Murphy', 'Tim-Robinson', 'Lele-Pons', 'Lisa-Koshy', 'Nikki-Glaser',
    'KSI', 'Richard-Simmons', 'Emma-Stone', 'Pelosi-Schumer-dynamic', 'Camila-Cabello', 'Pete-Buttigieg',
    'Tom-Hanks', 'Dixie-D''Amelio', 'Kendrick-Lamar', 'Abraham-Lincoln', 'Josh-Richards', 'Gigi-Hadid',
    'Janelle-Monae', 'Morgan-Wallen', 'Tony-Robbins', 'Bella-Poarch', 'Julia-Roberts', 'Addison-Rae',
    'Martha-Stewart', 'Sean-Penn', 'Vincent-van-Gogh', 'Tana-Mongeau', 'Mark-Twain', 'Corina-Conf',
    'Patrick-Starr', 'Amy-Poehler', 'James-Charles', 'Mindy-Kaling', 'Jennifer-Aniston', 'Ava-Max',
    'Jennifer-Lopez', 'Lizzo', 'Judge-Judy', 'David-Goggins', 'Greta-Thunberg', 'Jordan-Peterson',
    'Kabib', 'Steve-Irwin', 'Ted-Bundy', 'Princess-Diana', 'Robert-F-Kennedy-Jr', 'Ron-DeSantis',
    'Nicole-Kidman', 'Chamath-Palihapitiya', 'Dalton-Cadwell', 'Marie-Kondo', 'Sean-Connery',
    'David-Friedberg', 'Lea-Michele', 'Jenna-Marbles', 'Krystal-Ball', 'Jackson-Wang', 'Audrey-Hepburn',
    'Daniel-Day-Lewis', 'Daniel-Radcliffe', 'the-Weeknd', 'Shawn-Mendes', 'Peter-Attia', 'Tyler-Cowen',
    'Bryce-Hall', 'Saagar-Enjeti', 'Edgar-Allan-Poe', 'Michael-Seibel', 'J.K.-Rowling', 'Stephen-King',
    'Jonathan-Graff', 'Katharine-Hepburn', 'Charli-D''Amelio', 'Ninja'
)
ORDER BY person;

COMMIT;