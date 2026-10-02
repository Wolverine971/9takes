// src/lib/server/hostDigest.ts
//
// Host reply desk: draft two replies in the host's voice for every new human
// take, send one morning digest, and sign the one-tap links that open
// /host-desk/[token]. Posting itself lives in the page's POST action and the
// post_host_reply RPC; nothing in this module writes a comment.

import { createHmac, timingSafeEqual } from 'node:crypto';
import {
	PRIVATE_ADMIN_EMAIL,
	PRIVATE_OPENROUTER_API_KEY,
	SUPABASE_SERVICE_KEY
} from '$env/static/private';
import { resolveHostUserId } from './hostIdentity';
export { DEFAULT_HOST_USER_ID, resolveHostUserId } from './hostIdentity';
import { sendEmail, type SendEmailResult } from '$lib/email/sender';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { HOST_VOICE_GUIDE, renderHostVoiceSamples } from '$lib/server/hostVoice';

const BASE_URL = 'https://9takes.com';

export const HOST_DESK_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
export const HOST_REPLY_MAX_CHARS = 5000; // same ceiling as createCommentSchema
const DRAFT_MAX_CHARS = 600;
// The window starts a day before the last digest that went out, so a missed or
// killed run catches up instead of losing takes, but never reaches back more
// than two weeks. The candidates RPC skips takes that already have a draft row
// or a host reply, so the overlap never produces duplicates.
export const MAX_LOOKBACK_MS = 14 * 24 * 60 * 60 * 1000;
const DIGEST_OVERLAP_MS = 24 * 60 * 60 * 1000;
const DRAFT_TEMPERATURE = 0.8;
const FALLBACK_DRAFT_A = 'what made you go with that one?';
const FALLBACK_DRAFT_B = 'dang. what is the story behind that?';
const FALLBACK_LOW_EFFORT_A = "lol what's the real one?";
const FALLBACK_LOW_EFFORT_B = 'nice';
const FALLBACK_TEXTS = new Set([
	FALLBACK_DRAFT_A,
	FALLBACK_DRAFT_B,
	FALLBACK_LOW_EFFORT_A,
	FALLBACK_LOW_EFFORT_B
]);

// Drafting models. Non-reasoning only: the old SmartLLMService 'balanced'
// profile led with moonshotai/kimi-k2.5, which spent ~2,100 reasoning tokens
// (81 s, ignoring max_tokens) on one draft when replayed on 2026-10-02. Every
// call hit the 45 s timeout, so every draft ever written was the fallback
// template. These two answered the same prompt in 1.4 to 2.5 s.
export const HOST_DRAFT_MODELS = ['anthropic/claude-haiku-4.5', 'openai/gpt-4.1-mini'] as const;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DRAFT_CALL_TIMEOUT_MS = 25_000;
const DRAFT_MAX_TOKENS = 800;
const DRAFT_CONCURRENCY = 3;
const MIN_ATTEMPT_MS = 2_000;
/**
 * Drafting budget when the caller does not pass one. Vercel's default function
 * limit for this project is 15 s (fluid compute off), which is what the admin
 * "Run digest now" action gets. Takes still waiting when the budget runs out
 * go into the email with a "drafts failed" note instead of being dropped.
 */
export const DEFAULT_DRAFT_BUDGET_MS = 9_000;
/** Budget for the cron route, which runs with maxDuration 300. */
export const CRON_DRAFT_BUDGET_MS = 200_000;
const RUN_LOG_SOURCE = 'host_digest';
const STALE_RUN_MS = 10 * 60 * 1000;

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
	/** What gets stored. Fallback templates fill any slot the model did not. */
	draftA: string;
	draftB: string;
	model: string | null;
	usedFallback: boolean;
	/** Model drafts that passed validation, best first. Empty when drafting failed. */
	usable: string[];
	failureReason: string | null;
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
	/** A model draft that passed validation, or null when drafting failed. */
	draftA: string | null;
	draftB: string | null;
	failureReason?: string | null;
};

