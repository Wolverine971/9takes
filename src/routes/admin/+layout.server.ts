// routes/admin/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async (event) => {
	const session = event.locals.session;
	const user = event.locals.user;

	// Check if user is authenticated
	if (!user?.id) {
		throw redirect(302, '/login');
	}

	// Get user profile to check admin status
	const { data: profile } = await event.locals.supabase
		.from('profiles')
		.select('admin')
		.eq('id', user.id)
		.single();

	// Check if user is admin
	if (!profile?.admin) {
		throw redirect(302, '/');
	}

	return {
		user: {
			...user,
			admin: profile.admin
		}
	};
};
