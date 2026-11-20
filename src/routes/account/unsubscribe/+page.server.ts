// src/routes/account/unsubscribe/+page.server.ts
import { error, redirect } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { guardAdminActions, requireAdmin } from '$lib/server/adminAuth';
import { encrypt } from '../../../utils/crypto';

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;
	const supabase = event.locals.supabase;

	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}

	// This is an admin tool; admin rights always come from `profiles`.
	const isAdmin = await requireAdmin(event.locals).then(
		() => true,
		() => false
	);

	if (!isAdmin) {
		throw redirect(307, '/questions');
	}

	const { data: userSignups, error: userSignupsfError } = await supabase
		.from('signups')
		.select('id, email, name, created_at, unsubscribe_id, unsubscribed_date');

	if (userSignupsfError) {
		console.log(userSignupsfError);
		return;
	} else {
		return {
			signups: userSignups
		};
	}
};

export const actions: Actions = guardAdminActions({
	createCypher: async (event) => {
		try {
			const { request, locals } = event;
			const supabase = locals.supabase;

			const body = Object.fromEntries(await request.formData());
			const email = body.email as string;
			const emailCypher = encrypt(email);

			const { error: userSignupfError } = await supabase
				.from('signups')
				.update({ unsubscribe_id: emailCypher.encryptedData, unsubscribe_iv: emailCypher.iv })
				.eq('email', email)
				.single();

			if (userSignupfError) {
				console.log(userSignupfError);
			}

			return { success: true, emailCypher };
		} catch (e) {
			console.log(e);
			throw error(400, 'error');
		}
	}
});
