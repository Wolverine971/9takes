<!-- src/routes/admin/links/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import QRCode from 'qrcode';
	import LinkMap from '$lib/components/molecules/LinkMap.svelte';

	export let data: PageData;

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

	let numberOfQRCodes = 12;
	let qrCodes: { id: string; url: string }[] = [];
	let showPrintView = false;

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

	$: linkDropCount = data?.linkDrops?.length || 0;
</script>

<div class="links-page">
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
				<button class="btn btn-secondary" on:click={regenerateQRCodes}> Regenerate </button>
				<button class="btn btn-primary" on:click={() => (showPrintView = !showPrintView)}>
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
</div>

<style>
	.links-page {
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		gap: 1.5rem;
	}

	.header-content h1 {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--text-primary, #1e293b);
		margin: 0 0 0.5rem 0;
	}

	.subtitle {
		color: var(--text-secondary, #64748b);
		font-size: 0.95rem;
		margin: 0;
	}

	.header-stats {
		display: flex;
		gap: 1rem;
	}

	.stat-pill {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.75rem 1.25rem;
		background: var(--card-background, #fff);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 12px;
		min-width: 100px;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--primary, #6366f1);
	}

	.stat-label {
		font-size: 0.7rem;
		font-weight: 500;
		color: var(--text-secondary, #64748b);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.section-card {
		background: var(--card-background, #fff);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 16px;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.section-header h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary, #1e293b);
		margin: 0;
	}

	.section-actions {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.count-control {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--text-secondary, #64748b);
	}

	.count-control input {
		width: 60px;
		padding: 0.375rem 0.5rem;
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 6px;
		font-size: 0.875rem;
	}

	.btn {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-primary {
		background: var(--primary, #6366f1);
		color: white;
	}

	.btn-primary:hover {
		background: #4f46e5;
	}

	.btn-secondary {
		background: var(--border-color, #e2e8f0);
		color: var(--text-primary, #1e293b);
	}

	.btn-secondary:hover {
		background: #cbd5e1;
	}

	.badge {
		padding: 0.25rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 500;
		background: rgba(99, 102, 241, 0.1);
		color: var(--primary, #6366f1);
		border-radius: 20px;
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 3rem;
		color: var(--text-secondary, #64748b);
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid var(--border-color, #e2e8f0);
		border-top-color: var(--primary, #6366f1);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.qr-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 1rem;
	}

	.qr-card {
		background: #f8fafc;
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 12px;
		padding: 1rem;
		text-align: center;
		transition: all 0.2s ease;
	}

	.qr-card:hover {
		border-color: var(--primary, #6366f1);
		box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
	}

	.qr-card img {
		width: 100%;
		max-width: 100px;
		height: auto;
		border-radius: 8px;
		margin-bottom: 0.5rem;
	}

	.qr-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.qr-id {
		font-size: 0.7rem;
		font-family: monospace;
		color: var(--text-secondary, #64748b);
	}

	.brand {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--primary, #6366f1);
	}

	/* Print view for cutting */
	.print-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 4px;
	}

	.print-item {
		position: relative;
		border: 1px dashed #ccc;
		padding: 4px;
		text-align: center;
	}

	.print-item img {
		width: 100%;
		max-width: 80px;
		height: auto;
	}

	.brand-label {
		display: block;
		font-size: 0.6rem;
		font-weight: 700;
		color: #1e293b;
		margin-top: 2px;
	}

	.map-container {
		min-height: 400px;
		border-radius: 12px;
		overflow: hidden;
	}

	@media (max-width: 768px) {
		.links-page {
			padding: 1rem;
		}

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
