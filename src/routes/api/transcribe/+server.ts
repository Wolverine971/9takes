// src/routes/api/transcribe/+server.ts
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { logger } from '$lib/utils/logger';
import { consumeApiRateLimit, resolveRateLimitSubject } from '$lib/server/apiRateLimit';

export const config = {
	maxDuration: 60
};

const OPENROUTER_TRANSCRIPTION_URL = 'https://openrouter.ai/api/v1/audio/transcriptions';
const DEFAULT_TRANSCRIPTION_MODEL = 'openai/gpt-4o-mini-transcribe';
const MAX_AUDIO_BYTES = 4 * 1024 * 1024;

const AUDIO_FORMATS: Record<string, string> = {
	'audio/aac': 'aac',
	'audio/flac': 'flac',
	'audio/mp4': 'm4a',
	'audio/mpeg': 'mp3',
	'audio/ogg': 'ogg',
	'audio/wav': 'wav',
	'audio/webm': 'webm',
	'audio/x-flac': 'flac'
};

function getAudioFormat(file: File): string | null {
	const baseMimeType = file.type.split(';')[0]?.trim().toLowerCase();
	return AUDIO_FORMATS[baseMimeType] ?? null;
}

function getProviderErrorMessage(status: number): string {
	if (status === 429) return 'Voice transcription is busy. Please wait a moment and try again.';
	if (status === 402) return 'Voice transcription is temporarily unavailable.';
	return 'We could not transcribe that recording. Please try again.';
}

function getProviderResponseStatus(status: number): number {
	if (status === 429) return 429;
	if (status === 402) return 503;
	return 502;
}

export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
	if (request.headers.get('sec-fetch-site') === 'cross-site') {
		return json({ error: 'Cross-site transcription requests are not allowed.' }, { status: 403 });
	}

	const apiKey = env.PRIVATE_OPENROUTER_API_KEY?.trim();
	if (!apiKey) {
		logger.error('OpenRouter transcription is not configured');
		return json({ error: 'Voice transcription is not configured.' }, { status: 503 });
	}

	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		return json({ error: 'Invalid audio upload.' }, { status: 400 });
	}

	const audio = formData.get('audio');
	if (!(audio instanceof File) || audio.size === 0) {
		return json({ error: 'No audio recording was received.' }, { status: 400 });
	}

	if (audio.size > MAX_AUDIO_BYTES) {
		return json(
			{ error: 'That recording is too large. Keep voice answers under two minutes.' },
			{ status: 413 }
		);
	}

	const format = getAudioFormat(audio);
	if (!format) {
		return json({ error: 'This audio format is not supported.' }, { status: 415 });
	}

	// Keyed on session or IP, never on the 9tfingerprint cookie: a caller can
	// rewrite that cookie to mint themselves an unlimited budget on a paid API.
	const decision = await consumeApiRateLimit({
		bucket: 'transcribe',
		subject: resolveRateLimitSubject({
			userId: locals.session?.user?.id,
			clientAddress: getClientAddress()
		})
	});

	if (!decision.allowed) {
		return json(
			{ error: 'You have made several voice recordings. Please wait a few minutes.' },
			{ status: 429, headers: { 'Retry-After': String(decision.retryAfterSeconds) } }
		);
	}

	const model = env.TRANSCRIPTION_OPENROUTER_MODEL?.trim() || DEFAULT_TRANSCRIPTION_MODEL;
	const startedAt = Date.now();

	try {
		const encodedAudio = Buffer.from(await audio.arrayBuffer()).toString('base64');
		const response = await fetch(OPENROUTER_TRANSCRIPTION_URL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
				'HTTP-Referer': 'https://9takes.com',
				'X-Title': '9takes Voice Answers'
			},
			body: JSON.stringify({
				model,
				input_audio: {
					data: encodedAudio,
					format
				},
				temperature: 0
			}),
			signal: AbortSignal.timeout(45_000)
		});

		const payload = (await response.json().catch(() => null)) as {
			text?: string;
			model?: string;
		} | null;

		if (!response.ok) {
			logger.warn('OpenRouter transcription request failed', {
				status: response.status,
				model,
				durationMs: Date.now() - startedAt
			});
			return json(
				{ error: getProviderErrorMessage(response.status) },
				{ status: getProviderResponseStatus(response.status) }
			);
		}

		const transcript = payload?.text?.trim();
		if (!transcript) {
			logger.warn('OpenRouter transcription returned no text', {
				model,
				durationMs: Date.now() - startedAt
			});
			return json({ error: 'No speech was detected in that recording.' }, { status: 422 });
		}

		return json(
			{
				transcript,
				model: payload?.model || model,
				durationMs: Date.now() - startedAt
			},
			{ headers: { 'cache-control': 'no-store' } }
		);
	} catch (error) {
		const timedOut = error instanceof DOMException && error.name === 'TimeoutError';
		logger.error('OpenRouter transcription failed', error as Error, {
			model,
			durationMs: Date.now() - startedAt
		});
		return json(
			{
				error: timedOut
					? 'Transcription took too long. Please try a shorter recording.'
					: 'Voice transcription is temporarily unavailable.'
			},
			{ status: timedOut ? 504 : 503 }
		);
	}
};
