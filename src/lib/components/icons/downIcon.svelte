<!-- src/lib/components/icons/downIcon.svelte -->
<script lang="ts">
	interface Props {
		className?: string;
		height?: string;
		fill?: string;
		iconStyle?: string;
	}

	let {
		className = '',
		height = '1rem',
		fill = 'var(--ink-mid)',
		iconStyle = ''
	}: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 448 512"
	class={className}
	{height}
	{fill}
	style={iconStyle}
>
	<path
		d="M212.7 331.3c6.2 6.2 16.4 6.2 22.6 0l160-160c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L224 297.4 75.3 148.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l160 160z"
	/>
</svg>
