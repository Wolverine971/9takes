// src/routes/admin/users/+page.server.ts
import type { PageServerLoad } from './$types';
import { createHash } from 'node:crypto';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { checkDemoTime } from '../../../utils/api';
import { mapDemoValues } from '../../../utils/demo';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { adminUpdateAdminStatusSchema, adminUsersQuerySchema } from '$lib/validation/schemas';
import { guardAdminActions } from '$lib/server/adminAuth';
import { setAdminStatusSafely } from '$lib/server/adminUserAccess';
import { z } from 'zod';
import { logger } from '$lib/utils/logger';
import { loadAdminEnneagramDistribution } from '$lib/server/adminAnalytics';

const USER_DETAIL_LIMIT = 10;
const ADMIN_USER_PAGE_SIZE = 100;
const ADMIN_SIGNUP_PAGE_SIZE = 100;
const SIGNUP_AUTH_EVENT_WINDOW_MS = 10 * 60 * 1000;
const SIGNUP_AUTH_EVENT_LOOKBACK_DAYS = 30;

const adminUserDetailsSchema = z.object({
	userId: z.string().uuid()
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

type SignupRow = {
	id: number;
	email: string | null;
	name: string | null;
	created_at: string | null;
	unsubscribed_date: string | null;
	first_visit_at: string | null;
	first_landing_path: string | null;
	first_acquisition_source: string | null;
	first_referrer_host: string | null;
	first_entry_surface: string | null;
	first_touch_fingerprint: string | null;
};

type SignupSecuritySignal = 'quarantined' | 'high_risk' | 'review' | 'looks_real' | 'normal';

type SignupWithSignals = SignupRow & {
	isSuppressed: boolean;
	suppressionReason: string | null;
	suppressedAt: string | null;
	authEventCount: number;
	loginFailedCount: number;
	registerHoneypotCount: number;
	forgotBlockedCount: number;
	signupSignal: SignupSecuritySignal;
	signupSignalReason: string;
};

function normalizeEmailText(email?: string | null): string {
	return email?.trim().toLowerCase() ?? '';
}

function hashEmail(email: string): string {
	return createHash('sha256').update(email).digest('hex');
}

function getSignupSignal(signup: {
	isSuppressed: boolean;
	suppressionReason: string | null;
	authEventCount: number;
	loginFailedCount: number;
	registerHoneypotCount: number;
	forgotBlockedCount: number;
	first_acquisition_source: string | null;
	first_landing_path: string | null;
}): { signal: SignupSecuritySignal; reason: string } {
	if (signup.isSuppressed) {
		return {
			signal: 'quarantined',
			reason: signup.suppressionReason || 'Suppressed from email sends'
		};
	}

	if (
		signup.registerHoneypotCount > 0 ||
		(signup.loginFailedCount > 0 && signup.forgotBlockedCount > 0)
	) {
		return {
			signal: 'high_risk',
			reason: 'Strong nearby auth-abuse evidence'
		};
	}

	if (signup.loginFailedCount >= 2 || signup.authEventCount > 0) {
		return {
			signal: 'review',
			reason: 'Nearby auth failures'
		};
	}

	if (signup.first_acquisition_source?.startsWith('search/') && signup.first_landing_path) {
		return {
			signal: 'looks_real',
			reason: 'Search/content signup with no nearby auth abuse'
		};
	}

	return {
		signal: 'normal',
		reason: signup.first_landing_path ? 'Content signup with no nearby auth abuse' : 'No signal'
	};
}

async function attachSignupSignals(signups: SignupRow[]): Promise<SignupWithSignals[]> {
	if (signups.length === 0) return [];

	const normalizedEmails = [
		...new Set(signups.map((signup) => normalizeEmailText(signup.email)).filter(Boolean))
	];
	const hashByEmail = new Map(normalizedEmails.map((email) => [email, hashEmail(email)]));
	const hashSet = [...new Set([...hashByEmail.values()])];
	const lookbackStart = new Date(
		Date.now() - SIGNUP_AUTH_EVENT_LOOKBACK_DAYS * 24 * 60 * 60 * 1000
	).toISOString();
	const adminSupabase = getSupabaseAdminClient() as any;

	const [unsubscribesResult, authEventsResult] = await Promise.all([
		normalizedEmails.length
			? adminSupabase
					.from('email_unsubscribes')
					.select('email, reason, source, source_id, unsubscribed_at')
					.in('email', normalizedEmails)
			: Promise.resolve({ data: [], error: null }),
		hashSet.length
			? adminSupabase
					.from('auth_security_events')
					.select('identifier_hash, flow, outcome, created_at')
					.in('identifier_hash', hashSet)
					.gte('created_at', lookbackStart)
			: Promise.resolve({ data: [], error: null })
	]);

	if (unsubscribesResult.error) {
		logger.warn('Failed to load signup unsubscribe signals', {
			error: unsubscribesResult.error
		});
	}

	if (authEventsResult.error) {
		logger.warn('Failed to load signup auth-abuse signals', {
			error: authEventsResult.error
		});
	}

	const unsubscribeByEmail = new Map<
		string,
		{ reason: string | null; unsubscribed_at: string | null }
	>();
	for (const row of unsubscribesResult.data ?? []) {
		const email = normalizeEmailText(row.email);
		if (!email) continue;
		unsubscribeByEmail.set(email, {
			reason: row.reason ?? null,
			unsubscribed_at: row.unsubscribed_at ?? null
		});
	}

	const authEventsByHash = new Map<
		string,
		{ flow: string | null; outcome: string | null; created_at: string | null }[]
	>();
	for (const event of authEventsResult.data ?? []) {
		if (!event.identifier_hash) continue;
		const existing = authEventsByHash.get(event.identifier_hash) ?? [];
		existing.push(event);
		authEventsByHash.set(event.identifier_hash, existing);
	}

	return signups.map((signup) => {
		const normalizedEmail = normalizeEmailText(signup.email);
		const emailHash = hashByEmail.get(normalizedEmail);
		const signupTime = signup.created_at ? new Date(signup.created_at).getTime() : 0;
		const nearbyEvents =
			emailHash && signupTime
				? (authEventsByHash.get(emailHash) ?? []).filter((event) => {
						const eventTime = event.created_at ? new Date(event.created_at).getTime() : 0;
						return eventTime > 0 && Math.abs(eventTime - signupTime) <= SIGNUP_AUTH_EVENT_WINDOW_MS;
					})
				: [];
		const suppression = unsubscribeByEmail.get(normalizedEmail);
		const isSuppressed = Boolean(signup.unsubscribed_date || suppression);
		const loginFailedCount = nearbyEvents.filter(
			(event) => event.flow === 'login' && event.outcome === 'failed'
		).length;
		const registerHoneypotCount = nearbyEvents.filter(
			(event) => event.flow === 'register' && event.outcome === 'honeypot'
		).length;
		const forgotBlockedCount = nearbyEvents.filter(
			(event) =>
				event.flow === 'forgot_password' &&
				['captcha_failed', 'honeypot', 'rate_limited'].includes(event.outcome ?? '')
		).length;
		const signal = getSignupSignal({
			isSuppressed,
			suppressionReason: suppression?.reason ?? null,
			authEventCount: nearbyEvents.length,
			loginFailedCount,
			registerHoneypotCount,
			forgotBlockedCount,
			first_acquisition_source: signup.first_acquisition_source,
			first_landing_path: signup.first_landing_path
		});

		return {
			...signup,
			isSuppressed,
			suppressionReason: suppression?.reason ?? null,
			suppressedAt: suppression?.unsubscribed_at ?? signup.unsubscribed_date,
			authEventCount: nearbyEvents.length,
			loginFailedCount,
			registerHoneypotCount,
			forgotBlockedCount,
			signupSignal: signal.signal,
			signupSignalReason: signal.reason
		};
	});
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

	const readPage = (name: string) => {
		const value = Number.parseInt(event.url.searchParams.get(name) ?? '1', 10);
		return Number.isSafeInteger(value) && value > 0 ? value : 1;
	};
	const userQuery = adminUsersQuerySchema.parse({
		search: event.url.searchParams.get('q') ?? undefined,
		filter: event.url.searchParams.get('filter') ?? undefined,
		sort: event.url.searchParams.get('sort') ?? undefined,
		direction: event.url.searchParams.get('dir') ?? undefined,
		profilePage: event.url.searchParams.get('profilePage') ?? undefined
	});
	const profilePage = userQuery.profilePage;
	const signupPage = readPage('signupPage');
	const profileOffset = (profilePage - 1) * ADMIN_USER_PAGE_SIZE;
	const signupOffset = (signupPage - 1) * ADMIN_SIGNUP_PAGE_SIZE;
	const profileTable = demo_time === true ? 'profiles_demo' : 'profiles';

	const [profilesResult, profileCountResult, adminCountResult, typedCountResult, distribution] =
		await Promise.all([
			supabase.rpc('get_admin_users_page', {
				p_search: userQuery.search,
				p_filter: userQuery.filter,
				p_sort_by: userQuery.sort,
				p_sort_direction: userQuery.direction,
				p_limit: ADMIN_USER_PAGE_SIZE,
				p_offset: profileOffset
			}),
			supabase.from(profileTable).select('id', { count: 'exact', head: true }),
			supabase.from(profileTable).select('id', { count: 'exact', head: true }).eq('admin', true),
			supabase
				.from(profileTable)
				.select('id', { count: 'exact', head: true })
				.not('enneagram', 'is', null),
			loadAdminEnneagramDistribution(supabase as any, {
				demoTime: demo_time === true,
				profilesTable: profileTable
			})
		]);
	const { data: profiles, error: profilesError } = profilesResult;
	const filteredProfileCount = profiles?.[0]?.total_rows ?? 0;

	if (
		profilesError ||
		profileCountResult.error ||
		adminCountResult.error ||
		typedCountResult.error
	) {
		logger.error(
			'Failed to load paginated admin users',
			(profilesError ||
				profileCountResult.error ||
				adminCountResult.error ||
				typedCountResult.error) as Error
		);
		throw error(500, { message: 'Failed to load users' });
	}

	if ((profiles?.length ?? 0) === 0 && profilePage > 1) {
		const { data: firstFilteredProfile, error: firstFilteredProfileError } = await supabase.rpc(
			'get_admin_users_page',
			{
				p_search: userQuery.search,
				p_filter: userQuery.filter,
				p_sort_by: userQuery.sort,
				p_sort_direction: userQuery.direction,
				p_limit: 1,
				p_offset: 0
			}
		);

		if (firstFilteredProfileError) {
			logger.error('Failed to validate admin user page bounds', firstFilteredProfileError as Error);
			throw error(500, { message: 'Failed to load users' });
		}

		if ((firstFilteredProfile?.[0]?.total_rows ?? 0) > 0) {
			const canonicalUrl = new URL(event.url);
			canonicalUrl.searchParams.delete('profilePage');
			throw redirect(303, `${canonicalUrl.pathname}${canonicalUrl.search}`);
		}
	}
	const {
		data: signups,
		error: signupsError,
		count: signupCount
	} = await supabase
		.from('signups')
		.select(
			'id, email, name, created_at, unsubscribed_date, first_visit_at, first_landing_path, first_acquisition_source, first_referrer_host, first_entry_surface, first_touch_fingerprint',
			{ count: 'exact' }
		)
		.order('created_at', { ascending: false })
		.range(signupOffset, signupOffset + ADMIN_SIGNUP_PAGE_SIZE - 1);

	if (signupsError) {
		logger.error('Failed to load paginated email signups', signupsError as Error);
		throw error(500, { message: 'Failed to load email signups' });
	}
	const signupsWithSignals = await attachSignupSignals((signups ?? []) as SignupRow[]);

	if (!findUserError) {
		return {
			user: mapDemoValues(user),
			profiles: mapDemoValues(profiles),
			signups: signupsWithSignals,
			demoTime: demo_time,
			profileStats: {
				total: profileCountResult.count ?? 0,
				admins: adminCountResult.count ?? 0,
				withType: typedCountResult.count ?? 0,
				enneagramDistribution: distribution
			},
			profilePagination: {
				page: profilePage,
				limit: ADMIN_USER_PAGE_SIZE,
				total: filteredProfileCount,
				totalPages: Math.max(1, Math.ceil(filteredProfileCount / ADMIN_USER_PAGE_SIZE))
			},
			filters: {
				search: userQuery.search,
				filter: userQuery.filter,
				sort: userQuery.sort,
				direction: userQuery.direction
			},
			signupPagination: {
				page: signupPage,
				limit: ADMIN_SIGNUP_PAGE_SIZE,
				total: signupCount ?? 0,
				totalPages: Math.max(1, Math.ceil((signupCount ?? 0) / ADMIN_SIGNUP_PAGE_SIZE))
			}
		};
	} else {
		throw error(404, {
			message: `Error searching for user`
		});
	}
};

export const actions: Actions = guardAdminActions({
	getUserDetails: async ({ request, locals }) => {
		try {
			const supabase = locals.supabase;
			const demo_time = await checkDemoTime(supabase);
			const isDemo = demo_time === true;

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

	updateAdmin: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());
		const parsed = adminUpdateAdminStatusSchema.safeParse(body);

		if (!parsed.success) {
			logger.warn('Admin status update validation failed', { errors: parsed.error.errors });
			return fail(400, { success: false, message: 'Invalid user or administrator status.' });
		}

		const { userId, isAdmin } = parsed.data;
		const result = await setAdminStatusSafely(locals.supabase, userId, isAdmin);

		if (!result.ok) {
			logger.warn('Admin status update rejected', {
				targetUserId: userId,
				isAdmin,
				status: result.status
			});
			return fail(result.status, { success: false, message: result.message });
		}

		logger.info('Admin status updated', {
			targetUserId: result.user.id,
			targetEmail: result.user.email,
			isAdmin: result.user.admin,
			updatedBy: locals.session?.user.id
		});
		return { success: true, user: result.user };
	}
});
