-- Migration: Add persona_titles to famous people
-- Created: 2026-01-18
-- Purpose: Workshop file for persona_titles - each title should be unique and subtly enneagram-inspired
--
-- ENNEAGRAM THEMES TO WEAVE IN (avoid stereotypical words):
-- Type 1: reform, standards, integrity, crusade, principle, moral compass
-- Type 2: giving, heart, connection, warmth, nurture, devotion
-- Type 3: image, adaptation, performance, reinvention, climb, shine
-- Type 4: depth, authenticity, longing, uniqueness, melancholy, soul
-- Type 5: knowledge, systems, mastery, withdrawal, expertise, mind
-- Type 6: loyalty, vigilance, trust, courage, questioning, solidarity
-- Type 7: possibility, spark, escape, adventure, joy, restlessness
-- Type 8: power, protection, intensity, force, justice, dominance
-- Type 9: harmony, steadiness, merging, calm, presence, bridge

-- ============================================
-- TYPE 1: THE PERFECTIONIST (16 people)
-- Theme: Standards, reform, moral compass, integrity
-- ============================================

UPDATE blogs_famous_people SET persona_title = 'Tech''s Uncompromising Visionary'
WHERE person = 'Steve-Jobs';
-- Original: "Tech's Demanding Father"

UPDATE blogs_famous_people SET persona_title = 'America''s Moral Compass'
WHERE person = 'Michelle-Obama';
-- Original: "America's Moral North Star"

UPDATE blogs_famous_people SET persona_title = 'The Order Evangelist'
WHERE person = 'Jordan-Peterson';
-- Original: "The Meaning Mapper"

UPDATE blogs_famous_people SET persona_title = 'The Worldbuilder Under Siege'
WHERE person = 'J.K.-Rowling';
-- Original: "The Controversial Worldbuilder"

UPDATE blogs_famous_people SET persona_title = 'The Over-Prepared Candidate'
WHERE person = 'Hillary-Clinton';
-- Original: "The Prepared Candidate"

UPDATE blogs_famous_people SET persona_title = 'Cinema''s Voice of Conscience'
WHERE person = 'Morgan-Freeman';
-- Original: "Cinema's Moral Voice"

UPDATE blogs_famous_people SET persona_title = 'The Dissenting Icon'
WHERE person = 'Ruth-Bader-Ginsburg';
-- Original: "The Dissenting Icon"

UPDATE blogs_famous_people SET persona_title = 'Climate''s Unrelenting Crusader'
WHERE person = 'Greta-Thunberg';
-- Original: "Climate's Uncompromising Prophet"

UPDATE blogs_famous_people SET persona_title = 'The Principled Steward'
WHERE person = 'Tim-Cook';
-- Original: "The Principled Successor"

UPDATE blogs_famous_people SET persona_title = 'Hogwarts'' Real-World Prefect'
WHERE person = 'Emma-Watson';
-- Original: "The Activist Ingenue"

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Scholarly Conscience'
WHERE person = 'Natalie-Portman';
-- Original: "The Scholarly Starlet"

UPDATE blogs_famous_people SET persona_title = 'Wellness''s Unapologetic Evangelist'
WHERE person = 'Gwyneth-Paltrow';
-- Original: "Wellness's Controversial Godmother"

UPDATE blogs_famous_people SET persona_title = 'The Everything Optimizer'
WHERE person = 'Jeff-Bezos';
-- Original: "The Relentless Optimizer"

UPDATE blogs_famous_people SET persona_title = 'The Immaculately Curated'
WHERE person = 'Blake-Lively';
-- Original: "The Curated Queen"

UPDATE blogs_famous_people SET persona_title = 'The Earnest Overachiever'
WHERE person = 'Anne-Hathaway';
-- Original: "Hollywood's Earnest Overachiever"

UPDATE blogs_famous_people SET persona_title = 'The Organic Kardashian'
WHERE person = 'Kourtney-Kardashian';
-- Original: "The Wellness Kardashian"

-- ============================================
-- TYPE 2: THE HELPER (17 people)
-- Theme: Heart, giving, connection, warmth, devotion
-- ============================================

