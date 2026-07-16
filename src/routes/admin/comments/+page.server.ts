// src/routes/admin/comments/+page.server.ts
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { logger } from '$lib/utils/logger';
import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../../database.types';

import type { PageServerLoad } from './$types';
import { checkDemoTime } from '../../../utils/api';

type CommentRow = Database['public']['Tables']['comments']['Row'];
type CommentDemoRow = Database['public']['Tables']['comments_demo']['Row'];
type FlaggedCommentRow = Database['public']['Tables']['flagged_comments']['Row'];
type BlogCommentRow = Database['public']['Tables']['blog_comments']['Row'];
type FlagReasonRow = Database['public']['Tables']['flag_reasons']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type AppSupabase = SupabaseClient<Database>;
type CommentParentData = Pick<CommentRow | CommentDemoRow, 'parent_type' | 'parent_id'>;
type CommentsQueryTable = 'comments' | 'comments_demo' | 'flagged_comments' | 'blog_comments';
type ProfileSummary = Pick<ProfileRow, 'email' | 'external_id'>;
type ParentQuestionSummary = Pick<
	Database['public']['Tables']['questions']['Row'],
	'id' | 'question' | 'question_formatted' | 'url'
>;
type ParentCommentSummary = Pick<CommentRow, 'id' | 'comment'>;
type AdminComment = (CommentRow | CommentDemoRow) & {
	removed?: boolean;
	profiles?: ProfileSummary | null;
	profiles_demo?: ProfileSummary | null;
	parentQuestion?: ParentQuestionSummary;
	parentComment?: ParentCommentSummary;
};
type FlaggedComment = FlaggedCommentRow & {
	comments: Pick<CommentRow, 'id' | 'comment'> | null;
	profiles: ProfileSummary | null;
	flag_reasons: Pick<FlagReasonRow, 'reason'> | null;
};
type AdminBlogComment = BlogCommentRow & {
	profiles: ProfileSummary | null;
};

// Validation schemas
const commentActionSchema = z.object({
	commentId: z.coerce.number().int().positive('Invalid comment ID format')
});

/**
 * Configuration constants
 */
const PAGE_SIZE = 50;

function parsePageIndex(value: string | null): number {
	if (value === null || value.trim() === '') return 0;

	const page = Number(value);
	return Number.isSafeInteger(page) && page >= 0 ? page : 0;
}

function hasNextPage(count: number | null, loadedRows: number, page: number): boolean {
	return count === null ? loadedRows === PAGE_SIZE : (page + 1) * PAGE_SIZE < count;
}

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
			.select('id', { count: 'exact', head: true })
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
			.select(selectionFields, { count: 'exact' })
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

