// src/lib/server/adminAuth.ts
import { error } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../../../database.types';

type AdminProfile = Pick<Database['public']['Tables']['profiles']['Row'], 'id' | 'admin' | 'email'>;

export async function requireAdmin(locals: App.Locals): Promise<{
	supabase: SupabaseClient<Database>;
	session: NonNullable<App.Locals['session']>;
	profile: AdminProfile;
}> {
	const session = locals.session;
	if (!session?.user?.id) {
		throw error(401, 'Unauthorized');
	}

	const supabase = locals.supabase as SupabaseClient<Database>;
	const { data: profile, error: profileError } = await supabase
		.from('profiles')
		.select('id, admin, email')
		.eq('id', session.user.id)
		.single();

	if (profileError || !profile) {
		throw error(404, 'Admin profile not found');
	}

	if (!profile.admin) {
		throw error(403, 'Forbidden - Admin access required');
	}

	return {
		supabase,
		session: session as NonNullable<App.Locals['session']>,
		profile
	};
}

type GuardableAdminAction = (event: { locals: App.Locals }) => unknown;

/**
 * Wrap an admin route's action map so authorization runs before any handler code.
 *
 * SvelteKit layout loads do not authorize direct action POSTs. Keeping the guard at
 * the action-map boundary makes it difficult to add a new handler without also
 * protecting it.
 */
export function guardAdminActions<T extends Record<string, unknown>>(actions: T): T {
	const guardedEntries = Object.entries(actions).map(([name, candidate]) => {
		if (typeof candidate !== 'function') {
			throw new TypeError(`Admin action "${name}" must be a function`);
		}

		const action = candidate as GuardableAdminAction;
		return [
			name,
			async (event: { locals: App.Locals }) => {
				await requireAdmin(event.locals);
				return action(event);
			}
		] as const;
	});

	return Object.fromEntries(guardedEntries) as T;
}
