<!-- src/routes/admin/asset-generators/poster-generator/+page.svelte -->
<script lang="ts">
	import QRCode from 'qrcode';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// State
	let question = $state('Who do you look up to and why?');
	let questionUrl = $state('https://9takes.com/questions');
	let qrCodeData = $state('');
	let activeTab = $state<'content' | 'style' | 'background' | 'export'>('content');
	let exporting = $state(false);
	let posterRef = $state<HTMLDivElement | null>(null);
	let showQuestionPicker = $state(false);

	// Lazily-loaded modules (not reactive)
	let toPng: any = null;
	let jsPDF: any = null;

	// Format settings
	let posterFormat = $state('instagram');
	const posterFormats = [
		{
			id: 'instagram',
			name: 'Instagram Post',
			width: '1080px',
			height: '1080px',
			pdfWidth: 10.8,
			pdfHeight: 10.8,
			unit: 'in'
		},
		{
			id: 'instagram-story',
			name: 'Instagram Story',
			width: '1080px',
			height: '1920px',
			pdfWidth: 10.8,
			pdfHeight: 19.2,
			unit: 'in'
		},
		{
			id: 'twitter',
			name: 'Twitter/X Post',
			width: '1200px',
			height: '675px',
			pdfWidth: 12,
			pdfHeight: 6.75,
			unit: 'in'
		},
		{
			id: 'letter',
			name: 'Letter (8.5" x 11")',
			width: '8.5in',
			height: '11in',
			pdfWidth: 8.5,
			pdfHeight: 11,
			unit: 'in'
		},
		{
			id: 'square',
			name: 'Square (1:1)',
			width: '800px',
			height: '800px',
			pdfWidth: 8,
			pdfHeight: 8,
			unit: 'in'
		}
	];

	// Style settings
	let activeBackground = $state('greek_pantheon');
	let overlayOpacity = $state(60);
	let overlayColor = $state('#1a1a2e');
	let questionFontSize = $state('text-4xl');
	let questionColor = $state('text-white');
	let showLogo = $state(true);
	let showQrCode = $state(true);
	let textShadow = $state(true);

	// Font options
	const fontSizes = [
		{ id: 'text-2xl', name: 'Small' },
		{ id: 'text-3xl', name: 'Medium' },
		{ id: 'text-4xl', name: 'Large' },
		{ id: 'text-5xl', name: 'Extra Large' }
	];

	// Derived values
	let currentFormat = $derived(
		posterFormats.find((f) => f.id === posterFormat) || posterFormats[0]
	);
	let currentBackground = $derived(
		data.backgrounds.find((bg) => bg.id === activeBackground) || data.backgrounds[0]
	);
	let posterAspectWidth = $derived(parseFloat(currentFormat.width));
	let posterAspectHeight = $derived(parseFloat(currentFormat.height));

	// Generate QR code on URL change
	$effect(() => {
		if (questionUrl) {
			generateQRCode();
		}
	});

	async function generateQRCode() {
		try {
			qrCodeData = await QRCode.toDataURL(questionUrl, {
				errorCorrectionLevel: 'H',
				margin: 1,
				width: 200,
				color: { dark: '#6c5ce7', light: '#ffffff' }
			});
		} catch (err) {
			console.error('Error generating QR code:', err);
		}
	}

	function selectQuestion(q: { id: number; question: string | null; url: string | null }) {
		question = q.question ?? question;
		questionUrl = q.url ? `https://9takes.com/questions/${q.url}` : 'https://9takes.com/questions';
		showQuestionPicker = false;
	}

	function createFilenameFromQuestion() {
		const words = question.trim().split(/\s+/).slice(0, 5);
		const cleanName = words
			.join('-')
			.replace(/[^a-zA-Z0-9-]/g, '')
			.toLowerCase();
		return `9takes-${cleanName || 'poster'}`;
	}

	/** Temporarily expand poster to full export dimensions, capture, then restore. */
	async function captureAtFullSize(pixelRatio = 2): Promise<string> {
		if (!posterRef) throw new Error('No poster ref');
		if (!toPng) {
			const m = await import('html-to-image');
			toPng = m.toPng;
		}
		const saved = posterRef.style.cssText;
		posterRef.style.width = currentFormat.width;
		posterRef.style.height = currentFormat.height;
		posterRef.style.maxWidth = 'none';
		posterRef.style.maxHeight = 'none';
		// Force layout reflow before capture
		posterRef.offsetHeight;
		try {
			return await toPng(posterRef, { quality: 1.0, pixelRatio });
		} finally {
			posterRef.style.cssText = saved;
		}
	}

	async function exportAsPNG() {
		if (!posterRef) return;
		try {
			exporting = true;
			const dataUrl = await captureAtFullSize(2);
			const link = document.createElement('a');
			link.download = `${createFilenameFromQuestion()}.png`;
			link.href = dataUrl;
			link.click();
		} catch (err) {
			console.error('Error exporting PNG:', err);
			alert('Error creating PNG. Please try again.');
		} finally {
			exporting = false;
		}
	}

	async function exportAsPDF() {
		if (!posterRef) return;
		try {
			exporting = true;
			if (!jsPDF) {
				const m = await import('jspdf');
				jsPDF = m.jsPDF;
			}
			const format = currentFormat;
			const dataUrl = await captureAtFullSize(2);
			const pdf = new jsPDF({
				orientation: format.pdfHeight > format.pdfWidth ? 'portrait' : 'landscape',
				unit: format.unit,
				format: [format.pdfWidth, format.pdfHeight]
			});
			pdf.addImage(dataUrl, 'PNG', 0, 0, format.pdfWidth, format.pdfHeight, undefined, 'FAST');
			pdf.save(`${createFilenameFromQuestion()}.pdf`);
		} catch (err) {
			console.error('Error exporting PDF:', err);
			alert('Error creating PDF. Please try again.');
		} finally {
			exporting = false;
		}
	}

	async function copyToClipboard() {
		if (!posterRef) return;
		try {
			exporting = true;
			const dataUrl = await captureAtFullSize(2);
			const blob = await (await fetch(dataUrl)).blob();
			await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
			alert('Copied to clipboard!');
		} catch (err) {
			console.error('Error copying to clipboard:', err);
			alert('Could not copy to clipboard. Try downloading instead.');
		} finally {
			exporting = false;
		}
	}
