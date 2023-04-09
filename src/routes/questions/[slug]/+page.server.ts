import { supabase } from '$lib/supabase';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
// import type { PostgrestResponse } from '@supabase/supabase-js';
import type { Actions } from './$types';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load(event) {
	const session = await getServerSession(event);
	let { data: question, error: findQuestionError } = await supabase
		.from('questions')
		.select('*')
		.eq('url', event.params.slug)
		.single();

	let { data: hasCommented, error: hasCommentedError } = await supabase
		.from('comments')
		.select('*')
		.eq('parent_type', 'question')
		.eq('parent_id', question?.id)
		.eq('author_id', session?.user.id)
		.single();
	if (!question || findQuestionError) {
		throw error(400, {
			message: 'No question found'
		});
	}

	let userHasAnswered = hasCommented ? true : false;

	if (!hasCommented) {
		let { count: commentCount, error: commentCountError } = await supabase
			.from('comments')
			.select('*', { count: 'exact' })
			.eq('parent_type', 'question')
			.eq('parent_id', question?.id);

		return {
			question,
			comments: [],
			comment_count: commentCount,
			session,
			flags: {
				userHasAnswered: userHasAnswered,
				userSignedIn: event?.locals?.session?.user?.aud
			}
		};
	}

	let {
		data: questionComments,
		count: questionCommentCount,
		error: questionCommentsError
	} = await supabase
		.from('comments')
		.select('*', { count: 'exact' })
		.eq('parent_id', question.id)
		.limit(10);

	if (questionCommentsError) {
		console.log('No comments for question');
	}

	return {
		question,
		comments: questionComments,
		comment_count: questionCommentCount,
		session,
		flags: {
			userHasAnswered: userHasAnswered,
			userSignedIn: event?.locals?.session?.user?.aud
		}
	};
}

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
				ip: getClientAddress(),
				parent_type: parent_type
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
				throw error(404, {
					message: `Add comment error`
				});
			}
		} catch (e) {
			throw error(400, {
				message: `error creating comment ${JSON.stringify(e)}`
			});
		}
	}
};
