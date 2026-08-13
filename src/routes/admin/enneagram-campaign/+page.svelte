<script lang="ts">
	import HtmlPreviewFrame from '$lib/components/admin/HtmlPreviewFrame.svelte';
	import type { EnneagramCampaignStatus } from '$lib/server/enneagramCampaignAudience';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let selectedStatus = $state<'all' | EnneagramCampaignStatus>('ready');

	const filters: Array<{ value: 'all' | EnneagramCampaignStatus; label: string }> = [
		{ value: 'ready', label: 'Ready now' },
		{ value: 'active_sequence', label: 'In another sequence' },
		{ value: 'recent_email', label: 'Emailed in last 7 days' },
		{ value: 'recent', label: 'Brand-new accounts' },
		{ value: 'unconfirmed', label: 'Unconfirmed' },
		{ value: 'suppressed', label: 'Suppressed' },
		{ value: 'admin', label: 'Admins' },
		{ value: 'invalid_email', label: 'Invalid email' },
		{ value: 'duplicate_email', label: 'Duplicate email' },
		{ value: 'all', label: 'All missing-type profiles' }
	];

	let visibleRows = $derived(
		selectedStatus === 'all'
			? data.audience.rows
			: data.audience.rows.filter((row) => row.status === selectedStatus)
	);

	function formatDate(value: string | null): string {
		if (!value) return 'Unknown';
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return 'Unknown';
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		}).format(date);
	}
</script>

<svelte:head>
	<title>Enneagram Type Campaign | Admin</title>
</svelte:head>

