// routes/account/+page.server.ts

import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
import { checkDemoTime } from '../../utils/api';
import { mapDemoValues } from '../../utils/demo';

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;

	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}

	const { demo_time } = await event.parent();

	const { data: user, error: findUserError } = await event.locals.supabase
		.from(demo_time === true ? 'profiles_demo' : 'profiles')
		.select('*')
		.eq('email', session?.user?.email)
		.single();

	const { data: subscriptions, error: subscriptionsError } = await event.locals.supabase
		.from(demo_time === true ? 'subscriptions_demo' : 'subscriptions')
		.select(
			`*,
		${demo_time === true ? 'questions_demo' : 'questions'}(id, question, question_formatted, url)`
		)
		.eq('user_id', user?.id);

	if (subscriptionsError) {
		console.log(subscriptionsError);
	}
	if (!findUserError) {
		return { user: mapDemoValues(user), subscriptions: mapDemoValues(subscriptions) };
	} else {
		throw error(404, {
			message: `Error searching for user`
		});
	}
};

export const actions: Actions = {
	updateAccount: async (event) => {
		try {
			const { request, locals } = event;
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
