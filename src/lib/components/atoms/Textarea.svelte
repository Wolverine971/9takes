<!-- src/lib/components/atoms/Textarea.svelte -->
<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	type Density = 'default' | 'compact';
	type Props = Omit<HTMLTextareaAttributes, 'class' | 'value' | 'aria-invalid'> & {
		value?: HTMLTextareaAttributes['value'];
		density?: Density;
		invalid?: boolean;
		class?: string;
		'aria-invalid'?: HTMLTextareaAttributes['aria-invalid'];
	};

	let {
		value = $bindable(),
		density = 'default',
		invalid = false,
		class: extraClass = '',
		'aria-invalid': ariaInvalid,
		rows = 4,
		...rest
	}: Props = $props();

	const klass = $derived(
		['control', 'textarea', `control--${density}`, extraClass].filter(Boolean).join(' ')
	);
	const resolvedInvalid = $derived(invalid ? 'true' : ariaInvalid);
</script>

<textarea {...rest} {rows} class={klass} bind:value aria-invalid={resolvedInvalid}></textarea>

<style lang="scss">
	@use './form-control' as formControl;

	.textarea {
		@include formControl.base;
		@include formControl.density;
		min-height: 6rem;
		resize: vertical;
	}
</style>
