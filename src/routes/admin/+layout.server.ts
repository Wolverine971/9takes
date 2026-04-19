// src/routes/admin/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

type UserWithAdmin = NonNullable<App.Locals['user']> & { admin?: boolean };

export const load: LayoutServerLoad = async (event) => {
	const parentData = await event.parent();
	const user = (parentData.user ?? event.locals.user) as UserWithAdmin | null;

	// Check if user is authenticated
	if (!user?.id) {
		throw redirect(302, '/login');
	}

	if (typeof user.admin === 'boolean') {
		if (!user.admin) {
			throw redirect(302, '/');
		}

		return { user };
	}

	// Fallback for requests where parent layout could not attach the admin flag.
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
