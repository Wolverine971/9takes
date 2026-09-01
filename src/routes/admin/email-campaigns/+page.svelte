<!-- src/routes/admin/email-campaigns/+page.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		Activity,
		ArrowUpRight,
		Ban,
		CircleAlert,
		Eye,
		FileText,
		Mail,
		MousePointerClick,
		Send,
		UsersRound
	} from '@lucide/svelte';
	import HtmlPreviewFrame from '$lib/components/admin/HtmlPreviewFrame.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let selectedCampaignId = $state('');
	let selectedEmailId = $state('');
	let contentView = $state<'preview' | 'plain'>('preview');

	let selectedCampaign = $derived(
		data.campaigns.find((campaign) => campaign.id === selectedCampaignId) ?? data.campaigns[0]
	);
	let selectedEmail = $derived(
		selectedCampaign?.emails.find((email) => email.id === selectedEmailId) ??
			selectedCampaign?.emails[0]
	);

	function selectCampaign(campaignId: string) {
		const campaign = data.campaigns.find((candidate) => candidate.id === campaignId);
		selectedCampaignId = campaignId;
		selectedEmailId = campaign?.emails[0]?.id ?? '';
		contentView = 'preview';
	}

	function selectEmail(emailId: string) {
		selectedEmailId = emailId;
		contentView = 'preview';
	}

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

	function formatTrigger(value: string): string {
		return value.replaceAll('_', ' ');
	}

	function percentage(part: number, total: number): string {
		if (total === 0) return '0%';
		return `${Math.round((part / total) * 100)}%`;
	}
</script>

<svelte:head>
	<title>Email Campaigns | Admin</title>
	<meta
		name="description"
		content="Review 9takes email campaigns, sequence health, and every sendable email."
	/>
</svelte:head>

