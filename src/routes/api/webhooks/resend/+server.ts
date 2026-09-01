// src/routes/api/webhooks/resend/+server.ts
import { env } from '$env/dynamic/private';
import { error, json } from '@sveltejs/kit';
import { Resend, type WebhookEventPayload } from 'resend';

import type { RequestHandler } from './$types';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';

const DELIVERY_EVENTS = new Set([
	'email.sent',
	'email.delivered',
	'email.delivery_delayed',
	'email.failed',
	'email.bounced',
	'email.complained'
]);

function verifyWebhook(request: Request, payload: string): WebhookEventPayload {
	const webhookSecret = env.RESEND_WEBHOOK_SECRET?.trim();
	if (!webhookSecret) {
		throw error(503, 'Resend webhook verification is not configured');
	}

	const id = request.headers.get('svix-id');
	const timestamp = request.headers.get('svix-timestamp');
	const signature = request.headers.get('svix-signature');
	if (!id || !timestamp || !signature) {
		throw error(400, 'Missing webhook signature headers');
	}

	try {
		return new Resend(env.RESEND_API_KEY).webhooks.verify({
			payload,
			headers: { id, timestamp, signature },
			webhookSecret
		});
	} catch (verificationError) {
		console.warn('Rejected invalid Resend webhook signature', {
			message:
				verificationError instanceof Error ? verificationError.message : 'Verification failed'
		});
		throw error(400, 'Invalid webhook signature');
	}
}

export const POST: RequestHandler = async ({ request }) => {
	const rawPayload = await request.text();
	const event = verifyWebhook(request, rawPayload);

	if (!DELIVERY_EVENTS.has(event.type) || !('email_id' in event.data)) {
		return json({ received: true, skipped: true });
	}

	const eventId = request.headers.get('svix-id') as string;
	const supabase = getSupabaseAdminClient() as any;
	const { data, error: processingError } = await supabase.rpc('process_email_provider_event', {
		p_provider: 'resend',
		p_event_id: eventId,
		p_provider_message_id: event.data.email_id,
		p_event_type: event.type,
		p_occurred_at: event.created_at,
		p_payload: event
	});

	if (processingError) {
		console.error('Failed to process verified Resend webhook', {
			eventId,
			eventType: event.type,
			code: processingError.code,
			message: processingError.message
		});
		throw error(500, 'Webhook processing failed');
	}

	return json({ received: true, result: data });
};
