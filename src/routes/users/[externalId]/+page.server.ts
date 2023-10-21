import { supabase } from '$lib/supabase';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { checkDemoTime } from '../../../utils/api';

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	const { demo_time } = await event.parent();

	const session = event.locals.session;
	const { data: user, error: findUserError } = await supabase
		.from(demo_time === true ? 'profiles_demo' : 'profiles')
		.select('id, enneagram, external_id')
		.eq('external_id', event.params.externalId)
		.single();

	const { data: subscriptions, error: subscriptionsError } = await supabase
		.from('subscriptions')
		.select(
			`*,
		questions(id, question, url)`
		)
		.eq('user_id', user?.id);

	if (subscriptionsError) {
		console.log(subscriptionsError);
	}

	const { data: comments, error: commentsError } = await supabase
		.from(demo_time === true ? 'comments_demo' : 'comments')
		.select(`*`)
		.eq('author_id', user?.id)
		.order('created_at', { ascending: false });

	if (commentsError) {
		console.log(commentsError);
	}

	// got to map the question separately
	// ${demo_time === true ? 'questions_demo' : 'questions'}(id, question, url)

	if (!findUserError) {
		return { session, user, subscriptions, comments };
	} else {
		throw error(404, {
			message: `Couldn't find the user`
		});
	}
};

export const actions: Actions = {
	updateAccount: async ({ request, locals }) => {
		try {
			const session = locals.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime();

			const body = Object.fromEntries(await request.formData());

			const first_name = body.firstName as string;
			const last_name = body.lastName as string;
			const enneagram = body.enneagram as string;

			const email = body.email as string;

			const { error: updateUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
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