UPDATE blogs_famous_people SET persona_title = 'The Neighborhood Saint'
WHERE person = 'Mr-Rogers';
-- Original: "The Neighborhood Saint"

UPDATE blogs_famous_people SET persona_title = 'America''s Confessor'
WHERE person = 'Oprah-Winfrey';
-- Original: "America's Empathy Queen"

UPDATE blogs_famous_people SET persona_title = 'The People''s Princess'
WHERE person = 'Princess-Diana';
-- Original: "The People's Princess" (iconic, keep it)

UPDATE blogs_famous_people SET persona_title = 'Pop''s Tender Heartthrob'
WHERE person = 'Harry-Styles';
-- Original: "Pop's Gentle Heartthrob"

UPDATE blogs_famous_people SET persona_title = 'The Vanishing Chameleon'
WHERE person = 'Meryl-Streep';
-- Original: "The Chameleonic Caretaker"

UPDATE blogs_famous_people SET persona_title = 'The Servant President'
WHERE person = 'Jimmy-Carter';
-- Original: "The Servant President"

UPDATE blogs_famous_people SET persona_title = 'The Gallant Gentleman'
WHERE person = 'Tom-Hiddleston';
-- Original: "The Charming Gentleman"

UPDATE blogs_famous_people SET persona_title = 'America''s Approachable Mom'
WHERE person = 'Jennifer-Garner';
-- Original: "America's Relatable Mom"

UPDATE blogs_famous_people SET persona_title = 'The Bubbly Crusader'
WHERE person = 'Kristen-Bell';
-- Original: "The Bubbly Advocate"

UPDATE blogs_famous_people SET persona_title = 'The Devoted Fanboy'
WHERE person = 'Henry-Cavill';
-- Original: "The Devoted Fanboy"

UPDATE blogs_famous_people SET persona_title = 'The Empathizer-in-Chief'
WHERE person = 'Joe-Biden';
-- Original: "The Empathizer-in-Chief"

UPDATE blogs_famous_people SET persona_title = 'The Spotlight Samaritan'
WHERE person = 'Meghan-Markle';
-- Original: "The Spotlight Humanitarian"

UPDATE blogs_famous_people SET persona_title = 'Gen Z''s Heartbreak Translator'
WHERE person = 'Olivia-Rodrigo';
-- Original: "Gen Z's Heartbreak Voice"

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Youngest Ambassador'
WHERE person = 'Millie-Bobby-Brown';
-- Original: "The Young Ambassador"

UPDATE blogs_famous_people SET persona_title = 'The Devoted First Lady'
WHERE person = 'Nancy-Reagan';
-- Original: "The Protective First Lady"

UPDATE blogs_famous_people SET persona_title = 'Ireland''s Quiet Gift'
WHERE person = 'Saoirse-Ronan';
-- Original: "Ireland's Quiet Gift"

UPDATE blogs_famous_people SET persona_title = 'The Star Who Lifts Others'
WHERE person = 'Margot-Robbie';
-- Original: "The Golden Producer"

-- ============================================
-- TYPE 3: THE ACHIEVER (32 people)
-- Theme: Image, reinvention, performance, climb, shine
-- ============================================

UPDATE blogs_famous_people SET persona_title = 'Pop''s Heartbreak Alchemist'
WHERE person = 'Taylor-Swift';
-- Original: Already in system

UPDATE blogs_famous_people SET persona_title = 'Fame''s Self-Made Architect'
WHERE person = 'Kim-Kardashian';
-- Original: "Fame's Architect"

UPDATE blogs_famous_people SET persona_title = 'The Hustle Prophet'
WHERE person = 'Gary-Vee';
-- Original: "The Hustle Prophet"

UPDATE blogs_famous_people SET persona_title = 'Toronto''s Hits Algorithm'
WHERE person = 'Drake';
-- Original: "The Hits Algorithm"

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Ageless Machine'
WHERE person = 'Tom-Cruise';
-- Original: "Hollywood's Ageless Workhorse"

UPDATE blogs_famous_people SET persona_title = 'The Hardest Worker in Any Room'
WHERE person = 'Dwayne-Johnson';
-- Original: "The Hardest Worker in the Room"

