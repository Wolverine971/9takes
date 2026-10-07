// src/lib/server/enneagramTest.ts
//
// Server side of the 9takes Enneagram test (T-42): saving a finished result,
// the friend-read loop ("ask someone who knows you"), the opt-in email when a
// friend answers, and picking a live question for the "answer as your type"
// exit. Tables: enneagram_test_results, enneagram_test_reads
// (supabase/migrations/20261006120000_enneagram_test.sql).
//
// Privacy: results are anonymous. A friend's link carries only the read
// token, and the test-taker's picks are returned to the friend only after
// the friend has answered (answer before the crowd).

import { randomBytes } from 'node:crypto';
import { z } from 'zod';

import {
	CURATED_QUESTION_SLUGS,
	TEST_TYPES,
	isTestType,
	typeListWithArticles,
	withArticle
} from '$lib/enneagramTest/content';
import type { Emotion, TestType } from '$lib/enneagramTest/content';
import { sendEmail, type SendEmailOptions, type SendEmailResult } from '$lib/email/sender';
import { getSuppressedEmailSet, normalizeEmail } from '$lib/email/suppression';
import { logger } from '$lib/utils/logger';

const BASE_URL = 'https://9takes.com';

/** Most friend-read emails one result can trigger. */
export const NOTIFY_EMAIL_CAP = 20;

export const RESULT_TOKEN_PATTERN = /^[A-Za-z0-9_-]{20,64}$/;
export const READ_TOKEN_PATTERN = /^[A-Za-z0-9_-]{10,64}$/;

export function generateToken(bytes: number): string {
	return randomBytes(bytes).toString('base64url');
}

export function isResultToken(value: string): boolean {
	return RESULT_TOKEN_PATTERN.test(value);
}

export function isReadToken(value: string): boolean {
	return READ_TOKEN_PATTERN.test(value);
}

// ---------------------------------------------------------------------------
// Input schemas
// ---------------------------------------------------------------------------

const emotionSchema = z.enum(['anger', 'shame', 'fear']);
const typeSchema = z.number().int().min(1).max(9);

/** Trims, strips control characters and collapses whitespace to one line. */
function cleanText(max: number) {
	return z
		.string()
		.transform((value) =>
			value
				.replace(/[\u0000-\u001f\u007f]/g, ' ')
				.replace(/\s+/g, ' ')
				.trim()
		)
		.pipe(z.string().max(max));
}

export const testResultInputSchema = z
	.object({
		types: z
			.array(typeSchema)
			.min(1)
			.max(2)
			.refine((types) => new Set(types).size === types.length, 'Types must be distinct'),
		emotion: emotionSchema,
		strength: emotionSchema,
		path: z
			.object({
				altPrompt: z.boolean(),
				mismatch: z.enum(['repick', 'both']).nullable(),
				noneFit: z.boolean(),
				tiebreak: z.enum(['one', 'both']).nullable()
			})
			.strict()
	})
	.strict();

export const testResultUpdateSchema = z
	.object({
		displayName: cleanText(40).optional(),
		notifyEmail: z
			.union([z.literal(''), z.string().trim().toLowerCase().email().max(254)])
			.optional()
	})
	.strict()
	.refine(
		(value) => value.displayName !== undefined || value.notifyEmail !== undefined,
		'Nothing to update'
	);

export const friendReadInputSchema = z
	.object({
		pickedType: typeSchema,
		emotion: emotionSchema,
		strength: emotionSchema,
		readerName: cleanText(40).optional().default(''),
		note: cleanText(280).optional().default('')
	})
	.strict();

export type TestResultInput = z.infer<typeof testResultInputSchema>;
export type TestResultUpdate = z.infer<typeof testResultUpdateSchema>;
export type FriendReadInput = z.infer<typeof friendReadInputSchema>;

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------

export type FriendReadView = {
	pickedType: TestType;
	readerName: string | null;
	note: string | null;
	createdAt: string;
};

export type TestResultView = {
	types: TestType[];
	emotion: Emotion;
	strength: Emotion;
	displayName: string | null;
	readToken: string;
	notifyOn: boolean;
	reads: FriendReadView[];
	createdAt: string;
};

export type TestQuestionLink = { url: string; question: string };

// The generated database types predate these tables; rows are typed here.
type Db = any;

