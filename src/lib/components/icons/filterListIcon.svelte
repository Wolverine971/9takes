<!-- lib/components/icons/filterListIcon.svelte -->
<script>
	export let className = '';

	export let height = '1rem';
	export let fill = 'var(--dark-gray)';
	export let iconStyle = '';
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
		d="M152 232V212.1l-14.1-14.1L51.9 112H300.1l-86.1 86.1L200 212.1V232 362.4l-48-29.3V232zM0 64v48 16L104 232V360l96 58.7L248 448V391.7 232L352 128V112 64H304 48 0zm384 8v48h24 80 24V72H488 408 384zM344 232H320v48h24H488h24V232H488 344zm0 160H320v48h24H488h24V392H488 344z"
	/>
</svg>
