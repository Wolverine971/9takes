// src/lib/server/accountDashboard.ts
//
// Data layer for the /account dashboard.
//
// Design constraint that shaped this file: as of 2026-07-25 the platform has
// 149 profiles but only 29 have ever commented and 7 have ever asked a
// question, and 133 of 149 have enneagram = 'unknown'. A page that only
// mirrors the signed-in user's own activity renders empty for ~80% of them.
// So every section here has a defined non-empty state for a brand-new user:
// the community pulse, the question of the day, and the shared-type people row
// all work with zero personal history.
//
// Nothing in here depends on the notifications migration. Notifications are
// loaded separately and fail soft, so /account keeps working before
// 20260725_notifications.sql is applied.

import type { SupabaseClient } from '@supabase/supabase-js';
import { normalizePersonalitySlug } from '$lib/utils/personalityAnalysis';

/**
 * Demo mode swaps every table for a *_demo twin at runtime, so table names here
 * are plain strings and the generated Supabase types cannot narrow them. Same
 * `supabase as any` idiom already used in src/routes/users/[externalId].
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DynamicClient = any;

/** Type keys as used across the app (see getCommentTypeKey in the question page). */
export type TypeKey = string;

export interface AccountTables {
	profiles: string;
	questions: string;
	comments: string;
	commentLike: string;
}

export function resolveAccountTables(demoTime: boolean): AccountTables {
	return demoTime
		? {
				profiles: 'profiles_demo',
				questions: 'questions_demo',
				comments: 'comments_demo',
				commentLike: 'comment_like_demo'
			}
		: {
				profiles: 'profiles',
				questions: 'questions',
				comments: 'comments',
				commentLike: 'comment_like'
			};
}

export interface QuestionCandidate {
	id: number;
	question: string | null;
	question_formatted: string | null;
	url: string | null;
	comment_count: number | null;
	created_at: string | null;
	last_comment_date: string | null;
}

export interface QuestionOfTheDay {
	id: number;
	text: string;
	url: string;
	takeCount: number;
	/** Enneagram types ('1'..'9') that have already weighed in, ascending. */
	typesPresent: string[];
	/** True when nobody of the reader's own type has answered yet. */
	yourTypeMissing: boolean;
}

export interface SharedTypePerson {
	slug: string;
	name: string;
	personaTitle: string | null;
	imagePath: string;
}

export interface CommunityPulse {
	newQuestions7d: number;
	newTakes7d: number;
	activeTypes7d: string[];
	totalQuestions: number;
	totalTakes: number;
	/**
	 * Questions with no takes at all. Read from questions.comment_count rather
	 * than an anti-join against comments: the counter drifts on a handful of rows
	 * (8 of 413 as of 2026-07-25), which is well inside the tolerance for a
	 * display figure and far cheaper than counting comments per question.
	 */
	questionsAwaitingFirstTake: number;
}

/**
 * Whether the last 7 days are worth reporting as a pulse.
 *
 * The bar is the product's own claim — "one situation, nine ways to see it" —
 * so a week counts when several *different* types showed up, not merely when
 * the take counter moved. Twenty takes from a single type is not a pulse, and
 * rendering it as one flatters the number while misrepresenting the room.
 *
 * Below the bar the panel shows the opening instead (see the account page).
 * That is not a softer truth: with 87% of questions still unanswered, "your
 * take would be the first" describes the platform more accurately than a
 * 7-day counter reading zero. The panel flips back on its own once the room
 * clears the bar, so this needs no revisiting as the community grows.
 */
export function isRoomLively(pulse: Pick<CommunityPulse, 'newTakes7d' | 'activeTypes7d'>): boolean {
	return pulse.newTakes7d >= 8 && pulse.activeTypes7d.length >= 3;
}

export interface PersonalStats {
	takes: number;
	questions: number;
	repliesReceived: number;
	likesReceived: number;
}

export interface ActiveQuestion {
	id: number;
	text: string;
	url: string;
	recentTakes: number;
}

/**
 * Stable day index (UTC). Used to rotate daily picks without a stored table:
 * the same user gets the same question all day and a different one tomorrow.
 */
export function dayIndex(now: Date = new Date()): number {
	return Math.floor(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86_400_000
	);
}

/** Small deterministic string hash, so rotation differs per user. */
export function seedFrom(value: string): number {
	let hash = 0;
	for (let i = 0; i < value.length; i += 1) {
		hash = (hash << 5) - hash + value.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash);
}

