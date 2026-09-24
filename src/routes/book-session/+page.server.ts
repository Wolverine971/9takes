// src/routes/book-session/+page.server.ts
//
// "Talk to DJ": note first, details after.
//   ?/note     saves the note (typed, or a voice note + its transcript) right away,
//              anonymous, and hands the browser a short-lived details token.
//   ?/details  optionally adds an email for a private reply and/or a free
//              1-on-1 session request to that same note.
// Bot filtering mirrors the old waitlist form (honeypot, fill time, user agent,
// per-IP rate limit). Obvious bots get a fake success so they learn nothing.
import { randomUUID } from 'node:crypto';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { consumeApiRateLimit, resolveRateLimitSubject } from '$lib/server/apiRateLimit';
import {
	createTalkNote,
	looksLikeBotUserAgent,
	newTalkToken,
	saveTalkNoteDetails,
	TALK_NOTE_MIN_FORM_MS
} from '$lib/server/talkNotes';
import { isHoneypotTriggered } from '$lib/utils/recaptcha';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const;

function fakeNoteSaved() {
	return { noteSaved: true as const, noteId: randomUUID(), detailsToken: newTalkToken() };
}

function readUtm(url: URL): Record<string, string> {
	const utm: Record<string, string> = {};
	for (const key of UTM_KEYS) {
		const value = url.searchParams.get(key)?.trim();
		if (value) utm[key] = value.slice(0, 120);
	}
	return utm;
}

export const load: PageServerLoad = async () => ({});

export const actions: Actions = {
	note: async ({ request, getClientAddress, url, locals }) => {
		const formData = await request.formData();
		const body = formData.get('body')?.toString() ?? '';
		const userAgent = request.headers.get('user-agent') ?? '';
		const clientAddress = getClientAddress();

		if (isHoneypotTriggered(formData.get('form_extra')?.toString())) return fakeNoteSaved();

		const fillMs = Number.parseInt(formData.get('_timeToken')?.toString() ?? '0', 10);
		if (fillMs > 0 && fillMs < TALK_NOTE_MIN_FORM_MS) return fakeNoteSaved();
		if (looksLikeBotUserAgent(userAgent)) return fakeNoteSaved();

		const decision = await consumeApiRateLimit({
			bucket: 'talk_note',
			subject: resolveRateLimitSubject({
				userId: locals.session?.user?.id,
				clientAddress
			})
		});
		if (!decision.allowed) {
			return fail(429, {
				noteMessage: 'You’ve sent a few notes already. Give it a little while and try again.',
				body
			});
		}

		const audioSecondsRaw = Number.parseInt(formData.get('audioSeconds')?.toString() ?? '', 10);
		const result = await createTalkNote({
			body,
			audio: formData.get('audio'),
			audioSeconds: Number.isFinite(audioSecondsRaw) ? audioSecondsRaw : null,
			sourcePath: url.searchParams.get('from') ?? null,
			referrer: request.headers.get('referer'),
			utm: readUtm(url),
			clientAddress,
			userAgent
		});

		if (!result.ok) return fail(result.status, { noteMessage: result.message, body });
		return { noteSaved: true as const, noteId: result.noteId, detailsToken: result.detailsToken };
	},

	details: async ({ request }) => {
		const formData = await request.formData();
		const noteId = formData.get('noteId')?.toString() ?? '';
		const detailsToken = formData.get('detailsToken')?.toString() ?? '';
		const email = formData.get('email')?.toString() ?? '';
		const name = formData.get('name')?.toString() ?? '';
		const wantsSession = formData.get('wantsSession') === 'on';

		const result = await saveTalkNoteDetails({ noteId, detailsToken, email, name, wantsSession });
		if (!result.ok) {
			return fail(result.status, {
				detailsMessage: result.message,
				noteId,
				detailsToken,
				email,
				name,
				wantsSession
			});
		}

		return {
			detailsSaved: true as const,
			replyExpected: result.replyExpected,
			wantsSession: result.wantsSession,
			email: result.email
		};
	}
};
