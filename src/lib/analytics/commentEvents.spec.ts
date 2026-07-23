import { beforeEach, describe, expect, it, vi } from 'vitest';

const { captureMock } = vi.hoisted(() => ({ captureMock: vi.fn() }));

vi.mock('$lib/analytics/posthog', () => ({
	capture: captureMock
}));

import { captureCommentCreated } from './commentEvents';

describe('captureCommentCreated', () => {
	beforeEach(() => {
		captureMock.mockReset();
		captureMock.mockResolvedValue(undefined);
	});

	it('captures the canonical server-confirmed event without comment content', async () => {
		await captureCommentCreated({
			commentId: 123,
			questionId: 567,
			questionUrl: 'whats-something-every-day-seem-fine-nobody-knows-costing-effort',
			parentType: 'question',
			commentKind: 'answer',
			surface: 'strategic_question',
			sourcePath: '/enneagram-corner/enneagram-and-adhd-which-types-struggle-most',
			campaign: 'wave1-masking',
			isAnonymous: true
		});

		expect(captureMock).toHaveBeenCalledWith('comment_created', {
			comment_id: 123,
			question_id: 567,
			parent_type: 'question',
			comment_kind: 'answer',
			surface: 'strategic_question',
			is_first_contribution: true,
			is_anonymous: true,
			server_confirmed: true,
			question_url: 'whats-something-every-day-seem-fine-nobody-knows-costing-effort',
			source_path: '/enneagram-corner/enneagram-and-adhd-which-types-struggle-most',
			campaign: 'wave1-masking'
		});
		expect(captureMock.mock.calls[0]?.[1]).not.toHaveProperty('comment');
		expect(captureMock.mock.calls[0]?.[1]).not.toHaveProperty('fingerprint');
	});

	it('does not emit when the server did not return a new comment id', async () => {
		await captureCommentCreated({
			commentId: null,
			questionId: 567,
			parentType: 'question',
			commentKind: 'answer',
			surface: 'homepage',
			isAnonymous: true
		});

		expect(captureMock).not.toHaveBeenCalled();
	});
});
