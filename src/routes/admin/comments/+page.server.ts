// src/routes/admin/comments/+page.server.ts
import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { logger } from '$lib/utils/logger';
import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../../database.types';

import type { PageServerLoad } from './$types';
import { checkDemoTime } from '../../../utils/api';
import { getCommentParents } from '../../../utils/conversions';

type CommentRow = Database['public']['Tables']['comments']['Row'];
type CommentDemoRow = Database['public']['Tables']['comments_demo']['Row'];
type AppSupabase = SupabaseClient<Database>;
type CommentParentData = Pick<CommentRow | CommentDemoRow, 'parent_type' | 'parent_id'>;
type CommentsQueryTable = 'comments' | 'comments_demo' | 'flagged_comments' | 'blog_comments';

// Validation schemas
const commentActionSchema = z.object({
	commentId: z.coerce.number().int().positive('Invalid comment ID format')
});

/**
 * Configuration constants
 */
const PAGE_SIZE = 50;
const MAX_COMMENTS = 1000;

/**
 * Validates if a user is an admin and returns the user data
 */
async function validateAdmin(
	session: App.Locals['session'],
	demoTime: boolean,
	supabase: AppSupabase
) {
	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}

	const { data: user, error: findUserError } = await supabase
		.from(demoTime ? 'profiles_demo' : 'profiles')
		.select('id, admin, external_id')
		.eq('id', session.user.id)
		.single();

	if (findUserError) {
		logger.error('Error finding user', findUserError, {
			userId: session.user.id
		});
		throw error(404, { message: 'Error searching for user' });
	}

	if (!user?.admin) {
		logger.warn('Non-admin access attempt to admin page', {
			userId: session.user.id,
			externalId: user?.external_id
		});
		throw redirect(307, '/questions');
	}

	return user;
}

/**
 * Updates comment counts for parent content after a comment is removed or restored
 */
async function updateCommentCounts(
	commentData: CommentParentData | null,
	demoTime: boolean,
	supabase: AppSupabase
) {
	try {
		if (!commentData?.parent_type || !commentData?.parent_id) {
			console.warn('Missing parent data for comment count update');
			return false;
		}

		const table = demoTime ? 'comments_demo' : 'comments';

		// Get comment count for the parent
		const { count: commentCount, error: countError } = await supabase
			.from(table)
			.select('*', { count: 'exact', head: false })
			.eq('parent_id', commentData.parent_id)
			.eq('parent_type', commentData.parent_type)
			.eq('removed', false);

		if (countError) {
			throw new Error(`Failed to get comment count: ${countError.message}`);
		}

		// Update parent based on type
		if (commentData.parent_type === 'question') {
			const { error: updateError } = await supabase
				.from(demoTime ? 'questions_demo' : 'questions')
				.update({ comment_count: commentCount })
				.eq('id', commentData.parent_id);

			if (updateError) {
				throw new Error(`Failed to update question count: ${updateError.message}`);
			}
		} else if (commentData.parent_type === 'comment') {
			const { error: updateError } = await supabase
				.from(table)
				.update({ comment_count: commentCount })
				.eq('id', commentData.parent_id);

			if (updateError) {
				throw new Error(`Failed to update comment count: ${updateError.message}`);
			}
		}

		return true;
	} catch (error) {
		console.error('Error updating comment counts:', error);
		return false;
	}
}

/**
 * Get paginated comments with optional filters
 */
interface PaginationOptions {
	selectionFields?: string;
	limit?: number;
	orderField?: string;
	orderDirection?: { ascending: boolean };
	filters?: Record<string, unknown>;
}

async function getPaginatedComments(
	table: CommentsQueryTable,
	page = 0,
	options: PaginationOptions = {},
	supabase: AppSupabase
) {
	try {
		const {
			selectionFields = '*',
			limit = PAGE_SIZE,
			orderField = 'created_at',
			orderDirection = { ascending: false },
			filters = {}
		} = options;

		let query = supabase
			.from(table)
			.select(selectionFields)
			.order(orderField, orderDirection)
			.range(page * limit, page * limit + limit - 1);

		// Apply any filters to the query
		Object.entries(filters).forEach(([key, value]) => {
			if (value === null) {
				query = query.is(key, null);
			} else if (Array.isArray(value)) {
				query = query.in(key, value);
			} else if (value !== undefined) {
				query = query.eq(key, value);
			} else {
				return;
			}
		});

		// Execute query
		const { data, error, count } = await query;

		if (error) {
			console.error(`Error fetching ${table}:`, error);
			throw error;
		}

		return { data, count };
	} catch (err) {
		console.error(`Error in getPaginatedComments for ${table}:`, err);
		throw err;
	}
}

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	try {
		const session = event.locals.session;
		const locals = event.locals;
		const { demo_time } = await event.parent();
		const isDemo = demo_time === true;
		const pageParam = event.url.searchParams.get('page');
		const page = pageParam ? Number.parseInt(pageParam, 10) || 0 : 0;

		// Validate user is an admin
		const user = await validateAdmin(session, isDemo, locals.supabase);

		// Table name based on demo mode
		const commentsTable: CommentsQueryTable = isDemo ? 'comments_demo' : 'comments';
		const profilesTable = isDemo ? 'profiles_demo' : 'profiles';

		// Parallelize all comment loading for better performance
		const [{ data: comments }, { data: flaggedComments }, { data: blogComments }] =
			await Promise.all([
				// Load regular comments
				getPaginatedComments(
					commentsTable,
					page,
					{
						selectionFields: `*, ${profilesTable} (*)`,
						limit: PAGE_SIZE,
						orderField: 'created_at',
						orderDirection: { ascending: false }
					},
					locals.supabase
				),
				// Load flagged comments
				getPaginatedComments(
					'flagged_comments',
					page,
					{
						selectionFields: `*, comments (*), profiles (*)`,
						limit: PAGE_SIZE,
						filters: {
							removed_at: null,
							cleared_at: null
						}
					},
					locals.supabase
				),
				// Load blog comments
				getPaginatedComments(
					'blog_comments',
					page,
					{
						selectionFields: `*, profiles (*)`,
						limit: PAGE_SIZE
					},
					locals.supabase
				)
			]);

		// Process comments to include parent questions
		const processedComments = comments
			? await getCommentParents(
					comments as unknown as Array<{
						id: number;
						parent_id: number | null;
						parent_type: string;
					}>
				)
			: [];

		return {
			user,
			comments: processedComments,
			flaggedComments,
			blogComments,
			demoTime: isDemo,
			currentPage: page,
			hasMore:
				comments?.length === PAGE_SIZE ||
				flaggedComments?.length === PAGE_SIZE ||
				blogComments?.length === PAGE_SIZE
		};
	} catch (err) {
		// Pass through redirects and errors
		if (err instanceof Response || (typeof err === 'object' && err && 'status' in err)) {
			throw err;
		}

		console.error('Unexpected error in load function:', err);
		throw error(500, { message: 'An unexpected error occurred' });
	}
};

