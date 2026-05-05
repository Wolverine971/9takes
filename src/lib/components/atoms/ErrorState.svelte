<!-- src/lib/components/atoms/ErrorState.svelte -->
<script lang="ts">
	// src/lib/components/atoms/ErrorState.svelte
	//
	// Canonical error-state atom. Locked spec at /styleguide §11.
	// Use for inline error surfaces — "we couldn't load this", failed fetch,
	// rate-limit messages, etc. NOT for global error boundaries (use ErrorBoundary).
	//
	// Usage:
	//   <ErrorState title="Something went wrong" body="We couldn't load this section." />
	//
	//   <ErrorState
	//     title="Rate limited"
	//     body="Wait a moment, then try again."
	//   >
	//     {#snippet cta()}
	//       <Button variant="danger" size="sm" onclick={retry}>Retry</Button>
	//     {/snippet}
	//   </ErrorState>
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

<div class={['error-state', extraClass].filter(Boolean).join(' ')} role="alert">
	<div class="error-state-icon" aria-hidden="true">
		{#if icon}
			{@render icon()}
		{:else}
			<!-- default alert circle -->
			<svg
				viewBox="0 0 48 48"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="24" cy="24" r="18" />
				<line x1="24" y1="14" x2="24" y2="26" />
				<line x1="24" y1="32" x2="24" y2="34" />
			</svg>
		{/if}
	</div>
	<h3 class="error-state-title">{title}</h3>
	{#if body}
		<p class="error-state-body">{body}</p>
	{/if}
	{#if cta}
		<div class="error-state-cta">
			{@render cta()}
		</div>
	{/if}
</div>

<style lang="scss">
	.error-state {
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

	.error-state-icon {
		width: 48px;
		height: 48px;
		color: var(--error, #ef4444);
		display: inline-flex;
		align-items: center;
		justify-content: center;

		:global(svg) {
			width: 100%;
			height: 100%;
		}
	}

	.error-state-title {
		font-family: 'Inter Variable', 'Inter', system-ui, sans-serif;
		font-size: 18px;
		font-weight: 600;
		color: var(--error, #ef4444);
		margin: 0;
		line-height: 1.3;
	}

	.error-state-body {
		font-family: 'Inter Variable', 'Inter', system-ui, sans-serif;
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink-mid);
		margin: 0;
	}

	.error-state-cta {
		margin-top: 0.5rem;
		display: inline-flex;
		gap: 0.5rem;
	}
</style>
