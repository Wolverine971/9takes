// scripts/regen-nine-takes.ts
//
// Regenerates the AI-seeded nine takes (comments_ai) for existing questions
// using the per-type worldview pipeline in src/lib/server/nineTakesGenerator:
// one director call plans engagement/persona/angle per type, then nine
// separate per-type calls write the takes. Replaces the uniform 2023-era
// single-call takes (duplicate types, missing types, identical length).
//
// A question's rows are only replaced when all nine takes generate and pass
// validation; partial results leave the existing rows untouched.
//
// Usage (via pnpm alias or node --import tsx):
//   pnpm regen:takes -- --slug=<question-url>
//   pnpm regen:takes -- --id=123
//   pnpm regen:takes -- --all --limit=25
//   pnpm regen:takes -- --slug=<url> --dry        # print, write nothing
//   TAKES_MODEL=anthropic/claude-sonnet-4 pnpm regen:takes -- --id=123

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { generateNineTakes, type TakesJsonCaller } from '../src/lib/server/nineTakesGenerator';

dotenv.config({ path: '.env.local' });
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const OPENROUTER_KEY = process.env.PRIVATE_OPENROUTER_API_KEY;
const MODEL = process.env.TAKES_MODEL || 'google/gemini-2.5-flash';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) throw new Error('Supabase env not set');
if (!OPENROUTER_KEY) throw new Error('PRIVATE_OPENROUTER_API_KEY not set');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
	auth: { autoRefreshToken: false, persistSession: false }
});

const args = process.argv.slice(2);
const SLUG = args.find((a) => a.startsWith('--slug='))?.split('=')[1];
const ID = Number(args.find((a) => a.startsWith('--id='))?.split('=')[1]) || null;
const ALL = args.includes('--all');
const DRY = args.includes('--dry');
const LIMIT = Number(args.find((a) => a.startsWith('--limit='))?.split('=')[1]) || 25;
const CONCURRENCY = Number(args.find((a) => a.startsWith('--concurrency='))?.split('=')[1]) || 2;

function parseJson(content: string): unknown {
	let text = (content || '').trim();
	text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
	const start = text.indexOf('{');
	const end = text.lastIndexOf('}');
	if (start >= 0 && end > start) text = text.slice(start, end + 1);
	return JSON.parse(text);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const callJson: TakesJsonCaller = async ({ systemPrompt, userPrompt, temperature }) => {
	const delays = [0, 2000, 6000];
	let lastErr: Error | null = null;
	for (const delay of delays) {
		if (delay) await sleep(delay);
		try {
			const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${OPENROUTER_KEY}`,
					'Content-Type': 'application/json',
					'HTTP-Referer': 'https://9takes.com',
					'X-Title': '9takes Nine Takes Regen'
				},
				body: JSON.stringify({
					model: MODEL,
					temperature,
					max_tokens: 2000,
					response_format: { type: 'json_object' },
					messages: [
						{ role: 'system', content: systemPrompt },
						{ role: 'user', content: userPrompt }
					]
				}),
				signal: AbortSignal.timeout(120000)
			});

			if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${(await res.text()).slice(0, 200)}`);
			const data = (await res.json()) as any;
			const content = data?.choices?.[0]?.message?.content ?? '';
			if (!content.trim()) {
				throw new Error(
					`empty completion (finish_reason: ${data?.choices?.[0]?.finish_reason ?? 'unknown'})`
				);
			}
			return parseJson(content);
		} catch (e) {
			lastErr = e as Error;
		}
	}
	throw lastErr ?? new Error('OpenRouter call failed');
};

type QuestionRow = {
	id: number;
	url: string | null;
	question: string | null;
	question_formatted: string | null;
};

async function loadQuestions(): Promise<QuestionRow[]> {
	let query = supabase
		.from('questions')
		.select('id, url, question, question_formatted')
		.eq('removed', false)
		.eq('flagged', false)
		.order('id', { ascending: true });

	if (SLUG) query = query.eq('url', SLUG);
	else if (ID) query = query.eq('id', ID);
	else if (ALL) query = query.limit(LIMIT);
	else {
		console.error('Pass --slug=<url>, --id=<n>, or --all [--limit=N]. Nothing targeted, exiting.');
		process.exit(1);
	}

	const { data, error } = await query;
	if (error) throw error;
	return (data ?? []).filter((q) => (q.question_formatted || q.question || '').trim());
}

async function processQuestion(q: QuestionRow): Promise<boolean> {
	const questionText = (q.question_formatted || q.question || '').trim();
	const label = q.url || `id ${q.id}`;

	const result = await generateNineTakes(questionText, callJson, String(q.id));

	if (result.failedTypes.length) {
		const reasons = result.failedTypes
			.map((t) => `type ${t}: ${result.failureReasons[t] ?? 'unknown'}`)
			.join(' | ');
		console.error(`  ✗ ${label}: ${reasons}; existing rows left untouched`);
		return false;
	}

	if (DRY) {
		console.log(`\n── ${label}\n   Q: ${questionText}`);
		for (const plan of result.plans) {
			console.log(
				`\n   Type ${plan.type} [${plan.engagement}] (${plan.persona})\n   ${result.answers[String(plan.type)]}`
			);
		}
		return true;
	}

	const { error: deleteError } = await supabase
		.from('comments_ai')
		.delete()
		.eq('question_id', q.id);
	if (deleteError) throw new Error(`delete comments_ai for ${label}: ${deleteError.message}`);

	const rows = Object.entries(result.answers).map(([type, comment]) => ({
		enneagram_type: type,
		comment,
		question_id: q.id
	}));
	const { error: insertError } = await supabase.from('comments_ai').insert(rows);
	if (insertError) throw new Error(`insert comments_ai for ${label}: ${insertError.message}`);

	console.log(`  ✓ ${label} (9 takes replaced)`);
	return true;
}

async function main() {
	const questions = await loadQuestions();
	console.log(
		`Nine takes regen — ${questions.length} question(s) with ${MODEL}${DRY ? ' [dry run]' : ''}`
	);
	if (!questions.length) return;

	let ok = 0;
	let failed = 0;
	for (let i = 0; i < questions.length; i += CONCURRENCY) {
		const batch = questions.slice(i, i + CONCURRENCY);
		const results = await Promise.allSettled(batch.map(processQuestion));
		for (const [j, r] of results.entries()) {
			if (r.status === 'fulfilled' && r.value) ok++;
			else {
				failed++;
				if (r.status === 'rejected')
					console.error(`  ✗ ${batch[j].url || batch[j].id}: ${(r.reason as Error).message}`);
			}
		}
	}

	console.log(`\nDone. ${ok} succeeded, ${failed} failed.`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
