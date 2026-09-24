// src/routes/talk/reply/[token]/+page.server.ts
//
// DJ's private reply to a "Talk to DJ" note. The random reply token in the URL
// (sent only to the note writer's email) is the only credential. Read-only.
import type { PageServerLoad } from './$types';
import { loadTalkReply } from '$lib/server/talkNotes';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders({ 'Cache-Control': 'private, no-store' });
	const reply = await loadTalkReply(params.token);
	return { reply };
};
