// src/routes/api/update-questions/+server.ts
import { error, json } from '@sveltejs/kit';
import { PRIVATE_WEBHOOK_AUTH } from '$env/static/private';
import { logger, withApiLogging } from '$lib/utils/logger';
import { z } from 'zod';

import {
	getQuestionAiTaggingState,
	tagQuestion,
	tagQuestions,
	updateQuestionAiTaggingState
} from '../../../utils/server/openai';
import { checkDemoTime } from '../../../utils/api';

// Validation schemas
const updateQuestionSchema = z.object({
	questionId: z
		.string()
		.transform((val) => parseInt(val, 10))
		.refine((val) => !isNaN(val), {
			message: 'Invalid question ID'
		}),
	questionText: z.string().min(1).max(1000)
});

const getQuestionStatusSchema = z.object({
	questionId: z
		.string()
		.transform((val) => parseInt(val, 10))
		.refine((val) => !isNaN(val), {
			message: 'Invalid question ID'
		}),
	jobId: z.string().min(1).optional()
});

async function requireAdmin(locals: App.Locals) {
	const session = locals.session;

	if (!session?.user?.id) {
		logger.warn('Unauthorized question update attempt');
		throw error(401, 'Unauthorized');
	}

	const supabase = locals.supabase;
	const demo_time = await checkDemoTime(supabase);

	const { data: user } = await supabase
		.from(demo_time === true ? 'profiles_demo' : 'profiles')
		.select('id, admin, external_id')
		.eq('id', session.user.id)
		.single();

	if (!user?.admin) {
		logger.warn('Non-admin attempted to update question', {
			userId: session.user.id
		});
		throw error(403, 'Forbidden');
	}

	return {
		session,
		supabase,
		demo_time,
		user
	};
}

/** @type {import('./$types').RequestHandler} */
export const GET = withApiLogging(async (event) => {
	try {
		const questionIdParam = event.url.searchParams.get('questionId');

		if (questionIdParam) {
			const { supabase, demo_time } = await requireAdmin(event.locals);
			const { questionId, jobId } = getQuestionStatusSchema.parse({
				questionId: questionIdParam,
				jobId: event.url.searchParams.get('jobId') ?? undefined
			});
			const questionTable = demo_time === true ? 'questions_demo' : 'questions';
			const db = supabase as any;
			const statusSelect =
				demo_time === true
					? 'id, question_formatted, updated_at, data, question_tag(*)'
					: 'id, tagged, flagged, question_formatted, updated_at, data, question_tag(*)';

			const { data: question, error: questionError } = await db
				.from(questionTable)
				.select(statusSelect)
				.eq('id', questionId)
				.maybeSingle();

			if (questionError || !question) {
				logger.warn('Question status lookup failed', {
					questionId,
					questionError
				});
				throw error(404, 'Question not found');
			}

			const { data: keywordRow, error: keywordError } = await supabase
				.from('question_keywords')
				.select('keywords')
				.eq('question_id', questionId)
				.order('created_at', { ascending: false })
				.limit(1)
				.maybeSingle();

			if (keywordError) {
				logger.warn('Failed to load question keywords during AI tagging status check', {
					questionId,
					keywordError
				});
			}

			const aiTaggingState = getQuestionAiTaggingState(question.data);
			const currentJobId = aiTaggingState?.jobId ?? null;
			const status =
				jobId && currentJobId && currentJobId !== jobId
					? 'superseded'
					: (aiTaggingState?.status ?? 'idle');

			return json({
				success: true,
				status,
				jobId: currentJobId,
				question: {
					id: question.id,
					tagged:
						typeof question.tagged === 'boolean'
							? question.tagged
							: Array.isArray(question.question_tag) && question.question_tag.length > 0,
					flagged: Boolean(question.flagged),
					question_formatted: question.question_formatted,
					updated_at: question.updated_at,
					data: question.data,
					question_tag: Array.isArray(question.question_tag) ? question.question_tag : [],
					keywords:
						keywordRow?.keywords
							?.split(',')
							.map((keyword) => keyword.trim())
							.filter(Boolean) ?? []
				}
			});
		}

		const { headers } = event.request;
		const auth = headers.get('auth') ?? '';

		if (auth !== PRIVATE_WEBHOOK_AUTH) {
			logger.warn('Unauthorized webhook access attempt');
			throw error(401, 'Unauthorized');
		}

		const supabase = event.locals.supabase;

		logger.info('Starting bulk question tagging');
		await tagQuestions(supabase);
		logger.info('Bulk question tagging completed');
		return json({ success: true, message: 'Questions tagged successfully' });
	} catch (e) {
		if ((e as any).status) {
			throw e; // Re-throw HTTP errors
		}
		logger.error('Error in GET /api/update-questions', e as Error);
		throw error(500, 'Internal server error');
	}
});

export const POST = withApiLogging(async (event) => {
	try {
		const { supabase, demo_time, user } = await requireAdmin(event.locals);

		const formData = await event.request.formData();
		const body = Object.fromEntries(formData);

		// Validate request body
		const validatedData = updateQuestionSchema.parse(body);
		const { questionId, questionText } = validatedData;

		logger.info('Tagging question', {
			questionId,
			adminId: user.external_id
		});

		const questionTable = demo_time === true ? 'questions_demo' : 'questions';
		const jobId = crypto.randomUUID();
		const startedAt = new Date().toISOString();

		await updateQuestionAiTaggingState(supabase, questionTable, questionId, {
			jobId,
			status: 'processing',
			startedAt
		});

		const runTagging = tagQuestion(supabase, questionText, questionId, {
			jobId,
			startedAt
		});
		const waitUntil =
			(event as any)?.platform?.context?.waitUntil ?? (event as any)?.platform?.waitUntil;

		if (typeof waitUntil === 'function') {
			waitUntil(runTagging);
		} else {
			void runTagging;
		}

		logger.info('Question tagging queued successfully', { questionId, jobId });
		return json({ success: true, status: 'processing', jobId });
	} catch (e) {
		if (e instanceof z.ZodError) {
			logger.warn('Invalid question update data', {
				errors: e.errors
			});
			throw error(400, 'Invalid question data');
		}
		if ((e as any).status) {
			throw e; // Re-throw HTTP errors
		}
		logger.error('Error in POST /api/update-questions', e as Error);
		throw error(500, 'Internal server error');
	}
});
