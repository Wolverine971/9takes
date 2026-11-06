// src/routes/homepage.page.spec.ts
// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/paths', () => ({
	resolve: (path: string, params?: { slug: string }) => path.replace('[slug]', params?.slug ?? '')
}));
const { practiceMock, commentCreatedMock, commentFailedMock, deserializeMock } = vi.hoisted(() => ({
	practiceMock: vi.fn(),
	commentCreatedMock: vi.fn(),
	commentFailedMock: vi.fn(),
	deserializeMock: vi.fn()
}));
vi.mock('$lib/analytics/marketingEvents', async (importOriginal) => ({
	...(await importOriginal<typeof import('$lib/analytics/marketingEvents')>()),
	captureHomepagePractice: practiceMock,
	captureHomepageLinkClicked: vi.fn()
}));
vi.mock('$lib/analytics/commentEvents', async (importOriginal) => ({
	...(await importOriginal<typeof import('$lib/analytics/commentEvents')>()),
	captureCommentCreated: commentCreatedMock,
	captureCommentFailed: commentFailedMock
}));
vi.mock('$app/forms', () => ({ deserialize: deserializeMock }));

import Homepage from './+page.svelte';
import { load } from './+page';

const SLUG = 'whats-criteria-considering-someone-friend';
const live = {
	questionId: 203,
	slug: SLUG,
	title: 'What are your criteria for considering someone a friend?',
	responses: 10,
	signedIn: false,
	answered: false,
	ownTake: null,
	answers: []
};
const liveTypes = {
	recent: [8, null, 4, null],
	answered: [4, 8, 9],
	newestAt: '2026-10-31T18:00:00Z'
};
const ANSWER = 'Someone who shows up when it is inconvenient.';
const postedBody = {
	ok: true,
	alreadyAnswered: false,
	questionId: 203,
	commentId: 901,
	commentAnalytics: { is_first_comment_ever: true, is_first_comment_on_question: false },
	isAnonymous: true,
	ownTake: { id: 901, text: ANSWER },
	answers: [
		{ id: 31, text: 'They remember the small things.', type: 2 },
		{ id: 33, text: 'I can be quiet around them.', type: null }
	],
	responses: 11
};

type AnswerReply = { status: number; body: unknown };
let answerReply: AnswerReply = { status: 200, body: postedBody };

function stubResponse(status: number, body: unknown, text = ''): Response {
	return {
		ok: status >= 200 && status < 300,
		status,
		json: async (): Promise<unknown> => body,
		text: async (): Promise<string> => text
	} as unknown as Response;
}

const originalScroll = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollIntoView');
beforeEach(() => {
	answerReply = { status: 200, body: postedBody };
	vi.stubGlobal(
		'fetch',
		vi.fn(async (input: RequestInfo | URL): Promise<Response> => {
			const url = String(input);
			if (url === '/api/homepage/answer') {
				return stubResponse(answerReply.status, answerReply.body);
			}
			if (url.includes('?/subscribeToCommentReplies')) return stubResponse(200, {}, '{}');
			return stubResponse(200, null);
		})
	);
	Object.defineProperty(Element.prototype, 'scrollIntoView', {
		configurable: true,
		value: vi.fn()
	});
	window.sessionStorage.clear();
	document.cookie = '9tfingerprint=visitor-cookie; path=/';
});

afterEach(() => {
	cleanup();
	vi.clearAllMocks();
	vi.unstubAllGlobals();
	if (originalScroll) Object.defineProperty(Element.prototype, 'scrollIntoView', originalScroll);
	else Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
});

function answerCalls() {
	return vi.mocked(fetch).mock.calls.filter(([input]) => String(input) === '/api/homepage/answer');
}

function renderHome(data: Record<string, unknown> = { live, liveTypes }) {
	return render(Homepage, { props: { data: data as never } });
}

async function writeAndPost(text = ANSWER) {
	await fireEvent.input(screen.getByRole('textbox', { name: 'Your take' }), {
		target: { value: text }
	});
	await fireEvent.click(screen.getByRole('button', { name: /^Post/ }));
}

