import { supabase } from '$lib/supabase';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { checkDemoTime } from '../../../utils/api';
import { getCommentParents } from '../../../utils/conversions';

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event: any) => {
	const session = event.locals.session;

	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}

	const { demo_time } = await event.parent();
	const { data: user, error: findUserError } = await supabase
		.from(demo_time === true ? 'profiles_demo' : 'profiles')
		.select('id, admin, external_id')
		.eq('id', session?.user?.id)
		.single();

	if (!user?.admin) {
		throw redirect(307, '/questions');
	}

	const { data: comments, error: commentsError } = await supabase
		.from(demo_time === true ? 'comments_demo' : 'comments')
		.select(`*, ${demo_time === true ? 'profiles_demo' : 'profiles'} (*)`)
		.order('created_at', { ascending: false })
		.limit(100);
	if (commentsError) {
		throw new Error(`Error getting comments ${JSON.stringify(commentsError)}`);
	}

	const { data: flaggedComments, error: flaggedCommentsError } = await supabase
		.from('flagged_comments')
		.select(
			`*, comments 
             (*), profiles (*)`
		)
		.is('removed_at', null)
		.is('cleared_at', null)
		.order('created_at', { ascending: false })
		.limit(100);

	if (flaggedCommentsError) {
		throw new Error(`Error getting flagged comments ${JSON.stringify(flaggedCommentsError)}`);
	}

	const { data: blogComments, error: blogCommentsError } = await supabase
		.from('blog_comments')
		.select(`*`)
		.order('created_at', { ascending: false })
		.limit(100);

	if (blogCommentsError) {
		console.log(blogCommentsError);

		throw new Error(`Error getting blog comments ${JSON.stringify(blogCommentsError)}`);
	}

	if (!findUserError) {
		return {
			user,
			session,
			comments: comments ? await getCommentParents(comments) : [],
			flaggedComments,
			blogComments,
			demoTime: demo_time
		};
	} else {
		throw error(404, {
			message: `Error searching for user`
		});
	}
};

export const actions: Actions = {
	removeComment: async ({ request, locals }) => {
		try {
			const session = locals.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}
			const demo_time = await checkDemoTime();

			const { data: user } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin, external_id')
				.eq('id', session?.user?.id)
				.single();

			if (!user?.admin) {
				throw error(400, 'unauthorized');
			}

			const body = Object.fromEntries(await request.formData());
			const commentId = body.commentId as string;

			const removedAt = new Date();

			const { error: flagError } = await supabase
				.from('flagged_comments')
				.update({ removed_at: removedAt })
				.eq('comment_id', commentId);

			if (flagError) {
				throw error(500, {
					message: `Failed to remove comment ${JSON.stringify(flagError)}`
				});
			}

			const { error: removedError } = await supabase
				.from(demo_time === true ? 'comments_demo' : 'comments')
				.update({ removed: true, removed_at: removedAt })
				.eq('id', commentId);

			if (removedError) {
				throw error(500, {
					message: `Failed to remove comment ${JSON.stringify(removedError)}`
				});
			}

			const { data: comment, error: commentError } = await supabase
				.from(demo_time === true ? 'comments_demo' : 'comments')
				.select('*')
				.eq('id', commentId);

			if (commentError) {
				throw new Error(`Failed to get comment ${JSON.stringify(commentError)}`);
			}

			if (comment?.[0]?.parent_type === 'question') {
				//update question count
				const { count: commentCount } = await supabase
					.from(demo_time === true ? 'comments_demo' : 'comments')
					.select('*')
					.eq('parent_id', comment?.[0]?.parent_id)
					.eq('parent_type', 'question');

				const { error: questionError } = await supabase
					.from(demo_time === true ? 'questions_demo' : 'questions')
					.update({ comment_count: commentCount })
					.eq('id', comment?.[0]?.parent_id);

				if (questionError) {
					throw new Error(`Failed to update question count ${JSON.stringify(questionError)}`);
				}

				return { success: true };
			} else {
				const { count: commentCount } = await supabase
					.from(demo_time === true ? 'comments_demo' : 'comments')
					.select('*')
					.eq('parent_id', comment?.[0]?.parent_id)
					.eq('parent_type', 'comment');

				const { error: commentError } = await supabase
					.from(demo_time === true ? 'comments_demo' : 'comments')
					.update({ comment_count: commentCount })
					.eq('id', comment?.[0]?.parent_id);

				if (commentError) {
					throw new Error(`Failed to update comment count ${JSON.stringify(commentError)}`);
				}
			}

			//     .update({ admin: isAdmin === 'true' })
			// .eq('email', email);
		} catch (e) {
			throw error(400, {
				message: `Failed to update demo ${JSON.stringify(e)}`
			});
		}
	},

	unflagComment: async ({ request, locals }) => {
		try {
			const session = locals.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}
			const demo_time = await checkDemoTime();

			const { data: user } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin, external_id')
				.eq('id', session?.user?.id)
				.single();

			if (!user?.admin) {
				throw error(400, 'unauthorized');
			}

			const body = Object.fromEntries(await request.formData());
			const commentId = body.commentId as string;

			const clearedAt = new Date();

			const { error: unFlagError } = await supabase
				.from('flagged_comments')
				.update({ cleared_at: clearedAt })
				.eq('comment_id', commentId);

			if (unFlagError) {
				throw error(500, {
					message: `Failed to unflag comment ${JSON.stringify(unFlagError)}`
				});
			}

			const { error: clearedCommentError } = await supabase
				.from(demo_time === true ? 'comments_demo' : 'comments')
				.update({ removed: false, removed_at: null })
				.eq('id', commentId);

			if (clearedCommentError) {
				throw error(500, {
					message: `Failed to remove comment ${JSON.stringify(clearedCommentError)}`
				});
			}

			return { success: true };
		} catch (e) {
			throw error(400, {
				message: `Failed to update demo ${JSON.stringify(e)}`
			});
		}
	}
};