type ResultRow = {
	id: number;
	created_at: string;
	result_token: string;
	read_token: string;
	types: number[];
	emotion: Emotion;
	strength: Emotion;
	display_name: string | null;
	notify_email: string | null;
	notify_sent_count: number;
};

type ReadRow = {
	picked_type: number;
	reader_name: string | null;
	note: string | null;
	created_at: string;
};

function toTypes(values: unknown): TestType[] {
	return Array.isArray(values) ? values.map(Number).filter(isTestType) : [];
}

function blankToNull(value: string | null | undefined): string | null {
	const trimmed = (value ?? '').trim();
	return trimmed ? trimmed : null;
}

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

/** Save a finished test. Returns the private result token and the friend link token. */
export async function createTestResult(
	db: Db,
	input: TestResultInput
): Promise<{ resultToken: string; readToken: string }> {
	for (let attempt = 0; attempt < 2; attempt += 1) {
		const resultToken = generateToken(18);
		const readToken = generateToken(9);
		const { error } = await db.from('enneagram_test_results').insert({
			result_token: resultToken,
			read_token: readToken,
			types: input.types,
			emotion: input.emotion,
			strength: input.strength,
			path: input.path
		});
		if (!error) return { resultToken, readToken };
		// 23505 = unique violation: a token collided. Try once more with new tokens.
		if (error.code !== '23505') throw new Error(error.message ?? 'Failed to save test result');
	}
	throw new Error('Failed to save test result: token collision');
}

export async function getTestResult(db: Db, resultToken: string): Promise<TestResultView | null> {
	if (!isResultToken(resultToken)) return null;

	const { data: row, error } = await db
		.from('enneagram_test_results')
		.select(
			'id, created_at, read_token, types, emotion, strength, display_name, notify_email, notify_sent_count'
		)
		.eq('result_token', resultToken)
		.maybeSingle();
	if (error) throw new Error(error.message ?? 'Failed to load test result');
	if (!row) return null;

	const result = row as ResultRow;
	const { data: readRows, error: readError } = await db
		.from('enneagram_test_reads')
		.select('picked_type, reader_name, note, created_at')
		.eq('result_id', result.id)
		.order('created_at', { ascending: true });
	if (readError) throw new Error(readError.message ?? 'Failed to load friend reads');

	return {
		types: toTypes(result.types),
		emotion: result.emotion,
		strength: result.strength,
		displayName: blankToNull(result.display_name),
		readToken: result.read_token,
		notifyOn: Boolean(result.notify_email),
		createdAt: result.created_at,
		reads: ((readRows ?? []) as ReadRow[])
			.filter((read) => isTestType(Number(read.picked_type)))
			.map((read) => ({
				pickedType: Number(read.picked_type) as TestType,
				readerName: blankToNull(read.reader_name),
				note: blankToNull(read.note),
				createdAt: read.created_at
			}))
	};
}

/** Save the name friends see, or opt in/out of read emails. Returns false if no such result. */
export async function updateTestResult(
	db: Db,
	resultToken: string,
	update: TestResultUpdate
): Promise<boolean> {
	if (!isResultToken(resultToken)) return false;

	const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
	if (update.displayName !== undefined) patch.display_name = blankToNull(update.displayName);
	if (update.notifyEmail !== undefined) {
		const email = normalizeEmail(update.notifyEmail);
		patch.notify_email = email || null;
		patch.notify_opted_in_at = email ? new Date().toISOString() : null;
	}

	const { data, error } = await db
		.from('enneagram_test_results')
		.update(patch)
		.eq('result_token', resultToken)
		.select('id')
		.maybeSingle();
	if (error) throw new Error(error.message ?? 'Failed to update test result');
	return Boolean(data);
}

/** The "Stop these emails" link. Returns false if no such result. */
export function stopTestNotifications(db: Db, resultToken: string): Promise<boolean> {
	return updateTestResult(db, resultToken, { notifyEmail: '' });
}

// ---------------------------------------------------------------------------
// Friend reads
// ---------------------------------------------------------------------------

