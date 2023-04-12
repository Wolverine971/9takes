import { supabase } from '$lib/supabase';
import type { Database } from 'src/schema';

import { error, json } from '@sveltejs/kit';
import type { PostgrestResponse } from '@supabase/supabase-js';
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
	const parentId = Number(url.searchParams.get('parentId') ?? '0');

	const type = url.searchParams.get('type') as string;

	const { data: canSee, error: canSeeError } = await supabase.rpc('can_see_comments', {
		questionid: parentId,
		userid: locals.session.user.id,
		userip: getClientAddress()
	});

	let { data: questionComments, error: questionError } = await supabase
		.from('comments')
		.select('*', { count: 'exact' })
		.eq('parent_id', parentId);
	const questionCommentIds = questionComments?.map((q) => {
		return q.id;
	});
	if (questionCommentIds) {
		let {
			data: commentComments,
			error: commentError
		}: PostgrestResponse<{ data: Database['public']['Tables']['comments']['Row'][]; error: any }> =
			await supabase
				.from('comments')
				.select('*', { count: 'exact' })
				.in('parent_id', questionCommentIds);

		interface ICommentMap {
			[key: string]: string[];
		}

		let commentMap: ICommentMap = {};
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

	if (!questionError && questionComments?.length) {
		return json(questionComments);
	} else {
		throw error(400, {
			message: `Failed to get question, ${JSON.stringify(questionError)}`
		});
	}
}
