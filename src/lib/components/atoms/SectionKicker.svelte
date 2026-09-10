<!-- src/lib/components/atoms/SectionKicker.svelte -->
<script lang="ts">
	// src/lib/components/atoms/SectionKicker.svelte
	//
	// Optional descriptive micro-label. Decorative section numbering was
	// retired at DJ's request on 2026-09-10. Omit the whole label when it
	// only repeats the heading below it.
	//
	// Usage:
	//   <SectionKicker label="FEATURED" />
	//   <SectionKicker label="TYPE 8 · THE CHALLENGER" />
	//   <SectionKicker tone="data" label="STATUS · ACTIVE" />
	//   <SectionKicker><slot/></SectionKicker>                                 // freeform via children
	import type { Snippet } from 'svelte';

	type Tone = 'lamp' | 'data' | 'dim';

	type Props = {
		/** @deprecated Section numbers are decorative and no longer rendered. */
		num?: string | number;
		label?: string;
		tone?: Tone;
		size?: 'sm' | 'md';
		class?: string;
		children?: Snippet;
	};

	let { label, tone = 'lamp', size = 'sm', class: extraClass = '', children }: Props = $props();

	const klass = $derived(
		['kicker', `kicker--${tone}`, `kicker--${size}`, extraClass].filter(Boolean).join(' ')
	);
</script>

{#if children || label}
	<span class={klass}>
		{#if children}{@render children()}{:else}{label}{/if}
	</span>
{/if}

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
