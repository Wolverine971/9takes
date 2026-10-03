// src/routes/design-preview/homepage-live-take/homepage-live-take.page.spec.ts
// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/paths', () => ({
	resolve: (path: string, params?: { slug: string }) => path.replace('[slug]', params?.slug ?? '')
}));
vi.mock('svelte/motion', () => ({ prefersReducedMotion: { current: false } }));
const { practiceMock } = vi.hoisted(() => ({ practiceMock: vi.fn() }));
vi.mock('$lib/analytics/marketingEvents', async (importOriginal) => ({
	...(await importOriginal<typeof import('$lib/analytics/marketingEvents')>()),
	captureHomepagePractice: practiceMock,
	captureHomepageLinkClicked: vi.fn()
}));

import Page from './+page.svelte';

const live = {
	questionId: 203,
	slug: 'whats-criteria-considering-someone-friend',
	title: 'What are your criteria for considering someone a friend?',
	responses: 10,
	signedIn: false,
	answered: false,
	ownTake: null,
	answers: []
};

beforeEach(() => {
	vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => null }));
	Object.defineProperty(Element.prototype, 'scrollIntoView', {
		configurable: true,
		value: vi.fn()
	});
});

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('homepage live-take preview', () => {
	it('stays noindex and frames the hero around the real live question', () => {
		render(Page, { props: { data: { live } as never } });
		expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toMatch(
			/^noindex, nofollow/
		);
		expect(screen.getByRole('heading', { name: live.title })).toBeTruthy();
		expect(screen.getByText('10 responses so far')).toBeTruthy();
		expect(screen.getByText(/Nothing is posted unless you choose to/)).toBeTruthy();
		expect(screen.getByRole('link', { name: 'Current homepage' }).getAttribute('href')).toBe('/');
	});

	it('offers an opt-in post after the reveal and simulates the unlock without leaking text', async () => {
		const { container } = render(Page, { props: { data: { live } as never } });
		const answer = 'Someone who shows up when it is inconvenient.';
		await fireEvent.input(screen.getByRole('textbox'), { target: { value: answer } });
		await fireEvent.click(screen.getByRole('button', { name: 'Reveal 9 perspectives' }));
		expect(await screen.findByText('10 responses from real people are waiting.')).toBeTruthy();
		expect(screen.getByText(/Preview: posting is simulated/)).toBeTruthy();

		await fireEvent.click(screen.getByRole('button', { name: 'Post anonymously and read them' }));
		await waitFor(() =>
			expect(
				screen.getByRole('heading', { name: 'You’re in. Here’s how others answered.' })
			).toBeTruthy()
		);
		expect(container.querySelectorAll('.live-take.locked')).toHaveLength(3);
		expect(
			screen.getByRole('link', { name: 'Open the full conversation' }).getAttribute('href')
		).toBe(`/questions/${live.slug}`);
		expect(screen.queryByRole('button', { name: 'Edit answer' })).toBeNull();
		expect(practiceMock.mock.calls.map(([input]) => input.step)).toContain('live_post_clicked');
		expect(JSON.stringify(practiceMock.mock.calls)).not.toContain(answer);
		// The preview never calls the real post endpoint.
		expect(vi.mocked(fetch).mock.calls.map(([input]) => String(input))).not.toContain(
			'/api/homepage/answer'
		);
	});

	it('shows real answers after posting when an admin preview loaded them', async () => {
		const withAnswers = {
			...live,
			answers: [
				{ id: 1, text: 'They remember the small things.', type: 2 },
				{ id: 2, text: 'I can be quiet around them.', type: null }
			]
		};
		render(Page, { props: { data: { live: withAnswers } as never } });
		await fireEvent.input(screen.getByRole('textbox'), { target: { value: 'Loyalty.' } });
		await fireEvent.click(screen.getByRole('button', { name: 'Reveal 9 perspectives' }));
		await fireEvent.click(
			await screen.findByRole('button', { name: 'Post anonymously and read them' })
		);
		expect(await screen.findByText('They remember the small things.')).toBeTruthy();
		expect(screen.getByText('ENNEAGRAM 2')).toBeTruthy();
		expect(screen.getByText('ANONYMOUS')).toBeTruthy();
	});
});
