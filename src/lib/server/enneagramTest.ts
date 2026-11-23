// src/lib/server/enneagramTest.ts
//
// Server side of the 9takes Enneagram test (T-42): saving a finished result,
// the friend-read loop ("ask someone who knows you"), the opt-in emails (the
// private result link, and a note when a friend answers), and picking a live
// question for the "answer as your type" card on the result page. Tables: enneagram_test_results, enneagram_test_reads
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
import { GLOBAL_RATE_LIMIT_SUBJECT, consumeApiRateLimit } from '$lib/server/apiRateLimit';
import { logger } from '$lib/utils/logger';

const BASE_URL = 'https://9takes.com';

/** Most emails (the result link plus friend reads) one result can trigger. */
export const NOTIFY_EMAIL_CAP = 20;

/** Give-first events from the result page are attributed here, never to the private result URL. */
export const TEST_RESULT_GATE_PATH = '/enneagram-test/result';

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
			.optional(),
		/** With a notifyEmail: also send the private result link to that address. */
		sendResult: z.boolean().optional(),
		/** Signed-in test-takers: copy a single-type result onto their profile. */
		saveToProfile: z.literal(true).optional()
	})
	.strict()
	.refine(
		(value) =>
			value.displayName !== undefined ||
			value.notifyEmail !== undefined ||
			value.saveToProfile === true,
		'Nothing to update'
	)
	.refine((value) => !value.sendResult || Boolean(value.notifyEmail), 'An email is required');

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

export type TestQuestionLink = { id?: number; url: string; question: string };

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
// "Email me this result"
// ---------------------------------------------------------------------------

/**
 * Daily send budget for test emails. The address is typed in by whoever holds
 * the result link and is never confirmed, so one address only gets so many of
 * these a day across every result, and the site only sends so many in total.
 * The per-address bucket is charged first so one address cannot spend the
 * site-wide budget.
 */
export async function consumeTestEmailBudget(email: string): Promise<boolean> {
	const recipient = await consumeApiRateLimit({
		bucket: 'enneagram_test_email_recipient',
		subject: `email:${email}`
	});
	if (!recipient.allowed) return false;

	const site = await consumeApiRateLimit({
		bucket: 'enneagram_test_email_global',
		subject: GLOBAL_RATE_LIMIT_SUBJECT
	});
	return site.allowed;
}

export type ResultEmailDependencies = {
	send?: (options: SendEmailOptions) => Promise<SendEmailResult>;
	suppressedEmails?: (db: Db, emails: string[]) => Promise<Set<string>>;
	/** False when today's send budget for this address, or the site, is spent. */
	emailBudget?: (email: string) => Promise<boolean>;
};

export type ResultEmailOutcome = 'sent' | 'capped' | 'suppressed' | 'no_email' | 'failed';

/**
 * Send the private result link to the address the test-taker just saved. Counts
 * against the same per-result cap as friend-read emails, so one result token can
 * never be used to send more than NOTIFY_EMAIL_CAP emails in total.
 */
export async function sendTestResultEmail(
	db: Db,
	resultToken: string,
	dependencies: ResultEmailDependencies = {}
): Promise<ResultEmailOutcome> {
	if (!isResultToken(resultToken)) return 'no_email';

	const { data: row, error } = await db
		.from('enneagram_test_results')
		.select('id, result_token, types, notify_email, notify_sent_count')
		.eq('result_token', resultToken)
		.maybeSingle();
	if (error) throw new Error(error.message ?? 'Failed to load test result');
	const result = row as ResultRow | null;
	const email = normalizeEmail(result?.notify_email);
	const types = toTypes(result?.types);
	if (!result || !email || !types.length) return 'no_email';
	if ((result.notify_sent_count ?? 0) >= NOTIFY_EMAIL_CAP) return 'capped';

	try {
		const suppressed = await (dependencies.suppressedEmails ?? getSuppressedEmailSet)(db, [email]);
		if (suppressed.has(email)) return 'suppressed';
		if (!(await (dependencies.emailBudget ?? consumeTestEmailBudget)(email))) return 'capped';

		const message = buildResultEmail({ resultToken: result.result_token, types });
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
			logger.warn('Enneagram test result email failed', { error: sent.error });
			return 'failed';
		}

		await db
			.from('enneagram_test_results')
			.update({ notify_sent_count: (result.notify_sent_count ?? 0) + 1 })
			.eq('id', result.id);
		return 'sent';
	} catch (sendError) {
		// The address is saved either way; the email is a courtesy.
		logger.error('Enneagram test result email errored', sendError as Error);
		return 'failed';
	}
}

