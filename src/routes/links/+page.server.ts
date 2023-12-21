import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;

	if (!session?.user?.id) {
		throw redirect(307, '/questions');
	}
	const { data: userResp, error: findUserError } = await supabase
		.from('profiles')
		.select('id, admin, external_id')
		.eq('id', session?.user?.id)
		.single();

	if (findUserError) {
		console.log('findUserError', findUserError);
	} else if (userResp?.admin) {
		return {};
	}
	throw redirect(307, '/questions');
};

export const actions: Actions = {};
