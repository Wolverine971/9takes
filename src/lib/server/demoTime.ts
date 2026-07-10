// src/lib/server/demoTime.ts
import { checkDemoTime } from '../../utils/api';

const LAYOUT_DEMO_TIME_TIMEOUT_MS = 1200;

/**
 * Load the demo-table switch only for route families that actually consume it.
 * Public editorial pages must not inherit this admin-settings dependency.
 */
export function loadRouteDemoTime(supabase: App.Locals['supabase']) {
	return checkDemoTime(supabase, { timeoutMs: LAYOUT_DEMO_TIME_TIMEOUT_MS });
}
