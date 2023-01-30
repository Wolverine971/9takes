import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from '../sverdle/$types';
import { AuthApiError } from '@supabase/supabase-js';

export const actions: Actions = {
	reset: async ({ request, locals }) => {}
};
