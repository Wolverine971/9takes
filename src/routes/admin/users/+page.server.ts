// src/routes/admin/users/+page.server.ts
import type { PageServerLoad } from './$types';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { checkDemoTime } from '../../../utils/api';
import { tagQuestion } from '../../../utils/server/openai';
import { mapDemoValues } from '../../../utils/demo';
import { adminUserUpdateSchema, adminUpdateAdminStatusSchema } from '$lib/validation/schemas';
import { z } from 'zod';
import { logger } from '$lib/utils/logger';

const USER_DETAIL_LIMIT = 10;

const adminUserDetailsSchema = z.object({
	userId: z.string().min(1)
});

type UserActivityQuestion = {
	id: number;
	question: string | null;
	question_formatted: string | null;
	url: string | null;
	created_at: string | null;
	comment_count: number | null;
	removed: boolean | null;
};

type UserActivityComment = {
	id: number;
	source?: 'question' | 'blog';
	comment: string | null;
	created_at: string | null;
	parent_id: number | null;
	parent_type: string | null;
	like_count: number | null;
	comment_count: number | null;
	removed?: boolean | null;
	blog_link?: string | null;
	blog_type?: string | null;
	parentQuestion?: {
		id: number;
		question: string | null;
		question_formatted: string | null;
		url: string | null;
	} | null;
};

async function validateAdminAccess(
	supabase: App.Locals['supabase'],
	session: App.Locals['session'],
	demoTime: boolean
) {
	if (!session?.user?.id) {
		throw error(400, 'unauthorized');
	}

	const { data: user, error: findUserError } = await supabase
		.from(demoTime ? 'profiles_demo' : 'profiles')
		.select('id, admin, external_id')
		.eq('id', session.user.id)
		.single();

	if (findUserError) {
		logger.error('Admin user lookup failed', findUserError, { userId: session.user.id });
		throw error(404, { message: 'Error searching for user' });
	}

	if (!user?.admin) {
		throw redirect(307, '/questions');
	}

	return user;
}

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;
	const supabase = event.locals.supabase;

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

	const { data: profiles, error: profilesError } = await supabase.rpc('get_all_users');

	if (profilesError) {
		console.log(profilesError);
	}
	const { data: signups, error: signupsError } = await supabase
		.from('signups')
		.select('*')
		.order('created_at', { ascending: false });

	if (signupsError) {
		console.log(signupsError);
	}
	if (!findUserError) {
		return {
			user: mapDemoValues(user),
			profiles: mapDemoValues(profiles),
			signups,
			demoTime: demo_time
		};
	} else {
		throw error(404, {
			message: `Error searching for user`
		});
	}
};

