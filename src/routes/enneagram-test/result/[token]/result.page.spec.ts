// src/routes/enneagram-test/result/[token]/result.page.spec.ts
// @vitest-environment jsdom
//
// The answer chain on the Enneagram test result (growth bet #1): answer, see the
// other types, take the next question; the email capture shows after the 2nd take.
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/paths', () => ({
	resolve: (path: string, params?: Record<string, string>) =>
		path.replace(/\[(\w+)\]/g, (_, key: string) => params?.[key] ?? '')
}));
vi.mock('$app/state', () => ({
	page: { url: new URL('http://localhost/enneagram-test/result/x') }
}));
const { captureMock } = vi.hoisted(() => ({ captureMock: vi.fn(async () => {}) }));
vi.mock('$lib/analytics/posthog', () => ({ capture: captureMock }));
vi.mock('$lib/analytics/marketingEvents', async (importOriginal) => ({
	...(await importOriginal<typeof import('$lib/analytics/marketingEvents')>()),
	prepareEmailSignup: vi.fn(async () => {})
}));
vi.mock('$lib/analytics/commentEvents', async (importOriginal) => ({
	...(await importOriginal<typeof import('$lib/analytics/commentEvents')>()),
	captureCommentCreated: vi.fn(),
	captureCommentFailed: vi.fn()
}));

import ResultPage from './+page.svelte';

const TOKEN = 'r'.repeat(24);
const API = `/api/enneagram-test/results/${TOKEN}`;

function liveFor(id: number, overrides: Record<string, unknown> = {}) {
	return {
		questionId: id,
		slug: `q-${id}`,
		title: `Question ${id}?`,
		responses: 5,
		signedIn: false,
		answered: false,
		ownTake: null,
		answers: [],
		...overrides
	};
}

function step(id: number, overrides: Record<string, unknown> = {}) {
	return {
		id,
		url: `q-${id}`,
		question: `Question ${id}?`,
		answeredAs: 6,
		done: false,
		live: null,
		types: null,
		...overrides
	};
}

function postedBody(id: number) {
	return {
		ok: true,
		alreadyAnswered: false,
		questionId: id,
		commentId: id * 10,
		commentAnalytics: null,
		isAnonymous: true,
		ownTake: { id: id * 10, text: `My take on ${id}` },
		answers: [{ id: id * 10 + 1, text: `A 4 on ${id}`, type: 4 }],
		responses: 6
	};
}

function stubResponse(status: number, body: unknown): Response {
	return {
		ok: status >= 200 && status < 300,
		status,
		json: async (): Promise<unknown> => body
	} as unknown as Response;
}

function renderResult(chain: unknown, notifyOn = false) {
	return render(ResultPage, {
		props: {
			data: {
				resultToken: TOKEN,
				result: {
					types: [6],
					emotion: 'fear',
					strength: 'fear',
					displayName: null,
					readToken: 'read-token-1',
					notifyOn,
					reads: [],
					createdAt: '2026-11-23T12:00:00Z'
				},
				chain,
				viewer: { signedIn: false, profileType: null },
				emailsStopped: false
			} as never
		}
	});
}

async function answer(text: string) {
	await fireEvent.input(screen.getByRole('textbox', { name: /Your take/ }), {
		target: { value: text }
	});
	await fireEvent.click(screen.getByRole('button', { name: /^Post/ }));
}

const originalScroll = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollIntoView');
let lastPostedSlug = '';

beforeEach(() => {
	vi.stubGlobal(
		'fetch',
		vi.fn(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
			const url = String(input);
			if (url === `${API}/answer`) {
				lastPostedSlug = JSON.parse(String(init?.body)).slug;
				return stubResponse(200, postedBody(Number(lastPostedSlug.slice(2))));
			}
			const next = url.match(/\/chain\/(\d)$/);
			if (next) {
				const id = 41 + Number(next[1]) - 1;
				return stubResponse(200, {
					step: Number(next[1]),
					question: `Question ${id}?`,
					answeredAs: 6,
					live: liveFor(id),
					types: null
				});
			}
			if (url === API) return stubResponse(200, { ok: true, resultEmail: 'sent' });
			return stubResponse(200, {});
		})
	);
	Object.defineProperty(Element.prototype, 'scrollIntoView', {
		configurable: true,
		value: vi.fn()
	});
	document.cookie = '9tfingerprint=visitor-cookie; path=/';
});

afterEach(() => {
	cleanup();
	vi.clearAllMocks();
	vi.unstubAllGlobals();
	if (originalScroll) Object.defineProperty(Element.prototype, 'scrollIntoView', originalScroll);
	else Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
});

describe('Enneagram test result answer chain', () => {
	it('walks three questions and asks for an email only after the second take', async () => {
		renderResult({
			steps: [step(40, { live: liveFor(40) }), step(41), step(42)],
			current: 0
		});
		expect(screen.getByRole('heading', { name: 'Answer 3 questions as a 6' })).toBeTruthy();
		expect(screen.getByText('Question 1 of 3')).toBeTruthy();

		await answer('Fear first, then plans.');
		await screen.findByText('A 4 on 40');
		expect(screen.queryByText('Hear when the other types answer')).toBeNull();

		await fireEvent.click(screen.getByRole('button', { name: 'Next question (2 of 3)' }));
		await screen.findByRole('heading', { name: 'Question 41?' });
		expect(screen.getByText('Question 2 of 3')).toBeTruthy();
		// The first question folds into an answered row.
		expect(screen.getByRole('button', { name: 'See the takes' })).toBeTruthy();

		await answer('I check twice.');
		await screen.findByText('A 4 on 41');
		expect(screen.getByRole('heading', { name: 'Hear when the other types answer' })).toBeTruthy();

		const capture = screen
			.getByRole('heading', { name: 'Hear when the other types answer' })
			.closest('.follow') as HTMLElement;
		await fireEvent.input(within(capture).getByLabelText(/Email/), {
			target: { value: 'Six@Example.com ' }
		});
		await fireEvent.click(
			within(capture).getByRole('button', { name: 'Email me when they answer' })
		);
		await screen.findByText('You’re on the list for these.');
		const patch = vi
			.mocked(fetch)
			.mock.calls.find(([url, init]) => String(url) === API && init?.method === 'PATCH');
		expect(JSON.parse(String(patch?.[1]?.body))).toEqual({
			notifyEmail: 'six@example.com',
			sendResult: true
		});
		expect(captureMock).toHaveBeenCalledWith('test_notify_opt_in', {
			surface: 'enneagram_test',
			placement: 'chain'
		});

		await fireEvent.click(screen.getByRole('button', { name: 'Next question (3 of 3)' }));
		await screen.findByRole('heading', { name: 'Question 42?' });
		await answer('Same as always.');
		await screen.findByText(/That’s all 3\./);
		expect(captureMock).toHaveBeenCalledWith('test_take_posted', {
			surface: 'enneagram_test',
			split: false,
			already_answered: false,
			step: 3
		});
	});

	it('opens every answered question for a returning visitor', async () => {
		renderResult(
			{
				steps: [40, 41, 42].map((id) =>
					step(id, { done: true, live: liveFor(id, { ...postedBody(id), answered: true }) })
				),
				current: 3
			},
			true
		);
		expect(screen.getByText('All 3 answered')).toBeTruthy();
		await waitFor(() => expect(screen.getAllByRole('button', { name: 'Hide' })).toHaveLength(3));
		expect(screen.getByText('A 4 on 42')).toBeTruthy();
		expect(screen.getByText('You’re on the list for these.')).toBeTruthy();
		expect(screen.queryByRole('textbox', { name: /Your take/ })).toBeNull();
	});
});
