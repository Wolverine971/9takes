// src/routes/api/email/re-permission/no/[tracking_id]/+server.ts

import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	declineReactivationRepermission,
	getReactivationRepermissionRecipient
} from '$lib/server/reactivationRepermission';
import { renderRepermissionConfirmation } from '$lib/server/reactivationRepermissionPage';

export const GET: RequestHandler = async ({ params }) => {
	const recipient = await getReactivationRepermissionRecipient(params.tracking_id);
	if (!recipient) {
		throw error(404, 'Email not found');
	}

	return new Response(
		renderRepermissionConfirmation({
			title: 'Stop receiving 9takes emails?',
			message: 'Confirm that you want to unsubscribe this address from 9takes emails.',
			buttonLabel: 'Yes, unsubscribe me',
			action: `/api/email/re-permission/no/${encodeURIComponent(params.tracking_id)}`
		}),
		{ headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }
	);
};

export const POST: RequestHandler = async ({ params }) => {
	const recipient = await declineReactivationRepermission(params.tracking_id);

	if (!recipient) {
		throw error(404, 'Email not found');
	}

	throw redirect(302, '/goodbye');
};
