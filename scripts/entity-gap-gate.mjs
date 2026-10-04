#!/usr/bin/env node
// scripts/entity-gap-gate.mjs

// Wikipedia gate + biography-intent probe for /find-emerging-entity-gaps.
//
// Step 1.5 of the command eliminates most candidates on a single fact: a personal
// Wikipedia article already owns the generic biography query. This script runs
// that gate for a batch of names, then probes Google autocomplete for real
// biography-intent suggestions (age, wife, parents, net worth, ...), so scoring
// effort only goes to names that survive.
//
// Verdicts:
//   FAIL   a non-disambiguation article exists under the exact name. Usually a
//          personal biography; read the description to confirm.
//   CHECK  redirect to a different title (a show, company, or another person) or a
//          disambiguation page. A human decides whether a personal article exists.
//   PASS   no article (HTTP 404). Also reports the deletion log and any Draft: page,
//          because a pending draft means the gap may close soon.
//
// Autocomplete suggestions are real query suggestions, never invented ones. They
// show that biography intent exists, not how much of it there is.
//
// Usage:
//   node scripts/entity-gap-gate.mjs "Codie Sanchez" "Shyam Sankar"
//   node scripts/entity-gap-gate.mjs --file names.txt     # one name per line
//   node scripts/entity-gap-gate.mjs --no-suggest "Dylan Patel"
//   node scripts/entity-gap-gate.mjs --json "Dylan Patel"

import { readFileSync } from 'node:fs';

const USER_AGENT = '9takes-entity-gap-gate/1.0 (https://9takes.com; djwayne35@gmail.com)';
const WIKI = 'https://en.wikipedia.org';
// The MediaWiki action API rate-limits bursts; one request per second keeps it quiet.
const ACTION_API_DELAY_MS = 1100;
const BIO_TERMS =
	/\b(age|wife|husband|girlfriend|boyfriend|partner|married|parents|family|kids|children|net worth|height|real name|ethnicity|nationality|religion|wikipedia|wiki|bio|biography|background|education|college|born|from|who is|brother|sister|dad|father|mom|mother|salary)\b/;

function parseArgs(argv) {
	const options = { names: [], json: false, suggest: true };
	for (let index = 0; index < argv.length; index += 1) {
		const argument = argv[index];
		if (argument === '--json') options.json = true;
		else if (argument === '--no-suggest') options.suggest = false;
		else if (argument === '--file') {
			const lines = readFileSync(argv[(index += 1)], 'utf8').split('\n');
			options.names.push(...lines.map((line) => line.trim()).filter(Boolean));
		} else options.names.push(argument.trim());
	}
	options.names = [...new Set(options.names.filter(Boolean))];
	if (options.names.length === 0) {
		throw new Error('Pass one or more names, or --file <path> with one name per line');
	}
	return options;
}

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));
const titleOf = (name) => name.replace(/ /g, '_');

async function getJson(url, { retries = 3 } = {}) {
	for (let attempt = 0; attempt <= retries; attempt += 1) {
		const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
		const text = await response.text();
		try {
			return { status: response.status, body: JSON.parse(text) };
		} catch {
			// Rate-limit responses come back as plain text; back off and retry.
			if (attempt === retries) return { status: response.status, body: null };
			await sleep(ACTION_API_DELAY_MS * (attempt + 2));
		}
	}
	return { status: 0, body: null };
}

async function actionApi(params) {
	await sleep(ACTION_API_DELAY_MS);
	const query = new URLSearchParams({ format: 'json', ...params });
	return (await getJson(`${WIKI}/w/api.php?${query}`)).body;
}

