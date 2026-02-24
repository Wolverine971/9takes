<!-- src/routes/admin/asset-generators/question-print/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import Rubix from '$lib/components/icons/rubix.svelte';
	import Scribble from '$lib/components/atoms/scribble.svelte';
	import { browser } from '$app/environment';

	let questionText = $state('');
	let customUrl = $state('');
	let backgroundImage = $state('');
	let backgroundOpacity = $state(0.2);
	let qrCodeUrl = $state('');
	let innerWidth = $state(0);
	let previewMode = $state(false);
	let uuid = $state('');

	const QR_OPTS: QRCode.QRCodeToDataURLOptions = {
		errorCorrectionLevel: 'H',
		type: 'image/png',
		margin: 1,
		color: {
			dark: '#7c3aed',
			light: '#0a0a0f'
		}
	};

	let fontSize = $derived(questionText ? calculateFontSize(questionText) : '2rem');
	let printFontSize = $derived(calculatePrintFontSize(questionText));

	function calculateFontSize(text: string): string {
		const breakpoints = [
			{ length: 45, size: innerWidth > 500 ? '2.3rem' : '1.9rem' },
			{ length: 60, size: innerWidth > 500 ? '2.2rem' : '1.8rem' },
			{ length: 80, size: innerWidth > 500 ? '2.1rem' : '1.7rem' },
			{ length: 105, size: innerWidth > 500 ? '2rem' : '1.6rem' },
			{ length: 130, size: innerWidth > 500 ? '1.8rem' : '1.4rem' },
			{ length: 150, size: innerWidth > 500 ? '1.7rem' : '1.3rem' },
			{ length: 200, size: innerWidth > 500 ? '1.6rem' : '1.2rem' },
			{ length: 250, size: innerWidth > 500 ? '1.4rem' : '1rem' },
			{ length: 300, size: innerWidth > 500 ? '1.2rem' : '0.9rem' }
		];

		for (const bp of breakpoints) {
			if (text.length < bp.length) return bp.size;
		}

		return innerWidth > 500 ? '1rem' : '0.8rem';
	}

	function calculatePrintFontSize(text: string): string {
		const breakpoints = [
			{ length: 45, size: '2.5rem' },
			{ length: 60, size: '2.3rem' },
			{ length: 80, size: '2.1rem' },
			{ length: 105, size: '1.9rem' },
			{ length: 130, size: '1.7rem' },
			{ length: 150, size: '1.5rem' },
			{ length: 200, size: '1.3rem' },
			{ length: 250, size: '1.1rem' },
			{ length: 300, size: '0.9rem' }
		];

		for (const bp of breakpoints) {
			if (text.length < bp.length) return bp.size;
		}

		return '0.8rem';
	}

	function togglePreviewMode() {
		previewMode = !previewMode;

		if (previewMode && !qrCodeUrl) {
			generateQRCode();
		}
	}

	function generateQRCode() {
		if (!uuid) {
			uuid = crypto.randomUUID();
		}

		const urlToEncode = customUrl || `https://9takes.com/links/${uuid}`;

		QRCode.toDataURL(urlToEncode, QR_OPTS, function (err, url) {
			if (err) {
				console.error('QR Code generation failed:', err);
				return;
			}
			qrCodeUrl = url;
		});
	}

	function printPoster() {
		if (!qrCodeUrl) {
			generateQRCode();
		}

		if (!browser) return;

		const printWindow = window.open('', '_blank');
		if (!printWindow) {
			alert('Please allow popups to print the question.');
			return;
		}

		printWindow.document.write(`
			<!DOCTYPE html>
			<html>
			<head>
				<title>9takes Question</title>
				<meta charset="UTF-8">
			</head>
			<body>
				<div id="content"></div>
			</body>
			</html>
		`);

		const styleElement = printWindow.document.createElement('style');
		printWindow.document.head.appendChild(styleElement);

		styleElement.textContent = `
			@page {
				size: letter;
				margin: 0;
			}

			body {
				margin: 0;
				padding: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				min-height: 100vh;
				background: #0a0a0f;
				font-family: 'Noticia Text', Georgia, serif;
			}

			.print-container {
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 100%;
				max-width: 100%;
				padding: 2rem;
				box-sizing: border-box;
			}

			.mini-brand {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: 1.5rem;
			}

			.question-container {
				width: 100%;
				background: linear-gradient(145deg, #1a1a2e, #252538);
				border: 1px solid rgba(124, 58, 237, 0.2);
				border-radius: 15px;
				box-shadow: 0 0 20px rgba(124, 58, 237, 0.15);
				padding: 2rem;
				margin-bottom: 1.5rem;
				box-sizing: border-box;
				${backgroundImage ? 'position: relative; overflow: hidden;' : ''}
			}

			.question-box {
				width: 100%;
				text-align: center;
				color: #f8fafc;
				font-weight: 700;
				line-height: 1.4;
				letter-spacing: 0.5px;
				margin: 0;
				padding: 0.5rem 0;
				text-transform: uppercase;
				position: relative;
				font-size: ${printFontSize};
				${backgroundImage ? 'position: relative; z-index: 1;' : ''}
			}

			.question-box::after {
				content: '';
				position: absolute;
				bottom: -10px;
				left: 50%;
				transform: translateX(-50%);
				width: 60px;
				height: 3px;
				background: #7c3aed;
				border-radius: 2px;
			}

			.mini-qr {
				display: flex;
				flex-direction: column;
				align-items: center;
				${backgroundImage ? 'position: relative; z-index: 1;' : ''}
			}

			.qr-image-small {
				width: 100px;
				height: 100px;
				background-color: #0a0a0f;
				padding: 0.5rem;
				border: 1px solid rgba(124, 58, 237, 0.3);
				border-radius: 8px;
			}

			.qr-url-small {
				margin-top: 0.5rem;
				font-size: 0.8rem;
				color: #94a3b8;
				background: #1a1a2e;
				padding: 0.2rem 0.5rem;
				border-radius: 4px;
			}

			${
				backgroundImage
					? `
			.background-image {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background-image: url("${backgroundImage}");
				background-size: cover;
				background-position: center;
				opacity: ${backgroundOpacity};
				z-index: 0;
			}
			`
					: ''
			}
		`;

		const contentDiv = printWindow.document.getElementById('content');
		if (contentDiv) {
			contentDiv.innerHTML = `
				<div class="print-container">
					<div class="mini-brand">
						<svg width="30" height="30" viewBox="0 0 50 50" style="margin: 0.5rem">
							<rect x="5" y="5" width="16" height="16" fill="#7c3aed" />
							<rect x="29" y="5" width="16" height="16" fill="#8b5cf6" />
							<rect x="5" y="29" width="16" height="16" fill="#3b82f6" />
							<rect x="29" y="29" width="16" height="16" fill="#06b6d4" />
						</svg>
						<svg width="120" height="30" viewBox="0 0 120 30">
							<text
								x="10"
								y="22"
								font-family="Noticia Text"
								font-size="24"
								font-weight="bold"
								fill="#f8fafc"
							>
								9takes
							</text>
						</svg>
					</div>

					<div class="question-container">
						${backgroundImage ? '<div class="background-image"></div>' : ''}
						<h1 class="question-box">${questionText}</h1>
					</div>

					<div class="mini-qr">
						<img src="${qrCodeUrl}" alt="QR Code" class="qr-image-small" />
						<p class="qr-url-small">${customUrl || `9takes.com/links/${uuid.slice(0, 8)}...`}</p>
					</div>
				</div>
			`;
		}

		printWindow.document.close();
		printWindow.onload = function () {
			printWindow.focus();
			printWindow.print();
			setTimeout(function () {
				printWindow.close();
			}, 100);
		};
	}

	function handleFileInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				backgroundImage = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	$effect(() => {
		if (customUrl && customUrl.trim() !== '' && previewMode) {
			generateQRCode();
		}
	});

	onMount(() => {
		innerWidth = window.innerWidth;
		uuid = crypto.randomUUID();
		generateQRCode();
	});
