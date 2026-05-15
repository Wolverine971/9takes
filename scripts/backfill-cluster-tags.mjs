// scripts/backfill-cluster-tags.mjs
// One-shot script: derive cluster-tag(s) for every person in
// src/blog/people/drafts/ using the existing hardcoded slug-set
// matchers in personalityCategoryData.ts, then merge those tags
// into the frontmatter type[] array.
//
// Idempotent: skips files that already have a cluster tag.
// Run: node scripts/backfill-cluster-tags.mjs [--dry-run]

import fs from 'node:fs';
import path from 'node:path';

const DRAFTS_DIR = 'src/blog/people/drafts';
const DRY_RUN = process.argv.includes('--dry-run');

// Mirror createNormalizedSlugSet from personalityCategoryData.ts
const set = (slugs) => new Set(slugs.map((s) => s.toLowerCase()));

// ── slug sets copied from personalityCategoryData.ts ─────────────────────
const FILM_TV_CROSSOVER_SLUGS = set([
	'Amy-Poehler',
	'Aubrey-Plaza',
	'Dave-Chappelle',
	'Howard-Stern',
	'Jack-Black',
	'Jon-Stewart',
	'Keke-Palmer',
	'Kevin-Hart',
	'Mindy-Kaling',
	'Oprah-Winfrey',
	'Pete-Davidson',
	'Stephen-Colbert',
	'Trevor-Noah'
]);
const FILM_TV_SCREEN_ACTOR_SLUGS = set([
	'Alexis-Bledel',
	'Amber-Heard',
	'Blake-Lively',
	'Cillian-Murphy',
	'Shia-LaBeouf',
	'Tom-Hardy'
]);

const CREATOR_MEDIA_PODCASTER_SLUGS = set([
	'Alex-Cooper',
	'Andrew-Huberman',
	'Bobby-Lee',
	'Caleb-Hearon',
	'Chris-Williamson',
	'Conan-OBrien',
	'Dax-Shepard',
	'Joe-Rogan',
	'Lex-Fridman',
	'Shawn-Ryan',
	'Theo-Von',
	'Tim-Ferriss'
]);
const CREATOR_MEDIA_COMMENTARY_SLUGS = set([
	'Andrew-Callaghan',
	'Andrew-Ross-Sorkin',
	'Hasan-Piker',
	'Krystal-Ball',
	'Piers-Morgan',
	'Ryan-Grim',
	'Saagar-Enjeti',
	'Stephen-A-Smith',
	'Taylor-Lorenz'
]);
const CREATOR_MEDIA_BUSINESS_SLUGS = set([
	'Ali-Abdaal',
	'Andrew-Huberman',
	'Andrew-Tate',
	'John-Coogan',
	'Shaan-Puri',
	'Steven-Bartlett',
	'Tony-Robbins'
]);
const CREATOR_MEDIA_STREAMER_SLUGS = set([
	'Adin-Ross',
	'Asmongold',
	'Clavicular',
	'IShowSpeed',
	'Kai-Cenat',
	'Pokimane',
	'TFue',
	'xQc'
]);
const CREATOR_MEDIA_ENTERTAINER_SLUGS = set([
	'Brittany-Broski',
	'Casey-Neistat',
	'David-Dobrik',
	'Dave-Portnoy',
	'Druski',
	'JackSepticeye',
	'Jake-Paul',
	'Jake-Shane',
	'KSI',
	'Kyle-Forgeard',
	'Logan-Paul',
	'Markiplier',
	'Mike-Majlak',
	'Mr-Beast',
	'PewDiePie',
	'Sean-Evans',
	'Trisha-Paytas'
]);
const CREATOR_MEDIA_LIFESTYLE_SLUGS = set([
	'Addison-Rae',
	'Alix-Earle',
	'Ashby',
	'Bobbi-Althoff',
	'Emma-Chamberlain',
	'James-Charles',
	'Kim-Kardashian',
	'Kylie-Jenner',
	'Madison-Beer',
	'Tara-Yummy'
]);