/** What a friend's link may show before they answer: the name only, never the picks. */
export async function getReadContext(
	db: Db,
	readToken: string
): Promise<{ displayName: string | null } | null> {
	if (!isReadToken(readToken)) return null;
	const { data, error } = await db
		.from('enneagram_test_results')
		.select('display_name')
		.eq('read_token', readToken)
		.maybeSingle();
	if (error) throw new Error(error.message ?? 'Failed to load test link');
	if (!data) return null;
	return { displayName: blankToNull((data as { display_name: string | null }).display_name) };
}

export type FriendReadDependencies = {
	send?: (options: SendEmailOptions) => Promise<SendEmailResult>;
	suppressedEmails?: (db: Db, emails: string[]) => Promise<Set<string>>;
};

export type FriendReadOutcome = {
	/** The test-taker's own picks, revealed to the friend after they answer. */
	types: TestType[];
	displayName: string | null;
	notified: boolean;
};

export async function submitFriendRead(
	db: Db,
	readToken: string,
	input: FriendReadInput,
	dependencies: FriendReadDependencies = {}
): Promise<FriendReadOutcome | null> {
	if (!isReadToken(readToken)) return null;

	const { data: row, error } = await db
		.from('enneagram_test_results')
		.select('id, result_token, types, display_name, notify_email, notify_sent_count')
		.eq('read_token', readToken)
		.maybeSingle();
	if (error) throw new Error(error.message ?? 'Failed to load test link');
	if (!row) return null;
	const result = row as ResultRow;

	const { data: inserted, error: insertError } = await db
		.from('enneagram_test_reads')
		.insert({
			result_id: result.id,
			picked_type: input.pickedType,
			emotion: input.emotion,
			strength: input.strength,
			reader_name: blankToNull(input.readerName),
			note: blankToNull(input.note)
		})
		.select('id')
		.single();
	if (insertError) throw new Error(insertError.message ?? 'Failed to save friend read');

	const types = toTypes(result.types);
	const notified = await notifyTestTaker(db, result, {
		readId: (inserted as { id: number } | null)?.id ?? null,
		pickedType: input.pickedType as TestType,
		readerName: blankToNull(input.readerName),
		note: blankToNull(input.note),
		types,
		dependencies
	});

	return { types, displayName: blankToNull(result.display_name), notified };
}

