<!-- src/lib/components/admin/EmailSubscriptionStatus.svelte -->
<script lang="ts">
	import { MailCheck, MailX } from '@lucide/svelte';

	type Props = {
		unsubscribed?: boolean | null;
		unsubscribedAt?: string | null;
		reason?: string | null;
		showActive?: boolean;
		showDetail?: boolean;
	};

	let {
		unsubscribed = false,
		unsubscribedAt = null,
		reason = null,
		showActive = false,
		showDetail = false
	}: Props = $props();

	function formatDateTime(dateStr: string | null): string {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		if (Number.isNaN(date.getTime())) return '';

		return date.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	let formattedDate = $derived(formatDateTime(unsubscribedAt));
	let statusTitle = $derived(
		[reason || (unsubscribed ? 'Suppressed from email sends' : 'Eligible for email'), formattedDate]
			.filter(Boolean)
			.join(' · ')
	);
</script>

{#if unsubscribed}
	<span class="subscription-status unsubscribed" title={statusTitle}>
		<MailX size={13} strokeWidth={2} aria-hidden="true" />
		<span>Unsubscribed</span>
	</span>
	{#if showDetail && (reason || formattedDate)}
		<span class="subscription-detail">
			{reason || 'Suppressed'}{reason && formattedDate ? ' · ' : ''}{formattedDate}
		</span>
	{/if}
{:else if showActive}
	<span class="subscription-status active" title={statusTitle}>
		<MailCheck size={13} strokeWidth={2} aria-hidden="true" />
		<span>Subscribed</span>
	</span>
{/if}

<style>
	.subscription-status {
		display: inline-flex;
		width: fit-content;
		align-items: center;
		gap: 0.3rem;
		padding: 0.25rem 0.5rem;
		border: 1px solid transparent;
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.65rem;
		font-weight: 700;
		line-height: 1;
		letter-spacing: 0.02em;
		white-space: nowrap;
	}

	.subscription-status.unsubscribed {
		border-color: color-mix(in srgb, var(--warning) 34%, transparent);
		background: color-mix(in srgb, var(--warning) 12%, transparent);
		color: var(--warning-text);
	}

	.subscription-status.active {
		border-color: color-mix(in srgb, var(--success) 28%, transparent);
		background: color-mix(in srgb, var(--success) 10%, transparent);
		color: var(--success-text);
	}

	.subscription-status :global(svg) {
		flex: 0 0 auto;
	}

	.subscription-detail {
		display: block;
		margin-top: 0.3rem;
		color: var(--ink-mid);
		font-size: 0.68rem;
		line-height: 1.4;
	}
</style>
