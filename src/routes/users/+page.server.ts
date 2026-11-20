// src/routes/users/+page.server.ts
import type { PageServerLoad } from './$types';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { z } from 'zod';
import { checkDemoTime } from '../../utils/api';
import { mapDemoValues } from '../../utils/demo';
import { guardAdminActions, requireAdmin } from '$lib/server/adminAuth';
import { logger } from '$lib/utils/logger';
import type { Database } from '../../../database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type SignupRow = Database['public']['Tables']['signups']['Row'];

const updateAdminSchema = z.object({
	email: z.string().trim().email().max(254),
	isAdmin: z.enum(['true', 'false'])
});

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;

	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}

	const { demo_time } = await event.parent();
	// Demo mode picks the data tables only; admin rights always come from `profiles`.
	const adminProfile = await requireAdmin(event.locals).then(
		({ profile }) => profile,
		() => null
	);

	if (!adminProfile) {
		throw redirect(307, '/questions');
	}

	const profileTable = demo_time === true ? 'profiles_demo' : 'profiles';
	const db = event.locals.supabase as any;

	const { data: profiles, error: profilesError } = (await db
		.from(profileTable)
		.select('id, email, first_name, last_name, created_at, enneagram, admin')) as {
		data: ProfileRow[] | null;
		error: unknown;
	};

	if (profilesError) {
		console.log(profilesError);
	}

	const { data: signups, error: signupsError } = await event.locals.supabase
		.from('signups')
		.select('id, email, name, created_at')
		.order('created_at', { ascending: false });

	if (signupsError) {
		console.log(signupsError);
	}

	return {
		user: { id: adminProfile.id, admin: adminProfile.admin },
		profiles: mapDemoValues(profiles),
		signups: mapDemoValues(signups as SignupRow[] | null)
	};
};

export const actions: Actions = guardAdminActions({
	updateAdmin: async ({ request, locals }) => {
		const parsed = updateAdminSchema.safeParse(Object.fromEntries(await request.formData()));
		if (!parsed.success) {
			return fail(400, { success: false, message: 'Invalid user or administrator status.' });
		}

		const demo_time = await checkDemoTime(locals.supabase);
		const profileTable = demo_time === true ? 'profiles_demo' : 'profiles';
		const db = locals.supabase as any;

		const { error: updateUserToAdminError } = await db
			.from(profileTable)
			.update({ admin: parsed.data.isAdmin === 'true' })
			.eq('email', parsed.data.email);

		if (updateUserToAdminError) {
			logger.error('Failed to update administrator status', updateUserToAdminError as Error);
			throw error(500, 'Failed to update user');
		}

		return { success: true };
	}
});
