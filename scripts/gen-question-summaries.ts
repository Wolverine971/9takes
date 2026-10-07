// scripts/gen-question-summaries.ts
//
// Backfill / refresh "The gist so far" (T-43): the AI paraphrase of how people
// answered each live question, stored in question_answer_summaries. Same
// pipeline and guards as the hourly cron (/api/cron/question-summaries); see
// src/lib/server/questionAnswerSummary.ts.
//
// Usage (via pnpm alias or node --import tsx):
//   pnpm gen:question-summaries -- --dry                 # print, write nothing
//   pnpm gen:question-summaries -- --dry --id=567,118    # specific questions
//   pnpm gen:question-summaries -- --dry --limit=3
//   pnpm gen:question-summaries                          # write changed ones
//   pnpm gen:question-summaries -- --force               # regenerate all
//
// --dry never writes and tolerates the table not existing yet. Summaries are
// printed to stdout only: the repo is public and take-derived text must not be
// committed. A real run needs the 20261007120000 migration applied.
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import {
	createOpenRouterSummaryLlm,
	refreshQuestionSummaries,
	type SummaryLlm
} from '../src/lib/server/questionAnswerSummary';

dotenv.config({ path: '.env.local' });
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const OPENROUTER_KEY = process.env.PRIVATE_OPENROUTER_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) throw new Error('Supabase env not set');
if (!OPENROUTER_KEY) throw new Error('PRIVATE_OPENROUTER_API_KEY not set');

const args = process.argv.slice(2);
const flag = (name: string) => args.find((arg) => arg.startsWith(`--${name}=`))?.split('=')[1];
const DRY = args.includes('--dry');
const FORCE = args.includes('--force');
const IDS = (flag('id') ?? '')
	.split(',')
	.map((value) => Number.parseInt(value, 10))
	.filter((value) => Number.isInteger(value) && value > 0);
const LIMIT = Number(flag('limit')) || 1000;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
	auth: { autoRefreshToken: false, persistSession: false }
});

const usage = { calls: 0, promptTokens: 0, completionTokens: 0, cost: 0, costKnown: true };
const baseLlm = createOpenRouterSummaryLlm({
	apiKey: OPENROUTER_KEY,
	title: '9takes Answer Summaries Backfill'
});
const llm: SummaryLlm = async (request) => {
	const response = await baseLlm(request);
	usage.calls += 1;
	usage.promptTokens += response.usage?.promptTokens ?? 0;
	usage.completionTokens += response.usage?.completionTokens ?? 0;
	if (response.usage?.cost === null || response.usage?.cost === undefined) usage.costKnown = false;
	else usage.cost += response.usage.cost;
	return response;
};

async function main() {
	console.log(
		`Question summaries: ${DRY ? 'DRY RUN (no writes)' : 'WRITE'}${FORCE ? ', force' : ''}${
			IDS.length ? `, ids ${IDS.join(',')}` : ''
		}, limit ${LIMIT}\n`
	);

	const report = await refreshQuestionSummaries({
		db: supabase,
		llm,
		limit: LIMIT,
		questionIds: IDS.length ? IDS : null,
		force: FORCE,
		dryRun: DRY,
		log: (message, details) => console.warn(`! ${message}`, details ?? ''),
		onGenerated: (result) => {
			const words = result.summary.split(/\s+/).filter(Boolean).length;
			console.log(
				`#${result.question.id} /questions/${result.question.url ?? ''}\n` +
					`  ${result.question.text}\n` +
					`  ${result.sourceCommentCount} takes | ${words} words | ${result.model ?? 'model?'} | ${result.attempts} attempt(s)` +
					(result.rejected.length ? ` | rejected first: ${result.rejected.join('; ')}` : '') +
					'\n'
			);
			if (DRY) console.log(`${result.summary}\n\n${'-'.repeat(72)}\n`);
		}
	});

	console.log(
		JSON.stringify(
			{
				dryRun: report.dryRun,
				liveQuestions: report.liveQuestions,
				needingWork: report.needingWork,
				generated: report.generated.length,
				failed: report.failed,
				deleted: report.deleted,
				deferred: report.deferred,
				usage: {
					calls: usage.calls,
					promptTokens: usage.promptTokens,
					completionTokens: usage.completionTokens,
					costUsd: usage.costKnown ? Number(usage.cost.toFixed(4)) : null
				}
			},
			null,
			2
		)
	);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
