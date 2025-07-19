// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr';

import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

// This creates a Supabase client for use in the browser
// For server-side operations, use event.locals.supabase from hooks.server.ts instead


export const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
