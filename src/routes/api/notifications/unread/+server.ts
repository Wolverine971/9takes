// src/routes/api/notifications/unread/+server.ts
//
// Unread notification count for the header bell.
//
// This is a client-side fetch on purpose. The root layout runs on every page
// including cached editorial routes, so putting this count in the layout load
// would add a database round trip to every request from a signed-in user for a
// badge that only matters in the header.

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, setHeaders }) => {
	setHeaders({ 'Cache-Control': 'private, no-store' });

	const session = locals.session;

	if (!session?.user?.id) {
		return json({ unread: 0 });
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data, error } = await (locals.supabase.rpc as any)('get_unread_notification_count');

	if (error) {
		// Notifications migration not applied yet — a zero badge is the correct
		// degraded state, not an error the header has to handle.
		return json({ unread: 0, available: false });
	}

	return json({ unread: typeof data === 'number' ? data : 0, available: true });
};