</script>

<svelte:window bind:innerWidth />

<div class="page-container" class:preview-mode={previewMode}>
	<!-- Controls for editing -->
	<div class="controls" class:hidden={previewMode}>
		<h1>Create Question Poster</h1>

		<div class="form-group">
			<label for="question-input">Question Text:</label>
			<textarea
				id="question-input"
				bind:value={questionText}
				placeholder="Enter your question here..."
				rows="3"
			></textarea>
		</div>

		<div class="form-group">
			<label for="url-input">Custom URL for QR Code:</label>
			<input
				id="url-input"
				type="text"
				bind:value={customUrl}
				placeholder="https://9takes.com/questions/your-url"
			/>
		</div>

		<div class="form-group">
			<label for="bg-image">Background Image:</label>
			<input type="file" id="bg-image" accept="image/*" onchange={handleFileInput} />
		</div>

		<div class="form-group">
			<label for="opacity-slider">Background Opacity: {backgroundOpacity.toFixed(1)}</label>
			<input
				id="opacity-slider"
				type="range"
				min="0"
				max="1"
				step="0.1"
				bind:value={backgroundOpacity}
			/>
		</div>

		<div class="button-group">
			<button class="btn preview" onclick={togglePreviewMode}>
				{previewMode ? 'Edit Poster' : 'Preview Poster'}
			</button>
			<button class="btn print" onclick={printPoster}>Print Question</button>
		</div>
	</div>

	<!-- Poster Preview Area -->
	<div class="poster-container" style="--bg-opacity: {backgroundOpacity};">
		{#if backgroundImage}
			<div class="background-image" style="background-image: url('{backgroundImage}');"></div>
		{/if}

		<div class="brand">
			<Rubix height={50} width={50} svgStyle={'margin: 1rem'} />
			<Scribble text={'9takes'} />
		</div>

		<div class="question-container">
			<h1 class="question-box" style="font-size: {fontSize}" itemprop="name">
				{questionText}
			</h1>
		</div>

		{#if qrCodeUrl}
			<div class="qr-code-container">
				<img src={qrCodeUrl} alt="QR Code" class="qr-image" />
				<p class="qr-url">{customUrl || `9takes.com/links/${uuid.slice(0, 8)}...`}</p>
			</div>
		{/if}
	</div>
</div>

<style>
	/* Page Layout */
	.page-container {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.page-container.preview-mode .controls {
		display: none;
	}

	.page-container.preview-mode .poster-container {
		margin: 0 auto;
	}

	/* Controls Section */
	.controls {
		background: var(--void-surface, #1a1a2e);
		border: 1px solid var(--void-elevated, #252538);
		border-radius: var(--border-radius-lg, 0.75rem);
		padding: 2rem;
		box-shadow: var(--shadow-lg, 0 10px 15px rgba(0, 0, 0, 0.5));
	}

	.controls h1 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		color: var(--text-primary, #f8fafc);
	}

	.controls.hidden {
		display: none;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: var(--text-secondary, #94a3b8);
	}

	.form-group input,
	.form-group textarea {
		width: 100%;
		padding: 0.75rem;
		background: var(--void-deep, #12121a);
		border: 1px solid var(--void-elevated, #252538);
		border-radius: var(--border-radius, 0.5rem);
		font-size: 1rem;
		color: var(--text-primary, #f8fafc);
		font-family: inherit;
	}

	.form-group input::placeholder,
	.form-group textarea::placeholder {
		color: var(--text-tertiary, #64748b);
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: var(--shadow-monarch, #7c3aed);
		box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.25);
	}

	.form-group input[type='range'] {
		accent-color: var(--shadow-monarch, #7c3aed);
		padding: 0;
		background: transparent;
		border: none;
	}

	.form-group input[type='file'] {
		padding: 0.5rem;
		cursor: pointer;
	}

	.button-group {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: var(--border-radius, 0.5rem);
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		transition: var(--transition-glow, all 0.3s ease);
	}

	.btn.preview {
		background-color: var(--shadow-monarch, #7c3aed);
		color: var(--text-on-primary, #ffffff);
		box-shadow: 0 0 10px rgba(124, 58, 237, 0.3);
	}

	.btn.preview:hover {
		background-color: var(--shadow-monarch-dark, #6d28d9);
		box-shadow: var(--glow-md, 0 0 20px rgba(124, 58, 237, 0.5));
	}

	.btn.print {
		background-color: var(--system-interface, #3b82f6);
		color: var(--text-on-primary, #ffffff);
	}

	.btn.print:hover {
		background-color: var(--system-interface-dark, #2563eb);
		box-shadow: var(--glow-blue, 0 0 20px rgba(59, 130, 246, 0.5));
	}

	.btn.print:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Poster Section */
	.poster-container {
		background: var(--void-deep, #12121a);
		border: 1px solid var(--void-elevated, #252538);
		border-radius: var(--border-radius-lg, 0.75rem);
		padding: 3rem 2rem;
		box-shadow: var(--shadow-lg, 0 10px 15px rgba(0, 0, 0, 0.5));
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 600px;
	}

	.background-image {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-size: cover;
		background-position: center;
		opacity: var(--bg-opacity);
		z-index: 0;
	}

	/* Brand Section */
	.brand {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1rem 0;
		margin-bottom: 2rem;
		position: relative;
		z-index: 1;
	}

	/* Question Styles */
	.question-container {
		position: relative;
		z-index: 1;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: linear-gradient(
			145deg,
			var(--void-surface, #1a1a2e),
			var(--void-elevated, #252538)
		);
		border: 1px solid rgba(124, 58, 237, 0.2);
		border-radius: var(--border-radius-lg, 0.75rem);
		box-shadow: 0 0 20px rgba(124, 58, 237, 0.1);
		padding: 2rem 1.5rem;
		margin-bottom: 2rem;
		transition: var(--transition-glow, all 0.3s ease);
	}

	.question-container:hover {
		box-shadow: 0 0 30px rgba(124, 58, 237, 0.2);
	}

	@media (max-width: 576px) {
		.question-container {
			padding: 1.25rem 1rem;
		}
	}

	.question-box {
		width: 100%;
		text-align: center;
		color: var(--text-primary, #f8fafc);
		font-weight: 700;
		line-height: 1.4;
		letter-spacing: 0.5px;
		margin: 0;
		padding: 0.5rem 0;
		text-transform: uppercase;
		position: relative;
	}

	.question-box::after {
		content: '';
		position: absolute;
		bottom: -10px;
		left: 50%;
		transform: translateX(-50%);
		width: 60px;
		height: 3px;
		background: var(--shadow-monarch, #7c3aed);
		border-radius: 2px;
	}

	/* QR Code Styles */
	.qr-code-container {
		position: relative;
		z-index: 1;
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.qr-image {
		width: 150px;
		height: 150px;
		border-radius: var(--base-border-radius, 0.5rem);
		background-color: var(--void-abyss, #0a0a0f);
		padding: 0.5rem;
		border: 1px solid rgba(124, 58, 237, 0.3);
	}

	.qr-url {
		margin-top: 0.5rem;
		font-size: 0.9rem;
		color: var(--text-secondary, #94a3b8);
		border-radius: var(--border-radius, 0.5rem);
		background: var(--void-surface, #1a1a2e);
		padding: 0.2rem 0.5rem;
	}
</style>
