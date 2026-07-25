// src/routes/api/notifications/read/+server.ts
//
// Marks the caller's notifications read. Scoping happens inside the
// mark_notifications_read RPC (it derives the recipient from auth.uid()), so a
// caller cannot mark another user's notifications read even by passing ids.

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = locals.session;

	if (!session?.user?.id) {
		return json({ error: 'unauthorized' }, { status: 401 });
	}

	let ids: number[] | null = null;
	try {
		const body = await request.json();
		if (Array.isArray(body?.ids)) {
			ids = body.ids
				.map((id: unknown) => Number(id))
				.filter((id: number) => Number.isInteger(id) && id > 0);
			if (!ids?.length) ids = null;
		}
	} catch {
		// No body means "mark everything read".
		ids = null;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data, error } = await (locals.supabase.rpc as any)('mark_notifications_read', {
		p_ids: ids
	});

	if (error) {
		// Migration not applied yet — report it without failing the caller hard.
		console.error('Failed to mark notifications read:', error);
		return json({ error: 'unavailable' }, { status: 503 });
	}

	return json({ marked: typeof data === 'number' ? data : 0 });
};
