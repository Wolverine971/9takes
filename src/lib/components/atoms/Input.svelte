<!-- src/lib/components/atoms/Input.svelte -->
<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Density = 'default' | 'compact';
	type Props = Omit<HTMLInputAttributes, 'class' | 'size' | 'value' | 'aria-invalid'> & {
		value?: HTMLInputAttributes['value'];
		density?: Density;
		invalid?: boolean;
		class?: string;
		'aria-invalid'?: HTMLInputAttributes['aria-invalid'];
	};

	let {
		value = $bindable(),
		density = 'default',
		invalid = false,
		class: extraClass = '',
		'aria-invalid': ariaInvalid,
		type = 'text',
		...rest
	}: Props = $props();

	const klass = $derived(
		['control', 'input', `control--${density}`, extraClass].filter(Boolean).join(' ')
	);
	const resolvedInvalid = $derived(invalid ? 'true' : ariaInvalid);
</script>

<input {...rest} {type} class={klass} bind:value aria-invalid={resolvedInvalid} />

<style lang="scss">
	@use './form-control' as formControl;

	.input {
		@include formControl.base;
		@include formControl.density;
	}
</style>
