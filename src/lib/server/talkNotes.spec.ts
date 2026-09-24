// src/lib/server/talkNotes.spec.ts
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { SendEmailOptions, SendEmailResult } from '$lib/email/sender';

const { loggerMocks } = vi.hoisted(() => ({
	loggerMocks: { error: vi.fn(), warn: vi.fn(), info: vi.fn() }
}));

vi.mock('$env/dynamic/private', () => ({
	env: { PRIVATE_ADMIN_EMAIL: 'admin@9takes.com', PRIVATE_SIGNUP_KEY: 'test-salt' }
}));
vi.mock('$lib/server/supabaseAdmin', () => ({ getSupabaseAdminClient: vi.fn() }));
vi.mock('$lib/email/sender', () => ({ sendEmail: vi.fn() }));
vi.mock('$lib/utils/logger', () => ({ logger: loggerMocks }));

import {
	createTalkNote,
	isTalkToken,
	loadTalkReply,
	newTalkToken,
	replyToTalkNote,
	saveTalkNoteDetails,
	setTalkNoteStatus,
	TALK_DETAILS_WINDOW_MS,
	tokensMatch,
	VOICE_ONLY_BODY
} from './talkNotes';

type Row = Record<string, any>;

// Minimal in-memory stand-in for the service-role client: enough of the
// PostgREST builder (insert/select/update/eq/order/limit) and storage API for
// talkNotes.ts.
function createFakeSupabase(initial: { talk_notes?: Row[]; coaching_waitlist?: Row[] } = {}) {
	const tables: Record<string, Row[]> = {
		talk_notes: [...(initial.talk_notes ?? [])],
		coaching_waitlist: [...(initial.coaching_waitlist ?? [])]
	};
	const uploads: Array<{ path: string; contentType: string }> = [];
	const removed: string[] = [];
	const failures = { upload: false, insert: {} as Record<string, unknown> };

	function query(table: string) {
		const filters: Array<[string, unknown]> = [];
		let op: 'select' | 'insert' | 'update' = 'select';
		let payload: Row | null = null;

		const run = (mode: 'many' | 'one') => {
			if (op === 'insert') {
				if (failures.insert[table]) return { data: null, error: failures.insert[table] };
				const row: Row = {
					id: `${table}-${tables[table].length + 1}`,
					created_at: new Date().toISOString(),
					...payload
				};
				if (table === 'coaching_waitlist' && tables[table].some((r) => r.email === row.email)) {
					return { data: null, error: { code: '23505' } };
				}
				tables[table].push(row);
				return { data: mode === 'many' ? [row] : row, error: null };
			}
			const matching = tables[table].filter((row) => filters.every(([c, v]) => row[c] === v));
			if (op === 'update') {
				matching.forEach((row) => Object.assign(row, payload));
				return { data: null, error: null };
			}
			return { data: mode === 'many' ? matching : (matching[0] ?? null), error: null };
		};

		const api: any = {
			select: () => api,
			insert: (value: Row) => ((op = 'insert'), (payload = value), api),
			update: (value: Row) => ((op = 'update'), (payload = value), api),
			eq: (column: string, value: unknown) => (filters.push([column, value]), api),
			order: () => api,
			limit: () => api,
			single: async () => run('one'),
			maybeSingle: async () => run('one'),
			then: (resolve: (v: unknown) => unknown, reject: (e: unknown) => unknown) =>
				Promise.resolve(run('many')).then(resolve, reject)
		};
		return api;
	}

	const bucket = {
		upload: vi.fn(async (path: string, _data: unknown, options: { contentType: string }) => {
			if (failures.upload) return { error: new Error('upload failed') };
			uploads.push({ path, contentType: options.contentType });
			return { error: null };
		}),
		remove: vi.fn(async (paths: string[]) => {
			removed.push(...paths);
			return { data: null, error: null };
		}),
		createSignedUrls: vi.fn(async (paths: string[]) => ({
			data: paths.map((path) => ({ path, signedUrl: `https://signed.test/${path}` })),
			error: null
		}))
	};

	return {
		client: { from: query, storage: { from: () => bucket } },
		tables,
		uploads,
		removed,
		failures
	};
}

const UA =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0 Safari/537.36';

function audioFile(type = 'audio/webm;codecs=opus', size = 2048) {
	return new File([new Uint8Array(size)], 'note.webm', { type });
}

