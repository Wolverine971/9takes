// src/lib/components/molecules/HeaderSearch.spec.ts
// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { gotoMock, pageStore } = vi.hoisted(() => ({
	gotoMock: vi.fn(),
	pageStore: {
		subscribe(run: (value: { url: URL }) => void) {
			run({ url: new URL('https://9takes.com/') });
			return () => {};
		}
	}
}));

vi.mock('$app/navigation', () => ({
	afterNavigate: vi.fn(),
	goto: gotoMock
}));

vi.mock('$app/stores', () => ({
	page: pageStore
}));

import HeaderSearch from './HeaderSearch.svelte';

describe('HeaderSearch', () => {
	function mockTypeaheadResults(
		results: Array<{
			id: number;
			source: 'blog' | 'personality_analysis' | 'question';
			title: string;
			description: string;
			headline: string;
			url: string;
			category: string | null;
			comment_count: number | null;
		}>
	) {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue({ results })
			})
		);
	}

	beforeEach(() => {
		vi.useFakeTimers();
		gotoMock.mockReset();
		mockTypeaheadResults([
			{
				id: 42,
				source: 'personality_analysis',
				title: 'Cillian Murphy Personality Analysis',
				description: 'How his persona maps to type 5',
				headline: '<mark>Cillian</mark> Murphy Personality Analysis',
				url: '/personality-analysis/cillian-murphy',
				category: 'pop-culture',
				comment_count: null
			}
		]);
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it('shows the typeahead panel after typing a query', async () => {
		render(HeaderSearch);

		const input = screen.getByRole('searchbox', { name: /search 9takes/i });
		await fireEvent.input(input, { target: { value: 'cillian' } });

		expect(screen.getByText('Searching…')).toBeTruthy();

		await vi.advanceTimersByTimeAsync(200);

		await waitFor(() => {
			expect(fetch).toHaveBeenCalledWith(
				'/api/search/typeahead?q=cillian&scope=all&limit=8',
				expect.objectContaining({ signal: expect.any(AbortSignal) })
			);
		});

		expect(screen.getByText('Cillian Murphy Personality Analysis')).toBeTruthy();
		expect(screen.getByText('Personality analysis')).toBeTruthy();
	});

	it('renders description fallback text without double-escaping entities', async () => {
		mockTypeaheadResults([
			{
				id: 77,
				source: 'blog',
				title: 'Boundary Basics',
				description: 'Use A & B < C to compare choices',
				headline: 'Boundary Basics',
				url: '/how-to-guides/boundary-basics',
				category: 'guides',
				comment_count: null
			}
		]);

		render(HeaderSearch);

		const input = screen.getByRole('searchbox', { name: /search 9takes/i });
		await fireEvent.input(input, { target: { value: 'boundary' } });
		await vi.advanceTimersByTimeAsync(200);

		await waitFor(() => {
			expect(fetch).toHaveBeenCalledWith(
				'/api/search/typeahead?q=boundary&scope=all&limit=8',
				expect.objectContaining({ signal: expect.any(AbortSignal) })
			);
		});

		expect(screen.getByText('Use A & B < C to compare choices')).toBeTruthy();
		expect(screen.queryByText('Use A &amp; B &lt; C to compare choices')).toBeNull();
	});
});
