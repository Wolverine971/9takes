// routes/users/+page.server.ts
import { supabase } from '$lib/supabase';

import type { PageServerLoad } from './$types';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { checkDemoTime } from '../../utils/api';
import { mapDemoValues } from '../../utils/demo';

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	const session = await getServerSession(event);

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
	const { data: profiles, error: profilesError } = await supabase
		.from(demo_time === true ? 'profiles_demo' : 'profiles')
		.select('*');

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
			signups: mapDemoValues(signups)
		};
	} else {
		throw error(404, {
			message: `Error searching for user`
		});
	}
};

export const actions: Actions = {
	updateUserAccount: async ({ request, locals }) => {
		try {
			const session = locals?.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime();

			const body = Object.fromEntries(await request.formData());
			const first_name = body.firstName as string;
			const last_name = body.lastName as string;
			const enneagram = body.enneagram as string;
			const email = body.email as string;
			const { error: updateUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.update({ first_name, last_name, enneagram })
				.eq('email', email);
			// insert(userData);
			if (!updateUserError) {
				return { success: true };
			} else {
				throw error(500, {
					message: `Failed to update user ${JSON.stringify(updateUserError)}`
				});
			}
		} catch (e) {
			throw error(400, {
				message: `Failed to update user ${JSON.stringify(e)}`
			});
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
			const isAdmin = body.isAdmin as string;
			const email = body.email as string;
			const { error: updateUserToAdminError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.update({ admin: isAdmin === 'true' })
				.eq('email', email);
			// insert(userData);
			if (!updateUserToAdminError) {
				return { success: true };
			} else {
				throw error(500, {
					message: `Failed to update user to admin ${JSON.stringify(updateUserToAdminError)}`
				});
			}
		} catch (e) {
			throw error(400, {
				message: `Failed to update user to admin ${JSON.stringify(e)}`
			});
		}
	}
};