function noteRow(overrides: Row = {}): Row {
	return {
		id: '11111111-2222-4333-8444-555555555555',
		body: 'I keep having the same fight with my brother.',
		input_mode: 'text',
		audio_path: null,
		details_token: newTalkToken(),
		created_at: new Date().toISOString(),
		email: null,
		name: null,
		wants_session: false,
		waitlist_id: null,
		status: 'new',
		reply_text: null,
		reply_audio_path: null,
		reply_token: null,
		replied_at: null,
		...overrides
	};
}

let sendEmail: Mock<(options: SendEmailOptions) => Promise<SendEmailResult>>;

beforeEach(() => {
	vi.clearAllMocks();
	sendEmail = vi.fn<(options: SendEmailOptions) => Promise<SendEmailResult>>().mockResolvedValue({
		success: true,
		providerAttempted: true,
		retrySafe: false
	});
});

describe('tokens', () => {
	it('mints url-safe tokens that validate and compare in constant time', () => {
		const token = newTalkToken();
		expect(isTalkToken(token)).toBe(true);
		expect(isTalkToken('short')).toBe(false);
		expect(isTalkToken('../../etc/passwd-aaaaaaaaaaaaaaaaaaaa')).toBe(false);
		expect(tokensMatch(token, token)).toBe(true);
		expect(tokensMatch(token, newTalkToken())).toBe(false);
		expect(tokensMatch(token, 'different-length')).toBe(false);
	});
});

describe('createTalkNote', () => {
	it('saves a typed note anonymously and notifies DJ', async () => {
		const db = createFakeSupabase();
		const result = await createTalkNote(
			{ body: '  Why does my boss <go quiet>?  ', clientAddress: '203.0.113.9', userAgent: UA },
			{ supabase: db.client, sendEmail }
		);

		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(isTalkToken(result.detailsToken)).toBe(true);

		const [row] = db.tables.talk_notes;
		expect(row).toMatchObject({
			id: result.noteId,
			body: 'Why does my boss <go quiet>?',
			input_mode: 'text',
			audio_path: null,
			details_token: result.detailsToken
		});
		expect(row.ip_hash).toMatch(/^[0-9a-f]{64}$/);
		expect(JSON.stringify(row)).not.toContain('203.0.113.9');

		expect(sendEmail).toHaveBeenCalledTimes(1);
		const mail = sendEmail.mock.calls[0][0];
		expect(mail.to).toBe('admin@9takes.com');
		expect(mail.htmlContent).toContain('&lt;go quiet&gt;');
		expect(mail.htmlContent).not.toContain('<go quiet>');
	});

	it('rejects an empty note with no recording', async () => {
		const db = createFakeSupabase();
		const result = await createTalkNote(
			{ body: '   ', clientAddress: '1.1.1.1', userAgent: UA },
			{ supabase: db.client, sendEmail }
		);
		expect(result).toMatchObject({ ok: false, status: 400 });
		expect(db.tables.talk_notes).toHaveLength(0);
	});

	it('stores a voice-only note privately with a placeholder body', async () => {
		const db = createFakeSupabase();
		const result = await createTalkNote(
			{
				body: '',
				audio: audioFile(),
				audioSeconds: 83,
				clientAddress: '1.1.1.1',
				userAgent: UA
			},
			{ supabase: db.client, sendEmail }
		);

		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(db.uploads).toEqual([
			{ path: `notes/${result.noteId}.webm`, contentType: 'audio/webm' }
		]);
		expect(db.tables.talk_notes[0]).toMatchObject({
			body: VOICE_ONLY_BODY,
			input_mode: 'voice',
			audio_path: `notes/${result.noteId}.webm`,
			audio_mime: 'audio/webm',
			audio_seconds: 83
		});
	});

	it('refuses unsupported audio and keeps nothing', async () => {
		const db = createFakeSupabase();
		const result = await createTalkNote(
			{ body: 'hi', audio: audioFile('video/mp4'), clientAddress: '1.1.1.1', userAgent: UA },
			{ supabase: db.client, sendEmail }
		);
		expect(result).toMatchObject({ ok: false, status: 415 });
		expect(db.tables.talk_notes).toHaveLength(0);
		expect(db.uploads).toHaveLength(0);
	});

	it('fails without saving the row when the audio upload fails', async () => {
		const db = createFakeSupabase();
		db.failures.upload = true;
		const result = await createTalkNote(
			{ body: 'hi', audio: audioFile(), clientAddress: '1.1.1.1', userAgent: UA },
			{ supabase: db.client, sendEmail }
		);
		expect(result).toMatchObject({ ok: false, status: 503 });
		expect(db.tables.talk_notes).toHaveLength(0);
	});
});

