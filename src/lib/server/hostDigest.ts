// src/lib/server/hostDigest.ts
//
// Host reply desk: draft two replies in the host's voice for every new human
// take, send one morning digest, and sign the one-tap links that open
// /host-desk/[token]. Posting itself lives in the page's POST action and the
// post_host_reply RPC; nothing in this module writes a comment.

import { createHmac, timingSafeEqual } from 'node:crypto';
import { PRIVATE_ADMIN_EMAIL, SUPABASE_SERVICE_KEY } from '$env/static/private';
import { resolveHostUserId } from './hostIdentity';
export { DEFAULT_HOST_USER_ID, resolveHostUserId } from './hostIdentity';
import { sendEmail, type SendEmailResult } from '$lib/email/sender';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { HOST_VOICE_GUIDE, renderHostVoiceSamples } from '$lib/server/hostVoice';
import { SmartLLMService, type JSONRequestOptions } from '../../utils/server/smart-llm-service';

const BASE_URL = 'https://9takes.com';

export const HOST_DESK_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
export const HOST_REPLY_MAX_CHARS = 5000; // same ceiling as createCommentSchema
const DRAFT_MAX_CHARS = 600;
const LOOKBACK_MS = 48 * 60 * 60 * 1000;
const DIGEST_OVERLAP_MS = 60 * 60 * 1000;
const DRAFT_MODEL_PROFILE: JSONRequestOptions['profile'] = 'balanced';
const DRAFT_MODEL_LABEL = `openrouter/json-${DRAFT_MODEL_PROFILE}`;
const DRAFT_TEMPERATURE = 0.8;
const FALLBACK_DRAFT_A = 'what made you go with that one?';
const FALLBACK_DRAFT_B = 'dang. what is the story behind that?';
const FALLBACK_LOW_EFFORT_A = "lol what's the real one?";
const FALLBACK_LOW_EFFORT_B = 'nice';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HostDigestCandidate = {
	comment_id: number;
	comment_text: string;
	author_type_key: string;
	is_anonymous: boolean;
	question_id: number | null;
	question_text: string | null;
	question_url: string | null;
	parent_comment_text: string | null;
	low_effort: boolean;
	created_at: string;
};

export type HostReplyDrafts = {
	draftA: string;
	draftB: string;
	model: string | null;
	usedFallback: boolean;
};

export type HostDeskVariant = 'a' | 'b' | 'custom' | 'skip';

export type HostDeskTokenPayload = {
	draftId: number;
	variant: HostDeskVariant;
	expiresAt: number;
};

export type HostDigestItem = {
	draftId: number;
	candidate: HostDigestCandidate;
	draftA: string;
	draftB: string;
};

export type HostDigestSummary = {
	since: string;
	candidates: number;
	drafted: number;
	draftFailures: number;
	fallbackDrafts: number;
	carriedOver: number;
	olderPending: number;
	sent: boolean;
	recipient: string | null;
	error?: string;
};

type LlmLike = {
	getJSONResponse: <T = unknown>(options: JSONRequestOptions) => Promise<T>;
};

export type DraftDependencies = {
	llm?: LlmLike;
};

export type HostDigestDependencies = DraftDependencies & {
	supabase?: any;
	send?: (options: Parameters<typeof sendEmail>[0]) => Promise<SendEmailResult>;
	now?: () => Date;
	hostUserId?: string;
	recipient?: string | null;
	secret?: string;
	baseUrl?: string;
};

// ---------------------------------------------------------------------------
// Draft validation
// ---------------------------------------------------------------------------

const BANNED_DRAFT_PHRASES = [
	'i hear you',
	'thank you for sharing',
	'thanks for sharing',
	'as an ai',
	'as a language model',
	'language model',
	'this draft',
	'ai-generated',
	'ai generated'
];

export type DraftValidation = { ok: true; text: string } | { ok: false; reason: string };

