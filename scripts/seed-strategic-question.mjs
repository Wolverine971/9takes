// scripts/seed-strategic-question.mjs
//
// Loads DJ-approved seed takes for a strategic question (T-12) into
// `nine_takes`, keyed by the backing question row: subject_type 'question',
// subject_slug = questions.url. The blog-embedded StrategicQuestion widget
// reads exactly this key via getChorusForQuestion().
//
// Reads the seed markdown file (default: the wave-1 masking question), parses
// the nine takes, verifies the backing `questions` row exists, and UPSERTS the
// set. Idempotent: re-running replaces the same row in place.
//
// Run manually AFTER DJ approves the seed file. Never wired into any cron.
//
// Usage:
//   node scripts/seed-strategic-question.mjs --dry-run
//   node scripts/seed-strategic-question.mjs
//   node scripts/seed-strategic-question.mjs --file=docs/content-research/2026-07-15-wave1-seed-takes.md

import { readFile } from 'node:fs/promises';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) throw new Error('Supabase env not set');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
	auth: { autoRefreshToken: false, persistSession: false }
});

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FILE =
	args.find((a) => a.startsWith('--file='))?.split('=')[1] ||
	'docs/content-research/2026-07-15-wave1-seed-takes.md';

const ARCHETYPES = {
	1: 'The Reformer',
	2: 'The Helper',
	3: 'The Achiever',
	4: 'The Individualist',
	5: 'The Investigator',
	6: 'The Loyalist',
	7: 'The Enthusiast',
	8: 'The Challenger',
	9: 'The Peacemaker'
};

function parseSeedFile(raw) {
	// Question display text: the line `Question: "..."`.
	const questionMatch = raw.match(/^Question:\s*"(.+)"\s*$/m);
	if (!questionMatch) throw new Error('Could not find the Question: "..." line');
	const question = questionMatch[1].trim();

	// Backing question slug: the `/questions/<slug>` reference.
	const urlMatch = raw.match(/\/questions\/([a-z0-9-]+)/);
	if (!urlMatch) throw new Error('Could not find the /questions/<slug> reference');
	const questionUrl = urlMatch[1];

	// Expected id, if the file states one (used only for a sanity check).
	const idMatch = raw.match(/\bid\s+(\d+)/);
	const expectedId = idMatch ? Number(idMatch[1]) : null;

	// The nine takes: `**Type N**` (optionally followed on the same line by a
	// hidden persona note, which is NOT part of the take) then the take paragraph(s).
	const takePattern = /\*\*Type (\d)\*\*[^\n]*\n([\s\S]*?)(?=\n\*\*Type \d\*\*|$)/g;
	const byType = new Map();
	for (const match of raw.matchAll(takePattern)) {
		const type = Number(match[1]);
		const text = match[2].replace(/\s+/g, ' ').trim();
		if (type >= 1 && type <= 9 && text) byType.set(type, text);
	}

	const takes = [];
	for (let type = 1; type <= 9; type++) {
		const take = byType.get(type);
		if (!take) throw new Error(`Missing take for type ${type}`);
		takes.push({ type, archetype: ARCHETYPES[type], take, source: 'human' });
	}

	// House rule: no em-dashes anywhere in seed copy (checked via escape so this
	// script itself stays clean).
	const emDash = '\u2014';
	if (question.includes(emDash) || takes.some((t) => t.take.includes(emDash))) {
		throw new Error('Em-dash found in seed copy; fix the seed file first');
	}

	return { question, questionUrl, expectedId, takes };
}

async function main() {
	const raw = await readFile(FILE, 'utf8');
	const { question, questionUrl, expectedId, takes } = parseSeedFile(raw);

	console.log(`Seed file: ${FILE}`);
	console.log(`Question:  ${question}`);
	console.log(`Backing:   /questions/${questionUrl}`);
	for (const t of takes) {
		console.log(`  Type ${t.type}: ${t.take.slice(0, 70)}${t.take.length > 70 ? '...' : ''}`);
	}

	const { data: q, error: qErr } = await supabase
		.from('questions')
		.select('id, url, comment_count')
		.eq('url', questionUrl)
		.maybeSingle();
	if (qErr) throw new Error(`questions lookup: ${qErr.message}`);
	if (!q) throw new Error(`No questions row with url ${questionUrl}; create the question first`);

	console.log(`\nQuestions row: id=${q.id}, comment_count=${q.comment_count ?? 0}`);
	if (expectedId != null && q.id !== expectedId) {
		console.warn(`  WARNING: seed file expects id ${expectedId}, database has id ${q.id}`);
	}

	if (DRY_RUN) {
		console.log('\n[dry-run] Would upsert nine_takes (question, ' + questionUrl + '). No writes.');
		return;
	}

	const { error: upsertErr } = await supabase.from('nine_takes').upsert(
		{
			subject_type: 'question',
			subject_slug: questionUrl,
			situation: question,
			takes,
			model: 'human-seeded',
			updated_at: new Date().toISOString()
		},
		{ onConflict: 'subject_type,subject_slug' }
	);
	if (upsertErr) throw new Error(`nine_takes upsert: ${upsertErr.message}`);

	console.log(`\nDone. nine_takes upserted for (question, ${questionUrl}).`);
	console.log('The StrategicQuestion widget on the pilot pages is now live-capable.');
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
