import '$lib/supabase';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';

// import schedule from 'node-schedule';
// import { tagQuestions } from './utils/openai';

export const handle: Handle = async ({ event, resolve }) => {
	const { session, supabaseClient } = await getSupabase(event);
	event.locals.sb = supabaseClient;
	event.locals.session = session;

	// const job = schedule.scheduleJob('*/1 * * * *', async function () {
	// 	console.log('This runs every minute');
	// 	await tagQuestions();
	// });

	return resolve(event);
};
