// import type { error, json } from 'src/schema';

import { error, json } from '@sveltejs/kit';
import { PRIVATE_DEMO } from '$env/static/private';
import { supabase } from '$lib/supabase';

import type { PostgrestResponse } from '@supabase/supabase-js';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
// import type { Comments } from '$lib/components';
// /** @type {import('./$types').RequestHandler} */
// : Promise<Database.public.Tables.comments>

// type GETResponse = Awaited<ReturnType<typeof GET>>;
// export type MoviesResponseSuccess = GETResponse['data'];
// export type MoviesResponseError = GETResponse['error'];

/** @type {import('./$types').RequestHandler} */
export async function GET({
	url,
	locals,
	getClientAddress
}: {
	url: any;
	locals: any;
	getClientAddress: any;
}) {
	try {
		const parentId = Number(url.searchParams.get('parentId') ?? '0');

		const parentType = String(url.searchParams.get('type') ?? '0');
		const ipAddress = getClientAddress();

		const user = locals?.session?.user;

		let userHasAnswered = false;

		if (user?.id) {
			const { data: hasUserCommented, error: hasUserCommentedError } = await supabase
				.from(PRIVATE_DEMO === 'true' ? 'comments_demo' : 'comments')
				.select('*')
				.eq('parent_type', parentType)
				.eq('parent_id', parentId)
				.eq('author_id', user?.id);

			userHasAnswered = hasUserCommented?.length ? true : false;
		} else {
			// checks if it is a rando
			const { data: hasCommented, error: hasCommentedError } = await supabase
				.from(PRIVATE_DEMO === 'true' ? 'comments_demo' : 'comments')
				.select('*')
				.eq('parent_type', parentType)
				.eq('parent_id', parentId)
				.eq('ip', ipAddress);
			userHasAnswered = hasCommented?.length ? true : false;
		}

		if (!userHasAnswered) {
			return {};
		}

		const { data: questionComments, error: questionCommentsError } = await supabase
			.from(PRIVATE_DEMO === 'true' ? 'comments_demo' : 'comments')
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
		, ${PRIVATE_DEMO === 'true' ? 'profiles_demo' : 'profiles'} ( external_id, enneagram)
		`,
				{ count: 'exact' }
			)
			.eq('parent_id', parentId)
			.order('created_at', { ascending: false });
		const questionCommentIds = questionComments?.map((q) => {
			return q.id;
		});
		if (questionCommentsError) {
			console.log(questionCommentsError);
			throw new Error('Unable to retrieve comments');
		}
		if (questionCommentIds) {
			const { data: commentComments, error: commentError } = await supabase
				.from(PRIVATE_DEMO === 'true' ? 'comments_demo' : 'comments')
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
					, ${PRIVATE_DEMO === 'true' ? 'profiles_demo' : 'profiles'} ( external_id, enneagram)
					`,
					{ count: 'exact' }
				)
				.in('parent_id', questionCommentIds)
				.eq('parent_type', parentType)
				.order('created_at', { ascending: false });

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
				c.profiles = c.profiles_demo;
				if (commentMap[c?.parent_id]) {
					commentMap[c?.parent_id] = [...commentMap[c?.parent_id], c];
				} else {
					commentMap[c?.parent_id] = [c];
				}
			});
			questionComments?.forEach((q) => {
				q.profiles = q.profiles_demo;
				if (commentMap[q.id]) {
					// q.profiles = q.profiles_demo;
					commentMap[q.id].profiles = commentMap[q.id].profiles_demo;

					q.comments = commentMap[q.id];
				}
			});
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
