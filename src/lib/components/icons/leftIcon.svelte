<!-- src/lib/components/icons/leftIcon.svelte -->
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
	viewBox="0 0 320 512"
	class={className}
	{height}
	{fill}
	style={iconStyle}
>
	<!-- 320 512 -->
	<path
		d="M15 239c-9.4 9.4-9.4 24.6 0 33.9L207 465c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L65.9 256 241 81c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L15 239z"
	/></svg
>
