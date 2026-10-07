// src/routes/users/[externalId]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { checkDemoTime } from '../../../utils/api';
import { mapDemoValues } from '../../../utils/demo';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { canSeeProfileTakeText, loadProfileAnswers } from '$lib/server/profileAnswers';
import type { Database } from '../../../../database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type SubscriptionRow = Database['public']['Tables']['subscriptions']['Row'];
type QuestionRow = Pick<
	Database['public']['Tables']['questions']['Row'],
	'id' | 'question' | 'question_formatted' | 'url'
>;
type ProfileSummary = Pick<
	ProfileRow,
	'id' | 'enneagram' | 'external_id' | 'created_at' | 'first_name'
>;
type SubscriptionWithQuestion = SubscriptionRow & {
	questions: QuestionRow | null;
};

/** @type {import('./$types').PageLoad} */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load: PageServerLoad = async (event) => {
	const { demo_time, user: viewer } = await event.parent();
	const profileTable = demo_time === true ? 'profiles_demo' : 'profiles';
	const subscriptionTable = demo_time === true ? 'subscriptions_demo' : 'subscriptions';
	const questionTable = demo_time === true ? 'questions_demo' : 'questions';
	const db = event.locals.supabase as any;

	const { data: user, error: findUserError } = (await db
		.from(`public_${profileTable}`)
		.select('id, enneagram, external_id, created_at, first_name')
		.eq('external_id', event.params.externalId)
		.single()) as { data: ProfileSummary | null; error: unknown };

	if (!user?.id) {
		throw error(404, {
			message: `Couldn't find the user`
		});
	}

	// Fetch last sign-in from auth
	let lastSignIn: string | null = null;
	try {
		if (event.locals.user?.id !== user.id) throw new Error('Private account activity');
		const adminClient = getSupabaseAdminClient();
		const { data: authUser } = await adminClient.auth.admin.getUserById(user.id);
		lastSignIn = authUser?.user?.last_sign_in_at ?? null;
	} catch {
		// Non-critical, just skip
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

	// Give-first: visitors see which questions this user answered, never the
	// take text. The owner and admins (verified session + layout admin flag)
	// also get the text. Take text is service-role only.
	const canSeeTakeText = canSeeProfileTakeText(
		{ id: event.locals.user?.id ?? null, admin: viewer?.admin === true },
		user.id
	);
	const comments = await loadProfileAnswers(getSupabaseAdminClient(), {
		authorId: user.id,
		demoTime: demo_time === true,
		includeText: canSeeTakeText
	});

	if (!findUserError) {
		return {
			user: mapDemoValues(user),
			subscriptions: mapDemoValues(subscriptions),
			comments,
			canSeeTakeText,
			lastSignIn
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

			const { error: updateUserError } = await db
				.from(profileTable)
				.update({ first_name, last_name, enneagram })
				.eq('id', session.user.id);
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
