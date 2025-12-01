// src/routes/account/unsubscribe/[slug]/+page.server.ts
import { error, redirect } from '@sveltejs/kit';

import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../../$types';
import { decrypt } from '../../../../utils/crypto';

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	const supabase = event.locals.supabase;
	const slug = event.params.slug;

	const { data: userSignup, error: userSignupfError } = await supabase
		.from('signups')
		.select('unsubscribe_id, unsubscribe_iv, email')
		.eq('unsubscribe_id', slug)
		.single();

	if (userSignupfError) {
		console.log(userSignupfError);
		throw redirect(302, '/questions');
	}

	const email = decrypt({ iv: userSignup.unsubscribe_iv, encryptedData: slug });

	if (!email) {
		console.log('error', email);
		throw redirect(302, '/questions');
	} else {
		return {
			userSignup
		};
	}
};

export const actions: Actions = {
	confirmUnsubscribe: async (event) => {
		try {
			const { request, params } = event;
			const supabase = event.locals.supabase;
			const slug = params.slug;

			const body = Object.fromEntries(await request.formData());
			const email = body.email as string;

			const { error: updateUserError } = await supabase
				.from('signups')
				.update({ unsubscribed_date: new Date() })
				.eq('email', email)
				.eq('unsubscribe_id', slug);
			if (!updateUserError) {
				return { success: true };
			} else {
				throw error(500, {
					message: `Failed to unsubscribe ${JSON.stringify(updateUserError)}`
				});
			}
		} catch (e) {
			throw error(400, {
				message: `Failed to unsubscribe ${JSON.stringify(e)}`
			});
		}
	}
};
