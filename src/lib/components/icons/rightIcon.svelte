<!-- lib/components/icons/rightIcon.svelte -->
<script>
	export let className = '';

	export let height = '1rem';
	export let fill = 'var(--dark-gray)';
	export let iconStyle = '';
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 320 512"
	class={className}
	{height}
	{fill}
	style={iconStyle}
	><path
		d="M305 239c9.4 9.4 9.4 24.6 0 33.9L113 465c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l175-175L79 81c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L305 239z"
	/></svg
>
