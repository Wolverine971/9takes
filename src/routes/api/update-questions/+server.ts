// routes/api/update-questions/+server.ts
import { error, json } from '@sveltejs/kit';
import { PRIVATE_WEBHOOK_AUTH } from '$env/static/private';
import { logger, withApiLogging } from '$lib/utils/logger';
import { z } from 'zod';

import { tagQuestion, tagQuestions } from '../../../utils/openai';
import { supabase } from '$lib/supabase';
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

/** @type {import('./$types').RequestHandler} */
export const GET = withApiLogging(async ({ request }) => {
	try {
		const { headers } = request;
		const auth = headers.get('auth') ?? '';

		if (auth !== PRIVATE_WEBHOOK_AUTH) {
			logger.warn('Unauthorized webhook access attempt');
			throw error(401, 'Unauthorized');
		}

		logger.info('Starting bulk question tagging');
		await tagQuestions();
		logger.info('Bulk question tagging completed');
		return json({ success: true, message: 'Questions tagged successfully' });
	} catch (e) {
		if ((e as any).status) {
			throw e; // Re-throw HTTP errors
		}
		logger.error('Error in GET /api/update-questions', e as Error);
		throw error(500, {
			message: 'Internal server error'
		});
	}
});

export const POST = withApiLogging(async ({ request, locals }) => {
	try {
		const session = locals.session;

		if (!session?.user?.id) {
			logger.warn('Unauthorized question update attempt');
			throw error(401, 'Unauthorized');
		}

		const demo_time = await checkDemoTime();

		const { data: user } = await supabase
			.from(demo_time === true ? 'profiles_demo' : 'profiles')
			.select('id, admin, external_id')
			.eq('id', session?.user?.id)
			.single();

		if (!user?.admin) {
			logger.warn('Non-admin attempted to update question', {
				userId: session.user.id
			});
			throw error(403, 'Forbidden');
		}

		const formData = await request.formData();
		const body = Object.fromEntries(formData);

		// Validate request body
		const validatedData = updateQuestionSchema.parse(body);
		const { questionId, questionText } = validatedData;

		logger.info('Tagging question', {
			questionId,
			adminId: user.external_id
		});

		await tagQuestion(questionText, questionId);

		logger.info('Question tagged successfully', { questionId });
		return json({ success: true });
	} catch (e) {
		if (e instanceof z.ZodError) {
			logger.warn('Invalid question update data', {
				errors: e.errors
			});
			throw error(400, {
				message: 'Invalid question data',
				details: e.errors
			});
		}
		if ((e as any).status) {
			throw e; // Re-throw HTTP errors
		}
		logger.error('Error in POST /api/update-questions', e as Error);
		throw error(500, {
			message: 'Internal server error'
		});
	}
});
