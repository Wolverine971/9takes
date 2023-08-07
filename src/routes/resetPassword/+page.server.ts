import { fail, redirect, type Actions } from '@sveltejs/kit';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';

import type { PageServerLoad } from './$types';
import { notifications } from '$lib/components/molecules/notifications';

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
			notifications.error('failure', 3000);
			console.log(resetError);
			return fail(500, {
				error: 'Server error. Please try again later.',
				data: resetError
			});
		}
		notifications.info('Success', 3000);
		redirect(300, '/login');
	}
};
