// src/routes/api/track/unsubscribe/[tracking_id]/+server.ts
// Unsubscribe endpoint

import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { exitWelcomeSequenceForEmail } from '$lib/server/emailSequences';

function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, (char) => {
		switch (char) {
			case '&':
				return '&amp;';
			case '<':
				return '&lt;';
			case '>':
				return '&gt;';
			case '"':
				return '&quot;';
			case "'":
				return '&#39;';
			default:
				return char;
		}
	});
}

async function getRecipientEmailByTrackingId(
	supabaseClient: any,
	trackingId: string
): Promise<string | null> {
	const supabaseAny = supabaseClient as any;
	const { data: emailSend, error: emailSendError } = await supabaseAny
		.from('email_sends')
		.select('recipient_email')
		.eq('tracking_id', trackingId)
		.single();

	if (emailSendError) {
		console.error('Error loading recipient email for unsubscribe view:', emailSendError);
		return null;
	}

	return emailSend?.recipient_email || null;
}

async function unsubscribeWithTrackingId(
	supabaseClient: any,
	trackingId: string,
	request: Request
): Promise<{ recipientEmail: string | null; unsubscribeError: any }> {
	const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
	const userAgent = request.headers.get('user-agent') || 'unknown';

	const supabaseAny = supabaseClient as any;
	const { data: recipientEmail, error: unsubscribeError } = await supabaseAny.rpc(
		'track_email_unsubscribe',
		{
			p_tracking_id: trackingId,
			p_ip_address: ip,
			p_user_agent: userAgent
		}
	);

	return { recipientEmail, unsubscribeError };
}

export const GET: RequestHandler = async ({ params, locals }) => {
	const { tracking_id } = params;
	const recipientEmail = await getRecipientEmailByTrackingId(locals.supabase, tracking_id);

	if (!recipientEmail) {
		throw error(404, 'Email not found');
	}
	const escapedRecipientEmail = escapeHtml(recipientEmail);
	const safeTrackingId = encodeURIComponent(tracking_id);

	// Render a confirmation page. We intentionally do not mutate subscription state on GET.
	const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribe - 9takes</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 400px;
    }
    h1 { color: #111; font-size: 24px; margin: 0 0 16px; }
    p { color: #666; font-size: 16px; line-height: 1.5; margin: 0 0 24px; }
    a {
      color: #6c5ce7;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    button {
      border: none;
      border-radius: 6px;
      background: #6c5ce7;
      color: #fff;
      padding: 12px 20px;
      font-size: 15px;
      cursor: pointer;
    }
    button:hover {
      background: #5b4cdb;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Unsubscribe from 9takes emails?</h1>
    <p>You're about to unsubscribe <strong>${escapedRecipientEmail}</strong>.</p>
    <form method="POST" action="/api/track/unsubscribe/${safeTrackingId}">
      <button type="submit">Confirm unsubscribe</button>
    </form>
    <p style="margin-top: 16px;">Changed your mind? <a href="https://9takes.com">Keep me subscribed</a></p>
  </div>
</body>
</html>`;

	return new Response(html, {
		headers: {
			'Content-Type': 'text/html'
		}
	});
};

export const POST: RequestHandler = async ({ params, request, locals }) => {
	const { tracking_id } = params;

	const { recipientEmail, unsubscribeError } = await unsubscribeWithTrackingId(
		locals.supabase,
		tracking_id,
		request
	);

	if (unsubscribeError) {
		console.error('Error tracking one-click unsubscribe:', unsubscribeError);
		throw error(500, 'Failed to unsubscribe');
	}

	if (!recipientEmail) {
		throw error(404, 'Email not found');
	}

	try {
		await exitWelcomeSequenceForEmail(recipientEmail, 'unsubscribed');
	} catch (sequenceError) {
		console.error('Failed to exit welcome sequence on unsubscribe:', sequenceError);
	}

	const escapedRecipientEmail = escapeHtml(recipientEmail);

	const acceptsHtml = request.headers.get('accept')?.includes('text/html');
	if (!acceptsHtml) {
		return new Response('', { status: 200 });
	}

	const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribed - 9takes</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 420px;
    }
    h1 { color: #111; font-size: 24px; margin: 0 0 16px; }
    p { color: #666; font-size: 16px; line-height: 1.5; margin: 0 0 24px; }
    a {
      color: #6c5ce7;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>You've been unsubscribed</h1>
    <p>You will no longer receive emails from 9takes at <strong>${escapedRecipientEmail}</strong>.</p>
    <p>Changed your mind? <a href="https://9takes.com">Visit 9takes</a></p>
  </div>
</body>
</html>`;

	return new Response(html, {
		status: 200,
		headers: {
			'Content-Type': 'text/html'
		}
	});
};
