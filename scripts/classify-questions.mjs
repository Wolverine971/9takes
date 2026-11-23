// scripts/classify-questions.mjs
/**
 * Jev files questions under the topic directory (src/lib/data/questionTaxonomy.json).
 * The cron does this for new questions; this CLI is for review, backfills and
 * directory changes.
 *
 *   pnpm questions:classify                     # questions whose topics are missing or stale
 *   pnpm questions:classify -- --report         # score them, write a local review, change nothing
 *   pnpm questions:classify -- --write          # sync the directory to the database, score, file
 *   pnpm questions:classify -- 81 104 --write   # (re)file specific questions
 *   pnpm questions:classify -- --all --report   # ignore stored results and score everything
 *   pnpm questions:classify -- --scope browse   # only questions readers can see (default: corpus)
 *   pnpm questions:classify -- --evaluate       # run the expected/excluded checks (pilot + holdout)
 *
 * Reports land in tmp/question-classification/ (git-ignored). Jev answers are cached
 * on disk by exact request, so a re-run only pays for what changed.
 * Topics an owner or admin picked are never overwritten; Jev's are stored beside them.
 */
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { createJevClient, readOpenRouterKey } from './lib/jevClient.js';
import {
	ACCEPT_AT,
	MAX_TOPICS,
	STRONG_AT,
	TOPIC_MODEL,
	buildTaxonomy,
	classifyQuestion,
	isCompleteScoreResponse,
	questionInputHash,
	taxonomyHash
} from '../src/lib/server/questionTopics/classify.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const planDir = path.join(root, 'docs/planning/question-classification');
const outDir = path.join(root, 'tmp/question-classification');
const sources = JSON.parse(
	fs.readFileSync(path.join(root, 'src/lib/data/questionTaxonomy.json'), 'utf8')
).topics;
const taxonomy = buildTaxonomy(sources);
const currentHash = taxonomyHash(sources);

const { values, positionals } = parseArgs({
	// pnpm 11 passes the `--` in `pnpm questions:classify -- --write` straight through.
	args: process.argv.slice(2).filter((arg) => arg !== '--'),
	allowPositionals: true,
	options: {
		write: { type: 'boolean' },
		report: { type: 'boolean' },
		all: { type: 'boolean' },
		evaluate: { type: 'boolean' },
		scope: { type: 'string', default: 'corpus' },
		output: { type: 'string' }
	}
});
if (!['browse', 'corpus'].includes(values.scope)) throw new Error('--scope is browse or corpus');
const namedIds = positionals.map(Number);
if (namedIds.some((id) => !Number.isInteger(id)))
	throw new Error('Question ids must be whole numbers');

function database() {
	dotenv.config({ path: path.join(root, '.env.local'), quiet: true });
	dotenv.config({ path: path.join(root, '.env'), quiet: true });
	return createClient(
		process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL,
		process.env.SUPABASE_SERVICE_KEY,
		{ auth: { persistSession: false, autoRefreshToken: false } }
	);
}

async function pages(build) {
	const rows = [];
	for (;;) {
		const { data, error } = await build().range(rows.length, rows.length + 999);
		if (error) throw error;
		rows.push(...data);
		if (data.length < 1000) return rows;
	}
}

async function loadQuestions(db) {
	const rows = await pages(() => {
		let query = db
			.from('questions')
			.select('id, question, question_formatted, flagged')
			.eq('removed', false)
			.order('id');
		if (namedIds.length) query = query.in('id', namedIds);
		else if (values.scope === 'browse') query = query.not('flagged', 'is', true);
		return query;
	});
	// Same text the cron files: what the asker typed, else the formatted copy.
	return rows
		.map(({ question_formatted, ...row }) => ({
			...row,
			question: String(row.question || question_formatted || '').trim()
		}))
		.filter((row) => row.question);
}

/** question id -> names of the categories it sits under today. */
async function loadCurrentCategories(db) {
	const rows = await pages(() =>
		db
			.from('question_category_tags')
			.select('question_id, question_categories(category_name)')
			.order('question_id')
			.order('tag_id')
	);
	const byQuestion = new Map();
	for (const row of rows) {
		const name = row.question_categories?.category_name;
		if (!name) continue;
		byQuestion.set(row.question_id, [...(byQuestion.get(row.question_id) ?? []), name]);
	}
	return byQuestion;
}

/** Stored results, or null before the question_topics migration is applied. */
async function loadStored(db) {
	try {
		const rows = await pages(() =>
			db
				.from('question_classifications')
				.select('question_id, input_hash, taxonomy_hash, status')
				.order('question_id')
		);
		return new Map(rows.map((row) => [row.question_id, row]));
	} catch (error) {
		if (/question_classifications/.test(error.message ?? '')) return null;
		throw error;
	}
}

