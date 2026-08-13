// src/lib/components/questions/ReplyNotificationReturn.spec.ts
// @vitest-environment jsdom

import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { captureMock } = vi.hoisted(() => ({ captureMock: vi.fn().mockResolvedValue(undefined) }));

vi.mock('$lib/analytics/replyNotificationReturnEvents', () => ({
	captureReplyNotificationReturnEvent: captureMock
}));

import ReplyNotificationReturn from './ReplyNotificationReturn.svelte';
import type {
	Comment,
	ReplyNotificationReturnContext,
	ReplyNotificationThread
} from '$lib/types/questions';

const context: ReplyNotificationReturnContext = {
	outboxId: 91,
	subscriptionId: 22,
	questionId: 42,
	commentId: 100,
	replyCommentId: 101,
	targetStatus: 'available',
	subscriptionStatus: 'active'
};

function comment(id: number, text: string, parentType: 'question' | 'comment'): Comment {
	return {
		id,
		comment: text,
		author_id: null,
		parent_id: parentType === 'question' ? 42 : 100,
		parent_type: parentType,
		created_at: '2026-08-12T20:00:00.000Z',
		comment_count: parentType === 'question' ? 1 : 0,
		profiles: null
	};
}

const thread: ReplyNotificationThread = {
	parent: comment(100, 'My earlier take', 'question'),
	reply: comment(101, 'A thoughtful direct reply', 'comment')
};

describe('ReplyNotificationReturn', () => {
	beforeEach(() => {
		captureMock.mockClear();
		window.localStorage.clear();
		vi.stubGlobal(
			'matchMedia',
			vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
		);
		Element.prototype.scrollIntoView = vi.fn();
	});

	it('shows the subscribed take and exact reply without a modal or login wall', async () => {
		const { getByRole, getByText, queryByText } = render(ReplyNotificationReturn, {
			props: { context, thread }
		});

		expect(getByText('My earlier take')).toBeTruthy();
		expect(getByText('A thoughtful direct reply')).toBeTruthy();
		expect(queryByText(/log in|sign up/i)).toBeNull();
		expect(document.querySelector('[role="dialog"]')).toBeNull();

		await waitFor(() => {
			expect(captureMock).toHaveBeenCalledWith('reply_notification_landed', context, {
				revisit: false
			});
			expect(captureMock).toHaveBeenCalledWith('reply_target_visible', context, { revisit: false });
		});
		expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
			behavior: 'auto',
			block: 'center'
		});
		expect(document.activeElement).toBe(
			getByRole('heading', { name: 'Someone added to your conversation' })
		);

		await waitFor(() => {
			expect(getByRole('link', { name: 'Read the rest of the discussion' })).toBeTruthy();
		});
		await fireEvent.click(getByRole('link', { name: 'Read the rest of the discussion' }));
		expect(captureMock).toHaveBeenCalledWith('reply_notification_return_action', context, {
			action_type: 'read_discussion',
			revisit: false
		});
		expect(JSON.stringify(captureMock.mock.calls)).not.toMatch(/email|token|fingerprint/i);
	});

	it('uses a calm fallback and preserves stopped-subscription context', async () => {
		const removedContext: ReplyNotificationReturnContext = {
			...context,
			targetStatus: 'removed',
			subscriptionStatus: 'stopped'
		};
		const { getByText, queryByText } = render(ReplyNotificationReturn, {
			props: { context: removedContext, thread: { parent: thread.parent, reply: null } }
		});

		expect(getByText('This reply is no longer available.')).toBeTruthy();
		expect(getByText('Email updates for this conversation are off.')).toBeTruthy();
		expect(queryByText('A thoughtful direct reply')).toBeNull();
		await waitFor(() => {
			expect(captureMock).toHaveBeenCalledWith('reply_notification_landed', removedContext, {
				revisit: false
			});
		});
		expect(captureMock).not.toHaveBeenCalledWith(
			'reply_target_visible',
			expect.anything(),
			expect.anything()
		);
	});

	it('softens the new-reply treatment after it has been visible', async () => {
		vi.useFakeTimers();
		vi.stubGlobal(
			'matchMedia',
			vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
		);

		try {
			const { getByText, queryByText } = render(ReplyNotificationReturn, {
				props: { context, thread }
			});

			await Promise.resolve();
			await Promise.resolve();
			expect(getByText('New reply')).toBeTruthy();

			await vi.advanceTimersByTimeAsync(4_000);
			expect(getByText('Reply')).toBeTruthy();
			expect(queryByText('New reply')).toBeNull();
		} finally {
			vi.useRealTimers();
		}
	});
});
