// src/routes/api/track/open/[tracking_id]/+server.ts
// Tracking pixel endpoint - returns 1x1 transparent GIF

import type { RequestHandler } from './$types';
import {
	logBestEffortTelemetryFailure,
	runBestEffortTelemetry
} from '$lib/server/bestEffortTelemetry';
import { isUuid } from '$lib/utils/uuid';

// 1x1 transparent GIF
const TRANSPARENT_GIF = Buffer.from(
	'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
	'base64'
);

export const GET: RequestHandler = async (event) => {
	const { params, request, locals } = event;
	const { tracking_id } = params;

	// Keep the pixel fast while allowing Vercel to finish the best-effort write.
	if (isUuid(tracking_id)) {
		runBestEffortTelemetry(
			event,
			updateOpenTracking(locals.supabase, tracking_id, request),
			(trackingError) => {
				logBestEffortTelemetryFailure('Failed to track email open', trackingError);
			}
		);
	}

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

async function updateOpenTracking(
	supabaseClient: App.Locals['supabase'],
	trackingId: string,
	request: Request
): Promise<void> {
	if (!isUuid(trackingId)) {
		return;
	}

	const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
	const userAgent = request.headers.get('user-agent') || 'unknown';

	const supabaseAny = supabaseClient as any;
	const { error: trackingError } = await supabaseAny.rpc('track_email_event', {
		p_tracking_id: trackingId,
		p_event_type: 'open',
		p_link_url: null,
		p_ip_address: ip,
		p_user_agent: userAgent
	});

	if (trackingError) {
		throw trackingError;
	}
}
