<script lang="ts">
	export let style: string = '';
	export let className: string = '';
</script>

<section {style} class={className}>
	<slot />
</section>

<style lang="scss">
</style>