export const actions: Actions = {
	removeComment: async ({ request, locals }) => {
		try {
			const session = locals.session;
			const demo_time = await checkDemoTime(locals.supabase);
			const isDemo = demo_time === true;

			// Validate user is an admin
			await validateAdmin(session, isDemo, locals.supabase);

			// Get comment ID from form data
			const body = Object.fromEntries(await request.formData());
			const { commentId } = commentActionSchema.parse(body);

			const removedAt = new Date().toISOString();
			const commentsTable: CommentsQueryTable = isDemo ? 'comments_demo' : 'comments';

			// Start a transaction
			const transaction = async () => {
				// 1. Update flagged_comments table
				const { error: flagError } = await locals.supabase
					.from('flagged_comments')
					.update({ removed_at: removedAt })
					.eq('comment_id', commentId);

				if (flagError) {
					console.error('Error updating flagged comment:', flagError);
					throw new Error('Failed to update flagged comment record');
				}

				// 2. Update comments table
				const { error: removedError } = await locals.supabase
					.from(commentsTable)
					.update({ removed: true, removed_at: removedAt })
					.eq('id', commentId);

				if (removedError) {
					console.error('Error removing comment:', removedError);
					throw new Error('Failed to remove comment');
				}

				// 3. Get the comment data for updating counts
				const { data: comment, error: commentError } = await locals.supabase
					.from(commentsTable)
					.select('*')
					.eq('id', commentId)
					.single();

				if (commentError) {
					console.error('Error fetching comment data:', commentError);
					throw new Error('Failed to get comment data');
				}

				// 4. Update comment counts for parent content
				await updateCommentCounts(comment, isDemo, locals.supabase);

				return comment;
			};

			// Execute the transaction
			await transaction();

			return { success: true };
		} catch (e) {
			console.error('Error in removeComment action:', e);
			const message = e instanceof Error ? e.message : 'Failed to remove comment';
			throw error(400, {
				message
			});
		}
	},

	unflagComment: async ({ request, locals }) => {
		try {
			const session = locals.session;
			const demo_time = await checkDemoTime(locals.supabase);
			const isDemo = demo_time === true;

			// Validate user is an admin
			await validateAdmin(session, isDemo, locals.supabase);

			// Get comment ID from form data
			const body = Object.fromEntries(await request.formData());
			const { commentId } = commentActionSchema.parse(body);

			const clearedAt = new Date().toISOString();
			const commentsTable: CommentsQueryTable = isDemo ? 'comments_demo' : 'comments';

			// Start a transaction
			const transaction = async () => {
				// 1. Update flagged_comments table
				const { error: unFlagError } = await locals.supabase
					.from('flagged_comments')
					.update({ cleared_at: clearedAt })
					.eq('comment_id', commentId);

				if (unFlagError) {
					console.error('Error unflagging comment:', unFlagError);
					throw new Error('Failed to unflag comment');
				}

				// 2. Update comments table
				const { error: clearedCommentError } = await locals.supabase
					.from(commentsTable)
					.update({ removed: false, removed_at: null })
					.eq('id', commentId);

				if (clearedCommentError) {
					console.error('Error clearing comment flag:', clearedCommentError);
					throw new Error('Failed to restore comment');
				}

				// 3. Get the comment data for updating counts
				const { data: comment, error: commentError } = await locals.supabase
					.from(commentsTable)
					.select('*')
					.eq('id', commentId)
					.single();

				if (commentError) {
					console.error('Error fetching comment data:', commentError);
					throw new Error('Failed to get comment data');
				}

				// 4. Update comment counts for parent content
				await updateCommentCounts(comment, isDemo, locals.supabase);

				return comment;
			};

			// Execute the transaction
			await transaction();

			return { success: true };
		} catch (e: any) {
			console.error('Error in unflagComment action:', e);
			const message = e instanceof Error ? e.message : 'Failed to unflag comment';
			throw error(400, {
				message
			});
		}
	}
};