export type HostDigestStatus = 'no_takes' | 'sent' | 'send_failed' | 'no_recipient' | 'crashed';
export type HostDigestTrigger = 'cron' | 'manual';

export type HostDigestSummary = {
	trigger: HostDigestTrigger;
	status: HostDigestStatus;
	since: string;
	/** New human takes the candidates RPC returned this run. */
	candidates: number;
	/** Draft rows written this run (one per candidate, even when drafting failed). */
	drafted: number;
	/** Candidates where the model produced both drafts. */
	modelDrafts: number;
	/** Candidates with no usable model draft at all (fallback text stored). */
	failedDrafts: number;
	/** Candidates with at least one fallback draft. */
	fallbackDrafts: number;
	/** Inserts that failed for a reason other than a concurrent run's duplicate. */
	insertFailures: number;
	carriedOver: number;
	olderPending: number;
	sent: boolean;
	recipient: string | null;
	/** True when DJ needs to look: takes with no drafts, a failed send, a crash. */
	alarm: boolean;
	alarmReasons: string[];
	/** Start time of an earlier run that never recorded a finish (killed). */
	previousRunDied: string | null;
	durationMs: number;
	error?: string;
};

export type DraftLlmRequest = {
	systemPrompt: string;
	userPrompt: string;
	temperature: number;
	/** 0 for the first try, 1 for the retry. */
	attempt: number;
	timeoutMs: number;
	commentId: number;
};

export type DraftLlmResponse = {
	/** Parsed JSON, expected shape {"drafts":[{"text":"..."},{"text":"..."}]}. */
	raw: unknown;
	model: string | null;
};

export type DraftLlm = {
	draft: (request: DraftLlmRequest) => Promise<DraftLlmResponse>;
};

export type DraftDependencies = {
	llm?: DraftLlm;
	/** Wall clock for budgets (ms). Defaults to Date.now. */
	clock?: () => number;
	/** Absolute clock() time after which no new model call starts. */
	deadline?: number;
};

export type HostDigestDependencies = Omit<DraftDependencies, 'deadline'> & {
	supabase?: any;
	send?: (options: Parameters<typeof sendEmail>[0]) => Promise<SendEmailResult>;
	now?: () => Date;
	hostUserId?: string;
	recipient?: string | null;
	secret?: string;
	baseUrl?: string;
	trigger?: HostDigestTrigger;
	/** How long drafting may take before remaining takes ship undrafted. */
	draftBudgetMs?: number;
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

function errorMessage(error: unknown): string {
	if (error instanceof Error) return error.message;
	return typeof error === 'string' ? error : JSON.stringify(error);
}

/**
 * Parse a model's JSON reply. Tolerates ```json fences (Claude Haiku adds
 * them even with response_format json_object) and text around the object.
 */
export function parseDraftJson(content: string): unknown {
	const unfenced = content
		.trim()
		.replace(/^```(?:json)?\s*/i, '')
		.replace(/\s*```$/, '');
	const start = unfenced.indexOf('{');
	const end = unfenced.lastIndexOf('}');
	if (start === -1 || end <= start) throw new Error('model reply had no JSON object');
	try {
		return JSON.parse(unfenced.slice(start, end + 1));
	} catch {
		throw new Error('model reply was not valid JSON');
	}
}

/**
 * Direct OpenRouter caller for host drafts. SmartLLMService picks models by
 * profile only, and every profile that fits leads with a reasoning model, so
 * this module names its models explicitly and turns reasoning off.
 */
export function createOpenRouterDraftLlm(
	options: { apiKey?: string; fetchImpl?: typeof fetch; models?: readonly string[] } = {}
): DraftLlm {
	const apiKey = options.apiKey ?? PRIVATE_OPENROUTER_API_KEY;
	const fetchImpl = options.fetchImpl ?? fetch;
	const models = [...(options.models ?? HOST_DRAFT_MODELS)];

	return {
		async draft(request) {
			if (!apiKey) throw new Error('PRIVATE_OPENROUTER_API_KEY is not configured');
			// The retry leads with the other model, so a draft one model keeps
			// getting wrong gets a second opinion. OpenRouter falls through the
			// list on provider errors.
			const ordered =
				request.attempt % 2 === 0 || models.length < 2 ? models : [...models.slice(1), models[0]];

			const response = await fetchImpl(OPENROUTER_URL, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
					'HTTP-Referer': BASE_URL,
					'X-Title': '9takes Host Desk'
				},
				body: JSON.stringify({
					models: ordered,
					messages: [
						{ role: 'system', content: request.systemPrompt },
						{ role: 'user', content: request.userPrompt }
					],
					temperature: request.temperature,
					max_tokens: DRAFT_MAX_TOKENS,
					response_format: { type: 'json_object' },
					reasoning: { enabled: false }
				}),
				// Covers the body too: OpenRouter sends headers at once and holds
				// the body open while the model works.
				signal: AbortSignal.timeout(request.timeoutMs)
			});

			const bodyText = await response.text();
			if (!response.ok) {
				throw new Error(`OpenRouter ${response.status}: ${truncate(bodyText, 160)}`);
			}
			let data: any;
			try {
				data = JSON.parse(bodyText);
			} catch {
				throw new Error('OpenRouter returned a non-JSON body');
			}
			if (data?.error) {
				throw new Error(`OpenRouter error: ${String(data.error.message ?? data.error.code)}`);
			}
			const choice = data?.choices?.[0];
			const content = choice?.message?.content;
			const model = typeof data?.model === 'string' ? data.model : (ordered[0] ?? null);
			if (typeof content !== 'string' || !content.trim()) {
				throw new Error(
					`${model ?? 'model'} returned empty content (finish_reason ${choice?.finish_reason ?? 'unknown'})`
				);
			}
			return { raw: parseDraftJson(content), model };
		}
	};
}