UPDATE blogs_famous_people SET persona_title = 'The Self-Made Titan'
WHERE person = 'Arnold-Schwarzenegger';
-- Original: "The Self-Made Titan"

UPDATE blogs_famous_people SET persona_title = 'The Transformation Salesman'
WHERE person = 'Tony-Robbins';
-- Original: "The Transformation Salesman"

UPDATE blogs_famous_people SET persona_title = 'The Calculated Charmer'
WHERE person = 'Will-Smith';
-- Original: "The Calculated Charmer"

UPDATE blogs_famous_people SET persona_title = 'The Relentless Reinventor'
WHERE person = 'Jennifer-Lopez';
-- Original: "The Relentless Reinventor"

UPDATE blogs_famous_people SET persona_title = 'Controversy''s Cash Machine'
WHERE person = 'Jake-Paul';
-- Original: "Controversy's Cash Machine"

UPDATE blogs_famous_people SET persona_title = 'The Redemption Entrepreneur'
WHERE person = 'Logan-Paul';
-- Original: "The Redemption Entrepreneur"

UPDATE blogs_famous_people SET persona_title = 'The Original Influencer'
WHERE person = 'Paris-Hilton';
-- Original: "The Original Influencer"

UPDATE blogs_famous_people SET persona_title = 'The Reformed Prodigy'
WHERE person = 'Justin-Bieber';
-- Original: "The Reformed Prodigy"

UPDATE blogs_famous_people SET persona_title = 'Pop''s Vocal Technician'
WHERE person = 'Ariana-Grande';
-- Original: "The Vocal Perfectionist"

UPDATE blogs_famous_people SET persona_title = 'The Acquisition Architect'
WHERE person = 'Alex-Hormozi';
-- Original: "The Acquisition Artist"

UPDATE blogs_famous_people SET persona_title = 'TikTok''s First Crossover'
WHERE person = 'Addison-Rae';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Streaming''s Chaos Agent'
WHERE person = 'Adin-Ross';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'The It Girl Engineer'
WHERE person = 'Alix-Earle';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'The Image on Trial'
WHERE person = 'Amber-Heard';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Disco''s Polished Revival'
WHERE person = 'Dua-Lipa';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'The Effortless It Girl'
WHERE person = 'Hailey-Bieber';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Beauty''s Controversial King'
WHERE person = 'James-Charles';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Silicon Valley''s Hype Man'
WHERE person = 'Jason-Calacanis';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Wednesday''s Breakout Star'
WHERE person = 'Jenna-Ortega';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Canada''s Polished Prince'
WHERE person = 'Justin-Trudeau';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'The Historic Trailblazer'
WHERE person = 'Kamala-Harris';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'The Operator Behind the Brand'
WHERE person = 'Leila-Hormozi';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'The Leading Man Reborn'
WHERE person = 'Michael-B-Jordan';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'The Power Broker'
WHERE person = 'Nancy-Pelosi';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Pop''s Petite Powerhouse'
WHERE person = 'Sabrina-Carpenter';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Golden Ingenue'
WHERE person = 'Sydney-Sweeney';
-- Original: (new)

-- ============================================
-- TYPE 4: THE INDIVIDUALIST (26 people)
-- Theme: Depth, authenticity, longing, soul, melancholy
-- ============================================

