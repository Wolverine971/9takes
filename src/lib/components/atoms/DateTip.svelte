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
	.date-tip {
		background: var(--lamp-soft);
		border-left: 4px solid var(--lamp-glow);
		padding: 1rem;
		margin: 1.5rem 0;
		border-radius: 0 0.625rem 0.625rem 0;
		position: relative;
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--ink-bright);
	}

	.date-tip::before {
		content: '💡 Tip';
		font-weight: bold;
		display: block;
		margin-bottom: 0.5rem;
		color: var(--lamp-glow);
	}
</style>