let defaultLlm: DraftLlm | null = null;

function getDefaultLlm(): DraftLlm {
	defaultLlm ??= createOpenRouterDraftLlm();
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

Output format: return ONLY JSON shaped like {"drafts":[{"text":"..."},{"text":"..."}]}, with no markdown fences and no text around it.
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

function fallbackPair(candidate: HostDigestCandidate): { a: string; b: string } {
	return candidate.low_effort
		? { a: FALLBACK_LOW_EFFORT_A, b: FALLBACK_LOW_EFFORT_B }
		: { a: FALLBACK_DRAFT_A, b: FALLBACK_DRAFT_B };
}

/** Fallback drafts with no model call, e.g. when the run is out of time. */
export function fallbackDrafts(
	candidate: HostDigestCandidate,
	failureReason: string
): HostReplyDrafts {
	const pair = fallbackPair(candidate);
	return {
		draftA: pair.a,
		draftB: pair.b,
		model: null,
		usedFallback: true,
		usable: [],
		failureReason
	};
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
 * once. Slots the model could not fill get a safe short template so the row
 * can be stored, and `usable` / `failureReason` tell the email which drafts
 * are real so a template is never offered as a one-tap reply.
 */
export async function draftHostReplies(
	candidate: HostDigestCandidate,
	deps: DraftDependencies = {}
): Promise<HostReplyDrafts> {
	const llm = deps.llm ?? getDefaultLlm();
	const clock = deps.clock ?? Date.now;
	const deadline = deps.deadline ?? Number.POSITIVE_INFINITY;
	const systemPrompt = buildDraftSystemPrompt();
	const userPrompt = buildDraftUserPrompt(candidate);
	const fallback = fallbackPair(candidate);

	let bestA: string | null = null;
	let bestB: string | null = null;
	let model: string | null = null;
	let failureReason: string | null = null;

	for (let attempt = 0; attempt < 2; attempt += 1) {
		const remaining = deadline - clock();
		if (remaining < MIN_ATTEMPT_MS) {
			failureReason ??= 'the run ran out of time before drafting this take';
			break;
		}

		let response: DraftLlmResponse;
		try {
			response = await llm.draft({
				systemPrompt,
				userPrompt,
				temperature: DRAFT_TEMPERATURE,
				attempt,
				timeoutMs: Math.min(DRAFT_CALL_TIMEOUT_MS, remaining),
				commentId: candidate.comment_id
			});
		} catch (llmError) {
			failureReason = truncate(errorMessage(llmError), 200);
			console.error('Host draft generation failed', {
				commentId: candidate.comment_id,
				attempt,
				error: failureReason
			});
			continue;
		}

		const [rawA, rawB] = extractDraftTexts(response.raw);
		const a = validateHostDraft(rawA);
		const b = validateHostDraft(rawB);
		if ((a.ok && !bestA) || (b.ok && !bestB)) model = response.model;
		if (a.ok && !bestA) bestA = a.text;
		if (b.ok && !bestB && (!bestA || b.text !== bestA)) bestB = b.text;
		if (bestA && bestB) break;
		if (!a.ok || !b.ok) {
			failureReason = `drafts rejected (${[a, b]
				.filter((check): check is { ok: false; reason: string } => !check.ok)
				.map((check) => check.reason)
				.join(', ')})`;
		}
	}

	if (bestA && bestB) {
		return {
			draftA: bestA,
			draftB: bestB,
			model,
			usedFallback: false,
			usable: [bestA, bestB],
			failureReason: null
		};
	}

	const usable = [bestA ?? bestB].filter((text): text is string => Boolean(text));
	const draftA = usable[0] ?? fallback.a;
	const draftB = draftA === fallback.b ? fallback.a : fallback.b;
	return {
		draftA,
		draftB,
		model: usable.length ? model : null,
		usedFallback: true,
		usable,
		failureReason: failureReason ?? 'the model returned no usable draft'
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

const DRAFT_LABEL_STYLE =
	'margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#69707a;';
const DRAFT_QUOTE_STYLE =
	'margin:0 0 10px;padding:10px 14px;border-left:3px solid #f59e0b;background:#fffbeb;font-size:15px;line-height:1.5;';
const ALERT_STYLE =
	'margin:0 0 16px;padding:12px 14px;border-radius:8px;background:#fef2f2;border:1px solid #fca5a5;color:#991b1b;font-size:14px;line-height:1.5;';

function htmlDraftBlock(label: string, text: string, url: string, cta: string): string {
	return `<p style="${DRAFT_LABEL_STYLE}">${label}</p>
<blockquote style="${DRAFT_QUOTE_STYLE}">${multiline(text)}</blockquote>
<p style="margin:0 0 18px;"><a class="button" href="${escapeHtml(url)}">${cta}</a></p>`;
}

export function buildHostDigestEmail(
	items: HostDigestItem[],
	options: {
		now?: number;
		secret?: string;
		baseUrl?: string;
		olderPending?: number;
		/** Run-level warnings shown above the takes (e.g. a killed earlier run). */
		notices?: string[];
	} = {}
): { subject: string; preheader: string; htmlContent: string; plainTextContent: string } {
	const baseUrl = options.baseUrl ?? BASE_URL;
	const count = items.length;
	const failed = items.filter((item) => !item.draftA);
	const failureReasons = [
		...new Set(failed.map((item) => item.failureReason).filter(Boolean) as string[])
	];
	const failureNotice = failed.length
		? `Drafting failed for ${failed.length === count ? (count === 1 ? 'this take' : `all ${count} takes`) : `${failed.length} of ${count} takes`}${failureReasons.length ? ` (${truncate(failureReasons.join('; '), 220)})` : ''}. The takes are below anyway; tap Write my own to answer them.`
		: null;
	const notices = [failureNotice, ...(options.notices ?? [])].filter(Boolean) as string[];

	const subject = `Host desk: ${count} new take${count === 1 ? '' : 's'} to answer${
		failed.length ? ` (drafts failed${failed.length === count ? '' : ` for ${failed.length}`})` : ''
	}`;
	const preheader = failureNotice
		? truncate(failureNotice, 90)
		: count === 1
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
		const drafts = item.draftA
			? [
					htmlDraftBlock('Draft A', item.draftA, urls.a, 'Open &amp; post A'),
					item.draftB ? htmlDraftBlock('Draft B', item.draftB, urls.b, 'Open &amp; post B') : ''
				].join('\n')
			: `<p style="${ALERT_STYLE}"><strong>Drafts failed for this take.</strong>${item.failureReason ? ` ${escapeHtml(truncate(item.failureReason, 160))}` : ''}</p>`;

		return `<div style="margin:0 0 28px;padding:0 0 24px;border-bottom:1px solid #e5e7eb;">
<p style="margin:0 0 6px;font-size:13px;color:#69707a;">${index + 1} of ${count} · ${qLink ? `<a href="${escapeHtml(qLink)}">${qText}</a>` : qText}</p>
${parent}<p style="margin:0 0 12px;padding:12px 14px;background:#f6f7f9;border-radius:8px;font-size:16px;line-height:1.5;">${multiline(candidate.comment_text)}</p>
<p style="margin:0 0 16px;font-size:13px;color:#69707a;">${authorLabel}${badge}</p>
${drafts}
<p style="margin:0;font-size:14px;">${item.draftA ? `<a href="${escapeHtml(urls.custom)}">Write my own</a>` : `<a class="button" href="${escapeHtml(urls.custom)}">Write my own</a>`} &nbsp;·&nbsp; <a href="${escapeHtml(urls.skip)}">Skip</a></p>
</div>`;
	});

	const older = options.olderPending ?? 0;
	const olderNote =
		older > 0
			? `<p style="font-size:13px;color:#69707a;">${older} older draft${older === 1 ? '' : 's'} still pending.</p>`
			: '';
	const noticeHtml = notices
		.map((notice) => `<p style="${ALERT_STYLE}">${escapeHtml(notice)}</p>`)
		.join('\n');

	const intro = `${count === 1 ? 'One new take' : `${count} new takes`} since the last digest. Every link opens a page where you can edit, then tap once to post as you.`;
	const htmlContent = `${noticeHtml}${noticeHtml ? '\n' : ''}<p>${intro}</p>
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
		const draftLines = item.draftA
			? [
					`Draft A: ${item.draftA}`,
					`Open & post A: ${urls.a}`,
					'',
					...(item.draftB ? [`Draft B: ${item.draftB}`, `Open & post B: ${urls.b}`, ''] : [])
				]
			: [
					`DRAFTS FAILED for this take${item.failureReason ? `: ${truncate(item.failureReason, 160)}` : '.'}`,
					''
				];
		return [
			`${index + 1} of ${count}: ${truncate(candidate.question_text ?? 'Unknown question', 60)}${qLink ? ` (${qLink})` : ''}`,
			candidate.parent_comment_text
				? `Replying to: ${truncate(candidate.parent_comment_text, 140)}`
				: null,
			`Take (${describeAuthorType(candidate)}${candidate.low_effort ? ', low effort' : ''}):`,
			candidate.comment_text,
			'',
			...draftLines,
			`Write my own: ${urls.custom}`,
			`Skip: ${urls.skip}`
		]
			.filter((line) => line !== null)
			.join('\n');
	});

	const plainTextContent = [
		...notices.flatMap((notice) => [`!! ${notice}`, '']),
		intro,
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
// Run log
// ---------------------------------------------------------------------------
//
// Every run writes one row to app_error_events with source = 'host_digest':
// a 'running' row at the start, updated with the run summary at the end. A row
// still 'running' minutes later means the function was killed mid-run, the
// way this cron died silently through September 2026 (15 s default function
// limit vs. up to 90 s of drafting per take). Level: INFO healthy, WARN
// degraded, ERROR alarm.
//
//   SELECT created_at, level, message, context FROM app_error_events
//   WHERE source = 'host_digest' ORDER BY id DESC LIMIT 14;

type RunLevel = 'INFO' | 'WARN' | 'ERROR';
const RUN_LOG_ROUTE = '/api/cron/host-digest';

function formatUtc(iso: string): string {
	const ms = Date.parse(iso);
	return Number.isFinite(ms)
		? `${new Date(ms).toISOString().slice(0, 16).replace('T', ' ')} UTC`
		: iso;
}

/** Start time of the latest run if it never recorded a finish (killed). */
async function findDeadPreviousRun(supabase: any, nowMs: number): Promise<string | null> {
	try {
		const { data, error } = await supabase
			.from('app_error_events')
			.select('id, created_at, context')
			.eq('source', RUN_LOG_SOURCE)
			.order('id', { ascending: false })
			.limit(1)
			.maybeSingle();
		if (error || !data) return null;
		const startedMs = Date.parse(data.created_at);
		const stale = Number.isFinite(startedMs) && nowMs - startedMs > STALE_RUN_MS;
		return data.context?.status === 'running' && stale ? data.created_at : null;
	} catch {
		return null;
	}
}

async function startRunLog(
	supabase: any,
	trigger: HostDigestTrigger,
	startedAt: string
): Promise<number | null> {
	try {
		const { data, error } = await supabase
			.from('app_error_events')
			.insert({
				source: RUN_LOG_SOURCE,
				level: 'INFO',
				message: 'host digest running',
				route: RUN_LOG_ROUTE,
				context: { status: 'running', trigger, startedAt }
			})
			.select('id')
			.single();
		if (error || !data?.id) {
			console.error('Host digest run log could not start', error);
			return null;
		}
		return data.id as number;
	} catch (logError) {
		console.error('Host digest run log could not start', logError);
		return null;
	}
}

function describeRun(summary: HostDigestSummary): { level: RunLevel; message: string } {
	const level: RunLevel = summary.alarm
		? 'ERROR'
		: summary.fallbackDrafts > 0 || summary.previousRunDied
			? 'WARN'
			: 'INFO';
	const message = [
		`host digest ${summary.status}`,
		`${summary.candidates} new take${summary.candidates === 1 ? '' : 's'}`,
		`${summary.modelDrafts} fully drafted`,
		summary.failedDrafts ? `${summary.failedDrafts} with no usable draft` : null,
		summary.carriedOver ? `${summary.carriedOver} carried over` : null,
		summary.alarmReasons.length ? `ALARM: ${summary.alarmReasons.join('; ')}` : null
	]
		.filter(Boolean)
		.join(', ');
	return { level, message };
}

async function finishRunLog(
	supabase: any,
	runId: number | null,
	summary: HostDigestSummary,
	crash?: unknown
): Promise<void> {
	const { level, message } = describeRun(summary);
	const record = {
		level,
		message,
		error_name: crash instanceof Error ? crash.name : null,
		error_message: crash ? truncate(errorMessage(crash), 500) : (summary.error ?? null),
		context: { ...summary, recipient: summary.recipient ? 'configured' : null }
	};
	try {
		const { error } = runId
			? await supabase.from('app_error_events').update(record).eq('id', runId)
			: await supabase
					.from('app_error_events')
					.insert({ source: RUN_LOG_SOURCE, route: RUN_LOG_ROUTE, ...record });
		if (error) console.error('Host digest run log could not finish', error);
	} catch (logError) {
		console.error('Host digest run log could not finish', logError);
	}
}

/** The alarm the growth log asked for: takes but no drafts, or no email. */
function applyAlarm(summary: HostDigestSummary): void {
	const reasons: string[] = [];
	if (summary.candidates > 0 && summary.failedDrafts === summary.candidates) {
		reasons.push(
			`${summary.candidates} new take${summary.candidates === 1 ? '' : 's'} and 0 drafted`
		);
	}
	if (summary.insertFailures > 0) {
		reasons.push(
			`${summary.insertFailures} take${summary.insertFailures === 1 ? '' : 's'} could not be saved to the desk`
		);
	}
	if (summary.status === 'send_failed') reasons.push(`email failed: ${summary.error ?? 'unknown'}`);
	if (summary.status === 'no_recipient') reasons.push('PRIVATE_ADMIN_EMAIL is not configured');
	if (summary.status === 'crashed') reasons.push(`run crashed: ${summary.error ?? 'unknown'}`);
	summary.alarmReasons = reasons;
	summary.alarm = reasons.length > 0;
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

/** The window start: a day before the last digest that went out, at most 14 days back. */
export function hostDigestSince(nowMs: number, lastDigestMs: number | null): string {
	const floor = nowMs - MAX_LOOKBACK_MS;
	const fromLast = lastDigestMs === null ? floor : lastDigestMs - DIGEST_OVERLAP_MS;
	return new Date(Math.max(floor, fromLast)).toISOString();
}

async function mapWithConcurrency<T, R>(
	items: T[],
	limit: number,
	fn: (item: T) => Promise<R>
): Promise<R[]> {
	const results = new Array<R>(items.length);
	let next = 0;
	const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
		while (next < items.length) {
			const index = next;
			next += 1;
			results[index] = await fn(items[index]);
		}
	});
	await Promise.all(workers);
	return results;
}

const CARRIED_FAILURE_REASON = 'drafting failed when this take was first picked up';

/** Which stored drafts are real model drafts (never offer a template as one-tap). */
function usableDraftsFromRow(
	row: HostReplyDraftRow
): Pick<HostDigestItem, 'draftA' | 'draftB' | 'failureReason'> {
	const usable = row.model
		? [row.draft_a, row.draft_b].filter((text) => !FALLBACK_TEXTS.has(text))
		: [];
	return {
		draftA: usable[0] ?? null,
		draftB: usable[1] ?? null,
		failureReason: usable.length ? null : CARRIED_FAILURE_REASON
	};
}

export async function runHostDigest(deps: HostDigestDependencies = {}): Promise<HostDigestSummary> {
	const supabase = deps.supabase ?? (getSupabaseAdminClient() as any);
	const clock = deps.clock ?? Date.now;
	const startedMs = clock();
	const now = deps.now ? deps.now() : new Date();
	const trigger = deps.trigger ?? 'manual';

	const previousRunDied = await findDeadPreviousRun(supabase, now.getTime());
	const runId = await startRunLog(supabase, trigger, now.toISOString());

	const summary: HostDigestSummary = {
		trigger,
		status: 'no_takes',
		since: now.toISOString(),
		candidates: 0,
		drafted: 0,
		modelDrafts: 0,
		failedDrafts: 0,
		fallbackDrafts: 0,
		insertFailures: 0,
		carriedOver: 0,
		olderPending: 0,
		sent: false,
		recipient: null,
		alarm: false,
		alarmReasons: [],
		previousRunDied,
		durationMs: 0
	};

	try {
		await executeHostDigest(supabase, deps, { now, clock, startedMs, summary });
	} catch (runError) {
		summary.status = 'crashed';
		summary.error = truncate(errorMessage(runError), 300);
		applyAlarm(summary);
		summary.durationMs = clock() - startedMs;
		await finishRunLog(supabase, runId, summary, runError);
		throw runError;
	}

	applyAlarm(summary);
	summary.durationMs = clock() - startedMs;
	await finishRunLog(supabase, runId, summary);
	if (summary.alarm) {
		console.error('Host digest alarm', {
			status: summary.status,
			candidates: summary.candidates,
			failedDrafts: summary.failedDrafts,
			alarmReasons: summary.alarmReasons
		});
	}
	return summary;
}

async function executeHostDigest(
	supabase: any,
	deps: HostDigestDependencies,
	run: { now: Date; clock: () => number; startedMs: number; summary: HostDigestSummary }
): Promise<void> {
	const { now, clock, startedMs, summary } = run;
	const send = deps.send ?? sendEmail;
	const nowMs = now.getTime();
	const hostUserId = deps.hostUserId ?? resolveHostUserId();
	const recipient =
		(deps.recipient === undefined ? PRIVATE_ADMIN_EMAIL : deps.recipient)?.trim() || null;
	const baseUrl = deps.baseUrl ?? BASE_URL;
	const deadline = startedMs + (deps.draftBudgetMs ?? DEFAULT_DRAFT_BUDGET_MS);
	summary.recipient = recipient;

	summary.since = hostDigestSince(nowMs, await loadLastDigestSentAt(supabase));

	const { data: candidateRows, error: candidatesError } = await supabase.rpc(
		'get_host_digest_candidates',
		{ p_host_user_id: hostUserId, p_since: summary.since }
	);
	if (candidatesError) {
		throw new Error(
			`Failed to load host digest candidates: ${candidatesError.message ?? 'unknown error'}`
		);
	}
	const candidates = (Array.isArray(candidateRows) ? candidateRows : []) as HostDigestCandidate[];
	summary.candidates = candidates.length;

	// Every candidate gets a row, drafted or not, so it shows up in this email
	// and the RPC never offers it again. Takes drafting could not handle are
	// stored with fallback text and model = NULL and shown as "drafts failed".
	const llm = deps.llm ?? getDefaultLlm();
	const drafted = await mapWithConcurrency(candidates, DRAFT_CONCURRENCY, async (candidate) => {
		const drafts = await draftHostReplies(candidate, { llm, clock, deadline });
		if (drafts.usedFallback) summary.fallbackDrafts += 1;
		if (drafts.usable.length === 2) summary.modelDrafts += 1;
		if (drafts.usable.length === 0) summary.failedDrafts += 1;

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
			if (insertError?.code === '23505') {
				// A concurrent run already drafted this take; it is in that email.
				console.warn('Host draft already exists', { commentId: candidate.comment_id });
			} else {
				summary.insertFailures += 1;
				console.error('Host draft insert failed', {
					commentId: candidate.comment_id,
					insertError
				});
			}
			return null;
		}
		const item: HostDigestItem = {
			draftId: inserted.id,
			candidate,
			draftA: drafts.usable[0] ?? null,
			draftB: drafts.usable[1] ?? null,
			failureReason: drafts.failureReason
		};
		return item;
	});

	const items = drafted.filter((item): item is HostDigestItem => item !== null);
	summary.drafted = items.length;

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
		items.push({ draftId: draft.id, candidate, ...usableDraftsFromRow(draft) });
		summary.carriedOver += 1;
	}

	if (items.length === 0) return;

	const { count: olderPending } = await supabase
		.from('host_reply_drafts')
		.select('id', { count: 'exact', head: true })
		.eq('status', 'pending')
		.not('digest_sent_at', 'is', null);
	summary.olderPending = typeof olderPending === 'number' ? olderPending : 0;

	if (!recipient) {
		summary.status = 'no_recipient';
		summary.error = 'PRIVATE_ADMIN_EMAIL is not configured';
		return;
	}

	items.sort((a, b) => Date.parse(a.candidate.created_at) - Date.parse(b.candidate.created_at));
	const notices: string[] = [];
	if (summary.previousRunDied) {
		notices.push(
			`The digest run that started ${formatUtc(summary.previousRunDied)} never finished, so this email may cover more than a day.`
		);
	}
	if (summary.insertFailures > 0) {
		notices.push(
			`${summary.insertFailures} new take${summary.insertFailures === 1 ? '' : 's'} could not be saved to the desk and ${summary.insertFailures === 1 ? 'is' : 'are'} missing below. Check /admin/host-desk.`
		);
	}
	const email = buildHostDigestEmail(items, {
		now: nowMs,
		secret: deps.secret,
		baseUrl,
		olderPending: summary.olderPending,
		notices
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
		summary.status = 'send_failed';
		summary.error = result.error ?? 'Host digest send failed';
		return;
	}

	summary.sent = true;
	summary.status = 'sent';
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
}
