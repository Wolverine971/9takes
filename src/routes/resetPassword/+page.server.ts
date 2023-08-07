import { fail, redirect, type Actions } from '@sveltejs/kit';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	return {
		session: await getServerSession(event)
	};
};

export const actions: Actions = {
	resetPassword: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());

		const { data, error: resetError } = await locals.sb.auth.updateUser(
			{
				password: body.password as string
			},
			{ emailRedirectTo: 'https://9takes.com/login' }
		);

		if (resetError) {
			console.log(resetError);
			return fail(500, {
				error: 'Server error. Please try again later.'
			});
		} else if (data) {
			redirect(300, '/login');
		}
	}
};