UPDATE blogs_famous_people SET persona_title = 'Fashion''s Otherworldly Muse'
WHERE person = 'Anya-Taylor-Joy';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'The Runway''s Reclusive Soul'
WHERE person = 'Bella-Hadid';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Gen Z''s Whispered Rebellion'
WHERE person = 'Billie-Eilish';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Rock''s Eternal Shapeshifter'
WHERE person = 'Bob-Dylan';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'The Deadpan Disruptor'
WHERE person = 'Bobbi-Althoff';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Vlogging''s Restless Artist'
WHERE person = 'Casey-Neistat';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Pop''s Pitch-Perfect Purist'
WHERE person = 'Charlie-Puth';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Pop''s Unfiltered Survivor'
WHERE person = 'Demi-Lovato';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'The Reluctant D''Amelio'
WHERE person = 'Dixie-D''Amelio';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Rock''s Flamboyant Phoenix'
WHERE person = 'Elton-John';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Pain''s Unapologetic Canvas'
WHERE person = 'Frida-Kahlo';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Folk''s Melancholic Poet'
WHERE person = 'Hozier';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'America''s Tragic Elegance'
WHERE person = 'Jackie-Kennedy';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Method Mystic'
WHERE person = 'Jared-Leto';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Cinema''s Tortured Method Man'
WHERE person = 'Joaquin-Phoenix';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Beautiful Outsider'
WHERE person = 'Johnny-Depp';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Compton''s Lyrical Conscience'
WHERE person = 'Kendrick-Lamar';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Pop''s Avant-Garde Mother'
WHERE person = 'Lady-Gaga';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Nostalgia''s Melancholic Queen'
WHERE person = 'Lana-Del-Rey';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Pop''s Haunted Ingenue'
WHERE person = 'Madison-Beer';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Pop''s Chameleon Provocateur'
WHERE person = 'Miley-Cyrus';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Ethereal Enigma'
WHERE person = 'Nicole-Kidman';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Electricity''s Tortured Genius'
WHERE person = 'Nikola-Tesla';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Funk''s Purple Enigma'
WHERE person = 'Prince';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'The Father of the Atom''s Guilt'
WHERE person = 'Robert-Oppenheimer';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Brooding Anti-Star'
WHERE person = 'Robert-Pattinson';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'AI''s Anxious Prophet'
WHERE person = 'Sam-Altman';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Comedy''s Cringe Auteur'
WHERE person = 'Tim-Robinson';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Pop''s Mysterious Recluse'
WHERE person = 'Zayn-Malik';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Cool-Girl Heir'
WHERE person = 'Zoe-Kravitz';
-- Original: (new)

-- ============================================
-- TYPE 5: THE INVESTIGATOR (16 people)
-- Theme: Knowledge, systems, mastery, expertise, mind
-- ============================================

UPDATE blogs_famous_people SET persona_title = 'Mystery''s Methodical Mind'
WHERE person = 'Agatha-Christie';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Neuroscience''s Protocol King'
WHERE person = 'Andrew-Huberman';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Tech''s Methodical Mogul'
WHERE person = 'Bill-Gates';
-- Original: "The Methodical Mogul"

UPDATE blogs_famous_people SET persona_title = 'Cinema''s Intense Recluse'
WHERE person = 'Cillian-Murphy';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Silicon Valley''s Cold Strategist'
WHERE person = 'David-Sacks';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Tech''s Mad Scientist'
WHERE person = 'Elon-Musk';
-- Original: "Tech's Mad Scientist"

UPDATE blogs_famous_people SET persona_title = 'Philosophy''s Dark Prophet'
WHERE person = 'Friedrich-Nietzsche';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Fantasy''s Slow-Burning Architect'
WHERE person = 'George-RR-Martin';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Tech''s Silent Minimalist'
WHERE person = 'Jack-Dorsey';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Podcasting''s Curious Monk'
WHERE person = 'Lex-Fridman';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Ideas'' Popular Translator'
WHERE person = 'Malcolm-Gladwell';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'The Social Architect'
WHERE person = 'Mark-Zuckerberg';
-- Original: "The Social Architect"

UPDATE blogs_famous_people SET persona_title = 'Gaming''s Introverted King'
WHERE person = 'PewDiePie';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Power''s Cold Cartographer'
WHERE person = 'Robert-Greene';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Quiet Intensity'
WHERE person = 'Rooney-Mara';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Comedy''s Brainy Architect'
WHERE person = 'Tina-Fey';
-- Original: (new)

-- ============================================
-- TYPE 6: THE LOYALIST (17 people)
-- Theme: Loyalty, vigilance, trust, courage, questioning
-- ============================================

