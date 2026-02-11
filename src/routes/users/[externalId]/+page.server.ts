// src/routes/users/[externalId]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { checkDemoTime } from '../../../utils/api';
import { mapDemoValues } from '../../../utils/demo';
import type { Database } from '../../../../database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type SubscriptionRow = Database['public']['Tables']['subscriptions']['Row'];
type QuestionRow = Pick<
	Database['public']['Tables']['questions']['Row'],
	'id' | 'question' | 'question_formatted' | 'url'
>;
type UserCommentRow = {
	id: number;
	comment: string;
	url: string;
	question: string;
	question_formatted: string | null;
};
type ProfileSummary = Pick<ProfileRow, 'id' | 'enneagram' | 'external_id'>;
type SubscriptionWithQuestion = SubscriptionRow & {
	questions: QuestionRow | null;
};

/** @type {import('./$types').PageLoad} */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load: PageServerLoad = async (event) => {
	const { demo_time } = await event.parent();
	const profileTable = demo_time === true ? 'profiles_demo' : 'profiles';
	const subscriptionTable = demo_time === true ? 'subscriptions_demo' : 'subscriptions';
	const questionTable = demo_time === true ? 'questions_demo' : 'questions';
	const db = event.locals.supabase as any;

	const session = event.locals.session;
	const { data: user, error: findUserError } = (await db
		.from(profileTable)
		.select('id, enneagram, external_id')
		.eq('external_id', event.params.externalId)
		.single()) as { data: ProfileSummary | null; error: unknown };

	if (!user?.id) {
		throw error(404, {
			message: `Couldn't find the user`
		});
	}

	const { data: subscriptions, error: subscriptionsError } = (await db
		.from(subscriptionTable)
		.select(
			`*,
			${questionTable}
		(id, question, question_formatted, url)`
		)
		.eq('user_id', user?.id)) as { data: SubscriptionWithQuestion[] | null; error: unknown };

	if (subscriptionsError) {
		console.log(subscriptionsError);
	}

	const { data: comments, error: commentsError } = (await db.rpc('get_user_question_comments2', {
		authorid: user?.id
	})) as { data: UserCommentRow[] | null; error: unknown };

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

			const demo_time = await checkDemoTime(locals.supabase);
			const profileTable = demo_time === true ? 'profiles_demo' : 'profiles';
			const db = locals.supabase as any;

			const body = Object.fromEntries(await request.formData());

			const first_name = String(body.firstName ?? '');
			const last_name = String(body.lastName ?? '');
			const enneagram = String(body.enneagram ?? '');

			const email = String(body.email ?? '');

			const { error: updateUserError } = await db
				.from(profileTable)
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
