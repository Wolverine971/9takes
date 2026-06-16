// src/routes/login/+page.server.ts
import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
import { establishSessionFromAuthRedirect } from '$lib/server/authCallback';
import { getAuthProtectionState, recordAuthProtectionEvent } from '$lib/server/authProtection';
import { logger } from '$lib/utils/logger';
import { verifyRecaptcha } from '$lib/utils/recaptcha';
import { z } from 'zod';

import type { Actions, PageServerLoad } from './$types';

import { PRIVATE_ADMIN_EMAIL } from '$env/static/private';

// Validation schema
const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required')
});

export const load: PageServerLoad = async (event) => {
	// Email confirmation links redirect here with a PKCE `?code=` (or
	// `?token_hash=&type=signup`). Completing the exchange signs the new user in.
	const redirectResult = await establishSessionFromAuthRedirect(event);

	// locals.user was resolved in hooks before this load ran, so re-read after a
	// successful exchange to catch the freshly confirmed user.
	let user = event.locals.user;
	if (!user && redirectResult.exchanged) {
		const refreshed = await event.locals.safeGetSession();
		user = refreshed.user;
	}

	// redirect user if logged in (also covers a just-confirmed signup)
	if (user?.id) {
		throw redirect(303, '/');
	}

	const protectionState = await getAuthProtectionState({
		flow: 'login',
		ipAddress: event.getClientAddress()
	});

	return {
		captchaRequired: protectionState.captchaRequired,
		confirmationError: redirectResult.failed
	};
};

export const actions: Actions = {
	login: async ({ request, locals, getClientAddress }) => {
		const clientIP = getClientAddress();

		try {
			const formData = await request.formData();
			const body = Object.fromEntries(formData);

			// Validate input
			const validatedData = loginSchema.parse(body);
			const { email, password } = validatedData;
			const normalizedEmail = email.trim().toLowerCase();
			const protectionState = await getAuthProtectionState({
				flow: 'login',
				ipAddress: clientIP,
				identifier: normalizedEmail
			});

			if (protectionState.rateLimited) {
				await recordAuthProtectionEvent({
					flow: 'login',
					outcome: 'rate_limited',
					ipAddress: clientIP,
					identifier: normalizedEmail
				});

				return fail(429, {
					error: 'Too many login attempts. Please wait a few minutes and try again.',
					captchaRequired: true
				});
			}

			if (protectionState.captchaRequired) {
				const recaptchaToken = formData.get('g-recaptcha-response') as string;
				const recaptchaValid = await verifyRecaptcha(recaptchaToken, clientIP);

				if (!recaptchaValid) {
					await recordAuthProtectionEvent({
						flow: 'login',
						outcome: 'captcha_failed',
						ipAddress: clientIP,
						identifier: normalizedEmail
					});

					return fail(400, {
						error: 'Please complete the CAPTCHA and try again.',
						captchaRequired: true
					});
				}
			}

			logger.info('Login attempt', { email: normalizedEmail });

			const { data, error: err } = await locals.supabase.auth.signInWithPassword({
				email: normalizedEmail,
				password
			});

			if (err) {
				if (err instanceof AuthApiError && err.status === 400) {
					await recordAuthProtectionEvent({
						flow: 'login',
						outcome: 'failed',
						ipAddress: clientIP,
						identifier: normalizedEmail
					});
					const nextProtectionState = await getAuthProtectionState({
						flow: 'login',
						ipAddress: clientIP,
						identifier: normalizedEmail
					});

					// Distinguish an unconfirmed account from wrong credentials so the
					// user knows to check their inbox instead of retrying the password.
					const emailNotConfirmed = err.code === 'email_not_confirmed';
					if (emailNotConfirmed) {
						logger.warn('Login failed - email not confirmed', { email: normalizedEmail });
					} else {
						logger.warn('Login failed - invalid credentials', { email: normalizedEmail });
					}
					return fail(400, {
						error: emailNotConfirmed
							? 'Please confirm your email before logging in. Check your inbox for the confirmation link.'
							: 'Invalid credentials',
						captchaRequired: nextProtectionState.captchaRequired
					});
				}

				logger.error('Login error', err, { email: normalizedEmail });
				return fail(500, {
					error: 'Server error. Try again later.'
				});
			}

			await recordAuthProtectionEvent({
				flow: 'login',
				outcome: 'success',
				ipAddress: clientIP,
				identifier: normalizedEmail
			});

			logger.info('Login successful', {
				email: normalizedEmail,
				userId: data.user?.id,
				isAdmin: normalizedEmail === PRIVATE_ADMIN_EMAIL
			});

			if (normalizedEmail === PRIVATE_ADMIN_EMAIL) {
				throw redirect(303, '/admin');
			}

			throw redirect(303, '/questions');
		} catch (e) {
			if (e instanceof z.ZodError) {
				const firstError = e.errors[0];
				logger.warn('Invalid login data', {
					errors: e.errors
				});
				return fail(400, {
					error: firstError.message,
					captchaRequired: false
				});
			}
			// Re-throw redirects
			if (e && typeof e === 'object' && 'status' in e && 'location' in e) {
				throw e;
			}
			logger.error('Unexpected login error', e as Error);
			return fail(500, {
				error: 'Server error. Try again later.'
			});
		}
	}
};
