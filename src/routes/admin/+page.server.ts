// src/routes/admin/+page.server.ts
import type { PageServerLoad } from './$types';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { checkDemoTime, invalidateDemoTimeCache } from '../../utils/api';
import {
	createESQuestion,
	bulkIndexQuestions,
	bulkIndexBlogs,
	indexWithRetry,
	recreateIndex,
	getQuestionIndexMapping,
	getBlogIndexMapping
} from '$lib/server/elasticSearch';
import type { Database } from '../../../database.types';
import { countRecentActiveContributors } from '$lib/server/adminAnalytics';
import {
	DEFAULT_TRENDING_BASELINE_DAYS,
	DEFAULT_TRENDING_MIN_UNIQUE,
	DEFAULT_TRENDING_MIN_VISITS,
	buildTrendingAnalyticsPayload,
	emptyTrendingAnalyticsPayload,
	loadTrendingAnalytics
} from '$lib/server/adminTrendingAnalytics';
import { buildAdminDataStatus } from '$lib/server/adminDataStatus';
import { loadEmailSuppressionStatus } from '$lib/server/emailSuppressionStatus';
import { normalizeEmail } from '$lib/email/suppression';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { cachedAdminQuery } from '$lib/server/adminQueryCache';
import {
	adminSnapshotKeys,
	freshSnapshotEntry,
	loadAdminDashboardSnapshot,
	type AdminDashboardSnapshot,
	type AdminSnapshotEntry
} from '$lib/server/adminDashboardSnapshot';
import { loadRouteDemoTime } from '$lib/server/demoTime';
import { getTalkNotesOverview } from '$lib/server/talkNotes';
import type {
	GrowthTrendWeek,
	GrowthTrendsPayload
} from '$lib/components/charts/GrowthTrends.svelte';

type QuestionRow = Database['public']['Tables']['questions']['Row'];
type RpcRows<Name extends keyof Database['public']['Functions']> =
	Database['public']['Functions'][Name]['Returns'];

// Honest weekly growth (human-filtered) — see the migration header for definitions.
const GROWTH_TRENDS_RPC = 'admin_engagement_trends_weekly_v2';
const GROWTH_TRENDS_MIGRATION =
	'supabase/migrations/20261002120000_admin_engagement_trends_weekly_v2.sql';
// 26 full weeks for the baseline, plus the current partial week.
const GROWTH_TRENDS_WEEKS = 27;

interface RateBlock {
	week_start: string | null;
	week_end: string | null;
	numerator: number;
	denominator: number;
	pct: number;
}

interface AdminRetentionSummary {
	available: boolean;
	newVisitorsThisWeek: number;
	currentWeekStart: string | null;
	currentWeekEnd: string | null;
	firstCommentRateLastFullWeek: RateBlock;
	emailSignupRateLastFullWeek: RateBlock;
	registeredRateLastFullWeek: RateBlock;
	d7RetentionLastMatureWeek: RateBlock;
	activeContributorsThisWeek: number;
}

const emptyRateBlock = (): RateBlock => ({
	week_start: null,
	week_end: null,
	numerator: 0,
	denominator: 0,
	pct: 0
});

function toNumber(value: unknown): number {
	return Number(value || 0);
}

function readRateBlock(value: unknown): RateBlock {
	if (!value || typeof value !== 'object') {
		return emptyRateBlock();
	}

	const block = value as Record<string, unknown>;
	return {
		week_start: typeof block.week_start === 'string' ? block.week_start : null,
		week_end: typeof block.week_end === 'string' ? block.week_end : null,
		numerator: toNumber(block.numerator),
		denominator: toNumber(block.denominator),
		pct: toNumber(block.pct)
	};
}

