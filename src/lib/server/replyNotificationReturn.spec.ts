// src/lib/server/replyNotificationReturn.spec.ts
import { describe, expect, it } from 'vitest';
import {
	signReplyNotificationReturn,
	verifyReplyNotificationReturn,
	type ReplyNotificationReturnContext
} from './replyNotificationReturn';

const SECRET = 'test-only-return-secret';
const NOW = Date.UTC(2026, 7, 12, 20, 0, 0);
const context: ReplyNotificationReturnContext = {
	outboxId: 91,
	subscriptionId: 22,
	questionId: 42,
	commentId: 100,
	replyCommentId: 101,
	targetStatus: 'available',
	subscriptionStatus: 'active'
};

describe('reply notification return cookie', () => {
	it('round-trips only the bounded return context', () => {
		const signed = signReplyNotificationReturn(context, { now: NOW, secret: SECRET });
		expect(verifyReplyNotificationReturn(signed, { now: NOW + 1_000, secret: SECRET })).toEqual(
			context
		);
		expect(signed).not.toMatch(/reader@example|fingerprint|management_token/i);
	});

	it('rejects tampering and expiration', () => {
		const signed = signReplyNotificationReturn(context, { now: NOW, secret: SECRET });
		expect(verifyReplyNotificationReturn(`${signed}x`, { now: NOW, secret: SECRET })).toBeNull();
		expect(
			verifyReplyNotificationReturn(signed, {
				now: NOW + 11 * 60 * 1000,
				secret: SECRET
			})
		).toBeNull();
	});
});
