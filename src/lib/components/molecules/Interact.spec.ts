// src/lib/components/molecules/Interact.spec.ts
// @vitest-environment jsdom

import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const {
	deserializeMock,
	notificationsSuccessMock,
	notificationsInfoMock,
	notificationsDangerMock,
	getOrCreateVisitorIdMock,
	captureCommentCreatedMock,
	captureCommentStartedMock,
	captureCommentFailedMock,
	normalizeServerCommentAnalyticsMock,
	captureMock,
	shareQuestionInviteMock,
	shouldUseNativeQuestionShareMock,
	recordQuestionInviteCreatedMock,
	fetchMock
} = vi.hoisted(() => ({
	deserializeMock: vi.fn(),
	notificationsSuccessMock: vi.fn(),
	notificationsInfoMock: vi.fn(),
	notificationsDangerMock: vi.fn(),
	getOrCreateVisitorIdMock: vi.fn(),
	captureCommentCreatedMock: vi.fn(),
	captureCommentStartedMock: vi.fn(),
	captureCommentFailedMock: vi.fn(),
	normalizeServerCommentAnalyticsMock: vi.fn(),
	captureMock: vi.fn(),
	shareQuestionInviteMock: vi.fn(),
	shouldUseNativeQuestionShareMock: vi.fn(),
	recordQuestionInviteCreatedMock: vi.fn(),
	fetchMock: vi.fn()
}));

vi.mock('$app/forms', () => ({
	deserialize: deserializeMock
}));

vi.mock('$lib/components/molecules/notifications', () => ({
	notifications: {
		success: notificationsSuccessMock,
		info: notificationsInfoMock,
		danger: notificationsDangerMock
	}
}));

vi.mock('$lib/analytics/visitorIdentity', () => ({
	getOrCreateVisitorId: getOrCreateVisitorIdMock
}));

vi.mock('$lib/analytics/commentEvents', () => ({
	captureCommentCreated: captureCommentCreatedMock,
	captureCommentStarted: captureCommentStartedMock,
	captureCommentFailed: captureCommentFailedMock,
	normalizeServerCommentAnalytics: normalizeServerCommentAnalyticsMock
}));

vi.mock('$lib/analytics/posthog', () => ({
	capture: captureMock
}));

vi.mock('$lib/analytics/questionInvites', async (importOriginal) => {
	const actual = await importOriginal<typeof import('$lib/analytics/questionInvites')>();
	return {
		...actual,
		recordQuestionInviteCreated: recordQuestionInviteCreatedMock,
		shareQuestionInvite: shareQuestionInviteMock,
		shouldUseNativeQuestionShare: shouldUseNativeQuestionShareMock
	};
});

vi.mock('svelte/transition', () => ({
	slide: vi.fn(() => ({
		duration: 0
	}))
}));

import Interact from './Interact.svelte';

