// routes/users/[externalId]/+page.server.ts
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

import type { Actions, PageServerLoad } from './$types';
import { checkDemoTime } from '../../../utils/api';
import { mapDemoValues } from '../../../utils/demo';

/** @type {import('./$types').PageLoad} */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load: PageServerLoad = async (event) => {
	const { demo_time } = await event.parent();

	const session = event.locals.session;
	const { data: user, error: findUserError } = await supabase
		.from(demo_time === true ? 'profiles_demo' : 'profiles')
		.select('id, enneagram, external_id')
		.eq('external_id', event.params.externalId)
		.single();

	if (!user?.id) {
		throw error(404, {
			message: `Couldn't find the user`
		});
	}

	const { data: subscriptions, error: subscriptionsError } = await supabase
		.from(demo_time === true ? 'subscriptions_demo' : 'subscriptions')
		.select(
			`*,
			${demo_time === true ? 'questions_demo' : 'questions'}
		(id, question, question_formatted, url)`
		)
		.eq('user_id', user?.id);

	if (subscriptionsError) {
		console.log(subscriptionsError);
	}

	const { data: comments, error: commentsError } = await supabase.rpc(
		'get_user_question_comments2',
		{
			authorid: user?.id
		}
	);

	if (commentsError) {
		console.log(commentsError);
	}

	// got to map the question separately
	// ${demo_time === true ? 'questions_demo' : 'questions'}(id, question, url)

	if (!findUserError) {
		return {
			user: mapDemoValues(user),
			subscriptions: mapDemoValues(subscriptions),
			comments: mapDemoValues(comments)
		};
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
