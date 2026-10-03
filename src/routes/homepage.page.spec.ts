// src/routes/homepage.page.spec.ts
// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/paths', () => ({
	resolve: (path: string, params?: { slug: string }) => path.replace('[slug]', params?.slug ?? '')
}));
vi.mock('svelte/motion', () => ({ prefersReducedMotion: { current: false } }));
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
import HomepagePreview from './design-preview/harry-dry/+page.svelte';

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

async function writeAndReveal(text = ANSWER) {
	await fireEvent.input(screen.getByRole('textbox'), { target: { value: text } });
	await fireEvent.click(screen.getByRole('button', { name: 'Reveal 9 perspectives' }));
}

describe('promoted homepage', () => {
	it('uses indexable homepage metadata and delegates navigation to the shared site header', () => {
		const { container } = render(Homepage, { props: { data: { live } as never } });
		expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
			'https://9takes.com'
		);
		expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toMatch(
			/^index, follow/
		);
		expect(load({} as never)).toEqual({ pageChrome: 'default', pageShell: 'owned' });
		expect(load({ data: { live } } as never)).toEqual({
			live,
			pageChrome: 'default',
			pageShell: 'owned'
		});
		expect(screen.queryByRole('navigation')).toBeNull();
		expect(container.querySelector('header')).toBeNull();
		expect(document.title).toBe('1 Question, 9 Perspectives | 9takes');
		expect(container.textContent).not.toMatch(/§|PREVIEW|Preview|Current homepage|Compare V1|V2/);
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

	it('falls back to the local practice answer when the live question is unavailable', async () => {
		const { container } = render(Homepage, { props: { data: { live: null } as never } });
		const answer = 'Private test answer: listen before judging.';
		await writeAndReveal(answer);
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
		const revealEvent = practiceMock.mock.calls.find(([input]) => input.step === 'revealed')?.[0];
		expect(revealEvent).toMatchObject({ surface: 'homepage', practiceId: 'friendship' });
		expect(JSON.stringify(practiceMock.mock.calls)).not.toContain(answer);
		expect(
			screen.getByRole('link', { name: 'Join the friendship conversation' }).getAttribute('href')
		).toBe(`/questions/${SLUG}`);
	});

	it('keeps the alternate design route excluded from indexing', () => {
		render(HomepagePreview);
		expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toMatch(
			/^noindex, nofollow/
		);
		expect(screen.getByRole('navigation', { name: 'Preview navigation' })).toBeTruthy();
	});
});

describe('homepage live take', () => {
	it('frames the hero around the live question and shows no takes before posting', async () => {
		const { container } = render(Homepage, { props: { data: { live } as never } });
		expect(screen.getByRole('heading', { name: live.title })).toBeTruthy();
		expect(screen.getByText('10 responses so far')).toBeTruthy();
		expect(screen.getByText(/Nothing is posted unless you choose to/)).toBeTruthy();

		await writeAndReveal();
		expect(await screen.findByText('10 responses from real people are waiting.')).toBeTruthy();
		expect(container.querySelectorAll('.live-take')).toHaveLength(0);
		expect(container.textContent).not.toMatch(/Preview|simulated/);
		expect(answerCalls()).toHaveLength(0);
	});

	it('posts the answer for real, unlocks the answers and offers reply notes', async () => {
		const { container } = render(Homepage, { props: { data: { live } as never } });
		await writeAndReveal();
		await fireEvent.click(
			await screen.findByRole('button', { name: 'Post anonymously and read them' })
		);

		await waitFor(() =>
			expect(
				screen.getByRole('heading', { name: 'You’re in. Here’s how others answered.' })
			).toBeTruthy()
		);
		const [, init] = answerCalls()[0];
		expect(init).toMatchObject({ method: 'POST', headers: { 'content-type': 'application/json' } });
		expect(JSON.parse(String(init?.body))).toEqual({
			slug: SLUG,
			comment: ANSWER,
			fingerprint: 'visitor-cookie'
		});

		expect(screen.getByText('They remember the small things.')).toBeTruthy();
		expect(screen.getByText('ENNEAGRAM 2')).toBeTruthy();
		expect(container.querySelector('.own-take')?.textContent).toContain(ANSWER);
		expect(screen.getByText('11 responses so far')).toBeTruthy();
		expect(screen.queryByRole('button', { name: 'Edit answer' })).toBeNull();
		expect(
			screen.getByRole('link', { name: 'Open the full conversation' }).getAttribute('href')
		).toBe(`/questions/${SLUG}`);

		// The real "take posted" event, never with the answer text.
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
		const analytics = JSON.stringify([practiceMock.mock.calls, commentCreatedMock.mock.calls]);
		expect(analytics).not.toContain(ANSWER);

		// Reply notes: the question page's tray, saved through the live question's action.
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
		const { container } = render(Homepage, {
			props: {
				data: {
					live: {
						...live,
						answered: true,
						ownTake: { id: 77, text: 'Loyalty, mostly.' },
						answers: [{ id: 31, text: 'They remember the small things.', type: 2 }]
					}
				} as never
			}
		});

		expect(screen.queryByRole('button', { name: 'Reveal 9 perspectives' })).toBeNull();
		expect(screen.getByRole('heading', { name: 'You already answered this one.' })).toBeTruthy();
		expect(screen.getByText('YOU ANSWERED THIS ONE')).toBeTruthy();
		expect(container.querySelector('.own-take')?.textContent).toContain('Loyalty, mostly.');
		expect(screen.getByText('They remember the small things.')).toBeTruthy();
		expect(screen.queryByRole('button', { name: /Post anonymously/ })).toBeNull();
		expect(screen.queryByRole('region', { name: 'Want a note if someone replies?' })).toBeNull();
		expect(answerCalls()).toHaveLength(0);
	});

	it('shows the earlier take when the server says this visitor already answered', async () => {
		answerReply = {
			status: 200,
			body: {
				...postedBody,
				alreadyAnswered: true,
				commentId: null,
				commentAnalytics: null,
				ownTake: { id: 77, text: 'Loyalty, mostly.' }
			}
		};
		const { container } = render(Homepage, { props: { data: { live } as never } });
		await writeAndReveal();
		await fireEvent.click(
			await screen.findByRole('button', { name: 'Post anonymously and read them' })
		);

		expect(await screen.findByText('YOU ANSWERED THIS ONE')).toBeTruthy();
		expect(container.querySelector('.own-take')?.textContent).toContain('Loyalty, mostly.');
		expect(commentCreatedMock).not.toHaveBeenCalled();
		expect(screen.queryByRole('region', { name: 'Want a note if someone replies?' })).toBeNull();
	});

	it('never labels an unposted draft as the visitor’s take', async () => {
		answerReply = {
			status: 200,
			body: { ...postedBody, alreadyAnswered: true, commentId: null, ownTake: null }
		};
		const { container } = render(Homepage, { props: { data: { live } as never } });
		await writeAndReveal();
		await fireEvent.click(
			await screen.findByRole('button', { name: 'Post anonymously and read them' })
		);

		expect(await screen.findByText('YOU ANSWERED THIS ONE')).toBeTruthy();
		expect(container.querySelector('.own-take')).toBeNull();
		expect(container.querySelector('#live-optin')?.textContent).not.toContain(ANSWER);
	});

	it('keeps the draft and explains when posting fails', async () => {
		answerReply = {
			status: 429,
			body: { error: 'Too many comments. Please wait a minute before trying again.' }
		};
		const { container } = render(Homepage, { props: { data: { live } as never } });
		await writeAndReveal();
		await fireEvent.click(
			await screen.findByRole('button', { name: 'Post anonymously and read them' })
		);

		expect((await screen.findByRole('alert')).textContent).toBe(
			'Too many comments. Please wait a minute before trying again.'
		);
		expect(screen.getByRole('button', { name: 'Post anonymously and read them' })).toBeTruthy();
		expect(container.querySelector('#live-optin blockquote')?.textContent).toBe(ANSWER);
		expect(container.querySelectorAll('.live-take')).toHaveLength(0);
		expect(commentFailedMock).toHaveBeenCalledWith(
			expect.objectContaining({
				surface: 'homepage',
				failureStage: 'request',
				errorCategory: 'http_error'
			})
		);
		expect(JSON.stringify(commentFailedMock.mock.calls)).not.toContain(ANSWER);
	});

	it('tells signed-in visitors their take posts from their account', async () => {
		render(Homepage, { props: { data: { live: { ...live, signedIn: true } } as never } });
		await writeAndReveal();
		expect(await screen.findByRole('button', { name: 'Post and read them' })).toBeTruthy();
		expect(screen.getByText('Posts from your account. One answer per question here.')).toBeTruthy();
		expect(screen.queryByText(/No name or account attached/)).toBeNull();
	});
});
