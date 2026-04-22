// src/routes/api/track/click/[tracking_id]/[encoded_url]/+server.ts
// Click tracking redirect

import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';
import { exitReactivationSequenceForTrackedClick } from '$lib/server/reactivationRepermission';

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

	// Keep redirect path fast; tracking side effects run asynchronously.
	void Promise.allSettled([
		updateClickTracking(tracking_id, targetUrl, request),
		exitReactivationSequenceForTrackedClick(tracking_id)
	]).then((trackingResults) => {
		for (const result of trackingResults) {
			if (result.status === 'rejected') {
				console.error('Error updating click tracking:', result.reason);
			}
		}
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

	const supabaseAny = supabase as any;
	const { error: trackingError, data: tracked } = await supabaseAny.rpc('track_email_event', {
		p_tracking_id: trackingId,
		p_event_type: 'click',
		p_link_url: targetUrl,
		p_ip_address: ip,
		p_user_agent: userAgent
	});

	if (trackingError || !tracked) {
		console.error('Error tracking email click:', trackingError);
	}
}