const MUSIC_POP_STAR_SLUGS = set([
	'Ariana-Grande',
	'Beyonce-Knowles',
	'Billie-Eilish',
	'Harry-Styles',
	'Miley-Cyrus',
	'Olivia-Rodrigo',
	'Rihanna',
	'Sabrina-Carpenter',
	'Taylor-Swift',
	'Troye-Sivan',
	'Zayn-Malik'
]);
const MUSIC_RAP_GENRE_SLUGS = set([
	'Bad-Bunny',
	'Drake',
	'Doechii',
	'Doja-Cat',
	'Eminem',
	'Post-Malone',
	'Travis-Scott',
	'Tyler-The-Creator'
]);
const MUSIC_ALTERNATIVE_SLUGS = set(['Chappell-Roan', 'Charli-xcx', 'Grimes', 'Halsey']);
const MUSIC_SINGER_SONGWRITER_SLUGS = set([
	'Benson-Boone',
	'Dolly-Parton',
	'Hozier',
	'Jelly-Roll',
	'John-Mayer'
]);
const MUSIC_CROSSOVER_SLUGS = set([
	'Addison-Rae',
	'Jack-Black',
	'Jared-Leto',
	'Keke-Palmer',
	'Madison-Beer'
]);

const POLITICS_MODERN_LEADERS_SLUGS = set([
	'Barack-Obama',
	'Bill-Clinton',
	'Donald-Trump',
	'George-H-W-Bush',
	'George-W-Bush',
	'Jacinda-Ardern',
	'Jimmy-Carter',
	'Joe-Biden',
	'John-F-Kennedy',
	'Justin-Trudeau',
	'Ronald-Reagan',
	'Vladimir-Putin',
	'Volodymyr-Zelensky',
	'Winston-Churchill',
	'Xi-Jinping'
]);
const POLITICS_HISTORICAL_LEADERS_SLUGS = set([
	'Abraham-Lincoln',
	'Cleopatra',
	'Joseph-Stalin',
	'Julius-Caesar',
	'Marie-Antoinette',
	'Napoleon-Bonaparte'
]);
const POLITICS_ACTIVIST_SLUGS = set([
	'Greta-Thunberg',
	'Mahatma-Gandhi',
	'Malcolm-X',
	'Martin-Luther-King-Jr',
	'Mother-Teresa',
	'Nelson-Mandela',
	'Noam-Chomsky'
]);
const POLITICS_ROYALTY_SLUGS = set([
	'Meghan-Markle',
	'Prince-Harry',
	'Princess-Diana',
	'Queen-Elizabeth-II'
]);
const POLITICS_POLITICAL_SPOUSES_SLUGS = set(['Jackie-Kennedy', 'Michelle-Obama', 'Nancy-Reagan']);
const POLITICS_HISTORICAL_SCIENTISTS_SLUGS = set([
	'Albert-Einstein',
	'Friedrich-Nietzsche',
	'Leonardo-da-Vinci',
	'Marie-Curie',
	'Nikola-Tesla',
	'Robert-Oppenheimer',
	'Stephen-Hawking'
]);
const POLITICS_HISTORICAL_ARTISTS_SLUGS = set([
	'Agatha-Christie',
	'Edgar-Allan-Poe',
	'Ernest-Hemingway',
	'Frank-Lloyd-Wright',
	'Frida-Kahlo',
	'John-D-Rockefeller',
	'John-Lennon',
	'Mark-Twain',
	'Vincent-Van-Gogh'
]);

