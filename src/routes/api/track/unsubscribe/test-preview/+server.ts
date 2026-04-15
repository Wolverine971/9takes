// src/routes/api/track/unsubscribe/test-preview/+server.ts
// Safe unsubscribe destination for admin test emails.

import type { RequestHandler } from './$types';

function renderTestUnsubscribePage(title = 'Test unsubscribe link') {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>${title} - 9takes</title>
  <style>
    body {
      margin: 0;
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
    .button {
      border-radius: 6px;
      background: #17181c;
      color: #ffffff;
      display: inline-block;
      font-size: 15px;
      font-weight: 650;
      margin-top: 8px;
      padding: 12px 18px;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <main>
    <a class="brand" href="https://9takes.com">9takes</a>
    <h1>${title}</h1>
    <p>This link is only used in admin test emails. No subscription state changed.</p>
    <a class="button" href="https://9takes.com/admin/welcome-sequence">Back to welcome sequence</a>
  </main>
</body>
</html>`;
}

export const GET: RequestHandler = async () => {
	return new Response(renderTestUnsubscribePage(), {
		headers: {
			'Content-Type': 'text/html',
			'Cache-Control': 'no-store'
		}
	});
};

export const POST: RequestHandler = async ({ request }) => {
	if (request.headers.get('accept')?.includes('text/html')) {
		return new Response(renderTestUnsubscribePage('Test one-click unsubscribe received'), {
			headers: {
				'Content-Type': 'text/html',
				'Cache-Control': 'no-store'
			}
		});
	}

	return new Response('', {
		status: 200,
		headers: {
			'Cache-Control': 'no-store'
		}
	});
};
