<!-- lib/components/icons/arrowRightIcon.svelte -->
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
	><path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
</svg>
