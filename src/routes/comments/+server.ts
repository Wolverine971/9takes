// src/routes/comments/+server.ts
import { error, json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import { logger, withApiLogging } from '$lib/utils/logger';
import { z } from 'zod';

import { checkDemoTime } from '../../utils/api';

// Validation schemas
const getCommentsSchema = z.object({
	parentId: z.string().transform(Number),
	type: z.enum(['question', 'comment']).default('question'),
	range: z.string().transform(Number).default('0')
});

const postCommentSchema = z.object({
	comment: z.string().min(1).max(5000),
	comment_id: z.string().uuid()
});

/** @type {import('./$types').RequestHandler} */
export const GET = withApiLogging(async ({ url, locals, cookies }) => {
	try {
		// Validate query parameters
		const params = {
			parentId: url.searchParams.get('parentId') ?? '0',
			type: url.searchParams.get('type') ?? 'question',
			range: url.searchParams.get('range') ?? '0'
		};

		const validatedParams = getCommentsSchema.parse(params);
		const demo_time = await checkDemoTime();
		const cookie = cookies.get('9tfingerprint');

		const parentId = validatedParams.parentId;
		const parentType = validatedParams.type;
		const range = validatedParams.range;

		const user = locals?.session?.user;

		if (parentType === 'question') {
			// only works for questions
			const { data: userHasAnswered, error: canSeeCommentsError } = await supabase.rpc(
				'can_see_comments_3',
				{
					userfingerprint: cookie,
					questionid: parentId,
					userid: user?.id || null
				}
			);

			if (!userHasAnswered) {
				if (canSeeCommentsError) {
					logger.error('Error checking comment permissions', canSeeCommentsError);
				}
				return json({});
			}
		}

		const { data: questionComments, error: questionCommentsError } = await supabase
			.from(demo_time === true ? 'comments_demo' : 'comments')
			.select(
				`
					*
					, ${demo_time === true ? 'profiles_demo' : 'profiles'} ( external_id, enneagram)
				`,
				{ count: 'exact' }
			)
			.eq('parent_id', parentId)
			.eq('parent_type', parentType)
			.eq('removed', false)
			.order('created_at', { ascending: false })
			.range(range, range + 10);

		if (questionCommentsError) {
			logger.error('Failed to retrieve comments', questionCommentsError, {
				parentId,
				parentType,
				range
			});
			throw new Error('Unable to retrieve comments');
		}

		if (!questionComments?.length) {
			return json([]);
		}

		if (parentType !== 'question') {
			const questionCommentIds = questionComments?.map((q) => {
				return q.id;
			});
			if (questionCommentsError) {
				throw new Error('Unable to retrieve comments');
			}
			if (questionCommentIds) {
				const { data: commentComments, error: commentError } = await supabase
					.from(demo_time === true ? 'comments_demo' : 'comments')
					.select(
						`
							*
							, ${demo_time === true ? 'profiles_demo' : 'profiles'} ( external_id, enneagram)
						`,
						{ count: 'exact' }
					)
					.in('parent_id', questionCommentIds)
					.eq('parent_type', parentType)
					.order('created_at', { ascending: false });
				// .range(range, range + 10)

				interface ICommentMap {
					[key: string]: string[];
				}

				if (commentError) {
					throw error(400, {
						message: `encountered error`
					});
				}

				const commentMap: ICommentMap = {};
				commentComments?.forEach((c: any) => {
					if (c.profiles_demo) {
						c.profiles = c.profiles_demo;
					}
					if (commentMap[c?.parent_id]) {
						commentMap[c?.parent_id] = [...commentMap[c?.parent_id], c];
					} else {
						commentMap[c?.parent_id] = [c];
					}
				});
				questionComments?.forEach((q: any) => {
					if (q.profiles_demo) {
						q.profiles = q.profiles_demo;
					}
					if (commentMap[q.id]) {
						// q.profiles = q.profiles_demo;
						if (q.profiles_demo) {
							commentMap[q.id].profiles = commentMap[q.id].profiles_demo;
						}

						q.comments = commentMap[q.id];
					}
				});
			}
		}
		if (!questionCommentsError && questionComments?.length) {
			return json(questionComments);
		} else {
			throw error(400, {
				message: `Failed to get question: ${JSON.stringify(questionCommentsError)}`
			});
		}
	} catch (e) {
		if (e instanceof z.ZodError) {
			logger.warn('Invalid request parameters', {
				errors: e.errors
			});
			throw error(400, {
				message: 'Invalid request parameters',
				details: e.errors
			});
		}
		logger.error('Error in GET /comments', e as Error);
		throw error(500, {
			message: 'Internal server error'
		});
	}
});

export const POST = withApiLogging(async ({ locals, request }) => {
	try {
		const session = locals.session;

		if (!session?.user?.id) {
			logger.warn('Unauthorized comment attempt');
			throw error(401, 'Unauthorized');
		}

		const demo_time = await checkDemoTime();
		const formData = await request.formData();
		const body = Object.fromEntries(formData);

		// Validate request body
		const validatedData = postCommentSchema.parse(body);
		const { comment, comment_id } = validatedData;

		const { data: commentAuthorized } = await supabase
			.from(demo_time === true ? 'comments_demo' : 'comments')
			.select('id, author_id')
			.eq('author_id', session?.user?.id)
			.eq('id', comment_id)
			.single();

		if (commentAuthorized) {
			const { data: commentUpdated } = await supabase
				.from(demo_time === true ? 'comments_demo' : 'comments')
				.update({ comment, modified_at: new Date() })
				.eq('author_id', session?.user?.id)
				.eq('id', comment_id)
				.single();

			logger.info('Comment updated successfully', {
				commentId: comment_id,
				userId: session.user.id
			});
			return json({ success: true, commentUpdated });
		} else {
			logger.warn('Unauthorized comment update attempt', {
				commentId: comment_id,
				userId: session.user.id
			});
			throw error(403, 'Forbidden');
		}
	} catch (e) {
		if (e instanceof z.ZodError) {
			logger.warn('Invalid comment data', {
				errors: e.errors
			});
			throw error(400, {
				message: 'Invalid comment data',
				details: e.errors
			});
		}
		if ((e as any).status) {
			throw e; // Re-throw HTTP errors
		}
		logger.error('Error in POST /comments', e as Error);
		throw error(500, {
			message: 'Internal server error'
		});
	}
});
