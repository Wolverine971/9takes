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
	fetchMock
} = vi.hoisted(() => ({
	deserializeMock: vi.fn(),
	notificationsSuccessMock: vi.fn(),
	notificationsInfoMock: vi.fn(),
	notificationsDangerMock: vi.fn(),
	getOrCreateVisitorIdMock: vi.fn(),
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

vi.mock('svelte/transition', () => ({
	slide: vi.fn(() => ({
		duration: 0
	}))
}));

import Interact from './Interact.svelte';

describe('Interact', () => {
	beforeEach(() => {
		deserializeMock.mockReset();
		deserializeMock.mockReturnValue({
			type: 'success',
			data: {
				id: 123,
				comment: 'Posted comment'
			}
		});

		notificationsSuccessMock.mockReset();
		notificationsInfoMock.mockReset();
		notificationsDangerMock.mockReset();

		getOrCreateVisitorIdMock.mockReset();
		getOrCreateVisitorIdMock.mockReturnValue('visitor-123');

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
		const oncommentAdded = vi.fn();
		const longComment =
			'This is a detailed comment that is intentionally long enough to avoid the short-answer confirmation path and submit immediately.';

		const { getByRole } = render(Interact, {
			intro: false,
			props: {
				parentType: 'question',
				questionId: 85,
				qrCodeUrl: '',
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

		const commentBox = getByRole('textbox');
		await fireEvent.input(commentBox, {
			target: { value: longComment }
		});

		const button = getByRole('button', { name: /post comment/i });
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
		expect(oncommentAdded).toHaveBeenCalledWith({
			id: 123,
			comment: 'Posted comment'
		});
		expect(notificationsSuccessMock).toHaveBeenCalledWith('Comment Added', 3000);
		expect((commentBox as HTMLTextAreaElement).value).toBe('');
	});

	it('allows an anonymous user to submit a short first comment after confirmation', async () => {
		const shortComment = 'Short first take';

		const { getByRole, getByText } = render(Interact, {
			intro: false,
			props: {
				parentType: 'question',
				questionId: 85,
				qrCodeUrl: '',
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

		const commentBox = getByRole('textbox');
		await fireEvent.input(commentBox, {
			target: { value: shortComment }
		});

		await fireEvent.click(getByRole('button', { name: /post comment/i }));

		expect(fetchMock).not.toHaveBeenCalled();
		expect(getByText(/your take could go deeper\./i)).toBeTruthy();

		await fireEvent.click(getByRole('button', { name: /post anyway/i }));

		await waitFor(() => {
			expect(fetchMock).toHaveBeenCalledTimes(1);
		});

		expect(notificationsInfoMock).not.toHaveBeenCalledWith(
			'Must register or login to comment multiple times',
			3000
		);
		expect(notificationsSuccessMock).toHaveBeenCalledWith('Comment Added', 3000);
	});
});
