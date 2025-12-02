// GET /api/track/open/[tracking_id]
// Tracking pixel endpoint - returns 1x1 transparent GIF

import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';

// 1x1 transparent GIF
const TRANSPARENT_GIF = Buffer.from(
	'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
	'base64'
);

export const GET: RequestHandler = async ({ params, request }) => {
	const { tracking_id } = params;

	// Non-blocking update - don't wait for database
	updateOpenTracking(tracking_id, request).catch((err) => {
		console.error('Error updating open tracking:', err);
	});

	// Return tracking pixel immediately
	return new Response(TRANSPARENT_GIF, {
		headers: {
			'Content-Type': 'image/gif',
			'Content-Length': TRANSPARENT_GIF.length.toString(),
			'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
			Pragma: 'no-cache',
			Expires: '0'
		}
	});
};

async function updateOpenTracking(trackingId: string, request: Request): Promise<void> {
	const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
	const userAgent = request.headers.get('user-agent') || 'unknown';

	// Get the email send record
	const { data: emailSend, error: fetchError } = await supabase
		.from('email_sends')
		.select('id, opened_at, open_count')
		.eq('tracking_id', trackingId)
		.single();

	if (fetchError || !emailSend) {
		console.error('Email send not found for tracking:', trackingId);
		return;
	}

	// Update the email send record
	const { error: updateError } = await supabase
		.from('email_sends')
		.update({
			opened_at: emailSend.opened_at || new Date().toISOString(),
			open_count: (emailSend.open_count || 0) + 1
		})
		.eq('tracking_id', trackingId);

	if (updateError) {
		console.error('Error updating email_sends:', updateError);
	}

	// Log the tracking event
	const { error: eventError } = await supabase.from('email_tracking_events').insert({
		email_send_id: emailSend.id,
		event_type: 'open',
		ip_address: ip,
		user_agent: userAgent
	});

	if (eventError) {
		console.error('Error inserting tracking event:', eventError);
	}
}