const TECH_BIG_TECH_SLUGS = set([
	'Bill-Gates',
	'Elon-Musk',
	'Jack-Dorsey',
	'Jeff-Bezos',
	'Mark-Zuckerberg',
	'Reed-Hastings',
	'Satya-Nadella',
	'Sundar-Pichai',
	'Tim-Cook',
	'Travis-Kalanick'
]);
const TECH_INVESTOR_SLUGS = set([
	'Chamath-Palihapitiya',
	'David-Friedberg',
	'David-Sacks',
	'Jason-Calacanis',
	'Marc-Andreessen',
	'Paul-Graham',
	'Peter-Thiel',
	'Reid-Hoffman'
]);
const TECH_FRONTIER_SLUGS = set(['Alex-Karp', 'Dario-Amodei', 'Palmer-Luckey', 'Sam-Altman']);
const TECH_OPERATOR_SLUGS = set([
	'Alex-Hormozi',
	'Gary-Vee',
	'John-Coogan',
	'Jordi-Hays',
	'Leila-Hormozi',
	'Sam-Parr',
	'Shaan-Puri',
	'Steven-Bartlett',
	'Taylor-Swift',
	'Tony-Robbins',
	'Tyler-Perry'
]);
const TECH_INTERPRETER_SLUGS = set(['Kara-Swisher', 'Lex-Fridman', 'Scott-Galloway']);

const COMEDY_STANDUP_SLUGS = set([
	'Andrew-Schulz',
	'Dave-Chappelle',
	'Joe-Rogan',
	'Shane-Gillis',
	'Theo-Von',
	'Tim-Dillon'
]);
const COMEDY_SKETCH_SLUGS = set([
	'Amy-Poehler',
	'Aubrey-Plaza',
	'Jack-Black',
	'Kevin-Hart',
	'Marcello-Hernandez',
	'Mindy-Kaling',
	'Pete-Davidson',
	'Tim-Robinson'
]);
const COMEDY_SATIRE_SLUGS = set(['Jon-Stewart', 'Stephen-Colbert', 'Trevor-Noah']);
const COMEDY_INTERNET_SLUGS = set(['Caleb-Hearon', 'Druski']);

// authors-thinkers slug sets — need to read these from the file since I haven't memorized them
// Will load them dynamically below

// Exclude lists (mirror personalityCategories.ts excludeSlugs)
const FILM_TV_EXCLUDE = set([]);
const CREATOR_MEDIA_EXCLUDE = set(['Brene-Brown', 'Dolly-Parton', 'Neil-Strauss']);
const POLITICS_EXCLUDE = set(['Shailene-Woodley', 'Lupita-Nyongo']);

// Helpers
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const has = (types, t) => types.map(norm).includes(norm(t));
const inSet = (s, slug) => s.has(slug.toLowerCase());

// Load author slug sets directly from personalityCategoryData.ts so we don't
// have to hand-copy them.
function loadAuthorSlugSets() {
	const src = fs.readFileSync('src/lib/server/personalityCategoryData.ts', 'utf8');
	const grab = (name) => {
		const re = new RegExp(`const\\s+${name}\\s*=\\s*createNormalizedSlugSet\\(\\[([^\\]]+)\\]\\)`);
		const m = src.match(re);
		if (!m) return new Set();
		return set((m[1].match(/'([^']+)'/g) || []).map((s) => s.replace(/'/g, '')));
	};
	return {
		AUTHOR_NOVELIST_SLUGS: grab('AUTHOR_NOVELIST_SLUGS'),
		AUTHOR_STRATEGY_SLUGS: grab('AUTHOR_STRATEGY_SLUGS'),
		AUTHOR_INTERPRETER_SLUGS: grab('AUTHOR_INTERPRETER_SLUGS')
	};
}
const AUTHOR_SETS = loadAuthorSlugSets();

// All recognized cluster tags (used to skip already-tagged files)
const CLUSTER_TAGS = new Set([
	'screen-icon',
	'rising-star',
	'tv-comedy-crossover',
	'celebrity-image',
	'podcaster',
	'news-commentator',
	'business-creator',
	'streamer',
	'viral-entertainer',
	'lifestyle-builder',
	'pop-star',
	'rapper',
	'alternative-artist',
	'singer-songwriter',
	'music-crossover',
	'modern-leader',
	'historical-leader',
	'movement-leader',
	'royalty',
	'political-spouse',
	'campaign-politician',
	'historical-scientist',
	'historical-artist',
	'big-tech-founder',
	'investor',
	'frontier-builder',
	'business-operator',
	'tech-interpreter',
	'stand-up',
	'sketch-comic',
	'satire-host',
	'internet-comic',
	'novelist',
	'strategy-writer',
	'business-interpreter'
]);

