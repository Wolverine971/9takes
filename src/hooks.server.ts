import { getSupabase } from '@supabase/auth-helpers-sveltekit';

import '$lib/supabase';

import type { Handle } from '@sveltejs/kit';

// import * as amp from '@sveltejs/amp';
// import dropcss from 'dropcss';

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
	// let buffer = '';

	// return await resolve(event, {
	// 	transformPageChunk: ({ html, done }) => {
	// 		buffer += html;

	// 		if (done) {
	// 			let css = '';
	// 			const markup = amp
	// 				.transform(buffer)
	// 				.replace('⚡', 'amp') // dropcss can't handle this character
	// 				.replace(/<style amp-custom([^>]*?)>([^]+?)<\/style>/, (match, attributes, contents) => {
	// 					css = contents;
	// 					return `<style amp-custom${attributes}></style>`;
	// 				});

	// 			css = dropcss({ css, html: markup }).css;
	// 			return markup.replace('</style>', `${css}</style>`);
	// 		}
	// 	}
	// });
};
