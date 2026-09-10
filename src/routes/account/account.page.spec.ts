// src/routes/account/account.page.spec.ts
// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { gotoMock, setUnreadMock, invalidateMock } = vi.hoisted(() => ({
	gotoMock: vi.fn(),
	setUnreadMock: vi.fn(),
	invalidateMock: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('$app/forms', () => ({
	deserialize: JSON.parse,
	enhance: () => ({ destroy: vi.fn() })
}));

vi.mock('$app/navigation', () => ({
	afterNavigate: vi.fn(),
	goto: gotoMock,
	invalidateAll: invalidateMock
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
		await fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
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

it('opens settings from the gear and returns keyboard focus to it', async () => {
	render(AccountPage, { data: baseData as any });
	const gear = screen.getByRole('button', { name: 'Settings' });
	expect(screen.queryByRole('textbox', { name: 'First name' })).toBeNull();
	await fireEvent.click(gear);
	expect(gear.getAttribute('aria-expanded')).toBe('true');
	await waitFor(() =>
		expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Account settings' }))
	);
	expect(
		(screen.getByRole('combobox', { name: 'Enneagram type' }) as HTMLSelectElement).value
	).toBe('8');
	await fireEvent.click(screen.getByRole('button', { name: /back to overview/i }));
	await waitFor(() => expect(document.activeElement).toBe(gear));
	expect(gear.getAttribute('aria-expanded')).toBe('false');
});

it('keeps the newest activity first before and after expansion and refresh', async () => {
	const items = [1, 5, 2, 4, 3].map((id) => ({
		id,
		kind: 'reply_to_take',
		actor_enneagram: '4',
		question_id: id,
		question_text: `Activity ${id}`,
		question_url: `activity-${id}`,
		comment_excerpt: `Reply ${id}`,
		created_at: `2026-09-0${id}T12:00:00Z`,
		read_at: null
	}));
	const data = { ...baseData, notifications: { available: true, unread: 5, items } };
	const view = render(AccountPage, { data: data as any });
	const rows = () =>
		[...view.container.querySelectorAll('#activity-feed .feed-question')].map(
			(el) => el.textContent
		);
	expect(rows()).toEqual(['Activity 5', 'Activity 4', 'Activity 3']);
	await fireEvent.click(screen.getByRole('button', { name: /show all activity/i }));
	await waitFor(() => expect(invalidateMock).toHaveBeenCalledTimes(1));
	expect(rows()).toEqual(['Activity 5', 'Activity 4', 'Activity 3', 'Activity 2', 'Activity 1']);
	const latest = {
		...items[0],
		id: 6,
		question_id: 6,
		question_text: 'Newest from refresh',
		created_at: '2026-09-06T12:00:00Z'
	};
	await view.rerender({
		data: { ...data, notifications: { ...data.notifications, items: [...items, latest] } } as any
	});
	await waitFor(() => expect(rows()[0]).toBe('Newest from refresh'));
	await fireEvent.click(screen.getByRole('button', { name: /show less activity/i }));
	expect(rows()).toHaveLength(3);
	expect(rows()[0]).toBe('Newest from refresh');
});

it('uses the latest event to order grouped activity even when input is unsorted', async () => {
	const item = {
		kind: 'take_on_answered_question',
		actor_enneagram: '2',
		question_id: 12,
		question_text: 'Shared question',
		question_url: 'shared',
		comment_excerpt: null,
		read_at: null
	};
	const view = render(AccountPage, {
		data: {
			...baseData,
			notifications: {
				available: true,
				unread: 3,
				items: [
					{ ...item, id: 1, created_at: '2026-09-01T00:00:00Z' },
					{
						...item,
						id: 2,
						question_id: 13,
						question_text: 'Other question',
						created_at: '2026-09-04T00:00:00Z'
					},
					{ ...item, id: 3, actor_enneagram: '8', created_at: '2026-09-05T00:00:00Z' }
				]
			}
		} as any
	});
	expect(view.container.querySelector('.feed-question')?.textContent).toBe('Shared question');
	expect(view.container.querySelector('time')?.dateTime).toBe('2026-09-05T00:00:00Z');
	expect(screen.getByText('2 new takes on a question you answered · Types 2, 8')).toBeTruthy();
});

it('keeps the saved type and recommendations consistent while editing, and restores it on cancel', async () => {
	render(AccountPage, { data: baseData as any });
	await fireEvent.click(screen.getByRole('button', { name: 'Change type' }));
	await fireEvent.click(screen.getByRole('radio', { name: /analytical, reserved/i }));
	expect(screen.getByRole('heading', { name: 'Type 8 · The Challenger' })).toBeTruthy();
	await fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
	expect(screen.queryByRole('button', { name: 'Save type' })).toBeNull();
});

it('uses a visible fallback when a portrait cannot load without losing the profile link', async () => {
	const view = render(AccountPage, {
		data: {
			...baseData,
			sharedTypePeople: [
				{
					slug: 'sam-parr',
					name: 'Sam Parr',
					personaTitle: 'The Builder',
					imagePath: '/types/8s/Sam-Parr.webp'
				}
			]
		} as any
	});
	const img = view.container.querySelector('.portrait img') as HTMLImageElement;
	expect(img.getAttribute('src')).toBe('/types/8s/Sam-Parr.webp');
	await fireEvent.error(img);
	expect(view.container.querySelector('.portrait-fallback')?.textContent).toBe('SP');
	expect(
		screen.getByRole('link', { name: /sam parr.*read the profile/i }).getAttribute('href')
	).toBe('/personality-analysis/sam-parr');
});

it('reports a rejected notification preference save instead of showing success', async () => {
	const { notifications } = await import('$lib/components/molecules/notifications');
	vi.stubGlobal(
		'fetch',
		vi.fn().mockResolvedValue({
			ok: true,
			text: async () => JSON.stringify({ type: 'success', data: { success: false } })
		})
	);
	render(AccountPage, { data: baseData as any });
	await fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
	await fireEvent.click(screen.getByRole('button', { name: 'Save notification settings' }));
	await waitFor(() =>
		expect(notifications.danger).toHaveBeenCalledWith('Failed to save notification settings', 3000)
	);
	expect(notifications.success).not.toHaveBeenCalled();
});
