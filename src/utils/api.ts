// src/utils/api.ts
import { supabase } from '$lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../database.types';

/**
 * Read the demo flag using the provided Supabase client.
 * Pass a server-side client (event.locals.supabase) from route handlers to keep session/auth.
 */
export const checkDemoTime = async (client?: SupabaseClient<Database>) => {
	const sb = client ?? supabase;
	const { data: demoTime } = await sb
		.from('admin_settings')
		.select('value')
		.eq('type', 'demo_time')
		.single();

	const demo_time = demoTime?.value;
	return demo_time;
};
