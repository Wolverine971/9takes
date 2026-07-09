<!-- src/lib/components/admin/HtmlPreviewFrame.svelte -->
<script lang="ts">
	type PreviewKind = 'email' | 'document';

	let {
		html = '',
		title = 'HTML preview',
		kind = 'email'
	}: {
		html?: string;
		title?: string;
		kind?: PreviewKind;
	} = $props();

	const contentSecurityPolicy = [
		"default-src 'none'",
		"script-src 'none'",
		"style-src 'unsafe-inline'",
		'img-src data: blob:',
		'font-src data:',
		'media-src data: blob:',
		"connect-src 'none'",
		"frame-src 'none'",
		"object-src 'none'",
		"base-uri 'none'",
		"form-action 'none'"
	].join('; ');

	const baseStyles = `
		:root { color-scheme: light; }
		* { box-sizing: border-box; }
		html { overflow-wrap: anywhere; }
		body {
			margin: 0;
			padding: 1rem;
			background: Canvas;
			color: CanvasText;
			font: 16px/1.6 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
		}
		img, video, svg { max-width: 100%; height: auto; }
		table { max-width: 100%; border-collapse: collapse; }
		pre { max-width: 100%; overflow-x: auto; white-space: pre-wrap; }
		a { color: LinkText; }
	`;

	const documentStyles = `
		body { max-width: 56rem; margin-inline: auto; }
		h1, h2, h3, h4, h5, h6 { line-height: 1.25; margin: 1.5em 0 0.65em; }
		p, ul, ol, blockquote, table, pre { margin-block: 0 1.25rem; }
		blockquote { border-inline-start: 4px solid GrayText; padding-inline-start: 1rem; }
		th, td { border: 1px solid GrayText; padding: 0.75rem; text-align: start; }
	`;
	const styleOpenTag = '<sty' + 'le>';
	const styleCloseTag = '</sty' + 'le>';

	let srcdoc = $derived(`<!doctype html>
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy}" />
				${styleOpenTag}${baseStyles}${kind === 'document' ? documentStyles : ''}${styleCloseTag}
			</head>
			<body>${html}</body>
		</html>`);
</script>

<iframe
	class:document-preview={kind === 'document'}
	class="html-preview-frame"
	{title}
	{srcdoc}
	sandbox=""
	referrerpolicy="no-referrer"
></iframe>

<style>
	.html-preview-frame {
		display: block;
		width: 100%;
		min-height: 20rem;
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: #ffffff;
		color-scheme: light;
	}

	.document-preview {
		min-height: 44rem;
	}

	@media (max-width: 640px) {
		.html-preview-frame {
			min-height: 24rem;
		}

		.document-preview {
			min-height: 34rem;
		}
	}
</style>
