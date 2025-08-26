<!-- src/lib/components/icons/login.svelte -->
<script>
	export let className = '';

	export let height = '1rem';
	export let fill = 'var(--dark-gray)';
	export let iconStyle = '';
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	class={className}
	{height}
	{fill}
	style={iconStyle}
>
	<path
		d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z"
	/></svg
>
