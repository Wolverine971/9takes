import { supabase } from '$lib/supabase';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
// import type { PostgrestResponse } from '@supabase/supabase-js';
import type { PageServerLoad } from './$types';

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	const session = await getServerSession(event);
	const {
		data: user,
		error,
		status
	} = await supabase.from('profiles').select('*').eq('email', session?.user.email).single();
	if (!error) {
		return { user, session };
	}
};
