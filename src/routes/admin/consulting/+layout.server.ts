// src/routes/admin/consulting/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { requireAdmin } from '$lib/server/adminAuth';

export const load: LayoutServerLoad = async ({ locals, parent }) => {
	if (!locals.session?.user?.id) {
		throw redirect(302, '/questions');
	}

	// The admin layout redirects non-admins; admin rights always come from `profiles`.
	await parent();
	await requireAdmin(locals);

	return {
		isAdmin: true
	};
};
