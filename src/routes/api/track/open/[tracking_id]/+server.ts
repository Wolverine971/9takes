// src/routes/api/track/open/[tracking_id]/+server.ts
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

	const supabaseAny = supabase as any;
	const { error: trackingError, data: tracked } = await supabaseAny.rpc('track_email_event', {
		p_tracking_id: trackingId,
		p_event_type: 'open',
		p_link_url: null,
		p_ip_address: ip,
		p_user_agent: userAgent
	});

	if (trackingError || !tracked) {
		console.error('Error tracking email open:', trackingError);
	}
}
