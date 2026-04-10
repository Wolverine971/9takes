// src/routes/forgotPassword/+page.server.ts
import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { getAuthProtectionState, recordAuthProtectionEvent } from '$lib/server/authProtection';
import { verifyRecaptcha, isHoneypotTriggered } from '$lib/utils/recaptcha';
import { logger } from '$lib/utils/logger';
import { z } from 'zod';

import type { PageServerLoad } from './$types';

const forgotPasswordSchema = z.object({
	email: z.string().email('Invalid email address')
});

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
		const honeypot = formData.get('company') as string | null;
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
				message: 'Password reset email sent. Please check your inbox.'
			};
		}

		const validatedData = forgotPasswordSchema.safeParse(body);
		if (!validatedData.success) {
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
		const recaptchaToken = formData.get('g-recaptcha-response') as string;
		const recaptchaValid = await verifyRecaptcha(recaptchaToken, clientIP);

		if (!recaptchaValid) {
			await recordAuthProtectionEvent({
				flow: 'forgot_password',
				outcome: 'captcha_failed',
				ipAddress: clientIP,
				identifier: normalizedEmail
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
			if (err instanceof AuthApiError && err.status === 400) {
				return fail(400, { error: 'Invalid email', email: rawEmail });
			}
			return fail(500, {
				error: 'Server error. Please try again later.'
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
			message: 'Password reset email sent. Please check your inbox.'
		};
	}
};