/** "a 4 (The Individualist)", "a 5 (The Investigator) or a 6 (The Loyalist)". */
function namedTypeList(types: readonly TestType[]): string {
	return types.map((type) => `${withArticle(type)} (${TEST_TYPES[type].name})`).join(' or ');
}

export function buildResultEmail(input: { resultToken: string; types: TestType[] }) {
	const single = input.types.length === 1;
	const yours = typeListWithArticles(input.types);
	const named = namedTypeList(input.types);
	const resultUrl = testResultUrl(input.resultToken);
	const stopUrl = `${BASE_URL}/api/enneagram-test/stop/${encodeURIComponent(input.resultToken)}`;
	const subject = single
		? `Your Enneagram result: most likely ${yours}`
		: `Your Enneagram result: between ${input.types.map(withArticle).join(' and ')}`;
	const landed = single
		? `You took the 9takes Enneagram test and landed on ${named}.`
		: `You took the 9takes Enneagram test and landed between ${input.types
				.map((type) => `${withArticle(type)} (${TEST_TYPES[type].name})`)
				.join(' and ')}.`;
	const steps = [
		`Answer one question as ${yours}, then see how the other types answered it.`,
		'Send your link to someone who knows you. They pick for you before they see your answer.',
		single
			? `Read the Type ${input.types[0]} page.`
			: `Read the Type ${input.types[0]} and Type ${input.types[1]} pages side by side.`
	];

	const htmlContent = `<p>${escapeHtml(landed)}</p>
<p>Your result lives at a private link. Only someone with the link can open it, so keep this email.</p>
<p><a class="button" href="${resultUrl}">Open my result</a></p>
<p>Three things to do from there:</p>
<ol>${steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol>
<p style="font-size: 13px; color: #69707a;">You’re getting this because you asked us to email your test result. We’ll also tell you when someone answers your link. <a href="${stopUrl}">Stop these emails</a>.</p>`;

	const plainTextContent = `${landed}

Your result lives at a private link. Only someone with the link can open it, so keep this email.

Open my result: ${resultUrl}

Three things to do from there:
${steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

You’re getting this because you asked us to email your test result. We’ll also tell you when someone answers your link.
Stop these emails: ${stopUrl}`;

	return {
		subject,
		preheader: 'Your private link, plus three things to do with it.',
		htmlContent,
		plainTextContent,
		resultUrl,
		stopUrl
	};
}

