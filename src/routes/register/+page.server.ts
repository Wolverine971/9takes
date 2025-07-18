// routes/register/+page.server.ts
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { AuthApiError } from '@supabase/supabase-js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (user?.id) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	register: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());

		const { error: err } = await locals.supabase.auth.signUp({
			email: body.email as string,
			password: body.password as string,
			options: {
				emailRedirectTo: 'https://9takes.com/login'
			}
		});

		if (err) {
			if (err instanceof AuthApiError && err.status === 400) {
				return fail(400, { error: 'Invalid email or password' });
			}
			return fail(500, {
				error: 'Server error. Please try again later.'
			});
		}
		return { success: true };
	}
};
