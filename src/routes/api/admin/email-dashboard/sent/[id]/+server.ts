// src/routes/api/admin/email-dashboard/sent/[id]/+server.ts
// Fetch a single sent email with tracking events

import { error, isHttpError, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/adminAuth';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';

export const GET: RequestHandler = async ({ params, locals }) => {
	await requireAdmin(locals);
	const supabase = getSupabaseAdminClient() as any;

	const { id } = params;
	if (!id) {
		throw error(400, 'Email ID is required');
	}

	try {
		const { data: email, error: emailError } = await supabase
			.from('email_sends')
			.select(
				'id, bounce_reason, bounced_at, campaign_id, click_count, clicked_at, complained_at, created_at, delivered_at, delivery_delayed_at, error_message, html_content, open_count, opened_at, plain_text_content, provider, provider_message_id, recipient_email, recipient_name, recipient_source, recipient_source_id, retry_count, sent_at, sent_by, status, subject, tracking_id, unsubscribed_at'
			)
			.eq('id', id)
			.single();

		if (emailError || !email) {
			console.error('Error fetching sent email:', emailError);
			throw error(404, 'Email not found');
		}

		const { data: events, error: eventsError } = await supabase
			.from('email_tracking_events')
			.select(
				'id, email_send_id, event_type, link_url, classification, classification_reason, classifier_version, created_at'
			)
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
		if (isHttpError(e)) throw e;
		console.error('Error in sent detail GET:', e);
		if (e instanceof Error && 'status' in e) {
			throw e;
		}
		throw error(500, 'Internal server error');
	}
};
