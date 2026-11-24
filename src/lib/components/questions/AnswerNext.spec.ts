// src/lib/components/questions/AnswerNext.spec.ts
// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/paths', () => ({
	resolve: (path: string, params?: { slug: string }) => path.replace('[slug]', params?.slug ?? '')
}));
const { shownMock, openedMock, skippedMock } = vi.hoisted(() => ({
	shownMock: vi.fn(),
	openedMock: vi.fn(),
	skippedMock: vi.fn()
}));
vi.mock('$lib/analytics/answerChainEvents', () => ({
	captureAnswerNextShown: shownMock,
	captureAnswerNextOpened: openedMock,
	captureAnswerNextSkipped: skippedMock
}));
vi.mock('$lib/analytics/commentEvents', async (importOriginal) => ({
	...(await importOriginal<typeof import('$lib/analytics/commentEvents')>()),
	captureCommentCreated: vi.fn(),
	captureCommentFailed: vi.fn()
}));

import AnswerNext from './AnswerNext.svelte';

const AFTER = 'whats-your-biggest-fear';
const FEAR = {
	url: 'what-do-you-pretend',
	title: 'What do you pretend not to care about?',
	responses: 7
};
const OTHER = { url: 'what-drains-you', title: 'What drains you fastest?', responses: 0 };

function liveFor(question: typeof FEAR) {
	return {
		questionId: 77,
		slug: question.url,
		title: question.title,
		responses: question.responses,
		signedIn: false,
		answered: false,
		ownTake: null,
		answers: []
	};
}

const fetchMock = vi.fn();

function json(body: unknown, status = 200) {
	return Promise.resolve(new Response(JSON.stringify(body), { status }));
}

function urls() {
	return fetchMock.mock.calls.map(([url]) => String(url));
}

beforeEach(() => {
	fetchMock.mockReset();
	vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

function renderNext() {
	return render(AnswerNext, {
		props: {
			afterSlug: AFTER,
			sourcePath: '/personality-analysis/taylor-swift',
			host: 'personality_chorus'
		}
	});
}

describe('AnswerNext', () => {
	it('names the next question before anything opens', async () => {
		fetchMock.mockImplementation(() => json({ next: FEAR }));
		renderNext();

		expect(await screen.findByText(FEAR.title)).toBeTruthy();
		expect(screen.getByText('7 takes waiting behind it')).toBeTruthy();
		expect(urls()).toEqual([`/api/questions/next?after=${AFTER}`]);
		expect(shownMock).toHaveBeenCalledWith({
			host: 'personality_chorus',
			step: 1,
			sourcePath: '/personality-analysis/taylor-swift'
		});
	});

	it('opens the card in place, with the host page as attribution', async () => {
		fetchMock.mockImplementation((url: string) =>
			url.startsWith('/api/questions/next')
				? json({ next: FEAR })
				: json({ live: liveFor(FEAR), types: null })
		);
		renderNext();

		await fireEvent.click(await screen.findByRole('button', { name: /Answer this one/ }));

		await waitFor(() => expect(screen.getByRole('textbox', { name: 'Your take' })).toBeTruthy());
		expect(urls()[1]).toBe(
			`/api/questions/live/${FEAR.url}?from=%2Fpersonality-analysis%2Ftaylor-swift`
		);
		expect(screen.getByText('One more · 1 of 3')).toBeTruthy();
		expect(openedMock).toHaveBeenCalledWith(expect.objectContaining({ step: 1 }));
	});

	it('skips to a different question and never offers the skipped one again', async () => {
		fetchMock
			.mockImplementationOnce(() => json({ next: FEAR }))
			.mockImplementationOnce(() => json({ next: OTHER }));
		renderNext();

		await fireEvent.click(await screen.findByRole('button', { name: 'Different question' }));

		expect(await screen.findByText(OTHER.title)).toBeTruthy();
		expect(screen.getByText('No takes yet. Yours would be the first.')).toBeTruthy();
		expect(urls()[1]).toBe(`/api/questions/next?after=${AFTER}&skip=${FEAR.url}`);
		expect(skippedMock).toHaveBeenCalledTimes(1);
	});

	it('shows nothing when there is no other question to offer', async () => {
		fetchMock.mockImplementation(() => json({ next: null }));
		const { container } = renderNext();

		await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
		await waitFor(() => expect(container.querySelector('.teaser')).toBeNull());
		expect(shownMock).not.toHaveBeenCalled();
	});

	it('says so when the question cannot be opened', async () => {
		fetchMock
			.mockImplementationOnce(() => json({ next: FEAR }))
			.mockImplementationOnce(() => json({ error: 'This question isn’t open right now.' }, 404));
		renderNext();

		await fireEvent.click(await screen.findByRole('button', { name: /Answer this one/ }));

		expect((await screen.findByRole('alert')).textContent).toBe(
			'This question isn’t open right now.'
		);
	});
});
