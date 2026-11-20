// src/routes/api/enneagram-test/stop/[token]/+server.ts
//
// "Stop these emails" link in the Enneagram test emails. Clears the opt-in
// email and sends the person back to their result page with a confirmation.
//
// GET never changes state: mail clients and link scanners prefetch GET links in
// email, which would turn the emails off for people who never clicked. GET only
// checks the token and renders a one-button confirm page; the POST from that
// button does the update.
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	getTestResultTypes,
	isResultToken,
	stopTestNotifications
} from '$lib/server/enneagramTest';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { logger } from '$lib/utils/logger';

function escapeHtml(value: string): string {
	return value.replace(
		/[&<>"']/g,
		(char) =>
			({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] as string
	);
}

function renderPage(title: string, message: string, actionHtml: string) {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>${escapeHtml(title)} - 9takes</title>
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
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(message)}</p>
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

function resultPath(token: string): string {
	return `/enneagram-test/result/${encodeURIComponent(token)}`;
}

function confirmPage(token: string) {
	return renderPage(
		'Stop these emails?',
		'You will stop getting emails about this Enneagram test result, including when someone answers your link. Your result page stays where it is.',
		`<form method="post" action="/api/enneagram-test/stop/${encodeURIComponent(token)}"><button class="button" type="submit">Stop these emails</button></form><a href="${escapeHtml(resultPath(token))}">Keep them on</a>`
	);
}

const UNAVAILABLE = renderPage(
	'Something went wrong',
	'We could not update your setting just now. Please try the link again in a minute.',
	'<a class="button" href="https://9takes.com/enneagram-test">Back to the test</a>'
);

// GET: check the link only, then ask. No state change (see header comment).
export const GET: RequestHandler = async ({ params }) => {
	const token = params.token ?? '';
	if (!isResultToken(token)) redirect(303, '/enneagram-test');

	let found: boolean;
	try {
		found = (await getTestResultTypes(getSupabaseAdminClient(), token)) !== null;
	} catch (error) {
		logger.error('Failed to load Enneagram test result for the stop page', error as Error);
		return htmlResponse(UNAVAILABLE, 500);
	}
	if (!found) redirect(303, '/enneagram-test');
	return htmlResponse(confirmPage(token));
};

// POST: the confirm button above.
export const POST: RequestHandler = async ({ params }) => {
	const token = params.token ?? '';
	if (!isResultToken(token)) redirect(303, '/enneagram-test');

	let found: boolean;
	try {
		found = await stopTestNotifications(getSupabaseAdminClient(), token);
	} catch (error) {
		logger.error('Failed to stop Enneagram test emails', error as Error);
		return htmlResponse(UNAVAILABLE, 500);
	}
	if (!found) redirect(303, '/enneagram-test');
	redirect(303, `${resultPath(token)}?emails=stopped`);
};
