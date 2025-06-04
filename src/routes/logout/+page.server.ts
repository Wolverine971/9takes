// routes/logout/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: PageServerLoad = async () => {
	// we only use this endpoint for the api
	// and don't need to see the page

	throw redirect(302, '/');
};

export const actions: Actions = {
	async default({ cookies }) {
		cookies.set('session', '', {
			path: '/',
			expires: new Date(0)
		});

		// redirect the user
		throw redirect(302, '/login');
	}
};
