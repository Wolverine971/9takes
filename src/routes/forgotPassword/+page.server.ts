import { fail, redirect, type Actions } from '@sveltejs/kit';
import { AuthApiError } from '@supabase/supabase-js';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// const session = await getServerSession(event);
	// // redirect user if logged in
	// if (session?.user?.id) {
	// 	throw redirect(302, '/');
	// }
};

export const actions: Actions = {
	forgotPass: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());

		const { data, error: err } = await locals.sb.auth.resetPasswordForEmail(body.email as string, {
			redirectTo: 'https://9takes.com/resetPassword'
		});

		if (err) {
			if (err instanceof AuthApiError && err.status === 400) {
				return fail(400, { error: 'Invalid email or password' });
			}
			return fail(500, {
				error: 'Server error. Please try again later.'
			});
		}
		throw redirect(303, '/login');
	}
};