async function attachCommentParents(
	comments: AdminComment[],
	isDemo: boolean,
	supabase: AppSupabase
): Promise<AdminComment[]> {
	const questionParentIds = [
		...new Set(
			comments
				.filter(
					(comment): comment is AdminComment & { parent_id: number } =>
						comment.parent_id !== null && comment.parent_type === 'question'
				)
				.map((comment) => comment.parent_id)
		)
	];
	const commentParentIds = [
		...new Set(
			comments
				.filter(
					(comment): comment is AdminComment & { parent_id: number } =>
						comment.parent_id !== null && comment.parent_type !== 'question'
				)
				.map((comment) => comment.parent_id)
		)
	];

	const db = supabase as any;
	const [questionsResult, commentsResult] = await Promise.all([
		questionParentIds.length
			? db
					.from(isDemo ? 'questions_demo' : 'questions')
					.select('id, question, question_formatted, url')
					.in('id', questionParentIds)
			: Promise.resolve({ data: [], error: null }),
		commentParentIds.length
			? db
					.from(isDemo ? 'comments_demo' : 'comments')
					.select('id, comment')
					.in('id', commentParentIds)
			: Promise.resolve({ data: [], error: null })
	]);

	if (questionsResult.error) {
		throw new Error(`Failed to get parent questions ${JSON.stringify(questionsResult.error)}`);
	}
	if (commentsResult.error) {
		throw new Error(`Failed to get parent comments ${JSON.stringify(commentsResult.error)}`);
	}

	const questionMap = new Map<number, ParentQuestionSummary>(
		((questionsResult.data ?? []) as ParentQuestionSummary[]).map((question) => [
			question.id,
			question
		])
	);
	const commentMap = new Map<number, ParentCommentSummary>(
		((commentsResult.data ?? []) as ParentCommentSummary[]).map((comment) => [comment.id, comment])
	);

	for (const comment of comments) {
		if (comment.parent_id === null) continue;
		if (comment.parent_type === 'question') {
			comment.parentQuestion = questionMap.get(comment.parent_id);
		} else {
			comment.parentComment = commentMap.get(comment.parent_id);
		}
	}

	return comments;
}

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	try {
		const session = event.locals.session;
		const locals = event.locals;
		const { demo_time } = await event.parent();
		const isDemo = demo_time === true;
		const page = parsePageIndex(event.url.searchParams.get('page'));

		// Validate user is an admin
		const user = await validateAdmin(session, isDemo, locals.supabase);

		// Table name based on demo mode
		const commentsTable: CommentsQueryTable = isDemo ? 'comments_demo' : 'comments';
		const profilesTable = isDemo ? 'profiles_demo' : 'profiles';
		const profileSelection = `profiles:${profilesTable} (email, external_id)`;

		// Parallelize all comment loading for better performance
		const [
			{ data: comments, count: commentsCount },
			{ data: flaggedComments, count: flaggedCommentsCount },
			{ data: blogComments, count: blogCommentsCount }
		] = await Promise.all([
			// Load regular comments
			getPaginatedComments(
				commentsTable,
				page,
				{
					selectionFields: `id, comment, created_at, parent_id, parent_type, removed, ${profileSelection}`,
					limit: PAGE_SIZE,
					orderField: 'created_at',
					orderDirection: { ascending: false }
				},
				locals.supabase
			),
			// Load flagged comments
			isDemo
				? Promise.resolve({ data: [], count: 0 })
				: getPaginatedComments(
						'flagged_comments',
						page,
						{
							selectionFields: `id, comment_id, flagged_by, reason_id, description, created_at, removed_at, cleared_at, comments (id, comment), profiles (email, external_id), flag_reasons (reason)`,
							limit: PAGE_SIZE,
							filters: {
								removed_at: null,
								cleared_at: null
							}
						},
						locals.supabase
					),
			// Load blog comments
			isDemo
				? Promise.resolve({ data: [], count: 0 })
				: getPaginatedComments(
						'blog_comments',
						page,
						{
							selectionFields: `id, comment, created_at, blog_link, blog_type, profiles (email, external_id)`,
							limit: PAGE_SIZE
						},
						locals.supabase
					)
		]);

		// Process comments to include parent questions
		const recentComments = (comments ?? []) as unknown as AdminComment[];
		const processedComments = recentComments.length
			? await attachCommentParents(recentComments, isDemo, locals.supabase)
			: [];

		return {
			user,
			comments: processedComments,
			flaggedComments: (flaggedComments ?? []) as unknown as FlaggedComment[],
			blogComments: (blogComments ?? []) as unknown as AdminBlogComment[],
			demoTime: isDemo,
			currentPage: page,
			hasMore:
				hasNextPage(commentsCount, comments?.length ?? 0, page) ||
				hasNextPage(flaggedCommentsCount, flaggedComments?.length ?? 0, page) ||
				hasNextPage(blogCommentsCount, blogComments?.length ?? 0, page)
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
		const demoTime = await checkDemoTime(locals.supabase);
		const isDemo = demoTime === true;

		await validateAdmin(locals.session, isDemo, locals.supabase);

		if (isDemo) {
			return fail(400, {
				success: false,
				message: 'Moderation actions are unavailable while demo mode is enabled'
			});
		}

		const body = Object.fromEntries(await request.formData());
		const parsedBody = commentActionSchema.safeParse(body);
		if (!parsedBody.success) {
			return fail(400, {
				success: false,
				message: parsedBody.error.issues[0]?.message ?? 'Invalid comment ID'
			});
		}

		const { commentId } = parsedBody.data;
		const removedAt = new Date().toISOString();

		try {
			const { data: updatedFlags, error: flagError } = await locals.supabase
				.from('flagged_comments')
				.update({ removed_at: removedAt })
				.eq('comment_id', commentId)
				.is('removed_at', null)
				.is('cleared_at', null)
				.select('id');

			if (flagError) throw new Error('Failed to update flagged comment record');
			if (!updatedFlags?.length) {
				return fail(409, { success: false, message: 'This flag is no longer pending review' });
			}

			const { data: comment, error: removedError } = await locals.supabase
				.from('comments')
				.update({ removed: true, removed_at: removedAt })
				.eq('id', commentId)
				.select('parent_id, parent_type')
				.single();

			if (removedError || !comment) {
				const flagIds = updatedFlags.map((flag) => flag.id);
				const { error: rollbackError } = await locals.supabase
					.from('flagged_comments')
					.update({ removed_at: null })
					.in('id', flagIds)
					.eq('removed_at', removedAt);

				if (rollbackError) console.error('Failed to roll back flag removal:', rollbackError);
				throw new Error('Failed to remove comment');
			}

			const countsUpdated = await updateCommentCounts(comment, false, locals.supabase);

			return {
				success: true,
				warning: countsUpdated
					? undefined
					: 'Comment removed, but its parent comment count could not be refreshed'
			};
		} catch (e) {
			console.error('Error in removeComment action:', e);
			const message = e instanceof Error ? e.message : 'Failed to remove comment';
			return fail(500, { success: false, message });
		}
	},

	unflagComment: async ({ request, locals }) => {
		const demoTime = await checkDemoTime(locals.supabase);
		const isDemo = demoTime === true;

		await validateAdmin(locals.session, isDemo, locals.supabase);

		if (isDemo) {
			return fail(400, {
				success: false,
				message: 'Moderation actions are unavailable while demo mode is enabled'
			});
		}

		const body = Object.fromEntries(await request.formData());
		const parsedBody = commentActionSchema.safeParse(body);
		if (!parsedBody.success) {
			return fail(400, {
				success: false,
				message: parsedBody.error.issues[0]?.message ?? 'Invalid comment ID'
			});
		}

		const { commentId } = parsedBody.data;
		const clearedAt = new Date().toISOString();

		try {
			const { data: updatedFlags, error: unflagError } = await locals.supabase
				.from('flagged_comments')
				.update({ cleared_at: clearedAt })
				.eq('comment_id', commentId)
				.is('removed_at', null)
				.is('cleared_at', null)
				.select('id');

			if (unflagError) throw new Error('Failed to unflag comment');
			if (!updatedFlags?.length) {
				return fail(409, { success: false, message: 'This flag is no longer pending review' });
			}

			const { data: comment, error: restoredError } = await locals.supabase
				.from('comments')
				.update({ removed: false, removed_at: null })
				.eq('id', commentId)
				.select('parent_id, parent_type')
				.single();

			if (restoredError || !comment) {
				const flagIds = updatedFlags.map((flag) => flag.id);
				const { error: rollbackError } = await locals.supabase
					.from('flagged_comments')
					.update({ cleared_at: null })
					.in('id', flagIds)
					.eq('cleared_at', clearedAt);

				if (rollbackError) console.error('Failed to roll back flag approval:', rollbackError);
				throw new Error('Failed to restore comment');
			}

			const countsUpdated = await updateCommentCounts(comment, false, locals.supabase);

			return {
				success: true,
				warning: countsUpdated
					? undefined
					: 'Comment approved, but its parent comment count could not be refreshed'
			};
		} catch (e) {
			console.error('Error in unflagComment action:', e);
			const message = e instanceof Error ? e.message : 'Failed to unflag comment';
			return fail(500, { success: false, message });
		}
	}
};
