// src/lib/personalityCategories.ts
// One category page per v3 taxonomy field. Membership (home field plus second careers) is
// computed server-side in $lib/server/personalityCategoryData.ts. This module ships to the
// browser, so it reads only the small vocabulary file, never the 170KB people labels.
import taxonomy from './data/peopleTaxonomy.json';
import { formatPersonalityDisplayName } from '$lib/utils/personalityAnalysis';
export { normalizePeopleTypes } from './peopleTypes';

export const PERSONALITY_CATEGORY_SLUGS = [
	'film-tv',
	'music',
	'comedy',
	'creator-media',
	'hosts-media',
	'sports',
	'technology',
	'business',
	'politics-public',
	'royals-reality',
	'authors-thinkers',
	'fashion',
	'self-help',
	'faith-spirituality',
	'crime-notoriety'
] as const;

export type PersonalityCategorySlug = (typeof PERSONALITY_CATEGORY_SLUGS)[number] | 'tech-business';

export interface PersonalityCategoryDefinition {
	slug: PersonalityCategorySlug;
	label: string;
	shortLabel: string;
	summary: string;
	intro: string;
	groupingDescription: string;
	seoTitle: string;
	seoDescription: string;
	seoKeywords: string[];
	/**
	 * 100–150 word paragraph rendered visibly under the hero lede.
	 * Should organically include 2–3 seoKeywords and read like value-dense
	 * editorial copy, not a meta description rephrase.
	 */
	seoIntro: string;
	seoFaqs: Array<{ question: string; answer: string }>;
	/**
	 * Optional absolute URL to a per-category OG/Twitter card.
	 * Falls back to the brand-wide social card when omitted.
	 * Should be a 1200×628 image hosted under https://9takes.com/.
	 */
	ogImage?: string;
	accent: string;
	accentSoft: string;
	/** v3 taxonomy fields (src/lib/data/peopleTaxonomy.json) whose people live on this page:
	 * everyone filed there, plus people with a second career there. */
	fields: string[];
	related: PersonalityCategorySlug[];
}

// Existing links to the former combined category still open its collection.
const LEGACY_TECH_BUSINESS: PersonalityCategoryDefinition = {
	slug: 'tech-business',
	label: 'Tech, Founders & Business',
	shortLabel: 'Tech & Business',
	summary:
		'Founders, CEOs, investors, and operators whose psychology shapes products, companies, and strategy.',
	intro:
		'Founders and operators reveal how personality handles leverage, risk, optimization, control, long-term strategy, and the pressure to turn identity into systems.',
	groupingDescription:
		'Splits the category into big-tech CEOs, investors, frontier builders, operators, and tech interpreters.',
	seoTitle: 'Founder & CEO Enneagram Types: Tech & Business | 9takes',
	seoDescription:
		'Founder personality types, decoded: tech CEOs, investors, and operators through the Enneagram. Compare how each type handles ambition, control, and risk.',
	seoKeywords: [
		'founder personality types',
		'tech ceo enneagram',
		'startup founder personality analysis',
		'investor enneagram',
		'business leader personality types'
	],
	seoIntro:
		'Founder personality types reveal how leverage, control, and long-term strategy actually operate. The tech CEO Enneagram lens on this page covers public-company chiefs, frontier builders in AI and defense, operators, investors, and tech-media interpreters — high-agency people whose psychology gets compounded by capital, distribution, and time. Comparing startup founder personality analysis side by side with public-company operators makes one thing obvious: the same trait that builds a company can wreck the next stage of it. Investor Enneagram profiles add the capital-allocator angle — pattern matching, conviction, contrarianism, and risk tolerance — so you can see how money and operating styles map differently. Read this category for business leader personality types whose decisions ripple far beyond the org chart.',
	seoFaqs: [
		{
			question: 'What people are included in Tech, Founders & Business?',
			answer:
				'The category covers tech founders, public-company CEOs, investors, operators, frontier builders, and business personalities whose psychology shapes systems, products, and strategy.'
		},
		{
			question: 'Why compare founders and operators together?',
			answer:
				'Putting builders, capital allocators, and operators side by side makes it easier to compare how different personalities handle leverage, risk, power, and long-term control.'
		},
		{
			question: 'How is the tech category subdivided?',
			answer:
				'It separates big-tech founders and CEOs, investors and strategists, frontier builders in AI or defense, operators and business builders, and tech-media interpreters.'
		}
	],
	accent: '#34d399',
	accentSoft: 'rgba(52, 211, 153, 0.18)',
	fields: ['tech', 'business'],
	related: ['technology', 'business', 'fashion']
};

const ACCENT_BY_PAGE = new Map(taxonomy.fields.map((field) => [field.page, field.accent]));
/** Field colour from the taxonomy (same accent the type-page map uses), plus an 18% tint. */
function withAccent(
	definition: Omit<PersonalityCategoryDefinition, 'accent' | 'accentSoft'>
): PersonalityCategoryDefinition {
	const accent = ACCENT_BY_PAGE.get(definition.slug) ?? '';
	const n = Number.parseInt(accent.slice(1), 16);
	const accentSoft = `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, 0.18)`;
	return { ...definition, accent, accentSoft };
}

