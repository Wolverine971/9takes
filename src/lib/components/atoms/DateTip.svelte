<!-- src/lib/components/atoms/DateTip.svelte -->
<!-- This component displays dating tips in a highlighted box with a distinctive styling -->

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="date-tip">
	{@render children?.()}
</div>

<style>
	/* Cold Light note: indigo bar on --surface, an Archivo uppercase label
	   (no emoji bulb), body at the 16px floor. */
	.date-tip {
		background: var(--surface);
		border-left: 3px solid var(--accent);
		padding: 1rem;
		margin: 1.5rem 0;
		border-radius: 0 0.625rem 0.625rem 0;
		position: relative;
		font-size: var(--font-size-base);
		line-height: 1.5;
		color: var(--text-muted);
	}

	.date-tip::before {
		content: 'Tip';
		display: block;
		margin-bottom: 0.5rem;
		font-family: var(--font-talk);
		font-size: var(--font-size-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-faint);
	}
</style>
