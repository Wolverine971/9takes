// src/routes/admin/consulting/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, parent }) => {
	const session = locals.session;
	const supabase = locals.supabase;

	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}

	const { demo_time } = await parent();

	const { data: user } = await supabase
		.from(demo_time === true ? 'profiles_demo' : 'profiles')
		.select('id, admin')
		.eq('id', session.user.id)
		.single();

	if (!user?.admin) {
		throw redirect(307, '/questions');
	}

	return {
		isAdmin: true
	};
};
