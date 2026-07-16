// src/routes/questions/create/create.page.spec.ts
// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { readable } from 'svelte/store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { gotoMock, notificationMocks, html2canvasMock } = vi.hoisted(() => ({
	gotoMock: vi.fn(),
	notificationMocks: {
		danger: vi.fn(),
		info: vi.fn(),
		success: vi.fn(),
		warning: vi.fn()
	},
	html2canvasMock: vi.fn()
}));

vi.mock('$app/navigation', () => ({
	goto: gotoMock
}));

vi.mock('$app/forms', () => ({
	deserialize: (value: string) => JSON.parse(value)
}));

vi.mock('$app/stores', () => ({
	page: readable({ url: new URL('http://localhost/questions/create') })
}));

vi.mock('$lib/components/molecules/notifications', () => ({
	notifications: notificationMocks
}));

vi.mock('html2canvas', () => ({
	default: html2canvasMock
}));

import CreateQuestionPage from './+page.svelte';

function actionResponse(data: unknown): Response {
	return new Response(
		JSON.stringify({
			type: 'success',
			status: 200,
			data
		})
	);
}

describe('Create Question page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		Object.defineProperty(document, 'fonts', {
			configurable: true,
			value: { ready: Promise.resolve() }
		});
		Object.defineProperty(HTMLImageElement.prototype, 'complete', {
			configurable: true,
			get: () => true
		});
		vi.stubGlobal(
			'ResizeObserver',
			class {
				observe() {}
				unobserve() {}
				disconnect() {}
			}
		);
		Object.defineProperty(Element.prototype, 'animate', {
			configurable: true,
			value: () => ({
				cancel: () => {},
				currentTime: 0,
				finished: Promise.resolve(),
				play: () => {},
				reverse: () => {}
			})
		});
		Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
			configurable: true,
			value: () => null
		});
		html2canvasMock.mockResolvedValue({
			toDataURL: () => 'data:image/png;base64,abcd'
		});
	});

	afterEach(() => {
		cleanup();
		vi.unstubAllGlobals();
	});

	it('preserves punctuation and keeps the loading handoff visible until navigation resolves', async () => {
		let resolveNavigation!: () => void;
		let resolveCreation!: (response: Response) => void;
		let resolveUpload!: (response: Response) => void;
		const fetchMock = vi.fn((input: RequestInfo | URL, _init?: RequestInit) => {
			const requestUrl = String(input);
			if (requestUrl === '?/getUrl') {
				return Promise.resolve(actionResponse({ url: 'whats-best-way-handle-this' }));
			}
			if (requestUrl === '?/createQuestion') {
				return new Promise<Response>((resolve) => {
					resolveCreation = resolve;
				});
			}
			if (requestUrl === '/api/questions/upload-image') {
				return new Promise<Response>((resolve) => {
					resolveUpload = resolve;
				});
			}

			throw new Error(`Unexpected request: ${requestUrl}`);
		});
		vi.stubGlobal('fetch', fetchMock);
		gotoMock.mockImplementation(
			() =>
				new Promise<void>((resolve) => {
					resolveNavigation = resolve;
				})
		);

		render(CreateQuestionPage, {
			props: {
				data: {
					session: { user: { id: '123e4567-e89b-12d3-a456-426614174000' } }
				} as any
			}
		});

		const questionInput = screen.getByLabelText('Your question');
		await fireEvent.input(questionInput, {
			target: { value: "What's   the best way to handle this?" }
		});
		await fireEvent.click(screen.getByRole('button', { name: 'Launch Your Question' }));

		const confirmButton = await screen.findByRole('button', { name: /Yes, create question/i });
		await fireEvent.click(confirmButton);
		let progressStatus = screen.getByRole('status');
		expect(progressStatus.textContent).toContain('Saving your question');
		expect(progressStatus.textContent).toContain(
			'Securing your question and preparing its discussion page.'
		);
		expect(document.activeElement).toBe(progressStatus);

		resolveCreation(actionResponse([{ id: 101, url: 'whats-best-way-handle-this-1' }]));
		await waitFor(() => {
			expect(screen.getByRole('status').textContent).toContain('Question saved');
		});
		await waitFor(() => {
			expect(
				fetchMock.mock.calls.some(([input]) => String(input) === '/api/questions/upload-image')
			).toBe(true);
		});
		resolveUpload(new Response(JSON.stringify({ success: true }), { status: 200 }));

		await waitFor(() => {
			expect(gotoMock).toHaveBeenCalledWith('/questions/whats-best-way-handle-this-1');
		});
		progressStatus = screen.getByRole('status');
		expect(progressStatus.textContent).toContain('Question created');
		expect(progressStatus.textContent).toContain('Opening your new discussion now.');
		expect(document.activeElement).toBe(progressStatus);
		expect(document.body.style.overflow).toBe('hidden');
		expect(notificationMocks.success).not.toHaveBeenCalled();

		const prepareBody = fetchMock.mock.calls[0]?.[1]?.body as FormData;
		const createBody = fetchMock.mock.calls[1]?.[1]?.body as FormData;
		const uploadBody = fetchMock.mock.calls[2]?.[1]?.body as FormData;
		const normalizedQuestion = "What's the best way to handle this?";

		expect(prepareBody.get('question')).toBe(normalizedQuestion);
		expect(createBody.get('question')).toBe(normalizedQuestion);
		expect(createBody.has('author_id')).toBe(false);
		expect(uploadBody.get('url')).toBe('whats-best-way-handle-this-1');
		expect(uploadBody.getAll('img_url')).toHaveLength(1);

		resolveNavigation();
		await waitFor(() => {
			expect(notificationMocks.success).toHaveBeenCalledWith(
				'Question created successfully!',
				3000
			);
		});
		expect(notificationMocks.danger).not.toHaveBeenCalled();
	});

	it('recovers from a failed handoff without creating a duplicate question', async () => {
		const fetchMock = vi.fn((input: RequestInfo | URL, _init?: RequestInit) => {
			const requestUrl = String(input);
			if (requestUrl === '?/getUrl') {
				return Promise.resolve(actionResponse({ url: 'how-do-i-recover' }));
			}
			if (requestUrl === '?/createQuestion') {
				return Promise.resolve(actionResponse([{ id: 102, url: 'how-do-i-recover' }]));
			}
			if (requestUrl === '/api/questions/upload-image') {
				return Promise.resolve(new Response(JSON.stringify({ success: true }), { status: 200 }));
			}

			throw new Error(`Unexpected request: ${requestUrl}`);
		});
		vi.stubGlobal('fetch', fetchMock);
		gotoMock
			.mockRejectedValueOnce(new Error('Destination load failed'))
			.mockResolvedValueOnce(undefined);

		render(CreateQuestionPage, {
			props: {
				data: {
					session: { user: { id: '123e4567-e89b-12d3-a456-426614174000' } }
				} as any
			}
		});

		await fireEvent.input(screen.getByLabelText('Your question'), {
			target: { value: 'How do I recover from this navigation failure?' }
		});
		await fireEvent.click(screen.getByRole('button', { name: 'Launch Your Question' }));
		await fireEvent.click(await screen.findByRole('button', { name: /Yes, create question/i }));

		const retryButton = await screen.findByRole('button', { name: 'View Your Question' });
		const errorAlert = await screen.findByRole('alert');
		expect(errorAlert.textContent).toContain(
			'Your question was created, but it could not be opened automatically.'
		);
		expect(document.body.style.overflow).toBe('');
		expect(notificationMocks.warning).toHaveBeenCalled();

		await fireEvent.click(retryButton);
		await waitFor(() => expect(gotoMock).toHaveBeenCalledTimes(2));
		expect(gotoMock).toHaveBeenLastCalledWith('/questions/how-do-i-recover');
		expect(
			fetchMock.mock.calls.filter(([input]) => String(input) === '?/createQuestion')
		).toHaveLength(1);
	});
});
