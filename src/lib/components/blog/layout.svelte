<!-- src/lib/components/blog/layout.svelte -->
<!-- <script lang="ts">
	export let title: string = '';
	export let description: string = '';
	export let author: string = '';
	export let date: string = '';
	export let loc: string = '';
	export let lastmod: string = '';
	export let changefreq: string = '';
	export let published: boolean = false;
	export let type: string = '';
	export let blog: string = '';
	export let previewHtml: string = '';
	export let pic: string = '';
</script> -->

<slot />

<!-- </section> -->
<style lang="scss">
	@use '../../../scss/index.scss' as *;
	@use '../../../scss/blog.scss' as *;
</style>
