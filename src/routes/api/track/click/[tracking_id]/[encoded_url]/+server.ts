// src/routes/api/track/click/[tracking_id]/[encoded_url]/+server.ts
// Click tracking redirect

import type { RequestHandler } from './$types';
import { exitReactivationSequenceForTrackedClick } from '$lib/server/reactivationRepermission';
import { isUuid } from '$lib/utils/uuid';
import { isAllowedRedirectTarget } from '$lib/server/emailRedirect';
import { isLikelyAutomatedEmailClick } from '$lib/server/emailClickRequest';
import {
	logBestEffortTelemetryFailure,
	runBestEffortTelemetry
} from '$lib/server/bestEffortTelemetry';
import { captureReplyNotificationEvent } from '$lib/server/posthogCapture';

const HOME_URL = 'https://9takes.com';

function redirectResponse(location: string) {
	return new Response(null, {
		status: 302,
		headers: {
			location,
			'Cache-Control': 'private, no-store, max-age=0',
			Pragma: 'no-cache',
			'X-Robots-Tag': 'noindex, nofollow',
			'Referrer-Policy': 'no-referrer'
		}
	});
}

export const GET: RequestHandler = async (event) => {
	const { params, request, locals } = event;
	const { tracking_id, encoded_url } = params;

	// Decode the target URL
	let targetUrl: string;
	try {
		targetUrl = decodeURIComponent(Buffer.from(encoded_url, 'base64url').toString());
	} catch {
		// If decoding fails, redirect to homepage
		return redirectResponse(HOME_URL);
	}

	// Validate URL to prevent open redirect vulnerability.
	//
	// Protocol alone is not enough: without a host allowlist this endpoint
	// forwards to any site, which turns a 9takes link in an email into a
	// credible phishing hop. Our emails only ever link back to our own hosts.
	if (!isAllowedRedirectTarget(targetUrl)) {
		return redirectResponse(HOME_URL);
	}
	const automatedClick = isLikelyAutomatedEmailClick(request);
	const target = new URL(targetUrl);
	target.protocol = 'https:';
	const redirectTarget = target.toString();

	// Never forward an automated scanner into a state-changing one-click
	// re-permission action. Content links remain safe for scanners to inspect.
	if (automatedClick && target.pathname.startsWith('/api/email/re-permission/')) {
		return redirectResponse(HOME_URL);
	}

	// Vercel can return the redirect immediately while waitUntil keeps the
	// analytics write alive. Obvious scanners and prefetchers still get the
	// destination, but cannot inflate clicks or terminate a reactivation flow.
	if (isUuid(tracking_id) && !automatedClick) {
		runBestEffortTelemetry(
			event,
			Promise.all([
				persistClickAndReplyNotificationAnalytics(
					locals.supabase,
					tracking_id,
					redirectTarget,
					request
				),
				exitReactivationSequenceForTrackedClick(tracking_id)
			]),
			(trackingError) => {
				logBestEffortTelemetryFailure('Failed to persist email click', trackingError);
			}
		);
	}

	// Redirect to target URL
	return redirectResponse(redirectTarget);
};

async function persistClickAndReplyNotificationAnalytics(
	supabaseClient: App.Locals['supabase'],
	trackingId: string,
	targetUrl: string,
	request: Request
): Promise<void> {
	const parsedTarget = new URL(targetUrl);
	const isReplyReturn = parsedTarget.pathname.startsWith('/api/reply-notifications/return/');
	const persistedTargetUrl = isReplyReturn
		? `${parsedTarget.origin}/api/reply-notifications/return/[private]`
		: targetUrl;
	const tracked = await updateClickTracking(
		supabaseClient,
		trackingId,
		persistedTargetUrl,
		request
	);
	if (!tracked) return;
	if (!isReplyReturn) return;

	const { data, error: contextError } = await (supabaseClient as any).rpc(
		'get_reply_notification_analytics_context',
		{ p_tracking_id: trackingId }
	);
	if (contextError) throw contextError;
	if (!data?.outbox_id) return;

	await captureReplyNotificationEvent(
		'reply_notification_clicked',
		{
			outboxId: Number(data.outbox_id),
			subscriptionId: Number(data.subscription_id),
			questionId: Number(data.question_id),
			commentId: Number(data.comment_id),
			replyCommentId: Number(data.reply_comment_id)
		},
		{ insertIdSuffix: 'first-click' }
	);
}

async function updateClickTracking(
	supabaseClient: App.Locals['supabase'],
	trackingId: string,
	targetUrl: string,
	request: Request
): Promise<boolean> {
	if (!isUuid(trackingId)) {
		return false;
	}

	const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
	const userAgent = request.headers.get('user-agent') || 'unknown';

	const supabaseAny = supabaseClient as any;
	const { error: trackingError, data: tracked } = await supabaseAny.rpc('track_email_event', {
		p_tracking_id: trackingId,
		p_event_type: 'click',
		p_link_url: targetUrl,
		p_ip_address: ip,
		p_user_agent: userAgent
	});

	if (trackingError) throw trackingError;
	return Boolean(tracked);
}