describe('saveTalkNoteDetails', () => {
	it('rejects a wrong or expired details token', async () => {
		const row = noteRow();
		const db = createFakeSupabase({ talk_notes: [row] });

		const wrong = await saveTalkNoteDetails(
			{ noteId: row.id, detailsToken: newTalkToken(), email: 'a@b.co', wantsSession: false },
			{ supabase: db.client, sendEmail }
		);
		expect(wrong).toMatchObject({ ok: false, status: 410 });

		const later = new Date(Date.now() + TALK_DETAILS_WINDOW_MS + 60_000);
		const expired = await saveTalkNoteDetails(
			{ noteId: row.id, detailsToken: row.details_token, email: 'a@b.co', wantsSession: false },
			{ supabase: db.client, sendEmail, now: () => later }
		);
		expect(expired).toMatchObject({ ok: false, status: 410 });
		expect(row.email).toBeNull();
	});

	it('saves an email for a private reply without emailing anyone', async () => {
		const row = noteRow();
		const db = createFakeSupabase({ talk_notes: [row] });
		const result = await saveTalkNoteDetails(
			{
				noteId: row.id,
				detailsToken: row.details_token,
				email: '  Sam@Example.com ',
				wantsSession: false
			},
			{ supabase: db.client, sendEmail }
		);

		expect(result).toEqual({
			ok: true,
			replyExpected: true,
			wantsSession: false,
			email: 'sam@example.com'
		});
		expect(row.email).toBe('sam@example.com');
		expect(db.tables.coaching_waitlist).toHaveLength(0);
		expect(sendEmail).not.toHaveBeenCalled();
	});

	it('requires an email and a first name for a session request', async () => {
		const row = noteRow();
		const db = createFakeSupabase({ talk_notes: [row] });
		const noEmail = await saveTalkNoteDetails(
			{ noteId: row.id, detailsToken: row.details_token, name: 'Sam', wantsSession: true },
			{ supabase: db.client, sendEmail }
		);
		expect(noEmail).toMatchObject({ ok: false, status: 400 });

		const noName = await saveTalkNoteDetails(
			{ noteId: row.id, detailsToken: row.details_token, email: 'sam@x.co', wantsSession: true },
			{ supabase: db.client, sendEmail }
		);
		expect(noName).toMatchObject({ ok: false, status: 400 });
	});

	it('turns a session request into a waitlist row and tells DJ', async () => {
		const row = noteRow();
		const db = createFakeSupabase({ talk_notes: [row] });
		const result = await saveTalkNoteDetails(
			{
				noteId: row.id,
				detailsToken: row.details_token,
				email: 'sam@example.com',
				name: 'Sam',
				wantsSession: true
			},
			{ supabase: db.client, sendEmail }
		);

		expect(result).toMatchObject({ ok: true, wantsSession: true, replyExpected: true });
		expect(db.tables.coaching_waitlist).toEqual([
			expect.objectContaining({ name: 'Sam', email: 'sam@example.com', session_goal: row.body })
		]);
		expect(row.waitlist_id).toBe(db.tables.coaching_waitlist[0].id);
		expect(sendEmail).toHaveBeenCalledTimes(1);
		expect(sendEmail.mock.calls[0][0].to).toBe('admin@9takes.com');
	});

	it('links an existing waitlist row instead of failing on a duplicate email', async () => {
		const row = noteRow();
		const db = createFakeSupabase({
			talk_notes: [row],
			coaching_waitlist: [{ id: 'existing-waitlist', email: 'sam@example.com', name: 'Sam' }]
		});
		const result = await saveTalkNoteDetails(
			{
				noteId: row.id,
				detailsToken: row.details_token,
				email: 'sam@example.com',
				name: 'Sam',
				wantsSession: true
			},
			{ supabase: db.client, sendEmail }
		);
		expect(result.ok).toBe(true);
		expect(row.waitlist_id).toBe('existing-waitlist');
		expect(db.tables.coaching_waitlist).toHaveLength(1);
	});

	it('rejects disposable email domains', async () => {
		const row = noteRow();
		const db = createFakeSupabase({ talk_notes: [row] });
		const result = await saveTalkNoteDetails(
			{
				noteId: row.id,
				detailsToken: row.details_token,
				email: 'x@mailinator.com',
				wantsSession: false
			},
			{ supabase: db.client, sendEmail }
		);
		expect(result).toMatchObject({ ok: false, status: 400 });
	});
});

