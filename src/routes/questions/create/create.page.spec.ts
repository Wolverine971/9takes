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

	it('preserves question punctuation and closes the modal before navigating', async () => {
		const fetchMock = vi.fn((input: RequestInfo | URL, _init?: RequestInit) => {
			const requestUrl = String(input);
			if (requestUrl === '?/getUrl') {
				return Promise.resolve(actionResponse({ url: 'whats-best-way-handle-this' }));
			}
			if (requestUrl === '?/createQuestion') {
				return Promise.resolve(actionResponse([{ id: 101, url: 'whats-best-way-handle-this-1' }]));
			}
			if (requestUrl === '/api/questions/upload-image') {
				return Promise.resolve(new Response(JSON.stringify({ success: true }), { status: 200 }));
			}

			throw new Error(`Unexpected request: ${requestUrl}`);
		});
		vi.stubGlobal('fetch', fetchMock);
		gotoMock.mockImplementation(async () => {
			expect(document.body.style.overflow).toBe('');
		});

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

		await waitFor(() => {
			expect(gotoMock).toHaveBeenCalledWith('/questions/whats-best-way-handle-this-1');
		});

		const prepareBody = fetchMock.mock.calls[0]?.[1]?.body as FormData;
		const createBody = fetchMock.mock.calls[1]?.[1]?.body as FormData;
		const uploadBody = fetchMock.mock.calls[2]?.[1]?.body as FormData;
		const normalizedQuestion = "What's the best way to handle this?";

		expect(prepareBody.get('question')).toBe(normalizedQuestion);
		expect(createBody.get('question')).toBe(normalizedQuestion);
		expect(createBody.has('author_id')).toBe(false);
		expect(uploadBody.get('url')).toBe('whats-best-way-handle-this-1');
		expect(notificationMocks.success).toHaveBeenCalledWith('Question created successfully!', 3000);
		expect(notificationMocks.danger).not.toHaveBeenCalled();
	});
});
