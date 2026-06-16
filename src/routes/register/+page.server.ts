// src/routes/register/+page.server.ts
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { AuthApiError } from '@supabase/supabase-js';
import type { PageServerLoad } from './$types';
import { getAuthProtectionState, recordAuthProtectionEvent } from '$lib/server/authProtection';
import { logger } from '$lib/utils/logger';
import { verifyRecaptcha, isHoneypotTriggered } from '$lib/utils/recaptcha';
import {
	safelyEnrollUserInWelcomeSequence,
	safelyProcessWelcomeSequenceEnrollmentNow
} from '$lib/server/welcomeSequenceGuards';
import { z } from 'zod';

// Validation schema
const registerSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
		.regex(/[0-9]/, 'Password must contain at least one number')
});

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (user?.id) {
		throw redirect(302, '/');
	}

	const protectionState = await getAuthProtectionState({
		flow: 'register',
		ipAddress: event.getClientAddress()
	});

	return {
		captchaRequired: protectionState.captchaRequired
	};
};

export const actions: Actions = {
	register: async ({ request, locals, getClientAddress, url }) => {
		const clientIP = getClientAddress();
		let normalizedEmail = '';

		try {
			const formData = await request.formData();
			const body = Object.fromEntries(formData);
			const rawEmail = typeof body.email === 'string' ? body.email : '';
			normalizedEmail = rawEmail.trim().toLowerCase();

			// Check honeypot field first (bots will fill this)
			const honeypot = formData.get('form_extra') as string | null;
			if (isHoneypotTriggered(honeypot)) {
				await recordAuthProtectionEvent({
					flow: 'register',
					outcome: 'honeypot',
					ipAddress: clientIP,
					identifier: normalizedEmail
				});
				logger.warn('Honeypot triggered on registration', {
					email: body.email
				});
				// Return success to not alert the bot, but don't actually register
				return { success: true };
			}

			// Validate input
			const validatedData = registerSchema.parse(body);
			const { email, password } = validatedData;
			normalizedEmail = email.trim().toLowerCase();
			const protectionState = await getAuthProtectionState({
				flow: 'register',
				ipAddress: clientIP,
				identifier: normalizedEmail
			});

			if (protectionState.rateLimited) {
				await recordAuthProtectionEvent({
					flow: 'register',
					outcome: 'rate_limited',
					ipAddress: clientIP,
					identifier: normalizedEmail
				});

				return fail(429, {
					error: 'Too many registration attempts. Please try again later.',
					captchaRequired: true
				});
			}

			if (protectionState.captchaRequired) {
				const recaptchaToken = formData.get('g-recaptcha-response') as string;
				const recaptchaValid = await verifyRecaptcha(recaptchaToken, clientIP);

				if (!recaptchaValid) {
					await recordAuthProtectionEvent({
						flow: 'register',
						outcome: 'captcha_failed',
						ipAddress: clientIP,
						identifier: normalizedEmail
					});
					logger.warn('reCAPTCHA verification failed on registration', {
						email: normalizedEmail
					});
					return fail(400, {
						error: 'Please complete the CAPTCHA and try again.',
						captchaRequired: true
					});
				}
			}

			logger.info('Registration attempt', { email: normalizedEmail });

			const { data: signUpData, error: err } = await locals.supabase.auth.signUp({
				email: normalizedEmail,
				password,
				options: {
					// Route the confirmation link back to the origin that served the
					// form so dev/preview confirmations don't bounce to production.
					emailRedirectTo: `${url.origin}/login`
				}
			});

			if (err) {
				await recordAuthProtectionEvent({
					flow: 'register',
					outcome: 'failed',
					ipAddress: clientIP,
					identifier: normalizedEmail
				});
				const nextProtectionState = await getAuthProtectionState({
					flow: 'register',
					ipAddress: clientIP,
					identifier: normalizedEmail
				});

				if (err instanceof AuthApiError && err.status === 400) {
					logger.warn('Registration failed - auth error', {
						email: normalizedEmail,
						error: err.message
					});
					return fail(400, {
						error: 'Email already registered or invalid',
						captchaRequired: nextProtectionState.captchaRequired
					});
				}
				logger.error('Registration error', err, { email: normalizedEmail });
				return fail(500, {
					error: 'Server error. Please try again later.'
				});
			}

			// Supabase returns a 200 with an obfuscated user (no error, empty
			// `identities`) when the email already belongs to a confirmed account,
			// to prevent enumeration. Don't re-enroll / re-email those users — just
			// return the same generic success the genuine path returns.
			const isExistingConfirmedUser =
				Array.isArray(signUpData.user?.identities) && signUpData.user.identities.length === 0;

			if (!isExistingConfirmedUser) {
				const newUserId = signUpData.user?.id;
				const enrollmentId = await safelyEnrollUserInWelcomeSequence({
					userId: newUserId,
					email: normalizedEmail,
					onError: (sequenceError) => {
						logger.error('Failed to enroll user in welcome sequence', sequenceError as Error, {
							email: normalizedEmail,
							userId: newUserId
						});
					}
				});
				await safelyProcessWelcomeSequenceEnrollmentNow({
					enrollmentId,
					onError: (sequenceError) => {
						logger.error('Failed to send initial welcome sequence email', sequenceError as Error, {
							email: normalizedEmail,
							userId: newUserId,
							enrollmentId
						});
					}
				});
			}

			await recordAuthProtectionEvent({
				flow: 'register',
				outcome: 'success',
				ipAddress: clientIP,
				identifier: normalizedEmail
			});

			logger.info('Registration successful', { email: normalizedEmail });
			return { success: true };
		} catch (e) {
			if (e instanceof z.ZodError) {
				const firstError = e.errors[0];
				logger.warn('Invalid registration data', {
					errors: e.errors
				});
				return fail(400, {
					error: firstError.message,
					captchaRequired: false,
					details: e.errors
				});
			}
			logger.error('Unexpected registration error', e as Error);
			return fail(500, {
				error: 'Server error. Please try again later.'
			});
		}
	}
};
