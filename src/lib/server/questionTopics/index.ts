// src/lib/server/questionTopics/index.ts
//
// Server wiring for question topics: ask Jev, then file the question through the
// apply_question_topics database function (the one writer for topic membership).
// The scoring rules live in ./classify.js, shared with scripts/classify-questions.mjs.
import { PRIVATE_OPENROUTER_API_KEY } from '$env/static/private';
import taxonomyFile from '$lib/data/questionTaxonomy.json';
import { logger } from '$lib/utils/logger';
import {
	TOPIC_MODEL,
	buildTaxonomy,
	classifyQuestion,
	questionInputHash,
	taxonomyHash
} from './classify.js';

const JEV_ENDPOINT = 'https://openrouter.ai/api/alpha/decisions';
const JEV_TIMEOUT_MS = 25_000;
const JEV_ATTEMPTS = 3;

export const questionTaxonomy = buildTaxonomy(taxonomyFile.topics);
export const QUESTION_TAXONOMY_HASH = taxonomyHash(taxonomyFile.topics);

export type QuestionTopicSource = 'jev' | 'owner' | 'admin';
export type QuestionTopicMatch = {
	key: string;
	path: string;
	fit: number;
	band: 'strong' | 'secondary';
};
export type DecisionClient = {
	decide: (
		state: string,
		questions: Record<string, unknown>
	) => Promise<{ answers?: Record<string, any> }>;
};
export type FileQuestionResult = {
	status: 'applied' | 'abstained' | 'kept_manual';
	topics: QuestionTopicMatch[];
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Jev through OpenRouter's Decisions API. No disk cache: serverless, one call per question. */
export function createJevDecisionClient(
	apiKey: string = PRIVATE_OPENROUTER_API_KEY,
	fetchImpl: typeof fetch = fetch
): DecisionClient {
	return {
		async decide(state, questions) {
			let lastError: unknown;
			for (let attempt = 0; attempt < JEV_ATTEMPTS; attempt++) {
				if (attempt) await sleep(600 * 2 ** (attempt - 1));
				try {
					const response = await fetchImpl(JEV_ENDPOINT, {
						method: 'POST',
						headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
						body: JSON.stringify({ model: TOPIC_MODEL, state, questions }),
						signal: AbortSignal.timeout(JEV_TIMEOUT_MS)
					});
					if (response.ok) return await response.json();
					const detail = (await response.text()).slice(0, 300);
					lastError = new Error(`Jev ${response.status}: ${detail}`);
					if (response.status !== 429 && response.status < 500) break;
				} catch (error) {
					lastError = error;
				}
			}
			throw lastError instanceof Error ? lastError : new Error('Jev request failed');
		}
	};
}

export async function classifyQuestionTopics(
	text: string,
	client: DecisionClient = createJevDecisionClient()
) {
	return classifyQuestion(text, questionTaxonomy, client);
}

/**
 * Ask Jev where a question belongs and file it there. Topics an owner or admin
 * picked stay; Jev's answer is stored beside them. Never changes `flagged`,
 * `tagged` or `removed`: a question Jev cannot place stays visible and shows up
 * as "abstained" for a person to look at.
 */
export async function fileQuestionUnderTopics(
	supabase: any,
	questionId: number,
	text: string,
	client?: DecisionClient
): Promise<FileQuestionResult> {
	const result = await classifyQuestionTopics(text, client);
	const { data, error } = await supabase.rpc('apply_question_topics', {
		p_question_id: questionId,
		p_topics: result.topics.map(({ key, fit }) => ({ key, fit: Math.round(fit) })),
		p_source: 'jev',
		p_classification: {
			input_hash: questionInputHash(text),
			taxonomy_hash: QUESTION_TAXONOMY_HASH,
			model: TOPIC_MODEL,
			candidates: result.candidates,
			scores: result.scores
		}
	});
	if (error) throw new Error(`Failed to save question topics: ${error.message}`);
	return {
		status: data?.kept_manual ? 'kept_manual' : result.topics.length ? 'applied' : 'abstained',
		topics: result.topics as QuestionTopicMatch[]
	};
}

/**
 * A person's topic choice (owner editor, admin tools). Returns false without
 * writing when the choice matches what is already filed, so an untouched form
 * save does not turn Jev's topics into hand-picked ones.
 */
export async function setQuestionTopics(
	supabase: any,
	questionId: number,
	categoryIds: number[],
	source: Exclude<QuestionTopicSource, 'jev'>
): Promise<boolean> {
	const wanted = Array.from(new Set(categoryIds)).sort((a, b) => a - b);
	const { data: current, error: currentError } = await supabase
		.from('question_category_tags')
		.select('tag_id')
		.eq('question_id', questionId);
	if (currentError) throw new Error(`Failed to read question topics: ${currentError.message}`);
	const existing = ((current ?? []) as Array<{ tag_id: number }>)
		.map((row) => row.tag_id)
		.sort((a, b) => a - b);
	if (existing.length === wanted.length && existing.every((id, index) => id === wanted[index])) {
		return false;
	}

	const { error } = await supabase.rpc('apply_question_topics', {
		p_question_id: questionId,
		p_topics: wanted.map((id) => ({ id })),
		p_source: source
	});
	if (error) throw new Error(`Failed to save question topics: ${error.message}`);
	return true;
}

type PendingQuestion = { id: number; text: string };

/** Questions whose topics are missing, or stale because the wording or the directory changed. */
export async function listQuestionsNeedingTopics(
	supabase: any,
	limit: number
): Promise<PendingQuestion[]> {
	const [questions, stored] = await Promise.all([
		readAll(() =>
			supabase
				.from('questions')
				.select('id, question, question_formatted, flagged')
				.eq('removed', false)
				.order('id', { ascending: false })
		),
		readAll(() =>
			supabase
				.from('question_classifications')
				.select('question_id, input_hash, taxonomy_hash')
				.order('question_id', { ascending: false })
		)
	]);
	const storedById = new Map(stored.map((row: any) => [row.question_id, row]));
	const pending: Array<PendingQuestion & { hidden: boolean }> = [];
	for (const row of questions as any[]) {
		const text = String(row.question || row.question_formatted || '').trim();
		if (!text) continue;
		const saved = storedById.get(row.id) as any;
		if (
			saved?.taxonomy_hash === QUESTION_TAXONOMY_HASH &&
			saved.input_hash === questionInputHash(text)
		) {
			continue;
		}
		pending.push({ id: row.id, text, hidden: row.flagged === true });
	}
	// Questions readers can see first, newest first.
	return pending
		.sort((a, b) => Number(a.hidden) - Number(b.hidden) || b.id - a.id)
		.slice(0, limit)
		.map(({ id, text }) => ({ id, text }));
}

export async function fileQuestionsNeedingTopics(
	supabase: any,
	limit: number,
	client: DecisionClient = createJevDecisionClient()
) {
	const pending = await listQuestionsNeedingTopics(supabase, limit);
	const filed: Array<{ id: number; status: FileQuestionResult['status']; topics: string[] }> = [];
	const errors: Array<{ id: number; error: string }> = [];
	for (const question of pending) {
		try {
			const result = await fileQuestionUnderTopics(supabase, question.id, question.text, client);
			filed.push({
				id: question.id,
				status: result.status,
				topics: result.topics.map((topic) => topic.key)
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			logger.warn('Failed to file question under topics', { questionId: question.id, message });
			errors.push({ id: question.id, error: message });
		}
	}
	return { candidates: pending.length, filed, errors };
}

async function readAll(build: () => any): Promise<any[]> {
	const rows: any[] = [];
	for (;;) {
		const { data, error } = await build().range(rows.length, rows.length + 999);
		if (error) throw new Error(error.message);
		rows.push(...(data ?? []));
		if (!data || data.length < 1000) return rows;
	}
}
