// src/lib/components/blog/NineChorus.spec.ts
// @vitest-environment jsdom
//
// The personality page HTML is a shared ISR copy, so the Chorus does all of its
// visitor-specific work in the browser: the gate impression and the answer.
// These tests pin both requests without touching the network.

import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { fetchMock, getOrCreateVisitorIdMock } = vi.hoisted(() => ({
	fetchMock: vi.fn(),
	getOrCreateVisitorIdMock: vi.fn(() => 'visitor-abc')
}));

vi.mock('$app/environment', () => ({ browser: true, dev: false, building: false }));
vi.mock('qrcode', () => ({ default: { toDataURL: vi.fn(() => Promise.resolve('data:,')) } }));
vi.mock('$lib/analytics/visitorIdentity', () => ({
	getOrCreateVisitorId: getOrCreateVisitorIdMock
}));

import NineChorus from './NineChorus.svelte';

const PROVEN_URL = 'whats-something-every-day-seem-fine-nobody-knows-costing-effort';
const QUESTION =
	"What's something you do every day to seem fine that nobody knows is costing you effort?";
const TAKES = Array.from({ length: 9 }, (_, index) => ({
	type: index + 1,
	archetype: `Type ${index + 1}`,
	take: `Take from type ${index + 1}`,
	source: 'ai'
}));

type ObserverCallback = (entries: Array<Partial<IntersectionObserverEntry>>) => void;
let observerCallbacks: ObserverCallback[] = [];

function showChorus(ratio: number) {
	for (const callback of observerCallbacks) {
		callback([
			{
				isIntersecting: ratio > 0,
				intersectionRatio: ratio,
				intersectionRect: { height: 0 } as DOMRectReadOnly
			}
		]);
	}
}

function mirrorResponse(body: unknown, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json' }
	});
}

function callsTo(path: string) {
	return fetchMock.mock.calls.filter(([url]) => url === path);
}

function bodyOf(call: unknown[]) {
	return JSON.parse((call[1] as RequestInit).body as string);
}

function renderProvenChorus(extra: Record<string, unknown> = {}) {
	return render(NineChorus, {
		props: {
			subjectType: 'question',
			slug: 'zendaya',
			question: QUESTION,
			questionUrl: PROVEN_URL,
			personName: 'Zendaya',
			sourcePath: '/personality-analysis/zendaya',
			lead: 'Before you see how the nine types answered, add yours.',
			...extra
		}
	});
}

