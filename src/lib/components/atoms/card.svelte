<script lang="ts">
	export let style: string = '';
	export let className: string = '';
</script>

<section {style} class={className}>
	<slot />
</section>

<style lang="scss">
	section {
		box-sizing: border-box;
		position: relative;

		border-radius: var(--border-radius);
		background: var(--card-background-color);
	}
</style>
