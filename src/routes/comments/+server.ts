// import type { error, json } from 'src/schema';

import { error, json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import { checkDemoTime } from '../../utils/api';

// import type { PostgrestResponse } from '@supabase/supabase-js';
// import { getServerSession } from '@supabase/auth-helpers-sveltekit';
// import type { Comments } from '$lib/components';
// /** @type {import('./$types').RequestHandler} */
// : Promise<Database.public.Tables.comments>

// type GETResponse = Awaited<ReturnType<typeof GET>>;
// export type MoviesResponseSuccess = GETResponse['data'];
// export type MoviesResponseError = GETResponse['error'];

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals, cookies }) {
	try {
		const demo_time = await checkDemoTime();
		const cookie = cookies.get('9tfingerprint');

		const parentId = Number(url.searchParams.get('parentId') ?? '0');
		const parentType = String(url.searchParams.get('type') ?? '0');
		const range = parseInt(url.searchParams.get('range') as string) || 0;

		const user = locals?.session?.user;

		// only works for questions
		const { data: userHasAnswered, error } = await supabase.rpc('can_see_comments_3', {
			userfingerprint: cookie,
			questionid: parentId,
			userid: user?.id || null
		});

		if (!userHasAnswered) {
			return json({});
		}

		const { data: questionComments, error: questionCommentsError } = await supabase
			.from(demo_time === true ? 'comments_demo' : 'comments')
			.select(
				`
		id
		, created_at
		, parent_id
		, comment
		, author_id
		, ip
		, comment_count
		, parent_type
		, es_id
		, like_count
		, fingerprint
		, ${demo_time === true ? 'profiles_demo' : 'profiles'} ( external_id, enneagram)
		`,
				{ count: 'exact' }
			)
			.eq('parent_id', parentId)
			.order('created_at', { ascending: false })
			.range(range, range + 10);

		if (parentType !== 'question') {
			const questionCommentIds = questionComments?.map((q) => {
				return q.id;
			});
			if (questionCommentsError) {
				console.log(questionCommentsError);
				throw new Error('Unable to retrieve comments');
			}
			if (questionCommentIds) {
				const { data: commentComments, error: commentError } = await supabase
					.from(demo_time === true ? 'comments_demo' : 'comments')
					.select(
						`
					id
					, created_at
					, parent_id
					, comment
					, author_id
					, ip
					, comment_count
					, parent_type
					, es_id
					, like_count
					, fingerprint
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
					console.log(commentError);
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
