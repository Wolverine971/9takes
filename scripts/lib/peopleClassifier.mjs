// scripts/lib/peopleClassifier.mjs
/**
 * Jev labels people for the v3 people taxonomy (src/lib/data/peopleTaxonomy.json) and saves
 * them to src/lib/data/personClassifications.json.
 *
 * Used by `pnpm people:classify` and by scripts/generate-famous-types.js, which every publish
 * path runs (push:people, --publish, gen:all, publish-people-daily, build:vercel), so a newly
 * published person is labeled before the type pages, category pages and timeline are built.
 *
 * Jev answers typed choices with probabilities, so it picks the home path in two steps:
 * field, then niche (+ sub) inside that field. It writes no text, so second careers
 * ("also"), platforms, roles and breakout stay empty with source "jev" until a person or
 * an agent pass fills them. A home below 0.6 probability is marked low confidence.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import * as prettier from 'prettier';
import { createJevClient, readOpenRouterKey } from './jevClient.js';

const root = fileURLToPath(new URL('../..', import.meta.url));
export const CLASSIFICATIONS_PATH = path.join(root, 'src/lib/data/personClassifications.json');
const TAXONOMY_PATH = path.join(root, 'src/lib/data/peopleTaxonomy.json');
const DRAFTS = path.join(root, 'src/blog/people/drafts');

const key = (value) =>
	String(value)
		.normalize('NFD')
		.replace(/[^a-z0-9]/gi, '')
		.toLowerCase();
const list = (value) => (Array.isArray(value) ? value : value ? [String(value)] : []);

export function readClassifications() {
	return JSON.parse(fs.readFileSync(CLASSIFICATIONS_PATH, 'utf8'));
}

function readDrafts() {
	const drafts = new Map();
	if (!fs.existsSync(DRAFTS)) return drafts;
	for (const file of fs.readdirSync(DRAFTS)) {
		if (!file.endsWith('.md')) continue;
		const { data, content } = matter(fs.readFileSync(path.join(DRAFTS, file), 'utf8'));
		drafts.set(key(data.person || file.replace(/\.md$/, '')), { data, content });
	}
	return drafts;
}

function bornYear(data) {
	const raw = data.birth_date instanceof Date ? data.birth_date.toISOString() : data.birth_date;
	const year = Number(String(raw ?? '').slice(0, 4));
	return Number.isInteger(year) && year > 0 ? year : null;
}

/** Everything Jev reads about one person: profile facts plus the article's opening. */
function personState(slug, draft) {
	const data = draft?.data ?? {};
	const opening = (draft?.content ?? '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.slice(0, 2400);
	return {
		person: data.title?.split(/[:|]/)[0] ?? slug.replace(/-/g, ' '),
		slug,
		occupation: list(data.occupation),
		known_for: list(data.knows_about).slice(0, 6),
		nationality: list(data.nationality),
		born: bornYear(data),
		description: data.description ?? '',
		article_opening: opening
	};
}

const RULES =
	'Pick where a reader would shelve this person by what they do, not the platform they use. ' +
	'Use the occupation named first in the opening line of their Wikipedia article. ' +
	'Tech covers software, AI, crypto and game studios even for non-coding CEOs. ' +
	'Late-night hosts are Comedy. Fashion, beauty and food brands are Style. ' +
	'Self-help is secular advice; religious or spiritual teaching is Faith. ' +
	'Crime & Notoriety is only for people known solely for crimes, cons or cults.';

function fieldQuestion(taxonomy) {
	return {
		type: 'choice',
		instructions: `Which field is this person's home? ${RULES}`,
		criteria: Object.fromEntries(
			taxonomy.fields.map((field) => [field.key, `${field.label}: ${field.description}`])
		)
	};
}

function nicheQuestion(field) {
	const criteria = {};
	for (const niche of field.niches) {
		if (niche.subs?.length) {
			for (const sub of niche.subs)
				criteria[`${niche.key}/${sub.key}`] = `${niche.label}: ${sub.label}`;
			criteria[niche.key] = `${niche.label} (none of the more specific ${niche.label} options)`;
		} else {
			criteria[niche.key] = niche.label;
		}
	}
	return {
		type: 'choice',
		instructions: `Within ${field.label}, what does this person mainly do? ${RULES}`,
		criteria
	};
}

async function classify(jev, taxonomy, state) {
	const first = await jev.decide(state, { field: fieldQuestion(taxonomy) });
	const fieldAnswer = first.answers.field;
	const field = taxonomy.fields.find((candidate) => candidate.key === fieldAnswer.choice);
	if (!field) throw new Error(`Jev picked unknown field ${fieldAnswer.choice}`);
	const second = await jev.decide(state, { niche: nicheQuestion(field) });
	const nicheAnswer = second.answers.niche;
	const [niche, sub] = String(nicheAnswer.choice).split('/');
	const probability = Math.min(
		fieldAnswer.probabilities?.[fieldAnswer.choice] ?? 0,
		nicheAnswer.probabilities?.[nicheAnswer.choice] ?? 0
	);
	return {
		home: sub ? [field.key, niche, sub] : [field.key, niche],
		confidence: probability >= 0.85 ? 'high' : probability >= 0.6 ? 'medium' : 'low',
		probability: Number(probability.toFixed(3))
	};
}

/** Sorted by slug and formatted with the repo's Prettier config, so `pnpm lint` stays clean. */
async function writeClassifications(labels) {
	const sorted = Object.fromEntries(
		Object.keys(labels)
			.sort()
			.map((slug) => [slug, labels[slug]])
	);
	const options = (await prettier.resolveConfig(CLASSIFICATIONS_PATH)) ?? {};
	const content = await prettier.format(JSON.stringify(sorted), {
		...options,
		filepath: CLASSIFICATIONS_PATH
	});
	fs.writeFileSync(CLASSIFICATIONS_PATH, content);
}

/**
 * Label `slugs` with Jev and save. Existing second careers, platforms, roles, breakout, born
 * and notes are kept; only the home path and confidence are replaced.
 * @param {string[]} slugs normalized person slugs
 * @param {{ log?: (line: string) => void }} [options]
 * @returns {Promise<{ labeled: Record<string, { home: string[], confidence: string }>, cost: number }>}
 */
export async function labelPeople(slugs, { log = console.log } = {}) {
	if (!slugs.length) return { labeled: {}, cost: 0 };
	const taxonomy = JSON.parse(fs.readFileSync(TAXONOMY_PATH, 'utf8'));
	const labels = readClassifications();
	const drafts = readDrafts();
	const jev = createJevClient({
		apiKey: readOpenRouterKey(root),
		cacheDir: path.join(root, 'tmp/jev-cache/people-classify')
	});
	const labeled = {};
	for (const slug of slugs) {
		const state = personState(slug, drafts.get(key(slug)));
		const result = await classify(jev, taxonomy, state);
		const previous = labels[slug];
		labels[slug] = {
			home: result.home,
			also: previous?.also ?? [],
			platforms: previous?.platforms ?? [],
			roles: previous?.roles ?? [],
			breakout: previous?.breakout ?? null,
			born: previous?.born ?? state.born,
			era: previous?.era ?? null,
			confidence: result.confidence,
			why: previous?.why ?? '',
			source: 'jev'
		};
		labeled[slug] = { home: result.home, confidence: result.confidence };
		log(`${slug}: ${result.home.join(' › ')} (${result.confidence}, p=${result.probability})`);
	}
	await writeClassifications(labels);
	return { labeled, cost: jev.stats.cost };
}
