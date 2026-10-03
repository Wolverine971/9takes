// src/lib/server/questionComments.ts
// Take-creation helpers shared by the question page's createComment action and
// POST /api/homepage/answer. Both surfaces run the same validation, rate limit,
// give-first access rule and atomic insert, so a take posted from the homepage
// is an ordinary take everywhere else (host digest, admin moderation, gate).
import { error } from '@sveltejs/kit';
import { load as cheerioLoad } from 'cheerio';
import type { z } from 'zod';

import { supabase } from '$lib/supabase';
import { fetchPublicHtml } from '$lib/server/safeExternalFetch';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import type { createCommentSchema } from '$lib/validation/questionSchemas';
import { extractFirstURL } from '../../utils/StringUtils';

// Rate limit configuration: 5 comments per minute
export const RATE_LIMIT_MAX_COMMENTS = 5;
export const RATE_LIMIT_WINDOW_SECONDS = 60;

export const PUBLIC_COMMENT_FIELDS =
	'id, comment, author_id, parent_id, parent_type, comment_count, created_at, modified_at, like_count';

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export interface CommentData {
	comment: string;
	parent_id: number;
	author_id: string | null;
	comment_count: number;
	ip: string;
	parent_type: string;
	fingerprint: string | null;
}

/**
 * Check if the user has exceeded the rate limit for comments
 * Returns true if allowed to comment, false if rate limited
 */
export async function checkRateLimit(
	fingerprint: string | undefined,
	ip: string
): Promise<boolean> {
	try {
		const { data, error: rpcError } = await (supabase.rpc as any)('check_comment_rate_limit', {
			p_fingerprint: fingerprint || null,
			p_ip: ip,
			p_max_comments: RATE_LIMIT_MAX_COMMENTS,
			p_window_seconds: RATE_LIMIT_WINDOW_SECONDS
		});

		if (rpcError) {
			// Keep the posting limit enforced when its backing store is unavailable.
			console.error('Rate limit check failed:', rpcError);
			return false;
		}

		return data === true;
	} catch (err) {
		console.error('Rate limit check error:', err);
		return false;
	}
}

export function resolveCommentAuthorId(
	claimedAuthorId: string | undefined,
	sessionUserId: string | null
): string | null {
	if (claimedAuthorId && !sessionUserId) {
		throw error(403, { message: 'Anonymous comments cannot claim a user id' });
	}
	if (claimedAuthorId && sessionUserId && claimedAuthorId !== sessionUserId) {
		throw error(403, { message: 'Cannot comment as another user' });
	}

	return sessionUserId;
}

/**
 * Give-first access rule for a new comment. Anonymous visitors may post one
 * top-level take per question and may not reply; signed-in users are not
 * limited here.
 */
export async function assertCommentAccess(
	input: CreateCommentInput,
	sessionUserId: string | null,
	demoTime: boolean
): Promise<void> {
	if (sessionUserId) return;

	if (input.parent_type === 'comment') {
		throw error(401, { message: 'You must register or login to reply to comments' });
	}

	if (!input.fingerprint) {
		throw error(400, { message: 'Missing visitor fingerprint' });
	}

	if (demoTime) return;

	const parentQuestionId = Number.parseInt(input.parent_id, 10);
	const hasAnswered = await checkUserAnswered(input.fingerprint, parentQuestionId, undefined);
	if (hasAnswered) {
		throw error(403, { message: 'You must register or login to comment multiple times' });
	}
}

export async function createCommentData(
	input: CreateCommentInput,
	ip: string,
	sessionUserId: string | null
): Promise<CommentData> {
	const comment = input.comment;
	const parent_id = input.parent_id;
	const parent_type = input.parent_type;
	const fingerprint = input.fingerprint;
	const author_id = resolveCommentAuthorId(input.author_id, sessionUserId);

	return {
		comment,
		parent_id: parseInt(parent_id),
		author_id,
		comment_count: 0,
		ip,
		parent_type,
		fingerprint: fingerprint || null
	};
}

/**
 * Production insert + count increment in one transaction. Returns the raw RPC
 * result so callers can tell the one-take-per-question guard apart from other
 * failures (see isOncePerQuestionError).
 */
export async function insertCommentAtomic(
	commentData: CommentData,
	parent_type: string
): Promise<{ data: any; error: any }> {
	return (getSupabaseAdminClient().rpc as any)('create_comment_atomic', {
		p_comment: commentData.comment,
		p_parent_id: commentData.parent_id,
		p_author_id: commentData.author_id || null,
		p_parent_type: parent_type,
		p_fingerprint: commentData.fingerprint || null,
		p_ip: commentData.ip
	});
}

