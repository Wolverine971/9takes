// src/lib/server/backgroundSupabase.ts
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '../../../database.types';

/**
 * Resolve any cookie refresh while the response is still writable, then detach
 * background work from the request's auth storage. The captured token preserves
 * the caller's database permissions without refreshing cookies after return.
 * Identity must still come from safeGetSession/getUser, not this session payload.
 */
export async function createBackgroundSupabaseClient(supabase: App.Locals['supabase']) {
	const { data, error } = await supabase.auth.getSession();
	if (error) throw error;
	const accessToken = data.session?.access_token ?? null;

	return createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		accessToken: async () => accessToken
	});
}
