// src/routes/api/admin/talk-notes/viewed/+server.ts
//
// Marks "Talk to DJ" notes as seen, so the admin badge clears once DJ has read
// them. Called by the notes inbox after it renders and by the dashboard when a
// note is expanded (never from a load function: hover preloads would mark notes
// seen that DJ never opened).
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/adminAuth';
import { markTalkNotesViewed } from '$lib/server/talkNotes';

const bodySchema = z.object({ ids: z.array(z.string()).max(200) });

export const POST: RequestHandler = async ({ request, locals }) => {
	await requireAdmin(locals);

	const parsed = bodySchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) {
		throw error(400, 'Expected { ids: string[] }');
	}

	try {
		const marked = await markTalkNotesViewed(parsed.data.ids);
		return json({ marked });
	} catch {
		throw error(500, 'Could not mark notes viewed');
	}
};
