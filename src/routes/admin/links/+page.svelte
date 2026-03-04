<!-- src/routes/admin/links/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import QRCode from 'qrcode';
	import LinkMap from '$lib/components/molecules/LinkMap.svelte';

	let { data }: { data: PageData } = $props();

	const opts = {
		errorCorrectionLevel: 'H',
		type: 'image/jpeg',
		quality: 0.7,
		margin: 1,
		color: {
			dark: '#000000',
			light: '#ffffff'
		}
	};

	let numberOfQRCodes = $state(12);
	let qrCodes = $state<{ id: string; url: string }[]>([]);
	let showPrintView = $state(false);

	let linkDropCount = $derived(data?.linkDrops?.length || 0);

	function generateQRCodes() {
		qrCodes = [];
		for (let i = 0; i < numberOfQRCodes; i++) {
			const uuid = crypto.randomUUID();
			const linkUrl = `https://9takes.com/links/${uuid}`;
			QRCode.toDataURL(linkUrl, opts, function (err, dataUrl) {
				if (err) {
					console.error('QR generation error:', err);
					return;
				}
				qrCodes = [...qrCodes, { id: uuid.slice(0, 8), url: dataUrl }];
			});
		}
	}

	onMount(() => {
		generateQRCodes();
	});

	function regenerateQRCodes() {
		generateQRCodes();
	}
</script>

<div class="page-header">
	<div class="header-content">
		<h1>Link Management</h1>
		<p class="subtitle">Generate QR codes and manage link drops</p>
	</div>
	<div class="header-stats">
		<div class="stat-pill">
			<span class="stat-value">{qrCodes.length}</span>
			<span class="stat-label">QR Codes</span>
		</div>
		<div class="stat-pill">
			<span class="stat-value">{linkDropCount}</span>
			<span class="stat-label">Link Drops</span>
		</div>
	</div>
</div>

<!-- QR Code Generator Section -->
<section class="section-card">
	<div class="section-header">
		<h2>QR Code Generator</h2>
		<div class="section-actions">
			<label class="count-control">
				<span>Count:</span>
				<input type="number" bind:value={numberOfQRCodes} min="1" max="50" />
			</label>
			<button class="btn btn-secondary" onclick={regenerateQRCodes}>Regenerate</button>
			<button class="btn btn-primary" onclick={() => (showPrintView = !showPrintView)}>
				{showPrintView ? 'Grid View' : 'Print View'}
			</button>
		</div>
	</div>

	{#if qrCodes.length === 0}
		<div class="loading-state">
			<div class="spinner"></div>
			<p>Generating QR codes...</p>
		</div>
	{:else if showPrintView}
		<div class="print-grid">
			{#each qrCodes as qr}
				<div class="print-item">
					<img src={qr.url} alt="QR code {qr.id}" />
					<span class="brand-label">9takes</span>
				</div>
			{/each}
		</div>
	{:else}
		<div class="qr-grid">
			{#each qrCodes as qr}
				<div class="qr-card">
					<img src={qr.url} alt="QR code {qr.id}" />
					<div class="qr-info">
						<span class="qr-id">{qr.id}</span>
						<span class="brand">9takes.com</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>

<!-- Link Map Section -->
<section class="section-card">
	<div class="section-header">
		<h2>Link Drop Locations</h2>
		<span class="badge">{linkDropCount} locations</span>
	</div>
	<div class="map-container">
		<LinkMap linkDrops={data?.linkDrops} />
	</div>
</section>

<style lang="scss">
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.header-content h1 {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--text-primary);
		margin: 0 0 0.5rem 0;
	}

	.subtitle {
		color: var(--text-secondary);
		font-size: 0.9rem;
		margin: 0;
	}

	.header-stats {
		display: flex;
		gap: 0.75rem;
	}

	.stat-pill {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.625rem 1rem;
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		min-width: 90px;
	}

	.stat-value {
		font-size: 1.375rem;
		font-weight: 700;
		color: var(--shadow-monarch);
	}

	.stat-label {
		font-size: 0.65rem;
		font-weight: 500;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.section-card {
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		padding: 1.25rem;
		margin-bottom: 1.25rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.25rem;
		flex-wrap: wrap;
		gap: 0.75rem;

		h2 {
			font-size: 1.1rem;
			font-weight: 600;
			color: var(--text-primary);
			margin: 0;
		}
	}

	.section-actions {
		display: flex;
		gap: 0.625rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.count-control {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.8rem;
		color: var(--text-secondary);

		input {
			width: 56px;
			padding: 0.3rem 0.4rem;
			border: 1px solid var(--void-elevated);
			border-radius: 6px;
			font-size: 0.8rem;
			background: var(--void-deep);
			color: var(--text-primary);
		}
	}

	.btn {
		padding: 0.4rem 0.875rem;
		font-size: 0.8rem;
		font-weight: 500;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-primary {
		background: var(--shadow-monarch);
		color: white;

		&:hover {
			opacity: 0.85;
		}
	}

	.btn-secondary {
		background: var(--void-elevated);
		color: var(--text-primary);

		&:hover {
			background: var(--void-deep);
		}
	}

	.badge {
		padding: 0.2rem 0.625rem;
		font-size: 0.7rem;
		font-weight: 500;
		background: rgba(139, 92, 246, 0.1);
		color: var(--shadow-monarch);
		border-radius: 20px;
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2.5rem;
		color: var(--text-secondary);
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid var(--void-elevated);
		border-top-color: var(--shadow-monarch);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
		margin-bottom: 0.75rem;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.qr-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
		gap: 0.75rem;
	}

	.qr-card {
		background: var(--void-deep);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		padding: 0.875rem;
		text-align: center;
		transition: all 0.15s ease;

		&:hover {
			border-color: var(--shadow-monarch);
			box-shadow: var(--glow-sm);
		}

		img {
			width: 100%;
			max-width: 100px;
			height: auto;
			border-radius: 8px;
			margin-bottom: 0.375rem;
		}
	}

	.qr-info {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.qr-id {
		font-size: 0.65rem;
		font-family: monospace;
		color: var(--text-secondary);
	}

	.brand {
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--shadow-monarch);
	}

	/* Print view for cutting */
	.print-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 4px;
	}

	.print-item {
		position: relative;
		border: 1px dashed var(--void-elevated);
		padding: 4px;
		text-align: center;

		img {
			width: 100%;
			max-width: 80px;
			height: auto;
		}
	}

	.brand-label {
		display: block;
		font-size: 0.6rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-top: 2px;
	}

	.map-container {
		min-height: 400px;
		border-radius: 12px;
		overflow: hidden;
	}

	@media (max-width: 768px) {
		.page-header {
			flex-direction: column;
		}

		.header-stats {
			width: 100%;
		}

		.stat-pill {
			flex: 1;
		}

		.section-actions {
			width: 100%;
			justify-content: flex-start;
		}

		.qr-grid {
			grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		}

		.print-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media print {
		.page-header,
		.section-header,
		.map-container {
			display: none;
		}

		.section-card {
			border: none;
			padding: 0;
		}

		.print-grid {
			grid-template-columns: repeat(6, 1fr);
		}

		.print-item {
			border: 1px solid #000;
		}
	}
</style>