const BASE_DEFINITIONS: Omit<PersonalityCategoryDefinition, 'accent' | 'accentSoft'>[] = [
	{
		slug: 'film-tv',
		label: 'Film, TV & Stage',
		shortLabel: 'Film & TV',
		summary:
			'Actors, directors and live performers whose work is watched on a screen or from a theater seat.',
		intro:
			'Actors spend their careers becoming other people, which makes the habits they can never drop easier to spot. Directors show their type in what they refuse to hand over.',
		groupingDescription:
			'Browse actors (including voice and anime actors), directors and showrunners, and stage performers from Broadway and theatre, dance, and magic.',
		seoTitle: 'Actor & Director Enneagram Types: Film, TV & Stage | 9takes',
		seoDescription:
			'Actor Enneagram types, read from interviews and career choices instead of roles. Compare movie stars, directors and stage performers across all nine types.',
		seoKeywords: [
			'actor enneagram types',
			'celebrity enneagram types',
			'movie star personality types',
			'director enneagram type',
			'famous actors personality analysis'
		],
		seoIntro:
			"An actor's job is to disappear into someone else, so the parts of a personality that never disappear are worth watching. Tom Cruise, typed here as a 3, has spent decades of press tours on the stunts he does himself. Keanu Reeves, a 9, keeps almost all of his private life out of the story. Both are enormously famous, and they spend that fame in opposite directions. The actor Enneagram types on this page are read from interviews, career risks and how each person handles scrutiny over many years. The characters they play count for very little. Directors get their own lane, because a director's type shows up in what they insist on controlling: Christopher Nolan (Type 5) still fights to shoot on film. Stage, dance and magic performers round out the page, so you can compare movie star personality types with people who perform without a second take.",
		seoFaqs: [
			{
				question: 'Are reality TV stars and talk show hosts on this page?',
				answer:
					'No. Reality stars now live on Royals, Famous Families & Reality, and talk show and podcast hosts live on Hosts & Media. An actor who also hosts a show can appear on both pages.'
			},
			{
				question: "Can you tell an actor's Enneagram type from their roles?",
				answer:
					'Rarely. Someone else wrote the part and someone else cast it. 9takes types actors from what repeats off camera: how they talk in interviews, which risks they take with their careers, how they react to criticism and what they protect.'
			},
			{
				question: 'Why are directors and stage performers grouped with actors?',
				answer:
					'They all make work people sit and watch, and they all deal with reviews, audiences and long stretches of uncertainty between jobs. Grouping them makes it easy to compare how different types handle that life from in front of and behind the camera.'
			}
		],
		fields: ['screen'],
		related: ['music', 'comedy', 'hosts-media']
	},
	{
		slug: 'music',
		label: 'Musicians & Artists',
		shortLabel: 'Music',
		summary: 'Singers, rappers, songwriters and record producers, grouped by the music they make.',
		intro:
			'Musicians are often where personality becomes the most theatrical: authenticity versus performance, creative obsession versus commercial pressure, vulnerability versus persona.',
		groupingDescription:
			'Browse by genre or by the artist’s work as a songwriter, producer or screen performer.',
		seoTitle: 'Musician Enneagram Types: Singers & Rappers | 9takes',
		seoDescription:
			'Explore musician Enneagram profiles across pop, rap, R&B, rock, country and alternative music, alongside singer-songwriters and record producers.',
		seoKeywords: [
			'musician personality types',
			'singer enneagram types',
			'rapper personality analysis',
			'pop star enneagram',
			'artist personality analysis'
		],
		seoIntro:
			'Musician personality types reveal where authenticity, persona, and ambition collide. Pop star Enneagram analysis on this page covers singers, rappers, alternative voices, and singer-songwriters whose public identity is inseparable from their music. Comparing rapper personality analysis next to indie songwriters and crossover artists makes the tension between commercial scale and creative obsession visible — and often shows why two artists with identical résumés have completely different relationships with fame. Each musician Enneagram profile is built around recurring patterns in lyrics, interviews, performance choices, and public conflict, not single moments. Use this category to ask why a given artist sounds like themselves, where the persona ends and the person begins, and which Enneagram types cope by writing.',
		seoFaqs: [
			{
				question: 'What kinds of artists are in the music category?',
				answer:
					'The music page includes recording artists, band members, singer-songwriters and producers. Some also work in film, television or online entertainment.'
			},
			{
				question: 'Why compare musicians by Enneagram type?',
				answer:
					'Music makes the tension between authenticity, persona, ambition, vulnerability, and performance unusually easy to compare across artists.'
			},
			{
				question: 'How is the music category subdivided?',
				answer:
					'You can browse pop, dance-pop, hip-hop and rap, R&B and soul, rock, alternative and art pop, or country and Americana. There are also groups for singer-songwriters, record producers and performers who work across music and screen media.'
			}
		],
		fields: ['music'],
		related: ['film-tv', 'creator-media', 'comedy']
	},
	{
		slug: 'comedy',
		label: 'Comedians',
		shortLabel: 'Comedy',
		summary:
			'Stand-ups, sketch comics, satirists, and crossover comedians where insecurity, aggression, absurdity, and social radar all sit close to the surface.',
		intro:
			'Comedy is a strong personality laboratory because the coping style is part of the performance. These profiles often expose shame, status games, intimacy avoidance, and honesty through humor.',
		groupingDescription:
			'Splits the library into stand-up headliners, sketch/TV comics, satire hosts, and internet-native comedians.',
		seoTitle: 'Comedian Enneagram Types: Stand-Up & Sketch Comics | 9takes',
		seoDescription:
			'Explore comedian personality analysis through the Enneagram, from stand-up headliners to sketch performers, satire hosts, and internet-native comics.',
		seoKeywords: [
			'comedian personality types',
			'stand up comedian enneagram',
			'comedy personality analysis',
			'satire host enneagram',
			'sketch comedian personality'
		],
		seoIntro:
			'Comedian personality types are a working laboratory for the Enneagram, because the coping style is the act. Stand-up comedian Enneagram analysis on this page includes headliners, sketch and TV comics, satire hosts, and internet-native comedians — performers whose insecurities, aggressions, status games, and honesty mechanisms are built into the material. Compare comedy personality analysis across lanes and the patterns get sharper: which comics use shame as fuel, which use absurdity as armor, which weaponize charm, and which use the stage as the only safe room they have. Each satire host Enneagram profile and sketch comedian personality breakdown is grounded in repeated behavior across specials, interviews, and persona shifts, not single jokes — because the long arc is where the type shows up.',
		seoFaqs: [
			{
				question: 'What kinds of comedians are included on this page?',
				answer:
					'The comedy category covers stand-up comics, sketch performers, satire hosts, and internet-native comedians analyzed through the Enneagram.'
			},
			{
				question: 'Why is comedy useful for personality analysis?',
				answer:
					'Comedy often turns coping style into performance, which makes insecurity, aggression, honesty, shame management, and social radar easier to spot.'
			},
			{
				question: 'How is the comedy category organized?',
				answer:
					'The page separates stand-up headliners, sketch and TV comics, satire hosts, and internet or podcast-driven comedy personalities.'
			}
		],
		fields: ['comedy'],
		related: ['film-tv', 'creator-media', 'music']
	},
	{
		slug: 'creator-media',
		label: 'Internet Creators',
		shortLabel: 'Creators',
		summary: 'YouTubers, streamers and influencers whose product is themselves online.',
		intro:
			'When the product is your own face, every upload is a personality test with a public score. Creators show what a type does when the feedback arrives in minutes and never stops.',
		groupingDescription:
			'Browse vlogs and stunts, streamers and gamers, commentary and reaction, education and explainers, lifestyle and beauty, fitness, and adult creators.',
		seoTitle: 'YouTuber & Streamer Enneagram Types: Creators | 9takes',
		seoDescription:
			'YouTuber and streamer Enneagram types, read from years of uploads and live streams. Compare MrBeast, Kai Cenat, PewDiePie and other creators by type.',
		seoKeywords: [
			'youtuber enneagram types',
			'streamer personality types',
			'influencer personality analysis',
			'mrbeast enneagram type',
			'content creator enneagram'
		],
		seoIntro:
			'Content creator Enneagram analysis has one big advantage: the creator is the product. A YouTuber who uploads for ten years leaves a longer behavioral record than most actors ever will. MrBeast, typed here as an 8, scaled challenge videos into a business by obsessing over what makes people click. Kai Cenat (7) built his following on marathon streams where boredom never gets a turn. PewDiePie (5) went the other way and stepped back from the platform that made him. The YouTuber Enneagram types and streamer personality types on this page are read from uploads, live streams and the moments a creator breaks character. Podcasters and interview hosts moved to their own page, Hosts & Media, so this one stays focused on people whose work is their own life on camera.',
		seoFaqs: [
			{
				question: 'Are podcasters included in Internet Creators?',
				answer:
					'Podcasters and interview hosts now have their own page, Hosts & Media. A creator who also runs a podcast, like Logan Paul, appears on both.'
			},
			{
				question: 'Why are creators useful for Enneagram typing?',
				answer:
					'They film themselves for years, often live and unedited, and they react to their audience in public. That gives far more evidence about what someone wants and fears than a handful of polished interviews.'
			},
			{
				question: 'How is the creator page organized?',
				answer:
					'By the kind of content a person makes: vlogs and stunts, streaming and gaming, commentary and reaction, education, lifestyle and beauty, fitness, and adult creators.'
			}
		],
		fields: ['creators'],
		related: ['hosts-media', 'comedy', 'fashion']
	},
	{
		slug: 'hosts-media',
		label: 'Hosts & Media',
		shortLabel: 'Hosts & Media',
		summary: 'Podcasters, TV hosts, journalists and commentators whose job is the conversation.',
		intro:
			'A host shows their type in the questions they ask and the ones they let slide. Hours of unscripted talk make any persona hard to hold.',
		groupingDescription:
			'Browse podcasters and interview hosts, TV hosts, political commentators, journalists and anchors, sports media, and business and tech media.',
		seoTitle: 'Podcaster & TV Host Enneagram Types | 9takes',
		seoDescription:
			'Enneagram types of podcasters, TV hosts and journalists. See how Joe Rogan, Oprah Winfrey and other hosts show their type in the questions they ask.',
		seoKeywords: [
			'podcaster enneagram',
			'joe rogan enneagram type',
			'tv host personality types',
			'journalist enneagram type',
			'oprah enneagram type'
		],
		seoIntro:
			'Podcaster Enneagram analysis has an unfair advantage: hosts talk for hours without a script, and the type leaks out. Joe Rogan, typed as an 8, runs three-hour conversations that go wherever the argument goes. Oprah Winfrey (2) built a talk show around getting guests to open up, and Howard Stern (6) has said therapy changed the way he interviews people. TV host personality types sit next to political commentators, journalists and sports voices like Stephen A. Smith (3), whose job is to take a strong position on live television every day. Compare them and a pattern appears. The questions a host keeps returning to usually say more about the host than the guest. Creators whose product is their own life on camera are on the Internet Creators page. This one is for people whose work is the conversation.',
		seoFaqs: [
			{
				question: 'Who is in Hosts & Media?',
				answer:
					'Podcasters and interview hosts, TV hosts, political commentators, journalists and anchors, and people who cover sports, business and tech.'
			},
			{
				question: 'Why are podcasters separate from YouTubers?',
				answer:
					"A creator's product is their own life and personality. A host's product is a conversation with someone else. The two jobs reward different strengths, so they get different pages, and people who do both appear on both."
			},
			{
				question: 'Can a host appear on another page?',
				answer:
					'Yes. Travis Kelce co-hosts New Heights with his brother Jason and appears here and on Sports. Comedians, scientists and founders with podcasts show up the same way.'
			}
		],
		fields: ['media'],
		related: ['creator-media', 'comedy', 'politics-public']
	},
	{
		slug: 'sports',
		label: 'Sports',
		shortLabel: 'Sports',
		summary: 'Athletes and coaches, filed by sport.',
		intro:
			'Sport strips a personality down to what someone does when the score is against them. These profiles read athletes through pressure, rivalry and how they talk after a loss.',
		groupingDescription:
			'Browse basketball, American football, soccer, baseball, hockey, tennis, golf, combat sports (boxing, MMA and pro wrestling), F1 and motorsport, track, swim and Olympic sports, action sports, chess, poker and esports, and cricket.',
		seoTitle: 'Athlete Enneagram Types: Sports Personalities | 9takes',
		seoDescription:
			'Athlete Enneagram types, read from rivalries, pressure and interviews. Compare Messi and Ronaldo, Simone Biles, Conor McGregor and more, sport by sport.',
		seoKeywords: [
			'athlete enneagram types',
			'athlete personality types',
			'messi enneagram type',
			'cristiano ronaldo personality type',
			'sports personality analysis'
		],
		seoIntro:
			'Athlete Enneagram types are easiest to see in a rivalry. Lionel Messi (Type 9) and Cristiano Ronaldo (Type 3) chased the same records for more than a decade. One did it quietly. The other made sure everyone was watching. Pressure tells you even more. Simone Biles (6) withdrew from events at the Tokyo Olympics to protect her safety, and Naomi Osaka (9) pulled out of the French Open after a dispute over press conferences. Both choices drew criticism, and both make sense once you see what each type was guarding. Combat sports give the sharpest contrast: Conor McGregor and Khabib Nurmagomedov are both typed as 8s and behave almost nothing alike on a microphone. This sports personality analysis reads athletes from interviews, rivalries and how they handle losing, sport by sport.',
		seoFaqs: [
			{
				question: 'Which sports are covered?',
				answer:
					'Basketball, American football, soccer, baseball, hockey, tennis, golf, boxing, MMA, pro wrestling, motorsport, Olympic sports, action sports, chess, poker, esports and cricket.'
			},
			{
				question: 'Can you type an athlete from how they play?',
				answer:
					'Partly. Playing style hints at it, but the stronger evidence comes off the field: how someone talks after a loss, how they treat rivals and teammates, and what they do when their career stalls.'
			},
			{
				question: 'Why are Jake Paul and Logan Paul on the sports page?',
				answer:
					'Because they compete. Jake Paul boxes professionally and Logan Paul wrestles in WWE, so both appear here as well as on Internet Creators.'
			}
		],
		fields: ['sports'],
		related: ['hosts-media', 'creator-media', 'self-help']
	},
	{
		slug: 'technology',
		label: 'Technology',
		shortLabel: 'Technology',
		summary: 'Inventors, researchers and executives who build and explain technology.',
		intro:
			'Explore the people behind the tools, platforms and research labs that changed how others work.',
		groupingDescription:
			'Browse technology executives, AI researchers and builders, inventors, and people who cover the industry.',
		seoTitle: 'Technology Leaders & Inventors by Enneagram Type | 9takes',
		seoDescription:
			'Explore Enneagram profiles of technology founders, AI researchers, engineers and industry commentators. Compare how they lead teams and make decisions.',
		seoKeywords: ['tech founder enneagram', 'technology personality types'],
		seoIntro:
			'Steve Jobs had strong opinions about how a product should feel in someone’s hands. Geoffrey Hinton spent decades pursuing a research idea before it became the basis for widely used tools. Read their profiles alongside other people in technology to compare the decisions that shaped their work.',
		seoFaqs: [
			{
				question: 'Where can I find technology entrepreneurs?',
				answer:
					'People who founded a technology company can appear in both Technology and Business. Their type map highlights the field they are best known for.'
			}
		],
		fields: ['tech'],
		related: ['business', 'creator-media', 'authors-thinkers']
	},
	{
		slug: 'business',
		label: 'Business & Entrepreneurship',
		shortLabel: 'Business',
		summary: 'Founders, executives, investors and talent managers.',
		intro: 'Compare the people who start companies, allocate capital and manage careers.',
		groupingDescription: 'Browse founders and operators, investors and talent managers.',
		seoTitle: 'Entrepreneurs & Investors by Enneagram Type | 9takes',
		seoDescription:
			'Compare Enneagram profiles of entrepreneurs, investors and executives. Browse the people who start companies, allocate capital and manage talent.',
		seoKeywords: ['entrepreneur enneagram', 'investor personality types'],
		seoIntro:
			'Starting a company, running one and deciding whether to invest in it involve different judgments. These profiles follow those decisions through specific careers, from Alexandr Wang building Scale AI to Warren Buffett choosing which businesses to own.',
		seoFaqs: [
			{
				question: 'Can a filmmaker or a podcaster also appear in Business?',
				answer:
					'Yes. A studio founder or a host who built a company can appear here and in the collection for their creative work.'
			}
		],
		fields: ['business'],
		related: ['technology', 'fashion', 'creator-media']
	},
	{
		slug: 'politics-public',
		label: 'Politics & Government',
		shortLabel: 'Politics',
		summary:
			'Presidents, monarchs, politicians, judges and activists, plus first families, military leaders and philanthropists.',
		intro:
			'Power puts a personality on the record. These profiles compare how leaders handle threat, loyalty and losing, across centuries and across parties.',
		groupingDescription:
			'Browse presidents and rulers (U.S. presidents, world leaders, and kings, queens and emperors), politicians and officials, judges and lawyers, activists, first families, military leaders, and philanthropists.',
		seoTitle: 'President & Politician Enneagram Types | 9takes',
		seoDescription:
			'Enneagram types of U.S. presidents, world leaders, monarchs, judges and activists. See how each type handles power, rivals and defeat across eras.',
		seoKeywords: [
			'us presidents enneagram types',
			'politician personality types',
			'world leaders personality analysis',
			'political enneagram',
			'president personality types'
		],
		seoIntro:
			"U.S. presidents' Enneagram types are a good place to start, because the record is so long. Abraham Lincoln, typed as a 9, filled his cabinet with men who had run against him. Winston Churchill, an 8, turned refusing to give in into national policy. The same lens works on people who never ran for office. Ruth Bader Ginsburg (Type 1) built a public identity out of careful dissents, and Marcus Aurelius, also a 1, wrote his Meditations as private notes on how to rule himself. Politician personality types are read here from decisions, speeches and how each person behaves after a loss. Party labels don't decide anything. Compare world leaders across eras and the same nine patterns keep turning up, in senates, palaces and courtrooms alike.",
		seoFaqs: [
			{
				question: 'Who is included in Politics & Government?',
				answer:
					'Presidents, prime ministers, monarchs and emperors, plus elected officials, judges, activists, military leaders, philanthropists and the families of political leaders.'
			},
			{
				question: 'Does 9takes take a political side?',
				answer:
					'No. A type describes what drives a person, and it says nothing about whether their politics were right. Leaders from every party and era are read with the same method, and each profile lays out its reasoning so you can argue with it.'
			},
			{
				question: 'Where are royals like Prince Harry?',
				answer:
					'Reigning monarchs and historical rulers, like Queen Elizabeth II, live here. Royals known mostly for their public lives live on Royals, Famous Families & Reality, and some, like Prince Harry, appear here too through their charity work.'
			}
		],
		fields: ['politics'],
		related: ['royals-reality', 'hosts-media', 'business']
	},
	{
		slug: 'royals-reality',
		label: 'Royals, Famous Families & Reality',
		shortLabel: 'Royals & Reality',
		summary:
			'Royals, famous families, reality stars and socialites: people famous for who they are.',
		intro:
			'When fame comes from a family name or a camera crew in the kitchen, the person never gets to clock out. These profiles show how each type handles being watched just for existing.',
		groupingDescription:
			'Browse royals, famous families, reality TV stars, and socialites and personalities.',
		seoTitle: 'Kardashian, Royal & Reality Star Enneagram Types | 9takes',
		seoDescription:
			'Enneagram types of the Kardashians, Princess Diana, Prince Harry and reality stars. See how each type handles a life where the cameras never leave.',
		seoKeywords: [
			'kardashian enneagram types',
			'princess diana enneagram type',
			'royal family personality types',
			'kris jenner enneagram type',
			'reality tv star personality types'
		],
		seoIntro:
			"The Kardashian Enneagram types are close to a natural experiment: one family, one camera crew and nearly two decades of footage. Kris Jenner (3) manages her daughters' careers, while Kourtney (1), Khloé (2), Kim (3), Kendall (6) and Kylie (9) handle the same spotlight in very different ways. Royal family personality types follow the same rule with older stakes. Princess Diana, typed as a 2, gave a 1995 television interview that broke every rule about how royals were supposed to talk, and her son Prince Harry (6) later wrote Spare about the family he left. Reality stars and socialites like Paris Hilton (3), who has said her famous baby voice was a character, round out the page. Each profile looks for the person underneath the role the cameras gave them.",
		seoFaqs: [
			{
				question: 'Why are royals and reality stars on the same page?',
				answer:
					'Both are famous for who they are more than for a craft. A prince and a reality star both live with an audience that watches their private life, and both have to decide how much of themselves to give it.'
			},
			{
				question: 'Where is Queen Elizabeth II?',
				answer:
					'Reigning monarchs and historical rulers live on Politics & Government, because their job was to rule. Royals known mainly for their public and family lives live here.'
			},
			{
				question: 'Does everyone in the Kardashian family share a type?',
				answer:
					'No. Each family member has their own profile, and their types differ. Growing up under the same cameras pushed them toward different strategies for handling attention, which is what makes the family worth comparing.'
			}
		],
		fields: ['famous'],
		related: ['politics-public', 'fashion', 'creator-media']
	},
	{
		slug: 'authors-thinkers',
		label: 'Ideas & Art',
		shortLabel: 'Ideas & Art',
		summary:
			'Writers, philosophers, scientists, explorers and artists remembered for what they made.',
		intro:
			'These are people whose work outlasted their public image. Their type shows in how they worked alone, what they obsessed over and what they kept out of the frame.',
		groupingDescription:
			'Browse novelists and poets, playwrights and screenwriters, nonfiction and history, philosophers, scientists, explorers and astronauts, science communicators, painters, architects and designers, photographers, and comics and manga.',
		seoTitle: 'Writer, Artist & Scientist Enneagram Types | 9takes',
		seoDescription:
			'Enneagram types of famous writers, artists, scientists and philosophers, read from their letters, notebooks and work. Compare Einstein, Van Gogh and more.',
		seoKeywords: [
			'famous writers enneagram',
			'artist enneagram types',
			'scientist personality types',
			'philosopher enneagram',
			'einstein enneagram type'
		],
		seoIntro:
			"Famous writers, artists and scientists leave a better record of their inner life than almost anyone, because the work is the record. Albert Einstein, typed as a 5, worked out some of his biggest ideas as thought experiments while holding a job at a patent office. Vincent van Gogh (4) sold almost nothing in his lifetime and kept painting anyway, explaining himself in hundreds of letters to his brother. Frida Kahlo, also a 4, made her own injured body her central subject. Artist Enneagram types tend to show in what a person keeps returning to. Scientist personality types show in what they can't leave unexplained. The page also covers philosophers, explorers, designers and comics creators, Carl Jung and Hayao Miyazaki among them, so you can compare how each type builds something meant to last.",
		seoFaqs: [
			{
				question: 'Who belongs in Ideas & Art?',
				answer:
					'People remembered mainly for their work: novelists, poets, playwrights, nonfiction writers, philosophers, scientists, explorers, painters, architects, designers, photographers and comics creators.'
			},
			{
				question: 'Can you type someone who died centuries ago?',
				answer:
					'Yes, when enough of their own words survive. Letters, journals, notebooks and recorded interviews show what someone wanted and feared, and that is the evidence 9takes leans on most.'
			},
			{
				question: 'Are politicians who wrote books listed here?',
				answer:
					'Some are. A president or founder appears here when writing became a real second career, and they stay on their main page too.'
			}
		],
		fields: ['ideas'],
		related: ['self-help', 'faith-spirituality', 'politics-public']
	},
	{
		slug: 'fashion',
		label: 'Style, Food & Home',
		shortLabel: 'Style & Food',
		summary:
			'Models, designers, editors, beauty founders, chefs and home brands that shape what people wear, eat and buy.',
		intro:
			'Taste is a decision made in public, over and over. These profiles look at what each person is protecting when they decide what looks, tastes or feels right.',
		groupingDescription:
			'Browse models, fashion designers, fashion editors, beauty brands, luxury houses, chefs and food TV, food creators and critics, and home and lifestyle.',
		seoTitle: 'Fashion, Food & Beauty Enneagram Types | 9takes',
		seoDescription:
			'Enneagram types of models, designers, fashion editors, beauty founders and chefs. See what each type protects when it decides what looks or tastes right.',
		seoKeywords: [
			'fashion personality types',
			'fashion model enneagram',
			'chef personality types',
			'anna wintour enneagram type',
			'beauty founder personality'
		],
		seoIntro:
			"Fashion personality types show up in what someone refuses to let slide. Anna Wintour, typed as a 1, has run Vogue for decades on standards most people only notice when they're missed. Gordon Ramsay (8) turned a head chef's temper into prime-time television, while Anthony Bourdain (7) treated food as a reason to keep moving. Beauty and modeling split the same way. Hailey Bieber (3) built a skincare brand around her own image, and Bella Hadid (4) has spoken openly about anxiety and depression while at the top of the industry. Food creators belong here too: Keith Lee (9) can send a line out the door of a small restaurant with a single TikTok review. Read fashion model Enneagram profiles next to chef personality types and the same nine patterns turn up behind very different kinds of taste.",
		seoFaqs: [
			{
				question: 'Why are fashion and food on the same page?',
				answer:
					'Both are businesses of taste. A model, an editor, a chef and a food critic all make public calls about what is good, and all of them live with the reaction. Their types show in which standards they defend and which they bend.'
			},
			{
				question: 'Can a musician or reality star appear here?',
				answer:
					'Yes, when they built a real second career in fashion, beauty or food. Rihanna appears here for Fenty Beauty and Kim Kardashian for her clothing lines, alongside their main pages.'
			},
			{
				question: 'How is the page organized?',
				answer:
					'Fashion and beauty come first: models, designers, editors, beauty brands and luxury houses. Food and home follow, with chefs and food TV, food creators and critics, and home and lifestyle brands.'
			}
		],
		fields: ['style'],
		related: ['business', 'royals-reality', 'creator-media']
	},
	{
		slug: 'self-help',
		label: 'Self-Help & Wellness',
		shortLabel: 'Self-Help',
		summary:
			'Motivators, health experts and advice-givers whose audience comes to them for secular advice on living.',
		intro:
			"Every self-help system carries its author's fingerprints. Read the advice next to the person's type and you can see which problem they were really solving, often their own.",
		groupingDescription:
			"Browse motivation, health and longevity, relationships and emotional health, success and strategy, productivity, and men's self-improvement.",
		seoTitle: 'Self-Help Guru & Wellness Enneagram Types | 9takes',
		seoDescription:
			'Enneagram types of self-help authors, motivational speakers and wellness experts. See what drives Tony Robbins, David Goggins and Andrew Huberman.',
		seoKeywords: [
			'self help author enneagram',
			'tony robbins enneagram type',
			'david goggins personality type',
			'andrew huberman enneagram',
			'motivational speaker personality types'
		],
		seoIntro:
			"Most self-help advice is the author's own fix, written up for everyone. David Goggins (Type 8) preaches toughening the mind through suffering, and his own story reads as one long refusal to go easy on himself. Andrew Huberman (5) answers the same questions with studies and protocols. Tim Ferriss (1) built a career on testing rules for living on himself first, and Bryan Johnson (4) has turned his own aging into a public experiment. Tony Robbins (3) sells the idea that state can be changed on command. Read a self-help author's Enneagram type beside their advice and you can predict who it will help and who it will burn out. This page groups motivational speaker personality types with health, relationship, productivity and success voices, so you can find advice built by someone whose problem looks like yours.",
		seoFaqs: [
			{
				question: 'Who counts as Self-Help & Wellness?',
				answer:
					'People whose audience comes to them for secular advice on how to live: motivation, health and longevity, relationships, success, productivity and self-improvement for men. Religious and spiritual teachers live on Faith & Spirituality.'
			},
			{
				question: "Does knowing a guru's type help me use their advice?",
				answer:
					"Yes. Advice usually solves the problem its author had. If your type's problem is different, the same routine can backfire, so the type tells you which parts to take and which to leave."
			},
			{
				question: 'Why do some self-help figures also appear on Hosts & Media?',
				answer:
					'Many of them reach their audience through a podcast. Tim Ferriss and Andrew Huberman appear on both pages because hosting is a second job for each of them.'
			}
		],
		fields: ['self-help'],
		related: ['hosts-media', 'faith-spirituality', 'authors-thinkers']
	},
	{
		slug: 'faith-spirituality',
		label: 'Faith & Spirituality',
		shortLabel: 'Faith',
		summary: 'Religious leaders, saints, founders of faiths, and spiritual teachers.',
		intro:
			'Faith asks a person to put something above themselves, and each type does that differently. These profiles look at what belief gave each person and what it asked of them.',
		groupingDescription: 'Browse religious leaders, saints and founders, and spiritual teachers.',
		seoTitle: 'Religious Leaders & Saints by Enneagram Type | 9takes',
		seoDescription:
			'Enneagram types of religious leaders, saints and spiritual teachers. See how Mother Teresa, Martin Luther King Jr. and others lived their faith by type.',
		seoKeywords: [
			'mother teresa enneagram type',
			'religious leaders personality types',
			'enneagram and spirituality',
			'spiritual teacher enneagram',
			'saints enneagram types'
		],
		seoIntro:
			"Religious leaders are a hard test for any personality system, because the role asks them to set the self aside. The self shows up anyway. Mother Teresa, typed as a 2, served the poor of Calcutta for decades, and her private letters, published after her death, describe years of feeling that God was absent. Martin Luther King Jr. and Malcolm X were both ministers before they led movements, and both are typed as 8s here, which makes their different paths easy to compare. Malcolm X left the Nation of Islam and changed his views after his pilgrimage to Mecca. This page tracks religious leaders' personality types alongside saints, founders and spiritual teachers. The Enneagram itself came out of spiritual teaching circles, which makes faith a natural place to put it to work.",
		seoFaqs: [
			{
				question: "Does 9takes judge anyone's beliefs?",
				answer:
					'No. A type describes what drives a person, and it is silent on whether their faith is true. The profiles look at how belief shaped someone and how they lived it out.'
			},
			{
				question: 'Why are Martin Luther King Jr. and Malcolm X on this page?',
				answer:
					'Both were ministers, and faith drove their public work. Their main profiles sit on Politics & Government as activists, and they appear here as well.'
			},
			{
				question: 'How do you type someone known for self-sacrifice?',
				answer:
					'Look at what they could not stop doing, and at what they wrote in private. Public humility is part of the role, so letters, journals and the accounts of people close to them carry the most weight.'
			}
		],
		fields: ['faith'],
		related: ['politics-public', 'self-help', 'authors-thinkers']
	},
	{
		slug: 'crime-notoriety',
		label: 'Crime & Notoriety',
		shortLabel: 'Crime',
		summary:
			'Serial killers, mob bosses, con artists and cult leaders, read for the patterns behind what they did.',
		intro:
			'Some people are known only for the harm they caused. These profiles look for the personality patterns in that record without turning anyone into a legend.',
		groupingDescription:
			'Browse serial killers and murderers, mobsters and cartels, con artists and fraudsters, and cult leaders.',
		seoTitle: 'Serial Killer & Criminal Enneagram Types | 9takes',
		seoDescription:
			'Enneagram analysis of serial killers, mob bosses, con artists and cult leaders, read from court records and testimony. Patterns, never excuses or legends.',
		seoKeywords: [
			'serial killer enneagram type',
			'true crime personality analysis',
			'cult leader personality traits',
			'con artist personality type',
			'psychopath enneagram type'
		],
		seoIntro:
			"True crime keeps asking one question: how could a person do this? The Enneagram doesn't excuse anything, and it isn't meant to. What it can do is describe the needs and fears that show up in someone's choices, which helps anyone who wants to recognize manipulation earlier. Serial killer Enneagram analysis on 9takes works from the documented record: court testimony, interviews, letters and accounts from the people who knew them. Cult leader profiles focus on how they held onto their followers, and con artist profiles on the story they sold and who believed it. One rule holds across the page. A type describes motivation and is never a diagnosis, and there is no criminal type. People of every type live ordinary, decent lives, and the victims stay part of every story told here.",
		seoFaqs: [
			{
				question: 'Is there a criminal Enneagram type?',
				answer:
					'No. Every type includes kind people and cruel ones. A type describes what someone wants and fears, and crime comes from choices, circumstances and, in some cases, clinical conditions the Enneagram does not measure.'
			},
			{
				question: 'Is an Enneagram type the same as a psychopathy diagnosis?',
				answer:
					'No. Psychopathy and antisocial personality disorder are clinical assessments made by trained professionals. The Enneagram describes motivation. The profiles here do not diagnose anyone, and a person of any type can have a personality disorder.'
			},
			{
				question: 'Who is included in Crime & Notoriety?',
				answer:
					'People known only for crimes, cons or cults. Someone with a real career who later committed a crime stays on the page for their industry.'
			}
		],
		fields: ['notorious'],
		related: ['politics-public', 'faith-spirituality', 'business']
	}
];

