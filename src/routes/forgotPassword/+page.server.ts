// src/routes/forgotPassword/+page.server.ts
import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { verifyTurnstile, isHoneypotTriggered } from '$lib/utils/turnstile';
import { logger } from '$lib/utils/logger';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	// redirect user if logged in
	if (user?.id) {
		throw redirect(302, '/');
	}

	return {}; // Return an empty object to satisfy the type system
};

export const actions: Actions = {
	forgotPass: async ({ request, locals, url, getClientAddress }) => {
		const formData = await request.formData();
		const body = Object.fromEntries(formData);

		// Check honeypot field first (bots will fill this)
		const honeypot = formData.get('company') as string | null;
		if (isHoneypotTriggered(honeypot)) {
			logger.warn('Honeypot triggered on forgot password', {
				email: body.email
			});
			// Return success to not alert the bot, but don't actually send email
			return {
				success: true,
				message: 'Password reset email sent. Please check your inbox.'
			};
		}

		// Verify Turnstile CAPTCHA
		const turnstileToken = formData.get('cf-turnstile-response') as string;
		const clientIP = getClientAddress();
		const turnstileValid = await verifyTurnstile(turnstileToken, clientIP);

		if (!turnstileValid) {
			logger.warn('Turnstile verification failed on forgot password', {
				email: body.email
			});
			return fail(400, {
				error: 'CAPTCHA verification failed. Please try again.',
				email: body.email
			});
		}

		// Get the site URL for proper redirect
		const siteUrl = url.origin;

		const { error: err } = await locals.supabase.auth.resetPasswordForEmail(body.email as string, {
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
