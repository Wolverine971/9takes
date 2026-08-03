<!-- src/lib/components/atoms/Spinner.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	type Tone = 'lamp' | 'data' | 'success' | 'error' | 'warning' | 'neutral';

	type Props = {
		size?: Size;
		tone?: Tone;
		label?: string;
		decorative?: boolean;
		class?: string;
		children?: Snippet;
	};

	let {
		size = 'md',
		tone = 'lamp',
		label = 'Loading',
		decorative = false,
		class: extraClass = '',
		children
	}: Props = $props();

	const klass = $derived(
		['spinner-container', `spinner-container--${tone}`, extraClass].filter(Boolean).join(' ')
	);
</script>

<span
	class={klass}
	role={decorative ? undefined : 'status'}
	aria-label={decorative ? undefined : label}
	aria-hidden={decorative ? 'true' : undefined}
>
	<span class="spinner spinner--{size}" aria-hidden="true"></span>
	{#if children}
		<span class="spinner-text">{@render children()}</span>
	{/if}
</span>

<style>
	.spinner-container {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.625rem;
		color: var(--lamp-glow);
	}

	.spinner-container--data {
		color: var(--data-teal);
	}

	.spinner-container--success {
		color: var(--success-text);
	}

	.spinner-container--error {
		color: var(--error-text);
	}

	.spinner-container--warning {
		color: var(--warning-text);
	}

	.spinner-container--neutral {
		color: var(--ink-mid);
	}

	.spinner {
		display: inline-block;
		flex-shrink: 0;
		border-style: solid;
		border-color: color-mix(in srgb, currentColor 28%, transparent);
		border-top-color: currentColor;
		border-radius: 50%;
		animation: spinner-rotate 0.8s linear infinite;
	}

	.spinner--xs {
		width: 1rem;
		height: 1rem;
		border-width: 2px;
	}

	.spinner--sm {
		width: 1.5rem;
		height: 1.5rem;
		border-width: 2px;
	}

	.spinner--md {
		width: 2rem;
		height: 2rem;
		border-width: 3px;
	}

	.spinner--lg {
		width: 3rem;
		height: 3rem;
		border-width: 4px;
	}

	.spinner--xl {
		width: 4rem;
		height: 4rem;
		border-width: 6px;
	}

	.spinner-text {
		color: var(--ink-mid);
		font-size: 0.875rem;
		line-height: 1.4;
	}

	@keyframes spinner-rotate {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.spinner {
			animation: none;
		}
	}
</style>
