// lib/supabase.ts
import { createClient } from '@supabase/auth-helpers-sveltekit';
import { env } from '$env/dynamic/public';

// https://supabase.com/docs/guides/auth/auth-helpers/sveltekit

// import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

const PUBLIC_SUPABASE_URL = 'https://nhjjzcsnmyotyhykbajc.supabase.co'
const PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oamp6Y3NubXlvdHloeWtiYWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MTg2MzAsImV4cCI6MjA2NzQ5NDYzMH0.BByJQqr2aWvPa3_Jwh3t3VGVV2KNIIcwKk8-EbFrix8"


export const supabase = createClient(PUBLIC_SUPABASE_URL || '', PUBLIC_SUPABASE_ANON_KEY || '');
