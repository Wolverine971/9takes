// src/routes/account/unsubscribe/[slug]/+page.server.ts
import { error, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';
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
	if (!userSignup?.unsubscribe_iv) {
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
			const { params } = event;
			const supabase = event.locals.supabase;
			const slug = params.slug;

			const { data: signupRow, error: signupError } = await supabase
				.from('signups')
				.select('id, email, unsubscribe_iv')
				.eq('unsubscribe_id', slug)
				.single();

			if (signupError || !signupRow) {
				throw error(404, { message: 'Unsubscribe link is invalid' });
			}

			if (!signupRow.unsubscribe_iv) {
				throw error(400, { message: 'Unsubscribe link is invalid' });
			}

			const decryptedEmail = decrypt({ iv: signupRow.unsubscribe_iv, encryptedData: slug });
			const normalizedDecryptedEmail = (decryptedEmail || '').trim().toLowerCase();
			const normalizedSignupEmail = String(signupRow.email || '')
				.trim()
				.toLowerCase();

			if (!normalizedDecryptedEmail || normalizedDecryptedEmail !== normalizedSignupEmail) {
				throw error(400, { message: 'Unsubscribe link validation failed' });
			}

			const { data: updatedSignup, error: updateUserError } = await supabase
				.from('signups')
				.update({ unsubscribed_date: new Date().toISOString() })
				.eq('id', signupRow.id)
				.eq('unsubscribe_id', slug)
				.select('id');

			if (updateUserError || !updatedSignup || updatedSignup.length === 0) {
				throw error(500, {
					message: `Failed to unsubscribe ${JSON.stringify(updateUserError)}`
				});
			}

			const sourceId = String(updatedSignup[0].id);
			const { error: suppressionError } = await (supabase as any).rpc('unsubscribe_email_direct', {
				p_email: normalizedSignupEmail,
				p_source: 'signups',
				p_source_id: sourceId,
				p_reason: 'legacy_unsubscribe_page'
			});

			if (suppressionError) {
				console.error('Failed to sync legacy unsubscribe into suppression list', suppressionError);
			}

			return { success: true };
		} catch (e) {
			if (e instanceof Error && 'status' in e) {
				throw e;
			}
			throw error(400, {
				message: `Failed to unsubscribe ${JSON.stringify(e)}`
			});
		}
	}
};
