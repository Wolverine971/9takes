// src/utils/server/openai.ts
import { logger } from '$lib/utils/logger';
import { fileQuestionUnderTopics, setQuestionTopics } from '$lib/server/questionTopics';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Json } from '../../../database.types';

import { checkDemoTime } from '../api';
import { SmartLLMService } from './smart-llm-service';
import { generateNineTakes, type TakesJsonCaller } from '$lib/server/nineTakesGenerator';
import { resolveFormattedQuestion } from '$lib/server/questionFormatting';

const llmService = new SmartLLMService({
	httpReferer: 'https://9takes.com',
	appName: '9takes LLM'
});

// Adapter for the per-type take generator: 'powerful' profile because the
// takes are user-facing product copy, not metadata.
const nineTakesCaller: TakesJsonCaller = ({
	systemPrompt,
	userPrompt,
	temperature,
	operationType,
	taskId
}) =>
	llmService.getJSONResponse({
		systemPrompt,
		userPrompt,
		profile: 'powerful',
		temperature,
		operationType,
		taskId,
		validation: { retryOnParseError: true, maxRetries: 2 }
	});

type TaggedQuestion = {
	id?: number | string;
	question?: string;
	question_formatted?: string;
	answers?: Record<string, string>;
	seo_keywords?: string[];
};

type QuestionTable = 'questions' | 'questions_demo';
type QuestionAiTaggingStatus = 'processing' | 'completed' | 'failed';
type QuestionAiTaggingState = {
	jobId: string;
	status: QuestionAiTaggingStatus;
	startedAt?: string;
	finishedAt?: string;
	tagCount?: number;
	flagged?: boolean;
	error?: string;
};
type TagQuestionOptions = {
	jobId?: string;
	startedAt?: string;
};

export const MAX_AI_TAGS_PER_QUESTION = 5;

const QUESTION_AI_TAGGING_DATA_KEY = 'aiTagging';

const isRecord = (value: unknown): value is Record<string, unknown> =>
	Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const normalizeJsonObject = (value: Json | null | undefined): Record<string, Json> => {
	if (!isRecord(value)) {
		return {};
	}

	return { ...(value as Record<string, Json>) };
};

const limitUniqueStrings = (values: string[], limit = MAX_AI_TAGS_PER_QUESTION): string[] =>
	Array.from(
		new Set(values.map((value) => value.trim()).filter((value) => value.length > 0))
	).slice(0, limit);

export const getQuestionAiTaggingState = (data: unknown): QuestionAiTaggingState | null => {
	if (!isRecord(data)) {
		return null;
	}

	const rawState = data[QUESTION_AI_TAGGING_DATA_KEY];
	if (!isRecord(rawState) || typeof rawState.jobId !== 'string') {
		return null;
	}

	const status = rawState.status;
	if (status !== 'processing' && status !== 'completed' && status !== 'failed') {
		return null;
	}

	return {
		jobId: rawState.jobId,
		status,
		startedAt: typeof rawState.startedAt === 'string' ? rawState.startedAt : undefined,
		finishedAt: typeof rawState.finishedAt === 'string' ? rawState.finishedAt : undefined,
		tagCount: typeof rawState.tagCount === 'number' ? rawState.tagCount : undefined,
		flagged: typeof rawState.flagged === 'boolean' ? rawState.flagged : undefined,
		error: typeof rawState.error === 'string' ? rawState.error : undefined
	};
};

export const updateQuestionAiTaggingState = async (
	supabase: SupabaseClient<Database>,
	questionTable: QuestionTable,
	questionId: number,
	nextState: QuestionAiTaggingState
) => {
	const { data: questionRow, error: questionError } = await supabase
		.from(questionTable)
		.select('data')
		.eq('id', questionId)
		.maybeSingle();

	if (questionError) {
		logger.warn('Failed to load current question metadata for AI tagging state update', {
			questionId,
			questionTable,
			questionError
		});
		return;
	}

	const nextData = {
		...normalizeJsonObject(questionRow?.data),
		[QUESTION_AI_TAGGING_DATA_KEY]: nextState as unknown as Json
	};

	const { error: updateError } = await supabase
		.from(questionTable)
		.update({ data: nextData })
		.eq('id', questionId);

	if (updateError) {
		logger.warn('Failed to persist AI tagging state', {
			questionId,
			questionTable,
			updateError
		});
	}
};

/**
 * An admin's hand-picked topics for a question. Live questions go through the
 * apply_question_topics database function (see $lib/server/questionTopics), which
 * keeps the legacy mapping tables and category intros in step. Demo mode only has
 * the legacy demo mapping table.
 */
