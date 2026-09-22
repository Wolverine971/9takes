// scripts/find-threads.mjs
//
// Finds live Reddit threads where a 9takes question already applies, ranks them
// by interpretive disagreement, and emits ONE action for today.
//
// The premise: "which post should I reply to?" is a retrieval problem, not a
// judgement call. 9takes owns 422 questions engineered to produce nine different
// answers; Reddit is full of threads that are already producing them. This script
// joins the two.
//
// Usage:
//   pnpm nine:find                      # today's queue from tier-1 venues
//   pnpm nine:find -- --tier 2          # personality subs instead
//   pnpm nine:find -- --sub AmIOverreacting
//   pnpm nine:find -- --refresh-corpus  # re-pull questions from the database first
//   pnpm nine:find -- --fixture path.json --no-write   # offline pipeline test
//
// Setup:
//   Since Nov 2025, Reddit's Responsible Builder Policy puts every new API credential
//   behind manual approval, so self-serve script apps at /prefs/apps no longer work.
//   If access is granted (to an account that is NOT the one that comments), add to .env.local:
//        REDDIT_CLIENT_ID=...
//        REDDIT_CLIENT_SECRET=...
//   REDDIT_USERNAME / REDDIT_PASSWORD are optional; without them the script uses
//   app-only read access, which is all it needs. Until then, use --fixture with a
//   saved listing. See docs/growth/the-nine/README.md section 5.
//
// Safety: threads matching the crisis-exclusion list in docs/taskers/T-22 are
// dropped before scoring. This script never posts, votes, messages, or follows.

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..');
const nineDirectory = path.join(repositoryRoot, 'docs', 'growth', 'the-nine');
const venuesPath = path.join(nineDirectory, 'venues.json');
const corpusPath = path.join(nineDirectory, 'corpus.json');
const queueDirectory = path.join(nineDirectory, 'queue');

const USER_AGENT = 'macos:9takes-thread-finder:v1.0 (by /u/9takes)';

// T-22 research boundaries: active crisis, abuse, and minors are excluded outright.
// These threads are not content opportunities and must never enter the queue.
//
// Every pattern is case-insensitive, and the list errs toward exclusion: a false
// positive costs one skipped thread; a false negative puts a kid or a crisis in the queue.
const PERSON = String.raw`(?:he|she|husband|wife|boyfriend|girlfriend|bf|gf|partner|fianc[eé]e?|ex|dad|father|mom|mother|stepdad|stepmom|brother|sister)`;
const VIOLENCE = String.raw`(?:hit|hits|beat|beats|punch(?:ed|es)?|slap(?:ped|s)?|shov(?:ed|es)|chok(?:ed|es|ing)|strangl(?:ed|es|ing)|kick(?:ed|s)?)`;
// "I'm 15" is a minor; "I'm 15 minutes late" and "I'm 5'4" are not.
const NOT_AN_AGE = String.raw`(?!\s*(?:%|percent|minutes?|mins?|hours?|hrs?|days?|weeks?|months?|lbs?|pounds?|kg|ft|feet|inch(?:es)?|cm|k\b|['’"]))`;

