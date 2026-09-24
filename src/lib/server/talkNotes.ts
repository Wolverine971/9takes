// src/lib/server/talkNotes.ts
//
// "Talk to DJ" notes: the note-first coaching page (/book-session), DJ's
// private replies (/admin/consulting/notes), and the reply page
// (/talk/reply/[token]).
//
// Every read and write uses the service-role client; talk_notes has no RLS
// policies. Two random tokens act as single-purpose credentials:
//   details_token  lets the browser that wrote a note add an email or a
//                  session request for a short window afterwards (step 2).
//   reply_token    the link in DJ's reply email.
//
// Nothing is ever emailed automatically to a visitor-supplied address. The only
// outbound mail to a visitor is DJ's own reply, so the form can't be used to
// bomb a stranger's inbox (the Nov 2025 waitlist bot wave did exactly that).
import { createHash, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';
import { sendEmail, type SendEmailOptions, type SendEmailResult } from '$lib/email/sender';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import type { AdminTalkNote, TalkNoteFilter, TalkNoteStatus } from '$lib/types/talkNotes';
import { logger } from '$lib/utils/logger';

export type { AdminTalkNote, TalkNoteFilter, TalkNoteStatus };

export const TALK_NOTES_BUCKET = 'talk-notes';
export const TALK_NOTE_MAX_CHARS = 5000;
export const TALK_REPLY_MAX_CHARS = 5000;
export const TALK_NAME_MAX_CHARS = 80;
export const TALK_AUDIO_MAX_BYTES = 4 * 1024 * 1024;
export const TALK_NOTE_MAX_RECORDING_SECONDS = 180;
export const TALK_NOTE_MIN_FORM_MS = 3000;
export const TALK_DETAILS_WINDOW_MS = 24 * 60 * 60 * 1000;
export const VOICE_ONLY_BODY = '(Voice note. No transcript.)';

const SIGNED_AUDIO_TTL_SECONDS = 60 * 60;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{20,64}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const AUDIO_EXTENSIONS: Record<string, string> = {
	'audio/webm': 'webm',
	'audio/ogg': 'ogg',
	'audio/mp4': 'm4a',
	'audio/mpeg': 'mp3',
	'audio/aac': 'aac',
	'audio/wav': 'wav'
};

const DISPOSABLE_EMAIL_DOMAINS = new Set([
	'tempmail.com',
	'temp-mail.org',
	'guerrillamail.com',
	'guerrillamail.org',
	'sharklasers.com',
	'mailinator.com',
	'yopmail.com',
	'throwaway.email',
	'maildrop.cc',
	'dispostable.com',
	'10minutemail.com',
	'10minutemail.net',
	'fakeinbox.com',
	'tempinbox.com',
	'mailnesia.com',
	'trashmail.com',
	'getnada.com',
	'mohmal.com',
	'emailondeck.com',
	'tempr.email',
	'discard.email',
	'spamgourmet.com',
	'mytrashmail.com',
	'mailcatch.com',
	'getairmail.com',
	'mailforspam.com',
	'spam4.me',
	'grr.la',
	'spamex.com',
	'guerrillamailblock.com',
	'pokemail.net',
	'jetable.org',
	'meltmail.com'
]);

const BOT_USER_AGENT_PATTERNS = [
	/bot/i,
	/crawl/i,
	/spider/i,
	/scraper/i,
	/curl/i,
	/wget/i,
	/python-requests/i,
	/axios/i,
	/node-fetch/i,
	/headless/i,
	/phantom/i,
	/selenium/i,
	/puppeteer/i,
	/playwright/i
];

export type TalkNoteRow = {
	id: string;
	body: string;
	input_mode: 'text' | 'voice';
	audio_path: string | null;
	audio_mime: string | null;
	audio_seconds: number | null;
	details_token: string;
	details_submitted_at: string | null;
	email: string | null;
	name: string | null;
	wants_session: boolean;
	waitlist_id: string | null;
	status: TalkNoteStatus;
	reply_text: string | null;
	reply_audio_path: string | null;
	reply_audio_mime: string | null;
	reply_token: string | null;
	replied_at: string | null;
	reply_email_sent_at: string | null;
	source_path: string | null;
	referrer: string | null;
	created_at: string;
	updated_at: string;
};

export type TalkNotesDeps = {
	// The generated Database types don't include talk_notes yet (same as
	// host_reply_drafts), so the client is untyped here.
	supabase?: any;
	sendEmail?: (options: SendEmailOptions) => Promise<SendEmailResult>;
	now?: () => Date;
};

type Failure = { ok: false; status: number; message: string };

function resolveDeps(deps: TalkNotesDeps) {
	return {
		supabase: deps.supabase ?? (getSupabaseAdminClient() as any),
		send: deps.sendEmail ?? sendEmail,
		now: deps.now ?? (() => new Date())
	};
}

// ---------------------------------------------------------------------------
// Small pure helpers
// ---------------------------------------------------------------------------

export function newTalkToken(): string {
	return randomBytes(24).toString('base64url');
}

export function isTalkToken(value: unknown): value is string {
	return typeof value === 'string' && TOKEN_PATTERN.test(value);
}

export function isTalkNoteId(value: unknown): value is string {
	return typeof value === 'string' && UUID_PATTERN.test(value);
}

export function tokensMatch(expected: string, provided: string): boolean {
	const a = Buffer.from(expected);
	const b = Buffer.from(provided);
	return a.length === b.length && timingSafeEqual(a, b);
}

export function normalizeAudioMime(type: string | null | undefined): string | null {
	const base = (type ?? '').split(';')[0]?.trim().toLowerCase();
	return base && base in AUDIO_EXTENSIONS ? base : null;
}

export function hashClientAddress(address: string): string {
	const salt = env.PRIVATE_SIGNUP_KEY?.trim() || 'talk-notes';
	return createHash('sha256').update(`${salt}:${address}`).digest('hex');
}

export function looksLikeBotUserAgent(userAgent: string): boolean {
	if (!userAgent || userAgent.length < 20) return true;
	return BOT_USER_AGENT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

export function normalizeEmail(value: string | null | undefined): string {
	return (value ?? '').trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
	return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isDisposableEmail(email: string): boolean {
	const domain = email.split('@')[1]?.toLowerCase();
	return !!domain && DISPOSABLE_EMAIL_DOMAINS.has(domain);
}

export function escapeHtml(text: string): string {
	const entities: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;'
	};
	return text.replace(/[&<>"']/g, (char) => entities[char]);
}

function paragraphsHtml(text: string): string {
	return text
		.split(/\n{2,}/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean)
		.map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br />')}</p>`)
		.join('\n');
}

function formatSeconds(seconds: number | null | undefined): string {
	if (!seconds || seconds < 0) return '';
	const minutes = Math.floor(seconds / 60);
	return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}

type AudioCheck = { ok: true; file: File; mime: string } | { ok: true; file: null } | Failure;

function checkAudio(audio: unknown): AudioCheck {
	if (!(audio instanceof File) || audio.size === 0) return { ok: true, file: null };
	if (audio.size > TALK_AUDIO_MAX_BYTES) {
		return { ok: false, status: 413, message: 'That recording is too large. Try a shorter one.' };
	}
	const mime = normalizeAudioMime(audio.type);
	if (!mime) {
		return { ok: false, status: 415, message: 'That audio format is not supported.' };
	}
	return { ok: true, file: audio, mime };
}

async function uploadAudio(
	supabase: any,
	path: string,
	file: File,
	mime: string
): Promise<boolean> {
	const { error } = await supabase.storage
		.from(TALK_NOTES_BUCKET)
		.upload(path, Buffer.from(await file.arrayBuffer()), { contentType: mime, upsert: true });
	if (error) {
		logger.error('Talk note audio upload failed', error as Error, { path });
		return false;
	}
	return true;
}

async function signAudioPaths(supabase: any, paths: string[]): Promise<Map<string, string>> {
	const signed = new Map<string, string>();
	if (paths.length === 0) return signed;
	const { data, error } = await supabase.storage
		.from(TALK_NOTES_BUCKET)
		.createSignedUrls(paths, SIGNED_AUDIO_TTL_SECONDS);
	if (error || !Array.isArray(data)) {
		logger.warn('Could not sign talk note audio URLs', { count: paths.length });
		return signed;
	}
	for (const entry of data as Array<{ path?: string | null; signedUrl?: string | null }>) {
		if (entry?.path && entry.signedUrl) signed.set(entry.path, entry.signedUrl);
	}
	return signed;
}

function adminEmailAddress(): string | null {
	return env.PRIVATE_ADMIN_EMAIL?.trim() || null;
}

// ---------------------------------------------------------------------------
// Step 1: leave a note
// ---------------------------------------------------------------------------

export type CreateTalkNoteInput = {
	body: string;
	audio?: unknown;
	audioSeconds?: number | null;
	sourcePath?: string | null;
	referrer?: string | null;
	utm?: Record<string, string> | null;
	clientAddress: string;
	userAgent: string;
};

export type CreateTalkNoteResult = { ok: true; noteId: string; detailsToken: string } | Failure;

export async function createTalkNote(
	input: CreateTalkNoteInput,
	deps: TalkNotesDeps = {}
): Promise<CreateTalkNoteResult> {
	const { supabase, send, now } = resolveDeps(deps);
	const typed = (input.body ?? '').trim();

	const audioCheck = checkAudio(input.audio);
	if (!audioCheck.ok) return audioCheck;
	const audio = audioCheck.file ? audioCheck : null;

	if (!typed && !audio) {
		return { ok: false, status: 400, message: 'Say a little something first.' };
	}
	if (typed.length > TALK_NOTE_MAX_CHARS) {
		return {
			ok: false,
			status: 400,
			message: `Keep your note under ${TALK_NOTE_MAX_CHARS.toLocaleString()} characters.`
		};
	}

	const noteId = randomUUID();
	const detailsToken = newTalkToken();
	const audioSeconds =
		audio && Number.isFinite(input.audioSeconds)
			? Math.max(0, Math.min(Math.round(input.audioSeconds as number), 60 * 60))
			: null;

	let audioPath: string | null = null;
	if (audio) {
		audioPath = `notes/${noteId}.${AUDIO_EXTENSIONS[audio.mime]}`;
		const uploaded = await uploadAudio(supabase, audioPath, audio.file, audio.mime);
		if (!uploaded) {
			return {
				ok: false,
				status: 503,
				message: 'Your voice note didn’t save. Please try sending again.'
			};
		}
	}

	const body = typed || VOICE_ONLY_BODY;
	const { error } = await supabase.from('talk_notes').insert({
		id: noteId,
		body,
		input_mode: audio ? 'voice' : 'text',
		audio_path: audioPath,
		audio_mime: audio?.mime ?? null,
		audio_seconds: audioSeconds,
		details_token: detailsToken,
		source_path: input.sourcePath?.slice(0, 300) || null,
		referrer: input.referrer?.slice(0, 500) || null,
		utm: input.utm && Object.keys(input.utm).length > 0 ? input.utm : null,
		ip_hash: hashClientAddress(input.clientAddress),
		user_agent: input.userAgent.slice(0, 400) || null
	});

	if (error) {
		logger.error('Talk note insert failed', error as Error);
		if (audioPath) {
			await supabase.storage
				.from(TALK_NOTES_BUCKET)
				.remove([audioPath])
				.catch(() => undefined);
		}
		return { ok: false, status: 500, message: 'Something went wrong. Please try again.' };
	}

	const adminEmail = adminEmailAddress();
	if (adminEmail) {
		const kind = audio
			? `Voice note${audioSeconds ? ` (${formatSeconds(audioSeconds)})` : ''}`
			: 'Text note';
		try {
			await send({
				to: adminEmail,
				subject: `New note on Talk to DJ: ${body.replace(/\s+/g, ' ').slice(0, 60)}`,
				htmlContent: `
<h1>New note</h1>
<p><strong>${escapeHtml(kind)}</strong> · ${escapeHtml(now().toISOString())}</p>
${paragraphsHtml(body)}
<p>They can still add an email or ask for a session on the next step.</p>
<p><a class="button" href="https://9takes.com/admin/consulting/notes">Open notes</a></p>
				`.trim(),
				emailKind: 'transactional'
			});
		} catch (notifyError) {
			logger.warn('Talk note admin notification failed', { error: String(notifyError) });
		}
	}

	return { ok: true, noteId, detailsToken };
}

// ---------------------------------------------------------------------------
// Step 2: optional email + session request
// ---------------------------------------------------------------------------

export type SaveTalkNoteDetailsInput = {
	noteId: string;
	detailsToken: string;
	email?: string | null;
	name?: string | null;
	wantsSession: boolean;
};

export type SaveTalkNoteDetailsResult =
	{ ok: true; replyExpected: boolean; wantsSession: boolean; email: string | null } | Failure;

async function linkWaitlistRow(
	supabase: any,
	name: string,
	email: string,
	sessionGoal: string
): Promise<string | null> {
	const { data, error } = await supabase
		.from('coaching_waitlist')
		.insert({ name, email, session_goal: sessionGoal })
		.select('id')
		.single();
	if (!error && data?.id) return data.id as string;

	if (error?.code === '23505') {
		const existing = await supabase
			.from('coaching_waitlist')
			.select('id')
			.eq('email', email)
			.maybeSingle();
		return (existing?.data?.id as string | undefined) ?? null;
	}

	logger.error('Talk note waitlist link failed', error as Error);
	return null;
}

export async function saveTalkNoteDetails(
	input: SaveTalkNoteDetailsInput,
	deps: TalkNotesDeps = {}
): Promise<SaveTalkNoteDetailsResult> {
	const { supabase, send, now } = resolveDeps(deps);
	const gone: Failure = {
		ok: false,
		status: 410,
		message: 'This note can’t be updated anymore. Leave a new one anytime.'
	};

	if (!isTalkNoteId(input.noteId) || !isTalkToken(input.detailsToken)) return gone;

	const { data: note, error } = await supabase
		.from('talk_notes')
		.select('id, body, details_token, created_at, waitlist_id')
		.eq('id', input.noteId)
		.maybeSingle();
	if (error || !note) return gone;
	if (!tokensMatch(note.details_token, input.detailsToken)) return gone;
	if (now().getTime() - Date.parse(note.created_at) > TALK_DETAILS_WINDOW_MS) return gone;

	const email = normalizeEmail(input.email);
	const name = (input.name ?? '').trim().slice(0, TALK_NAME_MAX_CHARS);

	if (email && !isValidEmail(email)) {
		return { ok: false, status: 400, message: 'That email doesn’t look right.' };
	}
	if (email && isDisposableEmail(email)) {
		return {
			ok: false,
			status: 400,
			message: 'Please use a permanent email, not a temporary one.'
		};
	}
	if (input.wantsSession && !email) {
		return { ok: false, status: 400, message: 'Add your email so I can set up the session.' };
	}
	if (input.wantsSession && !name) {
		return { ok: false, status: 400, message: 'Add your first name for the session.' };
	}

	let waitlistId: string | null = note.waitlist_id ?? null;
	if (input.wantsSession && !waitlistId) {
		waitlistId = await linkWaitlistRow(supabase, name, email, note.body.slice(0, 2000));
	}

	const { error: updateError } = await supabase
		.from('talk_notes')
		.update({
			email: email || null,
			name: name || null,
			wants_session: input.wantsSession,
			waitlist_id: waitlistId,
			details_submitted_at: now().toISOString(),
			updated_at: now().toISOString()
		})
		.eq('id', note.id);
	if (updateError) {
		logger.error('Talk note details update failed', updateError as Error);
		return { ok: false, status: 500, message: 'Something went wrong. Please try again.' };
	}

	const adminEmail = adminEmailAddress();
	if (input.wantsSession && adminEmail) {
		try {
			await send({
				to: adminEmail,
				subject: `Session request from ${name.replace(/[\r\n]+/g, ' ')}`.slice(0, 200),
				htmlContent: `
<h1>${escapeHtml(name)} wants a free 1-on-1 session</h1>
<p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
<p><strong>Their note:</strong></p>
${paragraphsHtml(note.body)}
<p><a class="button" href="https://9takes.com/admin/consulting/notes">Open notes</a></p>
				`.trim(),
				emailKind: 'transactional'
			});
		} catch (notifyError) {
			logger.warn('Talk note session notification failed', { error: String(notifyError) });
		}
	}

	return {
		ok: true,
		replyExpected: !!email,
		wantsSession: input.wantsSession,
		email: email || null
	};
}

// ---------------------------------------------------------------------------
// Admin inbox
// ---------------------------------------------------------------------------

export async function listTalkNotesForAdmin(
	filter: TalkNoteFilter,
	origin: string,
	deps: TalkNotesDeps = {}
): Promise<AdminTalkNote[]> {
	const { supabase } = resolveDeps(deps);
	let query = supabase
		.from('talk_notes')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(200);
	if (filter === 'open') query = query.eq('status', 'new');
	else if (filter !== 'all') query = query.eq('status', filter);

	const { data, error } = await query;
	if (error) throw new Error('Failed to load notes');
	const rows = (data ?? []) as TalkNoteRow[];

	const paths = rows
		.flatMap((row) => [row.audio_path, row.reply_audio_path])
		.filter((path): path is string => !!path);
	const signed = await signAudioPaths(supabase, paths);

	return rows.map((row) => ({
		id: row.id,
		body: row.body,
		inputMode: row.input_mode,
		audioUrl: row.audio_path ? (signed.get(row.audio_path) ?? null) : null,
		audioSeconds: row.audio_seconds,
		email: row.email,
		name: row.name,
		wantsSession: row.wants_session,
		waitlistId: row.waitlist_id,
		status: row.status,
		replyText: row.reply_text,
		replyAudioUrl: row.reply_audio_path ? (signed.get(row.reply_audio_path) ?? null) : null,
		replyUrl: row.reply_token ? `${origin}/talk/reply/${row.reply_token}` : null,
		repliedAt: row.replied_at,
		replyEmailSentAt: row.reply_email_sent_at,
		sourcePath: row.source_path,
		createdAt: row.created_at
	}));
}

export async function setTalkNoteStatus(
	noteId: string,
	status: 'new' | 'archived',
	deps: TalkNotesDeps = {}
): Promise<boolean> {
	const { supabase, now } = resolveDeps(deps);
	if (!isTalkNoteId(noteId)) return false;
	const { data: note } = await supabase
		.from('talk_notes')
		.select('id, replied_at')
		.eq('id', noteId)
		.maybeSingle();
	if (!note) return false;
	// Un-archiving a note DJ already answered puts it back in "replied", not "new".
	const nextStatus = status === 'new' && note.replied_at ? 'replied' : status;
	const { error } = await supabase
		.from('talk_notes')
		.update({ status: nextStatus, updated_at: now().toISOString() })
		.eq('id', noteId);
	return !error;
}

// ---------------------------------------------------------------------------
// DJ's reply
// ---------------------------------------------------------------------------

export type ReplyToTalkNoteInput = {
	noteId: string;
	replyText: string;
	audio?: unknown;
	origin: string;
};

export type ReplyToTalkNoteResult =
	{ ok: true; emailSent: boolean; replyUrl: string; emailError?: string } | Failure;

export async function replyToTalkNote(
	input: ReplyToTalkNoteInput,
	deps: TalkNotesDeps = {}
): Promise<ReplyToTalkNoteResult> {
	const { supabase, send, now } = resolveDeps(deps);
	if (!isTalkNoteId(input.noteId)) return { ok: false, status: 404, message: 'Note not found.' };

	const { data: note, error } = await supabase
		.from('talk_notes')
		.select('id, body, email, name, reply_token, reply_audio_path, reply_audio_mime')
		.eq('id', input.noteId)
		.maybeSingle();
	if (error || !note) return { ok: false, status: 404, message: 'Note not found.' };
	if (!note.email) {
		return {
			ok: false,
			status: 400,
			message: 'This note is anonymous, so there’s no one to email.'
		};
	}

	const replyText = (input.replyText ?? '').trim();
	const audioCheck = checkAudio(input.audio);
	if (!audioCheck.ok) return audioCheck;
	const audio = audioCheck.file ? audioCheck : null;

	if (!replyText && !audio) {
		return { ok: false, status: 400, message: 'Write a reply or record a voice note.' };
	}
	if (replyText.length > TALK_REPLY_MAX_CHARS) {
		return { ok: false, status: 400, message: 'That reply is too long.' };
	}

	let replyAudioPath: string | null = null;
	let replyAudioMime: string | null = null;
	if (audio) {
		replyAudioPath = `replies/${note.id}-${now().getTime()}.${AUDIO_EXTENSIONS[audio.mime]}`;
		replyAudioMime = audio.mime;
		const uploaded = await uploadAudio(supabase, replyAudioPath, audio.file, audio.mime);
		if (!uploaded) {
			return { ok: false, status: 503, message: 'Your voice note didn’t upload. Try again.' };
		}
	}

	const replyToken = isTalkToken(note.reply_token) ? note.reply_token : newTalkToken();
	const repliedAt = now().toISOString();
	const { error: updateError } = await supabase
		.from('talk_notes')
		.update({
			reply_text: replyText || null,
			reply_audio_path: replyAudioPath,
			reply_audio_mime: replyAudioMime,
			reply_token: replyToken,
			replied_at: repliedAt,
			status: 'replied',
			updated_at: repliedAt
		})
		.eq('id', note.id);
	if (updateError) {
		logger.error('Talk note reply save failed', updateError as Error);
		return { ok: false, status: 500, message: 'The reply didn’t save. Try again.' };
	}

	// A replaced reply shouldn't leave the old voice note lying around.
	if (note.reply_audio_path && note.reply_audio_path !== replyAudioPath) {
		await supabase.storage
			.from(TALK_NOTES_BUCKET)
			.remove([note.reply_audio_path])
			.catch(() => undefined);
	}

	const replyUrl = `${input.origin}/talk/reply/${replyToken}`;
	const greeting = note.name ? `Hey ${escapeHtml(note.name)},` : 'Hey,';
	const listenBlock = audio
		? `<p><a class="button" href="${escapeHtml(replyUrl)}">Listen to my voice note</a></p>`
		: '';
	const textBlock = replyText ? paragraphsHtml(replyText) : '';

	const result = await send({
		to: note.email,
		recipientName: note.name ?? undefined,
		subject: 'DJ replied to your note',
		preheader: replyText ? replyText.slice(0, 120) : 'I recorded you a voice note.',
		htmlContent: `
<p>${greeting}</p>
${audio && !replyText ? '<p>I recorded you a voice note.</p>' : ''}
${textBlock}
${listenBlock}
<p>DJ</p>
<p style="font-size:13px;color:#8a8a8a;">You left me a note on 9takes. <a href="${escapeHtml(replyUrl)}">See your note and my reply</a>. Want to keep going? Just reply to this email.</p>
		`.trim(),
		emailKind: 'transactional'
	}).catch((sendError: unknown): SendEmailResult => ({
		success: false,
		error: String(sendError),
		providerAttempted: false,
		retrySafe: true
	}));

	if (result.success) {
		await supabase
			.from('talk_notes')
			.update({ reply_email_sent_at: now().toISOString() })
			.eq('id', note.id);
		return { ok: true, emailSent: true, replyUrl };
	}

	logger.warn('Talk note reply email failed', { noteId: note.id, error: result.error });
	return { ok: true, emailSent: false, replyUrl, emailError: result.error };
}

// ---------------------------------------------------------------------------
// Reply page
// ---------------------------------------------------------------------------

export type TalkReplyView = {
	noteBody: string;
	noteCreatedAt: string;
	name: string | null;
	replyText: string | null;
	replyAudioUrl: string | null;
	repliedAt: string | null;
};

export async function loadTalkReply(
	token: string,
	deps: TalkNotesDeps = {}
): Promise<TalkReplyView | null> {
	const { supabase } = resolveDeps(deps);
	if (!isTalkToken(token)) return null;

	const { data: note, error } = await supabase
		.from('talk_notes')
		.select('body, created_at, name, reply_token, reply_text, reply_audio_path, replied_at')
		.eq('reply_token', token)
		.maybeSingle();
	if (error || !note || !note.replied_at) return null;
	if (!tokensMatch(note.reply_token, token)) return null;

	let replyAudioUrl: string | null = null;
	if (note.reply_audio_path) {
		const signed = await signAudioPaths(supabase, [note.reply_audio_path]);
		replyAudioUrl = signed.get(note.reply_audio_path) ?? null;
	}

	return {
		noteBody: note.body,
		noteCreatedAt: note.created_at,
		name: note.name,
		replyText: note.reply_text,
		replyAudioUrl,
		repliedAt: note.replied_at
	};
}
