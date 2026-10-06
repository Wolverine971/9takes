// src/routes/book-session/book-session.page.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
	createTalkNoteMock,
	saveTalkNoteDetailsMock,
	consumeApiRateLimitMock,
	recordCtaExperimentEventMock
} = vi.hoisted(() => ({
	createTalkNoteMock: vi.fn(),
	saveTalkNoteDetailsMock: vi.fn(),
	consumeApiRateLimitMock: vi.fn(),
	recordCtaExperimentEventMock: vi.fn()
}));

vi.mock('$lib/server/talkNotes', () => ({
	createTalkNote: createTalkNoteMock,
	saveTalkNoteDetails: saveTalkNoteDetailsMock,
	newTalkToken: () => 'fake-token-aaaaaaaaaaaaaaaaaaaaaaaa',
	looksLikeBotUserAgent: (ua: string) => !ua || ua.length < 20 || /bot|curl/i.test(ua),
	TALK_NOTE_MIN_FORM_MS: 3000
}));

vi.mock('$lib/server/apiRateLimit', () => ({
	consumeApiRateLimit: consumeApiRateLimitMock,
	resolveRateLimitSubject: ({ clientAddress }: { clientAddress: string }) => `ip:${clientAddress}`
}));

vi.mock('$lib/server/ctaExperiments', () => ({
	recordCtaExperimentEvent: recordCtaExperimentEventMock
}));

import { actions, load } from './+page.server';
import { TALK_SITUATIONS_EXPERIMENT } from '$lib/utils/talkSituations';

const BROWSER_UA =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36';

function noteEvent(fields: Record<string, string | File> = {}, userAgent = BROWSER_UA) {
	const formData = new FormData();
	formData.append('body', 'I keep shutting down when my partner gets upset.');
	formData.append('form_extra', '');
	formData.append('_timeToken', '8000');
	for (const [key, value] of Object.entries(fields)) formData.set(key, value);

	return {
		request: new Request('http://localhost/book-session?/note', {
			method: 'POST',
			body: formData,
			headers: { 'user-agent': userAgent, referer: 'https://9takes.com/questions' }
		}),
		url: new URL('http://localhost/book-session?utm_source=ig'),
		getClientAddress: () => '203.0.113.5',
		locals: {},
		cookies: { get: () => 'fp-1' }
	} as any;
}

function detailsEvent(fields: Record<string, string>) {
	const formData = new FormData();
	for (const [key, value] of Object.entries(fields)) formData.set(key, value);
	return {
		request: new Request('http://localhost/book-session?/details', {
			method: 'POST',
			body: formData
		})
	} as any;
}

beforeEach(() => {
	vi.clearAllMocks();
	consumeApiRateLimitMock.mockResolvedValue({ allowed: true, retryAfterSeconds: 0 });
	createTalkNoteMock.mockResolvedValue({
		ok: true,
		noteId: 'note-1',
		detailsToken: 'token-bbbbbbbbbbbbbbbbbbbbbbbb'
	});
});

describe('/book-session load', () => {
	it('rounds the corpus count down for the credential line', async () => {
		const data = (await load({} as any)) as { publicFigureCount: string | null };
		expect(data.publicFigureCount).toMatch(/^\d+0\+$/);
	});
});

describe('/book-session ?/note situations', () => {
	it('passes the picked situation to the alert and counts the sent note', async () => {
		await actions.note(noteEvent({ situation: 'fight' }));

		expect(createTalkNoteMock).toHaveBeenCalledWith(
			expect.objectContaining({ situationLabel: 'The fight we keep having' })
		);
		expect(recordCtaExperimentEventMock).toHaveBeenCalledWith({
			experiment: TALK_SITUATIONS_EXPERIMENT,
			variant: 'fight',
			event: 'submitted',
			surface: 'book_session',
			placement: 'door',
			path: '/book-session',
			fingerprint: 'fp-1'
		});
	});

	it('ignores unknown situations', async () => {
		await actions.note(noteEvent({ situation: 'made-up' }));

		expect(createTalkNoteMock).toHaveBeenCalledWith(
			expect.objectContaining({ situationLabel: null })
		);
		expect(recordCtaExperimentEventMock).not.toHaveBeenCalled();
	});

	it('counts nothing when the note did not save or was a bot', async () => {
		createTalkNoteMock.mockResolvedValueOnce({ ok: false, status: 500, message: 'nope' });
		await actions.note(noteEvent({ situation: 'fight' }));
		await actions.note(noteEvent({ situation: 'fight', form_extra: 'spam' }));

		expect(recordCtaExperimentEventMock).not.toHaveBeenCalled();
	});
});