export const replaceQuestionTags = async (
	supabase: SupabaseClient<Database>,
	questionId: number,
	tagIds: number[],
	demoTime: boolean
) => {
	const uniqueTagIds = Array.from(new Set(tagIds)).slice(0, MAX_AI_TAGS_PER_QUESTION);

	if (!demoTime) {
		await setQuestionTopics(supabase, questionId, uniqueTagIds, 'admin');
		return uniqueTagIds;
	}

	const { error: deleteDemoTagsError } = await supabase
		.from('question_tags_demo')
		.delete()
		.eq('question_id', questionId);
	if (deleteDemoTagsError) {
		throw deleteDemoTagsError;
	}

	if (uniqueTagIds.length) {
		const { error: insertDemoTagsError } = await supabase
			.from('question_tags_demo')
			.insert(uniqueTagIds.map((tagId) => ({ question_id: questionId, tag_id: tagId })));
		if (insertDemoTagsError) {
			throw insertDemoTagsError;
		}
	}

	return uniqueTagIds;
};

const replaceQuestionAiOutputs = async (
	supabase: SupabaseClient<Database>,
	questionId: number,
	answers: Record<string, string>,
	seoKeywords: string[] | undefined,
	demoTime: boolean
) => {
	const commentsTable = demoTime === true ? 'comments_ai_demo' : 'comments_ai';

	const { error: deleteCommentsError } = await supabase
		.from(commentsTable)
		.delete()
		.eq('question_id', questionId);
	if (deleteCommentsError) {
		throw deleteCommentsError;
	}

	const { error: deleteKeywordsError } = await supabase
		.from('question_keywords')
		.delete()
		.eq('question_id', questionId);
	if (deleteKeywordsError) {
		throw deleteKeywordsError;
	}

	const answerEntries = Object.entries(answers);
	if (answerEntries.length) {
		const { error: insertCommentsError } = await supabase.from(commentsTable).insert(
			answerEntries.map(([type, answerText]) => ({
				enneagram_type: type,
				comment: answerText,
				question_id: questionId
			}))
		);

		if (insertCommentsError) {
			throw insertCommentsError;
		}
	}

	const limitedKeywords = limitUniqueStrings(seoKeywords ?? [], 5);
	if (limitedKeywords.length) {
		const { error: insertKeywordsError } = await supabase
			.from('question_keywords')
			.insert({ keywords: limitedKeywords.join(', '), question_id: questionId });

		if (insertKeywordsError) {
			throw insertKeywordsError;
		}
	}
};

const normalizeTaggedResponse = (payload: unknown): TaggedQuestion[] => {
	if (Array.isArray(payload)) {
		return payload.flatMap((item) => normalizeTaggedResponse(item));
	}

	if (payload && typeof payload === 'object') {
		const data = payload as Record<string, unknown>;
		return [
			{
				id: data.id as TaggedQuestion['id'],
				question: typeof data.question === 'string' ? data.question : undefined,
				question_formatted:
					typeof data.question_formatted === 'string' ? data.question_formatted : undefined,
				answers: normalizeAnswers(data.answers) ?? undefined,
				seo_keywords: Array.isArray(data.seo_keywords)
					? data.seo_keywords.filter((tag): tag is string => typeof tag === 'string')
					: undefined
			}
		];
	}

	return [];
};

const normalizeAnswers = (answers: unknown): Record<string, string> | null => {
	if (!answers || typeof answers !== 'object') return null;
	const filtered = Object.entries(answers as Record<string, unknown>).filter(
		(entry): entry is [string, string] =>
			typeof entry[0] === 'string' && typeof entry[1] === 'string'
	);
	return filtered.length ? (Object.fromEntries(filtered) as Record<string, string>) : null;
};