<div class="page-shell">
	<header class="page-header">
		<div>
			<p class="eyebrow">Admin / Reach</p>
			<h1>Email campaigns</h1>
			<p class="subtitle">One place to inspect every program, email, variant, and result.</p>
		</div>
		<div class="header-actions">
			<a class="text-link" href={resolve('/admin/email-dashboard')}>Delivery dashboard</a>
			<a
				class="primary-link"
				href={resolve(selectedCampaign?.detailLink ?? '/admin/email-dashboard')}
			>
				Open campaign controls
				<ArrowUpRight size={16} aria-hidden="true" />
			</a>
		</div>
	</header>

	<section class="preflight" aria-label="Campaign preflight notice">
		<CircleAlert size={20} strokeWidth={1.8} aria-hidden="true" />
		<div>
			<strong>Review workspace — no send button</strong>
			<p>
				Campaign activation, recipient enrollment, and delivery remain in their dedicated control
				pages. This screen is the source-of-truth view for copy and performance.
			</p>
		</div>
	</section>

	<section class="summary-grid" aria-label="Email program summary">
		<article>
			<span class="summary-icon"><Mail size={18} aria-hidden="true" /></span>
			<div><strong>{data.summary.campaigns}</strong><span>Campaigns</span></div>
		</article>
		<article>
			<span class="summary-icon"><FileText size={18} aria-hidden="true" /></span>
			<div><strong>{data.summary.emails}</strong><span>Emails & variants</span></div>
		</article>
		<article>
			<span class="summary-icon"><Send size={18} aria-hidden="true" /></span>
			<div><strong>{data.summary.sent}</strong><span>Sequence sends</span></div>
		</article>
		<article>
			<span class="summary-icon"><MousePointerClick size={18} aria-hidden="true" /></span>
			<div><strong>{data.summary.clicked}</strong><span>Unique clicks</span></div>
		</article>
		<article>
			<span class="summary-icon"><Ban size={18} aria-hidden="true" /></span>
			<div><strong>{data.summary.suppressed}</strong><span>Suppressed</span></div>
		</article>
	</section>

	{#if selectedCampaign && selectedEmail}
		<div class="workspace">
			<aside class="campaign-rail" aria-label="Email campaigns">
				<div class="rail-heading">
					<span>Programs</span>
					<strong>{data.campaigns.length}</strong>
				</div>
				<div class="campaign-list">
					{#each data.campaigns as campaign (campaign.id)}
						<button
							type="button"
							class={['campaign-option', { selected: selectedCampaign.id === campaign.id }]}
							onclick={() => selectCampaign(campaign.id)}
							aria-pressed={selectedCampaign.id === campaign.id}
						>
							<span class="campaign-option-top">
								<strong>{campaign.displayName}</strong>
								<span class={['status-pill', `status-${campaign.status}`]}>{campaign.status}</span>
							</span>
							<span class="campaign-key">{campaign.key}</span>
							<span class="campaign-option-stats">
								<span
									>{campaign.emails.length}
									{campaign.emails.length === 1 ? 'email' : 'emails'}</span
								>
								<span>{campaign.metrics.sent} sent</span>
								<span>{campaign.metrics.clicked} clicked</span>
							</span>
						</button>
					{/each}
				</div>
			</aside>

			<section class="campaign-main" aria-label={`${selectedCampaign.displayName} campaign`}>
				<section class="campaign-header">
					<div>
						<div class="campaign-title-line">
							<span class={['status-pill', `status-${selectedCampaign.status}`]}>
								{selectedCampaign.status}
							</span>
							<span>{formatTrigger(selectedCampaign.triggerType)}</span>
							<span>Updated {formatDate(selectedCampaign.updatedAt)}</span>
						</div>
						<h2>{selectedCampaign.displayName}</h2>
						<p>{selectedCampaign.description || 'No campaign description has been added.'}</p>
					</div>
					<a class="detail-link" href={resolve(selectedCampaign.detailLink)}>
						Audience & controls
						<ArrowUpRight size={15} aria-hidden="true" />
					</a>
				</section>

				<section class="health-grid" aria-label="Selected campaign performance">
					<article>
						<span>Sent</span>
						<strong>{selectedCampaign.metrics.sent}</strong>
						<small>{selectedCampaign.enrollments.total} total enrollments</small>
					</article>
					<article>
						<span>Opened</span>
						<strong>{selectedCampaign.metrics.opened}</strong>
						<small
							>{percentage(selectedCampaign.metrics.opened, selectedCampaign.metrics.sent)} of sends</small
						>
					</article>
					<article>
						<span>Clicked</span>
						<strong>{selectedCampaign.metrics.clicked}</strong>
						<small
							>{percentage(selectedCampaign.metrics.clicked, selectedCampaign.metrics.sent)} of sends</small
						>
					</article>
					<article>
						<span>Bounced</span>
						<strong>{selectedCampaign.metrics.bounced}</strong>
						<small>{selectedCampaign.metrics.unsubscribed} unsubscribed</small>
					</article>
				</section>

				<div class="enrollment-strip" aria-label="Enrollment status">
					<span
						><Activity size={15} aria-hidden="true" /> Active
						<strong>{selectedCampaign.enrollments.active}</strong></span
					>
					<span>Processing <strong>{selectedCampaign.enrollments.processing}</strong></span>
					<span>Paused <strong>{selectedCampaign.enrollments.paused}</strong></span>
					<span>Completed <strong>{selectedCampaign.enrollments.completed}</strong></span>
					<span>Exited <strong>{selectedCampaign.enrollments.exited}</strong></span>
					<span>Errored <strong>{selectedCampaign.enrollments.errored}</strong></span>
				</div>

				<section class="email-section">
					<div class="section-heading">
						<div>
							<p class="section-kicker">Campaign contents</p>
							<h3>
								{selectedCampaign.emails.length}
								{selectedCampaign.emails.length === 1 ? 'email' : 'emails and variants'}
							</h3>
						</div>
						<span>Select one to inspect the exact sendable copy.</span>
					</div>

					<div class="email-list">
						{#each selectedCampaign.emails as email (email.id)}
							<button
								type="button"
								class={['email-option', { selected: selectedEmail.id === email.id }]}
								onclick={() => selectEmail(email.id)}
								aria-pressed={selectedEmail.id === email.id}
							>
								<span class="email-option-meta">
									<strong>{email.label}</strong>
									{#if email.state === 'pilot'}
										<span class="variant-pill pilot">Pilot</span>
									{:else if email.state === 'candidate'}
										<span class="variant-pill">Candidate</span>
									{/if}
								</span>
								<span class="email-context">{email.context}</span>
								<span class="email-subject">{email.subject}</span>
								<span class="email-option-results">
									{email.metrics.sent} sent · {email.metrics.clicked} clicked
								</span>
							</button>
						{/each}
					</div>
				</section>

				<section class="inspector">
					<header class="inspector-header">
						<div>
							<p class="section-kicker">{selectedEmail.label} / {selectedEmail.context}</p>
							<h3>{selectedEmail.subject}</h3>
							{#if selectedEmail.preheader}<p>{selectedEmail.preheader}</p>{/if}
						</div>
						<div class="view-toggle" aria-label="Email content view">
							<button
								type="button"
								class={{ active: contentView === 'preview' }}
								onclick={() => (contentView = 'preview')}
							>
								<Eye size={15} aria-hidden="true" /> Preview
							</button>
							<button
								type="button"
								class={{ active: contentView === 'plain' }}
								onclick={() => (contentView = 'plain')}
							>
								<FileText size={15} aria-hidden="true" /> Plain text
							</button>
						</div>
					</header>

					<div class="message-stats">
						<span><Send size={14} aria-hidden="true" /> {selectedEmail.metrics.sent} sent</span>
						<span><Eye size={14} aria-hidden="true" /> {selectedEmail.metrics.opened} opened</span>
						<span
							><MousePointerClick size={14} aria-hidden="true" />
							{selectedEmail.metrics.clicked} clicked</span
						>
						<span><UsersRound size={14} aria-hidden="true" /> Step {selectedEmail.stepNumber}</span>
					</div>

					{#if contentView === 'preview'}
						<div class="preview-wrap">
							<HtmlPreviewFrame
								html={selectedEmail.previewHtml}
								title={`${selectedEmail.label} email preview`}
							/>
						</div>
					{:else}
						<pre class="plain-text">{selectedEmail.plainText}</pre>
					{/if}
				</section>
			</section>
		</div>
	{:else}
		<section class="empty-state">
			<Mail size={28} aria-hidden="true" />
			<h2>No email campaigns found</h2>
			<p>Apply the email sequence migrations, then reload this page.</p>
		</section>
	{/if}
</div>

<style>
	.page-shell {
		width: min(100% - 2rem, 1540px);
		margin: 0 auto;
		padding: 2rem 0 4rem;
		color: var(--ink-bright);
	}

	.page-header,
	.header-actions,
	.preflight,
	.campaign-title-line,
	.detail-link,
	.primary-link,
	.enrollment-strip,
	.message-stats,
	.view-toggle,
	.view-toggle button {
		display: flex;
		align-items: center;
	}

	.page-header {
		justify-content: space-between;
		gap: 2rem;
		margin-bottom: 1.25rem;
	}

	h1,
	h2,
	h3,
	p {
		margin-top: 0;
	}

	h1 {
		margin-bottom: 0.45rem;
		font-size: clamp(2.2rem, 4.4vw, 4rem);
		letter-spacing: -0.055em;
		line-height: 0.98;
	}

	h2 {
		margin-bottom: 0.5rem;
		font-size: clamp(1.7rem, 3vw, 2.5rem);
		letter-spacing: -0.035em;
	}

	h3 {
		margin-bottom: 0.35rem;
		font-size: 1.15rem;
	}

	.eyebrow,
	.section-kicker,
	.campaign-key {
		font-family: var(--font-mono);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.eyebrow,
	.section-kicker {
		margin-bottom: 0.4rem;
		color: var(--lamp-glow);
		font-size: 0.68rem;
		font-weight: 750;
	}

	.subtitle,
	.campaign-header p,
	.inspector-header p,
	.section-heading > span {
		margin-bottom: 0;
		color: var(--ink-mid);
	}

	.header-actions {
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.text-link,
	.primary-link,
	.detail-link {
		min-height: 42px;
		border-radius: 10px;
		font-size: 0.82rem;
		font-weight: 700;
		text-decoration: none;
	}

	.text-link {
		display: inline-flex;
		align-items: center;
		padding: 0.65rem 0.85rem;
		border: 1px solid var(--stone-edge);
		color: var(--ink-mid);
	}

	.primary-link {
		gap: 0.45rem;
		padding: 0.65rem 0.9rem;
		background: var(--lamp-glow);
		color: var(--night-deep);
	}

	.preflight {
		gap: 0.8rem;
		margin-bottom: 1rem;
		padding: 0.9rem 1rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 40%, var(--stone-edge));
		border-radius: 16px;
		background: color-mix(in srgb, var(--lamp-glow) 6%, var(--night-surface));
		color: var(--lamp-glow);
	}

	.preflight > div {
		display: grid;
		gap: 0.15rem;
	}

	.preflight p {
		margin-bottom: 0;
		color: var(--ink-mid);
		font-size: 0.8rem;
	}

	.summary-grid {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 0.65rem;
		margin-bottom: 1rem;
	}

	.summary-grid article {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		padding: 0.85rem;
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: var(--night-surface);
	}

	.summary-icon {
		display: grid;
		width: 36px;
		height: 36px;
		place-items: center;
		border-radius: 10px;
		background: color-mix(in srgb, var(--lamp-glow) 10%, var(--night-deep));
		color: var(--lamp-glow);
	}

	.summary-grid article div {
		display: grid;
		gap: 0.1rem;
	}

	.summary-grid strong {
		font-size: 1.3rem;
		line-height: 1;
	}

	.summary-grid article div span {
		color: var(--ink-dim);
		font-size: 0.72rem;
	}

	.workspace {
		display: grid;
		grid-template-columns: minmax(15rem, 0.32fr) minmax(0, 1fr);
		min-height: 64rem;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-surface);
		overflow: hidden;
	}

	.campaign-rail {
		border-right: 1px solid var(--stone-edge);
		background: color-mix(in srgb, var(--night-deep) 75%, var(--night-surface));
	}

	.rail-heading {
		display: flex;
		justify-content: space-between;
		padding: 1rem;
		border-bottom: 1px solid var(--stone-edge);
		color: var(--ink-dim);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.campaign-list {
		display: grid;
	}

	.campaign-option,
	.email-option {
		appearance: none;
		border: 0;
		border-radius: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		text-align: left;
		cursor: pointer;
	}

	.campaign-option {
		display: grid;
		gap: 0.45rem;
		padding: 1rem;
		border-bottom: 1px solid var(--stone-edge);
		box-shadow: inset 3px 0 transparent;
	}

	.campaign-option:hover,
	.campaign-option.selected {
		background: color-mix(in srgb, var(--lamp-glow) 6%, transparent);
	}

	.campaign-option.selected {
		box-shadow: inset 3px 0 var(--lamp-glow);
	}

	.campaign-option-top,
	.email-option-meta {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.7rem;
	}

	.campaign-option-top strong {
		font-size: 0.82rem;
		line-height: 1.35;
	}

	.campaign-key {
		color: var(--ink-faint);
		font-size: 0.57rem;
		text-transform: none;
	}

	.campaign-option-stats {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
		color: var(--ink-dim);
		font-size: 0.65rem;
	}

	.status-pill,
	.variant-pill {
		display: inline-flex;
		align-items: center;
		width: fit-content;
		border-radius: 999px;
		font-size: 0.6rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.status-pill {
		padding: 0.23rem 0.42rem;
		border: 1px solid var(--stone-edge);
		color: var(--ink-mid);
	}

	.status-active {
		border-color: color-mix(in srgb, var(--data-teal) 45%, var(--stone-edge));
		color: var(--data-teal);
	}

	.status-paused {
		border-color: color-mix(in srgb, var(--lamp-glow) 45%, var(--stone-edge));
		color: var(--lamp-glow);
	}

	.campaign-main {
		min-width: 0;
		padding: 1.25rem;
	}

	.campaign-header,
	.section-heading,
	.inspector-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1.5rem;
	}

	.campaign-header {
		margin-bottom: 1rem;
	}

	.campaign-title-line {
		gap: 0.55rem;
		margin-bottom: 0.65rem;
		color: var(--ink-dim);
		font-size: 0.68rem;
		text-transform: capitalize;
	}

	.detail-link {
		flex: 0 0 auto;
		gap: 0.4rem;
		padding: 0.55rem 0.7rem;
		border: 1px solid var(--stone-edge);
		color: var(--lamp-glow);
	}

	.health-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.6rem;
		margin-bottom: 0.75rem;
	}

	.health-grid article {
		display: grid;
		gap: 0.3rem;
		padding: 0.8rem;
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: var(--night-deep);
	}

	.health-grid span {
		color: var(--ink-dim);
		font-size: 0.66rem;
		font-weight: 750;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.health-grid strong {
		font-size: 1.55rem;
	}

	.health-grid small {
		color: var(--ink-dim);
		font-size: 0.66rem;
	}

	.enrollment-strip,
	.message-stats {
		gap: 0.75rem;
		flex-wrap: wrap;
		color: var(--ink-dim);
		font-size: 0.68rem;
	}

	.enrollment-strip {
		margin-bottom: 1.3rem;
		padding: 0.65rem 0.75rem;
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
	}

	.enrollment-strip span,
	.message-stats span {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
	}

	.email-section {
		margin-bottom: 1rem;
	}

	.section-heading {
		margin-bottom: 0.75rem;
	}

	.email-list {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.6rem;
	}

	.email-option {
		display: grid;
		gap: 0.35rem;
		min-height: 9.5rem;
		padding: 0.8rem;
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: var(--night-deep);
	}

	.email-option:hover,
	.email-option.selected {
		border-color: color-mix(in srgb, var(--lamp-glow) 58%, var(--stone-edge));
	}

	.email-option.selected {
		background: color-mix(in srgb, var(--lamp-glow) 5%, var(--night-deep));
		box-shadow: inset 0 3px var(--lamp-glow);
	}

	.email-option-meta strong {
		color: var(--lamp-glow);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.variant-pill {
		padding: 0.2rem 0.38rem;
		background: var(--stone-warm);
		color: var(--ink-dim);
	}

	.variant-pill.pilot {
		background: color-mix(in srgb, var(--data-teal) 16%, var(--night-deep));
		color: var(--data-teal);
	}

	.email-context,
	.email-option-results {
		color: var(--ink-dim);
		font-size: 0.66rem;
	}

	.email-subject {
		font-size: 0.83rem;
		font-weight: 650;
		line-height: 1.35;
	}

	.email-option-results {
		align-self: end;
	}

	.inspector {
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: var(--night-deep);
		overflow: hidden;
	}

	.inspector-header {
		padding: 1rem;
		border-bottom: 1px solid var(--stone-edge);
	}

	.inspector-header > div:first-child {
		min-width: 0;
	}

	.view-toggle {
		flex: 0 0 auto;
		padding: 0.2rem;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-surface);
	}

	.view-toggle button {
		gap: 0.35rem;
		padding: 0.45rem 0.6rem;
		border: 0;
		border-radius: 10px;
		background: transparent;
		color: var(--ink-dim);
		font: inherit;
		font-size: 0.68rem;
		cursor: pointer;
	}

	.view-toggle button.active {
		background: var(--stone-warm);
		color: var(--ink-bright);
	}

	.message-stats {
		padding: 0.6rem 1rem;
		border-bottom: 1px solid var(--stone-edge);
	}

	.preview-wrap {
		padding: 1rem;
		background: #d8d6d0;
	}

	.plain-text {
		min-height: 32rem;
		margin: 0;
		padding: 1.25rem;
		overflow: auto;
		background: #f6f4ee;
		color: #24211c;
		font: 0.82rem/1.65 var(--font-mono);
		white-space: pre-wrap;
	}

	.empty-state {
		display: grid;
		min-height: 24rem;
		place-items: center;
		align-content: center;
		gap: 0.5rem;
		border: 1px dashed var(--stone-edge);
		border-radius: 16px;
		color: var(--ink-dim);
		text-align: center;
	}

	.empty-state h2,
	.empty-state p {
		margin-bottom: 0;
	}

	@media (max-width: 1100px) {
		.summary-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.workspace {
			grid-template-columns: 1fr;
		}

		.campaign-rail {
			border-right: 0;
			border-bottom: 1px solid var(--stone-edge);
		}

		.campaign-list {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.campaign-option {
			border-right: 1px solid var(--stone-edge);
			box-shadow: inset 0 3px transparent;
		}

		.campaign-option.selected {
			box-shadow: inset 0 3px var(--lamp-glow);
		}
	}

	@media (max-width: 760px) {
		.page-shell {
			width: min(100% - 1rem, 1540px);
			padding-top: 1rem;
		}

		.page-header,
		.campaign-header,
		.section-heading,
		.inspector-header {
			align-items: stretch;
			flex-direction: column;
			gap: 0.85rem;
		}

		.header-actions {
			justify-content: flex-start;
		}

		.summary-grid,
		.health-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.campaign-list,
		.email-list {
			grid-template-columns: 1fr;
		}

		.campaign-option {
			border-right: 0;
		}

		.campaign-main {
			padding: 0.8rem;
		}

		.detail-link,
		.view-toggle {
			width: fit-content;
		}

		.email-option {
			min-height: auto;
		}
	}
</style>
