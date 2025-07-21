// routes/login/+page.server.ts
import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
import { logger } from '$lib/utils/logger';
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
	const session = event.locals.session;
	const user = event.locals.user;
	if (user?.id) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	login: async ({ request, locals }) => {
		try {
			const formData = await request.formData();
			const body = Object.fromEntries(formData);

			// Validate input
			const validatedData = loginSchema.parse(body);
			const { email, password } = validatedData;

			logger.info('Login attempt', { email });

			const { data, error: err } = await locals.supabase.auth.signInWithPassword({
				email,
				password
			});

			if (err) {
				if (err instanceof AuthApiError && err.status === 400) {
					logger.warn('Login failed - invalid credentials', { email });
					return fail(400, {
						error: 'Invalid credentials'
					});
				}

				logger.error('Login error', err, { email });
				return fail(500, {
					error: 'Server error. Try again later.'
				});
			}

			logger.info('Login successful', { 
				email, 
				userId: data.user?.id,
				isAdmin: email === PRIVATE_ADMIN_EMAIL 
			});

			if (email === PRIVATE_ADMIN_EMAIL) {
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
					error: firstError.message
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