async function wikipediaGate(name) {
	const { status, body } = await getJson(
		`${WIKI}/api/rest_v1/page/summary/${encodeURIComponent(titleOf(name))}?redirect=true`
	);
	if (status === 404) {
		const log = await actionApi({
			action: 'query',
			list: 'logevents',
			letitle: titleOf(name),
			lelimit: '5'
		});
		const deletions = (log?.query?.logevents ?? [])
			.filter((event) => event.type === 'delete' && event.action === 'delete')
			.map(
				(event) => `${event.timestamp.slice(0, 10)} ${String(event.comment ?? '').slice(0, 80)}`
			);
		const draft = await actionApi({
			action: 'query',
			prop: 'info|revisions',
			rvprop: 'timestamp|comment',
			titles: `Draft:${titleOf(name)}`
		});
		const draftPage = Object.values(draft?.query?.pages ?? {})[0];
		const pendingDraft =
			draftPage && !('missing' in draftPage)
				? {
						bytes: draftPage.length,
						lastEdit: draftPage.revisions?.[0]?.timestamp?.slice(0, 10) ?? null,
						lastComment: String(draftPage.revisions?.[0]?.comment ?? '').slice(0, 100)
					}
				: null;
		return { verdict: 'PASS', detail: 'no article (HTTP 404)', deletions, pendingDraft };
	}
	if (!body) return { verdict: 'CHECK', detail: `summary API returned HTTP ${status}; re-run` };
	const redirected = body.title && body.title.replace(/_/g, ' ') !== name;
	if (body.type === 'disambiguation') {
		const search = await actionApi({ action: 'opensearch', search: name, limit: '8' });
		const qualified = (search?.[1] ?? []).filter((title) =>
			title.toLowerCase().startsWith(name.toLowerCase())
		);
		return { verdict: 'CHECK', detail: `disambiguation; candidates: ${qualified.join('; ')}` };
	}
	if (redirected) {
		return { verdict: 'CHECK', detail: `redirects to "${body.title}": ${body.description ?? ''}` };
	}
	return { verdict: 'FAIL', detail: body.description || (body.extract ?? '').slice(0, 100) };
}

async function biographySuggestions(name) {
	const lower = name.toLowerCase();
	const seen = new Set();
	for (const prefix of [
		lower,
		`${lower} `,
		`who is ${lower}`,
		`${lower} w`,
		`${lower} a`,
		`${lower} h`,
		`${lower} p`
	]) {
		const response = await fetch(
			`https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q=${encodeURIComponent(prefix)}`,
			{ headers: { 'User-Agent': 'Mozilla/5.0' } }
		);
		try {
			for (const suggestion of JSON.parse(await response.text())[1] ?? [])
				seen.add(suggestion.toLowerCase());
		} catch {
			// An empty or blocked response simply contributes no suggestions.
		}
	}
	return [...seen].filter(
		(suggestion) => suggestion.includes(lower) && BIO_TERMS.test(suggestion.replace(lower, ''))
	);
}

const options = parseArgs(process.argv.slice(2));
const results = [];
for (const name of options.names) {
	const gate = await wikipediaGate(name);
	const bio = options.suggest && gate.verdict !== 'FAIL' ? await biographySuggestions(name) : null;
	results.push({ name, ...gate, biographySuggestions: bio });
	if (!options.json) {
		const extras = [];
		if (gate.deletions?.length) extras.push(`deleted: ${gate.deletions.join(' | ')}`);
		if (gate.pendingDraft) {
			extras.push(
				`DRAFT ${gate.pendingDraft.bytes}B, last edit ${gate.pendingDraft.lastEdit}: ${gate.pendingDraft.lastComment}`
			);
		}
		if (bio) extras.push(`bio-intent ${bio.length}: ${bio.slice(0, 10).join(' | ')}`);
		console.log(`${gate.verdict.padEnd(5)} ${name.padEnd(24)} ${gate.detail}`);
		for (const extra of extras) console.log(`      ${extra}`);
	}
}

if (options.json) console.log(JSON.stringify(results, null, 2));
else {
	const count = (verdict) => results.filter((result) => result.verdict === verdict).length;
	console.log(
		`\n${results.length} names: ${count('PASS')} PASS, ${count('CHECK')} CHECK, ${count('FAIL')} FAIL`
	);
	console.log('PASS + biography intent + a dated catalyst = worth a full Step 2-5 scoring pass.');
}
