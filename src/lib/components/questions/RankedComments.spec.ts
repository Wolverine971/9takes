// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Comment, QuestionPageData } from '$lib/types/questions';

vi.mock('svelte/transition', () => ({
	fade: () => ({ duration: 0 }),
	fly: () => ({ duration: 0 }),
	scale: () => ({ duration: 0 }),
	slide: () => ({ duration: 0 })
}));
vi.mock('$app/forms', () => ({ deserialize: JSON.parse }));
vi.mock('$app/environment', () => ({ browser: true, dev: true, building: false }));
vi.mock('$lib/analytics/posthog', () => ({ capture: vi.fn().mockResolvedValue(undefined) }));
vi.mock('$lib/components/molecules/notifications', () => ({
	notifications: { success: vi.fn(), info: vi.fn(), danger: vi.fn() }
}));

import RankedComments from './RankedComments.svelte';
import QuestionContent from './QuestionContent.svelte';

function take(id: number, options: Partial<Comment> = {}): Comment {
	return {
		id,
		comment: `Thoughtful answer number ${id}`,
		author_id: `author-${id}`,
		parent_id: 42,
		parent_type: 'question',
		created_at: new Date(Date.UTC(2026, 0, 1, 0, id)).toISOString(),
		comment_count: 0,
		like_count: 0,
		comment_like: [],
		view_count: 0,
		profiles: { external_id: `person-${id}`, enneagram: id % 2 === 0 ? 2 : 1 },
		...options
	};
}

function page(takes: Comment[], overrides: Partial<QuestionPageData> = {}): QuestionPageData {
	return {
		question: {
			id: 42,
			question: 'A question?',
			url: 'a-question',
			created_at: '2026-01-01',
			removed: false,
			flagged: false,
			comment_count: takes.length
		},
		comments: takes,
		ownComments: [],
		pinnedCommentIds: [],
		commentRankingEnabled: true,
		removedComments: [],
		comment_count: takes.length,
		removed_comment_count: 0,
		questionTags: [],
		user: { id: 'viewer' },
		flags: { userHasAnswered: true, userSignedIn: true },
		aiComments: [],
		links: [],
		links_count: 0,
		flagReasons: [],
		...overrides
	};
}

function ids(container: HTMLElement) {
	return [...container.querySelectorAll('[data-take-id]')].map((node) =>
		Number(node.getAttribute('data-take-id'))
	);
}

async function chooseSort(view: ReturnType<typeof within>, sort: string) {
	await fireEvent.click(view.getByRole('button', { name: 'Filter and sort comments' }));
	await fireEvent.click(view.getByRole('button', { name: sort }));
	await fireEvent.click(view.getByRole('button', { name: 'Apply' }));
}

