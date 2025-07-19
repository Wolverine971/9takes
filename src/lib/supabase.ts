// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr';

// import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

// This creates a Supabase client for use in the browser
// For server-side operations, use event.locals.supabase from hooks.server.ts instead

const PUBLIC_SUPABASE_URL = 'https://nhjjzcsnmyotyhykbajc.supabase.co'
const PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oamp6Y3NubXlvdHloeWtiYWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MTg2MzAsImV4cCI6MjA2NzQ5NDYzMH0.BByJQqr2aWvPa3_Jwh3t3VGVV2KNIIcwKk8-EbFrix8"


export const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
