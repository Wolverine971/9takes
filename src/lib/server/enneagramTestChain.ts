// src/lib/server/enneagramTestChain.ts
//
// The Enneagram test result's answer chain (growth bet #1, 2026-11-23): up to
// three questions in a row, each a real take behind the give-first gate, with an
// email capture after the second take.
//
// - pickChainQuestions: which three questions a result gets. The first is the
//   question the result page has always offered for the person's type, so the
//   chain starts where the single answer card used to.
// - Follows (enneagram_test_follows): every take posted from a result page is
//   followed by default. A follow unlocks that question on the result link from
//   any device, and, once the result has an opt-in email, drives the daily
//   "new takes on questions you answered" email.
// - processTakeDigests: that email. It carries question titles, counts and the
//   types people picked, never anyone's words, because the address was typed by
//   whoever held the result link and nobody confirmed it.

import { isTestType, withArticle } from '$lib/enneagramTest/content';
import type { TestType } from '$lib/enneagramTest/content';
import type { LiveTake } from '$lib/data/homepageLiveTake';
import type { LiveTakeTypes } from '$lib/data/homepageLiveTypes';
import { CHAIN_LENGTH } from '$lib/enneagramTest/chain';
import type { ChainQuestion, ChainStep, ChainView } from '$lib/enneagramTest/chain';
import { sendEmail, type SendEmailOptions, type SendEmailResult } from '$lib/email/sender';
import { getSuppressedEmailSet, normalizeEmail } from '$lib/email/suppression';
import {
	NOTIFY_EMAIL_CAP,
	TEST_RESULT_GATE_PATH,
	consumeTestEmailBudget,
	isResultToken,
	loadTestQuestionSources,
	questionsForTypesFromSources,
	testResultUrl,
	type TestQuestionLink
} from '$lib/server/enneagramTest';
import { resolveHostUserId } from '$lib/server/hostIdentity';
import { loadLiveTake, type LiveViewer } from '$lib/server/homepageLiveTake';
import { getLiveTakeTypes } from '$lib/server/homepageLiveTypes';
import { logger } from '$lib/utils/logger';

export { CHAIN_CAPTURE_AFTER, CHAIN_LENGTH } from '$lib/enneagramTest/chain';
export type { ChainQuestion, ChainStep, ChainView } from '$lib/enneagramTest/chain';

/** Pool the chain fills from after the per-type questions. */
const CHAIN_POOL_SIZE = 12;

const BASE_URL = 'https://9takes.com';

// The generated database types predate these tables; rows are typed here.
type Db = any;

export type FollowRow = {
	id: number;
	result_id: number;
	question_id: number;
	comment_id: number | null;
	fingerprint: string | null;
	user_id: string | null;
	step: number | null;
	last_seen_comment_id: number;
	last_notified_at: string | null;
};

type LiveTakeEvent = Parameters<typeof loadLiveTake>[0];

// ---------------------------------------------------------------------------
// Picking the questions
// ---------------------------------------------------------------------------

/**
 * Up to CHAIN_LENGTH distinct questions: each of the person's types' own
 * question first (in pick order), then the most-answered pool, starting at an
 * offset by the first type so different types walk different chains.
 */
export function pickChainQuestions(
	types: readonly TestType[],
	perType: Partial<Record<TestType, TestQuestionLink>>,
	pool: readonly TestQuestionLink[],
	length = CHAIN_LENGTH
): ChainQuestion[] {
	const chain: ChainQuestion[] = [];
	const seen = new Set<string>();
	const add = (link: TestQuestionLink, answeredAs: TestType | null) => {
		if (chain.length >= length || seen.has(link.url)) return;
		seen.add(link.url);
		chain.push({ id: link.id ?? null, url: link.url, question: link.question, answeredAs });
	};

	for (const type of types) {
		const link = perType[type];
		if (link) add(link, type);
	}
	if (pool.length) {
		const offset = types.length ? (types[0] - 1) % pool.length : 0;
		const fillAs = types.length === 1 ? types[0] : null;
		for (let index = 0; index < pool.length && chain.length < length; index += 1) {
			add(pool[(offset + index) % pool.length], fillAs);
		}
	}
	return chain;
}