describe('the question take list', () => {
	beforeEach(() => {
		window.sessionStorage.clear();
		window.localStorage.clear();
		vi.stubGlobal('fetch', vi.fn());
		vi.stubGlobal(
			'matchMedia',
			vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
		);
		vi.stubGlobal(
			'IntersectionObserver',
			class {
				observe = vi.fn();
				unobserve = vi.fn();
				disconnect = vi.fn();
			}
		);
		Element.prototype.scrollIntoView = vi.fn();
		Object.defineProperty(Element.prototype, 'animate', {
			configurable: true,
			value: vi.fn(() => ({ finished: Promise.resolve(), cancel: vi.fn(), effect: null }))
		});
	});
	afterEach(() => {
		cleanup();
		vi.unstubAllGlobals();
	});

	it('reveals the next ten from memory, ranks beyond the former ten-take limit and separates your take', async () => {
		const takes = Array.from({ length: 24 }, (_, i) => take(24 - i));
		const own = take(100, { author_id: 'viewer', is_own: true });
		const view = render(RankedComments, {
			data: page(takes, { ownComments: [own], comment_count: 25 }),
			user: { id: 'viewer' }
		});
		expect(ids(view.container)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
		expect(
			within(view.getByRole('region', { name: 'Your take' })).getByText(own.comment)
		).toBeTruthy();
		await fireEvent.click(view.getByRole('button', { name: 'Show more takes' }));
		expect(ids(view.container)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
		expect(fetch).not.toHaveBeenCalled();
	});

	it('sorts and filters locally, remembers sort for the session and uses the full fetched set', async () => {
		const takes = Array.from({ length: 24 }, (_, i) => take(24 - i));
		takes[takes.length - 1].like_count = 2;
		const view = render(RankedComments, { data: page(takes), user: { id: 'viewer' } });
		await chooseSort(view, 'Likes');
		expect(ids(view.container)[0]).toBe(1);
		expect(window.sessionStorage.getItem('9takes:comment-sort')).toBe('likes');
		await fireEvent.click(view.getByRole('button', { name: 'Filter and sort comments' }));
		await fireEvent.click(view.getByRole('button', { name: 'None' }));
		await fireEvent.click(view.getByRole('button', { name: '2' }));
		await fireEvent.click(view.getByRole('button', { name: 'Apply' }));
		expect(ids(view.container).every((id) => id % 2 === 0)).toBe(true);
		expect(ids(view.container)).toHaveLength(10);
		expect(fetch).not.toHaveBeenCalled();
		view.unmount();
		const nextVisit = render(RankedComments, { data: page(takes), user: { id: 'viewer' } });
		await waitFor(() => expect(ids(nextVisit.container)[0]).toBe(1));
	});

	it('updates a liked card without moving it and preserves order and reveal state across tabs', async () => {
		const data = page(Array.from({ length: 24 }, (_, i) => take(24 - i)));
		const view = render(QuestionContent, { data, user: { id: 'viewer' } });
		await fireEvent.click(view.getByRole('button', { name: 'Show more takes' }));
		const before = ids(view.container);
		vi.mocked(fetch).mockResolvedValue(
			new Response(
				JSON.stringify({
					type: 'success',
					status: 200,
					data: { id: 88, comment_id: 1, user_id: 'viewer' }
				})
			)
		);
		const card = view.container.querySelector('[data-take-id="1"]') as HTMLElement;
		await fireEvent.click(within(card).getByRole('button', { name: 'Like this comment' }));
		await waitFor(() =>
			expect(within(card).getByRole('button', { name: /Unlike this comment/ })).toBeTruthy()
		);
		expect(ids(view.container)).toEqual(before);
		await fireEvent.click(view.getByRole('tab', { name: /Articles/ }));
		await fireEvent.click(view.getByRole('tab', { name: /Takes/ }));
		expect(ids(view.container)).toEqual(before);
	});

	it('only fetches after the first hundred are revealed and deduplicates an overflow page', async () => {
		const data = page(
			Array.from({ length: 100 }, (_, i) => take(110 - i)),
			{ comment_count: 110 }
		);
		const view = render(RankedComments, { data, user: { id: 'viewer' } });
		for (let i = 0; i < 9; i++)
			await fireEvent.click(view.container.querySelector('.load-more button') as HTMLButtonElement);
		expect(ids(view.container)).toHaveLength(100);
		expect(fetch).not.toHaveBeenCalled();
		vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify([take(11), take(10), take(9)])));
		await fireEvent.click(view.container.querySelector('.load-more button') as HTMLButtonElement);
		await waitFor(() => expect(ids(view.container)).toHaveLength(102));
		const request = new URL(String(vi.mocked(fetch).mock.calls[0][0]), 'https://9takes.com');
		expect(request.searchParams.get('before')).toBe(take(11).created_at);
		expect(request.searchParams.get('beforeId')).toBe('11');
		expect(new Set(ids(view.container)).size).toBe(102);
	});

	it('keeps boosts then newest during view collection and excludes a focused parent from both lists', () => {
		const data = page([take(3), take(2), take(1)], {
			commentRankingEnabled: false,
			pinnedCommentIds: [1],
			ownComments: [take(4, { is_own: true })]
		});
		const view = render(RankedComments, { data, user: { id: 'viewer' }, excludeIds: [4] });
		expect(ids(view.container)).toEqual([1, 3, 2]);
		expect(view.queryByText('Thoughtful answer number 4')).toBeNull();
	});

	it('replaces the optimistic unlock snapshot when server takes arrive, then freezes that visit order', async () => {
		const own = take(50, { author_id: null, profiles: null, is_own: true });
		const optimistic = page([own], {
			commentsReady: false,
			user: null,
			flags: { userHasAnswered: true, userSignedIn: false }
		});
		const view = render(QuestionContent, { data: optimistic, user: null });
		expect(ids(view.container)).toEqual([]);
		expect(
			within(view.getByRole('region', { name: 'Your take' })).getByText(own.comment)
		).toBeTruthy();

		const community = Array.from({ length: 12 }, (_, i) => take(12 - i));
		const unlocked = page([own, ...community], {
			commentsReady: true,
			ownComments: [own],
			user: null,
			flags: { userHasAnswered: true, userSignedIn: false }
		});
		await view.rerender({ data: unlocked, user: null });
		const firstScreen = Array.from({ length: 10 }, (_, i) => i + 1);
		expect(ids(view.container)).toEqual(firstScreen);
		expect(ids(view.container)).not.toContain(own.id);
		expect(
			within(view.getByRole('region', { name: 'Your take' })).getByText(own.comment)
		).toBeTruthy();

		// These new counts would rotate take 1 behind the rest on a fresh visit.
		const refreshed = {
			...unlocked,
			comments: unlocked.comments.map((take) =>
				take.id === 1 ? { ...take, like_count: 10, view_count: 50 } : take
			)
		};
		await view.rerender({ data: refreshed, user: null });
		expect(ids(view.container)).toEqual(firstScreen);
		expect(ids(view.container)).not.toContain(own.id);
		expect(fetch).not.toHaveBeenCalled();
	});

	it('never renders the human list before the give-first gate unlocks', () => {
		const data = page([take(1)], { flags: { userHasAnswered: false, userSignedIn: false } });
		const view = render(QuestionContent, { data, user: null });
		expect(view.queryByText('Thoughtful answer number 1')).toBeNull();
		expect(ids(view.container)).toEqual([]);
		expect(fetch).not.toHaveBeenCalled();
	});
});
