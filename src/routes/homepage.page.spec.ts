// src/routes/homepage.page.spec.ts
// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/paths', () => ({
	resolve: (path: string, params?: { slug: string }) => path.replace('[slug]', params?.slug ?? '')
}));

import Homepage from './+page.svelte';
import HomepagePreview from './design-preview/harry-dry/+page.svelte';

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('promoted homepage', () => {
	it('uses indexable homepage metadata and normal navigation without preview or section tags', () => {
		const { container } = render(Homepage);
		expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
			'https://9takes.com'
		);
		expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toMatch(
			/^index, follow/
		);
		expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeTruthy();
		expect(screen.getByRole('link', { name: 'Questions' }).getAttribute('href')).toBe('/questions');
		expect(container.textContent).not.toMatch(/§|PREVIEW|Current homepage/);
	});

	it('keeps a practice answer local and capture-blocked when revealing perspectives', async () => {
		const fetchMock = vi.fn();
		vi.stubGlobal('fetch', fetchMock);
		Element.prototype.scrollIntoView = vi.fn();
		const { container } = render(Homepage);
		const answer = 'Private test answer: listen before judging.';
		await fireEvent.input(screen.getByRole('textbox'), { target: { value: answer } });
		await fireEvent.click(screen.getByRole('button', { name: 'Reveal 9 perspectives' }));
		await waitFor(() => expect(container.querySelector('.comparison')).toBeTruthy());
		expect(fetchMock).not.toHaveBeenCalled();
		for (const quote of container.querySelectorAll('blockquote')) {
			if (quote.textContent === answer) expect(quote.closest('.ph-no-capture')).toBeTruthy();
		}
		expect(document.activeElement?.id).toBe('reveal-title');
		expect(
			screen.getByRole('link', { name: 'Open the live friendship question' }).getAttribute('href')
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
