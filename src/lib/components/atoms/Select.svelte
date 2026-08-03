<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	type Density = 'default' | 'compact';
	type Props = Omit<HTMLSelectAttributes, 'class' | 'size' | 'value' | 'aria-invalid'> & {
		value?: HTMLSelectAttributes['value'];
		density?: Density;
		invalid?: boolean;
		class?: string;
		children: Snippet;
		'aria-invalid'?: HTMLSelectAttributes['aria-invalid'];
	};

	let {
		value = $bindable(),
		density = 'default',
		invalid = false,
		class: extraClass = '',
		children,
		'aria-invalid': ariaInvalid,
		...rest
	}: Props = $props();

	const klass = $derived(
		['control', 'select', `control--${density}`, extraClass].filter(Boolean).join(' ')
	);
	const resolvedInvalid = $derived(invalid ? 'true' : ariaInvalid);
</script>

<select {...rest} class={klass} bind:value aria-invalid={resolvedInvalid}>
	{@render children()}
</select>

<style lang="scss">
	@use './form-control' as formControl;

	.select {
		@include formControl.base;
		@include formControl.density;
		cursor: pointer;
	}

	.select:disabled {
		cursor: not-allowed;
	}

	.select :global(option) {
		background: var(--stone-warm);
		color: var(--ink-bright);
	}
</style>
