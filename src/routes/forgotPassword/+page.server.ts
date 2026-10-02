// src/routes/forgotPassword/+page.server.ts
import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { getAuthProtectionState, recordAuthProtectionEvent } from '$lib/server/authProtection';
import { verifyRecaptcha, isHoneypotTriggered } from '$lib/utils/recaptcha';
import { logger } from '$lib/utils/logger';
import { z } from 'zod';

import type { PageServerLoad } from './$types';

const forgotPasswordSchema = z.object({
	email: z.string().trim().email('Invalid email address')
});

// Supabase answers without an error for addresses that have no account (so the
// form can't be used to probe who is registered), which means "sent" is only
// true when the account exists. Say so instead of promising an email.
const RESET_REQUESTED_MESSAGE =
	'If that email has a 9takes account, a reset link is on its way. Check your inbox and spam folder.';

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
		const clientIP = getClientAddress();
		const formData = await request.formData();
		const body = Object.fromEntries(formData);
		const rawEmail = typeof body.email === 'string' ? body.email : '';
		const normalizedEmail = rawEmail.trim().toLowerCase();

		// Check honeypot field first (bots will fill this)
		const honeypot = formData.get('form_extra') as string | null;
		if (isHoneypotTriggered(honeypot)) {
			await recordAuthProtectionEvent({
				flow: 'forgot_password',
				outcome: 'honeypot',
				ipAddress: clientIP,
				identifier: normalizedEmail
			});
			logger.warn('Honeypot triggered on forgot password', {
				email: body.email
			});
			// Return success to not alert the bot, but don't actually send email
			return {
				success: true,
				message: RESET_REQUESTED_MESSAGE
			};
		}

		const validatedData = forgotPasswordSchema.safeParse(body);
		if (!validatedData.success) {
			// Logged so a "they tried but nothing happened" report can be settled
			// from auth_security_events. 'failed' does not count toward the limit.
			await recordAuthProtectionEvent({
				flow: 'forgot_password',
				outcome: 'failed',
				ipAddress: clientIP,
				identifier: normalizedEmail,
				context: { reason: 'invalid_email' }
			});
			return fail(400, {
				error: validatedData.error.errors[0]?.message || 'Invalid email address',
				email: rawEmail
			});
		}

		const protectionState = await getAuthProtectionState({
			flow: 'forgot_password',
			ipAddress: clientIP,
			identifier: normalizedEmail
		});

		if (protectionState.rateLimited) {
			await recordAuthProtectionEvent({
				flow: 'forgot_password',
				outcome: 'rate_limited',
				ipAddress: clientIP,
				identifier: normalizedEmail
			});

			return fail(429, {
				error: 'Too many password reset requests. Please try again later.',
				email: rawEmail
			});
		}

		// Verify Google reCAPTCHA
		const rawToken = formData.get('g-recaptcha-response');
		const recaptchaToken = typeof rawToken === 'string' ? rawToken : '';
		const recaptchaValid = await verifyRecaptcha(recaptchaToken, clientIP);

		if (!recaptchaValid) {
			await recordAuthProtectionEvent({
				flow: 'forgot_password',
				outcome: 'captcha_failed',
				ipAddress: clientIP,
				identifier: normalizedEmail,
				// No token = the widget never rendered or was never ticked; a token
				// that fails = Google rejected it (expired, wrong site key, bot).
				context: { tokenPresent: recaptchaToken.length > 0 }
			});
			logger.warn('reCAPTCHA verification failed on forgot password', {
				email: normalizedEmail
			});
			return fail(400, {
				error: 'Please complete the CAPTCHA and try again.',
				email: rawEmail
			});
		}

		// Get the site URL for proper redirect
		const siteUrl = url.origin;

		const { error: err } = await locals.supabase.auth.resetPasswordForEmail(normalizedEmail, {
			redirectTo: `${siteUrl}/resetPassword`
		});

		if (err) {
			const status = typeof err.status === 'number' ? err.status : null;
			const code = typeof err.code === 'string' ? err.code : null;
			// Previously swallowed: no log, no event, and a 429 from Supabase's
			// email limit read as a generic "Server error".
			logger.error('resetPasswordForEmail failed', err as Error, { status, code });
			await recordAuthProtectionEvent({
				flow: 'forgot_password',
				outcome: 'failed',
				ipAddress: clientIP,
				identifier: normalizedEmail,
				context: { reason: 'supabase_error', status, code }
			});

			if (status === 429) {
				return fail(429, {
					error:
						'Too many reset emails have gone out in the last little while. Wait a few minutes, then try again.',
					email: rawEmail
				});
			}
			if (err instanceof AuthApiError && status === 400) {
				return fail(400, { error: 'Invalid email', email: rawEmail });
			}
			return fail(500, {
				error: 'Server error. Please try again later.',
				email: rawEmail
			});
		}

		await recordAuthProtectionEvent({
			flow: 'forgot_password',
			outcome: 'success',
			ipAddress: clientIP,
			identifier: normalizedEmail
		});

		// Return success message rather than redirecting
		return {
			success: true,
			message: RESET_REQUESTED_MESSAGE
		};
	}
};
