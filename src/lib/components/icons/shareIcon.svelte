<!-- lib/components/icons/shareIcon.svelte -->
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
		d="M14,5V9C7,10 4,15 3,20C5.5,16.5 9,14.9 14,14.9V19L21,12L14,5M16,9.83L18.17,12L16,14.17V12.9H14C11.93,12.9 10.07,13.28 8.34,13.85C9.74,12.46 11.54,11.37 14.28,11L16,10.73V9.83Z"
	/>
</svg>
