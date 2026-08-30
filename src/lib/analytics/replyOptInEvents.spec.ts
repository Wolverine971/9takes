// src/lib/analytics/replyOptInEvents.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { captureMock } = vi.hoisted(() => ({ captureMock: vi.fn() }));

vi.mock('$lib/analytics/posthog', () => ({ capture: captureMock }));

import {
	captureReplyOptInFailed,
	captureReplyOptInShown,
	type ReplyOptInContext
} from './replyOptInEvents';

const context: ReplyOptInContext = {
	questionId: 42,
	questionUrl: 'a-question',
	commentId: 123,
	surface: 'question_page',
	isFirstCommentEver: true
};

describe('reply opt-in analytics', () => {
	beforeEach(() => {
		captureMock.mockReset();
		captureMock.mockResolvedValue(undefined);
	});

	it('captures the stable context without email, fingerprint, or token data', async () => {
		await captureReplyOptInShown(context);

		expect(captureMock).toHaveBeenCalledWith('reply_opt_in_shown', {
			question_id: 42,
			question_url: 'a-question',
			comment_id: 123,
			surface: 'question_page',
			is_first_comment_ever: true
		});
		expect(JSON.stringify(captureMock.mock.calls)).not.toMatch(/email|fingerprint|token/i);
	});

	it('uses a bounded failure category', async () => {
		await captureReplyOptInFailed(context, 'suppressed');

		expect(captureMock).toHaveBeenCalledWith(
			'reply_opt_in_failed',
			expect.objectContaining({ failure_category: 'suppressed' })
		);
	});
});
