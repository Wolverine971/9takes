// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../../database.types';

import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

// This creates a Supabase client for use in the browser
// For server-side operations, use event.locals.supabase from hooks.server.ts instead

export const supabase = createBrowserClient<Database>(
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_PUBLISHABLE_KEY
);
