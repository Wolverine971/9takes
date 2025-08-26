<!-- src/routes/blog/+layout.svelte -->
<script lang="ts">
	import '../../app.scss';
</script>

<slot />

<style lang="scss">
	.jumbo-name {
		position: relative;
		font-size: 3.25rem;
		font-weight: 400;
		margin: 1rem;
		color: var(--base-white-outline, var(--white));
		text-align: center;
		text-transform: uppercase;
	}
</style>