</script>

<div class="poster-generator">
	<!-- Header -->
	<div class="header">
		<div>
			<h1>Poster Generator</h1>
			<p>Create shareable images for social media</p>
		</div>
		<div class="header-actions">
			<button class="btn btn-secondary" onclick={copyToClipboard} disabled={exporting}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path
						d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
					/></svg
				>
				Copy
			</button>
			<button class="btn btn-primary" onclick={exportAsPNG} disabled={exporting}>
				{#if exporting}
					<svg
						class="animate-spin"
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg
					>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline
							points="7 10 12 15 17 10"
						/><line x1="12" x2="12" y1="15" y2="3" /></svg
					>
				{/if}
				Download PNG
			</button>
		</div>
	</div>

	<div class="main-grid">
		<!-- Left: Controls -->
		<div class="controls-panel">
			<!-- Tabs -->
			<div class="tabs">
				<button
					class="tab"
					class:active={activeTab === 'content'}
					onclick={() => (activeTab = 'content')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						><path
							d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
						/><polyline points="14 2 14 8 20 8" /></svg
					>
					Content
				</button>
				<button
					class="tab"
					class:active={activeTab === 'style'}
					onclick={() => (activeTab = 'style')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle
							cx="8.5"
							cy="7.5"
							r=".5"
						/><circle cx="6.5" cy="12.5" r=".5" /><path
							d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"
						/></svg
					>
					Style
				</button>
				<button
					class="tab"
					class:active={activeTab === 'background'}
					onclick={() => (activeTab = 'background')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle
							cx="9"
							cy="9"
							r="2"
						/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg
					>
					Background
				</button>
				<button
					class="tab"
					class:active={activeTab === 'export'}
					onclick={() => (activeTab = 'export')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline
							points="7 10 12 15 17 10"
						/><line x1="12" x2="12" y1="15" y2="3" /></svg
					>
					Export
				</button>
			</div>

			<!-- Tab Content -->
			<div class="tab-content">
				{#if activeTab === 'content'}
					<div class="section">
						<label class="label" for="poster-question-text">Question Text</label>
						<textarea
							id="poster-question-text"
							bind:value={question}
							class="input textarea"
							rows="3"
							placeholder="Enter your question..."
						></textarea>

						{#if data.questions && data.questions.length > 0}
							<button
								class="btn btn-ghost mt-2"
								onclick={() => (showQuestionPicker = !showQuestionPicker)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
								>
								{showQuestionPicker ? 'Hide' : 'Pick from recent questions'}
							</button>

							{#if showQuestionPicker}
								<div class="question-picker">
									{#each data.questions as q}
										<button class="question-item" onclick={() => selectQuestion(q)}>
											{q.question}
										</button>
									{/each}
								</div>
							{/if}
						{/if}
					</div>

					<div class="section">
						<label class="label" for="poster-question-url">QR Code URL</label>
						<input
							id="poster-question-url"
							type="url"
							bind:value={questionUrl}
							class="input"
							placeholder="https://9takes.com/questions/..."
						/>
					</div>

					<div class="section">
						<label class="label" for="poster-format">Poster Size</label>
						<select id="poster-format" bind:value={posterFormat} class="input">
							{#each posterFormats as format}
								<option value={format.id}>{format.name}</option>
							{/each}
						</select>
					</div>
				{/if}

				{#if activeTab === 'style'}
					<div class="section">
						<label class="label" for="poster-question-font-size">Question Font Size</label>
						<select id="poster-question-font-size" bind:value={questionFontSize} class="input">
							{#each fontSizes as size}
								<option value={size.id}>{size.name}</option>
							{/each}
						</select>
					</div>

					<div class="section">
						<p class="label">Text Color</p>
						<div class="color-options">
							<button
								class="color-btn"
								class:active={questionColor === 'text-white'}
								onclick={() => (questionColor = 'text-white')}
								style="background: white; border: 1px solid #ccc;"
								aria-label="White text"
							></button>
							<button
								class="color-btn"
								class:active={questionColor === 'text-neutral-900'}
								onclick={() => (questionColor = 'text-neutral-900')}
								style="background: #171717;"
								aria-label="Dark text"
							></button>
							<button
								class="color-btn"
								class:active={questionColor === 'text-primary-200'}
								onclick={() => (questionColor = 'text-primary-200')}
								style="background: #c4b5fd;"
								aria-label="Purple text"
							></button>
						</div>
					</div>

					<div class="section">
						<label class="toggle-label">
							<input type="checkbox" bind:checked={textShadow} />
							<span>Text Shadow</span>
						</label>
					</div>

					<div class="section">
						<label class="toggle-label">
							<input type="checkbox" bind:checked={showLogo} />
							<span>Show Logo</span>
						</label>
					</div>

					<div class="section">
						<label class="toggle-label">
							<input type="checkbox" bind:checked={showQrCode} />
							<span>Show QR Code</span>
						</label>
					</div>
				{/if}

				{#if activeTab === 'background'}
					<div class="section">
						<p class="label">Background Image</p>
						<div class="bg-grid">
							{#each data.backgrounds as bg}
								<button
									class="bg-option"
									class:active={activeBackground === bg.id}
									onclick={() => (activeBackground = bg.id)}
								>
									<img src={bg.path} alt={bg.name} />
									<span>{bg.name}</span>
								</button>
							{/each}
						</div>
					</div>

					<div class="section">
						<label class="label" for="poster-overlay-opacity"
							>Overlay Opacity: {overlayOpacity}%</label
						>
						<input
							id="poster-overlay-opacity"
							type="range"
							bind:value={overlayOpacity}
							min="0"
							max="90"
							class="range"
						/>
					</div>

					<div class="section">
						<label class="label" for="poster-overlay-color">Overlay Color</label>
						<div class="color-picker-row">
							<input
								id="poster-overlay-color"
								type="color"
								bind:value={overlayColor}
								class="color-picker"
							/>
							<span class="color-value">{overlayColor}</span>
						</div>
					</div>
				{/if}

				{#if activeTab === 'export'}
					<div class="section">
						<p class="label">Export Format</p>
						<p class="hint">Choose your preferred download format.</p>
					</div>

					<div class="export-buttons">
						<button class="export-btn" onclick={exportAsPNG} disabled={exporting}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle
									cx="9"
									cy="9"
									r="2"
								/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg
							>
							<span class="export-btn-title">PNG Image</span>
							<span class="export-btn-desc">Best for social media</span>
						</button>

						<button class="export-btn" onclick={exportAsPDF} disabled={exporting}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								><path
									d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
								/><polyline points="14 2 14 8 20 8" /></svg
							>
							<span class="export-btn-title">PDF Document</span>
							<span class="export-btn-desc">Best for printing</span>
						</button>

						<button class="export-btn" onclick={copyToClipboard} disabled={exporting}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path
									d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
								/></svg
							>
							<span class="export-btn-title">Copy to Clipboard</span>
							<span class="export-btn-desc">Paste directly</span>
						</button>
					</div>

					<div class="tips">
						<h4>Tips</h4>
						<ul>
							<li>PNG is ideal for Instagram, Twitter, and Facebook</li>
							<li>PDF maintains quality for large prints</li>
							<li>Copy to clipboard for quick sharing</li>
						</ul>
					</div>
				{/if}
			</div>
		</div>

		<!-- Right: Preview -->
		<div class="preview-panel">
			<div class="preview-header">
				<span class="preview-label">Preview</span>
				<span class="format-badge">{currentFormat.name}</span>
			</div>

			<div class="preview-container">
				<div
					bind:this={posterRef}
					class="poster"
					style="aspect-ratio: {posterAspectWidth} / {posterAspectHeight};"
				>
					<!-- Background Image -->
					<div class="poster-bg" style="background-image: url({currentBackground?.path});"></div>

					<!-- Overlay -->
					<div
						class="poster-overlay"
						style="background: {overlayColor}; opacity: {overlayOpacity / 100};"
					></div>

					<!-- Content -->
					<div class="poster-content">
						<!-- Logo -->
						{#if showLogo}
							<div class="poster-logo">
								<img src="/brand/nimbus.png" alt="9takes" class="logo-img" />
								<span class="logo-text">9takes</span>
							</div>
						{/if}

						<!-- Question -->
						<div class="poster-question">
							<h2
								class="{questionFontSize} {questionColor} text-center font-bold leading-tight"
								class:drop-shadow-lg={textShadow}
							>
								{question}
							</h2>
						</div>

						<!-- Footer -->
						<div class="poster-footer">
							{#if showQrCode && qrCodeData}
								<div class="qr-box">
									<span class="qr-label">Scan to answer</span>
									<img src={qrCodeData} alt="QR Code" class="qr-img" />
								</div>
							{/if}
							<div class="cta-box">
								<p class="cta-text">Share your perspective</p>
								<p class="cta-url">9takes.com</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.poster-generator {
		width: 100%;
		max-width: 100%;
		overflow: hidden;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;

		h1 {
			font-size: 1.5rem;
			font-weight: 700;
			background: linear-gradient(135deg, var(--shadow-monarch-light), var(--awakening-cyan));
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
			margin: 0;
		}

		p {
			font-size: 0.875rem;
			color: var(--text-secondary);
			margin: 0.25rem 0 0;
		}
	}

	.header-actions {
		display: flex;
		gap: 0.75rem;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		border: none;

		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}

		svg {
			flex-shrink: 0;
		}
	}

	.btn-primary {
		background: linear-gradient(135deg, var(--shadow-monarch) 0%, var(--shadow-monarch-dark) 100%);
		color: var(--text-on-primary);
		border: 1px solid var(--shadow-monarch);
		box-shadow: var(--glow-sm);

		&:hover:not(:disabled) {
			background: linear-gradient(
				135deg,
				var(--shadow-monarch-light) 0%,
				var(--shadow-monarch) 100%
			);
			box-shadow: var(--glow-md);
			transform: translateY(-1px);
		}
	}

	.btn-secondary {
		background: transparent;
		color: var(--shadow-monarch-light);
		border: 1px solid var(--shadow-monarch);

		&:hover:not(:disabled) {
			background: var(--shadow-monarch-subtle);
			box-shadow: var(--glow-sm);
		}
	}

	.btn-ghost {
		background: transparent;
		color: var(--shadow-monarch-light);
		padding: 0.5rem;

		&:hover {
			background: var(--shadow-monarch-subtle);
		}
	}

	.main-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;

		@media (min-width: 1024px) {
			grid-template-columns: 380px 1fr;
		}

		// Prevent grid children from overflowing
		> * {
			min-width: 0;
		}
	}

	.controls-panel {
		background: var(--void-surface);
		border-radius: 0.75rem;
		border: 1px solid var(--void-elevated);
		box-shadow: var(--shadow-md);
		overflow: hidden;
	}

	.tabs {
		display: flex;
		border-bottom: 1px solid var(--void-highlight);
		overflow-x: auto;
	}

	.tab {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.375rem;
		padding: 0.875rem 0.5rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--text-secondary);
		background: none;
		border: none;
		cursor: pointer;
		transition: all 0.2s;
		border-bottom: 2px solid transparent;
		white-space: nowrap;

		&:hover {
			color: var(--text-primary);
			background: var(--void-elevated);
		}

		&.active {
			color: var(--shadow-monarch-light);
			border-bottom-color: var(--shadow-monarch);
			box-shadow: 0 0 10px var(--shadow-monarch-glow);
		}

		svg {
			flex-shrink: 0;
		}
	}

	.tab-content {
		padding: 1.25rem;
	}

	.section {
		margin-bottom: 1.25rem;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.label {
		display: block;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--text-secondary);
		margin-bottom: 0.5rem;
	}

	.hint {
		font-size: 0.75rem;
		color: var(--text-tertiary);
		margin: 0;
	}

	.input {
		width: 100%;
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--void-highlight);
		border-radius: 0.5rem;
		font-size: 0.875rem;
		color: var(--text-primary);
		background: var(--void-elevated);
		transition:
			border-color 0.2s,
			box-shadow 0.2s;

		&::placeholder {
			color: var(--text-muted);
		}

		&:focus {
			outline: none;
			border-color: var(--shadow-monarch);
			box-shadow: var(--glow-sm);
		}
	}

	.textarea {
		resize: vertical;
		min-height: 80px;
	}

	.question-picker {
		margin-top: 0.75rem;
		max-height: 200px;
		overflow-y: auto;
		border: 1px solid var(--void-highlight);
		border-radius: 0.5rem;
	}

	.question-item {
		width: 100%;
		padding: 0.625rem 0.75rem;
		text-align: left;
		font-size: 0.8125rem;
		color: var(--text-secondary);
		background: none;
		border: none;
		border-bottom: 1px solid var(--void-highlight);
		cursor: pointer;
		transition: background 0.15s;

		&:last-child {
			border-bottom: none;
		}

		&:hover {
			background: var(--void-elevated);
		}
	}

	.color-options {
		display: flex;
		gap: 0.5rem;
	}

	.color-btn {
		width: 2rem;
		height: 2rem;
		border-radius: 0.375rem;
		border: 2px solid transparent;
		cursor: pointer;
		transition:
			transform 0.15s,
			border-color 0.15s;

		&:hover {
			transform: scale(1.1);
		}

		&.active {
			border-color: var(--shadow-monarch);
		}
	}

	.toggle-label {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		cursor: pointer;
		font-size: 0.875rem;
		color: var(--text-secondary);

		input[type='checkbox'] {
			width: 1rem;
			height: 1rem;
			accent-color: var(--shadow-monarch);
		}
	}

	.bg-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.625rem;
	}

	.bg-option {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.5rem;
		border: 2px solid var(--void-highlight);
		border-radius: 0.5rem;
		background: var(--void-elevated);
		cursor: pointer;
		transition: all 0.2s;

		&:hover {
			border-color: var(--shadow-monarch-lighter);
			box-shadow: var(--glow-sm);
		}

		&.active {
			border-color: var(--shadow-monarch);
			background: var(--shadow-monarch-subtle);
			box-shadow: var(--glow-sm);
		}

		img {
			width: 100%;
			height: 3.5rem;
			object-fit: cover;
			border-radius: 0.25rem;
		}

		span {
			margin-top: 0.375rem;
			font-size: 0.6875rem;
			color: var(--text-tertiary);
		}
	}

	.range {
		width: 100%;
		height: 0.375rem;
		border-radius: 0.25rem;
		background: var(--void-highlight);
		appearance: none;
		cursor: pointer;

		&::-webkit-slider-thumb {
			appearance: none;
			width: 1rem;
			height: 1rem;
			border-radius: 50%;
			background: var(--shadow-monarch);
			cursor: pointer;
		}
	}

	.color-picker-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.color-picker {
		width: 3rem;
		height: 2rem;
		border: 1px solid var(--void-highlight);
		border-radius: 0.375rem;
		cursor: pointer;
	}

	.color-value {
		font-size: 0.8125rem;
		color: var(--text-tertiary);
		font-family: monospace;
	}

	.export-buttons {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.25rem;
	}

	.export-btn {
		display: flex;
		align-items: center;
		gap: 0.875rem;
		padding: 1rem;
		border: 1px solid var(--void-elevated);
		border-radius: 0.625rem;
		background: var(--void-surface);
		cursor: pointer;
		text-align: left;
		transition: all 0.2s;

		&:hover:not(:disabled) {
			border-color: var(--shadow-monarch);
			background: var(--shadow-monarch-subtle);
			box-shadow: var(--glow-sm);
			transform: translateY(-2px);
		}

		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}

		svg {
			color: var(--shadow-monarch-light);
			flex-shrink: 0;
		}
	}

	.export-btn-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
		display: block;
	}

	.export-btn-desc {
		font-size: 0.75rem;
		color: var(--text-tertiary);
	}

	.tips {
		padding: 1rem;
		background: var(--void-elevated);
		border-radius: 0.5rem;

		h4 {
			font-size: 0.8125rem;
			font-weight: 600;
			color: var(--text-secondary);
			margin: 0 0 0.5rem;
		}

		ul {
			margin: 0;
			padding-left: 1.25rem;
		}

		li {
			font-size: 0.75rem;
			color: var(--text-tertiary);
			margin-bottom: 0.25rem;
		}
	}

	.preview-panel {
		background: var(--void-surface);
		border-radius: 0.75rem;
		border: 1px solid var(--void-elevated);
		box-shadow: var(--shadow-md);
		padding: 1rem;
	}

	.preview-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.preview-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.format-badge {
		font-size: 0.75rem;
		padding: 0.25rem 0.625rem;
		background: rgba(124, 58, 237, 0.15);
		border: 1px solid rgba(124, 58, 237, 0.3);
		color: var(--shadow-monarch-lighter);
		border-radius: 1rem;
	}

	.preview-container {
		display: flex;
		justify-content: center;
		align-items: center;
		background: var(--void-abyss);
		border-radius: 0.5rem;
		padding: 1.5rem;
		min-height: 300px;
		overflow: hidden;
	}

	.poster {
		position: relative;
		display: flex;
		flex-direction: column;
		border-radius: 0.375rem;
		overflow: hidden;
		box-shadow:
			0 10px 40px -10px rgba(0, 0, 0, 0.5),
			0 0 20px var(--shadow-monarch-glow);
		width: 100%;
		max-width: 500px;
		max-height: 70vh;
	}

	.poster-bg {
		position: absolute;
		inset: 0;
		background-size: cover;
		background-position: center;
	}

	.poster-overlay {
		position: absolute;
		inset: 0;
	}

	.poster-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
		padding: 2rem;
	}

	.poster-logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.logo-img {
		height: 3rem;
		width: auto;
	}

	.logo-text {
		font-size: 1.5rem;
		font-weight: 700;
		color: white;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.poster-question {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 0;

		h2 {
			max-width: 90%;
		}
	}

	.poster-footer {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1rem;
	}

	.qr-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: white;
		padding: 0.75rem;
		border-radius: 0.5rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.qr-label {
		font-size: 0.6875rem;
		font-weight: 600;
		color: var(--shadow-monarch);
		margin-bottom: 0.375rem;
	}

	.qr-img {
		width: 5rem;
		height: 5rem;
		image-rendering: pixelated;
	}

	.cta-box {
		background: rgba(0, 0, 0, 0.7);
		padding: 0.875rem 1.25rem;
		border-radius: 0.5rem;
		text-align: right;
	}

	.cta-text {
		font-size: 0.9375rem;
		color: white;
		margin: 0 0 0.25rem;
	}

	.cta-url {
		font-size: 1.125rem;
		font-weight: 700;
		color: white;
		margin: 0;
	}

	.mt-2 {
		margin-top: 0.5rem;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.animate-spin {
		animation: spin 1s linear infinite;
	}

	@media (max-width: 640px) {
		.header {
			flex-direction: column;
			align-items: flex-start;
		}

		.tab {
			padding: 0.75rem 0.25rem;
			font-size: 0.75rem;

			svg {
				display: none;
			}
		}

		.poster {
			max-width: 100%;
		}

		.poster-content {
			padding: 1rem;
		}

		.logo-img {
			height: 2rem;
		}

		.logo-text {
			font-size: 1.125rem;
		}

		.qr-img {
			width: 3.5rem;
			height: 3.5rem;
		}
	}
</style>
