// routes/comments/+server.ts
import { error, json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

import { checkDemoTime } from '../../utils/api';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals, cookies }) {
	try {
		const demo_time = await checkDemoTime();
		const cookie = cookies.get('9tfingerprint');

		const parentId = Number(url.searchParams.get('parentId') ?? '0');
		const parentType = String(url.searchParams.get('type') ?? '0');
		const range = parseInt(url.searchParams.get('range') as string) || 0;

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
					// Error checking if user can see comments
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

		if (questionCommentsError || !questionComments?.length) {
			throw new Error('Unable to retrieve comments');
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
		throw error(400, {
			message: `encountered error`
		});
	}
}

export async function POST({ locals, request }) {
	try {
		const session = locals.session;

		if (!session?.user?.id) {
			throw error(400, 'unauthorized');
		}
		const demo_time = await checkDemoTime();
		const body = Object.fromEntries(await request.formData());
		const comment = body.comment as string;
		const comment_id = body.comment_id as string;

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

			return json({ success: true, commentUpdated });
		} else {
			throw error(400, 'unauthorized');
		}
	} catch (e) {
		throw error(400, {
			message: `encountered error`
		});
	}
}
