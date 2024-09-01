import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { PRIVATE_ADMIN_EMAIL } from '$env/static/private';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';

export const load: PageServerLoad = async (event) => {
	// redirect user if logged in
	const session = await getServerSession(event);
	if (session?.user?.id) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());

		const { data, error: err } = await locals.sb.auth.signInWithPassword({
			email: body.email as string,
			password: body.password as string
		});

		if (err) {
			console.log(err);
			if (err instanceof AuthApiError && err.status === 400) {
				return fail(400, {
					error: 'Invalid credentials'
				});
			}

			return fail(500, {
				error: 'Server error. Try again later.'
			});
		}

		if (body.email === PRIVATE_ADMIN_EMAIL) {
			throw redirect(303, '/admin');
		}

		throw redirect(303, '/questions');
	}
};