export const tagQuestion = async (
	supabase: SupabaseClient<Database>,
	questionText: string,
	questionId: number,
	options: TagQuestionOptions = {}
) => {
	const demo_time = await checkDemoTime(supabase);
	const questionTable: QuestionTable = demo_time === true ? 'questions_demo' : 'questions';

	try {
		logger.info('Starting single question tagging request', {
			questionId,
			questionLength: questionText.length
		});

		// Three independent jobs: formatting + SEO keywords (one metadata call), the
		// nine takes (director + nine voice calls), and Jev filing the question under
		// topics. A takes or topics failure must never cost us the rest; unfiled
		// questions are retried by the classify-questions cron.
		const [metaSettled, takesSettled, topicsSettled] = await Promise.allSettled([
			llmService.getJSONResponse<TaggedQuestion[] | TaggedQuestion>({
				systemPrompt: questionMetadataPrompt,
				userPrompt: JSON.stringify({ id: questionId, question: questionText }),
				profile: 'balanced',
				temperature: 0.2,
				validation: { retryOnParseError: true, maxRetries: 2 },
				operationType: 'single_question_tagging',
				taskId: String(questionId)
			}),
			generateNineTakes(questionText, nineTakesCaller, String(questionId)),
			demo_time === true
				? Promise.resolve(null)
				: fileQuestionUnderTopics(supabase, questionId, questionText)
		]);

		if (metaSettled.status === 'rejected') {
			throw metaSettled.reason;
		}

		const [chatResp] = normalizeTaggedResponse(metaSettled.value);
		if (!chatResp) {
			throw new Error('LLM tagging returned no payload');
		}

		const takesResult = takesSettled.status === 'fulfilled' ? takesSettled.value : null;
		const answers = takesResult?.answers ?? {};
		const missingTakeTypes =
			takesSettled.status === 'rejected'
				? [1, 2, 3, 4, 5, 6, 7, 8, 9]
				: (takesResult?.failedTypes ?? []);

		if (takesSettled.status === 'rejected') {
			logger.error('Nine takes generation failed', takesSettled.reason as Error, { questionId });
		} else if (missingTakeTypes.length) {
			logger.warn('Nine takes generation incomplete', { questionId, missingTakeTypes });
		}

		if (topicsSettled.status === 'rejected') {
			logger.error('Filing question under topics failed', topicsSettled.reason as Error, {
				questionId
			});
		}
		const topicCount =
			topicsSettled.status === 'fulfilled' ? (topicsSettled.value?.topics.length ?? 0) : 0;
		// The model only proposes; the asker's words win if it rewrote them.
		const formatted = resolveFormattedQuestion(questionText, chatResp.question_formatted);
		if (formatted.source === 'tidied' && chatResp.question_formatted) {
			logger.warn("Rejected a formatted question that changed the asker's words", {
				questionId,
				typed: questionText,
				proposed: chatResp.question_formatted
			});
		}
		const formattedQuestion = formatted.text;

		await replaceQuestionAiOutputs(
			supabase,
			questionId,
			answers,
			chatResp.seo_keywords,
			demo_time === true
		);

		const { error: questionUpdateError } = await supabase
			.from(questionTable)
			.update({
				tagged: true,
				// Finishing post-processing is what makes a question visible. Topics no
				// longer decide this: a question Jev cannot place stays up and is listed
				// as "abstained" for review instead of being hidden.
				flagged: false,
				updated_at: new Date().toISOString(),
				question_formatted: formattedQuestion ?? null
			})
			.eq('id', questionId);

		if (questionUpdateError) {
			throw questionUpdateError;
		}

		if (options.jobId) {
			// A partial nine is surfaced as a failure so the admin retry
			// affordance can re-run it; topics and any successful takes are
			// already persisted either way.
			await updateQuestionAiTaggingState(supabase, questionTable, questionId, {
				jobId: options.jobId,
				status: missingTakeTypes.length ? 'failed' : 'completed',
				startedAt: options.startedAt,
				finishedAt: new Date().toISOString(),
				tagCount: topicCount,
				flagged: false,
				...(missingTakeTypes.length
					? { error: `Takes missing for type(s) ${missingTakeTypes.join(', ')}` }
					: {})
			});
		}

		return { success: true as const, missingTakeTypes };
	} catch (e) {
		const error = e as Error;
		const message = error?.message?.toLowerCase() || '';
		const isTimeout =
			error?.name === 'TimeoutError' ||
			error?.name === 'AbortError' ||
			message.includes('timeout') ||
			message.includes('timed out') ||
			message.includes('aborted due to timeout');

		logger.error('Tag question failed', error, {
			questionId,
			questionLength: questionText.length,
			isTimeout,
			errorName: error?.name,
			errorMessage: error?.message
		});

		if (options.jobId) {
			await updateQuestionAiTaggingState(supabase, questionTable, questionId, {
				jobId: options.jobId,
				status: 'failed',
				startedAt: options.startedAt,
				finishedAt: new Date().toISOString(),
				error: error?.message || 'Unknown AI tagging error'
			});
		}

		return {
			success: false as const,
			error: error?.message || 'Unknown AI tagging error'
		};
	}
};

// Metadata only. The nine takes are generated per type by
// $lib/server/nineTakesGenerator and topics are filed by Jev
// ($lib/server/questionTopics); see tagQuestion above.
const questionMetadataPrompt = `You are going to be given a question or a statement with an id. Your job is to do 2 tasks and return a formatted json response.
1st, punctuate the question for display and return it as question_formatted. Keep the asker's exact words in the same order. You may only add or fix punctuation, fix capitalization, and correct obvious misspellings. Never add, remove, reorder or replace words, never rephrase, and never fix grammar ("Whats your criteria" becomes "What's your criteria", not "What are your criteria"). Keep words the asker wrote in capitals for emphasis, and keep punctuation and quote marks that are already correct. If the question is already well punctuated, return it unchanged.
2nd, create between 3-5 SEO keywords or phrases that would be relevant to the question or statement.

 Format the Response in VALID JSON like the following example:
 [
	{
	  "id": 1,
	  "question": "I need date ideas What would you do",
	  "question_formatted": "I need date ideas, what would you do?",
	  "seo_keywords": ["date ideas", "romantic date ideas", "fun date ideas"]
	}
  ]
`;
