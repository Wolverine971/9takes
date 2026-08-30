<!-- src/lib/components/atoms/StatusState.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	type Tone = 'empty' | 'error';
	type Size = 'default' | 'compact';
	type Align = 'center' | 'start';

	type Props = {
		tone: Tone;
		title: string;
		body?: string;
		icon?: Snippet;
		cta?: Snippet;
		size?: Size;
		align?: Align;
		headingLevel?: 'h2' | 'h3' | 'h4';
		showIcon?: boolean;
		class?: string;
	};

	let {
		tone,
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

	const klass = $derived(
		[
			'status-state',
			`status-state--${tone}`,
			`status-state--${size}`,
			`status-state--${align}`,
			extraClass
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<div class={klass} role={tone === 'error' ? 'alert' : 'status'}>
	{#if showIcon}
		<div class="status-state-icon" aria-hidden="true">
			{#if icon}
				{@render icon()}
			{:else if tone === 'error'}
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
			{:else}
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
	{/if}
	{#if headingLevel === 'h4'}
		<h4 class="status-state-title">{title}</h4>
	{:else if headingLevel === 'h2'}
		<h2 class="status-state-title">{title}</h2>
	{:else}
		<h3 class="status-state-title">{title}</h3>
	{/if}
	{#if body}
		<p class="status-state-body">{body}</p>
	{/if}
	{#if cta}
		<div class="status-state-cta">
			{@render cta()}
		</div>
	{/if}
</div>

<style>
	.status-state {
		display: flex;
		width: 100%;
		max-width: 26.25rem;
		margin: 0 auto;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		text-align: center;
		color: var(--ink-mid);
	}

	.status-state--default {
		padding: 2rem 1.5rem;
	}

	.status-state--compact {
		gap: 0.45rem;
		padding: 1rem;
	}

	.status-state--start {
		align-items: flex-start;
		margin: 0;
		text-align: left;
	}

	.status-state-icon {
		display: inline-flex;
		width: 3rem;
		height: 3rem;
		align-items: center;
		justify-content: center;
		color: var(--ink-dim);
	}

	.status-state--compact .status-state-icon {
		width: 2rem;
		height: 2rem;
	}

	.status-state--error .status-state-icon,
	.status-state--error .status-state-title {
		color: var(--error-text);
	}

	.status-state-icon :global(svg) {
		width: 100%;
		height: 100%;
	}

	.status-state-title {
		margin: 0;
		color: var(--ink-bright);
		font-family: var(--font-display, 'Inter Variable', 'Inter', system-ui, sans-serif);
		font-size: 1.125rem;
		font-weight: 700;
		line-height: 1.3;
	}

	.status-state--compact .status-state-title {
		font-size: 1rem;
	}

	.status-state-body {
		margin: 0;
		color: var(--ink-mid);
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.status-state-cta {
		display: inline-flex;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
</style>
