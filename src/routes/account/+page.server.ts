import { supabase } from '$lib/supabase';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { PRIVATE_DEMO } from '$env/static/private';

import type { Actions } from './$types';

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	const session = await getServerSession(event);
	const {
		data: user,
		error: findUserError,
		status
	} = await supabase.from('profiles').select('*').eq('email', session?.user.email).single();

	const { data: subscriptions, error: subscriptionsError } = await supabase
		.from(PRIVATE_DEMO ? 'subscriptions_demo' : 'subscriptions')
		.select(
			`*,
		${PRIVATE_DEMO ? 'questions_demo' : 'questions'}(id, question, url)`
		)
		.eq('user_id', user?.id);

	if (!findUserError) {
		return { session, user, subscriptions };
	} else {
		throw error(404, {
			message: `Error searching for user`
		});
	}
};

export const actions: Actions = {
	updateAccount: async ({ request }) => {
		try {
			const body = Object.fromEntries(await request.formData());

			const first_name = body.firstName as string;
			const last_name = body.lastName as string;
			const enneagram = body.enneagram as string;

			const email = body.email as string;

			const {
				data,
				error: updateUserError,
				status
			} = await supabase
				.from('profiles')
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
	}
};
