<!-- src/routes/admin/asset-generators/question-print/+page.svelte -->
<script lang="ts">
	import { browser } from '$app/environment';
	import QRCode from 'qrcode';
	import Modal from '$lib/components/atoms/Modal2.svelte';
	import { getModal } from '$lib/components/atoms/Modal2.svelte';
	import Rubix from '$lib/components/icons/rubix.svelte';
	import Scribble from '$lib/components/atoms/scribble.svelte';
	import {
		QUESTION_PRINT_BACKGROUND_PRESETS,
		getQuestionPrintBackgroundPreset,
		type QuestionPrintBackgroundPresetId
	} from '$lib/questionPrint/questionPrintBackgrounds';
	import {
		calculateQuestionPrintTextLayoutClient,
		estimateQuestionPrintTextLayout,
		type QuestionPrintTextLayout
	} from '$lib/questionPrint/questionPrintTextLayout';

	const DEFAULT_QUESTION = 'What truth about yourself is getting harder to ignore?';
	const PREVIEW_LAYOUT_WIDTH_FALLBACK = 680;
	const PREVIEW_LAYOUT_MAX_HEIGHT = 280;
	const PREVIEW_LAYOUT_MAX_LINES = 6;
	const PRINT_LAYOUT_WIDTH = 688;
	const PRINT_LAYOUT_MAX_HEIGHT = 280;
	const PRINT_LAYOUT_MAX_LINES = 6;
	const FALLBACK_QR_DARK = '#0f766e';
	const FALLBACK_QR_LIGHT = '#f8fafc';
	const UPLOAD_OPACITY = 0.38;

	let questionText = $state('');
	let customUrl = $state('');
	let uploadedBackgroundImage = $state('');
	let selectedBackgroundPresetId = $state<QuestionPrintBackgroundPresetId>('aurora');
	let backgroundOpacity = $state(getQuestionPrintBackgroundPreset('aurora').suggestedOpacity);
	let qrCodeUrl = $state('');
	let showQuestionUrlOnPoster = $state(true);
	let questionBoxWidth = $state(0);
	let layoutRequest = 0;
	let qrRequest = 0;

	let activeBackgroundPreset = $derived(
		getQuestionPrintBackgroundPreset(selectedBackgroundPresetId)
	);
	let displayQuestionText = $derived(questionText.trim() || DEFAULT_QUESTION);
	let questionUrl = $derived(customUrl.trim());
	let qrTargetUrl = $derived(questionUrl || 'https://9takes.com/questions');
	let showQuestionUrlFooter = $derived(showQuestionUrlOnPoster && Boolean(questionUrl));
	let activeBackgroundLabel = $derived(
		uploadedBackgroundImage ? 'Uploaded image' : activeBackgroundPreset.name
	);
	let backgroundImageCss = $derived(
		uploadedBackgroundImage
			? `url(${JSON.stringify(uploadedBackgroundImage)})`
			: activeBackgroundPreset.backgroundImage
	);

	let previewQuestionLayout = $state<QuestionPrintTextLayout>(
		estimateQuestionPrintTextLayout({
			text: DEFAULT_QUESTION,
			maxWidth: PREVIEW_LAYOUT_WIDTH_FALLBACK,
			maxHeight: PREVIEW_LAYOUT_MAX_HEIGHT,
			maxLines: PREVIEW_LAYOUT_MAX_LINES
		})
	);
	let printQuestionLayout = $state<QuestionPrintTextLayout>(
		estimateQuestionPrintTextLayout({
			text: DEFAULT_QUESTION,
			maxWidth: PRINT_LAYOUT_WIDTH,
			maxHeight: PRINT_LAYOUT_MAX_HEIGHT,
			maxLines: PRINT_LAYOUT_MAX_LINES
		})
	);
	let previewQuestionStyle = $derived(
		`font-size:${previewQuestionLayout.fontSize}px; line-height:${previewQuestionLayout.lineHeight};`
	);

	const escapeHtml = (value: string): string =>
		value
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');

	const renderQuestionLines = (lines: string[]): string =>
		lines.map((line) => `<span>${escapeHtml(line)}</span>`).join('');

	function getThemeColor(property: string, fallback: string): string {
		if (!browser) return fallback;
		const resolved = getComputedStyle(document.documentElement).getPropertyValue(property).trim();
		return resolved || fallback;
	}

	function getQrOptions(): QRCode.QRCodeToDataURLOptions {
		return {
			errorCorrectionLevel: 'H',
			type: 'image/png',
			margin: 1,
			width: 280,
			color: {
				dark: getThemeColor('--primary-dark', FALLBACK_QR_DARK),
				light: getThemeColor('--bg-base', FALLBACK_QR_LIGHT)
			}
		};
	}

	async function ensureQrCodeReady(forceUrl?: string): Promise<string> {
		if (!browser) return qrCodeUrl;

		const requestId = ++qrRequest;
		const nextTarget = forceUrl ?? qrTargetUrl;

		try {
			const nextQrCode = await QRCode.toDataURL(nextTarget, getQrOptions());
			if (requestId === qrRequest) {
				qrCodeUrl = nextQrCode;
			}
			return nextQrCode;
		} catch (error) {
			if (requestId === qrRequest) {
				qrCodeUrl = '';
			}
			console.error('QR Code generation failed:', error);
			return '';
		}
	}

	function selectBackgroundPreset(id: QuestionPrintBackgroundPresetId) {
		const preset = getQuestionPrintBackgroundPreset(id);
		selectedBackgroundPresetId = id;
		uploadedBackgroundImage = '';
		backgroundOpacity = preset.suggestedOpacity;
	}

	function clearUploadedBackground() {
		uploadedBackgroundImage = '';
		backgroundOpacity = activeBackgroundPreset.suggestedOpacity;
	}

	function readFileAsDataUrl(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(String(reader.result ?? ''));
			reader.onerror = () => reject(reader.error);
			reader.readAsDataURL(file);
		});
	}

	async function handleFileInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) {
			return;
		}

		try {
			uploadedBackgroundImage = await readFileAsDataUrl(file);
			backgroundOpacity = UPLOAD_OPACITY;
		} catch (error) {
			console.error('Background image upload failed:', error);
		} finally {
			target.value = '';
		}
	}

	async function openPreview() {
		await ensureQrCodeReady();
		getModal('question-preview')?.open();
	}

	async function printPoster() {
		if (!browser) return;

		const nextQrCodeUrl = await ensureQrCodeReady();
		const printWindow = window.open('', '_blank');

		if (!printWindow) {
			alert('Please allow popups to print the question.');
			return;
		}

		const posterBackground = backgroundImageCss;
		const fullQuestionUrl = escapeHtml(questionUrl);
		const footerMarkup = showQuestionUrlFooter
			? `
								<div class="footer-copy">
									<span class="footer-label">Question URL</span>
									<span class="footer-url">${fullQuestionUrl}</span>
								</div>
							`
			: '';

		printWindow.document.write(`
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<title>9takes Question Poster</title>
			</head>
			<body>
				<div class="print-sheet">
					<div class="poster">
						<div class="poster-background"></div>
						<div class="poster-noise"></div>
						<div class="poster-content">
							<div class="brand">
								<svg width="36" height="36" viewBox="0 0 50 50" aria-hidden="true">
									<rect x="5" y="5" width="16" height="16" rx="2" fill="#0f766e"></rect>
									<rect x="29" y="5" width="16" height="16" rx="2" fill="#f97316"></rect>
									<rect x="5" y="29" width="16" height="16" rx="2" fill="#38bdf8"></rect>
									<rect x="29" y="29" width="16" height="16" rx="2" fill="#fb7185"></rect>
								</svg>
								<svg width="138" height="32" viewBox="0 0 138 32" aria-hidden="true">
									<text
										x="4"
										y="23"
										font-family="Noticia Text, Georgia, serif"
										font-size="26"
										font-weight="700"
										fill="#f8fafc"
									>
										9takes
									</text>
								</svg>
							</div>

							<div class="question-panel">
								<p class="question-label">Prompt</p>
								<h1 class="question-box">${renderQuestionLines(printQuestionLayout.lines)}</h1>
							</div>

							<div class="footer${showQuestionUrlFooter ? '' : ' footer--compact'}">
								${footerMarkup}
								<div class="qr-panel">
									<img src="${nextQrCodeUrl}" alt="QR code for answering the question" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</body>
			</html>
		`);

		const styleElement = printWindow.document.createElement('style');
		styleElement.textContent = `
			@page {
				size: letter;
				margin: 0;
			}

			* {
				box-sizing: border-box;
			}

			body {
				margin: 0;
				background: #dce8ef;
				font-family: Inter, 'Segoe UI', sans-serif;
				color: #10202e;
			}

			.print-sheet {
				width: 8.5in;
				height: 11in;
				padding: 0.38in;
				display: flex;
				align-items: stretch;
				justify-content: center;
			}

			.poster {
				position: relative;
				width: 100%;
				height: 100%;
				overflow: hidden;
				border-radius: 0.32in;
				background: linear-gradient(180deg, #0f1722 0%, #16273a 100%);
				box-shadow: 0 32px 80px rgba(8, 18, 27, 0.24);
				border: 1px solid rgba(255, 255, 255, 0.18);
			}

			.poster::after {
				content: '';
				position: absolute;
				inset: 0;
				background:
					linear-gradient(180deg, rgba(8, 18, 27, 0.12), rgba(8, 18, 27, 0.5)),
					radial-gradient(circle at top, rgba(255, 255, 255, 0.18), transparent 42%);
				pointer-events: none;
			}

			.poster-background {
				position: absolute;
				inset: 0;
				background-image: ${posterBackground};
				background-size: cover;
				background-position: center;
				opacity: ${backgroundOpacity};
			}

			.poster-noise {
				position: absolute;
				inset: 0;
				opacity: 0.07;
				background:
					repeating-linear-gradient(
						0deg,
						rgba(255, 255, 255, 0.16) 0 1px,
						transparent 1px 18px
					),
					repeating-linear-gradient(
						90deg,
						rgba(255, 255, 255, 0.12) 0 1px,
						transparent 1px 24px
					);
			}

			.poster-content {
				position: relative;
				z-index: 1;
				height: 100%;
				padding: 0.46in;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				gap: 0.28in;
			}

			.brand {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 0.18in;
			}

			.brand svg {
				display: block;
			}

			.question-panel {
				margin: auto 0;
				padding: 0.34in;
				border-radius: 0.24in;
				background: rgba(248, 250, 252, 0.9);
				backdrop-filter: blur(16px);
				box-shadow: 0 18px 40px rgba(8, 18, 27, 0.18);
				border: 1px solid rgba(255, 255, 255, 0.6);
			}

			.question-label {
				margin: 0 0 0.12in;
				font-size: 0.12in;
				letter-spacing: 0.12em;
				text-transform: uppercase;
				color: #496174;
				text-align: center;
			}

			.question-box {
				margin: 0;
				text-align: center;
				font-family: 'Noticia Text', Georgia, serif;
				font-size: ${printQuestionLayout.fontSize}px;
				line-height: ${printQuestionLayout.lineHeight};
				font-weight: 700;
				text-transform: uppercase;
				color: #10202e;
			}

			.question-box span {
				display: block;
			}

			.question-box::after {
				content: '';
				display: block;
				width: 0.7in;
				height: 0.04in;
				margin: 0.18in auto 0;
				border-radius: 999px;
				background: #0f766e;
			}

			.footer {
				display: flex;
				align-items: flex-end;
				justify-content: space-between;
				gap: 0.22in;
			}

			.footer--compact {
				justify-content: flex-end;
			}

			.footer-copy {
				flex: 1;
				min-width: 0;
				padding: 0.2in 0.24in;
				border-radius: 0.22in;
				background: rgba(248, 250, 252, 0.9);
				backdrop-filter: blur(16px);
				border: 1px solid rgba(255, 255, 255, 0.55);
			}

			.footer-label {
				display: block;
				font-size: 0.12in;
				letter-spacing: 0.1em;
				text-transform: uppercase;
				color: #496174;
				margin-bottom: 0.06in;
			}

			.footer-url {
				display: block;
				font-size: 0.16in;
				font-weight: 600;
				line-height: 1.3;
				overflow-wrap: anywhere;
				word-break: break-word;
			}

			.qr-panel {
				width: 1.28in;
				height: 1.28in;
				border-radius: 0.22in;
				background: #f8fafc;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0.12in;
				border: 1px solid rgba(255, 255, 255, 0.55);
				box-shadow: 0 14px 32px rgba(8, 18, 27, 0.12);
			}

			.qr-panel img {
				width: 100%;
				height: 100%;
				display: block;
				border-radius: 0.12in;
			}
		`;
		printWindow.document.head.appendChild(styleElement);

		printWindow.document.close();
		printWindow.onload = () => {
			printWindow.focus();
			printWindow.print();
			setTimeout(() => {
				printWindow.close();
			}, 150);
		};
	}

	$effect(() => {
		const previewWidth = questionBoxWidth || PREVIEW_LAYOUT_WIDTH_FALLBACK;
		const fallbackPreviewLayout = estimateQuestionPrintTextLayout({
			text: displayQuestionText,
			maxWidth: previewWidth,
			maxHeight: PREVIEW_LAYOUT_MAX_HEIGHT,
			maxLines: PREVIEW_LAYOUT_MAX_LINES
		});
		const fallbackPrintLayout = estimateQuestionPrintTextLayout({
			text: displayQuestionText,
			maxWidth: PRINT_LAYOUT_WIDTH,
			maxHeight: PRINT_LAYOUT_MAX_HEIGHT,
			maxLines: PRINT_LAYOUT_MAX_LINES
		});

		previewQuestionLayout = fallbackPreviewLayout;
		printQuestionLayout = fallbackPrintLayout;

		if (!browser) {
			return;
		}

		const requestId = ++layoutRequest;
		void Promise.all([
			calculateQuestionPrintTextLayoutClient({
				text: displayQuestionText,
				maxWidth: previewWidth,
				maxHeight: PREVIEW_LAYOUT_MAX_HEIGHT,
				maxLines: PREVIEW_LAYOUT_MAX_LINES
			}),
			calculateQuestionPrintTextLayoutClient({
				text: displayQuestionText,
				maxWidth: PRINT_LAYOUT_WIDTH,
				maxHeight: PRINT_LAYOUT_MAX_HEIGHT,
				maxLines: PRINT_LAYOUT_MAX_LINES
			})
		])
			.then(([nextPreviewLayout, nextPrintLayout]) => {
				if (requestId === layoutRequest) {
					previewQuestionLayout = nextPreviewLayout;
					printQuestionLayout = nextPrintLayout;
				}
			})
			.catch(() => {
				if (requestId === layoutRequest) {
					previewQuestionLayout = fallbackPreviewLayout;
					printQuestionLayout = fallbackPrintLayout;
				}
			});
	});

	$effect(() => {
		if (!browser) {
			return;
		}

		void ensureQrCodeReady();
	});
