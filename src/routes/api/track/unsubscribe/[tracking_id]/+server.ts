// src/routes/api/track/unsubscribe/[tracking_id]/+server.ts
// Unsubscribe endpoint

import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';

export const GET: RequestHandler = async ({ params, request }) => {
	const { tracking_id } = params;

	// Get the email send record
	const { data: emailSend, error: fetchError } = await supabase
		.from('email_sends')
		.select('id, recipient_email, recipient_source, recipient_source_id')
		.eq('tracking_id', tracking_id)
		.single();

	if (fetchError || !emailSend) {
		throw error(404, 'Email not found');
	}

	const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
	const userAgent = request.headers.get('user-agent') || 'unknown';

	// Check if already unsubscribed
	const { data: existingUnsubscribe } = await supabase
		.from('email_unsubscribes')
		.select('id')
		.eq('email', emailSend.recipient_email)
		.single();

	if (!existingUnsubscribe) {
		// Insert unsubscribe record
		await supabase.from('email_unsubscribes').insert({
			email: emailSend.recipient_email,
			source: emailSend.recipient_source,
			source_id: emailSend.recipient_source_id
		});
	}

	// Update email_send record
	await supabase
		.from('email_sends')
		.update({
			unsubscribed_at: new Date().toISOString()
		})
		.eq('tracking_id', tracking_id);

	// Log the tracking event
	await supabase.from('email_tracking_events').insert({
		email_send_id: emailSend.id,
		event_type: 'unsubscribe',
		ip_address: ip,
		user_agent: userAgent
	});

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
    <p>You will no longer receive emails from 9takes at <strong>${emailSend.recipient_email}</strong>.</p>
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