const CRISIS_PATTERNS = [
	/\bsuicid/i,
	/\bkill (?:myself|himself|herself|themsel)/i,
	/\bself[-\s]?harm/i,
	/\bcutting myself\b/i,
	/\boverdos/i,
	/\brap(?:e|ed|es|ing|ist)\b/i,
	/\bsexual(?:ly)? (?:assault|abus)/i,
	/\bmolest/i,
	/\bgroom(?:ed|ing) me\b/i,
	// Any abuse framing, not only the named kinds: "emotionally abusive", "my abuser".
	/\babus(?:e|ed|er|ers|es|ing|ive)\b/i,
	/\bdomestic violence\b/i,
	// Physical violence, however the person is named. "He hit me up" is a text, not a blow.
	new RegExp(String.raw`\b${PERSON}\s+${VIOLENCE}\b(?!\s+(?:\w+\s+)?up\b)`, 'i'),
	/\b(?:punched|slapped|shoved|choked|strangled|kicked) me\b(?!\s+out\b)/i,
	/\bstalk(?:er|ing)\b/i,
	/\brestraining order\b/i,
	// Minors. Reddit writes ages as "(16F)", "16f", "16 M", "(F16)"; the case varies.
	/\b1[0-7]\s?[mf]\b/i,
	/\b[mf]1[0-7]\b/i,
	new RegExp(String.raw`\bi(?:['’]?m| am)\s+(?:1[0-7]|[1-9])\b${NOT_AN_AGE}`, 'i'),
	/\bi(?:['’]?m| am) (?:a )?(?:freshman |sophomore |junior |senior )?in (?:middle|high) school\b/i,
	/\bi(?:['’]?m| am) in (?:[6-9]|1[0-2])th grade\b/i
];

const STOPWORDS = new Set(
	`a about after all also am an and any are as at be because been before being but by can cant come could
	did do does doing dont down each even ever every for from get got had has have he her here hers him his
	how i if im in into is it its just like me more most much my no not now of off on once one only or other
	our out over own really said same she should so some still such than that the their them then there these
	they thing things think this those through to too under until up us very was way we well were what when
	where which while who why will with would you your youre`
		.split(/\s+/)
		.filter(Boolean)
);

/* ------------------------------------------------------------------ args --- */

function parseArgs(argv) {
	const args = {
		tier: 1,
		sub: null,
		limit: null,
		top: 5,
		refreshCorpus: false,
		fixture: null,
		write: true,
		json: false
	};
	for (let index = 0; index < argv.length; index += 1) {
		const token = argv[index];
		const next = () => argv[(index += 1)];
		if (token === '--tier') args.tier = Number(next());
		else if (token === '--sub') args.sub = next();
		else if (token === '--limit') args.limit = Number(next());
		else if (token === '--top') args.top = Number(next());
		else if (token === '--refresh-corpus') args.refreshCorpus = true;
		else if (token === '--fixture') args.fixture = next();
		else if (token === '--no-write') args.write = false;
		else if (token === '--json') args.json = true;
	}
	return args;
}

/* ------------------------------------------------------------- scoring --- */

export function clamp(value, low = 0, high = 1) {
	if (Number.isNaN(value)) return low;
	return Math.min(high, Math.max(low, value));
}

/**
 * Band function: 1 inside [low, high], tapering linearly to 0 across each falloff.
 *
 * Falloffs are separate because the two sides are rarely symmetric. A post with
 * zero body text must score zero, so `falloffLow` can never exceed `low` without
 * leaving empty posts with residual credit.
 */
export function band(value, low, high, falloffLow, falloffHigh = falloffLow) {
	if (value >= low && value <= high) return 1;
	if (value < low) return falloffLow <= 0 ? 0 : clamp((value - (low - falloffLow)) / falloffLow);
	return falloffHigh <= 0 ? 0 : clamp((high + falloffHigh - value) / falloffHigh);
}

export function wordCount(text) {
	if (!text) return 0;
	return text.trim().split(/\s+/).filter(Boolean).length;
}

export function isExcluded(post) {
	if (post.over_18 || post.stickied || post.locked) return true;
	const haystack = `${post.title ?? ''}\n${post.selftext ?? ''}`;
	return CRISIS_PATTERNS.some((pattern) => pattern.test(haystack));
}

/**
 * How much interpretive disagreement is this thread producing?
 *
 * The signal 9takes needs is NOT popularity. A thread with 5,000 upvotes and 20
 * agreeing comments is worthless here. A thread with 90 upvotes, a 0.6 ratio and
 * 300 comments is a room full of people reading one situation nine ways.
 */
export function disagreementScore(post, now = Date.now()) {
	const ratio = typeof post.upvote_ratio === 'number' ? post.upvote_ratio : 0.95;
	const comments = post.num_comments ?? 0;
	const score = Math.max(post.score ?? 0, 0);

	// 1.0 ratio = consensus (0), 0.5 ratio = maximally contested (1).
	const contested = clamp((1 - ratio) / 0.5);
	// Comments winning over upvotes means people are arguing, not just approving.
	const discussionDensity = comments + score > 0 ? comments / (comments + score) : 0;
	// A real situation needs enough detail to be read two ways, and not be an essay.
	const substance = band(wordCount(post.selftext), 80, 800, 80, 400);
	// Old enough to have a thread, young enough that a comment still gets seen.
	const ageHours = (now - (post.created_utc ?? 0) * 1000) / 3_600_000;
	const freshness = band(ageHours, 2, 18, 2, 18);

	const total = 0.35 * contested + 0.3 * discussionDensity + 0.2 * substance + 0.15 * freshness;

	return {
		total: Number(total.toFixed(4)),
		parts: {
			contested: Number(contested.toFixed(3)),
			discussionDensity: Number(discussionDensity.toFixed(3)),
			substance: Number(substance.toFixed(3)),
			freshness: Number(freshness.toFixed(3))
		},
		ageHours: Number(ageHours.toFixed(1))
	};
}

/* ------------------------------------------------------------- matching --- */

export function tokenize(text) {
	return (text ?? '')
		.toLowerCase()
		.replace(/[^a-z0-9\s']/g, ' ')
		.split(/\s+/)
		.map((token) => token.replace(/^'+|'+$/g, ''))
		.filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

/**
 * IDF model over the question corpus, so common words stop winning.
 *
 * The thresholds are derived from corpus size rather than hardcoded: the maximum
 * possible IDF is log(1 + N), so a fixed constant that works for 410 questions is
 * unreachable for 10 and silently matches nothing.
 */
export function buildIdf(corpus) {
	const documentFrequency = new Map();
	for (const entry of corpus) {
		const unique = new Set(tokenize(`${entry.question} ${entry.context ?? ''}`));
		for (const token of unique) {
			documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
		}
	}
	const total = Math.max(corpus.length, 1);
	const weights = new Map();
	for (const [token, count] of documentFrequency) {
		weights.set(token, Math.log(1 + total / count));
	}
	const maxIdf = Math.log(1 + total);
	return {
		weights,
		/** A token rare enough to carry topic rather than grammar. */
		distinctive: DISTINCTIVE_IDF_RATIO * maxIdf,
		/** Below this, the match is noise and the operator should pick by hand. */
		matchFloor: MATCH_FLOOR_RATIO * maxIdf
	};
}

/** Fractions of the corpus's maximum IDF; see buildIdf. */
export const DISTINCTIVE_IDF_RATIO = 0.55;
export const MATCH_FLOOR_RATIO = 0.35;

/**
 * Best-matching 9takes question for a thread.
 *
 * Naive coverage (matched weight / total question weight) is wrong here: it hands
 * the win to short questions built from common words, which is how a thread about
 * skipping Christmas with your mother matched a question about college advice.
 *
 * Instead: score the absolute IDF mass matched, damped by question length, and
 * require at least two genuinely distinctive tokens in common. A question only
 * wins by sharing rare words with the thread, not by being short.
 */
export function matchQuestion(post, corpus, idfModel) {
	const { weights, distinctive, matchFloor } = idfModel;
	const threadTokens = new Set(tokenize(`${post.title} ${post.selftext ?? ''}`));
	if (threadTokens.size === 0) return null;

	let best = null;
	for (const entry of corpus) {
		const questionTokens = new Set(tokenize(`${entry.question} ${entry.context ?? ''}`));
		if (questionTokens.size === 0) continue;

		let matchedWeight = 0;
		let distinctiveMatches = 0;
		const overlap = [];
		for (const token of questionTokens) {
			if (!threadTokens.has(token)) continue;
			const weight = weights.get(token) ?? 1;
			matchedWeight += weight;
			overlap.push(token);
			if (weight >= distinctive) distinctiveMatches += 1;
		}
		if (distinctiveMatches < 2) continue;

		const score = matchedWeight / Math.sqrt(questionTokens.size);
		if (!best || score > best.score) {
			best = { ...entry, score: Number(score.toFixed(4)), overlap, distinctiveMatches };
		}
	}

	return best && best.score >= matchFloor ? best : null;
}

/* ---------------------------------------------------------------- reddit --- */

function loadEnvLocal() {
	const envPath = path.join(repositoryRoot, '.env.local');
	if (!fs.existsSync(envPath)) return;
	for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
		const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
		if (!match) continue;
		const value = match[2].trim().replace(/^["']|["']$/g, '');
		if (!process.env[match[1]]) process.env[match[1]] = value;
	}
}

async function getAccessToken() {
	const { REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD } = process.env;
	if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET) {
		throw new Error(
			'Missing REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET.\n' +
				'New Reddit API credentials need manual approval (Responsible Builder Policy,\n' +
				'Nov 2025). Until then, find threads by hand (sort: Controversial -> Today) or\n' +
				'run with --fixture <listing.json>. See docs/growth/the-nine/README.md section 5.'
		);
	}

	const body = new URLSearchParams(
		REDDIT_USERNAME && REDDIT_PASSWORD
			? { grant_type: 'password', username: REDDIT_USERNAME, password: REDDIT_PASSWORD }
			: { grant_type: 'client_credentials' }
	);

	const response = await fetch('https://www.reddit.com/api/v1/access_token', {
		method: 'POST',
		headers: {
			Authorization:
				'Basic ' + Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64'),
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': USER_AGENT
		},
		body
	});

	if (!response.ok) {
		throw new Error(`Reddit auth failed (${response.status}): ${await response.text()}`);
	}
	const payload = await response.json();
	if (!payload.access_token)
		throw new Error(`Reddit auth returned no token: ${JSON.stringify(payload)}`);
	return payload.access_token;
}

async function fetchListing(token, subreddit, listing, limit) {
	const url = `https://oauth.reddit.com/r/${subreddit}/${listing}?limit=${limit}&raw_json=1`;
	const response = await fetch(url, {
		headers: { Authorization: `Bearer ${token}`, 'User-Agent': USER_AGENT }
	});
	if (!response.ok) {
		console.warn(`  ! r/${subreddit} returned ${response.status}, skipping`);
		return [];
	}
	const payload = await response.json();
	return (payload?.data?.children ?? []).map((child) => child.data);
}

/** Top-level comments, so the drafted reply can name the reads already in the room. */
async function fetchTopComments(token, post, count = 6) {
	const url = `https://oauth.reddit.com${post.permalink}?limit=${count}&depth=1&sort=top&raw_json=1`;
	const response = await fetch(url, {
		headers: { Authorization: `Bearer ${token}`, 'User-Agent': USER_AGENT }
	});
	if (!response.ok) return [];
	const payload = await response.json();
	return (payload?.[1]?.data?.children ?? [])
		.map((child) => child.data)
		.filter((comment) => comment?.body && comment.body !== '[removed]')
		.slice(0, count)
		.map((comment) => ({
			author: comment.author,
			score: comment.score,
			body: comment.body.replace(/\s+/g, ' ').slice(0, 280)
		}));
}

/* ---------------------------------------------------------------- corpus --- */

function refreshCorpus(log = console.log) {
	log('Pulling question corpus from the database...');
	const sql =
		"SELECT id, question, coalesce(context,'') AS context, url, comment_count " +
		'FROM questions WHERE removed IS NOT TRUE ORDER BY id';
	const csv = execFileSync(path.join(repositoryRoot, 'scripts', 'db-query.sh'), [sql], {
		encoding: 'utf8',
		maxBuffer: 32 * 1024 * 1024
	});

	const rows = parseCsv(csv);
	fs.writeFileSync(corpusPath, `${JSON.stringify(rows, null, '\t')}\n`);
	log(`Wrote ${rows.length} questions to ${path.relative(repositoryRoot, corpusPath)}\n`);
	return rows;
}

/** Minimal RFC4180-ish CSV reader for the db-query.sh output. */
export function parseCsv(text) {
	const rows = [];
	let row = [];
	let field = '';
	let quoted = false;
	for (let index = 0; index < text.length; index += 1) {
		const character = text[index];
		if (quoted) {
			if (character === '"') {
				if (text[index + 1] === '"') {
					field += '"';
					index += 1;
				} else quoted = false;
			} else field += character;
			continue;
		}
		if (character === '"') quoted = true;
		else if (character === ',') {
			row.push(field);
			field = '';
		} else if (character === '\n') {
			row.push(field);
			rows.push(row);
			row = [];
			field = '';
		} else if (character !== '\r') field += character;
	}
	if (field || row.length) {
		row.push(field);
		rows.push(row);
	}
	if (rows.length < 2) return [];
	const header = rows[0];
	return rows
		.slice(1)
		.filter((values) => values.length === header.length)
		.map((values) => Object.fromEntries(header.map((key, i) => [key, values[i]])));
}

function loadCorpus(refresh, log = console.log) {
	if (refresh || !fs.existsSync(corpusPath)) return refreshCorpus(log);
	return JSON.parse(fs.readFileSync(corpusPath, 'utf8'));
}

/* ----------------------------------------------------------------- draft --- */

function draftComment(candidate) {
	const reads = candidate.topComments.slice(0, 3);
	const lines = [
		'Three reads of this are live in the thread and all three are internally consistent:',
		''
	];
	if (reads.length) {
		for (const read of reads) {
			lines.push(`- "${read.body.slice(0, 120)}..." -> protecting: [NAME THE FEAR]`);
		}
	} else {
		lines.push(
			'- [read A] -> protecting: ',
			'- [read B] -> protecting: ',
			'- [read C] -> protecting: '
		);
	}
	lines.push(
		'',
		"The disagreement isn't about what happened. It's about which of those feels most at risk to you.",
		'',
		'[ONE concrete thing OP can do with that.]'
	);
	return lines.join('\n');
}

/* ------------------------------------------------------------------ main --- */

function renderQueue(candidates, args, today) {
	const [first, ...rest] = candidates;
	const lines = [
		`<!-- docs/growth/the-nine/queue/${today}.md -->`,
		'',
		`# Thread queue - ${today}`,
		'',
		`Tier ${args.tier}${args.sub ? ` / r/${args.sub}` : ''}. Generated by \`pnpm nine:find\`.`,
		'Unbranded participant: no links, no product mention, profile only.',
		'',
		'---',
		'',
		'## Today: one comment',
		''
	];

	if (!first) {
		lines.push('No thread cleared the bar today. That is a valid outcome - do not force one.', '');
		return lines.join('\n');
	}

	lines.push(
		`**[r/${first.post.subreddit} - ${first.post.title}](https://reddit.com${first.post.permalink})**`,
		'',
		`- Disagreement ${first.scoring.total} (contested ${first.scoring.parts.contested}, density ${first.scoring.parts.discussionDensity}, substance ${first.scoring.parts.substance}, fresh ${first.scoring.parts.freshness})`,
		`- ${first.post.num_comments} comments / ${first.post.score} score / ${first.scoring.ageHours}h old`,
		first.match
			? `- Matched question: [${first.match.question}](https://9takes.com/questions/${first.match.url}) (${first.match.score})`
			: '- Matched question: none above threshold',
		'',
		'```text',
		draftComment(first),
		'```',
		'',
		'---',
		'',
		'## Bench (do not batch these - they go stale)',
		''
	);

	for (const candidate of rest) {
		lines.push(
			`- **${candidate.scoring.total}** [r/${candidate.post.subreddit}: ${candidate.post.title}](https://reddit.com${candidate.post.permalink}) - ${candidate.post.num_comments}c/${candidate.post.score}s, ${candidate.scoring.ageHours}h` +
				(candidate.match ? ` - Q: ${candidate.match.question}` : '')
		);
	}
	lines.push('');
	return lines.join('\n');
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	loadEnvLocal();

	// With --json, stdout must stay machine-parseable, so progress goes to stderr.
	const log = args.json
		? (...parts) => console.error(...parts)
		: (...parts) => console.log(...parts);
	const write = args.json
		? (text) => process.stderr.write(text)
		: (text) => process.stdout.write(text);

	const venuesConfig = JSON.parse(fs.readFileSync(venuesPath, 'utf8'));
	const corpus = loadCorpus(args.refreshCorpus, log);
	const idf = buildIdf(corpus);

	let posts = [];
	let token = null;

	if (args.fixture) {
		const fixture = JSON.parse(fs.readFileSync(path.resolve(args.fixture), 'utf8'));
		posts = (fixture?.data?.children ?? fixture).map((child) => child.data ?? child);
		log(`Fixture mode: ${posts.length} posts from ${args.fixture}\n`);
	} else {
		const venues = venuesConfig.venues.filter((venue) =>
			args.sub ? venue.subreddit.toLowerCase() === args.sub.toLowerCase() : venue.tier === args.tier
		);
		if (!venues.length) {
			console.error(`No venues matched (tier ${args.tier}${args.sub ? `, sub ${args.sub}` : ''}).`);
			process.exit(1);
		}
		token = await getAccessToken();
		const limit = args.limit ?? venuesConfig.defaults.limit;
		for (const venue of venues) {
			write(`Fetching r/${venue.subreddit}... `);
			const batch = await fetchListing(
				token,
				venue.subreddit,
				venuesConfig.defaults.listing,
				limit
			);
			log(`${batch.length} posts`);
			posts.push(...batch);
		}
		log('');
	}

	const { minComments, maxAgeHours, minBodyWords } = venuesConfig.defaults;
	const now = Date.now();

	const candidates = posts
		.filter((post) => !isExcluded(post))
		.filter((post) => (post.num_comments ?? 0) >= minComments)
		// No body text means no situation to read nine ways, however contested it is.
		.filter((post) => wordCount(post.selftext) >= (minBodyWords ?? 40))
		.filter((post) => (now - (post.created_utc ?? 0) * 1000) / 3_600_000 <= maxAgeHours)
		.map((post) => ({
			post,
			scoring: disagreementScore(post, now),
			match: matchQuestion(post, corpus, idf),
			topComments: []
		}))
		.sort((a, b) => b.scoring.total - a.scoring.total)
		.slice(0, args.top);

	if (token) {
		for (const candidate of candidates) {
			candidate.topComments = await fetchTopComments(token, candidate.post);
		}
	}

	const today = new Date().toISOString().slice(0, 10);

	if (args.json) {
		console.log(JSON.stringify(candidates, null, '\t'));
		return;
	}

	const markdown = renderQueue(candidates, args, today);

	if (args.write) {
		fs.mkdirSync(queueDirectory, { recursive: true });
		const outputPath = path.join(queueDirectory, `${today}.md`);
		fs.writeFileSync(outputPath, markdown);
		log(`Queue written: ${path.relative(repositoryRoot, outputPath)}\n`);
	}

	const [first] = candidates;
	if (!first) {
		console.log('Nothing cleared the bar today. That is a valid outcome - do not force one.');
		return;
	}
	console.log('================ TODAY: ONE COMMENT ================');
	console.log(`r/${first.post.subreddit} - ${first.post.title}`);
	console.log(`https://reddit.com${first.post.permalink}`);
	console.log(
		`disagreement ${first.scoring.total} | ${first.post.num_comments} comments / ${first.post.score} score | ${first.scoring.ageHours}h old`
	);
	if (first.match) console.log(`matched question: ${first.match.question}`);
	console.log('----------------------------------------------------');
	console.log(draftComment(first));
	console.log('====================================================');
	console.log(`\n${candidates.length - 1} more on the bench. Do not batch them.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
	main().catch((error) => {
		console.error(`\n${error.message}`);
		process.exit(1);
	});
}
