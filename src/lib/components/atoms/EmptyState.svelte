<!-- src/lib/components/atoms/EmptyState.svelte -->
<script lang="ts">
	// src/lib/components/atoms/EmptyState.svelte
	//
	// Canonical empty-state atom. Locked spec at /styleguide §11.
	// Use for "no results", "first-visit", "nothing here yet" surfaces —
	// question search, blog search, admin lists, etc.
	//
	// Usage:
	//   <EmptyState title="No questions yet" body="Be the first to drop one." />
	//
	//   <EmptyState
	//     title="No results"
	//     body="Try a different search term."
	//   >
	//     {#snippet cta()}
	//       <Button size="sm" onclick={clearFilters}>Clear filters</Button>
	//     {/snippet}
	//   </EmptyState>
	//
	//   <EmptyState title="Empty" >{#snippet icon()}<MyIcon />{/snippet}</EmptyState>
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		body?: string;
		icon?: Snippet;
		cta?: Snippet;
		class?: string;
	};

	let { title, body, icon, cta, class: extraClass = '' }: Props = $props();
</script>

<div class={['empty-state', extraClass].filter(Boolean).join(' ')} role="status">
	<div class="empty-state-icon" aria-hidden="true">
		{#if icon}
			{@render icon()}
		{:else}
			<!-- default magnifying-glass -->
			<svg
				viewBox="0 0 48 48"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="20" cy="20" r="11" />
				<line x1="29" y1="29" x2="40" y2="40" />
			</svg>
		{/if}
	</div>
	<h3 class="empty-state-title">{title}</h3>
	{#if body}
		<p class="empty-state-body">{body}</p>
	{/if}
	{#if cta}
		<div class="empty-state-cta">
			{@render cta()}
		</div>
	{/if}
</div>

<style lang="scss">
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.75rem;
		padding: 2rem 1.5rem;
		max-width: 420px;
		margin: 0 auto;
		color: var(--ink-mid);
	}

	.empty-state-icon {
		width: 48px;
		height: 48px;
		color: var(--ink-dim);
		display: inline-flex;
		align-items: center;
		justify-content: center;

		:global(svg) {
			width: 100%;
			height: 100%;
		}
	}

	.empty-state-title {
		font-family: 'Inter Variable', 'Inter', system-ui, sans-serif;
		font-size: 18px;
		font-weight: 700;
		color: var(--ink-bright);
		margin: 0;
		line-height: 1.3;
	}

	.empty-state-body {
		font-family: 'Inter Variable', 'Inter', system-ui, sans-serif;
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink-mid);
		margin: 0;
	}

	.empty-state-cta {
		margin-top: 0.5rem;
		display: inline-flex;
		gap: 0.5rem;
	}
</style>
