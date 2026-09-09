// src/routes/account/account.page.spec.ts
// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { gotoMock, setUnreadMock } = vi.hoisted(() => ({
	gotoMock: vi.fn(),
	setUnreadMock: vi.fn()
}));

vi.mock('$app/forms', () => ({
	deserialize: JSON.parse,
	enhance: () => ({ destroy: vi.fn() })
}));

vi.mock('$app/navigation', () => ({
	goto: gotoMock,
	invalidateAll: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('$app/paths', () => ({ resolve: (path: string) => path }));

vi.mock('$lib/notificationCount.svelte', () => ({
	useNotificationCount: () => ({ unread: 0, setUnread: setUnreadMock })
}));

vi.mock('$lib/supabase', () => ({
	supabase: {
		auth: { signOut: vi.fn().mockResolvedValue({ error: null }) }
	}
}));

vi.mock('$lib/components/molecules/notifications', () => ({
	notifications: {
		danger: vi.fn(),
		success: vi.fn()
	}
}));

import AccountPage from './+page.svelte';

const baseData = {
	user: {
		first_name: 'DJ',
		last_name: 'Wayne',
		enneagram: '8',
		email: 'dj@example.com',
		admin: true
	},
	subscriptions: [],
	questionOfTheDay: null,
	sharedTypePeople: [],
	communityPulse: {
		newQuestions7d: 0,
		newTakes7d: 0,
		activeTypes7d: [],
		questionsAwaitingFirstTake: 0,
		totalQuestions: 0,
		totalTakes: 0
	},
	roomLively: false,
	personalStats: { takes: 0, questions: 0, repliesReceived: 0, likesReceived: 0 },
	yourTakes: [],
	activeQuestions: [],
	notifications: { available: true, items: [], unread: 0 },
	notificationPreferences: {
		reply_to_take: false,
		take_on_your_question: true,
		take_on_answered_question: true,
		like_on_take: true,
		email_digest: true
	}
};

afterEach(() => {
	cleanup();
	vi.clearAllMocks();
	vi.unstubAllGlobals();
});

describe('/account page', () => {
	it('keeps Save type visible after choosing a first type and persists the selection', async () => {
		const fetchMock = vi.fn().mockResolvedValue({
			ok: true,
			text: async () => JSON.stringify({ type: 'success', data: { success: true } })
		});
		vi.stubGlobal('fetch', fetchMock);
		render(AccountPage, {
			data: { ...baseData, user: { ...baseData.user, enneagram: 'unknown' } } as any
		});
		await fireEvent.click(await screen.findByRole('radio', { name: /analytical, reserved/i }));
		const saveButton = screen.getByRole('button', { name: 'Save type' });
		expect((saveButton as HTMLButtonElement).disabled).toBe(false);
		await fireEvent.click(saveButton);
		await waitFor(() => expect(fetchMock).toHaveBeenCalled());
		expect(fetchMock.mock.calls[0][1].body.get('enneagram')).toBe('5');
		await waitFor(() => expect(screen.queryByRole('button', { name: 'Save type' })).toBeNull());
	});

	it('keeps an unsaved type available for retry when the action fails', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				text: async () => JSON.stringify({ type: 'failure', data: { error: 'Could not save' } })
			})
		);
		render(AccountPage, {
			data: { ...baseData, user: { ...baseData.user, enneagram: 'unknown' } } as any
		});
		await fireEvent.click(await screen.findByRole('radio', { name: /analytical, reserved/i }));
		await fireEvent.click(screen.getByRole('button', { name: 'Save type' }));
		await waitFor(() =>
			expect(
				(screen.getByRole('button', { name: 'Save type' }) as HTMLButtonElement).disabled
			).toBe(false)
		);
		expect(screen.getByText('Unsaved')).toBeTruthy();
	});
	it('hydrates server notification preferences without a reactive update loop', async () => {
		render(AccountPage, { data: baseData as any });

		expect(await screen.findByRole('link', { name: 'Admin' })).toBeTruthy();
		expect(
			(screen.getByRole('checkbox', { name: 'Someone replies to my take' }) as HTMLInputElement)
				.checked
		).toBe(false);
	});

	it('updates read state and opens the question without waiting for the API', async () => {
		let finishRequest: (response: { ok: boolean }) => void = () => {};
		const pendingResponse = new Promise<{ ok: boolean }>((resolve) => {
			finishRequest = resolve;
		});
		const fetchMock = vi.fn().mockReturnValue(pendingResponse);
		vi.stubGlobal('fetch', fetchMock);
		const data = {
			...baseData,
			notifications: {
				available: true,
				unread: 1,
				items: [
					{
						id: 17,
						kind: 'reply_to_take',
						actor_enneagram: '4',
						question_id: 42,
						question_text: 'What helps you feel understood?',
						question_url: 'what-helps-you-feel-understood',
						comment_excerpt: 'A thoughtful reply',
						created_at: new Date().toISOString(),
						read_at: null
					}
				]
			}
		};

		render(AccountPage, { data: data as any });
		const notification = await screen.findByRole('link', {
			name: /a type 4 replied to your take/i
		});

		await fireEvent.click(notification);

		await waitFor(() => {
			expect(fetchMock).toHaveBeenCalledWith(
				'/api/notifications/read',
				expect.objectContaining({
					method: 'POST',
					body: JSON.stringify({ ids: [17] }),
					keepalive: true
				})
			);
			expect(gotoMock).toHaveBeenCalledWith('/questions/what-helps-you-feel-understood');
			expect(setUnreadMock).toHaveBeenCalledWith(0);
			expect(notification.closest('.feed-item')?.classList.contains('unread')).toBe(false);
		});

		finishRequest({ ok: true });
	});
});