function deriveClusterTags(slug, types) {
	const s = slug;
	const out = [];

	// film-tv
	const hasFilmTv = ['movieStar', 'newMovieStar', 'celebrity'].some((t) => has(types, t));
	if (hasFilmTv && !inSet(FILM_TV_EXCLUDE, s)) {
		if (inSet(FILM_TV_CROSSOVER_SLUGS, s)) out.push('tv-comedy-crossover');
		else if (has(types, 'newMovieStar')) out.push('rising-star');
		else if (has(types, 'movieStar') || inSet(FILM_TV_SCREEN_ACTOR_SLUGS, s))
			out.push('screen-icon');
		else if (has(types, 'celebrity')) out.push('celebrity-image');
	}

	// creator-media
	const hasCreatorMedia = [
		'creator',
		'influencer',
		'tiktoker',
		'lifestyleInfluencer',
		'journalist'
	].some((t) => has(types, t));
	if (hasCreatorMedia && !inSet(CREATOR_MEDIA_EXCLUDE, s)) {
		if (inSet(CREATOR_MEDIA_PODCASTER_SLUGS, s)) out.push('podcaster');
		else if (inSet(CREATOR_MEDIA_COMMENTARY_SLUGS, s) || has(types, 'journalist'))
			out.push('news-commentator');
		else if (inSet(CREATOR_MEDIA_BUSINESS_SLUGS, s) || has(types, 'entrepreneur'))
			out.push('business-creator');
		else if (inSet(CREATOR_MEDIA_STREAMER_SLUGS, s)) out.push('streamer');
		else if (inSet(CREATOR_MEDIA_ENTERTAINER_SLUGS, s)) out.push('viral-entertainer');
		else if (
			inSet(CREATOR_MEDIA_LIFESTYLE_SLUGS, s) ||
			has(types, 'lifestyleInfluencer') ||
			has(types, 'influencer') ||
			has(types, 'tiktoker')
		)
			out.push('lifestyle-builder');
	}

	// music
	if (has(types, 'musician')) {
		if (inSet(MUSIC_POP_STAR_SLUGS, s)) out.push('pop-star');
		else if (inSet(MUSIC_RAP_GENRE_SLUGS, s)) out.push('rapper');
		else if (inSet(MUSIC_ALTERNATIVE_SLUGS, s)) out.push('alternative-artist');
		else if (inSet(MUSIC_SINGER_SONGWRITER_SLUGS, s)) out.push('singer-songwriter');
		else if (
			inSet(MUSIC_CROSSOVER_SLUGS, s) ||
			has(types, 'creator') ||
			has(types, 'celebrity') ||
			has(types, 'lifestyleInfluencer')
		)
			out.push('music-crossover');
	}

	// politics-public
	const hasPolitics = ['politician', 'historical', 'activist'].some((t) => has(types, t));
	if (hasPolitics && !inSet(POLITICS_EXCLUDE, s)) {
		if (inSet(POLITICS_MODERN_LEADERS_SLUGS, s)) out.push('modern-leader');
		else if (inSet(POLITICS_HISTORICAL_LEADERS_SLUGS, s)) out.push('historical-leader');
		else if (inSet(POLITICS_ACTIVIST_SLUGS, s)) out.push('movement-leader');
		else if (inSet(POLITICS_ROYALTY_SLUGS, s)) out.push('royalty');
		else if (inSet(POLITICS_POLITICAL_SPOUSES_SLUGS, s)) out.push('political-spouse');
		else if (has(types, 'politician')) out.push('campaign-politician');
		else if (inSet(POLITICS_HISTORICAL_SCIENTISTS_SLUGS, s)) out.push('historical-scientist');
		else if (inSet(POLITICS_HISTORICAL_ARTISTS_SLUGS, s)) out.push('historical-artist');
	}

	// tech-business
	if (['techie', 'entrepreneur', 'business'].some((t) => has(types, t))) {
		if (inSet(TECH_BIG_TECH_SLUGS, s)) out.push('big-tech-founder');
		else if (inSet(TECH_INVESTOR_SLUGS, s)) out.push('investor');
		else if (inSet(TECH_FRONTIER_SLUGS, s)) out.push('frontier-builder');
		else if (inSet(TECH_OPERATOR_SLUGS, s) || has(types, 'entrepreneur') || has(types, 'business'))
			out.push('business-operator');
		else if (inSet(TECH_INTERPRETER_SLUGS, s)) out.push('tech-interpreter');
	}

	// comedy
	if (has(types, 'comedian')) {
		if (inSet(COMEDY_STANDUP_SLUGS, s)) out.push('stand-up');
		else if (inSet(COMEDY_SKETCH_SLUGS, s)) out.push('sketch-comic');
		else if (inSet(COMEDY_SATIRE_SLUGS, s)) out.push('satire-host');
		else if (inSet(COMEDY_INTERNET_SLUGS, s)) out.push('internet-comic');
	}

	// authors-thinkers
	if (['author', 'psychology', 'essay'].some((t) => has(types, t))) {
		if (inSet(AUTHOR_SETS.AUTHOR_NOVELIST_SLUGS, s)) out.push('novelist');
		else if (inSet(AUTHOR_SETS.AUTHOR_STRATEGY_SLUGS, s) || has(types, 'psychology'))
			out.push('strategy-writer');
		else if (inSet(AUTHOR_SETS.AUTHOR_INTERPRETER_SLUGS, s)) out.push('business-interpreter');
	}

	return out;
}

