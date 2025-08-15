// hooks.server.ts
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '../database.types';

import type { Handle } from '@sveltejs/kit';

// import * as amp from '@sveltejs/amp';
// import dropcss from 'dropcss';

// import schedule from 'node-schedule';
// import { tagQuestions } from './utils/openai';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_PUBLISHABLE_KEY,
		{
			cookies: {
				get: (key) => event.cookies.get(key),
				set: (key, value, options) => {
					event.cookies.set(key, value, { ...options, path: '/' });
				},
				remove: (key, options) => {
					event.cookies.delete(key, { ...options, path: '/' });
				}
			}
		}
	);

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// JWT validation has failed
			return { session: null, user: null };
		}

		return { session, user };
	};

	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	// const job = schedule.scheduleJob('*/1 * * * *', async function () {
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
