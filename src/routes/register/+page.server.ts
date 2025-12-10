// src/routes/register/+page.server.ts
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { AuthApiError } from '@supabase/supabase-js';
import type { PageServerLoad } from './$types';
import { logger } from '$lib/utils/logger';
import { verifyTurnstile, isHoneypotTriggered } from '$lib/utils/turnstile';
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
};

export const actions: Actions = {
	register: async ({ request, locals, getClientAddress }) => {
		try {
			const formData = await request.formData();
			const body = Object.fromEntries(formData);

			// Check honeypot field first (bots will fill this)
			const honeypot = formData.get('website') as string | null;
			if (isHoneypotTriggered(honeypot)) {
				logger.warn('Honeypot triggered on registration', {
					email: body.email
				});
				// Return success to not alert the bot, but don't actually register
				return { success: true };
			}

			// Verify Turnstile CAPTCHA
			const turnstileToken = formData.get('cf-turnstile-response') as string;
			const clientIP = getClientAddress();
			const turnstileValid = await verifyTurnstile(turnstileToken, clientIP);

			if (!turnstileValid) {
				logger.warn('Turnstile verification failed on registration', {
					email: body.email
				});
				return fail(400, {
					error: 'CAPTCHA verification failed. Please try again.'
				});
			}

			// Validate input
			const validatedData = registerSchema.parse(body);
			const { email, password } = validatedData;

			logger.info('Registration attempt', { email });

			const { error: err } = await locals.supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: 'https://9takes.com/login'
				}
			});

			if (err) {
				if (err instanceof AuthApiError && err.status === 400) {
					logger.warn('Registration failed - auth error', {
						email,
						error: err.message
					});
					return fail(400, { error: 'Email already registered or invalid' });
				}
				logger.error('Registration error', err, { email });
				return fail(500, {
					error: 'Server error. Please try again later.'
				});
			}

			logger.info('Registration successful', { email });
			return { success: true };
		} catch (e) {
			if (e instanceof z.ZodError) {
				const firstError = e.errors[0];
				logger.warn('Invalid registration data', {
					errors: e.errors
				});
				return fail(400, {
					error: firstError.message,
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
