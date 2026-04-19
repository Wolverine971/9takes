// src/utils/api.ts
import { supabase } from '$lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../database.types';

const DEMO_TIME_CACHE_TTL_MS = 60_000;

let demoTimeCache: { value: unknown; expiresAt: number } | null = null;

export function invalidateDemoTimeCache() {
	demoTimeCache = null;
}

/**
 * Read the demo flag using the provided Supabase client.
 * Pass a server-side client (event.locals.supabase) from route handlers to keep session/auth.
 *
 * Cached in module memory for 60s. Call `invalidateDemoTimeCache()` after writes.
 */
export const checkDemoTime = async (client?: SupabaseClient<Database>) => {
	const now = Date.now();
	if (demoTimeCache && demoTimeCache.expiresAt > now) {
		return demoTimeCache.value;
	}

	const sb = client ?? (supabase as unknown as SupabaseClient<Database>);
	const { data: demoTime, error } = await sb
		.from('admin_settings')
		.select('value')
		.eq('type', 'demo_time')
		.single();

	if (error) {
		return demoTime?.value;
	}

	const demo_time = demoTime?.value;
	demoTimeCache = { value: demo_time, expiresAt: now + DEMO_TIME_CACHE_TTL_MS };
	return demo_time;
};
