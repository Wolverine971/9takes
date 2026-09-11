// src/routes/design-preview/harry-dry-v2/harry-dry-v2.page.spec.ts
// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/paths', () => ({
	resolve: (path: string, params?: { slug: string }) => path.replace('[slug]', params?.slug ?? '')
}));

vi.mock('svelte/motion', () => ({ prefersReducedMotion: { current: false } }));

import Page from './+page.svelte';
const proof = {
	totalQuestions: 4,
	totalResponses: 12,
	questions: [{ slug: 'good-friend', title: 'What makes a good friend?', responses: 7 }]
};
beforeEach(() => {
	vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => proof }));
});
const originalScroll = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollIntoView');

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
	if (originalScroll) Object.defineProperty(Element.prototype, 'scrollIntoView', originalScroll);
	else Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
});

describe('Harry Dry V2', () => {
	it('identifies V2, stays noindex, and links to the preserved V1 comparison', async () => {
		const { container } = render(Page);
		expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toMatch(
			/^noindex, nofollow/
		);
		expect(screen.getByRole('link', { name: 'Compare V1' }).getAttribute('href')).toBe(
			'/design-preview/harry-dry'
		);
		expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
			'1 question.9 perspectives.'
		);
		expect(screen.getByText('Write yours first, before another take shapes it.')).toBeTruthy();
		await waitFor(() => expect(container.querySelector('.community-question')).toBeTruthy());
		expect(container.querySelector('.community-question')?.getAttribute('href')).toBe(
			'/questions/good-friend'
		);
		expect(container.querySelector('.community-signal')?.textContent).toContain(
			'12 responses across 4 questions'
		);
		expect(container.textContent).not.toContain('§');
	});

	it('keeps the draft private while making the live conversation the primary next action', async () => {
		Object.defineProperty(Element.prototype, 'scrollIntoView', {
			configurable: true,
			value: vi.fn()
		});
		const { container } = render(Page);
		const answer = 'I value honest conversation.';
		await fireEvent.input(screen.getByRole('textbox'), { target: { value: answer } });
		await fireEvent.click(screen.getByRole('button', { name: 'Reveal 9 perspectives' }));
		await waitFor(() => expect(container.querySelector('.comparison')).toBeTruthy());
		expect(fetch).toHaveBeenCalledTimes(1);
		expect(fetch).toHaveBeenCalledWith('/api/homepage/community', {
			signal: expect.any(AbortSignal)
		});
		const copies = [...container.querySelectorAll('blockquote')].filter(
			(el) => el.textContent === answer
		);
		expect(copies).toHaveLength(2);
		for (const copy of copies) expect(copy.closest('.ph-no-capture')).toBeTruthy();
		expect(document.activeElement?.id).toBe('reveal-title');
		const liveLink = screen.getByRole('link', { name: 'Join the friendship conversation' });
		expect(liveLink.classList.contains('btn--primary')).toBe(true);
		expect(liveLink.getAttribute('href')).toBe(
			'/questions/whats-criteria-considering-someone-friend'
		);
		expect(
			screen
				.getByRole('button', { name: 'Try the dinner question' })
				.classList.contains('btn--secondary')
		).toBe(true);
		await fireEvent.click(screen.getByRole('button', { name: 'Try the dinner question' }));
		expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe('');
		expect(container.querySelector('.comparison')).toBeNull();
	});

	it('offers a useful community link without manufacturing activity when data is unavailable', () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => null }));
		const { container } = render(Page);
		expect(container.querySelector('.community-signal')).toBeNull();
		expect(screen.getByRole('link', { name: 'Browse questions' }).getAttribute('href')).toBe(
			'/questions'
		);
		expect(screen.getByRole('button', { name: 'Reveal 9 perspectives' })).toBeTruthy();
	});
});
