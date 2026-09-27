// src/routes/admin/consulting/notes/+page.server.ts
//
// DJ's inbox for "Talk to DJ" notes (/book-session). Each note shows the text
// (or voice note + transcript), whether they left an email or asked for a
// session, and a reply box: text and/or DJ's own voice note, sent by email.
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { guardAdminActions, requireAdmin } from '$lib/server/adminAuth';
import {
	countTalkPageVisits,
	getTalkNotesOverview,
	listTalkNotesForAdmin,
	replyToTalkNote,
	setTalkNoteStatus,
	talkNoteAlertAddress,
	type TalkNoteFilter,
	type TalkNotesOverview
} from '$lib/server/talkNotes';

const FILTERS: TalkNoteFilter[] = ['open', 'replied', 'archived', 'all'];

function readFilter(value: string | null): TalkNoteFilter {
	return FILTERS.includes(value as TalkNoteFilter) ? (value as TalkNoteFilter) : 'open';
}

export const load: PageServerLoad = async ({ locals, url, setHeaders }) => {
	await requireAdmin(locals);
	setHeaders({ 'Cache-Control': 'private, no-store' });
	const filter = readFilter(url.searchParams.get('view'));

	const alertEmail = talkNoteAlertAddress();
	// Never throws (null on error), so it can run alongside the notes queries.
	const visits = countTalkPageVisits(7);

	try {
		const [notes, overview, pageVisits7d] = await Promise.all([
			listTalkNotesForAdmin(filter, url.origin),
			getTalkNotesOverview(),
			visits
		]);
		return { filter, notes, overview, pageVisits7d, alertEmail, loadError: null as string | null };
	} catch {
		return {
			filter,
			notes: [],
			overview: null as TalkNotesOverview | null,
			pageVisits7d: await visits,
			alertEmail,
			loadError: 'Couldn’t load notes. Has the talk_notes migration been applied?'
		};
	}
};

const actionHandlers: Actions = {
	reply: async ({ request, url }) => {
		const formData = await request.formData();
		const noteId = formData.get('noteId')?.toString() ?? '';
		const result = await replyToTalkNote({
			noteId,
			replyText: formData.get('replyText')?.toString() ?? '',
			audio: formData.get('audio'),
			origin: url.origin
		});

		if (!result.ok) return fail(result.status, { noteId, message: result.message });
		return {
			noteId,
			replied: true,
			emailSent: result.emailSent,
			message: result.emailSent
				? 'Reply sent.'
				: `Reply saved, but the email failed${result.emailError ? `: ${result.emailError}` : ''}. The link still works: ${result.replyUrl}`
		};
	},

	archive: async ({ request }) => {
		const noteId = (await request.formData()).get('noteId')?.toString() ?? '';
		const ok = await setTalkNoteStatus(noteId, 'archived');
		return ok ? { noteId, archived: true } : fail(404, { noteId, message: 'Note not found.' });
	},

	restore: async ({ request }) => {
		const noteId = (await request.formData()).get('noteId')?.toString() ?? '';
		const ok = await setTalkNoteStatus(noteId, 'new');
		return ok ? { noteId, restored: true } : fail(404, { noteId, message: 'Note not found.' });
	}
};

export const actions = guardAdminActions(actionHandlers);
