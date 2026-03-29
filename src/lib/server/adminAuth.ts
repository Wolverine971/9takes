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