export function validateHostDraft(value: unknown): DraftValidation {
	if (typeof value !== 'string') return { ok: false, reason: 'not a string' };
	const text = value.replace(/\s+\n/g, '\n').trim();
	if (!text) return { ok: false, reason: 'empty' };
	if (text.length > DRAFT_MAX_CHARS) return { ok: false, reason: 'too long' };
	if (/[—–]/.test(text)) return { ok: false, reason: 'contains a dash' };
	if (/^\s*[-*•]\s+/m.test(text) || /^\s*\d+[.)]\s+/m.test(text)) {
		return { ok: false, reason: 'contains a list' };
	}
	if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(text)) {
		return { ok: false, reason: 'contains an emoji' };
	}
	const lowered = text.toLowerCase();
	const banned = BANNED_DRAFT_PHRASES.find((phrase) => lowered.includes(phrase));
	if (banned) return { ok: false, reason: `contains "${banned}"` };
	return { ok: true, text };
}

// ---------------------------------------------------------------------------
// Drafting
// ---------------------------------------------------------------------------

let defaultLlm: SmartLLMService | null = null;

function getDefaultLlm(): LlmLike {
	if (!defaultLlm) {
		defaultLlm = new SmartLLMService({
			httpReferer: 'https://9takes.com',
			appName: '9takes Host Desk',
			openRouterTimeoutMs: 45_000,
			jsonMaxTokens: 600
		});
	}
	return defaultLlm;
}

export function describeAuthorType(
	candidate: Pick<HostDigestCandidate, 'author_type_key'>
): string {
	const key = (candidate.author_type_key || '').trim();
	if (/^[1-9]$/.test(key)) return `Type ${key}`;
	if (key === 'rando') return 'anonymous';
	return 'untyped';
}

function buildDraftSystemPrompt(): string {
	return `${HOST_VOICE_GUIDE}

Here are real examples of DJ replying (THEM is what they wrote, DJ is his reply):

${renderHostVoiceSamples()}

Output format: return ONLY JSON shaped like {"drafts":[{"text":"..."},{"text":"..."}]}.
Draft 1 is the shorter, lighter one (often one line). Draft 2 engages the specific detail in their take and can run a sentence or two longer. Both must sound like DJ, and they must differ in angle, not just wording.`;
}

function buildDraftUserPrompt(candidate: HostDigestCandidate): string {
	const lines = [
		`QUESTION: ${candidate.question_text ?? '(unknown question)'}`,
		candidate.parent_comment_text
			? `THEY ARE REPLYING TO THIS COMMENT: ${candidate.parent_comment_text}`
			: null,
		`THEIR TAKE: ${candidate.comment_text}`,
		`AUTHOR: ${describeAuthorType(candidate)} (do not mention their type)`,
		candidate.low_effort
			? 'NOTE: this is a low-effort take. Keep both drafts to one short line: a nudge with a specific follow-up, or a one-word reaction.'
			: null,
		'Write the two drafts now.'
	];
	return lines.filter(Boolean).join('\n');
}

function fallbackDrafts(candidate: HostDigestCandidate): HostReplyDrafts {
	return candidate.low_effort
		? {
				draftA: FALLBACK_LOW_EFFORT_A,
				draftB: FALLBACK_LOW_EFFORT_B,
				model: null,
				usedFallback: true
			}
		: { draftA: FALLBACK_DRAFT_A, draftB: FALLBACK_DRAFT_B, model: null, usedFallback: true };
}

function extractDraftTexts(raw: unknown): unknown[] {
	if (!raw || typeof raw !== 'object') return [];
	const drafts = (raw as { drafts?: unknown }).drafts;
	if (!Array.isArray(drafts)) return [];
	return drafts.map((entry) =>
		entry && typeof entry === 'object' ? (entry as { text?: unknown }).text : entry
	);
}

/**
 * Two replies in the host's voice: one shorter and lighter, one that engages
 * the specific detail. Each draft is validated; a failed generation is retried
 * once, then replaced by a safe short template so the digest always ships.
 */