describe('Interact', () => {
	beforeEach(() => {
		window.history.replaceState({}, '', '/');
		window.localStorage.clear();
		deserializeMock.mockReset();
		deserializeMock.mockReturnValue({
			type: 'success',
			data: {
				id: 123,
				comment: 'Posted comment',
				_analytics: { is_first_comment_ever: true }
			}
		});
		normalizeServerCommentAnalyticsMock.mockReset();
		normalizeServerCommentAnalyticsMock.mockReturnValue({
			isFirstCommentEver: true,
			isFirstCommentOnQuestion: true,
			isReply: false,
			questionAgeHours: 1,
			responsesBeforeComment: 0
		});

		notificationsSuccessMock.mockReset();
		notificationsInfoMock.mockReset();
		notificationsDangerMock.mockReset();

		getOrCreateVisitorIdMock.mockReset();
		getOrCreateVisitorIdMock.mockReturnValue('visitor-123');
		captureCommentCreatedMock.mockReset();
		captureCommentCreatedMock.mockResolvedValue(undefined);
		captureCommentStartedMock.mockReset();
		captureCommentStartedMock.mockResolvedValue(undefined);
		captureCommentFailedMock.mockReset();
		captureCommentFailedMock.mockResolvedValue(undefined);
		captureMock.mockReset();
		captureMock.mockResolvedValue(undefined);
		shouldUseNativeQuestionShareMock.mockReset();
		shouldUseNativeQuestionShareMock.mockReturnValue(false);
		shareQuestionInviteMock.mockReset();
		shareQuestionInviteMock.mockResolvedValue({
			status: 'shared',
			method: 'clipboard',
			inviteId: '11111111-1111-4111-8111-111111111111',
			inviteUrl:
				'https://9takes.com/questions/what-are-you-thinking-about-these-days?via=11111111-1111-4111-8111-111111111111'
		});
		recordQuestionInviteCreatedMock.mockReset();
		recordQuestionInviteCreatedMock.mockResolvedValue(undefined);

		fetchMock.mockReset();
		fetchMock.mockResolvedValue({
			text: vi.fn().mockResolvedValue('{"type":"success","data":"[]"}')
		});

		vi.stubGlobal('fetch', fetchMock);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('Should be able to add comment', async () => {
		const inviteId = '11111111-1111-4111-8111-111111111111';
		window.history.replaceState(
			{},
			'',
			`/questions/what-are-you-thinking-about-these-days?via=${inviteId}&utm_campaign=welcome-sequence`
		);
		const oncommentAdded = vi.fn();
		const longComment =
			'This is a detailed comment that is intentionally long enough to avoid the short-answer confirmation path and submit immediately.';

		const { getByRole, queryByRole, queryByText } = render(Interact, {
			intro: false,
			props: {
				parentType: 'question',
				questionId: 85,
				user: null,
				oncommentAdded,
				data: {
					question: {
						id: 85,
						question: 'what are you thinking about these days',
						created_at: '2023-09-22T05:23:03.858015+00:00',
						url: 'what-are-you-thinking-about-these-days',
						img_url: '',
						es_id: '48FXu4oBxTGqyww5ba_8',
						comment_count: 10,
						removed: false,
						flagged: false,
						subscriptions: []
					},
					comments: [],
					removedComments: [],
					comment_count: 11,
					removed_comment_count: 0,
					questionTags: [],
					user: null,
					flags: {
						userHasAnswered: false,
						userSignedIn: false
					},
					aiComments: null,
					links: null,
					links_count: 0,
					flagReasons: []
				}
			}
		});

		// Composer opens by default for unanswered question-level visitors (give-first wall).
		expect(queryByText(/press ctrl/i)).toBeNull();

		const commentBox = getByRole('textbox');
		await fireEvent.input(commentBox, {
			target: { value: longComment }
		});

		const button = getByRole('button', { name: /post answer/i });
		await fireEvent.click(button);

		await waitFor(() => {
			expect(fetchMock).toHaveBeenCalledTimes(1);
		});

		expect(fetchMock).toHaveBeenCalledWith(
			'?/createCommentRando',
			expect.objectContaining({
				method: 'POST',
				body: expect.any(FormData)
			})
		);
		expect(deserializeMock).toHaveBeenCalledWith('{"type":"success","data":"[]"}');
		expect(oncommentAdded).toHaveBeenCalledWith(
			expect.objectContaining({
				id: 123,
				comment: 'Posted comment'
			})
		);
		expect(notificationsSuccessMock).toHaveBeenCalledWith('Answer posted', 3000);
		expect(captureCommentCreatedMock).toHaveBeenCalledWith({
			commentId: 123,
			questionId: 85,
			questionUrl: 'what-are-you-thinking-about-these-days',
			parentType: 'question',
			commentKind: 'answer',
			surface: 'question_page',
			sourcePath: '/questions/what-are-you-thinking-about-these-days',
			campaign: 'welcome-sequence',
			inviteId,
			isAnonymous: true,
			isFirstCommentEver: true,
			isFirstCommentOnQuestion: true,
			isReply: false,
			questionAgeHours: 1,
			responsesBeforeComment: 0
		});
		expect(normalizeServerCommentAnalyticsMock).toHaveBeenCalledWith(
			expect.objectContaining({ id: 123 })
		);
		expect(captureCommentStartedMock).toHaveBeenCalledTimes(1);
		expect(queryByRole('textbox')).toBeNull();
	});

	it('caps long answers and keeps the textarea internally scrollable', async () => {
		const { getByRole } = render(Interact, {
			intro: false,
			props: {
				parentType: 'question',
				questionId: 85,
				user: null,
				data: {
					question: {
						id: 85,
						question: 'what are you thinking about these days',
						created_at: '2023-09-22T05:23:03.858015+00:00',
						url: 'what-are-you-thinking-about-these-days',
						img_url: '',
						es_id: '48FXu4oBxTGqyww5ba_8',
						comment_count: 10,
						removed: false,
						flagged: false,
						subscriptions: []
					},
					comments: [],
					removedComments: [],
					comment_count: 11,
					removed_comment_count: 0,
					questionTags: [],
					user: null,
					flags: {
						userHasAnswered: false,
						userSignedIn: false
					},
					aiComments: null,
					links: null,
					links_count: 0,
					flagReasons: []
				}
			}
		});

		// Composer opens by default for unanswered question-level visitors (give-first wall).

		const commentBox = getByRole('textbox') as HTMLTextAreaElement;
		Object.defineProperty(commentBox, 'scrollHeight', {
			configurable: true,
			value: 5_000
		});

		await fireEvent.input(commentBox, {
			target: { value: 'A very long answer '.repeat(500) }
		});

		expect(commentBox.style.height).toBe('320px');
		expect(commentBox.classList.contains('overflow-y-auto')).toBe(true);
	});

	it('uses direct share as the primary toolbar action and records its invite', async () => {
		const { getByRole } = render(Interact, {
			intro: false,
			props: {
				parentType: 'question',
				questionId: 85,
				user: null,
				data: {
					question: {
						id: 85,
						question: 'what are you thinking about these days',
						created_at: '2023-09-22T05:23:03.858015+00:00',
						url: 'what-are-you-thinking-about-these-days',
						img_url: '',
						es_id: '48FXu4oBxTGqyww5ba_8',
						comment_count: 10,
						removed: false,
						flagged: false,
						subscriptions: []
					},
					comments: [],
					removedComments: [],
					comment_count: 10,
					removed_comment_count: 0,
					questionTags: [],
					user: null,
					flags: { userHasAnswered: true, userSignedIn: false },
					aiComments: null,
					links: null,
					links_count: 0,
					flagReasons: []
				}
			}
		});

		await fireEvent.click(getByRole('button', { name: 'Share this question' }));

		expect(shareQuestionInviteMock).toHaveBeenCalledWith(
			expect.objectContaining({
				baseUrl: 'https://9takes.com/questions/what-are-you-thinking-about-these-days',
				share: undefined
			})
		);
		expect(recordQuestionInviteCreatedMock).toHaveBeenCalledWith({
			inviteId: '11111111-1111-4111-8111-111111111111',
			questionId: 85,
			questionUrl: 'what-are-you-thinking-about-these-days',
			source: 'question-toolbar',
			method: 'clipboard'
		});
		expect(notificationsSuccessMock).toHaveBeenCalledWith('Invite link copied', 3000);
	});

	it('allows an anonymous user to submit a short first comment after confirmation', async () => {
		const shortComment = 'Short first take';

		const { getByRole, getByText } = render(Interact, {
			intro: false,
			props: {
				parentType: 'question',
				questionId: 85,
				user: null,
				oncommentAdded: vi.fn(),
				data: {
					question: {
						id: 85,
						question: 'what are you thinking about these days',
						created_at: '2023-09-22T05:23:03.858015+00:00',
						url: 'what-are-you-thinking-about-these-days',
						img_url: '',
						es_id: '48FXu4oBxTGqyww5ba_8',
						comment_count: 0,
						removed: false,
						flagged: false,
						subscriptions: []
					},
					comments: [],
					removedComments: [],
					comment_count: 0,
					removed_comment_count: 0,
					questionTags: [],
					user: null,
					flags: {
						userHasAnswered: false,
						userSignedIn: false
					},
					aiComments: null,
					links: null,
					links_count: 0,
					flagReasons: []
				}
			}
		});

		// Composer opens by default for unanswered question-level visitors (give-first wall).

		const commentBox = getByRole('textbox');
		await fireEvent.input(commentBox, {
			target: { value: shortComment }
		});

		await fireEvent.click(getByRole('button', { name: /post answer/i }));

		expect(fetchMock).not.toHaveBeenCalled();
		expect(getByText(/your answer could go deeper\./i)).toBeTruthy();

		await fireEvent.click(getByRole('button', { name: /post anyway/i }));

		await waitFor(() => {
			expect(fetchMock).toHaveBeenCalledTimes(1);
		});

		expect(notificationsInfoMock).not.toHaveBeenCalledWith(
			'Must register or login to comment multiple times',
			3000
		);
		expect(notificationsSuccessMock).toHaveBeenCalledWith('Answer posted', 3000);
	});
});
