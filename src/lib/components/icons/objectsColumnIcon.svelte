<!-- lib/components/icons/objectsColumnIcon.svelte -->
<script>
	export let className = '';

	export let height = '1rem';
	export let fill = 'var(--dark-gray)';
	export let iconStyle = '';
</script>

<svg class={className} viewBox="0 0 448 512" {height} {fill} style={iconStyle}
	><path
		d="M48 32C21.5 32 0 53.5 0 80V240c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48H48zM304 224c-26.5 0-48 21.5-48 48V432c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48H304zM0 400v32c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48V400c0-26.5-21.5-48-48-48H48c-26.5 0-48 21.5-48 48zM304 32c-26.5 0-48 21.5-48 48v32c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48H304z"
	/>
</svg>
