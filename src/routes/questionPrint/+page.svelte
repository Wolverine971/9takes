<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import Rubix from '$lib/components/icons/rubix.svelte';
	import Scribble from '$lib/components/atoms/scribble.svelte';
	import { browser } from '$app/environment';

	let question = {
		id: '',
		url: '',
		question: '',
		question_formatted: ''
	};

	let customUrl = '';
	let backgroundImage = '';
	let backgroundOpacity = 0.2;
	let qrCodeUrl = '';
	let innerWidth = 0;
	let previewMode = false;
	let uuid = '';

	// QR Code options
	const QR_OPTS = {
		errorCorrectionLevel: 'H',
		type: 'image/png',
		quality: 0.7,
		margin: 1,
		color: {
			dark: '#333333',
			light: '#ffffff'
		}
	};

	// Dynamically calculate font size based on text length
	$: fontSize = question.question ? calculateFontSize(question.question) : '2rem';
	$: printFontSize = calculatePrintFontSize(question.question);

	function calculateFontSize(text: string): string {
		const breakpoints = {
			xs: { length: 45, size: innerWidth > 500 ? '2.3rem' : '1.9rem' },
			sm: { length: 60, size: innerWidth > 500 ? '2.2rem' : '1.8rem' },
			md: { length: 80, size: innerWidth > 500 ? '2.1rem' : '1.7rem' },
			lg: { length: 105, size: innerWidth > 500 ? '2rem' : '1.6rem' },
			xl: { length: 130, size: innerWidth > 500 ? '1.8rem' : '1.4rem' },
			xxl: { length: 150, size: innerWidth > 500 ? '1.7rem' : '1.3rem' },
			xxxl: { length: 200, size: innerWidth > 500 ? '1.6rem' : '1.2rem' },
			huge: { length: 250, size: innerWidth > 500 ? '1.4rem' : '1rem' },
			massive: { length: 300, size: innerWidth > 500 ? '1.2rem' : '0.9rem' }
		};

		for (const [key, value] of Object.entries(breakpoints)) {
			if (text.length < value.length) {
				return value.size;
			}
		}

		return innerWidth > 500 ? '1rem' : '0.8rem';
	}

	function calculatePrintFontSize(text: string): string {
		const breakpoints = {
			xs: { length: 45, size: '2.5rem' },
			sm: { length: 60, size: '2.3rem' },
			md: { length: 80, size: '2.1rem' },
			lg: { length: 105, size: '1.9rem' },
			xl: { length: 130, size: '1.7rem' },
			xxl: { length: 150, size: '1.5rem' },
			xxxl: { length: 200, size: '1.3rem' },
			huge: { length: 250, size: '1.1rem' },
			massive: { length: 300, size: '0.9rem' }
		};

		for (const [key, value] of Object.entries(breakpoints)) {
			if (text.length < value.length) {
				return value.size;
			}
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

	// This is the key function that needs fixing
	function printPoster() {
		if (!qrCodeUrl) {
			generateQRCode();
		}

		if (!browser) return;

		// Create a new window
		const printWindow = window.open('', '_blank');
		if (!printWindow) {
			alert('Please allow popups to print the question.');
			return;
		}

		// First, write the basic HTML structure
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

		// Create and append the style element
		const styleElement = printWindow.document.createElement('style');
		printWindow.document.head.appendChild(styleElement);

		// Set the CSS content directly on the style element
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
				background: white;
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
				background: linear-gradient(145deg, #ffffff, #f0f0f0);
				border-radius: 15px;
				box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
				padding: 2rem;
				margin-bottom: 1.5rem;
				box-sizing: border-box;
				${backgroundImage ? 'position: relative; overflow: hidden;' : ''}
			}
			
			.question-box {
				width: 100%;
				text-align: center;
				color: #333;
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
				background: #0066cc;
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
				background-color: white;
				padding: 0.5rem;
				border: 1px solid #eee;
				border-radius: 8px;
			}
			
			.qr-url-small {
				margin-top: 0.5rem;
				font-size: 0.8rem;
				color: #444;
				background: linear-gradient(145deg, #f0f0f0, #ffffff);
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

		// Set the HTML content
		const contentDiv = printWindow.document.getElementById('content');
		if (contentDiv) {
			contentDiv.innerHTML = `
				<div class="print-container">
					<div class="mini-brand">
						<svg width="30" height="30" viewBox="0 0 50 50" style="margin: 0.5rem">
							<rect x="5" y="5" width="16" height="16" fill="#0066cc" />
							<rect x="29" y="5" width="16" height="16" fill="#9900cc" />
							<rect x="5" y="29" width="16" height="16" fill="#cc0066" />
							<rect x="29" y="29" width="16" height="16" fill="#cc9900" />
						</svg>
						<svg width="120" height="30" viewBox="0 0 120 30">
							<text x="10" y="22" font-family="Arial" font-size="24" font-weight="bold" fill="#333">9takes</text>
						</svg>
					</div>
					
					<div class="question-container">
						${backgroundImage ? '<div class="background-image"></div>' : ''}
						<h1 class="question-box">${question.question}</h1>
					</div>
					
					<div class="mini-qr">
						<img src="${qrCodeUrl}" alt="QR Code" class="qr-image-small" />
						<p class="qr-url-small">${customUrl || `9takes.com/links/${uuid.slice(0, 8)}...`}</p>
					</div>
				</div>
			`;
		}

		// Close the document and set up printing
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

	// Update QR code when custom URL changes
	$: if (customUrl && customUrl.trim() !== '' && previewMode) {
		generateQRCode();
	}

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
				bind:value={question.question}
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
			<input type="file" id="bg-image" accept="image/*" on:change={handleFileInput} />
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
			<button class="btn preview" on:click={togglePreviewMode}>
				{previewMode ? 'Edit Poster' : 'Preview Poster'}
			</button>
			<button class="btn print" on:click={printPoster}> Print Question </button>
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
				{question.question}
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

<!-- this is me typing a bunch of stuff. -->

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
		background: white;
		border-radius: 15px;
		padding: 2rem;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	}

	.controls h1 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		color: var(--darkest-gray, #333);
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
	}

	.form-group input,
	.form-group textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--light-gray, #ddd);
		border-radius: 8px;
		font-size: 1rem;
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: var(--accent, #0066cc);
		box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
	}

	.button-group {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 8px;
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn.preview {
		background-color: var(--accent, #0066cc);
		color: white;
	}

	.btn.preview:hover {
		background-color: #0055aa;
	}

	.btn.print {
		background-color: var(--dark-gray, #444);
		color: white;
	}

	.btn.print:hover {
		background-color: #333333;
	}

	.btn.print:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Poster Section */
	.poster-container {
		background: white;
		border-radius: 15px;
		padding: 3rem 2rem;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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
		background: linear-gradient(145deg, #ffffff, var(--light-gray, #f0f0f0));
		border-radius: 15px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
		padding: 2rem 1.5rem;
		margin-bottom: 2rem;
		transition: all 0.3s ease;
	}

	@media (max-width: 576px) {
		.question-container {
			padding: 1.25rem 1rem;
		}
	}

	.question-box {
		width: 100%;
		text-align: center;
		color: var(--darkest-gray, #333);
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
		background: var(--accent, #0066cc);
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
		border-radius: var(--base-border-radius, 8px);
		background-color: white;
		padding: 0.5rem;
		border: 1px solid var(--base-white-outline, #eee);
	}

	.qr-url {
		margin-top: 0.5rem;
		font-size: 0.9rem;
		color: var(--dark-gray, #444);
		border-radius: 0.5rem;
		background: linear-gradient(145deg, var(--light-gray, #f0f0f0), #ffffff);
		padding: 0.2rem 0.5rem;
	}
</style>