export async function draftHostReplies(
	candidate: HostDigestCandidate,
	deps: DraftDependencies = {}
): Promise<HostReplyDrafts> {
	const llm = deps.llm ?? getDefaultLlm();
	const systemPrompt = buildDraftSystemPrompt();
	const userPrompt = buildDraftUserPrompt(candidate);
	const fallback = fallbackDrafts(candidate);

	let bestA: string | null = null;
	let bestB: string | null = null;

	for (let attempt = 0; attempt < 2; attempt += 1) {
		let raw: unknown;
		try {
			raw = await llm.getJSONResponse({
				systemPrompt,
				userPrompt,
				profile: DRAFT_MODEL_PROFILE,
				temperature: DRAFT_TEMPERATURE,
				validation: { retryOnParseError: true, maxRetries: 1 },
				operationType: 'host_reply_drafts',
				taskId: String(candidate.comment_id)
			});
		} catch (llmError) {
			console.error('Host draft generation failed', {
				commentId: candidate.comment_id,
				attempt,
				error: llmError instanceof Error ? llmError.message : String(llmError)
			});
			continue;
		}

		const [rawA, rawB] = extractDraftTexts(raw);
		const a = validateHostDraft(rawA);
		const b = validateHostDraft(rawB);
		if (a.ok && !bestA) bestA = a.text;
		if (b.ok && !bestB && (!bestA || b.text !== bestA)) bestB = b.text;
		if (bestA && bestB) break;
	}

	if (bestA && bestB) {
		return { draftA: bestA, draftB: bestB, model: DRAFT_MODEL_LABEL, usedFallback: false };
	}

	const draftA = bestA ?? bestB ?? fallback.draftA;
	const draftB =
		bestA && bestB ? bestB : draftA === fallback.draftB ? fallback.draftA : fallback.draftB;
	return {
		draftA,
		draftB,
		model: bestA || bestB ? DRAFT_MODEL_LABEL : null,
		usedFallback: true
	};
}

// ---------------------------------------------------------------------------
// Signed one-tap tokens
// ---------------------------------------------------------------------------

function getSigningSecret(explicitSecret?: string): string {
	const secret = explicitSecret || SUPABASE_SERVICE_KEY;
	if (!secret) throw new Error('Host desk signing secret is not configured');
	return secret;
}

function signPayload(payload: string, secret: string): string {
	return createHmac('sha256', secret).update(`host-desk:${payload}`).digest('base64url');
}

function isHostDeskVariant(value: unknown): value is HostDeskVariant {
	return value === 'a' || value === 'b' || value === 'custom' || value === 'skip';
}

export function signHostDeskToken(
	payload: { draftId: number; variant: HostDeskVariant },
	options: { now?: number; secret?: string } = {}
): string {
	if (!Number.isSafeInteger(payload.draftId) || payload.draftId <= 0) {
		throw new Error('Host desk token needs a positive draft id');
	}
	const body: HostDeskTokenPayload & { v: 1 } = {
		v: 1,
		draftId: payload.draftId,
		variant: payload.variant,
		expiresAt: (options.now ?? Date.now()) + HOST_DESK_TOKEN_MAX_AGE_MS
	};
	const encoded = Buffer.from(JSON.stringify(body)).toString('base64url');
	return `${encoded}.${signPayload(encoded, getSigningSecret(options.secret))}`;
}

export function verifyHostDeskToken(
	token: string | undefined,
	options: { now?: number; secret?: string } = {}
): HostDeskTokenPayload | null {
	if (!token || token.length > 512) return null;
	const [encoded, signature, extra] = token.split('.');
	if (!encoded || !signature || extra !== undefined) return null;

	const expected = signPayload(encoded, getSigningSecret(options.secret));
	const signatureBuffer = Buffer.from(signature);
	const expectedBuffer = Buffer.from(expected);
	if (
		signatureBuffer.length !== expectedBuffer.length ||
		!timingSafeEqual(signatureBuffer, expectedBuffer)
	) {
		return null;
	}

	try {
		const parsed: unknown = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
		if (!parsed || typeof parsed !== 'object') return null;
		const body = parsed as Partial<HostDeskTokenPayload & { v: number }>;
		if (body.v !== 1) return null;
		if (!Number.isSafeInteger(body.draftId) || Number(body.draftId) <= 0) return null;
		if (!isHostDeskVariant(body.variant)) return null;
		if (
			!Number.isSafeInteger(body.expiresAt) ||
			Number(body.expiresAt) < (options.now ?? Date.now())
		) {
			return null;
		}
		return {
			draftId: body.draftId as number,
			variant: body.variant,
			expiresAt: body.expiresAt as number
		};
	} catch {
		return null;
	}
}

export function hostDeskUrl(
	draftId: number,
	variant: HostDeskVariant,
	options: { now?: number; secret?: string; baseUrl?: string } = {}
): string {
	const token = signHostDeskToken({ draftId, variant }, options);
	return `${options.baseUrl ?? BASE_URL}/host-desk/${encodeURIComponent(token)}`;
}

