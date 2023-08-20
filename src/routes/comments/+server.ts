// import type { error, json } from 'src/schema';

import { error, json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import { PRIVATE_DEMO } from '$env/static/private';

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
		const ipAddress = getClientAddress();

		const user = locals?.session?.user;

		let userHasAnswered = false;

		if (user?.id) {
			const { data: hasUserCommented, error: hasUserCommentedError } = await supabase
				.from(PRIVATE_DEMO ? 'comments_demo' : 'comments')
				.select('*')
				.eq('parent_type', 'question')
				.eq('parent_id', parentId)
				.eq('author_id', user?.id);

			userHasAnswered = hasUserCommented?.length ? true : false;
		} else {
			// checks if it is a rando
			const { data: hasCommented, error: hasCommentedError } = await supabase
				.from('comments')
				.select('*')
				.eq('parent_type', 'question')
				.eq('parent_id', parentId)
				.eq('ip', ipAddress);
			userHasAnswered = hasCommented?.length ? true : false;
		}

		if (!userHasAnswered) {
			return {};
		}

		const { data: questionComments, error: questionCommentsError } = await supabase
			.from(PRIVATE_DEMO ? 'comments_demo' : 'comments')
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
		, profiles ( external_id, enneagram)
		`,
				{ count: 'exact' }
			)
			.eq('parent_id', parentId);
		const questionCommentIds = questionComments?.map((q) => {
			return q.id;
		});
		if (questionCommentsError) {
			console.log(questionCommentsError);
			throw new Error('Unable to retrieve comments');
		}
		if (questionCommentIds) {
			const { data: commentComments, error: commentError } = await supabase
				.from(PRIVATE_DEMO ? 'comments_demo' : 'comments')
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
					, profiles ( external_id, enneagram)
					`,
					{ count: 'exact' }
				)
				.in('parent_id', questionCommentIds);

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
				if (commentMap[c?.parent_id]) {
					commentMap[c?.parent_id] = [...commentMap[c?.parent_id], c];
				} else {
					commentMap[c?.parent_id] = [c];
				}
			});
			questionComments?.forEach((q) => {
				if (commentMap[q.id]) {
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
