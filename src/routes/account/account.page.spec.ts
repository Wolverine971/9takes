// src/routes/account/account.page.spec.ts
// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/forms', () => ({
	enhance: () => ({ destroy: vi.fn() })
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
});

describe('/account page', () => {
	it('hydrates server notification preferences without a reactive update loop', async () => {
		render(AccountPage, { data: baseData as any });

		expect(await screen.findByRole('link', { name: 'Admin dashboard' })).toBeTruthy();
		expect(
			(screen.getByRole('checkbox', { name: 'Someone replies to my take' }) as HTMLInputElement)
				.checked
		).toBe(false);
	});
});