async function notifyTestTaker(
	db: Db,
	result: ResultRow,
	read: {
		readId: number | null;
		pickedType: TestType;
		readerName: string | null;
		note: string | null;
		types: TestType[];
		dependencies: FriendReadDependencies;
	}
): Promise<boolean> {
	const email = normalizeEmail(result.notify_email);
	if (!email || (result.notify_sent_count ?? 0) >= NOTIFY_EMAIL_CAP) return false;

	try {
		const suppressed = await (read.dependencies.suppressedEmails ?? getSuppressedEmailSet)(db, [
			email
		]);
		if (suppressed.has(email)) return false;

		const message = buildFriendReadEmail({
			resultToken: result.result_token,
			readerName: read.readerName,
			pickedType: read.pickedType,
			types: read.types,
			note: read.note
		});
		const sent = await (read.dependencies.send ?? sendEmail)({
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
			logger.warn('Enneagram test read email failed', { error: sent.error });
			return false;
		}

		await db
			.from('enneagram_test_results')
			.update({ notify_sent_count: (result.notify_sent_count ?? 0) + 1 })
			.eq('id', result.id);
		if (read.readId !== null) {
			await db
				.from('enneagram_test_reads')
				.update({ notified_at: new Date().toISOString() })
				.eq('id', read.readId);
		}
		return true;
	} catch (error) {
		// The read is saved either way; the email is a courtesy.
		logger.error('Enneagram test read email errored', error as Error);
		return false;
	}
}

function escapeHtml(value: string): string {
	return value.replace(
		/[&<>"']/g,
		(char) =>
			({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] as string
	);
}

export function testResultUrl(resultToken: string): string {
	return `${BASE_URL}/enneagram-test/result/${encodeURIComponent(resultToken)}`;
}

export function testReadUrl(readToken: string): string {
	return `${BASE_URL}/enneagram-test/read/${encodeURIComponent(readToken)}`;
}

export function buildFriendReadEmail(input: {
	resultToken: string;
	readerName: string | null;
	pickedType: TestType;
	types: TestType[];
	note: string | null;
}) {
	const who = input.readerName ?? 'Someone';
	const picked = `${withArticle(input.pickedType)} (${TEST_TYPES[input.pickedType].name})`;
	const yours = typeListWithArticles(input.types);
	const resultUrl = testResultUrl(input.resultToken);
	const stopUrl = `${BASE_URL}/api/enneagram-test/stop/${encodeURIComponent(input.resultToken)}`;
	const subject = `${who} read you as ${withArticle(input.pickedType)}`;

	const htmlContent = `<p>${escapeHtml(who)} answered your Enneagram test link and read you as <strong>${escapeHtml(picked)}</strong>. You picked ${escapeHtml(yours)}.</p>
${input.note ? `<p style="border-left: 3px solid #f59e0b; padding-left: 12px;">“${escapeHtml(input.note)}”</p>` : ''}
<p><a class="button" href="${resultUrl}">See the read</a></p>
<p style="font-size: 13px; color: #69707a;">You’re getting this because you asked to hear when someone answers your test link. <a href="${stopUrl}">Stop these emails</a>.</p>`;

	const plainTextContent = `${who} answered your Enneagram test link and read you as ${picked}. You picked ${yours}.
${input.note ? `\n“${input.note}”\n` : ''}
See the read: ${resultUrl}

You’re getting this because you asked to hear when someone answers your test link.
Stop these emails: ${stopUrl}`;

	return {
		subject,
		preheader: `You picked ${yours}. See what they said.`,
		htmlContent,
		plainTextContent,
		resultUrl,
		stopUrl
	};
}

// ---------------------------------------------------------------------------
// "Answer a question as your type"
// ---------------------------------------------------------------------------

type QuestionRow = {
	url: string | null;
	question: string | null;
	question_formatted: string | null;
};

function toQuestionLink(row: QuestionRow): TestQuestionLink | null {
	const url = (row.url ?? '').trim();
	const question = (row.question_formatted ?? row.question ?? '').trim();
	return url && question ? { url, question } : null;
}

/**
 * Pick one question per type: DJ's curated slug when there is one, otherwise a
 * spread of the most-answered questions so different types land on different
 * questions.
 */
export function assignQuestionsToTypes(
	types: readonly TestType[],
	curated: Partial<Record<TestType, TestQuestionLink>>,
	fallback: readonly TestQuestionLink[]
): Partial<Record<TestType, TestQuestionLink>> {
	const assigned: Partial<Record<TestType, TestQuestionLink>> = {};
	for (const type of types) {
		const pick = curated[type] ?? (fallback.length ? fallback[(type - 1) % fallback.length] : null);
		if (pick) assigned[type] = pick;
	}
	return assigned;
}

export async function getQuestionsForTypes(
	db: Db,
	types: readonly TestType[]
): Promise<Partial<Record<TestType, TestQuestionLink>>> {
	try {
		const curatedSlugs = types
			.map((type) => [type, CURATED_QUESTION_SLUGS[type]] as const)
			.filter((entry): entry is readonly [TestType, string] => Boolean(entry[1]));

		const curated: Partial<Record<TestType, TestQuestionLink>> = {};
		if (curatedSlugs.length) {
			const { data } = await db
				.from('questions')
				.select('url, question, question_formatted')
				.in(
					'url',
					curatedSlugs.map(([, slug]) => slug)
				)
				.not('flagged', 'is', true)
				.not('removed', 'is', true);
			const bySlug = new Map(
				((data ?? []) as QuestionRow[]).map((row) => [row.url, toQuestionLink(row)])
			);
			for (const [type, slug] of curatedSlugs) {
				const link = bySlug.get(slug);
				if (link) curated[type] = link;
			}
		}

		const { data: rows, error } = await db
			.from('questions')
			.select('url, question, question_formatted')
			.not('url', 'is', null)
			.not('flagged', 'is', true)
			.not('removed', 'is', true)
			.order('comment_count', { ascending: false })
			.limit(9);
		if (error) throw new Error(error.message ?? 'Failed to load questions');

		const fallback = ((rows ?? []) as QuestionRow[])
			.map(toQuestionLink)
			.filter((link): link is TestQuestionLink => link !== null);
		return assignQuestionsToTypes(types, curated, fallback);
	} catch (error) {
		logger.error('Failed to pick questions for Enneagram test result', error as Error);
		return {};
	}
}
