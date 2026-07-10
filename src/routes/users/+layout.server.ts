// src/routes/users/+layout.server.ts
import { loadRouteDemoTime } from '$lib/server/demoTime';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => ({
	demo_time: await loadRouteDemoTime(locals.supabase)
});
