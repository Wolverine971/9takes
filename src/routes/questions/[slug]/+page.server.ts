import { supabase } from '$lib/supabase';
import type { PostgrestResponse } from '@supabase/supabase-js';

/** @type {import('./$types').PageLoad} */
export async function load({ params }: { params: any }) {
	const {
		data: question,
		error,
		status
	} = await supabase.from('questions').select('*').eq('url', params.slug).single();

	let {
		data: questionComments,
		count: questionCommentCount,
		error: questionError
	} = await supabase
		.from('comments')
		.select('*', { count: 'exact' })
		.eq('parent_id', question.id)
		.limit(10);

	// const questionCommentIds = questionComments?.map((q) => {
	// 	return q.id;
	// });
	// if (questionCommentIds) {
	// 	let {
	// 		data: commentComments,
	// 		error: commentError,
	// 		count
	// 	}: PostgrestResponse<{
	// 		data: Database['public']['Tables']['comments']['Row'][];
	// 		error: any;
	// 	}> = await supabase
	// 		.from('comments')
	// 		.select('*', { count: 'exact' })
	// 		.in('parent_id', questionCommentIds)
	// 		.limit(20);

	// 	interface ICommentMap {
	// 		[key: string]: string[];
	// 	}
	// 	let commentMap: ICommentMap = {};
	// 	console.log('count ' + count);
	// 	console.log('commentComments');
	// 	console.log(commentComments);
	// 	commentComments?.forEach((c: any) => {
	// 		if (commentMap[c?.parent_id]) {
	// 			commentMap[c?.parent_id] = [...commentMap[c?.parent_id], c];
	// 		} else {
	// 			commentMap[c?.parent_id] = [c];
	// 		}
	// 	});
	// 	questionComments?.forEach((q) => {
	// 		if (commentMap[q.id]) {
	// 			q.comments = commentMap[q.id];
	// 		}
	// 	});
	// }

	return { question, comments: questionComments, comment_count: questionCommentCount };
}

import type { Actions } from './$types';
import type { Database } from 'src/schema';
import { fail, json } from '@sveltejs/kit';

export const actions: Actions = {
	createComment: async ({ request, getClientAddress }) => {
		try {
			const body = Object.fromEntries(await request.formData());

			const comment = body.comment as string;
			const parent_id = body.parent_id as string;
			const author_id = body.author_id as string;
			const parent_type = body.parent_type as string;
			const parentId = parseInt(parent_id);
			const commentData = {
				comment: comment,
				parent_id: parentId,
				author_id: author_id,
				comment_count: 0,
				ip: getClientAddress()
			};
			// console.log(commentData);

			const { data, error: addCommentError } = await supabase.from('comments').insert(commentData);
			let newIncrement;
			if (parent_type === 'comment') {
				// const { data, error:  } = await supabase
				// 	.from('comments')
				// 	.update({ comment_count: 'otherValue' })
				// 	.eq('parent_id', parent_id);

				const { data: incremented, error: incrementError } = await supabase.rpc(
					'increment_comment_count',
					{
						comment_parent_id: parentId
					}
				);
				console.log(incremented);
				newIncrement = incremented;

				if (incrementError) {
					console.log(incrementError);
				}
			}
			console.log('supabase resp ');
			// console.log(resp);

			if (!addCommentError) {
				// return json({ commentResp: resp.data, incremented: newIncrement });
				return { success: true };
			} else {
				throw new Error('messed up');
			}
		} catch (e) {
			console.log('error thrown');
			console.log(e);
			// return failure({ error: e });
			return fail(400, { problem: 'you' });
		}
	}
};
