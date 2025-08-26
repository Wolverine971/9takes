// src/routes/logout/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// we only use this endpoint for the api
	// and don't need to see the page

	throw redirect(302, '/');
};

export const actions: Actions = {
	async default({ locals }) {
		// Sign out using the server-side Supabase client
		await locals.supabase.auth.signOut();

		// redirect the user
		throw redirect(302, '/login');
	}
};