/** A result's chain. Empty when the questions can't be read. */
export async function getChainQuestions(
	db: Db,
	types: readonly TestType[]
): Promise<ChainQuestion[]> {
	try {
		const sources = await loadTestQuestionSources(db, types, CHAIN_POOL_SIZE);
		return pickChainQuestions(types, questionsForTypesFromSources(types, sources), sources.pool);
	} catch (error) {
		logger.error('Failed to pick the Enneagram test answer chain', error as Error);
		return [];
	}
}

// ---------------------------------------------------------------------------
// Follows
// ---------------------------------------------------------------------------

/** The row behind a result token: its id and picks. Throws on a failed read. */
export async function getResultIdentity(
	db: Db,
	resultToken: string
): Promise<{ id: number; types: TestType[] } | null> {
	if (!isResultToken(resultToken)) return null;
	const { data, error } = await db
		.from('enneagram_test_results')
		.select('id, types')
		.eq('result_token', resultToken)
		.maybeSingle();
	if (error) throw new Error(error.message ?? 'Failed to load test result');
	if (!data) return null;
	const row = data as { id: number; types: unknown };
	const types = Array.isArray(row.types) ? row.types.map(Number).filter(isTestType) : [];
	return { id: row.id, types };
}

/** Follows for a result. Best effort: a missing table or failed read means none. */
export async function getFollows(db: Db, resultId: number): Promise<FollowRow[]> {
	try {
		const { data, error } = await db
			.from('enneagram_test_follows')
			.select(
				'id, result_id, question_id, comment_id, fingerprint, user_id, step, last_seen_comment_id, last_notified_at'
			)
			.eq('result_id', resultId);
		if (error) throw new Error(error.message ?? 'Failed to load follows');
		return (data ?? []) as FollowRow[];
	} catch (error) {
		logger.warn('Enneagram test follows unavailable', { resultId, error: String(error) });
		return [];
	}
}

/** Highest top-level take id on a question, so only takes after this moment count as new. */
async function latestTakeId(db: Db, questionId: number): Promise<number> {
	const { data } = await db
		.from('comments')
		.select('id')
		.eq('parent_type', 'question')
		.eq('parent_id', questionId)
		.order('id', { ascending: false })
		.limit(1);
	const id = Number((data as { id: number }[] | null)?.[0]?.id);
	return Number.isSafeInteger(id) ? id : 0;
}

/**
 * Follow a question this result just answered. Default-on: no email needed, and
 * an existing follow is left alone (its cursor keeps counting from the first take).
 * Best effort; the take is already posted.
 */
export async function recordFollow(
	db: Db,
	input: {
		resultId: number;
		questionId: number;
		commentId: number | null;
		fingerprint: string | null;
		userId: string | null;
		step: number | null;
	}
): Promise<void> {
	try {
		const cursor = input.commentId ?? (await latestTakeId(db, input.questionId));
		const { error } = await db.from('enneagram_test_follows').upsert(
			{
				result_id: input.resultId,
				question_id: input.questionId,
				comment_id: input.commentId,
				fingerprint: input.fingerprint?.slice(0, 100) || null,
				user_id: input.userId,
				step: input.step,
				last_seen_comment_id: cursor
			},
			{ onConflict: 'result_id,question_id', ignoreDuplicates: true }
		);
		if (error) throw new Error(error.message ?? 'Failed to save follow');
	} catch (error) {
		logger.warn('Enneagram test follow not saved', {
			resultId: input.resultId,
			questionId: input.questionId,
			error: String(error)
		});
	}
}

// ---------------------------------------------------------------------------
// Loading steps
// ---------------------------------------------------------------------------

function followViewer(follow: FollowRow | undefined): LiveViewer | undefined {
	if (!follow || (!follow.fingerprint && !follow.user_id)) return undefined;
	return { fingerprint: follow.fingerprint, userId: follow.user_id };
}