</script>

{#snippet posterCard()}
	<div class="poster-card">
		<div
			class="poster-card__background"
			style={`background-image:${backgroundImageCss}; opacity:${backgroundOpacity};`}
		></div>
		<div class="poster-card__noise"></div>

		<div class="poster-card__content">
			<div class="brand">
				<Rubix height={50} width={50} svgStyle="margin: 0" />
				<Scribble text="9takes" />
			</div>

			<div class="question-panel">
				<p class="question-panel__label">Prompt</p>
				<h1
					class="question-box"
					style={previewQuestionStyle}
					itemprop="name"
					bind:clientWidth={questionBoxWidth}
				>
					{#each previewQuestionLayout.lines as line}
						<span>{line}</span>
					{/each}
				</h1>
			</div>

			<div class="poster-card__footer" class:poster-card__footer--compact={!showQuestionUrlFooter}>
				{#if showQuestionUrlFooter}
					<div class="poster-card__copy">
						<span class="poster-card__copy-label">Question URL</span>
						<span class="poster-card__copy-url">{questionUrl}</span>
					</div>
				{/if}

				<div class="qr-panel">
					{#if qrCodeUrl}
						<img src={qrCodeUrl} alt="QR code for answering the question" class="qr-image" />
					{:else}
						<div class="qr-image qr-image--placeholder" aria-hidden="true"></div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/snippet}

<div class="question-print-page">
	<header class="page-hero">
		<div>
			<p class="eyebrow">Admin asset generator</p>
			<h1>Create a printable question card</h1>
			<p class="lede">
				The page now keeps a live poster on screen, gives preview its own close button, and includes
				usable built-in backgrounds when you do not upload a custom image.
			</p>
		</div>

		<div class="hero-actions">
			<button class="btn btn-primary" type="button" onclick={openPreview}>Open Preview</button>
			<button class="btn btn-secondary" type="button" onclick={printPoster}>Print Question</button>
		</div>
	</header>

	<div class="workspace">
		<section class="editor-column">
			<div class="panel">
				<div class="panel__header">
					<div>
						<p class="panel__eyebrow">Content</p>
						<h2>Question copy</h2>
					</div>
					<span class="status-pill {questionText.trim() ? '' : 'status-pill--subtle'}">
						{questionText.trim() ? 'Custom text' : 'Default placeholder'}
					</span>
				</div>

				<label class="field" for="question-input">
					<span>Poster question</span>
					<textarea
						id="question-input"
						bind:value={questionText}
						placeholder={DEFAULT_QUESTION}
						rows="5"
					></textarea>
				</label>

				<p class="field-note">
					Leave this empty and the preview falls back to a default prompt so the poster never looks
					broken.
				</p>
			</div>

			<div class="panel">
				<div class="panel__header">
					<div>
						<p class="panel__eyebrow">QR</p>
						<h2>Destination link</h2>
					</div>
				</div>

				<label class="field" for="url-input">
					<span>Question URL</span>
					<input
						id="url-input"
						type="text"
						bind:value={customUrl}
						placeholder="https://9takes.com/questions/why-do-i-overthink"
					/>
				</label>

				<p class="field-note">
					{#if questionUrl}
						QR target: <code>{questionUrl}</code>
					{:else}
						QR target falls back to <code>https://9takes.com/questions</code> until you paste the exact
						public question URL.
					{/if}
				</p>

				<label class="toggle-row" for="show-question-url">
					<span class="toggle-row__copy">
						<strong>Include typed URL on poster</strong>
						<small>Show the exact public question URL next to the QR code for manual entry.</small>
					</span>
					<input id="show-question-url" type="checkbox" bind:checked={showQuestionUrlOnPoster} />
				</label>
			</div>

			<div class="panel">
				<div class="panel__header">
					<div>
						<p class="panel__eyebrow">Background</p>
						<h2>Use an upload or a built-in look</h2>
					</div>
					<span class="status-pill {uploadedBackgroundImage ? '' : 'status-pill--subtle'}">
						{uploadedBackgroundImage ? 'Uploaded image active' : activeBackgroundPreset.name}
					</span>
				</div>

				<div class="upload-row">
					<label class="upload-button" for="question-print-bg-upload">Upload image</label>
					<input
						id="question-print-bg-upload"
						class="sr-only"
						type="file"
						accept="image/*"
						onchange={handleFileInput}
					/>

					{#if uploadedBackgroundImage}
						<button class="text-button" type="button" onclick={clearUploadedBackground}>
							Use preset instead
						</button>
					{/if}
				</div>

				<p class="field-note">
					{#if uploadedBackgroundImage}
						Your upload is active. Select a preset or click “Use preset instead” to remove it.
					{:else}
						No upload required. These built-in looks give the page a clean default state.
					{/if}
				</p>

				<div class="background-grid">
					{#each QUESTION_PRINT_BACKGROUND_PRESETS as preset}
						<button
							type="button"
							class="background-option"
							class:is-selected={!uploadedBackgroundImage &&
								preset.id === selectedBackgroundPresetId}
							style={`--background-preview:${preset.backgroundImage};`}
							onclick={() => selectBackgroundPreset(preset.id)}
						>
							<span class="background-option__swatch" aria-hidden="true"></span>
							<span class="background-option__copy">
								<strong>{preset.name}</strong>
								<small>{preset.description}</small>
							</span>
						</button>
					{/each}
				</div>

				<label class="field" for="opacity-slider">
					<span>Background intensity {Math.round(backgroundOpacity * 100)}%</span>
					<input
						id="opacity-slider"
						type="range"
						min="0.1"
						max="1"
						step="0.02"
						bind:value={backgroundOpacity}
					/>
				</label>
			</div>
		</section>

		<aside class="preview-column">
			<div class="preview-shell">
				<div class="preview-shell__header">
					<div>
						<p class="preview-shell__eyebrow">Live poster</p>
						<h2>{activeBackgroundLabel}</h2>
					</div>

					<button class="btn btn-tertiary" type="button" onclick={openPreview}>Expand</button>
				</div>

				<div class="preview-shell__meta">
					<span>{questionText.trim() ? 'Custom question ready' : 'Default placeholder active'}</span
					>
					<span>{uploadedBackgroundImage ? 'Custom image' : 'Built-in background'}</span>
				</div>

				{@render posterCard()}
			</div>
		</aside>
	</div>
</div>

<Modal id="question-preview" name="Question preview" maxWidth="1120px" fullMobile={true}>
	<div class="modal-preview">
		<h2 class="modal-preview__title">Question preview</h2>
		<div class="modal-preview__toolbar">
			<p>Full-size preview for checking spacing, contrast, and QR placement before printing.</p>
			<button class="btn btn-primary" type="button" onclick={printPoster}>Print Question</button>
		</div>

		<div class="modal-preview__poster">
			{@render posterCard()}
		</div>
	</div>
</Modal>

<style>
	.question-print-page {
		max-width: 1360px;
		margin: 0 auto;
		padding: 2rem;
	}

	.page-hero {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1.5rem;
		padding: 1.75rem;
		margin-bottom: 1.5rem;
		border-radius: 1.5rem;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 22%, transparent);
		background:
			radial-gradient(
				circle at top left,
				color-mix(in srgb, var(--primary) 24%, transparent),
				transparent 42%
			),
			linear-gradient(
				145deg,
				color-mix(in srgb, var(--bg-surface) 90%, white 10%),
				var(--bg-surface)
			);
		box-shadow: 0 20px 60px
			color-mix(in srgb, var(--shadow-color, rgba(15, 23, 42, 0.2)) 60%, transparent);
	}

	.eyebrow,
	.panel__eyebrow,
	.preview-shell__eyebrow {
		margin: 0 0 0.35rem;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.page-hero h1,
	.panel__header h2,
	.preview-shell__header h2 {
		margin: 0;
	}

	.lede {
		max-width: 62ch;
		margin: 0.75rem 0 0;
		color: var(--text-secondary);
		line-height: 1.6;
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.workspace {
		display: grid;
		grid-template-columns: minmax(320px, 440px) minmax(0, 1fr);
		gap: 1.5rem;
		align-items: start;
	}

	.editor-column,
	.preview-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.panel,
	.preview-shell {
		border-radius: 1.25rem;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 20%, transparent);
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--bg-surface) 92%, white 8%),
			color-mix(in srgb, var(--bg-surface) 98%, transparent)
		);
		box-shadow: 0 18px 45px
			color-mix(in srgb, var(--shadow-color, rgba(15, 23, 42, 0.18)) 55%, transparent);
	}

	.panel {
		padding: 1.25rem;
	}

	.panel__header,
	.preview-shell__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		margin-bottom: 1rem;
	}

	.field span {
		font-weight: 600;
		color: var(--text-primary);
	}

	.field textarea,
	.field input[type='text'],
	.field input[type='range'] {
		width: 100%;
	}

	.field textarea,
	.field input[type='text'] {
		padding: 0.85rem 0.95rem;
		border-radius: 0.95rem;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 22%, transparent);
		background: color-mix(in srgb, var(--bg-base) 85%, white 15%);
		color: var(--text-primary);
		font: inherit;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			transform 0.2s ease;
	}

	.field textarea {
		min-height: 8rem;
		resize: vertical;
	}

	.field textarea:focus,
	.field input[type='text']:focus {
		outline: none;
		border-color: color-mix(in srgb, var(--primary) 65%, transparent);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 18%, transparent);
		transform: translateY(-1px);
	}

	.field input[type='range'] {
		accent-color: var(--primary);
	}

	.field-note {
		margin: 0;
		color: var(--text-secondary);
		line-height: 1.55;
	}

	.field-note code {
		font-size: 0.9em;
	}

	.toggle-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.9rem 1rem;
		border-radius: 1rem;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 18%, transparent);
		background: color-mix(in srgb, var(--bg-base) 90%, white 10%);
	}

	.toggle-row__copy {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.toggle-row__copy strong {
		font-size: 0.95rem;
		color: var(--text-primary);
	}

	.toggle-row__copy small {
		color: var(--text-secondary);
		line-height: 1.45;
	}

	.toggle-row input[type='checkbox'] {
		width: 1.15rem;
		height: 1.15rem;
		accent-color: var(--primary);
		flex-shrink: 0;
	}

	.upload-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.upload-button,
	.btn,
	.text-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: none;
		text-decoration: none;
		cursor: pointer;
		font: inherit;
	}

	.upload-button,
	.btn {
		padding: 0.78rem 1.05rem;
		border-radius: 999px;
		font-weight: 700;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			background 0.2s ease;
	}

	.upload-button {
		background: color-mix(in srgb, var(--bg-elevated) 82%, white 18%);
		color: var(--text-primary);
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 18%, transparent);
	}

	.upload-button:hover,
	.btn:hover {
		transform: translateY(-1px);
	}

	.btn-primary {
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--primary) 78%, white 22%),
			color-mix(in srgb, var(--primary-dark) 88%, black 12%)
		);
		color: var(--text-on-primary, #ffffff);
		box-shadow: 0 14px 28px color-mix(in srgb, var(--primary) 26%, transparent);
	}

	.btn-secondary {
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--secondary, #3b82f6) 78%, white 22%),
			color-mix(in srgb, var(--secondary-dark, #2563eb) 88%, black 12%)
		);
		color: var(--text-on-primary, #ffffff);
		box-shadow: 0 14px 28px color-mix(in srgb, var(--secondary, #3b82f6) 24%, transparent);
	}

	.btn-tertiary {
		background: color-mix(in srgb, var(--bg-elevated) 78%, white 22%);
		color: var(--text-primary);
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 18%, transparent);
	}

	.text-button {
		padding: 0;
		background: none;
		color: var(--primary);
		font-weight: 700;
	}

	.status-pill {
		display: inline-flex;
		align-items: center;
		padding: 0.38rem 0.7rem;
		border-radius: 999px;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--text-on-primary, #ffffff);
		background: color-mix(in srgb, var(--primary) 72%, black 8%);
	}

	.status-pill--subtle {
		background: color-mix(in srgb, var(--bg-elevated) 82%, white 18%);
		color: var(--text-secondary);
	}

	.background-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.background-option {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 0.7rem;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 18%, transparent);
		border-radius: 1rem;
		background: color-mix(in srgb, var(--bg-base) 88%, white 12%);
		cursor: pointer;
		text-align: left;
		transition:
			transform 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.background-option:hover {
		transform: translateY(-1px);
		border-color: color-mix(in srgb, var(--primary) 42%, transparent);
	}

	.background-option.is-selected {
		border-color: color-mix(in srgb, var(--primary) 58%, transparent);
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary) 18%, transparent);
	}

	.background-option__swatch {
		display: block;
		aspect-ratio: 4 / 3;
		border-radius: 0.8rem;
		background-image: var(--background-preview);
		background-size: cover;
		background-position: center;
	}

	.background-option__copy {
		display: flex;
		flex-direction: column;
		gap: 0.22rem;
	}

	.background-option__copy strong {
		font-size: 0.95rem;
		color: var(--text-primary);
	}

	.background-option__copy small {
		color: var(--text-secondary);
		line-height: 1.45;
	}

	.preview-column {
		position: sticky;
		top: 1.5rem;
	}

	.preview-shell {
		padding: 1.25rem;
	}

	.preview-shell__meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.preview-shell__meta span {
		display: inline-flex;
		align-items: center;
		padding: 0.35rem 0.65rem;
		border-radius: 999px;
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-secondary);
		background: color-mix(in srgb, var(--bg-elevated) 82%, white 18%);
	}

	.poster-card {
		position: relative;
		width: min(100%, 760px);
		aspect-ratio: 8.5 / 11;
		margin: 0 auto;
		overflow: hidden;
		border-radius: 1.8rem;
		background: linear-gradient(180deg, #0f1722 0%, #16273a 100%);
		border: 1px solid rgba(255, 255, 255, 0.12);
		box-shadow: 0 32px 80px rgba(8, 18, 27, 0.28);
	}

	.poster-card::after {
		content: '';
		position: absolute;
		inset: 0;
		background:
			linear-gradient(180deg, rgba(8, 18, 27, 0.16), rgba(8, 18, 27, 0.52)),
			radial-gradient(circle at top, rgba(255, 255, 255, 0.16), transparent 42%);
		pointer-events: none;
	}

	.poster-card__background,
	.poster-card__noise {
		position: absolute;
		inset: 0;
	}

	.poster-card__background {
		background-size: cover;
		background-position: center;
	}

	.poster-card__noise {
		opacity: 0.08;
		background:
			repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.14) 0 1px, transparent 1px 18px),
			repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0 1px, transparent 1px 24px);
	}

	.poster-card__content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
		padding: clamp(1.2rem, 3vw, 2.2rem);
		gap: clamp(1rem, 2vw, 1.4rem);
	}

	.brand {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.9rem;
		color: #f8fafc;
	}

	.question-panel {
		margin: auto 0;
		padding: clamp(1.35rem, 3vw, 2rem);
		border-radius: 1.5rem;
		background: rgba(248, 250, 252, 0.9);
		backdrop-filter: blur(16px);
		border: 1px solid rgba(255, 255, 255, 0.62);
		box-shadow: 0 18px 40px rgba(8, 18, 27, 0.2);
	}

	.question-panel__label {
		margin: 0 0 0.55rem;
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #496174;
		text-align: center;
	}

	.question-box {
		width: 100%;
		margin: 0;
		padding: 0;
		text-align: center;
		font-weight: 700;
		text-transform: uppercase;
		color: #10202e;
	}

	.question-box span {
		display: block;
	}

	.question-box::after {
		content: '';
		display: block;
		width: 4rem;
		height: 0.24rem;
		margin: 0.85rem auto 0;
		border-radius: 999px;
		background: var(--primary);
	}

	.poster-card__footer {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem;
	}

	.poster-card__footer--compact {
		justify-content: flex-end;
	}

	.poster-card__copy {
		flex: 1;
		min-width: 0;
		padding: 0.95rem 1rem;
		border-radius: 1.2rem;
		background: rgba(248, 250, 252, 0.9);
		backdrop-filter: blur(16px);
		border: 1px solid rgba(255, 255, 255, 0.56);
	}

	.poster-card__copy-label {
		display: block;
		margin-bottom: 0.3rem;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #496174;
	}

	.poster-card__copy-url {
		display: block;
		font-size: 0.94rem;
		font-weight: 600;
		color: #10202e;
		line-height: 1.45;
		overflow-wrap: anywhere;
		word-break: break-word;
	}

	.qr-panel {
		flex-shrink: 0;
		width: clamp(88px, 11vw, 118px);
		height: clamp(88px, 11vw, 118px);
		padding: 0.7rem;
		border-radius: 1.2rem;
		background: #f8fafc;
		border: 1px solid rgba(255, 255, 255, 0.55);
		box-shadow: 0 14px 32px rgba(8, 18, 27, 0.12);
	}

	.qr-image {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 0.7rem;
		background: linear-gradient(135deg, #eef4f8, #d8e7ee);
	}

	.qr-image--placeholder {
		background:
			linear-gradient(
				90deg,
				rgba(15, 118, 110, 0.18) 25%,
				transparent 25% 50%,
				rgba(15, 118, 110, 0.18) 50% 75%,
				transparent 75%
			),
			linear-gradient(
				rgba(15, 118, 110, 0.18) 25%,
				transparent 25% 50%,
				rgba(15, 118, 110, 0.18) 50% 75%,
				transparent 75%
			);
		background-size: 18px 18px;
	}

	.modal-preview {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.modal-preview__title {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-primary);
		line-height: 1.2;
	}

	.modal-preview__toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.modal-preview__toolbar p {
		margin: 0;
		color: var(--text-secondary);
	}

	.modal-preview__poster {
		padding: 0.25rem 0 0.5rem;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@media (max-width: 1024px) {
		.workspace {
			grid-template-columns: 1fr;
		}

		.preview-column {
			position: static;
		}
	}

	@media (max-width: 720px) {
		.question-print-page {
			padding: 1rem;
		}

		.page-hero,
		.panel,
		.preview-shell {
			padding: 1rem;
		}

		.background-grid {
			grid-template-columns: 1fr;
		}

		.poster-card__footer {
			flex-direction: column;
			align-items: stretch;
		}

		.qr-panel {
			align-self: flex-end;
		}
	}
</style>
