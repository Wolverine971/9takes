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
	import StatusState from './StatusState.svelte';

	type Props = {
		title: string;
		body?: string;
		icon?: Snippet;
		cta?: Snippet;
		size?: 'default' | 'compact';
		align?: 'center' | 'start';
		headingLevel?: 'h2' | 'h3' | 'h4';
		showIcon?: boolean;
		class?: string;
	};

	let {
		title,
		body,
		icon,
		cta,
		size = 'default',
		align = 'center',
		headingLevel = 'h3',
		showIcon = true,
		class: extraClass = ''
	}: Props = $props();
</script>

<StatusState
	tone="error"
	{title}
	{body}
	{icon}
	{cta}
	{size}
	{align}
	{headingLevel}
	{showIcon}
	class={extraClass}
/>
