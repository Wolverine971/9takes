import { createClient } from '@supabase/auth-helpers-sveltekit';
// import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';
// import type { Database } from '../schema';
// https://supabase.com/docs/guides/auth/auth-helpers/sveltekit

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createClient(env.PUBLIC_SUPABASE_URL || PUBLIC_SUPABASE_URL || '', env.PUBLIC_SUPABASE_ANON_KEY || PUBLIC_SUPABASE_ANON_KEY || '');