describe('NineChorus', () => {
	beforeEach(() => {
		observerCallbacks = [];
		vi.stubGlobal(
			'IntersectionObserver',
			class IntersectionObserverStub {
				constructor(callback: ObserverCallback) {
					observerCallbacks.push(callback);
				}
				observe() {}
				disconnect() {}
				unobserve() {}
				takeRecords() {
					return [];
				}
			}
		);
		Element.prototype.scrollIntoView = vi.fn();
		fetchMock.mockReset();
		fetchMock.mockImplementation(async (url: string) =>
			url === '/api/nine/mirror'
				? mirrorResponse({ reflection: null, takes: TAKES, answerRecorded: true })
				: new Response(null, { status: 204 })
		);
		vi.stubGlobal('fetch', fetchMock);
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it('shows the question verbatim under the reader-facing lead', () => {
		const { getByText } = renderProvenChorus();

		expect(getByText(QUESTION)).toBeTruthy();
		expect(getByText('Before you see how the nine types answered, add yours.')).toBeTruthy();
	});

	it('posts a proven-question answer to that question, attributed to the page', async () => {
		const { container, getByRole } = renderProvenChorus();

		const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
		await fireEvent.input(textarea, {
			target: { value: '  I color-code my calendar so nobody sees me scramble.  ' }
		});
		await fireEvent.click(getByRole('button', { name: 'Answer and see the nine' }));

		await waitFor(() => expect(callsTo('/api/nine/mirror')).toHaveLength(1));
		expect(bodyOf(callsTo('/api/nine/mirror')[0])).toEqual({
			subjectType: 'question',
			questionUrl: PROVEN_URL,
			take: 'I color-code my calendar so nobody sees me scramble.',
			sourcePath: '/personality-analysis/zendaya',
			fingerprint: 'visitor-abc'
		});

		// The reveal: the reader's answer, then the nine takes.
		await waitFor(() => expect(container.querySelectorAll('.voice')).toHaveLength(9));
		expect(container.textContent).toContain('Take from type 1');
	});

	it('keeps posting the page’s own chorus by person slug', async () => {
		const { container, getByRole } = render(NineChorus, {
			props: {
				slug: 'zendaya',
				question: 'What does it feel like to constantly prepare for something?',
				questionUrl: 'what-does-it-feel-like-to-prepare',
				sourcePath: '/personality-analysis/zendaya'
			}
		});

		const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
		await fireEvent.input(textarea, { target: { value: 'Every single time, honestly.' } });
		await fireEvent.click(getByRole('button', { name: 'Answer and see the nine' }));

		await waitFor(() => expect(callsTo('/api/nine/mirror')).toHaveLength(1));
		expect(bodyOf(callsTo('/api/nine/mirror')[0])).toEqual({
			subjectType: 'personality-analysis',
			slug: 'zendaya',
			take: 'Every single time, honestly.',
			sourcePath: '/personality-analysis/zendaya',
			fingerprint: 'visitor-abc'
		});
	});

	it('records the gate impression once it has been on screen for 750ms', async () => {
		vi.useFakeTimers();
		renderProvenChorus();

		showChorus(0.2);
		await vi.advanceTimersByTimeAsync(2000);
		expect(callsTo('/api/nine/impression')).toHaveLength(0);

		showChorus(0.6);
		await vi.advanceTimersByTimeAsync(700);
		expect(callsTo('/api/nine/impression')).toHaveLength(0);
		await vi.advanceTimersByTimeAsync(100);

		const impressions = callsTo('/api/nine/impression');
		expect(impressions).toHaveLength(1);
		expect(bodyOf(impressions[0])).toEqual({
			questionUrl: PROVEN_URL,
			sourcePath: '/personality-analysis/zendaya',
			fingerprint: 'visitor-abc'
		});
		expect((impressions[0][1] as RequestInit).keepalive).toBe(true);

		// Never twice per page view.
		showChorus(1);
		await vi.advanceTimersByTimeAsync(2000);
		expect(callsTo('/api/nine/impression')).toHaveLength(1);
	});

	it('does not count a glance that scrolls away before the dwell', async () => {
		vi.useFakeTimers();
		renderProvenChorus();

		showChorus(0.8);
		await vi.advanceTimersByTimeAsync(400);
		showChorus(0);
		await vi.advanceTimersByTimeAsync(2000);

		expect(callsTo('/api/nine/impression')).toHaveLength(0);
	});

	it('records the impression before the answer when the reader beats the dwell', async () => {
		const { container, getByRole } = renderProvenChorus();

		const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
		await fireEvent.input(textarea, { target: { value: 'Smiling through every meeting.' } });
		await fireEvent.click(getByRole('button', { name: 'Answer and see the nine' }));

		await waitFor(() => expect(callsTo('/api/nine/mirror')).toHaveLength(1));
		const order = fetchMock.mock.calls.map(([url]) => url);
		expect(order).toEqual(['/api/nine/impression', '/api/nine/mirror']);
	});

	it('records no impression without a page path to attribute it to', async () => {
		vi.useFakeTimers();
		renderProvenChorus({ sourcePath: null });

		showChorus(1);
		await vi.advanceTimersByTimeAsync(2000);

		expect(callsTo('/api/nine/impression')).toHaveLength(0);
	});

	it('keeps the draft and shows the server message when the answer is refused', async () => {
		fetchMock.mockImplementation(async (url: string) =>
			url === '/api/nine/mirror'
				? mirrorResponse({ message: 'This chorus is not ready yet' }, 409)
				: new Response(null, { status: 204 })
		);
		const { container, getByRole, findByRole } = renderProvenChorus();

		const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
		await fireEvent.input(textarea, { target: { value: 'Pretending the inbox is fine.' } });
		await fireEvent.click(getByRole('button', { name: 'Answer and see the nine' }));

		expect((await findByRole('alert')).textContent).toContain('This chorus is not ready yet');
		expect(textarea.value).toBe('Pretending the inbox is fine.');
		expect(container.querySelector('.chorus-reveal')).toBeNull();
	});
});