/** The picks behind a result token, for endpoints that act on a result. */
export async function getTestResultTypes(db: Db, resultToken: string): Promise<TestType[] | null> {
	if (!isResultToken(resultToken)) return null;
	const { data, error } = await db
		.from('enneagram_test_results')
		.select('types')
		.eq('result_token', resultToken)
		.maybeSingle();
	if (error) throw new Error(error.message ?? 'Failed to load test result');
	if (!data) return null;
	return toTypes((data as { types: unknown }).types);
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
	/** False when today's send budget for this address, or the site, is spent. */
	emailBudget?: (email: string) => Promise<boolean>;
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
		hasNote: Boolean(blankToNull(input.note)),
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
		hasNote: boolean;
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
		// Over budget: the read is already saved, so skip the email quietly.
		if (!(await (read.dependencies.emailBudget ?? consumeTestEmailBudget)(email))) return false;

		const message = buildFriendReadEmail({
			resultToken: result.result_token,
			readerName: read.readerName,
			pickedType: read.pickedType,
			types: read.types,
			hasNote: read.hasNote
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

const READER_NAME_FALLBACK = 'A friend';
const READER_NAME_EMAIL_MAX_CHARS = 30;
// A scheme, "www.", an "@", or a dotted word such as name.tld.
const LINK_SHAPED = /:\/\/|www\.|@|[\p{L}\p{N}-]\.\p{L}{2,}/iu;

/**
 * The friend's name as the email may show it. The name is typed by whoever
 * holds the link and the email goes to an address nobody confirmed, so the
 * email carries a plain name only: letters, spaces, apostrophes and hyphens.
 * Anything link-shaped, or with no letters left, becomes "A friend". The result
 * page still shows the name exactly as the friend wrote it.
 */
export function safeReaderDisplayName(value: string | null | undefined): string {
	const raw = (value ?? '').normalize('NFKC');
	if (LINK_SHAPED.test(raw)) return READER_NAME_FALLBACK;

	const cleaned = Array.from(
		raw
			.replace(/[^\p{L}\p{M}\s'’-]/gu, ' ')
			.replace(/\s+/g, ' ')
			.trim()
	)
		.slice(0, READER_NAME_EMAIL_MAX_CHARS)
		.join('')
		.trim();
	return /\p{L}/u.test(cleaned) ? cleaned : READER_NAME_FALLBACK;
}

/**
 * The "someone answered your link" email. It carries none of the friend's own
 * words: a cleaned name and their pick only. A note stays on the result page.
 */
export function buildFriendReadEmail(input: {
	resultToken: string;
	readerName: string | null;
	pickedType: TestType;
	types: TestType[];
	hasNote: boolean;
}) {
	const who = safeReaderDisplayName(input.readerName);
	const noteLine = input.hasNote ? 'They left you a note. It’s on your result page.' : '';
	const picked = `${withArticle(input.pickedType)} (${TEST_TYPES[input.pickedType].name})`;
	const yours = typeListWithArticles(input.types);
	const resultUrl = testResultUrl(input.resultToken);
	const stopUrl = `${BASE_URL}/api/enneagram-test/stop/${encodeURIComponent(input.resultToken)}`;
	const subject = `${who} read you as ${withArticle(input.pickedType)}`;

	const htmlContent = `<p>${escapeHtml(who)} answered your Enneagram test link and read you as <strong>${escapeHtml(picked)}</strong>. You picked ${escapeHtml(yours)}.</p>
${noteLine ? `<p>${escapeHtml(noteLine)}</p>` : ''}
<p><a class="button" href="${resultUrl}">See the read</a></p>
<p style="font-size: 13px; color: #69707a;">You’re getting this because you asked to hear when someone answers your test link. <a href="${stopUrl}">Stop these emails</a>.</p>`;

	const plainTextContent = `${who} answered your Enneagram test link and read you as ${picked}. You picked ${yours}.
${noteLine ? `\n${noteLine}\n` : ''}
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
	id: number | null;
	url: string | null;
	question: string | null;
	question_formatted: string | null;
};

function toQuestionLink(row: QuestionRow): TestQuestionLink | null {
	const url = (row.url ?? '').trim();
	const question = (row.question_formatted ?? row.question ?? '').trim();
	if (!url || !question) return null;
	return Number.isSafeInteger(row.id) ? { id: Number(row.id), url, question } : { url, question };
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

/** How many of the most-answered questions the per-type fallback spreads across. */
const PER_TYPE_POOL_SIZE = 9;

export type TestQuestionSources = {
	curated: Partial<Record<TestType, TestQuestionLink>>;
	/** Most-answered open questions, most answered first. */
	pool: TestQuestionLink[];
};

/** DJ's curated question per type plus the most-answered open questions. Throws on a failed read. */
export async function loadTestQuestionSources(
	db: Db,
	types: readonly TestType[],
	poolSize = PER_TYPE_POOL_SIZE
): Promise<TestQuestionSources> {
	const curatedSlugs = types
		.map((type) => [type, CURATED_QUESTION_SLUGS[type]] as const)
		.filter((entry): entry is readonly [TestType, string] => Boolean(entry[1]));

	const curated: Partial<Record<TestType, TestQuestionLink>> = {};
	if (curatedSlugs.length) {
		const { data } = await db
			.from('questions')
			.select('id, url, question, question_formatted')
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
		.select('id, url, question, question_formatted')
		.not('url', 'is', null)
		.not('flagged', 'is', true)
		.not('removed', 'is', true)
		.order('comment_count', { ascending: false })
		.limit(Math.max(poolSize, PER_TYPE_POOL_SIZE));
	if (error) throw new Error(error.message ?? 'Failed to load questions');

	const pool = ((rows ?? []) as QuestionRow[])
		.map(toQuestionLink)
		.filter((link): link is TestQuestionLink => link !== null);
	return { curated, pool };
}

/** The per-type question from a set of sources (the same pick the result page has always made). */
export function questionsForTypesFromSources(
	types: readonly TestType[],
	sources: TestQuestionSources
): Partial<Record<TestType, TestQuestionLink>> {
	return assignQuestionsToTypes(types, sources.curated, sources.pool.slice(0, PER_TYPE_POOL_SIZE));
}

export async function getQuestionsForTypes(
	db: Db,
	types: readonly TestType[]
): Promise<Partial<Record<TestType, TestQuestionLink>>> {
	try {
		return questionsForTypesFromSources(types, await loadTestQuestionSources(db, types));
	} catch (error) {
		logger.error('Failed to pick questions for Enneagram test result', error as Error);
		return {};
	}
}