// Process all draft files
const files = fs.readdirSync(DRAFTS_DIR).filter((f) => f.endsWith('.md'));
let updated = 0,
	skipped = 0,
	noClusters = 0,
	errors = 0;

for (const file of files) {
	const filepath = path.join(DRAFTS_DIR, file);
	const content = fs.readFileSync(filepath, 'utf8');

	const slugMatch = content.match(/^person:\s*['"]?([^'"\n]+)/m);
	const typeMatch = content.match(/^type:\s*\[([^\]]+)\]/m);

	if (!slugMatch || !typeMatch) {
		errors++;
		console.log(`⚠️  ${file}: missing person or type field`);
		continue;
	}

	const slug = slugMatch[1].trim();
	const types = typeMatch[1]
		.split(',')
		.map((s) => s.trim().replace(/['"]/g, ''))
		.filter(Boolean);

	if (types.some((t) => CLUSTER_TAGS.has(t))) {
		skipped++;
		continue;
	}

	const newTags = deriveClusterTags(slug, types);
	if (newTags.length === 0) {
		noClusters++;
		console.log(`NO-CLUSTER ${slug.padEnd(30)} types=[${types.join(', ')}]`);
		continue;
	}

	const merged = [...types, ...newTags];
	const newTypeLine = `type: [${merged.map((t) => `'${t}'`).join(', ')}]`;
	const newContent = content.replace(/^type:\s*\[[^\]]+\]/m, newTypeLine);

	if (DRY_RUN) {
		console.log(`[DRY] ${slug.padEnd(30)} +[${newTags.join(', ')}]`);
	} else {
		fs.writeFileSync(filepath, newContent);
		console.log(`UPDATED ${slug.padEnd(30)} +[${newTags.join(', ')}]`);
	}
	updated++;
}

console.log(
	`\n${DRY_RUN ? '[DRY RUN] ' : ''}Updated: ${updated}, Skipped (already tagged): ${skipped}, No clusters derived: ${noClusters}, Errors: ${errors}`
);
