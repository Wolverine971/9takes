<!-- src/lib/components/atoms/Field.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		for: string;
		label: string;
		help?: string;
		error?: string;
		required?: boolean;
		optional?: boolean;
		class?: string;
		children: Snippet;
	};

	let {
		for: controlId,
		label,
		help,
		error,
		required = false,
		optional = false,
		class: extraClass = '',
		children
	}: Props = $props();

	const helpId = $derived(help ? `${controlId}-help` : undefined);
	const errorId = $derived(error ? `${controlId}-error` : undefined);
</script>

<div class={['field', extraClass].filter(Boolean).join(' ')}>
	<label class="field-label" for={controlId}>
		<span>{label}</span>
		{#if required}
			<span class="field-required" aria-hidden="true">*</span>
		{:else if optional}
			<span class="field-optional">Optional</span>
		{/if}
	</label>

	{@render children()}

	{#if help && !error}
		<p class="field-help" id={helpId}>{help}</p>
	{/if}
	{#if error}
		<p class="field-error" id={errorId} role="alert">{error}</p>
	{/if}
</div>

<style>
	.field {
		display: flex;
		min-width: 0;
		flex-direction: column;
		gap: 0.4rem;
	}

	.field-label {
		display: flex;
		align-items: baseline;
		gap: 0.35rem;
		color: var(--ink-bright);
		font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);
		font-size: 0.75rem;
		font-weight: 600;
		line-height: 1.35;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.field-required {
		color: var(--error-text);
	}

	.field-optional {
		color: var(--ink-dim);
		font-family: var(--font-family, 'Inter Variable', 'Inter', system-ui, sans-serif);
		font-size: 0.7rem;
		font-weight: 500;
		letter-spacing: 0;
		text-transform: none;
	}

	.field-help,
	.field-error {
		margin: 0;
		font-size: 0.8125rem;
		line-height: 1.45;
	}

	.field-help {
		color: var(--ink-mid);
	}

	.field-error {
		color: var(--error-text);
	}
</style>
