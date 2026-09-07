// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createCommentViewTracker, VIEW_STORAGE_PREFIX } from './commentViews';
import type { Comment } from '$lib/types/questions';
let callback: IntersectionObserverCallback;
let observed: Element[];
let tracker: ReturnType<typeof createCommentViewTracker>;
const take = (id: number, extra: Partial<Comment> = {}): Comment => ({
	id,
	comment: 'a sincere take',
	author_id: null,
	parent_type: 'question',
	parent_id: 118,
	created_at: '',
	comment_count: 0,
	...extra
});
function observe(id = 1, extra: Partial<Comment> = {}) {
	const node = document.createElement('article');
	document.body.append(node);
	tracker.observe(node, take(id, extra));
	return node;
}
function visible(node: Element, ratio = 0.5) {
	callback(
		[
			{
				target: node,
				isIntersecting: ratio > 0,
				intersectionRatio: ratio
			} as IntersectionObserverEntry
		],
		{} as IntersectionObserver
	);
}
beforeEach(() => {
	vi.useFakeTimers();
	localStorage.clear();
	observed = [];
	Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
	vi.stubGlobal(
		'IntersectionObserver',
		class {
			constructor(cb: IntersectionObserverCallback) {
				callback = cb;
			}
			observe(n: Element) {
				observed.push(n);
			}
			unobserve() {}
			disconnect() {}
		}
	);
	vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
	Object.defineProperty(navigator, 'sendBeacon', {
		configurable: true,
		value: vi.fn().mockReturnValue(true)
	});
	tracker = createCommentViewTracker({
		questionId: 118,
		unlocked: true,
		viewerId: 'reader',
		viewerFingerprint: 'my-browser'
	});
});
afterEach(() => {
	tracker.destroy();
	document.body.innerHTML = '';
	vi.useRealTimers();
	vi.unstubAllGlobals();
});
describe('qualified take impressions', () => {
	it('requires a continuous second at least half visible and batches at two seconds', async () => {
		const node = observe();
		visible(node);
		await vi.advanceTimersByTimeAsync(999);
		visible(node, 0.49);
		await vi.advanceTimersByTimeAsync(1001);
		expect(fetch).not.toHaveBeenCalled();
		visible(node);
		await vi.advanceTimersByTimeAsync(1000);
		expect(fetch).not.toHaveBeenCalled();
		await vi.advanceTimersByTimeAsync(1000);
		expect(fetch).toHaveBeenCalledTimes(1);
		expect(JSON.parse((vi.mocked(fetch).mock.calls[0][1] as RequestInit).body as string)).toEqual({
			questionId: 118,
			commentIds: [1]
		});
	});
	it('does not count hidden background time', async () => {
		const node = observe();
		visible(node);
		await vi.advanceTimersByTimeAsync(900);
		Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
		document.dispatchEvent(new Event('visibilitychange'));
		await vi.advanceTimersByTimeAsync(4000);
		expect(fetch).not.toHaveBeenCalled();
		Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
		document.dispatchEvent(new Event('visibilitychange'));
		await vi.advanceTimersByTimeAsync(1100);
		expect(fetch).toHaveBeenCalledTimes(1);
	});
	it('rejects replies, removed, foreign and own cards for both identities', () => {
		observe(1, { parent_type: 'comment' });
		observe(2, { removed: true });
		observe(3, { parent_id: 119 });
		observe(4, { is_own: true });
		observe(5, { author_id: 'reader' });
		observe(6, { fingerprint: 'my-browser' });
		expect(observed).toHaveLength(0);
	});
	it('never observes before unlock', () => {
		tracker.destroy();
		tracker = createCommentViewTracker({ questionId: 118, unlocked: false });
		observe();
		expect(observed).toHaveLength(0);
	});
	it('deduplicates on reload and cancels detached timers', async () => {
		const node = observe();
		visible(node);
		await vi.advanceTimersByTimeAsync(1000);
		tracker.destroy();
		expect(navigator.sendBeacon).toHaveBeenCalledTimes(1);
		tracker = createCommentViewTracker({ questionId: 118, unlocked: true });
		observed = [];
		observe();
		expect(observed).toHaveLength(0);
		const detached = document.createElement('article');
		const cleanup = tracker.observe(detached, take(2));
		visible(detached);
		cleanup();
		await vi.advanceTimersByTimeAsync(2000);
		expect(fetch).not.toHaveBeenCalled();
	});
	it('splits pagehide batches into at most 40 IDs and caps storage at 500', async () => {
		localStorage.setItem(
			`${VIEW_STORAGE_PREFIX}118`,
			JSON.stringify(Array.from({ length: 500 }, (_, i) => i + 100))
		);
		for (let id = 1; id <= 45; id++) visible(observe(id));
		await vi.advanceTimersByTimeAsync(1000);
		window.dispatchEvent(new Event('pagehide'));
		expect(navigator.sendBeacon).toHaveBeenCalledTimes(2);
		expect(JSON.parse(localStorage.getItem(`${VIEW_STORAGE_PREFIX}118`)!).length).toBe(500);
	});
	it('counts only once with corrupt or inaccessible storage', async () => {
		localStorage.setItem(`${VIEW_STORAGE_PREFIX}118`, '{broken');
		const node = observe();
		visible(node);
		await vi.advanceTimersByTimeAsync(2000);
		visible(node);
		await vi.advanceTimersByTimeAsync(2000);
		expect(fetch).toHaveBeenCalledTimes(1);
	});
});
