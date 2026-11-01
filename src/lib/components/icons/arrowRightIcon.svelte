<!-- src/lib/components/icons/arrowRightIcon.svelte -->
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
	viewBox="0 0 24 24"
	class={className}
	{height}
	{fill}
	style={iconStyle}
	><path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
</svg>