export const actions: Actions = {
	getUserDetails: async ({ request, locals }) => {
		try {
			const session = locals?.session;
			const supabase = locals.supabase;
			const demo_time = await checkDemoTime(supabase);
			const isDemo = demo_time === true;

			await validateAdminAccess(supabase, session, isDemo);

			const body = Object.fromEntries(await request.formData());
			const parsed = adminUserDetailsSchema.safeParse(body);

			if (!parsed.success) {
				logger.warn('Admin user details validation failed', { errors: parsed.error.errors });
				return fail(400, { success: false, message: 'Invalid user id' });
			}

			const { userId } = parsed.data;
			const db = supabase as any;
			const profileTable = isDemo ? 'profiles_demo' : 'profiles';
			const questionTable = isDemo ? 'questions_demo' : 'questions';
			const commentTable = isDemo ? 'comments_demo' : 'comments';
			const profileFields = isDemo
				? 'id, email, username, first_name, last_name, enneagram, external_id, admin, canAskQuestion, avatar_url, created_at, website'
				: 'id, email, username, first_name, last_name, enneagram, external_id, admin, canAskQuestion, avatar_url, created_at, website, first_visit_at, first_landing_path, first_acquisition_source, first_referrer_host, first_entry_surface';
			const commentFields = isDemo
				? 'id, comment, created_at, parent_id, parent_type, like_count, comment_count'
				: 'id, comment, created_at, parent_id, parent_type, like_count, comment_count, removed';

			const [
				profileResult,
				questionsResult,
				commentsResult,
				blogCommentsResult,
				lastVisitResult,
				visitCountResult
			] = await Promise.all([
				db.from(profileTable).select(profileFields).eq('id', userId).single(),
				db
					.from(questionTable)
					.select('id, question, question_formatted, url, created_at, comment_count, removed', {
						count: 'exact'
					})
					.eq('author_id', userId)
					.order('created_at', { ascending: false })
					.limit(USER_DETAIL_LIMIT),
				db
					.from(commentTable)
					.select(commentFields, { count: 'exact' })
					.eq('author_id', userId)
					.order('created_at', { ascending: false })
					.limit(USER_DETAIL_LIMIT),
				db
					.from('blog_comments')
					.select('id, comment, created_at, blog_link, blog_type', { count: 'exact' })
					.eq('author_id', userId)
					.order('created_at', { ascending: false })
					.limit(USER_DETAIL_LIMIT),
				db
					.from('page_analytics_sessions')
					.select('last_seen_at, started_at, entry_path, exit_path, page_count')
					.eq('user_id', userId)
					.order('last_seen_at', { ascending: false })
					.limit(1)
					.maybeSingle(),
				db
					.from('page_analytics_sessions')
					.select('id', { count: 'exact', head: true })
					.eq('user_id', userId)
			]);

			if (profileResult.error) {
				logger.error('Failed to load admin user detail profile', profileResult.error, { userId });
				return fail(404, { success: false, message: 'User not found' });
			}

			if (questionsResult.error) {
				logger.error('Failed to load admin user questions', questionsResult.error, { userId });
				return fail(500, { success: false, message: 'Unable to load user questions' });
			}

			if (commentsResult.error) {
				logger.error('Failed to load admin user comments', commentsResult.error, { userId });
				return fail(500, { success: false, message: 'Unable to load user comments' });
			}

			if (blogCommentsResult.error) {
				logger.error('Failed to load admin user blog comments', blogCommentsResult.error, {
					userId
				});
				return fail(500, { success: false, message: 'Unable to load user comments' });
			}

			if (lastVisitResult.error) {
				logger.error('Failed to load admin user last visit', lastVisitResult.error, { userId });
			}

			if (visitCountResult.error) {
				logger.error('Failed to load admin user visit count', visitCountResult.error, { userId });
			}

			const comments: UserActivityComment[] = (
				(commentsResult.data ?? []) as UserActivityComment[]
			).map((comment) => ({
				...comment,
				source: 'question',
				parentQuestion: null
			}));
			const parentQuestionIds = [
				...new Set(
					comments
						.filter(
							(comment): comment is UserActivityComment & { parent_id: number } =>
								comment.parent_type === 'question' && typeof comment.parent_id === 'number'
						)
						.map((comment) => comment.parent_id)
				)
			];

			if (parentQuestionIds.length > 0) {
				const { data: parentQuestions, error: parentQuestionsError } = await db
					.from(questionTable)
					.select('id, question, question_formatted, url')
					.in('id', parentQuestionIds);

				if (parentQuestionsError) {
					logger.error('Failed to load admin user comment parent questions', parentQuestionsError, {
						userId
					});
				} else {
					const questionById = new Map<
						number,
						NonNullable<UserActivityComment['parentQuestion']>
					>();

					for (const question of (parentQuestions ?? []) as NonNullable<
						UserActivityComment['parentQuestion']
					>[]) {
						questionById.set(question.id, question);
					}

					for (const comment of comments) {
						if (comment.parent_type === 'question' && typeof comment.parent_id === 'number') {
							comment.parentQuestion = questionById.get(comment.parent_id) ?? null;
						}
					}
				}
			}

			const blogComments: UserActivityComment[] = (
				(blogCommentsResult.data ?? []) as Array<{
					id: number;
					comment: string | null;
					created_at: string | null;
					blog_link: string | null;
					blog_type: string | null;
				}>
			).map((comment) => ({
				id: comment.id,
				source: 'blog',
				comment: comment.comment,
				created_at: comment.created_at,
				parent_id: null,
				parent_type: 'blog',
				like_count: null,
				comment_count: null,
				blog_link: comment.blog_link,
				blog_type: comment.blog_type,
				parentQuestion: null
			}));
			const recentComments = [...comments, ...blogComments]
				.sort((a, b) => {
					const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
					const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
					return bTime - aTime;
				})
				.slice(0, USER_DETAIL_LIMIT);

			return {
				success: true,
				details: {
					profile: mapDemoValues(profileResult.data),
					counts: {
						questions: questionsResult.count ?? 0,
						comments: (commentsResult.count ?? 0) + (blogCommentsResult.count ?? 0),
						visits: visitCountResult.count ?? 0
					},
					lastVisit: lastVisitResult.data ?? null,
					recentQuestions: mapDemoValues((questionsResult.data ?? []) as UserActivityQuestion[]),
					recentComments: mapDemoValues(recentComments)
				}
			};
		} catch (e) {
			logger.error('Unexpected error in getUserDetails', e as Error);
			throw error(500, 'An unexpected error occurred');
		}
	},

	classifyQuestion: async ({ request, locals }) => {
		try {
			const session = locals?.session;
			const supabase = locals.supabase;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime(supabase);

			const { data: user, error: findUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin, external_id')
				.eq('id', session?.user?.id)
				.single();

			if (findUserError) {
				console.log(findUserError);
			}

			if (!user?.admin) {
				throw redirect(307, '/questions');
			}

			const body = Object.fromEntries(await request.formData());
			const questionId = body.questionId as string;
			const questionText = body.questionText as string;

			await tagQuestion(supabase, questionText, parseInt(questionId));
		} catch (e) {
			throw error(400, {
				message: `Failed to classify question ${JSON.stringify(e)}`
			});
		}
	},

	classifyAllUntaggedQuestions: async ({ request, locals }) => {
		try {
			const session = locals?.session;
			const supabase = locals.supabase;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime(supabase);

			const { data: user, error: findUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin, external_id')
				.eq('id', session?.user?.id)
				.single();

			if (findUserError) {
				console.log(findUserError);
			}

			if (!user?.admin) {
				throw redirect(307, '/questions');
			}

			const body = Object.fromEntries(await request.formData());
			const questionId = body.questionId as string;
			const questionText = body.questionText as string;

			await tagQuestion(supabase, questionText, parseInt(questionId));
		} catch (e) {
			throw error(400, {
				message: `Failed to classify question ${JSON.stringify(e)}`
			});
		}
	},

	updateUserAccount: async ({ request, locals }) => {
		try {
			const session = locals?.session;
			const supabase = locals.supabase;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime(supabase);

			const { data: user, error: findUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin, external_id')
				.eq('id', session?.user?.id)
				.single();

			if (findUserError) {
				console.log(findUserError);
			}

			if (!user?.admin) {
				throw redirect(307, '/questions');
			}

			const body = Object.fromEntries(await request.formData());

			// Validate input data
			let validatedData;
			try {
				validatedData = adminUserUpdateSchema.parse(body);
			} catch (e) {
				if (e instanceof z.ZodError) {
					logger.warn('Admin user update validation failed', { errors: e.errors });
					throw error(400, 'Invalid input data');
				}
				throw e;
			}

			const { firstName, lastName, enneagram, email } = validatedData;

			const { error: updateUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.update({
					first_name: firstName,
					last_name: lastName,
					enneagram: String(enneagram)
				})
				.eq('email', email);

			if (updateUserError) {
				logger.error('Failed to update user', updateUserError, { email });
				throw error(500, 'Failed to update user account');
			}

			logger.info('Admin updated user account', { email, adminId: session.user.id });
			return { success: true };
		} catch (e) {
			if (e instanceof Error && e.message.includes('Invalid input data')) {
				throw e;
			}
			logger.error('Unexpected error in updateUserAccount', e as Error);
			throw error(500, 'An unexpected error occurred');
		}
	},
	updateAdmin: async (event) => {
		try {
			const session = event.locals.session;
			const supabase = event.locals.supabase;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime(supabase);

			const { data: user, error: findUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin, external_id')
				.eq('id', session?.user?.id)
				.single();

			if (findUserError) {
				console.log(findUserError);
			}

			if (!user?.admin) {
				throw redirect(307, '/questions');
			}

			const { request } = event;

			const body = Object.fromEntries(await request.formData());

			// Validate input data
			let validatedData;
			try {
				validatedData = adminUpdateAdminStatusSchema.parse(body);
			} catch (e) {
				if (e instanceof z.ZodError) {
					logger.warn('Admin status update validation failed', { errors: e.errors });
					throw error(400, 'Invalid input data');
				}
				throw e;
			}

			const { email, isAdmin } = validatedData;

			const { error: updateUserToAdminError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.update({ admin: isAdmin })
				.eq('email', email);

			if (updateUserToAdminError) {
				logger.error('Failed to update admin status', updateUserToAdminError, { email, isAdmin });
				throw error(500, 'Failed to update admin status');
			}

			logger.info('Admin status updated', {
				targetEmail: email,
				isAdmin,
				updatedBy: session.user.id
			});
			return { success: true };
		} catch (e) {
			if (e instanceof Error && e.message.includes('Invalid input data')) {
				throw e;
			}
			logger.error('Unexpected error in updateAdmin', e as Error);
			throw error(500, 'An unexpected error occurred');
		}
	}
};
