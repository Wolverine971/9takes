// src/routes/api/admin/email-dashboard/sent/[id]/+server.ts
// Fetch a single sent email with tracking events

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
	const session = locals.session;
	const supabase = locals.supabase;

	if (!session?.user?.id) {
		throw error(401, 'Unauthorized');
	}

	const { data: user } = await supabase
		.from('profiles')
		.select('admin')
		.eq('id', session.user.id)
		.single();

	if (!user?.admin) {
		throw error(403, 'Admin access required');
	}

	const { id } = params;
	if (!id) {
		throw error(400, 'Email ID is required');
	}

	try {
		const { data: email, error: emailError } = await supabase
			.from('email_sends')
			.select('*')
			.eq('id', id)
			.single();

		if (emailError || !email) {
			console.error('Error fetching sent email:', emailError);
			throw error(404, 'Email not found');
		}

		const { data: events, error: eventsError } = await supabase
			.from('email_tracking_events')
			.select('*')
			.eq('email_send_id', id)
			.order('created_at', { ascending: false });

		if (eventsError) {
			console.error('Error fetching tracking events:', eventsError);
			throw error(500, 'Failed to fetch tracking events');
		}

		return json({
			email,
			events: events || []
		});
	} catch (e) {
		console.error('Error in sent detail GET:', e);
		throw error(500, 'Internal server error');
	}
};