/**
 * True for create_comment_atomic's anonymous one-take-per-question guard
 * ("Anonymous visitors can only comment once per question"). Kept narrow so
 * unrelated failures still surface as errors.
 */
export function isOncePerQuestionError(rpcError: unknown): boolean {
	const message =
		rpcError && typeof rpcError === 'object' && 'message' in rpcError
			? (rpcError as { message?: unknown }).message
			: rpcError;
	return /once per question/i.test(String(message ?? ''));
}

export async function handleCommentCreation(
	db: any,
	commentData: CommentData,
	parent_type: string,
	demo_time: boolean
): Promise<unknown> {
	// For demo mode, use regular insert (demo tables don't have the atomic RPC)
	if (demo_time) {
		const { data: record, error: addCommentError } = await (
			getSupabaseAdminClient().from('comments_demo') as any
		)
			.insert(commentData)
			.select(PUBLIC_COMMENT_FIELDS)
			.single();

		if (addCommentError) {
			console.error(addCommentError);
			throw error(500, { message: 'Failed to add comment' });
		}

		return record;
	}

	// For production, use atomic RPC that handles insert + count increment in one transaction
	const { data: record, error: rpcError } = await insertCommentAtomic(commentData, parent_type);

	if (rpcError) {
		console.error('Atomic comment creation failed:', rpcError);
		throw error(500, { message: 'Failed to add comment' });
	}

	return record;
}
export async function getQuestion(slug: string, demo_time: boolean, db: any = supabase) {
	const table = demo_time ? 'questions_demo' : 'questions';
	const subscriptions = demo_time ? 'subscriptions_demo' : 'subscriptions';
	const query = (db.from(table) as any).select(
		`id, question, question_formatted, url, context, data, author_id, created_at, updated_at, comment_count, es_id, img_url, ${subscriptions} (id, question_id, user_id)`
	);

	const { data, error: findQuestionError } = await (Number.isInteger(parseInt(slug))
		? query.eq('id', slug).not('removed', 'is', true).not('flagged', 'is', true).single()
		: query.eq('url', slug).not('removed', 'is', true).not('flagged', 'is', true).single());

	if (!data || findQuestionError) {
		return null;
	}
	return data;
}

/**
 * The give-first gate (can_see_comments_3): true once this fingerprint or
 * signed-in user has a take on the question. Pass the request's Supabase
 * client for signed-in users so auth.uid() resolves.
 */
export async function checkUserAnswered(
	cookie: string | undefined,
	questionId: number,
	userId: string | undefined,
	db: any = supabase
) {
	const { data } = await (db.rpc as any)('can_see_comments_3', {
		userfingerprint: cookie ?? null,
		questionid: questionId,
		userid: userId || null
	});
	return data;
}

interface OGData {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
}

async function fetchOGData(url: string): Promise<OGData> {
	try {
		const html = await fetchPublicHtml(url);
		const $ = cheerioLoad(html);

		const ogData: OGData = {};
		$('meta[property^="og:"]').each((_, element) => {
			const property = $(element).attr('property')?.slice(3);
			const content = $(element).attr('content');
			if (property && content) {
				ogData[property as keyof OGData] = content;
			}
		});

		return ogData;
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		console.error(`Error fetching OG data: ${message}`);
		return {};
	}
}

/** Background link enrichment for an accepted take that contains a URL. */
export async function parseUrls(comment: string, questionId: string): Promise<void> {
	const { url, domain } = extractFirstURL(comment);
	if (!domain || !url) return;

	try {
		const ogData = await fetchOGData(url);
		const domainId = await upsertDomain(domain);
		await upsertLink(url, domainId, questionId, ogData);
	} catch (err) {
		console.error('Error parsing URLs:', err);
		// Consider how you want to handle errors here
	}
}

async function upsertDomain(domain: string): Promise<number> {
	const { data, error: upsertError } = await (getSupabaseAdminClient().from('link_domains') as any)
		.upsert({ domain, updated_at: new Date().toISOString() })
		.select('id')
		.single();

	if (upsertError) throw new Error(`Failed to upsert domain: ${upsertError.message}`);
	if (!data) throw new Error('No data returned from domain upsert');

	return data.id;
}

async function upsertLink(
	url: string,
	domainId: number,
	questionId: string,
	ogData: OGData
): Promise<void> {
	const { error: upsertError } = await (getSupabaseAdminClient().from('links') as any).upsert({
		url,
		domain_id: domainId,
		updated_at: new Date().toISOString(),
		question_id: questionId,
		meta_title: ogData.title,
		meta_description: ogData.description,
		meta_image: ogData.image
	});

	if (upsertError) throw new Error(`Failed to upsert link: ${upsertError.message}`);
}
