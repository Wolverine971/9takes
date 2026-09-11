// src/routes/homepage.page.spec.ts
// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/paths', () => ({
	resolve: (path: string, params?: { slug: string }) => path.replace('[slug]', params?.slug ?? '')
}));
vi.mock('svelte/motion', () => ({ prefersReducedMotion: { current: false } }));

import Homepage from './+page.svelte';
import { load } from './+page';
import HomepagePreview from './design-preview/harry-dry/+page.svelte';

const originalScroll = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollIntoView');
beforeEach(() => {
	vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => null }));
});

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
	if (originalScroll) Object.defineProperty(Element.prototype, 'scrollIntoView', originalScroll);
	else Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
});

describe('promoted homepage', () => {
	it('uses indexable homepage metadata and delegates navigation to the shared site header', () => {
		const { container } = render(Homepage);
		expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
			'https://9takes.com'
		);
		expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toMatch(
			/^index, follow/
		);
		expect(load({} as never)).toEqual({ pageChrome: 'header', pageShell: 'owned' });
		expect(screen.queryByRole('navigation')).toBeNull();
		expect(container.querySelector('header')).toBeNull();
		expect(document.title).toBe('1 Question, 9 Perspectives | 9takes');
		expect(container.textContent).not.toMatch(/§|PREVIEW|Current homepage|Compare V1|V2/);
		expect(screen.getByText('Write yours first, before another take shapes it.')).toBeTruthy();
		expect(screen.getByText('“How are you?”')).toBeTruthy();
		expect(
			screen.getByRole('heading', { name: /The same situation\.\s*Two different emergencies\./ })
		).toBeTruthy();
		expect(container.querySelectorAll('.scene-stage img')).toHaveLength(5);
		const structuredData = [
			...document.head.querySelectorAll('script[type="application/ld+json"]')
		].map((script) => JSON.parse(script.textContent ?? '{}'));
		expect(structuredData).toContainEqual(
			expect.objectContaining({
				'@type': 'WebPage',
				'@id': 'https://9takes.com/#webpage',
				url: 'https://9takes.com'
			})
		);
	});

	it('keeps a practice answer local and capture-blocked when revealing perspectives', async () => {
		Object.defineProperty(Element.prototype, 'scrollIntoView', {
			configurable: true,
			value: vi.fn()
		});
		const { container } = render(Homepage);
		const answer = 'Private test answer: listen before judging.';
		await fireEvent.input(screen.getByRole('textbox'), { target: { value: answer } });
		await fireEvent.click(screen.getByRole('button', { name: 'Reveal 9 perspectives' }));
		await waitFor(() => expect(container.querySelector('.comparison')).toBeTruthy());
		expect(fetch).toHaveBeenCalledTimes(1);
		expect(fetch).toHaveBeenCalledWith('/api/homepage/community', {
			signal: expect.any(AbortSignal)
		});
		const copies = [...container.querySelectorAll('blockquote')].filter(
			(quote) => quote.textContent === answer
		);
		expect(copies).toHaveLength(2);
		for (const quote of copies) expect(quote.closest('.ph-no-capture')).toBeTruthy();
		expect(document.activeElement?.id).toBe('reveal-title');
		expect(
			screen.getByRole('link', { name: 'Join the friendship conversation' }).getAttribute('href')
		).toBe('/questions/whats-criteria-considering-someone-friend');
	});

	it('keeps the alternate design route excluded from indexing', () => {
		render(HomepagePreview);
		expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toMatch(
			/^noindex, nofollow/
		);
		expect(screen.getByRole('navigation', { name: 'Preview navigation' })).toBeTruthy();
	});
});