describe('homepage', () => {
	it('keeps indexable metadata and leaves navigation to the shared site header', () => {
		const { container } = renderHome();
		expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
			'https://9takes.com'
		);
		expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toMatch(
			/^index, follow/
		);
		expect(load({ data: { live } } as never)).toEqual({
			live,
			pageChrome: 'default',
			pageShell: 'owned'
		});
		expect(container.querySelector('header')).toBeNull();
		expect(container.querySelector('footer')).toBeNull();
		expect(document.title).toBe('1 Question, 9 Perspectives | 9takes');
		const structuredData = [
			...document.head.querySelectorAll('script[type="application/ld+json"]')
		].map((script) => JSON.parse(script.textContent ?? '{}'));
		expect(structuredData).toContainEqual(
			expect.objectContaining({ '@type': 'WebPage', '@id': 'https://9takes.com/#webpage' })
		);
	});

	it('renders the v4 sections with one h1 and the hero image loaded eagerly', () => {
		const { container } = renderHome();
		expect(container.querySelectorAll('h1')).toHaveLength(1);
		expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/Give\s*your take/);
		for (const name of [
			/Answer before\s*the crowd does/,
			/What's under\s*every take/,
			/Before\s*you post/,
			/The internet collapses\s*Nine perspectives\s*into one winning take\./
		]) {
			expect(screen.getByRole('heading', { level: 2, name })).toBeTruthy();
		}
		const hero = container.querySelector('.photo img')!;
		expect(hero.getAttribute('fetchpriority')).toBe('high');
		expect(hero.getAttribute('loading')).toBeNull();
		const busts = [...container.querySelectorAll('.tri-face img')];
		expect(busts).toHaveLength(3);
		for (const bust of busts) expect(bust.getAttribute('loading')).toBe('lazy');
		const typeLinks = screen
			.getByRole('navigation', { name: 'The nine Enneagram types' })
			.querySelectorAll('a');
		expect(typeLinks).toHaveLength(9);
		expect(typeLinks[0].getAttribute('href')).toBe('/enneagram-corner/enneagram-type-1');
	});
});