/**
 * Deterministic rotating window over a list. Same inputs -> same output all
 * day, different slice tomorrow. Returns [] for an empty pool rather than
 * throwing, because every caller here has a legitimate empty case.
 */
export function rotateByDay<T>(items: T[], count: number, seed: number, day: number): T[] {
	if (!items.length || count <= 0) return [];
	if (items.length <= count) return [...items];

	const offset = (seed + day) % items.length;
	const out: T[] = [];
	for (let i = 0; i < count; i += 1) {
		out.push(items[(offset + i) % items.length]);
	}
	return out;
}

export function questionText(question: {
	question: string | null;
	question_formatted: string | null;
}): string {
	return (question.question_formatted || question.question || '').trim();
}

/**
 * Picks the reader's question for today.
 *
 * Ranking, in order:
 *   1. Questions the reader has not answered (hard filter — never re-ask).
 *   2. Questions where the reader's own type is absent from the thread. This is
 *      the whole pitch of the product ("one situation, nine ways to see it"),
 *      and it gives the CTA a concrete reason: "no Type 5 has weighed in yet".
 *   3. Questions that already have takes, so the reader lands on a live thread
 *      rather than an empty one.
 *
 * Within a tier the pick rotates daily so the page changes without a cron job
 * or a stored daily-pick table.
 */
export function pickQuestionOfTheDay(
	candidates: QuestionCandidate[],
	answeredQuestionIds: Set<number>,
	typesByQuestion: Map<number, Set<string>>,
	userType: string | null,
	seed: number,
	day: number
): QuestionOfTheDay | null {
	const unanswered = candidates.filter(
		(candidate) =>
			!answeredQuestionIds.has(candidate.id) && questionText(candidate) && candidate.url
	);

	if (!unanswered.length) return null;

	const hasRealType = Boolean(userType && /^[1-9]$/.test(userType));

	const scored = unanswered.map((candidate) => {
		const types = typesByQuestion.get(candidate.id) ?? new Set<string>();
		const typeMissing = hasRealType && !types.has(userType as string);
		const takes = types.size
			? Math.max(candidate.comment_count ?? 0, 0)
			: (candidate.comment_count ?? 0);

		return { candidate, types, typeMissing, takes };
	});

	// Tier 1: your type is missing AND the thread is already alive.
	// Tier 2: your type is missing.
	// Tier 3: anything alive.
	// Tier 4: anything at all.
	const tiers = [
		scored.filter((entry) => entry.typeMissing && entry.takes > 0),
		scored.filter((entry) => entry.typeMissing),
		scored.filter((entry) => entry.takes > 0),
		scored
	];

	const pool = tiers.find((tier) => tier.length > 0);
	if (!pool) return null;

	const [chosen] = rotateByDay(pool, 1, seed, day);
	if (!chosen) return null;

	return {
		id: chosen.candidate.id,
		text: questionText(chosen.candidate),
		url: chosen.candidate.url as string,
		takeCount: Math.max(chosen.candidate.comment_count ?? 0, 0),
		typesPresent: [...chosen.types].filter((type) => /^[1-9]$/.test(type)).sort(),
		yourTypeMissing: chosen.typeMissing
	};
}

interface CommentTypeRow {
	parent_id: number | null;
	author_id: string | null;
	created_at: string | null;
	profiles?: { enneagram: string | null } | null;
	profiles_demo?: { enneagram: string | null } | null;
}

/** Mirrors getCommentTypeKey() in the question page so vocabulary matches. */
function commentTypeKey(row: CommentTypeRow): TypeKey {
	if (!row.author_id) return 'rando';
	const enneagram = (row.profiles ?? row.profiles_demo)?.enneagram?.toString().trim();
	if (!enneagram) return 'unknown';
	return enneagram;
}

export function buildTypesByQuestion(rows: CommentTypeRow[]): Map<number, Set<string>> {
	const map = new Map<number, Set<string>>();
	for (const row of rows) {
		if (row.parent_id == null) continue;
		const key = commentTypeKey(row);
		if (!/^[1-9]$/.test(key)) continue;
		const existing = map.get(row.parent_id);
		if (existing) {
			existing.add(key);
		} else {
			map.set(row.parent_id, new Set([key]));
		}
	}
	return map;
}

/**
 * Famous people who share the reader's type. Pulls from the 391 published
 * personality analyses (24-68 per type), so unlike a "members who share your
 * type" section this is never empty and never shows the reader themselves.
 *
 * Rotates daily over the highest-quality analyses rather than always showing
 * the same top 6, so a returning user sees the corpus is deep.
 */
