// lib/supabase.ts
import { createClient } from '@supabase/auth-helpers-sveltekit';
import { env } from '$env/dynamic/public';

// https://supabase.com/docs/guides/auth/auth-helpers/sveltekit

// import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

const PUBLIC_SUPABASE_URL = 'https://nhjjzcsnmyotyhykbajc.supabase.co';
const PUBLIC_SUPABASE_ANON_KEY =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oamp6Y3NubXlvdHloeWtiYWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODI1MDcsImV4cCI6MjA1OTk1ODUwN30.pj3GkCW-1DeP52qFuAZcMEX8NgjeykEv2RlmStXH3Eo';

export const supabase = createClient(PUBLIC_SUPABASE_URL || '', PUBLIC_SUPABASE_ANON_KEY || '');