function normalizeRetentionSummary(value: unknown): AdminRetentionSummary {
	if (!value || typeof value !== 'object') {
		return {
			available: false,
			newVisitorsThisWeek: 0,
			currentWeekStart: null,
			currentWeekEnd: null,
			firstCommentRateLastFullWeek: emptyRateBlock(),
			emailSignupRateLastFullWeek: emptyRateBlock(),
			registeredRateLastFullWeek: emptyRateBlock(),
			d7RetentionLastMatureWeek: emptyRateBlock(),
			activeContributorsThisWeek: 0
		};
	}

	const summary = value as Record<string, unknown>;
	return {
		available: true,
		newVisitorsThisWeek: toNumber(summary.new_visitors_this_week),
		currentWeekStart:
			typeof summary.current_week_start === 'string' ? summary.current_week_start : null,
		currentWeekEnd: typeof summary.current_week_end === 'string' ? summary.current_week_end : null,
		firstCommentRateLastFullWeek: readRateBlock(summary.first_comment_rate_last_full_week),
		emailSignupRateLastFullWeek: readRateBlock(summary.email_signup_rate_last_full_week),
		registeredRateLastFullWeek: readRateBlock(summary.registered_rate_last_full_week),
		d7RetentionLastMatureWeek: readRateBlock(summary.d7_retention_last_mature_week),
		activeContributorsThisWeek: toNumber(summary.active_contributors_this_week)
	};
}

/** True when PostgREST/Postgres says the function doesn't exist (migration not applied yet). */
function isMissingRpc(err: unknown): boolean {
	if (!err || typeof err !== 'object') return false;
	const { code, message } = err as { code?: unknown; message?: unknown };
	return (
		code === 'PGRST202' ||
		code === '42883' ||
		String(message ?? '').includes('Could not find the function')
	);
}

function easternDaysIntoWeek(weekStart: string | undefined, now = new Date()): number {
	if (!weekStart) return 0;
	// en-CA formats as YYYY-MM-DD; weeks are bucketed in America/New_York by the RPC.
	const today = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'America/New_York',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(now);
	const elapsed =
		Math.round(
			(Date.parse(`${today}T00:00:00Z`) - Date.parse(`${weekStart}T00:00:00Z`)) / 86_400_000
		) + 1;
	return Math.min(7, Math.max(1, elapsed));
}

const withoutError = (result: { error: unknown }) => !result.error;