export async function loadSharedTypePeople(
	supabase: SupabaseClient,
	enneagram: string | null,
	seed: number,
	day: number,
	limit = 6
): Promise<SharedTypePerson[]> {
	if (!enneagram || !/^[1-9]$/.test(enneagram)) return [];

	const { data, error } = await supabase
		.from('blogs_famous_people')
		.select('person, persona_title, content_quality, enneagram')
		.eq('published', true)
		.eq('enneagram', enneagram)
		.order('content_quality', { ascending: false, nullsFirst: false })
		.limit(30);

	if (error || !data?.length) return [];

	const pool = (data as Array<{ person: string | null; persona_title: string | null }>)
		.filter((row) => Boolean(row.person))
		.map((row) => {
			const slug = normalizePersonalitySlug(row.person);
			return {
				slug,
				name: displayNameFromSlug(slug),
				personaTitle: row.persona_title,
				imagePath: `/types/${enneagram}s/s-${slug}.webp`
			};
		});

	return rotateByDay(pool, limit, seed, day);
}

function displayNameFromSlug(slug: string): string {
	return slug
		.split('-')
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

export async function loadCommunityPulse(
	supabase: SupabaseClient,
	tables: AccountTables
): Promise<CommunityPulse> {
	const db = supabase as DynamicClient;
	const since = new Date(Date.now() - 7 * 86_400_000).toISOString();

	const [newQuestions, newTakes, totalQuestions, totalTakes, awaitingFirstTake, recentTypeRows] =
		await Promise.all([
			db
				.from(tables.questions)
				.select('id', { count: 'exact', head: true })
				.eq('removed', false)
				.gt('created_at', since),
			db
				.from(tables.comments)
				.select('id', { count: 'exact', head: true })
				.eq('removed', false)
				.gt('created_at', since),
			db.from(tables.questions).select('id', { count: 'exact', head: true }).eq('removed', false),
			db.from(tables.comments).select('id', { count: 'exact', head: true }).eq('removed', false),
			db
				.from(tables.questions)
				.select('id', { count: 'exact', head: true })
				.eq('removed', false)
				.eq('comment_count', 0),
			db
				.from(tables.comments)
				.select(`author_id, ${tables.profiles} (enneagram)`)
				.eq('removed', false)
				.gt('created_at', since)
				.limit(500)
		]);

	const activeTypes = new Set<string>();
	for (const row of (recentTypeRows.data ?? []) as CommentTypeRow[]) {
		const key = commentTypeKey(row);
		if (/^[1-9]$/.test(key)) activeTypes.add(key);
	}

	return {
		newQuestions7d: newQuestions.count ?? 0,
		newTakes7d: newTakes.count ?? 0,
		activeTypes7d: [...activeTypes].sort(),
		totalQuestions: totalQuestions.count ?? 0,
		totalTakes: totalTakes.count ?? 0,
		questionsAwaitingFirstTake: awaitingFirstTake.count ?? 0
	};
}

export async function loadPersonalStats(
	supabase: SupabaseClient,
	tables: AccountTables,
	userId: string
): Promise<{ stats: PersonalStats; commentIds: number[] }> {
	const db = supabase as DynamicClient;

	const [ownComments, ownQuestions] = await Promise.all([
		db
			.from(tables.comments)
			.select('id, parent_type, like_count')
			.eq('author_id', userId)
			.eq('removed', false)
			.limit(1000),
		db
			.from(tables.questions)
			.select('id', { count: 'exact', head: true })
			.eq('author_id', userId)
			.eq('removed', false)
	]);

	const comments = (ownComments.data ?? []) as Array<{
		id: number;
		parent_type: string | null;
		like_count: number | null;
	}>;
	const commentIds = comments.map((comment) => comment.id);

	let repliesReceived = 0;
	if (commentIds.length) {
		const { count } = await db
			.from(tables.comments)
			.select('id', { count: 'exact', head: true })
			.eq('parent_type', 'comment')
			.eq('removed', false)
			.in('parent_id', commentIds)
			.neq('author_id', userId);
		repliesReceived = count ?? 0;
	}

	return {
		stats: {
			takes: comments.filter((comment) => comment.parent_type === 'question').length,
			questions: ownQuestions.count ?? 0,
			repliesReceived,
			likesReceived: comments.reduce(
				(total, comment) => total + Math.max(comment.like_count ?? 0, 0),
				0
			)
		},
		commentIds
	};
}

export interface YourTake {
	id: number;
	excerpt: string;
	questionText: string;
	questionUrl: string;
	createdAt: string;
	replyCount: number;
	likeCount: number;
}

interface OwnTakeRow {
	id: number;
	comment: string | null;
	parent_id: number | null;
	created_at: string | null;
	like_count: number | null;
}

/**
 * Assembles "your takes, and what came back".
 *
 * Separated from the queries so the assembly is unit-testable: a take is only
 * worth rendering when it has both text and a resolvable question, and the
 * ordering (newest first) is what makes the section read as a record rather
 * than a pile.
 */
export function buildYourTakes(
	comments: OwnTakeRow[],
	questionsById: Map<
		number,
		{ question: string | null; question_formatted: string | null; url: string | null }
	>,
	replyCountByCommentId: Map<number, number>,
	limit = 5
): YourTake[] {
	return comments
		.filter((row) => (row.comment ?? '').trim() && row.parent_id != null && row.created_at)
		.map((row) => {
			const question = questionsById.get(row.parent_id as number);
			if (!question?.url) return null;

			const text = questionText(question);
			if (!text) return null;

			return {
				id: row.id,
				excerpt: (row.comment as string).trim(),
				questionText: text,
				questionUrl: question.url,
				createdAt: row.created_at as string,
				replyCount: replyCountByCommentId.get(row.id) ?? 0,
				likeCount: Math.max(row.like_count ?? 0, 0)
			};
		})
		.filter((take): take is YourTake => take !== null)
		.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
		.slice(0, limit);
}

/**
 * The reader's own recent takes and the replies they drew.
 *
 * This is the strongest reactivation surface on the page: people come back for
 * their own words and the reply underneath them far more reliably than for a
 * community counter. Questions are fetched by id rather than joined, because
 * comments.parent_id is polymorphic (parent_type 'question' | 'comment') and so
 * carries no foreign key for PostgREST to traverse.
 */
export async function loadYourTakes(
	supabase: SupabaseClient,
	tables: AccountTables,
	userId: string,
	limit = 5
): Promise<YourTake[]> {
	const db = supabase as DynamicClient;

	const { data: own } = await db
		.from(tables.comments)
		.select('id, comment, parent_id, created_at, like_count')
		.eq('author_id', userId)
		.eq('parent_type', 'question')
		.eq('removed', false)
		.order('created_at', { ascending: false })
		.limit(limit);

	const ownTakes = (own ?? []) as OwnTakeRow[];
	if (!ownTakes.length) return [];

	const questionIds = [
		...new Set(ownTakes.map((row) => row.parent_id).filter((id): id is number => id != null))
	];
	const commentIds = ownTakes.map((row) => row.id);

	const [questions, replies] = await Promise.all([
		db.from(tables.questions).select('id, question, question_formatted, url').in('id', questionIds),
		db
			.from(tables.comments)
			.select('parent_id')
			.eq('parent_type', 'comment')
			.eq('removed', false)
			.in('parent_id', commentIds)
			.neq('author_id', userId)
	]);

	const questionsById = new Map(
		(
			(questions.data ?? []) as Array<{
				id: number;
				question: string | null;
				question_formatted: string | null;
				url: string | null;
			}>
		).map((row) => [row.id, row])
	);

	const replyCounts = new Map<number, number>();
	for (const row of (replies.data ?? []) as Array<{ parent_id: number | null }>) {
		if (row.parent_id == null) continue;
		replyCounts.set(row.parent_id, (replyCounts.get(row.parent_id) ?? 0) + 1);
	}

	return buildYourTakes(ownTakes, questionsById, replyCounts, limit);
}

/**
 * "Where the room is loudest right now" — the questions collecting the most
 * takes this week. This is the section that demonstrates liveliness to a user
 * with no activity of their own.
 */
export async function loadActiveQuestions(
	supabase: SupabaseClient,
	tables: AccountTables,
	limit = 3
): Promise<ActiveQuestion[]> {
	const db = supabase as DynamicClient;
	const since = new Date(Date.now() - 14 * 86_400_000).toISOString();

	const { data: recent } = await db
		.from(tables.comments)
		.select('parent_id')
		.eq('parent_type', 'question')
		.eq('removed', false)
		.gt('created_at', since)
		.limit(500);

	const counts = new Map<number, number>();
	for (const row of (recent ?? []) as Array<{ parent_id: number | null }>) {
		if (row.parent_id == null) continue;
		counts.set(row.parent_id, (counts.get(row.parent_id) ?? 0) + 1);
	}

	const topIds = [...counts.entries()]
		.sort((a, b) => b[1] - a[1])
		.slice(0, limit)
		.map(([id]) => id);

	if (!topIds.length) return [];

	const { data: questions } = await db
		.from(tables.questions)
		.select('id, question, question_formatted, url')
		.in('id', topIds)
		.eq('removed', false);

	return ((questions ?? []) as QuestionCandidate[])
		.filter((question) => question.url && questionText(question))
		.map((question) => ({
			id: question.id,
			text: questionText(question),
			url: question.url as string,
			recentTakes: counts.get(question.id) ?? 0
		}))
		.sort((a, b) => b.recentTakes - a.recentTakes);
}

export async function loadQuestionOfTheDay(
	supabase: SupabaseClient,
	tables: AccountTables,
	userId: string,
	userType: string | null,
	seed: number,
	day: number
): Promise<QuestionOfTheDay | null> {
	const db = supabase as DynamicClient;

	const [answered, candidates, typeRows] = await Promise.all([
		db
			.from(tables.comments)
			.select('parent_id')
			.eq('author_id', userId)
			.eq('parent_type', 'question')
			.limit(1000),
		db
			.from(tables.questions)
			.select('id, question, question_formatted, url, comment_count, created_at, last_comment_date')
			.eq('removed', false)
			.order('last_comment_date', { ascending: false, nullsFirst: false })
			.limit(120),
		db
			.from(tables.comments)
			.select(`parent_id, author_id, created_at, ${tables.profiles} (enneagram)`)
			.eq('parent_type', 'question')
			.eq('removed', false)
			.limit(1000)
	]);

	const answeredIds = new Set(
		((answered.data ?? []) as Array<{ parent_id: number | null }>)
			.map((row) => row.parent_id)
			.filter((id): id is number => id != null)
	);

	return pickQuestionOfTheDay(
		(candidates.data ?? []) as QuestionCandidate[],
		answeredIds,
		buildTypesByQuestion((typeRows.data ?? []) as CommentTypeRow[]),
		userType,
		seed,
		day
	);
}

// ---------------------------------------------------------------------------
// Notifications (fail-soft)
// ---------------------------------------------------------------------------

export interface NotificationRow {
	id: number;
	kind: string;
	actor_enneagram: string;
	question_id: number | null;
	question_text: string | null;
	question_url: string | null;
	comment_excerpt: string | null;
	created_at: string;
	read_at: string | null;
}

export interface NotificationFeed {
	items: NotificationRow[];
	unread: number;
	/** False when the notifications migration has not been applied yet. */
	available: boolean;
}

const EMPTY_FEED: NotificationFeed = { items: [], unread: 0, available: false };

/**
 * Loads the notification feed, degrading to an empty-but-valid feed when
 * 20260725_notifications.sql has not been applied. Migrations in this repo are
 * applied by hand, so the page must not 500 in the window between deploying
 * this code and running the SQL.
 */
export async function loadNotifications(
	supabase: SupabaseClient,
	limit = 20
): Promise<NotificationFeed> {
	try {
		const [feed, unread] = await Promise.all([
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(supabase.rpc as any)('get_notification_feed', { p_limit: limit }),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(supabase.rpc as any)('get_unread_notification_count')
		]);

		if (feed.error || unread.error) return EMPTY_FEED;

		return {
			items: (feed.data ?? []) as NotificationRow[],
			unread: typeof unread.data === 'number' ? unread.data : 0,
			available: true
		};
	} catch {
		return EMPTY_FEED;
	}
}

export interface NotificationPreferences {
	reply_to_take: boolean;
	take_on_your_question: boolean;
	take_on_answered_question: boolean;
	like_on_take: boolean;
	email_digest: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
	reply_to_take: true,
	take_on_your_question: true,
	take_on_answered_question: true,
	like_on_take: true,
	email_digest: true
};

export async function loadNotificationPreferences(
	supabase: SupabaseClient,
	userId: string
): Promise<NotificationPreferences> {
	try {
		const { data, error } = await supabase
			.from('notification_preferences')
			.select(
				'reply_to_take, take_on_your_question, take_on_answered_question, like_on_take, email_digest'
			)
			.eq('user_id', userId)
			.maybeSingle();

		if (error || !data) return { ...DEFAULT_NOTIFICATION_PREFERENCES };
		return data as NotificationPreferences;
	} catch {
		return { ...DEFAULT_NOTIFICATION_PREFERENCES };
	}
}