// ---------------------------------------------------------------------------
// Email
// ---------------------------------------------------------------------------

export function escapeHtml(value: string): string {
	return (
		value
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;')
			// The base template substitutes {{name}}; keep user text out of that.
			.replace(/\{\{/g, '{&#8203;{')
	);
}

function truncate(value: string, max: number): string {
	const clean = value.replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;
	return `${clean.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

function multiline(value: string): string {
	return escapeHtml(value).replace(/\r?\n/g, '<br>');
}

function questionLink(candidate: HostDigestCandidate, baseUrl: string): string | null {
	return candidate.question_url ? `${baseUrl}/questions/${candidate.question_url}` : null;
}

export function buildHostDigestEmail(
	items: HostDigestItem[],
	options: { now?: number; secret?: string; baseUrl?: string; olderPending?: number } = {}
): { subject: string; preheader: string; htmlContent: string; plainTextContent: string } {
	const baseUrl = options.baseUrl ?? BASE_URL;
	const count = items.length;
	const subject = `Host desk: ${count} new take${count === 1 ? '' : 's'} to answer`;
	const preheader =
		count === 1
			? truncate(items[0].candidate.comment_text, 90)
			: `${count} takes, two drafts each, one tap to post.`;

	const htmlItems = items.map((item, index) => {
		const { candidate } = item;
		const urls = {
			a: hostDeskUrl(item.draftId, 'a', options),
			b: hostDeskUrl(item.draftId, 'b', options),
			custom: hostDeskUrl(item.draftId, 'custom', options),
			skip: hostDeskUrl(item.draftId, 'skip', options)
		};
		const qLink = questionLink(candidate, baseUrl);
		const qText = escapeHtml(truncate(candidate.question_text ?? 'Unknown question', 60));
		const authorLabel = escapeHtml(describeAuthorType(candidate));
		const badge = candidate.low_effort
			? ' <span style="display:inline-block;padding:2px 8px;border-radius:999px;background:#fef3c7;color:#92400e;font-size:12px;font-weight:700;">low effort</span>'
			: '';
		const parent = candidate.parent_comment_text
			? `<p style="margin:0 0 8px;font-size:13px;color:#69707a;">Replying to: ${escapeHtml(truncate(candidate.parent_comment_text, 140))}</p>`
			: '';

		return `<div style="margin:0 0 28px;padding:0 0 24px;border-bottom:1px solid #e5e7eb;">
<p style="margin:0 0 6px;font-size:13px;color:#69707a;">${index + 1} of ${count} · ${qLink ? `<a href="${escapeHtml(qLink)}">${qText}</a>` : qText}</p>
${parent}<p style="margin:0 0 12px;padding:12px 14px;background:#f6f7f9;border-radius:8px;font-size:16px;line-height:1.5;">${multiline(candidate.comment_text)}</p>
<p style="margin:0 0 16px;font-size:13px;color:#69707a;">${authorLabel}${badge}</p>
<p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#69707a;">Draft A</p>
<blockquote style="margin:0 0 10px;padding:10px 14px;border-left:3px solid #f59e0b;background:#fffbeb;font-size:15px;line-height:1.5;">${multiline(item.draftA)}</blockquote>
<p style="margin:0 0 18px;"><a class="button" href="${escapeHtml(urls.a)}">Open &amp; post A</a></p>
<p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#69707a;">Draft B</p>
<blockquote style="margin:0 0 10px;padding:10px 14px;border-left:3px solid #f59e0b;background:#fffbeb;font-size:15px;line-height:1.5;">${multiline(item.draftB)}</blockquote>
<p style="margin:0 0 14px;"><a class="button" href="${escapeHtml(urls.b)}">Open &amp; post B</a></p>
<p style="margin:0;font-size:14px;"><a href="${escapeHtml(urls.custom)}">Write my own</a> &nbsp;·&nbsp; <a href="${escapeHtml(urls.skip)}">Skip</a></p>
</div>`;
	});

	const older = options.olderPending ?? 0;
	const olderNote =
		older > 0
			? `<p style="font-size:13px;color:#69707a;">${older} older draft${older === 1 ? '' : 's'} still pending.</p>`
			: '';

	const htmlContent = `<p>${count === 1 ? 'One new take' : `${count} new takes`} since the last digest. Every link opens a page where you can edit, then tap once to post as you.</p>
${htmlItems.join('\n')}
${olderNote}<p style="font-size:13px;color:#69707a;">Full desk: <a href="${baseUrl}/admin/host-desk">${baseUrl}/admin/host-desk</a></p>`;

	const textItems = items.map((item, index) => {
		const { candidate } = item;
		const urls = {
			a: hostDeskUrl(item.draftId, 'a', options),
			b: hostDeskUrl(item.draftId, 'b', options),
			custom: hostDeskUrl(item.draftId, 'custom', options),
			skip: hostDeskUrl(item.draftId, 'skip', options)
		};
		const qLink = questionLink(candidate, baseUrl);
		return [
			`${index + 1} of ${count}: ${truncate(candidate.question_text ?? 'Unknown question', 60)}${qLink ? ` (${qLink})` : ''}`,
			candidate.parent_comment_text
				? `Replying to: ${truncate(candidate.parent_comment_text, 140)}`
				: null,
			`Take (${describeAuthorType(candidate)}${candidate.low_effort ? ', low effort' : ''}):`,
			candidate.comment_text,
			'',
			`Draft A: ${item.draftA}`,
			`Open & post A: ${urls.a}`,
			'',
			`Draft B: ${item.draftB}`,
			`Open & post B: ${urls.b}`,
			'',
			`Write my own: ${urls.custom}`,
			`Skip: ${urls.skip}`
		]
			.filter((line) => line !== null)
			.join('\n');
	});

	const plainTextContent = [
		`${count === 1 ? 'One new take' : `${count} new takes`} since the last digest. Every link opens a page where you can edit, then tap once to post as you.`,
		'',
		textItems.join('\n\n----\n\n'),
		'',
		older > 0 ? `${older} older draft${older === 1 ? '' : 's'} still pending.` : null,
		`Full desk: ${baseUrl}/admin/host-desk`
	]
		.filter((line) => line !== null)
		.join('\n');

	return { subject, preheader, htmlContent, plainTextContent };
}

// ---------------------------------------------------------------------------
// Draft rows with their context (shared by the digest and the admin page)
// ---------------------------------------------------------------------------

export type HostReplyDraftRow = {
	low_effort?: boolean;
	take_rank_at_post?: number | null;
	id: number;
	comment_id: number;
	question_id: number | null;
	draft_a: string;
	draft_b: string;
	model: string | null;
	status: 'pending' | 'posted' | 'skipped' | 'expired' | 'failed';
	posted_comment_id: number | null;
	posted_text: string | null;
	digest_sent_at: string | null;
	acted_at: string | null;
	created_at: string;
	updated_at: string;
};

export type HostDeskDraft = HostReplyDraftRow & {
	take: {
		text: string;
		author_type_key: string;
		is_anonymous: boolean;
		created_at: string | null;
		removed: boolean;
		parent_text: string | null;
	} | null;
	question: { id: number; text: string; url: string | null } | null;
};

function toCandidate(draft: HostDeskDraft): HostDigestCandidate | null {
	if (!draft.take) return null;
	return {
		comment_id: draft.comment_id,
		comment_text: draft.take.text,
		author_type_key: draft.take.author_type_key,
		is_anonymous: draft.take.is_anonymous,
		question_id: draft.question?.id ?? draft.question_id,
		question_text: draft.question?.text ?? null,
		question_url: draft.question?.url ?? null,
		parent_comment_text: draft.take.parent_text,
		low_effort: isLowEffortText(draft.take.text),
		created_at: draft.take.created_at ?? draft.created_at
	};
}

/** Mirrors the low_effort rule in get_host_digest_candidates. */
export function isLowEffortText(text: string): boolean {
	const clean = text.trim();
	return (
		clean.length < 3 || !/[\p{L}\p{N}]/u.test(clean) || (!/\s/.test(clean) && clean.length <= 12)
	);
}

/**
 * Attach the take, its parent, its question, and the author's type key to raw
 * draft rows. Keeps the digest and the admin page reading the same shape.
 */
export async function enrichHostDrafts(
	supabase: any,
	rows: HostReplyDraftRow[]
): Promise<HostDeskDraft[]> {
	if (rows.length === 0) return [];

	const commentIds = [...new Set(rows.map((row) => row.comment_id))];
	const { data: comments, error: commentsError } = await supabase
		.from('comments')
		.select('id, comment, author_id, parent_type, parent_id, created_at, removed')
		.in('id', commentIds);
	if (commentsError) throw new Error('Failed to load takes for host drafts');

	const commentById = new Map<number, any>((comments ?? []).map((row: any) => [row.id, row]));
	const parentIds = [
		...new Set(
			(comments ?? [])
				.filter((row: any) => row.parent_type === 'comment' && row.parent_id)
				.map((row: any) => row.parent_id as number)
		)
	];
	const authorIds = [
		...new Set((comments ?? []).map((row: any) => row.author_id).filter(Boolean) as string[])
	];
	const questionIds = [
		...new Set(
			rows
				.map((row) => row.question_id)
				.concat(
					(comments ?? [])
						.filter((row: any) => row.parent_type === 'question')
						.map((row: any) => row.parent_id as number)
				)
				.filter((id): id is number => typeof id === 'number' && id > 0)
		)
	];

	const [parentsResult, profilesResult, questionsResult] = await Promise.all([
		parentIds.length
			? supabase.from('comments').select('id, comment').in('id', parentIds)
			: Promise.resolve({ data: [], error: null }),
		authorIds.length
			? supabase.from('profiles').select('id, enneagram').in('id', authorIds)
			: Promise.resolve({ data: [], error: null }),
		questionIds.length
			? supabase
					.from('questions')
					.select('id, question, question_formatted, url')
					.in('id', questionIds)
			: Promise.resolve({ data: [], error: null })
	]);
	if (parentsResult.error || profilesResult.error || questionsResult.error) {
		throw new Error('Failed to load context for host drafts');
	}

	const parentById = new Map<number, string | null>(
		(parentsResult.data ?? []).map((row: any) => [row.id, row.comment ?? null])
	);
	const typeByAuthor = new Map<string, string>(
		(profilesResult.data ?? []).map((row: any) => [
			row.id,
			(row.enneagram ?? '').toString().trim() || 'unknown'
		])
	);
	const questionById = new Map<number, any>(
		(questionsResult.data ?? []).map((row: any) => [row.id, row])
	);

	return rows.map((row) => {
		const comment = commentById.get(row.comment_id);
		const questionId =
			row.question_id ?? (comment?.parent_type === 'question' ? comment.parent_id : null);
		const question = questionId ? questionById.get(questionId) : null;
		return {
			...row,
			take: comment
				? {
						text: (comment.comment ?? '').toString(),
						author_type_key: comment.author_id
							? (typeByAuthor.get(comment.author_id) ?? 'unknown')
							: 'rando',
						is_anonymous: !comment.author_id,
						created_at: comment.created_at ?? null,
						removed: comment.removed === true,
						parent_text:
							comment.parent_type === 'comment' ? (parentById.get(comment.parent_id) ?? null) : null
					}
				: null,
			question: question
				? {
						id: question.id,
						text: (question.question_formatted || question.question || '').toString().trim(),
						url: question.url ?? null
					}
				: null
		};
	});
}

// ---------------------------------------------------------------------------
// The digest run
// ---------------------------------------------------------------------------

async function loadLastDigestSentAt(supabase: any): Promise<number | null> {
	const { data, error } = await supabase
		.from('host_reply_drafts')
		.select('digest_sent_at')
		.not('digest_sent_at', 'is', null)
		.order('digest_sent_at', { ascending: false })
		.limit(1)
		.maybeSingle();
	if (error) throw new Error('Failed to read the last host digest time');
	const value = data?.digest_sent_at ? Date.parse(data.digest_sent_at) : NaN;
	return Number.isFinite(value) ? value : null;
}

export async function runHostDigest(deps: HostDigestDependencies = {}): Promise<HostDigestSummary> {
	const supabase = deps.supabase ?? (getSupabaseAdminClient() as any);
	const send = deps.send ?? sendEmail;
	const now = deps.now ? deps.now() : new Date();
	const nowMs = now.getTime();
	const hostUserId = deps.hostUserId ?? resolveHostUserId();
	const recipient =
		(deps.recipient === undefined ? PRIVATE_ADMIN_EMAIL : deps.recipient)?.trim() || null;
	const baseUrl = deps.baseUrl ?? BASE_URL;

	const lastDigest = await loadLastDigestSentAt(supabase);
	const sinceMs = Math.max(
		nowMs - LOOKBACK_MS,
		lastDigest === null ? 0 : lastDigest - DIGEST_OVERLAP_MS
	);
	const since = new Date(sinceMs).toISOString();

	const summary: HostDigestSummary = {
		since,
		candidates: 0,
		drafted: 0,
		draftFailures: 0,
		fallbackDrafts: 0,
		carriedOver: 0,
		olderPending: 0,
		sent: false,
		recipient
	};

	const { data: candidateRows, error: candidatesError } = await supabase.rpc(
		'get_host_digest_candidates',
		{ p_host_user_id: hostUserId, p_since: since }
	);
	if (candidatesError) throw new Error('Failed to load host digest candidates');
	const candidates = (Array.isArray(candidateRows) ? candidateRows : []) as HostDigestCandidate[];
	summary.candidates = candidates.length;

	const items: HostDigestItem[] = [];
	for (const candidate of candidates) {
		const drafts = await draftHostReplies(candidate, { llm: deps.llm });
		if (drafts.usedFallback) summary.fallbackDrafts += 1;

		const { data: inserted, error: insertError } = await supabase
			.from('host_reply_drafts')
			.insert({
				comment_id: candidate.comment_id,
				question_id: candidate.question_id,
				draft_a: drafts.draftA,
				draft_b: drafts.draftB,
				model: drafts.model,
				low_effort: candidate.low_effort,
				status: 'pending'
			})
			.select('id')
			.single();
		if (insertError || !inserted?.id) {
			// A concurrent run already drafted this take; it will be in that email.
			summary.draftFailures += 1;
			console.warn('Host draft insert skipped', { commentId: candidate.comment_id, insertError });
			continue;
		}
		summary.drafted += 1;
		items.push({ draftId: inserted.id, candidate, draftA: drafts.draftA, draftB: drafts.draftB });
	}

	// Drafts from a run whose email failed to send ride along in this one.
	const newIds = new Set(items.map((item) => item.draftId));
	const { data: unsentRows, error: unsentError } = await supabase
		.from('host_reply_drafts')
		.select('*')
		.eq('status', 'pending')
		.is('digest_sent_at', null)
		.order('created_at', { ascending: true })
		.limit(50);
	if (unsentError) throw new Error('Failed to load unsent host drafts');
	const carried = await enrichHostDrafts(
		supabase,
		((unsentRows ?? []) as HostReplyDraftRow[]).filter((row) => !newIds.has(row.id))
	);
	for (const draft of carried) {
		const candidate = toCandidate(draft);
		if (!candidate || draft.take?.removed) continue;
		items.push({ draftId: draft.id, candidate, draftA: draft.draft_a, draftB: draft.draft_b });
		summary.carriedOver += 1;
	}

	if (items.length === 0) return summary;

	const { count: olderPending } = await supabase
		.from('host_reply_drafts')
		.select('id', { count: 'exact', head: true })
		.eq('status', 'pending')
		.not('digest_sent_at', 'is', null);
	summary.olderPending = typeof olderPending === 'number' ? olderPending : 0;

	if (!recipient) {
		summary.error = 'PRIVATE_ADMIN_EMAIL is not configured';
		return summary;
	}

	items.sort((a, b) => Date.parse(a.candidate.created_at) - Date.parse(b.candidate.created_at));
	const email = buildHostDigestEmail(items, {
		now: nowMs,
		secret: deps.secret,
		baseUrl,
		olderPending: summary.olderPending
	});
	const dayKey = now.toISOString().slice(0, 10);
	const result = await send({
		to: recipient,
		subject: email.subject,
		preheader: email.preheader,
		htmlContent: email.htmlContent,
		plainTextContent: email.plainTextContent,
		emailKind: 'transactional',
		includeFooter: false,
		idempotencyKey: `host-digest:${dayKey}:${items.map((item) => item.draftId).join('-')}`
	});

	if (!result.success) {
		summary.error = result.error ?? 'Host digest send failed';
		return summary;
	}

	summary.sent = true;
	const { error: stampError } = await supabase
		.from('host_reply_drafts')
		.update({ digest_sent_at: now.toISOString(), updated_at: now.toISOString() })
		.in(
			'id',
			items.map((item) => item.draftId)
		);
	if (stampError) {
		summary.error = 'Digest sent but digest_sent_at could not be stamped';
	}
	return summary;
}
