// src/routes/admin/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { loadRouteDemoTime } from '$lib/server/demoTime';
import { withOwnedPageShell } from '$lib/layout/pageShell';
import { countNewTalkNotes } from '$lib/server/talkNotes';

type UserWithAdmin = NonNullable<App.Locals['user']> & { admin?: boolean };

export const load: LayoutServerLoad = async (event) => {
	// Lets a page refresh the notes badge after marking notes seen (src/lib/admin/talkNotesViewed.ts).
	event.depends('admin:talk-notes');
	const parentData = await event.parent();
	const user = (parentData.user ?? event.locals.user) as UserWithAdmin | null;
	let authorizedUser = user;

	// Check if user is authenticated
	if (!user?.id) {
		throw redirect(302, '/login');
	}

	if (typeof user.admin === 'boolean') {
		if (!user.admin) {
			throw redirect(302, '/');
		}
	} else {
		// Fallback for requests where parent layout could not attach the admin flag.
		const { data: profile } = await event.locals.supabase
			.from('profiles')
			.select('admin')
			.eq('id', user.id)
			.single();

		if (!profile?.admin) {
			throw redirect(302, '/');
		}

		authorizedUser = {
			...user,
			admin: profile.admin
		};
	}

	const [demo_time, newTalkNotes] = await Promise.all([
		loadRouteDemoTime(event.locals.supabase),
		// Badge for unanswered "Talk to DJ" notes. A failed count hides the badge
		// rather than breaking every admin page.
		countNewTalkNotes().catch(() => null)
	]);

	return withOwnedPageShell({
		demo_time,
		newTalkNotes,
		user: authorizedUser
	});
};
