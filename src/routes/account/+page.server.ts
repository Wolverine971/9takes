// src/routes/account/+page.server.ts

import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
import { checkDemoTime } from '../../utils/api';
import { mapDemoValues } from '../../utils/demo';
import {
	dayIndex,
	loadActiveQuestions,
	loadCommunityPulse,
	loadNotificationPreferences,
	loadNotifications,
	loadPersonalStats,
	loadQuestionOfTheDay,
	loadSharedTypePeople,
	resolveAccountTables,
	seedFrom
} from '$lib/server/accountDashboard';

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;

	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}
	if (!session.user.email) {
		throw error(400, 'No account email found for current session');
	}

	const { demo_time } = await event.parent();
	const tables = resolveAccountTables(demo_time === true);
	const supabase = event.locals.supabase;
	// Demo mode resolves table names at runtime, so the generated Supabase types
	// cannot narrow them. Same idiom as src/routes/users/[externalId].
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const db = supabase as any;

	const { data: user, error: findUserError } = await db
		.from(tables.profiles)
		.select('id, first_name, last_name, enneagram, email, admin, external_id, created_at')
		.eq('email', session.user.email)
		.single();

	if (findUserError || !user) {
		console.error('Failed to load user profile:', findUserError);
		throw error(404, 'User profile not found');
	}

	const profile = user as {
		id: string;
		enneagram: string | null;
		external_id: string | null;
	};

	// 'unknown' is the registration default and is stored literally, so it must
	// be normalized away before it reaches any type-keyed lookup.
	const rawType = profile.enneagram?.toString().trim() ?? '';
	const enneagram = /^[1-9]$/.test(rawType) ? rawType : null;

	const seed = seedFrom(profile.id);
	const day = dayIndex();

	const [
		subscriptionsResult,
		questionOfTheDay,
		sharedTypePeople,
		communityPulse,
		personal,
		activeQuestions,
		notifications,
		notificationPreferences
	] = await Promise.all([
		db
			.from(demo_time === true ? 'subscriptions_demo' : 'subscriptions')
			.select(
				`id, question_id, user_id, ${tables.questions}(id, question, question_formatted, url)`
			)
			.eq('user_id', profile.id),
		loadQuestionOfTheDay(supabase, tables, profile.id, enneagram, seed, day),
		loadSharedTypePeople(supabase, enneagram, seed, day),
		loadCommunityPulse(supabase, tables),
		loadPersonalStats(supabase, tables, profile.id),
		loadActiveQuestions(supabase, tables),
		loadNotifications(supabase),
		loadNotificationPreferences(supabase, profile.id)
	]);

	if (subscriptionsResult.error) {
		console.error('Failed to load subscriptions:', subscriptionsResult.error);
	}

	return {
		user: mapDemoValues(user),
		enneagram,
		subscriptions: mapDemoValues(subscriptionsResult.data ?? []),
		questionOfTheDay,
		sharedTypePeople,
		communityPulse,
		personalStats: personal.stats,
		activeQuestions,
		notifications,
		notificationPreferences
	};
};

export const actions: Actions = {
	updateAccount: async (event) => {
		try {
			const { request, locals } = event;
			const session = locals.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime(locals.supabase);

			const body = Object.fromEntries(await request.formData());

			const first_name = body.firstName as string;
			const last_name = body.lastName as string;
			const enneagram = body.enneagram as string;
			const email = body.email as string;

			// Verify the email matches the authenticated user to prevent privilege escalation
			if (email !== session.user.email) {
				throw error(403, "Unauthorized: Cannot modify another user's account");
			}

			const { error: updateUserError } = await locals.supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.update({ first_name, last_name, enneagram })
				.eq('id', session.user.id);

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
	},

	updateNotificationPreferences: async (event) => {
		const { request, locals } = event;
		const session = locals.session;

		if (!session?.user?.id) {
			throw error(401, 'unauthorized');
		}

		const body = Object.fromEntries(await request.formData());
		const flag = (key: string) => body[key] === 'true' || body[key] === 'on';

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { error: rpcError } = await (locals.supabase.rpc as any)(
			'update_notification_preferences',
			{
				p_reply_to_take: flag('reply_to_take'),
				p_take_on_your_question: flag('take_on_your_question'),
				p_take_on_answered_question: flag('take_on_answered_question'),
				p_like_on_take: flag('like_on_take'),
				p_email_digest: flag('email_digest')
			}
		);

		if (rpcError) {
			// The notifications migration may not be applied yet; surface a clear
			// message instead of a 500 so the rest of the page keeps working.
			console.error('Failed to update notification preferences:', rpcError);
			return { success: false, message: 'Notification settings are not available yet.' };
		}

		return { success: true };
	}
};
