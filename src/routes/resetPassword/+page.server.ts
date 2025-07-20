// routes/resetPassword/+page.server.ts
import { Actions, fail, redirect, type } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// Get the hash fragment from the URL (where the token is stored)
	// We don't need to extract it server-side as it's handled client-side by Supabase

	// Check if the user is already logged in (with a valid session)
	const session = event.locals.session;

	// We don't need to redirect here as the user might have a valid session
	// but still needs to reset their password via the token

	return {
		session
	};
};

export const actions: Actions = {
	resetPass: async ({ request, locals, url }) => {
		const body = Object.fromEntries(await request.formData());

		if (!body.password) {
			return fail(400, {
				error: 'Password is required'
			});
		}

		if (body.password.length < 6) {
			return fail(400, {
				error: 'Password must be at least 6 characters long'
			});
		}

		try {
			// The auth token is handled automatically by Supabase client
			// when the user lands on this page from the reset email
			const { data, error } = await locals.supabase.auth.updateUser({
				password: body.password as string
			});

			if (error) {
				// Password reset error
				return fail(500, {
					error: 'Failed to reset password. The reset link may have expired.',
					details: error.message
				});
			}

			// Successfully updated password
			// Return success with redirect for use in the page
			return {
				success: true,
				message: 'Password has been reset successfully!'
			};
		} catch (err) {
			// Unexpected error during password reset
			return fail(500, {
				error: 'An unexpected error occurred. Please try again.'
			});
		}
	}
};
