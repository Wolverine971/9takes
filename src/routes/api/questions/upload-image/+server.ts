// src/routes/api/questions/upload-image/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { uploadQuestionImage } from '$lib/server/questionImages';
import { elasticClient } from '$lib/server/elasticSearch';
import { checkDemoTime } from '../../../../utils/api';
import { logger } from '$lib/utils/logger';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const uploadSchema = z.object({
	questionId: z.string().regex(/^\d+$/, 'Invalid question ID'),
	url: z.string().min(1).max(200),
	img_url: z.string().refine((val) => val.startsWith('data:image/'), {
		message: 'Invalid image format'
	})
});

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const session = locals.session;
		if (!session?.user?.id) {
			throw error(401, 'Unauthorized');
		}

		const formData = await request.formData();
		const body = Object.fromEntries(formData);
		const validated = uploadSchema.parse(body);
		const questionId = Number(validated.questionId);

		const supabase = locals.supabase;
		const demo_time = await checkDemoTime(supabase);
		if (demo_time) {
			return json({ success: true });
		}

		const questionTable = demo_time ? 'questions_demo' : 'questions';
		const profileTable = demo_time ? 'profiles_demo' : 'profiles';

		const { data: question, error: questionError } = await supabase
			.from(questionTable)
			.select('id, author_id, es_id')
			.eq('id', questionId)
			.single();

		if (questionError || !question) {
			throw error(404, 'Question not found');
		}

		if (question.author_id !== session.user.id) {
			const { data: profile } = await supabase
				.from(profileTable)
				.select('admin')
				.eq('id', session.user.id)
				.single();

			if (!profile?.admin) {
				throw error(403, 'Not authorized');
			}
		}

		const upload = await uploadQuestionImage({
			supabase,
			dataUrl: validated.img_url,
			questionUrl: validated.url,
			maxBytes: MAX_IMAGE_BYTES
		});

		const { data: updatedQuestion, error: updateError } = await supabase
			.from(questionTable)
			.update({ img_url: upload.path })
			.eq('id', questionId)
			.select('es_id')
			.single();

		if (updateError) {
			logger.error('Failed to update question image path', updateError, { questionId });
		}

		const esId = updatedQuestion?.es_id ?? question.es_id;
		if (esId) {
			try {
				await elasticClient.update({
					index: 'question',
					id: esId.toString(),
					doc: {
						imgUrl: upload.path,
						updatedDate: new Date()
					}
				});
			} catch (err) {
				logger.error('Failed to update ES image url', err as Error, { questionId, esId });
			}
		}

		return json({ success: true, path: upload.path });
	} catch (err) {
		if (err instanceof z.ZodError) {
			return json(
				{ success: false, error: err.errors[0]?.message || 'Invalid request' },
				{ status: 400 }
			);
		}
		if ((err as any)?.status) {
			throw err;
		}
		logger.error('Question image upload error', err as Error);
		throw error(500, 'Failed to upload question image');
	}
};
