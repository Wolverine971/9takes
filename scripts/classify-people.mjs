// scripts/classify-people.mjs
/**
 * Jev labels people for the v3 people taxonomy (src/lib/data/peopleTaxonomy.json).
 *
 *   pnpm people:classify                 # list published people with no label yet
 *   pnpm people:classify -- --write      # label them with Jev and save
 *   pnpm people:classify -- <slug> ... --write   # (re)label specific people
 *   pnpm people:classify -- --check      # fail if any published person is unlabeled (CI/gate)
 *
 * Jev answers typed choices with probabilities, so it picks the home path in two steps:
 * field, then niche (+ sub) inside that field. It writes no text, so second careers
 * ("also"), platforms, roles and breakout stay empty with source "jev" until a person or
 * an agent pass fills them. A home below 0.6 probability is marked low confidence.
 * Labels live in src/lib/data/personClassifications.json; the type pages read them.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { createJevClient, readOpenRouterKey } from './lib/jevClient.js';
import { normalizePersonalitySlug } from './lib/personalitySeo.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const TAXONOMY = JSON.parse(
	fs.readFileSync(path.join(root, 'src/lib/data/peopleTaxonomy.json'), 'utf8')
);
const OUTPUT = path.join(root, 'src/lib/data/personClassifications.json');
const ROSTER = path.join(root, 'src/lib/generated/personalitySimilaritySnapshot.json');
const DRAFTS = path.join(root, 'src/blog/people/drafts');

const args = process.argv.slice(2);
const write = args.includes('--write');
const check = args.includes('--check');
const named = args.filter((arg) => !arg.startsWith('--')).map(normalizePersonalitySlug);

const key = (value) =>
	String(value)
		.normalize('NFD')
		.replace(/[^a-z0-9]/gi, '')
		.toLowerCase();
const list = (value) => (Array.isArray(value) ? value : value ? [String(value)] : []);

function readDrafts() {
	const drafts = new Map();
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

function fieldQuestion() {
	return {
		type: 'choice',
		instructions: `Which field is this person's home? ${RULES}`,
		criteria: Object.fromEntries(
			TAXONOMY.fields.map((field) => [field.key, `${field.label}: ${field.description}`])
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

async function classify(jev, state) {
	const first = await jev.decide(state, { field: fieldQuestion() });
	const fieldAnswer = first.answers.field;
	const field = TAXONOMY.fields.find((candidate) => candidate.key === fieldAnswer.choice);
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

function sortedJson(record) {
	const sorted = Object.fromEntries(
		Object.keys(record)
			.sort()
			.map((slug) => [slug, record[slug]])
	);
	return JSON.stringify(sorted, null, '\t') + '\n';
}

async function main() {
	const labels = JSON.parse(fs.readFileSync(OUTPUT, 'utf8'));
	const roster = JSON.parse(fs.readFileSync(ROSTER, 'utf8')).map((row) =>
		normalizePersonalitySlug(row.person)
	);
	const missing = roster.filter((slug) => !Object.hasOwn(labels, slug));
	const targets = named.length ? named : missing;

	if (check) {
		if (missing.length) {
			console.error(
				`${missing.length} published people have no taxonomy label:\n  ${missing.join('\n  ')}`
			);
			console.error('Run: pnpm people:classify -- --write');
			process.exit(1);
		}
		console.log(`All ${roster.length} published people are labeled.`);
		return;
	}
	if (!targets.length) {
		console.log(`All ${roster.length} published people are labeled.`);
		return;
	}
	if (!write) {
		console.log(`${targets.length} to label (dry run; add --write):\n  ${targets.join('\n  ')}`);
		return;
	}

	const drafts = readDrafts();
	const jev = createJevClient({
		apiKey: readOpenRouterKey(root),
		cacheDir: path.join(root, 'tmp/jev-cache/people-classify')
	});
	for (const slug of targets) {
		const draft = drafts.get(key(slug));
		const state = personState(slug, draft);
		const result = await classify(jev, state);
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
		console.log(
			`${slug}: ${result.home.join(' › ')} (${result.confidence}, p=${result.probability})`
		);
	}
	fs.writeFileSync(OUTPUT, sortedJson(labels));
	console.log(`Saved ${targets.length}. Jev cost $${jev.stats.cost.toFixed(4)}.`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