function isMissingRetentionSummaryRpc(err: unknown): boolean {
	const message =
		typeof err === 'object' && err !== null && 'message' in err
			? String((err as { message?: unknown }).message ?? '')
			: '';

	return message.includes('get_admin_retention_summary');
}

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;
	const supabase = event.locals.supabase;

	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}

	// The admin layout's guard runs inside parent(). Start the queries alongside it
	// rather than after it; it is awaited with them, before anything is returned.
	const parentPromise = event.parent();
	parentPromise.catch(() => {});
	const demo_time = await loadRouteDemoTime(supabase);

	// Pre-calculate date constants
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

	const profilesTable = demo_time === true ? 'profiles_demo' : 'profiles';
	const demoTime = demo_time === true;
	const trendingOptions = {
		baselineDays: DEFAULT_TRENDING_BASELINE_DAYS,
		minVisits: DEFAULT_TRENDING_MIN_VISITS,
		minUnique: DEFAULT_TRENDING_MIN_UNIQUE,
		limit: 10
	};

	// The four aggregate RPCs (30-day trends, retention, trending, weekly growth) scan
	// visitor tables and took 0.2-9s per visit. pg_cron precomputes them every 10
	// minutes (adminDashboardSnapshot); a missing or stale row falls back to the live
	// RPC, which adminQueryCache keeps warm. Demo mode always loads live.
	const snapshotPromise: Promise<AdminDashboardSnapshot> = demoTime
		? Promise.resolve(new Map())
		: loadAdminDashboardSnapshot(getSupabaseAdminClient() as any);
	const snapshotMeta: { refreshedAt: string | null } = { refreshedAt: null };
	const fromSnapshot = <Live, Snap>(
		key: string,
		live: () => Promise<Live>,
		fromEntry: (entry: AdminSnapshotEntry) => Snap
	): Promise<Live | Snap> =>
		snapshotPromise.then<Live | Snap>((snapshot) => {
			const entry = freshSnapshotEntry(snapshot, key);
			if (!entry) return live();
			// Report the oldest snapshot shown.
			const shown = snapshotMeta.refreshedAt;
			if (!shown || Date.parse(entry.refreshedAt) < Date.parse(shown)) {
				snapshotMeta.refreshedAt = entry.refreshedAt;
			}
			return fromEntry(entry);
		});

	const [
		dailyEngagementResult,
		dailyQuestionsResult,
		totalUsersResult,
		newUsersMonthResult,
		newUsersTodayResult,
		coachingWaitlistResult,
		coachingWaitlistUsersResult,
		recentSignupsResult,
		newEmailSignupsTodayResult,
		newEmailSignupsWeekResult,
		recentEmailSignupsResult,
		commentsTodayResult,
		retentionSummaryResult,
		trendingPagesResult,
		recentUnsubscribesResult,
		talkNotes,
		weeklyGrowthResult,
		parentData
	] = await Promise.all([
		fromSnapshot(
			adminSnapshotKeys.engagement30Days,
			() =>
				cachedAdminQuery(
					`admin_engagement_trends_30_days:${demoTime}`,
					async () =>
						await getSupabaseAdminClient().rpc('admin_engagement_trends_30_days', {
							p_demo_time: demoTime
						}),
					{ shouldCache: withoutError }
				),
			(entry) => ({
				data: entry.payload as RpcRows<'admin_engagement_trends_30_days'>,
				error: null
			})
		),
		supabase.rpc('daily_questions_stats'),
		// All-time totals can be estimated; exact filtered counts are kept for recent activity.
		supabase.from(profilesTable).select('id', { count: 'estimated', head: true }),
		supabase
			.from(profilesTable)
			.select('id', { count: 'exact', head: true })
			.gte('created_at', thirtyDaysAgo.toISOString()),
		supabase
			.from(profilesTable)
			.select('id', { count: 'exact', head: true })
			.gte('created_at', today.toISOString()),
		supabase.from('coaching_waitlist').select('id', { count: 'exact', head: true }),
		supabase
			.from('coaching_waitlist')
			.select('id, email, session_goal, created_at')
			.order('created_at', { ascending: false })
			.limit(6),
		supabase
			.from(profilesTable)
			.select('id, email, enneagram, created_at, external_id')
			.order('created_at', { ascending: false })
			.limit(8),
		supabase
			.from('signups')
			.select('id', { count: 'exact', head: true })
			.gte('created_at', today.toISOString()),
		supabase
			.from('signups')
			.select('id', { count: 'exact', head: true })
			.gte('created_at', sevenDaysAgo.toISOString()),
		supabase
			.from('signups')
			.select(
				'id, email, name, created_at, first_landing_path, first_acquisition_source, unsubscribed_date'
			)
			.order('created_at', { ascending: false })
			.limit(8),
		supabase
			.from('comments')
			.select('id', { count: 'exact', head: true })
			.gte('created_at', today.toISOString()),
		demoTime
			? Promise.resolve({ data: null, error: null })
			: fromSnapshot(
					adminSnapshotKeys.retentionSummary,
					() =>
						cachedAdminQuery<{ data: unknown; error: unknown }>(
							'get_admin_retention_summary',
							async () => await (supabase as any).rpc('get_admin_retention_summary'),
							{ shouldCache: withoutError }
						),
					(entry) => ({ data: entry.payload, error: null })
				),
		demoTime
			? Promise.resolve(null)
			: fromSnapshot(
					adminSnapshotKeys.trendingPages({ ...trendingOptions, scope: 'all' }),
					() =>
						cachedAdminQuery('get_page_analytics_trending_pages', () =>
							loadTrendingAnalytics(supabase as any, {
								...trendingOptions,
								scope: 'all'
							})
						),
					(entry) =>
						buildTrendingAnalyticsPayload(
							entry.payload,
							{ ...trendingOptions, now: new Date(entry.refreshedAt) },
							true
						)
				).catch((err) => {
					console.error('Failed to load admin trending pages', err);
					return emptyTrendingAnalyticsPayload(trendingOptions, false);
				}),
		demoTime
			? Promise.resolve({ data: [], error: null, count: 0 })
			: supabase
					.from('email_unsubscribes')
					.select('id, email, reason, source, source_id, unsubscribed_at', {
						count: 'exact'
					})
					.order('unsubscribed_at', { ascending: false })
					.limit(6),
		// "Talk to DJ" notes: real inbound regardless of demo mode.
		getTalkNotesOverview().catch((err) => {
			console.error('Failed to load Talk to DJ notes overview', err);
			return null;
		}),
		fromSnapshot(
			adminSnapshotKeys.weeklyGrowth(GROWTH_TRENDS_WEEKS),
			() =>
				cachedAdminQuery(
					`${GROWTH_TRENDS_RPC}:${demoTime}`,
					async () =>
						await getSupabaseAdminClient().rpc(GROWTH_TRENDS_RPC, {
							p_weeks: GROWTH_TRENDS_WEEKS,
							p_demo_time: demoTime
						}),
					{ shouldCache: withoutError }
				),
			(entry) => ({ data: entry.payload as RpcRows<typeof GROWTH_TRENDS_RPC>, error: null })
		),
		parentPromise
	]);

	const adminUser = parentData.user as unknown as { admin?: boolean } | null;
	if (!adminUser?.admin) {
		throw redirect(307, '/questions');
	}

	// Until the v2 migration is applied the RPC is missing; the dashboard falls back to
	// the raw 30-day admin_engagement_trends_30_days data without flagging an error.
	const growthTrendsMigrationPending = isMissingRpc(weeklyGrowthResult.error);
	if (weeklyGrowthResult.error && !growthTrendsMigrationPending) {
		console.error('Failed to load honest weekly growth trends', weeklyGrowthResult.error);
	}
	const growthTrendWeeks: GrowthTrendWeek[] = weeklyGrowthResult.error
		? []
		: (weeklyGrowthResult.data ?? []).map((week) => ({
				weekStart: week.week_start,
				humanVisitors: toNumber(week.human_visitors),
				returningHumanVisitors: toNumber(week.returning_human_visitors),
				rawVisitors: toNumber(week.raw_visitors),
				humanComments: toNumber(week.human_comments),
				rawComments: toNumber(week.raw_comments),
				contributors: toNumber(week.contributors),
				returningContributors: toNumber(week.returning_contributors),
				realSignups: toNumber(week.real_signups),
				rawSignups: toNumber(week.raw_signups),
				registrations: toNumber(week.registrations),
				rawRegistrations: toNumber(week.raw_registrations),
				bookings: toNumber(week.bookings),
				rawBookings: toNumber(week.raw_bookings),
				waitlistAdds: toNumber(week.waitlist_adds),
				talkNotes: toNumber(week.talk_notes),
				consultingSessions: toNumber(week.consulting_sessions)
			}));
	const growthTrends: GrowthTrendsPayload = {
		status: weeklyGrowthResult.error
			? growthTrendsMigrationPending
				? 'migration_pending'
				: 'unavailable'
			: 'ready',
		weeks: growthTrendWeeks,
		currentWeekDays: easternDaysIntoWeek(growthTrendWeeks.at(-1)?.weekStart),
		migration: GROWTH_TRENDS_MIGRATION
	};

	if (dailyEngagementResult.error) {
		console.error('Failed to load admin engagement trends', dailyEngagementResult.error);
	}
	const [visitorFallback, commentFallback] = dailyEngagementResult.error
		? await Promise.all([
				// Preserve the overview metrics until the new RPC is deployed.
				supabase.rpc('visitors_last_30_days'),
				supabase.rpc('comments_last_30_days')
			])
		: [null, null];
	if (visitorFallback?.error) {
		console.error('Failed to load fallback daily visitors', visitorFallback.error);
	}
	if (commentFallback?.error) {
		console.error('Failed to load fallback daily comments', commentFallback.error);
	}
	if (dailyQuestionsResult.error) {
		console.error('Failed to load admin daily question stats', dailyQuestionsResult.error);
	}
	if (newEmailSignupsTodayResult.error) {
		console.error('Failed to load admin email signups today', newEmailSignupsTodayResult.error);
	}
	if (newEmailSignupsWeekResult.error) {
		console.error('Failed to load admin email signups this week', newEmailSignupsWeekResult.error);
	}
	if (recentEmailSignupsResult.error) {
		console.error('Failed to load admin recent email signups', recentEmailSignupsResult.error);
	}
	if (recentUnsubscribesResult.error) {
		console.error('Failed to load admin recent unsubscribes', recentUnsubscribesResult.error);
	}

	const listedPeople = [
		...(coachingWaitlistUsersResult.data ?? []),
		...(recentSignupsResult.data ?? []),
		...(recentEmailSignupsResult.data ?? [])
	];
	const suppressionLookup = demoTime
		? { byEmail: new Map(), error: null }
		: await loadEmailSuppressionStatus(
				supabase,
				listedPeople.map((person) => person.email)
			);

	if (suppressionLookup.error) {
		console.error('Failed to load admin user unsubscribe status', suppressionLookup.error);
	}

	const withSuppressionStatus = <T extends { email?: string | null }>(rows: T[]) =>
		rows.map((row) => {
			const suppression = suppressionLookup.byEmail.get(normalizeEmail(row.email));
			return {
				...row,
				unsubscribed: Boolean(suppression),
				unsubscribed_at: suppression?.unsubscribedAt ?? null,
				unsubscribe_reason: suppression?.reason ?? null
			};
		});

	const retentionSummary =
		retentionSummaryResult.error && !isMissingRetentionSummaryRpc(retentionSummaryResult.error)
			? normalizeRetentionSummary(null)
			: normalizeRetentionSummary(retentionSummaryResult.data);

	if (retentionSummaryResult.error && !isMissingRetentionSummaryRpc(retentionSummaryResult.error)) {
		console.error('Failed to load admin retention summary', retentionSummaryResult.error);
	}

	const trending = trendingPagesResult ?? emptyTrendingAnalyticsPayload(trendingOptions, false);
	const dailyEngagement = (dailyEngagementResult.data ?? []).map((day) => ({
		days: day.days,
		visitors: toNumber(day.visitors),
		visitorsWithComments: toNumber(day.visitors_with_comments),
		coaching: toNumber(day.coaching),
		signups: toNumber(day.signups),
		userSignups: toNumber(day.user_signups),
		questionsAsked: toNumber(day.questions_asked),
		commentsCreated: toNumber(day.comments_created)
	}));
	const dataStatus = buildAdminDataStatus([
		{
			key: 'engagement-history',
			label: 'Traffic and participation',
			error: dailyEngagementResult.error
		},
		{
			key: 'growth-trends',
			label: 'Honest weekly growth',
			error: growthTrendsMigrationPending ? null : weeklyGrowthResult.error
		},
		{ key: 'visitor-history', label: 'Visitor history', error: visitorFallback?.error },
		{ key: 'comment-history', label: 'Comment history', error: commentFallback?.error },
		{ key: 'question-activity', label: 'Question activity', error: dailyQuestionsResult.error },
		{ key: 'user-total', label: 'User total', error: totalUsersResult.error },
		{ key: 'new-users-month', label: '30-day user growth', error: newUsersMonthResult.error },
		{ key: 'new-users-today', label: "Today's user growth", error: newUsersTodayResult.error },
		{ key: 'waitlist-total', label: 'Waitlist total', error: coachingWaitlistResult.error },
		{
			key: 'waitlist-recent',
			label: 'Recent waitlist entries',
			error: coachingWaitlistUsersResult.error
		},
		{ key: 'recent-users', label: 'Recent users', error: recentSignupsResult.error },
		{
			key: 'email-today',
			label: "Today's email signups",
			error: newEmailSignupsTodayResult.error
		},
		{
			key: 'email-week',
			label: '7-day email signups',
			error: newEmailSignupsWeekResult.error
		},
		{
			key: 'email-recent',
			label: 'Recent email signups',
			error: recentEmailSignupsResult.error
		},
		{
			key: 'email-unsubscribes',
			label: 'Email unsubscribe status',
			error: recentUnsubscribesResult.error || suppressionLookup.error
		},
		{ key: 'comments-today', label: "Today's comments", error: commentsTodayResult.error },
		{
			key: 'retention',
			label: 'Retention summary',
			error:
				retentionSummaryResult.error && !isMissingRetentionSummaryRpc(retentionSummaryResult.error)
					? retentionSummaryResult.error
					: null
		}
	]);

	let activeContributors = retentionSummary.activeContributorsThisWeek;
	if (!retentionSummary.available) {
		activeContributors = await countRecentActiveContributors(
			getSupabaseAdminClient() as any,
			sevenDaysAgo.toISOString()
		);
		retentionSummary.activeContributorsThisWeek = activeContributors;
	}

	return {
		demoTime: demo_time,
		dataStatus,
		dailyEngagement,
		dailyVisitors: dailyEngagementResult.error
			? (visitorFallback?.data ?? [])
			: dailyEngagement.map((day) => ({
					days: day.days,
					number_of_visitors: day.visitors
				})),
		dailyComments: dailyEngagementResult.error
			? (commentFallback?.data ?? [])
			: dailyEngagement.map((day) => ({
					days: day.days,
					number_of_comments: day.commentsCreated
				})),
		dailyQuestions: dailyQuestionsResult.error ? [] : dailyQuestionsResult.data,
		totalUsers: totalUsersResult.count || 0,
		newUsersMonth: newUsersMonthResult.count || 0,
		newUsersToday: newUsersTodayResult.count || 0,
		coachingWaitlist: coachingWaitlistResult.count || 0,
		talkNotes,
		coachingWaitlistUsers: withSuppressionStatus(coachingWaitlistUsersResult.data || []),
		activeContributors,
		recentSignups: withSuppressionStatus(recentSignupsResult.data || []),
		newEmailSignupsToday: newEmailSignupsTodayResult.count || 0,
		newEmailSignupsWeek: newEmailSignupsWeekResult.count || 0,
		recentEmailSignups: withSuppressionStatus(recentEmailSignupsResult.data || []),
		totalUnsubscribes: recentUnsubscribesResult.count || 0,
		recentUnsubscribes: recentUnsubscribesResult.data || [],
		commentsToday: commentsTodayResult.count || 0,
		retentionSummary,
		trending,
		growthTrends,
		// Oldest precomputed aggregate shown, or null when everything loaded live.
		analyticsRefreshedAt: snapshotMeta.refreshedAt
	};
};

