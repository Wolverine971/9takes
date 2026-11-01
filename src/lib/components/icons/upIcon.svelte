<!-- src/lib/components/icons/upIcon.svelte -->
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
	viewBox="0 0 512 512"
	class={className}
	{height}
	{fill}
	style={iconStyle}
>
	<path
		d="M239 111c9.4-9.4 24.6-9.4 33.9 0L465 303c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-175-175L81 337c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 111z"
	/>
</svg>