UPDATE blogs_famous_people SET persona_title = 'The Progressive Firebrand'
WHERE person = 'Alexandria-Ocasio-Cortez';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Comedy''s Deadpan Skeptic'
WHERE person = 'Aubrey-Plaza';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Daytime''s Fallen Sweetheart'
WHERE person = 'Ellen-Degeneres';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Detroit''s Anxious Assassin'
WHERE person = 'Eminem';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'The Steady Patriarch'
WHERE person = 'George-H-W-Bush';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'The Reluctant Wartime President'
WHERE person = 'George-W-Bush';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'The Loyal Sister'
WHERE person = 'Khloe-Kardashian';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Fragile Icon'
WHERE person = 'Marilyn-Monroe';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Television''s Beloved Guardian'
WHERE person = 'Pedro-Pascal';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Silicon Valley''s Paranoid Billionaire'
WHERE person = 'Peter-Thiel';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Twitch''s Trusted Big Sister'
WHERE person = 'Pokimane';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'The Restless Royal'
WHERE person = 'Prince-Harry';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Cinema''s Anxious Heartthrob'
WHERE person = 'Timothee-Chalamet';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'America''s Trusted Dad'
WHERE person = 'Tom-Hanks';
-- Original: "America's Trusted Dad"

UPDATE blogs_famous_people SET persona_title = 'Comedy''s Global Translator'
WHERE person = 'Trevor-Noah';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Media''s Contrarian Watchdog'
WHERE person = 'Tucker-Carlson';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Careful Chameleon'
WHERE person = 'Zendaya';
-- Original: (new)

-- ============================================
-- TYPE 7: THE ENTHUSIAST (28 people)
-- Theme: Possibility, spark, adventure, joy, restlessness
-- ============================================

UPDATE blogs_famous_people SET persona_title = 'Podcasting''s Unfiltered Queen'
WHERE person = 'Alex-Cooper';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Comedy''s Provocative Spark'
WHERE person = 'Andrew-Schulz';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Music''s Quiet Wanderer'
WHERE person = 'Ashby';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Reggaeton''s Restless Pioneer'
WHERE person = 'Bad-Bunny';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Vlogging''s Manic Ringleader'
WHERE person = 'David-Dobrik';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Rap''s Eclectic Firecracker'
WHERE person = 'Doechii';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Pop''s Unpredictable Shapeshifter'
WHERE person = 'Doja-Cat';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'YouTube''s Anxious It Girl'
WHERE person = 'Emma-Chamberlain';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Music''s Techno-Futurist'
WHERE person = 'Grimes';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Boundless Showman'
WHERE person = 'Hugh-Jackman';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Relatable Goofball'
WHERE person = 'Jennifer-Lawrence';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Late Night''s Eternal Cheerleader'
WHERE person = 'Jimmy-Fallon';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Camelot''s Golden Son'
WHERE person = 'John-F-Kennedy';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Comedy''s Political Conscience'
WHERE person = 'Jon-Stewart';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Streaming''s Chaotic Energy'
WHERE person = 'Kai-Cenat';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Genius''s Manic Prophet'
WHERE person = 'Kanye';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Pop''s Technicolor Optimist'
WHERE person = 'Katy-Perry';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Comedy''s Unstoppable Engine'
WHERE person = 'Kevin-Hart';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Eternal Bachelor'
WHERE person = 'Leonardo-DiCaprio';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Cocky Underdog'
WHERE person = 'Miles-Teller';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Defense Tech''s Eccentric Evangelist'
WHERE person = 'Palmer-Luckey';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Startups'' Curious Philosopher'
WHERE person = 'Paul-Graham';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Comeback Alchemist'
WHERE person = 'Robert-Downey-Jr';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Wit Machine'
WHERE person = 'Ryan-Reynolds';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Comedy''s Southern Mystic'
WHERE person = 'Theo-Von';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Podcasting''s Absurdist King'
WHERE person = 'Tim-Dillon';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Marvel''s Boyish Charm'
WHERE person = 'Tom-Holland';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Streaming''s Manic Marathoner'
WHERE person = 'xQc';
-- Original: (new)

-- ============================================
-- TYPE 8: THE CHALLENGER (24 people)
-- Theme: Power, protection, intensity, force, justice
-- ============================================

UPDATE blogs_famous_people SET persona_title = 'Comedy''s Fierce Ringleader'
WHERE person = 'Amy-Poehler';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Pop''s Untouchable Queen'
WHERE person = 'Beyonce-Knowles';
-- Original: "Pop's Untouchable Queen"

