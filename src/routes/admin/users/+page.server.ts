// src/routes/admin/users/+page.server.ts
import { supabase } from '$lib/supabase';

import type { PageServerLoad } from './$types';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { checkDemoTime } from '../../../utils/api';
import { tagQuestion } from '../../../utils/openai';
import { mapDemoValues } from '../../../utils/demo';
import { adminUserUpdateSchema, adminUpdateAdminStatusSchema } from '$lib/validation/schemas';
import { z } from 'zod';
import { logger } from '$lib/utils/logger';

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;

	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}
	const { demo_time } = await event.parent();
	const { data: user, error: findUserError } = await supabase
		.from(demo_time === true ? 'profiles_demo' : 'profiles')
		.select('id, admin, external_id')
		.eq('id', session?.user?.id)
		.single();

	if (!user?.admin) {
		throw redirect(307, '/questions');
	}

	const { data: profiles, error: profilesError } = await supabase.rpc('get_all_users');

	if (profilesError) {
		console.log(profilesError);
	}
	const { data: signups, error: signupsError } = await supabase
		.from('signups')
		.select('*')
		.order('created_at', { ascending: false });

	if (signupsError) {
		console.log(signupsError);
	}
	if (!findUserError) {
		return {
			user: mapDemoValues(user),
			profiles: mapDemoValues(profiles),
			signups,
			demoTime: demo_time
		};
	} else {
		throw error(404, {
			message: `Error searching for user`
		});
	}
};

export const actions: Actions = {
	classifyQuestion: async ({ request, locals }) => {
		try {
			const session = locals?.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime();

			const { data: user, error: findUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin, external_id')
				.eq('id', session?.user?.id)
				.single();

			if (findUserError) {
				console.log(findUserError);
			}

			if (!user?.admin) {
				throw redirect(307, '/questions');
			}

			const body = Object.fromEntries(await request.formData());
			const questionId = body.questionId as string;
			const questionText = body.questionText as string;

			await tagQuestion(questionText, parseInt(questionId));
		} catch (e) {
			throw error(400, {
				message: `Failed to classify question ${JSON.stringify(e)}`
			});
		}
	},

	classifyAllUntaggedQuestions: async ({ request, locals }) => {
		try {
			const session = locals?.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime();

			const { data: user, error: findUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin, external_id')
				.eq('id', session?.user?.id)
				.single();

			if (findUserError) {
				console.log(findUserError);
			}

			if (!user?.admin) {
				throw redirect(307, '/questions');
			}

			const body = Object.fromEntries(await request.formData());
			const questionId = body.questionId as string;
			const questionText = body.questionText as string;

			await tagQuestion(questionText, parseInt(questionId));
		} catch (e) {
			throw error(400, {
				message: `Failed to classify question ${JSON.stringify(e)}`
			});
		}
	},

	updateUserAccount: async ({ request, locals }) => {
		try {
			const session = locals?.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime();

			const { data: user, error: findUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin, external_id')
				.eq('id', session?.user?.id)
				.single();

			if (findUserError) {
				console.log(findUserError);
			}

			if (!user?.admin) {
				throw redirect(307, '/questions');
			}

			const body = Object.fromEntries(await request.formData());

			// Validate input data
			let validatedData;
			try {
				validatedData = adminUserUpdateSchema.parse(body);
			} catch (e) {
				if (e instanceof z.ZodError) {
					logger.warn('Admin user update validation failed', { errors: e.errors });
					throw error(400, {
						message: 'Invalid input data',
						details: e.errors
					});
				}
				throw e;
			}

			const { firstName, lastName, enneagram, email } = validatedData;

			const { error: updateUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.update({
					first_name: firstName,
					last_name: lastName,
					enneagram
				})
				.eq('email', email);

			if (updateUserError) {
				logger.error('Failed to update user', updateUserError, { email });
				throw error(500, 'Failed to update user account');
			}

			logger.info('Admin updated user account', { email, adminId: session.user.id });
			return { success: true };
		} catch (e) {
			if (e instanceof Error && e.message.includes('Invalid input data')) {
				throw e;
			}
			logger.error('Unexpected error in updateUserAccount', e as Error);
			throw error(500, 'An unexpected error occurred');
		}
	},
	updateAdmin: async (event) => {
		try {
			const session = event.locals.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime();

			const { data: user, error: findUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin, external_id')
				.eq('id', session?.user?.id)
				.single();

			if (findUserError) {
				console.log(findUserError);
			}

			if (!user?.admin) {
				throw redirect(307, '/questions');
			}

			const { request } = event;

			const body = Object.fromEntries(await request.formData());

			// Validate input data
			let validatedData;
			try {
				validatedData = adminUpdateAdminStatusSchema.parse(body);
			} catch (e) {
				if (e instanceof z.ZodError) {
					logger.warn('Admin status update validation failed', { errors: e.errors });
					throw error(400, {
						message: 'Invalid input data',
						details: e.errors
					});
				}
				throw e;
			}

			const { email, isAdmin } = validatedData;

			const { error: updateUserToAdminError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.update({ admin: isAdmin })
				.eq('email', email);

			if (updateUserToAdminError) {
				logger.error('Failed to update admin status', updateUserToAdminError, { email, isAdmin });
				throw error(500, 'Failed to update admin status');
			}

			logger.info('Admin status updated', {
				targetEmail: email,
				isAdmin,
				updatedBy: session.user.id
			});
			return { success: true };
		} catch (e) {
			if (e instanceof Error && e.message.includes('Invalid input data')) {
				throw e;
			}
			logger.error('Unexpected error in updateAdmin', e as Error);
			throw error(500, 'An unexpected error occurred');
		}
	}
};
