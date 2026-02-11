// src/routes/users/+page.server.ts
import type { PageServerLoad } from './$types';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { checkDemoTime } from '../../utils/api';
import { mapDemoValues } from '../../utils/demo';
import type { Database } from '../../../database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type SignupRow = Database['public']['Tables']['signups']['Row'];
type AdminProfile = Pick<ProfileRow, 'id' | 'admin' | 'external_id'>;

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;

	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}

	const { demo_time } = await event.parent();
	const profileTable = demo_time === true ? 'profiles_demo' : 'profiles';
	const db = event.locals.supabase as any;

	const { data: user, error: findUserError } = (await db
		.from(profileTable)
		.select('id, admin, external_id')
		.eq('id', session?.user?.id)
		.single()) as { data: AdminProfile | null; error: unknown };

	if (!user?.admin) {
		throw redirect(307, '/questions');
	}

	const { data: profiles, error: profilesError } = (await db.from(profileTable).select('*')) as {
		data: ProfileRow[] | null;
		error: unknown;
	};

	if (profilesError) {
		console.log(profilesError);
	}

	const { data: signups, error: signupsError } = await event.locals.supabase
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
			signups: mapDemoValues(signups as SignupRow[] | null)
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

			const demo_time = await checkDemoTime(locals.supabase);
			const profileTable = demo_time === true ? 'profiles_demo' : 'profiles';
			const db = locals.supabase as any;

			const body = Object.fromEntries(await request.formData());
			const first_name = String(body.firstName ?? '');
			const last_name = String(body.lastName ?? '');
			const enneagram = String(body.enneagram ?? '');
			const email = String(body.email ?? '');

			const { error: updateUserError } = await db
				.from(profileTable)
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

			const demo_time = await checkDemoTime(event.locals.supabase);
			const profileTable = demo_time === true ? 'profiles_demo' : 'profiles';
			const db = event.locals.supabase as any;

			const { data: user, error: findUserError } = (await db
				.from(profileTable)
				.select('id, admin, external_id')
				.eq('id', session?.user?.id)
				.single()) as { data: AdminProfile | null; error: unknown };

			if (findUserError) {
				console.log(findUserError);
			}

			if (!user?.admin) {
				throw redirect(307, '/questions');
			}

			const { request } = event;

			const body = Object.fromEntries(await request.formData());
			const isAdmin = String(body.isAdmin ?? 'false');
			const email = String(body.email ?? '');

			const { error: updateUserToAdminError } = await db
				.from(profileTable)
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
