// src/routes/login/+page.server.ts
import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
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
	// redirect user if logged in
	const user = event.locals.user;
	if (user?.id) {
		throw redirect(302, '/');
	}

	const protectionState = await getAuthProtectionState({
		flow: 'login',
		ipAddress: event.getClientAddress()
	});

	return {
		captchaRequired: protectionState.captchaRequired
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

					logger.warn('Login failed - invalid credentials', { email: normalizedEmail });
					return fail(400, {
						error: 'Invalid credentials',
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
