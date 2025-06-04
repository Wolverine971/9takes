// routes/forgotPassword/+page.server.ts
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import { AuthApiError } from '@supabase/supabase-js';
import { Actions, fail, redirect, type } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await getServerSession(event);
	// redirect user if logged in
	if (session?.user?.id) {
		throw redirect(302, '/');
	}

	return {}; // Return an empty object to satisfy the type system
};

export const actions: Actions = {
	forgotPass: async ({ request, locals, url }) => {
		const body = Object.fromEntries(await request.formData());

		// Get the site URL for proper redirect
		const siteUrl = url.origin;

		const { error: err } = await locals.sb.auth.resetPasswordForEmail(body.email as string, {
			redirectTo: `${siteUrl}/resetPassword`
		});

		if (err) {
			if (err instanceof AuthApiError && err.status === 400) {
				return fail(400, { error: 'Invalid email', email: body.email });
			}
			return fail(500, {
				error: 'Server error. Please try again later.'
			});
		}

		// Return success message rather than redirecting
		return {
			success: true,
			message: 'Password reset email sent. Please check your inbox.'
		};
	}
};