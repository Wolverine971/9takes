// src/routes/resetPassword/+page.server.ts
import { fail } from '@sveltejs/kit';
import { establishSessionFromAuthRedirect } from '$lib/server/authCallback';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// The recovery link lands here with a PKCE `?code=` (or `?token_hash=&type=`).
	// Exchange it for a session so the `resetPass` action can call `updateUser`.
	await establishSessionFromAuthRedirect(event);

	// Re-read the session after a potential exchange (locals.session was resolved
	// in hooks before this load ran, so it predates the exchange).
	const { session } = await event.locals.safeGetSession();

	// Without a session the form can't do anything (no token to authorize the
	// password change), so show the "request a new link" message instead of a
	// form that will fail on submit. A re-run after the code was consumed still
	// has the session from the first exchange, so this stays false then.
	const linkError = !session;

	return {
		session,
		linkError
	};
};

export const actions: Actions = {
	resetPass: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());
		const password = String(body.password ?? '');
		const confirmPassword = String(body.confirmPassword ?? '');

		if (!password) {
			return fail(400, {
				error: 'Password is required'
			});
		}

		// Same policy as registration — reset previously accepted 6-char
		// passwords that the register schema would reject.
		if (
			password.length < 8 ||
			!/[A-Z]/.test(password) ||
			!/[a-z]/.test(password) ||
			!/[0-9]/.test(password)
		) {
			return fail(400, {
				error:
					'Password must be at least 8 characters with an uppercase letter, a lowercase letter, and a number'
			});
		}

		// The confirm field previously had no name attribute, so no-JS submits
		// skipped the match check entirely.
		if (confirmPassword && password !== confirmPassword) {
			return fail(400, {
				error: 'Passwords do not match'
			});
		}

		try {
			// The recovery session was established in `load` (the recovery code/token
			// was exchanged for a session there), so `updateUser` is authorized here.
			const { data, error } = await locals.supabase.auth.updateUser({
				password
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
