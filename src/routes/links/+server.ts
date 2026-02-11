// src/routes/links/+server.ts
import { error, json } from '@sveltejs/kit';
import { logger, withApiLogging } from '$lib/utils/logger';
import { z } from 'zod';

const getLinksSchema = z.object({
	parentId: z.string().transform(Number),
	type: z.enum(['question', 'comment']).default('question'),
	range: z.string().transform(Number).default('0')
});

export const GET = withApiLogging(async ({ url, locals, cookies }) => {
	try {
		const supabase = locals.supabase;
		const user = locals?.session?.user;

		const params = {
			parentId: url.searchParams.get('parentId') ?? '0',
			type: url.searchParams.get('type') ?? 'question',
			range: url.searchParams.get('range') ?? '0'
		};

		const validatedParams = getLinksSchema.parse(params);
		const parentId = validatedParams.parentId;
		const parentType = validatedParams.type;
		const range = validatedParams.range;

		if (parentType !== 'question') {
			return json([]);
		}

		const cookie = cookies.get('9tfingerprint');
		const { data: userHasAnswered, error: canSeeLinksError } = await supabase.rpc(
			'can_see_comments_3',
			{
				userfingerprint: cookie,
				questionid: parentId,
				userid: user?.id || null
			}
		);

		if (!userHasAnswered) {
			if (canSeeLinksError) {
				logger.error('Error checking link permissions', canSeeLinksError, {
					parentId,
					parentType
				});
			}
			return json([]);
		}

		const { data: links, error: linksError } = await supabase
			.from('links')
			.select('*')
			.eq('question_id', parentId)
			.order('created_at', { ascending: false })
			.range(range, range + 10);

		if (linksError) {
			logger.error('Failed to retrieve links', linksError, {
				parentId,
				parentType,
				range
			});
			throw new Error('Unable to retrieve links');
		}

		return json(links ?? []);
	} catch (e) {
		if (e instanceof z.ZodError) {
			logger.warn('Invalid request parameters', {
				errors: e.errors
			});
			throw error(400, 'Invalid request parameters');
		}
		logger.error('Error in GET /links', e as Error);
		throw error(500, 'Internal server error');
	}
});
