// src/routes/api/track/click/[tracking_id]/[encoded_url]/+server.ts
// Click tracking redirect

import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';

export const GET: RequestHandler = async ({ params, request }) => {
	const { tracking_id, encoded_url } = params;

	// Decode the target URL
	let targetUrl: string;
	try {
		targetUrl = decodeURIComponent(Buffer.from(encoded_url, 'base64url').toString());
	} catch {
		// If decoding fails, redirect to homepage
		throw redirect(302, 'https://9takes.com');
	}

	// Validate URL to prevent open redirect vulnerability
	try {
		const url = new URL(targetUrl);
		// Only allow http/https protocols
		if (!['http:', 'https:'].includes(url.protocol)) {
			throw redirect(302, 'https://9takes.com');
		}
	} catch {
		throw redirect(302, 'https://9takes.com');
	}

	// Non-blocking update
	updateClickTracking(tracking_id, targetUrl, request).catch((err) => {
		console.error('Error updating click tracking:', err);
	});

	// Redirect to target URL
	throw redirect(302, targetUrl);
};

async function updateClickTracking(
	trackingId: string,
	targetUrl: string,
	request: Request
): Promise<void> {
	const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
	const userAgent = request.headers.get('user-agent') || 'unknown';

	// Get the email send record
	const { data: emailSend, error: fetchError } = await supabase
		.from('email_sends')
		.select('id, clicked_at, click_count')
		.eq('tracking_id', trackingId)
		.single();

	if (fetchError || !emailSend) {
		console.error('Email send not found for click tracking:', trackingId);
		return;
	}

	// Update the email send record
	const { error: updateError } = await supabase
		.from('email_sends')
		.update({
			clicked_at: emailSend.clicked_at || new Date().toISOString(),
			click_count: (emailSend.click_count || 0) + 1
		})
		.eq('tracking_id', trackingId);

	if (updateError) {
		console.error('Error updating email_sends for click:', updateError);
	}

	// Log the tracking event
	const { error: eventError } = await supabase.from('email_tracking_events').insert({
		email_send_id: emailSend.id,
		event_type: 'click',
		link_url: targetUrl,
		ip_address: ip,
		user_agent: userAgent
	});

	if (eventError) {
		console.error('Error inserting click tracking event:', eventError);
	}
}