UPDATE blogs_famous_people SET persona_title = 'Pop''s Unapologetic Rebel'
WHERE person = 'Chappell-Roan';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Comedy''s Unfiltered Truth-Teller'
WHERE person = 'Chelsea-Handler';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Media''s Unapologetic Brawler'
WHERE person = 'Dave-Portnoy';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Quiet Force'
WHERE person = 'Denzel-Washington';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'America''s Disruptor-in-Chief'
WHERE person = 'Donald-Trump';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Comedy''s Stone-Faced Titan'
WHERE person = 'Druski';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'The Intellectual Provocateur'
WHERE person = 'Emily-Ratajkowski';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Pop''s Fierce Survivor'
WHERE person = 'Halsey';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Twitch''s Political Firebrand'
WHERE person = 'Hasan-Piker';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Streaming''s Unhinged Speedster'
WHERE person = 'IShowSpeed';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Discipline''s Uncompromising Voice'
WHERE person = 'Jocko-Willink';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Podcasting''s Alpha Interrogator'
WHERE person = 'Joe-Rogan';
-- Original: "Podcasting's Alpha Dog"

UPDATE blogs_famous_people SET persona_title = 'Justice''s Uncompromising Voice'
WHERE person = 'Malcolm-X';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Justice''s Nonviolent Warrior'
WHERE person = 'Martin-Luther-King-Jr';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'YouTube''s Philanthropic Titan'
WHERE person = 'Mr-Beast';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Streaming''s Silent Disruptor'
WHERE person = 'Reed-Hastings';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Pop''s Unbothered Mogul'
WHERE person = 'Rihanna';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Volatile Force'
WHERE person = 'Shia-LaBeouf';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Cinema''s Quiet Menace'
WHERE person = 'Tom-Hardy';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Russia''s Cold Strategist'
WHERE person = 'Vladimir-Putin';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Britain''s Bulldog'
WHERE person = 'Winston-Churchill';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'China''s Iron Hand'
WHERE person = 'Xi-Jinping';
-- Original: (new)

-- ============================================
-- TYPE 9: THE PEACEMAKER (21 people)
-- Theme: Harmony, steadiness, merging, calm, presence
-- ============================================

UPDATE blogs_famous_people SET persona_title = 'America''s Reluctant Savior'
WHERE person = 'Abraham-Lincoln';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Television''s Quiet Anchor'
WHERE person = 'Alexis-Bledel';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'America''s Bridge-Builder'
WHERE person = 'Barack-Obama';
-- Original: "The Bridge-Builder President"

UPDATE blogs_famous_people SET persona_title = 'Politics'' Stubborn Idealist'
WHERE person = 'Bernie-Sanders';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Easygoing Enigma'
WHERE person = 'Brad-Pitt';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'TikTok''s Accidental Queen'
WHERE person = 'Charli-D''Amelio';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Comedy''s Unbothered Philosopher'
WHERE person = 'Dave-Chappelle';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Gentle Warrior'
WHERE person = 'Keanu-Reeves';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'The Quiet Kardashian Empire'
WHERE person = 'Kylie-Jenner';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Laid-Back Philosopher'
WHERE person = 'Matthew-McConaughey';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Indie''s Unassuming Breakout'
WHERE person = 'Mikey-Madison';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Comedy''s Lovable Mess'
WHERE person = 'Pete-Davidson';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Genre''s Gentle Giant'
WHERE person = 'Post-Malone';
-- Original: "Genre's Gentle Giant"

UPDATE blogs_famous_people SET persona_title = 'The Steady Crown'
WHERE person = 'Queen-Elizabeth-II';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'America''s Sunny Grandfather'
WHERE person = 'Ronald-Reagan';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Quiet Heartthrob'
WHERE person = 'Ryan-Gosling';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hollywood''s Effortless Star'
WHERE person = 'Scarlett-Johansson';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Pop''s Steady Presence'
WHERE person = 'Selena-Gomez';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Comedy''s Sleepy Provocateur'
WHERE person = 'Shane-Gillis';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Tech''s Calm Helmsman'
WHERE person = 'Sundar-Pichai';
-- Original: (new)

UPDATE blogs_famous_people SET persona_title = 'Hip-Hop''s Ambient Architect'
WHERE person = 'Travis-Scott';
-- Original: (new)
