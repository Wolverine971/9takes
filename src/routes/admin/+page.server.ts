import { supabase } from '$lib/supabase';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import type { PageServerLoad } from './$types';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { checkDemoTime } from '../../utils/api';
import { tagQuestion } from '../../utils/openai';

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

	if (!findUserError) {
		return { session, user, demoTime: demo_time };
	} else {
		throw error(404, {
			message: `Error searching for user`
		});
	}
};

export const actions: Actions = {
	toggleDemo: async (event) => {
		try {
			const session = event.locals.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}
			const demo_time = await checkDemoTime();

			const { data: user } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin, external_id')
				.eq('id', session?.user?.id)
				.single();

			if (!user?.admin) {
				throw redirect(307, '/questions');
			}

			const newDemoTime = !demo_time;
			const { error: updateDemoError } = await supabase
				.from('admin_settings')
				.update({ value: newDemoTime })
				.eq('id', 2)
				.select();
			// insert(userData);
			if (!updateDemoError) {
				return { success: true };
			} else {
				throw error(500, {
					message: `Failed to update demo ${JSON.stringify(updateDemoError)}`
				});
			}
		} catch (e) {
			throw error(400, {
				message: `Failed to update demo ${JSON.stringify(e)}`
			});
		}
	}
};
