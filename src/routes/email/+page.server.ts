import { getServerSession } from '@supabase/auth-helpers-sveltekit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	return {
		session: await getServerSession(event)
	};
};

import type { Actions, RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const actions: Actions = {
	submit: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());

		// const { email } = await request.json();

		const { data, error } = await supabase.from('signups').insert([{ email: body.email }]);

		if (data) {
			console.log('woot');
			return { success: true };
		}
		if (error) {
			console.log(error);
			console.log('fail');
		}

		return { success: false };
	}
};
