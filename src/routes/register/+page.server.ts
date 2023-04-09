import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../sverdle/$types';
import { AuthApiError } from '@supabase/supabase-js';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';

export const load: PageServerLoad = async (event) => {
	const session = await getServerSession(event);
	// redirect user if logged in
	if (session?.user) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	register: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());

		const { data, error: err } = await locals.sb.auth.signUp({
			email: body.email as string,
			password: body.password as string
		});

		if (err) {
			if (err instanceof AuthApiError && err.status === 400) {
				return fail(400, { error: 'Invalid email or password' });
			}
			return fail(500, {
				error: 'Server error. Please try again later.'
			});
		}
		throw redirect(303, '/');
	}
};
