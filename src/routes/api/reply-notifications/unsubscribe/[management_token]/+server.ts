// src/routes/api/reply-notifications/unsubscribe/[management_token]/+server.ts
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { captureReplyNotificationEvent } from '$lib/server/posthogCapture';
import {
	logBestEffortTelemetryFailure,
	runBestEffortTelemetry
} from '$lib/server/bestEffortTelemetry';
import { isUuid } from '$lib/utils/uuid';

function renderPage(title: string, message: string, actionHtml: string) {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>${title} - 9takes</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f6f7f9; color: #17181c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    main { width: min(100% - 32px, 460px); box-sizing: border-box; padding: 32px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; }
    a.brand { color: #17181c; display: inline-block; margin-bottom: 24px; font-size: 18px; font-weight: 700; text-decoration: none; }
    h1 { margin: 0 0 12px; font-size: 24px; line-height: 1.2; }
    p { margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.55; }
    .actions { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; }
    button, .button { appearance: none; border: 0; border-radius: 6px; background: #17181c; color: #fff; cursor: pointer; display: inline-block; padding: 12px 18px; font: inherit; font-weight: 650; text-decoration: none; }
    .secondary { color: #4b5563; }
  </style>
</head>
<body>
  <main>
    <a class="brand" href="https://9takes.com">9takes</a>
    <h1>${title}</h1>
    <p>${message}</p>
    <div class="actions">${actionHtml}</div>
  </main>
</body>
</html>`;
}

function htmlResponse(html: string) {
	return new Response(html, {
		headers: {
			'Content-Type': 'text/html; charset=utf-8',
			'Cache-Control': 'no-store',
			'X-Robots-Tag': 'noindex, nofollow',
			'Referrer-Policy': 'no-referrer'
		}
	});
}

export const GET: RequestHandler = async ({ params }) => {
	if (!isUuid(params.management_token)) throw error(404, 'Subscription not found');
	const token = encodeURIComponent(params.management_token);
	return htmlResponse(
		renderPage(
			'Stop reply emails for this conversation?',
			'You will stop receiving email when someone replies to this take. This will not change other 9takes email preferences.',
			`<form method="POST" action="/api/reply-notifications/unsubscribe/${token}"><button type="submit">Stop these emails</button></form><a class="secondary" href="https://9takes.com">Keep them on</a>`
		)
	);
};

export const POST: RequestHandler = async (event) => {
	const { params, locals, request } = event;
	if (!isUuid(params.management_token)) throw error(404, 'Subscription not found');

	const { data, error: unsubscribeError } = await (locals.supabase as any).rpc(
		'unsubscribe_comment_reply_subscription',
		{ p_management_token: params.management_token }
	);
	if (unsubscribeError) {
		console.error('Failed to stop reply notification subscription', unsubscribeError);
		throw error(500, 'Failed to stop reply emails');
	}
	if (!data || data.status === 'invalid') throw error(404, 'Subscription not found');

	if (data.outbox_id != null) {
		runBestEffortTelemetry(
			event,
			captureReplyNotificationEvent(
				'reply_notification_unsubscribed',
				{
					outboxId: Number(data.outbox_id),
					subscriptionId: Number(data.subscription_id),
					questionId: Number(data.question_id),
					commentId: Number(data.comment_id)
				},
				{ insertIdSuffix: 'unsubscribed' }
			),
			(telemetryError) =>
				logBestEffortTelemetryFailure(
					'Failed to capture reply notification unsubscribe',
					telemetryError
				)
		);
	}

	if (!request.headers.get('accept')?.includes('text/html')) {
		return new Response('', { status: 200, headers: { 'Cache-Control': 'no-store' } });
	}

	return htmlResponse(
		renderPage(
			'Reply emails stopped',
			'You will no longer receive reply emails for this conversation.',
			'<a class="button" href="https://9takes.com">Visit 9takes</a>'
		)
	);
};
