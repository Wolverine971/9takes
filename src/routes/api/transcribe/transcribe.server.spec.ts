// src/routes/api/transcribe/transcribe.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { fetchMock, loggerMocks } = vi.hoisted(() => ({
	fetchMock: vi.fn(),
	loggerMocks: {
		error: vi.fn(),
		warn: vi.fn()
	}
}));

vi.mock('$env/dynamic/private', () => ({
	env: {
		PRIVATE_OPENROUTER_API_KEY: 'test-openrouter-key',
		TRANSCRIPTION_OPENROUTER_MODEL: 'openai/gpt-4o-mini-transcribe'
	}
}));

vi.mock('$lib/utils/logger', () => ({
	logger: loggerMocks
}));

import { POST } from './+server';

function buildRequest(options?: {
	type?: string;
	body?: BlobPart;
	headers?: Record<string, string>;
}) {
	const body = options?.body ?? 'recorded audio';
	const formData = new FormData();
	formData.append(
		'audio',
		new File([body], 'answer.webm', { type: options?.type ?? 'audio/webm;codecs=opus' })
	);
	return new Request('http://localhost/api/transcribe', {
		method: 'POST',
		body: formData,
		headers: options?.headers
	});
}

function buildEvent(request: Request, clientAddress: string) {
	return {
		request,
		locals: { session: null },
		cookies: { get: vi.fn(() => undefined) },
		getClientAddress: () => clientAddress
	} as any;
}

describe('POST /api/transcribe', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.stubGlobal('fetch', fetchMock);
	});

	it('sends anonymous browser audio to the OpenRouter transcription endpoint', async () => {
		fetchMock.mockResolvedValue(
			new Response(JSON.stringify({ text: 'A clear, polished answer.' }), {
				status: 200,
				headers: { 'content-type': 'application/json' }
			})
		);

		const response = await POST(buildEvent(buildRequest(), '192.0.2.1'));
		const payload = await response.json();

		expect(response.status).toBe(200);
		expect(payload.transcript).toBe('A clear, polished answer.');
		expect(response.headers.get('cache-control')).toBe('no-store');
		expect(fetchMock).toHaveBeenCalledOnce();

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const requestBody = JSON.parse(String(init.body));
		expect(url).toBe('https://openrouter.ai/api/v1/audio/transcriptions');
		expect(init.headers).toMatchObject({
			Authorization: 'Bearer test-openrouter-key',
			'HTTP-Referer': 'https://9takes.com'
		});
		expect(requestBody).toMatchObject({
			model: 'openai/gpt-4o-mini-transcribe',
			temperature: 0,
			input_audio: { format: 'webm' }
		});
		expect(Buffer.from(requestBody.input_audio.data, 'base64').toString()).toBe('recorded audio');
	});

	it('rejects unsupported audio before spending an API call', async () => {
		const response = await POST(
			buildEvent(buildRequest({ type: 'application/octet-stream' }), '192.0.2.2')
		);

		expect(response.status).toBe(415);
		expect(await response.json()).toEqual({ error: 'This audio format is not supported.' });
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects cross-site requests', async () => {
		const response = await POST(
			buildEvent(buildRequest({ headers: { 'sec-fetch-site': 'cross-site' } }), '192.0.2.3')
		);

		expect(response.status).toBe(403);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('preserves provider rate-limit semantics without exposing provider details', async () => {
		fetchMock.mockResolvedValue(
			new Response(JSON.stringify({ error: { message: 'provider detail' } }), {
				status: 429,
				headers: { 'content-type': 'application/json' }
			})
		);

		const response = await POST(buildEvent(buildRequest(), '192.0.2.4'));
		const payload = await response.json();

		expect(response.status).toBe(429);
		expect(payload.error).toBe('Voice transcription is busy. Please wait a moment and try again.');
		expect(JSON.stringify(payload)).not.toContain('provider detail');
	});
});
