// src/routes/api/email/re-permission/yes/[tracking_id]/+server.ts

import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { confirmReactivationRepermission } from '$lib/server/reactivationRepermission';

export const GET: RequestHandler = async ({ params }) => {
	const recipient = await confirmReactivationRepermission(params.tracking_id);

	if (!recipient) {
		throw error(404, 'Email not found');
	}

	throw redirect(302, '/thanks-for-staying');
};