describe('/book-session ?/note', () => {
	it('saves the note and returns the details token', async () => {
		const result = await actions.note(noteEvent());

		expect(result).toEqual({
			noteSaved: true,
			noteId: 'note-1',
			detailsToken: 'token-bbbbbbbbbbbbbbbbbbbbbbbb'
		});
		expect(createTalkNoteMock).toHaveBeenCalledWith(
			expect.objectContaining({
				body: 'I keep shutting down when my partner gets upset.',
				clientAddress: '203.0.113.5',
				utm: { utm_source: 'ig' },
				referrer: 'https://9takes.com/questions'
			})
		);
	});

	it('passes a voice recording and its length through', async () => {
		const audio = new File([new Uint8Array(1024)], 'note.webm', { type: 'audio/webm' });
		await actions.note(noteEvent({ audio, audioSeconds: '42' }));

		const input = createTalkNoteMock.mock.calls[0][0];
		expect(input.audio).toBeInstanceOf(File);
		expect(input.audioSeconds).toBe(42);
	});

	it('fakes success for bots without saving anything', async () => {
		const honeypot = await actions.note(noteEvent({ form_extra: 'http://spam.example' }));
		const tooFast = await actions.note(noteEvent({ _timeToken: '400' }));
		const botUa = await actions.note(noteEvent({}, 'curl/8.1'));

		for (const result of [honeypot, tooFast, botUa]) {
			expect(result).toMatchObject({ noteSaved: true });
		}
		expect(createTalkNoteMock).not.toHaveBeenCalled();
	});

	it('rate limits per visitor and keeps their text', async () => {
		consumeApiRateLimitMock.mockResolvedValueOnce({ allowed: false, retryAfterSeconds: 60 });
		const result: any = await actions.note(noteEvent());

		expect(result.status).toBe(429);
		expect(result.data.body).toBe('I keep shutting down when my partner gets upset.');
		expect(createTalkNoteMock).not.toHaveBeenCalled();
	});

	it('returns validation failures with the note intact', async () => {
		createTalkNoteMock.mockResolvedValueOnce({
			ok: false,
			status: 400,
			message: 'Say a little something first.'
		});
		const result: any = await actions.note(noteEvent({ body: '' }));
		expect(result.status).toBe(400);
		expect(result.data.noteMessage).toBe('Say a little something first.');
	});
});

describe('/book-session ?/details', () => {
	it('saves an email and a session request', async () => {
		saveTalkNoteDetailsMock.mockResolvedValueOnce({
			ok: true,
			replyExpected: true,
			wantsSession: true,
			email: 'sam@example.com'
		});
		const result = await actions.details(
			detailsEvent({
				noteId: 'note-1',
				detailsToken: 'token-bbbbbbbbbbbbbbbbbbbbbbbb',
				email: 'sam@example.com',
				name: 'Sam',
				wantsSession: 'on'
			})
		);

		expect(saveTalkNoteDetailsMock).toHaveBeenCalledWith({
			noteId: 'note-1',
			detailsToken: 'token-bbbbbbbbbbbbbbbbbbbbbbbb',
			email: 'sam@example.com',
			name: 'Sam',
			wantsSession: true
		});
		expect(result).toEqual({
			detailsSaved: true,
			replyExpected: true,
			wantsSession: true,
			email: 'sam@example.com'
		});
	});

	it('echoes the note id and token back on failure so the step can retry', async () => {
		saveTalkNoteDetailsMock.mockResolvedValueOnce({
			ok: false,
			status: 400,
			message: 'That email doesn’t look right.'
		});
		const result: any = await actions.details(
			detailsEvent({
				noteId: 'note-1',
				detailsToken: 'token-bbbbbbbbbbbbbbbbbbbbbbbb',
				email: 'nope'
			})
		);

		expect(result.status).toBe(400);
		expect(result.data).toMatchObject({
			detailsMessage: 'That email doesn’t look right.',
			noteId: 'note-1',
			detailsToken: 'token-bbbbbbbbbbbbbbbbbbbbbbbb',
			wantsSession: false
		});
	});
});
