// src/routes/api/email/re-permission/no/[tracking_id]/+server.ts

import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { declineReactivationRepermission } from '$lib/server/reactivationRepermission';

export const GET: RequestHandler = async ({ params }) => {
	const recipient = await declineReactivationRepermission(params.tracking_id);

	if (!recipient) {
		throw error(404, 'Email not found');
	}

	throw redirect(302, '/goodbye');
};