/**
 * One step's card. A followed question opens as the take's author (any device);
 * anything else goes through the visitor's own cookie and records gate_shown.
 */
export async function loadChainStep(
	event: LiveTakeEvent,
	question: ChainQuestion,
	follow?: FollowRow
): Promise<{ live: LiveTake | null; types: LiveTakeTypes | null }> {
	const live = await loadLiveTake(event, {
		slug: question.url,
		gatePath: TEST_RESULT_GATE_PATH,
		viewer: followViewer(follow)
	});
	const types = live ? await getLiveTakeTypes(live.questionId) : null;
	return { live, types };
}

/** The whole chain for the result page: done steps unlocked, the current one ready to answer. */
export async function loadChainView(
	event: LiveTakeEvent,
	questions: ChainQuestion[],
	follows: FollowRow[]
): Promise<ChainView> {
	const followByQuestion = new Map(follows.map((follow) => [follow.question_id, follow]));
	const followFor = (question: ChainQuestion) =>
		question.id === null ? undefined : followByQuestion.get(question.id);
	const current = questions.findIndex((question) => !followFor(question));
	const currentIndex = current === -1 ? questions.length : current;

	const steps = await Promise.all(
		questions.map(async (question, index): Promise<ChainStep> => {
			const follow = followFor(question);
			if (!follow && index !== currentIndex) {
				return { ...question, done: false, live: null, types: null };
			}
			const { live, types } = await loadChainStep(event, question, follow);
			return { ...question, done: Boolean(follow) || Boolean(live?.answered), live, types };
		})
	);
	return { steps, current: currentIndex };
}

// ---------------------------------------------------------------------------
// The "new takes" email
// ---------------------------------------------------------------------------

export type DigestQuestion = {
	title: string;
	newTakes: number;
	/** Types the new takes' authors picked for themselves, ascending, unique. */
	types: TestType[];
	/** New takes whose author never picked a type. */
	untyped: number;
	replies: number;
	hostReplied: boolean;
};