<div class="page-shell">
	<header class="page-header">
		<div>
			<p class="eyebrow">Admin / Reach</p>
			<h1>Enneagram Type Campaign</h1>
			<p class="subtitle">
				A one-email invitation for registered users who have not added a valid Enneagram type.
			</p>
		</div>
		<a class="back-link" href="/admin/email-dashboard">Email dashboard</a>
	</header>

	<section class="safety-banner" aria-label="Campaign safety status">
		<div>
			<span class="status-dot"></span>
			<strong>{data.sequence?.status === 'draft' ? 'Draft locked' : 'Not sendable'}</strong>
		</div>
		<p>
			This page is read-only and has no enrollment, scheduling, or send action. Before any future
			delivery, the system re-checks the live Enneagram type and requires seven full days since the
			recipient’s last sent email.
			{#if data.sequence?.status}
				The sequence is currently <strong>{data.sequence.status}</strong>.
			{:else}
				The draft sequence will appear after its database migration is applied.
			{/if}
		</p>
	</section>

	<section class="metric-grid" aria-label="Audience summary">
		<article class="metric primary">
			<span>Eligible to send</span>
			<strong>{data.audience.counts.ready}</strong>
			<small>live type missing and seven-day email buffer clear</small>
		</article>
		<article class="metric">
			<span>Missing a type</span>
			<strong>{data.audience.totalMissingType}</strong>
			<small>stored value is not 1–9</small>
		</article>
		<article class="metric">
			<span>Held back</span>
			<strong>{data.audience.totalHeld}</strong>
			<small>kept out by campaign safety rules</small>
		</article>
		<article class="metric">
			<span>Already typed</span>
			<strong>{data.audience.totalWithType}</strong>
			<small>excluded from this campaign</small>
		</article>
	</section>

	<section class="content-grid">
		<div class="panel audience-panel">
			<div class="panel-heading">
				<div>
					<p class="section-kicker">Dynamic audience</p>
					<h2>{visibleRows.length} profiles</h2>
				</div>
				<label>
					<span>View</span>
					<select bind:value={selectedStatus}>
						{#each filters as filter (filter.value)}
							<option value={filter.value}>{filter.label}</option>
						{/each}
					</select>
				</label>
			</div>

			<div class="hold-breakdown">
				<span>Suppressed <strong>{data.audience.counts.suppressed}</strong></span>
				<span>Unconfirmed <strong>{data.audience.counts.unconfirmed}</strong></span>
				<span>Other sequence <strong>{data.audience.counts.active_sequence}</strong></span>
				<span>Recent email <strong>{data.audience.counts.recent_email}</strong></span>
				<span>New <strong>{data.audience.counts.recent}</strong></span>
				<span>Admins <strong>{data.audience.counts.admin}</strong></span>
			</div>

			<div class="table-wrap">
				<table>
					<thead>
						<tr>
							<th>Recipient</th>
							<th>Joined</th>
							<th>Last email</th>
							<th>Stored type</th>
							<th>Campaign state</th>
						</tr>
					</thead>
					<tbody>
						{#each visibleRows as row (row.id)}
							<tr>
								<td>
									<strong>{row.name}</strong>
									<span>{row.email || 'No valid email'}</span>
								</td>
								<td>{formatDate(row.createdAt)}</td>
								<td>{row.lastEmailSentAt ? formatDate(row.lastEmailSentAt) : 'Buffer clear'}</td>
								<td><code>{row.storedEnneagram || 'empty'}</code></td>
								<td><span class="pill status-{row.status}">{row.statusLabel}</span></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<aside class="panel preview-panel">
			<p class="section-kicker">Email 1 of 1</p>
			<h2>{data.campaign.subject}</h2>
			<p class="preheader">{data.campaign.preheader}</p>
			<HtmlPreviewFrame html={data.previewHtml} title="Enneagram type campaign email preview" />
			<div class="copy-notes">
				<strong>Message architecture</strong>
				<ol>
					<li>Notice the missing profile type without shaming the reader.</li>
					<li>Teach anger, shame, and fear through the three intelligence centers.</li>
					<li>Frame each type’s strategy as both a blind spot and a potential superpower.</li>
					<li>Lead to the 10-minute typing guide, then the account and questions pages.</li>
				</ol>
			</div>
		</aside>
	</section>
</div>

<style>
	.page-shell {
		width: min(100% - 2rem, 1500px);
		margin: 0 auto;
		padding: 2rem 0 4rem;
		color: var(--ink-bright);
	}

	.page-header,
	.panel-heading,
	.safety-banner > div {
		display: flex;
		align-items: center;
	}

	.page-header,
	.panel-heading {
		justify-content: space-between;
		gap: 1.5rem;
	}

	.page-header {
		margin-bottom: 1.25rem;
	}

	h1,
	h2,
	p {
		margin-top: 0;
	}

	h1 {
		margin-bottom: 0.5rem;
		font-size: clamp(2rem, 4vw, 3.5rem);
		letter-spacing: -0.04em;
	}

	h2 {
		margin-bottom: 0.5rem;
	}

	.eyebrow,
	.section-kicker {
		margin-bottom: 0.35rem;
		color: var(--lamp-glow);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.subtitle,
	.preheader,
	.copy-notes,
	.metric small {
		color: var(--ink-mid);
	}

	.back-link {
		color: var(--lamp-glow);
		white-space: nowrap;
	}

	.safety-banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		margin-bottom: 1.25rem;
		padding: 1rem 1.25rem;
		border: 1px solid color-mix(in srgb, var(--data-teal) 38%, var(--stone-edge));
		border-radius: 8px;
		background: color-mix(in srgb, var(--data-teal) 7%, var(--night-surface));
	}

	.safety-banner > div {
		gap: 0.55rem;
		white-space: nowrap;
	}

	.safety-banner p {
		margin-bottom: 0;
		color: var(--ink-mid);
	}

	.status-dot {
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 999px;
		background: var(--data-teal);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--data-teal) 14%, transparent);
	}

	.metric-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.75rem;
		margin-bottom: 1.25rem;
	}

	.metric,
	.panel {
		border: 1px solid var(--stone-edge);
		border-radius: 8px;
		background: var(--night-surface);
	}

	.metric {
		display: grid;
		gap: 0.3rem;
		padding: 1rem;
	}

	.metric.primary {
		border-color: color-mix(in srgb, var(--lamp-glow) 50%, var(--stone-edge));
	}

	.metric > span {
		color: var(--ink-mid);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.metric strong {
		font-size: 2rem;
	}

	.content-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.45fr) minmax(22rem, 0.8fr);
		gap: 1.25rem;
		align-items: start;
	}

	.panel {
		min-width: 0;
		padding: 1.25rem;
	}

	.panel-heading label {
		display: grid;
		gap: 0.35rem;
		color: var(--ink-dim);
		font-size: 0.75rem;
	}

	select {
		min-width: 13rem;
		padding: 0.65rem 0.75rem;
		border: 1px solid var(--stone-edge);
		border-radius: 6px;
		background: var(--night-deep);
		color: var(--ink-bright);
	}

	.hold-breakdown {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0.8rem 0 1rem;
	}

	.hold-breakdown span {
		padding: 0.35rem 0.55rem;
		border: 1px solid var(--stone-edge);
		border-radius: 999px;
		color: var(--ink-mid);
		font-size: 0.72rem;
	}

	.table-wrap {
		max-height: 58rem;
		overflow: auto;
		border: 1px solid var(--stone-edge);
		border-radius: 6px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.83rem;
	}

	th,
	td {
		padding: 0.75rem;
		border-bottom: 1px solid var(--stone-edge);
		text-align: left;
		vertical-align: top;
	}

	th {
		position: sticky;
		top: 0;
		z-index: 1;
		background: var(--night-surface-raised, var(--night-deep));
		color: var(--ink-dim);
		font-size: 0.68rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	td:first-child {
		display: grid;
		gap: 0.2rem;
	}

	td:first-child span {
		color: var(--ink-mid);
	}

	code {
		color: var(--lamp-glow);
	}

	.pill {
		display: inline-flex;
		padding: 0.25rem 0.5rem;
		border: 1px solid var(--stone-edge);
		border-radius: 999px;
		color: var(--ink-mid);
		font-size: 0.7rem;
		white-space: nowrap;
	}

	.status-ready {
		border-color: color-mix(in srgb, var(--data-teal) 48%, var(--stone-edge));
		color: var(--data-teal);
	}

	.status-suppressed,
	.status-invalid_email {
		color: var(--red-accent, #ef767a);
	}

	.preview-panel {
		position: sticky;
		top: 1rem;
	}

	.preview-panel :global(iframe) {
		min-height: 640px;
	}

	.copy-notes {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--stone-edge);
		font-size: 0.83rem;
		line-height: 1.55;
	}

	.copy-notes ol {
		margin-bottom: 0;
		padding-left: 1.25rem;
	}

	@media (max-width: 1000px) {
		.metric-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.content-grid {
			grid-template-columns: 1fr;
		}

		.preview-panel {
			position: static;
		}
	}

	@media (max-width: 640px) {
		.page-header,
		.panel-heading,
		.safety-banner {
			align-items: stretch;
			flex-direction: column;
		}

		.metric-grid {
			grid-template-columns: 1fr;
		}

		select {
			width: 100%;
		}
	}
</style>
