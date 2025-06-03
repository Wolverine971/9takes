import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';
import { redirect, type Actions } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;

	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}
	const { data: user, error: findUserError } = await supabase
		.from('profiles')
		.select('id, admin, external_id')
		.eq('id', session?.user?.id)
		.single();

	if (!user?.admin || findUserError) {
		console.log(findUserError);
		throw redirect(307, '/questions');
	}

	const { data: users, error: findUsersError } = await supabase
		.from('profiles')
		.select('id, admin, email, external_id');

	if (findUsersError) {
		console.log(findUsersError);
	}

	return {  user, users };
};

export const actions: Actions = {};
