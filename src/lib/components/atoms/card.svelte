<script lang="ts">
	export let style = '';
	export let className = '';
</script>

<section class=" {className}" {style}>
	<slot />
</section>

<style lang="scss">
	.comment-card {
		padding: 0.5rem;
	}
</style>