export const PERSONALITY_CATEGORY_DEFINITIONS: PersonalityCategoryDefinition[] =
	BASE_DEFINITIONS.map(withAccent);

/** Pages need this many people (home or second career) to be listed, indexed and in the sitemap. */
export const MIN_CATEGORY_PEOPLE = 3;

export const PRIMARY_PERSONALITY_CATEGORY_SLUGS: PersonalityCategorySlug[] = [
	'film-tv',
	'music',
	'technology',
	'creator-media',
	'politics-public',
	'hosts-media'
];

export const SECONDARY_PERSONALITY_CATEGORY_SLUGS: PersonalityCategorySlug[] = [
	'comedy',
	'authors-thinkers',
	'business',
	'sports',
	'fashion',
	'self-help',
	'royals-reality',
	'faith-spirituality',
	'crime-notoriety'
];

const PERSONALITY_CATEGORY_MAP = new Map(
	[...PERSONALITY_CATEGORY_DEFINITIONS, LEGACY_TECH_BUSINESS].map((category) => [
		category.slug,
		category
	])
);

export function getPersonalityCategoryBySlug(
	slug: string
): PersonalityCategoryDefinition | undefined {
	return PERSONALITY_CATEGORY_MAP.get(slug as PersonalityCategorySlug);
}

const PAGE_BY_FIELD = new Map(taxonomy.fields.map((field) => [field.key, field.page]));

/** The page slug for a v3 field key ("screen" → "film-tv"). */
export function categorySlugForField(field: string): PersonalityCategorySlug | null {
	return (PAGE_BY_FIELD.get(field) as PersonalityCategorySlug | undefined) ?? null;
}

export function formatPersonName(slug: string): string {
	return formatPersonalityDisplayName(slug);
}
