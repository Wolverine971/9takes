// src/routes/+layout.server.ts
import { dev } from '$app/environment';
import type { LayoutServerLoad } from './$types';
import { getPublicEditorialCachePath } from '$lib/server/contentAccessGuard';
import { logger } from '$lib/utils/logger';

export const load: LayoutServerLoad = async (event) => {
	const session = event.locals.session;
	let user: (typeof event.locals.user & { admin?: boolean }) | null = event.locals.user;
	const authShell = !dev && getPublicEditorialCachePath(event.url.pathname) ? 'client' : 'server';

	if (user?.id) {
		const { data: profile, error: profileError } = await event.locals.supabase
			.from('profiles')
			.select('admin, first_visit_at')
			.eq('id', user.id)
			.maybeSingle();

		if (profileError) {
			logger.warn('Failed to load user admin flag in layout', profileError);
		} else {
			const fingerprint = event.cookies.get('9tfingerprint');
			const typedProfile = profile as {
				admin?: boolean | null;
				first_visit_at?: string | null;
			} | null;

			if (fingerprint && typedProfile && !typedProfile.first_visit_at) {
				const { error: attachError } = await (event.locals.supabase as any).rpc(
					'attach_profile_first_touch',
					{
						p_profile_id: user.id,
						p_fingerprint: fingerprint
					}
				);

				if (attachError) {
					logger.warn('Failed to attach first-touch metadata to profile in layout', {
						userId: user.id,
						error: attachError
					});
				}
			}

			user = {
				...user,
				admin: Boolean(typedProfile?.admin)
			};
		}
	}

	return {
		authShell,
		session,
		user
	};
};
