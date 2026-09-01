// src/routes/api/track/open/[tracking_id]/+server.ts
// Tracking pixel endpoint - returns 1x1 transparent GIF

import type { RequestHandler } from './$types';
import {
	logBestEffortTelemetryFailure,
	runBestEffortTelemetry
} from '$lib/server/bestEffortTelemetry';
import { isUuid } from '$lib/utils/uuid';
import { classifyEmailRequest } from '$lib/server/emailClickRequest';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';

// 1x1 transparent GIF
const TRANSPARENT_GIF = Buffer.from(
	'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
	'base64'
);

export const GET: RequestHandler = async (event) => {
	const { params, request } = event;
	const { tracking_id } = params;

	// Keep the pixel fast while allowing Vercel to finish the best-effort write.
	if (isUuid(tracking_id)) {
		runBestEffortTelemetry(
			event,
			Promise.resolve().then(() =>
				updateOpenTracking(getSupabaseAdminClient(), tracking_id, request)
			),
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
	const classification = classifyEmailRequest(request);

	const supabaseAny = supabaseClient as any;
	const { error: trackingError } = await supabaseAny.rpc('track_email_event', {
		p_tracking_id: trackingId,
		p_event_type: 'open',
		p_link_url: null,
		p_ip_address: ip,
		p_user_agent: userAgent,
		p_classification: classification.classification,
		p_classification_reason: classification.reason,
		p_classifier_version: 'email-event-v1'
	});

	if (trackingError) {
		throw trackingError;
	}
}
