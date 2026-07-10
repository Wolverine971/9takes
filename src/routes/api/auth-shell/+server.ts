// src/routes/api/auth-shell/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const PRIVATE_AUTH_SHELL_CACHE_CONTROL = 'private, no-store';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user?.id) {
		return json({ user: null }, { headers: { 'Cache-Control': PRIVATE_AUTH_SHELL_CACHE_CONTROL } });
	}

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('admin')
		.eq('id', locals.user.id)
		.maybeSingle();

	return json(
		{
			user: {
				id: locals.user.id,
				admin: profile?.admin === true
			}
		},
		{ headers: { 'Cache-Control': PRIVATE_AUTH_SHELL_CACHE_CONTROL } }
	);
};
