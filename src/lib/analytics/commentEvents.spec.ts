// src/lib/analytics/commentEvents.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { captureMock } = vi.hoisted(() => ({ captureMock: vi.fn() }));

vi.mock('$lib/analytics/posthog', () => ({
	capture: captureMock
}));

import {
	captureCommentCreated,
	captureCommentFailed,
	captureCommentStarted,
	normalizeServerCommentAnalytics
} from './commentEvents';

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

	it('joins an invited first answer to the recipient funnel without content or identity data', async () => {
		const inviteId = '11111111-1111-4111-8111-111111111111';

		await captureCommentCreated({
			commentId: 321,
			questionId: 9,
			questionUrl: 'what-keeps-you-grounded',
			parentType: 'question',
			commentKind: 'answer',
			surface: 'question_page',
			sourcePath: '/questions/what-keeps-you-grounded',
			inviteId,
			isAnonymous: true
		});

		expect(captureMock).toHaveBeenNthCalledWith(
			1,
			'comment_created',
			expect.objectContaining({
				comment_id: 321,
				invite_id: inviteId,
				acquisition_source: 'question_invite'
			})
		);
		expect(captureMock).toHaveBeenNthCalledWith(2, 'question_invite_recipient_answered', {
			invite_id: inviteId,
			comment_id: 321,
			question_id: 9,
			question_url: 'what-keeps-you-grounded',
			surface: 'question_page',
			is_anonymous: true,
			server_confirmed: true
		});
		for (const [, properties] of captureMock.mock.calls) {
			expect(properties).not.toHaveProperty('comment');
			expect(properties).not.toHaveProperty('fingerprint');
			expect(properties).not.toHaveProperty('email');
			expect(properties).not.toHaveProperty('user_id');
		}
	});

	it('captures composer start context without submitted content', async () => {
		await captureCommentStarted({
			questionId: 9,
			questionUrl: 'what-keeps-you-grounded',
			commentKind: 'answer',
			surface: 'homepage',
			sourcePath: '/',
			isAnonymous: true
		});

		expect(captureMock).toHaveBeenCalledWith('comment_started', {
			question_id: 9,
			question_url: 'what-keeps-you-grounded',
			comment_kind: 'answer',
			surface: 'homepage',
			source_path: '/',
			is_anonymous: true
		});
		expect(captureMock.mock.calls[0]?.[1]).not.toHaveProperty('comment');
	});

	it('limits failures to the declared stage and category fields', async () => {
		await captureCommentFailed({
			questionId: 9,
			questionUrl: 'what-keeps-you-grounded',
			commentKind: 'reply',
			surface: 'question_page',
			isAnonymous: false,
			failureStage: 'server_action',
			errorCategory: 'action_failure'
		});

		expect(captureMock).toHaveBeenCalledWith('comment_failed', {
			question_id: 9,
			question_url: 'what-keeps-you-grounded',
			comment_kind: 'reply',
			surface: 'question_page',
			is_anonymous: false,
			failure_stage: 'server_action',
			error_category: 'action_failure'
		});
		expect(captureMock.mock.calls[0]?.[1]).not.toHaveProperty('error');
		expect(captureMock.mock.calls[0]?.[1]).not.toHaveProperty('message');
	});

	it('adds precise success properties while keeping the compatibility flag', async () => {
		await captureCommentCreated({
			commentId: 500,
			questionId: 9,
			parentType: 'question',
			commentKind: 'answer',
			surface: 'question_page',
			isAnonymous: true,
			isFirstCommentEver: true,
			isFirstCommentOnQuestion: true,
			isReply: false,
			questionAgeHours: 2.25,
			responsesBeforeComment: 0
		});

		expect(captureMock).toHaveBeenCalledWith(
			'comment_created',
			expect.objectContaining({
				is_first_contribution: true,
				is_first_comment_ever: true,
				is_first_comment_on_question: true,
				is_reply: false,
				question_age_hours: 2.25,
				responses_before_comment: 0
			})
		);
	});

	it('normalizes privacy-safe metadata from the atomic server response', () => {
		expect(
			normalizeServerCommentAnalytics({
				id: 500,
				comment: 'never copied into analytics',
				_analytics: {
					is_first_comment_ever: true,
					is_first_comment_on_question: false,
					is_reply: true,
					question_age_hours: 12.5,
					responses_before_comment: 4
				}
			})
		).toEqual({
			isFirstCommentEver: true,
			isFirstCommentOnQuestion: false,
			isReply: true,
			questionAgeHours: 12.5,
			responsesBeforeComment: 4
		});
	});

	it('drops malformed server metadata instead of leaking arbitrary values', () => {
		expect(
			normalizeServerCommentAnalytics({
				_analytics: {
					is_first_comment_ever: 'yes',
					question_age_hours: -1,
					responses_before_comment: 'private',
					email: 'do-not-capture@example.com'
				}
			})
		).toEqual({});
	});
});