function loadChecks() {
	return ['pilot', 'holdout'].flatMap((set) =>
		fs
			.readFileSync(path.join(planDir, `${set}.tsv`), 'utf8')
			.trimEnd()
			.split(/\r?\n/)
			.slice(1)
			.map((row) => {
				const [id, expected = '', excluded = '', control] = row.split('\t');
				return {
					set,
					id,
					expected: expected.split(',').filter(Boolean),
					excluded: excluded.split(',').filter(Boolean),
					control
				};
			})
	);
}

/** A check accepts a more specific descendant of an expected topic. */
function runChecks(results, checks) {
	const ancestry = new Map(taxonomy.map((node) => [node.key, node.ancestry]));
	const byId = new Map(results.map((row) => [String(row.id), row]));
	return checks.map(({ set, id, expected, excluded }) => {
		const result = byId.get(id);
		if (!result) return { set, id, status: 'absent' };
		if (result.error) return { set, id, status: 'error' };
		const found = new Set(result.topics.flatMap(({ key }) => ancestry.get(key)));
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

const percent = (fit) => `${Math.round(fit)}%`;
const cell = (text) => String(text).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();

function reviewMarkdown(results, currentCategories) {
	const line = (topic) => `${topic.path.replace(/ > /g, ' › ')} **${percent(topic.fit)}**`;
	const rows = results.map((row) => {
		if (row.error) return `| **${row.id}** ${cell(row.question)} | | error: ${cell(row.error)} | |`;
		const dropped = row.candidates.slice(row.topics.length);
		return `| **${row.id}** ${cell(row.question)} | ${cell((currentCategories.get(row.id) ?? []).join(' · ') || '—')} | ${row.topics.map(line).join('<br>') || '— (no topic fits)'} | ${dropped.map(line).join('<br>')} |`;
	});
	const abstained = results.filter((row) => !row.error && !row.topics.length).length;
	return [
		'# Question topics review',
		'',
		`${new Date().toISOString().slice(0, 10)} · ${TOPIC_MODEL} · ${results.length} questions · ${abstained} with no topic`,
		'',
		`Percentages are independent topic fit. A topic fits at ${percent(ACCEPT_AT)}; ${percent(STRONG_AT)} and up is a strong match. A question keeps its strong topics (up to ${MAX_TOPICS}) and weaker ones only fill it to three. "Not kept" lists fitting topics past that.`,
		'',
		'| Question | Filed under today | Jev files it under | Not kept |',
		'| --- | --- | --- | --- |',
		...rows,
		''
	].join('\n');
}

function writeFileAtomic(file, text) {
	fs.mkdirSync(path.dirname(file), { recursive: true });
	const temporary = `${file}.${randomUUID()}.tmp`;
	fs.writeFileSync(temporary, text);
	fs.renameSync(temporary, file);
}

async function syncTaxonomy(db) {
	const { data, error } = await db.rpc('sync_question_taxonomy', {
		p_topics: taxonomy.map(({ key, parent, label, scope, depth }) => ({
			key,
			parent,
			label,
			scope,
			depth
		}))
	});
	if (error) {
		throw new Error(
			`Could not sync the directory (${error.message}). Apply supabase/migrations/20261122170000_question_topics.sql first.`
		);
	}
	const changes = data.filter((row) => row.action !== 'unchanged');
	console.log(
		changes.length
			? `Directory synced: ${changes.map((row) => `${row.action} ${row.topic_key ?? row.slug}`).join(', ')}`
			: `Directory already in sync (${data.length} topics).`
	);
}

async function main() {
	const db = database();
	const [questions, stored] = await Promise.all([loadQuestions(db), loadStored(db)]);
	const isCurrent = (row) => {
		const saved = stored?.get(row.id);
		return (
			saved?.taxonomy_hash === currentHash && saved.input_hash === questionInputHash(row.question)
		);
	};
	const targets =
		values.all || namedIds.length ? questions : questions.filter((row) => !isCurrent(row));

	if (!values.write && !values.report && !values.evaluate) {
		console.log(
			`${targets.length} of ${questions.length} questions need topics (${values.scope}).` +
				(stored ? '' : ' The question_topics migration is not applied yet.')
		);
		for (const row of targets.slice(0, 40))
			console.log(`  ${row.id}  ${row.question.slice(0, 90)}`);
		if (targets.length > 40) console.log(`  … and ${targets.length - 40} more`);
		console.log('Add --report to score them without saving, or --write to file them.');
		return;
	}

	const checks = values.evaluate ? loadChecks() : [];
	const rows = targets.map((row) => ({ ...row }));
	if (values.evaluate) {
		const have = new Set(rows.map((row) => String(row.id)));
		const byId = new Map(questions.map((row) => [String(row.id), row]));
		for (const check of checks) {
			if (have.has(check.id)) continue;
			if (check.control) rows.push({ id: check.id, question: check.control, control: true });
			else if (byId.has(check.id)) rows.push({ ...byId.get(check.id) });
			have.add(check.id);
		}
	}
	if (!rows.length) {
		console.log('Every question already has current topics.');
		return;
	}

	if (values.write) await syncTaxonomy(db);
	const jev = createJevClient({
		apiKey: readOpenRouterKey(root),
		model: TOPIC_MODEL,
		isCacheable: isCompleteScoreResponse,
		cacheDir: path.join(outDir, 'cache')
	});

	const results = [];
	let written = 0;
	let keptManual = 0;
	for (let offset = 0; offset < rows.length; offset += 6) {
		const batch = rows.slice(offset, offset + 6);
		results.push(
			...(await Promise.all(
				batch.map(async (row) => {
					const base = { id: row.id, question: row.question, flagged: row.flagged === true };
					try {
						const result = await classifyQuestion(row.question, taxonomy, jev);
						if (values.write && !row.control) {
							const { data, error } = await db.rpc('apply_question_topics', {
								p_question_id: row.id,
								p_topics: result.topics.map(({ key, fit }) => ({ key, fit: Math.round(fit) })),
								p_source: 'jev',
								p_classification: {
									input_hash: questionInputHash(row.question),
									taxonomy_hash: currentHash,
									model: TOPIC_MODEL,
									candidates: result.candidates,
									scores: result.scores
								}
							});
							if (error) throw new Error(`Saving failed: ${error.message}`);
							written++;
							if (data?.kept_manual) keptManual++;
						}
						return { ...base, ...result };
					} catch (error) {
						return { ...base, error: error.message };
					}
				})
			))
		);
		if (process.stdout.isTTY) process.stdout.write(`\r${results.length}/${rows.length} scored`);
	}
	if (process.stdout.isTTY) process.stdout.write('\n');

	const failed = results.filter((row) => row.error);
	const abstained = results.filter((row) => !row.error && !row.topics.length);
	const checkResults = runChecks(results, checks);
	const report = {
		model: TOPIC_MODEL,
		scope: namedIds.length ? 'named' : values.scope,
		taxonomyHash: currentHash,
		thresholds: { acceptAt: ACCEPT_AT, strongAt: STRONG_AT, maxTopics: MAX_TOPICS },
		createdAt: new Date().toISOString(),
		usage: jev.stats,
		checks: checkResults,
		results
	};
	const name = namedIds.length ? 'named' : values.scope;
	const output = values.output ? path.resolve(values.output) : path.join(outDir, `${name}.json`);
	writeFileAtomic(output, JSON.stringify(report, null, 2) + '\n');
	const review = output.replace(/\.json$/, '') + '-review.md';
	writeFileAtomic(review, reviewMarkdown(results, await loadCurrentCategories(db)));

	console.log(
		`${results.length - failed.length} scored, ${abstained.length} with no topic, ${failed.length} errors. ` +
			`Jev: ${jev.stats.calls} calls, ${jev.stats.cached} cached, $${jev.stats.cost.toFixed(4)}.`
	);
	if (values.write)
		console.log(`Filed ${written} questions (${keptManual} kept their hand-picked topics).`);
	if (checks.length) {
		for (const set of ['pilot', 'holdout']) {
			const inSet = checkResults.filter((check) => check.set === set);
			const passed = inSet.filter((check) => check.status === 'pass').length;
			console.log(`${set}: ${passed}/${inSet.length} checks pass`);
		}
		for (const check of checkResults.filter((entry) => entry.status !== 'pass')) {
			console.log(
				`  ${check.set} ${check.id}: ${check.status}` +
					(check.missing?.length ? ` missing ${check.missing.join(',')}` : '') +
					(check.unwanted?.length ? ` unwanted ${check.unwanted.join(',')}` : '')
			);
		}
	}
	console.log(`Report: ${path.relative(root, output)}\nReview: ${path.relative(root, review)}`);
	for (const row of failed.slice(0, 10)) console.error(`  ${row.id}: ${row.error}`);
	if (failed.length) process.exitCode = 1;
}

main().catch((error) => {
	console.error(error.message ?? error);
	process.exitCode = 1;
});
