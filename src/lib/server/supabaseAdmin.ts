// src/lib/server/supabaseAdmin.ts
import { SUPABASE_SERVICE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database.types';

let supabaseAdminClient: SupabaseClient<Database> | null = null;

export function getSupabaseAdminClient() {
	if (!PUBLIC_SUPABASE_URL) {
		throw new Error('PUBLIC_SUPABASE_URL is not configured');
	}

	if (!SUPABASE_SERVICE_KEY) {
		throw new Error('SUPABASE_SERVICE_KEY is not configured');
	}

	if (!supabaseAdminClient) {
		supabaseAdminClient = createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY, {
			auth: {
				autoRefreshToken: false,
				persistSession: false
			}
		});
	}

	return supabaseAdminClient;
}
