import { supabase } from '$lib/supabase';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { checkDemoTime } from '../../../utils/api';
import { getCommentParents } from '../../../utils/conversions';

/**
 * Validates if a user is an admin and returns the user data
 */
async function validateAdmin(session, demoTime) {
	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}

	const { data: user, error: findUserError } = await supabase
		.from(demoTime ? 'profiles_demo' : 'profiles')
		.select('id, admin, external_id')
		.eq('id', session.user.id)
		.single();

	if (findUserError) {
		console.error('Error finding user:', findUserError);
		throw error(404, { message: 'Error searching for user' });
	}

	if (!user?.admin) {
		throw redirect(307, '/questions');
	}

	return user;
}

/**
 * Updates comment counts for parent content after a comment is removed or restored
 */
async function updateCommentCounts(commentData, demoTime) {
	try {
		if (commentData?.parent_type === 'question') {
			// Update question comment count
			const { count: commentCount, error: countError } = await supabase
				.from(demoTime ? 'comments_demo' : 'comments')
				.select('*', { count: 'exact', head: false })
				.eq('parent_id', commentData?.parent_id)
				.eq('parent_type', 'question')
				.eq('removed', false);

			if (countError) {
				throw new Error(`Failed to get comment count: ${countError.message}`);
			}

			const { error: questionError } = await supabase
				.from(demoTime ? 'questions_demo' : 'questions')
				.update({ comment_count: commentCount })
				.eq('id', commentData?.parent_id);

			if (questionError) {
				throw new Error(`Failed to update question count: ${questionError.message}`);
			}
		} else if (commentData?.parent_type === 'comment') {
			// Update parent comment's reply count
			const { count: commentCount, error: countError } = await supabase
				.from(demoTime ? 'comments_demo' : 'comments')
				.select('*', { count: 'exact', head: false })
				.eq('parent_id', commentData?.parent_id)
				.eq('parent_type', 'comment')
				.eq('removed', false);

			if (countError) {
				throw new Error(`Failed to get comment count: ${countError.message}`);
			}

			const { error: commentError } = await supabase
				.from(demoTime ? 'comments_demo' : 'comments')
				.update({ comment_count: commentCount })
				.eq('id', commentData?.parent_id);

			if (commentError) {
				throw new Error(`Failed to update comment count: ${commentError.message}`);
			}
		}
		return true;
	} catch (error) {
		console.error('Error updating comment counts:', error);
		return false;
	}
}

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	try {
		const session = event.locals.session;
		const { demo_time } = await event.parent();

		// Validate user is an admin
		const user = await validateAdmin(session, demo_time);

		// Load regular comments
		const { data: comments, error: commentsError } = await supabase
			.from(demo_time ? 'comments_demo' : 'comments')
			.select(`*, ${demo_time ? 'profiles_demo' : 'profiles'} (*)`)
			.order('created_at', { ascending: false })
			.limit(100);

		if (commentsError) {
			console.error('Error fetching comments:', commentsError);
			throw error(500, { message: 'Failed to load comments' });
		}

		// Load flagged comments
		const { data: flaggedComments, error: flaggedCommentsError } = await supabase
			.from('flagged_comments')
			.select(`*, comments (*), profiles (*)`)
			.is('removed_at', null)
			.is('cleared_at', null)
			.order('created_at', { ascending: false })
			.limit(100);

		if (flaggedCommentsError) {
			console.error('Error fetching flagged comments:', flaggedCommentsError);
			throw error(500, { message: 'Failed to load flagged comments' });
		}

		// Load blog comments
		const { data: blogComments, error: blogCommentsError } = await supabase
			.from('blog_comments')
			.select(`*`)
			.order('created_at', { ascending: false })
			.limit(100);

		if (blogCommentsError) {
			console.error('Error fetching blog comments:', blogCommentsError);
			throw error(500, { message: 'Failed to load blog comments' });
		}

		// Process comments to include parent questions
		const processedComments = comments ? await getCommentParents(comments) : [];

		return {
			user,
			session,
			comments: processedComments,
			flaggedComments,
			blogComments,
			demoTime: demo_time
		};
	} catch (err) {
		// Pass through redirects and errors
		if (err.status) throw err;

		console.error('Unexpected error in load function:', err);
		throw error(500, { message: 'An unexpected error occurred' });
	}
};

export const actions: Actions = {
	removeComment: async ({ request, locals }) => {
		try {
			const session = locals.session;
			const demo_time = await checkDemoTime();

			// Validate user is an admin
			await validateAdmin(session, demo_time);

			// Get comment ID from form data
			const body = Object.fromEntries(await request.formData());
			const commentId = body.commentId as string;
			const removedAt = new Date();

			// Update flagged_comments table
			const { error: flagError } = await supabase
				.from('flagged_comments')
				.update({ removed_at: removedAt })
				.eq('comment_id', commentId);

			if (flagError) {
				console.error('Error updating flagged comment:', flagError);
				throw error(500, { message: 'Failed to update flagged comment record' });
			}

			// Update comments table
			const { error: removedError } = await supabase
				.from(demo_time ? 'comments_demo' : 'comments')
				.update({ removed: true, removed_at: removedAt })
				.eq('id', commentId);

			if (removedError) {
				console.error('Error removing comment:', removedError);
				throw error(500, { message: 'Failed to remove comment' });
			}

			// Get the comment data for updating counts
			const { data: comment, error: commentError } = await supabase
				.from(demo_time ? 'comments_demo' : 'comments')
				.select('*')
				.eq('id', commentId)
				.single();

			if (commentError) {
				console.error('Error fetching comment data:', commentError);
				throw error(500, { message: 'Failed to get comment data' });
			}

			// Update comment counts for parent content
			await updateCommentCounts(comment, demo_time);

			return { success: true };
		} catch (e) {
			console.error('Error in removeComment action:', e);
			throw error(400, {
				message: e.message || 'Failed to remove comment'
			});
		}
	},

	unflagComment: async ({ request, locals }) => {
		try {
			const session = locals.session;
			const demo_time = await checkDemoTime();

			// Validate user is an admin
			await validateAdmin(session, demo_time);

			// Get comment ID from form data
			const body = Object.fromEntries(await request.formData());
			const commentId = body.commentId as string;
			const clearedAt = new Date();

			// Update flagged_comments table
			const { error: unFlagError } = await supabase
				.from('flagged_comments')
				.update({ cleared_at: clearedAt })
				.eq('comment_id', commentId);

			if (unFlagError) {
				console.error('Error unflagging comment:', unFlagError);
				throw error(500, { message: 'Failed to unflag comment' });
			}

			// Update comments table
			const { error: clearedCommentError } = await supabase
				.from(demo_time ? 'comments_demo' : 'comments')
				.update({ removed: false, removed_at: null })
				.eq('id', commentId);

			if (clearedCommentError) {
				console.error('Error clearing comment flag:', clearedCommentError);
				throw error(500, { message: 'Failed to restore comment' });
			}

			// Get the comment data for updating counts
			const { data: comment, error: commentError } = await supabase
				.from(demo_time ? 'comments_demo' : 'comments')
				.select('*')
				.eq('id', commentId)
				.single();

			if (commentError) {
				console.error('Error fetching comment data:', commentError);
				throw error(500, { message: 'Failed to get comment data' });
			}

			// Update comment counts for parent content
			await updateCommentCounts(comment, demo_time);

			return { success: true };
		} catch (e) {
			console.error('Error in unflagComment action:', e);
			throw error(400, {
				message: e.message || 'Failed to unflag comment'
			});
		}
	}
};