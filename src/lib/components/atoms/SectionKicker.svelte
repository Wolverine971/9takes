<!-- src/lib/components/atoms/SectionKicker.svelte -->
<script lang="ts">
	// src/lib/components/atoms/SectionKicker.svelte
	//
	// The `§NN · LABEL` mono kicker pattern V5 uses everywhere. Locked spec at
	// /styleguide §11. Renders mono, uppercase, tracked, in `--lamp-glow`.
	//
	// Usage:
	//   <SectionKicker num="04" label="THE 9 IN 9 LINES" />
	//   <SectionKicker num="0008" label="TYPE 8 · THE CHALLENGER" />          // works with multi-segment labels
	//   <SectionKicker tone="data" num="03" label="STATUS · ACTIVE" />        // tone="data" for tech-spec teal kickers
	//   <SectionKicker><slot/></SectionKicker>                                 // freeform via children
	import type { Snippet } from 'svelte';

	type Tone = 'lamp' | 'data' | 'dim';

	type Props = {
		num?: string | number;
		label?: string;
		tone?: Tone;
		size?: 'sm' | 'md';
		class?: string;
		children?: Snippet;
	};

	let {
		num,
		label,
		tone = 'lamp',
		size = 'sm',
		class: extraClass = '',
		children
	}: Props = $props();

	const klass = $derived(
		['kicker', `kicker--${tone}`, `kicker--${size}`, extraClass].filter(Boolean).join(' ')
	);
</script>

<span class={klass}>
	{#if children}
		{@render children()}
	{:else if num !== undefined && label}
		§{num} · {label}
	{:else if label}
		{label}
	{:else if num !== undefined}
		§{num}
	{/if}
</span>

<style lang="scss">
	.kicker {
		font-family: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
		font-weight: 500;
		text-transform: uppercase;
		display: inline-block;
		line-height: 1.3;
	}

	.kicker--sm {
		font-size: 12px;
		letter-spacing: 0.08em;
	}

	.kicker--md {
		font-size: 14px;
		letter-spacing: 0.06em;
	}

	.kicker--lamp {
		color: var(--lamp-glow);
	}

	.kicker--data {
		color: var(--data-teal);
	}

	.kicker--dim {
		color: var(--ink-dim);
	}
</style>
