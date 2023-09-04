import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import { supabase } from '$lib/supabase';

import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

import { PRIVATE_DEMO } from '$env/static/private';

import type { Actions } from './$types';

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event: any) => {
	const session = await getServerSession(event);
	const {
		data: user,
		error: findUserError,
		status
	} = await supabase
		.from(PRIVATE_DEMO === 'true' ? 'profiles_demo' : 'profiles')
		.select('id, enneagram, external_id')
		.eq('external_id', event.params.externalId)
		.single();

	let { data: subscriptions, error: subscriptionsError } = await supabase
		.from('subscriptions')
		.select(
			`*,
		questions(id, question, url)`
		)
		.eq('user_id', user?.id);

	let { data: comments, error: commentsError } = await supabase
		.from(PRIVATE_DEMO === 'true' ? 'comments_demo' : 'comments')
		.select(`*,`)
		.eq('author_id', user?.id)
		.order('created_at', { ascending: false });

	// got to map the question separately
	// ${PRIVATE_DEMO === 'true' ? 'questions_demo' : 'questions'}(id, question, url)

	if (!findUserError) {
		return { session, user, subscriptions, comments };
	} else {
		throw error(404, {
			message: `Couldn't find the user`
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
				.from(PRIVATE_DEMO === 'true' ? 'profiles_demo' : 'profiles')
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
