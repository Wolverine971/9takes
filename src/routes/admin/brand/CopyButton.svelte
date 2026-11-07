<!-- src/routes/admin/brand/CopyButton.svelte -->
<script lang="ts">
	import { Check, Copy } from '@lucide/svelte';

	let {
		text,
		label = 'Copy',
		compact = false
	}: { text: string; label?: string; compact?: boolean } = $props();

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			clearTimeout(timer);
			timer = setTimeout(() => (copied = false), 1500);
		} catch {
			copied = false;
		}
	}
</script>

<button
	type="button"
	class={['copy', compact && 'compact', copied && 'done']}
	onclick={copy}
	aria-label={compact ? `${label}: ${text.slice(0, 60)}` : undefined}
>
	{#if copied}
		<Check size={14} aria-hidden="true" />
		{#if !compact}Copied{/if}
	{:else}
		<Copy size={14} aria-hidden="true" />
		{#if !compact}{label}{/if}
	{/if}
</button>

<style>
	.copy {
		display: inline-flex;
		flex: none;
		align-items: center;
		gap: 0.35rem;
		min-height: 2rem;
		padding: 0.3rem 0.65rem;
		border: 1px solid var(--rule);
		border-radius: 10px;
		background: var(--surface-raised);
		color: var(--text-muted);
		font-family: var(--font-talk);
		font-size: 0.78rem;
		font-weight: 600;
		cursor: pointer;
	}

	.copy:hover {
		border-color: var(--highlight);
		color: var(--text);
	}

	.copy:focus-visible {
		outline: 2px solid var(--focus);
		outline-offset: 2px;
	}

	.compact {
		width: 2rem;
		justify-content: center;
		padding: 0;
	}

	.done {
		color: var(--highlight);
	}
</style>
