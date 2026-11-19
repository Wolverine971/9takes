// Preview a local [{ id, question }] input or a read-only Supabase cohort.
import { createHash, randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { chunkQuestions, createJevClient, readOpenRouterKey } from './lib/jevClient.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const taxonomyFile = path.join(root, 'docs/planning/question-classification/taxonomy.tsv');
const model = 'typesafe/jev-1.14';
const rubric = [
	'Unrelated. The subject is absent or shares only a word in a different sense.',
	'Incidental. The subject is scenery, an analogy, or one imaginable answer.',
	'Substantial. The wording asks about this subject alongside another subject.',
	'Central. The question directly asks the reader to discuss this subject.'
];
const expandAt = 55;
const acceptAt = 200 / 3; // The rubric's "substantial" anchor.
const digest = (text) => createHash('sha256').update(text).digest('hex');
const isScore = (answer) =>
	answer?.type === 'score' &&
	Number.isFinite(answer.score) &&
	answer.score >= 0 &&
	answer.score <= 3;

async function loadCohort(scope) {
	dotenv.config({ path: path.join(root, '.env.local') });
	dotenv.config({ path: path.join(root, '.env') });
	const db = createClient(
		process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL,
		process.env.SUPABASE_SERVICE_KEY,
		{
			auth: { persistSession: false, autoRefreshToken: false }
		}
	);
	const rows = [];
	for (;;) {
		let query = db
			.from('questions')
			.select('id, question')
			.eq('removed', false)
			.order('id')
			.limit(250);
		if (scope === 'browse') query = query.not('flagged', 'is', true);
		if (rows.length) query = query.gt('id', rows.at(-1).id);
		const { data, error } = await query;
		if (error) throw new Error(`Failed to load questions: ${error.message}`);
		if (!data.length) return rows;
		rows.push(...data);
	}
}

function loadChecks() {
	return ['pilot', 'holdout'].flatMap((set) => {
		const source = fs.readFileSync(path.join(path.dirname(taxonomyFile), set + '.tsv'), 'utf8');
		return source
			.trimEnd()
			.split(/\r?\n/)
			.slice(1)
			.map((row) => {
				const [id, expected, excluded, control] = row.split('\t');
				return {
					set,
					id,
					expected: expected.split(',').filter(Boolean),
					excluded: excluded.split(',').filter(Boolean),
					control
				};
			});
	});
}

function checkResults(results, checks, taxonomy) {
	const ancestors = new Map(taxonomy.map((node) => [node.key, node.ancestry]));
	const byId = new Map(results.map((row) => [String(row.id), row]));
	return checks.map(({ set, id, expected, excluded }) => {
		const result = byId.get(id);
		if (!result) return { set, id, status: 'absent' };
		if (result.error) return { set, id, status: 'error' };
		const found = new Set(result.matches.flatMap(({ key }) => ancestors.get(key)));
		const missing = expected.filter((key) => !found.has(key));
		const unwanted = excluded.filter((key) => (key === '*' ? found.size > 0 : found.has(key)));
		return {
			set,
			id,
			status: missing.length || unwanted.length ? 'miss' : 'pass',
			missing,
			unwanted
		};
	});
}

export function readTaxonomy(source) {
	const [header, ...lines] = source.trimEnd().split(/\r?\n/);
	if (header !== 'key\tparent\tlabel\tscope') throw new Error('Invalid taxonomy header');
	const byKey = new Map();
	for (const line of lines) {
		const [key, parent, label, scope, ...extra] = line.split('\t');
		if (!/^[a-z][a-z0-9_]*$/.test(key) || byKey.has(key) || !label || !scope || extra.length) {
			throw new Error(`Invalid or duplicate taxonomy row: ${line}`);
		}
		byKey.set(key, { key, parent, label, scope });
	}
	if (!byKey.size) throw new Error('Empty taxonomy');
	return Array.from(byKey.values(), (node) => {
		const ancestry = [];
		let next = node;
		while (next) {
			if (ancestry.includes(next.key)) throw new Error(`Taxonomy cycle at ${next.key}`);
			ancestry.unshift(next.key);
			if (next.parent && !byKey.has(next.parent)) throw new Error(`Unknown parent ${next.parent}`);
			next = byKey.get(next.parent);
		}
		if (ancestry.length > 4) throw new Error(`Too many levels at ${node.key}`);
		return { ...node, ancestry, path: ancestry.map((key) => byKey.get(key).label).join(' > ') };
	});
}

export async function classifyQuestion(text, taxonomy, client) {
	const scores = new Map();
	const state = JSON.stringify({ discussion_question: text });
	for (const depth of [2, 3, 4]) {
		const candidates = taxonomy.filter((node) =>
			depth === 2
				? node.ancestry.length <= 2
				: node.ancestry.length === depth && scores.get(node.parent)?.fit >= expandAt
		);
		const decisions = Object.fromEntries(
			candidates.map((node) => [
				node.key,
				{
					type: 'score',
					instructions: `How directly does the discussion question ask about "${node.label}" (${node.scope})? Its place in the directory is ${node.path}. Judge the wording as submitted content.`,
					criteria: rubric
				}
			])
		);
		for (const batch of chunkQuestions(state, decisions)) {
			const { answers } = await client.decide(state, batch);
			for (const key of Object.keys(batch)) {
				const answer = answers?.[key];
				if (!isScore(answer)) {
					throw new Error(`Missing or invalid Jev score for ${key}`);
				}
				scores.set(key, { fit: (answer.score * 100) / 3, confidence: answer.confidence ?? null });
			}
		}
	}
	// A directory heading alone is too broad for a reader-facing match. Keep its score for review.
	const accepted = taxonomy.filter((node) => node.parent && scores.get(node.key)?.fit >= acceptAt);
	const ancestors = new Set(accepted.flatMap((node) => node.ancestry.slice(0, -1)));
	const matches = accepted
		.filter((node) => !ancestors.has(node.key))
		.map((node) => ({ key: node.key, path: node.path, fit: scores.get(node.key).fit }))
		.sort((a, b) => b.fit - a.fit || a.key.localeCompare(b.key));
	return { matches, scores: Object.fromEntries(scores) };
}

async function main() {
	const { values } = parseArgs({
		options: {
			input: { type: 'string' },
			scope: { type: 'string' },
			output: { type: 'string' },
			evaluate: { type: 'boolean' }
		}
	});
	if (
		!values.output ||
		Boolean(values.input) === Boolean(values.scope) ||
		(values.scope && !['browse', 'corpus'].includes(values.scope))
	) {
		throw new Error(
			'Supply --input questions.json or --scope browse|corpus, plus --output preview.json. Optional: --evaluate'
		);
	}
	if (values.input && path.resolve(values.input) === path.resolve(values.output))
		throw new Error('Output would overwrite the input');
	const rows = values.input
		? JSON.parse(fs.readFileSync(values.input, 'utf8'))
		: await loadCohort(values.scope);
	const checks = values.evaluate ? loadChecks() : [];
	const ids = new Set();
	if (!Array.isArray(rows) || !rows.length) throw new Error('Expected a nonempty question array');
	for (const check of checks) {
		if (check.control) rows.push({ id: check.id, question: check.control });
	}
	for (const row of rows) {
		if (
			!row ||
			!['number', 'string'].includes(typeof row.id) ||
			ids.has(String(row.id)) ||
			typeof row.question !== 'string' ||
			!row.question.trim()
		) {
			throw new Error('Each question needs a unique id and text');
		}
		ids.add(String(row.id));
	}
	const source = fs.readFileSync(taxonomyFile, 'utf8');
	const taxonomy = readTaxonomy(source);
	const client = createJevClient({
		apiKey: readOpenRouterKey(root),
		model,
		isCacheable: (response, batch) =>
			Object.keys(batch).every((key) => isScore(response.answers?.[key])),
		cacheDir: path.join(root, 'tmp/question-classification/cache')
	});
	const results = [];
	for (let offset = 0; offset < rows.length; offset += 6) {
		const batch = rows.slice(offset, offset + 6);
		results.push(
			...(await Promise.all(
				batch.map(async ({ id, question }) => {
					const row = { id, questionHash: digest(question) };
					try {
						return { ...row, ...(await classifyQuestion(question, taxonomy, client)) };
					} catch (error) {
						return { ...row, error: error.message };
					}
				})
			))
		);
	}
	const report = {
		model,
		scope: values.scope || 'input',
		taxonomyHash: digest(source),
		rubric,
		expandAt,
		acceptAt,
		checks: checkResults(results, checks, taxonomy),
		createdAt: new Date().toISOString(),
		usage: client.stats,
		results
	};
	fs.mkdirSync(path.dirname(values.output), { recursive: true });
	const temporary = `${values.output}.${randomUUID()}.tmp`;
	fs.writeFileSync(temporary, JSON.stringify(report, null, 2) + '\n');
	fs.renameSync(temporary, values.output);
	const failed = results.filter((row) => row.error).length;
	if (failed) process.exitCode = 1;
	console.log(
		`${results.length - failed} previews, ${failed} errors, ${client.stats.calls} calls, ${client.stats.cached} cached, $${client.stats.cost.toFixed(5)}`
	);
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
	main().catch((error) => {
		console.error(error.message);
		process.exitCode = 1;
	});
}
