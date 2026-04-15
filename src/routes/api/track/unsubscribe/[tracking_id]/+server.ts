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

function renderUnsubscribePage({
	title,
	message,
	recipientEmail,
	actionHtml
}: {
	title: string;
	message: string;
	recipientEmail: string;
	actionHtml: string;
}) {
	const escapedRecipientEmail = escapeHtml(recipientEmail);

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>${escapeHtml(title)} - 9takes</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      min-height: 100vh;
      background: #f6f7f9;
      color: #17181c;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    main {
      width: min(100% - 32px, 460px);
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 32px;
    }
    .brand {
      color: #17181c;
      display: inline-block;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 24px;
      text-decoration: none;
    }
    h1 {
      font-size: 24px;
      line-height: 1.2;
      margin: 0 0 12px;
    }
    p {
      color: #4b5563;
      font-size: 16px;
      line-height: 1.55;
      margin: 0 0 18px;
    }
    .email {
      color: #17181c;
      font-weight: 650;
      overflow-wrap: anywhere;
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 24px;
      flex-wrap: wrap;
    }
    button, .button {
      appearance: none;
      border: 0;
      border-radius: 6px;
      background: #17181c;
      color: #ffffff;
      cursor: pointer;
      display: inline-block;
      font-size: 15px;
      font-weight: 650;
      padding: 12px 18px;
      text-decoration: none;
    }
    .secondary {
      background: transparent;
      color: #4b5563;
      padding-left: 0;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <main>
    <a class="brand" href="https://9takes.com">9takes</a>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(message)} <span class="email">${escapedRecipientEmail}</span>.</p>
    <div class="actions">
      ${actionHtml}
    </div>
  </main>
</body>
</html>`;
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
	const safeTrackingId = encodeURIComponent(tracking_id);

	// Render a confirmation page. We intentionally do not mutate subscription state on GET.
	const html = renderUnsubscribePage({
		title: 'Unsubscribe from 9takes emails?',
		message: 'You are about to unsubscribe',
		recipientEmail,
		actionHtml: `<form method="POST" action="/api/track/unsubscribe/${safeTrackingId}">
        <button type="submit">Confirm unsubscribe</button>
      </form>
      <a class="secondary" href="https://9takes.com">Keep me subscribed</a>`
	});

	return new Response(html, {
		headers: {
			'Content-Type': 'text/html',
			'Cache-Control': 'no-store'
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

	const acceptsHtml = request.headers.get('accept')?.includes('text/html');
	if (!acceptsHtml) {
		return new Response('', {
			status: 200,
			headers: {
				'Cache-Control': 'no-store'
			}
		});
	}

	const html = renderUnsubscribePage({
		title: "You've been unsubscribed",
		message: 'You will no longer receive emails from 9takes at',
		recipientEmail,
		actionHtml: `<a class="button" href="https://9takes.com">Visit 9takes</a>`
	});

	return new Response(html, {
		status: 200,
		headers: {
			'Content-Type': 'text/html',
			'Cache-Control': 'no-store'
		}
	});
};
