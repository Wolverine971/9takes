// src/routes/admin/comments/comments.page.spec.ts
// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { dangerMock, deserializeMock, invalidateAllMock, successMock, warningMock } = vi.hoisted(
	() => ({
		dangerMock: vi.fn(),
		deserializeMock: vi.fn(),
		invalidateAllMock: vi.fn().mockResolvedValue(undefined),
		successMock: vi.fn(),
		warningMock: vi.fn()
	})
);

vi.mock('$app/forms', () => ({
	deserialize: deserializeMock
}));

vi.mock('$app/navigation', () => ({
	invalidateAll: invalidateAllMock
}));

vi.mock('$lib/components/molecules/notifications', () => ({
	notifications: {
		danger: dangerMock,
		success: successMock,
		warning: warningMock
	}
}));

import CommentsPage from './+page.svelte';

const baseData = {
	user: { id: 'admin-1', admin: true, external_id: 'admin' },
	comments: [],
	flaggedComments: [],
	blogComments: [],
	demoTime: false,
	currentPage: 0,
	hasMore: false
};

afterEach(() => {
	cleanup();
	vi.clearAllMocks();
	vi.unstubAllGlobals();
});

describe('/admin/comments page', () => {
	it('renders useful parent text, safe anonymous labels, and working pagination', () => {
		const { container } = render(CommentsPage, {
			data: {
				...baseData,
				hasMore: true,
				comments: [
					{
						id: 42,
						comment: 'Anonymous response',
						created_at: '2026-07-16T12:00:00.000Z',
						parent_id: 9,
						parent_type: 'question',
						removed: false,
						profiles: null,
						parentQuestion: {
							id: 9,
							question: 'What makes a conversation feel honest?',
							question_formatted: null,
							url: 'honest-conversation'
						}
					}
				]
			} as any
		});

		expect(
			screen.getByRole('link', { name: 'Q: What makes a conversation feel honest?' })
		).toBeTruthy();
		expect(screen.getByText('Anonymous').closest('a')).toBeNull();
		expect(container.querySelector('a[href*="undefined"]')).toBeNull();
		expect(screen.getByRole('link', { name: 'Next' }).getAttribute('href')).toBe('?page=1');
	});

	it('deserializes successful SvelteKit action responses before reporting success', async () => {
		deserializeMock.mockReturnValue({ type: 'success', status: 200, data: { success: true } });
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue(
				new Response(
					JSON.stringify({
						type: 'success',
						status: 200,
						data: '[{"success":1},true]'
					}),
					{ status: 200, headers: { 'content-type': 'application/json' } }
				)
			)
		);

		render(CommentsPage, {
			data: {
				...baseData,
				flaggedComments: [
					{
						id: 7,
						comment_id: 42,
						flagged_by: 'reporter-1',
						reason_id: 2,
						description: 'Personal attack',
						created_at: '2026-07-16T12:00:00.000Z',
						removed_at: null,
						cleared_at: null,
						comments: { id: 42, comment: 'Flagged response' },
						profiles: { email: 'reporter@example.com', external_id: 'reporter' },
						flag_reasons: { reason: 'Harassment' }
					}
				]
			} as any
		});

		await fireEvent.click(screen.getByRole('button', { name: 'Flagged 1' }));
		await fireEvent.click(screen.getByRole('button', { name: 'Approve' }));

		const dialog = await screen.findByRole('dialog', { name: 'Confirm comment action' });
		await fireEvent.click(within(dialog).getByRole('button', { name: 'Approve' }));

		await waitFor(() => expect(invalidateAllMock).toHaveBeenCalledOnce());
		expect(deserializeMock).toHaveBeenCalledWith(
			'{"type":"success","status":200,"data":"[{\\"success\\":1},true]"}'
		);
		expect(successMock).toHaveBeenCalledWith('Comment approved and unflagged', 3000);
		expect(dangerMock).not.toHaveBeenCalled();
	});
});
