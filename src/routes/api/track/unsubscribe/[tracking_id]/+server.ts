// src/routes/api/track/unsubscribe/[tracking_id]/+server.ts
// Unsubscribe endpoint

import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';

export const GET: RequestHandler = async ({ params, request }) => {
	const { tracking_id } = params;

	const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
	const userAgent = request.headers.get('user-agent') || 'unknown';

	const supabaseAny = supabase as any;
	const { data: recipientEmail, error: unsubscribeError } = await supabaseAny.rpc(
		'track_email_unsubscribe',
		{
			p_tracking_id: tracking_id,
			p_ip_address: ip,
			p_user_agent: userAgent
		}
	);

	if (unsubscribeError) {
		console.error('Error tracking unsubscribe:', unsubscribeError);
		throw error(500, 'Failed to unsubscribe');
	}

	if (!recipientEmail) {
		throw error(404, 'Email not found');
	}

	// Return a simple unsubscribe confirmation page
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
  </style>
</head>
<body>
  <div class="container">
    <h1>You've been unsubscribed</h1>
    <p>You will no longer receive emails from 9takes at <strong>${recipientEmail}</strong>.</p>
    <p>Changed your mind? <a href="https://9takes.com">Visit 9takes</a></p>
  </div>
</body>
</html>`;

	return new Response(html, {
		headers: {
			'Content-Type': 'text/html'
		}
	});
};
