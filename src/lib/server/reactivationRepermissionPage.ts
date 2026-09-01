// src/lib/server/reactivationRepermissionPage.ts
function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, (character) => {
		const entities: Record<string, string> = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;'
		};
		return entities[character];
	});
}

export function renderRepermissionConfirmation(options: {
	title: string;
	message: string;
	buttonLabel: string;
	action: string;
}) {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>${escapeHtml(options.title)} - 9takes</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f6f7f9; color: #17181c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    main { box-sizing: border-box; width: min(100% - 32px, 460px); padding: 32px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; }
    a { color: #4b5563; }
    .brand { display: inline-block; margin-bottom: 24px; color: #17181c; font-size: 18px; font-weight: 700; text-decoration: none; }
    h1 { margin: 0 0 12px; font-size: 24px; line-height: 1.2; }
    p { margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.55; }
    .actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
    button { border: 0; border-radius: 6px; padding: 12px 18px; background: #17181c; color: #fff; cursor: pointer; font: inherit; font-weight: 650; }
  </style>
</head>
<body>
  <main>
    <a class="brand" href="https://9takes.com">9takes</a>
    <h1>${escapeHtml(options.title)}</h1>
    <p>${escapeHtml(options.message)}</p>
    <div class="actions">
      <form method="POST" action="${escapeHtml(options.action)}">
        <button type="submit">${escapeHtml(options.buttonLabel)}</button>
      </form>
      <a href="https://9takes.com">Cancel</a>
    </div>
  </main>
</body>
</html>`;
}
