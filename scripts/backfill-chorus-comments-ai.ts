// scripts/backfill-chorus-comments-ai.ts
//
// One-time backfill: copy the pre-generated chorus nine takes (nine_takes.takes)
// into comments_ai for the chorus-backed questions that have zero AI takes, so
// /questions/[slug] can show the nine perspectives it already promises.
//
// Background (2026-08-13 comms audit): 358 chorus questions created 2026-06 have
// zero comments_ai rows because question post-processing dies on Vercel freeze,
// but their nine takes already exist in nine_takes keyed by
// (subject_type='personality-analysis', subject_slug = questions.data->>'subject_slug').
// getAIComments on the question page reads only comments_ai.
//
// Safety:
//   - Dry run by default; pass --apply to write.
//   - Only touches questions with data->>'source'='chorus' AND zero existing
//     comments_ai rows (re-checked at run time), whose nine_takes row has
//     exactly 9 valid takes covering types 1-9.
//   - Writes a manifest (question ids + inserted row counts) to
//     docs/data/backfills/<date>-chorus-comments-ai.json for reversibility:
//     revert = DELETE FROM comments_ai WHERE question_id = ANY(manifest ids)
//     (those questions had zero rows before this run).
//
// Usage:
//   pnpm exec tsx scripts/backfill-chorus-comments-ai.ts          # dry run
//   pnpm exec tsx scripts/backfill-chorus-comments-ai.ts --apply  # write

import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) throw new Error('Supabase env not set');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
	auth: { autoRefreshToken: false, persistSession: false }
});

const APPLY = process.argv.includes('--apply');

type Take = { take?: string; type?: number };

async function fetchAll<T>(table: string, select: string, filter?: (q: any) => any): Promise<T[]> {
	const rows: T[] = [];
	const page = 1000;
	for (let from = 0; ; from += page) {
		let q = supabase
			.from(table)
			.select(select)
			.range(from, from + page - 1);
		if (filter) q = filter(q);
		const { data, error } = await q;
		if (error) throw new Error(`${table}: ${error.message}`);
		rows.push(...((data ?? []) as T[]));
		if (!data || data.length < page) break;
	}
	return rows;
}

async function main() {
	const questions = await fetchAll<{ id: number; url: string; data: any; removed: boolean | null }>(
		'questions',
		'id, url, data, removed',
		(q) => q.eq('data->>source', 'chorus')
	);
	const live = questions.filter((q) => q.removed !== true && q.data?.subject_slug);

	const takesRows = await fetchAll<{ subject_slug: string; takes: Take[] }>(
		'nine_takes',
		'subject_slug, takes',
		(q) => q.eq('subject_type', 'personality-analysis')
	);
	const takesBySlug = new Map(takesRows.map((r) => [r.subject_slug, r.takes]));

	const existing = await fetchAll<{ question_id: number }>('comments_ai', 'question_id', (q) =>
		q.in(
			'question_id',
			live.map((x) => x.id)
		)
	);
	const hasAi = new Set(existing.map((r) => r.question_id));

	const plan: { question_id: number; url: string; slug: string; rows: any[] }[] = [];
	const skipped: { url: string; reason: string }[] = [];

	for (const q of live) {
		if (hasAi.has(q.id)) {
			skipped.push({ url: q.url, reason: 'already has comments_ai rows' });
			continue;
		}
		const takes = takesBySlug.get(q.data.subject_slug);
		if (!takes || !Array.isArray(takes)) {
			skipped.push({ url: q.url, reason: `no nine_takes row for ${q.data.subject_slug}` });
			continue;
		}
		const clean = takes.filter(
			(t) => t && typeof t.take === 'string' && t.take.trim() && Number.isInteger(t.type)
		);
		const types = new Set(clean.map((t) => t.type));
		if (clean.length !== 9 || types.size !== 9 || [...types].some((t) => t! < 1 || t! > 9)) {
			skipped.push({
				url: q.url,
				reason: `invalid takes set (${clean.length} valid, ${types.size} types)`
			});
			continue;
		}
		plan.push({
			question_id: q.id,
			url: q.url,
			slug: q.data.subject_slug,
			rows: clean.map((t) => ({
				question_id: q.id,
				enneagram_type: String(t.type),
				comment: t.take!.trim()
			}))
		});
	}

	console.log(
		`Chorus comments_ai backfill ${APPLY ? '[APPLY]' : '[dry run]'}\n` +
			`  chorus questions (live, with slug): ${live.length}\n` +
			`  to backfill: ${plan.length} questions -> ${plan.length * 9} rows\n` +
			`  skipped: ${skipped.length}`
	);
	for (const s of skipped) console.log(`    - ${s.url}: ${s.reason}`);
	if (plan.length) {
		const sample = plan[0];
		console.log(
			`  sample (${sample.url}): type ${sample.rows[0].enneagram_type} — "${sample.rows[0].comment.slice(0, 100)}..."`
		);
	}
	if (!APPLY || !plan.length) return;

	const allRows = plan.flatMap((p) => p.rows);
	const batch = 500;
	for (let i = 0; i < allRows.length; i += batch) {
		const { error } = await supabase.from('comments_ai').insert(allRows.slice(i, i + batch));
		if (error) throw new Error(`insert batch at ${i}: ${error.message}`);
		console.log(`  inserted ${Math.min(i + batch, allRows.length)}/${allRows.length}`);
	}

	const manifestDir = path.join(process.cwd(), 'docs', 'data', 'backfills');
	fs.mkdirSync(manifestDir, { recursive: true });
	const manifestPath = path.join(
		manifestDir,
		`${new Date().toISOString().slice(0, 10)}-chorus-comments-ai.json`
	);
	fs.writeFileSync(
		manifestPath,
		JSON.stringify(
			{
				ranAt: new Date().toISOString(),
				source: 'nine_takes -> comments_ai (chorus-backed questions with zero AI takes)',
				revert:
					'DELETE FROM comments_ai WHERE question_id = ANY(question_ids) — these had zero rows before this run',
				questionCount: plan.length,
				rowCount: allRows.length,
				question_ids: plan.map((p) => p.question_id)
			},
			null,
			2
		)
	);
	console.log(`  manifest: ${manifestPath}`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
