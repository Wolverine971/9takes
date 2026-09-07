// src/routes/api/notifications/email-unsubscribe/[token]/+server.ts
//
// Opt-out for the logged-in "someone replied to your take" email.
// The token is an HMAC-signed {userId, purpose} issued by
// accountReplyNotificationEmail.ts with no expiry, so a link in an old email
// keeps working. Idempotent: hitting it twice leaves email_replies = false.
// Turning the emails back on happens from /account.
//
// GET never changes state: mail clients and corporate link scanners prefetch
// GET links in email, which would silently unsubscribe people who never
// clicked. GET only verifies the token and renders a one-button confirm page;
// the POST from that button (or a List-Unsubscribe POST) does the update.

import type { RequestHandler } from './$types';
import { verifyEmailRepliesUnsubscribeToken } from '$lib/server/accountReplyNotificationEmail';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';

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
    .button { appearance: none; border: 0; border-radius: 6px; background: #17181c; color: #fff; cursor: pointer; display: inline-block; padding: 12px 18px; font: inherit; font-weight: 650; text-decoration: none; }
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

function htmlResponse(html: string, status = 200) {
	return new Response(html, {
		status,
		headers: {
			'Content-Type': 'text/html; charset=utf-8',
			'Cache-Control': 'no-store',
			'X-Robots-Tag': 'noindex, nofollow',
			'Referrer-Policy': 'no-referrer'
		}
	});
}

const INVALID = renderPage(
	'This link is not valid',
	'The unsubscribe link is incomplete or was changed. You can turn reply emails off from your account page instead.',
	'<a class="button" href="https://9takes.com/account">Go to your account</a>'
);

function confirmPage(token: string) {
	return renderPage(
		'Turn off reply emails?',
		'You will stop getting an email when someone replies to your take. You can turn them back on from your account page any time.',
		`<form method="post" action="/api/notifications/email-unsubscribe/${encodeURIComponent(token)}"><button class="button" type="submit">Turn off reply emails</button></form><a href="https://9takes.com/account">Keep them on</a>`
	);
}

const DONE = renderPage(
	'Reply emails are off',
	'You will no longer get an email when someone replies to your take. You can turn them back on from your account page.',
	'<a class="button" href="https://9takes.com/account">Go to your account</a>'
);

async function handleUnsubscribe(token: string | undefined) {
	const userId = verifyEmailRepliesUnsubscribeToken(token);
	if (!userId) return htmlResponse(INVALID, 400);

	// TODO regen database.types.ts after applying 20260906120000; the RPC is
	// not in the generated types yet.
	const { error: rpcError } = await (getSupabaseAdminClient().rpc as any)(
		'set_email_replies_preference',
		{ p_user_id: userId, p_enabled: false }
	);
	if (rpcError) {
		console.error('Failed to turn off reply emails', rpcError);
		return htmlResponse(
			renderPage(
				'Something went wrong',
				'We could not update your setting just now. Please try the link again in a minute, or change it from your account page.',
				'<a class="button" href="https://9takes.com/account">Go to your account</a>'
			),
			500
		);
	}

	return htmlResponse(DONE);
}

// GET: verify only, then ask. No state change (see header comment).
export const GET: RequestHandler = async ({ params }) => {
	const token = params.token ?? '';
	if (!verifyEmailRepliesUnsubscribeToken(token)) return htmlResponse(INVALID, 400);
	return htmlResponse(confirmPage(token));
};

// POST: the confirm button above, or a mail client honouring List-Unsubscribe.
export const POST: RequestHandler = async ({ params }) => handleUnsubscribe(params.token);