describe('replyToTalkNote', () => {
	it('refuses to reply to an anonymous note', async () => {
		const row = noteRow();
		const db = createFakeSupabase({ talk_notes: [row] });
		const result = await replyToTalkNote(
			{ noteId: row.id, replyText: 'Hey', origin: 'https://9takes.com' },
			{ supabase: db.client, sendEmail }
		);
		expect(result).toMatchObject({ ok: false, status: 400 });
		expect(sendEmail).not.toHaveBeenCalled();
	});

	it('emails a text reply with a private link and marks the note replied', async () => {
		const row = noteRow({ email: 'sam@example.com', name: 'Sam' });
		const db = createFakeSupabase({ talk_notes: [row] });
		const result = await replyToTalkNote(
			{ noteId: row.id, replyText: 'Here is <what> I hear.', origin: 'https://9takes.com' },
			{ supabase: db.client, sendEmail }
		);

		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.emailSent).toBe(true);
		expect(isTalkToken(row.reply_token)).toBe(true);
		expect(result.replyUrl).toBe(`https://9takes.com/talk/reply/${row.reply_token}`);
		expect(row).toMatchObject({ status: 'replied', reply_text: 'Here is <what> I hear.' });
		expect(row.reply_email_sent_at).toBeTruthy();

		const mail = sendEmail.mock.calls[0][0];
		expect(mail.to).toBe('sam@example.com');
		expect(mail.emailKind).toBe('transactional');
		expect(mail.htmlContent).toContain('Hey Sam,');
		expect(mail.htmlContent).toContain('&lt;what&gt;');
		expect(mail.htmlContent).toContain(result.replyUrl);
		expect(mail.htmlContent).not.toContain('Listen to my voice note');
	});

	it('uploads a voice reply and links to it', async () => {
		const row = noteRow({ email: 'sam@example.com' });
		const db = createFakeSupabase({ talk_notes: [row] });
		const result = await replyToTalkNote(
			{
				noteId: row.id,
				replyText: '',
				audio: audioFile('audio/mp4'),
				origin: 'https://9takes.com'
			},
			{ supabase: db.client, sendEmail, now: () => new Date('2026-09-23T12:00:00Z') }
		);

		expect(result.ok).toBe(true);
		expect(db.uploads[0].path).toMatch(new RegExp(`^replies/${row.id}-\\d+\\.m4a$`));
		expect(row.reply_audio_path).toBe(db.uploads[0].path);
		expect(sendEmail.mock.calls[0][0].htmlContent).toContain('Listen to my voice note');
	});

	it('keeps the reply when the email fails, and says so', async () => {
		const row = noteRow({ email: 'sam@example.com' });
		const db = createFakeSupabase({ talk_notes: [row] });
		sendEmail.mockResolvedValueOnce({
			success: false,
			error: 'quota',
			providerAttempted: true,
			retrySafe: true
		});
		const result = await replyToTalkNote(
			{ noteId: row.id, replyText: 'Hey', origin: 'https://9takes.com' },
			{ supabase: db.client, sendEmail }
		);
		expect(result).toMatchObject({ ok: true, emailSent: false, emailError: 'quota' });
		expect(row.status).toBe('replied');
		expect(row.reply_email_sent_at ?? null).toBeNull();
	});
});

describe('loadTalkReply', () => {
	it('returns nothing for a malformed or unknown token', async () => {
		const db = createFakeSupabase({ talk_notes: [noteRow()] });
		expect(await loadTalkReply('nope', { supabase: db.client })).toBeNull();
		expect(await loadTalkReply(newTalkToken(), { supabase: db.client })).toBeNull();
	});

	it('shows the reply with a signed audio URL', async () => {
		const token = newTalkToken();
		const row = noteRow({
			reply_token: token,
			reply_text: 'Hey.',
			reply_audio_path: 'replies/x.webm',
			replied_at: new Date().toISOString(),
			name: 'Sam'
		});
		const db = createFakeSupabase({ talk_notes: [row] });
		const view = await loadTalkReply(token, { supabase: db.client });
		expect(view).toMatchObject({
			noteBody: row.body,
			name: 'Sam',
			replyText: 'Hey.',
			replyAudioUrl: 'https://signed.test/replies/x.webm'
		});
	});
});

describe('setTalkNoteStatus', () => {
	it('restores an answered note to replied, not new', async () => {
		const row = noteRow({ status: 'archived', replied_at: new Date().toISOString() });
		const db = createFakeSupabase({ talk_notes: [row] });
		expect(await setTalkNoteStatus(row.id, 'new', { supabase: db.client })).toBe(true);
		expect(row.status).toBe('replied');
	});
});