export const actions: Actions = {
	toggleDemo: async (event) => {
		try {
			const session = event.locals.session;
			const supabase = event.locals.supabase;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}
			const demo_time = await checkDemoTime(supabase);

			const { data: user } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin, external_id')
				.eq('id', session?.user?.id)
				.single();

			if (!user?.admin) {
				throw error(400, 'unauthorized');
			}

			const newDemoTime = !demo_time;
			const { error: updateDemoError } = await supabase
				.from('admin_settings')
				.update({ value: newDemoTime })
				.eq('id', 2);
			// insert(userData);
			if (!updateDemoError) {
				invalidateDemoTimeCache();
				return { success: true };
			} else {
				throw error(500, {
					message: `Failed to update demo ${JSON.stringify(updateDemoError)}`
				});
			}
		} catch (e) {
			throw error(400, {
				message: `Failed to update demo ${JSON.stringify(e)}`
			});
		}
	},

	reindexEverything: async (event) => {
		try {
			const session = event.locals.session;
			const supabase = event.locals.supabase;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime(supabase);

			const { data: user } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin, external_id')
				.eq('id', session?.user?.id)
				.single();

			if (!user?.admin) {
				throw error(400, 'unauthorized');
			}

			console.log('Starting comprehensive reindexing...');

			const results = {
				questions: { indexed: 0, failed: 0, total: 0, errors: [] as any[] },
				blogs: { indexed: 0, failed: 0, total: 0, errors: [] as any[] }
			};

			// Step 1: Delete and recreate indices with proper mappings
			console.log('Deleting and recreating Elasticsearch indices...');
			try {
				// Recreate question index
				await recreateIndex('question', getQuestionIndexMapping());
				console.log('Question index recreated successfully');

				// Recreate blog index
				await recreateIndex('blog', getBlogIndexMapping());
				console.log('Blog index recreated successfully');

				// Wait a moment for indices to be fully ready
				await new Promise((resolve) => setTimeout(resolve, 1000));
			} catch (indexError) {
				console.error('Failed to recreate indices:', indexError);
				throw error(500, {
					message: `Failed to recreate Elasticsearch indices: ${indexError instanceof Error ? indexError.message : 'Unknown error'}`
				});
			}

			// Step 2: Reindex Questions with batch processing
			console.log('Reindexing questions...');
			const QUESTION_BATCH_SIZE = 100; // Reduced for safety
			let questionOffset = 0;
			let hasMoreQuestions = true;

			// First, get total count
			const { count: totalQuestions } = await supabase
				.from('questions')
				.select('id', { count: 'exact', head: true });

			results.questions.total = totalQuestions || 0;

			while (hasMoreQuestions) {
				// Fetch batch with author information
				const { data: questionBatch } = await supabase
					.from('questions')
					.select(
						'id, es_id, question, question_formatted, author_id, context, url, img_url, comment_count, flagged, removed, created_at, updated_at'
					)
					.order('created_at', { ascending: false })
					.range(questionOffset, questionOffset + QUESTION_BATCH_SIZE - 1);

				if (!questionBatch || questionBatch.length === 0) {
					hasMoreQuestions = false;
					break;
				}

				// Prepare questions for indexing (using existing data)
				const enrichedQuestions = (questionBatch as QuestionRow[]).map((q) => ({
					id: q.id,
					es_id: q.es_id ?? undefined,
					question: q.question ?? '',
					question_formatted: q.question_formatted ?? undefined,
					author_id: q.author_id ?? '',
					author_enneagram: '',
					author_name: '',
					context: q.context ?? '',
					url: q.url ?? '',
					img_url: q.img_url ?? null,
					comment_count: q.comment_count ?? 0,
					flagged: q.flagged ?? false,
					removed: q.removed ?? false,
					created_at: q.created_at,
					updated_at: q.updated_at ?? undefined
				}));

				// Use bulk indexing with retry
				const indexResult = await indexWithRetry(
					() => bulkIndexQuestions(enrichedQuestions),
					3,
					1000
				);

				results.questions.indexed += indexResult.indexed;
				results.questions.failed += indexResult.failed;
				results.questions.errors.push(...indexResult.errors);

				// Update Supabase with ES IDs for successfully indexed questions
				const successfulQuestions = enrichedQuestions.filter(
					(_, i) =>
						!indexResult.errors.find(
							(e: { questionId?: number }) => e.questionId === enrichedQuestions[i].id
						)
				);

				if (successfulQuestions.length > 0) {
					// Batch update es_id in Supabase
					for (const q of successfulQuestions) {
						await supabase
							.from('questions')
							.update({ es_id: q.es_id || `question_${q.id}` })
							.eq('id', q.id);
					}
				}

				console.log(
					`Processed questions ${questionOffset} to ${questionOffset + questionBatch.length}`
				);

				if (questionBatch.length < QUESTION_BATCH_SIZE) {
					hasMoreQuestions = false;
				}
				questionOffset += QUESTION_BATCH_SIZE;
			}

			// Step 3: Reindex Blog Posts
			console.log('Reindexing blog posts...');
			const BLOG_BATCH_SIZE = 20; // Much smaller batch size for blogs due to large content
			let blogOffset = 0;
			let hasMoreBlogs = true;

			// Get total blog count
			const { count: totalBlogs } = await supabase
				.from('blogs_famous_people')
				.select('id', { count: 'exact', head: true })
				.eq('published', true);

			results.blogs.total = totalBlogs || 0;

			while (hasMoreBlogs) {
				const { data: blogBatch } = await supabase
					.from('blogs_famous_people')
					.select(
						'id, title, person, content, description, author, enneagram, type, loc, meta_title, twitter, instagram, tiktok, wikipedia, published, created_at, lastmod'
					)
					.eq('published', true)
					.order('created_at', { ascending: false })
					.range(blogOffset, blogOffset + BLOG_BATCH_SIZE - 1);

				if (!blogBatch || blogBatch.length === 0) {
					hasMoreBlogs = false;
					break;
				}

				// Truncate large content fields to prevent 413 errors
				const processedBlogs = blogBatch.map((blog: any) => ({
					...blog,
					content: blog.content ? String(blog.content).substring(0, 10000) : '', // Limit to 10k chars
					description: blog.description ? String(blog.description).substring(0, 1000) : '' // Limit to 1k chars
				}));

				// Use bulk indexing for blogs
				const blogIndexResult = await indexWithRetry(() => bulkIndexBlogs(processedBlogs), 3, 1000);

				results.blogs.indexed += blogIndexResult.indexed;
				results.blogs.failed += blogIndexResult.failed;
				results.blogs.errors.push(...blogIndexResult.errors);

				console.log(`Processed blogs ${blogOffset} to ${blogOffset + blogBatch.length}`);

				if (blogBatch.length < BLOG_BATCH_SIZE) {
					hasMoreBlogs = false;
				}
				blogOffset += BLOG_BATCH_SIZE;
			}

			// Prepare summary
			const totalIndexed = results.questions.indexed + results.blogs.indexed;
			const totalFailed = results.questions.failed + results.blogs.failed;
			const totalDocuments = results.questions.total + results.blogs.total;

			const successMessage =
				totalFailed === 0
					? `Successfully reindexed all ${totalIndexed} documents (${results.questions.indexed} questions, ${results.blogs.indexed} blogs).`
					: `Reindexing completed with errors. Successfully indexed ${totalIndexed} out of ${totalDocuments} documents.`;

			console.log('Reindexing complete:', {
				questions: results.questions,
				blogs: results.blogs
			});

			return {
				success: totalFailed === 0,
				message: successMessage,
				details: {
					questions: {
						indexed: results.questions.indexed,
						failed: results.questions.failed,
						total: results.questions.total,
						errors: results.questions.errors.slice(0, 5) // First 5 errors
					},
					blogs: {
						indexed: results.blogs.indexed,
						failed: results.blogs.failed,
						total: results.blogs.total,
						errors: results.blogs.errors.slice(0, 5) // First 5 errors
					}
				},
				indexed: totalIndexed,
				failed: totalFailed,
				total: totalDocuments
			};
		} catch (e) {
			console.error('Reindexing failed:', e);
			throw error(500, {
				message: `Failed to reindex: ${e instanceof Error ? e.message : 'Unknown error'}`
			});
		}
	}
};
