// src/lib/server/replyNotificationReturn.ts
import { createHmac, timingSafeEqual } from 'node:crypto';
import { SUPABASE_SERVICE_KEY } from '$env/static/private';
import type { ReplyNotificationReturnContext } from '$lib/types/questions';

export type { ReplyNotificationReturnContext } from '$lib/types/questions';

export const REPLY_RETURN_COOKIE = '9t_reply_return';
export const REPLY_RETURN_COOKIE_PATH = '/questions';
export const REPLY_RETURN_MAX_AGE_SECONDS = 10 * 60;

type SignedReplyReturnPayload = ReplyNotificationReturnContext & {
	version: 1;
	expiresAt: number;
};

function getSigningSecret(explicitSecret?: string): string {
	const secret = explicitSecret || SUPABASE_SERVICE_KEY;
	if (!secret) throw new Error('Reply notification return signing secret is not configured');
	return secret;
}

function signPayload(payload: string, secret: string): string {
	return createHmac('sha256', secret).update(payload).digest('base64url');
}

function isPositiveInteger(value: unknown): value is number {
	return Number.isSafeInteger(value) && Number(value) > 0;
}

function isValidPayload(value: unknown): value is SignedReplyReturnPayload {
	if (!value || typeof value !== 'object') return false;
	const payload = value as Partial<SignedReplyReturnPayload>;
	return (
		payload.version === 1 &&
		isPositiveInteger(payload.expiresAt) &&
		isPositiveInteger(payload.outboxId) &&
		isPositiveInteger(payload.subscriptionId) &&
		isPositiveInteger(payload.questionId) &&
		isPositiveInteger(payload.commentId) &&
		isPositiveInteger(payload.replyCommentId) &&
		(payload.targetStatus === 'available' || payload.targetStatus === 'removed') &&
		(payload.subscriptionStatus === 'active' || payload.subscriptionStatus === 'stopped')
	);
}

export function signReplyNotificationReturn(
	context: ReplyNotificationReturnContext,
	options: { now?: number; secret?: string } = {}
): string {
	const payload: SignedReplyReturnPayload = {
		version: 1,
		expiresAt: (options.now ?? Date.now()) + REPLY_RETURN_MAX_AGE_SECONDS * 1000,
		...context
	};
	const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
	return `${encoded}.${signPayload(encoded, getSigningSecret(options.secret))}`;
}

export function verifyReplyNotificationReturn(
	value: string | undefined,
	options: { now?: number; secret?: string } = {}
): ReplyNotificationReturnContext | null {
	if (!value) return null;
	const [encoded, signature, extra] = value.split('.');
	if (!encoded || !signature || extra) return null;

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
		if (!isValidPayload(parsed) || parsed.expiresAt < (options.now ?? Date.now())) return null;
		return {
			outboxId: parsed.outboxId,
			subscriptionId: parsed.subscriptionId,
			questionId: parsed.questionId,
			commentId: parsed.commentId,
			replyCommentId: parsed.replyCommentId,
			targetStatus: parsed.targetStatus,
			subscriptionStatus: parsed.subscriptionStatus
		};
	} catch {
		return null;
	}
}