function escapeHtml(value: string): string {
	return value.replace(
		/[&<>"']/g,
		(char) =>
			({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] as string
	);
}

function count(value: number, one: string, many: string): string {
	return `${value} ${value === 1 ? one : many}`;
}

function listWithAnd(items: string[]): string {
	if (items.length <= 1) return items.join('');
	if (items.length === 2) return `${items[0]} and ${items[1]}`;
	return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/** "2 new takes: a 4 and an 8." / "1 new take from someone who didn't pick a type." */
export function describeDigestQuestion(item: DigestQuestion): string {
	const parts: string[] = [];
	if (item.newTakes > 0) {
		const who = [
			...item.types.map(withArticle),
			...(item.untyped > 0
				? [count(item.untyped, "person who didn't pick a type", "people who didn't pick a type")]
				: [])
		];
		parts.push(`${count(item.newTakes, 'new take', 'new takes')} from ${listWithAnd(who)}.`);
	}
	if (item.hostReplied) parts.push('DJ replied to your take.');
	else if (item.replies > 0) parts.push(`${count(item.replies, 'reply', 'replies')} to your take.`);
	return parts.join(' ');
}

export function buildTakeDigestEmail(input: { resultToken: string; questions: DigestQuestion[] }) {
	const resultUrl = `${testResultUrl(input.resultToken)}#answer-as`;
	const stopUrl = `${BASE_URL}/api/enneagram-test/stop/${encodeURIComponent(input.resultToken)}`;
	const first = input.questions[0];
	const anyHost = input.questions.some((item) => item.hostReplied);
	const subject =
		input.questions.length === 1
			? anyHost && first.newTakes === 0
				? `DJ replied to your take on “${first.title}”`
				: `New takes on “${first.title}”`
			: `New takes on ${input.questions.length} questions you answered`;
	const typed = [...new Set(input.questions.flatMap((item) => item.types))].sort((a, b) => a - b);
	const preheader = typed.length
		? `${listWithAnd(typed.map(withArticle))} answered after you.`
		: 'More people answered after you.';

	const htmlItems = input.questions
		.map(
			(item) =>
				`<li style="margin-bottom: 12px;"><strong>${escapeHtml(item.title)}</strong><br>${escapeHtml(describeDigestQuestion(item))}</li>`
		)
		.join('');
	const htmlContent = `<p>You answered before the crowd. Here’s who answered after you:</p>
<ul style="padding-left: 18px;">${htmlItems}</ul>
<p>Your result link has them unlocked, on any device.</p>
<p><a class="button" href="${resultUrl}">See the takes</a></p>
<p style="font-size: 13px; color: #69707a;">You’re getting this because you left your email on your 9takes test result. At most one of these a day. <a href="${stopUrl}">Stop these emails</a>.</p>`;

	const plainTextContent = `You answered before the crowd. Here’s who answered after you:

${input.questions.map((item) => `- ${item.title}\n  ${describeDigestQuestion(item)}`).join('\n')}

Your result link has them unlocked, on any device.
See the takes: ${resultUrl}

You’re getting this because you left your email on your 9takes test result. At most one of these a day.
Stop these emails: ${stopUrl}`;

	return { subject, preheader, htmlContent, plainTextContent, resultUrl, stopUrl };
}

type DigestResultRow = {
	id: number;
	result_token: string;
	notify_email: string | null;
	notify_sent_count: number | null;
};

type DigestFollowRow = FollowRow & { enneagram_test_results: DigestResultRow | null };

type CommentRow = {
	id: number;
	parent_type: string;
	parent_id: number;
	author_id: string | null;
	fingerprint: string | null;
};

export type TakeDigestDependencies = {
	send?: (options: SendEmailOptions) => Promise<SendEmailResult>;
	suppressedEmails?: (db: Db, emails: string[]) => Promise<Set<string>>;
	emailBudget?: (email: string) => Promise<boolean>;
	hostUserId?: string | null;
};

export type TakeDigestSummary = {
	results: number;
	sent: number;
	quiet: number;
	skipped: number;
	failed: number;
};

/** Follows whose result has an opt-in email, grouped by result. */
async function loadDigestFollows(db: Db, limit: number): Promise<Map<number, DigestFollowRow[]>> {
	const { data, error } = await db
		.from('enneagram_test_follows')
		.select(
			'id, result_id, question_id, comment_id, fingerprint, user_id, step, last_seen_comment_id, last_notified_at, enneagram_test_results!inner(id, result_token, notify_email, notify_sent_count)'
		)
		.not('enneagram_test_results.notify_email', 'is', null)
		.order('result_id', { ascending: true })
		.limit(limit);
	if (error) throw new Error(error.message ?? 'Failed to load follows for the digest');

	const byResult = new Map<number, DigestFollowRow[]>();
	for (const row of (data ?? []) as DigestFollowRow[]) {
		if (!row.enneagram_test_results) continue;
		const group = byResult.get(row.result_id) ?? [];
		group.push(row);
		byResult.set(row.result_id, group);
	}
	return byResult;
}

/** Each author's self-picked type: profile first, then the type picked on a test result take. */
async function resolveAuthorTypes(
	db: Db,
	takes: CommentRow[],
	slugByQuestion: Map<number, string>
): Promise<Map<number, TestType | null>> {
	const typeByComment = new Map<number, TestType | null>();
	const authorIds = [...new Set(takes.map((take) => take.author_id).filter(Boolean))] as string[];
	const profileType = new Map<string, TestType | null>();
	if (authorIds.length) {
		const { data } = await db.from('profiles').select('id, enneagram').in('id', authorIds);
		for (const row of (data ?? []) as { id: string; enneagram: unknown }[]) {
			const type = Number(row.enneagram);
			profileType.set(row.id, isTestType(type) ? type : null);
		}
	}

	const anonymous = takes.filter((take) => !take.author_id && take.fingerprint);
	const pickedType = new Map<string, TestType>();
	if (anonymous.length) {
		const slugs = [...new Set(anonymous.map((take) => slugByQuestion.get(take.parent_id)))].filter(
			Boolean
		) as string[];
		const fingerprints = [...new Set(anonymous.map((take) => take.fingerprint))] as string[];
		if (slugs.length && fingerprints.length) {
			const { data } = await db
				.from('nine_user_takes')
				.select('subject_slug, fingerprint, self_reported_type')
				.eq('subject_type', 'question')
				.in('subject_slug', slugs)
				.in('fingerprint', fingerprints)
				.not('self_reported_type', 'is', null);
			for (const row of (data ?? []) as {
				subject_slug: string;
				fingerprint: string;
				self_reported_type: unknown;
			}[]) {
				const type = Number(row.self_reported_type);
				if (isTestType(type)) pickedType.set(`${row.subject_slug}|${row.fingerprint}`, type);
			}
		}
	}

	for (const take of takes) {
		const fromProfile = take.author_id ? (profileType.get(take.author_id) ?? null) : null;
		const slug = slugByQuestion.get(take.parent_id);
		const fromTest =
			!take.author_id && take.fingerprint && slug
				? (pickedType.get(`${slug}|${take.fingerprint}`) ?? null)
				: null;
		typeByComment.set(take.id, fromProfile ?? fromTest);
	}
	return typeByComment;
}

function isOwn(row: CommentRow, follow: FollowRow): boolean {
	return (
		(follow.user_id !== null && row.author_id === follow.user_id) ||
		(follow.fingerprint !== null && row.fingerprint === follow.fingerprint) ||
		row.id === follow.comment_id
	);
}

/**
 * One digest email per result with something new: takes on a followed question
 * after the person's own, and replies to their take. Runs once a day from cron.
 * Shares the result's NOTIFY_EMAIL_CAP and daily send budget with the result and
 * friend-read emails.
 */
export async function processTakeDigests(
	db: Db,
	dependencies: TakeDigestDependencies = {},
	options: { followLimit?: number } = {}
): Promise<TakeDigestSummary> {
	const summary: TakeDigestSummary = { results: 0, sent: 0, quiet: 0, skipped: 0, failed: 0 };
	const byResult = await loadDigestFollows(db, options.followLimit ?? 1000);
	if (!byResult.size) return summary;

	const hostUserId =
		dependencies.hostUserId !== undefined ? dependencies.hostUserId : resolveHostUserId();
	const follows = [...byResult.values()].flat();
	const questionIds = [...new Set(follows.map((follow) => follow.question_id))];

	const { data: questionRows, error: questionError } = await db
		.from('questions')
		.select('id, url, question, question_formatted, flagged, removed')
		.in('id', questionIds);
	if (questionError) throw new Error(questionError.message ?? 'Failed to load digest questions');
	const questionById = new Map(
		(
			(questionRows ?? []) as {
				id: number;
				url: string | null;
				question: string | null;
				question_formatted: string | null;
				flagged: boolean | null;
				removed: boolean | null;
			}[]
		)
			.filter((row) => row.url && !row.flagged && !row.removed)
			.map((row) => [
				row.id,
				{ url: row.url as string, title: (row.question_formatted ?? row.question ?? '').trim() }
			])
	);
	const slugByQuestion = new Map([...questionById].map(([id, q]) => [id, q.url]));

	// Everything newer than the oldest cursor, in one read per kind.
	const minCursor = Math.min(...follows.map((follow) => follow.last_seen_comment_id ?? 0));
	const { data: takeRows, error: takeError } = await db
		.from('comments')
		.select('id, parent_type, parent_id, author_id, fingerprint')
		.eq('parent_type', 'question')
		.in('parent_id', [...questionById.keys()])
		.gt('id', minCursor)
		.eq('removed', false)
		.order('id', { ascending: true })
		.limit(2000);
	if (takeError) throw new Error(takeError.message ?? 'Failed to load new takes');
	const ownCommentIds = follows
		.map((follow) => follow.comment_id)
		.filter((id): id is number => id !== null);
	let replyRows: CommentRow[] = [];
	if (ownCommentIds.length) {
		const { data, error } = await db
			.from('comments')
			.select('id, parent_type, parent_id, author_id, fingerprint')
			.eq('parent_type', 'comment')
			.in('parent_id', ownCommentIds)
			.gt('id', minCursor)
			.eq('removed', false)
			.order('id', { ascending: true })
			.limit(2000);
		if (error) throw new Error(error.message ?? 'Failed to load new replies');
		replyRows = (data ?? []) as CommentRow[];
	}
	const takes = (takeRows ?? []) as CommentRow[];
	const typeByComment = await resolveAuthorTypes(db, takes, slugByQuestion);

	for (const [, group] of byResult) {
		summary.results += 1;
		const result = group[0].enneagram_test_results as DigestResultRow;
		const email = normalizeEmail(result.notify_email);

		const items: DigestQuestion[] = [];
		const cursors = new Map<number, number>();
		for (const follow of group) {
			const question = questionById.get(follow.question_id);
			if (!question) continue;
			const cursor = follow.last_seen_comment_id ?? 0;
			const newTakes = takes.filter(
				(row) => row.parent_id === follow.question_id && row.id > cursor && !isOwn(row, follow)
			);
			const replies =
				follow.comment_id === null
					? []
					: replyRows.filter(
							(row) => row.parent_id === follow.comment_id && row.id > cursor && !isOwn(row, follow)
						);
			if (!newTakes.length && !replies.length) continue;

			const types = newTakes
				.map((row) => typeByComment.get(row.id) ?? null)
				.filter((type): type is TestType => type !== null);
			items.push({
				title: question.title,
				newTakes: newTakes.length,
				types: [...new Set(types)].sort((a, b) => a - b),
				untyped: newTakes.length - types.length,
				replies: replies.length,
				hostReplied: Boolean(hostUserId) && replies.some((row) => row.author_id === hostUserId)
			});
			cursors.set(
				follow.id,
				Math.max(cursor, ...newTakes.map((row) => row.id), ...replies.map((row) => row.id))
			);
		}

		if (!items.length) {
			summary.quiet += 1;
			continue;
		}
		if (!email || (result.notify_sent_count ?? 0) >= NOTIFY_EMAIL_CAP) {
			summary.skipped += 1;
			continue;
		}

		try {
			const suppressed = await (dependencies.suppressedEmails ?? getSuppressedEmailSet)(db, [
				email
			]);
			if (suppressed.has(email)) {
				summary.skipped += 1;
				continue;
			}
			if (!(await (dependencies.emailBudget ?? consumeTestEmailBudget)(email))) {
				summary.skipped += 1;
				continue;
			}

			const message = buildTakeDigestEmail({ resultToken: result.result_token, questions: items });
			const sent = await (dependencies.send ?? sendEmail)({
				to: email,
				subject: message.subject,
				preheader: message.preheader,
				htmlContent: message.htmlContent,
				plainTextContent: message.plainTextContent,
				unsubscribeUrl: message.stopUrl,
				includeFooter: false,
				emailKind: 'transactional'
			});
			if (!sent.success) {
				logger.warn('Enneagram test take digest failed', { error: sent.error });
				summary.failed += 1;
				continue;
			}

			const now = new Date().toISOString();
			await db
				.from('enneagram_test_results')
				.update({ notify_sent_count: (result.notify_sent_count ?? 0) + 1 })
				.eq('id', result.id);
			for (const [followId, cursor] of cursors) {
				await db
					.from('enneagram_test_follows')
					.update({ last_seen_comment_id: cursor, last_notified_at: now })
					.eq('id', followId);
			}
			summary.sent += 1;
		} catch (error) {
			logger.error('Enneagram test take digest errored', error as Error);
			summary.failed += 1;
		}
	}
	return summary;
}