describe('homepage live question card', () => {
	it('shows the count and who answered, but no take text before posting', () => {
		const { container } = renderHome();
		expect(screen.getByRole('heading', { name: live.title })).toBeTruthy();
		expect(screen.getByText('10 takes · newest Oct 31')).toBeTruthy();
		expect(screen.getByRole('button', { name: /Post & see all 10/ })).toBeTruthy();
		expect(container.querySelector('#live-note')?.textContent).toContain('Anonymous.');
		expect(screen.getByText(/No 1, 2, 3, 5, 6 or 7 has answered yet\./)).toBeTruthy();
		expect(container.querySelector('.lock-count')?.textContent).toMatch(
			/10 takes\s*unlock when you post yours\./
		);
		const chips = [...container.querySelectorAll('.locked .chip')].map((chip) => chip.textContent);
		expect(chips).toEqual(['8', '–', '4', '–']);
		// Locked rows are placeholders only, hidden from assistive tech.
		expect(container.querySelector('.locked')?.getAttribute('aria-hidden')).toBe('true');
		expect(container.querySelector('.locked')?.textContent).toMatch(/^[x,\s–0-9]+$/);
		expect(answerCalls()).toHaveLength(0);
	});

	it('posts the take for real, unlocks the answers and offers reply notes', async () => {
		const { container } = renderHome();
		await writeAndPost();

		await waitFor(() =>
			expect(
				screen.getByRole('heading', { name: 'You’re in. Here’s how others answered.' })
			).toBeTruthy()
		);
		expect(document.activeElement?.textContent).toBe('You’re in. Here’s how others answered.');
		const [, init] = answerCalls()[0];
		expect(init).toMatchObject({ method: 'POST', headers: { 'content-type': 'application/json' } });
		expect(JSON.parse(String(init?.body))).toEqual({
			slug: SLUG,
			comment: ANSWER,
			fingerprint: 'visitor-cookie'
		});
		expect(screen.getByText('Posted anonymously', { exact: false })).toBeTruthy();
		expect(container.querySelector('.take-row.own')?.textContent).toContain(ANSWER);
		expect(screen.getByText('They remember the small things.')).toBeTruthy();
		expect(screen.getByText('11 takes · newest Oct 31')).toBeTruthy();
		expect(
			screen.getByRole('link', { name: 'Open the full conversation' }).getAttribute('href')
		).toBe(`/questions/${SLUG}`);

		expect(commentCreatedMock).toHaveBeenCalledWith(
			expect.objectContaining({
				surface: 'homepage',
				commentKind: 'answer',
				parentType: 'question',
				commentId: 901,
				questionId: 203,
				questionUrl: SLUG,
				isAnonymous: true,
				isFirstCommentEver: true
			})
		);
		expect(practiceMock.mock.calls.map(([input]) => input.step)).toContain('live_post_clicked');
		expect(JSON.stringify([practiceMock.mock.calls, commentCreatedMock.mock.calls])).not.toContain(
			ANSWER
		);

		const tray = screen.getByRole('region', { name: 'Want a note if someone replies?' });
		expect(tray.textContent).toContain('DJ reads every take and replies.');
		deserializeMock.mockReturnValueOnce({
			type: 'success',
			data: { replyOptIn: { status: 'subscribed' } }
		});
		await fireEvent.input(screen.getByRole('textbox', { name: 'Email' }), {
			target: { value: 'reader@example.com' }
		});
		await fireEvent.click(screen.getByRole('button', { name: 'Keep me posted' }));
		await waitFor(() =>
			expect(
				vi
					.mocked(fetch)
					.mock.calls.some(
						([input]) => String(input) === `/questions/${SLUG}?/subscribeToCommentReplies`
					)
			).toBe(true)
		);
	});

	it('opens straight to the unlocked state for a visitor who already answered', () => {
		const { container } = renderHome({
			live: {
				...live,
				answered: true,
				ownTake: { id: 77, text: 'Loyalty, mostly.' },
				answers: [{ id: 31, text: 'They remember the small things.', type: 2 }]
			},
			liveTypes
		});
		expect(screen.queryByRole('textbox', { name: 'Your take' })).toBeNull();
		expect(screen.getByText('You answered this one', { exact: false })).toBeTruthy();
		expect(container.querySelector('.take-row.own')?.textContent).toContain('Loyalty, mostly.');
		expect(screen.getByText('They remember the small things.')).toBeTruthy();
		expect(screen.queryByRole('region', { name: 'Want a note if someone replies?' })).toBeNull();
		expect(answerCalls()).toHaveLength(0);
	});

	it('never labels an unposted draft as the visitor’s take', async () => {
		answerReply = {
			status: 200,
			body: { ...postedBody, alreadyAnswered: true, commentId: null, ownTake: null }
		};
		const { container } = renderHome();
		await writeAndPost();

		expect(await screen.findByText('You answered this one', { exact: false })).toBeTruthy();
		expect(container.querySelector('.take-row.own')).toBeNull();
		expect(container.querySelector('#answer')?.textContent).not.toContain(ANSWER);
		expect(commentCreatedMock).not.toHaveBeenCalled();
	});

	it('keeps the draft and explains when posting fails', async () => {
		answerReply = {
			status: 429,
			body: { error: 'Too many comments. Please wait a minute before trying again.' }
		};
		renderHome();
		await writeAndPost();

		expect((await screen.findByRole('alert')).textContent).toBe(
			'Too many comments. Please wait a minute before trying again.'
		);
		expect((screen.getByRole('textbox', { name: 'Your take' }) as HTMLTextAreaElement).value).toBe(
			ANSWER
		);
		answerReply = { status: 200, body: postedBody };
		await fireEvent.click(screen.getByRole('button', { name: /^Post/ }));
		expect(await screen.findByText('They remember the small things.')).toBeTruthy();
		expect(commentFailedMock).toHaveBeenCalledWith(
			expect.objectContaining({ surface: 'homepage', errorCategory: 'http_error' })
		);
		expect(JSON.stringify(commentFailedMock.mock.calls)).not.toContain(ANSWER);
	});

	it('asks for a few words before posting an empty take', async () => {
		renderHome();
		await fireEvent.click(screen.getByRole('button', { name: /^Post/ }));
		expect(screen.getByRole('alert').textContent).toBe('Add a few words of your own first.');
		expect(answerCalls()).toHaveLength(0);
	});

	it('tells signed-in visitors their take posts from their account', () => {
		const { container } = renderHome({ live: { ...live, signedIn: true }, liveTypes });
		expect(container.querySelector('#live-note')?.textContent).toContain(
			'Posts from your account.'
		);
		expect(container.textContent).toContain('your take posts from your account');
		expect(container.querySelector('#live-note')?.textContent).not.toContain('Anonymous.');
	});

	it('links to the open questions when the live question is unavailable', () => {
		renderHome({ live: null, liveTypes: null });
		expect(screen.queryByRole('textbox', { name: 'Your take' })).toBeNull();
		expect(screen.getByRole('link', { name: /Browse open questions/ }).getAttribute('href')).toBe(
			'/questions'
		);
	});
});
